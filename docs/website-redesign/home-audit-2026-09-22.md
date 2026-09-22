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

## 6. DBIM, GIGW and design-system pass — 22 Sep 2026

The layout is unchanged except for the banner and ticker added at the top. The other changes put design-system components and tokens in place of hand-built parts. Pictures: `shots/home-audit/pass3-*.jpg`.

| Item | Before | After |
|---|---|---|
| DBIM §A.4.1 ii, §7.4.1 — top banner carousel, CCPS banner first | None | `Carousel` at 1800×600. The first slide is the CCPS banner, read from the feed where one is configured and otherwise from a copy of what dosje.gov.in serves (Mann Ki Baat, as on 22 Sep 2026, `lib/website-next/ccps.ts`). Then the live site's four banners. No auto-advance. |
| DBIM §A.4.1 iii — announcements ticker | None | The design-system `Ticker`, showing the newest What's New items with their kind and issuer. It can be paused and stops under reduced motion. |
| DBIM §3.7 — icons in the darkest shade or white | Glyphs in rung 600 | White glyphs on the key colour's darkest shade, inside `ActionTile`. |
| DBIM §2.1 — one primary colour group | Campaign band on India green | Campaign band on the brand tint. The green stays in the NMBA mark only. |
| DBIM §A.4.1 vi — five of each | 3 tenders, 3 vacancies | 5 and 5 |
| DBIM §A.4.1 viii — Recent Documents | Annual Reports only | The four latest documents of every citizen-facing type, plus links to the five document collections |
| GIGW — bilingual | Hindi set `lang="hi"` and translated nothing on the page | The page's own copy is opted into Bhashini through `<T>` (verified: the strings reach `/api/bhashini/translate`). Register text is marked `lang="en"`. Real Hindi needs the Bhashini key on the deployment. |
| Language dialog | Right column overflowed the dialog by 4px | `minmax(0, 1fr)`, so options wrap |
| Reflow at 320px | 6px horizontal scroll (hero grid) | None |
| Hand-built surfaces | Section bands, task/group/role/helpline/document/social tiles, the figures and type labels | `Band` (gains `brandBold` and `xl`), new `ActionTile`, `FactStrip` (gains `note`), `Badge` |
| Typed values equal to tokens | 1.5rem, 0.8 opacity, and 40/48/64/44px boxes | Gone from the page; the tile sizes bind `--sa-icon-size-*` inside `ActionTile` |

**Kept hand-built, and why:**
- **The hero search** stays a plain GET form. The design-system `Search` is a controlled client component, and this form must work before any script loads.
- **The Minister cards** stay page-built. `Avatar` stops at 48px.
- **The link lists** stay plain `next/link` lists. The design-system `Link` has no router support.

**Checks:** axe finds 0 violations on `/website` at 1440 and 375. In the keyboard pass every tile is one Tab stop with a visible ring. There is no horizontal scroll at 320px or at 200% zoom, and `npm run check` passes.

**Still open:**
- **Needs a person:** the Bhashini key on the deployment, a CCPS subscription (the snapshot stands in until then), an authorised PM Quote, and one headshot set (DBIM §6.1.4).
- **`ActionTile` has no Figma master yet**; it is recorded in design.md.
- **The SAMAVESH band's default tone still fails contrast** (2.91:1) wherever another page uses it.
- **Source-register typos are shown as published**, for example "31st Sugust".

## 7. Live-site order, rotating banner, prototype Hindi — 22 Sep 2026

The page now follows the live dosje.gov.in home order: banner → About with Ministers and the statistics strip → Offerings → What's New → Organisations → Nasha Mukt Bharat → Recent Documents → personas → Events and Media → social → Need Support with helplines. Two additions are kept for stated reasons:
- **The DBIM announcements ticker** (§A.4.1 iii).
- **A compact search-and-tasks band** (NAV-01: the live site gives a citizen no starting task). It has no photograph, since the banner carries the imagery.

**Banner.**
- It advances every 7 seconds, as the live site's does. Pause, hold-on-hover, hold-on-focus and reduced motion all come from `Carousel`.
- A new design-system option, `Carousel controls="overlay"`, puts the controls in a solid pill in the banner's bottom-right corner. They sit clear of the CCPS banner's text.
- On phones the controls return to a row below, because the banner is only about 125px tall there.

**Hindi (mock, by instruction).**
- `lib/bhashini/prototype-hi.ts` holds Hindi for the home page and its menus. The translation route uses it only while Bhashini is not configured.
- Fixed in the translation provider: a page with more than 100 strings was refused (HTTP 413), and the provider then re-requested it in a loop — 70+ requests in 8 seconds. It now sends batches of up to 100 and asks for each string once per language. After the fix the page makes 2 requests, both succeed, and the masthead, headings, tiles, About and Ministers switch to Hindi.

**CCPS (mock, by instruction).** The stored copy of the live banner is the first slide (`lib/website-next/ccps.ts`).

**Checks:**
- `npm run check` passes.
- axe finds 0 violations on `/website` at 1440 and 375.
- There is no horizontal scroll at 320px or at 200% zoom.
- Pictures: `pass4-*.jpg`.

## 8. SAMAVESH band — creative-director review, 22 Sep 2026

| # | Finding | Severity | Resolution |
|---|---|---|---|
| S1 | Full India Saffron band with near-black ink is the loudest surface on the page. It competes with the banner directly beneath and reads as a warning strip. | Major | Website uses the component's `tone="tint"`: pale saffron ground, saffron top rule and badge ring, 17.29:1 (was 6.5:1). Band and drawer now share one ground. |
| S2 | "Choose a portal to visit" and "Find your portal" are sentence case (estate rule: Title Case). | Minor | Website passes `drawerTitle` and `viewAllLabel` in Title Case. **Open:** the component default and the Figma master are still sentence case and should move together. |
| S3 | Green Explore button, green drawer heading and green link, beside saffron portal codes: three hues in one panel. | Minor | **Button stays India Green**: SAMAVESH's brand is saffron and green (decided 22 Sep 2026). Under `tone="tint"` the drawer heading is plain ink and the link the link blue, so the button is the one green on the pale ground. |
| S4 | Three portals show the national emblem in place of their own mark (e-Utthaan, e-Anudaan, SCW). | Minor | **Open:** needs the portals' marks. |
| S5 | On a phone the drawer is eight full-width tiles, about 2.5 screens. | Minor | Below tablet the drawer is a list of compact rows: 688px for eight portals, down from about 970px. The phone band's hover wash no longer sticks after a tap. Picture: `samavesh-band-phone-list.jpg`. |

The default tone (white on saffron, 2.91:1) still fails WCAG 1.4.3 for every other consumer of the component. axe finds 0 violations on `/website` after the change. Picture: `samavesh-band-before-after.jpg`.
