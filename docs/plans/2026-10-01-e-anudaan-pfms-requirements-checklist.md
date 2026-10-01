# PFMS Requirements Checklist — e-Anudaan

Checked against the BRD *Integration of PFMS with the e-Anudaan Portal* (v1.0, 8 Sep 2026) and the Figma handoff file [E-Anudaan [Handoff]](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff), 1 Oct 2026. Every element's status was checked against the text on the screens it names, read from Figma; a claim the screens did not bear out was corrected before publishing.

**195 elements on 45 screens (111 Figma frames):** ✅ Drawn 170 · 🟡 Partly Drawn 3 · ❌ Not Drawn 5 · ⏸ Drawn — Decision Pending 12 · 🔧 System Work — No Screen 5

**Open as a page, with filters and ticks:** [PFMS Requirements Checklist](https://claude.ai/artifact/5z5CjQsga2tmKYA8o3NGzL) (private until shared).

**The flow in Figma:** [How a Payment Moves](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=158-19200), on the PFMS page's Start Here, with each step linked to its screens.

## What Needs Action

| | Finding | BRD | Where |
|---|---|---|---|
| ❌ | The four schemes' application forms do not ask for the PFMS payee code, its confirmation tick, or a re-entered account number. | FR-NGO-001, FR-NGO-002 | 18 bank-step screens (NAPDDR, AVYAY, SMILE, SHRESHTA Mode 2 — new application and 1st instalment, desktop and phone). The fields exist only on the pattern screen in the PFMS journey. |
| ❌ | The Checker's read-only mirror leaves out the fixed values (payment mode, sanction type, RPR type, bill status, e-Sanction) and each document's hash and view link. | FR-PDC-002, Annexure G | Authorise Payment Advice, desktop and phone, and its dialogs. The Maker's review has the same omission. |
| 🟡 | No screen shows a resent request with its previous identifier. | FR-PDM-012, FR-SNC-004 | Payment Status explains the link in words; an example with two requests would show it. |
| 🟡 | The NGO's credit notice is headed "Approved". | FR-NTF-001 | Notifications — Grant Credited, desktop and phone. The text is right: sanction order, amount and UTR. |
| 🟡 | The BRD contradicts itself on where the Maker and Checker statuses live. | §1.4, §8.1 vs Annexure C | Annexure C lists Submitted, PassByPDMaker and PendingDSCPDChecker as PFMS statuses, but §8.1 puts the Maker and Checker inside e-Anudaan before the single call. The drawings follow §8.1. Confirm with NeGD. |
| ⏸ | Seven positions are drawn for discussion: who sanctions, fresh advice after cancellation or year-end, failed credit, return memo link, error list, CNA reason codes, SHRESTHA Mode 1's form. | — | Each is marked Needs Discussion in Figma and listed in the PFMS plan §4. |

## The Flow, Checked Against the BRD's Ten Steps (§8.6)

| # | BRD step | | Drawn as |
|---|---|---|---|
| 1 | NGO submits the application with bank account, IFSC and PFMS payee code | 🟡 | Drawn once as a pattern (SHRESHTA Mode 2, in the PFMS journey); the four schemes' own forms lack the payee code, tick and re-entry. |
| 2 | Review chain (unchanged) | ✅ | Out of this BRD's scope; drawn on Reviewing Applications. |
| 3 | US-PD issues the sanction | ⏸ | Drawn as the Programme Director's decision, blocked when bank details are incomplete. Who sanctions is open on Start Here. |
| 4 | PD Maker prepares the payment advice | ✅ | Queue, five steps, draft, submit, lock, every Annexure F field. |
| 5 | PD Checker authorises and applies the DSC | 🟡 | All drawn, except the Checker's mirror leaves out the fixed values and the document hashes and links (Annexure G). |
| 6 | e-Anudaan calls ReceiveSanctionData | ✅ | One request; received, not accepted and waiting-to-resend states drawn. The call itself is system work. |
| 7 | Sanction lands at the DDO (PFMS) | ✅ | Received by PFMS, Bill with DDO. |
| 8 | DDO draws the bill (RPR-34); PAO passes it | ✅ | Bill, token and voucher details. |
| 9 | Bank executes DBT; UTR generated | ✅ | UTR, scroll date and status per beneficiary. |
| 10 | e-Anudaan polls, reconciles, notifies the NGO | ✅ | Reconciliation report; NGO told only on credit. |

## Checklist — Flow by Flow, Screen by Screen, Element by Element

### The NGO Gives Its Bank Details and PFMS Payee Code

*Who:* NGO, Programme Director (sanction) · *BRD:* FR-NGO-001, FR-NGO-002 · BR-NGO-001 · Workflow step 1 and 3

Before any payment, the NGO's bank account, IFSC and PFMS payee code must be on record and confirmed. No sanction is issued without the account and IFSC; no payment advice is sent without the payee code.

#### Application Form — Bank Account Details (the PFMS pattern)

[Desktop 3:9624](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-9624) · [Phone 3:8975](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-8975)

| | Element | BRD | Status | Note |
|---|---|---|---|---|
| [ ] | Bank name | FR-NGO-002 | ✅ Drawn |  |
| [ ] | Account number | FR-NGO-002 | ✅ Drawn |  |
| [ ] | Re-enter account number (confirmation) | FR-NGO-002 | ✅ Drawn |  |
| [ ] | IFSC code | FR-NGO-002 | ✅ Drawn |  |
| [ ] | Branch | FR-NGO-002 | ✅ Drawn |  |
| [ ] | PFMS unique (payee) code field | FR-NGO-001 | ✅ Drawn |  |
| [ ] | Confirmation tick for the payee code | FR-NGO-001 | ✅ Drawn |  |
| [ ] | Account registered on the PFMS DBT module (Yes / No) | §1.3 | ✅ Drawn |  |

#### Application Form — Account Numbers Do Not Match (error)

[Desktop 3:9600](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-9600)

| | Element | BRD | Status | Note |
|---|---|---|---|---|
| [ ] | Inline error when the two account numbers differ | FR-NGO-002 · NFR 6.5 | ✅ Drawn |  |

#### Each Scheme's Application Form — Bank Step

[Desktop 3:50206](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-50206) · [Desktop 3:48927](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-48927) · [Desktop 3:53061](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-53061) · [Desktop 3:56995](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-56995) · [Desktop 3:61277](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-61277) · [Phone 3:49576](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-49576) · [Phone 3:48177](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-48177) · [Phone 3:53727](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-53727) · [Phone 3:57720](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-57720) · [Phone 3:61874](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-61874)

*NAPDDR new application and 1st instalment claim, AVYAY, SMILE and SHRESHTA Mode 2. The PFMS pattern above has not been carried into these forms.*

| | Element | BRD | Status | Note |
|---|---|---|---|---|
| [ ] | Account number and IFSC | FR-NGO-002 | ✅ Drawn |  |
| [ ] | Re-enter account number (confirmation) | FR-NGO-002 | ❌ Not Drawn | Missing on all 18 form screens. |
| [ ] | PFMS payee code field | FR-NGO-001 | 🟡 Partly Drawn | Only the NAPDDR instalment claim has a code field ("NGO PFMS code (under head 3817)"); AVYAY, SMILE, SHRESHTA Mode 2 and the NAPDDR new application have none. |
| [ ] | Confirmation tick for the payee code | FR-NGO-001 | ❌ Not Drawn | Missing on all 18 form screens. |

#### Sanction Blocked — Bank Details Incomplete

[Desktop 103:12171](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=103-12171)

| | Element | BRD | Status | Note |
|---|---|---|---|---|
| [ ] | Message before the decision: account and IFSC incomplete | FR-NGO-002 | ✅ Drawn |  |
| [ ] | Sanction button disabled | FR-NGO-002 · BR-NGO-001 | ✅ Drawn | Drawn in the Disabled state. |
| [ ] | Who sanctions (Under Secretary, per the BRD; drawn as the Programme Director) | §4 · Workflow step 3 | ⏸ Drawn — Decision Pending | Open on Start Here: the walkthrough says the Programme Division's Joint Secretary and Under Secretary. |

#### Project Bank Accounts — PFMS Payee Code Needed

[Desktop 3:9507](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-9507) · [Phone 142:23323](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=142-23323)

| | Element | BRD | Status | Note |
|---|---|---|---|---|
| [ ] | Alert: a sanctioned grant is waiting for the payee code | BR-NGO-001 | ✅ Drawn |  |
| [ ] | Payee code and confirmation date under each account | FR-NGO-001 | ✅ Drawn |  |
| [ ] | Payee code entry with format hint, tick and save | FR-NGO-001 | ✅ Drawn |  |
| [ ] | Bank, masked account number, IFSC and branch per project | FR-NGO-002 | ✅ Drawn |  |

### The Bureau Keeps PFMS Set-Up Current

*Who:* Bureau (PFMS set-up) · *BRD:* FR-MDM-001…005 · FR-HOA-001…003 · FR-NGO-003 · FR-DOC-003 · FR-STS-006 · BR-MDM-001 · BR-BAK-001 · BR-DSC-001

The Bureau makes sure every code a payment advice needs comes from PFMS and is current: master lists, heads of account, DDO and division codes, the designated Maker and Checker, the claim reference pool and the error messages. It also completes older sanctioned files that carry no bank details.

#### PFMS Set-Up — Overview

[Desktop 3:10805](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-10805) · [Phone 3:9911](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-9911)

| | Element | BRD | Status | Note |
|---|---|---|---|---|
| [ ] | Scheme readiness: scheme code, heads, DDOs, status | FR-HOA-002 · §6.4 | ✅ Drawn |  |
| [ ] | Master data age | BR-MDM-001 | ✅ Drawn |  |
| [ ] | Claim reference numbers remaining | FR-DOC-003 | ✅ Drawn |  |
| [ ] | Checker certificates needing renewal | BR-DSC-001 | ✅ Drawn |  |
| [ ] | Legacy files waiting for bank details | BR-BAK-001 | ✅ Drawn |  |
| [ ] | Schemes without a PFMS scheme code (SMILE, SHRESHTA Mode 1) | §3.1 C · FR-HOA-002 | ⏸ Drawn — Decision Pending | Codes awaited from PFMS. |

#### Master Data

[Desktop 3:10418](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-10418)

| | Element | BRD | Status | Note |
|---|---|---|---|---|
| [ ] | Last synchronised date and time | FR-MDM-005 | ✅ Drawn |  |
| [ ] | Automatic daily refresh and Refresh Now | FR-MDM-005 | ✅ Drawn |  |
| [ ] | Controllers, PAOs, DDOs | FR-MDM-001 | ✅ Drawn |  |
| [ ] | Division (PD) codes | FR-MDM-003 | ✅ Drawn |  |
| [ ] | Function heads, object heads, categories, grant numbers | FR-MDM-002 | ✅ Drawn |  |
| [ ] | The sync calls themselves (GetController, GetPAO, GetDDO …) | FR-MDM-001…003 | 🔧 System Work — No Screen |  |

#### Master Data — Out of Date

[Desktop 3:9962](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-9962)

| | Element | BRD | Status | Note |
|---|---|---|---|---|
| [ ] | Blocking message: no advice can be submitted until refreshed | BR-MDM-001 | ✅ Drawn |  |

#### DDO and Division Codes

[Desktop 3:10468](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-10468)

| | Element | BRD | Status | Note |
|---|---|---|---|---|
| [ ] | DDO with its PAO | FR-MDM-001 | ✅ Drawn |  |
| [ ] | e-Bill activation status per DDO | FR-MDM-004 | ✅ Drawn |  |
| [ ] | Where the sanction lands (landing status) | BR-DOC-001 | ✅ Drawn |  |
| [ ] | Division codes per DDO | FR-MDM-003 | ✅ Drawn |  |
| [ ] | DDOs each scheme may use (scheme-wise mapping) | §3.1 B · FR-MDM-003 | ✅ Drawn |  |

#### Heads of Account

[Desktop 3:10593](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-10593) · [Pop-up 98:10919](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=98-10919)

| | Element | BRD | Status | Note |
|---|---|---|---|---|
| [ ] | PFMS scheme code per scheme | A.1 SchemeCode | ✅ Drawn |  |
| [ ] | Function head, object head, category, grant number per row | FR-HOA-001 | ✅ Drawn |  |
| [ ] | Add and remove a head per scheme | FR-HOA-002 | ✅ Drawn |  |
| [ ] | Add a scheme, including one without a PFMS code yet | FR-HOA-002 · §6.4 | ⏸ Drawn — Decision Pending | SHRESTHA Mode 1's full journey waits on the BA's fields and flow. |

#### Maker and Checker

[Desktop 3:10013](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-10013) · [Pop-up 3:9657](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-9657)

| | Element | BRD | Status | Note |
|---|---|---|---|---|
| [ ] | Designated Maker and Checker per DDO | BR-DSC-001 · §4 | ✅ Drawn |  |
| [ ] | Checker certificate serial and expiry | BR-DSC-001 · NFR 6.3 | ✅ Drawn |  |
| [ ] | Who designated them, and when | §4 (US-PD designates) | ✅ Drawn |  |
| [ ] | Warning for expired or expiring certificates | FR-PDC-004 | ✅ Drawn |  |

#### Claim References

[Desktop 3:10253](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-10253)

| | Element | BRD | Status | Note |
|---|---|---|---|---|
| [ ] | Pool by division code and financial year | FR-DOC-003 | ✅ Drawn |  |
| [ ] | Drawn, used, remaining; low pool flagged | FR-DOC-003 | ✅ Drawn |  |
| [ ] | Draw a batch from PFMS | FR-DOC-003 | ✅ Drawn |  |

#### Error Messages

[Desktop 3:10127](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-10127) · [Pop-up 3:9778](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-9778)

| | Element | BRD | Status | Note |
|---|---|---|---|---|
| [ ] | PFMS code, category, the step it points to, plain-language message | FR-STS-006 · §2.4 | ✅ Drawn |  |
| [ ] | Edit a message | FR-STS-006 | ✅ Drawn |  |
| [ ] | The full PFMS error list | FR-STS-006 | ⏸ Drawn — Decision Pending | Most codes are illustrative until PFMS / NeGD supply the Claim WebAPI error list. |

#### Legacy Files — Bank Details and Payee Code

[Desktop 3:11320](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-11320) · [Desktop 3:11260](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-11260) · [Desktop 3:11174](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-11174) · [Phone 3:11023](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-11023) · [Pop-up 3:10950](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-10950)

| | Element | BRD | Status | Note |
|---|---|---|---|---|
| [ ] | Tabs: bank details needed, payee code needed, back-filled, heads to retrofit | FR-NGO-003 · BR-BAK-001 | ✅ Drawn |  |
| [ ] | Enter bank details: bank, branch, account, confirm account, IFSC, payee code, checked tick | FR-NGO-003 | ✅ Drawn |  |
| [ ] | Payee code is the NGO's to give (NGO asked on Project Bank Accounts) | FR-NGO-001 | ✅ Drawn |  |
| [ ] | Back-filled files with who entered what, and when | FR-NGO-003 | ✅ Drawn |  |

#### Legacy Files — Heads to Retrofit

[Desktop 3:11109](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-11109) · [Desktop 3:11048](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-11048) · [Pop-up 3:10879](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-10879)

| | Element | BRD | Status | Note |
|---|---|---|---|---|
| [ ] | Files whose advice uses an unconfigured head | FR-HOA-003 | ✅ Drawn |  |
| [ ] | Set a coded head against an issued sanction | FR-HOA-003 | ✅ Drawn |  |
| [ ] | Empty state | — | ✅ Drawn |  |

### The Maker Prepares the Payment Advice

*Who:* Programme Division — PD Maker · *BRD:* FR-PDM-001…012 · Annexure F · BR-SNC-002…005 · BR-MDM-001 · BR-BAK-001

A five-step form in the order PFMS needs the data: sanction header, heads of account, beneficiary payment, supporting documents, review and submit. Everything already known is filled in; the Maker chooses only the DDO, the division code and the heads, and writes the payee remarks.

#### Payment Advices — the Maker's Queue

[Desktop 3:14977](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-14977) · [Desktop 3:14924](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-14924) · [Desktop 3:14871](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-14871) · [Desktop 93:19213](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=93-19213) · [Desktop 117:22639](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=117-22639) · [Desktop 3:14816](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-14816) · [Desktop 3:14736](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-14736) · [Phone 3:13859](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-13859) · [Phone 117:22528](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=117-22528)

| | Element | BRD | Status | Note |
|---|---|---|---|---|
| [ ] | Oldest sanction first | FR-PDM-001 | ✅ Drawn |  |
| [ ] | Fresh versus returned cases (tabs: New, Returned by Checker, Not Accepted by PFMS, Returned by PFMS) | FR-PDM-001 | ✅ Drawn |  |
| [ ] | Drafts tab | FR-PDM-010 | ✅ Drawn |  |
| [ ] | On Hold tab with the reason (bank details, payee code, scheme code) | BR-BAK-001 · BR-NGO-001 | ✅ Drawn |  |
| [ ] | Columns: application, scheme, sanction order and date, amount, status, action | FR-PDM-001 | ✅ Drawn |  |
| [ ] | Search and scheme filter | — | ✅ Drawn |  |

#### Step 1 of 5 — Sanction Header (Annexure F.1)

[Desktop 3:14676](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-14676) · [Phone 3:13796](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-13796)

| | Element | BRD | Status | Note |
|---|---|---|---|---|
| [ ] | Sanction number (from the sanction order, locked) | F.1 · FR-PDM-002 | ✅ Drawn |  |
| [ ] | Sanction date | F.1 · FR-PDM-002 | ✅ Drawn |  |
| [ ] | Sanction amount | F.1 · FR-PDM-002 | ✅ Drawn |  |
| [ ] | Financial year | F.1 · FR-PDM-002 | ✅ Drawn |  |
| [ ] | IFD concurrence number | F.1 · FR-PDM-002 | ✅ Drawn |  |
| [ ] | IFD concurrence date | F.1 · FR-PDM-002 | ✅ Drawn |  |
| [ ] | Scheme code | F.1 | ✅ Drawn |  |
| [ ] | DDO code — chosen from the PFMS master | F.1 · FR-PDM-003 | ✅ Drawn |  |
| [ ] | PD (division) code — chosen from the PFMS master | F.1 · FR-PDM-003 | ✅ Drawn |  |
| [ ] | Payment mode 528 — e-payment (fixed) | F.1 · FR-PDM-006 | ✅ Drawn |  |
| [ ] | Sanction type 14 — Expenditure (fixed) | F.1 · FR-PDM-006 | ✅ Drawn |  |
| [ ] | RPR type 7 — RPR-34 Grants-in-Aid Bill (fixed) | F.1 · BR-SNC-003 | ✅ Drawn |  |
| [ ] | Bill status F — Fresh (R on a returned bill) | F.1 · FR-PDM-006 | ✅ Drawn |  |
| [ ] | Bill number, generated per DDO per year | F.1 · FR-PDM-005 · BR-SNC-004 | ✅ Drawn |  |
| [ ] | Bill date (date of preparation) | F.1 · FR-PDM-005 | ✅ Drawn |  |
| [ ] | NPB date (Not Payable Before), optional | F.1 | ✅ Drawn |  |
| [ ] | Is e-Sanction = Yes (fixed) | F.1 | ✅ Drawn |  |
| [ ] | Unique identifier (system) | F.1 · FR-PDM-012 | ✅ Drawn |  |
| [ ] | Previous unique identifier (on a resubmission) | F.1 · FR-PDM-012 · FR-SNC-004 | 🟡 Partly Drawn | The identifier is shown; Payment Status explains the link, but no screen shows a resent request with its previous identifier. |
| [ ] | Where the sanction lands, and the documents it needs there | BR-DOC-001 | ✅ Drawn |  |
| [ ] | Sanction fields cannot be changed here | FR-PDC-006 · BR-SNC-002 | ✅ Drawn |  |
| [ ] | Save as Draft | FR-PDM-010 | ✅ Drawn |  |

#### Step 1 — Errors

[Desktop 3:14615](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-14615) · [Desktop 92:220803](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=92-220803)

| | Element | BRD | Status | Note |
|---|---|---|---|---|
| [ ] | DDO and division code required, shown inline | NFR 6.5 | ✅ Drawn |  |
| [ ] | DDO not active for e-Bills, flagged before submission | FR-MDM-004 | ✅ Drawn |  |

#### Step 2 of 5 — Heads of Account (Annexure F.2)

[Desktop 3:14558](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-14558) · [Desktop 3:14501](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-14501) · [Desktop 93:20499](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=93-20499) · [Phone 3:13736](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-13736)

| | Element | BRD | Status | Note |
|---|---|---|---|---|
| [ ] | Function head (13 digits) | F.2 · FR-PDM-004 | ✅ Drawn |  |
| [ ] | Object head (2 digits) | F.2 · FR-PDM-004 | ✅ Drawn |  |
| [ ] | Category | F.2 · FR-PDM-004 | ✅ Drawn |  |
| [ ] | Grant number (3 digits) | F.2 · FR-PDM-004 | ✅ Drawn |  |
| [ ] | Amount against each head; add another head | F.2 | ✅ Drawn |  |
| [ ] | Heads must add up to the sanction (inline check) | FR-PDM-004 · NFR 6.5 | ✅ Drawn |  |
| [ ] | CNA exception reason when object head 33 is used | A.1 CNAExceptionReason | ⏸ Drawn — Decision Pending | Reason codes awaited from PFMS / NeGD. |

#### Step 3 of 5 — Beneficiary Payment (Annexure F.3)

[Desktop 3:14449](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-14449) · [Desktop 3:14386](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-14386) · [Phone 3:13681](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-13681)

| | Element | BRD | Status | Note |
|---|---|---|---|---|
| [ ] | NGO name (as per PFMS) | F.3 · FR-PDM-007 | ✅ Drawn | Shown as the card's heading; labelled "Name as per PFMS" on the review. |
| [ ] | PFMS payee code (from the application) | F.3 · FR-PDM-007 | ✅ Drawn |  |
| [ ] | Bank account number (masked) | F.3 · FR-PDM-007 | ✅ Drawn |  |
| [ ] | IFSC | F.3 · FR-PDM-007 | ✅ Drawn |  |
| [ ] | Bank details read-only, as the NGO confirmed them | FR-PDM-007 | ✅ Drawn |  |
| [ ] | Gross amount | F.3 | ✅ Drawn |  |
| [ ] | Net amount payable (gross minus deductions) | F.3 | ✅ Drawn |  |
| [ ] | Payee remarks, 25 characters at most | F.3 | ✅ Drawn |  |
| [ ] | Claim reference number drawn from the PFMS pool | F.3 · FR-PDM-008 · BR-SNC-005 | ✅ Drawn |  |
| [ ] | Deduction: function / object head, category, grant, amount | F.3 · A.3 | ✅ Drawn |  |

#### Step 4 of 5 — Supporting Documents (Annexure F.4)

[Desktop 3:14297](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-14297) · [Phone 3:13589](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-13589)

| | Element | BRD | Status | Note |
|---|---|---|---|---|
| [ ] | Document types: Claim, Sanction, Copy of Approved Notes, Bill, PAO Passing, Other | F.4 · Annexure E | ✅ Drawn |  |
| [ ] | Document name (file) | F.4 | ✅ Drawn |  |
| [ ] | SHA-256 hash, computed on upload | F.4 · FR-DOC-001 | ✅ Drawn |  |
| [ ] | Single-use view link with its validity | F.4 · FR-DOC-002 | ✅ Drawn |  |
| [ ] | Which documents are required where the sanction lands | BR-DOC-001 | ✅ Drawn |  |
| [ ] | The hashing and the link generation themselves | FR-DOC-001 · FR-DOC-002 | 🔧 System Work — No Screen |  |

#### Step 5 of 5 — Review and Submit

[Desktop 3:14222](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-14222) · [Desktop 3:14145](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-14145) · [Phone 3:13511](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-13511)

| | Element | BRD | Status | Note |
|---|---|---|---|---|
| [ ] | The advice as the Checker will see it, each section with Change | FR-PDM-011 | ✅ Drawn |  |
| [ ] | Ready / Not Ready to Submit | NFR 6.5 | ✅ Drawn |  |
| [ ] | Master data out of date blocks submission | BR-MDM-001 | ✅ Drawn |  |
| [ ] | Submit for Authorisation | FR-PDM-011 | ✅ Drawn |  |
| [ ] | Fixed values (payment mode, sanction type, RPR type, bill status, e-Sanction) repeated on the review | FR-PDC-002 · Annexure G | ❌ Not Drawn | Shown on Step 1 only; the review and the Checker's mirror leave them out. |

#### With the Checker (locked)

[Desktop 3:13884](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-13884) · [Phone 3:13445](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-13445)

| | Element | BRD | Status | Note |
|---|---|---|---|---|
| [ ] | Locked until the Checker returns it | FR-PDM-011 | ✅ Drawn |  |

#### Returned by the Checker

[Desktop 3:14069](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-14069)

| | Element | BRD | Status | Note |
|---|---|---|---|---|
| [ ] | The Checker's remark, name and date | FR-PDC-003 | ✅ Drawn |  |

#### Not Accepted by PFMS (back with the Maker)

[Desktop 3:14011](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-14011) · [Desktop 3:13950](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-13950)

| | Element | BRD | Status | Note |
|---|---|---|---|---|
| [ ] | Plain-language reason and the step to fix | FR-STS-006 · §8.5 | ✅ Drawn |  |
| [ ] | Bill number already used: new number generated | §8.5 ERRSNC44 · BR-SNC-004 | ✅ Drawn |  |
| [ ] | Resent under a new identifier after the Checker signs again | FR-SNC-004 | ✅ Drawn |  |

#### Returned by PFMS (not cancelled) — Correct and Resend

[Desktop 93:19594](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=93-19594)

| | Element | BRD | Status | Note |
|---|---|---|---|---|
| [ ] | Who returned it, when, and why | FR-STS-005 | ✅ Drawn |  |
| [ ] | Resent as a returned bill (Bill Status R) | FR-PDM-006 | ✅ Drawn |  |

#### A Fresh Payment Advice (after a cancellation)

[Desktop 93:20040](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=93-20040)

| | Element | BRD | Status | Note |
|---|---|---|---|---|
| [ ] | Replaces the cancelled advice; heads, amounts, remarks, documents carried over | BR-CAN-001 | ⏸ Drawn — Decision Pending | Who starts the fresh advice is a position for discussion (Maker, against the same sanction). |

### The Checker Authorises and Signs

*Who:* Programme Division — PD Checker · *BRD:* FR-PDC-001…006 · Annexure G · BR-DSC-001 · BR-SNC-001/002 · FR-SNC-003

The Checker sees exactly what will be sent, beside the original sanction order, and either returns it with a reason or approves it with a digital signature. Approval sends it to PFMS in one request.

#### Authorisation Queue

[Desktop 3:13375](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-13375) · [Desktop 3:13296](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-13296) · [Phone 3:12993](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-12993)

| | Element | BRD | Status | Note |
|---|---|---|---|---|
| [ ] | Advices awaiting authorisation | FR-PDC-001 | ✅ Drawn |  |
| [ ] | Advices authorised by this Checker | FR-PDC-001 | ✅ Drawn |  |

#### Authorise Payment Advice — Review (Annexure G)

[Desktop 3:13204](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-13204) · [Phone 3:12901](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-12901)

| | Element | BRD | Status | Note |
|---|---|---|---|---|
| [ ] | Original sanction order beside the advice, and who sanctioned it | FR-PDC-002 · G | ✅ Drawn |  |
| [ ] | Read-only mirror: sanction header (DDO, PD code, bill number and date, NPB, request identifier) | FR-PDC-002 · G | ✅ Drawn |  |
| [ ] | Read-only mirror: fixed values (payment mode, sanction type, RPR type, bill status, e-Sanction) | G (mirrors every F field) | ❌ Not Drawn | Not shown to the Checker. |
| [ ] | Read-only mirror: heads of account | G | ✅ Drawn |  |
| [ ] | Read-only mirror: beneficiary payment | G | ✅ Drawn |  |
| [ ] | Read-only mirror: supporting documents (names) | G | ✅ Drawn |  |
| [ ] | Read-only mirror: document hash and view link | G · F.4 | ❌ Not Drawn | The Checker sees file names only. |
| [ ] | Check that the advice agrees with the sanction order | FR-PDC-002 | ✅ Drawn |  |
| [ ] | Approve and Sign | G · FR-PDC-004 | ✅ Drawn |  |
| [ ] | Return to Maker | G · FR-PDC-003 | ✅ Drawn |  |
| [ ] | The sanction is not reopened | FR-PDC-003 · BR-SNC-002 | ✅ Drawn |  |

#### Return to Maker — Reason Required

[Desktop 3:13111](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-13111)

| | Element | BRD | Status | Note |
|---|---|---|---|---|
| [ ] | Checker remarks, mandatory on return | FR-PDC-003 · G | ✅ Drawn |  |

#### Who May Sign

[Desktop 3:13018](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-13018) · [Desktop 92:220407](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=92-220407)

| | Element | BRD | Status | Note |
|---|---|---|---|---|
| [ ] | The Maker cannot authorise their own advice | §10 (Maker ≠ Checker) | ✅ Drawn |  |
| [ ] | Only the Checker designated for this DDO may sign | BR-DSC-001 | ✅ Drawn |  |

#### Approve and Sign — Signing

[Pop-up 3:12799](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-12799) · [Pop-up 3:12694](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-12694) · [Pop-up 3:12591](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-12591)

| | Element | BRD | Status | Note |
|---|---|---|---|---|
| [ ] | Confirm: advice number and amount; signing officer and certificate | FR-PDC-004 | ✅ Drawn |  |
| [ ] | Signing with the DSC | FR-PDC-004 · NFR 6.6 | ✅ Drawn |  |
| [ ] | Sent in a single request; cannot be recalled | FR-PDC-005 · FR-SNC-003 · BR-SNC-001 | ✅ Drawn |  |
| [ ] | Received by PFMS | FR-STS-001 | ✅ Drawn |  |
| [ ] | Duplicate-send prevention for the same identifier | FR-PDC-005 | 🔧 System Work — No Screen |  |

#### Signing Problems

[Pop-up 3:12488](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-12488) · [Pop-up 3:12385](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-12385) · [Pop-up 3:12282](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-12282) · [Pop-up 3:12179](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-12179) · [Pop-up 3:12083](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-12083)

| | Element | BRD | Status | Note |
|---|---|---|---|---|
| [ ] | No DSC token found | FR-PDC-004 | ✅ Drawn |  |
| [ ] | Signing utility not running | FR-PDC-004 | ✅ Drawn |  |
| [ ] | Certificate has expired | FR-PDC-004 · BR-DSC-001 | ✅ Drawn |  |
| [ ] | PFMS did not accept the advice | §8.5 · FR-STS-006 | ✅ Drawn |  |
| [ ] | PFMS unreachable: signed, waiting to resend automatically | NFR 6.1 · 6.2 · §8.5 | ✅ Drawn |  |

### PFMS Pays, and e-Anudaan Follows the Payment

*Who:* PFMS (DDO, PAO), the bank; followed by the Maker and Checker · *BRD:* FR-STS-001…006 · Annexure C · BR-CAN-001 · §8.5

After the send, PFMS lands the sanction at the DDO, the DDO draws the bill, the PAO passes it and the bank credits the NGO. e-Anudaan reads each step back and shows it in plain words.

#### Payment Status — Following a Payment

[Desktop 3:12000](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-12000) · [Desktop 3:11915](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-11915) · [Phone 3:11473](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-11473)

| | Element | BRD | Status | Note |
|---|---|---|---|---|
| [ ] | Stage tracker in plain words, with who holds the file | FR-STS-001 · Annexure C · §2.4 | ✅ Drawn |  |
| [ ] | Bill number and bill date | FR-STS-002 | ✅ Drawn |  |
| [ ] | Token number and token date | FR-STS-002 | ✅ Drawn |  |
| [ ] | Voucher number and date | FR-STS-002 | ✅ Drawn |  |
| [ ] | Per beneficiary: amount, payee code, UTR, scroll date, scroll status | FR-STS-003 | ✅ Drawn |  |
| [ ] | Requests sent to PFMS, each with its identifier | FR-PDM-012 · NFR 6.2 | ✅ Drawn |  |
| [ ] | Payment history with officers and times | NFR 6.2 (audit) | ✅ Drawn |  |
| [ ] | The signing officer and time recorded | FR-PDC-004 | ✅ Drawn |  |
| [ ] | The NGO is told only once a UTR is recorded | FR-NTF-001 | ✅ Drawn |  |
| [ ] | Polling GetRequestStatus, bill, voucher and payee APIs | FR-STS-001…003 · NFR 6.1 | 🔧 System Work — No Screen |  |

#### Payment Status — Exceptions

[Desktop 3:11797](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-11797) · [Desktop 3:11856](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-11856) · [Desktop 91:15801](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=91-15801) · [Desktop 3:11723](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-11723) · [Desktop 91:16268](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=91-16268) · [Desktop 92:219954](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=92-219954) · [Pop-up 3:11388](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-11388)

| | Element | BRD | Status | Note |
|---|---|---|---|---|
| [ ] | Not Accepted by PFMS: nothing created, back with the Maker | §8.5 · FR-STS-006 | ✅ Drawn |  |
| [ ] | Waiting to Resend (the BRD's "Pending") | NFR 6.2 · §8.5 | ✅ Drawn |  |
| [ ] | Returned by PFMS: who returned it and why; Correct the Advice | FR-STS-005 | ✅ Drawn |  |
| [ ] | Return order with PFMS's return memo | FR-STS-005 | ⏸ Drawn — Decision Pending | A sample until NeGD supplies PFMS's link. |
| [ ] | Returned and Cancelled: cannot be revived | BR-CAN-001 | ✅ Drawn |  |
| [ ] | Start a fresh payment advice | BR-CAN-001 | ⏸ Drawn — Decision Pending | Position for discussion. |
| [ ] | Financial year expired | Annexure C FinYrExpired | ⏸ Drawn — Decision Pending | Position for discussion. |
| [ ] | Credit failed at the bank | — (BRD silent) | ⏸ Drawn — Decision Pending | Position for discussion. |
| [ ] | Token expiry and automatic re-login | FR-SNC-001 · BR-AUTH-001 | 🔧 System Work — No Screen |  |

#### Payment Status — Before an Advice

[Desktop 3:11685](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-11685) · [Desktop 3:11647](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-11647) · [Desktop 3:11559](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-11559)

| | Element | BRD | Status | Note |
|---|---|---|---|---|
| [ ] | On hold: bank details needed (Bureau back-fills) | BR-BAK-001 | ✅ Drawn |  |
| [ ] | Paid before the PFMS integration | FR-NGO-003 (legacy) | ✅ Drawn |  |
| [ ] | The Under Secretary's view of instalments awaiting a payment advice | Workflow step 3–4 | ✅ Drawn |  |

### The NGO Is Told the Grant Has Been Credited

*Who:* NGO · *BRD:* FR-NTF-001 · FR-NTF-002 · BR-NTF-001

The NGO hears about the payment once, when the bank's UTR is recorded, and can look up where the payment has reached on its own application.

#### Notifications — Grant Credited

[Desktop 3:9047](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-9047) · [Phone 3:8722](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-8722)

| | Element | BRD | Status | Note |
|---|---|---|---|---|
| [ ] | Sanction order number, amount credited and UTR | FR-NTF-002 | ✅ Drawn |  |
| [ ] | Sent only on credit; no notice for intermediate stages | FR-NTF-001 · BR-NTF-001 | ✅ Drawn |  |
| [ ] | Heading of the credit notice | FR-NTF-001 | 🟡 Partly Drawn | Reads "Approved"; it should say the grant was credited. |

#### Application Details — Payment Card

[Desktop 3:9322](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-9322) · [Desktop 3:9134](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-9134) · [Desktop 100:40177](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=100-40177) · [Phone 3:8798](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-8798)

| | Element | BRD | Status | Note |
|---|---|---|---|---|
| [ ] | Payment in Process | FR-STS-001 (NGO view) | ✅ Drawn |  |
| [ ] | Grant Credited: credited on, amount, UTR | FR-STS-003 | ✅ Drawn |  |
| [ ] | Bank account needs checking, with a link to Project Bank Accounts | — (BRD silent) | ⏸ Drawn — Decision Pending | Position for discussion. |

#### Project Bank Accounts — The Bank Could Not Credit a Grant

[Desktop 100:40553](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=100-40553)

| | Element | BRD | Status | Note |
|---|---|---|---|---|
| [ ] | Which project's payment failed, and what to check | — (BRD silent) | ⏸ Drawn — Decision Pending | Position for discussion. |

### Reports

*Who:* Programme Division, Bureau · *BRD:* §2.5 · §11 · FR-STS-004

Six reports: where every file stands, how long it has waited, whether credits match PFMS's release feed, which errors recur, how many claim reference numbers remain, and how long sanction to credit takes.

#### Sanction Pipeline

[Desktop 3:8549](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-8549) · [Phone 3:7943](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-7943)

| | Element | BRD | Status | Note |
|---|---|---|---|---|
| [ ] | Count of files at each stage | §11 · Annexure C | ✅ Drawn | Annexure C's PFMS statuses are grouped into plain stages. |
| [ ] | Off the usual path and on hold, counted separately | §11 | ✅ Drawn |  |
| [ ] | Filter by scheme and stage | §11 | ✅ Drawn |  |

#### Ageing

[Desktop 3:8412](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-8412)

| | Element | BRD | Status | Note |
|---|---|---|---|---|
| [ ] | DDO-wise | §11 | ✅ Drawn |  |
| [ ] | Days since the file last moved, and its stage | §11 | ✅ Drawn |  |
| [ ] | Configurable threshold | §11 | ✅ Drawn |  |

#### Disbursement Reconciliation

[Desktop 3:8279](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-8279)

| | Element | BRD | Status | Note |
|---|---|---|---|---|
| [ ] | Sanctioned vs credited vs UTR | §11 · FR-STS-004 | ✅ Drawn |  |
| [ ] | Scheme-wise and DDO-wise | §11 | ✅ Drawn |  |
| [ ] | Matched against the release and transfer-entry feed | FR-STS-004 | ✅ Drawn |  |
| [ ] | Mismatches flagged | FR-STS-004 | ✅ Drawn |  |
| [ ] | Pull the release feed on demand | FR-STS-004 | ✅ Drawn |  |

#### Failure Trend

[Desktop 3:8228](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-8228)

| | Element | BRD | Status | Note |
|---|---|---|---|---|
| [ ] | Errors by month and by category, with what each means | §11 | ✅ Drawn |  |

#### Claim Reference Pool

[Desktop 3:8072](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-8072)

| | Element | BRD | Status | Note |
|---|---|---|---|---|
| [ ] | Drawn, used and remaining per division code and year | §11 · FR-DOC-003 | ✅ Drawn |  |

#### Turnaround

[Desktop 3:7995](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/E-Anudaan-Handoff?node-id=3-7995)

| | Element | BRD | Status | Note |
|---|---|---|---|---|
| [ ] | Average days from sanction to credit, by scheme | §11 | ✅ Drawn |  |
| [ ] | The longest case (outlier) per scheme | §11 | ✅ Drawn |  |

## System Work — Requirements With No Screen of Their Own

| BRD | What the system must do | What the screens show of it |
|---|---|---|
| FR-SNC-001 | Get an auth code, log in, and renew the 15-minute token without interrupting the officer | BR-AUTH-001: an expired token is never reused |
| FR-SNC-002 | Call PFMS only from the whitelisted IP address, and accept only PFMS's | NFR 6.3 |
| FR-SNC-003 | One ReceiveSanctionData call per bill, carrying everything at once | BR-SNC-001 |
| FR-SNC-004 | Resubmit only under a new identifier that points to the old one | Shown on Payment Status; no resent example drawn |
| FR-PDM-012 | Generate a unique, never-reused identifier for each request | Shown as "Request Identifier" |
| FR-DOC-001 | SHA-256 hash of each PDF, Base64-encoded | Shown as "SHA-256 Fingerprint" |
| FR-DOC-002 | Single-use, time-boxed view link per document | Shown as "PFMS View Link" |
| FR-DOC-003 | Draw claim reference numbers in batches; mark each used | Shown on Claim References |
| FR-MDM-001…004 | Sync the PFMS master lists and check DDO e-Bill status | Shown on Master Data and DDO & Division Codes |
| FR-MDM-005 | Scheduled daily refresh, plus on demand | Refresh Now drawn |
| FR-STS-001…003 | Poll status, bill, voucher and payee payment APIs until Closed or Cancelled | Results shown on Payment Status |
| FR-STS-004 | Pull the Ministry release and transfer-entry feed | Disbursement Reconciliation |
| NFR 6.1 | Time out and queue a slow send; polling never blocks the screens | Waiting to Resend drawn |
| NFR 6.2 | A PFMS outage affects only PFMS functions; every call logged with its identifier | Requests Sent to PFMS drawn |
| NFR 6.3 | HTTPS only; tokens never stored in plain text; DSC keys never stored centrally; document retention | Retention period awaits the Ministry |
| NFR 6.4 | New schemes and RPR types by configuration, no code change | Add Scheme drawn |
| NFR 6.6 | Follow the PFMS API specifications exactly; work with the Ministry's DSC tokens | — |

## The BRD in Plain Words

### What This Document Is

- A plan, from NeGD for the Ministry, to send each sanctioned grant from e-Anudaan to PFMS electronically, follow it to the NGO's bank account, and check the two systems agree. Version 1.0, 8 September 2026, based on the PFMS meeting of 27 August 2026.
- It covers five schemes: NAPDDR first, then AVYAY, SHRESTHA Mode 1, SHRESTHA Mode 2 and SMILE, added by configuration rather than new code.
- The method is a GIFMIS e-Sanction. e-Anudaan builds the sanction in PFMS's format and sends it in one call (ReceiveSanctionData). PFMS then moves the bill through the DDO and the Pay & Accounts Office, and the bank pays the NGO. e-Anudaan reads the results back: bill, voucher, payment, and finally the UTR.
- Where this document and PFMS's published specification differ, PFMS's specification wins.

### Why It Is Needed

- Sanction and bill details are typed again by hand at the DDO, which causes mistakes and delay.
- Once a sanction leaves e-Anudaan, nobody can see the bill, the PAO's passing or the payment in one place.
- The NGO's bank account and PFMS payee code are not collected in a form PFMS can use.
- The head of account is one line of text; PFMS needs four separate codes.
- There is no Maker–Checker control or digital signature on the payment step.
- Checking what PFMS released against what was sanctioned is a manual, occasional job.

### Who Is Involved

- Secretary / Joint Secretary: owns the process and signs off this document.
- Under Secretary, Programme Division (US-PD): issues the sanction and names the PD Maker and PD Checker.
- PD Maker: prepares the payment advice (head of account, DDO and PD code, beneficiary, documents).
- PD Checker: reviews it, signs it with a Digital Signature Certificate (DSC), or returns it to the Maker.
- DDO (in PFMS): receives the sanction and draws the Grant-in-Aid bill.
- PAO (in PFMS): passes the bill and starts the bank transfer.
- NGO: enters and confirms its bank account, IFSC and PFMS payee code; receives the grant.
- PFMS technical team: registration, credentials, IP whitelisting, master data, test environment.
- e-Anudaan engineering team (NeGD): builds the PFMS link, master data, coded heads and the Maker/Checker screens.
- Bureau / scheme division: decides the coded heads, the DDO and PD mapping, and who holds the DSC.

### The Ten Steps (§8.6)

- 1. The NGO applies with its bank account, IFSC and PFMS payee code.
- 2. The review chain runs as today, unchanged.
- 3. The Under Secretary issues the sanction. From here the sanction is final.
- 4. The PD Maker prepares the payment advice.
- 5. The PD Checker authorises it and signs with the DSC.
- 6. e-Anudaan sends it to PFMS in one call.
- 7. The sanction lands at the DDO in PFMS.
- 8. The DDO draws the bill (RPR-34); the PAO passes it.
- 9. The bank pays the NGO; a UTR is created.
- 10. e-Anudaan reads the status, reconciles with the release feed, and only then tells the NGO.

### Module 1 — The NGO's Application Form (FR-NGO)

- FR-NGO-001: a field for the NGO's PFMS payee code, with a mandatory tick confirming it is correct.
- FR-NGO-002: the NGO enters and confirms its bank account number and IFSC; no sanction without both.
- FR-NGO-003: the Bureau can add the payee code and bank details to older sanctioned files that have none.

### Module 2 — PFMS Master Data (FR-MDM)

- FR-MDM-001: copy the Controller, PAO and DDO lists from PFMS for selection.
- FR-MDM-002: copy grant numbers, function heads, object heads and categories, offered as coded choices.
- FR-MDM-003: copy the PD code for each DDO and keep its link to the scheme.
- FR-MDM-004: check the DDO is active for e-Bills before an advice is prepared; warn the Maker if not.
- FR-MDM-005: refresh the lists on a schedule, and on demand by an administrator.

### Module 3 — Coded Head of Account (FR-HOA)

- FR-HOA-001: the head of account becomes four codes: function head (13 digits), object head (2), category, grant number (3).
- FR-HOA-002: the Bureau sets the heads for each scheme, including schemes still waiting for a PFMS scheme code.
- FR-HOA-003: the codes can be added to sanctions already issued but not yet sent to PFMS.

### Module 4 — The PD Maker's Workspace (FR-PDM)

- FR-PDM-001: a queue of sanctioned files by sanction date, showing fresh cases and those PFMS returned.
- FR-PDM-002: sanction number, date, amount, financial year, IFD number and date, and the NGO's bank details are filled in automatically.
- FR-PDM-003: the Maker chooses the DDO code and PD code from the PFMS lists.
- FR-PDM-004: the Maker chooses the four codes for each head (and each deduction head); the heads must add up to the sanction.
- FR-PDM-005: the bill number is generated, unique per DDO per year; the bill date is the day of preparation.
- FR-PDM-006: payment mode 528 (e-payment), sanction type 14 (expenditure), bill status F (or R for a returned bill) and RPR type 7 are set by the system.
- FR-PDM-007: per beneficiary: payee code, name, account, IFSC, gross, net and payee remarks, filled from the application.
- FR-PDM-008: one claim reference number from the PFMS pool for each beneficiary payment.
- FR-PDM-009: the Maker attaches the Claim, Sanction, Bill and PAO Pass Order; each gets a SHA-256 hash and a single-use view link.
- FR-PDM-010: save as draft and come back later.
- FR-PDM-011: submit to the Checker; the advice locks until the Checker returns it.
- FR-PDM-012: every request gets a new, never-reused identifier; a resend points back to the previous one.

### Module 5 — The PD Checker's Workspace (FR-PDC)

- FR-PDC-001: a queue of advices waiting for authorisation.
- FR-PDC-002: a read-only view of exactly what will be sent, beside the original sanction order.
- FR-PDC-003: return to the Maker with a mandatory remark; the sanction itself is not reopened.
- FR-PDC-004: a valid DSC is required; the signer's name and time are recorded.
- FR-PDC-005: after signing, send to PFMS exactly once; block a second send of the same request.
- FR-PDC-006: nobody can change the sanction number, amount or sanctioning authority at this stage.

### Module 6 — Connecting to PFMS (FR-SNC)

- FR-SNC-001: get an auth code, log in (15-minute token, 30-minute refresh) and renew silently.
- FR-SNC-002: call PFMS only from the whitelisted IP, and accept only PFMS's whitelisted IP.
- FR-SNC-003: one call per bill, carrying header, heads, beneficiaries and document hashes together.
- FR-SNC-004: after a failure or cancellation, resend only under a new identifier pointing to the old one.

### Module 7 — Following and Reconciling (FR-STS)

- FR-STS-001: check the status regularly until Closed or Cancelled, and show it (Annexure C).
- FR-STS-002: show bill number and date, token number and date (and voucher details).
- FR-STS-003: record the UTR, scroll status and scroll date for each beneficiary.
- FR-STS-004: pull PFMS's release and transfer-entry feed and flag anything that does not match.
- FR-STS-005: when PFMS returns and cancels a bill, show PFMS's return memo.
- FR-STS-006: show PFMS errors in plain language from a maintained list, never as raw codes.

### Module 8 — Telling the NGO (FR-NTF)

- FR-NTF-001: tell the NGO only when the UTR is recorded, never at an intermediate stage.
- FR-NTF-002: the message gives the sanction number, the amount credited and the UTR.

### Module 9 — Documents and Claim Reference Numbers (FR-DOC)

- FR-DOC-001: SHA-256 hash of each PDF, Base64-encoded, sent to PFMS.
- FR-DOC-002: a time-limited, single-use link for PFMS to view each document.
- FR-DOC-003: draw claim reference numbers from PFMS in batches, keep them by PD code and year, mark each one used.

### The Thirteen Rules (§7)

- BR-NGO-001: no send to PFMS without the NGO's confirmed bank account, IFSC and payee code.
- BR-SNC-001: one call is one bill; a bill is never split.
- BR-SNC-002: the Maker and Checker never reopen or change the sanction.
- BR-SNC-003: RPR type is always 7.
- BR-SNC-004: bill number unique per DDO per year.
- BR-SNC-005: claim reference number required only for an e-Sanction, and only one from the PFMS pool.
- BR-DOC-001: required document hashes grow with where the sanction lands: Claim and Sanction at Approved; plus Bill at the DDO's e-Bill stage; plus PAO Pass Order at PassedByPAO.
- BR-DSC-001: only the Checker designated for a DDO may sign that DDO's sanctions.
- BR-NTF-001: tell the NGO only on a UTR.
- BR-CAN-001: a cancelled sanction is never revived; a new one starts with a new identifier.
- BR-MDM-001: use the latest master data; an unknown DDO, PD code or head blocks submission until refreshed.
- BR-BAK-001: an older file without bank details or payee code goes to back-fill before the Maker's queue.
- BR-AUTH-001: never reuse an expired token; refresh or log in again first.

### Quality Requirements (§6)

- Performance: a send has a time limit, then queues for retry; status checks run in the background.
- Reliability: a PFMS outage affects only PFMS functions (case shown as Pending); every call is logged with its identifier.
- Security: HTTPS only; tokens never in plain text; IP whitelisting both ways; DSC keys stay with the Checker; documents kept for the Ministry's retention period.
- Extensibility: new schemes and future RPR types by configuration, without code changes.
- Usability: a step-by-step form in PFMS's order; errors shown on the field before submitting.
- Integration: follow PFMS's specifications exactly; work with the Ministry's existing DSC tokens.

### When Things Go Wrong (§8.5)

- PFMS rejects the data (isSuccess 0, error code): nothing is sent; the Maker sees the errors, corrects and resends.
- A bill is returned and Cancelled at a higher level: the reason is shown; a new sanction with a new identifier must start from e-Anudaan.
- The token expires mid-call: refresh automatically, or log in again, and retry the same request.
- PFMS or the network is down: queue and retry; the case shows Pending; the rest of the portal works.
- Bill number already used (ERRSNC44): warn the Maker and generate a new number.

### Reports (§2.5, §11)

- Sanction pipeline: count of sanctions at each PFMS status.
- Ageing: days pending at each stage, DDO-wise, with a threshold.
- Disbursement reconciliation: sanctioned vs credited vs UTR, scheme-wise and DDO-wise, against the release feed.
- Failure trend: validation errors by category over time.
- Claim reference pool: drawn, used and remaining, per PD code and year.
- Turnaround: days from sanction to credit, average and outliers, by scheme.

### Not Included (§3.2)

- Any bill type other than RPR-34 Grants-in-Aid (type 7).
- Cheque payment (mode 9); only e-payment (528).
- An account-validation API before sanction; the NGO's confirmed details are trusted.
- PFMS's own set-up and test environment (PFMS's job).
- Changes to the review chain before the sanction.
- SHRESTHA's payment mode (TSA or hybrid) and the Monthly Expenditure Plan certificate, pending a Ministry decision.

### Risks and Dependencies (§9)

- The Bureau has not finalised the coded heads of account (blocks the Maker's screen).
- PFMS has not allotted scheme codes for SHRESTHA Mode 1 and SMILE.
- PFMS registration, credentials and IP whitelisting are pending (blocks every call).
- Older files need their bank details back-filled.
- DSC custody and the Checker officer for each DDO are not yet confirmed.
- SHRESTHA's payment mode is undecided.
- No PFMS test environment or named PFMS officer yet.
- One call per bill means one bad field rejects the whole bill.
- PFMS may change its specification independently of this document.

### Assumptions (§10)

- Based on the 27 August meeting and PFMS's published specifications.
- Only e-payment and RPR-34 for now.
- The review chain is unchanged.
- The NGO's confirmed bank details and payee code are taken at face value.
- Scheme codes: NAPDDR 3817, AVYAY 3968, SHRESTHA Mode 2 3964, DDRS 971, ADIP 1805; Mode 1 and SMILE to come.
- Master data kept current; stale data blocks submission.
- Maker and Checker are different officers.

### Reference Lists (Annexures)

- A: every field of the ReceiveSanctionData call: header, heads (loop), beneficiaries (loop), documents (loop).
- B: RPR type codes; only 7 is in scope.
- C: every PFMS status, from Created through DDO, AAO and PAO stages to Closed, the return states, FinYrExpired and Cancelled.
- D: the 19 PFMS APIs (authentication, sending, status, reconciliation, master data).
- E: document type codes: 1 Claim, 2 Sanction, 3 Approved Notes, 4 Bill, 5 PAO Passing, 6 Other.
- F: the Maker's screen, field by field: header (19), heads (5), beneficiary (9), documents (4), Save as Draft and Submit.
- G: the Checker's screen: a read-only copy of every F field, the sanction order, remarks, DSC, Approve & Sign, Return to Maker.
