/**
 * Corrections applied at render time to text mirrored from dosje.gov.in.
 *
 * The ingested content (src/content/website/*.json) is a faithful mirror of the
 * live site and stays untouched, so a re-ingest never silently loses a fix and
 * the mirror remains evidence of what was published. Where the live site
 * contradicts ITSELF, the Department's own current statement wins, and each
 * entry names the page and date that settles it.
 */
interface Correction {
  find: string;
  replace: string;
  source: string;
}

export const CONTENT_CORRECTIONS: readonly Correction[] = [
  {
    // The Transgender Persons portal's About still names the former Secretary.
    find: "Shri Amit Yadav is the Secretary of the Department of Social Justice &amp; Empowerment.",
    replace: "Shri Sudhansh Pant is the Secretary of the Department of Social Justice &amp; Empowerment.",
    source:
      "https://www.dosje.gov.in/about-us/ (read 22 Sep 2026): Shri Sudhansh Pant is the Secretary; the Former Secretaries table closes Shri Amit Yadav's tenure on 30.11.2025.",
  },
];

export function applyCorrections(html: string): string {
  let out = html;
  for (const c of CONTENT_CORRECTIONS) out = out.split(c.find).join(c.replace);
  return out;
}
