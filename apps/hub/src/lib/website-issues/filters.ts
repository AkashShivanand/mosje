/**
 * The register's filters, read from the page address so every view — "Blockers
 * the developers own that are still open" — is a link someone can share, and
 * works with no script at all. The page and the download read the same filters.
 */

import { SCOPES, SEVERITIES, STATUSES, type Issue, type IssueStatus, type StatusRecord } from "./types";

export const STANDARD_FAMILIES = ["WCAG", "GIGW", "DBIM", "UX4G", "Other"] as const;

export interface IssueFilters {
  q: string;
  severity: string;
  category: string;
  owner: string;
  scope: string;
  status: string;
  standard: string;
  page: number;
}

type Params = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export function parseFilters(sp: Params): IssueFilters {
  const pick = (v: string, allowed: readonly string[]) => (allowed.includes(v) ? v : "");
  return {
    q: one(sp.q).slice(0, 120),
    severity: pick(one(sp.severity), SEVERITIES),
    category: one(sp.category).slice(0, 80),
    owner: one(sp.owner).slice(0, 80),
    scope: pick(one(sp.scope), SCOPES),
    status: pick(one(sp.status), STATUSES),
    standard: pick(one(sp.standard), STANDARD_FAMILIES),
    page: Math.max(1, Number.parseInt(one(sp.page), 10) || 1),
  };
}

export function statusOf(id: string, statuses: Record<string, StatusRecord>): IssueStatus {
  return statuses[id]?.status ?? "Open";
}

function family(id: string): string {
  const f = id.split(" ")[0] ?? "";
  return (STANDARD_FAMILIES as readonly string[]).includes(f) ? f : "Other";
}

export function applyFilters(issues: Issue[], statuses: Record<string, StatusRecord>, f: IssueFilters): Issue[] {
  const words = f.q.toLowerCase().split(/\s+/).filter(Boolean);
  return issues.filter((i) => {
    if (f.severity && i.severity !== f.severity) return false;
    if (f.category && i.category !== f.category) return false;
    if (f.owner && i.owner !== f.owner) return false;
    if (f.scope && i.scope !== f.scope) return false;
    if (f.status && statusOf(i.id, statuses) !== f.status) return false;
    if (f.standard && !i.standards.some((s) => family(s.id) === f.standard)) return false;
    if (words.length) {
      const hay = `${i.id} ${i.title} ${i.url} ${i.where} ${i.issue} ${i.fix} ${i.standards.map((s) => s.id).join(" ")} ${i.tokens.map((t) => t.token).join(" ")}`.toLowerCase();
      if (!words.every((w) => hay.includes(w))) return false;
    }
    return true;
  });
}

/** The address of the register with these filters, minus any left empty. */
export function filterHref(f: Partial<IssueFilters>, base = "/reports/dosje-website"): string {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(f)) {
    if (v === undefined || v === "" || (k === "page" && v === 1)) continue;
    p.set(k, String(v));
  }
  const s = p.toString();
  return s ? `${base}?${s}` : base;
}

export function hasFilters(f: IssueFilters): boolean {
  return Boolean(f.q || f.severity || f.category || f.owner || f.scope || f.status || f.standard);
}
