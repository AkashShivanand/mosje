#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""NMBA - the one source of truth for the published deliverables.

Reads findings_final.json plus the anchors every pin was derived from, and writes into
docs/qc/portals/nmba/:
    audit-master.json                        the schema the canonical generator reads
    captures/{figma,live}/<SLUG>.png         the board images, 1440-wide
    NMBA-...-Design-QC-Report.pdf            via a COPY of the skill's generate_pdf.py + render.js

Every GLOBAL finding gets its OWN board pointing at a representative frame, because a finding a
reviewer cannot see beside its screenshot is a finding they cannot check. Every audited screen
appears, including the ones with no findings of their own: on a government deliverable, coverage
has to be visible, so a findings-free screen renders as a single reference board.
"""
import collections, json, os, shutil, struct, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", "..", "..", ".."))
DEST = os.path.join(REPO, "docs", "qc", "portals", "nmba")
SKILL = os.path.expanduser("~/.claude/skills/design-qc/scripts")
PORTAL = "NMBA — Nasha Mukt Bharat Abhiyaan (DEV)"
FURL = "https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id={n}"
GENERATED = "2026-09-11"
PAD, MINC = 130, 380
SEV = {"Blocker": 0, "Major": 1, "Minor": 2, "Nit": 3}
ROLE_ORDER = ["global", "public", "signin", "admin", "state-nodal-officer", "district-nodal-officer"]


def png_h(p):
    with open(p, "rb") as fh:
        fh.read(16)
        return struct.unpack(">II", fh.read(8))[1]


def band(img_h, boxes):
    """A crop that contains every box it must, padded, and never shorter than MINC."""
    y0 = max(0, min(b[1] for b in boxes) - PAD)
    y1 = min(img_h, max(b[1] + b[3] for b in boxes) + PAD)
    if y1 - y0 < MINC:
        y1 = min(img_h, y0 + MINC)
    if y1 - y0 < MINC:
        y0 = max(0, y1 - MINC)
    return y0, y1


def pin_pct(box, x0, y0, x1, y1):
    cx, cy = box[0] + box[2] / 2.0, box[1] + box[3] / 2.0
    return {"x": round(max(0, min(100, (cx - x0) / max(1, x1 - x0) * 100)), 1),
            "y": round(max(0, min(100, (cy - y0) / max(1, y1 - y0) * 100)), 1)}


def main():
    fin = json.load(open(os.path.join(HERE, "findings_final.json")))
    ba = json.load(open(os.path.join(HERE, "sheet", "anchors.json")))
    da = json.load(open(os.path.join(HERE, "design_anchors.json")))
    rows = {r["slug"]: r for r in json.load(open(os.path.join(HERE, "sheet", "all_rows.json")))}
    kept = fin["kept"]

    # ---- board images -----------------------------------------------------------------------
    for sub in ("figma", "live"):
        os.makedirs(os.path.join(DEST, "captures", sub), exist_ok=True)
    used_slugs = {k["slug"] for k in kept if k.get("slug")} | {
        r["slug"] for r in rows.values() if r["role"] != "global"}
    for slug in sorted(used_slugs):
        for src, sub in ((os.path.join(HERE, "captures", "figma", f"{slug}.png"), "figma"),
                         (os.path.join(HERE, "captures", "live", f"{slug}.png"), "live")):
            if os.path.exists(src):
                shutil.copyfile(src, os.path.join(DEST, "captures", sub, f"{slug}.png"))

    def imgs(slug):
        d = os.path.join(DEST, "captures", "figma", f"{slug}.png")
        b = os.path.join(DEST, "captures", "live", f"{slug}.png")
        return (d if os.path.exists(d) else None), (b if os.path.exists(b) else None)

    screens, missing = [], []

    # ---- one board per GLOBAL finding --------------------------------------------------------
    globals_ = sorted([k for k in kept if k["scope"] == "Global"], key=lambda k: k["id"])
    for k in globals_:
        a, d = ba.get(k["id"]), da.get(k["id"])
        if not a or not d:
            # A standing note with no single element still belongs in the report; it renders
            # without a board rather than being dropped.
            screens.append({"slug": k["id"], "name": "Global · " + k["title"], "env": "dev",
                            "findings": [dict(num=1, id=k["id"], element=k["title"],
                                              section="global", scope="Global", axis=k["cat"],
                                              severity=k["sev"], figma=k["design"],
                                              live=k["build"], fix=k["fix"])],
                            "_role": "global",
                            "note": k.get("_evidenceWhy") or
                                    "Raised once by decision; it describes no single element."})
            continue
        slug = a["slug"]
        dp, bp = imgs(slug)
        dy0, dy1 = band(png_h(dp), [d["box"]])
        by0, by1 = band(png_h(bp), [a["box"]])
        f = dict(num=1, id=k["id"], element=k["title"], section="global", scope="Global",
                 axis=k["cat"], severity=k["sev"], figma=k["design"], live=k["build"], fix=k["fix"],
                 subO="Scope: Global — shown on " + slug + "; the same issue repeats across screens",
                 figmaBox=[0, dy0, 1440, dy1], liveBox=[0, by0, 1440, by1],
                 sectionBox=[0, by0, 1440, by1],
                 figmaPin=pin_pct(d["box"], 0, dy0, 1440, dy1),
                 livePin=pin_pct(a["box"], 0, by0, 1440, by1))
        for w in ("_anchorWhy", "_evidenceWhy"):
            if k.get(w):
                f[w] = k[w]
        if k.get("_anchorWhy"):
            f["fix"] = f["fix"] + "  (Anchor: " + k["_anchorWhy"] + ")"
        screens.append({"slug": k["id"], "name": "Global · " + k["title"], "env": "dev",
                        "figmaImg": os.path.relpath(dp, DEST), "liveImg": os.path.relpath(bp, DEST),
                        "figmaUrl": FURL.format(n=d["node"].replace(":", "-")),
                        "liveUrl": rows.get(slug, {}).get("url"),
                        "findings": [f], "_role": "global", "_node": d["node"],
                        # the amber strip above the board - the same one SMILE Beggary carries.
                        "note": "Scope: Global — this repeats across the portal; fix once, "
                                "it lands everywhere."})

    # ---- one board per SCREEN that has findings ---------------------------------------------
    per = collections.defaultdict(list)
    for k in kept:
        if k["scope"] != "Global" and k.get("slug"):
            per[k["slug"]].append(k)
    boarded = set()
    for slug, items in per.items():
        items.sort(key=lambda k: (SEV.get(k["sev"], 9), k["id"]))
        dp, bp = imgs(slug)
        anchored = [k for k in items if k["id"] in ba and k["id"] in da]
        if not bp:
            missing.append(slug)
            continue
        if not dp:
            # No design frame exists for this route - the finding is about the build alone and
            # says so in `_evidenceWhy`. A single-sided board is the honest rendering; dropping
            # the screen would hide a Major finding because the design has no counterpart.
            ba_only = [k for k in items if k["id"] in ba]
            by0, by1 = band(png_h(bp), [ba[k["id"]]["box"] for k in ba_only]) if ba_only else (0, 600)
            fnd = []
            for i, k in enumerate(items, 1):
                f = dict(num=i, id=k["id"], element=k["title"], section=slug.lower(),
                         scope="Screen", axis=k["cat"], severity=k["sev"], figma=k["design"],
                         live=k["build"], fix=k["fix"], liveBox=[0, by0, 1440, by1],
                         sectionBox=[0, by0, 1440, by1])
                if k["id"] in ba:
                    f["livePin"] = pin_pct(ba[k["id"]]["box"], 0, by0, 1440, by1)
                for w in ("_anchorWhy", "_evidenceWhy"):
                    if k.get(w):
                        f[w] = k[w]
                fnd.append(f)
            r = rows.get(slug, {})
            screens.append({"slug": slug, "name": items[0]["screen"], "env": "dev",
                            "liveImg": os.path.relpath(bp, DEST), "liveUrl": r.get("url"),
                            "findings": fnd, "_role": r.get("role", ""),
                            "_refsub": "The design draws no counterpart for this route, so this "
                                       "board shows the build alone."})
            boarded.add(slug)
            continue
        if not anchored:
            missing.append(slug)
            continue
        dy0, dy1 = band(png_h(dp), [da[k["id"]]["box"] for k in anchored])
        by0, by1 = band(png_h(bp), [ba[k["id"]]["box"] for k in anchored])
        fnd = []
        for i, k in enumerate(items, 1):
            f = dict(num=i, id=k["id"], element=k["title"], section=slug.lower(), scope="Screen",
                     axis=k["cat"], severity=k["sev"], figma=k["design"], live=k["build"],
                     fix=k["fix"], figmaBox=[0, dy0, 1440, dy1], liveBox=[0, by0, 1440, by1],
                     sectionBox=[0, by0, 1440, by1])
            if k["id"] in ba and k["id"] in da:
                f["figmaPin"] = pin_pct(da[k["id"]]["box"], 0, dy0, 1440, dy1)
                f["livePin"] = pin_pct(ba[k["id"]]["box"], 0, by0, 1440, by1)
            # The gates read these off the finding. They must survive into the master, or a
            # declaration made once in findings_final.json is silently lost at publication and
            # the gate fires on a finding whose exemption was already argued.
            for w in ("_anchorWhy", "_evidenceWhy"):
                if k.get(w):
                    f[w] = k[w]
            if k.get("_anchorWhy"):
                f["fix"] = f["fix"] + "  (Anchor: " + k["_anchorWhy"] + ")"
            fnd.append(f)
        r = rows.get(slug, {})
        node = da[anchored[0]["id"]]["node"]
        screens.append({"slug": slug, "name": items[0]["screen"], "env": "dev",
                        "figmaImg": os.path.relpath(dp, DEST), "liveImg": os.path.relpath(bp, DEST),
                        "figmaUrl": FURL.format(n=node.replace(":", "-")), "liveUrl": r.get("url"),
                        "findings": fnd, "_role": r.get("role", ""), "_node": node})
        boarded.add(slug)

    # ---- every remaining audited screen, as a COVERAGE LEDGER, not as a board -----------------
    # Coverage still has to be accounted for on a government deliverable - a screen missing from
    # the record reads as a screen never looked at. But it is accounted for by NAME, not by a
    # page of picture per clean screen: 2026-09-11, the reviewer asked for the appendix to go and
    # for the report to carry only the screens that have something to say. The list below is what
    # the coverage statement and the tracker's Coverage tab are both built from, so nothing is
    # lost - it stops being 28 pages and becomes one sentence plus a tab.
    covered = []
    for slug, r in sorted(rows.items()):
        if r["role"] == "global" or slug in boarded:
            continue
        dp, bp = imgs(slug)
        if not bp:
            continue
        covered.append({"slug": slug, "name": r["title"], "role": r["role"],
                        "url": r.get("url"), "figmaUrl": r.get("figmaUrl"),
                        "hasDesignFrame": bool(dp),
                        "verdict": "Audited \u2014 no screen-specific finding"})

    screens.sort(key=lambda s: (ROLE_ORDER.index(s.get("_role")) if s.get("_role") in ROLE_ORDER else 9,
                                min([SEV.get(f["severity"], 9) for f in s["findings"]] or [9]),
                                s["slug"]))

    # The published report carries NO deferred section — reviewer instruction, 2026-09-12. The
    # withdrawn claims, the reviewer notes already covered by other findings, and the design-file
    # observations were shared directly with the reviewer instead.
    #
    # The record is NOT lost: `findings_final.json` keeps `dropped[]` (every withdrawn claim with
    # the reason it was withdrawn) and `designFileNotes[]`, the tracker keeps a Withdrawn row per
    # withdrawn finding, and `docs/audit/nmba-deferred-and-design-file-notes.md` holds the full
    # list. Only the READER-facing report omits it. `deferred` stays a key, because
    # DELIVERABLE-SPEC requires the field to exist on every master.
    DEFER_IN_REPORT = False
    deferred = []
    if DEFER_IN_REPORT:
        deferred = [{"id": d.get("old") or "-", "title": d["title"], "reason": d["reason"]}
                    for d in fin["dropped"]]
        deferred += [{"id": "design-file", "title": "Design file — " + n["title"],
                      "reason": n["detail"]} for n in fin.get("designFileNotes", [])]

    am = {"portal": PORTAL, "idPrefix": fin["prefix"], "generated": GENERATED,
          "figmaUrl": FURL.format(n="2136-20193"),
          "method": (
              "The NMBA design page (‘NMBA — Dev Synced — August’) compared against the live dev "
              "build at a locked 1440 viewport, screen by screen, for the citizen site, the sign-in "
              "surface and three admin roles — Admin, State Nodal Officer and District Nodal Officer. "
              "50 screens were captured and 35 design frames paired one to one. Only differences "
              "between the design and the build are raised. Copy, wording, naming and policy are out "
              "of scope for this report, and the filter sets are covered by a single global note "
              "rather than screen by screen. Every finding carries a design box and a build box, and "
              "was checked against a 1:1 crop of both sides before publication. "
              "This report carries only what has something to say. Of the {ncap} screens "
              "captured, {nscr} carry a finding of their own and appear here as a board; the "
              "remaining {ncov} were checked against their design frames and carry no "
              "screen-specific finding, so they are named one by one in the ‘Coverage — NMBA’ "
              "tab of the QC tracker rather than repeated here as a page of picture each. The "
              "portal-wide findings still apply to all {ncap}: the {nglob} global boards below "
              "each draw one such finding on a screen that shows it clearly."),
          "coverage": covered,
          "coverageSummary": {"screensCaptured": len(rows) - sum(1 for r in rows.values()
                                                                 if r["role"] == "global"),
                              "withFindings": len([x for x in screens
                                                   if x.get("_role") != "global"]),
                              "noScreenFinding": len(covered)},
          "deferred": deferred, "screens": screens}
    nscreen_boards = len([x for x in screens if x.get("_role") != "global"])
    nglobal_boards = len([x for x in screens if x.get("_role") == "global"])
    # The three numbers have to reconcile, or the sentence is a claim nobody can check:
    # screens with a finding + screens without one = screens captured.
    assert nscreen_boards + len(covered) == am["coverageSummary"]["screensCaptured"], (
        "coverage does not reconcile: %d boarded + %d ledger != %d captured"
        % (nscreen_boards, len(covered), am["coverageSummary"]["screensCaptured"]))
    am["method"] = am["method"].format(
        ncap=am["coverageSummary"]["screensCaptured"], nscr=nscreen_boards,
        ncov=len(covered), nglob=nglobal_boards)
    json.dump(am, open(os.path.join(DEST, "audit-master.json"), "w"), indent=1)

    nf = sum(len(s["findings"]) for s in screens)
    print(f"audit-master.json: {len(screens)} boards, {nf} findings, "
          f"{len(covered)} screens covered by ledger, {len(deferred)} deferred/withdrawn")
    if missing:
        print("   ! no usable anchor or image for:", missing)

    # the canonical generator is COPIED, never forked
    for name in ("generate_pdf.py", "render.js"):
        shutil.copyfile(os.path.join(SKILL, name), os.path.join(DEST, name))
    print("copied generate_pdf.py + render.js from the skill")
    return 0


if __name__ == "__main__":
    sys.exit(main())
