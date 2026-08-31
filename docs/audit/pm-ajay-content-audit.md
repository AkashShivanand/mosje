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
| `about-us` | `pmajy/about-us` — a strict superset; all 61 sentences present |
| `construction-repair-of-hostels` | `components/construction-repair-of-hostels` |
| `development-of-sc-dominated-villages-into-adarsh-gram` | `components/development-of-sc-dominated-villages-into-adarsh-gram` |
| `grants-in-aid-to-state-districts` | `components/grants-in-aid-to-state-districts` |
| `flow-chart` | `reports/flow-chart` — byte-identical |
| `illustrative-list-…-under-the-scheme` | `reports/illustrative-list-…-under-the-scheme` — identical text |
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

### Still namespaced, and worth the same treatment

`pmajy/about-us`, `reports/flow-chart` and `reports/illustrative-list-…` carry the
same invented segment for the same reason, and the source publishes all three at
flat paths. They were left alone only because this pass was scoped to the component
pages. Flattening them is the same four-step change and would finish the job.
