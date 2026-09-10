#!/usr/bin/env python3
"""Run the claim gates over a project and write out/claims.md + out/evidence/*.png.

Inputs, all conventional so a project needs no wiring:
  <project>/sheet/anchors.json          the resolved BUILD anchors  {id: {slug, box, text, tag}}
  <project>/design_anchors.json         the DESIGN boxes            {id: {node, frameH, box}}
  <project>/inputs/design-elements.json the Phase-0 dump (engine/figma_dump.js)
  <project>/sheet/<slug>.design.png     the 1440-wide board images
  <project>/sheet/<slug>.build.png
  findings: audit-master.json if present, else findings_final.json

    python3 engine/claims_run.py --project smile-admin
    python3 engine/claims_run.py --project smile-admin --strict     # exit 2 on any failure
"""
import argparse, json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import claims as C

ENGINE = os.path.dirname(os.path.abspath(__file__))
PROJECTS = os.path.join(os.path.dirname(ENGINE), "projects")


def load_findings(proj, published=None):
    # the PUBLISHED master (docs/qc/portals/<name>/) is the deliverable and wins; out/ holds the
    # machine draft, which is a different, earlier set
    am = published if (published and os.path.exists(published)) else os.path.join(proj, "out", "audit-master.json")
    # `_anchorWhy` and `_evidenceWhy` MUST survive this projection. Both gates test for them on
    # the finding, and this function used to drop them - so the documented escape hatch could
    # never be exercised from findings_final.json, and a legitimately-unanchorable finding (an
    # icon-only button, a native <select>, a claim whose evidence is a checksum) had no way to
    # pass short of re-wording it to dodge the gate. Found on NMBA, 2026-09-11.
    def _why(src):
        return {k: src[k] for k in ("_anchorWhy", "_evidenceWhy") if src.get(k)}

    if os.path.exists(am):
        d = json.load(open(am))
        return [dict({"id": f["id"], "title": f.get("element"), "design": f.get("figma"),
                      "build": f.get("live")}, **_why(f))
                for s in d["screens"] for f in s["findings"]]
    ff = os.path.join(proj, "findings_final.json")
    if os.path.exists(ff):
        return [dict({"id": k["id"], "_old": k.get("old"), "title": k.get("title"),
                      "design": k.get("design"), "build": k.get("build")}, **_why(k))
                for k in json.load(open(ff))["kept"]]
    return []


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--project", required=True)
    ap.add_argument("--strict", action="store_true", help="exit 2 when a gate fails")
    ap.add_argument("--by-old-id", action="store_true",
                    help="anchors are keyed by the working id, findings by the published one")
    a = ap.parse_args()
    proj = os.path.join(PROJECTS, a.project)
    out = os.path.join(proj, "out")
    os.makedirs(out, exist_ok=True)

    def js(*p, default=None):
        f = os.path.join(proj, *p)
        return json.load(open(f)) if os.path.exists(f) else default

    repo = os.path.abspath(os.path.join(ENGINE, "..", "..", ".."))
    published = os.path.join(repo, "docs", "qc", "portals", a.project, "audit-master.json")
    findings = load_findings(proj, published)
    ba = js("sheet", "anchors.json", default={}) or {}
    da = js("design_anchors.json", default={}) or {}
    dump = js("inputs", "design-elements.json", default=None)
    cfg = js("audit.config.json", default={}) or {}
    allow = [tuple(p) for p in cfg.get("allowSharedAnchors", [])]

    if a.by_old_id:
        # anchors are keyed by the WORKING id (G02, S14); the published master uses SMB-… ids.
        # findings_final.json carries the mapping, so re-key rather than asking either side to change.
        fin = js("findings_final.json", default={}) or {}
        old_of = {k["id"]: k.get("old") for k in fin.get("kept", [])}
        # REBUILD the maps rather than adding aliases: keeping both keys made every anchor look
        # like a duplicate of itself and the duplicate gate reported 60 false positives
        nb, nd = {}, {}
        for f in findings:
            k = f.get("_old") or old_of.get(f["id"])
            if not k:
                continue
            if k in ba: nb[f["id"]] = ba[k]
            if k in da: nd[f["id"]] = da[k]
        ba, da = nb, nd

    def image_for(slug):
        return (os.path.join(proj, "sheet", f"{slug}.design.png"),
                os.path.join(proj, "sheet", f"{slug}.build.png"))

    fails, evidence = C.run_all(findings, ba, da, image_for,
                                os.path.join(out, "evidence"), design_dump=dump,
                                allow_shared=allow)

    by_class = {}
    for f in findings:
        for c in f["claims"]:
            by_class[c] = by_class.get(c, 0) + 1
    lines = ["# Claim gates", "",
             f"{len(findings)} findings · {len(evidence)} with a crop pair · "
             f"**{len(fails)} gate failure(s)**", "",
             "| claim class | findings | picture required |", "|---|---|---|"]
    for c in sorted(by_class):
        lines.append(f"| {c} | {by_class[c]} | {'yes' if c in C.NEEDS_PICTURE else 'no'} |")
    off = C.off_canvas_report(dump)
    if off:
        lines += ["", "## Design frames drawing outside themselves", "",
                  "Nothing outside a frame renders — not in the export, not in Dev Mode. Each of "
                  "these is a design-file defect waiting to be written up.", "",
                  "| frame | text nodes off-canvas | of |", "|---|---|---|"]
        lines += [f"| {slug} | **{n}** | {total} |" for n, slug, total in off]
    lines += ["", "## Failures", ""]
    lines += [f"- {f}" for f in fails] or ["_none_"]
    open(os.path.join(out, "claims.md"), "w").write("\n".join(lines) + "\n")

    print(f"{len(findings)} findings · {len(evidence)} crop pairs · {len(fails)} failure(s)"
          f"  -> out/claims.md, out/evidence/")
    for f in fails[:14]:
        print("   !", f)
    if len(fails) > 14:
        print(f"   … {len(fails) - 14} more in out/claims.md")
    return 2 if (fails and a.strict) else 0


if __name__ == "__main__":
    sys.exit(main())
