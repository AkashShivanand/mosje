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
 * IT COULD BE SIX, AND THAT CHANGE IS PREPARED BUT NOT MADE. An exhaustive
 * maximum-clique over all 4,095 subsets of the twelve finds SIX mutually
 * distinguishable slots — 1, 2, 3, 4, 6 and 8. Reordering the ramp to put
 * those first raises this cap to six, invents no colour, and leaves slots 1–4
 * unmoved so charts of four or fewer series are pixel-identical. It was built
 * and verified, then reverted: `figma-value-parity` correctly refuses a value
 * change that has not been pushed to Figma and read back, and that needs a
 * token no agent session may handle. The full procedure is in
 * `docs/audit/ds-world-class-audit.md`.
 *
 * SIX IS ALSO THE CEILING, and that is a property of vision rather than of
 * this palette. `tools/chart-palette/search.mjs` searches the whole admissible
 * region — every sRGB colour inside the lightness band and chroma floor that
 * clears 3:1 on both surfaces and is not confusable with a semantic ink — and
 * the largest mutually distinguishable set it finds is 6 at this estate's
 * saturation, 7 at a louder one, and 9 only with near-neon colours no
 * government page would ship. A dichromat's gamut is effectively
 * two-dimensional, so hues that are far apart in full colour vision collapse
 * together. Twelve distinguishable categorical colours do not exist.
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
