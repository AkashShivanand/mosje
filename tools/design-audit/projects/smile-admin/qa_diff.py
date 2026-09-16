#!/usr/bin/env python3
"""Element-level design-vs-build diff for SMILE-Beggary.

Why this exists: reading two screenshots side by side finds the loud differences and misses the
quiet ones. This matches every piece of TEXT that appears in BOTH the design frame and the build
capture and compares what was actually measured on each side — font size, weight, colour,
horizontal position — so a 13px-instead-of-14px label cannot hide.

The non-hallucination rule: a style delta is only reported for text that EXISTS ON BOTH SIDES.
Matched text is UI copy by construction — a mockup's placeholder data and a live database's rows
do not coincidentally read the same — so these comparisons are like-for-like. Text present on only
one side is reported separately, as a question, never as a styled assertion.

Inputs : inputs/design-elements.json  (from the Figma API, per frame)
         captures/live/<SLUG>.json    (computed CSS from the live capture)
Output : out/qa-diff.json + a printed summary
"""
import json, os, re, sys, collections

HERE = os.path.dirname(os.path.abspath(__file__))
LIVE = os.path.join(HERE, "captures", "live")

# Text that is DATA, not interface copy. Excluded from the "present on one side only" list,
# because a design mockup's sample rows and the live build's rows will never match and reporting
# them would bury the real findings in hundreds of names and numbers.
DATA = re.compile(r'^[\s\d.,%₹+\-/:()]*$'                       # pure numbers/punctuation
                  r'|^\d{1,2} [A-Z][a-z]{2} \d{4}$'             # 23 Aug 2026
                  r'|^\d{2}/\d{2}/\d{4}$'
                  r'|@'                                          # emails
                  r'|^\+?\d[\d\s-]{7,}$', re.I)                  # phone numbers

def norm(t):
    return re.sub(r'\s+', ' ', (t or '')).strip().lower()

def load_design():
    p = os.path.join(HERE, "inputs", "design-elements.json")
    return json.load(open(p)) if os.path.exists(p) else {}

def load_build(slug):
    p = os.path.join(LIVE, f"{slug}.json")
    if not os.path.exists(p): return None
    d = json.load(open(p))
    rows = []
    for r in (d.get("rows") or []):
        x, w = r.get("x"), r.get("w")
        if not isinstance(x, (int, float)) or not isinstance(w, (int, float)): continue
        if x < 0 or x + w > 1441: continue          # off-canvas third-party chrome
        rows.append(r)
    return rows

def hexof(c):
    c = (c or "").strip()
    if c.startswith("#"): return c.lower()
    m = re.findall(r'\d+', c)
    return "#%02x%02x%02x" % (int(m[0]), int(m[1]), int(m[2])) if len(m) >= 3 else c

def main():
    design = load_design()
    if not design:
        print("inputs/design-elements.json missing — run the Figma dump first"); return
    findings, unmatched_design, unmatched_build = [], [], []
    stats = collections.Counter()

    for slug, spec in design.items():
        brows = load_build(slug)
        if brows is None:
            print(f"  ! no build capture for {slug}"); continue
        drows = spec["rows"]
        bidx = collections.defaultdict(list)
        for r in brows: bidx[norm(r.get("text"))].append(r)
        used = set()

        for d in drows:
            k = norm(d["ch"])
            if not k or len(k) < 2: continue
            cands = bidx.get(k)
            if not cands:
                if not DATA.match(d["ch"].strip()):
                    unmatched_design.append({"slug": slug, "text": d["ch"][:60],
                                             "fs": d["fs"], "box": [d["x"], d["y"]]})
                continue
            # nearest by y, so a label repeated down a table pairs row-for-row
            b = min(cands, key=lambda r: abs((r.get("y") or 0) - d["y"]))
            used.add(id(b))
            stats["matched"] += 1

            dfs, bfs = d.get("fs"), b.get("fontSize")
            if dfs and bfs and dfs != bfs:
                findings.append(dict(slug=slug, kind="font-size", text=d["ch"][:60],
                                     design=f"{dfs}px", build=f"{bfs}px",
                                     delta=bfs - dfs, box=[b.get("x"), b.get("y"), b.get("w"), b.get("h")]))
            dcol, bcol = (d.get("fill") or "").lower(), hexof(b.get("color"))
            if dcol and bcol and dcol != bcol:
                findings.append(dict(slug=slug, kind="colour", text=d["ch"][:60],
                                     design=dcol, build=bcol,
                                     box=[b.get("x"), b.get("y"), b.get("w"), b.get("h")]))
            dw, bw = d.get("fw"), b.get("fontWeight")
            if dw and bw and str(dw) != str(bw):
                findings.append(dict(slug=slug, kind="font-weight", text=d["ch"][:60],
                                     design=str(dw), build=str(bw),
                                     box=[b.get("x"), b.get("y"), b.get("w"), b.get("h")]))
            dfam, bfam = (d.get("fam") or ""), (b.get("fontFamily") or "")
            if dfam and bfam and dfam.split(",")[0].strip().lower() != bfam.split(",")[0].strip().lower():
                findings.append(dict(slug=slug, kind="font-family", text=d["ch"][:60],
                                     design=dfam, build=bfam,
                                     box=[b.get("x"), b.get("y"), b.get("w"), b.get("h")]))
            dx, bx = d.get("x"), b.get("x")
            if dx is not None and bx is not None and abs(bx - dx) >= 12:
                findings.append(dict(slug=slug, kind="x-position", text=d["ch"][:60],
                                     design=f"x={dx}", build=f"x={bx}", delta=bx - dx,
                                     box=[b.get("x"), b.get("y"), b.get("w"), b.get("h")]))

        for r in brows:
            if id(r) in used: continue
            t = (r.get("text") or "").strip()
            if not t or len(t) < 2 or DATA.match(t): continue
            if (r.get("y") or 0) < 130: continue         # shared masthead, judged separately
            unmatched_build.append({"slug": slug, "text": t[:60], "fs": r.get("fontSize"),
                                    "tag": r.get("tag"), "box": [r.get("x"), r.get("y")]})

    for f in findings: stats[f["kind"]] += 1
    out = dict(findings=findings, designOnly=unmatched_design, buildOnly=unmatched_build,
               stats=dict(stats))
    os.makedirs(os.path.join(HERE, "out"), exist_ok=True)
    json.dump(out, open(os.path.join(HERE, "out", "qa-diff.json"), "w"), indent=1)
    print(f"matched text elements: {stats['matched']}")
    print(f"style discrepancies:   {len(findings)}")
    for k, v in sorted(stats.items()):
        if k != "matched": print(f"    {k:<14} {v}")
    print(f"design-only text:      {len(unmatched_design)}  (candidate missing elements)")
    print(f"build-only text:       {len(unmatched_build)}   (candidate additions)")

if __name__ == "__main__":
    main()
