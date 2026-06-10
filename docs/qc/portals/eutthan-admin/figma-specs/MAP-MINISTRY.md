# Figma Design Spec — ADMIN / MAP MINISTRY (Mapped state)

> **SLUG:** MAP-MINISTRY
> **File key:** `gH2vQ62cfg4677YKWuOpLc`
> **Node id:** `4226-41073` (frame "ADMIN / MAP MINISTRY / Mapped", 1440 × 1268)
> **Source of truth:** Figma handoff. All values are EXACT from Figma variables / node properties. `n/a` = not available from handoff.
> Font: **Noto Sans** throughout (Roboto used only for the "English" label in the top gov bar). Letter-spacing 0 unless noted.

---

## Tokens / variables used

| Token | Value |
|---|---|
| Primary/Source (gov blue) | `#003366` |
| Primary/50 | `#e5eff9` |
| Primary/100 | `#c8dbf0` |
| Primary/800 | `#001933` |
| Text/Dark | `#374151` |
| Text/Primary | `#003366` |
| Text/Hint | `#374151` (token) — rendered as `#6b7280` on most hint text |
| Text/Light | `#ffffff` |
| Neutral/0 - White | `#ffffff` |
| Neutral/50 | `#f9fafb` |
| Neutral/200 | `#e5e7eb` |
| Neutral/600 | `#4b5563` |
| Stroke/100 | `#f3f4f6` |
| Stroke/200 | `#e5e7eb` |
| Stroke/300 | `#d1d5db` |
| gov-yellow (BETA chip) | `#ffd323` |
| Danger/Source | `#d64539` |
| Shadows/shadow-xs | drop-shadow `#2121211F`, offset (0,2), radius 3, spread 1 |
| Shadows/shadow-md | `#2121210A` (0,2) r8 s-2; `#21212133` (0,6) r8 s-2 |
| radius-xxs / xs / sm / md / lg / xl | 2 / 4 / 6 / 8 / 12 / 16 |
| button-corner | 8 |
| spacing-xxs/xs/sm/md/lg/xl/2xl/5xl | 2 / 4 / 8 / 12 / 16 / 20 / 24 / 48 |
| font-size body-3/body-2/body-1/label-2/label-1/title-2/headline-4/headline-3 | 13 / 14 / 16 / 12 / 14 / 18 / 20 / 24 |
| line-height body-3/body-2/body-1/label-2/label-1/title-2/headline-3 | 20 / 20 / 24 / 16 / 20 / 24 / 32 |
| Letter Spacing/3 / /5 | 0.5 / 0.4 |

---

## Layout

| Property | Exact value |
|---|---|
| Frame width × height | 1440 × 1268 |
| Navbar (top region) | full-width 1440 × 134 |
| Sidebar width | 300 (rail); inner menu content 268 wide |
| Content container left offset | 300 (starts after sidebar) |
| Content container width | 1140 |
| Content top offset (below navbar) | 118 |
| Inner content padding | 24 (all sides) — content area 1092 wide |
| Tabs → heading gap | heading frame at y=64 (20px below 44px tabs) |
| Heading → Card gap | Card at y=116 (heading band is 32 tall at y=64) |
| Card width × height | 1092 × 1022 |
| Card border / radius | 1px inset all sides (content inset 1,1 → 1090 inner); radius n/a (rounded card) |
| CardHeader height | 80 (padding 24 horiz / 20 vert) |
| Table left/right inner padding | 24 (Body container is 1042 wide inside 1090) |
| Data column width (4 equal text cols) | 260.5 each |
| Action column width | 158 |
| Table header row height | 56 |
| Table body row (cell) height | 116 |
| Pagination row | 1042 × 32, at y=884 inside Body |
| Section spacing (chips gap) | 12 (spacing-md) between filter chips |
| Sidebar item vertical gap | 12 (spacing-md); sidebar padding 16 (spacing-lg) |

---

## Element spec table

| Region / Element | Text | Font family | Size px | Weight | Line-height | Text color hex | Background hex | Border hex / width | Radius px | Padding | Gap | Size W×H | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Top gov bar (Accessibility Bar)** | — | — | — | — | — | — | `#003366` | none | 0 | px 24, py 4 | — | 1440×40 | full-width, items space-between |
| Gov bar link | Government of India | Noto Sans | 14 | Medium (500) | 20 | `#ffffff` | — | — | — | — | gap 2 (link+icon) | — | external link, open_in_new 12px icon |
| Gov bar — Skip to Main Content | Skip to Main Content | Noto Sans | 14 | Medium (500) | 20 | `#ffffff` | — | — | — | — | nav gap 24 | — | — |
| Gov bar — font-size selector active layer | — | — | — | — | — | — | `#e5eff9` @10% opacity | — | 4 | — | — | 32×32 | A− / A / A+ controls |
| Gov bar — language | English | Roboto | 12 | Medium (500) | normal | `#ffffff` | — | — | — | — | gap 4 | — | language + arrow_drop_down 20px |
| **Masthead (Logo and CTAs)** | — | — | — | — | — | — | `#ffffff` | bottom `#f3f4f6` / 1px | 0 | px 24, py 12 | gap 24 | 1440×~94 | menu/open icon 32px at left |
| Masthead — BETA chip | BETA | Noto Sans | 10 | Bold (700) | 10 | `#000000` | `#ffd323` | — | 2 | px 4, py 2 | — | — | letter-spacing 0.5 |
| Masthead — line 1 | Government of India | Noto Sans | 12 | Medium (500) | 16 | `#374151` | — | — | — | — | — | — | — |
| Masthead — line 2 | Ministry of Social Justice & Empowerment | Noto Sans | 14 | Medium (500) | 16 | `#374151` (#1f2937 fallback) | — | — | — | — | — | — | letter-spacing 0.4 |
| Masthead — line 3 | Department of Social Justice & Empowerment | Noto Sans | 20 | Bold (700) | 24 | `#374151` | — | — | — | — | — | — | National Emblem 32×52 + 1px gradient divider |
| Masthead — SAMAVESH title | SAMAVESH | Noto Sans | 11.429 | SemiBold (600) | 11.429 | `#374151` (#1f2937) | — | — | — | — | — | — | logo 40×40 |
| Masthead — SAMAVESH subtitle | Single Access Mechanism for All Verticals of Empowerment & Social Harmony | Noto Sans | 7.143 | Regular (400) | 10 | `#374151` | — | — | — | — | — | — | two lines |
| Masthead — profile name | Vikas S | Noto Sans | 16 | SemiBold (600) | 24 | `#374151` | — | — | — | — | profile gap 8 | — | right-aligned |
| Masthead — profile role | Admin | Noto Sans | 13 | Regular (400) | 20 | `#6b7280` | — | — | — | — | — | — | — |
| Masthead — avatar | VS | Noto Sans | 18 | Medium (500) | 24 | `#001933` | `#c8dbf0` | `#f3f4f6` / 1px | 8 | px 9, py 10 | — | 48×48 | — |
| **Sidebar (rail)** | — | — | — | — | — | — | n/a (transparent) | — | — | 16 (spacing-lg) | items gap 12 | 300×908; menu 268 | type-1 |
| Sidebar — inactive item label | Dashboard / Manage Financial Year / Manage Ministry / Manage Scheme / Manage Outcome / Manage Documents / Reports / User Management / Role Management / PFMS Logs | Noto Sans | 14 | Regular (400) | 20 | `#374151` | transparent | — | 16 (radius-xl) | px 16, py 12 | icon gap 8 | row 268×48 | icon 24px |
| Sidebar — ACTIVE item | Map Ministry/Schemes | Noto Sans | 14 | Regular (400) | 20 | `#003366` (Text/Primary) | `#e5eff9` (Primary/50) | none | 16 | px 16, py 12 | gap 8 | 268×48 | icon = `account_tree` (Material Symbols Rounded Light) 24px, color `#003366` |
| Sidebar — Reports (has submenu) | Reports | Noto Sans | 14 | Regular (400) | 20 | `#374151` | transparent | — | 16 | px 16, py 12 | gap 8 | 268×48 | trailing chevron-right 24px |
| **Tabs (tabs/primary)** | — | — | — | — | — | — | `#e5e7eb` (Neutral/200) | `#d1d5db` / 1px | 8 (md) | p 4 | — | 203×44 | segmented control |
| Tab — ACTIVE | Ministry | Noto Sans | 14 | Medium (500) | 20 | `#ffffff` | `#003366` (active indicator) | — | 4 | px 20, py 8 | gap 8 | — | shadow `0 2 3 1 rgba(33,33,33,0.12)` |
| Tab — inactive | Schemes | Noto Sans | 14 | Medium (500) | 20 | `#6b7280` | transparent | — | 4 | px 20, py 8 | gap 8 | — | — |
| **Page heading** | Mapped Ministry List | Noto Sans | 24 | SemiBold (600) | 32 | `#374151` | — | — | — | — | — | band 1092×32 | Headline-3 |
| **CardHeader — Search** | Search for | Noto Sans | 14 | Regular (400) | 20 | `#6b7280` (placeholder) | `#f9fafb` (Neutral/50) | none | 8 (md) | input pl 8, pr 2, py 2 | icon gap 8 | 577×40 | leading search icon 20px |
| CardHeader — Filter chip 1 | Mapped | Noto Sans | 14 | Regular (400) | 20 | `#374151` | `#ffffff` | `#e5e7eb` / 1px | 6 (sm) | pl 8, pr 16, py 8 | gap 4 | 101×36 | leading arrow-down 18px |
| CardHeader — Filter chip 2 | All Financial Year | Noto Sans | 14 | Regular (400) | 20 | `#374151` | `#ffffff` | `#e5e7eb` / 1px | 6 | pl 8, pr 16, py 8 | gap 4 | 157×36 | arrow-down 18px; chips gap 12 |
| **Table — Col Head** (all 4 + action) | Ministry Name / PFMS Ministry / Financial Year / Type | Noto Sans | 16 | SemiBold (600) | 24 | `#6b7280` | `#f9fafb` (Neutral/50) | bottom `#f3f4f6` / 1px | 0 | px 24, py 16 | — | 260.5×56 | Body-1 semibold |
| Table — Col Head (action col) | (empty) | — | — | — | — | — | `#f9fafb` | bottom `#f3f4f6`/1px | 0 | px 24, py 16 | — | 158×56 | — |
| **Table — Body cell (1-line)** | e.g. Ministry of Power / 2025-2026 / Mapped | Noto Sans | 16 | Regular (400) | 24 | `#374151` | transparent | bottom `#f3f4f6` / 1px | 0 | p 24 | — | 260.5×116 | Body-1; text ellipsis |
| Table — Body cell (2-line) | e.g. Ministry of Agriculture and Farmers' Welfare | Noto Sans | 16 | Regular (400) | 24 | `#374151` | transparent | bottom `#f3f4f6`/1px | 0 | p 24 | — | 260.5×116 | wraps to 2 lines (48 tall text) |
| **Status / Type value** | Mapped | Noto Sans | 16 | Regular (400) | 24 | `#374151` | transparent | none | — | p 24 | — | in 260.5×116 cell | NOT a chip — plain body text in the "Type" column |
| **Action button (Unmap)** | Unmap | Noto Sans | 14 | Medium (500) | 20 | `#003366` (Text/Primary) | transparent | none | 8 (button-corner) | pl 20, pr 16, py 10 | gap 8 | 110×40 | trailing `link_off` icon 16px; in Button Group (gap 12) |
| **Pagination — prev/next arrow** | (icon) | — | — | — | — | — | transparent | — | 4 | p 8 | — | icon 16px | prev disabled @50% opacity |
| Pagination — active page | 1 | Noto Sans | 14 | Medium (500) | 20 | `#374151` | `#ffffff` | `#003366` / 1px | 8 (md) | px 8, py 6 | — | — | gap 2 between page numbers |
| Pagination — inactive page | 2 … 150 / "..." | Noto Sans | 14 | Regular (400) | 20 | `#6b7280` | transparent | none | 8 | px 8, py 6 | — | — | — |
| Pagination — "Showing" / "of 1500 items" | Showing / of 1500 items | Noto Sans | 13 | Regular (400) | 20 | `#6b7280` | — | — | — | — | items gap 8 | — | Body-3 |
| Pagination — items dropdown | 200 | Noto Sans | 14 | Regular (400) | 20 | `#374151` | transparent | `#e5e7eb` / 1px | 8 (md) | pl 16, pr 8, py 8 | gap 4 | h 32 | trailing chevron 20px |

---

## Notes / observations

- The **"Type" column value "Mapped" is plain Body-1 text** (`#374151`, 16px regular), **not** a styled status chip/badge. There is no pill/background on the status in this frame.
- The action control is a single **"Unmap"** ghost/text button (`#003366`, no fill, no border) with a trailing `link_off` icon. The Button Group holds a second hidden button variant (the "Map" / mapped-counterpart, hidden in this state).
- Table is built as 5 fixed columns (4 × 260.5 text + 1 × 158 action), not a CSS grid; header row 56px, body rows 116px each.
- Header search bar instance is 577px wide here (component default is 358px) and uses Neutral/50 `#f9fafb` fill.
- Filter chips use **white** fill with Stroke/200 `#e5e7eb` border (radius 6), distinct from the search field's Neutral/50 fill.
- "Text/Hint" token resolves to `#374151` in the variable table, but the generated handoff code renders hint/placeholder/secondary text as `#6b7280` (gray-500). Both noted; treat `#6b7280` as the rendered value for placeholder, col-head, role, pagination secondary text.
- Sidebar active state is background-only (`#e5eff9`) with primary text/icon — no left accent bar in this component.

## Regions NOT extractable / not present in this frame

- **Transfer/dual-list mapping UI (lists, columns, move controls, checkboxes):** NOT present. This "Mapped" state is a **read-back table** of already-mapped ministries; there is no dual-pane transfer widget or checkbox column in the frame. (The actual map/assign interaction lives on a different node/state.)
- **Quick Actions "Sub Section"** (node 4226:41198) and a **second "My Submissions" Card** (node 4226:41206) exist in the frame but are **hidden** (`hidden="true"`) — excluded as non-rendered.
- Card outer corner-radius value: not surfaced as a token in handoff (rounded card, exact radius `n/a`).
- Exact card drop-shadow assignment for the main Card: `n/a` (shadow-xs / shadow-md tokens defined in file but not explicitly bound in returned code).
