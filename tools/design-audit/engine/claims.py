#!/usr/bin/env python3
"""The claim-verification layer — gates on whether a FINDING is true, not on whether the
pipeline ran.

Written after the SMILE Beggary run, where roughly one claim in five was wrong and not one of
them was caught: the coverage ledger was green, the mapping cross-check passed, every pin sat
inside its crop, and `failures.md` was empty. Every existing gate measured the pipeline. Nothing
measured the sentence.

Four gates live here, each named for the mistake it exists to stop:

  gate_design_read        a design dump read from a page that was never loaded is TRUNCATED, and
                          silently so — 45 text nodes where the frame has 201. Four wrong claims
                          came from this one bug, including a published "the design has no tab
                          rail" about a frame that plainly has one.
  build_evidence /        a text extraction cannot see an icon, a panel fill, a tinted tile, or a
  gate_evidence           column that has scrolled off the viewport. Every presence, colour,
                          count and position claim must carry a 1:1 crop of BOTH sides, because
                          that is the only thing that would have caught "the KPI icons lost their
                          tinted chip" (they hadn't), "the KPI row lost its container" (it hadn't)
                          and "Submitted On is not built" (it is — it is off-screen).
  gate_anchor_matches     "The active page number is the wrong colour" was anchored to the words
                          "Per page" — the control NEXT to the one the finding is about. The
                          marker looked right at board scale and was wrong at element scale.
  gate_duplicate_anchors  two findings resolving to one design box is a copy-paste, not a
                          coincidence: G08 and G09 both pointed at the language selector.

Every gate returns a list of failure strings. Empty means pass. Nothing here writes to the
report; the caller decides whether a failure is fatal.
"""
import json, os, re, sys

# ---------------------------------------------------------------------------------------------
# claim classification
#
# The split is evidence-based, not taste: in the SMILE run EVERY wrong claim was about presence,
# colour, count or position, and EVERY typography-size claim held. Sizes come off the extraction's
# own measurements and are reliable. The other four are about what a picture shows, so they are
# the ones that have to be looked at.
CLASSES = ("presence", "colour", "count", "position", "size", "copy")
NEEDS_PICTURE = ("presence", "colour", "count", "position")

_PAT = {
    "presence": re.compile(
        r"\b(not in the build|is not built|are not built|not present|absent|missing|has no\b|"
        r"there is no\b|no longer|lost its|lost their|gained|adds?\b|added|removed|dropped|"
        r"is not there|does not (draw|have|carry|show))", re.I),
    "colour": re.compile(
        r"(#[0-9a-f]{3,8}\b|\bcolou?r|\btint|\bfill\b|\bnavy\b|\borange\b|\bgold\b|\bamber\b|"
        r"\bgreen\b|\bblue\b|\bgrey\b|\bgray\b|\bwhite\b|\bband\b|\bchip\b|\bpill\b)", re.I),
    "count": re.compile(
        r"\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|\d+)\s+"
        r"(columns?|cards?|tabs?|cells?|controls?|filters?|buttons?|figures?|"
        r"markers?|fields?)\b", re.I),   # 'steps'/'rows'/'items' dropped: too many false hits
    "position": re.compile(
        r"\b(off the|outside|swapped|mirror|left|right|above|below|beside|aligned|alignment|"
        r"off-screen|overflow|scrolls? sideways|out of line|centred|centered|grid)\b", re.I),
    "size": re.compile(r"(\b\d+\s?px\b|\bsmaller\b|\blarger\b|\bbigger\b|\ba size (up|down)\b|"
                       r"\bwidth\b|\bheight\b|\bweight\b|\bbold\b|\bsemibold\b|\bmedium\b)", re.I),
    "copy": re.compile(r"\b(worded|wording|reads?\b|label(led)?\b|says\b|named|renamed|spelling)\b", re.I),
}


def classify(title, design="", build=""):
    """Return the claim classes a finding makes. A finding usually makes more than one."""
    blob = " ".join(str(x or "") for x in (title, design, build))
    hits = [c for c in CLASSES if _PAT[c].search(blob)]
    return hits or ["other"]


def needs_picture(classes):
    return any(c in NEEDS_PICTURE for c in classes)


# ---------------------------------------------------------------------------------------------
# GATE 1 — the design read
#
# `use_figma` returns a partial tree when the traversed frame's page is not the current page, and
# says nothing about it. The dump must therefore record HOW it was read, and this gate refuses a
# dump that cannot prove the page was loaded or whose node counts are implausible for a screen.
# Threshold from the SMILE run's own numbers, which separate cleanly:
#   truncated reads  0, 3, 45          (page not set)
#   full reads       164 … 580         (page set) — median about 265
# 80 sits in the empty middle. A frame that really is sparse (a lone modal) declares
# _meta.smallFrameOK rather than the threshold being lowered for everyone.
MIN_TEXT_NODES = 80


def gate_design_read(dump, min_nodes=MIN_TEXT_NODES):
    """`dump` is inputs/design-elements.json: {slug: {_meta: {...}, elements: [...]}}."""
    fails = []
    if not dump:
        return ["design read: inputs/design-elements.json is empty — Phase 0 did not run"]
    for slug, entry in sorted(dump.items()):
        meta = (entry or {}).get("_meta") or {}
        if not meta.get("pageLoaded"):
            fails.append(f"design read {slug}: no pageLoaded marker — the dump cannot prove "
                         f"setCurrentPageAsync ran, so the tree may be truncated "
                         f"(use engine/figma_dump.js)")
            continue
        total = meta.get("totalText")
        if total is None:
            fails.append(f"design read {slug}: no totalText in _meta — cannot sanity-check the read")
        elif total < min_nodes and not meta.get("smallFrameOK"):
            fails.append(f"design read {slug}: only {total} text nodes on a full screen frame. "
                         f"That is the signature of a partly-loaded page, not an empty design. "
                         f"Re-read with the page set, or mark _meta.smallFrameOK if the frame "
                         f"really is that sparse")
    return fails


def off_canvas_report(dump):
    """Frames drawing content OUTSIDE their own bounds, worst first. Not a gate — a finding
    waiting to be written. Nothing outside a frame renders: not in the export, not in Dev Mode,
    not in a screenshot. The SMILE run found seven table columns and a KPI strip parked at
    x=1274-2849 on a 1440 frame, and only noticed because the BUILD had them."""
    rows = [(e["_meta"].get("offCanvas") or 0, slug, e["_meta"].get("totalText"))
            for slug, e in (dump or {}).items() if (e or {}).get("_meta")]
    return sorted([r for r in rows if r[0]], reverse=True)


# ---------------------------------------------------------------------------------------------
# GATE 2 — visual evidence
def crop_pair(design_png, build_png, dbox, bbox, out_png, pad=110, min_h=260, label=None):
    """Write a 1:1 side-by-side crop of the two anchors. Returns the path, or None if PIL is
    unavailable or an image is missing. Deliberately 1:1 — a shrunk crop is how a 36px tile got
    reported as no tile at all."""
    try:
        from PIL import Image, ImageDraw
    except ImportError:
        return None
    if not (design_png and build_png and os.path.exists(design_png) and os.path.exists(build_png)):
        return None

    def band(path, box):
        im = Image.open(path).convert("RGB")
        x, y, w, h = box
        y0 = max(0, int(y) - pad)
        y1 = min(im.height, int(y) + int(h) + pad)
        if y1 - y0 < min_h:
            y1 = min(im.height, y0 + min_h)
        if y1 - y0 < min_h:
            y0 = max(0, y1 - min_h)
        crop = im.crop((0, y0, min(im.width, 1440), y1))
        return crop, (int(x), int(y) - y0, int(w), int(h))

    a, amark = band(design_png, dbox)
    b, bmark = band(build_png, bbox)
    gap, head = 16, 22
    out = Image.new("RGB", (max(a.width, b.width), head + a.height + gap + head + b.height), "white")
    d = ImageDraw.Draw(out)
    d.text((6, 5), "DESIGN" + (f" · {label}" if label else ""), fill=(120, 60, 10))
    out.paste(a, (0, head))
    d.text((6, head + a.height + gap - 16), "BUILD", fill=(20, 60, 160))
    out.paste(b, (0, head + a.height + gap + 4))
    # ring the element on each side so the eye goes where the claim points
    for (mx, my, mw, mh), dy in ((amark, head), (bmark, head + a.height + gap + 4)):
        d.rectangle([mx - 4, my + dy - 4, mx + max(mw, 12) + 4, my + dy + max(mh, 12) + 4],
                    outline=(230, 90, 20), width=2)
    os.makedirs(os.path.dirname(out_png), exist_ok=True)
    out.save(out_png)
    return out_png


def build_evidence(findings, build_anchors, design_anchors, image_for, out_dir):
    """Generate one crop pair per finding that has both anchors. `image_for(slug)` returns
    (design_png, build_png). Returns {finding_id: path}."""
    made = {}
    for f in findings:
        fid = f["id"]
        b, d = build_anchors.get(fid), design_anchors.get(fid)
        if not (b and d):
            continue
        dp, bp = image_for(b["slug"])
        p = crop_pair(dp, bp, d["box"], b["box"], os.path.join(out_dir, f"{fid}.png"), label=fid)
        if p:
            made[fid] = p
    return made


def gate_evidence(findings, evidence, strict=True):
    """A presence / colour / count / position claim without a crop pair is not publishable."""
    fails = []
    for f in findings:
        cls = f.get("claims") or classify(f.get("title"), f.get("design"), f.get("build"))
        if not needs_picture(cls):
            continue
        if f["id"] in evidence:
            continue
        msg = (f"{f['id']} claims {', '.join(c for c in cls if c in NEEDS_PICTURE)} "
               f"but has no crop pair — a claim about what a picture shows cannot rest on the "
               f"text extraction ({f.get('title', '')[:60]})")
        if f.get("_evidenceWhy"):
            continue                       # explicitly waived, with the reason recorded on the finding
        fails.append(msg)
    return fails if strict else []


# ---------------------------------------------------------------------------------------------
# GATE 3 — the anchor points at what the sentence is about
_STOP = set("""the a an and or of to in on for is are was were be been with without at by from
that this these those its it their there here as not no than then so if when which what where
how all any both each more most other some such only own same too very can will just don't
should now design build figma live screen page row rows column columns element elements""".split())


def _tokens(s):
    return {w for w in re.findall(r"[a-z0-9/]+", str(s or "").lower()) if len(w) > 2 and w not in _STOP}


# A finding that names an element TYPE must be anchored to something that could BE that type.
#
# This is the third version; the first two were wrong in instructive ways. Keyword overlap between
# the anchor's text and the finding's title fired on 55 of 60 findings — a gate that cries wolf
# teaches people to ignore it. Tag-matching alone was no better: in this build a status chip IS a
# <span>, so "chip on a span" is normal.
#
# What actually separates G02's wrong anchor from its right one is the PIXELS the resolver already
# has. "Per page" is a span with bg rgba(0,0,0,0) — nothing is drawn behind it, so it cannot be the
# chip the sentence is about. The corrected anchor is a button with bg rgb(245,190,20). So:
#   · a finding about something FILLED (chip, pill, badge, tile, banner, card) must resolve to an
#     element with a background;
#   · a finding about something INTERACTIVE (button, link, checkbox, dropdown) must resolve to an
#     element whose tag or role can be operated.
FILLED = ("chip", "pill", "badge", "tile", "banner", "card", "band")
INTERACTIVE = {"button": {"button", "a"}, "link": {"a", "button"}, "checkbox": {"input", "label"},
               "dropdown": {"select", "button"}, "select": {"select", "button"},
               "toggle": {"button", "input", "label"}, "input": {"input", "textarea"}}
_TRANSPARENT = re.compile(r"rgba\([^)]*,\s*0(\.0+)?\s*\)|^transparent$|^none$", re.I)


def _has_background(anchor):
    bg = anchor.get("bg")
    if bg in (None, ""):
        return None                      # unknown — the capture did not record it; do not judge
    return not bool(_TRANSPARENT.search(str(bg)))


def gate_anchor_matches(findings, build_anchors):
    """Flag an anchor that cannot be the component the finding is about.

    A finding whose element has no text of its own — an icon, a tinted tile — is legitimately
    anchored to a neighbour. It says so in `_anchorWhy`, and that sentence is worth having: it is
    the difference between a considered choice and a resolver accident.
    """
    fails = []
    for f in findings:
        fid = f["id"]
        a = build_anchors.get(fid)
        if not a or f.get("_anchorWhy") or a.get("_anchorWhy"):
            continue
        title = str(f.get("title") or "").lower()
        tag = (a.get("tag") or "").lower() or None
        role = (a.get("role") or "").lower() or None
        what = a.get("anchor") or a.get("text")

        for word in FILLED:
            if not re.search(r"\b" + word + r"s?\b", title):
                continue
            if _has_background(a) is False:
                fails.append(f"{fid}: the finding is about a {word}, but the anchor {what!r} has no "
                             f"background ({a.get('bg')}) — a {word} is drawn on a fill, so this is "
                             f"the element BESIDE it (the G02 mistake). Re-anchor, or say why in "
                             f"`_anchorWhy`")
            break

        for word, ok in INTERACTIVE.items():
            if not re.search(r"\b" + word + r"s?\b", title):
                continue
            if tag in ok or role in ok:
                break
            fails.append(f"{fid}: the finding is about a {word}, but the anchor {what!r} resolved to "
                         f"{'a <' + tag + '>' if tag else 'an untagged element'} — that cannot be "
                         f"operated. Re-anchor to the control, or say why in `_anchorWhy`")
            break
    return fails


def gate_anchor_on_canvas(build_anchors, png_size):
    """GATE 3b — an anchor box must lie on the image it claims to mark.

    NMB-SCREEN-027 shipped with a build box at x1478-1798 on a capture 1440 wide: the pin was
    entirely off the picture, and every other gate passed it. `gate_anchor_matches` asks whether
    the anchor is the RIGHT KIND of element; nothing asked whether it is anywhere a reader can
    see. The page is often wider than the export - a horizontally scrolling table, an off-canvas
    widget panel - so a box measured from the extraction's page coordinates can sit outside the
    PNG without anything looking wrong in the data.

    `png_size(slug) -> (w, h)` or None when the capture is missing.
    A box that merely overhangs the edge by a few pixels is reported, not failed: the element is
    still visible and the crop still works. A box with NO overlap at all is a failure.
    """
    fails, warns = [], []
    for fid, a in sorted(build_anchors.items()):
        slug = a.get("slug")
        size = png_size(slug) if slug else None
        if not size:
            continue
        w, h = size
        try:
            x, y, bw, bh = [float(v) for v in a["box"]]
        except (KeyError, TypeError, ValueError):
            continue
        ix = max(0.0, min(x + bw, w) - max(x, 0.0))
        iy = max(0.0, min(y + bh, h) - max(y, 0.0))
        if ix <= 0 or iy <= 0:
            fails.append(f"{fid}: the build anchor box {[int(v) for v in (x, y, bw, bh)]} does not "
                         f"touch {slug}.png ({int(w)}x{int(h)}) — the pin would be drawn off the "
                         f"picture. Re-measure against the EXPORT, not the page: a scrolling table "
                         f"or an off-canvas panel makes the page wider than the image.")
        elif ix * iy < bw * bh * 0.6:
            warns.append(f"{fid}: the build anchor box {[int(v) for v in (x, y, bw, bh)]} is only "
                         f"{100.0 * ix * iy / (bw * bh):.0f}% inside {slug}.png "
                         f"({int(w)}x{int(h)}) — the pin lands, the crop is clipped.")
    return fails, warns


def anchor_word_overlap(findings, build_anchors):
    """Soft signal, reported and never fatal: anchors whose text shares no word with the finding.
    Most are fine — a chip's only text is its number. Read it as a shortlist to eyeball."""
    weak = []
    for f in findings:
        a = build_anchors.get(f["id"])
        if not a or f.get("_anchorWhy") or a.get("_anchorWhy"):
            continue
        if _tokens(f.get("title")) & (_tokens(a.get("text")) | _tokens(a.get("anchor"))):
            continue
        weak.append((f["id"], a.get("anchor") or a.get("text"), str(f.get("title") or "")[:60]))
    return weak


# ---------------------------------------------------------------------------------------------
# GATE 4 — two findings, one box
def gate_duplicate_anchors(design_anchors, allow=()):
    """G08 (text-size controls) and G09 (contrast control) both carried the box of the LANGUAGE
    selector. Both markers looked plausible and both were wrong. Legitimate sharing — two findings
    about the same breadcrumb — is declared in `allow` as {(id, id)} pairs."""
    fails, seen = [], {}
    ok = {frozenset(p) for p in allow}
    ok |= {frozenset(p) for p in allow}      # ids may be the working or the published form
    for fid, a in sorted(design_anchors.items()):
        key = (a.get("node"), tuple(a.get("box") or ()))
        if key in seen:
            if frozenset((seen[key], fid)) in ok:
                continue
            fails.append(f"{fid} and {seen[key]} resolve to the SAME design box {list(key[1])} on "
                         f"{key[0]} — one of them is almost certainly on the wrong element. If the "
                         f"sharing is deliberate, list the pair in the project's allowSharedAnchors")
        else:
            seen[key] = fid
    return fails


# ---------------------------------------------------------------------------------------------
def run_all(findings, build_anchors, design_anchors, image_for, out_dir,
            design_dump=None, allow_shared=(), strict_evidence=True, png_size=None):
    """Every claim gate in one call. Returns (failures, evidence_paths).

    `png_size(slug) -> (w, h)` enables GATE 3b, which checks that an anchor box is actually on
    the picture. Callers that cannot measure their captures may omit it; the gate is then skipped
    and `run_all` reports that it was, rather than passing silently."""
    fails = []
    if png_size is not None:
        onfails, onwarns = gate_anchor_on_canvas(build_anchors, png_size)
        fails += onfails
        run_all.canvas_warnings = onwarns
    else:
        run_all.canvas_warnings = ["GATE 3b (anchor on canvas) SKIPPED — no png_size supplied"]
    if design_dump is not None:
        fails += gate_design_read(design_dump)
    for f in findings:
        f.setdefault("claims", classify(f.get("title"), f.get("design"), f.get("build")))
    evidence = build_evidence(findings, build_anchors, design_anchors, image_for, out_dir)
    fails += gate_evidence(findings, evidence, strict=strict_evidence)
    fails += gate_anchor_matches(findings, build_anchors)
    fails += gate_duplicate_anchors(design_anchors, allow=allow_shared)
    return fails, evidence
