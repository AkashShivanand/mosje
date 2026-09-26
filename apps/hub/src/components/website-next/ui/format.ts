/**
 * One date format across the site: DD MMM YYYY (issue CON-16 — dates were
 * written three ways). Accepts ISO dates and the ingest's "Month D, YYYY"; a
 * string that is not a date is returned unchanged rather than guessed at.
 */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatDate(value?: string | null): string | undefined {
  if (!value) return undefined;
  const t = Date.parse(value);
  if (Number.isNaN(t)) return value;
  // Written out rather than Intl: ICU prints "Sept" for en-IN/en-GB, and the
  // site's one format is three letters.
  const d = new Date(t + 5.5 * 3600 * 1000); // IST calendar date
  return `${String(d.getUTCDate()).padStart(2, "0")} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** The machine-readable form for <time dateTime>, or undefined when unparseable. */
export function isoDate(value?: string | null): string | undefined {
  if (!value) return undefined;
  const t = Date.parse(value);
  return Number.isNaN(t) ? undefined : new Date(t).toISOString().slice(0, 10);
}
