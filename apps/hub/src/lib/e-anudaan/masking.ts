/**
 * Personal identifiers as an officer may see them: enough to tell two people apart and to match a
 * document in hand, never the whole number (e-Anudaan parity brief §D item 3).
 *
 *   Aadhaar  123412341234  →  XXXX-XXXX-1234
 *   Mobile   9822014210    →  98XXXXX210
 *   Other ID ABCD1234567   →  XXXXXXX4567
 *
 * Run: node --test src/lib/e-anudaan/masking.test.ts
 */

const digitsOf = (v: string) => v.replace(/\D/g, "");

/** Aadhaar as `XXXX-XXXX-1234`. Anything that is not twelve digits is masked as an ordinary ID. */
export function maskAadhaar(value: string | undefined): string {
  const d = digitsOf(value ?? "");
  if (d.length === 12) return `XXXX-XXXX-${d.slice(-4)}`;
  return maskIdNumber(value);
}

/**
 * A mobile as `98XXXXX210`: the first two digits and the last three. A `+91` or leading `0` is
 * dropped first. A number of any other length keeps only its last two digits.
 */
export function maskMobile(value: string | undefined): string {
  let d = digitsOf(value ?? "");
  if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
  else if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  if (!d) return "";
  if (d.length === 10) return `${d.slice(0, 2)}XXXXX${d.slice(-3)}`;
  return d.length <= 2 ? "X".repeat(d.length) : `${"X".repeat(d.length - 2)}${d.slice(-2)}`;
}

/** Any other document number: every character but the last four replaced, never fewer than two. */
export function maskIdNumber(value: string | undefined): string {
  const v = (value ?? "").replace(/\s+/g, "");
  if (!v) return "";
  if (v.length <= 4) return "X".repeat(v.length);
  return `${"X".repeat(Math.max(v.length - 4, 2))}${v.slice(-4)}`;
}

/** An identity document as a line: "Aadhaar XXXX-XXXX-1234". */
export function maskedIdentity(idType: string, idNumber: string): string {
  const masked = idType === "Aadhaar" ? maskAadhaar(idNumber) : maskIdNumber(idNumber);
  return masked ? `${idType} ${masked}` : idType;
}
