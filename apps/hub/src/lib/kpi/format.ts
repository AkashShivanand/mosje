/*
 * The dashboard's number and date formats are the design system's (Oct 2026): they moved to
 * `@mosje/design-system` with `KpiView`, which draws with them. Re-exported so existing imports
 * read as they did.
 */
export { compactCount, formatKpi, isoDate, kpiFormatter, shownDate } from "@mosje/design-system";
