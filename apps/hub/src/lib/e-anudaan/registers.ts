/**
 * The officer registers the parity inventory found missing or dead-ended (16 Sep 2026): the
 * Application Explorer's filters, the Returned register, the query log, the Programme Director's
 * Sent files, the inspection-report repository and the PMU's worklists.
 *
 * Pure functions over the store's state. Each screen and each figure on it reads one of these, so
 * a tile and the rows beneath it cannot disagree (data-state-completeness §2).
 */

import { buildReturnRows } from "./roster.ts";
import { projectRunningSince } from "./applicant.ts";
import { placeOfProjectId } from "./geography.ts";
import { queriesFor } from "./selectors.ts";
import { ROLES } from "./roles.ts";
import { holderIsRole } from "./types.ts";
import { auditActionLabel, seatName } from "./workflow.ts";
import { DIVISION_NAME, PROGRAMME_DIRECTOR } from "./glossary.ts";
import type {
  AppStatus,
  AuditAction,
  AuditEntry,
  EAnudaanState,
  GrantApplication,
  Inspection,
  Institution,
  NgoProfile,
  Query,
  RoleId,
} from "./types.ts";

const DAY = 86_400_000;

/* ── what an officer list may hold ────────────────────────────────────────── */

/**
 * Every application an officer may see. A draft is the NGO's own work on its own device and has
 * not reached the Ministry: All Applications listed 17 drafts no officer could act on (verify
 * bug 11, 16 Sep 2026).
 */
export function officerApplications(state: EAnudaanState): GrantApplication[] {
  return state.applications.filter((a) => a.status !== "Draft");
}

/** The project an application is filed under, from the register. */
export function institutionOf(state: EAnudaanState, app: Pick<GrantApplication, "institutionId">): Institution | undefined {
  return state.ngos.flatMap((n) => n.institutions).find((i) => i.id === app.institutionId);
}

/** The State and district a file belongs to: the project's own record, else what its Project ID names. */
export function placeOf(state: EAnudaanState, app: Pick<GrantApplication, "institutionId">): { state: string; district: string } | undefined {
  const inst = institutionOf(state, app);
  if (inst) return { state: inst.state, district: inst.district };
  return placeOfProjectId(app.institutionId);
}

/* ── All Applications ─────────────────────────────────────────────────────── */

export type ExplorerStatus = "mine" | "progress" | "sanctioned" | "returned" | "deficiency" | "corrected" | "rejected" | "all";

/**
 * The live explorer's Status filter, in its order. "Needs My Action" is the default.
 *
 * `deficiency` and `corrected` are the two register-wide rows of the officer dashboard's
 * "Deficiencies and Returns" card. Each of those figures opens All Applications on this filter, so
 * the figure and the list it opens are one expression (audit O-03, 16 Sep 2026). Neither is one of
 * the four tiles' groups: a deficiency raised is inside "Returned or Queried", and a corrected
 * file can be at any stage.
 */
export const EXPLORER_STATUS: { value: ExplorerStatus; label: string }[] = [
  { value: "mine", label: "Needs My Action" },
  { value: "progress", label: "In Progress" },
  { value: "sanctioned", label: "Sanctioned" },
  { value: "returned", label: "Returned or Queried" },
  { value: "deficiency", label: "Deficiency Raised" },
  { value: "corrected", label: "Deficiency Resolved" },
  { value: "rejected", label: "Rejected" },
  { value: "all", label: "All Statuses" },
];

const RETURNED: ReadonlySet<AppStatus> = new Set<AppStatus>(["QueryRaised", "Returned", "DeficiencyRaised"]);

/** Which of the explorer's groups a file is in. A file is in exactly one of the four tiles. */
export function explorerGroup(app: GrantApplication): "progress" | "sanctioned" | "returned" | "rejected" {
  if (app.sanction || app.status === "Sanctioned" || app.status === "Released") return "sanctioned";
  if (app.status === "Rejected") return "rejected";
  if (RETURNED.has(app.status)) return "returned";
  return "progress";
}

export function matchesExplorerStatus(app: GrantApplication, status: ExplorerStatus, roleId: RoleId | null): boolean {
  if (status === "all") return true;
  if (status === "mine") return !!roleId && holderIsRole(app.holder, roleId);
  // The dashboard's "Deficiencies Raised" and "Deficiencies Resolved" read these same two tests.
  if (status === "deficiency") return app.status === "DeficiencyRaised";
  if (status === "corrected") return app.deficiencies.some((d) => d.respondedAt);
  return explorerGroup(app) === status;
}

export interface ExplorerTiles {
  total: number;
  progress: number;
  sanctioned: number;
  returned: number;
}

/** The four tiles over the explorer, from the rows the other filters let through. */
export function explorerTiles(rows: GrantApplication[]): ExplorerTiles {
  const t = { total: rows.length, progress: 0, sanctioned: 0, returned: 0 };
  for (const a of rows) {
    const g = explorerGroup(a);
    if (g !== "rejected") t[g] += 1;
  }
  return t;
}

/** The instalment filter's key: "New", or the instalment number an ongoing file claims. */
export function instalmentKey(app: GrantApplication): string {
  return app.caseType === "New" ? "New" : String(app.instalment ?? "");
}

/* ── Returned ─────────────────────────────────────────────────────────────── */

const RETURN_ACTIONS: ReadonlySet<AuditEntry["action"]> = new Set<AuditEntry["action"]>(["raiseQuery", "return", "communicateDeficiency"]);

export interface ReturnedRow {
  app: GrantApplication;
  entry: AuditEntry;
  /** The seat the file went back to, in words: "the Section Officer, Programme Division". */
  returnedTo: string;
  reason: string;
  /** Whether whoever it went back to has answered. */
  responded: boolean;
  respondedAt?: string;
}

/**
 * Files this officer sent BACK — to a lower grade with a query, to the NGO with a deficiency, or
 * (the Programme Director) to the Assistant Section Officer for reconsideration. One row per file,
 * for the latest time this officer returned it.
 *
 * Live calls this "Returned Applications" (`/pd/<grade>/rejected`); ours listed only final
 * rejections under that path, so a returned file had no register at all (inventory §18, §24).
 * Rejections keep their own register.
 */
export function returnedBy(state: EAnudaanState, roleId: RoleId): ReturnedRow[] {
  const rows: ReturnedRow[] = [];
  for (const app of officerApplications(state)) {
    const entry = [...app.audit].reverse().find((e) => e.byRole === roleId && RETURN_ACTIONS.has(e.action));
    if (!entry) continue;
    let responded = false;
    let respondedAt: string | undefined;
    if (entry.action === "raiseQuery") {
      const q = app.queries.find((x) => x.raisedBy === roleId && x.raisedAt === entry.at) ?? [...app.queries].reverse().find((x) => x.raisedBy === roleId);
      respondedAt = q?.resolvedAt;
      responded = !!respondedAt;
    } else if (entry.action === "communicateDeficiency") {
      const d = app.deficiencies.find((x) => x.communicatedBy === roleId && x.communicatedAt === entry.at) ?? [...app.deficiencies].reverse().find((x) => x.communicatedBy === roleId);
      respondedAt = d?.respondedAt;
      responded = !!respondedAt;
    } else {
      // A return for reconsideration is answered when the file leaves the seat it was returned to.
      const after = app.audit.find((e) => e.at > entry.at && e.action === "forward");
      respondedAt = after?.at;
      responded = !!after || app.status !== "Returned";
    }
    rows.push({
      app,
      entry,
      returnedTo: entry.to ? seatName(entry.to) : "",
      reason: entry.remarks ?? "",
      responded,
      respondedAt,
    });
  }
  return rows.sort((a, b) => b.entry.at.localeCompare(a.entry.at));
}

/* ── Queries ─────────────────────────────────────────────────────────────── */

export interface QueryRow {
  id: string;
  app: GrantApplication;
  /** The query as raised — for a Programme Director's return, the return's remarks. */
  query: Query;
  open: boolean;
  /** The file is with this officer, waiting on their answer to the query. */
  canRespond: boolean;
}

function divisionOf(role: RoleId): "pd" | "finance" | null {
  if (role.startsWith("pd-") || role === "programme-director") return "pd";
  if (role.startsWith("finance-")) return "finance";
  return null;
}

/**
 * The query log behind PD Queries and Finance Queries.
 *
 * OPEN rows are exactly the files `queriesFor` returns — the list behind the dashboard's
 * "Returned for Rework" figure — one row each, so the tile and the default view agree. RESPONDED
 * rows are every query this officer raised or was asked that has since been answered.
 */
export function queryRowsFor(state: EAnudaanState, roleId: RoleId): QueryRow[] {
  const role = ROLES[roleId];
  const mineToAnswer = (q: Query) => !!role.grade && q.returnedTo === role.grade && divisionOf(q.raisedBy) === role.division;
  const concerns = (q: Query) => q.raisedBy === roleId || mineToAnswer(q);

  const open: QueryRow[] = queriesFor(state, roleId).map((app) => {
    const q = [...app.queries].reverse().find((x) => !x.resolvedAt && concerns(x));
    const query: Query =
      q ??
      (() => {
        // A Programme Director's return carries no query record; its remarks are the query.
        const e = [...app.audit].reverse().find((x) => x.action === "return");
        return { id: e?.id ?? `${app.id}-return`, raisedBy: e?.byRole ?? "programme-director", raisedAt: e?.at ?? app.updatedAt, detail: e?.remarks ?? "", returnedTo: "aso" };
      })();
    return {
      id: `${app.id}|${query.id}`,
      app,
      query,
      open: true,
      canRespond: app.status === "QueryRaised" && holderIsRole(app.holder, roleId),
    };
  });

  const answered: QueryRow[] = state.applications.flatMap((app) =>
    app.queries
      .filter((q) => q.resolvedAt && concerns(q))
      .map((q) => ({ id: `${app.id}|${q.id}`, app, query: q, open: false, canRespond: false })),
  );

  return [...open, ...answered.sort((a, b) => (b.query.resolvedAt ?? "").localeCompare(a.query.resolvedAt ?? ""))];
}

/* ── Sent (Programme Director) ────────────────────────────────────────────── */

const SENT_ACTIONS: ReadonlySet<AuditEntry["action"]> = new Set<AuditEntry["action"]>(["sanction", "return", "reject", "forward", "concur"]);

export interface SentRow {
  app: GrantApplication;
  entry: AuditEntry;
  place?: { state: string; district: string };
  /** Whole days since it was sent. */
  days: number;
  /** Still with someone: a returned file climbing again. A sanctioned or rejected file is closed. */
  pending: boolean;
}

/** Every file this officer has sent on, with its latest movement. */
export function sentBy(state: EAnudaanState, roleId: RoleId, now: number = Date.now()): SentRow[] {
  return officerApplications(state)
    .map((app): SentRow | null => {
      const entry = [...app.audit].reverse().find((e) => e.byRole === roleId && SENT_ACTIONS.has(e.action));
      if (!entry) return null;
      return {
        app,
        entry,
        place: placeOf(state, app),
        days: Math.max(0, Math.floor((now - Date.parse(entry.at)) / DAY)),
        pending: app.holder.kind !== "done",
      };
    })
    .filter((r): r is SentRow => r !== null)
    .sort((a, b) => b.entry.at.localeCompare(a.entry.at));
}

export interface SentByState {
  state: string;
  sent: number;
  pending: number;
  /** The longest a pending file from this State has waited, in days. */
  oldestPending: number | null;
}

export function sentByState(rows: SentRow[]): SentByState[] {
  const map = new Map<string, SentByState>();
  for (const r of rows) {
    const key = r.place?.state ?? "Not Recorded";
    const s = map.get(key) ?? { state: key, sent: 0, pending: 0, oldestPending: null };
    s.sent += 1;
    if (r.pending) {
      s.pending += 1;
      s.oldestPending = Math.max(s.oldestPending ?? 0, r.days);
    }
    map.set(key, s);
  }
  return [...map.values()].sort((a, b) => b.pending - a.pending || a.state.localeCompare(b.state));
}

/* ── Inspections ──────────────────────────────────────────────────────────── */

export interface ReportRow {
  inspection: Inspection;
  app?: GrantApplication;
  ngo?: NgoProfile;
  place?: { state: string; district: string };
}

/** Every submitted inspection report, grouped by State, newest first within a State. */
export function inspectionReports(state: EAnudaanState): ReportRow[] {
  const apps = new Map(state.applications.map((a) => [a.id, a]));
  const ngos = new Map(state.ngos.map((n) => [n.id, n]));
  return state.inspections
    .filter((i) => i.status === "Submitted" || i.status === "Reviewed")
    .map((inspection) => {
      const app = apps.get(inspection.applicationId);
      return { inspection, app, ngo: ngos.get(inspection.ngoId), place: placeOf(state, { institutionId: inspection.institutionId }) };
    })
    .sort(
      (a, b) =>
        (a.place?.state ?? "").localeCompare(b.place?.state ?? "") ||
        (b.inspection.submittedAt ?? b.inspection.scheduledFor ?? "").localeCompare(a.inspection.submittedAt ?? a.inspection.scheduledFor ?? ""),
    );
}

/**
 * Sanctioned files with no inspection raised yet — the PMU's "Awaiting Inspection". Oldest
 * sanction first: the file that has waited longest for a visit leads.
 */
export function awaitingInspection(state: EAnudaanState): GrantApplication[] {
  const inspected = new Set(state.inspections.map((i) => i.applicationId));
  return state.applications
    .filter((a) => a.sanction && !inspected.has(a.id))
    .sort((a, b) => (a.sanction!.sanctionedAt ?? "").localeCompare(b.sanction!.sanctionedAt ?? ""));
}

/** The PMU officer's visits not yet reported: raised, or scheduled. */
export function openVisits(state: EAnudaanState): Inspection[] {
  return state.inspections.filter((i) => i.status === "Pending" || i.status === "Scheduled");
}

/** A new inspection on a sanctioned file, waiting to be scheduled. */
export function newInspection(app: GrantApplication, id: string): Inspection {
  return { id, applicationId: app.id, ngoId: app.ngoId, institutionId: app.institutionId, status: "Pending", visitType: "Physical" };
}

export interface InstitutionRow {
  institution: Institution;
  ngo: NgoProfile;
  applications: number;
  /** When a report was last filed on this project. */
  lastVisited?: string;
  /** An inspection on this project not yet reported. */
  openVisit?: Inspection;
  /** The file a new inspection would be raised on: the latest sanctioned one. */
  inspectable?: GrantApplication;
}

/** Every project once, never-visited first and then the longest unvisited (live "Institutions"). */
export function institutionRegister(state: EAnudaanState): InstitutionRow[] {
  const files = officerApplications(state);
  return state.ngos
    .flatMap((ngo) =>
      ngo.institutions.map((institution) => {
        const own = files.filter((a) => a.institutionId === institution.id);
        const visits = state.inspections.filter((i) => i.institutionId === institution.id);
        const reported = visits
          .filter((i) => i.status === "Submitted" || i.status === "Reviewed")
          .map((i) => i.submittedAt ?? i.scheduledFor ?? "")
          .filter(Boolean)
          .sort();
        const sanctioned = own.filter((a) => a.sanction).sort((a, b) => a.sanction!.sanctionedAt.localeCompare(b.sanction!.sanctionedAt));
        return {
          institution,
          ngo,
          applications: own.length,
          lastVisited: reported.at(-1),
          openVisit: visits.find((i) => i.status === "Pending" || i.status === "Scheduled"),
          inspectable: sanctioned.at(-1),
        } satisfies InstitutionRow;
      }),
    )
    .sort((a, b) => {
      if (!a.lastVisited !== !b.lastVisited) return a.lastVisited ? 1 : -1;
      return (a.lastVisited ?? "").localeCompare(b.lastVisited ?? "") || a.institution.id.localeCompare(b.institution.id);
    });
}

/* ── Attendance, for the NGO Directory ────────────────────────────────────── */

export interface AttendanceSummary {
  /** Average attendance in the latest month each running project filed a return. */
  percent: number | null;
  /** Running projects with at least one past month's return not filed. */
  missed: number;
  /** Projects that owe returns at all. */
  running: number;
}

/**
 * An organisation's attendance, from the same monthly returns its own Attendance page shows
 * (`buildReturnRows`), so the Directory and the NGO's screen give one answer. A project owes
 * returns once sanctioned; strength is its roll where one is kept on the portal, and otherwise
 * the beneficiaries its latest sanctioned file was granted for.
 */
export function attendanceOf(state: EAnudaanState, ngo: NgoProfile, now: Date = new Date()): AttendanceSummary {
  let sum = 0;
  let counted = 0;
  let missed = 0;
  let running = 0;
  for (const inst of ngo.institutions) {
    const since = projectRunningSince(state, inst.id);
    if (since === null) continue;
    const roll = state.beneficiaries.filter((b) => b.projectId === inst.id && b.active).length;
    const latest = state.applications.filter((a) => a.institutionId === inst.id && a.sanction).at(-1);
    const strength = roll || latest?.totalBeneficiaries || 0;
    if (!strength) continue;
    const rows = buildReturnRows(now, strength, since);
    if (rows.length === 0) continue;
    running += 1;
    if (rows.some((r) => r.status === "Not Submitted")) missed += 1;
    const filed = rows.find((r) => r.status === "Submitted");
    if (filed?.percent != null) {
      sum += filed.percent;
      counted += 1;
    }
  }
  return { percent: counted ? Math.round((sum / counted) * 10) / 10 : null, missed, running };
}

/* ── Utilisation certificates ─────────────────────────────────────────────── */

/** The financial year before the one running on `now`: "2025-26" in September 2026. */
function previousFinancialYear(now: Date): string {
  const y = (now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1) - 1;
  return `${y}-${String((y + 1) % 100).padStart(2, "0")}`;
}

/**
 * Sanctioned files a utilisation certificate is due on: the latest sanction on each project whose
 * financial year closed within the last twelve months, not yet certified. GFR 12-A asks for the
 * certificate within twelve months of the close of the year the grant was released for.
 */
/**
 * When that certificate is due: **31 March of the year after the one the grant's financial year
 * closed in** — GFR 12-A's twelve months from the close of the year the grant was released for,
 * the same rule `ucDue` selects on. FY 2025-26 closes 31 March 2026, so its certificate is due
 * 31 March 2027.
 *
 * A calendar date, not an instant: it is that date in every time zone.
 */
export function ucDueBy(app: Pick<GrantApplication, "financialYear">): string {
  const start = Number(app.financialYear.slice(0, 4));
  return Number.isFinite(start) ? `${start + 2}-03-31` : "";
}

export function ucDue(state: EAnudaanState, ngoId: string, now: Date = new Date()): GrantApplication[] {
  const fy = previousFinancialYear(now);
  const latest = new Map<string, GrantApplication>();
  for (const a of state.applications) {
    if (a.ngoId !== ngoId || !a.sanction) continue;
    const prev = latest.get(a.institutionId);
    if (!prev || prev.sanction!.sanctionedAt < a.sanction.sanctionedAt) latest.set(a.institutionId, a);
  }
  return [...latest.values()].filter((a) => a.financialYear === fy && !a.utilisation).sort((a, b) => a.id.localeCompare(b.id));
}

/* ── Audit Trail ──────────────────────────────────────────────────────────── */

/**
 * One recorded action on one file, as the Audit Trail lists it.
 *
 * Design-director audit A-01 (16 Sep 2026): 1,280 rows with no search, filter, date range or
 * export, so an auditor could not find one file's trail — the only reason the page exists. The
 * rows, the filters and the CSV all read these functions, so the file and the screen agree.
 */
export interface AuditTrailRow {
  id: string;
  /** ISO instant. */
  at: string;
  /** The date the action was taken, in India Standard Time (`yyyy-mm-dd`) — what a date range compares. */
  day: string;
  application: string;
  project: string;
  ngoId: string;
  ngo: string;
  roleId: RoleId;
  role: string;
  /** The office the seat belongs to — a division, the Programme Director, the PMU or the NGO. */
  office: string;
  user: string;
  actionKey: AuditAction;
  action: string;
  remarks: string;
}

export interface AuditTrailFilters {
  /** Free text: application number, project ID, NGO name, officer's name or remarks. */
  q: string;
  /** An office from `auditOffices`, or "" for every office. */
  office: string;
  /** A role id, or "" for every seat. */
  role: string;
  /** An action key, or "" for every action. */
  action: string;
  /** Inclusive date range, `yyyy-mm-dd`, either end may be "". */
  from: string;
  to: string;
}

export const NO_AUDIT_FILTERS: AuditTrailFilters = { q: "", office: "", role: "", action: "", from: "", to: "" };

const IST_OFFSET_MS = 330 * 60_000;

/** The calendar date of an instant in India Standard Time — the date `formatDate` prints for it. */
export function istDay(at: string): string {
  const t = Date.parse(at);
  return Number.isNaN(t) ? "" : new Date(t + IST_OFFSET_MS).toISOString().slice(0, 10);
}

/** "Programme Division", "Integrated Finance Division", "Programme Director", "PMU", "NGO". */
export function auditOfficeOf(roleId: RoleId): string {
  const role = ROLES[roleId];
  if (!role) return "";
  if (role.division) return DIVISION_NAME[role.division];
  if (roleId === "programme-director") return PROGRAMME_DIRECTOR;
  if (roleId === "pmu-field") return "PMU";
  return "NGO";
}

/** The order offices are offered in a filter: the chain as a file climbs it. */
export const AUDIT_OFFICES: readonly string[] = ["NGO", DIVISION_NAME.pd, DIVISION_NAME.finance, PROGRAMME_DIRECTOR, "PMU"];

/** Every recorded action on every file, newest first. */
export function auditTrail(state: EAnudaanState): AuditTrailRow[] {
  const ngoName = new Map(state.ngos.map((n) => [n.id, n.name]));
  return state.applications
    .flatMap((a) =>
      a.audit.map(
        (e): AuditTrailRow => ({
          id: e.id,
          at: e.at,
          day: istDay(e.at),
          application: a.id,
          project: a.institutionId,
          ngoId: a.ngoId,
          ngo: ngoName.get(a.ngoId) ?? "",
          roleId: e.byRole,
          role: ROLES[e.byRole]?.label ?? e.byRole,
          office: auditOfficeOf(e.byRole),
          user: e.byName,
          actionKey: e.action,
          action: auditActionLabel(e.action),
          remarks: e.remarks ?? "",
        }),
      ),
    )
    .sort((x, y) => y.at.localeCompare(x.at) || x.id.localeCompare(y.id));
}

/** How many of the filters are set — drives the "filtered to nothing" state. */
export function activeAuditFilterCount(f: AuditTrailFilters): number {
  const range = f.from || f.to ? 1 : 0;
  return (f.q.trim() ? 1 : 0) + (f.office ? 1 : 0) + (f.role ? 1 : 0) + (f.action ? 1 : 0) + range;
}

/**
 * The rows the filters let through. One expression, used by the table, the count line and the
 * download alike. A range whose ends are reversed is read the right way round rather than
 * silently matching nothing.
 */
export function filterAuditTrail(rows: readonly AuditTrailRow[], f: AuditTrailFilters): AuditTrailRow[] {
  const needle = f.q.trim().toLowerCase();
  const [from, to] = f.from && f.to && f.from > f.to ? [f.to, f.from] : [f.from, f.to];
  return rows.filter(
    (r) =>
      (!f.office || r.office === f.office) &&
      (!f.role || r.roleId === f.role) &&
      (!f.action || r.actionKey === f.action) &&
      (!from || r.day >= from) &&
      (!to || r.day <= to) &&
      (!needle || `${r.application} ${r.project} ${r.ngo} ${r.user} ${r.remarks}`.toLowerCase().includes(needle)),
  );
}

/** The seats and actions that actually occur, for the filter menus — never an option that matches nothing. */
export function auditFilterOptions(rows: readonly AuditTrailRow[], office = ""): {
  roles: { value: RoleId; label: string }[];
  actions: { value: AuditAction; label: string }[];
} {
  const roles = new Map<RoleId, string>();
  const actions = new Map<AuditAction, string>();
  for (const r of rows) {
    if (!office || r.office === office) roles.set(r.roleId, r.role);
    actions.set(r.actionKey, r.action);
  }
  return {
    roles: [...roles].map(([value, label]) => ({ value, label })).sort((a, b) => a.label.localeCompare(b.label)),
    actions: [...actions].map(([value, label]) => ({ value, label })).sort((a, b) => a.label.localeCompare(b.label)),
  };
}
