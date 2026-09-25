# Offerings — Schemes and Services, scheme details, Vacancies, Tenders

Reference stems: `offerings`, `offerings_schemes_and_services_details_atal_vayo_abhyuday_yojana_avyay_ADNwITMtQWa`,
`offerings_vacancies`, `offerings_tenders` (empty table) and `archives_page_tenders` (the same
table populated). Values are computed at 1440 (the reference's 1280–1536 bucket, so its type is
the smaller `--db-fs-*` scale) unless marked. Colour groups → tokens as in `BUILD_CONTRACT.md`.

Files: pages `app/website-dbim/offerings/{page,vacancies/page,tenders/page,schemes-and-services/[id]/page}.tsx`;
components `components/website-dbim/offerings/*` + `offerings.css`; data `lib/website-dbim/offerings.ts`.
Every page is `<DbimPage title crumbs path tabs={DBIM_MENU[1].children}>` except the details page,
which the reference draws without the sub-tab bar.

## 0. Shared by the three list pages

| Element | Reference | Ours |
|---|---|---|
| Filter row | `form.filterbox`, search 375 max, Sort 270, Category 270, per-page 180; 34px tall, border `#5279D7` | the kit's `DbimFilterBar` (owned by the chrome builder) |
| Grid top | `.row.g-4` `margin-top:-15px`, gutters 15 | grid `gap: 15px` (literal — no 15 on the space scale) |
| Pager row | `.row.mt-5` (30px), three `col-md-4`: empty · pager centred · View Archive right | 3-column grid, `margin-top: 30px`; stacks centred below 768 |
| Pager | `ul.pagination`, 35×35 round pages, 14px/700 primary-800, active primary-200 | the kit's `DbimPagination` |
| View Archive | `a.download-outline-btn` 144×42, padding 8 12, gap 8, 12px/600, ls 0.12px, uppercase, primary-800 on white, 1px primary-800 border, radius 4, `margin-right:40px`; glyph `archive` 24 | `<Link className="db-off-archive">`, same values; `--sa-padding-8/12`, `--sa-shape-4`; margin 40 = `--sa-padding-40` |
| Empty | `p.no-data` "No Data Available.", centred, bold, `my-5` | the kit's `DbimEmptyState` |
| Filtered to nothing | (reference renders the empty text) | "No results for "<search>"." + a DS `Button` "Clear Search" — the reader caused it and can undo it (contract rule 10) |

## 1. `/offerings` — Schemes and Services

Card `.scheme-card` (645×518 at 1440): flex column, border 1px `#EBEAEA` (neutral-100), radius 12.

| Part | Reference | Ours |
|---|---|---|
| Photo | 643×216, `object-fit: cover`, radius 12 12 0 0 | `next/image` 643×216, `height: 216px` at every width (390 shot: also 216) |
| Body | padding 20 24 | `--sa-padding-20` / `--sa-padding-24` |
| Title-logo box | flex, space-between, align start, **85px tall** whether or not a logo is present | `min-height: 85px` |
| Title `p.scheme-title.h3` | h3 size (16 / 20 ≥1537), weight 500, line-height 24px, mb 5, ink | `h2` (heading order under the page h1), `--db-fs-h3`, 500, line-height 1.5 |
| Portal logo | 168×84 (source 120×60) | `next/image`, 168×84, `alt` names the portal |
| Line `p.scheme-intro.h4` | 12px / 20px, **box 100px** (5 lines), mb 5 | `-webkit-line-clamp: 5`, `height: 100px` (literal) |
| Footer | `margin-top:10px`, padding 0 24 20, right-aligned | same, `--sa-padding-*` |
| Arrow `a.link-btn` | 40×40, padding 8, radius 4, primary-200 fill, primary-800 glyph `arrow_right_alt` 24 | `<Link>` with `aria-label="View details of <scheme>"` |
| Grid | 2 columns (`col-md-6`) from 768, 1 below | same |
| ≤767 | title-logo box stacks (logo under title) — 390 shot | `flex-direction: column` |

Hover/focus: the reference has none beyond the pointer; ours adds the estate's
`:focus-visible` outline (2px primary-800, offset 2) on the arrow.

**Content.** The Department's schemes from the scheme master (`SCHEMES`, 38, in master order —
the reference's list is not all this Department's). Title = `displayName()`. Line = `provides`
(clamped to five lines, as the reference's box holds). Route = `/offerings/schemes-and-services/<id>`.

**Category = the scheme master's `type`** (Central Sector · Centrally Sponsored · Corporation ·
Foundation · Grievance · Helpline · Portal — seven short values, every scheme has exactly one).
`division` was rejected: it holds compound values (`SCD / BC`) and two that name no division
(`Other`, `All`). `umbrella` was rejected: 14 schemes have none.

**Photograph.** `DBIM_SCHEME_ART` is tested against the name + umbrella (so the four AVYAY
components all take the AVYAY photograph); a scheme with no match takes `DBIM_SCHEME_ART_FALLBACK`
in turn (a, b, a, …) in list order. **Portal logo**: e-Anudaan where the scheme's `apply` routes
include `eanudaan`; NISD where they include `nisd`; else none.

No "View Archive" on this page: the Department has no archived schemes to show there.

## 2. `/offerings/schemes-and-services/[id]` — scheme details

Banner: breadcrumb Home / Offerings (no link — the reference prints it unlinked) / Schemes and
Services (link → `/offerings`); h1 = scheme name. **No sub-tab bar** (the reference has none here).
`section.maincontent` padding 32 0; `row.g-5` (gutter 30): left `col-lg-4` sticky `top:140px`,
right `col-lg-8`. Below 992 the columns stack (390 shot).

| Part | Reference | Ours |
|---|---|---|
| Name card `.visionbox` | padding 32, `#EBEAEA` (neutral-100), radius 10; `h2` 20px/500/36px primary-800 | `--sa-padding-32`, radius 10 literal; `--db-fs-h2`, line-height 36px |
| VISIT bar `.leftCardDark` | 415×46, primary-400 fill, radius 4, margin 10 0; body padding 10 16, space-between; "VISIT" 14px/600/20 primary-800; `open_in_new` 24 primary-800 | external `<a>` (new tab, name says so) to the scheme's first confirmed web route; **omitted** when the master confirms none (a phone number is not a portal) |
| Links box `.leftLastCardLight` | neutral-100, radius 8, padding 12 16; heading "Scheme Versions" 14px/700/20 primary-600; buttons `a.detailsBtn` padding 8 12, 12px/700/18, ls 0.12, uppercase, primary-600 text + 1px border on white, radius 4, gap 8, glyph `open_in_new` | heading **"How to Apply"** (our box lists the master's apply routes, not versions — the reference label would misname them); a route with a confirmed web address is a link-button, one without is the same box as plain text |
| Section heading `h2.introHeading` | 20px / 32px, primary-800, weight 400, mb 5 | `--db-fs-h2`, line-height 32px |
| Body text | 14px, line-height 24px, `text-align: justify`, p mb 10; `h2` inside 20px/500 ink; `ol` padding-left 20; `strong` 700 | `--db-fs-p`; same |
| Documents heading `h2.docsHeading` | as introHeading, `margin-top:32px` | same |
| Document row `.docsCard` | border 1px (`#E0D9CF` → neutral-100, nearest), radius 8, margin 12 0, padding 8 16; grid 6 / 4 / 2 of 12; title 14px; PDF glyph 18 + size 10px/600 ls 0.6 uppercase primary-800; `a.download-btn` "VIEW" 87×40 primary-100 fill, primary-800 12px/600, glyph `visibility` | same; size shown only when the record states one |

**Content.** From the master: name, VISIT, apply routes. The right column is the ingested scheme
page where the estate has one — the master id's listings (`LEGACY_TO_MASTER` inverted, plus a
listing whose own slug is the id), the one with the most prose, its `legacySections()` (already
through `withAssetBasePath()`, h1 → h2, title-repeat headings dropped). The first block takes the
heading "Introduction" (the reference's). Without an ingested page: **Introduction** = `provides`;
**Who It Is For** = `named`; **How to Apply** = the apply routes; **Administered By** =
`administeredBy()`; **Sources** = `expandSource()` of each source code, linked where it has an
address. Documents: `getSchemeDocuments()` whose `schemeUrl` slug resolves (`masterForLegacy`) to
this id, newest first, each link localised (`localiseDocumentUrl`). No documents → no section.

`generateStaticParams` over every master id; anything else `notFound()`.

## 3. `/offerings/vacancies`

Filter row: search + Category only (reference). Grid `col-lg-4 col-md-6`: 3 / 2 / 1 columns.

| Part | Reference | Ours |
|---|---|---|
| Card `.career-card` | 415 wide, padding 20 24 24, border 1px neutral-100, radius 12, margin 0 5, flex column space-between | same; `--sa-padding-*` |
| Title chip `.career-card-header` | primary-200, radius 4, min 57px tall, padding 0 10; `p.h3` centred 16px/500/19.2, **2-line clamp** | `h2`, `--db-fs-h3`, `line-clamp: 2`, `min-height: 57px` |
| Description `.careersContent` | 14px / 20px, 3-line clamp, mt 10 mb 15 | **not rendered** — the register publishes only a title, and repeating it is restatement |
| Date list `dl` | rows: 24px Material glyph + label 10px/500/18 ls 0.12 uppercase; value right, 10px/15 | `dl` of grid rows; glyphs `list_alt` (Published), `calendar_month` (Start), `event_upcoming` (Due), `published_with_changes` (Latest Update) |
| Document link | 10px/15, `#0D6EFD` underlined, one line, ellipsis | primary-600 (nearest token blue), underlined, one-line ellipsis; opens the file |
| View All Documents `a.download-btn` | 168×34, primary-100 fill, primary-800 12px/600/18, ls 0.12, uppercase, radius 4, padding 8 12, centred | same — the reference fills it; the brief's "outlined" was checked against the capture and is not what the reference draws |

**Content.** `getVacancies()`: not archived (the estate's rule, `isArchived`: published more than
12 months ago → Archives, issue MAN-06 — the register publishes no closing date), newest first.
Only **Published Date** exists in the register; a missing date prints nothing, so its row is
absent. Link text = the title, href = the record's file. View All Documents → the record's page on
dosje.gov.in, which lists every file it carries (new tab). Category select is shown only when the
rows give it two or more values — the register's is `Job` or nothing, so it is omitted.

## 4. `/offerings/tenders`

Filter row: search · Sort by · Category · per page. Table (`role="table"`):

| Part | Reference | Ours |
|---|---|---|
| Header `.tableheader` | primary-200, radius 4, padding 12 32, mb 16; `small` 10px/600, ls 0.48, uppercase, primary-800; columns 2/3/2/2/3 of 12 | same; hidden below 992 |
| Row `.announcementbox` | white, border 1px neutral-100, radius 8, padding 8 32, mb 6 | same |
| ID / dates `small.ptype` | 10px/600, ls 0.6, uppercase, `#3D4043` | `--sa-color-text-muted` (nearest) |
| Title `p` | 14px / 24px ink | `--db-fs-p` |
| Type/size | PDF glyph 18 (primary-800) + size 10px/600 ls 0.6 primary-800, gap 15; View pill right | same |
| View `a.download-btn` | 87×40, primary-100, `visibility` glyph | same |
| ≤991 | header hidden; each cell gets a `col-4` label `small.table-column` 10px/600 ls 0.48 uppercase `#0B2641` (→ primary-800) | `data-label` pseudo-content is not read reliably, so a real `<span>` label, `aria-hidden`, with the column header carrying the name |

**Content.** `getTenders()`: `dedupeNotices`, `displayNoticeTitle`, not archived (as vacancies),
newest first. **A column is shown only if at least one row has a value for it** — the register
publishes no tender ID and no due date, so both columns are absent (a column of blanks is a
column that says nothing). Type = `fileTypeOf(file)`; size omitted (the register states none).
Sort by: Newest First · Oldest First · Title (A–Z). Category: shown only with two or more values
(the register gives one, `Notices & Tenders`), so omitted.

## Responsive summary

| Width | Schemes | Vacancies | Tenders | Details |
|---|---|---|---|---|
| ≥992 | 2 cols | 3 cols | table | 4 / 8 split, left sticky |
| 768–991 | 2 cols | 2 cols | stacked rows | stacked |
| <768 | 1 col, logo under title | 1 col | stacked rows | stacked |

## Decisions made while building (25 Sep 2026)

- **Registers inside ingested scheme pages are paged.** IPSrC (727 Senior Citizens' Homes),
  RVY (298 distribution centres) and SAPSrC (253 fund releases) carry a directory widget scraped
  as a table; printed whole the IPSrC page was ~88,000px tall. A table with a header row and more
  than 20 body rows is lifted out, reduced to cell text, headerless columns dropped (the widget's
  empty "View Location"), and paged 10 at a time (`RegisterTable.tsx`). The widget's residue
  ("State District Project Type Search Reset", a dead "Open in Google Maps") is removed.
- **A first ingested heading that repeats the scheme's name becomes "Introduction"**, the
  reference's label; any other first heading (e.g. PMS-SC's "About the Scheme") is kept.
- **How to Apply appears once**, in the rail; the master-facts body does not repeat it.
- **Headings wrap greedily** (`text-wrap: wrap`) — the hub balances headings, the reference does not.
- **Visually hidden link text is contained** (`position: relative` on the link) — otherwise a
  one-line ellipsised title pushed it past the viewport and the 390 page scrolled sideways.
