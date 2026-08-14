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
 * Side loops: ASO raises a deficiency to SO, SO communicates it to the NGO, the NGO responds
 * and it re-enters at SO. US and DS raise a *query* instead, which pushes the file one grade
 * down and climbs back when resolved. [BRD §5.2–5.3]
 */

import { ROLES, type RoleDef } from "./roles.ts";
import {
  holderIsRole,
  nextGrade,
  prevGrade,
  type AppStatus,
  type AuditAction,
  type AuditEntry,
  type GrantApplication,
  type Grade,
  type Holder,
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
}

/** Injected so the seeder can replay deterministically and the UI can use the real clock. */
export interface Clock {
  now: string;
  id: (prefix: string) => string;
}

export interface Rule {
  action: WorkflowAction;
  /**
   * Button copy. A function, not a string, because the live portal names the destination:
   * PD:ASO reads "Certify & Forward to SO" while IFD:ASO reads "Forward to IFD-SO".
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
}

/** The role holds the file and is allowed to review at all. */
function holds(app: GrantApplication, role: RoleDef): boolean {
  return holderIsRole(app.holder, role.id) && role.caps.includes("review");
}

function chainHolder(app: GrantApplication): { division: "pd" | "finance"; grade: Grade } | null {
  return app.holder.kind === "chain" ? { division: app.holder.division, grade: app.holder.grade } : null;
}

/**
 * Forward-button copy, matching the live screens: PD:ASO reads "Certify & Forward to SO"
 * (its certification gate is part of the same button), IFD grades name the IFD destination.
 */
function forwardLabel(role: RoleDef): string {
  const nxt = role.grade ? nextGrade(role.grade) : null;
  if (!nxt) return role.division === "pd" ? "Forward to Integrated Finance" : "Forward";
  const dest = role.division === "finance" ? `IFD-${nxt.toUpperCase()}` : nxt.toUpperCase();
  const prefix = role.caps.includes("certify") ? "Certify & " : "";
  return `${prefix}Forward to ${dest}`;
}

export const RULES: readonly Rule[] = [
  {
    action: "submit",
    label: () => "Submit application",
    intent: "primary",
    requiresRemarks: false,
    audit: "submit",
    can: (app, role) => role.id === "ngo" && app.status === "Draft",
    next: () => ({ holder: { kind: "chain", division: "pd", grade: "aso" }, status: "Submitted" }),
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
  },
  {
    action: "concur",
    label: () => "Record financial concurrence",
    intent: "primary",
    requiresRemarks: true,
    audit: "concur",
    can: (app, role) => {
      const h = chainHolder(app);
      return !!h && h.division === "finance" && h.grade === "js" && holds(app, role) && role.caps.includes("concur");
    },
    next: () => ({ holder: { kind: "pd" }, status: "FinanceConcurred" }),
  },
  {
    action: "sanction",
    label: () => "Sanction",
    intent: "primary",
    requiresRemarks: true,
    audit: "sanction",
    can: (app, role) => app.holder.kind === "pd" && role.caps.includes("sanction"),
    next: () => ({ holder: { kind: "done" }, status: "Sanctioned" }),
  },
  {
    action: "return",
    label: () => "Return for reconsideration",
    intent: "danger",
    requiresRemarks: true,
    audit: "return",
    can: (app, role) => app.holder.kind === "pd" && role.caps.includes("sanction"),
    // Returns to the bottom of the PD chain and re-climbs the whole way. [BRD §5.2]
    next: () => ({ holder: { kind: "chain", division: "pd", grade: "aso" }, status: "Returned" }),
  },
  {
    action: "raiseDeficiency",
    label: () => "Raise deficiency",
    intent: "secondary",
    requiresRemarks: true,
    audit: "raiseDeficiency",
    can: (app, role) => holds(app, role) && role.caps.includes("raiseDeficiency"),
    // Routes to the SO, who is the only grade that may communicate it onward to the NGO.
    next: () => ({ holder: { kind: "chain", division: "pd", grade: "so" }, status: "UnderReview" }),
  },
  {
    action: "communicateDeficiency",
    label: () => "Communicate deficiency to NGO",
    intent: "secondary",
    requiresRemarks: true,
    audit: "communicateDeficiency",
    can: (app, role) =>
      holds(app, role) && role.caps.includes("communicateDeficiency") && app.deficiencies.some((d) => !d.respondedAt),
    next: () => ({ holder: { kind: "ngo" }, status: "DeficiencyRaised" }),
  },
  {
    action: "respondDeficiency",
    label: () => "Submit response",
    intent: "primary",
    requiresRemarks: true,
    audit: "respondDeficiency",
    can: (app, role) => role.id === "ngo" && app.status === "DeficiencyRaised",
    next: () => ({ holder: { kind: "chain", division: "pd", grade: "so" }, status: "DeficiencyResponded" }),
  },
  {
    action: "raiseQuery",
    label: (role) => (role.division === "finance" ? "Return to Previous" : "Raise query"),
    intent: "secondary",
    requiresRemarks: true,
    audit: "raiseQuery",
    can: (app, role) => {
      const h = chainHolder(app);
      return !!h && holds(app, role) && role.caps.includes("raiseQuery") && app.status !== "QueryRaised";
    },
    next: (app) => {
      const h = chainHolder(app)!;
      const prev = prevGrade(h.grade) ?? "aso";
      return { holder: { kind: "chain", division: h.division, grade: prev }, status: "QueryRaised" };
    },
  },
  {
    action: "resolveQuery",
    label: () => "Resolve query and send back",
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
  },
  {
    action: "reject",
    label: () => "Reject",
    intent: "danger",
    requiresRemarks: true,
    audit: "reject",
    can: (app, role) => holds(app, role),
    next: () => ({ holder: { kind: "done" }, status: "Rejected" }),
  },
];

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
      },
    ];
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
      orderNo: clock.id("ord"),
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
 * Compound status label — the live portal renders `Submitted / ASO`, i.e. status plus the
 * grade currently holding the file, not a single stored string.
 */
export function statusLabel(app: GrantApplication): string {
  const h = app.holder;
  if (h.kind === "chain") {
    const suffix = h.division === "finance" ? `IFD-${h.grade.toUpperCase()}` : h.grade.toUpperCase();
    return `${app.status} / ${suffix}`;
  }
  if (h.kind === "pd") return `${app.status} / PD`;
  if (h.kind === "ngo") return `${app.status} / NGO`;
  return app.status;
}
