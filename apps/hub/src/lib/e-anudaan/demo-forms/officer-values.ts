/**
 * How an officer form reads the values its demo presets name by ROLE rather than by figure: an
 * amount "sought" or "above-sought" is the file's own, and a date "+15" is fifteen days after today.
 * The forms and the preset test resolve them the same way, so a reseeded store or another day's
 * clock does not break a preset.
 */

/** The review routes, below `/portals/e-anudaan`: every grade's `sm2/<key>/review/<appId>`. */
export const REVIEW_PATH = /^\/dashboard\/sm2\/[^/]+\/review\/[^/]+\/?$/;

/**
 * The two sanction amounts. Each is "sought" (what the NGO asked for under that head),
 * "admissible" (the amount sought, or the amount the cost norms admit under that head if less), or
 * digits as typed — "" for an empty field. The recurring amount may also be "above-sought"
 * (₹1,00,000 more than sought) or "above-norm": the figure that puts the total ₹1,00,000 above the
 * amount the norms admit, or at the amount sought if that is less, so it never also exceeds the
 * amount sought. With no norms held for the scheme (only AVYAY's are), "admissible" and "above-norm"
 * are the amount sought.
 */
export function resolveSanction(
  v: Readonly<Record<string, string>>,
  f: { recurring: number; nonRecurring: number; norm?: { recurring: number; nonRecurring: number; total: number } | null },
): { recurring: string; nonRecurring: string } {
  const typed = (t: string | undefined) => (t ?? "").replace(/[^\d]/g, "");
  const head = (t: string | undefined, sought: number, norm: number | undefined) =>
    t === "sought" ? String(sought) : t === "admissible" ? String(norm == null ? sought : Math.min(sought, norm)) : typed(t);
  const nonRecurring = head(v.nonRecurring, f.nonRecurring, f.norm?.nonRecurring);
  const nr = Number(nonRecurring);
  let recurring: string;
  if (v.recurring === "above-sought") recurring = String(f.recurring + 100_000);
  else if (v.recurring === "above-norm") {
    recurring = f.norm ? String(Math.max(0, Math.min(f.recurring + f.nonRecurring, f.norm.total + 100_000) - nr)) : String(f.recurring);
  } else recurring = head(v.recurring, f.recurring, f.norm?.recurring);
  return { recurring, nonRecurring };
}

/** A date: "" for none, "today", or "+N" days after `today` (an ISO date). */
export function resolveDate(token: string | undefined, today: string): string {
  if (!token) return "";
  if (token === "today") return today;
  const days = Number(token.replace(/^\+/, ""));
  const d = new Date(`${today}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
