# E-Anudaan — ASO-PD review of a NAPDDR file (dev portal walkthrough, 07 Oct 2026)

**Source:** the screen recording of the developers' walkthrough, 07 Oct 2026 (9 min 12 s), of
`eanudaan-admin-dev.mosje.in/dashboard/pd/aso/review/84230`, signed in as "Demo Officer
(Dealing Assistant – Program Division)". The dev portal was not signed into for this pass;
everything below is read from the recording.

**The instruction given in the call:** "you just need to organise this long sheet."

## What the dev portal's ASO-PD review now carries

Twelve sections in one column, in this order: Application Details · Application — As Filled by
the NGO · Amount Pipeline · Previous Sanctions — this NGO · Cost Sheet — DDAC (with the Statement
of Account inside it) · Officer Supporting Documents · Show Cause Notices · Sanction &
Disbursement — this Project · Audit Trail — File Movement · Documents Review · Officer Decision.

Rules stated in the call:

- The cost sheet is not static: it is seeded from the norm for the project type (DDAC, IRCA by
  bed capacity — 15/30/50). The ASO proposes per item, adds and deletes items, and saves.
- The cost sheet and the Statement of Account are different records, saved separately.
- The amount moves: proposed by the ASO, recommended by JS-PD, concurred by JS-IFD, final.
- Previous sanctions are shown for the same financial year and earlier.
- Show Cause Notices are issued at SO and JS level; the ASO sees them for reference.
- Roles differ, so the options on the screen differ by role.

## Defects in the dev build, for the development team

| # | What the recording shows | Why it matters |
|---|---|---|
| D1 | "Total recommended grant ₹3,45,000" under a recurring total of ₹77,24,000 | The total is the non-recurring head alone; the grant is both heads |
| D2 | Both "(a) Doctor (Full time) … (Rural)" and "(Urban)" seeded, marked EITHER/OR; the officer must delete one | Every norm total counts two doctors (₹77,24,000 instead of ₹70,04,000 or ₹70,64,000) until someone notices |
| D3 | "NGO claimed: ₹0 · Admissible (min): ₹0 · Exceeds admissible by ₹77,24,000" on the recurring head | The NGO's ₹5,00,000 request was booked entirely to non-recurring, so the recurring ceiling is zero and the sheet can never be saved |
| D4 | "Balance Available under the scheme after this release" is a typed field | It is allocation − expenditure − this release; typing it invites an arithmetic error on a financial record |
| D5 | The Statement of Account sits inside the Cost Sheet card, under a second Save | In the call itself the designer had to ask whether they were one record or two |
| D6 | "Previous Sanctions — this NGO" lists five sanctions; "Sanction & Disbursement — this Project" below says "No sanctioned grants on record for this NGO" | Two contradictory statements about the same NGO on one screen |
| D7 | "The same-project predecessor is highlighted; an earlier instalment of this year's grant is flagged in green" — nothing is highlighted | The legend describes marks that are not drawn |
| D8 | Project types print as codes: `IRCA_15`, `IRCA_MALE_CHILDREN` | Internal identifiers on an officer's screen |
| D9 | Show Cause Notices card shown to the ASO with only its description, no notices | A card that answers no question for this officer |
| D10 | Documents Review and Officer Decision are the last two sections, after the audit trail | The officer's actual work is at the bottom of a page several thousand pixels long |
| D11 | "Amount Pipeline" shows "Pending" in all four stages while the ASO is costing the file | The proposed amount exists on screen but the pipeline does not read it |

## What the prototype does instead (branch `feat/e-anudaan-aso-review-organise`)

- **Four tabs** — Application · Documents · Grant · History — in the order the officer works,
  each labelled with what is still owed ("Documents (12 to Verify)", "Grant (2 to Save)"). The
  decision stays beside every tab; anything open on the file stays above them.
- **Grant tab:** the Amount Pipeline (read from the saved cost sheet and the file's movement),
  the Cost Sheet, and the Statement of Account as two separate cards, each with its own state and
  Save (D5, D11).
- **Cost sheet:** an either/or post is a choice that must be made before saving (D2); the
  recommended grant is both heads (D1); each head is held to the lower of its norm and the NGO's
  claim, with the claim taken from the application's own recurring/non-recurring split (D3); an
  item's reason is asked for only when its amount leaves the norm; removing an item is undone in
  place.
- **Statement of Account:** the balance is computed (D4); if the cost sheet is saved again after
  the statement, the statement is marked Out of Date and must be saved again.
- **Before You Forward** gains "Save the Cost Sheet" and "Save the Statement of Account".
- **Norms:** IRCA 15/30/50 from the Department's published schedule (2021-22,
  socialjustice.gov.in), every printed total reconciled; DDAC transcribed from the dev portal.

## Open — needs a decision

1. **DDAC norms.** No published DDAC schedule was found; the prototype carries the dev portal's
   figures. The Department's own schedule should replace them.
2. **IRCA — Female and IRCA — Male Children** have no cost sheet: their norms are not held.
3. **Forward gate.** The prototype will not let the ASO forward a NAPDDR file until both records
   are saved. The dev portal's rule was not stated in the call.
4. **Figma.** Done for the desktop NAPDDR screens on 8 Oct 2026 — four tab screens in E-Anudaan [Handoff] ›
   Officers · Reviewing Applications › Reviewing an Application › Desktop (`408:27862`, `410:37090`, `410:37644`,
   `410:38195`). Phone screens and the other grades' screens are the next pass
   (`docs/design-handoffs/E-Anudaan-Handoff-Page.md` §5i).
