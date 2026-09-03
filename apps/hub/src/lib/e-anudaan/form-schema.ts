/**
 * The E-Anudaan grant application forms, as declarative schemas — one per scheme.
 *
 * Transcribed field-by-field from the live wizards on eanudaan-user-dev.mosje.in
 * (walkthrough 2026-08-22, recorded in docs/research/eanudaan-user-dev.mosje.in/INVENTORY.md).
 *
 * The single most important correction to the earlier clone: **there is no shared wizard**.
 * Each scheme has its own step count, its own sections and its own document checklist:
 *
 *   SHRESHTA_M2  6 steps   20 documents   (PDF / JPG / PNG)
 *   AVYAY      8/7 steps  11/9 documents  (PDF)          + a cost-norms panel on the grant step
 *                  NEW branch has 8 steps and 11 documents; renewal 7 and 9.
 *   SMILE        6 steps   12 documents   (PDF)
 *   NAPDDR      10 steps   17 documents   (PDF)
 *
 * Routing note, also from the walkthrough: the early steps sit under `.../step-1`, the upload
 * step under `.../step-2` and the read-back under `.../review`. Step state within `step-1` is
 * internal and the stepper indicators are display-only.
 */

// The SUBPATH, not the barrel: importing from the package root pulls in every
// component and its CSS, which `node --test` cannot resolve — it broke two
// e-anudaan test files that had nothing to do with this change.
import { isValidPan } from "@mosje/design-system/india-id";

import { CITY_CATEGORIES, INDIAN_STATES, cityCategoryFor } from "./geography.ts";

export type SchemeCode = "SHRESHTA_M2" | "AVYAY" | "SMILE" | "NAPDDR";

export type FieldKind =
  | "text"
  | "tel"
  | "email"
  | "date"
  | "time"
  | "number"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox";

/** How a field's value is produced when the user does not type it. */
export type AutoRule =
  | { kind: "sum"; from: readonly string[] }
  /** City category is filled in from the chosen district (live helper text says exactly this). */
  | { kind: "cityCategory"; from: string }
  /**
   * AVYAY's account number, IFSC and bank/branch, which live fills in from the Bank Account
   * chosen above rather than asking for them. The option reads
   * "<bank> · <masked account> · <IFSC>", so each part is one segment of it.
   */
  | { kind: "bankAccountPart"; from: string; part: "account" | "ifsc" | "bankAndBranch" };

export interface FieldDef {
  name: string;
  label: string;
  kind: FieldKind;
  required?: boolean;
  /** Rendered under the control, verbatim from the live form. */
  help?: string;
  options?: readonly string[];
  /**
   * The live form labels several fields "Read-only — sourced from NGO-Darpan / your login" but
   * leaves them editable in the DOM (defect D8). The clone honours the claim rather than the
   * defect — see docs/research/eanudaan-dev-defects.md.
   */
  readOnly?: boolean;
  /** Character budget; renders the live "n / N characters" counter. */
  maxLength?: number;
  /** Show the field only while another field holds one of these values. */
  showWhen?: { field: string; equals: readonly string[] };
  /**
   * Some OPTIONS fork, not the whole field. AVYAY's Nature of Project is the case: live offers
   * Physiotherapy Clinic and Mobile Medicare Unit to renewals only (FR-NEW-04). Before this the
   * rule lived in help text and nothing enforced it, so a new applicant could pick a project type
   * the scheme forbids and submit it.
   */
  optionsOnlyWhen?: {
    field: string;
    equals: readonly string[];
    options: readonly string[];
  };
  /**
   * Read-only on some branches and editable on others. AVYAY's Bank Account says "it cannot be
   * changed on a renewal" in its help and was fully editable — a stated rule the form did not
   * apply.
   */
  readOnlyWhen?: { field: string; equals: readonly string[] };
  /** Options come from a state field rather than a literal list (cascading District). */
  districtsOf?: string;
  /** Value derived from other fields; the control renders read-only. */
  auto?: AutoRule;
  /** Extra validation beyond "required". */
  rule?: "afterRegistration" | "afterPeriodFrom" | "nameAndPhone" | "lettersOnly" | "pin" | "ifsc" | "pan";
  /** Span the full width of the two-column grid. */
  wide?: boolean;
}

export interface SectionDef {
  title: string;
  lead?: string;
  fields: readonly FieldDef[];
}

export type StepKind = "form" | "documents" | "review";

export interface StepDef {
  /** Stepper label, e.g. "Organisation Details". */
  title: string;
  kind?: StepKind;
  /** Overrides the default "Next →" at the foot of this step. */
  nextLabel?: string;
  /**
   * Whole steps fork too, not just fields and documents. AVYAY is the case that forced this:
   * live shows a new project EIGHT steps and a renewal SEVEN, the missing one being
   * Justification — a renewal carries its justification forward from the sanctioned project.
   * Without this the step list could not vary, so whichever count was hard-coded left one
   * branch wrong: our clone showed the renewal an eighth step it never asks for.
   */
  showWhen?: { field: string; equals: readonly string[] };
  sections: readonly SectionDef[];
}

export interface DocDef {
  n: number;
  title: string;
  /** The live conditional line, e.g. "Required when the institution building is rented." */
  note?: string;
  /** NAPDDR renders a one-line description under each slot instead of a conditional note. */
  description?: string;
  optional?: boolean;
  /**
   * Some checklists depend on an answer given earlier. AVYAY is the case that forced this: a new
   * project is asked for the NGO's own PAN, two years of annual reports, two years of audited
   * accounts and a fire safety audit, while a renewal is asked instead for a budget estimate, the
   * project's audited accounts and a GFR-12A utilisation certificate.
   */
  showWhen?: { field: string; equals: readonly string[] };
}

export interface WizardDef {
  code: SchemeCode;
  /** The <h1> above the stepper, verbatim. */
  title: string;
  steps: readonly StepDef[];
  documents: readonly DocDef[];
  /** The line under the documents heading, e.g. "PDF / JPG / PNG · Max 5 MB per file · All mandatory." */
  documentsNote: string;
  /** AVYAY alone shows the cost-norms entitlement panel above the grant fields. */
  costNorms?: boolean;
}

const YES_NO = ["Yes", "No"] as const;
/** SMILE's two case_type answers, referenced by the fields that fork on them. */
const SMILE_CASE_NEW = "No — new project (Project ID auto-generated)";
const SMILE_CASE_EXISTING = "Yes — existing project (select the Project ID)";
const FINANCIAL_YEARS = ["2027-28", "2026-27", "2025-26"] as const;

/** The declaration that closes every scheme's review step, verbatim from the live portal. */
export const DECLARATION_TEXT =
  "I declare that the information furnished in this application and in every document uploaded " +
  "with it is true, complete and correct to the best of my knowledge and belief. I understand " +
  "that the grant-in-aid may be withheld or recovered, and action taken under the rules, if any " +
  "particular is found to be false or if any material fact has been concealed.";

/* ══════════════════════════════════════════════════════════════════════════════
   SHRESHTA Mode 2 — 6 steps
   ══════════════════════════════════════════════════════════════════════════════ */

const SHRESHTA_STEPS: readonly StepDef[] = [
  {
    title: "Organisation Details",
    sections: [
      {
        title: "Organisation Details",
        lead: "Identity of the applicant NGO/VO. Pre-filled from NGO-Darpan where available.",
        fields: [
          { name: "fld_ngo_name", label: "Name of NGO / VO (as in NGO-Darpan)", kind: "text", required: true, readOnly: true, help: "Read-only — sourced from NGO-Darpan / your login." },
          { name: "fld_darpan_id", label: "NGO-Darpan Unique ID", kind: "text", required: true, readOnly: true, help: "Read-only — sourced from NGO-Darpan / your login." },
          { name: "fld_statute_act", label: "Statute / Act of Registration", kind: "text", required: true, help: "From NGO-Darpan where recorded; enter it yourself if the box is empty." },
          { name: "fld_registration_number", label: "Registration Number", kind: "text", required: true, help: "From NGO-Darpan / your login." },
          { name: "fld_registration_date", label: "Date of Registration", kind: "date", required: true, help: "From NGO-Darpan where recorded; enter it yourself if the box is empty." },
          { name: "fld_registration_expiry", label: "Date of Expiry", kind: "date", required: true, rule: "afterRegistration", help: "Not held by NGO-Darpan — please enter it. Must be later than the date of registration." },
          { name: "fld_reg_office_address", label: "Registered-Office Address", kind: "textarea", required: true, wide: true },
          { name: "fld_reg_office_city", label: "City", kind: "text", required: true },
          { name: "fld_reg_office_district", label: "District", kind: "text", required: true },
          { name: "fld_reg_office_state", label: "State", kind: "text", required: true },
          { name: "fld_contact_mobile", label: "Mobile", kind: "tel", required: true, help: "Pre-filled from your login. Used for notifications." },
          { name: "fld_contact_email", label: "Email", kind: "email", required: true, help: "Pre-filled from your login. Used for notifications." },
          { name: "fld_contact_telephone", label: "Telephone", kind: "tel" },
          { name: "fld_contact_fax", label: "Fax", kind: "text" },
        ],
      },
    ],
  },
  {
    title: "Institution Details",
    sections: [
      {
        title: "Institution Details",
        lead: "Details of the institution for which Grant-in-Aid is sought.",
        fields: [
          {
            name: "fld_project_id",
            label: "Institution",
            kind: "select",
            wide: true,
            options: [
              "SC/DL/NWD/09001 — Hostel, North West Delhi · last applied FY 2025-26",
              "SC/DL/STS/09002 — Hostel, South East Delhi · last applied FY 2025-26",
              "SC/GJ/AHM/02031 — Residential School · last applied FY 2025-26",
              "SC/GJ/AHM/02059 — Hostel · last applied FY 2025-26",
              "SC/TN/KLI/02302 — Residential School, Kallakurichi · last applied FY 2025-26",
              "SC/TN/MDR/02397 — Residential School, Madurai · last applied FY 2025-26",
              "SC/UP/BRB/01338 — Residential School, Barabanki · last applied FY 2025-26",
              "SC/UP/HAR/01609 — Residential School, Hardoi · last applied FY 2025-26",
            ],
            help: "If this application is for an institution you have applied for before, choose it and the details below are filled in from its own last application — you can still edit any of them. Leave blank for a new institution, or if yours is not listed.",
          },
          { name: "fld_institution_id", label: "Institution ID", kind: "text", required: true, help: "Scheme institution identifier." },
          { name: "fld_financial_year", label: "Financial Year for which GIA is sought", kind: "select", required: true, options: FINANCIAL_YEARS },
          {
            name: "fld_nature_of_institution",
            label: "Nature of Institution",
            kind: "select",
            required: true,
            options: [
              "Primary Residential School",
              "Secondary Residential School",
              "Primary Non-Residential School",
              "Secondary Non-Residential School",
              "Primary Hostel",
              "Secondary Hostel",
            ],
          },
          { name: "fld_institution_gender_type", label: "Type", kind: "select", required: true, options: ["Boys", "Girls", "Co-Ed"] },
          { name: "fld_institution_level", label: "Level", kind: "select", required: true, options: ["Primary", "Secondary"] },
          { name: "fld_institution_status", label: "Status of Institution", kind: "select", required: true, options: ["Ongoing"] },
          { name: "assistance_3yrs", label: "Receiving assistance continuously for the last 3 years", kind: "radio", required: true, options: YES_NO, wide: true },
          { name: "fld_uc_pending_status", label: "UC Pending Status (SFR 212(1))", kind: "select", required: true, options: ["No UC Pending", "UC Pending"] },
          { name: "fld_commencement_date", label: "Date & Year of Commencement", kind: "date", required: true },
          { name: "fld_gia_since_year", label: "Year from which GIA received under SHRESHTA", kind: "text", required: true, help: "Applies to ongoing institutions." },
          { name: "fld_institution_location", label: "Institution Location (address, district, landmark, contact)", kind: "textarea", required: true, wide: true },
          { name: "fld_institution_pin", label: "Institution PIN Code", kind: "text", required: true, rule: "pin" },
          { name: "govt_institution_within_2km", label: "Government-run similar institution within 2 km", kind: "radio", required: true, options: YES_NO, wide: true },
          { name: "fld_building_ownership", label: "Building Owned / Rented", kind: "select", required: true, options: ["Owned", "Rented"] },
        ],
      },
    ],
  },
  {
    title: "Bank, Beneficiaries & Grant",
    sections: [
      {
        title: "Bank Account Details",
        fields: [
          { name: "bank_ngo_name_declared", label: "Account is in the name of the NGO/VO", kind: "radio", required: true, options: YES_NO, wide: true },
          { name: "bank_joint_operation", label: "Account jointly operated by President & Secretary", kind: "radio", required: true, options: YES_NO, wide: true },
          { name: "bank_hq_at_institution", label: "Head office at the institution location", kind: "radio", required: true, options: YES_NO, wide: true },
          { name: "bank_joint_secretary_head", label: "Joint account of Secretary & Head at the location", kind: "radio", required: true, options: YES_NO, wide: true },
          { name: "bank_separate_institution_accounts", label: "Separate institution-wise accounts maintained", kind: "radio", required: true, options: YES_NO, wide: true },
          { name: "fld_bank_account_number", label: "Account Number", kind: "text", required: true },
          { name: "fld_bank_ifsc", label: "IFSC Code", kind: "text", required: true, rule: "ifsc" },
          { name: "fld_bank_name_branch", label: "Bank & Branch", kind: "text", required: true },
          { name: "fld_bank_resource_mobilisation", label: "Resource-mobilisation capability (sources / amount)", kind: "textarea", wide: true },
        ],
      },
      {
        title: "GIA Released — Last 3 Years",
        lead: "For ongoing cases. Optional.",
        fields: [
          { name: "fld_gia_released_last_3yrs", label: "GIA released in last 3 years (sanction no., date, amount sanctioned, amount utilised)", kind: "textarea", wide: true },
        ],
      },
      {
        title: "Beneficiaries",
        fields: [
          { name: "fld_beneficiaries_sc", label: "SC Beneficiaries", kind: "number", required: true, help: "Number of Scheduled-Caste beneficiaries." },
          { name: "fld_beneficiaries_other", label: "Other-Category Beneficiaries", kind: "number", help: "Beneficiaries from other categories, if any." },
          { name: "fld_total_beneficiaries", label: "Total Number of Beneficiaries", kind: "number", required: true, auto: { kind: "sum", from: ["fld_beneficiaries_sc", "fld_beneficiaries_other"] }, help: "Auto-calculated: SC + Other. Visible to all reviewers." },
          { name: "fld_beneficiaries_previous_year", label: "Number of Beneficiaries (Previous Year)", kind: "number" },
        ],
      },
      {
        title: "Grant Sought",
        lead: "Recurring + Non-recurring = Total.",
        fields: [
          { name: "fld_grant_recurring", label: "Recurring Grant Sought (₹)", kind: "number", required: true },
          { name: "fld_grant_non_recurring", label: "Non-Recurring Grant Sought (₹)", kind: "number", required: true },
          { name: "fld_grant_total", label: "Total Grant Sought (₹)", kind: "number", required: true, auto: { kind: "sum", from: ["fld_grant_recurring", "fld_grant_non_recurring"] }, help: "Auto-calculated: recurring + non-recurring." },
        ],
      },
    ],
  },
  {
    title: "Declarations",
    nextLabel: "Next: Documents →",
    sections: [
      {
        title: "Compliance Declarations",
        lead: "Confirm each declaration; provide value / source where applicable.",
        fields: [
          { name: "decl_uc_uploaded", label: "Requisite Utilisation Certificate uploaded", kind: "radio", required: true, options: YES_NO, wide: true },
          { name: "decl_audited_accounts_submitted", label: "Audited accounts (previous year) submitted", kind: "radio", required: true, options: YES_NO, wide: true },
          { name: "decl_name_changed_after_grant", label: "Organisation changed its name after the first grant", kind: "radio", required: true, options: YES_NO, wide: true },
          { name: "decl_not_for_profit", label: "Organisation is not run for profit", kind: "radio", required: true, options: YES_NO, wide: true, help: "Confirm the NGO/VO does not earn profit by running the institution." },
          { name: "decl_other_grant", label: "Receiving grant from another Govt source for the same purpose", kind: "radio", required: true, options: YES_NO, wide: true },
          { name: "decl_fee_charged", label: "Capitation / other fee charged from beneficiaries", kind: "radio", required: true, options: YES_NO, wide: true },
          { name: "decl_not_blacklisted", label: "Organisation is not blacklisted", kind: "radio", required: true, options: YES_NO, wide: true, help: "Confirm the organisation is not blacklisted by any authority." },
          { name: "decl_annual_report_uploaded", label: "Annual report (previous year) uploaded", kind: "radio", required: true, options: YES_NO, wide: true },
          { name: "decl_all_docs_signed", label: "All documents signed by the authorised signatory", kind: "radio", required: true, options: YES_NO, wide: true },
        ],
      },
      {
        title: "Authorised Person & Declaration",
        fields: [
          { name: "fld_auth_person_name", label: "Name of Authorised Person", kind: "text", required: true },
          { name: "fld_auth_person_contact", label: "Contact of Authorised Person", kind: "tel", required: true },
          { name: "fld_auth_place", label: "Place", kind: "text", required: true },
          { name: "fld_auth_date", label: "Date", kind: "date", required: true },
          { name: "fld_auth_time", label: "Time", kind: "time", required: true },
        ],
      },
    ],
  },
  { title: "Upload Documents", kind: "documents", sections: [] },
  { title: "Review & Submit", kind: "review", sections: [] },
];

const SHRESHTA_DOCS: readonly DocDef[] = [
  { n: 1, title: "Registration Certificate (Societies Registration Act 1860 / Charitable Trust) — certified copy" },
  { n: 2, title: "PAN of the Organisation" },
  { n: 3, title: "Annual Report — Previous Financial Year" },
  { n: 4, title: "List of Beneficiaries — Previous Year" },
  { n: 5, title: "List of Managing Committee Members" },
  { n: 6, title: "Budget Estimates — Current Year" },
  { n: 7, title: "Audited Accounts (Balance Sheet, Income & Expenditure, Receipt & Payment)" },
  { n: 8, title: "Utilisation Certificate (GFR 12-A) — Previous Year, CA-signed", note: "Required when the institution already receives GIA." },
  { n: 9, title: "Provisional UCs — Grants Released Previous Year (GFR 12-A)", note: "Required when the institution already receives GIA." },
  { n: 10, title: "Bank Authorisation Letter (name, A/C no., address, IFSC / MICR)" },
  { n: 11, title: "Agreement Bond / PSR on Non-Judicial Stamp Paper" },
  { n: 12, title: "Compliance Status — Proactive Disclosures & CCTV Installation" },
  { n: 13, title: "EAT Module Implementation Status" },
  { n: 14, title: "Justification for Continuation of Ongoing Institution", note: "Required when the institution already receives GIA." },
  { n: 15, title: "Accounts in Parts (I&E, R&P, Balance Sheet, Auditor's Report)" },
  { n: 16, title: "List of Employees (name, designation, category, photo ID, Aadhaar)" },
  { n: 17, title: "Rent Agreement, Institution Location & Route Map", note: "Required when the institution building is rented.", optional: true },
  { n: 18, title: "Details of Income and Expenditure" },
  { n: 19, title: "School Recognition Certificate" },
  { n: 20, title: "Audit Report — Previous Year" },
];

export const SHRESHTA_WIZARD: WizardDef = {
  code: "SHRESHTA_M2",
  title: "SHRESHTA Mode-2 — Grant-in-Aid (Residential Education)",
  steps: SHRESHTA_STEPS,
  documents: SHRESHTA_DOCS,
  documentsNote: "PDF / JPG / PNG · Max 5 MB per file · All mandatory.",
};

/* ══════════════════════════════════════════════════════════════════════════════
   AVYAY (Atal Vayo Abhyuday Yojana) — 8 steps new / 7 renewal, with the cost-norms panel
   ══════════════════════════════════════════════════════════════════════════════ */

/** The live standing notice that sits under the AVYAY stepper on every step. */
export const AVYAY_RENEWAL_NOTICE =
  "A project becomes renewable once it has been sanctioned and has then passed its PMU " +
  "inspection. Only PMU-verified projects can be selected.";

const AVYAY_STEPS: readonly StepDef[] = [
  {
    title: "Application Type",
    sections: [
      {
        title: "Application Type",
        lead: "Is this a fresh (new) project, or a renewal of one of your existing (ongoing) projects?",
        fields: [
          {
            name: "case_type",
            label: "Case Type",
            kind: "radio",
            required: true,
            wide: true,
            options: ["New project", "Ongoing / Renewal of an existing project"],
            help: "Choose 'Ongoing / Renewal' to carry forward the details of one of your existing AVYAY projects.",
          },
          {
            name: "fld_ongoing_source_application",
            label: "Select the existing project to renew",
            kind: "select",
            required: true,
            wide: true,
            showWhen: { field: "case_type", equals: ["Ongoing / Renewal of an existing project"] },
            options: ["IP/AR/DIB/40040 — Senior Citizens' Home, Dibang Valley · awaiting sanction"],
            help: "The whole form is prefilled from the selected project (FR-ONG-03/04). You can edit any field — on submit a new application is created for the chosen financial year.",
          },
          {
            name: "fld_financial_year",
            label: "Financial Year for which grant is sought",
            kind: "select",
            required: true,
            options: FINANCIAL_YEARS,
            help: "A new application is always for the financial year now running. For a renewal, this is the year whose instalment you are claiming — changing it re-checks which instalments are still open for this project.",
          },
          {
            name: "fld_installment_no",
            label: "Installment",
            kind: "select",
            required: true,
            // Renewal only. A first-time applicant has no recurring grant and no prior
            // instalments, and live does not ask them — it shows the financial year alone.
            // Without this the field rendered on both branches, `required`, and blocked the
            // whole new-project path with "Installment is required."
            showWhen: { field: "case_type", equals: ["Ongoing / Renewal of an existing project"] },
            options: ["1st Installment", "2nd Installment", "3rd Installment", "4th Installment"],
            help: "Which installment of the selected financial year's recurring grant this application releases. The next un-submitted installment for that year is preselected; ones already submitted for the same year are marked and cannot be reselected.",
          },
        ],
      },
    ],
  },
  {
    title: "Organisation Details",
    sections: [
      {
        title: "Organisation Details",
        lead: "Identity of the applicant NGO/VO. Pre-filled from NITI Aayog NGO-Darpan where available (FR-NEW-02).",
        fields: [
          { name: "fld_ngo_name", label: "Name of NGO / VO (as in NGO-Darpan)", kind: "text", required: true, readOnly: true, help: "Pre-filled from your login / NGO-Darpan." },
          { name: "fld_darpan_id", label: "NGO-Darpan Unique ID", kind: "text", required: true, readOnly: true, help: "Pre-filled from your login. Key for identity read and for duplicate-project prevention (FR-ONG-01)." },
          { name: "fld_project_id", label: "Project ID", kind: "text", readOnly: true, wide: true, help: "Generated automatically on submit as IP / State abbreviation / District abbreviation / a unique number. For an ongoing renewal, the existing project's ID is retained (FR-ONG-02)." },
          { name: "fld_statute_act", label: "Statute / Act of Registration", kind: "text", required: true },
          { name: "fld_registration_number", label: "Registration Number", kind: "text", required: true, help: "As printed on your registration certificate under the Act named above." },
          { name: "fld_registration_date", label: "Date of Registration", kind: "date", required: true },
          { name: "fld_reg_office_address", label: "Registered-Office Address", kind: "textarea", required: true, wide: true, maxLength: 500 },
          { name: "fld_reg_office_state", label: "State", kind: "select", required: true, options: INDIAN_STATES, help: "Select the State of your registered office." },
          { name: "fld_reg_office_district", label: "District", kind: "select", required: true, districtsOf: "fld_reg_office_state", help: "Choose a State first, then its District." },
          { name: "fld_contact_mobile", label: "Mobile", kind: "tel", required: true, help: "Pre-filled from your login. Used for notifications." },
          { name: "fld_contact_email", label: "Email", kind: "email", required: true, help: "Pre-filled from your login. Used for notifications." },
          { name: "fld_contact_telephone", label: "Telephone", kind: "tel" },
          { name: "moa_includes_senior_citizens", label: "MOA includes welfare of senior citizens as an aim/objective", kind: "radio", required: true, options: YES_NO, wide: true },
        ],
      },
    ],
  },
  {
    title: "Project Details",
    sections: [
      {
        title: "Project Details",
        lead: "The project for which grant-in-aid is sought.",
        fields: [
          {
            name: "fld_nature_of_project",
            label: "Nature of Project",
            kind: "select",
            required: true,
            wide: true,
            optionsOnlyWhen: {
              field: "case_type",
              equals: ["Ongoing / Renewal of an existing project"],
              options: ["Physiotherapy Clinic", "Mobile Medicare Unit"],
            },
            options: [
              "Senior Citizens' Home — 25 beneficiaries",
              "Senior Citizens' Home — 50 beneficiaries",
              "Senior Citizens' Home — 50 elderly women only",
              "Continuous Care Home (CCH) / Dementia / Alzheimer's",
              // Renewal-only, per the help below and FR-NEW-04. These two were named in the help
              // text and were not in this list at all, so the sentence promised project types the
              // field never offered to anyone. Labels still to be confirmed against live.
              "Physiotherapy Clinic",
              "Mobile Medicare Unit",
            ],
            help: "Physiotherapy Clinic and Mobile Medicare Unit are supported for renewal/ongoing cases only (FR-NEW-04).",
          },
          {
            name: "fld_agency_type",
            label: "Type of Implementing Agency",
            kind: "select",
            required: true,
            wide: true,
            options: [
              "NGO",
              "Voluntary Organisation",
              "State Government",
              "Urban Local Body (ULB)",
              "Panchayati Raj Institution (PRI)",
              "Regional Resource & Training Centre (RRTC)",
              "Autonomous Body",
              "Educational Institution",
            ],
            help: "Central share is derived from this and the project State: State Govt / ULB / PRI / RRTC → 100%; NE & Himalayan States → 95%; elsewhere → 90%.",
          },
          { name: "fld_project_state", label: "Project State", kind: "select", required: true, options: INDIAN_STATES, help: "State where the project is located." },
          { name: "fld_project_district", label: "Project District", kind: "select", required: true, districtsOf: "fld_project_state", help: "Choose the Project State first, then its District." },
          {
            name: "fld_city_category",
            label: "City Category (HRA)",
            kind: "select",
            required: true,
            options: CITY_CATEGORIES,
            auto: { kind: "cityCategory", from: "fld_project_district" },
            help: "Filled in from the project district once you choose it. Pick it yourself only if your district has not been classified yet.",
          },
        ],
      },
    ],
  },
  {
    title: "Justification",
    // New projects only — live gives a renewal seven steps, not eight. A renewal carries its
    // justification forward from the project already sanctioned.
    showWhen: { field: "case_type", equals: ["New project"] },
    sections: [
      {
        title: "Justification",
        lead: "Why the district needs this project. Walked on live 2026-08-23 — a step of its own between Project Details and the infrastructure step.",
        fields: [
          {
            name: "fld_services_available_in_district",
            label: "Services already available in the district",
            kind: "textarea",
            required: true,
            wide: true,
            maxLength: 1400,
            help: "Approximately 200 words.",
          },
          {
            name: "fld_distance_to_nearest_similar",
            label: "Distance to the nearest similar service (km)",
            // Live ships a text input and then rejects it with "must be a number"; a number input
            // enforces the same constraint without the round trip.
            kind: "number",
            required: true,
          },
          {
            name: "fld_other_justification",
            label: "Other justification (max 200 words)",
            kind: "textarea",
            wide: true,
            maxLength: 1400,
            help: "Approximately 200 words.",
          },
        ],
      },
    ],
  },
  {
    title: "Infrastructure, Beneficiaries & Bank",
    sections: [
      {
        title: "Project Location & Infrastructure",
        fields: [
          { name: "fld_project_location", label: "Project Location (full address, PIN, landmark)", kind: "textarea", required: true, wide: true, maxLength: 500 },
          { name: "fld_project_incharge", label: "Project In-charge (name & contact)", kind: "text", required: true, rule: "nameAndPhone" },
          { name: "fld_functional_status", label: "Functional Status", kind: "select", required: true, options: ["Functional", "Ready to commence"] },
          { name: "fld_commencement_date", label: "Date of Commencement", kind: "date", required: true },
          { name: "fld_building_ownership", label: "Building Owned / Rented", kind: "select", required: true, options: ["Owned", "Rented"] },
          { name: "fld_infra_area_sqft", label: "Total Area (sq.ft.)", kind: "number", required: true },
          { name: "fld_infra_rooms", label: "Number of Rooms", kind: "number", required: true },
          { name: "fld_infra_toilets", label: "Number of Toilets", kind: "number", required: true },
          { name: "infra_kitchen", label: "Kitchen available", kind: "radio", required: true, options: YES_NO, wide: true },
          { name: "infra_open_area", label: "Open / recreational area available", kind: "radio", required: true, options: YES_NO, wide: true },
          { name: "fld_key_staff_1", label: "Key Staff 1 (name & designation)", kind: "text", required: true, rule: "lettersOnly" },
          { name: "fld_key_staff_2", label: "Key Staff 2 (name & designation)", kind: "text" },
          { name: "beneficiaries_identified", label: "Beneficiaries identified", kind: "radio", required: true, options: YES_NO, wide: true },
        ],
      },
      {
        title: "Beneficiaries",
        fields: [
          { name: "fld_total_beneficiaries", label: "Number of indigent senior-citizen beneficiaries", kind: "number", required: true, help: "Minimum per nature of project: 25 / 50 (homes) or 20 (CCH). Visible to all reviewers." },
          { name: "fld_beneficiaries_women", label: "Of which women", kind: "number" },
        ],
      },
      {
        title: "Bank Account Details",
        fields: [
          { name: "bank_ngo_name_declared", label: "Account is in the name of the NGO/VO", kind: "radio", required: true, options: YES_NO, wide: true },
          {
            name: "fld_bank_account_id",
            label: "Bank Account",
            kind: "select",
            required: true,
            wide: true,
            readOnlyWhen: {
              field: "case_type",
              equals: ["Ongoing / Renewal of an existing project"],
            },
            options: ["State Bank of India · ••••••••••4417 · SBIN0001234"],
            help: "Carried forward from this project — it cannot be changed on a renewal. To change it, raise a request from My Bank Accounts; it takes effect once the Ministry approves it. Manage all your accounts from the 'My Bank Accounts' menu.",
          },
          { name: "fld_bank_account_number", label: "Account Number", kind: "text", required: true, readOnly: true, auto: { kind: "bankAccountPart", from: "fld_bank_account_id", part: "account" }, help: "Filled in automatically from the Bank Account you select above." },
          { name: "fld_bank_ifsc", label: "IFSC Code", kind: "text", required: true, readOnly: true, auto: { kind: "bankAccountPart", from: "fld_bank_account_id", part: "ifsc" }, help: "Filled in automatically from the Bank Account you select above." },
          { name: "fld_bank_name_branch", label: "Bank & Branch", kind: "text", required: true, readOnly: true, auto: { kind: "bankAccountPart", from: "fld_bank_account_id", part: "bankAndBranch" }, help: "Filled in automatically from the Bank Account you select above." },
        ],
      },
    ],
  },
  {
    title: "Grant Sought & Declaration",
    nextLabel: "Next: Documents →",
    sections: [
      {
        title: "Grant Sought",
        lead: "Recurring + Non-recurring = Total (§8). Non-recurring is released once every 5 years; recurring in two half-yearly installments after a positive inspection.",
        fields: [
          { name: "fld_grant_recurring", label: "Recurring Grant Sought (₹)", kind: "number", required: true, help: "Attendance-based running cost. The panel above shows what the norms allow." },
          { name: "fld_grant_non_recurring", label: "Non-Recurring Grant Sought (₹)", kind: "number", required: true, help: "One-time durables (CCTV, beds, utensils)." },
          { name: "fld_grant_total", label: "Total Grant Sought (₹)", kind: "number", required: true, auto: { kind: "sum", from: ["fld_grant_recurring", "fld_grant_non_recurring"] }, help: "Auto-calculated: recurring + non-recurring." },
        ],
      },
      {
        title: "Verification & Authorised Person",
        fields: [
          { name: "decl_no_money_from_beneficiaries", label: "No money is charged from the beneficiaries", kind: "radio", required: true, options: YES_NO, wide: true },
          { name: "decl_not_blacklisted", label: "Organisation is not blacklisted", kind: "radio", required: true, options: YES_NO, wide: true },
          { name: "fld_auth_person_name", label: "Name of Authorised Person", kind: "text", required: true },
          { name: "fld_auth_person_contact", label: "Contact of Authorised Person", kind: "tel", required: true },
          { name: "fld_auth_place", label: "Place", kind: "text", required: true },
          { name: "fld_auth_date", label: "Date", kind: "date", required: true },
        ],
      },
    ],
  },
  { title: "Upload Documents", kind: "documents", sections: [] },
  { title: "Review & Submit", kind: "review", sections: [] },
];

/**
 * AVYAY's checklist is branch-dependent. Walked on live 2026-08-23: the NEW branch renders these
 * eleven in this order; the renewal branch renders the six shared entries plus Budget Estimate,
 * Audited Accounts of Project and the GFR-12A. Ordered so that filtering by `case_type` reproduces
 * each branch's sequence exactly.
 */
const AVYAY_DOCS: readonly DocDef[] = [
  { n: 1, title: "Registration Certificate" },
  { n: 2, title: "PAN Card of the Organisation", showWhen: { field: "case_type", equals: ["New project"] } },
  { n: 3, title: "Annual Report of NGO — previous FY" },
  {
    n: 4,
    title: "Annual Report of NGO — previous-to-previous FY",
    showWhen: { field: "case_type", equals: ["New project"] },
  },
  {
    n: 5,
    title: "Audited Accounts of NGO — previous FY",
    showWhen: { field: "case_type", equals: ["New project"] },
  },
  {
    n: 6,
    title: "Audited Accounts of NGO — previous-to-previous FY",
    showWhen: { field: "case_type", equals: ["New project"] },
  },
  { n: 7, title: "Bank Details of the Project" },
  { n: 8, title: "Beneficiary List" },
  { n: 9, title: "Staff List" },
  { n: 10, title: "Rent Agreement" },
  { n: 11, title: "Fire Safety Audit Report", showWhen: { field: "case_type", equals: ["New project"] } },
  { n: 12, title: "Budget Estimate", showWhen: { field: "case_type", equals: ["Ongoing / Renewal of an existing project"] } },
  { n: 13, title: "Audited Accounts of Project", showWhen: { field: "case_type", equals: ["Ongoing / Renewal of an existing project"] } },
  {
    n: 14,
    title: "Utilisation Certificate (GFR-12A)",
    showWhen: { field: "case_type", equals: ["Ongoing / Renewal of an existing project"] },
  },
];

export const AVYAY_WIZARD: WizardDef = {
  code: "AVYAY",
  title: "AVYAY (Atal Vayo Abhyuday Yojana)",
  steps: AVYAY_STEPS,
  documents: AVYAY_DOCS,
  documentsNote: "PDF · Max 5 MB per file · All mandatory.",
  costNorms: true,
};

/**
 * The 18 heads behind the AVYAY entitlement, as published in the 2021-22 cost norms and shown
 * verbatim in the live "Show the 18 heads behind these figures" disclosure. Amounts are the
 * norm for a 50-beneficiary Senior Citizens' Home in a Z-category city.
 */
/**
 * AVYAY's 18 cost heads, with the norm for each sanctioned capacity.
 *
 * Live does not publish one table — it recomputes the figures from the project type, so a
 * 25-beneficiary home and a 50-beneficiary home draw different amounts on the same head, and
 * not by a single ratio: a Superintendent is one post either way, food scales with residents,
 * and the MTS count goes 3 → 4. The 25 column was read off the live panel on 2026-08-23 for a
 * Senior Citizens' Home — 25 beneficiaries, NGO, city category Z; the 50 column is the table
 * this file already carried.
 *
 * Row order follows live, including Toiletries before Miscellaneous.
 */
export const AVYAY_COST_HEADS_BY_CAPACITY: readonly {
  head: string;
  norm25: number;
  norm50: number;
  attendanceLinked?: boolean;
  nonRecurring?: boolean;
}[] = [
  { head: "Superintendent", norm25: 154553, norm50: 154553 },
  { head: "Social Worker/ Counsellor", norm25: 98914, norm50: 98914 },
  { head: "Yoga Therapist", norm25: 61821, norm50: 61821 },
  { head: "Nurse", norm25: 80367, norm50: 80367 },
  { head: "Cook", norm25: 98914, norm50: 197827 },
  { head: "Multi-Tasking Staff (MTS)", norm25: 296741, norm50: 395654 },
  { head: "Accountant /Clerk", norm25: 72000, norm50: 72000 },
  { head: "Food/Nutrition (attendance-linked)", norm25: 705146, norm50: 1410292, attendanceLinked: true },
  { head: "Doctor", norm25: 204009, norm50: 408019 },
  { head: "Hygiene (attendance-linked)", norm25: 50000, norm50: 100000, attendanceLinked: true },
  { head: "Medicine/ Tests (attendance-linked)", norm25: 103035, norm50: 206070, attendanceLinked: true },
  { head: "Clothing /Oil, soap etc (attendance-linked)", norm25: 103035, norm50: 206070, attendanceLinked: true },
  { head: "Recreation and production related Charges", norm25: 61821, norm50: 123642 },
  { head: "Water, electricity charges", norm25: 100000, norm50: 200000 },
  { head: "Toiletries (attendance-linked)", norm25: 30000, norm50: 60000, attendanceLinked: true },
  { head: "Miscellaneous & Unforeseen", norm25: 20000, norm50: 40000 },
  { head: "Owned Building on Z Category City (10% of Rent)", norm25: 19800, norm50: 29700 },
  {
    head: "Non-Recurring Items including the cost of CCTV cameras and website developing charges",
    norm25: 309105,
    norm50: 412140,
    nonRecurring: true,
  },
];

export type AvyayCostHead = {
  head: string;
  norm: number;
  attendanceLinked?: boolean;
  nonRecurring?: boolean;
};

/**
 * The 18 heads resolved for one project type. Anything that is not an explicit 25-beneficiary
 * home draws the 50 column, which is what live does for the 50-beneficiary, women-only and
 * Continuous Care variants.
 */
export function avyayCostHeads(natureOfProject?: string): readonly AvyayCostHead[] {
  const is25 = (natureOfProject ?? "").includes("25");
  return AVYAY_COST_HEADS_BY_CAPACITY.map((h) => ({
    head: h.head,
    norm: is25 ? h.norm25 : h.norm50,
    ...(h.attendanceLinked ? { attendanceLinked: true as const } : {}),
    ...(h.nonRecurring ? { nonRecurring: true as const } : {}),
  }));
}

/* ══════════════════════════════════════════════════════════════════════════════
   SMILE — Garima Greh — 6 steps
   ══════════════════════════════════════════════════════════════════════════════ */

const SMILE_STEPS: readonly StepDef[] = [
  {
    title: "Organisation Details",
    sections: [
      {
        title: "Organisation Details",
        lead: "Scheme header + applicant NGO/CBO identity and profile (Steps 1A–1F, 2A of the Garima Greh form). Pre-filled from NGO-Darpan where available.",
        fields: [
          { name: "fld_nature_of_project", label: "Nature of the Project", kind: "select", required: true, wide: true, options: ["Garima Greh — Transgender Care Home", "Rehabilitation & Livelihood (SMILE)"] },
          { name: "fld_financial_year", label: "Applying for Financial Year", kind: "select", required: true, options: FINANCIAL_YEARS },
          { name: "fld_submitted_on", label: "Application submitted on (date)", kind: "date" },
          { name: "fld_ack_no", label: "Acknowledgment No.", kind: "text" },
          {
            name: "case_type",
            label: "Do you have an existing project under SMILE?",
            kind: "radio",
            required: true,
            wide: true,
            options: [SMILE_CASE_NEW, SMILE_CASE_EXISTING],
            help: "A new applicant's Project ID is generated automatically on submit.",
          },
          /*
           * SMILE's step 1 forks on case_type, walked on live 2026-08-23. A new project gets only
           * the generated id; an existing one is asked to pick the project, confirm its id and
           * name the installment — and does NOT get the generated id at all.
           */
          {
            name: "fld_project_id_auto",
            label: "Project Id",
            kind: "text",
            readOnly: true,
            help: "Generated automatically on submit for a new project.",
            showWhen: { field: "case_type", equals: [SMILE_CASE_NEW] },
          },
          {
            name: "fld_smile_project_select",
            label: "Existing Project",
            kind: "select",
            required: true,
            wide: true,
            options: ["SM/MH/PUN/09003 — SMILE project (FY 2026-27)"],
            showWhen: { field: "case_type", equals: [SMILE_CASE_EXISTING] },
          },
          {
            name: "fld_project_id",
            label: "Project ID",
            kind: "text",
            required: true,
            showWhen: { field: "case_type", equals: [SMILE_CASE_EXISTING] },
          },
          {
            name: "fld_installment_no",
            label: "Installment",
            kind: "select",
            required: true,
            options: ["1st Installment", "2nd Installment"],
            showWhen: { field: "case_type", equals: [SMILE_CASE_EXISTING] },
          },
          { name: "website_available", label: "Do you have a website?", kind: "radio", required: true, options: YES_NO, wide: true },
          { name: "fld_website_url", label: "Website URL", kind: "text", required: true, showWhen: { field: "website_available", equals: ["Yes"] } },
          { name: "camera_live_feed", label: "Do you have a camera and live feed?", kind: "radio", required: true, options: YES_NO, wide: true, help: "A Yes makes the CCTV/live-feed registration proof (document 20) mandatory." },
          { name: "fld_ngo_name", label: "NGO/CBO/Startup Name (as per NITI Aayog Darpan)", kind: "text", required: true, readOnly: true, help: "Read-only — sourced from NGO-Darpan / your login." },
          { name: "fld_darpan_id", label: "NGO Unique ID (NITI Aayog Darpan)", kind: "text", required: true, readOnly: true, help: "Pre-filled from your login. Key for identity read and duplicate-project prevention." },
          { name: "fld_reg_office_address", label: "Registered Office Address", kind: "textarea", required: true, wide: true },
          { name: "fld_reg_office_city", label: "City / Town / Village", kind: "text", required: true },
          { name: "fld_reg_office_district", label: "District", kind: "text", required: true },
          { name: "fld_reg_office_state", label: "State", kind: "text", required: true },
          { name: "fld_contact_mobile", label: "Mobile No.", kind: "tel", required: true, help: "Pre-filled from your login. Used for notifications." },
          { name: "fld_contact_telephone", label: "Telephone", kind: "tel" },
          { name: "fld_contact_email", label: "Email", kind: "email", required: true, help: "Pre-filled from your login. Used for notifications." },
          { name: "fld_statute_act", label: "Statute under which registered", kind: "text", required: true },
          { name: "fld_org_geographical_coverage", label: "Geographical coverage (districts)", kind: "textarea", required: true, wide: true },
          { name: "fld_org_area_specialisation", label: "Main area of specialisation", kind: "textarea", required: true, wide: true },
          { name: "fld_org_tg_experience", label: "Total work experience with TG community", kind: "textarea", required: true, wide: true },
          { name: "fld_org_govt_projects", label: "Details of special govt./state/international projects", kind: "textarea", wide: true },
          { name: "fld_org_profile_writeup", label: "Write-up on org profile + proposed project + implementation schedule", kind: "textarea", required: true, wide: true },
          { name: "fld_strength_outreach_workers", label: "No. of outreach/social workers", kind: "number", required: true },
          { name: "fld_strength_convergence", label: "Convergence with other Central/State schemes", kind: "textarea", wide: true },
          { name: "fld_strength_tg_rehabilitated", label: "No. of TG persons rehabilitated (self-emp/job)", kind: "number", required: true },
          { name: "fld_proj_tg_id_handheld", label: "No. of TG individuals hand-held for ID certificate", kind: "number", required: true },
          { name: "fld_proj_rehab_strategies", label: "Strategies for rehabilitation of TG individuals", kind: "textarea", required: true, wide: true },
          { name: "fld_head_name", label: "Head of Organization — Name", kind: "text", required: true },
          { name: "fld_head_qualification", label: "Head of Organization — Qualification", kind: "text", required: true },
          { name: "fld_head_address", label: "Head of Organization — Address", kind: "text", required: true, wide: true },
          { name: "fld_key_person_1_name", label: "Key Functionary 1 — Name", kind: "text", required: true },
          { name: "fld_key_person_1_qualification", label: "Key Functionary 1 — Qualification", kind: "text", required: true },
          { name: "fld_key_person_1_address", label: "Key Functionary 1 — Address", kind: "text", required: true, wide: true },
          { name: "fld_registration_act", label: "Name of Act", kind: "text", required: true },
          { name: "fld_registration_number", label: "Registration Number", kind: "text", required: true },
          { name: "fld_registration_date", label: "Date of Registration", kind: "date", required: true },
          { name: "fld_registration_valid_upto", label: "Registration Valid up to", kind: "date", required: true, rule: "afterRegistration", help: "Must be later than the date of registration." },
          { name: "fld_establishment_date", label: "Date of Establishment", kind: "date", required: true },
          { name: "fld_pan_number", label: "PAN Registration Number", kind: "text", required: true },
          { name: "fld_pan_date", label: "PAN Registration Date", kind: "date", required: true },
          { name: "fcra_80g", label: "80G / FCRA registration", kind: "radio", required: true, options: YES_NO, wide: true },
          { name: "fld_fcra_80g_details", label: "80G / FCRA registration details", kind: "textarea", required: true, wide: true, showWhen: { field: "fcra_80g", equals: ["Yes"] } },
          { name: "prior_grant_received", label: "Has the organisation received a previous SMILE grant?", kind: "radio", required: true, options: YES_NO, wide: true },
        ],
      },
    ],
  },
  {
    title: "Institution Details",
    sections: [
      {
        title: "Institution Details",
        lead: "The physical Garima Greh unit — staff, premises, project location (Steps 2B–2C, 3A–3C).",
        fields: [
          { name: "fld_premises_office_area_sqm", label: "Office space (sq. m)", kind: "number", required: true },
          { name: "fld_premises_ownership", label: "Ownership status", kind: "select", required: true, options: ["Owned", "Rented", "On Lease", "Donated"] },
          { name: "fld_track_nature_of_work", label: "Nature of work done", kind: "textarea", required: true, wide: true },
          { name: "fld_track_period_from", label: "Period — From", kind: "date", required: true },
          { name: "fld_track_period_to", label: "Period — To", kind: "date", required: true, rule: "afterPeriodFrom", help: "Must be later than the start date." },
          { name: "fld_track_coverage", label: "Coverage of beneficiaries", kind: "textarea", required: true, wide: true },
          { name: "fld_track_outcome", label: "Outcome/achievement/award", kind: "textarea", required: true, wide: true },
          { name: "fld_track_funding", label: "Source of funding + amount", kind: "textarea", required: true, wide: true },
          { name: "fld_site_address", label: "Project Location Address", kind: "textarea", required: true, wide: true },
          { name: "fld_site_landmark", label: "Landmark", kind: "text" },
          { name: "fld_site_city", label: "City / Town / Village", kind: "text", required: true },
          { name: "fld_site_state", label: "State", kind: "select", required: true, options: INDIAN_STATES, help: "Select the State of the Garima Greh site." },
          { name: "fld_site_district", label: "District", kind: "select", required: true, districtsOf: "fld_site_state", help: "Choose the State first, then its District." },
          { name: "fld_site_location_type", label: "Location Type", kind: "text", required: true },
          { name: "fld_site_pin", label: "PIN Code", kind: "text", required: true, rule: "pin" },
          { name: "fld_site_org_email", label: "Organization Email Address", kind: "email", required: true },
          { name: "fld_site_incharge_name", label: "Project In-charge — Name", kind: "text", required: true },
          { name: "fld_site_incharge_email", label: "Project In-charge — Email", kind: "email", required: true },
          { name: "fld_site_incharge_mobile", label: "Project In-charge — Mobile", kind: "tel", required: true },
          {
            name: "fld_staff_roster",
            label: "Staff Associated with the Project — 12 Sanctioned Positions",
            kind: "textarea",
            required: true,
            wide: true,
            help: "Name, Designation and Educational Qualification for each of the 12 sanctioned positions: Project Director, Project Manager, Accountant Assistant, Bridge Course Coordinator, Counsellor, Doctor, Cook, Multi-Task Worker, Sweeper, and Watchmen (×3).",
          },
          {
            name: "fld_pmc_composition",
            label: "PMC Composition (Project Management Committee)",
            kind: "textarea",
            required: true,
            wide: true,
            help: "List the 5-member PMC — DM/equivalent (Chairperson), NGO/CBO nominee, Doctor, TG Welfare Expert, and Project Director (Member Secretary — must be a transgender person) — with name + role for each (BR-PMC-001).",
          },
        ],
      },
    ],
  },
  {
    title: "Bank, Beneficiaries & Grant",
    sections: [
      {
        title: "Bank Details",
        lead: "Structured bank fields (converted from document #16 of the legacy checklist).",
        fields: [
          { name: "fld_bank_name", label: "Bank Name", kind: "text", required: true },
          { name: "fld_bank_branch_address", label: "Branch Address", kind: "textarea", required: true, wide: true },
          { name: "fld_bank_account_number", label: "Account Number", kind: "text", required: true },
          { name: "fld_bank_ifsc", label: "IFSC Code", kind: "text", required: true, rule: "ifsc" },
          { name: "fld_bank_rtgs_micr", label: "RTGS / MICR Code", kind: "text" },
          { name: "fld_bank_joint_operators", label: "Name & Address of joint-account operators", kind: "textarea", required: true, wide: true },
        ],
      },
      {
        title: "Beneficiaries / Residents",
        fields: [
          { name: "fld_residents_list", label: "List of Residents/Beneficiaries (name, Transgender ID certificate no., age)", kind: "textarea", required: true, wide: true },
          { name: "fld_sanctioned_capacity", label: "Sanctioned resident capacity", kind: "number", required: true, help: "A Garima Greh unit is sanctioned for up to 25 residents." },
          {
            name: "fld_tg_beneficiaries_details",
            label: "Transgender beneficiaries — Name, Aadhaar, Mobile, Date of Admission",
            kind: "textarea",
            wide: true,
            help: "One resident per line, in the format: Name | Aadhaar (12 digits) | Mobile (10 digits) | Date of Admission.",
          },
          { name: "fld_total_beneficiaries", label: "Total Number of Residents/Beneficiaries", kind: "number", required: true, help: "Visible to all reviewers." },
        ],
      },
      {
        title: "Grant Sought / Budget Estimate",
        lead: "Item-wise break-up (BRD Annexure C). Recurring + Non-recurring = Total.",
        fields: [
          { name: "fld_grant_non_recurring_furniture", label: "Non-Recurring — Furniture (₹)", kind: "number" },
          { name: "fld_grant_non_recurring_it", label: "Non-Recurring — IT Peripherals (₹)", kind: "number" },
          { name: "fld_grant_non_recurring_equipment", label: "Non-Recurring — Equipment incl. CCTV (₹)", kind: "number" },
          { name: "fld_grant_non_recurring_kitchen", label: "Non-Recurring — Kitchen items (₹)", kind: "number" },
          { name: "fld_grant_non_recurring_safety", label: "Non-Recurring — Safety equipment (₹)", kind: "number" },
          { name: "fld_grant_non_recurring_skill_dev", label: "Non-Recurring — Skill-dev equipment (₹)", kind: "number" },
          {
            name: "fld_grant_non_recurring",
            label: "Non-Recurring Total (₹)",
            kind: "number",
            required: true,
            help: "Auto-calculated from the Non-Recurring break-up.",
            auto: {
              kind: "sum",
              from: [
                "fld_grant_non_recurring_furniture",
                "fld_grant_non_recurring_it",
                "fld_grant_non_recurring_equipment",
                "fld_grant_non_recurring_kitchen",
                "fld_grant_non_recurring_safety",
                "fld_grant_non_recurring_skill_dev",
              ],
            },
          },
          { name: "fld_grant_recurring_rent", label: "Recurring — Rent (₹)", kind: "number" },
          { name: "fld_grant_recurring_food", label: "Recurring — Food (₹)", kind: "number" },
          { name: "fld_grant_recurring_salaries", label: "Recurring — Salaries by post (₹)", kind: "number" },
          { name: "fld_grant_recurring_admin", label: "Recurring — Admin expenses (₹)", kind: "number" },
          {
            name: "fld_grant_recurring",
            label: "Recurring Total (₹)",
            kind: "number",
            required: true,
            help: "Auto-calculated from the Recurring break-up.",
            auto: {
              kind: "sum",
              from: [
                "fld_grant_recurring_rent",
                "fld_grant_recurring_food",
                "fld_grant_recurring_salaries",
                "fld_grant_recurring_admin",
              ],
            },
          },
          {
            name: "fld_grant_total",
            label: "Total Grant Requested (₹)",
            kind: "number",
            required: true,
            help: "Auto-calculated: recurring + non-recurring. Feeds the amount_requested hub column.",
            auto: { kind: "sum", from: ["fld_grant_recurring", "fld_grant_non_recurring"] },
          },
        ],
      },
    ],
  },
  {
    title: "Declarations",
    nextLabel: "Next: Documents →",
    sections: [
      {
        title: "Compliance Declarations",
        lead: "Certification of accuracy + the scheme rules undertaking (a)–(j). Tick each declaration.",
        fields: [
          { name: "decl_records_accurate", label: "I certify that the records and accounts furnished are accurate.", kind: "checkbox", required: true, wide: true },
          { name: "decl_no_encumbrance", label: "The premises/property are free from any encumbrance.", kind: "checkbox", required: true, wide: true },
          { name: "decl_audit_access", label: "Accounts and records will remain open to audit access.", kind: "checkbox", required: true, wide: true },
          { name: "decl_economy", label: "Economy in spending will be observed.", kind: "checkbox", required: true, wide: true },
          { name: "decl_progress_reports", label: "Progress reports will be submitted as required.", kind: "checkbox", required: true, wide: true },
          { name: "decl_own_contribution", label: "The organisation will contribute 10% / balance expenditure.", kind: "checkbox", required: true, wide: true },
          { name: "decl_reservation", label: "Reservation for SC/ST/Disabled persons will be observed.", kind: "checkbox", required: true, wide: true },
          { name: "decl_no_duplicate_grant", label: "No duplicate grant from another source for the same purpose is being claimed.", kind: "checkbox", required: true, wide: true },
          { name: "decl_separate_account", label: "A separate bank account for the scheme funds will be maintained.", kind: "checkbox", required: true, wide: true },
          { name: "decl_pfms_eat", label: "PFMS / EAT module compliance will be followed.", kind: "checkbox", required: true, wide: true },
        ],
      },
      {
        title: "Authorised Person & Declaration",
        fields: [
          { name: "fld_auth_person_name", label: "Name of Authorised Person", kind: "text", required: true },
          { name: "fld_auth_person_contact", label: "Contact Number", kind: "tel", required: true },
          { name: "fld_auth_place", label: "Place", kind: "text", required: true },
          { name: "fld_auth_date", label: "Date", kind: "date", required: true },
          { name: "fld_auth_time", label: "Time", kind: "time", required: true },
        ],
      },
    ],
  },
  { title: "Upload Documents", kind: "documents", sections: [] },
  { title: "Review & Submit", kind: "review", sections: [] },
];

const SMILE_DOCS: readonly DocDef[] = [
  { n: 1, title: "Registration Certificate (Societies Act / Trust Act etc.)" },
  {
    n: 2,
    title: "Annual Report — previous FY",
    note: "New applicants: previous two (2) financial years. 2nd instalment claims: previous financial year.",
  },
  {
    n: 3,
    title: "Audit Report (Balance Sheet, Income & Expenditure, Receipts & Payments)",
    note: "New applicants: previous two (2) financial years. 2nd instalment claims: previous financial year.",
  },
  { n: 4, title: "Any other document as requested", note: "Conditional — sought only where applicable.", optional: true },
  { n: 5, title: "Memorandum of Association + rules/aims/objectives" },
  { n: 6, title: "List of Management/Managing Committee Members" },
  {
    n: 7,
    title: "Rent Agreement for Garima Greh premises (notarised; rural certificate if applicable)",
    note: "Required when the Garima Greh premises are rented.",
  },
  { n: 8, title: "Infrastructure details (rooms, kitchen, toilet, etc.)" },
  {
    n: 9,
    title: "Budget Estimate (item-wise recurring & non-recurring)",
    note: "New applicants: non-recurring items only. 1st instalment claims: recurring + non-recurring items.",
  },
  { n: 10, title: "Bank account details document" },
  { n: 11, title: "Agreement Bond/PSR on non-judicial stamp paper (₹20)" },
  {
    n: 12,
    title: "CCTV/live-feed registration proof",
    note: "Required when a camera and live feed are declared (BR FR-INS-001).",
  },
];


export const SMILE_WIZARD: WizardDef = {
  code: "SMILE",
  title: "Support for Marginalised Individuals for Livelihood & Enterprise (SMILE) — Garima Greh",
  steps: SMILE_STEPS,
  documents: SMILE_DOCS,
  documentsNote: "PDF · Max 3 MB per file · All mandatory.",
};

/* ══════════════════════════════════════════════════════════════════════════════
   NAPDDR — Full 10 steps matching live UAT portal
   ══════════════════════════════════════════════════════════════════════════════ */

const NAPDDR_STEPS: readonly StepDef[] = [
  {
    title: "Application Type",
    sections: [
      {
        title: "Application Type & Scheme Category",
        lead: "Select the grant category and application type under NAPDDR.",
        fields: [
          { name: "fld_application_type", label: "Application Type", kind: "select", required: true, options: ["New Project", "Renewal / Continuing Project", "Expansion of Existing Project"] },
          { name: "fld_scheme_category", label: "NAPDDR Intervention Category", kind: "select", required: true, options: ["Integrated Rehabilitation Centre for Addicts (IRCA)", "Community based Peer Led Intervention (CPLI)", "Outreach and Drop In Centre (ODIC)", "District De-addiction Centre (DDAC)", "State Level Coordinating Agency (SLCA)"] },
          { name: "fld_financial_year", label: "Financial Year for Grant", kind: "select", required: true, options: ["2026-27", "2025-26", "2024-25"] },
        ],
      },
    ],
  },
  {
    title: "Organisation Details",
    sections: [
      {
        title: "Organisation Identity & Registration",
        lead: "Identity of the applicant organisation. Pre-filled from NGO-Darpan.",
        fields: [
          { name: "fld_ngo_name", label: "Name of NGO / VO", kind: "text", required: true, readOnly: true, help: "Sourced from NGO-Darpan / your login." },
          { name: "fld_darpan_id", label: "NGO-Darpan Unique ID", kind: "text", required: true, readOnly: true },
          { name: "fld_statute_act", label: "Statute / Act of Registration", kind: "text", required: true },
          { name: "fld_registration_number", label: "Registration Number", kind: "text", required: true },
          { name: "fld_registration_date", label: "Date of Registration", kind: "date", required: true },
          { name: "fld_registration_expiry", label: "Date of Expiry", kind: "date", required: true, rule: "afterRegistration" },
          { name: "fld_reg_office_address", label: "Registered Office Address", kind: "textarea", required: true, wide: true },
          { name: "fld_reg_office_city", label: "City", kind: "text", required: true },
          { name: "fld_reg_office_district", label: "District", kind: "text", required: true },
          { name: "fld_reg_office_state", label: "State", kind: "text", required: true },
          { name: "fld_contact_mobile", label: "Mobile Number", kind: "tel", required: true },
          { name: "fld_contact_email", label: "Email Address", kind: "email", required: true },
        ],
      },
    ],
  },
  {
    title: "Project Details",
    sections: [
      {
        title: "Project Overview & Target Population",
        lead: "Specifics of the proposed drug demand reduction project.",
        fields: [
          { name: "fld_project_title", label: "Project Name / Title", kind: "text", required: true, wide: true },
          { name: "fld_target_group", label: "Primary Target Group", kind: "select", required: true, options: ["Vulnerable Youth & Students", "High-Risk Substance Users", "Injecting Drug Users (IDUs)", "Prison Inmates / Under-trials", "General Community / Families"] },
          { name: "fld_sanctioned_strength", label: "Sanctioned Bed Capacity / Annual Target Inmates", kind: "number", required: true },
          { name: "fld_project_objectives", label: "Project Objectives & Scope of Work", kind: "textarea", required: true, wide: true },
        ],
      },
    ],
  },
  {
    title: "Location & Infrastructure",
    sections: [
      {
        title: "Centre Infrastructure & Compliance",
        lead: "Physical setup, building ownership, safety compliance and surveillance.",
        fields: [
          { name: "fld_project_location_address", label: "Centre / Facility Full Address", kind: "textarea", required: true, wide: true },
          { name: "fld_building_ownership", label: "Building Ownership Status", kind: "select", required: true, options: ["Rented Premises", "Owned by Organisation", "Government / Municipal Leased"] },
          { name: "fld_covered_area_sqft", label: "Total Covered Area (sq. ft.)", kind: "number", required: true },
          { name: "fld_cctv_installed", label: "CCTV Surveillance Installed & Operational", kind: "select", required: true, options: ["Yes — 24/7 recording operational", "No — in installation phase"] },
          { name: "fld_fire_safety_cert", label: "Fire Safety Certificate Valid", kind: "select", required: true, options: ["Yes", "No", "Exempted / Applied"] },
          { name: "fld_nearest_police_station", label: "Jurisdictional Police Station", kind: "text", required: true },
        ],
      },
    ],
  },
  {
    title: "Key Functionaries & Staff",
    sections: [
      {
        title: "Centre Professional Staff Roster",
        lead: "Core clinical, counseling and administrative personnel.",
        fields: [
          { name: "fld_project_director", label: "Project Director / In-charge Name & Qualification", kind: "text", required: true, wide: true },
          { name: "fld_medical_officer", label: "Visiting Medical Officer / Doctor Name & Reg. No.", kind: "text", required: true, wide: true },
          { name: "fld_counselors_count", label: "Number of Full-Time Qualified Counselors", kind: "number", required: true },
          { name: "fld_social_workers_count", label: "Number of Field / Social Workers", kind: "number", required: true },
          { name: "fld_staff_reservation_compliance", label: "Reservation Policy Compliance in Staff Recruitment", kind: "select", required: true, options: ["Complied with SC/ST/OBC norms", "Under compliance", "Not applicable (< 5 staff)"] },
        ],
      },
    ],
  },
  {
    title: "Capability & Prior Work",
    sections: [
      {
        title: "Track Record & Organisational Experience",
        lead: "Experience in substance abuse treatment, counseling and community rehabilitation.",
        fields: [
          { name: "fld_years_in_deaddiction", label: "Years of Experience in Drug Demand Reduction / Health", kind: "number", required: true },
          { name: "fld_past_beneficiaries_served", label: "Total Individuals Rehabilitated / Served in Last 3 Years", kind: "number", required: true },
          { name: "fld_awards_recognitions", label: "State / National Recognitions or Empanelments", kind: "text", wide: true },
          { name: "fld_annual_turnover_last_fy", label: "Annual Expenditure / Turnover in Last FY (₹ Lakhs)", kind: "number", required: true },
        ],
      },
    ],
  },
  {
    title: "Beneficiaries & Grant",
    sections: [
      {
        title: "Beneficiaries Count & Cost Estimates",
        lead: "Annual beneficiary targets and itemized budget estimates.",
        fields: [
          { name: "fld_target_beneficiaries", label: "Projected Annual Inpatient / Outpatient Beneficiaries", kind: "number", required: true },
          { name: "fld_honorarium_cost", label: "Estimated Staff Honorarium Cost (₹)", kind: "number", required: true },
          { name: "fld_rent_admin_cost", label: "Estimated Rent & Administrative Expenses (₹)", kind: "number", required: true },
          { name: "fld_medical_diet_cost", label: "Estimated Medical, Food & Counseling Expenses (₹)", kind: "number", required: true },
          { name: "fld_grant_total", label: "Total Grant-in-Aid Requested (₹)", kind: "number", required: true },
          { name: "fld_bank_account_choice", label: "Designated PFMS / EAT Linked Bank Account", kind: "select", required: true, options: ["State Bank of India · A/C 987654321098 · SBIN0001234", "Punjab National Bank · A/C 456789012345 · PUNB0123456"] },
        ],
      },
    ],
  },
  {
    title: "Verification & Signatory",
    sections: [
      {
        title: "Authorised Signatory Verification",
        lead: "Details of the person authorised to execute bonds and agreements with the Ministry.",
        fields: [
          { name: "fld_signatory_name", label: "Name of Authorised Signatory", kind: "text", required: true },
          { name: "fld_signatory_designation", label: "Designation (President / Secretary / General Secretary)", kind: "text", required: true },
          { name: "fld_signatory_mobile", label: "Mobile Number", kind: "tel", required: true },
          { name: "fld_signatory_pan", label: "Individual PAN of Authorised Signatory", kind: "text", required: true, rule: "pan" },
        ],
      },
    ],
  },
  { title: "Upload Documents", kind: "documents", sections: [] },
  { title: "Review & Submit", kind: "review", sections: [] },
];

const NAPDDR_DOCS: readonly DocDef[] = [
  { n: 1, title: "Memorandum of Association", description: "Rules, aims & objectives of organisation" },
  { n: 2, title: "List of Managing Committee Members", description: "Current composition with designations" },
  { n: 3, title: "List of Beneficiaries — Previous Year", description: "Complete list with Aadhaar / UDID references" },
  { n: 4, title: "Staff Monitoring Sheet", description: "Reservation policy compliance among staff" },
  { n: 5, title: "List of Staff / Employees" },
  { n: 6, title: "Infrastructure Details", description: "Rooms, kitchen, toilets, etc." },
  { n: 7, title: "Bank Account Details", description: "Bank name, A/C No., IFSC, authorised person" },
  { n: 8, title: "Agreement Bond / PSR", description: "Non-judicial stamp paper ₹20" },
  { n: 9, title: "CCTV & Proactive Disclosures Status" },
  { n: 10, title: "EAT Module Implementation Status" },
  { n: 11, title: "PAN Card Copy" },
  { n: 12, title: "Utilisation Certificate (GFR-12A)", description: "For grant of previous-to-previous FY · CA signed" },
  { n: 13, title: "Provisional Unaudited Audit Report", description: "Apr–Sep of previous year · Accountant signed" },
  { n: 14, title: "Budget Estimate", description: "Item-wise recurring & non-recurring" },
  { n: 15, title: "Provisional UCs — Previous Year Grants", description: "GFR-12A · Authorised signatory" },
  { n: 16, title: "Half-Yearly Progress Report", description: "Previous year Apr–Sep & Oct–Mar" },
  { n: 17, title: "Audited Accounts — Previous Year", description: "Balance Sheet, I&E Statement, R&P Account · CA signed with membership number" },
];

export const NAPDDR_WIZARD: WizardDef = {
  code: "NAPDDR",
  title: "NAPDDR — National Action Plan for Drug Demand Reduction",
  steps: NAPDDR_STEPS,
  documents: NAPDDR_DOCS,
  documentsNote: "PDF only · Max 5 MB per file · All mandatory.",
};

/* ══════════════════════════════════════════════════════════════════════════════
   Registry + validation
   ══════════════════════════════════════════════════════════════════════════════ */

export const WIZARDS: Record<SchemeCode, WizardDef> = {
  SHRESHTA_M2: SHRESHTA_WIZARD,
  AVYAY: AVYAY_WIZARD,
  SMILE: SMILE_WIZARD,
  NAPDDR: NAPDDR_WIZARD,
};

export function wizardFor(schemeCode: string | undefined): WizardDef | undefined {
  if (!schemeCode) return undefined;
  return WIZARDS[schemeCode.toUpperCase() as SchemeCode];
}

/** Every field of a step, flattened — the order the live form renders them in. */
export function stepFields(step: StepDef): readonly FieldDef[] {
  return step.sections.flatMap((s) => s.fields);
}

/** Whether a conditional field is currently on screen. */
export function fieldVisible(field: FieldDef, values: Record<string, string>): boolean {
  if (!field.showWhen) return true;
  return field.showWhen.equals.includes(values[field.showWhen.field] ?? "");
}

/**
 * The checklist for the answers given so far, renumbered 1..n the way live numbers whichever
 * documents it is actually showing.
 */
/**
 * The steps this branch actually shows.
 *
 * Sits beside `fieldVisible` and `visibleDocuments`, which have always existed — the absence of
 * this third one is why AVYAY rendered the same eight steps to a new project and a renewal when
 * live shows eight and seven. Anything that counts, indexes or labels steps must go through here,
 * never `wizard.steps` directly, or the stepper and the routing disagree with each other.
 */
/** The options this branch may choose from. See `FieldDef.optionsOnlyWhen`. */
export function visibleOptions(
  field: FieldDef,
  values: Record<string, string>,
): readonly string[] {
  const all = field.options ?? [];
  const rule = field.optionsOnlyWhen;
  if (!rule) return all;
  const allowed = rule.equals.includes(values[rule.field] ?? "");
  return allowed ? all : all.filter((o) => !rule.options.includes(o));
}

/** Whether this field is read-only on this branch. See `FieldDef.readOnlyWhen`. */
export function isReadOnly(field: FieldDef, values: Record<string, string>): boolean {
  if (field.readOnly) return true;
  const rule = field.readOnlyWhen;
  return !!rule && rule.equals.includes(values[rule.field] ?? "");
}

export function visibleSteps(
  wizard: WizardDef,
  values: Record<string, string>,
): readonly StepDef[] {
  return wizard.steps.filter(
    (step) => !step.showWhen || step.showWhen.equals.includes(values[step.showWhen.field] ?? ""),
  );
}

export function visibleDocuments(
  wizard: WizardDef,
  values: Record<string, string>,
): readonly DocDef[] {
  return wizard.documents
    .filter((d) => !d.showWhen || d.showWhen.equals.includes(values[d.showWhen.field] ?? ""))
    .map((d, i) => ({ ...d, n: i + 1 }));
}

const IFSC_RE = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const PIN_RE = /^[1-9][0-9]{5}$/;
const NAME_AND_PHONE_RE = /^[A-Za-z][A-Za-z .'-]*,\s*\d{10,}$/;
const LETTERS_ONLY_RE = /^[A-Za-z][A-Za-z .,'-]*$/;

/**
 * Per-field validation, mirroring the live guidance copy exactly. Returns a message per invalid
 * field, keyed by field name — the wizard renders it under the control AND rolls the labels up
 * into the live summary line ("N fields need attention before you can continue: …").
 */
export function validateStep(step: StepDef, values: Record<string, string>): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const f of stepFields(step)) {
    if (!fieldVisible(f, values)) continue;
    const v = (values[f.name] ?? "").trim();

    if (f.required && !v) {
      errors[f.name] = `${f.label} is required.`;
      continue;
    }
    if (!v) continue;

    switch (f.rule) {
      case "afterRegistration": {
        const from = values.fld_registration_date;
        if (from && v <= from) errors[f.name] = "Must be later than the date of registration.";
        break;
      }
      case "afterPeriodFrom": {
        const from = values.fld_track_period_from;
        if (from && v <= from) errors[f.name] = "Must be later than the start date.";
        break;
      }
      case "nameAndPhone":
        if (!NAME_AND_PHONE_RE.test(v)) {
          errors[f.name] = "Enter the name and a contact number of at least 10 digits — e.g. Ramesh Kumar, 9876543210.";
        }
        break;
      case "lettersOnly":
        if (!LETTERS_ONLY_RE.test(v)) {
          errors[f.name] = "Enter the name and designation using letters only — e.g. Sunita Sharma, Warden.";
        }
        break;
      case "pin":
        if (!PIN_RE.test(v)) errors[f.name] = "Enter a valid 6-digit PIN code.";
        break;
      case "ifsc":
        if (!IFSC_RE.test(v.toUpperCase())) errors[f.name] = "Enter a valid 11-character IFSC code — e.g. SBIN0001234.";
        break;
      case "pan":
        // The design system's validator, not a local regex: it checks the shape
        // AND the fourth character against the real holder types, so "ABCXE1234F"
        // is rejected where a shape-only pattern would pass it. A fifth regex in
        // this file would have been a second, weaker copy of that rule.
        if (!isValidPan(v)) {
          errors[f.name] = "Enter a valid PAN — ten characters, e.g. ABCPE1234F.";
        }
        break;
      default:
        break;
    }
  }

  return errors;
}

/** Recompute every auto-calculated field from its inputs. */
/**
 * Recompute every auto-calculated field across the WHOLE form.
 *
 * `applyAutoFields` only sees one step, which is right while the user is typing. It is wrong at
 * hydration: a draft restored from storage carries the inputs but not the derived totals, and
 * those totals are required AND read-only — so the applicant hit "2 fields need attention:
 * Total Number of Beneficiaries, Total Grant Sought" on a field they could not type into. The
 * live portal fills them in on load, so the clone does too.
 */
export function applyAllAutoFields(
  wizard: WizardDef,
  values: Record<string, string>,
): Record<string, string> {
  let next = values;
  for (const step of wizard.steps) next = applyAutoFields(step, next);
  return next;
}

export function applyAutoFields(step: StepDef, values: Record<string, string>): Record<string, string> {
  let next = values;
  for (const f of stepFields(step)) {
    if (!f.auto) continue;
    if (f.auto.kind === "sum") {
      const sum = f.auto.from.reduce((acc, k) => acc + Number(next[k] || 0), 0);
      const value = f.auto.from.some((k) => (next[k] ?? "").trim() !== "") ? String(sum) : "";
      if (next[f.name] !== value) next = { ...next, [f.name]: value };
    }
    if (f.auto.kind === "cityCategory") {
      const district = next[f.auto.from] ?? "";
      // Only fill it in once a district is chosen; live leaves the applicant free to pick a
      // category by hand where the district has not been classified.
      if (district.trim() !== "") {
        const value = cityCategoryFor(district);
        if (value && next[f.name] !== value) next = { ...next, [f.name]: value };
      }
    }
    if (f.auto.kind === "bankAccountPart") {
      const parts = (next[f.auto.from] ?? "").split("·").map((x) => x.trim());
      // "<bank> · <masked account> · <IFSC>" — anything else and we leave the field alone.
      const value =
        parts.length === 3
          ? f.auto.part === "account"
            ? (parts[1] ?? "")
            : f.auto.part === "ifsc"
              ? (parts[2] ?? "")
              : (parts[0] ?? "")
          : "";
      if (next[f.name] !== value) next = { ...next, [f.name]: value };
    }
  }
  return next;
}

/** The live summary line above the wizard's foot controls. */
export function errorSummary(step: StepDef, errors: Record<string, string>): string | undefined {
  const names = Object.keys(errors);
  if (names.length === 0) return undefined;
  const byName = new Map(stepFields(step).map((f) => [f.name, f.label]));
  const labels = names.map((n) => byName.get(n) ?? n);
  return `${names.length} ${names.length === 1 ? "field needs" : "fields need"} attention before you can continue: ${labels.join(", ")}.`;
}
