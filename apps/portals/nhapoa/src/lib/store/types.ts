/**
 * NHAPOA shared domain model.
 *
 * This is the contract every role (Citizen → District Officer → State Authority
 * → Finance) reads and writes. A case filed by a Citizen becomes a `Case` here
 * and is driven through the status state machine by the admin roles, so the
 * cross-role demo story is a single source of truth — not per-screen static data.
 */

// ── Case status state machine ──────────────────────────────────────────────

export type CaseStatus =
  | "SUBMITTED" // citizen/call-center filed; awaiting DO triage
  | "ASSIGNED" // DO assigned to an investigating officer
  | "UNDER_INVESTIGATION" // SHO/DO investigating
  | "PENDING_APPROVAL" // sent to State Authority
  | "APPROVED" // State approved; awaiting Finance disbursement
  | "SENT_BACK" // State returned to DO for rework
  | "DISBURSED" // Finance released relief
  | "CLOSED"; // journey complete

/** Allowed transitions. Any transition not listed is rejected by the store. */
export const CASE_TRANSITIONS: Record<CaseStatus, CaseStatus[]> = {
  SUBMITTED: ["ASSIGNED"],
  ASSIGNED: ["UNDER_INVESTIGATION"],
  UNDER_INVESTIGATION: ["PENDING_APPROVAL"],
  PENDING_APPROVAL: ["APPROVED", "SENT_BACK"],
  APPROVED: ["DISBURSED"],
  SENT_BACK: ["ASSIGNED"],
  DISBURSED: ["CLOSED"],
  CLOSED: [],
};

export function canTransition(from: CaseStatus, to: CaseStatus): boolean {
  return CASE_TRANSITIONS[from]?.includes(to) ?? false;
}

/** Human labels + status-pill palette keys. */
export const CASE_STATUS_META: Record<
  CaseStatus,
  { label: string; tone: "info" | "await" | "approve" | "reject" | "muted" }
> = {
  SUBMITTED: { label: "Submitted", tone: "info" },
  ASSIGNED: { label: "Assigned", tone: "info" },
  UNDER_INVESTIGATION: { label: "Under Investigation", tone: "await" },
  PENDING_APPROVAL: { label: "Pending Approval", tone: "await" },
  APPROVED: { label: "Approved", tone: "approve" },
  SENT_BACK: { label: "Sent Back", tone: "reject" },
  DISBURSED: { label: "Disbursed", tone: "approve" },
  CLOSED: { label: "Closed", tone: "muted" },
};

// ── Entities ───────────────────────────────────────────────────────────────

export type CaseType = "FIR" | "Relief" | "Charge-Sheet";
export type ComplainantRole = "Informer" | "Victim" | "NGO";
export type CaseSource = "citizen" | "call-center";

export interface Person {
  name: string;
  mobile: string;
  address?: string;
  district?: string;
  state?: string;
}

export interface TimelineEntry {
  status: CaseStatus;
  at: string; // ISO date
  note?: string;
  byRole?: RoleId;
}

export interface Case {
  id: string;
  refNo: string;
  type: CaseType;
  category: string; // grievance category (POA offence)
  status: CaseStatus;
  state: string;
  district: string;
  source: CaseSource;
  complainantRole: ComplainantRole;
  complainant: Person;
  victim?: Person;
  details?: string;
  hasFir?: boolean;
  firNumber?: string;
  reliefAmount?: number; // sanctioned relief in INR
  assignedOfficer?: string;
  timeline: TimelineEntry[];
  createdAt: string;
}

export interface Rescue {
  id: string;
  refNo: string;
  name: string;
  mobile: string;
  location: string;
  problem: string;
  status: "SUBMITTED" | "IN_PROGRESS" | "RESOLVED";
  createdAt: string;
}

export interface Disbursement {
  id: string;
  caseId: string;
  refNo: string;
  amount: number;
  mode: string; // e.g. "DBT / NEFT"
  beneficiary: string;
  txnRef: string;
  at: string;
}

export interface Allocation {
  id: string;
  state: string;
  scheme: string;
  amount: number;
  at: string;
}

export interface AdminUserRecord {
  id: string;
  name: string;
  username: string;
  role: RoleId;
  district?: string;
  state?: string;
  active: boolean;
}

export interface NotificationItem {
  id: string;
  role: RoleId;
  title: string;
  body: string;
  read: boolean;
  at: string;
}

export interface QueryRecord {
  id: string;
  callerMobile: string;
  subject: string;
  status: "OPEN" | "RESOLVED";
  at: string;
}

export interface CategoryRecord {
  id: string;
  name: string;
  active: boolean;
  slaDays: number;
  amountCeiling: number;
}

// ── Roles (kept here to avoid a circular import from roles.ts) ──────────────

export type RoleId =
  | "citizen"
  | "district-officer"
  | "sho"
  | "state-authority"
  | "finance-officer"
  | "central-authority"
  | "system-admin"
  | "call-center";

// ── Store shape ────────────────────────────────────────────────────────────

export interface NhapoaState {
  cases: Case[];
  rescues: Rescue[];
  disbursements: Disbursement[];
  allocations: Allocation[];
  users: AdminUserRecord[];
  notifications: NotificationItem[];
  categories: CategoryRecord[];
  queries: QueryRecord[];
  /** Current mock session — the logged-in role, or null for public/citizen. */
  session: RoleId | null;
}
