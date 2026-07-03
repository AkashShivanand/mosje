#!/usr/bin/env python3
"""Extract structured element specs from a LIVE page (the BUILD ground truth).
Emits one row per visible text/interactive element: text, role, bbox (CSS px @1440),
font {family,size,weight}, colour, bg, radius, padding — plus the page's CSS height
(so pins map into the capture's coordinate space). Public pages: direct. Authed: pass
--login to open headful and wait for manual login (sessionStorage-safe keep-alive)."""
import json, sys, argparse
from playwright.sync_api import sync_playwright

EXTRACT_JS = r"""
() => {
  const px = v => Math.round(parseFloat(v)||0);
  const seen = new WeakSet();
  const rows = [];
  const els = document.querySelectorAll('h1,h2,h3,h4,h5,h6,button,a,label,p,span,th,td,input,textarea,select,li,[role=button],[role=tab]');
  for (const el of els) {
    const r = el.getBoundingClientRect();
    if (r.width < 4 || r.height < 4) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) continue;
    // direct text only (avoid double-counting container text)
    let text = '';
    for (const n of el.childNodes) if (n.nodeType === 3) text += n.textContent;
    text = text.replace(/\s+/g,' ').trim();
    const ph = (el.tagName==='INPUT'||el.tagName==='TEXTAREA') ? (el.placeholder||'') : '';
    if (!text && !ph && !['BUTTON','A','INPUT','TEXTAREA','SELECT'].includes(el.tagName)) continue;
    rows.push({
      tag: el.tagName.toLowerCase(),
      role: el.getAttribute('role') || null,
      text: (text||ph).slice(0,80),
      isPlaceholder: !text && !!ph,
      x: Math.round(r.left + window.scrollX), y: Math.round(r.top + window.scrollY),
      w: Math.round(r.width), h: Math.round(r.height),
      fontFamily: cs.fontFamily.split(',')[0].replace(/["']/g,''),
      fontSize: px(cs.fontSize), fontWeight: cs.fontWeight,
      lineHeight: cs.lineHeight==='normal'?null:px(cs.lineHeight),
      color: cs.color, bg: cs.backgroundColor,
      radius: px(cs.borderTopLeftRadius),
      padding: [px(cs.paddingTop),px(cs.paddingRight),px(cs.paddingBottom),px(cs.paddingLeft)],
      borderStyle: cs.borderStyle, borderColor: cs.borderColor,
    });
  }
  return { pageW: document.documentElement.scrollWidth,
           pageH: document.documentElement.scrollHeight, rows };
}
"""

def run(url, width, out, login=False, marker="/login", timeout=300):
    with sync_playwright() as p:
        b = p.chromium.launch(channel="chrome", headless=not login)
        ctx = b.new_context(viewport={"width": width, "height": 1000}, device_scale_factor=1)
        pg = ctx.new_page()
        pg.goto(url, wait_until="domcontentloaded", timeout=60000); pg.wait_for_timeout(3000)
        if login:
            print(">>> Log in, then this auto-continues...", flush=True); w=0
            while w < timeout and marker in pg.url: pg.wait_for_timeout(2000); w+=2
            pg.goto(url, wait_until="domcontentloaded", timeout=60000); pg.wait_for_timeout(3000)
        data = pg.evaluate(EXTRACT_JS)
        json.dump(data, open(out, "w"), indent=2)
        print(f"  {out}: {len(data['rows'])} rows, pageH={data['pageH']}", flush=True)
        b.close()

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--url", required=True); ap.add_argument("--out", required=True)
    ap.add_argument("--width", type=int, default=1440); ap.add_argument("--login", action="store_true")
    a = ap.parse_args(); run(a.url, a.width, a.out, a.login)
