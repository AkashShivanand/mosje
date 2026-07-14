#!/usr/bin/env python3
"""Capture the DM's Approve / Request-Correction / Reject modals (OPEN state) for the actionable
application TG-2026-000143, normalized into the pipeline. Opens each modal, snaps, then Cancels —
never commits a decision."""
import sys, os, json
sys.path.insert(0,"/Users/akashk/Documents/Projects/MoSJE/tools/design-audit/engine")
import config as C, capture as CAP
from playwright.sync_api import sync_playwright
cfg,paths=C.load("tg"); WIDTH=cfg["capture"]["width"]; LIVE=paths["captures_live"]
auth=cfg["live"]["auth"]
APP_URL="https://tg-admin-dev.mosje.in/applications/e120e486-5b10-4120-9fb2-6f39b3fe3f68"
role=next(r for r in cfg["live"]["roles"] if r["name"]=="district-magistrate")
def snap(pg,slug):
    png=os.path.join(LIVE,f"{slug}.png"); pg.screenshot(path=png,full_page=True); CAP.normalize(png,WIDTH)
    d=pg.evaluate(CAP.EXTRACT_JS); d.update({"role":"district-magistrate","route":"/applications/:id","slug":slug,"figmaImg":None,"url":pg.url,"env":"dev"})
    json.dump(d,open(os.path.join(LIVE,f"{slug}.json"),"w"),indent=2); print(f"  cap {slug}: rows={len(d['rows'])}",flush=True)
with sync_playwright() as p:
    b=p.chromium.launch(channel="chrome",headless=True)
    ctx=b.new_context(viewport={"width":WIDTH,"height":1000},device_scale_factor=2); pg=ctx.new_page()
    CAP.login_email_otp(pg, role["base"], auth, role["user"], auth["otp"])
    print("landed",pg.url,flush=True)
    pg.goto(APP_URL, wait_until="networkidle", timeout=45000)
    pg.wait_for_timeout(3000)
    for label,slug in [("Request Correction","DISTRICT-MAGISTRATE-MODAL-CORRECTION"),
                       ("Approve","DISTRICT-MAGISTRATE-MODAL-APPROVE"),
                       ("Reject","DISTRICT-MAGISTRATE-MODAL-REJECT")]:
        try:
            pg.get_by_role("button",name=label,exact=True).first.click(timeout=6000)
            pg.wait_for_timeout(1800)
            snap(pg,slug)
            # close: click Cancel, else Escape
            closed=False
            for c in ["Cancel"]:
                bt=pg.query_selector(f"button:has-text('{c}')")
                if bt and bt.is_visible(): bt.click(); closed=True; break
            if not closed: pg.keyboard.press("Escape")
            pg.wait_for_timeout(1200)
            print("modal ok:",label,flush=True)
        except Exception as e:
            print("modal ERR",label,str(e)[:60],flush=True)
    ctx.close(); b.close()
print("done")
