#!/usr/bin/env python3
"""Prepare the data + images the SMILE-Beggary Figma review sheet is built from.

Writes sheet/<SLUG>.design.png and sheet/<SLUG>.build.png (1440-wide, the width the board crop
maths assumes) and sheet/rows.json — one row per screen, in the order a reviewer would traverse
the portal, carrying the Figma node, the live route, and the draft issues text.

Run: python3 build_review_sheet_data.py
"""
import json, os, shutil, sys, struct

HERE = os.path.dirname(os.path.abspath(__file__))
LIVE = os.path.join(HERE, "captures", "live")
FIG  = os.path.join(HERE, "captures", "figma")
OUT  = os.path.join(HERE, "sheet")
FILE_KEY = "evmNmlK8g4VYwJVu2FwSGV"
BASE = "https://smile-admin-dev.mosje.in"

sys.path.insert(0, HERE)
import findings_draft as F

def png_size(p):
    with open(p, "rb") as fh:
        fh.read(16); return struct.unpack(">II", fh.read(8))

def frames():
    return json.load(open(os.path.join(HERE, "inputs", "figma-frames.json")))

def main():
    os.makedirs(OUT, exist_ok=True)
    fr = [f for f in frames() if f.get("route")]
    # issues, keyed by the screen name the findings use
    by_screen = {}
    for f in F.SCREEN:
        by_screen.setdefault(f[2], []).append(f)
    rows = []
    for f in fr:
        route = f["route"]
        slug = "SUPER-ADMIN" + route.upper().replace("/", "-")
        # the capture slug is derived from the route the same way the engine derives it
        cand = [c for c in os.listdir(LIVE) if c.endswith(".png") and c.startswith("SUPER-ADMIN")]
        live_png = None
        want = "SUPER-ADMIN-" + "-".join(p for p in route.strip("/").upper().split("/"))
        for c in cand:
            if c[:-4] == want:
                live_png = os.path.join(LIVE, c); slug = c[:-4]; break
        design_png = os.path.join(FIG, f"{slug}.png")
        # A `_refFrame` row is audited against ANOTHER screen's frame as the style reference, so
        # its design image is that frame's file, not one named after this route. Look it up by
        # node id rather than leaving the DESIGN column empty — a review sheet with a blank design
        # column is unusable to the reviewer (audit-rules, TG r1).
        if not os.path.exists(design_png):
            for other in frames():
                if other.get("node_id") == f["node_id"] and other.get("route") and not other.get("_refFrame"):
                    alt = "SUPER-ADMIN-" + "-".join(x for x in other["route"].strip("/").upper().split("/"))
                    cand2 = os.path.join(FIG, f"{alt}.png")
                    if os.path.exists(cand2):
                        design_png = cand2
                        row_ref_from = alt
                        break
        row = {
            "slug": slug,
            "title": f["name"].split("/", 1)[-1],
            "route": route,
            "node": f["node_id"],
            "figmaUrl": f"https://www.figma.com/design/{FILE_KEY}/MoSJE-Portal--Handoff-?node-id={f['node_id'].replace(':','-')}",
            "liveUrl": BASE + route,
            "refFrame": bool(f.get("_refFrame")),
            "design": None, "build": None,
            "designSize": None, "buildSize": None,
            "issues": [],
        }
        if os.path.exists(design_png):
            dst = os.path.join(OUT, f"{slug}.design.png"); shutil.copyfile(design_png, dst)
            row["design"] = os.path.relpath(dst, HERE); row["designSize"] = png_size(dst)
        if live_png and os.path.exists(live_png):
            dst = os.path.join(OUT, f"{slug}.build.png"); shutil.copyfile(live_png, dst)
            row["build"] = os.path.relpath(dst, HERE); row["buildSize"] = png_size(dst)
        # attach the screen-specific draft issues
        key = row["title"].split(" - ")[0]
        for name, items in by_screen.items():
            if name.lower() in row["title"].lower() or row["title"].lower().startswith(name.lower()):
                for it in items:
                    row["issues"].append({"id": it[0], "severity": it[3], "category": it[4],
                                          "title": it[5], "design": it[6], "build": it[7], "fix": it[8]})
        rows.append(row)
    payload = {
        "portal": "SMILE — Beggary (Comprehensive Rehabilitation) · Admin",
        "env": "DEV", "captured": "2026-09-10", "role": "super-admin",
        "globals": [{"id": g[0], "severity": g[3], "category": g[4], "title": g[5],
                     "design": g[6], "build": g[7], "fix": g[8], "scope": "Global"} for g in (F.GLOBAL + F.MACHINE)],
        "deferred": [{"id": d[0], "title": d[1], "reason": d[2]} for d in F.DEFERRED],
        "rows": rows,
    }
    json.dump(payload, open(os.path.join(OUT, "rows.json"), "w"), indent=2)
    have_both = sum(1 for r in rows if r["design"] and r["build"])
    print(f"{len(rows)} rows -> sheet/rows.json  ({have_both} with both sides, "
          f"{sum(1 for r in rows if not r['build'])} missing a build capture)")
    for r in rows:
        if not (r["design"] and r["build"]):
            print(f"   ! {r['slug']:<58} design={bool(r['design'])} build={bool(r['build'])}")

if __name__ == "__main__":
    main()
