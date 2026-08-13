/**
 * The Grant-in-Aid application form, as a declarative schema.
 *
 * Field labels, helper text, select options and step titles are transcribed from the live
 * wizard (docs/research/eanudaan-user-dev.mosje.in/INVENTORY.md §5). Declaring it once means
 * the wizard and the officer's review screen render the same fields and cannot drift apart.
 *
 * NOTE the correction the capture forced: this is **6 steps under one URL**, not the 2 routed
 * steps the JS bundle's route table implies. Step state is internal; the stepper is display-only.
 */

export type FieldKind = "text" | "tel" | "email" | "date" | "number" | "textarea" | "select" | "radio";

export interface FieldDef {
  name: string;
  label: string;
  kind: FieldKind;
  required?: boolean;
  /** Rendered under the control, verbatim from the live form. */
  help?: string;
  options?: readonly string[];
  /**
   * The live form labels these "Read-only — sourced from NGO-Darpan / your login" but leaves
   * them editable in the DOM (recorded as defect D8). The clone honours the claim.
   */
  readOnly?: boolean;
}

export interface SectionDef {
  title: string;
  lead?: string;
  fields: FieldDef[];
}

export interface StepDef {
  /** Stepper label, e.g. "Organisation Details". */
  title: string;
  sections: SectionDef[];
}

const YES_NO = ["Yes", "No"] as const;

export const WIZARD_STEPS: readonly StepDef[] = [
  {
    title: "Organisation Details",
    sections: [
      {
        title: "Organisation Details",
        lead: "Identity of the applicant NGO/VO. Pre-filled from NGO-Darpan where available.",
        fields: [
          { name: "ngoName", label: "Name of NGO / VO (as in NGO-Darpan)", kind: "text", required: true, readOnly: true, help: "Read-only — sourced from NGO-Darpan / your login." },
          { name: "darpanId", label: "NGO-Darpan Unique ID", kind: "text", required: true, readOnly: true, help: "Read-only — sourced from NGO-Darpan / your login." },
          { name: "statute", label: "Statute / Act of Registration", kind: "text", required: true, help: "From NGO-Darpan where recorded; enter it yourself if the box is empty." },
          { name: "registrationNo", label: "Registration Number", kind: "text", required: true, help: "From NGO-Darpan / your login." },
          { name: "registeredOn", label: "Date of Registration", kind: "date", required: true, help: "From NGO-Darpan where recorded; enter it yourself if the box is empty." },
          { name: "expiresOn", label: "Date of Expiry", kind: "date", required: true, help: "Not held by NGO-Darpan — please enter it. Must be later than the date of registration." },
          { name: "address", label: "Registered-Office Address", kind: "textarea", required: true },
          { name: "city", label: "City", kind: "text", required: true },
          { name: "district", label: "District", kind: "text", required: true },
          { name: "state", label: "State", kind: "text", required: true },
          { name: "mobile", label: "Mobile", kind: "tel", required: true },
          { name: "email", label: "Email", kind: "email", required: true },
          { name: "telephone", label: "Telephone", kind: "tel" },
          { name: "fax", label: "Fax", kind: "text" },
        ],
      },
    ],
  },
  {
    title: "Institution Details",
    sections: [
      {
        title: "Institution Details",
        fields: [
          { name: "institutionId", label: "Institution ID", kind: "text", required: true },
          { name: "financialYear", label: "Financial Year for which GIA is sought", kind: "select", required: true, options: ["2025-26", "2026-27", "2027-28"] },
          {
            name: "nature", label: "Nature of Institution", kind: "select", required: true,
            options: ["Primary Residential School", "Secondary Residential School", "Primary Non-Residential School", "Secondary Non-Residential School"],
          },
          { name: "type", label: "Type", kind: "select", required: true, options: ["Boys", "Girls", "Co-Ed"] },
          { name: "level", label: "Level", kind: "select", required: true, options: ["Primary", "Secondary"] },
          { name: "status", label: "Status of Institution", kind: "select", required: true, options: ["Ongoing"] },
          { name: "ucPending", label: "UC Pending Status (SFR 212(1))", kind: "select", required: true, options: ["No UC Pending", "UC Pending"] },
          { name: "commencedOn", label: "Date & Year of Commencement", kind: "date", required: true },
          { name: "giaSince", label: "Year from which GIA received under SHRESHTA", kind: "text", required: true },
          { name: "location", label: "Institution Location (address, district, landmark)", kind: "textarea", required: true },
          { name: "pin", label: "Institution PIN Code", kind: "text", required: true },
          { name: "building", label: "Building Owned / Rented", kind: "select", required: true, options: ["Owned", "Rented"] },
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
          { name: "accountNo", label: "Account Number", kind: "text", required: true },
          { name: "ifsc", label: "IFSC Code", kind: "text", required: true },
          { name: "bankBranch", label: "Bank & Branch", kind: "text", required: true },
        ],
      },
      {
        title: "GIA Released — Last 3 Years",
        fields: [
          { name: "resourceMobilisation", label: "Resource-mobilisation capability (sources / amount)", kind: "textarea" },
          { name: "giaLast3Years", label: "GIA released in last 3 years (sanction no., date, amount)", kind: "textarea" },
        ],
      },
      {
        title: "Beneficiaries",
        fields: [
          { name: "scBeneficiaries", label: "SC Beneficiaries", kind: "number", required: true },
          { name: "otherBeneficiaries", label: "Other-Category Beneficiaries", kind: "number" },
          { name: "totalBeneficiaries", label: "Total Number of Beneficiaries", kind: "number", required: true },
          { name: "previousYearBeneficiaries", label: "Number of Beneficiaries (Previous Year)", kind: "number" },
        ],
      },
      {
        title: "Grant Sought",
        fields: [
          { name: "recurring", label: "Recurring Grant Sought (₹)", kind: "number", required: true },
          { name: "nonRecurring", label: "Non-Recurring Grant Sought (₹)", kind: "number", required: true },
          { name: "total", label: "Total Grant Sought (₹)", kind: "number", required: true, help: "Must equal recurring + non-recurring." },
        ],
      },
    ],
  },
  {
    title: "Declarations",
    sections: [
      {
        title: "Compliance Declarations",
        fields: [
          { name: "dec_registration", label: "The organisation's registration is current and valid", kind: "radio", required: true, options: YES_NO },
          { name: "dec_accounts", label: "Accounts for the previous year have been audited", kind: "radio", required: true, options: YES_NO },
          { name: "dec_uc", label: "Utilisation Certificates for earlier grants have been filed", kind: "radio", required: true, options: YES_NO },
          { name: "dec_cctv", label: "CCTV has been installed as required under the scheme", kind: "radio", required: true, options: YES_NO },
          { name: "dec_eat", label: "The EAT module has been implemented", kind: "radio", required: true, options: YES_NO },
          { name: "dec_blacklist", label: "The organisation is not blacklisted by any Ministry or State Government", kind: "radio", required: true, options: YES_NO },
        ],
      },
      {
        title: "Authorised Person & Declaration",
        fields: [
          { name: "authorisedName", label: "Name of Authorised Person", kind: "text", required: true },
          { name: "authorisedContact", label: "Contact of Authorised Person", kind: "tel", required: true },
          { name: "place", label: "Place", kind: "text", required: true },
          { name: "declaredOn", label: "Date", kind: "date", required: true },
          { name: "declaredAt", label: "Time", kind: "text", required: true },
        ],
      },
    ],
  },
  { title: "Upload Documents", sections: [] }, // rendered from the document checklist, not fields
  { title: "Review & Submit", sections: [] }, // rendered as a read-back of everything above
];

/** `recurring + non-recurring = total`, and at least one beneficiary. [BRD] */
export function validateGrant(values: Record<string, string>): string | null {
  const r = Number(values.recurring ?? 0);
  const nr = Number(values.nonRecurring ?? 0);
  const t = Number(values.total ?? 0);
  if (t > 0 && r + nr !== t) return "Total Grant Sought must equal Recurring + Non-Recurring.";
  if (Number(values.totalBeneficiaries ?? 0) <= 0) return "Total Number of Beneficiaries must be greater than zero.";
  return null;
}
