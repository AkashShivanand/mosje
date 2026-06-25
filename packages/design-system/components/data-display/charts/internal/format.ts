/* Number formatting helpers. Indian grouping (en-IN) is the estate default. */

export type ValueFormat = (value: number) => string;

/** 1,23,456 — Indian digit grouping. The default for every chart. */
export const formatIndian: ValueFormat = (n) => n.toLocaleString("en-IN");

/** 1.2L / 3.4Cr style compact notation, en-IN. */
export const formatCompact: ValueFormat = (n) =>
  new Intl.NumberFormat("en-IN", { notation: "compact", maximumFractionDigits: 1 }).format(n);

/** "42.0%" */
export const formatPercent = (n: number, digits = 1): string => `${n.toFixed(digits)}%`;
