#!/usr/bin/env python3
"""Post-approval capture (TG-2026-000143 approved by the DM): DM 'Approved and Signed' detail, and the
citizen (tgaudit.ch01) post-approval states (dashboard / certificate / track). Normalized, env dev."""
import sys, os, json, re, time, urllib.request
sys.path.insert(0,"/Users/akashk/Documents/Projects/MoSJE/tools/design-audit/engine")
import config as C, capture as CAP
from playwright.sync_api import sync_playwright
cfg,paths=C.load("tg"); WIDTH=cfg["capture"]["width"]; LIVE=paths["captures_live"]; auth=cfg["live"]["auth"]
APP_URL="https://tg-admin-dev.mosje.in/applications/e120e486-5b10-4120-9fb2-6f39b3fe3f68"
INBOX="tgaudit.ch01"; EMAIL=f"{INBOX}@mailinator.com"; CBASE="https://tg-user-dev.mosje.in"
MAPI=f"https://api.mailinator.com/api/v2/domains/public/inboxes/{INBOX}"
def mget(u,t=5):
    for i in range(t):
        try:
            r=urllib.request.Request(u,headers={"User-Agent":"Mozilla/5.0"}); return json.load(urllib.request.urlopen(r,timeout=20))
        except Exception:
            if i==t-1: return None
            time.sleep(3)
def snap(pg,slug,role,route):
    try: pg.evaluate(CAP.UNCLIP_JS); pg.wait_for_timeout(500)
    except Exception: pass
    png=os.path.join(LIVE,f"{slug}.png"); pg.screenshot(path=png,full_page=True); CAP.normalize(png,WIDTH)
    d=pg.evaluate(CAP.EXTRACT_JS); d.update({"role":role,"route":route,"slug":slug,"figmaImg":None,"url":pg.url,"env":"dev"})
    json.dump(d,open(os.path.join(LIVE,f"{slug}.json"),"w"),indent=2); print(f"  cap {slug}: pageH={d['pageH']}",flush=True)
def click_text(pg,texts):
    for t in texts:
        for sel in [f"button:has-text(\"{t}\")",f"a:has-text(\"{t}\")"]:
            el=pg.query_selector(sel)
            if el and el.is_visible():
                try: el.click(timeout=6000); return t
                except Exception: pass
    return None
def citizen_login(pg):
    pg.goto(CBASE+"/auth/sign-in",wait_until="domcontentloaded",timeout=60000); pg.wait_for_timeout(3500)
    pg.query_selector("input[type=email]").fill(EMAIL); pg.wait_for_timeout(400)
    base=set(m["id"] for m in (mget(MAPI) or {}).get("msgs",[]))
    pg.click("button:has-text('Send OTP')"); pg.wait_for_timeout(3500); otp=None; t0=time.time()
    while time.time()-t0<150:
        cur={m["id"]:m for m in (mget(MAPI) or {}).get("msgs",[])}
        fr=[i for i in cur if i not in base and "OTP" in cur[i].get("subject","").upper()]
        if fr:
            md=mget(MAPI+"/messages/"+sorted(fr,key=lambda i:cur[i]['time'])[-1]) or {}
            c=re.findall(r"(?<!\d)(\d{6})(?!\d)","".join(x.get("body","") for x in md.get("parts",[])))
            if c: otp=c[0]; break
        time.sleep(4)
    if not otp: return False
    bx=pg.query_selector_all("input[maxlength='1']")
    for i,ch in enumerate(otp): bx[i].fill(ch)
    pg.wait_for_timeout(500); pg.query_selector("button:has-text('Verify OTP')").click(); pg.wait_for_timeout(6000)
    return "/auth/sign-in" not in pg.url
with sync_playwright() as p:
    b=p.chromium.launch(channel="chrome",headless=True)
    # 1) DM approved detail
    role=next(r for r in cfg["live"]["roles"] if r["name"]=="district-magistrate")
    pg=b.new_context(viewport={"width":WIDTH,"height":1000},device_scale_factor=2).new_page()
    CAP.login_email_otp(pg, role["base"], auth, role["user"], auth["otp"])
    pg.goto(APP_URL,wait_until="networkidle",timeout=45000); pg.wait_for_timeout(3000)
    snap(pg,"DISTRICT-MAGISTRATE-APPLICATION-DETAIL-APPROVED","district-magistrate","/applications/:id")
    pg.context.close()
    # 2) citizen post-approval
    pg2=b.new_context(viewport={"width":WIDTH,"height":1000},device_scale_factor=2).new_page()
    if citizen_login(pg2):
        print("citizen landed",pg2.url,flush=True)
        pg2.goto(CBASE+"/transgender/dashboard",wait_until="networkidle",timeout=40000); pg2.wait_for_timeout(2500)
        snap(pg2,"CITIZEN-CH-DASHBOARD-APPROVED","citizen","/transgender/dashboard")
        if click_text(pg2,["View Details"]):
            pg2.wait_for_timeout(3000); snap(pg2,"CITIZEN-CH-CERTIFICATE-DETAIL","citizen","/transgender/certificate")
        # track/status page
        pg2.goto(CBASE+"/transgender/certificateresume",wait_until="networkidle",timeout=40000); pg2.wait_for_timeout(2500)
        snap(pg2,"CITIZEN-CH-TRACK-APPROVED","citizen","/transgender/certificateresume")
    else:
        print("citizen login FAILED",flush=True)
    pg2.context.close(); b.close()
print("done")
