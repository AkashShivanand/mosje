import * as React from "react";
import { cn } from "../../utils/cn";
import "./data-table.css";

export interface DataTableColumn<T> {
  /** Property key on the row (also the export/search key). */
  key: string;
  /** Column header text. */
  header: string;
  /** Custom cell renderer; falls back to `String(row[key])`. */
  render?: (row: T) => React.ReactNode;
  /** Extra class on the cell (e.g. an alignment utility from the host app). */
  className?: string;
  /** Value used when exporting/copying (for columns whose display comes from `render`). */
  exportValue?: (row: T) => string;
  /** Exclude this column from copy/export (e.g. action buttons). */
  noExport?: boolean;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  total: number;
  pageSizes?: number[];
  /** Accessible table caption (sr-only). */
  caption?: string;
  /** Empty-state message. @default "No records found." */
  emptyLabel?: React.ReactNode;
  className?: string;
}

const IcChevronLeft = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const IcChevronRight = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const IcEllipsis = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true"><circle cx="5" cy="12" r="1.6" fill="currentColor" /><circle cx="12" cy="12" r="1.6" fill="currentColor" /><circle cx="19" cy="12" r="1.6" fill="currentColor" /></svg>
);

/**
 * MoSJE / SAMAVESH DataTable — the shared paginated table.
 *
 * One definition for every portal (NMBA, SCW, SMILE, PM-AJAY previously each
 * forked their own). Styled to the Figma table treatment: plain white header
 * row (sentence-case, not shouty uppercase), brandwash row-hover, and an
 * outlined current-page chip. Token-driven `.ds-table*` CSS — no Tailwind.
 */
export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  total,
  pageSizes = [10, 50, 100],
  caption,
  emptyLabel = "No records found.",
  className,
}: DataTableProps<T>) {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState<number>(pageSizes[0] ?? 10);

  React.useEffect(() => {
    setPage(1);
  }, [total]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const visibleData = data.slice((safePage - 1) * pageSize, safePage * pageSize);

  const pageNumbers = React.useMemo<Array<number | "…">>(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (safePage <= 4) return [1, 2, 3, "…", totalPages];
    if (safePage >= totalPages - 3) return [1, "…", totalPages - 2, totalPages - 1, totalPages];
    return [1, "…", safePage - 1, safePage, safePage + 1, "…", totalPages];
  }, [safePage, totalPages]);

  return (
    <div className={cn("ds-table", className)}>
      <div className="ds-table__scroll">
        <table className="ds-table__table">
          {caption && <caption className="ds-table__caption">{caption}</caption>}
          <thead className="ds-table__head">
            <tr>
              {columns.map((col) => (
                <th key={col.key} scope="col" className={cn("ds-table__th", col.className)}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="ds-table__empty">
                  {emptyLabel}
                </td>
              </tr>
            ) : (
              visibleData.map((row, i) => {
                const rowKey = String(
                  row.id ?? row.registrationNumber ?? row.sno ?? `row-${(safePage - 1) * pageSize + i}`,
                );
                return (
                  <tr key={rowKey} className="ds-table__row">
                    {columns.map((col) => (
                      <td key={col.key} className={cn("ds-table__td", col.className)}>
                        {col.render ? col.render(row) : String(row[col.key] ?? "")}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="ds-table__footer">
        <div className="ds-table__pagesize">
          <span>Showing</span>
          {pageSizes.map((size) => (
            <button
              key={size}
              type="button"
              className={cn("ds-table__pagesize-btn", pageSize === size && "is-active")}
              aria-label={`Show ${size} items per page`}
              aria-pressed={pageSize === size}
              onClick={() => {
                setPageSize(size);
                setPage(1);
              }}
            >
              {size}
            </button>
          ))}
          <span>of {total.toLocaleString("en-IN")} items</span>
        </div>

        <nav aria-label="Table pagination" className="ds-table__pager">
          <button
            type="button"
            className="ds-table__page-nav"
            aria-label="Previous page"
            disabled={safePage === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <IcChevronLeft />
          </button>
          {pageNumbers.map((n, i) =>
            n === "…" ? (
              <span key={`e-${i}`} className="ds-table__ellipsis">
                <IcEllipsis />
                <span className="ds-sr-only">more pages</span>
              </span>
            ) : (
              <button
                key={n}
                type="button"
                className={cn("ds-table__page", safePage === n && "is-current")}
                aria-label={`Page ${n}`}
                aria-current={safePage === n ? "page" : undefined}
                onClick={() => setPage(Number(n))}
              >
                {n}
              </button>
            ),
          )}
          <button
            type="button"
            className="ds-table__page-nav"
            aria-label="Next page"
            disabled={safePage === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            <IcChevronRight />
          </button>
        </nav>
      </div>
    </div>
  );
}
