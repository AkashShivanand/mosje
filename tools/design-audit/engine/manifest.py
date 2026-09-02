#!/usr/bin/env python3
"""Parse and validate a project's screen-manifest.yaml — the declarative traversal recipe.

The manifest is the INPUT to a capture (how to reach states a route-crawl cannot see);
capture-bundle.json is the OUTPUT. Project-agnostic: nothing here knows a portal's name.

`volatile` entries are content that changes on every load (counters, dates, generated ids).
They are masked before hashing, or a dashboard looks dirty on every single run and the
per-screen freshness tier becomes dead weight.
"""
import os, re
import yaml

VALID_ENVIRONMENTS = ("dev", "uat", "prod")
DEFAULT_STALENESS = 14 * 86400
_DURATION = re.compile(r"^(\d+)\s*([smhd])$")
_UNIT = {"s": 1, "m": 60, "h": 3600, "d": 86400}


def load(project_dir):
    """Parse projects/<name>/screen-manifest.yaml. Returns None when absent."""
    path = os.path.join(project_dir, "screen-manifest.yaml")
    if not os.path.exists(path):
        return None
    with open(path) as fh:
        return yaml.safe_load(fh) or {}


def validate(raw):
    """Return a list of human-readable errors. Empty list means valid."""
    errs = []
    if not isinstance(raw, dict):
        return ["manifest is not a mapping"]
    if raw.get("version") != 1:
        errs.append(f"version must be 1, got {raw.get('version')!r}")
    env = raw.get("environment")
    if env not in VALID_ENVIRONMENTS:
        errs.append(f"environment must be one of {VALID_ENVIRONMENTS}, got {env!r}")
    for i, flow in enumerate(raw.get("flows") or []):
        if not flow.get("id"):
            errs.append(f"flows[{i}] has no id")
        if not flow.get("steps"):
            errs.append(f"flows[{i}] has no steps")
    seen = set()
    for flow in raw.get("flows") or []:
        fid = flow.get("id")
        if fid in seen:
            errs.append(f"duplicate flow id {fid!r}")
        seen.add(fid)
    return errs


def staleness_seconds(m):
    raw = (m or {}).get("stalenessCeiling")
    if raw is None:
        return DEFAULT_STALENESS
    if isinstance(raw, int):
        return raw
    hit = _DURATION.match(str(raw).strip())
    return int(hit.group(1)) * _UNIT[hit.group(2)] if hit else DEFAULT_STALENESS


def _screen(m, slug):
    for s in (m or {}).get("screens") or []:
        if s.get("slug") == slug:
            return s
    return {}


def _split(entries):
    """`volatile` accepts bare strings (patterns) or {selector:…} / {pattern:…} mappings."""
    sels, pats = [], []
    for e in entries or []:
        if isinstance(e, str):
            pats.append(e)
        elif isinstance(e, dict):
            if e.get("selector"):
                sels.append(e["selector"])
            if e.get("pattern"):
                pats.append(e["pattern"])
    return sels, pats


def volatile_selectors(m, slug=None):
    g, _ = _split((m or {}).get("volatile"))
    s, _ = _split(_screen(m, slug).get("volatile")) if slug else ([], [])
    return g + s


def volatile_patterns(m, slug=None):
    _, g = _split((m or {}).get("volatile"))
    _, s = _split(_screen(m, slug).get("volatile")) if slug else ([], [])
    return g + s
