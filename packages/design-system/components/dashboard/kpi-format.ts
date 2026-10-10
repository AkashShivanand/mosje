import type { KpiUnit } from "./kpi-types";

/**
 * Figures as the Department prints them. Moved from the website dashboard
 * (`apps/hub/src/lib/kpi/format.ts`, Oct 2026) with `KpiView`, which draws with them.
 */

const IN = (n: number, digits = 0) =>
  n.toLocaleString("en-IN", { minimumFractionDigits: digits, maximumFractionDigits: digits });

/** Indian grouping, ₹ … Cr, one-decimal percentages. */
export function formatKpi(value: number, unit: KpiUnit): string {
  switch (unit) {
    case "crore":
      return `₹${IN(value, value >= 1000 ? 0 : 2)} Cr`;
    case "percent":
      return `${IN(value, 1)}%`;
    case "days":
      return `${IN(value)} ${value === 1 ? "day" : "days"}`;
    default:
      return IN(value);
  }
}

/** A formatter bound to a unit, for a chart's `valueFormat`. */
export const kpiFormatter = (unit: KpiUnit) => (value: number) => formatKpi(value, unit);

/** A count in lakh and crore: "11.87 Cr", "4.88 lakh", "80,629". */
export function compactCount(n: number): string {
  if (Math.abs(n) >= 1_00_00_000) return `${(n / 1_00_00_000).toLocaleString("en-IN", { maximumFractionDigits: 2 })} Cr`;
  if (Math.abs(n) >= 1_00_000) return `${(n / 1_00_000).toLocaleString("en-IN", { maximumFractionDigits: 2 })} lakh`;
  return Math.round(n).toLocaleString("en-IN");
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "05.10.2026" → "05 Oct 2026", the one form a dashboard prints a date in. */
export function shownDate(ddmmyyyy: string): string {
  const [d, m, y] = ddmmyyyy.split(".");
  const month = MONTHS[Number(m) - 1];
  return d && month && y ? `${d} ${month} ${y}` : ddmmyyyy;
}

/** "19.06.2026" → "2026-06-19", for `DataProvenance.asOf`, which takes an ISO date. */
export function isoDate(ddmmyyyy: string): string {
  const [d, m, y] = ddmmyyyy.split(".");
  return y && m && d ? `${y}-${m}-${d}` : ddmmyyyy;
}
