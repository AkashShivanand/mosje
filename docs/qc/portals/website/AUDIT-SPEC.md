# dosje.gov.in — Website Design QC, Standards Audit and Clone Completeness

Kick-off brief, 2026-09-17. A future session reads this first.

## Decisions (asked and answered, 2026-09-17)

| Question | Decision |
|---|---|
| Audit depth for 8,782 live URLs | Every standalone page (94) in full; each record template (13 types) once per state; every record crawled by machine for data completeness |
| Clone record data | All metadata committed as JSON through `apps/hub/scripts/ingest`; PDFs link to the live file; images mirrored only where a page renders them |
| Tracking | New `MoSJE Website` tab in `MoSJE-Portal-QC-Tracker.xlsx`, merged additively into the Drive copy; every point written out in full |
| Figma handoff file | Report only — the design team edits the file |
| Protected clone work | PM-AJAY and NMBA pages as they stand on `main` are not rolled back |

## Inputs

- Live: https://www.dosje.gov.in/ (WordPress + Elementor), sitemap captured in `tools/design-audit/projects/website/inputs/live-sitemap.tsv`
- Design: Figma `MoSJE [Handoff]` — `Ds5qx61QsI0ZkYSrLKxo0A`
- Standards: DBIM 3.0, GIGW 3.0 / WCAG 2.2 AA, UX4G 3.0 — `docs/guidelines/`
- Prior art: `docs/audit/dosje-gov-in-compliance-audit-2026-09-10.md` (80-checkpoint DBIM pass), DBIM tracker Google Sheet (T01–T41)

## Live inventory (2026-09-17)

| Type | Records | Audit unit |
|---|---|---|
| Standalone pages | 94 | each page, desktop 1440 + mobile 375 |
| documents | 6,000 | list + filtered + detail |
| events | 635 | list + detail |
| gallery | 590 | list + album + lightbox |
| official | 453 | directory + detail |
| tender | 312 | list + detail |
| organisation | 248 | detail (sub-pages) |
| vacancies | 164 | list + detail |
| schemes-and-services | 138 | list + detail |
| scheme-documents | 100 | detail |
| suo-moto-disclosure | 14 | list + detail |
| cpio | 13 | list |
| booking | 12 | detail |
| updates | 9 | list + side sheet |

Global states: 5 mega menus, mobile menu, search (results / no results), 404, accessibility panel, Hindi, filters applied, pagination, lightbox.

## Sub-goals (each is countable; done means the count is met)

| # | Sub-goal | Done when |
|---|---|---|
| G1 | Inventory + coverage matrix live ↔ Figma ↔ clone | every live page and template has a row with its Figma frame (or "no design") and clone route (or "missing") |
| G2 | Live capture | 120 inventory entries + global states captured at 1440 and 375, each with a DOM extraction |
| G3 | Figma Phase 0 | every handoff frame listed with heading, exported, mapped or marked unmapped |
| G4 | Standards audit | every entry checked against the DBIM / GIGW / UX4G checklist; findings with evidence boxes |
| G5 | Design-vs-build audit | every mapped frame compared; findings with pins |
| G6 | Dev PDF + tracker tab | `audit-master.json` → PDF; tracker tab pushed additively with a backup and diff proof |
| G7 | Design-fix report | design defects, undesigned views, UI/UX improvements for the PMO audit — separate PDF + markdown |
| G8 | Clone data | every ingestible collection synced; manifest shows no gaps |
| G9 | Clone pages | every missing page and template built from DS components, browser-verified at 1440 and 375 |

Out of scope: rewriting pages already redesigned under PM-AJAY and NMBA; editing the Figma handoff file; certifying the human-only accessibility checks (screen-reader walkthrough) — listed as 👤 items.
