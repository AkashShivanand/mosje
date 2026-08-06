# PM-AJAY Unified Ministry Dashboard — Design Spec

- **Date:** 2026-07-27
- **Author:** Akash Shivanand (Creative Director, SAMAVESH)
- **Source:** Design review call, 27 Jul 2026, 13:19–13:35 IST (`pug-tajs-fid`)
- **Participants:** Sudhanshu (programme lead), Akash Kumar (design), Amit Nautiyal (dev), Ranjan Mondal (BA/dev), Rohit Kumar, Swati Kaushal
- **Status:** Approved direction, pending data contract

---

## 1. Problem

PM-AJAY's Ministry/Admin dashboard on the live portal (`pmajay.gov.in`, UX4G/NeGD stack) renders
**tiles only**. There is no visualisation, no comparison, and no route from a national number to the
state, district or block behind it.

Live production state, as captured on the call:

| Component | Tiles rendered |
|---|---|
| GIA | Total Projects 8,773 · Pending 4 · Rejected 0 · Returned 0 · Approved Proposals 8,769 |
| Hostel | Total Proposals 1,727 · Pending 136 · Rejected 78 · Returned 0 · Approved Projects 895 · Legacy 618 |
| AdarshGram | States covered 26 · Districts covered 597 · Villages covered 47,333 |

Filters present: *Project Created in Financial Year*, *Type of Intervention* (GIA); *Financial Year*
(Hostel). AdarshGram has a "View More »" link and no filters.

A prototype already exists — a claude.ai artifact titled *"PM-AJAY · Unified Dashboard (Prototype)"*,
re-hosted at `localhost:5173/admin/unified-dashboard` in `pmAjay-portal-frontend`. It adds two sidebar
entries, **Unified Monitoring** and **Executive Summary**, and is materially further along than the
call implied: it has a scope bar, a working GIA/Hostel/Adarsh Gram tab toggle, an Adarsh Gram
lifecycle funnel, an action-items panel, a financial cascade, a monitorable-indicator block, and a
click-a-number → definition + state-wise table drill-down.

The gap is therefore **not** "design this from zero". It is: the prototype's information architecture
is unresolved, its data definitions do not exist, and four of its numbers are wrong.

## 2. Decisions taken on the call

### 2.1 Nesting versus filtering — resolved

The programme lead proposed splitting the sidebar's **Dashboard** item three ways —
*State / District / Village* — in addition to a GIA / Hostel / Adarsh Gram toggle.

This was rejected on the call and the rejection was confirmed back by the lead. **Geographic level is
a filter, not a navigation axis.** Two levels of nesting is the ceiling:

- **Nesting axis** = subject. One combined rollup dashboard + three module dashboards (GIA, Hostel,
  Adarsh Gram).
- **Filter axis** = geography. Every dashboard carries level filters, clamped by the signed-in role.

Rationale recorded on the call: the parameters are identical at every level — only the values change —
so a level is a range selection, and range selections belong in a filter, not in the nav tree. A
sidebar split would have produced 3 × 3 = 9 nav destinations for what is one screen with a filter.

### 2.2 Role clamp

| Role | Starts at | May drill to |
|---|---|---|
| Ministry / Admin | India (national) | State → District → Block/Village |
| State Nodal Officer | its own State | District → Village |
| District Officer | its own District | Village |

One build serves all three. The role does not change the components, the card grammar, or the
metrics — only the starting scope and the ceiling of the geography selector.

### 2.3 The data gate

The design lead stated three times that layout cannot be authored before the data structure is known —
not the values, but the **shape**: which dimensions each metric varies by, what sits on each axis,
whether progress is year-on-year or month-on-month, and how many axes a comparison needs (minimum
three: one shared, two compared). KPIs are the summary row of a dataset; layout follows from KPIs.
Dummy values are acceptable, an undefined structure is not.

Agreed action: Ranjan and Amit to produce a single doc of KPIs and data structure for all three
components. **Resolution adopted in this spec:** design authors the contract (§6) and proceeds on a
declared assumption register (§7) rather than blocking. Assumptions become the review agenda.

## 3. Creative direction

> **PM-AJAY's ministry dashboard is not a scoreboard, it is a worklist. Every number is a door: it
> tells you what it means, who is behind it, and what is stuck.**

Six rules. These are binding on every screen in this programme.

**R1 — One scope, one page.** A single persistent scope bar (Level · Geography · Financial Year ·
Period) governs the entire page. Cards inherit scope and may never override it.
*The current prototype violates this*: the page header reads `All States — National`, while
Monitoring Indicator Progress independently reads `West Bengal` and Financial Progress reads
`Rajasthan`. Three different geographies on one screen, presented as one view. This is the single most
serious design defect in the prototype and will be caught in a ministry demo.

**R2 — Sidebar is subject, scope bar is level.** Nav: Dashboard (rollup) · Grant-in-Aid · Hostel ·
Adarsh Gram · Executive Summary. Never State/District/Village in the nav.

**R3 — Pendency gets equal billing with progress.** 8,769 approved proposals is not the story. The 4
pending, the 2,878 villages with no VDP, the ₹151.24 Cr of unsubmitted UC — that is the story. The
action-items panel is a permanent right-hand column on every module dashboard, not a footnote. The
prototype already gestures at this; this spec makes it a rule.

**R4 — Every number is defined.** No metric ships without one plain-English sentence of definition and
an explicit denominator. The prototype's "What this number means" callout becomes a mandatory pattern.

**R5 — Three components, four card grammars. Do not force symmetry.** GIA and Hostel are approval
*pipelines*; Adarsh Gram is a village *lifecycle* plus convergence *indicators*; money is a *cascade*
in all three. Four archetypes, reused everywhere:

| Archetype | Shape | Used by |
|---|---|---|
| **Pipeline** | status bifurcation → stacked split → approval rate → ageing | GIA, Hostel |
| **Lifecycle** | monotonically-decreasing funnel, each stage % of a fixed denominator | Adarsh Gram |
| **Cascade** | sanction → release → release → utilisation, each % of the stage above | all three |
| **Indicator** | selected monitorable indicator → identified/completed/in-progress/pending + cost + beneficiary coverage | Adarsh Gram |

**R6 — The rollup is derived, not authored.** The combined ministry dashboard is the three module
dashboards summed, plus one cross-component comparison strip. If a number cannot be derived from a
module dashboard, it does not belong on the rollup.

## 4. Information architecture

```
Dashboard  (Ministry rollup)          3 components side by side + cross-component compare strip
├─ Grant-in-Aid (GIA)                 Pipeline + Cascade
├─ Hostel                             Pipeline + Cascade + Capacity (seats / occupancy)
└─ Adarsh Gram (PMAGY)                Lifecycle + Indicator + Cascade
Executive Summary                     one printable screen, Secretary-level

Scope bar (persistent, role-clamped)
  [ROLE · LEVEL badge]  India › State › District › Block     Level ▾  Geography ▾  FY ▾  Period ▾

Drill path
  India → State → District → Block/Village
  Entered by clicking any number. Exited by breadcrumb or "Back to dashboard".
```

The component toggle (GIA / Hostel / Adarsh Gram) is a tab set on the rollup, and is what the
programme lead asked for. It swaps the card set, not the scope.

## 5. Card grammar

Every card is one of the four archetypes in R5, and every archetype is built from the same six parts:

1. **Title + one-line purpose.** "Financial Progress / Sanction → release cascade → utilisation".
2. **Metric row.** 3–5 numbers, each a `DrillNumber` — clickable, with an info affordance.
3. **Proportional bars.** Horizontal, sharing one denominator, each labelled with its absolute value
   and its percentage *of the named denominator*.
4. **Derived read.** One sentence of arithmetic the reader would otherwise do themselves —
   "UC pending against district-level release: ₹151.24 Cr".
5. **Drill instruction.** One sentence naming what a click does and what level it reaches.
6. **Scope inheritance.** No card-level geography selector (R1).

Drill-down target screen: scope badge + breadcrumb, a **definition callout** ("What this number
means" + denominator + row-clickability), a break-up table for the next level down with a
`— Total` footer row, and a companion horizontal bar chart of the same column. Rows clickable to
descend one further level.

## 6. Data contract

The blocking dependency from §2.3 is discharged by `docs/pm-ajay-dashboard-data-contract.md` — a
fill-in sheet, one table per component, requesting per metric: name, plain definition, type,
**denominator**, dimensions, lowest available geographic level, comparison axis, source table/API, and
three sample rows in the real shape. Denominator and lowest-available-level are the two fields that
are always omitted and always block layout.

## 7. Assumption register

Design proceeds on these. Each is either confirmed or corrected by the returned contract; every one is
labelled in the prototype UI.

### A. Adarsh Gram (PMAGY) — the demo spine

- **A1 Geography** — 4 levels: India → State → District → Village (Gram Panchayat).
- **A2 Lifecycle** — 4 monotonically-decreasing village counts, all percentages taken against
  **Eligible Villages** as a fixed denominator:
  `Eligible Villages → VDP Drafted → DLCC-approved VDP → Declared Adarsh Gram`
- **A3 Eligibility rule** — SC population ≥ 50% and ≥ 500 persons. Stated in the definition callout;
  to be confirmed against scheme guidelines.
- **A4 Action items are derived, not supplied** — each is the gap between two adjacent lifecycle
  stages, so they cannot contradict the funnel:
  - VDP Not Generated = Eligible − VDP Drafted
  - DLCC Approval Pending = VDP Drafted − DLCC-approved
  - Approved, Not Declared = DLCC-approved − Declared
- **A5 Monitorable indicators** — indicator × geography × status, statuses being
  Identified / Completed / In Progress / Pending, plus identified cost (₹ Cr) and a beneficiary
  coverage pair (covered / total). One indicator selected at a time.
- **A6 Financial cascade** — 4 stages, each a percentage of the stage above:
  `Mother Sanction Issued → Released: State→District → Released: District→GP → UC Submitted by State`.
  Amounts in ₹ Cr, varying by geography × FY.

### B. GIA and Hostel

- **B1** Status bifurcation is a pipeline: Total → Pending / Returned / Rejected / Approved, with
  Total as denominator and approval rate = Approved ÷ Total.
- **B2** Hostel carries Legacy Proposals as a distinct status, and adds a capacity dimension (sanctioned
  seats, occupancy) that GIA does not have.
- **B3** Lowest geography for both is Block. Village-level GIA/Hostel data is assumed unavailable.

### C. Cross-cutting

- **C1** Financial Year is the primary time dimension; month-on-month is out of scope for v1 until the
  contract confirms monthly capture exists.
- **C2** All prototype figures are illustrative and are **not** reconciled against production.

## 8. Data-integrity findings in the existing prototype

All four must be fixed before the prototype is shown to anyone, dummy data notwithstanding.

| # | Severity | Finding |
|---|---|---|
| 1 | **Blocker** | "Eligible, Not Declared — 1,631 (11% of eligible villages)" does not derive from its own funnel. With Eligible 15,272 / DLCC-approved 9,233 / Declared 6,310, the value must be 8,962 (59%) against Eligible, or 2,923 (19%) against DLCC-approved. 1,631 is arithmetically unreachable. The other two action items *do* derive correctly (15,272 − 12,394 = 2,878 ✓; 12,394 − 9,233 = 3,161 ✓), which makes the third read as a transcription error and is exactly the kind of inconsistency a scheme officer checks first. |
| 2 | **Blocker** | "Block Spread — GIA projects across **Lucknow** — top blocks" lists Jagner, Saiyan, Pinahat, Shamsabad, Khandauli, Achhnera. Those are **Agra** district blocks. Anyone from UP identifies this immediately and the prototype loses credibility wholesale. |
| 3 | **Major** | Scope incoherence — three different geographies presented as one view (R1). |
| 4 | **Major** | Order-of-magnitude mismatch against production: the live portal reports 47,333 villages covered; the prototype's funnel starts from 15,272 eligible villages. Either the definitions differ (covered ≠ eligible) or the dummy data is off by ~3×. Needs an explicit, prominent "illustrative — not reconciled with production" statement, not the current small chip. |

## 9. Design-system audit

Per the DS-first rule, screens compose from `@mosje/design-system`. Audit against the current barrel:

**Existing — import, do not rebuild:** `MetricCard` · `KpiRow` · `DashboardGrid` · `ChartCard` ·
`FilterBar` · `DataTable` · `Tabs` · `Card` · `Badge` · `Alert` · `Select` · `Sidebar` · `Footer`

**To add to the DS:**

| Component | Note |
|---|---|
| `ScopeBar` | Level + geography + FY + period + role badge + breadcrumb. Specialises `FilterBar`. |
| `Breadcrumb` | Not currently in the DS. Needed by every drill-down. |
| `DrillNumber` | Clickable metric with info affordance. Extends `MetricCard`. |
| `MetricDefinition` | The "What this number means" callout. May specialise `Alert`. |
| `LifecycleFunnel` | Promote `Funnel` from `apps/hub/src/components/pm-ajay/dashboard/charts.tsx`. |
| `CascadeBars` | Sanction → release → utilisation. New. |
| `StackedProgress` | Completed / In Progress / Pending single bar. New. |
| `HBars` | Promote from the same `charts.tsx`. |
| `ActionItemsPanel` | Pendency column (R3). New. |

Nine promotions/additions. Every one is needed by NHAPOA, TG and SMILE-Admin MIS work too, which is
why they belong in the DS rather than in the portal.

## 10. Existing code position

`apps/hub` already carries a PM-AJAY MIS dashboard:

- `apps/hub/src/components/pm-ajay/dashboard/` — `views.tsx` (730 lines: Executive, Financial, GIA,
  Hostel, Adarsh, Governance), `charts.tsx` (557 lines: Sparkline, Donut, HBars, VBars, LineArea,
  Funnel, Legend), `ui.tsx`, `dashboard-app.tsx`, `unified-app.tsx`
- `apps/hub/src/lib/pm-ajay/data.ts` — synthetic FY 2025-26 model

**The concrete gap:** the data model stops at `StateRow` + `District`. There is no block or village
level, and the drill path in §4 requires both. pm-ajay is Tailwind-free by design and uses `--ds-*`
custom properties directly; that constraint holds.

## 11. Prototype delivery constraint

The approved vehicle is a **standalone, self-contained, shareable prototype** for ministry review,
promoted into `apps/hub` after approval. A self-contained file cannot import DS components. To keep
the DS-first rule meaningful and make the later port mechanical:

1. The prototype inlines the **DS token subset** from `packages/tokens/dist/tokens.css` — real
   `--ds-*` values, no invented colours.
2. Every card in the prototype maps 1:1 to a named component in §9, and the mapping is recorded in
   the markup so the port is a substitution rather than a re-design.
3. Noto Sans, Material Symbols Rounded, National Emblem, no tricolour band — estate rules apply
   unchanged.
4. The prototype carries a permanent, prominent illustrative-data statement (finding #4).

## 12. Out of scope for v1

- Month-on-month trends (C1)
- Governance & Compliance module redesign
- The mobile-app API track (Ranjan → NIC), which is a parallel workstream from the same call
- Reconciliation of prototype figures against production data
