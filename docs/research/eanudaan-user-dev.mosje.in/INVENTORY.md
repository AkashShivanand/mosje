# E-Anudaan User (NGO) — Recon Inventory

**Domain:** `https://eanudaan-user-dev.mosje.in` (Dev)
**Captured:** 2026-08-12, signed in as an NGO applicant (`LGN3712`), two sessions
**App title:** `E-Anudaan | User`
**Stack signals:** Vite (`/assets/index-<hash>.js`), **Tailwind**, Lexend + Noto Sans,
react-toastify, Bhashini translation plugin loaded from `index.html`. Session is held in
**`sessionStorage`** (`ts:user:userToken`, `ts:user:userInfo`) — not cookies, not localStorage,
so it does not survive a new tab. Footer: *"© 2026 - Copyright UX4G … Powered by NeGD | MeitY"* —
this portal is built on **UX4G**, unlike the Mantine admin.

> ⚠️ **PII — read before using any of this.** The demo account is pre-filled with a **real
> registered NGO's** details: organisation name, NGO-Darpan ID, registration number, postal
> address, mobile, email, bank account, and uploaded PDFs. **None of it is reproduced in this
> file**, and none of it may reach the clone. Field *shapes* are documented; values are not.
> The clone seeds fictional NGOs.

> **Method.** The login is CAPTCHA-protected, so this portal could not be captured by the
> `tools/design-audit` engine. A human signed in and the authenticated session was driven
> read-only: navigation and DOM extraction only. **Nothing was submitted and no draft was
> created** — verified against the network log, which shows zero API calls during the entire
> wizard walkthrough (every step transition is client-side).

---

## Global chrome

1. **Accessibility bar** — identical SAMAVESH component to the admin portal: `Government of India`,
   `Skip to Main Content`, `A-` `A` `A+`, contrast toggle, accessibility glyph. A round violet
   **accessibility FAB** sits bottom-right (UX4G widget).
2. **Masthead** — National Emblem, `BETA` pill, `Ministry of Social Justice & Empowerment`.
   Right: notification bell with unread count, circular initials avatar, then the NGO name over
   a `(NGO)` role line.
3. **Left sidebar** (collapsible — there is a "Toggle sidebar collapse" control):
   `Dashboard` · `My Applications` · `Deficiencies` · `Select Scheme` · `Project Location Change` ·
   `My Bank Accounts` · `Notifications` · `Weekly Attendance` · `Attendance Master` · `CCTV Setup`
4. **Footer** — `© 2026 - Copyright UX4G. All rights reserved. Powered by NeGD | MeitY Government
   of India ® 2026 UX4G`, with `Terms & Conditions` · `Privacy Policy`.

Below 768px the sidebar collapses behind a hamburger and the masthead stacks.

---

## 1. Dashboard — `/ngo/dashboard`

Greeting **`Good evening, <first name> 👋`** (time-of-day aware), then a date line
`Wednesday, 12 August 2026 · <NGO name>`. Primary action **`+ New Application`**.

**KPI cards (2×2):** `Total Applications` 68 · `In Review` 31 · `Needs Action` 0 ·
`Sanctioned` 36. Sanctioned renders in green; Needs Action carries a warning glyph.

**`Application Status`** — donut chart with a legend carrying count and percentage:
`Sanctioned 36 (53%)` · `Submitted 17 (25%)` · `Draft 12 (18%)` · `AVY SUBMITTED 1 (1%)` ·
`Under Ministry Review 1 (1%)` · `Rejected 1 (1%)`.

Note `AVY SUBMITTED` — status vocabulary is **per-scheme**, not global.

## 2. My Applications — `/ngo/my-applications`

H1 `My Applications`. Filter chips: **`All` · `Submitted` · `In Review` · `Approved` ·
`Query / Returned`**. `+ New Application` top-right. Paginated (`Prev · 1 2 3 4 5 · …`).

Columns: `Reference` · `Scheme` · `Project` · `FY` · `Requested` · `Sanctioned` · `Submitted` ·
`Status` · `Action`

Row shapes (identifiers preserved, NGO name generalised):

| Reference | Scheme | Project | FY | Requested | Sanctioned | Submitted | Status |
|---|---|---|---|---|---|---|---|
| `GIA/2026-27/AVYAY/DIBANG_VALLEY/83251` | AVYAY | *(org name)* | 2026-27 | ₹1,23,84,648 | — | 11 Aug 2026 | `AVY SUBMITTED` |
| `LGCY/89709` | SHRESHTA_M2 | Hostel — North West Delhi · FY 2025-26 | 2025-26 | ₹39,80,000 | — | 27 Mar 2026 | `Submitted` |
| `LGCY/83718` | SHRESHTA_M2 | Hostel — South East Delhi · FY 2025-26 | 2025-26 | ₹49,00,000 | — | 01 Jul 2025 | `Submitted` |
| `LGCY/76003` | SHRESHTA_M2 | Hostel — North West Delhi · FY 2024-25 | 2024-25 | ₹51,00,000 | — | 09 Aug 2024 | `Submitted` |

Two reference namespaces coexist: **`LGCY/…`** (legacy migrated) and
**`GIA/<FY>/<SCHEME>/<DISTRICT>/<n>`** (new). Action is `View →`.

## 3. Deficiencies — `/ngo/my-applications/deficiencies`

H1 `Deficiencies`. Lead: *"Everything the Ministry has asked you to clarify, across all your
applications."* Empty state (verbatim): *"No deficiencies have been raised on your applications."*
**Populated state unobserved** — this account has none.

## 4. Select Scheme — `/apply-grant`

H1 **`Select Grant Scheme`**, lead *"Choose the scheme you want to apply for."*
Four selectable cards, each `<title>` + description + `Target: <cohort>`; selecting one turns its
border `#2f4bb2` on a `blue-50` fill and enables a **`Continue →`** button (disabled until then).

| Scheme | Description (verbatim) | Target |
|---|---|---|
| **NAPDDR** | National Action Plan for Drug Demand Reduction. Prevention, treatment, rehabilitation, social-reintegration and aftercare for persons affected by substance abuse. | Persons affected by substance abuse |
| **AVYAY (Atal Vayo Abhyuday Yojana)** | Umbrella scheme covering Integrated Programme for Senior Citizens (IPSrC), maintenance of Old Age Homes / Continuous Care Homes, Rashtriya Vayoshri Yojana, Silver Economy etc. | Senior citizens |
| **SHRESHTA Mode 2** | SHRESHTA Mode 2 — grant-in-aid to NGO-run / state-government residential schools for SC students (Class 9–12). | SC students in NGO-run schools |
| **Support for Marginalized Individuals for Livelihood & Enterprise** | Garima Greh sub-scheme under SMILE — shelter homes for transgender persons providing food, medical care, recreational facilities, skill development and capacity-building support. | Transgender persons |

**The NGO portal spans four schemes**, while the admin portal's officer navs only ever exposed
`SHRESHTA_M2`. Scheme code observed in the URL: `SHRESHTA_M2`.

## 5. Application wizard — `/apply-grant/scheme/<schemeCode>/step-1`

> **Correction to the route table.** The JS bundle declares `step-1`, `step-2`, `review`,
> `success`, which reads like a 2-step wizard. It is **6 steps, all under the single
> `step-1` URL** — step state is internal, the URL never changes, and the stepper indicators
> are display-only (not clickable). Advance is a single `Next →` at the form foot.
> Navigating straight to `/apply-grant/step-1` without a scheme yields *"Please choose a scheme first."*

Title: **`SHRESHTA Mode-2 — Grant-in-Aid (Residential Education)`**
Sub: *"Step 1 of 6 — Organisation Details. Fields marked * are mandatory."*

Stepper: `1 Organisation Details` · `2 Institution Details` · `3 Bank, Beneficiaries & Grant` ·
`4 Declarations` · `5 Upload Documents` · `6 Review & Submit`

### Step 1 — Organisation Details (14 fields)
*"Identity of the applicant NGO/VO. Pre-filled from NGO-Darpan where available."*

`Name of NGO / VO (as in NGO-Darpan)*` · `NGO-Darpan Unique ID*` · `Statute / Act of Registration*` ·
`Registration Number*` · `Date of Registration*` (date) · `Date of Expiry*` (date) ·
`Registered-Office Address*` (textarea) · `City*` · `District*` · `State*` · `Mobile*` (tel) ·
`Email*` (email) · `Telephone` · `Fax`

Helper text carries the provenance rule, and is worth reproducing:
- *"Read-only — sourced from NGO-Darpan / your login."* (name, Darpan ID)
- *"From NGO-Darpan where recorded; enter it yourself if the box is empty."*
- *"Not held by NGO-Darpan — please enter it. Must be later than the date of registration."* (expiry)

⚠️ Fields described as "Read-only" in helper text are **not actually `readOnly`** in the DOM. In
the clone, make them genuinely read-only or drop the claim — do not copy the inconsistency.

### Step 2 — Institution Details
`Institution` (select — options are existing institutions formatted
`SC/DL/NWD/09001 — Hostel, North West Delhi · last applied FY 2025-26`) · `Institution ID*` ·
`Financial Year for which GIA is sought*` (`2025-26` / `2026-27` / `2027-28`) ·
`Nature of Institution*` (`Primary Residential School` / `Secondary Residential School` /
`Primary Non-Residential School` / `Secondary Non-Residential School`) ·
`Type*` (`Boys` / `Girls` / `Co-Ed`) · `Level*` (`Primary` / `Secondary`) ·
`Status of Institution*` (`Ongoing`) · `UC Pending Status (SFR 212(1))*` (`No UC Pending` /
`UC Pending`) · `Date & Year of Commencement*` · `Year from which GIA received under SHRESHTA*` ·
`Institution Location (address, district, landmark…)` · `Institution PIN Code*` ·
`Building Owned / Rented*` (`Owned` / `Rented`) · plus 4 Yes/No radio pairs.

### Step 3 — Bank, Beneficiaries & Grant
Four sections: **Bank Account Details** · **GIA Released — Last 3 Years** · **Beneficiaries** ·
**Grant Sought**.

`Account Number*` · `IFSC Code*` · `Bank & Branch*` · `Resource-mobilisation capability
(sources / amount)` · `GIA released in last 3 years (sanction no., date, amount)` ·
`SC Beneficiaries*` · `Other-Category Beneficiaries` · `Total Number of Beneficiaries*` ·
`Number of Beneficiaries (Previous Year)` · `Recurring Grant Sought (₹)*` ·
`Non-Recurring Grant Sought (₹)*` · `Total Grant Sought (₹)*` · plus 10 Yes/No radio pairs.

The `recurring + non-recurring = total` rule from the BRD is the validation to implement here.

### Step 4 — Declarations
Sections **Compliance Declarations** (18 Yes/No radio pairs) and **Authorised Person &
Declaration**: `Name of Authorised Person*` · `Contact of Authorised Person*` · `Place*` ·
`Date*` · `Time*`.

### Step 5 — Upload Documents — `Documents Checklist` (20 slots)
Each row: number, title, optional conditional note, and either an upload dropzone
(*"Click to … PDF / JPG / PNG"*) or, when filled, `<filename> · <size> KB` with `View` /
`Replace` actions and a `✓` / `✗ Document not …` verification marker.

1. Registration Certificate (Societies Registration Act 1860 / Charitable Trust)
2. PAN of the Organisation
3. Annual Report — Previous Financial Year
4. List of Beneficiaries — Previous Year
5. List of Managing Committee Members
6. Budget Estimates — Current Year
7. Audited Accounts (Balance Sheet, Income & Expenditure, Receipt & Payment)
8. Utilisation Certificate (GFR 12-A) — Previous Year, CA-signed — *conditional*
9. Provisional UCs — Grants Released Previous Year (GFR 12-A) — *conditional*
10. Bank Authorisation Letter (name, A/C no., address, IFSC / MICR)
11. Agreement Bond / PSR on Non-Judicial Stamp Paper
12. Compliance Status — Proactive Disclosures & CCTV Installation
13. EAT Module Implementation Status
14. Justification for Continuation of Ongoing Institution — *conditional*
15. Accounts in Parts (I&E, R&P, Balance Sheet, Auditor's Report)
16. List of Employees (name, designation, category, photo ID, Aadhaar)
17. Rent Agreement, Institution Location & Route Map — **OPTIONAL**, *required when the institution is rented*
18. Details of Income and Expenditure
19. School Recognition Certificate
20. Audit Report — Previous Year

Accepted types: **PDF / JPG / PNG**.

### Step 6 — Review & Submit
**Unobserved** — `Next →` is gated on the mandatory uploads, and the walkthrough was read-only
so nothing was uploaded. Build from the BRD's review-and-declare pattern and mark it inferred.

## 6. My Bank Accounts — `/ngo/bank-accounts`
H1 `My Bank Accounts`. Lead: *"Accounts you save here can be selected when applying. **Each
project must use a separate account.**"* Action `+ Add account`.
Table 1 columns: `Bank` · `Account` (masked `••••••••••4417`) · `IFSC` · `Branch`.
Table 2 `Project bank accounts`: `Project` · `Paid into` · action `Request change`.

## 7. Notifications — `/ngo/notifications`
H1 `Notifications`, `<n> unread`, action `Mark all read`. Feed items carry a title, body and
timestamp — e.g. *"Application submitted — Your application `GIA/2026-27/AVYAY/DIBANG_VALLEY/83251`
has been submitted and is now with the Ministry for review."* · `11 Aug 2026, 01:04 pm`.

## 8. Project Location Change — `/ngo/project-location-change`
H1 `Project Location Change`. Lead: *"Request a change to the location of one of your projects.
The concerned officer is notified and will examine your request."*
Fields: `Project` (select of the NGO's projects, e.g. `IP/AR/DIB/40040 · SRCH_50`), `New pr…`
(new project location details). Action `Submit request`.

## 9. Weekly Attendance — `/ngo/attendance`
H1 `Attendance`. Lead: *"Maintain your beneficiary & employee roster and submit a whole week of
attendance at once."* A `Scheme / Project` selector lists the NGO's institutions.
Tabs: `Weekly Attendance` · `Beneficiaries (n)` · `Employees (n)`.
Grid columns: `Name` · `Mon` · `Tue` · `Wed` · `Thu` · `Fri` · `Sat` · `Sun`.

## 10. Attendance Master — `/ngo/attendance-master`
H1 `Attendance Master`, scoped to the selected project. Tabs `Dashboard` · `Monthly Returns` ·
`History`. Section `Recent Attendance Records`.
Columns: `Month` · `Beneficiaries` · `Avg Present` · `%` · `Status`
Rows e.g. `March 2026 · 88 · 1 · 1.1% · Submitted`.

## 11. CCTV Setup — `/ngo/cctv`
H1 `CCTV Setup`. Lead: *"Configure your centre's CCTV so inspecting officers can view a live feed
during an e-inspection. **You do this once.**"* Field: `Number of cameras` (select, 1–8+).
This is the NGO end of the admin portal's e-inspection / video-call feature.

---

## 12. Application detail — `/ngo/my-applications/:id`

Reached from a row's **`View`** button (a button, not a link — the crawler cannot follow it).
Note the id in the URL is a **numeric internal id** (`83251`), not the GIA reference.

H1 **`Application — <GIA ID>`**. Sections: **`Processing History`** *("Where your application
has been, and when")* → **`Application Summary`** → **`Uploaded Documents`**.

`Processing History` is a timeline; an observed entry reads
*"Application submitted · 11 Aug 2026 · You · Application submitted (GIA/2026-27/AVYAY/…)"*.

`Application Summary` is a label/value list: Application ID · NGO Name · Scheme · Financial
Year · Project Title.

**`Uploaded Documents`** — columns `Document` · `Uploaded On` · `Status` · `Remarks` · `Action`
(`View`). A *sanctioned* application shows no Processing History section — only Summary and
Documents.

### ⭐ AI document validation (not previously known)

Each document row carries an **AI verdict** rendered inline with the title —
`AI: pending`, `AI: not valid` — and, when it fails, the model's reasoning. Verbatim from a
failed PAN upload:

> *"This is a list of district nodal officers, not a PAN card. Please upload the organisation's
> PAN card issued by the Income Tax Department. The document does not contain a Permanent
> Account Number (PAN) in the format AAAAA9999A. No Income Tax Department branding or PAN card
> details are present in this document."*

So the portal runs **automated AI verification on every uploaded document**, independent of the
officer's own per-document review on the admin side (§16 of the admin inventory). The clone
should represent this as a distinct, NGO-visible verdict — it is not the officer's verdict.

**Document checklists are per-scheme.** The AVYAY application's list (`Registration Certificate`,
`PAN Card of the Organisation`, `Annual Report of NGO — previous FY`, …) differs from
SHRESHTA_M2's 20-slot list in §5.

## 13. Online Inspection Meeting — `/ngo/my-applications/:id/inspection/meeting`
Renders **only an `<h1>`: `Online Inspection Meeting`** — no body, no controls. A stub on dev.

## 14. Utilisation Certificate — `/ngo/my-applications/:id/uc` ❌ unreachable
Returns **"Application not found." + `Back to My Applications`** for every id tried, including a
freshly-opened **sanctioned** application (`LGCY/85779`, id `77026`) — i.e. exactly the state a
UC should apply to. Either the route keys off a different identifier or no application in this
account satisfies its precondition. **Unobserved; build from the BRD and mark it inferred.**

---

## Inferred (NOT observed — build a mock and mark it)

- **Step 6 Review & Submit**, and the whole submit → success path (`/apply-grant/success`).
- **Populated Deficiencies**, and the deficiency-response flow (`/ngo/my-applications/:id` edit
  with reopened fields).
- ~~Application detail `/ngo/my-applications/:id`~~ — **CLOSED**, see §12.
- ~~Inspection meeting~~ — **CLOSED**, see §13: it is a stub rendering only a heading.
- **UC submission** `/ngo/my-applications/:id/uc` — see §14; unreachable on dev.
- **`/login/v2`, `/login/select-branch`, `/login/verify-otp`, `/inspection/call`,
  `/ngo/sage-registration`** — declared in the bundle, not reachable from the signed-in nav.
- **The entire School audience** (`/school/**`, 12 routes) — out of scope for this clone.

## Route summary

| Route | Screen | In nav |
|---|---|---|
| `/login` | SAMAVESH login — username + password + **CAPTCHA**, plus a `Login with DARPAN ID` tab | — |
| `/ngo/dashboard` | Dashboard — KPIs + status donut | ✅ |
| `/ngo/my-applications` | My Applications | ✅ |
| `/ngo/my-applications/deficiencies` | Deficiencies (empty) | ✅ |
| `/apply-grant` | Select Grant Scheme (4 schemes) | ✅ |
| `/apply-grant/scheme/<code>/step-1` | 6-step application wizard | via Continue |
| `/ngo/project-location-change` | Project Location Change | ✅ |
| `/ngo/bank-accounts` | My Bank Accounts | ✅ |
| `/ngo/notifications` | Notifications | ✅ |
| `/ngo/attendance` | Weekly Attendance | ✅ |
| `/ngo/attendance-master` | Attendance Master | ✅ |
| `/ngo/cctv` | CCTV Setup | ✅ |
