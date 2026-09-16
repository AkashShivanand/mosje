# e-Anudaan — Glossary, Money and Dates

16 Sep 2026 · batch B2 of the design-director audit (`portal-audit/AUDIT.md`: X-03, X-10, D-01,
N-03, N-04, N-14, O-01, O-05, O-13, R-07, R-09).

**One term per concept, per audience.** The words live in one module,
`apps/hub/src/lib/e-anudaan/glossary.ts`; the selectors, the workflow's labels, the notifications
and the Document Centre read it, and pages read those. `glossary.test.ts` sweeps every label the
libs publish against the retired terms below. Change this table and the module together.

Register: plain, formal, factual, Title Case for titles (`.claude/rules/ui-restraint-and-copy.md`).
Where the live portal's word is kept, it is because it is the Ministry's word; where it is dropped,
the reason is given.

## 1. The terms

| Concept | Term | Audience | Not | Why |
|---|---|---|---|---|
| The Ministry's formal request that an application be corrected | **Deficiency** (event: **Deficiency Raised**) | both | Correction Requested · Deficiency response requested · Resolve | It is the Ministry's and GFR's word, used on the live portal and in the officer registers. Naming the same event by its consequence ("Correction Requested") in the applicant's history and by a third phrase in the bell gave one letter three names. |
| The applicant's status while a deficiency is open | **Action Required** | applicant | Deficiency Raised (as a status) · Query / Returned | A status names what it asks of the reader. It is the only applicant state that asks for something (review call 11 Sep 2026, T43–54). |
| What the applicant sends back | **Correction** — button **Submit Correction**, event **Correction Submitted** | both | Response · Deficiency Response Submitted | The applicant corrects the application; "response" read as a letter. The officer's audit row and the applicant's history now say the same thing. |
| An officer's verdict on one document or one answer | **Needs Correction** (opposite **Verified**; unset **Not Reviewed**) | officer | Deficient · Not valid | The verdict and the event are different objects: several "Needs Correction" verdicts make one Deficiency. |
| The Programme Division | **Programme Division** | both | **PD** | "PD" also meant the Programme Director, the portal's top decision-maker — "PD Queries" read as queries raised by the Director. Never abbreviated on screen. |
| The Programme Director | **Programme Director** | both | **PD** | As above. |
| The automatic document check's verdict | **Looks right · Check the details · Doesn't match · Saved — an officer will check it** (applicant); **Looks right · Unsure · Doesn't match** with confidence (officer) | both | Verified · Document verified · Valid · Not valid · Needs review · Please confirm | **Kept distinct from the officer's verdict on purpose.** "Verified" records that a named officer examined and accepted a document. "Verified · 98%" beside an unset officer verdict read as though the machine had decided; to an applicant it read as though the Ministry had accepted a file nobody had opened. The check says what it saw. |
| A file the check was unsure about (applicant) | **Check the details** | applicant | Please confirm | There was nothing on the row to confirm with. The words point at the reason line and "What we found". See the Document Centre spec §6.1 item 11 (D-01). |
| The grant committed by the sanction order | **Sanctioned** | both | Approved | The Programme Director's order is a sanction. |
| The grant paid out | **Grant Released** | both | Sanctioned | A released file was shown as "Sanctioned" to the NGO and in the officer worklist. An NGO waiting for funds must be able to tell a committed grant from a paid one (N-09). |
| A change request's decision (bank account, project location) | **Approved / Not Approved** | both | Verified | "Approved" is reserved for change requests. A grant is never "Approved"; "Approved in principle" in an officer's remark is that officer's words, not a status. |
| A final decision against the application | **Rejected** | both | Not Approved · Closed / Rejected | The notification already said "Application Rejected"; the applicant's history said "Not Approved" and the chip "Closed / Rejected". One decision, one word. |
| A file sent back inside the Ministry to be examined again | status and audit row **Returned for Rework**; button **Return to the <seat>** | officer | Return to Previous · Returned to Previous Level · Return for Reconsideration | "Return to Previous" did not say to whom; the Director's "Return for Reconsideration" named the same act a third way (R-07). The button names the seat ("Return to the Section Officer"); the audit row carries the status it leaves the file in. |
| The same file, seen by the applicant | **In Review** | applicant | Query / Returned | Nothing is asked of the applicant, and their own history already folds these moves into "Under Examination at the Ministry". The chip contradicted that history. **Diverges from the live portal's chip list** on purpose. |
| The officer's remark that travels with a return | **Query**, register **Queries** | officer | PD Queries | See "PD". |
| A file that has reached the Ministry and no officer has acted on | **Received** | officer | New Submission | "New" is the case type's word; "New Submission" sat beside a "New" chip and a "New Applications" figure that counted returned files (O-05). |
| The case type of a new project | **New Project** (figure **New Projects**) | both | New · New Applications | As above. |
| A later grant for an ongoing project | **Instalment** — "2nd Instalment", "3rd Instalment of FY 2026-27" | both | Installment | The Ministry's and GFR's spelling. The sweep found none; the test keeps it that way. |
| Starting a grant application | **Apply** — "Application for grant-in-aid under AVYAY." | applicant | Register ("complete each section to register for AVYAY") | An NGO registers once, as an organisation; it applies for each grant. `wizardIntro()` and `claimIntro()` carry the copy (W-02); a claim names the instalment, year and project instead. |
| A scheme's name | **Acronym — Full name** — "AVYAY — Atal Vayo Abhyuday Yojana", "SMILE — Support for Marginalised Individuals for Livelihood and Enterprise" | both | AVYAY (Atal Vayo Abhyuday Yojana) · SHRESHTA Mode 2 alone · Support for Marginalized Individuals… · SMILE (Garima Greh) | Four patterns across the picker, the dashboard and My Applications meant a returning applicant could not match the card they chose to the row it produced (N-07). British spelling. A cell with no room prints the acronym alone, which is what the officer's Scheme column does. `SCHEME_NAMES` / `schemeName()` own it; `schemeLabel()` (officers) and `components/e-anudaan/ngo-schemes.ts` (applicant) both read it. |
| Who acted, on a notification | the **office** for an applicant ("Programme Division"); the **seat** for an officer ("Under Secretary, Programme Division"); the organisation for the applicant's own act | both | System | Every notice read "System" although the audit trail records the seat. Officer roles are not named to the applicant (review call T778–823). |

## 2. Money — `formatMoney(amount, context)`

| Context | Where | Form | Example |
|---|---|---|---|
| `summary` (default) | tables, lists, KPI tiles, cards, reports, notifications | ₹ with lakh/crore from **₹1 lakh** up, two decimals; below ₹1 lakh, full grouping | `₹24.38 L` · `₹22.28 Cr` · `₹99,999` |
| `exact` | form fields, the sanction order, a confirmation dialog, the Utilisation Certificate — anywhere the figure is entered, confirmed or legally stated | full Indian grouping, whole rupees | `₹24,38,356` |

- The unit is chosen **after** rounding: ₹99,99,999 is `₹1.00 Cr`, never `₹100.00 L`.
- A shortfall keeps its sign: `-₹63.50 L`. A non-number is `—`.
- Never monospace. One table, one card or one KPI row never mixes the two forms.
- `rupees()` and `rupeesShort()` remain as the exact and summary names; `formatGrant()` is summary.

**Why a threshold and not a unit per column:** officers compare a figure between two screens far more
often than two figures inside one column, and the audit's defect was the same amount printed in two
forms (`₹22.28 Cr` on NGO 360, `₹22,27,97,125` in Reports). A context rule makes the two screens agree.

## 3. Dates — `formatDate`, `formatDateTime`, `formatTime`

| Function | Shape |
|---|---|
| `formatDate` | `16 Sep 2026` |
| `formatDateTime` | `16 Sep 2026, 11:42 AM` |
| `formatTime` | `11:42 AM` (12-hour, zero-padded, upper-case meridiem) |

- Month names are ours (`Sep`, never the `en-IN` locale's `Sept`).
- **Every instant is printed in India Standard Time**, whatever the machine's zone (fixed +05:30;
  India keeps no daylight saving). The server renders in UTC and the reader's browser in IST, so a
  timestamp after 18:30 UTC printed one date on the server and the next after hydration.
- A bare `2026-09-16` is a calendar date and prints as written; a bare `HH:mm` is a wall-clock time.

## 3a. What is owed, and by when (N-14)

An action item on the bell and the notifications page carries `dueAt` **only where a date has a
source**, and the list is sorted by it — soonest first, so the most overdue is at the top. A
certificate due last March used to sit below a deficiency raised yesterday, and both read as
equally urgent.

| Action item | Due | Source |
|---|---|---|
| Utilisation Certificate Due | 31 March of the year after the grant's financial year closed (FY 2025-26 → 31 Mar 2027) | GFR 12-A — twelve months from the close of the year the grant was released for, the same rule `ucDue` selects on. `ucDueBy()` in `registers.ts`. |
| Deficiency Raised | **no date shown** | The period an applicant has to answer is **not published** in the scheme guidelines, the BRD or the live portal's letters. `Deficiency.respondBy` exists for the day the Ministry states one, and the notice shows "Respond by" as soon as a record carries it. **Needs a Ministry answer.** |

An item with no recorded due date is ranked by the date the Ministry asked, which is when its clock
started. Updates — which owe nothing — stay newest-first.

## 4. One answer per question — the fixes that went with the words

| Finding | One source now |
|---|---|
| N-03 · a deficiency dated 07 Aug in Notifications, 10 Aug on the dashboard and the application | Notifications read `requestedAt(app, deficiency)` — the moment the Section Officer sent it — as Pending Actions and the application page do. The ASO's internal `detail` no longer reaches the applicant's bell or history; they are shown the SO's `message`. |
| N-04 · "3 required questions unanswered" on a submitted file | `answeredSectionSummary(section, app)` and `answeredSectionsHeadline(sections, app)` in `selectors.ts`: the unanswered count is a draft's question only. |
| D-01 · "Please confirm" counted Ready | Document Centre spec §6.1 item 11. |
| O-01 · All Applications' figures, count line and pager disagreed | `explorerView(state, role, filters)` in `officer.ts`: one filtered set; the four figures count it, the count line reads "10 of 133 applications", the pager counts the same array. |
