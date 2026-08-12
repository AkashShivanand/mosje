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
(`narrow`/`wide`/`fluid`), `tone` (`blue`/`navy`), `onFontScaleChange`.
Documented at `/design-system/components/accessibility-bar`, story at
`apps/storybook/stories/AccessibilityBar.stories.tsx`.

> **Not yet wired into `SiteHeader`.** SiteHeader still renders its own Tier-1
> bar with font-size deliberately removed (widget-canonical, per the
> accessibility-consolidation spec). Migrating SiteHeader onto this component —
> and deciding whether the live public masthead should surface font-size — is a
> flagged human decision, and Code Connect mapping (Figma ↔ code) is pending.

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
| Type | `label/2` 12/16 | `--sa-type-label-2-size|-lh` → 12px/16px | ✓ |
| Bar height | `layout/bar/height` 46 | `min-height: 46px` | ✓ |
| Edge padding | `padding/2xl` 32 ≥tablet · `padding/m` 16 mobile | same, via media query | ✓ |
| Vertical padding | `ref/space/xxs` 2 | `--sa-ref-space-xxs` | ✓ |
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
   │     ├─ "Government of India" (Noto Sans Medium, label/2, underlined, text/neutral/inverse)
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
| Text | `text/neutral/inverse` · size/lh `ref/font/role/label/2` (12/16) |
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
