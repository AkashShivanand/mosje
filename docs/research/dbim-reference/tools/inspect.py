#!/usr/bin/env python3
"""
Print the computed-style tree of a captured DBIM reference page, compactly.

The captures (1440px wide, taken 25 Sep 2026 from master-socialjustice.digifootprint.gov.in)
live outside the repo in the session scratchpad; pass their folder with --ref.

  inspect.py --ref <dir> <page> [--y 180:700] [--cls pm-quote] [--text "About Us"] [--depth 6]

  <page>   file stem under <dir>/styles, e.g. home, ministry_our_team, offerings
  --y      only nodes whose top edge falls in this page-Y range (px at 1440 wide)
  --cls    only subtrees rooted at a node whose class contains this substring
  --text   only subtrees rooted at the nearest block ancestor of a node with this text
  --depth  levels to print below each root (default 6)

Every value is getComputedStyle() at 1440 px, which is inside the reference's
1280–1536 bucket — the type scale there is the SMALLER one (p 14px, h2 20px).
"""
import argparse, json, os, sys

KEEP = ["display", "position", "width", "height", "maxWidth", "paddingTop", "paddingRight", "paddingBottom",
        "paddingLeft", "marginTop", "marginRight", "marginBottom", "marginLeft", "gap", "flexDirection",
        "justifyContent", "alignItems", "gridTemplateColumns", "fontSize", "fontWeight", "lineHeight",
        "letterSpacing", "textTransform", "textAlign", "color", "backgroundColor", "backgroundImage",
        "borderTop", "borderRight", "borderBottom", "borderLeft", "borderRadius", "boxShadow", "objectFit",
        "opacity", "zIndex", "top", "left", "right", "bottom", "transition"]
DEFAULTS = {"color": "rgb(21, 2, 2)", "fontSize": "16px", "fontWeight": "400", "display": "block", "objectFit": "fill",
            "opacity": "1", "transition": "all", "flexDirection": "row", "textAlign": "start", "lineHeight": "24px"}


def fmt(n):
    s = n.get("s", {})
    parts = []
    for k in KEEP:
        v = s.get(k)
        if v is None or DEFAULTS.get(k) == v:
            continue
        if k.startswith("border") and ("0px none" in v or v.startswith("0px")):
            continue
        if k in ("width", "height") and n.get("tag") in ("span", "a", "p", "li") and "px" in v:
            v = str(round(float(v[:-2]))) + "px"
        parts.append(f"{k}={v}")
    head = f"<{n.get('tag')}{'.' + n['cls'].replace(' ', '.') if n.get('cls') else ''}> box={n.get('box')}"
    extra = []
    if n.get("t"):
        extra.append(f'text="{n["t"][:90]}"')
    if n.get("src"):
        extra.append(f"src={n['src'].split('/')[-1][:50]} alt={n.get('alt', '')[:40]!r}")
    if n.get("href"):
        extra.append(f"href={n['href'][:60]}")
    if n.get("svg"):
        extra.append(f"svg[{len(n['svg'])}b]")
    return head + ("  " + " ".join(extra) if extra else "") + ("\n      " + "; ".join(parts) if parts else "")


def emit(n, depth, maxd, out):
    if n.get("hidden"):
        return
    out.append("  " * depth + fmt(n))
    if depth < maxd:
        for c in n.get("c", []):
            emit(c, depth + 1, maxd, out)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("page"); ap.add_argument("--ref", required=True)
    ap.add_argument("--y"); ap.add_argument("--cls"); ap.add_argument("--text"); ap.add_argument("--depth", type=int, default=6)
    a = ap.parse_args()
    root = json.load(open(os.path.join(a.ref, "styles", a.page + ".json")))
    roots = []

    def find(n, anc):
        if not isinstance(n, dict) or n.get("hidden"):
            return False
        b = n.get("box") or [0, 0, 0, 0]
        if a.cls and a.cls in (n.get("cls") or ""):
            roots.append(n); return True
        if a.text and (n.get("t") or "").strip() == a.text:
            blk = next((x for x in reversed(anc) if (x.get("box") or [0, 0, 0, 0])[2] > 200), n)
            roots.append(blk); return True
        if a.y and not a.cls and not a.text:
            lo, hi = map(int, a.y.split(":"))
            if lo <= b[1] <= hi and b[3] > 0:
                roots.append(n); return True
        for c in n.get("c", []):
            find(c, anc + [n])
        return False

    if a.cls or a.text or a.y:
        find(root, [])
    else:
        roots = [root]
    out = []
    seen = set()
    for r in roots:
        if id(r) in seen:
            continue
        seen.add(id(r))
        emit(r, 0, a.depth, out)
        out.append("")
    sys.stdout.write("\n".join(out))


if __name__ == "__main__":
    main()
