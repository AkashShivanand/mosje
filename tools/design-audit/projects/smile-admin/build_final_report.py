#!/usr/bin/env python3
"""SMILE Beggary — the one source of truth for the published deliverables.

Reads the finalised finding set (finalise.py) plus the anchors every pin was derived from, and
writes, into docs/qc/portals/smile-admin/:
  audit-master.json   the schema the canonical generator reads
  <portal>-Design-QC-Report.pdf   via a COPY of the skill's generate_pdf.py + render.js
It also writes the tracker sheet into docs/qc/MoSJE-Portal-QC-Tracker.xlsx.

Every global gets its OWN board, as the reviewer asked: a finding they cannot see beside its
screenshot is a finding they cannot check.
"""
import json, os, shutil, struct, subprocess, sys, collections
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

REPO = os.path.abspath(os.path.join(HERE, "..", "..", "..", ".."))
DEST = os.path.join(REPO, "docs", "qc", "portals", "smile-admin")
SKILL = os.path.expanduser("~/.claude/skills/design-qc/scripts")
PORTAL = "SMILE — Beggary (Comprehensive Rehabilitation) · Admin"
DESIGN_FILE = "evmNmlK8g4VYwJVu2FwSGV"
FURL = "https://www.figma.com/design/" + DESIGN_FILE + "/MoSJE-Portal--Handoff-?node-id={n}"
BASE = "https://smile-admin-dev.mosje.in"
PAD, MINC = 130, 380
SEV_ORDER = {"Blocker": 0, "Major": 1, "Minor": 2, "Nit": 3}


def png_h(p):
    with open(p, "rb") as fh:
        fh.read(16)
        return struct.unpack(">II", fh.read(8))[1]


def band(img_h, boxes):
    y0 = max(0, min(b[1] for b in boxes) - PAD)
    y1 = min(img_h, max(b[1] + b[3] for b in boxes) + PAD)
    if y1 - y0 < MINC:
        y1 = min(img_h, y0 + MINC)
    if y1 - y0 < MINC:
        y0 = max(0, y1 - MINC)
    return y0, y1


def pin_pct(box, x0, y0, x1, y1):
    """A pin as a percentage of its crop — the shape the canonical generator draws."""
    cx, cy = box[0] + box[2] / 2, box[1] + box[3] / 2
    return {"x": round(max(0, min(100, (cx - x0) / max(1, x1 - x0) * 100)), 1),
            "y": round(max(0, min(100, (cy - y0) / max(1, y1 - y0) * 100)), 1)}


def main():
    fin = json.load(open(os.path.join(HERE, "findings_final.json")))
    ba = json.load(open(os.path.join(HERE, "sheet", "anchors.json")))
    da = json.load(open(os.path.join(HERE, "design_anchors.json")))
    rows = {r["slug"]: r for r in json.load(open(os.path.join(HERE, "sheet", "all_rows.json")))}
    kept = fin["kept"]
    os.makedirs(DEST, exist_ok=True)

    def imgs(slug):
        d = os.path.join(HERE, "sheet", f"{slug}.design.png")
        b = os.path.join(HERE, "sheet", f"{slug}.build.png")
        return d, b

    screens, missing = [], []
    # ---- one board per GLOBAL ---------------------------------------------------------------
    globals_ = [k for k in kept if k["scope"] == "Global"]
    globals_.sort(key=lambda k: k["id"])
    for k in globals_:
        a = ba.get(k["old"]); d = da.get(k["old"])
        if not a or not d:
            missing.append(k["id"]); continue
        slug = a["slug"]; dp, bp = imgs(slug)
        dH, bH = png_h(dp), png_h(bp)
        dy0, dy1 = band(dH, [d["box"]]); by0, by1 = band(bH, [a["box"]])
        r = rows[slug]
        f = dict(num=1, id=k["id"], element=k["title"], section="global", scope="Global",
                 axis=k["cat"], severity=k["sev"], figma=k["design"], live=k["build"], fix=k["fix"],
                 subO=f"Scope: Global — shown on {r['title']}; the same issue repeats across screens",
                 figmaBox=[0, dy0, 1440, dy1], liveBox=[0, by0, 1440, by1],
                 sectionBox=[0, by0, 1440, by1],
                 figmaPin=pin_pct(d["box"], 0, dy0, 1440, dy1),
                 livePin=pin_pct(a["box"], 0, by0, 1440, by1))
        screens.append({"slug": k["id"], "name": f"Global · {k['title']}", "env": "dev",
                        "figmaImg": os.path.relpath(dp, DEST), "liveImg": os.path.relpath(bp, DEST),
                        "figmaUrl": FURL.format(n=d["node"].replace(":", "-")), "liveUrl": r["liveUrl"],
                        "findings": [f], "_role": "Global", "_node": d["node"], "_undesigned": False,
                        "note": "Scope: Global — this repeats across the portal; fix once, it lands everywhere."})

    # ---- one board per SCREEN ---------------------------------------------------------------
    per = collections.defaultdict(list)
    for k in kept:
        if k["scope"] != "Global":
            per[k["screen"]].append(k)
    for screen, items in per.items():
        items.sort(key=lambda k: k["id"])
        anchored = [k for k in items if k["old"] in ba and k["old"] in da]
        if not anchored:
            missing.append(screen); continue
        slug = ba[anchored[0]["old"]]["slug"]
        dp, bp = imgs(slug)
        dH, bH = png_h(dp), png_h(bp)
        dy0, dy1 = band(dH, [da[k["old"]]["box"] for k in anchored])
        by0, by1 = band(bH, [ba[k["old"]]["box"] for k in anchored])
        r = rows[slug]
        fnd = []
        for i, k in enumerate(items, 1):
            f = dict(num=i, id=k["id"], element=k["title"], section=slug.lower(), scope="Screen",
                     axis=k["cat"], severity=k["sev"], figma=k["design"], live=k["build"], fix=k["fix"],
                     figmaBox=[0, dy0, 1440, dy1], liveBox=[0, by0, 1440, by1],
                     sectionBox=[0, by0, 1440, by1])
            if k["old"] in ba and k["old"] in da:
                f["figmaPin"] = pin_pct(da[k["old"]]["box"], 0, dy0, 1440, dy1)
                f["livePin"] = pin_pct(ba[k["old"]]["box"], 0, by0, 1440, by1)
            fnd.append(f)
        node = da[anchored[0]["old"]]["node"]
        screens.append({"slug": slug, "name": f"{screen}", "env": "dev",
                        "figmaImg": os.path.relpath(dp, DEST), "liveImg": os.path.relpath(bp, DEST),
                        "figmaUrl": FURL.format(n=node.replace(":", "-")), "liveUrl": r["liveUrl"],
                        "findings": fnd, "_role": "Super Admin" if slug.startswith("SUPER") else "Sign-in",
                        "_node": node, "_undesigned": False})

    am = {"portal": PORTAL, "idPrefix": fin["prefix"],
          "generated": "2026-09-10", "figmaUrl": FURL.format(n="7732-77842"),
          "method": ("Design frames on 'Smile Beggary (Synced)' compared against the live dev build at a "
                     "1440 viewport, screen by screen, for four roles. Only differences between the design "
                     "and the build are raised. Copy, wording and policy items are out of scope for this "
                     "report, and the filter sets are covered by one global note rather than per screen."),
          "deferred": [{"id": d["old"], "title": d["title"], "reason": d["reason"]} for d in fin["dropped"]],
          "screens": screens}
    json.dump(am, open(os.path.join(DEST, "audit-master.json"), "w"), indent=1)
    n_f = sum(len(s["findings"]) for s in screens)
    print(f"audit-master.json: {len(screens)} boards, {n_f} findings")
    if missing:
        print("   ! no anchor for:", missing)
    for name in ("generate_pdf.py", "render.js"):
        shutil.copyfile(os.path.join(SKILL, name), os.path.join(DEST, name))
    return 0


if __name__ == "__main__":
    sys.exit(main())
