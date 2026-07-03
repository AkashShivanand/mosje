# SAMAVESH — Figma ↔ `@mosje/tokens` Drift Report (WS‑1.6)

> **Purpose:** Reconcile the Figma design-system variables against the code-side `@mosje/tokens` DTCG source (the declared source of truth). Produced 2026‑07‑01. **Read-only analysis — no changes made.**
>
> **Headline:** These are **two token systems of different maturity and lineage**. `@mosje/tokens` is a modern **3‑tier DTCG** system (primitive → semantic → component) with 4 theming axes; the Figma variables are a **flatter, UX4G‑inherited** structure with a single conflated colour axis. The **primitive scales largely match by value**, but the **semantic naming, theming model, and several token families have drifted**. Full reconciliation is a deliberate project, not a quick fix — this report scopes it.

---

## 1. Verdict by category

| Category | Name parity | Value parity | Notes |
|---|---|---|---|
| **Spacing** | ✅ 1:1 | ✅ 1:1 | `spacing-md`=12 = `spacing.md`=12, whole scale identical. Gold standard — do nothing. |
| **Border Radius** | ✅ 1:1 | ✅ 1:1 | `radius-md`=8 … `radius-full`=999 identical. Do nothing. |
| **Motion** | ✅ 1:1 | ✅ 1:1 | durations 150/250/400 + 3 easings identical. Do nothing. |
| **Density** | ⚠️ close | ✅ | Figma `control-height` 40/32 = code `density.control.height`. But **only 1 token** each — thin axis (WS‑1.4). |
| **Colour — primitives** | ⚠️ naming | ✅ mostly | Values match (`Primary/500` #0373df = `blue.500`; `Danger/500` #ec5042 = `red.500`; `Success/500` #2e7d32 = `green.500`; `Info/*` ramp matches). Naming differs (`Primary/500` vs `color.blue.500`). |
| **Colour — semantic** | ❌ diverged | ⚠️ | Different model entirely (see §3). `Text/Primary` vs `color.text.default`; `Stroke/50‑600` vs `color.border.{subtle,strong,control}`. |
| **Typography** | ❌ diverged | ⚠️ | Figma `Font Size/0‑14` raw scale vs code responsive **type roles** (`display1‑6`, `headline1‑6`, `body1‑3`, `label1‑3`). No responsive modes in Figma. |
| **Theming axes** | ❌ | — | Code has 4 axes; Figma has 1 conflated + density (see §4). |

---

## 2. Value drifts (same concept, different hex) — fix these

| Token | Figma | `@mosje/tokens` | Severity |
|---|---|---|---|
| **Warning / status.warning** | `Warning/500` **#bb772b** (amber) | `status.warning` → yellow.500 **#ffd323** | ✅ **RESOLVED (2026‑07‑01): Figma `#bb772b` is canonical.** Keep brand yellow `#ffd323` as `brand.yellow`, but change **code** `status.warning` `#ffd323 → #bb772b` (decouples brand-yellow from warning-status; #bb772b has far better text contrast for WCAG). Action = code-side edit to `packages/tokens` semantic.json + rebuild. Figma unchanged. |
| **Dark-mode neutrals** | `Neutral/*` **Blue‑Dark** uses Tailwind grays (#f9fafb, #f3f4f6, #e5e7eb, #374151…) | code `a11y.dark.*` palette (#0f1115, #f3f4f6, #1b1f27…) | **Medium** — dark neutral ramps come from different sources; dark surfaces won't match code. |
| **Danger in dark** | `Danger/500` stays **#ec5042** in Blue‑Dark | `status.danger` dark = **#ff6b5e** (lightened for contrast) | **Medium** — Figma doesn't lighten danger for dark; fails the code's dark‑contrast intent. |
| **Secondary (mode‑swap)** | `Secondary/500` = **#f97316** (saffron) in Light, **#198754** (green) in Dark | code has no "secondary" — separate `brand.saffron` (#f97316) + `status.success` (#2e7d32) | **Medium** — Figma conflates saffron→green under one "Secondary" token; conceptually incoherent vs code. |

---

## 3. Architecture & semantic-model drift

**Code (`@mosje/tokens`) — 3 tiers:**
- **Primitive** (`color.neutral.*`, `color.blue.*`, `color.primaryRamp.light/dark.*`, `saffron`, `navy`, `yellow`) — brand-agnostic.
- **Semantic (public contract)** — `color.action.primary.{default,hover,tonal}`, `color.text.{default,muted,strong,disabled,onPrimary,info}`, `color.bg.{surface,muted,alt,navbar}`, `color.border.{subtle,strong,control,controlHover}`, `color.status.*`, `color.focus.ring`, `color.overlay.scrim`, `color.chart.*`.
- **Component** — `button.primary.bg`, `card.bg`, etc. (aliases to semantic).

**Figma — effectively 1.5 tiers in one `Color` collection:**
- Primitive ramps (`Primary/50‑900`, `Neutral/*`, `Success/*`, `Danger/*`, `Info/*`, `Warning/*`, `Secondary/*`) **and** a thin semantic layer (`Text/*`, `Stroke/*`) all live in the **same** collection, mixed together.
- **No component-tier tokens.** No `button.*`/`card.*` variables.
- **Semantic gaps:** Figma has `Text/*` and `Stroke/*` but **no** `action/*`, `bg/*` (surface/muted/alt/navbar), `focus.ring`, or `overlay.scrim` semantic variables.

**Missing token families in Figma (present in code):**
- ✅ **High-contrast — NOT a Figma token gap (corrected).** HC is delivered by the **UX4G Accessibility Widget** (a component present in Figma as the "Accessibility Bar and Widget" page and in code as `AccessibilityWidget`), not by a colour mode. So Figma correctly has *no* HC token mode. **However, the code side has a separate problem: THREE parallel HC implementations** (see [`samavesh-accessibility-consolidation.md`](./samavesh-accessibility-consolidation.md)) — the widget (canonical), an orphaned `data-theme="hc"` token overlay, and smile-admin's local `data-highcontrast`. That is a code-consolidation task, not a Figma-token task.
- 🟠 **`font.family.devanagari`** (Indic-script support with extra leading) — authored in `packages/tokens` but **not applied by any component/page yet**, and absent from Figma. Relevant for a multilingual Indian government estate; a genuine (lower-urgency) gap on both sides.
- 🟠 **Chart tokens** — code has `chart.cat.1‑12`, `chart.seq.*`, `chart.div.*`, `chart.trend.*`, grid/axis/tooltip (all theme-aware); Figma has a "Charts & Graphs" page but **no chart variables**.
- 🟠 **Semantic `bg/*` and `action/*`** surfaces — not modelled as Figma variables.
- 🟡 **Responsive type roles** — code has mobile/tablet/desktop breakpoint type; Figma typography is single-mode raw sizes.

---

## 4. Theming-axis drift

| Axis | `@mosje/tokens` | Figma | Gap |
|---|---|---|---|
| Theme | `data-theme` = **light / dark / hc** | — (HC via Accessibility Widget) | Figma has no independent theme axis. HC is correctly a **widget**, not a mode. But code's `hc` theme overlay is one of 3 parallel HC impls to reconcile. |
| Colour brand | `data-color-mode` = **blue-dark** | `Color` modes = **Blue‑Light / Blue‑Dark** | Figma **conflates** theme+brand into one axis. Code keeps them orthogonal. |
| Density | `data-density` = **compact** | `Density` modes = **Comfortable / Compact** | ✅ aligned. |
| Responsive | `@media` mobile/tablet/desktop type | — | Figma type is not responsive. |

**Consequence:** Figma cannot currently express "dark theme" and "blue-dark brand" independently, and cannot express high-contrast at all. A designer in Figma has fewer theming levers than the code ships.

---

## 5. Naming-convention drift

| System area | Figma | Code | Aligned? |
|---|---|---|---|
| Spacing / Radius / Motion / Density | `spacing-md`, `radius-md`, `duration-fast`, `control-height` (kebab) | `spacing.md`, `radius.md`, `motion.duration.fast`, `density.control.height` (kebab dot-path) | ✅ effectively aligned |
| Colour | `Primary/500`, `Text/Primary`, `Neutral/0 - White` (Title-Case + `/`) | `color.blue.500`, `color.text.default`, `color.neutral.0` (kebab dot-path) | ❌ different |
| Typography | `Font Size/3`, `Font Weights/noto-sans-2`, `Font Family/Headings` | `font.size.300`, `font.weight.semibold`, `font.family.latin` | ❌ different |

The output pipeline also emits `--sa-*` (new) and legacy `--ds-*` CSS vars — neither of which is reflected in Figma names.

---

## 6. Recommended reconciliation strategy (scoped, not executed)

This is deliberately **not** done in this pass — full renaming/re-modelling rebinds live consumers and is a project. Recommended order when you take it on:

1. **Adopt one direction of truth: code leads.** `@mosje/tokens` is already declared the source of truth and is the richer model. Figma should converge toward it, not vice-versa.
2. **Fix the value drifts first (§2)** — cheap, high-impact: correct Figma `Warning` to #ffd323, align dark neutrals to the `a11y.dark` palette, lighten `Danger` in Blue‑Dark, and split "Secondary" into a saffron brand token + a success status token.
3. **Accessibility:** do NOT add an HC token mode to Figma — HC is the Accessibility Widget's job. Instead **consolidate the 3 parallel code HC implementations onto the widget** (see [`samavesh-accessibility-consolidation.md`](./samavesh-accessibility-consolidation.md)), and **apply `font.family.devanagari`** where Indic text renders.
4. **Introduce a semantic layer in Figma** mirroring the code's `action/*`, `bg/*`, `border/*` (rename `Stroke/*`→`border.*`), `focus.ring`, `overlay.scrim` — ideally as a **separate `Semantic` collection** aliasing the primitive collection, matching the code's tiering.
5. **Separate the theming axes** — split Figma's single `Blue - Light/Dark` into an orthogonal theme axis (light/dark/hc) + brand mode, to match `data-theme` × `data-color-mode`.
6. **Model chart tokens** as variables so the "Charts & Graphs" page is token-driven.
7. **Re-name convention:** decide whether Figma adopts the code's kebab dot-path for colour/typography (biggest churn, do last, in a branch, one collection at a time).

**Do NOT** attempt 4–7 without a branch + per-collection verification — they rebind live component instances across 20+ consumers.

---

## 7. What's genuinely healthy (leave alone)
- Spacing, Radius, Motion — **perfect parity**. This proves the pipeline concept works end-to-end.
- Primary/Success/Danger/Info **source hexes** match.
- Noto Sans is consistent on both sides.
- Density values match (the axis just needs more tokens — WS‑1.4).
- **No dual colour system (verified 2026‑07‑02).** Colours are 100% variables (139). The local *styles* are all legitimate: 20 avatar IMAGE fills, 21 **variable-bound** text styles, 12 effect styles (shadows/focus) and 11 grid styles — none of which can be expressed as plain variables. The earlier "retire duplicate paint styles" concern was a false alarm; there is nothing to consolidate.
