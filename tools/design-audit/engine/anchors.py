#!/usr/bin/env python3
"""Bind a finding to a REAL element on the build capture — the shared half of anchor resolution.

Pins are never hand-placed. A finding names an anchor by something a reader can see, that thing is
looked up in the live extraction, and the pin is derived from the element's real box against the
real capture height. Anything that does not resolve is printed, never silently defaulted: a pin on
the wrong element is worse than a finding with no pin.

A project supplies only its ANCHORS dict and calls `resolve()`. The lookup rules, the element
fields recorded, and the offset support live here so every portal gets the same behaviour — and so
the claim gates in engine/claims.py have the fields they need (tag, role, bg) on every project.

Spec keys:
  text        the visible string (prefix-forgiving — extractions truncate)
  tag         narrow to an element type. REQUIRED for a <select>, whose options are not child
              text nodes and so carry no text at all
  fs          disambiguate two elements with the same words at different sizes
  ymin/ymax   pick one of several identical labels
  xmin/xmax   same, horizontally
  nth         which match, after sorting top-to-bottom then left-to-right
  chrome      allow a match in the masthead/footer or outside the content column
  dx/dy/w/h   offset from the matched element to something the extraction cannot see — an icon,
              a tinted banner, a close control. Recorded on the anchor so the derivation stays
              visible rather than looking like a mis-resolve
  why         why this anchor is the right marker when it is deliberately a NEIGHBOUR. Read by
              engine/claims.py, which otherwise flags "finding is about a chip, anchor has no fill"
"""
import json, os


def rows_for(live_dir, slug):
    d = json.load(open(os.path.join(live_dir, f"{slug}.json")))
    return d.get("rows") or [], d.get("pageH") or 1000


def find(rows, spec):
    """Resolve one spec to a real element row, or None. Never guesses."""
    want = (spec.get("text") or "").lower()
    tag, fs = spec.get("tag"), spec.get("fs")
    ymin, ymax = spec.get("ymin", 0), spec.get("ymax", 10 ** 9)
    xmin, xmax = spec.get("xmin", -10 ** 9), spec.get("xmax", 10 ** 9)
    chrome = spec.get("chrome", False)
    cands = []
    for r in rows:
        x, y = r.get("x"), r.get("y")
        if x is None or y is None:
            continue
        if not (ymin <= y <= ymax) or not (xmin <= x <= xmax):
            continue
        # the masthead, the footer and anything left of the content column are excluded unless
        # asked for: they are full of text that matches by accident
        if not chrome and (y < 60 or x < 300 or x > 1440):
            continue
        if tag and r.get("tag") != tag:
            continue
        if fs is not None and r.get("fontSize") != fs:
            continue
        if want:
            t = (r.get("text") or "").strip().lower()
            if not t:
                continue
            if not (t == want or t.startswith(want) or (want.startswith(t) and len(t) > 4)):
                continue
        cands.append(r)
    if not cands:
        return None
    cands.sort(key=lambda r: (r.get("y") or 0, r.get("x") or 0))
    n = spec.get("nth", 0)
    return cands[n] if n < len(cands) else cands[0]


def resolve(anchors, live_dir, out_path=None, verbose=True):
    """Resolve every spec. Returns (resolved, missing). Writes sheet/anchors.json when asked."""
    out, missing = {}, []
    for fid, spec in anchors.items():
        slug = spec["slug"]
        rows, pageH = rows_for(live_dir, slug)
        r = find(rows, spec)
        if not r:
            missing.append(f"{fid}: {spec} matched nothing on {slug}")
            continue
        box = [r["x"], r["y"], r["w"], r["h"]]
        dx, dy = spec.get("dx", 0), spec.get("dy", 0)
        if dx or dy:
            box = [box[0] + dx, box[1] + dy, spec.get("w", box[2]), spec.get("h", box[3])]
        out[fid] = {
            "slug": slug, "anchor": spec.get("text") or spec.get("tag"), "pageH": pageH,
            "box": box, "offset": [dx, dy] if (dx or dy) else None,
            "text": (r.get("text") or "")[:50], "fontSize": r.get("fontSize"),
            # tag/role/bg are what engine/claims.py's anchor gate reasons about: a chip is drawn
            # on a fill, so an anchor with a transparent background cannot be one
            "tag": r.get("tag"), "role": r.get("role"),
            "bg": r.get("bg"), "color": r.get("color"),
            "_anchorWhy": spec.get("why"),
        }
    if out_path:
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        json.dump(out, open(out_path, "w"), indent=1)
    if verbose:
        print(f"resolved {len(out)}/{len(anchors)}")
        for m in missing:
            print("  !", m)
        for fid in sorted(out):
            a = out[fid]
            print(f"  {fid:<4} {a['slug']:<34} y={a['box'][1]:<5} x={a['box'][0]:<5} {a['text']!r}")
    return out, missing
