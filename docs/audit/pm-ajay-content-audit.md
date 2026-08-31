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
