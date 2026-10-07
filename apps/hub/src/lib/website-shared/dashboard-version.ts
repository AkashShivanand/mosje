/**
 * The Dashboard's two versions, side by side on the website while the proposed one is
 * reviewed: the PROPOSED one (one dashboard across programmes, five lenses) and the CURRENT
 * page (the live site's Beneficiary Dashboard, then one dashboard per scheme portal).
 *
 * The proposed version is the DEFAULT (instruction, 7 Oct 2026): `/website/dashboard` with no
 * parameter opens it. The demo rail's Version switch sets `?version=current` to open the
 * page it replaced. `?version=proposed`, the address the proposed one had while it was the
 * alternative, still opens it, so links shared during the review keep working.
 *
 * The per-portal pages, `/website/dashboard/<slug>`, belong to the current version; they are
 * reached from its portal cards and their breadcrumb returns to it (`CURRENT_DASHBOARD_PATH`).
 */
export type DashboardVersion = "current" | "proposed";

export const DASHBOARD_VERSION_PARAM = "version";

/** The current version's root, for the links that must return to it rather than to the default. */
export const CURRENT_DASHBOARD_QUERY = `?${DASHBOARD_VERSION_PARAM}=current`;
export const CURRENT_DASHBOARD_PATH = `/website/dashboard${CURRENT_DASHBOARD_QUERY}`;

export function dashboardVersion(searchParams: Record<string, string | string[] | undefined> | undefined): DashboardVersion {
  return searchParams?.[DASHBOARD_VERSION_PARAM] === "current" ? "current" : "proposed";
}
