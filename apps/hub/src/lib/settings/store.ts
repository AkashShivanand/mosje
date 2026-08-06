/**
 * Hub settings store — a key/value table in Supabase, reached over PostgREST.
 *
 * This sits on the request hot path: the proxy resolves the gate token through
 * it on every request. Three consequences shape the design.
 *
 *  - It caches. A 60s process-local TTL, so a password change propagates
 *    within a minute rather than costing a database round-trip per request.
 *    Warm serverless instances cache independently, so propagation across all
 *    of them is best-effort.
 *  - It times out. 1.5s, after which the caller gets null and falls back.
 *    A slow database must not hang every page load in the estate.
 *  - It never throws on read. Every failure returns null, and the null is
 *    cached, so a dead store is not hammered once per request. Callers treat
 *    null as "no configured value" and fall back to their environment variable.
 *
 * It uses plain fetch rather than @supabase/supabase-js: two endpoints do not
 * justify a dependency on the proxy's cold start.
 */

/** The only key Phase 1 uses. */
export const SETTING_GATE_TOKEN = "gate_token";

const CACHE_TTL_MS = 60_000;
const FETCH_TIMEOUT_MS = 1_500;

export interface StoreDeps {
  fetchImpl: typeof fetch;
  now: () => number;
}

/**
 * Both members delegate at call time rather than capturing at module load.
 * Capturing `fetch` here would freeze whatever binding existed when this
 * module was first imported, which silently ignores any later instrumentation
 * of the global.
 */
const defaultDeps: StoreDeps = {
  fetchImpl: (...args: Parameters<typeof fetch>) => globalThis.fetch(...args),
  now: () => Date.now(),
};

interface CacheEntry {
  value: string | null;
  at: number;
}

const cache = new Map<string, CacheEntry>();

/** Drop every cached value. Called after a write, and by tests. */
export function resetSettingsCache(): void {
  cache.clear();
}

interface StoreConfig {
  url: string;
  serviceKey: string;
}

/** Null when the store is not configured — the local-dev and bootstrap path. */
function config(): StoreConfig | null {
  const url = process.env.SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !serviceKey) return null;
  return { url, serviceKey };
}

function headers(serviceKey: string): Record<string, string> {
  return {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    "Content-Type": "application/json",
  };
}

/**
 * Read a setting. Returns null when the store is unconfigured, the key is
 * absent, or the read failed for any reason — all of which mean the same thing
 * to callers: use your fallback.
 */
export async function readSetting(
  key: string,
  deps: StoreDeps = defaultDeps,
): Promise<string | null> {
  const cfg = config();
  if (!cfg) return null;

  const hit = cache.get(key);
  if (hit && deps.now() - hit.at < CACHE_TTL_MS) return hit.value;

  let value: string | null = null;
  try {
    const url = `${cfg.url}/rest/v1/hub_settings?key=eq.${encodeURIComponent(key)}&select=value`;
    const response = await deps.fetchImpl(url, {
      headers: headers(cfg.serviceKey),
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      cache: "no-store",
    });
    if (response.ok) {
      const rows: unknown = await response.json();
      if (Array.isArray(rows) && rows.length > 0) {
        const first: unknown = rows[0];
        if (first && typeof first === "object" && "value" in first) {
          const raw = (first as { value: unknown }).value;
          if (typeof raw === "string") value = raw;
        }
      }
    } else {
      console.warn(`[settings] read ${key} failed: HTTP ${response.status}`);
    }
  } catch (error) {
    console.warn(`[settings] read ${key} failed:`, error);
  }

  // The failure is cached too — a dead store must not be retried per request.
  cache.set(key, { value, at: deps.now() });
  return value;
}

/**
 * Upsert a setting. Unlike reads, this throws: a write is a deliberate admin
 * action and its caller must be able to report that it did not happen.
 */
export async function writeSetting(
  key: string,
  value: string,
  deps: StoreDeps = defaultDeps,
): Promise<void> {
  const cfg = config();
  if (!cfg) throw new Error("Settings store is not configured");

  const response = await deps.fetchImpl(`${cfg.url}/rest/v1/hub_settings`, {
    method: "POST",
    headers: { ...headers(cfg.serviceKey), Prefer: "resolution=merge-duplicates" },
    body: JSON.stringify([{ key, value, updated_at: new Date().toISOString() }]),
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Settings write failed: HTTP ${response.status}`);
  }
  resetSettingsCache();
}
