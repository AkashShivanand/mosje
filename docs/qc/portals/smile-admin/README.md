# SMILE — Beggary (Comprehensive Rehabilitation) · Admin - Design QC

| Deliverable | Where |
|---|---|
| **PDF report** (one page per board, side-by-side with numbered markers) | `SMILE-—-Beggary-(Comprehensive-Rehabilitation)-·-Admin-Design-QC-Report.pdf` |
| **Markdown report** (same findings, readable in the repo) | `DESIGN-QA-REPORT.md` |
| **Master tracker** (one row per finding, with Status/Assignee) | `docs/qc/MoSJE-Portal-QC-Tracker.xlsx` -> sheet `SMILE Beggary` (+ `Coverage - SMILE Beggary`, `Rollup`) |
| **Figma review sheet** (the reviewer's editing surface - DESIGN \| BUILD \| ISSUES) | [Design QC page](https://www.figma.com/design/8LX7sqdDtWIAoCYZueCJq7/Design-QC?node-id=50817-25) |
| **Figma pinned report** (boards with draggable markers on both sides) | [same page](https://www.figma.com/design/8LX7sqdDtWIAoCYZueCJq7/Design-QC?node-id=50826-25) |
| **Shared copy** | [view on Drive](https://drive.google.com/file/d/1rog77OuL0hGd4U3X_2eo2cgFXLAOlZka/view) |
| **Design frames** | [SMILE — Beggary (Comprehensive Rehabilitation) · Admin in the handoff file](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=7732-77842) |
| **Source of truth** | `audit-master.json` - the PDF, the markdown and the tracker all read it |

## Regenerate

```bash
cd tools/design-audit
python3 engine/deliverable.py --write --portal smile-admin   # README + DESIGN-QA-REPORT.md
cd ../../docs/qc/portals/smile-admin && python3 generate_pdf.py   # the PDF
```

`generate_pdf.py` and `render.js` here are **copies** of the canonical pair in the `design-qc` skill, never forks. A new generator capability is added there and re-copied.
