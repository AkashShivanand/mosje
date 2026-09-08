import * as React from "react";
import { cn } from "../../../utils/cn";
import { ChartFrame, type ChartStateProps } from "./internal/chart-frame";
import { Legend } from "./internal/legend";
import { categoricalColor, CHART_INK } from "./internal/palette";
import { arcPath, sliceBoundaries } from "./internal/geometry";
import { formatPercent } from "./internal/format";
import { withheldLabel, type ChartDatum } from "./types";

export interface PieChartProps extends ChartStateProps {
  data: ChartDatum[];
  title: string;
}

/**
 * MoSJE / SAMAVESH PieChart — dependency-free SVG pie with a side legend and a
 * screen-reader data table. **Backward-compatible API** (`{ data, title }`).
 *
 * A WITHHELD CATEGORY HAS NO SLICE. It is left out of the total — a total
 * summed over a suppressed count is a partial total and is labelled as one —
 * and it keeps its place in the legend and the table, with its reason, so the
 * reader knows the category exists and the figure does not.
 */
export function PieChart({ data, title, state, onRetry, filterLabel, tableView }: PieChartProps) {
  const shown = data.filter((d) => !d.withheld);
  const withheld = data.filter((d) => d.withheld);
  const total = shown.reduce((sum, d) => sum + d.value, 0);
  // One expression. `state` wins where the caller gave one — a zero total says
  // nothing about whether the feed was asked, failed, or was filtered away.
  const resolved = state ?? (total === 0 ? "empty" : undefined);
  if (resolved)
    return (
      <ChartFrame
        title={title}
        viewBox="0 0 200 200"
        className="ds-chart--pie"
        state={resolved}
        onRetry={onRetry}
        filterLabel={filterLabel}
      >
        {null}
      </ChartFrame>
    );

  const bounds = sliceBoundaries(shown.map((d) => d.value));
  const slices = shown.map((d, i) => {
    // `bounds` has one more entry than `shown`, so both indices exist.
    const start = (bounds[i]! / total) * 360;
    const end = (bounds[i + 1]! / total) * 360;
    const color = d.color ?? categoricalColor(i);
    return { ...d, start, end, color, pct: (d.value / total) * 100 };
  });

  const summary = [
    ...slices.map((s) => `${s.label} ${formatPercent(s.pct)}`),
    ...withheld.map((d) => `${d.label} ${withheldLabel(d.withheld!).toLowerCase()}`),
    ...(withheld.length ? ["shares are of the published total"] : []),
  ].join(", ");

  return (
    <ChartFrame
      title={title}
      summary={summary}
      viewBox="0 0 200 200"
      className="ds-chart--pie"
      legend={
        <Legend
          orientation="vertical"
          items={[
            ...slices.map((s) => ({ label: s.label, color: s.color, value: formatPercent(s.pct) })),
            ...withheld.map((d) => ({ label: d.label, color: CHART_INK.axis, value: "—" })),
          ]}
        />
      }
      table={{
        columns: ["Category", "Count", "Share"],
        rows: [
          ...slices.map((s) => [s.label, s.value, formatPercent(s.pct)]),
          ...withheld.map((d) => [d.label, withheldLabel(d.withheld!), "—"]),
        ],
      }}
      tableView={tableView}
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
