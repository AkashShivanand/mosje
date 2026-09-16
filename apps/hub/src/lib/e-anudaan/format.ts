/**
 * One money rule and one date rule for the whole portal.
 *
 * Design audit M7 and M8, then the design-director audit of 16 Sep 2026 (X-03): the same figure
 * still reached officers as `₹22.28 Cr` on NGO 360 and `₹22,27,97,125` in Reports, and as
 * `₹29.00 L` beside `₹48,00,000` on one Payment Status page. An officer cross-checking a figure
 * between two screens could not match it at a glance.
 *
 * Glossary and the reasons for each choice: docs/plans/2026-09-16-e-anudaan-glossary.md.
 */

/* ── Money ───────────────────────────────────────────────────────────────── */

/**
 * Where a figure is printed decides its form — never the figure, and never the screen author.
 *
 * - `summary` — tables, lists, KPI tiles, cards, reports, notifications. Abbreviated to lakh or
 *   crore from ₹1 lakh upward, two decimals: `₹24.38 L`, `₹22.28 Cr`.
 * - `exact` — the figure is being entered, confirmed or legally stated: form fields, the sanction
 *   order, a confirmation dialog, the Utilisation Certificate. Full Indian grouping: `₹24,38,356`.
 *
 * One screen may carry both only where one is a summary and the other the stated amount (a
 * sanction dialog under a table); one table or one card never mixes them.
 */
export type MoneyContext = "summary" | "exact";

/** ₹1 lakh. From here up, a summary figure abbreviates. */
export const LAKH = 100_000;
/** ₹1 crore. */
export const CRORE = 10_000_000;

/**
 * The one money formatter. `en-IN` grouping (lakh and crore, not thousands), the rupee symbol
 * attached, never a fraction of a rupee in the exact form, never monospace where it is drawn.
 */
export function formatMoney(amount: number, context: MoneyContext = "summary"): string {
  if (!Number.isFinite(amount)) return "—";
  const sign = amount < 0 ? "-" : "";
  const whole = Math.round(Math.abs(amount));
  if (context === "summary" && whole >= LAKH) {
    // Hundredths of a lakh — the printed precision. The unit is chosen AFTER rounding, so
    // ₹99,99,999 prints as ₹1.00 Cr rather than "₹100.00 L".
    const lakhHundredths = Math.round(whole / (LAKH / 100));
    if (lakhHundredths < 100 * 100) return `${sign}₹${(lakhHundredths / 100).toFixed(2)} L`;
    return `${sign}₹${(Math.round(whole / (CRORE / 100)) / 100).toFixed(2)} Cr`;
  }
  return `${sign}₹${whole.toLocaleString("en-IN")}`;
}

/** The exact form. Kept as the name ~20 callers already import. */
export function rupees(amount: number): string {
  return formatMoney(amount, "exact");
}

/** The summary form. Kept as the name callers already import. */
export function rupeesShort(amount: number): string {
  return formatMoney(amount, "summary");
}

/* ── Dates ───────────────────────────────────────────────────────────────── */

/**
 * The one date shape: `16 Sep 2026`; with a time, `16 Sep 2026, 11:42 AM`.
 *
 * Written out rather than delegated to `toLocaleDateString`, because the locale decides things a
 * government portal should decide for itself: `en-IN` abbreviates September to **"Sept"** while
 * `en-GB` gives "Sep", and ICU data varies by runtime.
 *
 * **Every instant is read in India Standard Time**, whatever the machine's zone. The server
 * renders in UTC and the reader's browser in IST, so a timestamp near midnight printed one date on
 * the server and another after hydration — two answers to one question, and a hydration mismatch.
 * India keeps no daylight saving, so a fixed +05:30 is exact and needs no time-zone data.
 */
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

const MONTHS_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

const IST_OFFSET_MS = 330 * 60_000;

interface Parts {
  y: number;
  m: number;
  d: number;
  h: number;
  min: number;
}

/**
 * The calendar parts of a value in IST. A bare `2015-04-01` is a calendar date, not an instant:
 * it is that date everywhere, so it is read as written.
 */
function partsOf(value: string | Date): Parts | null {
  if (typeof value === "string") {
    const plain = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (plain) return { y: Number(plain[1]), m: Number(plain[2]) - 1, d: Number(plain[3]), h: 0, min: 0 };
  }
  const t = typeof value === "string" ? Date.parse(value) : value.getTime();
  if (Number.isNaN(t)) return null;
  const ist = new Date(t + IST_OFFSET_MS);
  return { y: ist.getUTCFullYear(), m: ist.getUTCMonth(), d: ist.getUTCDate(), h: ist.getUTCHours(), min: ist.getUTCMinutes() };
}

const pad2 = (n: number) => String(n).padStart(2, "0");

export function formatDate(value: string | Date): string {
  const p = partsOf(value);
  return p ? `${pad2(p.d)} ${MONTHS[p.m]} ${p.y}` : "";
}

/**
 * The one time shape: `10:30 AM`. Twelve-hour, zero-padded, upper-case meridiem. Accepts an ISO
 * timestamp, a Date, or a bare `HH:mm` as the forms store it (a wall-clock time, read as written).
 */
export function formatTime(value: string | Date): string {
  let h: number;
  let m: number;
  const bare = typeof value === "string" ? /^(\d{1,2}):(\d{2})$/.exec(value) : null;
  if (bare) {
    h = Number(bare[1]);
    m = Number(bare[2]);
    if (h > 23 || m > 59) return "";
  } else {
    const p = partsOf(value);
    if (!p) return "";
    h = p.h;
    m = p.min;
  }
  const twelve = h % 12 === 0 ? 12 : h % 12;
  return `${pad2(twelve)}:${pad2(m)} ${h < 12 ? "AM" : "PM"}`;
}

/** Date and time together, for a history entry or a notification: `13 Sep 2026, 07:47 PM`. */
export function formatDateTime(value: string | Date): string {
  const date = formatDate(value);
  return date ? `${date}, ${formatTime(value)}` : "";
}

/** A month as a table row names it: `September 2026`. Read in UTC — a month start is a calendar month. */
export function formatMonthYear(value: string | Date): string {
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "";
  return `${MONTHS_LONG[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** A month as a chart axis names it: `Sep 26`. */
export function formatMonthShort(value: string | Date): string {
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "";
  return `${MONTHS[d.getUTCMonth()]} ${pad2(d.getUTCFullYear() % 100)}`;
}
