/* ============================================================================
   Token-driven colour resolution for charts. Every colour is a `var(--sa-*)`
   string so charts re-theme automatically under data-brand / data-theme.
   ============================================================================ */

export const CHART_CATEGORICAL_COUNT = 12;

/**
 * Categorical series colour for a 0-based series index.
 *
 * IT STILL WRAPS, AND THE WRAP IS NOW AUDIBLE. A thirteenth series used to be
 * handed `--sa-chart-cat-1` — the identical colour to the first — with nothing
 * said, so a chart could draw two different things in one colour and read as
 * correct. Wrapping is not the right answer to running out of hues (the right
 * answer is to fold the tail into "Other", facet into small multiples, or add a
 * second encoding), but throwing on a dashboard is worse than a duplicated
 * colour: a citizen's page must not go blank because a feed grew a column.
 *
 * So the colour is still returned, and development is told. `categoricalColor`
 * is called once per series per render, so the warning is de-duplicated by
 * index — without that, an animating chart writes a line per frame.
 *
 * See `CHART_CATEGORICAL_SAFE_CAP` in `../types.ts`: only the first FOUR slots
 * are separable under all-pairs, so this ceiling is the second of two limits and
 * not the one most charts meet first.
 */
const warnedIndices = new Set<number>();

export function categoricalColor(index: number): string {
  if (index >= CHART_CATEGORICAL_COUNT || index < 0) {
    // `process` is not typed in this package (no @types/node, deliberately —
    // it ships to browsers), so the environment is read off globalThis.
    const env = (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env?.NODE_ENV;
    if (env !== "production" && !warnedIndices.has(index)) {
      warnedIndices.add(index);
      console.warn(
        `[SAMAVESH charts] series ${index} reuses the colour of series ` +
          `${((index % CHART_CATEGORICAL_COUNT) + CHART_CATEGORICAL_COUNT) % CHART_CATEGORICAL_COUNT} — ` +
          `the categorical ramp has ${CHART_CATEGORICAL_COUNT} slots. Two series are now drawn in one ` +
          `colour. Fold the tail into "Other", facet into small multiples, or carry identity with ` +
          `direct labels instead of colour alone.`,
      );
    }
  }
  const i = ((index % CHART_CATEGORICAL_COUNT) + CHART_CATEGORICAL_COUNT) % CHART_CATEGORICAL_COUNT;
  return `var(--sa-chart-cat-${i + 1})`;
}

const SEQ_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

/** Sequential (single-hue) colour for a normalised value t ∈ [0,1]. */
export function sequentialColor(t: number): string {
  const clamped = Math.max(0, Math.min(1, Number.isFinite(t) ? t : 0));
  const idx = Math.round(clamped * (SEQ_STEPS.length - 1));
  return `var(--sa-chart-seq-${SEQ_STEPS[idx]})`;
}

/** Diverging colour for a signed normalised value t ∈ [-1,1]. */
export function divergingColor(t: number): string {
  if (t <= -0.66) return "var(--sa-chart-div-negStrong)";
  if (t <= -0.25) return "var(--sa-chart-div-neg)";
  if (t < 0.25) return "var(--sa-chart-div-mid)";
  if (t < 0.66) return "var(--sa-chart-div-pos)";
  return "var(--sa-chart-div-posStrong)";
}

/** Explicit per-series colour wins; otherwise fall back to the categorical ramp. */
export function seriesColor(explicit: string | undefined, index: number): string {
  return explicit ?? categoricalColor(index);
}

/** Structural + semantic chart colours, all token-backed. */
export const CHART_INK = {
  grid: "var(--sa-chart-grid)",
  axis: "var(--sa-chart-axis)",
  label: "var(--sa-color-text-default)",
  value: "var(--sa-color-text-default)",
  muted: "var(--sa-color-text-muted)",
  surface: "var(--sa-bg-neutral-base)",
  tooltipBg: "var(--sa-chart-tooltipBg)",
  tooltipInk: "var(--sa-chart-tooltipInk)",
  trendUp: "var(--sa-chart-trend-up)",
  trendDown: "var(--sa-chart-trend-down)",
  trendFlat: "var(--sa-chart-trend-flat)",
  regionEmpty: "var(--sa-chart-regionEmpty)",
  regionStroke: "var(--sa-chart-regionStroke)",
} as const;
