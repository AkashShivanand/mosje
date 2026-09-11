# What a published Design QC deliverable looks like

Every portal's audit ends in the same shape, so a reviewer who has read one has read them all.
Before this file existed, six portals had been published and **no two had the same shape** — one
had a README, two had a markdown report, three committed the PDF generator's intermediate HTML,
two still carried their per-portal capture scripts beside the deliverable. Everything downstream
of that had to learn each portal separately.

`engine/deliverable.py` both **writes** the derived documents and **checks** every portal against
this page. Run it before publishing:

```bash
cd tools/design-audit
python3 engine/deliverable.py --write --portal <name>   # README.md + DESIGN-QA-REPORT.md
python3 engine/deliverable.py --check                   # the gate, across every portal
```

## 1. `docs/qc/portals/<portal>/` — the published deliverable

**Committed, always:**

| File | What it is |
|---|---|
| `audit-master.json` | **The single source of truth.** The PDF, the markdown report and the tracker all read it. Nothing downstream is hand-written. |
| `<Portal>-Design-QC-Report.pdf` | The report. One dynamically-sized page per board, fixed house style. The filename comes from `portal` in the master. |
| `DESIGN-QA-REPORT.md` | The same findings, readable and searchable in the repo. **Generated** — never hand-edited, or it drifts from the PDF. |
| `README.md` | What is in the folder, where every artefact lives (tracker tab, Figma sheet, Figma report, Drive copy), and how to regenerate. **Generated.** |
| `generate_pdf.py`, `render.js` | **Copies** of the canonical pair in the `design-qc` skill. Never forks. A new capability is added to the skill and re-copied. |
| `captures/{figma,live}/` | The board images the PDF references. |

**Committed where the portal has them:** `AUDIT-SPEC.md` (the kickoff brief a future session
reads), `suggestions.json` + `generate_suggestions.py` + a Design Suggestions PDF.

**Never committed** — reproducible from `audit-master.json`, so not history:
`report-generated.html`, `report-sections.json`, `node_modules/`, `package.json`,
`package-lock.json`.

**Never here at all** — the deliverable folder holds the *output*, not the machinery:
capture drivers (`_cap_*.py`), report builders (`build_*.py`), screen manifests (`screens*.json`).
Those live in `tools/design-audit/projects/<portal>/`. Pre-engine scripts are kept for provenance
under `projects/<portal>/_legacy/`.

## 2. `audit-master.json` — the schema everything reads

Top level: `portal`, `generated`, `idPrefix`, `figmaUrl`, `method`, `deferred[]`, `screens[]`.

Each finding: `id`, `element`, `severity`, `axis`, `figma`, `live`, `fix` — plus `scope`
(`"Global"` or `"Screen"`), the crop boxes and the pin percentages where it has a board.

- **`method`** is one paragraph stating what was compared, at what viewport, for which roles, and
  what was ruled out of scope. A report without it cannot be read fairly.
- **`deferred[]`** carries the withdrawn findings, the ones ruled out of scope, and observations
  about the design file. **A finding a reviewer has seen is published as withdrawn, never
  deleted.**

## 3. IDs are a map, never a position

`<PREFIX>-GLOBAL-nnn` and `<PREFIX>-SCREEN-nnn`, assigned from `projects/<portal>/frozen_ids.json`.
An ID a stakeholder has seen must never come to name a different finding — a developer may have
written a status against it. `engine/frozen_ids.py` proves it against the last committed master.

## 4. The tracker

One tab per portal in `docs/qc/MoSJE-Portal-QC-Tracker.xlsx`, named for the portal, with the
columns every other tab uses, plus `Coverage – <Portal>` and a `Rollup` row. Pushed to the Drive
copy **additively** — `Status`, `Assignee`, `Date` and `Notes` are dev-owned and are never
overwritten. **Coverage tabs stay local**; the Drive copy gets the findings tab only.

## 5. Figma

**One page per portal** in the Design QC file, holding exactly two sections:

- `ARCHIVE — <what and when>` — superseded artefacts and earlier reviewer notes, moved in, never
  deleted, with their positions preserved.
- `CURRENT — <run>` — the review sheet (`row · <slug>`, DESIGN | BUILD | ISSUES) and the pinned
  report (cover, boards with draggable markers on **both** sides, Finding Cards from the file's
  own kit, coverage appendix).

## 6. Drive

`<Short>-Design-QC-Report.pdf` in `MoSJE/Design QC/`. Report = anyone-with-link **reader**;
tracker = anyone-with-link **writer**.

## 7. Order of work — this is part of the spec

1. capture + Phase 0 design dump
2. **the review sheet** — the reviewer's editing surface
3. reviewer edits → "sync from Figma"
4. **only then** the pinned report, the PDF, the markdown and the tracker

A PDF or tracker generated before sign-off is rework, not progress.

## 8. The gates, all green before publishing

`out/coverage-ledger.json` (no UNMAPPED frame) · `out/crosscheck.md` (not FAIL) ·
`out/failures.md` (empty) · `out/claims.md` (0 failures) · `engine/frozen_ids.py` (0 re-mapped) ·
`engine/deliverable.py --check` (no regression against the baseline).

The last is a **ratchet**: `deliverable-baseline.json` records each portal's current gap count, a
portal may improve but never regress, and an improvement must be re-baselined so one portal's
cleanup cannot be silently spent on another's slippage.

### Known, recorded debt

| Portal | Gaps | Why |
|---|---|---|
| `eutthan-admin` | 2 | Its master predates the schema and has no `figmaUrl` or `method`. Both describe an audit no current session ran, and they will not be invented. |
| `scw` | 1 | 65 published findings and **no tab in the master tracker**. A real gap, recorded rather than hidden. |
