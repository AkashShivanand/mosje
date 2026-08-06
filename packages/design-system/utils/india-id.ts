/**
 * Validators and formatters for the Indian identity numbers government services ask for.
 *
 * Pure functions, no DOM — the UI layer (AadhaarInput / PanInput / OtpInput) is a thin shell
 * over these so the rules can be unit-tested and reused server-side.
 *
 * ── A NOTE ON HANDLING ──────────────────────────────────────────────────────────────────
 * An Aadhaar number is sensitive personal data under the DPDP Act 2023, and UIDAI's own
 * guidance requires it to be MASKED wherever it is displayed (last four digits only). Treat
 * it accordingly: never log it, never put it in a URL or query string, never send it to any
 * endpoint that was not explicitly specified for it. `maskAadhaar` exists so display code
 * has no excuse.
 */

// ── Aadhaar ───────────────────────────────────────────────────────────────────────────────

/** Verhoeff dihedral multiplication table. */
const VERHOEFF_D = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
] as const;

/** Verhoeff permutation table. */
const VERHOEFF_P = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
] as const;

/** Strip every non-digit. */
export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * Verhoeff checksum — the algorithm UIDAI uses for the Aadhaar check digit. Catches every
 * single-digit error and every adjacent transposition, which is what makes it worth doing
 * client-side: it turns most typos into an inline message instead of a failed submission.
 */
export function isValidVerhoeff(digits: string): boolean {
  if (!/^\d+$/.test(digits)) return false;
  let c = 0;
  const reversed = digits.split("").reverse();
  for (let i = 0; i < reversed.length; i++) {
    const digit = Number(reversed[i]);
    c = VERHOEFF_D[c]![VERHOEFF_P[i % 8]![digit]!]!;
  }
  return c === 0;
}

/**
 * Is this a structurally valid Aadhaar number?
 *
 * Twelve digits, first digit 2–9 (UIDAI never issues a number starting 0 or 1), and a
 * passing Verhoeff check digit. Structural only — it says the number is well-formed, never
 * that it exists or belongs to anyone. Only UIDAI can tell you that.
 */
export function isValidAadhaar(value: string): boolean {
  const digits = digitsOnly(value);
  if (digits.length !== 12) return false;
  if (/^[01]/.test(digits)) return false;
  return isValidVerhoeff(digits);
}

/** Format as `XXXX XXXX XXXX` while typing (partial input is fine). */
export function formatAadhaar(value: string): string {
  return digitsOnly(value).slice(0, 12).replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

/**
 * Mask for display: `XXXX XXXX 1234`. Use this ANYWHERE an Aadhaar is shown back to a user —
 * summaries, review steps, tables, print views, PDFs.
 */
export function maskAadhaar(value: string, maskChar = "X"): string {
  const digits = digitsOnly(value);
  if (digits.length !== 12) return formatAadhaar(value);
  const m = maskChar.repeat(4);
  return `${m} ${m} ${digits.slice(8)}`;
}

// ── PAN ───────────────────────────────────────────────────────────────────────────────────

/**
 * The fourth character encodes the holder type. A PAN whose fourth character is not one of
 * these is malformed regardless of the rest, so it is worth checking separately — the error
 * message can then say what is actually wrong.
 */
export const PAN_HOLDER_TYPES: Readonly<Record<string, string>> = {
  P: "Individual",
  C: "Company",
  H: "Hindu Undivided Family (HUF)",
  F: "Firm / Limited Liability Partnership",
  A: "Association of Persons",
  T: "Trust",
  B: "Body of Individuals",
  L: "Local Authority",
  J: "Artificial Juridical Person",
  G: "Government",
  E: "Limited Liability Partnership",
};

const PAN_SHAPE = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

/** Normalise to the storage form: uppercase, alphanumerics only, max 10. */
export function formatPan(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
}

/** Structurally valid PAN: `AAAAA9999A` with a recognised holder-type character. */
export function isValidPan(value: string): boolean {
  const pan = formatPan(value);
  if (!PAN_SHAPE.test(pan)) return false;
  return pan[3]! in PAN_HOLDER_TYPES;
}

/** Holder type encoded in a PAN's 4th character, or null when it is not yet determinable. */
export function panHolderType(value: string): string | null {
  const pan = formatPan(value);
  if (pan.length < 4) return null;
  return PAN_HOLDER_TYPES[pan[3]!] ?? null;
}

/** Mask for display: `ABCDE****A` — PAN is sensitive too, if less strictly than Aadhaar. */
export function maskPan(value: string): string {
  const pan = formatPan(value);
  if (pan.length !== 10) return pan;
  return `${pan.slice(0, 5)}****${pan.slice(9)}`;
}
