# E-Anudaan ASO (Programme Division) — Recording Checklist, With Placement

Where every item of the 07 Oct 2026 recording tally (`docs/audit/e-anudaan-aso-pd-recording-tally-2026-10-07.md`) is placed, in the prototype and in the Figma handoff file. Prepared 08 Oct 2026.

**Sources and method**

- **Prototype:** worktree `wt-aso` at commit `396cf635`. Component files are under `apps/hub/src/components/e-anudaan/`, library files under `apps/hub/src/lib/e-anudaan/`; each cell cites `file:line` read from the code. Routes: ASO queue `/portals/e-anudaan/dashboard/pd/aso`; ASO review `/portals/e-anudaan/dashboard/sm2/aso/review/<id>` (DDAC file `GIA/2026-27/NAPDDR/SOUTH_DELHI/04823`, IRCA file `GIA/2026-27/NAPDDR/AHMEDABAD/01638`).
- **Figma:** E-Anudaan [Handoff], `K0B3vuOTXpxw6kt0px2Cqo`, page "Officers · Reviewing Applications", read over REST with `tools/figma-read/read.mjs` (file last modified 08 Oct 2026, 05:46 UTC). An element counts as drawn only when its text is found in a **visible** TEXT node or a component text property. Hidden layers were excluded: several hidden template texts ("Label", "Placeholder", "As stated in step 5 of the application.", "0 of 12 done." under the save steps) would otherwise have produced false matches.
- **Queue frames:** `3:36854` and `3:35725` were redrawn on 08 Oct from the prototype: Scheme and State filters, the State column with district, 11 applications, "6 over 7 days", the ageing figures, Waiting Longest, and the pager (the eleventh file, the NAPDDR District De-Addiction Centre, is on page 2 as in the prototype). The Assistant Section Officer's nine desktop review screens were given the current side menu the same day.
- **Placed:** `Both` · `Prototype only` · `Figma only` · `Neither — left out (reason)` · `Neither — not shown in recording`. Where the drawn state covers the item but a later state is not drawn, the item is `Both` and the note says what is missing.

## Summary

| Placed | Recording items (118) | Added items ➕ (12) | Total |
|---|---|---|---|
| Both | 104 | 11 | 115 |
| Prototype only | 0 | 1 | 1 (X12, code-only behaviour — nothing to draw) |
| Figma only | 0 | 0 | 0 |
| Neither — left out | 8 | 0 | 8 |
| Neither — not shown in recording | 6 | 0 | 6 |
| **Total** | **118** | **12** | **130** |

### The Former Figma Gaps — All Drawn on 08 Oct 2026

Every item below was built but not drawn when this checklist was first compiled. All are now drawn; the rows in the tables carry the frame. Kept here as the record of what was closed.

| # | Item | What is missing in Figma |
|---|---|---|
| A16 | Sortable columns | No sort affordance on any column header of the queue table (`3:36854`) |
| B7 | Sent · IR Repository | Pages exist in the prototype (not in the ASO sidebar); not drawn in any frame read |
| D2 | Org website as a link (answers as recorded) | Application sections are drawn collapsed (`408:27862`); no answer, and so no website, is drawn |
| E3 | Pipeline updates as the file is forwarded | Only the opening state is drawn (all four stages awaiting); no stage with an amount, officer and date |
| F3 | "This Project" mark on an earlier sanction of the same project | No row carries the mark (`410:38195`); the drawn file has no earlier sanction of its own project |
| G2 | Cost sheet differs by project type (DDAC; IRCA 15/30/50) | Only the DDAC schedule is drawn; no IRCA schedule |
| G3 | Bed Capacity select (general IRCA) | Not drawn |
| G9 | Reason field when an amount leaves the norm | Not drawn; every drawn amount equals its norm |
| G10 | Remove, undone in place ("Removed: … ↶") | Remove buttons are drawn; the removed state with its restore link is not |
| G14 | Excess over the admissible amount, and why the claim is the ceiling | Not drawn |
| G18 | Save refused, each problem beside its row | No error state of the cost sheet is drawn |
| I1 | Officer Supporting Documents (n) | Whole card absent from every ASO frame (desktop and phone) |
| I2 | PDF, JPG or PNG, up to 10 MB | As I1 |
| I3 | Empty line ("No supporting document has been attached.") | As I1 |
| I4 | Document Title (optional) | As I1 |
| I5 | Upload PDF, JPG or PNG | As I1 |
| X5 | Statement marked "Out of Date" after a re-save of the sheet | Neither the badge nor the "The Release Has Changed" alert is drawn |
| X6 | Discard Changes | Not drawn (it appears only with unsaved edits to a saved sheet) |
| X12 | `TabPanel hidden` in the design system | Code-only behaviour; nothing to draw — not a gap |

Eighteen of the nineteen are real drawing gaps; X12 needs no frame.

**Also found while reading Figma (not tally items):**

- The four NAPDDR review frames (`408:27862`, `410:37090`, `410:37644`, `410:38195`) still draw the **old sidebar** — "Dashboard", "PD Queries", "Rejected Applications" and no "Returned Applications" — while the queue frame `3:36854` and the prototype (`roles.ts:105-118`) read "My Queue", "Queries", "Returned Applications" and "Rejected Applications".
- The queue cards in `3:36854` read "Pending with you"; the prototype's second line is "N over 7 days" (`action-queue.tsx:157-161`). The "Waiting Longest" list (`action-queue.tsx:235-250`) is not drawn.
- The "Show Cause Notices" card with an empty line ("No show cause notice has been issued on this application.") is drawn behind the Raise a Deficiency dialog (`3:27066`), which the prototype no longer renders when no notice exists (J1).

---

## A. My Action Queue (Dashboard) — 00:40–01:35

| # | In the recording | Status (tally key) | Prototype — where | Figma — where | Placed |
|---|---|---|---|---|---|
| A1 | Heading "My Action Queue" | 🔁 | ASO queue › page heading "My Queue" — `action-queue.tsx:124` | Queue, desktop ([3:36854][q]) "My Queue" heading; Queue, phone ([3:35725][qm]) | Both |
| A2 | Line "Every application awaiting your action — across all your schemes…" | ✅ | ASO queue › heading line "N applications awaiting your action · ASO - Programme Division" — `action-queue.tsx:126-129` | Queue, desktop ([3:36854][q]) "10 applications awaiting your action · ASO - Programme Division" | Both |
| A3 | Refresh button | ⛔ | — (left out) | — (left out) | Neither — left out (the queue updates as files move) |
| A4 | Card "Awaiting My Action 13,033" | 🔁 | ASO queue › count in the heading line — `action-queue.tsx:128` | Queue, desktop ([3:36854][q]) heading line count | Both |
| A5 | Card "Grant Value ₹… Total requested" | ⛔ | — (left out) | — (left out) | Neither — left out (decision of 11 Sep: officers plan by case type) |
| A6 | Third card | ❓ | — | — | Neither — not shown in recording |
| A7 | Card "Pending > 7 days 13,028 · Oldest — clear these first" | ✅ | ASO queue › New Projects card "N over 7 days" `action-queue.tsx:157-161`; Pending — Ageing `:212-232`; Waiting Longest `:235-250` | Queue, desktop ([3:36854][q]) Pending — Ageing "Over 7 days (6)". New Projects card "6 over 7 days" and Waiting Longest drawn 8 Oct | Both |
| A8 | "Queue by Scheme" bars (AVYAY, NAPDDR, SMILE, SHRESHTA_M2, SHRESHTA_M1) | 🆕 | ASO queue › Applications › Scheme filter with a count per scheme — `worklist-table.tsx:634-639, 690` | Queue, desktop ([3:36854][q]) and phone ([3:35725][qm]) — drawn 8 Oct | Both |
| A9 | "Pending — by Financial Year" bars | 🔁 | ASO queue › Financial Year control — `action-queue.tsx:140-146` | Queue, desktop ([3:36854][q]) "Financial Year · All years"; phone ([3:35725][qm]) | Both |
| A10 | "Pending — by Case / Instalment": New, Ongoing 1st / 2nd / 3rd | ✅ | ASO queue › four case-type cards, each filtering the table — `action-queue.tsx:149-165` (labels `officer.ts:44`, `glossary.ts:203`) | Queue, desktop ([3:36854][q]) New Projects · 1st · 2nd · 3rd Instalment cards | Both |
| A11 | …"Existing (Recurring Grant)" and "Not stated" | ⛔ | — (left out) | — (left out) | Neither — left out (legacy buckets; recurring grant not modelled) |
| A12 | "Pending — Ageing" chart, 0–3 / 4–7 / over 7 days | ✅ | ASO queue › Pending — Ageing card — `action-queue.tsx:212-232` | Queue, desktop ([3:36854][q]) "0–3 days (1) · 4–7 days (3) · Over 7 days (6)" | Both |
| A13 | Alert "13,028 applications pending beyond 7 days" | ✅ | ASO queue › Over-7-days band (danger tone) and card count — `action-queue.tsx:161, 229` | Queue, desktop ([3:36854][q]) "Over 7 days (6) · 60%" | Both |
| A14 | "Applications Awaiting Action", "Showing 1–10 of 13,033" | ✅ | ASO queue › Applications table, count line `worklist-table.tsx:701`, table `:724-729`, pager `:485` | Queue, desktop ([3:36854][q]) "10 applications" and table. Pager not drawn (ten rows) | Both |
| A15 | Type chips: All, New, Ongoing, 1st/2nd/3rd Instalment, Not stated | 🔁 | ASO queue › Case Type filter — `worklist-table.tsx:513-515, 692` | Queue, desktop ([3:36854][q]) "Case Type · All Case Types"; phone ([3:35725][qm]) | Both |
| A16 | Sort: Default order | 🔁 | ASO queue › sortable columns — `worklist-table.tsx:168, 207, 278` | Sort marks on Project ID, State, Scheme and Pending For — every desktop queue, e.g. ASO queue ([3:36854](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/?node-id=3-36854)) — drawn 8 Oct | Both |
| A17 | Search by GIA ID / NGO | ✅ | ASO queue › Search "Project ID or NGO" — `worklist-table.tsx:689` | Queue, desktop ([3:36854][q]) "Search · Project ID or NGO" | Both |
| A18 | All states | 🆕 | ASO queue › State filter — `worklist-table.tsx:691` | Queue, desktop ([3:36854][q]) and phone ([3:35725][qm]) — drawn 8 Oct | Both |
| A19 | All districts (pick a state) | ⛔ | — (left out); district shown under the state in each row — `worklist-table.tsx:218` | — (left out) | Neither — left out (eleven files; a district filter would empty the queue) |
| A20 | "Needs my action" | ✅ | ASO queue › Status filter — `worklist-table.tsx:695` | Queue, desktop ([3:36854][q]) "Status · All Statuses" | Both |
| A21 | All Years | ✅ | ASO queue › Financial Year control — `action-queue.tsx:140-146` | Queue, desktop ([3:36854][q]) "All years" | Both |
| A22 | Column S.No. | ⛔ | — (left out) | — (left out) | Neither — left out (count line and pager carry the position) |
| A23 | Column GIA ID | ✅ | ASO queue › Project ID column, application no. beneath — `worklist-table.tsx:165-180` | Queue, desktop ([3:36854][q]) "SC/RJ/JAI/02029 GIA/2026-27/SHRESHTA_M2/JAIPUR/00089" | Both |
| A24 | Column NGO | ✅ | ASO queue › NGO column, linked to NGO 360 — `worklist-table.tsx:185-195, 643` | Queue, desktop ([3:36854][q]) NGO column. Link styling not verified over REST | Both |
| A25 | Column State | 🆕 | ASO queue › State column with district — `worklist-table.tsx:204-220` | Queue, desktop ([3:36854][q]) — drawn 8 Oct | Both |
| A26 | Column Scheme | ✅ | ASO queue › Scheme column — `worklist-table.tsx:275-278` | Queue, desktop ([3:36854][q]) "Scheme" column ("NAPDDR FY 2026-27") | Both |
| A27 | Column Type ("New") | ✅ | ASO queue › case-type badge under the Project ID — `worklist-table.tsx:175` | Queue, desktop ([3:36854][q]) "New Project" badge | Both |
| A28 | Column Action "Process" | 🔁 | ASO queue › Action "Review" — `worklist-table.tsx:133, 152-158` | Queue, desktop ([3:36854][q]) "Review" | Both |

## B. Sidebar — Dealing Assistant, Programme Division

| # | In the recording | Status (tally key) | Prototype — where | Figma — where | Placed |
|---|---|---|---|---|---|
| B1 | Dashboard | 🔁 | Sidebar › "My Queue" — `roles.ts:105` | Queue, desktop ([3:36854][q]) sidebar "My Queue". NAPDDR review frames still read "Dashboard" | Both |
| B2 | Application Search | 🔁 | Sidebar › "All Applications" — `roles.ts:109` | Queue, desktop ([3:36854][q]) sidebar | Both |
| B3 | NGO Directory | ✅ | Sidebar › "NGO Directory" — `roles.ts:106` | Queue, desktop ([3:36854][q]) sidebar | Both |
| B4 | SM1 Fee Claims ▸ | ❓ | — | — | Neither — not shown in recording |
| B5 | AVYAY (Atal Vayo Abhyuday Yojana) ▸ | ❓ | — | — | Neither — not shown in recording |
| B6 | NAPDDR ▸ Approval & Sanction · Review Queue · MIS Overview · Scoring & Selection | ❓ | — | — | Neither — not shown in recording |
| B7 | NAPDDR ▸ Sent · IR Repository | 🔁 | Pages `app/portals/e-anudaan/(console)/dashboard/sent/page.tsx` and `…/ir-repository/page.tsx`, in another role's sidebar (`roles.ts:230-231`); not in the ASO's | Programme Director's Sent Applications and Inspection Reports (page 4; not the ASO's menu) ([3:17037](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/?node-id=3-17037)) — drawn 8 Oct | Both |
| B8 | SMILE ▸ | ❓ | — | — | Neither — not shown in recording |
| B9 | SHRESHTA M2 — Dealing Assistant | 🔁 | Sidebar › "All Applications" — `roles.ts:109` | Queue, desktop ([3:36854][q]) sidebar | Both |
| B10 | Sanctioned Applications | ✅ | Sidebar — `roles.ts:110` | Queue, desktop ([3:36854][q]) sidebar | Both |
| B11 | Returned Applications | ✅ | Sidebar — `roles.ts:113` | Queue, desktop ([3:36854][q]) sidebar. Absent from the NAPDDR review frames' sidebar | Both |
| B12 | Forwarded Applications | ✅ | Sidebar — `roles.ts:115` | Queue, desktop ([3:36854][q]) sidebar | Both |
| B13 | PD Queries | 🔁 | Sidebar › "Queries" — `roles.ts:117` | Queue, desktop ([3:36854][q]) "Queries". NAPDDR review frames still read "PD Queries" | Both |
| B14 | Inspection ▸ | ❓ | — | — | Neither — not shown in recording |
| B15 | Bell with count, avatar, "(Dealing Assistant - Program Division)" | ✅ | Header › bell `console-shell.tsx:142-147`; identity chip "ASO - Programme Division" `roles.ts:20, 194` | NAPDDR Application ([408:27862][ra]) navbar: bell, "AR", "Ananya Rao · ASO - Programme Division" (the "9+" count layer is hidden) | Both |

## C. Review Screen — Header and Application Details

| # | In the recording | Status (tally key) | Prototype — where | Figma — where | Placed |
|---|---|---|---|---|---|
| C1 | ← back | 🆕 | ASO review › header › "← My Queue" — `review-shell.tsx:450-452` | NAPDDR Application ([408:27862][ra]) "My Queue" back link; all four tabs | Both |
| C2 | "ASO-PD Review — GIA/2026-27/…" as the heading | 🔁 | ASO review › header › NGO name `review-shell.tsx:458`; application no. and Project ID `:462-464` | NAPDDR Application ([408:27862][ra]) "Sankalp Seva Sansthan"; "Application No. … · Project ID DR/DL/SDL/03657" | Both |
| C3 | Badges "ASO-PD", "New Project" | 🔁 | ASO review › header › "Review · Assistant Section Officer, Programme Division" `review-shell.tsx:455-457`; status badge `:468-470`; case type in Summary `:496` | NAPDDR Application ([408:27862][ra]) same line; badge "Received · With the Assistant Section Officer"; Summary "Case Type · New project" | Both |
| C4 | NAPDDR · NGO · district, state | ✅ | ASO review › header › project · scheme · FY line — `review-shell.tsx:459-461` | NAPDDR Application ([408:27862][ra]) "District De-Addiction Centre — South Delhi · NAPDDR · FY 2026-27" | Both |
| C5 | NGO | ✅ | ASO review › header heading — `review-shell.tsx:458` | NAPDDR Application ([408:27862][ra]) heading | Both |
| C6 | DARPAN ID | ✅ | ASO review › Application tab › Summary › NGO-Darpan ID — `review-shell.tsx:494` | NAPDDR Application ([408:27862][ra]) Summary "NGO-Darpan ID" | Both |
| C7 | Registration No. | 🆕 | ASO review › Application tab › Summary › Registration No. — `review-shell.tsx:495` | NAPDDR Application ([408:27862][ra]) "Registration No. 81-51"; phone ([424:34759][ram]) | Both |
| C8 | Scheme | ✅ | ASO review › header line — `review-shell.tsx:460` | NAPDDR Application ([408:27862][ra]) header line "NAPDDR" | Both |
| C9 | Project ID | ✅ | ASO review › header — `review-shell.tsx:463` | NAPDDR Application ([408:27862][ra]) "Project ID DR/DL/SDL/03657" | Both |
| C10 | Sanctioned Strength (40 beneficiaries) | ✅ | ASO review › Summary › Total Beneficiaries (SC · other) — `review-shell.tsx:497` | NAPDDR Application ([408:27862][ra]) "Total Beneficiaries 15 (SC 6 · other 9)" | Both |
| C11 | Amount Requested | ✅ | ASO review › Summary › Grant Sought with the split — `review-shell.tsx:498` | NAPDDR Application ([408:27862][ra]) "Grant Sought ₹76.00 L (recurring ₹72.00 L · non-recurring ₹4.00 L)" | Both |
| C12 | NGO Grade: NA | ⛔ | — (left out) | — (left out) | Neither — left out (no source holds a grade) |

## D. Application — As Filled by the NGO

| # | In the recording | Status (tally key) | Prototype — where | Figma — where | Placed |
|---|---|---|---|---|---|
| D1 | Every answer, grouped (Organisation & Registration, Other Details…) | ✅ | ASO review › Application tab › "Application" accordion, each section with its question count — `review-shell.tsx:1089-1121` | NAPDDR Application ([408:27862][ra]) thirteen sections "1. Application Type 3 questions" … "13. Verification & Authorised Person 8 questions" | Both |
| D2 | Org website as a link | ✅ | ASO review › Application tab › section answers, as recorded (plain text) — `review-shell.tsx:1117, 1127` | Application tab, section open — the website as a link (prototype now links it too) ([457:261495](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/?node-id=457-261495)) — drawn 8 Oct | Both |

## E. Amount Pipeline

| # | In the recording | Status (tally key) | Prototype — where | Figma — where | Placed |
|---|---|---|---|---|---|
| E1 | Four stages: Proposed (ASO) → Recommended (JS-PD) → Concurred (JS-IFD) → Final Approved (JS-PD) | 🆕 | ASO review › Grant tab › Amount Pipeline — `grant-recommendation.tsx:78-104`; stages `cost-sheet.ts:314-323` | NAPDDR Grant ([410:37644][rg]) Proposed · Recommended · Concurred · Sanctioned (Programme Director); phone ([424:35998][rgm]); open question recorded in the Needs Discussion note ([135:27862][note]) | Both |
| E2 | Each stage "Pending" | 🆕 | Amount Pipeline step description: amount, who, date, or "Awaiting the …" — `grant-recommendation.tsx:94` | NAPDDR Grant ([410:37644][rg]) "Awaiting the Assistant Section Officer, Programme Division" and each stage's officer. A stage with a recorded amount is not drawn | Both |
| E3 | "Updates when the file is forwarded" (00:02:21) | 🆕 | Read from the file's movement — `cost-sheet.ts:320-323` | Integrated Finance Division — Section Officer, NAPDDR File: pipeline with amounts, officers and dates ([457:248916](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/?node-id=457-248916)) — drawn 8 Oct | Both |

## F. Previous Sanctions — This NGO

| # | In the recording | Status (tally key) | Prototype — where | Figma — where | Placed |
|---|---|---|---|---|---|
| F1 | Table: Financial Year, Instalment, Sanction No., Date, Project Type, Sanctioned, Disbursed | 🆕 | ASO review › History tab › Funding History › Previously Allocated Funds — This NGO: Year, Sanction (date), Project (scheme · instalment), Sanctioned, Disbursed — `review-panels.tsx:153-202` | NAPDDR History ([410:38195][rh]) rows "SAN/2026-27/04789 · Sanctioned ₹23.12 L · Disbursed ₹0 / SR/MH/THN/03656 · AVYAY · New project · 22 Jul 2026"; phone ([424:37087][rhm]) | Both |
| F2 | "Same financial year or earlier" (00:02:48) | ✅ | All years, newest first — `review-panels.tsx:157-202` (pages of 5/25) | NAPDDR History ([410:38195][rh]) | Both |
| F3 | Same-project predecessor highlighted | 🆕 | "This Project" badge on the row — `review-panels.tsx:193` (shown only when such a row exists) | Section Officer — History Tab (Earlier Sanction of This Project) ([457:253685](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/?node-id=457-253685)) — drawn 8 Oct | Both |
| F4 | Earlier instalment of this year's grant flagged in green | 🆕 | "This Year" badge — `review-panels.tsx:170` | NAPDDR History ([410:38195][rh]) "2026-27 · This Year" | Both |
| F5 | Total previously sanctioned | ✅ | "Total previously allocated: … across N sanction orders" — `review-panels.tsx:204-206` | NAPDDR History ([410:38195][rh]) "Total previously allocated: ₹23.58 Cr across 61 sanction orders." | Both |
| F6 | NAPDDR sanctions only | 🔁 | Every scheme, named per row — `review-panels.tsx:189-191` | NAPDDR History ([410:38195][rh]) rows name AVYAY and NAPDDR | Both |

## G. Cost Sheet

| # | In the recording | Status (tally key) | Prototype — where | Figma — where | Placed |
|---|---|---|---|---|---|
| G1 | "Cost Sheet — DDAC" | 🆕 | ASO review › Grant tab › Cost Sheet title and description — `grant-recommendation.tsx:165-170` | NAPDDR Grant ([410:37644][rg]) "Cost Sheet"; "District De-Addiction Centre · Opens at the scheme's cost norm…" | Both |
| G2 | Differs by project type (DDAC; IRCA by bed capacity) | 🆕 | Schedules DDAC and IRCA 15/30/50 — `cost-sheet.ts:121, 142` | NAPDDR Rehabilitation Centre, Grant Tab — IRCA 30-bed schedule ([457:36775](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/?node-id=457-36775)) — drawn 8 Oct | Both |
| G3 | Bed-capacity dropdown | 🆕 | Cost Sheet › "Bed Capacity" select (general IRCA) — `grant-recommendation.tsx:175-190` | NAPDDR Rehabilitation Centre, Grant Tab — Bed Capacity select ([457:36775](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/?node-id=457-36775)) — drawn 8 Oct | Both |
| G4 | Recommended amount defaults to the norm | 🆕 | Opens at the norm — `grant-recommendation.tsx:106-110` | NAPDDR Grant ([410:37644][rg]) every amount equals its norm (e.g. "Norm ₹3,25,000" / "3,25,000") | Both |
| G5 | "Seeded from the cost norms — not saved yet" | 🆕 | "Not Saved" / "Unsaved Changes" / "Saved" badges `grant-recommendation.tsx:153-158`; "Saved by … on …" `:69, 168` | NAPDDR Grant ([410:37644][rg]) "Not Saved". "Unsaved Changes" and "Saved by …" not drawn | Both |
| G6 | NGO requested (total) | 🆕 | NGO's claim per head `grant-recommendation.tsx:386`; NGO's Claim in total `:216` | NAPDDR Grant ([410:37644][rg]) "NGO's claim ₹4,00,000" / "₹72,00,000" per head; "NGO's Claim ₹76,00,000" | Both |
| G7 | Non-recurring and recurring sections | 🆕 | Two heads — `grant-recommendation.tsx:112, 192` | NAPDDR Grant ([410:37644][rg]) "Non-Recurring (One-Time)", "Recurring (Annual)" | Both |
| G8 | Columns #, Item, Norm, Proposed (ASO-PD), Remarks, delete | 🆕 | Item with its norm beneath, amount, remove — `grant-recommendation.tsx:313-321, 430-466` | NAPDDR Grant ([410:37644][rg]) item, "Norm ₹…" beneath, amount field, delete buttons | Both |
| G9 | Remarks box on every row | 🔁 | Reason field only when the amount leaves the norm — `grant-recommendation.tsx:467-475` | NAPDDR, Grant Tab (Editing) — reason field ([457:241595](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/?node-id=457-241595)) — drawn 8 Oct | Both |
| G10 | Delete with "Remove cost-sheet item?" dialog | 🔁 | Remove, undone in place ("Removed: … ↶") — `grant-recommendation.tsx:402-410` | NAPDDR, Grant Tab (Editing) — removed item with restore ([457:241595](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/?node-id=457-241595)) — drawn 8 Oct | Both |
| G11 | EITHER/OR rows (Doctor rural / urban), delete one | 🆕 | "Doctor — Choose One" radio group — `grant-recommendation.tsx:338-357` | NAPDDR Grant ([410:37644][rg]) "Doctor — Choose One · Rural · Urban"; phone ([424:35998][rgm]) | Both |
| G12 | + Add item | 🆕 | "Add Item" per head — `grant-recommendation.tsx:396-401` | NAPDDR Grant ([410:37644][rg]) "Add Item" | Both |
| G13 | Norm total · NGO claimed · Admissible (min) per head | 🆕 | Per head: Norm · NGO's claim · Admissible — `grant-recommendation.tsx:383-388` | NAPDDR Grant ([410:37644][rg]) "Norm ₹63,44,000 NGO's claim ₹72,00,000 Admissible ₹63,44,000" | Both |
| G14 | "Exceeds admissible by ₹…" | 🆕 | The excess and why the claim is the ceiling — `grant-recommendation.tsx:389-395` | NAPDDR, Grant Tab (Editing) — over the admissible amount ([457:241595](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/?node-id=457-241595)) — drawn 8 Oct | Both |
| G15 | "Cap to admissible" button | ⛔ | — (left out) | — (left out) | Neither — left out (choosing what to cut is the officer's judgement) |
| G16 | Total admissible | 🆕 | "Admissible Ceiling" — `grant-recommendation.tsx:215` | NAPDDR Grant ([410:37644][rg]) "Admissible Ceiling ₹66,89,000" | Both |
| G17 | Total recommended grant | 🆕 | "Recommended Grant", both heads — `grant-recommendation.tsx:220-222` | NAPDDR Grant ([410:37644][rg]) "Recommended Grant ₹66,89,000" | Both |
| G18 | "Exceeds the admissible ceiling — reduce before saving" | 🆕 | Save refused, each problem beside its row — `grant-recommendation.tsx:139-145` | NAPDDR, Grant Tab (Save Refused) ([457:241810](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/?node-id=457-241810)) — drawn 8 Oct | Both |
| G19 | Reset | 🆕 | "Reset to Norm" — `grant-recommendation.tsx:233-241` | NAPDDR Grant ([410:37644][rg]) "Reset to Norm" | Both |
| G20 | Save cost sheet | 🆕 | "Save Cost Sheet" — `grant-recommendation.tsx:242-245` | NAPDDR Grant ([410:37644][rg]) "Save Cost Sheet"; phone ([424:35998][rgm]) | Both |

## H. Statement of Account

| # | In the recording | Status (tally key) | Prototype — where | Figma — where | Placed |
|---|---|---|---|---|---|
| H1 | Budgetary allocation (In Rs.) | 🆕 | ASO review › Grant tab › Statement of Account › Budgetary Allocation — `grant-recommendation.tsx:563` | NAPDDR Grant ([410:37644][rg]) "Budgetary Allocation" | Both |
| H2 | Up to date Expenditure | 🆕 | Expenditure to Date — `grant-recommendation.tsx:564` | NAPDDR Grant ([410:37644][rg]) "Expenditure to Date" | Both |
| H3 | Balance Available after this release (typed) | 🆕 | Balance After This Release, computed — `grant-recommendation.tsx:576-584` | NAPDDR Grant ([410:37644][rg]) "Balance After This Release · Enter both figures · Allocation, less expenditure to date, less this release" | Both |
| H4 | Save Statement | 🆕 | "Save Statement" — `grant-recommendation.tsx:592-596` | NAPDDR Grant ([410:37644][rg]) "Save Statement" | Both |
| H5 | Separate from the cost sheet (05:52) | 🆕 | Own card and state — `grant-recommendation.tsx:545-556` | NAPDDR Grant ([410:37644][rg]) own card "Statement of Account … Saved separately from the cost sheet." | Both |

## I. Officer Supporting Documents

| # | In the recording | Status (tally key) | Prototype — where | Figma — where | Placed |
|---|---|---|---|---|---|
| I1 | "Officer Supporting Documents (0)" | ✅ | ASO review › Documents tab › Officer Supporting Documents (n) — `review-shell.tsx:1589, 1626` | Officer Supporting Documents — end of every Documents tab, e.g. NAPDDR Documents Tab ([410:37090](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/?node-id=410-37090)) — drawn 8 Oct | Both |
| I2 | "PDF, JPG or PNG, up to 10 MB" | 🆕 | Upload rule, 10 MB — `review-shell.tsx:1621-1623, 1672` | As I1 ([410:37090](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/?node-id=410-37090)) — drawn 8 Oct | Both |
| I3 | "No supporting documents uploaded yet" | ✅ | Empty line — `review-shell.tsx:1646` | As I1 ([410:37090](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/?node-id=410-37090)) — drawn 8 Oct | Both |
| I4 | Document title (optional) | ✅ | "Document Title", optional — `review-shell.tsx:1651` | As I1 ([410:37090](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/?node-id=410-37090)) — drawn 8 Oct | Both |
| I5 | Upload PDF/JPG/PNG | ✅ | "Upload PDF, JPG or PNG" — `review-shell.tsx:1656` | As I1 ([410:37090](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/?node-id=410-37090)) — drawn 8 Oct | Both |

## J. Show Cause Notices

| # | In the recording | Status (tally key) | Prototype — where | Figma — where | Placed |
|---|---|---|---|---|---|
| J1 | Card shown to the ASO with only its description | 🔁 | ASO review › History tab › Show Cause Notices, drawn only once a notice exists — `review-panels.tsx:368-425` (rendered at `review-shell.tsx:542`) | NAPDDR History ([410:38195][rh]) draws no card, as built. The empty card still appears behind Raise a Deficiency ([3:27066][pdef]) | Both |
| J2 | Issued by SO and JS only (07:52) | ✅ | Your Decision › More Actions › "Issue Show Cause Notice", gated by role — `review-shell.tsx:406-410`; `review-panels.tsx:360-362` | Issue Show Cause Notice (Dialog) ([3:25870][pscn]); More Actions button on every ASO tab | Both |

## K. Sanction & Disbursement — This Project

| # | In the recording | Status (tally key) | Prototype — where | Figma — where | Placed |
|---|---|---|---|---|---|
| K1 | Grants for this project with what was released | ✅ | ASO review › History tab › Funding History › Sanction & Disbursement — This Project — `review-panels.tsx:211-230` | NAPDDR History ([410:38195][rh]) "Sanction & Disbursement — This Project"; phone ([424:37087][rhm]) | Both |
| K2 | "No sanctioned grants on record for this NGO" beside five sanctions above | ✅ | One reading of the record: "No grant has been sanctioned for project …" — `review-panels.tsx:213-214` | NAPDDR History ([410:38195][rh]) "No grant has been sanctioned for project DR/DL/SDL/03657." under the NGO's sanctions | Both |

## L. Audit Trail — File Movement

| # | In the recording | Status (tally key) | Prototype — where | Figma — where | Placed |
|---|---|---|---|---|---|
| L1 | Collapsible, with a count | 🔁 | ASO review › History tab › File Movement and Remarks — `review-shell.tsx:544-558` | NAPDDR History ([410:38195][rh]) "File Movement and Remarks" | Both |
| L2 | Entry: who, role, action, time, remark | ✅ | EventList entry — `review-shell.tsx:545-557` | NAPDDR History ([410:38195][rh]) "Application Submitted · Sankalp Seva Sansthan · Applicant · 07 Aug 2026, 02:45 PM · Application submitted." | Both |
| L3 | "Shows the progress of the application" (08:24) | ✅ | Same list, newest first — `review-shell.tsx:548` | NAPDDR History ([410:38195][rh]) | Both |

## M. Documents Review

| # | In the recording | Status (tally key) | Prototype — where | Figma — where | Placed |
|---|---|---|---|---|---|
| M1 | "Verify each of the 12 documents" | ✅ | ASO review › Documents tab › progress line and bar — `review-shell.tsx:1471-1478`; bar in DS `document-checklist.tsx:254-268` | NAPDDR Documents ([410:37090][rd]) "0 of 12 required documents reviewed". No bar found as a named layer; not verified | Both |
| M2 | Permanent documents group | ✅ | Annual and Permanent groups — `review-shell.tsx:1451-1452` | NAPDDR Documents ([410:37090][rd]) "ANNUAL DOCUMENTS", "PERMANENT DOCUMENTS" | Both |
| M3 | Document name with required * | ✅ | Row title, required mark — `review-shell.tsx:1520-1521` | NAPDDR Documents ([410:37090][rd]) e.g. "3. List of Managing Committee Members*" | Both |
| M4 | ⓘ description | 🆕 | Description under the name — `review-shell.tsx:1530-1531` | NAPDDR Documents ([410:37090][rd]) e.g. "Aims & objectives of the organisation" | Both |
| M5 | Review dropdown: Pending / Verified / Query | 🔁 | Verified · Needs Correction in the row — `review-shell.tsx:1334-1351` | NAPDDR Documents ([410:37090][rd]) "Verified · Needs Correction" on each row | Both |
| M6 | PD Remarks | ✅ | Remark under the verdict, required for Needs Correction — `review-shell.tsx:1357-1390` | SHRESHTA Document Needs Correction ([3:31993][sdnc]) "What must the NGO correct? *" (not drawn on the NAPDDR file) | Both |
| M7 | File download | ✅ | "View", opening the preview sheet — `review-shell.tsx:1560-1561` | NAPDDR Documents ([410:37090][rd]) "View" on each row. The preview sheet itself is not drawn | Both |

## N. Officer Decision

| # | In the recording | Status (tally key) | Prototype — where | Figma — where | Placed |
|---|---|---|---|---|---|
| N1 | "Officer Decision", forward up to SO-PD | ✅ | ASO review › Your Decision, beside every tab — `review-shell.tsx:564, 646-656` | All four NAPDDR tabs ([408:27862][ra], [410:37090][rd], [410:37644][rg], [410:38195][rh]) "Your Decision" | Both |
| N2 | Overall remarks mandatory | ✅ | Remarks, required — `review-shell.tsx:721-731` | NAPDDR Application ([408:27862][ra]) "Remarks *" | Both |
| N3 | 0 / 200 words | 🆕 | Word count, 200-word limit — `review-shell.tsx:337-341, 727, 1165` | NAPDDR Application ([408:27862][ra]) "… 0 of 200 words." and "0/200" | Both |
| N4 | "Review every document before deciding. 12 still Pending…" | ✅ | Before You Forward checklist, linked — `review-shell.tsx:664-683, 1217-1287` | NAPDDR Application ([408:27862][ra]) "Before You Forward · Give a Verdict on Every Required Document · 0 of 12 done. · 12 Documents Still Need Your Verdict" | Both |
| N5 | Save & Forward to SO-PD → | ✅ | "Forward to the Section Officer" — `review-shell.tsx:742-765` | NAPDDR Application ([408:27862][ra]) "Forward to the Section Officer" | Both |
| N6 | Roles differ, so options differ (08:38) | ✅ | Actions from each role's capabilities — `review-shell.tsx:428-430, 733-790` | Separate decision panels per grade in the review sections (e.g. Section Officer, Under Secretary, Joint Secretary frames under [3:24986][journey]) | Both |

## O. Said in the Call, Not on Screen

| # | In the recording | Status (tally key) | Prototype — where | Figma — where | Placed |
|---|---|---|---|---|---|
| O1 | UAT common API, NTA production, IP whitelist (01:40–02:10) | ⛔ | — (left out) | — (left out) | Neither — left out (hosting and integration, not interface) |
| O2 | "Organise this long sheet" (08:54) | 🆕 | Four tabs, each saying what is owed — `review-shell.tsx:424-430, 482-560` | NAPDDR tabs ([408:27862][ra]) "Application · Documents (12 to Verify) · Grant (2 to Save) · History" | Both |

## ➕ Added Beyond the Recording

| # | Added | Status (tally key) | Prototype — where | Figma — where | Placed |
|---|---|---|---|---|---|
| X1 | Four tabs: Application · Documents · Grant · History | ➕ | `review-shell.tsx:424-430` | NAPDDR Application ([408:27862][ra]) and the three other tab frames; phone ([424:34759][ram]) | Both |
| X2 | Tab labels carry what is owed: "Documents (12 to Verify)", "Grant (2 to Save)" | ➕ | `review-shell.tsx:425-428` | NAPDDR Application ([408:27862][ra]) tab labels | Both |
| X3 | "Save the Cost Sheet" and "Save the Statement of Account" in Before You Forward | ➕ | `review-shell.tsx:1260-1286` | NAPDDR Application ([408:27862][ra]) both steps with "Open the Cost Sheet" / "Open the Statement of Account" | Both |
| X4 | The forward waits for both saves | ➕ | Forward disabled with the reason — `review-shell.tsx:754-771` | NAPDDR Application ([408:27862][ra]) "…the cost sheet is not saved and the Statement of Account is not saved." | Both |
| X5 | Statement marked "Out of Date" when the sheet is saved again | ➕ | "Out of Date" badge `grant-recommendation.tsx:520`; "The Release Has Changed" alert `:557-560` | NAPDDR, Grant Tab (Editing) — Statement "Out of Date" and "The Release Has Changed" ([457:241595](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/?node-id=457-241595)) — drawn 8 Oct | Both |
| X6 | Discard Changes | ➕ | `grant-recommendation.tsx:228-232` | NAPDDR, Grant Tab (Editing) — Discard Changes ([457:241595](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/?node-id=457-241595)) — drawn 8 Oct | Both |
| X7 | Certification step before forwarding | ➕ | `review-shell.tsx:684-705` | NAPDDR Application ([408:27862][ra]) certification checkbox and "Record Certification" | Both |
| X8 | Raise Deficiency, Reject, More Actions (inspection, report) | ➕ | Buttons `review-shell.tsx:737-795`; More Actions menu `:406-410, 649-653` | NAPDDR Application ([408:27862][ra]) "Raise Deficiency", "Reject", "More Actions"; Schedule an Inspection ([3:25580][pins]); Printable Review Report ([3:25268][prep]) | Both |
| X9 | Automatic-check result on each document | ➕ | Check as advice — `review-shell.tsx:1462, 1485-1487, 1552, 1567` | NAPDDR Documents ([410:37090][rd]) "Automatic check · Looks right · 100%"; Document Actions Menu ([3:26154][pmenu]) "Automatic Check Report" | Both |
| X10 | Phone layout: amounts under items; decision bar at the foot | ➕ | Sticky decision bar "Go to Decision" — `review-shell.tsx:812-830` | NAPDDR Grant, phone ([424:35998][rgm]) items with norms and amounts, sticky "Go to Decision" bar; same bar on [424:34759][ram], [424:35247][rdm], [424:37087][rhm] | Both |
| X11 | Seed: a DDAC file, a costed IRCA further up the chain, NAPDDR's own documents | ➕ | Seed data in `lib/e-anudaan/` (DDAC `…/04823`, IRCA `…/01638`) | DDAC file and NAPDDR documents drawn ([410:37090][rd]); the IRCA file appears only as a queue row ([3:36854][q]); a costed IRCA is not drawn | Both |
| X12 | `TabPanel hidden` in the design system | ➕ | `packages/design-system/components/navigation/tabs.tsx:570-577`; used at `review-shell.tsx:489, 508, 526, 537` | Code-only behaviour; nothing to draw | Prototype only |

## Figma Frames Cited

| Short name | Node | Frame |
|---|---|---|
| Queue, desktop | [3:36854][q] | Officer / My Queue / Programme Division — Assistant Section Officer |
| Queue, phone | [3:35725][qm] | … — Mobile |
| NAPDDR Application | [408:27862][ra] | Officer / Review an Application / Programme Division — Assistant Section Officer — NAPDDR, Application Tab |
| NAPDDR Documents | [410:37090][rd] | … NAPDDR, Documents Tab |
| NAPDDR Grant | [410:37644][rg] | … NAPDDR, Grant Tab |
| NAPDDR History | [410:38195][rh] | … NAPDDR, History Tab |
| NAPDDR phone frames | [424:34759][ram] · [424:35247][rdm] · [424:35998][rgm] · [424:37087][rhm] | Application · Documents · Grant · History — Mobile |
| SHRESHTA Document Needs Correction | [3:31993][sdnc] | … (Document Needs Correction) — Documents Tab |
| Issue Show Cause Notice | [3:25870][pscn] | Pop-ups and Dialogs (section [428:36512][pop]) |
| Schedule an Inspection | [3:25580][pins] | Pop-ups and Dialogs |
| Printable Review Report | [3:25268][prep] | Pop-ups and Dialogs |
| Raise a Deficiency | [3:27066][pdef] | Pop-ups and Dialogs |
| Document Actions Menu | [3:26154][pmenu] | Pop-ups and Dialogs |
| Needs Discussion journey · note | [3:24986][journey] · [135:27862][note] | Reviewing an Application — Needs Discussion |

[q]: https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/?node-id=3-36854
[qm]: https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/?node-id=3-35725
[ra]: https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/?node-id=408-27862
[rd]: https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/?node-id=410-37090
[rg]: https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/?node-id=410-37644
[rh]: https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/?node-id=410-38195
[ram]: https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/?node-id=424-34759
[rdm]: https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/?node-id=424-35247
[rgm]: https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/?node-id=424-35998
[rhm]: https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/?node-id=424-37087
[sdnc]: https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/?node-id=3-31993
[pscn]: https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/?node-id=3-25870
[pins]: https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/?node-id=3-25580
[prep]: https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/?node-id=3-25268
[pdef]: https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/?node-id=3-27066
[pmenu]: https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/?node-id=3-26154
[pop]: https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/?node-id=428-36512
[journey]: https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/?node-id=3-24986
[note]: https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/?node-id=135-27862
