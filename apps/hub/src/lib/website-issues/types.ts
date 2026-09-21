/**
 * The dosje.gov.in issue register — one row per fix. The register is committed
 * data built from every audit of the live site (the same data as the issues
 * report PDF and the QC tracker on Drive); only the status of each issue
 * changes day to day, and that lives in the status store.
 */

export const STATUSES = ["Open", "In progress", "Needs decision", "Fixed", "Verified", "Won't fix"] as const;
export type IssueStatus = (typeof STATUSES)[number];

export const SEVERITIES = ["Blocker", "Major", "Minor", "Nit"] as const;
export type Severity = (typeof SEVERITIES)[number];

export const SCOPES = ["Sitewide", "Page type", "One page", "Build vs design", "Figma file"] as const;
export type Scope = (typeof SCOPES)[number];

export interface StandardRef {
  id: string;
  label: string;
  url: string;
}

export interface TokenRef {
  token: string;
  value: string;
  css: string;
}

export interface Evidence {
  /** File under /reports/dosje-website/evidence/. */
  file: string;
  caption: string;
}

export interface Issue {
  id: string;
  title: string;
  severity: Severity;
  category: string;
  owner: string;
  scope: Scope;
  /** What was measured — never a count without a list behind it. */
  reach: string;
  url: string;
  where: string;
  issue: string;
  why: string;
  fix: string;
  steps: string[];
  tokens: TokenRef[];
  standards: StandardRef[];
  evidence: Evidence[];
  /** Page of the issues report PDF, where the issue is printed there. */
  reportPage: number | null;
  related: string[];
  figma: string | null;
  affectedCount: number;
}

/** Affected pages: [path, page title, what was found there]. */
export type AffectedRow = [string, string, string];

export interface StatusRecord {
  issueId: string;
  status: IssueStatus;
  assignee: string | null;
  targetDate: string | null;
  note: string | null;
  updatedAt: string;
  updatedBy: string | null;
}

export interface RegisterMeta {
  issued: string;
  reportPdf: string;
  /** [issue id, page, link text, broken address, problem] */
  broken: [string, string, string, string, string][];
  /** [type, group, address, title, issue id] */
  duplicates: [string, string, string, string, string][];
  /** [reported as, checkpoint, now, checked] */
  resolved: [string, string, string, string][];
  /** [earlier claim, what was found, checked] */
  withdrawn: [string, string, string][];
}
