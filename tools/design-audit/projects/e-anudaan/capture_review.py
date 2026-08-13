#!/usr/bin/env python3
"""Capture the E-Anudaan review/detail screens.

WHY A DRIVER IS NEEDED
----------------------
The engine's route discovery reads the sidebar, and NOTHING in any sidebar links to
`/dashboard/**/review/:id`. Those screens are reached only from a table row's "Review"
action, so the declarative crawl cannot see them — yet they are the highest-value screens
in the portal: the whole ten-grade approval chain is one review screen with a different
action bar. Building them from inference would be the single biggest guess in the clone.

Per `.claude/rules/design-audit.md`, an interactive per-project driver is the sanctioned
escape hatch for exactly this. It reuses the engine's EXTRACT_JS / UNCLIP_JS / settle /
shoot / slugify verbatim so output lands in the same PNG+JSON format and merges into the
same `_captured.json`.

SAFETY
------
Read-only. It navigates to detail URLs harvested from the dashboard's own links and, at
most, clicks *tab* controls inside the detail view to reveal panels. It never clicks an
action button (Forward / Approve / Reject / Raise deficiency), never submits a form, and
never commits a workflow transition against the live dev environment.

Usage:
    python3 capture_review.py [role ...]        # default: one PD grade + one IFD grade
"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ENGINE = os.path.abspath(os.path.join(HERE, "..", "..", "engine"))
sys.path.insert(0, ENGINE)

import capture as CAP  # noqa: E402
import config as C  # noqa: E402
from playwright.sync_api import sync_playwright  # noqa: E402

DEFAULT_ROLES = ["pd-aso", "ifd-aso"]

# Never click anything whose label matches these — they commit a workflow transition.
DESTRUCTIVE = re.compile(
    r"forward|approve|reject|sanction|concur|submit|deficien|quer|return|save|confirm|delete|send",
    re.I,
)

# Worth revealing: panel/tab switches inside the detail view.
TABBY = re.compile(r"document|attachment|inspection|audit|history|timeline|remark|finance|detail", re.I)


def detail_links(pg, base, limit=3):
    """Harvest detail/review hrefs from whatever list page we are on."""
    hrefs = pg.evaluate(
        """() => [...document.querySelectorAll('a[href]')]
              .map(a => a.getAttribute('href'))
              .filter(h => h && /\\/(review|approve|application|inspect)\\//.test(h))"""
    )
    out = []
    for h in hrefs:
        h = h.split("?")[0].split("#")[0]
        if h.startswith("/") and h not in out:
            out.append(h)
    return out[:limit]


def click_review_button(pg):
    """Fallback when Review is a button, not a link: click the first one and return the URL."""
    before = pg.url
    btn = pg.query_selector("table tbody tr button:not([disabled])")
    if not btn:
        return None
    label = (btn.inner_text() or "").strip()
    if DESTRUCTIVE.search(label):
        return None  # never press an action button
    try:
        btn.click()
        pg.wait_for_timeout(2500)
    except Exception:
        return None
    return pg.url.replace(pg.url.split("/")[0] + "//" + pg.url.split("/")[2], "") if pg.url != before else None


def shoot_page(pg, cfg, paths, role_name, route_label, suffix=""):
    width = cfg["capture"]["width"]
    slug = CAP.slugify(role_name, route_label + suffix)
    settled = CAP.settle_height(pg, CAP.UNCLIP_JS, width=width, base_h=1000)
    png = os.path.join(paths["captures_live"], f"{slug}.png")
    CAP.shoot(pg, png, settled, cfg["capture"].get("dpr", 2), width)
    data = pg.evaluate(CAP.EXTRACT_JS)
    data.update(role=role_name, route=route_label + suffix, slug=slug, figmaImg=None, url=pg.url)
    json.dump(data, open(os.path.join(paths["captures_live"], f"{slug}.json"), "w"), indent=2)
    print(f"  ok {slug}: {len(data['rows'])} rows pageH={data['pageH']}", flush=True)
    return {
        "slug": slug, "role": role_name, "route": route_label + suffix, "url": pg.url,
        "png": f"captures/live/{slug}.png", "rows": len(data["rows"]),
        "pageH": data["pageH"], "pngH": None, "truncated": False,
    }


def run(role_names):
    cfg, paths = C.load("e-anudaan")
    auth = cfg["live"]["auth"]
    roles = [r for r in cfg["live"]["roles"] if r["name"] in role_names]
    mpath = os.path.join(paths["captures"], "_captured.json")
    manifest = json.load(open(mpath)) if os.path.exists(mpath) else []
    added = 0

    with sync_playwright() as p:
        browser = p.chromium.launch(channel="chrome", headless=True)
        for role in roles:
            ctx = browser.new_context(
                viewport={"width": cfg["capture"]["width"], "height": 1000},
                device_scale_factor=cfg["capture"].get("dpr", 2),
            )
            pg = ctx.new_page()
            try:
                if not CAP.do_login(pg, role, auth):
                    print(f"[{role['name']}] SKIP — missing credentials", flush=True)
                    ctx.close(); continue
                if auth.get("loginMarker", "/login") in pg.url:
                    print(f"[{role['name']}] LOGIN FAILED", flush=True)
                    ctx.close(); continue
                print(f"[{role['name']}] logged in -> {pg.url}", flush=True)
                base = role["base"]

                # Look for detail links on the landing worklist first, then on the
                # scheme worklist, which is where the Review action actually lives.
                candidates = detail_links(pg, base)
                if not candidates:
                    for probe in ("/dashboard/pd/us/all-applications", f"/dashboard/sm2/ifd{role['name'].split('-')[-1]}"):
                        try:
                            pg.goto(base + probe, wait_until="networkidle", timeout=45000)
                            pg.wait_for_timeout(cfg["capture"].get("waitMs", 2200))
                        except Exception:
                            continue
                        candidates = detail_links(pg, base)
                        if candidates:
                            print(f"[{role['name']}] found detail links via {probe}", flush=True)
                            break

                if not candidates:
                    url = click_review_button(pg)
                    if url:
                        candidates = [url]

                if not candidates:
                    print(f"[{role['name']}] no review/detail link found — Review may be JS-only", flush=True)
                    ctx.close(); continue

                for href in candidates:
                    try:
                        pg.goto(base + href, wait_until="networkidle", timeout=45000)
                    except Exception:
                        try:
                            pg.goto(base + href, wait_until="domcontentloaded", timeout=45000)
                        except Exception:
                            continue
                    pg.wait_for_timeout(cfg["capture"].get("waitMs", 2200))
                    if auth.get("loginMarker", "/login") in pg.url:
                        continue
                    # Normalise the id out of the slug so repeat runs overwrite one screen
                    # rather than accumulating one per application id.
                    label = re.sub(r"/\d{2,}(?=/|$)", "/_id", href)
                    row = shoot_page(pg, cfg, paths, role["name"], label)
                    manifest = [m for m in manifest if m["slug"] != row["slug"]]
                    manifest.append(row); added += 1

                    # Reveal each non-destructive tab inside the detail view.
                    tabs = pg.query_selector_all("[role=tab], nav button, .tab, [class*=tab] button")
                    seen = set()
                    for t in tabs[:8]:
                        try:
                            name = (t.inner_text() or "").strip()
                        except Exception:
                            continue
                        if not name or name in seen or DESTRUCTIVE.search(name) or not TABBY.search(name):
                            continue
                        seen.add(name)
                        try:
                            t.click(); pg.wait_for_timeout(1600)
                        except Exception:
                            continue
                        sfx = "--" + re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
                        row = shoot_page(pg, cfg, paths, role["name"], label, sfx)
                        manifest = [m for m in manifest if m["slug"] != row["slug"]]
                        manifest.append(row); added += 1
            except Exception as e:
                print(f"[{role['name']}] ABORTED: {str(e)[:110]}", flush=True)
            finally:
                try: ctx.close()
                except Exception: pass
        try: browser.close()
        except Exception: pass

    json.dump(manifest, open(mpath, "w"), indent=2)
    print(f"CAPTURED {added} screens (manifest now {len(manifest)})", flush=True)


if __name__ == "__main__":
    run(sys.argv[1:] or DEFAULT_ROLES)
