# NMBA — Nasha Mukt Bharat Abhiyaan (DEV) - Design QC

| Deliverable | Where |
|---|---|
| **PDF report** (one page per board, side-by-side with numbered markers) | `NMBA-—-Nasha-Mukt-Bharat-Abhiyaan-(DEV)-Design-QC-Report.pdf` |
| **Markdown report** (same findings, readable in the repo) | `DESIGN-QA-REPORT.md` |
| **Master tracker** (one row per finding, with Status/Assignee) | `docs/qc/MoSJE-Portal-QC-Tracker.xlsx` -> sheet `NMBA` (+ `Coverage - NMBA`, `Rollup`) |
| **Figma review sheet** (the reviewer's editing surface - DESIGN \| BUILD \| ISSUES) | [Design QC page](https://www.figma.com/design/8LX7sqdDtWIAoCYZueCJq7/Design-QC?node-id=50891-4319) |
| **Figma pinned report** (boards with draggable markers on both sides) | [same page](https://www.figma.com/design/8LX7sqdDtWIAoCYZueCJq7/Design-QC?node-id=50902-4319) |
| **Shared copy** | [view on Drive](https://drive.google.com/file/d/1D8hvZUBb-GEFyt2WoCKdM39cUehYCwF7/view) |
| **Design frames** | [NMBA — Nasha Mukt Bharat Abhiyaan (DEV) in the handoff file](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=2136-20193) |
| **Source of truth** | `audit-master.json` - the PDF, the markdown and the tracker all read it |

## Regenerate

```bash
cd tools/design-audit
python3 engine/deliverable.py --write --portal nmba   # README + DESIGN-QA-REPORT.md
cd ../../docs/qc/portals/nmba && python3 generate_pdf.py   # the PDF
```

`generate_pdf.py` and `render.js` here are **copies** of the canonical pair in the `design-qc` skill, never forks. A new generator capability is added there and re-copied.
