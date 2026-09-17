/**
 * The documents e-Anudaan asks for, as sample subjects: what each looks like when it is right.
 *
 * One subject per document TYPE, not per title — "Annual Report — Previous Financial Year" and
 * "Annual Report of NGO — previous-to-previous financial year" are one subject. The file stem is
 * chosen so `topicsOfFile` (document-centre.ts) reads it as that type and nothing else:
 * "fire-safety-report", not "fire-safety-audit-report", which also reads as the accounts.
 *
 * Every value is invented and resolves to nobody. The organisation is the prototype's demo applicant,
 * and its particulars match the answers the demo dock types (apps/hub/src/lib/e-anudaan/demo-answers.ts).
 */

export const ORG = "Sankalp Seva Sansthan";
export const OTHER_ORG = "Jagruti Mahila Mandal";
export const ADDRESS = "Plot 7, Sai Vihar Society, Magarpatta Road, Hadapsar, Pune, Maharashtra 411028";
export const OTHER_ADDRESS = "House No. 14, Samarth Nagar, Aurangabad, Maharashtra 431001";
export const FY_PREV = "2025-26";
export const FY_CURRENT = "2026-27";
export const FY_TWO_BACK = "2024-25";

/**
 * `sign`: who signs it — "authority" (the organisation's office-bearer), "ca" (a Chartered
 * Accountant, with membership number and UDIN), "notary" (signed and notarised), "bank" (a bank
 * officer's seal), "registrar" (an issuing office).
 * `fields`: label/value rows. `table`: header and rows. `parts`: named sections of a statement.
 * `particulars`: the field labels the "missing particulars" sample blanks.
 * `variant`: how the wrong format of this document is titled.
 */
export const SUBJECTS = [
  {
    stem: "registration-certificate", title: "Certificate of Registration", issuer: "Office of the Registrar of Societies, Pune",
    sign: "registrar",
    fields: [["Name of Society", ORG], ["Registration No.", "MH/PUN/1860/51-54"], ["Date of Registration", "12 June 2012"], ["Act", "Societies Registration Act, 1860"], ["Registered Office", ADDRESS], ["Validity", "Permanent, subject to annual returns"]],
    particulars: ["Registration No.", "Date of Registration"],
    validity: ["Validity", "Valid until 31 March 2025 — renewal due"],
  },
  {
    stem: "school-recognition-certificate", title: "Certificate of Recognition", issuer: "Directorate of School Education, Maharashtra",
    sign: "registrar",
    fields: [["School", "Sankalp Residential School, Hadapsar"], ["Managed by", ORG], ["Recognition No.", "DSE/PUN/REC/2019/0412"], ["Classes Recognised", "I to VIII"], ["Period of Recognition", "1 April 2024 to 31 March 2029"]],
    particulars: ["Recognition No.", "Period of Recognition"],
    validity: ["Period of Recognition", "1 April 2020 to 31 March 2025"],
  },
  {
    stem: "pan-card", title: "Permanent Account Number Card", issuer: "Income Tax Department, Government of India",
    sign: "none",
    fields: [["Name", ORG.toUpperCase()], ["Permanent Account Number", "AAATS0000A"], ["Date of Incorporation", "12/06/2012"]],
    particulars: ["Permanent Account Number"],
  },
  {
    stem: "annual-report", title: `Annual Report ${FY_PREV}`, issuer: ORG, yearKind: "previous",
    sign: "authority",
    fields: [["Organisation", ORG], ["Financial Year", FY_PREV], ["Registered Office", ADDRESS]],
    parts: [["Activities Undertaken", "Residential school for 120 children; health camps in 14 villages; vocational training for 60 young women."], ["Beneficiaries Served", "1,240 persons across three programmes."], ["Governance", "Four meetings of the Managing Committee; accounts audited by M/s Deshpande & Associates."]],
    particulars: ["Financial Year"],
  },
  {
    stem: "audited-accounts", title: `Audited Accounts for the year ended 31 March ${FY_PREV.slice(0, 2)}${FY_PREV.slice(5)}`, issuer: ORG, yearKind: "previous",
    sign: "ca",
    fields: [["Organisation", ORG], ["Financial Year", FY_PREV], ["Auditor", "M/s Deshpande & Associates, Chartered Accountants"], ["Membership No.", "123456"], ["UDIN", "26123456AAAAAA0000"]],
    parts: [["Balance Sheet", "Total assets ₹48,62,400 · Corpus fund ₹31,10,000 · Current liabilities ₹2,14,300"], ["Income & Expenditure Account", "Income ₹62,40,000 · Expenditure ₹59,85,600 · Surplus ₹2,54,400"], ["Receipts & Payments Account", "Opening balance ₹3,20,000 · Receipts ₹62,40,000 · Payments ₹60,02,100"], ["Auditor's Report", "In our opinion the accounts give a true and fair view of the state of affairs of the Society."]],
    particulars: ["Membership No.", "UDIN"],
    variant: "Statement of Accounts (unaudited, prepared by the Society)",
  },
  {
    stem: "income-expenditure", title: `Details of Income and Expenditure ${FY_PREV}`, issuer: ORG, yearKind: "previous",
    sign: "ca",
    fields: [["Organisation", ORG], ["Financial Year", FY_PREV]],
    table: { head: ["Head", "Income (₹)", "Expenditure (₹)"], rows: [["Grant-in-aid", "38,40,000", "—"], ["Donations", "14,20,000", "—"], ["Salaries and honoraria", "—", "31,60,000"], ["Food and maintenance", "—", "18,25,600"], ["Administrative", "—", "10,00,000"]] },
    parts: [["Income & Expenditure Account", "As tabled."], ["Receipts & Payments Account", "Opening ₹3,20,000 · Closing ₹5,57,900"]],
  },
  {
    stem: "budget-estimate", title: `Budget Estimate ${FY_CURRENT}`, issuer: ORG, yearKind: "current",
    sign: "authority",
    fields: [["Organisation", ORG], ["Financial Year", FY_CURRENT]],
    table: { head: ["Head", "Recurring (₹)", "Non-recurring (₹)"], rows: [["Honorarium of staff", "28,80,000", "—"], ["Food and clothing", "19,20,000", "—"], ["Rent", "4,80,000", "—"], ["Furniture and equipment", "—", "3,50,000"], ["Contingencies", "1,20,000", "—"]] },
    particulars: ["Financial Year"],
    blankTable: true,
  },
  {
    stem: "utilisation-certificate", title: `Utilisation Certificate (GFR 12-A) ${FY_PREV}`, issuer: ORG, yearKind: "previous",
    sign: "ca",
    fields: [["Form", "GFR 12-A"], ["Grantee", ORG], ["Sanction No. and Date", "F.No. 11-22/2025-SM2 dated 14 July 2025"], ["Amount Received", "₹38,40,000"], ["Amount Utilised", "₹38,40,000"], ["Unspent Balance", "Nil"], ["Chartered Accountant", "M/s Deshpande & Associates · M.No. 123456 · UDIN 26123456AAAAAA0001"]],
    particulars: ["Sanction No. and Date", "Amount Utilised"],
    variant: "Statement of Expenditure (not in GFR 12-A format)",
  },
  {
    stem: "provisional-utilisation-certificate", title: `Provisional Utilisation Certificate (GFR 12-A) ${FY_CURRENT}`, issuer: ORG, yearKind: "current",
    sign: "authority",
    fields: [["Form", "GFR 12-A (Provisional)"], ["Grantee", ORG], ["Sanction No. and Date", "F.No. 11-41/2026-SM2 dated 2 May 2026"], ["Amount Released", "₹19,20,000"], ["Amount Utilised to Date", "₹11,05,000"]],
    particulars: ["Sanction No. and Date", "Amount Utilised to Date"],
    variant: `Audited Utilisation Certificate (GFR 12-A) ${FY_TWO_BACK}`,
  },
  {
    stem: "bank-authorisation-letter", title: "Bank Authorisation Letter", issuer: "State Bank of India, Hadapsar Branch, Pune",
    sign: "bank",
    fields: [["Account Holder", ORG], ["Account Number", "123456789012"], ["Account Type", "Savings (project account)"], ["IFSC", "SBIN0000001"], ["MICR", "411002045"], ["Branch Address", "Hadapsar, Pune 411028"]],
    particulars: ["Account Number", "IFSC", "Account Holder"],
    bank: true,
  },
  {
    stem: "agreement-bond", title: "Agreement Bond (on Non-Judicial Stamp Paper of ₹100)", issuer: ORG,
    sign: "notary",
    fields: [["Executed by", ORG], ["In favour of", "The President of India, through the Department of Social Justice & Empowerment"], ["Undertaking", "To utilise the grant for the purpose sanctioned and refund any amount unspent or misused."], ["Place and Date", "Pune, 3 August 2026"]],
    blankable: true,
  },
  {
    stem: "rent-agreement", title: "Leave and Licence Agreement", issuer: "Sub-Registrar, Haveli No. 11, Pune",
    sign: "notary",
    fields: [["Licensor", "Ramesh Bhosale"], ["Licensee", ORG], ["Premises", ADDRESS], ["Monthly Rent", "₹40,000"], ["Period", "1 April 2026 to 31 March 2029"]],
    validity: ["Period", "1 April 2022 to 31 March 2025"],
    address: ["Premises", OTHER_ADDRESS],
    blankable: true,
  },
  {
    stem: "staff-list", title: "List of Employees", issuer: ORG,
    sign: "authority",
    table: { head: ["Name", "Designation", "Category", "Honorarium (₹/month)", "Period"], rows: [["Anil Kulkarni", "Superintendent", "Full-time", "32,000", "Apr 2024 –"], ["Meera Joshi", "Teacher", "Full-time", "24,000", "Jun 2025 –"], ["Lata Shinde", "Cook", "Full-time", "14,000", "Apr 2023 –"], ["Prakash Rane", "Counsellor", "Part-time", "12,000", "Jan 2026 –"]] },
    incompleteColumns: 2,
    blankable: true,
  },
  {
    stem: "staff-monitoring-sheet", title: "Staff Monitoring Sheet", issuer: ORG,
    sign: "authority",
    table: { head: ["Name", "Designation", "Days Present", "Days Absent", "Remarks"], rows: [["Kavita Patil", "Project Coordinator", "24", "2", "—"], ["Meera Joshi", "Counsellor", "25", "1", "—"], ["Prakash Rane", "Nurse", "26", "0", "—"]] },
    incompleteColumns: 2,
  },
  {
    stem: "beneficiary-list", title: `List of Beneficiaries ${FY_PREV}`, issuer: ORG, yearKind: "previous",
    sign: "authority",
    table: { head: ["S. No.", "Name", "Gender", "Date of Admission", "Category"], rows: [["1", "Pooja Kamble", "F", "10 Jan 2024", "SC"], ["2", "Rahul Gaikwad", "M", "10 Jan 2024", "SC"], ["3", "Sneha Pawar", "F", "11 Feb 2025", "OBC"], ["4", "Aakash More", "M", "12 Mar 2025", "SC"]] },
    incompleteColumns: 2,
    blankable: true,
  },
  {
    stem: "committee-members", title: "List of Managing Committee Members", issuer: ORG,
    sign: "authority",
    table: { head: ["Name", "Designation", "Occupation", "Address", "Contact"], rows: [["Dr Rajesh Sharma", "President", "Retired teacher", "Pune", "98000 00001"], ["Sunita Deshpande", "Secretary", "Social worker", "Pune", "98000 00002"], ["Anil Deshpande", "Treasurer", "Accountant", "Pune", "98000 00003"], ["Dr Sameer Gokhale", "Member", "Doctor", "Pune", "98000 00004"], ["Vijay More", "Member", "Farmer", "Haveli", "98000 00005"]] },
    incompleteColumns: 1,
    blankable: true,
  },
  {
    stem: "memorandum-of-association", title: "Memorandum of Association and Rules", issuer: ORG,
    sign: "authority",
    fields: [["Name", ORG], ["Registered Office", ADDRESS]],
    parts: [["Aims and Objects", "To establish and run residential schools, hostels and homes for children of Scheduled Castes and other disadvantaged groups."], ["Membership", "Open to any adult who subscribes to the aims of the Society."], ["Managing Committee", "Seven members elected for three years."]],
  },
  {
    stem: "compliance-status", title: "Compliance Status — Proactive Disclosures and CCTV Installation", issuer: ORG,
    sign: "authority",
    fields: [["Organisation", ORG], ["Proactive Disclosures", "Published on the Society's website, updated 1 July 2026"], ["CCTV Cameras Installed", "12 (entrance, corridors, kitchen, classrooms)"], ["Recording Retained", "30 days"], ["Live Feed Registered", "Yes, on 14 August 2026"]],
  },
  {
    stem: "eat-module-status", title: "Expenditure, Advance and Transfer (EAT) Module — Implementation Status", issuer: ORG, yearKind: "current",
    sign: "authority",
    fields: [["Agency", ORG], ["PFMS Agency Code", "MHPU00000001"], ["EAT Module", "Implemented from 1 April 2025"], ["Financial Year", FY_CURRENT], ["Expenditure Booked on PFMS", "₹11,05,000"]],
    particulars: ["PFMS Agency Code"],
  },
  {
    stem: "infrastructure-details", title: "Infrastructure Details", issuer: ORG,
    sign: "authority",
    fields: [["Premises", ADDRESS], ["Built-up Area", "6,400 sq ft"], ["Dormitories", "6 (20 beds each)"], ["Classrooms", "8"], ["Kitchen and Dining", "1 kitchen, 1 dining hall"], ["Toilets", "12 (separate for girls and boys)"]],
    address: ["Premises", OTHER_ADDRESS],
  },
  {
    stem: "fire-safety-report", title: "Fire Safety Audit Report", issuer: "Pune Fire Brigade, Hadapsar Fire Station",
    sign: "registrar",
    fields: [["Premises", ADDRESS], ["Occupancy", "Residential institution, 120 residents"], ["Extinguishers", "14, serviced 2 June 2026"], ["Exits", "3, unobstructed"], ["Valid Until", "1 June 2027"]],
    validity: ["Valid Until", "31 March 2025"],
    address: ["Premises", OTHER_ADDRESS],
  },
  {
    stem: "progress-report", title: `Half-Yearly Progress Report (April–September ${FY_CURRENT.slice(0, 4)})`, issuer: ORG, yearKind: "current",
    sign: "authority",
    fields: [["Organisation", ORG], ["Period", `1 April to 30 September ${FY_CURRENT.slice(0, 4)}`], ["Financial Year", FY_CURRENT]],
    parts: [["Admissions", "22 persons admitted; 18 discharged after treatment."], ["Follow-up", "41 follow-up visits completed."], ["Awareness", "9 school awareness sessions."]],
  },
  {
    stem: "justification-note", title: "Justification for Continuation of Ongoing Institution", issuer: ORG,
    sign: "authority",
    parts: [["Need", "The institution is the only residential school for Scheduled Caste children within 40 km."], ["Performance", "Pass rate 94% in 2025-26; enrolment steady at 120."], ["Request", "Continuation of grant for 2026-27."]],
  },
];

/** Which of a subject's documents a check can be shown on, by the subject's own shape. */
export function renderable(subject, check) {
  switch (check) {
    case "missing-particulars": return Array.isArray(subject.particulars);
    case "missing-parts": return Array.isArray(subject.parts) && subject.parts.length > 1;
    case "wrong-variant": return Boolean(subject.variant);
    case "wrong-year": return Boolean(subject.yearKind);
    case "validity-lapsed": return Boolean(subject.validity);
    case "address-mismatch": return Boolean(subject.address);
    case "incomplete-table": return Boolean(subject.table && subject.incompleteColumns);
    case "blank-template": return Boolean(subject.blankable || subject.blankTable);
    case "bank-mismatch":
    case "account-name": return Boolean(subject.bank);
    case "not-notarised": return subject.sign === "notary";
    case "unsigned": return subject.sign !== "none";
    default: return true;
  }
}
