# SCW — Senior Citizens Welfare (UAT) · Full Design QC - Design QC

| Deliverable | Where |
|---|---|
| **PDF report** (one page per board, side-by-side with numbered markers) | `SCW-—-Senior-Citizens-Welfare-(UAT)-·-Full-Design-QC-Design-QC-Report.pdf` |
| **Markdown report** (same findings, readable in the repo) | `DESIGN-QA-REPORT.md` |
| **Master tracker** | _not yet added for this portal_ |
| **Figma review sheet** (the reviewer's editing surface - DESIGN \| BUILD \| ISSUES) | [Design QC page](https://www.figma.com/design/8LX7sqdDtWIAoCYZueCJq7/Design-QC?node-id=343-25) |
| **Design frames** | [SCW — Senior Citizens Welfare (UAT) · Full Design QC in the handoff file](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4619-49381) |
| **Source of truth** | `audit-master.json` - the PDF, the markdown and the tracker all read it |

## Regenerate

```bash
cd tools/design-audit
python3 engine/deliverable.py --write --portal scw   # README + DESIGN-QA-REPORT.md
cd ../../docs/qc/portals/scw && python3 generate_pdf.py   # the PDF
```

`generate_pdf.py` and `render.js` here are **copies** of the canonical pair in the `design-qc` skill, never forks. A new generator capability is added there and re-copied.
