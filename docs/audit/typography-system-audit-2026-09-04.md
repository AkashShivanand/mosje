# SAMAVESH Typography System Audit — 2026-09-04

> **Scope.** The typography layer of the SAMAVESH design system as it exists in code
> (`packages/tokens`, `packages/design-system`, `apps/hub`) and in the SAMAVESH Figma
> library (`3FF5l0SMNIwdpZrKkeyPTm`), audited from nine perspectives: typography expert,
> design director, design-system manager, technical architect, CTO, senior developer,
> business analyst, product manager, UI/UX designer.
>
> **Method.** Direct reading of the token sources, the generated `tokens.css`, the Figma
> variable payload and the live library's Typography page metadata; grep census of every
> stylesheet and component in the estate; computed-style readings from three running pages
> (website home, NHAPOA portal home, SMILE login) in the hub dev server; the standards in
> `docs/guidelines/` (DBIM 3.0 §4, GIGW 3.0 §5.2, UX4G 3.0 §2, WCAG 2.1/2.2 AA).
>
> **Confidence legend.** **[Observed]** = read directly from code, build output, Figma
> payload, or a running page. **[Derived]** = computed from observed values.
> **[Research gap]** = needs user testing, device testing, or data this audit could not
> collect.
>
> **Audience routing.** Each finding names who most needs it: **DL** = design leadership,
> **ENG** = engineering, **SC** = steering committee. Each is also classed as a
> **design** problem, an **implementation** problem, or a **design-to-code alignment gap**.

---

## 0. Executive summary

The typography system has a genuinely strong core: one 21-role, two-surface fluid scale,
rem-based, generated from a single source, and proven identical to the Figma variable
collection at 438 of 438 name-by-mode pairs. It is also the layer where the estate's
north-star ("everything renders from one shared design system") is furthest from true.

**Three type scales run in production, not one** [Observed]:

| Scale | Where it lives | Size | Fluid? | Surface-aware? | Visible to the type gate? |
|---|---|---|---|---|---|
| The 21-role `--sa-type-*` scale | `@mosje/tokens` → `tokens.css` | 126 files · 1,251 refs | yes | yes | yes |
| A static px "smile-admin" scale exposed as Tailwind `@theme` `--text-*` | `apps/hub/src/app/globals.css:313-358` | 32 files · 242 utility uses | no | no | **no** |
| Stock Tailwind sizes (`text-xs` … `text-6xl`) | Tailwind v4 defaults, never re-bound | ≈170 files · **1,622** utility uses | no | no | **no** |

Plus **752 arbitrary `text-[Npx]` elements on the website home page alone** [Observed],
including its lead heading at `text-[38px] sm:text-[50px] lg:text-[62px]` in weight 900.

The consequence for a citizen: the same heading level renders at 40px fluid on one page,
36px static on the next portal, 32px static on the one after, and 62px on the website —
all under the same brand, all "on the design system". The consequence for the team: the
per-file ratchet gate (`check:type-linkage`) reports a shrinking backlog of 374 literals
while roughly 1,900 utility-driven sizes it cannot see sit outside it.

Everything else in this document is detail on that, plus the accessibility, standards,
performance and governance findings that sit beside it.

**Headline numbers** [Observed unless marked]:

| Metric | Value |
|---|---|
| Roles in the scale | 21 (Display 6 · Headline 6 · Title 3 · Body 3 · Label 3) |
| Custom properties emitted per surface | 73 (size, lh, para, tracking) |
| Figma Type variables / modes | 103 variables · 6 modes (Website·D/T/M, Portal·D/T/M) |
| Figma ↔ code variable parity (2026-09-01, per `design.md`) | 438/438 |
| Literal font sizes still in source (gate baseline) | 374, of which 184 off-ramp; 127 raw leadings; 20 raw trackings; 19 raw families across 162 files |
| `13px` occurrences (a size the contract bans) | 68 in source + a `text-body-3 = 13px` utility used 37 times |
| Files carrying Devanagari text | 20, of which 4 mark it `lang="hi"` |
| Roles below DBIM's 1.2× leading floor (website surface) | 9 of 21 [Derived] |
| Preloaded font bytes on every page | 148 KB, of which 99 KB is the Devanagari subset |

---

## 1. Critical issues

### C1. Three scales in production; the gate sees one of them
**Roles:** design-system manager, technical architect, senior developer, design director.
**Class:** implementation + design-to-code alignment gap. **Audience:** SC first (the
"one design system" claim is untrue for type today), then ENG.

**Evidence** [Observed]:
- `apps/hub/src/app/globals.css:313-358` declares a `@theme` block titled "smile-admin
  type scale": `--text-display-1: 44px` (the token says 80/56 fluid), `--text-headline-1:
  32px` (token: 40 website / 32 portal, fluid), `--text-headline-5: 18px/26px` (token:
  20/24), `--text-title-2: 18px` (token: 16), `--text-body-3: 13px` (token: 12), plus
  `--text-num-xl/lg` that exist nowhere in the token system. Tailwind v4 `@theme` is
  global and cannot be scoped to `[data-portal]`, so `text-headline-1` etc. are available
  and render the static value on every surface.
- Usage: 242 role-utility uses across 32 files (30 in smile-admin, 2 in the design-system
  docs). Observed on `/portals/smile-admin/login`: `h1.text-headline-1` = 32px/700 with
  `-0.32px` tracking — tracking the token scale does not define for headline tiers.
- Stock Tailwind: `text-sm` 777, `text-xs` 509, `text-base` 99, `text-2xl` 93, `text-xl`
  61, `text-lg` 40, `text-3xl` 20, `text-4xl` 18, `text-5xl` 4, `text-6xl` 1. The 18, 20,
  24, 30, 36, 48, 60px stops and their leadings are Tailwind's, not SAMAVESH's. No
  `--text-*`, `--leading-*` or `--font-weight-*` theme mapping to tokens exists in
  `tokens-tailwind.css` or `globals.css`. Concentrated in NMBA (58 files), NHAPOA (44),
  E-Anudaan (34), SCW (19), TG (11), and the hub's website components (58).
- Observed on `/portals/nhapoa`: `h1.text-4xl` = 36px/700/45px. 36px is not on the ramp;
  the portal role for a page title is headline-1 at 32px.
- The gate: `tools/type-linkage/check.mjs:93` matches `font-size:`, `fontSize:` and
  `text-[` only. Every named utility above is invisible to it.

**Impact:** design intent (Figma) and delivered type diverge on most portal pages; the
gate's "backlog can only shrink" guarantee is true of 374 literals and silent on ~1,900
utility sizes; any future scale change (a brand pack, a DBIM revision) reaches only the
first of the three scales.

### C2. The Website scale has almost no consumers on the website
**Roles:** design director, typography expert, UI/UX designer, product manager.
**Class:** design-to-code alignment gap. **Audience:** DL.

**Evidence** [Observed, home page only — full census is a research gap]:
- `/website` has **no `<h1>`** (`h1count: 0`). Heading order on the page: H2 38/900 →
  H2 32/600 → H3 22/500 → H3 18/500 → H2 28/600 → H3 15/600 → H3 16/500 → H2 32/600 →
  H3 14/500. Four H2 sizes, four H3 sizes, one page.
- The lead H2 ("Mann Ki Baat") is `text-[38px] sm:text-[50px] lg:text-[62px]`, weight
  900, line-height 39.9px (1.05×), tracking −0.95px. None of 38, 50 or 62 is a role; 900
  is not a loaded weight (see C3).
- `--sa-font-display` (the Noto Sans Display cut loaded specifically for the 40–80px
  Display ramp) has **one** consumer file in the estate. The Display tier — six roles,
  a dedicated webfont, six Figma modes — is effectively unused.
- `SectionTitle`, the DS's mandated section heading, binds **headline-5 (20px)**. The
  website's hand-rolled section headings are 28–32px. The DS heading is smaller than
  what pages actually want, which is a plausible cause of the 99 hand-rolled headings
  `ds-documentation-standard.md` records.

**Impact:** the most public surface of the estate does not use the scale the design
system was built for; the Figma Website mode documents a ramp citizens never see.

### C3. The weight contract is broken at runtime, including synthesised weights
**Roles:** typography expert, senior developer. **Class:** design + implementation.
**Audience:** DL and ENG.

**Evidence** [Observed]:
- `semantic.json` says headings stop at 600 and 700 is "reserved… for the rare in-line
  emphasis". The estate uses `font-bold` 460 times, `font-weight: 700` 31 times in DS
  component CSS, `font-weight: 800` twice (`app-switcher-panel.css`), `font-extrabold`
  and `font-black` in website components.
- `layout.tsx` loads Noto Sans at 400/500/600/700 only. Every 800/900 is **browser
  faux-bold** (synthetic emboldening of the 700 cut). Seven elements on the website home
  render at 800/900.
- Three nominally different roles — Title (500), Label (500), Display (500) — share a
  weight, and Body (400) differs from all three by exactly one step. Where a title and
  its body share size and leading (see M1), weight is the only distinguishing property.

**Impact:** heading weight varies 500–900 across pages under one brand; synthetic bold
renders differently per browser and blurs Noto Sans's counters at small sizes.

### C4. Documented standards conflicts are not recorded as deviations
**Roles:** business analyst, design director, gov-compliance. **Class:** design (and a
governance defect). **Audience:** SC.

**Evidence** [Observed → Derived]:
- DBIM 3.0 §4 mandates desktop **H1 36 / H2 24 / H3 20**, mobile **24 / 20 / 16**, and
  "line height should be 1.2 to 1.5 times the type size". SAMAVESH headline-1 is 40 on
  desktop and 28 on mobile; headline-2 is 32/24.
- Website-surface leading ratios below DBIM's 1.2 floor: display-1 **1.10**, display-2
  1.11, display-3 1.12, display-4 1.14, display-5 1.17, headline-3 **1.14**, headline-4
  1.17 — and display-6/headline-1/headline-5 sit exactly on 1.20. Nine roles under or on
  the floor.
- `.claude/rules/standards-precedence.md` allows quality to win over DBIM **if the
  deviation is documented**. The typography page's own standards panel cites "DBIM 4.3.1:
  the 21-role scale is the DBIM type scale as implemented". It is not; no deviation record
  exists in `docs/`, the page, or the Figma documentation frame.
- UX4G 3.0 §2 names **12px as the "minimum usable size"** (Body/XS). SAMAVESH ships
  label-3 at 11px, used 71 times via `text-label-3` plus its role bindings.

**Impact:** a compliance reviewer holding DBIM will find the estate non-conformant on
heading sizes and leading with no rationale on file. This is a paperwork failure
masking a defensible design decision — but only once it is written down.

### C5. Accessibility: five specific defects
**Roles:** accessibility auditor, UI/UX designer, product manager. **Class:** mixed.
**Audience:** SC (statutory exposure) and ENG.

1. **Sub-floor sizes** [Observed]. The contract's floor is 11px. Found below it: DS
   `charts.css` 10px ×2, `app-switcher-panel.css` 10px and **9px**, `media-gallery-input.css`
   10px, `demo-accounts-panel.css` 0.625rem; portals `pm-ajay.css` 10px, `smile-admin.css`
   9px, `eutthan.css` 10px. The embedded UX4G accessibility widget renders its description
   text at **10px** and its heading at **weight 200** (third-party markup; cannot be
   token-bound, but it is on every page).
2. **Muted text fails on the estate's own tinted grounds** [Derived from token hexes].
   `text/neutral/subtler` `#6f757d` = 4.65:1 on white (passes), **3.45:1 on
   `bg/neutral/subtle` `#dcdee1`** (fails AA for body-size text). Used in 7 files. The
   contrast contract judges text against white only — an open item the colour tokens
   already record; typography inherits it at the sizes where it hurts most.
3. **Four portals pin the root font size in px** [Observed]. `nmba.css`, `nhapoa.css`,
   `tg.css`, `scw.css` declare `html { font-size: calc(16px * var(--font-scale)) }`. This
   overrides the reader's browser default-font-size preference — the exact reason the
   scale was moved to rem — and the `[data-fontscale]` attribute that would vary it is
   **never set anywhere** (dead mechanism). Browser zoom still works (WCAG 1.4.4 is met),
   but the estate's stated rationale for rem is defeated on four of seven portals.
4. **Hindi text without `lang="hi"`** [Observed]. 20 files carry Devanagari; 4 mark it.
   Unmarked: smile-admin layouts, SCW layout/login/e-pledge, NHAPOA layout/login and
   `gov-chrome.tsx`, NMBA e-pledge and `public-shell.tsx`, the language dialog, the DS
   home and three DS component pages. Without `lang`, screen readers voice Hindi with an
   English engine and the `--sa-font-devanagari` binding (keyed on `[lang="hi"]`) never
   applies.
5. **The A−/A/A+ stepper scales unevenly across viewports** [Derived]. It sets
   `:root { font-size: calc(100% * scale) }`, which scales the `rem` terms of each
   `clamp()` but not the `vw` term. At A++ (1.2×) headline-1 at 768px grows from 33.3px
   to 38.0px (+14%), while its 360px and 1280px bounds grow +20%. The control does what
   it says at the anchors and less in between.

[Research gap] No screen-reader pass, no low-vision user session, and no
WCAG 1.4.12 text-spacing override test (line-height 1.5, paragraph 2em, letter 0.12em,
word 0.16em) was run. The 1.4.12 test is the one most likely to break the many
`line-height: 1` and fixed-height label pills found in the census.

### C6. Font delivery: the largest preloaded asset is one most pages never use
**Roles:** CTO, technical architect, senior developer. **Class:** implementation.
**Audience:** ENG, and SC for the sovereignty point.

**Evidence** [Observed from the built `.next` output]:
- `next/font` is configured with `subsets: ["latin", "devanagari"]`. It emits one
  variable-font file per subset and **preloads one file per declared subset**. The
  page-level preload set on `/` is three files: latin 36 KB, **Devanagari 99 KB**,
  Display-latin 13 KB. The layout comment says the Devanagari file "is fetched ONLY by
  pages that actually contain Devanagari characters". `unicode-range` would do that;
  `<link rel="preload">` overrides it. Every English-only page downloads 99 KB of
  Devanagari before first paint on a service explicitly designed for low-bandwidth
  audiences.
- Latin-extended (168 KB), Cyrillic (20 + 71 KB), Greek (22 KB), Vietnamese (15 KB) and
  symbol (11 KB) faces are also emitted; these correctly lazy-load only if such glyphs
  appear, so they are cost-free unless a stray character appears (a research gap: no
  census of non-Latin, non-Devanagari characters in content was run).
- Fallback faces with metric overrides (`Noto Sans Fallback`, `Noto Sans Display
  Fallback`) are present — good; layout shift on swap is mitigated.
- **Material Symbols Rounded is fetched from `fonts.gstatic.com`** with
  `font-display: block`. A Government of India property depends at render time on a
  third-party CDN outside India, and icon text ("arrow_forward") is invisible for up to
  3 s on a slow link. `icons.css` documents a self-host path and keeps the CDN as the
  default.

[Research gap] No field CWV data, no throttled-network Lighthouse run was done here.

### C7. The scale's tier is wrong, and a brand pack cannot re-scale type
**Roles:** technical architect, design-system manager. **Class:** implementation
(governance). **Audience:** ENG.

**Evidence** [Observed]:
- `font.role.*` and `font.tracking.*` are authored in `primitive.json` (Tier 1) but
  emitted as the unmarked Tier-2 `--sa-type-*`. There is no Tier-2 alias a brand pack
  could override; `figma-variables.mjs` has a special case (`typeScaleName`) whose
  comment says "one token carried two tiers". Every other family has the ref → sys
  ladder; type does not.
- The pre-role flat ramp `font.size.{11,12,14,16,20,22,48}` and
  `font.lineHeight.{16,20,24,28,56}` are still emitted as `--sa-ref-font-size-*` /
  `--sa-ref-font-lineHeight-*` with 25 live references in 5 files — Tier-1 primitives
  consumed by components, which `tier-discipline.test.mjs` is supposed to fail.
- Naming grammar is inconsistent within the family: `-lh`, `lineHeight`, `leading`
  (`--sa-leading-devanagari`) and the retired `--ds-leading-*` are four names for one
  property; `--sa-font-weight-displayMedium` is camelCase in a kebab namespace.

### C8. Figma: variables agree, the canvas does not
**Roles:** design-system manager, design director. **Class:** design-to-code alignment
gap. **Audience:** DL.

**Evidence** [Observed from `reference/figma-live.json` and the ghost baseline]:
- The 2026-08 rename deleted the old `Font Size/N`, `Line Heights/N`, `Letter Spacing/N`
  variables. The ghost audit found `Font Size/3` alone still bound on **2,876 nodes**
  across ~25 component pages — driving `padding`, `itemSpacing` and `cornerRadius`. A
  typography ramp is doing the spacing ramp's job on the canvas, detached from tokens,
  and this is accepted as ratcheted debt.
- Figma's Tablet mode samples the fluid curve at 768px and stores the result:
  display-1 = **57.74**, display-1 lh **63.51**, para **27.55**. Designers laying out
  tablet frames get non-integer, off-4px-grid type while the docs page claims "a strict
  4px rhythm".
- Text-style bindings (24 Noto Sans styles + Icon styles) were last verified live on
  2026-09-01 per `design.md`; this audit did not re-verify them. [Research gap: run the
  text-style binding sweep.]

---

## 2. Minor issues and refinements

Each row names the audience it primarily affects.

| # | Finding | Evidence | Class | Aud. |
|---|---|---|---|---|
| M1 | **Role collisions.** Website: title-2 ≡ body-1 (16/24), label-1 ≡ body-2 (14/20), label-2 ≡ body-3 (12/16); headline-6 = 16/20. Portal: headline-6, title-3 and body-1 all clamp 14→16. Only weight (one step) separates them. | `primitive.json` role table [Observed] | design | DL |
| M2 | **The portal ramp contains the sizes the contract bans.** headline-5 and title-2 bottom out at **15px**; body-2 min and body-3 max are **13px**. | same | design | DL |
| M3 | **body-3 has more leading than body-2 on Portal** (13/20 = 1.54 vs 14/20 = 1.43), so a smaller role occupies the same line height — density is not gained. | same [Derived] | design | DL |
| M4 | **Headline leading is non-monotonic** on Website: 1.20, 1.25, **1.14**, 1.17, 1.20, 1.25 for headline-1…6. | [Derived] | design | DL |
| M5 | **Tracking is px-in-rem, not em**, and only exists for Display tiers on Portal. 284 `uppercase` uses rely on Tailwind's `tracking-wide/wider/widest` (104/17/18) and 20 raw literals; the SMILE login shows four different caps trackings (0.18/0.14/0.12/0.08 em) in one viewport. | census + computed styles [Observed] | design + impl. | DL/ENG |
| M6 | **Paragraph-spacing tokens have no consumer.** 21 `-para` properties are emitted in CSS and Figma; no stylesheet outside the docs reads one. | grep [Observed] | impl. | ENG |
| M7 | **Storybook's Typography story is wrong.** It labels headline-2 as "Title 1" at weight 500 and shows 5 of 21 roles; the foundations story is outside the Storybook parity gate. | `Typography.stories.tsx` [Observed] | docs | ENG |
| M8 | **Six literals on the documentation surface**, the one `documentation-ds-linkage.md` calls strictest: `.ds-prose p { line-height: 1.6 }`, `typography.css` `line-height: 1.6` and `.06em`, `design-system.css` `0.875em`, `0.1em`, `line-height: 1`, `0.06em`. | [Observed] | impl. | ENG |
| M9 | **`design.md` §E still headlines `--ds-type-*`** as the canonical token names though the `--ds-*` layer was retired 2026-08-12. Live code has zero `var(--ds-type-…)` bindings, so the docs, not the code, are stale. | [Observed] | docs | DL/ENG |
| M10 | **Stale comment** in `ux4g-parity-css`: "UX4G sizes type in rem, SAMAVESH in px" — SAMAVESH has been rem since the `clampExpr` change. | [Observed] | docs | ENG |
| M11 | **Type stops growing at 1280px while the container keeps growing** to 1320 (at 1440) and 1440 (at 1920). Body stays 16px as the measure widens to 1376px. `.ds-prose` caps at 72ch on docs only; `max-w-prose` has 4 uses estate-wide. | tokens + `.sa-container` ladder [Observed] | design | DL |
| M12 | **`text-wrap: balance/pretty` is mandated by `design.md` for h1–h3 and paragraphs** but there is no global rule; 12 uses in 5 DS files. | [Observed] | impl. | ENG |
| M13 | **Weight 300 token is documented as "the icon cut"** yet lives under `font.weight` beside the text weights and Noto Sans 300 is not loaded; the icon `@font-face` declares `font-weight: 100 700`. Two families, one weight token. | [Observed] | impl. | ENG |
| M14 | **Inputs larger than their copy on phones.** Forms take a hard 16px floor below 768px (correct, iOS zoom); Portal body-1 bottoms at 14px, so paragraphs read smaller than the fields beside them. | [Observed] | design | DL |
| M15 | **Devanagari leading is a separate unitless 1.7**, not per-role; a Hindi headline-1 line is 68px against 48px Latin, and mixed-script paragraphs get mixed leading. One consumer. | [Observed] | design | DL |
| M16 | **The typography page mentions `text-title-1`/`text-title-2`** in its alias table — harmless prose, but it names the static smile-admin utilities as if they were part of the system. | [Observed] | docs | DL |
| M17 | **Icon font `font-display: block`** — correct to avoid ligature-text flash, but with a CDN origin it makes icons the slowest element on the page. Self-hosting removes the trade-off. | [Observed] | impl. | ENG |
| M18 | **MetricCard and charts still carry literals** (10/11/22px, `line-height: 1 / 1.35`) though both are token-heavy; five and seven respectively. | [Observed] | impl. | ENG |
| M19 | **Legacy `--ds-text-*` hazard text** is still the longest passage in `design.md`'s type section — archaeology in a living contract. Move to `docs/rules-rationale/`. | [Observed] | docs | DL |

---

## 3. Missing features and capabilities

| Gap | Blocks | Notes |
|---|---|---|
| **Text primitives.** No `Heading`, `Text`, `Caption` or `Prose` component; only `SectionTitle` (headline-5). Every page assembles size + leading + weight by hand, which is how three scales happened. | both | Highest-leverage gap. |
| **Semantic element → role map** (h1–h6, p, small, caption, th, legend, figcaption) per surface. The content JSON says only "h1–h3". UX4G publishes one; DBIM §4 requires one. | both | Also the fix for the "no h1" and "four H2 sizes" symptoms. |
| **Caps/label style** with positive tracking (+0.04–0.08em) and a rule for when uppercase is allowed. | both | 284 uppercase uses with ad-hoc tracking. |
| **Numeric roles** (KPI figures, tabular data) — `num-xl/lg` exist only in the smile-admin static scale; MetricCard hard-codes 22px. | both | `tabular-nums` is applied 107 times but with no size role. |
| **Measure token** (`--sa-measure` ≈ 65–75ch) and a rule binding prose containers to it, especially at ≥1440px. | design | See M11. |
| **Tailwind bridge**: `--text-*`, `--leading-*`, `--font-weight-*`, `--tracking-*` theme entries bound to `--sa-type-*` so `text-sm` cannot exist and `text-body-2` means the token. | engineering | Prerequisite for closing C1. |
| **Gate coverage** for named utilities (`text-xs`…`text-6xl`, `text-headline-*`, `font-bold`/`extrabold`/`black`, `leading-*`, `tracking-*`). | engineering | The ratchet is blind to ~1,900 sites. |
| **Weight gate**: weights ≥700 outside an allow-list; 800/900 anywhere (not loaded). | engineering | |
| **Floor gate**: any resolved size < 11px (or 12px if UX4G is adopted). | engineering | |
| **Leading-ratio test**: every role within 1.2–1.5× (DBIM) or a recorded exception. | engineering | |
| **Text-spacing survivability test** (WCAG 1.4.12) in Playwright: inject the override stylesheet, assert no clipping/overlap on key templates. | engineering | |
| **Large-text threshold metadata**: which roles qualify as WCAG "large" (≥24px, or ≥18.67px bold) so contrast checks can apply 3:1 correctly instead of 4.5:1 everywhere. | both | |
| **Font-loading policy** in one place: preload set, subsets, self-hosted icon font, fallback metrics, and a byte budget asserted by a test. | engineering | See C6. |
| **Devanagari-specific sizes** (script appears ~1 size smaller at equal px) and Hindi text styles in Figma. | design | [Research gap: verify with Hindi readers.] |
| **Deviation register** for DBIM/UX4G conflicts (headline sizes, leading floor, 11px label). | both | See C4. |
| **Print typography** (GIGW requires A4 printability). Two `@media print` blocks exist estate-wide. | engineering | |
| **Dark-theme type compensation** (weight/tracking on dark grounds). None exists; not a defect yet, but the dark theme is staged. | design | |
| **Storybook foundations parity** for typography (all 21 roles, both surfaces). | engineering | |

---

## 4. Recommendations

Ordered by impact ÷ effort. **QW** = quick win (≤ 1 day, no dependency).
**Dep** = depends on an earlier item.

| # | Recommendation | Who prioritises | Why it matters | Type |
|---|---|---|---|---|
| R1 | **Bind Tailwind's type theme to the tokens.** In `globals.css` `@theme`, define `--text-body-1: var(--sa-type-body-1-size)` with `--text-body-1--line-height` for all 21 roles, delete `--text-xs`…`--text-6xl` (set to `initial`), and delete the smile-admin static scale. `text-sm` then fails to compile and `text-body-2` becomes the token. | architect, senior dev, DS manager | Collapses three scales to one at the utility layer; every future change reaches all portals. | Dep on R2 (a migration codemod) — but the theme change itself is a QW |
| R2 | **Codemod the 1,622 stock utilities and 242 static-scale utilities** to role utilities with a mapping table (xs→body-3/label-2, sm→body-2, base→body-1, lg→title-1, xl→headline-5, 2xl→headline-4, 3xl→headline-3, 4xl→headline-2, 5xl→display-5, 6xl→display-3), reviewed per portal with screenshots. | senior dev, design director | Mechanical, reviewable, and the visual audit rule already requires the screenshots. | Medium |
| R3 | **Extend the type gate to named utilities and weights.** Add `text-(xs|sm|…)`, `text-(display|headline|…)-*`, `font-(bold|extrabold|black)`, `leading-*`, `tracking-*` to `check.mjs`; baseline; ratchet. | DS manager, senior dev | Stops the backlog growing while R2 runs. | QW |
| R4 | **Ship `Heading` and `Text` primitives** with `role` + `as` props, surface-aware by construction, plus the element→role map as their defaults (h1→headline-1, h2→headline-2, h3→headline-3, h4→headline-4, h5→title-2, h6→title-3, p→body-1, small→body-3, th→label-1). Re-point `SectionTitle` at headline-3. | design director, DS manager, PM | Removes the reason pages hand-roll type; fixes the 20px section-heading mismatch. | Medium; unblocks R2's hardest cases |
| R5 | **Write the deviation register** (DBIM headline sizes, 1.2× leading floor, 11px label-3 vs UX4G 12px) in `docs/audit/` and on the Figma "09 Standards" section; correct the "DBIM 4.3.1 as implemented" line on the docs page. | business analyst, design director | Turns a compliance finding into a documented decision. | QW |
| R6 | **Fix font delivery:** drop `preload` for the Devanagari subset (`preload: false` on a second `Noto_Sans` loader, or trim the preload set), self-host Material Symbols under `/fonts`, keep `font-display: block` for icons. Add a test asserting preloaded bytes ≤ 60 KB. | CTO, architect | 99 KB off every English page; removes the external render-time dependency. | QW |
| R7 | **Remove the px root override** from `nmba/nhapoa/tg/scw.css` and delete the dead `--font-scale`/`[data-fontscale]` mechanism; those portals inherit the DS stepper. | accessibility, senior dev | Restores the reader's default font-size preference on four portals. | QW |
| R8 | **Mark every Devanagari string with `lang="hi"`** (16 files); add a lint that fails on unmarked Devanagari in TSX. | accessibility, senior dev | Screen-reader voice and font binding both depend on it. | QW |
| R9 | **Re-cut the collisions** (M1–M4): give Title a distinct leading from Body (e.g. title-2 16/22, title-3 14/18), move headline-3 to 28/36, raise portal body-1 min to 15 or hold 16 and let the layout, not the type, absorb phones; remove the 13/15px stops. Re-baseline Figma modes. | typography expert, design director | Hierarchy should not depend on one weight step. | Medium; a Figma + token change with a visual audit |
| R10 | **Enforce the weight policy**: loaded weights 400–700 are the only legal ones; 700 allowed on Display/Headline only where a documented reason exists; ban `font-extrabold/black` via R3. Re-take the "MannKi Baat" hero at display-3/500 on Noto Sans Display. | typography expert | Ends synthetic bold and the 500–900 spread. | QW after R3 |
| R11 | **Widen the contrast contract to tinted grounds** for text tokens, or forbid `subtler` on `bg/neutral/subtle` and below; add a "large text" flag per role so 3:1 applies only where WCAG allows it. | accessibility, DS manager | The 3.45:1 case is a real AA failure on real surfaces. | Medium; shared with the colour system |
| R12 | **Give type a Tier-2 layer**: move `font.role.*` values into `semantic.json` as `type.*` aliases of primitives, drop the Figma special case, retire `font.size.*`/`font.lineHeight.*` after re-pointing 25 refs. | architect | Brand packs can re-scale; tier lint becomes honest. | Medium |
| R13 | **Snap Figma Tablet values to integers on the 4px grid** (sample the curve, then round to 4) and record the rounding so `figma-value-parity` accepts it. | DS manager | Designers stop inheriting 57.74px. | QW (build change) + Figma push |
| R14 | **Add `tracking.caps` (+0.06em) and a caps-label utility**, and forbid `uppercase` without it. | typography expert, UX | One caps tracking instead of four. | QW |
| R15 | **Add the measure token and bind prose containers**; decide whether body-1 grows at 1440/1920 or the measure caps. | design director | Line length is a DBIM clause and a reading-speed variable. | QW |
| R16 | **Bring the docs in line**: fix the Storybook story, remove `--ds-type-*` from `design.md` §E, move the alias-hazard archaeology to rules-rationale, delete the six docs-surface literals, stale UX4G comment. | DS manager | The docs are the contract the next engineer reads. | QW |
| R17 | **Add the four missing tests**: floor ≥ 11px, leading 1.2–1.5× or exception, weights ∈ {400,500,600,700}, WCAG 1.4.12 text-spacing overlay in Playwright on five templates. | senior dev, accessibility | Makes the standards executable. | Medium |
| R18 | **Research** (cannot be done from code): Hindi reader legibility at 14/16px and 1.7 leading; low-vision users on the A−/A+ stepper; scanning tests on portal dashboards (label-3 11px caps vs 12px); field CWV with the font change. | PM, UX | Every design claim above about "readability" is otherwise untested. | — |

**Trade-offs to name:**
- *Fluid type vs. designer control.* Fluid clamps give code a continuous scale that Figma
  can only sample. R13 rounds the samples; it does not remove the gap. The alternative
  (breakpoint-stepped type in code) matches Figma exactly but reintroduces jumps.
- *DBIM literalism vs. quality.* Adopting DBIM's 36/24/20 would shrink headline-1 and
  flatten the ramp; the estate's rule says quality wins **if documented**. R5 documents;
  it does not capitulate.
- *Portal density vs. phone legibility.* Portal body-1 at 14px on phones is a density
  choice that collides with the 16px input floor (M14). Either raise the floor to 15/16
  or accept the mismatch and write it down.
- *Preload vs. Hindi first paint.* Dropping the Devanagari preload costs Hindi pages one
  round trip before their text swaps in. With metric-matched fallbacks that is a swap,
  not a shift; for a bilingual site it is the right default, but a Hindi-first route
  could opt back in.

---

## 5. Implementation roadmap

### Phase 1 — Quick wins (≈ 1 week, no dependencies) · benefits ENG and SC first
| Item | Effort | Dependency |
|---|---|---|
| R3 gate extension + baseline | S | — |
| R6 font delivery (preload trim, self-host icons, byte test) | S | — |
| R7 remove px root override on four portals | S | — |
| R8 `lang="hi"` sweep + lint | S | — |
| R5 deviation register + docs-page correction | S | — |
| R16 docs alignment (Storybook, `design.md`, literals) | S | — |
| R14 caps tracking token | S | Figma push |
| R13 Figma tablet rounding | S | Figma push |

### Phase 2 — Consolidation (≈ 3–4 weeks) · benefits DL and ENG
| Item | Effort | Dependency |
|---|---|---|
| R1 Tailwind theme bound to tokens; delete stock and static scales | M | Phase 1 gate (R3) to hold the line |
| R4 `Heading`/`Text` primitives + element→role map; `SectionTitle` re-pointed | M | — |
| R2 codemod per portal with screenshot audit (NMBA, NHAPOA, E-Anudaan, SCW, TG, smile-admin, website components) | L | R1, R4 |
| R10 weight policy enforced; website hero re-set on Display | S | R3 |
| R15 measure token + prose binding | S | — |

### Phase 3 — Structural (≈ 4–6 weeks, after Phase 2 lands) · benefits DL, then SC
| Item | Effort | Dependency |
|---|---|---|
| R9 re-cut role collisions and leading; re-baseline Figma modes | M | Phase 2 (so the re-cut reaches every page) |
| R12 Tier-2 type layer; retire flat ramp; drop Figma special case | M | R9 (do the value change and the move together) |
| R11 contrast contract on tinted grounds + large-text flags | M | colour-system owner |
| R17 executable standards tests | M | R9 (so they pass on day one) |
| R18 research programme (Hindi legibility, low-vision stepper, dashboard scanning, field CWV) | — | can start in Phase 1; informs Phase 3 values |

**Order of benefit.** Phase 1 removes the statutory and performance exposure and stops the
debt growing. Phase 2 is where citizens see a difference: one scale on every portal.
Phase 3 is where the scale itself gets better.

---

## Appendix A — Observed computed styles (dev server, 2026-09-04)

| Page | Element | Class (truncated) | Rendered |
|---|---|---|---|
| `/website` | h2 "MannKi Baat" | `text-[38px] sm:text-[50px] lg:text-[62px]` | 38px / 900 / 39.9px / −0.95px |
| `/website` | h2 "About Us" | `text-[32px] font-semibold leading-tight` | 32 / 600 / 40 |
| `/website` | h2 "Our Offerings" | `text-[28px] sm:text-[32px] font-semibold` | 28 / 600 / 35 |
| `/website` | h3 minister names | `text-[22px]`, `text-[18px] font-medium` | 22 / 500 / 33 · 18 / 500 / 27 |
| `/website` | h3 scheme cards | — | 15 / 600 · 14 / 500 |
| `/website` | h1 | — | **none on page** |
| `/portals/nhapoa` | h1 | `text-4xl font-bold` | 36 / 700 / 45 |
| `/portals/nhapoa` | h2 | `text-2xl font-bold` | 24 / 700 / 32 |
| `/portals/nhapoa` | lead p | `text-lg` | 18 / 400 / 28 |
| `/portals/smile-admin/login` | h1 | `text-headline-1 font-bold` | 32 / 700 / 40 / −0.32px |
| `/portals/smile-admin/login` | h1 | `text-headline-2 font-bold tracking-tight` | 28 / 700 / 36 / −0.7px |
| `/portals/smile-admin/login` | caps labels | `text-label-3 … tracking-[0.18em]` etc. | 11px at 1.98 / 1.54 / 1.32 / 0.88px tracking |
| any page | UX4G widget h2 / p | third-party | 16 / **200** · **10px** / 400 |

## Appendix B — Leading ratios per role (Website / Portal, desktop max)

display-1 1.10/1.14 · display-2 1.11/1.17 · display-3 1.12/1.20 · display-4 1.14/1.25 ·
display-5 1.17/1.29 · display-6 1.20/1.33 · headline-1 1.20/1.25 · headline-2 1.25/1.29 ·
headline-3 1.14/1.33 · headline-4 1.17/1.40 · headline-5 1.20/1.33 · headline-6 1.25/1.50 ·
title-1 1.27/1.40 · title-2 1.50/1.33 · title-3 1.43/1.50 · body-1 1.50/1.50 ·
body-2 1.43/1.43 · body-3 1.33/1.54 · label-1 1.43/1.43 · label-2 1.33/1.33 · label-3 1.45/1.45

## Appendix C — Sources read

`packages/tokens/src/{primitive,semantic,component,system.generated}.json` ·
`packages/tokens/build/formats/{legacy-ds-css,figma-variables}.mjs` ·
`packages/tokens/dist/{tokens.css,figma.variables.json}` ·
`packages/tokens/reference/{figma-live,ghost-bindings-baseline}.json` ·
`packages/tokens/test/build-output.test.mjs` · `tools/type-linkage/{check.mjs,baseline.json}` ·
`packages/design-system/design.md` §D–F · `packages/design-system/icons.css` ·
`packages/design-system/components/**/*.css` (census) ·
`packages/design-system/components/utilities/{font-scale.ts,accessibility-bar.css}` ·
`apps/hub/src/app/{layout.tsx,globals.css}` · `apps/hub/.next/dev/static/chunks/*.css` (font faces) ·
`apps/hub/.next/server/app/index.html` (preloads) · `apps/hub/src/app/portals/*/*.css` ·
`apps/hub/src/app/design-system/foundations/typography/*` · `apps/storybook/stories/foundations/Typography.stories.tsx` ·
`docs/guidelines/{DBIM-3.0,GIGW-3.0,UX4G-3.0}/*.md` · `docs/specs/samavesh-typography-unification-spec.md` ·
`docs/research/figma-typography-3way-comparison.md` · Figma `3FF5l0SMNIwdpZrKkeyPTm` pages list and
node `54955:731` ("Typography — Documentation", 1680 × 20026, 12 sections).
