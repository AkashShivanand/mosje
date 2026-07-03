#!/usr/bin/env python3
"""Capture live screens (authenticated) + their computed CSS for spec comparison.

Reads screens.json (list of {slug,url,width,dpr,selectors}) and writes, per screen:
  captures/live/<SLUG>.png            full-page screenshot at the given dpr (use 2 for sharp report)
  captures/live/<SLUG>.styles.json    {selectorName: {prop: computedValue, ...}, ...}

Usage:  python3 capture.py [--screens screens.json] [--state .qc/storage-state.json] [--out captures/live]

Requires: pip install playwright ; playwright install chromium
"""
import json, os, argparse
from playwright.sync_api import sync_playwright

PROPS = ["font-family","font-size","font-weight","line-height","letter-spacing","color",
         "background-color","border","border-color","border-width","border-radius",
         "padding","padding-top","padding-right","padding-bottom","padding-left",
         "margin","width","height","box-shadow","text-transform","display"]

def computed_for(page, selector):
    return page.eval_on_selector(selector, """(el, props) => {
        const cs = getComputedStyle(el); const o = {};
        for (const p of props) o[p] = cs.getPropertyValue(p);
        const r = el.getBoundingClientRect(); o["__rect"] = {w: Math.round(r.width), h: Math.round(r.height)};
        return o;
    }""", PROPS)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--screens", default="screens.json")
    ap.add_argument("--state", default=".qc/storage-state.json")
    ap.add_argument("--out", default="captures/live")
    a = ap.parse_args()
    screens = json.load(open(a.screens))
    os.makedirs(a.out, exist_ok=True)
    state = a.state if os.path.exists(a.state) else None
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        for s in screens:
            ctx = browser.new_context(viewport={"width": s.get("width",1440), "height": 900},
                                      device_scale_factor=s.get("dpr",2), storage_state=state)
            page = ctx.new_page()
            page.goto(s["url"], wait_until="networkidle")
            page.wait_for_timeout(1200)
            png = os.path.join(a.out, f"{s['slug']}.png")
            page.screenshot(path=png, full_page=True)
            styles = {}
            for name, sel in (s.get("selectors") or {}).items():
                try: styles[name] = computed_for(page, sel)
                except Exception as e: styles[name] = {"__error": str(e)}
            json.dump(styles, open(os.path.join(a.out, f"{s['slug']}.styles.json"), "w"), indent=2)
            print(f"captured {s['slug']}: {png} (+ {len(styles)} computed selectors)")
            ctx.close()
        browser.close()

if __name__ == "__main__":
    main()
