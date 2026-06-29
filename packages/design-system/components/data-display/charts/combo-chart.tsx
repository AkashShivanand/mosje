"use client";

import * as React from "react";
import { ChartFrame } from "./internal/chart-frame";
import { Legend } from "./internal/legend";
import { Gridlines, XAxisLabels } from "./internal/axis";
import { ChartTooltip, useChartTooltip } from "./internal/tooltip";
import { bandScale, linearScale, niceTicks } from "./internal/scales";
import { seriesColor, categoricalColor } from "./internal/palette";
import { formatIndian } from "./internal/format";
import type { ValueFormat } from "./internal/format";
import type { ChartSeries } from "./types";

export interface ComboChartProps {
  labels: string[];
  /** Bar series on the left axis (grouped). */
  bars: ChartSeries[];
  /** Line series on the right axis. */
  lines: ChartSeries[];
  title: string;
  caption?: React.ReactNode;
  leftLabel?: string;
  rightLabel?: string;
  valueFormat?: ValueFormat;
  width?: number;
  height?: number;
  className?: string;
}

/**
 * MoSJE / SAMAVESH ComboChart — grouped bars (left axis) + lines (right axis)
 * sharing one category axis. Useful for "count vs rate" MIS views.
 */
export function ComboChart({
  labels,
  bars,
  lines,
  title,
  caption,
  leftLabel,
  rightLabel,
  valueFormat = formatIndian,
  width = 540,
  height = 300,
  className,
}: ComboChartProps) {
  const { canvasRef, tip, show, hide } = useChartTooltip();
  const [active, setActive] = React.useState<number | null>(null);
  if (labels.length === 0 || (bars.length === 0 && lines.length === 0))
    return <p className="ds-chart__empty">No data to display.</p>;

  const barColors = bars.map((s, i) => seriesColor(s.color, i));
  const lineColors = lines.map((s, i) => seriesColor(s.color, bars.length + i));

  const rotate = labels.length > 6 || labels.some((l) => l.length > 8);
  const padL = 48;
  const padR = 48;
  const padT = 16;
  const padB = rotate ? 54 : 30;

  const leftTicks = niceTicks(0, Math.max(1, ...bars.flatMap((s) => s.data)));
  const rightTicks = niceTicks(0, Math.max(1, ...lines.flatMap((s) => s.data)));
  const leftMax = leftTicks[leftTicks.length - 1] ?? 1;
  const rightMax = rightTicks[rightTicks.length - 1] ?? 1;

  const x = bandScale(labels, [padL, width - padR], 0.3);
  const yL = linearScale([0, leftMax], [height - padB, padT]);
  const yR = linearScale([0, rightMax], [height - padB, padT]);
  const band = x.bandwidth();
  const n = labels.length;
  const centerX = (i: number) => (x(labels[i] ?? "") + band / 2);

  const linePath = (data: number[]) =>
    data.map((v, i) => `${i === 0 ? "M" : "L"} ${centerX(i).toFixed(2)} ${yR(v).toFixed(2)}`).join(" ");

  const tooltipAt = (i: number) => (
    <>
      <div className="ds-chart__tooltip-title">{labels[i]}</div>
      {bars.map((s, si) => (
        <div key={s.name} className="ds-chart__tooltip-row">
          <span className="ds-chart__tooltip-swatch" style={{ backgroundColor: barColors[si] ?? categoricalColor(si) }} />
          {`${s.name}: ${valueFormat(s.data[i] ?? 0)}`}
        </div>
      ))}
      {lines.map((s, si) => (
        <div key={s.name} className="ds-chart__tooltip-row">
          <span className="ds-chart__tooltip-swatch" style={{ backgroundColor: lineColors[si] ?? categoricalColor(si) }} />
          {`${s.name}: ${valueFormat(s.data[i] ?? 0)}`}
        </div>
      ))}
    </>
  );

  return (
    <ChartFrame
      title={title}
      summary={`${bars.length} bar + ${lines.length} line series over ${n} categories`}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      canvasRef={canvasRef}
      overlay={<ChartTooltip tip={tip} />}
      legend={
        <Legend
          items={[
            ...bars.map((s, i) => ({ label: s.name, color: barColors[i] ?? categoricalColor(i) })),
            ...lines.map((s, i) => ({ label: s.name, color: lineColors[i] ?? categoricalColor(bars.length + i) })),
          ]}
        />
      }
      caption={caption}
      table={{
        columns: ["Category", ...bars.map((s) => s.name), ...lines.map((s) => s.name)],
        rows: labels.map((l, li) => [l, ...bars.map((s) => s.data[li] ?? 0), ...lines.map((s) => s.data[li] ?? 0)]),
      }}
    >
      <Gridlines ticks={leftTicks.map((v) => ({ pos: yL(v), value: v }))} x0={padL} x1={width - padR} format={valueFormat} />
      {rightTicks.map((v) => (
        <text key={`r-${v}`} x={width - padR + 6} y={yR(v) + 3} textAnchor="start" className="ds-chart__axis">
          {valueFormat(v)}
        </text>
      ))}
      {leftLabel && (
        <text x={12} y={(height - padB + padT) / 2} textAnchor="middle" transform={`rotate(-90 12 ${(height - padB + padT) / 2})`} className="ds-chart__axis-title">
          {leftLabel}
        </text>
      )}
      {rightLabel && (
        <text x={width - 10} y={(height - padB + padT) / 2} textAnchor="middle" transform={`rotate(90 ${width - 10} ${(height - padB + padT) / 2})`} className="ds-chart__axis-title">
          {rightLabel}
        </text>
      )}

      {labels.map((label, li) => {
        const groupX = x(label);
        return bars.map((s, si) => {
          const val = s.data[li] ?? 0;
          const bw = (band * 0.82) / Math.max(1, bars.length);
          const bx = groupX + band * 0.09 + si * bw;
          const by = yL(val);
          return (
            <rect
              key={`${label}-${si}`}
              x={bx}
              y={by}
              width={Math.max(1, bw)}
              height={Math.max(0, height - padB - by)}
              rx={3}
              fill={barColors[si] ?? categoricalColor(si)}
              className="ds-chart__mark"
            />
          );
        });
      })}

      {lines.map((s, si) => (
        <path key={s.name} d={linePath(s.data)} fill="none" stroke={lineColors[si] ?? categoricalColor(bars.length + si)} strokeWidth={2.25} strokeLinecap="round" strokeLinejoin="round" />
      ))}
      {lines.map((s, si) =>
        s.data.map((v, i) => (
          <circle key={`${si}-${i}`} cx={centerX(i)} cy={yR(v)} r={active === i ? 4 : 2.5} fill="var(--ds-surface)" stroke={lineColors[si] ?? categoricalColor(bars.length + si)} strokeWidth={2} />
        )),
      )}

      {labels.map((label, i) => (
        <rect
          key={`hit-${label}`}
          x={x(label)}
          y={padT}
          width={band}
          height={height - padB - padT}
          fill="transparent"
          tabIndex={0}
          role="img"
          aria-label={`${label}: ${[...bars, ...lines].map((s) => `${s.name} ${valueFormat(s.data[i] ?? 0)}`).join(", ")}`}
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
            if (r) show(tooltipAt(i), r.left + (centerX(i) / width) * r.width, r.top + 0.3 * r.height);
          }}
          onBlur={() => {
            setActive(null);
            hide();
          }}
        />
      ))}

      <XAxisLabels labels={labels} x={(l) => centerX(labels.indexOf(l))} y={height - padB + 16} rotate={rotate ? -35 : 0} />
    </ChartFrame>
  );
}
