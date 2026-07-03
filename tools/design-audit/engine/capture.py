#!/usr/bin/env python3
"""Config-driven live capture. Per role: ONE keep-alive browser session (log in once,
capture every screen in the same context — sessionStorage-safe), also persisting
storageState for fast re-runs. Per screen: neutralise inner scroll -> full-height
screenshot normalised to the config width, + structured computed-CSS element rows.

Reusable across any project — reads roles/auth/routes from the config only."""
import json, os, subprocess, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import config as C
from playwright.sync_api import sync_playwright

EXTRACT_JS = r"""
() => {
  const px = v => Math.round(parseFloat(v)||0);
  const rows = [];
  const els = document.querySelectorAll('h1,h2,h3,h4,h5,h6,button,a,label,p,span,th,td,input,textarea,select,li,[role=button],[role=tab]');
  for (const el of els) {
    const r = el.getBoundingClientRect();
    if (r.width < 4 || r.height < 4) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) continue;
    let text = '';
    for (const n of el.childNodes) if (n.nodeType === 3) text += n.textContent;
    text = text.replace(/\s+/g,' ').trim();
    const ph = (el.tagName==='INPUT'||el.tagName==='TEXTAREA') ? (el.placeholder||'') : '';
    if (!text && !ph && !['BUTTON','A','INPUT','TEXTAREA','SELECT'].includes(el.tagName)) continue;
    rows.push({
      tag: el.tagName.toLowerCase(), role: el.getAttribute('role') || null,
      text: (text||ph).slice(0,80), isPlaceholder: !text && !!ph,
      x: Math.round(r.left + window.scrollX), y: Math.round(r.top + window.scrollY),
      w: Math.round(r.width), h: Math.round(r.height),
      fontFamily: cs.fontFamily.split(',')[0].replace(/["']/g,''),
      fontSize: px(cs.fontSize), fontWeight: cs.fontWeight,
      lineHeight: cs.lineHeight==='normal'?null:px(cs.lineHeight),
      color: cs.color, bg: cs.backgroundColor, radius: px(cs.borderTopLeftRadius),
      padding: [px(cs.paddingTop),px(cs.paddingRight),px(cs.paddingBottom),px(cs.paddingLeft)],
      borderStyle: cs.borderStyle, borderColor: cs.borderColor,
      dsComponent: el.getAttribute('data-ds-component') || null,
      dsState: el.getAttribute('data-ds-state') || null,
    });
  }
  return { pageW: document.documentElement.scrollWidth,
           pageH: document.documentElement.scrollHeight, rows };
}
"""

# Walk each scroll container AND its ancestors to <html>, forcing reflow to true height,
# so full_page does not clip at the viewport (shells scroll <main>, not the document).
UNCLIP_JS = r"""() => {
  const fix = el => { el.style.setProperty('height','auto','important');
    el.style.setProperty('max-height','none','important');
    el.style.setProperty('overflow','visible','important'); };
  const scr = [];
  document.querySelectorAll('*').forEach(el => {
    const cs = getComputedStyle(el); const oy = cs.overflowY, o = cs.overflow;
    if ((oy==='auto'||oy==='scroll'||o==='auto'||o==='scroll') && el.scrollHeight > el.clientHeight + 40) scr.push(el);
  });
  scr.forEach(s => { let el = s; while (el && el !== document.documentElement) { fix(el); el = el.parentElement; } });
  fix(document.body); fix(document.documentElement);
  return document.documentElement.scrollHeight;
}"""

def slugify(role, path):
    s = (path.strip("/").replace("/", "-") or "home")
    s = "".join(c for c in s if c.isalnum() or c == "-")
    return f"{role}-{s}".upper()

def normalize(png, width):
    subprocess.run(["sips", "--resampleWidth", str(width), png, "--out", png],
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

def login(pg, base, auth, user, pw):
    pg.goto(base + auth.get("loginPath", "/login"), wait_until="domcontentloaded", timeout=60000)
    pg.wait_for_timeout(2500)
    pg.fill(auth["userField"], user)
    pg.fill(auth["passField"], pw)
    (pg.query_selector(auth.get("submit", "button[type=submit]")) or pg.query_selector("button")).click()
    pg.wait_for_timeout(4500)

def discover_routes(pg, cfg):
    hrefs = pg.evaluate("""()=>{const s=new Set();document.querySelectorAll('nav a[href],aside a[href],[class*=sidebar] a[href],[class*=menu] a[href],a[href]').forEach(a=>{const h=a.getAttribute('href');if(h&&h.startsWith('/')&&!h.startsWith('//'))s.add(h.split('?')[0].split('#')[0])});return [...s]}""")
    skip = set(cfg.get("live", {}).get("skipRoutes", []))
    return [h for h in hrefs if h and h not in skip]

def capture_role(pg, role, cfg, paths):
    base = role["base"]; width = cfg.get("capture", {}).get("width", 1440)
    waitms = cfg.get("capture", {}).get("waitMs", 1800)
    routes = discover_routes(pg, cfg)
    land = pg.url.replace(base, "").split("?")[0]
    if land and land not in routes:
        routes.insert(0, land)
    captured = []
    for path in routes:
        slug = slugify(role["name"], path)
        try:
            pg.goto(base + path, wait_until="networkidle", timeout=45000)
        except Exception:
            try: pg.goto(base + path, wait_until="domcontentloaded", timeout=45000)
            except Exception: continue
        pg.wait_for_timeout(waitms)
        try: pg.evaluate(UNCLIP_JS); pg.wait_for_timeout(500)
        except Exception: pass
        png = os.path.join(paths["captures_live"], f"{slug}.png")
        try:
            pg.screenshot(path=png, full_page=True); normalize(png, width)
        except Exception: pass
        try:
            data = pg.evaluate(EXTRACT_JS)
            data["role"] = role["name"]; data["route"] = path; data["slug"] = slug
            data["figmaImg"] = None; data["url"] = base + path
            json.dump(data, open(os.path.join(paths["captures_live"], f"{slug}.json"), "w"), indent=2)
            captured.append({"slug": slug, "role": role["name"], "route": path, "url": base + path,
                             "png": f"captures/live/{slug}.png", "rows": len(data["rows"]), "pageH": data["pageH"]})
            print(f"  ok {slug}: {len(data['rows'])} rows pageH={data['pageH']}", flush=True)
        except Exception as e:
            print(f"  ! {slug} extract failed: {str(e)[:60]}", flush=True)
    return captured

def run(project, only_role=None):
    cfg, paths = C.load(project)
    auth = cfg["live"]["auth"]
    manifest = []
    with sync_playwright() as p:
        b = p.chromium.launch(channel="chrome", headless=True)
        for role in cfg["live"]["roles"]:
            if only_role and role["name"] != only_role:
                continue
            ctx = b.new_context(viewport={"width": cfg["capture"]["width"], "height": 1000},
                                device_scale_factor=cfg["capture"].get("dpr", 2))
            pg = ctx.new_page()
            if role.get("auth") != "none":
                if not role.get("pass"):
                    print(f"[{role['name']}] SKIP — no password (add to secrets.json)", flush=True); ctx.close(); continue
                login(pg, role["base"], auth, role["user"], role["pass"])
                if auth.get("loginMarker", "/login") in pg.url:
                    print(f"[{role['name']}] LOGIN FAILED -> {pg.url} (rate-limit? retry alone)", flush=True); ctx.close(); continue
                try: ctx.storage_state(path=os.path.join(paths["auth"], f"{role['name']}.json"))
                except Exception: pass
                print(f"[{role['name']}] logged in -> {pg.url}", flush=True)
            else:
                pg.goto(role["base"] + "/", wait_until="domcontentloaded", timeout=60000); pg.wait_for_timeout(3000)
                print(f"[{role['name']}] public -> {pg.url}", flush=True)
            manifest += capture_role(pg, role, cfg, paths)
            ctx.close()
        b.close()
    json.dump(manifest, open(os.path.join(paths["captures"], "_captured.json"), "w"), indent=2)
    print(f"CAPTURED {len(manifest)} screens", flush=True)
    return manifest

if __name__ == "__main__":
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument("--project", required=True); ap.add_argument("--role", default=None)
    a = ap.parse_args(); run(a.project, a.role)
