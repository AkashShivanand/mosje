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

/**
 * How many categorical slots are actually distinguishable — MEASURED, not chosen.
 *
 * `npm run check:chart-palette` runs the ramp through five checks (lightness
 * band, chroma floor, colour-vision-deficiency separation, normal-vision
 * separation, contrast on the chart surface). Under **all pairs** — which is
 * what a filtered chart draws, since a filter can leave slots 4 and 10 with
 * nothing between them — only the first four slots clear every floor.
 *
 * Beyond four, the ramp reuses perceptual territory. Two of the pairs are not
 * marginal:
 *
 *   cat-4 ↔ cat-10   ΔE  1.5 under deuteranopia — the same colour to roughly
 *                    one man in twelve
 *   cat-6 ↔ cat-12   ΔE  4.4 under protanopia
 *   cat-8 ↔ cat-9    ΔE 11.7 with NORMAL colour vision — below the floor of
 *                    15, so nobody separates them reliably
 *
 * **This is a cap on colour as the SOLE encoding, not a cap on series.** A
 * fifth series is fine when identity is carried by something else as well:
 * direct labels on the marks, small multiples, or folding the tail into
 * "Other". What is not fine is a fifth colour asked to do the work alone.
 *
 * The gate fails if this constant and the measured cap disagree, so the number
 * cannot drift away from the ramp it describes.
 */
export const CHART_CATEGORICAL_SAFE_CAP = 4;
