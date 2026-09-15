# Colour — the page canvas, the selected state, and a re-audit of the whole system

**Date:** 2026-09-14 · **Branch:** `ds/neutral-surface-contrast` · **Scope:** the neutral grounds and
state fills every portal screen is built from, the brand-mode emitter, the Sidebar component in code
and in the SAMAVESH library, the E-Anudaan handoff file — then a fresh measurement of the whole colour
system in both estate brands.

**Prompted by:** "the neutral bg colours look off, light grey looks a little dark", on the E-Anudaan
SHRESHTA Mode 2 handoff frame (`evmNmlK8g4VYwJVu2FwSGV`, node `52667:51133`).

**Method:** every figure was measured, not estimated — from `packages/tokens/dist/tokens.css` resolved
per brand, with the package's own `oklch.mjs`, `ramp.mjs#contrastRatio` and `cvd.mjs` (Machado 2009,
severity 1.0); from computed styles in the running portal (Playwright, 1440 × 1000, navy brand); and
from pixel samples of the Figma render. L\* is CIE lightness; ΔE is OKLab × 100. Predecessor:
[`2026-09-04-colour-system-audit-and-redesign.md`](./2026-09-04-colour-system-audit-and-redesign.md).

---

## 0. Summary

The grey was too dark, and it was doing four jobs. `bg/neutral/subtler` (`#EFF0F2`, L\* 94.8) painted
the page canvas, the sidebar's ground in Figma, every read-only field, and every hover and loading fill.
On a portal it covered roughly three-fifths of the screen, which reads darker than its swatch beside a
pure-white masthead and white cards, and it made those four things the same colour — measured
**1.00:1** between a read-only field and the page it sat on.

Two further defects surfaced while measuring:

- **The selected state was lighter than hover.** `bg/neutral/selected` was `primaryScale/50`, which
  under Navy is `#F7FAFF` (L\* 98.2) — 1.05:1 on white, and lighter than the `#EFF0F2` hover. The
  current page read as a raised white chip, and colour was its only cue.
- **Brand modes inherited the Blue brand's state colours.** The CSS emitter wrote a Tier-2 alias with no
  `colorModes` of its own as the literal `:root` value, so under `data-brand="navy"` (and all six DBIM
  previews) nine tokens stayed Blue: `bg/neutral/selected` `#ECF4FF`, `border/neutral/selected` and
  `focus/ring` gov-blue `#0373DF`, hover, active, read-only, loading and the `layer/*` fills.

All three are fixed in code and in Figma (§1), verified in the running portal (§2), and a fresh audit of
the system as it now stands follows (§3). It finds the system sound on contrast — **no ink below its
floor on any ground, in either estate brand** — and names six things still worth improving, ranked.

---

## 1. What changed

### 1.1 Tokens

| Token | Before | After | Why |
|---|---|---|---|
| `color/neutral*/25` (new rung) | — | Blue `#F6F7F8` · Navy `#F6F7F9` · DBIM `#FAFAFA` | A near-white surface rung, inserted so **no existing rung moves**. Exempt from the 4.5–11.5 L\* gap rule on purpose (`ramp.mjs`, `NEUTRAL_STEPS`). |
| `bg/neutral/subtlest` (new) | — | `neutralScale/25`, L\* 97.2 | The page canvas. The fill ladder gains `subtlest` between `base` and `subtler` (`grammar.mjs`), the word Atlassian's shipped ladder uses in the same place. |
| `on/bg/neutral/subtlest` (new) | — | `text/neutral/base` | Every fill carries its measured ink. |
| `bg/neutral/selected` | `primaryScale/50` | `primaryScale/100` at `alpha/48` | Darker than hover and brand-hued on any ground; translucent, so it follows every brand without a per-brand rung. |

Reference rungs in Blue and Navy, measured on white: canvas `1.07:1`, hover/read-only `1.14:1`, selected
`1.17:1` (Blue) / `1.20:1` (Navy).

### 1.2 The emitter — `build/formats/legacy-ds-css.mjs`

A Tier-2 alias whose target depends on the brand axis — directly, or through a reference or a
translucent wash — is now emitted as a `var()` chain and re-asserted in every brand block, like every
other alias. Verified by resolving the visual contract before and after: **the default Blue brand
renders identically except for the intended `bg/neutral/selected` change**; every changed value is
inside a `[data-brand]` block. After the fix, the only Blue-ramp values left under Navy are the six
chart tokens, which are brand-invariant by recorded decision (`semantic.json` → `chart`,
`chart-palette.test.mjs`).

### 1.3 Components and pages

| Where | Change |
|---|---|
| `AppShell` (`layout.css`) | Background `subtler` → `subtlest`; text `on/bg/neutral/subtlest`. Its sidebar slot already paints `bg/neutral/base` with a `border/neutral/subtle` right edge — unchanged. |
| Root `<body>` (`apps/hub/src/app/layout.tsx`) | `bg-surface-muted` → `bg-surface-canvas`. |
| `surface-canvas` utility (`globals.css`) | New. Resolves `--portal-surface-canvas`, then a portal's own `--portal-surface-muted`, then `bg/neutral/subtlest` — so SCW, NMBA, NHAPOA, TG and SMILE Admin, which re-bind `surface-muted`, keep their canvas. |
| 19 full-page grounds | `min-h-screen bg-surface-muted` → `bg-surface-canvas` (hub, admin, reports, explorations, portal auth pages). Panels keep `surface-muted`. |
| `Sidebar` (`sidebar.css`) | The current page (and the level-1 item that holds it) binds `bg/neutral/selected` and sets its label semibold. The level-2 route (`is-ancestor`) keeps `bg/brand/primary/base`. |

### 1.4 Figma — SAMAVESH library (`3FF5l0SMNIwdpZrKkeyPTm`)

- **Variables.** `color/neutralScale/25`, `bg/neutral/subtlest`, `on/bg/neutral/subtlest` added;
  `bg/neutral/selected` rebound to `COMPOSE_COLOR(color/primaryScale/100, alpha/48)`. Read back: Palette
  139 → 140, Color 510 → 512; the value checksum and all four field checksums (description, codeSyntax,
  scopes, hidden) are byte-identical to the generated payload. `reference/figma-live.json` re-recorded
  from that read.
- **Sidebar masters.** Level 1 Active, Level 2 Leaf and Group Active, and Level 3 Active take
  `bg/neutral/selected` and a semibold text style (`Title/title-3` for level-1 labels,
  `Body/body-2-semibold` for sub-rows) — 15 variants, 27 layers. The four Level 2 **Ancestor** variants keep
  `bg/brand/primary/base`, matching `is-ancestor` in code.
- **Sidebar documentation.** Eight texts restated the old tint and figures (7.75:1 / 15.15:1); they now
  state `bg/neutral/selected` and the measured 7.31:1 (Blue) / 13.26:1 (Navy), glyph 5.41:1 / 10.55:1.
  The states specimen panel moved from `subtler` to `base` with a bound edge, because its Hovered
  specimen was the same grey as the panel and could not be seen.
- **Colour documentation.** The `neutralScale` ramp gained its `25` cell; every swatch took a bound
  `border/neutral/subtle` edge, because swatch `50` was the panel's own colour and vanished. The Tier 1
  claim moved to "140 variables" (`tools/figma-doc-parity/claims.json`).

### 1.5 Figma — E-Anudaan handoff (`evmNmlK8g4VYwJVu2FwSGV`)

All **99** screens that use the library Sidebar now mirror `AppShell`: screen root and `main` bind
`bg/neutral/subtlest`, `body` (the sidebar's ground) binds `bg/neutral/base`. Only frames still bound to
`subtler` were touched. No other page in the file uses the library Sidebar.

### 1.6 Documentation

- `docs/design-system/colour-system.md` — generated; gains a **Surfaces and states** section measured at
  build time, and the neutral ramp is described as 14 steps.
- `/design-system/foundations/color` — a **Neutral grounds** table; the accessibility table is labelled
  for what it measures (`bg/neutral/subtler`, the darkest neutral ground text meets); focus-ring figures
  restated for the canvas.
- `packages/design-system/design.md` — `--sa-bg-neutral-subtlest` row beside `subtler`, with the rule.
- Changelog `v0.136.0`.

---

## 2. Verification

| Check | Result |
|---|---|
| Running portal, E-Anudaan SHRESHTA step 1, navy, computed styles | canvas `rgb(246,247,249)`, read-only `rgb(239,240,242)`, current page `color(srgb 0.757 0.843 0.949 / 0.48)` at weight 600, focus ring `#224c7d` |
| Before/after captures, same page, viewport and hovered row | `canvas-before-after` artifact; Figma masters and handoff frame captured before editing |
| `npm test -w @mosje/tokens` | 184 / 184 |
| `npm run check` (every gate it chains) · `lint:css` · hub and Storybook typecheck | pass |
| `check:figma-docs:live` against the library | every claim matches |
| Visual contract | re-baselined only after the portal was verified; diff limited to the brand blocks and `bg/neutral/selected` |

---

## 3. Re-audit — the system as it now stands

### 3.1 What holds

- **Every ink clears its floor on every ground it meets**, in both estate brands: white, the canvas,
  `subtler`, the composited selected fill and `bg/brand/primary/base`. Weakest pairs: warning text on
  the selected fill 4.75:1 (Navy); `text/neutral/subtler` on the selected fill 3.88:1, inside its ≥ 3:1
  ink contract.
- **Solid fills under white ink:** primary 6.36:1 (Blue) / 12.61:1 (Navy), secondary 4.97:1, accent,
  success and error 6.72:1, warning 5.68:1, info 5.96:1.
- **Non-text:** control border 4.64:1 on white and 4.33:1 on the canvas; focus ring 4.33:1 on the canvas
  in Blue and 8.17:1 in Navy (outline offset from the control, so it is measured against the ground).
- **The surface ladder now orders:** white L\* 100 → canvas 97.2 → hover and read-only 94.7 → selected
  93.6 (Blue) / 92.9 (Navy) → active 88.4. Before, the canvas and the state fills were one value.
- **Status text under colour-vision deficiency:** error text stays ≥ 17 ΔE from body text under every
  simulation.

### 3.2 What is still worth improving

Ranked by what a reader loses. None is a WCAG failure; each is a place the system is weaker than it
should be. As first written, none was applied; **1–3 were then applied the same day — see §5**, which
records what was done and the one place the proposal was measured and deliberately not followed.

**1 · The sidebar route tint is invisible in Navy.** *(Applied — §5.1.)* `bg/brand/primary/base` under Navy is `#F7FAFF`,
L\* 98.2: 1.05:1 on the white sidebar and *lighter* than the canvas. The Ancestor state (and every other
`bg/brand/primary/base` use — 21 in the design system) reads only through its ink. In Blue the same
token is `#ECF4FF`, L\* 95.9, and visible. *Cause:* finding 3. *Proposal:* fix at the ramp, not here.

**2 · Selected differs from hover by hue, not by lightness.** *(Applied — §5.2.)* Selected sits 1.1 L\* (Blue) and 1.8 L\*
(Navy) below hover, ΔE 2.4–2.5; under protanopia and deuteranopia ΔE falls to 2.0–2.7. The state still
reads — the label is semibold, the ink is `bolder` and the glyph fills — so WCAG 1.4.1 is met, but the
fill alone does not carry it for a colour-blind reader. *Proposal:* raise the wash from `alpha/48`:

| alpha | Blue fill · L\* · below hover · text / glyph | Navy fill · L\* · below hover · text / glyph |
|---|---|---|
| 48 (shipped) | `#E1EEFF` · 93.6 · 1.1 · 7.31 / 5.41 | `#E1ECF9` · 92.9 · 1.8 · 13.26 / 10.55 |
| 56 | `#DCEBFF` · 92.5 · 2.2 · 7.10 / 5.26 | `#DCE9F8` · 91.8 · 3.0 · 12.87 / 10.24 |
| **64** | `#D7E8FF` · 91.4 · 3.3 · 6.90 / 5.11 | `#D7E5F7` · 90.4 · 4.4 · 12.41 / 9.87 |

`alpha/64` clears 3 L\* in both brands and every ink stays AA. It is one token and one library variable.

**3 · The lightest tint is a different lightness in every family.** *(Applied to Navy; error kept by decision — §5.1.)* Rung 50: error 92.7, Blue primary
95.9, warning 95.8, info 96.2, success and secondary 96.4, **Navy primary 98.2**. An error banner is
therefore visibly heavier than an info banner of the same importance, and Navy's tint vanishes (finding
1). *Proposal:* pin each generated ramp's `lightest` so rung 50 lands at L\* 96 ± 0.5 — Navy `98.5 →
~96.5`, danger upward. This regenerates brand ramps and moves Figma values.

**4 · Navy's dark end is compressed into black.** *(Re-measured and addressed at the role level — §7.)* Rungs 700–950 sit at L\* 13.4, 7.8, 4.0 and 1.6
(steps of 7.9, 5.6, 3.8 and 2.4), against 13–14 per step above the anchor; Blue steps evenly at 8–9.6.
`bg/brand/primary/boldest` (rung 800, `#001734`) is 1.42:1 from `bolder` and reads as black, not navy.
*Proposal:* lower Navy's `darkest` so the four dark rungs spread, or bind `boldest` to rung 700 in Navy.

**5 · The saffron identity wash reads as an error tint.** *(Applied — §6.)* The sidebar's portal-identity header fades
`color/transparent/secondary/8` over white: `#FFF3ED`, hue 49°, 3.6 ΔE from the error tint `#FFE4E1`
(hue 25°) — on a form full of red required-field asterisks. Saffron against error is already on
`SEPARATION_LEDGER` at the solid rungs (8.6 ΔE, 17°). *Proposal:* remove the wash from portal chrome
(`sidebar.css:500`), or make it neutral; keep saffron for the SAMAVESH mark itself.

**6 · A card is separated from the canvas only by its border.** Card against canvas is 1.07:1; its
`border/neutral/subtle` edge is 1.26:1. That is enough and meets no WCAG criterion by design, but it
means the edge is load-bearing: **a card must keep its border** on the canvas.

### 3.3 Withdrawn or corrected from the first pass

| First-pass finding | Now |
|---|---|
| "Sidebar hover is invisible" | True only in the Figma handoff, where the sidebar sat on the grey. The coded sidebar was already white. Fixed in the handoff (§1.5). |
| "Muted text fails AA on the grey" | Not live: all seven uses of `text/neutral/subtler` sit on white or are placeholders and disabled labels. The token is unchanged — darkening it would stop placeholders reading as not yet entered. |
| "Accent and Success are the same colour" | A recorded decision (`brand-ramps.mjs`: India Green is both), not an oversight. |
| "Three near-identical neutral ramps" | The Blue and Navy greys are deliberately tinted to each brand's hue (255° / 264°, `NEUTRAL_ANCHORS`); DBIM's are pure. The one-unit mismatch seen under Navy was the emitter defect (§1.2), now fixed. |
| "Warning solids read as brown" | Confined already: the fill ladder states amber's only solid is `bold` under dark ink, and `bg/status/warning/bolder` is used once, as a password-strength bar with no text. |
| "White on saffron fails" | Correct, and already handled: `bg/brand/secondary/bolder` is rung 600 (4.97:1); `#FF671F` itself is never a text ground. |

---

## 4. Not done here

- **The four proposals in §3.2 (1–5).** Each moves published values across both brands and the library.
- ~~`build/brand-ramps.mjs` is not idempotent.~~ Fixed in §5.3.
- **Figma library Index.** `check:figma-index:live` reports a `Form Layout` page with no card; the page
  was added by other work and is out of scope here.
- **The Figma library must be published** for the Sidebar master and documentation changes of §1.4 to
  reach consuming files.

---

## 5. Follow-up applied — improvements 1 to 3

### 5.1 Navy's lightest tint, and why error stays heavier

The Navy primary ramp is re-laddered: `ANCHORS["primaryRamp.navy"].lightest` 98.5 → **96.8**. Rung 600
(`#003366`, the anchor) is untouched; every other rung is regenerated by `ramp.mjs`.

| Navy rung | Before | After | CIE L\* |
|---|---|---|---|
| 50 | `#f7faff` | `#eef5ff` | 98.2 → 96.3 |
| 100 | `#c1d7f2` | `#bbd2ef` | 85.2 → 83.4 |
| 200 | `#93b1d6` | `#90aed3` | 71.2 → 70.1 |
| 300 | `#6a8cb7` | `#678ab5` | 57.3 → 56.5 |
| 400 | `#446a99` | `#426998` | 44.0 → 43.5 |
| 500 | `#224c7d` | `#214c7d` | 31.8 → 31.7 |
| 700 · 800 | `#002249` · `#001734` | `#002349` · `#001735` | one hex unit |

`bg/brand/primary/base` under Navy is now 1.10:1 on white — the same visibility Blue's `#ecf4ff` has
(1.11:1) — and the sidebar's route reads as a tint, not a white chip. Its ink, `text/brand/primary/bolder`,
measures 14.32:1 on it. Every `on/*` pairing still clears AA in both brands (`on-pair-contrast.test.mjs`).

**The error ramp was measured and kept.** Lifting `dangerRamp.lightest` so rung 50 lands at L\* 96 was
tried at 96.0, 96.5 and 97.0. The chroma arc thins as lightness rises, so the error tint collapses onto
India Saffron's:

| `dangerRamp.lightest` | error rung 50 | ΔE to saffron 50 | ΔE rung 100 |
|---|---|---|---|
| **94 (kept)** | `#ffe4e1`, L\* 92.7 | **3.4** | **4.5** |
| 96.0 | `#ffedeb` | 1.2 | 3.0 |
| 96.5 | `#ffefee` | 0.8 | 2.6 |
| 97.0 | `#fff2f0`, L\* 96.4 | 0.4 | 2.2 |

At 97 an error banner and a saffron brand wash would be the same colour. An error also carries more
urgency than a note, so the heavier ground is the right weight rather than an inconsistency. The
decision and these figures are recorded beside `dangerRamp` in `build/brand-ramps.mjs`.

### 5.2 The selected state at 64%

`bg/neutral/selected` composes `color/primaryScale/100` with **`alpha/64`** (was 48).

| | Blue | Navy |
|---|---|---|
| fill on white | `#d7e8ff` | `#d3e2f5` |
| below hover | 3.3 L\* | 4.4 L\* (with the new rung 100) |
| `text/brand/primary/bolder` on it | 6.90:1 | 11.95:1 |
| `icon/brand/primary/bolder` on it | 5.11:1 | 9.59:1 |

The state is now carried by lightness as well as hue. The sidebar's documented figures — the CSS
header, the web page's 1.4.3 evidence, and seven texts on the library's Sidebar page — are restated
to these values.

### 5.3 The ramp generator is idempotent

`buildAlphaTiers()` now emits the `secondary/0` fade stop and its description itself. A full run of
`node build/brand-ramps.mjs` with no anchor changed leaves `src/` and `brands/` byte-identical — checked
before the Navy change was made, so the diff that followed is only the change.

### 5.4 Figma and verification

- **Library.** The eight Navy Palette values and `bg/neutral/selected` pushed; read back, Palette and
  Color value and field checksums byte-identical to the payload; `reference/figma-live.json`
  re-recorded. **Tooling note:** the Plugin API now returns a `COMPOSE_COLOR` binding as
  `{color, opacity}` aliases rather than a `VARIABLE_EXPRESSION`; a read-back must normalise both
  shapes to `->base@->alpha/N` or its value checksum will disagree for every translucent variable.
- **Running UI (navy).** The portal's current page computes to `primaryScale/100 @ 0.64`; the Sidebar
  documentation specimen's route computes to `rgb(238,245,255)`. The Sidebar documentation specimen
  now sits on the white ground `AppShell` gives the rail, instead of the shared grey specimen stage,
  so the route and hover tints are shown against the colour they are drawn on.
- `npm test -w @mosje/tokens` 184/184; visual contract re-baselined after the UI check — the diff is
  the Navy brand block and `bg/neutral/selected`.

---

## 6. Follow-up applied — the saffron identity wash (2026-09-15)

**Removed, not neutralised.** The portal identity block at the head of every sidebar rail faded
`color/transparent/secondary/8` to `color/transparent/secondary/0`. Over white that is `#fff3ed`, hue
49°, **3.6 ΔE** from the error tint `#ffe4e1` (hue 25°), and it was the only warm surface on a screen
whose other warm marks are the red required-field asterisks. A neutral replacement was considered and
rejected: the rail is already white and the block already carries a `border/neutral/subtle` edge, so a
grey wash would reintroduce exactly the grey this audit took off the rail. Saffron remains where it is
identity rather than surface — in the SAMAVESH mark.

| Where | Change |
|---|---|
| `sidebar.css` — `.ds-sidebar__identity` | `background` gradient removed; header comment records why and when. |
| `types.ts` | The mark's doc comment no longer calls the wash its ground. |
| `color/transparent/secondary/0` | Retired: it existed only as this fade's far end, and `check:token-consumers` refuses a token nothing binds. `build/brand-ramps.mjs` keeps the per-family 0-tier mechanism with no family declared. `secondary/8` is unchanged — it is one of the generated 8–48 tiers, and the login template's portal list binds it. |
| Library — `Sidebar/PortalIdentity` (both modes) | Gradient fill removed; the instances inside `Sidebar` inherited the change with no overrides to clear. |
| Library — variables | `color/transparent/secondary/0` deleted after confirming nothing on any page bound it. Read back: Palette 139, every value and field checksum byte-identical to the payload; `reference/figma-live.json` re-recorded. |
| Library — documentation | The Sidebar page's identity panel and the Colour page's Tier 1 count (140 → 139) restated; `tools/figma-doc-parity/claims.json` follows. |
| `docs/design-system/components/sidebar.md` | Decision 23 marked superseded, with the reason. |

**One gate allowance, recorded.** `check:token-consumers` counts Tier-2 tokens with no static consumer.
Removing the wash left `color/transparent/secondary/8` unconsumed on this branch, so the colour family's
baseline is raised from 51 to 52 with the reason written into `tools/token-consumers/baseline.json`. The
token is kept rather than retired because the login template's portal list binds it in the library and
PR #481 adds its code consumer; when #481 lands the count returns to 51 and the gate asks for a re-record.

**Verified in the running UI** (navy): `.ds-sidebar__identity` computes `background-image: none` in the
E-Anudaan portal and in the Sidebar documentation specimen; before/after captured from the same
page and viewport.

**A slip, corrected in the same session.** The Figma pass cleared every node bound to either
`secondary/0` or `secondary/8`, which also caught `Auth / PortalList` on the Portal Login Template page —
a `secondary/8` fill that is not part of this change (it arrives with the login-template work, PR #481).
It was restored at once to its single solid fill bound to `color/transparent/secondary/8`, matching the
`.ds-portal-list` rule on that branch, and confirmed by screenshot.

---

## 7. Follow-up applied — Navy's dark shades (2026-09-15)

### 7.1 The finding was right about the symptom and wrong about the cause

§3.2 item 4 measured the dark end in CIE L\*, which stretches the near-black toe, and proposed
re-spacing the ramp. Measured again in OKLab — the space `ramp.mjs` actually generates in — Navy's
steps below the key colour are 6.9, 5.3, 4.4 and 4.5 ΔE against Blue's even ~7.4. Neither remedy works:

| Navy `darkest` | rung 800 | ΔE 700→800 | 600 vs 800 | 950 vs black |
|---|---|---|---|---|
| **12 (shipped)** | `#001735` | 5.3 | 1.42:1 | 12.8 ΔE |
| 14 | `#001938` | 4.8 | 1.39:1 | 14.8 ΔE |
| 16 | `#001b3c` | 4.0 | 1.36:1 | 16.8 ΔE |
| 18 | `#001d3f` | 3.5 | 1.33:1 | 18.9 ΔE |

Lifting the floor shrinks every state step; lowering it takes the bottom rungs to pure black. Holding
chroma up changes nothing either — at those lightnesses the ramp already sits on the sRGB gamut edge.
**The cause is the anchor:** `#003366` has OKLab L 32, Blue's rung 800 has 35, so a rung NUMBER is about
two shades deeper under Navy than under Blue.

Re-anchoring Navy at rung 700 or 800 would make its rungs behave exactly like Blue's, but it moves the
resting primary button off `#003366` (to `#1E497B` or `#375F8F`). Offered as options on 2026-09-15; the
decision was to **keep `#003366` on buttons and fix the roles that read as black**.

### 7.2 What changed

| Where | Change |
|---|---|
| `generate-system-tokens.mjs` | A `NAVY` override map: `bg/brand/primary/boldest` and `text/link/visited/default` take `primaryRamp.navy.600` under Navy. Blue and the DBIM previews keep rung 800. |
| `site-footer.css` | Deep band, rule and chips are `color-mix()` proportions of the footer ground instead of fixed rungs. Blue: deep `#002852` for `#002855`, rule `#025eb9` for `#005eb9`. Navy: deep `#002447` for `#000e24`. Rung fallbacks kept for engines without `color-mix`. |
| `legacy-ds-css.mjs` (defect) | The alias re-assertion at the end of a brand block redeclared a token that block had already overridden, cancelling the override; a brand with no override of a Tier-2 alias wrote the Blue literal. Both fixed, and a translucent token keeps its alpha per brand. Verified by resolving all 12 selector contexts against the previous build: **exactly two values change, both in Navy.** |
| `figma-variables.mjs` (defect) | A Color token whose Navy value is a different rung was aliased to the Blue rung's Palette variable. Such tokens now get a brand-source companion. Three: the two above, and `text/link/brand/default`, which the library had been showing at Navy rung 600 while the code paints 500. |
| Library | Three Palette variables created (hidden, `role: brand-source`), three Color variables re-aliased. Read back byte-identical on every value and field checksum; Palette 139 → 142; Colour page count and `claims.json` restated. |

**Not changed, deliberately:** the ramp; the resting (`#003366`) and hover (`#002349`) button; the
pressed button (`#001735`, rung 800, bound directly — a momentary state, and lifting it would erase its
step from rest); the ticker's plinth (rung 800 under a rung-600 bar — a designed tonal step); rungs 900
and 950, which no Navy role binds.

### 7.3 Verified in the running UI (Navy)

| Surface | Before | After |
|---|---|---|
| Website footer ground | `rgb(0, 23, 53)` | `rgb(0, 51, 102)` |
| Profile card status pill | `rgb(0, 23, 53)` | `rgb(0, 51, 102)` |
| Visited link | `#001735`, 6.9 ΔE from body text | `#003366`, 12.4 ΔE from body text, 8.9 ΔE from an unvisited link |
| Primary button rest / hover / pressed | `#036` / `#002349` / `#001735` | unchanged |

Footer ink on the new ground: dim ink (rung 200) 5.51:1, muted ink 8.15:1, white 12.61:1.

