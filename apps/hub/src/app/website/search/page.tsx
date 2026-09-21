import type { Metadata } from "next";
import Link from "next/link";
import { Icon, Pagination, SectionTitle } from "@mosje/design-system";
import { PageLayout } from "@/components/website-next/layout/PageLayout";
import { SearchField } from "@/components/website-next/search/SearchField";
import { SearchResult } from "@/components/website-next/search/SearchResult";
import { POPULAR_LINKS } from "@/components/website-next/search/popular-links";
import { ResultClickTracker } from "@/components/website/search/ResultClickTracker";
import {
  searchIndex,
  search,
  facetLabel,
  MIN_QUERY_LENGTH,
  RESULTS_PER_PAGE,
  POPULAR_SEARCHES,
  type WebsiteSearchType,
} from "@/lib/website/search";
import { recordSearch } from "@/lib/website/search/analytics";
import { SEARCH_FACETS } from "@/lib/website/search/types";
import "@/components/website-next/templates/media.css";
import "@/components/website-next/search/search.css";

export const metadata: Metadata = {
  title: "Search | Department of Social Justice & Empowerment",
  description:
    "Search schemes, organisations, documents, officials and pages across the website of the Department of Social Justice & Empowerment.",
  // A results page has no content of its own and changes with every query;
  // indexing it fills a search engine with this site's search engine.
  robots: { index: false, follow: true },
};

const RESULTS_LIST_ID = "search-results";

interface SearchPageProps {
  searchParams: Promise<{ q?: string; type?: string; page?: string }>;
}

function isFacet(value: string | undefined): value is WebsiteSearchType {
  return SEARCH_FACETS.some((facet) => facet.type === value);
}

/** Preserve the query while changing one thing about the result set. */
function urlFor(query: string, type: WebsiteSearchType | null, page: number): string {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (type) params.set("type", type);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/website/search?${qs}` : "/website/search";
}

/** Search terms offered as links. Each is a real query, so each is a real results page. */
function SuggestedSearches({ terms, headingId, title }: { terms: string[]; headingId: string; title: string }) {
  return (
    <section aria-labelledby={headingId} className="wn-search__block">
      <h2 id={headingId} className="wn-search__subhead">
        {title}
      </h2>
      <ul className="wn-search__chips">
        {terms.map((term) => (
          <li key={term}>
            <Link href={`/website/search?q=${encodeURIComponent(term)}`} className="wn-search__chip">
              <span aria-hidden className="wn-search__chip-icon">
                <Icon name="search" size={16} />
              </span>
              {term}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** The five places most readers want, the sitemap among them [GIGW 5.2]. Never a dead end. */
function PopularLinks({ headingId }: { headingId: string }) {
  return (
    <section aria-labelledby={headingId} className="wn-search__block">
      <h2 id={headingId} className="wn-search__subhead">
        Popular Links
      </h2>
      <ul className="wn-search__links">
        {POPULAR_LINKS.map((l) => (
          <li key={l.href}>
            <Link href={l.href}>
              <span aria-hidden className="wn-search__link-icon">
                <Icon name={l.icon} size={20} />
              </span>
              <span>{l.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * Search results — `/website/search?q=…&type=…&page=…` (issues X-SRCH-01,
 * NAV-11). The URL is the state: a result set is shareable, the back button
 * undoes a facet, and the page renders on the server so it works before the
 * script arrives.
 *
 * FIVE STATES, each worded differently because each asks something different
 * of the reader:
 *   idle (no query)        → the field, focused, suggested searches, popular links
 *   too short (< 2 chars)  → a prompt, not an error
 *   results                → count echoing the query, facets in the URL, paged at 20
 *   no results             → the query echoed, "did you mean", the nearest
 *                            entries, suggested searches and popular links
 *   facet to nothing       → the facet named, with the way back to all results
 * Loading and error cannot occur: the index is built in-process on the server.
 */
export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = (params.q ?? "").trim();
  const type = isFacet(params.type) ? params.type : null;
  const page = Math.max(1, Number(params.page) || 1);

  const index = searchIndex();
  const outcome = search(index, query, { type, page });

  // Logged server-side: zero-result queries are the product backlog [DBIM 9.x].
  if (query.length >= MIN_QUERY_LENGTH) {
    recordSearch(query, outcome.totalAllTypes, type);
  }

  const tooShort = query.length > 0 && query.length < MIN_QUERY_LENGTH;
  const hasQuery = query.length >= MIN_QUERY_LENGTH;
  const noResults = hasQuery && outcome.totalAllTypes === 0;
  const activeFacets = outcome.facets.filter((f) => f.count > 0);

  return (
    <PageLayout
      title="Search"
      description="Find schemes, organisations, documents, officials and pages across this website."
      breadcrumb={[{ label: "Search" }]}
    >
      <div className="wn-section">
        <div className="sa-container">
          <div className="wn-search__field">
            <SearchField initialQuery={query} autoFocus={!hasQuery} />
          </div>

          {/* ── Idle: nothing asked yet ─────────────────────────────────── */}
          {!hasQuery && !tooShort && (
            <div className="wn-search__idle">
              <SuggestedSearches terms={POPULAR_SEARCHES} headingId="suggested" title="Suggested Searches" />
              <PopularLinks headingId="popular" />
            </div>
          )}

          {/* ── Too short: a prompt, not an error ───────────────────────── */}
          {tooShort && (
            <div className="wn-search__idle">
              <p className="wn-search__notice" role="status">
                Enter at least {MIN_QUERY_LENGTH} letters to search.
              </p>
              <SuggestedSearches terms={POPULAR_SEARCHES.slice(0, 6)} headingId="suggested" title="Suggested Searches" />
            </div>
          )}

          {/* ── No results anywhere ─────────────────────────────────────── */}
          {noResults && (
            <div className="wn-search__none">
              <div className="wn-search__none-head">
                <h2 className="wn-search__none-title" role="status">
                  No results for <q>{query}</q>
                </h2>
                {outcome.didYouMean ? (
                  <p className="wn-search__none-lead">
                    Did you mean{" "}
                    <Link href={`/website/search?q=${encodeURIComponent(outcome.didYouMean)}`} className="wn-search__inline-link">
                      {outcome.didYouMean}
                    </Link>
                    ?
                  </p>
                ) : (
                  <p className="wn-search__none-lead">Check the spelling, or try a shorter or more general word.</p>
                )}
              </div>

              {outcome.nearest.length > 0 && (
                <section aria-labelledby="nearest" className="wn-search__block">
                  <h2 id="nearest" className="wn-search__subhead">
                    Closest Matches
                  </h2>
                  <ul className="wn-results">
                    {outcome.nearest.map((entry, i) => (
                      <SearchResult key={entry.href} entry={entry} index={i} />
                    ))}
                  </ul>
                </section>
              )}

              <div className="wn-search__idle">
                <SuggestedSearches terms={POPULAR_SEARCHES.slice(0, 8)} headingId="suggested" title="Suggested Searches" />
                <PopularLinks headingId="popular" />
              </div>
            </div>
          )}

          {/* ── Results ─────────────────────────────────────────────────── */}
          {hasQuery && !noResults && (
            <div className="wn-search__results">
              {/* Facets are links: the filter lives in the URL [DBIM 9.iv]. A
                  facet with no results is not offered (NAV-15). */}
              <nav aria-label="Filter results by type" className="wn-facets">
                <h2 className="wn-facets__title">Filter by Type</h2>
                <ul className="wn-facets__list">
                  <li>
                    <Link href={urlFor(query, null, 1)} aria-current={type === null ? "page" : undefined} className="wn-facet">
                      <span>All Results</span>
                      <span className="wn-facet__count">{outcome.totalAllTypes.toLocaleString("en-IN")}</span>
                    </Link>
                  </li>
                  {activeFacets.map((facet) => (
                    <li key={facet.type}>
                      <Link
                        href={urlFor(query, facet.type, 1)}
                        aria-current={type === facet.type ? "page" : undefined}
                        className="wn-facet"
                      >
                        <span>{facet.label}</span>
                        <span className="wn-facet__count">{facet.count.toLocaleString("en-IN")}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="wn-search__main">
                <SectionTitle
                  as={2}
                  headingId="results-title"
                  title={type ? `${facetLabel(type)} Matching “${query}”` : `Results for “${query}”`}
                />
                <p className="wn-count" role="status" aria-live="polite">
                  {outcome.total === 0
                    ? `No ${facetLabel(type!).toLowerCase()} match “${query}”.`
                    : `${outcome.total.toLocaleString("en-IN")} ${outcome.total === 1 ? "result" : "results"}${
                        outcome.totalPages > 1 ? `, page ${outcome.page} of ${outcome.totalPages}` : ""
                      }`}
                </p>

                {outcome.total === 0 ? (
                  <div className="wn-search__facet-empty">
                    <p>
                      Nothing in {facetLabel(type!)} matches <q>{query}</q>, but other types do.
                    </p>
                    <Link href={urlFor(query, null, 1)} className="wn-search__inline-link">
                      Show All {outcome.totalAllTypes.toLocaleString("en-IN")} Results
                    </Link>
                  </div>
                ) : (
                  <>
                    <ul id={RESULTS_LIST_ID} className="wn-results" aria-labelledby="results-title">
                      {outcome.results.map((entry, i) => (
                        <SearchResult key={`${entry.href}-${i}`} entry={entry} index={(outcome.page - 1) * RESULTS_PER_PAGE + i} />
                      ))}
                    </ul>
                    <ResultClickTracker query={query} listId={RESULTS_LIST_ID} />
                    {outcome.totalPages > 1 && (
                      <div className="wn-pager">
                        <Pagination
                          page={outcome.page}
                          totalPages={outcome.totalPages}
                          hrefFor={(n) => urlFor(query, type, n)}
                          label="Search result pages"
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
