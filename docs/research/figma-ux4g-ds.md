# MoSJE — UX4G Design System (Figma Extraction)

> Extracted from Figma file **`T3bkN5gNKfaNeY6dpT6FwF`** ("MoSJE – UX4G DS") via the Figma MCP `get_design_context` / `get_metadata`.
> Hex values + variable names are harvested from the resolved Tailwind reference code (the `bg-[var(--token,#hex)]` pairs). This is the authoritative source for porting the UX4G system into `packages/design-system/`.
> Method note: colors come from concrete component variant nodes (not `get_variable_defs`, which needs a live selection). Most foundation tokens were resolved; the few that couldn't be (icon-baked semantic colors) are flagged at the end.

---

## 1. Colors (core palette)

All values are the **resolved hex + the Figma variable name** the component binds to.

### Primary (the main gov blue)
| Token | Hex | Usage |
|-------|-----|-------|
| `primary/source` | **#0373DF** | Primary buttons (filled bg), outlined border + text, text buttons, checkbox fill, toggle track (on), progress bar fill, links, focus ring base |
| `primary/100` | **#C6DCF9** | Primary **Tonal** button bg; selected Chip bg |
| `primary-transparent/48%` | **rgba(3,115,223,0.48)** | Focus ring (`0 0 0 4px`) on focused primary buttons |
| Primary hover | _#0373DF + `shadow-xs`_ | Hover = same fill + drop shadow `0 2 3 1 #2121211F` |
| Primary pressed | _#0373DF @ `opacity-90`_ | Pressed = source color at 90% opacity |
| Primary disabled | _#0373DF @ `opacity-50`_ | Disabled = source color at 50% opacity |

> Note: `primary/source #0373DF` exactly matches the `gov-blue #0373DF` brand token already in `CLAUDE.md`.

### Success (green)
| Token | Hex | Usage |
|-------|-----|-------|
| `success/source` | **#2E7D32** | Success buttons (filled bg), outlined border/text, success text |
| `success/100` | **#C8E6C9** | Success **Tonal** button bg |

Hover/Pressed/Disabled follow the same pattern as Primary (shadow on hover, opacity-90 pressed, opacity-50 disabled).

### Danger / Error (red)
| Token | Hex | Usage |
|-------|-----|-------|
| `danger/source` | **#EC5042** | Danger buttons (filled), Danger badge, notification dot on chips, error/destructive |

### Neutrals / Ink (text)
| Token | Hex | Usage |
|-------|-----|-------|
| `text/dark` | **#1F2428** | Primary body & title text on cards/alerts/chips; tonal-button text |
| `text/ink` (≈) | **#212121** | Heading/breadcrumb text on doc pages; shadow base color `#212121xx` |
| `text/hint` | **#343A40** | Subtitles, search placeholder, secondary text |
| `text/light` | **#FFFFFF** (white) | Text on filled primary/success/danger buttons; toggle handle |
| muted breadcrumb | **#727272** | Inactive breadcrumb segments (doc chrome only) |

### Surface / background
| Token | Hex | Usage |
|-------|-----|-------|
| `neutral/0 — white` | **#FFFFFF** | Card / alert / search surface; toggle handle |
| `neutral/50` | **#F8F9FA** | Progress-bar track background |
| `#F4F3F9` | **#F4F3F9** | Doc-page panel background (component-doc chrome) |

### Borders / stroke
| Token | Hex | Usage |
|-------|-----|-------|
| `stroke/100` | **#F1F3F5** | Light border — card outline, alert border, search border |
| `stroke/200` | **#E2E6EA** | Stronger border — default (unselected) chip outline |

### Effects (shadows / focus) — resolved
| Token | Value | Usage |
|-------|-------|-------|
| `Shadows/shadow-xs` | `0 2 3 1 rgba(33,33,33,0.12)` (#2121211F) | Button hover |
| `Shadows/shadow-lg` | `0 12 16 -4 #21212114` + `0 4 6 -2 #21212108` | Alert / toast elevation |
| `Shadows/shadow-xl` | `0 24 48 -12 #2121212E` | Elevated card (also `0 4 15 0 rgba(0,0,0,0.15)`) |
| `Focus States/Primary - Active Shadow` | `0 0 0 4 rgba(3,115,223,0.48)` | Focused primary control ring |

---

## 2. Typography

Typeface: **Noto Sans** everywhere (two family roles: **Headings** and **Label & Body**). Weights used: Regular 400, Medium 500, SemiBold 600.

> Two numeric "Font Size" token scales exist in the file. The component layer (buttons/labels/badges) resolves `Font Size/2 = 14px`, `/0 = 11px`, `/1 = 12px`, `/3 = 16px`, `/4 = 20px`. The display/heading doc tokens resolve larger (`/5 = 22`, `/10 = 48`, etc.). Treat the size tokens by their **resolved px** below, not the index.

### Named text styles (confirmed/extended)
| Style | Family | Weight | Size | Line-height | Letter-spacing |
|-------|--------|--------|------|-------------|----------------|
| Display / display-5 | Headings | 500 | 48px | 56px | 0 |
| Title / title-1 | Headings | 500 | 22px | 28px | 0 |
| Title / title-2 | Headings | 500 | 16px | 24px | 0.15px |
| Title / title-3 | Headings | 500 | 14px | 20px | 0.1px |
| Headline / headline-5 | Headings | 600 (SemiBold) | 20px | 24px | 0 |
| Body / body-1 | Label & Body | 400 | 16px | 24px | 0.5px |
| Body / body-2 | Label & Body | 400 | 14px | 20px | 0.25px |
| Body / body-3 | Label & Body | 400 | 12px | 16px | 0.4px |
| Label / label-1 | Label & Body | 500 | 14px | 20px | 0.1px |
| Label / label-2 | Label & Body | 500 | 12px | 16px | 0.5px |
| Label / label-3 | Label & Body | 500 | 11px | 16px | 0.5px |

Type scale (px) observed: **11, 12, 14, 16, 20, 22, 24, 40, 48, 56, 80**. Line-heights: 16, 20, 24, 28, 48, 56.
Default ink ≈ **#1F2428 / #212121**.

---

## 3. Spacing / Radius / Sizing

### Radius scale (named tokens, resolved)
| Token | Value |
|-------|-------|
| `radius-none` | 0px |
| `radius-xxs` | 2px |
| `radius-xs` | 4px |
| `radius-sm` | 6px |
| `radius-md` | **8px** (default control radius: buttons, cards, chips, search, alerts, checkbox box) |
| pill | `100px` / `rounded-full` (badges, toggle track, avatar circular, chip selected-check, notification dot) |

### Spacing (from component padding — the de-facto scale)
Observed paddings map to the size tokens: **2, 4, 6, 8, 10, 12, 16, 24, 32, 40, 48, 56, 80** px.
- Button padding: `px-24 py-10` (default & large).
- Card section padding: `16px`.
- Alert/Toast padding: `12px`; body indent `32px`.
- Chip padding: `px-12 py-6`.

### Control heights
| Component | Height |
|-----------|--------|
| Button — Default | **40px** |
| Button — Large | **48px** |
| Button — Small | (smaller; present in matrix) |
| Chip | 32px |
| Toggle — Default | 32px (track 52×32, handle 24px) |
| Toggle — Small | 24px (track 39×24) |
| Search input | **56px** |
| Checkbox / Radio | 24px hit area (18px box for checkbox, `radius-xs` 4px) |
| Avatar sizes | 24 / 32 / 40 / 48 px |

---

## 4. Component inventory (variants & states)

### Button  (component set `609:283111`)
- **Type:** Primary · Success · Danger
- **Sub-type:** Filled · Outlined · Text · Tonal
- **State:** Default · Hover · Pressed · Focused · Disabled
- **Size:** Default (40px) · Large (48px) · Small
- **Icon:** None · Left · Right
- Filled: solid `*/source`, white text. Outlined: `*/source` border + text, transparent bg. Text: `*/source` text only. Tonal: `*/100` bg + `text/dark` text.
- State mechanics: Hover = +`shadow-xs`; Pressed = `opacity-90`; Disabled = `opacity-50`; Focused = 4px focus ring (`rgba(3,115,223,0.48)` for primary).
- Radius 8px, padding `px-24 py-10`, label = Label-1 (Noto Sans Medium 14/20/0.1).

### Card  (`292:72630`)
- **Type:** Vertical · Horizontal
- **Sub-Type:** Outlined · Elevated
- Slots (boolean props): header, headerIcon, image, title, subtitle, body, footer, footerPrimaryButton, footerSecondaryButton.
- Surface white, radius 8px. Outlined = `stroke/100` border. Elevated = `shadow-xl` (`0 4 15 rgba(0,0,0,0.15)`).
- Title = Headline-5 (20/24/600), Subtitle = Body-2 `text/hint`, Body = Body-2 `text/dark`. Footer uses standard outlined + filled primary buttons.

### Badge  (`75:321`)
- **Type:** Small (6px dot) · Large – Single Digit · Large – Multiple Digit · Text
- **State (color):** Primary (#0373DF) · Success (#2E7D32) · Danger (#EC5042)
- Pill radius 100px, white text, Label-3 (11/16/0.5), padding `px-8 py-2`.

### Chip  (`123:28380` default, `123:28471` user)
- **Type:** Default · Default + Dropdown · Default + Leading + Dropdown · User Chip
- **State:** Default · Hover · Pressed (+ Disabled)
- **Selected:** True / False  ·  **Disabled:** True / False
- Default (unselected): `stroke/200` border, `text/dark` label, radius 8px, height 32px. Selected: `primary/100` bg + leading check icon. Optional notification badge (danger dot). User Chip variant carries avatar + label.

### Checkbox  (`15:664`)
- **Type:** Selected · Intermediate · Unselected
- **State:** Enabled · Hover · Pressed · Focused · Disabled
- Selected box = `primary/source` fill, `radius-xs` 4px, 18px, white check; 24px hit area.

### Radio  (`18:791`)
- **Selected:** True / False  ·  **State:** Enabled · Hover · Pressed · Focused · Disabled
- 24px, primary fill when selected.

### Toggle  (`23:599`)
- **Selected:** True / False  ·  **State:** Default · Hover · Press · Focused · Disabled  ·  **Size:** Default · Small
- On = `primary/source` track + white handle, radius 100px. Default track 52×32 (handle 24), Small 39×24.

### Search  (`399:1808`)
- **State:** Default · Hover · Focused · Filled · Disabled
- Optional slots: AI Assistant icon, Voice Search icon (both boolean).
- White bg, `stroke/100` border, radius 8px, height 56px. Placeholder = Body-1 16px `text/hint`. Leading search icon.

### Avatar  (`248:2268`)
- **Shape:** Circular · Rectangular
- **Size:** Small 24px · Medium 32px · Large 40px · X-Large 48px
- **Type:** Initials · Icons · Picture
- **Gender:** Neutral · Male · Female
- Plus an **Indian Personas** library (20+ named fills, e.g. Aarav Sharma, Aanya Kapoor) used as default avatar fills for localized/inclusive UX.

### Alert / Toast  (`2272:12530`)
- **Variant:** Time stamp · Action
- **Status (icon):** Success · Warning · Info · Error · Loading · Upload · Download · Avatar
- **Right content:** Action · Time stamp.  Slots: body, bodyText, close, progressBar, actionButtons.
- White surface, `stroke/100` border, radius 8px, `shadow-lg`. Title = Title-3, body = Body-2, timestamp = Body-3. Progress bar: track `neutral/50`, fill `primary/source`. Inline action buttons are primary text buttons.
- Usage guidance baked into the page: Alerts = critical/blocking; Toasts = non-intrusive, auto-dismiss 3–5s, corner placement, ARIA roles.

### Loader / Spinner  (`443:88127`)
- **Type:** growing · border
- **Color:** dark · primary (#0373DF) · secondary
- **Phase:** phase 1 · phase 2 · phase 3 (animation frames)
- 32px. (Bootstrap-5 spinner pattern per component doc.)

### Empty State  (`452:97007`)
- **Type:** basic · simple · customize
- Illustration + (in customize) title/body/action layout.

---

## 5. Accessibility Bar & Widget (UX4G a11y) — `2382:295905`

### Accessibility Bar (`2063:291641`) — responsive Desktop / Tablet / Mobile
Gov-blue (`#0373DF`) top bar. Left: Indian flag + "Government of India" (external link). Right cluster of controls:
- **Skip to Main Content** link
- **Font size**: A− / A (reset) / A+  (decrease / typography / increase)
- **Contrast** toggle (light/dark contrast icon)
- **Accessibility** icon (opens the widget/panel)
- **Language** selector — globe + "English" dropdown
- (On the Sewa Setu reference layout the bar also exposes a **Screen Reader** / text-to-speech toggle and a **Dark Theme** toggle.)
Tablet drops "Skip to Main Content"; Mobile collapses to flag + a11y icon + language.

### Accessibility Widget / Panel (`21:2386`, `2764:7295`) — Web (v1 `455×870`, v2 `354×984`) + Mobile (`390×900`) + FAB
A floating **FAB** (Property 1 = On / Off, `5046:55544`) opens the panel "Accessibility Options". Panel controls (icons `2764:4238`):
- **Text Size** (resize)
- **Line Height**
- **Text Spacing**
- Plus higher-level options demoed: **primary-color customization** ("Customize the primary color as per your website"), contrast/theme.

This is the standard **UX4G accessibility widget** mandated for GIGW/DBIM gov properties.

---

## 6. Logos / Icons  (`67:12464`)
Not deep-extracted in this pass. Icons throughout are 24px line icons (Material-style: `captive_portal`, `done`, `check_circle`, `event_upcoming`, `arrow_outward`, `text_to_speech`, etc.) delivered as SVG assets. UX4G logo present in the a11y chrome (`ux4g-logo`).

---

## 7. Unresolved / caveats
- **Warning & Info semantic colors** (for alert statuses Warning/Info/Loading/Upload/Download) are **not exposed as inline hex** — the toast status icons are pre-rendered SVG mask assets, so their fills don't appear as `var(--token,#hex)` in the code. Resolved semantic hexes are only **Success #2E7D32** and **Error/Danger #EC5042** (from buttons/badges). To get Warning (likely amber, brand `gov-yellow #FFD323` / `saffron #F97316`) and Info (likely a blue) exactly, open a Warning/Info alert variant with a live Figma selection and run `get_variable_defs`, or inspect the icon's `Status=Warning`/`Status=Info` node fill directly.
- **Spinner `secondary` color** is an SVG asset; `primary` maps to #0373DF, `dark` to the ink neutral. Secondary hex not resolved inline.
- The dual "Font Size" token index scale is ambiguous; px values above are the resolved truth.
- Logos/Icons page (`67:12464`) not enumerated — defer to a dedicated icon-extraction pass if the icon set needs cataloguing.
