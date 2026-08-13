/**
 * E-Anudaan domain model.
 *
 * Grounded in the live dev portal (see docs/research/eanudaan-admin-dev.mosje.in/INVENTORY.md
 * and .../eanudaan-user-dev.mosje.in/INVENTORY.md), with the workflow semantics taken from
 * docs/specs/shreshta-mode2-portal-spec.md §5–6, which was written from the approved BRD.
 *
 * The one place the two disagree: the spec models a single `JS_IFD` concurrence step, while
 * the live portal runs a FULL five-grade Integrated Finance Division chain in parallel with
 * the Programme Division chain. The live portal wins — see `Division` / `Grade` below.
 */

/** The two review chains. Both run ASO → SO → US → DS → JS, but they are NOT mirrors. */
export type Division = "pd" | "finance";

/** Officer grades, in escalation order. `GRADES` below is the authoritative sequence. */
export type Grade = "aso" | "so" | "us" | "ds" | "js";

export const DIVISIONS: readonly Division[] = ["pd", "finance"] as const;
export const GRADES: readonly Grade[] = ["aso", "so", "us", "ds", "js"] as const;

export type ChainRoleId = `${Division}-${Grade}`;

/**
 * Every session the portal supports. 12 admin + 1 applicant.
 *
 * `programme-director` is evidenced by a real login that lands on /dashboard/sm2/pd, but its
 * screens are UNOBSERVED — that route crashes the browser renderer on the live dev site, so
 * everything PD-facing is built from the BRD and marked inferred.
 */
export type RoleId = ChainRoleId | "programme-director" | "pmu-field" | "ngo";

/**
 * What a role is allowed to do. Capabilities — not role checks — drive the review screen's
 * action bar, so one ReviewShell serves all ten officer grades without branching on identity.
 */
export type Capability =
  | "review"
  /** PD:ASO only — the mandatory "Record Certification" gate before forwarding. Observed on
   *  the live ASO review screen as a separate section and a separate button. */
  | "certify"
  | "raiseDeficiency"
  | "communicateDeficiency"
  | "raiseQuery"
  | "concur"
  | "sanction"
  /** IFD grades carry an "Online Inspection — BharatVC" panel with a Schedule action. */
  | "scheduleInspection"
  | "inspect"
  | "auditTrail"
  | "sanctionRegister"
  | "forwardedRegister";

/**
 * Application status. `Draft`, `Submitted`, `Sanctioned` and `Rejected` are observed verbatim
 * on the live NGO dashboard; the intermediate states come from the BRD state machine.
 * The live UI renders a compound badge — `Submitted / ASO` — from status + holder, not from a
 * single field. See `statusLabel()` in selectors.
 */
export type AppStatus =
  | "Draft"
  | "Submitted"
  | "UnderReview"
  | "QueryRaised"
  | "DeficiencyRaised"
  | "DeficiencyResponded"
  | "WithFinance"
  | "FinanceConcurred"
  | "WithPD"
  | "Returned"
  | "Sanctioned"
  | "Released"
  | "Rejected";

/** Who currently holds the file. A discriminated union because the chain is two divisions deep. */
export type Holder =
  | { kind: "ngo" }
  | { kind: "chain"; division: Division; grade: Grade }
  | { kind: "pd" }
  | { kind: "done" };

export type AuditAction =
  | "submit"
  | "certify"
  | "forward"
  | "raiseQuery"
  | "resolveQuery"
  | "raiseDeficiency"
  | "communicateDeficiency"
  | "respondDeficiency"
  | "concur"
  | "sanction"
  | "reject"
  | "return"
  | "routeDown"
  | "inspectionScheduled"
  | "inspectionSubmitted"
  | "inspectionReviewed";

/**
 * Audit entry. Field set mirrors the live Audit Trail screen's columns exactly:
 * Timestamp · Application · User · Role · Action · Remarks.
 */
export interface AuditEntry {
  id: string;
  at: string; // ISO — deterministic, derived from the seed clock
  byRole: RoleId;
  byName: string;
  action: AuditAction;
  from?: Holder;
  to?: Holder;
  remarks?: string;
}

export interface Deficiency {
  id: string;
  raisedBy: RoleId;
  raisedAt: string;
  detail: string;
  /** Fields the NGO may edit while responding. Empty = whole form reopened. */
  reopenedFields: string[];
  respondedAt?: string;
  response?: string;
}

export interface Query {
  id: string;
  raisedBy: RoleId;
  raisedAt: string;
  detail: string;
  /** Grade the file was pushed back to. */
  returnedTo: Grade;
  resolvedAt?: string;
}

/** Per-document verdict an officer records on the review screen's Documents table. */
export type DocReviewStatus = "Pending" | "Verified" | "Deficient" | "Not applicable";

export interface MockDoc {
  id: string;
  /** 1-20, matching the live Documents Checklist ordering. */
  slot: number;
  title: string;
  /**
   * The review screen splits the checklist in two, with different rules per group:
   *   annual    — "verified & remarked each year"
   *   permanent — "one-time · view-only unless re-uploaded this year"
   * A permanent document re-uploaded this year carries a "verify" chip.
   */
  group: "annual" | "permanent";
  fileName?: string;
  sizeKb?: number;
  uploadedAt?: string;
  optional?: boolean;
  /** Rendered as the live portal's "Required when …" note. */
  conditional?: string;
  /** Officer-side review state, per document — the Review column on the review screen. */
  reviewStatus: DocReviewStatus;
  /** The "Add remarks…" field beside each document. */
  officerRemarks?: string;
  /** A permanent document re-uploaded this year needs re-verification. */
  reUploadedThisYear?: boolean;
}

/**
 * "Formal notices to the NGO requiring a written explanation. Issued by the SO and above."
 * Verbatim from the live review screen's Show Cause Notices section.
 */
export interface ShowCauseNotice {
  id: string;
  issuedBy: RoleId;
  issuedAt: string;
  grounds: string;
  respondByDays: number;
  response?: string;
  respondedAt?: string;
}

export interface SanctionOrder {
  orderNo: string;
  sanctionedAt: string;
  recurring: number;
  nonRecurring: number;
  total: number;
  sanctionedBy: RoleId;
}

export interface Institution {
  id: string; // e.g. "SC/DL/NWD/02478"
  name: string;
  district: string;
  state: string;
  nature: "Primary Residential School" | "Secondary Residential School" | "Primary Non-Residential School" | "Secondary Non-Residential School";
  type: "Boys" | "Girls" | "Co-Ed";
  level: "Primary" | "Secondary";
  building: "Owned" | "Rented";
  pin: string;
}

export interface NgoProfile {
  id: string;
  name: string;
  darpanId: string;
  registrationNo: string;
  state: string;
  district: string;
  institutions: Institution[];
  applicationCount: number;
  sanctionedCount: number;
  totalGrant: number;
  lastInspection?: string;
}

/** Scheme catalogue — all four are offered on the live NGO portal's Select Grant Scheme step. */
export interface Scheme {
  code: string;
  name: string;
  description: string;
  target: string;
}

export interface GrantApplication {
  /** Two live namespaces: legacy `LGCY/nnnnn` and new `GIA/<FY>/<SCHEME>/<DISTRICT>/<n>`. */
  id: string;
  schemeCode: string;
  ngoId: string;
  institutionId: string;
  projectLabel: string; // e.g. "Hostel — North West Delhi · FY 2025-26"
  financialYear: string;
  status: AppStatus;
  holder: Holder;
  scBeneficiaries: number;
  otherBeneficiaries: number;
  totalBeneficiaries: number;
  recurring: number;
  nonRecurring: number;
  total: number;
  documents: MockDoc[];
  deficiencies: Deficiency[];
  queries: Query[];
  showCauseNotices: ShowCauseNotice[];
  /**
   * Set when PD:ASO records the mandatory certification. The live screen shows this as
   * "ASO Certified: Yes/No" in the Applicant panel and gates "Certify & Forward to SO" on it.
   */
  certifiedAt?: string;
  certifiedBy?: RoleId;
  sanction?: SanctionOrder;
  inspectionId?: string;
  audit: AuditEntry[];
  submittedAt?: string;
  updatedAt: string;
  /** Days the file has sat with its current holder — drives the "Pending > 7 days" KPI. */
  ageingDays: number;
}

export type InspectionStatus = "Pending" | "Scheduled" | "Submitted" | "Reviewed";

export interface Inspection {
  id: string;
  applicationId: string;
  ngoId: string;
  institutionId: string;
  status: InspectionStatus;
  visitType: "Physical" | "Online";
  scheduledFor?: string;
  submittedAt?: string;
  findings?: string;
  recommendation?: "Satisfactory" | "Needs improvement" | "Unsatisfactory";
}

export interface NotificationEntry {
  id: string;
  at: string;
  title: string;
  body: string;
  /** Which sessions should see it. */
  audience: RoleId[];
  applicationId?: string;
  read: boolean;
}

export interface EAnudaanState {
  /** Bumped when the persisted shape changes; a mismatch drops and reseeds. */
  version: number;
  session: RoleId | null;
  schemes: Scheme[];
  ngos: NgoProfile[];
  applications: GrantApplication[];
  inspections: Inspection[];
  notifications: NotificationEntry[];
}

/* ── helpers over the chain order ─────────────────────────────────────────── */

export function nextGrade(g: Grade): Grade | null {
  const i = GRADES.indexOf(g);
  return i < 0 || i === GRADES.length - 1 ? null : (GRADES[i + 1] as Grade);
}

export function prevGrade(g: Grade): Grade | null {
  const i = GRADES.indexOf(g);
  return i <= 0 ? null : (GRADES[i - 1] as Grade);
}

export function isDivision(v: string): v is Division {
  return (DIVISIONS as readonly string[]).includes(v);
}

export function isGrade(v: string): v is Grade {
  return (GRADES as readonly string[]).includes(v);
}

/** True when `holder` is the seat this role occupies. */
export function holderIsRole(holder: Holder, role: RoleId): boolean {
  if (holder.kind === "chain") return `${holder.division}-${holder.grade}` === role;
  if (holder.kind === "pd") return role === "programme-director";
  if (holder.kind === "ngo") return role === "ngo";
  return false;
}
