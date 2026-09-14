#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""DESIGN-QA-REPORT.md - the readable half of the deliverable, generated from audit-master.json
so it can never drift from the PDF or the tracker."""
import collections, json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", "..", "..", ".."))
DEST = os.path.join(REPO, "docs", "qc", "portals", "nmba")
SEV = {"Blocker": 0, "Major": 1, "Minor": 2, "Nit": 3}
SHEET_URL = "https://www.figma.com/design/8LX7sqdDtWIAoCYZueCJq7/Design-QC?node-id=50891-4319"


def main():
    am = json.load(open(os.path.join(DEST, "audit-master.json")))
    rows = json.load(open(os.path.join(HERE, "sheet", "all_rows.json")))
    finds = [(s, f) for s in am["screens"] for f in s["findings"]]
    counts = collections.Counter(f["severity"] for _, f in finds)
    glob = [(s, f) for s, f in finds if f.get("scope") == "Global"]
    scr = [(s, f) for s, f in finds if f.get("scope") != "Global"]
    n_screens = sum(1 for r in rows if r["role"] != "global")
    n_paired = sum(1 for r in rows if r["role"] != "global" and r.get("designPng"))

    L = []
    A = L.append
    A(f"# {am['portal']} · Design QC Report\n")
    A(f"**Build:** nmba-user-dev.mosje.in and nmba-admin-dev.mosje.in, captured 11 September 2026 · "
      f"**Design:** [MoSJE Portal Handoff → *NMBA (Dev Synced — August)*]({am['figmaUrl']})  ")
    A("**Status:** ready for review — a human still owes the keyboard and screen-reader pass.\n")
    A(f"**Also published as:** the PDF beside this file, the `NMBA` sheet in "
      f"`docs/qc/MoSJE-Portal-QC-Tracker.xlsx`, and in Figma as a [review sheet]({SHEET_URL}).\n")
    A("---\n")
    A("## Summary\n")
    A("| | |")
    A("|---|---|")
    A(f"| Screens captured | **{n_screens}** across the citizen site, the sign-in surface and three admin roles |")
    A(f"| Design frames paired one to one | {n_paired} |")
    sev_txt = ", ".join(f"{counts[k]} {k}" for k in ("Blocker", "Major", "Minor", "Nit") if counts[k])
    A(f"| Findings | **{len(finds)}** — {sev_txt} |")
    A(f"| Applies to every screen | {len(glob)} |")
    A(f"| Specific to one screen | {len(scr)} |")
    A(f"| Withdrawn, not raised, or noted about the design file | {len(am['deferred'])} |")
    A("")
    A(am["method"] + "\n")
    A("**Where to start.** The findings with the widest reach or the highest severity:\n")
    top = sorted(finds, key=lambda sf: (SEV.get(sf[1]["severity"], 9),
                                        0 if sf[1].get("scope") == "Global" else 1))[:5]
    for i, (s, f) in enumerate(top, 1):
        A(f"{i}. **{f['element']}** — `{f['id']}` · {f['severity']}")
    A("\n---\n")

    def block(s, f):
        scope = "every screen with this element" if f.get("scope") == "Global" else s["name"]
        A(f"### {f['element']}\n")
        A(f"`{f['id']}` · **{f['severity']}** · {f['axis']} · Scope: {scope}\n")
        A("| | |")
        A("|---|---|")
        A(f"| **Design says** | {f.get('figma','')} |")
        A(f"| **Build does** | {f.get('live','')} |")
        A(f"| **Fix** | {f.get('fix','')} |")
        links = []
        if s.get("figmaUrl"):
            links.append(f"[Figma frame]({s['figmaUrl']})")
        if s.get("liveUrl"):
            links.append(f"[Live page]({s['liveUrl']})")
        if links:
            A("\n" + " · ".join(links))
        A("")

    A("## Findings that apply to every screen\n")
    A("Each has its own board in the PDF, showing the design and the build side by side with the "
      "marker on the element in question.\n")
    for s, f in sorted(glob, key=lambda sf: (SEV.get(sf[1]["severity"], 9), sf[1]["id"])):
        block(s, f)

    A("---\n")
    A("## Findings specific to one screen\n")
    by_screen = collections.OrderedDict()
    for s, f in sorted(scr, key=lambda sf: (SEV.get(sf[1]["severity"], 9), sf[0]["name"])):
        by_screen.setdefault(s["name"], []).append((s, f))
    for name, items in by_screen.items():
        A(f"## {name}\n")
        for s, f in items:
            block(s, f)

    A("---\n")
    A("## Withdrawn on re-checking, and not raised\n")
    A("Nothing here is a finding. Each was either carried in from the July 2026 pass or raised by "
      "the reviewer in an earlier round, and did not survive re-checking against the current design "
      "and build. They stay visible, with the reason, so a reviewer who saw them learns the "
      "outcome rather than wondering where they went.\n")
    for d in am["deferred"]:
        if d["id"] == "design-file":
            continue
        A(f"- **{d['title']}** — {d['reason']}")
    A("")
    A("---\n")
    A("## Observations about the design file\n")
    A("These are defects in the handoff file itself, not in the build, and no developer can act on "
      "them. They are reported here because they affect what a reader of the handoff can see.\n")
    for d in am["deferred"]:
        if d["id"] != "design-file":
            continue
        A(f"- **{d['title'].replace('Design file — ','')}** — {d['reason']}")
    A("")
    A("---\n")
    A("## Coverage\n")
    A(f"All {n_screens} captured screens appear in the PDF: {len(by_screen)} carry a screen-specific "
      "finding, and the rest render as a single reference board marked *audited, no screen-specific "
      "finding* — a screen dropped from a report reads as a screen never looked at.\n")
    A("**Declared coverage debt** — designed, not audited, and stated rather than left as a silent gap:\n")
    frames = json.load(open(os.path.join(HERE, "inputs", "figma-frames.json")))
    A(f"- **{sum(1 for f in frames if f.get('_designOnly'))} design frames have no build on dev** — "
      "form wizards, edit and detail states, register flows, and the two further sign-in states.")
    A("- **Five further roles were deferred by decision** — CPLI, ODIC, DDAC, USDP and Line Ministry. "
      "Each has working dev credentials on the shared access sheet and its own section on the design "
      "page (roughly 80 frames between them). They are ready to run as they stand.")
    A("- **MV / Institutions is not reachable** — 11 design frames, but the access sheet lists no "
      "login for the role.")
    A("")
    p = os.path.join(DEST, "DESIGN-QA-REPORT.md")
    open(p, "w").write("\n".join(L))
    print(f"DESIGN-QA-REPORT.md: {len(finds)} findings, {len(by_screen)} screens with findings, "
          f"{len(L)} lines")
    return 0


if __name__ == "__main__":
    sys.exit(main())
