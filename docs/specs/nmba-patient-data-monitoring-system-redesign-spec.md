# NMBA Patient Data Monitoring System — Redesign Spec

> **Status:** Draft v1 · 2026-06-23
> **Owner:** Akash (UX/UI) · MoSJE design team
> **Companion docs:** [Reverse-engineering analysis](./nmba-patient-data-monitoring-system-analysis.md) (every field/flow from the source recording) · [Existing clone spec](./nmba-treatment-centre-clone.md)
> **Source of truth:** live legacy portal `nmba.dosje.gov.in/treatment-centre` (backend **IDAMS**) + the 18-Jun-2026 walkthrough recording.
> **Build target:** `apps/portals/nmba/` on `@mosje/design-system` (Next 15, React 19, Tailwind v3, `data-color-mode` theming). **Synthetic data only.**

---

## 1. Why we're redesigning

The legacy "Patient Data Monitoring System" is a functional NMBA/NAPDDR de-addiction MIS used by treatment centres (IRCA, ODIC, CPLI, DDAC) and the Ministry (Under Secretary, DOSJE). It works, but the UI is a dated "GIGW-1.0 era" build: heavy green gradients, glossy skeuomorphic buttons, a yellow-green page wash, one-giant-scroll forms, jQuery DataTables, and accessibility gaps (chart aria, focus, contrast). We are re-skinning and re-architecting it onto the SAMAVESH design system **without changing the data contract** (hard "no data loss" requirement from the stakeholder).

### Goals
1. **Visual:** Replace the legacy look with SAMAVESH tokens, Noto Sans, flat Material Symbols icons. No tricolour stripe.
2. **Structural:** One form/list/shell engine that produces **per-scheme variants** (IRCA largest, ODIC smallest, DDAC aggregate).
3. **Usable:** Turn long scroll-forms into guided multi-step flows with inline validation and clear save points.
4. **Compliant:** WCAG 2.1 AA + GIGW; 22-language switch + accessibility widget retained.
5. **Faithful:** Every field, list column, report, and master in the legacy system is preserved.

### Non-goals (this spec)
- No backend/API/DB work (design + front-end clone only; mock data).
- No live OTP/SMS integration (mock OTP, as in current clone).
- Not changing the IDAMS field set or validation semantics.

---

## 2. Current state — what the clone already has (gap analysis)

The clone in `apps/portals/nmba/src/app/treatment-centre/` is ~95% of the centre-side flows. Summary (full inventory in the companion analysis doc):

| Area | Legacy / required | Clone status | Action |
|------|-------------------|--------------|--------|
| Login (Project-Id + OTP) | ✅ | ✅ mock OTP `123456` | Re-skin to `PortalLoginShell` (done); add password-tab parity (optional) |
| Role routing IRCA/ODIC/CPLI/DDAC | ✅ | ✅ session-from-ProjectId | Add **US/Ministry** role (missing) |
| Dashboard (KPIs + pie + bar) | ✅ | ✅ per-role cards + SVG charts | Add chart `aria-label`s; verify metrics vs legacy |
| IRCA base registration | ✅ 8 sections | ✅ 11-step wizard, 50+ fields | Keep; verify field parity |
| **IRCA clinical wizard (5 tabs)** | ✅ History→Dosage→Counselling→Referral/Home-visit→Diagnosis&Discharge | ❌ **missing** | **Build** — biggest gap |
| **Follow-up creation form (OPD basic)** | ✅ | ❌ list is read-only seed | **Build** form |
| **Readmission flow** (reopen reg by Reg No.) | ✅ | ❌ list read-only | **Build** reopen-prefill flow |
| Patient/Beneficiary lists + export | ✅ | ✅ search + CSV/Excel/copy | Migrate to DS data-table |
| ODIC drop-in + outreach registration | ✅ (smaller, no admission) | ✅ 3-step | Verify against live ODIC login |
| CPLI peer educators | ✅ | ✅ list + add/delete; **edit/upload/training are stubs** | Build edit + volunteer upload + training views |
| **NMBS Saptah activity *create* form** | ✅ event/participants/media/geotag | ❌ list read-only | **Build** create form (geotag + media) |
| Staff (Add Staff form) | ✅ | ⚠️ list only, no add form | **Build** add-staff form |
| Center Photos upload | ✅ | ⚠️ placeholder grid | **Build** upload + gallery |
| **Ministry: Reports** (Activity/Centre/State/Analytical) | ✅ | ❌ absent | **Build** (new role) |
| **Ministry: Masters Management** (Drugs/Education/…) | ✅ | ❌ absent | **Build** CRUD tables |
| Public site (Home/About/Contact) | ✅ | ⚠️ partial | Re-skin / confirm scope |
| Patient image upload (IRCA) | ✅ | ⚠️ input present, no handling | Wire `MediaUpload` |

> **Net:** the centre **data-entry skeleton exists**; the **IRCA clinical wizard, the create-forms (follow-up, readmission, Saptah activity, staff, photos), and the entire Ministry role (Reports + Masters)** are the redesign's build work.

---

## 3. Information architecture & roles

Five roles resolved at login. One shell, role-aware sidebar.

### 3.1 Treatment-Centre roles
- **IRCA** (Integrated Rehabilitation Centre for Addicts) — full admission + clinical record. **Largest flow.**
- **ODIC** (Outreach & Drop-In Centre) — drop-in/OPD, **no admission** → short registration, no clinical wizard. Has Outreach + Drop-in beneficiary paths.
- **CPLI** (Community Peer-Led Intervention) — peer educators & volunteers, training records.
- **DDAC** (District De-Addiction Centre) — **aggregator**: sees IRCA + ODIC + CPLI sub-flows nested.

Shared by all centre roles: NMBS Saptah Activity, Staff, Center Photos, Dashboard.

### 3.2 Ministry role
- **US / Under Secretary (DOSJE)** — oversight: analytics dashboard, Reports (read + export, ranking, drill-down), Masters Management (the dropdowns powering every form). No data entry except masters.

### 3.3 Navigation (role-aware sidebar)
```
IRCA      Dashboard · IRCA ▸ (Register · Patient List · Follow-ups · Readmissions · Awareness) · Saptah · Staff · Center Photos
ODIC      Dashboard · ODIC ▸ (Drop-in Reg · Outreach Reg · Beneficiary List · Outreach List · Follow-ups · Awareness) · Saptah · Staff · Center Photos
CPLI      Dashboard · CPLI ▸ (Peer Educators) · Saptah · Staff · Center Photos
DDAC      Dashboard · DDAC ▸ (IRCA ▸ · ODIC ▸ · CPLI ▸) · Saptah · Staff · Center Photos
US        Dashboard · Reports ▸ (Activity · Centre · State · Analytical) · Masters ▸ (Content · What's New · Category · Drugs · Education · Employment · Income · Marital · Occupation) · Saptah
```

---

## 4. Design-system audit (DS-first, mandatory)

Reuse from `@mosje/design-system`; build missing primitives **into the DS**, not per-app.

**Existing (reuse):** Button · Input · Textarea · Select · Checkbox · Radio · FormField · Alert · Badge · Search · MetricCard · Stepper · PortalLoginShell · DemoFab · DataTable · Icon · ColorModeProvider · AppSwitcher.

**Add to DS (needed by this portal, reusable across portals):**
| Component | Purpose | Notes |
|-----------|---------|-------|
| `MultiStepForm` / `WizardShell` | Stepper + per-step save + error focus | Generalise the clone's one-off `Wizard` |
| `TabbedFormShell` | The 5-tab clinical record pattern | Tabs with per-tab Save + Prev/Next |
| `RepeatableFieldArray` | +Add / −Remove row groups | Drug use, dosage log, counselling, home visits |
| `MultiSelectChips` | Multi-select with removable chips | Symptoms, comorbidities, referral services |
| `ConditionalField` | Reveal-on-value | "Previous treatment = Yes" → 3 fields |
| `DependentSelect` | Cascading options | State → District; masters-driven dropdowns |
| `MediaUpload` | Image/video upload + preview | Patient photo, activity media, centre photos |
| `GeotagField` | "Get Device Location" capture | NMBS activity |
| `ChartCard` (pie + bar) | Accessible charts | aria-label + sr-only data table; export menu |
| `DataTableToolbar` | Copy / Excel / CSV / search / show-N | Standardise the legacy DataTables pattern |
| `KpiCard` | Already `MetricCard` | Confirm trend + drill-down link variant |

**Page-level shells (DS templates, reused per role):**
- `PortalLoginShell` (login) · `DashboardShell` (app bar + role sidebar + role switcher) · `ListShell` (DataTable + toolbar) · `FormShell` (sectioned form / wizard).

---

## 5. Visual & brand direction

| Token area | Legacy | Redesign |
|-----------|--------|----------|
| Primary | glossy green gradients | `gov-blue #0373DF` brand tokens (`--ds-*`) |
| Page bg | yellow-green wash | `surface` / `surface-muted` neutrals |
| Buttons | beveled/gradient | flat DS Button (primary/secondary/ghost) |
| Type | mixed | **Noto Sans** only |
| Icons | clip-art + emoji | **Material Symbols Rounded** (wt 300, 24) via `<Icon>` |
| Cards | drop shadows | flat, `--border-radius-lg`, hairline `line` borders |
| Status | ad-hoc colors | DS semantic tokens (`approve`/`await`/`danger`) |
| Charts | Highcharts default | DS `ChartCard` (brand palette, dark-mode aware) |

Hard rules: **no tricolour stripe**, **National Emblem** logo/favicon, content max-width 1280px, mobile-first.

---

## 6. Screen-by-screen spec

> Field lists are authoritative in the [analysis doc §3–§8](./nmba-patient-data-monitoring-system-analysis.md). Below is the redesign treatment (layout, components, states).

### 6.1 Login
- `PortalLoginShell`: emblem + "Patient Data Monitoring System / MoSJE" header, Helpline 14446 chip, Digital-India strip.
- Tabs: **Password** (Username/Email + Password) and **Project-Id + OTP** (Send OTP → Enter OTP → Resend countdown → Verify). Mock OTP `123456`.
- `DemoFab` with the 4 demo roles (per `.claude/rules/portal-login-demos.md`).
- States: idle · validating · error (inline) · OTP-sent (countdown) · success → redirect to role dashboard.

### 6.2 Dashboard (per role)
- App bar: emblem + title · Last-Login · accessibility widget · **role/org switcher** · collapsible sidebar.
- `KpiCard` row (role-specific): IRCA → Patients / Re-Admissions / Follow-ups; DDAC → 6 aggregate cards; US → Total Registration / In-Patient / Re-Admission / Follow-up.
- `ChartCard` ×2: **Analytical Report** (pie, filter: Gender / Residence / Treatment) + **Drug Distribution** (bar). Both with `aria-label` + sr-only table + export.

### 6.3 IRCA — Patient Registration (`MultiStepForm`)
Convert the legacy scroll-form into a stepper with these step groups (fields per analysis §4.2):
1. Patient identity (admission date, name, gender, age, **photo via `MediaUpload`**)
2. Address (current/permanent + "same as" + State→District `DependentSelect` + residence)
3. Socioeconomic (marital, living, education, occupation, employment, income band, category)
4. ID (Govt-ID type + number, contact)
5. **Drug Use Details** (`RepeatableFieldArray`)
6. Injecting Behaviour (ever / last-3-month grid)
7. Treatment & Miscellaneous (referral, spend, money source `MultiSelectChips`, family/police history, motivation)
8. Diagnosis (provisional, ICD-11 `Select`) → **Submit**
- Validation: name alpha-only, age 1–120, contact 10-digit, no future dates, required-per-step gate, review step before submit.

### 6.4 IRCA — Clinical Wizard (`TabbedFormShell`) — **NEW**
Five tabs, each Save + Prev/Next (fields per analysis §4.2 tabs 1–5):
1. Previous Clinical & Treatment History (`MultiSelectChips` for symptoms/comorbidities; `ConditionalField` for prior-treatment details)
2. Dosage During Treatment (`RepeatableFieldArray`: date/complaints/medication/reason/physician-remark; cross-field rule "medication date > registration date")
3. Counselling Sessions (individual + family `RepeatableFieldArray`)
4. Referral Services + Home Visits (`MultiSelectChips` referrals; home-visit `RepeatableFieldArray`)
5. Diagnosis & Discharge (final dx ICD-11, comorbidities, discharge meds/remark/date, follow-up date) → **Submit**

### 6.5 IRCA — Lists, Follow-up, Readmission
- Patient List: `ListShell` + `DataTableToolbar` (search, copy/Excel/CSV), progress `Badge`, row → open record.
- **Follow-up form (NEW):** OPD-basic (Reg No. lookup → auto-fill last admission/discharge; medical review block; counsellor review). Adds to Follow-up List.
- **Readmission (NEW):** reopen registration by Reg No., pre-filled demographics, new admission cycle.

### 6.6 ODIC / CPLI / DDAC
- **ODIC:** short 3-step beneficiary registration (Drop-in + Outreach), no clinical wizard; lists + follow-ups. *Verify exact fields against live ODIC login.*
- **CPLI:** peer-educator list; **build** Add/Edit + Volunteer upload + Training records (currently stubs).
- **DDAC:** reuse IRCA/ODIC/CPLI screens under nested nav; aggregate dashboard.

### 6.7 Shared — Saptah, Staff, Photos
- **NMBS Saptah Activity (NEW form):** event, activity, date, coordinating dept, participants (total/male/female), educational institutions, **media upload**, completion status, **`GeotagField`**. List with filters + edit/delete. **Time-gated** (enabled around NMBS week ~26th); show a clear disabled/empty state with explanation when closed — but keep historical data visible.
- **Staff (NEW form):** designation/name/mobile/education + list.
- **Center Photos (NEW):** `MediaUpload` gallery (distinct from Saptah/outreach photos).

### 6.8 Ministry (US) — Reports & Masters — **NEW role**
- **Reports:** Activity / Treatment-Centre / State / Analytical. Each `ListShell` with filters (State, District, Centre, From/To date), centre-type column (IRCA/ODIC/DDAC/CPLI), beneficiary-count drill-down, ranking, export.
- **Masters Management:** CRUD tables for Drugs, Category, Education, Employment, Income, Marital, Occupation, Content, What's New (with Active toggle). Each: `DataTableToolbar` + Add + row edit.

---

## 7. Cross-cutting requirements

- **Accessibility (WCAG 2.1 AA / GIGW):** semantic landmarks, keyboard-navigable repeatable rows + wizard, visible focus, AA contrast (fix legacy faint section labels), chart `aria-label` + sr-only tables, real `alt` on media, skip-to-content first focusable.
- **i18n:** retain 22-language switch; copy externalised; numerals/dates `en-IN`.
- **Data contract:** field names, options, and validation mirror IDAMS (**no data loss**). Hidden/time-gated forms keep stored data and stay in reports.
- **AppSwitcher:** render per `.claude/rules/portal-appswitcher.md`.
- **Responsive:** mobile-first; wizard collapses to single-column; tables become horizontally scrollable cards.

---

## 8. Open questions / live-verification checklist
Use the dummy logins (IRCA001 / ODIC001 / CPLI001 / DDAC001 — OTP `123456`, sent to registered mobile) to confirm:
1. **ODIC** exact registration fields & whether it has any follow-up/clinical step.
2. **CPLI** full flow (volunteer upload format, training-record fields).
3. **DDAC** — does it have own screens or purely aggregate?
4. **US dashboard** scheme-type breakdown cards (IRCA/ODIC/DDAC counts).
5. NMBS activity **time-gating** behaviour (what the closed state shows).
6. Any **password-login** accounts vs OTP-only (live password login errored for these IDs → they're OTP accounts).

*(Login requires an OTP to a registered mobile — have a credential holder drive this, or screen-share, since the agent must not trigger/receive OTPs.)*

---

## 9. Milestones
1. **M1 — Foundation:** DS primitives (WizardShell, TabbedFormShell, RepeatableFieldArray, MultiSelectChips, ConditionalField, DependentSelect, MediaUpload, GeotagField, ChartCard, DataTableToolbar). Re-skin shells + login + dashboard.
2. **M2 — IRCA complete:** registration parity + **clinical wizard** + follow-up + readmission.
3. **M3 — ODIC/CPLI/DDAC:** verify vs live, finish CPLI stubs, DDAC aggregation.
4. **M4 — Shared:** Saptah create form, Staff form, Center Photos.
5. **M5 — Ministry role:** Reports + Masters Management.
6. **M6 — Compliance pass:** a11y audit (`accessibility-auditor`), i18n, GIGW, responsive QA.

## 10. Acceptance criteria
- Every legacy field/column/report/master present (analysis doc = checklist).
- All 5 roles navigable from one shell; correct role-gated nav.
- No green-legacy styling; 100% SAMAVESH tokens + Noto Sans + Material Symbols; no tricolour stripe; National Emblem logo.
- a11y: keyboard-complete wizard + tables, AA contrast, chart aria — passes `accessibility-auditor`.
- Mock data only; no real PII; OTP mocked.
