"use client";

import * as React from "react";
import { ChartFrame, type ChartStateProps } from "./internal/chart-frame";
import { Legend } from "./internal/legend";
import { Gridlines, XAxisLabels } from "./internal/axis";
import { ChartTooltip, useChartTooltip } from "./internal/tooltip";
import { linearScale, niceTicks } from "./internal/scales";
import { seriesColor, categoricalColor, CHART_INK } from "./internal/palette";
import { formatIndian } from "./internal/format";
import type { ValueFormat } from "./internal/format";
import { withheldLabel, type ChartMultiSeries, type ChartSeries, type ChartWithheld } from "./types";

export interface LineChartProps extends ChartMultiSeries, ChartStateProps {
  title: string;
  caption?: React.ReactNode;
  /** Fill the area under every series (per-series `fill` overrides this). */
  area?: boolean;
  yLabel?: string;
  valueFormat?: ValueFormat;
  width?: number;
  height?: number;
  className?: string;
  /** Draw point markers. Defaults to true when ≤ 16 points. */
  showDots?: boolean;
}

/**
 * MoSJE / SAMAVESH LineChart — multi-series line/area with an at-x tooltip
 * guide. Absorbs PM-AJAY `LineArea` and SMILE `ActivityLine`/`MonthlyPerf`.
 *
 * A WITHHELD POINT IS A GAP, NOT A ZERO. `ChartSeries.withheld` names the
 * indices with no figure; the line breaks around them rather than dropping to
 * the baseline, a hollow dashed marker sits where the point would be, and the
 * tooltip and the table say why.
 */
export function LineChart({
  labels,
  series,
  title,
  caption,
  area = false,
  yLabel,
  valueFormat = formatIndian,
  width = 520,
  height = 280,
  className,
  showDots,
  state,
  onRetry,
  filterLabel,
  tableView,
}: LineChartProps) {
  const { canvasRef, tip, show, hide } = useChartTooltip();
  const [active, setActive] = React.useState<number | null>(null);

  // One expression, resolved once; the caller's `state` wins over the shape of
  // the arrays, because only the caller knows WHY they are empty.
  const resolved = state ?? (labels.length === 0 || series.length === 0 ? "empty" : undefined);
  if (resolved)
    return (
      <ChartFrame
        marksAreFocusable
        title={title}
        viewBox={`0 0 ${width} ${height}`}
        className={className}
        caption={caption}
        state={resolved}
        onRetry={onRetry}
        filterLabel={filterLabel}
      >
        {null}
      </ChartFrame>
    );

  const withheldAt = (s: ChartSeries, i: number): ChartWithheld | undefined => s.withheld?.[i];
  const valueAt = (s: ChartSeries, i: number): number | null =>
    withheldAt(s, i) ? null : (s.data[i] ?? 0);
  const cellText = (s: ChartSeries, i: number): string => {
    const w = withheldAt(s, i);
    return w ? withheldLabel(w) : valueFormat(s.data[i] ?? 0);
  };

  const colors = series.map((s, i) => seriesColor(s.color, i));
  const known = series.flatMap((s) => s.data.filter((_, i) => !withheldAt(s, i)));
  const rawMax = Math.max(1, ...known);
  const ticks = niceTicks(0, rawMax);
  const vMax = ticks[ticks.length - 1] ?? rawMax;

  const rotate = labels.length > 6 || labels.some((l) => l.length > 8);
  const padL = 44;
  const padR = 16;
  const padT = 16;
  const padB = rotate ? 54 : 30;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const n = labels.length;

  const xAt = (i: number) => (n === 1 ? padL + plotW / 2 : padL + (i / (n - 1)) * plotW);
  const y = linearScale([0, vMax], [height - padB, padT]);
  const dots = showDots ?? n <= 16;

  /** Contiguous runs of known points — the line breaks at every withheld index. */
  const runs = (s: ChartSeries): number[][] => {
    const out: number[][] = [];
    let run: number[] = [];
    for (let i = 0; i < n; i++) {
      if (valueAt(s, i) === null) {
        if (run.length) out.push(run);
        run = [];
      } else run.push(i);
    }
    if (run.length) out.push(run);
    return out;
  };
  const linePath = (s: ChartSeries) =>
    runs(s)
      .map((run) =>
        run.map((i, k) => `${k === 0 ? "M" : "L"} ${xAt(i).toFixed(2)} ${y(valueAt(s, i) ?? 0).toFixed(2)}`).join(" "),
      )
      .join(" ");
  const areaPath = (s: ChartSeries) =>
    runs(s)
      .map((run) => {
        const first = run[0] ?? 0;
        const last = run[run.length - 1] ?? 0;
        const top = run.map((i, k) => `${k === 0 ? "M" : "L"} ${xAt(i).toFixed(2)} ${y(valueAt(s, i) ?? 0).toFixed(2)}`).join(" ");
        return `${top} L ${xAt(last).toFixed(2)} ${height - padB} L ${xAt(first).toFixed(2)} ${height - padB} Z`;
      })
      .join(" ");

  const tooltipAt = (i: number) => (
    <>
      <div className="ds-chart__tooltip-title">{labels[i]}</div>
      {series.map((s, si) => (
        <div key={s.name} className="ds-chart__tooltip-row">
          <span className="ds-chart__tooltip-swatch" style={{ backgroundColor: colors[si] }} />
          {`${s.name}: ${cellText(s, i)}`}
        </div>
      ))}
    </>
  );

  const latest = (s: ChartSeries): string => {
    for (let i = n - 1; i >= 0; i--) if (valueAt(s, i) !== null) return valueFormat(s.data[i] ?? 0);
    return "no figure";
  };

  return (
    <ChartFrame
      marksAreFocusable
      title={title}
      summary={series.map((s) => `${s.name}: ${latest(s)} latest`).join(", ")}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      canvasRef={canvasRef}
      overlay={<ChartTooltip tip={tip} />}
      onDismiss={hide}
      legend={series.length > 1 ? <Legend items={series.map((s, i) => ({ label: s.name, color: colors[i] ?? categoricalColor(i) }))} /> : undefined}
      caption={caption}
      table={{
        columns: ["Point", ...series.map((s) => s.name)],
        rows: labels.map((l, li) => [l, ...series.map((s) => (withheldAt(s, li) ? cellText(s, li) : (s.data[li] ?? 0)))]),
      }}
      tableView={tableView}
    >
      <Gridlines ticks={ticks.map((v) => ({ pos: y(v), value: v }))} x0={padL} x1={width - padR} format={valueFormat} />
      {yLabel && (
        <text x={12} y={(height - padB + padT) / 2} textAnchor="middle" transform={`rotate(-90 12 ${(height - padB + padT) / 2})`} className="ds-chart__axis-title">
          {yLabel}
        </text>
      )}

      {series.map((s, si) =>
        area || s.fill ? <path key={`a-${s.name}`} d={areaPath(s)} fill={colors[si]} opacity={0.12} /> : null,
      )}
      {series.map((s, si) => (
        /* `pathLength={1}` normalises the line to a unit length so one
           stroke-dasharray keyframe can draw a two-point sparkline and an
           eighty-point series alike. The class is the hook the reveal
           stylesheet animates; it is inert until a page opts in. */
        <path
          key={`l-${s.name}`}
          className="ds-chart__line-draw"
          pathLength={1}
          d={linePath(s)}
          fill="none"
          stroke={colors[si]}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}

      {active !== null && (
        <line x1={xAt(active)} y1={padT} x2={xAt(active)} y2={height - padB} stroke={CHART_INK.axis} strokeWidth={1} strokeDasharray="3 3" />
      )}
      {dots &&
        series.map((s, si) =>
          labels.map((_, i) => {
            const v = valueAt(s, i);
            return v === null ? (
              /* The gap, marked: a hollow dashed ring at the baseline says "a
                 point belongs here and there is no figure", which a plain
                 break in the line could not. */
              <circle
                key={`w-${si}-${i}`}
                cx={xAt(i)}
                cy={height - padB}
                r={3.5}
                className="ds-chart__mark--withheld"
              />
            ) : (
              <circle
                key={`d-${si}-${i}`}
                cx={xAt(i)}
                cy={y(v)}
                r={active === i ? 4 : 2.5}
                fill="var(--sa-bg-neutral-base)"
                stroke={colors[si]}
                strokeWidth={2}
              />
            );
          }),
        )}

      {/* Invisible per-x hit areas — mouse + keyboard. */}
      {labels.map((label, i) => {
        const cx = xAt(i);
        const w = n === 1 ? plotW : plotW / (n - 1);
        return (
          <rect
            key={`hit-${label}`}
            x={cx - w / 2}
            y={padT}
            width={w}
            height={plotH}
            fill="transparent"
            tabIndex={0}
            role="img"
            aria-label={`${label}: ${series.map((s) => `${s.name} ${cellText(s, i)}`).join(", ")}`}
            onPointerMove={(e) => {
              setActive(i);
              show(tooltipAt(i), e.clientX, e.clientY);
            }}
            onPointerLeave={() => {
              setActive(null);
              hide();
            }}
            onFocus={() => {
              setActive(i);
              const r = canvasRef.current?.getBoundingClientRect();
              const first = series[0] ? valueAt(series[0], i) : null;
              if (r) show(tooltipAt(i), r.left + (cx / width) * r.width, r.top + (y(first ?? 0) / height) * r.height);
            }}
            onBlur={() => {
              setActive(null);
              hide();
            }}
          />
        );
      })}

      <XAxisLabels labels={labels} x={(l) => xAt(labels.indexOf(l))} y={height - padB + 16} rotate={rotate ? -35 : 0} />
    </ChartFrame>
  );
}
