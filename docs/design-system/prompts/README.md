# SAMAVESH foundation documentation prompts

Each file here is a **complete, pasteable brief** for documenting one foundation of the SAMAVESH
design system across both surfaces — the Figma library first, then the documentation website.

They are written to be executed by an agent with repo + Figma MCP access, and to be read by a human
reviewer as the spec that agent is being held to.

## How to run one

1. Open a fresh session.
2. Paste the contents of `NN-<foundation>.md`.
3. It will send you to `00-MASTER-documentation-law.md` first. That is deliberate — the master
   carries everything true of all foundations so it is stated once, not eleven times.
4. One foundation = one session = one branch = one PR. Do not batch two foundations into one
   branch; CLAUDE.md's short-lived-branch rule exists because a 12-commit-behind branch produced a
   14-conflict merge on 2026-08-11.

## The suite

| # | Prompt | Owns | Figma collection | Docs page today |
|---|---|---|---|---|
| 00 | `00-MASTER-documentation-law.md` | Shared law. Not runnable alone | — | — |
| 01 | `01-colour.md` | `color` 194+173, `on` 46, `chart` 38 | `Palette` 164 · `Color` 472 | 1,310 lines ✅ |
| 02 | `02-typography.md` | `font` 94, `leading` | `Type` 109 | 140 lines |
| 03 | `03-space-and-layout.md` | `space` 17, `inline`/`stack`/`padding`/`section` 32, `container` 5, `grid` 5, `breakpoint` 3 | `Space` 85 | 146 lines |
| 04 | `04-shape.md` | `radius` 12, `border.width` 5, `control.radius` | `Radius` 13 | **none** |
| 05 | `05-depth.md` | `shadow` 6, `elevation` 6, `layer` 8, `z` 8, `opacity` 14, `blur` 8, `overlay` 1 | `$effectStyles` | 128 lines (shadows only) |
| 06 | `06-motion.md` | `motion` 6+6 | `Motion` 12 | 154 lines |
| 07 | `07-sizing-and-density.md` | `size` 22, `target` 4, `icon.size` 5, `control` 2, `density` 8 | `Density` 8 | 155 lines (density only) |
| 08 | `08-iconography.md` | Material Symbols Rounded; 98 icon + 44 logo components | — | 168 lines |
| 09 | `09-accessibility.md` | Cross-cutting: WCAG 2.1 AA, GIGW 3.0, the UX4G widget, `focus` 3 | — | 310 lines |
| 10 | `10-token-architecture.md` | The three tiers, the naming grammar, provenance, governance, `Static` 46, `action` 288 | `Static` 46 | 118 lines (resources/tokens) |
| 11 | `11-CODE-CONNECT.md` | Design↔code sync: 84 published component sets ↔ 117 code exports | — | none |

**1,103 tokens** across four tiers; **909 variables** across eight Figma collections.

## Recommended run order

**02 → 03 → 04 → 05 → 07 → 06 → 08 → 10 → 09 → 11.**

> ⚠ **Revised 2026-08-12:** Typography's Phase 0 found it blocked on the `--ds-*` retirement (see
> the status ledger). Until that lands, start at **04 (shape)** — a new surface the retirement does
> not touch — then 05, then return to 02 → 03.

The reasoning:

- **Typography (02) first** — it is the foundation with the most existing work to build on, and it
  is the one the colour prompt already names as its companion. The two must read as one document.
- **Space (03) before Shape (04) before Depth (05)** — shape references the space scale for
  control geometry; depth references shape for the surfaces it raises.
- **Sizing (07) before Motion (06)** — motion durations are chosen partly by travel distance,
  which is a sizing property.
- **Token architecture (10) late** — it documents the grammar all the others exercise, so it is
  more accurate once they have been through Phase 0 and surfaced their drift.
- **Accessibility (09) second to last** — it is cross-cutting and should cite the finished pages
  rather than forward-reference them.
- **Code Connect (11) last** — it is not a foundation. It is the mechanism that keeps every
  foundation's *components* in sync once the foundations themselves are settled.

## Status ledger — update this when a prompt is run

| Prompt | Status | Branch / PR | Notes |
|---|---|---|---|
| 01 colour | ✅ Executed | `ds/colour-documentation` | Reference implementation. The master was extracted from it |
| 02 typography | ⚠ Phase 0 done, **blocked** | `docs/ds-foundation-documentation` | See `02-typography-phase0-findings.md`. **Blocked on `chore/retire-legacy-tokens` landing** — that branch rewrites the type vocabulary the page would document |
| 03 space & layout | ⏳ Not run | — | |
| 04 shape | ⏳ Not run | — | New surface — no page exists |
| 05 depth | ⏳ Not run | — | New surface — elevation page covers ⅓ of it |
| 06 motion | ⏳ Not run | — | |
| 07 sizing & density | ⏳ Not run | — | |
| 08 iconography | ⏳ Not run | — | |
| 09 accessibility | ⏳ Not run | — | |
| 10 token architecture | ⏳ Not run | — | |
| 11 Code Connect | ⏳ Not run | — | Entitlement re-probed 2026-08-12: **available** |

## Standing warnings

- **The `--ds-*` legacy vocabulary is being retired** on `chore/retire-legacy-tokens` as of
  2026-08-12. Do not author new `--ds-*` documentation. See the master, §⚠ IN-FLIGHT.
- **Check for concurrent sessions before every run.** This repo has had two simultaneous agent
  sessions twice (2026-08-11, 2026-08-12). If one is live, work in a git worktree.
- **`dbim` never reaches Figma.** The `Palette` collection's mode list stays `["Blue","Navy"]`.
