#!/usr/bin/env python3
"""NMBA interactive capture driver — the states a declarative route-crawl cannot reach.

The engine's crawl only follows sidebar <a href>. That misses:
  * collapsible sidebar submenus (NMBA hides the whole NAPDDR Three-Tier Committee flow behind a
    "NAPDDR Three-Tier Committee ▸" toggle, so none of its routes appear until it is clicked),
  * modals / side sheets opened by a button (Add User, Add Document, Add Event),
  * tab and language switches (General Pledge / Recovered Drug User, English / हिंदी),
  * multi-step forms, which must be FILLED to show anything past step 1,
  * the GIGW accessibility widget panel.

Safety rules (from references/audit-rules.md), enforced here:
  * never click a control that fires a real OTP/SMS  -> OTP_BUTTONS are never pressed;
  * never commit a write or a destructive action     -> SUBMIT/DELETE labels are never pressed;
    forms are filled and captured, then abandoned;
  * modals are opened, captured, then dismissed with Escape/Cancel.

Every shot reuses the engine's settle_height + verified `shoot`, so each PNG is exactly as tall as
the page it measured (the capture-height gate).
"""
import json, os, sys

ENGINE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "engine")
sys.path.insert(0, os.path.abspath(ENGINE))
import config as C
from capture import (UNCLIP_JS, EXTRACT_JS, settle_height, shoot, png_height_1440,
                     login, DEFICIT_JS)
from playwright.sync_api import sync_playwright

PROJECT = "nmba"
DUMMY = {
    "full_name": "Test Volunteer", "name": "Test Volunteer",
    "email": "qa.dummy@example.com", "mobile_number": "9000000001",
    "highest_qualification": "Graduate", "organisation_name": "QA Test Organisation",
    "postal_address": "1 Test Road, Test Nagar", "pincode": "110001",
    "captcha_answer": "12", "YYYY": "1995", "MM": "06", "DD": "15",
    "title": "QA Test Entry", "description": "Dummy data captured for design QC.",
}
# Never pressed.
FORBIDDEN = ("send otp", "verify", "submit", "delete", "remove", "deactivate", "logout",
             "sign out", "save", "update", "approve", "reject", "confirm", "export")


def fill_form(pg):
    """Fill every visible input/select/textarea with plausible dummy data. Returns count filled."""
    return pg.evaluate("""(D)=>{
      let n=0;
      const vis = el => { const r=el.getBoundingClientRect(); const cs=getComputedStyle(el);
        return r.width>2 && r.height>2 && cs.visibility!=='hidden' && cs.display!=='none'; };
      document.querySelectorAll('input,textarea,select').forEach(el=>{
        if(!vis(el) || el.disabled || el.readOnly) return;
        const key = (el.name||el.id||el.placeholder||'').trim();
        const t = (el.type||'').toLowerCase();
        if(t==='hidden') return;
        if(el.tagName==='SELECT'){
          const opts=[...el.options].filter(o=>o.value && !/^\\s*$/.test(o.value));
          if(opts.length){ el.value=opts[0].value; el.dispatchEvent(new Event('change',{bubbles:true})); n++; }
          return;
        }
        if(t==='checkbox'||t==='radio'){ return; }         // leave consent boxes alone
        if(t==='file'){ return; }                           // sandbox cannot attach files
        let v = D[key];
        if(v===undefined){
          if(t==='email') v='qa.dummy@example.com';
          else if(t==='tel') v='9000000001';
          else if(t==='number') v='12';
          else if(t==='date') v='2026-06-15';
          else if(/pin/i.test(key)) v='110001';
          else if(/mobile|phone/i.test(key)) v='9000000001';
          else v='QA test data';
        }
        const proto = el.tagName==='TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
        const setter = Object.getOwnPropertyDescriptor(proto,'value').set;
        setter.call(el, v);                                 // React-safe value set
        el.dispatchEvent(new Event('input',{bubbles:true}));
        el.dispatchEvent(new Event('change',{bubbles:true}));
        n++;
      });
      return n;
    }""", DUMMY)


def click_text(pg, label, exact=False):
    """Click a button/tab by visible text. Refuses anything on the FORBIDDEN list."""
    low = label.strip().lower()
    if any(f in low for f in FORBIDDEN):
        return False
    for sel in (f'button:has-text("{label}")', f'[role=tab]:has-text("{label}")',
                f'[role=button]:has-text("{label}")', f'a:has-text("{label}")'):
        try:
            el = pg.locator(sel).first
            if el.count() == 0:
                continue
            el.click(timeout=4000)
            pg.wait_for_timeout(1200)
            return True
        except Exception:
            continue
    return False


def grab(pg, paths, slug, role, route, url, cfg, note=""):
    """Settle -> verified screenshot -> extract, with the height assertion the engine uses."""
    width = cfg["capture"]["width"]; dpr = cfg["capture"].get("dpr", 2)
    h = settle_height(pg, UNCLIP_JS, width=width, base_h=1000)
    png = os.path.join(paths["captures_live"], f"{slug}.png")
    try:
        shoot(pg, png, h, dpr, width)
    except Exception as e:
        print(f"  ! {slug} shot failed: {str(e)[:60]}", flush=True); return None
    data = pg.evaluate(EXTRACT_JS)
    data.update({"role": role, "route": route, "slug": slug, "figmaImg": None,
                 "url": url, "note": note, "interactive": True})
    json.dump(data, open(os.path.join(paths["captures_live"], f"{slug}.json"), "w"), indent=2)
    ph = png_height_1440(png, width)
    ok = ph and abs(ph - data["pageH"]) <= 40
    print(f"  {'ok' if ok else '!!'} {slug}: pageH={data['pageH']} png={ph}"
          f"{'' if ok else '  <-- HEIGHT MISMATCH'}  {note}", flush=True)
    return {"slug": slug, "role": role, "route": route, "url": url,
            "png": f"captures/live/{slug}.png", "rows": len(data["rows"]),
            "pageH": data["pageH"], "pngH": ph, "interactive": True, "note": note}


def expand_sidebar(pg):
    """Click every collapsible sidebar group so hidden sub-routes become visible.
    Returns the hrefs revealed. NMBA hides the entire NAPDDR committee flow this way."""
    before = set(pg.evaluate("()=>[...document.querySelectorAll('a[href^=\"/\"]')].map(a=>a.getAttribute('href'))"))
    # The group headers are NOT <button>s in NMBA — they are plain divs/spans inside the <aside>,
    # so a button:has-text() selector silently matches nothing and the whole NAPDDR flow (4 routes)
    # stays invisible. Match by TEXT instead, and read the labels out of the sidebar itself.
    toggles = pg.evaluate("""()=>{
      const aside = document.querySelector('aside,[class*=sidebar],nav');
      if(!aside) return [];
      return [...new Set([...aside.querySelectorAll('*')]
        .filter(e=>e.children.length<=2)
        .map(e=>(e.innerText||'').replace(/\\s+/g,' ').trim())
        .filter(t=>t && t.length<60 && /[▸▾▶►]|Committee|Resources|Manage Content|Help & Support/i.test(t)))];
    }""")
    for t in dict.fromkeys(toggles):
        try:
            pg.get_by_text(t, exact=False).first.click(timeout=3000)
            pg.wait_for_timeout(900)
        except Exception:
            pass
    after = set(pg.evaluate("()=>[...document.querySelectorAll('a[href^=\"/\"]')].map(a=>a.getAttribute('href'))"))
    return sorted(x for x in (after - before) if x and not x.startswith("//"))


# ---------------------------------------------------------------- flow definitions
# (route, [steps]) — each step = (action, arg, slug-suffix, note)
#   nav   : go to route            fill : fill every field with dummy data
#   click : press a labelled control (refused if destructive)
#   esc   : dismiss a modal
PUBLIC_FLOWS = [
    ("/epledge", [
        ("click", "हिंदी",                "OATH-HI",       "Oath — Hindi language state"),
        ("click", "English",              "OATH-EN",       "Oath — English (default)"),
        ("click", "Recovered Drug User",  "TAB-RECOVERED", "Pledge type tab — Recovered Drug User"),
        ("click", "General Pledge",       "TAB-GENERAL",   "Pledge type tab — General Pledge"),
        ("click", "I Take this Pledge",   "STEP2-DETAILS", "Step 2 — enter details (empty)"),
        ("fill",  None,                   "STEP2-FILLED",  "Step 2 — filled with dummy data"),
    ]),
    ("/feedback", [
        ("fill",  None,                   "FORM-FILLED",   "Feedback form filled with dummy data"),
        ("click", "Very Satisfied",       "RATING-CHOSEN", "Satisfaction rating selected"),
    ]),
    ("/nasha-mukti-mitr", [
        ("fill",  None,                   "FORM-FILLED",   "Volunteer registration filled with dummy data"),
    ]),
    ("/activities", [
        ("click", "View Facility Map",    "FACILITY-MAP",  "Facility map view"),
    ]),
    ("/", [
        ("click", "Open the accessibility option", "A11Y-PANEL", "GIGW accessibility widget panel open"),
    ]),
]

ADMIN_FLOWS = [
    ("/user-management",       [("click", "Add User",       "ADD-USER-MODAL",  "Add User modal"), ("esc", None, None, None)]),
    ("/important-documents",   [("click", "Add Document",   "ADD-DOC-MODAL",   "Add Document modal"), ("esc", None, None, None)]),
    ("/state-district-dashboard", [("click", "Add Event",   "ADD-EVENT-MODAL", "Add Event modal"), ("esc", None, None, None)]),
]

LOGIN_SHOTS = [
    ("https://nmba-admin-dev.mosje.in/login", "LOGIN-ADMIN-PORTAL", "Admin/officer portal sign-in"),
    ("https://nmba-user-dev.mosje.in/login",  "LOGIN-CITIZEN",      "Citizen (Nasha Mukti Mitr) sign-in"),
]


def run_flow(pg, base, role, flows, cfg, paths, out):
    for route, steps in flows:
        try:
            pg.set_viewport_size({"width": cfg["capture"]["width"], "height": 1000})
            pg.goto(base + route, wait_until="networkidle", timeout=45000)
            pg.wait_for_timeout(1800)
        except Exception:
            continue
        for action, arg, suffix, note in steps:
            try:
                if action == "fill":
                    n = fill_form(pg); pg.wait_for_timeout(900)
                    if not n: continue
                elif action == "click":
                    if not click_text(pg, arg): continue
                elif action == "esc":
                    pg.keyboard.press("Escape"); pg.wait_for_timeout(700); continue
                seg = (route.strip("/").replace("/", "-") or "home").upper()
                slug = f"{role}-{seg}-{suffix}".upper()
                r = grab(pg, paths, slug, role, route, base + route, cfg, note)
                if r: out.append(r)
            except Exception as e:
                print(f"  ! {route} [{action} {arg}]: {str(e)[:70]}", flush=True)


def main():
    cfg, paths = C.load(PROJECT)
    auth = cfg["live"]["auth"]
    sec = json.load(open(os.path.join(paths["project"], "secrets.json")))
    out = []
    with sync_playwright() as p:
        b = p.chromium.launch(channel="chrome", headless=True)

        # ---- login screens (the crawl skips /login by design) ----
        ctx = b.new_context(viewport={"width": cfg["capture"]["width"], "height": 1000},
                            device_scale_factor=cfg["capture"].get("dpr", 2))
        pg = ctx.new_page()
        for url, slug, note in LOGIN_SHOTS:
            try:
                pg.set_viewport_size({"width": cfg["capture"]["width"], "height": 1000})
                pg.goto(url, wait_until="networkidle", timeout=45000); pg.wait_for_timeout(2200)
                r = grab(pg, paths, slug, "auth", "/login", url, cfg, note)
                if r: out.append(r)
            except Exception as e:
                print(f"  ! {slug}: {str(e)[:70]}", flush=True)
        ctx.close()

        # ---- public interactive flows ----
        ctx = b.new_context(viewport={"width": cfg["capture"]["width"], "height": 1000},
                            device_scale_factor=cfg["capture"].get("dpr", 2))
        pg = ctx.new_page()
        pub = next(r for r in cfg["live"]["roles"] if r["name"] == "public")
        print("[public] interactive flows", flush=True)
        run_flow(pg, pub["base"], "public", PUBLIC_FLOWS, cfg, paths, out)
        ctx.close()

        # ---- authenticated roles: expand hidden sidebar groups, then drive modals ----
        for role in cfg["live"]["roles"]:
            if role.get("auth") == "none":
                continue
            ctx = b.new_context(viewport={"width": cfg["capture"]["width"], "height": 1000},
                                device_scale_factor=cfg["capture"].get("dpr", 2))
            pg = ctx.new_page()
            try:
                login(pg, role["base"], auth, role["user"], sec[role["name"]])
                if auth.get("loginMarker", "/login") in pg.url:
                    print(f"[{role['name']}] LOGIN FAILED", flush=True); ctx.close(); continue
                print(f"[{role['name']}] logged in -> {pg.url}", flush=True)

                revealed = expand_sidebar(pg)
                print(f"[{role['name']}] sidebar revealed {len(revealed)} hidden route(s): {revealed}", flush=True)
                r = grab(pg, paths, f"{role['name']}-SIDEBAR-EXPANDED".upper(), role["name"],
                         "/", pg.url, cfg, "Sidebar with all collapsible groups expanded")
                if r: out.append(r)
                for route in revealed:
                    try:
                        pg.set_viewport_size({"width": cfg["capture"]["width"], "height": 1000})
                        pg.goto(role["base"] + route, wait_until="networkidle", timeout=45000)
                        pg.wait_for_timeout(1800)
                        seg = (route.strip("/").replace("/", "-") or "home").upper()
                        rr = grab(pg, paths, f"{role['name']}-{seg}".upper(), role["name"], route,
                                  role["base"] + route, cfg, "Reached only via collapsible sidebar group")
                        if rr: out.append(rr)
                    except Exception as e:
                        print(f"  ! {route}: {str(e)[:70]}", flush=True)
                if role["name"] == "admin":
                    run_flow(pg, role["base"], role["name"], ADMIN_FLOWS, cfg, paths, out)
            except Exception as e:
                print(f"[{role['name']}] ABORTED: {str(e)[:110]}", flush=True)
            ctx.close()
        b.close()

    fp = os.path.join(paths["captures"], "_captured_flows.json")
    json.dump(out, open(fp, "w"), indent=2)
    bad = [x for x in out if x.get("pngH") and abs(x["pngH"] - x["pageH"]) > 40]
    print(f"\nFLOW CAPTURES: {len(out)}   height-mismatches: {len(bad)}", flush=True)


if __name__ == "__main__":
    main()
