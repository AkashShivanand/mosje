# Figma EXACT Spec — ADMIN / MANAGE MINISTRY

- **Portal:** MoSJE eUtthan Admin
- **Screen:** ADMIN / MANAGE MINISTRY (Figma layer name: "ADMIN / MANGAGE MINISTRY" — sic)
- **SLUG:** MANAGE-MINISTRY
- **File key:** `gH2vQ62cfg4677YKWuOpLc`
- **Node id:** `4226:40288`
- **Frame size:** 1440 × 1268 px
- **Source of truth:** Figma handoff. All values below are EXACT from Figma (variables, computed px). `n/a` = not exposed by Figma MCP.

> Note: This screen frame also contains HIDDEN frames not rendered on the active screen: "Sub Section / Quick Actions" (4226:40364), a second "Card / My Submissions" table (4226:40372), and a hidden filter-chips group (4226:40304 incl. "Default Chips"). These are excluded from the spec below. **There are no status chips and no per-row icon-only action buttons on the active screen** — row actions are text+icon "Edit"/"Delete" buttons (see Data table → Row action button group).

---

## Tokens / variables used

### Colors
| Token | Hex |
|-------|-----|
| Primary/Source · Text/Primary | `#003366` |
| Primary/50 | `#e5eff9` |
| Primary/100 | `#c8dbf0` |
| Primary/800 | `#001933` |
| Primary Transparent/8% | `#00336614` (rgba(0,51,102,0.08)) |
| Neutral/Source | `#374151` |
| Neutral/50 · Stroke/50 | `#f9fafb` |
| Neutral/0 - White | `#ffffff` |
| Neutral/600 | `#4b5563` |
| Text/Dark · Text/Hint | `#374151` (Text/Hint resolves to `#6b7280` in body/placeholder/caption usages — see notes) |
| Text/Light | `#ffffff` |
| Text/Error · Danger/Source | `#d64539` |
| Stroke/100 | `#f3f4f6` |
| Stroke/200 | `#e5e7eb` |
| gov-yellow (BETA badge, raw) | `#ffd323` |
| Card border (raw, NOT a token) | `#e2e8f0` |

### Typography (font family = Noto Sans everywhere)
| Style | Size px | Weight | Line-height px | Letter-spacing |
|-------|---------|--------|----------------|----------------|
| Headline/headline-3 | 24 | SemiBold (600) | 32 | 0 |
| Headline/headline-4 | 20 | Bold (700) | 24 | 0 |
| Title/title-2 | 18 | Medium (500) | 24 | 0 |
| Body/body-1 | 16 | Regular (400) | 24 | 0 |
| Body/body-1-semibold | 16 | SemiBold (600) | 24 | 0 |
| Body/body-2 | 14 | Regular (400) | 20 | 0 |
| Body/body-3 | 13 | Regular (400) | 20 | 0 |
| Label/label-1 | 14 | Medium (500) | 20 | 0 |
| Label/label-2 | 12 | Medium (500) | 16 | 0 |
| Label/label-3 | 11 | Medium (500) | 16 | 0 |

### Spacing / radius
| Token | px |
|-------|----|
| spacing-xxs | 2 |
| spacing-xs | 4 |
| spacing-sm | 8 |
| spacing-md | 12 |
| spacing-lg | 16 |
| spacing-xl | 20 |
| spacing-2xl | 24 |
| spacing-5xl | 48 |
| radius-xxs | 2 |
| radius-xs | 4 |
| radius-sm | 6 |
| radius-md | 8 |
| radius-lg | 12 |
| radius-xl | 16 |
| button-corner | 8 |

---

## Layout (exact px)

| Property | Value |
|----------|-------|
| Frame (screen) | 1440 × 1268 |
| Navbar | 1440 × 134, full width, bg `#ffffff`, bottom border 1px `#f3f4f6` |
| Body row | Sidebar (300w) + Container (1140w), starts y=0 below navbar overlap (navbar overlays at top) |
| Sidebar | 300 wide; inner `sidebar/type-1` padding 16; item gap 12 |
| Container (content col) | 1140 wide; Content starts at y=118 within container; Content padding via inner Container 24 |
| Content inner Container | 1092 wide (1140 − 24 − 24), at x=24 y=24 |
| Page-heading row → Card gap | heading row at y=0 (h=40), Card at y=60 → **20px gap** |
| Card | 1092 × 1022 |
| Card padding (border) | 1px all sides (`p-px`) |
| CardHeader | full width, padding 24 (x) / 20 (y) |
| Card Body | padding 0 top, 24 left/right, 24 bottom; internal gap 16 (table → pagination) |
| Table grid | 1042 wide, 868 tall, 3 equal columns |
| Column width | 347.33 each (1042 / 3) |
| Col-head row height | 56 |
| Body cell height | 116 |
| Content max-width | container content = 1092px inner (no explicit 1280 cap on this screen; full-bleed within 1140 container) |
| Section spacing | heading↔card 20; card-body table↔pagination 16 |

---

## Region / Element table

| Region / Element | Text | Font family | Size px | Weight | Line-height | Text color hex | Background hex | Border hex / width | Radius px | Padding | Gap | Size W×H | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Top gov / accessibility bar** | — | — | — | — | — | — | `#003366` | none | 0 | px 24 / py 4 | — | 1440 × 40 | Full-width bar |
| · Flag chip | (img) | — | — | — | — | — | — | — | 2 | — | gap 18 (to text) | 33 × 22 | Indian flag |
| · "Government of India" link | Government of India | Noto Sans | 14 | Medium (500) | 20 | `#ffffff` | — | — | — | — | gap 2 (to ext icon) | — | external-link icon 12×12 |
| · "Skip to Main Content" | Skip to Main Content | Noto Sans | 14 | Medium (500) | 20 | `#ffffff` | — | — | — | — | nav gap 24 | — | — |
| · Separators | — | — | — | — | — | — | — | 1px (img) | — | — | — | 20 long | vertical dividers |
| · Font-size A−/A/A+ | — | — | — | — | — | — | selected layer `#e5eff9` @10% | — | 4 | — | — | 16/32 icons | A control |
| · Contrast icon | — | — | — | — | — | — | — | — | — | — | — | 20×20 | — |
| · Accessibility icon | — | — | — | — | — | — | — | — | — | — | — | 20×20 | — |
| · Language | English | Roboto Medium | 12 | Medium (500) | normal | `#ffffff` | — | — | — | — | gap 4 | — | lang + caret icons 20×20; **font = Roboto (not Noto)** |
| **Masthead (Logo & CTAs)** | — | — | — | — | — | — | `#ffffff` | bottom 1px `#f3f4f6` | 0 | px 24 / py 12 | gap 24 | 1440 × 94 | — |
| · Hamburger (menu/open) | — | — | — | — | — | — | — | — | — | — | — | 32×32 | — |
| · National Emblem | (img) | — | — | — | — | — | — | — | — | — | row gap 12 | 32 × 52 | + 1px gradient divider |
| · BETA badge | BETA | Noto Sans | 10 | Bold (700) | 10 | `#000000` | `#ffd323` | none | 2 | px 4 / py 2 | — | — | letter-spacing 0.5 |
| · "Government of India" | Government of India | Noto Sans | 12 | Medium (500) | 16 | `#374151` | — | — | — | — | — | — | — |
| · "Ministry of Social Justice & Empowerment" | Ministry of Social Justice & Empowerment | Noto Sans | 14 | Medium (500) | 16 | `#1f2937` (Text/Dark var, code emits #1f2937) | — | — | — | — | — | — | letter-spacing 0.4 |
| · "Department of Social Justice & Empowerment" | Department of Social Justice & Empowerment | Noto Sans | 20 | Bold (700) | 24 | `#374151` | — | — | — | — | — | — | headline-4 |
| · SAMAVESH title | SAMAVESH | Noto Sans | 11.429 | SemiBold (600) | 11.429 | `#1f2937` | — | — | — | — | gap 1.429 | — | co-branding lockup |
| · SAMAVESH subtitle | Single Access Mechanism for All Verticals of Empowerment & Social Harmony | Noto Sans | 7.143 | Regular (400) | 10 | `#374151` (Text/Hint) | — | — | — | — | — | — | — |
| · Digital India logo | (img) | — | — | — | — | — | — | — | — | — | cobrand gap 24 | 102 × 40 | — |
| · Profile name | Vikas S | Noto Sans | 16 | SemiBold (600) | 24 | `#374151` | — | — | — | — | profile gap 8 | — | body-1-semibold |
| · Profile role | Admin | Noto Sans | 13 | Regular (400) | 20 | `#6b7280` (Text/Hint) | — | — | — | — | — | — | body-3 |
| · Avatar "VS" | VS | Noto Sans | 18 | Medium (500) | 24 | `#001933` (Primary/800) | `#c8dbf0` (Primary/100) | 1px `#f3f4f6` | 8 | px 9 / py 10 | — | 48×48 | — |
| **Sidebar** | — | — | — | — | — | — | (transparent) | — | — | pad 16; item gap 12 | 12 | 300 × 908 | `sidebar/type-1` 300×790 below navbar |
| · Menu item (default) | (varies) | Noto Sans | 14 | Regular (400) | 20 | `#374151` | transparent | — | 16 (row) | px 16 / py 12 | gap 8 (icon↔label) | 268 × 48 | icon 24×24 |
| · Menu item (ACTIVE) | Manage Ministry | Noto Sans | 14 | Regular (400) | 20 | `#003366` (Text/Primary) | `#e5eff9` (Primary/50) | none | 16 | px 16 / py 12 | gap 8 | 268 × 48 | Active = blue bg + blue text |
| · Menu items (full list, top→bottom) | Dashboard · Manage Financial Year · **Manage Ministry** · Manage Scheme · Manage Outcome · Manage Documents · Map Ministry/Schemes · Reports (caret) · User Management · Role Management · PFMS Logs | Noto Sans | 14 | Regular (400) | 20 | `#374151` | — | — | 16 | px 16 / py 12 | 8 | 268 × 48 ea | Reports has chevron-right 24×24 |
| **Page heading row** | — | — | — | — | — | — | — | — | — | — | space-between | 1092 × 40 | — |
| · Page title | Ministry/Department List | Noto Sans | 24 | SemiBold (600) | 32 | `#374151` | — | — | — | — | — | 298 × 32 | headline-3 |
| · "Add Ministry/Department" button | Add Ministry/Department | Noto Sans | 14 | Medium (500) | 20 | `#ffffff` | `#003366` | none | 8 | pl 24 / pr 16 / py 8 | gap 8 | 237 × 40 | trailing "add" icon 16×16 |
| **Card (table container)** | — | — | — | — | — | — | `#ffffff` | 1px `#e2e8f0` | 14 | 1px | — | 1092 × 1022 | radius 14 raw; border raw hex (NOT token) |
| **Card header — Search** | Search for | Noto Sans | 14 | Regular (400) | 20 | `#6b7280` (Text/Hint placeholder) | `#f9fafb` (Neutral/50) | none | 8 | input pl 8 / pr 2 / py 2 | gap 8 | 577 × 40 | leading search icon 20×20; header pad 24/20 |
| **Data table** | — | — | — | — | — | — | `#ffffff` | 1px `#e5e7eb` | 12 | 0 | — | 1042 × 868 | 3 cols × (1 head + body rows) |
| · Column header cell | Ministry/Department · Grant 10A · Grant No. PFMS | Noto Sans | 16 | SemiBold (600) | 24 | `#6b7280` (Text/Hint) | `#f9fafb` (Neutral/50) | bottom 1px `#f3f4f6` | 0 | px 24 / py 16 | — | 347.33 × 56 | — |
| · Body cell (default row) | (data) | Noto Sans | 16 | Regular (400) | 24 | `#374151` | `#ffffff` | bottom 1px `#f3f4f6` | 0 | 24 all | — | 347.33 × 116 | — |
| · Body cell (ZEBRA / selected row) | (data) | Noto Sans | 16 | Regular (400) | 24 | `#003366` (Text/Primary) | `#e5eff9` (Primary/50) | bottom 1px `#f3f4f6` | 0 | 24 all | — | 347.33 × 116 | Alternate/active row: blue bg + blue text (row-3 in sample) |
| · Cell text samples | Ministry of Power / Dept of Agriculture Cooperation and Farmers Welfare / Dept of Fertilisers / Dept of Pharmaceuticals / Ministry of Coal | — | — | — | — | — | — | — | — | — | — | — | Grant cols: 079, 001, 006, 079, 004, 006, 007, 009… |
| · Row action button group | — | — | — | — | — | — | — | — | — | — | gap 12 | 202 × 40 | abs-positioned over active row, right 11px |
| ·· Edit button | Edit | Noto Sans | 14 | Medium (500) | 20 | `#003366` (Text/Primary) | `#00336614` (Primary Transparent 8%) | none | 8 | pl 20 / pr 16 / py 10 | gap 8 | 86 × 40 | edit icon 16×16 |
| ·· Delete button | Delete | Noto Sans | 14 | Medium (500) | 20 | `#d64539` (Text/Error) | transparent | none | 8 | pl 20 / pr 16 / py 10 | gap 8 | 104 × 40 | delete icon 16×16 |
| **Pagination (pagination/large)** | — | — | — | — | — | — | — | — | — | 0 | space-between | 1042 × 32 | — |
| · Prev / Next arrows | — | — | — | — | — | — | — | — | 4 | 8 | — | 16 icon | prev opacity 0.5 (disabled) |
| · Page number (current) | 1 | Noto Sans | 14 | Medium (500) | 20 | `#374151` | `#ffffff` | 1px `#003366` | 8 | px 8 / py 6 | — | — | active page outlined |
| · Page numbers (other) | 2 3 4 5 6 … 150 | Noto Sans | 14 | Regular (400) | 20 | `#6b7280` (Text/Hint) | transparent | none | 8 | px 8 / py 6 | gap 2 | — | — |
| · "Showing" label | Showing | Noto Sans | 13 | Regular (400) | 20 | `#6b7280` | — | — | — | — | gap 8 | — | body-3 |
| · Page-size dropdown | 200 | Noto Sans | 14 | Regular (400) | 20 | `#374151` | transparent | 1px `#e5e7eb` | 8 | pl 16 / pr 8 / py 8 | gap 4 | h 32 | trailing caret 20×20 |
| · "of 1500 items" | of 1500 items | Noto Sans | 13 | Regular (400) | 20 | `#6b7280` | — | — | — | — | — | — | — |

---

## Notes / ambiguities

- **Text/Hint token mismatch:** The variable `Text/Hint` is defined as `#374151` in `get_variable_defs`, but generated code consistently emits `#6b7280` for hint/placeholder/caption usages (search placeholder, col-head, profile role, pagination captions, body-2/body-3 hint text). Treat hint usages as **`#6b7280`** for live comparison; flag the token definition as inconsistent.
- **"Ministry of Social Justice…" masthead line** emits `#1f2937` (not `#374151`) despite Text/Dark var — Figma code constant.
- **Card border `#e2e8f0` and radius `14px` are RAW values (not design tokens)** — the only place a non-tokenized stroke/radius appears. Inner Table uses tokenized border `#e5e7eb` (Stroke/200) + radius 12 (radius-lg).
- **Zebra striping:** Not a true alternating pattern in this static frame — row 3 (Dept of Agriculture…) is rendered as the active/selected row (`#e5eff9` bg, `#003366` text) and carries the floating Edit/Delete button group. All other body rows are default white. Live QC should confirm whether striping is per-row alternate or selection-only.
- **No status chips** on the active screen (filter "Default Chips" group 4226:40304 is hidden).
- **Language switcher uses Roboto Medium 12** — the only non-Noto-Sans type on the screen (likely a DS inconsistency to flag).
- Column header "Ministry/Department" aligns `items-start`; the two Grant headers align `items-center` — minor vertical-alignment inconsistency in the header row.
