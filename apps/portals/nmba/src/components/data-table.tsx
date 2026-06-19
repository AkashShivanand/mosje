"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ColumnDef<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  total: number;
  pageSizes?: number[];
  caption?: string;
  className?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  total,
  pageSizes = [10, 50, 100],
  caption,
  className,
}: DataTableProps<T>) {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(pageSizes[0]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const visibleData = data.slice(0, pageSize);

  const pageNumbers = React.useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 4) return [1, 2, 3, "…", totalPages];
    if (page >= totalPages - 3) return [1, "…", totalPages - 2, totalPages - 1, totalPages];
    return [1, "…", page - 1, page, page + 1, "…", totalPages];
  }, [page, totalPages]);

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="overflow-x-auto rounded-xl border border-line">
        <table className="min-w-full divide-y divide-line text-sm" aria-label={caption}>
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead className="bg-surface-muted">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={cn(
                    "whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-muted",
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line bg-white">
            {visibleData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-ink-hint">
                  No records found.
                </td>
              </tr>
            ) : (
              visibleData.map((row, i) => (
                <tr key={i} className="hover:bg-surface-muted/50 transition-colors">
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn("px-4 py-3 text-ink", col.className)}
                    >
                      {col.render
                        ? col.render(row)
                        : String(row[col.key] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-ink-muted">
          <span>Showing</span>
          {pageSizes.map((size) => (
            <button
              key={size}
              onClick={() => { setPageSize(size); setPage(1); }}
              className={cn(
                "rounded px-2 py-0.5 font-semibold transition-colors",
                pageSize === size
                  ? "bg-navy text-white"
                  : "hover:bg-black/5 text-ink-muted"
              )}
              aria-label={`Show ${size} items per page`}
              aria-pressed={pageSize === size}
            >
              {size}
            </button>
          ))}
          <span>of {total.toLocaleString("en-IN")} items</span>
        </div>

        <nav aria-label="Table pagination" className="flex items-center gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            aria-label="Previous page"
            className="rounded p-1 hover:bg-black/5 disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {pageNumbers.map((n, i) =>
            n === "…" ? (
              <span key={`ellipsis-${i}`} className="px-1 text-ink-hint">
                <MoreHorizontal className="h-4 w-4" />
              </span>
            ) : (
              <button
                key={n}
                onClick={() => setPage(Number(n))}
                aria-label={`Page ${n}`}
                aria-current={page === n ? "page" : undefined}
                className={cn(
                  "h-8 w-8 rounded text-sm font-semibold transition-colors",
                  page === n
                    ? "bg-navy text-white"
                    : "text-ink-muted hover:bg-black/5"
                )}
              >
                {n}
              </button>
            )
          )}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            aria-label="Next page"
            className="rounded p-1 hover:bg-black/5 disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </nav>
      </div>
    </div>
  );
}
