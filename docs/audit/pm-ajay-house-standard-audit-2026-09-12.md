# PM-AJAY — design audit against the house standard, 2026-09-12

**Status: MACHINE-DRAFT.** Every finding below was measured, or read from the live DOM. The human
gates — keyboard and screen-reader walkthrough, Hindi and truncation, severity sign-off — are not
signed, so this is not a compliance certificate.

Report page: published as an artifact (link in the session).
Machine evidence: `tools/design-audit/projects/pm-ajay/out/` — `conformance.json`,
`coverage-ledger.json`, `fixpreview.json`, `audit-master.json`.

> **Re-issued.** The first version of this report convicted against the generated `--sa-*` token
> contract and treated the Figma handoff file as corroboration only. **That was the wrong way
> round**, and it changed the findings: the build's Tailwind-v4 slate neutrals were filed as a
> design-system gap that *excused* the portal, and two of them — `#4a5565` and `#364153`, in fact
> on **all 224 screens** — were absolved on the strength of a single Figma page. The authority is
> the handoff file; the contract cross-references it. Findings below are the re-issue.

## Why this audit has no side-by-side

PM-AJAY has no per-screen Figma design. The handoff file's PM-AJAY page (`8943:41048`) exists and
holds 5,857 text nodes, but the user confirmed on 2026-09-12 that it is a **draft that may not
reflect the built UI** — and it is measurably the least token-bound page in the file: **30% of its
fills are bound to a variable, against 47% across the other ten pages.**

So there is no DESIGN panel. But "no frames for this screen" is not "no standard": the estate's
visual language is established across the file's **eleven other pages**, several marked *Dev
Synced*, and that is what the development teams build from. The build is audited against that
language (`tools/design-audit/house/`, prose at `docs/design-system/samavesh-house-standard.md`),
with the generated `--sa-*` contract as cross-reference. **Allowed is the union of the two** —
using the design system is never a defect either — so a value in neither is charged to the portal.
Two findings carry a **PROPOSED** panel in place of the design panel: the fix rendered on the live
screen by `engine/fixpreview.py`.

## What was measured

| | |
|---|---|
| Environment | `pmajay-dev.mosje.in` (Vite SPA — the rest of the estate is Next 16) |
| Screens measured | **224 — every declared route, all 12 roles.** Route-coverage gate PASS, nothing unreachable |
| Elements checked | 35,011 (1,602 off-canvas third-party elements excluded) |
| Conformance to the estate's language | **7.6%** of elements |
| Concentration | **ten values explain 95.7%** of all 53,783 charged deviation instances |
| Findings | 7 curated — 4 portal, 3 design-system — over 50 machine-charged values |
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
| PMA-GLOBAL-001 | Major | **The whole type scale is 3px larger than the estate's.** `--text-xs` is 15px (Tailwind ships 12), `--text-sm` 17px (14), `--text-base` 19px (16). Body text is **17px on 18,340 elements across 221 of 224 screens** — the largest single deviation here — plus 15px on 3,589, 21px on 246, 19px on 78. The file's body size is 14px on 11,021 nodes across every page; none of the build's four sizes is drawn anywhere in it. **Fix rendered.** | `--sa-type-body-1/2/3-size` |
| PMA-GLOBAL-002 | Major | **Body and label text uses Tailwind v4 slate, not the estate's ink.** `#314158` on 12,770 elements / 204 screens, `#4a5565` on 5,291 across **all 224**, `#0f172b` on 4,327, `#364153` on 3,917 across **all 224**, plus `#45556c`, `#62748e`, `#90a1b9`. The estate's ink is `#1f2937` (25,774 nodes, all 11 pages) / `#374151` / `#6b7280`. None of the build's seven values is in the file **or** the contract — this portal matches neither. **Fix rendered.** | `--sa-text-neutral-base/-subtle/-subtler` |
| PMA-GLOBAL-003 | Major | **The portal loads none of the design system's tokens** — 0 `--sa-*` properties in any stylesheet it serves; it defines its own `--primary-color: #0a3a74`. This is the mechanism behind the two above. Noto Sans *is* applied (728 of 766 elements), so the typeface is right. | `--sa-text-neutral-base`, `rules/design-system-architecture.md` |
| PMA-GLOBAL-004 | Minor | **Status colours come from Tailwind's palette, and one meaning has four greens** — `#008236`, `#007a55`, `#00a63e`, `#006045` all for approved/on-track. The estate uses `#ec5042` (868 nodes, all 11 pages) and `#2e7d32` (919, 9 pages). | `--sa-text-status-error-base`, `--sa-bg-status-success-base` |

## Findings — the design system (not the portal's to fix)

| ID | Severity | Finding |
|---|---|---|
| PMA-DS-001 | Major | **The contract does not publish the estate's own most-used colours.** `#1f2937` (25,774 nodes, all 11 pages), `#374151`, `#e5e7eb`, `#d1d5db`, `#f9fafb`, `#e5eff9`, plus `#ec5042` and `#2e7d32` — **not one appears even once in `tokens.css`**, which publishes `#1e2124`/`#3a3d41`/`#dcdee1`/`#6f757d` instead. Three ramps, no two agreeing, and a developer asking "which grey is correct?" has three defensible answers. That condition is what produced PMA-GLOBAL-002. |
| PMA-DS-002 | Minor | **Two established type steps are unreachable from a conformant stylesheet.** The estate draws 13px on 1,639 nodes across all 11 pages and 11px on 1,013 across 10; the contract publishes neither. 11px exists only as `--sa-ref-size-11`, a Tier-1 primitive app code may never consume. |
| PMA-DS-003 | Minor | **The handoff file carries its own drift on every page.** `#d9d9d9` — Figma's default rectangle fill — on 4,130 shapes; pure `#000000` on 4,154 nodes where the file's own ink is `#1f2937` by a factor of six; and six typefaces against a standing Noto Sans instruction (Inter on 3 pages / 282 nodes, plus Roboto, Open Sans, Poppins, Helvetica Neue, and Material Icons Round — the wrong icon font). Just over half of all sampled fills are literals, not bound variables. These are excluded from the standard, so no portal is charged for them — but they are what a developer copies. |

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
