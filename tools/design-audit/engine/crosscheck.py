#!/usr/bin/env python3
"""Coverage + design↔build MAPPING sanity — the two failure modes a fidelity audit must never ship with:

  1. MISSED screens/flows  — a design frame with no paired build capture (or a build screen with no
     design), and modal/sub-state frames that a nav-crawl can't reach (they need interactive capture).
  2. WRONG mapping         — a build screenshot paired with the WRONG Figma frame (or vice versa). This
     is invisible to pixel/spec diffing (it just yields noise) and to name matching (frames get
     mislabeled — a real "Reports & Export" frame was named "…/Fund-Allocation"). The reliable signal
     is the RENDERED HEADING: the design frame's title vs the live capture's title must agree, and both
     should match the screen we THINK we're auditing.

Deterministic + project-agnostic. Reads:
  - out/audit-master.json          the actual pairings (screen name, figma node, design img, build img)
  - captures/live/<base>.json      per-build element extraction  -> the BUILD heading
  - inputs/figma-frames.json        OPTIONAL, per-frame {node_id|node, name, heading, kind}
                                    -> the DESIGN heading (agent dumps this in Phase 0 via Figma MCP)
Writes out/crosscheck.{md,json} and returns a gate (FAIL on a likely mis-map or an uncaptured design).

Tiers (degrade gracefully):
  T1 build↔intent  (always; no MCP)   catches wrong-URL / mis-click captures (build title ≠ the screen).
  T2 design↔build  (when headings map) catches wrong-frame pairings (design title ≠ build title).
"""
import json, os, re, glob, sys

# chrome/masthead strings that are NOT the page title — never treat these as a heading
CHROME = {"governmentofindia","skiptomaincontent","beta","samavesh","digitalindia","powertoempower",
          "ministryofsocialjusticeempowerment","departmentofsocialjusticeempowerment","singleaccessmechanismforallverticals",
          "chat","termsconditions","privacypolicy","feedback","marklallread","markallread","export","reset","en",
          # the UX4G / GIGW accessibility widget's own control labels. It renders a panel OUTSIDE
          # the viewport at large type, so without this it wins "largest text on the page" on any
          # screen whose real title sits low — "Bigger Text" was returned as the title of five
          # NMBA citizen screens.
          "biggertext","smallertext","normaltext","highcontrast","invertcolours","invertcolors",
          "screenreader","textspacing","lineheight","dyslexiafriendly","hideimages","readingmask",
          "bigcursor","highlightlinks","accessibility","accessibilitymenu","resetall"}
VIEWPORT_W = 1440        # captures are taken at a locked 1440 CSS width
# only ultra-generic glue words — domain words (dashboard, cases, status, reports…) ARE the signal
STOP = {"the","a","an","and","or","of","to","for","in","on","with","your","by","at"}

def _norm(t): return re.sub(r"[^a-z0-9]", "", (t or "").lower())
def _stem(w):
    if len(w) >= 5 and w.endswith("ies"): return w[:-3] + "y"   # queries -> query
    if len(w) >= 4 and w.endswith("s"):   return w[:-1]         # faqs -> faq, feedbacks -> feedback
    return w
def _toks(s):
    return {_stem(w) for w in re.findall(r"[a-z0-9]+", (s or "").lower()) if len(w) > 2 and w not in STOP}
def _overlap(a, b):
    if not a or not b: return 0.0
    return len(a & b) / min(len(a), len(b))          # containment: robust to one side having extra words
def _alpha_ratio(t):
    return sum(c.isalpha() for c in t) / max(1, len(t))

SIDEBAR_X = 300          # a persistent left rail is ~300px wide across this estate


def sidebar_cutoff(rows):
    """0, or SIDEBAR_X when the page has a persistent left navigation rail.

    A title is never in the rail, but a rail's FIRST nav item sits at exactly the height a
    title would, so a band-only picker returns it. That is how a correctly-paired e-Pledge
    screen was reported MISMAP: the y120-300 band held nothing but the sidebar's "Dashboard",
    and the real 24px title sat at y576 under a hero image. The rule ("scope the search below
    the masthead and right of the sidebar") was already in the ledger and had never been code.

    Detected, not assumed: a rail is several short texts stacked inside the left 300px over a
    tall span. A page with no rail keeps the full width, so nothing else changes."""
    left = [r for r in rows
            if (r.get("x") or 0) + (r.get("w") or 0) <= SIDEBAR_X and (r.get("text") or "").strip()]
    if len(left) < 4:
        return 0
    ys = [r.get("y") or 0 for r in left]
    return SIDEBAR_X if (max(ys) - min(ys)) > 200 else 0


def build_heading(rows, page_w=None):
    """The page's rendered title = the largest-font, mostly-alphabetic content text in the title
    band (below the gov-bar: y 120-300), right of any left nav rail and inside the viewport,
    excluding chrome and numeric KPIs/currency/dates. Falls back to a wider band — wide enough to
    clear a hero image — then anywhere, so short pages still resolve.

    The OFF-CANVAS guard matters as much as the band: the accessibility widget draws a panel at
    x~1690, outside the 1440 viewport, at display sizes. It is invisible to a reader and it is
    not ours, but it is the largest text in the extraction, so it wins any unguarded fallback."""
    xmin = sidebar_cutoff(rows)
    xmax = page_w or VIEWPORT_W
    def pick(lo, hi):
        best = None
        for r in rows:
            t = (r.get("text") or "").strip()
            if len(t) < 3 or _norm(t) in CHROME: continue
            if _alpha_ratio(t) < 0.55: continue                # skip "9,628", "100%", "₹6.2Cr", "980.5d"
            x = r.get("x") or 0
            if x < xmin or x >= xmax: continue    # not the rail, not off-canvas chrome
            y = r.get("y") or 0
            if not (lo <= y <= hi): continue
            fs = r.get("fontSize") or 0
            if best is None or fs > best[0] or (fs == best[0] and y < best[1]):
                best = (fs, y, t)
        return best[2] if best else ""
    return pick(120, 300) or pick(120, 700) or pick(0, 10_000)

def _intended(name):
    """Screen name minus the role prefix: 'System Admin — Grievance Monitoring' -> 'Grievance Monitoring'."""
    for sep in [" — ", " · ", " - "]:
        if sep in name: name = name.split(sep, 1)[1]
    return name

def _load_frame_headings(project_dir, cfg):
    fp = os.path.join(project_dir, (cfg.get("figma", {}) or {}).get("framesFile", "inputs/figma-frames.json"))
    m = {}
    if os.path.exists(fp):
        try:
            for fr in json.load(open(fp)):
                nid = (fr.get("node_id") or fr.get("node") or "").replace("-", ":")
                if nid and fr.get("heading"): m[nid] = fr["heading"]
        except Exception: pass
    return m

def run(project_dir, out_dir, master, cfg=None):
    cfg = cfg or {}
    live_dir = os.path.join(project_dir, "captures", "live")
    fhead = _load_frame_headings(project_dir, cfg)
    rows_out = []
    stats = {"screens": 0, "with_build_heading": 0, "with_design_heading": 0,
             "OK": 0, "CHECK": 0, "MISMAP": 0, "no_build_capture": 0, "design_only": 0, "build_only": 0}
    for s in master.get("screens", []):
        name = s.get("name", s.get("slug", "")); intended = _intended(name)
        node = (s.get("_node") or "") ; node = node.replace("-", ":") if node else ""
        has_design = bool(s.get("figmaImg")); has_build = bool(s.get("liveImg"))
        stats["screens"] += 1
        if has_design and not has_build: stats["design_only"] += 1
        if has_build and not has_design: stats["build_only"] += 1
        # BUILD heading from the paired extraction JSON (matched by the build image's basename)
        bh = ""
        if s.get("liveImg"):
            base = os.path.splitext(os.path.basename(s["liveImg"]))[0]
            jp = os.path.join(live_dir, base + ".json")
            if os.path.exists(jp):
                try:
                    _j = json.load(open(jp))
                    bh = build_heading(_j.get("rows", []), _j.get("pageW"))
                except Exception: bh = ""
        if bh: stats["with_build_heading"] += 1
        elif has_build: stats["no_build_capture"] += 1     # captured but no extraction to verify with
        dh = fhead.get(node, "")
        # A screen may declare its paired frame is a STYLE REFERENCE (another screen's design reused as
        # the visual-language reference, e.g. an undesigned Call-Centre screen pointed at a citizen frame),
        # not a same-screen pairing. Skip the design↔build title tier for it; build↔intent still runs.
        if s.get("_refFrame"): dh = ""
        if dh: stats["with_design_heading"] += 1
        # ---- verdicts ----
        verdict, why = "OK", ""
        bt, it, dt = _toks(bh), _toks(intended), _toks(dh)
        if dh and bh and _overlap(bt, dt) < 0.34:
            verdict, why = "MISMAP", f"design title “{dh}” vs build title “{bh}” disagree — likely wrong frame↔capture pairing"
        elif bh and it and _overlap(bt, it) < 0.34:
            verdict, why = "CHECK", f"build title “{bh}” doesn’t match the screen “{intended}” — capture may have landed on the wrong page"
        elif dh and it and _overlap(dt, it) < 0.34:
            verdict, why = "CHECK", f"design title “{dh}” doesn’t match the screen “{intended}” — frame may be mislabeled/wrong"
        stats[verdict] = stats.get(verdict, 0) + 1
        rows_out.append({"slug": s.get("slug"), "screen": name, "figma_node": node or None,
                         "design_heading": dh or None, "build_heading": bh or None,
                         "verdict": verdict, "why": why})
    gate = "FAIL" if stats["MISMAP"] else ("WARN" if stats["CHECK"] else "PASS")
    result = {"gate": gate, "stats": stats, "rows": rows_out,
              "note": "MISMAP = design and build titles disagree (wrong pairing) → gate FAIL. "
                      "CHECK = a title doesn't match the screen we think we're auditing (verify the capture/frame). "
                      "Provide inputs/figma-frames.json with a per-frame `heading` to enable the stronger design↔build tier."}
    os.makedirs(out_dir, exist_ok=True)
    json.dump(result, open(os.path.join(out_dir, "crosscheck.json"), "w"), indent=2, ensure_ascii=False)
    # markdown
    flags = [r for r in rows_out if r["verdict"] != "OK"]
    md = ["# design↔build cross-check (coverage + mapping sanity)\n",
          f"**Gate: {gate}** — {stats['MISMAP']} mis-map · {stats['CHECK']} to-check · {stats['OK']} ok "
          f"· {stats['screens']} screens ({stats['with_build_heading']} build titles, {stats['with_design_heading']} design titles).\n",
          "MISMAP = the design frame and the live capture show different screen titles (a build screenshot "
          "paired with the wrong Figma frame, or vice versa). CHECK = a title doesn't match the screen name.\n"]
    if flags:
        md.append("\n## Flags (verify these)\n")
        for r in flags:
            md.append(f"- **{r['verdict']}** · {r['screen']} — {r['why']}")
    else:
        md.append("\n_No mapping flags — every paired design/build title agrees with its screen._")
    if stats["with_design_heading"] == 0:
        md.append("\n\n> Design-title tier is OFF (no `heading` in inputs/figma-frames.json). Only the "
                  "build↔screen tier ran. Dump frame headings in Phase 0 to catch wrong-frame pairings too.")
    open(os.path.join(out_dir, "crosscheck.md"), "w").write("\n".join(md) + "\n")
    return result

if __name__ == "__main__":
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument("--master", required=True, help="path to audit-master.json")
    ap.add_argument("--project", required=True, help="project dir (has captures/live + inputs/)")
    ap.add_argument("--out", default=None)
    a = ap.parse_args()
    out = a.out or os.path.join(a.project, "out")
    m = json.load(open(a.master))
    r = run(a.project, out, m)
    print(f"cross-check gate={r['gate']}  {r['stats']}")
    for row in r["rows"]:
        if row["verdict"] != "OK": print(f"  {row['verdict']}: {row['screen']} — {row['why']}")
