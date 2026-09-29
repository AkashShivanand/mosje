# One content source for the three website designs (MANDATORY)

**Standing instruction, 28 Sep 2026.** The public website is served in three
designs — New (`app/website/`), Classic (`app/website-classic/`) and DBIM
(`app/website-dbim/`), switched by the demo rail (`lib/website-design/`). They may
differ in layout. **They may not differ in content.**

## The rule

1. **A section that appears in more than one design reads its content from ONE
   place** — `apps/hub/src/lib/website-shared/`. Banner images, About Us text,
   Ministers, headline figures, and every section added to this list later.
   A design's component owns markup and styling only.
2. **That content is the live website's** — `https://dosje.gov.in/` — unless an
   explicit instruction says otherwise. Record the date the live page was read
   (`HOME_CONTENT_AS_ON`) and, for assets, that the file matches the live one.
3. **An explicit departure is written beside the design's own code**, with who
   asked and when. Today: the DBIM About Us tiles (Our Team · Our Organisation ·
   Our Performance — the DBIM review team, 25 Sep 2026).
4. **The first home-page slide in every design is the CCPS banner** (DBIM 3.0
   §7.4.1 i; the Department's instruction, 28 Sep 2026) — live from the feed where
   configured, otherwise its local copy, `CCPS_SNAPSHOT`. `getHomeBanners()` is the
   one call every design makes, so they cannot disagree about what leads.
5. **Never copy content into a design to "sync" it.** A copy is how the DBIM home
   page came to show six banners and an About Us paragraph the live site does not
   carry. If a design needs a shape the shared record lacks (a second crop, a
   shorter label), add a field to the shared record — do not fork the record.
   Images are content too: a design does not swap in a better-looking photograph
   of the same person; if the live one is too small, ask the Department for a
   larger original.

## What is shared today

| Content | Shared record | New | Classic | DBIM |
|---|---|---|---|---|
| Home banners (CCPS first) | `home.ts` `CCPS_SNAPSHOT`, `HOME_BANNERS`; `home-banners.ts` `getHomeBanners()` | ✅ | ✅ | ✅ |
| About Us — text, Ministers, figures, links | `home.ts` `ABOUT_US` | ✅ | ✅ | ✅ (no figures strip in this layout) |
| Minister photographs (and DBIM's Ministry › Our Team chart) | `home.ts` `ABOUT_US.ministers[]` — the live photographs at the DBIM handoff file's resolution (instruction, 28 Sep 2026) | ✅ | ✅ | ✅ |
| PM quote — quotation, citation, photograph | `home.ts` `PM_QUOTE` (source: PIB; the live site carries no PM quote) | ✅ | layout-options page only | ✅ |
| Offerings — scheme groups, vacancies, tenders | `offerings.ts` (a dated snapshot: the live lists are hand-picked, not register rows) | ✅ | ✅ | ✅ Key Offerings, five a tab (DBIM 3.0 §A.4.1 vi) |
| Recent Documents | `documents.ts` (a dated snapshot of the live selection) | ✅ | ✅ | ✅ |
| Social Media — heading, accounts, handles, links | `social.ts` (live's three; YouTube as DBIM's fourth) | ✅ | ✅ | ✅ four platforms (DBIM Toolkit, "Citizen Engagement") |
| Partner logos — the carousel above the footer | `partners.ts` (live's 42, in live order; names ours, as live's alt text is empty) | ✅ | ✅ | ✅ |
| What's New | `whatsNew()` in `lib/website-next/whats-new.ts` — a feed, as live runs it | ✅ | ✅ | ✅ |
| Scheme Portals — which portals, their order, the portal each opens | `organisations.ts` `schemePortals()`, `SCHEME_PORTALS_SECTION`; registry `portalHref` | ✅ home section + masthead | — | ✅ **not on the home page** — Ministry › Our Scheme Portals (the Department's L2 addition, 28 Sep 2026) |
| Organisations — words, tab labels, order, the 18 bodies | `organisations.ts` + the registry `data/website/organisations.ts` | ✅ | ✅ | ✅ **not on the home page** — Ministry › Our Organisation (DBIM 3.0 §A.5.1.3) |

**The DBIM design follows the DBIM 3.0 manual for layout.** Where the manual places a
section differently — Our Organisations under Ministry rather than on the home page,
five entries a Key Offerings tab, at least four social platforms — the section moves or
grows; its content still comes from here.

**Nothing is invented to fill a layout.** Where the live section carries no posts, no
photographs or no figures, neither does a design — nine invented social posts, with
like counts, stood on the New and Classic home pages until 28 Sep 2026.

Every section the designs share now reads from here. A new shared section starts here.

## Checklist

- [ ] Content for a section in 2+ designs lives in `lib/website-shared/`
- [ ] It matches the live site, with the read date recorded
- [ ] Any departure names the instruction that allows it
- [ ] All three designs were screenshotted after the change
