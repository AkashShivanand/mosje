# PM-AJAY — design audit against the house standard, 2026-09-12

**Status: MACHINE-DRAFT.** Every finding below was measured, or read from the live DOM. The human
gates — keyboard and screen-reader walkthrough, Hindi and truncation, severity sign-off — are not
signed, so this is not a compliance certificate.

Report page: published as an artifact (link in the session).
Machine evidence: `tools/design-audit/projects/pm-ajay/out/` — `conformance.json`,
`coverage-ledger.json`, `fixpreview.json`, `audit-master.json`.

## Why this audit has no side-by-side

PM-AJAY has no per-screen Figma design. The handoff file's PM-AJAY page (`8943:41048`) exists and
holds 5,857 text nodes, but the user confirmed on 2026-09-12 that it is a **draft that may not
reflect the built UI** — and it is measurably the least token-bound page in the file: **30% of its
fills are bound to a variable, against 47% across the other ten pages.**

So there is no DESIGN panel. The build was audited against the **SAMAVESH house standard**
(`tools/design-audit/house/`, prose at `docs/design-system/samavesh-house-standard.md`), which
convicts only on the generated `--sa-*` token contract and uses all twelve pages of the handoff
file to corroborate and rank. Two findings carry a **PROPOSED** panel instead: the fix rendered on
the live screen by `engine/fixpreview.py`.

## What was measured

| | |
|---|---|
| Environment | `pmajay-dev.mosje.in` (Vite SPA — the rest of the estate is Next 16) |
| Screens measured | **224 — every declared route, all 12 roles.** Route-coverage gate PASS, nothing unreachable |
| Elements checked | 35,011 (1,602 off-canvas third-party elements excluded) |
| Token adoption | **9.3%** |
| Concentration | **ten values explain 95.3%** of all 35,115 charged deviation instances |
| Findings | 7 curated — 4 portal, 3 design-system — over 45 machine-charged values |
| Capture integrity | Layout canary: **all 224 screens held still**. No finding rests on a screenshot that stopped describing its page |

**Read the concentration figure before the adoption figure.** 4.7% invites "most of this portal is
wrong", and that is not what the measurement says. Almost every charged element fails on one of
three decisions, each made once in a stylesheet.

## The portal findings are global, not the Ministry's alone

The report's strongest claim is that these four belong to every role. It is now a **census, not a
sample**: both root causes appear in **all twelve roles**, because both live in the shared shell.

| Role | Screens | Elements at 15px | Elements on slate ink |
|---|---|---|---|
| Ministry | 48 | 1,669 | 14,459 |
| Grant-in-Aid · district maker | 21 | 352 | 1,742 |
| Grant-in-Aid · district checker | 14 | 95 | 959 |
| Grant-in-Aid · state maker | 21 | 319 | 1,921 |
| Grant-in-Aid · state checker | 17 | 118 | 1,390 |
| Hostel · district maker | 10 | 184 | 1,004 |
| Hostel · district checker | 7 | 87 | 694 |
| Hostel · state maker | 13 | 227 | 1,344 |
| Hostel · state checker | 10 | 107 | 932 |
| Adarsh Gram · village | 20 | 188 | 1,585 |
| Adarsh Gram · district | 27 | 215 | 2,161 |
| Adarsh Gram · state | 16 | 385 | 1,744 |

## Findings — the portal

| ID | Severity | Finding | Cites |
|---|---|---|---|
| PMA-GLOBAL-001 | Major | **No `--sa-*` token is loaded anywhere.** 0 design-system custom properties in any stylesheet the portal serves; it defines its own `--primary-color: #0a3a74`. This is the root cause of the three below. Noto Sans *is* applied (728 of 766 elements), so the typeface is right. | `--sa-text-neutral-base`, `rules/design-system-architecture.md` |
| PMA-GLOBAL-002 | Major | **Tailwind's type scale is redefined +3px.** `--text-xs` is `.9375rem` (15px) against Tailwind's `.75rem`; `--text-sm` 17px; `--text-base` 19px. Every utility resolves through them, so elements marked `text-xs` — the smallest step — render at 15px, a size the contract does not publish. **Fix rendered.** | `--sa-type-body-1/2/3-size` |
| PMA-GLOBAL-003 | Major | **Body and label text uses Tailwind v4 slate,** not the published ink: #314158 on 7,033 elements across 43 screens, plus #0f172b, #45556c, #62748e, #1d293d, #90a1b9. None appears in the contract. **Fix rendered.** | `--sa-text-neutral-base/-subtle/-subtler` |
| PMA-GLOBAL-004 | Minor | **Status colours come from Tailwind's palette,** not the status tokens — and four different greens carry one meaning. | `--sa-text-status-error-base`, `--sa-bg-status-success-base` |

## Findings — the design system (not the portal's to fix)

| ID | Severity | Finding |
|---|---|---|
| PMA-DS-001 | Major | **Three neutral ramps are in use and none knows about the others.** The Figma library draws Tailwind v3 grey (`#1f2937` on 23,853 sampled nodes, all ten non-draft pages); the contract publishes `#1e2124 / #3a3d41 / #dcdee1 / #6f757d`; the build serves Tailwind v4 slate. **Not one of the library's greys appears even once in `tokens.css`.** 4–11 points apart per channel. Until this is settled, a neutral-colour finding against any portal is unanswerable. |
| PMA-DS-002 | Minor | **The contract has no 11px step; the library's `label-3` is 11px.** The estate draws 11px on 9 of 10 pages (898 nodes). 11px exists only as `--sa-ref-size-11`, a Tier-1 primitive app code may never consume. |
| PMA-DS-003 | Nit | **`#001933`** is drawn on 7 pages (165 nodes) and published by neither layer. |

## One finding was withdrawn as false

A fifth portal finding — *"dashboard figures never arrive, and the empty result is drawn as an
em-dash"* — was drafted from the capture harness's `STILL LOADING (22 skeleton placeholders)`
warning. That heuristic counted any empty coloured div 6–60px tall as a placeholder; on this
dashboard those are its **progress bars**. The figures had all arrived in the same extraction
(47,333 / 22,030 / 19,763 / 14,994, zero em-dash rows) and the page carries 15 `role="status"`
elements. The heuristic is now saturation-aware.

Recorded rather than deleted: **a warning from an instrument is not evidence about the product
until the instrument has been checked.**

## Outstanding

- **151 of 223 declared routes not yet captured** — the remaining roles. The four portal
  findings are global (shell, type scale, palette, all shared), so those roles will add
  screen-specific findings rather than change these.
- **The human track**: keyboard and screen-reader walkthrough, focus order, meaningful alt text,
  Hindi and truncation, brand/emblem and GIGW mandatory elements, severity sign-off.
- **The layout canary's warnings on the first pass were FALSE POSITIVES, and the captures were
  sound.** After the fix the portal was re-captured in full and all 224 screens held still. It fired on 7 of 62 captures — 5 of 14 GIA screens — reporting e.g. `'Add Beneficiary'
  x1220 → x44`. The canary keys on text, and "Add Beneficiary" is both the top-right button
  (x1220) and a sidebar nav item (x44); "Beneficiary List", "Misc. Reports", "Project Status" and
  "Executive Summary" are each a page heading *and* a sidebar label, so the before and after
  readings keyed to different elements. Every screenshot was checked and is correct, sidebar and
  all. The canary now keeps only text that occurs exactly once on the page.

  The portal was re-captured from scratch against the fixed engine rather than leaving false
  records in the bundle: 224 screens, 0 layout-shift warnings, and `gate_capture_layout` turned
  from SKIP into a real PASS. That re-capture also added `radiusRaw`, so percentage radii, real px
  radii and the browser's `rounded-full` clamp are now distinguishable instead of relying on the
  plausibility fallback.
- **A phantom route** (`/https://seniorcitizen-admin.dosje.gov.in/login`) produced a 404 capture
  that the coverage ledger counted as a screen. Its origin was not reproducible; the engine is
  hardened at `routes._clean` so it cannot recur, and the capture was removed. Not raised as a
  build defect — unproven.

## Notes on the portal that are not findings

- The sidebar is a `<nav>` of `<button>` elements with **no `<a href>` anywhere on the page**, so a
  link-following crawl finds nothing at all. All 223 routes were harvested from the Vite bundle's
  own route table (`/assets/index-*.js`).
- `/transgender/dashboard` appears in the PM-AJAY bundle's route table. Out of scope here; recorded
  as bundle leakage rather than audited.
- Login is **email + password + OTP** (three factors), which needed a new `password-otp` auth type
  in the engine.
