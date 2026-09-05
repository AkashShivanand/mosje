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
import { withheldLabel, type ChartDatum, type ChartSeries, type ChartWithheld } from "./types";

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
  /**
   * The one category the reader is looking at — the current month in a
   * monthly trend. That bar keeps its colour and every other bar drops to the
   * sequential ramp's light rung, so the comparison reads at a glance. It is
   * named in the summary sentence, so a screen reader is told which bar is
   * current rather than left to infer it from colour.
   */
  highlightIndex?: number;
  /**
   * A reference value drawn as a dashed line across the plot, in the same
   * units as the bars — a target, a national average, a sanctioned ceiling.
   * It joins the axis domain so it is always inside the plot.
   */
  target?: number;
  /** Text at the line. @default "Target N" */
  targetLabel?: string;
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

/** The light rung every non-highlighted bar drops to. Token-bound; never a literal. */
const MUTED_FILL = "var(--sa-chart-seq-300)";

/**
 * MoSJE / SAMAVESH BarChart — vertical|horizontal, single|grouped|stacked.
 * **Backward-compatible** with the legacy `{ data, title, yLabel? }` API.
 * Absorbs PM-AJAY `HBars`/`VBars` and SMILE `AgeBars`/`TypeBars`/`ShelterStateBars`.
 *
 * Bars start at zero. Always. It is not configurable, and it is the clearest
 * expression of the system's second principle: a non-expert cannot build a
 * misleading bar chart here.
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
    highlightIndex,
    target,
    targetLabel,
  } = props;
  const { canvasRef, tip, show, hide } = useChartTooltip();

  // Normalise to labels + series, tracking per-bar colours for single-series mode.
  const single = isSingle(props);
  const labels = single ? props.data.map((d) => d.label) : props.labels;
  const series: ChartSeries[] = single
    ? [
        {
          name: yLabel ?? title,
          data: props.data.map((d) => d.value),
          withheld: Object.fromEntries(
            props.data.flatMap((d, i) => (d.withheld ? [[i, d.withheld]] : [])),
          ),
        },
      ]
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

  /*
   * A WITHHELD CELL IS NOT A ZERO. It contributes nothing to the domain, nothing
   * to a stack, and is drawn as a hatched stub with its reason in the tooltip
   * and the table — so a suppressed count of "<5" cannot be read as "none".
   */
  const withheldAt = (li: number, si: number): ChartWithheld | undefined =>
    series[si]?.withheld?.[li];
  const valueAt = (li: number, si: number): number =>
    withheldAt(li, si) ? 0 : (series[si]?.data[li] ?? 0);

  // Domain max.
  const perLabelMax = labels.map((_, li) =>
    stacked
      ? series.reduce((sum, _s, si) => sum + valueAt(li, si), 0)
      : Math.max(0, ...series.map((_s, si) => valueAt(li, si))),
  );
  // `max` pins the axis for small multiples; it can only ever RAISE the
  // ceiling, because honouring a max below the data would clip bars off the
  // top and misreport the very figures the chart exists to show. A target
  // joins the domain for the same reason: a line drawn off the plot is a lie.
  const targetValue = target !== undefined && Number.isFinite(target) ? target : null;
  const rawMax = Math.max(1, ...perLabelMax, max ?? 0, targetValue ?? 0);
  const ticks = niceTicks(0, rawMax);
  const vMax = ticks[ticks.length - 1] ?? rawMax;
  const targetText = targetValue !== null ? (targetLabel ?? `Target ${valueFormat(targetValue)}`) : "";

  const highlighted = (li: number) => highlightIndex === undefined || highlightIndex === li;
  const colorFor = (li: number, si: number) => {
    const own = (singleColors ? singleColors[li] : seriesColors[si]) ?? categoricalColor(si);
    return highlighted(li) ? own : MUTED_FILL;
  };
  const cellText = (li: number, si: number): string => {
    const w = withheldAt(li, si);
    return w ? withheldLabel(w) : valueFormat(valueAt(li, si));
  };
  const markLabel = (li: number, si: number): string =>
    `${labels[li]}${single ? "" : `, ${series[si]?.name ?? ""}`}: ${cellText(li, si)}${
      highlightIndex === li ? " (current)" : ""
    }`;
  const tooltipFor = (li: number, si: number) => (
    <>
      <div className="ds-chart__tooltip-title">{labels[li]}</div>
      <div className="ds-chart__tooltip-row">
        <span className="ds-chart__tooltip-swatch" style={{ backgroundColor: colorFor(li, si) }} />
        {single ? cellText(li, si) : `${series[si]?.name ?? ""}: ${cellText(li, si)}`}
      </div>
    </>
  );

  const legend =
    !single && series.length > 1 ? (
      <Legend items={series.map((s, i) => ({ label: s.name, color: seriesColors[i] ?? categoricalColor(i) }))} />
    ) : null;
  const table = {
    columns: ["Category", ...series.map((s) => s.name)],
    rows: labels.map((l, li) => [
      l,
      ...series.map((_s, si) => (withheldAt(li, si) ? cellText(li, si) : valueAt(li, si))),
    ]),
  };
  const summary = [
    ...labels.map((l, li) =>
      single ? `${l}: ${cellText(li, 0)}` : `${l}: ${valueFormat(perLabelMax[li] ?? 0)}`,
    ),
    ...(highlightIndex !== undefined && labels[highlightIndex] ? [`Current: ${labels[highlightIndex]}`] : []),
    ...(targetValue !== null ? [targetText] : []),
  ].join(", ");

  const markProps = (li: number, si: number, w: ChartWithheld | undefined) => ({
    className: w ? "ds-chart__mark ds-chart__mark--withheld" : "ds-chart__mark",
    tabIndex: 0,
    role: "img" as const,
    "aria-label": markLabel(li, si),
    onPointerMove: (e: React.PointerEvent) => show(tooltipFor(li, si), e.clientX, e.clientY),
    onPointerLeave: hide,
    onFocus: (e: React.FocusEvent<SVGElement>) => {
      const r = e.currentTarget.getBoundingClientRect();
      show(tooltipFor(li, si), r.left + r.width / 2, r.top);
    },
    onBlur: hide,
  });

  // ── Vertical ───────────────────────────────────────────────────────────
  if (orientation === "vertical") {
    const rotate = labels.length > 6 || labels.some((l) => l.length > 8);
    const padL = 44;
    const padR = 12;
    const padT = showVals || targetValue !== null ? 22 : 14;
    const padB = rotate ? 58 : 30;
    const x = bandScale(labels, [padL, width - padR], 0.3);
    const y = linearScale([0, vMax], [height - padB, padT]);
    const band = x.bandwidth();
    const STUB = 6;

    return (
      <ChartFrame
        marksAreFocusable
        title={title}
        summary={summary}
        viewBox={`0 0 ${width} ${height}`}
        className={className}
        canvasRef={canvasRef}
        overlay={<ChartTooltip tip={tip} />}
        onDismiss={hide}
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
            const w = withheldAt(li, si);
            const val = valueAt(li, si);
            const h = (val / vMax) * (height - padB - padT);
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
                {w ? (
                  <rect
                    x={bx}
                    y={height - padB - STUB}
                    width={Math.max(1, bw)}
                    height={STUB}
                    rx={1}
                    {...markProps(li, si, w)}
                  />
                ) : (
                  <rect
                    x={bx}
                    y={by}
                    width={Math.max(1, bw)}
                    height={Math.max(0, h)}
                    rx={stacked ? 0 : 3}
                    fill={colorFor(li, si)}
                    {...markProps(li, si, undefined)}
                  />
                )}
                {showVals && !stacked && (w || h > 0) && (
                  <text
                    x={bx + bw / 2}
                    y={(w ? height - padB - STUB : by) - 4}
                    textAnchor="middle"
                    className="ds-chart__value"
                  >
                    {w ? "—" : valueFormat(val)}
                  </text>
                )}
              </g>
            );
          });
        })}
        {targetValue !== null && (
          <g aria-hidden="true">
            <line
              x1={padL}
              x2={width - padR}
              y1={y(targetValue)}
              y2={y(targetValue)}
              className="ds-chart__target"
            />
            <text x={width - padR} y={y(targetValue) - 4} textAnchor="end" className="ds-chart__target-label">
              {targetText}
            </text>
          </g>
        )}
        <XAxisLabels labels={labels} x={(l) => x(l) + band / 2} y={height - padB + 16} rotate={rotate ? -35 : 0} />
      </ChartFrame>
    );
  }

  // ── Horizontal ─────────────────────────────────────────────────────────
  const padL = 116;
  const padR = 44;
  const padT = targetValue !== null ? 18 : 8;
  const padB = 26;
  const y = bandScale(labels, [padT, height - padB], 0.3);
  const x = linearScale([0, vMax], [padL, width - padR]);
  const band = y.bandwidth();
  const STUB = 6;

  return (
    <ChartFrame
      marksAreFocusable
      title={title}
      summary={summary}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      canvasRef={canvasRef}
      overlay={<ChartTooltip tip={tip} />}
      onDismiss={hide}
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
          const w = withheldAt(li, si);
          const val = valueAt(li, si);
          const bwidth = (val / vMax) * (width - padL - padR);
          let by: number;
          let bh: number;
          let bx: number;
          if (stacked) {
            bh = band * 0.74;
            by = groupY + (band - bh) / 2;
            bx = stackLeft;
            stackLeft += bwidth;
          } else {
            bh = single ? band * 0.62 : (band * 0.82) / series.length;
            by = single ? groupY + (band - bh) / 2 : groupY + band * 0.09 + si * bh;
            bx = padL;
          }
          return (
            <g key={`${label}-${si}`}>
              {w ? (
                <rect x={bx} y={by} width={STUB} height={Math.max(1, bh)} rx={1} {...markProps(li, si, w)} />
              ) : (
                <rect
                  x={bx}
                  y={by}
                  width={Math.max(0, bwidth)}
                  height={Math.max(1, bh)}
                  /* A stack is ONE bar made of parts. Rounding every segment drew
                     each part as its own pill, so a 100%-stacked row read as three
                     detached lozenges with notches between them rather than a
                     single bar divided up. Only a bar that stands alone gets a
                     radius. */
                  rx={stacked ? 0 : 3}
                  fill={colorFor(li, si)}
                  {...markProps(li, si, undefined)}
                />
              )}
              {showVals && !stacked && (
                <text
                  x={bx + (w ? STUB : bwidth) + 4}
                  y={by + bh / 2 + 3}
                  textAnchor="start"
                  className="ds-chart__value"
                >
                  {w ? "—" : valueFormat(val)}
                </text>
              )}
            </g>
          );
        });
      })}
      {targetValue !== null && (
        <g aria-hidden="true">
          <line
            x1={x(targetValue)}
            x2={x(targetValue)}
            y1={padT}
            y2={height - padB}
            className="ds-chart__target"
          />
          <text x={x(targetValue)} y={padT - 5} textAnchor="middle" className="ds-chart__target-label">
            {targetText}
          </text>
        </g>
      )}
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
