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

import { CITY_CATEGORIES, INDIAN_STATES, NE_HIMALAYAN_STATES, cityCategoryFor } from "./geography.ts";

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
   * AVYAY's recurring grant for a new project: the central share of the published cost norms for
   * the project type, agency, State and building entered earlier (live: "the recurring grant is
   * the published norm for this project"). One figure is typed on that step — the non-recurring
   * grant — and the rest follows (review call 11 Sep 2026, T577–585).
   */
  | { kind: "avyayRecurringNorm" }
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
  helpWhen?: ByValue | readonly ByValue[];
  /**
   * Keep the help visible when the field is locked. Help under a locked field is normally hidden
   * (a locked box already says it cannot be typed in), but a few locked fields carry the one
   * instruction the applicant needs: how to change the value somewhere else.
   */
  helpWhenLocked?: boolean;
  /**
   * A label that differs by branch, keyed by the controlling field's value. A renewal's grant
   * figures are what was SANCTIONED, and labelling them "Estimated" or "Requested" said otherwise.
   */
  labelWhen?: ByValue | readonly ByValue[];
  options?: readonly string[];
  /**
   * The live form labels several fields "Read-only — sourced from NGO-Darpan / your login" but
   * leaves them editable in the DOM (defect D8). The clone honours the claim rather than the
   * defect — see docs/research/eanudaan-dev-defects.md.
   */
  readOnly?: boolean;
  /** Character budget; renders the live "n / N characters" counter. */
  maxLength?: number;
  /**
   * Advice shown under the field that never blocks it. `costedStrength`: AVYAY's beneficiaries against
   * the number of residents the chosen project type is costed for (`strengthAdvice`).
   */
  advisory?: "costedStrength";
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
  readOnlyWhen?: Condition;
  /** Further conditions under which the field is read-only; any one is enough. */
  readOnlyWhenAny?: readonly Condition[];
  /**
   * Options that come from the signed-in applicant's own records rather than a literal list —
   * AVYAY's renewal picker lists the NGO's projects with an instalment open to claim. The wizard
   * supplies them (`visibleOptions`' third argument).
   */
  optionsFrom?: "renewableProjects";
  /**
   * Required once any of these fields has an answer. An optional second staff member is optional
   * as a whole, but a name given without a designation is not a record of anyone.
   */
  requiredWith?: readonly string[];
  /** Overrides the generated "this field is missing" message where the generic one reads badly. */
  requiredMessage?: string;
  /** Options come from a state field rather than a literal list (cascading District). */
  districtsOf?: string;
  /** Value derived from other fields; the control renders read-only. */
  auto?: AutoRule;
  /** Extra validation beyond "required". */
  rule?: "afterRegistration" | "afterPeriodFrom" | "nameAndPhone" | "lettersOnly" | "pin" | "ifsc" | "pan" | "notBackdated" | "notFuture" | "mustBeYes" | "accountNumber";
  /** A number that may not exceed another field's — "Of which women" against the total. */
  notMoreThan?: string;
  /** Span the full width of the two-column grid. */
  wide?: boolean;
}

/** "While `field` holds one of these values." */
export interface Condition {
  field: string;
  equals: readonly string[];
}

/** A wording keyed by the value of another field; the first rule naming the current value wins. */
export interface ByValue {
  field: string;
  byValue: Readonly<Record<string, string>>;
}

export interface SectionDef {
  title: string;
  lead?: string;
  fields: readonly FieldDef[];
  /** Four columns rather than three — one row per person for a name · qualification · designation · contact record. */
  columns?: 3 | 4;
  /**
   * Asked again on a 2nd or 3rd instalment, so it opens expanded on the Confirm Details step.
   * Every other section is carried forward collapsed and read-only, with Edit on demand
   * (review call 11 Sep 2026, T667–675).
   */
  reconfirm?: boolean;
  /**
   * Drawn as a compact read-only record rather than locked input boxes while this holds — a
   * renewal's bank account, which is shown, not asked (T549–559).
   */
  summaryWhen?: Condition;
}

/**
 * `confirm` is a 2nd or 3rd instalment's one step for everything carried forward: the sections of
 * the form steps it replaces, collapsed and read-only, with the ones that must be re-confirmed open.
 */
export type StepKind = "form" | "confirm" | "documents" | "review";

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
  /** Not shown while this holds — the form steps a later instalment folds into Confirm Details. */
  hideWhen?: Condition;
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
  /** Not asked while this holds — a CCTV status document on a renewal (review call, T640–644). */
  hideWhen?: Condition;
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
export const SMILE_CASE_NEW = "No — new project (Project ID auto-generated)";
export const SMILE_CASE_EXISTING = "Yes — existing project (select the Project ID)";
const FINANCIAL_YEARS = ["2027-28", "2026-27", "2025-26"] as const;


/** The declaration that closes every scheme's review step, verbatim from the live portal. */
export const DECLARATION_TEXT =
  "I declare that the information furnished in this application and in every document uploaded " +
  "with it is true, complete and correct to the best of my knowledge and belief. I understand " +
  "that the grant-in-aid may be withheld or recovered, and action taken under the rules, if any " +
  "particular is found to be false or if any material fact has been concealed.";


/* ══════════════════════════════════════════════════════════════════════════════
   Shared by every scheme's renewal: the claim, the account on record, the instalment's grant
   ══════════════════════════════════════════════════════════════════════════════ */

/**
 * Share of the year's sanctioned recurring grant each instalment releases, per scheme. From the
 * review call of 11 Sep 2026 (T339): NAPDDR, AVYAY and SHRESHTA 40-40-20, SMILE 50-50. The live
 * NAPDDR renewal says the same in its own help ("40% / 40% / 20%").
 */
export const RELEASE_PATTERN: Readonly<Record<string, readonly number[]>> = {
  AVYAY: [40, 40, 20],
  NAPDDR: [40, 40, 20],
  SHRESHTA_M2: [40, 40, 20],
  SMILE: [50, 50],
};

/** The field each scheme's renewal names its project in. Choosing it states the whole claim. */
export const RENEWAL_PICKER: Readonly<Record<SchemeCode, string>> = {
  AVYAY: "fld_ongoing_source_application",
  NAPDDR: "fld_ongoing_source_application",
  SMILE: "fld_smile_project_select",
  SHRESHTA_M2: "fld_institution_select",
};

/** A 2nd or 3rd instalment: set when the project is chosen (`instalments.ts` `renewalAnswers`). */
const LATER_INSTALMENT = { field: "claim_stage", equals: ["later-instalment"] } as const;
/** A project with a sanctioned history has been chosen — the claim is on record. */
const CLAIMED = { field: "claim_stage", equals: ["first-instalment", "later-instalment"] } as const;
/** No project chosen: nothing is on record yet. */
const UNCLAIMED = { field: "claim_stage", equals: [""] } as const;

const QUALIFICATIONS = [
  "Below Class 10",
  "Class 10",
  "Class 12",
  "Diploma / Certificate",
  "Graduate",
  "Post-graduate",
  "Professional (Medicine, Nursing, Social Work)",
] as const;

/**
 * One person as four answers — name · qualification · designation · mobile — instead of a box that
 * collected sentences (review call 11 Sep 2026, T478–489). The designation is chosen from `posts`
 * where the scheme publishes its posts, and typed (letters only) where it does not.
 */
function person(prefix: string, who: string, required: boolean, posts?: readonly string[], showWhen?: FieldDef["showWhen"]): FieldDef[] {
  const names = [`${prefix}_name`, `${prefix}_qualification`, `${prefix}_designation`, `${prefix}_mobile`];
  const group = (self: string) => (required ? {} : { requiredWith: names.filter((n) => n !== self) });
  const when = showWhen ? { showWhen } : {};
  return [
    { name: names[0]!, label: `${who} — Name`, kind: "text", required, rule: "lettersOnly", ...group(names[0]!), ...when },
    { name: names[1]!, label: `${who} — Qualification`, kind: "select", required, options: QUALIFICATIONS, ...group(names[1]!), ...when },
    posts
      ? { name: names[2]!, label: `${who} — Designation`, kind: "select", required, options: posts, ...group(names[2]!), ...when }
      : { name: names[2]!, label: `${who} — Designation`, kind: "text", required, rule: "lettersOnly", ...group(names[2]!), ...when },
    // "Mobile", not "Mobile Number": the longer label wrapped in a four-column row and dropped its
    // box 20px below its neighbours (audit W-12).
    { name: names[3]!, label: `${who} — Mobile`, kind: "tel", required, ...group(names[3]!), ...when },
  ];
}

/**
 * The account a project is paid into: typed once for a new project — that is how a project gets its
 * first account (T146–155) — and, on a renewal, the account on record shown as a compact read-only
 * record with its PFMS registration beside it (T540–559, T617–639). A registered account is not
 * asked about PFMS again (T635–636); the portal cannot check PFMS, so the NGO declares it and the
 * Ministry validates it (T614–633).
 */
function bankRecordFields(onRecord: Condition): FieldDef[] {
  return [
    { name: "fld_bank_name", label: "Bank", kind: "text", required: true, readOnlyWhen: onRecord },
    { name: "fld_bank_account_number", label: "Account Number", kind: "text", required: true, rule: "accountNumber", readOnlyWhen: onRecord },
    { name: "fld_bank_ifsc", label: "IFSC Code", kind: "text", required: true, rule: "ifsc", readOnlyWhen: onRecord },
    { name: "fld_bank_branch", label: "Branch", kind: "text", required: true, readOnlyWhen: onRecord },
    { name: "fld_pfms_status", label: "PFMS DBT Registration", kind: "text", required: true, readOnly: true, showWhen: { field: "fld_pfms_on_record", equals: ["Yes"] } },
    {
      name: "fld_pfms_registered",
      label: "This account is registered on the PFMS DBT module",
      kind: "radio",
      required: true,
      options: YES_NO,
      wide: true,
      showWhen: { field: "fld_pfms_on_record", equals: ["", "No"] },
      help: "If it is not, the Ministry registers it before the grant is released.",
    },
  ];
}

/** "Amount of the 2nd Instalment — 40% (₹)", for each instalment the scheme releases. */
function instalmentLabels(scheme: SchemeCode, template: (ord: string, share: number) => string): Record<string, string> {
  const ords = ["1st", "2nd", "3rd"];
  return Object.fromEntries((RELEASE_PATTERN[scheme] ?? []).map((share, i) => [`${ords[i]} Instalment`, template(ords[i]!, share)]));
}

/**
 * A renewal claims an instalment of what was SANCTIONED, so nothing here is typed (T577–596): the
 * year's sanctioned recurring grant, this instalment's amount, what the year's earlier instalments
 * released and what remains. Labels default to AVYAY's; NAPDDR passes live's own.
 */
function instalmentGrantSection(
  scheme: SchemeCode,
  renewal: Condition,
  labels: { annual: string; amount: (ord: string, share: number) => string; prior: string; remaining: string } = {
    annual: "Recurring Grant Sanctioned for the Year (₹)",
    amount: (ord, share) => `Amount of the ${ord} Instalment — ${share}% (₹)`,
    prior: "Released Earlier This Year (₹)",
    remaining: "Remaining After This Instalment (₹)",
  },
): SectionDef {
  return {
    title: "Grant for This Instalment",
    reconfirm: true,
    fields: [
      { name: "fld_sanctioned_recurring", label: labels.annual, kind: "number", required: true, readOnly: true, showWhen: renewal },
      {
        name: "fld_instalment_amount",
        label: "Amount of This Instalment (₹)",
        kind: "number",
        required: true,
        readOnly: true,
        showWhen: renewal,
        labelWhen: { field: "fld_installment_no", byValue: instalmentLabels(scheme, labels.amount) },
      },
      { name: "fld_grant_applied_prior", label: labels.prior, kind: "number", readOnly: true, showWhen: renewal },
      { name: "fld_grant_remaining", label: labels.remaining, kind: "number", readOnly: true, showWhen: renewal },
    ],
  };
}

/** A 2nd or 3rd instalment's one step for everything carried forward. See `StepKind`. */
const CONFIRM_DETAILS: StepDef = { title: "Confirm Details", kind: "confirm", showWhen: LATER_INSTALMENT, sections: [] };

/* ══════════════════════════════════════════════════════════════════════════════
   SHRESHTA Mode 2 — 7 steps (6 on live, plus Application Type); a 2nd or 3rd instalment is 4.
   Live UAT captures NGO-SHRESHTA-M2-S01…S05 (07–08 Sep 2026).
   ══════════════════════════════════════════════════════════════════════════════ */

const SHRESHTA_STEPS: readonly StepDef[] = [
  {
    // Not a live step. Live asks for the institution on step 2, after the organisation details it
    // then refills; the choice decides what the rest of the form is, so it comes first — the same
    // Application Type step the other schemes open with. Institution chosen = a renewal on record.
    title: "Application Type",
    sections: [
      {
        title: "Institution",
        lead: "Choose the institution this application is for.",
        fields: [
          {
            name: "fld_institution_select",
            label: "Institution",
            kind: "select",
            wide: true,
            optionsFrom: "renewableProjects",
            help: "Your institutions with a sanctioned grant and an instalment open to claim; the form is filled in from the last sanctioned application. If yours is not listed, leave this blank and enter its details.",
          },
          { name: "fld_institution_id", label: "Institution ID", kind: "text", required: true, readOnlyWhen: CLAIMED },
          {
            name: "fld_financial_year",
            label: "Financial Year for which Grant-in-Aid is sought",
            kind: "select",
            required: true,
            options: FINANCIAL_YEARS,
            // Locked on a claim too (audit W-09): the instalment plan decides its year, and an editable
            // year let a 1st instalment be claimed for the wrong one.
            readOnlyWhenAny: [UNCLAIMED, CLAIMED],
            helpWhenLocked: true,
            helpWhen: {
              field: "claim_stage",
              byValue: {
                "": "An application not claimed on an institution's record is for the financial year now running.",
                "first-instalment": "The year whose instalment you are claiming.",
                "later-instalment": "The year of the application this instalment is claimed under.",
              },
            },
          },
          { name: "fld_installment_no", label: "Instalment", kind: "text", required: true, readOnly: true, showWhen: CLAIMED },
        ],
      },
    ],
  },
  CONFIRM_DETAILS,
  {
    title: "Organisation Details",
    hideWhen: LATER_INSTALMENT,
    sections: [
      {
        title: "Organisation Details",
        lead: "Identity of the applicant NGO/VO. Pre-filled from NGO-Darpan where available.",
        fields: [
          { name: "fld_ngo_name", label: "Name of NGO / VO (as in NGO-Darpan)", kind: "text", required: true, readOnly: true },
          { name: "fld_darpan_id", label: "NGO-Darpan Unique ID", kind: "text", required: true, readOnly: true },
          { name: "fld_statute_act", label: "Statute / Act of Registration", kind: "text", required: true, help: "For example, Societies Registration Act, 1860." },
          { name: "fld_registration_number", label: "Registration Number", kind: "text", required: true },
          { name: "fld_registration_date", label: "Date of Registration", kind: "date", required: true, rule: "notFuture" },
          { name: "fld_registration_expiry", label: "Date of Expiry", kind: "date", required: true, rule: "afterRegistration" },
          { name: "fld_reg_office_address", label: "Registered-Office Address", kind: "textarea", required: true, wide: true },
          { name: "fld_reg_office_city", label: "City", kind: "text", required: true },
          { name: "fld_reg_office_district", label: "District", kind: "text", required: true, readOnly: true },
          { name: "fld_reg_office_state", label: "State", kind: "text", required: true, readOnly: true },
          { name: "fld_contact_mobile", label: "Mobile", kind: "tel", required: true, help: "Notifications about this application are sent here." },
          { name: "fld_contact_email", label: "Email", kind: "email", required: true, help: "Notifications about this application are sent here." },
          { name: "fld_contact_telephone", label: "Telephone", kind: "tel" },
          { name: "fld_contact_fax", label: "Fax", kind: "text" },
        ],
      },
    ],
  },
  {
    title: "Institution Details",
    hideWhen: LATER_INSTALMENT,
    sections: [
      {
        title: "Institution Details",
        lead: "Details of the institution for which Grant-in-Aid is sought.",
        fields: [
          {
            name: "fld_nature_of_institution",
            label: "Nature of Institution",
            kind: "select",
            required: true,
            options: ["Primary Residential School", "Secondary Residential School", "Primary Non-Residential School", "Secondary Non-Residential School", "Primary Hostel", "Secondary Hostel"],
          },
          { name: "fld_institution_gender_type", label: "Type", kind: "select", required: true, options: ["Boys", "Girls", "Co-Ed"] },
          { name: "fld_institution_level", label: "Level", kind: "select", required: true, options: ["Primary", "Secondary"] },
          // "New" since 16 Sep 2026: a New institution has no grant history, and the form asked it for one
          // (`fld_gia_since_year` below). A claim on an institution's record is Ongoing, and stays so.
          { name: "fld_institution_status", label: "Status of Institution", kind: "select", required: true, options: ["New", "Ongoing"], readOnlyWhen: CLAIMED },
          { name: "assistance_3yrs", label: "Receiving assistance continuously for the last 3 years", kind: "radio", required: true, options: YES_NO, wide: true },
          // Live labels this "UC Pending Status (SFR 212(1))" — a rule citation we could not trace.
          { name: "fld_uc_pending_status", label: "Utilisation Certificate Pending Status", kind: "select", required: true, options: ["No Utilisation Certificate Pending", "Utilisation Certificate Pending"] },
          { name: "fld_commencement_date", label: "Date & Year of Commencement", kind: "date", required: true },
          { name: "fld_gia_since_year", label: "Year from which Grant-in-Aid has been received under SHRESHTA", kind: "text", required: true, showWhen: { field: "fld_institution_status", equals: ["Ongoing"] } },
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
    hideWhen: LATER_INSTALMENT,
    sections: [
      {
        title: "Bank Account Details",
        columns: 4,
        summaryWhen: CLAIMED,
        fields: [
          // The account's operating conditions are declared once, when the account is first
          // recorded; the account on record is not declared again.
          { name: "bank_ngo_name_declared", label: "Account is in the name of the NGO/VO", kind: "radio", required: true, options: YES_NO, wide: true, rule: "mustBeYes", showWhen: UNCLAIMED },
          { name: "bank_joint_operation", label: "Account jointly operated by President & Secretary", kind: "radio", required: true, options: YES_NO, wide: true, showWhen: UNCLAIMED },
          { name: "bank_hq_at_institution", label: "Head office at the institution location", kind: "radio", required: true, options: YES_NO, wide: true, showWhen: UNCLAIMED },
          { name: "bank_joint_secretary_head", label: "Joint account of Secretary & Head at the location", kind: "radio", required: true, options: YES_NO, wide: true, showWhen: UNCLAIMED },
          { name: "bank_separate_institution_accounts", label: "Separate institution-wise accounts maintained", kind: "radio", required: true, options: YES_NO, wide: true, showWhen: UNCLAIMED },
          ...bankRecordFields(CLAIMED),
        ],
      },
      {
        // Moved out of the bank section: it is not a bank detail, and the account on record is
        // drawn as a compact record on a renewal.
        title: "Resource Mobilisation",
        fields: [
          { name: "fld_bank_resource_mobilisation", label: "Resource-mobilisation capability (sources / amount)", kind: "textarea", wide: true, help: "The organisation's own sources of funds, with indicative amounts." },
        ],
      },
      {
        title: "Grant-in-Aid Released — Last 3 Years",
        fields: [
          { name: "fld_gia_released_last_3yrs", label: "Grant-in-Aid released in the last 3 years (sanction number, date, amount sanctioned, amount utilised)", kind: "textarea", wide: true },
        ],
      },
      {
        title: "Beneficiaries",
        reconfirm: true,
        fields: [
          { name: "fld_beneficiaries_sc", label: "SC Beneficiaries", kind: "number", required: true },
          { name: "fld_beneficiaries_other", label: "Other-Category Beneficiaries", kind: "number" },
          { name: "fld_total_beneficiaries", label: "Total Number of Beneficiaries", kind: "number", required: true, auto: { kind: "sum", from: ["fld_beneficiaries_sc", "fld_beneficiaries_other"] } },
          { name: "fld_beneficiaries_previous_year", label: "Number of Beneficiaries (Previous Year)", kind: "number" },
        ],
      },
      {
        title: "Grant Sought",
        lead: "The total is the recurring and non-recurring grant added together.",
        fields: [
          { name: "fld_grant_recurring", label: "Recurring Grant Sought (₹)", kind: "number", required: true, showWhen: UNCLAIMED },
          { name: "fld_grant_non_recurring", label: "Non-Recurring Grant Sought (₹)", kind: "number", required: true, showWhen: UNCLAIMED },
          { name: "fld_grant_total", label: "Total Grant Sought (₹)", kind: "number", required: true, showWhen: UNCLAIMED, auto: { kind: "sum", from: ["fld_grant_recurring", "fld_grant_non_recurring"] } },
        ],
      },
      instalmentGrantSection("SHRESHTA_M2", CLAIMED),
    ],
  },
  {
    title: "Declarations",
    hideWhen: LATER_INSTALMENT,
    sections: [
      {
        title: "Compliance Declarations",
        reconfirm: true,
        fields: [
          { name: "decl_uc_uploaded", label: "Requisite Utilisation Certificate uploaded", kind: "radio", required: true, options: YES_NO, wide: true },
          { name: "decl_audited_accounts_submitted", label: "Audited accounts (previous year) submitted", kind: "radio", required: true, options: YES_NO, wide: true },
          { name: "decl_name_changed_after_grant", label: "Organisation changed its name after the first grant", kind: "radio", required: true, options: YES_NO, wide: true },
          { name: "decl_not_for_profit", label: "Confirm the organisation does not earn profit by running the institution", kind: "radio", required: true, options: YES_NO, wide: true },
          { name: "decl_other_grant", label: "Receiving grant from another Government source for the same purpose", kind: "radio", required: true, options: YES_NO, wide: true },
          { name: "decl_fee_charged", label: "Capitation / other fee charged from beneficiaries", kind: "radio", required: true, options: YES_NO, wide: true },
          { name: "decl_not_blacklisted", label: "Confirm the organisation is not blacklisted by any authority", kind: "radio", required: true, options: YES_NO, wide: true },
          { name: "decl_annual_report_uploaded", label: "Annual report (previous year) uploaded", kind: "radio", required: true, options: YES_NO, wide: true },
          { name: "decl_all_docs_signed", label: "All documents signed by the authorised signatory", kind: "radio", required: true, options: YES_NO, wide: true },
        ],
      },
      {
        title: "Authorised Person & Declaration",
        reconfirm: true,
        fields: [
          { name: "fld_auth_person_name", label: "Name of Authorised Person", kind: "text", required: true, rule: "lettersOnly" },
          { name: "fld_auth_person_contact", label: "Mobile Number of Authorised Person", kind: "tel", required: true },
          { name: "fld_auth_place", label: "Place", kind: "text", required: true },
          { name: "fld_auth_date", label: "Date", kind: "date", required: true, readOnly: true, rule: "notBackdated" },
          { name: "fld_auth_time", label: "Time", kind: "time", required: true, readOnly: true },
        ],
      },
    ],
  },
  { title: "Upload Documents", kind: "documents", sections: [] },
  { title: "Review & Submit", kind: "review", sections: [] },
];

/**
 * An institution claimed on its record is asked for the ten documents live asks (UAT, 07–08 Sep
 * 2026) — what changes each year. One not on record is asked for all twenty, less the CCTV status
 * on a renewal. Numbers are identities and never move.
 */
const SH_ON_RECORD = CLAIMED;
const SHRESHTA_DOCS: readonly DocDef[] = [
  { n: 1, title: "Registration Certificate (Societies Registration Act 1860 / Charitable Trust) — certified copy", hideWhen: SH_ON_RECORD },
  { n: 2, title: "PAN of the Organisation", hideWhen: SH_ON_RECORD },
  { n: 3, title: "Annual Report — Previous Financial Year", hideWhen: SH_ON_RECORD },
  { n: 4, title: "List of Beneficiaries — Previous Year", hideWhen: SH_ON_RECORD },
  { n: 5, title: "List of Managing Committee Members" },
  { n: 6, title: "Budget Estimates — Current Year" },
  { n: 7, title: "Audited Accounts (Balance Sheet, Income & Expenditure, Receipt & Payment)", hideWhen: SH_ON_RECORD },
  { n: 8, title: "Utilisation Certificate (GFR 12-A) — Previous Year, Signed by a Chartered Accountant", showWhen: { field: "fld_institution_status", equals: ["Ongoing"] } },
  { n: 9, title: "Provisional Utilisation Certificates — Grants Released Previous Year (GFR 12-A)", showWhen: { field: "fld_institution_status", equals: ["Ongoing"] } },
  { n: 10, title: "Bank Authorisation Letter (name, account number, address, IFSC / MICR)" },
  { n: 11, title: "Agreement Bond / PSR on Non-Judicial Stamp Paper" },
  // No CCTV document on a renewal (review call, T640–644; W3). Live's renewal list omits it too.
  { n: 12, title: "Compliance Status — Proactive Disclosures & CCTV Installation", hideWhen: CLAIMED },
  { n: 13, title: "Expenditure, Advance and Transfer (EAT) Module Implementation Status" },
  { n: 14, title: "Justification for Continuation of Ongoing Institution", showWhen: { field: "fld_institution_status", equals: ["Ongoing"] }, hideWhen: SH_ON_RECORD },
  { n: 15, title: "Accounts in Parts (I&E, R&P, Balance Sheet, Auditor's Report)" },
  { n: 16, title: "List of Employees (name, designation, category, photo ID, Aadhaar)" },
  { n: 17, title: "Rent Agreement, Institution Location & Route Map", showWhen: { field: "fld_building_ownership", equals: ["Rented"] } },
  { n: 18, title: "Details of Income and Expenditure", hideWhen: SH_ON_RECORD },
  { n: 19, title: "School Recognition Certificate", hideWhen: SH_ON_RECORD },
  { n: 20, title: "Audit Report — Previous Year", hideWhen: SH_ON_RECORD },
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

/** AVYAY's two branches and its two kinds of renewal, named once. */
const AV_NEW = "New project";
/**
 * The residents each AVYAY project type is costed for — the number in its name, and 20 for a
 * Continuous Care Home. The cost norms scale with it (`AVYAY_COST_HEADS_BY_CAPACITY`).
 */
const AVYAY_COSTED_STRENGTH: Readonly<Record<string, number>> = {
  "Senior Citizens' Home — 25 beneficiaries": 25,
  "Senior Citizens' Home — 50 beneficiaries": 50,
  "Senior Citizens' Home — 50 elderly women only": 50,
  "Continuous Care Home (CCH) / Dementia / Alzheimer's": 20,
};

/** The residents an AVYAY project is costed for, from its project type; undefined where the type has none. */
export function costedStrength(values: Record<string, string>): number | undefined {
  return AVYAY_COSTED_STRENGTH[values.fld_nature_of_project ?? ""];
}

/**
 * Advice under a beneficiary count that is below the strength its project type is costed for. Never
 * a validation error: the norms reduce the attendance-linked grant instead (see the field's note).
 */
export function strengthAdvice(field: FieldDef, values: Record<string, string>): string | undefined {
  if (field.advisory !== "costedStrength") return undefined;
  const strength = costedStrength(values);
  const raw = (values[field.name] ?? "").trim();
  if (!strength || !/^\d+$/.test(raw) || Number(raw) >= strength) return undefined;
  return `Fewer than the ${strength} residents this project type is costed for. The attendance-linked part of the recurring grant is reduced when a home runs below that strength.`;
}
const AV_RENEWAL = "Ongoing / Renewal of an existing project";
const NEW_ONLY = { field: "case_type", equals: [AV_NEW] } as const;
const RENEWAL_ONLY = { field: "case_type", equals: [AV_RENEWAL] } as const;
/**
 * The posts the AVYAY cost norms fund, as the norms name them (the 18 heads below). A project's
 * key staff hold one of these posts, so the designation is chosen from them rather than typed.
 */
const AVYAY_POSTS = [
  "Superintendent",
  "Social Worker / Counsellor",
  "Doctor",
  "Nurse",
  "Yoga Therapist",
  "Accountant / Clerk",
  "Cook",
  "Multi-Tasking Staff",
  "Other",
] as const;

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
            options: [AV_NEW, AV_RENEWAL],
            help: "Choose 'Ongoing / Renewal' to carry forward the details of one of your existing AVYAY projects.",
          },
          {
            name: "fld_ongoing_source_application",
            label: "Select the existing project to renew",
            kind: "select",
            required: true,
            wide: true,
            showWhen: RENEWAL_ONLY,
            // The NGO's OWN projects with an instalment open now, from its sanctioned record. It
            // listed two illustrative projects that were not the NGO's, so every renewal derived
            // "1st Instalment" from a history that did not exist.
            optionsFrom: "renewableProjects",
            help: "Your projects with a sanctioned grant and an instalment open to claim. The form is filled in from the project's last sanctioned application.",
          },
          {
            name: "fld_financial_year",
            label: "Financial Year for which grant is sought",
            kind: "select",
            required: true,
            options: FINANCIAL_YEARS,
            // A new application is always for the year now running (T328–329), and a 2nd or 3rd
            // instalment belongs to the year its application was made for.
            readOnlyWhenAny: [NEW_ONLY, CLAIMED],
            helpWhenLocked: true,
            helpWhen: [
              { field: "claim_stage", byValue: { "later-instalment": "The year of the application this instalment is claimed under." } },
              {
                field: "case_type",
                byValue: {
                  [AV_NEW]: "A new application is for the financial year now running.",
                  [AV_RENEWAL]: "The year whose instalment you are claiming.",
                },
              },
            ],
          },
          {
            name: "fld_installment_no",
            label: "Instalment",
            kind: "text",
            required: true,
            readOnly: true,
            // Stated, never chosen (T370–384): worked out from the project's sanctioned claims.
            showWhen: RENEWAL_ONLY,
          },
        ],
      },
    ],
  },
  // A 2nd or 3rd instalment only: the four form steps below, folded into one (C39).
  CONFIRM_DETAILS,
  {
    title: "Organisation Details",
    hideWhen: LATER_INSTALMENT,
    sections: [
      {
        title: "Organisation Details",
        lead: "Identity of the applicant NGO/VO. Pre-filled from NITI Aayog NGO-Darpan where available.",
        fields: [
          // Name, DARPAN ID, State and District come from NGO-Darpan and cannot be edited (T424–432).
          { name: "fld_ngo_name", label: "Name of NGO / VO (as in NGO-Darpan)", kind: "text", required: true, readOnly: true },
          { name: "fld_darpan_id", label: "NGO-Darpan Unique ID", kind: "text", required: true, readOnly: true },
          // The project's ID on a renewal. A new project has none until it is submitted, and an
          // empty locked box told a new applicant nothing; the ID is given on the confirmation.
          { name: "fld_project_id", label: "Project ID", kind: "text", readOnly: true, showWhen: RENEWAL_ONLY },
          { name: "fld_statute_act", label: "Statute / Act of Registration", kind: "text", required: true, help: "For example, Societies Registration Act, 1860." },
          { name: "fld_registration_number", label: "Registration Number", kind: "text", required: true, help: "As printed on your registration certificate under the Act named above." },
          { name: "fld_registration_date", label: "Date of Registration", kind: "date", required: true, rule: "notFuture" },
          { name: "fld_reg_office_address", label: "Registered-Office Address", kind: "textarea", required: true, wide: true, maxLength: 500 },
          { name: "fld_reg_office_state", label: "State", kind: "select", required: true, readOnly: true, options: INDIAN_STATES },
          { name: "fld_reg_office_district", label: "District", kind: "select", required: true, readOnly: true, districtsOf: "fld_reg_office_state" },
          { name: "fld_contact_mobile", label: "Mobile", kind: "tel", required: true, help: "Notifications about this application are sent here." },
          { name: "fld_contact_email", label: "Email", kind: "email", required: true, help: "Notifications about this application are sent here." },
          { name: "fld_contact_telephone", label: "Telephone", kind: "tel" },
          { name: "moa_includes_senior_citizens", label: "MOA includes welfare of senior citizens as an aim/objective", kind: "radio", required: true, options: YES_NO, wide: true },
        ],
      },
    ],
  },
  {
    title: "Project Details",
    hideWhen: LATER_INSTALMENT,
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
            optionsOnlyWhen: { ...RENEWAL_ONLY, options: ["Physiotherapy Clinic", "Mobile Medicare Unit"] },
            options: [
              "Senior Citizens' Home — 25 beneficiaries",
              "Senior Citizens' Home — 50 beneficiaries",
              "Senior Citizens' Home — 50 elderly women only",
              "Continuous Care Home (CCH) / Dementia / Alzheimer's",
              "Physiotherapy Clinic",
              "Mobile Medicare Unit",
            ],
            helpWhen: { field: "case_type", byValue: { [AV_NEW]: "Physiotherapy Clinic and Mobile Medicare Unit can be chosen only when renewing an existing project." } },
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
          // Fixed on a renewal: a project moves only through Project Location Change, within its
          // district (T100–103, T449).
          { name: "fld_project_state", label: "Project State", kind: "select", required: true, options: INDIAN_STATES, readOnlyWhen: RENEWAL_ONLY },
          { name: "fld_project_district", label: "Project District", kind: "select", required: true, districtsOf: "fld_project_state", readOnlyWhen: RENEWAL_ONLY, help: "Choose the Project State first." },
          { name: "fld_city_category", label: "City Category (HRA)", kind: "select", required: true, options: CITY_CATEGORIES, auto: { kind: "cityCategory", from: "fld_project_district" } },
        ],
      },
    ],
  },
  {
    title: "Justification",
    // New projects only — a renewal carries its justification forward from the sanctioned project.
    showWhen: NEW_ONLY,
    sections: [
      {
        title: "Justification",
        lead: "Why the district needs this project.",
        fields: [
          { name: "fld_services_available_in_district", label: "Similar services already available in the district", kind: "textarea", required: true, wide: true, maxLength: 1400, help: "Approximately 200 words." },
          { name: "fld_distance_to_nearest_similar", label: "Distance to the nearest similar service (km)", kind: "number", required: true },
          { name: "fld_other_justification", label: "Other justification", kind: "textarea", wide: true, maxLength: 1400, help: "Approximately 200 words." },
        ],
      },
    ],
  },
  {
    title: "Infrastructure, Beneficiaries & Bank",
    hideWhen: LATER_INSTALMENT,
    sections: [
      {
        title: "Project Location & Infrastructure",
        fields: [
          { name: "fld_project_location", label: "Project Location (full address, PIN, landmark)", kind: "textarea", required: true, wide: true, maxLength: 500 },
          { name: "fld_functional_status", label: "Functional Status", kind: "select", required: true, options: ["Functional", "Ready to commence"] },
          { name: "fld_commencement_date", label: "Date of Commencement", kind: "date", required: true },
          { name: "fld_building_ownership", label: "Building Owned / Rented", kind: "select", required: true, options: ["Owned", "Rented"] },
          { name: "fld_infra_area_sqft", label: "Total Area (sq.ft.)", kind: "number", required: true },
          { name: "fld_infra_rooms", label: "Number of Rooms", kind: "number", required: true },
          { name: "fld_infra_toilets", label: "Number of Toilets", kind: "number", required: true },
          { name: "infra_kitchen", label: "Kitchen available", kind: "radio", required: true, options: YES_NO, wide: true },
          { name: "infra_open_area", label: "Open / recreational area available", kind: "radio", required: true, options: YES_NO, wide: true },
        ],
      },
      {
        title: "Key Functionaries & Staff",
        columns: 4,
        fields: [...person("fld_incharge", "Project In-charge", true, AVYAY_POSTS), ...person("fld_key_staff_1", "Key Staff 1", true, AVYAY_POSTS), ...person("fld_key_staff_2", "Key Staff 2", false, AVYAY_POSTS)],
      },
      {
        title: "Beneficiaries",
        reconfirm: true,
        fields: [
          { name: "beneficiaries_identified", label: "Beneficiaries identified", kind: "radio", required: true, options: YES_NO, wide: true },
          {
            name: "fld_total_beneficiaries",
            label: "Number of indigent senior-citizen beneficiaries",
            kind: "number",
            required: true,
            // Guidance, not a minimum (audit W-01). Neither the live form nor any scheme document in
            // the repository states a minimum; the live cost norms say the attendance-linked heads are
            // REDUCED when a home runs below its sanctioned strength, which presupposes it may. The
            // help said "At least 25" and the form accepted 12 — a rule shown and not applied. It now
            // names the strength the project type is costed for, and says what a lower figure means.
            help: "Each project type is costed for a number of residents: 25 or 50 for a Senior Citizens' Home, and 20 for a Continuous Care Home.",
            helpWhen: {
              field: "fld_nature_of_project",
              byValue: {
                ...Object.fromEntries(Object.entries(AVYAY_COSTED_STRENGTH).map(([nature, n]) => [nature, `This project type is costed for ${n} residents.`])),
                "Physiotherapy Clinic": "",
                "Mobile Medicare Unit": "",
              },
            },
            advisory: "costedStrength",
          },
          { name: "fld_beneficiaries_women", label: "Of which women", kind: "number", notMoreThan: "fld_total_beneficiaries" },
        ],
      },
      {
        title: "Bank Account Details",
        columns: 4,
        // A renewal's account is on record: shown, not asked (T540–559).
        summaryWhen: RENEWAL_ONLY,
        lead: "The account must be in the name of the NGO/VO and used for this project only.",
        fields: [
          { name: "bank_ngo_name_declared", label: "Account is in the name of the NGO/VO", kind: "radio", required: true, options: YES_NO, wide: true, rule: "mustBeYes", showWhen: NEW_ONLY },
          // Every account the NGO already holds belongs to another project, so there is nothing to
          // choose from and no separate "Add New Bank Detail" (T156–158).
          ...bankRecordFields(RENEWAL_ONLY),
        ],
      },
    ],
  },
  {
    title: "Grant Sought & Declaration",
    hideWhen: LATER_INSTALMENT,
    sections: [
      {
        title: "Grant Sought",
        lead: "Non-recurring grant is released once every five years. Recurring grant is the published norm for this project.",
        fields: [
          { name: "fld_grant_non_recurring", label: "Non-Recurring Grant Sought (₹)", kind: "number", required: true, showWhen: NEW_ONLY, help: "One-time items such as beds, utensils and CCTV cameras. The panel above shows what the norms allow." },
          { name: "fld_grant_recurring", label: "Recurring Grant as per Norms (₹)", kind: "number", required: true, showWhen: NEW_ONLY, auto: { kind: "avyayRecurringNorm" } },
          { name: "fld_grant_total", label: "Total Grant Sought (₹)", kind: "number", required: true, showWhen: NEW_ONLY, auto: { kind: "sum", from: ["fld_grant_recurring", "fld_grant_non_recurring"] } },
        ],
      },
      // The non-recurring set-up grant has no instalments (T343–344) and is not asked on a renewal.
      instalmentGrantSection("AVYAY", RENEWAL_ONLY),
      {
        title: "Verification & Authorised Person",
        reconfirm: true,
        fields: [
          { name: "decl_no_money_from_beneficiaries", label: "Confirm no money is charged from the beneficiaries", kind: "radio", required: true, options: YES_NO, wide: true },
          { name: "decl_not_blacklisted", label: "Confirm the organisation is not blacklisted by any authority", kind: "radio", required: true, options: YES_NO, wide: true },
          { name: "fld_auth_person_name", label: "Name of Authorised Person", kind: "text", required: true, rule: "lettersOnly" },
          { name: "fld_auth_person_contact", label: "Mobile Number of Authorised Person", kind: "tel", required: true },
          { name: "fld_auth_place", label: "Place", kind: "text", required: true },
          { name: "fld_auth_date", label: "Date", kind: "date", required: true, readOnly: true, rule: "notBackdated" },
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

const FULL_SHARE_AGENCIES = [
  "State Government",
  "Urban Local Body (ULB)",
  "Panchayati Raj Institution (PRI)",
  "Regional Resource & Training Centre (RRTC)",
];

/** Central share: 100% for a State Government, ULB, PRI or RRTC; 95% in NE & Himalayan States; 90% elsewhere. */
export function centralSharePercent(agencyType?: string, projectState?: string): number {
  if (agencyType && FULL_SHARE_AGENCIES.includes(agencyType)) return 100;
  if (projectState && NE_HIMALAYAN_STATES.includes(projectState)) return 95;
  return 90;
}

export interface AvyayEntitlement {
  share: number;
  recurringAllowed: number;
  /** The norm as live presents it: full rent, before an owned building's deduction. */
  recurringNorm: number;
  ownedDeduction: number;
  nonRecurringNorm: number;
  attendanceLinked: number;
  recurringCentral: number;
  nonRecurringCentral: number;
  totalCentral: number;
}

/**
 * What the AVYAY norms allow a project, as the live cost-norms panel computes it. One function,
 * read by the panel AND by the grant field it explains — a panel and a field reading the same
 * norms must never show two figures (data-state-completeness §2).
 */
export function avyayEntitlement(input: {
  natureOfProject?: string;
  agencyType?: string;
  projectState?: string;
  buildingOwnership?: string;
}): AvyayEntitlement {
  const heads = avyayCostHeads(input.natureOfProject);
  const share = centralSharePercent(input.agencyType, input.projectState);
  // The heads already carry the OWNED figure (10% of rent), so their sum IS the allowed recurring.
  const ownedLine = heads.find((h) => h.head.startsWith("Owned Building"))?.norm ?? 0;
  const ownedDeduction = input.buildingOwnership === "Owned" ? ownedLine * 10 - ownedLine : 0;
  const recurringAllowed = heads.filter((h) => !h.nonRecurring).reduce((a, h) => a + h.norm, 0);
  const nonRecurringNorm = heads.filter((h) => h.nonRecurring).reduce((a, h) => a + h.norm, 0);
  const recurringCentral = Math.round((recurringAllowed * share) / 100);
  const nonRecurringCentral = Math.round((nonRecurringNorm * share) / 100);
  return {
    share,
    recurringAllowed,
    recurringNorm: recurringAllowed + ownedDeduction,
    ownedDeduction,
    nonRecurringNorm,
    attendanceLinked: heads.filter((h) => h.attendanceLinked).reduce((a, h) => a + h.norm, 0),
    recurringCentral,
    nonRecurringCentral,
    totalCentral: recurringCentral + nonRecurringCentral,
  };
}

/* ══════════════════════════════════════════════════════════════════════════════
   SMILE — Garima Greh — 7 steps (6 on the portal, plus Application Type); a 2nd instalment is 4.
   No live UAT capture exists for SMILE. The reference is the dev-portal walk recorded in
   docs/research/eanudaan-user-dev.mosje.in/CAPTURE-2026-08-22.md and PARITY-2026-08-22.md.
   ══════════════════════════════════════════════════════════════════════════════ */

const SM_NEW = { field: "case_type", equals: [SMILE_CASE_NEW] } as const;
const SM_EXISTING = { field: "case_type", equals: [SMILE_CASE_EXISTING] } as const;

/** The twelve sanctioned positions of a Garima Greh unit, as the portal's own staff help names them. */
const GARIMA_GREH_POSTS = [
  ["project_director", "Project Director"],
  ["project_manager", "Project Manager"],
  ["accountant", "Accountant Assistant"],
  ["bridge_coordinator", "Bridge Course Coordinator"],
  ["counsellor", "Counsellor"],
  ["doctor", "Doctor"],
  ["cook", "Cook"],
  ["multi_task", "Multi-Task Worker"],
  ["sweeper", "Sweeper"],
  ["watchman_1", "Watchman 1"],
  ["watchman_2", "Watchman 2"],
  ["watchman_3", "Watchman 3"],
] as const;

/** One sanctioned position as a name and a qualification. The Project Director is required (PMC member secretary). */
function garimaGrehStaff(): FieldDef[] {
  return GARIMA_GREH_POSTS.flatMap(([key, post], i) => {
    const name = `fld_staff_${key}_name`;
    const qual = `fld_staff_${key}_qualification`;
    const required = i === 0;
    return [
      { name, label: `${post} — Name`, kind: "text", required, rule: "lettersOnly", ...(required ? {} : { requiredWith: [qual] }) },
      { name: qual, label: `${post} — Qualification`, kind: "select", required, options: QUALIFICATIONS, ...(required ? {} : { requiredWith: [name] }) },
    ] satisfies FieldDef[];
  });
}

const SMILE_STEPS: readonly StepDef[] = [
  {
    // Not a portal step: these five answers sat among forty organisation questions on step 1. The
    // existing-project choice decides what the rest of the form is, so it comes first.
    title: "Application Type",
    sections: [
      {
        title: "Application Type",
        lead: "The SMILE component applied for, and whether it is a new or an existing project.",
        fields: [
          { name: "fld_nature_of_project", label: "Nature of the Project", kind: "select", required: true, wide: true, options: ["Garima Greh — Transgender Care Home", "Rehabilitation & Livelihood (SMILE)"] },
          { name: "case_type", label: "Do you have an existing project under SMILE?", kind: "radio", required: true, wide: true, options: [SMILE_CASE_NEW, SMILE_CASE_EXISTING] },
          {
            name: "fld_smile_project_select",
            label: "Existing Project",
            kind: "select",
            required: true,
            wide: true,
            optionsFrom: "renewableProjects",
            showWhen: SM_EXISTING,
            help: "Your projects with a sanctioned grant and an instalment open to claim. The form is filled in from the project's last sanctioned application.",
          },
          { name: "fld_project_id", label: "Project ID", kind: "text", required: true, readOnly: true, auto: { kind: "projectIdOf", from: "fld_smile_project_select" }, showWhen: SM_EXISTING },
          {
            name: "fld_financial_year",
            label: "Applying for Financial Year",
            kind: "select",
            required: true,
            options: FINANCIAL_YEARS,
            readOnlyWhenAny: [SM_NEW, CLAIMED],
            helpWhenLocked: true,
            helpWhen: [
              { field: "claim_stage", byValue: { "later-instalment": "The year of the application this instalment is claimed under." } },
              { field: "case_type", byValue: { [SMILE_CASE_NEW]: "A new application is for the financial year now running.", [SMILE_CASE_EXISTING]: "The year whose instalment you are claiming." } },
            ],
          },
          { name: "fld_installment_no", label: "Instalment", kind: "text", required: true, readOnly: true, showWhen: SM_EXISTING },
        ],
      },
    ],
  },
  CONFIRM_DETAILS,
  {
    title: "Organisation Details",
    hideWhen: LATER_INSTALMENT,
    sections: [
      {
        title: "Organisation Details",
        lead: "The applicant organisation's identity and profile. Pre-filled from NGO-Darpan where available.",
        fields: [
          { name: "website_available", label: "Do you have a website?", kind: "radio", required: true, options: YES_NO, wide: true },
          { name: "fld_website_url", label: "Website URL", kind: "text", required: true, showWhen: { field: "website_available", equals: ["Yes"] } },
          // A new project only: no CCTV question on a renewal (review call, T640–644; W3).
          { name: "camera_live_feed", label: "Do you have a camera and live feed?", kind: "radio", required: true, options: YES_NO, wide: true, showWhen: SM_NEW, help: "If Yes, the CCTV and live-feed registration proof is added to the documents to upload." },
          { name: "fld_ngo_name", label: "NGO/CBO/Startup Name (as per NITI Aayog Darpan)", kind: "text", required: true, readOnly: true },
          { name: "fld_darpan_id", label: "NGO Unique ID (NITI Aayog Darpan)", kind: "text", required: true, readOnly: true },
          { name: "fld_reg_office_address", label: "Registered Office Address", kind: "textarea", required: true, wide: true },
          { name: "fld_reg_office_city", label: "City / Town / Village", kind: "text", required: true },
          { name: "fld_reg_office_district", label: "District", kind: "text", required: true, readOnly: true },
          { name: "fld_reg_office_state", label: "State", kind: "text", required: true, readOnly: true },
          { name: "fld_contact_mobile", label: "Mobile No.", kind: "tel", required: true, help: "Notifications about this application are sent here." },
          { name: "fld_contact_telephone", label: "Telephone", kind: "tel" },
          { name: "fld_contact_email", label: "Email", kind: "email", required: true, help: "Notifications about this application are sent here." },
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
          { name: "fld_registration_act", label: "Name of Act", kind: "text", required: true },
          { name: "fld_registration_number", label: "Registration Number", kind: "text", required: true },
          { name: "fld_registration_date", label: "Date of Registration", kind: "date", required: true, rule: "notFuture" },
          { name: "fld_registration_valid_upto", label: "Registration Valid up to", kind: "date", required: true, rule: "afterRegistration" },
          { name: "fld_establishment_date", label: "Date of Establishment", kind: "date", required: true, rule: "notFuture" },
          { name: "fld_pan_number", label: "PAN Registration Number", kind: "text", required: true, rule: "pan" },
          { name: "fld_pan_date", label: "PAN Registration Date", kind: "date", required: true, rule: "notFuture" },
          { name: "fcra_80g", label: "80G / FCRA registration", kind: "radio", required: true, options: YES_NO, wide: true },
          { name: "fld_fcra_80g_details", label: "80G / FCRA registration details", kind: "textarea", required: true, wide: true, showWhen: { field: "fcra_80g", equals: ["Yes"] } },
          // A renewal's answer is on record: the project it renews was granted under SMILE.
          { name: "prior_grant_received", label: "Has the organisation received a previous SMILE grant?", kind: "radio", required: true, options: YES_NO, wide: true, showWhen: SM_NEW },
        ],
      },
      {
        title: "Head of Organisation & Key Functionary",
        columns: 4,
        fields: [
          { name: "fld_head_name", label: "Head of Organisation — Name", kind: "text", required: true, rule: "lettersOnly" },
          { name: "fld_head_qualification", label: "Head of Organisation — Qualification", kind: "select", required: true, options: QUALIFICATIONS },
          { name: "fld_head_mobile", label: "Head of Organisation — Mobile Number", kind: "tel", required: true },
          { name: "fld_head_address", label: "Head of Organisation — Address", kind: "text", required: true },
          ...person("fld_key_person_1", "Key Functionary 1", true),
          { name: "fld_key_person_1_address", label: "Key Functionary 1 — Address", kind: "text", required: true, wide: true },
        ],
      },
    ],
  },
  {
    title: "Institution Details",
    hideWhen: LATER_INSTALMENT,
    sections: [
      {
        title: "Premises & Track Record",
        lead: "The Garima Greh unit — its premises and track record.",
        fields: [
          { name: "fld_premises_office_area_sqm", label: "Office space (sq. m)", kind: "number", required: true },
          { name: "fld_premises_ownership", label: "Ownership status", kind: "select", required: true, options: ["Owned", "Rented", "On Lease", "Donated"] },
          // On the portal (CAPTURE-2026-08-22: "Ownership status = Rented reveals Rent particulars"); missing here.
          { name: "fld_rent_particulars", label: "Rent particulars (owner, monthly rent, valid until)", kind: "textarea", required: true, wide: true, showWhen: { field: "fld_premises_ownership", equals: ["Rented", "On Lease"] } },
          { name: "fld_track_nature_of_work", label: "Nature of work done", kind: "textarea", required: true, wide: true },
          { name: "fld_track_period_from", label: "Period — From", kind: "date", required: true },
          { name: "fld_track_period_to", label: "Period — To", kind: "date", required: true, rule: "afterPeriodFrom" },
          { name: "fld_track_coverage", label: "Coverage of beneficiaries", kind: "textarea", required: true, wide: true },
          { name: "fld_track_outcome", label: "Outcome, achievement or award", kind: "textarea", required: true, wide: true },
          { name: "fld_track_funding", label: "Source of funding and amount", kind: "textarea", required: true, wide: true },
        ],
      },
      {
        title: "Project Location",
        fields: [
          { name: "fld_site_address", label: "Project Location Address", kind: "textarea", required: true, wide: true },
          { name: "fld_site_landmark", label: "Landmark", kind: "text" },
          { name: "fld_site_city", label: "City / Town / Village", kind: "text", required: true },
          // Fixed on a renewal: a project moves only through Project Location Change (T100–103, T449).
          { name: "fld_site_state", label: "State", kind: "select", required: true, options: INDIAN_STATES, readOnlyWhen: SM_EXISTING },
          { name: "fld_site_district", label: "District", kind: "select", required: true, districtsOf: "fld_site_state", readOnlyWhen: SM_EXISTING, help: "Choose the State first." },
          { name: "fld_site_location_type", label: "Location Type", kind: "select", required: true, options: ["Urban", "Rural"] },
          { name: "fld_site_pin", label: "PIN Code", kind: "text", required: true, rule: "pin" },
          { name: "fld_site_org_email", label: "Organisation Email Address", kind: "email", required: true },
        ],
      },
      {
        title: "Project In-charge",
        columns: 4,
        fields: [
          ...person("fld_site_incharge", "Project In-charge", true),
          { name: "fld_site_incharge_email", label: "Project In-charge — Email", kind: "email", required: true },
        ],
      },
      {
        title: "Staff — 12 Sanctioned Positions",
        lead: "Name and qualification for each position filled.",
        columns: 4,
        fields: garimaGrehStaff(),
      },
      {
        title: "Project Management Committee",
        fields: [
          {
            name: "fld_pmc_composition",
            label: "PMC Composition (Project Management Committee)",
            kind: "textarea",
            required: true,
            wide: true,
            help: "The five members, with the name and role of each: the District Magistrate or equivalent (Chairperson), a nominee of the organisation, a doctor, a transgender welfare expert, and the Project Director (Member Secretary), who must be a transgender person.",
          },
        ],
      },
    ],
  },
  {
    title: "Bank, Beneficiaries & Grant",
    hideWhen: LATER_INSTALMENT,
    sections: [
      {
        title: "Bank Details",
        columns: 4,
        summaryWhen: SM_EXISTING,
        lead: "The account the grant will be paid into.",
        fields: [
          ...bankRecordFields(SM_EXISTING),
          { name: "fld_bank_rtgs_micr", label: "RTGS / MICR Code", kind: "text", showWhen: SM_NEW },
          { name: "fld_bank_joint_operators", label: "Name & Address of joint-account operators", kind: "textarea", required: true, wide: true, showWhen: SM_NEW },
        ],
      },
      {
        title: "Beneficiaries / Residents",
        reconfirm: true,
        fields: [
          { name: "fld_residents_list", label: "List of residents and beneficiaries (name, transgender identity certificate number, age)", kind: "textarea", required: true, wide: true },
          { name: "fld_sanctioned_capacity", label: "Sanctioned resident capacity", kind: "number", required: true, help: "A Garima Greh unit is sanctioned for up to 25 residents." },
          { name: "fld_tg_beneficiaries_details", label: "Transgender beneficiaries — Name, Aadhaar, Mobile, Date of Admission", kind: "textarea", wide: true, help: "One resident per line: Name | Aadhaar (12 digits) | Mobile (10 digits) | Date of Admission." },
          { name: "fld_total_beneficiaries", label: "Total Number of Residents/Beneficiaries", kind: "number", required: true, notMoreThan: "fld_sanctioned_capacity" },
        ],
      },
      {
        title: "Grant Sought / Budget Estimate",
        lead: "Item-wise break-up. The total is the recurring and non-recurring grant added together.",
        fields: [
          { name: "fld_grant_non_recurring_furniture", label: "Non-Recurring — Furniture (₹)", kind: "number", showWhen: SM_NEW },
          { name: "fld_grant_non_recurring_it", label: "Non-Recurring — IT Peripherals (₹)", kind: "number", showWhen: SM_NEW },
          { name: "fld_grant_non_recurring_equipment", label: "Non-Recurring — Equipment (₹)", kind: "number", showWhen: SM_NEW },
          { name: "fld_grant_non_recurring_kitchen", label: "Non-Recurring — Kitchen items (₹)", kind: "number", showWhen: SM_NEW },
          { name: "fld_grant_non_recurring_safety", label: "Non-Recurring — Safety equipment (₹)", kind: "number", showWhen: SM_NEW },
          { name: "fld_grant_non_recurring_skill_dev", label: "Non-Recurring — Skill development equipment (₹)", kind: "number", showWhen: SM_NEW },
          {
            name: "fld_grant_non_recurring",
            label: "Non-Recurring Total (₹)",
            kind: "number",
            required: true,
            showWhen: SM_NEW,
            auto: { kind: "sum", from: ["fld_grant_non_recurring_furniture", "fld_grant_non_recurring_it", "fld_grant_non_recurring_equipment", "fld_grant_non_recurring_kitchen", "fld_grant_non_recurring_safety", "fld_grant_non_recurring_skill_dev"] },
          },
          { name: "fld_grant_recurring_rent", label: "Recurring — Rent (₹)", kind: "number", showWhen: SM_NEW },
          { name: "fld_grant_recurring_food", label: "Recurring — Food (₹)", kind: "number", showWhen: SM_NEW },
          { name: "fld_grant_recurring_salaries", label: "Recurring — Salaries by post (₹)", kind: "number", showWhen: SM_NEW },
          { name: "fld_grant_recurring_admin", label: "Recurring — Admin expenses (₹)", kind: "number", showWhen: SM_NEW },
          {
            name: "fld_grant_recurring",
            label: "Recurring Total (₹)",
            kind: "number",
            required: true,
            showWhen: SM_NEW,
            auto: { kind: "sum", from: ["fld_grant_recurring_rent", "fld_grant_recurring_food", "fld_grant_recurring_salaries", "fld_grant_recurring_admin"] },
          },
          { name: "fld_grant_total", label: "Total Grant Requested (₹)", kind: "number", required: true, showWhen: SM_NEW, auto: { kind: "sum", from: ["fld_grant_recurring", "fld_grant_non_recurring"] } },
        ],
      },
      instalmentGrantSection("SMILE", SM_EXISTING),
    ],
  },
  {
    title: "Declarations",
    hideWhen: LATER_INSTALMENT,
    sections: [
      {
        title: "Compliance Declarations",
        reconfirm: true,
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
        reconfirm: true,
        fields: [
          { name: "fld_auth_person_name", label: "Name of Authorised Person", kind: "text", required: true, rule: "lettersOnly" },
          { name: "fld_auth_person_contact", label: "Mobile Number of Authorised Person", kind: "tel", required: true },
          { name: "fld_auth_place", label: "Place", kind: "text", required: true },
          { name: "fld_auth_date", label: "Date", kind: "date", required: true, readOnly: true, rule: "notBackdated" },
          { name: "fld_auth_time", label: "Time", kind: "time", required: true, readOnly: true },
        ],
      },
    ],
  },
  { title: "Upload Documents", kind: "documents", sections: [] },
  { title: "Review & Submit", kind: "review", sections: [] },
];

const SMILE_DOCS: readonly DocDef[] = [
  { n: 1, title: "Registration Certificate (Societies Act / Trust Act etc.)" },
  { n: 2, title: "Annual Report — previous financial year", note: "New applicants: previous two (2) financial years. Instalment claims: previous financial year." },
  { n: 3, title: "Audit Report (Balance Sheet, Income & Expenditure, Receipts & Payments)", note: "New applicants: previous two (2) financial years. Instalment claims: previous financial year." },
  { n: 4, title: "Any other document as requested", note: "Sought only where applicable.", optional: true },
  { n: 5, title: "Memorandum of Association, with its rules, aims and objectives" },
  { n: 6, title: "List of Management/Managing Committee Members" },
  { n: 7, title: "Rent Agreement for Garima Greh premises (notarised; rural certificate if applicable)", showWhen: { field: "fld_premises_ownership", equals: ["Rented", "On Lease"] } },
  { n: 8, title: "Infrastructure details (rooms, kitchen, toilet, etc.)" },
  { n: 9, title: "Budget Estimate (item-wise recurring & non-recurring)", note: "New applicants: non-recurring items only. Instalment claims: recurring and non-recurring items." },
  { n: 10, title: "Bank account details document" },
  { n: 11, title: "Agreement Bond/PSR on non-judicial stamp paper (₹20)" },
  // A new project's camera answer only; never on a renewal (T640–644; W3).
  { n: 12, title: "CCTV and live-feed registration proof", showWhen: { field: "camera_live_feed", equals: ["Yes"] }, hideWhen: SM_EXISTING },
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
   NAPDDR — 10 steps new / 11 renewal, as the live UAT portal draws it (captured 07–08 Sep 2026,
   NGO-NAPDDR-{NEW,RENEWAL}-S*). A 2nd or 3rd instalment is 4 steps.
   ══════════════════════════════════════════════════════════════════════════════ */

const ND_NEW = { field: "case_type", equals: ["New project"] } as const;
const ND_RENEWAL = { field: "case_type", equals: ["Ongoing / Renewal of an existing project"] } as const;
const ND_DDAC = "DDAC — District De-Addiction Centre";

const NAPDDR_STEPS: readonly StepDef[] = [
  {
    title: "Application Type",
    sections: [
      {
        title: "Application Type",
        lead: "Is this a fresh (new) project, or a renewal of one of your existing (ongoing) NAPDDR projects?",
        fields: [
          { name: "case_type", label: "Case Type", kind: "radio", required: true, wide: true, options: ["New project", "Ongoing / Renewal of an existing project"], help: "Choose 'Ongoing / Renewal' to carry forward the details of one of your existing NAPDDR projects." },
          {
            name: "fld_project_type",
            label: "Project Type",
            kind: "select",
            required: true,
            options: [ND_DDAC, "IRCA — Integrated Rehabilitation Centre", "IRCA — Female", "IRCA — Male Children"],
            help: "For a general IRCA, the reviewing officer sets the bed capacity.",
            showWhen: ND_NEW,
          },
          {
            name: "fld_ongoing_source_application",
            label: "Select the existing project to renew",
            kind: "select",
            required: true,
            wide: true,
            optionsFrom: "renewableProjects",
            showWhen: ND_RENEWAL,
            help: "Your projects with a sanctioned grant and an instalment open to claim. The form is filled in from the project's last sanctioned application.",
          },
          {
            name: "fld_financial_year",
            label: "Financial Year for which grant is sought",
            kind: "select",
            required: true,
            options: FINANCIAL_YEARS,
            readOnlyWhenAny: [ND_NEW, CLAIMED],
            helpWhenLocked: true,
            helpWhen: [
              { field: "claim_stage", byValue: { "later-instalment": "The year of the application this instalment is claimed under." } },
              { field: "case_type", byValue: { "New project": "A new application is for the financial year now running.", "Ongoing / Renewal of an existing project": "The year whose instalment you are claiming." } },
            ],
          },
          { name: "fld_installment_no", label: "Instalment", kind: "text", required: true, readOnly: true, showWhen: ND_RENEWAL },
        ],
      },
    ],
  },
  CONFIRM_DETAILS,
  {
    title: "Organisation Details",
    hideWhen: LATER_INSTALMENT,
    sections: [
      {
        title: "Organisation Details",
        lead: "Identity of the applicant NGO/VO. Pre-filled from NGO-Darpan where available.",
        fields: [
          { name: "fld_ngo_name", label: "Name of NGO / VO (as in NGO-Darpan)", kind: "text", required: true, readOnly: true },
          { name: "fld_darpan_id", label: "NGO-Darpan Unique ID", kind: "text", required: true, readOnly: true },
          { name: "fld_project_id", label: "Project ID", kind: "text", readOnly: true, showWhen: ND_RENEWAL },
          { name: "fld_statute_act", label: "Name of Act / Statute of Registration", kind: "text", required: true, help: "For example, Societies Registration Act, 1860." },
          { name: "fld_registration_number", label: "Registration Number under the Act", kind: "text", required: true },
          { name: "fld_registration_date", label: "Date of Registration", kind: "date", required: true, rule: "notFuture" },
          { name: "fld_registration_valid_upto", label: "Registration valid up to", kind: "date", rule: "afterRegistration" },
          { name: "fld_reg_office_address", label: "Registered-Office Address", kind: "textarea", required: true, wide: true, maxLength: 300 },
          { name: "fld_reg_office_state", label: "State", kind: "select", required: true, readOnly: true, options: INDIAN_STATES },
          { name: "fld_reg_office_district", label: "District", kind: "select", required: true, readOnly: true, districtsOf: "fld_reg_office_state" },
          { name: "fld_contact_mobile", label: "Mobile", kind: "tel", required: true, help: "Notifications about this application are sent here." },
          { name: "fld_contact_email", label: "Email", kind: "email", required: true, help: "Notifications about this application are sent here." },
          { name: "fld_contact_telephone", label: "Telephone", kind: "tel" },
          { name: "moa_includes_addiction", label: "MOA/aims include prevention of alcoholism & drug abuse", kind: "radio", required: true, options: YES_NO, wide: true },
          { name: "fld_org_website", label: "Organisation's website (for proactive disclosure)", kind: "text", required: true, help: "For example, https://www.example.org." },
        ],
      },
    ],
  },
  {
    title: "Project Details",
    hideWhen: LATER_INSTALMENT,
    sections: [
      {
        title: "Project Details",
        lead: "The de-addiction project for which grant-in-aid is sought.",
        fields: [
          { name: "fld_name_of_project", label: "Name of the Project (if any)", kind: "text", wide: true },
          { name: "fld_date_of_commencement", label: "Date of commencement of the project", kind: "date", required: true },
          { name: "fld_year_of_commencement_gia", label: "Year of commencement of GIA", kind: "text", help: "For example, 2019-20." },
          // Fixed on a renewal: a project moves only through Project Location Change (T100–103, T449).
          { name: "fld_project_state", label: "Project State", kind: "select", required: true, options: INDIAN_STATES, readOnlyWhen: ND_RENEWAL },
          { name: "fld_project_district", label: "Project District", kind: "select", required: true, districtsOf: "fld_project_state", readOnlyWhen: ND_RENEWAL, help: "Choose the Project State first." },
          { name: "project_recognized_by_state", label: "Project recognised by the State Government?", kind: "radio", required: true, options: YES_NO, wide: true },
          // A new project only (review call, T640–644: no CCTV question on a renewal). The live
          // form also asked for the feed's user ID and password; a grant form does not collect a
          // credential, so only the address is kept.
          { name: "has_live_feed_url", label: "CCTV live-feed available on your website?", kind: "radio", required: true, options: YES_NO, wide: true, showWhen: ND_NEW },
          { name: "fld_live_feed_url", label: "Live-feed web address", kind: "text", required: true, showWhen: { field: "has_live_feed_url", equals: ["Yes"] } },
        ],
      },
    ],
  },
  {
    title: "Location, Infrastructure & Preparedness",
    hideWhen: LATER_INSTALMENT,
    sections: [
      {
        title: "Project Location",
        fields: [
          { name: "fld_location_address", label: "Project Location (full address, PIN, landmark)", kind: "textarea", required: true, wide: true, maxLength: 500 },
          { name: "fld_railway_station_bus_stand", label: "Nearest railway station / bus stand", kind: "text" },
        ],
      },
      {
        title: "Infrastructure & Preparedness",
        fields: [
          { name: "fld_building_ownership", label: "Building Owned / Rented / Leased / Donated", kind: "select", required: true, options: ["Owned", "Rented", "Leased", "Donated"] },
          { name: "building_utilized_exclusively", label: "Building utilised exclusively for this project?", kind: "radio", required: true, options: YES_NO, wide: true },
          { name: "fld_area_of_building_sqm", label: "Area of building (sq. m.)", kind: "number", required: true },
          { name: "fld_no_of_rooms", label: "Number of Rooms", kind: "number", required: true },
          { name: "fld_no_of_class_rooms", label: "Number of Class Rooms", kind: "number" },
          { name: "fld_no_of_veranda", label: "Number of Veranda", kind: "number" },
          { name: "fld_no_of_toilets", label: "Number of Toilets / Bathrooms", kind: "number", required: true },
          { name: "fld_details_of_usages", label: "Details of usage of the building", kind: "textarea", wide: true },
          { name: "kitchen_facilities", label: "Kitchen facilities available", kind: "radio", required: true, options: YES_NO, wide: true },
          { name: "fld_kitchen_details", label: "Kitchen — details", kind: "textarea", wide: true, help: "Size, equipment, where meals are prepared and served.", showWhen: { field: "kitchen_facilities", equals: ["Yes"] } },
          { name: "fld_toilet_details", label: "Toilets / bathrooms — details", kind: "textarea", wide: true, help: "Separate facilities, water supply, condition." },
          { name: "hygiene_maintained", label: "Is hygiene being maintained at the project?", kind: "radio", required: true, options: YES_NO, wide: true },
          { name: "fld_hygiene_details", label: "Hygiene — how it is maintained", kind: "textarea", wide: true, help: "Cleaning schedule, waste disposal, drinking water, pest control.", showWhen: { field: "hygiene_maintained", equals: ["Yes"] } },
          { name: "open_area_available", label: "Open / recreational area available", kind: "radio", required: true, options: YES_NO, wide: true },
          { name: "counselling_room", label: "Counselling room available", kind: "radio", required: true, options: YES_NO, wide: true },
          { name: "fld_counselling_room_details", label: "Counselling room — details", kind: "textarea", wide: true, help: "Number of rooms, privacy arrangements, counsellor availability.", showWhen: { field: "counselling_room", equals: ["Yes"] } },
          { name: "fld_functional_status", label: "Functional Status", kind: "select", required: true, options: ["Functional", "Ready to commence"] },
        ],
      },
    ],
  },
  {
    title: "Functionaries, Staff & Committee",
    hideWhen: LATER_INSTALMENT,
    sections: [
      {
        title: "Key Functionaries",
        lead: "For a District De-Addiction Centre, the chief functionary as well.",
        columns: 4,
        fields: [
          ...person("fld_incharge", "Project In-charge", true),
          ...person("fld_functionary_1", "Key Functionary 1", true),
          ...person("fld_ddac_chief", "DDAC Chief Functionary", true, undefined, { field: "fld_project_type", equals: [ND_DDAC] }),
        ],
      },
      {
        title: "Staff & Managing Committee",
        columns: 4,
        fields: [
          ...person("fld_key_staff_1", "Key Project Staff 1", true),
          ...person("fld_key_staff_2", "Key Project Staff 2", false),
          { name: "fld_managing_committee_note", label: "Managing Committee — brief (full list uploaded as a document)", kind: "textarea", wide: true },
        ],
      },
    ],
  },
  {
    title: "Capability & Prior Work",
    hideWhen: LATER_INSTALMENT,
    sections: [
      {
        title: "Organisational Capability",
        fields: [
          { name: "is_running_institution", label: "Currently running a relevant institution", kind: "radio", required: true, options: YES_NO, wide: true, showWhen: ND_NEW },
          { name: "fld_startup_company_name", label: "Start-up company name (if applicable)", kind: "text", showWhen: ND_NEW },
          { name: "startup_registered_niti", label: "Registered on NITI Aayog Darpan", kind: "radio", required: true, options: YES_NO, wide: true, showWhen: ND_NEW },
        ],
      },
      {
        title: "Prior Work",
        fields: [
          { name: "fld_prior_projects_other", label: "Ongoing projects not related to alcohol or drugs (nature, period, coverage, funding)", kind: "textarea", wide: true },
          { name: "self_generated_funds", label: "Funds generated from other sources (CSR / community / donations)?", kind: "radio", required: true, options: YES_NO, wide: true },
          { name: "fld_self_generated_funds_amount", label: "Amount from other sources (₹)", kind: "number", showWhen: { field: "self_generated_funds", equals: ["Yes"] } },
        ],
      },
    ],
  },
  {
    title: "Beneficiaries, Bank & Grant",
    hideWhen: LATER_INSTALMENT,
    sections: [
      {
        title: "Beneficiaries",
        reconfirm: true,
        fields: [
          { name: "beneficiaries_identified", label: "Beneficiaries identified", kind: "radio", required: true, options: YES_NO, wide: true },
          { name: "fld_total_beneficiaries", label: "Number of beneficiaries (addicts) served / to be served", kind: "number", required: true },
          { name: "fld_beneficiaries_prev_year", label: "Beneficiaries treated in the previous year", kind: "number" },
        ],
      },
      {
        title: "Bank Account Details",
        columns: 4,
        summaryWhen: ND_RENEWAL,
        lead: "The account must be in the name of the NGO/VO and used for this project only.",
        fields: [
          { name: "bank_ngo_name_declared", label: "Account is in the name of the NGO/VO", kind: "radio", required: true, options: YES_NO, wide: true, rule: "mustBeYes", showWhen: ND_NEW },
          ...bankRecordFields(ND_RENEWAL),
          // Moved from live's renewal-only "CCTV / EAT / PFMS Compliance" step to the account it
          // describes (T617–639); fixed where the account is already registered.
          { name: "fld_pfms_code", label: "NGO PFMS code (under head 3817)", kind: "text", required: true, showWhen: ND_RENEWAL, readOnlyWhen: { field: "fld_pfms_on_record", equals: ["Yes"] } },
          { name: "eat_module_registered", label: "Registered on the PFMS EAT module", kind: "radio", required: true, options: YES_NO, wide: true },
        ],
      },
      {
        title: "Grant Sought",
        lead: "The recurring grant is released in instalments of 40%, 40% and 20%. Non-recurring grant is a one-time set-up cost.",
        fields: [
          { name: "grant_requirement_type", label: "Nature of the grant requirement", kind: "radio", required: true, options: ["General / normal grant", "Specific / special requirement"], wide: true, showWhen: ND_NEW },
          { name: "fld_annual_recurring_grant", label: "Annual Recurring Grant Sought (₹)", kind: "number", required: true, showWhen: ND_NEW },
          { name: "fld_grant_non_recurring", label: "Non-Recurring Grant Sought (₹)", kind: "number", required: true, showWhen: ND_NEW },
          { name: "fld_grant_total", label: "Total Grant Sought (₹)", kind: "number", required: true, showWhen: ND_NEW, auto: { kind: "sum", from: ["fld_annual_recurring_grant", "fld_grant_non_recurring"] } },
        ],
      },
      instalmentGrantSection("NAPDDR", ND_RENEWAL, {
        annual: "Annual Recurring Grant (₹)",
        amount: (ord, share) => `Recurring Grant — ${ord} Instalment, ${share}% (₹)`,
        // One label across schemes (audit W-06): officers compare this figure between them.
        prior: "Released Earlier This Year (₹)",
        remaining: "Remaining After This Instalment (₹)",
      }),
    ],
  },
  {
    // Renewal only. Live calls it "CCTV / EAT / PFMS Compliance"; the CCTV question left the form
    // (T640–644) and the PFMS code moved to the bank account, so the step is named for what is left.
    title: "Previous Instalment",
    showWhen: ND_RENEWAL,
    hideWhen: LATER_INSTALMENT,
    sections: [
      {
        title: "Use of the Previous Instalment",
        reconfirm: true,
        fields: [
          { name: "prev_instalment_utilised", label: "Previous instalment fully utilised and Utilisation Certificate submitted", kind: "radio", required: true, options: YES_NO, wide: true },
        ],
      },
    ],
  },
  {
    title: "Verification & Declaration",
    hideWhen: LATER_INSTALMENT,
    sections: [
      {
        title: "Verification & Authorised Person",
        reconfirm: true,
        fields: [
          { name: "decl_no_money_from_beneficiaries", label: "Confirm no money is charged from the beneficiaries", kind: "radio", required: true, options: YES_NO, wide: true },
          { name: "decl_not_blacklisted", label: "Confirm the organisation is not blacklisted and has no pending actionable complaint", kind: "radio", required: true, options: YES_NO, wide: true },
          { name: "fld_auth_person_name", label: "Name of Authorised Person", kind: "text", required: true, rule: "lettersOnly" },
          { name: "fld_auth_person_designation", label: "Designation", kind: "text", required: true, rule: "lettersOnly" },
          { name: "fld_auth_person_contact", label: "Mobile Number of Authorised Person", kind: "tel", required: true },
          { name: "fld_auth_person_email", label: "Email of Authorised Person", kind: "email" },
          { name: "fld_auth_place", label: "Place", kind: "text", required: true },
          { name: "fld_auth_date", label: "Date", kind: "date", required: true, readOnly: true, rule: "notBackdated" },
        ],
      },
    ],
  },
  { title: "Upload Documents", kind: "documents", sections: [] },
  { title: "Review & Submit", kind: "review", sections: [] },
];

/**
 * NAPDDR's checklist forks, and the two branches barely overlap: twelve for a new project, and for
 * a renewal the seven live asks less its CCTV status (T640–644). Ordered new first, then the shared
 * one, then renewal, so each branch displays from 1 in live's order.
 */
const NAPDDR_DOCS: readonly DocDef[] = [
  { n: 1, title: "Memorandum of Association", description: "Aims & objectives of the organisation", showWhen: ND_NEW },
  { n: 2, title: "PAN card of the organisation", showWhen: ND_NEW },
  { n: 3, title: "List of Managing Committee Members", description: "Current financial year", showWhen: ND_NEW },
  { n: 4, title: "List of Staff / Employees", description: "Current financial year, with qualifications", showWhen: ND_NEW },
  { n: 5, title: "List of Beneficiaries — previous year" },
  { n: 6, title: "Infrastructure details", description: "Rooms, kitchen, toilets, etc.", showWhen: ND_NEW },
  { n: 7, title: "Bank Authorisation Letter / account details", description: "Name, A/C no., IFSC / MICR", showWhen: ND_NEW },
  { n: 8, title: "Budget Estimate for the proposed year", description: "Recurring & non-recurring", showWhen: ND_NEW },
  { n: 9, title: "Registration Certificate", description: "Societies Act / Trust Act or equivalent", showWhen: ND_NEW },
  { n: 10, title: "Annual Report — last two financial years", showWhen: ND_NEW },
  { n: 11, title: "Audit Report — last two financial years", showWhen: ND_NEW },
  { n: 12, title: "Audited Accounts — previous year", description: "Balance Sheet, I&E, R&P, Auditor's Report", showWhen: ND_NEW },
  { n: 13, title: "Utilisation Certificate (GFR-12A)", description: "Previous grant, certified by a Chartered Accountant", showWhen: ND_RENEWAL },
  { n: 14, title: "Provisional Utilisation Certificates", description: "Grants released during the previous year", showWhen: ND_RENEWAL },
  { n: 15, title: "Half-Yearly Progress Report", showWhen: ND_RENEWAL },
  { n: 16, title: "Provisional / unaudited audit report", optional: true, showWhen: ND_RENEWAL },
  // n 17, "CCTV & Proactive-Disclosures status", is retired: no CCTV document on a renewal (W3).
  { n: 18, title: "Expenditure, Advance and Transfer (EAT) Module implementation status", showWhen: ND_RENEWAL },
  { n: 19, title: "Staff Monitoring Sheet", optional: true, showWhen: ND_RENEWAL },
];

export const NAPDDR_WIZARD: WizardDef = {
  code: "NAPDDR",
  title: "NAPDDR — National Action Plan for Drug Demand Reduction",
  steps: NAPDDR_STEPS,
  documents: NAPDDR_DOCS,
  // Live UAT, both branches (07–08 Sep 2026). It read "PDF only" here while every upload row
  // said "PDF, JPG or PNG"; the rows follow this line (document-centre.ts `acceptFromNote`).
  documentsNote: "PDF / JPG / PNG · Max 5 MB per file",
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
  const byBranch = firstByValue(field.helpWhen, values);
  // An empty string is a deliberate "no help on this branch".
  if (byBranch !== undefined) return byBranch || undefined;
  return field.help;
}

/** The wording the first matching rule gives for the current answers, if any. */
function firstByValue(rules: ByValue | readonly ByValue[] | undefined, values: Record<string, string>): string | undefined {
  if (!rules) return undefined;
  const list: readonly ByValue[] = Array.isArray(rules) ? rules : [rules as ByValue];
  for (const rule of list) {
    const hit = rule.byValue[values[rule.field] ?? ""];
    if (hit !== undefined) return hit;
  }
  return undefined;
}

const holds = (c: Condition | undefined, values: Record<string, string>) => !!c && c.equals.includes(values[c.field] ?? "");

/** The label a field shows on this branch. */
export function fieldLabel(field: FieldDef, values: Record<string, string>): string {
  return firstByValue(field.labelWhen, values) || field.label;
}

/** Whether the help under a field is shown: never under a locked one, unless it is flagged to be. */
export function shownHelp(field: FieldDef, values: Record<string, string>, locked: boolean): string | undefined {
  if (locked && !field.helpWhenLocked) return undefined;
  return fieldHelp(field, values);
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
  /** Options drawn from the applicant's own records, keyed by field name. See `FieldDef.optionsFrom`. */
  dynamic?: Readonly<Record<string, readonly string[]>>,
): readonly string[] {
  if (field.optionsFrom) return dynamic?.[field.name] ?? [];
  const all = field.options ?? [];
  const rule = field.optionsOnlyWhen;
  if (!rule) return all;
  const allowed = rule.equals.includes(values[rule.field] ?? "");
  return allowed ? all : all.filter((o) => !rule.options.includes(o));
}

/** Whether this field is read-only on this branch. See `FieldDef.readOnlyWhen`. */
export function isReadOnly(field: FieldDef, values: Record<string, string>): boolean {
  if (field.readOnly) return true;
  if (holds(field.readOnlyWhen, values)) return true;
  return (field.readOnlyWhenAny ?? []).some((c) => holds(c, values));
}

export function visibleSteps(
  wizard: WizardDef,
  values: Record<string, string>,
): readonly StepDef[] {
  const shown = (step: StepDef) =>
    (!step.showWhen || step.showWhen.equals.includes(values[step.showWhen.field] ?? "")) && !holds(step.hideWhen, values);
  return wizard.steps.filter(shown).map((step) => {
    if (step.kind !== "confirm") return step;
    // Everything the hidden form steps ask, in their order — so validation, the review read-back
    // and the saved answers treat a later instalment exactly as the full form.
    const folded = wizard.steps.filter((s) => (s.kind ?? "form") === "form" && s.hideWhen && holds(s.hideWhen, values));
    return { ...step, sections: folded.flatMap((s) => s.sections) };
  });
}

/** The sections of a step with at least one question showing on this branch. */
export function visibleSections(step: StepDef, values: Record<string, string>): readonly SectionDef[] {
  return step.sections.filter((section) => section.fields.some((f) => fieldVisible(f, values)));
}

/** Whether a section is drawn as a compact read-only record on this branch. */
export function isSummarySection(section: SectionDef, values: Record<string, string>): boolean {
  return holds(section.summaryWhen, values);
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
    (d) => (!d.showWhen || d.showWhen.equals.includes(values[d.showWhen.field] ?? "")) && !holds(d.hideWhen, values),
  );
}

const IFSC_RE = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const PIN_RE = /^[1-9][0-9]{5}$/;
const NAME_AND_PHONE_RE = /^[A-Za-z][A-Za-z .'-]*,\s*\d{10,}$/;
// Any script's letters and combining marks: a name typed in Devanagari is a name. It was
// Latin-only, and refused "सुनीता शर्मा".
const LETTERS_ONLY_RE = /^\p{L}[\p{L}\p{M} .,'-]*$/u;
/** One @, something either side, a dot in the domain, no spaces. Shape only; delivery proves the rest. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** A 10-digit Indian mobile number, after spaces, hyphens and a +91 or 0 prefix are removed. */
const MOBILE_RE = /^[6-9]\d{9}$/;
/** A landline or other contact number: 6 to 12 digits once the same separators are removed. */
const PHONE_RE = /^\d{6,12}$/;
/** Phone digits as typed, with spaces, hyphens, dots, brackets and a +91 / 0 prefix removed. */
export function phoneDigits(v: string): string {
  return v.replace(/[\s().-]/g, "").replace(/^(\+?91|0)(?=\d{10}$)/, "");
}

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

    const requiredNow = f.required || (f.requiredWith ?? []).some((k) => (values[k] ?? "").trim() !== "");
    if (requiredNow && !v) {
      errors[f.name] = requiredMessage({ ...f, label: fieldLabel(f, values) });
      continue;
    }
    if (!v) continue;

    // A number box takes a number. It is a text input (for the numeric keypad without the
    // spinner), so "twelve" and "1,20,000" reached a required figure unchallenged.
    if (f.kind === "number" && !/^\d+(\.\d+)?$/.test(v)) {
      errors[f.name] = "Enter a number using digits only — e.g. 120000.";
      continue;
    }
    if (f.notMoreThan) {
      const cap = Number(values[f.notMoreThan] || NaN);
      if (Number.isFinite(cap) && Number(v) > cap) {
        errors[f.name] = "Cannot be more than the number of beneficiaries.";
        continue;
      }
    }

    // An email box took "sankalpseva.example.org" — no @, nothing to deliver to — and the
    // validation-errors demo that typed it raised no error at all.
    if (f.kind === "email" && !EMAIL_RE.test(v)) {
      errors[f.name] = "Enter an email address in the correct format, like name@example.com.";
      continue;
    }

    // Phone boxes collected paragraphs (review call 11 Sep 2026, T486): a telephone field takes
    // digits, and a field named as a mobile takes a 10-digit Indian mobile number.
    if (f.kind === "tel") {
      const digits = phoneDigits(v);
      if (/mobile/i.test(`${f.name} ${f.label}`)) {
        if (!MOBILE_RE.test(digits)) {
          errors[f.name] = "Enter a 10-digit mobile number — e.g. 9876543210.";
          continue;
        }
      } else if (!PHONE_RE.test(digits)) {
        errors[f.name] = "Enter a contact number using digits only — e.g. 020 2345 6789.";
        continue;
      }
    }

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
          // The designation wording belongs to AVYAY's "name & designation" boxes only.
          errors[f.name] = /designation/i.test(f.label)
            ? "Enter the name and designation using letters only — e.g. Sunita Sharma, Warden."
            : "Enter the name using letters only — e.g. Sunita Sharma.";
        }
        break;
      case "pin":
        if (!PIN_RE.test(v)) errors[f.name] = "Enter a valid 6-digit PIN code.";
        break;
      case "ifsc":
        if (!IFSC_RE.test(v.toUpperCase())) errors[f.name] = "Enter a valid 11-character IFSC code — e.g. SBIN0001234.";
        break;
      case "notFuture":
        if (v > today) errors[f.name] = "The date cannot be later than today.";
        break;
      case "mustBeYes":
        // The grant is paid only into an account held in the organisation's own name.
        if (v !== "Yes") errors[f.name] = "The grant can be paid only into an account in the name of the NGO/VO.";
        break;
      case "accountNumber":
        // Digits as typed on a new account; the masked form an account on record is shown in.
        if (!/^\d{9,18}$/.test(v.replace(/\s/g, "")) && !/^X{4} X{4} \d{4}$/.test(v)) {
          errors[f.name] = "Enter the account number using digits only, 9 to 18 of them.";
        }
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
    if (f.auto.kind === "avyayRecurringNorm") {
      const ready = ["fld_nature_of_project", "fld_agency_type", "fld_project_state"].every((k) => (next[k] ?? "").trim() !== "");
      const value = ready
        ? String(
            avyayEntitlement({
              natureOfProject: next.fld_nature_of_project,
              agencyType: next.fld_agency_type,
              projectState: next.fld_project_state,
              buildingOwnership: next.fld_building_ownership,
            }).recurringCentral,
          )
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
