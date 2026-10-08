# E-Anudaan [Handoff] — Six-Lens Audit of the Figma File (08 Oct 2026)

The owner could not find the logic of the file. This audit reads it as a newcomer would, through six roles, says what
was wrong, what was changed on 08 Oct 2026, and what is still open. Figma file `K0B3vuOTXpxw6kt0px2Cqo`.

## Where the Screen From the 7 Oct Discussion Is

| | Where |
|---|---|
| Figma | Page **3 · Officers · Reviewing Applications** › journey **Reviewing an Application** › section **Programme Division — Assistant Section Officer, NAPDDR File** ([open](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/?node-id=428-36488)). Desktop: Application `408:27862`, Documents `410:37090`, Grant `410:37644`, History `410:38195`. Phone: `424:34759`, `424:35247`, `424:35998`, `424:37087`. The queue it is opened from: **My Queue › Programme Division**, first screen ([open](https://www.figma.com/design/K0B3vuOTXpxw6kt0px2Cqo/?node-id=3-36854)). |
| Linked from | Start Here › Cover, the "Latest" line; Start Here › Who Does What › Programme Division — Assistant Section Officer; the page guide's Find a Screen index |
| Prototype | `/portals/e-anudaan/dashboard/pd/aso` (Assistant Section Officer, Programme Division) → Review on the NAPDDR file `GIA/2026-27/NAPDDR/SOUTH_DELHI/04823` → tabs Application · Documents · Grant · History |
| Code | `apps/hub/src/components/e-anudaan/review-shell.tsx`, `grant-recommendation.tsx`, `lib/e-anudaan/cost-sheet.ts` — PR AkashShivanand/mosje#720 |

## The Product in Brief (now on Start Here)

**What it is.** The Department's online system for grants-in-aid to NGOs. An NGO applies once a year for each project; the
Programme Division examines the file in five grades; the Integrated Finance Division checks the money in the same five
grades; the Programme Director sanctions; a Maker and a Checker pay through PFMS; the project is then monitored until its
next instalment.

**The flow, by page.** 1 Signing In → 2 NGO applies (2a–2d one page per scheme's form) → 3 Officers review → 4 Sanction
and inspections → 5 Payment through PFMS → 6 NGO after applying and getting paid → 7 Records and reports.

| Role | Responsible for | Decides |
|---|---|---|
| NGO | Applying with true answers and documents; correcting; keeping bank, beneficiaries, staff, attendance, CCTV current; reporting use of the grant | Nothing on the file — applies, corrects, claims |
| Programme Division ASO | A verdict on every document; certifying; for NAPDDR, the Cost Sheet and Statement of Account | Forward to SO, or raise a deficiency (never writes to the NGO) |
| Programme Division SO | Checking the ASO's verdicts | Forward, return, or send the deficiency to the NGO — the only officer who writes to the NGO; query, inspection, show cause |
| Programme Division US, DS | Examining in turn; the US also designates Maker and Checker and opens the next instalment | Forward or return |
| Programme Division JS | Approving the file and amount; bank-account changes | Send to the Integrated Finance Division, or return |
| Integrated Finance Division, five grades | Budget head, funds, the amount against norms; the JS concurs | Forward or return; concur no more than proposed |
| Programme Director | The decision after concurrence | Sanction, return for rework, reject — *Needs Discussion: the 1 Oct walkthrough gives final approval to the JS and the order to the US* |
| Maker / Checker | Preparing / checking and signing the payment advice | Checker returns or signs; E-Anudaan sends to PFMS |
| Bureau | Heads of account, DDO and PAO codes each year | — |
| PMU Field Officer | On-site inspections, reports, location changes | — |
| Outside E-Anudaan | DDO draws, PAO passes, bank credits and returns the UTR | — |

## The Audit, by Lens

### Design Director — "Does the file explain itself?"

| Found | Changed on 08 Oct | Still open |
|---|---|---|
| No entry point for someone new. Start Here opened on a cover with four counts and a one-line purpose; the product, the roles and the words were nowhere in one place. | Start Here now runs in reading order — Cover → What E-Anudaan Is → Who Does What → How a Grant Moves → Portal Map → How to Read → Status — and the cover says so, numbered and linked. | — |
| Counts (565 screens, 45 journeys, 10 groups, 10 need discussion) on the Cover page, the Start Here cover and every page guide. They were stale within days and answered no reader's question. | Removed everywhere. "Needs Discussion" is a linked list on the Status page, not a number. | The handoff rule still asks for counts (§8, §10a); updated in this change. |
| Pages ran by audience, so "NGO · After Applying and Getting Paid" sat before the officers who review the application. | Pages numbered 1–7 in the order an application moves, with 2a–2d for the four scheme forms. | — |
| Two vocabularies: "PD Maker", "PD Checker" (PD also means Programme Director), and a group called just "Officers". | Renamed: Maker, Checker, Programme and Finance Officers — Reviewing Applications. | — |

### UX Lead — "Can a person follow one application end to end?"

| Found | Changed | Still open |
|---|---|---|
| How a Grant Moves existed and was accurate, but was third of five frames with no pointer to it, and its schemes block duplicated what a newcomer needs first. | Linked from the cover, from What E-Anudaan Is (each of the five stages links to its screens) and from Who Does What. The schemes moved to What E-Anudaan Is; said once. | — |
| Its line "no amount is recorded along the review chain" was out of date after the NAPDDR cost sheet. | Rewritten: NAPDDR records the amount from the ASO onwards; other schemes not yet. | Whether other schemes get a cost sheet. |
| A reviewer could not tell which division or grade a review screen belonged to. | Reviewing an Application is split by division and grade, each row in tab order (done earlier on 08 Oct). | — |
| — | — | **The decision that blocks the last stage:** who sanctions — the Programme Director (drawn) or the Programme Division's JS and US (walkthrough, PFMS BRD). Four journeys stay red until it is decided. |

### UI Lead — "Does what is drawn match what is built, at the scale a person reads it?"

| Found | Changed | Still open |
|---|---|---|
| The Assistant Section Officer's My Queue showed 10 applications, no Scheme or State filter, no State column, "Pending with you" on every card, no Waiting Longest, no pager. | Redrawn from the prototype, desktop and phone: 11 applications, Scheme and State filters, State column with district, "6 over 7 days", ageing 18 / 27 / 55 %, Waiting Longest, the SAMAVESH pager. | The other nine grades' queues are not redrawn. The ageing bars use the library's 10 % steps (20 / 30 / 60) under the exact printed figures. |
| The 7 Oct review screens carried an old side menu (Dashboard, PD Queries, no Returned Applications). | The Assistant Section Officer's nine desktop review screens carry the current menu. | Other grades' review screens keep their older menus. |
| 18 recording items are built but not drawn (see the checklist). | — | Listed below with where each would go. |

### Developer — "Can I find the exact screen and state to build from?"

| Found | Changed | Still open |
|---|---|---|
| Finding a screen needed knowing the file. | Path is now fixed: page number → journey → division and grade → Desktop or Mobile → tab. Names read *Officer / Review an Application / Programme Division — Section Officer — Documents Tab*. | — |
| Several states exist only in code: cost-sheet item removed and restored, reason when an amount leaves the norm, excess over the admissible amount, save refused, statement out of date, discard changes, the IRCA sheets and bed capacity, the officer's supporting documents card. | — | Draw them as states beside the NAPDDR Grant tab (see the checklist, G and I). |

### Programme Manager — "What is decided, what is open, and is the recording covered?"

| | |
|---|---|
| Recording coverage | 130 items (118 in the recording + 12 added): **97 placed in both** the prototype and Figma; **19 prototype only** (18 real drawing gaps; one is code-only behaviour); 8 left out with a reason; 6 not shown in the recording. |
| Decisions needed from the Department | Who sanctions; whether the forward waits for both money saves; IRCA bed sizes (15/30/50 or 25); the Department's own DDAC norms; whether the Maker and Checker are seats of their own. |
| Process note | This change was built before it was drawn, against the standing instruction that Figma leads. Figma now matches the build for the ASO; the gaps are listed so they are drawn next, not rediscovered. |

### CEO — "In one paragraph."

E-Anudaan's design file now explains itself: the first page says what the product is, who does what, and how a grant
moves, and every page is numbered in the order an application travels. The review screen discussed on 7 October is
drawn, built and linked from the front page. One decision — who gives the final sanction — still holds four journeys
open, and 18 smaller screen states are built but not yet drawn.

## Second Pass, 08 Oct 2026 — Gaps Drawn, Issues Fixed

All 18 drawing gaps are drawn, and every issue the audit and the helper agents found was fixed or is listed below
for a decision. Recording coverage is now **115 of 130 placed in both** the prototype and Figma; one item is code-only
behaviour (nothing to draw); 8 are left out with reasons; 6 were not shown in the recording.

| Item | Drawn as |
|---|---|
| Officer Supporting Documents (I1–I5) | At the end of all 20 Documents tabs — editable for the ASO and the uncertified SO, read-only for the rest |
| IRCA cost sheet, Bed Capacity (G2, G3) | NAPDDR Rehabilitation Centre, Grant Tab (desktop, phone) |
| Reason, removed item, over the admissible amount, Discard Changes, statement Out of Date (G9, G10, G14, X5, X6) | NAPDDR, Grant Tab (Editing) |
| Save refused (G18) | NAPDDR, Grant Tab (Save Refused) |
| Pipeline with amounts (E3) | New version: Integrated Finance Division — Section Officer, NAPDDR File |
| Application answers, website (D2) | NAPDDR, Application Tab (Section Open); the prototype now links the website too |
| "This Project" mark (F3) | Section Officer — History Tab (Earlier Sanction of This Project) |
| Sort marks (A16) | Every desktop queue |
| Sent, IR Repository (B7) | Already drawn on page 4 (Programme Director) |

Fixed across the file: every officer's My Queue (desktop and phone) matches the prototype; every desktop screen on
page 3 carries its officer's side menu; officer initials and bells match each officer; each Summary carries its own
NGO's registration number; Application cards, Summary order and the remarks word count follow the prototype; Project
Records and Inspections cards on History tabs; full File Movement lists; all eight dialogs follow the prototype, plus
Confirm Rejecting the Application and Confirm Recording Financial Concurrence; every page guide has a linked Find a
Screen list and Previous / Next; Start Here says each thing once.

Fixed in the prototype: the website answer is a link; More Actions → Show Cause / Inspection now opens the History tab
and the dialog (it rendered inside a hidden panel); "1 days" reads "1 day".

### Decisions for the Owner
| Decision | What is drawn for now |
|---|---|
| Who gives the final sanction | The Programme Director (four journeys stay red) |
| The prototype has no "Raise a Deficiency" dialog — the button records at once | The frame now shows the real dialog in that flow: "Forward with 1 Document Marked Needs Correction?" |
| Four PFMS journeys were red on the Portal Map but never named or noted as Needs Discussion on their page | Shown grey, their open points kept as one Status question; rename and note them on page 5 to make them red again |
| "IR Repository" (menu) vs "Inspection Reports" (screen name) | Screen keeps the plain-English name |

Full checklist, item by item, with prototype and Figma placement: `e-anudaan-aso-pd-placement-checklist-2026-10-08.md`.
