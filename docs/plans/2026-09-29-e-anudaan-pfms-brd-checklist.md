# PFMS BRD — coverage checklist

**BRD:** [`docs/source-brd/eAnudaan_PFMS_Integration_BRD.pdf`](../source-brd/eAnudaan_PFMS_Integration_BRD.pdf) (NeGD, v1.0, 8 Sep 2026)
**Build:** branch `feat/e-anudaan-pfms` · **Record:** [`2026-09-29-e-anudaan-pfms.md`](./2026-09-29-e-anudaan-pfms.md)
**Checked:** 29 Sep 2026. Each requirement was read against the code, not the plan.

**Evidence** names the proof:
- **T:** a test in `apps/hub/src/lib/e-anudaan/pfms/pfms.test.ts`, unless another file is named.
- **W:** a step in the scripted browser walk. It runs as the Maker, the Checker, PFMS and the NGO, at 1440px and 375px, and passes 18 of 18 checks.
- **S:** a screenshot in the PR.

| Mark | Meaning |
|---|---|
| ✅ | Covered in the prototype |
| 🟡 | Partly covered — the gap is stated |
| 🔧 | Server-side NeGD build, not a screen. The row says how the screens reflect it |
| ⏸ | Owed by PFMS, the Ministry or the Bureau. The screens show it as a state |
| ❌ | Not covered |

**Totals** (counted from the tables below; a row marked "✅ / 🔧" counts as ✅):

| Group | Rows | ✅ | 🟡 | 🔧 | ⏸ | ❌ |
|---|---|---|---|---|---|---|
| §5 functional requirements (FR-*) | 44 | 40 | 2 | 2 | 0 | 0 |
| §7 business rules (BR-*) | 14 | 13 | 0 | 1 | 0 | 0 |
| **Every row, §2–§13** | **147** | **124** | **8** | **12** | **3** | **0** |

The eight partial rows come from **three** gaps:
- **The payee code, its confirmation tick and a typed-twice account number are not yet on the application form.** Six rows: 2.2a, 3.1 A1, 3.1 A2, FR-NGO-001, FR-NGO-002, and workflow step 1.
- **How long supporting documents are kept** (6.3d) is a Ministry decision.
- **Bill types other than RPR-34** (6.4b) are fixed rather than configurable.

---

## §2 Objectives

| # | Objective | Mark | Where / evidence |
|---|---|---|---|
| 2.1a | Eliminate manual re-keying at the DDO | ✅ | The advice is sent to PFMS whole, in one request (`authoriseAndTransmit`) · W |
| 2.1b | Ministry sees a grant end to end | ✅ | Payment Status: stage, bill, voucher, UTR, requests, history · S 18 |
| 2.1c | Less turnaround and reconciliation effort | ✅ | Reports › Reconciliation, Turnaround |
| 2.1d | Auditability, one traceable e-sanction per bill | ✅ | Request identifiers and history on every case · T "one call per bill" |
| 2.1e | Built once, scheme by configuration | ✅ | `SchemePfmsConfig`; Bureau › Heads of Account, DDO & Division Codes |
| 2.2a | Payee code and bank details confirmed before sanction | 🟡 | See FR-NGO-001/002 |
| 2.2b | Maker–Checker on the payment advice | ✅ | Maker and Checker sign-ins; T "the Maker cannot sign their own advice" |
| 2.2c | One ReceiveSanctionData call per bill | ✅ | T "one call per bill" |
| 2.2d | Track bill, PAO and payment; capture UTR | ✅ | T "advancing reaches Paid exactly once" · S 17, 18 |
| 2.2e | Reconcile against the RD/TD feed | ✅ | `reconcile()`; Reports › Reconciliation, with Pull Release Feed |
| 2.2f | Notify the NGO only on confirmed credit | ✅ | `recordPfmsCredit`; W "NGO notified exactly once, with sanction, amount and UTR" |
| 2.3a | PFMS client: auth, send, polling | 🔧 | Server-side. The screens show only its outcomes: received, not accepted, waiting to resend |
| 2.3b | Master data synchronised scheme-wise | ✅ | Bureau › Master Data; Refresh Now; stale block |
| 2.3c | Head of account as four coded fields | ✅ | Maker step 2; Bureau › Heads of Account |
| 2.3d | SHA-256 per document; single-use link | ✅ | Maker step 4 hashes the file in the browser · W "A SHA-256 fingerprint is shown" |
| 2.3e | Claim Reference Number pool | ✅ | Bureau › Claim References; drawn on submit · T "draws one Claim Reference Number" |
| 2.4a | Maker works in one sequence, in PFMS order | ✅ | Five-step form: header → heads → beneficiary → documents → review · S 02–06 |
| 2.4b | Pre-fill what e-Anudaan knows | ✅ | Read-only facts with "From Sanction Order" and "From NGO" tags · T "pre-filled" |
| 2.4c | Checker sees a read-only mirror beside the sanction order | ✅ | Checker review, side by side · S 10 |
| 2.4d | PFMS errors in plain language | ✅ | `errors.ts`; T "every PFMS error has a plain-language message"; T "no raw PFMS status in history" |
| 2.5a | Sanction pipeline by PFMS status | ✅ | Reports › Sanction Pipeline · S 40 |
| 2.5b | Ageing, DDO-wise | ✅ | Reports › Ageing, with a threshold control |
| 2.5c | Disbursement reconciliation | ✅ | Reports › Reconciliation |
| 2.5d | Failure trend | ✅ | Reports › Failure Trend |
| 2.5e | Claim Reference pool utilisation | ✅ | Reports › Claim Reference Pool; Bureau › Claim References |

## §3 Scope

| # | Item | Mark | Where / evidence |
|---|---|---|---|
| 3.1 A1 | Payee code with the NGO's confirmation tick | 🟡 | On Project Bank Accounts, not in the application form (FR-NGO-001) |
| 3.1 A2 | Bank account and IFSC confirmed; no sanction without both | 🟡 | Sanction is blocked without them (T, FR-NGO-002). The account is not typed twice on the form |
| 3.1 B1 | Coded head of account per scheme | ✅ | Bureau › Heads of Account |
| 3.1 B2 | DDO, PAO and PD codes from PFMS; DDO mapped per scheme | ✅ | Bureau › DDO & Division Codes |
| 3.1 B3 | DSC custody; who signs | ✅ | Bureau and Under Secretary › Maker & Checker (designation, certificate, expiry) |
| 3.1 B4 | Back-fill bank details for older files | ✅ | Bureau › Legacy Files |
| 3.1 C | PFMS registration, scheme codes, UAT | ⏸ | Shown as states: "Scheme Code Awaited" (SMILE); stale master data |
| 3.1 D | e-Anudaan engineering (client, masters, HoA, pool, hashing, screens) | ✅ / 🔧 | Screens and rules ✅; the live PFMS client 🔧 |
| 3.2 | Out of scope: other RPR types, cheque, account-validation API, the review chain, SHRESTHA payment mode | ✅ | Payment mode fixed at 528 and bill type at 7; review chain untouched; SHRESTHA shows "Decision Awaited" |

## §4 Stakeholders

| Role | Mark | Where |
|---|---|---|
| Secretary / Joint Secretary | ✅ | Payment Reports (Joint Secretary, Programme Director) |
| US-PD: sanctions; designates Maker and Checker | ✅ | Sanction unchanged; Maker & Checker page; payment stage on the Instalments panel |
| PD Maker | ✅ | Payment Advices |
| PD Checker | ✅ | Authorisation Queue |
| DDO, PAO | ⏸ | Inside PFMS — simulated stages "Bill with DDO" and "Being Passed at PAO" |
| NGO | ✅ | Bank accounts payee code; application payment card; credit notice |
| PFMS technical team | ⏸ | External |
| e-Anudaan engineering (NeGD) | 🔧 | Builds the server side against these screens |
| Bureau / Scheme Division | ✅ | Bureau sign-in, eight set-up pages |

## §5 Functional requirements

| ID | Requirement | Mark | Where / evidence |
|---|---|---|---|
| FR-NGO-001 | Payee code on the application form, with a confirmation tick | 🟡 | Captured with the tick on **Project Bank Accounts**, which the Maker reads. **Not yet in the application form**: adding it there leaves 391 seeded applications with unanswered required questions and needs new edit-policy groups. Separate change |
| FR-NGO-002 | Bank account and IFSC confirmed on the form; no sanction if incomplete | 🟡 | **Sanction blocked** when either is missing (`sanctionBankGap`, T). Account is **not typed twice** on the form (same reason) |
| FR-NGO-003 | Bureau back-fills older files | ✅ | Legacy Files › Bank Details Needed; only the last four digits are kept |
| FR-MDM-001 | Controller, PAO and DDO sync | ✅ | Master Data |
| FR-MDM-002 | Grant, Function, Object, Category sync | ✅ | Master Data; coded pickers in step 2 |
| FR-MDM-003 | PD code per DDO | ✅ | DDO & Division Codes; step 1 lists only the chosen DDO's codes · T |
| FR-MDM-004 | e-Bill activation check on the DDO | ✅ | Inactive DDO refused · T "an inactive DDO … refused" · S 02 |
| FR-MDM-005 | Scheduled refresh plus on demand | ✅ | Master Data › Refresh Now; stale after 24h · T "stale master data blocks submission" |
| FR-HOA-001 | Four coded components | ✅ | Step 2 — four linked pickers, each narrowing the next |
| FR-HOA-002 | Heads configured per scheme, incl. schemes without a code | ✅ | Heads of Account; SMILE "Scheme Code Awaited" · T "a scheme with no PFMS code cannot be sent" |
| FR-HOA-003 | Retrofit heads on issued, unsent sanctions | ✅ | Legacy Files › Heads to Retrofit (`retrofitHeads`) |
| FR-PDM-001 | Maker queue by sanction date; fresh vs returned | ✅ | Tabs New · Returned by Checker · Not Accepted by PFMS · Drafts · On Hold · S 01 |
| FR-PDM-002 | Pre-filled header | ✅ | "From the Sanction Order": number, date, amount, FY, IFD no. and date, scheme code · T |
| FR-PDM-003 | DDO and PD code from the master | ✅ | Step 1 · W "Step 1 blocks with named field errors" |
| FR-PDM-004 | Coded heads; deduction heads; sum = sanction | ✅ | Step 2 running total · W "Running total warns"; **deductions** in step 3 · T "deductions reduce the net payable" |
| FR-PDM-005 | Bill number unique per DDO per FY; bill date | ✅ | Generated as the DDO is chosen · W "Bill number appears …" · T "bill numbers are unique" |
| FR-PDM-006 | Fixed values: 528, 14, F/R, 7 | ✅ | Shown as "Set by System". Bill Status is always F — when R applies is open question 4 |
| FR-PDM-007 | Beneficiary fields; editable only where PFMS permits | ✅ | Step 3 — payee code, name, account, IFSC read-only; gross, deductions, net, remarks editable |
| FR-PDM-008 | One Claim Reference Number per beneficiary | ✅ | Drawn on submit · T |
| FR-PDM-009 | Upload Claim, Sanction, Bill, PAO order; hash; single-use link; tiers | ✅ | Step 4 — required types follow where the sanction lands · T "mandatory documents escalate" |
| FR-PDM-010 | Save as draft | ✅ | Save as Draft; progress kept · W "Saved progress is kept after leaving" |
| FR-PDM-011 | Submit; locked until returned | ✅ | W "Submit returns to the queue"; W "Submitted advice is locked" |
| FR-PDM-012 | Unique identifier; fresh one on resubmission, pointing back | ✅ | Payment Status › Requests Sent to PFMS · T "a resend is a new identifier pointing at the old" |
| FR-PDC-001 | Checker queue | ✅ | Authorisation Queue (Awaiting · Authorised by You) · S 09 |
| FR-PDC-002 | Read-only mirror beside the sanction order | ✅ | Side by side; disagreement stated in words and blocks signing · W "Checker sees agreement" |
| FR-PDC-003 | Return with a mandatory remark; sanction untouched | ✅ | Return to Maker dialog · W "Return needs a remark" · T "a return needs a remark …" |
| FR-PDC-004 | DSC required; signer and time recorded | ✅ | Sign dialog; signature on the advice and in history · W "No token: nothing is signed" |
| FR-PDC-005 | Send exactly once; no concurrent resend | ✅ | Button disabled while signing; same identifier refused · T "never the same identifier twice" |
| FR-PDC-006 | Sanction number, amount and authority immutable | ✅ | Read-only in every step and in the mirror |
| FR-SNC-001 | Token handshake and renewal | 🔧 | Server-side. By design, token expiry never reaches a user |
| FR-SNC-002 | IP whitelisting | 🔧 | Server-side |
| FR-SNC-003 | One call carrying header, heads, beneficiary, hashes | ✅ | The advice is the whole payload (`PaymentAdvice`) · T |
| FR-SNC-004 | Resubmit only under a new identifier | ✅ | Not accepted → Maker corrects → Checker signs again → new identifier · T |
| FR-STS-001 | Poll status to a terminal state; show it | ✅ | 30 Annexure C statuses → one stage list · T "every PFMS status maps to a stage" |
| FR-STS-002 | Bill number and date, token number and date | ✅ | Payment Status › Bill and Voucher · S 18 |
| FR-STS-003 | UTR, scroll status and date per beneficiary | ✅ | Payment Status › Payment to the NGO · S 18 |
| FR-STS-004 | RD/TD reconciliation, mismatches flagged | ✅ | Reports › Reconciliation (Matched · Amount Differs · UTR Differs · Not in Feed) · T |
| FR-STS-005 | Return-order viewer | ✅ | Payment Status › View Return Order · S 19, 20 |
| FR-STS-006 | Plain-language errors via a maintained lookup | ✅ | `errors.ts`; Bureau › Error Messages lets the Bureau reword · T |
| FR-NTF-001 | Notify only on UTR | ✅ | W "NGO notified exactly once …"; T "a UTR on every beneficiary reads Paid" |
| FR-NTF-002 | Notice carries sanction number, amount and UTR | ✅ | W (the notice text is checked) |
| FR-DOC-001 | SHA-256, Base64 | ✅ | `crypto.subtle` on the file's bytes in step 4 |
| FR-DOC-002 | Single-use, time-boxed view link | ✅ | Link token and expiry recorded per document. The server parameters (identifier, credential hash, tick) are 🔧 |
| FR-DOC-003 | Pool by PD code and FY; batches; consumed marked | ✅ | Bureau › Claim References (Draw a Batch of 25) · T "drawn = consumed + remaining" |

## §6 Non-functional

| § | Requirement | Mark | Where / evidence |
|---|---|---|---|
| 6.1 | Round-trip budget; polling never blocks screens | 🔧 | Server-side. Screens never wait on PFMS; status arrives as stages |
| 6.2a | A PFMS outage degrades only PFMS functions ("Pending") | ✅ | "Waiting to Resend"; nothing else changes · W (sign → unreachable) |
| 6.2b | Every call logged with its identifier | ✅ / 🔧 | Requests Sent to PFMS and Payment History on every case; the server log is 🔧 |
| 6.3a | HTTPS; tokens never stored | 🔧 | Server-side. The prototype holds no token |
| 6.3b | IP whitelisting both ways | 🔧 | Server-side |
| 6.3c | DSC private keys never stored centrally | ✅ | The sign dialog states the portal never sees the PIN; only the certificate serial is recorded |
| 6.3d | Retention per the Ministry's policy | 🟡 | View links expire after 7 days in the prototype; the retention period is a Ministry decision |
| 6.4a | Scheme-agnostic model | ✅ | Four schemes configured; onboarding is configuration only |
| 6.4b | RPR types beyond 34 later | 🟡 | Bill type is a single constant (7), per BR-SNC-003; making it configurable is left for when it is needed |
| 6.5a | Linear, wizard-style Maker/Checker sequence | ✅ | Five steps in PFMS order |
| 6.5b | Inline validation before submission | ✅ | Messages beside the field and in the summary are one sentence · W |
| 6.6a | Conform to PFMS API specifications | 🔧 | Field names follow Annexure A; the real contract governs |
| 6.6b | Interoperable with the Ministry's DSC tokens | 🔧 | The dialog designs utility-missing, no-token and expired states generically |

## §7 Business rules

| ID | Rule | Mark | Evidence |
|---|---|---|---|
| BR-NGO-001 | Not pushed without bank, IFSC and payee code | ✅ | "On Hold" (Bank Details Needed, Payee Code Needed) · T |
| BR-SNC-001 | One call per bill | ✅ | T |
| BR-SNC-002 | Maker–Checker never alters the sanction | ✅ | T "the sanction is untouched" |
| BR-SNC-003 | Bill type always 7 | ✅ | Fixed value |
| BR-SNC-004 | Bill number unique per DDO per FY | ✅ | T; ERRSNC44 regenerates the number |
| BR-SNC-005 | Claim Reference mandatory for an e-sanction; only from the pool | ✅ | T |
| BR-DOC-001 | Hash tiers by landing status | ✅ | T |
| BR-DSC-001 | Only the designated Checker for the DDO signs | ✅ | T "only the designated Checker can" |
| BR-NTF-001 | Credit-only notification | ✅ | W |
| BR-CAN-001 | A cancelled sanction is never revived | ✅ | T "a cancelled sanction stays cancelled" |
| BR-MDM-001 | Latest master data; unknown combination blocks | ✅ | T (stale, inactive DDO, unmapped code, head not configured) |
| BR-BAK-001 | Legacy files back-filled before the Maker queue | ✅ | Held under On Hold until back-filled · S 21 |
| BR-AUTH-001 | No reuse of an expired token | 🔧 | Server-side |
| (§10) | Maker and Checker are different officers | ✅ | Enforced, and flagged as open question 1 · T |

## §8 Workflows

| Step (§8.1 / §8.6) | Mark | Where |
|---|---|---|
| 1 NGO bank, IFSC, payee code | 🟡 | Project Bank Accounts (see FR-NGO-001) |
| 2 Review chain unchanged | ✅ | Not touched |
| 3 US-PD sanction | ✅ | Unchanged; now opens the payment leg |
| 4 Maker prepares | ✅ | Payment Advices |
| 5 Checker authorises with DSC | ✅ | Authorisation Queue |
| 6 ReceiveSanctionData | ✅ | Sign dialog outcome |
| 7 Lands at DDO | ✅ | "Received by PFMS", then "Bill with DDO" (simulated) |
| 8 DDO bill; PAO passes | ✅ | "Bill with DDO", then "Being Passed at PAO" |
| 9 DBT; UTR | ✅ | "Payment in Process", then "Paid" |
| 10 Poll, reconcile, notify | ✅ | Payment Status; Reconciliation; credit notice |

**§8.3 journey decision points:**

| Decision point | Mark | Where |
|---|---|---|
| Save as draft | ✅ | Save as Draft |
| Submit? | ✅ | Submit for Authorisation |
| Checker approves? | ✅ | Approve and Sign, or Return to Maker |
| PFMS response | ✅ | Received, Not Accepted, or Waiting to Resend |
| Failed → correct and resubmit | ✅ | Not Accepted tab; Maker corrects; Checker signs again |

**§8.5 exceptions:**

| Exception | Mark | Where / evidence |
|---|---|---|
| Validation failure | ✅ | T; S 01 Not Accepted tab |
| Returned and cancelled | ✅ | S 19 |
| Token expiry | 🔧 | Server-side; never shown to a user |
| PFMS unavailable | ✅ | "Waiting to Resend" |
| ERRSNC44 — bill number exists | ✅ | Refused, the bill number is regenerated, and the Maker sees why |

## §11 Dashboards

| KPI | Mark | Where |
|---|---|---|
| Sanction Pipeline | ✅ | Reports › Sanction Pipeline — tiles filter the table; each file is counted once |
| Ageing | ✅ | Reports › Ageing |
| Disbursement Reconciliation | ✅ | Reports › Reconciliation |
| Failure / Exception | ✅ | Reports › Failure Trend |
| Claim Reference Pool | ✅ | Reports › Claim Reference Pool |
| Turnaround | ✅ | Reports › Turnaround |

## §13 Annexures

| Annexure | Mark | Note |
|---|---|---|
| A — ReceiveSanctionData fields | ✅ | Every Maker-facing field is modelled. RequestSource, BatchId and ChequeCategory are 🔧 constants or not applicable (e-payment only) |
| B — RPR types | ✅ | Only 7 in scope, shown fixed |
| C — status reference | ✅ | All 30 statuses mapped; exhaustive by type · T |
| D — API inventory | 🔧 | Nineteen APIs on the server side; the simulator stands in for them |
| E — document type codes | ✅ | All six, in step 4 |
| F — Maker field list | ✅ | F.1 header incl. Bill Status and Request Identifier · F.2 heads · F.3 beneficiary incl. deductions · F.4 documents · Save as Draft / Submit |
| G — Checker field list | ✅ | Mirror; original sanction order; remarks on return; DSC; Approve and Sign; Return to Maker |

---

## Open

**Still to build:**
1. **FR-NGO-001/002 on the application form.** Adding the payee code, its confirmation tick and a typed-twice account number to the shared bank section of every scheme's form. Needs answers seeded for 391 submitted applications, new edit-policy groups, and updated demo presets.
2. **The Figma handoff screens** (P-18 in the delivery tracker).
3. **The 12 open questions for NeGD** (record §4). Questions 1, 2, 3 and 7 change screens.
