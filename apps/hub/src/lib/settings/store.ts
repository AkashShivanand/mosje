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

/** The gate's HMAC digest — the first setting this store carried. */
export const SETTING_GATE_TOKEN = "gate_token";

/**
 * The estate registry override patch, as serialised `RegistryConfig` JSON.
 * Absent, unreadable or malformed all mean the same thing: use the code
 * defaults in `DEFAULT_APPS`.
 */
export const SETTING_PORTAL_REGISTRY = "portal_registry";

/**
 * Where the assistant is switched on, as serialised `ChatbotConfig` JSON.
 * Absent, unreadable or malformed all mean the same thing: use the code
 * defaults in `lib/chatbot/config.ts`.
 */
export const SETTING_CHATBOT = "chatbot_config";

/**
 * Whether the demo dock is shown, as serialised `DemoToolsConfig` JSON.
 *
 * This is a PRODUCT setting, not a kill switch. The demo tooling is the point
 * of this prototype — it is how the estate is shown to anyone — so it is
 * turned off from the admin panel for a particular audience, not removed from
 * a deployment. `NEXT_PUBLIC_DEMO_TOOLS=false` still exists above it as a
 * build-time hard off, for a deployment that genuinely must not carry it.
 */
export const SETTING_DEMO_TOOLS = "demo_tools";

/**
 * Whether the cookie consent banner is shown, as serialised toggle JSON.
 *
 * Currently DEFAULT OFF, which is a deliberate temporary state: the banner is
 * being redesigned and is switched off until it is. See
 * `lib/cookie-banner/config.ts` for the compliance note that goes with that.
 */
export const SETTING_COOKIE_BANNER = "cookie_banner";

/**
 * Where the top SAMAVESH banner is shown across the website, as serialised
 * `SamaveshBannerConfig` JSON ("all" | "except_org_details" | "homepage_only").
 */
export const SETTING_SAMAVESH_BANNER = "samavesh_banner";

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

/**
 * Reads currently in flight, keyed by setting.
 *
 * Without this, every concurrent request that arrives during a cold start (or
 * the instant a TTL expires) fires its own fetch at the database — a stampede,
 * on the request hot path, at exactly the moment the store is most likely to
 * already be struggling. Sharing the in-flight promise makes N concurrent
 * readers cost one round-trip.
 */
const inFlight = new Map<string, Promise<string | null>>();

/**
 * Bumped by every invalidation.
 *
 * A read that was already in flight when a write landed carries the value from
 * *before* that write. Letting it populate the cache on arrival would pin the
 * stale value for a further TTL — so an admin saves, and the estate keeps
 * serving the old registry for a minute because of a request that started
 * moments earlier. Reads stamp their generation and drop the write if it moved.
 */
let generation = 0;

/** Drop every cached value. Called after a write, and by tests. */
export function resetSettingsCache(): void {
  cache.clear();
  inFlight.clear();
  generation += 1;
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

/**
 * Whether a settings store is configured at all.
 *
 * Callers that only READ do not need this — an unconfigured store and an empty
 * one both yield null, and both mean "use your fallback". A page offering to
 * SAVE does need it, so it can say the save will not stick instead of letting
 * the admin press a button that always fails.
 */
export function settingsConfigured(): boolean {
  return config() !== null;
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

  // Join a read that is already running for this key rather than starting a
  // second one. Deliberately checked after the cache: a cached value is always
  // cheaper than awaiting someone else's round-trip.
  const pending = inFlight.get(key);
  if (pending) return pending;

  const read = fetchSetting(key, cfg, deps).finally(() => inFlight.delete(key));
  inFlight.set(key, read);
  return read;
}

async function fetchSetting(
  key: string,
  cfg: StoreConfig,
  deps: StoreDeps,
): Promise<string | null> {
  const startedAt = generation;
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
  // Unless the cache was invalidated while this read was in flight, in which
  // case this value predates the write and must not be stored. The caller
  // still receives it; only the caching is skipped.
  if (startedAt === generation) cache.set(key, { value, at: deps.now() });
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
