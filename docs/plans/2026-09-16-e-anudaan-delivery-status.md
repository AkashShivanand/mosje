# e-Anudaan — delivery status

**This file is the running answer to "what is done and what is left".** It is updated in the
same change that moves a line, never afterwards from memory. If a row says ✅ and the thing is
not true on `main`, that is a defect in this file and it is fixed first.

**Last moved:** 16 September 2026, after section 8 landed, the page was ordered, and the whole set was compared against today's build.

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
| P4 · Document Centre, Track & Correct, Project Records | 6, 7, 8 | 68 | ✅ desktop complete — **section 6 done** (12 frames, all ten row states matching §3.2) and **15 upload frames retrofitted** in sections 4 and 5 — the brief said twelve; the page had fifteen, because P2/P3 also drew 2nd- and 3rd-instalment steps. 126 Document Row instances. sections 7 and 8 redrawn, and a stale masthead repaired on 21 frames (a Digital India / SAMAVESH strip the build never had, and a missing bell — the source of 210 unbound fills and 830 unstyled text nodes). `NGO / Attendance Master` moved to Superseded: the portal redirects it to Attendance |
| P5 · Officer queues, registers and review | 9, 10 | 41 | ✅ **all seven items applied and checked by eye.** More Actions is the brand outlined control on all 11 frames; the certification block has its panel, its rule, its readable "Available once…" line and a legible button on all 4 ASO frames; the Section Officer's own summary values and the paler correction panel are on both frames; the two registers' Actions column is widened and both queues' search fills its row. Sanctioned Applications finished: the two invented columns removed, the reference stacked over its badge, "Payment Status" no longer clipped |
| P6 · Directory, PMU, Director, Superseded | 11, 12, 13, 15 | 26 | ✅ 1,610 nodes · 0 unbound · 0 placeholders |
| — | **The 375 phone column** — no phone frame drawn for any of the 68 | | ⏸ **deferred by the user, 16 Sep**: desktop first, so refinements can start and the desktop close quickly. Deferred, not cancelled |


| — | Page-level pass: sections ordered 1 → 15 | | ✅ they had been placed concurrently and three pairs overlapped. Now one left edge, 400px apart, no overlap. Three **pre-rebuild containers** (`NGO Applicant`, `Programme Division`, `Finance Division`) removed after verifying every one was empty at both levels — each frame had already been re-parented. Eleven stray fragments left on the page root by editing gathered into `Z · Stray nodes left by editing` rather than deleted |
| — | Re-record the Index snapshot | | ✅ `check:figma-index:sync` — already current, nothing to commit; `check:figma-index` passes |
| — | **Final visual verification** — every screen against the build | | ✅ **done and published.** 201 screens compared against a fresh capture of today's build: **197 identical on the first screenful, 1 genuinely different, 3 different only because the Figma draws a dialog open.** See §5 |

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

## 6. The junk-copy audit, 16 Sep 2026

The brief asked for junk copies "rewritten everywhere, like documentation" to be removed, and
for anything useless to be **discussed** rather than quietly dropped. Three surfaces were
searched; one was dirty.

| Surface | Result |
|---|---|
| The portal's own copy (page descriptions, subtitles, hints, empty states) | **Clean.** 57 distinct strings across the e-Anudaan screens, **none** repeated between files |
| The web documentation pages | **Clean enough.** 1,434 distinct strings across 403 pages, 22 repeated — and each repeat is specimen content legitimately shared between a component's page and its playground |
| The Figma documentation frames | **One real fault**, below |

**A sentence written for Button, pasted onto eight form components, where it was false.**
77 library pages carry 146 documentation and record frames; 73 sentences repeat across pages.
Almost all are section headings and standing captions, which are *supposed* to be identical —
"Open items only. Anything already fixed is not recorded here." is the record's own contract.

But one is prose, not a heading. `The React component has these props and Figma has no property
for them: …` is written correctly on Button, Icon Button, Button Group and Link — each naming
its own props. On **Checkbox, Radio, Input Field, Input Area, Select, OTP Input, Bot Check and
Selection Card** the same sentence was pasted verbatim, so all eight told a reader that the
component has `autoResize` and `onComplete`. `autoResize` belongs to Input Area alone;
`onComplete` to OTP Input alone. **Checkbox has neither.** That is worse than junk: it is
documentation that is wrong, on the surface `documentation-ds-linkage.md` calls the strictest
in the estate.

Each of the eight now names its own props, computed from the TypeScript type checker
(`props.generated.ts`, the source `check:props` gates) differenced against that master's own
`componentPropertyDefinitions` — not written by hand, so it cannot drift the same way again:

| Page | Now reads |
|---|---|
| Checkbox | cardLayout, defaultChecked, error, hideLabel, icon, indeterminate, labelPlacement, meta, readOnly, variant |
| Radio | cardLayout, defaultChecked, hideLabel, icon, labelPlacement, meta, readOnly, variant |
| Input Field | autoComplete, invalid, prefixLabel, status, suffixLabel |
| Input Area | autoResize, invalid, maxRows, status |
| Select | appearance, invalid, options, status |
| OTP Input | label, aria-describedby, autoFocus, disabled, invalid |
| Bot Check | helpHref, disabled, error, label |
| Selection Card | *"There is no SelectionCard component in code: this is Checkbox or Radio with `variant="card"`"* — because there isn't one |

Verified: the pasted sentence now appears **zero** times in the file.

---

## 5. Figma against the build — measured, 16 Sep 2026

The Figma was drawn from a capture taken on 16 September and `main` moved four times
afterwards, so "does the Figma match the build" could not be answered from those captures.
The portal was re-captured at 1440 (190 screens, 0 failures) and every frame put beside it.

| | |
|---|---|
| Screens compared | 209 |
| Identical on the first screenful | **197** |
| Dialogs, comparable for the first time | 8 |
| Genuinely different | **1** — Reports & Analytics, below |
| Different only because the Figma draws a dialog open over a screen the capture shows without one | 3 |

**The dialogs, once comparable, were wrong in three ways — all now fixed.** Every dialog's
width, x and y was read off the running build with `boundingBox()` rather than estimated:
show cause and inspection and the three Director confirmations are 448 wide, the printable
report 640, bulk verdict 384. Three faults came out of it:

1. **The three Director confirmations were 560 wide with their eight facts crammed at 16px a
   row and no rules** — a block of text where the build draws a list, on the last screen read
   before an irreversible decision. Now 448, divided, and carrying the close control they
   lacked entirely.
2. **The bulk-verdict dialog had grown a five-row read-back the build does not draw**, and its
   button read "Mark 18 as Verified" where the build reads "Mark as Verified". Removed: the
   handoff file describes what is built, and an addition with no build behind it is an
   instruction to build something nobody asked for.
3. **The printable report was drawn at its full 1,157px** and spilled 265px out of its own
   900px frame. The build caps it at 868 and scrolls inside; it is now drawn at the height a
   reader actually sees.

Measured effect: report 17.5 → out of the top ten · bulk verdict 14.7 → 11.0 · sanction
14.9 → 11.4 · return 15.3 → 12.1 · reject 13.7 → 11.6 · show cause 12.1 → 11.3.

**The one real non-dialog difference: a ranked bar chart whose bars cannot encode their values.**
`Ranked Bar Row` in SAMAVESH publishes only `Tone` and `Rank`, and its `fill` rectangle was
constrained `horizontal: SCALE` — so the fill keeps a fixed FRACTION of the track however
wide the instance is. Every bar in the estate draws ~86% full: Rajasthan's 218 the same
length as Maharashtra's 1,950, directly contradicting the figure printed beside it. **The
master is fixed** (fill anchored `MIN`, description says how to set a bar's length), but the
handoff file's instances keep the old definition **until SAMAVESH is published** — so the two
Reports frames still draw equal bars today. Re-run the width pass after the publish.

**No dialog had ever been captured — found, fixed, and the eight now verified.** Every
`review-dialog-*` file in both the 16 Sep run and the first re-capture was a 4,000px
full-page shot of the page behind, with no dim layer and no dialog on it. Two faults, and
the second is the one that let it go unnoticed for weeks:

1. the shot was taken `fullPage: true` while a modal is `position: fixed`, so it rendered
   over the first viewport of a very tall image and duplicated the sticky masthead half way
   down; and
2. **nothing asserted the dialog had opened**, so a file was written whatever happened.

`capture-dialogs.mjs` shoots the viewport and **refuses to write unless a dialog is actually
on screen**. It also fills the mandatory Remarks field first, which is why the Director's
sanction, return and reject confirmations could never open before — the code will not show
them until a reason is typed. All eight capture, and all eight are now in the comparison,
scoring 13-17%: real differences to look at, where before there was nothing to compare.

`ngo-inspection-meeting` is captured against an application id that is not in the seed
(`.../00207`; Barabanki is `.../00282`), so it renders "Application Not Found". The Figma
frame is more correct than the capture. Re-capture that slug.

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
| `Document Checklist` / `Document Checklist Group` | **Settled, 16 Sep: detaching is the intended use, and both masters now say so.** A checklist is a variable number of groups each holding a variable number of rows; that cannot be a Figma component without slots, `figma.createSlot` is not in this API, and a count axis does not rescue it — 4 body states × 6 group counts × 12 row counts is 288 variants and still misses cases. Both descriptions now tell the next person to detach the two containers and keep Document Row, Chip, Placement Tray / Item and History Sheet / Entry live, which is what the fifteen built screens already do |
| `Document Row` | Cannot express the row's display number or its required marker: the build draws `1.` in muted grey and `*` in red, but `Title` is one text node in one style, so both get baked into the string unstyled |
| `Document Row` | No `File name` or `Reason` property — only `File meta`; both have to be set by overriding nested text nodes |
| `Document Row` | File name and reason wrap; the build truncates to one line with an ellipsis |
| `Document Checklist` | Drop-zone copy is ordered label → formats → hint; the build is label → hint → formats |
| `Document Checklist` | "Choose Files" renders as a bordered button; the build renders a text link |
| `EmptyState` | No description slot — `Type=customize` is title plus button only, so a filtered-to-nothing explanation has nowhere to live |
| `SideSheet` | Fixed at 432 wide; the build's history sheet is about 495 and flush to the edge |
| `Table / Cell [Cell Type=Action]` | **Not a defect — disproved by test, 16 Sep.** Setting `Sub-type` in turn gives Filled → white label on the brand fill, Outlined → navy label no fill, Text → navy label no fill. The master honours it. What was hit was an override on the *instances* in the handoff file, which is why `resetOverrides()` appeared to cure it. The master's description now says so, so nobody re-reports it |
| `Search` | **Fixed 16 Sep.** Worse than reported: the eight variants stood **25, 20, 14, 6, 1, 1, 1, 1** px tall — collapsing progressively — while their contents are 56, so every instance in the estate reported children outside its bounds and the master could never sit correctly in a row. All eight now hug to 334×56, with 0 children outside. Awaiting publish |
| `Modal` | Publishes no content slot, so a confirmation dialog with a read-back facts list cannot be built from it |
| `Pagination` | **Fixed 16 Sep, and the report was right** — the build renders `Showing [10] 50 100 of N items`. The six `item control=true` variants now carry three chips built from the pager's own page chip, so both rows of numbers match, exactly one selected. A reader can see the choices without opening anything, which on a short register is the whole decision. Awaiting publish |
| `Ranked Bar Row` | **Fixed here, awaiting publish.** Published only `Tone` and `Rank`, with the fill constrained `SCALE`, so no instance could say how long its own bar was — every ranked bar in the estate drew the same length regardless of its number |
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
