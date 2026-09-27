# Ministry — About Us, Our Team, Our Division, Our Organisation, Our Performance, Directory

Reference stems: `ministry`, `ministry_our_team`, `ministry_our_division`, `ministry_our_organisation`,
`ministry_our_performance`, `ministry_directory`. Values are computed at 1440 (the reference's
1280–1536 bucket, so its type is the smaller `--db-fs-*` scale) unless marked. Colours → tokens
as in `BUILD_CONTRACT.md`; the extra ones are listed in §7.

Files: pages `app/website-dbim/ministry/{page, our-team/page, our-division/page, our-division/[slug]/page,
our-organisation/page, our-organisation/[slug]/page, our-performance/page, directory/page}.tsx`;
components `components/website-dbim/ministry/*` + `ministry.css`; data `lib/website-dbim/ministry.ts`.
Every page is `<DbimPage title crumbs path tabs={DBIM_MENU[0].children}>`; detail pages keep the
sub-tab bar with the parent tab active (`activeTab`).

## 0. Shared

| Element | Reference | Ours |
|---|---|---|
| Content box | `.container` 1320 max, 7.5 padding → content x 68–1373 at 1440 | the kit's `DbimPage` container |
| Top gap under the tab bar | first row at y 453 (tab bar foot 421 + 32); `mt-5` = 30px | `margin-top: 30px` on each page's first block (literal — 30 is not on the space scale) |
| Arrow button `a.link-btn` | 40×40, padding 8, radius 4, fill `#A3BBF3` (primary-200), glyph `arrow_right_alt` 24, colour primary-800 | `<Link className="db-min-arrow">` with an accessible name; `Icon name="arrow_right_alt"` weight 400 |
| Focus | none drawn | 2px primary-800 outline, offset 2, on `:focus-visible` (contract rule 11) |

## 1. `/ministry` — About Us (and the detail layout reused by divisions and organisations)

Grid: `.col-lg-4` (415 box) + `.col-lg-8` (860 box), gutter 30 → `grid-template-columns:
calc((100% + 30px) / 3 - 30px) 1fr; gap: 30px`. One column below 992.

| Part | Reference | Ours |
|---|---|---|
| Summary box `.visionbox` | bg `#EBEAEA` (neutral-100), radius 10, padding 32; `position: sticky; top: 140px` ≥992 | same; radius 10 is off-scale → literal with comment; `--sa-padding-32` |
| Summary text | p 14/21 (`--db-fs-p`), ink | same |
| Rich text `.aboutcontent` | `text-align: justify` | same |
| h2 | 20px (`--db-fs-h2`), weight 400, line-height normal, ls -0.12px, primary-800, mb 10 | same |
| p | 14/21, mb 10 | `--db-fs-p`, line-height 1.5 |
| strong | 700 | 700 |
| ul / ol | padding-left 20, mb 10; `li` 16/24 (the body size, not `p`) | same; `li` 1rem/1.5 |
| table | bootstrap `table-bordered table-striped`: td padding 5, 16px, borders `#DEE2E6`, odd rows `rgba(0,0,0,.05)` | borders neutral-100, stripe neutral-25; `th` bold on the same ground |
| Document row `.box` | flex, padding 16, mb 16, border 1px neutral-100, radius 8; cols 6/2/2/2: `draft` glyph 24 primary-800 + title 14px · date `small.ptype` 10px/600 ls .6 `#3D4043` · pdf mark 18 + size 10px/600 primary-800 · "VIEW" `a.download-btn` 40 tall, padding 8 12, gap 8, 12px/600 ls .12 uppercase, bg primary-100, fg primary-800, radius 4, glyph `visibility` | `DocRow` — same grid, glyphs from `Icon`; the file size is left out where the register does not publish one |
| Link row | the same box with the arrow button on the right | `details` whose `summary` is drawn as that row; opening it shows the table under it |

**Content.** Summary = the Department's one-sentence description of itself (as the redesign's
About page leads with). Body = the Department's About Us text, dosje.gov.in/about-us/ as the
redesign transcribed and corrected it (`app/website/about-us/page.tsx`, read 21–22 Sep 2026),
held in `lib/website-dbim/ministry.ts` (`DBIM_ABOUT`). Sections in the reference's order:
Brief Overview · Brief History · Subjects Allocated · Organisational Set-Up (with the Bureau
Head-Wise Allocation of Work table from `app/website/about-us/reference-tables.ts`) ·
Organisation Chart (PDF row) · Citizen Charter (`getDocument("citizen-charter")`) · Former
Secretaries (expanding row → table) · Sector-Wise Detailed Information (expanding row → the
statistical tables, grouped). The Secretary is named from `getDepartmentSecretary()`.

Responsive: <992 the box sits above the text, not sticky (390 shot).

## 2. `/ministry/our-team`

**Org chart** `.card-wrapper`: bg `#D2DFFF` (primary-100), radius 24, padding 15; the wrapper
breaks out of the container to 30px from the viewport edge (10px ≤767).

| Part | Reference 1440 | Reference 390 | Ours |
|---|---|---|---|
| Card `.profile-card` | 320×153, padding 72 24 24, radius 12, white, shadow `0 4px 4px rgba(0,0,0,.12)`, 2px transparent border (primary-800 on hover) | 156 wide, padding 40 10 10, min-height 120 (role text measures 10px on the 390 capture, although the CSS says 9) | shadow → `--sa-elevation-card` (nearest) |
| Portrait | 120 round, 1px white border, white ground, centred on the card's top edge | 65 | `next/image` |
| Role `small` | 10px (`--db-fs-small`) / 500, ls 0.7, uppercase, primary-800 | 10px as rendered | same |
| Name `.h4` | 12px (`--db-fs-h4`) / 500, line-height 24 | 12px / 15 | same |
| Pitch | card tops 350 apart; 1px `#999` (neutral-400) line joins card foot to next card top | 240 apart | `li + li::before` |
| Rule | `hr` 1px, currentColor at .25, margin 10 | same | neutral-200 |

**Office tables** `.our-team-list-container` (one per office):

| Part | Reference | Ours |
|---|---|---|
| Header bar | margin-top 32, padding 8 16, gap 8, radius 4, bg `#214AAB` (primary-600), white; glyph `apartment` 24; text 14px/600 uppercase | `h2` (heading order) carrying the office name in Title Case, uppercased by CSS |
| Column header | margin-top 4, padding 4 8, radius 4, bg primary-100, fg primary-600; `small` 10px/600 ls .48 uppercase; hidden <992 | a `role="row"` of `role="columnheader"` cells, as the reference marks it |
| Row | padding 12 8, border-bottom 1px neutral-100; cols 4/5/3 (15 gutter) | CSS grid `4fr 5fr 3fr`, gap 15 |
| Name | 14px / 700 | same |
| Designation | a bare text node at the body size, 16/24 | 1rem/1.5 |
| Contact line | flex, gap 5, glyph 24 (`call` · `print` · `mail` · `deskphone`) + 14px text | same; phone numbers are `tel:` links in the text colour |
| Address | 14px | same |
| <992 | each cell becomes label (`small`, uppercase, 33% wide) + value | same |

**Content.** Ministers: `DBIM_PEOPLE.ministers` (portraits fetched from the reference). Offices:
the Department's register (`getOfficialsByOrganisation("MoSJE")`, 162 records), grouped by the
register's `group`, in the reference's office order; an office the reference does not list goes
after, alphabetically. Inside an office: the head first (a post that is not a staff post), then
private secretaries, additional PSs, assistant PSs, PAs, others, each by name. Duplicate records
(the register repeats 16 officers) are merged by name. Records with no `group` (the three
Ministers' leadership records) are drawn in the chart, not the tables. Telephone numbers are
split into telephone and fax with the redesign's `phoneGroups()`. **Emails are shown as the
register writes them** (`name[at]gov[dot]in` on 345 of 363) — the reference's own notation;
free-mail addresses are not published (CON-09, as every other people page of the estate).

## 3. `/ministry/our-division` and `/ministry/our-division/[slug]`

| Part | Reference | Ours |
|---|---|---|
| Filter row | search · Category · 10 per page | the kit's `DbimFilterBar` — search and per-page only: the divisions register carries no category, and the reference's only category is "General" |
| Grid | 2 columns ≥768, gap 15 (`g-4` = 1.5rem = 15px) | same |
| Card `.our-division-card` | border 1px neutral-100, radius 12, flex column space-between; rows in a line share a height | same |
| Body | padding 12 24 0 | `--sa-padding-12/24` |
| Title | 14px (`--db-fs-p`) / 500, line-height 24, mb 24, ink | `h2` |
| Description | 14px / 20, mb 16 | same |
| Footer | padding 12 24 24, arrow right | same |

**Content.** `DIVISIONS` from `@/data/website` (10, in its order). Description: the
Department's own one-line description of the division where it publishes one (the redesign's
division pages, from dosje.gov.in, read 21 Sep 2026); none is drawn where it has none.
Detail page = the §1 layout: summary box + a "Related Links" section of the division's own
links from `DIVISIONS` as link rows. Those links are the website's own `/website/…` addresses;
where the DBIM tree has no page at an address it falls through to the not-found page, as
`lib/website-design/constants.ts` intends for a comparison design. The divisions' long bodies
exist only as JSX in the redesign's page files and are not duplicated here.

## 4. `/ministry/our-organisation` and `/ministry/our-organisation/[slug]`

**Decision:** our registry DOES type its organisations (`category`: commissions · corporations
· foundations · schemes), so the page follows the reference — one card per type, opening a
listing of that type's organisations; each organisation card opens its detail page. One
dynamic segment serves both: a type key renders the listing, an organisation id the detail.

| Part | Reference | Ours |
|---|---|---|
| Card `.organisation-card` | border 1px neutral-100, radius 8, padding 16 32, gap 8 | same |
| Title box | min-height 115, title centred vertically | same |
| Title `p.h3` | 16px (`--db-fs-h3`) / 500 / 24, `#214AAB` (primary-600) | `h2` |
| Description | min-height 130; p 14/21 | same, clamped to 4 lines as the reference truncates |
| Arrow | right-aligned 40×40 | same |

**Content.** Type card description = the names of the organisations in it, from the registry
(no invented prose). Organisation detail = `getOrganisation(id)` from `@/lib/website/content`:
prose sections only (`kindOf()`), cleaned with `cleanHtml()`, section headings as blue h2s,
summary box = the first section's lead paragraph, which then leaves the body so it is said once. NHAA has no ingested record; its card
opens the helpline portal.

## 5. `/ministry/our-performance`

| Part | Reference | Ours |
|---|---|---|
| Title `p.performance-title.h3` | 16px / 700 / 24, primary-600 | `h2` |
| Row | padding-top 24, gap 24; 4 columns ≥992, 2 ≥768, 1 below | same |
| Image | 315×257 at 1440, radius 8, cover | `next/image`, `aspect-ratio: 315 / 257` |
| Badge | 40×40 bottom-right (10 in), primary-200, glyph `open_in_new` | internal tile: `arrow_right_alt` |
| Title | 16px / 500 / 19.2, mt 5 | same |
| Date `small.ptype` | 10px/600 ls .6 uppercase `#3D4043` | `--sa-color-text-muted` |

**Content.** The Department's dashboards: the Social Audit MIS portal (`DBIM_CAMPAIGNS.socialAudit`,
date 24.10.2025 as the reference publishes it) and the PM-AJAY dashboard of this website
(`/dashboard`). No date is drawn where none is published.

## 6. `/ministry/directory`

Imports `DbimDirectory` from `@/components/website-dbim/connect/Directory` (owned by the
Media/Connect builder) — the same list as Connect › Directory, as the reference serves it at both.

## 7. Colours beyond the contract's list

| Reference | Token | Note |
|---|---|---|
| `#999999` chart line | `--sa-color-neutralScale-400` | nearest |
| `#3D4043` date | `--sa-color-text-muted` | nearest |
| `#DEE2E6` table rule | `--sa-color-neutralScale-100` | nearest |
| `rgba(0,0,0,.05)` stripe | `--sa-color-neutralScale-25` | nearest opaque |
| `rgba(21,2,2,.25)` hr | `--sa-color-neutralScale-200` | nearest opaque |

## 8. States

- Division / organisation grids: empty → `DbimEmptyState`; filtered to nothing → "No results
  for “…”." + Clear Search; paged at 10 (15, 20).
- Team: an office with no officer is not drawn; no officer at all → `DbimEmptyState`.
- Unknown `[slug]` → `notFound()`.
