import "server-only";

/**
 * Issue statuses — two Supabase tables reached over PostgREST with the service
 * role, the same way lib/settings/store.ts reaches hub_settings.
 *
 *  - Reads never throw. A missing or failing store returns null, and the page
 *    falls back to the committed baseline (every issue Open) and says so.
 *  - Writes throw, so an admin is told a save did not stick.
 *  - Every write is also appended to the log table, so a status can always be
 *    traced to who set it and when.
 */

import { STATUSES, type IssueStatus, type StatusRecord } from "./types";

const FETCH_TIMEOUT_MS = 4_000;
const PAGE = 1000;

interface StoreConfig {
  url: string;
  serviceKey: string;
}

function config(): StoreConfig | null {
  const url = process.env.SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !serviceKey) return null;
  return { url, serviceKey };
}

export function statusStoreConfigured(): boolean {
  return config() !== null;
}

function headers(key: string, extra: Record<string, string> = {}): Record<string, string> {
  return { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", ...extra };
}

interface Row {
  issue_id: string;
  status: string;
  assignee: string | null;
  target_date: string | null;
  note: string | null;
  updated_at: string;
  updated_by: string | null;
}

function toRecord(r: Row): StatusRecord {
  const status = (STATUSES as readonly string[]).includes(r.status) ? (r.status as IssueStatus) : "Open";
  return {
    issueId: r.issue_id,
    status,
    assignee: r.assignee,
    targetDate: r.target_date,
    note: r.note,
    updatedAt: r.updated_at,
    updatedBy: r.updated_by,
  };
}

/** Every stored status, keyed by issue id. Null when the store is unavailable. */
export async function readAllStatuses(): Promise<Record<string, StatusRecord> | null> {
  const cfg = config();
  if (!cfg) return null;
  const out: Record<string, StatusRecord> = {};
  try {
    // PostgREST caps a response at max-rows, so read in pages until one comes back short.
    for (let from = 0; ; from += PAGE) {
      const res = await fetch(`${cfg.url}/rest/v1/website_issue_status?select=*&order=issue_id`, {
        headers: headers(cfg.serviceKey, { Range: `${from}-${from + PAGE - 1}`, "Range-Unit": "items" }),
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        cache: "no-store",
      });
      if (!res.ok) return null;
      const rows = (await res.json()) as Row[];
      for (const r of rows) out[r.issue_id] = toRecord(r);
      if (rows.length < PAGE) break;
    }
    return out;
  } catch {
    return null;
  }
}

export interface LogEntry {
  status: IssueStatus;
  assignee: string | null;
  targetDate: string | null;
  note: string | null;
  changedAt: string;
  changedBy: string | null;
}

/** The change history of one issue, newest first. Empty when the store is unavailable. */
export async function readHistory(issueId: string): Promise<LogEntry[]> {
  const cfg = config();
  if (!cfg) return [];
  try {
    const res = await fetch(
      `${cfg.url}/rest/v1/website_issue_status_log?issue_id=eq.${encodeURIComponent(issueId)}&select=*&order=changed_at.desc&limit=50`,
      { headers: headers(cfg.serviceKey), signal: AbortSignal.timeout(FETCH_TIMEOUT_MS), cache: "no-store" },
    );
    if (!res.ok) return [];
    const rows = (await res.json()) as (Omit<Row, "updated_at" | "updated_by"> & { changed_at: string; changed_by: string | null })[];
    return rows.map((r) => ({
      status: toRecord({ ...r, updated_at: r.changed_at, updated_by: r.changed_by }).status,
      assignee: r.assignee,
      targetDate: r.target_date,
      note: r.note,
      changedAt: r.changed_at,
      changedBy: r.changed_by,
    }));
  } catch {
    return [];
  }
}

export interface StatusUpdate {
  status?: IssueStatus;
  /** Omit a field to leave it as it is; pass "" to clear it. */
  assignee?: string;
  targetDate?: string;
  note?: string;
}

/**
 * Write one change to several issues, and log it. Throws on failure, so the
 * caller can tell an editor the save did not stick.
 *
 * Only the fields present in `update` are written — a bulk "mark as Fixed"
 * must not wipe the assignee and note each issue already carries. PostgREST's
 * merge-duplicates upsert updates exactly the columns in the payload.
 */
export async function writeStatuses(issueIds: string[], update: StatusUpdate, by: string): Promise<void> {
  const cfg = config();
  if (!cfg) throw new Error("The status store is not configured.");
  if (issueIds.length === 0) return;
  const now = new Date().toISOString();
  const fields: Record<string, string | null> = {};
  if (update.status !== undefined) fields.status = update.status;
  if (update.assignee !== undefined) fields.assignee = update.assignee.trim() || null;
  if (update.targetDate !== undefined) fields.target_date = update.targetDate || null;
  if (update.note !== undefined) fields.note = update.note.trim() || null;
  if (Object.keys(fields).length === 0) return;
  // A new row needs a status; an existing one keeps its own.
  const existing = (await readAllStatuses()) ?? {};
  const rows = issueIds.map((id) => ({
    issue_id: id,
    status: existing[id]?.status ?? "Open",
    ...fields,
    updated_at: now,
    updated_by: by,
  }));
  const up = await fetch(`${cfg.url}/rest/v1/website_issue_status?on_conflict=issue_id`, {
    method: "POST",
    headers: headers(cfg.serviceKey, { Prefer: "resolution=merge-duplicates,return=minimal" }),
    body: JSON.stringify(rows),
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS * 2),
  });
  if (!up.ok) throw new Error(`Saving failed (${up.status}).`);
  const log = rows.map((r) => ({
    issue_id: r.issue_id,
    status: r.status,
    assignee: "assignee" in fields ? fields.assignee : existing[r.issue_id]?.assignee ?? null,
    target_date: "target_date" in fields ? fields.target_date : existing[r.issue_id]?.targetDate ?? null,
    note: "note" in fields ? fields.note : existing[r.issue_id]?.note ?? null,
    changed_at: now,
    changed_by: by,
  }));
  const lg = await fetch(`${cfg.url}/rest/v1/website_issue_status_log`, {
    method: "POST",
    headers: headers(cfg.serviceKey, { Prefer: "return=minimal" }),
    body: JSON.stringify(log),
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS * 2),
  });
  if (!lg.ok) throw new Error(`The change was saved but not logged (${lg.status}).`);
}
