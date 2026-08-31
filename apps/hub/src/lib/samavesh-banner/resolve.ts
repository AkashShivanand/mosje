/**
 * Resolving SAMAVESH banner placement for server-side rendering.
 *
 * Wrapped in Next.js `unstable_cache` with tag `SAMAVESH_BANNER_TAG` so
 * admin updates immediately invalidate and propagate without a redeploy.
 */

import { unstable_cache } from "next/cache";
import {
  readSamaveshBannerConfig,
  samaveshBannerPlacement,
  type SamaveshBannerConfig,
  type SamaveshBannerPlacement,
} from "./config.ts";

/** Cache tag invalidated on admin save / reset. */
export const SAMAVESH_BANNER_TAG = "samavesh-banner-config";

const cachedReadConfig = unstable_cache(
  () => readSamaveshBannerConfig(),
  ["samavesh-banner-config"],
  { tags: [SAMAVESH_BANNER_TAG], revalidate: 60 },
);

export async function resolveSamaveshBannerConfig(): Promise<SamaveshBannerConfig | null> {
  try {
    return await cachedReadConfig();
  } catch (error) {
    console.warn("[samavesh-banner] cached config read failed, using default:", error);
    return null;
  }
}

/** Resolves the effective placement string ("all" | "except_org_details" | "homepage_only"). */
export async function resolveSamaveshBannerPlacement(): Promise<SamaveshBannerPlacement> {
  const config = await resolveSamaveshBannerConfig();
  return samaveshBannerPlacement(config);
}
