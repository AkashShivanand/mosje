#!/usr/bin/env python3
"""Prove a proposed fix by rendering it, instead of describing it.

WHY THIS EXISTS
---------------
Every report this engine has produced put a DESIGN panel beside a BUILD panel, and the reader
judged the gap for themselves. A portal with no design frames has nothing to put in the left
panel, and the usual substitute — a paragraph of prose saying what the developer should change —
is the weakest artefact in the whole pipeline. It asks the reader to imagine the fix, and it lets
a fix that would not actually work read exactly like one that would.

So the left panel becomes PROPOSED: the same live screen, re-rendered with the fix applied as a
CSS patch. The reader sees before and after of the real page, and the developer gets a patch they
can paste. A fix nobody can render is a fix nobody should have shipped as advice.

THE GATE, and it is the reason this is a module and not a shell script
---------------------------------------------------------------------
Two ways a preview lies, both of which have precedents in this ledger:

  1. THE NO-OP. The patch changes nothing — a selector that matches no element, a property the
     cascade overrides, a value equal to the current one — and the AFTER image is byte-identical
     to the BEFORE. Rendered side by side at report scale nobody notices, and the report then
     recommends a change that does nothing. This is the same failure as the silent no-op tab
     click that reused an image hash (audit-rules.md I). A preview whose hash is unchanged FAILS.

  2. THE COLLATERAL. The patch fixes its target and moves half the page doing it — the classic
     being a padding or font-size change on a shared class. `gate_capture_layout` already taught
     the engine that a capture whose elements moved sideways has stopped describing the page. The
     same measurement applies here: elements OUTSIDE the patch's target must not move. A preview
     that shifts unrelated elements beyond tolerance FAILS, and says which ones moved.

Both are asked of evidence the module actually holds — the two images and the two geometry
readings, taken in one browser session at one viewport. That is the standing question this ledger
puts to every gate: what would it need to see to be sure, and does it see it?

A finding declares its fix in `audit-master.json`:

    "_fix": {
      "selector": ".sa-kpi-card",          # what the patch targets; also the collateral scope
      "css": ".sa-kpi-card { border-color: #dcdee1; }",
      "why": "border/neutral/subtle is the published token for a card edge"
    }

Run:  python3 engine/fixpreview.py --project pm-ajay              # every finding with a _fix
      python3 engine/fixpreview.py --project pm-ajay --id PMA-007
"""
import argparse, hashlib, json, os, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import config as C
import capture as CAP

#: A patched element is expected to move — that is the point. Anything else must hold still.
#: 2px absorbs sub-pixel reflow and font-hinting jitter without hiding a real shove.
COLLATERAL_TOLERANCE_PX = 2.0
#: Report at most this many moved elements; the count is what matters, not the list.
COLLATERAL_REPORT = 8

GEOMETRY_JS = r"""(sel) => {
  // Measure every element that carries text or is interactive, keyed by a stable-ish identity.
  // Descendants of the patch target are EXCLUDED: they are meant to move.
  const target = sel ? Array.from(document.querySelectorAll(sel)) : [];
  const inTarget = (el) => target.some(t => t === el || t.contains(el));
  const out = {};
  const nodes = document.querySelectorAll('a,button,input,select,textarea,h1,h2,h3,h4,h5,h6,td,th,li,p,span,label');
  let i = 0;
  for (const el of nodes) {
    if (inTarget(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) continue;
    const t = (el.textContent || '').trim().slice(0, 40);
    if (!t) continue;
    const key = el.tagName + '|' + t + '|' + (i++);
    out[key] = [Math.round(r.left + window.scrollX), Math.round(r.top + window.scrollY)];
    if (i > 400) break;
  }
  return out;
}"""


def md5(path):
    h = hashlib.md5()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def collateral(before, after, tolerance=COLLATERAL_TOLERANCE_PX):
    """Elements outside the patch target that moved. Keys absent from either side are ignored —
    a node that appeared or vanished is a content difference, not a measurable shift."""
    moved = []
    for key, (x0, y0) in before.items():
        pos = after.get(key)
        if not pos:
            continue
        dx, dy = abs(pos[0] - x0), abs(pos[1] - y0)
        if dx > tolerance or dy > tolerance:
            moved.append({"element": key.rsplit("|", 1)[0], "dx": dx, "dy": dy})
    moved.sort(key=lambda m: -(m["dx"] + m["dy"]))
    return moved


def preview_one(pg, cfg, role, finding, out_dir, width, dpr):
    """BEFORE, patch, AFTER — in one page load, so the two images are comparable by construction."""
    fid = finding["id"]
    fix = finding["_fix"]
    route = finding.get("_route") or finding.get("route")
    if not route:
        return {"id": fid, "gate": "SKIP", "why": "finding declares no _route to render"}

    CAP.navigate(pg, role["base"], route, cfg, cfg["live"]["auth"], role,
                 waitms=cfg.get("capture", {}).get("waitMs", 2000))
    CAP.wait_for_data(pg)
    page_h = CAP.settle_height(pg, CAP.UNCLIP_JS, width=width, base_h=1000)

    before_png = os.path.join(out_dir, f"{fid}-before.png")
    after_png = os.path.join(out_dir, f"{fid}-after.png")

    geo_before = pg.evaluate(GEOMETRY_JS, fix.get("selector") or "")
    CAP.shoot(pg, before_png, page_h, dpr, width)

    # Apply the patch as a LAST stylesheet so it wins on order without !important — a patch that
    # needs !important to land is not a fix a developer can adopt, and saying so is useful.
    matched = pg.evaluate(
        """([css, sel]) => {
             const s = document.createElement('style');
             s.id = '__sa_fixpreview__';
             s.textContent = css;
             document.head.appendChild(s);
             return sel ? document.querySelectorAll(sel).length : null;
           }""",
        [fix["css"], fix.get("selector") or ""])
    pg.wait_for_timeout(900)
    page_h_after = CAP.settle_height(pg, CAP.UNCLIP_JS, width=width, base_h=1000)
    geo_after = pg.evaluate(GEOMETRY_JS, fix.get("selector") or "")
    CAP.shoot(pg, after_png, max(page_h, page_h_after), dpr, width)

    rec = {"id": fid, "route": route, "role": role["name"],
           "selector": fix.get("selector"), "css": fix["css"], "why": fix.get("why"),
           "before": os.path.basename(before_png), "after": os.path.basename(after_png),
           "matchedElements": matched,
           "beforeHash": md5(before_png), "afterHash": md5(after_png)}

    fails = []
    if matched == 0:
        fails.append("the selector matched NO element on this screen — the patch cannot apply")
    if rec["beforeHash"] == rec["afterHash"]:
        fails.append("the patch changed NOTHING: before and after are byte-identical. Either the "
                     "selector misses, the cascade overrides it, or the value already applies")
    moved = collateral(geo_before, geo_after)
    rec["collateral"] = moved[:COLLATERAL_REPORT]
    rec["collateralCount"] = len(moved)
    if moved:
        fails.append(f"the patch moved {len(moved)} element(s) OUTSIDE its target — "
                     f"worst: {moved[0]['element']} by {moved[0]['dx']}x{moved[0]['dy']}px")
    rec["gate"] = "FAIL" if fails else "PASS"
    rec["failures"] = fails
    return rec


def run(project, only_id=None):
    cfg, paths = C.load(project)
    master_path = os.path.join(paths["out"], "audit-master.json")
    if not os.path.exists(master_path):
        sys.exit(f"! {master_path} missing — run the analyze phase first.")
    master = json.load(open(master_path))

    findings = []
    for sec in master.get("sections", []):
        for f in sec.get("findings", []) if isinstance(sec, dict) else []:
            if f.get("_fix") and (not only_id or f.get("id") == only_id):
                findings.append(f)
    for f in master.get("findings", []) or []:
        if f.get("_fix") and (not only_id or f.get("id") == only_id):
            findings.append(f)
    if not findings:
        print("  no finding declares a `_fix` — nothing to preview.")
        return {"previews": [], "gate": "SKIP",
                "why": "no finding declares a _fix block"}

    out_dir = os.path.join(paths["out"], "fixpreview")
    os.makedirs(out_dir, exist_ok=True)
    roles = {r["name"]: r for r in cfg["live"]["roles"]}
    width = cfg.get("capture", {}).get("width", 1440)
    dpr = cfg.get("capture", {}).get("dpr", 2)

    # Group by role so each role logs in ONCE and every preview for it runs in that session —
    # the keep-alive lesson from audit-rules.md I, and admin logins share an IP rate-limiter.
    by_role = {}
    for f in findings:
        by_role.setdefault(f.get("_role") or f.get("role"), []).append(f)

    from playwright.sync_api import sync_playwright
    out = []
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="chrome", headless=True)
        for role_name, group in by_role.items():
            role = roles.get(role_name)
            if not role:
                for f in group:
                    out.append({"id": f["id"], "gate": "SKIP",
                                "why": f"finding names role {role_name!r}, which the config has no entry for"})
                continue
            ctx = browser.new_context(viewport={"width": width, "height": 1000},
                                      device_scale_factor=dpr)
            pg = ctx.new_page()
            auth = cfg["live"]["auth"]
            auth["_paths"] = paths
            if role.get("auth") != "none":
                if not CAP.do_login(pg, role, auth):
                    for f in group:
                        out.append({"id": f["id"], "gate": "SKIP",
                                    "why": f"role {role_name!r} has no usable credentials"})
                    ctx.close()
                    continue
            for f in group:
                try:
                    out.append(preview_one(pg, cfg, role, f, out_dir, width, dpr))
                    print(f"  {out[-1]['gate']:4} {f['id']}", flush=True)
                except Exception as e:
                    out.append({"id": f["id"], "gate": "FAIL",
                                "failures": [f"preview raised: {type(e).__name__}: {e}"]})
                    print(f"  FAIL {f['id']} — {type(e).__name__}: {e}", flush=True)
            ctx.close()
        browser.close()

    rep = {
        "previews": out,
        "counts": {
            "total": len(out),
            "passed": sum(1 for r in out if r.get("gate") == "PASS"),
            "failed": sum(1 for r in out if r.get("gate") == "FAIL"),
            "skipped": sum(1 for r in out if r.get("gate") == "SKIP"),
        },
        "gate": "FAIL" if any(r.get("gate") == "FAIL" for r in out) else "PASS",
        "note": ("A PROPOSED panel replaces the DESIGN panel on a portal with no design frames. "
                 "PASS means the patch demonstrably changed the target and moved nothing else. "
                 "FAIL means the recommendation is not safe to ship as written — a no-op patch or "
                 "one with collateral reflow is worse than no recommendation, because it reads "
                 "exactly like a working one."),
    }
    with open(os.path.join(paths["out"], "fixpreview.json"), "w") as f:
        json.dump(rep, f, indent=2)
    c = rep["counts"]
    print(f"  fix previews: {c['passed']} passed · {c['failed']} failed · {c['skipped']} skipped "
          f"-> out/fixpreview.json")
    return rep


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--project", required=True)
    ap.add_argument("--id", default=None, help="preview only this finding id")
    a = ap.parse_args()
    rep = run(a.project, a.id)
    sys.exit(1 if rep.get("gate") == "FAIL" else 0)


if __name__ == "__main__":
    main()
