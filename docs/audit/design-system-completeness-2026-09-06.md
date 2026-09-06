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
