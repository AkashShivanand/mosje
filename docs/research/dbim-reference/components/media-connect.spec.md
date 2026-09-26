# Media and Connect — DBIM spec

Reference: master-socialjustice.digifootprint.gov.in, captured 25 Sep 2026
(`ref3/shots`, `ref3/html`, `ref3/styles`, `used.css`). Values are the reference's
computed styles at 1440, which sits in its 1280–1536 bucket (p 14px, h2 20px, h3 16px,
h4 12px, small 10px — `--db-fs-*`). Colours are named by the token they bind to
(`data-brand="dbim"`): 800 `#162F6A`, 600 `#214AAB`, 400 `#5279D7`, 200 `#A3BBF3`,
100 `#D2DFFF`; `n-100` `#EBEAEA`; `n-50` `#F5F5F5`; ink `--sa-color-text-default`.

Every page is `<DbimPage>` (banner, crumbs, sub-tab bar, container). Everything below is
the content inside it; the container's own 30px top margin and gutter are the kit's.

## Pages and routes

| Route (`/website…`) | Reference stem | Tabs | Crumbs |
|---|---|---|---|
| `/media` — Photos | `media` | `DBIM_MENU[3].children` | Home / Media |
| `/media/photos/[slug]` — one album | (none — built from `media`) | same, Photos active | Home / Media / Photos |
| `/media/videos` | `media_videos` | same | Home / Media |
| `/connect` — Contact Us | `connect` | `DBIM_MENU[4].children` | Home / Connect |
| `/connect/directory` | `connect_directory` | same | Home / Connect |
| `/connect/rti` | `connect_rti` | same | Home / Connect |
| `/connect/grievance-redressal` | `connect_grievance_redressal` | same | Home / Connect |
| `/connect/parliament-questions` | `connect_parliament_questions` | same | Home / Connect |
| `/connect/events` | `connect_visitors_pass` | same | Home / Connect |

`/ministry/directory` renders the same `<DbimDirectory/>` (ministry builder's page).

## Shared list furniture

Filter row: `DbimFilterBar` (kit). Pager: `DbimPagination` (kit), 10 per page.
Empty: `DbimEmptyState` ("No Data Available."). Filtered to nothing: one line naming the
search — *No results for "x".* — and a text `Button` "Clear Search" that calls
`listing.clear()`.

## 1. Photos — album grid (`media`)

- Grid: `padding-top 24px`, 3 columns ≥992 (col 440, card 425 → gap 15), 2 columns
  768–991, 1 column below; row gap 24px; `margin-bottom 24px` above the pager.
- Card `.db-album`: flex column, `justify-content: space-between`.
  - Photo: 196px tall, `object-fit: cover`, `object-position: center top`, radius 8px.
  - Arrow badge: 40×40, `right 10px; bottom 10px`, padding 8, radius 4,
    background black 62% (`color-mix(neutralScale-1000 62%)`), white 24px
    `arrow_right_alt`. The whole card is one link; the badge is decoration.
  - Title: 12px/20px (`--db-fs-h4`), ink, weight 400, `margin-top 4px`, clamp 2 lines.
  - Footer: `margin-top 8px`, flex space-between, 10px (`--db-fs-small`)/600,
    `letter-spacing 0.6px`, uppercase, `neutralScale-700` (reference `#3D4043`, nearest).
    Left: date `DD.MM.YYYY`; right: `N Items`.
- Sort by: Latest / Oldest. Category: the album's organisation name.
- 390: one column, the photo keeps 196px? — the reference grows it to ~265px (full-width
  4:3-ish). Implemented as `aspect-ratio: 4 / 3` below 768px.
- CONTENT: `deriveAlbums()` (`components/website-next/media/albums.ts` — logic only) over
  `getGalleryItemsByType("Photos")`; an album with no photograph is left out (it is not an
  album of photos). Organisation name via `organisationName()` (`org-name.ts`).

### Album page (`/media/photos/[slug]`)

- Same grid as above but square-ish tiles (196px), each tile a DS-`Button`-free link?
  No — each tile is a `<button>` opening the lightbox, so it is a DS `Button`
  (`appearance="text"`, restyled). The lightbox is the DS `Lightbox` (Esc, ←/→, focus
  trap, focus return). Title of the album is the `h1`; date + count under it as a
  `ptype` line.
- `notFound()` for an unknown slug; an album with photos always renders them.

## 2. Videos (`media_videos`)

- Same grid. Card: media box 196px, radius 8, black ground (a letterboxed video sits on
  black in the reference); title 12px/20px; footer as Photos — left the date, right the
  duration when the file reports one (`0:49`), read from `loadedmetadata`.
- File videos: `<video controls preload="metadata">` — never autoplay.
- YouTube videos: a facade — the YouTube still (`i.ytimg.com/vi/<id>/hqdefault.jpg`) and
  a DS `Button` "Play Video: <title>"; pressing it swaps in the titled `iframe`
  (`youtube-nocookie.com`). Loading 10 embeds per page on arrival was not acceptable.
- Share icon (reference top-right): not built — the reference's share menu is a
  third-party widget; noted as a difference.
- CONTENT: every `videos[]` item on gallery records (106: 28 files, 78 YouTube).

## 3. Contact Us (`connect`)

- Row: left col 4/12 (415 content), right col 8/12 (860), gap 30 (Bootstrap g-5).
- Left `.db-contact`: flex, gap 5px; `location_on` 24px primary-800; h2 20px/500
  (reference `fontSize 20px; fontWeight 500`, line-height 24), `margin-bottom 5px`;
  p 14px/21px.
- Right: one `<iframe title="Map of the Department's office" loading="lazy">`, 100% of the
  column, height = the left column's (156px at 1440), min 156px.
- 390: stacked, map 156px, 48px between.
- CONTENT: the Department's own contact (`app/website/contact-us/department-contact.ts`
  reads the register: Ms. Kajal Singh, Director — `kajal-singh`; 8th Floor, GPOA-3, Netaji
  Nagar, New Delhi-110023). The reference's heading "Web Information Manager" and its
  officer (Shastri Bhawan) are NOT used: the Department has not designated a WIM
  (`docs/audit/dosje-gov-in-compliance-audit-2026-09-10.md` §G40), so the heading is the
  Department's name.

## 4. Directory (`connect_directory`) — `DbimDirectory`

- Filter row (kit): search · Category · per page.
- Letter strip `.db-dir-letters` (a `nav` labelled "Filter by first letter of name"):
  background `n-100`, radius 4, padding 8/24, margin 37px 0, flex centred, gap 8;
  inner list `padding-left 20px`, gap 8. Letter: DS `Button` text, 20px/27px,
  padding 0 10px, primary-800, `letter-spacing -0.1px`. Active: `aria-pressed`,
  weight 700 + underline. No entry for the letter: `disabled`. 390: the strip scrolls
  sideways (as the reference).
- Row `.db-dir-row`: 3 equal columns, gap 24px (Bootstrap gutter), padding 16/20,
  `border-bottom 1px primary-400`.
  - Designation: 10px/18px 600 uppercase primary-800, `letter-spacing 0.12px`.
  - Name: 14px/22px ink, `letter-spacing 0.16px`, margin-bottom 10px.
  - Division chips: gap 5, each padding 4/8, radius 12, primary-200 ground,
    10px/18px primary-800.
  - Contact lines: gap 5; icon 24px primary-800 (`call`, `mail`, `deskphone`);
    phone/email 12px/20px ink, margin-bottom 5; mail line `margin-top 12px`;
    intercom 14px/21px.
  - Address: `location_on` + 12px/20px text, `align-items: flex-start`.
- 390: one column, the three blocks stacked with 24px between.
- CONTENT: `getOfficialsByOrganisation("MoSJE")` (162). Designation line = the register's
  `group` (its section: "Under Secretary", "Section Officers"), Title Cased; chip = the
  post (`designation`). Category = the section. Ordered by seniority (the redesign's
  `OfficialsDirectory` rule, restated in `lib/website-dbim/connect.ts`), then name.
- Letter rule: the first letter of the name after removing a leading honorific
  (Shri, Smt., Sh., Dr., Ms., Mr., Mrs., Kum., Km.).
- States: empty → `DbimEmptyState`; letter/search/category match nothing → named, with
  Clear; paged 10.

## 5. RTI (`connect_rti`)

- Left col 4/12, sticky `top 140px` ≥992: `.db-rti-nav` — n-50 ground, radius 10,
  padding 8/16. Header row "RTI Details" 12px/20px + `expand_less` primary-800 (DS
  `AccordionItem`, open by default). Body: `margin-top 8px`, `border-top 2px primary-800`;
  item padding 8/32, `border-bottom 0.5px primary-800`, 12px/20px.
- Right col 8/12: h2 "RTI" 20px primary-800, weight 400, `letter-spacing -0.12px`,
  margin-bottom 25; text 14px/22px, `letter-spacing 0.16px`, p margin 10; then two
  DS `AccordionItem`s restyled `.db-rti-acc`: border 1px n-100, radius 8, padding 16/32,
  margin-bottom 21; title 16px/24px 500 primary-800; chevron primary-800.
- Tables inside: header row primary-800 on primary-100, cells 14px, 1px n-100 rules.
- CONTENT: intro + application paragraphs are the reference's (the Department's DBIM
  site; statutory RTI text) — `SOURCE:` in `connect.ts`. The contact paragraph uses the
  Department's register address. CPIO / FAA tables from `getCpios()`, split by
  "Appellate"/"FAA" in name or designation. "Detailed RTI" links to the Department's
  Information Handbook under Section 4(1)(b) (ingested on the Transgender portal's RTI page).

## 6. Grievance Redressal (`connect_grievance_redressal`)

- Left `.db-lead-box` (shared with Events): n-100 ground, radius 10, padding 32; h2
  20px/36px 500 primary-800. Sticky `top 140px` ≥992.
- Right: text 14px/21px justified, p margin 10, bold run-in headings; button-link
  `.db-soft-btn`: padding 8/12, radius 4, primary-100 ground (hover primary-200),
  primary-800, 12px/18px 600 uppercase, `letter-spacing 0.12px`; external → new tab
  and says so.
- CONTENT: no grievance text of the Department's own exists in the estate (searched
  `app/`, `components/`, `content/`); the reference's CPGRAMS text is used with `SOURCE:`.

## 7. Parliament Questions (`connect_parliament_questions`)

- Two cards centred, each col 5/12 (card 535). Card: border 1px n-100, radius 12,
  padding-bottom 12, white. Image 185px cover, radius 12 12 0 0. Body padding 12/24:
  h2-as-`.h3` 16px/24px 500 ink, margin-bottom 5; then a row, space-between,
  align end: URL link 12px/18px 600 `neutralScale-700`, underlined; 40×40 badge
  primary-200 ground, primary-800 `open_in_new`, radius 4.
- 390: stacked, 16px apart.
- CONTENT: `DBIM_PARLIAMENT` (the Houses' own question archives).

## 8. Events (`connect_visitors_pass`)

- Left `.db-lead-box`: "No Upcoming Events" or, when there are some, the upcoming list
  (title link + date) inside the same box.
- Right: h2 "Past Events" 20px primary-800 400; cards: `border 5px solid n-50`, padding
  15, margin-bottom 25, justified; h3 16px/19.2px 500 ink; meta p 14px/21px:
  "<State> | Event Start: 28 August 2025 09:00 AM , Event End: …"; pin line 📍 + venue
  link (primary-600, underlined — the reference's Bootstrap `#0D6EFD` is not a DBIM
  colour) to Google Maps, new tab; description HTML 14px/21px.
- Paged 10 per page (the reference prints all).
- CONTENT: `getEvents()` split at today by `endDate ?? startDate`; past newest first,
  upcoming soonest first. State = the last segment of `location`. Times from `when`.
- `revalidate = 86400` so the split moves daily.

## Accessibility

One h1 (DbimPage). h2 per section, h3 per card title. Icons `aria-hidden`; the
contact lines carry visually hidden labels (Telephone, Email, Intercom, Address).
Letter buttons `aria-pressed`; disabled letters are `disabled`. Map iframe titled.
External links: new tab + "(opens in a new tab)". Lightbox: DS (trap, Esc, arrows).
