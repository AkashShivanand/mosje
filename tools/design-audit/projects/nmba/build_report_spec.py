#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Turn audit-master.json into the compact per-board spec the Figma pinned report is built from.

The crop maths is the one the ledger fixed on NHAPOA r14 and must not be re-derived by hand:
    scale   = COL / 1440
    image   = COL wide x fullH*scale tall, placed at y = -box.y0*scale
              inside a clipsContent frame sized COL x (box.y1-box.y0)*scale
    pins    are crop-relative percentages, so they land at p.x%*COL, p.y%*cropH
Image hashes are HARVESTED from the review sheet upload - nothing is uploaded twice.
"""
import json, os, struct, sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", "..", "..", ".."))
DEST = os.path.join(REPO, "docs", "qc", "portals", "nmba")
COL = 688
SEV = {"Blocker": 0, "Major": 1, "Minor": 2, "Nit": 3}


def png_wh(p):
    with open(p, "rb") as fh:
        fh.read(16)
        return struct.unpack(">II", fh.read(8))


def h1440(p):
    """Height of the capture in 1440-wide space - the space every box in audit-master uses."""
    w, h = png_wh(p)
    return h if w == 1440 else round(h * 1440.0 / w)


def main():
    am = json.load(open(os.path.join(DEST, "audit-master.json")))
    H = json.load(open(os.path.join(HERE, "sheet", "image_hashes.json")))
    rows = {r["slug"]: r for r in json.load(open(os.path.join(HERE, "sheet", "all_rows.json")))}
    sc = COL / 1440.0

    boards, coverage = [], []
    for s in am["screens"]:
        if not s["findings"]:
            slug = s["slug"]
            bh = H.get(slug + ".build.png")
            if bh:
                coverage.append([slug, s["name"], bh,
                                 max(60, round(220 * h1440(os.path.join(DEST, s["liveImg"])) / 1440.0))])
            continue
        f0 = s["findings"][0]
        # a standing note with no board still gets a card, with no screenshots
        if "figmaBox" not in f0:
            boards.append({"slug": s["slug"], "name": s["name"], "sev": f0["severity"],
                           "route": "", "sub": f0.get("subO") or "", "note": s.get("note") or "",
                           "d": None, "b": None, "f": [[x["num"], x["id"], x["element"],
                                                        x["severity"], x["axis"], x.get("figma", ""),
                                                        x.get("live", ""), x.get("fix", ""),
                                                        x.get("scope", "Screen"), None, None]
                                                       for x in s["findings"]],
                           "figmaUrl": s.get("figmaUrl"), "liveUrl": s.get("liveUrl")})
            continue
        slug = s["slug"]
        dslug = os.path.basename(s["figmaImg"])[:-4]
        bslug = os.path.basename(s["liveImg"])[:-4]
        dH = h1440(os.path.join(DEST, s["figmaImg"]))
        bH = h1440(os.path.join(DEST, s["liveImg"]))
        db, bb = f0["figmaBox"], f0["liveBox"]
        d = {"hash": H.get(dslug + ".design.png"), "imgH": round(dH * sc),
             "imgY": round(-db[1] * sc), "cropH": round((db[3] - db[1]) * sc)}
        b = {"hash": H.get(bslug + ".build.png"), "imgH": round(bH * sc),
             "imgY": round(-bb[1] * sc), "cropH": round((bb[3] - bb[1]) * sc)}
        fl = []
        for x in s["findings"]:
            dp = x.get("figmaPin"); bp = x.get("livePin")
            fl.append([x["num"], x["id"], x["element"], x["severity"], x["axis"],
                       x.get("figma", ""), x.get("live", ""), x.get("fix", ""),
                       x.get("scope", "Screen"),
                       [round(dp["x"] * COL / 100.0), round(dp["y"] * d["cropH"] / 100.0)] if dp else None,
                       [round(bp["x"] * COL / 100.0), round(bp["y"] * b["cropH"] / 100.0)] if bp else None])
        route = (s.get("liveUrl") or "").split(".in", 1)[-1] or "/"
        boards.append({"slug": slug, "name": s["name"], "sev": f0["severity"], "d": d, "b": b,
                       "f": fl, "figmaUrl": s.get("figmaUrl"), "liveUrl": s.get("liveUrl"),
                       "route": route, "sub": f0.get("subO") or "", "note": s.get("note") or ""})

    boards.sort(key=lambda x: (0 if x["f"][0][8] == "Global" else 1,
                               SEV.get(x["sev"], 9), x["slug"]))
    out = {"boards": boards, "coverage": coverage,
           "counts": {k: sum(1 for x in am["screens"] for f in x["findings"] if f["severity"] == k)
                      for k in ("Blocker", "Major", "Minor", "Nit")}}
    p = os.path.join(HERE, "sheet", "report_spec.json")
    json.dump(out, open(p, "w"), separators=(",", ":"))
    miss = [x["slug"] for x in boards if x["d"] and not x["d"]["hash"]]
    print(f"{len(boards)} boards ({sum(1 for x in boards if x['f'][0][8]=='Global')} global), "
          f"{len(coverage)} coverage thumbs, {os.path.getsize(p)} bytes")
    print("missing image hash:", miss or "none")
    # per-batch payloads, small enough to inline in a use_figma call
    B = 6
    os.makedirs(os.path.join(HERE, "sheet", "rpayload"), exist_ok=True)
    for i in range(0, len(boards), B):
        q = os.path.join(HERE, "sheet", "rpayload", f"r{i//B+1}.json")
        json.dump(boards[i:i + B], open(q, "w"), separators=(",", ":"))
        print(f"  r{i//B+1}: {len(boards[i:i+B])} boards, {os.path.getsize(q)} bytes")
    return 0


if __name__ == "__main__":
    sys.exit(main())
