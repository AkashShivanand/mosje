#!/usr/bin/env python3
"""Register a FRESH citizen applicant on tg-user-dev (user-authorized write on dev), selecting a
State/District, verify via Mailinator OTP, then capture the pre-application dashboard and DUMP the
apply-for-certificate flow entry (recon). Does NOT submit yet — prints the flow so we can drive it.
Usage: python3 citizen_register.py <inbox> <FullName> [stateSubstr]"""
import sys, os, json, re, time, urllib.request
sys.path.insert(0, "/Users/akashk/Documents/Projects/MoSJE/tools/design-audit/engine")
import config as C, capture as CAP
from playwright.sync_api import sync_playwright

cfg, paths = C.load("tg"); WIDTH = cfg["capture"]["width"]; LIVE = paths["captures_live"]
SCRATCH = "/private/tmp/claude-502/-Users-akashk-Documents-Projects-MoSJE/17f86d15-60bb-4d4f-b9de-2e33cc876702/scratchpad"
BASE = "https://tg-user-dev.mosje.in"
INBOX = sys.argv[1] if len(sys.argv) > 1 else "tgaudit.s1"
FULL = sys.argv[2] if len(sys.argv) > 2 else "QA Applicant One"
STATE_SUB = sys.argv[3] if len(sys.argv) > 3 else ""     # substring to pick a state; "" = first real option
EMAIL = f"{INBOX}@mailinator.com"; MOBILE = "9" + str(800000000 + (abs(hash(INBOX)) % 89999999))
MAPI = f"https://api.mailinator.com/api/v2/domains/public/inboxes/{INBOX}"
def log(m): print(m, flush=True)
def mget(url, tries=4):
    for i in range(tries):
        try:
            req=urllib.request.Request(url,headers={"User-Agent":"Mozilla/5.0"}); return json.load(urllib.request.urlopen(req,timeout=20))
        except Exception:
            if i==tries-1: return None
            time.sleep(2)
def snap(pg, slug, route):
    try: pg.evaluate(CAP.UNCLIP_JS); pg.wait_for_timeout(500)
    except Exception: pass
    png=os.path.join(LIVE,f"{slug}.png"); pg.screenshot(path=png,full_page=True); CAP.normalize(png,WIDTH)
    d=pg.evaluate(CAP.EXTRACT_JS); d.update({"role":"citizen","route":route,"slug":slug,"figmaImg":None,"url":pg.url,"env":"dev"})
    json.dump(d, open(os.path.join(LIVE,f"{slug}.json"),"w"), indent=2); log(f"  cap {slug}: {len(d['rows'])} rows pageH={d['pageH']}")
DUMP = r"""()=>{const vis=el=>{const cs=getComputedStyle(el);const r=el.getBoundingClientRect();return cs.display!=='none'&&cs.visibility!=='hidden'&&r.width>2&&r.height>2;};
  return {url:location.href,h:[...document.querySelectorAll('h1,h2,h3,h4')].filter(vis).map(e=>e.innerText.trim().slice(0,60)).slice(0,8),
    inputs:[...document.querySelectorAll('input,select,textarea')].filter(vis).map(e=>({t:e.tagName.toLowerCase(),type:e.type,name:e.name,ph:e.placeholder})),
    buttons:[...document.querySelectorAll('button,[role=button],a')].filter(vis).map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(t=>t&&t.length<40)};}"""

with sync_playwright() as p:
    b=p.chromium.launch(channel="chrome",headless=True)
    ctx=b.new_context(viewport={"width":WIDTH,"height":1000}, device_scale_factor=2); pg=ctx.new_page()
    pg.goto(BASE+"/auth/sign-in", wait_until="domcontentloaded", timeout=60000); pg.wait_for_timeout(3500)
    pg.click("button:has-text('Create Account')"); pg.wait_for_timeout(2500)
    snap(pg,"CITIZEN-REGISTER","/auth/sign-in")
    pg.fill("input[name='full_name']", FULL); pg.fill("input[name='email']", EMAIL); pg.fill("input[name='mobile_number']", MOBILE)
    log(f"registering {EMAIL} mobile {MOBILE}")
    # State dropdown (custom): click 'Select state', pick option
    picked_state=None
    try:
        pg.click("button:has-text('Select state')", timeout=4000); pg.wait_for_timeout(900)
        opts=pg.query_selector_all("[role=option], li, .option, [class*=option i]")
        for o in opts:
            t=(o.inner_text() or "").strip()
            if t and t.lower() not in ("select state","") and (not STATE_SUB or STATE_SUB.lower() in t.lower()):
                o.click(); picked_state=t; break
        log(f"state picked: {picked_state}")
    except Exception as e: log(f"state pick err: {str(e)[:60]}")
    pg.wait_for_timeout(1200)
    # District dropdown
    picked_dist=None
    try:
        dd=pg.query_selector("button:has-text('Select district')") or pg.query_selector("button:has-text('Select state first')")
        if dd: dd.click(); pg.wait_for_timeout(900)
        opts=pg.query_selector_all("[role=option], li, .option, [class*=option i]")
        for o in opts:
            t=(o.inner_text() or "").strip()
            if t and "district" not in t.lower() and t.lower()!="select":
                o.click(); picked_dist=t; break
        log(f"district picked: {picked_dist}")
    except Exception as e: log(f"district pick err: {str(e)[:60]}")
    pg.wait_for_timeout(800)
    base_ids=set(m["id"] for m in (mget(MAPI) or {}).get("msgs",[]))
    pg.click("button:has-text('Continue')"); pg.wait_for_timeout(3500)
    log("after Continue: "+json.dumps(pg.evaluate(DUMP))[:400])
    # OTP step (if any)
    boxes=pg.query_selector_all("input[maxlength='1']")
    if boxes:
        otp=None; t0=time.time()
        while time.time()-t0<180:
            cur={m["id"]:m for m in (mget(MAPI) or {}).get("msgs",[])}
            fresh=[i for i in cur if i not in base_ids and "OTP" in cur[i].get("subject","").upper()]
            if fresh:
                fresh.sort(key=lambda i:cur[i].get("time",0),reverse=True)
                md=mget(MAPI+"/messages/"+fresh[0]) or {}; body="".join(x.get("body","") for x in md.get("parts",[]))
                c=re.findall(r"(?<!\d)(\d{6})(?!\d)", body)
                if c: otp=c[0]; break
            time.sleep(4)
        if otp:
            log(f"reg OTP: {otp}")
            boxes=pg.query_selector_all("input[maxlength='1']")
            for i,ch in enumerate(otp):
                if i<len(boxes): boxes[i].fill(ch)
            pg.wait_for_timeout(600)
            for nm in ["Verify OTP","Verify","Create Account","Sign Up","Register","Continue","Submit"]:
                bt=pg.query_selector(f"button:has-text('{nm}')")
                if bt and bt.is_visible(): bt.click(); break
            pg.wait_for_timeout(6000)
        else: log("NO reg OTP received")
    log("LANDED: "+pg.url)
    snap(pg,"CITIZEN-NEW-DASHBOARD","/")
    log("dashboard dump: "+json.dumps(pg.evaluate(DUMP), indent=2))
    ctx.close(); b.close()
