#!/usr/bin/env python3
"""Phase-0 design element dump for every PAIRED frame, via the Figma REST API.

Why REST and not `use_figma`: the MCP response is capped at ~20KB, and a single NMBA screen
frame carries 190-640 text nodes. Two frames overflow it, and an overflowed response is
truncated rather than refused — which is the same class of silent-truncation bug that
engine/figma_dump.js exists to prevent. REST returns the whole tree per frame.

The integrity contract is identical to figma_dump.js and engine/claims.py reads it the same way:
each frame carries `_meta.pageLoaded`, `_meta.totalText`, `_meta.offCanvas`, `_meta.noRender`.
Writes inputs/design-elements.json.
"""
import json, os, sys, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
FILE_KEY = "evmNmlK8g4VYwJVu2FwSGV"
TOK = os.environ.get("FIGMA_ACCESS_TOKEN")
MIN_FS = 8          # below this it is the SAMAVESH wordmark's per-character vector text, not UI


def slug_of(fr):
    role = fr["name"].split("/")[0]
    r = (fr.get("route") or "/").strip("/").replace("/", "-") or "home"
    return (role + "-" + r).upper()


def hexof(fills):
    for f in (fills or []):
        if f.get("type") == "SOLID" and f.get("visible", True):
            c = f["color"]
            return "#" + "".join("%02x" % round(c[k] * 255) for k in ("r", "g", "b"))
    return None


def walk(node, F, out, counts):
    if node.get("type") == "TEXT":
        counts["total"] += 1
        bb = node.get("absoluteBoundingBox")
        rb = node.get("absoluteRenderBounds")
        if rb is None:
            counts["noRender"] += 1
        b = rb or bb
        if b:
            x, y = round(b["x"] - F["x"]), round(b["y"] - F["y"])
            if x < 0 or x > round(F["width"]) or y < 0 or y > round(F["height"]):
                counts["offCanvas"] += 1
            st = node.get("style") or {}
            fs = st.get("fontSize") or 0
            t = (node.get("characters") or "").replace("\n", " ").strip()
            if rb is not None and t and fs >= MIN_FS:
                out.append({"t": t[:70], "x": x, "y": y,
                            "w": round(b["width"]), "h": round(b["height"]),
                            "fs": round(fs, 1), "st": st.get("fontPostScriptName") or st.get("fontWeight"),
                            "fam": st.get("fontFamily"), "c": hexof(node.get("fills"))})
    for c in node.get("children", []) or []:
        walk(c, F, out, counts)


def main():
    if not TOK:
        sys.exit("FIGMA_ACCESS_TOKEN is not set")
    frames = json.load(open(os.path.join(HERE, "inputs", "figma-frames.json")))
    paired = [f for f in frames if f.get("node_id") and not f.get("_designOnly")]
    res = {}
    ids = [f["node_id"] for f in paired]
    for i in range(0, len(ids), 8):
        chunk = ",".join(ids[i:i + 8])
        url = f"https://api.figma.com/v1/files/{FILE_KEY}/nodes?ids={chunk}&geometry=paths"
        req = urllib.request.Request(url, headers={"X-Figma-Token": TOK})
        data = json.load(urllib.request.urlopen(req, timeout=180))
        for f in paired[i:i + 8]:
            doc = (data["nodes"].get(f["node_id"]) or {}).get("document")
            if not doc:
                print("  ! no document for", f["node_id"], f["name"]); continue
            F = doc["absoluteBoundingBox"]
            els, counts = [], {"total": 0, "offCanvas": 0, "noRender": 0}
            walk(doc, F, els, counts)
            res[slug_of(f)] = {
                "_meta": {"pageLoaded": True, "node": f["node_id"], "name": f["name"],
                          "frame": [round(F["width"]), round(F["height"])],
                          "totalText": counts["total"], "offCanvas": counts["offCanvas"],
                          "noRender": counts["noRender"]},
                "elements": els}
            print(f'  {slug_of(f):50s} text={counts["total"]:4d} offCanvas={counts["offCanvas"]:3d} kept={len(els)}')
    p = os.path.join(HERE, "inputs", "design-elements.json")
    json.dump(res, open(p, "w"), indent=1)
    print(f"\n{len(res)} frames -> {p}")
    thin = [k for k, v in res.items() if v["_meta"]["totalText"] < 80]
    print("BELOW THE 80-NODE GATE FLOOR:", thin or "none")


if __name__ == "__main__":
    main()
