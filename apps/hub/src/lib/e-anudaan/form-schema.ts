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
    title: "Application Type",
    sections: [
      {
        title: "Application Type",
        lead: "Is this a fresh (new) project, or a renewal of one of your existing (ongoing) projects?",
        fields: [
          {
            name: "caseType",
            label: "Case Type",
            kind: "radio",
            required: true,
            options: ["New project", "Ongoing / Renewal of an existing project"],
            help: "Choose 'Ongoing / Renewal' to carry forward the details of one of your existing AVYAY projects.",
          },
          {
            name: "existingProjectId",
            label: "Select the existing project to renew",
            kind: "select",
            required: true,
            options: ["IP/AR/DIB/40040 — Project · FY 2026-27"],
            help: "The whole form is prefilled from the selected project (FR-ONG-03/04). You can edit any field — on submit a new application is created for the chosen financial year.",
          },
          {
            name: "financialYear",
            label: "Financial Year for which grant is sought",
            kind: "select",
            required: true,
            options: ["2026-27", "2025-26"],
            help: "A new application is always for the financial year now running. For a renewal, this is the year whose instalment you are claiming — changing it re-checks which instalments are still open for this project.",
          },
          {
            name: "installment",
            label: "Installment",
            kind: "select",
            required: true,
            options: ["1st Installment", "2nd Installment"],
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
          { name: "ngoName", label: "Name of NGO / VO (as in NGO-Darpan)", kind: "text", required: true, readOnly: true, help: "Pre-filled from your login / NGO-Darpan." },
          { name: "darpanId", label: "NGO-Darpan Unique ID", kind: "text", required: true, readOnly: true, help: "Pre-filled from your login. Key for identity read and for duplicate-project prevention (FR-ONG-01)." },
          { name: "projectId", label: "Project ID", kind: "text", readOnly: true, help: "Generated automatically on submit as IP / State abbreviation / District abbreviation / a unique number. For an ongoing renewal, the existing project's ID is retained (FR-ONG-02)." },
          { name: "statute", label: "Statute / Act of Registration", kind: "text", required: true, help: "From NGO-Darpan where recorded; enter it yourself if the box is empty." },
          { name: "registrationNo", label: "Registration Number", kind: "text", required: true, help: "From NGO-Darpan / your login." },
          { name: "registeredOn", label: "Date of Registration", kind: "date", required: true, help: "From NGO-Darpan where recorded; enter it yourself if the box is empty." },
          { name: "address", label: "Registered-Office Address", kind: "textarea", required: true },
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
            name: "nature",
            label: "Nature of Project",
            kind: "select",
            required: true,
            options: [
              "Senior Citizens' Home — 50 beneficiaries",
              "Senior Citizens' Home — 25 beneficiaries",
              "Continuous Care Home — 50 beneficiaries",
              "Basera / Mobile Medicare Unit",
              "Physiotherapy Clinic for Senior Citizens",
            ],
            help: "Physiotherapy Clinic and Mobile Medicare Unit are supported for renewal/ongoing cases only (FR-NEW-04).",
          },
          {
            name: "agencyType",
            label: "Type of Implementing Agency",
            kind: "select",
            required: true,
            options: [
              "State Government",
              "Voluntary Organisation (NGO)",
              "Urban Local Body (ULB)",
              "Panchayati Raj Institution (PRI)",
              "Regional Resource & Training Centre (RRTC)",
            ],
            help: "Central share is derived from this and the project State: State Govt / ULB / PRI / RRTC → 100%; NE & Himalayan States → 95%; elsewhere → 90%.",
          },
          {
            name: "cityCategory",
            label: "City Category (HRA — provisional)",
            kind: "select",
            required: true,
            options: [
              "Y — city of 5 to 50 lakh",
              "X — metro (8 main cities)",
              "Z — non-city / small town",
            ],
            help: "Classes are the 7th CPC HRA classification by city population. X in the eight metros — Ahmedabad, Bengaluru, Chennai, Delhi, Hyderabad, Kolkata, Mumbai and Pune. Choose Z if the project is not in a city. Provisional: the Ministry derives the final tier from the project district, and this entry is used only where that district is not yet classified.",
          },
          {
            name: "projectState",
            label: "Project State",
            kind: "select",
            required: true,
            options: [
              "Arunachal Pradesh",
              "Assam",
              "Delhi",
              "Gujarat",
              "Karnataka",
              "Maharashtra",
              "Tamil Nadu",
              "Uttar Pradesh",
            ],
            help: "State where the project is located.",
          },
          {
            name: "projectDistrict",
            label: "Project District",
            kind: "select",
            required: true,
            options: [
              "Dibang Valley",
              "Kamrup Metropolitan",
              "New Delhi",
              "Ahmedabad",
              "Bengaluru Urban",
              "Mumbai City",
              "Chennai",
              "Lucknow",
            ],
            help: "Choose the Project State first, then its District.",
          },
        ],
      },
    ],
  },
  {
    title: "Justification",
    sections: [
      {
        title: "Justification & Project Need",
        lead: "Provide institutional and regional justification for seeking Grant-in-Aid under AVYAY.",
        fields: [
          {
            name: "justificationNeed",
            label: "Justification / Need for the Project in District / Location",
            kind: "textarea",
            required: true,
            help: "Explain why this project is essential in the target district, gap analysis, and lack of similar facility in proximity.",
          },
          {
            name: "targetBeneficiaryCoverage",
            label: "Target Beneficiaries & Coverage Strategy",
            kind: "textarea",
            required: true,
            help: "Describe how senior citizens / beneficiaries will be mobilized, housed, and cared for.",
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
          { name: "projectLocation", label: "Project Location (full address, PIN, landmark)", kind: "textarea", required: true },
          { name: "projectInCharge", label: "Project In-charge (name & contact)", kind: "text", required: true },
          { name: "functionalStatus", label: "Functional Status", kind: "select", required: true, options: ["Functional", "Non-Functional", "Under Setup"] },
          { name: "commencedOn", label: "Date of Commencement", kind: "date", required: true },
          { name: "building", label: "Building Owned / Rented", kind: "select", required: true, options: ["Owned", "Rented"] },
          { name: "totalArea", label: "Total Area (sq.ft.)", kind: "number", required: true },
          { name: "numberOfRooms", label: "Number of Rooms", kind: "number", required: true },
        ],
      },
      {
        title: "Bank Account Details",
        fields: [
          { name: "accountNo", label: "Account Number", kind: "text", required: true },
          { name: "ifsc", label: "IFSC Code", kind: "text", required: true },
          { name: "bankBranch", label: "Bank & Branch", kind: "text", required: true },
        ],
      },
      {
        title: "Beneficiaries Breakdown",
        fields: [
          { name: "scBeneficiaries", label: "Senior Citizen / Target Beneficiaries", kind: "number", required: true },
          { name: "otherBeneficiaries", label: "Other Beneficiaries", kind: "number" },
          { name: "totalBeneficiaries", label: "Total Number of Beneficiaries", kind: "number", required: true },
        ],
      },
    ],
  },
  {
    title: "Grant Sought & Declaration",
    sections: [
      {
        title: "Grant Sought",
        lead: "Recurring + Non-recurring = Total (S8). Non-recurring is released once every 5 years; recurring in two half-yearly installments after a positive inspection.",
        fields: [
          { name: "recurring", label: "Recurring Grant Sought (₹)", kind: "number", required: true, help: "Attendance-based running cost." },
          { name: "nonRecurring", label: "Non-Recurring Grant Sought (₹)", kind: "number", required: true, help: "One-time durables (CCTV, beds, utensils)." },
          { name: "total", label: "Total Grant Sought (₹)", kind: "number", required: true, help: "Auto-calculated: recurring + non-recurring." },
        ],
      },
      {
        title: "Verification & Authorised Person",
        fields: [
          { name: "dec_no_fee", label: "No money is charged from the beneficiaries", kind: "radio", required: true, options: YES_NO },
          { name: "dec_blacklist", label: "Organisation is not blacklisted", kind: "radio", required: true, options: YES_NO },
          { name: "authorisedName", label: "Name of Authorised Person", kind: "text", required: true },
          { name: "authorisedContact", label: "Contact of Authorised Person", kind: "tel", required: true },
          { name: "place", label: "Place", kind: "text", required: true },
          { name: "declaredOn", label: "Date", kind: "date", required: true },
        ],
      },
    ],
  },
  { title: "Upload Documents", sections: [] }, // rendered from the 9-document AVYAY checklist
  { title: "Review & Submit", sections: [] }, // rendered as read-back of all 7 preceding steps
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

