#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Integrity gates distilled from the NMBA run of 2026-09-11.

Every gate here exists because something WRONG was published and a human caught it. Each one
names the finding it would have stopped, so a future maintainer can tell a real rule from a
tidy-looking assertion.

The through-line of that run: the audit's own instruments were lying, and nothing checked them.
A capture harness that moved the layout, an anchor matcher that pointed at the wrong element, a
report writer that put one finding's text under another's id, a tracker merge that told a
developer a withdrawn finding was open work. Findings were checked; the machinery that produced
them was not.

    from engine import integrity
    integrity.gate_absence_claims(findings)          -> [str, ...]
"""
import re

# ---------------------------------------------------------------------------------------------
# The words a finding uses when it asserts that something is NOT THERE. An absence is the one
# claim a screenshot cannot support - the thing may be off the crop, hidden behind a panel, or
# drawn as a picture - and it is the claim this project has got wrong most often.
ABSENCE = re.compile(
    r"\b(is|are|was|were)?\s*(absent|missing|not present|not rendered|not built|not drawn|"
    r"no longer|nowhere|has lost|have lost|lose[sd]?|drops?|dropped|removed|gone|"
    r"there is no|there are no|none of|carries no|carry no|with no)\b", re.I)

# A live-DOM check, declared. Any of these in the build text (or an explicit `_liveCheck`) is the
# finding saying "I asked the running page, not the picture".
LIVE_CHECKED = re.compile(
    r"(checked|verified|re-?checked|read|measured|counted)\s+(it\s+)?"
    r"(in|on|from|against)\s+the\s+(live|running|DOM)|"
    r"\bin the DOM\b|\bon the live (build|page)\b|\bfrom the DOM\b", re.I)

HEX = re.compile(r"#[0-9A-Fa-f]{6}\b")

# A hex the sentence hands to the DESIGN, inside a paragraph about the build. Three of the four
# first-run failures of gate_quoted_build_colours were this: "…a near-miss of the design's
# #27682A". Naming the design's value while reporting the build's is good writing, and a gate that
# punishes it would teach people to write worse findings.
DESIGN_OWNED = re.compile(r"(design(?:'s|s')?|designed|Figma|drawn in the design)\s+"
                          r"(?:\w+\s+){0,3}?(#[0-9A-Fa-f]{6})\b", re.I)

RGB = re.compile(r"rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)", re.I)
# Alpha exactly 0 — the FOURTH component, in either the comma or the slash notation. Spelling this
# as `[^)]*[,/]\s*0\s*\)` instead read `rgb(0, 0, 0)` and `rgb(230, 81, 0)` as transparent, because
# a plain three-part colour whose BLUE is zero also ends in ", 0)". It made opaque black vanish and
# it made NMB-SCREEN-021's ODIC orange vanish — a lazy pattern quietly deleting real colours.
TRANSPARENT = re.compile(
    r"(^|\s)transparent(\s|$)"
    r"|rgba?\(\s*[\d.]+[,\s]+[\d.]+[,\s]+[\d.]+\s*[,/]\s*0(\.0+)?%?\s*\)"
    r"|oklch\([^)]*/\s*0(\.0+)?%?\s*\)", re.I)
OKLCH = re.compile(r"oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)", re.I)


def _hex(r, g, b):
    f = lambda v: max(0, min(255, int(round(v))))
    return "#%02X%02X%02X" % (f(r), f(g), f(b))


def _oklch_to_hex(L, C, H):
    """Tailwind v4 emits oklch(), so a build colour read from a modern estate arrives in a space
    a naive `\d+` scrape turns into garbage: oklch(0.872 0.01 258.338) came out as '#0036800'.
    A gate that mis-reads the build's own colours reports differences that are not there.

    oklch -> oklab -> linear sRGB -> sRGB, per CSS Color 4.
    """
    import math
    h = math.radians(H)
    a, b = C * math.cos(h), C * math.sin(h)
    l_ = L + 0.3963377774 * a + 0.2158037573 * b
    m_ = L - 0.1055613458 * a - 0.0638541728 * b
    s_ = L - 0.0894841775 * a - 1.2914855480 * b
    l, m, s = l_ ** 3, m_ ** 3, s_ ** 3
    lin = (+4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
           -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
           -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s)
    def enc(u):
        u = max(0.0, min(1.0, u))
        return 12.92 * u if u <= 0.0031308 else 1.055 * u ** (1 / 2.4) - 0.055
    return _hex(*[enc(u) * 255 for u in lin])


def colours_in(value):
    """Every colour a CSS value names, as upper-case hex.

    A border shorthand carries one colour per side — 'rgb(0, 120, 168) rgb(0, 120, 168)
    rgb(204, 204, 204)' is three, and reading only the first hides the odd one out, which is
    exactly the side a finding is usually about.
    """
    out = []
    for v in (value if isinstance(value, (list, tuple)) else [value]):
        s = str(v or "")
        # A fully transparent colour paints NOTHING, and must not be reported as one. The
        # extraction records an unstyled background as `rgba(0, 0, 0, 0)`, which this function
        # used to read as #000000 — so 70 transparent divs on one page looked like 70 black ones,
        # and the completeness check (which compares rows against the inventory, where the browser
        # had correctly skipped them) called 49 of 51 inventories short. Same rule, both sides.
        if TRANSPARENT.search(s):
            continue
        out += [h.upper() for h in HEX.findall(s)]
        out += [_hex(float(r), float(g), float(b)) for r, g, b in RGB.findall(s)]
        for L, C, H in OKLCH.findall(s):
            L = float(L[:-1]) / 100 if L.endswith("%") else float(L)
            out.append(_oklch_to_hex(L, float(C), float(H)))
    return out


def _norm(s):
    """Figma stores a soft line break as U+2028 and a paragraph break as U+2029. Text compared
    without normalising these reports differences that are not there: fingerprinting the NMBA
    review sheet said 35 of 66 rows had been edited when the true answer was 3."""
    if s is None:
        return ""
    return " ".join(str(s).replace(" ", "\n").replace(" ", "\n").split())


# ---------------------------------------------------------------------------------------------
# GATE — an absence is confirmed against the live DOM, never against a capture
def gate_absence_claims(findings):
    """A finding that says something is not there must say where it looked.

    NMB-SCREEN-016 claimed the NMBA pledge banner had lost its call to action. The button was
    always there, at x1171; the capture had been taken with the horizontal axis un-clipped, which
    pushed it to x1841, outside the 1440 export. Four claim gates, a PDF, a Figma report and a
    Google Drive tracker all carried it out of the building.

    A capture is evidence of what a screen LOOKS like. It is never evidence that something is
    absent.
    """
    fails = []
    for f in findings:
        text = " ".join(str(f.get(k) or "") for k in ("title", "build"))
        if not ABSENCE.search(text):
            continue
        if f.get("_liveCheck") or LIVE_CHECKED.search(str(f.get("build") or "")):
            continue
        fails.append(
            f"{f.get('id')}: claims something is absent but does not say it was checked on the "
            f"live page. Ask the running DOM and say so in the build text (or set `_liveCheck`) "
            f"— NMB-SCREEN-016 shipped this way and was wrong")
    return fails


# ---------------------------------------------------------------------------------------------
# GATE — a colour quoted for the BUILD was read from the build
# Max per-channel distance that still counts as "the same colour, read badly". Set from the two
# real cases rather than by taste: the served #ED8525 sampled as #E08020 (13 apart) and the card
# edge #E5E7EB quoted as #E5EAF2 (7). A design colour sampled off a glyph lands far further away
# — #003366 sampling as #7F99B2 is 127 — and that is a different mistake, caught by the warning.
INVENTORY_BUCKETS = ("color", "bg", "border", "outline")


def inventory_hexes(inv):
    """A colour inventory, in either recorded shape, -> {hex: count}, via the one tested parser.

    Two shapes exist in committed audits, because two capture paths each grew one, and BOTH keep
    reading — no audit that has already been delivered is thrown away:

      * FLAT — {raw CSS value: count}. The capture bundle's `colorInventory`, written by
        COLOR_INVENTORY_JS. capture.py records RAW computed values on purpose; an older bundle
        recorded hex keys instead, and those parse to themselves.
      * BUCKETED — {"color"|"bg"|"border"|"outline": {raw: count}, "elementsWalked": n,
        "complete": bool}. The per-screen extraction's `colorInventory`, written by the PM-AJAY run.
    """
    if not inv:
        return {}
    if any(b in inv for b in INVENTORY_BUCKETS):
        flat = {}
        for b in INVENTORY_BUCKETS:
            for raw, n in (inv.get(b) or {}).items():
                flat[raw] = flat.get(raw, 0) + n
    else:
        flat = {raw: n for raw, n in inv.items() if isinstance(n, (int, float))}
    out = {}
    for raw, n in flat.items():
        for h in colours_in(raw):
            out[h] = out.get(h, 0) + n
    return out


def inventory_licenses_failure(inv):
    """May this inventory prove a colour ABSENT from the screen? Decided from what the capture
    RECORDED, never inferred from the rows (see the gate's docstring for why inference failed).

      * nothing recorded                               -> no. The rows carry no containers.
      * BUCKETED, and the walk did not record `complete: true` — it hit its element cap, or the
        capture predates the flag                      -> no. A sample cannot prove an absence.
      * FLAT, and non-empty                            -> yes. COLOR_INVENTORY_JS has no cap to hit.
    """
    if not inventory_hexes(inv):
        return False
    if any(b in inv for b in INVENTORY_BUCKETS):
        return inv.get("complete") is True
    return True


NEAR_MISS = 24


def _near(a, b):
    return max(abs(int(a[i:i + 2], 16) - int(b[i:i + 2], 16)) for i in (1, 3, 5))


def gate_quoted_build_colours(findings, rows_for, warnings=None, inventory_for=None,
                              union_colours=None):
    """A hex attributed to the BUILD must be a value the build actually renders.

    A glyph sampled off a screenshot returns the anti-aliased average of the glyph and its
    ground: the NMBA edit icon is #ED8525 in the file the build serves and #E08020 in a pixel
    sample, and the design's #003366 icon samples as #7F99B2. A developer cannot grep for a
    colour that exists nowhere in the code.

    **What counts as evidence decides what this gate may do.**

    The element rows are not an inventory of the page. They carry text and interactive elements,
    NOT containers — so a card's own border is invisible to them. The first version of this gate
    read absence from the rows as proof and failed NMB-SCREEN-046, whose "1px #E5EAF2 edge" is
    not only real but hard-coded in the class (`border-[#E5EAF2]`) on nine cards; the rows only
    knew the #E5E7EB used on 16 other elements of the same page, 7 points away, so the near-miss
    rule fired on a correct finding. That is the unfounded-absence mistake this module exists to
    stop, made by the module itself — and it is worst on findings that are ABOUT near-misses,
    which is most of them.

    So `capture.py` records a page colour inventory too, and the gate reads the UNION of both
    sources. The union is the point: each source sees what the other misses. The inventory walks
    every visible element, so it has the containers the rows lack; the rows survive the inventory's
    scan cap, which PUBLIC-FACILITIES — a lazy-loading list 223,000px tall — exceeds, leaving its
    ODIC chip out of the inventory while NMB-SCREEN-021 correctly reports that chip's #E65100.

      * in either source                            -> pass
      * in neither, the inventory LICENSES a failure (inventory_licenses_failure), and within
        NEAR_MISS of something in the union         -> FAIL. The fingerprint of a sampled value.
      * in neither, licensed, far from anything     -> warning; confirm it and declare `_colourWhy`
      * in neither and NOT licensed                 -> warning at most, never a failure. The rows
                                                       carry no containers, so their silence proves
                                                       nothing, and a capped walk is a sample.
      * no evidence at all for the screen           -> skipped, silently. Nothing to say.

    Whether an inventory exists, and whether its walk hit its cap, are facts the capture RECORDS.
    Whether it is complete must never be INFERRED. An earlier version inferred it by checking the
    rows against the inventory and routing "incomplete" ones to warn-only; every version cried wolf
    — 49 of 51 screens, then 47 — because the extraction legitimately records things the browser is
    right not to count: a 0x0 hidden <button>, a borderColor on a zero-width border. A completeness
    test that fires on 47 of 51 does not protect the gate, it disables it.

    Two kinds of finding are judged differently, both from the PM-AJAY run:

      * A DESIGN-SYSTEM finding is not a claim about what this build paints, and is not judged.
        PMA-DS-001's build text names the Figma library's grey ramp and the token contract's side
        by side, because the finding IS that the two disagree — and every one of those hexes was
        read as a build colour and convicted. The finding was right; the gate asked the wrong
        question.
      * A GLOBAL finding's colours were measured ACROSS the portal, not on its one representative
        screen. Judging "#314158 on 43 screens" against the dashboard's own inventory convicts a
        correct finding for naming a colour that screen happens not to paint, so a claim about
        every screen is judged against `union_colours` — every colour ANY captured screen paints.

    `inventory_for(slug)` returns an inventory in either shape, or None; `rows_for(slug)` returns
    the rows or None; `union_colours` is a set of hexes, or None.
    """
    fails = []
    for f in findings:
        slug = f.get("slug")
        if not slug or f.get("_colourWhy"):
            continue
        scope = str(f.get("scope") or "")
        if scope == "Design System":
            continue
        raw_inv = inventory_for(slug) if inventory_for else None
        inv = inventory_hexes(raw_inv)
        licensed = inventory_licenses_failure(raw_inv)
        seen = set(inv)
        for r in rows_for(slug) or []:
            for key in ("color", "bg", "borderColor", "outlineColor", "fill"):
                if r.get(key):
                    seen.update(colours_in(r[key]))
        if scope == "Global" and union_colours:
            seen |= {h.upper() for h in union_colours}
            licensed = True
        if not seen:
            continue
        build = str(f.get("build") or "")
        design_owned = {m.group(2).upper() for m in DESIGN_OWNED.finditer(build)}
        for hexv in sorted({h.upper() for h in HEX.findall(build)} - design_owned):
            if hexv in seen:
                continue
            close = sorted((c for c in seen if _near(hexv, c) <= NEAR_MISS),
                           key=lambda c: _near(hexv, c))
            if close and licensed:
                fails.append(
                    f"{f.get('id')}: quotes {hexv} as a BUILD colour, but nothing on {slug} paints "
                    f"it; the nearest the page does paint is {close[0]}, "
                    f"{_near(hexv, close[0])} apart on one channel. That gap is what a pixel "
                    f"sample looks like. Read the value out of the DOM, not off a screenshot")
            elif warnings is None:
                continue
            elif close:
                warnings.append(
                    f"{f.get('id')}: quotes {hexv}; {slug} renders {close[0]} nearby "
                    f"({_near(hexv, close[0])} apart) — but {slug} has no colour inventory complete "
                    f"enough to prove an absence, so absence is not proven. Re-capture to judge "
                    f"colours")
            elif licensed:
                warnings.append(
                    f"{f.get('id')}: {hexv} is attributed to the build but nothing on {slug} "
                    f"paints it, or anything near it — confirm it in the DOM and declare "
                    f"`_colourWhy`")
            else:
                warnings.append(
                    f"{f.get('id')}: {hexv} could not be judged — {slug} has no colour inventory "
                    f"complete enough to prove an absence, and the element rows carry no "
                    f"containers. Confirm it in the DOM and declare `_colourWhy`")
    return fails


# ---------------------------------------------------------------------------------------------
# GATE — an anchor whose text another element's text begins with
def gate_anchor_ambiguity(build_anchors, rows_for):
    """A short label silently swallows a longer one that starts with it.

    The anchor matcher is prefix-forgiving because the extraction truncates long strings. That
    rule also let the NMBA sidebar's "Nasha Mukti Mitr" claim the masthead's "Nasha Mukti Mitr
    Login": NMB-SCREEN-027's marker was drawn 1100px from its subject, on a real element with a
    plausible tag, so every other gate passed it.
    """
    fails = []
    for fid, a in sorted(build_anchors.items()):
        slug, text = a.get("slug"), _norm(a.get("text"))
        if not slug or len(text) < 4:
            continue
        rows = rows_for(slug)
        if not rows:
            continue
        rivals = {_norm(r.get("text")) for r in rows}
        rivals.discard(text)
        longer = [t for t in rivals if t.startswith(text) and len(t) > len(text)]
        if longer:
            fails.append(
                f"{fid}: the anchor {text!r} is the start of {len(longer)} other label(s) on "
                f"{slug} — e.g. {sorted(longer)[0]!r}. A prefix match can take the wrong one "
                f"silently; anchor on the full string or use an @box")
    return fails


# ---------------------------------------------------------------------------------------------
# GATE — every anchored finding is pinned on the review sheet
def gate_review_sheet_pins(rows, findings, anchors=None):
    """The reviewer asked for markers on the review sheet twice before they appeared.

    Without them the sheet asks a reviewer to find the thing the sentence is about by reading the
    sentence, which is the one job the picture was put there to do.

    What counts as pinnable is the ANCHOR, not the slug. Some findings are deliberately global
    and deliberately unanchored — NMBA's filters note is one sentence covering every filtered
    screen, by instruction — and their slug is a pseudo-screen named after the finding itself.
    Demanding a marker for those asks for a pin with nothing to point at. Pass `anchors` and the
    gate asks only of findings that have somewhere to point.
    """
    fails = []
    anchored = ({f["id"] for f in findings if f["id"] in anchors} if anchors is not None
                else {f["id"] for f in findings if f.get("slug")})
    pinned = {p["id"] for r in rows for p in (r.get("pins") or [])}
    for fid in sorted(anchored - pinned):
        fails.append(f"{fid}: has a screen and an anchor but no marker on the review sheet")
    for r in rows:
        for p in (r.get("pins") or []):
            for side in ("d", "b"):
                k = side + "xPct"
                if k in p and not (0 <= p[k] <= 100):
                    fails.append(
                        f"{p['id']}: marker on {r.get('slug')} is at {p[k]:.1f}% of the image — "
                        f"outside it. A marker off the picture is a lie about where to look")
    return fails


# ---------------------------------------------------------------------------------------------
# GATE — the hand-built report says what the master says
def gate_report_matches_master(cards, findings):
    """The Figma report is the one deliverable assembled by mutating nodes rather than generated
    from audit-master.json, and it is the only one that has ever been wrong.

    Four NMBA cards carried another finding's text. NMB-SCREEN-050 rendered NMB-SCREEN-030's
    title, severity, category and all three body paragraphs under its own id, and the reviewer
    found it, not a gate. An ID-ONLY check passes that card. Compare the title and the severity
    too.

    `cards` is [{"id":…, "shownId":…, "title":…, "severity":…}, …] read back from the file.
    """
    fails = []
    by_id = {f["id"]: f for f in findings}
    for c in cards:
        fid = c.get("id")
        m = by_id.get(fid)
        if not m:
            fails.append(f"{fid}: a card exists for an id that is not in the master")
            continue
        if c.get("shownId") and c["shownId"] != fid:
            fails.append(f"{fid}: the card shows the id {c['shownId']}")
        shown = _norm(c.get("title"))
        if shown and not _norm(m.get("title")).startswith(shown.rstrip(". ")):
            fails.append(
                f"{fid}: the card's title is not this finding's — shows {shown[:44]!r}, "
                f"master says {_norm(m.get('title'))[:44]!r}")
        if c.get("severity") and m.get("sev") and c["severity"] != m["sev"]:
            fails.append(
                f"{fid}: the card says {c['severity']}, the master says {m['sev']}")
    missing = {f["id"] for f in findings} - {c.get("id") for c in cards}
    for fid in sorted(missing):
        fails.append(f"{fid}: in the master but has no card in the report")
    return fails


# ---------------------------------------------------------------------------------------------
# GATE — the captures describe the page, not the harness
def gate_capture_layout(screens):
    """Fails any screen whose elements moved sideways while the harness un-clipped it.

    capture.py measures a set of stable elements before and after the unclip pass and records
    `layoutShift`. A non-empty list means the capture has stopped describing the page.
    """
    fails = []
    for s in screens:
        shift = s.get("layoutShift") or []
        if shift:
            worst = max(shift, key=lambda d: abs(d.get("after", 0) - d.get("before", 0)))
            fails.append(
                f"{s.get('slug')}: {len(shift)} element(s) moved sideways during the unclip "
                f"pass — worst {worst.get('text')!r} x{worst.get('before')} -> "
                f"x{worst.get('after')}. Findings from this capture cannot be trusted")
    return fails


# ---------------------------------------------------------------------------------------------
# GATE — the copy people read matches the copy we keep
def tracker_parity(local_rows, remote_rows, dev_owned=("Status", "Assignee", "Date", "Notes")):
    """Cell-by-cell differences between the local workbook and the shared copy, for one tab.

    Row counts matched. Ids matched. Four defects hid behind that on 2026-09-11, including the
    Drive tracker telling a developer that a WITHDRAWN finding was open work — a finding
    withdrawn precisely because it was wrong.

    Each side is {id: {column: value}}. Dev-owned columns are reported separately: a human
    editing the shared copy is expected, and is not a defect.
    """
    out = {"only_local": sorted(set(local_rows) - set(remote_rows)),
           "only_remote": sorted(set(remote_rows) - set(local_rows)),
           "generated_differs": [], "dev_differs": []}
    for fid in sorted(set(local_rows) & set(remote_rows)):
        a, b = local_rows[fid], remote_rows[fid]
        for col in sorted(set(a) | set(b)):
            if _norm(a.get(col)) == _norm(b.get(col)):
                continue
            entry = (fid, col, str(a.get(col))[:40], str(b.get(col))[:40])
            (out["dev_differs"] if col in dev_owned else out["generated_differs"]).append(entry)
    return out


def gate_tracker_parity(local_rows, remote_rows, **kw):
    """The failing half of `tracker_parity`: a GENERATED column must never differ."""
    rep = tracker_parity(local_rows, remote_rows, **kw)
    fails = []
    for fid in rep["only_local"]:
        fails.append(f"{fid}: in the local tracker, missing from the shared copy")
    for fid in rep["only_remote"]:
        fails.append(f"{fid}: in the shared copy, missing from the local tracker")
    for fid, col, a, b in rep["generated_differs"]:
        fails.append(f"{fid}: generated column {col!r} differs — local {a!r} vs shared {b!r}")
    return fails


# ---------------------------------------------------------------------------------------------
# GATE — a finding with no design to point at must cite the standard it convicts against
#
# Every audit before PM-AJAY had a Figma frame in the left panel, and that frame WAS the
# authority: the reader compared two pictures and judged for themselves. A portal with no design
# frames has no such panel, and the failure mode that opens up is not a wrong measurement — it is
# an unfalsifiable one. "The card's border is too light" with nothing behind it is an opinion
# wearing a finding's clothes, and a report of those is worth less than no report, because a
# developer cannot tell which items are obligations.
#
# So on a design-less audit every finding names its authority, and the authority must be one a
# reader can go and check:
#
#   * a token          `--sa-border-neutral-subtle`     the generated contract publishes it
#   * a WCAG criterion `WCAG 2.2 1.4.3`                 legally binding on a GoI property
#   * a GIGW/DBIM rule `GIGW 3.0 3.4.2`, `DBIM §4.4`    mandatory standards, docs/guidelines/
#   * a DS component   `DS::SectionTitle`                 the estate publishes it; use it
#   * an estate rule   `rules/data-state-completeness.md` mandatory, path-scoped, in-repo
#   * a house gap      `HOUSE-GAP`                      the contract and the Figma file disagree;
#                                                       raised against the DS, not the portal
#
# The last one is not an escape hatch — it is the honest classification for the Tailwind-vs-
# SAMAVESH neutral divergence, and a finding that claims it is routed to a different audience.
CITATION = re.compile(
    r"--sa-[a-z0-9-]+"                                  # a token in the generated contract
    r"|WCAG\s*2\.[0-2]\s*\d+\.\d+\.\d+"                 # a success criterion, with its version
    r"|GIGW\s*3\.0[\s§]*[\d.]+"                    # a GIGW clause
    r"|DBIM[\s§]*[\d.]+"                           # a DBIM clause
    r"|UX4G[\s§]*[\d.]+"                           # a UX4G clause (recommended, not mandatory)
    r"|HOUSE-GAP"                                       # the DS and the handoff file disagree
    r"|[\w.-]*rules/[a-z0-9-]+\.md"                     # a mandatory estate rule, by file
    r"|\b(DS|design-system)\s*::\s*[A-Z][A-Za-z]+",     # a published component, e.g. DS::SectionTitle
    re.I)

#: A citation that is only a bare criterion number ("1.4.3") is ambiguous between WCAG versions
#: and between standards. It is rejected on purpose: the reader must be able to look it up.
BARE_NUMBER = re.compile(r"^\s*[\d.]+\s*$")


def gate_standard_citation(findings, require=True):
    """Every finding cites a checkable authority. Only runs where there is no design to compare.

    `_cites` is a list of strings. One recognised citation is enough — a finding needs an
    authority, not a bibliography. A finding that is purely a judgment call may say so with
    `_judgment` plus a reason, and it is then reported as 👤 rather than 🤖; what it may not do
    is read as a measurement while resting on nothing.
    """
    if not require:
        return []
    fails = []
    for f in findings:
        fid = f.get("id") or "?"
        if f.get("_judgment"):
            if not str(f.get("_judgment")).strip():
                fails.append(f"{fid}: declares `_judgment` with no reason — say what the call "
                             f"rests on, or cite a standard")
            continue
        cites = f.get("_cites")
        if isinstance(cites, str):
            cites = [cites]
        if not cites:
            fails.append(
                f"{fid}: no `_cites`. With no design frame to compare against, a finding must "
                f"name the authority it convicts against — a --sa-* token, a WCAG 2.2 criterion, "
                f"a GIGW/DBIM clause, a design-system component, or HOUSE-GAP. Without one it is "
                f"an opinion, and a developer cannot tell it from an obligation")
            continue
        bare = [c for c in cites if BARE_NUMBER.match(str(c))]
        if bare and not any(CITATION.search(str(c)) for c in cites):
            fails.append(
                f"{fid}: cites {bare[0]!r}, a bare number. Name the standard and its version "
                f"— 'WCAG 2.2 1.4.3', not '1.4.3' — so the reader can look it up")
            continue
        if not any(CITATION.search(str(c)) for c in cites):
            fails.append(
                f"{fid}: `_cites` {cites!r} names no recognised authority. Expected a --sa-* "
                f"token, 'WCAG 2.2 x.y.z', a GIGW 3.0 / DBIM clause, or HOUSE-GAP")
    return fails


def gate_house_gap_routing(findings):
    """A HOUSE-GAP finding must not be charged to the portal.

    The divergence this exists for: the handoff file's neutral ramp is Tailwind's default greys
    (#1f2937 on 23,853 sampled nodes across all ten non-draft pages), and none of those values
    appears even once in the generated token contract, which publishes its own ramp (#1e2124,
    #3a3d41, #dcdee1, #6f757d) 4-11 points away. A build that followed the design file is not
    defective; the design system and the design file disagree.

    So a HOUSE-GAP finding carries `scope: "Design System"` and no severity that implies the
    portal team owes the fix. Getting this wrong would hand a developer thousands of items they
    cannot act on, which is how a report loses a reader for good.
    """
    fails = []
    for f in findings:
        cites = f.get("_cites") or []
        if isinstance(cites, str):
            cites = [cites]
        if not any("HOUSE-GAP" in str(c).upper() for c in cites):
            continue
        fid = f.get("id") or "?"
        if (f.get("scope") or "") != "Design System":
            fails.append(
                f"{fid}: cites HOUSE-GAP but its scope is {f.get('scope')!r}. A disagreement "
                f"between the token contract and the handoff library is owed by the design "
                f"system — set scope to 'Design System' so it reaches the right audience")
        if str(f.get("severity") or "").title() == "Blocker":
            fails.append(
                f"{fid}: cites HOUSE-GAP at Blocker severity. The portal cannot ship a fix for a "
                f"standard that does not yet agree with itself — re-rank it")
    return fails


# ---------------------------------------------------------------------------------------------
# The ratchet — how a new gate lands on an audit that already shipped
ID_IN = re.compile(r"\b([A-Z]{2,5}-[A-Z]+-\d{3}|[A-Z0-9-]{3,}(?=:))")


def ratchet(fails, baseline):
    """Split a gate's failures into (new, still owed, fixed-but-not-re-baselined).

    A gate written after a portal has shipped will fail on findings nobody can now re-word: the
    ids are frozen, the PDF is signed, the tracker is on someone's Drive. The estate's answer to
    that everywhere else — `check:ds-pages`, `check:figma-arrangements` — is a baseline that may
    only shrink, and this is the same shape:

      * a failure not in the baseline          -> a real failure, fail the run
      * a failure in the baseline              -> known debt, counted and named, does not fail
      * a baseline entry that no longer fails  -> FAIL until it is removed

    The third case is the one that makes it a ratchet rather than a suppression list: without it,
    one finding's repair can be spent silently on another's regression.

    `baseline` is {id: reason}. The reason is not decoration — it is what a maintainer reads in
    six months to decide whether the debt is still real.
    """
    failing = {}
    for msg in fails:
        m = ID_IN.search(msg)
        failing[m.group(1) if m else msg] = msg
    new = [failing[k] for k in sorted(failing) if k not in baseline]
    owed = sorted(k for k in failing if k in baseline)
    stale = sorted(k for k in baseline if k not in failing)
    return new, owed, stale


# ---------------------------------------------------------------------------------------------
# GATE — what a reader is handed contains nothing written for the pipeline
PUBLISHED_ID = re.compile(r"\b[A-Z]{2,5}-(?:GLOBAL|SCREEN|[A-Z]{3,8})-\d{3}\b")
PIPELINE_NOTE = re.compile(r"\((?:Anchor|Evidence|anchorWhy|evidenceWhy|Pin|Crop)\s*:|\bGATE\s*\d"
                           r"|_anchorWhy|_evidenceWhy|_liveCheck|_colourWhy", re.I)
READER_FIELDS = ("element", "figma", "live", "fix")


def gate_reader_text(findings, withdrawn_ids=()):
    """Every sentence a developer reads is about the build, and every id it cites resolves.

    Two defects shipped in the NMBA report, and the reviewer saw them as "a difference between
    Figma and the PDF":

      * 13 findings carried `(Anchor: ...)` engineering notes appended to their FIX text —
        "GATE 3 flagged this one, correctly and usefully..." — in the one sentence a developer acts
        on. The Figma cards, built separately, had the clean text.
      * Two cross-references pointed nowhere: NMB-GLOBAL-040 cited "NMB-GLOBAL-019", a WORKING id
        (G19) written into published prose where NMB-GLOBAL-035 was meant; NMB-SCREEN-050 cited a
        withdrawn id that stopped appearing anywhere once the report dropped its deferred section.

    `findings` are master-shaped (`id` + READER_FIELDS). A cited id must be a finding in THIS set;
    `withdrawn_ids` is accepted separately and still FAILS when the report no longer lists them,
    because a reader cannot look up an id the document does not contain.
    """
    fails = []
    ids = {f["id"] for f in findings}
    for f in findings:
        if f.get("fix") and _norm(f.get("fix")) == _norm(f.get("live")):
            # NMB-GLOBAL-031's fix was its build paragraph copied, so a developer's instruction
            # read "This is raised once, as a note: ..." — a sentence about the audit
            fails.append(f"{f['id']}: the fix is a verbatim copy of the build text — it describes "
                         f"the defect again instead of saying what to change")
        for field in READER_FIELDS:
            text = str(f.get(field) or "")
            m = PIPELINE_NOTE.search(text)
            if m:
                fails.append(f"{f['id']}: {field} carries a pipeline note a developer should never "
                             f"read — ...{text[m.start():m.start() + 60]!r}")
            for ref in sorted(set(PUBLISHED_ID.findall(text))):
                if ref in ids:
                    continue
                why = ("is withdrawn and no longer appears in the report" if ref in withdrawn_ids
                       else "is not a finding in this report — a working id written into "
                            "published prose?")
                fails.append(f"{f['id']}: {field} cites {ref}, which {why}")
    return fails
