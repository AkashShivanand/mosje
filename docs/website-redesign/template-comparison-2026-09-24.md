# Redesign vs classic — template comparison

Taken 24 September 2026, to decide which templates to work through and in what
order. The rule agreed for this pass: **the classic design is the baseline for
every template; whatever is demonstrably better in the redesign is kept; the
rest is replaced.** One template at a time.

## The shape of it

| | |
|---|---|
| Templates under `/website` | **120** |
| Templates under `/website-classic` | **116** |
| Present on both sides | **113** |
| Of those, rebuilt against `website-next` components | **111** |
| Only on the redesign side | 7 |
| Only on the classic side | 3 |

So 111 templates were rebuilt rather than reused. That is the surface this pass
has to go through.

## How this list is ordered, and what the number means

The ranking signal is **how many lines the redesign template has against its
classic counterpart**. A template that shrank is the one most likely to have
dropped content — that is exactly what happened on the home page, where scheme
cards lost their photographs, the pledges lost their counts and the
organisation chips lost their totals.

It is a signal, not a verdict. A template can shrink because it moved prose
into shared content, and grow because it inlined prose the classic imported.
Every row still has to be looked at. But the order is not arbitrary, and the
top of it is where the risk is.

## Band 1 — shrank by 20 lines or more (10). Look at these first.

| Δ | Template | redesign | classic |
|---:|---|---:|---:|
| −247 | `/organisation/[...slug]` | 440 | 687 |
| −167 | `/whos-who` | 137 | 304 |
| −120 | `/search` | 282 | 402 |
| −113 | `/schemes-services/[slug]` | 66 | 179 |
| −50 | `/dashboard` | 86 | 136 |
| −44 | `/samavesh-admin-portals` | 55 | 99 |
| −40 | `/help` | 108 | 148 |
| −34 | `/events/[slug]` | 168 | 202 |
| −24 | `/cessation-of-voluntary-organisation-activities` | 34 | 58 |
| −22 | `/mosje-contact` | 40 | 62 |

`/organisation/[...slug]` is the one to take first. It is the largest drop, and
it is not one page — it renders every organisation in the estate, so whatever
it lost, it lost 17 times over.

## Band 2 — shrank by 4 to 19 lines (9)

`/contact-us`, `/copyright`, `/hyperlinking-policy`,
`/organisation-under-division-social-division`,
`/penalties-in-case-of-misutilisation-of-grants`,
`/policies-acts-rules-circular`, `/policies-acts-rules-codes-circular`,
`/prioritization-guidelines-for-funding-projects-by-voluntary-organisations`,
`/terms-conditions`

## Band 3 — the same size within 3 lines (56)

Thin wrappers over one shared catalogue or directory component — `/notices`,
`/tenders`, `/rti`, the twelve `*-directory` pages, and so on. Both sides are
the same handful of lines; what differs is which component they call. **These
are a single decision, not 56**: settle the shared catalogue and the shared
directory, and every one of them follows.

## Band 4 — grew by 20 lines or more (27)

| Δ | Template | redesign | classic |
|---:|---|---:|---:|
| +311 | `/social-defence-faqs` | 373 | 62 |
| +293 | `/about-the-division` | 363 | 70 |
| +227 | `/about-the-division-social-defence` | 287 | 60 |
| +148 | `/assurances` | 211 | 63 |
| +132 | `/welfare-of-the-other-backward-classes` | 193 | 61 |
| +127 | `/gallery` | 153 | 26 |
| +126 | `/official-language-act` | 184 | 58 |
| +121 | `/about-us` | 479 | 358 |
| +80 | `/` (home) | 131 | 51 |

Growth is not automatically good — several of these inline prose the classic
pulled from shared content, which is more lines and the same page. They are
last for that reason, not because they are safe.

## Only on one side

**Redesign only (7).** `/accessibility-statement`, `/archives`, `/disclaimer`,
`/feedback`, `/screen-reader-access`, `/website-policies`, and the
`[...missing]` catch-all. These are additions — mostly the statutory pages GIGW
asks for. Nothing to compare; keep.

**Classic only (3).** `/home-options`, `/nmba-options`,
`/nmba-placement-preview` — internal option boards, not public pages.

## Suggested order

1. `/organisation/[...slug]` — biggest drop, and it multiplies across 17 bodies.
2. `/whos-who` — second biggest, and a page citizens are sent to.
3. `/schemes-services/[slug]` — a scheme's own page, the end of most journeys.
4. `/search` — the fallback when navigation fails.
5. The shared catalogue and directory, which settles Band 3's 56 templates at once.
6. `/dashboard`, `/help`, `/events/[slug]`, then the rest of Band 1 and Band 2.

`/accessibility` scored −103 on the raw count and is **not** in the list: it is
a permanent redirect to `/accessibility-statement`, the address GIGW auditors
look for, so the twelve lines are the whole page doing its job. Checked before
ranking it, which is the check every other row still needs.

---

## CORRECTION, same day — the line-count ranking was wrong

`/organisation/[...slug]` topped the list at −247 lines. It was checked first,
and it does **not** need restoring: rendered side by side it is RICHER than the
classic — 8,252px against 6,518 on the NMBA page, with a "More from …" sub-page
nav, Latest Updates and Social Media that the classic does not draw. The 247
lines are prose the classic holds inline and the redesign reads from shared
content. Two deltas remain and neither is a loss: the classic's row of ten
outbound tag links (dropped deliberately — the estate treats CMS tags as filing
labels, not facts about a record) and the order of What's New.

**So line count does not measure this.** The instrument that does is comparing
the SECTION HEADINGS each side renders. That was run against Bands 1 and 2 and
found real, specific losses on sixteen of eighteen templates. That list, below,
supersedes the ranking above.

## The real list — sections the classic renders and the redesign does not

Measured by loading both pages and diffing their `<h2>`s. Every classic page
named here was confirmed to be a real page, not a stub.

| Template | Sections the redesign lost |
|---|---|
| `/samavesh-admin-portals` | SMILE Admin Console · PM-AJAY MIS · Scholarship Admin (NOS) · NMBA Dashboard · Grant-in-Aid Management · NGO Monitoring Portal |
| `/terms-conditions` | Content Ownership and Usage · Disclaimer of Warranties · Links to External Websites · Governing Law and Jurisdiction · Amendments |
| `/prioritization-guidelines-…` | Purpose · Priority Areas · Prioritisation Criteria · Considerations |
| `/policies-acts-rules-codes-circular` | Introduction · Acts · Rules & Codes · Policies & Circulars |
| `/policies-acts-rules-circular` | Introduction · Acts · Rules · Policies & Circulars |
| `/penalties-in-case-of-misutilisation-of-grants` | What Constitutes Misutilisation · Consequences · Procedure Before Penal Action |
| `/cessation-of-voluntary-organisation-activities` | Circumstances of Cessation · Procedure on Closure or Withdrawal · Discontinuance by the Department |
| `/hyperlinking-policy` | Links to External Websites · No Endorsement Implied · Conditions for Linking |
| `/copyright` | Conditions of Reproduction · Exceptions · Trademarks |
| `/organisation-under-division-social-division` | Overview · Institutes & Bodies · Coordination |
| `/contact-us` and `/mosje-contact` | the Department's address block · Key Officers · Send Us a Message |
| `/dashboard` | Scheme-wise Disbursement · Beneficiaries by Category |
| `/help` | Screen Reader Access |
| `/whos-who` | Dr. Ambedkar Foundation (DAF) |
| `/search` | Popular searches |

The pattern in the policy pages is one thing repeated: the prose came across and
its **section structure did not**. On a policy document the headings are not
decoration — they are how a reader finds the clause that applies to them, and
how a screen-reader user navigates at all.

## Revised order

1. `/samavesh-admin-portals` — six whole sections gone; the page has no content left.
2. The policy set, which share one cause and probably one fix: `/terms-conditions`,
   `/prioritization-…`, both `/policies-acts-rules-…`, `/penalties-…`,
   `/cessation-…`, `/hyperlinking-policy`, `/copyright`,
   `/organisation-under-division-social-division`.
3. `/contact-us` and `/mosje-contact` — Key Officers and the contact form.
4. `/dashboard`, `/whos-who`, `/help`, `/search` — one named section each.
5. Band 3's 56 catalogue wrappers, still one decision rather than 56.
6. `/organisation/[...slug]` — **no action**, it is already better.

Bands 3 and 4 have not been measured this way yet. They should be before anyone
works on them.
