/**
 * E-Anudaan workflow state machine.
 *
 * Pure module — no React, no I/O — so it can be unit-tested on its own and replayed by the
 * seeder. Every status/holder change in the portal goes through `applyAction`; no screen ever
 * assigns `status` or `holder` directly. That invariant is what keeps the audit trail honest.
 *
 * The chain, as implemented on the live portal:
 *
 *   NGO ──submit──► PD:ASO ─► PD:SO ─► PD:US ─► PD:DS ─► PD:JS
 *                                                          │ forward
 *                                                          ▼
 *                   IFD:ASO ─► IFD:SO ─► IFD:US ─► IFD:DS ─► IFD:JS
 *                                                          │ concur
 *                                                          ▼
 *                                             Programme Director
 *                                              ├─ sanction ─► DONE (Sanctioned)
 *                                              └─ return ───► PD:ASO (Returned, re-climbs)
 *
 * Side loops: ASO notes a deficiency (DeficiencyProposed, file with the SO), the SO communicates
 * it to the NGO — or returns it to the ASO unsent — the NGO responds and it re-enters at SO.
 * While a noted deficiency is unsent the file cannot be forwarded. US and DS raise a *query* instead, which pushes the file one grade
 * down and climbs back when resolved. [BRD §5.2–5.3]
 */

import { GRADE_FULL, ROLES, type RoleDef } from "./roles.ts";
import { formatDate, rupees } from "./format.ts";
import {
  holderIsRole,
  nextGrade,
  prevGrade,
  type AppStatus,
  type AuditAction,
  type AuditEntry,
  type DeficiencyItem,
  type GrantApplication,
  type Grade,
  type Holder,
  type MockDoc,
  type RoleId,
} from "./types.ts";

export type WorkflowAction =
  | "submit"
  | "certify"
  | "forward"
  | "raiseDeficiency"
  | "communicateDeficiency"
  | "respondDeficiency"
  | "raiseQuery"
  | "resolveQuery"
  | "concur"
  | "sanction"
  | "return"
  | "reject";

export interface ActionPayload {
  remarks?: string;
  /** ASO's mandatory certification tick before forwarding. */
  certified?: boolean;
  /** Fields the NGO may edit when a deficiency is communicated. */
  reopenedFields?: string[];
  sanction?: { recurring: number; nonRecurring: number };
  /**
   * The corrections a deficiency asks for. Built from the officer's own document verdicts
   * (`deficiencyItemsFrom`) — a deficiency with no items reached the NGO as "0 of 0 corrected"
   * and nothing to upload (screen audit, 14 Sep 2026).
   */
  items?: Omit<DeficiencyItem, "id">[];
}

/**
 * What a deficiency asks the NGO to put right, from the review as the officer left it: every
 * document marked for correction, with its reason. With no document marked, the officer's note
 * becomes one item the NGO answers in words — never an empty list.
 */
export function deficiencyItemsFrom(app: Pick<GrantApplication, "documents">, note: string): Omit<DeficiencyItem, "id">[] {
  const docs = app.documents
    .filter((d) => d.reviewStatus === "Deficient")
    .map((d) => ({ kind: "document" as const, docId: d.id, label: d.title, remark: (d.officerRemarks ?? "").trim() }));
  if (docs.length > 0) return docs;
  const text = note.trim();
  return text ? [{ kind: "note" as const, label: "Clarification Requested", remark: text }] : [];
}

/** The deficiency noted by the ASO and not yet sent to the NGO, if any. */
export function proposedDeficiency(app: Pick<GrantApplication, "status" | "deficiencies">) {
  if (app.status !== "DeficiencyProposed") return undefined;
  return [...app.deficiencies].reverse().find((d) => !d.communicatedAt && !d.withdrawnAt && !d.respondedAt);
}

/** Injected so the seeder can replay deterministically and the UI can use the real clock. */
export interface Clock {
  now: string;
  id: (prefix: string) => string;
}

export interface Rule {
  action: WorkflowAction;
  /**
   * Button copy. A function, not a string, because the button names the destination:
   * PD:ASO reads "Forward to the Section Officer", PD:JS "Forward to Integrated
   * Finance". The live portal's "Forward to SO" / "Forward to IFD-SO" are not reproduced.
   */
  label: (role: RoleDef, app: GrantApplication) => string;
  intent: "primary" | "secondary" | "danger";
  requiresRemarks: boolean;
  requiresCertification?: boolean;
  /** May this role fire this action against this application right now? */
  can: (app: GrantApplication, role: RoleDef) => boolean;
  /** Resulting holder + status. */
  next: (app: GrantApplication, role: RoleDef, p: ActionPayload) => { holder: Holder; status: AppStatus };
  audit: AuditAction;
  /**
   * The confirmation an irreversible or outward decision must pass before it is recorded, or
   * `null` where the decision commits directly. The Programme Director's sanction of ₹68,00,000
   * and a Return for Reconsideration both committed on one click, while the one confirmation on
   * the screen was hard-coded to "Reject This Application?" (UX audit UX-03, 14 Sep 2026).
   */
  confirm?: (ctx: DecisionContext) => ConfirmCopy | null;
  /** The toast once the decision is recorded — the outcome, never "<button label> — recorded". */
  outcome: (ctx: DecisionContext & { after: GrantApplication }) => string;
}

/** What a confirmation or an outcome message needs to name the file in words. */
export interface DecisionContext {
  app: GrantApplication;
  role: RoleDef;
  payload: ActionPayload;
  /** The applicant organisation's registered name. */
  ngoName: string;
  /** The project, as the register titles it. */
  project: string;
}

export interface ConfirmCopy {
  title: string;
  /** One sentence: what happens to the file, and whether it can be undone. */
  summary: string;
  /** The particulars the officer is committing to — NGO, project, amounts, the remarks sent. */
  facts: { term: string; value: string }[];
  /** The confirm button names the action: "Sanction ₹68,00,000", not "Confirm". */
  confirmLabel: string;
  tone: "primary" | "danger";
}

/** The seat a holder names, spelled out: "the Under Secretary, Programme Division". Never "US". */
export function seatName(holder: Holder): string {
  if (holder.kind === "chain") {
    return `the ${GRADE_FULL[holder.grade]}, ${holder.division === "finance" ? "Integrated Finance Division" : "Programme Division"}`;
  }
  if (holder.kind === "pd") return "the Programme Director";
  if (holder.kind === "ngo") return "the NGO";
  return "";
}

function fileFacts(ctx: DecisionContext): { term: string; value: string }[] {
  return [
    { term: "NGO", value: ctx.ngoName },
    { term: "Project", value: ctx.project },
    { term: "Application No.", value: ctx.app.id },
  ];
}

function remarksFact(ctx: DecisionContext, term = "Your Remarks"): { term: string; value: string } {
  return { term, value: ctx.payload.remarks?.trim() || "None entered" };
}

/** The amount the sanction order will carry — from the officer's entry, never silently the sum sought. */
export function sanctionTotal(payload: ActionPayload): number | null {
  const s = payload.sanction;
  if (!s || !Number.isFinite(s.recurring) || !Number.isFinite(s.nonRecurring)) return null;
  return s.recurring + s.nonRecurring;
}

/** The role holds the file and is allowed to review at all. */
function holds(app: GrantApplication, role: RoleDef): boolean {
  return holderIsRole(app.holder, role.id) && role.caps.includes("review");
}

function chainHolder(app: GrantApplication): { division: "pd" | "finance"; grade: Grade } | null {
  return app.holder.kind === "chain" ? { division: app.holder.division, grade: app.holder.grade } : null;
}

/**
 * Forward-button copy: every destination is the grade's full title. The live ASO button's
 * "Certify & " prefix is dropped — certification is its own recorded step above the decision, and
 * the prefix pushed the spelled-out label onto two lines.
 */
function forwardLabel(role: RoleDef): string {
  const nxt = role.grade ? nextGrade(role.grade) : null;
  if (!nxt) return role.division === "pd" ? "Forward to Integrated Finance" : "Forward";
  // Grade titles spelled out: "Forward to US" read as the word "us" (UX audit UX-18). Within the
  // Integrated Finance Division the destination is the officer's own division, so it is not named.
  return `Forward to the ${GRADE_FULL[nxt]}`;
}

export const RULES: readonly Rule[] = [
  {
    action: "submit",
    label: () => "Submit Application",
    intent: "primary",
    requiresRemarks: false,
    audit: "submit",
    can: (app, role) => role.id === "ngo" && app.status === "Draft",
    next: () => ({ holder: { kind: "chain", division: "pd", grade: "aso" }, status: "Submitted" }),
    outcome: ({ after }) => `Application ${after.id} submitted.`,
  },
  {
    action: "certify",
    label: () => "Record Certification",
    intent: "secondary",
    requiresRemarks: false,
    requiresCertification: true,
    audit: "certify",
    // The live ASO screen renders this as its own section and its own button, and leaves the
    // file exactly where it is — only `certifiedAt` changes. Forwarding is then unblocked.
    can: (app, role) => holds(app, role) && role.caps.includes("certify") && !app.certifiedAt,
    next: (app) => ({ holder: app.holder, status: app.status }),
    outcome: ({ ngoName }) => `Certification recorded for the application from ${ngoName}.`,
  },
  {
    action: "forward",
    label: (role) => forwardLabel(role),
    intent: "primary",
    requiresRemarks: true,
    // Only the ASO certifies; every other grade forwards on remarks alone. [BRD FR-SM2-27]
    requiresCertification: false,
    audit: "forward",
    can: (app, role) => {
      const h = chainHolder(app);
      if (!h || !holds(app, role)) return false;
      if (app.status === "QueryRaised") return false; // must resolve the query first
      if (app.status === "DeficiencyProposed") return false; // send the deficiency or return it first
      // "Certify & Forward" is disabled until Record Certification has been pressed.
      if (role.caps.includes("certify") && !app.certifiedAt) return false;
      // IFD:JS concurs rather than forwards; that is a separate rule.
      return !(h.division === "finance" && h.grade === "js");
    },
    next: (app) => {
      const h = chainHolder(app)!;
      const nxt = nextGrade(h.grade);
      if (nxt) {
        return { holder: { kind: "chain", division: h.division, grade: nxt }, status: "UnderReview" };
      }
      // End of the PD chain — hand to the Integrated Finance Division.
      return { holder: { kind: "chain", division: "finance", grade: "aso" }, status: "WithFinance" };
    },
    // Only the forward that leaves the Programme Division is confirmed; a forward one grade up
    // stays inside the division and is the everyday move.
    confirm: (ctx) => {
      const h = chainHolder(ctx.app);
      if (!h || nextGrade(h.grade)) return null;
      return {
        title: "Forward to the Integrated Finance Division?",
        summary:
          "The file leaves the Programme Division and goes to the Assistant Section Officer, Integrated Finance Division, for financial examination.",
        facts: [...fileFacts(ctx), { term: "Grant Sought", value: rupees(ctx.app.total) }, remarksFact(ctx)],
        confirmLabel: "Forward to Integrated Finance",
        tone: "primary",
      };
    },
    outcome: ({ after }) => `File forwarded to ${seatName(after.holder)}.`,
  },
  {
    action: "concur",
    label: () => "Record Financial Concurrence",
    intent: "primary",
    requiresRemarks: true,
    audit: "concur",
    can: (app, role) => {
      const h = chainHolder(app);
      return !!h && h.division === "finance" && h.grade === "js" && holds(app, role) && role.caps.includes("concur");
    },
    next: () => ({ holder: { kind: "pd" }, status: "FinanceConcurred" }),
    confirm: (ctx) => ({
      title: "Record Financial Concurrence?",
      summary: "The Integrated Finance Division's concurrence is recorded and the file goes to the Programme Director for sanction.",
      facts: [...fileFacts(ctx), { term: "Grant Sought", value: rupees(ctx.app.total) }, remarksFact(ctx)],
      confirmLabel: "Record Financial Concurrence",
      tone: "primary",
    }),
    outcome: () => "Financial concurrence recorded. File sent to the Programme Director.",
  },
  {
    action: "sanction",
    label: () => "Sanction",
    intent: "primary",
    requiresRemarks: true,
    audit: "sanction",
    can: (app, role) => app.holder.kind === "pd" && role.caps.includes("sanction"),
    next: () => ({ holder: { kind: "done" }, status: "Sanctioned" }),
    confirm: (ctx) => {
      const s = ctx.payload.sanction;
      const total = sanctionTotal(ctx.payload);
      const amount = total === null ? "—" : rupees(total);
      return {
        title: "Issue the Sanction Order?",
        summary: `A sanction order for ${amount} will be issued to ${ctx.ngoName}. It cannot be withdrawn from this portal.`,
        facts: [
          ...fileFacts(ctx),
          { term: "Amount Sought", value: rupees(ctx.app.total) },
          { term: "Recurring Grant", value: s ? rupees(s.recurring) : "—" },
          { term: "Non-Recurring Grant", value: s ? rupees(s.nonRecurring) : "—" },
          {
            term: "Amount to Sanction",
            value: total === null ? "—" : total === ctx.app.total ? `${amount} (the full amount sought)` : `${amount} (${rupees(ctx.app.total - total)} less than sought)`,
          },
          remarksFact(ctx),
        ],
        confirmLabel: `Sanction ${amount}`,
        tone: "primary",
      };
    },
    outcome: ({ after, ngoName }) =>
      after.sanction ? `Sanction order ${after.sanction.orderNo} issued for ${ngoName}.` : `Sanction recorded for ${ngoName}.`,
  },
  {
    action: "return",
    label: () => "Return for Reconsideration",
    // A return is not a rejection: it sent the file back with the same red fill as Reject.
    intent: "secondary",
    requiresRemarks: true,
    audit: "return",
    can: (app, role) => app.holder.kind === "pd" && role.caps.includes("sanction"),
    // Returns to the bottom of the PD chain and re-climbs the whole way. [BRD §5.2]
    next: () => ({ holder: { kind: "chain", division: "pd", grade: "aso" }, status: "Returned" }),
    confirm: (ctx) => ({
      title: "Return for Reconsideration?",
      summary:
        "The file goes back to the Assistant Section Officer, Programme Division, and must be examined again at every level before it returns to you.",
      facts: [...fileFacts(ctx), { term: "Grant Sought", value: rupees(ctx.app.total) }, remarksFact(ctx, "Reason for Return")],
      confirmLabel: "Return to the Assistant Section Officer",
      tone: "primary",
    }),
    outcome: ({ after }) => `File returned to ${seatName(after.holder)} for reconsideration.`,
  },
  {
    action: "raiseDeficiency",
    label: () => "Raise Deficiency",
    intent: "secondary",
    requiresRemarks: true,
    audit: "raiseDeficiency",
    can: (app, role) =>
      holds(app, role) &&
      role.caps.includes("raiseDeficiency") &&
      app.status !== "DeficiencyProposed" &&
      app.status !== "QueryRaised",
    // Routes to the SO, who is the only grade that may communicate it onward to the NGO. The
    // file carries its own state so the SO sees it waiting, not "Under Examination".
    next: () => ({ holder: { kind: "chain", division: "pd", grade: "so" }, status: "DeficiencyProposed" }),
    outcome: ({ after }) => `Deficiency noted and sent to ${seatName(after.holder)}.`,
  },
  {
    action: "communicateDeficiency",
    label: () => "Send Deficiency to NGO",
    intent: "primary",
    requiresRemarks: true,
    audit: "communicateDeficiency",
    can: (app, role) =>
      holds(app, role) && role.caps.includes("communicateDeficiency") && !!proposedDeficiency(app),
    next: () => ({ holder: { kind: "ngo" }, status: "DeficiencyRaised" }),
    confirm: (ctx) => {
      const items = proposedDeficiency(ctx.app)?.items ?? [];
      return {
        title: "Send the Deficiency to the NGO?",
        summary: `${ctx.ngoName} will be asked to correct ${items.length} item${items.length === 1 ? "" : "s"}, and the file waits with the NGO until it responds.`,
        facts: [
          ...fileFacts(ctx),
          { term: "Items to Correct", value: items.length ? items.map((it) => it.label).join("; ") : "None listed" },
          remarksFact(ctx, "Message to the NGO"),
        ],
        confirmLabel: "Send to the NGO",
        tone: "primary",
      };
    },
    outcome: ({ ngoName }) => `Deficiency sent to ${ngoName}.`,
  },
  {
    action: "respondDeficiency",
    label: () => "Submit Response",
    intent: "primary",
    requiresRemarks: true,
    audit: "respondDeficiency",
    can: (app, role) => role.id === "ngo" && app.status === "DeficiencyRaised",
    next: () => ({ holder: { kind: "chain", division: "pd", grade: "so" }, status: "DeficiencyResponded" }),
    outcome: () => "Response submitted to the Ministry.",
  },
  {
    action: "raiseQuery",
    label: (role, app) =>
      app.status === "DeficiencyProposed"
        ? "Return to the Assistant Section Officer Without Sending"
        : role.division === "finance"
          ? "Return to Previous"
          : "Raise Query",
    intent: "secondary",
    requiresRemarks: true,
    audit: "raiseQuery",
    can: (app, role) => {
      const h = chainHolder(app);
      if (!h || !holds(app, role) || app.status === "QueryRaised") return false;
      // The SO, who may not otherwise query, can send a noted deficiency back to the ASO unsent.
      return role.caps.includes("raiseQuery") || (app.status === "DeficiencyProposed" && role.caps.includes("communicateDeficiency"));
    },
    next: (app) => {
      const h = chainHolder(app)!;
      const prev = prevGrade(h.grade) ?? "aso";
      return { holder: { kind: "chain", division: h.division, grade: prev }, status: "QueryRaised" };
    },
    outcome: ({ app, after }) =>
      app.status === "DeficiencyProposed"
        ? `Deficiency returned to ${seatName(after.holder)} without sending.`
        : `File returned to ${seatName(after.holder)} with your query.`,
  },
  {
    action: "resolveQuery",
    label: () => "Resolve Query and Send Back",
    intent: "primary",
    requiresRemarks: true,
    audit: "resolveQuery",
    can: (app, role) => !!chainHolder(app) && holds(app, role) && app.status === "QueryRaised",
    next: (app) => {
      const h = chainHolder(app)!;
      const nxt = nextGrade(h.grade);
      return nxt
        ? { holder: { kind: "chain", division: h.division, grade: nxt }, status: "UnderReview" }
        : { holder: { kind: "pd" }, status: "WithPD" };
    },
    outcome: ({ after }) => `Query resolved. File sent to ${seatName(after.holder)}.`,
  },
  {
    action: "reject",
    label: () => "Reject",
    intent: "danger",
    requiresRemarks: true,
    audit: "reject",
    can: (app, role) => holds(app, role),
    next: () => ({ holder: { kind: "done" }, status: "Rejected" }),
    confirm: (ctx) => ({
      title: "Reject This Application?",
      summary: `The application from ${ctx.ngoName} for ${ctx.project} will be closed as rejected. This cannot be undone from this screen.`,
      facts: [...fileFacts(ctx), { term: "Grant Sought", value: rupees(ctx.app.total) }, remarksFact(ctx, "Reason for Rejection")],
      confirmLabel: "Reject Application",
      tone: "danger",
    }),
    outcome: ({ ngoName }) => `Application from ${ngoName} rejected.`,
  },
];

/**
 * May this officer change the document verdicts? Only while the file is with them, and — once the
 * ASO has certified that the documents were examined — only at ASO grade. The Programme Director,
 * sanctioning a file the ASO certified and Finance concurred, was handed twenty editable verdicts
 * and told to "give a reason for every document marked" (UX audit UX-11, 14 Sep 2026).
 */
export function canEditDocVerdicts(app: GrantApplication, role: RoleDef): boolean {
  if (app.holder.kind === "done" || !holds(app, role)) return false;
  return role.grade === "aso" || !app.certifiedAt;
}

/**
 * The required documents the certifying officer has neither opened nor given a verdict on. The
 * certification says the documents "have been examined"; it stays unavailable until this is empty
 * (UX audit UX-02 — no document could be opened from the review screen at all).
 */
export function unexaminedRequiredDocs(app: Pick<GrantApplication, "documents">, opened: ReadonlySet<string>) {
  return app.documents.filter((d) => !d.optional && d.reviewStatus === "Pending" && !opened.has(d.id));
}

/** Who examined the verdicts and when, for an officer who may only read them. */
export function verdictAttribution(app: Pick<GrantApplication, "certifiedAt" | "certifiedBy">): string | null {
  if (!app.certifiedAt) return null;
  const by = app.certifiedBy ? ROLES[app.certifiedBy] : undefined;
  const who = by ? `${by.personName}, ${by.grade ? GRADE_FULL[by.grade] : by.label}` : "the Assistant Section Officer";
  return `Examined and certified by ${who}, on ${formatDate(app.certifiedAt)}.`;
}

/**
 * Who gave one document's verdict and when, as the read-only view prints it after the verdict:
 * "by the Assistant Section Officer, 12 Sep 2026". Null where it was not recorded — a verdict
 * saved before attribution existed — and the panel then falls back to `verdictAttribution`.
 */
export function docReviewerLine(doc: Pick<MockDoc, "reviewStatus" | "reviewedBy" | "reviewedAt">): string | null {
  if (doc.reviewStatus === "Pending" || !doc.reviewedBy || !doc.reviewedAt) return null;
  const role = ROLES[doc.reviewedBy];
  if (!role) return null;
  const who = role.grade
    ? `the ${GRADE_FULL[role.grade]}${role.division === "finance" ? ", Integrated Finance Division" : ""}`
    : `the ${role.label}`;
  return `by ${who}, ${formatDate(doc.reviewedAt)}`;
}

/** Every action this role may fire against this application right now. May legitimately be []. */
export function permittedActions(app: GrantApplication, role: RoleDef): Rule[] {
  if (app.holder.kind === "done") return [];
  return RULES.filter((r) => r.can(app, role));
}

export type ActResult =
  | { ok: true; app: GrantApplication }
  | { ok: false; error: string };

/**
 * Apply an action. Returns a NEW application object; never mutates.
 * Validation failures come back as `{ok:false}` for the UI to toast rather than throwing,
 * because a disabled-button race is a user event, not a bug.
 */
export function applyAction(
  app: GrantApplication,
  roleId: RoleId,
  action: WorkflowAction,
  payload: ActionPayload,
  clock: Clock,
): ActResult {
  const role = ROLES[roleId];
  const rule = RULES.find((r) => r.action === action);
  if (!rule) return { ok: false, error: `Unknown action: ${action}` };
  if (!rule.can(app, role)) {
    return {
      ok: false,
      error: `${role.label} cannot ${rule.label(role, app).toLowerCase()} on this application right now.`,
    };
  }
  if (rule.requiresRemarks && !payload.remarks?.trim()) {
    return { ok: false, error: "Remarks are required for this action." };
  }
  if (action === "raiseDeficiency") {
    const items = payload.items ?? [];
    if (items.length === 0) {
      return { ok: false, error: "Mark the documents that need correction, or write what the NGO must clarify." };
    }
    const unexplained = items.find((it) => !it.remark.trim());
    if (unexplained) return { ok: false, error: `Give the reason for "${unexplained.label}", so the NGO knows what to correct.` };
  }
  if (rule.requiresCertification && !payload.certified) {
    return { ok: false, error: "You must certify the application before forwarding it." };
  }

  const from = app.holder;
  const { holder, status } = rule.next(app, role, payload);

  const entry: AuditEntry = {
    id: clock.id("aud"),
    at: clock.now,
    byRole: roleId,
    byName: role.personName,
    action: rule.audit,
    from,
    to: holder,
    remarks: payload.remarks?.trim() || undefined,
  };

  const next: GrantApplication = {
    ...app,
    holder,
    status,
    updatedAt: clock.now,
    ageingDays: 0,
    audit: [...app.audit, entry],
  };

  if (action === "submit") next.submittedAt = clock.now;

  if (action === "certify") {
    next.certifiedAt = clock.now;
    next.certifiedBy = roleId;
  }

  if (action === "raiseDeficiency") {
    next.deficiencies = [
      ...app.deficiencies,
      {
        id: clock.id("def"),
        raisedBy: roleId,
        raisedAt: clock.now,
        detail: payload.remarks!.trim(),
        reopenedFields: payload.reopenedFields ?? [],
        items: (payload.items ?? []).map((it) => ({ ...it, id: clock.id("dfi") })),
      },
    ];
  }

  if (action === "communicateDeficiency") {
    const target = proposedDeficiency(app);
    next.deficiencies = app.deficiencies.map((d) =>
      d === target ? { ...d, message: payload.remarks!.trim(), communicatedAt: clock.now, communicatedBy: roleId } : d,
    );
  }

  // The SO sends a noted deficiency back to the ASO unsent: it is withdrawn, not left dangling.
  if (action === "raiseQuery" && app.status === "DeficiencyProposed") {
    const target = proposedDeficiency(app);
    next.deficiencies = app.deficiencies.map((d) => (d === target ? { ...d, withdrawnAt: clock.now } : d));
  }

  if (action === "respondDeficiency") {
    next.deficiencies = app.deficiencies.map((d) =>
      d.respondedAt ? d : { ...d, respondedAt: clock.now, response: payload.remarks!.trim() },
    );
  }

  if (action === "raiseQuery" && app.holder.kind === "chain") {
    next.queries = [
      ...app.queries,
      {
        id: clock.id("qry"),
        raisedBy: roleId,
        raisedAt: clock.now,
        detail: payload.remarks!.trim(),
        returnedTo: (holder.kind === "chain" ? holder.grade : "aso") as Grade,
      },
    ];
  }

  if (action === "resolveQuery") {
    next.queries = app.queries.map((q) => (q.resolvedAt ? q : { ...q, resolvedAt: clock.now }));
  }

  if (action === "sanction") {
    const recurring = payload.sanction?.recurring ?? app.recurring;
    const nonRecurring = payload.sanction?.nonRecurring ?? app.nonRecurring;
    next.sanction = {
      orderNo: sanctionOrderNo(app, clock.id("ord")),
      sanctionedAt: clock.now,
      recurring,
      nonRecurring,
      total: recurring + nonRecurring,
      sanctionedBy: roleId,
    };
  }

  return { ok: true, app: next };
}

/**
 * The sanction order number, as it is printed on the register: `SAN/<FY>/<serial>`.
 *
 * It used to be the clock's raw id (`ord-01110`), which is an internal key and read as one on
 * the Sanctioned register and the payment screen. The serial is the id's trailing digits, so
 * the seed stays deterministic and a live sanction still gets a unique number.
 */
export function sanctionOrderNo(app: Pick<GrantApplication, "financialYear">, rawId: string): string {
  const serial = rawId.match(/(\d+)$/)?.[1] ?? rawId;
  return `SAN/${app.financialYear}/${serial.padStart(5, "0")}`;
}

/**
 * Plain wording for every application status — the ONE place a stored status becomes words.
 *
 * The officer worklist's status column (`officerStatus` in applicant.ts) groups some of these
 * for filtering; where the two overlap they use the same words, so a badge on the review screen
 * and the row that led to it do not disagree.
 */
export const STATUS_LABEL: Record<AppStatus, string> = {
  Draft: "Draft",
  Submitted: "New Submission",
  UnderReview: "Under Examination",
  QueryRaised: "Returned for Rework",
  DeficiencyProposed: "Deficiency to Send",
  DeficiencyRaised: "Deficiency Raised",
  DeficiencyResponded: "Resubmitted after Deficiency",
  WithFinance: "Under Financial Examination",
  FinanceConcurred: "Concurred by Finance",
  WithPD: "Awaiting Sanction",
  Returned: "Returned for Rework",
  Sanctioned: "Sanctioned",
  Released: "Grant Released",
  Rejected: "Rejected",
};

/**
 * Who holds the file, in words: "With the Section Officer", "With the Under Secretary, Integrated
 * Finance", "With the Programme Director". Grade titles are spelled out, as the action buttons
 * are — "With US" read as the word "us" (UX audit UX-18).
 */
export function holderLabel(holder: Holder): string {
  if (holder.kind === "chain") {
    return `With the ${GRADE_FULL[holder.grade]}${holder.division === "finance" ? ", Integrated Finance" : ""}`;
  }
  if (holder.kind === "pd") return "With the Programme Director";
  if (holder.kind === "ngo") return "With the NGO";
  return "";
}

/**
 * Compound status label. The live portal renders status plus the seat holding the file
 * (`Submitted / ASO`); this keeps the pairing but in words — `New Submission · With the Assistant Section Officer` — because
 * the stored enum (`UnderReview`, `FinanceConcurred`) was reaching officers verbatim.
 */
export function statusLabel(app: Pick<GrantApplication, "status" | "holder">): string {
  const where = holderLabel(app.holder);
  return where ? `${STATUS_LABEL[app.status]} · ${where}` : STATUS_LABEL[app.status];
}

/** Plain wording for every audit-trail action. The stored key (`communicateDeficiency`) is never shown. */
export const ACTION_LABEL: Record<AuditAction, string> = {
  submit: "Application Submitted",
  certify: "Certification Recorded",
  forward: "Forwarded",
  raiseQuery: "Query Raised",
  resolveQuery: "Query Resolved",
  raiseDeficiency: "Deficiency Noted",
  communicateDeficiency: "Deficiency Sent to NGO",
  respondDeficiency: "Deficiency Response Submitted",
  concur: "Financial Concurrence Recorded",
  sanction: "Sanctioned",
  reject: "Rejected",
  return: "Returned for Rework",
  routeDown: "Returned to Previous Level",
  inspectionScheduled: "Inspection Scheduled",
  inspectionSubmitted: "Inspection Report Submitted",
  inspectionReviewed: "Inspection Report Reviewed",
};

export function auditActionLabel(action: AuditAction): string {
  return ACTION_LABEL[action];
}
