# e-Anudaan × PFMS — the payment leg

**Source:** [`docs/source-brd/eAnudaan_PFMS_Integration_BRD.pdf`](../source-brd/eAnudaan_PFMS_Integration_BRD.pdf) — *BRD, Integration of PFMS with the e-Anudaan Portal: Sanction Transmission, Payment Disbursement and Reconciliation (US-PD Maker–Checker Module)*, NeGD, v1.0, 8 Sep 2026, draft for review. All 42 pages read.
**Branch:** `feat/e-anudaan-pfms` · **Started:** 29 Sep 2026
**Scope, as asked:** everything in the BRD, as a coded prototype in the hub and as Figma handoff screens.

## 1. What changes, in one paragraph

Until now a sanctioned grant was paid with one click: the Under Secretary pressed **Release Funds** and the file read "Released". The BRD replaces that click with a **payment leg**:

1. a **Maker** in the Programme Division prepares a payment advice;
2. a **Checker** authorises it with a Digital Signature Certificate;
3. e-Anudaan sends it to PFMS in **one `ReceiveSanctionData` call per bill**;
4. PFMS draws the bill at the DDO, passes it at the PAO and pays through the bank;
5. e-Anudaan reads each stage back, records the **UTR**, reconciles against the release feed, and tells the NGO **only when the credit is confirmed**.

The review-and-sanction chain before it is unchanged.

## 2. Where it lives

| Part | Path |
|---|---|
| Rules (pure, tested) | `apps/hub/src/lib/e-anudaan/pfms/` — `types` · `stages` · `advice` · `simulator` · `errors` · `masters` · `reports` · `selectors` · `seed` · `pfms.test.ts` |
| Store | `lib/e-anudaan/pfms/store.tsx`, a separate key (`e-anudaan.pfms.v1`) beside the main store |
| The one hand-off to the grant file | `workflow.ts` `recordPfmsCredit()` → the main store's `recordPfmsCredit` |
| Maker | `(console)/dashboard/payments/prepare` and `…/prepare/[appId]` |
| Checker | `(console)/dashboard/payments/authorise` and `…/authorise/[appId]` |
| Case page | `(console)/finance/payment-status/[appId]` (reworked) |
| Bureau | `(console)/dashboard/pfms/*` |
| Reports | `(console)/dashboard/payment-reports` |
| NGO | `(ngo)/ngo/bank-accounts` (payee code) · `(ngo)/ngo/my-applications/[appId]` (payment stage) |
| Demo | the dock's **PFMS** tab — `components/e-anudaan/demo-pfms-panel.tsx` |
| Shared UI | `components/e-anudaan/pfms/` — `payment-ui` · `advice-steps` · `advice-summary` · `sign-dialog` |

**Sign-ins added** (the existing mock password):

| Seat | Login ID | Lands on |
|---|---|---|
| Maker – Programme Division | 9200000813 | Payment Advices |
| Checker – Programme Division | 9200000814 | Authorisation Queue |
| Bureau – PFMS Set-Up | 9200000815 | PFMS Set-Up |

## 3. Design decisions

1. **One stage list, read everywhere.** Annexure C has 30 PFMS statuses. They are grouped into **nine plain stages and six exceptions** in `stages.ts`. The queues, the case page, the review screen's Instalments panel, the reports, the NGO's page and the demo dock all read `stageOf()`. No screen can call a payment one thing while another calls it something else (`data-state-completeness.md` §2).
2. **"Paid" means a UTR on every beneficiary**, not PFMS's `Closed`, which comes days later. It is the moment the NGO is waiting for.
3. **The credit is the only thing the payment leg writes to the grant file.** It uses the same `release` record and the same "Grant Released" audit entry the old click wrote. Every existing screen that reads a release is therefore still correct, and the next instalment still opens on it. The NGO's notice carries the sanction number, the amount and the UTR (FR-NTF-002).
4. **Check locally, before the single call.** Because one wrong field rejects the whole bill (§9), the Maker's wizard runs every check that can be made without PFMS, beside the field it concerns:
   - the heads of account must add up to the sanction, with a running total;
   - the DDO must have e-Bill activated;
   - the division code must be mapped to the chosen DDO;
   - payee remarks are limited to 25 characters;
   - the documents required at the level where the sanction lands must be uploaded;
   - master data must be fresh;
   - the scheme must have a PFMS code.

   The message under a field and the message in the summary above the form are the same sentence.
5. **PFMS error codes never reach the Maker raw.** Each code maps to a plain sentence, a step and a field, and the Bureau can reword the sentence. The code is kept in the history and shown on the Bureau's and the reports' own screens.
6. **Held files get their own tab.** A file waiting for a payee code, a back-fill or a scheme code goes to **On Hold**, with the reason in words, rather than sitting greyed out among files the Maker can work on.
7. **The Checker compares side by side:** the sanction order on the left, the exact payload on the right. The payload is the same component the Maker reviewed. If the figures do not agree, it is said in words and **Approve and Sign** is disabled.
8. **The DSC dialog designs every outcome:** signing utility not running, no token, certificate expired, not the designated officer, the Checker's own advice, accepted, refused, and PFMS unreachable. The Sign button cannot send twice.
9. **The file itself never leaves the browser.** Only its SHA-256 fingerprint (computed in the browser) and a single-use view link go to PFMS (FR-DOC-001/002).
10. **"PD" is never abbreviated on screen.** The seats are "Maker" and "Checker", and the PD code is "Division Code (PD Code)". The estate's glossary forbids the bare "PD" because it also names the Programme Director (audit O-08).
11. **Nothing new in the design system.** Every screen is composed from existing components. The five candidates in the plan are not promoted yet, because only one portal uses them so far: coded head picker, amount allocation, compare layout, signature dialog, source tag. They are recorded here so the second use is the prompt.

## 4. Open questions for NeGD and the Ministry

Questions 1, 2, 3, 5, 6, 7, 8, 10, 13, 14, 15, 16, 17 and 18 could change screens and are red notes on their journeys on the Figma handoff page; 4, 9, 11 and 12 are listed on its Status page. The prototype takes the position in the right-hand column until someone decides otherwise.

**1 Oct 2026.** The independent verification (`2026-10-01-e-anudaan-pfms-brd-verification.md`) found gaps where the BRD is silent or undecided. The product owner chose the positions below for 3, 13, 14 and 15 on 1 Oct 2026, each **to be discussed with NeGD and the Ministry**; they are built so the screens can be judged, not because they are settled.

| # | Question | Prototype's position |
|---|---|---|
| 1 | Is "Maker ≠ Checker" a business rule, or only an assumption (§10)? | Enforced — an officer cannot sign an advice they prepared |
| 2 | Are the Maker and Checker seats of their own, or duties given to existing PD grades? | Their own sign-ins, designated per DDO by the Under Secretary. **Walkthrough, 1 Oct 2026:** the Programme Division names them from its own officers — a junior Maker (an ASO), a senior Checker (a US) ([notes](./2026-10-01-e-anudaan-walkthrough-notes.md) §4) |
| 3 | After "Returned and Cancelled" (or "Financial Year Expired"), who starts the fresh case, and does it go back through the review chain? | **Decided for discussion, 1 Oct 2026:** the Maker starts a fresh payment advice against the same sanction (Start a Fresh Payment Advice). It goes through the Checker again; its first request points back to the cancelled one, which is kept read-only. The sanction and the review chain are not reopened |
| 4 | When is Bill Status "R" used, given a cancelled sanction cannot be revived and a refusal creates nothing at PFMS? | "R" when a bill PFMS returned **without** cancelling it is resubmitted (FR-PDM-001, FR-PDM-006); "F" after a refusal, and for a fresh advice. PFMS to confirm that a return without cancellation exists for an e-Sanction |
| 5 | Does a corrected advice need the Checker's signature again? | Yes — it goes back through the Checker |
| 6 | For an e-Sanction, does PFMS skip its own `Submitted` / `PassByPDMaker` / `PendingDSCPDChecker` / `Approved`? | They read as "Received by PFMS" |
| 7 | May the NGO see "Payment in Process" on its own page before the credit (not a notification)? | Shown on the application page; notified only on credit |
| 8 | Must the NGO confirm bank details the Bureau back-filled for a legacy file? | Not required; the source is shown as "Entered by Bureau" |
| 9 | Is the landing status configured per DDO? | Per DDO, in the master data |
| 10 | Which DSC signing utility is used? | Any; the dialog designs its failure states generically |
| 11 | Is there record locking when two Makers open one file? | Not modelled |
| 12 | SHRESTHA payment mode (TSA or hybrid) | Drawn as NAPDDR's, flagged on the scheme's heads page |
| 13 | What happens when the bank cannot credit the NGO (a failed scroll)? The BRD is silent | **Decided for discussion, 1 Oct 2026:** the case reads "Credit Failed at Bank" with the Programme Division; the NGO is asked, on its application and on Project Bank Accounts, to check its account; once it is correct the Maker starts a fresh payment advice, paid to the account then on record. No notification is sent (BR-NTF-001 reserves notifications for a credit) |
| 14 | SHRESTHA Mode 1 has no application form in the portal | **Decided for discussion, 1 Oct 2026:** configured on PFMS Set-Up as "Scheme Code Awaited", with an Add Scheme action so a scheme joins by configuration (NFR §6.4). The full Mode 1 form and journey are **waiting on the BA** for its fields and flow |
| 15 | PFMS's return-order document "via the configured link" (FR-STS-005): NeGD has not supplied the link | **Decided for discussion, 1 Oct 2026:** the Return Order opens a sample memo marked "Sample", generated by `tools/e-anudaan-samples/return-memo.mjs`, until NeGD supplies the link pattern |
| 16 | Is SMILE paid through PFMS? The BRD lists five schemes; the walkthrough of 1 Oct 2026 said four are, and SMILE is not | SMILE stays on Heads of Account as "Scheme Code Awaited" until the Department confirms; the note is on Keeping PFMS Set-Up Current |
| 17 | When the DDO finds a bill not in order, does it go back to the Checker (walkthrough, 1 Oct 2026) or the Maker? The BRD lists returns at the DDO (Annex C) but its flows handle only a return marked Cancelled (§8.5) | To the Maker, then through the Checker again; the note is on Following a Payment |
| 18 | Who attaches the supporting documents — the Maker (FR-PDM-009, Annex F.4) or the Checker (walkthrough, 1 Oct 2026)? | The Maker, in Step 4, as the BRD; the note is on Authorising a Payment Advice |

## 5. Illustrative, and why

Every PFMS code in the prototype has the right **shape** but is not a real account code:
- DDO, PAO and PD codes;
- Function Heads, Object Heads, Categories and Grant Numbers;
- payee codes;
- UTRs.

The Bureau has not finalised the heads (§9, on the critical path), and the prototype has no PFMS. The exceptions are the scheme codes, which are the BRD's own (NAPDDR 3817, AVYAY 3968, SHRESTHA Mode 2 3964), and the error codes the BRD names (ERRM05, ERRSNC44). Other error codes are marked **illustrative** on the Bureau's Error Messages page and must be replaced from the PFMS Claim WebAPI specification.

## 6. Traceability

The full line-by-line check — every objective, scope item, requirement, rule, workflow step, KPI and
annexure, with its evidence — is [`2026-09-29-e-anudaan-pfms-brd-checklist.md`](./2026-09-29-e-anudaan-pfms-brd-checklist.md).

| BRD | Where it is met |
|---|---|
| FR-NGO-001/002, BR-NGO-001 | Application form (Bank Account Details, every scheme): payee code with a confirmation tick and the account typed twice; Project Bank Accounts for an account already on record; payee check in `validateAdvice`; sanction blocked without bank account and IFSC (`sanctionBankGap`) |
| FR-NGO-003, BR-BAK-001 | Bureau Legacy Files; the "Bank Details Needed" hold |
| FR-MDM-001…005, BR-MDM-001 | Bureau Master Data, DDO & Division Codes; stale-master block |
| FR-HOA-001…003 | Bureau Heads of Account; the four linked pickers in the Maker's step 2 |
| FR-PDM-001…012 | Maker queue and wizard; `advice.ts` |
| FR-PDC-001…006, BR-DSC-001 | Checker queue, review and sign dialog; `certificateCheck` |
| FR-SNC-001…004 | `authoriseAndTransmit`, `resendQueued` (token handling is server-side and not drawn) |
| FR-STS-001…006 | Payment Status page; `simulator.ts`; `errors.ts` |
| FR-NTF-001/002, BR-NTF-001 | `recordPfmsCredit` — the only notice, with sanction, amount and UTR |
| FR-DOC-001…003, BR-DOC-001, BR-SNC-005 | Maker step 4; the claim-reference pool; Bureau Claim References |
| BR-CAN-001 | Cancelled is terminal; the case says a fresh sanction is needed |
| §11 (six dashboards) | Payment Reports |

## 7. Verification

- `node --test "src/lib/e-anudaan/**/*.test.ts"`: the PFMS suite, plus every existing e-Anudaan suite.
- The seed changed: six projects sanctioned this year are left unpaid, so the payment leg has files in flight.
  - They were **added**, not taken from existing projects. Taking them first broke 30 renewal tests that depend on those projects' open instalments.
  - The size ceiling in `store-persistence.test.ts` rose from 1.925M to 2.0M characters, with the reason stated beside it.
  - The main store's schema moved from 12 to 13, so a copy stored by an older build is re-seeded.
- The scripted walk (Maker → Checker → PFMS → NGO) at 1440 and 375 is recorded in the PR.
