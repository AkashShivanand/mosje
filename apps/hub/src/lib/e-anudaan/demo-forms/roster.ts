/**
 * Add Beneficiary and Add Employee (`/ngo/beneficiaries`, the two dialogs the page's add button
 * opens). Both add to the project the page is showing.
 *
 * Add Beneficiary requires a name, gender, identity document and its number, and the date of
 * admission; a mobile, where given, is 10 digits starting 6–9.
 *
 * Add Employee requires a name, designation, date of joining, highest qualification, at least one
 * certificate, and the employee's 10-digit mobile verified by a one-time code. `certificates` is a
 * comma-separated list of file names; `mobileStage` is "verified" or "idle" (no code sent yet).
 */

import type { DemoFormDef } from "./index.ts";

const beneficiary = {
  name: "Shantabai Gaikwad",
  gender: "Female",
  category: "OBC",
  idType: "Aadhaar",
  idNumber: "999912340121",
  mobile: "9800000121",
  dob: "1952-03-14",
  guardian: "Ramesh Gaikwad (son)",
  admissionDate: "2026-09-01",
  remarks: "Admitted on referral from the Hadapsar ward office.",
};

export const ADD_BENEFICIARY: DemoFormDef = {
  id: "add-beneficiary",
  title: "Add Beneficiary",
  path: /^\/ngo\/beneficiaries\/?$/,
  presets: [
    { id: "valid", label: "Correct Beneficiary", valid: true, values: beneficiary },
    { id: "no-name", label: "Full Name Left Out", values: { ...beneficiary, name: "" } },
    { id: "no-gender", label: "Gender Not Chosen", values: { ...beneficiary, gender: "" } },
    { id: "no-id-type", label: "Identity Document Not Chosen", values: { ...beneficiary, idType: "" } },
    { id: "no-id-number", label: "Document Number Left Out", values: { ...beneficiary, idNumber: "" } },
    { id: "no-admission", label: "Date of Admission Left Out", values: { ...beneficiary, admissionDate: "" } },
    { id: "bad-mobile", label: "Mobile Number Incomplete", values: { ...beneficiary, mobile: "98000001" } },
  ],
};

const employee = {
  name: "Rekha Jadhav",
  designation: "Nurse",
  category: "General",
  joiningDate: "2026-08-18",
  qualification: "Professional (B.Ed., Nursing, Social Work)",
  certificates: "gnm-nursing-diploma.pdf,maharashtra-nursing-council-registration.pdf",
  mobile: "9800000131",
  mobileStage: "verified",
};

export const ADD_EMPLOYEE: DemoFormDef = {
  id: "add-employee",
  title: "Add Employee",
  path: /^\/ngo\/beneficiaries\/?$/,
  presets: [
    { id: "valid", label: "Correct Employee", valid: true, values: employee },
    { id: "no-name", label: "Full Name Left Out", values: { ...employee, name: "" } },
    { id: "no-designation", label: "Designation Not Chosen", values: { ...employee, designation: "" } },
    { id: "no-joining", label: "Date of Joining Left Out", values: { ...employee, joiningDate: "" } },
    { id: "no-qualification", label: "Qualification Not Chosen", values: { ...employee, qualification: "" } },
    { id: "no-certificates", label: "No Certificate Uploaded", values: { ...employee, certificates: "" } },
    { id: "bad-mobile", label: "Mobile Number Incomplete", values: { ...employee, mobile: "980000013", mobileStage: "idle" } },
    { id: "unverified", label: "Mobile Number Not Verified", values: { ...employee, mobileStage: "idle" } },
  ],
};
