# AccessibilityBar — component specification

> SAMAVESH Design System · Figma `3FF5l0SMNIwdpZrKkeyPTm` → page **Accessibility Bar and Widget** → set **AccessibilityBar** (`55065:33766`).
> Rebuilt 2026-08-12 to industry standard, UX4G-aligned, following `.claude/rules/component-authoring.md`.

The government top **utility bar** (UX4G/GIGW): the "Government of India" link on the
left, and the accessibility controls (skip-to-content, font size, accessibility
options, language) on the right. It is the a11y surface itself, so every control must
be keyboard-operable and announced.

## Code component

Shipped in `@mosje/design-system` as **`AccessibilityBar`**
(`packages/design-system/components/navigation/accessibility-bar.tsx` +
`.css`), exported from the barrel. It mirrors this Figma master and — per the
2026-08-12 "Align code to Figma" decision — **includes the A−/A/A+ font-size
stepper**, which drives a `--sa-font-scale` variable (and `data-sa-font-scale`)
on the document root so `rem`-sized content reflows; `onFontScaleChange`
persists it. Props: `govLink`, `skipTo`, `showSkip`, `fontSize`,
`accessibility`, `accessibilityHref`, `onAccessibility`, `language`, `layout`
(`narrow`/`wide`/`fluid`), `device`, `skipLabel`, `maxWidth`, `onFontScaleChange`.
**There is no `tone` prop** — this file listed one until 2026-08-18 and the code has
never had it. Blue vs Navy is the `data-brand` axis (Figma models it as Palette
MODES), which is why the master has no Tone variant. Never reintroduce a colour prop.
Documented at `/design-system/components/accessibility-bar`, story at
`apps/storybook/stories/AccessibilityBar.stories.tsx`.

> **Wired into `SiteHeader`, with font size ON (2026-08-18).** Both halves of the
> note that used to sit here were stale. `SiteHeader` renders this component (see
> `site-header.tsx`), and the flagged decision — "should the live public masthead
> surface font size?" — is now answered **yes**. See "The masthead reversal" below.

## Changed in Figma since the last sync — recorded 2026-08-18

The designer edited the master after the 2026-08-12 parity pass. Read back from
`get_context_for_code_connect` + `get_variable_defs` + a 3.2× render of
`Device=Desktop, Layout=Wide`, and diffed against what this file and the Code
Connect template claimed. **Two glyph swaps, nothing structural:**

| Element | Repo believed | Figma now | Code |
|---|---|---|---|
| Font-size pill (middle) | plain `A` text, "no double box" | **`font_download`** | matched |
| Language | `language` (globe) | **`translate_indic`** | matched |

Everything else held: 9 variants (Mobile {Fluid}, Tablet {Narrow, Fluid}, Desktop
and Desktop XL {Narrow, Wide, Fluid}), the same 9 properties, `Divider` still an
instance at `Orientation=Vertical, Tone=Inverse subtle`, and the same token set.
The variant ordering is already correct per `component-authoring.md` §10 — Device
ascending by viewport, Layout ascending by content width.

> **FLAGGED — `font_download` reinstates the double box this spec once rejected.**
> The glyph draws its own rounded outline, and it sits on the 32px pill, which is
> also a box. The token map below still carries the old decision's words: *"plain
> 'A' glyph (no double box)"*. Code now follows Figma, because Figma is the source
> of truth per the 2026-08-12 decision — but the two records disagree and only the
> designer can settle which is intended. It is also worth noting the glyph reads as
> *"font"* rather than *"reset to the default size"*; the `aria-label` carries the
> real meaning, so this is a visual-clarity question, not an accessibility one.

## Typography — corrected 2026-08-19

The bar rendered **12px** where the master specifies **14px**, and the parity table above
claimed a ✓ on it. That row checked one text node and generalised; the master actually
mixes two roles, and a side-by-side at 2× made the gap obvious before any measurement.

| Label | Figma | Code before | Code now |
|---|---|---|---|
| Government of India | `body/2` 14/20 Regular, **no underline** | 12px, weight **500**, **underlined** | 14/20, 400, no underline |
| Skip to Main Content | `body/2` 14/20 Regular | 12px | 14/20 |
| English | `label/1` 14/20 **Medium** | 12px, weight 400 | 14/20, 500 |

Two things worth keeping:

- **14 is also the better end of the argument.** 12px sits well under the 16px body floor
  `guidelines.md` sets, and this bar carries the **skip link** — a WCAG 2.4.1 bypass
  mechanism, not decoration. Matching the master and improving legibility pointed the
  same way, which is not always true.
- **The resting underline is gone** (design decision). The affordance is not lost: the
  link underlines on hover *and* on focus, which is exactly what the skip link beside it
  already did — so the bar's two links now behave identically instead of one shouting and
  one whispering.

## Five defects found by looking at it, 2026-08-19

A measured comparison had already declared the bar a match. Looking at it side by side
found five things measurement had not been pointed at. Recorded because the lesson is
the useful part: **a passing measurement only covers what you thought to measure.**

| # | Defect | Cause |
|---|---|---|
| 1 | Launch glyph ~1px closer to the label than in Figma | Figma's text node has a 3px trailing bearing, the browser's advance 1.1px. Box gap is 2 on both. **Not fixed** — see below. |
| 2 | The three separators sat **high** in the bar | `align-self: stretch` on a rule with a *definite* height behaves as `flex-start`. They rendered at y=7 in a 46px bar instead of 13, while every control around them was centred. |
| 3 | No flag in the documentation specimens | `flagSrc` is optional and no preview passed it, so the docs demonstrated a bar the estate never ships. |
| 4 | Hover was a square, a circle **and** a pill | Three corner treatments across five controls in one row — and the master had the same split. |
| 5 | The hover underline ran through the launch glyph | `text-decoration` on the anchor is drawn across every inline descendant; `text-decoration: none` on the child cannot remove it. |

**Defect 2 is the one worth remembering.** `align-self: stretch` is correct for a rule
with no length and actively wrong for one with a length — and it fails *silently*: the
rule is the right size and the right colour, just in the wrong place. Any check that
measures the divider alone passes it. Divider now sets `align-self: center` whenever an
explicit `length` is given.

**Defect 4 originated in Figma, not the code.** The master carried `shape/4` on the
steppers and the reset, `shape/full` on the accessibility button and Language, and
`shape/8` on the States specimen chip — three radii for one class of control. Both sides
are now `shape/4` (the majority, and the rounded-square language the specimen already
used); 42 nodes across the 9 variants were rebound.

**Defect 1 is left alone, deliberately.** Measured by pixel: Figma's visual gap is **6px**,
the code's **4.93px**. The *structural* value matches exactly — a 2px box gap, the master's
`inline/2` — and the residual 1.07px is Figma and the browser disagreeing about the same
font's trailing bearing (3px vs 1.13px). Closing it would mean a 3px gap, and the spacing
ladder has no 3. A 1px font-metric difference is not worth an off-ladder literal; it is the
same class as the 1px differences already recorded on the text widths.

## Interaction states (§ 04 of the Figma documentation page)

Every **clickable control** on the bar resolves through four states. The Figma page
is the source; the code matched three of them and was missing one entirely.

| State | Value | Token | Code before 2026-08-18 |
|---|---|---|---|
| Default | no background | — | ✓ |
| **Hover** | white **8 %** | `overlay/on-brand/hover` `#ffffff14` | ✗ **12 %** — an invented value |
| **Focus-visible** | 2 px ring, never removed | inverse ink | ✓ (and the page was wrong — see below) |
| **Active** | white **16 %** | `overlay/on-brand/pressed` `#ffffff29` | ✗ **absent** |

**ACTIVE carries two senses.** Both resolve to the same layer, so both bind to the same
token rather than two look-alike values:

1. a control being **pressed** — including `A−` and `A+`, which had no pressed state at all
   before 2026-08-18; and
2. the **step button matching the direction the reader has moved in** — `A−` below the
   default size, `A+` above it, neither at it.

**Sense 2 moved twice, and the history is the argument for where it landed.**

| | Lit | Why it was wrong |
|---|---|---|
| Originally | centre, **at** the default | Said nothing. The scale persists, so a reader returning at 120 % saw a bar identical to an untouched one. |
| 2026-08-18 | centre, **away from** the default | Better, but the highlight sat on a button nobody pressed — it read as *"the centre is selected"* — and one indicator cannot express direction, so 90 % and 120 % looked the same. |
| **2026-08-19** | **the direction button** | Press `A+` and `A+` lights. A lit `A−` versus a lit `A+` says which way you went. The centre is purely the reset. |

Verified live across all four steps: 90 % → `A−` lit and disabled; 100 % → none lit;
110 % → `A+` lit; 120 % → `A+` lit and disabled.

Two consequences worth recording:

- **No `aria-pressed` anywhere in the stepper.** The centre is a reset **action**, not a
  toggle, and `A−`/`A+` are actions too. The state a screen-reader user needs — the current
  size — is carried by the centre's accessible name: `Text size: 100% (default)` at rest,
  `Reset text size to default — currently 110%` when deviated.
- **The centre stays enabled at the default**, even though resetting is then a no-op.
  Disabling it on reset would destroy focus at the exact moment the reader activated it.

`:active` is declared **after** `:hover` at equal specificity. A pointer is almost
always hovering the control it presses, so the reverse order makes the pressed state
unreachable.

The Government-of-India and skip links are deliberately **not** tinted — they are text
links carrying the underline affordance, and tinting them would invent a control
affordance the master does not have.

> **The documentation page prescribed a focus ring that fails WCAG, and it has been
> corrected in Figma.** § 04 specified `focus/ring · 2px`. `focus/ring` is `#0373DF`,
> which on this bar's `#005EB9` fill measures **1.37:1** — far below the **3:1** that
> WCAG 1.4.11 / 2.4.11 require of a focus indicator, i.e. close to invisible exactly
> where a keyboard user needs it. Inverse ink measures **6.36:1**. The code already used
> inverse ink; the Figma specimen and its card were rebound to match on 2026-08-18.

> **CLOSED 2026-08-18 (design decision "Fix A").** The master's `A−`, `A+`,
> `accessibility_new` and language controls were **bare 20 × 20 glyphs with no hit-area
> frame** — only the middle A had one — so as drawn those targets failed **WCAG 2.2 AA
> 2.5.8 (24 × 24 minimum)**. Every one of the **8 variants that carries the cluster** now
> has explicit `hit-area` frames: **24 × 24** on the steppers (`shape/4`), **28 × 28** on
> the accessibility button and **28** tall on the language pill (`shape/full`), with width,
> height and all four radii **bound to variables** — no literals. Figma now matches the
> code, which already shipped these sizes.
>
> Nothing moved visually: the hit frames are transparent, so the bar renders exactly as
> before. The right-hand cluster grew by ~35px on a 1200 container, and every variant is
> still 46px tall — verified after the change.

## The masthead reversal (2026-08-18)

`SiteHeader` shipped `fontSize={false}`, justified in `2f683c1` as "the widget is
the single mechanism; a second stepper doubles up". **That premise was never true
in practice** — the stepper wrote `--sa-font-scale` and nothing read it, so it was
not a competing mechanism, it was an inert control. With the variable now consumed
(see below) it becomes the direct, visible way to resize text, and the widget's
floating button is hidden wherever the bar offers the same entry. One door, not two.
Contrast, spacing and dark mode remain the widget's.

**No divergence — the library already agreed, and the claim that it did not was
false.** Both this file and the brief that commissioned the change asserted that
**13 nested instances** were set to font-size OFF to match the old code, so that
flipping the code would create drift. **Audited against Figma on 2026-08-18 and it
is not true:** every nested `AccessibilityBar` instance in the library has
`Font size = true`.

| Page | Nested instances | `Font size` |
|---|---|---|
| Navbar | 21 | all ON |
| Portal Login Template | 14 | all ON |
| Accessibility Bar | 4 | all ON |
| **Total** | **39** | **all ON** |

The **code was the outlier**, so turning the masthead's stepper on **closed** a
divergence rather than opening one. Nothing needs flipping in Figma.

`navbar.md` §Anatomy still repeats the old "off on all 13 nested instances" line —
that is a stale historical record of a v2.3.0 action, not a description of the
library today, and it is corrected there.

## How the font sizer actually works, and how far it reaches

`:root[data-sa-font-scale] { font-size: calc(100% * var(--sa-font-scale, 1)) }`.
Scaling the **root** carries the whole ramp because the type scale is authored in
`rem` (including both ends of every fluid `clamp()`), along with rem-based spacing,
control heights and icons. The rule is armed by the **attribute**, never by the
variable's fallback, so a page with no bar keeps the reader's own browser zoom.

Two honest limits, measured rather than assumed:

1. **The `vw` term inside a fluid `clamp()` does not scale** — it is viewport-derived
   by definition — so fluid roles reach their (scaling) ceiling sooner.
2. **Hardcoded px in consuming markup is out of reach.** Measured at scale 1 → 1.2
   on 2026-08-18:

   | Surface | Text elements | Actually resize |
   |---|---|---|
   | `/design-system/components/accessibility-bar` | 285 | **80.4 %** |
   | `/portals/nhapoa` | 123 | **29.3 %** |
   | `/website` (public homepage) | 272 | **14.0 %** |

   The homepage is authored in Tailwind arbitrary px — `text-[15px]`, `text-[14px]`,
   `text-[13px]`, `text-[11px]` — which no root change can move. **The mechanism is
   correct; the consuming pages are not.** A citizen pressing A+ on the homepage
   today sees almost nothing move, and that is a content-authoring defect to fix in
   the website app, not a reason to change the mechanism.

## Figma ↔ code parity audit (2026-08-12)

Audited the code component against the Figma master's own variable defs. **The code
is now a faithful match on everything the code token contract can express**, with
six divergences recorded below — five of which need a human decision because
"fixing" them would contradict an existing documented decision.

### Matching (verified by computed style in the browser)

| Property | Figma | Code | ✓ |
|---|---|---|---|
| Bar fill | `bg/brand/primary/bolder` #005EB9 | `--sa-bg-brand-primary-bolder` | ✓ |
| Text / icons | `text|icon/neutral/inverse` #fff | `--sa-text-neutral-inverse` | ✓ |
| Type | `body/2` 14/20 (links) · `label/1` 14/20 Medium (language) | `--sa-type-body-2-size|-lh` → 14px/20px | ✓ (corrected 2026-08-19) |
| Bar height | `layout/bar/height` 46 | `min-height: 46px` | ✓ |
| Edge padding | `padding/2xl` 32 ≥tablet · `padding/m` 16 mobile | same, via media query | ✓ |
| Vertical padding | `ref/space/xxs` 2 | `--sa-ref-space-2` | ✓ |
| Gaps | `inline/m` 12 · `inline/l` 16 · `inline/s` 8 · `inline/2xs` 2 | same `--sa-inline-*` | ✓ |
| Separator | 1 × `ref/size/20`, white @40% | same | ✓ |
| Font-size pill | `ref/size/32`, `shape/xs`, white @16% | same | ✓ |
| Flag | 33 × `ref/size/22`, `shape/xxs` | same | ✓ |
| Icon size | 20 | `--sa-ref-size-20` | ✓ |
| Container (narrow) | `layout/container/narrow` 720 | `--sa-container-md` (720) | ✓ |

### Divergences — ALL SIX CLOSED (2026-08-12, "Figma is the source of truth")

1. **`icon/size/20`** — added to the code scale as `icon/size/20`. This is a
   **recorded divergence from DBIM 3.4/3.7.i**, whose sanctioned scale is exactly
   24/32/48/64. Mitigating fact captured in the token's own description: 20 is
   precisely the *live area* of a DBIM 24 frame (24 − 2px padding per edge), so the
   rendered glyph matches DBIM's 24 step. 24 remains the estate default.
2. **`layout/container/wide` = 1200** — added as `container/wide` (Tier 2), with
   `container/narrow` aliasing `container/md` (720). 1200 deliberately does not
   reuse `container/xl` (1140) or `container/content` (1280); it is Figma's value.
3. **The five Figma-only tokens** — added as **Tier 3**, under a new
   `cmp/accessibilityBar/*` component: `height` (46), `flagWidth` (33) / `flagHeight`,
   `dividerWidth` / `dividerHeight` / `dividerColor` (#ffffff66), `pillSize` /
   `pillBg` (#ffffff29), plus `hoverBg`, `stepSize` and `launchIconSize`. Tier 3 is
   the correct home — a 46px bar and a white-@40% divider are this component's own
   geometry, not shared scale steps. `accessibilityBar` was added to the grammar's
   `COMPONENT` set. **The CSS now references zero Tier-1 tokens and zero raw
   colours**, which `tier-discipline.test.mjs` enforces.
4. **Icons** — now the same Material Symbols glyphs Figma instances (`launch`,
   `text_decrease`, `text_increase`, `accessibility_new`, `language`,
   `arrow_drop_down`) via `<Icon>`, replacing the hand-drawn SVGs. This also brings
   the component back under the estate icon rule.
5. **Font-size control** — now `text_decrease` / the "A" pill / `text_increase`,
   matching Figma, instead of the literal text "A−", "A", "A+".
6. **`Device` axis** — added as a `device` prop (`auto` · `mobile` · `tablet` ·
   `desktop` · `desktop-xl`). `auto` (default) resolves the same breakpoints in CSS
   so one instance adapts; an explicit device pins a single Figma variant for
   specimens and visual tests. Mobile collapses the right-hand cluster, as Figma does.

> **One deliberate exemption inside #6, and it is an accessibility one.** Figma's
> **Where the cluster GOES (27 August 2026).** Dropping it was always half the story;
> for a long time it was the whole story, and the controls simply ceased to exist below
> 768px. Measured at 375px on the live site: font size, accessibility options and language
> all had `offsetParent: null` and nothing rendered them anywhere else. `SiteHeader` now
> renders `AccessibilityControls variant="sheet"` inside `NavSheet` — the same three
> controls as labelled rows, sharing one text-size store (`font-scale.ts`) so the bar and
> the sheet can never disagree. The UX4G floating button, previously hidden estate-wide,
> is un-hidden below 768px as a second route and suppressed only while the sheet is open.
> The section hides itself from 768 up, where the bar takes the controls back — between
> 768 and 1023 both the bar and the sheet exist, and two live copies of one control is
> worse than none.
>
> **`layout="page"` (27 August 2026).** `wide` is a flat 1200 that never steps;
> `--sa-container-page` runs 1200 / 1320 / 1440. A bar on `wide` above rows on `page` is
> 60px narrower than them at 1440 and 120px at 1920. `SiteHeader` passes `page`.
>
> Mobile variant drops the *entire* right cluster including the skip link. The code
> keeps the **skip link** on mobile: it is the page's WCAG 2.4.1 bypass mechanism, and
> `.claude/rules/guidelines.md` places accessibility/legal requirements above brand and
> structural preferences and forbids weakening one to make something match. Font size,
> accessibility and language do collapse, exactly as Figma specifies.

### Verified in the browser after the change

Material Symbols glyphs render at 12 (launch) / 20 (controls); `min-height` 46px;
divider `rgba(255,255,255,0.4)` at 1×20; pill 32px; mobile collapses the cluster while
the skip link survives; font scale 1 → 1.1; the accessibility icon opens the UX4G widget.

## Anatomy

```
AccessibilityBar (root, h=46, fill bg/brand/primary/bolder, px=padding edge, py=ref/space/xxs)
└─ Container (max-width per Layout, centred, justify: space-between)
   ├─ Government of India        (gap inline/m)
   │  ├─ Indian-Flag             (33×22, radius shape/xxs — reused library asset)
   │  └─ Container               (gap inline/2xs)
   │     ├─ "Government of India" (Noto Sans Regular, body/2 14/20, NO underline, text/neutral/inverse)
   │     └─ launch               (Material Symbols "open_in_new", 12px, icon/neutral/inverse)
   └─ Accessibility Options       (gap inline/l, justify end)
      └─ Navigation               (h=42, gap padding/m, justify end)
         ├─ Skip to main Content  [boolean: skipToMainContent]   → text + Divider(Vertical,Inverse)
         ├─ Font Size             [boolean: fontSize]            → A− · [A]chip · A+  + Divider
         ├─ Accessibility options [boolean: accessibilityOptions]→ accessibility_new + Divider
         └─ Language              [boolean: language]            → language · "English" · arrow_drop_down
```

## Properties

Figma uses **designer-friendly property names**; the code component uses camelCase
props, mapped 1:1 via Code Connect (not identical strings).

| Figma property | Code prop | Type | Values / default | Purpose |
|---|---|---|---|---|
| `Device` | `device` | Variant | Mobile · Tablet · Desktop · Desktop XL (ascending viewport) | Frame width + edge padding for the breakpoint |
| `Layout` | `layout` | Variant | Narrow · Wide · Fluid (ascending content width) | Content-container width (see below) |
| `Skip to content` | `skipToMainContent` | Boolean | default `true` | Show the skip link group |
| `Font size` | `fontSize` | Boolean | default `true` | Show the A−/A/A+ group |
| `Accessibility` | `accessibilityOptions` | Boolean | default `true` | Show the accessibility-widget entry |
| `Language` | `language` | Boolean | default `true` | Show the language selector |

**9 valid Device×Layout variants** (ordered Device ascending, then Layout ascending):
Mobile {Fluid}, Tablet {Narrow, Fluid}, Desktop {Narrow, Wide, Fluid}, Desktop XL
{Narrow, Wide, Fluid}. (Tablet has no Wide — 1024 < 1200; Mobile is Fluid-only and
collapses the right cluster.)

## Layout model (content container)

`Layout` sets the inner container's **max-width**, centred inside the full-bleed root
(edge padding only). This reproduces UX4G's per-breakpoint padding with one mechanism:

| Layout | Container max-width | Desktop side space | Meaning |
|---|---|---|---|
| **Narrow** | `layout/container/narrow` = 720 | ~360px | Content matches a 720 page container |
| **Wide** | `layout/container/wide` = 1200 | ~120px | Content matches a 1200 page container |
| **Fluid** | none (fills) | edge only | Full-bleed; only `padding/2xl` (32 / mobile 16) |

> **Naming note (flagged):** "Fluid" is actually the *widest* (full-bleed) and
> "Narrow" the most inset — kept from UX4G for parity, documented here.

## Token map

| Spec | Token |
|---|---|
| Bar surface | `bg/brand/primary/bolder` (#005EB9) |
| Text | `text/neutral/inverse` · `body/2` 14/20 Regular for both links · `label/1` 14/20 **Medium** for the language label |
| Icons | `icon/neutral/inverse` · size `icon/size/20` (launch = 12) · Material Symbols Rounded / Light (wght 300) |
| Flag radius | `shape/xxs` (2) · Font-size chip radius `shape/xs` (4) |
| Edge padding | `padding/2xl` (32) desktop/XL/tablet · `padding/m` (16) mobile · vertical `ref/space/xxs` (2) |
| Gaps | GoI `inline/m` (12) · link `inline/2xs` (2) · control groups `inline/l` (16) · Navigation `padding/m` (16) · language `inline/s` (8) |
| Container width | `layout/container/wide` (1200) · `layout/container/narrow` (720) |
| Font-size selected pill | fill `overlay/on-brand/pressed` (white @ 16%) · size `ref/size/32` · radius `shape/xs` · plain "A" glyph (no double box) |
| Separators | `Divider` component, `Orientation=Vertical, Tone=Inverse subtle` (fill `border/neutral/inverse-subtle` white @ 40%, width `ref/border-width/hairline`, height `ref/size/20`) |
| Bar height | `layout/bar/height` (46) · Navigation hugs content |
| Frame width (per Device) | `ref/viewport/mobile` (412) · `tablet` (1024) · `desktop` (1440) · `desktop-xl` (1768) |
| Flag | width `layout/flag/width` (33) · height `ref/size/22` (22) — 3:2 emblem chip |

**Tokenisation audit (2026-08-12, re-certified):** **0 hardcoded values** — every fill,
stroke, gap, padding, radius, font-size, line-height, **width, and height** binds to a
variable (135 fills · 81 gaps · 36 paddings · 72 radii · 90 font-sizes · 54 widths ·
54 heights, across 29 tokens). 63 icon glyphs (all Material Symbols); 27 separators
(all Divider instances). Only paint-opacity (the chip's 16% tint) is a raw value —
Figma cannot bind paint opacity to a variable; the colour itself is tokenised.

## Tokens & components added to the library for this build

- **`icon/size/20`** = `ref/size/20` — the bar's 20px icon size (only 24/32/48/64 existed).
- **`layout/container/wide`** = 1200, **`layout/container/narrow`** = 720 — Layout widths.
- **`layout/bar/height`** = 46 — the bar height.
- **`ref/viewport/mobile|tablet|desktop|desktop-xl`** = 412/1024/1440/1768 — Device frame widths.
- **`ref/border-width/hairline`** = 1 — 1px hairline (Divider width).
- **`layout/flag/width`** = 33 — emblem-chip width (height reuses `ref/size/22`).
- **`Divider`** component set (Orientation Vertical/Horizontal × Tone Default/Inverse) —
  the library had no general-purpose divider.

## Accessibility

- White on `#005EB9` = **6.36:1** (passes AA for normal text). *(The brand ink
  `#0373DF` at 4.64:1 was rejected as a fill per the system's filled-surface
  convention — see `design.md` v0.18.0.)*
- All controls keyboard-operable and labelled; focus uses `focus/ring`.
- Skip-to-content is the first interactive element.

## Decisions flagged for the human

1. **Bar colour** → resolved to `bg/brand/primary/bolder` (#005EB9) by the system's
   documented filled-surface convention (not the #0373DF ink).
2. **`Right side options` variant dropped** → replaced by four boolean properties
   (UX4G had both; the variant was redundant).
3. **Contrast/theme toggle removed from the bar** → deferred to the Accessibility
   Widget, per the standing "high-contrast is a widget mechanism" instruction.
4. **Icons = Material Symbols font glyphs** (not per-icon components) → matches the
   code `<Icon>` standard; the Material Symbols page had no icon components.
5. **Mobile** hides the right cluster (matches UX4G); consumers move controls to a menu.

## Superseded

The earlier 45-variant draft (`Device × Layout × Right side options`) is renamed
**"AccessibilityBar — superseded draft"** and kept for reference (deprecate-not-delete).
The Device-only v1 remains as **"AccessibilityBar — v1 (legacy · Device only)"**.
