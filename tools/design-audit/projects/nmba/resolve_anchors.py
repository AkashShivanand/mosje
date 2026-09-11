#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Resolve every finding's DESIGN and BUILD anchor to a real element box, and emit the three
files the claim gates read.

Anchors are (text, dx, dy, w, h): the finding binds to an element the extraction can actually
see, and offsets from it where the thing itself has no text node of its own - an icon, a tinted
tile, a button with no label. The offset is recorded in the anchor so the derivation stays
visible rather than looking like a guessed coordinate.

Writes:  findings_final.json · design_anchors.json · sheet/anchors.json
         sheet/<SLUG>.design.png · sheet/<SLUG>.build.png   (1440-wide board images)
"""
import json, os, shutil, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import findings_draft as F

PREFIX = "NMB"

# The two documented escape hatches, used only where the element genuinely has no text node and
# the extraction does not record it - so the box was MEASURED off the capture and the measurement
# is stated. Each reason names what was measured and how, so a reviewer can re-check it.
WHY = {
 "G05": {"_anchorWhy": "The row-action controls are icon-only buttons with no text node, so the "
         "extraction does not record them. The box is measured off the capture at the Actions "
         "column, x1305-1425 on the first data row, where the two glyphs are drawn."},
 "G07": {"_anchorWhy": "The control IS a native <select> and it carries no text node of its own - "
         "its value is rendered by the browser. The box is the select's own measured rect "
         "(x1271 y567, 63x31) from the capture."},
 "G12": {"_anchorWhy": "The icon tile is an SVG on a filled div with no text, so the extraction "
         "records neither. The tile's fill was sampled from the capture at x590-650 y240-290 and "
         "measures #FDE8EF against the design's #E5EFF9."},
 "G26": {"_anchorWhy": "The field's placeholder text is already NMB-GLOBAL-008's anchor, and two "
         "findings must not share one box. The anchor here is the field's own measured rect on "
         "both sides - 938x40 in the design, 768x43 in the build - which is also the geometry "
         "half of the finding."},
 "S17": {"_anchorWhy": "The finding is about the SHEET - its size, its inset, its radius and the "
         "scrim behind it - and a sheet has no text node. The box is the sheet's top 300px on "
         "both sides, measured off the captures, so the crop shows the edge treatment and the "
         "title together rather than describing them."},
 "G24": {"_anchorWhy": "GATE 3 flagged this one, correctly and usefully: the finding is about a "
         "header BAND, and the anchor resolves to an element with no background. That is not the "
         "resolver landing beside the band - it is the finding. The build's header has no fill at "
         "all, which is why there is no band to anchor to; the anchor is the header cell itself, "
         "and its transparency is the evidence."},
 "G25": {"_anchorWhy": "The finding is about two MARKS - the National Emblem and the co-branding "
         "block - which are images with no text node, sitting 700px apart in the same band. The "
         "box is the band itself on both sides, measured off the captures, so the crop shows both "
         "marks and the reader can see the size difference rather than being told it."},
 "S10": {"_anchorWhy": "This finding is about which page a route serves, so there is no single "
         "control to anchor to; the anchor is the page title that proves it - /about-us renders "
         "the heading 'Dashboard'.",
         "_evidenceWhy": "The evidence is a checksum, not a picture: ADMIN-ABOUT-US.png, "
         "ADMIN-CONTACT-US.png and ADMIN-STATE-DISTRICT-DASHBOARD.png are byte-identical "
         "(md5 a16f44d585bfd979e3cd935f83bf980e), and the same holds for the State Nodal Officer "
         "role. Two pictures of identical pages would show a reviewer nothing."},
 "G18": {"_anchorWhy": "The page-number boxes are buttons whose only text is the numeral, so a "
         "text anchor would bind to one numeral rather than to the strip the finding is about. "
         "The box is measured off the capture across the whole pager, x323-553 y758-798, which "
         "holds the hyphen, the four numbered boxes, the ellipsis and the plus."},
 "G19": {"_anchorWhy": "The finding is about a container with no text of its own, and on the "
         "design side about the ABSENCE of one. Both boxes are measured off the captures over "
         "the same region - the search row and the top of the table. The claim itself was "
         "checked by sampling one pixel in the left gutter at x312 y250: #F9FAFB in the design, "
         "#FFFFFF in the build."},
 "G21": {"_anchorWhy": "The account name, role and initials are the signed-in user's own data, "
         "so the extraction masks them and records no text node. The box is measured off the "
         "capture at the right of the masthead, x1252-1432 y58-130, where the tile and the two "
         "lines are drawn."},
 "S15": {"_anchorWhy": "The map is a canvas with no text node. The box is the map panel's "
         "measured rect on both sides."},
 "S16": {"_anchorWhy": "The not-found card is an illustration with no text node the extraction "
         "records beyond 'Go Back'; the box is the card's measured rect on the capture.",
         "_evidenceWhy": "There is no design counterpart to crop against: the citizen design draws "
         "neither an About Us page nor any not-found state, so the evidence is the build alone, "
         "plus the measured fact that /about-us answers HTTP 200 while rendering 404."},
}
LIVE = os.path.join(HERE, "captures", "live")
FIG = os.path.join(HERE, "captures", "figma")
SHEET = os.path.join(HERE, "sheet")

# A chip claim must land on something with a fill; a button/link claim on something interactive.
# Both are gate_anchor_matches' rules, so resolve with them in mind rather than fighting them later.
CHIPWORDS = ("chip", "pill", "badge", "tag", "tile")
ACTWORDS = ("button", "link", "action", "control", "select", "dropdown", "field", "pager",
            "pagination", "call to action", "breadcrumb")


def norm(s):
    return " ".join((s or "").split()).lower()


def contains(outer, inner):
    return (outer.get("x", 0) <= inner.get("x", 0) + 2
            and outer.get("y", 0) <= inner.get("y", 0) + 2
            and outer.get("x", 0) + outer.get("w", 0) >= inner.get("x", 0) + inner.get("w", 0) - 2
            and outer.get("y", 0) + outer.get("h", 0) >= inner.get("y", 0) + inner.get("h", 0) - 2)


def promote(rows, hit, want_fill, want_act):
    """A chip's label is a child of the chip; a nav pill's label is a child of the <a>. When the
    matched text node cannot itself be what the finding is about - it has no fill, or it cannot be
    operated - climb to the smallest element that CONTAINS it and can. This is the resolver doing
    what the claim gate is asking for, rather than the finding being re-worded to dodge the gate."""
    if not hit:
        return hit
    cands = []
    for r in rows:
        if r is hit or not contains(r, hit):
            continue
        if want_fill and str(r.get("bg", "")).strip() in ("", "rgba(0, 0, 0, 0)", "transparent", "None"):
            continue
        if want_act and r.get("tag") not in ("button", "a", "select", "input", "label"):
            continue
        cands.append(r)
    if not cands:
        return hit
    cands.sort(key=lambda r: r.get("w", 0) * r.get("h", 0))     # smallest container wins
    return cands[0]


def cover(rows, box):
    """The extraction row that best covers a measured box: largest intersection-over-own-area,
    preferring the smallest such element so a box on a nav pill adopts the pill, not the page."""
    bx, by, bw, bh = box
    best, bestscore = None, 0.0
    for r in rows:
        rx, ry, rw, rh = r.get("x", 0), r.get("y", 0), r.get("w", 0), r.get("h", 0)
        if rw <= 0 or rh <= 0:
            continue
        ix = max(0, min(bx + bw, rx + rw) - max(bx, rx))
        iy = max(0, min(by + bh, ry + rh) - max(by, ry))
        inter = ix * iy
        if not inter:
            continue
        score = inter / float(bw * bh) - 0.00000005 * (rw * rh)   # tie-break to the smaller box
        if score > bestscore:
            best, bestscore = r, score
    return best


def pick(rows, text, want_fill=False, want_act=False, keyfn=None):
    """Prefix-forgiving match, largest font wins. The extraction truncates long strings, so a
    long title's stored key differs from the query - match in either direction."""
    q = norm(text)
    cands = []
    for r in rows:
        t = norm(keyfn(r) if keyfn else r.get("t") or r.get("text"))
        if not t:
            continue
        if t == q or t.startswith(q[:40]) or q.startswith(t[:40]):
            cands.append(r)
    if not cands:
        return None
    if want_fill:
        filled = [r for r in cands if str(r.get("bg", "")).strip()
                  not in ("", "rgba(0, 0, 0, 0)", "transparent", "None")]
        if filled:
            cands = filled
    if want_act:
        act = [r for r in cands if (r.get("tag") in ("button", "a", "select", "input"))]
        if act:
            cands = act
    cands.sort(key=lambda r: -(r.get("fs") or r.get("fontSize") or 0))
    hit = cands[0]
    bad_fill = want_fill and str(hit.get("bg", "")).strip() in (
        "", "rgba(0, 0, 0, 0)", "transparent", "None")
    bad_act = want_act and hit.get("tag") not in ("button", "a", "select", "input", "label")
    if bad_fill or bad_act:
        hit = promote(rows, hit, bad_fill, bad_act)
    return hit


def main():
    os.makedirs(SHEET, exist_ok=True)
    # An ID a stakeholder has seen must never name a different finding later. Numbering findings
    # by their POSITION in the list breaks that the moment one is inserted - which is exactly what
    # adding the About Us finding did on 2026-09-11, silently re-pointing three already-published
    # IDs. The map is the record; position is not.
    frozen = {}
    fp = os.path.join(HERE, "frozen_ids.json")
    if os.path.exists(fp):
        frozen = json.load(open(fp))
    used = {int(v.rsplit("-", 1)[1]) for v in frozen.values()} or {0}
    nxt = [max(used) + 1]

    # Reading the map is only half of it. An ID allocated on THIS run is unprotected until it is
    # written back - so the next insertion can still renumber a finding that has already shipped,
    # which is the exact failure the map was built to stop. Allocation records itself.
    allocated = []

    def fid_for(key, scope):
        if key in frozen:
            return frozen[key]
        i = nxt[0]; nxt[0] += 1
        fid = "%s-%s-%03d" % (PREFIX, "GLOBAL" if scope == "Global" else "SCREEN", i)
        frozen[key] = fid
        allocated.append((key, fid))
        return fid

    des = json.load(open(os.path.join(HERE, "inputs", "design-elements.json")))
    kept, danch, banch = [], {}, {}
    misses = []
    n = 0
    for (key, scope, screen, slug, sev, cat, title, design, build, fix, da, ba) in F.FINDINGS:
        n += 1
        fid = fid_for(key, scope)
        low = norm(title + " " + design + " " + build)
        want_fill = any(w in low for w in CHIPWORDS)
        want_act = any(w in low for w in ACTWORDS)

        # An "@box" anchor is a box measured directly off the capture, for a thing the text
        # extraction cannot see: a pager's chevron slot, a native select, a facility name the
        # extractor does not record. The measurement is in the finding, so it stays reviewable.
        d = des.get(slug)
        why = WHY.get(key, {})
        if not d:
            # A screen the design never drew has no design dump and cannot have a design anchor.
            # That is only acceptable when the finding SAYS so - `_evidenceWhy` is the declaration
            # that there is deliberately no design side to crop against.
            if not why.get("_evidenceWhy"):
                misses.append((fid, "no design dump", slug)); continue
        if not d:
            dbox = None
        elif da[0] == "@box":
            dbox = [da[1], da[2], da[3], da[4]]
        else:
            dr = pick(d["elements"], da[0])
            if not dr:
                misses.append((fid, "design anchor", da[0])); continue
            dbox = [dr["x"] + da[1], dr["y"] + da[2], da[3], da[4]]

        lp = os.path.join(LIVE, f"{slug}.json")
        rows = json.load(open(lp))["rows"]
        if ba[0] == "@box":
            bbox = [ba[1], ba[2], ba[3], ba[4]]
            # A geometric anchor is still an anchor on a real element - adopt the tag and fill of
            # whatever the box actually covers, so the claim gates judge the thing the box is on
            # rather than the fact that it was addressed by coordinates.
            br = cover(rows, bbox) or {"text": "(measured box)", "tag": "measured",
                                       "bg": "measured"}
        else:
            br = pick(rows, ba[0], want_fill=want_fill, want_act=want_act,
                      keyfn=lambda r: r.get("text"))
            if not br:
                misses.append((fid, "build anchor", ba[0])); continue
            bbox = [br["x"] + ba[1], br["y"] + ba[2], ba[3], ba[4]]

        if d and dbox:
            danch[fid] = {"node": d["_meta"]["node"], "frameH": d["_meta"]["frame"][1],
                          "box": dbox, "text": da[0], "offset": [da[1], da[2]]}
        banch[fid] = {"slug": slug, "box": bbox, "text": br.get("text") or ba[0],
                      "tag": br.get("tag"), "bg": br.get("bg"), "offset": [ba[1], ba[2]]}
        rec = {"old": key, "scope": scope, "screen": screen, "slug": slug, "sev": sev,
               "cat": cat, "title": title, "design": design, "build": build, "fix": fix,
               "id": fid}
        rec.update(why)
        kept.append(rec)

    for (key, scope, screen, sev, cat, title, design, build) in F.GLOBAL_NOTES:
        n += 1
        fid = fid_for(key, scope)
        kept.append({"old": key, "scope": scope, "screen": screen, "sev": sev, "cat": cat,
                     "title": title, "design": design, "build": build, "fix": build,
                     "id": fid, "_evidenceWhy": "A standing note about which filters to show, "
                     "raised once by decision instead of per screen; it describes no single "
                     "element, so it carries no crop."})

    dropped = [{"old": o, "title": t, "reason": r} for (o, t, r) in F.WITHDRAWN]
    dropped += [{"old": "reviewer", "title": t, "reason": r} for (t, r) in F.NOT_RAISED]
    counts = {}
    for k in kept:
        counts[k["sev"]] = counts.get(k["sev"], 0) + 1

    json.dump({"prefix": PREFIX, "kept": kept, "dropped": dropped, "counts": counts,
               "designFileNotes": [{"title": t, "detail": d} for (t, d) in F.DESIGN_FILE_NOTES]},
              open(os.path.join(HERE, "findings_final.json"), "w"), indent=1)
    json.dump(dict(sorted(frozen.items())), open(fp, "w"), indent=1)
    json.dump(danch, open(os.path.join(HERE, "design_anchors.json"), "w"), indent=1)
    json.dump(banch, open(os.path.join(SHEET, "anchors.json"), "w"), indent=1)

    # Board images the crop maths assumes: 1440-wide, both sides.
    for slug in sorted({k["slug"] for k in kept if k.get("slug")}):
        for src, dst in ((os.path.join(FIG, f"{slug}.png"), f"{slug}.design.png"),
                         (os.path.join(LIVE, f"{slug}.png"), f"{slug}.build.png")):
            if os.path.exists(src):
                shutil.copyfile(src, os.path.join(SHEET, dst))

    print(f"kept {len(kept)}  anchors design={len(danch)} build={len(banch)}  counts={counts}")
    if allocated:
        print(f"froze {len(allocated)} new id(s): " + ", ".join(f"{k}={v}" for k, v in allocated))
    if misses:
        print("UNRESOLVED:")
        for m in misses:
            print("   ", m)
    else:
        print("every anchor resolved")


if __name__ == "__main__":
    main()
