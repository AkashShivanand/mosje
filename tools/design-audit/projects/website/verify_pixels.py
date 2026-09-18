#!/usr/bin/env python3
"""Re-measure every contrast finding on the PIXELS of the capture, not on computed CSS.

Computed CSS lies in two directions, and both were found in this run:
  · an icon button carries an aria-label, so the DOM reports text in the button's own colour while
    what a citizen sees is an image — CSS said "#0373DF on #0373DF = 1:1", which is not a real
    defect;
  · text over a gradient or image has no CSS background at all, so a real failure can be missed.

This reads the element's own box out of the screenshot, separates foreground from background by
luminance clustering, and reports the ratio actually on screen. A finding whose pixel ratio passes
is WITHDRAWN (kept in the master's deferred list, never silently deleted); one that fails carries
the pixel-measured label from here on.

  python3 verify_pixels.py         # rewrites out/findings-auto.json, writes out/pixel-verify.json
"""
import json, os, re, collections
from PIL import Image

BASE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(BASE, "out")
MIN_PIXELS = 12


def lum(c):
    def ch(v):
        v = v / 255
        return v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
    return 0.2126 * ch(c[0]) + 0.7152 * ch(c[1]) + 0.0722 * ch(c[2])


def ratio(a, b):
    l1, l2 = lum(a), lum(b)
    hi, lo = max(l1, l2), min(l1, l2)
    return round((hi + 0.05) / (lo + 0.05), 2)


def measure(img, box, basis):
    """Foreground/background of the element's own box, by luminance split.

    Anti-aliased edge pixels sit between the two, so the extremes are taken from the darkest and
    lightest 12% of the box and the ratio is computed between their medians — which is what a reader
    perceives as the text colour against its ground."""
    w, h = img.size
    sc = w / float(basis)
    x1, y1, x2, y2 = [v * sc for v in box]
    x1, y1 = max(0, int(x1)), max(0, int(y1))
    x2, y2 = min(w, int(x2)), min(h, int(y2))
    if x2 - x1 < 2 or y2 - y1 < 2:
        return None
    crop = img.crop((x1, y1, x2, y2)).convert("RGB")
    px = list(crop.getdata())
    if len(px) < MIN_PIXELS:
        return None
    by_lum = sorted(px, key=lum)
    k = max(3, int(len(px) * 0.12))
    dark = by_lum[:k]
    light = by_lum[-k:]
    med_dark = dark[len(dark) // 2]
    med_light = light[len(light) // 2]
    # The background is whichever tone occupies more of the box.
    counts = collections.Counter(px)
    bg = counts.most_common(1)[0][0]
    fg = med_dark if ratio(med_dark, bg) >= ratio(med_light, bg) else med_light
    return {"fg": fg, "bg": bg, "ratio": ratio(fg, bg),
            "extremes": ratio(med_dark, med_light)}


def hexs(c):
    return "#%02X%02X%02X" % tuple(int(v) for v in c)


def main():
    findings = json.load(open(os.path.join(OUT, "findings-auto.json")))
    cache, report, kept, withdrawn = {}, [], [], []
    for f in findings:
        if f["code"] not in ("A-CONTRAST", "A-CONTRAST-NONTEXT") or not f.get("box"):
            kept.append(f)
            continue
        png = os.path.join(BASE, f["png"])
        if not os.path.exists(png):
            kept.append(f)
            continue
        if png not in cache:
            cache.clear()                       # full-page captures are large; hold one at a time
            cache[png] = Image.open(png)
        basis = 1440 if f["viewport"] == "desktop" else (320 if "320" in f["slug"] else 375)
        m = measure(cache[png], f["box"], basis)
        need = 4.5
        mm = re.search(r"needs ([\d.]+):1", f["label"])
        if mm:
            need = float(mm.group(1))
        row = dict(id=f.get("id"), slug=f["slug"], viewport=f["viewport"], element=f["element"],
                   cssLabel=f["label"], pixel=None)
        if not m:
            kept.append(f)
            report.append(row)
            continue
        row["pixel"] = {"fg": hexs(m["fg"]), "bg": hexs(m["bg"]), "ratio": m["ratio"],
                        "extremes": m["extremes"]}
        # The perceived ratio is foreground against the tone that fills most of the box. The box's
        # extremes are used only to detect a box with nothing painted in it (a solid block), where
        # the CSS reading was about text that is not rendered at all.
        perceived = m["ratio"]
        if m["extremes"] < 1.05:
            row["verdict"] = "withdrawn — nothing painted in this box"
            withdrawn.append(f)
            report.append(row)
            continue
        if perceived >= need:
            row["verdict"] = "withdrawn — passes on screen"
            withdrawn.append(f)
        else:
            size = re.search(r"at (\d+)px", f["label"])
            f["label"] = (f"{hexs(m['fg'])} on {hexs(m['bg'])} = {perceived}:1"
                          + (f" at {size.group(1)}px" if size else "")
                          + f" · needs {need}:1 · FAIL")
            f["detail"] = (f["detail"].split(" — ")[0]
                           + f" — measured on the capture's pixels: {hexs(m['fg'])} on "
                             f"{hexs(m['bg'])} is {perceived}:1 against the {need}:1 minimum.")
            f["pixelVerified"] = True
            row["verdict"] = "confirmed on pixels"
            kept.append(f)
        report.append(row)
    json.dump(kept, open(os.path.join(OUT, "findings-auto.json"), "w"), indent=1)
    json.dump({"checked": len(report), "withdrawn": len(withdrawn), "confirmed":
               sum(1 for r in report if r.get("verdict") == "confirmed on pixels"),
               "rows": report}, open(os.path.join(OUT, "pixel-verify.json"), "w"), indent=1)
    json.dump(withdrawn, open(os.path.join(OUT, "findings-withdrawn.json"), "w"), indent=1)
    print(f"contrast findings checked on pixels: {len(report)}; "
          f"confirmed {sum(1 for r in report if r.get('verdict') == 'confirmed on pixels')}, "
          f"withdrawn {len(withdrawn)}")
    c = collections.Counter(r["cssLabel"][:44] for r in report if r.get("verdict", "").startswith("withdrawn"))
    for k, v in c.most_common(8):
        print(f"  withdrawn ×{v}: {k}")


if __name__ == "__main__":
    main()
