# SMILE — Beggary (Comprehensive Rehabilitation) · Admin — Design QC

| Deliverable | Where |
|---|---|
| **PDF report** (one page per screen, side-by-side boards with numbered markers) | `SMILE-—-Beggary-(Comprehensive-Rehabilitation)-·-Admin-Design-QC-Report.pdf` |
| **Markdown report** (same content, readable in the repo) | `DESIGN-QA-REPORT.md` |
| **Master tracker** (one row per finding, with Status/Assignee) | `docs/qc/MoSJE-Portal-QC-Tracker.xlsx` → sheet `SMILE Beggary` (+ `Coverage – SMILE Beggary`, `Rollup`) |
| **Figma review sheet** (the reviewer's editing surface — 63 rows, DESIGN \| BUILD \| ISSUES) | [Design QC → Smile Beggary](https://www.figma.com/design/8LX7sqdDtWIAoCYZueCJq7/Design-QC?node-id=50817-25) |
| **Figma pinned report** (16 global boards + 19 screen boards, markers on both sides) | [same page](https://www.figma.com/design/8LX7sqdDtWIAoCYZueCJq7/Design-QC?node-id=50826-25) |
| **Source of truth** | `audit-master.json` — the PDF, the markdown and the tracker all read it |

## Regenerate

```bash
cd tools/design-audit/projects/smile-admin
python3 finalise.py            # applies the scope rules, assigns SMB-… ids
python3 build_final_report.py  # writes audit-master.json + copies the canonical generator
cd ../../../../docs/qc/portals/smile-admin && python3 generate_pdf.py
cd - && python3 build_report_md.py && python3 build_tracker.py
```

## What is in scope

Differences between the design frames on *Smile Beggary (Synced)* and the live dev build, at a
1440 viewport. **Not** in scope, by the reviewer's instruction (2026-09-10): copy, wording, naming
and policy items; and the filter sets, which are covered by one global note rather than a
per-screen demand that the build match the design's list. Everything removed under those rules is
listed in the report's "Not raised here" table with its reason, so it is not silently lost.

Engineering defects with no design counterpart — chiefly that a page refresh signs the officer out
on 15 of 20 routes — live in `docs/audit/smile-beggary-capture-and-session.md`.
