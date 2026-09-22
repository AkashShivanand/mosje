# Home Page Audit — 22 Sep 2026

Audited: `/website` on PR #580 against the live `dosje.gov.in` home page (fetched 22 Sep 2026),
the classic prototype, WCAG 2.2 AA, DBIM 3.0, GIGW 3.0 and UX4G 3.0.
Screenshots: `shots/home-audit/` (`classic-vs-new-home.jpg` side by side; after the rebuild: `before-after-*.jpg`).

## Verdict

**Not ready.** It passes automated accessibility checks, but it fails on visual quality, on
content coverage, and on four DBIM home-page elements.

- **Accessibility:** axe finds 0 violations at 1440 and 375, the page has one h1, and the tab
  title matches the h1.
- **Content:** it drops 7 of the live site's 12 home sections.
- **DBIM:** four home-page elements are missing.
- **The earlier "creative-director review" was not real.** It was the same model checking its
  own work against a checklist, and it passed a page that reads as a wireframe.

## 1. Creative-director review (visual)

| # | Finding | Severity |
|---|---|---|
| V1 | Flat: white and grey bands alternate, and outside the hero there is no brand colour, no saffron and no depth. | Blocker |
| V2 | One pattern repeated: persona tiles, offerings, organisations and helplines are all bordered boxes in a grid, so the page has no rhythm and nothing stands out. | Blocker |
| V3 | Almost no imagery: two photographs on the whole page. The live site carries scheme photographs, press photographs, portraits and social posts. | Major |
| V4 | "What the Department Offers" is a two-column list of blue links. It reads as a sitemap, not as the Department's offer. | Major |
| V5 | No proof: the three figures the Department publishes (₹67,977 Cr, 19.82 Cr, ₹8,731 Cr) were removed, so nothing shows the page's scale or impact. | Major |
| V6 | Section headings are small (SectionTitle at Headline-4) with little space above them, so the sections run together. | Major |
| V7 | "Latest from the Department" is three columns of text with no type, no document mark and no visual anchor. | Minor |
| V8 | Helpline cards have a light-blue fill with blue text; they are legible, but the three most urgent numbers on the page look like the least important. | Minor |
| V9 | Phone: the page is 10,641 px tall, and the hero's five task pills stack into a column 250 px deep. | Minor |

## 2. Content coverage against the live site

| Live section | New home | Status |
|---|---|---|
| SAMAVESH band (Single Access Mechanism…, Explore) | — | **Missing** |
| Hero banner (Mann Ki Baat campaign) | Static hero; campaign slot shows NMBA only | **Missing** (Mann Ki Baat) |
| About Us: mandate paragraph, quote, Our Team, Our Ministry, Our Reports | One sentence with three links | **Partial**: the mandate is cut, and the sentence used is not the Department's own |
| Ministers (three) | Shown | Covered |
| Statistics strip (3 figures + View Dashboard) | — | **Missing** |
| Our Offerings: featured scheme cards with Apply Now / Know More; Schemes / Vacancies / Tenders tabs | Ten category links; tenders and vacancies in Latest | **Partial**: no featured schemes and no Apply Now |
| What's New | "Updates" column | **Partial**: shows 2023 and 2024 items, and misses NOS Result (31 Jul 2026) and the DDAC EOI (4 Aug 2026) |
| Our Organisations | Shown, grouped | Covered |
| Recent Documents (Annual Reports, with size) | — | **Missing** |
| Explore User Personas (Government Official, Beneficiary, …) | Eleven beneficiary groups | **Partial**: no Government Official or Researcher entry (DBIM asks for 4, including Student and Researcher) |
| Activity Corner: Events, Press Releases, Circulars | — | **Missing** |
| Social Media Platforms | Footer icons only | **Missing** |
| Need Support? — Get in Touch | Helplines only | **Partial** |
| Footer: Vision & Mission, Organisational Chart, Schemes, Tenders, Vacancies, Notices, Acts & Rules, Reports, Publications, Statistics, CPIO, Visitor Analytics | Only some of these | **Partial**: 11 links missing, and "Help" appears twice |
| Important Links rail (division pages) | — | **Missing** |
| Total Visits, Last Updated | Shown | Covered |

Content errors on the page:

- **"Hindi Pakhwada 14 September to 28 September 2024" is listed under Tenders.** The
  miscategorisation is in the Department's source (`tenders.json`), but the page should filter it out.
- **"Updates" is sorted newest-first but shows items from 2023 and 2024.** The update feed we
  ingested is older than the live site's What's New, so it needs to be re-synced.

## 3. Standards

| Standard | Item | Status |
|---|---|---|
| WCAG 2.2 AA | axe at 1440 and 375; one h1; landmarks; skip link; focus | Pass (automated) |
| DBIM 3.0 | PM Quote | **Fail**: needs the Ministry's quote and image |
| DBIM 3.0 | Statistics strip | **Fail** |
| DBIM 3.0 | Social media cards | **Fail** |
| DBIM 3.0 | Four personas including Student and Researcher | **Fail** |
| DBIM 3.0 | CCPS campaign banner, organisations strip, footer lineage, last updated, visitor counter | Pass |
| GIGW 3.0 | Visitor Analytics link, which the live footer carries | **Fail** |
| SEO (register SEO-04) | GovernmentOrganization and WebSite structured data | **Fail**: none on the page |
| Copy | Title Case, government register | Pass |
| Copy | Department's own words | **Fail**: the About sentence was rewritten |

## 4. Fix plan (home page only)

1. **Visual direction.** Keep SAMAVESH and the tokens, but add:
   - a navy hero that carries the three published figures;
   - saffron accents;
   - photographic scheme cards;
   - larger section headings;
   - a clear rhythm of light, tint and deep bands;
   - a helpline band in deep navy.
2. **Restore the missing live sections, redesigned:**
   - SAMAVESH band
   - statistics
   - featured schemes with Apply Now
   - What's New from the live feed
   - Recent Documents
   - Activity Corner (Events, Press Releases, Circulars)
   - Social Media
   - Need Support
3. **Personas:** add Government Official and Researcher to the eleven groups.
4. **About:** use the Department's own mandate paragraph and quote.
5. **Footer:** add the 11 missing links and remove the duplicate Help.
6. **Page mechanics:**
   - add GovernmentOrganization and WebSite JSON-LD;
   - filter non-tenders out of Tenders;
   - re-sync the updates feed.
7. **Needs the Ministry:** the PM Quote, and Mann Ki Baat or other campaign banners. The slot stays built, not faked.

## 5. Resolution — rebuild, 22 Sep 2026

| Finding | Resolution |
|---|---|
| V1 flat, no brand colour | The page now runs in bands: navy hero; white, tint and grey sections; India-green campaign; navy helplines. Saffron appears as fill rules only. |
| V2 one card pattern | Each section has its own form: group tiles with illustrations, role pills, scheme cards, a plain list of support kinds, document tiles, event cards, photograph cards, helpline cards and account rows. |
| V3 little imagery | Added Ministers' portraits, press photographs and event photographs. |
| V4 offerings as a sitemap | Six featured schemes, using the catalogue's own card, show where to apply; the ten kinds of support are a list below them. |
| V5 no figures | The three published figures sit in the hero, with View Dashboard. |
| V6 small headings | `SectionTitle` gains `size="display"` and `tone="inverse"` in the design system (changelog entry pending). |
| V7 plain Latest | What's New: each item has a type icon and label, a date and its issuing organisation. Near-duplicates are merged, and items older than 12 months are left out. |
| V8 weak helplines | Navy band, moved to third on the page, with a visible Call button (a 48px target) on each helpline. |
| V9 phone length | 10,641 → 15,918 px. The page is longer because five live sections are back. Phone rules limit each list to its first items plus its View All link. |
| Missing sections | SAMAVESH band, statistics, featured schemes, Annual Reports, Events and Media, Follow the Department and Need Support are restored. The Divisions list replaces the Important Links tab. |
| Personas | Added "Information by Role": Students, Beneficiaries, Researchers and Government Officials. |
| About | The Department's own mandate text, with one pronoun change recorded in `facts.ts`. The one-line statement below it was dropped because it repeated the mandate. |
| Footer | Added the Services and Resources columns, Directory and CPIO. Help and Sitemap now appear once each, and Visitor Analytics is added. |
| JSON-LD | Added GovernmentOrganization and WebSite. SearchAction is withheld until the site's search address is final. |
| Hindi Pakhwada | Filtered out of Tenders. The source record still needs correcting by the Department. |
| SAMAVESH band contrast | The band uses `tone="dark"` (6.5:1). The design system's default, white on saffron (2.91:1), fails WCAG 1.4.3 and should be changed in the design system; this is recorded here. |
| "Yojna" | Corrected to "Yojana" in the organisation register, following the Annual Report and PIB. |

**Still open:**
- **PM Quote:** needs the Ministry.
- **Campaign banners (for example Mann Ki Baat):** needs the Ministry.
- **All-capital titles in the source registers:** these are shown as published and are left for the Department to correct.
- **Missing logos for DAF, NCSK and SCW:** the Emblem is shown in their place.
- **Organisations list on phones:** it is still long, at 21 cards.

**Evidence:**
- axe: 0 serious or critical findings on `/website` at 1440 and 375.
- 684 unit tests pass.
- Gates pass: typecheck, stylelint, eslint, `check:props`, breakpoints, website links, link-as, chrome, shadow-ui, icon scale, template adoption, sidebar adoption and ds-pages.
- An independent critique (a separate agent that did not build the page) was run, and its findings were applied as described above.
