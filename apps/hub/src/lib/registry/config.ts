/**
 * Reading the estate registry patch — the half with no Next.js dependency.
 *
 * Split out of resolve.ts for the same reason `lib/admin/tokens.ts` is split
 * out of `auth.ts`: resolve.ts imports `next/cache`, which only resolves
 * inside Next, and this half has to be exercisable under the bare Node test
 * runner. It is also what the proxy imports, because middleware cannot use
 * `unstable_cache` at all.
 *
 * Every function here is total. A missing row, an unconfigured store, a
 * timeout, an HTTP error, malformed JSON and an oversized payload all resolve
 * to null — "use the code defaults" — because a settings row must never be
 * able to 500 the estate.
 */

import {
  applyRegistryOverrides,
  hiddenEntries,
  matchHiddenEntry,
  parseRegistryConfig,
  type AppEntry,
  type RegistryConfig,
} from "@mosje/design-system/registry";
import { DEFAULT_APPS } from "@mosje/design-system/app-registry";
import {
  SETTING_PORTAL_REGISTRY,
  readSetting,
  type StoreDeps,
} from "../settings/store.ts";

/**
 * Read and validate the stored patch, with no Next-level caching.
 *
 * `readSetting` still applies its own 60s process-local cache, which is what
 * keeps this cheap on the proxy's per-request path.
 */
export async function readRegistryConfig(
  deps?: StoreDeps,
): Promise<RegistryConfig | null> {
  try {
    const raw = deps
      ? await readSetting(SETTING_PORTAL_REGISTRY, deps)
      : await readSetting(SETTING_PORTAL_REGISTRY);
    return parseRegistryConfig(raw);
  } catch (error) {
    // readSetting is documented never to throw, but a caller passing a broken
    // `deps` could still land here. Degrade rather than propagate.
    console.warn("[registry] config read failed, using code defaults:", error);
    return null;
  }
}

/** The registry as it should render, from an already-resolved config. */
export function registryFrom(config: RegistryConfig | null): AppEntry[] {
  return applyRegistryOverrides(DEFAULT_APPS, config);
}

/** The hidden entries, from an already-resolved config. */
export function hiddenFrom(config: RegistryConfig | null): AppEntry[] {
  return hiddenEntries(DEFAULT_APPS, config);
}

/**
 * Paths the hidden-entry block must never touch.
 *
 * /admin is the recovery surface — if it could be blocked, hiding the wrong
 * entry would lock the only person who can unhide it out of the control that
 * unhides it. /gate and /unavailable are the two walls themselves; blocking
 * either produces a rewrite loop.
 */
export const HIDDEN_BLOCK_EXEMPT = ["/admin", "/gate", "/unavailable", "/_next"];

export interface BlockInput {
  pathname: string;
  hidden: AppEntry[];
  /** A signed-in admin passes through, so they can check what they hid. */
  isAdmin: boolean;
}

/**
 * The block decision, as a pure function.
 *
 * Extracted from the proxy so it is testable: middleware needs a NextRequest
 * and an edge runtime, and the interesting part of this is none of that — it
 * is which path matches which hidden entry, and who gets waved through.
 *
 * Returns the entry responsible for the block, or null to let the request run.
 */
export function blockedEntry({ pathname, hidden, isAdmin }: BlockInput): AppEntry | null {
  // Collapse duplicate slashes before matching. `//portals/nmba` reaches the
  // same route as `/portals/nmba`, but a naive prefix match sees a different
  // string and waves it through — the block has to compare what the router
  // will resolve, not what the client happened to type.
  const path = pathname.replace(/\/{2,}/g, "/");

  if (HIDDEN_BLOCK_EXEMPT.some((p) => path === p || path.startsWith(p + "/"))) {
    return null;
  }
  if (hidden.length === 0) return null;
  const match = matchHiddenEntry(hidden, path);
  if (!match) return null;
  return isAdmin ? null : match;
}
