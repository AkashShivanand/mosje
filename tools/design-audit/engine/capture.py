#!/usr/bin/env python3
"""Config-driven live capture. Per role: ONE keep-alive browser session (log in once,
capture every screen in the same context — sessionStorage-safe), also persisting
storageState for fast re-runs. Per screen: neutralise inner scroll -> full-height
screenshot normalised to the config width, + structured computed-CSS element rows.

Reusable across any project — reads roles/auth/routes from the config only.

Manifest contract (`captures/_captured.json`): a `--role X` run MERGES into the existing
manifest (rows for that role's slugs are replaced, every other role's rows are preserved),
and a full run that captured nothing refuses to overwrite a non-empty manifest without
`--allow-empty`. The manifest is the only record of the captured SET — the PNG/JSON files
survive a bad write, the set does not."""
import json, os, struct, subprocess, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import config as C
import manifest as MAN
import bundle as B
from playwright.sync_api import sync_playwright

EXTRACT_JS = r"""
(arg) => {
  const volatileSel = (arg && arg.volatileSelectors) || [];
  const isVolatile = el => volatileSel.some(s => { try { return el.matches(s) || el.closest(s); } catch (e) { return false; } });
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
      volatile: isVolatile(el),
    });
  }
  // Field inventory — the machine-readable replacement for the prose in INVENTORY.md.
  const labelFor = el => {
    if (el.getAttribute('aria-label')) return el.getAttribute('aria-label');
    if (el.id) { const l = document.querySelector(`label[for="${CSS.escape(el.id)}"]`); if (l) return l.innerText.trim(); }
    const wrap = el.closest('label');
    return wrap ? wrap.innerText.trim() : null;
  };
  const fields = [];
  for (const el of document.querySelectorAll('input,select,textarea')) {
    if (el.type === 'hidden') continue;
    fields.push({
      name: el.name || el.id || null,
      label: labelFor(el),
      type: el.tagName === 'SELECT' ? 'select' : (el.type || el.tagName.toLowerCase()),
      required: el.required || el.getAttribute('aria-required') === 'true',
      options: el.tagName === 'SELECT' ? [...el.options].map(o => o.text.trim()).slice(0, 200) : null,
      helper: el.placeholder || el.getAttribute('aria-describedby') || null,
      validationMessage: null,
      conditionalOn: null,
    });
  }
  return { pageW: document.documentElement.scrollWidth,
           pageH: document.documentElement.scrollHeight, rows, fields };
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

def solve_captcha(pg, cfg_captcha, paths):
    """Screenshot the captcha, then wait for an operator to write the answer to a file.

    A government login that renders a code as an image cannot be read by a selector, and guessing
    is not an option. So the run stops at a defined point, publishes the challenge as a PNG, and
    blocks on an answer file with a bounded timeout — no polling loop against the host, and no
    attempt to defeat the captcha itself. Returns True when an answer was supplied.
    """
    text_sel = cfg_captcha.get("textSelector")
    if text_sel:
        try:
            pg.wait_for_selector(text_sel, timeout=10000)
            code = (pg.inner_text(text_sel) or "").strip()
        except Exception as e:
            print(f"  ! captcha text not readable via {text_sel!r} ({str(e)[:50]})", flush=True)
            code = ""
        if code:
            pg.fill(cfg_captcha["input"], code)
            print(f"  captcha: read {len(code)} chars from the DOM and answered", flush=True)
            return True
        print("  ! captcha text selector matched nothing — falling back to the image handshake",
              flush=True)
    img_sel = cfg_captcha.get("image")
    shot = os.path.join(paths["auth"], cfg_captcha.get("shotFile", "captcha.png"))
    ans = os.path.join(paths["auth"], cfg_captcha.get("answerFile", "captcha-answer.txt"))
    timeout_ms = int(cfg_captcha.get("timeoutMs", 300000))
    try:
        os.remove(ans)
    except OSError:
        pass
    el = pg.query_selector(img_sel) if img_sel else None
    if el is None:
        print(f"  ! captcha image not found via {img_sel!r} — cannot present a challenge", flush=True)
        return False
    try:
        el.screenshot(path=shot)
    except Exception as e:
        print(f"  ! could not screenshot the captcha ({str(e)[:60]})", flush=True)
        return False
    print(f"  CAPTCHA: challenge saved to {shot}", flush=True)
    print(f"  CAPTCHA: waiting up to {timeout_ms // 1000}s for the answer in {ans}", flush=True)
    waited = 0
    while waited < timeout_ms:
        if os.path.exists(ans):
            try:
                text = open(ans).read().strip()
            except OSError:
                text = ""
            if text:
                pg.fill(cfg_captcha["input"], text)
                print(f"  CAPTCHA: answered ({len(text)} chars)", flush=True)
                return True
        pg.wait_for_timeout(2000)
        waited += 2000
    print("  ! captcha not answered within the timeout — login abandoned", flush=True)
    return False


def login(pg, base, auth, user, pw):
    """Username/password form login."""
    pg.goto(base + auth.get("loginPath", "/login"), wait_until="domcontentloaded", timeout=60000)
    pg.wait_for_timeout(2500)
    tab = auth.get("tab")
    if tab:
        # A tabbed login renders its fields only once the right tab is active.
        try:
            pg.click(tab); pg.wait_for_timeout(900)
        except Exception:
            print(f"  ! login tab {tab!r} not clickable — continuing", flush=True)
    pg.wait_for_selector(auth["userField"], timeout=20000)
    pg.fill(auth["userField"], user)
    pg.fill(auth["passField"], pw)
    if auth.get("captcha"):
        if not solve_captcha(pg, auth["captcha"], auth["_paths"]):
            return
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

def role_auth(role, auth):
    """Merge a role's own `auth` dict over the project's global auth block.

    Two hosts in one portal routinely have two different login forms — E-Anudaan's admin side
    takes a mobile number, its applicant side a username plus a captcha. A role whose `auth` is
    the STRING "none" is public and never reaches here.
    """
    override = role.get("auth")
    return {**auth, **override} if isinstance(override, dict) else auth


def do_login(pg, role, auth):
    """Dispatch to the right login flow by auth.type. Returns False if creds are missing."""
    auth = role_auth(role, auth)
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

def _route_path(route, base):
    """A crawlable route is a path, never an absolute URL — `base + route` is how the crawl
    navigates, so an origin left on the front concatenates into an unresolvable host."""
    r = (route or "").split("?")[0]
    if r.startswith(base):
        r = r[len(base):]
    elif r.startswith("http://") or r.startswith("https://"):
        return None                     # some other origin — not this role's to crawl
    return r if r.startswith("/") else None


def discover_routes(pg, cfg):
    # A slow-loading nav/carousel widget can still be rendering when we read hrefs, so the
    # discovered route SET varies run to run (observed on scw-user-uat: two routes intermittently
    # missing). Wait briefly for a nav-ish anchor to exist first; a timeout just proceeds with
    # whatever is there rather than raising — this only ever ADDS routes timing was dropping.
    try:
        pg.wait_for_selector("nav a[href], aside a[href], [class*=sidebar] a[href], "
                             "[class*=menu] a[href]", timeout=4000)
    except Exception:
        pass
    hrefs = pg.evaluate("""()=>{const s=new Set();document.querySelectorAll('nav a[href],aside a[href],[class*=sidebar] a[href],[class*=menu] a[href],a[href]').forEach(a=>{const h=a.getAttribute('href');if(h&&h.startsWith('/')&&!h.startsWith('//'))s.add(h.split('?')[0].split('#')[0])});return [...s]}""")
    skip = set(cfg.get("live", {}).get("skipRoutes", []))
    return [h for h in hrefs if h and h not in skip]

def _engine_sha():
    """Short git sha of the engine, recorded so a bundle can be traced to the code that made it."""
    try:
        return subprocess.run(["git", "rev-parse", "--short", "HEAD"],
                              cwd=os.path.dirname(os.path.abspath(__file__)),
                              capture_output=True, text=True, timeout=5).stdout.strip() or None
    except Exception:
        return None

class SessionLost(Exception):
    """Raised when a role's captures collapse mid-run. Distinct from any other failure because
    the response is different: keep the previous bundle's rows for this role and change nothing,
    rather than write the degraded ones over them."""


def capture_role(pg, role, cfg, paths, bdl, man, prev_bundle=None, mode="full", decisions=None,
                 failures=None):
    if decisions is None:
        decisions = {}
    # role name -> slugs whose goto failed every attempt this run. run() needs these by name:
    # such a screen is correctly absent from the bundle, but a previous run's row for it can
    # still be sitting in _captured.json, which analyze.py reads.
    if failures is None:
        failures = {}
    base = role["base"]; width = cfg.get("capture", {}).get("width", 1440)
    waitms = cfg.get("capture", {}).get("waitMs", 1800)
    degraded = []          # consecutive screens far smaller than the bundle says they were
    routes = discover_routes(pg, cfg)
    land = pg.url.replace(base, "").split("?")[0]
    if land and land not in routes:
        routes.insert(0, land)
    # Route discovery is a timing race on some live sites (a slow-loading widget's links are
    # sometimes there, sometimes not — see discover_routes). Rather than keep trying to win that
    # race, make discovery MONOTONIC: once a route has been seen for this role, always revisit
    # it, by unioning in every route recorded for this role in the previous bundle.
    skip = set(cfg.get("live", {}).get("skipRoutes", []))
    carried = []
    for s in (prev_bundle or {}).get("screens", []):
        if s.get("role") != role["name"]:
            continue
        # A flow state is NOT a crawlable route. Its `route` is the absolute URL the wizard
        # happened to be on, and carrying it here did two wrong things at once: it re-crawled a
        # wizard step as if it were a page, and — because the crawl builds `base + route` — it
        # produced `https://host` + `https://host/path` and failed to resolve. Flow states are
        # reproduced by re-running their flow, never by navigating to their URL.
        if str(s.get("reachedBy") or "").startswith("flow:"):
            continue
        r = _route_path(s.get("route"), base)
        if r and r not in routes and r not in skip:
            routes.append(r)
            carried.append(r)
    if carried:
        print(f"  carried forward {len(carried)} route(s) seen in a previous run", flush=True)
    captured = []
    failed = []
    for path in routes:
        slug = slugify(role["name"], path)
        vol_selectors = MAN.volatile_selectors(man, slug) if man else []
        # Reset the viewport: settle_height grows it per page, and a tall window left over
        # from the previous route changes how the next one lays out.
        try: pg.set_viewport_size({"width": width, "height": 1000})
        except Exception: pass
        try:
            pg.goto(base + path, wait_until="networkidle", timeout=45000)
        except Exception:
            try:
                pg.goto(base + path, wait_until="domcontentloaded", timeout=45000)
            except Exception:
                # One extra try after a short pause — no loop, no backoff ladder — before we
                # accept the route is unreachable this run. A screen must never vanish from a
                # run silently: if this also fails, it is logged here and in the role summary.
                pg.wait_for_timeout(2000)
                try:
                    pg.goto(base + path, wait_until="domcontentloaded", timeout=45000)
                except Exception as e:
                    print(f"  ! {slug}: navigation failed ({str(e)[:120]}) — screen NOT captured",
                          flush=True)
                    failed.append(slug)
                    continue
        pg.wait_for_timeout(waitms)
        prev = B.find_screen(prev_bundle, slug) if prev_bundle else None
        png = os.path.join(paths["captures_live"], f"{slug}.png")
        dpr = cfg.get("capture", {}).get("dpr", 2)

        # Settle FIRST — always, even for the verify-mode probe — so the probe describes the
        # same post-settle layout the bundle's recorded hashes came from. Comparing a
        # pre-settle extraction (no lazy-load scroll pass, no UNCLIP_JS) against post-settle
        # hashes is invalid for the app-shell / inner-scroller pages this codebase's own
        # comments say are common: pageH and the row set differ from settling alone, so a
        # verify run would report "changed" on nearly every page for reasons that have
        # nothing to do with the page actually changing, and the reuse saving is lost.
        settled = settle_height(pg, UNCLIP_JS, width=width, base_h=1000)
        try:
            probe = pg.evaluate(EXTRACT_JS, {"volatileSelectors": vol_selectors})
        except Exception:
            probe = None

        decision = "recapture"
        if mode == "verify" and prev and probe is not None:
            kept, _ = B.mask_rows(probe["rows"], MAN.volatile_patterns(man, slug) if man else [])
            decision = B.decide_screen(prev, B.structure_hash(kept),
                                       B.geometry_hash(kept, probe["pageH"]))

        if decision == "reuse" and prev and os.path.exists(png):
            decisions[slug] = "reuse"
            B.upsert_screen(bdl, prev)
            captured.append({"slug": slug, "role": role["name"], "route": path,
                             "url": base + path, "png": prev["png"], "rows": prev["totalRows"],
                             "pageH": prev["pageH"], "pngH": prev["pngH"],
                             "truncated": prev["truncated"]})
            print(f"  = {slug}: reused (design and layout unchanged)", flush=True)
            continue
        if decision == "reuse":
            # The probe said reuse but the PNG the bundle points to has vanished — recapture
            # for real rather than record "reused" for a screenshot that no longer exists.
            print(f"  ! {slug}: probe says reuse but {png} is missing — recapturing", flush=True)
            decision = "recapture"
        decisions[slug] = decision

        # Only the genuinely expensive work — the (possibly sliced) screenshot and its sips
        # normalize() pass — is skipped by an early `reuse` above. Settle and the extraction
        # already ran (needed for the probe/decision itself), so reuse that same evaluation
        # here instead of paying for a second one.
        try:
            shoot(pg, png, settled, dpr, width)
        except Exception: pass
        try:
            data = probe if probe is not None else pg.evaluate(EXTRACT_JS, {"volatileSelectors": vol_selectors})
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
            kept, masked = B.mask_rows(data["rows"], MAN.volatile_patterns(man, slug) if man else [])
            # shoot() tolerates a failed screenshot (try/except: pass) — sha256_file would raise
            # FileNotFoundError on a missing PNG, which the outer handler mislabels as "extract
            # failed" and leaves the bundle and _captured.json disagreeing about what exists.
            try:
                png_sha = B.sha256_file(png)
            except OSError:
                png_sha = None
                print(f"  ! {slug}: screenshot missing — pngSha256 recorded as null", flush=True)
            entry = B.screen_entry(
                slug=slug, role=role["name"], route=path, url=base + path, reached_by="nav",
                png=f"captures/live/{slug}.png", png_sha256=png_sha,
                png_h=png_h, page_h=data["pageH"], truncated=truncated,
                rows_path=f"captures/live/{slug}.json",
                structure=B.structure_hash(kept), geometry=B.geometry_hash(kept, data["pageH"]),
                masked=masked, total=len(data["rows"]),
                fields=data.get("fields") or [], wizard=None, captured_at=B.now_iso())
            entry["designUnchanged"] = (decision == "reshoot")
            B.upsert_screen(bdl, entry)
            if len(data["rows"]) and masked / len(data["rows"]) > B.MASK_WARN_RATIO:
                print(f"  ! {slug}: {masked}/{len(data['rows'])} rows masked as volatile — "
                      f"the mask is doing too much work and the fingerprint means little",
                      flush=True)
            print(f"  ok {slug}: {len(data['rows'])} rows pageH={data['pageH']}{warn}", flush=True)
            # A dropped session does not raise — the portal serves its shell and every screen
            # after that captures happily with a fraction of the content. Three in a row that
            # come back at under half their previous size is that, not a redesign.
            if B.looks_degraded(prev_bundle, slug, len(data["rows"])):
                degraded.append(slug)
                if len(degraded) >= B.SESSION_LOSS_RUN:
                    raise SessionLost(
                        f"{len(degraded)} consecutive screens came back under half their previous "
                        f"size ({', '.join(degraded[-3:])}) — the session was almost certainly "
                        f"dropped. Nothing this role captured is trusted.")
            else:
                degraded.clear()
        except Exception as e:
            print(f"  ! {slug} extract failed: {str(e)[:60]}", flush=True)
    if failed:
        print(f"[{role['name']}] {len(failed)} screen(s) not captured: {', '.join(failed)}",
              flush=True)
    failures.setdefault(role["name"], []).extend(failed)
    return captured

def rows_to_prune(rows, failures, visited_roles, captured_counts):
    """Pure decision function for the manifest-pruning step in run().

    A screen whose goto failed every attempt this run should have its stale row removed
    from the manifest — UNLESS that role captured nothing at all this run, in which case
    pruning must be skipped: the guard a few lines above this call in run() exists because
    a single 0-screen retry once wiped 90 entries across 12 roles, and pruning must never
    bypass that guard by deleting rows out from under it.

    Args:
      rows: manifest rows (dicts with a `slug` key) to filter, e.g. `out` in run().
      failures: role name -> list of slugs whose navigation failed this run.
      visited_roles: set of role names capture_role actually ran for this run.
      captured_counts: role name -> number of screens successfully captured this run.

    Returns: (kept_rows, pruned_slugs, skipped_roles) — `skipped_roles` is every role whose
      failed slugs were left alone because it captured 0 screens this run, for logging.
    """
    failed_this_run = set()
    skipped_roles = []
    for role in visited_roles:
        role_failed = failures.get(role, [])
        if not role_failed:
            continue
        if captured_counts.get(role, 0) == 0:
            skipped_roles.append(role)
            continue
        failed_this_run.update(role_failed)
    kept = [row for row in rows if row.get("slug") not in failed_this_run]
    pruned = sorted({row.get("slug") for row in rows if row.get("slug") in failed_this_run})
    return kept, pruned, skipped_roles

def merge_manifest(existing, fresh):
    """Replace rows whose `slug` was re-captured, preserving position, and append the rest.

    A partial capture (`--role X`) must never speak for the roles it did not visit.
    """
    # A hand-rebuilt manifest row may be missing `slug` — keep it rather than crashing on it.
    by_slug = {row["slug"]: row for row in fresh if row.get("slug")}
    merged, seen = [], set()
    for row in existing:
        slug = row.get("slug")
        if slug in by_slug:
            merged.append(by_slug[slug]); seen.add(slug)
        else:
            merged.append(row)
    merged += [row for row in fresh if row.get("slug") not in seen]
    return merged

def run(project, only_role=None, allow_empty=False, force=False, verify=False):
    import drive as DRV   # local import: drive.py imports from capture, so a module-scope
                          # import here would be circular and fail at load time
    cfg, paths = C.load(project)
    man = MAN.load(paths["project"])
    if man:
        errs = MAN.validate(man)
        if errs:
            print("!! screen-manifest.yaml is invalid:", flush=True)
            for e in errs:
                print(f"   - {e}", flush=True)
            return []
    env = (man or {}).get("environment") or cfg.get("live", {}).get("environment")
    if not env:
        # Absence must fail SAFE: `environment` gates whether a later driver may click a
        # DESTRUCTIVE-labelled Submit/Approve unattended (dev/uat: yes, prod: refused).
        # Defaulting to "dev" would make missing config resolve to the MOST permissive
        # state. Note this does NOT halt the run: flows still navigate to their entry and
        # still run their `fill` steps against the live form on prod — only the destructive
        # click is refused.
        print(f"!! {project}: no `environment` configured (cfg.live.environment or "
              f"screen-manifest.yaml `environment`) — defaulting to 'prod', which REFUSES "
              f"DESTRUCTIVE-labelled clicks but still navigates flows and still fills live "
              f"forms with fixture data. Set `environment` in screen-manifest.yaml to silence "
              f"this.", flush=True)
        env = "prod"
    bdl = B.new_bundle(project, env, _engine_sha())
    # Loaded once, before capture starts: feeds capture_role's route union AND the
    # carry-forward/shrink-guard below — no bundle write happens in between, so one load
    # correctly represents "the previous run" for both uses.
    prev_bundle = B.load_bundle(paths)
    mpath = os.path.join(paths["captures"], "_captured.json")
    try:
        existing = json.load(open(mpath)) if os.path.exists(mpath) else []
    except Exception as e:
        print(f"!! could not read existing manifest ({str(e)[:80]}) — treating it as empty", flush=True)
        existing = []
    # Tier 0: consult the previous bundle before launching a browser at all. `reuse-all`
    # short-circuits the whole run; `full`/`verify` fall through and capture_role decides
    # per screen (mode == "verify" probes cheaply, mode == "full" always recaptures).
    res = B.resolve_freshness(prev_bundle, man, cfg, force=force, verify=verify)
    print(f"freshness: {res['mode']} — {res['reason']}", flush=True)
    if res["mode"] == "reuse-all":
        drift = B.verify_integrity(prev_bundle, paths["project"])
        ok = B.write_freshness(paths, prev_bundle, res, {}, drift)
        print(("freshness gate: PASS — reusing the existing bundle, no browser launched"
               if ok else f"freshness gate: FAIL — {len(drift)} capture(s) drifted, see out/freshness.md"),
              flush=True)
        return existing
    mode = res["mode"]
    auth = cfg["live"]["auth"]
    auth["_paths"] = paths   # solve_captcha writes its challenge/answer files under captures/.auth/
    manifest = []
    decisions = {}  # slug -> "recapture"|"reshoot"|"reuse", tallied into freshness.md
    visited_roles = set()  # roles capture_role actually ran for — everyone else's bundle
                            # screens (SKIP/ABORTED/not-in---role) must be carried forward, not lost.
    failures = {}   # role -> slugs whose navigation failed this run (see the pruning below)
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
                try:
                    manifest += capture_role(pg, role, cfg, paths, bdl, man, prev_bundle, mode,
                                             decisions, failures)
                except SessionLost as e:
                    # Deliberately NOT added to visited_roles, and its flows are not run: the
                    # bundle then carries this role's previous screens forward untouched instead
                    # of writing shell pages over them. A run that lost its session must cost
                    # nothing, not eight real wizard states.
                    print(f"[{role['name']}] SESSION LOST — {e}\n"
                          f"[{role['name']}] this role's existing screens are kept as they were; "
                          f"re-run this role alone once the portal is healthy", flush=True)
                    for slug in [s["slug"] for s in bdl.get("screens", [])
                                 if s.get("role") == role["name"]]:
                        bdl["screens"] = [x for x in bdl["screens"] if x["slug"] != slug]
                    ctx.close()
                    continue
                visited_roles.add(role["name"])
                for flow in (man or {}).get("flows") or []:
                    if flow.get("role") != role["name"]:
                        continue
                    if not DRV.should_replay(flow, prev_bundle, decisions):
                        for s in (prev_bundle or {}).get("screens", []):
                            if s.get("reachedBy") == f"flow:{flow['id']}":
                                B.upsert_screen(bdl, s)
                        print(f"[flow {flow['id']}] skipped — entry screen unchanged", flush=True)
                        continue
                    if flow.get("reuseRecord") is None and (prev_bundle or {}).get("records", {}).get(flow["id"]):
                        flow["reuseRecord"] = prev_bundle["records"][flow["id"]]["id"]
                    # A flow walks a live form and can fail in ways a route crawl cannot — a
                    # control that never settles, a step that stops advancing. That must cost
                    # its own flow and nothing else: an exception escaping here aborted the
                    # whole ROLE, discarding the two flows that had not run yet.
                    try:
                        DRV.run_flow(pg, flow, man, cfg, paths, bdl, env)
                    except Exception as e:
                        print(f"[flow {flow['id']}] FAILED: {str(e)[:120]} — the remaining "
                              f"flows for this role still run", flush=True)
                # Record this host's build fingerprint so a FUTURE run's Tier 0 check
                # (resolve_freshness) has something to compare against — without this the
                # bundle's `hosts` map stays empty forever and reuse-all can never trigger.
                fp = B.build_fingerprint(role["base"])
                bdl.setdefault("hosts", {})[role["name"]] = {"base": role["base"], "buildFingerprint": fp}
                ctx.close()
            except Exception as e:
                print(f"[{role['name']}] ROLE ABORTED: {str(e)[:120]}", flush=True)
        try: b.close()
        except Exception: pass
    # NEVER let a partial run speak for the whole manifest. A `--role X` retry that captures
    # nothing used to truncate `_captured.json` to `[]`, silently discarding every other role
    # (this really happened: 90 entries across 12 roles, wiped by one 0-screen retry). The PNG +
    # JSON files survive in captures/live/, but the manifest is the only record of the set.
    if only_role:
        out = merge_manifest(existing, manifest)
        if not manifest:
            print(f"[{only_role}] captured 0 screens — manifest left untouched "
                  f"({len(existing)} entries preserved)", flush=True)
    else:
        out = manifest
        if not out and existing and not allow_empty:
            print(f"!! REFUSING to write an empty manifest over {len(existing)} existing entries. "
                  f"Nothing was captured — fix the run, or pass --allow-empty to wipe it deliberately.",
                  flush=True)
            return existing
        if existing and len(out) < len(existing):
            dropped = sorted({r.get("slug") or "?" for r in existing} - {r.get("slug") or "?" for r in out})
            print(f"!! manifest SHRANK {len(existing)} -> {len(out)}: {len(dropped)} slug(s) no longer "
                  f"captured (aborted roles?): {dropped[:8]}{' …' if len(dropped) > 8 else ''}", flush=True)

    # A screen whose goto failed every attempt this run is correctly absent from
    # capture-bundle.json — but on a `--role` retry merge_manifest preserves the PREVIOUS run's
    # row for it in _captured.json, which is what analyze.py reads. Net effect: out/freshness.md
    # reports PASS while the generated PDF carries the previous run's screenshot inside THIS
    # run's certification — the stale-reuse failure this whole feature exists to prevent,
    # arriving by an older path. So prune those rows here, after the merge.
    #
    # Scoped to roles capture_role actually RAN for. `failures` is only populated by a role that
    # reached the end of capture_role, and it is intersected with visited_roles again below, so a
    # role that was skipped, aborted or excluded by `--role` keeps every row it had — same
    # contract as the bundle carry-forward and the `--role` manifest merge above.
    #
    # A role that captured NOTHING this run (every route failed — outage, expired login, DNS
    # blip) must not have its rows pruned either: that is exactly the 0-screen-retry scenario
    # the guard above (`captured 0 screens — manifest left untouched`) exists to protect, and
    # pruning here used to run right after it and delete the same rows anyway.
    captured_counts = {}
    for row in manifest:
        r = row.get("role")
        captured_counts[r] = captured_counts.get(r, 0) + 1
    out, pruned, skipped_roles = rows_to_prune(out, failures, visited_roles, captured_counts)
    if skipped_roles:
        print(f"!! pruning skipped for {', '.join(sorted(skipped_roles))}: captured 0 screens "
              f"this run, so failed-route rows were left in the manifest", flush=True)
    if pruned:
        print(f"!! removed {len(pruned)} stale manifest row(s) for screen(s) that failed to "
              f"load this run: {', '.join(pruned)}", flush=True)

    json.dump(out, open(mpath, "w"), indent=2)
    print(f"CAPTURED {len(manifest)} screens (manifest now {len(out)})", flush=True)

    prev = prev_bundle  # loaded once, above, before the route-union needed it
    if prev:
        # A bundle must not speak for roles it never visited this run — same contract as
        # _captured.json above, but keyed on which roles capture_role actually ran for, not on
        # `--role`: a full run where a role is SKIPPED (e.g. missing credentials) must carry
        # that role's screens forward too, or they silently vanish from the bundle.
        for s in prev.get("screens", []):
            if s.get("role") not in visited_roles and not B.find_screen(bdl, s["slug"]):
                B.upsert_screen(bdl, s)
        bdl["records"] = {**prev.get("records", {}), **bdl.get("records", {})}
        bdl["hosts"] = {**prev.get("hosts", {}), **bdl.get("hosts", {})}
        prev_n, new_n = len(prev.get("screens", [])), len(bdl.get("screens", []))
        if new_n < prev_n:
            dropped = sorted({s.get("slug") or "?" for s in prev.get("screens", [])} -
                              {s.get("slug") or "?" for s in bdl.get("screens", [])})
            print(f"!! bundle SHRANK {prev_n} -> {new_n}: {len(dropped)} slug(s) no longer "
                  f"present (aborted/skipped roles?): {dropped[:8]}{' …' if len(dropped) > 8 else ''}",
                  flush=True)
    # Record the recipe this bundle was built against, so a later edit to screen-manifest.yaml
    # invalidates it (see bundle.manifest_hash). A role-limited run applied the recipe to ONE
    # role, so it must not claim the whole recipe is satisfied — it carries the previous value
    # forward instead, leaving the next full run to do the work.
    if only_role:
        bdl["manifestHash"] = (prev or {}).get("manifestHash")
    else:
        bdl["manifestHash"] = B.manifest_hash(man)
    drift = B.verify_integrity(bdl, paths["project"])
    if not B.write_freshness(paths, bdl, res, decisions, drift):
        print(f"freshness gate: FAIL — {len(drift)} capture(s) drifted, see out/freshness.md", flush=True)
    B.write_bundle(paths, bdl)
    print(f"BUNDLE {len(bdl['screens'])} screen states -> out/capture-bundle.json", flush=True)
    return out

if __name__ == "__main__":
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument("--project", required=True); ap.add_argument("--role", default=None)
    ap.add_argument("--allow-empty", action="store_true",
                    help="permit a full run that captured nothing to overwrite a non-empty manifest")
    ap.add_argument("--force", action="store_true",
                    help="ignore any existing capture-bundle.json and re-capture everything")
    ap.add_argument("--verify", action="store_true",
                    help="always run the per-screen freshness check, even when the build "
                         "fingerprint is unchanged")
    a = ap.parse_args(); run(a.project, a.role, a.allow_empty, a.force, a.verify)


def refresh(project, force=False, verify=True):
    """Re-check freshness without a full capture. `--phase bundle` — what a QC run calls first."""
    return run(project, only_role=None, allow_empty=False, force=force, verify=verify)


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
