/**
 * Visitor figures for the website, MIRRORED from dosje.gov.in/visitor-analytics.
 *
 * There is no analytics feed on this estate, so the figures are the ones the
 * Department publishes, copied on the date below. The footer's "Total Visits"
 * and the Visitor Analytics page both read THIS object, so the two can never
 * show different totals (`.claude/rules/data-state-completeness.md` §2).
 *
 * The monthly rows sum to `total`; `visitor-analytics.test.ts` holds that.
 */
export interface VisitorMonth {
  month: string;
  english: number;
  hindi: number;
}

export const VISITOR_ANALYTICS = {
  source: "https://www.dosje.gov.in/visitor-analytics/",
  /** ISO date the figures were copied from the source. */
  asOf: "2026-09-17",
  total: 388_953,
  english: 386_900,
  hindi: 2_053,
  months: [
    { month: "September 2026", english: 125_521, hindi: 389 },
    { month: "August 2026", english: 34_692, hindi: 221 },
    { month: "July 2026", english: 32_506, hindi: 207 },
    { month: "June 2026", english: 30_320, hindi: 193 },
    { month: "May 2026", english: 28_134, hindi: 179 },
    { month: "April 2026", english: 25_948, hindi: 165 },
    { month: "March 2026", english: 23_762, hindi: 151 },
    { month: "February 2026", english: 21_576, hindi: 137 },
    { month: "January 2026", english: 19_390, hindi: 123 },
    { month: "December 2025", english: 17_203, hindi: 110 },
    { month: "November 2025", english: 15_017, hindi: 96 },
    { month: "October 2025", english: 12_831, hindi: 82 },
  ] satisfies VisitorMonth[],
} as const;
