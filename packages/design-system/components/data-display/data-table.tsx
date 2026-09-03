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
  /**
   * Make the column sortable. The header becomes a button and the `<th>` carries
   * `aria-sort`, which this table had on NO column — so a screen-reader user was
   * never told a register was ordered, or by what.
   */
  sortable?: boolean;
  /**
   * The value to sort by, when the cell's display comes from `render`. Without
   * it a rendered cell sorts by `String(row[key])`, which orders "₹1,20,000"
   * before "₹9,000" — the classic government-register defect.
   */
  sortValue?: (row: T) => string | number;
}

/** Which column a register is ordered by, and which way. */
export interface DataTableSort {
  key: string;
  direction: "asc" | "desc";
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  total: number;
  pageSizes?: number[];
  /**
   * Show the page-size buttons ("Showing 10 50 100 of N items"). Set false for the government
   * register pattern, which states the visible range instead ("Showing 1–10 of 71") and fixes
   * the page size at the first entry of `pageSizes`. @default true
   */
  showPageSizes?: boolean;
  /** Accessible table caption (sr-only). */
  caption?: string;
  /** Empty-state message. @default "No records found." */
  emptyLabel?: React.ReactNode;
  /**
   * Controlled sort. Omit to let the table hold its own — the uncontrolled form
   * is right for a register the reader is browsing; the controlled form is for a
   * page that sorts on the server or reflects the order in its URL.
   */
  sort?: DataTableSort | null;
  /** Fires with the next sort. Required to change a CONTROLLED sort. */
  onSortChange?: (sort: DataTableSort | null) => void;
  /** Initial sort for the uncontrolled form. */
  defaultSort?: DataTableSort | null;
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
  showPageSizes = true,
  caption,
  emptyLabel = "No records found.",
  sort: controlledSort,
  onSortChange,
  defaultSort = null,
  className,
}: DataTableProps<T>) {
  const [page, setPage] = React.useState(1);
  const [ownSort, setOwnSort] = React.useState<DataTableSort | null>(defaultSort);
  const sort = controlledSort !== undefined ? controlledSort : ownSort;
  const [pageSize, setPageSize] = React.useState<number>(pageSizes[0] ?? 10);

  /**
   * Page resets during render when the row count changes — a filter narrowing
   * the set must not leave the reader stranded on page 7 of 2. Done here rather
   * than in an effect because the effect rendered that empty page once before
   * correcting itself.
   */
  const [prevTotal, setPrevTotal] = React.useState(total);
  if (prevTotal !== total) {
    setPrevTotal(total);
    setPage(1);
  }

  const byKey = React.useMemo(
    () => new Map(columns.map((c) => [c.key, c])),
    [columns],
  );

  /*
   * SORT THE WHOLE SET, THEN PAGE IT. Sorting the visible page instead would
   * reorder ten rows inside a register of four thousand and read as correct.
   *
   * A CONTROLLED sort is the caller's business — they are sorting on the server
   * — so the rows arrive already ordered and are left alone.
   */
  const sorted = React.useMemo(() => {
    if (!sort || controlledSort !== undefined) return data;
    const col = byKey.get(sort.key);
    if (!col) return data;
    const value = (row: T): string | number => {
      if (col.sortValue) return col.sortValue(row);
      const raw = row[sort.key];
      return typeof raw === "number" ? raw : String(raw ?? "");
    };
    const dir = sort.direction === "asc" ? 1 : -1;
    return [...data].sort((a, b) => {
      const av = value(a);
      const bv = value(b);
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
      // `en-IN` with `numeric` so "Block 2" precedes "Block 10" — a register of
      // districts, blocks and scheme codes is full of embedded numbers.
      return String(av).localeCompare(String(bv), "en-IN", { numeric: true, sensitivity: "base" }) * dir;
    });
  }, [data, sort, byKey, controlledSort]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const visibleData = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

  const setSort = (key: string) => {
    const next: DataTableSort | null =
      sort?.key === key
        ? sort.direction === "asc"
          ? { key, direction: "desc" }
          : /* third press clears it — a reader must be able to get back to the
               order the department published, which is what "no sort" means. */
            null
        : { key, direction: "asc" };
    setPage(1);
    if (controlledSort === undefined) setOwnSort(next);
    onSortChange?.(next);
  };

  const pageNumbers = React.useMemo<Array<number | "…">>(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (safePage <= 4) return [1, 2, 3, "…", totalPages];
    if (safePage >= totalPages - 3) return [1, "…", totalPages - 2, totalPages - 1, totalPages];
    return [1, "…", safePage - 1, safePage, safePage + 1, "…", totalPages];
  }, [safePage, totalPages]);

  /*
   * PAGING AND SORTING ANNOUNCED NOTHING.
   *
   * Both replace every row in the table without moving focus, so a screen-reader
   * user pressed "Next" or a column header and heard silence — then had to go
   * hunting to find out whether anything had happened. A persistent live region,
   * mounted once and written into, is how a change to content the reader did not
   * navigate to gets reported. It must exist BEFORE the text changes, which is
   * why it is not conditionally rendered.
   */
  const sortedColumn = sort ? byKey.get(sort.key) : undefined;
  const announcement = [
    `Page ${safePage} of ${totalPages}`,
    sortedColumn
      ? `sorted by ${sortedColumn.header}, ${sort?.direction === "asc" ? "ascending" : "descending"}`
      : "not sorted",
  ].join(", ");

  return (
    <div className={cn("ds-table", className)}>
      <div className="ds-table__live" role="status" aria-live="polite">
        {announcement}
      </div>
      <div className="ds-table__scroll">
        <table className="ds-table__table">
          {caption && <caption className="ds-table__caption">{caption}</caption>}
          <thead className="ds-table__head">
            <tr>
              {columns.map((col) => {
                if (!col.sortable) {
                  return (
                    <th key={col.key} scope="col" className={cn("ds-table__th", col.className)}>
                      {col.header}
                    </th>
                  );
                }
                const active = sort?.key === col.key;
                return (
                  <th
                    key={col.key}
                    scope="col"
                    /*
                     * `aria-sort` goes on the CELL, not the button — it describes
                     * the column, and a screen reader reads it as it enters the
                     * column rather than only when focus lands on the control.
                     */
                    aria-sort={active ? (sort.direction === "asc" ? "ascending" : "descending") : "none"}
                    className={cn("ds-table__th", "ds-table__th--sortable", col.className)}
                  >
                    {/*
                      A BUTTON, not a click handler on the `<th>`. A cell with an
                      onClick is unreachable by keyboard and has no role, which is
                      how a sortable table ends up sortable only by mouse.
                    */}
                    <button
                      type="button"
                      className="ds-table__sort"
                      onClick={() => setSort(col.key)}
                    >
                      {col.header}
                      <span className="ds-table__sort-mark" aria-hidden="true">
                        {active ? (sort.direction === "asc" ? "↑" : "↓") : "↕"}
                      </span>
                    </button>
                  </th>
                );
              })}
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
          {showPageSizes ? (
            <>
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
            </>
          ) : (
            <span>
              Showing {total === 0 ? 0 : (safePage - 1) * pageSize + 1}–
              {Math.min(safePage * pageSize, total)} of {total.toLocaleString("en-IN")}
            </span>
          )}
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
