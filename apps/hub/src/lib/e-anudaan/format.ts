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

export function formatDate(value: string | Date): string {
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "";
  return `${String(d.getDate()).padStart(2, "0")} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}
