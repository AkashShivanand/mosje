# E-Anudaan (NGO Portal) — Comprehensive Tri-Disciplinary Audit Report

> **Auditor Perspectives:** Design Director · Senior UX Designer · Senior Visual Designer  
> **Target Portal:** E-Anudaan (`eanudaan-user-uat.mosje.in` & `apps/hub/src/app/portals/e-anudaan/`)  
> **Target User Role:** NGO / Voluntary Organisation (Grant Applicant)  
> **Date:** September 2026  
> **Compliance Benchmarks:** GIGW 3.0 · UX4G Design Standards · WCAG 2.2 Level AA · DBIM 3.0  
> **Screenshot Archive:** `docs/audit_screenshots/e-anudaan/ngo/` (57 High-Resolution Full-Length Screenshots)

---

## Executive Summary & Architecture Critique (Design Director Lens)

The E-Anudaan portal serves as the primary digital conduit between thousands of Non-Governmental Organisations (NGOs) and the Ministry of Social Justice & Empowerment (MoSJE). It processes hundreds of crores of rupees in Grant-in-Aid (GIA) across four critical welfare umbrellas: **NAPDDR** (Drug Demand Reduction), **AVYAY** (Senior Citizens), **SHRESHTA Mode 2** (Residential Education for SC Students), and **SMILE / Garima Greh** (Transgender Shelter & Rehabilitation).

### 1. Strategic Architectural Deficiencies
1. **Lack of Unified Progressive Disclosure:**  
   Forms oscillate unpredictably between 52-field single-page monoliths (e.g., SMILE Step 1) and 10-step micro-wizards (NAPDDR). There is no architectural consistency in cognitive pacing.
2. **Disconnected Ecosystem Sinks:**  
   Key modules (CCTV Setup, Weekly Attendance, Attendance Master, Project Location Change) are orphaned in isolated sidebar silos rather than being contextually embedded into the active grant application lifecycle.
3. **Absence of Real-Time Validation Feedback & Status Telemetry:**  
   When a user clicks "Next →", errors fail to scroll into view or announce to assistive tech. Status badges on the dashboard ("In Review", "Query Returned") lack timeline granularity (which desk in MoSJE is currently holding the file).

---

## Screen-by-Screen Deep UX & Usability Audit (Senior UX Designer Lens)

### 1. Portal Navigation & Dashboard (`00_portal_navigation/01_Dashboard.png`)
- **Fitts's Law & CTA Hierarchy:** The "Apply for New Grant" CTA is visually competing with 4 equal-weight metric cards. It must be the primary anchor on the hero surface.
- **Deficiency Visibility:** Deficiencies are rendered in a separate table below the fold. An active deficiency blocking disbursement should render as a top-level alert banner on login.
- **Mobile Responsive Degradation:** Multi-column metric summary tiles collapse into single-column vertical stacks exceeding 3400px of scrolling.

### 2. My Applications & Filter Tabs (`02_My_Applications.png` through `02e_ClosedRejected.png`)
- **Query / Return Workflow Defect:** When an application is returned under `02d_QueryReturned.png`, there is no direct "Respond to Query" inline action button in the table row. The user must navigate to the Deficiencies module to find the specific clause.
- **Empty States:** Empty tabs (e.g., "Closed / Rejected") show plain blank tables rather than helpful empty state illustrations with guidance on re-applying or appeal procedures.

### 3. Bank Accounts & Modal Management (`06_My_Bank_Accounts_List.png`, `06a_Add_Bank_Account_Modal_Empty.png`, `06b_Filled.png`)
- **Modal Focus Trapping & Esc Key Handling:** The modal dialog fails to trap tab focus in standard DOM keyboard navigation, allowing focus to escape into background table headers.
- **PFMS & EAT Module Integration Clarity:** Form fields do not clearly explain the requirement of registering the account under the EAT (Expenditure, Advance, Transfer) module before submitting grant requests.

### 4. Scheme Wizards Deep Flow Analysis

#### A. NAPDDR (10 Steps · `01_napddr/Step_01_Application_Type.png` to `Step_Final_Confirmation.png`)
- **Cognitive Load:** Step 4 (Infrastructure & Preparedness, 4026px height) asks for building ownership, room counts, fire safety, and CCTV simultaneously. This section should be split or organized with collapsible accordions.
- **Error Recovery:** In Step 8 (Verification), PAN validation rejects valid inputs if whitespace is inadvertently trailing.

#### B. AVYAY (8 Steps · `02_avyay/Step_01_Application_Type.png` to `Step_Final_Confirmation.png`)
- **Cost Norms Calculator:** Step 6 features a dynamic cost-norms panel. However, the calculation logic is opaque to the user; calculating item-wise allocations does not explain why certain heads (e.g., nutrition vs. doctor honorarium) are capped.

#### C. SHRESHTA Mode 2 (6 Steps · `03_shreshta_mode_2/`)
- **Institution Auto-Population:** Selecting an existing institution ID auto-populates fields, but does not provide visual confirmation badges showing which values were inherited from the previous year.

#### D. SMILE / Garima Greh (6 Steps · `04_smile_garima_greh/`)
- **Monolithic Step 1 (52 Fields, 6084px tall):** Combining Society Registration, Managing Committee rosters, and 3-year Financial Turnover in a single scrollable form triggers severe form fatigue and abandonment risk.

---

## Visual Design, Token Discipline & A11y Audit (Senior Visual Designer Lens)

### 1. Color Contrast & Token Deviations (WCAG 2.2 AA)
- **Hardcoded Hex Values:** Found raw colors (`#1e3a6e`, `#f9fafb`, `#162e58`) in active live buttons and border borders instead of semantic design tokens (`--sa-color-action-primary-default`, `--sa-color-surface-subtle`).
- **Form Input Focus Rings:** Input focus state uses browser-default 1px outline instead of the 3:1 contrast ratio 2px focus ring (`--sa-radius-md`, `--sa-focus-ring`).

### 2. Typography & Spatial System
- **Noto Sans Font Hierarchy:** Headings mix `text-lg` (18px) and `text-2xl` (24px) without clear semantic level correlation.
- **Table Density & Target Sizes:** Action icons inside tables have touch target areas under 32x32px, violating the 44x44px minimum touch target standard (WCAG 2.5.5 / GIGW 3.0).

---

## Comprehensive Screenshot Inventory Catalogue

| Directory / Flow | File Name | Resolution | Description & Key Observation |
|---|---|---|---|
| `00_portal_navigation` | `01_Dashboard.png` | 2268x3415 | NGO Master Dashboard with stats, recent grants & deficiencies |
| `00_portal_navigation` | `02_My_Applications.png` | 2268x2028 | Full Applications Register with status badges |
| `00_portal_navigation` | `02a_My_Applications_Tab_Submitted.png` | 2268x1530 | Submitted applications filter tab |
| `00_portal_navigation` | `02b_My_Applications_Tab_InReview.png` | 2268x2049 | In-Review applications filter tab |
| `00_portal_navigation` | `02c_My_Applications_Tab_Approved.png` | 2268x1885 | Approved applications filter tab |
| `00_portal_navigation` | `02d_My_Applications_Tab_QueryReturned.png` | 2268x1465 | Query Returned applications filter tab |
| `00_portal_navigation` | `02e_My_Applications_Tab_ClosedRejected.png` | 2268x1465 | Closed/Rejected applications filter tab |
| `00_portal_navigation` | `03_Deficiencies.png` | 2268x4021 | Full Deficiencies Register with query resolution threads |
| `00_portal_navigation` | `04_Select_Scheme.png` | 2268x1545 | 4 Scheme Selection Cards with eligibility info |
| `00_portal_navigation` | `05_Project_Location_Change_Empty.png` | 2268x1465 | Project Location Change request form (Initial) |
| `00_portal_navigation` | `05a_Project_Location_Change_Filled.png` | 2268x1567 | Project Location Change request form (Filled) |
| `00_portal_navigation` | `06_My_Bank_Accounts_List.png` | 2268x3454 | Verified PFMS/EAT Bank Accounts Register |
| `00_portal_navigation` | `06a_Add_Bank_Account_Modal_Empty.png` | 2268x3913 | Add Bank Account Modal Dialog (Empty state) |
| `00_portal_navigation` | `06b_Add_Bank_Account_Modal_Filled.png` | 2268x3945 | Add Bank Account Modal Dialog (Filled state) |
| `00_portal_navigation` | `07_Notifications.png` | 2268x3798 | Notifications & Broadcast Inbox |
| `00_portal_navigation` | `08_Weekly_Attendance_Dashboard.png` | 2268x1465 | Weekly Attendance Management sub-view |
| `00_portal_navigation` | `09_Attendance_Master_Dashboard.png` | 2268x1747 | Attendance Master Roster sub-view |
| `00_portal_navigation` | `10_CCTV_Setup_Form.png` | 2268x1465 | CCTV Setup & Live Stream configuration (Empty) |
| `00_portal_navigation` | `10a_CCTV_Setup_Filled.png` | 2268x1465 | CCTV Setup & Live Stream configuration (Filled) |
| `01_napddr` | `Step_01_Application_Type.png` | 2268x1852 | NAPDDR: Application Type & Category |
| `01_napddr` | `Step_02_Organisation_Details.png` | 2268x2931 | NAPDDR: Organisation Identity & Darpan Prefill |
| `01_napddr` | `Step_03_Project_Details.png` | 2268x2328 | NAPDDR: Project Overview & Target Groups |
| `01_napddr` | `Step_04_Location_Infrastructure_Preparedness.png` | 2268x4026 | NAPDDR: Facility, CCTV, Police & Safety |
| `01_napddr` | `Step_05_Key_Functionaries_Staff.png` | 2268x2199 | NAPDDR: Clinical & Counseling Staff Roster |
| `01_napddr` | `Step_06_Organisational_Capability_Prior_Work.png` | 2268x2130 | NAPDDR: Experience & Past Track Record |
| `01_napddr` | `Step_07_Beneficiaries_Bank_Grant_Sought.png` | 2268x2977 | NAPDDR: Beneficiary Targets & Budget Estimates |
| `01_napddr` | `Step_08_Verification_Authorised_Person.png` | 2268x1833 | NAPDDR: Authorised Signatory Verification |
| `01_napddr` | `Step_09_Document_Uploads_Checklist.png` | 2268x3787 | NAPDDR: 17 Mandatory Document Upload Slots |
| `01_napddr` | `Step_10_Review_And_Submit.png` | 2268x2670 | NAPDDR: Summary Review & Legal Declaration |
| `01_napddr` | `Step_Final_Confirmation.png` | 2268x2949 | NAPDDR: Success & Acknowledgement Card |
| `02_avyay` | `Step_01_Application_Type.png` | 2268x1575 | AVYAY: New / Renewal Selection |
| `02_avyay` | `Step_02_Organisation_Details.png` | 2268x2629 | AVYAY: Organisation Details |
| `02_avyay` | `Step_03_Project_Details.png` | 2268x1740 | AVYAY: Senior Citizen Facility Scope |
| `02_avyay` | `Step_04_Justification_Need_Assessment.png` | 2268x1869 | AVYAY: District Need Assessment & Justification |
| `02_avyay` | `Step_05_Location_Infra_Beneficiaries_Bank.png` | 2268x3216 | AVYAY: Building, Beds, Residents & Bank |
| `02_avyay` | `Step_06_Grant_Sought_Cost_Norms.png` | 2268x2362 | AVYAY: Cost Norms Entitlement & Budget |
| `02_avyay` | `Step_07_Document_Uploads_Checklist.png` | 2268x3232 | AVYAY: 11 Document Upload Slots |
| `02_avyay` | `Step_08_Review_And_Submit.png` | 2268x2533 | AVYAY: Application Readback & Signatory |
| `02_avyay` | `Step_Final_Confirmation.png` | 2268x2533 | AVYAY: Submission Success & Application ID |
| `03_shreshta_mode_2` | `Step_01_Organisation_Details.png` | 2268x2506 | SHRESHTA: NGO Registration & Contacts |
| `03_shreshta_mode_2` | `Step_02_Institution_Details.png` | 2268x2484 | SHRESHTA: Residential School / Hostel Details |
| `03_shreshta_mode_2` | `Step_03_Bank_GIA_Beneficiaries_Grant.png` | 2268x2484 | SHRESHTA: Student Intake & Fee Norms |
| `03_shreshta_mode_2` | `Step_04_Compliance_Declarations_Authorised.png` | 2268x2484 | SHRESHTA: Statutory Compliance & Inspection Report |
| `03_shreshta_mode_2` | `Step_05_Document_Uploads_Checklist.png` | 2268x2415 | SHRESHTA: 20 Document Upload Slots |
| `03_shreshta_mode_2` | `Step_06_Review_And_Submit.png` | 2268x2415 | SHRESHTA: Full Readback & Declaration |
| `03_shreshta_mode_2` | `Step_Final_Confirmation.png` | 2268x2415 | SHRESHTA: Final Submission Acknowledgement |
| `04_smile_garima_greh` | `Step_01_Organisation_Details_52_Fields.png` | 2268x6084 | SMILE: 52-Field Monolithic Organisation Profile |
| `04_smile_garima_greh` | `Step_02_Institution_Details_Location.png` | 2268x6408 | SMILE: Shelter Home Location & Amenities |
| `04_smile_garima_greh` | `Step_03_Bank_Residents_Grant_Estimate.png` | 2268x6408 | SMILE: Residents Capacity & Livelihood Grant |
| `04_smile_garima_greh` | `Step_04_Compliance_Declarations_Authorised.png` | 2268x6408 | SMILE: Social Security & Police Jurisdiction |
| `04_smile_garima_greh` | `Step_05_Document_Uploads_Checklist.png` | 2268x6408 | SMILE: 12 Document Checklist |
| `04_smile_garima_greh` | `Step_06_Review_And_Submit.png` | 2268x6408 | SMILE: Readback & Final Review |
| `04_smile_garima_greh` | `Step_Final_Confirmation.png` | 2268x6408 | SMILE: Final Submission Acknowledgement |

---

## Strategic Recommendations & Implementation Roadmap

1. **Adopt Unified Wizard Pacing:** Refactor SMILE's 52-field step into 4 progressive sections (Identity, Management Committee, Financial History, Registered Office).
2. **Contextual Action Links in Application Register:** Add direct "Fix Deficiency" and "Download Submitted PDF" action buttons in the Applications table.
3. **Design System Token Refactoring:** Replace all remaining hardcoded hex codes with `@mosje/tokens` variables.
4. **Enhanced Real-Time A11y Feedback:** Implement live ARIA live-region error announcements and dynamic stepper indicators.
