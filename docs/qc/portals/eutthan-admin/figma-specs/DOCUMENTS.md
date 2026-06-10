# Figma Design Spec — ADMIN / DOCUMENTS (Manage Documents)

> **Source of truth:** Figma handoff. EXACT values only (hex, px, weights). `n/a` = not available from handoff.
>
> - **File key:** `gH2vQ62cfg4677YKWuOpLc`
> - **Screen / Frame:** `ADMIN / DOCUMENTS` — node `4226:42902`
> - **Slug:** `DOCUMENTS`
> - **Frame size:** 1440 × 1268 px (desktop)
> - **Extracted via:** `get_variable_defs` + `get_metadata` + `get_design_context` (forceCode) per region.

---

## Tokens / variables used

| Token | Value |
|---|---|
| `font-family/body` · `font-family/heading` · `Font Family/Headings` | Noto Sans |
| `font-size/headline-3` | 24 px |
| `font-size/headline-4` | 20 px |
| `font-size/title-2` | 18 px |
| `font-size/body-1` | 16 px |
| `font-size/body-2` | 14 px |
| `font-size/body-3` | 13 px |
| `font-size/label-1` | 14 px |
| `font-size/label-2` | 12 px |
| `font-size/label-3` | 11 px |
| `line-height/headline-3` | 32 px |
| `line-height/headline-6` | 24 px |
| `line-height/title-2` | 24 px |
| `line-height/body-1` | 24 px |
| `line-height/body-2` | 20 px |
| `line-height/body-3` | 20 px |
| `line-height/label-1` | 20 px |
| `line-height/label-2` | 16 px |
| `line-height/label-3` | 16 px |
| `Line Heights/11` | 16 px |
| `font-weight/regular / medium / semibold / bold` | 400 / 500 / 600 / 700 |
| `letter-spacing/heading · /body · /label · /title` | 0 px |
| `Letter Spacing/5` | 0.4 px |
| `Primary/Source` · `Text/Primary` | #003366 (`#036`) |
| `Primary/800` | #001933 |
| `Primary/50` | #e5eff9 |
| `Primary/100` | #c8dbf0 |
| `Primary Transparent/16%` | #00336629 |
| `Text/Dark` · `Neutral/Source` | #374151 (also rendered #1f2937 in masthead) |
| `Text/Hint` (rendered) | #6b7280 |
| `Text/Light` · `Neutral/0 - White` | #ffffff |
| `Text/Error` · `Danger/Source` | #d64539 |
| `Neutral/50` · `Stroke/50` | #f9fafb |
| `Stroke/100` | #f3f4f6 |
| `Stroke/200` · `Neutral/200` | #e5e7eb |
| `Neutral/600` | #4b5563 |
| Gov top bar accent | #ffd323 |
| `spacing-xxs / xs / sm / md / lg / xl / 2xl / 5xl` | 2 / 4 / 8 / 12 / 16 / 20 / 24 / 48 px |
| `radius-xxs / xs / sm / md / lg / xl` | 2 / 4 / 6 / 8 / 12 / 16 px |
| `button-corner` | 8 px |
| `Shadows/shadow-s` | 0 1 3 1 #2121211A; 0 4 4 0 #2121211F |

---

## Element spec table

| Region / Element | Text | Font family | Size px | Weight | Line-height | Text color hex | Background hex | Border hex/width | Radius px | Padding | Gap | Size W×H | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Top gov bar** (accent strip) | — | — | — | — | — | — | #ffd323 | n/a | 0 | n/a | n/a | 52 px tall band |
| Masthead line 1 | Ministry of Social Justice & Empowerment | Noto Sans | 14 | 500 (Medium) | 16 | #1f2937 | — | — | — | — | — | n/a | letter-spacing 0.4 px |
| Masthead line 2 | Department of Social Justice & Empowerment | Noto Sans | 20 | 700 (Bold) | 24 | #374151 | — | — | — | — | — | n/a | heading |
| Brand wordmark | SAMAVESH | n/a | n/a | n/a | 11.429 | n/a | — | — | — | — | — | n/a | logo lockup |
| Profile name | Vikas S | Noto Sans | 16 | n/a | 24 | n/a | #ffffff | — | — | — | — | n/a | profile chip |
| Profile role | Admin | Noto Sans | 13 | n/a | 20 | n/a | — | — | — | — | — | n/a | — |
| **Navbar** (whole) | — | — | — | — | — | — | #ffffff | — | — | — | — | 1440 × 134 | incl. accessibility bar + nav row |
| **Sidebar** (container) | — | — | — | — | — | — | n/a | — | — | 16 (p-lg) | 12 (md) | 300 × 908 | inner menu width 268 |
| Sidebar item (default) | e.g. Dashboard | Noto Sans | 14 | 400 | 20 | #374151 | transparent | — | 16 (xl) | px 16 / py 12 | 8 (icon-label) | 268 × 48 | icon 24×24 |
| Sidebar item (**active** = Manage Documents) | Manage Documents | Noto Sans | 14 | 400 | 20 | #003366 | #e5eff9 | — | 16 (xl) | px 16 / py 12 | 8 | 268 × 48 | active row pill bg Primary/50; icon `document/active` |
| Sidebar nav labels (order) | Dashboard · Manage Financial Year · Manage Ministry · Manage Scheme · Manage Outcome · **Manage Documents** · Map Ministry/Schemes · Reports (chevron) · User Management · Role Management · PFMS Logs | Noto Sans | 14 | 400 | 20 | #374151 | — | — | 16 | — | — | — | Reports has chevron-right 24×24 |
| **Page heading** | Documents List | Noto Sans | 24 | 600 (SemiBold) | 32 | #374151 | — | — | — | — | — | 182 × 32 | Headline-3 |
| **Primary action button** | Add Document (+icon) | Noto Sans | 14 | 500 (Medium) | 20 | #ffffff | #003366 | — | 8 | pl 24 / pr 16 / py 8 | 8 | 165 × 40 | icon 16×16 right |
| Heading row (Frame 32) | — | — | — | — | — | — | — | — | — | — | space-between | 1092 × 40 | heading left, button right |
| **Card** (table container) | — | — | — | — | — | — | n/a (white) | n/a (card) | n/a | — | — | 1092 × 1022 | shadow-s implied |
| **CardHeader** | — | — | — | — | — | — | — | — | — | px 24 / py 20 | 20 (xl) | 1090 × 80 | row space-between |
| Search field | "Search for " (placeholder) | Noto Sans | 14 | 400 | 20 | #6b7280 | #f9fafb | — | 8 (md) | input pl 8 / pr 2 / py 2 | 8 | 577 × 40 | search icon 20×20; content pr 16 |
| Filter chip (year) | 2024-25 | Noto Sans | 14 | 400 | 20 | #374151 | transparent | #e5e7eb / 1px | 6 (sm) | pl 8 / pr 16 / py 8 | 4 | 99 × 36 | arrow-down icon 18×18 left; chips gap 12 |
| **Table** (container) | — | — | — | — | — | — | — | — | — | — | — | 1042 × 868 | inside Card Body 1090 × 940 |
| Table Col Head (cell) | Doc Type / Subject / Date / FY / "" | Noto Sans | 16 | 600 (SemiBold) | 24 | #6b7280 | #f9fafb | bottom #f3f4f6 / 1px | 0 | px 24 / py 16 | — | 56 tall | Body-1-semibold |
| — col widths | Doc Type 381 · Subject 381 · Date/FY 200 · action 80 | — | — | — | — | — | — | — | — | — | — | — | row height 116 (data) |
| Table data cell (text) | e.g. Statement 10A / 2025-2026 | Noto Sans | 16 | 400 | 24 | #374151 | — | bottom #f3f4f6 / 1px | 0 | 24 (all) | 0 | per col × 116 | Body-1; ellipsis overflow |
| Table data cell (subject long) | "Meeting with Nodal Officer…" | Noto Sans | 16 | 400 | 24 | #374151 | — | bottom #f3f4f6 / 1px | 0 | 24 | 0 | 381 × 116 | wraps to ~3 lines (72px text) |
| **Action icon cell** | — (more_vert) | — | — | — | — | — | — | bottom #f3f4f6 / 1px | 0 | 24 | 0 | 80 × 116 | center-aligned |
| Icon button (more_vert) | — | — | — | — | — | n/a | transparent | — | 8 (md) | 8 | 0 | 40 × 40 | icon glyph 24×24 |
| Row action dropdown menu | (List items) | Noto Sans | n/a | n/a | n/a | n/a | #ffffff | n/a | n/a | py 8 list | n/a | 114 × 82 | menu items 112 × 32 |
| **Pagination** (container) | — | — | — | — | — | — | — | — | — | 0 | — | 1042 × 32 | space-between; left page-control, right items-control |
| Pagination prev/next arrow | — | — | — | — | — | n/a | — | — | 4 (xs) | 8 | — | icon 16×16 | prev opacity 0.5 (disabled) |
| Pagination page (active) | 1 | Noto Sans | 14 | 500 (Medium) | 20 | #374151 | #ffffff | #003366 / 1px | 8 (md) | px 8 / py 6 | — | n/a | active page outlined |
| Pagination page (inactive) | 2 · 3 · 4 · 5 · 6 · … · 150 | Noto Sans | 14 | 400 | 20 | #6b7280 | transparent | — | 8 | px 8 / py 6 | 2 (xxs) | n/a | — |
| Pagination "Showing" label | Showing | Noto Sans | 13 | 400 | 20 | #6b7280 | — | — | — | — | 8 | n/a | body-3 |
| Pagination page-size dropdown | 200 | Noto Sans | 14 | 400 | 20 | #374151 | transparent | #e5e7eb / 1px | 8 (md) | pl 16 / pr 8 / py 8 | 4 | h 32 | trailing icon 20×20 |
| Pagination "of N items" | of 1500 items | Noto Sans | 13 | 400 | 20 | #6b7280 | — | — | — | — | 8 | n/a | — |

---

## Layout (exact px)

| Property | Value |
|---|---|
| Frame total | 1440 × 1268 |
| Navbar | 1440 × 134 (full-bleed, top) |
| Sidebar | 300 wide (× 908 visible); inner menu width 268; padding 16; item gap 12 |
| Container (main, right of sidebar) | x 300, width 1140 |
| Content area | x 0 / y 118 inside Container → 1140 × 1130 |
| Inner Container padding | 24 (all sides) → content 1092 wide |
| Heading row (Frame 32) | 1092 × 40 |
| Gap heading row → Card | 20 px (Frame 32 ends y40, Card starts y60) |
| Card | 1092 × 1022 |
| CardHeader | 1090 × 80; padding px 24 / py 20 |
| Card Body | 1090 × 940 |
| Table | 1042 wide (24px inset L/R inside Body); column gaps = 0 (cells abut) |
| Table column widths | Doc Type 381 · Subject 381 · Date/FY 200 · Action 80 (= 1042) |
| Column header height | 56 px |
| Data row height | 116 px |
| Pagination | 1042 × 32; sits 16px below table (y 884 in Body) |
| Cell internal padding | 24 px all sides |
| Sidebar item | 268 × 48; px 16 / py 12; radius 16 |

---

## Notes / caveats

- **Hidden in this frame (not rendered, excluded):** a "Quick Actions / Benefits" sub-section (`4226:42992`) and a second "My Submissions" Card with Activity table (`4226:43000`). These are toggled off — not part of the DOCUMENTS visible spec.
- **No status chips** appear in the rendered table (the row "status chip" pattern is absent on this screen). The only chip is the **year filter chip** in CardHeader.
- **Upload controls:** the screen has no inline upload widget; document creation is via the **Add Document** primary button (upload happens on a separate dialog/screen not in this frame).
- **Color nuance:** `Text/Hint` variable resolves to `#374151` in the token table but the rendered handoff code consistently uses `#6b7280` for hint/placeholder text (search placeholder, col-head text, inactive pagination, "Showing"/"items" labels). Both recorded; treat #6b7280 as the rendered truth for hint text.
- Masthead body text rendered with `#1f2937` (slightly darker than `Text/Dark #374151`).
- All type uses `fontVariationSettings: "CTGR" 0, "wdth" 100` (Noto Sans variable axes).
