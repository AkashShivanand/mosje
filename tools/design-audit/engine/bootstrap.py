#!/usr/bin/env python3
"""Zero-manual-files onboarding. Turns a plain request into a ready project:
writes audit.config.json + secrets.json (gitignored) and AUTO-DETECTS the login
form selectors by visiting the live login page — so nobody hand-writes config or CSS.

Example (the agent fills these from what the user says in chat):
  python3 engine/bootstrap.py --name nhapoa --portal "NHAPOA (UAT)" --idprefix NHA \
    --figma "https://www.figma.com/design/KEY/Name?node-id=5093-18512" \
    --public https://nhapoa-user-uat.mosje.in \
    --admin  https://nhapoa-admin-uat.mosje.in \
    --role "district-officer=ba.districtofficer:NHAPOA@123" \
    --role "sho=westdeopur_ps1:NHAPOA@123"
"""
import argparse, json, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import config as C

def parse_figma(url):
    m = re.search(r"/design/([^/]+)/", url or "")
    key = m.group(1) if m else ""
    n = re.search(r"node-id=([0-9]+)-([0-9]+)", url or "")
    node = f"{n.group(1)}:{n.group(2)}" if n else "0:0"
    tmpl = re.sub(r"node-id=[0-9]+-[0-9]+", "node-id={node}", url) if n else url
    return key, node, tmpl

def detect_login(admin_base, login_path="/login"):
    """Visit the login page and guess user/pass/submit selectors. Returns a dict or defaults."""
    default = {"type": "form", "loginPath": login_path, "userField": "input[type='text']",
               "passField": "input[type='password']", "submit": "button[type='submit']",
               "loginMarker": login_path}
    try:
        from playwright.sync_api import sync_playwright
        with sync_playwright() as p:
            b = p.chromium.launch(channel="chrome", headless=True)
            pg = b.new_context().new_page()
            pg.goto(admin_base + login_path, wait_until="domcontentloaded", timeout=45000)
            pg.wait_for_timeout(2500)
            info = pg.evaluate("""()=>{
              const u=document.querySelector("input[name*='user' i],input[type='text'],input[type='email']");
              const p=document.querySelector("input[type='password']");
              const s=document.querySelector("button[type='submit']")||[...document.querySelectorAll('button')].find(b=>/sign in|log ?in|login/i.test(b.innerText));
              const sel=e=>!e?null:(e.name?`${e.tagName.toLowerCase()}[name='${e.name}']`:(e.id?`#${e.id}`:e.tagName.toLowerCase()+(e.type?`[type='${e.type}']`:'')));
              return {user:sel(u),pass:sel(p),submit:s&&(s.type?`button[type='${s.type}']`:'button')};
            }""")
            b.close()
        if info.get("user"): default["userField"] = info["user"]
        if info.get("pass"): default["passField"] = info["pass"]
        if info.get("submit"): default["submit"] = info["submit"]
        print(f"  detected login: user={default['userField']} pass={default['passField']} submit={default['submit']}")
    except Exception as e:
        print(f"  login auto-detect failed ({str(e)[:50]}); using generic selectors — adjust in config if login fails")
    return default

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--name", required=True)
    ap.add_argument("--portal", required=True)
    ap.add_argument("--idprefix", default="AUD")
    ap.add_argument("--figma", default="")
    ap.add_argument("--public", default=None, help="base URL for the public/no-login site")
    ap.add_argument("--admin", default=None, help="base URL for the authenticated site")
    ap.add_argument("--login-path", default="/login")
    ap.add_argument("--role", action="append", default=[], help="name=user:password (repeatable)")
    ap.add_argument("--baseline", default="derived", choices=["tokens", "derived", "internal"])
    a = ap.parse_args()

    pdir = C.project_dir(a.name)
    os.makedirs(os.path.join(pdir, "inputs"), exist_ok=True)
    key, node, tmpl = parse_figma(a.figma)
    auth = detect_login(a.admin, a.login_path) if a.admin else {
        "type": "form", "loginPath": a.login_path, "userField": "input[type='text']",
        "passField": "input[type='password']", "submit": "button[type='submit']", "loginMarker": a.login_path}

    roles = []; secrets = {"_note": "gitignored — passwords keyed by role name"}
    if a.public:
        roles.append({"name": "public", "base": a.public, "auth": "none"})
    for spec in a.role:
        name, _, rest = spec.partition("="); user, _, pw = rest.partition(":")
        roles.append({"name": name.strip(), "base": a.admin or a.public, "user": user.strip()})
        if pw: secrets[name.strip()] = pw

    cfg = {
        "project": a.name, "portal": a.portal, "idPrefix": a.idprefix,
        "figma": {"fileKey": key, "rootNode": node, "framesFile": "inputs/figma-frames.json",
                  "tokensFile": "inputs/tokens.json", "urlTemplate": tmpl},
        "capture": {"width": 1440, "dpr": 2, "waitMs": 1800},
        "live": {"auth": auth, "roles": roles,
                 "skipRoutes": ["/login", "/logout", "/terms-and-conditions", "/privacy-policy"]},
        "baseline": {"mode": a.baseline, "source": "inputs/tokens.json"},
        "manifest": "screen-manifest.yaml",
        "notes": "Passwords live in secrets.json (gitignored). Auto-generated by bootstrap.py."}
    json.dump(cfg, open(os.path.join(pdir, "audit.config.json"), "w"), indent=2)
    if len(secrets) > 1:
        json.dump(secrets, open(os.path.join(pdir, "secrets.json"), "w"), indent=2)
    print(f"created projects/{a.name}/audit.config.json  ({len(roles)} roles)")
    print(f"created projects/{a.name}/secrets.json  ({len(secrets)-1} passwords)" if len(secrets) > 1 else "no passwords (public-only)")
    print("NEXT: agent dumps Figma via MCP into inputs/, then: python3 engine/run.py --project %s --phase all" % a.name)

def seed_manifest(project):
    """Write a starter screen-manifest.yaml from whatever has already been captured.

    Authoring one from nothing is the main adoption cost, so give the user a file that already
    lists their screens and only needs volatiles and flows added by hand.
    """
    import json as _json
    pdir = C.project_dir(project)
    path = os.path.join(pdir, "screen-manifest.yaml")
    if os.path.exists(path):
        print(f"screen-manifest.yaml already exists at {path} — not overwriting")
        return path
    mpath = os.path.join(pdir, "captures", "_captured.json")
    rows = _json.load(open(mpath)) if os.path.exists(mpath) else []
    lines = ["version: 1", "environment: uat  # dev | uat | prod", "stalenessCeiling: 14d", "",
             "volatile:", "  # Content that changes on every load. Without these, dashboards look",
             "  # dirty on every run and the per-screen freshness tier stops meaning anything.",
             "  - pattern: '\\b\\d{2}/\\d{2}/\\d{4}\\b'", "",
             "fixtures: {}", "", "screens:"]
    for r in rows:
        lines += [f"  - slug: {r.get('slug')}", f"    route: {r.get('route')}",
                  f"    roles: [{r.get('role')}]"]
    lines += ["", "flows: []  # add wizards, modals and validation states here", ""]
    with open(path, "w") as fh:
        fh.write("\n".join(lines))
    print(f"seeded {path} with {len(rows)} screens")
    return path


if __name__ == "__main__":
    main()
