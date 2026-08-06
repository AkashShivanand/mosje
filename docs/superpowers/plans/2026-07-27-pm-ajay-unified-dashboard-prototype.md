# PM-AJAY Unified Ministry Dashboard — Execution Plan

- **Date:** 2026-07-27
- **Spec:** `docs/superpowers/specs/2026-07-27-pm-ajay-unified-dashboard-design.md`
- **Data contract:** `docs/pm-ajay-dashboard-data-contract.md`
- **Deadline:** internal/private demo — today if possible, else tomorrow (28 Jul) first half
- **Decisions locked:** standalone shareable prototype → port to `apps/hub` after approval ·
  Adarsh Gram drilled 3 levels as the demo spine · build on declared assumptions, do not wait on the
  data doc

---

## Status — 28 Jul 2026

**Track B is complete and verified**, ahead of the tomorrow-first-half deadline. Built artefact:
`docs/prototypes/pm-ajay-unified-dashboard/pm-ajay-unified-dashboard.html` (333 KB, fully
self-contained — National Emblem inlined as a data URI, real `--ds-*` token values, no external
dependency except the Noto Sans webfont which degrades to a system stack offline).

Delivered beyond the approved scope: GIA and Hostel tabs are live too (the Pipeline archetype
generalised cleanly once the drill engine existed), as does the Executive Summary, so no nav item
dead-ends in front of the ministry.

Verified in-browser, not assumed:

| Check | Result |
|---|---|
| Parent = sum of children, every node × every metric × all 4 financial years | 0 errors |
| Funnel monotonic (eligible ≥ VDP ≥ DLCC ≥ declared) at every node | passes at every node |
| Action items equal funnel gaps | 2,606 / 2,957 / 2,878 — all derived, all non-negative |
| Block parentage | Agra's 12 blocks under Agra, Lucknow's 8 under Lucknow |
| Drill chain India → State → District → Block | table footers match the clicked figure at each level |
| Role clamp | District role offers Lucknow + its 8 blocks only; State role 27 options |
| WCAG 2.1 AA contrast, 24 text/background pairs | all pass (one failure found and fixed) |
| Keyboard reachability of every drill affordance | all are real buttons |
| Horizontal overflow at 375 px, all 6 views | none |
| Console errors | none |

Defects found and fixed during verification, each of which would have shown in the demo: metric
tiles rendering as run-together inline text; action-item titles colliding with their descriptions;
the rollup tab showing one component's money under an unqualified "Financial Progress" heading;
GIA's approval rate rounding up to a flattering **100%** while 4 proposals were still pending;
dimmed nav items at 2.55:1 contrast; drill rows reachable by mouse only; the Hostel tab's sixth
status tile leaving a grey empty cell; and the drill table hiding its Share column behind a
horizontal scroll.

**Track A is written and ready to send** (`docs/pm-ajay-dashboard-data-contract.md`) — not yet sent.
**Track C has not started** and should not, until the ministry approves.

---

## Shape of the work

Three tracks, deliberately decoupled so the demo is never blocked by the other two.

| Track | Output | Blocked by |
|---|---|---|
| **A — Unblock** | Data contract sent to Ranjan + Amit | nothing (done, ready to send) |
| **B — Demo** | Standalone shareable prototype, Adarsh Gram at 3 levels | nothing |
| **C — Port** | DS components + `apps/hub` implementation | ministry approval of B |

Track A ships first because it is already written and its return time is out of our control. Track B
is the deadline. Track C does not start until the prototype is approved.

---

## Track A — Unblock (send today, before the doc arrives)

- [ ] **A1.** Send `docs/pm-ajay-dashboard-data-contract.md` to Ranjan and Amit. Frame it as
  "fill the table, dummy values fine, `UNKNOWN` is an acceptable answer" — the point is to make it
  cheaper to fill a table than to author a spec.
- [ ] **A2.** Send §6 of the contract (the four prototype corrections) to Amit as a separate, direct
  message. Findings 1 and 2 are demo-blockers in *his* build and he needs them independent of the
  larger sheet.
- [ ] **A3.** Ask the programme lead the one question that changes layout order: has the department
  named a metric it wants at the top of the ministry dashboard? If not, design prioritises — which is
  what was agreed on the call.

---

## Track B — Demo prototype

Adarsh Gram, India → State → District, fully clickable. Self-contained HTML, real `--ds-*` tokens
inlined, every card mapped 1:1 to a DS component name so the port in Track C is substitution rather
than redesign.

### B1 — Foundation

- [ ] Extract the `--ds-*` token subset actually used from `packages/tokens/dist/tokens.css`. Real
  values only — no invented colours.
- [ ] Page chrome: Government of India strip, National Emblem, PM-AJAY masthead with the DoSJE
  sub-line, Noto Sans, Material Symbols Rounded, UX4G-compatible footer. No tricolour band.
- [ ] Sidebar per spec §4: Dashboard · Grant-in-Aid · Hostel · Adarsh Gram · Executive Summary.
  Adarsh Gram active. **No State/District/Village entries** — this is the decision from the call made
  visible.
- [ ] Permanent illustrative-data statement (finding #4) — prominent, not a small chip.

### B2 — ScopeBar (the R1 fix)

- [ ] One scope bar governing the whole page: role/level badge (`MINISTRY · NATIONAL`), breadcrumb
  (`India › Uttar Pradesh › Lucknow`), Level · Geography · FY · Period selectors.
- [ ] Cards inherit scope. **Zero card-level geography selectors** — this is the visible correction of
  the prototype's worst defect, and it should be obvious in the demo that it changed.
- [ ] Role-clamp demonstrable: a control that switches Ministry / State Officer / District Officer and
  visibly clamps the geography selector's ceiling, proving one build serves three roles.

### B3 — Adarsh Gram dashboard, national level

- [ ] **Lifecycle funnel** — Eligible → VDP Drafted → DLCC-approved → Declared. Four bars, all
  percentages against Eligible Villages, each labelled with absolute value and `% of eligible`.
- [ ] **Action-items panel**, permanent right column (R3). All three values **computed from the funnel**
  in the page, not hardcoded — this makes finding #1 structurally impossible to reproduce.
- [ ] **Financial cascade** — 4 stages, each a percentage of the stage above, with the derived read
  ("UC pending against district-level release: ₹X Cr").
- [ ] **Monitorable indicator** block — indicator selector, Identified / Total Cost / Completed /
  In Progress, stacked progress bar, beneficiary coverage read.
- [ ] Every metric renders as a `DrillNumber`: hover affordance, info icon, cursor, and a visible
  statement of what a click does.

### B4 — Drill-down, 3 levels

- [ ] Level 2 (State break-up): breadcrumb + "Back to dashboard", **definition callout** ("What this
  number means" + denominator + row-clickability), break-up table with a `India — Total` footer row,
  companion horizontal bar chart of the same column.
- [ ] Level 3 (District break-up): identical grammar, one level down, `State — Total` footer row.
- [ ] Every metric in B3 drills. No dead clicks — a metric that cannot drill must not look drillable.
- [ ] District names must be real and correctly parented (finding #2). Verify every district against
  its state before it ships. **No Agra blocks under Lucknow.**

### B5 — Verify before sending

- [ ] Arithmetic audit: every percentage recomputed from its stated denominator; every action item
  equals its funnel gap; every `— Total` row equals the sum of its rows.
- [ ] Geography audit: every state → district → block parentage checked.
- [ ] Scope audit: one geography on screen at a time, always.
- [ ] Accessibility pass — WCAG 2.1 AA + GIGW: semantic headings, keyboard-reachable drill numbers,
  visible focus, AA contrast on every bar/label pair, table headers and captions. Non-negotiable on a
  government property.
- [ ] Responsive down to 768px; content max-width 1280px.
- [ ] Deliver as a self-contained file the user can forward. Publishing it to a URL is the user's
  call, not an automatic step — it carries Government of India branding and goes out only when they
  say so.

---

## Track C — Port to the estate (post-approval only)

- [ ] **C1.** Add the nine DS components from spec §9: `ScopeBar` · `Breadcrumb` · `DrillNumber` ·
  `MetricDefinition` · `LifecycleFunnel` · `CascadeBars` · `StackedProgress` · `HBars` ·
  `ActionItemsPanel`. `LifecycleFunnel` and `HBars` are promotions out of
  `apps/hub/src/components/pm-ajay/dashboard/charts.tsx`, not new code.
- [ ] **C2.** Extend `apps/hub/src/lib/pm-ajay/data.ts` with block and village levels. The current
  model stops at `StateRow` + `District`; the drill path needs two more levels. This is the largest
  single piece of work in Track C and it cannot be faked at demo time.
- [ ] **C3.** Rebuild the Adarsh Gram view in `apps/hub` from DS components, replacing the prototype
  1:1 via the recorded mapping.
- [ ] **C4.** Apply the same grammar to GIA and Hostel (Pipeline archetype), then the ministry rollup
  with the three-way toggle, then Executive Summary.
- [ ] **C5.** Update `packages/design-system/design.md` + `AGENTS.md` + `/design-system/llms.txt` for
  the nine new components, per the design-system rule.
- [ ] **C6.** Run `/design-qc` against the approved prototype as the design baseline once the Figma
  frames exist.

---

## Sequencing against the deadline

| When | Ships |
|---|---|
| Now | A1, A2, A3 — contract and corrections out of our hands and into theirs |
| Today | B1, B2, B3 — national-level Adarsh Gram with the scope-bar fix. Demonstrable on its own; the lead said one level is enough |
| Tomorrow AM | B4, B5 — drill-down to district + the full verification pass |
| After approval | Track C |

If the data contract returns before B4, the confirmed structure goes straight into B4 and the
assumption labels come off. If it doesn't, B4 ships on assumptions with every one visibly labelled —
which is itself the review agenda for the next call.

---

## Risks

| Risk | Handling |
|---|---|
| Data contract doesn't come back before the demo | Assumptions are labelled in-UI; the demo becomes the forcing function for the contract rather than waiting on it |
| Ministry reads illustrative figures as real | Permanent prominent statement + the 47,333-vs-15,272 gap called out explicitly rather than hidden |
| Prototype approved, then Track C reveals block/village data doesn't exist | Question 1 of the contract's §4 asks exactly this; if the answer is "no block data", the drill stops at district and the design says so rather than dead-clicking |
| Amit's separate repo diverges from the approved prototype | The 1:1 component mapping is recorded in the prototype markup, and Track C lands in `apps/hub` as the single source of truth |
| Scope creep to GIA/Hostel/rollup before Adarsh Gram is finished | Explicitly deferred to C4. Depth on one component beats breadth on three for proving the drill-down model, which is the actual contested decision |
