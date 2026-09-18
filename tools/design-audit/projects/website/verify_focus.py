#!/usr/bin/env python3
"""Judge each Tab stop from verify_focus.mjs on its pixels: focused vs blurred, same region.

A stop has a visible focus indicator when enough of its region changes between the two states. The
threshold is 1.5% of the region's pixels changing by more than a small tolerance — a 2px ring round
a 100×40 button changes ~9%; JPEG-free PNG noise changes 0%.

  python3 verify_focus.py      # writes out/focus-verdicts.json
"""
import json, os, collections
from PIL import Image, ImageChops

BASE = os.path.dirname(os.path.abspath(__file__))
F = os.path.join(BASE, "captures", "focus")
THRESH = 0.015


def changed(a, b):
    a, b = Image.open(a).convert("RGB"), Image.open(b).convert("RGB")
    if a.size != b.size:
        return 1.0
    diff = ImageChops.difference(a, b).convert("L").point(lambda v: 255 if v > 24 else 0)
    return sum(1 for v in diff.getdata() if v) / (a.size[0] * a.size[1])


def main():
    rows = json.load(open(os.path.join(F, "_focus.json")))
    out = []
    for r in rows:
        if not r.get("focused"):
            continue
        frac = changed(os.path.join(F, r["focused"]), os.path.join(F, r["blurred"]))
        r["changedFraction"] = round(frac, 4)
        r["indicator"] = frac >= THRESH
        out.append(r)
    none = [r for r in out if not r["indicator"]]
    by = collections.Counter((r["tag"], r["text"][:30]) for r in none)
    json.dump({"stops": len(out), "withoutIndicator": len(none),
               "pages": sorted({r["slug"] for r in out}), "rows": out},
              open(os.path.join(BASE, "out", "focus-verdicts.json"), "w"), indent=1)
    print(f"tab stops judged: {len(out)}; with a visible indicator: {len(out) - len(none)}; "
          f"WITHOUT: {len(none)} on {len({r['slug'] for r in none})} pages")
    for k, v in by.most_common(15):
        print(f"  {v:3}  {k}")


if __name__ == "__main__":
    main()
