"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { Search } from "../forms/search";
import { PageHeader } from "../layout/page-header";
import { Breadcrumb } from "../navigation/breadcrumb";
import { Pagination } from "../navigation/pagination";
import { ScreenBody } from "./screen-body";
import {
  DEFAULT_SCREEN_COPY,
  resolveScreenState,
  type ScreenStateCopy,
  type ScreenStateInput,
} from "./screen-state";
import "./screen-templates.css";

export interface SearchScreenProps extends ScreenStateInput {
  breadcrumb?: { label: string; href?: string }[];
  eyebrow?: React.ReactNode;
  title: string;
  meta?: React.ReactNode;
  /** @default 1 */
  headingLevel?: 1 | 2;

  /** What is in the field. Drive it from the URL so a result set can be shared. */
  query: string;
  onQueryChange: (query: string) => void;
  onSubmit?: () => void;
  /** @default "Search" — name what is being searched: "Search the village register". */
  searchLabel?: string;
  placeholder?: string;

  /** Facets down the side — checkbox groups, selects. */
  facets?: React.ReactNode;
  /** How many facets the reader has set. Distinguishes "no matches" from "nothing here". */
  activeFilterCount?: number;
  onClearFilters?: () => void;

  /**
   * The results for the current page, already ranked.
   *
   * This template does not sort. Ranking is the caller's claim — the thing that
   * distinguishes a search from a catalogue — and a template that reordered
   * results would be overruling it.
   */
  children?: React.ReactNode;
  /** How many results the query matched, across all pages. */
  resultCount?: number;
  /** How many are on this page. Drives the seven states. */
  shownCount: number;

  page?: number;
  totalPages?: number;
  hrefForPage?: (page: number) => string;
  onPageChange?: (page: number) => void;

  onRetry?: () => void;
  copy?: ScreenStateCopy;
  className?: string;
}

/**
 * SearchScreen — many records, ranked by a query the reader typed.
 *
 * **`idle` renders differently from `empty`, and that is the whole reason this
 * is its own template.** "Not asked yet" and "asked, nothing there" are
 * different sentences with different remedies, and rendering them the same way
 * is what makes a search field look broken before it has been used
 * (`data-state-completeness.md` §5.4). A caller passes `asked={query.length > 0}`
 * and `resolveScreenState` does the rest — a field the reader has not touched
 * shows the prompt, not "No records found".
 *
 * Against `WorklistScreen`: is the set defined by **filters over a known
 * register** or by a **query the reader composed**? Against `CatalogueScreen`:
 * is there a ranking? (`docs/design-system/screen-templates.md` §2a.)
 *
 * `Search` returns **zero hits across all 5,138 nodes** of the handoff's
 * E-Anudaan page, so every decision here is the estate's rather than a
 * transcription.
 */
export function SearchScreen({
  breadcrumb,
  eyebrow,
  title,
  meta,
  headingLevel = 1,
  query,
  onQueryChange,
  onSubmit,
  searchLabel = "Search",
  placeholder,
  facets,
  activeFilterCount = 0,
  onClearFilters,
  children,
  resultCount,
  shownCount,
  page = 1,
  totalPages = 1,
  hrefForPage,
  onPageChange,
  onRetry,
  copy = DEFAULT_SCREEN_COPY,
  className,
  ...state
}: SearchScreenProps): React.JSX.Element {
  /* `asked` defaults to true across the estate, and here it must not: an
     untouched field has asked nothing. The caller may still override it —
     a search that runs a default query on arrival passes `asked` itself. */
  const asked = state.asked ?? query.trim().length > 0;

  const status = resolveScreenState({
    ...state,
    asked,
    count: shownCount,
    filtered: activeFilterCount > 0,
  });

  const total = resultCount ?? shownCount;

  return (
    <div className={cn("sa-screen", className)}>
      {breadcrumb && breadcrumb.length > 0 ? <Breadcrumb items={breadcrumb} /> : null}

      <PageHeader as={headingLevel} eyebrow={eyebrow} title={title} meta={meta} />

      {/* A real form, so Enter submits and a phone keyboard shows "Search"
          rather than a newline key. */}
      <form
        className="sa-search__query"
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit?.();
        }}
      >
        <Search
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          aria-label={searchLabel}
          placeholder={placeholder}
          size="lg"
        />
      </form>

      <div className="sa-search">
        {facets ? (
          <aside className="sa-search__facets" aria-label="Narrow these results">
            {facets}
          </aside>
        ) : null}

        <div className="sa-search__results">
          {/* Announced, because on a client-side search the results change with
              no navigation and a screen-reader user is given no other signal
              that the page now says something different. */}
          {status === "ready" ? (
            <p className="sa-screen__count" aria-live="polite">
              {`${total.toLocaleString("en-IN")} ${total === 1 ? "result" : "results"} for “${query}”.`}
            </p>
          ) : null}

          <ScreenBody
            status={status}
            copy={copy}
            skeleton="table"
            onRetry={onRetry}
            onClearFilters={onClearFilters}
          >
            {children}
          </ScreenBody>

          {status === "ready" && totalPages > 1 ? (
            <div className="sa-search__pager">
              <Pagination
                page={page}
                totalPages={totalPages}
                hrefFor={hrefForPage}
                onPageChange={onPageChange}
                label="Result pages"
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
