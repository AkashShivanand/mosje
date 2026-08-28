/**
 * Ranking, filtering and "did you mean" for the website search.
 *
 * NO SEARCH LIBRARY, deliberately. The corpus is ~2,700 short records and fits in
 * memory, and the ranking a citizen needs here is not fuzzy-similarity — it is a
 * strict precedence: a page whose TITLE is what you typed must come first, every
 * time, and no scoring blend should be able to bury it under a document that
 * happens to repeat the word eleven times. Fuse.js is already a dependency (the
 * design-system docs search uses it) and remains the right tool the day this is
 * measurably not enough. It is not, yet.
 *
 * The precedence, highest first:
 *   1. the title IS the query
 *   2. the title starts with the query
 *   3. the title contains the query
 *   4. the keywords contain every word of the query   ← where citizen words land
 *   5. the description contains the query
 *   6. partial word coverage anywhere
 *
 * Then a type weight multiplies the score, so a scheme outranks a gallery page at
 * the same match strength, and finally the most recently dated record wins a tie.
 */
/*
 * The `.ts` extensions below are REQUIRED, not stylistic. `rank.test.ts` runs
 * under `node --test`, which resolves ESM specifiers exactly and cannot guess an
 * extension the way the bundler does. Drop them and the test file fails to load
 * with ERR_MODULE_NOT_FOUND while typecheck and build stay green — so the tests
 * silently stop running. `allowImportingTsExtensions` is on in tsconfig for this.
 */
import type { WebsiteSearchEntry, WebsiteSearchType } from "./types.ts";
import { TYPE_WEIGHT, SEARCH_FACETS } from "./types.ts";
import { CITIZEN_TERMS } from "./vocabulary.ts";

export const MIN_QUERY_LENGTH = 2;
export const RESULTS_PER_PAGE = 20;

export interface ScoredEntry {
  entry: WebsiteSearchEntry;
  score: number;
}

export interface FacetCount {
  type: WebsiteSearchType;
  label: string;
  count: number;
}

export interface SearchOutcome {
  /** The query as typed, trimmed. Echoed back to the reader verbatim. */
  query: string;
  /** Results for the ACTIVE facet, already paginated. */
  results: WebsiteSearchEntry[];
  /** Total matching the active facet — the number shown next to the query. */
  total: number;
  /** Total across every facet, which is what "no results" is judged on. */
  totalAllTypes: number;
  facets: FacetCount[];
  page: number;
  totalPages: number;
  /** A better spelling, when one exists AND actually returns more than this did. */
  didYouMean: string | null;
  /** The nearest few entries, shown when nothing matched. Never empty-handed. */
  nearest: WebsiteSearchEntry[];
}

function normalise(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function tokens(query: string): string[] {
  return normalise(query)
    .split(/[^\p{L}\p{N}]+/u)
    .filter((t) => t.length > 1);
}

/** Whole-word containment — so "aid" does not match "said" or "Aadhaar". */
function hasWord(haystack: string, word: string): boolean {
  const at = haystack.indexOf(word);
  if (at === -1) return false;
  const before = at === 0 ? " " : (haystack[at - 1] ?? " ");
  const after =
    at + word.length >= haystack.length ? " " : (haystack[at + word.length] ?? " ");
  return !/[\p{L}\p{N}]/u.test(before) && !/[\p{L}\p{N}]/u.test(after);
}

function scoreEntry(entry: WebsiteSearchEntry, query: string, queryTokens: string[]): number {
  const title = normalise(entry.title);
  const keywords = normalise(`${entry.keywords} ${entry.section}`);
  const description = normalise(entry.description);

  let score = 0;

  if (title === query) score = 1000;
  else if (title.startsWith(query)) score = 600;
  else if (title.includes(query)) score = 400;

  if (score === 0 && queryTokens.length > 0) {
    const inTitle = queryTokens.filter((t) => hasWord(title, t)).length;
    const inKeywords = queryTokens.filter((t) => hasWord(keywords, t)).length;
    const inDescription = queryTokens.filter((t) => hasWord(description, t)).length;

    if (inKeywords === queryTokens.length) score = 250;
    else if (description.includes(query)) score = 150;
    else if (inTitle > 0 || inKeywords > 0 || inDescription > 0) {
      // Partial coverage. Title words are worth most, description words least,
      // and a single common word matching one field is deliberately weak.
      const coverage =
        (inTitle * 3 + inKeywords * 2 + inDescription) / (queryTokens.length * 3);
      score = Math.round(coverage * 120);
    }
  }

  // A title word bonus that cannot promote a non-match: it only sharpens ordering
  // among entries that already scored.
  if (score > 0 && score < 400) {
    score += queryTokens.filter((t) => hasWord(title, t)).length * 20;
  }

  return score === 0 ? 0 : score * TYPE_WEIGHT[entry.type];
}

/** Levenshtein distance, capped — used only for "did you mean". */
function distance(a: string, b: string, max = 2): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let previous: number[] = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const current: number[] = [i];
    for (let j = 1; j <= b.length; j++) {
      current[j] = Math.min(
        (previous[j] ?? 0) + 1,
        (current[j - 1] ?? 0) + 1,
        (previous[j - 1] ?? 0) + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
    if (Math.min(...current) > max) return max + 1;
    previous = current;
  }
  return previous[b.length] ?? max + 1;
}

/**
 * The words worth correcting TO — every title word in the index plus every
 * citizen term the vocabulary knows. Built once, on the first miss, because a
 * search that finds something never needs it.
 */
let correctionVocabulary: string[] | null = null;

function vocabularyFor(index: WebsiteSearchEntry[]): string[] {
  if (correctionVocabulary) return correctionVocabulary;
  const words = new Set<string>(CITIZEN_TERMS);
  for (const entry of index) {
    for (const word of normalise(entry.title).split(/[^\p{L}\p{N}]+/u)) {
      if (word.length > 3) words.add(word);
    }
  }
  correctionVocabulary = [...words];
  return correctionVocabulary;
}

/** A plausible respelling of a query that found nothing, or null. */
export function spellingSuggestion(
  query: string,
  index: WebsiteSearchEntry[],
): string | null {
  const vocabulary = vocabularyFor(index);
  const corrected = tokens(query).map((token) => {
    if (vocabulary.includes(token)) return token;
    let best: string | null = null;
    let bestDistance = 3;
    for (const candidate of vocabulary) {
      const d = distance(token, candidate);
      if (d < bestDistance) {
        bestDistance = d;
        best = candidate;
      }
    }
    return best ?? token;
  });

  const suggestion = corrected.join(" ");
  return suggestion && suggestion !== normalise(query) ? suggestion : null;
}

export interface SearchOptions {
  type?: WebsiteSearchType | null;
  page?: number;
  perPage?: number;
}

/** Rank the whole index against a query. Returns every match, unpaginated. */
export function rank(index: WebsiteSearchEntry[], query: string): ScoredEntry[] {
  const normalised = normalise(query);
  const queryTokens = tokens(query);
  if (normalised.length < MIN_QUERY_LENGTH) return [];

  const scored: ScoredEntry[] = [];
  for (const entry of index) {
    const score = scoreEntry(entry, normalised, queryTokens);
    if (score > 0) scored.push({ entry, score });
  }

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    // A tie between two documents is broken by date: someone looking for a notice
    // wants this year's, not the best-matching one from 2009.
    const dateA = a.entry.updated ?? "";
    const dateB = b.entry.updated ?? "";
    if (dateA !== dateB) return dateB.localeCompare(dateA);
    return a.entry.title.localeCompare(b.entry.title);
  });

  return scored;
}

/** The full outcome for a results page: facets, paging, and the no-result fallbacks. */
export function search(
  index: WebsiteSearchEntry[],
  rawQuery: string,
  { type = null, page = 1, perPage = RESULTS_PER_PAGE }: SearchOptions = {},
): SearchOutcome {
  const query = rawQuery.trim();
  const scored = rank(index, query);

  const facets: FacetCount[] = SEARCH_FACETS.map((facet) => ({
    type: facet.type,
    label: facet.label,
    count: scored.filter((s) => s.entry.type === facet.type).length,
  }));

  const filtered = type ? scored.filter((s) => s.entry.type === type) : scored;
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);

  const nothingAnywhere = scored.length === 0 && query.length >= MIN_QUERY_LENGTH;
  const didYouMean = nothingAnywhere ? bestSuggestion(index, query) : null;

  return {
    query,
    results: filtered.slice((safePage - 1) * perPage, safePage * perPage).map((s) => s.entry),
    total,
    totalAllTypes: scored.length,
    facets,
    page: safePage,
    totalPages,
    didYouMean,
    // When a respelling exists, the nearest entries are ITS best results — those
    // are almost certainly what the reader wanted, and showing them means a typo
    // costs no click at all. Only when there is no respelling does the weaker
    // token-overlap heuristic have to carry it.
    nearest: nothingAnywhere
      ? didYouMean
        ? rank(index, didYouMean).slice(0, 3).map((s) => s.entry)
        : nearestEntries(index, query)
      : [],
  };
}

/** A respelling only counts if it actually finds something. */
function bestSuggestion(index: WebsiteSearchEntry[], query: string): string | null {
  const suggestion = spellingSuggestion(query, index);
  if (!suggestion) return null;
  return rank(index, suggestion).length > 0 ? suggestion : null;
}

/**
 * The three closest entries when nothing matched.
 *
 * Scored on single-token overlap rather than the strict precedence above, because
 * the point is to never leave the reader with a dead end — anything related beats
 * an empty page.
 */
function nearestEntries(
  index: WebsiteSearchEntry[],
  query: string,
  count = 3,
): WebsiteSearchEntry[] {
  const queryTokens = tokens(query);
  if (queryTokens.length === 0) return [];

  const scored = index
    .map((entry) => {
      const haystack = normalise(`${entry.title} ${entry.keywords}`);
      const hits = queryTokens.filter((t) =>
        t.length > 3 ? haystack.includes(t.slice(0, Math.max(4, t.length - 2))) : hasWord(haystack, t),
      ).length;
      return { entry, hits };
    })
    .filter((s) => s.hits > 0)
    .sort(
      (a, b) => b.hits - a.hits || TYPE_WEIGHT[b.entry.type] - TYPE_WEIGHT[a.entry.type],
    );

  return scored.slice(0, count).map((s) => s.entry);
}

/** Autocomplete suggestions — the top few, capped, for the masthead field. */
export function suggest(
  index: WebsiteSearchEntry[],
  query: string,
  limit = 8,
): WebsiteSearchEntry[] {
  return rank(index, query)
    .slice(0, limit)
    .map((s) => s.entry);
}
