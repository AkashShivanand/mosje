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

## Publishing to Google Drive

The shared tracker lives in Drive as a **native Google Sheet**
([MoSJE-Portal-QC-Tracker](https://docs.google.com/spreadsheets/d/11qIPlrq7T5osSqtd7NoxuVxIJ1bnj6Dng-b4-L9U6qQ/edit)),
in *My Drive → MoSJE → Design QC*, alongside one PDF per portal. It carries four tabs — Read Me,
Rollup, `eUtthan Admin` (42 findings) and `NHAA` (151) — and is a different lineage from the
`.xlsx` in this repo, which also holds TG and the Coverage tabs.

**The Drive connector available to this session can read Drive files and create new ones. It
cannot write cells or add tabs to a native Google Sheet.** So a portal is published in two moves:

1. **The PDF** is copied straight into the Drive folder (it is a real filesystem mount), named to
   match the others: `SMILE-Beggary-Design-QC-Report.pdf`.
2. **The two tabs** are built into `SMILE-Beggary-QC-sheets-to-import.xlsx`
   (`python3 build_drive_import.py`) and dropped in the same folder. In the Google Sheet:
   **File → Import → Upload → select it → "Insert new sheet(s)" → Import data.** That adds
   `SMILE Beggary` and `Coverage – SMILE Beggary` and cannot alter the tabs already there.
3. **Rollup** takes one new row, pasted under the existing two — Import cannot merge into an
   existing tab:

   | Portal | Total | Blocker | Major | Minor | Nit | Open | Fixed | Verified |
   |---|---|---|---|---|---|---|---|---|
   | SMILE Beggary | 60 | 0 | 19 | 35 | 6 | 60 | 0 | 0 |

   The live Rollup holds literal numbers for the other two portals, so these are literals too. If
   you would rather it aggregated, the formula is
   `=COUNTIF('SMILE Beggary'!$D:$D,"Major")` and so on, and `=COUNTA('SMILE Beggary'!$A$2:$A$999)`
   for the total.

The import file's columns match the live `NHAA` tab exactly, including the trailing **Scope**
column, so filters and the Rollup formulas behave the same way.
