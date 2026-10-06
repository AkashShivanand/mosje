import type { CardTone } from "@mosje/design-system";
import { POPULATION_2026_LAKH } from "@/lib/kpi/geography";
import type { AreaScope, KpiDefinition, PortalId, PortalReading } from "@/lib/kpi/types";
import { headlineOf, readinessOf, type Readiness, type Readings, type Viewing } from "./model";

/**
 * The figures the proposed dashboard's story is told with, each derived from the one set
 * of resolved readings (`readAll`) — never re-read, never mixed across sources.
 */

/** Each programme's colour family on the page: its tile edge, its hero, its story band. */
export const PROGRAMME_TONE: Record<PortalId, CardTone> = {
  nmba: "success",
  "smile-beggary": "secondary",
  "e-utthaan": "primary",
  shreshta: "info",
  "senior-citizens": "warning",
};

/** "34.81 Cr", "1.04 lakh", "₹1.77 lakh Cr" — a figure a reader takes in at a glance. */
export function compact(n: number, unit: KpiDefinition["unit"]): string {
  if (unit === "percent") return `${(Math.round(n * 10) / 10).toLocaleString("en-IN")}%`;
  if (unit === "days") return `${Math.round(n).toLocaleString("en-IN")} days`;
  if (unit === "crore") {
    if (n >= 1_00_000) return `₹${(n / 1_00_000).toLocaleString("en-IN", { maximumFractionDigits: 2 })} lakh Cr`;
    return `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })} Cr`;
  }
  if (n >= 1_00_00_000) return `${(n / 1_00_00_000).toLocaleString("en-IN", { maximumFractionDigits: 2 })} Cr`;
  if (n >= 1_00_000) return `${(n / 1_00_000).toLocaleString("en-IN", { maximumFractionDigits: 2 })} lakh`;
  return n.toLocaleString("en-IN");
}

/** Projected 2026 population, in people, for the scope (`POPULATION_2026_LAKH`). */
export function populationOf(scope: AreaScope): number | undefined {
  if (scope.district) return undefined;
  if (scope.state) {
    const lakh = POPULATION_2026_LAKH[scope.state];
    return lakh === undefined ? undefined : lakh * 1_00_000;
  }
  return Object.values(POPULATION_2026_LAKH).reduce((t, v) => t + v, 0) * 1_00_000;
}

/** A figure of the reading, or null — the one accessor the story uses. */
export function figureOf(programme: PortalId, kpiId: string, readings: Readings, kpis: KpiDefinition[]): { value: number; origin: string; kpi: KpiDefinition } | null {
  const k = kpis.find((x) => x.id === kpiId);
  const r = readings[programme]?.[kpiId];
  if (!k || !r) return null;
  const h = headlineOf(k, r);
  return h ? { value: h.value, origin: r.origin, kpi: k } : null;
}

/**
 * A State/UT reading, per 100 residents where the measure is a count, against the 2026
 * projection.
 *
 * WHY IT CAN EXCEED 100, AND WHY THE NAME SAYS "OUTREACH". NMBA's "People Reached" is a
 * running cumulative count since August 2020; the portal does not say that a person
 * reached at two activities is counted once, and its totals only make sense if they are
 * not: Chandigarh's 44 lakh is 3.5 times its population. So the rate is outreach per 100
 * residents — like vaccine doses per 100 people — never "people per 100 people", which
 * printed "417 per 100 people" and read as a misprint (feedback, 6 Oct 2026).
 */
export function perHundredRows(reading: PortalReading[string] | undefined, perHundred: boolean): { state: string; value: number }[] {
  const v = reading?.value;
  if (v?.kind !== "areas") return [];
  return v.rows
    .filter((r) => !perHundred || POPULATION_2026_LAKH[r.area] !== undefined)
    .map((r) => {
      if (!perHundred) return { state: r.area, value: r.value };
      const per = r.value / (POPULATION_2026_LAKH[r.area]! * 1_000);
      return { state: r.area, value: per < 10 ? Math.round(per * 10) / 10 : Math.round(per) };
    });
}

/** "347 per 100 residents". */
export const perHundred = (v: number) => `${v.toLocaleString("en-IN")} per 100 residents`;

export const READINESS_ORDER: Readiness[] = ["live", "available", "partial", "none", "not-stated"];

/**
 * Categorical slots chosen, not taken in order, so the waffle reads as the badges do —
 * green live, blue available, brown partial, red none — without a series wearing a status
 * token (`semantic.json` `chart/cat`). Slots 1–9 only (`check:chart-slots`).
 */
export const READINESS_SLOT: Record<Readiness, string> = {
  live: "var(--sa-chart-cat-4)",
  available: "var(--sa-chart-cat-1)",
  partial: "var(--sa-chart-cat-6)",
  none: "var(--sa-chart-cat-2)",
  "not-stated": "var(--sa-chart-cat-7)",
};

export function readinessRows(viewing: Viewing, readings: Readings) {
  return viewing.programmes.flatMap((p) =>
    p.kpis.filter((k) => !k.id.endsWith("-by-state")).map((k) => ({ p, k, status: readinessOf(k, readings[p.id]?.[k.id]) })),
  );
}
