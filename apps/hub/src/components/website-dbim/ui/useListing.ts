"use client";

import * as React from "react";

/**
 * Search, category, sort and page state for a DBIM list page — the reference's
 * filter bar over a grid or a table. The data arrives whole from the server
 * component (it is the Department's committed content, not a feed), so all of this
 * is client-side and nothing is fetched.
 *
 * `total` against `unfilteredTotal` is what lets a page tell "filtered to nothing"
 * (the reader's own search matched nothing — say so and name the search) from
 * "empty" (nothing published) — data-state-completeness.md §1.
 */
export interface ListingOptions<T> {
  /** Text a search matches against (lower-cased here). */
  searchText: (item: T) => string;
  /** The item's category, for the Category select — or several, where an item is filed under more than one. Omit for pages without one. */
  category?: (item: T) => string | readonly string[] | undefined;
  /** The Category select's order, where the source publishes one; otherwise alphabetical. */
  categoryOrder?: readonly string[];
  /** Named orders for the Sort by select; the first key is not applied until chosen. */
  sorts?: Record<string, { label: string; compare: (a: T, b: T) => number }>;
  /** Rows per page; the reference offers 10, 15 and 20. */
  perPage?: number;
  /**
   * A second select beside Category — who an item is for. `options` fixes its order
   * and wording; `initial` is the value a link arrived with (`?applicant=`).
   */
  audience?: { of: (item: T) => readonly string[]; options: { value: string; label: string }[]; initial?: string };
}

export interface Listing<T> {
  query: string;
  setQuery: (q: string) => void;
  category: string;
  setCategory: (c: string) => void;
  audience: string;
  setAudience: (a: string) => void;
  /** The audience select's options, in `ListingOptions.audience` order. */
  audiences: { value: string; label: string }[];
  /** Distinct categories present in the data, sorted, as select options. */
  categories: { value: string; label: string }[];
  sort: string;
  setSort: (s: string) => void;
  sortOptions: { value: string; label: string }[];
  perPage: number;
  setPerPage: (n: number) => void;
  page: number;
  setPage: (n: number) => void;
  pageCount: number;
  /** The rows on the current page. */
  visible: T[];
  /** Rows matching the current search and category. */
  total: number;
  /** Rows before any filter — 0 means nothing is published, not that the search missed. */
  unfilteredTotal: number;
  /** True while a search or category is narrowing the list. */
  filtered: boolean;
  clear: () => void;
}

export function useListing<T>(items: readonly T[], opts: ListingOptions<T>): Listing<T> {
  const [query, setQueryRaw] = React.useState("");
  const [category, setCategoryRaw] = React.useState("");
  const [audience, setAudienceRaw] = React.useState(opts.audience?.initial ?? "");
  const [sort, setSortRaw] = React.useState("");
  const [perPage, setPerPageRaw] = React.useState(opts.perPage ?? 10);
  const [page, setPage] = React.useState(1);

  const { searchText, category: categoryOf, categoryOrder, sorts } = opts;
  const audienceOf = opts.audience?.of;
  const categoriesOf = React.useCallback(
    (it: T): readonly string[] => {
      const c = categoryOf?.(it);
      return c == null ? [] : typeof c === "string" ? [c] : c;
    },
    [categoryOf],
  );

  const categories = React.useMemo(() => {
    if (!categoryOf) return [];
    const set = new Set<string>();
    for (const it of items) for (const c of categoriesOf(it)) if (c) set.add(c);
    const rank = (c: string) => {
      const i = categoryOrder?.indexOf(c) ?? -1;
      return i < 0 ? Number.MAX_SAFE_INTEGER : i;
    };
    return [...set].sort((a, b) => rank(a) - rank(b) || a.localeCompare(b)).map((c) => ({ value: c, label: c }));
  }, [items, categoryOf, categoriesOf, categoryOrder]);

  const matched = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    let rows = items.filter(
      (it) =>
        (!q || searchText(it).toLowerCase().includes(q)) &&
        (!category || categoriesOf(it).includes(category)) &&
        (!audience || !audienceOf || audienceOf(it).includes(audience)),
    );
    const order = sort && sorts?.[sort];
    if (order) rows = [...rows].sort(order.compare);
    return rows;
  }, [items, query, category, audience, audienceOf, sort, sorts, searchText, categoriesOf]);

  const pageCount = Math.max(1, Math.ceil(matched.length / perPage));
  const safePage = Math.min(page, pageCount);
  const visible = matched.slice((safePage - 1) * perPage, safePage * perPage);

  // Any change to what is being asked goes back to the first page.
  const reset = <V,>(set: (v: V) => void) => (v: V) => {
    set(v);
    setPage(1);
  };

  return {
    query,
    setQuery: reset(setQueryRaw),
    category,
    setCategory: reset(setCategoryRaw),
    categories,
    audience,
    setAudience: reset(setAudienceRaw),
    audiences: opts.audience?.options ?? [],
    sort,
    setSort: reset(setSortRaw),
    sortOptions: Object.entries(sorts ?? {}).map(([value, s]) => ({ value, label: s.label })),
    perPage,
    setPerPage: reset(setPerPageRaw),
    page: safePage,
    setPage,
    pageCount,
    visible,
    total: matched.length,
    unfilteredTotal: items.length,
    filtered: query.trim() !== "" || category !== "" || audience !== "",
    clear: () => {
      setQueryRaw("");
      setCategoryRaw("");
      setAudienceRaw("");
      setPage(1);
    },
  };
}
