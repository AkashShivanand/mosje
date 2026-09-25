# Home, middle sections — Key Offerings + What's New, and the Documents row — DBIM spec

Reference: `home` (master-socialjustice.digifootprint.gov.in, captured 25 Sep 2026). Values
are the reference's computed styles at 1440 (its 1280–1536 bucket: p 14px, h2 20px, h3 16px),
plus the rules in its raw stylesheet for the other buckets and for states the capture did not
render. Colours are named by the token they bind to (`data-brand="dbim"`, Colour Group 5).

Files: `components/website-dbim/home/{OfferingsAndNews,DocumentsRow,OfferingsTabs,PersonaCarousel}.tsx`,
`home/home-mid.css`, data `lib/website-dbim/home-mid.ts`.

## 1. `DbimOfferingsAndNews` — `.whats-new-container` (y 1446–1955 at 1440, 509 tall)

| Element | Reference | Notes |
|---|---|---|
| Band | bg `neutralScale-100`; padding 40 64 at 1280–1536 (`py-80 px-120`: 80 / 120 at ≥1537); ≤991: 16 sides | `--db-gutter` for the sides |
| Row | `row g-5`: two columns, each padded 15 inline; 8/12 + 4/12 at ≥1200, stacked below (30 row gap) | content 845 + 407 at 1440 |
| Heading | kit `DbimSectionHeading` (48px icon, gap 16, 20px/700 `primaryScale-800`); 30px to what follows | ≤767: 16px |
| Tabs `.tab-buttons.whatsnew-4` | two equal buttons, h 46, 1px `primaryScale-800` border, 16px (1.6rem !important everywhere); first radius 4 0 0 4, last 0 4 4 0 | |
| · active | bg `primaryScale-800`, white, 600 | |
| · inactive | bg white, `primaryScale-800` text, 400 | |
| List `.tabs.layout-4` | margin-top 12 (8 ≤500), bg white, padding 0 16, radius 4, height 245 (300 ≤500), overflow-y auto | **min-height 245 (300 ≤500), no scroll: four rows**, the last with 10px under its glyph so four one-line rows make exactly 245 |
| Row `.tab-content` | padding 16 24, margin-bottom 8, border-bottom 1px `primaryScale-200` (none on last); grid 10/12 + 2/12 (7.5 inline padding each) | 57 tall |
| · title | 14px, lh normal, `text-default`, clamped to 3 lines | |
| · chevron | `arrow_forward_ios` 24 (16 ≤768) `primaryScale-800`, right-aligned | |
| View More | kit `DbimViewMore` md, right-aligned, margin-top 12 (8 ≤767) | → `/offerings` or `/offerings/vacancies` by tab |
| What's New panel `.whatsnewlistview` | bg `primaryScale-800`, padding 16 24 (0 24 ≤768), radius 4, height 305 (max 301 at 1280–1536), overflow-y auto | min-height 301, no scroll: **four items**, the number that fits (measured at 1440: 237 of 269px) |
| · item `.list-group-item` | transparent, white text, 14px (1280–1536, ≤768) / 16px, padding 15 16 (0 inline ≤768), border-bottom 1px white, none on last; a Material Symbol inside (16px ≤768) | populated styling from the raw CSS — the capture was empty |
| View More | as left → `/whats-new` | |

The reference's panel is empty in the capture ("No Data Available." is not even printed); its
populated rules are above. Each item: the title (link, clamped to two lines) and a trailing
`arrow_forward_ios` 16px (`open_in_new` when it leaves the estate) — the rule set names a Material
Symbol inside the item; which glyph is not recoverable from an empty capture. No date: a date line
would cost a row, and the What's New page prints dates.

**Tabs are a real tablist:** `role="tablist"`, two DS `Button`s (`role="tab"`, `aria-selected`,
`aria-controls`, roving `tabIndex`), ←/→/Home/End move and activate; panels `role="tabpanel"`
with `aria-labelledby`. One client leaf (`OfferingsTabs.tsx`); the rows are built on the server.

## 2. `DbimDocumentsRow` — `.layoutshift` (y 1955–2551 at 1440)

| Element | Reference | Notes |
|---|---|---|
| Band | white; padding 80 120 (at 1440 too — `.layoutshift` does not step at 1536); ≤991: 32 16 | not `--db-gutter` |
| Grid | Bootstrap rows, 7.5 inline padding per column: Documents 6/12, Personas 3/12, Links 3/12 at ≥1200 → content 592.5 / 288.75 / 288.75, 15 apart; below 1200 all full width, 30 row gap | |
| Heading | kit, left; **Personas heading centred** at ≥1200 (flex-start below); 30px below (16 ≤767) | |
| Cards `ul.recentDocument` | 2×2, list inset 20px from the column's left; card 279 wide, 15 apart horizontally, 20 vertically; min-height 140 | ≤767: one column, 5 apart |
| · card | padding 24 (16 ≤767); 1px `primaryScale-800` border, radius 4, shadow `0 6 12 rgba(35,35,47,.08), 0 2 4 rgba(35,35,47,.06)`; ≤767: bottom border only, no shadow | shadow → `--sa-elevation-raised` (nearest) |
| · category | `p.h3` 16px (20 ≥1537) / 700 / `primaryScale-800`, capitalize, mb 8 | "Orders And Notices" by `capitalize` |
| · title | 14px, lh normal, `text-default`, clamp 3 | |
| View More | kit `DbimViewMore` **sm**; margin-top 22 below the cards (ul mb 10 + 12) | → `/documents` |
| Persona image | 200×200 at 1280–1536, 260×260 otherwise; circle; bg `primaryScale-200`; object-fit cover | |
| Persona name | `p.h3` 16px (20 ≥1537) / 600 / lh 26px / ls .18px, uppercase, `primaryScale-800`, centred, margin 30 0 30 | |
| Controls `.carouselbtn` | margin 10 0, gap 10: ‹ · dots · ›; chevrons 24 `primaryScale-800`; dots 12×12, 15 apart, `primaryScale-600` circles, active a `primaryScale-800` square | |
| Links `.importantlinklist` | padding-right 12; row padding 18 0, border-bottom 1px `#DEE2E6` → `--sa-border-neutral-subtle` (nearest), last row keeps its rule; label 14px (1280–1536) / 16px, `text-default`; `arrow_forward_ios` 24 (16 ≤768) | max-height 300 scroll never engages with four rows — not reproduced |
| View More | kit md → `/important-links` | |

**Carousel:** one slide at a time, no autoplay (so nothing to pause); prev / next are DS
`IconButton`s named "Previous persona" / "Next persona"; dots are DS `Button`s named
"Show <persona>" with `aria-current` on the active one; the slide region is
`aria-roledescription="carousel"` with a polite live label "<n> of <total>". Motion: the
reference slides (0.6s); ours swaps, which also honours reduced motion.

## Content mapping

| Reference | Ours |
|---|---|
| Key Offerings › Schemes and Services (the reference's box shows four) | Four schemes from the scheme master (`SCHEMES`), chosen by one rule: **the reference's own first four, matched to the master where the Department runs that scheme** — AVYAY (`avyay-ipsrc`, the umbrella's lead component), NAPDDR (`napddr`), SHRESHTA (`shreshta`) — and in place of "National Awards … Prevention of Alcoholism", which the master does not hold, the Post Matric Scholarship for SCs (`pms-sc`), the Department's largest scheme. Name = master `name`; href `/offerings/schemes-and-services/<id>` (the offerings builder's route, keyed on `id`). View More carries the rest. |
| › Vacancies | `dbimVacancies()` (not archived, newest first), first four (`KEY_OFFERING_ROWS`); each → `/offerings/vacancies` |
| What's New (empty) | `whatsNew()` newest first, first four. A document item opens its file (`docRow`, as the Documents shelves do); an update opens its attachment or its dosje.gov.in page (`whatsNewUpdates`). External targets open in a new tab and say so. |
| Recent Documents (4 CMS cards, each a series) | Newest live document per tab from `lib/website-dbim/documents.ts`, in the reference's mix — 1 Reports, 1 Orders and Notices, 2 Publications. Category = tab label, text = document title; href = that document's **series page** `/documents/<tab>/<series>` (the documents builder's route). |
| Explore User Personas (IT Professional, Business Owner, Researcher) | The Department's audience pages that the three drawings genuinely depict — see below |
| Important Links (Scheduled Caste Welfare, Social Defence, Grants-In-Aid To NGOS, Inauguration) | The first four rows of `DBIM_IMPORTANT_LINKS` (`lib/website-dbim/utility.ts`, one row per Division) — the same list the Important Links page shows. That list now leads with the reference's three (Scheduled Caste Welfare, Social Defence, Grants-In-Aid To NGOs; reordered there, in one place), then `DIVISIONS` order, so the fourth is Welfare of the Other Backward Classes in place of "Inauguration" (a webcast link we have no source for). Rows open `/ministry/our-division/<id>`, or the other website for a division that has only one. |

### Persona mapping (art → persona)

| Drawing (`DBIM_PERSONA_ART`) | What it shows | Persona (`DBIM_PERSONAS`, utility.ts — slug and title) | Route |
|---|---|---|---|
| `persona-1.png` | man in a suit and tie on a call, holding a tablet (the reference's "IT Professional") | **For Government Officials** — an officer at work | `/persona/government-official` |
| `persona-3.png` | young man in shirt and tie reading an open book (the reference's own "Researcher") | **For Researchers** | `/persona/researcher` |
| `persona-2.png` | man in a suit, portrait (the reference's "Business Owner") | — **not used**: no Department persona is a business owner | — |

**Dropped:** For Student and For Beneficiary — none of the three drawings depicts a student
or a beneficiary without mislabelling it (the one young figure is the reference's researcher,
and giving it two labels would be the same mislabelling). They return when art exists. The
carousel therefore has two slides and two dots, not three.

## States

- Schemes / Vacancies / What's New / Recent Documents / Important Links empty →
  `DbimEmptyState` ("No Data Available.", the reference's wording) inside the same box.
- Personas: none mapped → the column renders the empty state.
- No loading state: every list is read on the server from committed data.

## Deviations (and why)

1. **Rows shown are the rows that fit — no scroll.** The reference fixes the scheme list at 245px
   and the What's New panel at 301px with `overflow-y: auto`. Ours holds the same boxes without a
   scroll region (contract rule 10): four rows in each, and View More carries the rest. The band
   measures 509px at 1440, the reference's height. A title longer than the reference's (for example
   the Vacancies tab's two-line notices, or scheme names at 390) grows the box rather than clipping
   it, since the heights are minimums. At 1440 the What's New panel stretches 2px, to 303, so the
   two View More buttons share a line (the reference's sit 2px apart).
2. Persona carousel has two slides (mapping above).
3. Carousel does not slide; it swaps (reduced motion by default).
