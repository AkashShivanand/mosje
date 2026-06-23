# SPEC — NMBA Treatment-Centre "Patient Data Monitoring System" clone & redesign (4 roles)

> Source of truth for the build→review loop. Build target: `apps/portals/nmba`.
> Decisions locked: **design-system rebuild** · **synthetic data only** · **reference-role-first phasing (IRCA)** · **interactive with in-session mock data** · scope = **everything post-login** (exclude public marketing pages).

## Context

Clone the post-login experience of the legacy NMBA Treatment-Centre portal
(`https://nmba.dosje.gov.in/treatment-centre/*`, branded "Patient Data Monitoring
System", IDAMS backend) and rebuild it on `@mosje/design-system` with synthetic
data, as a redesign/dev-handoff artifact. Lives as a **third pillar** inside
`apps/portals/nmba` alongside the existing public + admin pillars.

Four roles: **IRCA, ODIC, CPLI, DDAC**. One shared shell; role implied by the
login Project-Id prefix.

## Hard rules

- No real patient PII anywhere — all records synthetic.
- `@mosje/design-system` components only; no legacy green/tricolour chrome.
- National Emblem logo; Noto Sans; AppSwitcher on every page; WCAG 2.1 AA / GIGW.
- TypeScript strict, no `any`. Named exports. Reuse existing nmba patterns.

## Verified live-site state (inventoried 2026-06-22)

**Auth:** `/treatment-centre/login-otp` — enter Project Id (e.g. `IRCA001`) → "Send OTP"
→ enter OTP → "Verify & Login" → `/treatment-centre/patient/dashboard`. Demo OTP for
all accounts = `123456`. Logout `/treatment-centre/logout`. Demo accounts:
`IRCA001 / ODIC001 / CPLI001 / DDAC001`, OTP `123456`.

**Shared chrome:** top header (emblem, "Patient Data Monitoring System", Last Login,
Ministry dropdown `(TC)`, accessibility widget, hamburger) + left role-aware sidebar +
support footer. Dashboard = stat cards + "Analytical Report" pie (filter: Gender /
Place of Residence / Treatment Taken) + "Drug Distribution" bar. List tables = DataTables
pattern (Copy/Excel/CSV export, Show N entries, Search, sortable headers, status badges,
row drill-down/actions).

**Per-role map:**

| Role | Center | Dashboard cards | Role nav | Entity |
|------|--------|-----------------|----------|--------|
| IRCA | 654 | Total Patients, Total IRCA Patients, Re-Admissions, Follow-ups | Patient Registration & Details, Patient List, Follow-Up List, Readmission List, Awareness Generation Program | Patient |
| ODIC | 653 | Total Beneficiaries, Total ODIC Beneficiaries, Re-Admissions, Follow-ups | Outreach Patient reg, Drop-in/ODIC Beneficiary Registration, Follow-up ODIC, Awareness, Patient List, Outreach List | Beneficiary |
| CPLI | 656 | Total Peer Volunteers Trained | Peer Educator List → Add, Upload Volunteers, View Training, View Volunteers, Edit, Delete | Peer Educator/Volunteer |
| DDAC | 651 | Total Beneficiaries, Total IRCA Patients, Total ODIC Beneficiaries, Total Peer Volunteers Trained, Re-Admissions, Follow-ups | nested IRCA + ODIC + CPLI groups (district aggregator) | District rollup |
| Shared | — | — | Activity List, Staff List, Center Photos, Nasha Mukt Bharat Saptah 2026 | — |

**IRCA registration form (richest screen — 8 sections):**
1. **Details of the Patient** — Date of Admission (date), Name (text), Gender (Male/Female/Transgender), Age (text), Upload Patient Image (file), Current Address (textarea), Same as Current Address (checkbox), Permanent Address (textarea), State (35 states/UTs), District (depends on state), Place of Residence (Rural/Urban), Marital Status (Never Married/Married/Divorced/Separated/Separated due to Drug Use/Widow-Widower/Cohabiting), Living Arrangements (Joint Family/Nuclear Family/With Friend-Hostel/Alone/Any Other), Education (Professional Degree/Graduate/Intermediate-Diploma/High School/Middle School/Primary School/Illiterate), Occupation (11 options), Employment (Currently Unemployed/Never Employed/Employed/Self-Employed/House person/Any Other/Not Known), Income (<7500/7501-20000/20001-35000/35001-45000/45001-60000/>60000), Category (Unreserved/OBC/SC/ST), Contact Number (tel), Government ID (Aadhaar/PAN/Passport/Driving Licence/Voter ID/Ration card).
2. **Drug Use Details** — repeatable rows: Drug (15 options: Alcohol, Cannabis, Synthetic Cannabinoids, Opioids, Sedatives, Cocaine, Stimulants, Synthetic cathinone, Caffeine, Hallucinogens, Nicotine, Volatile Inhalants, MDMA, Dissociative Drugs, Other), Age of First Use (number), Reason for Initiation (Anxiety/Depression, Loneliness, Curiosity, Peer Pressure, Individual Problem, Family Problem, Occupation-Related, Adverse Childhood Experiences, Any other Social Problem), Use in Last 3 Months (Y/N), Daily/Near-Daily (Y/N), Duration of Regular Use months (number); Add/remove row.
3. **Injecting Behaviour** — Intravenous Drug Use Ever / Last 3 Months; Sharing Needles Ever / Last 3 Months.
4. **Sexual Behaviour** — Sexual Practices; Ever had HCV testing (Test History + Result); Ever had HBV testing (Test History + Result).
5. **ASSIST Score** — ASSIST Score for Alcohol Use; ASSIST Score for Other Drugs.
6. **Treatment Details** — Previous Treatment for Substance use; Source of Referral; Ever hospitalized.
7. **Miscellaneous** — Average Daily Expenditure on Drugs; Source of Money for Drug Use; Ever apprehended by police; Any history of substance use in family; Days since last consumed; Patient's Motivation during admission.
8. **Diagnosis** — Provisional Diagnosis (ICD-11).

All master-data dropdowns are **identical across roles** → one shared dataset.

**ODIC registration (Drop-in Centre / Beneficiary):** "Details of DIC" (Date of
Registration, Referred By [Self/Family/Friends/Private Practitioner/Hospital/Referral/
Helpline/Awareness/Recovered User/other]) + "Personal Details" (Name of Beneficiary,
Age, State, District, Place of residence, Current/Permanent Address + same-as, Contact,
Gender, Education, Occupation, Employment, Income, Marital, Category, Living Arrangements,
Government ID) + Drug Use Details. Two registration paths: Outreach + Drop-in Centre.

**CPLI peer-educator list:** columns S.No, Name of Peer Educator, Number of Peer
Volunteers, Address, Action (Upload Volunteers / View Training / View Volunteers / Edit /
Delete) + "Add New Peer Educator".

## Architecture

`apps/portals/nmba/src/app/treatment-centre/`
- `login-otp/page.tsx` — mock OTP login. Project Id → Send OTP reveals OTP field → OTP
  `123456` → set cookie `nmba_tc_session` (role + center id) → redirect to dashboard.
  **Demo Credentials panel** per `.claude/rules/portal-login-demos.md` (IDs + OTP, Use buttons, closed by default, `demo:fill` event).
- `(protected)/layout.tsx` — read cookie, redirect to login if absent; render
  `TreatmentCentreShell` (top header + role-aware sidebar).
- `(protected)/dashboard/page.tsx` — role-aware stat cards + Analytical Report + Drug Distribution.
- Role route trees, clean kebab routes, legacy URL documented as mapping.
- `src/lib/treatment-centre/` — master-data constants, synthetic records per role (~3–6
  each), in-session mock store (React context) so create/list flows update live (resets on reload).

Reuse: `admin-shell.tsx` → `TreatmentCentreShell`; `data-table.tsx` for lists;
`admin/(protected)/layout.tsx` cookie pattern (cookie `nmba_tc_session`); `admin/login/page.tsx`
mock-OTP + `demo:fill`; `@mosje/design-system` (MetricCard, FormField, Input, Select,
Checkbox, Radio, Search, Badge, Card, Button, Alert).

**Interactivity:** working dropdowns, repeatable rows, client-side validation, submit into
in-session store (no backend, no cross-reload persistence).

## Phasing / child work-items

- **W1 Shell + infra** (Critical): mock-OTP login (role routing) + protected layout + role-aware sidebar + dashboard framework + mock-data infra + reusable DS form/table primitives.
- **W2 IRCA end-to-end** (Critical, reference impl): dashboard, 8-section registration, patient/follow-up/readmission lists, awareness program.
- **W3 ODIC** (High): dashboard (Beneficiary), outreach + drop-in registration, follow-ups, lists.
- **W4 CPLI** (High): peer-educator CRUD (list, add, upload volunteers, view training/volunteers).
- **W5 DDAC** (High): 6-card rollup dashboard + nested IRCA/ODIC/CPLI submodules.
- **W6 Shared secondary pages** (Medium): Staff List, Center Photos, Activity List, Nasha Mukt Bharat Saptah 2026.

Dependency: W1 → W2 → {W3, W4, W5(also needs W3,W4)}; W1 → W6.

## Acceptance criteria

1. Any `/treatment-centre/(protected)/*` route without `nmba_tc_session` cookie redirects to `/treatment-centre/login-otp`.
2. Each of the 4 demo IDs logs in (OTP `123456`) to a role-correct dashboard (IRCA 4 cards / ODIC 4 Beneficiary cards / CPLI 1 card / DDAC 6 cards).
3. Sidebar nav matches the audited per-role structure; DDAC nests IRCA+ODIC+CPLI.
4. IRCA registration renders all 8 sections with captured fields/options; repeatable Drug-Use rows add/remove; client-side validation blocks invalid submit; valid submit adds a synthetic row visible in Patient List within the session.
5. All list tables support search + sort + export buttons + status badges, synthetic data only.
6. Zero real patient PII in repo or build.
7. Built entirely with `@mosje/design-system`; no legacy green/tricolour chrome; National Emblem logo; AppSwitcher present; Noto Sans.
8. WCAG 2.1 AA / GIGW pass on login, dashboard, IRCA registration.
9. `npm run lint`, `npm run typecheck`, `npm run build` pass for `apps/portals/nmba`; no `any`.

## Out of scope

Real backend/API/DB; real SMS-OTP; cross-reload persistence; public marketing pages
(Home/About/Contact); migrating existing admin/public pillars; pixel-identical legacy styling.

## Rollback

Additive: new `treatment-centre/` route tree + `lib/treatment-centre/`. Revert = delete dirs / revert PR.
