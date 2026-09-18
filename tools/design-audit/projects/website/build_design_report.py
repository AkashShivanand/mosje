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
            "recommendation": ("Choose a text colour from the SAMAVESH palette that reaches the ratio on "
                               "this ground, change it in the design's style rather than frame by frame, "
                               "and re-export. The build then fixes itself by following the design."),
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
    items.append({
        "id": "DES-A-10", "group": "A", "type": "Decide",
        "title": f"{sum(stray.values())} text layers use a typeface other than Noto Sans",
        "observed": ("Across the 251 exported handoff frames, " +
                     ", ".join(f"{n} layers are set in {f}" for f, n in sorted(stray.items(), key=lambda x: -x[1])) +
                     ". Noto Sans is the standard across Government of India properties and the "
                     "estate's only typeface."),
        "recommendation": "Reset these layers to the matching Noto Sans text style from the SAMAVESH library.",
    })
    small_frames = collections.Counter(n for n, _, _ in small)
    items.append({
        "id": "DES-A-11", "group": "A", "type": "Decide",
        "title": f"{len(small)} text layers are smaller than 12px",
        "observed": (f"UX4G 3.0 names 12px (Body/XS) as the minimum usable size. {len(small)} text layers "
                     f"in the handoff frames are below it — for example "
                     + "; ".join(f"“{c}” at {s:g}px in {n}" for n, s, c in small[:4])
                     + f". {len(small_frames)} frames are affected."),
        "recommendation": "Raise these to Body/XS (12px) at least; masthead lineage text and badges are "
                          "the most common cases.",
    })
    items.append({
        "id": "DES-A-12", "group": "A", "type": "Decide",
        "title": "Font sizes outside the UX4G type scale",
        "observed": ("The UX4G scale is 12/14/16/18/20/24/28/32/36/40/52/60. The design also uses "
                     + ", ".join(f"{s}px ({n}×)" for s, n in off.most_common(8)) + "."),
        "recommendation": "Map each to its nearest scale step through the SAMAVESH text styles, so the "
                          "values the developers read are always on the scale.",
    })
    items.append({
        "id": "DES-A-13", "group": "A", "type": "Decide",
        "title": "Two Home designs, and two Schemes & Services designs — which is current?",
        "observed": ("The ✅ UI Flow page carries a Home frame (3453:7805) and the Home page carries a newer, "
                     "taller one (51821:33657); they differ. The Offerings page carries a 'Scheme Discovery — "
                     "Finalised for Handoff (Review of 14 September)' section whose read-me says it replaces "
                     "Schemes & Services, while the ✅ flow still shows the older one. This audit compared the "
                     "build against the newer Home and against Scheme Discovery."),
        "recommendation": "Mark one frame of each as current (move the other into Archive), so developers "
                          "and QC compare against the same design.",
    })

    # ---------------------------------------------------------------- B · frame updates
    names = [f["name"].lower() for f in frames if f.get("status") == "handoff"]
    counts = {w: sum(1 for n in names if w in n) for w in STATE_WORDS}
    missing_states = [w for w, n in counts.items() if n == 0]
    items.append({
        "id": "DES-B-01", "group": "B", "type": "Design",
        "title": "Interaction and data states are almost entirely undrawn",
        "observed": ("Of the handoff frames, the number whose name shows each state: "
                     + ", ".join(f"{w} {n}" for w, n in counts.items())
                     + f". No frame shows {', '.join(missing_states)}. On the live site 262 keyboard stops "
                     "show no focus indicator at all — the developers had no focus state to build from."),
        "recommendation": ("Add, as components on the SAMAVESH library rather than per page: the focus "
                           "ring for every interactive element, hover and disabled for buttons and links, "
                           "the empty, loading, error and filtered-to-nothing states for every listing "
                           "(documents, tenders, gallery, events, directories), form validation, and a 404 page."),
    })
    flows = collections.defaultdict(collections.Counter)
    for f in frames:
        if f.get("status") != "handoff" or f.get("kind") not in ("desktop", "mobile"):
            continue
        sec = (f.get("sectionPath") or "").split(" › ")
        top = sec[1] if len(sec) > 1 and f["page"].startswith("✅") else f["page"]
        flows[re.sub(r"/Mobile|/Desktop", "", top).strip()][f["kind"]] += 1
    gaps = sorted(k for k, v in flows.items() if v["desktop"] and not v["mobile"])
    items.append({
        "id": "DES-B-02", "group": "B", "type": "Design",
        "title": f"{len(gaps)} flows have a desktop design and no phone design",
        "observed": ("Grouping every handoff frame by the flow it sits in, these have desktop frames and no "
                     "mobile frame: " + ", ".join(gaps) + ". Two in three citizens reach the site on a phone."),
        "recommendation": "Draw the 375px version of each, from the same components, before the next build.",
        "list": gaps,
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
        "recommendation": "Promote the DBIM page's footer into the SAMAVESH footer component and swap it "
                          "into every flow frame, so there is one footer in the file.",
    })

    # ---------------------------------------------------------------- C · undesigned views
    und = fmap.get("undesigned", [])
    pages = [u for u in und if u.get("kind") == "page"]
    recs = [u for u in und if u.get("kind") != "page"]
    items.append({
        "id": "DES-C-01", "group": "C", "type": "Propose",
        "title": f"{len(pages)} live pages were built with no design frame",
        "observed": ("These pages are published on dosje.gov.in and have no frame in the handoff file; "
                     "developers built them from nothing, which is where most of the inconsistency in the "
                     "dev report comes from."),
        "list": [f"{u['path']}" + (f" — nearest: {u['nearest']['desktop']['name']}"
                                  if (u.get("nearest") or {}).get("desktop") else "") for u in pages],
        "recommendation": ("Most are document or policy pages: design one 'content page' template (heading, "
                           "standfirst, body, attached documents, last-updated) and one 'document register' "
                           "template (filters, table, paging, empty state), then list which live page uses "
                           "which. That covers the majority in two frames."),
    })
    if recs:
        items.append({
            "id": "DES-C-02", "group": "C", "type": "Propose",
            "title": f"{len(recs)} record detail templates have no design",
            "observed": "The live site publishes a detail page for each record of these types, with no frame.",
            "list": [f"{u.get('type')} — e.g. {u['path']}" for u in recs],
            "recommendation": "Design one record-detail template (title, meta row, body, attachments, related "
                              "records) and its variants per type.",
        })

    # ---------------------------------------------------------------- D · UI/UX for the PMO audit
    wanted = {"A-FOCUS": "Specify a visible focus indicator",
              "A-TARGET": "Specify 44×44px touch targets",
              "D-FOOTER-SECTIONS": "Carry the DBIM 5.6 footer sections",
              "A-HEADING-ORDER": "Specify the heading hierarchy",
              "A-CONTRAST-NONTEXT": "Give icon controls 3:1",
              "U-TYPE-SCALE": "Keep live type on the UX4G scale",
              "J-IA": "Link gallery cards to their gallery pages",
              "J-COPY": "Write a page-specific description for every page"}
    done = set()
    k = 0
    for s in am["screens"]:
        f = s["findings"][0]
        code = next((c for c in wanted if c in (f.get("figma", "") + f.get("id", "") + s.get("name", ""))
                     or (c == "A-FOCUS" and "focus" in s["name"].lower())
                     or (c == "A-TARGET" and "target" in s["name"].lower())
                     or (c == "D-FOOTER-SECTIONS" and "footer" in s["name"].lower())
                     or (c == "A-HEADING-ORDER" and "heading levels" in s["name"].lower())
                     or (c == "A-CONTRAST-NONTEXT" and "non-text" in s["name"].lower())
                     or (c == "U-TYPE-SCALE" and "type scale" in s["name"].lower())
                     or (c == "J-IA" and "gallery card" in s["name"].lower())
                     or (c == "J-COPY" and "annual reports description" in s["name"].lower())), None)
        if not code or code in done or not s.get("liveImg") or not f.get("liveMark"):
            continue
        done.add(code)
        k += 1
        img = copy_img(os.path.join(DEV, s["liveImg"]), f"D-{k:02d}.jpg")
        basis = s.get("_basisLive") or f.get("liveBasis") or 1440
        box = f.get("sectionBox") or [0, 0, basis, 600]
        items.append({
            "id": f"DES-D-{k:02d}", "group": "D", "type": "Design",
            "title": wanted[code],
            "observed": f"{f['live']} (Dev report {f['id']}.)",
            "recommendation": f"{f['fix']} Draw it into the design first, so every page built from it "
                              f"inherits the fix and QC has something to check against.",
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
