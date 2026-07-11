#!/usr/bin/env python3
"""Capture login sub-states that a plain visit misses: the '⇄ Change' portal-chooser state and,
on the admin portal, each role tab (Citizen / Admin / Garima Greh). Both portals. Normalized 1440
captures + extraction JSON, env:dev. Read-only (no OTP fired)."""
import sys, os, json
sys.path.insert(0, "/Users/akashk/Documents/Projects/MoSJE/tools/design-audit/engine")
import config as C, capture as CAP
from playwright.sync_api import sync_playwright

cfg, paths = C.load("tg"); WIDTH=cfg["capture"]["width"]; LIVE=paths["captures_live"]
def snap(pg,slug,route,role):
    try: pg.evaluate(CAP.UNCLIP_JS); pg.wait_for_timeout(400)
    except Exception: pass
    png=os.path.join(LIVE,f"{slug}.png"); pg.screenshot(path=png,full_page=True); CAP.normalize(png,WIDTH)
    d=pg.evaluate(CAP.EXTRACT_JS); d.update({"role":role,"route":route,"slug":slug,"figmaImg":None,"url":pg.url,"env":"dev"})
    json.dump(d,open(os.path.join(LIVE,f"{slug}.json"),"w"),indent=2); print(f"  cap {slug}: pageH={d['pageH']}",flush=True)
def click_text(pg,texts):
    for t in texts:
        for sel in [f"button:has-text(\"{t}\")",f"[role=button]:has-text(\"{t}\")",f"a:has-text(\"{t}\")"]:
            el=pg.query_selector(sel)
            if el and el.is_visible():
                try: el.click(timeout=5000); return t
                except Exception: pass
    return None

with sync_playwright() as p:
    b=p.chromium.launch(channel="chrome",headless=True)
    # ---- CITIZEN login ----
    pg=b.new_context(viewport={"width":WIDTH,"height":1000},device_scale_factor=2).new_page()
    pg.goto("https://tg-user-dev.mosje.in/auth/sign-in",wait_until="domcontentloaded",timeout=60000); pg.wait_for_timeout(4000)
    snap(pg,"CITIZEN-LOGIN","/auth/sign-in","citizen")   # refresh default (now with co-branding note)
    c=click_text(pg,["Change"]); pg.wait_for_timeout(2000)
    if c: snap(pg,"CITIZEN-LOGIN-CHANGE","/auth/sign-in#change","citizen")
    print("citizen change:",c)
    pg.context.close()
    # ---- ADMIN login ----
    pg2=b.new_context(viewport={"width":WIDTH,"height":1000},device_scale_factor=2).new_page()
    pg2.goto("https://tg-admin-dev.mosje.in/login",wait_until="domcontentloaded",timeout=60000); pg2.wait_for_timeout(4000)
    snap(pg2,"ADMIN-LOGIN","/login","admin")
    # role tabs
    for tab,slug in [("Citizen","ADMIN-LOGIN-TAB-CITIZEN"),("Garima Greh","ADMIN-LOGIN-TAB-GARIMAGREH"),("Admin","ADMIN-LOGIN-TAB-ADMIN")]:
        if click_text(pg2,[tab]): pg2.wait_for_timeout(1200); snap(pg2,slug,"/login","admin")
    # change state
    c2=click_text(pg2,["Change"]); pg2.wait_for_timeout(2000)
    if c2: snap(pg2,"ADMIN-LOGIN-CHANGE","/login#change","admin")
    print("admin change:",c2)
    pg2.context.close()
    b.close()
print("done")
