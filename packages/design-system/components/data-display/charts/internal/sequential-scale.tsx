import * as React from "react";
import { CHART_INK, sequentialColor } from "./palette";
import { niceTicks } from "./scales";
import type { ValueFormat } from "./format";

/**
 * The sequential scale and its legend, shared by IndiaMap and IndiaTileMap so a State/UT
 * reading shades and reads the same on either.
 *
 *  - `linear` shades by value against a rounded top.
 *  - `quantile` puts a (near-)equal number of States/UTs in each of five shades, so two
 *    outliers cannot wash the other thirty-four out to the palest step.
 */
export type SequentialScaleKind = "linear" | "quantile";
export type SequentialLegendKind = "steps" | "ramp";

const CLASSES = 5;

export interface SequentialScale {
  max: number;
  /** 0–1 position on the ramp for a figure. */
  ratioOf: (v: number) => number;
  legend: (kind: SequentialLegendKind, format: ValueFormat) => React.ReactNode;
}

export function sequentialScale(values: number[], scale: SequentialScaleKind): SequentialScale {
  const max = Math.max(1, ...values);
  const ticks = niceTicks(0, max, 5);
  const top = ticks[ticks.length - 1] ?? max;
  const sorted = values.filter((v) => v > 0).sort((a, b) => a - b);
  const cuts = Array.from({ length: CLASSES - 1 }, (_, i) => sorted[Math.floor(((i + 1) * sorted.length) / CLASSES)] ?? max);
  const classOf = (v: number) => cuts.filter((c) => v >= c).length;
  const ratioOf = (v: number) => (scale === "quantile" ? (classOf(v) + 1) / CLASSES : v / top);

  const legend = (kind: SequentialLegendKind, lf: ValueFormat) => {
    if (kind === "ramp")
      return (
        <p className="ds-tilemap__ramp" aria-hidden="true">
          <span>{lf(scale === "quantile" ? (sorted[0] ?? 0) : 0)}</span>
          {Array.from({ length: CLASSES }, (_, i) => (
            <span key={i} className="ds-chart__swatch" style={{ backgroundColor: sequentialColor((i + 1) / CLASSES) }} />
          ))}
          <span>{lf(max)}</span>
        </p>
      );
    const steps =
      scale === "quantile"
        ? Array.from({ length: CLASSES }, (_, i) => ({
            ratio: (i + 1) / CLASSES,
            label: i === 0 ? `Under ${lf(cuts[0] ?? max)}` : i === CLASSES - 1 ? `${lf(cuts[CLASSES - 2] ?? 0)} and over` : `${lf(cuts[i - 1] ?? 0)}–${lf(cuts[i] ?? max)}`,
          }))
        : ticks.slice(0, -1).map((t, i) => ({ ratio: (i + 1) / (ticks.length - 1), label: `${lf(t)}–${lf(ticks[i + 1] ?? top)}` }));
    return (
      <ul className="ds-chart__legend ds-chart__legend--horizontal" aria-hidden="true">
        <li className="ds-chart__legend-item">
          <span className="ds-chart__swatch" style={{ backgroundColor: CHART_INK.regionEmpty }} />
          <span className="ds-chart__legend-label">No data</span>
        </li>
        {steps.map((s) => (
          <li key={s.label} className="ds-chart__legend-item">
            <span className="ds-chart__swatch" style={{ backgroundColor: sequentialColor(s.ratio) }} />
            <span className="ds-chart__legend-label">{s.label}</span>
          </li>
        ))}
      </ul>
    );
  };

  return { max, ratioOf, legend };
}
