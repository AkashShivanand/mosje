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
  | "forwardedRegister"
  /** PD:JS — approves or rejects an NGO's request to change a project's bank account (live SM2 JS-PD). */
  | "approveBankChange"
  /** PMU — verifies or returns an NGO's request to move a project (live AVYAY PMU). */
  | "verifyLocationChange"
  /**
   * PD:US — releases a sanctioned instalment and opens the next for claim. Live SM2-PD-US carries
   * "Instalments & Fund Release" with "Release funds" and "Open for claim" (inventory §21 item 8).
   */
  | "releaseFunds"
  /** PD:SO and PD:JS — issues a Show Cause Notice to the NGO (live SM2-PD-SO / JS "Issue SCN"). */
  | "issueShowCause";

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
  /**
   * The ASO has noted a deficiency and the file is with the SO, who alone may send it to the
   * applicant. It had no state of its own: the file read "Under Examination", the SO's screen
   * never showed it and still offered Forward (screen audit, 14 Sep 2026).
   */
  | "DeficiencyProposed"
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
  | "inspectionReviewed"
  /** A sanctioned instalment released to the NGO. */
  | "releaseFunds"
  /** The next instalment opened for the NGO to claim. */
  | "openClaim"
  | "showCauseIssued";

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

/**
 * One thing a deficiency asks the applicant to put right — a document to replace, or an answer
 * to correct. The review call of 11 Sep 2026 (T43–75) settled that a deficiency is rarely one
 * sentence: a single application can carry several, and the applicant resolves them item by
 * item, so each carries the officer's own remark and its own correction state.
 */
export interface DeficiencyItem {
  id: string;
  /** "note" — a point the applicant answers in words, with no document or field to change. */
  kind: "document" | "field" | "note";
  /** `MockDoc.id` when `kind` is "document". */
  docId?: string;
  /** Form field name when `kind` is "field". */
  fieldName?: string;
  /** What the officer called it — a document title or a field label. */
  label: string;
  /** The officer's remark on this item. */
  remark: string;
  /** Set when the applicant has replaced the file or corrected the answer. */
  correctedAt?: string;
  /** The applicant's note on the correction. */
  response?: string;
  /** For a field item: the answer as first submitted, kept so the correction can be audited. */
  originalValue?: string;
}

/** One answer changed while correcting, as the officer reads it on resubmission. */
export interface AnswerChange {
  fieldName: string;
  label: string;
  /** The answer as submitted. Kept however many times it is changed again. */
  from: string;
  to: string;
  reason?: string;
  at: string;
}

export interface Deficiency {
  id: string;
  raisedBy: RoleId;
  raisedAt: string;
  /** The ASO's note. It stays inside the Ministry — the applicant is shown `message`. */
  detail: string;
  /** What the SO sent to the applicant, and when. Unset while the deficiency is only noted. */
  message?: string;
  communicatedAt?: string;
  communicatedBy?: RoleId;
  /** Set when the SO sent the file back to the ASO instead of communicating it. */
  withdrawnAt?: string;
  /**
   * The date the applicant was given to answer by, where the Ministry set one.
   *
   * Left unset: the response period is not published anywhere we hold — not in the scheme
   * guidelines, the BRD, or the live portal's own letters — and a deadline with no source does not
   * go on a citizen's page (`ui-restraint-and-copy.md`). The notification shows a "Respond by" date
   * only when this is recorded. **Needs a Ministry answer.**
   */
  respondBy?: string;
  /** Fields the NGO may edit while responding. Empty = whole form reopened. */
  reopenedFields: string[];
  /**
   * Answers the applicant changed of their own accord while correcting — beyond the items the
   * Ministry asked about — each with its answer as submitted and, where `edit-policy.ts` asks for
   * one, the applicant's reason. Shown to the officer on resubmission.
   */
  changes?: AnswerChange[];
  /** The individual corrections asked for. Absent on deficiencies raised before items existed. */
  items?: DeficiencyItem[];
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

/**
 * An earlier upload of a document slot. The department asked (T83–92) that a replaced file is
 * never overwritten: every version stays on record, newest last.
 */
export interface DocVersion {
  fileName: string;
  sizeKb?: number;
  uploadedAt?: string;
  /** When this version stopped being the current one. */
  replacedAt: string;
  /** What the automatic check said about this version, when it had run. */
  verdict?: import("./doc-verification").VerdictState;
  /** Why it was replaced — "Replaced after the Ministry's query". */
  note?: string;
}

/**
 * A file an officer attaches to the review — a site photograph, a letter — listed on the review
 * screen as "Officer Supporting Documents" (live DECISION captures).
 */
export interface OfficerDocument {
  id: string;
  /** "Document title (optional)" on the live form. */
  title?: string;
  fileName: string;
  sizeKb: number;
  uploadedAt: string;
  uploadedBy: RoleId;
}

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
  /**
   * Who gave the verdict, and when. A later grade reading the verdicts read-only is told who
   * examined each document, not only who certified the file.
   */
  reviewedBy?: RoleId;
  reviewedAt?: string;
  /** A permanent document re-uploaded this year needs re-verification. */
  reUploadedThisYear?: boolean;
  /**
   * The portal's own automated check on the uploaded file, shown to the APPLICANT beside the
   * document. Distinct from `reviewStatus`, which is the officer's verdict: a file can read
   * "AI: not valid" while the officer's own review is still Pending.
   */
  aiVerdict?: import("./doc-verification").DocVerdict;
  /** Earlier uploads of this slot, oldest first. The current file is `fileName`. */
  versions?: DocVersion[];
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
  /** The response deadline the officer set, when one was set ("Response deadline (optional)"). */
  respondBy?: string;
  response?: string;
  respondedAt?: string;
}

/** Money released to the NGO against one sanction order. One release per sanctioned claim. */
export interface FundRelease {
  amount: number;
  releasedAt: string;
  releasedBy: RoleId;
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
  id: string; // e.g. "SC/DL/NWD/09001"
  name: string;
  district: string;
  state: string;
  /**
   * What the project is. The four school natures are SHRESHTA's; an AVYAY project is a home for
   * senior citizens and a NAPDDR project a rehabilitation centre, and neither is a school.
   */
  nature:
    | "Primary Residential School"
    | "Secondary Residential School"
    | "Primary Non-Residential School"
    | "Secondary Non-Residential School"
    | "Senior Citizens' Home"
    | "Integrated Rehabilitation Centre for Addicts"
    | "Garima Greh (Shelter Home for Transgender Persons)";
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
  registrationDate?: string;
  registeredUnder?: string;
  state: string;
  district: string;
  chairman?: string;
  secretary?: string;
  treasurer?: string;
  authorisedUser?: string;
  email?: string;
  mobile?: string;
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
  projectLabel: string; // e.g. "Residential School — North West Delhi · FY 2025-26"
  financialYear: string;
  /**
   * New — the project's first grant (non-recurring set-up plus the first recurring release).
   * Ongoing — a sanctioned project claiming its next recurring instalment.
   */
  caseType: CaseType;
  /** Ongoing only: which recurring instalment this application claims. */
  instalment?: 1 | 2 | 3;
  status: AppStatus;
  holder: Holder;
  scBeneficiaries: number;
  otherBeneficiaries: number;
  totalBeneficiaries: number;
  recurring: number;
  nonRecurring: number;
  total: number;
  documents: MockDoc[];
  /**
   * The answers as submitted, keyed by the scheme form's field name. Drives the applicant's
   * "Application Data — as submitted" read-back and its "n of m answered" counts.
   */
  formValues?: Record<string, string>;
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
  /** The utilisation certificate the NGO filed against this sanction, if it has. */
  utilisation?: UtilisationCertificate;
  /** Files officers attached to the review. Absent on files where none has been. */
  officerDocuments?: OfficerDocument[];
  /** What was released against the sanction, once the Under Secretary has released it. */
  release?: FundRelease;
  /** When the instalment after this released one was opened for the NGO to claim. */
  claimOpenedAt?: string;
}

/** A GFR 12-A utilisation certificate, as the NGO files it. */
export interface UtilisationCertificate {
  filedAt: string;
  amountUtilised: number;
  remarks: string;
  /** The Chartered Accountant-signed certificate. */
  documentName: string;
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
  /** An online (BharatVC) inspection an officer scheduled from the review screen. */
  title?: string;
  description?: string;
  endsAt?: string;
  scheduledBy?: RoleId;
}

export interface NotificationEntry {
  id: string;
  at: string;
  title: string;
  body: string;
  /** Which sessions should see it. */
  audience: RoleId[];
  applicationId?: string;
  /** Where the notice opens, when it is about something other than an application (a change request). */
  href?: string;
  /**
   * The roles that have read it. One `read` flag was shared by the whole audience, so a notice
   * addressed to the applicant and an officer was marked read for both when either opened it.
   */
  readBy: RoleId[];
}

export type CaseType = "New" | "Ongoing";

/** A project's bank account, as the department holds it. History is kept, never overwritten. */
export interface ProjectAccount {
  id: string;
  /** `Institution.id` — the Project ID. */
  projectId: string;
  bank: string;
  branch: string;
  /** Last four digits only. The full number never reaches the browser's storage. */
  last4: string;
  ifsc: string;
  /** Whether the NGO has declared the account registered with the PFMS DBT module. */
  pfmsRegistered: boolean;
  activeFrom: string;
  /** Set when a later account replaced this one. */
  activeTo?: string;
}

/**
 * The CCTV registered at a project, so an inspecting officer can open its live feed during an
 * e-inspection. One record per project, replaced when the NGO changes the setup.
 *
 * It lives in the store rather than in the NGO's own browser (design-director follow-up, 16 Sep
 * 2026): a setup kept in `localStorage` is invisible to the officer who has to watch the feed, which
 * is the only reason the NGO is asked for it.
 */
export interface CctvSetup {
  /** `Institution.id` — the Project ID. One record per project. */
  projectId: string;
  /** Cameras registered at the centre, 1 to 8 as the live screen offers. */
  cameras: number;
  /** Whether the recorder has reached the portal, so an officer can open the feed. */
  liveFeed: boolean;
  /** The code the NGO enters in the recorder software at the centre. */
  activationCode: string;
  /** Who manages the CCTV computer at the centre. Optional on the form, so optional here. */
  contactName?: string;
  contactMobile?: string;
  /** When the NGO saved this setup. */
  savedAt: string;
}

/** "Returned" is a location change the PMU sent back to the NGO to raise again. */
export type ChangeRequestStatus = "Pending" | "Approved" | "Rejected" | "Returned";

interface ChangeRequestBase {
  id: string;
  projectId: string;
  submittedAt: string;
  status: ChangeRequestStatus;
  reason: string;
  /** Name of the optional supporting document. */
  documentName?: string;
  decidedAt?: string;
  /** The officer who decided it. */
  decidedBy?: RoleId;
  /** The officer's remarks, shown to the NGO with the outcome. */
  decisionRemarks?: string;
}

export interface LocationChangeRequest extends ChangeRequestBase {
  kind: "location";
  address: string;
  /** Recorded for the department; not shown to the applicant. */
  latitude?: number;
  longitude?: number;
}

export interface BankChangeRequest extends ChangeRequestBase {
  kind: "bank";
  bank: string;
  branch: string;
  last4: string;
  ifsc: string;
  pfmsRegistered: boolean;
}

export type ChangeRequest = LocationChangeRequest | BankChangeRequest;

export interface EAnudaanState {
  /** Bumped when the persisted shape changes; a mismatch drops and reseeds. */
  version: number;
  session: RoleId | null;
  schemes: Scheme[];
  ngos: NgoProfile[];
  applications: GrantApplication[];
  inspections: Inspection[];
  notifications: NotificationEntry[];
  projectAccounts: ProjectAccount[];
  /** CCTV registered per project, read by the NGO's setup page and by the inspecting officer. */
  cctv: CctvSetup[];
  changeRequests: ChangeRequest[];
  /** The applicant's roster, keyed by Project ID. */
  beneficiaries: import("./roster").Beneficiary[];
  employees: import("./roster").Employee[];
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
