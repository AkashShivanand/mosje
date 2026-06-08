# Design Truth — DS Token Reference

> The canonical token values every portal is audited against, extracted from the **MoSJE Portal DS**
> Figma library (`u5eMCdX3a3mMZgnsHNn8XX`) as live Figma Variables. When a live portal's computed
> CSS deviates from these, it's a finding. **This file — not CLAUDE.md — is the comparison baseline.**

## ⚠️ Brand-primary reconciliation (read first)
The DS library defines **`Primary/Source = #003366`** (deep navy). `CLAUDE.md` documents `gov-blue #0373DF`.
These conflict. The **design** (DS + Handoff) is the truth for *fidelity QC*, so screens are audited
against **#003366**. The #0373DF vs #003366 divergence is logged once as a **program-level token decision**
to escalate, not repeated per screen.

## Color
| Token | Hex | |
|-------|-----|--|
| Primary / Source | `#003366` | brand primary |
| Primary / 100 | `#c8dbf0` | |
| Primary / 200 | `#9cbfe3` | |
| Primary / 600 | `#002b55` | |
| Primary / 800 | `#001933` | |
| Success / Source | `#27682a` | |
| Success / 100 | `#c8e6c9` | |
| Success / 200 | `#a5d6a7` | |
| Success / 500 | `#2e7d32` | |
| Success / 700 | `#1b5e20` | |
| Danger / Source | `#d64539` | |
| Danger / 100 | `#fad2cf` | |
| Danger / 400 | `#f15848` | |
| Danger / 600 | `#d64539` | |
| Neutral / Source | `#374151` | |
| Neutral / 0 – White | `#ffffff` | |
| Text / Dark | `#374151` | default text |
| Text / Light | `#ffffff` | on-dark text |

**Transparency ramps** (8% / 16% / 48%): e.g. `Primary Transparent/8% #00336614`, `/48% #0033667a`
(also Success, Danger). Used for focus rings and subtle fills.

## Typography — Noto Sans
Weights: Regular 400 · Medium 500 · SemiBold 600.

| Style | Size | Line-height |
|-------|------|-------------|
| display-1 | 56 | — |
| display-4 | 32 | |
| display-5 | 28 | |
| display-6 / headline-3 | 24 | 32 |
| title-1 | 20 | 28 |
| title-2 | 18 | |
| headline-6 / body-1 | 16 | 24 |
| label-1 | 14 | 20 |
| label-2 | 12 | |

Composite text styles in use: `Title/title-1`, `Title/title-2`, `Body/body-1`, `Label/label-1`, `Label/label-2`, `Headline/headline-3`.

## Spacing scale
`none 0 · sm 8 · md 12 · lg 16 · 2xl 24 · 3xl 32 · 6xl 56`

## Radius & effects
- **Corner radius (buttons):** `8`
- **shadow-xs:** drop-shadow `#2121211F`, offset (0, 2), blur 3, spread 1
- **Focus shadows:** Primary/Success/Danger, spread 2–4, bound to the 48% transparent tokens

## Component library (one set per DS page — the variant source of truth)
Accessibility Bar & Widget · Alerts/Toasts · Avatars · Badges · **Buttons** (full state matrix:
Default/Hovered/Pressed/Focused/Disabled × sizes, set `3369:7204`) · Card · Checkbox · Chips ·
Empty State · Loader · Radio Buttons · Search · Toggle · Icons · Logos & Gov Icons.

> When auditing a component on a live screen, compare against its DS component set states — a missing
> hover/focus/disabled/error state is a **Components & States** finding (rubric §1.4).
