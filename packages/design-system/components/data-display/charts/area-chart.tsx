import * as React from "react";
import { LineChart, type LineChartProps } from "./line-chart";

export type AreaChartProps = Omit<LineChartProps, "area">;

/**
 * MoSJE / SAMAVESH AreaChart — a LineChart with the area under every series
 * filled. Per-series `fill: false` can opt a series out.
 *
 * `state`, `onRetry` and `filterLabel` are inherited from `LineChartProps` and
 * forwarded with the rest — there is no second state layer here, because there
 * is no second chart. An area chart that cannot draw is a line chart that
 * cannot draw.
 */
export function AreaChart(props: AreaChartProps) {
  return <LineChart {...props} area />;
}
