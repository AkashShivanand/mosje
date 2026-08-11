/**
 * Resolving the estate registry for rendering.
 *
 * `DEFAULT_APPS` is the seed; the `portal_registry` settings row is a sparse
 * patch over it. This module is the render-side read, and it exists to solve
 * one problem the settings store alone cannot: **statically rendered pages**.
 *
 * `readSetting` caches for 60s inside a running process, which is right for
 * the proxy's per-request hot path. It does nothing for a page Next rendered
 * at build time — that page holds whatever the registry said when it was
 * built, forever. So the read is additionally wrapped in `unstable_cache` with
 * a tag, and the admin action calls `updateTag(REGISTRY_TAG)` on save. That is
 * what makes a toggle land immediately while `/` and `/portals` stay
 * statically rendered between edits.
 *
 * Middleware cannot use `unstable_cache`, so the proxy imports `config.ts`
 * directly. The consequence is worth being explicit about: display updates
 * immediately, edge enforcement can lag by up to the store's 60s TTL on any
 * serverless instance that did not handle the write. That is exactly the
 * propagation behaviour the gate password already has.
 */

import { unstable_cache } from "next/cache";
import type { AppEntry, RegistryConfig } from "@mosje/design-system/registry";
import { hiddenFrom, readRegistryConfig, registryFrom } from "./config.ts";

/** Cache tag the admin save invalidates. */
export const REGISTRY_TAG = "portal-registry";

const cachedReadConfig = unstable_cache(
  () => readRegistryConfig(),
  ["portal-registry-config"],
  {
    tags: [REGISTRY_TAG],
    /*
     * A ceiling, not the propagation mechanism — `updateTag` is. This only
     * bounds how stale a page can get when an invalidation never happens,
     * which is exactly what a change made outside the admin page looks like
     * (someone editing the row in Supabase directly).
     *
     * 60s to match the settings store's own TTL. The proxy reads that store
     * uncached, so with a longer ceiling here an out-of-band edit would block
     * a portal's URL while its card was still on the page — the two layers
     * disagreeing for minutes. Matching the TTL bounds that window to the
     * same 60s the gate password already has.
     */
    revalidate: 60,
  },
);

/** The stored patch, cached and tag-invalidated. Null means "code defaults". */
export async function resolveRegistryConfig(): Promise<RegistryConfig | null> {
  try {
    return await cachedReadConfig();
  } catch (error) {
    // A cache-layer failure must degrade the same way a store failure does.
    console.warn("[registry] cached config read failed, using code defaults:", error);
    return null;
  }
}

/** The registry as it should render: overrides applied, hidden entries dropped. */
export async function resolveRegistry(): Promise<AppEntry[]> {
  return registryFrom(await resolveRegistryConfig());
}

/** Just the portals, in effective order — what `/portals` and the home tiles use. */
export async function resolvePortals(): Promise<AppEntry[]> {
  return (await resolveRegistry()).filter((entry) => entry.group === "Portals");
}

/** The entries an admin has hidden — what the proxy blocks. */
export async function resolveHiddenEntries(): Promise<AppEntry[]> {
  return hiddenFrom(await resolveRegistryConfig());
}
