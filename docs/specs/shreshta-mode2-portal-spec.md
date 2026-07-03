# SHRESHTA Mode-2 (e-Anudaan) — Demo Portal Spec

> **Source of truth:** `docs/brd/SHRESHTA_Mode2_BRD_v1_1.docx` (v1.1, June 2026, implementation-ready).
> **Deliverable:** a clickable demo portal on the shared `@mosje/design-system`, mock data only.
> **Status:** Draft spec for build. Filed locally (not as GitHub issues yet).
> **Author:** prepared via `/spec` from the approved BRD, 2026-07-01.

---

## 0. Executive summary (what we are building)

SHRESHTA Mode-2 is MoSJE's **Grant-in-Aid to NGOs** that run residential schools/hostels for
Scheduled-Caste students. The BRD onboards it onto the e-Anudaan portal: an NGO files a grant
application, it climbs a fixed Ministry approval chain (**ASO → SO → US → DS/Director →
JS-IFD → JS-PD → PD**), the PD sanctions (**YES**) or returns (**NO** via SO-PD) for
reconsideration, a PMU inspection runs alongside, and a sanction order hands off to fund release.

We build this as a **new demo portal** — `apps/portals/shreshta` — following the exact pattern
of the other portals in this repo (`nmba`, `scw`, `pm-ajay`): a Next.js zone mounted through the
hub at `/portals/shreshta`, rendering entirely from the shared design system, backed by an
**in-session mock store** (React context + reducer, resets on reload, no backend). Every
external integration (PFMS, NGO-Darpan, NTA, email/SMS) is **mocked/stubbed** — the demo shows
the full workflow and every screen, not real fund movement.

This is scoped as an **epic** with **14 child work-items**, each independently completable in
1–3 days. Build them roughly in the phase order in §12.

---

## 1. Context (why this matters)

**Who is affected.**
- **NGOs** (external applicants) — apply for Grant-in-Aid, upload documents, respond to
  deficiencies, track status, view sanction.
- **MoSJE Programme Division officers** (ASO, SO, US, DS/Director, JS-PD, PD, SO-PD) — verify,
  scrutinise, concur, sanction or return.
- **IFD** (JS-IFD + internal finance chain) — financial concurrence.
- **PMU** — physical/online inspection of institutions.
- **System Administrator** — scheme config, users, workflow, audit.
- **Beneficiaries** (SC students) — indirect; no self-service in scope.

**Current state (verified in this repo).**
- No SHRESHTA / e-Anudaan portal exists. `apps/portals/` holds `eutthan-admin`, `nmba`,
  `pm-ajay`, `scw`, `smile-admin`. SHRESHTA is not yet in the app registry
  (`packages/design-system/components/navigation/app-switcher-utils.ts` — 23 entries, none named
  SHRESHTA/e-Anudaan/residential).
- The estate is a set of **front-end demo portals on mock data** — `nmba` and `scw` both use an
  in-session React store (`apps/portals/nmba/src/lib/treatment-centre/store.tsx` seeds mock data,
  "resets on reload — by design"). This spec matches that pattern.

**Why now.** SHRESHTA Mode-2 has an implementation-ready BRD (76 FRs, 23 screens, 11 roles). It
is the most build-ready scheme in the SHRESHTA programme and can be demoed to stakeholders on the
existing design system without waiting on NIC API docs or PFMS whitelisting.

**How we know it's done.** A reviewer can log in as any of the 11 roles from a demo-credentials
panel and walk a mock application end-to-end: NGO submit → ASO certify+forward → SO/US/DS review →
JS-IFD/JS-PD concur → PD YES (sanction order generated) or PD NO (returns via SO-PD, loops back to
ASO), with a PMU inspection visible to reviewers, notifications firing, an audit trail growing,
and the 8 reports rendering — all on `@mosje/design-system`, GIGW/WCAG-AA clean.

---

## 2. Scope

### 2.1 In scope
- New `apps/portals/shreshta` zone + hub registration (rewrite, proxy zone, dev script, port
  4127, app-registry card).
- All **23 screens** (SM2-S01…S22 + S18A) and **11 roles** (SM2-R01…R11) from the BRD.
- The full approval chain, PD YES/NO decision, SO-PD return + reconsideration loop, SO-level
  deficiency loop, US/DS query-return, Show Cause Notice, offline **and** online inspection.
- Mock domain model + in-session store seeded with applications spread across every status/stage.
- Notifications centre (in-session, 9 events), 8 reports with CSV export, admin console.
- Immutable-style audit trail threaded through the store.
- Demo credentials panel (per `.claude/rules/portal-login-demos.md`), AppSwitcher FAB,
  ColorModeProvider (per `.claude/rules/portal-appswitcher.md`).

### 2.2 Out of scope
- SHRESHTA **Mode-1** and any other scheme (separate spec).
- Any State-Government layer (Mode-2 has none — deliberately absent).
- **Real** integrations: live PFMS fund release, NGO-Darpan OTP/identity reads, NTA feeds,
  DigiLocker/eSign, real email/SMS. All are **mocked** (typed stub functions + fake latency).
- Persistence/backend, real auth, real file storage. Uploads are mock file references
  (name/size/type), not real bytes to a server.
- Beneficiary/student self-service portals.
- Grant-amount policy computation beyond `recurring + non-recurring = total` validation.

### 2.3 Deliberate demo simplifications (call these out in the UI)
- Login accepts demo credentials with any/`Demo@123` password; no real credential store.
- "Uploads" store metadata + an object URL for preview; lost on reload.
- Notifications/email/SMS are shown in-portal only (a "delivery status" chip is mocked).
- Sanction order is a rendered on-screen/printable view, not a signed PDF artifact.

---

## 3. Roles (SM2-R01…R11) and demo accounts

Ministry officer roles act in a **fixed sequence**; PMU and Admin act independently.

| Role ID | Role | Demo login ID | Password | Landing |
|---|---|---|---|---|
| SM2-R01 | NGO User | `ngo@demo` / `9900000001` | `Demo@123` | NGO dashboard (S02) |
| SM2-R02 | Ministry ASO (dealing hand) | `aso@demo` | `Demo@123` | ASO work-list (S09) |
| SM2-R03 | Ministry SO | `so@demo` | `Demo@123` | SO work-list (S10) |
| SM2-R04 | Ministry US | `us@demo` | `Demo@123` | US work-list (S11) |
| SM2-R05 | Ministry DS / Director | `ds@demo` | `Demo@123` | DS work-list (S12) |
| SM2-R06 | JS-IFD | `jsifd@demo` | `Demo@123` | IFD work-list (S13) |
| SM2-R07 | JS-PD | `jspd@demo` | `Demo@123` | PD-division work-list (S14) |
| SM2-R08 | PD (final sanctioning authority) | `pd@demo` | `Demo@123` | PD work-list (S15) |
| SM2-R09 | SO-PD (returned-case handler) | `sopd@demo` | `Demo@123` | Returned-case work-list (S16) |
| SM2-R10 | PMU Team | `pmu@demo` | `Demo@123` | Inspection work-list (S18/S18A) |
| SM2-R11 | System Administrator | `admin@demo` | `Demo@123` | Admin console (S22) |

Demo-credentials panel lists all 11, each with a **Use** button that fills the form and selects
the role. Closed by default (`<details>`), password `Demo@123`. Per project rule
`.claude/rules/portal-login-demos.md`.

---

## 4. Screen inventory (23 screens) → DS mapping

Every screen reuses `@mosje/design-system`. **DS Audit** (mandatory per CLAUDE.md): the primitives
below already exist in `packages/design-system/index.ts`; nothing new needs adding to the DS for
this portal except possibly a **WorkflowTimeline** display (see §8, additive to DS).

| Screen ID | Screen | Actor | Primary DS components |
|---|---|---|---|
| SM2-S01 | NGO Login & Auth | NGO | `PortalLoginShell`, `Input`, `Button`, `DemoFab`/demo panel |
| SM2-S02 | NGO Dashboard | NGO | `KpiRow`/`MetricCard`, `DataTable`, `Badge`, `Alert`, `Card` |
| SM2-S03 | Application Form (multi-section) | NGO | `Wizard` + `FormSection`/`FormCard`, `Input`/`Select`/`Radio`/`Checkbox`/`Textarea`, `FormField`, `ReviewSection`/`ReviewItem` |
| SM2-S04 | Supporting Document Upload | NGO | `MediaUpload`, `DataTable`, `Badge` |
| SM2-S05 | Review & Submit | NGO | `ReviewSection`/`ReviewItem`, `Checkbox` (declaration), `Button` |
| SM2-S06 | Application Status Tracking | NGO | `Stepper`/WorkflowTimeline, `Badge`, `Card` |
| SM2-S07 | Deficiency Response | NGO | `SideSheet`/`Modal`, `Textarea`, `MediaUpload`, `Alert` |
| SM2-S08 | Sanction Details View | NGO | `Card`, `Button` (download/print), `Badge` |
| SM2-S09 | ASO Verification | ASO | `Tabs` (form/docs/inspection), `Checkbox` (mandatory certification), `Textarea` (remarks), `MediaUpload`, `Button` (forward/raise-deficiency) |
| SM2-S10 | SO Review | SO | same review shell as S09; deficiency-to-NGO action |
| SM2-S11 | US Review | US | review shell; query-return action (no deficiency) |
| SM2-S12 | DS/Director Review | DS | review shell; query-return action |
| SM2-S13 | JS-IFD Financial Approval | JS-IFD | review shell + finance panel; internal IFD sub-chain indicator |
| SM2-S14 | JS-PD Programme Division | JS-PD | review shell; forward-to-PD |
| SM2-S15 | PD Sanction Decision | PD | review shell; `SegmentedControl`/radio YES-NO, remarks, sanction particulars |
| SM2-S16 | SO-PD Returned-Case | SO-PD | review shell; observations; route-down action |
| SM2-S17 | Sanction Order Generation & View | PD/System | `Card`/printable order layout, `Button` |
| SM2-S18 | PMU Inspection Upload (offline) | PMU | `Wizard`/`FormSection` (PART-A…D), `MediaUpload`, `Lightbox`, `Select` (status) |
| SM2-S18A | Online Inspection (portal) | PMU | same proforma; inline capture; `Lightbox` |
| SM2-S19 | Inspection Report View | Ministry officers | read-only `Card`/`ReviewSection`, `Lightbox` |
| SM2-S20 | Notifications Centre | all | `DataTable`/list, `Badge` (read/unread + channel), `Tabs` |
| SM2-S21 | Reports & Analytics | Ministry/Admin | `FilterBar`, `DataTable`, `ChartCard`, CSV export button |
| SM2-S22 | Admin Console | Admin | `Tabs`, `FormSection`, `Toggle`, `DataTable` |

---

## 5. End-to-end workflow (the state machine)

### 5.1 Primary chain
```
NGO (Submitted)
  → ASO  [certify ✔ + remarks] → forward
  → SO   [remarks] → forward            (or deficiency → NGO → back to SO)
  → US   [remarks] → forward            (or query → return down hierarchy)
  → DS/Director [remarks] → forward     (or query → return down hierarchy)
  → JS-IFD [internal IFD chain → concurrence + remarks] → forward
  → JS-PD  [concurrence + remarks] → forward
  → PD     [DECISION]
```

### 5.2 PD decision
- **YES** → generate sanction order (S17) → status `Sanctioned` → hand to (mock) fund release →
  status `Released`.
- **NO** → status `Returned (SO-PD)`, mandatory remarks → **SO-PD** records observations →
  routed **down** `US → SO → ASO` for rework → climbs back up the full chain → PD again. Loop
  repeats until YES.

### 5.3 Deficiency loop (SO level only)
ASO may **raise** a deficiency (routes to SO); SO **communicates** it to the NGO. Status
`Deficiency Raised`. NGO edits only reopened fields + adds docs, resubmits → `Deficiency
Responded` → re-enters at **SO**. US and DS may **not** issue deficiencies to the NGO — they
raise a **query in the file** and return it down the hierarchy.

### 5.4 Show Cause Notice (independent)
Any authorised Ministry officer may issue an SCN at any stage (mandatory grounds + response
timeline). Status `Show Cause Issued` → NGO replies (`Show Cause Responded`) → issuing officer
reviews and proceeds. Recorded in audit; NGO notified.

### 5.5 Inspection track (independent of chain)
PMU runs **offline** (S18: upload report/photos/evidence) **or online** (S18A: capture proforma
in-portal). Status `Pending → Uploaded → Reviewed`. Visible read-only to all Ministry reviewers
(S19) and informs the PD decision.

### 5.6 Status model (drives every work-list)
`Draft · Submitted · Under Verification/Review · Deficiency Raised · Deficiency Responded ·
With PD · Returned (SO-PD) · Sanctioned · Released · Show Cause Issued · Show Cause Responded ·
Rejected/Closed`

A **`currentStage`** enum (`ASO|SO|US|DS|JS_IFD|JS_PD|PD|SO_PD|PMU|NGO|DONE`) plus the status is
what each role's work-list filters on.

---

## 6. Mock domain model (the store shape)

In-session store: `apps/portals/shreshta/src/lib/store.tsx` (React context + `useReducer`),
seeded from `apps/portals/shreshta/src/lib/mock-data.ts`. Types in
`apps/portals/shreshta/src/lib/types.ts`. Mirrors `nmba/treatment-centre` pattern.

```ts
type Role =
  | "NGO" | "ASO" | "SO" | "US" | "DS" | "JS_IFD" | "JS_PD"
  | "PD" | "SO_PD" | "PMU" | "ADMIN";

type AppStatus =
  | "Draft" | "Submitted" | "UnderReview" | "DeficiencyRaised"
  | "DeficiencyResponded" | "WithPD" | "ReturnedSOPD" | "Sanctioned"
  | "Released" | "ShowCauseIssued" | "ShowCauseResponded" | "Closed";

type Stage =
  | "ASO" | "SO" | "US" | "DS" | "JS_IFD" | "JS_PD" | "PD" | "SO_PD"
  | "NGO" | "DONE";

interface AuditEntry {
  id: string;
  ts: string;                 // ISO
  actorRole: Role;
  actorName: string;
  action: "submit" | "certify" | "forward" | "deficiency" | "deficiencyResponse"
        | "query" | "returnPD" | "observation" | "concurrence" | "decision"
        | "sanctionGenerated" | "inspectionUpload" | "showCauseIssued"
        | "showCauseResponse" | "login" | "configChange";
  fromStage?: Stage;
  toStage?: Stage;
  remarks?: string;
  docIds?: string[];
}

interface MockDoc {
  id: string; name: string; category: string;
  mime: "pdf" | "jpg" | "png"; sizeKB: number;
  uploaderRole: Role; ts: string; objectUrl?: string; // preview only
}

interface Inspection {
  mode: "offline" | "online" | null;
  status: "Pending" | "Uploaded" | "Reviewed";
  team?: string; date?: string;
  proforma?: Record<string, unknown>;   // PART-A…D fields (Annexure B)
  observations?: string; recommendation?: string;
  reportDocId?: string; photoIds: string[]; evidenceIds: string[];
}

interface Deficiency {
  id: string; raisedByRole: Role; communicatedToNGO: boolean;
  remarks: string; reopenedFields: string[]; ts: string;
  responseText?: string; respondedTs?: string;
}

interface ShowCause {
  id: string; issuedByRole: Role; grounds: string;
  responseDeadline: string; ts: string;
  replyText?: string; replyDocIds?: string[]; repliedTs?: string;
}

interface SanctionOrder {
  orderNo: string; date: string;
  amountRecurring: number; amountNonRecurring: number; amountTotal: number;
  instalment: "1st" | "2nd" | "3rd" | "FullAndFinal";
  headOfAccounts: string;         // Annexure E defaults
}

interface Application {
  id: string;                     // application number
  financialYear: string;          // e.g. "2026-27"
  ngo: NgoProfile;                // Annexure A organisation + institution fields
  form: ApplicationForm;          // full multi-section payload
  documents: MockDoc[];
  totalBeneficiaries: number;     // mandatory, > 0, visible to all reviewers
  status: AppStatus;
  currentStage: Stage;
  inspection: Inspection;
  deficiencies: Deficiency[];
  showCauses: ShowCause[];
  sanction?: SanctionOrder;
  audit: AuditEntry[];
  createdAt: string; updatedAt: string;
}
```

**Store actions** (reducer): `submitApplication`, `certifyAndForward` (ASO), `forward`,
`raiseDeficiency`, `communicateDeficiency` (SO), `respondDeficiency` (NGO), `raiseQuery`,
`concur` (JS-IFD/JS-PD), `pdDecision(YES|NO, remarks, particulars?)`, `soPdObservations`,
`routeDownForRework`, `uploadInspection`, `recordOnlineInspection`, `setInspectionStatus`,
`issueShowCause`, `respondShowCause`, `generateSanctionOrder`, `markReleased`, `pushNotification`,
`configChange`. **Every** action appends an `AuditEntry` (immutable-style: append-only, never
mutated/deleted — matches BR-SM2-17 / AT-SM2-04 in spirit).

**Seed data (mock-data.ts):** ~10–12 applications spread across every status so each role's
work-list is non-empty on login: e.g. 2 `Submitted` (ASO queue), 1 `DeficiencyRaised`,
1 at `US`, 1 at `JS_IFD`, 1 `WithPD`, 1 `ReturnedSOPD`, 2 `Sanctioned`, 1 `Released`,
1 `ShowCauseIssued`, plus inspections in each of Pending/Uploaded/Reviewed. Use realistic
gov NGO names, UDISE-style IDs, NGO-Darpan IDs, head-of-accounts from Annexure E
(Demand 93, Major Head 2225, Object head 30.00.31).

---

## 7. Functional requirements mapped to build (FR-SM2-01…76)

The BRD's 76 FRs are the acceptance backbone. They group cleanly onto the child work-items in
§12. Key rules that must be enforced in the demo (not just displayed):

- **FR-SM2-09 / VR-SM2-03 / BR-SM2-06** — `totalBeneficiaries` mandatory, numeric, **> 0**;
  blocks submit; visible on every officer screen.
- **FR-SM2-27 / VR-SM2-10 / BR-SM2-05** — ASO **cannot forward** unless the certification
  checkbox is ticked; ticking writes an audit entry.
- **FR-SM2-10 / VR-SM2-07** — `recurring + non-recurring === total`; conditional sections
  (rent particulars when "Rented") become mandatory.
- **BR-SM2-04 / VR-SM2-11** — remarks mandatory on every forward/deficiency/query/return/concur.
- **FR-SM2-42…47 / BR-SM2-08…10** — PD YES→sanction; PD NO→SO-PD→route-down US→SO→ASO→loop.
- **BR-SM2-07** — deficiency-to-NGO only at SO; US/DS do query-return only.
- **FR-SM2-71/72 / BR-SM2-18** — direct Show Cause Notice at any stage.
- **FR-SM2-51…56, 73…75 / BR-SM2-12** — inspection offline+online, Pending→Uploaded→Reviewed,
  read-only to reviewers.
- **FR-SM2-48…50 / BR-SM2-15** — sanction order uniquely numbered, generated only on PD YES,
  read-only.
- **BR-SM2-13 / VR-SM2-09** — uploads restricted to PDF/JPG/PNG, ≤10 MB (validated client-side
  on mock upload).
- **AT-SM2-01…05** — audit trail append-only, searchable/exportable in admin (mock 7-yr note).
- **FR-SM2-57/58 + §12 notifications** — 9 events across portal/email/SMS (in-portal + mocked
  delivery-status chip).
- **FR-SM2-59…61 / RP-SM2-01…08** — 8 reports, PDF/Excel/CSV export (CSV real; PDF/Excel via
  print/mock in demo, note the simplification).

Integration FRs (INT-SM2-01…05) are satisfied by **typed mock adapters** with a clear seam
(`src/lib/integrations/*.ts` exporting `pfms`, `darpan`, `nta?`, `gateway` with fake latency +
deterministic responses) so a future production build swaps the implementation without touching
UI. This is the only "integration-ready seam" we keep; everything else is demo.

---

## 8. DS-first audit (mandatory per CLAUDE.md)

Run before writing UI. Result:

```
DS Audit (SHRESHTA Mode-2):
  PortalLoginShell ✅ · Wizard/ReviewSection ✅ · FormCard/FormSection/FormField ✅
  Input/Select/Radio/Checkbox/Textarea/Toggle ✅ · DataTable ✅ · MediaUpload ✅
  Lightbox ✅ · SideSheet/Modal ✅ · Alert/Badge/EmptyState ✅ · Stepper ✅
  KpiRow/MetricCard/ChartCard/DashboardGrid/FilterBar/SegmentedControl ✅
  SidebarNav ✅ · Tabs ✅ · AppSwitcher/ColorModeProvider ✅ · Toast ✅ · DemoFab ✅
  WorkflowTimeline ➕ candidate — a vertical stage-by-stage trail (ASO→…→PD with
     per-stage actor/remarks/timestamp). Prefer composing from `Stepper`; only if the
     visual (branching return path, deficiency loop) can't be expressed with Stepper,
     add `WorkflowTimeline` to the DS first (barrel + design.md), then import it. Do
     NOT build a one-off timeline inside the portal.
```

The officer review screens (S09–S16) share one **ReviewShell** composed entirely from DS parts
(a `Tabs` shell: Application / Documents / Inspection / History + a remarks/action footer). Build
it once inside the portal as a local composition of DS components; it is portal-specific glue, not
a new DS primitive. Only genuinely reusable, cross-portal pieces (e.g. WorkflowTimeline) go into
the DS.

---

## 9. Portal scaffolding (concrete, copy the SCW pattern)

**New app:** `apps/portals/shreshta/` — slug `shreshta`, port **4127**, base path
`/portals/shreshta`, package `@mosje/portal-shreshta`.

Files to create (mirror `apps/portals/scw`):
| File | Content |
|---|---|
| `package.json` | copy scw's; name `@mosje/portal-shreshta`, dev/start `-p 4127` |
| `next.config.ts` | copy scw's; `basePath: "/portals/shreshta"`, `transpilePackages: ["@mosje/design-system"]`, `output: "standalone"`, security headers |
| `tsconfig.json`, `postcss.config.*`, `eslint.config.*` | copy scw's |
| `src/app/layout.tsx` | Noto Sans + `ColorModeProvider` + `AppSwitcher devMode` (per `.claude/rules/portal-appswitcher.md`) + `ToastProvider` |
| `src/app/globals.css` | import `@mosje/design-system` styles + `icons.css` |
| `src/lib/types.ts`, `store.tsx`, `mock-data.ts` | §6 domain model |
| `src/lib/integrations/*.ts` | mock PFMS/Darpan/gateway adapters (§7) |
| route folders per screen | see §12 |

Hub registration — **3 edits + registry** (mirror the nmba/scw entries exactly):
1. `apps/hub/next.config.ts` — add `ZONE_SHRESHTA = process.env.ZONE_SHRESHTA_URL ?? "http://localhost:4127"` + rewrite pair `/portals/shreshta` and `/portals/shreshta/:path*`.
2. `apps/hub/src/proxy.ts` — add a `ZONES` entry `{ prefix: "/portals/shreshta", probeUrl: base(process.env.ZONE_SHRESHTA_URL, "http://localhost:4127") + "/portals/shreshta/login", label: "SHRESHTA Mode-2", cmd: "npm run dev:shreshta" }`.
3. Root `package.json` — add `"dev:shreshta": "bash -c 'cd apps/portals/shreshta && exec ../../../node_modules/.bin/next dev --turbopack -p 4127'"` and include in the aggregate `dev`.
4. `packages/design-system/components/navigation/app-switcher-utils.ts` — add a `DEFAULT_APPS` entry: `{ name: "SHRESHTA Mode-2", abbr: "SH", path: "/portals/shreshta", desc: "Grant-in-Aid to NGOs running residential schools & hostels (SC students)", org: "Ministry of Social Justice & Empowerment", group: "Portals", category: "Schemes & scholarships", status: "planned"→"live" once built }`.

---

## 10. Acceptance criteria (pass/fail)

1. `npm run dev:shreshta` boots on :4127; the portal is reachable through the hub at
   `/portals/shreshta` and the AppSwitcher FAB appears on every page (hidden only on hub `/`).
2. The login page renders via `PortalLoginShell` with a closed-by-default demo-credentials panel
   listing all 11 roles; each **Use** button fills the form and routes to that role's landing.
3. An NGO can complete S03 (multi-section `Wizard`), attach docs (S04), and submit (S05) **only**
   when all mandatory fields, all mandatory docs, `totalBeneficiaries > 0`, and the submit
   declaration are satisfied; otherwise submit is blocked with inline errors.
4. ASO (S09) **cannot** forward until the certification checkbox is ticked and remarks are
   entered; ticking + forwarding both appear in the audit trail.
5. A case walks the **full chain** ASO→SO→US→DS→JS-IFD→JS-PD→PD and reaches `WithPD`; each
   forward requires remarks.
6. **PD YES** generates a uniquely-numbered sanction order (S17), sets `Sanctioned`, exposes it
   read-only to the NGO (S08), and (mock) moves to `Released`.
7. **PD NO** sets `ReturnedSOPD`, requires remarks, hands to SO-PD (S16); SO-PD observations route
   the case **down** US→SO→ASO, and it climbs back to PD — the loop is walkable end-to-end.
8. **Deficiency** raised by ASO is communicated by SO to the NGO (S07); NGO responds → case
   re-enters at SO. US/DS expose **query-return**, not deficiency-to-NGO.
9. A **Show Cause Notice** can be issued at any stage; NGO reply returns to the issuing officer;
   both recorded in audit.
10. PMU can complete **offline** (S18) and **online** (S18A) inspection; status moves
    Pending→Uploaded→Reviewed; every Ministry officer sees it read-only (S19).
11. Notifications centre (S20) shows entries for all 9 events with read/unread + per-channel
    (portal/email/SMS) mock delivery chips.
12. All **8 reports** (S21) render from live store data within the role's scope and export to CSV
    (PDF/Excel via print/mock, with an on-screen note).
13. Admin (S22) can toggle "accept new applications" for a FY (disables NGO create), and view a
    searchable audit trail; audit rows cannot be edited/deleted in the UI.
14. Upload validation rejects non-PDF/JPG/PNG and >10 MB with a clear message.
15. `npm run lint` and `npm run typecheck` pass for the portal with **zero** errors/warnings
    (TS strict, no `any`); GIGW/WCAG-AA: semantic HTML, labelled fields, visible focus, AA
    contrast (run `accessibility-auditor` on login + one officer screen + the form).

---

## 11. Testing plan

| Layer | What | Count (approx) |
|---|---|---|
| Unit | store reducer transitions: submit, certify-guard, forward-remarks-guard, PD YES/NO, deficiency loop, SO-PD route-down, inspection status, audit append; validators (`total>0`, `rec+nonrec=total`, file type/size) | +18 |
| Integration | one full happy-path walk (NGO→…→PD YES→Released) and one return-loop walk (PD NO→SO-PD→ASO→…→PD YES) asserting status/stage/audit at each step | +2 |
| E2E (Playwright — repo already has `e2e/` + `playwright.config.ts`) | login-as-each-role smoke; NGO submit-blocked-until-valid; ASO certify-gate; PD decision both branches; inspection visible to reviewer | +6 |

---

## 12. Epic → child work-items (each 1–3 days)

Build in this order (dependencies flow downward).

```
C1 Scaffold + hub reg ─┬─ C2 Domain model/store/seed ─┬─ C3 NGO form+docs+submit
                       │                              ├─ C4 NGO dashboard/status/deficiency/sanction-view
                       │                              ├─ C5 Officer ReviewShell + ASO (S09)
                       │                              ├─ C6 SO/US/DS (S10–S12)
                       │                              ├─ C7 JS-IFD/JS-PD (S13–S14)
                       │                              ├─ C8 PD decision + sanction order + SO-PD loop (S15–S17,S16)
                       │                              ├─ C9 Inspection offline/online/view (S18/S18A/S19)
                       │                              ├─ C10 Show Cause Notice (cross-cutting)
                       │                              ├─ C11 Notifications centre (S20)
                       │                              ├─ C12 Reports & analytics (S21)
                       │                              ├─ C13 Admin console (S22)
                       └──────────────────────────────┴─ C14 Audit trail wiring + a11y/GIGW pass
```

| # | Work-item | Screens/FRs | Est. |
|---|---|---|---|
| C1 | Portal scaffold + hub registration + layout shell (ColorMode/AppSwitcher/Toast) + login (S01) + demo panel | S01; FR-01…04 | 1–2d |
| C2 | Mock domain model, store (reducer + all actions + audit append), seed data across all statuses | §6; BR-17, AT-01…05 | 2–3d |
| C3 | NGO application form (Wizard, all Annexure-A sections + conditional rent), document upload, review & submit | S03–S05; FR-08…19, VR-03…09 | 2–3d |
| C4 | NGO dashboard, status tracking (timeline), deficiency response, sanction details view | S02,S06,S07,S08; FR-05…07,20…26 | 2d |
| C5 | Officer ReviewShell (Tabs: form/docs/inspection/history) + ASO verification with mandatory certification gate | S09; FR-27…30, BR-05 | 2d |
| C6 | SO review + deficiency-to-NGO; US + DS query-return | S10–S12; FR-31…37, BR-07 | 2d |
| C7 | JS-IFD financial approval (+ internal IFD chain indicator, §7.7) + JS-PD concurrence | S13–S14; FR-38…41,76 | 1–2d |
| C8 | PD decision (YES/NO), sanction order generation & view, SO-PD returned-case + reconsideration loop | S15,S16,S17; FR-42…50, BR-08…10 | 2–3d |
| C9 | PMU inspection: offline upload, online inspection, read-only report view (PART-A…D proforma) | S18,S18A,S19; FR-51…56,73…75 | 2–3d |
| C10 | Show Cause Notice issue + NGO reply flow (cross-cutting, any stage) | FR-71,72; BR-18 | 1d |
| C11 | Notifications centre (9 events, portal/email/SMS mock delivery) | S20; FR-57,58,66,67 | 1–2d |
| C12 | Reports & analytics (8 reports, FilterBar + DataTable + ChartCard, CSV export) | S21; FR-59…61,68…70 | 2d |
| C13 | Admin console (scheme config, new-apps switch, user/credential mgmt, workflow config, audit search) | S22; FR-62…65 | 2d |
| C14 | Audit-trail wiring verification + notifications integration + GIGW/WCAG-AA audit + lint/typecheck zero | AT-01…05; NFR-06 | 1–2d |

**Total:** ~24–33 dev-days (human) across 14 items. With CC + the shared DS most items compress
substantially since the primitives already exist.

---

## 13. Rollback / risk

- Fully additive: a new `apps/portals/shreshta` folder + 4 small hub/registry edits. Rollback =
  delete the folder and revert the 4 registration edits. No existing portal is touched.
- Risk: workflow state machine complexity (return loop + deficiency + SCN). Mitigation: encode it
  once in the store reducer with unit tests (C2/C14) before wiring UI; every screen calls store
  actions, never mutates status inline.
- Risk: DS gap (WorkflowTimeline). Mitigation: try `Stepper` first; only promote to DS if needed,
  with barrel + `design.md` update per the DS rule.

---

## 14. Open decisions (resolve during build)

| ID | Item | Default if unanswered |
|---|---|---|
| OD-01 | Add `WorkflowTimeline` to the DS, or compose from `Stepper`? | Compose from Stepper; promote only if the return-loop visual needs it. |
| OD-02 | Reports PDF/Excel export — real or print/mock in demo? | CSV real; PDF/Excel via browser print + a note. Revisit if stakeholders need true xlsx. |
| OD-03 | Set the registry card `status` to `planned` or `live` on first merge? | `planned` until C14 passes, then flip to `live`. |
| OD-04 | Internal IFD sub-chain (7.7) — model as discrete stages or a single concurrence with an indicator? | Single JS-IFD node with a "5-step internal examination (mock)" indicator; keep the chain visible in audit. |
| OD-05 | Bilingual (Hindi) UI now or later (NFR-SM2-11)? | English now; Noto Sans already loads Devanagari, so leave hooks but don't translate content in the demo. |

---

## 15. Traceability

Every requirement traces to `docs/brd/SHRESHTA_Mode2_BRD_v1_1.docx`:
FR-SM2-01…76, BR-SM2-01…18, VR-SM2-01…17, NT-SM2-01…09, AT-SM2-01…05, RP-SM2-01…08,
INT-SM2-01…05, NFR-SM2-01…12. Screen IDs SM2-S01…S22 + S18A and role IDs SM2-R01…R11 are
preserved verbatim in code comments so the build stays auditable against the BRD.
