# MoSJE Portal — Design QC System

A repeatable, portal-agnostic system for auditing **live portals against their Figma designs** and
producing a developer-ready, visually-annotated discrepancy report plus a unified tracker. Built so
every portal is reviewed to the **same senior-designer standard**.

> **▶ To actually run an audit, use the config-driven engine + manual, not this page.**
> Home & docs map: **[`tools/design-audit/README.md`](../../tools/design-audit/README.md)** ·
> plain-English quick start: **[`USER-GUIDE.md`](../../tools/design-audit/USER-GUIDE.md)** ·
> full end-to-end manual: **[`AUDIT-A-PORTAL.md`](../../tools/design-audit/AUDIT-A-PORTAL.md)** ·
> correct/add screens: **[`SYNC-GUIDE.md`](../../tools/design-audit/projects/nhapoa/SYNC-GUIDE.md)**.
> This page documents the report's fixed visual language + the shared tracker (`rubric.md`,
> `annotation-system.md`, `MoSJE-Portal-QC-Tracker.xlsx`), which the engine's report follows.

## How it works (per screen)
1. **Design truth** — Figma frame screenshot + tokens/specs (`design-truth-tokens.md`).
2. **Live truth** — authenticated screenshot + computed CSS at matched viewports.

> **Live truth is captured once.** A portal captured within its staleness window already has a
> `capture-bundle.json` (tracked; the raw `captures/` corpus is not); the QC run reuses it and
> re-captures only what moved, verified against `out/freshness.md`. See
> `tools/design-audit/AUDIT-A-PORTAL.md` §2b.

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
