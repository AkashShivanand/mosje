# E-Anudaan ASO-PD — recording vs prototype, item by item (07 Oct 2026)

Every element the walkthrough recording of 07 Oct 2026 shows or states for the Programme Division
Dealing Assistant (ASO), set against the prototype on `feat/e-anudaan-aso-review-organise`.
Read from the recording only — the dev portal was not signed into. Defects in the dev build are
in `e-anudaan-aso-pd-review-2026-10-07.md`.

**Key** — ✅ covered · 🆕 covered, built in this branch · 🔁 covered differently, reason given ·
⛔ left out, reason given · ❓ not shown in the recording, cannot be built from it · ➕ added beyond
the recording, reason given.

## Tally

| | Count |
|---|---|
| ✅ Covered | 48 |
| 🆕 Built in this branch | 37 |
| 🔁 Covered differently | 19 |
| ⛔ Left out, with reason | 8 |
| ❓ Not shown — needs portal access | 6 |
| **Items in the recording** | **118** |
| ➕ Added beyond it, with reason | 12 |

Nothing in the recording is unaccounted for. The six ❓ items are one dashboard card hidden in every
frame and five menus the recording never opened; they can be captured once the portal is reachable.

---

## A. My Action Queue (dashboard) — 00:40–01:35

| # | In the recording | Prototype | Status | Reason |
|---|---|---|---|---|
| A1 | Heading "My Action Queue" | "My Queue" | 🔁 | One name for the sidebar item and the heading (audit O-04, 16 Sep) |
| A2 | Line "Every application awaiting your action — across all your schemes…" | "11 applications awaiting your action · ASO - Programme Division" | ✅ | |
| A3 | Refresh button | — | ⛔ | The prototype's queue updates as files move; nothing to re-fetch |
| A4 | Card "Awaiting My Action 13,033" | The count in the heading line | 🔁 | Review call of 11 Sep (T698–737): the card row is New / 1st / 2nd / 3rd, as on the NIC portal |
| A5 | Card "Grant Value ₹… Total requested" | — | ⛔ | Same decision (11 Sep): an officer plans the day by case type, not by the sum requested |
| A6 | Third card | — | ❓ | Hidden behind the browser's password prompt in every frame |
| A7 | Card "Pending > 7 days 13,028 · Oldest — clear these first" | "6 over 7 days" on the New Projects card; Pending — Ageing; Waiting Longest | ✅ | |
| A8 | "Queue by Scheme" bars (AVYAY, NAPDDR, SMILE, SHRESHTA_M2, SHRESHTA_M1) | Scheme filter with a count per scheme | 🆕 | A filter answers the same question and opens the rows; bars only count them |
| A9 | "Pending — by Financial Year" bars | Financial Year control on the page | 🔁 | 11 Sep: with a year control, a by-year chart says nothing |
| A10 | "Pending — by Case / Instalment": New, Ongoing 1st / 2nd / 3rd | The four case-type cards, each filtering the table | ✅ | |
| A11 | …"Existing (Recurring Grant)" and "Not stated" | — | ⛔ | Legacy buckets: every prototype file carries a case type, and SHRESHTA M1's recurring grant is not modelled |
| A12 | "Pending — Ageing" chart, 0–3 / 4–7 / over 7 days | Pending — Ageing card, same three bands | ✅ | |
| A13 | Alert "13,028 applications pending beyond 7 days" | Over-7-days count on the card and the band | ✅ | |
| A14 | "Applications Awaiting Action", "Showing 1–10 of 13,033" | Applications table with its count and pager | ✅ | |
| A15 | Type chips: All, New, Ongoing, 1st/2nd/3rd Instalment, Not stated | Case Type filter | 🔁 | One filter beside the others, set by the cards too ("Not stated": see A11) |
| A16 | Sort: Default order | Sortable columns | 🔁 | Sorting where the reader looks, on the column |
| A17 | Search by GIA ID / NGO | Search: Project ID or NGO | ✅ | |
| A18 | All states | State filter | 🆕 | |
| A19 | All districts (pick a state) | District shown under the state in each row | ⛔ | Eleven files in the queue; a district filter would empty it |
| A20 | "Needs my action" | Status filter | ✅ | |
| A21 | All Years | Financial Year control | ✅ | |
| A22 | Column S.No. | — | ⛔ | The count line and pager carry the position |
| A23 | Column GIA ID | Application No. under the Project ID | ✅ | |
| A24 | Column NGO | NGO, linked to NGO 360 | ✅ | |
| A25 | Column State | State (with district) | 🆕 | |
| A26 | Column Scheme | Scheme | ✅ | |
| A27 | Column Type ("New") | Case type under the Project ID | ✅ | |
| A28 | Column Action "Process" | "Review" | 🔁 | The verb for an officer examining a file, used estate-wide |

## B. Sidebar — Dealing Assistant, Programme Division

| # | In the recording | Prototype | Status | Reason |
|---|---|---|---|---|
| B1 | Dashboard | My Queue | 🔁 | See A1 |
| B2 | Application Search | All Applications | 🔁 | Named for the page it opens (inventory note, 13 Sep) |
| B3 | NGO Directory | NGO Directory | ✅ | |
| B4 | SM1 Fee Claims ▸ | — | ❓ | Never opened; SHRESHTA M1 is not modelled |
| B5 | AVYAY (Atal Vayo Abhyuday Yojana) ▸ | — | ❓ | Never opened |
| B6 | NAPDDR ▸ Approval & Sanction · Review Queue · MIS Overview · Scoring & Selection | — | ❓ | Labels seen, pages never opened |
| B7 | NAPDDR ▸ Sent · IR Repository | Sent and IR Repository pages exist estate-wide | 🔁 | Not yet under a NAPDDR group; confirm they are the same registers |
| B8 | SMILE ▸ | — | ❓ | Never opened |
| B9 | SHRESHTA M2 — Dealing Assistant | All Applications | 🔁 | The live label names the grade, not the page (13 Sep) |
| B10 | Sanctioned Applications | Sanctioned Applications | ✅ | |
| B11 | Returned Applications | Returned Applications | ✅ | |
| B12 | Forwarded Applications | Forwarded Applications | ✅ | |
| B13 | PD Queries | Queries | 🔁 | "PD" also names the Programme Director (O-08) |
| B14 | Inspection ▸ | — | ❓ | Never opened |
| B15 | Bell with count, avatar, "(Dealing Assistant - Program Division)" | Bell, avatar, "ASO - Programme Division" | ✅ | |

## C. Review screen — header and Application Details

| # | In the recording | Prototype | Status | Reason |
|---|---|---|---|---|
| C1 | ← back | "← My Queue" | 🆕 | Named for where it goes |
| C2 | "ASO-PD Review — GIA/2026-27/…" as the heading | NGO name as heading; application no. and Project ID below | 🔁 | Who and what, not a 40-character reference (audit, 14 Sep) |
| C3 | Badges "ASO-PD", "New Project" | "Review · Assistant Section Officer, Programme Division"; case type in Summary; status badge | 🔁 | Spelled out: "PD" was ambiguous |
| C4 | NAPDDR · NGO · district, state | Project · scheme · FY line | ✅ | |
| C5 | NGO | Heading | ✅ | |
| C6 | DARPAN ID | NGO-Darpan ID | ✅ | |
| C7 | Registration No. | Registration No. | 🆕 | |
| C8 | Scheme | Scheme in the header line | ✅ | |
| C9 | Project ID | Header | ✅ | |
| C10 | Sanctioned Strength (40 beneficiaries) | Total Beneficiaries (SC · other) | ✅ | |
| C11 | Amount Requested | Grant Sought, with the recurring / non-recurring split | ✅ | The split is what the cost sheet's ceilings need |
| C12 | NGO Grade: NA | — | ⛔ | No source holds a grade; a field that always reads NA answers nothing |

## D. Application — As Filled by the NGO

| # | In the recording | Prototype | Status | Reason |
|---|---|---|---|---|
| D1 | Every answer, grouped (Organisation & Registration, Other Details…) | Application tab: every section of the NAPDDR form, each with its question count | ✅ | |
| D2 | Org website as a link | Answers as recorded | ✅ | |

## E. Amount Pipeline

| # | In the recording | Prototype | Status | Reason |
|---|---|---|---|---|
| E1 | Four stages: Proposed (ASO) → Recommended (JS-PD) → Concurred (JS-IFD) → Final Approved (JS-PD) | Proposed → Recommended → Concurred → Sanctioned (Programme Director) | 🆕 | In this estate the Programme Director sanctions (BRD §5.2–5.3). **Confirm** who gives final approval |
| E2 | Each stage "Pending" | Amount, who, and date once recorded; "Awaiting …" on the current stage | 🆕 | The dev build showed Pending everywhere even after costing |
| E3 | "Updates when the file is forwarded" (00:02:21) | Read from the file's movement | 🆕 | |

## F. Previous Sanctions — this NGO

| # | In the recording | Prototype | Status | Reason |
|---|---|---|---|---|
| F1 | Table: Financial Year, Instalment, Sanction No., Date, Project Type, Sanctioned, Disbursed | Year, Sanction (with date), Project (scheme · instalment), Sanctioned, Disbursed | 🆕 | Columns folded to fit beside the decision |
| F2 | "Same financial year or earlier" (00:02:48) | All years, newest first | ✅ | |
| F3 | Same-project predecessor highlighted | "This Project" mark | 🆕 | Said in words; the dev build's highlight was never drawn |
| F4 | Earlier instalment of this year's grant flagged in green | "This Year" mark | 🆕 | Same |
| F5 | Total previously sanctioned | Total previously allocated, with the order count | ✅ | |
| F6 | NAPDDR sanctions only | Every scheme, the scheme named per row | 🔁 | Due diligence reads the NGO's whole record |

## G. Cost Sheet

| # | In the recording | Prototype | Status | Reason |
|---|---|---|---|---|
| G1 | "Cost Sheet — DDAC" | "Cost Sheet" · project type in the description | 🆕 | |
| G2 | Differs by project type (DDAC; IRCA by bed capacity) | Schedules for DDAC and IRCA 15/30/50 | 🆕 | IRCA from the Department's published norms. **Confirm** the beds: the call may say 25 where the norms say 30 |
| G3 | Bed-capacity dropdown | "Bed Capacity" select for a general IRCA | 🆕 | |
| G4 | Recommended amount defaults to the norm | Opens at the norm | 🆕 | |
| G5 | "Seeded from the cost norms — not saved yet" | "Not Saved" / "Unsaved Changes" / "Saved by … on …" | 🆕 | |
| G6 | NGO requested (total) | NGO's Claim, per head and in total | 🆕 | |
| G7 | Non-recurring and recurring sections | Both | 🆕 | |
| G8 | Columns #, Item, Norm, Proposed (ASO-PD), Remarks, delete | Number, item with its norm beneath, amount, remove | 🆕 | Six columns did not fit beside the decision or on a phone |
| G9 | Remarks box on every row | A reason field when the amount leaves the norm | 🔁 | Asked where it explains something; 24 empty boxes doubled every row |
| G10 | Delete with "Remove cost-sheet item?" dialog | Remove, undone in place ("Removed: … ↶") | 🔁 | Nothing is lost, so no dialog is needed |
| G11 | EITHER/OR rows (Doctor rural / urban), delete one | "Doctor — Choose One" | 🆕 | Both were counted until one was deleted |
| G12 | + Add item | Add Item, named by the officer | 🆕 | |
| G13 | Norm total · NGO claimed · Admissible (min) per head | The same three figures per head | 🆕 | |
| G14 | "Exceeds admissible by ₹…" | The excess, and why the claim is the ceiling | 🆕 | |
| G15 | "Cap to admissible" button | — | ⛔ | It must choose which items to cut — the officer's judgement, not arithmetic |
| G16 | Total admissible | Admissible Ceiling | 🆕 | |
| G17 | Total recommended grant | Recommended Grant, both heads | 🆕 | The dev build printed one head |
| G18 | "Exceeds the admissible ceiling — reduce before saving" | The save is refused, each problem next to its row | 🆕 | |
| G19 | Reset | Reset to Norm | 🆕 | |
| G20 | Save cost sheet | Save Cost Sheet | 🆕 | |

## H. Statement of Account

| # | In the recording | Prototype | Status | Reason |
|---|---|---|---|---|
| H1 | Budgetary allocation (In Rs.) | Budgetary Allocation | 🆕 | |
| H2 | Up to date Expenditure | Expenditure to Date | 🆕 | |
| H3 | Balance Available after this release (typed) | Balance After This Release, computed | 🆕 | Arithmetic should not be typed into a financial record |
| H4 | Save Statement | Save Statement | 🆕 | |
| H5 | Separate from the cost sheet (05:52) | Its own card and state | 🆕 | The dev build nested it inside the cost sheet |

## I. Officer Supporting Documents

| # | In the recording | Prototype | Status | Reason |
|---|---|---|---|---|
| I1 | "Officer Supporting Documents (0)" | Same, with the count | ✅ | |
| I2 | "PDF, JPG or PNG, up to 10 MB" | 10 MB | 🆕 | Was 5 MB, the NGO's limit |
| I3 | "No supporting documents uploaded yet" | Empty line | ✅ | |
| I4 | Document title (optional) | Document Title, not required | ✅ | |
| I5 | Upload PDF/JPG/PNG | Upload | ✅ | |

## J. Show Cause Notices

| # | In the recording | Prototype | Status | Reason |
|---|---|---|---|---|
| J1 | Card shown to the ASO with only its description | Section appears only once a notice exists | 🔁 | A card with nothing in it answers no question (ui-restraint rule) |
| J2 | Issued by SO and JS only (07:52) | Issue Show Cause Notice in More Actions, PD SO and JS only | ✅ | |

## K. Sanction & Disbursement — this Project

| # | In the recording | Prototype | Status | Reason |
|---|---|---|---|---|
| K1 | Grants for this project with what was released | Same, in History | ✅ | |
| K2 | "No sanctioned grants on record for this NGO" beside five sanctions above | One reading of the record | ✅ | The dev build contradicts itself |

## L. Audit Trail — File Movement

| # | In the recording | Prototype | Status | Reason |
|---|---|---|---|---|
| L1 | Collapsible, with a count | History tab, File Movement and Remarks | 🔁 | It has its own tab, so it needs no collapse |
| L2 | Entry: who, role, action, time, remark | Same | ✅ | |
| L3 | "Shows the progress of the application" (08:24) | Same | ✅ | |

## M. Documents Review

| # | In the recording | Prototype | Status | Reason |
|---|---|---|---|---|
| M1 | "Verify each of the 12 documents" | "0 of 12 required documents reviewed", with a progress bar | ✅ | |
| M2 | Permanent documents group | Permanent and annual groups | ✅ | |
| M3 | Document name with required * | Same | ✅ | |
| M4 | ⓘ description | The description under the name | 🆕 | NAPDDR's own descriptions |
| M5 | Review dropdown: Pending / Verified / Query | Verified · Needs Correction | 🔁 | Words settled in the review call of 11 Sep (T752–768) |
| M6 | PD Remarks | A remark, required when a document needs correction | ✅ | |
| M7 | File download | View, in a preview sheet | ✅ | |

## N. Officer Decision

| # | In the recording | Prototype | Status | Reason |
|---|---|---|---|---|
| N1 | "Officer Decision", forward up to SO-PD | Your Decision, beside every tab | ✅ | |
| N2 | Overall remarks mandatory | Remarks required | ✅ | |
| N3 | 0 / 200 words | Word count and a 200-word limit | 🆕 | |
| N4 | "Review every document before deciding. 12 still Pending…" | Before You Forward: each thing still owed, linked | ✅ | |
| N5 | Save & Forward to SO-PD → | Forward to the Section Officer | ✅ | |
| N6 | Roles differ, so options differ (08:38) | Actions come from each role's capabilities | ✅ | |

## O. Said in the call, not on screen

| # | Said | Status | Reason |
|---|---|---|---|
| O1 | UAT common API, NTA production, IP whitelist (01:40–02:10) | ⛔ | Hosting and integration, not interface |
| O2 | "Organise this long sheet" (08:54) | 🆕 | Four tabs, each saying what is still owed |

## ➕ Added beyond the recording — and why

| # | Added | Why |
|---|---|---|
| X1 | Four tabs: Application · Documents · Grant · History | The instruction itself |
| X2 | Tab labels carry what is owed: "Documents (12 to Verify)", "Grant (2 to Save)" | A tab that hides owed work would be worse than the long page |
| X3 | "Save the Cost Sheet" and "Save the Statement of Account" in Before You Forward | The forward says what it waits for before it is pressed |
| X4 | The forward waits for both saves | Otherwise the pipeline's first stage can be empty. **Confirm** |
| X5 | Statement marked "Out of Date" when the sheet is saved again | Its balance was computed from the earlier release |
| X6 | Discard Changes | Undoes unsaved edits without losing the saved sheet |
| X7 | Certification step before forwarding | Already in the prototype from the live captures (BR-SM2-05) |
| X8 | Raise Deficiency, Reject, More Actions (inspection, report) | Already in the prototype from the live DECISION captures of 16 Sep |
| X9 | Automatic-check result on each document | Already in the prototype; advice, never the verdict |
| X10 | Phone layout: amounts under items; decision bar at the foot | The dev build's table cut amounts off at 390px |
| X11 | Seed: a DDAC file, a costed IRCA further up the chain, NAPDDR's own documents | So every stage and both project types can be shown |
| X12 | `TabPanel hidden` in the design system | An unsaved sheet survives a look at another tab |

## To confirm with the Department or the dev team

1. Final approval of the amount: JS-PD (the recording) or the Programme Director (this estate's BRD).
2. IRCA bed capacities: 15/30/50 (published norms) or 15/25/50 (as the call may have said).
3. Whether the ASO's forward waits for both saves (X4).
4. The DDAC schedule, to replace the dev portal's figures.
5. The pages behind B4–B8 and B14, which the recording never opened.
