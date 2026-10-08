/*
 * The DBIM design's one date format: DD MMM YYYY — "05 Oct 2026".
 *
 * DBIM 3.0 §A.5.6 viii asks only that the day come before the month. The estate's
 * compliance checklist names DD MMM YYYY, and the Department chose it on 5 Oct 2026 for
 * every date in the DBIM design, Figma and code alike: a month name cannot be misread as
 * a day, and a screen reader announces it as a date. The MoSJE Website DBIM DS
 * (`xdv8nEd7PhnRhahASd9UPY`) draws every date this way.
 *
 * Content arrives in whatever form its source publishes — ISO from the registers,
 * DD.MM.YYYY from the live site, "19 Jan 2026" from the organisation pages — and is
 * formatted here, at render time, so the shared content records stay as published.
 */

const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const NAMES =
  "January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sept|Sep|Oct|Nov|Dec";

function monthOf(name: string): number {
  return MON.findIndex((m) => name.toLowerCase().startsWith(m.toLowerCase())) + 1;
}

function fmt(d: number, m: number, y: string): string | null {
  return d >= 1 && d <= 31 && m >= 1 && m <= 12 ? `${String(d).padStart(2, "0")} ${MON[m - 1]} ${y}` : null;
}

const PATTERNS: [RegExp, (...g: string[]) => string | null][] = [
  // 2026-10-05 (and an ISO timestamp's date part)
  [/\b(\d{4})-(\d{2})-(\d{2})(?:T[\d:.]+Z?)?\b/g, (_, y, m, d) => fmt(+d!, +m!, y!)],
  // 05.10.2026 · 05/10/2026 · 05-10-2026 — always read day first, as the live site publishes
  [/\b(\d{1,2})[./-](\d{1,2})[./-](\d{4})\b/g, (_, d, m, y) => fmt(+d!, +m!, y!)],
  // 5 October 2026 · 5th Oct, 2026
  [new RegExp(`\\b(\\d{1,2})(?:st|nd|rd|th)? (${NAMES})\\.?,? (\\d{4})\\b`, "g"), (_, d, m, y) => fmt(+d!, monthOf(m!), y!)],
  // October 5, 2026
  [new RegExp(`\\b(${NAMES})\\.? (\\d{1,2}),? (\\d{4})\\b`, "g"), (_, m, d, y) => fmt(+d!, monthOf(m!), y!)],
];

/**
 * Every date inside `text`, rewritten to DD MMM YYYY; everything else untouched.
 * "Event Start: 9 September 2026 10:30 AM" → "Event Start: 09 Sep 2026 10:30 AM".
 */
export function dbimDates(text: string): string;
export function dbimDates(text: string | undefined): string | undefined;
export function dbimDates(text?: string): string | undefined {
  if (!text) return text;
  let out = text;
  for (const [re, f] of PATTERNS) out = out.replace(re, (...m) => f(...(m.slice(0, -2) as string[])) ?? m[0]);
  return out;
}

/** One date, DD MMM YYYY — or "" when there is nothing that reads as a date. */
export function dbimDate(value?: string | Date): string {
  if (!value) return "";
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? "" : (fmt(value.getDate(), value.getMonth() + 1, String(value.getFullYear())) ?? "");
  }
  const out = dbimDates(value.trim());
  return out === value.trim() && !/\d{4}/.test(out) ? "" : out;
}
