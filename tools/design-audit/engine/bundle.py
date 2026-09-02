#!/usr/bin/env python3
"""The capture bundle: masking, fingerprints, freshness.

Two hashes per screen, deliberately:
  structureHash — did the DESIGN change?  (excludes x/y/w/h)
  geometryHash  — did the LAYOUT move?    (includes them, plus pageH)

They are separate because `qc_geometry` asserts pin ⊂ element ⊂ crop ⊂ image. A table that
gained a row is visually unchanged but geometrically shifted; reusing its screenshot puts every
pin in the wrong place. One combined hash would either re-shoot constantly or ship broken pins.
"""
import hashlib, json, re

MASK_WARN_RATIO = 0.30

STRUCTURE_KEYS = ("tag", "role", "dsComponent", "text", "fontFamily", "fontSize",
                  "fontWeight", "lineHeight", "color", "bg", "radius", "padding",
                  "borderStyle", "borderColor")
GEOMETRY_KEYS = STRUCTURE_KEYS + ("x", "y", "w", "h")


def mask_rows(rows, patterns):
    """Drop volatile rows before hashing. Returns (kept, masked_count).

    Selector-based volatiles are flagged in-browser (rows carry `volatile: true`) because a CSS
    selector cannot be re-evaluated against extracted JSON. Pattern-based ones are applied here.
    """
    compiled = [re.compile(p) for p in patterns or []]
    kept, masked = [], 0
    for r in rows:
        text = r.get("text") or ""
        if r.get("volatile") or any(c.search(text) for c in compiled):
            masked += 1
            continue
        kept.append(r)
    return kept, masked


def _digest(rows, keys, extra=None):
    payload = [[r.get(k) for k in keys] for r in rows]
    blob = json.dumps([payload, extra], separators=(",", ":"), sort_keys=True, default=str)
    return hashlib.sha256(blob.encode("utf-8")).hexdigest()


def structure_hash(rows):
    return _digest(rows, STRUCTURE_KEYS)


def geometry_hash(rows, page_h):
    return _digest(rows, GEOMETRY_KEYS, extra={"pageH": page_h})
