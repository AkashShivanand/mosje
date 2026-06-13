# MoSJE Portal DS — Audit vs SAMAVESH (UX4G) Design System

> Compares the **Portal DS** Figma file (`u5eMCdX3a3mMZgnsHNn8XX`, "MoSJE Portal DS") against the **SAMAVESH** system — the UX4G-derived DS (`T3bkN5gNKfaNeY6dpT6FwF`) now living in code as `@mosje/tokens`.
> Method: live Figma MCP extraction of both files' component variant nodes (the resolved `var(--token,#hex)` pairs), diffed against the `@mosje/tokens` contract. Date: 2026-06-13.
> Companion to `figma-ux4g-ds.md` (the SAMAVESH extraction).

---

## TL;DR

**Both files are the same UX4G DS 2.0 system — identical component inventory, identical token taxonomy, identical structural primitives.** The Portal DS is a **re-skin**, not a different system: same scaffolding, different paint.

The single biggest finding: **the Portal DS primary navy ramp IS SAMAVESH's `blue-dark` color mode.** `primary/source #003366`, `primary/600 #002b55`, `primary/100 #c8dbf0`, `primary/800 #001933` match `primaryRamp.dark.{500,600,100,800}` in `packages/tokens/src/primitive.json` **exactly**. The portals are, in brand-axis terms, SAMAVESH running in its dark-blue mode — plus a different grey ramp, muted status colours, and a tighter type scale.

So: **switching SAMAVESH to `data-color-mode="blue-dark"` gets the portals ~70% of the way (the primary blues), but NOT the rest** (greys, status, type scale, focus spread all still differ).

---

## 1. What's COMMON (shared UX4G DNA)

| Dimension | Shared between both |
|---|---|
| **Component inventory** | Identical 16 pages: Buttons, Card, Badges, Alerts/Toasts, Chips, Checkbox, Radio, Search, Toggle, Avatars, Empty State, Loader, Accessibility Bar+Widget, Logos, Icons, Thumbnail. |
| **Token taxonomy** | Same naming model: `primary` + `success` + `danger` + `warning` + `info`; `Stroke/100–400`; `Text/dark·hint·light`; `radius-xs/sm/md`; named type roles (`body-*`, `label-*`, `title-*`, `headline-*`). |
| **Primary ramp definition** | Portal navy `#003366 / #002b55 / #001933 / #c8dbf0` == SAMAVESH `primaryRamp.dark.{500,600,800,100}`. Same ramp. |
| **Radius scale** | `xs 4 · sm 6 · md 8`; 8px default control corner. (Naming of the pill differs — see §2.) |
| **Control sizing** | Button 40px; Search 56px (+40 small); Checkbox/Radio 24px; Toggle 52×32 (39×24 small), handle 24px; Avatars 24/32/40/48px. |
| **Focus pattern** | Primary @ 48% alpha rendered as a spread drop-shadow ring (geometry differs — see §2). |
| **Info handling** | Both alias **Info → Primary** (no distinct info hue in either). |
| **Typeface** | **Noto Sans** everywhere, two roles (heading + body). |
| **Type roles (identical metrics)** | `body-1` 16/24/400 · `body-2` 14/20/400 · `label-1` 14/20/500 · `label-2` 12/16/500 · `label-3` 11/16/500. |

---

## 2. What's UNIQUE to the Portal DS (the deltas)

### 2.1 Colour — the whole palette is re-skinned

| Token | SAMAVESH (UX4G) | Portal DS | Note |
|---|---|---|---|
| **Primary / source** | `#0373df` (gov blue) | `#003366` (navy) | Portal primary = SAMAVESH **blue-dark** ramp |
| Primary / hover | `#014b92` | `#002b55` | |
| Primary / tonal | `#c6dcf9` | `#c8dbf0` | |
| **Success** | `#2e7d32` | `#27682a` | Portal darker / desaturated |
| **Danger** | `#ec5042` | `#d64539` | Portal muted brick red |
| **Warning** | `#ffd323` *(unverified)* | **`#a66a26`** *(resolved)* | **Different** — amber/brown vs bright yellow |
| **Info** | `#0373df` (= blue primary) | `#003366` (= navy primary) | both alias primary, different hue |
| **Text / dark** | `#1f2428` | `#374151` | Portal = Tailwind gray-700 |
| **Text / hint** | `#343a40` | `#6b7280` | Portal = Tailwind gray-500 |
| **Neutral mid** | `#9aa3af` / `#6c757d` | `#9ca3af` / `#4b5563` | Portal = Tailwind gray-400 / gray-600 |
| **Stroke / 100** | `#f1f3f5` | `#f3f4f6` | Portal = Tailwind gray-100 |
| **Stroke / 200** | `#e2e6ea` | `#e5e7eb` | Portal = Tailwind gray-200 |
| **Surface / muted** | `#f8f9fa` | `#f9fafb` | Portal = Tailwind gray-50 |

> **Pattern:** SAMAVESH greys are a custom Bootstrap-ish set; **Portal greys are the literal Tailwind default `gray` scale.** Portal status colours are uniformly darker/more desaturated — a "serious government" palette vs SAMAVESH's brighter public-website palette.

### 2.2 Warning is now known (but doesn't confirm SAMAVESH)
SAMAVESH could not resolve Warning via MCP and currently guesses `#ffd323`. The Portal DS resolves Warning to **`#a66a26`**. These are *different systems' values* — this does **not** validate the SAMAVESH `#ffd323`; it stays unverified.

### 2.3 Structural / type deltas

| Dimension | SAMAVESH | Portal DS |
|---|---|---|
| **Focus ring spread** | 4px, `rgba(3,115,223,0.48)` | **2px**, `rgba(0,51,102,0.48)` |
| **Headline / title size** | headline 20/24/600 · title1 22/28/500 | headline-5 **18**/24/600 · title-2 **18**/24/500 · title-3 16/24 — tighter |
| **body-3** | 12/16 | **13/20** |
| **Letter-spacing** | 0.1–0.5px on most roles | **0** across the board |
| **Spacing scale** | numeric `space.1–14` (4–56px) | named `spacing-xxs/xs/sm/md/lg` (2/4/8/12/16) |
| **Pill radius** | `pill 100px` | `radius-full 999px` (toggle track literal 100) |
| **Variable-font axes** | not declared | `"CTGR" 0, "wdth" 100` on all text |
| **Button vertical padding** | 10px | 8px (10 on outlined/tonal) |

---

## 3. Implications for the codebase

1. **The portals are not "a different DS" — they're SAMAVESH re-skinned.** Reuse the `@mosje/tokens` architecture; do not fork the component set.
2. **Primary blues are already half-solved.** The Portal navy ramp == our existing `primaryRamp.dark` (`blue-dark` mode). A portal theme can lean on the brand-axis machinery already in `primitive.json`.
3. **A `blue-dark` mode switch is NOT sufficient.** Greys (Tailwind scale), status colours (muted), type scale (18px headings, 13px body-3, zero tracking), and focus spread (2px) all differ. A proper **portal token set / color-mode** is needed on top.
4. **Recommended path:** add a `portal` brand layer to `@mosje/tokens` — a new primaryRamp already exists (`dark`), plus a portal grey ramp (Tailwind `gray`), portal status trio (`#27682a / #d64539 / #a66a26`), and portal type overrides. Expose via `data-color-mode="portal"` (or a dedicated portal token build) so smile-admin / pm-ajay / eUtthan consume it without forking components.
5. **Warning/Info:** portals have a real Warning (`#a66a26`) and Info=navy. SAMAVESH Warning remains unverified — resolve separately before relying on it.

---

## 4. Extraction caveats
- Portal **Badges page (`2141:296703`) would not load** (repeated `get_metadata` timeouts); badge values were read from a Badge nested in the Chips component. Full badge variant set not enumerated.
- Portal Warning `#a66a26` resolved via `get_variable_defs` on the Status=Warning toast icon node.
- SAMAVESH Warning/Info never resolved inline (SVG-mask icons); values shown are the current code guesses.
- Both files extracted live via Figma MCP on 2026-06-13; hexes lowercased, 8-digit hex = colour+alpha.
