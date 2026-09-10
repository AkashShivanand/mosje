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

*My Drive → MoSJE → Design QC* holds one PDF per portal and the tracker. The tracker there is
**`MoSJE-Portal-QC-Tracker.xlsx`** — the same shape as the repo copy, minus the Coverage sheets.

Two standing rules (reviewer, 2026-09-10):

- **Coverage stays local.** The Drive tracker carries the defect list people work from; the
  per-screen coverage ledgers live only in `docs/qc/MoSJE-Portal-QC-Tracker.xlsx`.
- **A push never replaces what is in Drive.** Status, Assignee, Date and Notes are the devs'
  columns — a push keeps whatever Drive already has for an existing finding id and brings across
  only the audit columns. New ids arrive as Open.

```bash
# after any change to the repo tracker
cd tools/design-audit/projects/smile-admin
python3 push_tracker_to_drive.py            # dry run: says what it would add and preserve
python3 push_tracker_to_drive.py --apply    # writes; keeps a backup OUTSIDE the Drive folder
```

The PDF is copied straight in (the folder is a filesystem mount), named to match the others:
`SMILE-Beggary-Design-QC-Report.pdf`.

**The `.gsheet` in that folder is a separate, older file** — four tabs, no TG, no SMILE. Nothing
in this session writes to it: the Drive connector can read Drive files and create new ones, but
cannot write cells or add tabs to a native Google Sheet. Treat the `.xlsx` as the Drive tracker.

**If someone has the .xlsx open in the Google Sheets editor, close it before pushing** — a later
save from that browser tab will overwrite whatever the push wrote. That is how the NHAPOA tab
came to be renamed to NHAA mid-session on 2026-09-10.
