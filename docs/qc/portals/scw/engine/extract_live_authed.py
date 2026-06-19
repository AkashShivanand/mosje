#!/usr/bin/env python3
"""Keep-alive authed live-DOM extractor. Logs in once (headful, manual), then navigates the
SPA IN-APP (sidebar clicks, since deep links bounce) and dumps the same element-spec schema
as extract_live.py per screen. Role: admin runs the full screen sequence; sage/volunteer
just extract the dashboard."""
import json, sys
from playwright.sync_api import sync_playwright
OUT="/Users/akashk/Documents/Projects/MoSJE/docs/qc/portals/scw/engine/live"
EXTRACT_JS=open("extract_live.py").read().split('EXTRACT_JS = r"""')[1].split('"""')[0]
def wait_login(pg,t=300):
    w=0
    while w<t and "/login" in pg.url: pg.wait_for_timeout(2000); w+=2
    pg.wait_for_timeout(2500); print(">>> AUTHED",pg.url,flush=True); return "/login" not in pg.url
def navtext(pg,label):
    els=pg.get_by_text(label,exact=True); 
    for i in range(els.count()):
        try:
            bb=els.nth(i).bounding_box()
            if bb and bb["x"]<290: els.nth(i).click(); pg.wait_for_timeout(2800); return True
        except: pass
    try: els.first.click(); pg.wait_for_timeout(2800); return True
    except: return False
def clicktext(pg,txt):
    try: pg.get_by_text(txt,exact=False).first.click(); pg.wait_for_timeout(2800); return True
    except: return False
def dump(pg,slug):
    pg.wait_for_timeout(600); data=pg.evaluate(EXTRACT_JS)
    json.dump(data,open(f"{OUT}/{slug}.json","w")); print(f"  {slug}: {len(data['rows'])} rows",flush=True)
ROLE=sys.argv[1]
LOGIN={"admin":"https://scw-admin-uat.mosje.in/login"}.get(ROLE,"https://scw-user-uat.mosje.in/login")
with sync_playwright() as p:
    b=p.chromium.launch(headless=False); ctx=b.new_context(viewport={"width":1440,"height":1000},device_scale_factor=1)
    pg=ctx.new_page(); pg.goto(LOGIN,wait_until="domcontentloaded",timeout=60000); pg.wait_for_timeout(3000)
    print(f">>> BROWSER OPEN — log in as {ROLE.upper()}.",flush=True)
    if not wait_login(pg): print("ABORT",flush=True); b.close(); sys.exit()
    if ROLE=="admin":
        navtext(pg,"Dashboard"); dump(pg,"admin-dashboard")
        navtext(pg,"SAGE Applications"); dump(pg,"admin-sage-applications")
        if clicktext(pg,"Review") or clicktext(pg,"View Details"): dump(pg,"admin-sage-detail")
        navtext(pg,"Events"); dump(pg,"admin-events")
        if clicktext(pg,"Add New"): dump(pg,"admin-events-add")
        navtext(pg,"Volunteer"); dump(pg,"admin-volunteers")
        navtext(pg,"IPSrC Homes"); dump(pg,"admin-ipsrc-homes")
    elif ROLE=="sage": dump(pg,"user-sage-dashboard")
    elif ROLE=="volunteer": dump(pg,"user-volunteer-dashboard")
    print(">>> DONE",flush=True); b.close()
