/**
 * TG (National Portal for Transgender Persons) shared domain model.
 *
 * One contract every zone reads/writes: a citizen submits a certificate
 * application, which flows through the review state machine driven by the admin
 * roles (Examining Officer → Checker → District Magistrate → signed). Central
 * Admin oversees + manages users/roles/tenants/password policy. Mirrors the live
 * tg-admin-dev / tg-user-dev flow; corrected-to-design. No backend.
 */

// ── Roles ───────────────────────────────────────────────────────────────────

export type AdminRoleId =
  | "central-admin"
  | "examining-officer" // "Examining Authority" — the Maker
  | "checker"
  | "district-magistrate";

export type RoleId = AdminRoleId | "citizen";

// ── Application review state machine ────────────────────────────────────────

export type Stage =
  | "SUBMITTED" // citizen filed; awaiting Examining Officer (Maker) pickup
  | "MAKER_REVIEW" // Examining Authority scrutiny
  | "CHECKER_REVIEW" // Checker verification
  | "DM_REVIEW" // District Magistrate decision
  | "APPROVED_SIGNED" // DM approved & digitally signed — certificate issued
  | "CORRECTION_REQUESTED" // sent back to the citizen for correction
  | "REJECTED" // rejected at any review stage
  | "WITHDRAWN"; // citizen withdrew

/** Allowed forward transitions. Anything not listed is rejected by the store. */
export const STAGE_TRANSITIONS: Record<Stage, Stage[]> = {
  SUBMITTED: ["MAKER_REVIEW"],
  MAKER_REVIEW: ["CHECKER_REVIEW", "CORRECTION_REQUESTED", "REJECTED"],
  CHECKER_REVIEW: ["DM_REVIEW", "CORRECTION_REQUESTED", "REJECTED"],
  DM_REVIEW: ["APPROVED_SIGNED", "CORRECTION_REQUESTED", "REJECTED"],
  CORRECTION_REQUESTED: ["MAKER_REVIEW"], // citizen resubmits → back to Maker
  APPROVED_SIGNED: [],
  REJECTED: [],
  WITHDRAWN: [],
};

export function canTransition(from: Stage, to: Stage): boolean {
  return STAGE_TRANSITIONS[from]?.includes(to) ?? false;
}

/** Which stage each admin role acts on (its review queue). */
export const ROLE_ACTS_ON: Record<AdminRoleId, Stage[]> = {
  "examining-officer": ["SUBMITTED", "MAKER_REVIEW"],
  checker: ["CHECKER_REVIEW"],
  "district-magistrate": ["DM_REVIEW"],
  // Central Admin has portfolio oversight — sees everything, acts as override.
  "central-admin": ["SUBMITTED", "MAKER_REVIEW", "CHECKER_REVIEW", "DM_REVIEW"],
};

/** Human labels + status-pill tone per stage. */
export const STAGE_META: Record<
  Stage,
  { label: string; tone: "info" | "await" | "approve" | "reject" | "muted" }
> = {
  SUBMITTED: { label: "Submitted", tone: "info" },
  MAKER_REVIEW: { label: "Maker Review", tone: "await" },
  CHECKER_REVIEW: { label: "Checker Review", tone: "await" },
  DM_REVIEW: { label: "DM Review", tone: "await" },
  APPROVED_SIGNED: { label: "Approved and Signed", tone: "approve" },
  CORRECTION_REQUESTED: { label: "Correction Requested", tone: "reject" },
  REJECTED: { label: "Rejected", tone: "reject" },
  WITHDRAWN: { label: "Withdrawn", tone: "muted" },
};

// ── SLA risk ────────────────────────────────────────────────────────────────

export type SlaRisk = "overdue" | "at-risk" | "safe";

/** ≤0 days → overdue; ≤7 → at-risk; else safe. Mirrors the live legend. */
export function slaRisk(daysLeft: number): SlaRisk {
  if (daysLeft <= 0) return "overdue";
  if (daysLeft <= 7) return "at-risk";
  return "safe";
}

export const SLA_RISK_META: Record<SlaRisk, { label: string; tone: "reject" | "await" | "approve" }> = {
  overdue: { label: "Overdue", tone: "reject" },
  "at-risk": { label: "At Risk", tone: "await" },
  safe: { label: "Safe", tone: "approve" },
};

// ── Entities ────────────────────────────────────────────────────────────────

export type ApplicationType = "New" | "Revised";
export type GenderAtBirth = "Male" | "Female";
export type GenderRequested = "Transgender" | "Male" | "Female";

export interface ApplicantDetails {
  fullLegalName: string;
  chosenName: string;
  nameToPrint: string;
  genderAtBirth: GenderAtBirth;
  genderRequested: GenderRequested;
  dob: string; // ISO date
  guardianName: string;
  education: string;
  caste: string;
  annualIncome: string;
  mobile: string;
  email: string;
  pincode: string;
  state: string;
  district: string;
  address: string;
}

export interface AppDocument {
  type: string; // e.g. "ID Proof (Aadhaar Card)", "Passport Photo"
  filename: string;
  sizeKb: number;
}

export interface TimelineEntry {
  stage: Stage;
  at: string; // ISO
  byRole: RoleId;
  note?: string;
}

export interface Application {
  id: string; // "TG-2026-000NNN"
  type: ApplicationType;
  applicant: ApplicantDetails;
  stage: Stage;
  submittedAt: string; // ISO
  slaDaysLeft: number;
  documents: AppDocument[];
  timeline: TimelineEntry[];
  /** Set once APPROVED_SIGNED. */
  certificateNo?: string;
  /** Whether the applicant chose the DigiLocker path (else manual). */
  viaDigiLocker: boolean;
}

// ── Admin config entities ───────────────────────────────────────────────────

export interface UserRecord {
  id: string;
  name: string;
  mobile: string;
  email: string;
  role: string; // display label e.g. "District magistrate/district collector"
  jurisdiction: string; // "District - Ghaziabad, Uttar Pradesh" | "State - Andhra Pradesh"
  active: boolean;
}

export interface RoleRecord {
  id: string;
  role: string;
  description: string;
}

export interface TenantRecord {
  id: string;
  name: string;
  description: string;
  date: string; // dd-mm-yyyy display
}

export interface PasswordPolicy {
  historyCount: number;
  complexityLevel: number;
  minLength: number;
  allowedSpecialChars: string;
  maxInvalidAttempts: number;
  requireAlpha: boolean;
  requireNumeric: boolean;
  requireSpecial: boolean;
}

export interface Grievance {
  id: string;
  subject: string;
  category: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  raisedAt: string;
  detail: string;
}

// ── Root state ──────────────────────────────────────────────────────────────

export interface TgState {
  applications: Application[];
  users: UserRecord[];
  roles: RoleRecord[];
  tenants: TenantRecord[];
  passwordPolicy: PasswordPolicy;
  grievances: Grievance[];
  /** Signed-in admin role, or "citizen", or null (logged out). */
  session: RoleId | null;
}
