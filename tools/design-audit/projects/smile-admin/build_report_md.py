#!/usr/bin/env python3
"""Render the markdown report from audit-master.json — the same source the PDF and tracker read,
so the three deliverables cannot disagree."""
import json, os, sys, collections
HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", "..", "..", ".."))
DEST = os.path.join(REPO, "docs", "qc", "portals", "smile-admin")
QC = "8LX7sqdDtWIAoCYZueCJq7"
REVIEW = f"https://www.figma.com/design/{QC}/Design-QC?node-id=50817-25"
REPORT = f"https://www.figma.com/design/{QC}/Design-QC?node-id=50826-25"

am = json.load(open(os.path.join(DEST, "audit-master.json")))
allf = [(s, f) for s in am["screens"] for f in s["findings"]]
counts = collections.Counter(f["severity"] for _, f in allf)
L = []
L.append(f"# {am['portal']} · Design QC Report\n")
L.append("**Build:** smile-admin-dev.mosje.in, captured 10 September 2026 · "
         f"**Design:** [MoSJE Portal Handoff → *Smile Beggary (Synced)*]({am['figmaUrl']})  ")
L.append("**Status:** ready for review — a human still owes the keyboard and screen-reader pass.\n")
L.append(f"**Also published as:** the PDF beside this file, the `SMILE Beggary` sheet in "
         f"`docs/qc/MoSJE-Portal-QC-Tracker.xlsx`, and in Figma as a "
         f"[review sheet]({REVIEW}) and a [pinned report]({REPORT}).\n")
L.append("---\n")
L.append("## Summary\n")
L.append("| | |")
L.append("|---|---|")
L.append("| Screens compared design ↔ build | 63 pairs across four roles + the sign-in surface |")
L.append(f"| Findings | **{len(allf)}** — {counts['Major']} Major, {counts['Minor']} Minor, {counts['Nit']} Nit |")
L.append(f"| Applies to every screen | {sum(1 for _, f in allf if f.get('scope') == 'Global')} |")
L.append(f"| Specific to one screen | {sum(1 for _, f in allf if f.get('scope') != 'Global')} |")
L.append("")
L.append(am["method"] + "\n")
L.append("**Where to start.** The findings with the widest reach:\n")
for i, (s, f) in enumerate([x for x in allf if x[1].get("scope") == "Global"
                            and x[1]["severity"] == "Major"][:5], 1):
    L.append(f"{i}. **{f['element']}** — `{f['id']}`.")
L.append("")
L.append("---\n")


def card(s, f):
    scope = " · Scope: every screen" if f.get("scope") == "Global" else ""
    return "\n".join([
        f"### {f['element']}", "",
        f"`{f['id']}` · **{f['severity']}** · {f['axis']}{scope}", "",
        "| | |", "|---|---|",
        f"| **Design says** | {f['figma']} |",
        f"| **Build does** | {f['live']} |",
        f"| **Fix** | {f['fix']} |", ""])


L.append("## Findings that apply to every screen\n")
L.append("Each has its own board in Figma and its own page in the PDF, showing the design and the "
         "build side by side with the marker on the element in question.\n")
for s, f in allf:
    if f.get("scope") == "Global":
        L.append(card(s, f))
L.append("---\n")
L.append("## Findings on one screen\n")
for s in am["screens"]:
    if s.get("_role") == "Global":
        continue
    L.append(f"## {s['name']}\n")
    L.append(f"[Design frame ↗]({s['figmaUrl']}) · [Live page ↗]({s['liveUrl']})\n")
    for f in s["findings"]:
        L.append(card(s, f))
L.append("---\n")
L.append("## Not raised here\n")
L.append("Two rules narrow this report. Copy, wording, naming and policy are out of scope — this "
         "is a design-fidelity audit. And the filter sets are covered by one global note rather "
         "than a per-screen demand that the build match the design's list exactly. What that "
         "removed, and why:\n")
L.append("| Was | Why it is not raised |")
L.append("|---|---|")
for d in am["deferred"]:
    L.append(f"| {d['title']} | {d['reason']} |")
L.append("")
L.append("---\n")
L.append("## Coverage\n")
L.append("| | |")
L.append("|---|---|")
L.append("| Design-to-build pairs compared | 63 |")
L.append("| Roles crawled | Super Admin, Central Authority, US/SO, NISD, plus the sign-in surface |")
L.append("| Roles skipped at the reviewer's instruction | State Nodal Officer, Nodal Officer, Implementing Agency |")
L.append("")
L.append("**Built with no design on the page this audit was given.** The surveyor detail page "
         "(`/surveyors/<id>`) has no frame on *Smile Beggary (Synced)* — the nearest frame is the "
         "surveyor LIST. The same is true of `/hotspot-approvals` and the three Fund Monitoring "
         "create forms.\n")
L.append("**States not reached.** View Catalog, Edit Permissions, Create Survey Location, View "
         "Beneficiary, the dashboard chart tabs and Add District: the control resolves and the "
         "click lands, but the view does not finish loading inside the capture window. They are "
         "not audited, and they are not counted as clean.\n")
L.append("**Engineering defects** with no design counterpart — chiefly that a page refresh signs "
         "the officer out on 15 of 20 routes — are recorded in "
         "`docs/audit/smile-beggary-capture-and-session.md`, not here.\n")

md = "\n".join(L).rstrip() + "\n"
open(os.path.join(DEST, "DESIGN-QA-REPORT.md"), "w").write(md)
print(f"DESIGN-QA-REPORT.md — {len(allf)} findings, {len(md.splitlines())} lines")
