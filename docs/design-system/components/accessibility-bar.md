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
