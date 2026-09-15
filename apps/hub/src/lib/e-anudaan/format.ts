/**
 * One money formatter and one date formatter for the whole portal.
 *
 * Design audit M7 and M8. The same grant amount was rendering three ways — `₹24.38 L` from
 * `formatGrant`, `₹24,38,356` from a local `rupees` helper in the cost-norms panel, and a bare
 * `24,38,356` in that panel's own table with the symbol left up in the column header — and dates
 * in three shapes across two locales. An applicant comparing a figure on the review page against
 * the same figure in a table could not tell they were the same number.
 *
 * `en-IN` throughout: rupees group as lakh and crore, not thousands, and this is a Government of
 * India property.
 */

/** The canonical amount: full, grouped, symbol attached. Use this unless space forbids it. */
export function rupees(amount: number): string {
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

/**
 * The abbreviated amount, for dense tables and KPI tiles where the full figure will not fit.
 *
 * Never mix the two in one table or one card: the point of M7 is that a reader must be able to
 * compare two figures without converting between forms in their head.
 */
export function rupeesShort(amount: number): string {
  if (amount >= 10_000_000) return `₹${(amount / 10_000_000).toFixed(2)} Cr`;
  if (amount >= 100_000) return `₹${(amount / 100_000).toFixed(2)} L`;
  return rupees(amount);
}

/**
 * The one date shape: `03 Sep 2026`. Accepts an ISO string or a Date.
 *
 * Written out rather than delegated to `toLocaleDateString`, because the locale decides things a
 * government portal should decide for itself: `en-IN` abbreviates September to **"Sept"** — four
 * letters where every other month gets three — while `en-GB` gives "Sep". Picking a locale per
 * concern is how M8's two locales appeared in the first place, and ICU data varies by runtime, so
 * the format would not even be stable between a developer's machine and the server.
 */
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

/** A bare `2015-04-01` is a calendar date, not UTC midnight — read it in local time. */
function toDate(value: string | Date): Date {
  if (typeof value !== "string") return value;
  const plain = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return plain ? new Date(Number(plain[1]), Number(plain[2]) - 1, Number(plain[3])) : new Date(value);
}

export function formatDate(value: string | Date): string {
  const d = toDate(value);
  if (Number.isNaN(d.getTime())) return "";
  return `${String(d.getDate()).padStart(2, "0")} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * The one time shape: `10:30 AM`. Twelve-hour, zero-padded, upper-case meridiem. Accepts an ISO
 * timestamp, a Date, or a bare `HH:mm` as the forms store it.
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
    const d = toDate(value);
    if (Number.isNaN(d.getTime())) return "";
    h = d.getHours();
    m = d.getMinutes();
  }
  const twelve = h % 12 === 0 ? 12 : h % 12;
  return `${String(twelve).padStart(2, "0")}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}

/** Date and time together, for a history entry or a notification: `13 Sep 2026, 07:47 PM`. */
export function formatDateTime(value: string | Date): string {
  const date = formatDate(value);
  return date ? `${date}, ${formatTime(value)}` : "";
}

const MONTHS_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

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
  return `${MONTHS[d.getUTCMonth()]} ${String(d.getUTCFullYear() % 100).padStart(2, "0")}`;
}
