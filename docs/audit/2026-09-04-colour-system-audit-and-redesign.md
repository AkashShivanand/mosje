# The SAMAVESH colour system — four-lens audit and redesign

**Date:** 2026-09-04 · **Branch:** `ds/colour-system-redesign` · **Scope:** every colour family
(brand primary/secondary/accent, the four statuses, neutrals, disabled, borders, links, charts),
across the two estate brands and the six DBIM conformance previews, on web.

**Source of truth read:** `packages/tokens/src/{primitive,semantic,system.generated}.json`
(DTCG), `brands/mosje/brand.json`, `build/{ramp,brand-ramps,generate-system-tokens}.mjs`,
`dist/{tokens.css,figma.variables.json}`, `reference/figma-live.json`, and the component
stylesheets that consume them. Every number below was measured with the package's own
`oklch.mjs`, `wcag.mjs` and `cvd.mjs`, not estimated.

---

## 0. Summary

The colours read as dull for one dominant reason and three secondary ones, and none of them
was hue choice:

1. **Every status ink was two rungs too dark.** `text/status/*/base` resolved to rung 700
   (L\* 33–44, 7.8–11.7:1 on white). USWDS, GOV.UK, IBM Carbon, GitHub Primer and Atlassian put
   the same role at L\* 48–57 and 4.6–7:1. A dark colour has little chroma to give — sRGB cannot
   hold much colour at L\* 33 — so success was a black-green (`#004220`) and warning a brown
   (`#704b00`). Contrast had been overshot into AAA on every status ink, and the cost was paid in
   colour.
2. **The green ramp was starving its own tints.** India Green `#046A38` (L\* 46) was pinned at
   rung 500, which dragged the whole success/accent ladder a rung darker than every sibling
   (rung 600 at L\* 39 against 49 elsewhere), and the ramp's chroma arc tapered so steeply from a
   dark anchor that `success/100` held **17 %** of the chroma sRGB allows at that lightness — a
   sage grey named "success". Danger and info never showed it because their anchors are light
   enough to hit the gamut wall anyway.
3. **Info was the brand.** `#1a73e8` sat 3° and ΔE 0.5 from gov-blue. An info banner, an info
   badge and a primary button were one colour; the toast's info variant was painted with
   `primaryScale/50` directly.
4. **Components were bypassing the tokens.** The alert painted its four grounds as hand-mixed
   percentages of the ink over white (6 %, 7 %, 14 %, 6 %) — the warning alert was khaki — and
   its warning glyph was `--sa-color-brand-yellow` (`#FFD323`, 1.44:1). The solid warning badge
   was dark text on a brown at 2.08:1.

Plus three defects no one had named: every status **`bolder` ink was lighter than its
`base`**; `text/brand/primary/base` **failed AA (4.07:1) on the page ground** every `<body>`
carries; and the resting form-control border was **2.68:1 on that same ground**.

**What changed:** status inks moved to rung 600 (`bolder` 700); India Green re-anchored at 600;
the tint exponent in `ramp.mjs` went 0.85 → 0.5; danger rotated 28.7° → 24°; info moved to
hue 220; brand text moved to rung 600; disabled ink became opaque; the control border moved to
rung 500; the alert, toast and badge read tokens. **164/164 token gates pass**, every `on/*`
pair is AA in all eight modes, no ramp broke the shape rule, and the shortfall ledger shrank
16 → 15 with nothing added. **Figma has not been pushed** (§12).

---

## 1. Lens: colour theory and visual design

### 1.1 What was measured

Chroma is reported as **C / C<sub>max</sub>** — the token's OKLCH chroma as a share of the
maximum sRGB can display at that exact lightness and hue. It is the objective "dullness"
figure: 100 % is as vivid as the gamut permits; 17 % is grey with a hint of hue.

| Family, rung | Before | L\* | C/C<sub>max</sub> | After | L\* | C/C<sub>max</sub> |
|---|---|---|---|---|---|---|
| success / 50 (alert ground) | `#ecf4ee` | 95.9 | **17.9 %** | `#e3f8e8` | 95.9 | 46.8 % |
| success / 100 (badge, toast) | `#bed8c5` | 85.8 | **17.5 %** | `#b3dcbe` | 85.7 | 27.2 % |
| success / 200 | `#91b99c` | 74.8 | 31.2 % | `#87bd97` | 75.0 | 41.2 % |
| success / 400 | `#3b8155` | 54.6 | 71.9 % | `#368253` | 54.6 | 76.3 % |
| success ink (`text/status/success/base`) | `#004220` | **33.2** | 99.9 % | `#00542b` | 39.1 | 99.9 % |
| success fill (`bg/status/success/bolder`) | `#00542b` | 39.1 | — | `#00542b` | 39.1 | — |
| warning / 100 | `#f7d5a6` | 89.0 | 76.9 % | `#ffd394` | 89.1 | 99.6 % |
| warning ink | `#704b00` | **44.3** | 99.9 % | `#8b5e00` | 51.7 | 100 % |
| warning solid chip | `#704b00` + dark ink | 44.3 | — | `#e09c1d` + dark ink | 74.1 | 95.7 % |
| danger / 300 | `#f87868` | 71.9 | 90.9 % | `#fe716d` | 71.8 | 98.5 % |
| danger ink | `#8b1f18` | **42.0** | 84.1 % | `#aa2d30` | 49.3 | 80.8 % |
| info / 50 | `#edf4ff` | 96.5 | 98.9 % | `#e2f8ff` | 96.5 | 98.9 % |
| info ink | `#0a5cc3` | 49.4 | 96.3 % | `#006d85` | 49.5 | 100 % |
| brand text (`text/brand/primary/base`) | `#0373df` | 56.5 | 99.3 % | `#005eb9` | 49.0 | 100 % |

Note the ladder itself: before, rung 600 sat at L\* 49.0 (primary), 56.2 (secondary),
**39.1 (accent/success)**, 49.4 (danger), 51.7 (warning), 49.4 (info). "600" meant a different
thing in the green family than in every other, and every success surface inherited that.

### 1.2 Diagnosis

- **Tone/lightness** was the primary fault. Status inks and the success fill were two rungs
  darker than their job required. Peer systems (measured: USWDS `#008817` L\* 54, GOV.UK
  `#00703c` L\* 48, Carbon `#198038` L\* 53, Primer `#1a7f37` L\* 52, Atlassian `#1f845a` L\* 55)
  agree on L\* 48–57 for a status ink on white.
- **Saturation** was a secondary fault confined to the green family's tints (17–31 %) and the
  warning tints (67–77 %). Blue, red and orange tints were already at the gamut wall; no
  amount of "more saturation" was available or missing there.
- **Harmony**: two families were effectively one (info ≡ primary, ΔE 0.5), and the coral red
  (hue 29) sat 12° from India Saffron (hue 41) so error tints and secondary tints collided
  (ΔE 3.4 at rung 50). The neutrals are correct as designed — brand-hue-locked, 6–10 % chroma,
  a deliberate cool grey — and are not what reads as dull.
- **Luminosity/contrast**: the primary `#0373DF` is vivid (99 % of gamut); what surrounds it
  was muddy, so the brand looked isolated rather than anchoring a family.

### 1.3 Across the three product contexts

| Context | What the old system did | What the new one does |
|---|---|---|
| Citizen forms and transactions | Error text brick-brown; success confirmation near-black; warning message a brown on a khaki ground | Error `#aa2d30` (6.7:1), success `#00542b` (9.1:1), warning `#8b5e00` (5.7:1) on their own `base` tints; every message keeps its icon and its word |
| Administrative dashboards | Success/error/warning badges sage, salmon and brown; solid warning badge unreadable; info chips looked like primary actions | Four statuses read as four hues (success 154°, warning 76°, error 24°, info 220°, brand 255°); solid amber chip with dark ink at 6.9:1 |
| Data-heavy portals | Diverging scale's negative wing tracked the coral red; `chart/trend/*` inherited the dark inks | Diverging references follow the rotated red automatically; categorical palette untouched (it was re-cut on 2026-08-28 with its own CVD guarantee and stays — see §13 for its own follow-up) |

---

## 2. Lens: accessibility and standards

### 2.1 WCAG 2.2 contrast — what actually failed before

The `on/*` ink pairings all passed AA in all eight modes before this work, and the generated
audit said "no shortfall". The failures were in what the audit did not measure:

| Token | Pair | Before | Criterion | After |
|---|---|---|---|---|
| `text/brand/primary/base` | on `bg/neutral/subtler` (the `<body>`) | **4.07:1** | 1.4.3 text ≥ 4.5 | 5.57:1 |
| `border/neutral/bolder/default` | on `bg/neutral/subtler` | **2.68:1** | 1.4.11 ≥ 3 | 4.07:1 |
| `.ds-alert--warning .ds-alert__icon` | `#FFD323` on white | **1.44:1** | 1.4.11 ≥ 3 | 5.68:1 |
| `.ds-badge--solid.ds-badge--warning` | `#1e2124` on `#704b00` | **2.08:1** | 1.4.3 ≥ 4.5 | 6.89:1 |
| `text/neutral/disabled` | on `bg/neutral/disabled` | 1.83:1 | exempt (1.4.3) | 2.68:1 |
| `text/status/info/base` on `status/infoTonal` | badge | 4.50:1 (knife-edge) | 1.4.3 | 5.42:1 |

Every changed role, after:

| Role | success | error | warning | info |
|---|---|---|---|---|
| `text/status/*/base` on white | 9.12 | 6.72 | 5.68 | 5.96 |
| … on the muted page | 7.99 | 5.88 | 4.97 | 5.22 |
| … on its own `base` tint | 8.19 | 5.58 | 5.11 | 5.42 |
| … on its own `subtler` tint | 6.03 | 4.35\* | 4.05\* | 4.31\* |
| `text/status/*/bolder` on white | 11.67 (AAA) | 9.10 (AAA) | 7.79 (AAA) | 8.40 (AAA) |
| white on `bg/status/*/bolder` | 9.12 (AAA) | 6.72 | 5.68 | 5.96 |
| dark ink on `bg/status/*/bold` (amber's solid chip) | — | — | 6.89 | — |

\* On the `subtler` tint use the `bolder` ink (`on/bg/status/*/subtler` already names the
neutral ink at 10–12:1); the `base` ink is measured for the page and the `base` tint.

AAA is reached wherever it costs nothing: every `bolder` ink, every `boldest` fill, the success
family throughout. It is deliberately **not** reached by the `base` inks any more — that
overshoot is the dullness.

### 2.2 Colour-vision deficiency (Machado 2009, severity 1.0)

Minimum OKLab ΔE over every pair in the set, worst pair named. The package's chart gate treats
ΔE ≥ 8 as "distinguishable at once"; status colours never reach that under protanopia because
red and green collapse onto one axis — which is why no status on this estate is ever colour
alone (icon + word, always).

| Set | Normal | Protanopia | Deuteranopia | Tritanopia |
|---|---|---|---|---|
| Status inks + brand, before | 7.1 (info·primary) | 1.0 (success·error) | 2.1 (error·warning) | 7.4 (info·primary) |
| Status inks + brand, **after** | **10.2** | 1.1 (success·error) | **3.4** | 2.2 (info·primary) |
| Tonal grounds (rung 50), before | 0.1 (info·primary) | 0.1 | 0.3 | 0.1 |
| Tonal grounds (rung 50), **after** | 1.5 | 0.7 | 0.1 (info·primary) | 0.8 |
| Filled rungs (600), before | 1.7 (info·primary) | 0.6 (success·error) | 1.6 (info·primary) | 0.8 (info·primary) |
| Filled rungs (600), **after** | **8.6** | 0.7 (warning·secondary) | **3.4** | 2.2 (info·primary) |
| Solid badges, after | 10.0 | 1.1 (success·error) | 9.3 | 3.4 |

Read: the info/primary collision — the one that existed in *normal* vision — is gone in normal,
protan and deutan vision. Under tritanopia (the rarest, ~1 in 10,000) cyan and blue converge;
the info surface therefore always carries its glyph, and the two are still separated by
lightness at the filled rung. Red/green under protanopia is a property of the deficiency, not
of any palette, and is handled by the two-channel rule.

### 2.3 Standards precedence

WCAG 2.2 AA governed; DBIM's six primary groups and its functional palette are transcribed
verbatim in the `dbim-*` modes and **were not touched** (their one below-AA shade, green group
shade 2 at 4.32:1, remains reported, not corrected). UX4G 3.0 parity: the 11-rung ladder,
50–950, is unchanged. GIGW's requirement that colour is never the sole carrier of meaning is
satisfied by the icon + word rule on every status component.

---

## 3. Lens: developer implementation and tokenisation

### 3.1 What exists (and it is good)

- **DTCG JSON** in three tiers → Style Dictionary → `tokens.css` (`--sa-*` plus the legacy
  `--ds-*` contract), `tokens.ts`, Tailwind v3 preset and v4 `@theme`, `figma.tokens.json`
  (Tokens Studio) and `figma.variables.json` (the exporter's payload, nine collections).
- Ramps are **generated from anchors** (`brand-ramps.mjs` → `ramp.mjs`), not hand-picked, with a
  monotone lightness ladder, a single chroma arc and hue held within 2°.
- A prominence grammar (`base · subtler · subtle · bold · bolder · boldest`) shared by
  `bg/`, `text/`, `border/`, `icon/`, plus measured `on/*` pairings.
- 33 test files gate shape, contrast, hue separation, brand parity, Figma name and value parity,
  tier discipline and a visual contract that pins every rendered value.

### 3.2 What was wrong

| Finding | Evidence | Fix |
|---|---|---|
| Two generations of semantic layer coexist | `color.status.successTonal` (badge.css, 14 DS files) beside `bg/status/success/subtler` (toast.css, forms.css) | Legacy aliases re-pointed one rung with the new layer so both agree; deprecation schedule in §11 |
| Components invent tints | `feedback.css` `color-mix(… 7%, white)`; `toast.css` `--sa-color-primaryScale-50` | Both read `bg/status/*/base` now |
| Tier-1 `*Scale` primitives reach component CSS | 15 distinct `--sa-color-*Scale-*` names in 23 DS stylesheets, 131 uses in the hub; stylelint's disallow list names `blue|green|red|…` but not `*Scale` | Governance item (§11); not blocked in this PR |
| Ladder words claim contrast tints cannot pay | 16 published "shortfalls", 14 of them tints named `subtle`/`bold` promised ≥3:1 vs the page | Ledger shrank to 15; rung semantics for fills recorded as a decision (§11) |
| `bolder` lighter than `base` on status inks | generator mapped base → `color.status.*` (700) and bolder → 600 | base 600, bolder 700 |
| Disabled ink an rgba wash | `rgba(30,33,36,.48)` composited per brand by `brand-ramps.mjs` | opaque `{color.neutral.400}` with brand overrides |

### 3.3 The structure, as it now stands

```
Tier 1  ref   color.<ramp>.<step>            brand.json / primitive.json   GENERATED from anchors
Tier 2  sys   color.<family>Scale.<step>     semantic.json                 the eleven rungs, brand-aware
              bg|text|border|icon / brand|status|neutral / <variant> / <rung>
              on / bg / … / <rung>           measured ink for each fill
              color.status.* (legacy)        one-rung aliases kept in step with the above
Tier 3  cmp   cmp/<component>/<intent>/<variant>/<state>/<property>
```

Naming across formats (unchanged, now consistent in value):

| Format | Example | Consumer |
|---|---|---|
| CSS custom property | `--sa-text-status-error-base` | every stylesheet; the only thing app code may reference |
| Legacy CSS alias | `--ds-danger` | older website markup; frozen contract |
| TypeScript | `tokens.color.status.danger` | charts, inline styles |
| Tailwind v4 | `text-status-error-base` via `@theme` | hub |
| Figma variable | `text/status/error/base` in **Color**; `color/dangerScale/600` in **Palette** (Blue/Navy modes) | designers; `codeSyntax.WEB` carries the CSS name |
| DTCG path | `text.status.error.base` | the source |

### 3.4 Implementation guidance

**Developers**
- Paint status with the role token, never the scale: `var(--sa-text-status-error-base)` for
  ink, `var(--sa-bg-status-error-base)` for an alert ground, `bg/…/subtler` for a chip,
  `bg/…/bolder` + `on/bg/…/bolder` for a solid. Amber's solid is `bg/status/warning/bold` +
  `on/bg/status/warning/bold` (dark ink) — the one exception, and it is written in badge.css.
- Never `color-mix()` a status tint; the ramp already holds it and the mix cannot be measured.
- Brand text is `text/brand/primary/base` (rung 600). `#0373DF` is for icons and fills.
- A disabled control is `bg/neutral/disabled` + `text/neutral/disabled`; both are opaque now.

**Designers**
- Bind to the **Color** collection's role variables, not to Palette rungs. Every role's
  description carries its measured contrast in the worst brand.
- Amber: solid chips use `Background/Status/Warning/Bold` with `On/…/Bold`; there is no white
  text on amber anywhere in the system.
- Info is teal; brand is blue. If a callout should read as "the department", it is brand; if it
  reads as "a notice about your application", it is info.

---

## 4. Lens: design-system governance

**What holds:** the generated audit doc (`docs/design-system/colour-system.md`), the generated
colour page data (`color-data.ts`), the gates listed in §3.1, the branch/PR discipline, and the
Figma name and value parity records.

**What did not hold, and why the dullness survived it:**

1. **Every gate asked "is it accessible?" and none asked "is it alive?"** Contrast floors have
   no ceiling; a system can drift darker forever and stay green. There was no chroma floor per
   rung, no lightness target per rung across families, and no benchmark against peer systems.
2. **The gates measured tokens, not components.** The alert's `color-mix()` grounds and its
   1.44:1 yellow glyph were invisible to every token test, and stylelint's Tier-1 pattern did
   not cover the `*Scale` names.
3. **A defect on a ledger is a defect nobody owns.** `error·secondary` had sat on the
   hue-separation ledger since it was created, with the fix written beside it.
4. **Two semantic generations with no sunset date** let badge.css and toast.css disagree about
   what "success" looked like.
5. **Value drift in Figma is recorded, not blocked.** The Palette value checksum has been
   flagged "unexplained" since 2026-08-18 (§12).

The framework that answers each is in §11.

---

## 5. Tensions between the lenses, and how each was resolved

| Tension | Resolution |
|---|---|
| **Vividness vs AAA.** Lifting inks to L\* 49–52 gives up AAA on `base` inks. | AA is the requirement; AAA is kept where it is free (`bolder` inks, every dark fill, all of success). A `base` ink at 5.7–9:1 is not a compromise; 11.7:1 was the defect. |
| **A more saturated green tint vs CVD.** More chroma in success tints could pull them toward the warning tints for a deuteranope. | Measured: success·warning at rung 100 is ΔE 1.9 under deuteranopia after (was 0.4 for the worst pair before); the tints are still never the only carrier. Chroma was raised through the ramp rule, not by hand, so it is bounded by the anchor's own chroma. |
| **Moving info to cyan vs the "info is blue" convention (Carbon, Spectrum).** | Convention lost to the measured outcome: on this estate the primary IS blue, so info-as-blue carried no signal at all (ΔE 0.5). USWDS and GOV.UK separate notice from action. Tritanopia is the residual cost and is covered by the glyph. |
| **Rotating the red vs "the anchor is sacred".** | The anchor rule protects externally mandated colours (gov-blue, saffron, India Green, DBIM). The error red has no external mandate; the warning ramp's hue had already been rotated for the same reason. |
| **Re-anchoring India Green at 600 vs leaving a shipped ramp alone.** | The hex is unchanged; only its rung moved — the rule the navy and saffron anchors already follow ("an anchor belongs at the rung its lightness says"). The visual contract fixture was regenerated deliberately and the diff reviewed. |
| **Uniform ladder semantics vs an amber that is never dark.** | The ladder stays uniform (`bolder` = white ink is AA); amber's solid chip is documented as the one family that takes `bold` + dark ink rather than inventing a special rung. |
| **A fully tokenised disabled state vs WCAG's exemption.** | The exemption says it need not pass; it does not say it should be unreadable. 2.68:1 legible-but-inactive is the floor the estate sets. |
| **Shipping the redesign vs the Figma parity gate.** | The gate's own record format distinguishes `payload` from `figmaObserved` and carries `knownDifference`. Code is recorded as AHEAD of the library, honestly; the push is a human act (§12). |

---

## 6. The redesign — every change to a source

| Where | What | Before | After |
|---|---|---|---|
| `build/ramp.mjs` | tint chroma exponent (`TINT_EXPONENT`) | 0.85 | 0.5 |
| `build/brand-ramps.mjs` | accentRamp (= successScale) anchor rung | 500 | 600 |
| | dangerRamp anchor | `#ec5042` (hue 28.7) | `#ec4e4f` (hue 24.0) at rung 400 |
| | infoRamp anchor | `#1a73e8` (hue 258) | `#0b86a2` (hue 220) at rung 500 |
| | `text.disabled` written as rgba per brand | yes | removed; authored as a reference |
| `build/generate-system-tokens.mjs` | `text|icon|border/status/*/base` | `color.status.*` (rung 700) | rung 600 |
| | `text|icon|border/status/*/bolder` | rung 600 | rung 700 |
| | `text/brand/primary/base` | `primaryScale/500` | `/600` |
| | `text/brand/primary/bolder` | `/600` | `/700` |
| | `bg/neutral/disabled` | `neutralScale/200` | `/100` |
| `src/semantic.json` | `color.status.success / warning / danger` | 700 | 600 |
| | `color.status.successStrong / dangerStrong` | 800 | 700 |
| | `color.status.infoTonal` | `info/100` | `info/50` |
| | `color.text.disabled` | `rgba(30,33,36,.48)` | `{color.neutral.400}` + brand overrides |
| | `color.border.controlHover` | `neutral/500` | `neutral/600` |
| | `border.neutral.bolder.default` | `neutral/400` | `neutral/500` |
| `components/feedback/feedback.css` | alert grounds | `color-mix()` ×4 | `bg/status/*/base` |
| | alert warning glyph | `--sa-color-brand-yellow` | the warning ink |
| | alert info ink | `text/brand/primary/base` | `text/status/info/base` |
| `components/feedback/toast.css` | info ground and icon | `primaryScale/50`, brand ink | `bg/status/info/base`, info ink |
| `components/feedback/badge.css` | solid warning | ink `#704b00` as fill | `bg/status/warning/bold` + its dark on-ink |
| `test/prominence-contract.test.mjs` | shortfall ledger | 16 entries | 15 (border/neutral/bolder/default fixed; five measurements moved ≤0.05) |
| `test/figma-export.test.mjs` | pinned `status.danger` | `#8b1f18` | `#aa2d30` |
| `test/hue-separation.test.mjs` | `info|primary` union note | "worth revisiting" | records that the union now survives only in DBIM modes |
| `test/*.fixture.json` | visual contract, UX4G contract | — | regenerated deliberately (`write-visual-contract.mjs`) |
| `reference/figma-live.json` | `$valueChecksums` | payload = library | payload recorded; library **unchanged**, `knownDifference` explains |

Generated outputs (`brand.json`, `primitive.json`, `system.generated.json`, `dist/*`,
`packages/design-system/tokens.{css,ts}`, `docs/design-system/colour-system.md`,
`foundations/color/color-data.ts`) were rebuilt, not edited.

**What did not change:** the primary ramp (gov-blue, navy) to the hex; the secondary ramp
(India Saffron); the neutral ramps; the anchor hexes of India Green and the warning amber; the
categorical chart palette; the DBIM conformance ramps; the UX4G modes; any token NAME.

---

## 7. Why this solves the dullness

A ramp's rung is now the same lightness in every family (600 ≈ L\* 49–52 in primary, danger,
warning, info; accent/success 39 → it stays 39 at 600 but the *roles* that read it moved), the
roles read the rung their job needs rather than two rungs beyond it, and the tints hold the
chroma the anchor has to give. The result on screen (specimen, §9): status text with visible
hue, grounds that read as tints rather than grey, four statuses that are four hues, and a brand
blue that sits inside a family instead of next to mud.

---

## 8. Naming and standards conventions honoured

- Rung ladder **50–950**, eleven steps, per UX4G 3.0.
- Role grammar `<role>/<intent>/<variant>/<prominence>` with `on/` pairings, per Material 3 and
  the estate's own grammar gate.
- OKLCH as the working space (CSS Color 4); hex as the published value.
- WCAG 2.2 SC 1.4.3 / 1.4.6 / 1.4.11 as the contrast classes named in descriptions.
- Machado et al. 2009 matrices for CVD, the same set Chrome DevTools and Figma use.
- DBIM shade numbering (1 = key colour) untouched in the conformance modes.

---

## 9. In context — the specimen

`apps/hub/public/__spec/spec.html` (not committed; regenerate from `tools`/the PR) renders the
real component CSS against the old and the new `tokens.css`. Captures are attached to the PR
and the review page:

- **Citizen form:** three field states with messages, five buttons, a disabled field, four
  alerts.
- **Administrative dashboard:** four metric cards, tonal and solid badges, chips, four toasts.
- **Analytics portal:** the 12-series categorical palette, sequential and diverging scales, a
  table with status badges and status text.

---

## 10. Verification performed

- `npm test -w @mosje/tokens` — **164 pass, 0 fail** (ramp shape, on-pair AA in 8 modes, hue
  separation, prominence ledger, brand parity, tier discipline, chart palette, Figma export,
  Figma value parity with the recorded difference, visual and UX4G contracts).
- `npm run lint:css`, `check:docs-data`, `check:dangling-vars`, `check:design-context`,
  `check:components-css`, `check:changelog` (within grace), hub `typecheck` — all pass.
- Visual: before/after full-page captures at 1440 px of the specimen; the hub colour foundation
  page, alert and badge pages rendered from the worktree server.

---

## 11. Governance and audit framework (for the design-system manager)

1. **Add a vibrancy gate beside the contrast gate.** In `test/`, assert per family:
   rung 600 within L\* 47–53 (amber and saffron excepted by name, with the reason); tints at
   50/100/200 hold ≥ 25 % of C<sub>max</sub> at their lightness; `base` status inks between
   5:1 and 9.5:1 on white — a ceiling as well as a floor.
2. **Extend stylelint to the whole Tier-1 surface.** `.stylelintrc.tokens.json` disallows
   `--sa-color-(blue|green|red|…)-` but not `--sa-color-*Scale-`; 23 DS stylesheets and 131 hub
   sites reach the scales today. Ratchet it: baseline the count, fail on growth, burn it down.
3. **Ban `color-mix()` on status tokens in component CSS** (a stylelint `declaration-property-
   value-disallowed-list` on `color-mix\(.*status`), so a ground is always a rung.
4. **Retire the legacy `color.status.*` layer on a date.** It is now value-identical to the
   role layer; publish the mapping (`status.success` → `text/status/success/base`, `successTonal`
   → `bg/status/success/subtler`, …) in the changelog, migrate the 14 DS files, then delete.
5. **Ledgers carry owners and dates.** Every entry on `SHORTFALL_LEDGER` and the hue-separation
   `KNOWN_DEFECTS` gets an owner and a review date; an entry past its date fails the gate.
6. **Fill-rung semantics, decided.** Record in `grammar.mjs` that `subtle`/`bold` on a `bg`
   role guarantee ≥ 3:1 **against their own `on/*` ink**, not against the page; the 14
   tint "shortfalls" then leave the ledger as non-findings, and the ledger describes only real
   defects.
7. **Component-level contrast in CI.** A Playwright pass over the Storybook stories of Alert,
   Badge, Toast, Chip, Button and FormField computing each text/icon node's rendered contrast —
   the four failures this audit found (§2.1) were all in components, not tokens.
8. **Figma push is part of "done".** A token PR that changes a colour value is not merged until
   `figmaObserved` matches `payload` again; `knownDifference` is the holding state, with an
   expiry. The Palette "unexplained value edit" from 2026-08-18 gets a value-level diff now.
9. **Peer benchmark on every colour change.** Keep the benchmark table (§1.2) in the generated
   audit doc so a reviewer sees where the estate's inks sit against USWDS, GOV.UK, Carbon,
   Primer and Atlassian.
10. **Three contexts, three specimens.** Keep the citizen / admin / analytics specimen as a
    committed Storybook story so before/after is one screenshot, not a rebuild.

---

## 12. Code ↔ Figma gap — highlighted

**As of this branch, code is ahead of the SAMAVESH Figma library on every colour changed
above.** Nothing was pushed: pushing rewrites a published library that other files consume, and
that is a human decision. What the record and the diff show:

| Area | State |
|---|---|
| **Palette collection (Tier-1 rungs, Blue/Navy modes)** | 44 rung values changed in code (accent/success ×11, danger ×11, info ×11, tints of warning/primary/secondary ×11) — **library holds the old values**. Payload checksum `166809b5:282` → `e5eb9e7a:278`; `figmaObserved` unchanged. |
| **Color collection (roles)** | 26 role bindings changed (status base/bolder ×24 across text/icon/border, brand text ×2, disabled ×2, control border ×2, infoTonal) — **library holds the old bindings**. Checksum `1317770d:495` → `4ac20269:495`. |
| **Contrast NOTES (the sentence each variable publishes)** | 47 figures now differ between code and library (every status text/icon/border rung, the brand text, the control border, and the tints whose ratio moved ≤0.05). Held in `$contrastNotes.knownDifference` with a dated reason; `figmaObserved` left as last read. The gate that owns this landed in main from PR #287 during this work. |
| Pre-existing: Palette VALUE drift | Flagged 2026-08-18 as an unexplained edit in the library with the count unchanged; never diffed at value level. Still open. |
| Pre-existing: 23 library-only Tier-1 variables | `ref/color/ink/*` (9), `ref/color/stroke/*` (7), `ref/color/*/source` (5), `ref/color/badge/beta`, `border/neutral/inverse` — a parallel ink and stroke palette in Figma that code has never defined. Orphans; retire by rename to `deprecated/*` with evidence of zero consumers. |
| Pre-existing: 9 code-only Color variables | `border/neutral/inverse/{default,subtle}`, `cmp/accessibilityBar/{hoverBg,pillBg}`, `icon/brand/primary/bolder`, `overlay/brand/{active,hover}`, `text/brand/primary/bolder`, `text/neutral/subtler` — reach Figma on the next push. |
| Pre-existing: 1 library-only Color variable | `border/brand/primary/hover` — code has no matching rung. |
| DBIM modes | Code-only by standing instruction (2026-08-11); the Palette collection stays [Blue, Navy]. |
| Live read | Blocked in this session: the Figma MCP variable tools require a selection in the desktop app. The gap above is measured against `reference/figma-live.json` (names read 2026-08-12, checksums re-verified 2026-09-01/04), not a fresh read. |

**To close it (a human, with the file open):** run the exporter (`npm run build -w @mosje/tokens`
already writes `dist/figma.variables.json`), push the Palette and Color collections, read the
library back, re-record `$valueChecksums.figmaObserved`, delete the two `knownDifference`
holding notes dated 2026-09-04, and republish the library so the new descriptions (each with
its measured contrast) reach Dev Mode.

---

## 13. Not done here, deliberately

- **Categorical chart palette** — untouched. It was re-cut on 2026-08-28 with a CVD guarantee
  for nine slots and ratcheted tests; three members (cat/2 brown, cat/9 mauve, cat/10 olive) sit
  at 41–54 L\* with 40–55 % chroma share and would benefit from the same lift within the
  3:1-on-white constraint. Its own change, with its own ratchets.
- **Neutral ramp** — unchanged; the greys are correct as designed.
- **Renaming the prominence words** (`subtler` < `subtle` reads backwards) — a 495-variable
  rename with a Figma migration; recorded in §11.6 as a semantics decision instead.
- **Dark theme** — none exists on the estate (owned by the UX4G widget); the staged dark values
  in the source were preserved, not designed.
- **The Figma push** — §12.
