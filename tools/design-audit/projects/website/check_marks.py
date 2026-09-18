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


def painted(img, box, basis, hexcol, tol=40, min_share=0.015):
    """Is this colour actually drawn inside the box? It is the strongest proof a mark sits on its
    element: the element's own text colour must appear where the outline is drawn."""
    if not hexcol or len(hexcol) < 7:
        return None
    c = tuple(int(hexcol[i:i + 2], 16) for i in (1, 3, 5))
    w, h = img.size
    sc = w / float(basis)
    x1, y1, x2, y2 = [v * sc for v in box]
    X1, Y1, X2, Y2 = max(0, int(x1)), max(0, int(y1)), min(w, int(x2)), min(h, int(y2))
    if X2 <= X1 or Y2 <= Y1:
        return False                   # the box lies outside the image: nothing of it is painted
    crop = img.crop((X1, Y1, X2, Y2)).convert("RGB")
    px = list(crop.getdata())
    # A single stray pixel of the right colour is not the element: its ink must cover a real share
    # of the box. The "10px text" mark passed an any-pixel test while pointing at empty space.
    hit = sum(1 for p in px if abs(p[0] - c[0]) + abs(p[1] - c[1]) + abs(p[2] - c[2]) <= tol)
    return hit >= max(3, len(px) * min_share)


_TEMPLATE = {}


def _masthead_template(basis):
    """The phone masthead as it looks when painted at the top of a page: taken from the phone capture
    whose top strip carries the most detail (the masthead is identical on every page)."""
    import numpy as np, glob
    if basis in _TEMPLATE:
        return _TEMPLATE[basis]
    best, best_std = None, 0
    for p in sorted(glob.glob(os.path.join(BASE, "captures", "live", "*.mobile.png"))):
        im = Image.open(p).convert("L")
        sc = im.size[0] / float(basis)
        strip = np.asarray(im.crop((0, 0, im.size[0], int(110 * sc))).resize((94, 28)), dtype=np.float32)
        if strip.std() > best_std:
            best, best_std = strip, float(strip.std())
    _TEMPLATE[basis] = best
    return best


def overlay_bands(img, basis, header_h=110):
    """Where the sticky masthead was painted somewhere other than the top of a phone capture.

    On 21 of 121 phone captures the masthead, fixed by script once the page scrolls, is drawn
    partway down the page and covers whatever the DOM says is there (the Tenders standfirst,
    18 Sep). A mark in that band points at the header. The band is found by sliding a clean masthead
    strip down the capture. Desktop captures do not show this and are not scanned."""
    import numpy as np
    if basis >= 700:
        return []
    tpl = _masthead_template(basis)
    if tpl is None:
        return []
    w, h = img.size
    sc = w / float(basis)
    step_px = 4 / 375 * basis          # 4 basis-px steps
    small = img.convert("L").resize((94, max(28, int(h * 94 / w))))
    a = np.asarray(small, dtype=np.float32)
    k = 94 / float(basis)              # small-image px per basis px
    th = tpl.shape[0]
    bands, y = [], 1
    while y + th < a.shape[0]:
        if float(np.abs(a[y:y + th] - tpl).mean()) < 9.0:
            y0 = y / k
            if y0 > 30:                # not the masthead in its proper place
                bands.append((y0, y0 + header_h))
            y += th
        else:
            y += 1
    return bands


_BAND = {}


def masthead_band(slug, viewport):
    """Where the masthead actually sits in this capture, from the page's own DOM: the union of the
    'Gov. of India' strip, the emblem, the ministry lockup and the header search. Returns (y0, y1,
    texts) or None. When y0 is well below the top, the masthead was painted over the page content."""
    k = (slug, viewport)
    if k in _BAND:
        return _BAND[k]
    p = os.path.join(BASE, "captures", "live", f"{slug}.{viewport}.json")
    out = None
    if os.path.exists(p):
        d = json.load(open(p))
        dbim = d.get("dbim") or {}
        boxes = [v["bbox"] for kk, v in dbim.items() if kk in ("emblem", "ministryLockup", "languageToggle")
                 and isinstance(v, dict) and v.get("bbox") and v["bbox"].get("h")]
        gov = [e["bbox"] for e in d.get("elements", []) if (e.get("text") or "").strip().startswith("Gov")
               and e["bbox"]["y"] < 2000]
        boxes += gov[:1]
        if boxes:
            y0 = min(b["y"] for b in boxes)
            y1 = max(b["y"] + b["h"] for b in boxes) + 60     # + the header search row
            texts = {(e.get("text") or "").strip().lower() for e in d.get("elements", [])
                     if y0 <= e["bbox"]["y"] <= y1}
            out = (y0, y1, texts)
    _BAND[k] = out
    return out


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
    bands_cache = {}
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
        why = None
        band = masthead_band(f.get("slug"), f.get("viewport"))
        if band and band[0] > 60 and box[1] < band[1] and box[3] > band[0] \
                and (f.get("element") or "").strip().lower() not in band[2]:
            why = "the masthead is painted over this box in the capture (sticky header, displaced)"
        why = why or check(cache[p], box, basis_for(f), f["code"] in TEXTY)
        if not why and f.get("cssFg") and painted(cache[p], box, basis_for(f), f["cssFg"]) is False:
            why = f"the element's colour {f['cssFg']} is not painted in this box — the mark would miss it"
        if why:
            f["box"] = None
            f["unplaced"] = why
            unplaced.append({"id": f.get("id"), "slug": f.get("slug"), "viewport": f.get("viewport"),
                             "code": f["code"], "element": f.get("element"), "reason": why})
    fcache = {}
    for f in design:
        fb, fpng = f.get("figmaBoxRaw"), f.get("figmaPng")
        if not fb or not fpng or not f.get("figmaFg"):
            continue
        p = os.path.join(BASE, fpng)
        if not os.path.exists(p):
            f["figmaBoxRaw"] = None
            continue
        if p not in fcache:
            fcache.clear()
            fcache[p] = Image.open(p)
        if painted(fcache[p], fb, f.get("figmaBasis") or 1440, f["figmaFg"]) is False:
            f["figmaBoxRaw"] = None
            unplaced.append({"id": f.get("id"), "slug": f.get("slug"), "code": f["code"], "side": "figma",
                             "element": f.get("element"), "reason": "design colour not painted in the design box"})
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
