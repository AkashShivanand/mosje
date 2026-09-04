# Foundations — audit and rebuild, 2026-09-04

> The foundation layer of SAMAVESH — tokens, their organisation, the Figma library that
> mirrors them and the documentation that explains them — audited against the systems
> the estate benchmarks itself on (Material 3, IBM Carbon, Shopify Polaris, Atlassian,
> GOV.UK, USWDS, Figma's own variables documentation) and rebuilt in the same change.
> Branch `ds/foundations-benchmark`. Every number below was counted, not estimated; the
> commands that produced them are in `docs/design-system/foundations-sync-guide.md`.

## 1. Verdict in one paragraph

The token pipeline was already unusual for its rigour — a three-tier DTCG source, a
written naming grammar with a contrast contract enforced in CI, value-named ladders, a
one-way Figma projection with per-collection checksums, 166 tests. What it lacked was
**coverage and consistency at the edges**: four foundations that world-class systems
treat as first-class (motion, layering, opacity intents, stroke) were either thin,
unconsumed or absent; the documentation layer had one shape for colour and typography
and five different shapes for everything else, with no gate; and the Figma variables,
while correctly named, were not uniformly carrying the five fields Figma gives a variable.
All of that is now closed. What remains open is listed in §8, with the reason.

## 2. What was found — token layer

| # | Finding | Evidence | Benchmark | Severity |
|---|---|---|---|---|
| T1 | **Motion had 3 durations, 4 curves and 5 intents.** No hover intent, so 7 rules paired `exit` duration with `enter` easing; 85 `Nms` literals and 139 `ease` keywords in DS CSS; 45 hand-written reduced-motion queries, each different | `packages/design-system/components/**/*.css` scan | Material 3: 4 bands × 4 steps + 7 named curves; Carbon: 6 durations, 4 curves, 2 motion styles; Polaris: value-named durations | High |
| T2 | **A Tier-1 z ladder existed (Bootstrap 1000–1090) with zero consumers**, while components stacked at 20/30/60/70/90/1010/999999/2147483000 and the floating-element rule said "there is no `--sa-z-*` scale yet" | `git grep -- --sa-ref-z-` → 0; 45 z-index literals in DS | Every benchmark names its layers (Carbon `z-index` tokens, Polaris `z-index-1…12`, Atlassian `layer.*`) | High |
| T3 | **Opacity had a ladder but no intents.** DS CSS carried 0.5, 0.45, 0.48, 0.6, 0.7 for two meanings (disabled, muted) | 17 distinct `opacity:` literals | Material `state-layers` + `disabled 38%`; Polaris `opacity` scale + intents | Medium |
| T4 | **Stroke widths existed with zero consumers** — `stroke/0…4` added 2026-08-18, 110 `1px solid` literals still drew every edge | scan | Carbon `border-width`, Polaris `border-width-*` bound everywhere | Medium |
| T5 | **Shadows were CSS strings, easings were strings** — not DTCG composite types, so no tool could read a layer without parsing CSS | `primitive.json` | DTCG 2024: `shadow` and `cubicBezier` are composite types | Medium |
| T6 | **61 semantic leaves had no effective `$type`** (`chart`, `bg`, `text`, `border`, `overlay`, `density`, `layout`, `focus`, `control`, `leading`); 7 primitives (motion) likewise; 402/479 semantic and 269/375 primitive leaves had no `$description` in source | node walk of `src/*.json` | DTCG requires `$type` per token or inherited; every benchmark ships a description | Medium |
| T7 | **Breakpoints were documented nowhere a reader would look** (inside Layout Grid) and three of six lacked a description | — | Carbon, Polaris, Material each publish a breakpoints page | Low |
| T8 | **Two elevations of six were in the TS mirror; no motion, z, breakpoint or alpha in TS** — a Framer Motion variant or `matchMedia` had to retype the number | `generate-ts-mirror.mjs` | Every benchmark ships a JS export of every token | Low |
| T9 | **Figma variables did not carry `hiddenFromPublishing` in the payload**, and the exporter's own description still named "seven collections" and a `Theme` collection that no longer existed; dead title-case code | `figma-variables.mjs` | Figma: name · description · scopes · code syntax · hidden | Low |
| T10 | **Inherited** from the parent branch: 21 derived `lhDevanagari` tokens exported but not authored (roundtrip red), and the Type collection checksum stale | `npm test -w @mosje/tokens` on HEAD | — | Inherited |

Not defects, recorded so they are not rediscovered: the colour system, typography scale,
spacing/radius ladders and the grammar are at or above benchmark (see the 2026-09-04
colour and typography audits); `size/*` in rem is correct; DBIM modes are code-only by
standing instruction.

## 3. What was found — documentation layer

| # | Finding | Evidence |
|---|---|---|
| D1 | **Five page shells across eleven pages**; 0 of 11 with a maturity badge, tabs or feedback bar (the six-element standard is 0/11) | census of `foundations/*/page.tsx` |
| D2 | **Elevation documented 3 of 6 roles**, printed `rgba(33,33,33,…)` (retired ink) and labelled `card` "pressed" and `modal` "dropdowns" | `elevation/page.tsx` before |
| D3 | **Motion hard-coded the durations it documented** in its own demo CSS, below a table of the tokens for them | `motion/page.tsx` before |
| D4 | **"Tokens" landed 3rd–6th; half the titles were folder nouns** ("Guidance", "Tokens"); only colour and typography used claim titles | heading census |
| D5 | **Eight foundations had no page**: breakpoints, layering, opacity, stroke, sizing, states, brand & white-labelling, content & localisation (the last two named in the IA since 2026-06 and never built) | `nav.ts`, `INFORMATION-ARCHITECTURE.md` |
| D6 | **No gate looked at foundation pages** — every documentation gate was scoped to `components/` | `tools/ds-page-standard/check.mjs:45` |
| D7 | **Nav alphabetical**, not in dependency order; badges lived only in the nav | `nav.ts` |
| D8 | `design.md` still documented `--ds-shadow-*` and `--ds-duration-*`, a vocabulary retired 2026-08-12 | `design.md` §6 |

## 4. What was built

### 4.1 Tokens (source, build, outputs)

- **Motion.** Tier 1: `ref/motion/duration/{0,50,100,150,200,250,300,400,500,700}` (value-named, Polaris-style) and `ref/motion/easing/{linear,accelerate,decelerate,standard,emphasized}` (Material 3 vocabulary; the four existing curves renamed in place plus linear). Tier 2: twelve intents `motion/<intent>/{duration,easing}` — instant · hover · press · focus · enter · exit · expand · collapse · emphasis · reveal · page · loading (`spin`, `pulse`, `easing`) — plus `motion/stagger/{step,max}`. `tokens.css` emits one `@media (prefers-reduced-motion: reduce)` block collapsing every intent's duration to `0.01ms`; `instant` and `loading` are exempt by design.
- **Layering.** `z/{base 0, raised 1, dropdown 100, sticky 200, fixed 300, overlay 400, modal 500, popover 600, toast 700, tooltip 800, rail 1000, launcher 1010, statutory 999999, demo 2147483000, top 2147483001}` — Tier 2, code-only, three reserved. The Tier-1 Bootstrap ladder is retired (declared in `REMOVED` with evidence).
- **Opacity.** `alpha/disabled` (48) and `alpha/muted` (64) beside the thirteen-step ladder.
- **DTCG composites.** Shadows are arrays of `{color, offsetX, offsetY, blur, spread}`; easings are `[x1, y1, x2, y2]`. Two custom Style Dictionary transforms project them to the byte-identical CSS the estate shipped, proven by the visual contract (12 selector contexts, 16,440 resolved tokens).
- **Types and descriptions.** Every semantic group carries `$type`; every group lacking a description has one; motion, shadow and breakpoint rungs are described individually. `primitive.border.width` pins its own `$type` because Style Dictionary merges it with the semantic `border` colour group (a defect caught in the Figma payload before the push).
- **TS mirror.** `elevation`, `motion`, `z`, `breakpoint`, `alpha` exported from `@mosje/design-system/tokens`.
- **Generated docs data.** `build/generate-foundation-docs-data.mjs` → `apps/hub/src/lib/design-system/foundations-data.generated.ts`: 12 families, 318 rows, each with path · tier · CSS name · resolved value · raw · Figma name or exclusion reason · description. Gated by `check:docs-data`.

### 4.2 Adoption across the estate

| Rewrite | Count | Where |
|---|---|---|
| `Npx solid` → `var(--sa-stroke-N) solid` | 126 | 60 DS stylesheets |
| `z-index: N` (≥10) → `var(--sa-z-*)` | 21 + 8 | DS components; docs shell scrims, drawer, palette, skip link; nav sheet; demo dock |
| `Nms ease*` → intent pair by band | 108 | DS |
| `exit duration + enter easing` → `hover` pair | 37 | DS (the audit's exact defect) |
| disabled `opacity: 0.5/0.45/0.48` → `alpha/disabled` | 10 | DS |
| `blur(4px)` → `blur(var(--sa-blur-soft))` | 1 | command palette |

Skeleton and shimmer animations (`1.4s`, `2s`) were deliberately left on their authored
literals: they are `loading` family and the adoption script's first pass mis-tokenised
them (`1var(…)`); restored from git and recorded here.

### 4.3 Figma

- **Motion** 17 → 42 active variables, every duration a native **TIMING** (milliseconds) and every curve a native **EASING** (cubic-bezier control points) — the types Figma Motion binds directly. The first push had shipped them as FLOAT/STRING on the authority of a stale typings file; a live `createVariable` probe proved TIMING and EASING creatable, so the 41 mistyped variables were recreated with the correct type (the type is immutable) and the copies deleted after a full-file binding scan — 83 pages, ~100,000 nodes and text ranges, every alias and local style — found zero consumers. Read `4ff49255:42`, byte-equal to the payload.
- **Static** 92 → 86: `alpha/disabled`, `alpha/muted` (OPACITY by the API; `COLOR_OPACITY` ticked by hand in the panel the same day — the one scope the Plugin API cannot write); the eight `ref/z/*` Bootstrap rungs deleted after the same binding scan cleared them; descriptions re-asserted on 24 primitives. Byte-equal to the payload (`dc3e7298:86`).
- **Type**: the library already held the parent branch's 113-variable re-cut; the reconciliation record now says so instead of failing.
- **The standard** every future push follows: `.claude/rules/figma-variables-standard.md` — the six API-creatable types (COLOR · FLOAT · STRING · BOOLEAN · TIMING · EASING) and what each binds to, the value shapes TIMING and EASING take, the rule that a typings file is a claim and a probe is evidence, modes only on collections whose variables all vary on the axis, and the five fields (name = path, description, narrowest scopes, `codeSyntax.WEB`, `hiddenFromPublishing` by tier).

### 4.4 Documentation architecture

- **`FoundationDocPage`** (`docs-kit/foundation-doc-page.tsx`) — the one shape: eyebrow · name · badge · summary · Figma link or declared absence · counted "at a glance" · Overview / Tokens / Accessibility tabs · `NN / KEYWORD` claim-titled sections with an in-page contents list · generated token table (`FoundationTokenTable`: token · value with preview · Figma home or exclusion reason · use) · accessibility criteria (default untested) · standards register (clause · says · does · why) · related · feedback.
- **19 pages on it**, 8 new: Brand & White-Labelling, Breakpoints, Sizing, Stroke, Layering, Opacity, Interaction States, Content & Localisation. Every page's stylesheet is layer-scoped and token-only.
- **Nav in dependency order** (`INFORMATION-ARCHITECTURE.md` §1), `llms.txt` and search derive from it.
- **Gate:** `npm run check:foundations` — template props matched on usage, plus a literal scan (ms, hex, hand-typed inline style); no baseline; inside `npm run check`.
- **Rule:** `.claude/rules/foundation-documentation-standard.md`.
- `design.md` v0.49.0: elevation, motion, layering, opacity and stroke sections rewritten to `--sa-*`; state definitions updated. Changelog v0.101.0.

## 5. Naming and organisation — what changed and what deliberately did not

| Decision | Reasoning |
|---|---|
| Durations value-named (`150`, not `fast`) | The house rule for every ladder since 2026-08-18: a name that is the value can be checked against what renders, and a ladder can grow without renaming its neighbours. Polaris does the same. |
| Easings behaviour-named (`decelerate`, not `out`) | Material 3's vocabulary is what a designer and a developer both already know; `outStrong` told nobody what it was for. |
| Intents are pairs | A duration without its easing is half a decision; the mismatched pairs in the DS were the proof. |
| z is Tier 2 only, no primitive | A primitive that nothing aliases and no canvas can bind is noise. Every benchmark authors layering once. |
| z not exported to Figma | A canvas has no z-axis; the exclusion is stated in `unmapped`, never silent. |
| Shadows stay `rgba(…)` strings inside the composite | The colour is derived by `brand-ramps.mjs` from `neutral/800`; an alias-with-alpha form waits on DTCG colour-object support in Style Dictionary, and the current form keeps the Figma effect-style parity byte-identical. |
| `semantic.json` NOT split into per-foundation files | 30 files read `src/semantic.json` by path (tests, generators, gates). The discoverability the split would buy is delivered by group descriptions and the generated foundations index at lower risk. Recorded as a follow-up, not a defect. |
| Prominence words (`subtler` < `subtle`) NOT renamed | A 495-variable Figma rename, already deferred in the colour audit; out of this change's scope. |

## 6. Accessibility

- Reduced motion is honoured at the token layer for every intent (WCAG 2.3.3, AAA); `loading` deliberately keeps running (a stopped spinner reads as frozen).
- `motion/focus` is instant — a ring never fades in (2.4.7); `focus/width` = 2px, drawn as an outline (2.4.11, forced-colors).
- `alpha/disabled` is bound only on disabled selectors; disabled text stays an opaque ink (1.4.3 exemption used deliberately, never for enabled content).
- Every accessibility row on every page defaults to `untested`; `verified` rows name their evidence. No green tick was granted without one.

## 7. Before → after, in numbers

| Measure | Before | After |
|---|---|---|
| Motion intents / durations / curves | 5 / 3 / 4 | 12 (+stagger) / 10 / 5 |
| Reduced-motion handling | 45 per-component queries | 1 token-layer block |
| Layering tokens consumed | 0 | 15 rungs; 29 literals bound |
| Stroke tokens consumed in DS CSS | 0 | 126 |
| Opacity intents | 0 | 2 |
| Semantic leaves with no `$type` | 61 | 0 |
| Semantic groups with no description | 6 | 0 |
| DTCG composite types | 0 | shadow, cubicBezier |
| TS mirror families | 5 | 10 |
| Foundation pages / on one template / with badge+tabs+feedback | 11 / 0 / 0 | 19 / 19 / 19 |
| Foundation pages typing their own values | 2 | 0 (gated) |
| Foundations documented in Figma but not on the web | 2 | 0 |
| Figma Motion variables | 17, FLOAT/STRING | 42 native TIMING/EASING (byte-equal) |
| Token tests | 164 pass · 2 fail (inherited) | 166 pass |

## 8. Still open, and why

| Item | Why it is not in this change |
|---|---|
| Per-foundation source files | See §5. |
| Portal-owned CSS (`smile-admin`, `pm-ajay`, `eutthan-admin`) z-index literals | Portal stylesheets are owned by their redesign work (`ds-linkage` config); the ladder is documented for them to adopt. |
| Skeleton/shimmer loops on literals | `loading` family; binding them to `motion/loading/pulse` changes their timing and needs a visual pass. |
| Dark theme, i18n framework, RTL | Out of scope and unchanged; the Content & Localisation page states them as open. |
| The parent branch's `lhDevanagari` roundtrip failure | Belongs to `ds/typography-harmonisation`; its 21 derived tokens need a `derived` marker the roundtrip test recognises. Noted there. |
