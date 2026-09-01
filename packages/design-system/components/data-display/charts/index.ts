/* ============================================================================
   MoSJE / SAMAVESH — Data-visualisation layer (public barrel)
   Dependency-free, token-driven, theme-aware, accessible SVG charts.
   ============================================================================ */

// Shared types
export type { ChartDatum, ChartSeries, ChartMultiSeries, ChartTable } from "./types";

// Core charts
export { PieChart } from "./pie-chart";
export { BarChart } from "./bar-chart";
export type { BarChartProps } from "./bar-chart";
export { LineChart } from "./line-chart";
export type { LineChartProps } from "./line-chart";
export { AreaChart } from "./area-chart";
export type { AreaChartProps } from "./area-chart";
export { DonutChart } from "./donut-chart";
export type { DonutChartProps } from "./donut-chart";
export { Gauge } from "./gauge";
export type { GaugeProps } from "./gauge";
export { Sparkline } from "./sparkline";
export type { SparklineProps } from "./sparkline";
export { Progress } from "./progress";
export type { ProgressProps } from "./progress";

// Advanced charts
export { FunnelChart } from "./funnel-chart";
export type { FunnelChartProps, FunnelStage } from "./funnel-chart";
export { ScatterChart } from "./scatter-chart";
export type { ScatterChartProps, ScatterSeries, ScatterPoint } from "./scatter-chart";
export { Heatmap } from "./heatmap";
export type { HeatmapProps } from "./heatmap";
export { ComboChart } from "./combo-chart";
export type { ComboChartProps } from "./combo-chart";

// Geographic
export { IndiaMap } from "./india-map";
export type { IndiaMapProps, IndiaMapDatum } from "./india-map";
export { IndiaBubbleMap } from "./india-bubble-map";
export type { IndiaBubbleMapProps, IndiaBubbleDatum } from "./india-bubble-map";
export { IndiaPointMap, INDIA_STATE_BOXES } from "./india-point-map";
export type {
  IndiaPointMapProps,
  MapPin,
  MapBubble,
  PinKindStyle,
  RegionBox,
} from "./india-point-map";
export {
  projectIndia,
  repairIndiaCoordinate,
  binIndiaPoints,
  normalizeRegionName,
  hexCenter,
  hexPath,
  hexAt,
  median,
  INDIA_HEX_RADIUS,
  INDIA_LAT_RANGE,
  INDIA_LON_RANGE,
} from "./geo/india-projection";
export type {
  HexBin,
  RepairedCoordinate,
  CoordinateVerdict,
} from "./geo/india-projection";

// Toolkit (for advanced/custom composition)
export { Legend, useChartTooltip, ChartTooltip, formatIndian, formatCompact, formatPercent, categoricalColor, sequentialColor, divergingColor } from "./internal";
export type { LegendItem, ValueFormat } from "./internal";
