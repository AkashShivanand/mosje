# e-Anudaan — delivery status

**This file is the running answer to "what is done and what is left".** It is updated in the
same change that moves a line, never afterwards from memory. If a row says ✅ and the thing is
not true on `main`, that is a defect in this file and it is fixed first.

**Last moved:** 16 September 2026, after six of P5's seven Figma items were applied and the seat's Figma allowance ran out again.

Status: ⬜ not started · 🟡 in progress · ✅ done · ⏸ waiting on a person · ❌ won't do (reason stated)

Two other trackers stay in force and are not repeated here:

- [`2026-09-13-e-anudaan-meeting-refinements.md`](./2026-09-13-e-anudaan-meeting-refinements.md) §1 —
  the 25 goals from the 11 September design review. **All 25 ✅** as of 14 Sep; that file records
  the five QA cycles behind them.
- [`2026-09-16-e-anudaan-document-centre.md`](./2026-09-16-e-anudaan-document-centre.md) §6 — the
  three decisions the Ministry owes on the upload step, and §6.1 the nine places the build
  deliberately departs from the live portal.

---

## 1. The portal

| # | Thing | Status | Where it stands |
|---|---|---|---|
| P-1 | AVYAY — application, renewal, instalment claims | ✅ | Eight steps on a new project (Justification appears once Case Type is "New project"), seven otherwise |
| P-2 | SHRESHTA Mode 2 | ✅ | |
| P-3 | SMILE | ✅ | No 3rd instalment — the release pattern has two |
| P-4 | NAPDDR | ✅ | |
| P-5 | Instalment claims, all schemes | ✅ | Derived from sanction and release history; one application ID per year; 4-step Confirm Details |
| P-6 | Document Centre — checklist, row, findings, placement tray, history sheet | ✅ | Built into four places. Design record: `2026-09-16-e-anudaan-document-centre.md` |
| P-7 | Officer desks — queues per seat, review, registers, queries, filters, reports, audit trail | ✅ | Ten queues, one per seat |
| P-8 | Programme Director and PMU field officer | ✅ | |
| P-9 | Review screen rework — Before You Forward, in-row verdicts, bulk verify, fund release, return to seat, show cause, inspection, printable report | ✅ | ASO page came down 6,119px → 4,003px |
| P-10 | Glossary — one term per concept | ✅ | `lib/e-anudaan/glossary.ts`, record in `2026-09-16-e-anudaan-glossary.md` |
| P-11 | Seed data self-consistent | ✅ | Invariant tests fail if a project's scheme, nature, instalment and attendance disagree |
| P-12 | Design-director audit | ✅ | 836 shots, 16 P1s, fixed in 8 batches |
| P-13 | DigiLocker removed from every portal login and the TG application form | ✅ | Now a per-portal, per-role switch in `lib/tg/identity.ts` |
| P-14 | Live on `main:3007` | ✅ | PR #507 merged 16 Sep. **Verified on the running server, not inferred from the merge:** 18 routes across 8 roles at 1440 and 375 — 36 page loads, no HTTP error, no page error, no sideways scroll; the divided-list assertion passes over 8 fact cards; the Payment Status order number re-checked by eye |

### Known, not fixed — carried deliberately

| Thing | Why it is still open |
|---|---|
| A renewal is recorded as the 1st instalment | The renewal pickers list illustrative projects with no sanctioned history in the seed |
| Some seed submission dates sit outside their financial year | Seed data, not logic |
| Hydration warning on the portal root | The UX4G accessibility widget writes `style="zoom:1"` before React hydrates — third-party markup we cannot annotate |
| PMU inspection report upload | Schedule and Record save to the store; there is no report upload |
| **The upload checklist numbers a group 8, 6, 7** | Found reviewing the Figma frames against the build. `documents-checklist.tsx` derives the row's number from one expression (`position`, line 126) and the row's place on the page from two others (`displayRank` line 312, `groups` line 423), so the number and the position disagree and a column of numbers reads out of order — which the comment above line 126 already says "reads as a mistake". The fix is to derive all three from ONE order, per `.claude/rules/data-state-completeness.md` §2. Parked, not lost |
| AVYAY and NAPDDR renewal pickers list projects "awaiting sanction" | The help text says only sanctioned, PMU-verified projects renew. **Both were transcribed from the live portal** — needs the department, see §4 |

---

## 2. The Figma handoff file

File `evmNmlK8g4VYwJVu2FwSGV`, E-Anudaan page `51313:165608`. Plan: `scratchpad/figma-2/plan/PLAN.md`.

| Part | Sections | Frames | Status |
|---|---|---|---|
| P1 · Access and the shell | 1, 2, 14 | 35 | ✅ |
| P2 · SHRESHTA Mode 2 and SMILE forms | 3, 4 | 45 | ✅ |
| P3 · AVYAY and NAPDDR forms | 5 | 55 | ✅ 1,689 library instances · 0 unbound · 0 placeholders · 0 overflows · 0 off-grid |
| P4 · Document Centre, Track & Correct, Project Records | 6, 7, 8 | 68 | 🟡 **section 6 done** (12 frames, all ten row states matching §3.2) and **15 upload frames retrofitted** in sections 4 and 5 — the brief said twelve; the page had fifteen, because P2/P3 also drew 2nd- and 3rd-instalment steps. 126 Document Row instances. **Stopped on the Figma quota.** See the remainder below |
| P5 · Officer queues, registers and review | 9, 10 | 41 | 🟡 **six of the seven items now applied and checked by eye.** More Actions is the brand outlined control on all 11 frames; the certification block has its panel, its rule, its readable "Available once…" line and a legible button on all 4 ASO frames; the Section Officer's own summary values and the paler correction panel are on both frames; the two registers' Actions column is widened and both queues' search fills its row. **Sanctioned Applications is half done** — see below |
| P6 · Directory, PMU, Director, Superseded | 11, 12, 13, 15 | 26 | ✅ 1,610 nodes · 0 unbound · 0 placeholders |
| — | **P4 remainder: the 375 column** — no phone frame drawn for any of the 68 | | ⬜ the largest single gap in the file |
| — | **P4 remainder: sections 7 and 8 bodies** — 20 of 22 frames still carry the pre-rebuild drawing | | ⬜ correctly named, placed and hugged, but the build has moved under them. **Three of them (`NGO / Application / Submitted`, `/ Released`, `NGO / Attendance Master / Populated`) are currently copies of their nearest sibling and will mislead anyone who opens them.** Each is flagged `REDRAW OUTSTANDING` in `p4/compare.html` |
| — | **P5 remainder: Sanctioned Applications (`52634:38067`)** | | 🟡 the frame had invented **two columns the build does not have** (Release, Order No.) — ten columns in 1092px, which is why the badge ran over its neighbour and Actions was clipped. Both removed and the remaining seven re-fitted. **Still wrong:** the project reference wraps to three lines because the case badge sits beside it where the build stacks it underneath, and "Payment Status" is clipped. The fix is written in the next row |
| — | The exact fix for the above | | ⬜ widths `[32,150,210,120,150,90,110,190]`, `project id cell` → `layoutMode = "VERTICAL"` with `counterAxisAlignItems = "MIN"` and its children HUG, and `clipsContent = false` on the action cell. Rolled back mid-write when the quota ran out |
| — | Page-level pass: stack sections 1 → 15 top to bottom | | ⬜ blocked until every part has landed; parts were placed concurrently and two landed on the same coordinates |
| — | Re-record the Index snapshot (`npm run check:figma-index:sync`) and commit | | ⬜ after the page-level pass |
| — | **Final visual verification** — every screen against the build, whole page logical and organised | | ⬜ the goal's closing requirement |

### The Figma seat quota is the binding constraint on all of this

`use_figma` returns *"You've reached the Figma MCP tool call limit for your Full seat on the
Organization plan"* after roughly 20–25 calls and recovers only after several minutes. The
allowance is **shared across everyone drawing at once**, so two helpers working in parallel
halve each other. Both P4 and P5 stopped on it rather than on difficulty, with their remaining
work fully specified.

Writes are atomic — a failed call rolls the whole script back — so nothing is ever left
half-applied, but it does mean a long batch that fails costs its whole cost for nothing. Batch
into as few calls as will survive.

---

## 3. The SAMAVESH library

| Thing | Status | Note |
|---|---|---|
| Six Document Centre masters built and published | ✅ | Verified by importing each key into the handoff file, not by looking at the library |
| Changed masters published — Metric Card 50, Event List / Row 20, ProgressBar 36, Checkbox, Input Field, Select, EmptyState, Portal Page Header, DataTable, WorklistScreen, Form / Panel | ✅ | |
| **Checkbox Group** | ⏸ | Built, **not published** — answers "not found" from the handoff file. Needs a publish |
| Gaps round 1 | ✅ | |
| Gaps round 2 — built: `Alert / Inline` (4 tones), `Stepper / Collapsed` (Steps 3–11); changed: Input Field, Select, Radio Group label wrapping, Form / Section Head note slot, Badge leading icon | ⏸ | Built locally, **not published** |
| Gaps round 2 — recorded, deliberately not built: Select read-only, Document Tile description, Selection Card chevron | ✅ | Each rejected with the code that settles it; reasons on the component records |

### Library defects found while drawing the screens — none fixed yet

Both helpers have now stopped, so nothing is drawing from these any more and they can be fixed.

**The first one is the important one.** `Document Checklist` and `Document Checklist Group`
publish **no slot**, and an instance's children cannot be added or removed — so a checklist of
any shape other than *one group of four rows* cannot be composed. P4 had to **detach both
wrappers in all fifteen retrofitted frames**; only `Document Row`, `Chip`,
`Document Placement Tray / Item` and `Document History Sheet / Entry` stayed live instances.
Adding a `Groups` slot to Document Checklist and a `Rows` slot to Document Checklist Group is the
single change that would make the component usable as published — and it was published only
today, so it is worth doing before anyone else builds on it.

| Master | Defect |
|---|---|
| `Document Checklist` / `Document Checklist Group` | No slot; instance children cannot be added or removed. Both must be detached to draw any real checklist — see above |
| `Document Row` | Cannot express the row's display number or its required marker: the build draws `1.` in muted grey and `*` in red, but `Title` is one text node in one style, so both get baked into the string unstyled |
| `Document Row` | No `File name` or `Reason` property — only `File meta`; both have to be set by overriding nested text nodes |
| `Document Row` | File name and reason wrap; the build truncates to one line with an ellipsis |
| `Document Checklist` | Drop-zone copy is ordered label → formats → hint; the build is label → hint → formats |
| `Document Checklist` | "Choose Files" renders as a bordered button; the build renders a text link |
| `EmptyState` | No description slot — `Type=customize` is title plus button only, so a filtered-to-nothing explanation has nowhere to live |
| `SideSheet` | Fixed at 432 wide; the build's history sheet is about 495 and flush to the edge |
| `Table / Cell [Cell Type=Action]` | Its nested Button carries a baked fill override bound to a brand colour, so the button ignores its own `Sub-type` and renders solid navy whatever is set. Every action cell needs `resetOverrides()` on the nested Button first |
| `Search` | The component box is 25px tall while its inner trailing-icon frames are 48×56, so every instance reports children outside its bounds |
| `Modal` | Publishes no content slot, so a confirmation dialog with a read-back facts list cannot be built from it |
| `Pagination` | Its page-size control is a Select showing one value; the build renders three chips (10 / 50 / 100) |
| `Menu / Item` | No way to set its icon glyph — no INSTANCE_SWAP property, and the nested glyph is not writable |
| `Navbar/Portal` | Draws Digital India and SAMAVESH co-branding that `SiteHeader variant="portal"` does not; hidden by override on every frame that uses it |

### Recorded, not built

`DecisionPanel` template · StatusScreen master redraw · donut with six slices · Accordion
card-variant rebuild · Documentation frames for the Alerts/Toasts and Badge pages (neither has
ever had one).

---

## 4. Questions for the Ministry and the vendor

None of these is a blocker; each is a place where the build follows the live portal and the live
portal is unclear or self-contradictory.

| # | Question |
|---|---|
| Q-1 | How long does an applicant have to answer a deficiency? |
| Q-2 | Who sanctions SHRESHTA — the Programme Director, or a different authority? |
| Q-3 | Which documents are required for a 2nd and 3rd instalment claim, as against a new application? |
| Q-4 | AVYAY: is the release 40-40-20, or half-yearly? The portal says both in different places |
| Q-5 | SMILE: a UAT capture is needed; the recording did not cover it |
| Q-6 | NAPDDR: what are the coordinates, scores and SLCA fields for, and who fills them? |
| Q-7 | SHRESHTA: what does "Status of Institution" mean on the officer's screen? |
| Q-8 | Should the beneficiary count come from the roster, or be typed? |
| Q-9 | DBIM: the phone masthead deviates from the published pattern. Confirm the deviation is accepted |
| Q-10 | The three Document Centre decisions — `2026-09-16-e-anudaan-document-centre.md` §6 |
| Q-11 | Renewal pickers list projects "awaiting sanction" against help text saying only sanctioned, PMU-verified projects renew. Which is right? |

---

## 5. How to move a line in this file

1. Do the thing.
2. Move its row in the same commit, and say where it stands — not just the tick.
3. If it turned out to be something else, rewrite the row rather than adding a second one.
4. A row that goes ⏸ names the person or the decision it waits on.
