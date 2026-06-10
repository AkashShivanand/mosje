# Figma Spec — ADMIN / DASHBOARD

> **Source of truth:** Figma handoff. EXACT values only (extracted via Figma MCP `get_design_context` / `get_variable_defs`). Where a value is genuinely not exposed by Figma, it is marked `n/a`.

- **Screen:** ADMIN / DASHBOARD (SLUG: DASHBOARD)
- **File key:** `gH2vQ62cfg4677YKWuOpLc`
- **Node id:** `4226:39685`
- **Frame size:** 1440 × 1288 px
- **Layout regions present:** top gov/accessibility bar, masthead/header, left sidebar nav, page heading, FY progress panel + dropdown chip, 4 summary KPI cards, inner 7-card stat grid, expenditure donut chart + legend.
- **NOT present in this frame:** action buttons (none rendered on Dashboard head — `Filters` frame `4226:39698` is hidden), footer (no footer node exists in `4226:39685`), Quick Actions / My Submissions table (frames `4226:39924` and `4226:39932` are `hidden=true`). Marked accordingly below.

---

## Tokens / variables used (name → exact value)

### Color
| Token | Value |
|---|---|
| Primary/Source (`text/primary`) | `#003366` |
| Primary/800 | `#001933` |
| Primary/200 | `#9cbfe3` |
| Primary/100 | `#c8dbf0` |
| Primary/50 | `#e5eff9` |
| Neutral/Source (`text/dark`) | `#374151` |
| Neutral/600 | `#4b5563` |
| Neutral/200 | `#e5e7eb` |
| Neutral/50 | `#f9fafb` |
| Neutral/0 - White | `#ffffff` |
| Text/Light | `#ffffff` |
| Text/Dark | `#374151` |
| Text/Hint | `#374151` (token) — note: code renders hint text as `#6b7280` / `#1f2937` in places |
| Text/Primary | `#003366` |
| Stroke/200 | `#e5e7eb` |
| Stroke/100 | `#f3f4f6` |
| Stroke/50 | `#f9fafb` |
| Warning/300 | `#ffae4f` |
| Warning/200 | `#ffc97f` |
| Danger/300 | `#f47c70` |
| Danger/200 | `#f6a89f` |
| Success/300 | `#81c784` |
| Success/100 (KPI trend chip bg) | `#c8e6c9` |
| Success/600 (KPI trend text) | `#27682a` |
| Gov-yellow (BETA badge bg) | `#ffd323` |

### Typography (named text styles)
| Token | Family | Weight | Size px | Line-height px | Letter-spacing |
|---|---|---|---|---|---|
| Display/display-5 | Noto Sans | Medium (500) | 28 | 36 | -0.28 |
| Headline/headline-1 | Noto Sans | SemiBold (600) | 32 | 40 | 0 |
| Title/title-2 | Noto Sans | Medium (500) | 18 | 24 | 0 |
| Body/body-1-semibold | Noto Sans | SemiBold (600) | 16 | 24 | 0 |
| Body/body-2 | Noto Sans | Regular (400) | 14 | 20 | 0 |
| Body/body-2-semibold | Noto Sans | SemiBold (600) | 14 | 20 | 0 |
| Body/body-3 | Noto Sans | Regular (400) | 13 | 20 | 0 |
| Label/label-1 | Noto Sans | Medium (500) | 14 | 20 | 0 |
| Label/label-2 | Noto Sans | Medium (500) | 12 | 16 | 0 |

### Spacing / radius
| Token | px |
|---|---|
| spacing-none / radius-none | 0 |
| spacing-xxs / radius-xxs | 2 |
| spacing-xs / radius-xs | 4 |
| radius-sm | 6 |
| spacing-sm / radius-md | 8 |
| spacing-md | 12 |
| radius-lg | 12 |
| spacing-lg | 16 |
| radius-xl | 16 |
| spacing-xl | 20 |
| spacing-2xl | 24 |
| spacing-3xl | 32 |
| spacing-5xl | 48 |

---

## Element / Region table

| Region/Element | Text | Font family | Size px | Weight | Line-height px | Text color hex | Background hex | Border hex/width | Radius px | Padding | Gap | Size W×H | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **TOP GOV BAR (Accessibility Bar)** | — | — | — | — | — | — | `#003366` (Primary/Source) | none | 0 | py 4 (container), h 40 | gap 24 (nav) | 1440 × 40 | full width |
| — flag | — | — | — | — | — | — | image | — | 2 | — | — | 33 × 22 | Indian-Flag |
| — "Government of India" link | Government of India | Noto Sans | 14 | Medium (500) | 20 | `#ffffff` | — | — | — | — | gap 2 | auto | external link + open_in_new 12px icon |
| — "Skip to Main Content" | Skip to Main Content | Noto Sans | 14 | Medium (500) | 20 | `#ffffff` | — | — | — | — | — | auto | |
| — Font-size A−/A/A+ controls | A− A A+ | — | icon 16 | — | — | `#ffffff` | selection layer `#e5eff9` @10% opacity | — | 4 (selection) | — | — | 32×32 selection | accessibility font sizer |
| — Contrast icon | — | — | 20 | — | — | `#ffffff` | — | — | — | — | — | 20×20 | contrast |
| — Accessibility icon | — | — | 20 | — | — | `#ffffff` | — | — | — | — | — | 20×20 | accessibility_new |
| — Language selector | English | Roboto | 12 | Medium (500) | normal | `#ffffff` | — | — | — | — | gap 4 | auto | language icon 20 + arrow_drop_down 20. NOTE: font is Roboto here, not Noto Sans |
| — Separators | — | — | — | — | — | — | — | image 1px | — | — | — | 20 long | vertical dividers |
| **MASTHEAD / HEADER (Logo and CTAs)** | — | — | — | — | — | — | `#ffffff` | bottom border `#f3f4f6` 1px | 0 | px 24 / py 12 | gap 24 | 1440 × ~94 | navbar total height 134 (40 bar + 94 header) |
| — Menu toggle | — | — | 32 | — | — | — | — | — | — | — | — | 32×32 | menu/open |
| — National Emblem | — | — | — | — | — | — | — | — | — | — | row gap 12 | 32 × 52 | emblem image |
| — BETA badge | BETA | Noto Sans | 10 | Bold (700) | 10 | `#000000` | `#ffd323` | — | 2 | px 4 / py 2 | — | auto | letter-spacing 0.5 |
| — "Government of India" | Government of India | Noto Sans | 12 | Medium (500) | 16 | `#374151` | — | — | — | — | — | — | label-2 |
| — Ministry line | Ministry of Social Justice & Empowerment | Noto Sans | 14 | Medium (500) | 16 | `#1f2937` (code) / `#374151` (token) | — | — | — | — | — | — | letter-spacing 0.4 (Letter Spacing/5) |
| — Department line | Department of Social Justice & Empowerment | Noto Sans | 20 | Bold (700) | 24 | `#374151` | — | — | — | — | — | — | headline-4, heading family |
| — Digital India logo | — | — | — | — | — | — | image | — | — | — | gap 24 (cobranding) | 102 × 40 | |
| — SAMAVESH title | SAMAVESH | Noto Sans | 11.429 | SemiBold (600) | 11.429 | `#1f2937` | — | — | — | — | gap 1.429 | auto | logo 40×40 |
| — SAMAVESH subtitle | Single Access Mechanism for All Verticals of Empowerment & Social Harmony | Noto Sans | 7.143 | Regular (400) | 10 | `#374151` (text/hint) | — | — | — | — | — | auto | |
| — Profile name | Vikas S | Noto Sans | 16 | SemiBold (600) | 24 | `#374151` | — | — | — | — | gap 8 | auto | body-1 |
| — Profile role | Admin | Noto Sans | 13 | Regular (400) | 20 | `#6b7280` (code) | — | — | — | — | — | auto | body-3; token text/hint=#374151 |
| — Avatar | VS | Noto Sans | 18 | Medium (500) | 24 | `#001933` (Primary/800) | `#c8dbf0` (Primary/100) | `#f3f4f6` 1px | 8 (radius-md) | px 9 / py 10 | gap 10 | 48 × 48 | title-2 |
| **SIDEBAR** | — | — | — | — | — | — | (transparent; on `#f9fafb` body) | none | — | p 16 (sidebar/type-1) | gap 12 between items | 300 × 908 (790 inner below navbar) | starts at y=134; menu width 268 |
| — Nav item (default) | (label) | Noto Sans | 14 | Regular (400) | 20 | `#374151` | transparent | none | 16 (radius-xl) | px 16 / py 12 | gap 8 (icon↔label) | 268 × 48 | icon 24×24 |
| — Nav item (ACTIVE: Dashboard) | Dashboard | Noto Sans | 14 | Regular (400) | 20 | `#003366` (text/primary) | `#e5eff9` (Primary/50) | none | 16 (radius-xl) | px 16 / py 12 | gap 8 | 268 × 48 | active fill + primary text; icon dashboard/active |
| — Nav items list | Dashboard · Manage Financial Year · Manage Ministry · Manage Scheme · Manage Outcome · Manage Documents · Map Ministry/Schemes · Reports · User Management · Role Management · PFMS Logs | Noto Sans | 14 | Regular (400) | 20 | `#374151` | transparent | — | 16 | px16/py12 | gap 12 (between) | each 268×48 | "Reports" has chevron-right 24; "Map Ministry/Schemes" uses Material Symbols `account_tree` glyph icon |
| **PAGE HEADING** | Dashboard | Noto Sans | 28 | Medium (500) | 36 | `#374151` | — | — | — | — | head stack gap 24 | — | Display/display-5; letter-spacing -0.28 |
| — Action buttons | — | — | — | — | — | — | — | — | — | — | — | — | **n/a — none present** (Filters frame hidden) |
| **SUMMARY KPI CARDS (4-up grid)** | — | — | — | — | — | — | `#ffffff` | `#c8dbf0` (Primary/100) 1px solid | 12 (radius-lg) | px 20 / py 24 | gap 4 (in-card); grid gap 20 | each ~258 × 112; min-w 248 | 4 columns, 1 row |
| — Card title | Total Ministry / Schemes as per 10A / Mapped Schemes / Pending Schemes | Noto Sans | 14 | Medium (500) | 20 | `#6b7280` (code; token text/hint=#374151) | — | — | — | — | — | — | label-1 |
| — Card value (card 1,3,4) | 39 / 54 / 188 | Noto Sans | 32 | SemiBold (600) | 40 | `#374151` | — | — | — | — | — | — | headline-1 |
| — Card value (card 2) | 242 | Noto Sans | 32 | SemiBold (600) | 40 | `#003366` (text/primary) | — | — | — | — | — | — | headline-1; **value is Primary blue, not dark** |
| **PROGRESS REPORT PANEL HEAD** | Progress Report of Financial Year 2024-2025 | Noto Sans | 16 | SemiBold (600) | 24 | `#374151` | — | — | — | — | row gap 12 | — | body-1-semibold |
| — Divider line | — | — | — | — | — | — | `#e5e7eb` (Neutral/200) | 1px height | — | — | — | flex-1 × 1 | between title and chip |
| — FY dropdown chip | 2024-25 | Noto Sans | 14 | Regular (400) | 20 | `#374151` | white/none | `#e5e7eb` (Stroke/200) 1px solid | 6 (radius-sm) | pl 8 / pr 16 / py 8 | gap 4 | ~99 × 36 | arrow-down icon 18×18 (chevron left of text) |
| **INNER STAT-CARD GRID (7 cards)** | — | — | — | — | — | — | `#ffffff` | `#e5e7eb` (Stroke/200) 1px solid | 16 (radius-xl) | p 24-25 | gap 16 (in-card) | each 353.33 × 138 | grid 3 cols; col gap 16, row gap 16 |
| — Inner card title | Ministry/Departments & UTS · Total Schemes · Revised Estimates (CR.) · DAPSC Releases (CR.) as on 26 Feb, 26 · Budget Estimates (CR.) · Releases W.R.T budget Estimates as on 26 Feb, 26 · Releases W.R.T revised Estimates as on 26 Feb, 26 | Noto Sans | 14 | SemiBold (600) | 20 | `#6b7280` (code; token text/hint) | — | — | — | — | — | — | body-2-semibold |
| — Inner card value | 39 / 242 / ₹138,359.67 / ₹129,665.0527 / ₹165,490.53 / 78.35 % / 93.72 % | Noto Sans | 32 | SemiBold (600) | 40 | `#374151` | — | — | — | — | gap 4 | — | headline-1; whitespace-nowrap |
| **EXPENDITURE DONUT PANEL** | — | — | — | — | — | — | `#ffffff` | `#e5e7eb` (Stroke/200) 1px solid | 12 (radius-lg) | p 24 | gap 16 | 557 × 388 | "Col" container |
| — Panel title | Top 6 Ministries / Department Expenditure 2024-25 | Noto Sans | 16 | SemiBold (600) | 24 | `#374151` | — | — | — | — | gap 8 | 509 × 24 | body-1-semibold |
| — Donut chart | — | — | — | — | — | — | — | — | — | — | — | ring 204 × 204 (in 509×300 area) | 6 segments |
| — Donut segment: Agriculture and Farmers Welfare | — | — | — | — | — | — | `#f47c70` (Danger/300) | — | — | — | — | — | from legend/Surface fills |
| — Donut segment: School Education and Literacy | — | — | — | — | — | — | `#ffae4f` (Warning/300) | — | — | — | — | — | |
| — Donut segment: Food and Public Distribution | — | — | — | — | — | — | `#9cbfe3` (Primary/200) | — | — | — | — | — | |
| — Donut segment: Health and Family Welfare | — | — | — | — | — | — | `#f6a89f` (Danger/200) | — | — | — | — | — | |
| — Donut segment: Rural Development | — | — | — | — | — | — | `#81c784` (Success/300) | — | — | — | — | — | |
| — Donut segment: Fertilisers | — | — | — | — | — | — | `#ffc97f` (Warning/200) | — | — | — | — | — | |
| — Legend item label | (ministry names) | **Inter** | 12 | Regular (400) | 18 | `#374151` | — | — | — | — | gap 8 (swatch↔label); row gap 4 | item 206.445 × 18 | swatch 14×14. NOTE: legend font is Inter, not Noto Sans |
| — Tooltip (hover) | Agriculture and Farmers Welfare : 11597.94 | Noto Sans | 14 | Regular / value SemiBold (600) | 20 | `#ffffff` | `#374151` (Neutral/Source) @90% opacity | — | 4 (radius-xs) | px 8 / py 4 | — | auto | value bold |
| **FOOTER** | — | — | — | — | — | — | — | — | — | — | — | — | **n/a — no footer node in this frame** |

---

## Layout

- **Frame:** 1440 × 1288 px.
- **Sidebar:** fixed width **300px**, full height; starts below navbar at y=134; inner `sidebar/type-1` padding **16px** all sides; menu column **268px**; nav items **268 × 48** each, gap **12px** vertical.
- **Navbar:** full-width 1440; total height **134px** = accessibility bar **40px** + header **~94px** (px 24 / py 12).
- **Content container (right of sidebar):** offset x=300, width **1140px**.
  - **Content** frame inset: top **118px** (below sticky head area), then inner **Container** padding **24px** all sides → working width **1092px**.
- **Page head block** (`Head` 4226:39693): width 1092; vertical gap between title row and KPI row = **24px** (spacing-2xl). Head block total height 172 (title 36 + gap 24 + KPI 112… effective 60→172 layout offset).
- **Summary KPI grid:** 4 equal columns, **column gap 20px**, single row; each card min-width **248px**, rendered ~**258 × 112**.
- **Section spacing:** Head block → "Sub Section" (progress panel) starts at y=204 within container (≈ **32px** below KPI row). Donut "Col" starts at y=734.
- **Progress panel inner card grid:** 3 columns; card width **353.333px**; column gap **16px** (positions 0 / 369.33 / 738.67); row gap **16px** (rows at y 0 / 154 / 308); cards **138px** tall.
- **Donut panel ("Col"):** **557 × 388**, padding **24px**, internal gap **16px**; chart area 509 × 300; legend grid offset left **293px**, vertically centered, 6 rows with **4px** row gap, item width **206.445px**.
- **Content max-width:** working content column **1092px** (1140 container − 2×24 padding). No explicit 1280 cap inside this admin frame.

---

## Notes / flags for QC

1. **Font deviations from Noto Sans:** the language selector ("English") uses **Roboto Medium 12**; the donut **legend labels use Inter Regular 12**. Both violate the Noto-Sans-everywhere DBIM standard — flag.
2. **`text/hint` token = `#374151`** but the generated code repeatedly renders hint/muted text as **`#6b7280`** (card titles, profile role) and the Ministry line as **`#1f2937`**. These are code-emitted literals; Figma token resolves to `#374151`. QC should confirm which the live build uses.
3. **KPI card 2 ("Schemes as per 10A", value 242)** uses **Primary `#003366`** for its number while the other three use dark `#374151` — intentional emphasis, verify in live.
4. Summary KPI cards border = **Primary/100 `#c8dbf0`**, radius **12**; inner stat cards border = **Stroke/200 `#e5e7eb`**, radius **16** — two different card styles on one screen.
5. No action buttons, no footer, no data table on this Dashboard frame (those frames exist but are `hidden=true`).
