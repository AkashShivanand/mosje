# Link map — DBIM design

**Rule:** a DBIM page never links to a page that does not exist in the DBIM design.
For each link, in this order: (a) an existing DBIM page with the same content;
(b) a DBIM route that renders the same **data** (imported from the module the other
design reads, never page text copied into a new file); (c) drop the link.
Shared data (`@/data/website/**`, `@/lib/website/**`, `@/lib/website-next/**`) is
never changed; everything is mapped in the DBIM layer.

Crawl on 25 Sep 2026 before: 168 pages, **43 bad**. After: 133 pages, **0 bad**
(`node linkcheck.mjs` from the scratchpad).

## 1. What's New items (home Announcements bar, home What's New box, What's New page)

`whatsNew()` links `/website/documents/<slug>` and `/website/updates/<slug>`, pages
only the 2026 design has. All three DBIM surfaces now resolve an item with **one**
function, `whatsNewTarget()` in `lib/website-dbim/documents.ts`
(data-state-completeness.md §2):

| Item | Opens |
|---|---|
| Document in a live series | that series page, `/documents/<tab>/<series>` (Orders and Notices preferred when it carries two types, as What's New files it) |
| Document whose series holds only that file | the file (as the folder row does) |
| Document the Department flagged Archived | its file |
| Update | its first attachment, else its dosje.gov.in page (new tab) |

The feed's own `href` is not used anywhere in the DBIM tree. Announcements gained
`external` so a file or dosje.gov.in link opens in a new tab and says so.

## 2. PM-AJAY dashboard

| Old | New |
|---|---|
| `/dashboard` (PM-AJAY tile, Ministry › Our Performance) | **new route** `app/website-dbim/dashboard/page.tsx` — same components (`DashboardGlance`, `AdarshGramDashboard`, `GiaDashboard`, `HostelDashboard`) and same data functions as `app/website/dashboard`, inside `DbimPage`. `DashboardGlance`'s rules are scoped to `[data-design="next"]`, so they are re-stated under `[data-design="dbim"]` in `components/website-dbim/dashboard/dashboard.css`. |

## 3. Division Related Links (`DIVISIONS[].links`)

Mapped by `DBIM_DIVISION_LINK_MAP` in `lib/website-dbim/ministry.ts`. External links
pass through. **A link missing from the map is dropped**, so a link added to the shared
data later cannot 404 — add its row. A division left with no links shows no Related
Links heading.

| Division | Old href | DBIM destination |
|---|---|---|
| Scheduled Caste Welfare | `/about-the-division` | dropped — the reader is on this division's page |
| | `/list-of-scheduled-castes` | **new** `/ministry/our-division/scheduled-caste-welfare/list-of-scheduled-castes` (`SCHEDULED_CASTE_LISTS`, `NCSC_FUNCTION_CIRCULARS`) |
| | `/policies-acts-rules-circular` | `/documents/publications/acts-rules` — the Acts & Rules series holds the same PoA Rules 2016/2018 and PCR/PoA scheme guidelines |
| OBC Welfare | `/about-the-division-welfare-of-the-other-backward-classes` | dropped — on this page |
| | `/policies-acts-rules-codes-circular` | `/documents/publications/acts-rules` — nearest series (NCBC Act, 102nd/105th Amendment Acts). The four Central List amendment notifications on the 2026 page are not in the register |
| | `/welfare-of-the-other-backward-classes` (FAQs) | dropped — text only |
| Grants-in-Aid to NGOs | `/prioritization-guidelines-…`, `/procedure-for-processing-…`, `/inspection-and-monitoring-procedure`, `/penalties-in-case-of-misutilisation-of-grants`, `/cessation-of-voluntary-organisation-activities`, `/guidelines-for-assisting-ngos-voluntary-organisations` | dropped (6) — text only |
| | `/minutes-of-screening-committees` | **new** `…/grants-in-aid-to-ngos/minutes-of-screening-committees` (`SCREENING_COMMITTEE_MINUTES`) |
| | `/grants-suspended-list-blacklisted-ngos` | **new** `…/grants-in-aid-to-ngos/grants-suspended-list-blacklisted-ngos` (`NGO_ENFORCEMENT_REGISTER`, searchable and paged; `BLACKLISTING_ORDERS`) |
| | `/list-of-de-blacklisted-ngos` | **new** `…/grants-in-aid-to-ngos/list-of-de-blacklisted-ngos` (`DE_BLACKLISTED_NGO_ORDERS`) |
| | `/grants-in-aid-to-ngos-faqs` | dropped — text only |
| Budget and Account | `/detailed-demand-for-grant` | **new** `…/budget-and-account/detailed-demand-for-grant` (`DETAILED_DEMAND_FOR_GRANT`) |
| | `/contact-person` | `/ministry/directory` — the Department's directory carries the accounts office (PR.CCA). The 2026 page's names are an older list typed into its page file |
| Social Defence | `/about-the-division-social-defence` | dropped — on this page |
| | `/drug-division` | dropped — text only (the Drug Division's list of sections) |
| | `/organisation-under-division-social-division` | `/ministry/our-organisation/national-institute-of-social-defence` — the 2026 page's only content is NISD |
| | `/policies-acts-rules-codes-circular-social-defence` | `/documents/publications/acts-rules` — holds the Senior Citizens Act 2007 and the Transgender Persons Acts and Rules |
| | `/social-defence-faqs` | dropped — text only |
| Statistics Division | `/about-the-division-statistics-division` | dropped — on this page |
| | `/list-of-research-evaluation-studies` | dropped — text only. The DBIM Evaluations series is a different set (NBCFDC's studies), so pointing there would mislead |
| | `/handbook-on-social-welfare-statistics` | **new** `…/statistics-division/handbook-on-social-welfare-statistics` (`SOCIAL_WELFARE_STATISTICS`) |
| Official Language | `/official-language-background`, `/official-language-act`, `/activities-of-the-ministry-official-language` | dropped (3) — text only. The background's first sentence is already the division's summary |
| Parliamentary Matters | `/assurances` | dropped — text only |
| | `/special-mention-matters-raised-under-377` | **new** `…/parliamentary-matters/special-mention-matters-raised-under-377` (`SPECIAL_MENTION_MATTERS`) |
| Plan Division | `/about-the-division-2` | dropped — on this page (the division now shows no Related Links) |

"Text only" means the content exists only as JSX or a non-exported array inside the 2026
design's `app/website/<route>/page.tsx`. Porting it would mean copying page text into a
new file, which the rule forbids. **To restore these links**, move the content into a
data module under `@/data/website` (a shared-data change for its owner), then add a
register here.

### Register pages

One route, `app/website-dbim/ministry/our-division/[slug]/[register]/page.tsx`
(`dynamicParams = false`), reads `DBIM_REGISTERS` in `lib/website-dbim/division-registers.ts`.
The title is the division's own link label. File lists use `DbimFileList`. The NGO
enforcement table is `components/website-dbim/division/EnforcementTable.tsx`: search,
10 per page, empty and filtered-to-nothing states, drawn as the reference's rich-text table.
Dates are converted from the Department's "26 Jan 2024" format to ISO for the list's
formatting and sort. The four State names the Constitution spells differently are
corrected for display (the same rule as the 2026 page, issue CON-11).
