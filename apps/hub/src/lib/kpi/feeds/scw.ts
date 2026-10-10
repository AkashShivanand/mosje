import type { Labelled } from "../types";
import type { ScwFeed } from "../live";

/**
 * SENIOR CITIZENS WELFARE's public feeds — the three the SCW1 tab of the KPI proforma names
 * (NeGD, read 9 Oct 2026):
 *
 *   GET seniorcitizen-api-user.mosje.in/api/v1/user/facilities_list         → IPSrC projects
 *   GET seniorcitizen-api-user.mosje.in/api/v1/user/pledges/dashboard-count → Pledge Count
 *   GET adip.depwd.gov.in/auth/api/sje/rvysummary  (x-api-key)               → RVY camps,
 *       beneficiaries (`nob`) and devices (`noa`)
 *
 * The first two are open. RVY is DEPwD's ADIP portal and needs `RVY_API_KEY`, a server-only
 * secret never sent to the browser; without it, or when it is refused, RVY is null and the
 * dashboard draws the dated mirror (`scw-snapshot.ts`).
 *
 * Server components only, short timeout, hourly revalidate, as `nmba.ts`. Never throws.
 */

const SCW_BASE = process.env.SCW_API_BASE ?? "https://seniorcitizen-api-user.mosje.in/api/v1/user";
const RVY_URL = process.env.RVY_SUMMARY_API ?? "https://adip.depwd.gov.in/auth/api/sje/rvysummary";
const REVALIDATE = 3600;
const TIMEOUT_MS = 6000;

async function getJson<T>(url: string, headers: Record<string, string> = {}): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json", ...headers },
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

const num = (v: unknown): number | null => {
  const n = typeof v === "string" ? Number(v) : typeof v === "number" ? v : NaN;
  return Number.isFinite(n) && n > 0 ? n : null;
};

/** The feed's `home_type`, in the words the Department uses; RRTC is spelt out. */
const HOME_TYPE: Record<string, string> = { RRTC: "Regional Resource and Training Centres" };

async function facilities(): Promise<Labelled[] | null> {
  const body = await getJson<{ data?: { home_type?: string; is_active?: boolean }[] }>(`${SCW_BASE}/facilities_list`);
  const rows = body?.data?.filter((r) => r.is_active !== false);
  if (!rows?.length) return null;
  const counts = new Map<string, number>();
  for (const r of rows) {
    const label = HOME_TYPE[r.home_type ?? ""] ?? r.home_type ?? "Other";
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  return [...counts].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
}

async function pledges(): Promise<number | null> {
  const body = await getJson<{ data?: { totalCount?: unknown } }>(`${SCW_BASE}/pledges/dashboard-count`);
  return num(body?.data?.totalCount);
}

async function rvy(): Promise<ScwFeed["rvy"]> {
  const key = process.env.RVY_API_KEY;
  if (!key) return null;
  const body = await getJson<{ camp?: unknown; nob?: unknown; noa?: unknown }>(RVY_URL, { "x-api-key": key });
  const camps = num(body?.camp);
  const beneficiaries = num(body?.nob);
  const devices = num(body?.noa);
  return camps && beneficiaries && devices ? { camps, beneficiaries, devices } : null;
}

export async function getScwFeed(): Promise<ScwFeed | null> {
  const [f, p, r] = await Promise.all([facilities(), pledges(), rvy()]);
  if (!f && !p && !r) return null;
  return { facilities: f, pledges: p, rvy: r, readAt: new Date().toISOString().slice(0, 10) };
}
