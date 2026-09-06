"use client";

import { useMemo, useState } from "react";
import { Icon, Link, Search } from "@mosje/design-system";

export interface ListingTableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  /** DBIM: left for text, right for numbers, center for column headers. */
  align?: "left" | "right" | "center";
  /** Declarative cell type (serializable — safe to pass from server components). */
  type?: "text" | "link";
  /** For type "link": the row key holding the href (default "href"). */
  hrefKey?: string;
  /** For type "link": the visible label (default "View / Download"). */
  linkLabel?: string;
  /** Client-only escape hatch. Do NOT pass from a server component. */
  render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
  className?: string;
}

function Cell({ col, row }: { col: ListingTableColumn; row: Record<string, unknown> }) {
  if (col.render) return <>{col.render(row[col.key], row)}</>;
  if (col.type === "link") {
    const href = String(row[col.hrefKey ?? "href"] ?? "#");
    return (
      <Link
        href={href}
        external
        variant="standalone"
        className="font-medium"
        iconLeft={<Icon name="download" size={16} />}
      >
        {col.linkLabel ?? "View / Download"}
      </Link>
    );
  }
  return <>{String(row[col.key] ?? "")}</>;
}

export interface ListingTableProps {
  caption: string;
  columns: ListingTableColumn[];
  rows: Record<string, unknown>[];
  searchKeys?: string[];
  searchPlaceholder?: string;
  pageSize?: number;
}

type SortDir = "asc" | "desc";

/** Accessible, searchable, sortable, paginated table (WCAG 2.1 AA + DBIM table conventions). */
/**
 * The website's listing table — searchable, sortable, paginated.
 *
 * It is NOT the design system's `DataTable`, and it cannot be until that
 * component gains a SERIALISABLE cell type. The website's listing pages are
 * server components: `data/website/columns.ts` is imported by a server page, so
 * a column cannot carry a `render` function, which is the design system's only
 * escape hatch. Hence `type: "link"` with `hrefKey` and `linkLabel` — a
 * declarative cell a server page can describe.
 *
 * Give the design system's table a declarative cell type and this becomes a
 * composition of `Search` and `DataTable` rather than a second implementation.
 */
export function ListingTable({
  caption,
  columns,
  rows,
  searchKeys,
  searchPlaceholder = "Search…",
  pageSize = 10,
}: ListingTableProps) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);

  const keys = searchKeys ?? columns.map((c) => c.key);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => keys.some((k) => String(r[k] ?? "").toLowerCase().includes(q)));
  }, [rows, query, keys]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const out = [...filtered].sort((a, b) => {
      const av = String(a[sortKey] ?? "");
      const bv = String(b[sortKey] ?? "");
      return av.localeCompare(bv, undefined, { numeric: true });
    });
    return sortDir === "desc" ? out.reverse() : out;
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const current = Math.min(page, totalPages);
  const pageRows = sorted.slice((current - 1) * pageSize, current * pageSize);

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  };

  const alignClass = (a?: string) => (a === "right" ? "text-right" : a === "center" ? "text-center" : "text-left");

  return (
    <div>
      {/* Search */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="w-full max-w-sm">
          <Search
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            onClear={() => { setQuery(""); setPage(1); }}
            size="sm"
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
          />
        </div>
        <p className="hidden whitespace-nowrap text-body-2 text-gray-500 sm:block">
          {sorted.length} {sorted.length === 1 ? "record" : "records"}
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full border-collapse text-body-2">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="bg-primary text-white">
              {columns.map((c) => {
                const isSorted = sortKey === c.key;
                return (
                  <th
                    key={c.key}
                    scope="col"
                    aria-sort={isSorted ? (sortDir === "asc" ? "ascending" : "descending") : undefined}
                    className="whitespace-nowrap px-4 py-3 text-center font-semibold"
                  >
                    {c.sortable ? (
                      <button
                        onClick={() => toggleSort(c.key)}
                        className="inline-flex items-center gap-1 hover:underline"
                      >
                        {c.label}
                        {isSorted ? (
                          sortDir === "asc" ? <Icon name="keyboard_arrow_up" size={14} /> : <Icon name="keyboard_arrow_down" size={14} />
                        ) : (
                          <Icon name="unfold_more" size={14} className="opacity-60" />
                        )}
                      </button>
                    ) : (
                      c.label
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-gray-500">
                  No records found.
                </td>
              </tr>
            ) : (
              pageRows.map((row, i) => (
                <tr key={i} className="border-t border-gray-200 odd:bg-white even:bg-surface-muted">
                  {columns.map((c) => (
                    <td key={c.key} className={`px-4 py-3 align-top ${alignClass(c.align)} ${c.className ?? ""}`}>
                      <Cell col={c} row={row} />
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="mt-4 flex items-center justify-center gap-2" aria-label="Pagination">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={current === 1}
            className="inline-flex h-9 items-center gap-1 rounded-lg border border-gray-300 px-3 text-label-1 disabled:opacity-40 enabled:hover:bg-surface-muted"
          >
            <Icon name="keyboard_arrow_left" size={16} /> Prev
          </button>
          <span className="px-2 text-body-2 text-ink-muted" aria-current="page">
            Page {current} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={current === totalPages}
            className="inline-flex h-9 items-center gap-1 rounded-lg border border-gray-300 px-3 text-label-1 disabled:opacity-40 enabled:hover:bg-surface-muted"
          >
            Next <Icon name="keyboard_arrow_right" size={16} />
          </button>
        </nav>
      )}
    </div>
  );
}
