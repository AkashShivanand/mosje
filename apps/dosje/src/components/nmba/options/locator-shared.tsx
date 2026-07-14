"use client";

import dynamic from "next/dynamic";
import { DEADDICTION_CENTRES, type CentreType, type DeAddictionCentre } from "@/content/deaddiction-centres";

export const CentreMapDynamic = dynamic(
  () => import("../CentreMapCanvas").then((m) => m.CentreMapCanvas),
  { ssr: false, loading: () => <div className="h-full min-h-[320px] w-full animate-pulse bg-surface-muted" aria-hidden /> },
);

export const centreKey = (c: DeAddictionCentre) => `${c.name}|${c.lat}|${c.lng}`;

export const ALL_STATES = Array.from(new Set(DEADDICTION_CENTRES.map((c) => c.state))).sort((a, b) =>
  a.localeCompare(b),
);

export const districtsForState = (s: string) =>
  Array.from(new Set(DEADDICTION_CENTRES.filter((c) => c.state === s).map((c) => c.district))).sort((a, b) =>
    a.localeCompare(b),
  );

export interface Filters {
  query?: string;
  state?: string;
  district?: string;
  type?: CentreType | "";
}

export function filterCentres({ query = "", state = "", district = "", type = "" }: Filters): DeAddictionCentre[] {
  const q = query.trim().toLowerCase();
  return DEADDICTION_CENTRES.filter((c) => {
    if (state && c.state !== state) return false;
    if (district && c.district !== district) return false;
    if (type && c.type !== type) return false;
    if (q && !`${c.name} ${c.address} ${c.district} ${c.state} ${c.type}`.toLowerCase().includes(q)) return false;
    return true;
  });
}
