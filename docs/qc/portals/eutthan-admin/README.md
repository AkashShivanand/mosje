# eUtthan — Design QC (Login · Admin · Ministry) - Design QC

| Deliverable | Where |
|---|---|
| **PDF report** (one page per board, side-by-side with numbered markers) | `eUtthan-Admin-Design-QC-Report.pdf` |
| **Markdown report** (same findings, readable in the repo) | `DESIGN-QA-REPORT.md` |
| **Master tracker** (one row per finding, with Status/Assignee) | `docs/qc/MoSJE-Portal-QC-Tracker.xlsx` -> sheet `eUtthan Admin` (+ `Coverage - eUtthan Admin`, `Rollup`) |
| **Figma review sheet** (the reviewer's editing surface - DESIGN \| BUILD \| ISSUES) | [Design QC page](https://www.figma.com/design/8LX7sqdDtWIAoCYZueCJq7/Design-QC?node-id=164-2) |
| **Shared copy** | [view on Drive](https://drive.google.com/file/d/1ed8e9CLCEvqS64cui5ZWtbAYqz3SeDXm/view) |
| **Source of truth** | `audit-master.json` - the PDF, the markdown and the tracker all read it |

## Regenerate

```bash
cd tools/design-audit
python3 engine/deliverable.py --write --portal eutthan-admin   # README + DESIGN-QA-REPORT.md
cd ../../docs/qc/portals/eutthan-admin && python3 generate_pdf.py   # the PDF
```

`generate_pdf.py` and `render.js` here are **copies** of the canonical pair in the `design-qc` skill, never forks. A new generator capability is added there and re-copied.
