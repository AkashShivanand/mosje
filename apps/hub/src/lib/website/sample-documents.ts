/**
 * EVERY DOCUMENT LINK ON THE WEBSITE RESOLVES TO A LOCAL SAMPLE.
 *
 * ── WHAT THIS REPLACED ──────────────────────────────────────────────────────
 *
 * The estate mirrored the Department's IMAGES months ago and deliberately did
 * not mirror its DOCUMENTS: the files come to 68 MB, the Department revises
 * them, and a mirrored PDF is a stale snapshot presented as the current file.
 * So every "Download PDF" left the prototype for `durwo6bhtjtqt.cloudfront.net`
 * or `dosje.gov.in` — which means a reviewer on a laptop with no network got
 * nothing, and a demonstration that the shelves work depended on a third party
 * staying up.
 *
 * This is the other answer to the same problem. Not a mirror of a departmental
 * document — an obvious SAMPLE that says so on every page, watermarked, with
 * invented particulars and zeros where a real file would carry figures. It is
 * safe to ship precisely because nobody could mistake it for a record.
 *
 * ── EIGHT FILES, NOT 1,962 ──────────────────────────────────────────────────
 *
 * The ingest holds 1,962 documents. What a reader needs from a prototype is
 * that the file they open LOOKS LIKE the thing they asked for: a newsletter
 * card opens something newsletter-shaped, a circular opens a memorandum. So
 * there are eight kinds and this module picks one, from the document's own
 * category and title. 432 KB total, against roughly a gigabyte of invented
 * paper if every row got its own file.
 *
 * ── WHAT IS NOT REWRITTEN, AND WHY ──────────────────────────────────────────
 *
 * `isDocumentUrl` rewrites a link only when it points at a FILE — a document
 * extension, or the Department's document CDN. A page keeps its own address:
 * the tag index, the e-pledge form, the Instagram profile, the "View all"
 * routes into dosje.gov.in's own listings. Those are places, not files, and
 * sending a reader to a sample PDF instead of a page would be a worse lie than
 * the broken download this fixes.
 *
 * Locally-hosted assets are also left alone — the NMBA logo, the mascot and the
 * two QR codes are real files this estate already serves, and they are images,
 * which were never the problem.
 *
 * Regenerate the files with `node tools/website-sample-documents/generate.mjs`.
 */

/** The kinds `tools/website-sample-documents/generate.mjs` produces. */
export type SampleDocumentKind =
  | "report"
  | "circular"
  | "newsletter"
  | "guideline"
  | "charter"
  | "manual"
  | "form"
  | "publication";

const BASE = "/website/sample-documents";

/**
 * Matched in order, first hit wins, so put the specific before the general —
 * "citizen charter" has to be tested before "citizen", and "user manual" before
 * "report", or a manual whose subtitle mentions a report resolves as a report.
 *
 * Tested against the document's CATEGORY and TITLE joined together, lower-cased,
 * because the ingest puts the useful word in either one: `documents.json` carries
 * the category ("Circulars & Notifications") while the hand-authored download
 * items carry it in the label ("Nasha Mukt Bharat Abhiyaan Newsletter, August
 * 2025").
 */
const RULES: [RegExp, SampleDocumentKind][] = [
  [/citizen charter|\bcharter\b/, "charter"],
  [/newsletter|bulletin/, "newsletter"],
  [/user manual|\bmanual\b|handbook|user guide|\bsop\b/, "manual"],
  /*
   * CIRCULARS BEFORE FORMS, and every form word bounded.
   *
   * "Committee formation — letter to all States" resolved to a FORM, because
   * `format` is a substring of `formation`. Two corrections, both from that one
   * row: the correspondence words are tested first, since a circular ABOUT a
   * form is still a circular; and every form word takes `\b` on both ends so no
   * stem can be swallowed by a longer word again.
   */
  [/circular|notification|\bnotice\b|office memorandum|\bletter\b|\bo\.?m\.?\b|advisory|corrigendum|tender|vacanc/, "circular"],
  [/\bform\b|\bformat\b|\btemplate\b|\bproforma\b|application form/, "form"],
  [/guideline|norms|policy|\bact\b|\brules\b|scheme document/, "guideline"],
  [/annual report|\breport\b|statistic|evaluation|audit/, "report"],
  [/publication|compendium|study|survey|magnitude|assessment|research/, "publication"],
];

/**
 * The kind a document resolves to. Falls back to `report`, which is the most
 * neutral shape — a reader who opens it sees headings, a table and a signature
 * block, which is what most departmental paper looks like.
 */
export function sampleDocumentKind(...hints: (string | undefined)[]): SampleDocumentKind {
  const haystack = hints.filter(Boolean).join(" ").toLowerCase();
  for (const [re, kind] of RULES) if (re.test(haystack)) return kind;
  return "report";
}

/** The local path for a document described by `hints` (its title, its category). */
export function sampleDocumentFor(...hints: (string | undefined)[]): string {
  return `${BASE}/${sampleDocumentKind(...hints)}.pdf`;
}

/**
 * Document file extensions the estate publishes. A URL ending in one of these is
 * a FILE and gets replaced; anything else is a page and is left alone.
 */
const FILE_EXT = /\.(pdf|docx?|xlsx?|pptx?|odt|ods|odp|rtf|csv)(\?|#|$)/i;

/**
 * The Department's document CDN. Everything it serves is a file, including the
 * handful whose URL carries no extension.
 */
const DOC_HOSTS = [/durwo6bhtjtqt\.cloudfront\.net/i];

/** Is this href a document file, as opposed to a page? */
export function isDocumentUrl(href: string): boolean {
  if (!href) return false;
  // Locally-served assets are already ours — images, and these samples themselves.
  if (href.startsWith("/")) return false;
  return FILE_EXT.test(href) || DOC_HOSTS.some((h) => h.test(href));
}

/**
 * `href` if it is a page, a local sample if it is a document file.
 *
 * `hints` should carry whatever names the document — a card's label, a section's
 * heading — so the sample matches its kind. With no hints the caller still gets a
 * working file rather than a dead external link.
 */
export function localiseDocumentUrl(href: string, ...hints: (string | undefined)[]): string {
  return isDocumentUrl(href) ? sampleDocumentFor(...hints, href) : href;
}

/**
 * Every `href` in a run of ingested HTML that points at a document file, swapped
 * for the matching sample. The LINK TEXT is the hint, which is the best signal
 * available in prose: `<a href="…0006_August_2025-1.pdf">Newsletter, August
 * 2025</a>` resolves to the newsletter.
 *
 * Deliberately a regex over the markup rather than a DOM pass. This runs in a
 * server component on every organisation and scheme page; parsing 57 documents'
 * worth of ingested HTML to rewrite an attribute would cost more than it saves,
 * and the shape being matched — a double-quoted `href` emitted by our own
 * ingest — is not the general case that would justify a parser.
 */
export function localiseDocumentLinks(html: string): string {
  return html.replace(
    /href="([^"]+)"([^>]*)>([^<]{0,120})/gi,
    (whole, href: string, rest: string, text: string) =>
      isDocumentUrl(href)
        ? `href="${sampleDocumentFor(text, href)}"${rest}>${text}`
        : whole,
  );
}
