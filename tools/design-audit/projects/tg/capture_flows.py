#!/usr/bin/env python3
"""TG interactive sub-state capture (project driver — the engine's declarative route-crawl can't
reach button-driven states). ENV-AWARE: `python3 capture_flows.py [dev|uat] [role...]`.

Per admin role (keep-alive login): capture the DASHBOARD, open an application DETAIL via the queue's
'View' (+ its Documents tab), scan queue rows for an application that is ACTIONABLE for this role, and
open any Approve/Correction/Reject modal to capture its OPEN state then Escape (NEVER commit). Outputs
land in captures/live[-uat]/ in the engine's JSON+PNG format with an `env` tag on every JSON so the
report can badge DEV vs UAT. Unreproducible states are reported (deferred), never faked."""
import sys, os, json
sys.path.insert(0, "/Users/akashk/Documents/Projects/MoSJE/tools/design-audit/engine")
import config as C, capture as CAP
from playwright.sync_api import sync_playwright

cfg, paths = C.load("tg")
auth = cfg["live"]["auth"]
WIDTH = cfg["capture"]["width"]
ACTION_WORDS = ("approve","reject","correction","recommend","forward","request correction",
                "sign","issue","escalate","return","send back","query","verify & ","not recommend")

ENV = sys.argv[1] if len(sys.argv) > 1 and sys.argv[1] in ("dev","uat") else "dev"
def base_for(role):
    b = role["base"]
    return b.replace("-dev.", "-uat.") if ENV == "uat" else b
LIVE = os.path.join(paths["captures"], "live-uat" if ENV == "uat" else "live")
os.makedirs(LIVE, exist_ok=True)

def snap(pg, slug, role, route):
    try: pg.evaluate(CAP.UNCLIP_JS); pg.wait_for_timeout(500)
    except Exception: pass
    png = os.path.join(LIVE, f"{slug}.png")
    pg.screenshot(path=png, full_page=True); CAP.normalize(png, WIDTH)
    data = pg.evaluate(CAP.EXTRACT_JS)
    data.update({"role": role, "route": route, "slug": slug, "figmaImg": None, "url": pg.url, "env": ENV})
    json.dump(data, open(os.path.join(LIVE, f"{slug}.json"), "w"), indent=2)
    print(f"  cap {slug}: {len(data['rows'])} rows pageH={data['pageH']}", flush=True)

def all_buttons(pg):
    return pg.evaluate("""()=>[...document.querySelectorAll('button')].filter(b=>{const cs=getComputedStyle(b);const r=b.getBoundingClientRect();return cs.display!=='none'&&r.width>2&&r.height>2}).map(b=>b.innerText.replace(/\\s+/g,' ').trim()).filter(Boolean)""")

def open_first_detail(pg, base):
    pg.goto(base+"/dashboard", wait_until="networkidle", timeout=45000); pg.wait_for_timeout(2500)
    el = pg.query_selector("a:has-text('View'),button:has-text('View')")
    if el: el.click(); pg.wait_for_timeout(3500); return True
    return False

def find_actionable(pg, base, limit=15):
    pg.goto(base+"/dashboard", wait_until="networkidle", timeout=45000); pg.wait_for_timeout(2000)
    n = len(pg.query_selector_all("table tbody tr"))
    for i in range(min(limit, n)):
        rows = pg.query_selector_all("table tbody tr")
        if i >= len(rows): break
        v = rows[i].query_selector("a:has-text('View'),button:has-text('View')")
        if not v: continue
        v.click(); pg.wait_for_timeout(3000)
        actions = [b for b in all_buttons(pg) if any(w in b.lower() for w in ACTION_WORDS)]
        if actions:
            return pg.url, actions
        pg.go_back(wait_until="networkidle"); pg.wait_for_timeout(1500)
    return None, []

def run_role(rolename):
    role = next(r for r in cfg["live"]["roles"] if r["name"] == rolename)
    base = base_for(role)
    rep = {"env": ENV, "role": rolename, "dashboard": False, "detail": False, "documents": False,
           "actionable": None, "modals": []}
    with sync_playwright() as p:
        b = p.chromium.launch(channel="chrome", headless=True)
        ctx = b.new_context(viewport={"width":WIDTH,"height":1000}, device_scale_factor=2)
        pg = ctx.new_page()
        CAP.login_email_otp(pg, base, auth, role["user"], auth["otp"])
        if auth["loginMarker"] in pg.url:
            print(f"[{ENV}/{rolename}] LOGIN FAILED"); ctx.close(); b.close(); return rep
        print(f"[{ENV}/{rolename}] logged in", flush=True)
        pg.goto(base+"/dashboard", wait_until="networkidle", timeout=45000); pg.wait_for_timeout(2500)
        snap(pg, f"{rolename.upper()}-DASHBOARD", rolename, "/dashboard"); rep["dashboard"] = True
        if open_first_detail(pg, base):
            rep["detail"] = True
            snap(pg, f"{rolename.upper()}-APPLICATION-DETAIL", rolename, "/application-detail")
            doc = pg.query_selector("button:has-text('Documents')")
            if doc:
                doc.click(); pg.wait_for_timeout(1800)
                snap(pg, f"{rolename.upper()}-APPLICATION-DOCUMENTS", rolename, "/application-documents")
                rep["documents"] = True
        url, actions = find_actionable(pg, base)
        rep["actionable"] = {"url": url, "actions": actions} if actions else None
        if actions:
            snap(pg, f"{rolename.upper()}-APPLICATION-DETAIL-ACTIONABLE", rolename, "/application-detail")
            for label in actions:
                try:
                    pg.get_by_role("button", name=label, exact=False).first.click(); pg.wait_for_timeout(1800)
                    if pg.evaluate("()=>!!document.querySelector('[role=dialog],[class*=modal i],[class*=Dialog i]')"):
                        aslug = "".join(c for c in label.upper() if c.isalnum() or c==' ').strip().replace(' ','-')
                        snap(pg, f"{rolename.upper()}-MODAL-{aslug}", rolename, "/application-detail")
                        rep["modals"].append(label)
                    pg.keyboard.press("Escape"); pg.wait_for_timeout(900)
                except Exception as e:
                    rep["modals"].append(f"{label}:ERR {str(e)[:40]}")
        ctx.close(); b.close()
    return rep

if __name__ == "__main__":
    roles_arg = [a for a in sys.argv[2:]] or ["central-admin", "examining-officer", "district-magistrate"]
    report = [run_role(r) for r in roles_arg]
    json.dump(report, open(os.path.join(paths["captures"], f"_flows_report_{ENV}.json"), "w"), indent=2)
    print(f"\n=== FLOWS REPORT ({ENV}) ===")
    print(json.dumps(report, indent=2))
