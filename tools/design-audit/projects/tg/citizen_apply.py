#!/usr/bin/env python3
"""Log in as a freshly-registered citizen (email-only + Mailinator OTP) and DRIVE the
apply-for-certificate flow, capturing + dumping each step (recon + capture). Prefers the manual /
non-DigiLocker path with dummy data. Stops + reports at any hard gate (DigiLocker/Aadhaar/upload).
Usage: python3 citizen_apply.py <inbox> <TAG>   e.g. tgaudit.mh01 MH"""
import sys, os, json, re, time, urllib.request
sys.path.insert(0, "/Users/akashk/Documents/Projects/MoSJE/tools/design-audit/engine")
import config as C, capture as CAP
from playwright.sync_api import sync_playwright

cfg, paths = C.load("tg"); WIDTH=cfg["capture"]["width"]; LIVE=paths["captures_live"]
INBOX=sys.argv[1] if len(sys.argv)>1 else "tgaudit.mh01"
TAG=sys.argv[2] if len(sys.argv)>2 else "MH"
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
    json.dump(d,open(os.path.join(LIVE,f"{slug}.json"),"w"),indent=2); log(f"  cap {slug}: {len(d['rows'])} rows pageH={d['pageH']}")
DUMP=r"""()=>{const vis=el=>{const cs=getComputedStyle(el);const r=el.getBoundingClientRect();return cs.display!=='none'&&cs.visibility!=='hidden'&&r.width>2&&r.height>2;};
  return {url:location.href,h:[...document.querySelectorAll('h1,h2,h3,h4')].filter(vis).map(e=>e.innerText.trim().slice(0,70)).slice(0,10),
    inputs:[...document.querySelectorAll('input,select,textarea')].filter(vis).map(e=>({t:e.tagName.toLowerCase(),type:e.type,name:e.name,ph:e.placeholder})).slice(0,25),
    buttons:[...document.querySelectorAll('button,[role=button],a')].filter(vis).map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(t=>t&&t.length<45).slice(0,30)};}"""
def login(pg):
    pg.goto(BASE+"/auth/sign-in",wait_until="domcontentloaded",timeout=60000); pg.wait_for_timeout(3500)
    e=pg.query_selector("input[type='email'],input[name='email']"); e and e.fill(EMAIL); pg.wait_for_timeout(400)
    base=set(m["id"] for m in (mget(MAPI) or {}).get("msgs",[]))
    try: pg.get_by_role("button",name="Send OTP").click()
    except Exception: pg.click("button:has-text('Send OTP')")
    pg.wait_for_timeout(3500)
    otp=None;t0=time.time()
    while time.time()-t0<180:
        cur={m["id"]:m for m in (mget(MAPI) or {}).get("msgs",[])}
        fr=[i for i in cur if i not in base and "OTP" in cur[i].get("subject","").upper()]
        if fr:
            fr.sort(key=lambda i:cur[i].get("time",0),reverse=True); md=mget(MAPI+"/messages/"+fr[0]) or {}
            body="".join(x.get("body","") for x in md.get("parts",[])); c=re.findall(r"(?<!\d)(\d{6})(?!\d)",body)
            if c: otp=c[0]; break
        time.sleep(4)
    if not otp: return False
    log(f"[{TAG}] login OTP {otp}")
    bx=pg.query_selector_all("input[maxlength='1']")
    for i,ch in enumerate(otp):
        if i<len(bx): bx[i].fill(ch)
    pg.wait_for_timeout(600)
    bt=pg.query_selector("button:has-text('Verify OTP')") or pg.query_selector("button:has-text('Verify')")
    bt and bt.click(); pg.wait_for_timeout(6000)
    return "/auth/sign-in" not in pg.url
def click_any(pg, texts):
    for t in texts:
        for sel in [f"button:has-text('{t}')", f"a:has-text('{t}')"]:
            el=pg.query_selector(sel)
            if el and el.is_visible() and el.is_enabled():
                try: el.click(timeout=6000); return t
                except Exception: pass
    return None

def select_option(pg, prefer=None):
    """On a choice screen, select a radio/card. Prefer a card whose text matches `prefer`."""
    for t in (prefer or []):
        try:
            loc=pg.get_by_text(t, exact=False).first
            if loc.count()>0: loc.click(timeout=5000); return t
        except Exception: pass
    for sel in ["input[type=radio]","[role=radio]"]:
        el=pg.query_selector(sel)
        if el and el.is_visible():
            try: el.click(); return sel
            except Exception: pass
    return None

with sync_playwright() as p:
    b=p.chromium.launch(channel="chrome",headless=True)
    ctx=b.new_context(viewport={"width":WIDTH,"height":1000},device_scale_factor=2); pg=ctx.new_page()
    if not login(pg): log(f"[{TAG}] LOGIN FAILED"); ctx.close(); b.close(); sys.exit(1)
    log(f"[{TAG}] landed {pg.url}")
    pg.wait_for_timeout(1500)
    snap(pg,f"CITIZEN-{TAG}-DASHBOARD-PREAPP","/")
    log(f"[{TAG}] dashboard: "+json.dumps(pg.evaluate(DUMP)))
    # enter apply flow
    entry=click_any(pg,["Resume Application","Continue Application","Apply for Certificate","Apply Now","Apply for New Certificate","Start Application","New Application","Apply"])
    log(f"[{TAG}] apply entry click: {entry}")
    pg.wait_for_timeout(3500)
    last_sig=None; repeats=0
    # walk up to ~10 steps, dumping + capturing; prefer manual path; stop at hard gate or a stuck screen
    for step in range(1,11):
        d=pg.evaluate(DUMP)
        sig=d.get("url","")+"|"+"|".join(d.get("h",[]))
        if sig==last_sig:
            repeats+=1
            if repeats>=2: log(f"[{TAG}] stuck on same screen — stopping"); break
        else: repeats=0
        last_sig=sig
        log(f"[{TAG}] STEP{step} {json.dumps(d)[:520]}")
        snap(pg,f"CITIZEN-{TAG}-APPLY-STEP{step}", "/apply")
        # if this step offers a manual/DigiLocker choice, SELECT manual (then fall through to advance)
        m=click_any(pg,["Continue without DigiLocker","Enter details manually","Fill Manually","Skip DigiLocker","Enter Manually"])
        if m: log(f"[{TAG}] selected manual: {m}"); pg.wait_for_timeout(1000)
        # fill any visible text inputs with dummy data
        try:
            pg.evaluate(r"""()=>{const dv={text:'Test',tel:'9800000000',number:'12',email:'x@x.com',date:'2000-01-01'};
              document.querySelectorAll('input:not([type=radio]):not([type=checkbox]):not([maxlength="1"]),textarea').forEach(i=>{
                if(!i.value){const t=i.type||'text'; i.focus(); i.value=(dv[t]||'Test'); i.dispatchEvent(new Event('input',{bubbles:true})); i.dispatchEvent(new Event('change',{bubbles:true}));}});}""")
        except Exception: pass
        pg.wait_for_timeout(500)
        ADV=["Next","Continue with Selection","Save & Continue","Continue","Proceed","Submit Application","Submit","Review","Confirm"]
        nxt=click_any(pg,ADV)
        if not nxt:  # advance disabled/absent -> likely a choice screen; select preferred option then retry
            sel=select_option(pg, prefer=["New Transgender Certificate","New Transgender","Continue without DigiLocker","Fill Manually"])
            log(f"[{TAG}] selected option: {sel}"); pg.wait_for_timeout(1000)
            nxt=click_any(pg,ADV)
        log(f"[{TAG}] STEP{step} advance: {nxt}")
        if not nxt: log(f"[{TAG}] no advance control — stopping"); break
        pg.wait_for_timeout(3500)
        if "digilocker" in (pg.url.lower()) or "aadhaar" in json.dumps(pg.evaluate(DUMP)).lower():
            log(f"[{TAG}] hit DigiLocker/Aadhaar gate at step{step}"); break
    log(f"[{TAG}] final url {pg.url}")
    ctx.close(); b.close()
