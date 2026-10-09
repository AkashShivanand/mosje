# PFMS BRD — what is covered, and where

**BRD:** NeGD, *Integration of PFMS with the e-Anudaan Portal*, v1.0, 8 Sep 2026
(`docs/source-brd/eAnudaan_PFMS_Integration_BRD.pdf`).
**Checked:** 30 Sep 2026, against the running prototype (branch `feat/e-anudaan-pfms`) and the
Figma handoff file `E-Anudaan [Handoff]` (`K0B3vuOTXpxw6kt0px2Cqo`; PFMS screens on the pages `Officers · Paying a Sanctioned Grant (PFMS)`, `Officers · PFMS Set-Up`, `Officers · Records and Reports` (Payment Reports), `NGO · After Applying and Getting Paid` and `NGO · SHRESHTA Mode 2 Application Form`).
**Detail, row by row:** `2026-09-29-e-anudaan-pfms-brd-checklist.md` (147 rows, with test evidence).

| Mark | Meaning |
|---|---|
| ✅ | In the built prototype **and** drawn in Figma |
| 🔧 | NeGD server-side work. No screen; the screens show its outcomes |
| ⏸ | Owed by PFMS, the Ministry or the Bureau. Shown as a state |
| 🟡 | Partly covered. The gap is stated |

Figma references are `Column › Journey › Screen`. The columns are **PD** (Programme Division — Paying a
Sanctioned Grant), **BU** (Bureau — Setting Up PFMS), **NGO** (NGO — Getting Paid) and **RP**
(Officers — Payment Reports).

## 1. The NGO's bank and PFMS details (FR-NGO-001 to 003)

| Requirement | Prototype | Figma | |
|---|---|---|---|
| Payee code on the application form, with a confirmation tick | Application form, Bank Account Details | NGO › Payee Code and Payment › Bank Account Details — PFMS Payee Code (+ phone) | ✅ |
| Account number typed twice; mismatch caught | "Re-enter Account Number" | … › Account Numbers Do Not Match | ✅ |
| No sanction without account and IFSC | `sanctionBankGap` | PD › Preparing › Payment Advices / On Hold (Bank Details Needed) | ✅ |
| Payee code added later, on Project Bank Accounts | Project Bank Accounts | NGO › … › Project Bank Accounts / PFMS Payee Code Needed | ✅ |
| Bureau back-fills older files | Legacy Files | BU › Completing Legacy Files › Bank Details Needed · Payee Code Needed · Back-Filled · Enter Bank Details (Dialog) | ✅ |

## 2. Master data and heads of account (FR-MDM, FR-HOA)

| Requirement | Prototype | Figma | |
|---|---|---|---|
| Controller, PAO, DDO, grant, function, object, category lists synced | Master Data | BU › Keeping Set-Up Current › Master Data | ✅ |
| Scheduled refresh plus on demand; stale data blocks sending | Refresh Now; 24-hour limit | … › Master Data — Out of Date; PD › Step 5 — Not Ready to Submit | ✅ |
| Division (PD) code per DDO; e-Bill activation check | DDO & Division Codes | BU › DDO and Division Codes (e-Bill Not Active) | ✅ |
| Four coded heads per scheme, including a scheme without a code | Heads of Account | BU › Heads of Account (SMILE: Scheme Code Awaited) | ✅ |
| Retrofit heads on issued, unsent sanctions | Legacy Files › Heads to Retrofit | BU › Legacy › Heads to Retrofit (+ empty) · Set Head of Account (Dialog) | ✅ |
| PFMS registration, scheme codes, UAT | — | Shown as "Scheme Code Awaited" | ⏸ |

## 3. The Maker prepares the advice (FR-PDM-001 to 012)

| Requirement | Prototype | Figma | |
|---|---|---|---|
| Queue by sanction date; fresh, returned, not accepted, drafts, on hold | Payment Advices (5 tabs) | PD › Preparing › New · Returned by Checker · Not Accepted by PFMS · Drafts — Empty · On Hold | ✅ |
| Pre-filled header from the sanction; DDO and division code from masters | Step 1 | Step 1 of 5 (+ Errors, + phone) | ✅ |
| Bill number unique per DDO per year; bill date; fixed values 528 / 14 / F / 7 | Step 1 | Step 1; Not Accepted — Bill Number Already Used | ✅ |
| Coded heads that add up to the sanction | Step 2 | Step 2; Heads Do Not Add Up | ✅ |
| Beneficiary: read-only bank details; gross, deductions, net, remarks | Step 3 | Step 3; With a Deduction | ✅ |
| One Claim Reference Number per beneficiary | Drawn on submit | Step 3 / Step 5 | ✅ |
| Documents: SHA-256, single-use view link, required by landing status | Step 4 | Step 4 | ✅ |
| Save as draft | Save as Draft | Every step's notices row | ✅ |
| Submit; locked until returned | Step 5 | Step 5; With the Checker (+ phone) | ✅ |
| Unique identifier; a resend points back to the one before | Requests Sent to PFMS | PD › Following › Payment Status (every state) | ✅ |

## 4. The Checker authorises (FR-PDC-001 to 006, BR-DSC-001)

| Requirement | Prototype | Figma | |
|---|---|---|---|
| Checker queue | Authorisation Queue | PD › Authorising › Awaiting Authorisation · Authorised by You (+ phone) | ✅ |
| Read-only mirror beside the sanction order | Decision screen | … › Approve and Sign (+ phone) | ✅ |
| Return with a mandatory remark | Return to Maker | … › Return to Maker — Reason Missing | ✅ |
| Maker and Checker are different officers | Enforced | … › You Prepared This Advice | ✅ |
| DSC signature; send exactly once; every outcome | Sign dialog | 8 dialogs: Approve and Sign, Signing, Received, No DSC Token, Utility Not Running, Certificate Expired, Not Accepted, Waiting to Resend | ✅ |
| Only the designated Checker, with a valid certificate | Maker & Checker | BU › Maker and Checker; Edit Maker and Checker (Dialog) | ✅ |

## 5. Sending, status and reconciliation (FR-SNC, FR-STS, FR-DOC)

| Requirement | Prototype | Figma | |
|---|---|---|---|
| One ReceiveSanctionData call per bill | `authoriseAndTransmit` | Received by PFMS (Dialog) | ✅ |
| Token handshake, IP whitelisting, polling | — | Never shown to a user | 🔧 |
| Poll to a terminal state; plain stages | 30 statuses → 9 stages + exceptions | PD › Following › Bill with DDO · Paid · Waiting to Resend · Not Accepted · Returned and Cancelled | ✅ |
| Bill, token, voucher; UTR per beneficiary | Payment Status | … › Paid (+ phone) | ✅ |
| Return-order viewer | View Return Order | … › Return Order (Dialog) | ✅ |
| Payment stage on the review screen (no one-click release) | Instalments panel | … › Instalments — Awaiting Payment Advice | ✅ |
| Plain-language errors, maintained by the Bureau | Error Messages | BU › Error Messages; Edit Message (Dialog) | ✅ |
| Claim Reference pool by division code and year | Claim References | BU › Claim References | ✅ |
| RD/TD reconciliation | Reports › Reconciliation | RP › Disbursement Reconciliation | ✅ |

## 6. The NGO is told (FR-NTF, BR-NTF-001)

| Requirement | Prototype | Figma | |
|---|---|---|---|
| Notified only when the UTR arrives, with sanction, amount and UTR | `recordPfmsCredit` | NGO › Notifications / Grant Credited (+ phone) | ✅ |
| Payment stage on the NGO's own application | Payment card | NGO › Application Details / Payment in Process · Grant Credited (+ phone) | ✅ |

## 7. Dashboards (§11)

Sanction Pipeline, Ageing, Disbursement Reconciliation, Failure Trend, Claim Reference Pool and
Turnaround. All ✅ in the prototype, and drawn at RP › Payment Reports (six tabs, + a phone version).

## Not covered, or only in part

| Item | Why | Mark |
|---|---|---|
| PFMS client: authentication, token renewal, IP whitelisting, polling, logs | NeGD server-side | 🔧 |
| DDO, PAO and bank work inside PFMS | Simulated as stages only | ⏸ |
| Document retention period | A Ministry decision; view links expire after 7 days in the prototype | 🟡 |
| RPR bill types other than 34 | Fixed at 7; the BRD needs only RPR-34 now | 🟡 |
| Eight open questions that could change screens | Red notes on four journeys in Figma (§4 of the record) | ⏸ |

## What is drawn with less than the build

- **Phone versions** cover every Maker step, both queues, the decision screen, Payment Status (Paid), the
  Bureau overview, Legacy Files, Reports (Sanction Pipeline) and the NGO screens. The other Bureau pages
  and report tabs are desktop only. The build's responsive behaviour for them was checked in the browser
  (section 8).
- The four SAMAVESH library gaps recorded here earlier were closed on 30 Sep 2026 and the screens updated
  (handoff record §5b): dialogs use the Modal's Content slot, phone steppers mark their stage, empty states
  carry their description, and Failure Trend draws a real bar.

## 8. How it was verified

- **Figma:** 85 PFMS frames were walked, including the content slots inside library instances.
  - Every instance comes from the SAMAVESH library, checked by component key against the library's
    177 component sets.
  - The one local part is the PFMS variant of the NGO form step, and it is built from library parts.
  - No text lacks a style, and no fill or stroke lacks a variable.
  - Nothing runs past its container: a geometry scan of every row, card and label.
    - 21 tables had columns wider than their row, cutting off the action buttons. They were refitted.
    - Back-Filled now shows the payee code and its entry date in one column, as the build does.
    - Six phone screens had a top bar wider than the screen. It now fills the frame.
    - Two long text-area labels now wrap.
  - `npm run check:figma-handoff -- --portal E-Anudaan --strict` is conformant.
- **Build:** 16 pages and their tabs were measured at 1440 and 375, looking for page-level sideways
  scroll and clipped cells.
  - Found and fixed: fixed cell widths that pushed four registers past the edge at 1440, and two phone
    pages 128px and 143px past the screen.
  - What remains is by design: at 375, the DDO, Heads of Account and readiness tables scroll inside
    the design system's own table frame.
  - Gates: `check:raw-button` and `check:link-as` pass, and every page uses a design-system screen
    template.
