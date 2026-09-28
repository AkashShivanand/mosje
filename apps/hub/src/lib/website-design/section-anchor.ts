/**
 * Keeping the reader on the same section when the demo rail switches the website's design.
 *
 * The switch is a full reload (the proxy picks the tree per request — see constants.ts), and
 * the three designs lay the same content out at different heights: "About Us" sits at 1364px
 * in the redesign, 785px in the classic design and 1100px in the DBIM one. Restoring the
 * pixel offset therefore lands somewhere else entirely, which defeats the point of switching
 * — comparing one section across the three.
 *
 * So the section is remembered by its HEADING, not its position. Before the reload the
 * headings nearest the reader are recorded with where each sat on screen; after it the first
 * one the new design also carries is put back at the same place. Where none match (the DBIM
 * build follows another site's information architecture, and names some sections
 * differently) the reader lands at the same fraction of the page, which is the least wrong
 * answer left.
 *
 * The pure half is here so it can be tested; the DOM half is in `section-anchor-dom.ts`.
 */

export interface HeadingPosition {
  text: string;
  /** Top of the heading relative to the viewport, in CSS px. */
  top: number;
}

export interface SectionAnchor {
  path: string;
  /** Headings to try, best first, each with where it sat on screen. */
  headings: HeadingPosition[];
  /** Scroll position as a share of the scrollable distance, 0–1. */
  fraction: number;
  /** Written at, so a stale anchor from an abandoned switch is ignored. */
  at: number;
}

/** How many headings are kept as fallbacks. */
const MAX_CANDIDATES = 8;

/** Headings compare case-, punctuation- and apostrophe-blind: "What’s New" is "Whats new". */
export function normaliseHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[’'`]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

/**
 * Order the headings on screen by how well each marks "the section the reader is on".
 *
 * The line that decides it is a quarter of the way down the viewport. A heading above it is
 * the start of what is being read and ranks by closeness; one below it is the NEXT section,
 * so it is penalised — it only wins where nothing above is close.
 */
export function rankHeadings(headings: HeadingPosition[], viewportHeight: number): HeadingPosition[] {
  const line = viewportHeight * 0.25;
  const score = (h: HeadingPosition) => (h.top <= line ? line - h.top : (h.top - line) * 1.5);
  const seen = new Set<string>();
  return headings
    .filter((h) => normaliseHeading(h.text) !== "")
    .sort((a, b) => score(a) - score(b))
    .filter((h) => {
      const key = normaliseHeading(h.text);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, MAX_CANDIDATES);
}

/**
 * Where to scroll to on the new page.
 *
 * `found` maps a normalised heading to its document top in the new design. The heading goes
 * back to the same place on screen, clamped so it is always visible: a fallback heading that
 * was 600px above the viewport would otherwise be put back off-screen, and the reader would
 * have nothing to recognise.
 */
export function resolveScroll(
  anchor: SectionAnchor,
  found: ReadonlyMap<string, number>,
  viewportHeight: number,
  maxScroll: number,
): number {
  for (const h of anchor.headings) {
    const docTop = found.get(normaliseHeading(h.text));
    if (docTop === undefined) continue;
    const onScreen = Math.min(Math.max(h.top, 0), viewportHeight * 0.6);
    return clamp(docTop - onScreen, 0, maxScroll);
  }
  return clamp(Math.round(anchor.fraction * maxScroll), 0, maxScroll);
}

const clamp = (n: number, lo: number, hi: number) => Math.min(Math.max(n, lo), Math.max(lo, hi));
