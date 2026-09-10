#!/usr/bin/env python3
"""Bind every SMILE finding to a REAL element box on the build capture.

Pins are never hand-placed (audit-rules §2/§F): each finding names an anchor by the text a
reader can see, that text is looked up in the live extraction, and the pin is derived from the
element's real box against the real capture height. Anything that does not resolve is printed,
not silently defaulted — a pin on the wrong element is worse than no pin.
"""
import json, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
LIVE = os.path.join(HERE, "captures", "live")

# finding id -> anchor spec on the BUILD capture.
#   text:  the visible string (prefix-forgiving — the extractor truncates at 80 chars)
#   tag:   narrow to an element type. REQUIRED for a <select>, whose options are not direct
#          child text nodes and so carry no text at all in the extraction — four anchors
#          silently failed to resolve before this existed.
#   fs:    disambiguate two elements with the same words. "Programme Overview" is both the h1
#          (28px) and nothing else; "PROGRAMME OVERVIEW" is a 12px section label — a
#          case-insensitive text match alone picks the wrong one.
#   ymin/ymax: last resort, to pick one of several identical labels.
#   chrome: allow a match above y=60 or left of the content column (masthead / footer / the
#          third-party accessibility panel), which are excluded by default.
ANCHORS = {
 # ---- screen-specific ----
 "S01": dict(slug="SUPER-ADMIN-DASHBOARD",     text="BENEFICIARY PROFILE", tag="h2"),
 "S02": dict(slug="SUPER-ADMIN-DASHBOARD",     text="2,444", fs=32),
 "S03": dict(slug="SUPER-ADMIN-DASHBOARD",     text="PROGRAMME OVERVIEW", fs=12),
 "S04": dict(slug="SUPER-ADMIN-DASHBOARD",     text="State Users"),
 "S05": dict(slug="SUPER-ADMIN-USERS",         text="Onboard New Users"),
 "S06": dict(slug="SUPER-ADMIN-USERS",         text="Name", tag="th", ymax=500),
 "S07": dict(slug="SUPER-ADMIN-USERS",         tag="select", nth=0, ymin=340, ymax=430),
 "S08": dict(slug="SUPER-ADMIN-CONSENT",       text="Access Control", fs=12),
 "S09": dict(slug="SUPER-ADMIN-CONSENT",       tag="input", ymin=240, ymax=330),
 "S10": dict(slug="SUPER-ADMIN-CONSENT",       text="Document", fs=12, ymax=400),
 "S11": dict(slug="SUPER-ADMIN-CONSENT",       text="JANKALYAN PARISHAD"),
 "S12": dict(slug="SUPER-ADMIN-NOTIFICATIONS", text="No notifications match the current filters"),
 "S13": dict(slug="SUPER-ADMIN-NOTIFICATIONS", tag="select", nth=0, ymin=330, ymax=420),
 "S14": dict(slug="SUPER-ADMIN-PERSONS",       text="Beneficiary List", fs=24),
 "S15": dict(slug="SUPER-ADMIN-PERSONS",       text="\u00a9 2026 Copyright", chrome=True),
 # ---- globals, each pinned on a representative screen ----
 "G01": dict(slug="SUPER-ADMIN-DASHBOARD",     text="Programme Overview", tag="h1"),
 "G02": dict(slug="SUPER-ADMIN-USERS",         text="1", tag="button", ymin=980, ymax=1020, xmin=1080, xmax=1140),
 "G03": dict(slug="SUPER-ADMIN-USERS",         text="Showing"),
 "G04": dict(slug="SUPER-ADMIN-USERS",         text="Username", tag="th"),
 "G05": dict(slug="SUPER-ADMIN-NOTIFICATIONS", text="Total Notifications", fs=11),
 "G06": dict(slug="SUPER-ADMIN-PERSONS",       text="Male", ymax=400),
 "G07": dict(slug="SUPER-ADMIN-PERSONS",       text="Download All (CSV)", tag="button"),
 "G08": dict(slug="SUPER-ADMIN-USERS",         text="A", fs=18, chrome=True, xmax=1440),
 "G09": dict(slug="SUPER-ADMIN-USERS",         tag="button", chrome=True, ymax=40, xmin=1180, xmax=1250),
 "G10": dict(slug="SUPER-ADMIN-USERS",         text="Privacy Policy", chrome=True),
 "G11": dict(slug="SUPER-ADMIN-USERS",         text="City Profiling", chrome=True),
 # ---- globals found by the element diff ----
 "G12": dict(slug="SUPER-ADMIN-USERS",         text="Users", fs=24),
 "G13": dict(slug="SUPER-ADMIN-USERS",         text="Onboard portal users", fs=14),
 "G14": dict(slug="SUPER-ADMIN-USERS",         text="Access Control", fs=12),
 "G15": dict(slug="SUPER-ADMIN-USERS",         text="Terms & Conditions", chrome=True),
 "G16": dict(slug="SUPER-ADMIN-CONSENT",       text="Uploaded", fs=12),
 "G17": dict(slug="SUPER-ADMIN-CONSENT",       text="Access Control", fs=12),
 "G18": dict(slug="SUPER-ADMIN-PERSONS",       text="Data:", fs=12),
 "G19": dict(slug="SUPER-ADMIN-SURVEYOR-MAPPED", tag="select", ymin=380, ymax=470),
}

def rows_for(slug):
    p = os.path.join(LIVE, f"{slug}.json")
    d = json.load(open(p))
    return d.get("rows") or [], d.get("pageH") or 1000

def find(rows, spec):
    """Resolve one anchor spec to a real element row, or None. Never guesses: a spec that
    matches nothing is reported by the caller, because a pin on the wrong element is worse
    than a finding with no pin."""
    want = (spec.get("text") or "").lower()
    tag, fs = spec.get("tag"), spec.get("fs")
    ymin, ymax = spec.get("ymin", 0), spec.get("ymax", 10 ** 9)
    xmin, xmax = spec.get("xmin", -10 ** 9), spec.get("xmax", 10 ** 9)
    chrome = spec.get("chrome", False)
    cands = []
    for r in rows:
        x, y = r.get("x"), r.get("y")
        if x is None or y is None: continue
        if not (ymin <= y <= ymax): continue
        if not (xmin <= x <= xmax): continue
        if not chrome and (y < 60 or x < 300 or x > 1440): continue
        if tag and r.get("tag") != tag: continue
        if fs is not None and r.get("fontSize") != fs: continue
        if want:
            t = (r.get("text") or "").strip().lower()
            if not t: continue
            if not (t == want or t.startswith(want) or (want.startswith(t) and len(t) > 4)):
                continue
        cands.append(r)
    if not cands: return None
    cands.sort(key=lambda r: (r.get("y") or 0, r.get("x") or 0))
    n = spec.get("nth", 0)
    return cands[n] if n < len(cands) else cands[0]

def main():
    out, missing = {}, []
    for fid, spec in ANCHORS.items():
        slug = spec["slug"]
        rows, pageH = rows_for(slug)
        r = find(rows, spec)
        if not r:
            missing.append(f"{fid}: {spec} matched nothing on {slug}")
            continue
        out[fid] = {"slug": slug, "anchor": spec.get("text") or spec.get("tag"), "pageH": pageH,
                    "box": [r["x"], r["y"], r["w"], r["h"]],
                    "text": (r.get("text") or "")[:50], "fontSize": r.get("fontSize")}
    json.dump(out, open(os.path.join(HERE, "sheet", "anchors.json"), "w"), indent=1)
    print(f"resolved {len(out)}/{len(ANCHORS)}")
    for m in missing: print("  !", m)
    for fid in sorted(out):
        a = out[fid]
        print(f"  {fid:<4} {a['slug']:<34} y={a['box'][1]:<5} x={a['box'][0]:<5} {a['text']!r}")

if __name__ == "__main__":
    main()
