# e-Anudaan and PFMS — Walkthrough of 1 Oct 2026

**Source:** an audio recording of the Department-side team (the business analyst explaining to the design team) walking
through e-Anudaan and its PFMS integration, 1 Oct 2026, about 12½ minutes of content in a 15½-minute file, in Hindi
with English terms.
**Method:** transcribed locally with Whisper large-v3 twice — once in Hindi, once translated to English after
normalising the volume — and read side by side. Parts of the audio are faint; where neither pass was clear, this
note says so rather than guessing. The last three minutes are unrelated office conversation and are not recorded here.
**Checked against:** the NeGD BRD (*Integration of PFMS with the e-Anudaan Portal*, v1.0, 8 Sep 2026,
`docs/source-brd/eAnudaan_PFMS_Integration_BRD.pdf`), read in full — §5a. Plain-words guide:
[`2026-10-01-e-anudaan-pfms-explained.md`](./2026-10-01-e-anudaan-pfms-explained.md). The speaker said the amount
rules below are in the main e-Anudaan BRD, not the PFMS one, and the PFMS BRD agrees by leaving the review chain
out of scope (p. 10).
**In Figma:** `E-Anudaan [Handoff]` › Start Here › **Guide — How a Grant Moves** (`132:1052`), and the notes on the
five journeys listed in §5.

---

## 1. The schemes

e-Anudaan carries five schemes. **Four are paid through PFMS; SMILE is not.**

| Scheme | Who the grant is for, as described |
|---|---|
| SHRESHTA Mode 1 | Students shortlisted by the National Testing Agency, in private schools. The application is made from the list of shortlisted students the school receives ("three boys, four girls"); the flow is otherwise the same. *Who* applies — the school or another body — was not clear in the audio. |
| SHRESHTA Mode 2 | Schools run by NGOs; the grant covers every child. |
| AVYAY | NGOs serving senior citizens, for their beneficiaries. |
| SMILE (Garima Greh) | Transgender persons. |
| NAPDDR | Drug de-addiction. |

## 2. The review chain

Each division has the same five grades: Assistant Section Officer, Section Officer, Under Secretary, Deputy Secretary
(or Director), Joint Secretary. "PD" in the speaker's words is always the **Programme Division** — "JS PD", "US PD",
"PD Maker", "PD Checker". "IFD" is the Integrated Finance Division.

1. The NGO applies. The file reaches the Programme Division's **Assistant Section Officer**, who checks the documents and records remarks.
2. The **Section Officer** checks the remarks. The Section Officer may forward the file, or send a deficiency directly to the NGO. **No other officer in the chain writes to the NGO.**
3. The Under Secretary, Deputy Secretary and Joint Secretary of the Programme Division forward it in turn.
4. After the Programme Division's Joint Secretary, the file goes to the Integrated Finance Division's Assistant Section Officer and climbs the same five grades.
5. The Integrated Finance Division's **Joint Secretary concurs an amount**.
6. The file returns to the **Programme Division's Joint Secretary** for approval of the amount. *"Until the JS PD approves the final administrative amount, there will be no sanction."*
7. The **Programme Division's Under Secretary issues the sanction order.**

## 3. The amount, step by step

| # | Figure | Who records it | Rule |
|---|---|---|---|
| 1 | Recommended | Assistant Section Officer, Programme Division | from the NGO's expenditure |
| 2 | Proposed | Joint Secretary, Programme Division | travels with the file to finance |
| 3 | Recommended | Assistant Section Officer, Integrated Finance Division | its own figure; "not related" to the Programme Division's |
| 4 | Concurred | Joint Secretary, Integrated Finance Division | **may not exceed the proposed amount** |
| 5 | Final (administrative approval) | Joint Secretary, Programme Division | compares 2 and 4 — the speaker's example: ₹5,00,000 proposed, ₹4,50,000 concurred |
| 6 | Sanction order | Under Secretary, Programme Division | issued for the final amount |

## 4. The payment leg

1. After the sanction order, two Programme Division roles act: the **PD Maker** and the **PD Checker**. The Programme Division decides who holds them — the Maker a junior officer ("it could be the ASO"), the Checker a senior one ("suppose the US").
2. The **Maker generates the e-bill** from the sanction order: the NGO's details and account number, the headers (object head, functional head), and the DDO and PAO codes, which come from the PFMS API. The heads change every year; the speaker said "a super admin" keeps that master (the Bureau, in the drawings).
3. The **Checker** checks it. Not in order — returned. In order — signed with a DSC, and it lands at the DDO on PFMS. The Checker also attaches documents, such as the utilisation certificate, which travel hashed, as a link.
4. **Each scheme has its own DDO.** The DDOs sit in the Department and use PFMS; e-Anudaan keeps the DDO master and codes.
5. The **DDO checks** the bill and documents. Not in order — **sent back to the Checker**; the Checker corrects it and sends it again, and the forward flow resumes.
6. Then the PAO and the bank, on PFMS. "Nothing to do with us."
7. The sanction and payment details then appear on the NGO's portal and the officer's.
8. **Once the Under Secretary has issued the sanction, the file never goes back up the chain.** Corrections circle between the Maker, the Checker and the DDO.

## 5a. Checked against the PFMS BRD

The first version of this note and of the Figma guide leaned on the repo's BRD explainer and verification documents.
The BRD itself was then read in full. Where it settles a point, the guide and the notes now say so.

| Point | Walkthrough | PFMS BRD | Result |
|---|---|---|---|
| Who issues the sanction | Under Secretary, Programme Division | **Same** — "the point an Under Secretary, Programme Division (US-PD) issues a sanction" (p. 5); stakeholders (p. 11); glossary (p. 33) | The two sources agree; the drawn Programme Director is the outlier |
| What "PD" means | the Programme Division | **Same** — glossary: "PD — Programme Division" (p. 33) | "Programme Director" is very likely a misreading of "PD" |
| Maker and Checker | duties of Programme Division officers, junior and senior | **Same in substance** — "US-PD Login — PD Maker / PD Checker Workspace" (§5.4–5.5); the US-PD designates them "within the Division" (p. 11); different officers assumed (p. 31); the Checker holds the DSC for a given DDO (BR-DSC-001) | Separate sign-ins in the drawings are the outlier |
| Who attaches the supporting documents | the Checker (e.g. the utilisation certificate) | **The Maker** — claim, sanction, approved notes, bill, PAO pass order, other (FR-PDM-009; Annex E, F.4); the Checker sees them read-only (Annex G) | Screens follow the BRD; the walkthrough is the outlier. The guide's Checker stage was corrected to the BRD |
| A bill the DDO returns | back to the Checker | Annex C lists returns at the Dealing Hand, AAO, PAO, DDO and PD Checker levels, each with a return-order step; the flows (§8.5) handle only a return marked **Cancelled** → a fresh sanction (BR-CAN-001) | Open — the BRD names the state but not the path |
| SMILE | not paid through PFMS | applicable; its PFMS scheme code to be allotted before go-live (pp. 1, 9, 30, 31) | Open — the two sources disagree |
| Review chain and amounts | four amounts before the sanction | out of scope, "unchanged" (pp. 10, 29, 31); carries only the IFD concurrence number and date (Annex F.1) | Not contradicted; belongs to the main e-Anudaan BRD |
| Corrections after the sanction | never go back up the chain | **Same** — "The Maker and Checker do not reopen or alter the sanction" (p. 6; BR-SNC-002) | Confirmed |
| Codes and heads | from the PFMS API; a super admin keeps the yearly heads | **Same** — master data synced from PFMS (FR-MDM-001…005); the Bureau configures the four-part head of account per scheme (FR-HOA-002) | Confirmed |
| Telling the NGO | the details reach the NGO's pages | the NGO is notified **only** on a confirmed UTR (FR-NTF-001, BR-NTF-001) | The guide's last stage now says so |

## 5. Where it differs from the screens — and where each is recorded

The screens were **not** changed (Figma is the source of truth and each point is the Department's to decide).
Each difference is written into the `Note — Needs Discussion` at the top of the journey it would change.

| What | Walkthrough | Drawn today | Journey (note added or extended) |
|---|---|---|---|
| Who sanctions | JS (Programme Division) approves the final amount; US (Programme Division) issues the sanction order — **the PFMS BRD agrees** (§5a) | a Programme Director sanctions, returns or rejects after finance concurs (`workflow.ts`, `roles.ts`) | Examining and Sanctioning an Application — affects Sanction Desk and Sent Applications too |
| Amounts along the review | four figures before the sanction (§3) | no amount until the Programme Director's Amount to Sanction | **Reviewing an Application — now Needs Discussion** |
| SMILE and PFMS | SMILE is not paid through PFMS | SMILE configured on Heads of Account, "Scheme Code Awaited" — the BRD lists all five (U-1.2-1, RD-2) | Keeping PFMS Set-Up Current |
| Who the Maker and Checker are | named by the Programme Division from its own officers — junior Maker, senior Checker — **the PFMS BRD agrees**: workspaces in the US-PD login | separate sign-ins (`pd-maker`, `pd-checker`) | Authorising a Payment Advice (PFMS question 2) |
| A bill the DDO finds not in order | goes back to the Checker | a bill PFMS returns goes back to the Maker | Following a Payment |
| Who attaches the documents | the Checker, e.g. the utilisation certificate | the Maker, in Step 4 — **as the PFMS BRD** (FR-PDM-009, Annex F.4) | Authorising a Payment Advice |

**Confirmed, no change:** only the Section Officer sends a deficiency to the NGO (`workflow.ts` — the ASO notes it,
the SO communicates it); corrections after the sanction never reopen the review chain (PFMS question 3); DDO and PAO
codes and heads come from PFMS, one DDO per scheme; documents travel as hashed links (FR-DOC-002, Step 4 of the
payment advice); payment details reach the NGO's pages after the credit.

## 6. What the walkthrough settles about the labels

- **"Programme Director" may be a misreading of "PD".** The speaker never used "Programme Director"; every "PD" was
  the Programme Division. The glossary (`glossary.ts`, 16 Sep 2026) chose "Programme Director" from the live portal's
  `PD` console. Nothing was renamed: if the Department confirms that the sanction sits with the Programme Division's
  Joint Secretary and Under Secretary, the `Programme Director — Sanctioning` column, its three journeys, the
  glossary and `workflow.ts` change together, Figma first.
- **The two divisions are one chain in sequence, not two parallel reviews.** The Portal Map's one-line flow now says
  so, and How to Read says what "PD" means in the Department's speech.

## 7. Questions to put to the Department

1. Who approves the final amount and who issues the sanction order — the Programme Director, or the Programme Division's Joint Secretary and Under Secretary (as the walkthrough and the PFMS BRD both say)?
2. Is each of the four amounts recorded on the officer's screen, and does each later officer see the earlier ones?
3. Is SMILE paid outside PFMS? If so, how is it paid, and should SMILE come off PFMS Set-Up?
4. Are the Maker and Checker duties given to existing Programme Division officers (as the walkthrough and the BRD both suggest), and may the Under Secretary who issued the sanction also be the Checker?
5. When the DDO returns a bill, does it go to the Checker (walkthrough) or the Maker (drawn)?
6. SHRESHTA Mode 1: who applies — the school, from the NTA list, or another body?
7. Who attaches the supporting documents to the payment advice — the Maker (BRD) or the Checker (walkthrough)? Is the utilisation certificate one of them?
