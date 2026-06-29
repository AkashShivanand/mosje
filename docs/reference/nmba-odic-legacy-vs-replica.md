# NMBA ODIC — Legacy Portal vs SAMAVESH Replica (field-by-field)

> Reference captured **2026-06-24** from the live legacy portal
> `https://nmba.dosje.gov.in/treatment-centre/*` (logged in as a Treatment-Centre
> user) and mapped against our replica in `apps/portals/nmba`
> (`/portals/nmba/treatment-centre/odic/*`).
>
> **Scope:** the ODIC Registration menu — 4 forms + 2 list pages.
> Every legacy field is reproduced. Where we diverge it is a deliberate UX/a11y
> upgrade ("our style"), never a dropped field. Those are flagged **▲ Enhancement**.

## Conventions used in the legacy forms

- Long **single-scroll page** with olive section banners (Details of Outreach,
  Personal Details, Drug Use Details, …).
- `*` marks required fields. Dropdowns read "Select …" until chosen.
- Repeating Drug-Use rows via a **+ Add** button.
- Yes/No as radio pairs; Yes/No/No Response as selects ("Select Injection").

## How our replica restyles them (applies to all forms below)

| Legacy | Replica | Why |
|---|---|---|
| One long scrolling page | **Multi-step `Wizard`** (DS component) with a numbered stepper + Review step | Lower cognitive load, per-step validation, GIGW/WCAG focus management |
| Submit validates whole page | **Per-step validation** + an error summary that focuses on the first issue | WCAG 3.3.1 / 3.3.3 error identification |
| No confirmation | Final **Review** step with "Edit ___" jump links | Lets users confirm before submit |
| Olive banners, table-grid layout | DS `FormSection` / `FormCard` + token-driven styling, Noto Sans | Design-system consistency across the estate |
| Plain file input | DS `MediaUpload` (drag-drop, 2 MB guard, preview) | Consistent upload UX |

---

## 1. Outreach Patient  ·  `outreachpatient`

- **Legacy:** `/treatment-centre/outreachpatient` (single page)
- **Replica:** `/treatment-centre/odic/outreach/register` →
  `components/treatment-centre/outreach-patient-form.tsx`
- **Flow:** 4-step wizard — *Outreach & Profile · Substance Use · Intervention · Review*
  (Drug Use + Injecting + Sexual Behaviour share one **Substance Use** step, matching
  the IRCA register grouping — not split across steps.)

| Legacy section | Legacy field | Replica step | Notes |
|---|---|---|---|
| Details of Outreach Worker | Name of outreach worker * | 1 | text |
| | Date of Hotspot visited by the Outreach Worker * | 1 | date, max = today |
| | Name of hotspot visited * | 1 | text |
| Profile of the Client | Name of the Client * | 1 | text |
| | Gender * | 1 | select (GENDERS) |
| | Age * | 1 | number 1–120 |
| | Family Type * | 1 | select (LIVING_ARRANGEMENTS) |
| | Educational Status * | 1 | select (EDUCATION) |
| | Employment Status * | 1 | select (EMPLOYMENT) |
| | Marital Status * | 1 | select (MARITAL_STATUS) |
| Pattern of Substance Use | Substance / Reason / Use last 3mo / Daily / Duration (+ Add) | 2 | repeatable **cards** (uniform with IRCA/ODIC register) |
| Injecting Behaviour | Intravenous drug use Ever * / Last 3 Month | 2 | YES_NO_NR |
| | Sharing Needles/Syringes Ever / Last 3 Month | 2 | shown only if IV-use = Yes |
| Sexual Behaviour | Sexual Practices * | 2 | select (SEXUAL_PRACTICES) |
| Brief Intervention | Was any Brief Intervention Given? | 3 | Yes/No radio |
| | Brief Intervention Details * | 3 | shown/required only if Yes ▲ |
| | Referred to * | 3 | select (REFERRAL_DESTINATIONS); "Other-specify" reveals free-text ▲ |

**▲ Enhancements:** Brief-Intervention details only appear when "Yes" is chosen
(legacy always shows the textarea); needle-sharing rows are conditional on IV-use.

---

## 2. ODIC Client / Beneficiary Registration  ·  `odicregister`

- **Legacy:** `/treatment-centre/odicregister` (single page — the full clinical form)
- **Replica:** `/treatment-centre/odic/register` →
  `components/treatment-centre/odic-form.tsx`
- **Flow:** 4-step wizard — *Registration & Profile · Substance Use · Assessment & Intervention · Review*

| Legacy section | Legacy field | Replica step | Notes |
|---|---|---|---|
| Details of DIC | Date of Registration * | 1 | date, max = today |
| | Referred By | 1 | select (REFERRED_BY) — optional, matches legacy (no `*`) |
| Personal Details | Name of the Beneficiary * | 1 | text |
| | Age * | 1 | number 1–120 |
| | State * / District * | 1 | District enables after State |
| | Place of residence * | 1 | select (PLACE_OF_RESIDENCE) |
| | Current Address * / Permanent Address * | 1 | textarea; "Same as Current" checkbox |
| | Contact Number * | 1 | 10-digit, numeric only |
| | Gender * | 1 | select (GENDERS) |
| | Educational Status * | 1 | select (EDUCATION) |
| | Occupational Status * | 1 | select (OCCUPATION) |
| | Employment Status * | 1 | select (EMPLOYMENT) |
| | Income (monthly) * | 1 | select (INCOME) |
| | Marital Status * | 1 | select (MARITAL_STATUS) |
| | Category * | 1 | select (CATEGORY) |
| | Living Arrangements * | 1 | select (LIVING_ARRANGEMENTS) |
| | Government ID * | 1 | select (GOVERNMENT_ID) — legacy has no ID-number field, neither do we |
| Drug Use Details | Drug * / Age of First Use * / Reason * / Use last 3mo / Daily / Duration * (+ Add) | 2 | repeatable cards, per-row required validation ▲ |
| Injecting Behaviour | IV drug use Ever * / Last 3 Month | 2 | YES_NO_NR |
| | Sharing Needles Ever / Last 3 Month | 2 | conditional on IV-use = Yes |
| Sexual Behaviour | Sexual Practices * | 2 | select (SEXUAL_PRACTICES) |
| | Ever had HCV testing — Test History * → HCV Test Result | 2 | YES_NO → TEST_RESULT |
| | Ever had HBV testing — Test History * → Result of HBV Test | 2 | YES_NO → TEST_RESULT |
| Treatment Details | Previous Treatment for use Substance * | 3 | YES_NO |
| | Treatment taken from | 3 | shown/required only if Previous = Yes |
| | Ever hospitalized … * | 3 | YES_NO |
| Miscellaneous | Average expenditure on drugs * | 3 | number (₹) |
| | Source of money for drugs * (multi) | 3 | checkbox group (MONEY_SOURCE_OPTIONS), ≥1 required |
| | Ever apprehended by police … * | 3 | YES_NO_NR |
| | Any history of substance use in the family * | 3 | YES_NO |
| | Patient's Motivation During admission * | 3 | select (MOTIVATION_STAGES) |
| | Diagnosis (as per ICD 11) * | 3 | select (PROVISIONAL_DIAGNOSIS) |
| Intervention Provided | Intervention Provided during the Visit * (Medical / Psychosocial) | 3 | checkbox group, ≥1 required |
| | Medical * | 3 | text — shown/required only if Medical checked ▲ |
| | Psychosocial * | 3 | YES_NO_NR — shown/required only if Psychosocial checked ▲ |
| | Referral Made To * | 3 | select (INTERVENTION_REFERRAL); "Others-specify" reveals a free-text field ▲ |

**▲ Enhancements:** per-drug-row required validation; conditional reveal of
Medical/Psychosocial inputs tied to their checkbox; "Others-specify" free-text for
referral; Review step summarising all sections.

---

## 3. Follow-up ODIC  ·  `OdicFollowUp`

- **Legacy:** `/treatment-centre/OdicFollowUp` (single form)
- **Replica:** `/treatment-centre/odic/follow-ups` (form **+** list below — was list-only before)

| Legacy field | Replica | Notes |
|---|---|---|
| Registration Number of the Patient * | text | looked up against beneficiaries to show the name in the list ▲ |
| Date of last Visit * | date | |
| Intervention Provided during the Visit * (Medical / Psychosocial) | checkbox group, ≥1 required | |
| Medical * | text | shown/required only if Medical checked ▲ |
| Psychosocial * | select (YES_NO_NR) | shown/required only if Psychosocial checked ▲ |
| Referral Made To * | select (INTERVENTION_REFERRAL) | |
| Date of Next Follow Up * | date | |

**▲ Enhancement:** submitting appends to a **Follow-up ODIC List** table on the same
page (S.No, Reg No, Beneficiary Name, Date of last Visit, Follow-Up No., Referral
Made To, Date of Next Follow Up) with Copy/Excel/CSV export.

---

## 4. Details of Awareness Generation Program  ·  `existingOutreachPatient`

- **Legacy:** `/treatment-centre/existingOutreachPatient` (form + list)
- **Replica:** `/treatment-centre/odic/awareness` (form + list)

| Legacy field | Replica | Notes |
|---|---|---|
| Name of the hotspots Identified * | text | |
| Awareness Date * | date | |
| Name of the venue * | text | |
| Number of people attended * | number | |
| Photos of awareness generation Program * | DS `MediaUpload` | added in this pass — was previously missing ▲ |

List columns match legacy: S.No · Name of the hotspots Identified · Awareness Date ·
Name of the venue · Number of people attended · **Photos** (thumbnail preview).

---

## 5. ODIC Patient Registration List  ·  `odiclistpatients`

- **Legacy:** `/treatment-centre/odiclistpatients`
- **Replica:** `/treatment-centre/odic/patients`

Columns aligned 1:1 with the legacy table:

`S.No · Registration Number · Treatment Center · Age · Gender · Occupation ·
Education · Marital Status · Employment Status · Address · State · Registration
Date · Date of Follow-up`

**▲ Enhancements:** Registration Number is clickable and an **Action → View Details**
column opens a beneficiary detail modal; Copy/Excel/CSV export + search retained.
(Occupation/Education/etc. read from the record's captured demographics; older seed
rows that pre-date those fields show "—".)

---

## 6. Outreach Beneficiary List  ·  `outreachlistpatientlist`

- **Legacy:** `/treatment-centre/outreachlistpatientlist`
- **Replica:** `/treatment-centre/odic/outreach`

Columns aligned 1:1 with the legacy table:

`S.No · Registration Number · Date of visit by the Outreach Worker ·
Name of hotspot visited · Name of Client`

Sourced from Outreach registrations (visit date = `dateOfRegistration`, hotspot =
captured detail, client = `name`).

---

## Master-data option sets (codes mirror the live site)

All dropdown option-sets live in `lib/treatment-centre/master-data.ts` with the
legacy numeric `value` codes preserved. Sets added/used for ODIC:

- `REFERRAL_DESTINATIONS` — Outreach "Referred to"
- `INTERVENTION_REFERRAL` — ODIC register + Follow-up "Referral Made To"
- plus existing: `GENDERS`, `STATES`, `PLACE_OF_RESIDENCE`, `MARITAL_STATUS`,
  `LIVING_ARRANGEMENTS`, `EDUCATION`, `OCCUPATION`, `EMPLOYMENT`, `INCOME`,
  `CATEGORY`, `GOVERNMENT_ID`, `REFERRED_BY`, `DRUGS`, `INITIATION_REASONS`,
  `YES_NO`, `YES_NO_NR`, `SEXUAL_PRACTICES`, `TEST_RESULT`, `TREATMENT_TAKEN`,
  `MONEY_SOURCE_OPTIONS`, `MOTIVATION_STAGES`, `PROVISIONAL_DIAGNOSIS`.

## Summary of intentional differences (not regressions)

1. Single-page legacy forms → **multi-step wizards** with a Review/confirm step.
2. Whole-page submit validation → **per-step + per-row validation** with focus
   management and an error summary.
3. Conditional fields (needle-sharing, brief-intervention details,
   Medical/Psychosocial, treatment-taken, "Others-specify") **reveal on demand**
   instead of always showing.
4. List pages gain **View Details / clickable rows** and keep Copy/Excel/CSV + search.
5. Awareness form gained the **Photos** upload that exists on the legacy site.

No legacy field was dropped.
