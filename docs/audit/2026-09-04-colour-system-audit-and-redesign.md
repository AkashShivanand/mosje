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
pair is AA in all eight modes, no ramp broke the shape rule, and the shortfall ledger went 16 → 0 with nothing added. **The library holds the new colours** (§12).

---

## 1. Lens: colour theory and visual design

### 1.1 What was measured

Chroma is reported as **C / C<sub>max</sub>** — the token's OKLCH chroma as a share of the
maximum sRGB can display at that exact lightness and hue. It is the objective "dullness"
figure: 100 % is as vivid as the gamut permits; 17 % is grey with a hint of hue.

| Family, rung | Before | L\* | C/C<sub>max</sub> | After | L\* | C/C<sub>max</sub> |
|---|---|---|---|---|---|---|
| success / 50 (alert ground) | `#ecf4ee` | 95.9 | **17.9 %** | `#e5faea` | 96.5 | 55.2 % |
| success / 100 (badge, toast) | `#bed8c5` | 85.8 | **17.5 %** | `#bde3c7` | 88.1 | 25.5 % |
| success / 200 | `#91b99c` | 74.8 | 31.2 % | `#99caa7` | 79.5 | 35.2 % |
| success / 400 | `#3b8155` | 54.6 | 71.9 % | `#55986b` | 62.3 | 60.9 % |
| success ink (`text/status/success/base`) | `#004220` | **33.2** | 99.9 % | `#046a38` (India Green itself) | 46.1 | 98.6 % |
| success fill (`bg/status/success/bolder`) | `#00542b` | 39.1 | — | `#046a38` | 46.1 | — |
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
thing in the green family than in every other, and every success surface inherited that. After:
accent/success 600 is L\* 46.1 — India Green itself — and 500 is a live mid-green (`#338051`, 4.83:1).

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
| Data-heavy portals | Diverging scale was red against green and vanished under deuteranopia; three series were a status colour to the eye | Diverging references follow the rotated red automatically; categorical palette, sequential ladder and diverging scale re-cut in the second pass (§14) |

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
| `text/status/*/base` on white | 6.72 | 6.72 | 5.68 | 5.96 |
| … on the muted page | 5.89 | 5.88 | 4.97 | 5.22 |
| … on its own `base` tint | 6.04 | 5.58 | 5.11 | 5.42 |
| … on its own `subtler` tint | 4.45\* | 4.35\* | 4.05\* | 4.31\* |
| `text/status/*/bolder` on white | 9.25 (AAA) | 9.10 (AAA) | 7.79 (AAA) | 8.40 (AAA) |
| white on `bg/status/*/bolder` | 6.72 | 6.72 | 5.68 | 5.96 |
| dark ink on `bg/status/*/bold` (amber's solid chip) | — | — | 6.89 | — |

\* On the `subtler` tint use the `bolder` ink (`on/bg/status/*/subtler` already names the
neutral ink at 10–12:1), or the status family's `bolder` ink (5.6–7.7:1); the `base` ink is
measured for the page and the `base` tint. The design-system docs sidebar badges do this.

AAA is reached wherever it costs nothing: every `bolder` ink and every `boldest` fill. It is deliberately **not** reached by the `base` inks any more — that
overshoot is the dullness.

### 2.2 Colour-vision deficiency (Machado 2009, severity 1.0)

Minimum OKLab ΔE over every pair in the set, worst pair named. The package's chart gate treats
ΔE ≥ 8 as "distinguishable at once"; status colours never reach that under protanopia because
red and green collapse onto one axis — which is why no status on this estate is ever colour
alone (icon + word, always).

| Set | Normal | Protanopia | Deuteranopia | Tritanopia |
|---|---|---|---|---|
| Status inks + brand, before | 7.1 (info·primary) | 1.0 (success·error) | 2.1 (error·warning) | 7.4 (info·primary) |
| Status inks + brand, **after** | **10.2** | **3.8** (success·warning) | **3.4** | 2.2 (info·primary) |
| Tonal grounds (rung 50), before | 0.1 (info·primary) | 0.1 | 0.3 | 0.1 |
| Tonal grounds (rung 50), **after** | 1.5 | 0.7 | 0.1 (info·primary) | 0.8 |
| Filled rungs (600), before | 1.7 (info·primary) | 0.6 (success·error) | 1.6 (info·primary) | 0.8 (info·primary) |
| Filled rungs (600), **after** | **8.6** | 0.7 (warning·secondary) | **3.4** | 2.2 (info·primary) |
| Solid badges, after | 11.8 | **7.9** (success·error) | 5.7 | 4.5 |

Read: the info/primary collision — the one that existed in *normal* vision — is gone in normal,
protan and deutan vision, and the solid badges now clear the chart gate's ΔE 8 under protanopia
because India Green (L\* 46) and the red (L\* 49) differ in lightness as well as hue. Under tritanopia (the rarest, ~1 in 10,000) cyan and blue converge;
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
| Ladder words claim contrast tints cannot pay | 16 published "shortfalls", 14 of them tints named `subtle`/`bold` promised ≥3:1 vs the page | The claim was the defect: `subtle`/`bold` fills now carry no page-contrast class (their measured `on/*` ink is the guarantee). Ledger 16 → **0** |
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
| `build/brand-ramps.mjs` | accentRamp (= successScale) anchor rung | 500 | 600 (rung 600 = `#046a38` itself; 500 = `#338051`) |
| | overlay/alpha tiers for accent and success | derived from rung 500 | derived from rung 600, the identity colour |
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
| `build/grammar.mjs` | fill ladder `subtle`/`bold` contract | ≥3:1 vs the page | no class — tonal fill, readable through its `on/*` ink |
| `test/prominence-contract.test.mjs` | shortfall ledger | 16 entries | **0** (one fixed on its merits, fifteen were the ladder claim above) |
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

A ramp's rung is now the same lightness in every family (600 = L\* 46–52 in every family, with
India Green itself at success/600), the
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

- **Every colour mode was resolved and measured**, not only the default: blue, navy, the six
  `dbim-*` previews and the two UX4G modes. In each, the four status inks clear 4.5:1 on white
  and on the muted ground (success 6.25–6.72, error 6.24–6.72, warning 5.32–5.68, info
  5.96–6.28), the control border clears 3:1 on the muted ground (4.07–4.45), the amber solid chip
  clears 4.5:1 with its dark ink (6.89–7.69), and the disabled label sits at 2.26–2.81 on its
  fill. The one sub-AA figure is `dbim-green`'s brand text — DBIM's own shade 2 `#2d8686` at
  3.96:1 on the muted ground — reported, not corrected, like its 4.32:1 on white.

- `npm test -w @mosje/tokens` — **167 pass, 0 fail** (after merging main, which added the contrast-note parity gate) (ramp shape, on-pair AA in 8 modes, hue
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
6. **Fill-rung semantics — DONE in this change.** `grammar.mjs` now says `subtle`/`bold` on a
   `bg` role are tonal fills readable through their `on/*` ink, with no page-contrast class;
   the ledger is empty and may only ever describe real defects. Keep it that way: a new entry
   is a colour to fix, never a sentence to excuse.
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

## 12. Code ↔ Figma — pushed and read back

**The SAMAVESH library holds the new colours.** Palette (57 rung values) and Color (73 values,
80 measured-contrast descriptions) were written through the Plugin API as diff-and-apply
scripts — each variable compared against the library and set only where its value or
description differed — and the library was then read back into the parity records:

| Record | State after the push |
|---|---|
| `$valueChecksums.figmaObserved` | Palette `8fc80366:328`, Color `55f27257:496`, read from the library |
| `$contrastNotes.figmaObserved` | the 94 contrast sentences the library now publishes |
| Holding notes dated 2026-09-04 | closed — 60 contrast notes and the two code-ahead value notes |
| The unexplained Palette edit of 2026-08-18 | closed by the overwrite: any library-only value was replaced by the code value and read back |
| `figma-value-parity` and `figma-contrast-parity` gates | green, against the live library |

What remains, and is pre-existing rather than part of this change: 24 library-only Tier-1
variables (`ref/color/ink/*`, `ref/color/stroke/*`, `ref/color/*/source`, the BETA badge, and a
Palette-collection `border/neutral/inverse`) that code has never defined — orphans to retire by
rename with evidence of zero consumers; and one library-only Color variable,
`border/brand/primary/hover`, which needs the code to grow the matching rung. The DBIM modes
stay code-only by standing instruction.

**Documentation on both surfaces.** The `Colour — Documentation` frame gained sections 18–20
(in use, colour vision, modes), built to the house pattern with every fill and text bound, and
its sentences about info, the focus ring, the rung ledger and the chart floor were corrected.
The web page mirrors the 22-section list, gated by `scripts/check-color-docs.mjs`.

## 13. Not done here, deliberately

- **Categorical chart palette** — validated and re-cut in the second pass; see §14.
- **Neutral ramp** — unchanged; the greys are correct as designed.
- **Renaming the prominence words** (`subtler` < `subtle` reads backwards) — a 495-variable
  rename with a Figma migration; recorded in §11.6 as a semantics decision instead.
- **Dark theme** — none exists on the estate (owned by the UX4G widget); the staged dark values
  in the source were preserved, not designed.

---

## 14. Data visualisation — the second validation pass

The first pass measured the chart tokens lightly and left them out of scope. Asked whether they had
been validated as a data-visualisation expert, a dashboard expert and a visual design lead would,
the honest answer was no. This section is that pass. The dataviz method used is the estate's own
gate (`test/chart-palette.test.mjs`) plus the six-check validator from the `dataviz` skill; every
figure is measured.

### 14.1 What each lens found

**Data-visualisation lens**

| Set | Finding | Measured |
|---|---|---|
| Diverging (`chart/div/*`) | **Red against green** — the classic colour-vision trap. Under deuteranopia (about 1 man in 12) the two wings were one colour, so a diverging map showed no direction to those readers. | ΔE 4.1 strong ends · 7.9 mid · 1.7 soft ends |
| Diverging | The 2026-09-04 ramp change had also broken its lightness symmetry (the wings were engineered to L\* 64.4 both sides). | pos 70.8 vs neg 64.4 |
| Sequential (`chart/seq/*`) | Uneven ladder: the 400→500 step was half its neighbours because 500 is pinned to gov-blue and the rest were placed by eye. Two adjacent choropleth classes were closer than any other two. The validator's ordinal floor is 6 L\* per step. | steps 6.9 / 9.4 / 9.7 / 8.3 / **5.0** / 7.3 / 7.5 / 7.9 / 7.8 |
| Categorical (`chart/cat/*`) | Four slots below the OKLCH chroma floor (read as grey); four slots below the lightness band; slots 8 and 9 only ΔE 12.6 apart in ordinary vision (floor 15); the all-pairs colour-blind ratchet held at exactly 8.04, its own threshold. | validator: 3 of 5 checks FAIL |
| Trend (`chart/trend/*`) | Up/down at rung 500 while every status ink had moved to 600, so an arrow and the success text beside it were two greens. | ΔE 6.4 under deuteranopia |

**Dashboard lens**

| Finding | Measured |
|---|---|
| Three series were a status colour to the eye: the brown `cat/2` sat ΔE 4 from the warning ink, the crimson `cat/4` ΔE 7 from the error ink, the teal `cat/3` ΔE 6 from the info ink and 7 from success. On an administrative dashboard where a status pill sits beside a chart, "series 2" read as "warning". | dataviz reference floor: ΔE ≥ 8 with icon + label |
| Metric-card pills and trend arrows carry sign and glyph as well as colour — correct, and the reason a red/green trend pair is acceptable where a red/green diverging *scale* is not (a scale has no glyph). | — |
| Grid, axis and tooltip neutrals are recessive and correct (grid 1.35:1, axis 4.65:1 on white). | — |

**Visual design lead lens**

| Finding |
|---|
| The twelve mixed muted and saturated members (chroma 0.08–0.19) at three different lightnesses, so a bar chart looked like two palettes interleaved. |
| Three members were mud: `cat/2` brown-orange, `cat/9` plum, `cat/10` olive. |
| The diverging scale's soft steps were nearly the neutral midpoint on the green side. |

### 14.2 The tension, and the decision

The estate guarantees **nine** categorical slots mutually distinguishable through protanopia,
deuteranopia and tritanopia (all 36 pairs ΔE ≥ 8, a ratchet consumers depend on via
`tools/chart-slot-order`). Data-visualisation practice wants every slot inside the OKLCH
lightness band 43–77 with chroma ≥ 0.10. **These are mutually exclusive in sRGB, and it was
measured rather than assumed:** a dichromat keeps one chromatic axis plus lightness, so nine
mutually distinct colours need lightness coding. Simulated annealing over all twelve slots at
once, under the full constraint set, found no nine-slot set inside the band reaching ΔE 8 on every
pair (best 7.5 over several thousand candidates); at a floor of L\* 42 it found several.

Decision: **keep the nine-slot guarantee** (a contract change is the design-system manager's
call, not this audit's) and accept **two** slots one L\* point below the band, where the previous
palette had four. Everything else improves. The dataviz reference's own palette keeps series in
the same hue family as its status colours and relies on the icon-plus-label rule, so that rule is
adopted at ΔE ≥ 8 rather than a hue ban — which is what re-admitted a red and a green series and
restored hue diversity.

### 14.3 What changed

| Token | Before | After | Why |
|---|---|---|---|
| `chart/cat/1–12` | `#0373df, #a25a00, #007668, #930121, #b671a6, #323ca8, #719348, #7261a8, #5a406e, #594d00, #c02865, #4c90ac` | `#0373df, #e7173a, #644588, #1a801c, #c930b4, #7a3901, #a35b7a, #481dc2, #a1015b, #06569b, #7568bf, #b15b4a` | Annealed against six constraints at once (§14.4); slot 1 unchanged |
| `chart/seq/50–900` | hand-placed, 5.0 L\* step at 400→500 | even 7.6–7.8 L\* ladder, 500 still `#0373df` | Ordinal classes must be evenly spaced; class scales start at 100 |
| `chart/div/pos*` | success green (`green/100, 300, 700`) | sequential blue (`seq/100, 400, 800`) | Red–blue survives deuteranopia (ΔE 9.3 / 26.9 / 17.9); red–green did not (1.7 / 7.9 / 4.1). Lightness symmetric again: 87.9/86.6, 64.3/64.4, 33.6/34.5 |
| `chart/trend/up, down` | rung 500 | rung 600 | The rung every status ink and icon now reads; one green, not two |
| Ratchets (`chart-palette.test.mjs`) | CVD worst 8.0 · band deficit 4 · chroma deficit 4 · ordinary worst 11.7 · full-ramp CVD 1.5 | **8.2 · 2 · 0 · 13.4 · 3.8** | Tightened so none can be given back |

### 14.4 Verification

| Check | Result |
|---|---|
| All 36 pairs among slots 1–9, worst of three dichromacies | ΔE **8.22** (ratchet was 8.04) |
| All pairs among slots 1–9, ordinary vision | ΔE ≥ **13.4** (was 11.7; floor 15 not reached — see §14.2) |
| Adjacent slots 1–12, ordinary vision / CVD | ≥ 17.4 / ≥ 10.4 |
| First six slots, all pairs, dataviz validator | CVD ≥ 8.5, ordinary ≥ 17.7, chroma and contrast PASS; band: one slot at 0.423 |
| Chroma ≥ 0.10 | 12 of 12 (was 8 of 12) |
| ≥ 3:1 on white and on the muted page | 12 of 12, worst 3.47 |
| Distance from every status ink | ΔE ≥ 8 for 12 of 12 (was ΔE 4 / 6 / 7 on three slots) |
| Hue spread among the first six | ≥ 30° (blue, red, purple, green, magenta, brown) |
| Sequential steps | 7.6–7.8 L\*, monotonic |
| `tools/chart-slot-order/check.mjs` | 18 consumers, none past slot 9 |
| `npm test -w @mosje/tokens` | 167 pass |

What remains outside the validator's band is stated in the token description itself, with the
measurement that justifies it, so the next person does not re-run the search to rediscover it.

---

## 15. Colour that lives outside the token gates — the third validation pass

Asked whether *every* colour in the project had been revalidated, the answer was no: the token
system had, and three surfaces outside it had not. This pass inventoried them.

| Surface | Raw hex declarations (comments stripped) | Finding | Action |
|---|---|---|---|
| `--sa-focus-ring` token | — | `rgba(3,115,223,.48)`, composites to `#86bcf0`, **2.01:1** on white. The 2026-09-03 focus fix corrected `forms.css` only; **53 `outline:` rules** in 12 other stylesheets (chips, search, controls, filter-select, media inputs, the auth stack) still read the wash — a 1.4.11 failure on every one. | Token now aliases the brand key colour: solid `#0373df` (4.64:1 white, 4.07:1 muted), `#003366` in Navy, the DBIM key colour in its modes. Fixed at the token, so all 53 sites move at once |
| Design-system component CSS | 2 | Both are `mask` gradients using `#000000` as an alpha stop, not colours | None |
| Portal stylesheets (8 files) | 126 | Per-portal palettes, re-bound under `[data-portal]` by design. Eight near-duplicates of brand or status colours: `--portal-saffron: #ec6a1f` (ΔE 3.4 from India Saffron) in nhapoa, nmba, scw and tg; PM-AJAY's `--pm-brand-orange: #f97316` (the retired saffron, ΔE 2.6), `--pm-danger-strong: #c0392b` and `--pm-danger-stronger: #b91c1c` (ΔE 5.4 / 3.3 from the error ink); SCW's hero green `#2f6b46` (ΔE 3.3 from success, a gradient ground) | The seven brand/status duplicates re-bound to the tokens (`--sa-color-brand-saffron`, `text/status/error/base`, `/bolder`); the hero gradient left, it is not a status |
| Website (`website.css`, 5 files) | 33 | Site tokens alias the DS tokens; the literals are the NMBA campaign reds (a campaign palette, deliberate), social-network brand marks, and two `oklch()` approximations in comments | None; the NMBA reds are recorded as campaign colours, not estate tokens |
| Design-system docs pages | 475, in 12 files | 60 are hexes quoted in changelog prose; the rest are specimen swatches on component pages that display a colour by name | None |
| Code specimen palette (`code/*`) | 6 literals | Re-measured against `code/bg`: text 12.95, string 11.37, builtin 9.58, keyword 6.04, comment 5.09 — unchanged and AA | None |
| Overlay / scrim | 2 | `overlay/neutral/boldest` 50 % ink, `overlay/brand/hover` 8 % white — washes, no text obligation | None |
| Organisation marks, illustrations, SVG logos | — | Artwork, not tokens; outside a colour audit's remit (the marks have their own resolution rule) | None |

**What "all the colours" now means.** Every token in every tier and every mode has been
measured; every raw literal in component, portal and website CSS has been inventoried and
either re-bound, justified or recorded. What is *not* claimed: that a portal's own palette is
the best palette for that portal — those are per-portal design decisions with their own
visual review, and this pass only removed the places where a portal had quietly re-drawn a
brand or status colour a few ΔE off the estate's.


## 16. Translucency as a reference plus an opacity reference — the fourth pass

Figma variables can now alias a colour "while maintaining a separate opacity", and that
opacity can be driven by a number variable. That removes the one structural reason this
system carried rgba() literals: a literal cannot follow a brand, so every translucent value
was frozen at whatever brand was current when it was typed.

### What changed

| Family | Before | After |
|---|---|---|
| `color/transparent/<family>/<8–48>` (48: eight families by six tiers) | rgba() literal, Navy copies hand-authored for primary and neutral only | `{color.<scale>.<rung>}` + `{alpha.N}`; Navy and every DBIM mode follow by reference |
| `overlay/neutral/boldest` | rgba(30,33,36,.5) with six hand-authored DBIM copies | `{color.neutralScale.800}` at `alpha/48` |
| `overlay/brand/hover`, `overlay/brand/active`, `border/neutral/inverse/subtle` | white rgba() | `{color.neutralScale.0}` at `alpha/8`, `/16`, `/40` |
| `code/*` chrome (6) | white rgba() at 3/10/45/70/8/30 % | white at `alpha/4`, `/8`, `/48`, `/72`, `/8`, `/32` |
| `cmp/action/*/inverse/*` and transparent resting fills (84) | rgba(255,255,255,.92/.84/.40/.64/.10/.16/.24) and rgba(0,0,0,0) | white at `alpha/88`, `/80`, `/40`, `/64`, `/8`, `/16`, `/24`, `/0` |

Zero rgba() colour literals remain in `tokens.css` outside the shadow ramp.

**CSS.** A translucent token is one expression over two custom properties:
`color-mix(in srgb, var(--sa-color-accentScale-600) calc(var(--sa-alpha-8) * 100%), transparent)`.
The brand blocks re-assert the declaration whenever either dependency is redeclared, so a
nested `[data-brand]` island repaints the base and the wash follows. Baseline since 2023;
Tailwind v4 already relies on the same function.

**Values that moved as a consequence.** Navy's scrim was the Blue neutral (#1E2124 where
Navy's neutral 800 is #1E2024). Every wash under a DBIM mode was a Blue-brand literal — the
danger wash was #CB3D3F where DBIM's Coral Red is #DC3545, the neutral wash #1E2124 where
DBIM's neutral 800 is #2C2C2C, the primary wash the Blue key colour under all six DBIM
primaries. All now follow their scale. Navy's primary wash reads navy 500 (#224C7D) rather
than the hand-picked navy 600 (#003366); at the 8–48 % the tiers are used at the two differ by
under 1 ΔE.

### The opacity scale, rationalised

UX4G's fourteen steps plus ten estate one-offs made twenty-four rows for a system that used
sixteen. Usage audit: 5, 20, 25, 60, 75, 90 had zero consumers in any tier or stylesheet;
3, 10, 30, 45, 50, 70, 84, 92 each served one or two tokens. The scale is now ONE ladder of
thirteen, derived from use and the two roles the system will foreseeably need:

| Step | Role |
|---|---|
| 0 | transparent resting fill |
| 4 | hairline / faint lift on a dark surface |
| 8 · 16 · 24 · 32 · 40 · 48 | the six wash and overlay tiers; 48 is also the scrim |
| 64 · 72 | disabled and secondary ink on a dark surface |
| 80 · 88 | pressed and hover fill of an inverse button |
| 100 | opaque sentinel |

Snaps: 3→4, 10→8, 30→32, 45→48 (titlebar label 4.52→4.97:1), 50→48, 70→72 (9.32→9.6:1),
84→80, 92→88. Nothing fell below its floor. The UX4G parity stylesheet carries UX4G's own
opacity values as literals, so nothing UX4G publishes is lost; this is a recorded divergence
from adopting the list verbatim, on the ground that a scale is what the system uses.

### Figma — what the API could and could not do

- **Percent, not fraction.** A number variable bound to an opacity is read as a percentage:
  a probe variable worth 50 gave `node.opacity` 0.5, one worth 0.5 gave 0.005. The library's
  `ref/opacity/*` had held 0–1 values since they were created — a factor of 100 wrong for the
  one purpose they exist for. They are now percentages, and the exporter projects ×100.
- **Pushed.** Static: 13 `ref/opacity/*` and 13 `alpha/*` (aliases), scope OPACITY, with
  descriptions; 28 retired steps removed (all created today or with zero consumers in code).
  Palette and Color: every translucent variable holds the brand-correct composited fallback,
  and its description ends with `FIGMA BINDING: <base> @ alpha/N`.
- **Not possible through this API (apiVersion 1.0.0).** `setValueForMode` rejects every
  shape of opacity on a VariableAlias, and the scope enum has no "Color variable opacity"
  entry. Both are UI steps for a designer: tick the scope on the 13 alpha variables (one
  multi-select), then on each translucent variable alias the base and set the alias's opacity
  to the alpha variable named in its description. `figma-value-parity` records the payload's
  alias-with-opacity intent against the library's literal as a known difference until then.

### Scopes, and what sits where — the library tidied to the agreed rule

The rule agreed for the library: a designer is offered the Tier-2 alias and only the alias.
Audit before the push: 109 `ref/*` primitives carried scopes (every `ref/space/*` offered as a
gap and a size, every `ref/radius/*` as a radius, 23 orphaned `ref/color/*` as fills), twelve
motion tokens and `grid/columns` carried ALL_SCOPES and so appeared in every number picker,
and two numbers — `cmp/button/radius`, `cmp/card/radius` — sat in the Color collection.

What the exporter now states, and the push wrote (123 variables changed, 41 library-only
primitives cleared, 887 already correct):

| Head | Scope |
|---|---|
| every `ref/*`, every `deprecated/*` | none — visible in the panel, offered in no picker |
| `bg/*`, `layer/*`, `overlay/*`, component fills | FRAME_FILL, SHAPE_FILL |
| `text/*`, component text | TEXT_FILL |
| `icon/*`, `on/*` | SHAPE_FILL, TEXT_FILL |
| `border/*`, component borders | STROKE_COLOR (+ SHAPE_FILL for a divider drawn as a rectangle) |
| `focus/ring` | STROKE_COLOR, EFFECT_COLOR |
| `color/*Scale/*`, `color/transparent/*` | ALL_FILLS, STROKE_COLOR, EFFECT_COLOR |
| `chart/*` | FRAME_FILL, SHAPE_FILL, STROKE_COLOR |
| `inline`, `stack`, `padding`, `section` | GAP |
| `size`, `icon/size`, `container`, `layout`, `target` | WIDTH_HEIGHT |
| `shape/*`, `control/radius`, `cmp/*/radius` | CORNER_RADIUS |
| `stroke/*`, `control/border/width`, `focus/width`, `focus/offset` | STROKE_FLOAT |
| `type/*/size` · `lh` · `tracking` · `para` | FONT_SIZE · LINE_HEIGHT · LETTER_SPACING · PARAGRAPH_SPACING |
| `font/*` families · `font/weight/*` | FONT_FAMILY · FONT_STYLE |
| `alpha/*` | OPACITY + COLOR_OPACITY — set in the UI; the API reads it but cannot write it |
| `motion/*`, `ref/z/*`, `ref/breakpoint/*`, `grid/columns` | none — nothing in Figma binds these |

The two radii were moved to the Radius collection by creating them there, sweeping all 82
pages (59,027 nodes) for consumers, rebinding the 72 bindings found — the organisation-mark
components and their instances — verifying zero remained, and deleting the originals. Figma
cannot move a variable between collections; a sweep and a rebind is the same thing done
honestly. The exporter now routes any component radius to Radius, so the placement cannot
recur. No number remains in either colour collection.

The scope is part of the payload (`scopes` on every variable, from `scopesFor` in the
exporter), so the next push re-asserts it; the one exception is `alpha/*`, which the push
leaves as the UI set it because the API rejects COLOR_OPACITY on write.

The 136 alias-plus-opacity bindings that remain a UI step are listed, with base and alpha
per variable, in `docs/design-system/figma-alpha-bindings.md`.
