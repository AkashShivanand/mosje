#!/usr/bin/env python3
"""CITIZEN portal (tg-user-dev) — login (email-only, auto-OTP from Mailinator) then DRIVE the
button/sidebar nav to capture the applicant journey: Dashboard, Certificate/ID (+ View Details),
Grievances, and the Welfare-benefit destinations. Read-only — opens pages, never submits/commits.
Captures as CITIZEN-* (env:'dev'). Reuses the proven login+OTP flow."""
import sys, os, json, re, time, urllib.request
sys.path.insert(0, "/Users/akashk/Documents/Projects/MoSJE/tools/design-audit/engine")
import config as C, capture as CAP
from playwright.sync_api import sync_playwright

cfg, paths = C.load("tg"); WIDTH = cfg["capture"]["width"]; LIVE = paths["captures_live"]
SCRATCH = "/private/tmp/claude-502/-Users-akashk-Documents-Projects-MoSJE/17f86d15-60bb-4d4f-b9de-2e33cc876702/scratchpad"
STATUS = os.path.join(SCRATCH, "citizen_status.txt"); OTP_FILE = os.path.join(SCRATCH, "citizen_otp.txt")
BASE = "https://tg-user-dev.mosje.in"; EMAIL = "anshul@mailinator.com"
MAPI = "https://api.mailinator.com/api/v2/domains/public/inboxes/anshul"

def status(m): open(STATUS,"w").write(m+"\n"); print(m, flush=True)
def mget(url, tries=4):
    for i in range(tries):
        try:
            req=urllib.request.Request(url, headers={"User-Agent":"Mozilla/5.0"}); return json.load(urllib.request.urlopen(req,timeout=20))
        except Exception:
            if i==tries-1: return None
            time.sleep(2)
def snap(pg, slug, route):
    try: pg.evaluate(CAP.UNCLIP_JS); pg.wait_for_timeout(500)
    except Exception: pass
    png=os.path.join(LIVE,f"{slug}.png"); pg.screenshot(path=png, full_page=True); CAP.normalize(png,WIDTH)
    d=pg.evaluate(CAP.EXTRACT_JS); d.update({"role":"citizen","route":route,"slug":slug,"figmaImg":None,"url":pg.url,"env":"dev"})
    json.dump(d, open(os.path.join(LIVE,f"{slug}.json"),"w"), indent=2)
    print(f"  cap {slug}: {len(d['rows'])} rows pageH={d['pageH']} url={pg.url}", flush=True)

def login(pg):
    pg.goto(BASE+"/auth/sign-in", wait_until="domcontentloaded", timeout=60000); pg.wait_for_timeout(4000)
    e=pg.query_selector("input[type='email'],input[name='email']");  e and e.fill(EMAIL); pg.wait_for_timeout(400)
    base_ids=set((mget(MAPI) or {}).get("msgs",[]) and [m["id"] for m in mget(MAPI)["msgs"]] or [])
    base_ids=set(m["id"] for m in (mget(MAPI) or {}).get("msgs",[]))
    try: pg.get_by_role("button", name="Send OTP").click()
    except Exception: pg.click("button:has-text('Send OTP')")
    pg.wait_for_timeout(3500)
    otp=None; t0=time.time()
    while time.time()-t0<240:
        if os.path.exists(OTP_FILE):
            v="".join(c for c in open(OTP_FILE).read().strip() if c.isdigit())
            if len(v)>=4: otp=v; break
        cur={m["id"]:m for m in (mget(MAPI) or {}).get("msgs",[])}
        fresh=[i for i in cur if i not in base_ids and "OTP" in cur[i].get("subject","").upper()]
        if fresh:
            fresh.sort(key=lambda i:cur[i].get("time",0), reverse=True)
            md=mget(MAPI+"/messages/"+fresh[0]) or {}
            body="".join(p.get("body","") for p in md.get("parts",[]))
            c=re.findall(r"(?<!\d)(\d{6})(?!\d)", body)
            if c: otp=c[0]; break
        time.sleep(4)
    if not otp: status("NO_OTP"); return False
    if os.path.exists(OTP_FILE): os.remove(OTP_FILE)
    boxes=pg.query_selector_all("input[maxlength='1']")
    for i,ch in enumerate(otp):
        if i<len(boxes): boxes[i].fill(ch)
    pg.wait_for_timeout(600)
    btn=pg.query_selector("button:has-text('Verify OTP')") or pg.query_selector("button:has-text('Verify')")
    if btn: btn.click()
    pg.wait_for_timeout(6000)
    status(f"login -> {pg.url} (otp {otp})")
    return "/auth/sign-in" not in pg.url

def click_text(pg, texts):
    for t in texts:
        for sel in [f"a:has-text(\"{t}\")", f"button:has-text(\"{t}\")", f"[role=button]:has-text(\"{t}\")"]:
            el=pg.query_selector(sel)
            if el and el.is_visible():
                el.click(); return True
    return False

with sync_playwright() as p:
    b=p.chromium.launch(channel="chrome", headless=True)
    ctx=b.new_context(viewport={"width":WIDTH,"height":1000}, device_scale_factor=2); pg=ctx.new_page()
    if not login(pg): print("LOGIN FAILED"); ctx.close(); b.close(); sys.exit(1)
    pg.goto(BASE+"/transgender/dashboard", wait_until="networkidle", timeout=40000); pg.wait_for_timeout(2000)
    snap(pg,"CITIZEN-DASHBOARD","/transgender/dashboard")
    # certificate detail
    if click_text(pg,["View Details"]):
        pg.wait_for_timeout(3000); snap(pg,"CITIZEN-CERTIFICATE-DETAIL","/transgender/certificate")
    # sidebar items
    for label,slug in [("Certificate/ID","CITIZEN-CERTIFICATE-ID"),("Grievances","CITIZEN-GRIEVANCES")]:
        pg.goto(BASE+"/transgender/dashboard", wait_until="networkidle", timeout=40000); pg.wait_for_timeout(1500)
        if click_text(pg,[label]):
            pg.wait_for_timeout(3000); snap(pg,slug,"/transgender")
    # welfare benefits
    for label,slug in [("Apply Now","CITIZEN-WELFARE-SCHOLARSHIPS"),("Browse Courses","CITIZEN-WELFARE-SKILLTRAINING"),
                       ("Find Homes","CITIZEN-WELFARE-GARIMAGREH"),("Register","CITIZEN-WELFARE-MEDICAL")]:
        pg.goto(BASE+"/transgender/dashboard", wait_until="networkidle", timeout=40000); pg.wait_for_timeout(1500)
        if click_text(pg,[label]):
            pg.wait_for_timeout(3000); snap(pg,slug,"/transgender")
    # enumerate all sidebar/nav hrefs finally
    hrefs=pg.evaluate("()=>[...document.querySelectorAll('a[href^=\"/\"]')].map(a=>a.getAttribute('href')).filter((v,i,s)=>s.indexOf(v)===i)")
    status(f"DONE. nav hrefs seen: {hrefs}")
    ctx.close(); b.close()
