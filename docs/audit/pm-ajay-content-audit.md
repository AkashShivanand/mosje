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
