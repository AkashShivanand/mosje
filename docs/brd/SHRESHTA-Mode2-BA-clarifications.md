# SHRESHTA Mode-2 — BA Clarification Register (UI/UX)

> Source: `docs/brd/SHRESHTA_Mode2_BRD_v1_1.docx` (v1.1). Read line by line.
> Purpose: questions a UI/UX designer needs answered by the Business Analyst **before**
> designing screens. Nothing here is a design proposal — these are gaps, ambiguities and
> apparent contradictions in the BRD itself.
> Tags: **[BLOCKER]** = design cannot start correctly without it · **[CONFLICT]** = BRD
> appears to contradict itself · **[GAP]** = required detail simply absent · **[CONFIRM]** = I
> have a reasonable reading, need a yes/no.

Legend for references: FR/BR/VR/NT/AT/RP/INT/NFR IDs and SM2-Sxx screen / SM2-Rxx role IDs are
the BRD's own identifiers.

---

## A. Access & context we need first (e-Anudaan + existing SHRESHTA)

SHRESHTA Mode-2 is to be added *inside the existing e-Anudaan portal*, but the design/dev team
has **not seen the e-Anudaan BRD and has not received any e-Anudaan design**. We cannot correctly
place Mode-2 (its shell, navigation, scheme-picker, shared components) without first seeing the
parent portal and any existing SHRESHTA surface.

- **A1 [BLOCKER — access]** Please share **test/login credentials to the e-Anudaan portal** so we
  can see its shell, navigation, roles and how existing schemes are laid out.
- **A2 [BLOCKER — access]** Please share **credentials + a short walkthrough of the existing
  SHRESHTA portal** (if one is already live), so we understand its current flow and offerings and
  don't rebuild something that already exists.

## B. Access, login & accounts (SM2-S01, FR-01…04, BR-01)

- **B1 [BLOCKER]** How does an NGO get its very first credentials? There is no self-registration
  screen in the inventory. Is onboarding entirely offline, after which the Admin issues a
  username/password (FR-63)? Confirm NGOs never self-register.
- **B2 [GAP]** Password policy specifics: minimum length, complexity, expiry, reuse history?
  "Password-strength policy" is referenced (FR-04) but never defined.
- **B3 [GAP]** Account lockout: what is the default "configurable number" of failed attempts, and
  how is an account unlocked — auto after a cooldown, or Admin-only (BR "unlock per policy")?
- **B4 [GAP]** Captcha type — image, arithmetic, or a third-party (reCAPTCHA)? Affects the login
  layout and accessibility.
- **B6 [GAP]** Session timeout duration and "remember me" behaviour?
- **B7 [CONFIRM]** Do Ministry officer / PMU / Admin accounts also log in through the same screen,
  or a separate internal login? (Login inventory only describes the NGO login.)

## C. NGO dashboard & application lifecycle (SM2-S02, FR-05…07)

- **C1 [BLOCKER]** Can one NGO run **multiple institutions** and therefore file **multiple
  applications in the same financial year** (one per institution, keyed by "Institution ID")? Or
  is it strictly one application per NGO per FY? This drives the dashboard list, the create rule
  and the whole data model.
- **C2 [GAP]** What summary/KPIs should the NGO dashboard show beyond the application list
  (e.g., counts by status, next action, last sanction)? Not specified.
- **C3 [GAP]** Draft lifecycle: how long is a draft retained, can the NGO delete a draft, and can
  there be more than one draft at a time?
- **C4 [GAP]** Application-number format and when it is assigned (on save-draft vs on submit —
  FR-19 says "if not already assigned," implying it can exist pre-submit). What is the format?

## D. Application form — the big one (SM2-S03, Annexure A, FR-08…12, VR-03…08)

- **D1 [BLOCKER — eligibility]** "Status of institution: **Ongoing** only; the 'New' option is
  not applicable under Mode-2" (Annexure A) plus "Receiving assistance continuously for last 3
  years." Does this mean **only NGOs already receiving GIA can apply**, i.e. first-time NGOs are
  excluded entirely? If new NGOs *can* enter, what is their path? This is a fundamental
  eligibility question that changes the form and the dashboard.
- **D2 [BLOCKER — grant computation]** The grant form captures "recurring / non-recurring / total
  (in lakhs)" but the BRD never lists the **actual cost-head line items** (e.g. per-student
  maintenance, staff salaries, infrastructure, etc.). What are the recurring and non-recurring
  components the NGO must fill? Without this the central form section can't be designed.
- **D3 [BLOCKER — who sets the amount]** Assumptions say "the portal records the *computed and
  recommended* figures rather than redefining policy." So: does the NGO enter a *requested*
  amount, and do officers record a *recommended/sanctioned* amount somewhere? No officer
  amount-adjustment field exists on any review screen. Where and by whom is the final sanctioned
  figure set — JS-IFD, PD, or Admin config norms?
- **D4 [GAP]** "SC and other beneficiary break-up where applicable" — when is it applicable? Are
  non-SC beneficiaries permitted under Mode-2, and if so is there a cap/ratio? Total Beneficiaries
  is mandatory but its composition rules are unstated.
- **D5 [GAP]** Is "Total Number of Beneficiaries" validated against any capacity/sanctioned
  strength, or is any positive number accepted?
- **D6 [GAP — business logic]** Compliance declarations (blacklisted? profit earned? capitation
  fee charged? grant from another source?). If the NGO answers "Yes" to a disqualifying one (e.g.
  **blacklisted = Yes**), does the system block submission, warn, or just record it for officers?
- **D7 [CONFIRM]** Conditional-field triggers: rent particulars appear when "Rented"; woman-warden
  is mandatory for girls' hostels. Any other conditional sections (e.g. hostel-only vs
  non-residential fields)?
- **D8 [GAP]** "GIA released in last 3 years" table (sanction no., date, amounts, utilised) —
  free-entry by the NGO, or pre-filled from prior sanctions in the system?
- **D9 [GAP]** "Government-run similar institution within 2 km (Yes/No)" — does the answer affect
  eligibility/flagging, or is it informational only?
- **D10 [GAP]** "Institution ID" — who assigns it and when? Entered by the NGO, issued by the
  Ministry, or system-generated? Annexure A calls it a "scheme institution identifier."
- **D11 [CONFIRM]** NGO-Darpan read-only fields: exactly which fields are fetched (name, address,
  registration only)? And if Darpan is unavailable at fill-time, can the NGO proceed with manual
  entry or is it blocked?
- **D12 [GAP]** "Authorised person: date, time and place of application" — captured manually or
  auto-stamped by the system?
- **D13 [GAP]** Financial-year options: which FYs are selectable (Mode-1 restricted to 2021-22
  onwards; is Mode-2 the same)? Who opens/closes an FY for applications?
- **D14 [GAP]** Amount display convention — "in lakhs" with Indian grouping (₹ 12,50,000 vs
  12.5 lakh)? And the standard date format (DD/MM/YYYY)?

## E. Documents (SM2-S04, Annexure C, VR-09)

- **E1 [BLOCKER]** Which of the 20 checklist documents are **mandatory** vs optional? BRD says the
  mandatory set "is configurable" but gives no default. Design needs the default mandatory list to
  build the upload gate.
- **E2 [GAP]** Can a checklist item hold **multiple files**, and is there versioning when a file is
  replaced?
- **E3 [CONFIRM]** Several items overlap: #7 "Audited Accounts," #15 "Accounts in parts," #20
  "Audit Report for previous year." Are these genuinely distinct uploads, or duplicates to merge?
- **E4 [GAP]** Are officer-uploaded documents visible to the NGO, or only to downstream officers?
  (BR-11 says visible to downstream *officers*; NGO visibility is not stated.)

## F. Submission, status & reopen (SM2-S05, S06, FR-17…21)

- **F1 [BLOCKER]** On a deficiency, "the NGO may edit only the fields reopened by the deficiency."
  **Who chooses which fields reopen, and how?** Does the SO tick specific fields/documents when
  raising/communicating a deficiency, or does the whole form reopen? This is a core interaction
  with no UI defined.
- **F2 [GAP]** How much of the internal chain does the NGO see in status tracking? Real officer
  level ("With Under Secretary") or a generic "Under Ministry review"? (FR-21: "NGO-appropriate
  information only.")
- **F3 [GAP]** Is there a deadline for the NGO to respond to a deficiency, and what happens on
  expiry (auto-close, reminder, nothing)?

## G. Officer review chain (SM2-S09…S12, FR-27…37, BR-04…07)

- **G1 [BLOCKER — work assignment]** Are officer work-lists a **shared pool** (any ASO can pick
  any submitted case) or are cases **assigned** to a specific officer? Is there a claim/lock so two
  officers don't work the same case? Nothing about assignment is specified.
- **G2 [CONFIRM]** Can an officer send a case **back up/down** other than the defined actions?
  Confirm: SO's only options are forward-to-US or deficiency-to-NGO (SO cannot bounce back to ASO);
  ASO's are forward-to-SO or raise-deficiency-to-SO.
- **G3 [GAP — query routing]** US/DS "raise a query in the file and return it **through the
  hierarchy**." Return to the *immediate* lower level (US→SO) or all the way to ASO? Does it then
  auto-climb back, or must each level re-review on the way up? The query loop is under-specified vs
  the deficiency loop.
- **G4 [GAP]** When the ASO raises a deficiency, can the SO **edit or reject** the ASO's
  deficiency before communicating it to the NGO, or must the SO forward it as-is?
- **G5 [GAP]** Is there any limit on deficiency/query loops (a case could bounce indefinitely)?
- **G6 [CONFIRM]** The ASO certification wording is fixed and quoted in the BRD — use verbatim on
  the checkbox. Confirm no other stage has a mandatory declaration.

## H. IFD internal chain (Section 7.7, SM2-S13, FR-38/76)

- **H1 [BLOCKER — roles]** The internal IFD chain (IFD dealing hand → IFD SO → IFD US → Director/DS
  Finance → JS-IFD) names actors with **no role IDs and no screens**. For the build: do these need
  their own logins/work-lists, or is **JS-IFD the only modelled IFD actor** and the internal chain
  is shown only as informational/audit? (The role catalogue lists only SM2-R06 JS-IFD.)
- **H2 [CONFIRM]** IFD is self-contained: it can return within IFD but **never back to the
  programme-side DS or to the NGO**. Confirm.
- **H3 [GAP]** Does JS-IFD (or IFD) have the power to **modify the grant amount** as part of
  financial concurrence, or only concur/observe? No amount-edit field is defined.

## I. PD decision, sanction & fund release (SM2-S15, S17, FR-42…50, BR-08/15)

- **I1 [BLOCKER — sanction particulars]** On PD = YES the PD confirms "sanction particulars"
  (amount, instalment, head of accounts). Where do these values come from — pre-filled from the
  application/IFD, or typed by the PD? Which fields are editable at this step?
- **I2 [BLOCKER — instalments]** Instalment options are 1st / 2nd / 3rd / Full & Final. Does a
  single application/sanction produce **one instalment at a time** (so 2nd/3rd instalments are
  separate cases/sanctions later), or one sanction with a full instalment schedule? This shapes the
  entire recurring-grant lifecycle and the NGO's repeat-application flow.
- **I3 [CONFIRM]** Can the PD **partially sanction** (approve less than requested/recommended), or
  is it strictly binary YES/NO? Only YES/NO is described.
- **I4 [CONFIRM]** After PD = YES the case is "handed to the fund-release process" and later shows
  "Released." Confirm fund release happens **outside the portal in PFMS** and the portal only
  **mirrors** the release status — i.e. no in-portal "release funds" action and no finance/DDO
  role, since none of the 11 roles triggers it. (SM2-S17 mentions "release it to the fund-release
  process"; confirm what that action does in-portal.)

## J. Utilisation Certificates (UC) — apparent gap

- **J1 [BLOCKER — missing workflow]** UC appears as a **pre-application document** (Annexure C #8/#9,
  the "UC pending status (SFR 212(1))" field) and in PFMS/EAT linkage (INT-03). But there is **no
  post-sanction UC submission / verification screen** in the Mode-2 inventory (Mode-1 has one). Is
  there a post-disbursement UC upload + verification flow in Mode-2, and if so, which role verifies
  it and is the previous year's UC a prerequisite for the next sanction? If not, confirm UC is only
  ever a supporting document.

## K. Returned-case / reconsideration loop (SM2-S16, FR-46/47, BR-08…10)

- **K1 [BLOCKER — flow]** On PD = NO, SO-PD routes the case "down US → SO → ASO." **Do US and SO
  each get a downward task** (and do they add anything on the way down), or is it a single "route to
  ASO" action by SO-PD with US/SO as pass-through only? The BRD says "the US forwards to SO, who
  forwards to ASO," implying real steps — need the interaction.
- **K2 [CONFIRM]** On rework the case re-climbs the **full** chain including **JS-IFD/JS-PD again**
  every loop. Confirm IFD re-concurs on every reconsideration (potentially heavy), or is there a
  short-circuit.
- **K3 [GAP — terminal states]** The status model lists "Rejected / Closed (where applicable)" but
  **no actor or screen produces it**. Who can reject/close a case outright, at what stage, and is
  there ever an end other than "PD = YES"? Can a case be withdrawn by the NGO?

## L. Inspection (SM2-S18, S18A, S19, Annexure B, FR-51…56/73…75, BR-12)

- **L1 [BLOCKER — trigger/assignment]** When and by whom is an inspection initiated, and how is a
  PMU team assigned to a case (Admin assigns / auto / PMU self-picks)? Is inspection **mandatory
  before the PD decision** or optional (BRD says it "can inform" the decision)?
- **L2 [GAP]** One inspection per application, or can there be re-inspections / multiple inspection
  records?
- **L3 [BLOCKER — online inspection meaning]** SM2-S18A "online inspection, e.g. video-based." What
  concretely is this in the product — a scheduled video call, a video-file upload, live photo
  capture, or just the proforma filled in-portal? Needs a concrete definition to design.
- **L4 [GAP]** Proforma PART-A…D is long and branches (residential school vs non-residential vs
  hostel). Which sections/fields are mandatory, and which are conditional on institution type?
- **L5 [SECURITY/CONFIRM]** PART-A asks for "CCTV functional and linked" **and "CCTV credentials."**
  Capturing CCTV login credentials is a security risk. Confirm whether credentials are really to be
  stored, and if so how they should be masked/handled.
- **L6 [CONFIRM]** FR-SM2-52 says the **PMU** sets status including "Reviewed," yet "Reviewed"
  reads like a Ministry-reviewer action. Confirm the PMU really owns the "Reviewed" state, or
  whether a Ministry reviewer should mark it reviewed.
- **L7 [GAP]** Can an adverse inspection finding **auto-trigger** anything (e.g. a Show Cause
  Notice), or is it purely informational to reviewers?

## M. Show Cause Notice (Section 7.6, FR-71/72, BR-18)

- **M1 [GAP]** Which exact roles are "authorised" to issue an SCN? All ASO…PD, or only senior
  levels?
- **M2 [BLOCKER — flow interaction]** Does issuing an SCN **pause/freeze** the current workflow
  stage, or run in parallel? "Show Cause Issued" is a status — does it replace the current
  review status, and where does the case resume after the reply?
- **M3 [GAP]** On SCN response-timeline expiry, what happens (auto-escalate, auto-reject, nothing)?
- **M4 [GAP]** Can multiple SCNs be open on one case at once?

## N. Notifications (SM2-S20, NT-01…09, FR-57/58/66/67)

- **N1 [GAP — content]** The 9 events are defined, but no **notification copy/templates** are
  provided. Who supplies the message text (portal/email/SMS) per event, and in which language(s)?
- **N2 [GAP]** Channel preferences "where configurable" — configured by the NGO, by the officer,
  or by the Admin? Which channels are user-toggleable vs always-on?
- **N3 [GAP]** Are there **reminder/escalation** notifications for cases pending beyond a threshold?
  (Reports track ageing, but no escalation event is defined.)

## O. Reports & dashboards (SM2-S21, RP-01…08, FR-59…61)

- **O1 [GAP — ageing bands]** "Pending Cases by Role … with ageing" — what are the ageing/SLA
  buckets (e.g. 0–7 / 8–15 / >15 days), and are there SLA targets per stage?
- **O2 [GAP]** Which roles may view the **Audit Log Report** ("authorised roles only") — Admin
  only, or also PD/JS?
- **O3 [GAP — officer dashboards]** The BRD defines the NGO dashboard content and the 8 reports,
  but does **not** define what each officer's landing/dashboard shows (KPIs, queues). Confirm we
  design these by best practice, or does the BA have required metrics per role?
- **O4 [CONFIRM]** Export: is real PDF/Excel required, or is print-to-PDF + CSV acceptable for the
  current phase? (Design implication for report layouts.)

## P. Admin console (SM2-S22, FR-62…65)

- **P1 [BLOCKER — depth]** "Workflow configuration: stage sequence, deficiency and return routing"
  — is the workflow **genuinely reconfigurable** by the Admin (re-order stages, change routing), or
  fixed for Mode-2 with only settings toggled? This is the difference between a config screen and a
  full workflow builder.
- **P2 [CONFLICT]** Admin can configure an "audit-retention period" (FR-62), but AT-03 fixes
  retention at **seven years** and AT-04 makes audit **immutable**. Reconcile: is retention truly
  configurable, or fixed at 7 years?
- **P3 [GAP]** User management — can the Admin create/assign **Ministry officer** accounts too, or
  only NGO credentials? Can one person hold **multiple roles**? Is there role-delegation/leave
  cover (e.g. an SO acting for a US)?

## Q. Audit trail (Section 13, AT-01…05)

- **Q1 [CONFIRM]** Full audit trail is visible only to Admin (S22) and via the Audit Log report;
  officers see only the case remarks/history. Confirm the visibility split.

## R. Integrations (Section 15, INT-01…05) — mocked now, but need shape for the seam

- **R1 [GAP]** NGO-Darpan: exact fields returned and behaviour on downtime (see D11).
- **R2 [GAP]** PFMS: what release statuses will be reflected (e.g. Initiated / Processed / Failed),
  and does the portal *push* to PFMS or only *display* status? What is the "EAT linkage" the NGO/
  officers actually see or do?
- **R3 [CONFIRM]** DigiLocker / eSign are "where adopted." In or out for Mode-2 in this phase?

## S. Cross-cutting: content, language, NFR (Section 16)

- **S1 [GAP]** Language: NFR-11 says "English, capable of Hindi/bilingual." Is **Hindi required in
  this phase**, or English-only with i18n hooks left in?
- **S2 [GAP]** Field-level **help text / tooltips** and error-message copy — who authors the
  content, especially for the legal/financial fields (SFR 212(1), GFR 12-A, heads of account)?
- **S3 [GAP]** Device priority: officers are clearly desktop; are **NGOs expected on mobile**? Sets
  the responsive breakpoints and which flows must be mobile-first.
- **S4 [CONFIRM]** Accessibility target is GIGW + WCAG 2.1 AA (per project standard). Any
  additional government theme requirement (e.g. mandated header/emblem, dark mode)?

---

## Highest-priority answers to unblock design (the shortlist)

If the BA can only answer a handful first, these unblock the most design work:

1. **D1** — Are first-time NGOs eligible, or only ongoing (already-funded) institutions?
2. **D2 / D3** — The grant cost-head line items, and who sets the recommended/sanctioned amount.
3. **C1** — One application per NGO per FY, or one per institution (multiple)?
4. **I2** — Instalment lifecycle: one instalment per case, or a schedule per sanction?
5. **J1** — Is there a post-sanction UC workflow? (and I4 — confirm fund release is external/PFMS)
6. **F1** — How reopened fields are chosen on a deficiency.
7. **G1** — Shared work-list pool vs assigned cases (+ claim/lock).
8. **H1** — Are the internal IFD sub-roles modelled, or is JS-IFD the only IFD actor?
9. **K1 / K3** — Downward reconsideration steps, and who can reject/close a case.
10. **L1 / L3** — Inspection trigger/assignment and what "online inspection" concretely means.

## Apparent internal inconsistencies to raise explicitly (BRD self-conflicts)

- **P2** — configurable audit-retention vs fixed 7-year immutable audit.
- **K3** — "Rejected/Closed" status exists but nothing creates it.
- **J1** — UC referenced throughout but no UC submission/verification screen in Mode-2.
- **H1** — IFD internal actors described but absent from the role catalogue and screen inventory.
- **D1** — "Ongoing only / New not applicable" — does this exclude first-time NGOs?
