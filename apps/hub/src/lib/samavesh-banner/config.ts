/**
 * SAMAVESH Banner placement configuration and persistence.
 *
 * Controls where the SAMAVESH header banner & portal drawer is shown on the website:
 *  - "all": shown on all pages (homepage, inner pages, organisation details)
 *  - "except_org_details": shown on all pages except the organisation details pages (/website/organisation/*)
 *  - "homepage_only": shown only on the website homepage (/website)
 */

import { SETTING_SAMAVESH_BANNER, readSetting, type StoreDeps } from "../settings/store.ts";

export const SAMAVESH_BANNER_CONFIG_VERSION = 1;
export const SAMAVESH_BANNER_CONFIG_MAX_BYTES = 1024;

export type SamaveshBannerPlacement = "all" | "except_org_details" | "homepage_only";

export const VALID_SAMAVESH_BANNER_PLACEMENTS: readonly SamaveshBannerPlacement[] = [
  "all",
  "except_org_details",
  "homepage_only",
] as const;

export interface SamaveshBannerConfig {
  version: number;
  placement: SamaveshBannerPlacement;
}

/**
 * HOMEPAGE ONLY BY DEFAULT.
 *
 * It defaulted to "all", which put an 80px identity band above every page on the
 * site — a scheme page, an organisation profile, a press release. The band is an
 * ENTRY POINT: it earns its space where a reader is deciding where to go, and
 * costs 80px of every other page where they have already decided. A citizen deep
 * in a scheme page is not looking for a portal directory.
 *
 * The other two placements stay available at /admin/portals and take effect
 * without a redeploy, so widening it is one setting rather than a release.
 */
export const DEFAULT_SAMAVESH_BANNER_PLACEMENT: SamaveshBannerPlacement = "homepage_only";

export function samaveshBannerConfig(placement: SamaveshBannerPlacement): SamaveshBannerConfig {
  return { version: SAMAVESH_BANNER_CONFIG_VERSION, placement };
}

/** Validate stored raw string into a structured SamaveshBannerConfig, or null. */
export function parseSamaveshBannerConfig(raw: unknown): SamaveshBannerConfig | null {
  if (typeof raw !== "string" || raw.length === 0) return null;
  if (new TextEncoder().encode(raw).length > SAMAVESH_BANNER_CONFIG_MAX_BYTES) return null;

  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null;

  const record = value as Record<string, unknown>;
  if (record.version !== SAMAVESH_BANNER_CONFIG_VERSION) return null;
  if (typeof record.placement !== "string") return null;
  if (!VALID_SAMAVESH_BANNER_PLACEMENTS.includes(record.placement as SamaveshBannerPlacement)) {
    return null;
  }

  return samaveshBannerConfig(record.placement as SamaveshBannerPlacement);
}

export function serializeSamaveshBannerConfig(config: SamaveshBannerConfig): string {
  return JSON.stringify({
    version: SAMAVESH_BANNER_CONFIG_VERSION,
    placement: config.placement,
  });
}

/**
 * Read and validate stored banner placement config.
 * Returns null on any store read error / unconfigured store.
 */
export async function readSamaveshBannerConfig(
  deps?: StoreDeps,
): Promise<SamaveshBannerConfig | null> {
  try {
    const raw = deps
      ? await readSetting(SETTING_SAMAVESH_BANNER, deps)
      : await readSetting(SETTING_SAMAVESH_BANNER);
    return parseSamaveshBannerConfig(raw);
  } catch (error) {
    console.warn(`[settings] samavesh banner config read failed, using default:`, error);
    return null;
  }
}

/** Resolves the effective placement string from config or default. */
export function samaveshBannerPlacement(
  config: SamaveshBannerConfig | null,
): SamaveshBannerPlacement {
  return config?.placement ?? DEFAULT_SAMAVESH_BANNER_PLACEMENT;
}

/**
 * Pure evaluation of whether the banner should render given the active placement and current route context.
 */
export function shouldShowSamaveshBanner(
  placement: SamaveshBannerPlacement,
  opts: { pathname?: string | null; isHomepage?: boolean; isOrgDetails?: boolean },
): boolean {
  if (placement === "all") return true;

  const pathname = opts.pathname ?? "";
  const isHomepage = opts.isHomepage ?? (pathname === "/website" || pathname === "/website/" || pathname === "/" || pathname === "");
  const isOrgDetails = opts.isOrgDetails ?? pathname.startsWith("/website/organisation");

  if (placement === "homepage_only") {
    return isHomepage;
  }

  if (placement === "except_org_details") {
    return !isOrgDetails;
  }

  return true;
}
