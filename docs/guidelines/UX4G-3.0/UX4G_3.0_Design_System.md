# UX4G Design System 3.0

> User Experience for Government (UX4G) — a Digital India initiative, National Informatics Centre (NIC) / Ministry of Electronics and Information Technology (MeitY). Published at **https://www.ux4g.gov.in**.

> **Note on fidelity:** UX4G 3.0 has no downloadable specification PDF — it is published as a live website. This file transcribes the guideline content from the official pages listed under [Sources](#sources), captured **12 August 2026**. Token names, values, scales and do/don't lists are reproduced as published. Narrative prose is condensed; the rules themselves are verbatim. Where a page's table is reproduced, it is marked with its source path. The machine-readable token contract lives separately at `packages/tokens/reference/ux4g-3.0.tokens.json` (extracted from UX4G's published stylesheet) — that file, not this one, is what the conformance tooling measures against.

> **Read this with `docs/guidelines/README.md` open.** UX4G's *brand* layer (violet primary) is deliberately **not** adopted by MoSJE; its *structural* layer (type scale, spacing, accessibility, patterns, content rules) is. The README states which is which and why.

---

## Contents

- [0. What UX4G 3.0 is](#0-what-ux4g-30-is)
- [1. Colour system](#1-colour-system)
  - [1.1 Brand colours](#11-brand-colours)
  - [1.2 Semantic colours](#12-semantic-colours)
  - [1.3 Neutral colours](#13-neutral-colours)
  - [1.4 Semantic tokens](#14-semantic-tokens)
  - [1.5 Colour accessibility](#15-colour-accessibility)
- [2. Typography](#2-typography)
  - [2.1 Principles](#21-principles)
  - [2.2 Typefaces](#22-typefaces)
  - [2.3 Type scale](#23-type-scale)
  - [2.4 Font weights](#24-font-weights)
  - [2.5 Usage guidance](#25-usage-guidance)
  - [2.6 Responsive behaviour](#26-responsive-behaviour)
  - [2.7 Typographic accessibility](#27-typographic-accessibility)
  - [2.8 Hindi / Devanagari typography](#28-hindi--devanagari-typography)
  - [2.9 Typography dos and don'ts](#29-typography-dos-and-donts)
- [3. Spacing and layout](#3-spacing-and-layout)
- [4. Elevation and z-index](#4-elevation-and-z-index)
- [5. Iconography](#5-iconography)
- [6. Accessibility guidelines](#6-accessibility-guidelines)
- [7. Content design system](#7-content-design-system)
- [8. Remaining token families](#8-remaining-token-families)
- [9. Component library](#9-component-library)
- [10. UX patterns](#10-ux-patterns)
- [Sources](#sources)

---

## 0. What UX4G 3.0 is

UX4G is India's open-source design system for building consistent, accessible digital public services. It ships **77 production-ready components** across React, Angular and Web Components, at **WCAG 2.1 AA**. It is free for government departments and their websites.

UX4G states that teams adopting it inherit **DPDP Act 2023** consent flows, **Right to Service Act** SLA accountability, **GIGW 3.0** accessibility standards and **DARPG** grievance guidelines.

| Item | Value |
| --- | --- |
| Publisher | NIC / MeitY, Government of India (Digital India initiative) |
| Version | Design System 3.0 |
| Home | https://www.ux4g.gov.in |
| Developer docs | https://doc.ux4g.gov.in (Webcore `/web`, Fluttercore `/flutter`) |
| Audit tool | https://audit360.ux4g.gov.in |
| npm package | `ux4g-web-components` (**not installed by MoSJE** — see `docs/ux4g/UX4G-Code-Readiness-Audit.md`) |
| Token prefix | `--ux4g-*` |
| Accessibility target | WCAG 2.1 AA + GIGW 3.0 + RPwD Act 2016 |

**Site structure** (`/designsystem/documentation`):

- **Get Started** — `/get-started`, `/get-started/about-ux4g`, `/get-started/for-designers`, `/get-started/for-developers`
- **Foundations** — Color, Typography, Spacing & Layout, Elevation, Iconography, Design Tokens, Accessibility Guidelines, Content Design System
- **Components** — `/components`
- **Patterns** — `/patterns`
- **Resources** — Accessibility Widget, UX Self Health Check, UX Handbook, Government Logos, FAQ, Webpage Templates
- **Community** — Events, Case Studies, Design Resources

---

## 1. Colour system

> Source: `/foundations/color`

UX4G states its palette is "rooted in India's national identity — Brand Purple, Saffron, and Green — extended with a functional gray scale and semantic tokens for consistent, accessible interfaces."

Each family is a full **50 → 950** ramp.

### 1.1 Brand colours

**Primary** — core brand violet; headers, primary actions, focus.

| Shade | Hex | | Shade | Hex |
| --- | --- | --- | --- | --- |
| 50 | `#f2efff` | | 500 | `#6a4eff` |
| 100 | `#dcd4ff` | | 600 | `#4a2bc2` |
| 200 | `#c0b3ff` | | 700 | `#3d239f` |
| 300 | `#a391ff` | | 800 | `#301c7d` |
| 400 | `#8670ff` | | 900 | `#24145c` |
| | | | 950 | `#1a0e3d` |

**Secondary** — warm amber; secondary accents and highlights.

| Shade | Hex | | Shade | Hex |
| --- | --- | --- | --- | --- |
| 50 | `#fff5ea` | | 500 | `#c47d00` |
| 100 | `#ffebd6` | | 600 | `#a46800` |
| 200 | `#ffd9af` | | 700 | `#764a00` |
| 300 | `#ffbe6f` | | 800 | `#4b2d00` |
| 400 | `#e89c30` | | 900 | `#281600` |
| | | | 950 | `#110700` |

**Tertiary** — soft purple; supporting brand accent.

| Shade | Hex | | Shade | Hex |
| --- | --- | --- | --- | --- |
| 50 | `#f6effb` | | 500 | `#a66acc` |
| 100 | `#e9daf3` | | 600 | `#8e55b3` |
| 200 | `#d9bfea` | | 700 | `#75419a` |
| 300 | `#c8a3e0` | | 800 | `#5d2f80` |
| 400 | `#b686d6` | | 900 | `#462166` |
| | | | 950 | `#32174a` |

### 1.2 Semantic colours

"Semantic color families represent common interface states, such as Green for success, Red for error and danger, Orange for warning, and Cyan/Blue for information."

| Shade | Green (success) | Red (error/danger) | Orange (warning) | Cyan (information) | Blue (accent/links) |
| --- | --- | --- | --- | --- | --- |
| 50 | `#f2fcef` | `#fff8f8` | `#fff7e6` | `#e6fffb` | `#f5faff` |
| 100 | `#ddf8d8` | `#ffecee` | `#ffe7bf` | `#c9f7f2` | `#e7f2ff` |
| 200 | `#beefbb` | `#ffdadc` | `#ffd899` | `#adf0e9` | `#d0e4ff` |
| 300 | `#80da88` | `#ffb3ae` | `#ffc973` | `#91e8e0` | `#a1c9ff` |
| 400 | `#44c265` | `#ff8983` | `#ffba4d` | `#75e0d7` | `#76acff` |
| 500 | `#1aa64a` | `#f55e57` | `#ffab27` | `#59d8ce` | `#4e8ff8` |
| 600 | `#128937` | `#db372d` | `#fa8c16` | `#13c2c2` | `#3271ea` |
| 700 | `#006c35` | `#b3251e` | `#d46b08` | `#08979c` | `#1157ce` |
| 800 | `#00522c` | `#8a1a16` | `#ad4e00` | `#006d75` | `#04409f` |
| 900 | `#00381f` | `#60150f` | `#873800` | `#00474f` | `#012c6f` |
| 950 | `#002110` | `#3a0907` | `#612500` | `#002329` | `#001944` |

### 1.3 Neutral colours

"From pure white to pure black — the backbone of surfaces, text, and borders across both light and dark themes."

| Step | Hex | | Step | Hex |
| --- | --- | --- | --- | --- |
| 0 · White | `#ffffff` | | 500 | `#737373` |
| 50 | `#fafafa` | | 600 | `#525252` |
| 100 | `#f5f5f5` | | 700 | `#404040` |
| 200 | `#e5e5e5` | | 800 | `#262626` |
| 300 | `#d9d9d9` | | 900 | `#171717` |
| 400 | `#a1a1a1` | | 950 | `#0a0a0a` |
| | | | 1000 · Black | `#000000` |

### 1.4 Semantic tokens

"Purpose-driven color assignments that adapt between light and dark themes."

**Text — neutral**

| Token | Resolves to | Value |
| --- | --- | --- |
| `--ux4g-text-neutral-primary` | `--ux4g-color-neutral-900` | `#171717` |
| `--ux4g-text-neutral-secondary` | `--ux4g-color-neutral-700` | `#404040` |
| `--ux4g-text-neutral-tertiary` | `--ux4g-color-neutral-500` | `#737373` |
| `--ux4g-text-neutral-inverse` | `--ux4g-color-neutral-50` | `#fafafa` |
| `--ux4g-text-neutral-disabled` | — | `rgba(23, 23, 23, 0.25)` |
| `--ux4g-text-neutral-emphasis` | `--ux4g-color-neutral-300` | `#d9d9d9` |
| `--ux4g-text-white` | `--ux4g-color-neutral-0` | `#ffffff` |
| `--ux4g-text-black` | `--ux4g-color-neutral-1000` | `#000000` |

**Text — brand**

| Token | Resolves to | Value |
| --- | --- | --- |
| `--ux4g-text-brand-primary-default` | `--ux4g-color-primary-600` | `#4a2bc2` |
| `--ux4g-text-brand-secondary-default` | `--ux4g-color-secondary-600` | `#a46800` |
| `--ux4g-text-brand-tertiary-default` | `--ux4g-color-tertiary-600` | `#8e55b3` |

**Text — status**

| Token | Resolves to | Value |
| --- | --- | --- |
| `--ux4g-text-status-success` | `--ux4g-color-green-800` | `#00522c` |
| `--ux4g-text-status-error` | `--ux4g-color-red-800` | `#8a1a16` |
| `--ux4g-text-status-warning` | `--ux4g-color-orange-800` | `#ad4e00` |
| `--ux4g-text-status-info` | `--ux4g-color-cyan-800` | `#006d75` |
| `--ux4g-text-success-default` | `--ux4g-color-green-600` | `#128937` |
| `--ux4g-text-error-default` | `--ux4g-color-red-600` | `#db372d` |
| `--ux4g-text-warning-default` | `--ux4g-color-orange-600` | `#fa8c16` |
| `--ux4g-text-info-default` | `--ux4g-color-cyan-600` | `#13c2c2` |

**Text — links**

| Token | Resolves to | Value |
| --- | --- | --- |
| `--ux4g-text-link-default-default` | `--ux4g-color-primary-600` | `#4a2bc2` |
| `--ux4g-text-link-default-hover` | `--ux4g-color-primary-700` | `#3d239f` |
| `--ux4g-text-link-default-active` | `--ux4g-color-primary-800` | `#301c7d` |
| `--ux4g-text-link-default-visited` | `--ux4g-color-primary-800` | `#301c7d` |
| `--ux4g-text-link-default-inverse` | `--ux4g-color-primary-200` | `#c0b3ff` |
| `--ux4g-text-link-default-disabled` | `--ux4g-color-primary-400` | `#8670ff` |
| `--ux4g-text-link-neutral-default` | `--ux4g-color-neutral-600` | `#525252` |
| `--ux4g-text-link-neutral-hover` | `--ux4g-color-neutral-700` | `#404040` |
| `--ux4g-text-link-neutral-active` | `--ux4g-color-neutral-800` | `#262626` |
| `--ux4g-text-link-neutral-visited` | `--ux4g-color-neutral-800` | `#262626` |
| `--ux4g-text-link-neutral-inverse` | `--ux4g-color-neutral-200` | `#e5e5e5` |
| `--ux4g-text-link-neutral-disabled` | `--ux4g-color-neutral-400` | `#a1a1a1` |
| `--ux4g-text-link-visited-default` | `--ux4g-color-primary-600` | `#4a2bc2` |
| `--ux4g-text-link-visited-hover` | `--ux4g-color-primary-700` | `#3d239f` |
| `--ux4g-text-link-visited-active` | `--ux4g-color-primary-800` | `#301c7d` |
| `--ux4g-text-link-visited-inverse` | `--ux4g-color-neutral-200` | `#e5e5e5` |

**Icon colours**

| Token | Resolves to | Value |
| --- | --- | --- |
| `--ux4g-icon-status-error` | `--ux4g-color-red-600` | `#db372d` |
| `--ux4g-icon-status-success` | `--ux4g-color-green-600` | `#128937` |
| `--ux4g-icon-status-warning` | `--ux4g-color-orange-600` | `#fa8c16` |
| `--ux4g-icon-status-info` | `--ux4g-color-cyan-600` | `#13c2c2` |
| `--ux4g-icon-neutral-inverse` | `--ux4g-color-neutral-50` | `#fafafa` |

**Background — neutral**

| Token | Resolves to | Value |
| --- | --- | --- |
| `--ux4g-bg-neutral-elevated` | `--ux4g-color-neutral-0` | `#ffffff` |
| `--ux4g-bg-neutral` | `--ux4g-color-neutral-50` | `#fafafa` |
| `--ux4g-bg-neutral-soft` | `--ux4g-color-neutral-100` | `#f5f5f5` |
| `--ux4g-bg-neutral-subtle` | `--ux4g-color-neutral-200` | `#e5e5e5` |
| `--ux4g-bg-neutral-emphasis` | `--ux4g-color-neutral-300` | `#d9d9d9` |
| `--ux4g-bg-neutral-strong` | `--ux4g-color-neutral-600` | `#525252` |
| `--ux4g-bg-neutral-stronger` | `--ux4g-color-neutral-900` | `#171717` |
| `--ux4g-bg-neutral-disabled` | `--ux4g-color-neutral-200` | `#e5e5e5` |
| `--ux4g-control-bg-default` | `--ux4g-color-neutral-50` | `#fafafa` |
| `--ux4g-bg-overlay` | — | `rgba(23, 23, 23, 0.70)` |

**Background — brand**

| Token | Resolves to | Value |
| --- | --- | --- |
| `--ux4g-bg-primary` | `--ux4g-color-primary-50` | `#f2efff` |
| `--ux4g-bg-primary-soft` | `--ux4g-color-primary-100` | `#dcd4ff` |
| `--ux4g-bg-primary-subtle` | `--ux4g-color-primary-200` | `#c0b3ff` |
| `--ux4g-bg-primary-emphasis` | `--ux4g-color-primary-300` | `#a391ff` |
| `--ux4g-bg-primary-strong` | `--ux4g-color-primary-600` | `#4a2bc2` |
| `--ux4g-bg-primary-strong-hover` | `--ux4g-color-primary-700` | `#3d239f` |
| `--ux4g-bg-primary-stronger` | `--ux4g-color-primary-800` | `#301c7d` |
| `--ux4g-bg-primary-stronger-hover` | `--ux4g-color-primary-900` | `#24145c` |
| `--ux4g-bg-secondary` | `--ux4g-color-secondary-50` | `#fff5ea` |
| `--ux4g-bg-secondary-soft` | `--ux4g-color-secondary-100` | `#ffebd6` |
| `--ux4g-bg-secondary-subtle` | `--ux4g-color-secondary-200` | `#ffd9af` |
| `--ux4g-bg-secondary-emphasis` | `--ux4g-color-secondary-300` | `#ffbe6f` |
| `--ux4g-bg-secondary-strong` | `--ux4g-color-secondary-600` | `#a46800` |
| `--ux4g-bg-tertiary` | `--ux4g-color-tertiary-50` | `#f6effb` |
| `--ux4g-bg-tertiary-soft` | `--ux4g-color-tertiary-100` | `#e9daf3` |
| `--ux4g-bg-tertiary-subtle` | `--ux4g-color-tertiary-200` | `#d9bfea` |
| `--ux4g-bg-tertiary-emphasis` | `--ux4g-color-tertiary-300` | `#c8a3e0` |
| `--ux4g-bg-tertiary-strong` | `--ux4g-color-tertiary-600` | `#8e55b3` |

**Background — status**

| Token | Resolves to | Value |
| --- | --- | --- |
| `--ux4g-bg-success` | `--ux4g-color-green-50` | `#f2fcef` |
| `--ux4g-bg-success-soft` | `--ux4g-color-green-100` | `#ddf8d8` |
| `--ux4g-bg-success-subtle` | `--ux4g-color-green-200` | `#beefb8` |
| `--ux4g-bg-success-emphasis` | `--ux4g-color-green-300` | `#80da88` |
| `--ux4g-bg-success-strong` | `--ux4g-color-green-600` | `#128937` |
| `--ux4g-bg-error` | `--ux4g-color-red-50` | `#fff8f8` |
| `--ux4g-bg-error-soft` | `--ux4g-color-red-100` | `#ffecee` |
| `--ux4g-bg-error-subtle` | `--ux4g-color-red-200` | `#ffdadc` |
| `--ux4g-bg-error-emphasis` | `--ux4g-color-red-300` | `#ffb3ae` |
| `--ux4g-bg-error-strong` | `--ux4g-color-red-600` | `#db372d` |
| `--ux4g-bg-error-strong-hover` | `--ux4g-color-red-700` | `#b3251e` |
| `--ux4g-bg-error-stronger` | `--ux4g-color-red-800` | `#8a1a16` |
| `--ux4g-bg-warning` | `--ux4g-color-orange-50` | `#fff7e6` |
| `--ux4g-bg-warning-soft` | `--ux4g-color-orange-100` | `#ffe7bf` |
| `--ux4g-bg-warning-subtle` | `--ux4g-color-orange-200` | `#ffd899` |
| `--ux4g-bg-warning-emphasis` | `--ux4g-color-orange-300` | `#ffc973` |
| `--ux4g-bg-warning-strong` | `--ux4g-color-orange-600` | `#fa8c16` |
| `--ux4g-bg-info` | `--ux4g-color-cyan-50` | `#e6fffb` |
| `--ux4g-bg-info-soft` | `--ux4g-color-cyan-100` | `#c9f7f2` |
| `--ux4g-bg-info-subtle` | `--ux4g-color-cyan-200` | `#adf0e9` |
| `--ux4g-bg-info-emphasis` | `--ux4g-color-cyan-300` | `#91e8e0` |
| `--ux4g-bg-info-strong` | `--ux4g-color-cyan-600` | `#13c2c2` |
| `--ux4g-bg-yellow-strong` | `--ux4g-color-yellow-600` | `#fadb14` |

**Border colours** — see [§8](#8-remaining-token-families) for widths.

| Token | Resolves to | Value |
| --- | --- | --- |
| `--ux4g-border-color-neutral-default` | `--ux4g-color-neutral-300` | `#d9d9d9` |
| `--ux4g-border-color-neutral-subtle` | `--ux4g-color-neutral-200` | `#e5e5e5` |
| `--ux4g-border-color-neutral-strong` | `--ux4g-color-neutral-500` | `#737373` |
| `--ux4g-border-color-neutral-focus` | `--ux4g-color-neutral-600` | `#525252` |
| `--ux4g-border-color-neutral-hover` | `--ux4g-color-neutral-300` | `#d9d9d9` |
| `--ux4g-border-color-neutral-active` | `--ux4g-color-neutral-400` | `#a1a1a1` |
| `--ux4g-border-color-neutral-elevated` | `--ux4g-color-neutral-0` | `#ffffff` |
| `--ux4g-control-border-default` | `--ux4g-color-neutral-200` | `#e5e5e5` |
| `--ux4g-border-color-success-default` | `--ux4g-color-green-300` | `#80da88` |
| `--ux4g-border-color-success-strong` | `--ux4g-color-green-600` | `#128937` |
| `--ux4g-border-color-info-default` | `--ux4g-color-cyan-300` | `#91e8e0` |
| `--ux4g-border-color-info-strong` | `--ux4g-color-cyan-600` | `#13c2c2` |
| `--ux4g-border-color-error-default` | `--ux4g-color-red-300` | `#ffb3ae` |
| `--ux4g-border-color-error-strong` | `--ux4g-color-red-600` | `#db372d` |
| `--ux4g-border-color-warning-default` | `--ux4g-color-orange-300` | `#ffc973` |
| `--ux4g-border-color-warning-strong` | `--ux4g-color-orange-600` | `#fa8c16` |
| `--ux4g-border-color-primary-default` | `--ux4g-color-primary-300` | `#a391ff` |
| `--ux4g-border-color-primary-strong` | `--ux4g-color-primary-600` | `#4a2bc2` |
| `--ux4g-border-color-primary-hover` | `--ux4g-color-primary-700` | `#3d239f` |
| `--ux4g-border-color-primary-active` | `--ux4g-color-primary-800` | `#301c7d` |
| `--ux4g-border-color-secondary-default` | `--ux4g-color-secondary-300` | `#ffbe6f` |
| `--ux4g-border-color-tertiary-default` | `--ux4g-color-tertiary-300` | `#c8a3e0` |

> The published page also lists `--ux4x-icon-border-desabled: rgba(229, 229, 229, 1)` — reproduced here only to record that the typo (`ux4x`, `desabled`) is UX4G's, not ours. Do not mirror it.

### 1.5 Colour accessibility

"All color combinations must meet WCAG 2.1 AA contrast requirements."

**Do**
- Use Purple (`#4a2bc2`) on white for body text — 16.75:1 ratio
- Use semantic tokens instead of raw hex values
- Test with colour blindness simulators
- Ensure 4.5:1 minimum for normal text, 3:1 for large text

**Don't**
- Don't use colour alone to convey meaning
- Don't use light gray text on white backgrounds
- Don't override semantic tokens with hardcoded values
- Don't use Saffron for body text (insufficient contrast)

---

## 2. Typography

> Source: `/foundations/typography`

"Typography establishes hierarchy and trust. In government services, clarity is not optional — every citizen, regardless of literacy level, device or connectivity, must be able to read and act on what they see."

### 2.1 Principles

1. **Optimise for readability.** "Every size, weight and line-height decision serves the reader first. Decorative or arbitrary type choices undermine trust in government interfaces."
2. **Communicate hierarchy clearly.** "Use the type scale to signal importance — not color alone. Any UX4G screen should be scannable; the user should know what to read first."
3. **Accessible for everyone.** "UX4G serves citizens across all literacy levels, device types and network conditions. Type decisions meet WCAG 2.1 AA and GIGW 3.0 minimum sizes."

### 2.2 Typefaces

Two families, both covering Hindi and English.

| Family | Role | Token | Weights |
| --- | --- | --- | --- |
| **Noto Sans** | UI typeface — all product interfaces | `--ux4g-font-family-base` | Regular 400 · Medium 500 · Semibold 600 · Bold 700 |
| **Noto Sans Display** | Display styles only (36px+) | `--ux4g-font-family-display` | Semibold 600 · Bold 700 |

```css
/* Base — all UI text */
font-family: "Noto Sans", system-ui, sans-serif;

/* Display — large editorial headings only */
font-family: "Noto Sans Display", "Noto Sans", sans-serif;
```

"Noto" stands for "No Tofu" — the blank boxes (□) shown when a font lacks a character. The `system-ui` fallback "ensures users see a native system font (SF Pro on iOS/macOS, Segoe UI on Windows) rather than a browser default — critical for government services accessed on low-bandwidth or rural networks."

> UX4G notes on this page: *"Type scale mirrors the Figma spec; heading font family is under review."*

### 2.3 Type scale

Five categories. Within each style, **Default** uses the lighter weight and **Strong** the heavier one — "Use Strong to add emphasis within a size — do not jump to a larger size for emphasis."

**Display** (Noto Sans Display)

| Style | Class | Size | Line height | Weight | Use |
| --- | --- | --- | --- | --- | --- |
| Display/L | `.ux4g-display-l-default` | 60px / 3.75rem | 80px / 5rem | Semibold | Hero banners — exceptional, full-page landing only |
| Display/M | `.ux4g-display-m-default` | 52px / 3.25rem | 72px / 4.5rem | Semibold | Large campaign or section hero headings |
| Display/S | `.ux4g-display-s-default` | 40px / 2.5rem | 52px / 3.25rem | Semibold | Section title on a dashboard landing |
| Display/XS | `.ux4g-display-xs-default` | 36px / 2.25rem | 44px / 2.75rem | Semibold | Section-level hero in compact layouts |

**Heading** (Noto Sans)

| Style | Class | Size | Line height | Weight | Element | Use |
| --- | --- | --- | --- | --- | --- | --- |
| Heading/XXL | `.ux4g-heading-xxl-default` | 40px / 2.5rem | 44px / 2.75rem | Semibold | `<h1>` | Top-level page title (form, dashboard, landing) |
| Heading/XL | `.ux4g-heading-xl-default` | 32px / 2rem | 36px / 2.25rem | Semibold | `<h1–h2>` | Primary section heading |
| Heading/L | `.ux4g-heading-l-default` | 28px / 1.75rem | 32px / 2rem | Semibold | `<h2>` | Secondary section heading |
| Heading/M | `.ux4g-heading-m-default` | 24px / 1.5rem | 28px / 1.75rem | Semibold | `<h3>` | Card title, panel heading |
| Heading/S | `.ux4g-heading-s-default` | 20px / 1.25rem | 24px / 1.5rem | Semibold | `<h4>` | Sub-section heading |
| Heading/XS | `.ux4g-heading-xs-default` | 16px / 1rem | 20px / 1.25rem | Semibold | `<h5>` | Small heading, grouped fields title |
| Heading/XXS | `.ux4g-heading-xxs-default` | 14px / 0.875rem | 16px / 1rem | Semibold | `<h6>` | Smallest heading — sidebar label, data table column header |

**Title** (Noto Sans)

| Style | Class | Size | Line height | Weight | Use |
| --- | --- | --- | --- | --- | --- |
| Title/L | `.ux4g-title-l-default` | 24px / 1.5rem | 28px / 1.75rem | Semibold | Component title in a card or modal |
| Title/M | `.ux4g-title-m-default` | 20px / 1.25rem | 24px / 1.5rem | Semibold | Form section title |
| Title/S | `.ux4g-title-s-default` | 16px / 1rem | 20px / 1.25rem | Semibold | Small label-weight title, button group heading |

**Body** (Noto Sans)

| Style | Class | Size | Line height | Weight | Use |
| --- | --- | --- | --- | --- | --- |
| Body/L | `.ux4g-body-l-default` | 18px / 1.125rem | 24px / 1.5rem | Regular | Long-form instructions, multi-paragraph content |
| Body/M | `.ux4g-body-m-default` | 16px / 1rem | 24px / 1.5rem | Regular | Default body text for most UI |
| Body/S | `.ux4g-body-s-default` | 14px / 0.875rem | 20px / 1.25rem | Regular | Helper text, secondary descriptions |
| Body/XS | `.ux4g-body-xs-default` | 12px / 0.75rem | 16px / 1rem | Regular | Captions, legal text, timestamps — minimum usable size |

**Label** (Noto Sans)

| Style | Class | Size | Line height | Weight | Use |
| --- | --- | --- | --- | --- | --- |
| Label/XL | `.ux4g-label-xl-default` | 16px / 1rem | 20px / 1.25rem | Medium | Form field labels (default) |
| Label/L | `.ux4g-label-l-default` | 14px / 0.875rem | 18px / 1.125rem | Medium | Secondary labels, table column headers |
| Label/M | `.ux4g-label-m-default` | 12px / 0.75rem | 16px / 1rem | Medium | Badge text, chip labels, tag text |
| Label/S | `.ux4g-label-s-default` | 11px / 0.688rem | 14px / 0.875rem | Medium | Micro labels — status tags, compact data; use sparingly |

### 2.4 Font weights

"Four weights. Use them sparingly — visual emphasis only works if it's rare."

| Weight | Value | Use |
| --- | --- | --- |
| Regular | 400 | Body text, descriptions, form labels |
| Medium | 500 | Labels, UI controls, navigation items |
| Semibold | 600 | Sub-headings, emphasis, navigation |
| Bold | 700 | Headings, page titles, CTAs |

"Avoid Bold for long text. Bold draws the eye — if everything is bold, nothing is. Reserve it for short headings, primary actions and moments of critical importance."

### 2.5 Usage guidance

| If you need… | Use this |
| --- | --- |
| Page or screen title (main h1) | Heading/XXL · Heading/XL |
| Section heading (primary division) | Heading/L · Heading/M |
| Card or panel title | Heading/M · Title/L |
| Form section title | Title/M |
| Form field label | Label/XL · Label/L |
| Default body / paragraph text | Body/M Default |
| Instructions / longer copy | Body/L Default |
| Helper text below an input | Body/S Default |
| Caption, timestamp, legal text | Body/XS Default |
| Button label | Label/XL Strong |
| Badge, chip or tag text | Label/M · Label/S Strong |
| Navigation item | Label/XL Default |
| Data table column header | Heading/XXS · Label/L |
| Large display / campaign hero | Display/S · Display/XS |

### 2.6 Responsive behaviour

"UX4G type tokens are currently fixed at all breakpoints. At small breakpoints (≤576px) and below, reduce Display and large Heading styles to keep mobile legible."

| Style | Desktop | Recommended mobile |
| --- | --- | --- |
| Display/L | 60px | 40px (Display/S) |
| Display/M | 52px | 36px (Display/XS) |
| Display/S | 40px | 36px (Display/XS) |
| Heading/XXL | 40px | 32px (Heading/XL) |
| Heading/XL | 32px | 28px (Heading/L) |
| Heading/L | 28px | 24px (Heading/M) |

"Body, Label and Title styles render well at every breakpoint without adjustment. Token-level responsive scaling is on the UX4G roadmap."

### 2.7 Typographic accessibility

"GIGW 3.0 and WCAG 2.1 AA are mandatory for all Government of India digital services."

| Rule | Why |
| --- | --- |
| Minimum body size 16px (absolute floor 12px) | Smaller text fails AA for many readers |
| Line height ≥ 1.5× the font size for body text | WCAG 1.4.12 — spacing for low-vision readers |
| Don't override letter-spacing into unreadable values | Custom tracking breaks legibility for dyslexic readers |
| Text resizes to 200% without loss of content | WCAG 1.4.4 — browser zoom must work |

**Heading level rules**
- Use only one `<h1>` per page — typically the page title.
- Use heading levels in descending order. Don't skip (no h2 → h4).
- Use headings for structure, not visual appearance. For a heading look without semantic meaning, use a Title or Label style.

**Why rem units?** "UX4G type tokens use rem for font-size and line-height. 1rem = 16px at browser default. Unlike pixels, rem resizes when a user increases their browser's default font size — critical for low-vision users who rely on browser zoom."

**Line length.** "Aim for 50–90 characters per line, including spaces." Optimal container: `max-width: 720px`.

### 2.8 Hindi / Devanagari typography

"Hindi script requires additional line-height and careful font selection for readability."

- Devanagari **line-height: 1.8** (increased for ascenders/descenders).

### 2.9 Typography dos and don'ts

**Dos**
- Use Heading/2XL for the single `h1` page title
- Use heading levels in order (h1 → h2 → h3)
- Use Body/M Default as the default reading text
- Use Label/XL for form field labels
- Use the Strong variant for emphasis within a size
- Use rem-based sizes — let browser zoom work
- Use Display styles only for large hero contexts

**Don'ts**
- Use multiple `h1`s on one page
- Skip heading levels for visual effect
- Use sizes smaller than 12px for any text
- Use Heading/XS as a form label (wrong semantic role)
- Increase font size to add emphasis
- Hard-code px values that block user zoom
- Use Display for body content or normal page headings

---

## 3. Spacing and layout

> Source: `/foundations/spacing`

"A base-4 spacing scale and responsive grid used across every component." The scale is a 4px rhythm with 2px fine steps.

| Token | Pixels | Rem | | Token | Pixels | Rem |
| --- | --- | --- | --- | --- | --- | --- |
| `--ux4g-space-none` | 0px | 0rem | | `--ux4g-space-8` | 24px | 1.5rem |
| `--ux4g-space-1` | 2px | 0.125rem | | `--ux4g-space-9` | 32px | 2rem |
| `--ux4g-space-2` | 4px | 0.25rem | | `--ux4g-space-10` | 40px | 2.5rem |
| `--ux4g-space-3` | 6px | 0.375rem | | `--ux4g-space-11` | 48px | 3rem |
| `--ux4g-space-4` | 8px | 0.5rem | | `--ux4g-space-12` | 56px | 3.5rem |
| `--ux4g-space-5` | 12px | 0.75rem | | `--ux4g-space-13` | 64px | 4rem |
| `--ux4g-space-6` | 16px | 1rem | | `--ux4g-space-14` | 80px | 5rem |
| `--ux4g-space-7` | 20px | 1.25rem | | `--ux4g-space-15` | 120px | 7.5rem |

**Semantic spacing roles**

| Role | Scale |
| --- | --- |
| **Inline** (horizontal gaps) | XXS 2px · XS 4px · S 8px · M 12px · L 16px |
| **Stack** (vertical gaps) | XXS 4px · XS 8px · S 12px · M 16px · L 24px |
| **Padding** (inner space) | XXS 4px · XS 8px · S 12px · M 16px · L 20px · XL 24px · XXL 32px |
| **Section** (page section gaps) | XS 24px · S 32px · M 48px · XL 64px · XXL 80px |

**Corner radius** — None 0px · Small 4px · Medium 8px · Large 12px · Full (circular). Full token list in [§8](#8-remaining-token-families).

**Grid and layout**

- **12-column responsive grid**, adapting mobile → desktop XL.
- **Max content width:** 1200px desktop, 1320px desktop XL.
- **Body text limit:** ~720px (65–75 characters per line).
- **Touch targets:** minimum **44×44px** on mobile, with **8px** spacing between interactive elements.
- Default density is optimised for accessibility and readability.

---

## 4. Elevation and z-index

> Source: `/foundations/elevation`

"Shadow levels that communicate hierarchy, depth, and focus." Five levels (0–4), each combining a key and an ambient shadow.

| Level | Purpose | Key shadow | Ambient shadow | Token |
| --- | --- | --- | --- | --- |
| 0 | Flat surfaces, disabled states | none | none | `none` |
| 1 | Cards at rest | Y 1, Blur 2 | Y 1, Blur 2 | `var(--ux4g-shadow-l1)` |
| 2 | Raised cards, dropdowns | Y 4, Blur 8 | Y 1, Blur 2 | `var(--ux4g-shadow-l2)` |
| 3 | Popovers, menus | Y 8, Blur 16 | Y 4, Blur 8 | `var(--ux4g-shadow-l3)` |
| 4 | Modals, dialogs | Y 16, Blur 32 | Y 8, Blur 16 | `var(--ux4g-shadow-l4)` |

**Z-index scale** — "A fixed stacking order prevents layering conflicts."

| Value | Token | Use |
| --- | --- | --- |
| 1000 | `dropdown` | Dropdown menus, select panels |
| 1020 | `sticky` | Sticky headers, fixed navbars |
| 1030 | `fixed` | Fixed positioning elements |
| 1040 | `offcanvas` | Offcanvas menus |
| 1050 | `modal-backdrop` | Modal backdrops |
| 1060 | `modal` | Modal dialogs, lightboxes |
| 1070 | `popover` | Popovers |
| 1080 | `tooltip` | Tooltips |
| 1090 | `toast` | Toast notifications |

**Do** — "Use Level 1 for resting cards to separate them from the background"; "Raise to Level 2 on hover/focus for interactive elements."

**Don't** — skip layers, apply Level 4 to inline elements, or use arbitrary z-index values outside the defined scale.

**Dark mode** — shadows switch to light-tinted RGBA values and should pair with subtle borders for definition.

---

## 5. Iconography

> Source: `/foundations/iconography`

UX4G standardises on **Material Design Icons (Material Symbols)** — "visual consistency, universal recognition, and accessibility compliance." 2,500+ icons, 4 style variants, WCAG AA compliant, variable font with optical sizing.

**Default configuration**

| Axis | Value |
| --- | --- |
| Font family | Material Symbols Outlined |
| Weight | 400 (regular) |
| Optical size | 24px (auto-adjusts) |
| Grade | 0 (standard contrast) |
| Fill | 0 (outlined); set to 1 for active states only |

**Style variants**

| Variant | Purpose | Recommended use |
| --- | --- | --- |
| Outlined | Default, clean stroke-based | Citizen-facing services (primary) |
| Rounded | Softer with rounded terminals | Citizen portals, onboarding, help |
| Sharp | Geometric precision | Officer dashboards, data tables |
| Filled | Solid variants for emphasis | Active states, selected items only |

**Sizes** — utility classes `.ux4g-fs-11 · 12 · 14 · 16 (default) · 18 · 20 · 24 · 28 · 32 · 36 · 40 · 52 · 60` (px).

**State colours**

| State | Token | Purpose |
| --- | --- | --- |
| Default | `--ux4g-color-text-primary` | Standard icon colour |
| Hover | `--ux4g-color-text-primary-hover` | Interactive hover |
| Active | `--ux4g-color-primary` | Pressed/active interaction |
| Disabled | `--ux4g-color-text-disabled` | Non-interactive (0.38 opacity) |
| Selected | `--ux4g-color-primary` | Active navigation item |
| Danger | `--ux4g-color-feedback-error` | Destructive actions |
| Success | `--ux4g-color-feedback-success` | Positive confirmation |
| Warning | `--ux4g-color-feedback-warning` | Caution states |
| Info | `--ux4g-color-feedback-info` | Informational context |

**Spacing and touch targets** — minimum interactive size **44×44px** (WCAG 2.5.8); **8px** minimum between targets; add transparent padding around small icons to reach target size.

**Accessibility**

```html
<!-- Decorative icon (paired with text) -->
<button>
  <span class="material-symbols-outlined" aria-hidden="true">download</span>
  Download Certificate
</button>

<!-- Meaningful icon (standalone) -->
<button aria-label="Close dialog">
  <span class="material-symbols-outlined" aria-hidden="true">close</span>
</button>
```

Minimum contrast: light theme `#767676` on white; dark theme `#949494` on dark; high contrast full black/white (3:1 per WCAG 1.4.11). Never use colour alone; pair status icons with text in alerts and badges; avoid icon-only interfaces without text alternatives; test clarity at the smallest implemented size; avoid animations that could trigger vestibular disorders (WCAG 2.2.2).

**Dos** — pair icons with visible text labels for primary actions; use the optical size axis; keep weight 400 consistent; apply semantic colour tokens on parent elements; combine status icons with text in alerts.

**Don'ts** — don't mix outlined and filled variants on the same surface; don't use icons as the sole channel for errors; don't shrink below 12px; don't create custom icons when a Material Symbol exists; don't use decorative styles in government interfaces; don't mix Material Design Icons with other libraries in the same view.

**Figma naming convention** — layer `icon/{material_symbol_name}`; component `Icon / {Category} / {Name}` (e.g. `Icon / Navigation / arrow_back`); variant `Style=Outlined, Size=24`.

---

## 6. Accessibility guidelines

> Source: `/foundations/accessibility`

Aligned with **WCAG 2.1 Level AA** and India's **Rights of Persons with Disabilities Act, 2016**. Organised around the four POUR pillars: **Perceivable · Operable · Understandable · Robust**.

**Colour contrast**

| Target | Minimum |
| --- | --- |
| Normal text | 4.5:1 |
| Large text (18px+) | 3:1 |
| UI components | 3:1 |

Never rely on colour alone to convey information.

**Focus visibility** — 4px ring width, colour `rgba(59, 130, 246, 0.5)`, 2px offset, matching the element's border radius; must maintain 3:1 contrast with adjacent colours.

**Keyboard navigation** — Tab / Shift+Tab to move, Enter to activate, Space for toggles, Arrow keys for component navigation, Esc to close modals.

**Screen reader support** — essential ARIA: `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-live`, `aria-expanded`, `aria-hidden`.

**Semantic HTML** — proper heading hierarchy (h1→h6), landmark regions (`<header>`, `<nav>`, `<main>`, `<footer>`), and semantic elements (`<button>`, `<a>`, `<fieldset>`) rather than div-based alternatives.

**Forms and errors** — associated labels; clear required-field indicators; helper text wired with `aria-describedby`; error messages linked to inputs via `aria-invalid="true"`; error summaries with links to affected fields.

**Testing** — NVDA, JAWS, VoiceOver and TalkBack; keyboard-only navigation verification; automated tooling (axe DevTools, Lighthouse).

---

## 7. Content design system

> Source: `/foundations/content-system`

Six foundational rules:

1. **Plain language** — write for a Class 8–10 reading level; avoid jargon and acronyms.
2. **Specific and actionable** — provide solutions, not just problem identification.
3. **Concise** — minimum words, maximum clarity.
4. **Positive language** — frame what users *can* do, not restrictions.
5. **Consistent terminology** — identical words for the same concepts everywhere.
6. **Respectful tone** — be empathetic; avoid blame.

**Standardised library** — 50+ field labels (Full Name, Mobile Number, Aadhaar Number, …), 40+ error patterns, 20+ success message templates, 15+ consent templates, 30+ helper-text examples.

**Error message formula** — `[Problem] + [Solution]`. Example: "Enter a valid 10-digit mobile number" — not "Invalid input".

**Consent language** — every template must state what data is collected, why, how it is used, sharing details, and the user's rights, while remaining legally sound and plainly written. **Pre-checked boxes and fine-print terms are prohibited.**

---

## 8. Remaining token families

> Source: `/foundations/tokens`

**Blur**

| Primitive | Value | | Semantic | Resolves to |
| --- | --- | --- | --- | --- |
| `--ux4g-blur-none` | 0px | | `--ux4g-blur-none` | `--ux4g-blur-none` |
| `--ux4g-blur-1` | 2px | | `--ux4g-blur-subtle` | `--ux4g-blur-1` |
| `--ux4g-blur-2` | 4px | | `--ux4g-blur-soft` | `--ux4g-blur-2` |
| `--ux4g-blur-3` | 8px | | `--ux4g-blur-medium` | `--ux4g-blur-3` |
| `--ux4g-blur-4` | 16px | | `--ux4g-blur-strong` | `--ux4g-blur-4` |

**Border widths**

| Primitive | Value | | Semantic | Resolves to |
| --- | --- | --- | --- | --- |
| `--ux4g-border-none` | 0px | | `--ux4g-border-width-none` | `--ux4g-border-none` |
| `--ux4g-border-thin` | 1px | | `--ux4g-border-width-sm` | `--ux4g-border-thin` |
| `--ux4g-border-thick` | 2px | | `--ux4g-border-width-md` | `--ux4g-border-thick` |
| `--ux4g-border-thicker` | 3px | | `--ux4g-border-width-lg` | `--ux4g-border-thicker` |
| `--ux4g-border-thickest` | 4px | | `--ux4g-border-width-xl` | `--ux4g-border-thickest` |

**Radius**

| Primitive | Value | | Semantic | Resolves to |
| --- | --- | --- | --- | --- |
| `--ux4g-radius-0` | 0px | | `--ux4g-radius-none` | `--ux4g-radius-0` |
| `--ux4g-radius-1` | 2px | | `--ux4g-radius-xs` | `--ux4g-radius-1` |
| `--ux4g-radius-2` | 4px | | `--ux4g-radius-sm` | `--ux4g-radius-2` |
| `--ux4g-radius-3` | 8px | | `--ux4g-radius-md` | `--ux4g-radius-3` |
| `--ux4g-radius-4` | 12px | | `--ux4g-radius-lg` | `--ux4g-radius-4` |
| `--ux4g-radius-5` | 16px | | `--ux4g-radius-xl` | `--ux4g-radius-5` |
| `--ux4g-radius-6` | 24px | | `--ux4g-radius-2xl` | `--ux4g-radius-6` |
| `--ux4g-radius-circular` | 999px | | `--ux4g-radius-full` | `--ux4g-radius-circular` |

**Opacity** — primitives `0, 0.05, 0.1, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.7, 0.75, 0.8, 0.9, 0.95, 1` as `--ux4g-opacity-{0…100}`. Semantic: `--ux4g-opacity-disabled` → `--ux4g-opacity-40`; `--ux4g-opacity-hover` → `--ux4g-opacity-80`.

**Typography primitives**

- Sizes: `--ux4g-size-{8,10,11,12,14,16,18,20,24,28,32,36,40,48,52,56,60,64,80,120}` in rem.
- Line heights: `--ux4g-line-height-{14,16,18,20,24,28,32,36,44,52,72,80}` in rem.
- Weights: `--ux4g-font-weight-{regular 400, medium 500, semibold 600, bold 700}`, plus `--ux4g-font-weight-display-{semibold 600, bold 700}`.
- Text align: `--ux4g-text-align-{start left, center, end right}`.
- Text wrap: `--ux4g-text-wrap: wrap`, `--ux4g-text-nowrap: nowrap`, `--ux4g-word-break: break-word`.
- Semantic aliases: `--ux4g-fs-*`, `--ux4g-lh-*`, `--ux4g-fw-*`, `--ux4g-ff`, `--ux4g-ff-display`, `--ux4g-ta-*`, `--ux4g-tt-*`, `--ux4g-tw-*`, `--ux4g-wb-break`.

**Text transform** — `none · lowercase · uppercase · capitalize`, aliased as `--ux4g-text-case-{default, lower, upper, capitalize}`.

**Vertical align** — `baseline · top · middle · bottom · text-top · text-bottom`, aliased as `--ux4g-va-*`.

**Visibility** — `--ux4g-visibility-show` → `visible`; `--ux4g-visibility-hide` → `hidden`.

**Position** — `static · relative · absolute · fixed · sticky` primitives plus a position-value set (`0`, `50%`, `100%`), translate helpers (`translate(-50%, -50%)`, `translateX(-50%)`, `translateY(-50%)`) and pixel offsets `0…5` and `-1…-5`, aliased as `--ux4g-pos-*`.

---

## 9. Component library

> Source: `/components` — 77 components in five categories. The overview page publishes counts and category descriptions; individual component names live on each category's own page.

| Category | Count | Description |
| --- | --- | --- |
| Form Elements | 18 | "High-frequency controls for service journeys and authenticated workflows." |
| Feedback | 13 | "Messages, states, and system responses that keep users informed." |
| Data Display | 17 | "Readable presentation surfaces for records, metrics, and evidence." |
| Navigation | 9 | "Structure for movement, discovery, and page-to-page orientation." |
| Others | 2 | Accessibility and identity verification components. |

---

## 10. UX patterns

> Source: `/patterns` — 49 patterns in nine families.

| Family | Count | Description |
| --- | --- | --- |
| **P-01 Identity and Access** | 8 | "Secure onboarding and authentication patterns including sign-in, OTP verification, session management, and Aadhaar authentication." |
| **P-02 Consent and Declaration** | 5 | "Patterns for capturing user consent, data sharing agreements, declarations, and privacy terms in government services." |
| **P-03 Application and Submission** | 7 | "End-to-end application patterns including eligibility checks, form validation, document upload, save & resume, and submission acknowledgement." |
| **P-04 Status and Tracking** | 6 | "Patterns for tracking application status, grievance escalation, timelines, progress steps, and SLA monitoring." |
| **P-05 Payment and Transactions** | 2 | "Secure payment flows, transaction confirmations, failure recovery, and receipt patterns for government services." |
| **P-06 Search and Discovery** | 5 | "Patterns for helping citizens find services, browse results, book consultations, and recover from no-results states." |
| **P-07 Dashboard and My Applications** | 3 | "Citizen-facing dashboard patterns for viewing applications, managing pending tasks, and personalizing preferences." |
| **P-08 Notifications** | 7 | "Notification patterns covering in-app centres, SMS/email templates, proactive updates, reminders, preferences, and multi-channel delivery." |
| **P-09 Feedback and Communication** | 6 | "Patterns for service feedback, support channels, language switching, escalation management, and assisted service flows." |

These nine families map almost one-to-one onto the MoSJE portal estate (SMILE, PM-AJAY, NOS, NMBA, SCW, TG, NHAPOA all run identity → consent → application → status → notification journeys). Treat P-01…P-09 as the checklist when scoping a new portal flow.

---

## Sources

Captured 12 August 2026 from the official UX4G Design System 3.0 site:

| Section | URL |
| --- | --- |
| Documentation / site structure | https://www.ux4g.gov.in/designsystem/documentation |
| Foundations index | https://www.ux4g.gov.in/foundations |
| Colour | https://www.ux4g.gov.in/foundations/color |
| Typography | https://www.ux4g.gov.in/foundations/typography |
| Spacing & Layout | https://www.ux4g.gov.in/foundations/spacing |
| Elevation | https://www.ux4g.gov.in/foundations/elevation |
| Iconography | https://www.ux4g.gov.in/foundations/iconography |
| Design Tokens | https://www.ux4g.gov.in/foundations/tokens |
| Accessibility | https://www.ux4g.gov.in/foundations/accessibility |
| Content Design System | https://www.ux4g.gov.in/foundations/content-system |
| Components | https://www.ux4g.gov.in/components |
| Patterns | https://www.ux4g.gov.in/patterns |
| UX Handbook | https://www.ux4g.gov.in/resources/ux-handbook |
| Developer docs | https://doc.ux4g.gov.in |

**UX4G is a living site.** Re-capture this file when a foundation page changes; the diff is the upgrade surface. The token half of that check is automated — re-run `node tools/ux4g-conformance/extract-ux4g-tokens.mjs` and diff `packages/tokens/reference/ux4g-3.0.tokens.json`.
