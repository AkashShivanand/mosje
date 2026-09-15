/**
 * Reports & Analytics — the nine reports the live portal offers, over the store's register.
 *
 * Live (`*-DASHBOARD-SM2-REPORTS`) lists nine reports with a Scheme / Financial Year / NGO filter
 * and PDF · Excel · CSV export; ours was one applications table with no controls (inventory §34).
 * The live requirement codes shown beside each name ("RP-SM2-01") are not reproduced.
 *
 * Each report is data: columns and a row builder. The page renders any of them the same way and
 * the CSV is written from the same rows, so the file and the screen cannot differ.
 */

import { ROLES } from "./roles.ts";
import { buildReturnRows } from "./roster.ts";
import { projectRunningSince } from "./applicant.ts";
import { schemeLabel } from "./selectors.ts";
import { auditActionLabel, holderLabel, statusLabel } from "./workflow.ts";
import { INSPECTION_STATUS_LABEL } from "./officer.ts";
import { explorerGroup, officerApplications, placeOf } from "./registers.ts";
import { formatDate, formatDateTime, formatMonthYear } from "./format.ts";
import type { EAnudaanState, GrantApplication } from "./types.ts";

export type CellKind = "text" | "number" | "money" | "date" | "datetime" | "reference";

export interface ReportColumn {
  key: string;
  header: string;
  kind?: CellKind;
}

export type ReportCell = string | number | null;
export type ReportRow = { id: string } & Record<string, ReportCell>;

export interface ReportFilters {
  /** Scheme code, or "" for every scheme. */
  scheme: string;
  /** Financial year, or "" for every year. */
  fy: string;
  /** Free text matched against the NGO's name, NGO-Darpan ID and registration number. */
  ngo: string;
}

export interface ReportDef {
  id: string;
  title: string;
  /** One sentence: what each row is. */
  description: string;
  columns: ReportColumn[];
  rows: (state: EAnudaanState, f: ReportFilters, now: Date) => ReportRow[];
}

const DAY = 86_400_000;

function ngoMatcher(state: EAnudaanState, text: string): (ngoId: string) => boolean {
  const q = text.trim().toLowerCase();
  if (!q) return () => true;
  const ok = new Set(
    state.ngos
      .filter((n) => `${n.name} ${n.darpanId} ${n.registrationNo}`.toLowerCase().includes(q))
      .map((n) => n.id),
  );
  return (id) => ok.has(id);
}

/** The submitted files the filters let through. Drafts never reach a report. */
function files(state: EAnudaanState, f: ReportFilters): GrantApplication[] {
  const ngoOk = ngoMatcher(state, f.ngo);
  return officerApplications(state).filter(
    (a) => (!f.scheme || a.schemeCode === f.scheme) && (!f.fy || a.financialYear === f.fy) && ngoOk(a.ngoId),
  );
}

const ngoName = (state: EAnudaanState, id: string) => state.ngos.find((n) => n.id === id)?.name ?? "";

export const REPORTS: readonly ReportDef[] = [
  {
    id: "ngo-applications",
    title: "NGO-wise Applications",
    description: "Each organisation's applications, by where they stand, with the amounts sought and sanctioned.",
    columns: [
      { key: "ngo", header: "NGO" },
      { key: "state", header: "State" },
      { key: "applications", header: "Applications", kind: "number" },
      { key: "progress", header: "In Progress", kind: "number" },
      { key: "sanctioned", header: "Sanctioned", kind: "number" },
      { key: "rejected", header: "Rejected", kind: "number" },
      { key: "sought", header: "Amount Sought", kind: "money" },
      { key: "sanctionedAmount", header: "Amount Sanctioned", kind: "money" },
    ],
    rows: (state, f) => {
      const list = files(state, f);
      return state.ngos
        .map((n) => {
          const own = list.filter((a) => a.ngoId === n.id);
          return {
            id: n.id,
            ngo: n.name,
            state: n.state,
            applications: own.length,
            progress: own.filter((a) => ["progress", "returned"].includes(explorerGroup(a))).length,
            sanctioned: own.filter((a) => explorerGroup(a) === "sanctioned").length,
            rejected: own.filter((a) => explorerGroup(a) === "rejected").length,
            sought: own.reduce((s, a) => s + a.total, 0),
            sanctionedAmount: own.reduce((s, a) => s + (a.sanction?.total ?? 0), 0),
          };
        })
        .filter((r) => r.applications > 0)
        .sort((a, b) => b.applications - a.applications || a.ngo.localeCompare(b.ngo));
    },
  },
  {
    id: "beneficiaries",
    title: "Beneficiary Summary",
    description: "Beneficiaries under sanctioned grants, by scheme and State, as stated in the applications.",
    columns: [
      { key: "scheme", header: "Scheme" },
      { key: "state", header: "State" },
      { key: "grants", header: "Sanctioned Grants", kind: "number" },
      { key: "sc", header: "SC Beneficiaries", kind: "number" },
      { key: "other", header: "Other Beneficiaries", kind: "number" },
      { key: "total", header: "Total Beneficiaries", kind: "number" },
    ],
    rows: (state, f) => {
      const map = new Map<string, ReportRow & { grants: number; sc: number; other: number; total: number }>();
      for (const a of files(state, f).filter((x) => x.sanction)) {
        const st = placeOf(state, a)?.state ?? "Not Recorded";
        const key = `${a.schemeCode}|${st}`;
        const r = map.get(key) ?? { id: key, scheme: schemeLabel(a.schemeCode), state: st, grants: 0, sc: 0, other: 0, total: 0 };
        r.grants += 1;
        r.sc += a.scBeneficiaries;
        r.other += a.otherBeneficiaries;
        r.total += a.totalBeneficiaries;
        map.set(key, r);
      }
      return [...map.values()].sort((a, b) => String(a.scheme).localeCompare(String(b.scheme)) || String(a.state).localeCompare(String(b.state)));
    },
  },
  {
    id: "pending-by-role",
    title: "Pending Cases by Role",
    description: "Files waiting with each seat in the approval chain, and how long they have waited.",
    columns: [
      { key: "seat", header: "With" },
      { key: "pending", header: "Pending", kind: "number" },
      { key: "overdue", header: "Over 7 Days", kind: "number" },
      { key: "oldest", header: "Longest Wait (Days)", kind: "number" },
    ],
    rows: (state, f) => {
      const map = new Map<string, { id: string; seat: string; pending: number; overdue: number; oldest: number; order: number }>();
      const order = (a: GrantApplication) =>
        a.holder.kind === "chain" ? (a.holder.division === "pd" ? 0 : 10) + ["aso", "so", "us", "ds", "js"].indexOf(a.holder.grade) : a.holder.kind === "pd" ? 20 : 30;
      for (const a of files(state, f)) {
        if (a.holder.kind === "done") continue;
        const seat = holderLabel(a.holder).replace(/^With /, "") || "Not Recorded";
        const r = map.get(seat) ?? { id: seat, seat: seat.charAt(0).toUpperCase() + seat.slice(1), pending: 0, overdue: 0, oldest: 0, order: order(a) };
        r.pending += 1;
        if (a.ageingDays > 7) r.overdue += 1;
        r.oldest = Math.max(r.oldest, a.ageingDays);
        map.set(seat, r);
      }
      return [...map.values()].sort((a, b) => a.order - b.order).map(({ order, ...r }) => {
        void order; // sort key only; not a report column
        return r;
      });
    },
  },
  {
    id: "inspection-status",
    title: "Inspection Status",
    description: "Every inspection raised on a file, with its state and recommendation.",
    columns: [
      { key: "project", header: "Project ID", kind: "reference" },
      { key: "ngo", header: "NGO" },
      { key: "state", header: "State" },
      { key: "visit", header: "Visit Type" },
      { key: "status", header: "Status" },
      { key: "date", header: "Visit Date", kind: "date" },
      { key: "recommendation", header: "Recommendation" },
    ],
    rows: (state, f) => {
      const allowed = new Set(files(state, f).map((a) => a.id));
      return state.inspections
        .filter((i) => allowed.has(i.applicationId))
        .map((i) => ({
          id: i.id,
          project: i.institutionId,
          ngo: ngoName(state, i.ngoId),
          state: placeOf(state, { institutionId: i.institutionId })?.state ?? "",
          visit: i.visitType,
          status: INSPECTION_STATUS_LABEL[i.status],
          date: i.scheduledFor ?? null,
          recommendation: i.recommendation ?? (i.status === "Submitted" || i.status === "Reviewed" ? "Not Recorded" : "—"),
        }));
    },
  },
  {
    id: "sanction-status",
    title: "Sanction Status",
    description: "Every sanction order issued, with its recurring and non-recurring amounts.",
    columns: [
      { key: "order", header: "Order No.", kind: "reference" },
      { key: "date", header: "Sanction Date", kind: "date" },
      { key: "project", header: "Project ID", kind: "reference" },
      { key: "ngo", header: "NGO" },
      { key: "scheme", header: "Scheme" },
      { key: "recurring", header: "Recurring", kind: "money" },
      { key: "nonRecurring", header: "Non-Recurring", kind: "money" },
      { key: "total", header: "Total", kind: "money" },
    ],
    rows: (state, f) =>
      files(state, f)
        .filter((a) => a.sanction)
        .sort((a, b) => b.sanction!.sanctionedAt.localeCompare(a.sanction!.sanctionedAt))
        .map((a) => ({
          id: a.id,
          order: a.sanction!.orderNo,
          date: a.sanction!.sanctionedAt,
          project: a.institutionId,
          ngo: ngoName(state, a.ngoId),
          scheme: `${schemeLabel(a.schemeCode)} (FY ${a.financialYear})`,
          recurring: a.sanction!.recurring,
          nonRecurring: a.sanction!.nonRecurring,
          total: a.sanction!.total,
        })),
  },
  {
    id: "fund-release",
    title: "Fund Release",
    description: "Each sanctioned grant against the amount released to the organisation.",
    columns: [
      { key: "order", header: "Order No.", kind: "reference" },
      { key: "project", header: "Project ID", kind: "reference" },
      { key: "ngo", header: "NGO" },
      { key: "sanctioned", header: "Sanctioned", kind: "money" },
      { key: "released", header: "Released", kind: "money" },
      { key: "balance", header: "Balance", kind: "money" },
      { key: "status", header: "Status" },
    ],
    rows: (state, f) =>
      files(state, f)
        .filter((a) => a.sanction)
        .map((a) => {
          const released = a.status === "Released" ? a.sanction!.total : 0;
          return {
            id: a.id,
            order: a.sanction!.orderNo,
            project: a.institutionId,
            ngo: ngoName(state, a.ngoId),
            sanctioned: a.sanction!.total,
            released,
            balance: a.sanction!.total - released,
            status: released ? "Released" : "Awaiting Release",
          };
        }),
  },
  {
    id: "processing-timeline",
    title: "Processing Timeline",
    description: "How long each file took from submission to a decision, or has been open so far.",
    columns: [
      { key: "application", header: "Application", kind: "reference" },
      { key: "ngo", header: "NGO" },
      { key: "submitted", header: "Submitted", kind: "date" },
      { key: "decided", header: "Decided", kind: "date" },
      { key: "days", header: "Days", kind: "number" },
      { key: "stage", header: "Current Stage" },
    ],
    rows: (state, f, now) =>
      files(state, f)
        .filter((a) => a.submittedAt)
        .map((a) => {
          const decision = [...a.audit].reverse().find((e) => e.action === "sanction" || e.action === "reject");
          const end = decision ? Date.parse(decision.at) : now.getTime();
          return {
            id: a.id,
            application: a.id,
            ngo: ngoName(state, a.ngoId),
            submitted: a.submittedAt!,
            decided: decision?.at ?? null,
            days: Math.max(0, Math.round((end - Date.parse(a.submittedAt!)) / DAY)),
            stage: statusLabel(a),
          };
        })
        .sort((a, b) => b.days - a.days),
  },
  {
    id: "audit-log",
    title: "Audit Log",
    description: "Every recorded action on a file, newest first.",
    columns: [
      { key: "at", header: "Timestamp", kind: "datetime" },
      { key: "application", header: "Application", kind: "reference" },
      { key: "user", header: "User" },
      { key: "role", header: "Role" },
      { key: "action", header: "Action" },
      { key: "remarks", header: "Remarks" },
    ],
    rows: (state, f) =>
      files(state, f)
        .flatMap((a) =>
          a.audit.map((e) => ({
            id: e.id,
            at: e.at,
            application: a.id,
            user: e.byName,
            role: ROLES[e.byRole]?.label ?? e.byRole,
            action: auditActionLabel(e.action),
            remarks: e.remarks ?? "",
          })),
        )
        .sort((a, b) => String(b.at).localeCompare(String(a.at))),
  },
  {
    id: "attendance-returns",
    title: "Attendance Returns",
    description: "Monthly attendance returns from each running project, including months not yet filed.",
    columns: [
      { key: "project", header: "Project ID", kind: "reference" },
      { key: "ngo", header: "NGO" },
      { key: "month", header: "Month" },
      { key: "beneficiaries", header: "Beneficiaries", kind: "number" },
      { key: "present", header: "Average Present", kind: "number" },
      { key: "percent", header: "Attendance %", kind: "number" },
      { key: "status", header: "Status" },
    ],
    rows: (state, f, now) => {
      const ngoOk = ngoMatcher(state, f.ngo);
      const rows: ReportRow[] = [];
      for (const ngo of state.ngos) {
        if (!ngoOk(ngo.id)) continue;
        for (const inst of ngo.institutions) {
          const own = state.applications.filter((a) => a.institutionId === inst.id && a.status !== "Draft");
          if (f.scheme && !own.some((a) => a.schemeCode === f.scheme)) continue;
          const since = projectRunningSince(state, inst.id);
          if (since === null) continue;
          const roll = state.beneficiaries.filter((b) => b.projectId === inst.id && b.active).length;
          const strength = roll || own.filter((a) => a.sanction).at(-1)?.totalBeneficiaries || 0;
          if (!strength) continue;
          for (const r of buildReturnRows(now, strength, since)) {
            if (f.fy && r.fy !== f.fy) continue;
            rows.push({
              id: `${inst.id}|${r.monthStart}`,
              project: inst.id,
              ngo: ngo.name,
              month: formatMonthYear(r.monthStart),
              beneficiaries: r.beneficiaries,
              present: r.avgPresent,
              percent: r.percent,
              status: r.status,
            });
          }
        }
      }
      return rows;
    },
  },
];

export function reportById(id: string): ReportDef | undefined {
  return REPORTS.find((r) => r.id === id);
}

/** A cell as a person reads it. */
export function formatCell(value: ReportCell, kind: CellKind = "text"): string {
  if (value === null || value === "") return "—";
  if (kind === "money") return `₹${Math.round(Number(value)).toLocaleString("en-IN")}`;
  if (kind === "number") return Number(value).toLocaleString("en-IN");
  if (kind === "date") return formatDate(String(value));
  if (kind === "datetime") return formatDateTime(String(value));
  return String(value);
}

/**
 * The report as CSV. Amounts are written as plain numbers so a spreadsheet can add them; dates in
 * the portal's one shape. A cell with a comma, quote or line break is quoted.
 */
export function reportCsv(report: ReportDef, rows: ReportRow[]): string {
  const cell = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
  const head = report.columns.map((c) => cell(c.header)).join(",");
  const body = rows.map((r) =>
    report.columns
      .map((c) => {
        const v = r[c.key] ?? null;
        if (v === null) return "";
        if (c.kind === "money" || c.kind === "number") return String(v);
        return cell(formatCell(v, c.kind));
      })
      .join(","),
  );
  return [head, ...body].join("\n");
}
