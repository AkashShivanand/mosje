/**
 * Resolving cookie-banner visibility for rendering.
 *
 * Same shape and reason as the chatbot's and the demo dock's: `readSetting`
 * caches per process, which does nothing for a statically rendered page, so
 * the read is wrapped in `unstable_cache` with a tag the admin save
 * invalidates.
 */

import { unstable_cache } from "next/cache";
import {
  cookieBannerEnabled,
  readCookieBannerConfig,
  type CookieBannerConfig,
} from "./config.ts";

/** Cache tag the admin save invalidates. */
export const COOKIE_BANNER_TAG = "cookie-banner-config";

const cachedReadConfig = unstable_cache(
  () => readCookieBannerConfig(),
  ["cookie-banner-config"],
  { tags: [COOKIE_BANNER_TAG], revalidate: 60 },
);

export async function resolveCookieBannerConfig(): Promise<CookieBannerConfig | null> {
  try {
    return await cachedReadConfig();
  } catch (error) {
    console.warn("[cookie-banner] cached config read failed, using default:", error);
    return null;
  }
}

/** Whether the banner should render at all. */
export async function resolveCookieBannerEnabled(): Promise<boolean> {
  return cookieBannerEnabled(await resolveCookieBannerConfig());
}
