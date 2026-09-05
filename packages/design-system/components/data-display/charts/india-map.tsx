"use client";

import * as React from "react";
import { ChartFrame, type ChartStateProps } from "./internal/chart-frame";
import { ChartTooltip, useChartTooltip } from "./internal/tooltip";
import { sequentialColor, CHART_INK } from "./internal/palette";
import { niceTicks } from "./internal/scales";
import { formatIndian } from "./internal/format";
import type { ValueFormat } from "./internal/format";
import { INDIA_STATES_PATHS, INDIA_STATES_VIEWBOX } from "./geo/india-states.paths";

export interface IndiaMapDatum {
  /** State name. Matched case-insensitively; "and"/"&" are interchangeable. */
  state: string;
  value: number;
}

export interface IndiaMapProps extends ChartStateProps {
  data: IndiaMapDatum[];
  title: string;
  valueFormat?: ValueFormat;
  /** Outline a state by name (e.g. the user's own state). */
  highlightState?: string;
  className?: string;
}

/** Canonicalise state names so "Andaman & Nicobar" == "Andaman and Nicobar Islands". */
function normalize(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/islands?/g, "")
    .replace(/[^a-z]/g, "")
    .trim();
}

/**
 * MoSJE / SAMAVESH IndiaMap — state-level choropleth. Dependency-free: geometry
 * is pre-baked SVG paths (see geo/india-states.paths.ts), shaded with the
 * sequential token ramp. Replaces SMILE's d3-geo + topojson map. Regions are
 * keyboard-navigable and announced; a screen-reader table carries the values.
 */
export function IndiaMap({
  data,
  title,
  valueFormat = formatIndian,
  highlightState,
  className,
  state,
  onRetry,
  filterLabel,
  tableView,
}: IndiaMapProps) {
  const { canvasRef, tip, show, hide } = useChartTooltip();

  const valueByState = React.useMemo(() => {
    const m = new Map<string, number>();
    for (const d of data) m.set(normalize(d.state), d.value);
    return m;
  }, [data]);

  /*
   * WITH NO DATA THIS DREW A COMPLETE GREY INDIA and announced "across 0
   * states". Every region resolved to `undefined`, took the empty tone, and the
   * map looked finished — a citizen had no way to tell a country with no
   * reported figures from a country where every figure was zero. The guard is
   * placed AFTER the memo, per the rule: branch the render, not the derivation.
   */
  const resolved = state ?? (data.length === 0 ? "empty" : undefined);
  if (resolved)
    return (
      <ChartFrame
        marksAreFocusable
        title={title}
        viewBox={INDIA_STATES_VIEWBOX}
        className={className}
        state={resolved}
        onRetry={onRetry}
        filterLabel={filterLabel}
      >
        {null}
      </ChartFrame>
    );

  const max = Math.max(1, ...data.map((d) => d.value));
  const ticks = niceTicks(0, max, 5);
  const niceTop = ticks[ticks.length - 1] ?? max;
  const hl = highlightState ? normalize(highlightState) : null;

  const colorFor = (v: number | undefined) =>
    v === undefined || v === 0 ? CHART_INK.regionEmpty : sequentialColor(v / niceTop);

  return (
    <ChartFrame
      marksAreFocusable
      title={title}
      summary={`State-wise ${title.toLowerCase()} across ${data.length} states; values ${valueFormat(0)}–${valueFormat(max)}`}
      viewBox={INDIA_STATES_VIEWBOX}
      className={className}
      canvasRef={canvasRef}
      overlay={<ChartTooltip tip={tip} />}
      onDismiss={hide}
      legend={
        <ul className="ds-chart__legend ds-chart__legend--horizontal" aria-hidden="true">
          <li className="ds-chart__legend-item">
            <span className="ds-chart__swatch" style={{ backgroundColor: CHART_INK.regionEmpty }} />
            <span className="ds-chart__legend-label">No data</span>
          </li>
          {ticks.slice(0, -1).map((t, i) => (
            <li key={t} className="ds-chart__legend-item">
              <span className="ds-chart__swatch" style={{ backgroundColor: sequentialColor((i + 1) / (ticks.length - 1)) }} />
              <span className="ds-chart__legend-label">
                {valueFormat(t)}–{valueFormat(ticks[i + 1] ?? niceTop)}
              </span>
            </li>
          ))}
        </ul>
      }
      table={{
        columns: ["State", title],
        rows: data.map((d) => [d.state, d.value]),
      }}
      tableView={tableView}
    >
      {INDIA_STATES_PATHS.map((region) => {
        const v = valueByState.get(normalize(region.name));
        const isHL = hl !== null && normalize(region.name) === hl;
        return (
          <path
            key={region.id}
            d={region.d}
            fill={colorFor(v)}
            className="ds-chart__region"
            stroke={isHL ? "var(--sa-color-text-default)" : undefined}
            strokeWidth={isHL ? 1.5 : undefined}
            tabIndex={0}
            role="img"
            aria-label={`${region.name}: ${v === undefined ? "no data" : valueFormat(v)}`}
            onPointerMove={(e) =>
              show(
                <>
                  <div className="ds-chart__tooltip-title">{region.name}</div>
                  <div>{v === undefined ? "No data" : valueFormat(v)}</div>
                </>,
                e.clientX,
                e.clientY,
              )
            }
            onPointerLeave={hide}
            onFocus={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              show(
                <>
                  <div className="ds-chart__tooltip-title">{region.name}</div>
                  <div>{v === undefined ? "No data" : valueFormat(v)}</div>
                </>,
                r.left + r.width / 2,
                r.top,
              );
            }}
            onBlur={hide}
          />
        );
      })}
    </ChartFrame>
  );
}
