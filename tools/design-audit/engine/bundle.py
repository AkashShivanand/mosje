#!/usr/bin/env python3
"""The capture bundle: masking, fingerprints, freshness.

Two hashes per screen, deliberately:
  structureHash — did the DESIGN change?  (excludes x/y/w/h)
  geometryHash  — did the LAYOUT move?    (includes them, plus pageH)

They are separate because `qc_geometry` asserts pin ⊂ element ⊂ crop ⊂ image. A table that
gained a row is visually unchanged but geometrically shifted; reusing its screenshot puts every
pin in the wrong place. One combined hash would either re-shoot constantly or ship broken pins.
"""
import hashlib, json, re, urllib.request

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
    # Deliberately no default=str — non-JSON values must raise TypeError loudly.
    # A silent coercion via str() embeds the process's memory addresses, making
    # two identical extractions hash differently. That breaks the core guarantee.
    blob = json.dumps([payload, extra], separators=(",", ":"), sort_keys=True)
    return hashlib.sha256(blob.encode("utf-8")).hexdigest()


def structure_hash(rows):
    return _digest(rows, STRUCTURE_KEYS)


def geometry_hash(rows, page_h):
    return _digest(rows, GEOMETRY_KEYS, extra={"pageH": page_h})


import datetime, os, sys

BUNDLE_VERSION = 1


def bundle_path(paths):
    return os.path.join(paths["out"], "capture-bundle.json")


def load_bundle(paths):
    p = bundle_path(paths)
    if not os.path.exists(p):
        return None
    try:
        with open(p) as fh:
            return json.load(fh)
    except Exception:
        return None


def write_bundle(paths, b):
    with open(bundle_path(paths), "w") as fh:
        json.dump(b, fh, indent=2)


def now_iso():
    return datetime.datetime.now().astimezone().isoformat(timespec="seconds")


def new_bundle(project, environment, engine_sha):
    return {"version": BUNDLE_VERSION, "project": project, "environment": environment,
            "engineSha": engine_sha, "capturedAt": now_iso(),
            "hosts": {}, "screens": [], "records": {}}


def screen_entry(slug, role, route, url, reached_by, png, png_sha256, png_h, page_h,
                 truncated, rows_path, structure, geometry, masked, total, fields,
                 wizard, captured_at):
    return {"slug": slug, "role": role, "route": route, "url": url,
            "reachedBy": reached_by, "png": png, "pngSha256": png_sha256,
            "pngH": png_h, "pageH": page_h, "truncated": truncated, "rows": rows_path,
            "structureHash": structure, "geometryHash": geometry,
            "maskedRows": masked, "totalRows": total,
            "fields": fields or [], "wizard": wizard, "capturedAt": captured_at}


def find_screen(b, slug):
    for s in b.get("screens", []):
        if s.get("slug") == slug:
            return s
    return None


def upsert_screen(b, entry):
    for i, s in enumerate(b.setdefault("screens", [])):
        if s.get("slug") == entry["slug"]:
            b["screens"][i] = entry
            return
    b["screens"].append(entry)


def sha256_file(path):
    h = hashlib.sha256()
    with open(path, "rb") as fh:
        for chunk in iter(lambda: fh.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


# A hashed asset name: at least 8 hex chars between separators. Matches CRA's
# `main.<hash>.js` and Next's `<name>-<hash>.js`. An unhashed `/js/app.js` is not a
# fingerprint — it would never change and would make tier 0 always say "unchanged".
_HASHED = re.compile(r"/([A-Za-z0-9_\-]+[.\-][0-9a-f]{8,}(?:\.chunk)?\.js)")


def extract_fingerprint(html):
    hit = _HASHED.search(html or "")
    return hit.group(1) if hit else None


def build_fingerprint(base_url, timeout=10):
    """One HTTP GET of the app shell. Returns None on any failure — callers treat that as
    'unknown', which falls through to the per-screen tier rather than trusting the bundle."""
    try:
        req = urllib.request.Request(base_url, headers={"User-Agent": "mosje-design-audit"})
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return extract_fingerprint(resp.read(400_000).decode("utf-8", "replace"))
    except Exception:
        return None


def decide_screen(prev, structure, geometry):
    """reuse | reshoot | recapture.

    `reshoot` means the design is unchanged but the layout moved — the findings carry forward,
    the screenshot does not, because pins are geometry-bound.
    """
    if not prev:
        return "recapture"
    if prev.get("structureHash") != structure:
        return "recapture"
    if prev.get("geometryHash") != geometry:
        return "reshoot"
    return "reuse"


def resolve_freshness(b, man, cfg, force=False, verify=False, now=None, _probe=None):
    """Tier 0. Returns {"mode": full|verify|reuse-all, "reason": …}.

    Never returns reuse-all on a doubt: an unreachable host, an unreadable fingerprint or an
    absent one all fall through to `verify`, which re-checks every screen cheaply.
    """
    if force:
        return {"mode": "full", "reason": "--force"}
    if b is None:
        return {"mode": "full", "reason": "no existing bundle"}
    if not b.get("capturedAt"):
        return {"mode": "full", "reason": "bundle has no capturedAt"}
    now = now or datetime.datetime.now().astimezone()
    age = (now - datetime.datetime.fromisoformat(b["capturedAt"])).total_seconds()
    ceiling = 14 * 86400
    if man is not None:
        try:
            import manifest as _M
        except ImportError:
            from engine import manifest as _M
        ceiling = _M.staleness_seconds(man)
    if age > ceiling:
        return {"mode": "full", "reason": f"bundle is stale ({int(age // 86400)}d > {ceiling // 86400}d)"}
    probe = _probe or build_fingerprint
    bases = sorted({r.get("base") for r in cfg.get("live", {}).get("roles", []) if r.get("base")})
    recorded = {h.get("base"): h.get("buildFingerprint") for h in (b.get("hosts") or {}).values()}
    for base in bases:
        live = probe(base)
        if not live:
            return {"mode": "verify", "reason": f"could not read a build fingerprint for {base}"}
        if recorded.get(base) != live:
            return {"mode": "verify", "reason": f"build moved on {base}: {recorded.get(base)} -> {live}"}
    if verify:
        return {"mode": "verify", "reason": "--verify requested"}
    return {"mode": "reuse-all", "reason": "build fingerprint unchanged and bundle is fresh"}
