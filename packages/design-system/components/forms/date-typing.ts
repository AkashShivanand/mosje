/**
 * The pure half of `DatePicker`'s typed field, kept apart from React so it can be tested without
 * a DOM.
 *
 * Usability audit, 14 Sep 2026 (UX-09): an officer typed `20092026` into Schedule Inspection and
 * the field emptied itself on blur with no message. The parser accepted only slashes, and the
 * component "put back the last good value" for anything else — which, on an empty field, is
 * nothing. Digits alone, and the three separators people actually type, are now read; anything
 * else stays on screen with a message saying how to write it.
 */

export type TypedDate =
  | { kind: "empty" }
  | { kind: "date"; iso: string }
  /** `format`: not a date shape we read. `nonexistent`: the shape is right, the day is not (31/02). */
  | { kind: "invalid"; reason: "format" | "nonexistent" };

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * `dd/mm/yyyy` in the forms a reader types → ISO.
 *
 * Accepted: `20/09/2026`, `20-09-2026`, `20.09.2026`, `20 09 2026`, `20092026`, and one-digit day
 * or month where a separator makes them unambiguous (`5/9/2026`).
 *
 * Refused as ambiguous rather than guessed: a two-digit year (`20/09/26`), and six or seven bare
 * digits (`2092026` is 2 September or 20 September). A guessed date is worse than a question —
 * on this estate a wrong date is a missed visit or a wrong eligibility decision.
 *
 * Checked by round-trip rather than by range: `31/02/2026` passes every field-by-field bounds
 * test and is not a date.
 */
export function parseTypedDate(text: string): TypedDate {
  const t = text.trim();
  if (t === "") return { kind: "empty" };
  const m = /^(\d{2})(\d{2})(\d{4})$/.exec(t) ?? /^(\d{1,2})\s*[/.\- ]\s*(\d{1,2})\s*[/.\- ]\s*(\d{4})$/.exec(t);
  if (!m) return { kind: "invalid", reason: "format" };
  const [dd, mm, yyyy] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const d = new Date(yyyy, mm - 1, dd);
  if (d.getFullYear() !== yyyy || d.getMonth() !== mm - 1 || d.getDate() !== dd) {
    return { kind: "invalid", reason: "nonexistent" };
  }
  return { kind: "date", iso: `${yyyy}-${pad(mm)}-${pad(dd)}` };
}

/** ISO → the form a reader reads and types. */
export function isoToDisplay(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : "";
}

export const DATE_FORMAT_MESSAGE = "Enter the date as DD/MM/YYYY.";

/**
 * What to tell the reader about what they typed, or `null` when it is acceptable. ISO strings
 * compare correctly as text, so the bounds need no Date.
 */
export function typedDateError(parsed: TypedDate, min?: string, max?: string): string | null {
  if (parsed.kind === "empty") return null;
  if (parsed.kind === "invalid") {
    return parsed.reason === "nonexistent" ? `That date does not exist. ${DATE_FORMAT_MESSAGE}` : DATE_FORMAT_MESSAGE;
  }
  if (min && parsed.iso < min) return `Enter a date on or after ${isoToDisplay(min)}.`;
  if (max && parsed.iso > max) return `Enter a date on or before ${isoToDisplay(max)}.`;
  return null;
}
