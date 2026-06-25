import * as React from "react";
import { cn } from "../../../utils/cn";
import { ChartFrame } from "./internal/chart-frame";
import { Legend } from "./internal/legend";
import { categoricalColor } from "./internal/palette";
import { arcPath } from "./internal/geometry";
import { formatPercent } from "./internal/format";
import type { ChartDatum } from "./types";

/**
 * MoSJE / SAMAVESH PieChart — dependency-free SVG pie with a side legend and a
 * screen-reader data table. **Backward-compatible API** (`{ data, title }`).
 */
export function PieChart({ data, title }: { data: ChartDatum[]; title: string }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (total === 0) return <p className="ds-chart__empty">No data to display.</p>;

  let cursor = 0;
  const slices = data.map((d, i) => {
    const start = (cursor / total) * 360;
    cursor += d.value;
    const end = (cursor / total) * 360;
    const color = d.color ?? categoricalColor(i);
    return { ...d, start, end, color, pct: (d.value / total) * 100 };
  });

  const summary = slices.map((s) => `${s.label} ${formatPercent(s.pct)}`).join(", ");

  return (
    <ChartFrame
      title={title}
      summary={summary}
      viewBox="0 0 200 200"
      className="ds-chart--pie"
      legend={
        <Legend
          orientation="vertical"
          items={slices.map((s) => ({ label: s.label, color: s.color, value: formatPercent(s.pct) }))}
        />
      }
      table={{
        columns: ["Category", "Count", "Share"],
        rows: slices.map((s) => [s.label, s.value, formatPercent(s.pct)]),
      }}
    >
      {slices.map((s) => (
        <path
          key={s.label}
          d={arcPath(100, 100, 92, s.start, s.end)}
          fill={s.color}
          className={cn("ds-chart__pie-slice")}
        />
      ))}
    </ChartFrame>
  );
}
