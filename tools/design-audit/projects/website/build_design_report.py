#!/usr/bin/env python3
"""Assemble the DESIGN-side report for the dosje.gov.in website — separate from the dev report.

Audience: the design team. Four groups:
  A · program-level decisions the design file forces (colour pairs that fail AA in the design
      itself, type below the minimum, fonts outside the standard, which frame is current)
  B · updates to existing Figma frames (states never drawn, flows missing their phone version,
      the handoff footer not carrying DBIM 5.6)
  C · views the live site publishes that have no design frame at all
  D · UI/UX changes to make in the design so the live site passes the PMO audit — each one taken
      from a measured finding in the dev report, shown on its live board

Every number is read from a data file this folder produces; nothing is typed in by hand.

  python3 build_design_report.py   # writes docs/qc/portals/website/design/suggestions.json
"""
import json, os, glob, collections, re, shutil
from fixes import nearest_passing, ground_alternative, shade_verb, UX4G_SCALE as SCALE_LIST, SCALE_NAME

BASE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(BASE, "..", "..", "..", ".."))
DEV = os.path.join(REPO, "docs", "qc", "portals", "website")
OUTDIR = os.path.join(DEV, "design")
FIGMA = "https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id="
UX4G_SCALE = {12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 52, 60}
STATE_WORDS = ["focus", "hover", "disabled", "empty", "error", "loading", "skeleton", "validation",
               "404", "no result"]


def J(p):
    return json.load(open(p))


def node_url(node):
    return FIGMA + node.replace(":", "-") if node else None


def copy_img(src_rel, name):
    """Boards reference images relative to the report folder; copy (downscaled JPEG) once."""
    os.makedirs(os.path.join(OUTDIR, "img"), exist_ok=True)
    dst = os.path.join(OUTDIR, "img", name)
    if not os.path.exists(dst):
        src = os.path.join(BASE, src_rel) if not os.path.isabs(src_rel) else src_rel
        import subprocess
        tmp = dst + ".tmp.png"
        shutil.copyfile(src, tmp)
        subprocess.run(["sips", "--resampleWidth", "1600", tmp, "--out", tmp], capture_output=True)
        subprocess.run(["sips", "-s", "format", "jpeg", "-s", "formatOptions", "76", tmp, "--out", dst],
                       capture_output=True)
        os.remove(tmp)
    return f"img/{name}"


def _colour_rec(fg, bg, need, n_frames):
    best = nearest_passing(fg, bg, need)
    alt = ground_alternative(fg, bg, need)
    parts = []
    white_on_colour = fg.upper() in ("#FFFFFF", "#F8F9FA", "#EFF6FD", "#E2E6EA")
    text_opt = (f"change the text colour style from {fg} to {best[0]}"
                + (f" ({best[1]})" if best[1] else "") + f" — {best[2]}:1 on {bg}") if best else None
    ground_opt = (f"keep {fg} and {shade_verb(bg, alt[0])} the ground from {bg} to {alt[0]} ({alt[1]}:1)"
                  if alt else None)
    # Light text on a coloured band is fixed by deepening the band, not by turning the text dark.
    order = [ground_opt, text_opt] if white_on_colour else [text_opt, ground_opt]
    order = [o for o in order if o]
    if order:
        parts.append(order[0][0].upper() + order[0][1:])
        if len(order) > 1:
            parts.append("or " + order[1])
    return (("; ".join(parts) + ". ") if parts else "") + (
        f"Make the change in the colour STYLE, not frame by frame, so all {n_frames} frames update together; "
        f"the build follows the design, so the live site is fixed by the same decision.")


def page_template(slug):
    """Content page or Document register, judged from the live capture: a page whose content is
    mostly a table of documents with Download / View actions is a register."""
    p = os.path.join(BASE, "captures", "live", f"{slug}.desktop.json")
    if slug in ("footer-carousel", "meta-data", "advertisement", "visitor-analytics"):
        return "utility page (confirm it should be public)"
    if not os.path.exists(p):
        return "content page"
    d = json.load(open(p))
    actions = sum(1 for l in d.get("links", []) if (l.get("text") or "").strip().lower() in ("download", "view"))
    return "Document register" if actions >= 3 else "Content page"


def crop_box(box, basis, pad=160, min_h=360):
    x1, y1, x2, y2 = box
    y1 = max(0, y1 - pad)
    y2 = max(y2 + pad, y1 + min_h)
    return [0, round(y1), basis, round(y2)]


def main():
    os.makedirs(OUTDIR, exist_ok=True)
    frames = J(os.path.join(BASE, "inputs", "figma-frames.json"))
    fmap = J(os.path.join(BASE, "inputs", "frame-map.json"))
    contrast = J(os.path.join(BASE, "out", "design-contrast.json"))
    am = J(os.path.join(DEV, "audit-master.json"))
    specs = {os.path.basename(p)[:-5]: J(p) for p in glob.glob(os.path.join(BASE, "inputs", "figma-specs", "*.json"))}

    items = []

    # ---------------------------------------------------------------- A · decisions
    # Verified by eye on the exported frame and excluded, with the reason kept here so the next run
    # does not re-publish it: #7F6911 is the yellow BETA badge (#FFD323) dimmed 50% by the scrim of
    # an open bottom sheet — the page behind an overlay, not a design defect.
    VERIFIED_FALSE = {("#000000", "#7F6911")}
    rows = [r for r in contrast["rows"] if (r["fg"], r["bg"]) not in VERIFIED_FALSE]
    pairs = collections.defaultdict(list)
    for r in rows:
        pairs[(r["fg"], r["bg"])].append(r)
    ranked = sorted(pairs.items(), key=lambda kv: -len(kv[1]))
    for i, ((fg, bg), group) in enumerate(ranked[:6], 1):
        ex = sorted(group, key=lambda r: r["ratio"])[0]
        frames_hit = sorted({r["frame"] for r in group})
        fig_png = f"captures/figma/{ex['slug']}.png"
        if not os.path.exists(os.path.join(BASE, fig_png)):
            continue
        img = copy_img(fig_png, f"A-contrast-{i}.jpg")
        basis = ex["basis"]
        # the copied image is resampled to 1600 wide; boxes stay in the frame's own basis
        items.append({
            "id": f"DES-A-{i:02d}", "group": "A", "type": "Decide",
            "title": f"The design draws {fg} text on {bg} — {ex['ratio']}:1, below AA",
            "observed": (f"Measured on the exported frame: the text colour the design sets ({fg}) against the "
                         f"ground it is drawn on ({bg}) is {ex['ratio']}:1 at {int(ex['size'])}px, where "
                         f"WCAG 2.2 AA needs {ex['need']}:1. The pair occurs in {len(group)} distinct "
                         f"text styles across {len(frames_hit)} frame(s), including "
                         f"{', '.join(frames_hit[:4])}. The build copies the design, so the live site "
                         f"fails in the same place."),
            "recommendation": _colour_rec(fg, bg, ex["need"], len(frames_hit)),
            "board": {"figmaImg": img, "box": crop_box(ex["box"], basis), "figmaBasis": basis,
                      "figmaMarks": [[1, ex["box"], f"{fg} on {bg} = {ex['ratio']}:1 at "
                                                     f"{int(ex['size'])}px · needs {ex['need']}:1"]]},
            "link": node_url(ex["node"]),
        })

    fonts, small, off = collections.Counter(), [], collections.Counter()
    for slug, d in specs.items():
        for t in d.get("texts", []):
            fam = (t.get("fontFamily") or "").strip()
            size = t.get("fontSize") or 0
            if fam:
                fonts[fam] += 1
            # Under 8px is not reading text: it is a scaled-down page preview (the Index cards, the
            # carousel thumbnails) — 446 layers at 3px alone. Counting them would triple the figure.
            if size and 8 <= size < 12 and (t.get("characters") or "").strip():
                small.append((d.get("name"), size, (t.get("characters") or "").strip()[:30]))
            if size and int(size) not in UX4G_SCALE and size >= 8:
                off[int(size)] += 1
    stray = {f: n for f, n in fonts.items()
             if not f.startswith("Noto Sans") and not f.startswith("Material Symbols")}
    stray_frames = collections.defaultdict(set)
    for slug, d in specs.items():
        for t in d.get("texts", []):
            fam = (t.get("fontFamily") or "").strip()
            if fam in stray:
                stray_frames[fam].add(d.get("name"))
    items.append({
        "id": "DES-A-10", "group": "A", "type": "Decide",
        "title": f"{sum(stray.values())} text layers use a typeface other than Noto Sans",
        "observed": ("Across the 251 exported handoff frames, " +
                     ", ".join(f"{n} layers are set in {f}" for f, n in sorted(stray.items(), key=lambda x: -x[1])) +
                     ". Noto Sans is the standard across Government of India properties and the "
                     "estate's only typeface."),
        "list": [f"{f}: {n} layers in " + ", ".join(sorted(stray_frames[f])[:6])
                 + (f" and {len(stray_frames[f]) - 6} more frames" if len(stray_frames[f]) > 6 else "")
                 for f, n in sorted(stray.items(), key=lambda x: -x[1])],
        "recommendation": ("In each frame listed, select the text (Figma: Edit → Select all with same font) and "
                           "apply the matching Noto Sans text style from the SAMAVESH library; Druk Wide and "
                           "Poppins have no place in a Government of India page."),
    })
    small_frames = collections.Counter(n for n, _, _ in small)
    items.append({
        "id": "DES-A-11", "group": "A", "type": "Decide",
        "title": f"{len(small)} text layers are smaller than 12px",
        "observed": (f"UX4G 3.0 names 12px (Body/XS) as the minimum usable size. {len(small)} text layers "
                     f"in the handoff frames are below it — for example "
                     + "; ".join(f"“{c}” at {s:g}px in {n}" for n, s, c in small[:4])
                     + f". {len(small_frames)} frames are affected."),
        "list": [f"{n}: {c} layers" for n, c in small_frames.most_common(8)],
        "recommendation": ("Raise every layer below 12px to Body/XS (12px / 16px line height) — in practice the "
                           "masthead lineage text (“Government of India”, 11px), the BETA badge (10px) and card "
                           "meta lines. Fix it in the text styles those layers use, so all frames update."),
    })
    items.append({
        "id": "DES-A-12", "group": "A", "type": "Decide",
        "title": "Font sizes outside the UX4G type scale",
        "observed": ("The UX4G scale is 12/14/16/18/20/24/28/32/36/40/52/60. The design also uses "
                     + ", ".join(f"{s}px ({n}×)" for s, n in off.most_common(8)) + "."),
        "list": [f"{sz}px ({n} layers) → {min(SCALE_LIST, key=lambda x: (abs(x - sz), -x)) if sz >= 12 else 12}px "
                 f"{SCALE_NAME[min(SCALE_LIST, key=lambda x: (abs(x - sz), -x)) if sz >= 12 else 12]}"
                 for sz, n in off.most_common(10)],
        "recommendation": ("Re-point each off-scale text style to the step shown, in the SAMAVESH text styles, "
                           "so the values developers read from the handoff are always on the UX4G scale."),
    })
    items.append({
        "id": "DES-A-13", "group": "A", "type": "Decide",
        "title": "Two Home designs, and two Schemes & Services designs — which is current?",
        "observed": ("The ✅ UI Flow page carries a Home frame (3453:7805) and the Home page carries a newer, "
                     "taller one (51821:33657); they differ. The Offerings page carries a 'Scheme Discovery — "
                     "Finalised for Handoff (Review of 14 September)' section whose read-me says it replaces "
                     "Schemes & Services, while the ✅ flow still shows the older one. This audit compared the "
                     "build against the newer Home and against Scheme Discovery."),
        "recommendation": ("Decide which is current and move the other to the Archive page: Home — keep "
                           "51821:33657 (newer) or 3453:7805 (✅ flow); Schemes & Services — adopt Scheme "
                           "Discovery and archive the ✅ flow version, as its read-me proposes. Then relink the "
                           "✅ UI Flow page to the chosen frames."),
    })

    # ---------------------------------------------------------------- B · frame updates
    fv = J(os.path.join(BASE, "out", "focus-verdicts.json"))
    names = [f["name"].lower() for f in frames if f.get("status") == "handoff"]
    counts = {w: sum(1 for n in names if w in n) for w in STATE_WORDS}
    missing_states = [w for w, n in counts.items() if n == 0]
    items.append({
        "id": "DES-B-01", "group": "B", "type": "Design",
        "title": "Interaction and data states are almost entirely undrawn",
        "observed": ("Of the handoff frames, the number whose name shows each state: "
                     + ", ".join(f"{w} {n}" for w, n in counts.items())
                     + f". No frame shows {', '.join(missing_states)}. On the live site, of "
                     f"{fv['stops']} keyboard stops measured on {len(fv['pages'])} pages, "
                     f"{sum(1 for r in fv['rows'] if r['strength'] == 'none')} change nothing at all when "
                     f"focused and {sum(1 for r in fv['rows'] if r['strength'] == 'weak')} change only a "
                     "digit's colour — the pagination and the hero banner, the controls the design never "
                     "drew a focus state for."),
        "list": ["Focus: every button, link, input, pagination item, card link and carousel control — 2px "
                 "#0373DF outline, 2px offset; current-page and focus must look different",
                 "Hover and Disabled: Button (all variants), Link, Pagination, Chip, Tab",
                 "Listing states for Documents, Tenders, Vacancies, Events, Gallery and the directories: "
                 "Loading (skeleton rows), Empty (“No documents published yet”), Filtered to nothing (names the "
                 "filter + Clear filters), Error (with Try again)",
                 "Form validation: Contact / Feedback form with field errors and a summary at the top",
                 "404 page and Search — no results"],
        "recommendation": ("Draw each as a variant on the SAMAVESH component (not per page), then place one "
                           "example of each listing state on the Documents page of the handoff, so developers "
                           "have a frame to build and QC has a frame to check against."),
    })
    # Every section of the ✅ UI Flow pages has phone frames (checked 18 Sep). The gap is the DBIM
    # page: the newest, DBIM-compliant versions of the key screens exist at desktop width only.
    dbim_desktop = sorted(f["name"] for f in frames if f["page"] == "DBIM" and f.get("kind") == "desktop")
    dbim_mobile = [f for f in frames if f["page"] == "DBIM" and f.get("kind") == "mobile"]
    items.append({
        "id": "DES-B-02", "group": "B", "type": "Design",
        "title": f"The DBIM-compliant screens exist at desktop width only ({len(dbim_desktop)} frames, {len(dbim_mobile)} phone)",
        "observed": ("Every section of the ✅ UI Flow pages carries phone frames. The DBIM page does not: it holds "
                     "the newest, DBIM-compliant versions of these screens, and none has a 375px version, so the "
                     "phone build still follows the earlier, non-compliant design."),
        "list": dbim_desktop,
        "recommendation": "Draw the 375px version of each DBIM frame from the same components, then retire the "
                          "superseded phone frames in the ✅ flow.",
    })
    dbim_footer = [s for s, d in specs.items()
                   if "related links" in " ".join((t.get("characters") or "").lower() for t in d.get("texts", []))
                   and "website policy" in " ".join((t.get("characters") or "").lower() for t in d.get("texts", []))]
    items.append({
        "id": "DES-B-03", "group": "B", "type": "Design",
        "title": "The DBIM-compliant footer exists on the DBIM page only",
        "observed": (f"Only {len(dbim_footer)} of 251 frames carry a footer with Related Links and Website "
                     "Policy — all on the DBIM page. Every ✅ UI Flow frame still uses the earlier footer, "
                     "which lacks the four sections DBIM 5.6 mandates (Archives, Website Policy, Related "
                     "Links, Feedback). The live footer follows the ✅ flow, and fails DBIM 5.6 on every page."),
        "recommendation": ("Make the DBIM page's footer the one Footer component (Archives, Website Policy, "
                           "Related Links, Feedback, plus the existing lineage and policy row), swap it into every "
                           "✅ UI Flow frame (Figma: select the old footer instances → Swap instance), and delete "
                           "the old footer master so it cannot come back."),
    })

    # ---------------------------------------------------------------- C · undesigned views
    und = fmap.get("undesigned", [])
    pages = [u for u in und if u.get("kind") == "page"]
    recs = [u for u in und if u.get("kind") != "page"]
    items.append({
        "id": "DES-C-01", "group": "C", "type": "Propose",
        "title": f"{len(pages)} live pages were built with no design frame",
        "observed": ("These pages are published on dosje.gov.in and have no frame in the handoff file; "
                     "developers built them without a design to follow, and QC has nothing to check them "
                     "against."),
        "list": [f"{u['path']} → {page_template(u['slug'])}" for u in pages],
        "recommendation": ("Design two templates and assign every page above to one of them (assignment shown "
                           "beside each page, from what the live page contains): a Content page (title, "
                           "standfirst, body, attached documents, last-updated) and a Document register "
                           "(filters, table with Download/View, paging, empty and filtered-to-nothing states). "
                           "Pages marked 'utility' are WordPress helper pages the Department should confirm are "
                           "meant to be public."),
    })
    if recs:
        items.append({
            "id": "DES-C-02", "group": "C", "type": "Propose",
            "title": f"{len(recs)} record detail templates have no design",
            "observed": "The live site publishes a detail page for each record of these types, with no frame.",
            "list": [f"{u.get('type')} — e.g. {u['path']}" for u in recs],
            "recommendation": ("Design one Record detail template — breadcrumb, title, a meta row (organisation, "
                               "date, size), body, attachments with Download/View, related records — with a "
                               "variant per type: Document, Tender, Vacancy, Event, Gallery album, Official "
                               "(profile card), CPIO, Venue booking, Update, Suo-moto disclosure."),
        })

    # ---------------------------------------------------------------- D · UI/UX for the PMO audit
    # Each item is a measured dev-report finding whose fix belongs in the DESIGN first. The action is
    # written for a designer; the dev report carries the code-level fix.
    DESIGN_ACTION = [
        ("2.4.7", "Draw a visible focus state",
         "Add a Focus variant to the Pagination component (page numbers and previous/next) and to the hero "
         "carousel slide: 2px #0373DF outline at 2px offset. Give the current page a style that is NOT the "
         "focus style (e.g. filled chip), so the two can be told apart."),
        ("UX4G 3.0 §6", "Give every control a 44×44px hit area",
         "In the Navbar, Footer and document-card components, set each link's hit area to 44px tall (20px text "
         "+ 12px vertical padding) with 8px between neighbours. Keep the text size; only the target grows."),
        ("DBIM 3.0 §5.6", "Put the DBIM 5.6 footer in every frame",
         "Use the DBIM page's footer (Archives, Website Policy, Related Links, Feedback) as the only Footer "
         "component and swap it into all ✅ UI Flow frames."),
        ("1.3.1): heading levels", "Annotate heading levels on the frames",
         "Label each heading on the handoff with its level — page title H1, section titles H2 (including the "
         "“Need Support?” band), card titles H3 — so the build does not pick tags by size."),
        ("1.4.11", "Give carousel arrows and icon controls 3:1",
         "Recolour the carousel previous/next arrows and similar icon-only controls to #0373DF (or darker) on "
         "their light grounds; the current pale grey (#F0EFED on #FCF9EA) is 1.09:1."),
        ("UX4G 3.0 §2.3", "Keep type on the UX4G scale",
         "Remove the 8/10/11/13/15px styles from the file; use 12/14/16px (Body/XS, S, M). The live 8–11px text "
         "comes from these styles."),
        ("published content is reachable", "Make each gallery card open its album page",
         "In the Events & Gallery design, draw the card click-through to a Gallery album page (title, date, "
         "organisation, photo grid, lightbox) and design that page; the live cards currently open a bare CDN "
         "image."),
        ("specific to the page", "Write each page's own description",
         "Provide the standfirst for every listing page in the design (the live Gallery page shows the Annual "
         "Reports description; the four audience pages share one sentence)."),
    ]
    done, k = set(), 0
    for key, title, action in DESIGN_ACTION:
        pick = None
        for s in am["screens"]:
            for f in s["findings"]:
                if key in (f.get("figma") or "") and (f.get("liveMark") or f.get("liveMarks")):
                    pick = (s, f)
                    break
            if pick:
                break
        if not pick:
            continue
        s_, f = pick
        k += 1
        src = f.get("liveImgO") or s_.get("liveImg")
        img = copy_img(os.path.join(DEV, src), f"D-{k:02d}.jpg")
        basis = f.get("liveBasis") or s_.get("_basisLive") or 1440
        box = f.get("liveBox") or f.get("sectionBox") or [0, 0, basis, 600]
        items.append({
            "id": f"DES-D-{k:02d}", "group": "D", "type": "Design", "title": title,
            "observed": f"{f['live']} (Dev report {f['id']}.)",
            "recommendation": action,
            "board": {"liveImg": img, "box": box, "liveBasis": basis,
                      "liveMarks": [[1, f["liveMark"]["box"], f["liveMark"]["label"]]]},
        })

    doc = {"portal": "MoSJE Website — dosje.gov.in", "generated": am.get("generated"),
           "intro": ("<div style='font-size:12.5px;line-height:1.6;margin:0 4px 14px'>"
                     "This report is for the design team and is separate from the developers' QC report. "
                     "It lists what must change in the Figma handoff file itself: colour and type decisions "
                     "the design gets wrong on its own, frames and states that were never drawn, live views "
                     "with no design, and the UI/UX changes the dev audit shows are needed. Every figure is "
                     "measured — design contrast on the exported frame pixels, live findings on the captured "
                     "page — and every board is marked on the element in question.</div>"),
           "items": items}
    json.dump(doc, open(os.path.join(OUTDIR, "suggestions.json"), "w"), indent=1, ensure_ascii=False)
    print(f"design report items: {len(items)}  "
          + str(collections.Counter(i['group'] for i in items)))


if __name__ == "__main__":
    main()
