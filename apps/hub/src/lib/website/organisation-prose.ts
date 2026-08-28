/**
 * Tidying for the ingested organisation prose, shared by the organisation
 * detail template and the Adarsh Gram page.
 *
 * It lived inside the route file first, which meant only the page that happened
 * to call it got the benefit — the shared template rendered the raw HTML and
 * showed the title three times over. A route file cannot export a helper (the
 * App Router only permits its own exports), so the shared home is here.
 */

/**
 * The scraped sections repeat the page title twice more than they need to: the
 * body opens with a link back to the parent organisation, followed by an `<h1>`
 * saying the title a third time. The blue page banner and the breadcrumb
 * already carry both.
 *
 * A LEADING `<h1>` IS STRIPPED WHATEVER IT SAYS, and that is a correction. The
 * first version compared it against the page title and kept it when the two
 * differed — which is exactly what happened the day the title was corrected to
 * "Grants-in-Aid to States & Districts" while the scraped body still said
 * "Grants-in-aid to State/Districts". The page then showed both, one above the
 * other, and carried TWO `<h1>` elements: a heading-structure defect under
 * WCAG 1.3.1 and GIGW, not merely a repetition.
 *
 * The comparison was the wrong test. The banner carries this page's `<h1>`
 * unconditionally, so a second one in the body is redundant whether or not the
 * words match — and where they do not match, the body's is the stale one.
 *
 * Any `<h1>` further down is demoted rather than dropped: it is a real section
 * heading that was authored at the wrong level, and deleting it would take its
 * words with it.
 */
export function trimRedundantOpening(htmlBody: string): string {
  return htmlBody
    .replace(/^\s*<a\b[^>]*>[\s\S]*?<\/a>/i, "")
    .replace(/^\s*<h1\b[^>]*>[\s\S]*?<\/h1>/i, "")
    .replace(/<h1(\b[^>]*)>/gi, "<h2$1>")
    .replace(/<\/h1>/gi, "</h2>")
    .trim();
}
