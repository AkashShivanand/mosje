# e-Anudaan — delivery status

**This file is the running answer to "what is done and what is left".** It is updated in the
same change that moves a line, never afterwards from memory. If a row says ✅ and the thing is
not true on `main`, that is a defect in this file and it is fixed first.

**Last moved:** 16 September 2026, after PR #507.

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
| P-14 | Live on `main:3007` | ✅ | Through PR #507 |

### Known, not fixed — carried deliberately

| Thing | Why it is still open |
|---|---|
| A renewal is recorded as the 1st instalment | The renewal pickers list illustrative projects with no sanctioned history in the seed |
| Some seed submission dates sit outside their financial year | Seed data, not logic |
| Hydration warning on the portal root | The UX4G accessibility widget writes `style="zoom:1"` before React hydrates — third-party markup we cannot annotate |
| PMU inspection report upload | Schedule and Record save to the store; there is no report upload |
| AVYAY and NAPDDR renewal pickers list projects "awaiting sanction" | The help text says only sanctioned, PMU-verified projects renew. **Both were transcribed from the live portal** — needs the department, see §4 |

---

## 2. The Figma handoff file

File `evmNmlK8g4VYwJVu2FwSGV`, E-Anudaan page `51313:165608`. Plan: `scratchpad/figma-2/plan/PLAN.md`.

| Part | Sections | Frames | Status |
|---|---|---|---|
| P1 · Access and the shell | 1, 2, 14 | 35 | ✅ |
| P2 · SHRESHTA Mode 2 and SMILE forms | 3, 4 | 45 | ✅ |
| P3 · AVYAY and NAPDDR forms | 5 | 55 | ✅ 1,689 library instances · 0 unbound · 0 placeholders · 0 overflows · 0 off-grid |
| P4 · Document Centre, Track & Correct, Project Records | 6, 7, 8 | 68 | 🟡 running — also retrofits the twelve Upload Documents frames in sections 4 and 5, which were drawn with the old Document Tile |
| P5 · Officer queues, registers and review | 9, 10 | 41 | 🟡 seven items outstanding (five its own, two found in review: the "More Actions" button drawn neutral instead of brand, and the certification block missing its panel, its rule and its ink) |
| P6 · Directory, PMU, Director, Superseded | 11, 12, 13, 15 | 26 | ✅ 1,610 nodes · 0 unbound · 0 placeholders |
| — | Page-level pass: stack sections 1 → 15 top to bottom | | ⬜ blocked until every part has landed; parts were placed concurrently and two landed on the same coordinates |
| — | Re-record the Index snapshot (`npm run check:figma-index:sync`) and commit | | ⬜ after the page-level pass |
| — | **Final visual verification** — every screen against the build, whole page logical and organised | | ⬜ the goal's closing requirement |

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

Held back deliberately: changing a shared master while P4 and P5 are drawing would shift their
frames under them. To be done once both land.

| Master | Defect |
|---|---|
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
