/* ============================================================================
   Token-driven colour resolution for charts. Every colour is a `var(--ds-*)`
   string so charts re-theme automatically under data-brand / data-theme.
   ============================================================================ */

export const CHART_CATEGORICAL_COUNT = 12;

/** Categorical series colour for a 0-based series index (wraps at 12). */
export function categoricalColor(index: number): string {
  const i = ((index % CHART_CATEGORICAL_COUNT) + CHART_CATEGORICAL_COUNT) % CHART_CATEGORICAL_COUNT;
  return `var(--ds-chart-cat-${i + 1})`;
}

const SEQ_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

/** Sequential (single-hue) colour for a normalised value t ∈ [0,1]. */
export function sequentialColor(t: number): string {
  const clamped = Math.max(0, Math.min(1, Number.isFinite(t) ? t : 0));
  const idx = Math.round(clamped * (SEQ_STEPS.length - 1));
  return `var(--ds-chart-seq-${SEQ_STEPS[idx]})`;
}

/** Diverging colour for a signed normalised value t ∈ [-1,1]. */
export function divergingColor(t: number): string {
  if (t <= -0.66) return "var(--ds-chart-div-neg-strong)";
  if (t <= -0.25) return "var(--ds-chart-div-neg)";
  if (t < 0.25) return "var(--ds-chart-div-mid)";
  if (t < 0.66) return "var(--ds-chart-div-pos)";
  return "var(--ds-chart-div-pos-strong)";
}

/** Explicit per-series colour wins; otherwise fall back to the categorical ramp. */
export function seriesColor(explicit: string | undefined, index: number): string {
  return explicit ?? categoricalColor(index);
}

/** Structural + semantic chart colours, all token-backed. */
export const CHART_INK = {
  grid: "var(--ds-chart-grid)",
  axis: "var(--ds-chart-axis)",
  label: "var(--ds-ink)",
  value: "var(--ds-ink)",
  muted: "var(--ds-ink-muted)",
  surface: "var(--ds-surface)",
  tooltipBg: "var(--ds-chart-tooltip-bg)",
  tooltipInk: "var(--ds-chart-tooltip-ink)",
  trendUp: "var(--ds-chart-trend-up)",
  trendDown: "var(--ds-chart-trend-down)",
  trendFlat: "var(--ds-chart-trend-flat)",
  regionEmpty: "var(--ds-chart-region-empty)",
  regionStroke: "var(--ds-chart-region-stroke)",
} as const;
