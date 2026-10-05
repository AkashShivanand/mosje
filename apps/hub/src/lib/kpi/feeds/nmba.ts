import type { NmbaFeed, NmbaMetrics } from "../live";

/**
 * NMBA's PUBLIC dashboard feed — the API nashamukt.dosje.gov.in's own home page reads,
 * found 5 Oct 2026. These are the two endpoints the KPI proforma's NMBA tab named
 * (`/api/v1/user/dashboard/state-wise` and `/dashboard/metrics?state_id=&district_id=`),
 * on the deployed host rather than the `localhost:7004` the sheet gave.
 *
 *   POST /api/v1/user/states                 → [{ state_id, state_name }]  (GET is 404)
 *   GET  /api/v1/user/dashboard/metrics      → national totals
 *   GET  /api/v1/user/dashboard/metrics?state_id=<id>&district_id=  → one State/UT
 *
 * Figures arrive as strings ("348074513"); `num` turns them into numbers and treats
 * anything that is not a positive number as unanswered — a running national campaign
 * has not reached zero people, so a 0 here is an unpopulated field, not a reading.
 *
 * Called from server components only, with a short timeout and an hourly revalidate,
 * like the PM-AJAY feeds (`lib/website/pmajay-api.ts`). Never throws: a feed that is down
 * returns null and the dashboard falls back to its snapshot.
 */

const BASE = process.env.NEXT_PUBLIC_NMBA_API ?? "https://nashamukt-api-user.mosje.in/api/v1/user";
const REVALIDATE = 3600;
const TIMEOUT_MS = 6000;

async function call<T>(path: string, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${BASE}/${path}`, {
      ...init,
      headers: { Accept: "application/json", ...(init?.headers ?? {}) },
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { data?: T };
    return body?.data ?? null;
  } catch {
    return null;
  }
}

const num = (v: unknown): number | null => {
  const n = typeof v === "string" ? Number(v) : typeof v === "number" ? v : NaN;
  return Number.isFinite(n) && n > 0 ? n : null;
};

interface RawMetrics {
  people_reached?: string;
  women_reached?: string;
  youth_reached?: string;
  total_pledges?: string;
  total_recovered_pledges?: string;
  total_nasha_mukti_mitr?: string;
}

function metricsOf(raw: RawMetrics | null): NmbaMetrics | null {
  if (!raw) return null;
  const m: NmbaMetrics = {
    people: num(raw.people_reached),
    women: num(raw.women_reached),
    youth: num(raw.youth_reached),
    pledges: num(raw.total_pledges),
    mitras: num(raw.total_nasha_mukti_mitr),
  };
  return Object.values(m).some((v) => v !== null) ? m : null;
}

/**
 * The NMBA reading, national and for every State/UT. The state readings are 36 small
 * requests made in parallel, once an hour, on the server — never from a reader's browser.
 */
export async function getNmbaFeed(): Promise<NmbaFeed | null> {
  const [national, states] = await Promise.all([
    call<RawMetrics>("dashboard/metrics").then(metricsOf),
    call<{ state_id: number; state_name: string }[]>("states", { method: "POST" }),
  ]);
  if (!national) return null;
  const byState: Record<string, NmbaMetrics> = {};
  if (states?.length) {
    const rows = await Promise.all(
      states.map(async (s) => [s.state_name, metricsOf(await call<RawMetrics>(`dashboard/metrics?state_id=${s.state_id}&district_id=`))] as const),
    );
    for (const [name, m] of rows) if (m) byState[name] = m;
  }
  return { national, byState, readAt: new Date().toISOString().slice(0, 10) };
}
