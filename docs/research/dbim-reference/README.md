# The DBIM reference build — capture, inventory and topology

**Target:** `https://master-socialjustice.digifootprint.gov.in/` — the Department of Social
Justice and Empowerment's site built on the DBIM 3.0 template by the DBIM programme.
On the clarity call of **25 Sep 2026** the DBIM review team put it on screen and said
the Department's website "should look exactly like this". DBIM is enforced as a
template: the header, the fixed top menu, the home sections and every inner page the
DBIM manual shows an example of must follow it. The Department's only choice is the
colour group. This build uses **Colour Group 5 (blue)**, as the reference does
(`<html class="group5">`).

Captured the same day with Playwright at 1440 and 390 px, 35 pages × 2 widths, no
failures. `shots/` holds reduced JPEG copies (1440 at 40 %, 390 at 60 %); the
full-resolution PNGs, the rendered HTML and per-element computed styles were kept in the
session scratchpad for the build and are not committed. `reference-used.css` is the
subset of the reference's 8.5 MB stylesheet that any captured page actually matches
(1,166 rules, Colour Group 5 only). `BUILD_CONTRACT.md` is what every builder worked to.
`tools/` holds the style inspector and the side-by-side compare script.

## Route inventory

The reference is a Next.js pages-router app. Its route table, from `_buildManifest.js`:

| Template route | Captured as | Clone route (`/website/…`) |
|---|---|---|
| `/` | `home` | `/` |
| `/[parentslug]` | `ministry`, `offerings`, `documents`, `media`, `connect` | `/ministry`, `/offerings`, `/documents`, `/media`, `/connect` |
| `/[parentslug]/[slug]` | `ministry_our_team`, `…_our_division`, `…_our_organisation`, `…_our_performance`, `…_directory`, `offerings_vacancies`, `offerings_tenders`, `documents_orders_and_notices`, `documents_publications`, `media_videos`, `connect_directory`, `connect_rti`, `connect_grievance_redressal`, `connect_parliament_questions`, `connect_visitors_pass` | same paths; `visitors-pass` (labelled "Events") is `/connect/events` |
| `/[parentslug]/[slug]/details/[children]` | `offerings_schemes_and_services_details_…avyay…` | `/offerings/schemes-and-services/[id]`, `/ministry/our-division/[slug]`, `/ministry/our-organisation/[slug]` |
| `/documents/[slug]/[childslug]` | `documents_reports_annual_reports_…poa…` | `/documents/[category]/[series]` |
| `/media/[slug]/…`, `/media/gallerydetail/[slug]` | — (album detail not captured) | `/media/photos/[slug]` |
| `/whats-new` · `/important-links` · `/archives` · `/policies` · `/RelatedLinks` · `/sitemap` · `/help` · `/cookies` · `/feedback` · `/search` · `/persona/[slug]` | same stems | same, `RelatedLinks` → `/related-links` |
| `/dashboard` | `dashboard` (renders empty on the reference) | the menu's "Our Performance" (`/ministry/our-performance`) |
| `/aisearch`, `/search-copy`, `/new-template`, `/profile`, `/socialFeed/socialFeeds`, `/feedback/feedbackBox` | not linked from any page | not built |

**The menu** (fixed by DBIM; ruled non-negotiable): Home · Ministry (About Us, Our Team,
Our Division, Our Organisation, Our Performance, Directory) · Offerings (Schemes and
Services, Vacancies, Tenders) · Documents (Reports, Orders and Notices, Publications) ·
Media (Photos, Videos) · Connect (Contact Us, Directory, RTI, Grievance Redressal,
Parliament Questions, Events). **Footer:** Archives, Website Policies, Related Links,
Sitemap, Help.

## Page topology

**Chrome, every page.** Header 1 (white, one row): emblem + Government of India /
Ministry / **Department** · search · Digital India · three controls (skip to main
content, language, accessibility). Menu row (sticky, 2px primary-800 bottom rule; active
item bold blue with an 8px bar; dropdown dark translucent). Footer (primary-800): Useful
Links, Subscribe for Updates (4 social icons, MyGov and india.gov.in badges), ownership
line, last updated. Cookie bar at the bottom until answered.

**Home (1440 px, y-offsets).** 181 banner carousel (6 slides, 480 px) + Announcements
ticker (grey, 49 px) · 710 PM quote (grey) · 1050 About Us + three Ministers in one row ·
1393 Key Offerings (tabs Schemes and Services / Vacancies) + What's New (dark panel) ·
1902 Recent Documents (2×2) + Explore User Personas (carousel) + Important Links · 2498
In Social Media (dark band, four feeds) · 3017 campaign row (two central campaigns, one
Department item) · 3345 partner-logo carousel · 3507 footer.

**Inner pages.** Banner (210 px photograph per section, primary-800 gradient, breadcrumb,
white h1) → dark rounded sub-tab bar overlapping its foot → content in a 1320 px
container. Content templates: article with a side panel (About Us, scheme detail, RTI,
grievance); card grid with filter bar and pager (divisions, organisations, schemes,
vacancies, photos); table with filter bar (reports, orders, publications, tenders,
archives, what's new); directory with an A–Z strip; org chart + office tables (Our Team);
tile grids (performance, parliament questions, persona pages); plain policy text; form
(feedback).

**Interaction models.** Banner: time-driven carousel with pause. Announcements: CSS
marquee (40 s) with pause. Key Offerings: click tabs. Personas and partners: click
carousels. Menu: hover and click dropdowns. Everything else static; filters and pagers
are click-driven and client-side.

## Decisions taken in this build

- **Style is the reference's; content is the Department's.** Every list reads the
  estate's own data modules. Where the reference showed something the estate did not
  have — the six campaign banners, 22 partner marks, Minister and PM portraits, section
  banners, persona art, scheme photographs — it was fetched from the reference and kept in
  `apps/hub/public/website/dbim/` (registry: `lib/website-dbim/assets.ts`) so every
  design can use it.
- **The reference's placeholders are not copied.** Its PM quote reads "TEST /
  UNDEFINED.UNDEFINED.07.10.2025" and several of its lists are empty; the clone shows the
  Department's real quotation and records.
- **About Us buttons follow the reviewer, not the build.** The reference shows Our Team /
  Our Division / Our Organisation; the review team ruled Our Team / Our Organisation / Our
  Performance, with Our Performance leading to the dashboard.
- **Colour is bound, not typed.** `data-brand="dbim"` maps every reference colour to a
  `--sa-*` token (table in `BUILD_CONTRACT.md`).
- **Type is converted.** The reference's root is 62.5 %; its rems are divided by 1.6 and
  switch at 1537 px as the reference's do.
