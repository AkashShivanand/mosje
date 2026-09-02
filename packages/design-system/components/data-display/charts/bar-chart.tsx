"use client";

import * as React from "react";
import { ChartFrame, type ChartStateProps } from "./internal/chart-frame";
import { Legend } from "./internal/legend";
import { Gridlines, XAxisLabels } from "./internal/axis";
import { ChartTooltip, useChartTooltip } from "./internal/tooltip";
import { bandScale, linearScale, niceTicks } from "./internal/scales";
import { seriesColor, categoricalColor, CHART_INK } from "./internal/palette";
import { formatIndian } from "./internal/format";
import type { ValueFormat } from "./internal/format";
import type { ChartDatum, ChartSeries } from "./types";

interface BarBase extends ChartStateProps {
  title: string;
  caption?: React.ReactNode;
  orientation?: "vertical" | "horizontal";
  /** Only meaningful with multiple series. */
  variant?: "grouped" | "stacked";
  yLabel?: string;
  valueFormat?: ValueFormat;
  width?: number;
  height?: number;
  showValues?: boolean;
  /**
   * Pin the value axis instead of letting the chart fit its own data.
   *
   * Required for `SmallMultiples`: panels are only comparable when they share
   * one ceiling, and a chart that fits its own data draws a state with 40
   * beneficiaries the same as one with 40,000. Pass the `sharedMax` that
   * component hands you.
   *
   * Ignored when it is below the data's own maximum — silently clipping bars
   * would be worse than overriding the caller.
   */
  max?: number;
  className?: string;
}
interface BarSingle extends BarBase {
  data: ChartDatum[];
}
interface BarMulti extends BarBase {
  labels: string[];
  series: ChartSeries[];
}
export type BarChartProps = BarSingle | BarMulti;

function isSingle(p: BarChartProps): p is BarSingle {
  return Array.isArray((p as BarSingle).data);
}

/**
 * MoSJE / SAMAVESH BarChart — vertical|horizontal, single|grouped|stacked.
 * **Backward-compatible** with the legacy `{ data, title, yLabel? }` API.
 * Absorbs PM-AJAY `HBars`/`VBars` and SMILE `AgeBars`/`TypeBars`/`ShelterStateBars`.
 */
export function BarChart(props: BarChartProps) {
  const {
    title,
    caption,
    orientation = "vertical",
    variant = "grouped",
    yLabel,
    valueFormat = formatIndian,
    showValues,
    className,
    state,
    onRetry,
    filterLabel,
    tableView,
    textured,
    max,
  } = props;
  const { canvasRef, tip, show, hide } = useChartTooltip();

  // Normalise to labels + series, tracking per-bar colours for single-series mode.
  const single = isSingle(props);
  const labels = single ? props.data.map((d) => d.label) : props.labels;
  const series: ChartSeries[] = single
    ? [{ name: yLabel ?? title, data: props.data.map((d) => d.value) }]
    : props.series;
  const singleColors = single ? props.data.map((d, i) => d.color ?? categoricalColor(i)) : null;

  const width = props.width ?? 480;
  const height = props.height ?? 280;

  /*
   * ONE EXPRESSION, resolved before anything downstream reads it. The caller's
   * `state` wins where it is given — only the caller knows whether the feed was
   * asked and answered nothing, failed, or was filtered away by the reader — and
   * "the arrays are empty" falls back to `"empty"`, which is what this chart
   * already did.
   */
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

  const stacked = !single && variant === "stacked" && series.length > 1;
  const seriesColors = series.map((s, i) => seriesColor(s.color, i));
  const showVals = showValues ?? single;

  // Domain max.
  const perLabelMax = labels.map((_, li) =>
    stacked
      ? series.reduce((sum, s) => sum + (s.data[li] ?? 0), 0)
      : Math.max(0, ...series.map((s) => s.data[li] ?? 0)),
  );
  // `max` pins the axis for small multiples; it can only ever RAISE the
  // ceiling, because honouring a max below the data would clip bars off the
  // top and misreport the very figures the chart exists to show.
  const rawMax = Math.max(1, ...perLabelMax, max ?? 0);
  const ticks = niceTicks(0, rawMax);
  const vMax = ticks[ticks.length - 1] ?? rawMax;

  const colorFor = (li: number, si: number) =>
    (singleColors ? singleColors[li] : seriesColors[si]) ?? categoricalColor(si);
  const tooltipFor = (li: number, si: number, val: number) => (
    <>
      <div className="ds-chart__tooltip-title">{labels[li]}</div>
      <div className="ds-chart__tooltip-row">
        <span className="ds-chart__tooltip-swatch" style={{ backgroundColor: colorFor(li, si) }} />
        {single ? valueFormat(val) : `${series[si]?.name ?? ""}: ${valueFormat(val)}`}
      </div>
    </>
  );

  const legend =
    !single && series.length > 1 ? (
      <Legend items={series.map((s, i) => ({ label: s.name, color: seriesColors[i] ?? categoricalColor(i) }))} />
    ) : null;
  const table = {
    columns: ["Category", ...series.map((s) => s.name)],
    rows: labels.map((l, li) => [l, ...series.map((s) => s.data[li] ?? 0)]),
  };

  // ── Vertical ───────────────────────────────────────────────────────────
  if (orientation === "vertical") {
    const rotate = labels.length > 6 || labels.some((l) => l.length > 8);
    const padL = 44;
    const padR = 12;
    const padT = showVals ? 22 : 14;
    const padB = rotate ? 58 : 30;
    const x = bandScale(labels, [padL, width - padR], 0.3);
    const y = linearScale([0, vMax], [height - padB, padT]);
    const band = x.bandwidth();

    return (
      <ChartFrame
        marksAreFocusable
        title={title}
        summary={labels.map((l, li) => `${l}: ${valueFormat(perLabelMax[li] ?? 0)}`).join(", ")}
        viewBox={`0 0 ${width} ${height}`}
        className={className}
        canvasRef={canvasRef}
        overlay={<ChartTooltip tip={tip} />}
        legend={legend}
        caption={caption}
        table={table}
        tableView={tableView}
        textured={textured}
      >
        <Gridlines
          ticks={ticks.map((v) => ({ pos: y(v), value: v }))}
          x0={padL}
          x1={width - padR}
          format={valueFormat}
        />
        {yLabel && (
          <text
            x={12}
            y={(height - padB + padT) / 2}
            textAnchor="middle"
            transform={`rotate(-90 12 ${(height - padB + padT) / 2})`}
            className="ds-chart__axis-title"
          >
            {yLabel}
          </text>
        )}
        {labels.map((label, li) => {
          const groupX = x(label);
          let stackTop = height - padB;
          return series.map((s, si) => {
            const val = s.data[li] ?? 0;
            const h = ((val / vMax) * (height - padB - padT));
            let bx: number;
            let bw: number;
            let by: number;
            if (stacked) {
              bw = band * 0.74;
              bx = groupX + (band - bw) / 2;
              by = stackTop - h;
              stackTop = by;
            } else {
              bw = single ? band * 0.66 : (band * 0.82) / series.length;
              bx = single ? groupX + (band - bw) / 2 : groupX + band * 0.09 + si * bw;
              by = y(val);
            }
            return (
              <g key={`${label}-${si}`}>
                <rect
                  x={bx}
                  y={by}
                  width={Math.max(1, bw)}
                  height={Math.max(0, h)}
                  rx={stacked ? 0 : 3}
                  fill={colorFor(li, si)}
                  className="ds-chart__mark"
                  tabIndex={0}
                  role="img"
                  aria-label={`${labels[li]}${single ? "" : `, ${s.name}`}: ${valueFormat(val)}`}
                  onPointerMove={(e) => show(tooltipFor(li, si, val), e.clientX, e.clientY)}
                  onPointerLeave={hide}
                  onFocus={(e) => {
                    const r = e.currentTarget.getBoundingClientRect();
                    show(tooltipFor(li, si, val), r.left + r.width / 2, r.top);
                  }}
                  onBlur={hide}
                />
                {showVals && !stacked && h > 0 && (
                  <text x={bx + bw / 2} y={by - 4} textAnchor="middle" className="ds-chart__value">
                    {valueFormat(val)}
                  </text>
                )}
              </g>
            );
          });
        })}
        <XAxisLabels labels={labels} x={(l) => x(l) + band / 2} y={height - padB + 16} rotate={rotate ? -35 : 0} />
      </ChartFrame>
    );
  }

  // ── Horizontal ─────────────────────────────────────────────────────────
  const padL = 116;
  const padR = 44;
  const padT = 8;
  const padB = 26;
  const y = bandScale(labels, [padT, height - padB], 0.3);
  const x = linearScale([0, vMax], [padL, width - padR]);
  const band = y.bandwidth();

  return (
    <ChartFrame
      marksAreFocusable
      title={title}
      summary={labels.map((l, li) => `${l}: ${valueFormat(perLabelMax[li] ?? 0)}`).join(", ")}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      canvasRef={canvasRef}
      overlay={<ChartTooltip tip={tip} />}
      legend={legend}
      caption={caption}
      table={table}
      tableView={tableView}
        textured={textured}
    >
      {ticks.map((v) => (
        <line
          key={v}
          x1={x(v)}
          y1={padT}
          x2={x(v)}
          y2={height - padB}
          stroke={CHART_INK.grid}
          strokeWidth={1}
          shapeRendering="crispEdges"
        />
      ))}
      {labels.map((label, li) => {
        const groupY = y(label);
        let stackLeft = padL;
        return series.map((s, si) => {
          const val = s.data[li] ?? 0;
          const w = (val / vMax) * (width - padL - padR);
          let by: number;
          let bh: number;
          let bx: number;
          if (stacked) {
            bh = band * 0.74;
            by = groupY + (band - bh) / 2;
            bx = stackLeft;
            stackLeft += w;
          } else {
            bh = single ? band * 0.62 : (band * 0.82) / series.length;
            by = single ? groupY + (band - bh) / 2 : groupY + band * 0.09 + si * bh;
            bx = padL;
          }
          return (
            <g key={`${label}-${si}`}>
              <rect
                x={bx}
                y={by}
                width={Math.max(0, w)}
                height={Math.max(1, bh)}
                /* A stack is ONE bar made of parts. Rounding every segment drew
                   each part as its own pill, so a 100%-stacked row read as three
                   detached lozenges with notches between them rather than a
                   single bar divided up. Only a bar that stands alone gets a
                   radius. */
                rx={stacked ? 0 : 3}
                fill={colorFor(li, si)}
                className="ds-chart__mark"
                tabIndex={0}
                role="img"
                aria-label={`${labels[li]}${single ? "" : `, ${s.name}`}: ${valueFormat(val)}`}
                onPointerMove={(e) => show(tooltipFor(li, si, val), e.clientX, e.clientY)}
                onPointerLeave={hide}
                onFocus={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  show(tooltipFor(li, si, val), r.left + r.width / 2, r.top);
                }}
                onBlur={hide}
              />
              {showVals && !stacked && (
                <text x={bx + w + 4} y={by + bh / 2 + 3} textAnchor="start" className="ds-chart__value">
                  {valueFormat(val)}
                </text>
              )}
            </g>
          );
        });
      })}
      {labels.map((label) => (
        <text
          key={label}
          x={padL - 8}
          y={y(label) + band / 2 + 3}
          textAnchor="end"
          className="ds-chart__axis"
        >
          {label.length > 16 ? `${label.slice(0, 15)}…` : label}
        </text>
      ))}
    </ChartFrame>
  );
}
