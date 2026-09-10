#!/usr/bin/env python3
"""Compute a DESIGN|BUILD board per SCREEN, with one numbered pin per finding on that screen.

The globals get a board each (build_global_boards.py) because they have nothing else in common.
A screen's findings do share a context, so they share one board and the pins are numbered 1..n
down the screen — the pattern the first five screen sections already use.

The crop is the union of that screen's anchors, padded, and every pin is asserted to sit inside
it. A pin that will not fit fails the run rather than being clamped onto nothing.
"""
import json, os, struct, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import findings_draft as F
from build_global_boards import png_size, SCALE, COL

PAD, MINC = 120, 380
SEV = {"Blocker": 0, "Major": 1, "Minor": 2, "Nit": 3}
# which screens this pass builds; the first five sections already exist in the report
SCREENS = ["Shelter Occupants", "Master Settings", "Rehab Data", "Skill & Training",
           "City Profiling", "City Profiling — district list", "Performance Statistics",
           "Onboard New User", "Add Shelter Home", "Create New Role", "Roles"]


def band(img_h, boxes):
    """One crop holding every anchor on the screen. Grows down, then up — an anchor at the
    bottom of the page cannot be padded downwards."""
    y0 = max(0, min(b[1] for b in boxes) - PAD)
    y1 = min(img_h, max(b[1] + b[3] for b in boxes) + PAD)
    if y1 - y0 < MINC:
        y1 = min(img_h, y0 + MINC)
    if y1 - y0 < MINC:
        y0 = max(0, y1 - MINC)
    return y0, y1


def main():
    ba = json.load(open(os.path.join(HERE, "sheet", "anchors.json")))
    da = json.load(open(os.path.join(HERE, "design_anchors.json")))
    rows = {r["slug"]: r for r in json.load(open(os.path.join(HERE, "sheet", "all_rows.json")))}
    hashes = json.load(open(os.path.join(HERE, "board_image_hashes.json")))
    sheet_hashes = json.load(open(os.path.join(HERE, "sheet_image_hashes.json")))
    hashes = dict(hashes, **sheet_hashes)

    all_f = F.SCREEN + F.DIFF2 + F.SCREEN2 + F.SCREEN3
    out, fail = [], []
    for screen in SCREENS:
        mine = [f for f in all_f if f[1] == "Screen" and f[2] == screen]
        if not mine:
            fail.append(f"{screen}: no findings"); continue
        mine.sort(key=lambda f: f[0])
        slug = ba[mine[0][0]]["slug"]
        if any(ba[f[0]]["slug"] != slug for f in mine):
            fail.append(f"{screen}: findings span more than one capture"); continue
        dp_ = os.path.join(HERE, "sheet", f"{slug}.design.png")
        bp_ = os.path.join(HERE, "sheet", f"{slug}.build.png")
        _, dH = png_size(dp_); _, bH = png_size(bp_)
        dboxes = [da[f[0]]["box"] for f in mine if f[0] in da]
        bboxes = [ba[f[0]]["box"] for f in mine]
        if len(dboxes) != len(mine):
            fail.append(f"{screen}: a finding has no design anchor"); continue
        dy0, dy1 = band(dH, dboxes)
        by0, by1 = band(bH, bboxes)
        r = rows[slug]
        pins = []
        for i, f in enumerate(mine, 1):
            d, b = da[f[0]]["box"], ba[f[0]]["box"]
            pins.append(dict(n=i, id=f[0], sev=f[3],
                             dp=[round((d[0] + d[2] / 2) * SCALE, 1), round((d[1] + d[3] / 2 - dy0) * SCALE, 1)],
                             bp=[round((b[0] + b[2] / 2) * SCALE, 1), round((b[1] + b[3] / 2 - by0) * SCALE, 1)]))
        sec = dict(screen=screen, slug=slug, route=r["route"],
                   figmaUrl=r["figmaUrl"], liveUrl=r["liveUrl"],
                   dHash=hashes.get(slug + "|design"), bHash=hashes.get(slug + "|build"),
                   dImgH=round(dH * SCALE), bImgH=round(bH * SCALE),
                   dClipH=round((dy1 - dy0) * SCALE), bClipH=round((by1 - by0) * SCALE),
                   dOff=round(-dy0 * SCALE), bOff=round(-by0 * SCALE),
                   counts={s: sum(1 for f in mine if f[3] == s) for s in ("Blocker", "Major", "Minor", "Nit")},
                   pins=pins,
                   findings=[dict(n=p["n"], id=f[0], sev=f[3], cat=f[4], title=f[5],
                                  design=f[6], build=f[7], fix=f[8])
                             for p, f in zip(pins, mine)])
        for p in pins:
            for side, xy, clip in (("design", p["dp"], sec["dClipH"]), ("build", p["bp"], sec["bClipH"])):
                if not (0 <= xy[1] <= clip):
                    fail.append(f"{screen} pin {p['n']} ({p['id']}): {side} y={xy[1]} outside crop 0..{clip}")
        if not sec["dHash"] or not sec["bHash"]:
            fail.append(f"{screen}: missing an image hash for {slug}")
        out.append(sec)

    json.dump(out, open(os.path.join(HERE, "sheet", "screen_boards.json"), "w"), indent=1)
    print(f"{len(out)} screen boards, {sum(len(s['pins']) for s in out)} pins")
    for s in out:
        print(f"  {s['screen']:<32} {len(s['pins'])} pins  crop d={s['dClipH']} b={s['bClipH']}")
    for x in fail:
        print("   !", x)
    return 1 if fail else 0


if __name__ == "__main__":
    sys.exit(main())
