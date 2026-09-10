#!/usr/bin/env python3
"""Render docs/qc/portals/smile-admin/DESIGN-QA-REPORT.md from the finding source.

The globals come FIRST and each links to its own DESIGN|BUILD board in Figma, because a
finding a reviewer cannot see is a finding they cannot check.
"""
import json, os, sys, collections
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import findings_draft as F

FILE = "8LX7sqdDtWIAoCYZueCJq7"
REVIEW = f"https://www.figma.com/design/{FILE}/Design-QC?node-id=50817-25"
REPORT = f"https://www.figma.com/design/{FILE}/Design-QC?node-id=50826-25"
OUT = os.path.join(HERE, "..", "..", "..", "..", "docs", "qc", "portals", "smile-admin",
                   "DESIGN-QA-REPORT.md")

secs = json.load(open(os.path.join(HERE, "sheet", "global_sections.json")))
nodes = json.load(open(os.path.join(HERE, "global_nodes.json")))
screen_nodes = json.load(open(os.path.join(HERE, "screen_nodes.json")))
by_id = {s["id"]: s for s in secs}

ALL = F.GLOBAL + F.SCREEN + F.LOGIN + F.DIFF + F.DIFF2 + F.SCREEN2 + F.SCREEN3
counts = collections.Counter(f[3] for f in ALL)


def card(f, extra=""):
    fid, scope, screen, sev, cat, title, design, build, fix = f
    out = [f"### {title}", "", f"`{fid}` · **{sev}** · {cat}{extra}", "",
           "| | |", "|---|---|",
           f"| **Design says** | {design} |",
           f"| **Build does** | {build} |",
           f"| **Fix** | {fix} |", ""]
    return "\n".join(out)


L = []
L.append("# SMILE — Beggary (Admin) · Design QA Report\n")
L.append("**Build:** smile-admin-dev.mosje.in, captured 10 September 2026 · "
         "**Design:** MoSJE Portal Handoff → *Smile Beggary (Synced)*  ")
L.append("**Status:** draft — not signed off. A human still owes the keyboard and "
         "screen-reader pass.\n")
L.append(f"**Review in Figma:** [review sheet]({REVIEW}) · [pinned report]({REPORT}) — "
         "every finding below has a numbered marker on a DESIGN | BUILD board there.\n")
L.append("---\n")
L.append("## Summary\n")
L.append("| | |")
L.append("|---|---|")
L.append("| Screens compared design ↔ build | 31 + the sign-in surface |")
L.append(f"| Findings | **{len(ALL)}** — {counts['Major']} Major, {counts['Minor']} Minor, "
         f"{counts['Nit']} Nit |")
L.append(f"| Applies to every screen | {len(secs)} |")
screen_only = [f for f in F.SCREEN + F.DIFF + F.DIFF2 + F.SCREEN2 + F.SCREEN3 if f[1] == "Screen"]
L.append(f"| Specific to one screen | {len(screen_only)} |")
L.append(f"| Sign-in surface | {len(F.LOGIN)} |")
L.append("")
L.append("Every finding is a difference between what the design specifies and what the build "
         "renders. Engineering defects with no design counterpart are not raised here; they are "
         "in `docs/audit/smile-beggary-capture-and-session.md`.\n")
L.append("**Where to start.** The five with the widest reach:\n")
for i, fid in enumerate(["G19", "G04", "G11", "G03", "G17"], 1):
    f = next(x for x in ALL if x[0] == fid)
    L.append(f"{i}. **{f[5]}** — `{fid}`, {f[3]}.")
L.append("")
L.append("---\n")
L.append("## Findings that apply to every screen\n")
L.append("These are listed first because each one repeats across the portal, so fixing one fixes "
         "many. Each has its own board in Figma showing the design and the build side by side, "
         "with the marker on the element in question.\n")
for s in secs:
    f = next(x for x in ALL if x[0] == s["id"])
    link = f"https://www.figma.com/design/{FILE}/Design-QC?node-id={nodes[s['id']].replace(':', '-')}"
    extra = (f" · Scope: every screen · shown on **{s['screen']}** "
             f"([board {s['n']} ↗]({link}))")
    L.append(card(f, extra))
L.append("---\n")
L.append("## Findings on one screen\n")
screen_findings = screen_only
for screen in dict.fromkeys(f[2] for f in screen_findings):
    node = screen_nodes.get(screen)
    if node:
        link = f"https://www.figma.com/design/{FILE}/Design-QC?node-id={node.replace(':', '-')}"
        L.append(f"## {screen}\n")
        L.append(f"[Board with markers ↗]({link})\n")
    else:
        L.append(f"## {screen}\n")
    for f in [x for x in screen_findings if x[2] == screen]:
        L.append(card(f))

L.append("---\n")
L.append("## Coverage — what was checked, and what could not be\n")
L.append("| | |")
L.append("|---|---|")
L.append("| Design frames on *Smile Beggary (Synced)* paired to a build capture | 63 |")
L.append("| Roles crawled | Super Admin, Central Authority, US/SO, NISD |")
L.append("| Roles skipped at the reviewer's instruction | State Nodal Officer, Nodal Officer, Implementing Agency |")
L.append("")
L.append("**Built with no design on the page I was pointed at.** The surveyor detail page "
         "(`/surveyors/<id>`) — a profile card with a Parent Implementing Agency panel — has no "
         "frame on *Smile Beggary (Synced)*. The nearest frame, `Survey Locations section - "
         "Surveyor`, is a surveyor LIST. The same is true of `/hotspot-approvals` and the three "
         "Fund Monitoring create forms. These may be designed elsewhere; they are not on the page "
         "this audit was given.\n")
L.append("**States I could not reach.** View Catalog, Edit Permissions, Create Survey Location, "
         "View Beneficiary, the dashboard chart tabs and Add District: the control resolves and "
         "the click lands, but the resulting view does not finish loading within the capture "
         "window. They are not audited, and they are not counted as clean.\n")
L.append("---\n")
L.append("## Sign-in surface\n")
for f in F.LOGIN:
    L.append(card(f))

md = "\n".join(L).rstrip() + "\n"
os.makedirs(os.path.dirname(os.path.abspath(OUT)), exist_ok=True)
open(os.path.abspath(OUT), "w").write(md)
print(f"wrote {os.path.abspath(OUT)} — {len(ALL)} findings, {len(secs)} global boards, "
      f"{len(md.splitlines())} lines")
