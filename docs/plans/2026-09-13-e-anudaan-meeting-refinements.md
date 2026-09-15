# e-Anudaan — refinements from the design review call of 11 September 2026

**Branch:** `feat/e-anudaan-meeting-2026-09-11` (worktree — the main tree held another
session's uncommitted files)
**Sources:** `2026-09-11_17-40-02.mp4` (1 h 56 min, the vendor's dev portal screen-shared)
and its Hindi transcript `E-Anudaan Discussion Part 1.md` (987 lines). Timestamps below are
recording time; `T###` are transcript line numbers.

---

## 0. Is the clone faithful? — checked 13 Sep 2026

| Check | Result |
|---|---|
| All four live hosts answer `/login` | ✅ `200` on user-uat, admin-uat, user-dev, admin-dev |
| Build fingerprints vs the 07 Sep re-clone | ⚠️ **All four changed** — user-uat `index-CPyM5NBh` → `index-D3ts5on0`; admin-uat `main.182b26ac` → `main.f46458c0`. The portal has been rebuilt since the last capture. |
| NGO route table in the live bundle vs our clone | ✅ Every NGO route the meeting walked exists in our clone with the same sidebar, in the same order (Dashboard · My Applications · Deficiencies · Select Scheme · Project Location Change · My Bank Accounts · Notifications · Weekly Attendance · Attendance Master · CCTV Setup) |
| Routes live has and we do not | `ngo/my-applications/:id/edit/{step-1,step-2,review}`, `ngo/sage-registration`, `inspection/call`, `login/select-branch`, `login/verify-otp`, and a whole `school/*` module (SHRESHTA Mode 1) — none was discussed in the call |
| Screens in the recording vs our befores | ✅ Same dashboard anatomy, same Attendance tabs and modals, same Action Queue, same wizard stepper |
| Signed-in walk of the live portal | ❌ **Not done by the agent.** The accounts are in `tools/design-audit/projects/e-anudaan/secrets.json`, but typing a password into a live government system is outside what the agent may do. Run `python3 engine/run.py --project e-anudaan --phase capture --force` from `tools/design-audit/` to refresh the corpus; the recording (dated 11 Sep, after the rebuild) was used as the current reference instead. |

---

## 1. Goal tracker

Status: ⬜ open · 🟡 in progress · ✅ done · ⏸ deferred (reason stated)

### A. Applicant (NGO) — the call's first priority (T975–977)

| # | Goal | Evidence in the call | Status |
|---|---|---|---|
| N1 | "Select Scheme" becomes **"Apply for Grant"** in the sidebar | T40–41, T94 | ✅ |
| N2 | Dashboard carries a **Pending Actions** panel listing every open deficiency across all applications — two or three visible, "View All" beyond — instead of one banner | T43–54, 3:59–4:09 | ✅ |
| N3 | Deficiencies page lists **every item on every application** (several per application, several applications) with "Resolve" | T44–46, T73–75 | ✅ |
| N4 | **Deficiency-focused resolution:** opened from a deficiency, the application shows the officer's remarks first, lets each flagged document be replaced in place, takes a response, and keeps the full form collapsed | T55–70, T76–79 | ✅ |
| N5 | Application detail (opened normally): summary → deficiency card when open → form collapsed → documents compact → **Processing History last** | T58, T64–70, T80 | ✅ |
| N6 | A replaced document **keeps every earlier version** on record | T83–92 | ✅ |
| N7 | NGO's processing history **never names officer roles**; a run of "moved to next level" entries reads as one step | T778–823 | ✅ |
| N8 | Project Location Change: **State and District fixed** by the project; "Use Current Location" first, which fills the address; address stays editable; coordinates recorded but not shown; reason mandatory; **optional supporting document** | T100–122, T457–468 | ✅ |
| N9 | Bank accounts are **per project**: no free-standing "Add account"; one form (project → new account → reason → optional document) raises the change request; the old account stays active until approval; previous accounts kept on record | T124–159, T537–576 | ✅ |
| N10 | **Beneficiaries & Staff** is its own page, not a tab hidden inside Weekly Attendance | T233–239 | ✅ |
| N11 | Add Employee: the OTP goes to **the employee's** mobile (not "the NGO's registered mobile"); **Qualification** captured; qualification certificates uploaded (one required, more allowed); employee details viewable | T181–232 | ✅ |
| N12 | **One Attendance page, two tabs** — Overview (the former Attendance Master, which is a dashboard, not a master) and Weekly Attendance; marking a **whole day** (e.g. Saturday absent) as well as the whole week | T200–203, T250–271, T950–970 | ✅ |

### B. Officer console — the call's second priority (T977)

| # | Goal | Evidence in the call | Status |
|---|---|---|---|
| O1 | Dashboard leads with **pending work by case type** — New · 1st · 2nd · 3rd Instalment — under a **Financial Year filter**, plus Forwarded, Returned for Rework, Deficiencies Raised and Deficiencies Resolved | T698–737, 38:39, 82:32 | ✅ |
| O2 | Worklist: **Project ID first** with the application ID as a caption beneath and a New/Ongoing badge; **Requested and Instalment columns removed**; Type filterable | T851–878, T926–933, 97:31 | ✅ |
| O3 | Status says where the file is **and** its deficiency state in words and icon, not colour alone — "Deficiency Raised", "Resubmitted after Deficiency", "Returned for Rework", "Inspection Report Available" | T879–925 | ✅ |
| O4 | The Action column stays **sticky** while a wide table scrolls; tables may be 1.5–2× wide, never a "four-kilometre" scroll | T839–850 | ✅ |
| O5 | Document review remarks: **none while Pending, optional when Verified, mandatory when Queried** | T752–768 | ✅ |

### C. Application wizard — third priority

| # | Goal | Evidence | Status |
|---|---|---|---|
| W1 | Ongoing application: **instalment is not asked** — the next instalment is derived and stated; Financial Year offers **at most three** years | T351–383, T419–422 | ✅ |
| W2 | Ongoing application: bank account shown **read-only and compact** (bank · masked number · IFSC · branch), PFMS registration sits with it, and a registered account is not asked again | T540–576, T617–639 | ✅ |
| W3 | Ongoing application: **CCTV compliance section removed** | T640–644 | ✅ |
| W4 | Grant Sought: new — only the amount is entered and the rest computed; ongoing — all read-only, computed from the **sanctioned** amount | T577–596 | ✅ |
| W5 | Functionaries captured as **separate fields** (name · qualification · designation · contact), not a paragraph | T478–487 | ✅ |

### D. Deliberately not in this pass

| Item | Why |
|---|---|
| Captcha replacement / DARPAN login (T392–416) | The login is to be replaced by DARPAN sign-in; our login already retired the distorted-character captcha. No design until the DARPAN flow is specified. |
| CCTV module (T273–277) | Not implemented by the vendor; the call asked for a plan first. |
| Officer read-only view of an NGO's roster and attendance (T935–949) | Depends on N10/N12 landing; recorded for the next pass. |
| Which fields are editable on an ongoing application (T441–476) | The vendor is to confirm per field; W1–W4 cover the ones the call settled. |
| Error-state catalogue from the vendor's APIs (T658–666) | The vendor is to send the error list. |

---

## 2. Audit cycles

Each cycle opens with a number, and closes with what moved it.

Scores are the review panel's (Design Director, UX Lead, QA Lead, Government Official, NGO
user), out of 10, read from 1440px screenshots and step-by-step flow captures.

| Cycle | Opened at | What it fixed | Closed at |
|---|---|---|---|
| 0 — baseline | 0 / 22 goals · panel 4 · 3 · 4 · 4 · 4 (avg 3.8) | — | — |
| 1 — build the call's goals | 0 / 22 | All 22 goals built; accessibility audit: 0 critical, 2 serious, 2 moderate, 1 minor | panel 6 · 6 · 5 · 5 · 7 (avg 5.8); 9 goals fully met on screen, 9 partly, 4 not visible |
| 2 — panel P0/P1 | avg 5.8 | Seed contradictions (one file per project per year); attendance no longer pre-ticked, confirm before certifying, full return history; one status vocabulary; Deficiencies Raised/Resolved; Pending Actions sorted by outstanding; automated verdicts and "Pending" badges off the NGO's document list; "Apply for Grant" everywhere; broken unencoded Details links; all 5 accessibility findings; **geolocation blocked estate-wide by Permissions-Policy — now `(self)` for e-Anudaan** | panel 7 · 8 · 6 · 7 · 8 (avg 7.2); 16 fully met, 2 partly, 4 not visible |
| 3 — data only (panel verdict: "one more short cycle, limited to data") | avg 7.2 | Second project in a district named "Unit n"; instalments only move forward; no open file older than 2024-25; corrected figure keeps the original ("Submitted → Corrected"), box starts empty; per-item toasts removed; queue vs all-application counts labelled; instalment blank until a project is chosen; **Back from Upload Documents lost the step**; **read-only selects were editable** | Not re-scored, deliberately. Verified: 9/9 browser flows, 0 page errors; W2–W5 captured; `npm run check` and production build green |

### Cycle 4 — full re-audit: every screen, every form path through submit

Asked for after cycle 3: "check all screens are there and the way they should be, entire flow of
all the form wizards". Two scripted walkers, not a sample:

| Measure | Opened at | Closed at |
|---|---|---|
| Screens visited (13 roles × their routes × 1440 and 375px) | 266 | 266 |
| Crashes, console errors, server errors | 0 | 0 |
| Flagged screens | 55 | 10 — all deliberate (old Attendance Master link redirects; test URLs with no scheme; the not-found page) |
| Screens that scroll sideways on a 375px phone | 11 | 0 |
| Officer roles with an empty notifications page | 7 | 0 |
| Form paths that reach submit (7: SHRESHTA; AVYAY, SMILE, NAPDDR × new/renewal) | 0 | 7 |
| Submitted records with their own project, documents and beneficiaries | 0 / 7 | 7 / 7 |

Defects found and fixed, worst first:

1. **SMILE could not be applied for** — the picker's code `SMILE_GG` had no form. Test added.
2. **No path could pass Upload Documents** — a fresh application opened with four fake uploads
   (one rejected), under a hard-coded "continuing a saved draft … 21 Aug 2026" banner, and a real
   upload never finished "verifying". Uploads now settle; a fresh form starts empty; the banner
   shows only for a real draft, with its real date, and never mid-flow.
3. **NAPDDR and AVYAY renewals were blocked at steps 7 and 4 — by cycles 1 and 3.** Locked
   renewal fields (estimates, bank account) arrived empty and required. They are now carried
   forward with the project; `prefill.test.ts` fails if any path on any scheme has a required
   locked field with no value (verified by deleting the fix and watching it fail).
4. **Submitted records were wrong** — filed under the NGO's first project whatever was chosen,
   uploads dropped ("0 of 0 uploaded"), NAPDDR beneficiaries 0, renewal instalment not recorded.
   `submission.ts`, tested.
5. **"Start a fresh application" emptied the DARPAN fields**, leaving required answers nobody could type.
6. **Notifications** went to the signed-in NGO for other organisations' files and to nobody in the
   Finance Division, Programme Director or PMU. Now addressed to the acting officer, the new holder
   and the file's own applicant.
7. **Phone widths** — long reference numbers in worklist cards and headings (fixed in the
   `WorklistScreen` card CSS, estate-wide), a PMU table with no scroll box, and **every DS chart's
   hidden data table widening the page** (`chart-frame.tsx`, `funnel-chart.tsx`, estate-wide).
8. Success page said "30 days" and "7–14 business days"; the "no scheme" page had no heading and a
   button inside a link.

Not changed, needs the department: AVYAY's and NAPDDR's renewal pickers list projects "awaiting
sanction" while the help text says only sanctioned, PMU-verified projects are renewable — both
transcribed from the live portal.

**Stopping here.** What remains is polish or depends on people: the design system's shaded
accordion rows (library-wide), extending W4/W5 to SHRESHTA, AVYAY and SMILE, the officer's
read-only view of an NGO's roster, and the vendor answers listed in §1D. The signed-in walk of the
live portal is a human step (§0).

Before/after screens: published report page (link in the session summary); source captures in
the session scratchpad, not committed.

### Cycle 5 — screen QA findings, P1 and P2 (14 Sep 2026)

Opened from a screen QA of 208 captures: **0 P0 · 18 P1 · 11 P2** (the report's header said 19 P1; its table lists 18).
Fixed by three helpers with disjoint file ownership (forms · records · console), then integrated.

| Measure | Opened at | Closed at |
|---|---|---|
| P1 findings open | 18 | 0 |
| P2 findings open | 11 | 0 |
| e-Anudaan unit tests | 119 | 137 (new: references, answered counts, seed invariants, labels, FY check, eligibility, applicant notifications) |
| Screens visited, both widths | 266 | 266 — no page errors; only the known redirects, test URLs and not-found page flagged |
| Form paths reaching submit | 7 | 7 |
| Screens scrolling sideways at 375px | 0 | 0 (PD Review heading regressed mid-cycle and was fixed) |

Worst first:
1. **Reference numbers** took their district from the address text and repeated one serial — now the project's district and a serial one past the highest issued (`applicant.ts` `mintReference`).
2. **Developer notes and raw codes on screen** — BR/FR/BRD codes, "Inferred screen…", "(demo)" toasts, `DeficiencyRaised / NGO`, `SHRESHTA_M2`, `ord-01110` — removed or mapped through one label table (`workflow.ts` `STATUS_LABEL` / `ACTION_LABEL`, `selectors.ts` `schemeLabel`).
3. **One project, three stories** — the seed now keeps scheme, nature, instalment and attendance consistent per project (`records-seed.test.ts`).
4. **Counts that disagreed** — upload counter vs list, "47 of 51 answered" on submitted files, dashboard tile vs Queries list — each now one expression.
5. **Documents** ask only what the answers require, and a last-year document is no longer "Verified" on this year's application.
6. **The applicant is notified only of what concerns them** (received, correction needed, sanctioned, rejected, inspection scheduled) — internal Ministry moves no longer reach the NGO.
7. Design system: `Wizard` gains `submitIcon` (send by default) and `stepperCollapse`; control-group required mark matches field labels; `EventList` stamps read "14 Sep 2026, 12:07 PM"; `WorklistScreen` gains `countLine`.

Known and not fixed here:
- A **renewal is recorded as the 1st instalment**: the renewal pickers list illustrative projects that have no sanctioned history in the seed. Waits on the department's renewal-eligibility rule (§1D), after which the picker should read the NGO's own eligible projects.
- **Seed submission dates** do not always sit inside their financial year (an FY 2026-27 file submitted 28 Jan 2025).
- **Intermittent hydration warning** — the UX4G accessibility widget writes `style="zoom:1"` on the portal root before React hydrates. Third-party; not introduced here.
- PMU Schedule / Record Inspection save to the store now; there is no inspection report upload.

Before/after sheets: session scratchpad `p1fix/final/sheet-{forms,records,console}.png` (not committed).

### Decisions of 14 Sep 2026 (applied)

| Decision | Applied as |
|---|---|
| Save automatically and silently; show the time at the top | Saved to the browser 600 ms after the answers stop changing; header shows "Saving…" then "Draft saved at 10:42 AM"; a failed save says "Draft not saved." with Try Again. An untouched form is never saved. The draft survives closing the tab, and the next visit offers **Resume Draft** / **Start Fresh** — nothing is saved until the applicant chooses. |
| Next button reads "Save and Continue" | Every step but the last; the last stays "Submit Application". The three "Next: Documents" labels are gone. |
| Header as the reference screenshot | Scheme title (headline-5), "Please provide all necessary information below and complete each section to register for <scheme>." and the save status on the right; "Step N of M" removed (the stepper says it). Full width, as portal pages are; every stage keeps its name from 768px up and collapses to the compact bar on a phone. |
| No greeting on the NGO dashboard | Page titled "Dashboard"; the organisation is named beside its DARPAN record. |

Figma (MoSJE Portal Handoff, E-Anudaan page): all 54 wizard step frames and the NGO Dashboard frame updated to match; the AVYAY renewal notice moved off every step onto the renewal picker, and 85 hand-built required markers now use the error colour.
