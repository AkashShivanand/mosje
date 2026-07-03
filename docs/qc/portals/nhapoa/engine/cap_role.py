#!/usr/bin/env python3
"""Capture every reachable screen for ONE role of the NHAPOA estate.

Logs in (if --user given), discovers same-origin routes from the nav/sidebar,
then for each route: full-page screenshot @dpr2 -> normalised to 1440-wide PNG,
plus a structured element-row extraction (the BUILD ground truth the geometry
engine diffs against). One keep-alive browser session per role (sessionStorage-safe).

Usage:
  python3 cap_role.py --base https://nhapoa-admin-uat.mosje.in --user ba.districtofficer \
      --pw NHAPOA@123 --prefix DO --out captures/live
  python3 cap_role.py --base https://nhapoa-user-uat.mosje.in --prefix CITIZEN --out captures/live
"""
import json, os, argparse, subprocess, time
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
    });
  }
  return { pageW: document.documentElement.scrollWidth,
           pageH: document.documentElement.scrollHeight, rows };
}
"""

def slugify(path):
    s = path.strip("/").replace("/", "-") or "home"
    return "".join(c for c in s if c.isalnum() or c == "-").upper()

def normalize_1440(png):
    subprocess.run(["sips", "--resampleWidth", "1440", png, "--out", png],
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", required=True)
    ap.add_argument("--user"); ap.add_argument("--pw")
    ap.add_argument("--prefix", required=True)
    ap.add_argument("--out", default="captures/live")
    ap.add_argument("--extra", default="", help="comma-separated extra routes to force-capture")
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)
    manifest = []
    with sync_playwright() as p:
        b = p.chromium.launch(channel="chrome", headless=True)
        ctx = b.new_context(viewport={"width": 1440, "height": 1000}, device_scale_factor=2)
        pg = ctx.new_page()
        if a.user:
            pg.goto(a.base + "/login", wait_until="domcontentloaded", timeout=60000)
            pg.wait_for_timeout(2500)
            pg.fill("input[name='user_name']", a.user)
            pg.fill("input[name='password']", a.pw)
            (pg.query_selector("button[type='submit']") or pg.query_selector("button")).click()
            pg.wait_for_timeout(4500)
            print(f"[{a.prefix}] logged in -> {pg.url}", flush=True)
        else:
            pg.goto(a.base + "/", wait_until="domcontentloaded", timeout=60000)
            pg.wait_for_timeout(3000)
        # discover same-origin routes from nav
        hrefs = pg.evaluate("""()=>{const s=new Set();document.querySelectorAll('nav a[href],aside a[href],[class*=sidebar] a[href],[class*=menu] a[href],a[href]').forEach(a=>{const h=a.getAttribute('href');if(h&&h.startsWith('/')&&!h.startsWith('//'))s.add(h.split('?')[0].split('#')[0])});return [...s]}""")
        skip = {"/login", "/logout", "/terms-and-conditions", "/privacy-policy", ""}
        routes = [h for h in hrefs if h not in skip]
        for e in [x for x in a.extra.split(",") if x]:
            if e not in routes: routes.append(e)
        # ensure landing route captured
        land = pg.url.replace(a.base, "").split("?")[0]
        if land and land not in routes: routes.insert(0, land)
        print(f"[{a.prefix}] {len(routes)} routes: {routes}", flush=True)
        for path in routes:
            slug = f"{a.prefix}-{slugify(path)}"
            try:
                pg.goto(a.base + path, wait_until="networkidle", timeout=45000)
            except Exception:
                try: pg.goto(a.base + path, wait_until="domcontentloaded", timeout=45000)
                except Exception as e:
                    print(f"  ! {slug} goto failed: {str(e)[:60]}", flush=True); continue
            pg.wait_for_timeout(1800)
            # Neutralise inner scroll containers so the document reflows to TRUE content
            # height (these shells scroll <main>, not the document -> full_page clips at 1000px).
            real_h = pg.evaluate(r"""() => {
              const fix = el => { el.style.setProperty('height','auto','important');
                el.style.setProperty('max-height','none','important');
                el.style.setProperty('overflow','visible','important'); };
              const scrollers = [];
              document.querySelectorAll('*').forEach(el => {
                const cs = getComputedStyle(el); const oy = cs.overflowY, o = cs.overflow;
                if ((oy==='auto'||oy==='scroll'||o==='auto'||o==='scroll') && el.scrollHeight > el.clientHeight + 40)
                  scrollers.push(el);
              });
              // expand each scroller AND every ancestor up to <html> (the shell is 100vh/hidden)
              scrollers.forEach(s => { let el = s; while (el && el !== document.documentElement) { fix(el); el = el.parentElement; } });
              fix(document.body); fix(document.documentElement);
              return document.documentElement.scrollHeight;
            }""")
            pg.wait_for_timeout(600)
            png = os.path.join(a.out, f"{slug}.png")
            try:
                pg.screenshot(path=png, full_page=True)
                normalize_1440(png)
            except Exception as e:
                print(f"  ! {slug} shot failed: {str(e)[:60]}", flush=True)
            try:
                data = pg.evaluate(EXTRACT_JS)
                json.dump(data, open(os.path.join(a.out, f"{slug}.json"), "w"), indent=2)
                manifest.append({"slug": slug, "route": path, "rows": len(data["rows"]), "pageH": data["pageH"]})
                print(f"  ok {slug}: {len(data['rows'])} rows pageH={data['pageH']}", flush=True)
            except Exception as e:
                print(f"  ! {slug} extract failed: {str(e)[:60]}", flush=True)
        b.close()
    json.dump(manifest, open(os.path.join(a.out, f"_manifest-{a.prefix}.json"), "w"), indent=2)
    print(f"[{a.prefix}] DONE {len(manifest)} screens", flush=True)

if __name__ == "__main__":
    main()
