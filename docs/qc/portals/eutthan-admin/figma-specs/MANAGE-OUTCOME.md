# Figma Exact Spec — ADMIN / MANAGE OUTCOME

- **Portal:** MoSJE eUtthan Admin
- **Screen:** ADMIN / MANAGE OUTCOME (`SLUG: MANAGE-OUTCOME`)
- **File key:** `gH2vQ62cfg4677YKWuOpLc`
- **Node id:** `4226-40657` (frame name in Figma: "ADMIN / MANGAGE OUTCOME" [sic])
- **Frame size:** 1440 × 1268 px
- **Source of truth:** Figma handoff. EXACT values only (hex, px, weight). `n/a` = not exposed by Figma MCP.
- **Page title text:** "Scheme wise Outcome List"

> Note: The screen frame contains two hidden/secondary frames ("Sub Section / Quick Actions" benefits cards `4226:40780`, and a second "My Submissions" card `4226:40788`). Both are `hidden="true"` in this screen and are NOT rendered here. They are documented at the bottom under "Hidden frames" for completeness but are not part of the live MANAGE-OUTCOME layout.

---

## Tokens / variables used

| Token | Value |
|---|---|
| `font-family/body` | Noto Sans |
| `font-family/heading` | Noto Sans |
| `font-size/headline-3` | 24 |
| `font-size/title-2` | 18 |
| `font-size/body-1` | 16 |
| `font-size/body-2` | 14 |
| `font-size/body-3` | 13 |
| `font-size/label-1` | 14 |
| `font-size/label-2` | 12 |
| `font-size/label-3` | 11 (badge, hidden) |
| `font-weight/regular` | Regular (400) |
| `font-weight/medium` | Medium (500) |
| `font-weight/semibold` | SemiBold (600) |
| `font-weight/bold` | Bold (700) |
| `line-height/headline-3` | 32 |
| `line-height/title-2` | 24 |
| `line-height/body-1` | 24 |
| `line-height/body-2` | 20 |
| `line-height/body-3` | 20 |
| `line-height/label-1` | 20 |
| `letter-spacing/*` (body/heading/title/label) | 0 |
| `Primary/Source` / `Text/Primary` | #003366 |
| `Primary/50` | #e5eff9 |
| `Primary/100` | #c8dbf0 |
| `Primary/800` | #001933 |
| `Neutral/Source` | #374151 |
| `Neutral/50` | #f9fafb |
| `Neutral/0 - White` | #ffffff |
| `Text/Dark` / `Text/Hint` (token) | #374151 |
| `Text/Hint` (rendered in code) | #6b7280 |
| `Text/Light` | #ffffff |
| `Stroke/50` | #f9fafb |
| `Stroke/100` | #f3f4f6 |
| `Stroke/200` | #e5e7eb |
| `danger/source` (badge, hidden) | #d64539 |
| `spacing-none` | 0 |
| `spacing-xxs` | 2 |
| `spacing-xs` | 4 |
| `spacing-sm` | 8 |
| `spacing-md` | 12 |
| `spacing-lg` | 16 |
| `spacing-xl` | 20 |
| `spacing-2xl` | 24 |
| `spacing-5xl` | 48 |
| `radius-none` | 0 |
| `radius-xxs` | 2 |
| `radius-xs` | 4 |
| `radius-sm` | 6 |
| `radius-md` | 8 |
| `radius-lg` | 12 |
| `radius-xl` | 16 |
| `button-corner` | 8 |
| `Shadows/shadow-md` | DROP_SHADOW #2121210A 0/2 r8 s-2; DROP_SHADOW #21212133 0/6 r8 s-2 |

> Token vs rendered-color caveat: `Text/Dark`, `Text/Hint`, and `Text/Hint`-bound text resolve to **#374151** as a variable, but Figma's generated code renders several hint/placeholder texts as literal **#6b7280** and the heading-3 "dark" as **#374151**. Both are listed per-element below.

---

## Element spec table

| Region / Element | Text | Font family | Size px | Weight | Line-height | Text color hex | Background hex | Border hex / width | Radius px | Padding | Gap | Size W×H | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Top gov bar** (navbar upper strip) | "Government of India" · "Skip to Main Content" · A-/A/A+ · contrast · a11y · "English" | Noto Sans | n/a (instance, not drilled) | n/a | n/a | #ffffff | #003366 (Primary/Source) | none | 0 | n/a | n/a | 1440 × ~40 | Shared `navbar` instance `4226:40658`; internals not exposed by MCP. Color/height from screenshot + token. |
| **Masthead** (navbar lower strip) | "BETA" · "Government of India / Ministry of Social Justice & Empowerment / Department of Social Justice & Empowerment" · Digital India · SAMAVESH · "Vikas S / Admin / VS" | Noto Sans | n/a | Dept line bold | n/a | #374151 | #ffffff | bottom hairline (visual) | n/a | n/a | n/a | 1440 × ~94 | Total navbar 1440 × 134. BETA chip = gov-yellow. Avatar "VS" on Primary/50 #e5eff9 tile. Internals not drilled (instance too large). |
| **Sidebar container** | — | — | — | — | — | — | #ffffff | none | 0 | 16 (p) | 12 (between items) | 300 × 908 (panel) / type-1 300×790 | `9040:30911` / `sidebar/type-1` `9040:30924`. Menu inner width 268. |
| Sidebar item (default) | Dashboard / Manage Financial Year / Manage Ministry / Manage Scheme / Manage Documents / Map Ministry/Schemes / Reports / User Management / Role Management / PFMS Logs | Noto Sans | 14 (body-2) | Regular 400 | 20 | #374151 | transparent | none | 16 (radius-xl) | px 16 / py 12 | 8 (icon↔label) | 268 × 48 | Icon 24×24. Row inner. |
| Sidebar item (**active** = Manage Outcome) | "Manage Outcome" | Noto Sans | 14 (body-2) | Regular 400 | 20 | #003366 (Text/Primary) | #e5eff9 (Primary/50) | none | 16 (radius-xl) | px 16 / py 12 | 8 | 268 × 48 | Active fill = Primary/50; label text = Primary. Icon "outcome" 24×24. |
| Sidebar "Reports" item | "Reports" | Noto Sans | 14 | Regular 400 | 20 | #374151 | transparent | none | 16 | px16/py12 | 8 | 268 × 48 | Has trailing chevron-right 24×24 (expandable). |
| **Page heading** | "Scheme wise Outcome List" | Noto Sans (heading) | 24 (headline-3) | SemiBold 600 | 32 | #374151 (Text/Dark) | transparent | none | 0 | n/a | n/a | text 313 × 32 | Heading row `Frame 32` 1092 × 40; container 935 wide. |
| **Action button** "Add Outcome" | "Add Outcome" | Noto Sans (body) | 14 (label-1) | Medium 500 | 20 | #ffffff (Text/Light) | #003366 (Primary/Source) | none | 8 (button-corner) | pl 24 / pr 16 / py 8 | 8 (label↔icon) | 157 × 40 | Trailing "+" icon 16×16. |
| **Card** (table wrapper) | — | — | — | — | — | — | #ffffff | #e2e8f0 / 1px | 14 | 1px (p-px) | 0 | 1092 × 1022 | `4226:40669`. Sits 60px below heading row. |
| **Card header** | — | — | — | — | — | — | #ffffff | bottom divider (CardHeader frame) | n/a | px 24 / py 20 | 20 (col gap) | 1090 × 80 | Contains search + filter chips row (Dashboard 1042×40). |
| **Search** field | placeholder "Search for " | Noto Sans (body) | 14 (body-2) | Regular 400 | 20 | #6b7280 (hint) | #f9fafb (Neutral/50) | none | 8 (radius-md) | input pl 8 / pr 2 / py 2 | 8 (icon↔text) | 577 × 40 | Search icon 20×20. Inner content pr 16. |
| **Filter chip** (×3) | "2024-25" · "All Schemes" · "All Department" | Noto Sans (body) | 14 (body-2) | Regular 400 | 20 | #374151 (Text/Dark) | transparent | #e5e7eb (Stroke/200) / 1px | 6 (radius-sm) | pl 8 / pr 16 / py 8 | 4 (arrow↔label) | 99 / 125 / 146 × 36 | Leading arrow-down icon 18×18. Chip row gap 12. |
| **Table** | — | — | — | — | — | — | transparent | per-row bottom dividers | 0 | 0 | 0 | 1042 × 868 | Columns: Scheme Name 400, Ministry/Dept 300, FY 150, Scheme Type 100, RE 100, (actions col) 88. |
| Table **col header** | "Scheme Name" / "Ministry/Department" / "FY" / "Scheme Type" / "RE" | Noto Sans (body) | 16 (body-1) | SemiBold 600 | 24 | #6b7280 (Text/Hint rendered) | #f9fafb (Neutral/50) | bottom #f3f4f6 (Stroke/100) / 1px | 0 | px 24 / py 16 | 0 | col-width × 56 | Header row height 56. |
| Table **body cell** (text) | e.g. "Central Sector Scheme for Conservation… (22.0)" / "Ministry of Home Affairs" / "Central Sector" / "0" | Noto Sans (body) | 16 (body-1) | Regular 400 | 24 | #374151 (Text/Dark) | transparent (cell bg) | bottom #f3f4f6 (Stroke/100) / 1px | 0 | 24 (all sides) | 0 | col-width × 116 | Row height 116. Text vertically centered; long text wraps to 2 lines (text-ellipsis/overflow-hidden). NO zebra striping (all cells transparent). |
| Table **FY cell** | "2025-2026" | Noto Sans (body) | 16 (body-1) | Regular 400 | 24 | #374151 | transparent | bottom #f3f4f6 / 1px | 0 | 24 | 0 | 150 × 116 | |
| **Actions column header** | (empty) | — | — | — | — | — | #f9fafb (Neutral/50) | bottom #f3f4f6 / 1px | 0 | px 24 / py 16 | 0 | 88 × 56 | Empty label cell. |
| **Action icon button** (row "⋮") | more_vert (kebab) | — | — | — | — | icon #374151 | transparent | none | 8 (radius-md) | 8 (all) | 0 | button 40×40 (icon 24×24) | One per row in 88px actions column; cell 88×116. |
| **Status chips** | — | — | — | — | — | — | — | — | — | — | — | n/a | **Not present** on this screen — no status/state chips rendered in the table. |
| **Pagination** (`pagination/large`) | "1 2 3 4 5 6 … 150" · "Showing" · "200" · "of 1500 items" | Noto Sans | see below | see below | see below | see below | — | — | — | py 0 | 8 (page gap) | 1042 × 32 | Sits 884px into Body. Prev arrow opacity 50% (disabled). |
| Pagination — active page "1" | "1" | Noto Sans | 14 | Medium 500 | 20 | #374151 (Text/Dark) | #ffffff (Neutral/0) | #003366 (Primary/Source) / 1px | 8 (radius-md) | px 8 / py 6 | — | hug | Selected page. |
| Pagination — inactive page | "2"…"150", "…" | Noto Sans | 14 | Regular 400 | 20 | #6b7280 (Text/Hint) | transparent | none | 8 | px 8 / py 6 | — | hug | Page-number gap 2. |
| Pagination — "Showing" / "of 1500 items" | "Showing" · "of 1500 items" | Noto Sans (body) | 13 (body-3) | Regular 400 | 20 | #6b7280 (Text/Hint) | transparent | none | 0 | 0 | 8 (items-control gap) | hug | |
| Pagination — items dropdown | "200" | Noto Sans (body) | 14 (body-2) | Regular 400 | 20 | #374151 (Text/Dark) | transparent | #e5e7eb (Stroke/200) / 1px | 8 (radius-md) | pl 16 / pr 8 / py 8 | 4 | 32 (h) | Trailing chevron 20×20. |
| Pagination — prev/next arrow | icon | — | — | — | — | — | transparent | none | 4 (radius-xs) | 8 | 0 | 16 (icon) | Prev shown at opacity 0.5 (disabled). |

---

## Layout (exact px)

| Property | Value |
|---|---|
| Screen frame | 1440 × 1268 |
| Navbar (top gov bar + masthead) | 1440 × 134 (full-bleed) |
| Sidebar panel width | 300 (sidebar/type-1 inner padding 16 → menu 268) |
| Sidebar vertical offset | starts at y=134 (below navbar) |
| Content container (right of sidebar) | x=300, width 1140, full height 1268 |
| Content frame top offset | y=118 (Content starts; Container inside padded 24) |
| Inner content padding | 24 (all sides of Container `4226:40664`, → inner width 1092) |
| Content max-width (usable) | 1092 |
| Heading row (`Frame 32`) | 1092 × 40 |
| Heading → Card gap | 20 (Card at y=60 within Container, heading 0–40) |
| Card | 1092 × 1022 |
| Card header | 1090 × 80 (px 24 / py 20) |
| Card header → table column gap | 20 (between search and chips block: chip row gap 12) |
| Card body | 1090 × 940, inner Container padded 24 → table 1042 |
| Table | 1042 × 868 |
| Table row height (header) | 56 |
| Table row height (body cells) | 116 |
| Cell padding | 24 all sides |
| Actions column width | 88 (separate `Col` at x=954) |
| Pagination | 1042 × 32, offset y=884 inside Body |
| Sidebar item gap | 12 |
| Filter chip row gap | 12 |
| Pagination page-number gap | 2; page-control gap 8 |

---

## Column widths (table, exact)

| Column | x | width |
|---|---|---|
| Scheme Name | 0 | 400 |
| Ministry/Department | 400 | 300 |
| FY | 700 | 150 |
| Scheme Type | 850 | 100 |
| RE | 950 | 100 |
| Actions (kebab) | 954 (separate Col frame) | 88 |

---

## Hidden frames (NOT rendered on this screen — documented for completeness)

- `4226:40780` **Sub Section / "Quick Actions"** — heading "Quick Actions" (body-2-ish), divider line 988×1, three `benefits` cards 348 wide. `hidden=true`.
- `4226:40788` **Card / "My Submissions"** — second table (Activity / Activity Date / Participants / Male Participants / Female Participants), its own search + 2 chips + pagination + scroll bar. `hidden=true`.

---

## Regions NOT fully extractable

- **Top gov bar** and **Masthead** internals: the `navbar` is a single shared component instance (`4226:40658`, 1440×134) whose `get_design_context` exceeds the MCP token limit and whose `get_metadata` exposes no child node IDs. Exact per-element font sizes/paddings inside the navbar are `n/a`; color (#003366 bar, #ffffff text/masthead) and total height (134; bar ≈40) taken from the rendered screenshot + bound tokens.
