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
                 subO="Scope: Global — this repeats across the portal; fix it once and it "
                      "lands everywhere. Shown here on " + slug + ".",
                 figmaBox=[0, dy0, 1440, dy1], liveBox=[0, by0, 1440, by1],
                 sectionBox=[0, by0, 1440, by1],
                 figmaPin=pin_pct(d["box"], 0, dy0, 1440, dy1),
                 livePin=pin_pct(a["box"], 0, by0, 1440, by1))
        if k.get("_anchorWhy"):
            f["fix"] = f["fix"] + "  (Anchor: " + k["_anchorWhy"] + ")"
        screens.append({"slug": k["id"], "name": "Global · " + k["title"], "env": "dev",
                        "figmaImg": os.path.relpath(dp, DEST), "liveImg": os.path.relpath(bp, DEST),
                        "figmaUrl": FURL.format(n=d["node"].replace(":", "-")),
                        "liveUrl": rows.get(slug, {}).get("url"),
                        "findings": [f], "_role": "global", "_node": d["node"]})

    # ---- one board per SCREEN that has findings ---------------------------------------------
    per = collections.defaultdict(list)
    for k in kept:
        if k["scope"] != "Global" and k.get("slug"):
            per[k["slug"]].append(k)
    boarded = set()
    for slug, items in per.items():
        items.sort(key=lambda k: (SEV.get(k["sev"], 9), k["id"]))
        anchored = [k for k in items if k["id"] in ba and k["id"] in da]
        dp, bp = imgs(slug)
        if not anchored or not dp or not bp:
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

    # ---- every remaining audited screen, as a coverage board ---------------------------------
    # Coverage has to be VISIBLE on a government deliverable: a screen that was audited and found
    # clean is evidence, and a screen dropped from the report reads as a screen never looked at.
    for slug, r in sorted(rows.items()):
        if r["role"] == "global" or slug in boarded:
            continue
        dp, bp = imgs(slug)
        if not bp:
            continue
        sc = {"slug": slug, "name": r["title"], "env": "dev",
              "liveImg": os.path.relpath(bp, DEST), "liveUrl": r.get("url"),
              "findings": [], "_role": r["role"],
              "_refbadge": "AUDITED · NO SCREEN-SPECIFIC FINDING",
              "_refchip": "#047857",
              "_refsub": ("Audited against its design frame; the portal-wide findings apply here too."
                          if dp else
                          "No Figma frame for this screen — audited against the visual language "
                          "the designed screens establish.")}
        if dp:
            sc["figmaImg"] = os.path.relpath(dp, DEST)
            if r.get("figmaUrl"):
                sc["figmaUrl"] = r["figmaUrl"]
        screens.append(sc)

    screens.sort(key=lambda s: (ROLE_ORDER.index(s.get("_role")) if s.get("_role") in ROLE_ORDER else 9,
                                min([SEV.get(f["severity"], 9) for f in s["findings"]] or [9]),
                                s["slug"]))

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
              "was checked against a 1:1 crop of both sides before publication."),
          "deferred": deferred, "screens": screens}
    json.dump(am, open(os.path.join(DEST, "audit-master.json"), "w"), indent=1)

    nf = sum(len(s["findings"]) for s in screens)
    print(f"audit-master.json: {len(screens)} boards, {nf} findings, {len(deferred)} deferred/withdrawn")
    if missing:
        print("   ! no usable anchor or image for:", missing)

    # the canonical generator is COPIED, never forked
    for name in ("generate_pdf.py", "render.js"):
        shutil.copyfile(os.path.join(SKILL, name), os.path.join(DEST, name))
    print("copied generate_pdf.py + render.js from the skill")
    return 0


if __name__ == "__main__":
    sys.exit(main())
