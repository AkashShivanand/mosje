# Figma Design Spec — ADMIN / MANAGE SCHEME

> **Source of truth:** Figma handoff (design QC audit). EXACT values only; `n/a` where unavailable.
> **File key:** `gH2vQ62cfg4677YKWuOpLc`
> **Screen / Node:** ADMIN / MANAGE SCHEME — `4226:40449`
> **Slug:** MANAGE-SCHEME
> **Frame size:** 1440 × 1268 px
> **Extracted via:** get_variable_defs + get_metadata + get_design_context (forceCode)

Note: this frame name in Figma is misspelled "ADMIN / MANGAGE SCHEME". Two sub-sections inside the frame — "Quick Actions" benefits cards (`4226:40572`) and a "My Submissions" card (`4226:40580`) — are `hidden=true` in Figma and are **NOT** part of the rendered MANAGE SCHEME screen; they are excluded below.

---

## Tokens / variables used

| Token | Value |
|---|---|
| `Primary/Source` (`text/primary`, button bg) | `#003366` |
| `Primary/800` | `#001933` |
| `Primary/100` (avatar bg) | `#c8dbf0` |
| `Primary/50` (active sidebar bg) | `#e5eff9` |
| `Neutral/Source` | `#374151` |
| `Neutral/50` (`neutral/50`, search bg, col-head bg) | `#f9fafb` |
| `Neutral/0 - White` | `#ffffff` |
| `Neutral/600` | `#4b5563` |
| `Text/Dark` | `#374151` |
| `Text/Light` | `#ffffff` |
| `Text/Hint` (token) | `#374151` — **but rendered as `#6b7280`** for hint/muted text (see Notes) |
| `Text/Primary` | `#003366` |
| `Stroke/50` | `#f9fafb` |
| `Stroke/100` | `#f3f4f6` |
| `Stroke/200` | `#e5e7eb` |
| `font-family/body` · `/heading` · `/label-&-body` | `Noto Sans` |
| `font-size`: label-2 `12`, body-3 `13`, label-1/body-2 `14`, body-1/headline-6 `16`, title-2 `18`, headline-4 `20`, headline-3 `24` |
| `font-weight`: regular `400`, medium `500`, semibold `600`, bold `700` |
| `line-height`: label-2 `16`, label-1/body-2 `20`, body-1/title-2/headline-6 `24`, headline-3 `32` |
| `letter-spacing`: label/body/heading/title `0`; Letter Spacing/3 `0.5`; Letter Spacing/5 `0.4` |
| `radius`: none `0`, xxs `2`, xs `4`, sm `6`, md `8`, lg `12`, xl `16`; `button-corner` `8` |
| `spacing`: none `0`, xxs `2`, xs `4`, sm `8`, md `12`, lg `16`, xl `20`, 2xl `24`, 5xl `48` |
| `Shadows/shadow-md` | `0 2 8 -2 #2121210A; 0 6 8 -2 #21212133` |

---

## Spec table

| Region / Element | Text | Font family | Size px | Weight | Line-height | Text color hex | Background hex | Border hex/width | Radius px | Padding | Gap | Size W×H | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **TOP GOV BAR (Accessibility Bar)** | — | — | — | — | — | — | `#003366` | none | 0 | 4px 24px (y/x) | 18px | 1440 × 40 | full-width strip |
| └ "Government of India" link | Government of India | Noto Sans | 14 | 500 | 20 | `#ffffff` | — | — | — | — | 2px | — | + open_in_new 12px icon |
| └ Indian flag | — | — | — | — | — | — | — | — | 2 | — | — | 33 × 22 | |
| └ "Skip to Main Content" | Skip to Main Content | Noto Sans | 14 | 500 | 20 | `#ffffff` | — | — | — | — | 24 | — | nav gap 24 |
| └ Font-size A− A A+ / contrast / a11y / language | English | Roboto/Noto Sans | 12–14 | 500 | normal/20 | `#ffffff` | — | — | sel layer 4 | — | 4 | icons 16–20 | separators rotated 20px |
| **MASTHEAD (Logo and CTAs)** | — | — | — | — | — | — | `#ffffff` | bottom `#f3f4f6` 1px | 0 | 12px 24px (y/x) | 24 | 1440 × ~94 | navbar total H 134 |
| └ menu/open icon | — | — | — | — | — | — | — | — | — | — | — | 32 × 32 | |
| └ National Emblem | — | — | — | — | — | — | — | — | — | — | 12 | 32 × 52 | divider 1px gradient |
| └ BETA badge | BETA | Noto Sans | 10 | 700 | 10 | `#000000` | `#ffd323` | — | 2 | 4px 2px | — | — | tracking 0.5 |
| └ "Government of India" | Government of India | Noto Sans | 12 | 500 | 16 | `#374151` | — | — | — | — | — | — | |
| └ Ministry line | Ministry of Social Justice & Empowerment | Noto Sans | 14 | 500 | 16 | `#374151` | — | — | — | — | — | — | tracking 0.4 |
| └ Department line | Department of Social Justice & Empowerment | Noto Sans | 20 | 700 | 24 | `#374151` | — | — | — | — | — | — | headline-4 |
| └ Digital India logo | — | — | — | — | — | — | — | — | — | — | 24 | 102 × 40 | cobranding gap 24 |
| └ SAMAVESH title | SAMAVESH | Noto Sans | 11.429 | 600 | 11.429 | `#374151` | — | — | — | — | 1.429 | — | subtitle 7.143px reg |
| └ Profile name | Vikas S | Noto Sans | 16 | 600 | 24 | `#374151` | — | — | — | — | 8 | — | Profile block W 230 |
| └ Profile role | Admin | Noto Sans | 13 | 400 | 20 | `#6b7280` | — | — | — | — | — | — | (token says hint) |
| └ Avatar | VS | Noto Sans | 18 | 500 | 24 | `#001933` | `#c8dbf0` | `#f3f4f6` 1px | 8 | 10px 9px | — | 48 × 48 | |
| **SIDEBAR** | — | — | — | — | — | — | `#f9fafb`* | none | 0 | 16 | 12 | 300 × 790 | *Sidebar frame fill n/a from DC; container pad 16, item gap 12 |
| └ Menu item (default) | Dashboard / Manage Financial Year / Manage Ministry / Manage Outcome / Manage Documents / Map Ministry/Schemes / Reports / User Management / Role Management / PFMS Logs | Noto Sans | 14 | 400 | 20 | `#374151` | transparent | — | 16 | 12px 16px | 8 (icon-label) | 268 × 48 | icon 24×24 |
| └ Menu item (ACTIVE) | Manage Scheme | Noto Sans | 14 | 400 | 20 | `#003366` | `#e5eff9` | — | 16 | 12px 16px | 8 | 268 × 48 | active = Primary/50 bg + Text/Primary; icon = reports/active |
| └ Reports item chevron | — | — | — | — | — | — | — | — | — | — | — | 24 × 24 | chevron-right (expandable) |
| **PAGE HEADING ROW** | — | — | — | — | — | — | — | — | — | — | space-between | 1092 × 40 | Frame 32 |
| └ Page title | Scheme List | Noto Sans | 24 | 600 | 32 | `#374151` | — | — | — | — | — | — | headline-3 |
| └ Add Scheme button | Add Scheme | Noto Sans | 14 | 500 | 20 | `#ffffff` | `#003366` | none | 8 | 8px / pl 24 pr 16 | 8 | 147 × 40 | + add icon 16×16 trailing |
| **CARD (table wrapper)** | — | — | — | — | — | — | `#ffffff` | `#e2e8f0` 1px | 14 | 1px | — | 1092 × 1022 | offset 60px below heading row |
| **CARD HEADER** | — | — | — | — | — | — | (inherits white) | bottom `#f3f4f6` 1px* | — | 20px 24px (y/x) | — | 1090 × 80 | Dashboard inner row 1042×40 |
| └ Search field | Search for | Noto Sans | 14 | 400 | 20 | `#6b7280` (hint) | `#f9fafb` | none | 8 | 8/2 inner | 8 | 577 × 40 | search icon 20×20 |
| └ Filter chip ×3 | 2024-25 / All Schemes / All Department | Noto Sans | 14 | 400 | 20 | `#374151` | transparent | `#e5e7eb` 1px | 6 | 8px / pl 8 pr 16 | 4 | 99/125/146 × 36 | arrow-down icon 18×18; row gap 12 |
| **DATA TABLE** | — | — | — | — | — | — | `#ffffff` | `#e5e7eb` 1px | 12 | 0 | col gap 323* | 1042 × 868 | grid cols 400/300/150/100/100 (+88 action) |
| └ Column header | Scheme Name / Ministry/Department / FY / BE / RE | Noto Sans | 16 | 600 | 24 | `#6b7280` (hint) | `#f9fafb` | bottom `#f3f4f6` 1px | — | 16px 24px (y/x) | — | col W × 56 | body-1-semibold |
| └ Body cell (Scheme Name) | e.g. Central Sector Scheme … (22.0) | Noto Sans | 16 | 400 | 24 | `#374151` | `#ffffff` | bottom `#f3f4f6` 1px | — | 24 (all) | — | 400 × 116 | body-1; text-ellipsis, 2-line clamp |
| └ Body cell (Ministry) | e.g. Ministry of Home Affairs | Noto Sans | 16 | 400 | 24 | `#374151` | `#ffffff` | bottom `#f3f4f6` 1px | — | 24 | — | 300 × 116 | |
| └ Body cell (FY) | 2025-2026 | Noto Sans | 16 | 400 | 24 | `#374151` | `#ffffff` | bottom `#f3f4f6` 1px | — | 24 | — | 150 × 116 | |
| └ Body cell (BE / RE) | 1 / 0 / 39.34 / 949.5 … | Noto Sans | 16 | 400 | 24 | `#374151` | `#ffffff` | bottom `#f3f4f6` 1px | — | 24 | — | 100 × 116 | numeric |
| └ Row height | — | — | — | — | — | — | — | — | — | — | — | × 116 | no explicit zebra fill (all white) |
| **ACTION COLUMN (frozen)** | — | — | — | — | — | — | `#ffffff` | none | — | — | — | 88 × 868 | absolute right −1/top −1; drop-shadow `0 6 4 rgba(33,33,33,0.2), 0 2 4 rgba(33,33,33,0.04)` |
| └ Action col header | (empty) | — | — | — | — | — | `#f9fafb` | bottom `#f3f4f6` 1px | — | 16px 24px | — | 88 × 56 | |
| └ Action cell | — | — | — | — | — | — | `#ffffff` | bottom `#f3f4f6` 1px | — | 24 | — | 88 × 116 | |
| └ Icon button (more_vert) | — | — | — | — | — | — | transparent | none | 8 | 8 | — | 40 × 40 | more_vert icon 24×24 |
| **PAGINATION (pagination/large)** | — | — | — | — | — | — | — | — | — | 0 | 8 | 1042 × 32 | space-between |
| └ Prev/next arrow btn | — | — | — | — | — | — | — | — | 4 | 8 | — | 16 icon | prev opacity 0.5 (disabled) |
| └ Active page | 1 | Noto Sans | 14 | 500 | 20 | `#374151` | `#ffffff` | `#003366` 1px | 8 | 6px 8px | — | — | current page |
| └ Inactive page | 2 3 4 5 6 … 150 | Noto Sans | 14 | 400 | 20 | `#6b7280` | transparent | none | 8 | 6px 8px | 2 (between) | — | |
| └ "Showing" / "of 1500 items" | Showing · of 1500 items | Noto Sans | 13 | 400 | 20 | `#6b7280` | — | — | — | — | 8 | — | body-3 |
| └ Items-per-page dropdown | 200 | Noto Sans | 14 | 400 | 20 | `#374151` | transparent | `#e5e7eb` 1px | 8 | 8px / pl 16 pr 8 | 4 | × 32 | trailing icon 20×20 |

---

## Layout (exact px)

- **Frame:** 1440 × 1268.
- **Navbar:** 1440 × 134 (Accessibility Bar 40 + Masthead ~94).
- **Body (below navbar):** 1440 wide. Sidebar 300 wide (left, x=0); Container (content) 1140 wide at x=300.
- **Content area:** 1140 wide, starts y=118 inside container (height 1130).
- **Inner Container padding:** 24 (all sides) → content width 1092.
- **Heading row → Card gap:** Card top y=60 (heading row is 40 high at y=0 → 20px gap).
- **Card:** 1092 × 1022, border `#e2e8f0` 1px, radius 14, inner pad 1px.
- **Card header:** 1090 × 80, inner padding 20 (y) / 24 (x); inner dashboard row 1042 × 40.
- **Card body:** 1090 × 940; inner container pad-left 24 → table region 1042 wide.
- **Table:** 1042 × 868, radius 12, border `#e5e7eb` 1px.
- **Column widths:** Scheme Name 400 · Ministry/Department 300 · FY 150 · BE 100 · RE 100 · Action 88 (frozen, overlaps right edge).
- **Header row height:** 56. **Body row height:** 116.
- **Col-head padding:** 16 (y) / 24 (x). **Cell padding:** 24 (all).
- **Pagination:** 1042 × 32, at y=884 inside body (gap 16 below table 868).
- **Content section spacing:** heading↔card 20; card-header↔body via 1px divider; table↔pagination 16.

---

## Notes / QC flags

- **Text/Hint token mismatch:** the `Text/Hint` variable resolves to `#374151` in get_variable_defs, but every hint/muted string in the generated code (search placeholder, column headers, profile role, pagination meta, inactive pages) renders as **`#6b7280`**. Treat `#6b7280` as the rendered hint color; flag the token definition as inconsistent.
- **Card border color `#e2e8f0`** is a raw hex (not one of the Stroke/* tokens `#f3f4f6`/`#e5e7eb`/`#f9fafb`). Flag as off-token.
- **Column headers use body-1-semibold (16/600)**, not a smaller label style — larger than typical table headers.
- **Action column is frozen/floating** (absolute, right −1, top −1) with a drop shadow; its shadow values (`0 6 4 rgba(33,33,33,0.2)`, `0 2 4 rgba(33,33,33,0.04)`) differ from the `Shadows/shadow-md` token.
- **No status chips / badges present** on this screen (the filter "chips" are outline dropdown pills, not status chips). Pagination dropdown supports an optional danger badge `#d64539` but `badge=false` here.
- **No tabs** on this screen.
- Search field shows placeholder "Search for " (trailing space, truncated label).
- Pagination shows page 1 active, up to "150", "Showing 200 of 1500 items".
- `*` Table inner `gap-[323px]` is an auto-layout artifact between the scroll table and the frozen action column; not a real content gap.
- Sidebar frame's own fill is not exposed by get_design_context (container appears `#f9fafb`-ish vs masthead white) — listed as `n/a`/approx; verify against live.

## Regions NOT extractable / excluded
- Quick Actions benefits cards (`4226:40572`) — **hidden** in Figma, excluded.
- My Submissions card + its table/pagination (`4226:40580`) — **hidden** in Figma, excluded.
- Sidebar container background fill — not returned by design context (`n/a`).
