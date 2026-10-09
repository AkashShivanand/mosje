# PFMS BRD — Independent Verification of the Prototype and the Figma Handoff

**BRD:** NeGD, *Integration of PFMS with the e-Anudaan Portal*, v1.0, 8 Sep 2026
([`docs/source-brd/eAnudaan_PFMS_Integration_BRD.pdf`](../source-brd/eAnudaan_PFMS_Integration_BRD.pdf), 42 pages, all read).
**Checked:** 1 Oct 2026, on `main` at `8ba722e0` (PR #646 merged the payment leg on 30 Sep).
**Supersedes, for marks:** [`2026-09-29-e-anudaan-pfms-brd-checklist.md`](./2026-09-29-e-anudaan-pfms-brd-checklist.md) and
[`2026-09-30-e-anudaan-pfms-coverage-checklist.md`](./2026-09-30-e-anudaan-pfms-coverage-checklist.md). Both were treated as claims to test.
**Plain-language companion:** [`2026-10-01-e-anudaan-pfms-explained.md`](./2026-10-01-e-anudaan-pfms-explained.md). **Drawn explainer (private Artifact):** https://claude.ai/artifact/CfggnaDFJfKX7jT9XyMLHV

## How This Was Checked

| Source | What was done |
|---|---|
| BRD | Text extracted with `pdftotext -layout`; the five figures (pp. 24–28) rendered and read as images. Page numbers below are the PDF's own footers. The table of contents is one page early from §6 onwards (it says p. 18 for §6; §6 starts on p. 19 because p. 18 is blank). |
| Code | Every file in `apps/hub/src/lib/e-anudaan/pfms/`, the PFMS screens and components, and the bank-details part of the application form, read line by line. |
| Tests | `node --test "src/lib/e-anudaan/**/*.test.ts"` in `apps/hub`: **494 tests, 494 pass, 0 fail** (1 Oct 2026). PFMS tests are in `pfms/pfms.test.ts`. |
| Browser | Hub dev server (`localhost:3015`, the instance already running from this checkout). Opened as the Maker, the Checker, the Bureau and the NGO: Payment Advices, Step 1 (with its inline errors), Authorisation Queue, Authorise Payment Advice, Payment Reports › Sanction Pipeline, Payment Status (a closed case), PFMS Set-Up, the NGO's Application Details and Project Bank Accounts. Marked 👁 below. |
| Figma | Snapshot `tools/figma-handoff-structure/manifests/e-anudaan.json` (recorded 30 Sep). Confirmed current with cached REST reads (`tools/figma-read/read.mjs`, no MCP calls): the file was last modified 30 Sep 2026 10:34 UTC, and all 98 PFMS-related frames exist under the same names and ids. The text inside 66 key frames was then read and searched for each field and message cited below. |

### Abbreviations Used in the Table

**Code** (all under `apps/hub/src/`):
`pfms/` = `lib/e-anudaan/pfms/` · `ea/` = `lib/e-anudaan/` · `cmp/` = `components/e-anudaan/` · `rt/` = `app/portals/e-anudaan/(console)/` · `ngo/` = `app/portals/e-anudaan/(ngo)/ngo/` · **T:n** = a test in `pfms/pfms.test.ts` starting at line n · 👁 = seen in the browser on 1 Oct.

**Figma** (file `E-Anudaan [Handoff]`, `K0B3vuOTXpxw6kt0px2Cqo`). Page › Journey:
**PA** = *PFMS · Preparing and Authorising Payments* › Programme Division — Paying a Sanctioned Grant; journeys **Prep** (Preparing a Payment Advice), **Auth** (Authorising a Payment Advice — Needs Discussion), **Fol** (Following a Payment — Needs Discussion).
**SR** = *PFMS · Set-Up and Payment Reports*; journeys **Leg** (Bureau › Completing Legacy Files — Needs Discussion), **Set** (Bureau › Keeping PFMS Set-Up Current), **Rep** (Officers › Payment Reports).
**NG** = *NGO · After Applying and Getting Paid* › NGO — Getting Paid › PFMS Payee Code and Payment — Needs Discussion.

### Marks

| Mark | Meaning |
|---|---|
| ✅ | In the prototype **and** drawn in Figma, with evidence for both |
| 🟢 | Built, not drawn |
| 🎨 | Drawn, not built |
| 🔧 | NeGD server-side work. No screen should exist; the note says which screen shows its outcome |
| ⏸ | Owed by PFMS, the Ministry or the Bureau |
| 🟡 | Partial; the note says exactly what is missing |
| ❌ | Not covered |

**One rule held throughout.** Where one BRD sentence asks for both server work and a screen, it is split into
**(a)** the server half and **(b)** the screen half, each with its own mark. No server-side work is counted
inside a ✅. In the prototype PFMS is imitated by `pfms/simulator.ts`; every status, bill, voucher and UTR on
screen is invented by that file. A ✅ means the screen is built and drawn, not that a payment has moved.

---

## Coverage Table

### §1 Introduction (pp. 5–6)

| ID | BRD page | Requirement (plain words) | Prototype evidence | Figma evidence | Mark | Note |
|---|---|---|---|---|---|---|
| U-1.2-1 | p. 5 | One portal serves five schemes: NAPDDR, AVYAY, SHRESTHA Mode 1, SHRESTHA Mode 2, SMILE | `pfms/masters.ts:63-100` now configures all five; Mode 1 has no application form | SR › Set › Heads of Account (3:10593) Mode 1 card; Overview (3:10805) row | ⏸ | Mode 1 is set up for PFMS. Its full form and journey wait on the BA for fields and flow (question 14) |
| U-1.3-1 | p. 5 | Problem: sanction and bill data are re-typed at the DDO | Answered by the single request (FR-SNC-003) | — | 🔧 | Ending re-typing depends on NeGD's real call to PFMS |
| U-1.3-2 | p. 5 | Problem: the Ministry cannot follow a grant from sanction to credit | `rt/finance/payment-status/[appId]/page.tsx:150-255` 👁 | PA › Fol › Payment Status / Paid (3:11915) | ✅ | Figures on the page are imitated |
| U-1.3-3 | p. 5 | Problem: bank account and payee code not captured in a form PFMS can use | `ea/form-schema.ts:332-372` | NG › Bank Account Details — PFMS Payee Code (3:9624) | ✅ | |
| U-1.3-4 | p. 5 | Problem: head of account is one text line; PFMS needs four codes | `cmp/pfms/advice-steps.tsx:190-235` | PA › Prep › Step 2 of 5 — Heads of Account (3:14558) | ✅ | |
| U-1.3-5 | p. 6 | Problem: no Maker–Checker and no DSC trail on the payment advice | `pfms/advice.ts:363-375`, `:387-429` | PA › Auth › Approve and Sign (3:13204) | ✅ | |
| U-1.3-6 | p. 6 | Problem: reconciliation is manual and periodic | `pfms/reports.ts:93-104` | SR › Rep › Disbursement Reconciliation (3:8279) | ✅ | Fetching the feed is FR-STS-004 (a), 🔧 |
| U-1.4-1 | p. 6 | Target: the review chain up to the US-PD sanction is unchanged | Review chain untouched; one-click release replaced by a payment stage, `cmp/review-panels.tsx:212-237` | PA › Fol › Instalments — Awaiting Payment Advice (3:11559) | ✅ | |
| U-1.4-2 | p. 6 | Target: Maker and Checker never reopen or alter the sanction | `pfms/selectors.ts:140-170` (read-only facts); T:195 | PA › Prep › Step 1 of 5 (3:14676) "cannot be changed" | ✅ | Same as FR-PDC-006 |

### §2 Objectives (pp. 7–8)

| ID | BRD page | Requirement (plain words) | Prototype evidence | Figma evidence | Mark | Note |
|---|---|---|---|---|---|---|
| U-2.1-1 | p. 7 | Stop manual re-typing at the DDO | — | — | 🔧 | Needs the real ReceiveSanctionData call |
| U-2.1-2 | p. 7 | Ministry sees a grant end to end inside e-Anudaan | Payment Status, `rt/finance/payment-status/[appId]/page.tsx` 👁; pipeline `pfms/reports.ts:17-22` | PA › Fol › Paid (3:11915); SR › Rep › Sanction Pipeline (3:8549) | ✅ | |
| U-2.1-3 | p. 7 | Shorter turnaround; less reconciliation effort | `pfms/reports.ts:185-206` (turnaround), `:93-104` (reconciliation) | SR › Rep › Turnaround (3:7995) | ✅ | The screens measure it; only go-live can show it falling |
| U-2.1-4 | p. 7 | Auditable: one traceable e-sanction per bill | Requests Sent to PFMS and Payment History, `rt/finance/payment-status/[appId]/page.tsx:222-255` | PA › Fol › Bill with DDO (3:12000) | ✅ | |
| U-2.1-5 | p. 7 | Built once; other schemes join by configuration | Add Scheme, `rt/dashboard/pfms/heads-of-account/page.tsx` (`AddSchemeDialog`); `pfms/store.tsx` `addScheme` | SR › Set › Add Scheme (Dialog) (98:10919) | ✅ | A scheme joins PFMS set-up without a code change |
| U-2.2-1 | p. 7 | Payee code and bank details confirmed at application | `ea/form-schema.ts:340`, `:355-371` | NG › Bank Account Details — PFMS Payee Code (3:9624) | ✅ | |
| U-2.2-2 | p. 7 | Maker–Checker on the payment advice, after the sanction | `pfms/advice.ts:294-333`, `:363-375` | PA › Auth › Awaiting Authorisation (3:13375) | ✅ | |
| U-2.2-3 | p. 7 | Each bill sent in one ReceiveSanctionData call with header, heads, payee and hashes | — | — | 🔧 | Screen half is FR-SNC-003 (b) |
| U-2.2-4 (a) | p. 7 | Track bill, PAO and payment progress at PFMS | — | — | 🔧 | Polling is NeGD's job |
| U-2.2-4 (b) | p. 7 | Show that progress and the UTR per payee | `pfms/stages.ts:171-180`; `rt/finance/payment-status/[appId]/page.tsx:173-210` 👁 | PA › Fol › Bill with DDO (3:12000), Paid (3:11915) | ✅ | Imitated data |
| U-2.2-5 (a) | p. 7 | Fetch the Ministry Release and Transfer Entry feed | — | — | 🔧 | |
| U-2.2-5 (b) | p. 7 | Compare it with e-Anudaan's records | `pfms/reports.ts:93-104` | SR › Rep › Disbursement Reconciliation (3:8279) | ✅ | |
| U-2.2-6 | p. 7 | Tell the NGO only on confirmed credit | `pfms/simulator.ts:90`; `pfms/store.tsx:202-211`, `:314` | NG › Notifications / Grant Credited (3:9047) | ✅ | |
| U-2.3-1 | p. 7 | A PFMS client: authentication, sending, status polling | — | — | 🔧 | |
| U-2.3-2 | p. 7 | Synchronise and cache PFMS master data, scheme by scheme | `pfms/masters.ts:16-59` imitates the cache | SR › Set › Master Data (3:10418) | 🔧 | The screen showing it is FR-MDM-001 (b) |
| U-2.3-3 | p. 7 | Head of account as four coded fields | `cmp/pfms/advice-steps.tsx:190-235` | PA › Prep › Step 2 (3:14558) | ✅ | |
| U-2.3-4 | p. 7 | SHA-256 of every document; single-use, time-boxed view link | `cmp/pfms/advice-steps.tsx:425-447` | PA › Prep › Step 4 of 5 — Supporting Documents (3:14297) | ✅ | Link parameters are FR-DOC-002 (a), 🔧 |
| U-2.3-5 | p. 7 | Local pool of Claim Reference Numbers, drawn ahead, used one per payment | `pfms/reports.ts:148-172`; `pfms/advice.ts:274-291` | SR › Set › Claim References (3:10253) | ✅ | The draw call is FR-DOC-003 (a), 🔧 |
| U-2.4-1 | p. 8 | Maker works in one sequence: header, heads, payee, documents, submit | `pfms/advice.ts:42-50` 👁 | PA › Prep › Steps 1–5 (3:14676 … 3:14222) | ✅ | |
| U-2.4-2 | p. 8 | Pre-fill everything e-Anudaan already knows | `pfms/selectors.ts:153-170`; `pfms/advice.ts:131-162`; T:111 👁 | PA › Prep › Step 1 (3:14676) | ✅ | |
| U-2.4-3 | p. 8 | Checker sees a read-only copy of the payload beside the sanction order | `rt/dashboard/payments/authorise/[appId]/page.tsx:109-125` 👁 | PA › Auth › Approve and Sign (3:13204) | ✅ | |
| U-2.4-4 | p. 8 | PFMS errors and return reasons in plain language | `pfms/errors.ts:30-126`; T:265 | PA › Prep › Not Accepted by PFMS (3:14011) | ✅ | Only ERRM05 and ERRSNC44 are real codes; eight are illustrative (`errors.ts:9-11`) |
| U-2.5-1 | p. 8 | Pipeline dashboard by PFMS status | `pfms/reports.ts:17-22` 👁 | SR › Rep › Sanction Pipeline (3:8549) | ✅ | Grouped into plain stages, not the 30 PFMS names (open question 6) |
| U-2.5-2 | p. 8 | Ageing at each stage, DDO by DDO | `pfms/reports.ts:41-60` | SR › Rep › Ageing (3:8412) | ✅ | |
| U-2.5-3 | p. 8 | Reconciliation by scheme and by DDO | `rt/dashboard/payment-reports/page.tsx:548-552` | SR › Rep › Disbursement Reconciliation (3:8279) | ✅ | |
| U-2.5-4 | p. 8 | Failure trend by error category | `pfms/reports.ts:114-136` | SR › Rep › Failure Trend (3:8228) | ✅ | |
| U-2.5-5 | p. 8 | Claim Reference pool: drawn, used, left | `pfms/reports.ts:152-164`; T:277 | SR › Rep › Claim Reference Pool (3:8072) | ✅ | |

### §3 Scope (pp. 9–10)

| ID | BRD page | Requirement (plain words) | Prototype evidence | Figma evidence | Mark | Note |
|---|---|---|---|---|---|---|
| U-3.1A-1 | p. 9 | NGO gives its PFMS payee code and ticks to confirm it | `ea/form-schema.ts:355-371` | NG › Bank Account Details — PFMS Payee Code (3:9624) | ✅ | |
| U-3.1A-2 | p. 9 | NGO confirms account and IFSC; no sanction without both | `ea/form-schema.ts:340`; `ea/workflow.ts:529-538`, `:570-572` | NG › Account Numbers Do Not Match (3:9600); *Officers · Sanctioning* › Programme Director / Examine an Application / Bank Details Incomplete (103:12171) | ✅ | Shown before the decision; Sanction disabled (`cmp/review-shell.tsx`) |
| U-3.1B-1 (a) | p. 9 | Bureau records the coded head of account per scheme | `rt/dashboard/pfms/heads-of-account/page.tsx:84-310` | SR › Set › Heads of Account (3:10593) | ✅ | |
| U-3.1B-1 (b) | p. 9 | The real codes themselves | `pfms/masters.ts:1-12` says every code is illustrative | — | ⏸ | Bureau decision, on the critical path (§9) |
| U-3.1B-2 | p. 9 | DDO, PAO and PD codes from PFMS; DDO mapped per scheme | `rt/dashboard/pfms/ddo-mapping/page.tsx:10-199`; `pfms/store.tsx:347-351` | SR › Set › DDO and Division Codes (3:10468) | ✅ | Codes imitated |
| U-3.1B-3 (a) | p. 9 | Record who signs as Checker and their certificate | `rt/dashboard/pfms/designations/page.tsx:99-232` | SR › Set › Maker and Checker (3:10013), Edit Maker and Checker (Dialog) (3:9657) | ✅ | |
| U-3.1B-3 (b) | p. 9 | Ministry nominates the DSC-holding officers | — | — | ⏸ | §9, row 5 |
| U-3.1B-4 | p. 9 | Back-fill bank details for older sanctioned files | `rt/dashboard/pfms/back-fill/page.tsx:318-368` | SR › Leg › Enter Bank Details (Dialog) (3:10950) | ✅ | |
| U-3.1C-1 | p. 9 | PFMS registers e-Anudaan, issues credentials, whitelists IPs | — | — | ⏸ | |
| U-3.1C-2 | p. 9 | PFMS confirms scheme codes and allots Mode 1 and SMILE codes | `pfms/masters.ts:63-89` uses 3817, 3968, 3964; SMILE `null` | SR › Set › Heads of Account (3:10593) "Scheme Code Awaited" | ⏸ | DDRS 971 and ADIP 1805 are not e-Anudaan schemes in the prototype |
| U-3.1C-3 | p. 9 | PFMS confirms landing status at the DDO and use of eSanction | Assumed per DDO, `pfms/masters.ts:24-30` | SR › Set › DDO and Division Codes (3:10468) | ⏸ | Open question 9 |
| U-3.1C-4 | p. 9 | PFMS provides UAT and a technical officer | — | — | ⏸ | |
| U-3.1D-1 | p. 9 | PFMS client: handshake, sending, pollers | — | — | 🔧 | |
| U-3.1D-2 (a) | p. 9 | Master-data tables and their synchronisation | — | — | 🔧 | |
| U-3.1D-2 (b) | p. 9 | The master data, shown for use | `rt/dashboard/pfms/masters/page.tsx:41-74` | SR › Set › Master Data (3:10418) | ✅ | |
| U-3.1D-3 | p. 9 | Head of account restructured into coded parts | `pfms/advice.ts:199-215` | PA › Prep › Step 2 (3:14558) | ✅ | |
| U-3.1D-4 | p. 9 | Claim Reference pool; document hashing; single-use link | `pfms/advice.ts:274-291`; `cmp/pfms/advice-steps.tsx:425-447` | SR › Set › Claim References (3:10253); PA › Prep › Step 4 (3:14297) | ✅ | Server halves in FR-DOC rows |
| U-3.1D-5 | p. 9 | Maker screen, Checker DSC screen, UTR capture, NGO told on credit | Routes `rt/dashboard/payments/prepare`, `…/authorise` 👁 | PA › Prep, PA › Auth, PA › Fol | ✅ | |
| U-3.2-1 | p. 9 | Out of scope: any bill type other than RPR-34 (type 7) | `pfms/advice.ts:57` fixed | PA › Prep › Step 1 (3:14676) | ✅ | |
| U-3.2-2 | p. 10 | Out of scope: cheque; e-payment 528 only | `pfms/advice.ts:55` fixed | PA › Prep › Step 1 (3:14676) | ✅ | |
| U-3.2-3 | p. 10 | Out of scope: an account-validation API | None built; the NGO's typed-twice entry is relied on (`ea/form-schema.ts:340`) | NG › Account Numbers Do Not Match (3:9600) | ✅ | |
| U-3.2-4 | p. 10 | Out of scope: PFMS-side set-up and UAT | — | — | ⏸ | |
| U-3.2-5 | p. 10 | Out of scope: changes to the review chain | Review chain untouched | — | ✅ | Nothing to draw; nothing changed |
| U-3.2-6 | p. 10 | Out of scope: SHRESTHA payment mode and the Monthly Expenditure Plan certificate | `pfms/masters.ts:81` "Decision Awaited" | SR › Set › Heads of Account (3:10593) "Decision Awaited" | ⏸ | The certificate is not mentioned anywhere in the build |

### §4 Stakeholders (p. 11)

| ID | BRD page | Requirement (plain words) | Prototype evidence | Figma evidence | Mark | Note |
|---|---|---|---|---|---|---|
| U-4-1 | p. 11 | Secretary / Joint Secretary own the work and sign off the BRD | Joint Secretary can read Payment Reports, `ea/roles.ts:78` | — | ⏸ | Sign-off is a Ministry act |
| U-4-2 | p. 11 | Under Secretary (PD) sanctions and names the Maker and Checker | `ea/roles.ts:75` (`designateOfficers`) | SR › Set › Maker and Checker (3:10013) | ✅ | |
| U-4-3 | p. 11 | Maker prepares the payment advice | `ea/roles.ts:250-266` 👁 | PA › Prep | ✅ | |
| U-4-4 | p. 11 | Checker reviews, signs with DSC, may return | `ea/roles.ts:268-284` 👁 | PA › Auth | ✅ | |
| U-4-5 | p. 11 | DDO draws the Grant-in-Aid bill (inside PFMS) | Imitated as the stage "Bill with DDO", `pfms/stages.ts:55` | PA › Fol › Bill with DDO (3:12000) | ⏸ | Outside e-Anudaan |
| U-4-6 | p. 11 | PAO passes the bill and starts the transfer (inside PFMS) | Imitated as "Being Passed at PAO", `pfms/stages.ts:56` | SR › Rep › Sanction Pipeline (3:8549) | ⏸ | Outside e-Anudaan |
| U-4-7 | p. 11 | NGO enters bank details and payee code; receives the grant | `ngo/bank-accounts/page.tsx:80-186` 👁 | NG › Project Bank Accounts / PFMS Payee Code Needed (3:9507) | ✅ | |
| U-4-8 | p. 11 | PFMS technical team: registration, credentials, masters, UAT | — | — | ⏸ | |
| U-4-9 | p. 11 | NeGD engineering builds the client, sync and screens | — | — | 🔧 | |
| U-4-10 | p. 11 | Bureau supplies the head of account, DDO/PD mapping, DSC custody | `ea/roles.ts:286-300`; `rt/dashboard/pfms/page.tsx` 👁 | SR › Set › Overview (3:10805) | ✅ | |

### §5 Functional Requirements (pp. 12–17)

| ID | BRD page | Requirement (plain words) | Prototype evidence | Figma evidence | Mark | Note |
|---|---|---|---|---|---|---|
| FR-NGO-001 | p. 12 | Application form asks for the PFMS payee code, with a confirmation tick | `ea/form-schema.ts:355-371`; `pfms/selectors.ts:57-68`; T:318 | NG › Bank Account Details — PFMS Payee Code (3:9624) | ✅ | Asked only where the NGO says the account is PFMS-registered; otherwise collected later on Project Bank Accounts |
| FR-NGO-002 | p. 12 | NGO enters and confirms account and IFSC; no sanction while incomplete | Form: `ea/form-schema.ts:340`. Refusal: `ea/workflow.ts:529-538`, `:570-572`; shown before the decision with Sanction disabled, `cmp/review-shell.tsx` (`bankGap`); T:298 | NG › Account Numbers Do Not Match (3:9600); Programme Director / Examine an Application / Bank Details Incomplete (103:12171) | ✅ | Closed 1 Oct 2026 |
| FR-NGO-003 | p. 12 | Bureau back-fills payee code and bank details on older files | `rt/dashboard/pfms/back-fill/page.tsx:61-64`, `:318-368`; `pfms/store.tsx:353-359` | SR › Leg › Bank Details Needed (3:11320), Enter Bank Details (Dialog) (3:10950), Back-Filled (3:11174) | ✅ | Only the last four digits are kept (see F.3 account row) |
| FR-MDM-001 (a) | p. 12 | Synchronise Controller, PAO, DDO from PFMS | Imitated, `pfms/masters.ts:16-30` | — | 🔧 | |
| FR-MDM-001 (b) | p. 12 | Keep them for selection on the advice | `rt/dashboard/pfms/masters/page.tsx:41-43`; `cmp/pfms/advice-steps.tsx:66` 👁 | SR › Set › Master Data (3:10418) | ✅ | |
| FR-MDM-002 (a) | p. 12 | Synchronise Grant, Function Head, Object Head, Category | Imitated, `pfms/masters.ts:37-57` | — | 🔧 | |
| FR-MDM-002 (b) | p. 12 | Offer them as coded, validated choices | `cmp/pfms/advice-steps.tsx:190-235`; `pfms/advice.ts:206-209` | PA › Prep › Step 2 (3:14558) | ✅ | |
| FR-MDM-003 (a) | p. 12 | Synchronise the PD code for each DDO | Imitated, `pfms/masters.ts:31-36` | — | 🔧 | |
| FR-MDM-003 (b) | p. 12 | Keep the PD code mapped to its DDO and scheme | `cmp/pfms/advice-steps.tsx:79`; `pfms/advice.ts:190-192` | SR › Set › DDO and Division Codes (3:10468); PA › Prep › Step 1 (3:14676) | ✅ | |
| FR-MDM-004 (a) | p. 12 | Ask PFMS whether the DDO is e-Bill active | Imitated flag `pfms/masters.ts:29` | — | 🔧 | |
| FR-MDM-004 (b) | p. 12 | Warn the Maker about an inactive DDO before submission | `pfms/advice.ts:187`; `cmp/pfms/advice-steps.tsx:94-99`; T:131 👁 (dropdown reads "e-Bill not active") | SR › Set › DDO and Division Codes (3:10468); PA › Prep › Step 1 of 5 — DDO Not Active for e-Bills (92:220803) | ✅ | Closed 1 Oct 2026 |
| FR-MDM-005 (a) | p. 12 | Refresh master data on a schedule | Only the age is measured, `pfms/masters.ts:93-101` | — | 🔧 | |
| FR-MDM-005 (b) | p. 12 | Let an administrator refresh on demand | `rt/dashboard/pfms/masters/page.tsx:63`; `pfms/store.tsx:334` 👁 ("Refresh Master Data") | SR › Set › Master Data (3:10418), Master Data — Out of Date (3:9962) | ✅ | |
| FR-HOA-001 | p. 12 | Head of account as four coded parts (13, 2, category, 3) | `cmp/pfms/advice-steps.tsx:190-235`; `rt/dashboard/pfms/heads-of-account/page.tsx:295-304` | PA › Prep › Step 2 (3:14558); SR › Set › Heads of Account (3:10593) | ✅ | |
| FR-HOA-002 | p. 13 | Bureau configures heads for all five schemes, even without a PFMS code | `rt/dashboard/pfms/heads-of-account/page.tsx`; `pfms/masters.ts:63-100` (five schemes; Mode 1 and SMILE without a code); Add Scheme | SR › Set › Heads of Account (3:10593) | ✅ | Mode 1 has heads but no application form yet (question 14) |
| FR-HOA-003 | p. 13 | Retrofit heads on issued sanctions not yet sent | `rt/dashboard/pfms/back-fill/page.tsx:378-450`; `pfms/store.tsx:361-366` | SR › Leg › Heads to Retrofit (3:11109), Set Head of Account (Dialog) (3:10879) | ✅ | Only while the advice is with the Maker (`advice.ts:261-263`) |
| FR-PDM-001 | p. 14 | Maker queue by sanction date; fresh versus PFMS-returned | `pfms/selectors.ts:110-138`; `rt/dashboard/payments/prepare/page.tsx:33`, `:64-69` 👁 | PA › Prep › Payment Advices / New (3:14977), Returned by Checker (3:14924), Not Accepted by PFMS (3:14871), Returned by PFMS (93:19213), Drafts (117:22639), Drafts — Empty (3:14816), On Hold (3:14736); phone New (3:13859) and Returned by PFMS (117:22528) | ✅ | — |
| FR-PDM-002 | p. 14 | Header pre-filled: number, date, amount, year, IFD number and date, bank | `pfms/selectors.ts:153-170`; `cmp/pfms/advice-steps.tsx:58-63`; T:111 👁 | PA › Prep › Step 1 (3:14676) | ✅ | IFD number is derived, not read from the cost sheet (`selectors.ts:157-159`) |
| FR-PDM-003 | p. 14 | Maker picks DDO and PD code from the master | `cmp/pfms/advice-steps.tsx:66-90`; `pfms/advice.ts:184-192` 👁 | PA › Prep › Step 1 (3:14676), Step 1 — Errors (3:14615) | ✅ | |
| FR-PDM-004 | p. 14 | Coded heads for the amount and each deduction; heads add up to the sanction | `pfms/advice.ts:199-215`, `:228-233`; `cmp/pfms/advice-steps.tsx:279`; T:306 | PA › Prep › Step 2 (3:14558), Heads Do Not Add Up (3:14501), Step 3 — With a Deduction (3:14386) | ✅ | |
| FR-PDM-005 | p. 14 | Bill number unique per DDO per year; bill date is the preparation date | `pfms/advice.ts:92-99`; `pfms/store.tsx:243`, `:254-256`; T:150 | PA › Prep › Step 1 (3:14676) | ✅ | |
| FR-PDM-006 | p. 14 | Fixed values: 528, 14, F (or R on a returned bill), 7 | `pfms/advice.ts` `billStatusOf`, `fixedValuesFor`; T "a bill returned by PFMS without cancellation…" | PA › Prep › Returned by PFMS (93:19594) shows "R — Returned bill, resubmitted" | ✅ | R when a bill PFMS returned without cancelling is resent; PFMS to confirm (question 4) |
| FR-PDM-007 | p. 14 | Payee code, name, account, IFSC, gross, net, remarks; edit only where PFMS permits | `cmp/pfms/advice-steps.tsx:311-404`; `pfms/advice.ts:221-240` | PA › Prep › Step 3 of 5 — Beneficiary Payment (3:14449) | ✅ | Which fields PFMS permits is the prototype's choice; the BRD does not list them |
| FR-PDM-008 | p. 14 | One Claim Reference Number per payee, from the pool | `pfms/advice.ts:274-291`, `:298`; T:174 | PA › Prep › Step 3 (3:14449); PA › Auth › Approve and Sign (3:13204) | ✅ | Drawn at Submit, not at step 2 as Figure 3 (p. 26) shows |
| FR-PDM-009 | p. 14 | Attach Claim, Sanction, Bill, PAO Pass Order; hash; view link; tiers | `cmp/pfms/advice-steps.tsx:425-505`; `pfms/advice.ts:72-76`, `:244-247`; T:157 | PA › Prep › Step 4 (3:14297) | ✅ | |
| FR-PDM-010 | p. 14 | Save as draft and resume later | `pfms/advice.ts:266-271`; `rt/dashboard/payments/prepare/[appId]/page.tsx:275` 👁 | Every step frame, e.g. PA › Prep › Step 1 (3:14676) | ✅ | |
| FR-PDM-011 | p. 15 | Submit to the Checker; locked until returned | `pfms/advice.ts:261-263`, `:294-315`; `rt/dashboard/payments/prepare/[appId]/page.tsx:125-136`, `:320` | PA › Prep › Step 5 of 5 — Review and Submit (3:14222), Payment Advice / With the Checker (3:13884) | ✅ | |
| FR-PDM-012 | p. 15 | A fresh, never-reused identifier per request; a resend points back | `pfms/store.tsx:199`; `pfms/advice.ts:395-399`; `pfms/simulator.ts:116-129`; T:213 | PA › Fol › Bill with DDO (3:12000) "a resend points back to the one before it" | ✅ | Minted in the browser here; on the server in production |
| FR-PDC-001 | p. 16 | Checker queue of submitted advices | `rt/dashboard/payments/authorise/page.tsx:23-40` 👁 | PA › Auth › Awaiting Authorisation (3:13375), Authorised by You (3:13296) | ✅ | |
| FR-PDC-002 | p. 16 | Read-only mirror beside the sanction order | `rt/dashboard/payments/authorise/[appId]/page.tsx:62`, `:109-125` 👁 | PA › Auth › Approve and Sign (3:13204) | ✅ | |
| FR-PDC-003 | p. 16 | Return with a required remark; sanction untouched | `pfms/advice.ts:318-333`; `rt/…/authorise/[appId]/page.tsx:199`, `:215`; T:195 | PA › Auth › Return to Maker — Reason Missing (3:13111); PA › Prep › Returned by the Checker (3:14069) | ✅ | |
| FR-PDC-004 (a) | p. 16 | Sign cryptographically with the Checker's DSC | Imitated by the demo rail, `cmp/demo-pfms-panel.tsx:86-95` | — | 🔧 | Needs the DSC utility the Ministry uses (open question 10) |
| FR-PDC-004 (b) | p. 16 | No sending without a valid DSC; record signer and time | `pfms/advice.ts:363-375`, `:412`; `cmp/pfms/sign-dialog.tsx:95-146` | PA › Auth › Approve and Sign (Dialog) (3:12799), Signing (3:12694), No DSC Token Found (3:12488), Signing Utility Not Running (3:12385), Certificate Has Expired (3:12282) | ✅ | |
| FR-PDC-005 (a) | p. 16 | Call ReceiveSanctionData exactly once | Imitated, `pfms/simulator.ts:20-35` | — | 🔧 | |
| FR-PDC-005 (b) | p. 16 | Refuse a second, concurrent send of the same identifier | `pfms/advice.ts:394-395`; `cmp/pfms/sign-dialog.tsx:95` (dialog cannot close while signing); T:213 | PA › Auth › Signing (Dialog) (3:12694) | ✅ | |
| FR-PDC-006 | p. 16 | Sanction number, amount and authority cannot be changed | `pfms/selectors.ts:140-170`; `cmp/pfms/advice-steps.tsx:58`; T:195 | PA › Prep › Step 1 (3:14676); PA › Auth › Approve and Sign (3:13204) | ✅ | |
| FR-SNC-001 | p. 16 | Auth code, 15-minute access token, 30-minute refresh, silent renewal | — | — | 🔧 | Never shown to a user, by design |
| FR-SNC-002 | p. 16 | All calls from and to whitelisted IP addresses | — | — | 🔧 | |
| FR-SNC-003 (a) | p. 16 | One call per bill carrying everything | Imitated | — | 🔧 | |
| FR-SNC-003 (b) | p. 16 | The advice holds the whole payload in one record | `pfms/types.ts` `PaymentAdvice`; `cmp/pfms/advice-summary.tsx` | PA › Prep › Step 5 (3:14222) | ✅ | |
| FR-SNC-004 | p. 16 | Resend only under a new identifier, after a failure or a cancellation | After a failure: `pfms/advice.ts` (previous identifier); after a cancellation, lapse or failed credit: `restartAdvice`, Start a Fresh Payment Advice; T "a failed bank credit…" | PA › Fol › Returned and Cancelled (3:11723); PA › Prep › A Fresh Payment Advice (93:20040) | ✅ | Position for discussion (plan §4, question 3); built and drawn so it can be judged |
| FR-STS-001 (a) | p. 17 | Poll GetRequestStatus until Closed or Cancelled | Imitated by the demo rail | — | 🔧 | |
| FR-STS-001 (b) | p. 17 | Show the current status, using Annexure C | `pfms/stages.ts:77-108`, `:171-180`; T:39 👁 | PA › Fol › Bill with DDO (3:12000), Paid (3:11915) | ✅ | |
| FR-STS-002 (a) | p. 17 | Fetch bill and voucher details | Imitated, `pfms/simulator.ts:70-83` | — | 🔧 | |
| FR-STS-002 (b) | p. 17 | Show bill number and date, token number and date | `rt/finance/payment-status/[appId]/page.tsx:173-184` 👁 | PA › Fol › Paid (3:11915) | ✅ | |
| FR-STS-003 (a) | p. 17 | Fetch each payee's payment status | Imitated | — | 🔧 | |
| FR-STS-003 (b) | p. 17 | Record UTR, scroll status and scroll date per payee | `rt/finance/payment-status/[appId]/page.tsx:193-210`; Credit Failed at Bank stage, `pfms/stages.ts`; demo rail "Bank Fails the Credit" | PA › Fol › Paid (3:11915), Credit Failed at Bank (92:219954); NG › Bank Account Needs Checking (100:40177) | ✅ | Position for discussion (plan §4, question 13); built and drawn so it can be judged |
| FR-STS-004 (a) | p. 17 | Fetch the RD/TD feed periodically | A button stands in, `pfms/store.tsx:391-399` | — | 🔧 | |
| FR-STS-004 (b) | p. 17 | Reconcile and flag mismatches | `pfms/reports.ts:72-104`; T:277 | SR › Rep › Disbursement Reconciliation (3:8279) | ✅ | |
| FR-STS-005 | p. 17 | Show PFMS's own return-order document through its link | Return Order names who returned it and opens a marked sample memo, `rt/finance/payment-status/[appId]/page.tsx` (`RETURN_MEMO_SAMPLE`) | PA › Fol › Return Order (Dialog) (3:11388), Return Memo (PFMS) row | ⏸ | The screen is built and drawn; PFMS's own link is owed by NeGD (question 15) |
| FR-STS-006 | p. 17 | PFMS error codes shown as plain words, from a maintained list | `pfms/errors.ts:30-126`; `rt/dashboard/pfms/error-messages/page.tsx:100-192`; T:265 | PA › Prep › Not Accepted by PFMS (3:14011); SR › Set › Error Messages (3:10127), Edit Message (Dialog) (3:9778) | ✅ | Eight of ten codes are invented placeholders |
| FR-NTF-001 | p. 17 | Tell the NGO only when a UTR is captured | `pfms/simulator.ts:90`; `pfms/store.tsx:202-211`, `:314`; `ea/workflow.ts:724`; T:236 | NG › Notifications / Grant Credited (3:9047) | ✅ | The NGO's page shows "Payment in Process" earlier; that is not a notification (open question 7) |
| FR-NTF-002 | p. 17 | The notice gives sanction number, amount and UTR | `ea/workflow.ts:735`; `ea/store/store.tsx:237-248`, `:431` | NG › Notifications / Grant Credited (3:9047) | ✅ | |
| FR-DOC-001 | p. 17 | SHA-256 of each PDF's bytes, Base64-encoded | `cmp/pfms/advice-steps.tsx:425-435` | PA › Prep › Step 4 (3:14297) | ✅ | Computed in the browser here |
| FR-DOC-002 (a) | p. 17 | Link built from the identifier, a credential hash and a tick timestamp | — | — | 🔧 | |
| FR-DOC-002 (b) | p. 17 | A single-use, time-boxed link per document | `pfms/advice.ts:437-448`; `cmp/pfms/advice-steps.tsx:447`, `:502` | PA › Prep › Step 4 (3:14297) | ✅ | Seven days is the prototype's own number |
| FR-DOC-003 (a) | p. 17 | Draw numbers from PFMS in batches | Imitated, `pfms/reports.ts:167-172` | — | 🔧 | |
| FR-DOC-003 (b) | p. 17 | Keep the pool by PD code and year; mark numbers used | `pfms/reports.ts:148-164`; `rt/dashboard/pfms/claim-references/page.tsx:119-143`; T:174, T:277 | SR › Set › Claim References (3:10253); SR › Rep › Claim Reference Pool (3:8072) | ✅ | |

### §6 Non-Functional Requirements (pp. 19–20)

| ID | BRD page | Requirement (plain words) | Prototype evidence | Figma evidence | Mark | Note |
|---|---|---|---|---|---|---|
| NFR-6.1-1 (a) | p. 19 | Round trip within a time budget; time out and queue | — | — | 🔧 | The BRD does not set the budget |
| NFR-6.1-1 (b) | p. 19 | A queued request is shown as waiting | `pfms/advice.ts:417-418`; `cmp/pfms/sign-dialog.tsx:146` | PA › Auth › Signed — Waiting to Resend (Dialog) (3:12083) | ✅ | |
| NFR-6.1-2 | p. 19 | Polling runs in the background and never blocks screens | — | — | 🔧 | |
| NFR-6.2-1 | p. 19 | A PFMS outage affects only PFMS functions ("Pending") | `pfms/stages.ts:63` | PA › Fol › Waiting to Resend (3:11856) | ✅ | Worded "Waiting to Resend", not "Pending" |
| NFR-6.2-2 (a) | p. 19 | Log every call with identifier, time and outcome | — | — | 🔧 | |
| NFR-6.2-2 (b) | p. 19 | Show the requests and their outcomes on the case | `rt/finance/payment-status/[appId]/page.tsx:222-255` 👁 | PA › Fol › Bill with DDO (3:12000) | ✅ | |
| NFR-6.3-1 | p. 19 | HTTPS only; tokens never stored in plain text or client logs | — | — | 🔧 | |
| NFR-6.3-2 | p. 19 | IP whitelisting both ways, changes communicated | — | — | 🔧 | |
| NFR-6.3-3 | p. 19 | DSC stays with the Checker; no private keys stored centrally | `cmp/pfms/sign-dialog.tsx:111`; only the certificate serial is kept, `pfms/store.tsx:295` | PA › Auth › Approve and Sign (Dialog) (3:12799) | ✅ | |
| NFR-6.3-4 | p. 19 | Documents kept per the Ministry's retention policy, reachable by the link | Prototype link expires in 7 days, `pfms/advice.ts:438` | — | ⏸ | Retention period is a Ministry decision. The BRD also contradicts itself: a single-use link cannot stay reachable for a retention period |
| NFR-6.4-1 | p. 19 | New schemes join by configuration, with no code change | Add Scheme creates a scheme's PFMS set-up without a code change | SR › Set › Add Scheme (Dialog) (98:10919) | ✅ | Closed 1 Oct 2026 |
| NFR-6.4-2 | p. 19 | Room for other bill types later without restructuring | Bill type is one constant, `pfms/advice.ts:57` | — | 🔧 | An architecture property of NeGD's client |
| NFR-6.5-1 | p. 19 | Linear wizard: header, heads, payee, documents, submit | `pfms/advice.ts:42-50` 👁 | PA › Prep › Steps 1–5 | ✅ | |
| NFR-6.5-2 | p. 19 | Inline validation before submission | `pfms/advice.ts:170-250`; T:119 👁 ("2 things need attention on this step") | PA › Prep › Step 1 — Errors (3:14615), Heads Do Not Add Up (3:14501), Not Ready to Submit (3:14145) | ✅ | |
| NFR-6.6-1 | p. 20 | Follow the published PFMS JSON specifications strictly | Field names follow Annexure A in `pfms/types.ts` | — | 🔧 | The prototype does not have the specifications |
| NFR-6.6-2 | p. 20 | Work with the Ministry's existing DSC tokens | — | Dialogs drawn generically (3:12385, 3:12488) | 🔧 | Open question 10 |

### §7 Business Rules (pp. 21–22)

| ID | BRD page | Requirement (plain words) | Prototype evidence | Figma evidence | Mark | Note |
|---|---|---|---|---|---|---|
| BR-NGO-001 | p. 21 | Not sent to PFMS without bank, IFSC and payee code | `pfms/selectors.ts:17-38`, `:71-100`; `pfms/advice.ts:222-224` | PA › Prep › On Hold (3:14736); PA › Fol › On Hold — Bank Details Needed (3:11685); SR › Leg › Payee Code Needed (3:11260) | ✅ | |
| BR-SNC-001 (a) | p. 21 | One call is one bill; no split sending | Imitated | — | 🔧 | |
| BR-SNC-001 (b) | p. 21 | One advice per sanctioned file | `pfms/selectors.ts:84-86`; T:71 | PA › Prep › Step 5 (3:14222) | ✅ | |
| BR-SNC-002 | p. 21 | Maker and Checker never reopen or alter the sanction | `pfms/advice.ts:318-333`; T:195 | PA › Auth › Approve and Sign (3:13204) | ✅ | |
| BR-SNC-003 | p. 21 | Bill type always 7 | `pfms/advice.ts:57` | PA › Prep › Step 1 (3:14676) | ✅ | |
| BR-SNC-004 | p. 21 | Bill number unique per DDO per year | `pfms/advice.ts:92-99`; `pfms/store.tsx:300-304`; T:150 | PA › Prep › Not Accepted by PFMS — Bill Number Already Used (3:13950) | ✅ | |
| BR-SNC-005 | p. 21 | Claim Reference required for an eSanction; only pool numbers accepted | `pfms/advice.ts:274-291`; T:174 | PA › Prep › Step 3 (3:14449) | ✅ | |
| BR-DOC-001 | p. 21 | Required document hashes rise with the landing status | `pfms/advice.ts:72-76`; T:157 | PA › Prep › Step 4 (3:14297) | ✅ | Landing per DDO is assumed (open question 9) |
| BR-DSC-001 | p. 21 | Only the DDO's designated Checker may sign | `pfms/advice.ts:371-372`; T:204 | SR › Set › Maker and Checker (3:10013); PA › Auth › Not the Designated Checker (92:220407) | ✅ | Closed 1 Oct 2026 |
| BR-NTF-001 | p. 21 | NGO notified only on a UTR | As FR-NTF-001 | NG › Notifications / Grant Credited (3:9047) | ✅ | |
| BR-CAN-001 | p. 21 | A cancelled sanction is never revived; a new one starts afresh | No revival: `pfms/advice.ts` `canResubmit`; a fresh advice: `restartAdvice`; T:255 | PA › Fol › Returned and Cancelled (3:11723); PA › Prep › A Fresh Payment Advice (93:20040) | ✅ | Position for discussion (plan §4, question 3); built and drawn so it can be judged |
| BR-MDM-001 | p. 21 | Latest master data; an unknown combination blocks submission | `pfms/advice.ts:179-192`, `:206-209`; T:140 | SR › Set › Master Data — Out of Date (3:9962); PA › Prep › Not Ready to Submit (3:14145) | ✅ | |
| BR-BAK-001 | p. 21 | Older files without bank details go to back-fill first | `pfms/selectors.ts:71-82`, `:113` | PA › Prep › On Hold (3:14736); SR › Leg › Bank Details Needed (3:11320) | ✅ | |
| BR-AUTH-001 | p. 22 | An expired token is never reused | — | — | 🔧 | |

### §8 Workflows (pp. 23–29)

**§8.1 / §8.2 / §8.6 — the steps of Figures 1 and 2 (pp. 24–25, table p. 29)**

| ID | BRD page | Requirement (plain words) | Prototype evidence | Figma evidence | Mark | Note |
|---|---|---|---|---|---|---|
| WF-1 | p. 24 | NGO applies with bank account, IFSC and payee code | `ea/form-schema.ts:332-372` | NG › Bank Account Details — PFMS Payee Code (3:9624) | ✅ | |
| WF-2 | p. 24 | Review chain unchanged: Dealing Assistant → Section → Under Secretary | Untouched | — | ✅ | |
| WF-3 | p. 24 | Under Secretary issues the sanction | Unchanged, plus the bank check `ea/workflow.ts:570-572`; payment stage on `cmp/review-panels.tsx:212-237` | PA › Fol › Instalments — Awaiting Payment Advice (3:11559) | ✅ | |
| WF-4 | p. 24 | Maker prepares the payment advice | Routes `…/payments/prepare` 👁 | PA › Prep | ✅ | |
| WF-5 | p. 24 | Checker authorises and applies the DSC | Routes `…/payments/authorise` 👁 | PA › Auth | ✅ | |
| WF-6 | p. 24 | e-Anudaan calls ReceiveSanctionData once | Imitated | Outcome dialogs drawn (3:12591, 3:12179, 3:12083) | 🔧 | |
| WF-7 | p. 24 | Sanction lands at the DDO (inside PFMS) | Shown as "Received by PFMS" | PA › Fol › Bill with DDO (3:12000) stepper | ⏸ | PFMS's work |
| WF-8 | p. 24 | DDO prepares the RPR-34 bill; PAO passes it | Shown as "Bill with DDO", "Being Passed at PAO" | SR › Rep › Sanction Pipeline (3:8549) | ⏸ | PFMS's work |
| WF-9 | p. 24 | Bank makes the transfer; UTR generated | Shown as "Payment in Process", "Paid" | PA › Fol › Paid (3:11915) | ⏸ | Bank's work |
| WF-10 (a) | p. 24 | e-Anudaan polls status and pulls the feed | — | — | 🔧 | |
| WF-10 (b) | p. 24 | e-Anudaan records the UTR and notifies the NGO | `pfms/store.tsx:202-211` | NG › Notifications / Grant Credited (3:9047) | ✅ | |
| WF-11 | p. 25 | NGO notified, on confirmed credit only (Figure 2's last step) | As FR-NTF-001 | NG › Application Details / Grant Credited (3:9134) | ✅ | |

**§8.3 — the US-PD user journey (Figure 3, p. 26)**

| ID | BRD page | Requirement (plain words) | Prototype evidence | Figma evidence | Mark | Note |
|---|---|---|---|---|---|---|
| J-1 | p. 26 | Maker signs in to the workspace | `ea/roles.ts:250-266` 👁 | *Everyone · Signing In* › Officer Sign-In | ✅ | |
| J-2 | p. 26 | Queue of sanctioned files awaiting an advice | As FR-PDM-001 👁 | PA › Prep › Payment Advices / New (3:14977) | ✅ | |
| J-3 | p. 26 | Opening a case pre-fills sanction, IFD, bank and payee code | As FR-PDM-002 👁 | PA › Prep › Step 1 (3:14676) | ✅ | |
| J-4 | p. 26 | Maker selects coded heads and DDO / PD code | As FR-PDM-003/004 | PA › Prep › Step 1, Step 2 | ✅ | |
| J-5 | p. 26 | System generates bill number and takes a Claim Reference Number | `pfms/store.tsx:243`; `pfms/advice.ts:298` | PA › Prep › Step 1, Step 3 | ✅ | The number is taken at Submit, later than Figure 3 shows |
| J-6 | p. 26 | Maker uploads documents; hash and link computed | As FR-PDM-009 | PA › Prep › Step 4 (3:14297) | ✅ | |
| J-7 | p. 26 | Decision: submit, or save as draft and return to queue | `pfms/advice.ts:266-315` | PA › Prep › Step 5 (3:14222) | ✅ | |
| J-8 | p. 26 | Advice moves to the Checker queue | `pfms/advice.ts:305` | PA › Prep › With the Checker (3:13884) | ✅ | |
| J-9 | p. 26 | Checker compares the advice with the sanction order | As FR-PDC-002 👁 | PA › Auth › Approve and Sign (3:13204) | ✅ | |
| J-10 | p. 26 | Decision: approve, or return to Maker with remarks | As FR-PDC-003 | PA › Auth › Return to Maker — Reason Missing (3:13111) | ✅ | |
| J-11 | p. 26 | Checker applies the DSC | As FR-PDC-004 (b) | PA › Auth › Signing (Dialog) (3:12694) | ✅ | Signing imitated |
| J-12 | p. 26 | e-Anudaan calls ReceiveSanctionData | Imitated | — | 🔧 | |
| J-13 | p. 26 | Failed: errors shown on the case; Maker corrects and resends | `rt/dashboard/payments/prepare/[appId]/page.tsx:208`, `:294` | PA › Prep › Not Accepted by PFMS (3:14011) | ✅ | |
| J-14 | p. 26 | Success: status shown; automatic polling begins | `pfms/advice.ts:414-415` | PA › Auth › Received by PFMS (Dialog) (3:12591) | ✅ | Figure 3 says "Submitted/Created"; the screen says "Received by PFMS". Polling is 🔧 (WF-10 a) |
| J-15 | p. 26 | Exit: UTR captured; case closed; NGO notified | `pfms/simulator.ts:77-91` 👁 (closed case) | PA › Fol › Paid (3:11915) | ✅ | |

**§8.4 — data stores of the data flow diagram (Figure 4, p. 27)**

| ID | BRD page | Requirement (plain words) | Prototype evidence | Figma evidence | Mark | Note |
|---|---|---|---|---|---|---|
| D1 | p. 27 | Application and sanction case data | e-Anudaan's main store (`ea/store/`) | — | ✅ | Exists already; nothing new to draw |
| D2 | p. 27 | PFMS master data cache | Imitated, `pfms/masters.ts:16-59` | SR › Set › Master Data (3:10418) shows it | 🔧 | |
| D3 | p. 27 | Claim Reference Number pool | Imitated in browser storage, `pfms/store.tsx:368-372` | SR › Set › Claim References (3:10253) shows it | 🔧 | |
| D4 | p. 27 | Sanction / payment status and UTR log | Imitated, `pfms/types.ts` `PfmsRequest` | PA › Fol › Paid (3:11915) shows it | 🔧 | |

**§8.5 — exception flows (Figure 5 and table, p. 28)**

| ID | BRD page | Requirement (plain words) | Prototype evidence | Figma evidence | Mark | Note |
|---|---|---|---|---|---|---|
| EX-1 | p. 28 | Validation failure: not sent, errors shown by field, corrected and resent | `pfms/advice.ts:420-428`; `rt/dashboard/payments/prepare/[appId]/page.tsx:208`, `:294`; T:213 | PA › Auth › PFMS Did Not Accept the Advice (Dialog) (3:12179); PA › Prep › Not Accepted by PFMS (3:14011); PA › Fol › Not Accepted by PFMS (3:11797) | ✅ | |
| EX-2 | p. 28 | Returned and cancelled higher up: reason shown; a fresh sanction must start | `rt/finance/payment-status/[appId]/page.tsx` (cancelled notice with Start a Fresh Payment Advice) | PA › Fol › Returned and Cancelled (3:11723), Return Order (Dialog) (3:11388) | ✅ | Position for discussion (plan §4, question 3); built and drawn so it can be judged |
| EX-3 | p. 28 | Token expired mid-call: refresh, log in again, retry | — | — | 🔧 | |
| EX-4 (a) | p. 28 | PFMS unreachable: retry at set intervals | Demo rail stands in, `pfms/simulator.ts:116-140` | — | 🔧 | |
| EX-4 (b) | p. 28 | Case shown as waiting; the rest of the portal unaffected | `pfms/stages.ts:63`; `cmp/pfms/sign-dialog.tsx:146` | PA › Fol › Waiting to Resend (3:11856); PA › Auth › Signed — Waiting to Resend (Dialog) (3:12083) | ✅ | |
| EX-5 | p. 28 | Bill number already used (ERRSNC44): Maker told; number regenerated | `pfms/errors.ts:40-46`; `pfms/store.tsx:300-304` | PA › Prep › Not Accepted by PFMS — Bill Number Already Used (3:13950) | ✅ | |

### §9 Risks and Dependencies (p. 30)

| ID | BRD page | Requirement (plain words) | Prototype evidence | Figma evidence | Mark | Note |
|---|---|---|---|---|---|---|
| RD-1 | p. 30 | Bureau has not finalised the coded heads of account | Codes illustrative, `pfms/masters.ts:1-12` | — | ⏸ | Critical path |
| RD-2 | p. 30 | PFMS has not allotted codes for SHRESTHA Mode 1 and SMILE | SMILE shown "Scheme Code Awaited", `pfms/selectors.ts:34-37` | SR › Set › Heads of Account (3:10593) | ⏸ | Mode 1 is not represented at all |
| RD-3 | p. 30 | PFMS registration, credentials and IP whitelisting pending | — | — | ⏸ | Blocks every call |
| RD-4 | p. 30 | Older files lack bank details | Tool built (FR-NGO-003) | SR › Leg (3:11320) | ⏸ | The Bureau must do the back-filling |
| RD-5 | p. 30 | DSC custody and Checker nominations not confirmed | — | — | ⏸ | |
| RD-6 | p. 30 | SHRESTHA payment mode and Monthly Expenditure Plan undecided | `pfms/masters.ts:81` | SR › Set › Heads of Account (3:10593) "Decision Awaited" | ⏸ | |
| RD-7 | p. 30 | UAT and a PFMS officer not provided | — | — | ⏸ | |
| RD-8 | p. 30 | One bad field rejects the whole bill | Mitigated by local checks, `pfms/advice.ts:1-11`, `:170-250` 👁 | PA › Prep › Step 5 — Not Ready to Submit (3:14145) | ✅ | |
| RD-9 | p. 30 | PFMS may change its contract independently | — | — | ⏸ | Governance |

### §10 Assumptions and Constraints (p. 31)

| ID | BRD page | Requirement (plain words) | Prototype evidence | Figma evidence | Mark | Note |
|---|---|---|---|---|---|---|
| AS-1 | p. 31 | Based on the 27 Aug meeting and PFMS's specifications, which govern | `pfms/errors.ts:9-11` notes the specification is not in hand | — | ⏸ | |
| AS-2 | p. 31 | Only e-payment 528 and bill type 7 | `pfms/advice.ts:53-59` | PA › Prep › Step 1 (3:14676) | ✅ | |
| AS-3 | p. 31 | Review chain unchanged | Untouched | — | ✅ | |
| AS-4 | p. 31 | NGO's own bank and payee entries taken at face value | `ea/form-schema.ts:340-371` | NG › Bank Account Details — PFMS Payee Code (3:9624) | ✅ | |
| AS-5 | p. 31 | Codes 3817, 3968, 3964, 971, 1805 available; Mode 1 and SMILE allotted before go-live | `pfms/masters.ts:66`, `:72`, `:78`, `:86` | SR › Set › Heads of Account (3:10593) | ⏸ | The three e-Anudaan codes match the BRD |
| AS-6 | p. 31 | Masters kept current; stale or missing blocks submission | As BR-MDM-001 | SR › Set › Master Data — Out of Date (3:9962) | ✅ | |
| AS-7 | p. 31 | Maker and Checker are different officers | `pfms/advice.ts:370`; `pfms/store.tsx:382`, `:386`; T:204 | PA › Auth › You Prepared This Advice (3:13018) | ✅ | The BRD calls it an assumption, not a rule (open question 1) |

### §11 Dashboards and KPIs (p. 32)

| ID | BRD page | Requirement (plain words) | Prototype evidence | Figma evidence | Mark | Note |
|---|---|---|---|---|---|---|
| KPI-1 | p. 32 | Sanction Pipeline: count by PFMS status | `pfms/reports.ts:17-22`; `rt/dashboard/payment-reports/page.tsx:280-300` 👁 | SR › Rep › Sanction Pipeline (3:8549), Mobile (3:7943) | ✅ | In plain stages (open question 6) |
| KPI-2 | p. 32 | Ageing: days at each stage, DDO by DDO, over a threshold | `pfms/reports.ts:41-60`; `rt/dashboard/payment-reports/page.tsx:354-470` | SR › Rep › Ageing (3:8412) | ✅ | |
| KPI-3 | p. 32 | Reconciliation: sanctioned, credited, UTR, against RD/TD | `pfms/reports.ts:93-104`; `rt/dashboard/payment-reports/page.tsx:488-571` | SR › Rep › Disbursement Reconciliation (3:8279) | ✅ | |
| KPI-4 | p. 32 | Failure trend by error family over time | `pfms/reports.ts:114-136`; `rt/dashboard/payment-reports/page.tsx:613` | SR › Rep › Failure Trend (3:8228) | ✅ | |
| KPI-5 | p. 32 | Claim Reference pool by PD code and year | `pfms/reports.ts:152-164` | SR › Rep › Claim Reference Pool (3:8072) | ✅ | |
| KPI-6 | p. 32 | Turnaround: sanction to UTR, average and outliers, by scheme | `pfms/reports.ts:185-206`; `rt/dashboard/payment-reports/page.tsx:761` | SR › Rep › Turnaround (3:7995) | ✅ | Outlier shown as the longest case |

### §13 Annexures (pp. 34–42)

**Annexure A — payload fields that appear only in Annexure A** (pp. 34–35; every other Annexure A field is the same field as an Annexure F row below, and is checked there)

| ID | BRD page | Requirement (plain words) | Prototype evidence | Figma evidence | Mark | Note |
|---|---|---|---|---|---|---|
| A-RequestSource | p. 34 | PFMS's code for e-Anudaan as the sender | — | — | 🔧 | A server constant |
| A-CreatedBy | p. 34 | Username of the authorised PD user | `preparedBy` kept, `pfms/advice.ts:154` | — | 🔧 | Set by the server |
| A-BatchId | p. 34 | Optional batch grouping | Not modelled | — | ⏸ | The BRD does not say when e-Anudaan would batch |
| A-CNAExceptionReason | p. 34 | Reason code, required for Object Head 33 | `pfms/advice.ts:216-218`; `cmp/pfms/advice-steps.tsx:262-270` | PA › Prep › Step 2 of 5 — CNA Exception Reason (93:20499) | ⏸ | Built and drawn; the reason-code list the BRD points to does not exist and is owed by PFMS / NeGD |
| A-ChequeCategory | p. 35 | Not used (e-payment only) | Correctly absent | Correctly absent | ✅ | |

**Annexure B — bill type** (p. 36)

| ID | BRD page | Requirement (plain words) | Prototype evidence | Figma evidence | Mark | Note |
|---|---|---|---|---|---|---|
| B-7 | p. 36 | Only RPR type 7 is in scope | `pfms/advice.ts:57` | PA › Prep › Step 1 (3:14676) | ✅ | |

**Annexure C — PFMS statuses** (p. 37; mapped in `pfms/stages.ts:77-108`, tested by T:39)

| ID | BRD page | Requirement (plain words) | Prototype evidence | Figma evidence | Mark | Note |
|---|---|---|---|---|---|---|
| C-Created | p. 37 | Created at PFMS | `stages.ts:78` → Received by PFMS | PA › Auth › Received by PFMS (Dialog) (3:12591) | ✅ | |
| C-Submitted | p. 37 | Submitted by PD Maker | `stages.ts:79` → Received by PFMS | As above | ✅ | Open question 6 |
| C-PassByPDMaker | p. 37 | Passed by PD Maker | `stages.ts:80` | As above | ✅ | Open question 6 |
| C-PendingDSCPDChecker | p. 37 | Pending DSC at PD Checker | `stages.ts:81` | As above | ✅ | Open question 6 |
| C-Approved | p. 37 | Approved by PD Checker | `stages.ts:82` | As above | ✅ | Open question 6 |
| C-BillGenerated | p. 37 | Bill generated | `stages.ts:83` → Bill with DDO | PA › Fol › Bill with DDO (3:12000) | ✅ | |
| C-PendingDDODSC | p. 37 | Pending DSC at DDO | `stages.ts:84` | As above | ✅ | |
| C-DigitallySignedByDDO | p. 37 | Signed by DDO; at the bill distributor | `stages.ts:85` | As above | ✅ | |
| C-DH | p. 37 | Passed by Dealing Hand; pass order under DSC | `stages.ts:86-87` → Being Passed at PAO | PA › Fol stepper (3:12000); SR › Rep › Sanction Pipeline (3:8549) | ✅ | |
| C-AAO | p. 37 | Progressing through the AAO | `stages.ts:88-90` | As above | ✅ | |
| C-PAO | p. 37 | Progressing through the PAO | `stages.ts:91-93` | As above | ✅ | |
| C-PassedByPAO | p. 37 | Pass order signed by the PAO | `stages.ts:94` | As above | ✅ | |
| C-XML | p. 37 | XML and DSC batch generated | `stages.ts:95-96` → Payment in Process | PA › Fol stepper (3:12000) | ✅ | |
| C-Sign1/Sign2 | p. 37 | Batch file pending at signatory 1 or 2 | `stages.ts:97-98` | As above | ✅ | |
| C-DigitalSignatoryLast | p. 37 | Voucher generated | `stages.ts:99` | PA › Fol › Paid (3:11915) | ✅ | Becomes "Paid" once every payee has a UTR (`stages.ts:178`) |
| C-Closed | p. 37 | Closed (success, final) | `stages.ts:100` 👁 | PA › Fol › Paid (3:11915) | ✅ | |
| C-ReturnedBy | p. 37 | Returned at Dealing Hand, AAO, PAO, DDO or PD Checker | `stages.ts` maps all five incl. ReturnedByPDChecker; `pfms/simulator.ts` `returnByPfms`; demo rail "Return Without Cancelling" | PA › Fol › Returned by PFMS (91:15801); PA › Prep › Returned by PFMS (93:19594), Payment Advices / Returned by PFMS (93:19213) | ✅ | Closed 1 Oct 2026 |
| C-FinYrExpired | p. 37 | Financial year expired | `stages.ts`; `pfms/simulator.ts` `expireFinancialYear`; demo rail "Financial Year Expires" | PA › Fol › Financial Year Expired (91:16268) | ✅ | Closed 1 Oct 2026 |
| C-Cancelled | p. 37 | Returned and cancelled (final) | `stages.ts:107`; `pfms/simulator.ts:95-113`; T:255 | PA › Fol › Returned and Cancelled (3:11723) | ✅ | |

**Annexure D — the PFMS web methods** (p. 38). All are NeGD server work. The screen that shows each outcome is named.

| ID | BRD page | Requirement (plain words) | Prototype evidence | Figma evidence | Mark | Note |
|---|---|---|---|---|---|---|
| D-GetAuthCode | p. 38 | One-time auth code | — | — | 🔧 | No screen |
| D-LogIn | p. 38 | Swap the code for tokens | — | — | 🔧 | No screen |
| D-RefreshToken | p. 38 | Renew a token | — | — | 🔧 | No screen |
| D-ReceiveSanctionData | p. 38 | Send the sanction | `pfms/simulator.ts:20-35` imitates | Outcome: 3:12591, 3:12179, 3:12083 | 🔧 | |
| D-GetRequestStatus | p. 38 | Overall status | Imitated | Outcome: PA › Fol | 🔧 | |
| D-GetSanctionBillDetails | p. 38 | Bill details | Imitated | Outcome: Bill and Voucher on 3:12000 | 🔧 | |
| D-GetSanctionVoucherDetails | p. 38 | Voucher details | Imitated | Outcome: 3:11915 | 🔧 | |
| D-GetPayeeEPaymentDetails | p. 38 | Payee payment and UTR | Imitated | Outcome: 3:11915 | 🔧 | |
| D-GetPFMSMinistryReleaseAndTEData | p. 38 | Release and transfer-entry feed | Button stands in | Outcome: 3:8279 | 🔧 | |
| D-GetDDOeBillActivationStatus | p. 38 | DDO e-Bill check | Imitated flag | Outcome: 3:10468 | 🔧 | |
| D-GetDDO | p. 38 | DDO master | Imitated | Outcome: 3:10418 | 🔧 | |
| D-GetPAO | p. 38 | PAO master | Imitated | Outcome: 3:10418 | 🔧 | |
| D-GetController | p. 38 | Controller master | Imitated | Outcome: 3:10418 | 🔧 | |
| D-GetPDCode | p. 38 | PD code master | Imitated | Outcome: 3:10468 | 🔧 | |
| D-GetGrantNumber | p. 38 | Grant number master | Imitated | Outcome: 3:10418 | 🔧 | |
| D-GetFunctionHead | p. 38 | Function head master | Imitated | Outcome: 3:10418 | 🔧 | |
| D-GetObjectHead | p. 38 | Object head master | Imitated | Outcome: 3:10418 | 🔧 | |
| D-GetCategory | p. 38 | Category master | Imitated | Outcome: 3:10418 | 🔧 | |
| D-GetClaimReferenceNumber | p. 38 | Draw pool numbers | Imitated, `pfms/reports.ts:167-172` | Outcome: 3:10253 | 🔧 | |

**Annexure E — document type codes** (p. 39; `pfms/advice.ts:62-69`; all six labels found in PA › Prep › Step 4, 3:14297)

| ID | BRD page | Requirement (plain words) | Prototype evidence | Figma evidence | Mark | Note |
|---|---|---|---|---|---|---|
| E-1 | p. 39 | Claim | `advice.ts:63` | 3:14297 | ✅ | |
| E-2 | p. 39 | Sanction | `advice.ts:64` | 3:14297 | ✅ | |
| E-3 | p. 39 | Copy of Approved Notes | `advice.ts:65` | 3:14297 | ✅ | |
| E-4 | p. 39 | Bill | `advice.ts:66` | 3:14297 | ✅ | |
| E-5 | p. 39 | PAO Passing | `advice.ts:67` | 3:14297 | ✅ | |
| E-6 | p. 39 | Other | `advice.ts:68` | 3:14297 | ✅ | |

**Annexure F — the Maker's screen, field by field** (pp. 40–41; each also an Annexure A field, pp. 34–35)

| ID | BRD page | Requirement (plain words) | Prototype evidence | Figma evidence | Mark | Note |
|---|---|---|---|---|---|---|
| F.1-SanctionNumber | p. 40 | Sanction number, from the order | `pfms/selectors.ts:161` 👁 | PA › Prep › Step 1 (3:14676) | ✅ | |
| F.1-SanctionDate | p. 40 | Sanction date, from the order | `selectors.ts:162` 👁 | 3:14676 | ✅ | |
| F.1-SanctionAmount | p. 40 | Sanction amount, from the order | `selectors.ts:163` 👁 | 3:14676 | ✅ | |
| F.1-FinancialYear | p. 40 | Financial year (sent as the closing year, e.g. 2027) | `selectors.ts:164`; `pfms/advice.ts:85-89` 👁 | 3:14676 | ✅ | |
| F.1-IFDNumber | p. 40 | IFD concurrence number, from the cost sheet | `selectors.ts:157-165` 👁 | 3:14676 | ✅ | Derived, illustrative |
| F.1-IFDDate | p. 40 | IFD concurrence date | `selectors.ts:155-156` 👁 | 3:14676 | ✅ | |
| F.1-SchemeCode | p. 40 | Numeric PFMS scheme code | `selectors.ts:168` 👁 | 3:14676 | ✅ | |
| F.1-DDOCode | p. 40 | 6-digit DDO, chosen by the Maker | `cmp/pfms/advice-steps.tsx:66` 👁 | 3:14676 | ✅ | |
| F.1-PDCode | p. 40 | 8-digit PD code, chosen by the Maker | `advice-steps.tsx:79` 👁 | 3:14676 | ✅ | |
| F.1-PaymentMode | p. 40 | Fixed: 528 e-payment | `pfms/advice.ts:55` 👁 | 3:14676 | ✅ | |
| F.1-SanctionType | p. 40 | Fixed: 14 Expenditure | `advice.ts:56` 👁 | 3:14676 | ✅ | |
| F.1-RPRType | p. 40 | Fixed: 7 RPR-34 | `advice.ts:57` 👁 | 3:14676 | ✅ | |
| F.1-BillStatus | p. 40 | F, or R on a resubmission | `pfms/advice.ts` `billStatusOf` | PA › Prep › Returned by PFMS (93:19594) | ✅ | Closed 1 Oct 2026 |
| F.1-BillNumber | p. 40 | Generated per DDO per year | `advice.ts:92-99` | 3:14676 | ✅ | |
| F.1-BillDate | p. 40 | Date of preparation | `advice.ts:142` 👁 | 3:14676 | ✅ | |
| F.1-NPBDate | p. 40 | Not Payable Before date (optional) | `advice-steps.tsx:124`; `advice.ts:194-196` 👁 | 3:14676 | ✅ | |
| F.1-IsESanction | p. 40 | Fixed: 1 | `advice.ts:58` 👁 | 3:14676 | ✅ | |
| F.1-UniqueIdentifier | p. 40 | System-generated request identifier | `pfms/store.tsx:199`; `advice-steps.tsx:117` 👁 | 3:14676; PA › Fol (3:12000) | ✅ | |
| F.1-PreviousUniqueIdentifier | p. 40 | Set only on a resend | `advice.ts:399`; `rt/finance/payment-status/[appId]/page.tsx:234` | PA › Fol › Bill with DDO (3:12000) | ✅ | |
| F.2-FunctionHead | p. 40 | 13-digit Function Head | `advice-steps.tsx:190` | PA › Prep › Step 2 (3:14558) | ✅ | |
| F.2-ObjectHead | p. 40 | 2-digit Object Head | `advice-steps.tsx:202` | 3:14558 | ✅ | |
| F.2-Category | p. 40 | Category | `advice-steps.tsx:214` | 3:14558 | ✅ | |
| F.2-GrantNumber | p. 40 | 3-digit Grant Number | `advice-steps.tsx:226` | 3:14558 | ✅ | |
| F.2-Amount | p. 40 | Amount against the head; heads sum to the sanction | `advice-steps.tsx:242`; `advice.ts:143`, `:213-215` | 3:14558, Heads Do Not Add Up (3:14501) | ✅ | |
| F.3-Name | p. 40 | NGO name as per PFMS | `advice-steps.tsx:311` 👁 | PA › Prep › Step 3 (3:14449) | ✅ | |
| F.3-PayeeCode | p. 40 | PFMS unique / payee code | `advice-steps.tsx:311-312`; `advice.ts:222` 👁 | 3:14449 | ✅ | |
| F.3-AccountNumber | p. 41 | Bank account number, confirmed | `advice.ts:223` 👁 (shown masked) | 3:14449 | ✅ | The prototype keeps only the last four digits; the real payload needs the full number from the server |
| F.3-IFSC | p. 41 | IFSC, confirmed | `advice.ts:224` 👁 | 3:14449 | ✅ | |
| F.3-Gross | p. 41 | Gross amount | `advice-steps.tsx:332` 👁 | 3:14449 | ✅ | |
| F.3-Net | p. 41 | Net = gross minus deductions | `advice.ts:105-107` 👁 | 3:14449 | ✅ | |
| F.3-Remarks | p. 41 | Payee remarks, at most 25 characters | `advice.ts:109`, `:234-235`; `advice-steps.tsx:391-398`; T:131 👁 | 3:14449 | ✅ | |
| F.3-ClaimReference | p. 41 | Claim Reference Number from the pool | `advice-steps.tsx:404`; `advice.ts:274-291` 👁 | 3:14449 | ✅ | |
| F.3-Deduction | p. 41 | Deduction heads and amounts, where a deduction applies (AccountType D) | `advice-steps.tsx:347-387`; `advice.ts:228-233`; T:306 | PA › Prep › Step 3 — With a Deduction (3:14386) | ✅ | |
| F.4-DocumentType | p. 41 | Type, required by landing tier | `advice-steps.tsx:481-490` | PA › Prep › Step 4 (3:14297) | ✅ | |
| F.4-DocumentName | p. 41 | Document name | `advice.ts:442` | 3:14297 | ✅ | |
| F.4-DocumentHash | p. 41 | SHA-256, computed on upload | `advice-steps.tsx:425-435`, `:501` | 3:14297 | ✅ | |
| F.4-ViewLink | p. 41 | Single-use link | `advice-steps.tsx:447`, `:502` | 3:14297 | ✅ | |
| F-SaveAsDraft | p. 41 | Control: Save as Draft | `rt/dashboard/payments/prepare/[appId]/page.tsx:275` 👁 | 3:14676 and every step | ✅ | |
| F-Submit | p. 41 | Control: Submit for Authorisation, then locked | `…/prepare/[appId]/page.tsx:320`, `:125-136` | PA › Prep › Step 5 (3:14222) | ✅ | |

**Annexure G — the Checker's screen** (p. 42)

| ID | BRD page | Requirement (plain words) | Prototype evidence | Figma evidence | Mark | Note |
|---|---|---|---|---|---|---|
| G-Mirror | p. 42 | Everything from Annexure F, read-only | `rt/dashboard/payments/authorise/[appId]/page.tsx:119-160` 👁 | PA › Auth › Approve and Sign (3:13204) | ✅ | |
| G-SanctionOrder | p. 42 | Original sanction order for comparison | `…/authorise/[appId]/page.tsx:109` 👁 | 3:13204 | ✅ | |
| G-Remarks | p. 42 | Checker remarks, required only when returning | `…/authorise/[appId]/page.tsx:215`; `pfms/advice.ts:321` | PA › Auth › Return to Maker — Reason Missing (3:13111) | ✅ | |
| G-DSC | p. 42 | The Checker's own DSC, required to approve | `cmp/pfms/sign-dialog.tsx:95-146` | PA › Auth › Approve and Sign (Dialog) (3:12799) | ✅ | Signing imitated |
| G-Approve | p. 42 | Action: Approve and Sign, then send | `…/authorise/[appId]/page.tsx:195` 👁 | 3:13204 | ✅ | |
| G-Return | p. 42 | Action: Return to Maker | `…/authorise/[appId]/page.tsx:199` 👁 | 3:13111 | ✅ | |

---

## Not Covered or Partly Covered

**Updated later on 1 Oct 2026, after the gaps were closed** (commits `b006109c` and `2166746f` on this
branch, and the Figma frames listed below). The first pass found eighteen 🟡 / 🟢 rows; none remain.
Four were closed by taking a position the BRD leaves open. Those positions are built and drawn so they
can be judged, and they are marked "Position for discussion" in the table. Three rows end ⏸ because
what is left is owed by someone else.

| # | Gap found | Rows | Now | Owner of what is left |
|---|---|---|---|---|
| 1 | SHRESTHA Mode 1 missing; no way to add a scheme | U-1.2-1, U-2.1-5, FR-HOA-002, NFR-6.4-1 | Mode 1 configured, awaiting its PFMS code; **Add Scheme** on Heads of Account. Figma: Heads of Account (3:10593), Overview (3:10805), Add Scheme (Dialog) (98:10919); the journey is now *Keeping PFMS Set-Up Current — Needs Discussion* | **The BA**: Mode 1's application fields and flow, before the full journey can be built (question 14). PFMS: its scheme code |
| 2 | No route after "Returned and Cancelled" | FR-SNC-004, BR-CAN-001, EX-2 | **Start a Fresh Payment Advice** (Maker), also after Financial Year Expired and a failed credit; earlier advice kept read-only; new request points back. Figma: 3:11723, A Fresh Payment Advice (93:20040) | NeGD and the Ministry confirm the position (question 3) |
| 3 | Bill Status "R" never used | FR-PDM-006, F.1-BillStatus | "R" when a bill PFMS returned **without** cancelling is resent. Figma: Returned by PFMS (93:19594) | PFMS confirms such returns happen for an e-Sanction (question 4) |
| 4 | Return-order document not shown | FR-STS-005 | Return Order names who returned it and opens a **sample** memo, marked Sample. Figma: Return Order (Dialog) (3:11388) | **NeGD**: PFMS's link pattern (question 15) |
| 5 | Returned by PFMS and Financial Year Expired unreachable and undrawn; no PD Checker mapping; wrong sentence | C-ReturnedBy, C-FinYrExpired | Both reachable from the demo rail; returned bills go to a new **Returned by PFMS** tab; `ReturnedByPDChecker` mapped; sentence fixed. Figma: 91:15801, 91:16268, 93:19213 | — |
| 6 | A failed bank credit had no design | FR-STS-003 (b) | **Credit Failed at Bank** stage; the NGO is asked on its application and on Project Bank Accounts to check the account; the Maker starts afresh. Figma: 92:219954, 100:40177, 100:40553 | NeGD and the Ministry confirm the position (question 13) |
| 7 | Sanction refusal for incomplete bank details not drawn | FR-NGO-002, U-3.1A-2 | Now said **before** the decision, with Sanction disabled. Figma: Bank Details Incomplete (103:12171) | — |
| 8 | Inactive-DDO warning not drawn | FR-MDM-004 (b) | Figma: Step 1 of 5 — DDO Not Active for e-Bills (92:220803) | — |
| 9 | "Not the Designated Checker" not drawn | BR-DSC-001 | Figma: Not the Designated Checker (92:220407) | — |
| 10 | CNA exception reason not drawn; its code list does not exist | A-CNAExceptionReason | Figma: Step 2 of 5 — CNA Exception Reason (93:20499) | **PFMS / NeGD**: the reason codes |
| 11 | Document retention undecided; single-use link contradicts retention | NFR-6.3-4 | Unchanged | **Ministry** |
| 12 | PFMS error list mostly placeholder | U-2.4-4, FR-STS-006 | Unchanged | **PFMS / NeGD**: the Claim WebAPI error list |
| 13 | BatchId undecided | A-BatchId | Unchanged | **Ministry / PFMS** |

**Smaller findings, not BRD rows:**
- *Payment History order* (fixed). The seed closed a sanction one minute before its credit; PFMS now closes it two days after (`pfms/seed.ts`; test "the seed closes a sanction after its credit").
- *Populated Drafts tab and the phone Returned by PFMS queue* drawn on 1 Oct 2026: "Payment Advices / Drafts" (117:22639) and "Payment Advices / Returned by PFMS — Mobile" (117:22528). The selected tab on "Returned by PFMS" (93:19213) now carries the same dark blue as its five sibling queues.
- *SHRESHTA heads in Figma* showed AVYAY's function head (2235600200401) beside SHRESHTA's name; corrected to 2225017930201.
- *Claim Reference timing.* Figure 3 draws the number at step 2; the build draws it at Submit. Drawing late avoids wasting numbers on abandoned drafts, but it is a departure to record with NeGD.

---

## Where the Earlier Checklist Was Wrong

| # | Earlier claim | What was found | Correct mark |
|---|---|---|---|
| 1 | FR-PDM-006 ✅ "Bill Status is always F — when R applies is open question 4" | Marked covered while stating the requirement is not met | 🟡 |
| 2 | FR-HOA-002 ✅; §6.4a ✅ "Four schemes configured; onboarding is configuration only" | The BRD names five schemes. Mode 1 is absent, and no screen can add a scheme | 🟡 |
| 3 | FR-NGO-002: Figma evidence "PD › Preparing › Payment Advices / On Hold (Bank Details Needed)" | That frame is the legacy back-fill hold, a different control. The sanction refusal is not drawn anywhere | 🟡 |
| 4 | FR-STS-005 ✅ "View Return Order" | It shows the reason as text; the BRD asks for PFMS's own document through its link | 🟡 |
| 5 | FR-SNC-004 ✅ and BR-CAN-001 ✅ | After a cancellation nothing can be resent or restarted; the record's own open question 3 admits "the route back is not drawn" | 🟡 |
| 6 | Annexure C ✅ "All 30 statuses mapped" | No mapping for a return at the PD Checker; "Returned by PFMS" and "Financial Year Expired" cannot be reached and are not drawn | 🟡 and 🟢 |
| 7 | FR-MDM-004 ✅ (both checklists) | The Bureau's list is drawn; the Maker's warning is not | 🟢 for the screen half |
| 8 | BR-DSC-001 ✅ | The refusal for a non-designated officer is not drawn | 🟡 |
| 9 | FR-STS-003 ✅ | A failed scroll has no path and no drawing | 🟡 |
| 10 | Annexure A ✅ "Every Maker-facing field is modelled"; coverage checklist ✅ means "built and drawn" | CNA exception reason is built but not drawn | 🟢 |
| 11 | Totals rule: "a row marked ✅ / 🔧 counts as ✅" (3.1 D, 6.2b) | This counted server-side work as covered. Rows such as FR-MDM-001 to 003, FR-STS-001 to 004, FR-DOC-002 and 003 and FR-PDC-005 were ✅ with no server half shown | Split into 🔧 and ✅ here |
| 12 | 2.4d ✅ "every PFMS error has a plain-language message" | True of the mechanism; not stated that eight of ten codes are invented | ✅ with the caveat stated |
| 13 | 6.3d 🟡 "View links expire after 7 days" | Retention is a Ministry decision, and the BRD is internally contradictory | ⏸ |
| 14 | §4 Secretary / Joint Secretary ✅ "Payment Reports" | The BRD gives them ownership and sign-off, not report reading | ⏸ |
| 15 | §8 steps 7, 8, 9 ✅ and step 6 ✅ | Steps 7–9 happen inside PFMS and the bank; step 6 is the server call. The screens only imitate them | ⏸ and 🔧 |

The earlier checklist's test citations ("a resend is a new identifier pointing at the old", "drawn = consumed + remaining", "no raw PFMS status in history") are assertion messages inside tests, not test names. The assertions exist and pass (T:213, T:277, T:236).

---

## Totals

**BRD items checked: 288.** Rows in the table: **312** (24 items have both a server half and a screen half, so they take two rows). Every row cites a BRD page.

| Mark | First pass (1 Oct, morning) | After the gaps were closed (1 Oct) |
|---|---|---|
| ✅ Covered | 202 | **217** (4 of them rest on positions for discussion) |
| 🟢 Built, not drawn | 3 | **0** |
| 🎨 Drawn, not built | 0 | **0** |
| 🔧 Server-side | 65 | **65** |
| ⏸ Owed elsewhere | 27 | **30** |
| 🟡 Partial | 15 | **0** |
| ❌ Not covered | 0 | **0** |
| **Total** | 312 | **312** |

- **Covered, of all rows:** 217 of 312 = **69.6%**. The rest is server work (65) or owed by PFMS, the Ministry, the Bureau or the BA (30).
- **Covered, of the rows a screen can answer** (leaving out 🔧 and ⏸): 217 of 217 = **100%**.
- The earlier checklist reported 130 of 147 rows ✅ (88%). It counted server work as covered and missed 18 gaps.

Counted with a script over this file's Mark column.
