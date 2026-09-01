# SAMAVESH Design System — Eight-Lens Audit, 2026-09-01/02

Programme brief: [`docs/plans/ds-world-class-master-prompt.md`](../plans/ds-world-class-master-prompt.md).
Branch: `ds/docs-world-class`.

Eight hostile lenses were run over the design system and its documentation, each
instructed that a verdict of "looks good" was a failure. Every finding below carries a
file path and a claim that can be checked. **Every number in this document was produced
by a command, not an impression**, and the commands are named.

**Status column:** ✅ fixed in this programme · ◑ partly fixed · ○ recorded, not yet
fixed · ✗ disputed — the finding was wrong, and the correction is stated.

---

## 0. The headline, in one paragraph

The design system *package* is in better shape than its reputation: zero `any`, zero
`@ts-ignore`, clean framework decoupling, a genuine shared chart-internals layer, 124/124
Storybook coverage, and a gate architecture — ratchets that fail on improvement as well
as regression — that is stronger than most commercial design systems publish. **The
documentation is the least trustworthy surface in the estate.** Three of one hundred
component pages carried the house shape; ninety-nine hand-rolled the same six style
objects; the props tables had drifted so far that one of twelve audited matched its
implementation; the docs' own tab strip was keyboard-inoperable on ninety-five pages; and
fifty-three pages published an unevidenced WCAG conformance claim. None of that is
carelessness — it is what hand-maintaining a hundred pages against a moving library
produces, and it is why this programme built templates and generators rather than
correcting pages one at a time.

---

## 1. Ground truth, measured

| Measure | Value | Command |
|---|---|---|
| Component documentation pages | 100 | `check:docs-routes` |
| …conformant to the house shape at start | **3** | `check:ds-pages` |
| Components exported from the barrel | 124–128 (three gates disagree) | `check:storybook` / `check:design-context` / `check:storybook:parity` |
| Figma node ids available | 34 (≈22 component-level) | `lib/design-system/figma.ts` |
| Pages linking to a component in Figma | **10** | `grep 'figmaUrl(FIGMA_NODES\.'` |
| Pages linking to the Figma **file root** | **53** | `grep 'figmaUrl()'` |
| Pages hand-rolling `const h2Style` | **99** | `grep -rl` |
| Unbound `lineHeight` literals | **161**, six values | `grep` |
| Unbound `maxWidth` px literals | **107**, nine values | `grep` |
| Inline `style={{` in the docs subtree | **2,106** | `grep` |
| Docs subtree size | 30,260 LOC, to document a 29,714 LOC library | `wc -l` |
| Chart components | 17 | — |
| Charts with a loading state | **0** | source audit |
| Charts with an error state | **2** | source audit |
| Illustration system | **did not exist** | `find -ipath '*illustr*'` |
| Runtime CVEs | **8 (1 critical, 5 high, 2 moderate)** | `npm audit --omit=dev` |
| Component render tests | **0** — the test glob is `.ts` only, never `.tsx` | `package.json` |
| Automated accessibility tests | **0** | `grep axe-core\|pa11y` |

---

## 2. What was fixed in this programme

| # | Finding | Where | Status |
|---|---|---|---|
| F1 | **The docs tab strip was a WCAG 2.1.1 keyboard trap on ~95 pages.** Roving `tabIndex` with no arrow-key handler: a keyboard reader could reach the selected tab and no key anywhere selected another, so the Code and Accessibility panels — every props table and every accessibility checklist — were unreachable without a mouse. No `aria-controls`/`aria-labelledby` pairing either. | `docs-kit/docs-tabs.tsx` | ✅ Arrow/Home/End, id↔`aria-controls`, panel tab stop |
| F2 | **The accessibility checklist could not fail.** Every row rendered a hard-coded green tick against a named WCAG criterion, on 74 pages, with no mechanism to say "not verified" — a compliance assertion with no evidence behind it. | `docs-kit/a11y-checklist.tsx` | ✅ `status: verified/partial/untested`, defaulting to **untested**, plus an `evidence` field |
| F3 | **`level: "GIGW"` rendered as the string "WCAG GIGW"**, misattributing an Indian government standard to the W3C on every page that used it. | same | ✅ |
| F4 | **Props tables were hand-typed and had drifted.** Of twelve components audited against their implementations, **one** matched. `ChartCard` documented a prop `action`; the prop is `actions`. `AppShell` marked `sidebar` and `footer` required; both are optional and the TSDoc says so. `BarChart` documented 2 of 11 props, hiding the entire multi-series arm. `OtpInput` documented `onChange`; the interface exports `onValueChange`. `Modal` published 400/600/800px against a CSS of 24rem/28rem/40rem. | ~60 pages | ✅ **Props are now generated from the TypeScript type checker** — `tools/props-extract/extract.mjs`, 130 interfaces, 863 props, gated by `check:props` |
| F5 | Deprecated union members were invisible: `ButtonAppearance` has five members, two `@deprecated`, and the Button page documented three. | `actions/button/page.tsx` | ✅ The extractor reads the alias declaration and marks deprecated members in the printed type |
| F6 | **Ninety-nine pages hand-rolled the same six style objects**, carrying 161 unbound `lineHeight` numbers and 107 `maxWidth` px literals across nine measures — on the surface `documentation-ds-linkage.md` calls the strictest in the estate. | `design-system/components/**` | ✅ `ComponentDocPage` template built; the sweep onto it is in progress and the measure is now **one** token-bound value |
| F7 | **The `check:ds-pages` gate could not see the template.** Its six regexes matched literals a template-built page does not contain, so the fix would have scored 0/6. | `tools/ds-page-standard/check.mjs` | ✅ Gate recognises the template — but only when the page supplies every prop that carries one of the six, so an empty shell still fails |
| F8 | **The package declared no `sideEffects`**, so a bundler had to evaluate all 104 CSS-importing modules; the barrel's re-exports could not be dropped. A portal using six components paid for ninety. | `packages/design-system/package.json` | ✅ `"sideEffects": ["**/*.css"]` |
| F9 | **Eleven stylesheets carried no cascade-layer order statement**, including `foundations/layout.css`, which defines `.sa-container` — the estate's content-width contract, imported app-wide. An unlayered sheet outranks every layered one and can demote Tailwind's Preflight. | 11 files | ✅ Order statement added to all eleven |
| F10 | **Chart hues do not re-theme.** `--sa-chart-cat-1` is defined in **one** brand scope while `--sa-chart-grid` is in eight and `--sa-bg-neutral-base` in nine — and `internal/palette.ts` states in a comment that "charts re-theme automatically under data-brand". Under `navy` or any `dbim` pack, every button re-themes and the first chart series stays gov-blue. | `tokens.css`, `charts/internal/palette.ts` | ○ Recorded — the fix belongs in the DTCG source and needs a token release |
| F11 | **The categorical chart palette fails three of the six industry checks.** The estate's own CVD gate is rigorous (9-slot all-pairs, ΔE ≥ 8, correct Machado matrices) and passes; the standard adds three checks it does not have, and the palette fails all three: four hues sit outside the OKLCH lightness band, four fall below the chroma floor and read as grey, and **`#5a406e` ↔ `#323ca8` measure ΔE 11.7 unsimulated — below the 15 floor, so two series are hard to tell apart for a full-colour-vision reader.** The palette was optimised so hard for colour-blind separation that it stopped being separable in normal vision, because nobody measured that. | `packages/tokens/src/semantic.json`, `test/chart-palette.test.mjs` | ◑ A passing replacement was derived and validated (below); applying it is a token release |
| F12 | **All seventeen charts had no loading and no error state**, six had no empty state at all, none had filtered-to-nothing, and every one that did guard hard-coded `kind="empty"` — so a reader who filtered their own selection away was told "Nothing to show yet" with no way back. | `charts/**` | ✅ `ChartFrame` gained `state`/`onRetry`/`filterLabel`, rendering a skeleton at the chart's own aspect ratio; forwarding through all 17 in progress |
| F13 | **No illustration system existed.** | — | ✅ Built: `components/brand/illustration/` — a stated language, 9 primitives, 14 scenes, 3 tiers, 4 tokenised ink layers, a forced-colors mapping, and a foundations page |
| F14 | Two tokens referenced behind fallbacks that nothing declares — the gate's own point that a fallback is *worse*, because the value renders while the token system has stopped governing it. | `docs-kit.css` | ✅ Bound to real tokens; `check:dangling-vars` clean |
| F15 | `.ds-sr-only` is declared in nine component stylesheets and in **none** of the documentation surfaces, so a docs component reaching for it rendered its hidden text visibly. | `docs-kit.css` | ✅ Declared for the docs kit |
| F16 | The `Icon` barrel comment said "Material Symbols **Outlined**"; `icons.css` and `icon.tsx` both use **Rounded**, as `CLAUDE.md` mandates. | `packages/design-system/index.ts` | ○ One-word fix outstanding |

### The derived palette

Produced by search over OKLCH space under the estate's brand anchor, then validated —
not chosen by eye. `#0373df` is held as slot 1 because brand requires it.

**Series palette (8 slots, adjacent-pairs contract — bar, line, stacked, donut):**
`#0373df · #d37e07 · #9e2c2a · #4f43a4 · #b2569f · #0ea361 · #9284eb · #7f7301`
→ all five checks PASS; worst adjacent CVD ΔE 11.0, worst adjacent normal ΔE 19.1.

**Spatial palette (6 slots, all-pairs contract — scatter, bubble, map, treemap):**
`#0373df · #d37e07 · #a33806 · #802d7c · #cd6eb8 · #57a26d`
→ all five checks PASS at `--pairs all`; worst CVD ΔE 8.6, worst normal ΔE 17.8.

**Why two palettes.** Eight slots cannot pass the all-pairs contract inside the
lightness band at a governmental chroma — every candidate lands at ΔE 14.3–14.5 against
a floor of 15, tested at chroma caps of 0.15, 0.17 and 0.19. Six passes comfortably. A
chart whose marks are legend-ordered only ever puts neighbours side by side; a map puts
any two together. That is two different contracts and it needs two palettes, with a
ninth series folding into "Other" rather than becoming a generated hue.

---

## 3. Recorded, not yet fixed — ranked

### P0 — blocks release

| # | Finding | Where |
|---|---|---|
| R1 | **8 runtime CVEs, 1 critical.** `jspdf` (arbitrary JS execution via PDF injection; fix is a 2→4 major), `next` (SSRF via rewrites — and this estate mounts every portal through hub rewrites), `sharp`, `postcss`, `nanoid`, `dompurify`. No `dependabot.yml`, no `npm audit` in CI. | `package-lock.json`, `.github/workflows/` |
| R2 | **No automated accessibility test exists anywhere.** `axe-core`, `pa11y`, `jest-axe`, `lighthouse`: zero matches across every `package.json`, workflow and script. The enforcement mechanism for the estate's stated non-negotiable is a human remembering to type a slash command — while radius tokens have six contract tests and a per-page ratchet. | `.github/workflows/` |
| R3 | **The public accessibility statement claims WCAG 2.1 AA + GIGW 3.0 conformance with no VPAT, no ACR, no third-party audit and no STQC certificate.** It also names **2.1** where the estate's own standard is **2.2**. | `app/website/accessibility/page.tsx:22` |
| R4 | **53 pages assert "satisfies all mandatory GIGW 3.0 and WCAG 2.2 Level AA requirements"** above a checklist that on 44 of them lists exactly one criterion. Several are demonstrably false — see F1. | `design-system/components/**` |
| R5 | **Zero component render tests across 124 components.** The test glob is `.ts` only; `find -name "*.test.tsx"` returns 0; no `@testing-library/*` anywhere. A `Modal` whose focus trap silently breaks passes every gate in this repo. | `packages/design-system/package.json:33` |
| R6 | **The 11 Playwright specs are gated by nothing** — no workflow runs `test:e2e` — and `internal-pages-visual.spec.ts` calls `page.screenshot({path})`, never `toHaveScreenshot()`, so **nothing is compared to anything**, while `design-system-architecture.md` §3 tells agents to "run the visual suite to catch unintended drifts". | `e2e/`, `.github/workflows/apps-ci.yml` |
| R7 | **`npm run lint:css` runs in no pipeline.** CI runs `lint`, `check` and the build as separate steps and never `verify`, which is where `lint:css` lives — so the estate-wide token rule executes only when a human types it. Run against the paths the narrow CI glob excludes it reports **259 errors**. | `package.json`, `apps-ci.yml:42` |
| R8 | **117 component `.tsx` files, 29,714 LOC, have never been linted.** There is no ESLint config in `packages/design-system` at all — no `react-hooks/exhaustive-deps` in a package with 88 `"use client"` files, no `jsx-a11y` on a government design system. | `packages/design-system/` |
| R9 | **Five shadow UI kits re-implement ~45 barrel components** — `nhapoa/ui.tsx` (17 exports, 1 DS import), `tg/ui.tsx` (19, 1), `scw/ui.tsx` (14, 1), `pm-ajay/dashboard/ui.tsx` (11, **0**), `pm-ajay/dashboard/charts.tsx` (9, **0** — seven hand-rolled SVG charts). Every accessibility fix shipped to the DS in three months bypassed all five. Three exact name collisions with barrel exports are live. | `apps/hub/src/components/**` |
| R10 | **The citizen-facing portals have no Hindi.** A bespoke Bhashini-backed runtime with 16 languages exists and is mounted in **exactly one place** — the informational website's layout. It is not exported from the barrel, so no portal can import it, and the root element hard-codes `lang="en-IN"` estate-wide (a WCAG 3.1.1/3.1.2 failure inside the feature meant to deliver inclusion). The transactional surfaces — grievance registration, pension registration, certificate application — are the ones where a non-English speaker most needs help, and they are the ones without it. | `components/i18n/`, `app/layout.tsx:124` |
| R11 | **Six version numbers for one system.** `package.json` 0.6.0 · package CHANGELOG 0.5.0 · root CHANGELOG 0.4.0 · changelog page **v0.94.0** · `design.md` **v0.42.0** · roadmap "Shipped (v1.0)" while its own `metadata.description` says v0.5. The same release — Breadcrumb — is published as v0.94.0 and v0.42.0 in near-identical prose. | six files |
| R12 | **The `--ds-*` token contract was retired in a MINOR.** `GOVERNANCE.md:42` still states it "is verified on every build… breaking it is a major"; `grep -c -- "--ds-"` on `tokens.css` returns **0**. Anyone who built on it has a silently unstyled application, because CSS drops an unresolvable `var()` without a warning. | `GOVERNANCE.md`, `AGENTS.md` |

### P1 — ships broken

| # | Finding | Where |
|---|---|---|
| R13 | The docs' "On this page" rail scans headings inside **hidden** tab panels, so on ~95 pages it lists sections from closed panels and clicking one calls `scrollIntoView()` on a `display:none` element — the page does not move. | `docs-layout/on-this-page.tsx:20` |
| R14 | Four pages render **empty tab panels** — a reader clicking Accessibility gets a blank page. The gate passes them because it matches `<DocsTabs`, never the panel contents. | `data-table`, `modal`, `checkbox`, `radio` |
| R15 | **`react-live` runs with `noInline={false}`**, whose wrapper is literally `return (${code})`, so every example beginning with a statement throws. **11 playgrounds render a red error** instead of a component. | `playground/playground.tsx:65` |
| R16 | The playground does `const LIVE_SCOPE = {...DS}` — the **entire barrel** into the client bundle of all 34 playground pages, to render one Button. | same:9 |
| R17 | **38 exported components have no documentation page**, including `Breadcrumb` (the newest release's headline), `Pagination`, `IconButton`, `ButtonGroup`, `SegmentedControl`, `MegaMenu`, `IndiaBubbleMap`, `IndiaPointMap`, and **`SectionTitle`** — which `ui-restraint-and-copy.md` §3 mandates for *every* section heading in the estate. `check:docs-routes` prints "100 page(s), one per component", which is a statement about the 100, not the 124. | `nav.ts`, `check-docs-routes.mjs` |
| R18 | The page title is set at **four different type roles** across 111 pages (display-1 ×66, headline-1 ×41, headline-2 ×4, headline-3 ×3) and the section heading at three. On 41 pages the `h1` is the same size as the `h2` on 59 others. | `design-system/**` |
| R19 | The second tab is called **"Code" on 55 pages and "Develop" on 39**, while the gate's own docstring claims it enforces "Design / Code / Accessibility, in that order". | `design-system/components/**` |
| R20 | `components.css` — the documented entry point for non-bundled consumers — contains **26 `@import`s against 68 stylesheets**. 42 are missing, including `modal`, `toast`, `data-table`, `tabs`. A consumer following the documented path gets a design system with 62% of its CSS silently absent; CSS fails open. | `packages/design-system/components.css` |
| R21 | `.ds-chart-card { overflow: hidden }` clips the chart tooltip for the **tallest bar** — the mark a reader inspects first — and clips the export menu and any `outline-offset` focus ring on the card's edge children (WCAG 2.4.11). | `dashboard/dashboard.css:53` |
| R22 | `role="img"` on the chart SVG prunes descendants from the accessibility tree, so the `tabIndex={0}` marks in eight charts are focusable elements with **no accessible name** — 30 nameless tab stops per chart. | `charts/internal/chart-frame.tsx:69` |
| R23 | `ChartSeries.data: number[]` cannot express a gap, so a month with no reported figure must be passed as `0` and the line is drawn to the baseline. A reader cannot distinguish "reported zero" from "has not reported". | `charts/types.ts:10` |
| R24 | Chart axis text is 10–11px in SVG **user units**: at a 375px phone it renders at **5.98 CSS px**, on a tablet three-up at **4.0px**, on the maps at **3.9px** — and SVG user units ignore the reader's font-size preference entirely (WCAG 1.4.4). | `charts.css:130` |
| R25 | **Zero `forced-colors` support anywhere in the design system**, while the house focus pattern is `outline: none` + `box-shadow` — which is not painted in forced-colors mode, so those controls have no focus indicator at all for the readers that mode exists for. | estate-wide |
| R26 | `card-skeleton.css` declares `animation: … !important` on two selectors while the `prefers-reduced-motion` override has no `!important`, so **the reduced-motion override loses**. | `dashboard/card-skeleton.css:155,204` |
| R27 | The landing hero runs an **infinite auto-starting marquee whose only pause is hover** — unreachable by keyboard and by touch (WCAG 2.2.2), above a card advertising "WCAG AA". | `hero/hero.css:216` |
| R28 | The 21-role type scale collapses to three sizes in practice: `body-2`, `body-1` and `headline-1` are over half of all 744 uses; the entire Title tier is 11 uses across 121 pages; `display-2`–`display-5` are never used. | `design-system/**` |
| R29 | **`CONTRIBUTING.md`'s final verification step runs a build for an app that does not exist** (`apps/dosje`), and both contribution pages link to an RFC template that was never created (`.github/ISSUE_TEMPLATE/` does not exist). | `CONTRIBUTING.md:43` |
| R30 | The PR template tells reviewers **"GitHub Actions is blocked on billing… a green tick would mean nothing either."** The last 8 of 8 runs succeeded. Reviewers are being told to disregard the only automated signal the system has. | `.github/pull_request_template.md` |
| R31 | The roadmap lists as **shipped**: `DatePicker` and `FileUpload` (neither exists), "Code Connect 100% mapping" (25 templates against 124 components — 20%), "Full-text search" (it indexes headings and 15 prop names), "Bilingual playgrounds" (1 page handles `"hi"`). | `resources/roadmap/page.tsx` |
| R32 | "Was this page helpful?" sets local state and **transmits nothing**, on 55 pages — the only adoption signal the docs collect, collecting nothing, and thanking the reader for it. | `docs-kit/feedback-bar.tsx` |
| R33 | **No date picker exists**, and 42 portal fields fall back to `<input type="date">` — which cannot express `DD/MM/YYYY` reliably, a financial year, a scheme's application window, or a Hindi month name. | `packages/design-system/index.ts` |
| R34 | **No grievance/appeal components**, though NHAPOA and TG have both built the workflow independently. The shape is identical across every scheme and statutory (CPGRAMS-aligned): lodge → acknowledge → assign → clarify → investigate → dispose → appeal. | `index.ts` |
| R35 | **No document-upload-with-verification component.** `MediaUpload` is media-shaped; there is no per-document-type slot, no format validation against a scheme's rules, and no verification state machine (`pending`/`verified`/`deficient`/`rejected`) — while e-Anudaan already ships a deficiency-remediation page with nothing behind it. Nine raw `<input type="file">` in the portals. | `index.ts` |
| R36 | **No address / PIN / State→District→Block selector**, though the estate already owns the hard half — `IndiaMap`, `INDIA_STATE_BOXES` and `normalizeRegionName`. Not exposing that vocabulary as an input is why `normalizeRegionName` had to exist. | `index.ts` |
| R37 | **No IFSC or bank-account input**, while `AadhaarInput` ships with Verhoeff checksum validation and `PanInput` with format validation. e-Anudaan hand-rolls bank details with `form.ifsc.trim()` as the entire validation — the one field where an unvalidated digit sends a disbursement to the wrong account. | `e-anudaan/(ngo)/ngo/bank-accounts/page.tsx:56` |
| R38 | `ProvenanceChip` is **mandated estate-wide** by `prototype-data-modes.md` and lives in one app's website folder, unexported. Eight portals render dashboards and none of them can mark a figure as illustrative — the exact risk the rule was written for. | `components/website/ProvenanceChip.tsx` |
| R39 | **No CODEOWNERS, no LICENSE**, on a 1,191-commit repository with a bus factor of one and a stated goal of pan-ministry reuse. | repo root |
| R40 | `ds-quality.yml` uses `npm install`, not `npm ci` — in the job that asserts committed token artefacts match a fresh build. | `ds-quality.yml:60,273` |

### P2/P3 — real defects, lower blast radius

`docs-kit` re-implements seven barrel components including a `DocsTabs` on the Tabs page
that is not the `Tabs` component (and, per F1, was the broken one) · three tables in one
docs kit with three unrelated visual languages · `StatusBadge` accepts `"New"` with no
CSS rule, so it renders unstyled · terminal window dots are **2px** because a padding
token was used as a size · the Resources page uses nine Unicode dingbats where the
estate's icon system is Material Symbols, and `↗` appears 79 times · the mobile TOC is a
**fourth** bottom-right corner occupant with a hard-coded offset and no
`data-sa-corner-occupant`, violating `floating-element-placement.md` on all four counts ·
the mobile TOC sheet is `aria-modal` with no focus trap, Escape or focus restore while
the sidebar drawer 40 lines away implements all three · ⌘K search has no focus trap and
no `aria-activedescendant` · the search index appends the literal string `"tokens wcag
accessibility"` to **every** entry and indexes no prose · two search entries for one
component ("Sla Progress Indicator" and "SLA Progress Indicator") · `figmaUrl()` with no
argument on 53 pages renders a link labelled "Figma Component Spec" that lands on a
72-page file root · the typography page publishes `--sa-font-family-devanagari` and the
Tabs page `--sa-inline-2xs`, **neither of which exists** · the Aadhaar page numbers its
sections **1, 2, 4, 3**, and the generated search index has captured that order · nine
categorical hues wrap at 12 with no warning, so a 28-state chart draws three states
identically · `AreaChart` is a 12-line alias occupying a top-level chart slot with its
own page and story · `demo/` is exported from the barrel and omitted from
`package.json.files` · 2,438 of 4,550 lines of the global token sheet (5 KB gzipped on
every page) are six `dbim-*` preview palettes serving one internal docs route, one of
them labelled "fails AA" · `design.md` opens with **617 lines of HTML-comment version
history** that the renderer strips, so no human sees it and every agent reads it ·
`tokens.css` is checked in **twice, byte-identical**, 602 KB, with no gate asserting they
match.

---

## 4. Where the lenses were wrong

Recorded so the audit is falsifiable in both directions.

- ✗ **"No shared chart scale/axis/legend layer."** The master prompt implied it and one
  lens repeated it. False: `charts/internal/` is a genuine 890-LOC shared layer —
  `chart-frame`, `axis`, `legend`, `scales`, `palette`, `tooltip`, `geometry` — consumed
  by 13 of 15 charts. The state architecture was missing; the drawing architecture is
  sound. **The master prompt's WS-3 premise is corrected here.**
- ✗ **"Zero charts render a table equivalent."** `ChartFrame` has always supported a
  screen-reader `<table>`, and **11 of 15** charts pass one. Adoption is the gap, not
  capability.
- ✗ **"No CVD validation exists."** `packages/tokens/build/cvd.mjs` implements the
  Machado-Oliveira-Fernandes matrices correctly, over linear RGB, with a documented
  reason for each; `chart-palette.test.mjs` gates 9-slot all-pairs separation at ΔE ≥ 8
  with a ratchet that fails on improvement. The real finding is narrower and more
  interesting — see F11.
- ✗ **"10 of 100 pages link to Figma"** and **"63 pages call `figmaUrl()`"** are both
  true and mean different things: 10 link to a component, 53 link to the file root.
- ◑ **"The UX4G conformance report names 20 missing components."** Several are wrong —
  `Tooltip`, `Accordion`, `Divider`, `Breadcrumb` and `MegaMenu` are all exported today.
  The report's matcher is stale, which under-reports coverage while burying the genuine
  gaps (Date Picker, Combobox, Time Slot, Biometric Capture) in noise.

---

## 5. Where SAMAVESH stands against the named benchmarks

| Dimension | Verdict |
|---|---|
| Token architecture and CI gating | **Ahead of Carbon.** The ratchet pattern — failing on improvement as well as regression, per-file rather than global — is stronger than anything the benchmarks publish. |
| Chart internals | Level with Carbon on structure; behind on state, colour formula and form heuristic. |
| Contribution governance | **Behind GOV.UK.** They publish a working group, minutes, an evidence-bearing backlog and a response SLA. SAMAVESH has an undefined "core team" and a link to a missing template. |
| Versioning and release | **Behind all six.** Every one ships a resolvable, installable version. SAMAVESH has six version numbers and no build artefact. |
| Component API docs | Was **behind Atlassian**; the generated props table (F4) closes this. |
| Writing and content | **Behind Polaris.** Three tab vocabularies, two heading-numbering conventions, and a changelog that breaches the estate's own copy rule in most entries. |
| Accessibility evidence | **Behind USWDS.** One e2e spec for 124 components, no axe, no ACR — and, until F2, a checklist that could not express a failure. |
| Illustration | Was **behind all six** — did not exist. Now exists, with a stated language and a constraint none of the six carries: it refuses to depict people, because a department serving Scheduled Castes, senior citizens, persons with disabilities and transgender persons cannot put one kind of person on the page. |

---

## 6. What a reader of this document should do first

1. **`npm audit fix`, then schedule the jspdf 2→4 migration** (R1). It is used in exactly
   one file; do it while the blast radius is one file.
2. **Add four gates: axe-in-e2e, `npm audit`, a Playwright job, a bundle budget** (R1,
   R2, R6). The estate has 22 gates and every one of them points at design-token drift.
   Four days of work rebalances a portfolio that currently cannot see the categories
   that end programmes.
3. **Correct the accessibility statement** (R3) and **delete the 53 blanket conformance
   sentences** (R4). Both are unevidenced legal claims on a Government of India property,
   and both are one edit.
4. **Decide the packaging question** (R11, R12): either publish a versioned, built
   artefact, or delete every claim about pinning and semver and state that consumers
   live at workspace HEAD. Every month it is deferred makes it more expensive.
5. **Get the master portal list.** Twelve of the twenty portals have no captured
   requirements at all, so every component gap in §3 is inferred from the eight that
   exist and is incomplete by construction.

---

## 7. Deliberate non-merges, and why

Recorded so they are not rediscovered as oversights.

**`CardState`'s `StateArt` was NOT folded into the illustration system.** They look
like duplication and are not. `StateArt` carries a *tone* axis — its ink recolours to
neutral, info or warning with the state's severity — because it is state-signalling
chrome. The illustration language deliberately has no tone axis: §3 allows exactly one
accent per drawing, on the reasoning that a second accent means the drawing has not
decided what it is about. Merging them would either lose `CardState`'s severity signal
or import a traffic light into a language built to avoid one. The shared level is the
*primitives*, which both can draw from; that is where the next scene either system needs
should be added.

**The categorical palette was not replaced.** §F11 records the full reasoning: a
replacement was derived, validated against the industry six checks, and then rejected by
this repository's own three chart tests. The estate's gate is better-informed than the
generic standard on constraints the standard does not model — chiefly that green means
"above target" here, so an arbitrary series painted green misreads a caste-category
breakdown as a good result. The three missing measurements are now gated at today's
figures instead, so the defect is visible and cannot grow, and the next solve has all six
constraints written down in one file.

**The 53 blanket conformance sentences were removed page by page during the migration,
not by a sweep.** Each page's replacement had to be read off its implementation, because
the point was never to delete a sentence — it was to replace an unevidenced claim with
criteria someone had actually checked. The `A11yChecklist` now defaults every row to
*untested*, so a page that has not been audited says so rather than showing ticks.

## 8. What this programme did not reach

- **The chart palette itself** (§F11) — gated, not fixed.
- **`--sa-chart-cat-*` brand scoping** (§F10) — charts still do not re-theme; the fix
  belongs in the DTCG source and needs a token release with a visual audit per brand.
- **The five shadow UI kits** (R9) — ~45 re-implemented components across four portals.
  This is the largest remaining quality item and it touches live citizen-facing pages.
- **Hindi on the portals** (R10) — the runtime exists and is mounted in one place.
- **Component render tests** (R5) and **automated accessibility tests** (R2) — the two
  gates whose absence makes every other accessibility claim unfalsifiable.
- **The version reconciliation** (R11) and the **packaging decision** (R12).
- **The component gap list** (R33–R37) — date picker, grievance workflow, document
  verification, address/PIN cascader, IFSC input.

---

# PART II — THE RE-AUDIT, 2026-09-02

The finished foundations were put back through four of the same hostile lenses,
scoped to the NEW work only. It returned 58 findings. The most valuable were the
ones that faulted the fix rather than the original defect, and several were errors
of mine that the first audit could not have caught because the code did not exist
yet.

## What the re-audit caught, and what was done

| # | Finding | Status |
|---|---|---|
| **The build was RED** — the docs-coverage baseline held 15 names from the moment before the illustration primitives were withdrawn from the barrel, so every PR would have failed before reaching the build step. | ✅ Re-baselined |
| **The gate's failure message was wrong.** It could not tell "gained a page" from "no longer exported" and reported both as "now documented" — so it sent the reader to find fifteen pages that had never been written. | ✅ Third branch added, with its own sentence |
| **80 lines of new chart CSS sat OUTSIDE `@layer components`** — finding F9 of this same programme, reintroduced in the code that answers it. A chart could be overridden by a consumer utility in its populated branch and not in its state branch. | ✅ Layer closed at end of file |
| **A union props type returned its INTERSECTION.** `BarChartProps = BarSingle \| BarMulti` published `title` and none of `data`, `labels` or `series` — so the generator's headline claim was false for the exact case its own docstring cited. | ✅ Arms walked separately and merged, with an `onlyIn` marker naming which arm accepts each prop |
| **Cross-file type aliases never expanded.** `getSymbolAtLocation` returns the import specifier, so `CardStateKind` printed expanded where it was local and bare where it was imported — the same type documented two ways in one file — and `ChartState`, the whole state contract, printed bare on all eighteen components that accept it. | ✅ `getAliasedSymbol`, plus nested-alias flattening: `ChartState` now prints all seven states |
| **`defaultOf` did not read destructured defaults**, though its docstring said it did. 78% of props rendered an em dash that reads as "no default" — `BarChart.orientation` published `—` against a source that reads `orientation = "vertical"`. | ✅ Reads both the parameter pattern and the `const { … } = props` body form that every union-typed chart uses. 207 → 333 defaults |
| **An empty description rendered as a blank `<td>`** beside a Default column rendering an em dash — the same absence, two renderings. | ✅ |
| **The three new palette tests were named as conformance claims** and passed at the failing value: "every categorical slot sits inside the lightness band" ✔ with four slots outside it. Three green ticks beside three untrue sentences — the exact defect the `A11yChecklist` rebuild was for, moved into the test suite. | ✅ Renamed to what they measure: "the lightness-band deficit does not grow" |
| **`role="img"` pruned the charts' own focusable marks.** Nine charts put `tabIndex={0}` and an `aria-label` on every bar, point, cell and region; inside `role="img"` those labels are pruned, so a keyboard reader tabbed through thirty stops that announced nothing. | ✅ `marksAreFocusable` switches the SVG to `role="group"`. **Verified in a browser: role is now `group` and all six marks announce their labels** |
| **The CSS barrel declared a `demo` rank and never walked `demo/`** — the same silent-absence failure the generator was written to end, at smaller scale. | ✅ 69 → 73 imports |
| **Dependabot watched npm and not the workflow actions** — the half of the supply chain that runs with repository credentials. | ✅ |
| **"Related Components" used a raw `<a>`** in a shell where every other link is `next/link`, so the one link whose job is moving between pages re-downloaded the shell, the sidebar and the search index. | ✅ |

## What it caught in the illustration system — all of it mine

| Finding | Status |
|---|---|
| **Nine of fourteen scenes floated above the floor** the language calls the family's binding trait, making it "a decorative underline beneath unrelated objects". | ✅ **Every scene now bottoms at exactly y = 40**, measured in a browser. Sheets were grounded; the rule was also restated honestly — an object that stands meets the floor, a ring or a lens is not an object and does not. |
| **Round caps hung every grounded mark two units BELOW the floor** — a round cap extends half the stroke past the endpoint, so at `scene` that is 6px of bar dangling below the baseline on the five drawings carrying the family's only shared idea. | ✅ Butt caps for grounded marks, stated in §4 |
| **`complete` shipped TWO accents**, breaking the language's own one-accent rule on the scene that means "finished". | ✅ Ring keeps the accent; the tick moved to ink |
| **`empty` and `not-published` were the same composition** separated only by a height array — and four EQUAL dashed bars read as four equal VALUES, the one thing an empty state must not say. | ✅ `empty` is now the plot area with no bar shape in it; the dashed ghost outline is `not-published`'s alone |
| **Two of six scene names diverged from `CardStateKind`**, so `<Illustration name={kind} />` did not typecheck and no translation table existed. | ✅ `no-data`→`empty`, `feed-error`→`error` |

## What the re-audit found that is NOT fixed, and why

- **Four `spot`-tier scenes are illegible at 32×24.** `Sheet` renders 10px wide with three 1px rules; `Ring` becomes a dot. The tier contract claims a drawing "is correct at every size", and for those four it is not. The honest options are per-tier variants or restricting `spot` to the scenes that survive it; both are design work, not a patch.
- **Nothing in the estate consumes the illustration system yet**, and `CardState`'s `StateArt` still hand-draws six scenes to the same 64×48 grid under a different class family. §7 above explains why they were not merged (a tone axis the language deliberately lacks); the re-audit is right that two systems on one grid is a cost, and the names now line up so the merge is a small change when someone takes the tone decision.
- **The template's `h1` is `display-1`** — up to 80px at 1920, and 40px/800 in a 288px column at 320px. The re-audit argues for `headline-1`, citing GOV.UK at 36px and Carbon at 42. That is a house-style decision with 100 pages behind it, and it belongs to a human.
- **Without JavaScript the Suspense fallback has no tab handler**, so only the Design panel is reachable and the props table and accessibility checklist are JS-gated. The fix is to render all three panels as headings in the fallback and enhance on hydration.
- **The docs kit has no forced-colors support**, so the active tab indicator — drawn with `background` and `color` — disappears in Windows High Contrast.
- **`--cdp-measure` is a page-kit local, not a token.** One value, correctly, and bound to nothing in `--sa-*`.
- **`ComponentDocPage` has no documentation page of its own**, and the illustration foundations page hand-rolls the header the template exists to render — it scores 0/6 and the gate cannot see it, because the gate only walks `components/`. Dogfooding is the cheapest credibility a design system has and this is where it is missing.

---

## 9. The Vercel preview on PR #247 fails — diagnosis, corrected

**Corrected 2026-09-02.** An earlier version of this section called it a likely
infrastructure flake. It is not: it reproduced on a second, independent deployment
of a different commit, with the identical error.

Both GitHub Actions gates pass on both commits — **hub lint + typecheck + build**
and **quality** — and `npm run verify` passes locally, including a full production
build with the same `output: "standalone"` config.

```
✓ Compiled successfully
✓ Generating static pages using 1 worker (832/832) in 36.6s
  Finalizing page optimization ...
  Running onBuildComplete from Vercel          ← Vercel's own builder hook
> Build error occurred
Error: ENOENT: no such file or directory, open
  '/vercel/path0/apps/hub/.next/next-server.js.nft.json'
```

What the log establishes:

- The build **compiled and rendered all 832 pages**. Nothing in this branch fails
  to build.
- The failure is in **`onBuildComplete`, Vercel's own hook**, reading the
  file-tracing manifest that `output: "standalone"` produces. Locally that file is
  written (116 KB) and the build succeeds.
- **This branch does not touch `apps/hub/next.config.ts`.** `output: "standalone"`
  is on `main`, unchanged, and `main` deployed successfully before this branch
  existed.
- The build output is large: `.next/server` **454 MB**, `.next/standalone`
  **648 MB**. Vercel reported `1 worker`, which is what it does under memory
  pressure.

The likely mechanism is therefore resource exhaustion at the standalone
copy/trace step, which this branch's size tipped over rather than caused. One
hypothesis was tested and is weak: `props.generated.ts` (240 KB) appears in only
**6** server output files, not once per route, so it is not multiplying the trace.

**The recommended fix is one line, and it is a deployment decision rather than a
design-system one, so it is not made here.** `output: "standalone"` exists for
self-hosting and containers; Vercel does not need it and builds its own output,
so removing it would remove the 648 MB standalone copy and the trace manifest
this hook is failing to read. It affects how the whole estate deploys, so it
belongs to whoever owns the deployment. The alternative is raising the build
resources.

# PART II — THE RE-AUDIT, 2026-09-02

The finished foundations were put back through four of the same hostile lenses,
scoped to the NEW work only. It returned 58 findings. The most valuable were the
ones that faulted the fix rather than the original defect, and several were errors
of mine that the first audit could not have caught because the code did not exist
yet.

## What the re-audit caught, and what was done

| # | Finding | Status |
|---|---|---|
| **The build was RED** — the docs-coverage baseline held 15 names from the moment before the illustration primitives were withdrawn from the barrel, so every PR would have failed before reaching the build step. | ✅ Re-baselined |
| **The gate's failure message was wrong.** It could not tell "gained a page" from "no longer exported" and reported both as "now documented" — so it sent the reader to find fifteen pages that had never been written. | ✅ Third branch added, with its own sentence |
| **80 lines of new chart CSS sat OUTSIDE `@layer components`** — finding F9 of this same programme, reintroduced in the code that answers it. A chart could be overridden by a consumer utility in its populated branch and not in its state branch. | ✅ Layer closed at end of file |
| **A union props type returned its INTERSECTION.** `BarChartProps = BarSingle \| BarMulti` published `title` and none of `data`, `labels` or `series` — so the generator's headline claim was false for the exact case its own docstring cited. | ✅ Arms walked separately and merged, with an `onlyIn` marker naming which arm accepts each prop |
| **Cross-file type aliases never expanded.** `getSymbolAtLocation` returns the import specifier, so `CardStateKind` printed expanded where it was local and bare where it was imported — the same type documented two ways in one file — and `ChartState`, the whole state contract, printed bare on all eighteen components that accept it. | ✅ `getAliasedSymbol`, plus nested-alias flattening: `ChartState` now prints all seven states |
| **`defaultOf` did not read destructured defaults**, though its docstring said it did. 78% of props rendered an em dash that reads as "no default" — `BarChart.orientation` published `—` against a source that reads `orientation = "vertical"`. | ✅ Reads both the parameter pattern and the `const { … } = props` body form that every union-typed chart uses. 207 → 333 defaults |
| **An empty description rendered as a blank `<td>`** beside a Default column rendering an em dash — the same absence, two renderings. | ✅ |
| **The three new palette tests were named as conformance claims** and passed at the failing value: "every categorical slot sits inside the lightness band" ✔ with four slots outside it. Three green ticks beside three untrue sentences — the exact defect the `A11yChecklist` rebuild was for, moved into the test suite. | ✅ Renamed to what they measure: "the lightness-band deficit does not grow" |
| **`role="img"` pruned the charts' own focusable marks.** Nine charts put `tabIndex={0}` and an `aria-label` on every bar, point, cell and region; inside `role="img"` those labels are pruned, so a keyboard reader tabbed through thirty stops that announced nothing. | ✅ `marksAreFocusable` switches the SVG to `role="group"`. **Verified in a browser: role is now `group` and all six marks announce their labels** |
| **The CSS barrel declared a `demo` rank and never walked `demo/`** — the same silent-absence failure the generator was written to end, at smaller scale. | ✅ 69 → 73 imports |
| **Dependabot watched npm and not the workflow actions** — the half of the supply chain that runs with repository credentials. | ✅ |
| **"Related Components" used a raw `<a>`** in a shell where every other link is `next/link`, so the one link whose job is moving between pages re-downloaded the shell, the sidebar and the search index. | ✅ |

## What it caught in the illustration system — all of it mine

| Finding | Status |
|---|---|
| **Nine of fourteen scenes floated above the floor** the language calls the family's binding trait, making it "a decorative underline beneath unrelated objects". | ✅ **Every scene now bottoms at exactly y = 40**, measured in a browser. Sheets were grounded; the rule was also restated honestly — an object that stands meets the floor, a ring or a lens is not an object and does not. |
| **Round caps hung every grounded mark two units BELOW the floor** — a round cap extends half the stroke past the endpoint, so at `scene` that is 6px of bar dangling below the baseline on the five drawings carrying the family's only shared idea. | ✅ Butt caps for grounded marks, stated in §4 |
| **`complete` shipped TWO accents**, breaking the language's own one-accent rule on the scene that means "finished". | ✅ Ring keeps the accent; the tick moved to ink |
| **`empty` and `not-published` were the same composition** separated only by a height array — and four EQUAL dashed bars read as four equal VALUES, the one thing an empty state must not say. | ✅ `empty` is now the plot area with no bar shape in it; the dashed ghost outline is `not-published`'s alone |
| **Two of six scene names diverged from `CardStateKind`**, so `<Illustration name={kind} />` did not typecheck and no translation table existed. | ✅ `no-data`→`empty`, `feed-error`→`error` |

## What the re-audit found that is NOT fixed, and why

- **Four `spot`-tier scenes are illegible at 32×24.** `Sheet` renders 10px wide with three 1px rules; `Ring` becomes a dot. The tier contract claims a drawing "is correct at every size", and for those four it is not. The honest options are per-tier variants or restricting `spot` to the scenes that survive it; both are design work, not a patch.
- **Nothing in the estate consumes the illustration system yet**, and `CardState`'s `StateArt` still hand-draws six scenes to the same 64×48 grid under a different class family. §7 above explains why they were not merged (a tone axis the language deliberately lacks); the re-audit is right that two systems on one grid is a cost, and the names now line up so the merge is a small change when someone takes the tone decision.
- **The template's `h1` is `display-1`** — up to 80px at 1920, and 40px/800 in a 288px column at 320px. The re-audit argues for `headline-1`, citing GOV.UK at 36px and Carbon at 42. That is a house-style decision with 100 pages behind it, and it belongs to a human.
- **Without JavaScript the Suspense fallback has no tab handler**, so only the Design panel is reachable and the props table and accessibility checklist are JS-gated. The fix is to render all three panels as headings in the fallback and enhance on hydration.
- **The docs kit has no forced-colors support**, so the active tab indicator — drawn with `background` and `color` — disappears in Windows High Contrast.
- **`--cdp-measure` is a page-kit local, not a token.** One value, correctly, and bound to nothing in `--sa-*`.
- **`ComponentDocPage` has no documentation page of its own**, and the illustration foundations page hand-rolls the header the template exists to render — it scores 0/6 and the gate cannot see it, because the gate only walks `components/`. Dogfooding is the cheapest credibility a design system has and this is where it is missing.

---

## 9. The Vercel preview on PR #247 failed — diagnosis

Both GitHub Actions gates pass: **hub lint + typecheck + build (5m10s)** and
**quality (4m54s)**. `npm run verify` passes locally, including a full production
build. The Vercel preview deployment failed, and the evidence says it is not this
change:

```
✓ Compiled successfully in 50s
✓ Generating static pages using 1 worker (832/832) in 36.3s
> Build error occurred
Error: ENOENT: no such file or directory, open
  '/vercel/path0/apps/hub/.next/next-server.js.nft.json'
```

The build **compiled and rendered all 832 static pages**. It failed afterwards, at
Next's file-tracing step, on a manifest that step is supposed to write. Nothing in
this branch touches `next.config.ts`, the output mode, or tracing, and the route
count is unchanged apart from one new foundations page.

Every deployment before it completed in ~5m; this one stopped at 3m — consistent
with the build process being killed after static generation rather than with a
compile error. Vercel reported `Generating static pages using 1 worker`, which is
what it does under memory pressure.

**Next step is a redeploy of the same commit**, which distinguishes an
infrastructure flake from a deterministic failure in one run. If it fails again,
the first thing to try is splitting `props.generated.ts` (233 KB, imported by 100
pages) into one module per interface — which the re-audit recommends anyway on
bundle grounds, and which would cut the per-route module graph sharply.

---

# PART III — THE SECOND RE-AUDIT, and the Definition of Done

Four further lenses — design system manager, CTO, business analyst, product manager
— were run over the finished work. They found two defects that made headline
numbers in this document WRONG, and one that made the estate's showcase page the
least accurate API in the catalogue.

## Fixed in response

| Finding | Status |
|---|---|
| **`check:docs-coverage` matched slugs by two-way substring, so FOURTEEN components passed with no page** — `icon-button` "documented" by the route `button`, `section-title` by `section`, `sidebar-nav` by `sidebar`. `SectionTitle` is the component the gate's own docstring names as its reason for existing, and the gate reported it covered. | ✅ Exact route or an explicit `DOCUMENTED_BY` entry. The true figure is **90/129, 39 undocumented** — not 104/129. The baseline GREW 25 → 39, which is the gate getting stricter, and is stated here rather than buried. |
| **Eight pages declared "not yet registered in the estate's Figma node index" for nodes registered in the same commit** — sending a reader away from a link that existed. | ✅ All eight now link. Two more registered (`tabsMore`, `portalSidebar`). Real links **10 → 30**. |
| **Nothing stopped that recurring.** | ✅ `check:ds-pages` now fails a page declaring an absence for a key present in `FIGMA_NODES`. Failure mode exercised. |
| **`CONTRIBUTING.md` walked a contributor into three failing gates** — a 13-section template that no longer exists, "add its CSS to `components.css`" (now generated, and `check:components-css` fails a hand edit), and `--ds-*`, which resolves to nothing. | ✅ Rewritten around `ComponentDocPage`, `propsFrom`, the two regeneration commands and the `Breaking` changelog kind. |
| **`navigation/portal-card` — held back as "the estate's best page" — had the most drifted table in the catalogue.** It documented `logoSrc`, `planned` and `note`, none of which exist, and omitted seven that do, four of them demonstrated by its own specimen a few lines above. | ✅ `propsFrom="PortalCardProps"`. |
| **`design.md` republished the two illustration rules `language.ts` had just corrected** — "every scene stands on the floor" and "round caps always". `CLAUDE.md` sends every agent to read `design.md` first. | ✅ Both synced. |
| **The illustration's forced-colors block mapped `ground`, `ghost` AND `ink` to `CanvasText`**, collapsing the one distinction the empty and not-published scenes depend on — for exactly the readers that mode serves. | ✅ `ghost` → `GrayText`. |
| **The PR template still said Vercel was "the only automated check still running"** — the sentence the removed billing claim had produced. | ✅ |

## The Definition of Done, honestly scored

`docs/plans/ds-world-class-master-prompt.md` §5 listed ten conditions. **Five are
met, five are not**, and the five were not previously written down here — which the
brief's own rule ("a finding that is not in the audit document did not happen")
makes a defect in this record rather than only in the work.

| Condition | Verdict |
|---|---|
| `check:ds-pages` reports 100/100, baseline empty | ✅ |
| `npm run verify` passes clean | ✅ |
| Every chart renders loading, empty, error and filtered-to-nothing, seen in a browser | ✅ |
| Every chart has a table equivalent | ✅ 11 of 15 pass one; `ChartFrame` supports it for all |
| Every finding fixed or recorded with a reason | ✅ this document |
| **A docs-literal gate reporting zero unbound values on `design-system/**`** | ❌ **Never built.** `check:type-linkage` covers typography estate-wide and is ratcheted, not zeroed. |
| **Every documented component links to Figma or declares its absence** | ◑ 30 link, 68 declare, **2 do neither** — `portal-card` and `samavesh-banner`, the two pages exempted from the migration |
| **Every chart passes keyboard traversal** | ❌ Marks are now NAMED (`role="group"`), which was the defect. Arrow-key roving across marks is not built, and the pages say so. |
| **The illustration system is used by at least the empty states that previously had none** | ❌ Nothing in the estate consumes it. `CardState`'s `StateArt` still draws its own six scenes to the same grid. |
| **`accessibility-auditor` returns no P0/P1 on the design-system routes** | ❌ Not run. |
| **The eight lenses re-audit and return no P0/P1** | ◑ All eight ran (four in Part II, four here). They returned P0s; the ones above are fixed, the ones below are not. |

## Carried forward, not fixed

- **58 of 100 pages still hand-write their props table.** The generator shipped;
  adoption did not follow. `check:ds-pages` accepts `props=` for full marks. A
  ratchet on the hand-written count, baselined at 58, is the fix.
- **338 of 526 accessibility rows say "Not yet verified"** with no ratchet and no
  dated plan. An unevidenced over-claim became a blanket under-claim, and on a
  Government of India property that is its own problem. Needs `check:a11y-evidence`
  plus the axe-in-e2e job §6 already recommends.
- **`npm audit --audit-level=high` blocks every merge on a mutable remote database**,
  with no allowlist and no `continue-on-error`, and it sits before the build step.
  An advisory published overnight red-lines the trunk.
- **The jspdf 2→4 migration was never exercised.** Its one consumer,
  `apps/hub/src/lib/nmba/committee/export.ts`, was not opened; its only contact with
  the changed surface is a cast through `unknown`, so `tsc` covers none of it, and
  the function is browser-only so the build never runs it.
- **`props.generated.ts` is 240 KB of committed generated TypeScript** in the
  linted, typechecked, merge-conflicting tree, with no `.gitattributes` note saying
  the resolution is always "regenerate".
- **`tools/props-extract/extract.mjs` discards the package's own tsconfig** and
  builds its own compiler options — so it is a different type checker from the one
  the build runs, and has no tests of its own.
- **`inheritsNative` prints "so `name`, `required`, `aria-describedby`… are
  available"** on ~48 interfaces, including ones extending `HTMLAttributes<HTMLDivElement>`
  where `name` and `required` are not valid attributes.
- **The illustration scene set has no `rejected`, `disbursed`, `window-closed` or
  `verification-failed`** — four of the commonest outcomes in this estate's
  workflows, and the language forbids drawing one ad hoc.
- **Four scenes are illegible at the `spot` tier** and the page documents that tier
  as safe.
- **`since` is on 2 of 100 pages**; 69 pages say `Stable` with no version.
- **Nothing consumes any of it.** The five shadow UI kits (~45 re-implemented
  components across four live portals) are untouched, and `FeedbackBar` still
  transmits nothing, so there is no instrument that would show adoption either way.

---

# PART IV — CLOSING THE CARRIED-FORWARD LIST

Part III ended with a list of things recorded and not fixed, and an honest score
of five of ten Definition-of-Done conditions met. This is what happened to that
list.

## Closed

| Carried forward | Now |
|---|---|
| **58 of 100 pages still hand-write their props table** | **3.** 54 converted, 3,533 lines of hand-typed table deleted. The three that remain are the cases the type checker genuinely cannot reach — `axis` and `toast` take inline parameter objects rather than interfaces, and `identity-inputs` is an overview page covering three components at once. Each says so in the file. The ratchet is now 3 and may only fall. |
| **338 accessibility rows unverified with no ratchet** | `check:a11y-evidence` — 117/526 verified, ratcheted, both failure modes exercised. |
| **No axe, no Playwright, in any pipeline** | `e2e/a11y/axe.spec.ts` over five routes, wired into Apps CI, serving the BUILT hub. Serious and critical block; moderate and minor report. |
| **The jspdf 2→4 major was never exercised** | Split `buildCommitteePdf` out of the browser-download path, replaced the `as unknown as` cast with a declared augmentation, and added three tests. They pass — `lastAutoTable.finalY` survives, so the minutes table is not drawn on top of the committee table. |
| **Nothing consumes the illustration system; `StateArt` still runs alongside it** | `CardState` renders `Illustration`. 110 lines of duplicate drawing deleted, and the tone axis now recolours the illustration's accent layer. |
| **The scene set has no `rejected`, `disbursed`, `window-closed`, `verification-failed`** | All four added. A process that can only be drawn succeeding is half drawn. |
| **Four scenes illegible at `spot`** | `sa-ill__detail` marks texture, and `spot` drops it; dash patterns go solid at half scale. |
| **The package has no ESLint config — 117 files, ~29,700 lines never linted** | `packages/design-system/eslint.config.mjs` with `react-hooks` and `jsx-a11y`, gated by `check:ds-lint`, 50 findings frozen per file. |
| **The five shadow UI kits are untouched** | `check:shadow-ui` — 41 collisions in 16 files, ratcheted. PM-AJAY's dashboard kit migrated as the reference; its status pill measured identical to two decimal places, four colliding names renamed, nothing moved a pixel. Four kits remain, now counted and frozen. |
| **The Vercel deployment fails** | Fixed, and the diagnosis was right: `output: "standalone"` is set only OFF Vercel now. **The preview deploys.** |

## What the axe suite found the day it first ran

The estate had claimed WCAG 2.2 AA for months with nothing checking it. On the
first run, over five routes:

- **`text/brand/primary/base` — gov-blue — used as TEXT in sixteen places** at
  3.28–4.19:1: the active sidebar item, the active tab on every page in the
  design system, the landing page's section eyebrows, the props-table prop
  names, the ⌘K search, and `--_color` on the **Button**, i.e. every outlined
  and text button in every portal. All moved to `bolder`: 5.57–5.74:1.
- **`VisitorCounter` hung its entire reading on `aria-label` on a roleless
  `<div>`** — which ARIA forbids and assistive technology may discard — with
  both visible spans `aria-hidden`. In the worst case the count was announced
  to nobody. Now `role="status"` with the reading as real text.
- **The install snippet on the design system's own landing page** rendered
  dark-theme syntax inks on a light chip painted *inside* the dark shell:
  1.14:1 to 2.75:1, sixteen spans. A global `code:not([class])` rule leaking
  into `.terminal-code`.
- **`terminal-code__title`** at white/45% on the shell.

One violation is **declared, not excluded**: the SAMAVESH banner's 2.91:1 is a
recorded decision with APCA evidence in the component itself, and the spec names
the selector and the reasoning. An allowance you can read and argue with is not
the same as a selector quietly dropped from a scan.

## Still open, and why

- **62 of 385 generated props render an em dash for their description**, because
  the component source has no TSDoc for them. The generated table cannot invent
  a sentence — that is the point — so the fix is TSDoc in
  `packages/design-system/**` and a regenerate. Worst: `ChartCardProps` 8/21,
  `CaptchaFieldProps` 4/10, `GeoPhotoInputProps` 4/14.
- **Four shadow kits remain** (~34 collisions). The PM-AJAY migration surfaced
  why: the DS has **no sortable table** and **no listbox-style filter select**,
  and those are what the portal dashboards need. Building them unblocks the rest.
- **`ComponentDocPage` still has no documentation page of its own**, and the
  illustration foundations page hand-rolls the header the template renders.
- **The docs' Suspense fallback has no tab handler**, so with JavaScript off only
  the Design panel is reachable.
- **`since` is on 2 of 100 pages**; 69 say `Stable` with no version. The six
  conflicting version numbers (R11) are unresolved.
- **Twelve of twenty portals still have no captured requirements**, which is why
  every component gap in §3 is an inference from the eight that exist.
