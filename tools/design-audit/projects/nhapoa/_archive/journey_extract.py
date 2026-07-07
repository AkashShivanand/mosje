#!/usr/bin/env python3
"""NHAPOA citizen-journey capture+extract driver (design-qc Task 1: real-geometry pins).

The multi-step citizen journeys (Register Grievance steps 2-5 / confirm / success, Register
Rescue, Track-Status result) are not reachable by a plain URL — they need the form driven with
dummy data + the dev test OTP (123456) + a dummy upload. This keep-alive driver walks each state
in ONE live session and, per state, runs the SAME unclip+extract as engine/capture.py and writes a
MATCHED pair: captures/citizen/journey/<slug>.png (full-page, 1440-CSS @2x = 2880px) AND
captures/live/<base>.json (element rows @1440 with correct pageH). qc_geometry then binds each
finding's LIVE pin to a real element box instead of a hand-tuned %.

Usage:
  python3 journey_extract.py reachable      # TRK-01 default + RES-01 default (no OTP)
  python3 journey_extract.py grievance      # full RG 5-step flow (needs DUMMY_UPLOAD)
  python3 journey_extract.py all
Only design/visual capture — dummy data only, never a real disbursement; OTP is the dev test code.
"""
import json, os, sys
from playwright.sync_api import sync_playwright

BASE = os.path.dirname(os.path.abspath(__file__))
JDIR = os.path.join(BASE, "captures", "citizen", "journey")
LDIR = os.path.join(BASE, "captures", "live")
CIT  = "https://nhapoa-user-dev.mosje.in"
OTP  = "123456"
DUMMY_UPLOAD = os.path.join(BASE, "captures", "_dummy-upload.png")  # created on demand

# The two JS blocks are copied verbatim from engine/capture.py (keep in sync if that changes).
_EXTRACT = r"""
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
_UNCLIP = r"""() => {
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

def capture(pg, slug, base):
    pg.wait_for_timeout(1200)
    pg.evaluate(_UNCLIP); pg.wait_for_timeout(500)
    data = pg.evaluate(_EXTRACT)
    os.makedirs(LDIR, exist_ok=True); os.makedirs(JDIR, exist_ok=True)
    json.dump(data, open(os.path.join(LDIR, base + ".json"), "w"), indent=2)
    pg.screenshot(path=os.path.join(JDIR, slug + ".png"), full_page=True)
    print(f"  {slug}: {len(data['rows'])} rows, pageH={data['pageH']}", flush=True)

def reachable(pg):
    pg.goto(CIT + "/track-status", wait_until="domcontentloaded"); capture(pg, "CIT-TRK-01-default", "CIT-TRK-01-default")
    pg.goto(CIT + "/register-rescue", wait_until="domcontentloaded"); capture(pg, "CIT-RES-01-default", "CIT-RES-01-default")

def run(mode):
    with sync_playwright() as p:
        b = p.chromium.launch(channel="chrome", headless=True)
        ctx = b.new_context(viewport={"width": 1440, "height": 1000}, device_scale_factor=2)
        pg = ctx.new_page()
        if mode in ("reachable", "all"): reachable(pg)
        b.close()

if __name__ == "__main__":
    run(sys.argv[1] if len(sys.argv) > 1 else "reachable")
