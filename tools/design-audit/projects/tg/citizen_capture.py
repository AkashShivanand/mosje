#!/usr/bin/env python3
"""CITIZEN portal (tg-user-dev) login + capture — EMAIL-ONLY so the OTP lands in the readable
Mailinator inbox. Self-contained: baselines the inbox, fires Send OTP, waits for the NEW OTP email
(id not in baseline) OR a user-supplied code in citizen_otp.txt, enters it (robust box/verify
detection), then crawls + captures citizen screens (CITIZEN-* , env:'dev'). Never fires a 2nd OTP
implicitly; never commits a destructive action. Diag + status to citizen_status.txt."""
import sys, os, json, re, time, urllib.request
sys.path.insert(0, "/Users/akashk/Documents/Projects/MoSJE/tools/design-audit/engine")
import config as C, capture as CAP
from playwright.sync_api import sync_playwright

cfg, paths = C.load("tg")
WIDTH = cfg["capture"]["width"]; LIVE = paths["captures_live"]
SCRATCH = "/private/tmp/claude-502/-Users-akashk-Documents-Projects-MoSJE/17f86d15-60bb-4d4f-b9de-2e33cc876702/scratchpad"
OTP_FILE = os.path.join(SCRATCH, "citizen_otp.txt"); STATUS = os.path.join(SCRATCH, "citizen_status.txt")
BASE = "https://tg-user-dev.mosje.in"; EMAIL = "anshul@mailinator.com"
MAPI = "https://api.mailinator.com/api/v2/domains/public/inboxes/anshul"

def status(m): open(STATUS,"w").write(m+"\n"); print(m, flush=True)
def mget(url, tries=4):
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent":"Mozilla/5.0"})
            return json.load(urllib.request.urlopen(req, timeout=20))
        except Exception as e:
            if i==tries-1: return None
            time.sleep(2)
def inbox_ids():
    d = mget(MAPI) or {}; return {m["id"]:m for m in d.get("msgs",[])}
def otp_from_msg(mid):
    d = mget(MAPI+"/messages/"+mid) or {}
    body = "".join(p.get("body","") for p in d.get("parts",[])) + d.get("subject","")
    c = re.findall(r"(?<!\d)(\d{6})(?!\d)", body); return c[0] if c else None

def snap(pg, slug, route):
    try: pg.evaluate(CAP.UNCLIP_JS); pg.wait_for_timeout(500)
    except Exception: pass
    png = os.path.join(LIVE, f"{slug}.png"); pg.screenshot(path=png, full_page=True); CAP.normalize(png, WIDTH)
    data = pg.evaluate(CAP.EXTRACT_JS)
    data.update({"role":"citizen","route":route,"slug":slug,"figmaImg":None,"url":pg.url,"env":"dev"})
    json.dump(data, open(os.path.join(LIVE, f"{slug}.json"),"w"), indent=2)
    print(f"  cap {slug}: {len(data['rows'])} rows pageH={data['pageH']}", flush=True)

if os.path.exists(OTP_FILE): os.remove(OTP_FILE)
with sync_playwright() as p:
    b = p.chromium.launch(channel="chrome", headless=True)
    ctx = b.new_context(viewport={"width":WIDTH,"height":1000}, device_scale_factor=2); pg = ctx.new_page()
    pg.goto(BASE+"/auth/sign-in", wait_until="domcontentloaded", timeout=60000); pg.wait_for_timeout(4000)
    snap(pg, "CITIZEN-LOGIN", "/auth/sign-in")
    e = pg.query_selector("input[type='email'],input[name='email']")
    if e: e.fill(EMAIL)
    pg.wait_for_timeout(400)
    base_ids = set(inbox_ids().keys())          # baseline BEFORE sending
    try: pg.get_by_role("button", name="Send OTP").click()
    except Exception: pg.click("button:has-text('Send OTP')")
    pg.wait_for_timeout(3500)
    # diag the OTP step
    diag = pg.evaluate(r"""()=>{const vis=el=>{const cs=getComputedStyle(el);const r=el.getBoundingClientRect();return cs.display!=='none'&&r.width>2&&r.height>2};
      return {otpBoxes:[...document.querySelectorAll('input')].filter(vis).filter(i=>i.maxLength===1).length,
        anyInputs:[...document.querySelectorAll('input')].filter(vis).map(i=>({t:i.type,ml:i.maxLength,im:i.getAttribute('inputmode'),ph:i.placeholder})),
        buttons:[...document.querySelectorAll('button')].filter(vis).map(x=>x.innerText.trim()).filter(Boolean)}}""")
    status(f"SEND_OTP done. OTP-step diag: boxes={diag['otpBoxes']} buttons={diag['buttons']}")
    open(os.path.join(SCRATCH,"citizen_diag.json"),"w").write(json.dumps(diag,indent=2))
    # get the fresh OTP: new mailinator email (id not in baseline) OR user file
    otp=None; t0=time.time()
    while time.time()-t0 < 240:
        if os.path.exists(OTP_FILE):
            v="".join(c for c in open(OTP_FILE).read().strip() if c.isdigit())
            if len(v)>=4: otp=v; status(f"OTP from file: {otp}"); break
        cur = inbox_ids()
        fresh=[mid for mid in cur if mid not in base_ids and "OTP" in cur[mid].get("subject","").upper()]
        if fresh:
            fresh.sort(key=lambda mid: cur[mid].get("time",0), reverse=True)
            code = otp_from_msg(fresh[0])
            if code: otp=code; status(f"OTP from fresh Mailinator email: {otp}"); break
        time.sleep(4)
    if not otp: status("NO_OTP — no fresh email arrived and no code supplied"); ctx.close(); b.close(); sys.exit(2)
    # enter OTP
    boxes = pg.query_selector_all("input[maxlength='1']")
    if len(boxes)>=len(otp):
        for i,ch in enumerate(otp): boxes[i].fill(ch)
    else:
        for sel in ["input[name*='otp' i]","input[maxlength='6']","input[inputmode='numeric']","input[type='tel']"]:
            el=pg.query_selector(sel)
            if el: el.fill(otp); break
    pg.wait_for_timeout(700)
    clicked=False
    for name in ["Verify OTP","Verify & Login","Verify","Login","Log In","Sign In","Submit","Continue","Proceed"]:
        btn=pg.query_selector(f"button:has-text('{name}')")
        if btn and btn.is_visible(): btn.click(); clicked=True; break
    if not clicked:
        # press Enter as fallback
        pg.keyboard.press("Enter")
    pg.wait_for_timeout(6000)
    if "/auth/sign-in" in pg.url:
        bad=pg.evaluate("()=>{const t=[...document.querySelectorAll('*')].map(e=>e.innerText||'').join(' ');return (t.match(/invalid otp|incorrect|expired|wrong|required/i)||['still-on-login'])[0]}")
        status(f"LOGIN FAILED ({bad}) url={pg.url}  (otp tried={otp})"); ctx.close(); b.close(); sys.exit(3)
    status(f"LOGGED IN -> {pg.url}  capturing…")
    routes = CAP.discover_routes(pg, cfg)
    land = pg.url.replace(BASE,"").split("?")[0]
    if land and land not in routes: routes.insert(0, land)
    captured=[]
    for path in routes:
        if any(s in path for s in ["/logout","/sign-out","/auth/"]): continue
        slug="CITIZEN-"+(path.strip("/").replace("/","-").upper() or "HOME")
        try: pg.goto(BASE+path, wait_until="networkidle", timeout=40000)
        except Exception:
            try: pg.goto(BASE+path, wait_until="domcontentloaded", timeout=40000)
            except Exception: continue
        pg.wait_for_timeout(1800)
        try: snap(pg, slug, path); captured.append(slug)
        except Exception as ex: print(f"  ! {slug}: {ex}", flush=True)
    status(f"DONE — captured {len(captured)} citizen screens: {captured}")
    ctx.close(); b.close()
