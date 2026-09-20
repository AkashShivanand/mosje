#!/usr/bin/env python3
"""Measure the DESIGN's own text contrast: the designer's chosen colour against the ground it is
actually drawn on.

Three methods were tried, and the first two were wrong in ways worth remembering:
  1. Ground from the Figma node tree (smallest enclosing filled box) — picks a section band instead
     of the pale pill or card the text sits on. Two of three sampled pairs were false.
  2. Foreground AND ground from pixels — small text has no single pure-colour core in a 1x export,
     so white-on-blue read as an anti-aliased #81B9EF at 2.24:1, inflating failures to 6,880.
  3. (this) Foreground = the node's own declared fill; ground = the dominant tone of the pixels in
     the node's box, stepping to the next tone when the glyph itself dominates (large bold text),
     skipping a grey scrim behind an open sheet or menu, and skipping boxes where nothing
     distinguishable is painted.

  python3 analyze_design_pixels.py     # writes out/design-contrast.json
"""
import json, os, glob, collections
from PIL import Image

Image.MAX_IMAGE_PIXELS = None
BASE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(BASE, "out")
os.makedirs(OUT, exist_ok=True)
SCRIM_WORDS = ("sheet", "modal", "menu", "dropdown", "popup", "overlay", "quick view", "consent")


def lum(c):
    def ch(v):
        v = v / 255
        return v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
    return 0.2126 * ch(c[0]) + 0.7152 * ch(c[1]) + 0.0722 * ch(c[2])


def ratio(a, b):
    l1, l2 = lum(a), lum(b)
    hi, lo = max(l1, l2), min(l1, l2)
    return round((hi + 0.05) / (lo + 0.05), 2)


def hexs(c):
    return "#%02X%02X%02X" % tuple(int(v) for v in c[:3])


def rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def ground(img, box, basis, fg):
    w, h = img.size
    sc = w / float(basis)
    x1, y1, x2, y2 = [v * sc for v in box]
    x1, y1 = max(0, int(x1)), max(0, int(y1))
    x2, y2 = min(w, int(x2)), min(h, int(y2))
    if x2 - x1 < 3 or y2 - y1 < 3:
        return None
    px = list(img.crop((x1, y1, x2, y2)).convert("RGB").getdata())
    if len(px) < 20:
        return None
    ranked = collections.Counter(px).most_common()
    bg = ranked[0][0]
    if ratio(bg, fg) < 1.15:        # the glyph fills most of its own box
        bg = next((c for c, n in ranked if ratio(c, fg) >= 1.15 and n >= len(px) * 0.05), None)
    if bg is None:
        return None
    by_lum = sorted(px, key=lum)
    k = max(3, len(px) // 8)
    if ratio(by_lum[k // 2], by_lum[-k // 2]) < 1.05:
        return None                  # nothing painted in this box
    return bg


def visible(img, box, basis, fg, tol=38):
    """Is the text's own colour actually painted in its box? If no pixel comes near it, something
    covers the text — a modal scrim, a bottom sheet — and the page behind an open overlay is not a
    contrast defect. (Three of six sampled pairs were exactly this: masthead text dimmed behind a
    Booking modal and a Biographical Sketch sheet.)"""
    w, h = img.size
    sc = w / float(basis)
    x1, y1, x2, y2 = [v * sc for v in box]
    crop = img.crop((max(0, int(x1)), max(0, int(y1)), min(w, int(x2)), min(h, int(y2)))).convert("RGB")
    return any(abs(p[0] - fg[0]) + abs(p[1] - fg[1]) + abs(p[2] - fg[2]) <= tol for p in crop.getdata())


def disabled(spec, box):
    """WCAG exempts inactive controls from contrast: skip text inside a Disabled-state instance."""
    for i in spec.get("instances", []):
        b = i.get("box") or {}
        if not b:
            continue
        if b["x"] <= box[0] + 2 and b["y"] <= box[1] + 2 and b["x"] + b["w"] >= box[2] - 2 \
                and b["y"] + b["h"] >= box[3] - 2:
            props = " ".join(str(v) for v in (i.get("componentProperties") or {}).values())
            if "Disabled" in props or "State=Disabled" in (i.get("mainComponent") or ""):
                return True
    return False


def is_scrim(c):
    return abs(c[0] - c[1]) < 6 and abs(c[1] - c[2]) < 6 and 90 < c[0] < 160


def main():
    rows, checked = [], 0
    for spec_path in sorted(glob.glob(os.path.join(BASE, "inputs", "figma-specs", "*.json"))):
        slug = os.path.basename(spec_path)[:-5]
        png = os.path.join(BASE, "captures", "figma", slug + ".png")
        if not os.path.exists(png):
            continue
        spec = json.load(open(spec_path))
        basis = spec.get("width") or 1440
        overlayish = any(w in (spec.get("name") or "").lower() for w in SCRIM_WORDS)
        img = Image.open(png)
        seen = set()
        for t in spec.get("texts", []):
            size = t.get("fontSize") or 0
            fill = ((t.get("fill") or {}).get("hex") or "").upper()
            opacity = (t.get("fill") or {}).get("opacity", 1) or 1
            b = t.get("box") or {}
            chars = (t.get("characters") or "").strip()
            if not size or not chars or not b.get("w") or len(fill) != 7 or opacity < 0.99:
                continue
            fg = rgb(fill)
            box = [b["x"], b["y"], b["x"] + b["w"], b["y"] + b["h"]]
            bg = ground(img, box, basis, fg)
            checked += 1
            if bg is None or (overlayish and is_scrim(bg)) or is_scrim(bg):
                continue
            if not visible(img, box, basis, fg) or disabled(spec, box):
                continue
            weight = t.get("fontWeight") or 400
            need = 3.0 if (size >= 24 or (size >= 18.66 and weight >= 700)) else 4.5
            r = ratio(fg, bg)
            if r >= need:
                continue
            key = (fill, hexs(bg), int(size))
            if key in seen:
                continue
            seen.add(key)
            rows.append({"frame": spec.get("name"), "slug": slug, "node": t.get("id"),
                         "text": chars[:60], "fg": fill, "bg": hexs(bg), "ratio": r,
                         "size": size, "weight": weight, "need": need,
                         "box": [round(v) for v in box], "basis": basis})
        img.close()
    by_pair = collections.Counter(f"{r['fg']} on {r['bg']}" for r in rows)
    out = {"textNodesChecked": checked, "failures": len(rows),
           "framesAffected": len({r["slug"] for r in rows}),
           "byPair": dict(by_pair.most_common(15)), "rows": rows}
    json.dump(out, open(os.path.join(OUT, "design-contrast.json"), "w"), indent=1)
    print(f"design text nodes checked: {checked}; distinct failures: {len(rows)} "
          f"across {out['framesAffected']} frames")
    for k, v in by_pair.most_common(12):
        print(f"  {v:4}  {k}")


if __name__ == "__main__":
    main()
