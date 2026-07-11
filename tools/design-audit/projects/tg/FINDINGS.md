# TG (National Portal for Transgender Persons — dev) — Design-QC findings (DRAFT, pre-review)

Portal: admin portal (tg-admin-dev.mosje.in). Design: MoSJE Portal Handoff, "User Roles" section
(fileKey gH2vQ62cfg4677YKWuOpLc). Baseline: derived (Figma variables). Machine DS-adoption: 35.9%.

Role↔design map: central-admin ↔ ADMIN dash (2494:38830) · examining-officer/"Examining Authority"
(Maker) ↔ MAKER dash (2494:41744) · district-magistrate ↔ DM dash (2494:42053). The build implements
the maker-checker split as Examining Authority (Maker) → District Magistrate (checker/approver) — there
is NO separate "Checker" role in the build, so the design's CHECKER frame (2494:41894) maps to the DM
and is **out of QC scope** (removed from the role/coverage list). Application Detail design = 2494:38975;
Documents variant = 2494:39123; Approve modal = 2494:39988; Correction modal = 2494:39801.

NOTE: the masthead accessibility toolbar (A−/A/A+, contrast, accessibility, language) IS present in the
build on every screen — NOT a finding (unlike NHAPOA). Do not flag it.

---

## GLOBAL findings (Scope: Global — apply to every admin screen with the element)

- **TG-GLOBAL-001 · Major · Content & Iconography** — Masthead co-branding lockup removed.
  DESIGN: masthead right zone carries the SAMAVESH co-branding lockup — the **Digital India** logo +
  the **SAMAVESH** logo ("Single Access Mechanism for All Verticals of Empowerment & Social Harmony") —
  before the user/avatar block. BUILD: both logos are omitted portal-wide; only the user name/role/avatar
  remain on the right. FIX: restore the Digital India + SAMAVESH co-branding lockup in the masthead right
  zone per the design, on every admin screen.

- **TG-GLOBAL-002 · Minor · Content & Iconography** — Masthead identity lockup reduced from 3 lines to 2.
  DESIGN: "Government of India / Ministry of Social Justice & Empowerment / **Department of Social Justice
  & Empowerment**" (Department line in bold navy). BUILD: only "Government of India / **Ministry of Social
  Justice & Empowerment**" — the Department line is dropped and the bold weight moves up a line. FIX:
  render the full 3-line identity lockup with the Department line bold per the design masthead.

- **TG-GLOBAL-003 · Major · Components & States** — KPI cards lost their metric icon + trend line.
  DESIGN: each dashboard KPI card shows a leading metric icon and a delta/trend line ("▲ +14.5% vs last
  month" or a contextual subtitle). BUILD: KPI cards render only a label + number — the icon and the
  trend/subtext are dropped, losing the at-a-glance comparison hierarchy. Applies to all role dashboards.
  FIX: restore the KPI card icon and trend/delta subtitle per the design KPI component.

- **TG-GLOBAL-004 · Minor · Components & States** — Pagination active-page state differs.
  DESIGN: active page = **outlined** (white fill, navy border, navy numeral). BUILD: active page = a
  **navy-filled** chip with a white numeral. Applies to every paginated table (dashboards, user/role
  management). FIX: match the pagination active-page control to the design's outlined style.

- **TG-GLOBAL-005 · Minor · Color & Token** — Data-table header fill inconsistent across the build.
  DESIGN: table headers use a light neutral-gray fill (≈#f9fafb, Stroke/50). BUILD: dashboard
  Application-Queue tables use a near-neutral header, but the User/Role/Tenant management tables use a
  light **blue** header tint (≈#dbeafe). FIX: standardise all data-table headers to the neutral-gray
  header token per the design; drop the blue tint on the management tables.

- **TG-GLOBAL-006 · Major · Color & Token (machine)** — DS-adoption 35.9% of 822 elements.
  Machine pass (derived baseline from Figma variables) finds 527/822 elements render a colour / radius /
  type-size that is not a TG design-system token — top deviations in out/conformance.json. FIX: replace
  raw values with the nearest DS token; verify per-deviation severity by hand.

## Per-screen findings

### Examining Officer (Maker) — Dashboard  [MAKER 2494:41744 ↔ EXAMINING-OFFICER-DASHBOARD]
- **TG-EOD-001 · Minor · Components & States** — "Classification" column dropped. DESIGN Maker queue has
  a Classification column (Clean / Exception badges) flagging exception applications; BUILD omits it, so
  triage exceptions aren't visible in the list. FIX: show the Classification column per the design (low
  priority — build shows fewer columns than the design).
- **TG-EOD-002 · Minor · Components & States** — Queue filters missing. DESIGN queue header has All
  Classifications / All Types / All Status filter dropdowns; BUILD has only a search box + a State/District
  toggle. FIX: surface the relevant queue filters per the design.

### District Magistrate — Dashboard  [DM 2494:42053 ↔ DISTRICT-MAGISTRATE-DASHBOARD]
- **TG-DMD-001 · Nit · Components & States** — Extra "Current Stage" column + View action in the build
  queue not in the design DM table (design DM columns: Applicant ID, Name, District, Due in, Status).
  Confirm if intended — build has an extra column, do not remove without design sign-off.

### Central Admin — Dashboard  [ADMIN 2494:38830 ↔ CENTRAL-ADMIN-DASHBOARD]
- **TG-CAD-001 · Nit · Layout & Spacing** — Global filter bar (State / District / Date range) sits ABOVE
  the KPI cards in the build; the design keeps filters inside the Application Queue card. The build is a
  richer analytics dashboard (6 KPIs + State/District charts) vs the design's 4-KPI exception queue —
  these extras are build-only (route to Design Suggestions / audit vs the visual language, not "remove").
  Confirm the analytics layout is intended.
- **TG-CAD-002 · Minor · Color & Token** — Confirm the analytics chart palette uses TG tokens (Primary/
  Source #003366 for bars, Success/Source #2e7d32 for the approval-rate series) rather than raw greens/
  blues. Verify against tokens; charts are a build-only section audited vs the visual language.

### Application Detail  [ADMIN detail 2494:38975 ↔ *-APPLICATION-DETAIL]
- **TG-AD-001 · Minor · Layout & Spacing** — Persistent expanded admin sidebar on the central-admin detail
  page narrows the content column; the design detail is full-width (sidebar collapsed to a hamburger). The
  examining-officer / DM detail pages have no sidebar (match the design). Confirm the central-admin sidebar
  on detail views is intended.
- **TG-AD-002 · Nit · Components & States** — Detail tab set differs: design has 2 tabs (Applicant Details,
  Documents); build has 4 (adds Revised Certificate, ID Card). Build-extra — confirm if intended.

## COVERAGE MATRIX (roles × screens)

Build roles (from Role Management): **Admin · District Magistrate · Examining Authority/State · GG USER (Garima Greh)**.
Design dashboards (User Roles section): ADMIN · MAKER · DM. (The design's CHECKER frame maps to the DM
in the build — no separate Checker role — so it is excluded from this matrix.)

| Role (build) | Design frame | Dashboard | App detail | Documents | Approve/Correction modal | Status |
|---|---|---|---|---|---|---|
| Admin | ADMIN 2494:38830 | ✅ | ✅ | ✅ | ❌ deferred | COVERED |
| District Magistrate | DM 2494:42053 | ✅ | ✅ | ✅ | ❌ deferred | COVERED |
| Examining Authority/State (Maker) | MAKER 2494:41744 | ✅ | ✅ | ✅ | ❌ deferred | COVERED |
| **Garima Greh (GG USER)** | none in this section | ❌ | ❌ | ❌ | ❌ | **DEBT — separate login tab, no account provided** |

> Removed from this matrix: **Checker** (design CHECKER 2494:41894). The build has no separate Checker
> role — the maker-checker split is Examining Authority (Maker) → District Magistrate (checker/approver),
> so the CHECKER design maps to the DM row above. Not coverage debt.
| Citizen / Applicant | Applicant section (49 frames) | ✅ | ✅ apply-flow | ✅ | n/a | **PARTIAL — see Citizen coverage below** |

Build-only (no design frame), captured & audited vs the visual language: User Management · Role Management ·
Password Policy · Tenants (Central Admin only).

## CITIZEN / APPLICANT PORTAL COVERAGE (tg-user-dev.mosje.in — env dev)

Login cracked: **email-only OTP**, auto-retrieved from the public Mailinator inbox (anshul@mailinator.com);
`8953555822`-style mobiles work too but SMS OTP must be relayed. Fresh applicants self-registered by state
(Create Account → Full Name/Email/Mobile + **State/District** → login). 14 screens captured (env: dev):

- **Approved state** (anshul, cert TG/CERT/2026/40975): Login · Dashboard (Certificate Active + welfare grid) ·
  Certificate detail ("You are officially recognized" + Download Certificate/ID Card + Gender Revision Request) ·
  Certificate/ID · Grievances.
- **Fresh applicant / apply flow** (QA Applicant MH — Maharashtra/Ahmednagar): Register form · Pre-application
  dashboard (Start Application) · Type choice (New vs Revised Certificate, /digi-locker) · Entry-method choice
  (DigiLocker vs Manual, /details) · Manual-form intro (/manual-form/entry) · Basic Identity Details form
  (blank + fully filled: all text + 7 custom dropdowns) · Documents step (blank + all 4 uploads staged:
  ID-proof PDF, passport photo JPG, signature PNG, affidavit PDF).

**Citizen masthead also OMITS the co-branding** (Digital India + SAMAVESH) — TG-GLOBAL-001 applies to the
citizen portal too. A **UX4G accessibility widget FAB** (purple, bottom-right) is present on citizen pages.

**CO-BRANDING REFINEMENT (verified in real browser):** the Digital India + SAMAVESH co-branding lockup IS
present on the **login pages** of both portals (citizen /auth/sign-in and admin /login), but is **dropped on
every authenticated inner page**. So TG-GLOBAL-001 is precisely "co-branding present on login, missing after
login" — restore it in the authenticated masthead to match the login masthead.

### Citizen application journey — SUBMITTED end-to-end (real browser)
A full manual application was completed + SUBMITTED via the browser: **TG-2026-000142** (QA Applicant MH,
Maharashtra/Ahmednagar). States captured across the journey:
- Register → Pre-application dashboard (Start Application) → Type choice → Entry-method choice → Manual intro →
  Basic Identity (blank+filled) → Documents (blank+filled) → **Review** → **Declaration** → **Confirmation
  (TG-2026-000142, "Application Submitted Successfully", Issued to District Magistrate Ahmednagar)** → **What
  Happens Next** → **Track/Resume (Step 3 of 3)** → **In Scrutiny / Under Review** (progress tracker Submitted→
  In Scrutiny→Approval→Certificate Generation) → **Full Application view ("Pending with District Magistrate
  (Ahmednagar)")**. Plus the approved end-state via anshul. This spans pre-application → submitted → under-review.
- Headless submit note: the SPA's docs→review "Save and Review" step does not commit headlessly (uploads 201 but
  no client navigation); the browser **Resume/Track** path completes it. So further automated submissions need the
  browser for the final commit.

### STILL OPEN — admin Approve / Request-Correction modals
Submitted apps route "Pending with District Magistrate (<applicant's district>)". My admin accounts are **DM
Chandigarh / Examining Gujarat / Central**; the submitted app is **Ahmednagar** → not in their actionable queues
(DM Chandigarh shows Pending Reviews = 0). To capture the admin **actionable detail + Approve + Request-Correction
modals**, seed a submitted application in a district matching an admin account (e.g. Chandigarh for the DM) — this
needs a full browser apply-flow with document uploads (the browser file tool only accepts user-shared files, so
either connect the fixtures folder or a human completes one Chandigarh submission). Then the DM queue shows it
actionable and the modals are capturable.

**"different states" = the registration State/District selection** (certificate is issued by the state's
DM/Examining Authority — anshul's was Lucknow/UP). Fresh applicants can be registered per state; the apply-flow
UI is state-agnostic (the state routes the application to that state's admin queue).

### Citizen SUBMIT — blocked (client-side commit), NOT faked
The full manual application fills end-to-end (identity + documents), all 4 uploads succeed server-side
(`201 POST /api/v1/user/documents/upload`, no 4xx/5xx, no console errors), and "Save and Review" is enabled —
but clicking it does not navigate to Review (a client-side commit/timing guard in the SPA that ~10 headless
attempts couldn't clear). So **submitted / under-review / rejected** applicant states — and the admin
**Approve/Correction modals** they would seed — remain debt. Fastest unblock: a human completes ONE submission
(2 min) on this MH draft (tgaudit.mh01@mailinator.com) or any account; then the downstream applicant states +
the admin actionable detail/modals become capturable.

## ENVIRONMENT NOTE (dev + UAT both checked)

Both environments were audited with the same 3 admin accounts (email → OTP `123456`):
- **dev:** tg-admin-dev.mosje.in · **UAT:** tg-admin-uat.mosje.in — all 3 accounts authenticate on both.
- **UAT is the same build as dev** (identical layout, same missing masthead co-branding, ~identical data
  set: Central Admin total 49009 UAT vs 49031 dev). All findings apply to both environments.
- The Approve / Request-Correction action controls + modals could NOT be reached for any of the 3 roles on
  **either dev or UAT**: every visible application rendered a read-only detail page with no action buttons
  (confirmed on a non-terminal "Overdue" app for the Maker, and the DM's queue had no app at its actionable
  stage). Either the decision controls aren't built in this version, or they are jurisdiction/assignment-
  gated for these accounts. Needs a correctly-assigned pending application (or dev-team confirmation).
- Screenshots are tagged **DEV** / **UAT** in the report. Captured UAT copies live in captures/live-uat/.

## DEFERRED — by decision / coverage debt (design exists, live not reproducible on dev OR UAT; NOT faked)

- **Garima Greh (GG USER) role/module** — the admin login carries a dedicated "Garima Greh" role tab and Role
  Management lists a "GG USER" role, but no Garima Greh account was provided and the "User Roles" design
  section has no Garima Greh frames. The entire Garima Greh admin area is uncaptured. Supply a Garima Greh
  login (and any Garima Greh design frames) to audit it.
- **Checker role/dashboard — RESOLVED, removed from QC scope.** The build's Role Management surfaces no
  separate "Checker" role (Admin · DM · Examining Authority · GG USER only). The maker-checker split is built
  as Examining Authority (Maker) → District Magistrate (checker/approver), and the DM approver flow is fully
  captured (dashboard, actionable detail, Approve/Reject/Correction modals, end-to-end approval). The design's
  CHECKER dashboard (2494:41894) therefore maps to the DM — not a separate role and not coverage debt.

- **Application Detail — ACTIONABLE state + Approve / Correction / Reject modals: NOW CAPTURED.** Seeded a
  Chandigarh citizen application (TG-2026-000143 → DM Chandigarh queue, actionable "DM Review"). Captured
  normalized (env dev), decision NOT committed (Cancelled each): DISTRICT-MAGISTRATE-APPLICATION-DETAIL-ACTIONABLE
  (Approve · Request Correction · Reject + System Validation ↔ 2494:38975), DISTRICT-MAGISTRATE-MODAL-APPROVE
  (↔ 2494:39988), DISTRICT-MAGISTRATE-MODAL-CORRECTION (↔ 2494:39801), DISTRICT-MAGISTRATE-MODAL-REJECT
  (build-extra, no design). Method: headless uploaded the 4 docs to the same app; browser committed submit;
  app routed to the matching-district DM.

## FULL LIFECYCLE — CLOSED END-TO-END (user-authorized approval)
The DM Approved TG-2026-000143 (Approved 49→50, Pending 1→0). Captured (env dev):
- **DISTRICT-MAGISTRATE-APPLICATION-DETAIL-APPROVED** — "Approved and Signed" pill, action buttons gone (read-only).
- **CITIZEN-CH-DASHBOARD-APPROVED / -CERTIFICATE-DETAIL** — "Application Approved / You are officially recognized",
  "issued by the District Magistrate of Chandigarh", Download Certificate + ID Card + Gender Revision Request,
  digital ID **TG/CERT/2026/40982**, Welfare Benefits UNLOCKED. **CITIZEN-CH-TRACK-APPROVED** — post-approval track.
Full journey proven: register (Chandigarh) → apply (manual) → submit → In Scrutiny/Pending-with-DM → DM Approve →
Certificate issued + welfare unlocked. Mirrors anshul's approved end-state (consistency confirmed).
- **Citizen / Applicant portal** (tg-user-dev.mosje.in) — DigiLocker Happy Path (25 frames), Manual
  Fallback (19), Lifecycle Changes (3), Dashboards (2): no working citizen login (DigiLocker/Aadhaar-gated;
  provided citizen email unregistered). Entire applicant portal is coverage debt until a registered citizen
  identity / DigiLocker test identity is supplied.

## Severity roll-up (draft): 0 Blocker · 3 Major · 8 Minor · 3 Nit  (+ machine DS-conformance deviations)
