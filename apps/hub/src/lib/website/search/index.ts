/**
 * The website's search.
 *
 *   searchIndex()  the derived corpus — see build.ts
 *   search()       a full results page: ranking, facets, paging, no-result help
 *   suggest()      the masthead autocomplete's shortlist
 *
 * Everything is server-side. The index is roughly a megabyte of strings and is
 * never shipped to the browser; the autocomplete reaches it over
 * `/api/website/search`.
 */
export { searchIndex } from "./build";
export {
  search,
  rank,
  suggest,
  spellingSuggestion,
  MIN_QUERY_LENGTH,
  RESULTS_PER_PAGE,
} from "./rank";
export type { SearchOutcome, FacetCount, SearchOptions } from "./rank";
export { SEARCH_FACETS, facetLabel, TYPE_WEIGHT } from "./types";
export type { WebsiteSearchEntry, WebsiteSearchType } from "./types";
export { POPULAR_SEARCHES } from "./popular";
