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
- `CURRENT — <run>` — the review sheet and the pinned report.

### The pinned report's structure — match it exactly

```
REPORT — <Portal>                          VERTICAL auto-layout, 1500 wide, fill #F1F5F9
  report-cover                             1436, fill #003366, r16
      title                                <Portal>, em dash, 30px Bold
      subtitle                             "Design vs Build — pinned discrepancy report · <status>"
      body                                 what was captured, from where, as whom; and that every
                                           marker's position is DERIVED from the element's real box
      tiles                                FINDINGS · BLOCKER · MAJOR · MINOR · NIT · SCREENS COMPARED
  screen-GLOBAL-<ID>  |  screen-<SLUG>-SCREEN     one frame per finding group
      section-header                       1436x44, fill #003366, r10
                                           "Global N — <title>"  or  "Screen — <name>"  + severity chips
      board                                fill #FFFFFF, r12, 1px #E2E8F0
          bhead                            fill #F8FAFB — "<route>   ·   <context>" + SCOPE: GLOBAL pill
          Screenshots                      fill #EEF2F7 — two 688 columns, "DESIGN — FIGMA INTENT"
                                           and "BUILD — LIVE (DEV)", markers on BOTH sides
          bfoot                            "<SLUG> · <Portal> · Design QC · <date>" + frame/page links
      Finding — <ID>                       an instance of the file's own Finding Card, one per finding
```

**Markers go on both sides**, because a marker on the build alone leaves a reader hunting for what
the design actually said.

**Only screens with something to say get a board.** A findings-free screen is accounted for by
NAME — in `audit-master.json`'s `coverage[]`, in the report's coverage sentence, and row by row in
the tracker's `Coverage – <Portal>` tab — not by a page of picture each. There is no coverage
appendix; the reviewer asked for it to go on 2026-09-11 and the accounting it was doing moved to
the ledger, which is where a reader can actually search it. (It had earned its keep once: laying
all 42 NMBA captures out at one size is what surfaced NMB-SCREEN-032. That argues for LOOKING at
every capture during the audit, which the coverage ledger still forces — not for shipping them.)

### The review sheet MUST carry pins — every portal, no exceptions

The 3-column `DESIGN | BUILD | ISSUES` sheet is where the reviewer works, and **every numbered
issue in the ISSUES column carries a matching numbered marker on the DESIGN image and on the BUILD
image**. Same component as the report's (`Pin/<Severity>`), same number, `layoutPositioning:
"ABSOLUTE"` inside the image frame.

This is not a nicety. Without pins the sheet asks the reviewer to find the thing the sentence is
about by reading the sentence — which is the one job the picture was put there to do — and it was
shipped without them twice before the reviewer insisted.

- Positions come from the SAME anchor boxes the report and the claim gates use, as a percentage of
  the image, so nothing is placed by hand. `build_rows.py` computes them into each row's `pins[]`.
- The numbering matches the ISSUES text exactly. If a finding is withdrawn, the survivors renumber
  and the pins renumber with them.
- A percentage outside 0–100 is dropped, not clamped: a pin at the edge of a picture the element
  is not on is a lie about where to look. GATE 3b fails the build for it.
- A finding with no anchor on a side gets no pin on that side, and `build_rows.py` reports any
  finding with no pin on EITHER side.

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
`out/failures.md` (empty) · `out/claims.md` (0 failures, GATE 3b included) ·
`engine/frozen_ids.py` (0 re-mapped) · `engine/deliverable.py --check` (no regression against the
baseline) · `python3 -m unittest discover -s engine -p 'test_*.py'`.

**GATE 3b — an anchor box must be ON the picture.** Added 2026-09-11 after NMB-SCREEN-027 shipped
with a build box at x1478–1798 on a 1440-wide capture: the marker was off the image entirely and
every other gate passed it. The page is often wider than the export — a horizontally scrolling
table, an off-canvas accessibility panel — so a box taken from page coordinates can sit outside
the PNG with nothing in the data looking wrong.

**An ABSENCE is confirmed against the live DOM, never against a capture.** NMB-SCREEN-016 claimed
the pledge banner had lost its call to action. The button was there all along; the capture had
been taken with the UX4G accessibility panel open, which widened the document and pushed the
button to x1841, outside the 1440 export. A capture is evidence of what a screen LOOKS like. It is
not evidence that something is missing. Before writing "not built", "absent" or "lost", check the
running page — and check ALL of them, not just the one you were challenged on. Running the sweep
over NMBA's remaining eight admin absence claims found two more that were false and three more that
were inaccurate in detail. `projects/<portal>/verify_absences.py` is the shape: one probe per
absence claim, each asking the live DOM, each reporting `absent: true | false | null`, where
**null means the probe could not see its subject and is not evidence of anything**. Run it before
publishing, and keep it beside the findings so the next pass re-runs it rather than re-deriving it.

**Every colour and every size is READ, never sampled.** The build side comes out of the DOM
(`getComputedStyle`, `getBoundingClientRect`). The design side comes from
`inputs/design-elements.json` for any TEXT node — it carries the real `fs`, `st` and `c` from the
API — and from the Figma Plugin API (`fills`, `strokes`, `cornerRadius`) for anything that is not
text. Sampling a pixel out of an exported PNG is a last resort, valid ONLY on a large flat fill:
on a glyph it returns the anti-aliased average of the glyph and its ground, which is how a
`#003366` icon reads as `#7F99B2` and how `#ED8525` was published as `#E08020`.

**And state what the colour sits ON.** Of the four number-claims this caught, none had the wrong
figure — all four had the wrong ground or container. A contrast ratio against an assumed white
background is wrong wherever the panel is transparent, which is most of them.

The last is a **ratchet**: `deliverable-baseline.json` records each portal's current gap count, a
portal may improve but never regress, and an improvement must be re-baselined so one portal's
cleanup cannot be silently spent on another's slippage.

### Known, recorded debt

| Portal | Gaps | Why |
|---|---|---|
| `eutthan-admin` | 2 | Its master predates the schema and has no `figmaUrl` or `method`. Both describe an audit no current session ran, and they will not be invented. |
| `scw` | 1 | 65 published findings and **no tab in the master tracker**. A real gap, recorded rather than hidden. |

The Figma side is not yet gated — it cannot be read from the repo. Two known divergences:
SMILE Beggary's pinned report has **no coverage appendix**, and its cover is stamped
`MACHINE-DRAFT`, which was accurate for the engine's own draft and is not accurate for a
report whose findings were afterwards curated by hand.
