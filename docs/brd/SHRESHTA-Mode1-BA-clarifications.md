# SHRESHTA Mode-1 — BA Clarification Register (UI/UX)

> Source: `docs/brd/SHRESHTA_Mode1_BRD_v0_2.docx`. Read line by line.
> Purpose: only the questions that affect **UI/UX design** — what screens, flows, fields and
> states we build. Non-design points (API strategy, whitelisting, integration feasibility) are
> left to the BA/tech track and are not listed here.
> Tags: **[BLOCKER]** = design can't start without it · **[CONFLICT]** = BRD appears to
> contradict itself · **[GAP]** = design-relevant detail absent · **[CONFIRM]** = reasonable
> reading, need a yes/no.

References use the BRD's own IDs (FR-SO/ES/CA/AR/AP/RV/PY).

---

## A. Users, roles & access model

- **A1 [BLOCKER]** To design role-based screens we need the **list of portal user roles** and what
  each can do. NFR-01 names "Ministry, schools, NTA/NICSI coordinators and administrators" — for
  each, confirm whether it is a **screen-facing login** or just an external data feed:
  - Schools — log in to apply, report admissions, upload results/UCs? (assumed yes)
  - Ministry / Scheme Division — log in to review, approve, release payments? (assumed yes)
  - NTA / NICSI — coordinators who log in, or API feeds only?
  - Students / parents — indirect only, no login? (assumed indirect)
- **A2 [BLOCKER]** What is the **review/approval flow** for each decision point — empanelment
  approval, admission confirmation, result-validation sign-off, and payment release? Single
  approver, or a multi-level chain, and who acts at each level? (Drives every officer screen.)
- **A3 [GAP]** How do **schools log in** — Ministry-issued credentials, UDISE-based, or
  self-registration then approval? Is empanelment required before login?
- **A4 [GAP]** Is there a **deficiency / send-back mechanism** for school applications (return to
  the school for correction), or is it approve/reject only?

## B. Yearly cycle & navigation

- **B1 [BLOCKER]** Mode-1 runs as a yearly cycle with sequential stages (onboarding → selection →
  counselling → admission → payment → progression). How is the **academic-year / cycle** shown in
  the UI, and how do stages **open and close** (admin-controlled, or date windows)? What each user
  sees depends entirely on the current stage.
- **B2 [GAP]** Can **more than one cycle year be active at once** (e.g. Year-N payments while
  Year-N+1 onboarding opens)? Changes the dashboard and navigation model.

## C. School onboarding, consent & empanelment (6.1)

- **C1 [BLOCKER]** Please share the **school application field set** (FR-SO-01 replaces the Google
  Form). There is no field list to build the form from.
- **C2 [GAP]** FR-SO-02 consent form: is consent an **uploaded signed document, an e-sign, or an
  in-form declaration/checkbox**, and what does it contain?
- **C3 [CONFIRM]** FR-SO-03 residential schools only: is "residential" **verified from UDISE data**
  or **self-declared**? (Decides whether there's an eligibility gate on the form.)
- **C4 [GAP]** FR-SO-04 "clubbing" of related applications: what defines "related" (state, district,
  board, trust)? This shapes the review/grouping screen.
- **C5 [BLOCKER]** FR-SO-05 bulk approval: what are the **outcomes** (approve / reject / send-back),
  **who approves**, and is a **rejection reason** captured? Needed to design the bulk-review UI.
- **C6 [GAP]** FR-SO-07 yearly onboarding: do already-empanelled schools **re-consent each year** or
  **auto-carry** with a light re-confirmation?

## D. Entrance exam & selection (6.2)

- **D1 [GAP]** What fields are in the **selected-student list** from NTA (name, NETS roll, category,
  marks/rank, entry class 9 or 11, contact)? Needed for the selection and downstream admission
  views.
- **D2 [CONFIRM]** FR-ES-04: fresh admissions only in **Class 9 and Class 11**, with **no lateral
  entry** into Class 10 or 12 at any point — confirm.
- **D3 [GAP]** FR-ES-03 max 3,000 seats: does the UI need to **show/enforce** this cap anywhere
  (e.g. a counter, a block on import), or is it handled upstream?

## E. Counselling & allotment (6.3)

- **E1 [CONFIRM]** Does the platform **only ingest NICSI's final allotment list** (no round-by-round
  counselling screens built), consistent with counselling being NICSI's engine? Confirm we build no
  counselling UI.
- **E2 [GAP]** What fields are in the **allotment list** (student NETS roll → allotted school UDISE,
  seat category), and does the platform need to display round history or only the final mapping?

## F. Admission & reporting (6.4)

- **F1 [BLOCKER]** "PI reporting" (the school-side admission report) needs its **exact fields**
  (the BRD marks these unconfirmed). The admission-reporting screen can't be designed without them.
- **F2 [GAP]** When an allotted student does **not** join, what happens to the seat —
  **reallocated / next-in-line / lapsed**? Affects the admission and reconciliation screens.

## G. Annual progression & dropout (6.5)

- **G1 [CONFLICT]** FR-AP-04 and Section 8 say result data is held "**at school level
  (school-wise)**," but FR-AP-01/02 require **per-student** report-card upload and **per-student**
  dropout tracking by NETS roll. Are results captured **per student** or **aggregate per school**?
  These read as contradictory and change the progression screens and data model.
- **G2 [GAP]** On a dropout: besides exclusion from payment, is there an **exit reason / workflow**,
  and can a dropped-out student re-enter later?
- **G3 [CONFLICT]** FR-AP-05 computes "**vacancies**," but D2 says **no lateral entry** (fresh
  admissions only in Class 9 & 11). If seats can't be backfilled mid-cycle, what are "vacancies"
  **used for** on screen?

## H. Result validation — OCR & AI (6.6)

- **H1 [CONFLICT]** FR-RV-04 says the system **"obtains results from NTA"** for the validation flow,
  but FR-RV-02 validates the **annual promotion** exam, whose results come from the **school / CBSE
  board, not NTA** (NTA runs only the entrance exam). What results does NTA actually provide here,
  and how do they relate to the school-uploaded report cards? Affects what the validation screen
  shows and compares.
- **H2 [BLOCKER]** FR-RV-06 flags mismatches between the OCR'd result and the uploaded report card.
  **What happens on a mismatch** (block progression, route to a review queue, notify the school),
  and **who resolves it** (school or Ministry)? This is a core screen with no defined behaviour.
- **H3 [GAP]** Who **signs off** validated results before a student is progressed and funded — the
  school or a Ministry reviewer?

## I. Payments, disbursement & UC (6.7)

- **I1 [BLOCKER]** How is the **payment amount** determined — a **per-student rate/norm × continuing
  students**, or another basis? Without this the payment screens can't display or validate amounts.
- **I2 [CONFIRM]** Funds are released **to the school** (keyed by UDISE), not to students — confirm
  the payee.
- **I3 [GAP]** Who approves a payment release, and at how many levels (ties to A2)?
- **I4 [GAP]** UC upload (FR-PY-05…07): please confirm the **UC template / mandatory fields**, and
  whether the **previous year's UC is a prerequisite** for the next payment — both gate the payment
  screen.
- **I5 [GAP]** Which **release statuses** should the portal display (e.g. Initiated / Processed /
  Failed), given disbursement happens in PFMS?

## J. Cross-cutting (design)

- **J1 [GAP]** Language — English only, or Hindi / bilingual for this phase?
- **J2 [GAP]** Device priority — schools may work on mobile, Ministry on desktop. Which flows must
  be mobile-first?

---

## Highest-priority answers to unblock design (shortlist)

1. **A1 / A2 / A3** — Role list, the approval flow per stage, and how schools log in.
2. **B1** — How the yearly cycle and stage open/close is modelled.
3. **C1 / C5** — The school application field set and the empanelment review outcomes/approver.
4. **F1** — The "PI reporting" admission-report fields.
5. **G1** — Result granularity: per-student or school-level (resolve the conflict).
6. **H1 / H2** — What NTA results feed validation, and the mismatch-handling workflow.
7. **I1 / I3 / I4** — Payment amount basis, release approval, and UC rules.

## Apparent conflicts to raise explicitly

- **G1** — result data "at school level" vs per-student report cards and per-student dropout.
- **G3** — "compute vacancies" vs "no lateral entry" (fresh admissions only in Class 9 & 11).
- **H1** — "obtain results from NTA" for **annual-promotion** validation, when annual results come
  from the school / CBSE board, not NTA.
