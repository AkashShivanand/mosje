/**
 * Seed data for the TG mock store — synthesized to mirror the live tg-admin-dev
 * queues (TG-2026-000NNN ids, districts, stages, SLA badges) WITHOUT copying the
 * real applicants' PII from the design-audit captures. One demo citizen
 * ("Anshul Verma") owns an approved certificate so the citizen dashboard is live.
 */

import type {
  Application,
  ApplicantDetails,
  Grievance,
  PasswordPolicy,
  RoleRecord,
  Stage,
  TenantRecord,
  UserRecord,
} from "./types";
import { slaRisk } from "./types";

const iso = (daysAgo: number) => {
  // Fixed reference so SSR and client agree (no Date.now()).
  const ref = new Date("2026-07-06T09:00:00.000Z").getTime();
  return new Date(ref - daysAgo * 86_400_000).toISOString();
};

function applicant(partial: Partial<ApplicantDetails> & { fullLegalName: string; chosenName: string; state: string; district: string }): ApplicantDetails {
  return {
    nameToPrint: partial.chosenName,
    genderAtBirth: "Male",
    genderRequested: "Transgender",
    dob: "2001-04-12",
    guardianName: "—",
    education: "Higher Secondary",
    caste: "General",
    annualIncome: "Below 1 Lakh",
    mobile: "9800000000",
    email: "applicant@example.com",
    pincode: "110001",
    address: "1 Demo Street, Test Locality",
    ...partial,
  };
}

const DOCS = [
  { type: "ID Proof (Aadhaar Card)", filename: "aadhaar.pdf", sizeKb: 128 },
  { type: "Passport Photo", filename: "photo.jpg", sizeKb: 94 },
  { type: "Signature / Thumb Impression", filename: "signature.jpg", sizeKb: 19 },
  { type: "Affidavit (Rule 2020)", filename: "affidavit.pdf", sizeKb: 210 },
];

interface Row {
  n: number;
  name: string;
  chosen: string;
  state: string;
  district: string;
  stage: Stage;
  type: "New" | "Revised";
  daysAgo: number;
  slaDaysLeft: number;
  cert?: string;
}

// Spread across every stage so each role's queue has content.
const ROWS: Row[] = [
  { n: 106, name: "Kiran Rao", chosen: "Kiran", state: "Uttar Pradesh", district: "Kanpur Nagar", stage: "DM_REVIEW", type: "New", daysAgo: 26, slaDaysLeft: -2 },
  { n: 108, name: "Meera Nair", chosen: "Meera", state: "Gujarat", district: "Ahmedabad", stage: "WITHDRAWN", type: "New", daysAgo: 13, slaDaysLeft: 13 },
  { n: 109, name: "Anaya Sharma", chosen: "Anaya", state: "Gujarat", district: "Ahmedabad", stage: "APPROVED_SIGNED", type: "New", daysAgo: 14, slaDaysLeft: 14, cert: "TG/CERT/2026/40901" },
  { n: 110, name: "Ishaan Gupta", chosen: "Ish", state: "Gujarat", district: "Ahmedabad", stage: "APPROVED_SIGNED", type: "Revised", daysAgo: 14, slaDaysLeft: 14, cert: "TG/CERT/2026/40910" },
  { n: 111, name: "Rhea Menon", chosen: "Rhea", state: "Gujarat", district: "Ahmedabad", stage: "WITHDRAWN", type: "New", daysAgo: 17, slaDaysLeft: 17 },
  { n: 112, name: "Aarav Patel", chosen: "Aarav", state: "Karnataka", district: "Ballari", stage: "WITHDRAWN", type: "New", daysAgo: 18, slaDaysLeft: 18 },
  { n: 113, name: "Tara Devi", chosen: "Tara", state: "Arunachal Pradesh", district: "Changlang", stage: "REJECTED", type: "New", daysAgo: 18, slaDaysLeft: 18 },
  { n: 114, name: "Zoya Khan", chosen: "Zoya", state: "Uttar Pradesh", district: "Ghaziabad", stage: "DM_REVIEW", type: "New", daysAgo: 18, slaDaysLeft: 18 },
  { n: 115, name: "Dev Joshi", chosen: "Dev", state: "Uttar Pradesh", district: "Ghaziabad", stage: "DM_REVIEW", type: "Revised", daysAgo: 24, slaDaysLeft: 24 },
  { n: 116, name: "Sana Ali", chosen: "Sana", state: "Maharashtra", district: "Pune", stage: "CHECKER_REVIEW", type: "New", daysAgo: 6, slaDaysLeft: 24 },
  { n: 117, name: "Vihaan Reddy", chosen: "Vihaan", state: "Andhra Pradesh", district: "Guntur", stage: "CHECKER_REVIEW", type: "Revised", daysAgo: 5, slaDaysLeft: 5 },
  { n: 118, name: "Nisha Kumari", chosen: "Nisha", state: "Uttarakhand", district: "Dehradun", stage: "MAKER_REVIEW", type: "New", daysAgo: 3, slaDaysLeft: 27 },
  { n: 119, name: "Aditya Bose", chosen: "Adi", state: "Maharashtra", district: "Mumbai", stage: "MAKER_REVIEW", type: "New", daysAgo: 2, slaDaysLeft: 6 },
  { n: 120, name: "Fatima Sheikh", chosen: "Fatima", state: "Karnataka", district: "Bengaluru Urban", stage: "SUBMITTED", type: "New", daysAgo: 1, slaDaysLeft: 29 },
  { n: 121, name: "Rohan Das", chosen: "Rohan", state: "Chandigarh", district: "Chandigarh", stage: "CORRECTION_REQUESTED", type: "New", daysAgo: 9, slaDaysLeft: 21 },
];

function buildApp(r: Row): Application {
  const id = `TG-2026-${String(r.n).padStart(6, "0")}`;
  const timeline: Application["timeline"] = [
    { stage: "SUBMITTED", at: iso(r.daysAgo), byRole: "citizen" },
  ];
  return {
    id,
    type: r.type,
    applicant: applicant({
      fullLegalName: r.name,
      chosenName: r.chosen,
      state: r.state,
      district: r.district,
      genderAtBirth: r.n % 2 === 0 ? "Male" : "Female",
    }),
    stage: r.stage,
    submittedAt: iso(r.daysAgo),
    slaDaysLeft: r.slaDaysLeft,
    documents: DOCS,
    timeline,
    certificateNo: r.cert,
    viaDigiLocker: r.n % 3 === 0,
  };
}

export const SEED_APPLICATIONS: Application[] = ROWS.map(buildApp);

/** The demo citizen's own certificate (Certificate Active on the dashboard). */
export const DEMO_CITIZEN: ApplicantDetails = applicant({
  fullLegalName: "Anshul Verma",
  chosenName: "Anshul",
  nameToPrint: "Anshul",
  state: "Maharashtra",
  district: "Ahmednagar",
  genderAtBirth: "Male",
  genderRequested: "Transgender",
  dob: "2000-06-02",
  mobile: "9820011234",
  email: "anshul@example.com",
});

export const DEMO_CITIZEN_APP: Application = {
  id: "TG-2026-000098",
  type: "New",
  applicant: DEMO_CITIZEN,
  stage: "APPROVED_SIGNED",
  submittedAt: iso(30),
  slaDaysLeft: 0,
  documents: DOCS,
  timeline: [
    { stage: "SUBMITTED", at: iso(30), byRole: "citizen" },
    { stage: "MAKER_REVIEW", at: iso(28), byRole: "examining-officer", note: "Scrutiny complete" },
    { stage: "CHECKER_REVIEW", at: iso(25), byRole: "checker", note: "Verified" },
    { stage: "DM_REVIEW", at: iso(22), byRole: "district-magistrate" },
    { stage: "APPROVED_SIGNED", at: iso(10), byRole: "district-magistrate", note: "Approved and digitally signed" },
  ],
  certificateNo: "TG/CERT/2026/40975",
  viaDigiLocker: false,
};

export const SEED_USERS: UserRecord[] = [
  { id: "u1", name: "Rakesh Menon", mobile: "9810900001", email: "dm.ghaziabad@mosje.in", role: "District magistrate/district collector", jurisdiction: "District - Ghaziabad, Uttar Pradesh", active: true },
  { id: "u2", name: "Latha Prasad", mobile: "9810900002", email: "dm.ballari@mosje.in", role: "District magistrate/district collector", jurisdiction: "District - Ballari, Karnataka", active: true },
  { id: "u3", name: "Divya Chandran", mobile: "9810900003", email: "eo.dehradun@mosje.in", role: "Examining Authority/state", jurisdiction: "District - Dehradun, Uttarakhand", active: true },
  { id: "u4", name: "Sunil Kamble", mobile: "9810900004", email: "eo.ballari@mosje.in", role: "Examining Authority/state", jurisdiction: "District - Ballari, Karnataka", active: true },
  { id: "u5", name: "Priya Nair", mobile: "9810900005", email: "dm.ahmedabad@mosje.in", role: "District magistrate/district collector", jurisdiction: "District - Ahmedabad, Gujarat", active: true },
  { id: "u6", name: "Arjun Rao", mobile: "9810900006", email: "eo.ap@mosje.in", role: "Examining Authority/state", jurisdiction: "State - Andhra Pradesh", active: true },
  { id: "u7", name: "Neha Sharma", mobile: "9810900007", email: "checker.chandigarh@mosje.in", role: "Checker/verifying officer", jurisdiction: "District - Chandigarh, Chandigarh", active: false },
  { id: "u8", name: "Manoj Iyer", mobile: "9810900008", email: "eo.ap2@mosje.in", role: "Examining Authority/state", jurisdiction: "State - Andhra Pradesh", active: true },
];

export const SEED_ROLES: RoleRecord[] = [
  { id: "r1", role: "Admin", description: "Central administrator — full portal oversight & configuration" },
  { id: "r2", role: "District magistrate/district collector", description: "District-level approving & signing authority" },
  { id: "r3", role: "Examining Authority/state", description: "Application scrutiny (Maker)" },
  { id: "r4", role: "Checker/verifying officer", description: "Second-level verification (Checker)" },
  { id: "r5", role: "GG USER", description: "Garima Greh User" },
];

export const SEED_TENANTS: TenantRecord[] = [
  { id: "t1", name: "Maharashtra SJD", description: "Maharashtra Social Justice Department", date: "09-04-2026" },
  { id: "t2", name: "Gujarat SJD", description: "Gujarat Social Justice Department", date: "12-04-2026" },
  { id: "t3", name: "Karnataka SWD", description: "Karnataka Social Welfare Department", date: "18-04-2026" },
];

export const SEED_PASSWORD_POLICY: PasswordPolicy = {
  historyCount: 5,
  complexityLevel: 3,
  minLength: 8,
  allowedSpecialChars: "@#$%&*",
  maxInvalidAttempts: 5,
  requireAlpha: true,
  requireNumeric: true,
  requireSpecial: true,
};

export const SEED_GRIEVANCES: Grievance[] = [
  { id: "g1", subject: "Certificate name spelling incorrect", category: "Certificate Error", status: "IN_PROGRESS", raisedAt: iso(8), detail: "The chosen name printed on my certificate has a spelling error." },
  { id: "g2", subject: "Scholarship application not reflecting", category: "Welfare Scheme", status: "OPEN", raisedAt: iso(3), detail: "I applied for the National Scholarship but it does not show in my dashboard." },
];

/** Re-export for the store's SLA recompute-on-read. */
export { slaRisk };
