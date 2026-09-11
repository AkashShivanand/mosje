#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""One row per CAPTURED screen for the Figma review sheet, in the order a person would walk the
portal: the citizen site, then sign-in, then Admin, State Nodal Officer, District Nodal Officer.

Every row carries its design frame where one exists, the live route, and the draft issues text
the reviewer edits. A row whose DESIGN column is a placeholder is the failure mode this project
has hit before (TG r1) - so a screen with no frame says so in words rather than being left blank.

Writes sheet/all_rows.json and, for every captured screen, sheet/<SLUG>.build.png (1440-wide).

Every row also carries its PINS. A review sheet without pins asks the reviewer to find the thing
the sentence is about by reading the sentence - which is the one job the picture was put there to
do. The reviewer has asked for them twice. They are computed here, from the same anchor boxes the
pinned report and the claim gates use, and expressed as a percentage of the image so the Figma
builder can place them at whatever scale the column happens to be.
"""
import json, os, shutil, struct, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import findings_draft as F

LIVE = os.path.join(HERE, "captures", "live")
FIG = os.path.join(HERE, "captures", "figma")
SHEET = os.path.join(HERE, "sheet")
FURL = "https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id={n}"
ROLE_ORDER = ["public", "signin", "admin", "state-nodal-officer", "district-nodal-officer"]
ROLE_TITLE = {"public": "Citizen", "signin": "Sign in", "admin": "Admin",
              "state-nodal-officer": "State Nodal Officer",
              "district-nodal-officer": "District Nodal Officer"}
# Routes the build serves that the design never drew. Named, not hidden: an undesigned screen is
# audited against the visual language and the fact is stated on its row.
UNDESIGNED_NOTE = ("No Figma frame for this screen - audited against the visual language the "
                   "designed screens establish.")


def png_size(p):
    with open(p, "rb") as fh:
        fh.read(16)
        return struct.unpack(">II", fh.read(8))


SEV_ORDER = {"Blocker": 0, "Major": 1, "Minor": 2, "Nit": 3}


def pins_for(fids, danch, banch, live_dir, fig_dir, slug):
    """One pin per finding on the row, numbered exactly as the ISSUES text numbers them, placed at
    the centre of the anchor box as a percentage of its own image. A finding with no anchor on a
    side gets no pin on that side rather than a guessed one."""
    out = []
    dw, dh, bw, bh = 1440.0, None, 1440.0, None
    dp = os.path.join(fig_dir, f"{slug}.png") if slug else None
    bp = os.path.join(live_dir, f"{slug}.png") if slug else None
    if dp and os.path.exists(dp):
        dw, dh = [float(v) for v in png_size(dp)]
    if bp and os.path.exists(bp):
        bw, bh = [float(v) for v in png_size(bp)]
    for i, fid in enumerate(fids, 1):
        pin = {"n": i, "id": fid}
        d = danch.get(fid)
        if d and dh:
            x, y, w, h = d["box"]
            pin["dxPct"] = round((x + w / 2.0) / dw * 100, 3)
            pin["dyPct"] = round((y + h / 2.0) / dh * 100, 3)
        b = banch.get(fid)
        if b and bh and (not slug or b.get("slug") == slug):
            x, y, w, h = b["box"]
            pin["bxPct"] = round((x + w / 2.0) / bw * 100, 3)
            pin["byPct"] = round((y + h / 2.0) / bh * 100, 3)
        # A percentage outside the image is not a pin, it is a lie about where to look. GATE 3b
        # fails the build for this, but the sheet must not draw one even if a project skips it.
        for side in ("d", "b"):
            xk, yk = side + "xPct", side + "yPct"
            if xk in pin and not (0 <= pin[xk] <= 100 and 0 <= pin[yk] <= 100):
                pin.pop(xk); pin.pop(yk)
        out.append(pin)
    return out


def main():
    os.makedirs(SHEET, exist_ok=True)
    frames = json.load(open(os.path.join(HERE, "inputs", "figma-frames.json")))
    bundle = json.load(open(os.path.join(HERE, "out", "capture-bundle.json")))
    fin = json.load(open(os.path.join(HERE, "findings_final.json")))
    danch = json.load(open(os.path.join(HERE, "design_anchors.json")))
    banch = json.load(open(os.path.join(SHEET, "anchors.json")))
    sev_of = {k["id"]: k["sev"] for k in fin["kept"]}

    by_route = {}
    for fr in frames:
        if fr.get("route") and fr.get("node_id"):
            by_route[(fr["name"].split("/")[0], fr["route"])] = fr

    # issues text per slug, from the curated findings
    issues = {}
    for k in fin["kept"]:
        if k.get("slug"):
            issues.setdefault(k["slug"], []).append(k)

    rows = []
    # ---- GLOBAL rows first -------------------------------------------------------------------
    # A portal-wide issue belongs on its own row, shown on a screen where BOTH sides render the
    # element it is about. Hanging all sixteen off whichever screen happened to anchor them made
    # ADMIN-USER-MANAGEMENT look like the worst screen in the portal and left its neighbours
    # looking clean, which is the opposite of what a global finding means.
    globals_ = [k for k in fin["kept"] if k["scope"] == "Global"]
    for k in sorted(globals_, key=lambda k: k["id"]):
        gslug = k.get("slug")
        if not gslug:
            rows.append({"slug": "GLOBAL-" + k["id"], "role": "global", "roleTitle": "Global",
                         "title": "Global - " + k["title"], "route": "", "url": "",
                         "node": None, "figmaUrl": None, "designPng": None, "buildPng": None,
                         "designNote": "A standing note, not a single element.",
                         "issues": ["1. " + k["title"], "   " + k["build"]],
                         "findingIds": [k["id"]]})
            continue
        gfr = None
        for fr in frames:
            if fr.get("node_id") and not fr.get("_designOnly"):
                role = fr["name"].split("/")[0]
                r = (fr.get("route") or "/").strip("/").replace("/", "-") or "home"
                if (role + "-" + r).upper() == gslug:
                    gfr = fr; break
        dp = os.path.join(FIG, f"{gslug}.png"); bp = os.path.join(LIVE, f"{gslug}.png")
        if os.path.exists(dp):
            shutil.copyfile(dp, os.path.join(SHEET, f"{gslug}.design.png"))
        if os.path.exists(bp):
            shutil.copyfile(bp, os.path.join(SHEET, f"{gslug}.build.png"))
        rows.append({
            "slug": "GLOBAL-" + k["id"], "role": "global", "roleTitle": "Global",
            "title": "Global - " + k["title"], "route": "", "url": "",
            "node": gfr["node_id"] if gfr else None,
            "figmaUrl": FURL.format(n=gfr["node_id"].replace(":", "-")) if gfr else None,
            "designPng": f"{gslug}.design.png" if os.path.exists(dp) else None,
            "buildPng": f"{gslug}.build.png" if os.path.exists(bp) else None,
            "designNote": f"Applies to every screen with this element. Shown here on {gslug}.",
            "issues": ["1. " + k["title"], "   " + k["build"]],
            "findingIds": [k["id"]],
            "pins": [dict(pn, sev=sev_of.get(pn["id"], "Minor"))
                     for pn in pins_for([k["id"]], danch, banch, LIVE, FIG, gslug)]})

    # ---- one row per CAPTURED screen ---------------------------------------------------------
    for s in bundle["screens"]:
        slug, role, route = s["slug"], s["role"], s.get("route", "")
        fr = by_route.get((role, route))
        live_png = os.path.join(LIVE, f"{slug}.png")
        if not os.path.exists(live_png):
            continue
        shutil.copyfile(live_png, os.path.join(SHEET, f"{slug}.build.png"))
        design_png = os.path.join(FIG, f"{slug}.png")
        has_design = os.path.exists(design_png)
        if has_design:
            shutil.copyfile(design_png, os.path.join(SHEET, f"{slug}.design.png"))
        name = route.strip("/").replace("-", " ").replace("/", " / ").title() or "Home"
        mine = sorted([k for k in issues.get(slug, []) if k["scope"] != "Global"],
                      key=lambda k: k["id"])
        txt = [f'{i + 1}. {k["title"]}' for i, k in enumerate(mine)]
        if not txt:
            txt = ["No screen-specific issues. The portal-wide issues listed on the global rows "
                   "apply to this screen too."]
        rows.append({
            "slug": slug, "role": role, "roleTitle": ROLE_TITLE.get(role, role),
            "title": f"{ROLE_TITLE.get(role, role)} - {name}",
            "route": route, "url": s.get("url") or "",
            "node": fr["node_id"] if fr else None,
            "figmaUrl": FURL.format(n=(fr["node_id"].replace(":", "-"))) if fr else None,
            "designPng": f"{slug}.design.png" if has_design else None,
            "buildPng": f"{slug}.build.png",
            "designNote": None if has_design else UNDESIGNED_NOTE,
            "issues": txt,
            "findingIds": [k["id"] for k in mine],
            "pins": [dict(pn, sev=sev_of.get(pn["id"], "Minor"))
                     for pn in pins_for([k["id"] for k in mine], danch, banch, LIVE, FIG, slug)],
        })

    gl = [r for r in rows if r["role"] == "global"]
    sc = [r for r in rows if r["role"] != "global"]
    sc.sort(key=lambda r: (ROLE_ORDER.index(r["role"]) if r["role"] in ROLE_ORDER else 99,
                           r["route"]))
    rows = gl + sc
    json.dump(rows, open(os.path.join(SHEET, "all_rows.json"), "w"), indent=1)
    nod = sum(1 for r in rows if not r["designPng"])
    print(f"{len(rows)} rows -> sheet/all_rows.json   "
          f"({len(gl)} global + {len(sc)} screens; {nod} rows with no design frame)")
    imgs = {r["designPng"] for r in rows if r["designPng"]} | {r["buildPng"] for r in rows if r["buildPng"]}
    print(f"unique images to upload: {len(imgs)}")
    np_ = sum(len(r.get("pins") or []) for r in rows)
    nd = sum(1 for r in rows for p in (r.get("pins") or []) if "dxPct" in p)
    nb = sum(1 for r in rows for p in (r.get("pins") or []) if "bxPct" in p)
    print(f"pins: {np_} ({nd} on a design image, {nb} on a build image)")
    # A row that names a finding and draws no pin for it is the defect this was added to fix.
    bad = [(r["slug"], p["id"]) for r in rows for p in (r.get("pins") or [])
           if "bxPct" not in p and "dxPct" not in p]
    if bad:
        print("   ! findings with NO pin on either side:", bad)


if __name__ == "__main__":
    main()
