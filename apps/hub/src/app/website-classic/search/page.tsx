import type { Metadata } from "next";
import Link from "next/link";
import { Icon, Pagination } from "@mosje/design-system";
import { PageLayout } from "@/components/website/layout/PageLayout";
import { SearchPageField } from "@/components/website/search/SearchPageField";
import { ResultClickTracker } from "@/components/website/search/ResultClickTracker";
import {
  searchIndex,
  search,
  facetLabel,
  MIN_QUERY_LENGTH,
  RESULTS_PER_PAGE,
  POPULAR_SEARCHES,
  type WebsiteSearchEntry,
  type WebsiteSearchType,
} from "@/lib/website/search";
import { recordSearch } from "@/lib/website/search/analytics";
import { SEARCH_FACETS } from "@/lib/website/search/types";
import { resolveRegistry } from "@/lib/registry/resolve";
import { resolveChatbotPaths } from "@/lib/chatbot/resolve";
import { chatbotEnabledAt } from "@/lib/chatbot/config";

export const metadata: Metadata = {
  title: "Search | Department of Social Justice & Empowerment",
  description:
    "Search schemes, organisations, documents, officials and pages across the website of the Department of Social Justice & Empowerment.",
  // A results page is not a page: it has no content of its own, it changes with
  // every query, and indexing it fills a search engine with our search engine.
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

/** A link that leaves the site — documents live on dosje.gov.in, not here. */
function isExternal(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}

function ResultRow({ entry, index }: { entry: WebsiteSearchEntry; index: number }) {
  const external = isExternal(entry.href);
  return (
    <li className="border-b border-gray-200 last:border-b-0">
      <a
        href={entry.href}
        data-result-index={index}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="group flex gap-4 py-5 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
      >
        <span
          className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-primary"
          aria-hidden="true"
        >
          <Icon name={entry.iconName} size={20} />
        </span>
        <span className="min-w-0">
          <span className="mb-1 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-surface-muted px-2 py-0.5 text-label-3 uppercase text-ink-muted">
              {facetLabel(entry.type)}
            </span>
            <span className="text-body-3 text-ink-muted">{entry.section}</span>
            {entry.updated && (
              <span className="text-body-3 text-ink-muted">
                · {new Date(entry.updated).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            )}
          </span>
          <span className="block text-title-2 text-ink group-hover:text-primary group-hover:underline">
            {entry.title}
            {external && (
              <>
                {" "}
                <Icon name="open_in_new" size={16} className="inline-block align-text-bottom" />
                <span className="sr-only"> (opens on dosje.gov.in in a new tab)</span>
              </>
            )}
          </span>
          {entry.description && (
            <span className="mt-1 block line-clamp-2 text-body-2 text-ink-muted">
              {entry.description}
            </span>
          )}
        </span>
      </a>
    </li>
  );
}

/** The chips offered on the empty and no-result states. Never a dead end. */
function SuggestionChips({ terms }: { terms: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {terms.map((term) => (
        <li key={term}>
          <Link
            href={`/website/search?q=${encodeURIComponent(term)}`}
            className="inline-block rounded-full border border-gray-200 bg-white px-4 py-1.5 text-label-1 text-ink-muted transition hover:border-primary/40 hover:text-primary"
          >
            {term}
          </Link>
        </li>
      ))}
    </ul>
  );
}

/**
 * The ways out of a dead end: the sitemap — the OTHER mechanism GIGW accepts for
 * Multiple Ways, so it must be reachable from here — the full scheme catalogue,
 * and a human. `[GIGW 5.2 / WCAG 2.4.5]`
 *
 * `assistant` is passed in rather than assumed, because the assistant is a
 * SETTING (`/admin/portals`, `chatbot_config`). Pointing a reader at a launcher
 * that has been switched off is a worse dead end than the one they are already
 * in — so the mention is rendered only when it is really there. It is a mention
 * and not a link on purpose: the assistant has no URL, it is a launcher in the
 * bottom-right corner, and inventing an href for it would be a lie.
 */
function WaysOut({ assistant }: { assistant: boolean }) {
  return (
    <>
    <div className="mt-8 grid gap-4 sm:grid-cols-3">
      {[
        {
          href: "/website/sitemap",
          icon: "account_tree",
          title: "Browse the sitemap",
          body: "Every section of this website, listed in one place.",
        },
        {
          href: "/website/schemes-services",
          icon: "volunteer_activism",
          title: "Browse all schemes",
          body: "The full catalogue of schemes and services, filterable by category.",
        },
        {
          href: "/website/contact-us",
          icon: "call",
          title: "Ask a person",
          body: "Office addresses, phone numbers and email for the Department.",
        },
      ].map((card) => (
        <Link
          key={card.href}
          href={card.href}
          className="rounded-xl border border-gray-200 bg-white p-5 transition hover:border-primary/40"
        >
          <Icon name={card.icon} size={24} className="mb-2 text-primary" />
          <span className="block font-semibold text-ink">{card.title}</span>
          <span className="mt-1 block text-body-2 text-ink-muted">{card.body}</span>
        </Link>
      ))}
    </div>
    {assistant && (
      <p className="mt-4 flex items-start gap-2 text-body-2 text-ink-muted">
        <Icon name="support_agent" size={20} className="shrink-0 text-primary" />
        <span>
          Samajik Sahayak, the assistant, is in the bottom-right corner of this page.
          It can walk you through five questions and suggest schemes that name you.
        </span>
      </p>
    )}
    </>
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = (params.q ?? "").trim();
  const type = isFacet(params.type) ? params.type : null;
  const page = Math.max(1, Number(params.page) || 1);

  const index = searchIndex();
  const outcome = search(index, query, { type, page });

  // Resolved the same way the root layout resolves it, through the same shared
  // decision function, so the two cannot disagree about whether the assistant is
  // on this surface.
  const assistant = chatbotEnabledAt(
    "/website/search",
    await resolveChatbotPaths(await resolveRegistry()),
  );

  // Logged server-side, so it records what the site was actually asked for even
  // when the reader never clicks anything. Zero-result queries are the backlog.
  if (query.length >= MIN_QUERY_LENGTH) {
    recordSearch(query, outcome.totalAllTypes, type);
  }

  const tooShort = query.length > 0 && query.length < MIN_QUERY_LENGTH;
  const hasQuery = query.length >= MIN_QUERY_LENGTH;
  const noResults = hasQuery && outcome.totalAllTypes === 0;

  return (
    <PageLayout
      title="Search"
      description="Find schemes, organisations, documents, officials and pages across this website."
      breadcrumb={[{ label: "Search" }]}
    >
      <section className="bg-white py-10 md:py-12">
        <div className="sa-container">
          <div className="mx-auto max-w-3xl">
            <SearchPageField initialQuery={query} autoFocus={!hasQuery} />
          </div>

          {/* ── No query ──────────────────────────────────────────────────────
              Never an empty page. A reader who clicked the magnifier has told you
              they are looking for something; this is the best moment the site
              gets to show what it holds. */}
          {!hasQuery && !tooShort && (
            <div className="mx-auto mt-10 max-w-3xl">
              <h2 className="mb-3 text-headline-2 text-ink">Popular searches</h2>
              <SuggestionChips terms={POPULAR_SEARCHES} />
              <p className="mt-8 text-body-2 text-ink-muted">
                This search covers {index.length.toLocaleString("en-IN")}{" "}
                schemes, organisations, documents, officials and pages. Try a word you
                would use yourself — &ldquo;school money&rdquo; finds scholarships.
              </p>
              <WaysOut assistant={assistant} />
            </div>
          )}

          {/* ── Query too short — a prompt, not an error ─────────────────────── */}
          {tooShort && (
            <div className="mx-auto mt-10 max-w-3xl">
              <p className="text-body-1 text-ink">
                Keep typing — a search needs at least {MIN_QUERY_LENGTH} letters.
              </p>
              <div className="mt-6">
                <SuggestionChips terms={POPULAR_SEARCHES.slice(0, 6)} />
              </div>
            </div>
          )}

          {/* ── No results ──────────────────────────────────────────────────── */}
          {noResults && (
            <div className="mx-auto mt-10 max-w-3xl">
              <h2 className="text-headline-2 text-ink">
                No results for <span className="text-primary">{query}</span>
              </h2>

              {outcome.didYouMean && (
                <p className="mt-3 text-body-1 text-ink">
                  Did you mean{" "}
                  <Link
                    href={`/website/search?q=${encodeURIComponent(outcome.didYouMean)}`}
                    className="font-semibold text-primary underline"
                  >
                    {outcome.didYouMean}
                  </Link>
                  ?
                </p>
              )}

              {outcome.nearest.length > 0 && (
                <div className="mt-6">
                  <h3 className="mb-2 text-label-3 uppercase text-ink-muted">
                    Closest matches
                  </h3>
                  <ul className="rounded-xl border border-gray-200 bg-white px-5">
                    {outcome.nearest.map((entry, i) => (
                      <ResultRow key={entry.href} entry={entry} index={i} />
                    ))}
                  </ul>
                </div>
              )}

              <WaysOut assistant={assistant} />
            </div>
          )}

          {/* ── Results ─────────────────────────────────────────────────────── */}
          {hasQuery && !noResults && (
            <div className="mt-10 grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
              {/* Facets. Links, not buttons — the filter belongs in the URL, so a
                  filtered result set can be shared and the back button undoes it.
                  [DBIM 9.iv] */}
              <nav aria-label="Filter results by category" className="lg:pt-1">
                <h2 className="mb-3 text-label-3 uppercase text-ink-muted">
                  Filter
                </h2>
                <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
                  <li>
                    <Link
                      href={urlFor(query, null, 1)}
                      aria-current={type === null ? "true" : undefined}
                      className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-label-1 transition ${
                        type === null
                          ? "bg-primary text-white"
                          : "text-ink-muted hover:bg-surface-muted hover:text-ink"
                      }`}
                    >
                      <span>All</span>
                      <span className="text-body-3 tabular-nums opacity-80">{outcome.totalAllTypes}</span>
                    </Link>
                  </li>
                  {outcome.facets.map((facet) => (
                    <li key={facet.type}>
                      <Link
                        href={urlFor(query, facet.type, 1)}
                        aria-current={type === facet.type ? "true" : undefined}
                        aria-disabled={facet.count === 0 ? "true" : undefined}
                        className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-label-1 transition ${
                          type === facet.type
                            ? "bg-primary text-white"
                            : facet.count === 0
                              ? "text-ink-muted/50"
                              : "text-ink-muted hover:bg-surface-muted hover:text-ink"
                        }`}
                      >
                        <span>{facet.label}</span>
                        <span className="text-body-3 tabular-nums opacity-80">{facet.count}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="min-w-0">
                {/* The count and the query, echoed back — so the reader can see
                    what was actually searched for, typo and all. */}
                <p
                  className="mb-1 text-body-1 text-ink"
                  role="status"
                  aria-live="polite"
                >
                  <strong>{outcome.total.toLocaleString("en-IN")}</strong>{" "}
                  {outcome.total === 1 ? "result" : "results"} for{" "}
                  <strong className="text-primary">{query}</strong>
                  {type && <> in {facetLabel(type)}</>}
                </p>
                {outcome.totalPages > 1 && (
                  <p className="mb-4 text-body-2 text-ink-muted">
                    Page {outcome.page} of {outcome.totalPages}
                  </p>
                )}

                {outcome.total === 0 ? (
                  <div className="rounded-xl border border-gray-200 bg-surface-muted p-6">
                    <p className="text-body-1 text-ink">
                      No {type ? facetLabel(type).toLowerCase() : "results"} match{" "}
                      <strong>{query}</strong>, but other categories do.
                    </p>
                    <Link
                      href={urlFor(query, null, 1)}
                      className="mt-3 inline-block font-semibold text-primary underline"
                    >
                      Show all {outcome.totalAllTypes} results
                    </Link>
                  </div>
                ) : (
                  <>
                    <ul id={RESULTS_LIST_ID} className="border-t border-gray-200">
                      {outcome.results.map((entry, i) => (
                        <ResultRow
                          key={`${entry.href}-${i}`}
                          entry={entry}
                          index={(outcome.page - 1) * RESULTS_PER_PAGE + i}
                        />
                      ))}
                    </ul>
                    <ResultClickTracker query={query} listId={RESULTS_LIST_ID} />

                    <div className="mt-8">
                      <Pagination
                        page={outcome.page}
                        totalPages={outcome.totalPages}
                        hrefFor={(n) => urlFor(query, type, n)}
                        label={`Search results, page ${outcome.page} of ${outcome.totalPages}`}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
