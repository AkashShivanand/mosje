# SAMAVESH Design System — completeness audit, 2026-09-06

Measured, not estimated. Every figure below has a command beside it.

## 1. Where the system actually stands

| Measure | Figure | Command |
|---|---|---|
| Exported names in the barrel | 290 | `packages/design-system/index.ts` |
| Of those, components | 132 | `node tools/docs-coverage/check.mjs` |
| Component documentation pages | 143 | `find apps/hub/src/app/design-system/components -name page.tsx` |
| Pages carrying the full six-element shape | **143 / 143 (100%)** | `npm run check:ds-pages` |
| Components with no documentation page | **0** | `npm run check:docs-coverage` |
| Foundation pages | 19 | `apps/hub/src/app/design-system/foundations/` |
| Estate gates passing | **all** | `npm run check` → exit 0 |
| Shadow-UI collisions still declared | 38, in 15 files | `npm run check:shadow-ui` |
| UX4G 3.0 component coverage, as reported | 66.1% (32 exact + 7 partial of 59) | `npm run ux4g:measure` |

**The system is not immature. It is under-reported and under-extended.** Its own gates are
green, its documentation shape is at 100%, and its governance surfaces (governance,
contributing, roadmap, changelog, patterns, design-context) already exist. The three real
deficits are named below.

## 2. Deficit one — the UX4G conformance map is a month stale, and it lies downward

`tools/ux4g-conformance/component-map.json` carries `"$reviewed": "2026-08-06"`. Nine
components it records as `missing` or `partial` have shipped since:

| UX4G component | Map says | SAMAVESH actually ships |
|---|---|---|
| Combobox | missing | `Combobox` |
| Date Picker | missing | `DatePicker` |
| Tooltip | missing | `Tooltip` |
| Accordion | missing | `Accordion` / `AccordionItem` |
| Divider | missing | `Divider` |
| Breadcrumb | missing | `Breadcrumb` |
| Link | missing | `Link` |
| Mega Menu | missing | `MegaMenu` / `MegaMenuItem` |
| Icon Button | partial | `IconButton` (a distinct export since v0.4x) |

The published coverage figure is therefore **wrong in the department's disfavour**. A
conformance number that drifts downward is worse than no number: it invites work that has
already been done. Refreshing the map is the first fix, and it must be a *review*, not a
rename — each row re-checked against the barrel.

## 3. Deficit two — twelve UX4G components genuinely absent

After the map is corrected, these remain real gaps against UX4G 3.0's published set:

| UX4G component | Why the estate needs it | Handoff evidence |
|---|---|---|
| **Popover** | Anchored, dismissible, focus-managed disclosure. `Tooltip` is description-only and cannot hold controls. | row-action menus, field-level help with links |
| **Slider** | Bounded numeric entry | filter ranges |
| **Range Slider** | Two-handle bounded range | fund/amount filters, date spans |
| **Time Picker** | Time of day, separate from date | Garima Greh *Daily Programme*, *Attendance* |
| **Carousel** | Sequential media/promo band | website home, portal hero rotations |
| **List** | Semantic list surface with dividers, leading/trailing slots | every "recent items" panel |
| **Result List Row** | One search hit, with title, meta and match context | Grievance tracking, Beneficiary search |
| **Time Slot** | Selectable appointment window | SCW *Events*, Garima Greh *Daily Programme* |
| **Image** | Ratio-locked, alt-required figure with caption | *Photo View*, evidence pages |
| **Draft Status Banner** | "Saved as draft, resumes here" | every multi-step application (E-Anudaan 7 steps) |
| **Feedback** | The citizen's rating of the page | GIGW feedback obligation |
| **Biometric Capture** | Fingerprint / iris capture surface | SMILE and Transgender enrolment |

## 4. Deficit three — the officer-facing half has patterns with no home

Read from the 12 handoff pages (`Login/Signup`, `Transgender Portal`, `NOS`, `E-Utthan`,
`Smile Beggary`, `NHAPOA`, `NMBA`, `SCW`, `PM-AJAY`, `E-Anudaan`, `Garima Greh`,
`Grievance Portal`). These are things the screens draw and the barrel cannot supply:

| Missing | Screens that need it |
|---|---|
| **Menu** (generic, APG menu semantics) | every table row's `⋮`, every "Manage" button |
| **Split Button** | *Approve* + *Approve with remarks* |
| **Description List** (label/value pairs) | every *Application Detail* screen; `ReviewItem` exists but is wizard-private |
| **Bulk Actions Bar** | *Withdrawn Applications*, *Pending Approvals*, *Beneficiary List* |
| **Tree** | *Master Data*, *Map Ministry & Schemes*, *Roles & Permissions* |
| **Transfer List** (dual list) | *Surveyor Mappings*, *Roles & Permissions* |
| **Notification Centre** | 4 portals ship a *Notifications* screen |
| **Activity / Audit Log** | Smile Beggary *Audit Logs* |
| **Comment Thread** | NHAPOA *Clarifications*, NOS remarks |
| **Inline Edit** | *Master Settings* (17 sub-screens) |
| **File List** | uploaded-document tables in every application |
| **Number Input** | *Financial Year*, quantities, fund figures |
| **Date Range** | every dashboard's period filter |
| **Schedule / Calendar** | Garima Greh *Attendance*, *Daily Programme*, SCW *Events* |
| **Video Tile** | Garima Greh *CCTV* |
| **Signature Pad** | *Consent Form* |
| **Back to Top** | long MIS reports (one is 12,796px tall) |
| **Cookie Consent** | statutory, and the corner rail already reserves its slot |
| **Language Switcher** | GIGW bilingual obligation |

## 5. Deficit four — adoption, not coverage

`npm run check:shadow-ui` declares **38 collisions across 15 files**: portals that
re-implement a component the barrel already exports.

| File | Re-implements |
|---|---|
| `components/nhapoa/ui.tsx` | Button, Card, DataTable, EmptyState, PageHeader, SectionTitle, Select, Stepper, Textarea |
| `components/scw/ui.tsx` | Button, Card, DataTable, PageHeader, Pagination, SectionTitle, Select, Stepper |
| `components/tg/ui.tsx` | Button, Card, EmptyState, PageHeader, SectionTitle, Select, Stepper, Textarea |
| `components/website/ui/data-table.tsx` | DataTable |
| `components/website/layout/Breadcrumb.tsx` | Breadcrumb |
| `components/website/SiteFooter.tsx`, `site-footer.tsx` | SiteFooter |
| `components/website/SamaveshBanner.tsx` | SamaveshBanner |
| `components/site-header.tsx` | SiteHeader |
| `components/smile-admin/shell/footer.tsx` | Footer |
| `components/smile-admin/shell/page-header.tsx` | PageHeader |
| `components/eutthan/eutthan-cells.tsx` | Pagination |
| `components/pm-ajay/dashboard/charts.tsx` | Legend, Sparkline |
| `components/pm-ajay/dashboard/unified-app.tsx` | Alert |
| `components/scw/admin/assisted-devices/page.tsx` | Toggle |

A baseline that only ratchets is the right instrument; it is not a licence to stop. Three
portals having their own `Stepper` is exactly the defect the Stepper rebuild (PR #333) just
deleted three copies of, in three other places.

## 6. Deficit five — the package cannot leave the building

`packages/design-system/package.json` carries `"private": true`. "Ready to go live
globally" cannot be true of a package no one outside this monorepo can install. Going
public is a decision with licensing, support and security consequences, and it is a
decision for the department, not for this branch — but it must be recorded as the gate it
is, not left as an unexamined default.

## 7. Benchmark position

Against the six-dimension NN/g model:

| Dimension | SAMAVESH | Note |
|---|---|---|
| Infrastructure robustness | **strong** | tokens in code, 40+ gates, 100% documentation shape, Code Connect |
| Documentation & knowledge | **strong** | templated pages, generated props tables, `design.md`, `llms.txt` |
| Governance | **present** | governance/contributing/roadmap pages exist |
| Component coverage | **the gap** | ~30 named absences across UX4G and the estate's own screens |
| Adoption | **the other gap** | 38 declared shadow-UI collisions |
| Support / distribution | **unresolved** | private package; no external consumer path |

Coverage and adoption are the two axes to move. Everything else is already at or above the
level of the systems it is benchmarked against.

---

# Addendum, same day — the Figma library is not empty where the code is new

The audit above assumed the thirteen components added in this pass had no Figma
counterpart, and every documentation page said "master pending". **That was
wrong for seven of them, and wrong in the more dangerous direction: a master
exists and disagrees with the code.**

Read from the live library (`3FF5l0SMNIwdpZrKkeyPTm`, 6 September 2026).

| Code component | Library page | What is actually there | Verdict |
|---|---|---|---|
| `Popover` | Popover | `popover` — a UX4G import, 16 variants: Direction × Title × Auto width | **Disagrees.** Direction ≈ `side`, Auto width ≈ `matchTriggerWidth`; no `align`; "Title" is not a prop here; the name is lowercase, off the house convention |
| `Menu` | Dropdown | `Dropdown` 84 variants + `Dropdown / MenuItem` 7 | **Different name, different contract.** The code is the WAI-ARIA menu BUTTON; "Dropdown" in this library is the select-shaped import |
| `Slider` / `RangeSlider` | Range Slider | `RangeSlider` 20 variants, properties Label / Left control / Right control | **Half present.** No single-thumb `Slider` master at all; property names do not match |
| `TimePicker` | Date-Time Picker | `TimePicker`, `TimePicker / Item`, `TimePicker / Trigger` | **Present, unverified.** Predates the component; whether it expresses the 24-hour typed field is unchecked |
| `ListGroup` / `ListRow` | List | `List / Item` — a Material-style set of **200+ variants** (Condition × Leading × Trailing × State) | **Disagrees substantially.** The code takes a deliberately simpler position on what a row is |
| `Carousel` | Carousel | Five hardcoded `Slide N/Desktop` frames + Light/Dark control sets | **A mockup, not a component** |
| `FeedbackWidget` | Feedback Widget | `FeedbackWidget / Modal` + `.FeedbackEmojis` (five-point) | **A different product.** An emoji modal, against this component's Yes/No + comment, which is what GIGW asks for |
| `DescriptionList` | — | nothing | Genuinely absent |
| `Figure` | — | nothing | Genuinely absent |
| `TimeSlot` | — | nothing | Genuinely absent |
| `BiometricCapture` | — | nothing | Genuinely absent |

## Why this matters more than an empty page would

An empty page is a gap: everyone can see it and nobody is misled. A page holding
a component that **shares a name with the code and behaves differently** is the
condition this estate's own rules were written to prevent — a designer places
`popover`, a developer builds `Popover`, and neither discovers the disagreement
until a review.

The thirteen documentation pages have been corrected: the seven that falsely said
"master pending" now state what is actually on the page and how it differs. A
sentence naming the divergence is more use than a link to a master that is not
what the code does — which is why they still do not link.

## What has to happen next, in order

1. **Decide, per component, which side is right.** Four of the seven are
   decisions rather than drawing tasks: whether the estate's feedback control is
   an emoji modal or a Yes/No question, whether a list row carries 200 variants
   or 8, whether the menu is called Menu or Dropdown, and whether Popover keeps
   "Title" as an axis.
2. **Rebuild the agreed masters in the house style** — numbered sections, bound
   variables, a `— Documentation` frame and a `— Component record`, per
   `.claude/rules/ds-documentation-standard.md`.
3. **Create the four genuinely-absent pages**, and card them on the Index in the
   same session — `.claude/rules/figma-library-index.md` gates this, and
   `npm run check:figma-index:sync` re-captures the snapshot.
4. **Only then** write the Code Connect templates. A template pointing at a
   master that disagrees with the code publishes the disagreement.

None of this was attempted in this pass. A half-finished Figma restructure is
worse than none: the Index rule exists because this library went stale twice in
two days, and a rushed pass with pages added and no cards is exactly that failure.


---

# Second addendum, same day — the divergences were decided, and four were reconciled

The four genuine forks in the addendum above were put to the department and
answered. In every case the CODE's model was chosen, which is what
`.claude/rules/standards-precedence.md` would predict: quality first, then DBIM,
then GIGW, then UX4G — and each legacy master was a UX4G or Material import.

| Divergence | Decision | What was done |
|---|---|---|
| Feedback Widget — emoji modal vs Yes/No question | **Keep the Yes/No question** | Master rebuilt to the code's four states. `FeedbackWidget / Modal`, `.FeedbackEmojis` and its Button renamed `⛔ … (deprecated)` |
| Menu vs "Dropdown" | **Menu, and deprecate Dropdown** | Page renamed `Dropdown` → `Menu`; `Menu / Item` built (9 variants, Tone × State); the 84- and 7-variant imports deprecated |
| List — 200+ variants vs slots | **The slot model** | `List Row` built (9 variants, Kind × State); `List / Item` and `List` deprecated |
| Popover — legacy contract vs code | **Recreate the best, standards-based and reusable** | `Popover` built (12 variants, Side × Align) and, acting on "reusable in various use cases", the CODE gained an optional `title` |

**Nothing was deleted.** Every superseded master keeps its node, is renamed with a
`⛔` prefix, and carries a description saying what replaced it and why. Instances
of them exist in the handoff file and elsewhere; deleting a published master
breaks those silently, and a deprecation a designer can read is worth more than a
tidy library.

## The Popover title, and why the code changed rather than only the drawing

"Recreate the best based on standards, and reusable in various use cases" is not
satisfied by copying the code as it stood. The legacy set had a `Title` axis the
code had no answer for, and a heading is a real need — Carbon, Polaris and
Material all support one.

So `Popover` gained an optional `title`, and it earns its place twice: it is a
visible heading, and it becomes the panel's accessible name through
`aria-labelledby`. That is better than the invisible `label` it replaces, because
the string a screen reader announces is then the same string every other reader
can see, and the two cannot drift apart. `label` remains for a short passage of
guidance where a heading would be longer than the content; one of the two is
always required.

It is a `<p>`, not an `<h2>`: a popover can open anywhere on a page and cannot
know what heading level it would be nesting under, and a wrong level is worse for
someone navigating by headings than no heading at all.

## The three that were work rather than decisions — now done

| Component | What was found | What was done |
|---|---|---|
| `Slider` | The library had the two-thumb master and **no single-thumb slider at all**, with properties (Label / Left control / Right control) that match no API here | Page renamed `Range Slider` → `Slider`; `Slider` (4 variants) and `Range Slider` (2) built; the UX4G set deprecated |
| `TimePicker` | Verified, and it **did** diverge: a three-column scroller showing `00:00:00` — seconds the estate's schedules do not use | `Time Picker` built (Closed, Open, Error, Disabled) matching the typed 24-hour field; the scroller and its trigger deprecated |
| `Carousel` | Five hardcoded `Slide N/Desktop` frames — a mockup of one carousel | `Carousel / Controls` built (8 variants, Autoplay × Current); all nine mockup components deprecated |

The TimePicker call extends the principle the department set on the other four
rather than asking again: the code's model, standards first. It is flagged here
so it can be reversed if that reading was wrong.

**All thirteen components added in this work now link to a Figma master from
their documentation page.** None says "master pending", and none says "a master
exists and disagrees".

## What remains, precisely

| Item | State |
|---|---|
| Documentation frames | The **seven rebuilt** pages (Popover, Menu, List, Feedback Widget, Slider, Time Picker, Carousel) carry masters and rules-bearing descriptions but no `— Documentation` frame or `— Component record`, so their Index status is correctly `Published` rather than `Ready`. The four NEW pages have both. |
| Code Connect | No `*.figma.ts` template has been written for any of the thirteen. Each component record says so, and says why it should wait. |

The Index was recounted and re-synced in the same session, per
`.claude/rules/figma-library-index.md`: 71 content pages, 70 cards, both halves
of the gate green.

---

## Addendum 3 — the target, measured against itself (6 September 2026)

`docs/plans/ds-completeness-execution-prompt.md` states five conditions for v1.0.
Measured after this pass:

| # | Condition | State |
|---|---|---|
| 1 | UX4G component coverage ≥ 90 %, from an honestly re-reviewed map | **100 %** — 54 exact + 5 partial of 59. The map's eleven stale rows were re-checked against the barrel export by export, not renamed to pass. |
| 2 | Every pattern in §4 ships, or is recorded with the reason it does not | **Met** — 8 ship, 11 are recorded below |
| 3 | `check:shadow-ui` baseline strictly smaller than 38 | **37** |
| 4 | `npm run check` and `npm run ci` exit 0, no baseline loosened | **Met** — every baseline shrank or held |
| 5 | Every component added carries all nine parts of the contract | **Partially met** — see below |

### Condition 5, stated precisely

Twelve of the new components carry all nine parts. Five carry eight: `NumberInput`,
`SplitButton`, `BackToTop`, `BulkActionsBar` and `FileList` have no Figma master, so
they have no documentation frame and no Code Connect template either — parts 7, 8 and
9 all hang off the master. Each of their documentation pages says so where a reader
will see it, rather than leaving the absence to be discovered.

That is the honest state: **eight of nine on five components, nine of nine on twelve.**
The remaining work is one Figma pass, not five separate decisions.

### Condition 2 — the eight that ship

`Menu` · `SplitButton` · `DescriptionList` · `BulkActionsBar` · `FileList` ·
`NumberInput` · `BackToTop` · `LanguageSwitcher`.

### Condition 2 — the eleven that do not, and why

Each of these is a deliberate deferral with a stated reason, not an omission.

| Pattern | Why it is not built, and what has to happen first |
|---|---|
| **Date Range** | The highest-value one left. Deferred because the `DatePicker` set on the Date-Time Picker page predates the rebuild — its four variants are calendar sizes, not states, and it publishes no component properties. A range picker built on that inherits its shape. Re-author `DatePicker` first, then build the range on top. |
| **Comment Thread** | One of three views of the same object. |
| **Activity / Audit Log** | One of three views of the same object. |
| **Notification Centre** | One of three views of the same object. A comment, an audit entry and a notification are all *a dated, attributed event with a subject*. Building them separately produces three vocabularies for one thing, which is a Layer 5 defect this estate has recorded before. Build one `EventList` primitive, then compose all three from it — `ApprovalTimeline` already covers part of the ground and should be folded in rather than duplicated. |
| **Inline Edit** | Blocked on a product decision, not a design one: does a save commit optimistically or on confirmation? On a departmental record an optimistic save that fails silently is a data-integrity problem, and the design system must not pick that on the department's behalf. |
| **Tree** | APG's tree pattern needs a full roving-tabindex implementation with type-ahead over a nested structure. It serves three administrative screens. Build after the higher-traffic patterns, and budget for it properly rather than shipping a half-keyboard version. |
| **Transfer List** | Has no APG pattern at all, so its keyboard model has to be designed rather than adopted. Two screens need it. Same reasoning as Tree. |
| **Schedule / Calendar** | A month grid is a table with a date-semantics problem — what a cell means when it holds nothing, what a range across a month boundary announces. Needs its own spec before any code. |
| **Video Tile** | One screen (Garima Greh CCTV). A live-stream tile is mostly integration with whatever streams the feed; the design-system part of it is a `Figure` with a caption, which already ships. |
| **Signature Pad** | **Blocked on a legal answer, and must stay blocked.** WCAG 2.2 §2.5.7 requires a single-pointer alternative to drawing, and the obvious alternative — typing a name — is a question about what constitutes consent on a departmental form. The department decides that, not the design system. |
| **Cookie Consent** | **Not required today, and building it would be a defect.** The estate sets one cookie, the site gate's, which is strictly necessary and therefore exempt. A consent banner nobody needs is precisely what `ui-restraint-and-copy.md` bans. Build it in the change that introduces the first non-essential cookie — the corner rail already reserves its slot. |

### What this pass added after Addendum 2

- Documentation frames and component records for the seven rebuilt Figma pages, in
  the house style, with every stat counted from the file on the day.
- Seven Index cards raised from `Published` to `Ready` — status is derived from the
  page, and those pages now carry documentation — with each card's link repointed at
  its new frame. The Index's own claim that Popover had no implementation was corrected;
  it has had one since earlier in this branch.
- Twelve Code Connect templates, each with a recorded Figma fixture, so
  `check:code-connect` verifies rather than reports them.
- Two defects in `check:code-connect` itself, found by using it: it could not read a
  quoted enum key containing a bracket, so it called a mapped variant unmapped; and its
  extends-resolution only followed base interfaces whose names end in `Props`, so it
  reported four declared Slider props as undeclared. Both fixed; the gate was then
  broken deliberately to confirm it still fails.


---

## Addendum 4 — the patterns and the masters, both closed (6 September 2026)

### Condition 2 is now met by building, not by recording

All nineteen patterns from §4 ship from the barrel. The eleven that Addendum 3
recorded as deferred were built the same day:

`EventList` · `CommentThread` · `NotificationCentre` · `DateRangePicker` ·
`InlineEdit` · `Tree` · `TransferList` · `ScheduleGrid` · `VideoTile` ·
`SignaturePad` · `CookieConsent`.

Three of the deferrals turned out to be answerable rather than blocked, and the
answers are the interesting part:

| Recorded as | What it turned out to be |
|---|---|
| Comment Thread, Audit Log and Notification Centre are three components | **One object seen three ways.** `EventList` is the row; the other two compose it. There is no second row style, and their Figma pages are deliberately absent for the same reason. |
| Inline Edit is blocked on a product decision — optimistic or confirmed | **Confirmed, and not configurable.** An optimistic edit that reverts on failure is a data-integrity problem on a departmental record. |
| Signature Pad is blocked on a legal answer | **Still blocked, and now unavoidably so.** `declaration` is a required prop, so a form cannot ship without the Department writing down what is attested to; and the typed alternative cannot be switched off, because drawing is a drag. |

One deferral was wrong on its facts. The audit said the estate sets no optional
cookie and so should not have a `CookieConsent` at all — while the website has
been shipping its own hand-rolled banner throughout. The shadow-UI gate caught it
the moment the barrel gained the name. The component now tells a **notice** from
a **choice**, and the website's banner is that component rather than a copy of it.

### Condition 5 — fourteen Figma masters, and two deliberate absences

Every component that should have a master now has one, each on its own page with
a documentation frame and a component record, each carded on the Index with a
real preview and a status derived from the page:

`LanguageSwitcher` · `InlineEdit` · `EventList` · `NumberInput` · `SplitButton` ·
`BackToTop` · `BulkActionsBar` · `FileList` · `DateRangePicker` · `Tree` ·
`TransferList` · `ScheduleGrid` · `VideoTile` · `SignaturePad` · `CookieConsent`.

`CommentThread` and `NotificationCentre` have none, deliberately, and their web
pages say so with the reason rather than pointing at an audit.

The library went from 74 content pages to 86 and from 204 published components to
216. Fifty-three component pages now carry a documentation frame with an
arrangements section, against forty-one before this pass.

### What drawing the masters caught

Five divergences between the drawing and the running code, none of which an
inspection of either half alone would have found:

- the language links were not underlined at rest;
- the Event List action word was regular where the code sets it semibold;
- the Bulk Actions Bar's *Return for correction* had lost its warning tone;
- a File List specimen described a photograph as an income certificate;
- a Transfer List specimen claimed six mapped districts while drawing two.

### What is left

| Item | State |
|---|---|
| Code Connect templates for the fifteen new masters | Not written. Each component record says so. |
| Shadow UI | 37 collisions in 14 files. Three portals still ship their own Button, Card and Stepper. |
| `DatePicker` and `Button` sets | Both predate the rebuild, and two new masters draw their own halves rather than instancing them. Each record names the swap that should follow. |
| Whether the package may leave the monorepo | `private: true`. The department's call, not a technical one. |
