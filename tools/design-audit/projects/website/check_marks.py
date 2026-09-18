#!/usr/bin/env python3
"""Prove every mark sits on something before it is drawn.

A box comes from the DOM; the outline is drawn on a screenshot. They agree for ordinary page
content, and they can disagree where the page was scroll-locked or an overlay was open when the
full-page screenshot was stitched. A mark that has drifted points the developer at the wrong
element, which is worse than no mark at all.

So each mark is checked against the capture's own pixels:
  · the box must lie inside the image;
  · the crop must not be blank (a single flat colour) — an element renders something;
  · for a finding about text, the crop must carry ink between 1% and 70% of its area.

Failures keep their finding — the measurement is still true — but lose the mark and are listed in
out/unplaced-marks.json so the board shows the page rather than an outline in the wrong place.

  python3 check_marks.py
"""
import json, os, collections
from PIL import Image

Image.MAX_IMAGE_PIXELS = None
BASE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(BASE, "out")
TEXTY = {"A-CONTRAST", "A-CONTRAST-NONTEXT", "U-TYPE-SCALE", "U-FONT", "A-H1", "A-HEADING-ORDER",
         "DVB-SPEC"}


def basis_for(f):
    if f.get("liveBasis"):
        return f["liveBasis"]
    if f.get("viewport") == "desktop":
        return 1440
    return 320 if "320" in (f.get("slug") or "") else 375


def check(img, box, basis, texty):
    w, h = img.size
    sc = w / float(basis)
    x1, y1, x2, y2 = [v * sc for v in box]
    if x2 <= 0 or y2 <= 0 or x1 >= w or y1 >= h:
        return "outside the capture"
    if y2 > h + 2:
        return "below the capture (page was shorter than the DOM said)"
    crop = img.crop((max(0, int(x1)), max(0, int(y1)), min(w, int(x2)), min(h, int(y2)))).convert("RGB")
    if crop.width < 2 or crop.height < 2:
        return "box too small to verify"
    px = list(crop.getdata())
    counts = collections.Counter(px)
    if len(counts) == 1:
        return "nothing rendered in this box"
    if texty:
        bg = counts.most_common(1)[0][1] / len(px)
        if bg > 0.995:
            return "no ink in this box"
        if bg < 0.30:
            return "box does not look like text"
    return None


def main():
    findings = json.load(open(os.path.join(OUT, "findings-auto.json")))
    design = json.load(open(os.path.join(OUT, "findings-design.json")))
    cache, unplaced, checked = {}, [], 0
    for f in findings + design:
        box = f.get("box")
        png = f.get("png") or f.get("livePng")
        if not box or not png:
            continue        # page-level finding: the card carries it, no mark is drawn
        p = os.path.join(BASE, png)
        if not os.path.exists(p):
            f["box"] = None
            unplaced.append({"id": f.get("id"), "slug": f.get("slug"), "code": f["code"],
                             "reason": "capture missing"})
            continue
        if p not in cache:
            cache.clear()
            cache[p] = Image.open(p)
        checked += 1
        why = check(cache[p], box, basis_for(f), f["code"] in TEXTY)
        if why:
            f["box"] = None
            f["unplaced"] = why
            unplaced.append({"id": f.get("id"), "slug": f.get("slug"), "viewport": f.get("viewport"),
                             "code": f["code"], "element": f.get("element"), "reason": why})
    json.dump(findings, open(os.path.join(OUT, "findings-auto.json"), "w"), indent=1)
    json.dump(design, open(os.path.join(OUT, "findings-design.json"), "w"), indent=1)
    json.dump({"checked": checked, "unplaced": len(unplaced),
               "byReason": dict(collections.Counter(u["reason"] for u in unplaced)),
               "rows": unplaced}, open(os.path.join(OUT, "unplaced-marks.json"), "w"), indent=1)
    print(f"marks checked: {checked}; unplaced: {len(unplaced)}")
    for k, v in collections.Counter(u["reason"] for u in unplaced).most_common():
        print(f"  {v:5}  {k}")
    print("  top slugs:", collections.Counter(u.get("slug") for u in unplaced).most_common(6))


if __name__ == "__main__":
    main()
