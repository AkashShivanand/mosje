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
  | { kind: "bankAccountPart"; from: string; part: "account" | "ifsc" | "bankAndBranch" }
  /**
   * The Project ID of the project chosen in another field — the part of the option before " — ".
   * SMILE asked an existing project to TYPE its Project ID straight after picking the project,
   * and left it editable (form-path QA, 13 Sep 2026); the system already knows it.
   */
  | { kind: "projectIdOf"; from: string };

export interface FieldDef {
  name: string;
  label: string;
  kind: FieldKind;
  required?: boolean;
  /** Rendered under the control, verbatim from the live form. */
  help?: string;
  /**
   * Help that differs by branch, keyed by the controlling field's value; replaces `help` for a
   * value it names. A renewal's wording ("cannot be changed on a renewal") was shown to new
   * applicants, and a new applicant's ("generated automatically on submit") to renewals.
   */
  helpWhen?: { field: string; byValue: Readonly<Record<string, string>> };
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
  /** Overrides the generated "this field is missing" message where the generic one reads badly. */
  requiredMessage?: string;
  /** Options come from a state field rather than a literal list (cascading District). */
  districtsOf?: string;
  /** Value derived from other fields; the control renders read-only. */
  auto?: AutoRule;
  /** Extra validation beyond "required". */
  rule?: "afterRegistration" | "afterPeriodFrom" | "nameAndPhone" | "lettersOnly" | "pin" | "ifsc" | "pan" | "notBackdated";
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
  /**
   * The format line under the documents heading, e.g. "PDF / JPG / PNG · Max 5 MB per file".
   * How many are mandatory is COUNTED from the list, never written here: "All mandatory" sat over
   * a SHRESHTA list with an optional document in it.
   */
  documentsNote: string;
  /** AVYAY alone shows the cost-norms entitlement panel above the grant fields. */
  costNorms?: boolean;
}

const YES_NO = ["Yes", "No"] as const;
/** SMILE's two case_type answers, referenced by the fields that fork on them. */
const SMILE_CASE_NEW = "No — new project (Project ID auto-generated)";
const SMILE_CASE_EXISTING = "Yes — existing project (select the Project ID)";
const FINANCIAL_YEARS = ["2027-28", "2026-27", "2025-26"] as const;

/**
 * The projects an applicant may renew, by scheme, with where each stands.
 *
 * A project becomes renewable once it is sanctioned AND has passed its PMU inspection. The
 * pickers listed projects "awaiting sanction" directly under help text saying only PMU-verified
 * projects can be chosen (form-path QA, 13 Sep 2026) — AVYAY's only option was one of them. The
 * list keeps every project and the picker shows the eligible ones, so the rule is applied rather
 * than stated. Illustrative: the prototype holds no sanction register for these projects.
 */
export type RenewalStage = "awaiting-sanction" | "sanctioned" | "pmu-verified";
export interface RenewalProject {
  id: string;
  name: string;
  stage: RenewalStage;
}
export const RENEWAL_PROJECTS: Readonly<Record<"AVYAY" | "NAPDDR" | "SMILE", readonly RenewalProject[]>> = {
  AVYAY: [
    { id: "SR/MH/PUN/40012", name: "Senior Citizens' Home, Pune", stage: "pmu-verified" },
    { id: "SR/AR/DIB/40040", name: "Senior Citizens' Home, Dibang Valley", stage: "awaiting-sanction" },
  ],
  NAPDDR: [
    { id: "DR/AN/NIC/40536", name: "De-Addiction Centre, Nicobar", stage: "pmu-verified" },
    { id: "DR/AN/NIC/40601", name: "De-Addiction Centre, Nicobar", stage: "awaiting-sanction" },
    { id: "DR/LD/LAK/40535", name: "De-Addiction Centre, Lakshadweep", stage: "awaiting-sanction" },
  ],
  SMILE: [{ id: "TG/MH/PUN/09003", name: "Garima Greh, Pune", stage: "pmu-verified" }],
};

/** The picker's options: renewable projects only, as "<Project ID> — <name>". */
export function renewableProjectOptions(scheme: keyof typeof RENEWAL_PROJECTS): string[] {
  return RENEWAL_PROJECTS[scheme].filter((p) => p.stage === "pmu-verified").map((p) => `${p.id} — ${p.name}`);
}

const RENEWABLE_HELP = "Only projects that have been sanctioned and have passed their PMU inspection are listed.";

/** The declaration's date and time are the moment of signing, filled in by the portal. */
const DECLARATION_DATE_HELP = "Today's date. It is recorded when the application is submitted.";
const DECLARATION_TIME_HELP = "The current time. It is recorded when the application is submitted.";

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
          { name: "fld_financial_year", label: "Financial Year for which Grant-in-Aid is sought", kind: "select", required: true, options: FINANCIAL_YEARS },
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
          // Live labels this "UC Pending Status (SFR 212(1))" — a rule citation we could not trace.
          { name: "fld_uc_pending_status", label: "Utilisation Certificate Pending Status", kind: "select", required: true, options: ["No Utilisation Certificate Pending", "Utilisation Certificate Pending"] },
          { name: "fld_commencement_date", label: "Date & Year of Commencement", kind: "date", required: true },
          { name: "fld_gia_since_year", label: "Year from which Grant-in-Aid has been received under SHRESHTA", kind: "text", required: true, help: "Applies to ongoing institutions." },
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
        title: "Grant-in-Aid Released — Last 3 Years",
        lead: "For ongoing cases. Optional.",
        fields: [
          { name: "fld_gia_released_last_3yrs", label: "Grant-in-Aid released in the last 3 years (sanction number, date, amount sanctioned, amount utilised)", kind: "textarea", wide: true },
        ],
      },
      {
        title: "Beneficiaries",
        fields: [
          { name: "fld_beneficiaries_sc", label: "SC Beneficiaries", kind: "number", required: true, help: "Number of Scheduled-Caste beneficiaries." },
          { name: "fld_beneficiaries_other", label: "Other-Category Beneficiaries", kind: "number", help: "Beneficiaries from other categories, if any." },
          { name: "fld_total_beneficiaries", label: "Total Number of Beneficiaries", kind: "number", required: true, auto: { kind: "sum", from: ["fld_beneficiaries_sc", "fld_beneficiaries_other"] }, help: "Worked out from the SC and other-category beneficiaries." },
          { name: "fld_beneficiaries_previous_year", label: "Number of Beneficiaries (Previous Year)", kind: "number" },
        ],
      },
      {
        title: "Grant Sought",
        lead: "The total is the recurring and non-recurring grant added together.",
        fields: [
          { name: "fld_grant_recurring", label: "Recurring Grant Sought (₹)", kind: "number", required: true },
          { name: "fld_grant_non_recurring", label: "Non-Recurring Grant Sought (₹)", kind: "number", required: true },
          { name: "fld_grant_total", label: "Total Grant Sought (₹)", kind: "number", required: true, auto: { kind: "sum", from: ["fld_grant_recurring", "fld_grant_non_recurring"] }, help: "Worked out from the recurring and non-recurring grant." },
        ],
      },
    ],
  },
  {
    title: "Declarations",
    sections: [
      {
        title: "Compliance Declarations",
        lead: "Confirm each declaration; provide value / source where applicable.",
        fields: [
          { name: "decl_uc_uploaded", label: "Requisite Utilisation Certificate uploaded", kind: "radio", required: true, options: YES_NO, wide: true },
          { name: "decl_audited_accounts_submitted", label: "Audited accounts (previous year) submitted", kind: "radio", required: true, options: YES_NO, wide: true },
          { name: "decl_name_changed_after_grant", label: "Organisation changed its name after the first grant", kind: "radio", required: true, options: YES_NO, wide: true },
          { name: "decl_not_for_profit", label: "Organisation is not run for profit", kind: "radio", required: true, options: YES_NO, wide: true, help: "Confirm the NGO/VO does not earn profit by running the institution." },
          { name: "decl_other_grant", label: "Receiving grant from another Government source for the same purpose", kind: "radio", required: true, options: YES_NO, wide: true },
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
          { name: "fld_auth_date", label: "Date", kind: "date", required: true, readOnly: true, rule: "notBackdated", help: DECLARATION_DATE_HELP },
          { name: "fld_auth_time", label: "Time", kind: "time", required: true, readOnly: true, help: DECLARATION_TIME_HELP },
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
  // 8, 9 and 14 are for an institution already receiving grant-in-aid. SHRESHTA Mode 2 offers
  // "Ongoing" as the only Status of Institution, so they are asked of every applicant today; the
  // condition is declared so a new-institution status would drop them rather than leave a
  // "Required when…" note on a mandatory slot.
  { n: 8, title: "Utilisation Certificate (GFR 12-A) — Previous Year, Signed by a Chartered Accountant", showWhen: { field: "fld_institution_status", equals: ["Ongoing"] } },
  { n: 9, title: "Provisional Utilisation Certificates — Grants Released Previous Year (GFR 12-A)", showWhen: { field: "fld_institution_status", equals: ["Ongoing"] } },
  { n: 10, title: "Bank Authorisation Letter (name, account number, address, IFSC / MICR)" },
  { n: 11, title: "Agreement Bond / PSR on Non-Judicial Stamp Paper" },
  { n: 12, title: "Compliance Status — Proactive Disclosures & CCTV Installation" },
  { n: 13, title: "Expenditure, Advance and Transfer (EAT) Module Implementation Status" },
  { n: 14, title: "Justification for Continuation of Ongoing Institution", showWhen: { field: "fld_institution_status", equals: ["Ongoing"] } },
  { n: 15, title: "Accounts in Parts (I&E, R&P, Balance Sheet, Auditor's Report)" },
  { n: 16, title: "List of Employees (name, designation, category, photo ID, Aadhaar)" },
  // Asked for only when the building is rented. It was listed on every application as OPTIONAL
  // with a "Required when rented" note, so an owned building was shown a rent agreement and a
  // rented one was never made to upload it (form-path QA, 13 Sep 2026).
  { n: 17, title: "Rent Agreement, Institution Location & Route Map", showWhen: { field: "fld_building_ownership", equals: ["Rented"] } },
  { n: 18, title: "Details of Income and Expenditure" },
  { n: 19, title: "School Recognition Certificate" },
  { n: 20, title: "Audit Report — Previous Year" },
];

export const SHRESHTA_WIZARD: WizardDef = {
  code: "SHRESHTA_M2",
  title: "SHRESHTA Mode 2 — Grant\u2011in\u2011Aid (Residential Education)",
  steps: SHRESHTA_STEPS,
  documents: SHRESHTA_DOCS,
  documentsNote: "PDF / JPG / PNG · Max 5 MB per file",
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
            options: renewableProjectOptions("AVYAY"),
            // The standing notice live shows above the stepper, said here once and only to the
            // applicant it concerns — it sat over every step of a NEW application too.
            help: `${AVYAY_RENEWAL_NOTICE} The form is filled in from the project you choose; you can edit any field, and a new application is created for the chosen financial year.`,
          },
          {
            name: "fld_financial_year",
            label: "Financial Year for which grant is sought",
            kind: "select",
            required: true,
            options: FINANCIAL_YEARS,
            helpWhen: {
              field: "case_type",
              byValue: {
                "New project": "A new application is for the financial year now running.",
                "Ongoing / Renewal of an existing project": "The year whose instalment you are claiming. Changing it re-checks which instalments are still open for this project.",
              },
            },
          },
          {
            name: "fld_installment_no",
            label: "Instalment",
            kind: "text",
            required: true,
            readOnly: true,
            // Renewal only. A first-time applicant has no recurring grant and no prior
            // instalments, and live does not ask them — it shows the financial year alone.
            // Stated, not chosen: the review call of 11 Sep 2026 (T370–383) removed the list,
            // because the system already knows which instalments this project has claimed.
            showWhen: { field: "case_type", equals: ["Ongoing / Renewal of an existing project"] },
            help: "The next instalment due for this project, worked out from those already claimed.",
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
        lead: "Identity of the applicant NGO/VO. Pre-filled from NITI Aayog NGO-Darpan where available.",
        fields: [
          { name: "fld_ngo_name", label: "Name of NGO / VO (as in NGO-Darpan)", kind: "text", required: true, readOnly: true, help: "Pre-filled from your login / NGO-Darpan." },
          { name: "fld_darpan_id", label: "NGO-Darpan Unique ID", kind: "text", required: true, readOnly: true, help: "Pre-filled from your login." },
          {
            name: "fld_project_id",
            label: "Project ID",
            kind: "text",
            readOnly: true,
            wide: true,
            helpWhen: {
              field: "case_type",
              byValue: {
                "New project": "Generated automatically when the application is submitted, from the scheme, State, district and a serial number.",
                "Ongoing / Renewal of an existing project": "The Project ID of the project being renewed.",
              },
            },
          },
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
              // Renewal-only, per the help below. These two were named in the help
              // text and were not in this list at all, so the sentence promised project types the
              // field never offered to anyone. Labels still to be confirmed against live.
              "Physiotherapy Clinic",
              "Mobile Medicare Unit",
            ],
            helpWhen: {
              field: "case_type",
              byValue: { "New project": "Physiotherapy Clinic and Mobile Medicare Unit can be chosen only when renewing an existing project." },
            },
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
            help: "The central share depends on this and the project State: 100% for a State Government, Urban Local Body, Panchayati Raj Institution or Regional Resource & Training Centre; 95% in the North-Eastern and Himalayan States; 90% elsewhere.",
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
        // A step of its own between Project Details and the infrastructure step (live, 2026-08-23).
        lead: "Why the district needs this project.",
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
            label: "Other justification",
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
          { name: "fld_total_beneficiaries", label: "Number of indigent senior-citizen beneficiaries", kind: "number", required: true, help: "The minimum depends on the nature of the project: 25 or 50 for a Senior Citizens' Home, and 20 for a Continuous Care Home." },
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
            helpWhen: {
              field: "case_type",
              byValue: {
                "New project": "The account the grant will be paid into.",
                "Ongoing / Renewal of an existing project": "The account recorded for this project. To change it, raise a request under Project Bank Accounts; the change takes effect once the Ministry approves it.",
              },
            },
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
    sections: [
      {
        title: "Grant Sought",
        lead: "The total is the recurring and non-recurring grant added together. Non-recurring grant is released once every five years; recurring grant in two half-yearly instalments after a satisfactory inspection.",
        fields: [
          { name: "fld_grant_recurring", label: "Recurring Grant Sought (₹)", kind: "number", required: true, help: "Attendance-based running cost. The panel above shows what the norms allow." },
          { name: "fld_grant_non_recurring", label: "Non-Recurring Grant Sought (₹)", kind: "number", required: true, help: "One-time items such as CCTV cameras, beds and utensils." },
          { name: "fld_grant_total", label: "Total Grant Sought (₹)", kind: "number", required: true, auto: { kind: "sum", from: ["fld_grant_recurring", "fld_grant_non_recurring"] }, help: "Worked out from the recurring and non-recurring grant." },
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
          { name: "fld_auth_date", label: "Date", kind: "date", required: true, readOnly: true, rule: "notBackdated", help: DECLARATION_DATE_HELP },
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
  { n: 3, title: "Annual Report of NGO — previous financial year" },
  {
    n: 4,
    title: "Annual Report of NGO — previous-to-previous financial year",
    showWhen: { field: "case_type", equals: ["New project"] },
  },
  {
    n: 5,
    title: "Audited Accounts of NGO — previous financial year",
    showWhen: { field: "case_type", equals: ["New project"] },
  },
  {
    n: 6,
    title: "Audited Accounts of NGO — previous-to-previous financial year",
    showWhen: { field: "case_type", equals: ["New project"] },
  },
  { n: 7, title: "Bank Details of the Project" },
  { n: 8, title: "Beneficiary List" },
  { n: 9, title: "Staff List" },
  // Rented buildings only. Asked of an owned building too, it was a mandatory upload an
  // applicant who had just answered "Owned" could not honestly supply (form-path QA, 13 Sep 2026).
  { n: 10, title: "Rent Agreement", showWhen: { field: "fld_building_ownership", equals: ["Rented"] } },
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
  documentsNote: "PDF · Max 5 MB per file",
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
        // Steps 1A–1F and 2A of the Garima Greh paper form.
        lead: "The project applied for, and the applicant organisation's identity and profile. Pre-filled from NGO-Darpan where available.",
        fields: [
          { name: "fld_nature_of_project", label: "Nature of the Project", kind: "select", required: true, wide: true, options: ["Garima Greh — Transgender Care Home", "Rehabilitation & Livelihood (SMILE)"] },
          { name: "fld_financial_year", label: "Applying for Financial Year", kind: "select", required: true, options: FINANCIAL_YEARS },
          // "Application submitted on" and "Acknowledgment No." were asked here, of the applicant,
          // before anything had been submitted. Both are the system's to issue on submit — the
          // submission date and the reference number — so neither is a question on the form.
          {
            name: "case_type",
            label: "Do you have an existing project under SMILE?",
            kind: "radio",
            required: true,
            wide: true,
            options: [SMILE_CASE_NEW, SMILE_CASE_EXISTING],
          },
          /*
           * SMILE's step 1 forks on case_type, walked on live 2026-08-23. A new project gets only
           * the generated id; an existing one is asked to pick the project, confirm its id and
           * name the installment — and does NOT get the generated id at all.
           */
          {
            name: "fld_project_id_auto",
            label: "Project ID",
            kind: "text",
            readOnly: true,
            help: "Generated automatically when the application is submitted.",
            showWhen: { field: "case_type", equals: [SMILE_CASE_NEW] },
          },
          {
            name: "fld_smile_project_select",
            label: "Existing Project",
            kind: "select",
            required: true,
            wide: true,
            options: renewableProjectOptions("SMILE"),
            help: RENEWABLE_HELP,
            showWhen: { field: "case_type", equals: [SMILE_CASE_EXISTING] },
          },
          {
            name: "fld_project_id",
            label: "Project ID",
            kind: "text",
            required: true,
            readOnly: true,
            auto: { kind: "projectIdOf", from: "fld_smile_project_select" },
            help: "Taken from the project chosen above.",
            showWhen: { field: "case_type", equals: [SMILE_CASE_EXISTING] },
          },
          {
            name: "fld_installment_no",
            label: "Instalment",
            kind: "text",
            required: true,
            readOnly: true,
            showWhen: { field: "case_type", equals: [SMILE_CASE_EXISTING] },
            help: "The next instalment due for this project, worked out from those already claimed.",
          },
          { name: "website_available", label: "Do you have a website?", kind: "radio", required: true, options: YES_NO, wide: true },
          { name: "fld_website_url", label: "Website URL", kind: "text", required: true, showWhen: { field: "website_available", equals: ["Yes"] } },
          { name: "camera_live_feed", label: "Do you have a camera and live feed?", kind: "radio", required: true, options: YES_NO, wide: true, help: "If Yes, the CCTV and live-feed registration proof is added to the documents to upload." },
          { name: "fld_ngo_name", label: "NGO/CBO/Startup Name (as per NITI Aayog Darpan)", kind: "text", required: true, readOnly: true, help: "Read-only — sourced from NGO-Darpan / your login." },
          { name: "fld_darpan_id", label: "NGO Unique ID (NITI Aayog Darpan)", kind: "text", required: true, readOnly: true, help: "Pre-filled from your login." },
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
          { name: "fld_org_tg_experience", label: "Total work experience with the transgender community", kind: "textarea", required: true, wide: true },
          { name: "fld_org_govt_projects", label: "Details of special Central, State or international projects", kind: "textarea", wide: true },
          { name: "fld_org_profile_writeup", label: "Write-up on the organisation's profile, the proposed project and its implementation schedule", kind: "textarea", required: true, wide: true },
          { name: "fld_strength_outreach_workers", label: "Number of outreach and social workers", kind: "number", required: true },
          { name: "fld_strength_convergence", label: "Convergence with other Central/State schemes", kind: "textarea", wide: true },
          { name: "fld_strength_tg_rehabilitated", label: "Number of transgender persons rehabilitated (self-employment or job)", kind: "number", required: true },
          { name: "fld_proj_tg_id_handheld", label: "Number of transgender persons helped to obtain an identity certificate", kind: "number", required: true },
          { name: "fld_proj_rehab_strategies", label: "Strategies for rehabilitation of transgender persons", kind: "textarea", required: true, wide: true },
          { name: "fld_head_name", label: "Head of Organisation — Name", kind: "text", required: true },
          { name: "fld_head_qualification", label: "Head of Organisation — Qualification", kind: "text", required: true },
          { name: "fld_head_address", label: "Head of Organisation — Address", kind: "text", required: true, wide: true },
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
        // Steps 2B–2C and 3A–3C of the Garima Greh paper form.
        lead: "The Garima Greh unit — its premises, track record, location and staff.",
        fields: [
          { name: "fld_premises_office_area_sqm", label: "Office space (sq. m)", kind: "number", required: true },
          { name: "fld_premises_ownership", label: "Ownership status", kind: "select", required: true, options: ["Owned", "Rented", "On Lease", "Donated"] },
          { name: "fld_track_nature_of_work", label: "Nature of work done", kind: "textarea", required: true, wide: true },
          { name: "fld_track_period_from", label: "Period — From", kind: "date", required: true },
          { name: "fld_track_period_to", label: "Period — To", kind: "date", required: true, rule: "afterPeriodFrom", help: "Must be later than the start date." },
          { name: "fld_track_coverage", label: "Coverage of beneficiaries", kind: "textarea", required: true, wide: true },
          { name: "fld_track_outcome", label: "Outcome, achievement or award", kind: "textarea", required: true, wide: true },
          { name: "fld_track_funding", label: "Source of funding and amount", kind: "textarea", required: true, wide: true },
          { name: "fld_site_address", label: "Project Location Address", kind: "textarea", required: true, wide: true },
          { name: "fld_site_landmark", label: "Landmark", kind: "text" },
          { name: "fld_site_city", label: "City / Town / Village", kind: "text", required: true },
          { name: "fld_site_state", label: "State", kind: "select", required: true, options: INDIAN_STATES, help: "Select the State of the Garima Greh site." },
          { name: "fld_site_district", label: "District", kind: "select", required: true, districtsOf: "fld_site_state", help: "Choose the State first, then its District." },
          { name: "fld_site_location_type", label: "Location Type", kind: "text", required: true },
          { name: "fld_site_pin", label: "PIN Code", kind: "text", required: true, rule: "pin" },
          { name: "fld_site_org_email", label: "Organisation Email Address", kind: "email", required: true },
          { name: "fld_site_incharge_name", label: "Project In-charge — Name", kind: "text", required: true },
          { name: "fld_site_incharge_email", label: "Project In-charge — Email", kind: "email", required: true },
          { name: "fld_site_incharge_mobile", label: "Project In-charge — Mobile", kind: "tel", required: true },
          {
            name: "fld_staff_roster",
            label: "Staff Associated with the Project — 12 Sanctioned Positions",
            kind: "textarea",
            required: true,
            wide: true,
            help: "Name, designation and educational qualification for each of the 12 sanctioned positions: Project Director, Project Manager, Accountant Assistant, Bridge Course Coordinator, Counsellor, Doctor, Cook, Multi-Task Worker, Sweeper and three Watchmen.",
          },
          {
            name: "fld_pmc_composition",
            label: "PMC Composition (Project Management Committee)",
            kind: "textarea",
            required: true,
            wide: true,
            // Composition per the scheme's PMC rule (BR-PMC-001).
            help: "List the five members of the Project Management Committee, with the name and role of each: the District Magistrate or equivalent (Chairperson), a nominee of the organisation, a doctor, a transgender welfare expert, and the Project Director (Member Secretary), who must be a transgender person.",
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
        // These replace document 16 of the earlier paper checklist.
        lead: "The account the grant will be paid into.",
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
          { name: "fld_residents_list", label: "List of residents and beneficiaries (name, transgender identity certificate number, age)", kind: "textarea", required: true, wide: true },
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
        // Item-wise heads per BRD Annexure C.
        lead: "Item-wise break-up. The total is the recurring and non-recurring grant added together.",
        fields: [
          { name: "fld_grant_non_recurring_furniture", label: "Non-Recurring — Furniture (₹)", kind: "number" },
          { name: "fld_grant_non_recurring_it", label: "Non-Recurring — IT Peripherals (₹)", kind: "number" },
          { name: "fld_grant_non_recurring_equipment", label: "Non-Recurring — Equipment incl. CCTV (₹)", kind: "number" },
          { name: "fld_grant_non_recurring_kitchen", label: "Non-Recurring — Kitchen items (₹)", kind: "number" },
          { name: "fld_grant_non_recurring_safety", label: "Non-Recurring — Safety equipment (₹)", kind: "number" },
          { name: "fld_grant_non_recurring_skill_dev", label: "Non-Recurring — Skill development equipment (₹)", kind: "number" },
          {
            name: "fld_grant_non_recurring",
            label: "Non-Recurring Total (₹)",
            kind: "number",
            required: true,
            help: "Worked out from the non-recurring break-up.",
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
            help: "Worked out from the recurring break-up.",
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
            // Feeds the application's amount requested.
            help: "Worked out from the recurring and non-recurring totals.",
            auto: { kind: "sum", from: ["fld_grant_recurring", "fld_grant_non_recurring"] },
          },
        ],
      },
    ],
  },
  {
    title: "Declarations",
    sections: [
      {
        title: "Compliance Declarations",
        // Undertakings (a)–(j) of the scheme rules.
        lead: "Certify the accuracy of the records, and give each undertaking the scheme rules require.",
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
          { name: "fld_auth_date", label: "Date", kind: "date", required: true, readOnly: true, rule: "notBackdated", help: DECLARATION_DATE_HELP },
          { name: "fld_auth_time", label: "Time", kind: "time", required: true, readOnly: true, help: DECLARATION_TIME_HELP },
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
    title: "Annual Report — previous financial year",
    note: "New applicants: previous two (2) financial years. 2nd instalment claims: previous financial year.",
  },
  {
    n: 3,
    title: "Audit Report (Balance Sheet, Income & Expenditure, Receipts & Payments)",
    note: "New applicants: previous two (2) financial years. 2nd instalment claims: previous financial year.",
  },
  { n: 4, title: "Any other document as requested", note: "Conditional — sought only where applicable.", optional: true },
  { n: 5, title: "Memorandum of Association, with its rules, aims and objectives" },
  { n: 6, title: "List of Management/Managing Committee Members" },
  {
    n: 7,
    title: "Rent Agreement for Garima Greh premises (notarised; rural certificate if applicable)",
    // Rented or leased premises only; it was asked of owned and donated premises too.
    showWhen: { field: "fld_premises_ownership", equals: ["Rented", "On Lease"] },
  },
  { n: 8, title: "Infrastructure details (rooms, kitchen, toilet, etc.)" },
  {
    n: 9,
    title: "Budget Estimate (item-wise recurring & non-recurring)",
    note: "New applicants: non-recurring items only. 1st instalment claims: recurring and non-recurring items.",
  },
  { n: 10, title: "Bank account details document" },
  { n: 11, title: "Agreement Bond/PSR on non-judicial stamp paper (₹20)" },
  {
    n: 12,
    title: "CCTV and live-feed registration proof",
    // Only when step 1 declares a camera and live feed (FR-INS-001). Step 1's help used to call
    // this "document 20"; it is twelfth, and a position is not a stable name for it anyway.
    showWhen: { field: "camera_live_feed", equals: ["Yes"] },
  },
];


export const SMILE_WIZARD: WizardDef = {
  code: "SMILE",
  // The scheme's official published name keeps the department's spelling, "Marginalized".
  title: "Support for Marginalized Individuals for Livelihood & Enterprise (SMILE) — Garima Greh",
  steps: SMILE_STEPS,
  documents: SMILE_DOCS,
  documentsNote: "PDF · Max 3 MB per file",
};

/* ══════════════════════════════════════════════════════════════════════════════
   NAPDDR — Full 10 steps matching live UAT portal
   ══════════════════════════════════════════════════════════════════════════════ */

const NAPDDR_STEPS: readonly StepDef[] = [
  {
    title: "Application Type",
    sections: [
      {
        title: "Application Type",
        lead: "Whether this is a new project or the renewal of an existing one.",
        fields: [
          // The controller. Live is a RADIO with exactly these two labels — the same two AVYAY
          // and SMILE fork on — captured 2026-09-07. Our schema previously asked this as a
          // SELECT with three options ("New Project / Renewal / Expansion"), which invented a
          // third branch the scheme does not have and gave the form nothing to fork on.
          { name: "case_type", label: "Case Type", kind: "radio", required: true, options: ["New project", "Ongoing / Renewal of an existing project"] },
          // NEW only. Live calls it Project Type and offers four; our old
          // fld_scheme_category offered five of a different vocabulary (CPLI, ODIC, SLCA),
          // none of which the live form lists.
          { name: "fld_project_type", label: "Project Type", kind: "select", required: true, options: ["DDAC — District De-Addiction Centre", "IRCA — Integrated Rehabilitation Centre", "IRCA — Female", "IRCA — Male Children"], showWhen: { field: "case_type", equals: ["New project"] } },
          // RENEWAL only. A renewal continues a sanctioned project, so it names which one and
          // which installment it is drawing — neither question means anything to a first-time
          // applicant, and our schema asked a new applicant neither.
          // Wide, so the option is read in full; at half width it was cut to "…FY 2026-2".
          { name: "fld_renewal_project", label: "Select the existing project to renew", kind: "select", required: true, wide: true, options: renewableProjectOptions("NAPDDR"), help: RENEWABLE_HELP, showWhen: { field: "case_type", equals: ["Ongoing / Renewal of an existing project"] } },
          { name: "fld_financial_year", label: "Financial Year for which grant is sought", kind: "select", required: true, options: ["2027-28", "2026-27", "2025-26"] },
          // Not a choice (review call 11 Sep 2026, T370–383): the system knows which instalments
          // this project has claimed, so the next one is stated, never picked from a list.
          { name: "fld_installment_no", label: "Instalment", kind: "text", required: true, readOnly: true, showWhen: { field: "case_type", equals: ["Ongoing / Renewal of an existing project"] }, help: "The next instalment due for this project, worked out from those already claimed." },
        ],
      },
    ],
  },
  {
    title: "Organisation Details",
    sections: [
      {
        title: "Organisation Details",
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
        title: "Project Details",
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
        title: "Location & Infrastructure",
        lead: "Physical setup, building ownership and safety compliance.",
        fields: [
          { name: "fld_project_location_address", label: "Centre / Facility Full Address", kind: "textarea", required: true, wide: true },
          { name: "fld_building_ownership", label: "Building Ownership Status", kind: "select", required: true, options: ["Rented Premises", "Owned by Organisation", "Government / Municipal Leased"] },
          { name: "fld_covered_area_sqft", label: "Total Covered Area (sq. ft.)", kind: "number", required: true },
          // The CCTV question is gone from the form (review call 11 Sep 2026, T640–644): CCTV is
          // its own module, not a self-declaration on every application.
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
        title: "Key Functionaries & Staff",
        lead: "Core clinical, counselling and administrative staff.",
        fields: [
          // One answer per box (review call 11 Sep 2026, T478–487): "Name & Qualification" in one
          // text field collected paragraphs, and nothing downstream could use them.
          { name: "fld_project_director", label: "Project Director / In-charge — Name", kind: "text", required: true, rule: "lettersOnly" },
          { name: "fld_project_director_qualification", label: "Project Director — Qualification", kind: "select", required: true, options: ["Graduate", "Post-graduate", "Professional (Social Work, Psychology, Medicine)", "Other"] },
          { name: "fld_project_director_mobile", label: "Project Director — Mobile Number", kind: "tel", required: true },
          { name: "fld_medical_officer", label: "Visiting Medical Officer — Name", kind: "text", required: true, rule: "lettersOnly" },
          { name: "fld_medical_officer_reg_no", label: "Medical Council Registration Number", kind: "text", required: true },
          { name: "fld_counselors_count", label: "Number of Full-Time Qualified Counsellors", kind: "number", required: true },
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
        title: "Capability & Prior Work",
        lead: "Experience in substance abuse treatment, counselling and community rehabilitation.",
        fields: [
          { name: "fld_years_in_deaddiction", label: "Years of Experience in Drug Demand Reduction / Health", kind: "number", required: true },
          { name: "fld_past_beneficiaries_served", label: "Total Individuals Rehabilitated / Served in Last 3 Years", kind: "number", required: true },
          { name: "fld_awards_recognitions", label: "State / National Recognitions or Empanelments", kind: "text", wide: true },
          // In rupees, like every other amount on the forms. It read "(₹ Lakhs)" and accepted
          // 250000 — twenty-five thousand crore — without comment.
          { name: "fld_annual_turnover_last_fy", label: "Annual Expenditure / Turnover in the Last Financial Year (₹)", kind: "number", required: true },
        ],
      },
    ],
  },
  {
    title: "Beneficiaries & Grant",
    sections: [
      {
        title: "Beneficiaries & Grant",
        lead: "Annual beneficiary targets and item-wise budget estimates.",
        fields: [
          { name: "fld_target_beneficiaries", label: "Projected Annual Inpatient / Outpatient Beneficiaries", kind: "number", required: true },
          // A renewal claims an instalment of what was SANCTIONED, not a fresh estimate, so the
          // estimates are carried forward read-only and the total follows from them
          // (review call 11 Sep 2026, T577–596). A new project enters them once.
          { name: "fld_honorarium_cost", label: "Estimated Staff Honorarium Cost (₹)", kind: "number", required: true, readOnlyWhen: { field: "case_type", equals: ["Ongoing / Renewal of an existing project"] } },
          { name: "fld_rent_admin_cost", label: "Estimated Rent & Administrative Expenses (₹)", kind: "number", required: true, readOnlyWhen: { field: "case_type", equals: ["Ongoing / Renewal of an existing project"] } },
          { name: "fld_medical_diet_cost", label: "Estimated Medical, Food & Counselling Expenses (₹)", kind: "number", required: true, readOnlyWhen: { field: "case_type", equals: ["Ongoing / Renewal of an existing project"] } },
          { name: "fld_grant_total", label: "Total Grant-in-Aid Requested (₹)", kind: "number", required: true, auto: { kind: "sum", from: ["fld_honorarium_cost", "fld_rent_admin_cost", "fld_medical_diet_cost"] }, help: "Worked out from the three estimates above." },
        ],
      },
      {
        title: "Bank Account",
        lead: "The account this project is paid into.",
        fields: [
          // A new project records its account here; that is how a project gets its first one.
          // A renewal shows the account already on record and cannot change it — a change is a
          // separate request under Project Bank Accounts (review call, T545–576).
          {
            name: "fld_bank_account_choice",
            label: "Bank Account",
            kind: "select",
            required: true,
            wide: true,
            options: ["State Bank of India · XXXX XXXX 4417 · SBIN0001234 · Pune Main", "Punjab National Bank · XXXX XXXX 2345 · PUNB0123456 · Shivaji Nagar"],
            readOnlyWhen: { field: "case_type", equals: ["Ongoing / Renewal of an existing project"] },
            helpWhen: {
              field: "case_type",
              byValue: {
                "New project": "The account the grant will be paid into.",
                "Ongoing / Renewal of an existing project": "The account recorded for this project. To change it, raise a request under Project Bank Accounts.",
              },
            },
          },
          // PFMS registration sits with the account it describes (T617–639). A renewal's account
          // has already received an instalment, so it is registered by definition and not asked.
          { name: "fld_pfms_registered", label: "This account is registered on the PFMS DBT module", kind: "radio", required: true, options: YES_NO, wide: true, showWhen: { field: "case_type", equals: ["New project"] }, help: "If it is not, the Ministry registers it before the grant is released." },
          { name: "fld_pfms_code", label: "NGO PFMS code (under head 3817)", kind: "text", required: true, showWhen: { field: "case_type", equals: ["Ongoing / Renewal of an existing project"] } },
        ],
      },
    ],
  },
  {
    // RENEWAL ONLY. Live draws eleven steps for a renewal and ten for a new project, and this
    // is the difference: a first-time applicant has no previous installment to account for, no
    // sanctioned project to have installed cameras at, and no PFMS code drawn against the
    // scheme. Captured as step 8 of 11 on 2026-09-07.
    // Renamed from "CCTV / EAT / PFMS Compliance": the CCTV question left the form and the PFMS
    // code moved to the bank account it belongs to (review call 11 Sep 2026, T617–644).
    title: "Previous Instalment",
    showWhen: { field: "case_type", equals: ["Ongoing / Renewal of an existing project"] },
    sections: [
      {
        title: "Use of the Previous Instalment",
        lead: "Evidence that the sanctioned project is running.",
        fields: [
          { name: "fld_previous_uc_submitted", label: "Previous instalment fully utilised and Utilisation Certificate submitted", kind: "radio", required: true, options: ["Yes", "No"] },
        ],
      },
    ],
  },
  {
    title: "Verification & Signatory",
    sections: [
      {
        title: "Verification & Signatory",
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

/**
 * NAPDDR's checklist forks, and the two branches barely overlap.
 *
 * Live asks a first-time applicant for TWELVE documents and a renewal for EIGHT, sharing
 * exactly one (the beneficiary list). Captured from both branches on 2026-09-07. Our schema
 * previously declared seventeen with no condition at all, so every applicant was asked for
 * every document of both branches — a new applicant for a Utilisation Certificate against a
 * grant they have never held, and a renewal for a Registration Certificate the department
 * already holds.
 *
 * Ordered NEW first, then the shared one, then RENEWAL, so `visibleDocuments` — which
 * renumbers to 1..n after filtering — reproduces each branch's live numbering in order.
 *
 * Three documents live asks for were missing here entirely: the Registration Certificate,
 * the Annual Report and the Audit Report, all NEW-branch. One we declared, "Agreement Bond /
 * PSR on non-judicial stamp paper", appears on NEITHER live branch and is dropped; if it is
 * collected at all it is after sanction, not with the application.
 */
const NAPDDR_DOCS: readonly DocDef[] = [
  // ── New project · 12 ────────────────────────────────────────────────────────
  { n: 1, title: "Memorandum of Association", description: "Aims & objectives of the organisation", showWhen: { field: "case_type", equals: ["New project"] } },
  { n: 2, title: "PAN card of the organisation", showWhen: { field: "case_type", equals: ["New project"] } },
  { n: 3, title: "List of Managing Committee Members", description: "Current financial year", showWhen: { field: "case_type", equals: ["New project"] } },
  { n: 4, title: "List of Staff / Employees", description: "Current financial year, with qualifications", showWhen: { field: "case_type", equals: ["New project"] } },
  // The one document both branches ask for.
  { n: 5, title: "List of Beneficiaries — previous year" },
  { n: 6, title: "Infrastructure details", description: "Rooms, kitchen, toilets, etc.", showWhen: { field: "case_type", equals: ["New project"] } },
  { n: 7, title: "Bank Authorisation Letter / account details", description: "Name, A/C no., IFSC / MICR", showWhen: { field: "case_type", equals: ["New project"] } },
  { n: 8, title: "Budget Estimate for the proposed year", description: "Recurring & non-recurring", showWhen: { field: "case_type", equals: ["New project"] } },
  { n: 9, title: "Registration Certificate", description: "Societies Act / Trust Act or equivalent", showWhen: { field: "case_type", equals: ["New project"] } },
  { n: 10, title: "Annual Report — last two financial years", showWhen: { field: "case_type", equals: ["New project"] } },
  { n: 11, title: "Audit Report — last two financial years", showWhen: { field: "case_type", equals: ["New project"] } },
  { n: 12, title: "Audited Accounts — previous year", description: "Balance Sheet, I&E, R&P, Auditor's Report", showWhen: { field: "case_type", equals: ["New project"] } },

  // ── Ongoing / renewal · 8 listed, 6 mandatory ───────────────────────────────
  // Live's own footer: "Upload all 6 documents to proceed (1/8)." The provisional audit
  // report and the staff monitoring sheet carry an OPTIONAL marker; the other six do not.
  { n: 13, title: "Utilisation Certificate (GFR-12A)", description: "Previous grant, certified by a Chartered Accountant", showWhen: { field: "case_type", equals: ["Ongoing / Renewal of an existing project"] } },
  { n: 14, title: "Provisional Utilisation Certificates", description: "Grants released during the previous year", showWhen: { field: "case_type", equals: ["Ongoing / Renewal of an existing project"] } },
  { n: 15, title: "Half-Yearly Progress Report", showWhen: { field: "case_type", equals: ["Ongoing / Renewal of an existing project"] } },
  { n: 16, title: "Provisional / unaudited audit report", optional: true, showWhen: { field: "case_type", equals: ["Ongoing / Renewal of an existing project"] } },
  { n: 17, title: "CCTV & Proactive-Disclosures status", showWhen: { field: "case_type", equals: ["Ongoing / Renewal of an existing project"] } },
  { n: 18, title: "Expenditure, Advance and Transfer (EAT) Module implementation status", showWhen: { field: "case_type", equals: ["Ongoing / Renewal of an existing project"] } },
  { n: 19, title: "Staff Monitoring Sheet", optional: true, showWhen: { field: "case_type", equals: ["Ongoing / Renewal of an existing project"] } },
];

export const NAPDDR_WIZARD: WizardDef = {
  code: "NAPDDR",
  title: "NAPDDR — National Action Plan for Drug Demand Reduction",
  steps: NAPDDR_STEPS,
  documents: NAPDDR_DOCS,
  documentsNote: "PDF only · Max 5 MB per file",
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

/**
 * Codes that have been used for a scheme and still reach its form. SMILE was seeded as
 * "SMILE_GG", and links built from that code (`/apply-grant/scheme/SMILE_GG/step-1`) opened
 * "Please choose a scheme first." The route now resolves it and replaces the address with the
 * canonical code.
 */
export const SCHEME_ALIASES: Readonly<Record<string, SchemeCode>> = { SMILE_GG: "SMILE" };

export function wizardFor(schemeCode: string | undefined): WizardDef | undefined {
  if (!schemeCode) return undefined;
  const code = schemeCode.toUpperCase();
  return WIZARDS[(SCHEME_ALIASES[code] ?? code) as SchemeCode];
}

/** The help shown under a field for the answers given so far. See `FieldDef.helpWhen`. */
export function fieldHelp(field: FieldDef, values: Record<string, string>): string | undefined {
  const rule = field.helpWhen;
  if (rule) {
    const byBranch = rule.byValue[values[rule.field] ?? ""];
    if (byBranch !== undefined) return byBranch;
  }
  return field.help;
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
  // `n` is the document's IDENTITY and is returned unchanged. It used to be rewritten to the
  // filtered position — `.map((d, i) => ({ ...d, n: i + 1 }))` — which read as a convenience
  // and was a data-loss bug: uploads are keyed by `n`, so the same document had a different
  // key on each branch. An applicant who attached a Rent Agreement as AVYAY's new-project
  // document 10, then switched to renewal where it is document 6, had their upload silently
  // re-attributed to whichever document now sat at position 10.
  //
  // The DISPLAY number is the render position and belongs to the renderer, which has the
  // index. Nothing outside a list needs it, and identity must not depend on what else is
  // visible at the time.
  return wizard.documents.filter(
    (d) => !d.showWhen || d.showWhen.equals.includes(values[d.showWhen.field] ?? ""),
  );
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
/**
 * What to say when a required field is empty.
 *
 * `${label} is required.` produces "Select the existing project to renew is required." — a label
 * with three words bolted on, which is not a sentence and does not tell anyone what to do. A
 * label that already reads as an instruction IS the sentence; one that names a thing gets the
 * verb its control implies.
 */
export function requiredMessage(field: FieldDef): string {
  if (field.requiredMessage) return field.requiredMessage;
  const label = field.label.replace(/\s*\*\s*$/, "").trim();
  if (/^(select|choose|enter|upload|pick|describe|specify|attach|confirm)\b/i.test(label)) {
    return `${label}.`;
  }
  // Never lower-case the label: it opens with acronyms and proper nouns often enough
  // ("NGO-Darpan Unique ID") that doing so is worse than the capital.
  const verb =
    field.kind === "select" || field.kind === "radio" || field.kind === "checkbox"
      ? "Select"
      : "Enter";
  return `${verb} ${label}.`;
}

/** Today as `YYYY-MM-DD`, in local time — the shape a date input holds. */
export function todayIso(now = new Date()): string {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export function validateStep(
  step: StepDef,
  values: Record<string, string>,
  /** Injected so a test can fix the day; the form passes nothing. */
  today: string = todayIso(),
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const f of stepFields(step)) {
    if (!fieldVisible(f, values)) continue;
    const v = (values[f.name] ?? "").trim();

    if (f.required && !v) {
      errors[f.name] = requiredMessage(f);
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
      case "notBackdated":
        // The declaration is signed now. It accepted 2015 (form-path QA, 13 Sep 2026).
        if (v < today) errors[f.name] = "The declaration date cannot be earlier than today.";
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
    if (f.auto.kind === "projectIdOf") {
      const value = (next[f.auto.from] ?? "").split(" — ")[0]?.trim() ?? "";
      if (next[f.name] !== value) next = { ...next, [f.name]: value };
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
