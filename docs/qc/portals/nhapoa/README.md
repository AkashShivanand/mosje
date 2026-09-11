# NHAPOA — National Helpline Against Atrocities - Design QC

| Deliverable | Where |
|---|---|
| **PDF report** (one page per board, side-by-side with numbered markers) | `NHAPOA-—-National-Helpline-Against-Atrocities-Design-QC-Report.pdf` |
| **Markdown report** (same findings, readable in the repo) | `DESIGN-QA-REPORT.md` |
| **Master tracker** (one row per finding, with Status/Assignee) | `docs/qc/MoSJE-Portal-QC-Tracker.xlsx` -> sheet `NHAPOA` (+ `Coverage - NHAPOA`, `Rollup`) |
| **Figma review sheet** (the reviewer's editing surface - DESIGN \| BUILD \| ISSUES) | [Design QC page](https://www.figma.com/design/8LX7sqdDtWIAoCYZueCJq7/Design-QC?node-id=379-1035) |
| **Shared copy** | [view on Drive](https://drive.google.com/file/d/1omNdBvxA8XEefNsZqO6PORKRdpM6QKVa/view) |
| **Design frames** | [NHAPOA — National Helpline Against Atrocities in the handoff file](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5093-18512) |
| **Source of truth** | `audit-master.json` - the PDF, the markdown and the tracker all read it |

## Regenerate

```bash
cd tools/design-audit
python3 engine/deliverable.py --write --portal nhapoa   # README + DESIGN-QA-REPORT.md
cd ../../docs/qc/portals/nhapoa && python3 generate_pdf.py   # the PDF
```

`generate_pdf.py` and `render.js` here are **copies** of the canonical pair in the `design-qc` skill, never forks. A new generator capability is added there and re-copied.
