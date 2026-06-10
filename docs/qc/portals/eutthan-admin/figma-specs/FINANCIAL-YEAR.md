# Figma Spec — ADMIN / FINANCIAL YEAR (Manage Financial Year list)

> **Source of truth:** Figma handoff. EXACT values only. "n/a" = not available in handoff (never guessed).

| | |
|---|---|
| **Screen** | ADMIN / FINANCIAL YEAR (Financial Year List) |
| **File key** | gH2vQ62cfg4677YKWuOpLc |
| **Node id** | 4226:40009 |
| **Frame size** | 1440 × 960 px |
| **Slug** | FINANCIAL-YEAR |

## Tokens / variables used (name → value)

| Token | Value |
|---|---|
| Primary/Source (`primary/source`) | `#003366` (rendered `#036`) |
| Primary/50 | `#e5eff9` |
| Primary/100 | `#c8dbf0` |
| Primary/800 | `#001933` |
| Text/Primary | `#003366` |
| Text/Dark | `#374151` |
| Text/Hint | `#6b7280` (also token def lists `#374151`) |
| Text/Light | `#ffffff` |
| Text/Dark (navbar masthead variant) | `#1f2937` |
| Neutral/0 - White | `#ffffff` |
| Neutral/50 | `#f9fafb` |
| Neutral/Source | `#374151` |
| Success/Source | `#27682a` |
| Danger/Source | `#d64539` |
| Stroke/50 | `#f9fafb` |
| Stroke/100 | `#f3f4f6` |
| Stroke/200 | `#e5e7eb` |
| Stroke/300 | `#d1d5db` |
| spacing-xxs / xs / sm / md / lg / xl / 2xl | `2 / 4 / 8 / 12 / 16 / 20 / 24` px |
| spacing-5xl | `48` px |
| radius-xxs / xs / sm / md / lg / xl | `2 / 4 / 6 / 8 / 12 / 16` px |
| button-corner | `8` px |
| font-family/body, /heading | Noto Sans |
| font-size body-3 / body-2 / body-1 | `13 / 14 / 16` px |
| font-size label-2 / label-1 | `12 / 14` px |
| font-size title-2 / headline-4 / headline-3 | `18 / 20 / 24` px |
| font-weight regular / medium / semibold / bold | `400 / 500 / 600 / 700` |
| line-height body-2 / body-1 | `20 / 24` px |
| line-height label-1 / headline-3 | `20 / 32` px |
| letter-spacing body / label / heading | `0` px |
| Letter Spacing/5 | `0.4` px |

## Element spec table

| Region / Element | Text | Font family | Size px | Weight | Line-height | Text color | Background | Border (hex/width) | Radius px | Padding | Gap | Size W×H | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Navbar (whole)** | — | — | — | — | — | — | — | — | — | — | — | 1440 × 134 | Top gov bar + masthead, instance 4226:40010 |
| Top gov / accessibility bar | — | — | — | — | — | — | `#003366` (primary/source) | n/a | n/a | n/a | h 40 | "Government of India", flag, accessibility options, font-size A−/A/A+, contrast, English ▾ |
| Masthead band | — | — | — | — | — | — | `#ffffff` (white) | n/a | n/a | n/a | n/a | National Emblem + ministry text + SAMAVESH + Digital India co-branding |
| Masthead line 1 | Ministry of Social Justice & Empowerment | Noto Sans | 14 | 500 Medium | 16 | `#1f2937` | white | — | — | — | — | — | letter-spacing 0.4px (Letter Spacing/5) |
| Masthead line 2 | Department of Social Justice & Empowerment | Noto Sans | 20 | 700 Bold | 24 | `#374151` | white | — | — | — | — | — | headline-4 |
| User name | Vikas S | Noto Sans | 16 | n/a | 24 | n/a | — | — | — | — | — | — | body-1 |
| User role | Admin | Noto Sans | 13 | n/a | 20 | `#6b7280` | — | — | — | — | — | — | body-3 |
| User avatar initials | VS | Noto Sans | 18 | n/a | 24 | `#001933` | — | — | — | — | — | — | title-2; on Primary/50 token context |
| **Sidebar (whole)** | — | — | — | — | — | — | n/a | n/a | n/a | — | gap 12 | 300 × 908 | padding 16 (spacing-lg); menu gap 12 (spacing-md) |
| Sidebar item (default) | e.g. Dashboard | Noto Sans | 14 | 400 Regular | 20 | `#374151` (Text/Dark) | transparent | — | 16 (radius-xl) | px 16 / py 12 | 8 | 268 × 48 | icon 24×24 + label |
| Sidebar item (ACTIVE) | Manage Financial Year | Noto Sans | 14 | 400 Regular | 20 | `#003366` (Text/Primary) | `#e5eff9` (Primary/50) | — | 16 | px 16 / py 12 | 8 | 268 × 48 | active = Primary/50 bg + Text/Primary label |
| Sidebar nav items (full list) | Dashboard · Manage Financial Year · Manage Ministry · Manage Scheme · Manage Outcome · Manage Documents · Map Ministry/Schemes · Reports (▸) · User Management · Role Management · PFMS Logs | Noto Sans | 14 | 400 | 20 | `#374151` | — | — | 16 | px16/py12 | 8 | 268×48 each | Reports has chevron-right trailing |
| **Container (content)** | — | — | — | — | — | — | — | — | — | p 24 | — | 1140 × 892 | Content inset; inner Container 1092×726 at x24 y24 |
| **Page heading** | Financial Year List | Noto Sans | 24 | 600 SemiBold | 32 | `#374151` (Text/Dark) | — | — | — | — | — | — | headline-3; heading row 1092×40 |
| **Primary "Add" button** | Add Financial Year | Noto Sans | 14 | 500 Medium | 20 | `#ffffff` (Text/Light) | `#003366` (Primary/Source) | — | 8 (button-corner) | pl 24 / pr 16 / py 8 | 8 | 187 × 40 | trailing add icon 16×16 |
| **Card** | — | — | — | — | — | — | n/a | n/a (1px implied frame) | n/a | — | — | 1092 × 666 | Card wraps header + body; inset 1px |
| Card header | — | — | — | — | — | — | n/a | — | — | inner pad x24 y20 | — | 1090 × 80 | contains search row (Dashboard frame 1042×40) |
| **Search field** | Search for | Noto Sans | 14 | 400 Regular | 20 | `#6b7280` (Text/Hint placeholder) | `#f9fafb` (Neutral/50) | — | 8 (radius-md) | input pl 8 / pr 2 / py 2 | 8 | 577 × 40 (base 358) | leading search icon 20×20 |
| Filter chips (Default Chips) | n/a (hidden in this state) | Noto Sans | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | 122 / 114 × 36 | Frame 11 is `hidden=true` in handoff |
| **Table (whole)** | — | — | — | — | — | — | — | — | — | — | — | 1042 × 512 | 2 columns: Financial Year (521w) + Status (521w) |
| Table column header cell | Financial Year / Status | Noto Sans | 16 | 600 SemiBold | 24 | `#6b7280` (Text/Hint) | `#f9fafb` (Neutral/50) | `#f3f4f6` / bottom 1px | — | px 24 / py 16 | — | 521 × 56 | body-1 semibold; border-b Stroke/100 |
| Table body cell — value | 2024-2025 (etc.) | Noto Sans | 16 | 400 Regular | 24 | `#003366` (Text/Primary) | `#e5eff9` (Primary/50)* | `#f3f4f6` / bottom 1px | — | p 24 (all sides) | — | 521 × 76 | *First/highlighted row bg = Primary/50; row height 76; border-b Stroke/100 |
| Table body cell — status | (Active badge) | — | — | — | — | — | per row | `#f3f4f6` / bottom 1px | — | p 24 | — | 521 × 76 | Status column holds Badge instances |
| **Status chip / Badge** | Active | Noto Sans | 14 | 500 Medium | 20 | `#ffffff` (Text/Light) | `#27682a` (Success/Source) | — | 12 (radius-lg) | px 12 / py 4 | 8 (0 here) | 65–78 × 28 | min-w 28; emphasis High, size Large, color Success |
| **Action button (row "Edit")** | Edit | Noto Sans | 14 | 500 Medium | 20 | `#003366` (Text/Primary) | transparent | — | 8 (button-corner) | pl 20 / pr 16 / py 10 | 8 | 86 × 40 | trailing edit icon 16×16 (inner 24) |
| Row action cursor/pointer icon | — | — | — | — | — | — | — | — | — | — | — | 24 × 24 | Cursor/Pointer instance over rows |
| **Pagination (whole)** | — | — | — | — | — | — | — | — | — | — | — | 1042 × 32 | space-between: page control ↔ items control |
| Pagination — page (active "1") | 1 | Noto Sans | 14 | 500 Medium | 20 | `#374151` (Text/Dark) | `#ffffff` (white) | `#003366` (Primary/Source) 1px | 8 (radius-md) | px 8 / py 6 | — | — | active page = white bg + primary border |
| Pagination — page (inactive 2…150) | 2,3,4,5,6,…,150 | Noto Sans | 14 | 400 Regular | 20 | `#6b7280` (Text/Hint) | transparent | — | 8 | px 8 / py 6 | 2 | — | — |
| Pagination — prev/next arrows | — | — | — | — | — | — | — | — | 4 (radius-xs) | p 8 | — | 16 icon | prev opacity 50% (disabled) |
| Pagination — "Showing" / "of 1500 items" | Showing / of 1500 items | Noto Sans | 13 | 400 Regular | 20 | `#6b7280` (Text/Hint) | — | — | — | — | 8 | — | body-3 |
| Pagination — page-size dropdown | 200 | Noto Sans | 14 | 400 Regular | 20 | `#374151` (Text/Dark) | transparent | `#e5e7eb` (Stroke/200) 1px | 8 (radius-md) | pl 16 / pr 8 / py 8 | 4 | h 32 | trailing chevron icon 20×20 |

## Layout

| Property | Exact value |
|---|---|
| Frame W×H | 1440 × 960 px |
| Navbar height | 134 px (accessibility bar 40 px) |
| Sidebar width | 300 px (inner menu 268 px; padding 16; item gap 12) |
| Content container width | 1140 px (= 1440 − 300 sidebar) |
| Content top offset (below header) | Content y = 118; inner Container x24 y24 |
| Inner content container | 1092 × 726 px (24 px padding inside 1140) |
| Heading-row → Card gap | Heading row y0 h40; Card y60 → 20 px gap |
| Card size | 1092 × 666 px |
| Card header height | 80 px (inner pad x24 y20) |
| Card body | 1090 × 584 px |
| Table width | 1042 px (24 px inset within card body) |
| Table columns | Financial Year 521 px + Status 521 px (2 × 521 = 1042) |
| Column header height | 56 px |
| Body row height | 76 px |
| Cell padding | 24 px all sides (header: px24 / py16) |
| Row divider | bottom border 1 px, Stroke/100 `#f3f4f6` |
| Pagination position | y 528 inside card body; 1042 × 32 |
| Zebra striping | None observed; highlighted first/selected row bg = Primary/50 `#e5eff9` (default rows transparent) |

## Notes / non-extractable

- **Filter chips row** (Frame 11, nodes 4226:40025–40029) is `hidden=true` in this Figma state — sizes captured (122/114 × 36) but no resolved fills/text in active layout.
- **"Quick Actions" sub-section** (4226:40063) and a second **"My Submissions" card/table** (4226:40071) exist in the frame but are `hidden=true` — not part of the rendered Financial Year List state; excluded.
- **Card border/elevation:** Card and CardHeader use a 1 px implied frame inset; no explicit border color/shadow token surfaced in handoff → border = n/a.
- **Text/Hint** token def file reports `#374151`, but resolved usage in components renders `#6b7280`; table/pagination hint text uses `#6b7280`.
- **Primary/Source** renders as shorthand `#036` in code = `#003366`.
- Status badge widths vary by label length (65 px for "Active", 78 px for longer); height fixed 28 px, min-w 28.
