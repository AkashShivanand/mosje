#!/usr/bin/env python3
"""Config-driven live capture. Per role: ONE keep-alive browser session (log in once,
capture every screen in the same context — sessionStorage-safe), also persisting
storageState for fast re-runs. Per screen: neutralise inner scroll -> full-height
screenshot normalised to the config width, + structured computed-CSS element rows.

Reusable across any project — reads roles/auth/routes from the config only."""
import json, os, struct, subprocess, sys
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

# Walk each CLIPPING container AND its ancestors to <html>, forcing reflow to true height,
# so full_page does not clip at the viewport (shells scroll <main>, not the document).
# NOTE: 'hidden'/'clip' count as clipping too — an `h-screen overflow-hidden` shell pins the
# document at exactly the viewport height and is invisible to an auto|scroll-only detector
# (symptom: every page reports pageH == viewport height, e.g. 1000).
UNCLIP_JS = r"""() => {
  const fix = el => { el.style.setProperty('height','auto','important');
    el.style.setProperty('max-height','none','important');
    el.style.setProperty('overflow','visible','important'); };
  const CLIP = new Set(['auto','scroll','hidden','clip']);
  const scr = [];
  document.querySelectorAll('*').forEach(el => {
    const cs = getComputedStyle(el);
    if ((CLIP.has(cs.overflowY) || CLIP.has(cs.overflow)) && el.scrollHeight > el.clientHeight + 40) scr.push(el);
  });
  scr.forEach(s => { let el = s; while (el && el !== document.documentElement) { fix(el); el = el.parentElement; } });
  fix(document.body); fix(document.documentElement);
  return document.documentElement.scrollHeight;
}"""

# Chrome cannot rasterise a screenshot taller than ~16384 DEVICE px; beyond that it silently
# clips, yielding a PNG shorter than the page (below-fold pins then fall off the image).
MAX_DEVICE_PX = 16000

# Deficit of INNER scrollers only — how much taller the window must be for a fixed/flex app
# shell to reveal all of its content. Deliberately EXCLUDES document-level overflow: a page
# that scrolls the document is already handled by full_page, and counting it here would grow
# the window enormously for no benefit (and blow the screenshot texture cap).
# NOTE: do NOT gate on overflow being auto|scroll — the unclip pass has already rewritten those
# to `visible`, so that signal is gone by the time we measure.
DEFICIT_JS = r"""() => {
  let d = 0;
  const root = document.documentElement, body = document.body;
  document.querySelectorAll('*').forEach(el => {
    if (el === root || el === body) return;
    if (el.clientHeight > 200 && el.scrollHeight > el.clientHeight + 4)
      d = Math.max(d, el.scrollHeight - el.clientHeight);
  });
  return d;
}"""

# Some directory/feed pages lazy-render more rows as the viewport grows, so the deficit never
# reaches zero. Cap the window and REPORT the truncation — a silently cropped capture reads as
# "we saw the whole page" when we did not.
MAX_VIEWPORT_H = 6000

def settle_height(pg, unclip_js, width=1440, base_h=1000, rounds=5):
    """Reveal a page's full content, then return the height the screenshot will have.

    Two shell styles need different treatment:
      * document-scrolling pages -> the CSS unclip is enough;
      * `position:fixed` / flex app shells (sidebar + inner <main> scroller) -> the document
        can NEVER grow, so CSS surgery fails. Instead GROW THE VIEWPORT until the inner
        scroller has no deficit. This keeps the build's own layout intact, which matters:
        rewriting position/flex to force a tall document would distort the very geometry the
        audit measures.
    Repeats until stable so lazy/virtualised content is fully rendered.
    """
    h = base_h
    prev = -1
    last_doc = -1
    for _ in range(rounds):
        try: pg.evaluate(unclip_js)
        except Exception: pass
        pg.wait_for_timeout(350)
        try:
            # Scrolling to the bottom and back forces lazy/virtualised content to render.
            pg.evaluate("()=>window.scrollTo(0, document.documentElement.scrollHeight)")
            pg.wait_for_timeout(400)
            pg.evaluate("()=>window.scrollTo(0,0)")
            pg.wait_for_timeout(250)
            deficit = pg.evaluate(DEFICIT_JS)
            doc = pg.evaluate("()=>document.documentElement.scrollHeight")
        except Exception:
            break
        # Require TWO agreeing readings: a page whose content lazy-loads keeps growing after the
        # first measurement, so breaking on the first quiet deficit screenshots a short page and
        # then extracts a taller one (PNG shorter than pageH — every derived crop/pin then wrong).
        if deficit <= 4 and doc == last_doc:
            break
        last_doc = doc
        if deficit > 4:
            h = min(h + deficit + 8, MAX_VIEWPORT_H)
            pg.set_viewport_size({"width": width, "height": h})
            pg.wait_for_timeout(500)
            if h == prev or h >= MAX_VIEWPORT_H:
                break
            prev = h
    try:
        return pg.evaluate("()=>Math.max(document.documentElement.scrollHeight, window.innerHeight)")
    except Exception:
        return h

def _stitch(pg, png, page_h, width):
    """Capture a page taller than Chrome's raster cap as vertical slices and join them.

    Chrome rasterises full_page at DEVICE resolution, so `scale='css'` does NOT dodge the cap
    (it clips first, then downscales — the tell-tale is a PNG exactly cap/dpr tall). Slicing
    keeps the configured dpr, so the report keeps its sharpness.
    """
    from PIL import Image
    slice_h = 2000
    tmp = png + ".slice.png"
    tiles, y = [], 0
    while y < page_h:
        hh = min(slice_h, page_h - y)
        pg.screenshot(path=tmp, full_page=True,
                      clip={"x": 0, "y": y, "width": width, "height": hh})
        tiles.append(Image.open(tmp).copy())
        y += hh
    total_w = max(t.width for t in tiles)
    canvas = Image.new("RGB", (total_w, sum(t.height for t in tiles)), "white")
    oy = 0
    for t in tiles:
        canvas.paste(t, (0, oy)); oy += t.height
    canvas.save(png)
    try: os.remove(tmp)
    except OSError: pass

def shoot(pg, png, page_h, dpr, width):
    """Screenshot the whole page, then VERIFY the result is as tall as the content.

    `full_page` sizes itself from the document's layout box. In a `position:fixed` app shell
    the chrome is out of flow, so that box can be far shorter than what the user sees (observed:
    a 1189px screen captured at 657px). When the shot comes up short, grow the window to the
    content height and take a viewport shot instead — for a fixed shell the viewport IS the page.
    """
    def _grab(h):
        if h and h * dpr > MAX_DEVICE_PX:
            _stitch(pg, png, h, width)
        else:
            pg.screenshot(path=png, full_page=True)
        normalize(png, width)

    _grab(page_h)
    got = png_height_1440(png, width)
    if page_h and got and got < page_h - 40:
        target = min(page_h, MAX_VIEWPORT_H)
        try:
            pg.set_viewport_size({"width": width, "height": target})
            pg.wait_for_timeout(600)
            if target * dpr > MAX_DEVICE_PX:
                _stitch(pg, png, target, width)
            else:
                pg.screenshot(path=png, full_page=False)
            normalize(png, width)
        except Exception:
            pass

def slugify(role, path):
    s = (path.strip("/").replace("/", "-") or "home")
    s = "".join(c for c in s if c.isalnum() or c == "-")
    return f"{role}-{s}".upper()

def normalize(png, width):
    subprocess.run(["sips", "--resampleWidth", str(width), png, "--out", png],
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

def png_height_1440(png, width=1440):
    """Height of the PNG expressed in the 1440-wide CSS space the extraction uses."""
    try:
        with open(png, "rb") as f:
            f.read(16)
            w, h = struct.unpack(">II", f.read(8))
        return round(h * width / w) if w else None
    except Exception:
        return None

def _click_button(pg, label, exact=True):
    """Click a button by visible text, tolerant of role/CSS variance."""
    try:
        pg.get_by_role("button", name=label, exact=exact).first.click()
        return True
    except Exception:
        pass
    try:
        pg.click(f"button:has-text(\"{label}\")")
        return True
    except Exception:
        return False

def login(pg, base, auth, user, pw):
    """Username/password form login."""
    pg.goto(base + auth.get("loginPath", "/login"), wait_until="domcontentloaded", timeout=60000)
    pg.wait_for_timeout(2500)
    pg.fill(auth["userField"], user)
    pg.fill(auth["passField"], pw)
    (pg.query_selector(auth.get("submit", "button[type=submit]")) or pg.query_selector("button")).click()
    pg.wait_for_timeout(4500)

def login_email_otp(pg, base, auth, user, otp):
    """Email -> Send OTP -> N-digit OTP -> Verify. Optional role tab clicked first.
    Handles both split single-digit boxes and a single OTP field. Dev OTP is a fixed
    constant; never brute-forces or requests beyond the configured value."""
    pg.goto(base + auth.get("loginPath", "/login"), wait_until="domcontentloaded", timeout=60000)
    pg.wait_for_timeout(3000)
    tab = auth.get("roleTab")
    if tab:
        _click_button(pg, tab, exact=True)
        pg.wait_for_timeout(800)
    pg.fill(auth["userField"], user)
    _click_button(pg, auth.get("sendOtpButton", "Send OTP"), exact=False)
    pg.wait_for_timeout(4000)
    boxes = pg.query_selector_all(auth.get("otpInput", "input[maxlength='1'][inputmode='numeric']"))
    if len(boxes) >= len(otp):
        for i, ch in enumerate(otp):
            boxes[i].fill(ch)
    elif boxes:
        boxes[0].fill(otp)
    pg.wait_for_timeout(700)
    _click_button(pg, auth.get("verifyButton", "Verify OTP"), exact=False)
    pg.wait_for_timeout(5000)

def do_login(pg, role, auth):
    """Dispatch to the right login flow by auth.type. Returns False if creds are missing."""
    if auth.get("type") == "email-otp":
        otp = role.get("otp") or auth.get("otp")
        if not (role.get("user") and otp):
            return False
        login_email_otp(pg, role["base"], auth, role["user"], otp)
        return True
    if not role.get("pass"):
        return False
    login(pg, role["base"], auth, role["user"], role["pass"])
    return True

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
        # Reset the viewport: settle_height grows it per page, and a tall window left over
        # from the previous route changes how the next one lays out.
        try: pg.set_viewport_size({"width": width, "height": 1000})
        except Exception: pass
        try:
            pg.goto(base + path, wait_until="networkidle", timeout=45000)
        except Exception:
            try: pg.goto(base + path, wait_until="domcontentloaded", timeout=45000)
            except Exception: continue
        pg.wait_for_timeout(waitms)
        # Settle FIRST so the screenshot and the extraction describe the same layout.
        settled = settle_height(pg, UNCLIP_JS, width=width, base_h=1000)
        png = os.path.join(paths["captures_live"], f"{slug}.png")
        dpr = cfg.get("capture", {}).get("dpr", 2)
        try:
            shoot(pg, png, settled, dpr, width)
        except Exception: pass
        try:
            data = pg.evaluate(EXTRACT_JS)
            data["role"] = role["name"]; data["route"] = path; data["slug"] = slug
            data["figmaImg"] = None; data["url"] = base + path
            json.dump(data, open(os.path.join(paths["captures_live"], f"{slug}.json"), "w"), indent=2)
            # GATE: the PNG (in 1440-space) MUST match pageH, or every derived crop/pin is wrong.
            png_h = png_height_1440(png, width)
            delta = abs(png_h - data["pageH"]) if png_h else None
            warn = "" if (delta is not None and delta <= 40) else f"  <-- HEIGHT MISMATCH png={png_h}"
            # Truncated only if content is STILL hidden after settling — a tall page that the
            # stitcher captured in full is not truncated just because it exceeded the window cap.
            try: residual = pg.evaluate(DEFICIT_JS)
            except Exception: residual = 0
            truncated = residual > 4
            if truncated:
                warn += f"  [TRUNCATED - {residual}px still hidden (lazy-loading page)]"
            captured.append({"slug": slug, "role": role["name"], "route": path, "url": base + path,
                             "png": f"captures/live/{slug}.png", "rows": len(data["rows"]),
                             "pageH": data["pageH"], "pngH": png_h, "truncated": truncated})
            print(f"  ok {slug}: {len(data['rows'])} rows pageH={data['pageH']}{warn}", flush=True)
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
            # A heavy page (huge map/feed) can crash the browser process. Isolate each role so
            # one casualty can't silently abort every role after it, and relaunch if needed.
            try:
                if not b.is_connected():
                    b = p.chromium.launch(channel="chrome", headless=True)
                ctx = b.new_context(viewport={"width": cfg["capture"]["width"], "height": 1000},
                                    device_scale_factor=cfg["capture"].get("dpr", 2))
                pg = ctx.new_page()
                if role.get("auth") != "none":
                    if not do_login(pg, role, auth):
                        print(f"[{role['name']}] SKIP — missing credentials (add user/pass/otp to secrets.json)", flush=True); ctx.close(); continue
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
            except Exception as e:
                print(f"[{role['name']}] ROLE ABORTED: {str(e)[:120]}", flush=True)
        try: b.close()
        except Exception: pass
    json.dump(manifest, open(os.path.join(paths["captures"], "_captured.json"), "w"), indent=2)
    print(f"CAPTURED {len(manifest)} screens", flush=True)
    return manifest

if __name__ == "__main__":
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument("--project", required=True); ap.add_argument("--role", default=None)
    a = ap.parse_args(); run(a.project, a.role)


def audit_capture_integrity(paths, verbose=True):
    """A live capture must never be byte-identical to its own design image.

    Learned the hard way: a `cd` that fails in a persistent shell leaves the working directory
    where it was, so a subsequent `curl -o <slug>.png` writes the DESIGN frame straight over the
    LIVE capture. The boards still render and the height gate still passes — the audit just
    silently compares a design against itself and reports perfect fidelity. Cheap to detect,
    so always detect it.
    """
    import hashlib
    fig_dir, live_dir = paths["captures_figma"], paths["captures_live"]
    if not (os.path.isdir(fig_dir) and os.path.isdir(live_dir)):
        return []
    def md5(p):
        with open(p, "rb") as fh:
            return hashlib.md5(fh.read()).hexdigest()
    fig = {}
    for fn in os.listdir(fig_dir):
        if fn.endswith(".png"):
            fig[fn] = md5(os.path.join(fig_dir, fn))
    bad = []
    for fn in os.listdir(live_dir):
        if fn.endswith(".png") and fn in fig and md5(os.path.join(live_dir, fn)) == fig[fn]:
            bad.append(fn)
    if verbose:
        if bad:
            print(f"!! CAPTURE CORRUPTION: {len(bad)} live capture(s) identical to their design image "
                  f"— re-capture these: {sorted(bad)}", flush=True)
        else:
            print("capture integrity: ok (no live capture matches its design image)", flush=True)
    return sorted(bad)
