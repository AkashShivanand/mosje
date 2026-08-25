/**
 * What people search for, and what the site failed to give them.
 *
 * ZERO-RESULT QUERIES ARE THE PRODUCT BACKLOG. They are, literally, a list of
 * things citizens came here wanting that the site either does not offer or does
 * not name their way — and most of them are fixed by one line in
 * `vocabulary.ts`, not by writing new content. `[DBIM 9.x]`
 *
 * WHAT THIS IS AND IS NOT. There is no analytics warehouse in this estate and
 * this does not invent one. Two sinks, both honest about their limits:
 *
 *  1. A STRUCTURED LOG LINE, one JSON object per event, on the server. That is
 *     durable wherever the app is deployed (Vercel keeps them, and they can be
 *     drained to anything later) and costs nothing. It is the sink that matters.
 *  2. A BOUNDED IN-MEMORY RING of the most recent zero-result queries, so the
 *     admin panel can show them without a database. This is PER-PROCESS and
 *     evaporates on redeploy — it is a convenience for looking at today's misses,
 *     never the record. Anything that must survive comes out of the logs.
 *
 * When a real event store arrives, `record()` is the one function to repoint.
 */

export type SearchEventName = "search" | "search_zero_results" | "search_result_click";

export interface SearchEvent {
  event: SearchEventName;
  /** The query as typed. Never normalised — a misspelling IS the finding. */
  query: string;
  resultCount?: number;
  /** Active facet, when the reader had filtered. */
  facet?: string | null;
  /** For a click: where they went and how far down the list it was. */
  href?: string;
  position?: number;
  at: string;
}

/** How many recent misses the in-memory ring holds. Small on purpose. */
const ZERO_RESULT_RING = 200;

const zeroResults: SearchEvent[] = [];

function remember(event: SearchEvent): void {
  if (event.event !== "search_zero_results") return;
  zeroResults.push(event);
  if (zeroResults.length > ZERO_RESULT_RING) zeroResults.shift();
}

/**
 * Emit one event.
 *
 * Never throws and never awaits anything the reader is waiting on: a search that
 * fails to be logged must still return results.
 */
export function record(event: Omit<SearchEvent, "at">): void {
  const full: SearchEvent = { ...event, at: new Date().toISOString() };
  try {
    remember(full);
    // One line, one JSON object — greppable in any log drain.
    console.log(`[website-search] ${JSON.stringify(full)}`);
  } catch {
    /* Logging is best-effort by design. */
  }
}

/** Record a query and its outcome. Splits zero-result queries into their own event. */
export function recordSearch(
  query: string,
  resultCount: number,
  facet: string | null = null,
): void {
  if (!query.trim()) return;
  record({ event: "search", query, resultCount, facet });
  if (resultCount === 0) {
    record({ event: "search_zero_results", query, resultCount: 0, facet });
  }
}

/** Record that a result was actually opened — the half that says search WORKED. */
export function recordResultClick(query: string, href: string, position: number): void {
  record({ event: "search_result_click", query, href, position });
}

/**
 * Recent zero-result queries, most recent first.
 *
 * Per-process and lost on redeploy — see the note at the top. Read it as "what
 * has missed lately on this instance", never as a total.
 */
export function recentZeroResults(): SearchEvent[] {
  return [...zeroResults].reverse();
}
