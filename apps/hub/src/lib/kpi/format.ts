import type { KpiUnit } from "./types.ts";

const IN = (n: number, digits = 0) =>
  n.toLocaleString("en-IN", { minimumFractionDigits: digits, maximumFractionDigits: digits });

/** A figure as the Department prints it: Indian grouping, ₹ … Cr, one-decimal percentages. */
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

/** "19.06.2026" → "2026-06-19", for `DataProvenance.asOf`, which takes an ISO date. */
export function isoDate(ddmmyyyy: string): string {
  const [d, m, y] = ddmmyyyy.split(".");
  return y && m && d ? `${y}-${m}-${d}` : ddmmyyyy;
}
