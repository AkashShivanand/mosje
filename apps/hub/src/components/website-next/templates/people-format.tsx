import Image from "next/image";
import { Icon } from "@mosje/design-system";

/**
 * One way of writing a contact, for every people page of the redesign (issue CON-25).
 *
 * The Department's register writes the same things several ways: an email as
 * `name[at]gov[dot]in` on 345 records and as a plain address on 18; telephone
 * numbers with and without the STD code in the same string; a section heading in
 * capitals. These helpers print each of them one way. They never change a word, a
 * digit or a spelling — only the notation.
 */

/**
 * Free-mail domains. An address on one of these is a person's own account, not
 * an office's, and a Government of India page does not publish it as an official
 * contact (issue CON-09). The record keeps it; the page leaves it out, and the
 * omission is reported to the Department rather than explained on screen.
 */
const FREE_MAIL = /@(gmail|googlemail|yahoo|ymail|hotmail|outlook|live|rediffmail|rediff|aol|icloud|proton(mail)?)\.[a-z.]+$/i;

/** `name[at]gov[dot]in` → `name@gov.in`; a field holding several addresses → each one. */
export function officialEmails(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .replace(/\s*\[\s*at\s*\]\s*/gi, "@")
    .replace(/\s*\[\s*dot\s*\]\s*/gi, ".")
    .split(/[\s,;/]+/)
    .map((s) => s.trim().replace(/\.$/, ""))
    .filter((s) => /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(s))
    .filter((s) => !FREE_MAIL.test(s));
}

interface PhonePart {
  text: string;
  /** The number to dial, or undefined for a fax or for connecting text. */
  tel?: string;
}

/**
 * Split a published telephone field into dialable numbers and the words between them.
 *
 * The text stays exactly as published. Only the `tel:` target is completed: a
 * number written without its STD code after one written with it (`011-23381656,
 * 23381657`) is dialled with that code, because from a mobile phone the bare
 * eight digits reach nobody. A fax number is shown and not linked.
 */
export function phoneParts(raw: string | undefined): PhonePart[] {
  if (!raw) return [];
  const parts: PhonePart[] = [];
  const re = /(\+?\d[\d\s-]{4,}\d)(\s?\(\s*fax\s*\))?/gi;
  let last = 0;
  let std: string | undefined;
  for (const m of raw.matchAll(re)) {
    const index = m.index ?? 0;
    if (index > last) parts.push({ text: raw.slice(last, index) });
    const number = (m[1] ?? "").trim();
    const isFax = Boolean(m[2]);
    const digits = number.replace(/\D/g, "");
    const stdMatch = /^(0\d{2,4})[\s-]/.exec(number);
    if (stdMatch) std = stdMatch[1];
    let tel: string | undefined = digits;
    if (!digits.startsWith("0") && !digits.startsWith("91") && digits.length === 8 && std) tel = std + digits;
    if (digits.length === 5) tel = digits; // a national short code, e.g. 14446
    parts.push({ text: m[0], tel: isFax ? undefined : tel });
    last = index + m[0].length;
  }
  if (last < raw.length) parts.push({ text: raw.slice(last) });
  return parts;
}

/** A published telephone field, each number its own tap-to-call link and never broken across lines. */
export function PhoneNumbers({ value }: { value: string | undefined }) {
  const parts = phoneParts(value);
  if (parts.length === 0) return null;
  return (
    <span className="wn-people-phones">
      {parts.map((p, i) =>
        p.tel ? (
          <a key={i} href={`tel:${p.tel}`} className="wn-people-link wn-people-nowrap">
            {p.text.trim()}
          </a>
        ) : /\d/.test(p.text) ? (
          <span key={i} className="wn-people-nowrap">
            {p.text}
          </span>
        ) : (
          // One notation for separators (CON-25): "a,b" and "a , b" both print "a, b",
          // which also gives a long run of numbers somewhere to wrap on a phone.
          <span key={i}>{p.text.replace(/\s*,\s*/g, ", ").replace(/\s*\/\s*/g, " / ")}</span>
        ),
      )}
    </span>
  );
}

/** Each official address as its own mail link; free-mail addresses are left out (CON-09). */
export function EmailLinks({ value }: { value: string | undefined }) {
  const emails = officialEmails(value);
  if (emails.length === 0) return null;
  return (
    <span className="wn-people-emails">
      {emails.map((e) => (
        <a key={e} href={`mailto:${e}`} className="wn-people-link wn-people-break">
          {e}
        </a>
      ))}
    </span>
  );
}

/**
 * An address as published, less a trailing "Phone: …" that repeats the telephone
 * field printed beside it (the NCSC records carry both).
 */
export function tidyAddress(address: string | undefined, phone?: string): string | undefined {
  if (!address) return undefined;
  let a = address.replace(/\s+/g, " ").trim();
  if (phone) {
    const tail = /[.,]?\s*Phone:\s*([\d\s,-]+)$/i.exec(a);
    if (tail && phone.replace(/\D/g, "").includes((tail[1] ?? "").replace(/\D/g, ""))) a = a.slice(0, tail.index).trim();
  }
  return a.replace(/\s+,/g, ",");
}

const SMALL = new Set(["a", "an", "the", "and", "or", "but", "to", "of", "in", "into", "for", "on", "with", "at", "by"]);

/**
 * The register's section headings are in capitals ("UNION CABINET MINISTER OF
 * SOCIAL JUSTICE & EMPOWERMENT"). Titles on this estate are Title Case, and
 * capitals are reserved for label-3. Words in brackets that are already capitals
 * are abbreviations and stay as they are: "(NIC)", "(PR.CCA)".
 */
export function titleCase(heading: string): string {
  if (heading !== heading.toUpperCase()) return heading;
  return heading
    .split(/(\s+|\/)/)
    .map((word, i) => {
      if (/^\s+$|^\/$/.test(word) || word === "&") return word;
      if (/^\(.*\)$/.test(word) || /^\(?[A-Z.]+\)$/.test(word)) return word;
      const lower = word.toLowerCase();
      if (i > 0 && SMALL.has(lower)) return lower;
      return lower.replace(/(^|[-(.])([a-z])/g, (_, p: string, c: string) => p + c.toUpperCase());
    })
    .join("");
}

/**
 * A portrait in the one crop every person gets (issue BRD-07): a square, head and
 * shoulders, `object-fit: cover` from the top. Where the Department publishes no
 * photograph the tile is a designed placeholder — a neutral ground with a person
 * mark — not initials, which read as a broken image on a government page.
 */
export function Portrait({ src, alt, size = "md" }: { src?: string; alt: string; size?: "sm" | "md" }) {
  const px = size === "md" ? 96 : 56;
  return (
    <span className={`wn-people-portrait wn-people-portrait--${size}`}>
      {src ? (
        <Image src={src} alt={alt} width={px * 2} height={px * 2} sizes={`${px}px`} />
      ) : (
        <span className="wn-people-portrait__empty" aria-hidden="true">
          <Icon name="person" size={size === "md" ? 40 : 28} />
        </span>
      )}
    </span>
  );
}
