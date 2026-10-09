import Link from "next/link";
import { Icon } from "@mosje/design-system";
import { DbimEmptyState } from "@/components/website-dbim/ui/EmptyState";
import { MIN_QUERY_LENGTH, POPULAR_SEARCHES, search, searchIndex } from "@/lib/website/search";
import { dbimHref } from "@/lib/website-dbim/nav";
import {
  categoryLabel,
  dbimSearch,
  highlight,
  searchHref,
  type DbimSearchCategory,
  type DbimSearchGroup,
  type DbimSearchHit,
  type DbimSearchOutcome,
  type DbimSearchSort,
} from "@/lib/website-dbim/search";
import { dbimSearchTarget } from "@/lib/website-dbim/utility";
import { DbimLinkRow } from "./LinkRow";
import { DbimSearchForm } from "./SearchForm";
import { DbimSearchPager } from "./SearchPager";
import "./search.css";

/*
 * DS Audit: Input, Select, Icon (design system) ✅ existing · DbimPagination, DbimEmptyState,
 * DbimLinkRow (DBIM design) ✅ existing · Search Result row, Search Categories filter ➕ added —
 * Figma MoSJE Website DBIM DS › Lists & Data (Search Result, Search Category, Search Categories).
 */

const BASE = () => dbimHref("/search");
const n = (v: number) => v.toLocaleString("en-IN");
const results = (v: number) => `${n(v)} ${v === 1 ? "result" : "results"}`;

/** One result — the Link Row's card, with a meta line above the title and the searched words in bold. */
function SearchResult({ hit, query }: { hit: DbimSearchHit; query: string }) {
  const external = !hit.path;
  const verb = hit.file ? "View" : external ? "Visit Website" : "Know More";
  const icon = hit.file ? "visibility" : external ? "open_in_new" : "arrow_forward";
  const pill = (
    <>
      <Icon name={icon} size={24} weight={400} aria-hidden />
      <span aria-hidden="true">{verb}</span>
      <span className="sr-only">
        {`${verb}: ${hit.title}`}
        {hit.file ? `, ${hit.meta}` : ""}
        {external ? " (opens in a new tab)" : ""}
      </span>
    </>
  );
  return (
    <li className="db-u-row db-search__row">
      <div className="db-u-row__text">
        {hit.meta && <p className="db-search__meta">{hit.meta}</p>}
        <p className="db-u-row__title">
          {highlight(hit.title, query).map((s, i) => (s.hit ? <strong key={i}>{s.text}</strong> : <span key={i}>{s.text}</span>))}
        </p>
        {hit.excerpt && <p className="db-u-row__detail">{hit.excerpt}</p>}
      </div>
      <div className="db-u-row__action">
        {external ? (
          <a className="db-u-pill" href={hit.href} target="_blank" rel="noopener noreferrer">
            {pill}
          </a>
        ) : (
          <Link className="db-u-pill" href={dbimHref(hit.path ?? "/")}>
            {pill}
          </Link>
        )}
      </div>
    </li>
  );
}

/**
 * Filter by Category — every category this search found something in, with its
 * count. Links, so each view has its own address. Desktop: an open panel beside the
 * results. Phone: a disclosure above them, naming the category being shown.
 */
function SearchCategories({ outcome, query, category, sort }: { outcome: DbimSearchOutcome; query: string; category?: DbimSearchCategory; sort: DbimSearchSort }) {
  const items = [{ key: undefined as DbimSearchCategory | undefined, label: "All Results", count: outcome.total }, ...outcome.counts];
  const list = (
    <ul className="db-search__cats-list">
      {items.map((c) => {
        const current = c.key === category;
        return (
          <li key={c.key ?? "all"}>
            <Link
              href={searchHref(BASE(), query, { category: c.key, sort })}
              className={current ? "db-search__cat is-current" : "db-search__cat"}
              aria-current={current ? "page" : undefined}
            >
              <span className="db-search__cat-label">{c.label}</span>
              <span className="db-search__cat-count">
                {n(c.count)}
                <span className="sr-only"> {c.count === 1 ? "result" : "results"}</span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
  const currentLabel = category ? categoryLabel(category) : "All Results";
  const currentCount = category ? (outcome.counts.find((c) => c.key === category)?.count ?? 0) : outcome.total;
  return (
    <>
      <nav className="db-search__cats db-search__cats--panel" aria-label="Filter by category">
        <p className="db-search__cats-title">Filter by Category</p>
        {list}
      </nav>
      <details className="db-search__cats db-search__cats--disclosure">
        <summary className="db-search__cats-title">
          Category: {currentLabel} ({n(currentCount)})
          <Icon name="expand_more" size={24} aria-hidden className="db-search__cats-chevron" />
        </summary>
        <nav aria-label="Filter by category">{list}</nav>
      </details>
    </>
  );
}

/** A category's results. In All Results it ends with "View All n …" when there are more. */
function Group({ group, query, sort, preview }: { group: DbimSearchGroup; query: string; sort: DbimSearchSort; preview: boolean }) {
  const id = `db-search-${group.key}`;
  const more = preview && group.count > group.hits.length;
  return (
    <section className="db-search__group" aria-labelledby={id}>
      <div className="db-search__group-head">
        <h3 id={id} className="db-search__group-title">
          {group.label}
        </h3>
        <span className="db-search__group-count">{results(group.count)}</span>
      </div>
      <ul className="db-u-rows db-search__rows" aria-labelledby={id}>
        {group.hits.map((h, i) => (
          <SearchResult key={`${h.path ?? h.href}-${i}`} hit={h} query={query} />
        ))}
      </ul>
      {more && (
        <Link className="db-search__more" href={searchHref(BASE(), query, { category: group.key, sort })}>
          View All {n(group.count)} {group.label}
          <Icon name="arrow_forward" size={20} aria-hidden />
        </Link>
      )}
    </section>
  );
}

/** Nothing matched (DBIM 3.0 §9 vii: suggest, never a dead end). */
function NoMatch({ query }: { query: string }) {
  const outcome = search(searchIndex(), query, { perPage: 1 });
  const nearest = outcome.nearest
    .map((e) => ({ e, t: dbimSearchTarget(e.href) }))
    .filter((x): x is { e: (typeof outcome.nearest)[number]; t: { path: string } | { href: string } } => !!x.t)
    .slice(0, 3);
  return (
    <div className="db-search__none">
      <DbimEmptyState>No results for “{query}”.</DbimEmptyState>
      {outcome.didYouMean ? (
        <p className="db-u-search__count">
          Did you mean <Link href={searchHref(BASE(), outcome.didYouMean)}>{outcome.didYouMean}</Link>?
        </p>
      ) : null}
      <p className="db-search__hint">
        Check the spelling, try fewer words, or browse{" "}
        <Link href={dbimHref("/offerings")}>Schemes and Services</Link>.
      </p>
      {nearest.length ? (
        <>
          <h3 id="db-search-near" className="db-u-search__near">
            Closest Matches
          </h3>
          <ul className="db-u-rows" aria-labelledby="db-search-near">
            {nearest.map(({ e, t }) => (
              <DbimLinkRow key={e.href} label={e.title} detail={e.description} {...t} />
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}

/** Nothing searched yet: the search, and what people most often look for. */
function Idle() {
  return (
    <section aria-labelledby="db-search-popular" className="db-search__idle">
      <h3 id="db-search-popular" className="db-search__group-title">
        Popular Searches
      </h3>
      <ul className="db-search__popular">
        {POPULAR_SEARCHES.map((q) => (
          <li key={q}>
            <Link href={searchHref(BASE(), q)}>{q}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Feedback() {
  return (
    <p className="db-search__feedback">
      Did not find what you were looking for? <Link href={dbimHref("/feedback")}>Send Feedback</Link>
    </p>
  );
}

export interface DbimSearchResultsProps {
  query: string;
  page: number;
  category?: DbimSearchCategory;
  sort: DbimSearchSort;
}

export function DbimSearchResults({ query, page, category, sort }: DbimSearchResultsProps) {
  const form = <DbimSearchForm query={query} category={category} sort={sort} showSort={query.length >= MIN_QUERY_LENGTH} />;

  if (!query) {
    return (
      <section aria-labelledby="db-search-title" className="db-u-search db-results">
        <h2 id="db-search-title" className="db-u-search__title">
          Search the Website
        </h2>
        {form}
        <Idle />
      </section>
    );
  }

  if (query.length < MIN_QUERY_LENGTH) {
    return (
      <section aria-labelledby="db-search-title" className="db-u-search db-results">
        <h2 id="db-search-title" className="db-u-search__title">
          Search the Website
        </h2>
        {form}
        <p className="db-u-search__count" role="status">
          Enter at least {MIN_QUERY_LENGTH} letters to search.
        </p>
      </section>
    );
  }

  const outcome = dbimSearch(query, { category, sort, page });
  const group = category ? outcome.groups[0] : undefined;
  const status = !outcome.total
    ? `No results for “${query}”`
    : group && group.count > 0
      ? `${results(group.count)} in ${group.label}${outcome.pageCount > 1 ? `, page ${outcome.page} of ${outcome.pageCount}` : ""}`
      : `${results(outcome.total)} in ${outcome.counts.length} ${outcome.counts.length === 1 ? "category" : "categories"}`;

  return (
    <section aria-labelledby="db-search-title" className="db-u-search db-results">
      <h2 id="db-search-title" className="db-u-search__title">
        Results for “{query}”
      </h2>
      <p className="db-u-search__count" role="status">
        {status}
      </p>
      {outcome.total === 0 ? (
        <>
          {form}
          <NoMatch query={query} />
          <Feedback />
        </>
      ) : (
        <div className="db-search__body">
          <SearchCategories outcome={outcome} query={query} category={category} sort={sort} />
          <div className="db-search__results">
            {form}
            {group && group.count === 0 ? (
              <div className="db-search__none">
                <DbimEmptyState>
                  No {categoryLabel(group.key)} match “{query}”.
                </DbimEmptyState>
                <p className="db-search__hint">
                  <Link href={searchHref(BASE(), query, { sort })}>Show All {results(outcome.total)}</Link>
                </p>
              </div>
            ) : group ? (
              <>
                <Group group={group} query={query} sort={sort} preview={false} />
                {outcome.pageCount > 1 && (
                  <DbimSearchPager query={query} category={category} sort={sort} page={outcome.page} pageCount={outcome.pageCount} />
                )}
              </>
            ) : (
              outcome.groups.map((g) => <Group key={g.key} group={g} query={query} sort={sort} preview />)
            )}
            <Feedback />
          </div>
        </div>
      )}
    </section>
  );
}
