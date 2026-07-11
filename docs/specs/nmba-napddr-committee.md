# Spec: NAPDDR Three-Tier Committee module — NMBA portal

## Context

States/UTs have been directed to constitute **3-tier committees** (State → District → Block) for coordinated ground-level implementation of NAPDDR (National Action Plan for Drug Demand Reduction). The ministry needs each tier to **register its committee notification and meeting minutes**, and needs **role-scoped visibility + consolidated reports** so DoSJE/NMBA can monitor formation across the country.

The NMBA portal (`apps/portals/nmba`) **is the SAMAVESH NMBA module** — it runs on the shared SAMAVESH design system, is registered in the SAMAVESH hub proxy (`apps/hub/src/proxy.ts`) and the SAMAVESH app-switcher (`packages/design-system/.../app-switcher-utils.ts`), mounted at `/portals/nmba`. It is a **frontend prototype** — mock cookie logins, React-state stores seeded from mock data, no backend. This feature is built to match that pattern. Because this portal is the SAMAVESH NMBA module, **email item 8 ("NeGD team to do the same on the SAMAVESH portal") is satisfied by this same build** — there is no separate SAMAVESH deliverable. Only the standalone **NMBA mobile App** (item 7) remains out of scope.

## Decisions locked
- D1: Frontend prototype (match repo's mock-store pattern). No backend.
- D2 (revised): **No new portal or roles.** The flow is added to the **existing** NMBA portal sidebar and scoped to the roles the portal already models — **Admin, State Nodal Officer, District Nodal Officer** (`src/lib/types.ts`). The single portal login (`/admin/login`) resolves the role from the mobile number. There is no Block login: block committees are registered by State/District officers.
- D3 (revised): This portal **is** the SAMAVESH NMBA module, so item 8 is delivered by this build. Only the standalone **NMBA mobile App** (item 7) is OUT of scope (separate codebase).

## Role model (revised)
| Role | Sidebar | Registers | Views | Reports |
|---|---|---|---|---|
| Admin | full portal nav + collapsible NAPDDR group | — (oversight) | all States/UTs/districts/blocks | all-India |
| State Nodal Officer | NAPDDR flow only | State committee (own state, one) · District & Block committees for any district in their state (picks district) | own state + its districts + blocks | own state |
| District Nodal Officer | NAPDDR flow only | District committee (own district, one) · Block committees for blocks in their district | own district + its blocks | own district |

Committee data still has three tiers (State/District/Block); the tiers are not roles. A State officer selects the district from a dropdown when registering district/block committees; a District officer's district auto-fills from the login.

## Current State (verified 2026-07-10)

- Admin login (mock, 10-digit mobile + any pw): `src/app/admin/login/page.tsx`
- Admin sidebar nav (`ADMIN_NAV`, 8 items): `src/components/admin-shell.tsx:25-32`
- TC login → cookie session → protected layout: `src/app/treatment-centre/login-otp/page.tsx`, `(protected)/layout.tsx`, `src/lib/treatment-centre/roles.ts`
- Cookie-session pattern (encode/decode, server guard, context provider): `roles.ts`, `session-context.tsx`
- Mock store (React state): `src/lib/treatment-centre/store.tsx`
- CSV/"XLS" Blob export (no lib): `src/components/treatment-centre/tc-list.tsx:84-95`
- State list + `STATE_DISTRICTS`: `src/lib/states.ts`
- NO State/UT/District/Block logins. NO PDF export lib. Block master data not needed (Block is a textbox).
- Test runner: none (`check` = lint + typecheck).

DS components reused: `PortalLoginShell`, `Button`, `Input`, `FormField`, `Alert`, `DemoFab`, `Toast`, `DataTable`, `Icon`, `AppSwitcher`, `ColorModeProvider`.

## Proposed Change

A shared **committee module** + a new **NAPDDR login area** for the three field tiers, plus injection of the same menu into the existing **Admin** shell for the all-India view.

```
napddr login (State/UT | District | Block) --> napddr/(protected) shell
  sidebar: "NAPDDR Three-Tier Committee"
    - State-Level Committee   (scoped)
    - District-Level Committee (scoped)
    - Block-Level Committee    (scoped)
Admin login --> admin shell --> collapsible "NAPDDR Three-Tier Committee" group (all-India, read + reports)
```

### Field spec per sub-menu

Auto-populated = filled from the logged-in session, read-only.

**i. State-Level Steering & Monitoring Committee**

| Field | Control |
|---|---|
| State | Auto (login) |
| Name of the Chief Secretary (Sh./Smt./Ms.) | Textbox |
| Name of the Member Secretary | Textbox |
| Designation of the Member Secretary | Textbox |
| Name of the Nodal Department for Drug Demand Reduction | Textbox |
| Date of Committee Formation | Date picker (DD/MM/YYYY) |
| Number of Committee Members | Numeric dropdown (0–50) |
| Committee Notification | PDF upload ≤10 MB |

**ii. District-Level Drug Demand Reduction Committee**

| Field | Control |
|---|---|
| State | Auto (login) |
| District | Auto (login) |
| Name of the Chairperson (Sh./Smt./Ms.) | Textbox |
| Designation of the Chairperson | Auto = "District Collector / Deputy Commissioner" |
| Name of the Member Secretary | Textbox |
| Designation of the Member Secretary | Auto = "District Social Welfare Officer" |
| Name of the Nodal Department for Drug Demand Reduction | Textbox |
| Date of Committee Formation | Date picker (DD/MM/YYYY) |
| Number of Committee Members | Numeric dropdown (0–50) |
| Committee Notification | PDF upload ≤10 MB |

**iii. Block-Level Drug Demand Reduction Committee**

| Field | Control |
|---|---|
| State | Auto (login) |
| District | Auto (login) |
| Block | Textbox |
| Name of the Chairperson (Sh./Smt./Ms.) | Textbox |
| Designation of the Chairperson | Auto = "Block Development Officer" |
| Date of Committee Formation | Date picker (DD/MM/YYYY) |
| Number of Committee Members | Numeric dropdown (0–50) |
| Committee Notification | PDF upload ≤10 MB |

**Minutes of Meeting** (appears under each sub-menu only after that tier's notification is uploaded):

| Field | Control |
|---|---|
| Name of the Committee | Read-only (derived from the uploaded committee) |
| Date of the Committee Meeting | Date picker (DD/MM/YYYY) |
| Minutes of the Meeting | PDF upload ≤10 MB |

Note: email says "Calendar (credit card format)" — implemented as standard DD/MM/YYYY date input.

### Role → visibility matrix

| Logged-in role | Fills | Can view (read-only) | Reports |
|---|---|---|---|
| Block user | own Block committee + minutes | own block | — |
| District user | own District committee + minutes | own district + all blocks in it | ✅ district scope |
| State/UT user | own State committee + minutes | own state + all its districts + blocks | ✅ state scope |
| Admin | — | all states/districts/blocks | ✅ all-India |

### Data model (`src/lib/committee/types.ts`)

```ts
export type CommitteeTier = "STATE" | "DISTRICT" | "BLOCK";

export interface UploadedFile {           // in-session; blobUrl revoked on reload
  name: string; sizeBytes: number; mime: string; blobUrl: string | null;
}
export interface MeetingMinute {
  id: string; committeeId: string; committeeName: string;
  meetingDate: string;                    // ISO
  file: UploadedFile;
}
export interface CommitteeRecord {
  id: string; tier: CommitteeTier;
  state: string; district?: string; block?: string;
  chiefSecretaryName?: string;            // STATE
  chairpersonName?: string;               // DISTRICT, BLOCK
  chairpersonDesignation?: string;        // auto: DC/DeputyCommissioner | BDO
  memberSecretaryName?: string;           // STATE, DISTRICT
  memberSecretaryDesignation?: string;    // STATE (textbox) | DISTRICT (auto: DSWO)
  nodalDepartment?: string;               // STATE, DISTRICT
  formationDate: string;                  // ISO
  memberCount: number;                    // 0–50
  notification: UploadedFile;
  minutes: MeetingMinute[];
  createdBy: string;                      // demo account id
  createdAt: string;
}
export interface NapddrSession {
  role: CommitteeTier; accountId: string;
  state: string; district?: string; block?: string; displayName: string;
}
```

Persistence: committee records + minutes metadata → localStorage (survive reload). Uploaded PDF bytes → in-session blob object URLs only; on reload show "file re-upload needed" placeholder. Seed data pre-loads committees across 2–3 states so views aren't empty.

### Report generation

`src/lib/committee/export.ts`:
- .XLS — reuse the existing Blob approach (tc-list.tsx pattern), no new dependency.
- .PDF — add `jspdf` + `jspdf-autotable`, client-side genuine downloadable .pdf. Consolidated table of committee notifications + meeting-minutes rows, filtered to caller's scope.

### Files to add / change

| File | Change |
|---|---|
| `src/lib/committee/types.ts` | New — data model |
| `src/lib/committee/session.ts` | New — roles, cookie `nmba_napddr_session`, encode/decode, guard helpers |
| `src/lib/committee/store.tsx` | New — localStorage store + context (add/list/scope-filter, add minutes) |
| `src/lib/committee/scope.ts` | New — visibility filter by session |
| `src/lib/committee/seed.ts` | New — seed committees/minutes across sample states |
| `src/lib/committee/export.ts` | New — XLS (Blob) + PDF (jsPDF) exporters |
| `src/lib/committee/masters.ts` | New — designation constants + demo accounts |
| `src/app/napddr/login/page.tsx` | New — PortalLoginShell login, demo accounts |
| `src/app/napddr/(protected)/layout.tsx` | New — cookie guard + providers + shell |
| `src/app/napddr/(protected)/committee/state/page.tsx` | New |
| `src/app/napddr/(protected)/committee/district/page.tsx` | New |
| `src/app/napddr/(protected)/committee/block/page.tsx` | New |
| `src/app/napddr/(protected)/reports/page.tsx` | New — consolidated report + export |
| `src/components/committee/committee-form.tsx` | New — tier-driven form |
| `src/components/committee/pdf-upload-field.tsx` | New — PDF-only, ≤10 MB validation |
| `src/components/committee/minutes-section.tsx` | New — gated on notification present |
| `src/components/committee/committee-list.tsx` | New — scoped read-only table |
| `src/components/committee/napddr-shell.tsx` | New — sidebar shell for the 3 sub-menus |
| `src/components/admin-shell.tsx` | Edit — add collapsible "NAPDDR Three-Tier Committee" group |
| `src/app/admin/(protected)/napddr/**` | New — admin all-India views + reports |
| `src/app/admin/login/page.tsx`, `treatment-centre/login-otp/page.tsx` | Edit — add 3rd tab |
| `package.json` | Edit — add `jspdf`, `jspdf-autotable` |
| `.claude/rules/portal-login-demos.md` | Edit — add NAPDDR demo accounts |

### Demo accounts (Demo@123 — existing portal login `/admin/login`)

| Role | Mobile | Scope |
|---|---|---|
| Admin (existing) | 9999999999 | all-India |
| State Nodal Officer (Maharashtra) | 9890123456 | state=Maharashtra |
| District Nodal Officer (Maharashtra/Pune) | 9890001234 | +district=Pune |

## Acceptance Criteria

1. Logging in with each of the 3 new demo accounts lands in the NAPDDR shell with a sidebar titled "NAPDDR Three-Tier Committee" showing the sub-menus permitted for that role.
2. Each tier's form renders exactly the fields in the tables above; auto-populated fields are read-only and correctly filled from the session (State/District/Block + fixed designations).
3. Number-of-members is a dropdown of 0–50; notification accepts only PDF ≤10 MB and rejects other types/oversize with an inline error.
4. "Minutes of Meeting" section is hidden until that tier's Committee Notification is uploaded, then allows meeting-date + PDF ≤10 MB upload; multiple minutes can be added.
5. Visibility matches the matrix: Block sees only its block; District sees its district + its blocks; State sees its state + districts + blocks; Admin sees all — verified with seed data spanning ≥2 states.
6. A State/District/Admin user can open Reports, see a consolidated table scoped to them, and download both .XLS and .PDF containing committee notifications + meeting-minutes rows.
7. Records and minutes metadata persist across a page reload (localStorage); uploaded PDF blobs are in-session and show a clear "re-upload" placeholder after reload.
8. AppSwitcher FAB renders on every NAPDDR page; demo panel present on the new login.
9. `npm run check` (lint + typecheck) passes; no `any`; DS components used, no hardcoded brand values.

## Out of Scope
- Standalone **NMBA mobile App** (item 7) — separate codebase. (The SAMAVESH NMBA module, item 8, **is this build** — this portal runs inside SAMAVESH.)
- Real backend, auth, or server-side file storage.
- Persisting uploaded PDF bytes across reload; unit-test infrastructure.
- Editing/deleting/approval workflow for submitted committees.
