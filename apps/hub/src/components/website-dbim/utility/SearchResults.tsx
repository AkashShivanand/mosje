import { DbimEmptyState } from "@/components/website-dbim/ui/EmptyState";
import { MIN_QUERY_LENGTH, rank, searchIndex } from "@/lib/website/search";
import { dbimSearchTarget } from "@/lib/website-dbim/utility";
import { DbimLinkRow } from "./LinkRow";
import { DbimSearchPager } from "./SearchPager";

const PER_PAGE = 10;

interface Hit {
  title: string;
  description: string;
  path?: string;
  href?: string;
}

/**
 * The estate's search (lib/website/search — the index and the ranking, not its UI),
 * with every hit sent to its DBIM page. A hit this design has no page for is left
 * out; hits that land on the same DBIM page collapse into the best-ranked one.
 * Rendered on the server: the index never reaches the browser.
 */
function hitsFor(query: string): Hit[] {
  const seen = new Set<string>();
  const hits: Hit[] = [];
  for (const { entry } of rank(searchIndex(), query)) {
    const target = dbimSearchTarget(entry.href);
    if (!target) continue;
    const key = "path" in target ? target.path : target.href;
    if (seen.has(key)) continue;
    seen.add(key);
    hits.push({ title: entry.title, description: entry.description, ...target });
  }
  return hits;
}

export function DbimSearchResults({ query, page }: { query: string; page: number }) {
  // Idle: nothing asked. The reference's own answer.
  if (!query) return <DbimEmptyState />;

  if (query.length < MIN_QUERY_LENGTH) {
    return (
      <p className="db-u-search__count" role="status">
        Enter at least {MIN_QUERY_LENGTH} letters to search.
      </p>
    );
  }

  const hits = hitsFor(query);
  const pageCount = Math.max(1, Math.ceil(hits.length / PER_PAGE));
  const current = Math.min(Math.max(1, page), pageCount);
  const visible = hits.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  return (
    <section aria-labelledby="db-search-title" className="db-u-search">
      <h2 id="db-search-title" className="db-u-search__title">
        Results for “{query}”
      </h2>
      {hits.length === 0 ? (
        <DbimEmptyState />
      ) : (
        <>
          <p className="db-u-search__count" role="status">
            {hits.length.toLocaleString("en-IN")} {hits.length === 1 ? "result" : "results"}
            {pageCount > 1 ? `, page ${current} of ${pageCount}` : ""}
          </p>
          <ul className="db-u-rows" aria-labelledby="db-search-title">
            {visible.map((h) => (
              <DbimLinkRow key={h.path ?? h.href} label={h.title} detail={h.description} path={h.path} href={h.href} />
            ))}
          </ul>
          <DbimSearchPager query={query} page={current} pageCount={pageCount} />
        </>
      )}
    </section>
  );
}
