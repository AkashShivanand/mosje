# NMBA "Patient Data Monitoring System" — Reverse-Engineering Analysis

> Source: meeting recording `Incoming/2026-06-18_12-56-42.mp4` (Google Meet screen-share, ~37 min, 18-Jun-2026).
> Presenter: **Deepshikha Goel** walking the team (Prabal Jain, Pilli Rajesh Sombabu, Akash Kumar) through the **live legacy portal**.
> Purpose of this doc: capture the full flow, every role, every screen, and every field so we can redesign the portal onto `@mosje/design-system`. **Synthetic/observed data only.**

## 0. Meeting context, intent & action items (from the audio transcript)

This was a **handover / requirements walkthrough** — the IDAMS/Ministry side (Deepshikha Goel + NIC/dev) demoing the live portal to the **MoSJE redesign team** (Akash Kumar, Prabal Jain, Rajesh). Confirmed intent and decisions:

- **The redesign team will rebuild this on our stack.** Next steps agreed on the call:
  1. Ministry to share **4 dummy logins**: **US (Under Secretary), IRCA, ODIC, DDAC**.
  2. **Akash → flow diagram**, then a **BRD** is written and mailed, credentials shared, then a **timeline** is given.
  3. Redesign team to request a **DEV/staging environment ("DV")** and the **DB tables / sample data** up-front (so the data contract is known and nothing has to be reworked later). Data is ultimately shared with **NIC**.
- **Hard requirement, repeated several times: "no data loss."** Even fields/forms that are seasonally hidden must keep their stored data and remain in admin reports.
- **Centre types differ in form size:** **IRCA's patient form is the largest** (full admission + clinical wizard). **ODIC is a drop-in/OPD centre with *no admission*** → much smaller form. DDAC/CPLI sit in between. The redesign must support **role/scheme-specific form variants from one engine.**
- **Dependency scales/scoring** (ASSIST/SADQ-style severity scores) are **entered manually** by NGO/centre staff (the scale itself is pre-defined; staff key in the score).
- Most pick-lists are **master-data dropdowns** managed under Masters Management.
- **Follow-up** reopens a patient by **Registration Number**, pre-filling saved demographics; **Readmission** reopens the *full* registration form.
- The **Nasha Mukt Bharat Saptah / outreach-activity form is time-gated** (enabled only around the NMBS week, ~the 26th); afterwards no new activity can be added, but historical data stays. Treatment data entry is always-on.
- **Centre Photos** and **Saptah/outreach photos** are deliberately **separate** uploads.
- Reports include **centre ranking by number of activities** (top-3 + rest), **age-wise**, **state-wise**, and **drug-distribution** analytics.

> Transcript quality note: audio was low-volume Hinglish over Meet; the small Whisper model looped on a few quiet stretches (artifact lines exist). The substance above is corroborated by the on-screen walkthrough.

## 1. What the system is

- **Product name (in UI):** "Patient Data Monitoring System" — Ministry of Social Justice and Empowerment, Government of India.
- **Backend / real system:** **IDAMS** (footer `support@idams.gov.in`); public domain referenced is `nmba.dosje.gov.in`.
- **Programme context:** NMBA = **Nasha Mukt Bharat Abhiyaan** (Drug-Free India), under **NAPDDR** (National Action Plan for Drug Demand Reduction, 6th version). Drug De-addiction Helpline **14446**.
- **Scheme/centre types tracked (4):** **IRCA** (Integrated Rehabilitation Centre for Addicts), **ODIC** (One-stop / Outreach & Drop-In Centre), **DDAC** (District De-Addiction Centre), **CPLI** (Community Peer-Led Intervention). The header confirms "Integrated Rehabilitation Centre for Addicts".
- **Scale shown:** ~**656 De-Addiction Facilities**, ~**13,600+ Total Beneficiaries/Registrations**.

### Design language of the legacy portal (what we're replacing)
- Heavy **green gradient** chrome, glossy/skeuomorphic green buttons, pale **yellow-green** page backgrounds, drop shadows — dated "GIGW 1.0 era" look.
- Government utility strip (भारत सरकार / Government of India), **22-language** translator widget (Bhashini-style), accessibility widget (text resize / contrast), all bolted on top-right.
- Forms are dense, icon-prefixed input rows; multi-tab wizards; jQuery **DataTables** lists (Copy / Excel / CSV / Search / "Show N entries").
- Third-party artifacts leaking into UI (Grammarly badges in textareas) — indicates plain HTML form fields.

## 2. Roles observed (multi-tenant, role-switched)

The top-right org switcher changes the whole sidebar/permissions. Two roles were demonstrated:

| Role | Context label | Scope | Sidebar |
|------|---------------|-------|---------|
| **Treatment Centre user** | `Ministry of social justice and empowerment (TC)` | Data **entry** for one centre | Dashboard · IRCA Registration ▸ · Nasha Mukt Bharat Saptah 2026 · Staff List · Center Photos |
| **Under Secretary / Ministry** | `Under Secretary MoSJE (DOSJE)` | **Oversight / read + masters** | Dashboard · Reports ▸ · Masters Management ▸ · Nasha Mukt Bharat Saptah 2026 |

(The login also implies state/district nodal tiers exist in the real system, but only TC + Ministry were shown.)

## 3. Public site (pre-login)

- **Header:** National Emblem + "Patient Data Monitoring System / Ministry of Social Justice and Empowerment / Government of India"; right side **Drug De-addiction Helpline 14446 – Call today**.
- **Primary nav:** Home · About Us · Contact Us · (Dashboard) · Login/Logout.
- **Homepage content:**
  - KPI tiles: **De-Addiction Facilities (656)**, **Total Beneficiaries (13,614)**.
  - **Awareness / Outreach Activities** gallery — cards of centre name + a number (e.g. *V Annavaram 70, Jiligumadu 50, Court Complex Perumbavoor 20, Pilatimahul 25, Sunarjor 20, IRCA Saket Hospital Patiala 65*) with **View All**.
  - **What's New** panel (e.g. "NAPDDR Action Plan 6th version", published date, file size) + **Read More** about the MIS.
  - Decorative illustrations.

### Login (two methods on one "Login Account" page)
1. **Password:** Username / Email* · Password* · Forgot Password? · **LOGIN**
2. **OTP:** **Project Id*** → **Send OTP** → "OTP sent to your registered mobile 97•••••37" → **Enter OTP*** → **Resend OTP (44s)** countdown → **Verify & Login**
- Note line: "All fields marked with (*) are mandatory."

## 4. Treatment-Centre role — screens & fields

### 4.1 IRCA Registration ▸ (submenu)
- Patient Registration & Details Submission
- Patient List & Details Submission
- Follow-Up List
- Readmission List
- Details of Awareness Generation Program

### 4.2 Patient Registration & Details Submission — the core record
A long single page (**Details of the Patient → Drug Use Details → Injecting Behaviour → Treatment Details → Miscellaneous → Diagnosis → Submit**), then a **5-tab clinical wizard** for the same patient.

**A. Details of the Patient (demographics)**
- Date of Admission* (date)
- Name of the Patient* (text; validation: "Name of Patient must contain alphabets only")
- Gender* (Male / Female / Transgender)
- Age* (number)
- Upload Patient Image* (file, .JPG)
- Current Address* (textarea)
- ☑ Same as Current Address (copies to Permanent)
- Permanent Address* (textarea)
- State* · District* (dependent dropdowns)
- Place of Residence* (Rural / Urban)
- Marital Status* (Never Married / …)
- Living Arrangements* (e.g. Joint Family)
- Educational Status* (e.g. Professional Degree)
- Occupational Status* (e.g. Legislators/Senior Officials — ISCO-style list)
- Employment Status* (e.g. Currently Unemployed)
- Income (monthly)* (banded: e.g. 7501–20,000)
- Category* (Unreserved / SC / ST / OBC …)
- Contact Number* (mobile)
- Government ID* (type: PAN Card / Aadhaar / …) + **ID Number***

**B. Drug Use Details (repeatable table, +Add)**
Columns: **Drug*** (Alcohol, Cannabis, Synthetic Cannabinoids, Opioids, Sedatives/hypnotics/anxiolytics, Cocaine, Stimulants incl. amphetamines, Hallucinogens, …) · **Age of First Use*** · **Reason For Initiation/Use*** · **Use in Last 3 Months*** (Yes/No) · **Daily/Near-Daily Use*** (Yes/No) · **Duration of Regular Use (monthly)***

**C. Injecting Behaviour** (Ever vs Last 3 Months columns)
- Intravenous Drug Use — Ever* / Last 3 Months*
- Sharing Needles/Syringes — Ever Use / Last 3 Months

**D. Treatment Details**
- Previous Treatment for Substance use* (Yes/No)
- If yes, treatment taken from (e.g. State Govt De-addiction Facility)
- Source of Referral* (e.g. Awareness Programme)
- Ever hospitalized for treatment of substance use* (Yes/No)

**E. Miscellaneous**
- Average Daily Expenditure on Drugs* (₹)
- Source of Money for Drug Use* (multi-select: e.g. Borrowing from friends)
- Ever apprehended by police for drug-related offense* (Yes/No)
- Any history of substance use in the family* (Yes/No)
- How many days ago was the substance last consumed?*
- Patient's Motivation During the time of admission*

**F. Diagnosis**
- Provisional Diagnosis (as per **ICD-11**)* → **Submit**

**5-tab clinical wizard** (tabs: *Previous Clinical & Treatment History · Details of Dosage During the Treatment Period · Details of Counselling Session · Details of Referral Services & Details of Home Visit · Diagnosis & Discharge*; each tab has Save + Previous/Next):

**Tab 1 — Previous Clinical & Treatment History**
- Withdrawal Symptoms in the Past* (multi: Tremors, Insomnia, Nausea, Aches and Pains, Hallucinations, Delirium)
- Past Psychiatric Symptoms* (multi: Depression, Suicidal Ideations and Attempts, Confusion, Aggressive Outbursts, Hallucinations)
- History of Chronic Health Problems* (multi: Diabetes, Liver Disorders, Respiratory Problems (Pulmonary TB), Cardiac Problems, Infections; "Nil" option)
- History of Other Medical Problems* (multi: Haematemesis, Jaundice, Abscesses, Bleeding Piles, Skin Problems)
- History of Head Injury* (Yes/No)
- Previous Drug Treatment History* (Yes/No) → if Yes: **Year of Last Treatment*** · **Duration of Treatment (in days)*** · **Name and Place of Treatment Centre***
- Type of Treatment Received* (multi: Pharmacological, Psychosocial, Family Intervention, Vocational Training, Mindfulness)
- Reason For Current Relapse* (dropdown)

**Tab 2 — Details of Dosage / Medication during the Treatment Period** (repeatable table, +Add/−Remove)
Columns: **Date*** (validation: "Medication date must be after registration date") · **Complaints*** · **Medication*** · **Reason for Changing Medication*** · **Remarks by Physician***

**Tab 3 — Details of Counselling Session** (sub-tables, each +Add)
- Individual session table (Session Number · Date · Issues Dealt With)
- **Family Intervention** table (Session Number · Date · Issues Dealt With)

**Tab 4 — Details of Referral Services & Details of Home Visit**
- Referral Services* (multi: NACO – One Stop Centre, Vocational Training Centre, Tertiary Hospital for Medical Care, Narcotics Anonymous, Alcoholic Anonymous, Others Specify) · Remark if Any
- **Home Visit** table (+Add): S.No · Date of Home Visit* · Purpose of Home Visit* · Outcome of Home Visit*

**Tab 5 — Diagnosis & Discharge**
- *Diagnosis:* Final Diagnosis (as per ICD-11)* (e.g. "Disorders due to use of alcohol") · Medical Comorbidity · Psychiatric Comorbidity · Neurological Condition
- *Discharge:* Patient's Motivation During the Time of Discharge* · Medication Prescribed at the Time of Discharge* · Remark at the Time of Discharge* · Date of Discharge* · Date of Follow-Up* → **Submit**

### 4.3 Follow-Up (OPD Basic) form
Header "Integrated Rehabilitation Centre for Addicts".
- Registration Number of the Patient* (e.g. AN2627013638) · Date of last admission (auto-filled) · Date of discharge (auto-filled) · Current Chief Complaints
- **Medical Review:** Medical Review Date* · Complaints of the patient* · Name of the medicine with dosage* · Reasons for continuing or change of medication*
- **Review by Counsellor/Psychologist** (section)

### 4.4 Follow-Up List (DataTable)
Columns: S.No · Registration Number of the Patient · Date of last admission · Date Of Discharge · Current Chief Complaints · Medical Review Date. (Copy/Excel/CSV, Search, Show N.)

### 4.5 Readmission List — same DataTable pattern (re-admission of discharged patients reopens the registration form pre-filled).

### 4.6 Nasha Mukt Bharat Saptah 2026 — "Details of Activity" (event reporting)
- Event* (e.g. International Day Against Drug Abuse) · Activity* · Date of the Activity*
- Coordinating Department's Name* · Total No. of People Participating* · No. of Males/Boys*
- No. of Females/Girls* · No. of Educational Institutions* · Upload Images/Videos (multi-file)
- Is Completed* (status) · Current Location (**Get Device Location** button / geotag) → **Submit**
- **Activity List** view: filters Treatment Centre + Activity Category; table cols incl. Dept Name, Total Participating, Males/Boys, Women/Girls, Educational Institutions, Images/Videos (thumbnails), Created At, Action (edit/delete); **+Add New Activity**.

### 4.7 Staff List — "Add Staff" form: Designation* · Name* · Mobile* · Education* (+ Save/Reset), plus a staff DataTable.
### 4.8 Center Photos — image upload/gallery for the centre.

## 5. Ministry (Under Secretary / DOSJE) role

### 5.1 Dashboard (analytics)
- KPI cards: **Total Registration (13,616)** · **Total In-Patient Registration (13,616)** · **Total Re-Admission (11)** · **Total Follow-Up Cases (79)**.
- **Analytical Report** — pie chart with filter (e.g. by **Gender**: Male majority, Female 3.42%, Transgender 0.01%).
- **Drug Distribution** — bar chart by substance (Alcohol ~8,818 highest, then Cannabis ~1,724, Opioids ~2,457, etc.).
- (Charts are hand-rolled/Highcharts-style with a hamburger export menu.)

### 5.2 Reports ▸
- **Activity Report Date Wise** — cols: S.No · Project ID · Treatment Center · Type of Activity · Date of Activity · Coordinating Department's Name · Total No. of People Participating · No. of Males/Boys …
- **Treatment Centre Report Date Wise** — "Treatment Centre wise registered patients"; filters State · District · Treatment Centre · From/To Date · Search; cols: S.No · State · District · Project ID · Name of the Treatment Centre · **Type of Treatment Centre (IRCA/ODIC/DDAC/CPLI)** · Number of Beneficiaries (links to drill-down). Header shows live **Total Beneficiaries**.
- **State Report Date Wise**
- **Analytical Report**
- All exportable (Copy/Excel/CSV).

### 5.3 Masters Management ▸ (lookup/CRUD tables, each with +Add and edit Action)
Content Management · Whats New (Title, Link, PDF, Size, Created Date, **Is Active** toggle) · Category · **Drugs** (Alcohol, Cannabis, Synthetic Cannabinoids, Opioids, Sedatives/hypnotics/anxiolytics, Cocaine, Stimulants…) · Education · Employment · Income · Marital Status · Occupation · (more).
→ These masters power every dropdown in the registration form.

## 6. Cross-cutting UX patterns to preserve / improve in redesign

- **Persistent app bar:** logo + "Patient Data Monitoring System" · Last Login timestamp · accessibility widget · **org/role switcher** · collapsible hamburger sidebar.
- **Repeatable rows** everywhere (drug use, dosage, counselling, home visits) — needs a clean "+ Add row / Remove" pattern.
- **Multi-select chips** for symptom/history fields.
- **Conditional fields** (Previous Drug Treatment = Yes → reveals 3 fields).
- **Cross-field validation** (medication date > registration date; name alpha-only).
- **DataTables** for every list (export, search, pagination) — replace with DS data-table (already in DS).
- **Dependent dropdowns** (State→District; masters-driven options).
- **File/media uploads** (patient photo, activity images/videos, centre photos).
- **Geotagging** (Get Device Location on activities).
- **i18n** (22 scheduled languages) + **a11y widget** are mandatory government requirements.

## 7. Redesign implications (for the @mosje/design-system clone)

1. **Re-skin to SAMAVESH tokens** — replace green gradients/glossy buttons with `gov-blue`/brand tokens, Noto Sans, flat Material Symbols icons; kill the yellow-green page wash and drop shadows. **No tricolour stripe.**
2. **Componentize the patient wizard** as a DS multi-step form (stepper + per-step Save) instead of one giant scroll + tab strip; show progress and validation inline.
3. **Standard DS shells:** PortalLoginShell (password + OTP tabs), DashboardShell (sidebar + app bar + role switcher), ListShell (DS DataTable with export/search), FormShell (icon-row inputs → DS FormField).
4. **WCAG 2.1 AA / GIGW:** chart `aria-label`s, visible focus, AA contrast (legacy section labels fail), keyboard-navigable repeatable rows, real alt text on activity images.
5. **Reusable primitives needed:** RepeatableFieldArray (+Add/Remove), MultiSelectChips, ConditionalField, DependentSelect, MediaUpload, GeotagField, KpiCard, ChartCard (pie/bar with export).
6. **Two role layouts** from one shell: TC (entry-heavy) vs Ministry (read/analytics + masters).
7. **Keep the data contract identical** to IDAMS so existing records/exports don't break (stakeholders stressed "no data loss" in the meeting).

## 8. Field master-list (quick reference for forms)

- **Patient identity:** Date of Admission, Name, Gender, Age, Photo, Current Address, Permanent Address, State, District, Place of Residence, Marital Status, Living Arrangements, Educational Status, Occupational Status, Employment Status, Monthly Income band, Social Category, Contact Number, Govt ID type + number.
- **Substance use:** per-drug {drug, age of first use, reason for initiation, use last 3m, daily use, duration}; injecting {IV ever/3m, needle sharing ever/3m}; avg daily spend; source of money; days since last use; family history; police apprehension.
- **Clinical history:** withdrawal symptoms, psychiatric symptoms, chronic problems, other medical problems, head injury, prior drug treatment (+year/duration/centre), treatment types received, relapse reason.
- **Treatment course:** dosage log {date, complaints, medication, reason for change, physician remarks}; counselling sessions {individual & family: number, date, issues}; referrals (+remark); home visits {date, purpose, outcome}.
- **Diagnosis/discharge:** provisional dx (ICD-11), final dx (ICD-11), medical/psychiatric comorbidity, neurological condition, discharge motivation, discharge medication, discharge remark, discharge date, follow-up date.
- **Follow-up/OPD:** registration no., last admission, discharge date, chief complaints, medical review date, medicine+dosage, reason for continuing/changing.
- **NMBS activity:** event, activity, date, coordinating dept, participants (total/male/female), educational institutions, media, completion status, gelocation.
- **Staff:** designation, name, mobile, education.
- **Masters:** drugs, categories, education, employment, income bands, marital status, occupation, content, what's-new items.

---
*Working artifacts (gitignored): `Incoming/_analysis_2026-06-18/` — extracted frames, contact sheets, audio, raw transcript.*
