/* ============================================================================
   MoSJE / SAMAVESH — Chart shared types
   The superset data shapes every chart in the catalogue accepts.
   ============================================================================ */

/** Single categorical datum. `color` is optional → backward compatible. */
export type ChartDatum = { label: string; value: number; color?: string };

/** A named numeric series aligned to a shared `labels` axis. */
export type ChartSeries = { name: string; data: number[]; color?: string; fill?: boolean };

/** Multi-series shape used by bar (grouped/stacked), line, area and combo charts. */
export type ChartMultiSeries = { labels: string[]; series: ChartSeries[] };

/** Screen-reader data-table equivalent rendered by `ChartFrame`. */
export interface ChartTable {
  columns: string[];
  rows: (string | number)[][];
}
