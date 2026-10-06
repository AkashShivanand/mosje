import type { CardTone } from "@mosje/design-system";
import type { KpiDefinition, PortalId, PortalReading } from "@/lib/kpi/types";
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

/** A figure of the reading, or null — the one accessor the story uses. */
export function figureOf(programme: PortalId, kpiId: string, readings: Readings, kpis: KpiDefinition[]): { value: number; origin: string; kpi: KpiDefinition } | null {
  const k = kpis.find((x) => x.id === kpiId);
  const r = readings[programme]?.[kpiId];
  if (!k || !r) return null;
  const h = headlineOf(k, r);
  return h ? { value: h.value, origin: r.origin, kpi: k } : null;
}

/**
 * A State/UT reading's rows, as the feed gives them — totals only.
 *
 * NO PER-PERSON RATE. It needed a population the Department does not supply, and the only
 * State/UT counts available were Census 2011's, fifteen years older than the figures they
 * would divide (instruction, 6 Oct 2026).
 */
export function areaRows(reading: PortalReading[string] | undefined): { state: string; value: number }[] {
  const v = reading?.value;
  return v?.kind === "areas" ? v.rows.map((r) => ({ state: r.area, value: r.value })) : [];
}

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
