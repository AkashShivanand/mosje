import * as React from "react";
import { LineChart, type LineChartProps } from "./line-chart";

export type AreaChartProps = Omit<LineChartProps, "area">;

/**
 * MoSJE / SAMAVESH AreaChart — a LineChart with the area under every series
 * filled. Per-series `fill: false` can opt a series out.
 */
export function AreaChart(props: AreaChartProps) {
  return <LineChart {...props} area />;
}
