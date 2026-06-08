# MoSJE Portal — Design QC System

A repeatable, portal-agnostic system for auditing **live portals against their Figma designs** and
producing a developer-ready, visually-annotated discrepancy report plus a unified tracker. Built so
every portal is reviewed to the **same senior-designer standard**.

## How it works (per screen)
1. **Design truth** — Figma frame screenshot + tokens/specs (`design-truth-tokens.md`).
2. **Live truth** — authenticated screenshot + computed CSS at matched viewports.
3. **Diff** across 6 axes with quantified deltas (`rubric.md`).
4. **Annotate** — one comparison board PNG with numbered callouts (`annotation-system.md`).
5. **Log** — one row per finding in the unified Excel tracker.

## Files
| Path | Purpose |
|------|---------|
| `rubric.md` | Severity scale, 6 diff axes, tolerances, defect-vs-not rules |
| `annotation-system.md` | The fixed visual language for annotated boards |
| `design-truth-tokens.md` | Canonical DS token values (the comparison baseline) |
| `templates/annotation-board.html` | HTML→PNG template for annotated boards |
| `MoSJE-Portal-QC-Tracker.xlsx` | The unified tracker (one sheet/portal + rollup) |
| `portals/<portal>/figma-inventory.md` | Designed-screen inventory (node ids) |
| `portals/<portal>/coverage-matrix.md` | Figma↔live mapping + QC status |
| `portals/<portal>/captures/figma|live/` | Raw captures |
| `portals/<portal>/annotated/` | Final annotated boards |
| `portals/<portal>/findings/` | Per-screen finding notes |

## Portals
| Portal | Live URL | Figma | Status |
|--------|----------|-------|--------|
| eUtthan Admin | https://eutthan-admin-uat.mosje.in | Handoff `gH2vQ62cfg4677YKWuOpLc` (40 screens) + DS `u5eMCdX3a3mMZgnsHNn8XX` | In progress |

## Severity legend
🔴 Blocker · 🟠 Major · 🟡 Minor · ⚪ Nit — defined in `rubric.md`.

> Beyond fidelity, the audit also proposes designs for **live screens that were never designed**
> (only key screens were) and flags **design bugs** in existing frames — see `rubric.md` §6.
