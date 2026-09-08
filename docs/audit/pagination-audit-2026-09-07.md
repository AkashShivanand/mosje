# Pagination — design-director audit

**Date:** 2026-09-07 · **Scope:** every pager rendered anywhere on the estate ·
**Measured against:** WCAG 2.2 AA, UX4G 3.0, GIGW 3.0, and the pagination
components of GOV.UK, USWDS, IBM Carbon, Shopify Polaris, Atlassian and Ant.

**Status: acted on.** Nine of the eighteen findings are closed; the rest are open
with their state recorded below. Nothing has been deleted — an audit that quietly
removes what it found cannot be checked against later.

## Where each finding stands, 8 September 2026

| ID | Finding | State | Landed in |
|---|---|---|---|
| F-1 | The register stops at page five | **Closed** | #368 |
| F-2 | That pager is invisible to assistive technology | **Closed** | #368 |
| F-3 | "Showing 981 documents" over a list of ten | **Closed** | #368 |
| F-4 | One control, nine renderings | **Partly** | #370, #378 settled `Pagination` vs `DataTable` on disable-in-place. `DocumentCatalog` now uses the component, so eight renderings remain; six are untouched |
| F-5 | The two prototype pagers are focusable decoys | Open | — |
| F-6 | Two landmarks with the same name | Open | — |
| F-7 | No pager meets UX4G 3.0's touch target | **Partly** | #370 for `Pagination` `md`, #369 for the carousel. The table pager (36px), `ListingTable` (36px) and `DocumentCatalog`'s steps are unchanged; `Pagination` `sm` stays 32 by a recorded decision |
| F-8 | Focus destroyed on every page change | **Closed** | #378 |
| F-9 | No pressed state, anywhere | **Closed** | #370, with the remaining 101 selectors gated by #374 |
| F-10 | Documented evidence that does not match the code | **Closed** | #370 |
| F-11 | No results summary | Open | — |
| F-12 | No page-size control | Open | — |
| F-13 | No Previous/Next-only mode | Open | — |
| F-14 | No jump-to-page | Open | — |
| F-15 | No unknown-total mode | Open | — |
| F-16 | No loading state | Open | — |
| F-17 | `Pagination` has no Figma master | Open | Verified still absent 8 September. The *Carousel* master was rebuilt in the same period; this is a different component |
| F-18 | The docs specimen omits `size="sm"` | Open | — |

**One finding not in the original list**, added by the work itself: `tools/interaction-states`
now measures the pressed-state gap across the whole design system — 109 selectors in 59 of
113 stylesheets when first run, 101 after the fixes — and gates it on every pull request so
the number can only fall.

---

## Verdict

The design system's `Pagination` is a well-made component with an unusually
honest docstring, and it is *not* the thing that is wrong. What is wrong is that
it is one of **nine** pagers on the estate, that the two rendered most often to
citizens are not it, and that the one on the busiest document register in the
Department **cannot reach 94 of its 99 pages**.

Three things follow, in priority order:

1. **A functional defect on 13 public document pages** (F-1). This is the only
   item here a citizen can be harmed by today.
2. **Nine renderings of one control** (F-4). The system does not have a
   pagination problem; it has a pagination *adoption* problem.
3. **The component's own gaps** (F-7 … F-12) — every one of which is already
   proved by a hand-rolled workaround somewhere in the estate. The estate has
   written down what the component is missing; nobody has read it back.

---

## Part 1 — Ship-blockers

### F-1 · The document register can only reach its first five pages · **CRITICAL**

`apps/hub/src/components/website/templates/DocumentCatalog.tsx:241`

```tsx
{Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
  const pNum = i + 1;               // ← always 1,2,3,4,5. Never a window.
```

The pager renders page buttons **1–5 and only ever 1–5**, whatever `totalPages`
says. Beyond page 5:

- pages 6…N are reachable only by clicking **Next** once per page;
- **no button is highlighted**, so the control gives the reader no indication of
  where they are;
- there is no ellipsis, no last-page button, and no jump.

Measured live at `localhost:3007/website/advices`, 1280px, 2026-09-07:

| Reading | Value |
|---|---|
| Documents in the register | **981** |
| Pages | **99** |
| Page buttons rendered | **5** |
| State after clicking Next six times | `Page 7 of 99` — **no button highlighted** |
| Pages reachable without 94 consecutive clicks | **5** |

This template is used on **13 public pages**. **Seven of them exceed five pages
today**, and every page past the fifth is unreachable by number on all seven:

| Register | Records | Pages | Unreachable by number |
|---|---|---|---|
| Advices | 981 | 99 | 94 |
| Tenders | 312 | 32 | 27 |
| Annual Reports | 211 | 22 | 17 |
| Circulars & Notifications | 164 | 17 | 12 |
| Vacancies | 163 | 17 | 12 |
| Publications | 72 | 8 | 3 |
| Acts & Rules | 71 | 8 | 3 |

The remaining six (forms-templates, mou, rti, notices, policies, miscellaneous)
are under five pages and are unaffected.

> **Incidental, and not a pagination defect** — noted here because it was found
> while counting. Four of those six ask `getDocumentsByType()` for categories
> that do not exist in `documents.json`: `"RTI"`, `"Notices"`, `"Policies"` and
> `"Miscellaneous"` (the data holds `"Notice"` and `"POLICY"`, and nothing for
> the other two). All four render **zero documents**. A `"Resources"` category
> holding 257 records has no page at all. This belongs to whoever owns the
> content mapping, not to this audit.

**Fix:** delete the block and render `<Pagination hrefFor={…} />`. The component
already computes the window, the ellipses and the first/last anchors correctly.

### F-2 · That same pager is invisible to assistive technology · **HIGH**

Same file, line 229. The container is a `<div className="mt-8 flex …">`. There
is no `<nav>`, no `aria-label`, no `aria-current` on any button, and no list.
A screen-reader user cannot jump to it, is not told it is navigation, and — the
compounding of F-1 — is not told which page they are on either. Verified in the
live accessibility tree: the page's named landmarks are Primary, Breadcrumb,
Social media and Website policies. The pager is not among them.

### F-3 · "Showing **981** documents" while showing ten · **MEDIUM**

`DocumentCatalog.tsx:141`. The count of the *filter result* is presented as the
count of what is on screen. The correct sentence, and the one every serious
system writes, is `Showing 61–70 of 981`. `smile-admin` already writes it that
way; `DataTable` already writes it that way. This page does not.

---

## Part 2 — Nine pagers

| # | Where | Target | Current page | At the ends | Page numbers | Named `<nav>` |
|---|---|---|---|---|---|---|
| 1 | DS `Pagination` `md` | 40×40, 4px gap | outlined | **removed** | windowed + ellipses | ✅ |
| 2 | DS `Pagination` `sm` | 32×32, 4px gap | outlined | removed | windowed | ✅ |
| 3 | DS `DataTable` pager | 36×36, 4px gap | outlined | **disabled** | windowed, icon ellipsis | ✅ |
| 4 | website `ListingTable` | 36px | *n/a* | disabled | **none** | ✅ |
| 5 | website `DocumentCatalog` | 32×32 / 30px steps | **filled** | disabled | **1–5 only** | ❌ |
| 6 | smile-admin, desktop | Button `sm` | *n/a* | disabled | none, `Page n / N` | ✅ |
| 7 | smile-admin, mobile | Button `sm` | *n/a* | disabled | none | ✅ (duplicate name) |
| 8 | scw `StaticPager` | 32×32, 6px gap | outlined **+ tinted fill** | disabled | decoy | ⚠️ unnamed |
| 9 | e-Utthan `StaticPager` | 32×32, 8px gap | outlined | disabled | decoy | ✅ |

### F-4 · One control, nine renderings, four target sizes · **HIGH**

Four target sizes (40, 36, 32, 30), three gaps (4, 6, 8), three treatments of
the current page (outlined, outlined-plus-tint, solid fill), and two opposite treatments of the ends
(removed vs disabled) — **the last two disagreeing inside the design-system
package itself**, between `Pagination` and `DataTable`. A listing and a table on
the same screen will not agree about what "you are here" looks like.

This was already found once. `tools/design-audit/projects/tg/out/audit-master-final.json:156`
records *"Match the pagination active-page control to the design's outlined
style. Applies to every paginated table."* It was recorded and not propagated.

### F-5 · The two "static" pagers are focusable controls that do nothing · **MEDIUM**

`scw/ui.tsx:114` and `eutthan-cells.tsx:188` both carry a docstring arguing that
a real pager would be *"a control that looks like it works and does not"*. The
reasoning is right. The implementation is the thing the reasoning warns against:
real `<button>`s, in the tab order, with hover states, `aria-current="page"`,
`aria-label="Next page"`, and — in scw — a real `<select>` offering 10/50/100
that changes nothing. A sighted mouse user learns quickly that it is scenery. A
keyboard or screen-reader user tabs into five controls that announce themselves
as working page navigation.

**Fix:** if it must not move, it must not be operable — `aria-hidden` decoration,
or `disabled` throughout. Either is honest; the present form is not.

### F-6 · Two landmarks with the same name · **LOW**

`smile-admin/(app)/persons/page.tsx:454` and `:503` both render
`<nav aria-label="Pagination">`. `Pagination`'s own docstring says to make the
label specific when a page has more than one pager. The desktop/mobile pair is
one pager expressed twice; only one is ever displayed, but the duplication is
the exact thing the guidance warns about.

---

## Part 3 — Standards

### F-7 · No pager on the estate meets UX4G 3.0's touch target · **HIGH**

UX4G 3.0 §3 (*Spacing and layout*) and §5 (*Iconography*) both state: **minimum
44×44px on mobile, with 8px minimum spacing between interactive elements.**

| Pager | Target | Gap | UX4G 44 + 8 | WCAG 2.2 AA (24) |
|---|---|---|---|---|
| `Pagination` `md` | 40×40 | 4px | ❌ | ✅ |
| `Pagination` `sm` | 32×32 | 4px | ❌ | ✅ |
| `DataTable` | 36×36 | 4px | ❌ | ✅ |
| `ListingTable` | 36px | 8px | ❌ | ✅ |
| `DocumentCatalog` | 32×32 / **30px** steps | 4px | ❌ | ✅ |

Everything clears the legal floor. Nothing clears the recommendation.

Worse, `pagination.css:44` claims it does:

> *"40px clears WCAG 2.2 AA target size … and matches UX4G's 44px touch
> recommendation once the 4px gap between adjacent targets is counted."*

UX4G asks for 44px **and** 8px between; a 40px target with a 4px gap satisfies
neither half. Per `standards-precedence.md` a divergence is allowed and must be
*documented as a divergence* — a comment asserting compliance is the one form it
may not take.

**The estate has already solved this, one folder away.** `button.css:194` grows
a 32px button to a 44×44 thumb target on `@media (pointer: coarse)` using an
invisible centred `::after`, so the drawn control, the layout and the focus ring
stay exactly where they are — with a written rationale for why it is
pointer-coarse only. Pagination never adopted it. Neither did the table pager.

*(Aside for the team: UX4G cites 44×44 as "WCAG 2.5.8". It is not — 2.5.8 is
24×24 at AA; 44×44 is 2.5.5, AAA. Adopt the number, not the citation.)*

### F-8 · Focus is destroyed on every page change in the button form · **HIGH**

`pagination.tsx:150` and `:167`. In the `onPageChange` form:

- clicking page *n* replaces that `<button>` with a **`<span aria-current>`** —
  the focused element is unmounted, and focus returns to `<body>`;
- clicking **Next** into the last page unmounts Next (`current < totalPages`),
  with the same result.

A keyboard user is returned to the top of the document on every page turn, on a
99-page register. A screen-reader user loses their place and is told nothing —
there is no live region, so the only signal that anything happened is silence.

The component's docstring defends removal over disabling, and for the **link**
form that reasoning holds (GOV.UK removes too, and a real navigation re-anchors
focus anyway). It does not survive the button form. Note that `DataTable` —
same package — keeps the clicked page button mounted and therefore keeps focus.

**Fix, in order of preference:**
1. In the button form, render the current page as
   `<button aria-current="page" aria-disabled="true">` — focusable, not
   actionable, focus preserved.
2. Keep Prev/Next mounted with `aria-disabled` in the button form; keep removing
   them in the link form.
3. Add an `aria-live="polite"` status announcing `Page 7 of 99` on change.
   `smile-admin/(app)/persons/page.tsx:484` already does exactly this, by hand.

### F-9 · No pressed state, anywhere · **MEDIUM**

`pagination.css` defines `:hover` and `:focus-visible` and no `:active`. On a
touch device there is no hover, so tapping a page number produces **no
acknowledgement at all** until the content swaps — which on a server-rendered
link is a network round trip away. `Button` in the same package has `:active`
on all three appearances. Response is the cheapest quality signal there is and
this control has none.

### F-10 · Documented evidence that does not match the code · **MEDIUM**

The docs page asserts, under WCAG 2.4.4 and marked `verified`:

> *"Each control has an accessible name naming its destination — 'Go to page 4',
> not '4'."*

The component renders `aria-label={\`Page ${n}\`}` → **"Page 4"**. The claim is
close enough to be true in spirit and wrong in fact, on the surface
`ds-documentation-standard.md` §2a calls a compliance assertion that must be
*earned by naming the evidence*. Either the label changes or the evidence does.

The same page's target-size row cites 40×40 and never mentions that `size="sm"`
ships 32×32 — the smaller of the two arrangements is undocumented in the
checklist that certifies it.

### Inherited, and out of scope here

Focus rings use `--sa-focus-width: 2px`; UX4G specifies 4px with 2px offset.
This is an estate-wide token decision, not pagination's, and it meets WCAG 2.2
AA. Flagged so it is decided once, centrally, rather than in this component.

Reduced motion is already handled at the token layer (`--sa-motion-*-duration`
collapse to `0.01ms`), so the component inherits it correctly. No action.

---

## Part 4 — What the component is missing, and who already proved it

Every gap below is demonstrated by a workaround **already in this repository**.
That is the argument for closing them: the estate has been voting with its
hand-rolled code.

| # | Gap | Who works around it today | Prior art |
|---|---|---|---|
| F-11 | **No results summary.** The component renders numbers and nothing else. | `DataTable` ("Showing 1–10 of 1,234"), `smile-admin` ("Showing 41–60 of 981 beneficiaries"), `PmajayWorksMap`, `DocumentCatalog` (wrongly, F-3) | Carbon, MUI, Ant `showTotal`, USWDS |
| F-12 | **No page-size control.** Lives only inside `DataTable`, unavailable to any listing. | `DataTable`; `scw` fakes one with a dead `<select>` | Carbon, Ant `showSizeChanger`, MUI |
| F-13 | **No Prev/Next-only mode** for linear content. | `ListingTable`, `smile-admin` ×2 — three hand-rolls of the same missing variant | **GOV.UK's "block" pagination** is exactly this |
| F-14 | **No jump-to-page.** 99 pages, `siblings=2` → `1 … 47 48 49 … 99`. Getting to page 60 is 11 clicks. | nobody — readers simply cannot | Carbon page-select, Ant `showQuickJumper` |
| F-15 | **No unknown-total mode.** `totalPages` is required, so a cursor-paged or expensive-count source cannot use the component. | nobody yet — it will bite the first server-paged register | **USWDS "unbounded"**, Polaris cursor-only |
| F-16 | **No loading state.** Nothing expresses "the next page is being fetched", so a slow connection shows a live pager over stale rows. | nobody | `data-state-completeness.md` §1 requires it |

On F-15 and F-16 the estate's own rule already binds this: *"Every state a
data-driven surface can be in is designed — loading, empty, error, filtered-to-
nothing, too-much."* Pagination is the control that expresses "too much", and it
has designs for exactly one of its own states.

---

## Part 5 — Design-system hygiene

### F-17 · No Figma master · **MEDIUM**

The docs page declares `figma={{ absent: "Not yet drawn in the Figma library." }}`
and there is no `pagination.figma.ts`, while `DataTable`'s pager *is* drawn
(`data-table.css:202` — *"Outlined current page (Figma), not a filled block"*).
So the library holds a Figma-approved pager that is welded inside a table, and
no master for the standalone control that seven templates and the public search
page render. That is the likeliest single cause of F-4: a designer composing a
listing screen has nothing to place, so a developer writes one.

### F-18 · The docs specimen omits `size="sm"` · **LOW**

`specimen.tsx` renders two `md` instances. `ds-documentation-standard.md`
requires the arrangements set — every non-variant property switched on — and
`sm` is the property most likely to be chosen wrongly, because the guidance for
when to use it is three paragraphs of docstring and no picture. Storybook has
the `InsideACard` story; the documentation page does not.

---

## Recommended order of work

*Superseded by the status table above; kept because it records what the priorities looked
like before any of it was acted on.*

| Priority | Item | Effort |
|---|---|---|
| **1** | F-1 / F-2 / F-3 — replace `DocumentCatalog`'s pager with `<Pagination hrefFor>` and fix the count sentence | small, 13 public pages fixed at once |
| **2** | F-8 — focus preservation + live region in the button form | small, in the component |
| **3** | F-7 — `@media (pointer: coarse)` 44px target, copying `button.css`; correct the CSS comment | small, estate-wide |
| **4** | F-4 — retire `ListingTable`'s and `smile-admin`'s pagers onto the component; settle removed-vs-disabled between `Pagination` and `DataTable` | medium |
| **5** | F-11 / F-13 — add a results summary slot and a Prev/Next-only mode; that is what items 4's call sites need to exist first | medium |
| **6** | F-17 / F-18 — draw the Figma master, add the `sm` arrangement | medium |
| **7** | F-9, F-10, F-5, F-6, F-12, F-14, F-15, F-16 | small each |

## Evidence

Live measurements taken 2026-09-07 against the dev hub on :3007 at 1280×900;
document counts computed from `apps/hub/src/content/website/documents.json`
(1,962 records). Geometry for components not reachable in the browser session is
taken from source and is stated as such.
