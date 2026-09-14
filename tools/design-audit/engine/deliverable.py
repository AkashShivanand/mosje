#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""The shape of a published Design QC deliverable - written down, generated, and checked.

Six portals had been published before this module existed and no two had the same shape: one had
a README, two had a markdown report, three committed the PDF generator's intermediate HTML, two
still carried their per-portal capture scripts. Everything downstream of that - a reviewer looking
for the report, a developer looking for the tracker tab - had to learn each portal separately.

    python3 engine/deliverable.py --check              # gate: every portal against the spec
    python3 engine/deliverable.py --write [--portal p] # generate README.md + DESIGN-QA-REPORT.md

Both the README and the markdown report are DERIVED from audit-master.json, so they cannot drift
from the PDF and the tracker, which read the same file.
"""
import argparse, collections, json, os, sys

ENGINE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(ENGINE, "..", "..", ".."))
PORTALS = os.path.join(REPO, "docs", "qc", "portals")
LINKS = os.path.join(os.path.dirname(ENGINE), "portal-links.json")
SEV_ORDER = {"Blocker": 0, "Major": 1, "Minor": 2, "Nit": 3}

# ---------------------------------------------------------------------------------------------
# THE SPEC
REQUIRED = [
    ("audit-master.json", "the single source of truth - the PDF, the markdown and the tracker all read it"),
    ("README.md", "what is in this folder, where each artefact lives, and how to regenerate it"),
    ("DESIGN-QA-REPORT.md", "the readable report: the same findings as the PDF, searchable in the repo"),
    ("generate_pdf.py", "a COPY of the skill's canonical generator - never a fork"),
    ("render.js", "a COPY of the skill's canonical renderer - never a fork"),
]
REQUIRED_GLOB = [("*-Design-QC-Report.pdf", "the PDF report, named from `portal` in audit-master")]
# Build artefacts: real outputs, but reproducible from audit-master, so they are not history.
FORBIDDEN = ["report-generated.html", "report-sections.json", "node_modules",
             "package.json", "package-lock.json"]
# Deprecated per-portal pattern: capture and report scripts belong in tools/design-audit/projects/<p>/.
FORBIDDEN_PREFIX = ["_cap_", "build_", "screens.", "_designonly"]
OPTIONAL = ["AUDIT-SPEC.md", "suggestions.json", "generate_suggestions.py", "captures"]

MASTER_REQUIRED = ["portal", "generated", "screens", "figmaUrl", "idPrefix", "method", "deferred"]
FINDING_REQUIRED = ["id", "element", "severity", "axis", "figma", "live", "fix"]


def _load_links():
    return json.load(open(LINKS)) if os.path.exists(LINKS) else {}


def _findings(am):
    return [(s, f) for s in am.get("screens", []) for f in s.get("findings", [])]


# ---------------------------------------------------------------------------------------------
# THE CHECK
def tracked(key):
    """What git actually carries for this portal. The spec is about what is COMMITTED, not what
    happens to be sitting on the disk: `generate_pdf.py` legitimately leaves an intermediate HTML
    beside it every run, and that file being present is fine - it being in history is not."""
    import subprocess
    # -z, because every portal's PDF is named from `portal` and most carry an em dash or a
    # middle dot; without it git returns the path QUOTED and escaped, and the suffix test for
    # "*-Design-QC-Report.pdf" silently fails on five of the six portals.
    r = subprocess.run(["git", "ls-files", "-z", f"docs/qc/portals/{key}"],
                       capture_output=True, text=True, cwd=REPO)
    return {os.path.relpath(l, f"docs/qc/portals/{key}").split("/")[0]
            for l in r.stdout.split("\0") if l.strip()}


def audit_portal(key):
    d = os.path.join(PORTALS, key)
    have = tracked(key)
    rec = {"portal": key, "missing": [], "forbidden": [], "master": [], "ok": True}
    for name, _ in REQUIRED:
        if name not in have:
            rec["missing"].append(name)
    for pat, _ in REQUIRED_GLOB:
        suf = pat.lstrip("*")
        if not any(n.endswith(suf) for n in have):
            rec["missing"].append(pat)
    for name in sorted(have):
        if name in FORBIDDEN or any(name.startswith(p) for p in FORBIDDEN_PREFIX):
            rec["forbidden"].append(name)
    amp = os.path.join(d, "audit-master.json")
    if os.path.exists(amp):
        am = json.load(open(amp))
        rec["master"] = [k for k in MASTER_REQUIRED if k not in am]
        bad = collections.Counter()
        for _, f in _findings(am):
            for k in FINDING_REQUIRED:
                if k not in f:
                    bad[k] += 1
        rec["findingFields"] = dict(bad)
        rec["findings"] = len(_findings(am))
        rec["screens"] = len(am.get("screens", []))
    # A published portal belongs in the master tracker. SCW has 65 findings and no tab at all,
    # which is invisible until someone goes looking for its rows.
    rec["tracker"] = []
    links = _load_links()
    tab = (links.get(key) or {}).get("trackerTab")
    xl = os.path.join(REPO, "docs", "qc", "MoSJE-Portal-QC-Tracker.xlsx")
    if os.path.exists(xl):
        try:
            import openpyxl
            names = openpyxl.load_workbook(xl, read_only=True).sheetnames
            if not tab:
                rec["tracker"].append("no tracker tab is registered for this portal in portal-links.json")
            elif tab not in names:
                rec["tracker"].append(f"portal-links names the tab `{tab}`, which is not in the workbook")
        except Exception as e:
            rec["tracker"].append(f"could not read the tracker: {e}")
    rec["ok"] = not (rec["missing"] or rec["forbidden"] or rec["master"]
                     or rec.get("findingFields") or rec["tracker"])
    return rec


def check(write_baseline=False):
    keys = sorted(k for k in os.listdir(PORTALS)
                  if os.path.isdir(os.path.join(PORTALS, k))
                  and os.path.exists(os.path.join(PORTALS, k, "audit-master.json")))
    recs = [audit_portal(k) for k in keys]
    base_path = os.path.join(os.path.dirname(ENGINE), "deliverable-baseline.json")
    base = json.load(open(base_path)) if os.path.exists(base_path) else {}
    fail = []
    print(f"deliverable spec - {len(recs)} published portals\n")
    for r in recs:
        gaps = (len(r["missing"]) + len(r["forbidden"]) + len(r["master"])
                + len(r.get("findingFields", {})) + len(r.get("tracker", [])))
        was = base.get(r["portal"])
        mark = "ok " if gaps == 0 else "!! "
        print(f"  {mark}{r['portal']:16s} {r.get('screens',0):>3} screens {r.get('findings',0):>4} findings"
              f"   gaps={gaps}" + (f" (baseline {was})" if was is not None else ""))
        for n in r["missing"]:
            print(f"        missing:   {n}")
        for n in r["forbidden"]:
            print(f"        should not be committed: {n}")
        for n in r["master"]:
            print(f"        audit-master is missing `{n}`")
        for k, c in (r.get("findingFields") or {}).items():
            print(f"        {c} finding(s) missing `{k}`")
        for n in r.get("tracker", []):
            print(f"        tracker:   {n}")
        # the ratchet: a portal may improve, never regress
        if was is not None and gaps > was:
            fail.append(f"{r['portal']}: {gaps} gaps, was {was} - this is a REGRESSION")
        if was is not None and gaps < was:
            print(f"        improved: {was} -> {gaps}. Re-baseline with --baseline.")
    if write_baseline:
        json.dump({r["portal"]: (len(r["missing"]) + len(r["forbidden"]) + len(r["master"])
                   + len(r.get("findingFields", {})) + len(r.get("tracker", []))) for r in recs},
                  open(base_path, "w"), indent=1, sort_keys=True)
        print("\nbaseline written.")
    if fail:
        print("\n!! REGRESSION")
        for f in fail:
            print("   " + f)
        return 2
    return 0


# ---------------------------------------------------------------------------------------------
# THE GENERATORS
def pdf_name(key, am):
    """The PDF's ACTUAL filename. generate_pdf.py slugifies `portal` (spaces to hyphens), so
    deriving it from the raw portal string names a file that does not exist - which is worse than
    no link, because it looks right."""
    d = os.path.join(PORTALS, key)
    if os.path.isdir(d):
        for n in sorted(os.listdir(d)):
            if n.endswith("-Design-QC-Report.pdf"):
                return n
    return am["portal"].replace(" ", "-") + "-Design-QC-Report.pdf"


def readme_md(key, am, links):
    L = links.get(key, {})
    pdf = L.get("pdf") or pdf_name(key, am)
    tab = L.get("trackerTab")
    rows = [f"# {am['portal']} - Design QC\n",
            "| Deliverable | Where |", "|---|---|",
            f"| **PDF report** (one page per board, side-by-side with numbered markers) | `{pdf}` |",
            "| **Markdown report** (same findings, readable in the repo) | `DESIGN-QA-REPORT.md` |"]
    if tab:
        cov = f" (+ `Coverage - {tab}`, `Rollup`)"
        rows.append(f"| **Master tracker** (one row per finding, with Status/Assignee) | "
                    f"`docs/qc/MoSJE-Portal-QC-Tracker.xlsx` -> sheet `{tab}`{cov} |")
    else:
        rows.append("| **Master tracker** | _not yet added for this portal_ |")
    if L.get("figmaSheet"):
        rows.append(f"| **Figma review sheet** (the reviewer's editing surface - DESIGN \\| BUILD \\| ISSUES) "
                    f"| [Design QC page]({L['figmaSheet']}) |")
    if L.get("figmaReport"):
        rows.append(f"| **Figma pinned report** (boards with draggable markers on both sides) "
                    f"| [same page]({L['figmaReport']}) |")
    if L.get("drivePdf"):
        rows.append(f"| **Shared copy** | [{os.path.basename(L['drivePdf'])} on Drive]({L['drivePdf']}) |")
    if am.get("figmaUrl"):
        rows.append(f"| **Design frames** | [{am['portal']} in the handoff file]({am['figmaUrl']}) |")
    rows += [
             "| **Source of truth** | `audit-master.json` - the PDF, the markdown and the tracker all read it |",
             "",
             "## Regenerate",
             "",
             "```bash",
             "cd tools/design-audit",
             f"python3 engine/deliverable.py --write --portal {key}   # README + DESIGN-QA-REPORT.md",
             f"cd ../../docs/qc/portals/{key} && python3 generate_pdf.py   # the PDF",
             "```",
             "",
             f"`generate_pdf.py` and `render.js` here are **copies** of the canonical pair in the "
             f"`design-qc` skill, never forks. A new generator capability is added there and re-copied.",
             ""]
    return "\n".join(rows)


def report_md(key, am, links):
    L = links.get(key, {})
    finds = _findings(am)
    counts = collections.Counter(f["severity"] for _, f in finds)
    glob = [(s, f) for s, f in finds if f.get("scope") == "Global"]
    scr = [(s, f) for s, f in finds if f.get("scope") != "Global"]
    out, A = [], None
    out.append(f"# {am['portal']} - Design QC Report\n")
    line = f"**Design:** [handoff frames]({am['figmaUrl']})" if am.get("figmaUrl") else ""
    out.append(f"**Generated:** {am.get('generated','')}  {('· ' + line) if line else ''}  ")
    out.append("**Status:** ready for review - a human still owes the keyboard and screen-reader pass.\n")
    also = ["the PDF beside this file"]
    if L.get("trackerTab"):
        also.append(f"the `{L['trackerTab']}` sheet in `docs/qc/MoSJE-Portal-QC-Tracker.xlsx`")
    if L.get("figmaSheet"):
        also.append(f"a [Figma review sheet]({L['figmaSheet']})")
    if L.get("figmaReport"):
        also.append(f"a [pinned Figma report]({L['figmaReport']})")
    out.append("**Also published as:** " + ", ".join(also) + ".\n")
    out.append("---\n## Summary\n")
    out.append("| | |")
    out.append("|---|---|")
    out.append(f"| Boards in the report | {len(am.get('screens',[]))} |")
    sev = ", ".join(f"{counts[k]} {k}" for k in ("Blocker", "Major", "Minor", "Nit") if counts[k])
    out.append(f"| Findings | **{len(finds)}** - {sev} |")
    if glob:
        out.append(f"| Applies to every screen | {len(glob)} |")
        out.append(f"| Specific to one screen | {len(scr)} |")
    if am.get("deferred"):
        out.append(f"| Withdrawn, not raised, or noted about the design file | {len(am['deferred'])} |")
    out.append("")
    if am.get("method"):
        out.append(am["method"] + "\n")
    top = sorted(finds, key=lambda sf: (SEV_ORDER.get(sf[1]["severity"], 9),
                                        0 if sf[1].get("scope") == "Global" else 1))[:5]
    if top:
        out.append("**Where to start.** The findings with the widest reach or the highest severity:\n")
        for i, (s, f) in enumerate(top, 1):
            out.append(f"{i}. **{f['element']}** - `{f['id']}` · {f['severity']}")
        out.append("")
    out.append("---\n")

    def block(s, f):
        scope = ("every screen with this element" if f.get("scope") == "Global" else s.get("name", ""))
        out.append(f"### {f['element']}\n")
        out.append(f"`{f['id']}` · **{f['severity']}** · {f.get('axis','')} · Scope: {scope}\n")
        out.append("| | |")
        out.append("|---|---|")
        out.append(f"| **Design says** | {f.get('figma','')} |")
        out.append(f"| **Build does** | {f.get('live','')} |")
        out.append(f"| **Fix** | {f.get('fix','')} |")
        lk = []
        if s.get("figmaUrl"):
            lk.append(f"[Figma frame]({s['figmaUrl']})")
        if s.get("liveUrl"):
            lk.append(f"[Live page]({s['liveUrl']})")
        if lk:
            out.append("\n" + " · ".join(lk))
        out.append("")

    if glob:
        out.append("## Findings that apply to every screen\n")
        out.append("Each has its own board in the PDF, showing the design and the build side by "
                   "side with the marker on the element in question.\n")
        for s, f in sorted(glob, key=lambda sf: (SEV_ORDER.get(sf[1]["severity"], 9), sf[1]["id"])):
            block(s, f)
        out.append("---\n")
    out.append("## Findings specific to one screen\n" if glob else "## Findings\n")
    by = collections.OrderedDict()
    for s, f in sorted(scr, key=lambda sf: (SEV_ORDER.get(sf[1]["severity"], 9), sf[0].get("name", ""))):
        by.setdefault(s.get("name", "—"), []).append((s, f))
    for name, items in by.items():
        out.append(f"## {name}\n")
        for s, f in items:
            block(s, f)
    if am.get("deferred"):
        out.append("---\n## Withdrawn on re-checking, not raised, and notes on the design file\n")
        out.append("Nothing here is a finding. Each was either raised in an earlier round and did "
                   "not survive re-checking, ruled out of scope, or is a defect in the handoff file "
                   "rather than the build. They stay visible, with the reason, so a reviewer who "
                   "saw one learns the outcome rather than wondering where it went.\n")
        for d in am["deferred"]:
            out.append(f"- **{d.get('title','')}** - {d.get('reason','')}")
        out.append("")
    return "\n".join(out)


def write(keys=None):
    links = _load_links()
    keys = keys or sorted(k for k in os.listdir(PORTALS)
                          if os.path.exists(os.path.join(PORTALS, k, "audit-master.json")))
    for k in keys:
        d = os.path.join(PORTALS, k)
        am = json.load(open(os.path.join(d, "audit-master.json")))
        open(os.path.join(d, "README.md"), "w").write(readme_md(k, am, links))
        open(os.path.join(d, "DESIGN-QA-REPORT.md"), "w").write(report_md(k, am, links))
        n = len(_findings(am))
        print(f"  {k:16s} README.md + DESIGN-QA-REPORT.md  ({n} findings)")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true")
    ap.add_argument("--write", action="store_true")
    ap.add_argument("--baseline", action="store_true", help="re-record the current gap counts")
    ap.add_argument("--portal", default=None)
    a = ap.parse_args()
    if a.write:
        write([a.portal] if a.portal else None)
    if a.check or a.baseline or not a.write:
        return check(write_baseline=a.baseline)
    return 0


if __name__ == "__main__":
    sys.exit(main())
