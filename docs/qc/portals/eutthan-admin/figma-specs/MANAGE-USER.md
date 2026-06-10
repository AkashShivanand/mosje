# Figma Design Spec — ADMIN / MANAGE USER

> **Source of truth:** Figma handoff. EXACT values only (hex, px, weights). "n/a" where unavailable.
> **File key:** `gH2vQ62cfg4677YKWuOpLc`
> **Screen:** ADMIN / MANAGE USER · **Slug:** MANAGE-USER
> **Frame node id:** `4226:40865` (name in Figma: "ADMIN / MANGAGE USER" — typo is in the source)
> **Real content node id:** `4226:40870` → "User List" (the frame's own page content)
> **Frame size:** 1440 × 1268
> **Extracted via:** get_variable_defs + get_metadata + get_design_context (forceCode)

## ⚠️ Extraction notes (important for QC)

- **Rendering artifact:** The full-frame screenshot of `4226:40865` renders a *pasted* inner frame `9041:36044` ("ADMIN / MAP SCHEMES / Mapped" — "Mapped Schemes List") that visually sits on top. The **actual MANAGE USER content** lives in sibling frame `4226:40870` (Container at x=1440, collapsed to width=1 on canvas). All page-body specs below are extracted from `4226:40870` → "User List" and its children, which is the true MANAGE USER design. The **navbar and sidebar** are shared and identical between the two frames; specs are taken from the navbar/sidebar instances.
- **No status chips, no role badges, no zebra striping** exist on this screen. The table is a plain user list. The only per-row action is a single `more_vert` icon button. These rows are marked "n/a (not present in Figma)" below so the QC comparison does not invent them.
- Page heading reads **"User List"** (not "Manage User"). Primary action button reads **"Add user"**.

## Tokens / variables used

| Token | Value |
|---|---|
| Primary/Source (`text/primary`) | `#003366` (`#036`) |
| Primary/50 | `#e5eff9` |
| Primary/100 | `#c8dbf0` |
| Primary/800 | `#001933` |
| Neutral/Source | `#374151` |
| Neutral/50 | `#f9fafb` |
| Neutral/0 - White | `#ffffff` |
| Text/Dark | `#374151` |
| Text/Light | `#ffffff` |
| Text/Hint | `#374151` (token def) — **rendered hint text uses `#6b7280`** in design context (see notes) |
| Text/Primary | `#003366` |
| Stroke/50 | `#f9fafb` |
| Stroke/100 | `#f3f4f6` |
| Stroke/200 | `#e5e7eb` |
| Stroke/300 | `#d1d5db` |
| Neutral/200 | `#e5e7eb` |
| Neutral/600 | `#4b5563` |
| BETA badge bg | `#ffd323` |
| font-family/body, /heading | Noto Sans |
| font-size: label-2 12 · label-1 14 · body-3 13 · body-2 14 · body-1 16 · title-2 18 · headline-4 20 · headline-3 24 | px |
| font-weight: regular 400 · medium 500 · semibold 600 · bold 700 | — |
| line-height: label-2 16 · label-1 20 · body-3 20 · body-2 20 · body-1 24 · title-2 24 · headline-3 32 · headline-6 24 | px |
| letter-spacing: label/body/heading/title 0 · "3" 0.5 · "5" 0.4 | px |
| radius: xxs 2 · xs 4 · sm 6 · md 8 · lg 12 · xl 16 · full 999 · button-corner 8 | px |
| spacing: xxs 2 · xs 4 · sm 8 · md 12 · lg 16 · xl 20 · 2xl 24 · 5xl 48 | px |
| Shadows/shadow-xs | DROP_SHADOW `#2121211F` offset (0,2) blur 3 spread 1 |
| Shadows/shadow-md | DROP_SHADOW `#2121210A` (0,2) blur 8 spread −2 ; `#21212133` (0,6) blur 8 spread −2 |

## Element table

| Region / Element | Text | Font family | Size px | Weight | Line-height | Text color hex | Background hex | Border hex / width | Radius px | Padding | Gap | Size W×H | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Top gov bar (Accessibility Bar)** | — | — | — | — | — | — | `#003366` | none | 0 | px 24 / py 4 | — | 1440 × 40 | full-width, items center/space-between |
| Indian flag | — | — | — | — | — | — | (image) | — | 2 (xxs) | — | — | 33 × 22 | |
| "Government of India" link | Government of India | Noto Sans | 14 | Medium 500 | 20 | `#ffffff` | — | none | — | — | gap 2 to icon | auto × 20 | external link + open_in_new 12×12 |
| "Skip to Main Content" | Skip to Main Content | Noto Sans | 14 | Medium 500 | 20 | `#ffffff` | — | — | — | — | — | auto | |
| Font-size controls A−/A/A+ | A− A A+ | — | 16 | — | — | `#ffffff` | selection layer `#e5eff9` @ opacity 10% | — | 4 (xs) | — | — | 16×16 icons, 32×32 hit | |
| Contrast / accessibility icons | — | — | — | — | — | `#ffffff` | — | — | — | — | — | 20×20 each | separators 20px |
| Language switch | English | Roboto | 12 | Medium 500 | normal | `#ffffff` | — | — | — | — | gap 4 | — | language 20 + arrow_drop_down 20 |
| **Masthead (Logo and CTAs)** | — | — | — | — | — | — | `#ffffff` | bottom `#f3f4f6` / 1 | 0 | px 24 / py 12 | gap 24 | 1440 × 94 | navbar total height 134 (40+94) |
| Menu toggle (menu/open) | — | — | — | — | — | — | — | — | — | — | 32 × 32 | |
| National Emblem | — | — | — | — | — | — | (image) | — | — | — | gap 12 in row | 32 × 52 | |
| Masthead divider | — | — | — | — | — | — | radial gradient `#003366`→transparent | — | — | — | 1 × 94 | |
| BETA badge | BETA | Noto Sans | 10 | Bold 700 | 10 | `#000000` | `#ffd323` | none | 2 (xxs) | px 4 / py 2 | — | auto | tracking 0.5 |
| Govt-of-India label | Government of India | Noto Sans | 12 | Medium 500 | 16 | `#374151` | — | — | — | — | — | — | |
| Ministry line | Ministry of Social Justice & Empowerment | Noto Sans | 14 | Medium 500 | 16 | `#1f2937` | — | — | — | — | — | — | tracking 0.4 |
| Department line | Department of Social Justice & Empowerment | Noto Sans | 20 | Bold 700 | 24 | `#374151` | — | — | — | — | — | — | headline-4 |
| Co-branding: Digital India | — | — | — | — | — | — | (image) | — | — | — | gap 24 | 102 × 40 | |
| Co-branding: SAMAVESH logo block | SAMAVESH / Single Access Mechanism… | Noto Sans | 11.429 / 7.143 | SemiBold 600 / Regular 400 | 11.429 / 10 | `#1f2937` / `#374151` | white pill `#ffffff` | — | 713.571 (pill) | — | gap 8.571 | 40 logo | sub-tagline 2 lines |
| Profile name | Vikas S | Noto Sans | 16 | SemiBold 600 | 24 | `#374151` | — | — | — | — | — | — | |
| Profile role | Admin | Noto Sans | 13 | Regular 400 | 20 | `#6b7280` | — | — | — | — | — | — | body-3 |
| Avatar | VS | Noto Sans | 18 | Medium 500 | 24 | `#001933` | `#c8dbf0` | `#f3f4f6` / 1 | 8 (md) | px 9 / py 10 | — | 48 × 48 | title-2 |
| **Sidebar** | — | — | — | — | — | — | `#ffffff` | — | 0 | p 16 | gap 12 | 300 × 790 (frame); inner 268 wide | sidebar/type-1, x=0 y=134 |
| Sidebar item (default) | e.g. Dashboard, Manage Ministry… | Noto Sans | 14 | Regular 400 | 20 | `#374151` | transparent | none | 16 (xl) | px 16 / py 12 | gap 8 (icon→label) | 268 × 48 | icon 24×24 |
| Sidebar item — **ACTIVE** | User Management | Noto Sans | 14 | Regular 400 | 20 | `#003366` (text/primary) | `#e5eff9` (Primary/50) | none | 16 (xl) | px 16 / py 12 | gap 8 | 268 × 48 | active = bg + primary text; icon group/active variant |
| Sidebar item w/ chevron | Reports | Noto Sans | 14 | Regular 400 | 20 | `#374151` | transparent | none | 16 | px 16 / py 12 | gap 8 | 268 × 48 | chevron-right 24×24 trailing |
| **Page heading** | User List | Noto Sans (heading) | 24 | SemiBold 600 | 32 | `#374151` (Text/Dark) | — | — | — | — | — | auto × 32 | Headline/headline-3; tracking 0 |
| **Add user button** (primary) | Add user | Noto Sans (body) | 14 | Medium 500 | 20 | `#ffffff` (Text/Light) | `#003366` (Primary/Source) | none | 8 (button-corner) | pl 24 / pr 16 / py 8 | gap 8 | 124 × 40 | trailing add icon 16×16; label-1 |
| **Card** (table container) | — | — | — | — | — | — | `#ffffff` (assumed) | n/a (not in extracted ctx) | n/a | — | — | 1092 × 1022 | header 80 + body 940; at x=0 y=60 within content |
| Card content container | — | — | — | — | — | — | — | — | — | — | — | 1042 wide | inset 24 + 1042 + 24 = 1090 |
| **Search field** | Search for | Noto Sans | 14 | Regular 400 | 20 | `#6b7280` (Text/Hint placeholder) | `#f9fafb` (Neutral/50) | none | 8 (md) | input pl 8 / pr 2 / py 2 | gap 8 | 577 × 40 | search icon 20×20 |
| **Filter chip** (Default Chips) ×3 | 2024-25 · All Schemes · All Department | Noto Sans | 14 | Regular 400 | 20 | `#374151` (Text/Dark) | transparent | `#e5e7eb` (Stroke/200) / 1 | 6 (sm) | pl 8 / pr 16 / py 8 | gap 4 | auto × 36 | arrow-down icon 18×18; group gap 12 |
| **Table** | — | — | — | — | — | — | transparent | — | — | — | — | 1042 × 868 | 5 data cols + actions col |
| Column header cell | User ID · Officer Name · Email · Phone Number · Ministry/Department | Noto Sans (body) | 16 | SemiBold 600 | 24 | `#6b7280` (Text/Hint) | `#f9fafb` (Neutral/50) | bottom `#f3f4f6` (Stroke/100) / 1 | 0 | px 24 / py 16 | — | col-width × 56 | Body/body-1-semibold; header row 56 tall |
| Data cell (text) | e.g. Manmohan Kaur, manmohan-kaur, +91 98765 43210 | Noto Sans (body) | 16 | Regular 400 | 24 | `#374151` (Text/Dark) | transparent | bottom `#f3f4f6` (Stroke/100) / 1 | 0 | p 24 | — | col-width × 116 | Body/body-1; data row height 116 |
| Zebra striping | — | — | — | — | — | — | n/a (not present in Figma) | — | — | — | — | — | no alternating row fill; dividers only |
| Status chips (active/inactive) | — | — | — | — | — | — | n/a (not present) | — | — | — | — | — | screen has no status column |
| Role badges | — | — | — | — | — | — | n/a (not present) | — | — | — | — | — | screen has no role column |
| **Action column header** | (empty "Text") | — | 16 | SemiBold 600 | 24 | `#6b7280` | `#f9fafb` | bottom `#f3f4f6` / 1 | — | px 24 / py 16 | — | 88 × 56 | empty label |
| **Action icon button** (per row) | — (more_vert) | — | — | — | — | icon `#374151` | transparent | none | 8 (md) | p 8 | — | 40 × 40 (cell 88 × 116) | single more_vert icon 24×24; NOT edit/delete pair |
| **Pagination** | — | — | — | — | — | — | transparent | — | — | p 0 | — | 1042 × 32 | space-between; at y=884 within body |
| Pagination — prev/next arrows | — | — | — | — | — | icon | — | — | 4 (xs) | p 8 | — | 16×16 icon | prev opacity 50% (disabled) |
| Pagination — active page | 1 | Noto Sans | 14 | Medium 500 | 20 | `#374151` (Text/Dark) | `#ffffff` | `#003366` (Primary/Source) / 1 | 8 (md) | px 8 / py 6 | — | auto | current page |
| Pagination — inactive page | 2 3 4 5 6 … 150 | Noto Sans | 14 | Regular 400 | 20 | `#6b7280` (Text/Hint) | transparent | none | 8 (md) | px 8 / py 6 | gap 2 | auto | |
| Pagination — "Showing" / "of 1500 items" | Showing / of 1500 items | Noto Sans | 13 | Regular 400 | 20 | `#6b7280` (Text/Hint) | — | — | — | — | gap 8 | — | body-3 |
| Pagination — page-size dropdown | 200 | Noto Sans | 14 | Regular 400 | 20 | `#374151` (Text/Dark) | transparent | `#e5e7eb` (Stroke/200) / 1 | 8 (md) | pl 16 / pr 8 / py 8 | gap 4 | auto × 32 | trailing icon 20×20 |

## Layout (exact px)

| Property | Value |
|---|---|
| Frame (page) width | 1440 |
| Frame (page) height | 1268 |
| Navbar height | 134 (top bar 40 + masthead 94) |
| Top gov bar height | 40 |
| Masthead height | 94 |
| Sidebar frame width | 300 |
| Sidebar inner (sidebar/type-1) width | 300, content 268 wide, padding 16 |
| Sidebar item height | 48 |
| Sidebar item vertical gap | 12 (spacing-md) |
| Content container (right of sidebar) width | 1140 |
| Content top offset (below navbar) | y=118 (Content frame) within container |
| Content inner container | x=24 y=24, width 1092 (so 24px L/R padding inside 1140) |
| Heading row (Frame 32) → Card gap | heading at y=0, Card at y=60 → 20px gap (heading row is 40 tall, 60−40=20) |
| Card width | 1092 |
| Card header height | 80 |
| Card header padding | px 24 / py 20 |
| Card body width inner | 1042 (24px L/R inside 1090 card body) |
| Table column header row height | 56 |
| Table data row height | 116 |
| Cell padding | 24 (all sides) |
| Column header / cell horizontal padding | 24 |
| Column header vertical padding | 16 |
| Filter chip group gap | 12 (spacing-md) |
| Search width | 577 |
| Pagination offset within body | y=884 |
| Pagination height | 32 |
| Content max-width (container) | 1140 (sidebar 300 + content 1140 = 1440) |
| Section spacing heading→card | 20 |

### Column widths (data table, 4226:40888 "Table", total 1042 wide)
| Column | x | width |
|---|---|---|
| Officer Name | 0 | 208.4 |
| User ID | 208.4 | 208.4 |
| Email | 416.8 | 208.4 |
| Phone Number | 625.2 | 208.4 |
| Ministry/Department | 833.6 | 208.4 |
| Actions (overlay Col) | 954 | 88 |

> Note: 5 data columns each 208.4px (= 1042/5) span full width; the Actions column (88px, more_vert) is an overlay `Col` at x=954, so it visually overlaps the rightmost data column's right edge. Header row and cells share `Stroke/100 #f3f4f6` 1px bottom dividers only — no vertical dividers, no zebra fill.
