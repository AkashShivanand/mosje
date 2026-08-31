# PM-AJAY content audit — 2026-08-31

Parity check of the PM-AJAY organisation section against its source page,
`https://www.dosje.gov.in/organisation/pradhan-mantri-anusuchit-jaati-abhyuday-yojnapm-ajay/`,
in the manner of the NCSK audit in `ncsk-content-audit/`.

Two things were wrong, and they were opposite kinds of wrong: a whole band of the
source page was missing, and eight pages nobody could reach were being built.

## 1. The "Reports PM-AGY" band was missing entirely — FIXED

The source page carries a band of ten report links in three groups. Our page had
no such band, our side-nav index had no such entry, and — unlike every other
omission on this page — **no comment anywhere recorded a decision to leave it
out**. The downloads that *are* deliberately linked-not-mirrored say so in place.
This one said nothing, which is what an oversight looks like.

| Group | Reports |
|---|---|
| Villages | Covered Villages · Covered Villages Mission Utkarsh · Covered Villages (40% SC Population) · All Villages Score · Villages between scores · Village At Glance · Phase one villages · Pilot phase villages |
| Adarsh Gram | Adarsh Gram Declaration Status |
| VDP | Selection Year Wise VDP |

All ten are now on the page, in the source's own groups and under the source's
own labels, as a `reports` block on the organisation detail.

**They are linked out, not mirrored.** Each is a live report generated on request
from a database this estate does not hold. Mirroring one would produce a snapshot
wearing a live report's clothes — the exact failure `live-data-fallback.md` exists
to prevent. This is the same call already recorded for the downloads, for a
stronger reason.

## 2. Eight pages were being built that nothing linked to — REMOVED

`organisation.json` held seventeen PM-AJAY entries for nine real pages. Seven were
duplicate slugs and one was a second empty page, all of them reachable, all of them
static-generated, and every one referenced by exactly one thing: its own definition.

| Removed (flat slug) | Kept, because it is the one that is linked |
|---|---|
| `about-us` (flat, thin copy) | the fuller `pmajy/about-us` — a strict superset, all 61 sentences present. *Since flattened back to `about-us`; see §5.* |
| `construction-repair-of-hostels` | `components/construction-repair-of-hostels` |
| `development-of-sc-dominated-villages-into-adarsh-gram` | `components/development-of-sc-dominated-villages-into-adarsh-gram` |
| `grants-in-aid-to-state-districts` | `components/grants-in-aid-to-state-districts` |
| `flow-chart` (duplicate) | `reports/flow-chart` — byte-identical. *Since flattened back to `flow-chart`; see §5.* |
| `illustrative-list-…` (duplicate) | `reports/illustrative-list-…` — identical text. *Since flattened back; see §5.* |
| `contact-us` | *nothing* — see below |
| `pmajy/contact-us` | *nothing* — see below |

**No content was lost.** Each removed entry was verified to be a subset of, or
identical to, the entry that survives it.

### The two contact pages were blank

Both held zero sections and rendered the placeholder "This page is being prepared" —
against the estate's rule that production pages carry real content and never an
empty state. Worse, **site search returned both of them** for the query "Contact
Us": two identical results, each leading to a page that says nothing.

They were deleted rather than filled. The source's `/contact-us/` page publishes
only the support email, the hours and the mobile number, and all three are already
in the Contact section of the PM-AJAY page itself.

## 3. Left alone, and why

`…/guidelines` stays. It is a real page on the source site (HTTP 200), so removing
it would be losing content rather than losing junk. Two things about it are worth a
human's attention, neither of which an agent should decide alone:

- **Its content belongs to another scheme.** The page lists the Model Guidelines on
  Beggars' / Shelter Homes and the SMILE Beggary Scheme operational guidelines.
  That is an error on the source site, faithfully cloned.
- **It is unreachable from the PM-AJAY index** — here *and* on the source, whose own
  PM-AJAY page does not link it either. Linking it into our nav would propagate the
  source's error; deleting it would drop a page the source publishes. It is left
  exactly as the source has it, and flagged here instead.

## Verified

- 8 removed slugs → 404; 7 kept pages → 200
- Site search for "Contact Us" no longer returns any PM-AJAY placeholder
- Reports band renders in three groups with all ten links, external icons and `rel="noreferrer"`
- Heading order H2 → H3; pill text 18.94:1 contrast; 36px targets
- `lint`, `lint:css`, `typecheck`, `check:website-links`, `check:search-index` all pass

## 4. Sidebar parity — checked entry by entry (second pass)

The source page carries its index as a 26-entry left menu held as JSON inside the
Elementor widget rather than as markup, which is why a plain link scrape missed
part of it the first time. Parsed in full and compared against ours:

| Live sidebar entry | Ours |
|---|---|
| **ABOUT US** (header) | ✔ |
| About the Scheme | ✔ `#about-the-scheme` |
| **OUR WORK & IMPACT** (header) | ✔ |
| Circulars & Notifications | ✔ `#circulars-notifications` |
| Resources | ✔ `#resources` |
| Reports PM-AJY | ✔ `#reports` — labelled "Reports (PM-AGY)", after the source's own body heading rather than its sidebar typo |
| **Downloads (PM-AJAY)** (header) | ✔ `#downloads-pm-ajay` |
| PACC Meeting List | ✔ **added this pass** |
| Utilization Certificate | ✔ |
| Notional Allocation | ✔ **added this pass** |
| Implementation Status | ✔ |
| Presentation about Scheme (PPT) | ✔ |
| Institute Registration Form | ✔ |
| **Downloads (pmagy)** (header) | ✔ `#downloads-pmagy` |
| Presentation CSMC Meeting 12 Feb 2020 | ✔ |
| Presentation | ✔ |
| Announcement in village (Hindi) | ✔ |
| PMAGY Work Flow | — deliberately absent: its link is empty upstream (a pop-up), so there is no destination to offer |
| Work Flow for Interim VDP | ✔ |
| Sample VDP | ✔ |
| District User Manual | ✔ |
| **CONNECT & ENGAGE** (header) | ✔ |
| Illustrative list of domain under GIA | ✔ |
| FlowCharts | ✔ — labelled "Flow Chart", as that page's own H1 has it |
| Find Courses | ✔ |
| Contact | ✔ `#contact` |

**Two entries were missing and are now present.** PACC Meeting List and Notional
Allocation are live report pages that the source files under its Downloads
(PM-AJAY) heading rather than with the reports. They are kept where the source
keeps them, and linked out for the reports' reason: both are generated on request
from a database this estate does not hold.

**Two of ours have no sidebar counterpart, deliberately.** `Components` and
`Gallery` point at sections the source page genuinely has; the source simply does
not index them. Indexing a section that exists improves the index — it does not
invent content.

## 5. Component pages moved to the source's own URLs

The three component pages were built under an invented `/components/` segment. The
source has no such segment, so they now answer at the source's own paths:

| Was | Now |
|---|---|
| `…/components/construction-repair-of-hostels` | `…/construction-repair-of-hostels` |
| `…/components/development-of-sc-dominated-villages-into-adarsh-gram` | `…/development-of-sc-dominated-villages-into-adarsh-gram` |
| `…/components/grants-in-aid-to-state-districts` | `…/grants-in-aid-to-state-districts` |

The **pages themselves are unchanged** — the newer editorial two-column design,
with its "At a glance" panel and live dashboard, is what now answers at those URLs.

Four things had to move together: the slugs in `organisation.json`, the component
cards' `slug` fields, the dashboard lookup in the organisation route, and
`lib/data-mode/routes.ts`. Miss that last one and the demo rail's data-mode switch
silently vanishes from the three pages that most need it.

### Every sub-page now sits at the source's own path

`pmajy/about-us`, `reports/flow-chart` and `reports/illustrative-list-…` carried the
same invented segment for the same reason, and were flattened in the same way. No
PM-AJAY URL in this estate now contains a segment the source does not publish.

## 6. Final accounting — every live sub-page, and what we do with it

Twenty pages live under the scheme on the source site. Each is accounted for:

| Treatment | Count | Pages |
|---|---|---|
| **Cloned as a page** | 7 | about-us · construction-repair-of-hostels · development-of-sc-dominated-villages-into-adarsh-gram · grants-in-aid-to-state-districts · flow-chart · illustrative-list-… · guidelines |
| **Linked out** (live reports) | 12 | the ten in the Reports band, plus pacc-meeting-list and notional-allocation-report under Downloads (PM-AJAY) |
| **Folded into the index** | 1 | contact-us — the source publishes only an email, hours and a mobile there, and all three are in this page's own Contact section |

Nothing is unaccounted for, and nothing is served that the source does not publish.

## 7. Sidebar regrouped, and the open questions it exposed

The index now carries **every page and every section**, grouped as NCSK's is —
what the scheme IS, what it DOES, what it PUBLISHES, and how to reach it:

| Group | Entries |
|---|---|
| ABOUT US | About the Scheme `#` · **About Us** (page) |
| OUR WORK & IMPACT | Components `#` · Circulars & Notifications `#` · Illustrative list of domain under GIA (page) · Flow Chart (page) |
| PUBLICATIONS & REPORTS | Resources `#` · Downloads (PM-AJAY) `#` · Downloads (pmagy) `#` · Reports (PM-AGY) `#` |
| CONNECT & ENGAGE | Find Courses (external) · Gallery `#` · Contact `#` |

**About Us was reachable from exactly one place** — the "Know more" button inside
the About band. A page reachable from one button is a page most readers never
find. It is now in the index where NCSK puts its equivalents.

**One deliberate deviation from the source's grouping.** The source files both
download lists under OUR WORK & IMPACT, leaving that group holding six entries
that mix the scheme's programme with its filing cabinet. Splitting the filing
cabinet into PUBLICATIONS & REPORTS is NCSK's distinction and reads better; it is
the only place this index departs from the source's own.

### Still open — three findings this pass surfaced but did not change

**a. `guidelines` is still the only page not in the index.** It cannot be added
until its content is settled: the page carries the SMILE Beggary Scheme's
guidelines, not PM-AJAY's. Linking it would put another scheme's rules under
PM-AJAY's index. Note that the real thing is already in our own ingest —
`documents.json` holds "Guidelines of Pradhan Mantri Abhudaya Yojana (PM AJAY)"
and "PM-AJAY Guidelines" — so the page could be pointed at those instead. That is
a content decision, not a wiring one.

**b. Two "At a glance" panels state feed figures as fixed prose.** GIA's "8,772
projects across five financial years" and Hostels' "2,30,977 places / 1,25,485 in
occupation" are the mirrored-snapshot values from `pmajay-stats.ts`, typed into
static JSX. The dashboard directly beneath renders the same figures *with* a
provenance chip and *responding* to the demo rail's data-mode switch — the panel
does neither. Flip the rail to live and the panel silently contradicts the
dashboard. This is what `live-data-fallback.md` and `prototype-data-modes.md`
exist to prevent.

Worse, the panels spend those four slots on numbers while omitting policy the
source states plainly and permanently:

- GIA: at least **15%** of funds released to States/UTs go to income-generating
  schemes for Scheduled Caste women, and at least **10%** to skill development.
- GIA: the source names **three** broad categories (Comprehensive Livelihood,
  Infrastructure Development, Special Tutoring). Our panel says "four
  interventions", which contradicts the page it summarises.
- Hostels: institutions must reserve **70%** of seats for Scheduled Caste
  students; girls' hostels must have lady wardens and guards at all times.

Adarsh Gram's panel is sound — all four of its facts are on the source page
verbatim.

**c. Documents do not use the estate's sample-document convention.** All 21
sample-PDF references in `organisation-details.ts` belong to NCSK; PM-AJAY has
none. Its ten downloads point at cloudfront and dosje.gov.in, and its circulars
and resources resolve to `sourceUrl` because `documents.json` carries no
`fileUrl` field at all. The "View all" cross-links to the global pages are
correct and in place — but the global pages link outward too, so this is an
estate-wide gap that PM-AJAY simply shares.

**The gallery cross-link is broken in a smaller, fixable way.** "View all photos"
goes to `/website/gallery`, which holds ten images, none of them PM-AJAY's three.
The three photographs are mirrored locally and captioned; they are just not
registered on the global page.

## 8. Correction — About Us should never have gone in the index

§7 added the `/about-us` sub-page to the ABOUT US group and justified it as
following NCSK. **It does the opposite.** NCSK reaches its own about-us page from
the About band's "Know More →" and deliberately keeps it out of the sidebar; its
ABOUT US group lists only *other* pages (Previous Commissions, Secretariat, State
Allocation, Citizen Charter, RTI). Adding ours put "About the Scheme" and "About
Us" adjacent in one group — two labels a reader cannot tell apart, pointing at the
same subject. Reverted.

The rest of §7's regrouping stands. A sweep for the same fault found no other
destination reachable twice from anything this audit added.

Two duplicate destinations do remain, both pre-existing:

- The breadcrumb's **"Associated Organisations" points at `/website`** — the site
  home, the same place its own "Home" crumb goes. A crumb that lies about where it
  leads is worse than no crumb.
- **Both Downloads bands' "View all" go to `/website/publications`.** Neither
  group sets `viewAllHref`, so both fall through to the same default — and
  "publications" is not where scheme formats and presentations live anyway.

## 9. Brutal IA audit

### What is wrong

**Five consecutive list bands.** Between Components and Gallery the page is
Downloads (PM-AJAY), Downloads (PMAGY), Circulars & Notifications, Resources,
Reports — 29 items, four of them rendering the identical file card. A reader
scrolling past sees one undifferentiated wall. The distinctions between
"Downloads", "Resources" and "Circulars" are the department's filing categories,
not answers to anything a citizen came to ask.

**The Downloads split is by scheme era, not by need.** PMAGY is the predecessor
programme folded into PM-AJAY's Adarsh Gram component. Nobody outside the
department knows that, and the page never says it — the two bands are simply
labelled "PM-AJAY" and "PMAGY" and left to be guessed at.

**The cards throw away their most valuable line.** Every download card's meta
reads "PDF" — directly above a button that reads "Download PDF". Six cards in the
PMAGY band, six identical metas, six identical buttons. The slot that could carry
a date or an audience carries a restatement of the button.

**Several titles are filenames, not titles.** "Presentation". "Sample VDP".
"District User Manual". "Work Flow for Interim VDP". A citizen cannot tell what
any of these is about, who it is for, or whether it is current. "Presentation" is
the worst: it is a card whose entire content is the word *presentation*.

**The circulars have the opposite failure.** Their titles are the full
bureaucratic file names — one runs to forty words and ends "-reg" — so that card
grows to three times its neighbours' height and tears a hole in the grid.

**Two live reports are filed as downloads.** PACC Meeting List and Notional
Allocation are the same kind of object as the ten in the Reports band. They sit in
Downloads only because the source's sidebar filed them there. We inherited an
upstream filing mistake and made it structural.

**The substance is one card deep.** The three component pages hold what a citizen
actually needs — the 70% hostel seat reservation, the 15%/10% GIA floors, who
qualifies as an Adarsh Gram. On the index each gets a two-line blurb, while
nineteen file cards get four full bands.

### What would make it better

1. **Collapse four file bands into one "Documents & downloads" band with tabs or
   filter chips** (Circulars · Formats · Presentations · Manuals). Same items, one
   band, one mental model — and the era split disappears into a filter rather than
   a heading nobody can parse.
2. **Give the download cards a real meta line:** publication date where the ingest
   has one, else the audience ("For State/UT officials"). Move the file type onto
   the button, where it already is.
3. **Title the files like titles.** "Presentation" → "PMAGY scheme overview
   (2019)". Keep the official name as the card's secondary line so nothing is lost.
4. **Truncate circular titles to two lines with the full name on hover/expand**, so
   one forty-word file name stops dictating the height of a four-card row.
5. **Move PACC Meeting List and Notional Allocation into the Reports band**, where
   the other ten live reports are, and note the departure from the source.
6. **Promote the component substance.** Put the 70%, the 15%/10% and the Adarsh
   Gram threshold on the component cards themselves — they are stable, stated
   policy and they are what the page is actually about.
7. **Fix the two dead cross-links** — the breadcrumb crumb and the shared
   "View all" — and register the three gallery photographs on `/website/gallery`.

## 10. Everything in §9 implemented

| § | Fix | Done |
|---|---|---|
| 9.1 | Four file bands → one "Documents & downloads" with filter chips | 17 documents, chips All / Circulars / Formats / Presentations / Manuals & guides / Reports |
| 9.2 | Real meta line on every card | Date where the ingest has one, else audience ("For Gram Panchayats · read aloud at village level"). File type moved to the button, where it already was |
| 9.3 | Titles that are titles | "Presentation" → "PMAGY scheme overview"; the department's own name kept beneath as *Published as "…"* |
| 9.4 | Circular titles clamped | Two lines then ellipsis. The forty-word one no longer sets the height of its row; the full string is still the element's text, so screen readers and in-page search still get all of it |
| 9.5 | PACC Meeting List + Notional Allocation moved into Reports | New "Allocation & approvals" group, beside Villages / Adarsh Gram / VDP |
| 9.6 | Component substance promoted | Each card now carries its own stated rule — the 40%/500 threshold, the 15%/10% floors, the 70% seat reservation |
| 9.7 | Dead cross-links + gallery | Breadcrumb crumb no longer links; "View all" points at Forms & Templates; the three photographs are registered on `/website/gallery` |

And the three open decisions from §7, all taken:

- **`guidelines` now carries PM-AJAY's own guidelines** and is in the index under
  PUBLICATIONS & REPORTS. It held the SMILE Beggary Scheme's, cloned from the
  source's own filing error.
- **Both "At a glance" panels carry stated policy, never a feed figure.** The rule
  is written into the file that holds them, with the evidence: Hostels had claimed
  "2,30,977 places / 1,25,485 in occupation" directly above a dashboard reading
  **1,57,708** and **89,776**. They were contradicting each other on one screen —
  not drifting toward it. GIA had claimed "four interventions" three inches from
  prose reading "three broad categories".
- **Every PM-AJAY document resolves inside this estate**, to the sample store NCSK
  already used. The one entry that is genuinely a live page — Implementation
  Status — keeps its real destination, because a "View page" card handing over a
  PDF would be its own small lie.

### A gate, because nothing caught the near-miss

Collapsing four bands into one silently orphaned an index entry — `#circulars-notifications`
pointed at a band that no longer existed — and every check stayed green.
`check:website-links` walks page links and ingested anchors; it never compares an
index entry's `#id` against the ids the template emits.

`tools/org-anchors/check.mjs` now does, and runs in `npm run check`. It found six
entries **already** broken before this work — NCSK's Annual Reports, SOP and
Advisory, Acts and Rules, Circulars, Rules of Procedure, and NCSC's Annual
Reports. Those are other organisations' content and are recorded as a baseline
rather than guessed at; the gate fails on anything new, and on any baseline entry
that starts resolving. **The list only ever shrinks.**

## 11. Guidelines on the shelf · the drift's real cause · the library in the DS

### The guidelines document, placed

Two guidelines files now lead the library under their own chip, first in the
order: they are the document every other file on that shelf assumes you have
read. The sub-page keeps its table; the shelf is where a reader looking for "the
rules" actually arrives.

### The drift had a cause, and it was not the panel

The panel was the *symptom*. The cause is that **`PMAJAY_AS_ON` is a hand-typed
date that nothing verifies.** It can be bumped while the figures beneath it are
not re-captured, and the file then asserts a freshness it does not have. That is
how the hostel snapshot came to hold 2,30,977 / 1,25,485 under a date of
28 August 2026 while the feed answered 1,57,708 / 89,776.

The snapshot is refreshed to what the feed says today, and the illustrative
`completed_hostels` re-derived from it (1,57,708 ÷ 100 ≈ **1,577**, was 2,310).

**Two other snapshots were deliberately left alone**, and that is the important
part. `GIA_ALL_PHYSICAL_FALLBACK` and the gender feed answer **0 for every field
of every year** — a degraded endpoint, not a department that approved nothing.
Copying those zeros over a good snapshot would have destroyed real data in the
name of being "in sync". Adarsh Gram differs on nine fields, three of them zeros
of the same kind.

So: **snapshot and feed are not supposed to be equal.** A fallback that tracks
live is not a fallback. What they must be is *honest* — the numbers the feed gave
on the date the file claims — and no figure from either may appear as plain prose
with no provenance and no response to the data-mode switch.

`tools/feed-drift/check.mjs` (`npm run check:feed-drift`) reports the comparison
field by field and names the all-zero feeds as degraded. It is a **report, not a
gate**, and deliberately outside `npm run check`: a ministry API being slow is not
a reason to fail a build, and drift is a judgement a human makes.

### The library is now a design-system component

`DocumentLibrary` lives in `packages/design-system/components/data-display/`,
exports from the barrel, and has a Storybook entry covering the long-title clamp,
the single-group case, the empty state and a renamed noun. The hub keeps only the
mapping from its own content shapes into `DocumentLibraryItem[]`.

**One design decision the move forced.** The first cut took `linkAs` — pass
`next/link` — copying `SiteFooter`. That crashed every organisation route:
*"Functions cannot be passed directly to Client Components"*. A server page
cannot hand a component function across the RSC boundary, and this component is
`"use client"` because filtering is its whole purpose. So the footer control is a
**slot** (`viewAllSlot`), which is an element and crosses fine, and the cards are
plain `<a>` — correct anyway, since every one resolves to a file or another site
and client-side routing buys a PDF download nothing.

## 12. Syncing, read through the three modes

`prototype-data-modes.md` settles what "in sync" can even mean here, and the
answer is that **the snapshot must never equal the feed by policy** — it is what
Illustrative mode shows, and a fallback that tracks live is not a fallback. Each
mode asks a different question of the two sources:

| Mode | Source | What drift means |
|---|---|---|
| **Live** | feed only | Irrelevant — the snapshot is not on screen. An unpopulated group shows a real empty state |
| **Illustrative** | snapshot only, under its own `*_AS_ON` | The whole point: this is the number the banner dates, so it must be what was published that day |
| **Live + illustrative** | live where answered, snapshot for gaps | Decides which figure a reader sees; a stale snapshot is a stale card wearing a "Part illustrative" chip |

### The root cause was one date over two captures

`PMAJAY_AS_ON` covered GIA *and* Hostels — two endpoints captured on different
days — and it is **shown to the reader**: the Illustrative banner reads "as on
{date}". Refreshing hostels and bumping the shared date would have claimed a
freshness GIA never had; leaving it claimed staleness hostels no longer had.
Either way the page states something untrue, and nothing compared figures to feed.

Split into `GIA_AS_ON` (28 August) and `HOSTEL_AS_ON` (31 August), each dashboard
citing its own. `PMAJAY_AS_ON` remains as a deprecated alias. Verified in the
browser: the hostel Illustrative banner now reads "mirrored on 31 Aug".

### A card was calling itself Illustrative while showing nothing

Live mode on the GIA page put an **Illustrative** chip on three breakdown cards,
whose tooltip told the reader "what is shown is illustrative" over cards where
nothing was shown at all. `mergeData` was innocent — it never invents in Live
mode. `breakdownFor` computed provenance as `liveYears > 0 ? "live" : "mock"`, so
a card that drew no rows of either kind fell through to `"mock"`.

Provenance now describes what is on screen: illustrative only when an
illustrative row was actually drawn. Verified across all three modes on the GIA
page — **Live 8/8 Live chips (was 5 Live + 3 Illustrative), Illustrative 8/8,
Live + illustrative a genuine mix.**

Neither GIA snapshot was refreshed, deliberately: its feeds answer 0 for every
field of every year, which is a degraded endpoint, not a reading.

## 13. SMILE's guidelines, the breadcrumb, and the L1/L2 header

### The SMILE guidelines were removed and never rehomed

§11 replaced the PM-AJAY guidelines page — it carried the SMILE Beggary Scheme's
guidelines, the source site's own filing error — with PM-AJAY's own. What it did
not do was put the SMILE documents anywhere. They existed nowhere in the estate
afterwards, which is content lost rather than content moved.

They are now on SMILE's page, in a Documents & downloads shelf under a Guidelines
chip, with a PUBLICATIONS & REPORTS group in its index pointing at it. The
official names are kept verbatim.

### The breadcrumb: 64 pages claimed two current pages

**Is a non-linked middle crumb good practice?** It is defensible, and it is this
estate's convention: the trail describes where a page sits, and a section is a
real level of that hierarchy even when it has no page. "Department", "Documents",
"Connect" and "Associated Organisations" are mega-menu categories with no route,
and 64 pages pass one as a middle crumb. What is not defensible is offering it as
a link to somewhere it does not go — which is what "Associated Organisations"
did, pointing at `/website`, exactly where the Home crumb beside it went.

**The real defect was in the component.** It rendered every non-linked crumb as
`<span aria-current="page">`, so on all 64 of those pages a screen-reader user was
told twice they were on the current page, once about a section they were not on.
`aria-current` marks exactly one thing; two is worse than none, because the wrong
one comes first. `aria-current` is now on the last crumb only, and a section crumb
renders as plain text. One component fix, 64 pages corrected.

### SitePageHeader — the L1 and L2 bands

`packages/design-system/components/layout/site-page-header.tsx`, exported, with
five stories. `variant="landing"` is Figma L1 (logo, title, italic standfirst
against a left rule, action, portrait, overlapping fact card);
`variant="inner"` is L2 (back link, title, nothing else).

**It is not `PageHeader`, and both earn their place.** `PageHeader` is the portal
title row — heading, meta line, actions, on the page's own background — and **80
files render it**. This is a full-bleed banner with a brand gradient and an
overlapping card, for the 8 website hero surfaces. They share a word in English
and nothing else.

**One thing the Figma file needs from its owner.** The band is painted
`#0373df → #3f83c6`. The first is the `Primary/Source` variable; the second is a
RAW HEX with no variable behind it — confirmed by reading the node's variable
definitions, which list `Primary/Source` and no second colour. Reproducing that
hex would freeze the band to the blue brand, and this estate is white-label:
`data-brand="navy"` and DBIM must retheme it. The second stop is therefore the
brand ramp's own next shade. **The unbound fill should be bound to a variable in
the library**, and until it is, this component deliberately does not match that
one hex.

**Not yet adopted.** The website's 8 pages still render the hub's own `PageHero`.
Switching them over is a separate change, and one worth doing: `PageHero` picks
its banner image with hardcoded string matching (`logoSrc.includes("NCSC-2")`),
which is exactly the kind of thing a design-system component exists to end.

## 14. Adoption, a duplicate page, and a regression this audit caused

### The sibling-components card had silently disappeared

The three component pages each carry an "Other PM-AJAY components" card linking
the other two. It selected them with `slug.includes("/components/")` — true only
while those pages lived under the invented `/components/` segment. §5 moved them
onto the source's flat paths and **emptied that list on all three pages**. No
error, no failing gate, just a missing card, and it went unnoticed for four
commits.

It matches on the three declared slugs now — the same constants the dashboards
key off — so it cannot rot the next time a URL changes. Verified: each page again
links the other two.

**The lesson is the gate that does not exist.** A URL change broke a filter
written against URL shape, and nothing caught it, exactly as the same change
orphaned `#circulars-notifications` until `check:org-anchors` was written. Path
substrings are not a way to identify a page.

### The guidelines sub-page was a second copy

`…/guidelines` held a bare table of the same two documents already on the shelf,
pointing at the same two files. It is removed: the Guidelines chip in Documents &
downloads is the single home, the same call as `contact-us`. Note that its
content was ours, not the source's — the source's version carried SMILE's
guidelines, now rehomed to SMILE.

Accounting updated: **6 pages cloned, 12 linked out, 2 folded into the index.**

### SitePageHeader is adopted

`PageHero` now renders it, so every website page picks it up through
`PageLayout` — no page-level churn. The route that knows says which level it is:
the organisation route passes `level` and, for a sub-page, `backHref`.

**Most pages lost a decorative plaque, and should have.** `PageHero` drew the L1
layout everywhere, and where a page had no image it filled the 340px circle with
the National Emblem and the ministry's name. That is a fallback deciding a
layout: no page asked for a portrait, so every page got one. Pages with a real
photograph keep L1; the rest take L2 and give the fold back to their content.

Verified: NCSK L1 with its portrait, PM-AJAY L1 without, sub-pages and content
pages L2 with the back link. The emblem plaque appears on none of them.

## 15. Visual audit against the handoff — five defects

A read of the rendered bands beside the Figma frames, after adoption.

| Defect | Cause | Fix |
|---|---|---|
| The halo portrait was missing from L1's trailing edge | The portrait rendered only where a `featuredImage` existed. PM-AJAY has none, so two thirds of its band was empty blue | A landing page always gets one, falling back logo → emblem. An inner page never does |
| The quote rule before the standfirst did not draw | `--sa-border-neutral-inverse` is named in the token source but **is not emitted into the running cascade** — it resolves to nothing, which makes the whole `border` declaration invalid and drops it to `none` | Uses the inverse token that does resolve. **Flagged for the token owner** |
| "Associated Organisation" sat above the L1 title | The eyebrow rendered on both levels | Eyebrow is `inner`-only. It said what the breadcrumb above already said, smaller |
| The back link underlined its arrow glyph | `hover:underline` on the anchor underlines every child, glyph included | The underline is on the text span alone |
| L2's band was a hero-height slab of empty blue | Both levels took the same 64pt block padding, for two short lines | `inner` takes the 32pt step, and its eyebrow-to-title gap is the handoff's 8, not 20. **281px → 145px** |

### Is a link right for "back"?

Yes, and it stays one. It goes to a **known URL** — the parent organisation — not
backwards through history. A button would strip it of middle-click, of
open-in-new-tab, and of the destination a screen reader announces. Figma draws it
as a `<button>`, which is a Figma artifact rather than a specification: the frame
has nowhere to navigate to.

What was wrong was the *styling*, not the element. It now rests without an
underline and underlines its text on hover, which reads as a link without
decorating the glyph.

### Two things the Figma library needs

1. `#3f83c6`, the band's trailing gradient stop, is an unbound raw fill (§13).
2. There is no emitted **inverse border** token, so a white rule on a brand band
   has nothing correct to bind to. This component uses the inverse *text* token
   for a *border*, which is the right colour bound to the wrong role.

## 16. The hero photograph, and an animated halo

### The picture was ours to take and we had not taken it

§15 gave every landing page a portrait but PM-AJAY still had no photograph, so it
fell back to its own logo — a small mark stretched into a 300px circle. The source
site publishes a real hero, `Banner.png`: a composite of the three components — a
hostel block, Adarsh Gram village works, and skilling. It is mirrored to
`public/website/images/organisations/banner-pm-ajay.png`, beside the NCSK banner,
and set as PM-AJAY's `featuredImage`.

### Why the halo animates when almost nothing else on this band should

A header band is seen **once per page**, not a hundred times a day, and the halo
is the one element on it carrying no information — the portrait is `aria-hidden`
and the copy says everything the picture does. Rarely-seen decoration is exactly
where motion is affordable; a keyboard-triggered menu is exactly where it is not.

**It breathes rather than pulses.** A ring that expands and fades to nothing on a
loop is the visual language of a spinner or a recording dot, and a reader waits
for those to finish. Two rings easing between `scale(1)` and `scale(1.035)` —
never disappearing, and offset by 2.4s so they are never in step — read as depth
instead of as progress.

**Seven seconds, deliberately.** UI motion belongs under 300ms because the user is
waiting on it. Nobody waits on this, and at UI speed an ambient loop becomes a
twitch at the edge of vision that pulls attention off the title.

**Everything is a token.** Easing and the entrance duration come from
`--sa-motion-*`; the ring colour is `color-mix` over `--sa-color-primaryScale-800`
rather than Figma's raw `#003366`, so the halo rethemes with `data-brand` like the
gradient behind it.

**And it obeys the rules that matter:** transform and opacity only, so it runs on
the GPU; CSS rather than JS, so it stays smooth while the page hydrates; the
entrance starts at `scale(0.96)`, never `scale(0)`; and
`prefers-reduced-motion: reduce` stops the loop while keeping the rings at their
resting size — gentler, not absent, because removing them would change the layout
for the people who asked for less movement.

## 17. Five corrections against the L1 frame

| # | Was | Now | Why it was wrong |
|---|---|---|---|
| 1 | Logo at **72px** | **100px**, explicit `width`/`height` instead of `fill` | The handoff sets 100. Worse, `fill` without `sizes` made Next pick a **36px** candidate off the srcset and upscale it into the circle — the mark arrived so soft it read as an empty white disc |
| 2 | Halo **breathed** | Halo **pulses outward** — rings grow from just outside the portrait and dissipate | Asked for. Three things keep it from reading as a spinner: 4.5s (a spinner is under 1s), it starts at 45% opacity and never reaches full, and the two rings sit half a cycle apart so one is always arriving as the other leaves |
| 3 | Hero photograph | **Already the live site's** `Banner.png` — confirmed by extracting the images in the live hero region, which contains exactly two: the logo and this | Verified rather than assumed |
| 4 | **24px** between standfirst and fact card | **64px**, matching the frame | The template pulls its fact card up 40px over the band (`FactStrip --overlap`) and the band knew nothing about it, so the card ate 40 of the 64 points of air beneath the content. On a page with no CTA button the standfirst ended almost against the card |
| 5 | "Implementing ministry — Social Justice & Empowerment" | "**2021–22 · Scheme launched**" | Every organisation on the estate answers that identically, and the masthead above already says it. A fact constant across the estate is not a fact about the thing being described |

**The same constant was removed from SMILE**, which also carried it, and replaced
with the two sub-schemes its own About prose names. No organisation now spends a
fact slot on the ministry.

### The band now knows about a card it does not draw

`reservesOverlap` is a deliberately narrow prop: *a sibling overlaps my lower
edge, reserve room for it.* `overlay` remains the right slot for anything new —
this exists because the organisation template already drew its own card and pulls
it up itself, and the honest fix was to tell the band rather than to move the
card.

## 18. The halo, rebuilt

The first cut had **no static rings at all** — only one faint pulsing pair, too
quiet to read as motion, over a portrait 45 points smaller than the frame's.

| | Was | Now |
|---|---|---|
| Portrait | 300px | **340px** (frame: 385 in a 489 plaque; at the estate's 1320 cap the trailing column is ~416, so the picture takes 340 and its rings bleed past it) |
| Static rings | **none** | **Three**, one `box-shadow` with three spreads: 10px at 88%, 40px at 46%, 72px at 24% |
| Outline | a 4px white border | The **darkest thing on the band** — `primaryScale-900` at 88% |
| Ripple | 2 layers, 1 ring each | **4 layers**, 2 rings each on two pseudo-elements, half a cycle apart |

**Three spreads on one shadow, not three elements.** They can never drift out of
register, cost no extra DOM, and stay out of the accessibility tree. Each step is
lighter and more transparent than the one inside it, so the plaque reads as depth
receding into the band rather than as three drawn outlines.

**The dark inner ring is load-bearing, not decoration.** It is what separates a
photograph from a blue gradient; without it the picture bleeds into the
background at its lower edge, where the band is darkest. The white border it
replaces was doing that job badly.

**The rings bleed past their column deliberately.** The frame lets the outermost
ring run off the right edge, so `.sa-siteheader__media` is `overflow: visible`
and the band's own `overflow: clip` stops it escaping the page.

**Still under the same motion rules:** transform and opacity only; CSS not JS;
`scale(0.94)` not `scale(0)`; ease-out because the rings are leaving; 5s so it
cannot be mistaken for a spinner; and `prefers-reduced-motion` stops the ripple
while leaving all three static rings exactly where they are.

Every colour is `color-mix` over `--sa-color-primaryScale-800/900`, so the whole
plaque rethemes with `data-brand`. Verified on PM-AJAY, NCSK and SMILE — one
component, same halo, and no organisation now spends a fact slot on the ministry.

## 19. The fact card — styled to the frame, and one invented fact removed

### A fact I made up

§17 replaced the constant "Implementing ministry" with "**2021–22 · Scheme
launched**". That was **not sourced**. The About page says the three precursor
schemes *merged into* PM-AJAY from 2021–22, which is not the same claim as a
launch date — turning one into the other invents a fact and dresses it as
departmental. Removed.

PM-AJAY now carries **three** facts, which is what the source actually states:
Headquarters, Scheme components, Who it serves. The strip stretches to whatever
it is given and does not need filling. SMILE is three now too, for the same
reason — its fourth was a "2 sub-schemes" tile whose label ran to six words.

### Styled to node 3751:10140

| | Was | Frame |
|---|---|---|
| Dividers between cells | a hairline on each | **none** |
| Card radius / padding | 12px, per-cell 24/20 | **20px**, card 24/16 |
| Icon container | 48×48, radius 12, 24px glyph | **56×56** (12 of padding round a **32** glyph), radius 8 |
| Value | title-1, weight **700** | **headline-5** — 20/24, weight **600** |
| Label | body-3, **12px** | **body-1** — 16/24, 0.5 tracking |

**The dividers went because the frame draws none, and the frame is right.** The
icons already give each fact a strong left-to-right rhythm; four vertical rules
under a hero add furniture to the one band that should be the calmest thing on
the page. The value dropping from 700 to 600 matters for the same reason — at
700 it competed with the H1 directly above it.

### The white patch

The card floated on white, met a white band below it, and the surface the frame
draws — a light grey the white card lifts off — never existed. The page wrapper
is white, and both the facts band and the content zone were transparent over it.

Both now take `--sa-bg-neutral-subtler`, so they are one field with the card
lifted over it. The card's own −40 pull happens inside that box, so its top still
escapes upward over the banner without dragging the background with it.

## 20. The pulse was two systems fighting

**Seven ring edges were on screen at once.** Three static — spreads 10, 40, 72 —
and four more on two pseudo-elements, sweeping `scale(0.94) → 1.34` **straight
through** them. A reader saw circles that stood still and circles that did not,
in the same 484px, and could not tell which was the object. That is motion added
on top of a form rather than belonging to it, and it is why it read as broken
rather than as subtle.

| Before | After | Why |
| --- | --- | --- |
| 3 static rings + 4 moving rings, overlapping | 3 static + **1** moving, never overlapping | Two ring systems in one space have no visual hierarchy; the eye cannot tell the object from the effect |
| Ripple swept `scale(0.94) → 1.34` **through** the plaque | Starts at `scale(1)` — coincident with the outermost static ring — and only travels outward | A ripple that crosses the thing it came from doubles every edge it passes |
| Ripple began at `opacity: 0.55`, fully visible | Begins at **0**, peaks at **0.4** at 18%, dissolves | It now appears to detach from the outer ring rather than spring out of the photograph |
| Two pseudo-elements, offset −2.5s | One. `::before` deleted | The second existed to fill a gap the first left; with the plaque static there is no gap to fill |
| 5s loop | **4s** | A loop near 0.2 Hz reads as a pulse to watch rather than as ambience — Apple's motion guidance flags that band specifically |
| Peak opacity 0.55 | **0.4** | A large object should stay semi-transparent while it travels |

**What it is now:** the plaque is the design and holds still; one ring is born on
its outer edge at zero opacity, brightens as it leaves, and dissolves into the
band. One idea instead of two.

`prefers-reduced-motion` still stops the ripple and leaves all three static rings
exactly where they are.

## 21. The halo, again — the outer rings move and the inner one does not

§20 left the plaque static with one ring leaving it. The brief now is that
**everything except the innermost dark circle should animate**, and the
interesting part is that the obvious implementation rebuilds §20's defect.

Rings 2 and 3 sit at radii 40 and 72. Expand each **on its own radius** and ring
2 arrives, at roughly a third of its travel, exactly where ring 3 sits at rest.
Two edges cross and beat against each other in the same 484px — which is the
seven-edge collision §20 exists to record.

So they share **one track**. Each is born flush against the static ring's outer
edge, brightens as it detaches, and dissolves into the band; the second is offset
by **half the period**, so one is always leaving while the other is halfway out.
Nothing ever coincides.

| Before (§20) | After | Why |
| --- | --- | --- |
| 3 static rings + 1 ripple | **1** static ring + **2** travelling rings | The brief: only the picture's own outline holds still |
| Ripple born at radius 72 (the outer static ring) | Both born at radius 10 — the dark ring's outer edge | With rings 2 and 3 gone, the plaque's edge IS the dark ring |
| One pseudo-element | Two, same keyframes, `animation-delay: -2.5s` on the second | A negative delay starts it already half-travelled, so the first frame is never a bare disc |
| 4s loop, peak opacity 0.40 | **5s**, peak **0.85** against a 52% ring | 5s means a ring leaves every 2.5s rather than every 2s; 0.85 × 52% ≈ 44% alpha at the edge, which is the weight the old static mid ring carried |
| Travel to `scale(1.26)` | `scale(1.4)` from a smaller start radius | Same outer extent on screen |
| Reduced motion: ripple stops, 3 static rings remain | Reduced motion: **both rings freeze at the mid and outer radii** | It restores the drawing the handoff published, rather than leaving a bare disc where the animation was |

**The innermost ring stays static for a structural reason, not an aesthetic one.**
It is what separates a photograph from a blue gradient at the picture's lower
edge, where the band is darkest. A portrait whose own boundary breathes reads as
a rendering fault rather than as motion.

## 22. The fact card never overlapped the banner

The card is supposed to straddle the band's lower edge. It did not, and the
stylesheet asserted that it did:

> "The card's own −40 pull happens inside this box, so its top escapes upward
> over the banner without dragging this background with it."

Measured, the opposite. `.orgd__facts` has no padding and no border, so the
card's negative top margin **collapses through it** and moves the wrapper's own
top edge up by 40 — taking the grey surface with it. The band's last 40 points
were painted over in grey, the banner simply looked 40 shorter, and the card sat
flush on a surface instead of straddling anything.

```
before   band ──────────────┐              after   band ──────────────┐
                grey ═══════╪══ (over the blue)              blue ════╪══ (visible)
                ┌───────────┴──┐                            ┌─────────┴────┐
                │  fact card   │                            │  fact card   │
```

The surface moved to a pseudo-element inset by the same 40 the card pulls up, so
the wrapper's top 40 is transparent and the blue shows through it.

**Nothing detected this because nothing overlapped *wrongly*.** Every check was
green; the overlap merely never happened. The inset and `.ds-fact-strip--overlap`'s
pull are two halves of one measurement and a comment now says so — raise one
without the other and either the grey reappears over the band, or a strip of
banner appears under the card.

## 23. "Where PM-AJAY has reached" — the map band

A new band on the scheme's own page, immediately after the components cards,
fed by the department's `map-points` endpoint.

**Placement.** Directly under the components, because the reader has just been
told the scheme has three of them and "where has it actually landed" is the next
question they have. Further down — after the documents — the same map is a
curiosity rather than evidence for the cards above it. The index entry sits in
the same position, because an index whose order disagrees with the page teaches
the reader it cannot be trusted.

**A choropleth, not the points the feed publishes.** `map-points` carries a
coordinate for every one of 19,767 Adarsh Gram villages and 202 hostels — about
3.5 MB. Plotted raw that is a smear over the Gangetic plain: 19,767 dots at
national scale is ink, not information, and it is unreadable without a mouse.
Aggregated to states, it answers the question a reader of this page has. The
aggregation happens server-side, so the page ships about 2 KB instead.

**Two layers, and the third is deliberately absent.** Grants-in-Aid has no point
data in this feed. An empty third layer would state that GIA has reached nowhere
— false rather than merely absent — so the toggle offers two and the footnote
says why.

**Provenance.** Six scalars merge through `PMAJAY_REACH_DESCRIPTOR`, which
declares **no invariants** — and that is a finding rather than an omission.
Nothing here is a part of anything else: villages and hostels are different
components in different units, and a state count and a district count are two
grains of one set, not a subset relation. Declaring a sum between any pair would
be a rule the data does not obey, and the merge would then *derive* a figure from
it — worse than mocking one, because a derived figure is presented as
trustworthy. The per-state rows follow the provenance their own dataset's total
resolved to, so a live map can never sit under mirrored totals.

**The snapshot is generated, not typed.** `scripts/build-pmajay-map-snapshot.mjs`
mirrors the feed to `pmajay-map-snapshot.ts` with an `AS_ON` date, and is
deliberately not run by the build: a mirror that silently tracks the feed is a
second copy of the feed wearing a stale date. `--check` reports drift without
failing anything.

### Two layout defects found by measuring, not by looking

| Defect | Measured | Fix |
| --- | --- | --- |
| Ranking labels at **5.9px** | The band sits behind a 280px index rail, so at a 1280 viewport it is ~808px. Split 3:2, the chart got a 281px box for a 480-unit viewBox — a 0.58 scale on 10px labels. Half the estate's own 11px floor | Stack instead of two columns; the ranking gets the full width and its labels land at 12–17px. A 640-unit viewBox keeps them there at every width |
| The map collapsed to **351px** in a 790px card | `.pmr__map` was `display: flex` to centre the chart, and a flex item sizes to its content on the main axis | `margin-inline: auto` on a block child, capped at 620px — centred without taking its width away |

The bars are shaded from the **same sequential ramp as the map**, floored at
0.3: the categorical default gave ten instances of one thing ten different hues,
contradicting the choropleth above them, and the ramp's bottom rung is a
near-white that drew Maharashtra's 311 as an invisible sliver — under the 3:1
WCAG 2.2 §1.4.11 floor for a non-text graphic.

## 24. The halo, the overlap, and a regression the alternation hid

Three corrections, all measured against `MoSJE [Handoff]` node `3751:10124`
(`Ds5qx61QsI0ZkYSrLKxo0A`) rather than judged by eye.

### The overlap was 40. The handoff says 64.

| node | y | height |
| --- | --- | --- |
| `Header` (3751:10130) — the blue band | 0 | **572** |
| `Org at a Glance` (3751:10140) | **508** | 164 |

572 − 508 = **64**. Sixty-four of the card's 164 sits on the blue — a little
under two fifths of it. It was 40, which is the card's own top padding: it
looked deliberate but was never measured, and at that depth the card reads as
resting against the band rather than straddling it.

**Three rules carry that one number** and must move together, or the overlap
stops being a single measurement:

| rule | file | what it does |
| --- | --- | --- |
| `.ds-fact-strip--overlap` | `fact-strip.css` | pulls the card up |
| `.sa-siteheader__band--reserved` | `site-page-header.css` | reserves the same distance so the card overlaps into padding, not into the standfirst |
| `.orgd__facts::before` | `organisation-detail.css` | insets the grey surface by the same distance so the blue shows through |

### Three rings, not two

The handoff's halo component (`3751:10133`) is a photograph plus **three**
rings — one opaque `#036` hugging the image, then two at `rgba(0,51,102,0.48)`.
The brief is that all three outer rings pulse in a loop, so the implementation
went from two travelling rings to three, still on one shared track, now a
**third** of a period apart rather than a half.

**An element has only two pseudo-elements**, which is why `SitePageHeader` now
renders a `sa-siteheader__pulse` span: it carries the first ring on itself and
the other two on its own `::before` and `::after`.

The period moved 5s → **6s** so a ring still leaves every 2s rather than every
1.67s, and the peak opacity 0.85 → **0.7**, because three overlapping rings put
half again as much ink on the band as two.

The trap remains what it was in §21: animating the rings on their *own* radii
makes one arrive exactly where the next sits at rest, and the edges beat. One
track is what prevents that.

### The white/grey band pattern had been gone, silently

`.orgd` carried `background-color: var(--sa-bg-neutral-subtler)`, added so the
fact card had a surface to lift off. The side effect was total.

Bands alternate by tinting only the **even** ones; an untinted band is
transparent. With the wrapper grey, an untinted band showed grey — so every band
on every organisation page rendered `#eef0f3`, tinted and untinted measuring
identically. The alternation the template computes so carefully was still being
computed and had nothing left to express.

```
                       tinted band   untinted band
before   .orgd grey      #eef0f3        #eef0f3     ← no pattern
after    .orgd white     #eef0f3        #ffffff
```

The card's surface never needed it: `.orgd__facts::before` paints its own grey,
and the first band is always the tinted one, so the grey runs unbroken from
under the card into the section below.

**`transparent` is not the fix — `body` is itself `#eef0f3` across this site**,
so a transparent wrapper still showed grey and the repair looked like no repair
at all. The alternation needs a white the page owns.

## 25. "Where PM-AJAY works" — rebuilt to the standalone mockup

The section §23 introduced was built from first principles. A standalone design
for it already existed — `MapA.dc.html`, from the *भारत मैप इंटीग्रेशन* session —
and this rebuilds against it. The mockup is a **design reference**, not code:
its own README says so, and the values live in its inline styles.

| | §23 build | Mockup | Now |
| --- | --- | --- | --- |
| heading | "Where PM-AJAY has reached" | **"Where PM-AJAY works"** | matches |
| map | state **choropleth** | **proportional circles** | matches |
| companion | horizontal `BarChart` **below** | ranked rail **beside** | matches |
| layers | 2 (villages, hostels) | 3, counts in the tab | 3, GIA disabled |
| footer | caption only | fact + utilities | fact + CSV |

### A choropleth was the wrong instrument, and the mockup was right

`IndiaMap` shades the state itself, so the ink a state receives is its **land
area**. For a rate that is fine. For a **count** it is a systematic error:
Rajasthan reports 1,493 villages and Delhi 1 — a ratio of 1,493 — while their
areas differ by roughly 250×. Shaded, the two effects fight and area wins.

`IndiaBubbleMap` was added to the design system for this, with `r ∝ √v` so a 4×
count draws 4× the ink and not 16×. Its state centroids are **derived from the
generated paths** rather than stored beside them — a committed table is a second
copy of geometry that no build checks — and it takes the centroid of each
state's largest closed ring, so Andaman and Nicobar's circle lands on an island
rather than in the water between them.

### Three tabs, two maps

Grants-in-Aid sits on the tab strip carrying its live project total, and is
**not selectable**. The alternatives were both worse: leaving it off tells a
reader PM-AJAY has two components, and drawing it as an empty map tells them it
has reached nowhere. A named, disabled tab with a real figure says the true
thing — the projects exist, their locations are not published.

### The rail is text, and that is why it fits

§23 had to stack its companion because a scaled SVG shrinks rather than
reflows — at this page's width the chart's labels rendered at 5.9px. Rows of
real text reflow, so the rail sits beside the map as the mockup draws it and
reads at full size at every width.

### The production gateway 504s on this endpoint

Found while verifying, not assumed: `map-points` returns **504 after ~29s** from
`pmajay-api-admin.mosje.in`, while every other PM-AJAY report answers in
milliseconds and the department's **dev** host returns the same 3.5 MB in 2.2s.
The payload is simply too big for the production gateway.

Two consequences, both handled:

1. **The timeout came down 20s → 8s.** `live-data-fallback.md` is explicit that
   a slow feed must degrade to the snapshot rather than to a slow page. At 20 it
   degraded to *both* — a 12.5s server render before falling back anyway.
2. **The endpoint got its own base URL**, `NEXT_PUBLIC_PMAJAY_MAP_API`,
   defaulting to production. A citizen-facing page must not quietly read from a
   `-dev` host, but a demo or a staging build can point at one without a code
   change. Until production is fixed the map draws from the mirror and says so.

## 26. The halo, measured rather than judged

The reference prototype recording was read as a **kymograph** — a single row of
pixels through the halo's centre, stacked over time, which turns every ring edge
into a line whose slope is its speed. That gives numbers instead of impressions:

| | measured | previous build |
| --- | --- | --- |
| rings on screen | 3 | 3 ✓ |
| emission interval | ~2.9s | 2s |
| ring lifetime | ~8.7s | 6s |
| travel | r153 → r197 (**×1.29**) | ×1.40 |
| speed | ~constant | ease-out |

Every difference points the same way: the implementation was faster, further and
front-loaded. **`linear` is the whole fix.** An eased ring visibly accelerates
away from the portrait and stalls at the end, and the stall is where the eye
catches the loop; at constant speed and even spacing there is no moment that
reads as a beginning.

The second change is the opacity envelope. It peaked at 12% and decayed, which
gives every ring one bright instant — and three bright instants a cycle is a
pulse however smooth the travel is. It now rises to 0.55, **holds flat** to 72%,
then releases to zero, so a ring is simply *present* for most of its life.

9s rather than 8.7 so the three delays are exact thirds; uneven spacing is what
makes a flow read as a set of separate pulses.

## 27. The halo was never running — a specificity tie, found by measuring

§26 tuned the motion and reported it working. It was not. The tuning was correct
and had no effect, because the element it applied to had been overridden into a
different kind of box entirely.

```css
.sa-siteheader__pulse        { position: absolute; z-index: 0; }   /* line 235 */
.sa-siteheader__halo > *     { position: relative; z-index: 1; }   /* line 266 */
```

Both are **specificity (0,1,0)**. `.sa-siteheader__pulse` is a child of the halo,
so it matches the second rule too — and at equal specificity the later rule wins.
`getComputedStyle` on the shipped page returned:

| property | intended | actual |
| --- | --- | --- |
| `position` | `absolute` | **`relative`** |
| `z-index` | `0` | **`1`** |

So what shipped was an in-flow grid item taking its own row in a
`place-items: center` grid, drawing a 28px shadow around a **zero-sized box**,
painting *above* the portrait instead of behind it.

**The lesson is the diagnosis, not the fix.** Three passes had tuned durations,
easings and opacity envelopes against a component that was not rendering any of
them, because each pass verified by *looking* at a small screenshot rather than
by asking the browser what it had computed. The first measurement found it in
one call.

The fix scopes the lift with `:not(.sa-siteheader__pulse)` so the two rules can
never tie. It is deliberately **not** fixed by moving a block up the file: source
order is not a contract, and the next person to reorder the stylesheet would
reintroduce it silently.

### And then: five rings, because three left a gap

With the bug fixed the motion was visible for the first time — and three rings on
a 9s loop emit one every 3s, which leaves a **visible pause at the portrait's rim**
between one ring departing and the next appearing. The eye locks onto a pause,
which is the opposite of flow.

Five rings on an 8s loop emit every 1.6s. Because the delays are exact fifths,
the five scales are always `{s, s+0.084, s+0.168, s+0.252, s+0.336}` — so there
is **always** a ring within a fifth of a cycle of the rim, by construction rather
than by luck. Measured live: 1.076 / 1.160 / 1.244 / 1.328 / 1.412, evenly spread
across the whole track.

| | §26 | now |
| --- | --- | --- |
| rings | 3 | **5** |
| cycle | 9s | 8s |
| emission | every 3s | **every 1.6s** |
| band width | 28px | **12px** |
| travel | ×1.29 | ×1.42 |

The band narrowed and the travel widened together, and they are one decision:
five rings ~15px apart need a band narrower than the gap between them, or they
merge into a single moving wash and stop reading as rings. At ×1.29 with 28px
bands they did exactly that.

Five rings need five boxes, and an element has two pseudo-elements — hence the
halo's own `::before`/`::after` **plus** the `__pulse` span and its two.

The fades are deliberately asymmetric: short in (10%), long out (32%). A ring
appears at the rim where the eye already is, so it must arrive too quickly to be
watched arriving; it leaves at the band's outer reaches, where a long dissolve is
invisible. Symmetrical fades made every birth a small event.
