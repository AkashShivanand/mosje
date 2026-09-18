#!/usr/bin/env python3
"""Re-measure every contrast finding against what is actually on screen.

Computed CSS is right about the TEXT colour and often wrong about the GROUND: an element over a
gradient, a photo or a parent's band reports a transparent or unrelated background. So:

  · TEXT (A-CONTRAST): foreground = the element's computed CSS colour — the colour the developer
    set; ground = the dominant tone of the capture's pixels in the element's box, stepping to the
    next tone when bold glyphs dominate their own box. If the CSS colour is not painted anywhere in
    the box, the text is covered or not drawn as text, and the reading is withdrawn.
  · NON-TEXT (A-CONTRAST-NONTEXT, an icon control whose accessible name is not painted): the
    foreground is taken from the pixels — the 99th percentile of distance from the ground, which
    lands on the stroke rather than on an anti-aliased edge.

History, so this is not relearned: the first version took foreground AND ground as medians of the
darkest/lightest 12% of the box. On small text that is an anti-aliased blend — white on #0373DF read
as #A3CCF3 at 2.76:1 — and it published a Blocker (WEB-GLOBAL-078, the language toggle) that is in
fact white on blue at 3.68:1 and passes the 3:1 a UI component needs. Withdrawn findings are kept in
out/findings-withdrawn.json with the reason; they are never silently deleted.

  python3 verify_pixels.py         # rewrites out/findings-auto.json, writes out/pixel-verify.json
"""
import json, os, re, collections
from PIL import Image

Image.MAX_IMAGE_PIXELS = None
BASE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(BASE, "out")


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
    h = (h or "").lstrip("#")
    if len(h) < 6:
        return None
    try:
        return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))
    except ValueError:
        return None


def pixels(img, box, basis):
    w, h = img.size
    sc = w / float(basis)
    x1, y1, x2, y2 = [v * sc for v in box]
    x1, y1 = max(0, int(x1)), max(0, int(y1))
    x2, y2 = min(w, int(x2)), min(h, int(y2))
    if x2 - x1 < 3 or y2 - y1 < 3:
        return None
    px = list(img.crop((x1, y1, x2, y2)).convert("RGB").getdata())
    return px if len(px) >= 20 else None


def ground(px, fg):
    ranked = collections.Counter(px).most_common()
    bg = ranked[0][0]
    if fg and ratio(bg, fg) < 1.15:
        bg = next((c for c, n in ranked if ratio(c, fg) >= 1.15 and n >= len(px) * 0.05), None)
    return bg


def painted(px):
    by = sorted(px, key=lum)
    k = max(3, len(px) // 8)
    return ratio(by[k // 2], by[-k // 2]) >= 1.05


def visible(px, fg, tol=38):
    return any(abs(p[0] - fg[0]) + abs(p[1] - fg[1]) + abs(p[2] - fg[2]) <= tol for p in px)


def core(px, bg):
    lb = lum(bg)
    ordered = sorted(px, key=lambda c: abs(lum(c) - lb), reverse=True)
    return ordered[min(len(ordered) - 1, max(0, len(ordered) // 100))]


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
            cache.clear()
            cache[png] = Image.open(png)
        basis = 1440 if f["viewport"] == "desktop" else (320 if "320" in f["viewport"] else 375)
        px = pixels(cache[png], f["box"], basis)
        need = float(re.search(r"needs ([\d.]+):1", f["label"]).group(1)) if "needs" in f["label"] else 4.5
        row = dict(slug=f["slug"], viewport=f["viewport"], code=f["code"], element=f["element"],
                   cssLabel=f["label"])

        def withdraw(why):
            row["verdict"] = "withdrawn — " + why
            f["withdrawnReason"] = why
            withdrawn.append(f)
            report.append(row)

        if not px:
            kept.append(f)
            row["verdict"] = "kept — box too small to measure; CSS reading stands"
            report.append(row)
            continue
        if not painted(px):
            withdraw("nothing painted in this box on the capture")
            continue
        if f["code"] == "A-CONTRAST":
            fg = rgb(f.get("cssFg"))
            if not fg:
                kept.append(f)
                row["verdict"] = "kept — no CSS colour recorded"
                report.append(row)
                continue
            if not visible(px, fg):
                withdraw(f"the CSS colour {hexs(fg)} is not painted in the box — covered, or not drawn as text")
                continue
            bg = ground(px, fg)
        else:
            bg = ground(px, None)
            fg = core(px, bg)
        if bg is None or fg == bg:
            withdraw("no distinguishable foreground on the capture")
            continue
        r = ratio(fg, bg)
        row.update(fg=hexs(fg), bg=hexs(bg), ratio=r, need=need)
        if r >= need:
            withdraw(f"passes on screen: {hexs(fg)} on {hexs(bg)} is {r}:1 against {need}:1")
            continue
        size = re.search(r"at (\d+)px", f["label"])
        kind = " · icon control" if f["code"] == "A-CONTRAST-NONTEXT" else ""
        f["label"] = (f"{hexs(fg)} on {hexs(bg)} = {r}:1" + (f" at {size.group(1)}px" if size else "")
                      + kind + f" · needs {need}:1 · FAIL")
        f["detail"] = (f["detail"].split(" — ")[0] + f" — {hexs(fg)} on {hexs(bg)} as painted on the capture: "
                       f"{r}:1 against the {need}:1 minimum.")
        f["pixelVerified"] = True
        row["verdict"] = "confirmed on pixels"
        kept.append(f)
        report.append(row)
    json.dump(kept, open(os.path.join(OUT, "findings-auto.json"), "w"), indent=1)
    json.dump(withdrawn, open(os.path.join(OUT, "findings-withdrawn.json"), "w"), indent=1)
    v = collections.Counter(r["verdict"].split(" — ")[0] for r in report)
    json.dump({"checked": len(report), "verdicts": dict(v), "rows": report},
              open(os.path.join(OUT, "pixel-verify.json"), "w"), indent=1)
    print(f"contrast findings checked: {len(report)}  " + str(dict(v)))
    for k, n in collections.Counter(r["verdict"] for r in report if r["verdict"].startswith("withdrawn")).most_common(6):
        print(f"  {n:4}  {k[:110]}")


if __name__ == "__main__":
    main()
