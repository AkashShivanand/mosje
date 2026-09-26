# Documents, What's New and Archives — DBIM spec

Reference: master-socialjustice.digifootprint.gov.in, captured 25 Sep 2026
(`ref3/shots`, `ref3/html`, `ref3/styles`, `used.css`). Values below are the
reference's computed styles at 1440 (html 62.5%, so "12px" is `1.2rem` there and
`0.75rem` here). Colours are given as the token they bind to.

## Pages and routes

| Route (`/website…`) | Reference stem | Banner | Tabs |
|---|---|---|---|
| `/documents` — Reports | `documents` | documents photo | `DBIM_MENU[2].children` |
| `/documents/orders-and-notices` | `documents_orders_and_notices` | documents photo | same |
| `/documents/publications` | `documents_publications` | documents photo | same |
| `/documents/<tab>/<series>` | `documents_reports_annual_reports_on_prevention_atrocity_act_poa_…` | documents photo | **none**; crumbs Home / Documents / *Tab* |
| `/whats-new` | `whats_new` | `DBIM_HEROES.default` | none; crumbs Home / What's New |
| `/archives` (Tenders), `/archives/<kind>` | `archives_page_tenders` | `DBIM_HEROES.default` | the archive kinds; crumbs Home / Archives |

The reference addresses archives as `/archives?page=<kind>`. Here each kind is a
static route (`/archives/vacancies` …) so every tab is prerendered and the tab bar's
`aria-current` is plain path equality, like every other DBIM tab bar. `<tab>` is
`reports | orders-and-notices | publications`.

## Elements (1440)

**Filter bar** — the shared `DbimFilterBar`: search 375×42, `sort` (Latest / Oldest),
`category` (the series names), `perPage` (10 / 15 / 20). Margin below 10px.
Series page: search + sort only. What's New: search only.

**Table header** `.tableheader` — bg `primaryScale-200`, radius 4, padding 12 32,
margin-bottom 16, height 48. Labels: small caps 10px (`--db-fs-small`) / 600 /
letter-spacing 0.48px / `primaryScale-800`. Columns (Bootstrap 12-grid, 7.5px
gutters): Documents tabs 7 · 2 · 2 (TITLE · PUBLISHED YEAR · TYPE/SIZE), What's New
6 · 2 · 2 · 2 (TITLE · PUBLISHED DATE · TYPE/SIZE · action). Hidden below 992px.

**Row** `.announcementbox` — white, 1px `neutralScale-100` border, radius 8, padding
8 32, margin-bottom 6, min-height 58, items centred.
- Folder: `file_copy` icon 24 `primaryScale-800`, 5px gap, title 14px/24px
  `text-default`, then the count badge: 25×25, radius 4, bg `primaryScale-200`,
  12px / 600 / lh 12 / ls −0.24 `primaryScale-800`.
- Date: 10px / 600 / ls 0.6 uppercase, `#3D4043` → `neutralScale-700` (#454545,
  nearest DBIM neutral).
- Type/size: PDF glyph 18×18 filled `primaryScale-800` + 15px gap + size 10px / 600 /
  ls 0.6 uppercase `primaryScale-800`.
- Action pill `.download-btn`: bg `primaryScale-100`, radius 4, padding 8 12, gap 8,
  `visibility` icon 24, label 12px / 600 / lh 18 / ls 0.12 uppercase
  `primaryScale-800`; hover bg `primaryScale-200`. "View All" for a folder (→ series
  page), "View" for a file (opens the file, new tab).
- Series-page row columns 7 · 2 · 3 (the 3 holds size left, pill right).

**View Archive** `.download-outline-btn` — white, 1px `primaryScale-800` border,
radius 4, padding 8 12, gap 8, `archive` icon 24, 12px / 600 / ls 0.12 uppercase,
142×42, 30px below the table, right-aligned 40px in from the container edge. Hover
bg `primaryScale-100`.

**What's New groups** — empty announcements slot (padding 16 24, mt 30, mb 10), `hr`
(1px `text-default` at 25% opacity, margins 10), h2 20px/500/lh 24, mt 36 mb 12; per
group a row: `file_copy` 24 + h3 16px/500/lh 19.2 + count badge, mt 30 mb 10, gap 5.

**Pagination** — the shared `DbimPagination` (35px circles, active `primaryScale-200`).

## Responsive (390)

Below 992px the header row hides and each row stacks: every cell is full width, and
each cell carries its own label (small caps 10px / 600 / ls 0.48, `#0B2641` →
`primaryScale-900`) in a column one third wide, the value beside it. Folder rows put
the pill on its own line, right-aligned; file rows keep size and pill on one line
(space-between). Gutter 16px; the filter bar collapses to search + filter button
(shared kit).

## States (contract rule 10)

- Empty (nothing published in the tab / series / archive kind): `DbimEmptyState` —
  "No Data Available." Series routes that do not exist are `notFound()`.
- Filtered to nothing: "No documents match “<query>”." with a Clear Search control.
- Long lists: paged 10 per page (15 / 20 selectable); never scrolled in a card.
- Loading: none — every list is rendered on the server from committed data.

## Content mapping

Source: `getAllDocuments()` (3,297 library rows + 2,667 Central List of OBCs rows).
A **series** is one `documents-type` term (`types[]`), matched on `types` as
`getDocumentsOfType` does, so a record carrying two types sits in both series. A
record with no type is in the series **General** (the reference's own catch-all name).
A record with `status: "Archived"` (the Department's own flag, 469 rows) leaves the
Documents tabs and is listed under Archives in the same tab name.

| DBIM tab | Types (series) |
|---|---|
| **Reports** | Annual Reports · Reports · Tour Reports · Special Report · Evaluations · Impact of Commission Intervention · Statement · Monitoring Committees · Vigilance Committees · State Commissions Designated Agencies · Total No. of Deaths / Compensation · Case Which Legal Heir Not Traceable |
| **Orders and Notices** | Circulars & Notifications · Notice · Office Memorandum · Gazette Notifications · Announcement · Advices · Hearing/Proceeding · Supreme Court Judgement · Results · Letters to Nodal Officers |
| **Publications** | Publications · Newsletter · Resources · IEC Materials · Pearls of Wisdom · Stories · Meta Data · Acts & Rules · Policy · Guidelines · Advertisement · Forms & Templates · MoU · Central List of OBCs · Parliament Questions · RTI · Suo-Moto · Prevention of Sexual Harassment of Women at Workplace · Certificate · Citizen · Scheme for SCAs · General Body Members · Governing Body Members of DAF · Rajya Sabha · General |

**Anything not in the Reports or Orders and Notices lists goes to Publications**, so a
type added to the register later is never dropped. The Publications list follows the
reference's own Publications tab, which files Advertisement, Policies / Acts / Rules,
Guidelines and Meta Data there.

Row values: title `tidyTitle`; date `publishStart ?? date` as dd/mm/yyyy; size as
the register prints it; file `localiseDocumentUrl(fileUrl)` (the estate's local
sample), else `externalUrl` (new tab), else the record's page on dosje.gov.in (new
tab). A folder of one opens that file directly ("View"), as the reference does.
Folder rows print no size: the reference prints one file's size against a folder,
which reads as the folder's total.

**What's New** — `whatsNew()` (updates, circulars, notices, results, announcements of
the last twelve months, de-duplicated) for Orders and Notices and Updates, plus the
Reports and Publications series with a document in the last twelve months. Groups:
h2 **Documents** → h3 per tab (count = folders) → folder rows (count = new documents
in the series); h2 **Updates** → file rows (the update's attachment, else its
dosje.gov.in page).

**Archives** — tabs in the reference's order, keeping those with rows:
Tenders · Vacancies · Reports · Orders and Notices · Publications. (Presentation,
Gazettes Notifications, Schemes and Services and Acts and Policies hold nothing: no
Gazette, Act or Policy record is flagged Archived, and the register has no
presentations or archived schemes.) Tenders and vacancies move here twelve months
after publication (`isArchived`, the rule the classic Archives page and the
redesign's /tenders use); documents move here when the Department flags them
Archived. The register publishes no tender ID, closing date or file size, so the
Tenders table is TITLE · PUBLISHED DATE · TYPE/SIZE (PDF glyph, no size) — the
columns the register can fill; dates print dd.mm.yyyy as the reference's tender
table does.

## Weight

Series pages ship their whole series to the client for search/sort/paging. The
heaviest is Central List of OBCs (2,667 rows); rows are trimmed to title, date,
size and href. Measured after build — see the comment in `lib/website-dbim/documents.ts`.
