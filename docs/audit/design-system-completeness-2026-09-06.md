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
