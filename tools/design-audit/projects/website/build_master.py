#!/usr/bin/env python3
"""Assemble audit-master.json for the dosje.gov.in website audit.

Reads the two measured sets — out/findings-auto.json (standards) and out/findings-design.json
(design vs build) — and writes the single source of truth the PDF, the markdown report and the
tracker all read. Nothing downstream is hand-written.

Structure:
  · Part A — one board per GLOBAL group (a breach measured on 3+ pages), shown on its worst page.
  · Part B — one board per page/state that still has findings of its own, capped so the report says
    each thing once.
Every finding carries a MARK: the element's real box plus a label with the measured value.

  python3 build_master.py
"""
import json, os, collections, datetime, re
from fixes import fix_for

BASE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(BASE, "out")
PREFIX = "WEB"
PER_PAGE_CAP = 6
RANK = {"Blocker": 0, "Major": 1, "Minor": 2, "Nit": 3}

STANDARD_REQUIREMENT = {
    "A-CONTRAST-NONTEXT": "WCAG 2.2 AA (1.4.11): the visible part of a control — its icon, its "
                          "outline, its indicator — needs 3:1 against what is behind it.",
    "J-COPY": "GIGW 3.0: page content is accurate, specific to the page, and in the Department's "
              "own register.",
    "J-LINK": "GIGW 3.0: every published link resolves; a document a page offers is downloadable.",
    "J-IA": "GIGW 3.0: published content is reachable by navigating the site, not only by search.",
    "A-CONTRAST": "WCAG 2.2 AA (1.4.3), carried into GIGW 3.0: text needs 4.5:1 against its "
                  "background, or 3:1 at 24px+ / 18.66px+ bold.",
    "A-ALT": "WCAG 2.2 A (1.1.1): every image carries an alt attribute — descriptive where it "
             "conveys meaning, empty where it is decorative.",
    "A-FOCUS": "WCAG 2.2 AA (2.4.7): every keyboard-focusable control shows a visible focus "
               "indicator. DBIM and UX4G both draw a 4px ring.",
    "A-TARGET": "UX4G 3.0 §6: interactive targets are at least 44×44px with 8px between them. "
                "WCAG 2.5.8 AA sets an absolute floor of 24×24.",
    "A-H1": "WCAG 2.2 A (1.3.1) and GIGW 3.0: one <h1> per page, naming the page.",
    "A-HEADING-ORDER": "WCAG 2.2 A (1.3.1): heading levels descend without skipping, so the "
                       "outline can be navigated.",
    "A-LANG": "GIGW 3.0 and WCAG 3.1.1: the page declares its language; en-IN on a Government of "
              "India property.",
    "A-AXE": "GIGW 3.0 mandates WCAG 2.2 AA conformance; axe-core tests a subset of it "
             "programmatically.",
    "U-TYPE-SCALE": "UX4G 3.0 §2.3: font sizes come from the published type scale "
                    "(12/14/16/18/20/24/28/32/36/40/52/60), and Body/XS 12px is the minimum.",
    "U-FONT": "UX4G 3.0 §2.2 and the Government standard: Noto Sans across the estate.",
    "D-ICON-SIZE": "DBIM 3.0 §3.7: icons are drawn at 24, 32, 48 or 64px, in proportion.",
    "D-UX4G-VIOLET": "DBIM 3.0 §2.1: one colour group from the primary palette. UX4G's violet is "
                     "its own brand layer, not the Department's.",
    "D-FOOTER-SECTIONS": "DBIM 3.0 §5.6: the footer carries Archives, Website Policy, Related "
                         "Links and Feedback.",
    "D-HEADER": "DBIM 3.0 §5.1: the masthead carries the National Emblem, the ministry lockup, "
                "the language toggle, search and the accessibility controls.",
    "R-OVERFLOW": "WCAG 2.2 AA (1.4.10): content reflows to 320 CSS px with no horizontal "
                  "scrolling.",
    "C-TITLE": "GIGW 3.0: every page publishes a descriptive title and meta description.",
    "C-CONSOLE": "GIGW 3.0 quality: a page loads without scripting errors.",
    "DVB-SPEC": "The approved Figma handoff frame for this screen.",
    "DVB-MISSING": "The approved Figma handoff frame for this screen.",
}

FIX = {
    "A-CONTRAST-NONTEXT": "Darken the icon or its ground until the pair reaches 3:1. The control's "
                          "accessible name is already correct; only what is drawn needs changing.",
    "J-COPY": "", "J-LINK": "", "J-IA": "",   # authored per finding
    "A-CONTRAST": "Darken the text or lighten its ground until the pair measures at least the "
                  "required ratio, then re-check every place the pair is used.",
    "A-ALT": "Add an alt attribute: a description where the image carries meaning, alt=\"\" where "
             "it is decorative.",
    "A-FOCUS": "Give the control a visible focus style — the estate's 4px ring — and make sure it "
               "is not removed by an `outline: none` elsewhere in the stylesheet.",
    "A-TARGET": "Grow the control, or add transparent padding around it, until it measures 44×44px "
                "with 8px clear of its neighbours.",
    "A-H1": "Render exactly one <h1> carrying the page's own title, above the content.",
    "A-HEADING-ORDER": "Re-tag the heading so levels descend in order, or promote the heading "
                       "above it. Where the markup is only for size, use CSS instead.",
    "A-LANG": "Set lang=\"en-IN\" on <html>, and lang on any block in another language.",
    "A-AXE": "Correct the markup the rule names; the rule's help page states the accepted fixes.",
    "U-TYPE-SCALE": "Move the size to the nearest step on the UX4G scale, and never below 12px.",
    "U-FONT": "Set the element to Noto Sans.",
    "D-ICON-SIZE": "Redraw or re-export the icon at 24, 32, 48 or 64px, keeping its proportion.",
    "D-UX4G-VIOLET": "Override the inherited UX4G variables so the Department's key colour applies "
                     "everywhere, including the skip link and the accessibility widget.",
    "D-FOOTER-SECTIONS": "Add the missing sections to the footer. Archives and Website Policy need "
                         "a page each; Related Links and Feedback can carry the existing ones.",
    "D-HEADER": "Add the missing element to the masthead on every template.",
    "R-OVERFLOW": "Find the element wider than the viewport and let it wrap or scroll inside "
                  "itself; the page itself must not scroll sideways.",
    "C-TITLE": "Publish a page-specific title and meta description.",
    "C-CONSOLE": "Fix the scripting errors, starting with the first — later ones are often "
                 "consequences.",
    "DVB-SPEC": "Set the built value to the design's.",
    "DVB-MISSING": "Add the content the design carries, or confirm with the design team that it "
                   "was dropped deliberately.",
}


def resolve_anchor(f):
    """A hand-authored finding names its element by text or link target, not by coordinates, so it
    survives a re-capture whose layout moved: the box is read from the current capture's DOM."""
    if f.get("box") or not (f.get("anchorText") or f.get("anchorHref")):
        return f
    cap = os.path.join(BASE, "captures", "live", f"{f['slug']}.{f['viewport']}.json")
    if not os.path.exists(cap):
        return f
    d = json.load(open(cap))
    boxes = []
    if f.get("anchorText"):
        # `anchorTag` narrows the match when the same text sits on more than one element. On a Who's
        # Who card the officer's name is both the photo's alt text and the name link, and a finding
        # about the NAME must not outline the photo — for the NCBC Member that is the part that is
        # correct. Findings without it match the first element carrying the text, as before.
        # A LIST of anchors outlines everything they span — the capture records a card's photo and
        # contact lines but not the card, so "photo … last contact line" is how a card is marked.
        anchors = f["anchorText"] if isinstance(f["anchorText"], list) else [f["anchorText"]]
        boxes += _span(d, anchors, f.get("anchorTag"), f.get("anchorClass"))
    for needle in f.get("anchorHref") or []:
        for l in d.get("links", []):
            if needle in (l.get("href") or "") and l.get("bbox", {}).get("w") and l.get("visible", True):
                boxes.append(l["bbox"])
                if needle == "cloudfront.net":
                    break
    if boxes:
        x1 = min(b["x"] for b in boxes); y1 = min(b["y"] for b in boxes)
        x2 = max(b["x"] + b["w"] for b in boxes); y2 = max(b["y"] + b["h"] for b in boxes)
        f["box"] = [round(x1), round(y1), round(x2), round(y2)]
    # A finding about several cards outlines each one ("alsoMark"), each with its own label, so the
    # board's crop takes them all in and no card the finding names is cut in half.
    extra = []
    for a in f.get("alsoMark") or []:
        bs = _span(d, a.get("anchors") or [a], None, a.get("cls"))
        if bs:
            x1 = min(b["x"] for b in bs); y1 = min(b["y"] for b in bs)
            x2 = max(b["x"] + b["w"] for b in bs); y2 = max(b["y"] + b["h"] for b in bs)
            extra.append({"box": [round(x1), round(y1), round(x2), round(y2)], "label": a.get("label", "")})
    if extra:
        f["extraMarks"] = extra
    return f


def _span(d, anchors, default_tag=None, cls=None):
    """Boxes of every anchor in the list. An anchor is a text, or {text, tag, nth}: `nth` picks the
    Nth element carrying the text, for text repeated verbatim — three NCSC cards share one address."""
    out = []
    for a in anchors:
        a = a if isinstance(a, dict) else {"text": a}
        e = _find_element(d, a["text"], a.get("tag", default_tag), cls, a.get("nth", 1))
        if e:
            out.append(e["bbox"])
    return out


def _find_element(d, text, tag=None, cls=None, nth=1):
    """The first element carrying `text`, optionally narrowed by tag and by a class it must carry.

    `tag` exists because an officer's name is both a photo's alt text and a link: a finding about the
    NAME must not outline the photo. `cls` exists for marking a whole card — without it, the first
    div holding the text is the page section that contains every card."""
    tag = (tag or "").lower()
    for e in d.get("elements", []):
        if tag and (e.get("tag") or "").lower() != tag:
            continue
        if cls and cls not in (e.get("cls") or "").split():
            continue
        if text.lower() in (e.get("text") or "").lower() and e.get("bbox", {}).get("w"):
            nth -= 1
            if nth == 0:
                return e
    return None


def withdrawn_rows(screens_now, merged_into=None):
    """Findings published in v1 (2026-09-18 morning) that the corrected run no longer carries.

    They stay in the tracker marked Withdrawn with the reason — a developer may already have written
    a status against the id, and a row that silently vanishes is a dangling reference."""
    # Every edition a stakeholder has seen: the first (v1) and the corrected one committed before this
    # run (v2). An id published in either that this run no longer carries stays on the tracker, marked.
    eds = [json.load(open(p)) for p in (os.path.join(BASE, "out", "audit-master.v1.json"),
                                         os.path.join(BASE, "out", "audit-master.v2.json")) if os.path.exists(p)]
    if not eds:
        return []
    v1 = {"screens": [s for e in eds for s in e["screens"]]}
    merged_into = merged_into or {}
    now = {f["id"] for s in screens_now for f in s["findings"]}
    out, seen_ids = [], set()
    for s in v1["screens"]:
        for f in s["findings"]:
            if f["id"] in now or f["id"] in seen_ids:
                continue
            seen_ids.add(f["id"])
            fig = f.get("figma", "")
            if "2.4.7" in fig:
                why = ("Re-measured on pixels: the control is invisible until focused and then shows a "
                       "visible ring. The first version compared styles, not what a keyboard user sees.")
            elif f["id"] in merged_into:
                why = (f"Merged into {merged_into[f['id']]}, which now carries this defect together with "
                       f"the others of the same kind — one fix, one row.")
            elif "1.4.3" in fig or "1.4.11" in fig:
                why = ("Re-measured on pixels with the element's own CSS colour: the pair passes on screen. "
                       "The first version read an anti-aliased edge pixel as the text colour.")
            elif "Nothing with that text renders" in (f.get("live") or ""):
                why = ("Withdrawn: the design text is sample content in a repeated list or data field — "
                       "names, e-mail addresses, dates, figures, event or album titles — which the live page "
                       "fills with real entries. It is different data, not missing interface copy.")
            elif "The approved Figma handoff frame" in fig:
                why = ("Withdrawn: on the re-capture the design and build values could not both be proven on "
                       "screen (the element was covered by the sticky header or not painted where the page "
                       "says it is), so the comparison is not published.")
            else:
                why = "Not reproduced on the re-capture of 18 September 2026."
            out.append({"id": f["id"], "title": f"{s['name']} — {f.get('element', '')}", "reason": why})
    return out


def merged_map(screens_now):
    """Where a first-edition finding went, when it is no longer carried under its own id.

    Matched on the finding's OWN evidence, never on the standard's sentence — every design finding
    shares "The approved Figma handoff frame…", and matching on it once attributed 113 unrelated
    findings to one Global (18 Sep). Rules, in order:
      · its element text appears in a current finding's element, missing-copy list or evidence;
      · the same colour pair (contrast);
      · a touch-target finding → the touch-target Globals, which are now grouped by page area."""
    eds = [json.load(open(p)) for p in (os.path.join(BASE, "out", "audit-master.v1.json"),
                                         os.path.join(BASE, "out", "audit-master.v2.json")) if os.path.exists(p)]
    if not eds:
        return {}
    v1 = {"screens": [s for e in eds for s in e["screens"]]}
    now = [f for s in screens_now for f in s["findings"]]
    ids_now = {f["id"] for f in now}
    pair_rx = re.compile(r"#[0-9A-F]{6} on #[0-9A-F]{6}")
    targets = [f["id"] for f in now if "UX4G 3.0 §6" in f.get("figma", "")]
    out = {}
    for s in v1["screens"]:
        for f in s["findings"]:
            if f["id"] in ids_now:
                continue
            el = (f.get("element") or "").strip().lower()
            hit = None
            if len(el) > 3:
                for g in now:
                    hay = " ".join([g.get("element") or "", g.get("live") or "", g.get("fix") or ""]).lower()
                    if el in hay and g.get("figma", "")[:12] == f.get("figma", "")[:12]:
                        hit = g["id"]
                        break
            if not hit:
                m = pair_rx.search(f.get("live") or "")
                if m:
                    hit = next((g["id"] for g in now if m.group(0) in (g.get("live") or "")), None)
            if not hit and "UX4G 3.0 §6" in f.get("figma", "") and targets:
                hit = " / ".join(targets)
            if hit:
                out[f["id"]] = hit
    return out


def consolidate_missing(findings):
    """All the design copy missing from ONE page is one finding: one card listing every piece, and
    one board with each piece outlined on the design. Six cards and six stacked callouts for one
    page read as six defects; the reviewer found them unreadable (18 Sep)."""
    keep, groups = [], collections.defaultdict(list)
    for f in findings:
        if f["code"] == "DVB-MISSING" and f.get("scope") != "Global":
            groups[(f["slug"], f["viewport"])].append(f)
        else:
            keep.append(f)
    for (slug, vp), allg in groups.items():
      allg = sorted(allg, key=lambda f: (f.get("figmaBoxRaw") or [0, 0])[1])
      # Split by AREA of the design frame, so a board never spans a whole long frame as a sliver.
      areas, cur, start = [], [], None
      for f in allg:
          y = (f.get("figmaBoxRaw") or [0, 0])[1]
          if cur and y - start > 800:
              areas.append(cur)
              cur, start = [], None
          if start is None:
              start = y
          cur.append(f)
      if cur:
          areas.append(cur)
      for ai, g in enumerate(areas, 1):
        texts = [re.search(r"“(.+?)”", f["label"]).group(1) if "“" in f["label"] else f["element"] for f in g]
        base = dict(g[0])
        area_note = f" (area {ai} of {len(areas)})" if len(areas) > 1 else ""
        base.update(
            element=(f"{len(g)} pieces of design copy missing" if len(g) > 1 else g[0]["element"]) + area_note,
            key=f"missing-page|{slug}|{ai}",
            label=f"Design copy absent from the build",
            detail=("The design frame carries this copy and nothing with the same text renders on the live "
                    "page: " + "; ".join(f"“{t}”" for t in texts) + "."),
            figmaMarks=[{"box": f["figmaBoxRaw"], "label": f"Missing: “{t[:38]}”"}
                        for f, t in zip(g, texts) if f.get("figmaBoxRaw")],
            figmaBoxRaw=None, missingTexts=texts)
        keep.append(base)
    return keep


def load(name):
    p = os.path.join(OUT, name)
    return json.load(open(p)) if os.path.exists(p) else []


def title_of(f):
    el = (f.get("element") or "").strip()
    base = f.get("title") or f.get("code")
    return f"{base} — {el}" if el and len(el) < 52 else base


def frozen_ids(findings):
    """Stable IDs: an ID a developer has written a status against must never move to another
    finding. Assigned from the committed map where one exists, else appended in sorted order."""
    path = os.path.join(BASE, "frozen_ids.json")
    known = json.load(open(path)) if os.path.exists(path) else {}
    used = set(known.values())

    def nxt(kind):
        n = 1
        while f"{PREFIX}-{kind}-{n:03d}" in used:
            n += 1
        return f"{PREFIX}-{kind}-{n:03d}"

    for f in sorted(findings, key=lambda f: (RANK[f["severity"]], f["code"], f.get("slug") or "",
                                             str(f.get("key")))):
        kind = "GLOBAL" if f.get("scope") == "Global" else "SCREEN"
        ident = f"{f['code']}|{f.get('key')}|{'' if kind == 'GLOBAL' else f.get('slug')}"
        if ident not in known:
            known[ident] = nxt(kind)
            used.add(known[ident])
        f["id"] = known[ident]
    json.dump(known, open(path, "w"), indent=1, sort_keys=True)
    return findings


def card_text(f):
    """DESIGN column = what the standard or the design requires; BUILD = what was measured."""
    req = STANDARD_REQUIREMENT.get(f["code"], f.get("standard", ""))
    if f["code"].startswith("DVB"):
        req = f"{req} {f.get('figmaLabel') or ''}".strip()
    live = f.get("detail") or f.get("label")
    if f.get("pageCount", 1) > 1:
        live += f" Measured on {f['pageCount']} pages."
    return req, live


def main():
    auto, design = load("findings-auto.json"), load("findings-design.json")
    judged = [resolve_anchor(f) for f in
              json.load(open(os.path.join(BASE, "inputs", "findings-judgement.json")))]  # hand-authored, verified
    findings = auto + design + judged
    # Exemptions verified on the live page, each with its reason (inputs/exemptions.json). They are
    # published in the Deferred section, not dropped silently.
    exempt = json.load(open(os.path.join(BASE, "inputs", "exemptions.json")))
    exempted = []
    def _exempt(f):
        for e in exempt:
            if f["code"] == e["code"] and e["slug"] in ("*", f.get("slug")) and \
                    e["elementContains"].lower() in (f.get("element") or "").lower():
                exempted.append({"id": None, "title": f"{f['title']} — {f.get('element')}", "reason": e["reason"]})
                return True
        return False
    findings = [f for f in findings if not _exempt(f)]
    findings = consolidate_missing(findings)
    # A design-vs-build SPEC finding is only shown on a board when BOTH sides were proven: a design
    # outline beside an unmarked build crop points the developer at nothing.
    for f in findings:
        if f["code"] == "DVB-SPEC" and not (f.get("box") and f.get("figmaBoxRaw")):
            f["box"] = None
            f["figmaBoxRaw"] = None
    # Violet declared in CSS but painted nowhere on the page is not a defect a citizen meets: keep only
    # the pages where check_marks proved #613AF5 on screen (5 of 266 captures, 18 Sep).
    findings = [f for f in findings if not (f["code"] == "D-UX4G-VIOLET" and not f.get("box"))]
    # Scope and page counts are recomputed on what survived verification and consolidation, so a
    # card never claims more pages than the evidence supports.
    groups = collections.defaultdict(set)
    for f in findings:
        groups[(f["code"], f.get("key"))].add(f["slug"])
    for f in findings:
        n = len(groups[(f["code"], f.get("key"))])
        f["pageCount"] = n
        f["scope"] = "Global" if n >= 3 else "Screen"
    for f in findings:
        f.setdefault("scope", "Screen")
    findings = frozen_ids(findings)

    # ---------- Part A: one board per global group, drawn on the page where it is worst
    by_group = collections.defaultdict(list)
    for f in findings:
        if f.get("scope") == "Global":
            by_group[(f["code"], f.get("key"))].append(f)

    screens, num = [], 0
    globals_sorted = sorted(by_group.items(),
                            key=lambda kv: (RANK[kv[1][0]["severity"]], -len(kv[1])))
    for (code, key), group in globals_sorted:
        rep = sorted(group, key=lambda f: (not (f.get("box") or f.get("figmaBoxRaw")),
                                           f.get("viewport") != "desktop", f.get("slug")))[0]
        num += 1
        pages = sorted({f["slug"] for f in group})
        # One page measured at two viewports is ONE page: the board heading and the card must not
        # quote different totals for the same finding.
        rep["pageCount"] = len(pages)
        req, live = card_text(rep)
        finding = dict(
            num=1, id=rep["id"], element=rep.get("element") or rep["title"], section="global",
            scope="Global", axis=rep.get("axis", "Accessibility"), severity=rep["severity"],
            figma=req, live=live, fix=rep.get("fix") or fix_for(rep) or FIX.get(code, ""),
            liveMark={"box": rep["box"], "label": rep["label"]} if rep.get("box") else None,
            liveBasis=rep.get("liveBasis") or (1440 if rep.get("viewport") == "desktop" else 375),
            subO=f"Scope: Global — measured on {len(pages)} pages/states; shown on {rep['slug']}",
        )
        if rep.get("figmaBoxRaw"):
            finding["figmaMark"] = {"box": rep["figmaBoxRaw"],
                                    "label": rep.get("figmaLabel") or rep["label"]}
            finding["figmaBasis"] = rep.get("figmaBasis") or 1440
        if rep.get("figmaMarks"):
            finding["figmaMarks"] = rep["figmaMarks"]
            finding["figmaBasis"] = rep.get("figmaBasis") or 1440
        finding = {k: v for k, v in finding.items() if v is not None}
        screens.append(dict(
            slug=rep["id"], name=f"Global · {title_of(rep)}", env="live",
            liveImg=rep.get("livePng") or f"captures/live/{rep['slug']}.{rep['viewport']}.png",
            figmaImg=rep.get("figmaPng"),
            liveUrl=rep.get("url"), figmaUrl=(
                f"https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id="
                f"{(rep.get('figmaNode') or '').replace(':', '-')}" if rep.get("figmaNode") else None),
            _basisLive=finding.get("liveBasis"), _basisFigma=finding.get("figmaBasis"),
            note=f"Applies to {len(pages)} pages. Fix once, it lands everywhere.",
            findings=[finding], _pages=pages))

    # ---------- Part B: what remains on each page/state
    per_page = collections.defaultdict(list)
    for f in findings:
        if f.get("scope") != "Global":
            per_page[(f["slug"], f["viewport"])].append(f)

    # The same defect on a page's desktop AND mobile capture is ONE defect. Publish it on the
    # desktop board, note the phone, and give mobile a board only for what is mobile-only.
    desktop_ids = collections.defaultdict(set)
    for (slug, viewport), group in per_page.items():
        if viewport == "desktop":
            desktop_ids[slug] = {f["id"] for f in group}
    also_mobile = set()
    for (slug, viewport), group in list(per_page.items()):
        if viewport == "desktop":
            continue
        mobile_only = [f for f in group if f["id"] not in desktop_ids.get(slug, set())]
        also_mobile |= {f["id"] for f in group if f["id"] in desktop_ids.get(slug, set())}
        if mobile_only:
            per_page[(slug, viewport)] = mobile_only
        else:
            del per_page[(slug, viewport)]

    for (slug, viewport), group in sorted(per_page.items()):
        group = sorted(group, key=lambda f: (RANK[f["severity"]], f["code"]))[:PER_PAGE_CAP]
        fs = []
        for i, f in enumerate(group, 1):
            req, live = card_text(f)
            if f["id"] in also_mobile:
                live += " Also measured on the 375px capture of the same page."
            item = dict(num=i, id=f["id"], element=f.get("element") or f["title"],
                        section=f.get("axis", "page"), axis=f.get("axis", "Accessibility"),
                        severity=f["severity"], figma=req, live=live,
                        fix=f.get("fix") or fix_for(f) or FIX.get(f["code"], ""),
                        liveBasis=f.get("liveBasis") or (1440 if viewport == "desktop" else 375))
            if f.get("box"):
                item["liveMark"] = {"box": f["box"], "label": f["label"]}
            if f.get("extraMarks"):
                item["liveMarks"] = f["extraMarks"]
            if f.get("figmaBoxRaw"):
                item["figmaMark"] = {"box": f["figmaBoxRaw"],
                                     "label": f.get("figmaLabel") or f["label"]}
                item["figmaBasis"] = f.get("figmaBasis") or 1440
            if f.get("figmaMarks"):
                item["figmaMarks"] = f["figmaMarks"]
                item["figmaBasis"] = f.get("figmaBasis") or 1440
            item["_y"] = (f.get("box") or f.get("figmaBoxRaw") or
                          ((f.get("figmaMarks") or [{}])[0].get("box")) or [0, -1])[1]
            item["_marked"] = bool(f.get("box") or f.get("figmaBoxRaw") or f.get("figmaMarks"))
            fs.append(item)
        # Findings whose marks sit far apart on a long page get their own board each, so no board is
        # a tall sliver with an outline at either end. Page-level findings share one card-only group.
        fs.sort(key=lambda x: (not x["_marked"], x["_y"]))
        cluster_start, n_cluster = None, 0
        for i, item in enumerate(fs, 1):
            item["num"] = i
            if not item["_marked"]:
                item["section"] = "Page-level — no single element to mark"
            else:
                if cluster_start is None or item["_y"] - cluster_start > 600:
                    cluster_start, n_cluster = item["_y"], n_cluster + 1
                item["section"] = f"Area {n_cluster} · about {int(cluster_start) // 100 * 100}px down the page"
            del item["_y"], item["_marked"]
        rep = group[0]
        # the page's design frame comes from whichever of its findings is a design comparison
        fig_rep = next((f for f in group if f.get("figmaPng")), {})
        name = slug.replace("state--", "State · ").replace("-", " ").title()
        screens.append(dict(
            slug=f"{slug}.{viewport}", name=f"{name} · {viewport}", env="live",
            liveImg=rep.get("livePng") or f"captures/live/{slug}.{viewport}.png",
            figmaImg=fig_rep.get("figmaPng"),
            liveUrl=rep.get("url"),
            figmaUrl=(f"https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?"
                      f"node-id={(fig_rep.get('figmaNode') or '').replace(':', '-')}"
                      if fig_rep.get("figmaNode") else None),
            _basisLive=fs[0].get("liveBasis"), _basisFigma=fs[0].get("figmaBasis"),
            findings=fs))

    for s in screens:
        for k in [k for k, v in list(s.items()) if v is None]:
            del s[k]

    rollup = json.load(open(os.path.join(OUT, "standards-rollup.json")))
    droll = json.load(open(os.path.join(OUT, "design-rollup.json")))
    captured = rollup["capturesAnalysed"]
    method = (
        "Every page in dosje.gov.in's sitemap (94 standalone pages), one sample of every record "
        "template (documents, events, gallery, officials, tenders, organisations, vacancies, "
        "schemes, scheme documents, suo-moto disclosures, CPIO, bookings, updates) and 25 global "
        f"states were captured at 1440×900 and 375×812 — {captured} captures in all — with the "
        "computed CSS, accessibility tree, axe-core results, focus behaviour, target sizes and "
        "DBIM element inventory of every element recorded. Findings are measured, never eyeballed: "
        "each carries the element's real box and its measured value. Captures the server refused "
        "(HTTP 429) were rejected and re-taken. The design side is the MoSJE [Handoff] Figma file: "
        f"{droll['pairsCompared']} design↔build pairs were compared by specification — type size, "
        "weight, family and colour on text matched between the two sides — never by pixel diff, and "
        "never on width, height or dynamic data. Where one design frame serves many pages (an "
        "organisation template against 172 organisation pages), only shared-template properties are "
        "compared, not its sample copy. A breach measured on three or more pages is published once, "
        "as a Global finding. Out of scope for this report: the screen-reader walkthrough, Hindi "
        "content quality, and the 34 live views for which no design frame exists — those are in the "
        "separate design report.")

    am = dict(
        portal="MoSJE Website — dosje.gov.in",
        idPrefix=PREFIX,
        generated=datetime.date.today().isoformat(),
        figmaUrl="https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-",
        method=method,
        coverageSummary={"screensCaptured": captured,
                         "pagesInSitemap": 8782,
                         "standalonePages": 94,
                         "states": 25,
                         "designPairsCompared": droll["pairsCompared"]},
        deferred=withdrawn_rows(screens, merged_map(screens)) + [
            {"id": "EXEMPT", "title": x["title"], "reason": x["reason"]}
            for x in {x["reason"]: x for x in exempted}.values()] + [
            # Points raised, checked against the body's own published source, and found CORRECT.
            # Published so nobody "fixes" them later; the tracker skips them (no finding id).
            {"id": "CHECKED", "title": x["title"], "reason": x["reason"]}
            for x in json.load(open(os.path.join(BASE, "inputs", "verified-correct.json")))],
        screens=screens,
    )
    json.dump(am, open(os.path.join(OUT, "audit-master.json"), "w"), indent=1)
    print(f"screens: {len(screens)} (global {len(by_group)}, page {len(per_page)})")
    print("findings:", sum(len(s["findings"]) for s in screens),
          collections.Counter(f["severity"] for s in screens for f in s["findings"]))


if __name__ == "__main__":
    main()
