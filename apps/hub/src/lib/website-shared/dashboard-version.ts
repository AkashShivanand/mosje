/**
 * The Dashboard's two versions, side by side on the website while the proposed one is
 * reviewed: the CURRENT page (the live site's Beneficiary Dashboard, then one dashboard per
 * scheme portal) and the PROPOSED one (one dashboard across programmes, five lenses). The
 * demo rail's Version switch sets `?version=proposed`; the current page needs no parameter,
 * so every existing link still opens it.
 */
export type DashboardVersion = "current" | "proposed";

export const DASHBOARD_VERSION_PARAM = "version";

export function dashboardVersion(searchParams: Record<string, string | string[] | undefined> | undefined): DashboardVersion {
  return searchParams?.[DASHBOARD_VERSION_PARAM] === "proposed" ? "proposed" : "current";
}
