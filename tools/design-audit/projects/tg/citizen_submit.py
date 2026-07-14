#!/usr/bin/env python3
"""Complete + SUBMIT a manual TG certificate application (user-authorized write on dev) for a
freshly-registered citizen, to reach the 'submitted' state (and seed a pending case for the admin
queue). Logs in, drives to the manual identity form, fills text + custom dropdowns + DOB, uploads
dummy proof docs, and submits. Captures Basic/Documents/Review/Confirmation. Usage:
python3 citizen_submit.py <inbox> <TAG> [stateOption]"""
import sys, os, json, re, time, urllib.request
sys.path.insert(0, "/Users/akashk/Documents/Projects/MoSJE/tools/design-audit/engine")
import config as C, capture as CAP
from playwright.sync_api import sync_playwright

cfg, paths = C.load("tg"); WIDTH=cfg["capture"]["width"]; LIVE=paths["captures_live"]
FIX=os.path.join(paths["project"],"fixtures")
INBOX=sys.argv[1] if len(sys.argv)>1 else "tgaudit.mh01"
TAG=sys.argv[2] if len(sys.argv)>2 else "MH"
STATE_OPT=sys.argv[3] if len(sys.argv)>3 else "Maharashtra"
BASE="https://tg-user-dev.mosje.in"; EMAIL=f"{INBOX}@mailinator.com"
MAPI=f"https://api.mailinator.com/api/v2/domains/public/inboxes/{INBOX}"
def log(m): print(m, flush=True)
def mget(url,tries=4):
    for i in range(tries):
        try:
            req=urllib.request.Request(url,headers={"User-Agent":"Mozilla/5.0"}); return json.load(urllib.request.urlopen(req,timeout=20))
        except Exception:
            if i==tries-1: return None
            time.sleep(2)
def snap(pg,slug,route):
    try: pg.evaluate(CAP.UNCLIP_JS); pg.wait_for_timeout(500)
    except Exception: pass
    png=os.path.join(LIVE,f"{slug}.png"); pg.screenshot(path=png,full_page=True); CAP.normalize(png,WIDTH)
    d=pg.evaluate(CAP.EXTRACT_JS); d.update({"role":"citizen","route":route,"slug":slug,"figmaImg":None,"url":pg.url,"env":"dev"})
    json.dump(d,open(os.path.join(LIVE,f"{slug}.json"),"w"),indent=2); log(f"  cap {slug}: pageH={d['pageH']}")
def login(pg):
    pg.goto(BASE+"/auth/sign-in",wait_until="domcontentloaded",timeout=60000); pg.wait_for_timeout(3500)
    e=pg.query_selector("input[type='email'],input[name='email']"); e and e.fill(EMAIL); pg.wait_for_timeout(400)
    base=set(m["id"] for m in (mget(MAPI) or {}).get("msgs",[]))
    try: pg.get_by_role("button",name="Send OTP").click()
    except Exception: pg.click("button:has-text('Send OTP')")
    pg.wait_for_timeout(3500); otp=None; t0=time.time()
    while time.time()-t0<180:
        cur={m["id"]:m for m in (mget(MAPI) or {}).get("msgs",[])}
        fr=[i for i in cur if i not in base and "OTP" in cur[i].get("subject","").upper()]
        if fr:
            fr.sort(key=lambda i:cur[i].get("time",0),reverse=True); md=mget(MAPI+"/messages/"+fr[0]) or {}
            c=re.findall(r"(?<!\d)(\d{6})(?!\d)", "".join(x.get("body","") for x in md.get("parts",[])))
            if c: otp=c[0]; break
        time.sleep(4)
    if not otp: return False
    bx=pg.query_selector_all("input[maxlength='1']")
    for i,ch in enumerate(otp):
        if i<len(bx): bx[i].fill(ch)
    pg.wait_for_timeout(600)
    (pg.query_selector("button:has-text('Verify OTP')") or pg.query_selector("button:has-text('Verify')")).click()
    pg.wait_for_timeout(6000); log(f"[{TAG}] login otp {otp} -> {pg.url}"); return "/auth/sign-in" not in pg.url
def click_any(pg,texts):
    for t in texts:
        for sel in [f"button:has-text('{t}')",f"a:has-text('{t}')"]:
            el=pg.query_selector(sel)
            if el and el.is_visible() and el.is_enabled():
                try: el.click(timeout=6000); return t
                except Exception: pass
    return None
def pick_dd(pg, placeholder, option=None):
    """Custom combobox: click the trigger's clickable ancestor, then select via portal option
    click (broad net incl. body portals) or keyboard (type + ArrowDown + Enter) fallback."""
    try:
        span=pg.get_by_text(placeholder, exact=True).first
        if span.count()==0: log(f"  dd '{placeholder}' trigger not found"); return None
        span.scroll_into_view_if_needed(); span.click(timeout=5000); pg.wait_for_timeout(800)
    except Exception as e: log(f"  dd trig '{placeholder}' err {str(e)[:40]}"); return None
    # broad option net (portal-rendered listbox anywhere in the doc)
    opts=pg.query_selector_all("[role=option],li[role=option],[role=listbox] [role=option],[role=listbox] li,li,[class*=option i],[class*=menu i] div,[class*=dropdown i] li")
    vis=[o for o in opts if o.is_visible() and (o.inner_text() or '').strip() and not (o.inner_text() or '').strip().startswith('Select')]
    tgt=None
    if option:
        for o in vis:
            if option.lower() in (o.inner_text() or '').lower(): tgt=o; break
    if not tgt and vis: tgt=vis[0]
    if tgt:
        txt=(tgt.inner_text() or '').strip()[:24]
        try: tgt.click(); log(f"  dd '{placeholder}' -> {txt} (click)"); pg.wait_for_timeout(600); return txt
        except Exception: pass
    # keyboard fallback
    try:
        if option: pg.keyboard.type(option); pg.wait_for_timeout(500)
        pg.keyboard.press("ArrowDown"); pg.wait_for_timeout(250); pg.keyboard.press("Enter"); pg.wait_for_timeout(500)
        log(f"  dd '{placeholder}' -> keyboard-select"); return "kbd"
    except Exception as e: log(f"  dd '{placeholder}' NO OPTIONS+kbd fail {str(e)[:30]}")
    return None
def fill_ph(pg, placeholder, val):
    try:
        loc=pg.get_by_placeholder(placeholder, exact=False).first
        if loc.count()>0: loc.fill(val); return True
    except Exception as e: log(f"  fill '{placeholder[:20]}' err {str(e)[:40]}")
    return False

with sync_playwright() as p:
    b=p.chromium.launch(channel="chrome",headless=True)
    ctx=b.new_context(viewport={"width":WIDTH,"height":1000},device_scale_factor=2); pg=ctx.new_page()
    if not login(pg): log("LOGIN FAILED"); ctx.close(); b.close(); sys.exit(1)
    # Resume a saved draft directly by URL (Basic Details persist server-side); else start fresh.
    pg.goto(BASE+"/manual-form/identity",wait_until="networkidle",timeout=40000); pg.wait_for_timeout(2500)
    if "/manual-form" not in pg.url:
        pg.goto(BASE+"/transgender/dashboard",wait_until="networkidle",timeout=40000); pg.wait_for_timeout(1500)
        click_any(pg,["Resume Application","Start Application","Apply for Certificate","Apply Now"]); pg.wait_for_timeout(3000)
    # STEP1 type
    if "/digi-locker" in pg.url or pg.query_selector("text=How would you like to proceed"):
        try: pg.get_by_text("New Transgender Certificate",exact=False).first.click(timeout=5000)
        except Exception: pass
        pg.wait_for_timeout(800); click_any(pg,["Continue with Selection","Continue"]); pg.wait_for_timeout(3000)
    # STEP2 entry method -> manual
    if "/details" in pg.url or pg.query_selector("text=How would you like to enter"):
        click_any(pg,["Enter details manually","Continue without DigiLocker","Fill Manually"]); pg.wait_for_timeout(900)
        click_any(pg,["Continue"]); pg.wait_for_timeout(3000)
    # STEP3 manual-form/entry intro
    if "/manual-form/entry" in pg.url:
        click_any(pg,["Continue","Proceed","Next"]); pg.wait_for_timeout(3000)
    log(f"[{TAG}] at form: {pg.url}")
    PDF=os.path.join(FIX,"dummy-proof.pdf"); PNG=os.path.join(FIX,"dummy-photo.png")

    # ---- PHASE: Basic Identity ----
    if "/manual-form/identity" in pg.url:
        snap(pg,f"CITIZEN-{TAG}-APPLY-IDENTITY-BLANK","/manual-form/identity")
        fill_ph(pg,"Enter the name you want to be addressed by","Anshu QA")
        d=pg.query_selector("input[type=date]")
        if d:
            try: d.fill("2000-01-01")
            except Exception: d.click(); pg.keyboard.type("01/01/2000")
        fill_ph(pg,"Father, Mother, or Guardian's Name","Guardian QA")
        fill_ph(pg,"Enter 10-digit number","9800000001")
        fill_ph(pg,"e.g., name@example.com",EMAIL)
        for el in pg.query_selector_all("input[placeholder='6-digit Pincode']"):
            try: el.fill("400001")
            except Exception: pass
        for el in pg.query_selector_all("textarea[placeholder='House No, Street, Locality']"):
            try: el.fill("1 QA Street, Test Locality")
            except Exception: pass
        click_any(pg,["Yes"]); pg.wait_for_timeout(500)   # correspondence same as permanent
        pick_dd(pg,"Select Preference","")        # Name to Print
        pick_dd(pg,"Select Preference","")        # Gender at birth
        pick_dd(pg,"Select Qualification","")
        pick_dd(pg,"Select Category","")
        pick_dd(pg,"Select Income Range","")
        pick_dd(pg,"Select State",STATE_OPT); pg.wait_for_timeout(800)
        pick_dd(pg,"Select District",""); pg.wait_for_timeout(800)
        snap(pg,f"CITIZEN-{TAG}-APPLY-IDENTITY-FILLED","/manual-form/identity")
        remain=pg.evaluate(r"""()=>[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&/^(Select Preference|Select Qualification|Select Category|Select Income Range|Select State|Select District)$/.test((e.innerText||'').trim())).map(e=>e.innerText.trim())""")
        log(f"[{TAG}] remaining placeholders: {remain}")
        adv=click_any(pg,["Save and Continue","Save & Continue","Continue","Next"])
        log(f"[{TAG}] basic-details advance: {adv}"); pg.wait_for_timeout(4000)

    # ---- PHASE: Documents (ID-proof type dropdown + 4 typed uploads) ----
    if "/manual-form/documents" not in pg.url and "/manual-form/review" not in pg.url:
        pg.goto(BASE+"/manual-form/documents", wait_until="networkidle", timeout=40000); pg.wait_for_timeout(2500)
    if "/manual-form/documents" in pg.url or pg.query_selector("input[type=file]"):
        snap(pg,f"CITIZEN-{TAG}-APPLY-DOCUMENTS","/manual-form/documents")
        pick_dd(pg,"Select ID Proof Document",""); pg.wait_for_timeout(600)
        fis=pg.query_selector_all("input[type=file]")
        # visual order: ID Proof(pdf), Passport Photo(jpg), Signature(png), Affidavit(pdf-only)
        JPG=os.path.join(FIX,"dummy-photo.jpg"); SIGN=os.path.join(FIX,"dummy-sign.png"); AFF=os.path.join(FIX,"dummy-affidavit.pdf")
        types=[PDF,JPG,SIGN,AFF]
        for i,fi in enumerate(fis):
            try: fi.set_input_files(types[i] if i<len(types) else PDF); log(f"  uploaded slot{i}: {os.path.basename(types[i] if i<len(types) else PDF)}")
            except Exception as e: log(f"  upload slot{i} err {str(e)[:40]}")
        pg.wait_for_timeout(2500)
        snap(pg,f"CITIZEN-{TAG}-APPLY-DOCUMENTS-FILLED","/manual-form/documents")
        adv=click_any(pg,["Save and Review","Save and Continue","Continue","Next","Review"])
        log(f"[{TAG}] docs advance click: {adv}")
        # wait (uploads commit async) for navigation to review; retry the click once
        for _ in range(20):
            pg.wait_for_timeout(1000)
            if "/manual-form/documents" not in pg.url: break
        if "/manual-form/documents" in pg.url:
            err=pg.evaluate("()=>{const t=[...document.querySelectorAll('*')].map(e=>e.innerText||'').join(' ');const m=t.match(/(please upload|invalid|required|too large|valid [a-z]+)[^.]{0,40}/i);return m?m[0]:''}")
            log(f"[{TAG}] docs still stuck; hint: {err!r}; re-clicking")
            click_any(pg,["Save and Review","Save and Continue","Continue"])
            for _ in range(15):
                pg.wait_for_timeout(1000)
                if "/manual-form/documents" not in pg.url: break
        log(f"[{TAG}] after docs -> {pg.url}")

    # ---- PHASE: Review + Submit (resume path bypasses the docs->review client wall) ----
    if "/manual-form/review" not in pg.url:
        pg.goto(BASE+"/manual-form/review", wait_until="networkidle", timeout=40000); pg.wait_for_timeout(2500)
    if "/manual-form/review" in pg.url:
        snap(pg,f"CITIZEN-{TAG}-APPLY-REVIEW","/manual-form/review")
        # accept declaration — native + custom control, via JS (click checkbox, its label, and siblings)
        try:
            pg.evaluate(r"""()=>{
              document.querySelectorAll('input[type=checkbox]').forEach(c=>{ if(!c.checked) c.click(); });
              document.querySelectorAll('[role=checkbox]').forEach(c=>{ if(c.getAttribute('aria-checked')!=='true') c.click(); });
              const el=[...document.querySelectorAll('label,span,div,p')].find(e=>/I have read and accept/i.test((e.textContent||''))&&(e.textContent||'').length<80);
              if(el){ const box=el.previousElementSibling||el.querySelector('input,[role=checkbox],span,button'); (box||el).click(); el.click(); }
            }""")
        except Exception as e: log(f"[{TAG}] decl js err {str(e)[:40]}")
        pg.wait_for_timeout(800)
        sb=pg.query_selector("button:has-text('Submit Application')")
        log(f"[{TAG}] submit enabled after declaration: {sb.is_enabled() if sb else None}")
        sub=click_any(pg,["Submit Application","Confirm & Submit","Submit","Confirm","Agree & Submit"])
        log(f"[{TAG}] SUBMIT click: {sub}")
        for _ in range(12):
            pg.wait_for_timeout(1000)
            if "/manual-form/review" not in pg.url: break
        snap(pg,f"CITIZEN-{TAG}-APPLY-CONFIRMATION","/manual-form/success")
        ref=pg.evaluate(r"""()=>{const m=(document.body.innerText||'').match(/TG-\d{4}-\d{4,}/);return m?m[0]:''}""")
        log(f"[{TAG}] submitted ref: {ref!r}")
    log(f"[{TAG}] final url {pg.url}")
    log(f"[{TAG}] final url {pg.url}")
    ctx.close(); b.close()
