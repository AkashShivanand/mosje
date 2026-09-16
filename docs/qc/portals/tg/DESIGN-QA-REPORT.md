# National Portal for Transgender Persons - Design QC Report

**Generated:** 2026-07-10  · **Design:** [handoff frames](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=8056-5668)  
**Status:** ready for review - a human still owes the keyboard and screen-reader pass.

**Also published as:** the PDF beside this file, the `TG` sheet in `docs/qc/MoSJE-Portal-QC-Tracker.xlsx`, a [Figma review sheet](https://www.figma.com/design/8LX7sqdDtWIAoCYZueCJq7/Design-QC?node-id=686-25).

---
## Summary

| | |
|---|---|
| Boards in the report | 31 |
| Findings | **33** - 9 Major, 19 Minor, 5 Nit |
| Applies to every screen | 8 |
| Specific to one screen | 25 |
| Withdrawn, not raised, or noted about the design file | 2 |

Design-QC of the TG admin + login screens against the MoSJE Portal Handoff design.

**Where to start.** The findings with the widest reach or the highest severity:

1. **Masthead co-branding lockup removed** - `TG-GLOBAL-001` · Major
2. **KPI cards lost their metric icon + trend line** - `TG-GLOBAL-003` · Major
3. **System Validation omits the Duplicate Check row** - `TG-GLOBAL-006` · Major
4. **Documents listed by raw upload filename, not semantic label** - `TG-GLOBAL-007` · Major
5. **Role-tab switcher removed** - `TG-CIT-SIGNIN-001` · Major

---

## Findings that apply to every screen

Each has its own board in the PDF, showing the design and the build side by side with the marker on the element in question.

### Masthead co-branding lockup removed

`TG-GLOBAL-001` · **Major** · Content & Iconography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | The masthead right zone carries the SAMAVESH co-branding lockup — the Digital India logo + the SAMAVESH logo — before the user/avatar block. |
| **Build does** | Both logos are omitted portal-wide; only the user name/role/avatar remain on the right. (Present on the login hero, missing on every authenticated inner page.) |
| **Fix** | Restore the Digital India + SAMAVESH co-branding lockup in the masthead right zone per the design, on every screen. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=2494-38830) · [Live page](https://tg-admin-dev.mosje.in/dashboard)

### KPI cards lost their metric icon + trend line

`TG-GLOBAL-003` · **Major** · Components & States · Scope: every screen with this element

| | |
|---|---|
| **Design says** | Each dashboard KPI card shows a leading metric icon and a delta/trend line ('▲ +14.5% vs last month' or a contextual subtitle). |
| **Build does** | KPI cards render only a label + number — the icon and trend/subtext are dropped, losing the at-a-glance comparison hierarchy. |
| **Fix** | Restore the KPI card icon and trend/delta subtitle per the design KPI component. Applies to all role dashboards. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=2494-38830) · [Live page](https://tg-admin-dev.mosje.in/dashboard)

### System Validation omits the Duplicate Check row

`TG-GLOBAL-006` · **Major** · Components & States · Scope: every screen with this element

| | |
|---|---|
| **Design says** | System Validation lists three checks — Data Validation, Duplicate Check (with the match + similarity score, e.g. 'Potential match: TG2024-LU-04521 (85% similarity)') and Document Verification. |
| **Build does** | The build shows only Data Validation and Document Verification — the Duplicate Check row is absent, so the duplicate-detection signal never reaches the reviewer. Repeats on every role's application review screen. |
| **Fix** | Restore the Duplicate Check row in System Validation with its match reference + similarity status. Applies to every role's application review screen. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=2494-39123) · [Live page](https://tg-admin-dev.mosje.in/applications)

### Documents listed by raw upload filename, not semantic label

`TG-GLOBAL-007` · **Major** · Content & Iconography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | Each document is listed by its semantic name — 'Signed Affidavit', 'Aadhaar Card', 'Passport Photo' — with a matching document-type icon. |
| **Build does** | The build lists raw upload filenames ('form1 (2).pdf', 'Screenshot 2026-06-24 221031.pdf', 'tgportal-image.jpg') against a generic file glyph, so a reviewer cannot tell which document is which without opening each one. Repeats on every role's Documents tab. |
| **Fix** | Label each document by its semantic type with the matching type icon and keep the filename as secondary text. Applies to every role's Documents tab. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=2494-39123) · [Live page](https://tg-admin-dev.mosje.in/applications)

### Masthead identity lockup reduced from 3 lines to 2

`TG-GLOBAL-002` · **Minor** · Content & Iconography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | 'Government of India / Ministry of Social Justice & Empowerment / Department of Social Justice & Empowerment' (Department line in bold navy). |
| **Build does** | Only 'Government of India / Ministry of Social Justice & Empowerment' — the Department line is dropped and the bold weight moves up a line. |
| **Fix** | Render the full 3-line identity lockup with the Department line bold, per the design masthead. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=2494-38830) · [Live page](https://tg-admin-dev.mosje.in/dashboard)

### Pagination active-page state differs

`TG-GLOBAL-004` · **Minor** · Components & States · Scope: every screen with this element

| | |
|---|---|
| **Design says** | Active page = outlined (white fill, navy border, navy numeral). |
| **Build does** | Active page = a navy-filled chip with a white numeral. |
| **Fix** | Match the pagination active-page control to the design's outlined style. Applies to every paginated table. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=2494-38830) · [Live page](https://tg-admin-dev.mosje.in/dashboard)

### Data-table header fill inconsistent across the build

`TG-GLOBAL-005` · **Minor** · Color & Token · Scope: every screen with this element

| | |
|---|---|
| **Design says** | Table headers use a light neutral-gray fill (≈#f9fafb, Stroke/50). |
| **Build does** | Dashboard queue tables use a near-neutral header, but the User/Role/Tenant management tables use a light blue header tint (≈#dbeafe). |
| **Fix** | Standardise all data-table headers to the neutral-gray header token; drop the blue tint on the management tables. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=2494-38830) · [Live page](https://tg-admin-dev.mosje.in/dashboard)

### Exception Flagged banner never rendered

`TG-GLOBAL-008` · **Minor** · Components & States · Scope: every screen with this element

| | |
|---|---|
| **Design says** | When the system detects a similar record the screen surfaces an amber 'Exception Flagged: Duplicate' banner above the application, explaining the match. |
| **Build does** | The build never renders the exception banner, so flagged applications look identical to clean ones. |
| **Fix** | Render the exception banner when the duplicate/exception check trips, per the design. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=2494-39123) · [Live page](https://tg-admin-dev.mosje.in/applications)

---

## Findings specific to one screen

## Admin — Log In

### Extra Mobile Number field

`TG-ADM-SIGNIN-001` · **Major** · Components & States · Scope: Admin — Log In

| | |
|---|---|
| **Design says** | The design offers a single Email field, then a Send OTP button. |
| **Build does** | The build adds a second 'Mobile Number' field (with an 'or' divider) below Email — absent from the design. |
| **Fix** | Align to the design's single Email-field pattern, or update the design frame if Mobile Number entry is a deliberate addition. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=9387-138143) · [Live page](https://tg-admin-dev.mosje.in/login)

### Heading casing

`TG-ADM-SIGNIN-002` · **Minor** · Typography · Scope: Admin — Log In

| | |
|---|---|
| **Design says** | The heading reads 'Log in to your account' (sentence case). |
| **Build does** | The build renders 'Log In to your account' — 'In' is capitalised. |
| **Fix** | Match the design's sentence-case heading: 'Log in to your account'. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=9387-138143) · [Live page](https://tg-admin-dev.mosje.in/login)

## Citizen — Certificate & Identity Card

### 'Other Services' section replaced by the dashboard's Welfare Benefits

`TG-CIT-CERT-DETAIL-001` · **Major** · Components & States · Scope: Citizen — Certificate & Identity Card

| | |
|---|---|
| **Design says** | The certificate page carries an OTHER SERVICES section with four lifecycle actions — New Transgender Certificate & ID, Revised Certificate (Post-Medical Intervention), Correction or Update Existing Details, and Withdraw a Pending Application. |
| **Build does** | The build renders the dashboard's Welfare Benefits cards here instead, so none of the certificate lifecycle actions are reachable from this page. |
| **Fix** | Restore the Other Services section (New certificate · Revised certificate · Correction/Update · Withdraw) on the certificate page per the design. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=3531-36666) · [Live page](https://tg-user-dev.mosje.in/certificate)

### Page title and intro paragraph dropped

`TG-CIT-CERT-DETAIL-002` · **Minor** · Typography · Scope: Citizen — Certificate & Identity Card

| | |
|---|---|
| **Design says** | The page opens with the title 'Transgender Certificate & Identity Card' and an explanatory paragraph about the certificate. |
| **Build does** | The build starts straight at the approval card — no page title or intro copy. |
| **Fix** | Render the page title and intro paragraph per the design. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=3531-36666) · [Live page](https://tg-user-dev.mosje.in/certificate)

### Action button set differs from the design

`TG-CIT-CERT-DETAIL-003` · **Nit** · Components & States · Scope: Citizen — Certificate & Identity Card

| | |
|---|---|
| **Design says** | The approval card offers 'Download Certificate' and 'Download ID Card'. |
| **Build does** | The build offers 'Download Revised Certificate', 'Download ID Card', 'Gender Revision Request' and 'Collapse'. |
| **Fix** | Confirm the extra actions are intended and align the primary label with the design. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=3531-36666) · [Live page](https://tg-user-dev.mosje.in/certificate)

## Citizen — Sign In

### Role-tab switcher removed

`TG-CIT-SIGNIN-001` · **Major** · Components & States · Scope: Citizen — Sign In

| | |
|---|---|
| **Design says** | The login card leads with a three-way role switcher — Citizen · Admin · Garima Greh — with Citizen active. |
| **Build does** | The citizen build renders no role tabs; the card opens straight into the 'Log In to your account' heading. |
| **Fix** | Restore the Citizen / Admin / Garima Greh role-tab switcher at the top of the login card, per the design frame. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=9379-115794) · [Live page](https://tg-user-dev.mosje.in/auth/sign-in)

### Extra Mobile Number field

`TG-CIT-SIGNIN-002` · **Major** · Components & States · Scope: Citizen — Sign In

| | |
|---|---|
| **Design says** | The design offers a single Email field under 'or sign in with credentials', then a Send OTP button. |
| **Build does** | The build inserts a second 'Mobile Number' field (with its own 'or' divider) below the Email Id field — absent from the design. |
| **Fix** | Align to the design's single-field pattern, or update the design frame if the Mobile Number entry is a deliberate addition. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=9379-115794) · [Live page](https://tg-user-dev.mosje.in/auth/sign-in)

### Heading casing ('Log In' vs 'Log in')

`TG-CIT-SIGNIN-003` · **Minor** · Typography · Scope: Citizen — Sign In

| | |
|---|---|
| **Design says** | The heading reads 'Log in to your account' (sentence case). |
| **Build does** | The build renders 'Log In to your account' — 'In' is capitalised. |
| **Fix** | Match the design's sentence-case heading: 'Log in to your account'. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=9379-115794) · [Live page](https://tg-user-dev.mosje.in/auth/sign-in)

## Citizen — Track Status

### Track / status page is not built — the route lands on the dashboard

`TG-CIT-TRACK-001` · **Major** · Components & States · Scope: Citizen — Track Status

| | |
|---|---|
| **Design says** | A Track page shows the application progress stepper (Submitted → In Scrutiny → Approval → Certificate Generation) with the current step highlighted, plus Withdraw Application, Correction Request and View Full Application actions. |
| **Build does** | The build's track route renders the citizen dashboard instead — the progress stepper and its three actions do not exist anywhere in the build. |
| **Fix** | Build the track/status page per the design frame, including the progress stepper and the Withdraw / Correction Request / View Full Application actions. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=3531-36747) · [Live page](https://tg-user-dev.mosje.in/track-status)

## Admin — Application Detail

### Persistent expanded admin sidebar narrows the content

`TG-AD-001` · **Minor** · Layout & Spacing · Scope: Admin — Application Detail

| | |
|---|---|
| **Design says** | The design detail page is full-width (sidebar collapsed to a hamburger); the examining-officer / DM detail pages have no sidebar (match the design). |
| **Build does** | The central-admin detail page keeps the admin sidebar expanded, narrowing the content column. |
| **Fix** | Confirm the central-admin sidebar on detail views is intended; otherwise collapse it to match the design. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=2494-38975) · [Live page](https://tg-admin-dev.mosje.in/applications)

### Detail tab set differs (2 design / 4 build)

`TG-AD-002` · **Nit** · Components & States · Scope: Admin — Application Detail

| | |
|---|---|
| **Design says** | The design detail has 2 tabs: Applicant Details, Documents. |
| **Build does** | The build has 4 tabs — it adds Revised Certificate and ID Card. |
| **Fix** | Build-extra — confirm if intended. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=2494-38975) · [Live page](https://tg-admin-dev.mosje.in/applications)

## Central Admin — Dashboard

### Confirm analytics chart palette uses TG tokens

`TG-CAD-002` · **Minor** · Color & Token · Scope: Central Admin — Dashboard

| | |
|---|---|
| **Design says** | Charts should use TG tokens — Primary/Source #003366 for bars, Success/Source #2e7d32 for the approval-rate series. |
| **Build does** | Chart series may use raw greens/blues rather than the TG token palette. |
| **Fix** | Verify the chart palette against the TG tokens; the charts are a build-only section audited vs the visual language. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=2494-38830) · [Live page](https://tg-admin-dev.mosje.in/dashboard)

### Global filter bar sits above the KPI cards

`TG-CAD-001` · **Nit** · Layout & Spacing · Scope: Central Admin — Dashboard

| | |
|---|---|
| **Design says** | The design keeps the State / District / Date-range filters inside the Application Queue card. |
| **Build does** | The build floats a global filter bar ABOVE the KPI cards; it is a richer analytics dashboard (6 KPIs + State/District charts) vs the design's 4-KPI exception queue. |
| **Fix** | Confirm the analytics layout is intended — the extra KPIs/charts are build-only (audit vs the visual language, don't remove). |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=2494-38830) · [Live page](https://tg-admin-dev.mosje.in/dashboard)

## Citizen — Apply · Step 1 · Basic Identity Details

### Form grid drops from 3 columns to 2

`TG-CIT-APPLY-IDENTITY-001` · **Minor** · Layout & Spacing · Scope: Citizen — Apply · Step 1 · Basic Identity Details

| | |
|---|---|
| **Design says** | Self-Perceived Identity and Permanent Address lay out on a 3-column field grid. |
| **Build does** | The build uses a 2-column grid, making the form noticeably taller and pushing the primary action below the fold. |
| **Fix** | Match the design's 3-column field grid on the identity step. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=3531-35553) · [Live page](https://tg-user-dev.mosje.in/apply)

### Correspondence-address control changed from a checkbox to Yes/No buttons

`TG-CIT-APPLY-IDENTITY-002` · **Minor** · Components & States · Scope: Citizen — Apply · Step 1 · Basic Identity Details

| | |
|---|---|
| **Design says** | A single checkbox reads 'My Current / Correspondence address is the same as my Permanent address.' |
| **Build does** | The build asks 'Is your correspondence address the same as your permanent address?' with Yes/No toggle buttons. |
| **Fix** | Use the design's single checkbox for the correspondence-address control. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=3531-35553) · [Live page](https://tg-user-dev.mosje.in/apply)

### Bottom-left action is 'Back'; the design says 'Cancel'

`TG-CIT-APPLY-IDENTITY-003` · **Minor** · Components & States · Scope: Citizen — Apply · Step 1 · Basic Identity Details

| | |
|---|---|
| **Design says** | The bottom-left control on the step is 'Cancel'. |
| **Build does** | The build renders 'Back' instead. |
| **Fix** | Relabel the bottom-left control to 'Cancel' per the design. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=3531-35553) · [Live page](https://tg-user-dev.mosje.in/apply)

### Active step marker is an outlined ring, not a solid disc

`TG-CIT-APPLY-IDENTITY-004` · **Minor** · Components & States · Scope: Citizen — Apply · Step 1 · Basic Identity Details

| | |
|---|---|
| **Design says** | The active step is a solid navy disc with a white numeral. |
| **Build does** | The build renders the active step as an outlined ring, so it reads like an inactive step. |
| **Fix** | Give the active step the design's solid navy fill + white numeral. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=3531-35553) · [Live page](https://tg-user-dev.mosje.in/apply)

## Citizen — Dashboard · Certificate Active

### Welfare Benefits cards wrap to a second row

`TG-CIT-DASH-001` · **Minor** · Layout & Spacing · Scope: Citizen — Dashboard · Certificate Active

| | |
|---|---|
| **Design says** | All four benefit cards — Scholarships, Skill Training, Garima Greh, Medical Support — sit in a single 4-up row. |
| **Build does** | The build's cards are wider, so only three fit and Medical Support wraps onto a second row. |
| **Fix** | Match the design's 4-up Welfare Benefits grid so the row doesn't wrap. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=3531-36919) · [Live page](https://tg-user-dev.mosje.in/dashboard)

### Sidebar nav has no icons and omits 'Scholarships'

`TG-CIT-DASH-002` · **Minor** · Components & States · Scope: Citizen — Dashboard · Certificate Active

| | |
|---|---|
| **Design says** | The sidebar lists Dashboard / Certificate/ID / Scholarships / Grievances, each with a leading icon. |
| **Build does** | The build's sidebar has no per-item icons and drops the Scholarships entry (it shows a 'Transgender' scheme dropdown above the list instead). |
| **Fix** | Restore the per-item sidebar icons and the Scholarships nav entry per the design. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=3531-36919) · [Live page](https://tg-user-dev.mosje.in/dashboard)

## District Magistrate — Approve modal

### Applicant info box uses a neutral tint, not the design's success tint

`TG-DM-MODAL-APPROVE-001` · **Minor** · Color & Token · Scope: District Magistrate — Approve modal

| | |
|---|---|
| **Design says** | The applicant confirm box is green-tinted with a green border, reinforcing the approve action. |
| **Build does** | The build renders a neutral grey box, losing the success affordance. |
| **Fix** | Apply the design's success tint + border to the applicant confirm box. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=2494-39988) · [Live page](https://tg-admin-dev.mosje.in/applications)

### Applicant photograph not rendered in the confirm modal

`TG-DM-MODAL-APPROVE-002` · **Minor** · Content & Iconography · Scope: District Magistrate — Approve modal

| | |
|---|---|
| **Design says** | The modal shows the applicant's photograph with a success check, so the approver can verify identity before committing. |
| **Build does** | The build renders a generic placeholder avatar instead of the applicant's uploaded photo. |
| **Fix** | Render the applicant's photograph in the approve modal; confirm whether the placeholder is only a test-data artefact. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=2494-39988) · [Live page](https://tg-admin-dev.mosje.in/applications)

### Build adds a 'Remarks (Optional)' field

`TG-DM-MODAL-APPROVE-003` · **Nit** · Components & States · Scope: District Magistrate — Approve modal

| | |
|---|---|
| **Design says** | The approve modal has no remarks input. |
| **Build does** | The build adds a 'Remarks (Optional)' textarea before the actions. |
| **Fix** | Confirm the remarks field is intended; if so, add it to the design frame. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=2494-39988) · [Live page](https://tg-admin-dev.mosje.in/applications)

## Examining Officer (Maker) — Dashboard

### 'Classification' column dropped

`TG-EOD-001` · **Minor** · Components & States · Scope: Examining Officer (Maker) — Dashboard

| | |
|---|---|
| **Design says** | The design Maker queue has a Classification column (Clean / Exception badges) flagging exception applications. |
| **Build does** | The build omits the Classification column, so triage exceptions aren't visible in the list. |
| **Fix** | Show the Classification column per the design (low priority — the build shows fewer columns than the design). |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=2494-41744) · [Live page](https://tg-admin-dev.mosje.in/dashboard)

### Queue filters missing

`TG-EOD-002` · **Minor** · Components & States · Scope: Examining Officer (Maker) — Dashboard

| | |
|---|---|
| **Design says** | The design queue header carries All Classifications / All Types / All Status filter dropdowns. |
| **Build does** | The build has only a search box + a State/District toggle. |
| **Fix** | Surface the relevant queue filters per the design. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=2494-41744) · [Live page](https://tg-admin-dev.mosje.in/dashboard)

## District Magistrate — Dashboard

### Extra 'Current Stage' column + View action

`TG-DMD-001` · **Nit** · Components & States · Scope: District Magistrate — Dashboard

| | |
|---|---|
| **Design says** | The design DM queue columns are Applicant ID, Name, District, Due in, Status. |
| **Build does** | The build queue adds a 'Current Stage' column and a View action not in the design table. |
| **Fix** | Confirm if intended — the build has an extra column; do not remove without design sign-off. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=2494-42053) · [Live page](https://tg-admin-dev.mosje.in/dashboard)

---
## Withdrawn on re-checking, not raised, and notes on the design file

Nothing here is a finding. Each was either raised in an earlier round and did not survive re-checking, ruled out of scope, or is a defect in the handoff file rather than the build. They stay visible, with the reason, so a reviewer who saw one learns the outcome rather than wondering where it went.

- **Garima Greh login (build) — not captured** - Admin login carries a Garima Greh role tab (design 9379:116062) but no live GG account was provided.
- **Login states designed-but-not-built** - Registration, credential-recovery, OTP-flow and mobile login states exist in Figma only (no build to compare).
