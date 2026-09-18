# What dosje.gov.in publishes, and where each field actually lives

Field inventory for every record collection the ingest reads, taken from the live
API and the live pages on **17 September 2026**. Counts are from that day.

## The one thing to know before adding a collection

**The REST API does not carry the fields the pages show.** `wp-json/wp/v2/<type>`
returns id, slug, title, date, link and taxonomy term IDs — and for every type
except `booking`, `acf` comes back as an empty array and `meta` as
`{"_acf_changed": false}`. `documents`, `gallery`, `official`, `scheme-documents`,
`suo-moto-disclosure` and `cpio` do not even expose `content`.

So the file URL, file size, year, publish window, event venue, organiser, gallery
images and an official's contact card exist **only in the rendered page**. Each
collection therefore reads its records' pages (`record-pages.mjs`, cached on disk
under `scripts/ingest/.cache/`, keyed by URL + `modified_gmt`) and parses them
with `detail-extract.mjs`. That is why the first run of `documents` takes minutes
and every later run is instant.

`documents` is the exception that is cheaper: the library's own listing
(`admin-ajax.php?action=filter_document_list`) renders the **same row markup**
ten records at a time, so 6,011 records cost ~602 requests instead of 6,011. Any
record the listing does not carry falls back to its own page.

**Sitemaps: use `sitemap_index.xml`, not `wp-sitemap-*`.** The core WordPress
sitemap URLs 301 to Rank Math's, and they do so for *every* `-N` suffix — which
is why the old `fetchSitemapUrls` probe reported 426 organisation URLs for a set
of 248 (it counted the same file five times). `fetchRankMathSitemapUrls` reads the
index and de-duplicates.

## The collections

| Collection (file) | REST base | Live | Ingested | Taxonomies (REST field = rest_base) | Where the fields come from |
|---|---|---|---|---|---|
| `documents.json` + `documents-central-list-of-obcs.json` | `documents` | 6,011 REST / 5,994 sitemap | 5,964 | `documents-type`, `organisation_cat`, `commission`, `states`, `component_status`, `serial-number`, `tags` | listing rows: title, organisation, year, size (`data-size-en`/`-hi`), publish window, file URL (`data-url-en`/`-hi`) |
| `scheme-documents.json` | `scheme-documents` | 100 | 100 | `organisation_cat`, `component_status`, `tags` | record page: same row, plus the `Scheme:` link |
| `suo-moto-disclosure.json` | `suo-moto-disclosure` | 14 | 14 | `organisation_cat`, `tags` | record page: same row (no Year column) |
| `events.json` | `events` | 635 | 635 | `event-category`, `gallery-category`, `organisation_cat` | record page: description, organiser/email/mobile/total hours, status badge, mode, "Date and Time", location, photo + video cards, `data-pdf-en` |
| `gallery.json` | `gallery` | 590 | 590 | `gallery-type`, `gallery-category`, `organisation_cat` | record page: description, `Source:` line + "Visit Link", `a[data-fancybox="single-gallery"]` (full) + its `img` (thumbnail), `<video>`, YouTube embeds; REST `featured_media` → cover |
| `official.json` | `official` | 453 REST / 448 sitemap | 452 | `officials-type`, `organisation_cat`, `designation`, `group-type`, `commission` | record page: portrait (largest `srcset` candidate), designation, organisation, tenure, intercom, office/residence phone, email, address, work allocation |
| `cpio.json` | `cpio` | 13 | 13 | `organisation_cat` | record page: office/division, name, organisation, designation, email |
| `booking.json` | `booking` | 12 | 12 | `booking-category` | REST `acf` (rating, `categories_and_rates`, `contact_for_booking`, `item_images`) + REST `content`; page: venue images, booking form / rate-list PDFs |
| `updates.json` | `updates` | 9 | 9 | `organisation_cat`, `component_status` | REST `content` only (no page fetch): body HTML, attachment links, `<video>` + poster |
| `sewer-death-cases.json` | `sewer-death-case` | 1,361 REST (no sitemap) | 1,361 | `sewer_state`, `sewer_district` | record page: state, district, name of deceased, date of death, payment status, amount |

Already ingested before this pass, unchanged here: `organisation` (228),
`schemes` (140), `tenders` (312), `vacancies` (163).

### Gaps, and why

- **`documents`: 6,011 REST rows → 5,964 records.** 47 are duplicates — a
  `…-2` sibling with the same title and the same file URL — removed by
  `dedup.mjs`. 17 published records are **not in the sitemap** (Rank Math lists
  5,994); they are kept, because REST is the register and the sitemap is an SEO
  artefact. Nothing in the sitemap is missing from REST.
- **`documents`: 77 records carry no file at all**, and 16 more link an external
  host (a Google Drive file, another department's site) instead of an upload —
  those are kept as `externalUrl`. 1,019 records publish no size.
- **`official`: 453 REST rows → 452 records.** One is a duplicate with the same
  title and contact card; two published records are absent from the sitemap.
- **Every other collection matches its sitemap exactly.**
- **Hindi files exist for 179 documents** (`fileUrlHi` / `fileSizeHi`); the rest
  publish one file, and the site's `data-url-hi` is then empty or identical.
- **`sewer-death-case` has no sitemap.** Its records are public — each case page
  returns 200 and is listed by district at `/sewer-death-detail/<district>/` —
  but no page in the sitemap, the main menu or the NCSK pages was found linking
  to those district listings. It is ingested (the register is public), and it
  carries **names of deceased individuals**, so confirm with the Department
  before rendering it.

### Not ingested, with reasons

| REST type | Why not |
|---|---|
| `posts`, `pages` | Pages are the site's prose, handled by the `sections` collections, not record data. |
| `attachment` (media) | Files are linked live, never downloaded — the product decision for this pass. |
| `elementor_library`, `elementor_snippet`, `e-floating-buttons`, `wp_block`, `wp_template*`, `wp_navigation`, `wp_global_styles`, `wp_font_*`, `nav_menu_item`, `rm_content_editor` | Theme/builder internals, not records. |

## Field notes worth keeping

- **A document can hold several `documents-type` terms.** `types` keeps them all;
  `category` prefers a term that has a listing page on our site (the
  `preferCategories` list) so a record that also carries an unlisted type still
  lands on the right page.
- **`organisation` is the abbreviation** the site prints ("NCSK", "NISD"), from
  `organisation_cat`. `official` records also keep the full name the page prints
  as `organisationName`.
- **Dates**: `date` is the WordPress publish date. `publishStart`/`publishEnd`,
  `dateOfDeath` and the event dates are the site's own values, normalised to
  `YYYY-MM-DD` where they parse (`dd/mm/yyyy`, `yyyymmdd`, `Sep 1st, 2026`) and
  left verbatim where they do not. `when` keeps the event's line as printed.
- **SCW event media is served from a different CDN** (`dxrs6j9umb85v.cloudfront.net`)
  and the live page says it is fetched from an API on every request — those URLs
  can move, unlike the `durwo6bhtjtqt.cloudfront.net` uploads.
- **A record may link out instead of uploading.** `fileUrl` is an upload on the
  department's CDN; `externalUrl` is the "View" link the theme renders when there
  is no upload. A record can have neither, and then only its metadata is on file.
- **Sizes are strings** ("116.85 MB") because that is what the site publishes; no
  byte count is exposed.
- **Rate limiting is real.** The origin answers 429 at roughly six concurrent
  requests; the client backs off on `Retry-After` and the pool defaults to 2
  (`INGEST_CONCURRENCY`).

## Running it

```bash
node apps/hub/scripts/ingest/index.mjs --only=events,gallery   # one or more collections
npm run test:ingest --prefix apps/hub                          # parsers and transforms
```

Output goes to `apps/hub/src/content/website/`, with per-collection counts in
`manifest.json` (`restCount`, `notInSitemap`, `sitemapOnly`, `withoutPageFields`).
`documents` is split by category: the Central List of OBCs (2,667 records) ships
as its own file so no single JSON module approaches the size at which bundling it
server-side becomes a problem.
