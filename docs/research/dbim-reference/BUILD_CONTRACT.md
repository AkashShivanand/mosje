# DBIM design — build contract

The website gains a third design, **DBIM Design**, beside the 2026 redesign and the
archived classic design. It is a clone of the Department's DBIM 3.0 reference build
**master-socialjustice.digifootprint.gov.in**, which the DBIM review team named as the
target on 25 Sep 2026: *"the website should look exactly like this."* DBIM is being
enforced as a template, not a guideline: header, menu, home sections and the example
inner pages must match its structure and look. Only the colour group is ours to pick —
the reference uses **Colour Group 5 (blue)**.

**Style: 100% the reference's. Content: 100% ours** — the Department's real content from
the estate's own data modules. Where the reference shows something we have no data for,
the reference's own content (fetched 25 Sep 2026, in `lib/website-dbim/assets.ts`) is
used, never lorem, never invented.

## Where things are

| What | Path |
|---|---|
| Worktree (all work happens here) | `/private/tmp/claude-502/-Users-akashk-Documents-Projects-MoSJE/8b3eeeec-2e5d-43f2-82de-c2f1814e6647/scratchpad/wt-dbim` — branch `feat/website-dbim-variant` |
| Reference captures (outside the repo) | `…/scratchpad/ref3/` — `shots/<page>@1440.png` and `@390.png` (full page), `html/<page>.html` (rendered DOM), `styles/<page>.json` (computed styles) |
| Reference CSS actually in use | `…/scratchpad/used.css` (1,166 rules, Colour Group 5 only; `.group5 ` prefixes everything) |
| Style inspector | `python3 docs/research/dbim-reference/tools/inspect.py --ref ../ref3 <page> --cls <class> \| --text "<text>" \| --y 0:600` |
| Side-by-side compare | `node docs/research/dbim-reference/tools/compare.mjs --ref ../ref3 --out ../cmp/<you> <clonePath> <refStem> [--width 390] [--crop y0:y1]` then Read the `.pair.png` |
| Dev server (already running — do not start another) | `http://localhost:3018/website-dbim/<path>` |
| Assets fetched from the reference | `apps/hub/public/website/dbim/**`, registry `apps/hub/src/lib/website-dbim/assets.ts` |
| Menu / routes | `apps/hub/src/lib/website-dbim/nav.ts` (`DBIM_MENU`, `dbimHref`, `DBIM_FOOTER_LINKS`, `DBIM_POLICY_TABS`, `DBIM_HEROES`) |

Reference page stems: `home ministry ministry_our_team ministry_our_division ministry_our_organisation
ministry_our_performance ministry_directory offerings offerings_schemes_and_services_details_atal_vayo_abhyuday_yojana_avyay_ADNwITMtQWa
offerings_vacancies offerings_tenders documents documents_orders_and_notices documents_publications
documents_reports_annual_reports_on_prevention_atrocity_act_poa_2_kTM4MTMtQWa_pageTitle_An media media_videos connect
connect_directory connect_rti connect_grievance_redressal connect_parliament_questions connect_visitors_pass
whats_new important_links archives_page_tenders policies RelatedLinks sitemap help cookies feedback search dashboard
persona_For_20IT_20Professional_IDM5MTMtQWa`

## The shared kit (import these; do not re-create them)

| Import | From | Props |
|---|---|---|
| `DbimPage` | `@/components/website-dbim/layout/DbimPage` | `{ title, crumbs, path, hero?, tabs?, activeTab?, children }` — the inner-page banner (photo + gradient, breadcrumb, h1), the dark rounded sub-tab bar overlapping its foot, and the page container. **Every inner page is `<DbimPage>`.** |
| `DbimSectionHeading` | `@/components/website-dbim/ui/SectionHeading` | `{ icon, title, as?, tone?, id? }` — home-section heading: DBIM icon + blue title |
| `DbimIcon`, `DbimEmblem` | `@/components/website-dbim/ui/icons` | `name`: about · offerings · whats-new · documents · personas · important-links · social · team · division · organisation · announcements · skip-to-content · language · accessibility |
| `DbimViewMore` | `@/components/website-dbim/ui/ViewMore` | `{ path, label?, ariaLabel?, size? }` — outlined "VIEW MORE ›" link |
| `DbimFilterBar` | `@/components/website-dbim/ui/FilterBar` | `{ search, sort?, category?, perPage? }` — the reference's search / Sort by / Category / "10 per page" row |
| `DbimPagination` | `@/components/website-dbim/ui/Pagination` | `{ page, pageCount, onChange }` |
| `useListing` | `@/components/website-dbim/ui/useListing` | client hook: search + category + sort + page over a whole array |
| `DbimEmptyState` | `@/components/website-dbim/ui/EmptyState` | the reference's centred "No Data Available." |

The kit is being built by the chrome builder at the same time as you work. Until it
lands, the files are typed stubs with FINAL props — code against the props, and your
pages will pick up the real rendering without changes.

## Rules (the estate's, and they are gated)

1. **Colour is always a token.** Scope every rule under `[data-design="dbim"]`, inside
   `@layer components` (declare `@layer theme, base, components, utilities;` first — see
   `dbim.css`). The subtree has `data-brand="dbim"`, so:
   `#162F6A → var(--sa-color-primaryScale-800)` · `#214AAB → -600` · `#5279D7 → -400` ·
   `#A3BBF3 → -200` · `#D2DFFF → -100` · `#150202 → var(--sa-color-text-default)` ·
   `#FFF → var(--sa-color-neutralScale-0)` · `#EBEAEA → var(--sa-color-neutralScale-100)` ·
   `#C6C6C6 → -200` · `#000 → -1000`. Anything else: find the nearest `--sa-*` token and say
   so in a comment. `npm run lint:css` fails on a typed colour.
2. **Type:** the reference's `html` is 62.5% (1rem = 10px). Convert every reference rem to
   ours (÷1.6): reference `1.4rem` = 14px = `0.875rem`. Use the `--db-fs-*` variables from
   `dbim.css` where they fit (h1 h2 h3 h4 p small — they already switch at 1537px as the
   reference does); otherwise a rem literal with a `/* 18px */` comment.
3. **Spacing:** `--sa-padding-* / --sa-stack-* / --sa-inline-*` where the value exists
   (0 2 4 6 8 12 16 20 24 32 40 48 56 64 72 80 120), `--sa-shape-*` for radii
   (0 2 4 6 8 12 16 20 24 32 40 full). Other values are px literals with a comment.
   `var(--db-gutter)` is the reference's page gutter (120 / 64 / 16).
4. **Every `<button>` is a design-system button** — `Button` / `IconButton` from
   `@mosje/design-system`, restyled with your `db-*` class (`appearance="text"` gives you
   the least to undo). `npm run check:raw-button` fails on a raw `<button>`. Links styled as
   buttons are `<Link>` with a class. A DS component that takes `href` gets `linkAs={Link}`.
5. **Links:** internal hrefs are `dbimHref("/path")` → `/website/path`, rendered with
   `next/link`. External links: `target="_blank" rel="noopener noreferrer"` and an
   accessible name that says it opens a new tab.
6. **Images:** `next/image` (`<Image>`) with real `alt`; decorative images `alt=""`.
7. **Server components by default.** `"use client"` only for the interactive part, as a
   leaf. Data is read on the server from the estate's modules and passed down.
8. **Content is ours, not the reference's.** Read it from:
   - schemes: `@/lib/website-next/schemes` (the scheme master — personas, offerings,
     schemes with `name`, `provides`, `who`) and `@/lib/website/content` (`getSchemes()`,
     `getScheme(slug)` — ingested scheme pages with `sections[].html`)
   - organisations, divisions, officials, NGO grants: `@/data/website`
   - documents, tenders, vacancies, events, gallery, officials, CPIOs, updates:
     `@/lib/website/content` (`getAllDocuments`, `getDocumentsOfType`, `getTenders`,
     `getVacancies`, events/gallery/official/cpio/updates getters — read the file for names)
   - what's new: `@/lib/website-next/whats-new`
   - ingested HTML goes through `withAssetBasePath()` before `dangerouslySetInnerHTML`
   - the redesign (`components/website-next/**`) and the classic site
     (`components/website/**`) already solve most content questions — read how they pick
     and order things, and reuse their selectors; do not import their components.
   Where the reference shows something the estate has no data for, use the reference's
   content (it is the Department's own site) and add it to a `lib/website-dbim/*.ts` module
   with a `SOURCE:` comment so the other designs can reuse it.
9. **Copy:** Title Case for every title; the reference's own labels verbatim (they are the
   DBIM template's: "View More", "Key Offerings", "What's New", "Recent Documents",
   "Explore User Personas", "Important Links", "In Social Media"). No explanatory
   sentences about the data or the build on the page.
10. **Every data state is designed:** empty ("No Data Available." — the reference's own
    wording), filtered to nothing (name the search and offer to clear it), and long lists
    are paged (10 per page), never scrolled inside a card.
11. **Accessibility is not traded:** landmarks, one h1 per page (DbimPage's), headings in
    order, visible focus (`outline` on `:focus-visible`), keyboard-reachable carousels with
    pause, `aria-current` on the active tab/menu item, labels on every input.
12. **Responsive:** match the reference at 1440 AND 390 (both are captured). Mobile-first
    is fine; the reference's breakpoints are 1537 / 1280 / 992 / 768 / 440.
13. **Do not touch** files outside your ownership list. Do not commit, do not `git add`,
    do not run `npm run build`, do not start a dev server. You may run
    `npx tsc --noEmit -p apps/hub` and `npx stylelint "<your css files>"`.

## How to work

1. Read your reference shots (`Read` the PNGs in `../ref3/shots`) at 1440 and 390.
2. For each element, pull exact values with `inspect.py` (computed styles) and, for hover
   / focus / active / breakpoints, grep `../used.css` for the class names you see in
   `../ref3/html/<page>.html`.
3. **Write your spec first**: `docs/research/dbim-reference/components/<area>.spec.md` —
   the elements, their exact computed values, the states, the content mapping (reference
   element → our data source), responsive changes.
4. Build. Keep a component under ~200 lines; split when it grows.
5. **Verify visually** with `compare.mjs` at 1440 and 390 for every page you own; Read the
   pair images; fix until spacing, type, colour and layout match. Zoom in with `--crop`.
   Differences that come from OUR content (longer names, more rows) are expected — layout,
   type, spacing and colour are not allowed to differ.
6. `npx tsc --noEmit -p apps/hub` must pass. Stylelint your CSS.
7. Report: files created, pages built, what still differs from the reference and why.
