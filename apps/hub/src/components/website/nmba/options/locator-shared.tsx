"use client";

import dynamic from "next/dynamic";
import { type CentreType, type DeAddictionCentre } from "@/content/website/deaddiction-centres";

import { useCentres } from "@/lib/website/deaddiction-centres";

export { statesOf, useNearViewport } from "@/lib/website/deaddiction-centres";
export { useCentres };

/*
 * THESE HELPERS TAKE THE ROWS; THEY NO LONGER READ THEM.
 *
 * `ALL_STATES` and `filterCentres` used to close over a static import of all 487
 * centres, which put the register in this page's client bundle as surely as it
 * was in the home page's. The rows are now fetched (see
 * `@/lib/website/deaddiction-centres`), so every option below is handed whatever
 * has arrived and derives from that one value — `data-state-completeness.md` §2.
 *
 * These are the LOCATOR LAYOUT OPTIONS, an internal comparison surface at
 * /website/nmba-options. They deliberately carry a lighter treatment of the
 * loading and error states than the shipped `DeAddictionMap`: what is being
 * compared here is the layout, and each option renders through `useLocatorRows`
 * so none of them can render a count of data it does not have.
 */

export const CentreMapDynamic = dynamic(
  () => import("../CentreMapCanvas").then((m) => m.CentreMapCanvas),
  { ssr: false, loading: () => <div className="h-full min-h-[320px] w-full animate-pulse bg-surface-muted" aria-hidden /> },
);

export const centreKey = (c: DeAddictionCentre) => `${c.name}|${c.lat}|${c.lng}`;

export interface Filters {
  query?: string;
  state?: string;
  district?: string;
  type?: CentreType | "";
}

export function filterCentres(
  centres: DeAddictionCentre[],
  { query = "", state = "", district = "", type = "" }: Filters,
): DeAddictionCentre[] {
  const q = query.trim().toLowerCase();
  return centres.filter((c) => {
    if (state && c.state !== state) return false;
    if (district && c.district !== district) return false;
    if (type && c.type !== type) return false;
    if (q && !`${c.name} ${c.address} ${c.district} ${c.state} ${c.type}`.toLowerCase().includes(q)) return false;
    return true;
  });
}

/**
 * The register, fetched as soon as an option mounts.
 *
 * `/website/nmba-options` exists to be looked at, so there is no scroll gate
 * here — arriving on the page IS the intent. The shipped locator gates on the
 * viewport instead, because there the section sits several screens down a home
 * page. The module-level cache is shared, so the nine options on this page fetch
 * the register exactly once between them.
 */
export function useLocatorRows(): { rows: DeAddictionCentre[]; ready: boolean } {
  const { status, centres } = useCentres(true);
  return { rows: centres, ready: status === "ready" };
}
