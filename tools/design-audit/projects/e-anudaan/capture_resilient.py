#!/usr/bin/env python3
"""Resilient per-route capture driver for E-Anudaan.

WHY THIS EXISTS (and why it is not a fork of the engine)
--------------------------------------------------------
`engine/capture.py` captures a whole role on ONE page in ONE context. That is right
for every other portal, but E-Anudaan's `programme-director` reliably crashes the
Chrome renderer during route discovery:

    [programme-director] ROLE ABORTED: Page.evaluate: Target page, context or
    browser has been closed

The engine already isolates *roles* from each other and relaunches the browser
between them — but within a role, one crashing page still takes the whole role
down, which is how the single most important role in the portal (the final
sanctioning authority) captured 0 screens.

This driver isolates *routes*: one fresh context per route, browser relaunched on
death, and route discovery that falls back to a declared list when the nav can't be
read. It reuses the engine's `EXTRACT_JS` / `UNCLIP_JS` / `settle_height` / `shoot` /
`slugify` verbatim so its output lands in the identical PNG+JSON format and merges
into the same `_captured.json`. Per `.claude/rules/design-audit.md`, an interactive
per-project driver is expected; duplicating the engine's deterministic scripts is not.

Usage:
    python3 capture_resilient.py programme-director [more-roles...]
"""
import json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ENGINE = os.path.join(os.path.dirname(os.path.dirname(HERE)), "design-audit", "engine")
if not os.path.isdir(ENGINE):  # running from the repo root layout
    ENGINE = os.path.abspath(os.path.join(HERE, "..", "..", "engine"))
sys.path.insert(0, ENGINE)

import capture as CAP          # noqa: E402
import config as C             # noqa: E402
from playwright.sync_api import sync_playwright  # noqa: E402

# Routes to try when live nav discovery crashes the renderer. Derived from the
# shipped JS bundle's route table plus the nav shape observed on the roles that
# captured cleanly. Anything that 404s or redirects is simply skipped.
FALLBACK_ROUTES = {
    # Verified in a headed browser 2026-08-12: the Programme Director's sidebar carries
    # exactly these three, and only NGO Directory renders anything. The other two redirect
    # to /dashboard/sm2/pd, which is blank. Captured anyway so the emptiness is on record.
    "programme-director": [
        "/dashboard",
        "/dashboard/sm2/pd",
        "/dashboard/ngo-directory",
        "/dashboard/sm2/audit",
        "/dashboard/notifications",
    ],
}


# The programme-director landing page (/dashboard/sm2/pd) OOMs the renderer with the
# default heap. Raising it and using /tmp instead of the small default /dev/shm is what
# makes that role capturable at all.
LAUNCH_ARGS = [
    "--disable-dev-shm-usage",
    "--js-flags=--max-old-space-size=4096",
]

# A light page to bounce onto straight after login, so the session is banked before the
# heavy landing route gets a chance to kill the context.
SAFE_ROUTE = "/dashboard/notifications"


def _launch(p):
    return p.chromium.launch(channel="chrome", headless=True, args=LAUNCH_ARGS)


def _new_ctx(browser, cfg, storage):
    return browser.new_context(
        viewport={"width": cfg["capture"]["width"], "height": 1000},
        device_scale_factor=cfg["capture"].get("dpr", 2),
        storage_state=storage if storage and os.path.exists(storage) else None,
    )


def _login_and_save(p, browser, role, cfg, paths):
    """Log in once and persist storage_state so per-route contexts skip the form."""
    auth = cfg["live"]["auth"]
    store = os.path.join(paths["auth"], f"{role['name']}.json")
    ctx = _new_ctx(browser, cfg, None)
    pg = ctx.new_page()

    # Hand-rolled login rather than CAP.do_login: the engine's version waits 4.5s on the
    # landing page after submitting, which is exactly when this portal's heaviest dashboard
    # renders and takes the renderer with it. Bank the session first, explore second.
    if not role.get("pass"):
        print(f"[{role['name']}] SKIP — missing credentials", flush=True)
        ctx.close()
        return None, None
    # NOTE: an earlier version installed a catch-all ctx.route() here to starve the landing
    # route of images/media/fonts. It was removed: intercepting every request made page loads
    # pathologically slow (a single login never completed in 20 minutes), and it turned out to
    # be unnecessary — the programme-director console is not heavy, it is EMPTY. See the
    # INVENTORY's Programme Director entry.

    pg.goto(role["base"] + auth.get("loginPath", "/login"),
            wait_until="domcontentloaded", timeout=60000)
    pg.wait_for_timeout(2500)
    pg.fill(auth["userField"], role["user"])
    pg.fill(auth["passField"], role["pass"])
    (pg.query_selector(auth["submit"]) or pg.query_selector("button")).click()
    # Short wait: long enough for the auth response to persist its token, short enough to
    # beat the client-side redirect into the route that kills the renderer.
    pg.wait_for_timeout(900)
    try:
        pg.goto(role["base"] + SAFE_ROUTE, wait_until="domcontentloaded", timeout=30000)
        pg.wait_for_timeout(1500)
    except Exception:
        pass

    landing = pg.url.replace(role["base"], "").split("?")[0]
    if auth.get("loginMarker", "/login") in pg.url:
        pg.wait_for_timeout(3000)          # slow auth round-trip; give it one more chance
        landing = pg.url.replace(role["base"], "").split("?")[0]
        if auth.get("loginMarker", "/login") in pg.url:
            print(f"[{role['name']}] LOGIN FAILED -> {pg.url}", flush=True)
            ctx.close()
            return None, None
    print(f"[{role['name']}] logged in -> {pg.url}", flush=True)

    # Bank the session immediately, off the heavy landing route.
    try:
        pg.goto(role["base"] + SAFE_ROUTE, wait_until="domcontentloaded", timeout=30000)
        pg.wait_for_timeout(1200)
    except Exception:
        pass
    try:
        ctx.storage_state(path=store)
    except Exception as e:
        print(f"[{role['name']}] could not bank session ({str(e)[:50]})", flush=True)
        store = None

    try:
        routes = CAP.discover_routes(pg, cfg)
    except Exception as e:
        print(f"[{role['name']}] nav discovery failed ({str(e)[:50]}) — using fallback list", flush=True)
        routes = []
    try:
        ctx.close()
    except Exception:
        pass
    if landing and landing not in routes:
        routes.insert(0, landing)
    if not routes:
        routes = FALLBACK_ROUTES.get(role["name"], ["/dashboard"])
    return store, routes


def capture_one(browser, role, cfg, paths, store, path):
    """Capture a single route in its own context. Returns a manifest row or None."""
    base, width = role["base"], cfg["capture"]["width"]
    slug = CAP.slugify(role["name"], path)
    ctx = _new_ctx(browser, cfg, store)
    pg = ctx.new_page()
    try:
        try:
            pg.goto(base + path, wait_until="networkidle", timeout=45000)
        except Exception:
            pg.goto(base + path, wait_until="domcontentloaded", timeout=45000)
        pg.wait_for_timeout(cfg["capture"].get("waitMs", 1800))
        if cfg["live"]["auth"].get("loginMarker", "/login") in pg.url:
            print(f"  - {slug}: redirected to login (not authorised for this role)", flush=True)
            return None
        settled = CAP.settle_height(pg, CAP.UNCLIP_JS, width=width, base_h=1000)
        png = os.path.join(paths["captures_live"], f"{slug}.png")
        CAP.shoot(pg, png, settled, cfg["capture"].get("dpr", 2), width)
        data = pg.evaluate(CAP.EXTRACT_JS)
        data.update(role=role["name"], route=path, slug=slug,
                    figmaImg=None, url=base + path)
        json.dump(data, open(os.path.join(paths["captures_live"], f"{slug}.json"), "w"), indent=2)
        png_h = CAP.png_height_1440(png, width)
        delta = abs(png_h - data["pageH"]) if png_h else None
        warn = "" if (delta is not None and delta <= 40) else f"  <-- HEIGHT MISMATCH png={png_h}"
        print(f"  ok {slug}: {len(data['rows'])} rows pageH={data['pageH']}{warn}", flush=True)
        return {"slug": slug, "role": role["name"], "route": path, "url": base + path,
                "png": f"captures/live/{slug}.png", "rows": len(data["rows"]),
                "pageH": data["pageH"], "pngH": png_h, "truncated": False}
    finally:
        try:
            ctx.close()
        except Exception:
            pass


def run(role_names):
    cfg, paths = C.load("e-anudaan")
    roles = [r for r in cfg["live"]["roles"] if r["name"] in role_names]
    if not roles:
        print(f"no matching roles for {role_names}")
        return
    mpath = os.path.join(paths["captures"], "_captured.json")
    manifest = json.load(open(mpath)) if os.path.exists(mpath) else []
    added = 0

    with sync_playwright() as p:
        browser = _launch(p)
        for role in roles:
            try:
                store, routes = _login_and_save(p, browser, role, cfg, paths)
            except Exception as e:
                if not browser.is_connected():
                    browser = _launch(p)
                print(f"[{role['name']}] LOGIN ABORTED: {str(e)[:90]}", flush=True)
                continue
            if not routes:
                continue
            print(f"[{role['name']}] {len(routes)} routes to capture", flush=True)
            for path in routes:
                if not browser.is_connected():
                    print("  (browser died — relaunching)", flush=True)
                    browser = _launch(p)
                try:
                    row = capture_one(browser, role, cfg, paths, store, path)
                except Exception as e:
                    print(f"  ! {CAP.slugify(role['name'], path)}: {str(e)[:70]}", flush=True)
                    row = None
                if row:
                    manifest = [m for m in manifest if m["slug"] != row["slug"]]
                    manifest.append(row)
                    added += 1

        try:
            browser.close()
        except Exception:
            pass

    json.dump(manifest, open(mpath, "w"), indent=2)
    print(f"CAPTURED {added} screens (manifest now {len(manifest)})", flush=True)


if __name__ == "__main__":
    run(sys.argv[1:] or ["programme-director"])
