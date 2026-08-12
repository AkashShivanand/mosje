# E-Anudaan Admin — Recon Inventory

**Domain:** `https://eanudaan-admin-dev.mosje.in` (Dev)
**Captured:** 2026-08-12, 13 of 14 supplied logins, 90 screens
**Roles seen:** 10 chain officers (PD ×5, IFD ×5) + 2 PMU field officers
**App title:** `E-Anudaan | Admin`
**Stack signals:** Create React App (`/static/js/main.<hash>.js`), **Mantine UI**, Poppins + Noto Sans,
Font Awesome 6 (CDN). Client-side routing; deep links work while the session token is present.
The **login shell is SAMAVESH** (Tailwind, `#003366`) while the **interior is Mantine** — two
different design languages in one app. Only one scheme is live: **`SHRESHTA_M2`**.

> **Method.** Captured with `tools/design-audit` (`projects/e-anudaan/`) — one keep-alive
> browser context per role, full-page PNG + computed-CSS JSON per route. Artifacts in
> `projects/e-anudaan/captures/live/` (gitignored). Route discovery reads the live sidebar,
> so **this inventory reflects what each role can actually reach**, not the route table in
> the JS bundle. The bundle declares 136 admin routes; only 44 are reachable from a nav.

---

## Coverage and gaps (read this before trusting anything below)

| Role | Login | Screens | Note |
|---|---|---|---|
| `pd-aso` … `pd-ds` | ✅ | 9 each | complete |
| `pd-js` | ✅ | 10 | adds Audit Trail |
| `ifd-aso` … `ifd-ds` | ✅ | 7 each | complete |
| `ifd-js` | ✅ | 8 | adds Audit Trail |
| `pmu-field-officer` (9200000812) | ✅ | 4 | complete |
| "JS – Finance" (9000000033) | ✅ | 4 | **mislabelled in the source sheet** — this account is a *PMU Field Officer*; its nav is byte-identical to `pmu-field-officer`. There is no JS-Finance role behind it. |
| **`programme-director` (9200000811)** | ✅ | **0** | ⚠️ **UNCAPTURED.** Login succeeds and lands on `/dashboard/sm2/pd`, but that page **reliably crashes the Chrome renderer** (`Target page, context or browser has been closed`) within ~1.5 s, before the session can even be banked. Survived raising the JS heap to 4 GB, `--disable-dev-shm-usage`, blocking images/media/fonts, and racing a navigation away from the landing route. **The single most important role — final sanctioning authority — has no observed screens.** |
| **`pmu-field-officer-2` (9200000032)** | ❌ | 0 | Login rejected repeatedly, alone and in a batch — so not rate-limiting. Credential is likely wrong or the account is disabled. |

**Nothing below is inferred unless a section says so.** The two gaps above are the whole
inference surface, and both are called out again in "Inferred" at the end.

---

## Global Chrome (every page)

### 1. Accessibility bar (top, full-bleed)
Dark navy band. Left: Indian flag icon + `Government of India` (external-link glyph). Right:
`Skip to Main Content` · `A-` `A` `A+` · contrast toggle · accessibility glyph · `English ▾`.
This is the **SAMAVESH `AccessibilityBar`** — same component the estate already ships. Renders
in **Noto Sans 14/20**, white on navy.

### 2. Masthead (white, below the bar)
Left: National Emblem, a yellow **`BETA`** pill, `Government of India` (small) over
**`Ministry of Social Justice & Empowerment`** (bold, ~20px).
Right: notification bell with a red count badge (`3`), then a circular initials avatar (`RB`)
and a two-line identity block — **`Ritwik Bhattacharya`** over `(ASO - Program Division)`.
The parenthesised role string is how the interior tells you which grade you are.

### 3. Left sidebar (~236px, white, sticky)
Flat list, no groups. Active item is tinted with a left accent. Icons are Font Awesome.
**The nav is role-specific** — see §4. Item order is stable across roles.

### 4. Sidebar per role (verbatim labels)

| Role | Sidebar items, in order |
|---|---|
| PD `aso`/`so`/`us`/`ds` | Dashboard · NGO Directory · **SHRESHTA M2 — `<GRADE>`** · Sanctioned Applications · Rejected Applications · Forwarded Applications · PD Queries · Reports & Analytics · Notifications |
| PD `js` | …same… + **Audit Trail** (before Notifications) |
| IFD `aso`…`ds` | Finance Dashboard · NGO Directory · Finance Rejected · Finance Queries · **SHRESHTA M2 — IFD-`<GRADE>`** · Reports & Analytics · Notifications |
| IFD `js` | …same, labelled **SHRESHTA M2 — JS-IFD**… + **Audit Trail** |
| PMU field officer | NGO Directory · **SHRESHTA M2 — PMU Inspection** · Notifications |

**Asymmetry worth knowing before building:** every PD grade's "SHRESHTA M2 — `<GRADE>`" link
points at the *same* route, `/dashboard/pd/us/all-applications` — one shared Application
Explorer. Every IFD grade gets its *own* worklist at `/dashboard/sm2/ifd<grade>`. Likewise
`Sanctioned` and `Forwarded` are PD-only; IFD has neither. The two chains are **not** mirror
images, and modelling them as one parameterised tree would be wrong.

---

## 1. PD grade dashboard — `/dashboard/pd/<grade>`

H1 **`My Action Queue`**, with a `⟳ Refresh` button top-right.
Sub-line: *"Every application awaiting your action — across all your schemes and both workflows ·
Role: `ASO - Program Division`"* (the role string is a link).

**KPI row — four cards** (icon, label, big value, caption):

| Label | Value (pd-aso) | Caption |
|---|---|---|
| Awaiting My Action | `2,634` | Files in your queue now |
| Grant Value Sought | `₹888.31 Cr` | Total requested in queue |
| Schemes | `1` | 1182 NGOs · 28 states |
| Pending > 7 days | `2,634` | Oldest — clear these first |

**Two panels below, side by side:**
- **`Queue by Scheme`** — horizontal bar list; single row `SHRESHTA_M2` … `2,634` (violet bar).
- **`Pending — Ageing`** — three rows `0–3 days` `0`, `4–7 days` `0`, `Over 7 days` `2,634`
  (red bar), then a red inline alert: *"2,634 applications pending beyond 7 days"*.

**`Applications Awaiting Action`** table card. Toolbar: search input placeholder
`Search by GIA ID or NGO…` and an `All types` select. Right-aligned count *"Showing 1–12 of 2,634"*.

Columns: `GIA ID` · `NGO` · `SCHEME` · `TYPE` · `FY` · `REQUESTED` · `STATUS` · `ACTION`

Real rows (verbatim):

| GIA ID | NGO | Scheme | Type | FY | Requested | Status |
|---|---|---|---|---|---|---|
| `UAT/SUBMITTED` | UAT Test Organisation | SHRESHTA_M2 | — | 2026-27 | ₹10.00 L | Submitted / ASO |
| `GIA/2026-27/SHRESHTA_M2/PIPELINE/01` | Demo NGO (Pipeline) | SHRESHTA_M2 | — | 2026-27 | ₹5.00 L | Submitted / ASO |
| `LGCY/90963` | Shri Mukhtiar Singh Samriti Shiksha Samiti | SHRESHTA_M2 | — | 2026-27 | ₹76.98 L | Submitted / ASO |
| `LGCY/90816` | balram adarsh vidyalaya samiti | SHRESHTA_M2 | — | 2026-27 | ₹44.57 L | Submitted / ASO |
| `LGCY/91397` | APANG MAHILA MANDAL AMARAVATI | SHRESHTA_M2 | — | 2026-27 | ₹65.73 | Submitted / ASO |
| `LGCY/90839` | GAYANDEEP PUBLIC SCHOOL SAMITI PILIBANGA | SHRESHTA_M2 | — | 2026-27 | ₹43.69 L | Submitted / ASO |

Status badge is **amber** and reads `<status> / <holding grade>` — e.g. `Submitted / ASO`.
Action cell is a link-style `↗ Review`.
Pagination: `Previous · 1 2 3 4 5 … 220 · Next`.
Card footer tip: *"Tip: use the scheme sections in the sidebar to browse a single scheme, or
Sanctioned / Rejected / Forwarded for those outcomes."*

The `TYPE` column was `—` on every observed row.

## 2. PD queries — `/dashboard/pd/<grade>/queries`
H1 **`PD Queries`**. **Empty on every PD grade captured** — no table renders, page height 1135
(the empty-state minimum). Build the empty state; the populated shape is unobserved.

## 3. PD rejected — `/dashboard/pd/<grade>/rejected`
H1 **`Returned to State GIA`**, section heading `Applications`.
Columns: `GIA ID` · `NGO` · `SCHEME` · `STATE / DISTRICT` · `RETURNED ON` · `REASON` · `QUERY` · `ACTION`
One observed row keyed `GIA/2026-27/NAPDDR/KA/00112`; action is `View`.
Note the GIA ID namespace is **NAPDDR**, not SHRESHTA_M2 — legacy data from another scheme.

## 4. Forwarded — `/dashboard/pd/forwarded`
H1 **`Forwarded Applications`**, section `Forwarded Queue`.
Columns: `GIA ID` · `NGO NAME` · `SCHEME` · `STATE` · `FORWARDED ON` · `CURRENT STATUS` · `ACTION`
Empty in every capture.

## 5. Application Explorer — `/dashboard/pd/us/all-applications`
Reached from every PD grade's "SHRESHTA M2 — `<GRADE>`" item.
H1 **`All Applications`**, section `Application Explorer`.
KPI strip: `11,534` · `5,457` · `1,784` · `3`.
Columns: `GIA ID` · `NGO` · `FY` · `INSTALMENT` · `REQUESTED` · `STATUS` · `ACTION` (`Review`).
Pagination to page `220`.

## 6. Sanction Register — `/dashboard/pd/us/sanctioned`
H1 **`Sanctioned Applications`**, section `Sanction Register`. KPIs `1,784` and `₹174.55 Cr`.
Columns: `GIA ID` · `NGO` · `FY` · `SANCTIONED` · `SANCTION DATE` · `ORDER NO.` · `STATUS` · `ACTION` (`View`).
Pagination to page `149`.

## 7. IFD dashboard — `/dashboard/finance/<grade>`
H1 **`Finance / IFD Dashboard`**, section **`Payment Processing Queue`**.
Columns: `GIA ID` · `NGO NAME` · `SCHEME` · `STATE` · `DISTRICT` · `SUBMISSION` · `SANCTIONED` · `STATUS` · `ACTION`
This is a *payments* view — distinct from the IFD review worklist in §8.

## 8. IFD review worklist — `/dashboard/sm2/ifd<grade>`
H1 **`SHRESHTA Mode-2 — IFD-ASO`** (grade substituted), section `Applications`.
Columns: `GIA ID` · `NGO NAME` · `FY` · `BENEFICIARIES` · `DOCS` · `STATUS` · `ACTION`
This is where the IFD chain actually works a file.

## 9. Finance queries / Finance rejected — `/dashboard/finance/<grade>/{queries,rejected}`
H1 **`Finance Queries`** / equivalent. Empty in every capture.

## 10. NGO Directory — `/dashboard/ngo-directory`
H1 **`NGO Directory`**. Available to every role including PMU.
Columns: `NGO` · `LOCATION` · `APPS` · `SANCTIONED` · `TOTAL GRANT` · `ATTENDANCE` · `LAST INSPECTION`
Pagination to page `198`.

## 11. Reports & Analytics — `/dashboard/sm2/reports`
H1 **`Reports & Analytics`**.
Columns: `NGO / VO` · `APPLICATION` · `FY` · `REQUESTED (₹)` · `SANCTIONED (₹)` · `STATUS`

## 12. Audit Trail — `/dashboard/sm2/audit` (JS grades only)
H1 **`Audit Trail`**. The **tallest page in the portal at 9,622 px** — a long unpaginated log.
Columns: `TIMESTAMP` · `APPLICATION` · `USER` · `ROLE` · `ACTION` · `REMARKS`
This is the vocabulary source for the workflow's `AuditAction` set — mine it before modelling.

## 13. PMU inspection worklist — `/dashboard/sm2/pmu`
H1 **`PMU Inspection — SHRESHTA Mode-2`**, section `Awaiting inspection`. Page height 2,873.
Columns: `REFERENCE` · `NGO` · `FY` · `ACTION`

## 14. PMU field dashboard — `/dashboard/pmu/field`
H1 **`Inspection Dashboard`**. KPI strip `6` · `3` · `22`. Section `Inspection Assignments`.
Columns: `NGO NAME` · `SCHEME` · `VISIT TYPE` · `SCHEDULED DATE` · `STATUS`

## 15. Notifications — `/dashboard/notifications`
H1 **`Notifications`**. Empty in every capture; no table rendered.

---

## Inferred (NOT observed — build a sensible mock and mark it)

- **Every Programme Director screen.** `/dashboard/sm2/pd` and whatever its nav exposes. The
  PD sanction decision (YES → sanction order, NO → return via SO-PD) is the spine of the whole
  workflow and **we have not seen a pixel of it.** Model it from
  `docs/specs/shreshta-mode2-portal-spec.md` §5.2 and flag every screen as inferred.
- **Every `/review/:id` and `/approve/:id` detail screen.** No nav links to them; they are
  reached by the `Review` action in a table row, which the declarative crawl cannot follow.
  These are the highest-value screens in the portal and need an interactive capture driver
  (the `tools/design-audit/projects/tg/capture_flows.py` pattern) before they are built.
- **Populated states for Queries, Forwarded, Finance Queries/Rejected and Notifications** —
  observed only empty.
- **`pmu-field-officer-2`** — credential rejected; no screens.
- **The SO-PD returned-case role.** No supplied login corresponds to it, and no captured nav
  exposes it. Its existence is inferred from the BRD, not from the live app.

## Not in scope for this clone (present in the app, deliberately excluded)
`/dashboard/avyay/**`, `/dashboard/sm1/**` (SHRESHTA Mode-1 scholarships), `/dashboard/smile*`,
`/dashboard/dwo/**`, `/dashboard/swo/**`, `/dashboard/masters`, `/dashboard/admin`,
`/user-management`, `/role-management`, `/admin/settings`. None are reachable from any supplied
login's nav, so none were captured.

---

## Route summary

| Route | Screen | Roles |
|---|---|---|
| `/login` | SAMAVESH login (mobile + password, no CAPTCHA) | all |
| `/dashboard/pd/<grade>` | My Action Queue | PD ×5 |
| `/dashboard/pd/<grade>/queries` | PD Queries (empty) | PD ×5 |
| `/dashboard/pd/<grade>/rejected` | Returned to State GIA | PD ×5 |
| `/dashboard/pd/forwarded` | Forwarded Applications | PD ×5 |
| `/dashboard/pd/us/all-applications` | Application Explorer | PD ×5 (shared) |
| `/dashboard/pd/us/sanctioned` | Sanction Register | PD ×5 (shared) |
| `/dashboard/finance/<grade>` | Finance / IFD Dashboard — Payment Processing Queue | IFD ×5 |
| `/dashboard/finance/<grade>/queries` | Finance Queries (empty) | IFD ×5 |
| `/dashboard/finance/<grade>/rejected` | Finance Rejected (empty) | IFD ×5 |
| `/dashboard/sm2/ifd<grade>` | SHRESHTA Mode-2 — IFD-`<GRADE>` worklist | IFD ×5 |
| `/dashboard/sm2/pmu` | PMU Inspection worklist | PMU |
| `/dashboard/pmu/field` | Inspection Dashboard | PMU |
| `/dashboard/ngo-directory` | NGO Directory | all |
| `/dashboard/sm2/reports` | Reports & Analytics | all |
| `/dashboard/sm2/audit` | Audit Trail | JS grades only |
| `/dashboard/notifications` | Notifications (empty) | all |
| `/dashboard/sm2/pd` | Programme Director console | **UNCAPTURED — renderer crash** |
