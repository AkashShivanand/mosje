import * as React from "react";
import { Pagination } from "../navigation/pagination";
import { cn } from "../../utils/cn";
import "./data-table.css";

export interface DataTableColumn<T> {
  /** Property key on the row (also the export/search key). */
  key: string;
  /** Column header text. */
  header: string;
  /**
   * Render this instead of `header` in the `<th>` — a select-all checkbox, an
   * icon, a unit note under the label.
   *
   * `header` stays a required STRING even when this is set, and is not
   * redundant: the sort live-region announces "sorted by {header}, ascending",
   * and a node interpolated into that template stringifies to `[object Object]`
   * for the one user who cannot see the column at all. So the node is the
   * picture and `header` is the name.
   */
  headerNode?: React.ReactNode;
  /** Custom cell renderer; falls back to `String(row[key])`. */
  render?: (row: T) => React.ReactNode;
  /** Extra class on the cell (e.g. an alignment utility from the host app). */
  className?: string;
  /** Value used when exporting/copying (for columns whose display comes from `render`). */
  exportValue?: (row: T) => string;
  /** Exclude this column from copy/export (e.g. action buttons). */
  noExport?: boolean;
  /**
   * Which edge the column reads from. `"end"` for a column of FIGURES — a count,
   * an amount, a percentage — so the digits line up on their last place and the
   * column can be scanned down. The table already sets `tabular-nums`; alignment
   * is the other half of that, and without it a column of populations reads as a
   * ragged list of words. Leave unset for text.
   *
   * @default "start"
   */
  align?: "start" | "center" | "end";
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
  /**
   * Hide the whole footer — page sizes, range and pager — while every row already fits on the
   * smallest page size. @default true
   *
   * A register of one row drew "Showing 10 50 100 of 1 items" and a pager with nowhere to go
   * (e-Anudaan audit X-04: Funding History, Bank Account Changes, Location Changes, Queries).
   * The footer answers "how do I see the rest?", and when there is no rest it is noise. It
   * returns the moment the set outgrows the smallest page, so a reader who narrows a filter
   * down to three rows and widens it again gets the pager back.
   *
   * Pass `false` where the footer carries a count the page states nowhere else and must always
   * show — but prefer stating the count above the table, where `WorklistScreen` already does.
   */
  hidePagerWhenFits?: boolean;
  /**
   * Accessible name for the scroll region, used only when the table is wider than its box.
   * @default `caption`, else "Table"
   */
  scrollLabel?: string;
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


/**
 * MoSJE / SAMAVESH DataTable — the shared paginated table.
 *
 * One definition for every portal (NMBA, SCW, SMILE, PM-AJAY previously each
 * forked their own). Styled to the Figma table treatment: plain white header
 * row (sentence-case, not shouty uppercase), brandwash row-hover, and an
 * outlined current-page chip. Token-driven `.ds-table*` CSS — no Tailwind.
 */
/** The class for a column's alignment. `start` is the default and needs none. */
function alignClass(align: DataTableColumn<never>["align"]): string | undefined {
  return align === "end" ? "ds-table__cell--end" : align === "center" ? "ds-table__cell--center" : undefined;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  total,
  pageSizes = [10, 50, 100],
  showPageSizes = true,
  hidePagerWhenFits = true,
  scrollLabel,
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

  /*
   * A SCROLL BOX THE KEYBOARD CAN REACH — only while it scrolls.
   *
   * axe `scrollable-region-focusable` (e-Anudaan audit R-08, 15 review tables at 375px): a table
   * wider than its box can only be scrolled sideways with a pointer. The box takes a tab stop,
   * a `region` role and a name so a keyboard reader can land on it and use the arrow keys — but
   * ONLY while it overflows. A tab stop on every table that fits would add a pointless stop per
   * register on every desktop page. Measured on resize, because a rail collapsing or a phone
   * rotating changes the answer without the rows changing.
   */
  /*
   * AND THE PINNED COLUMN ONLY PINS WHEN IT CAN BE SCROLLED OUT FROM UNDER.
   *
   * A column pinned with `position: sticky; right: 0` paints over the columns to its left until
   * the reader scrolls it back into its own place. That is the point of a pinned column — and it
   * only works when there is ENOUGH overflow to scroll it back: if the table is 40px wider than
   * its box and the Actions column is 120px, the last 80px of the column before it can never be
   * uncovered. That is what hid the Status badge on the applicant's My Applications ("Action
   * Requir…", audit N-06), and two later batches worked around it by dropping columns.
   *
   * So the pin is measured, not assumed: it holds only while the horizontal overflow is at least
   * the pinned column's own width. Below that the column returns to the flow and the row simply
   * scrolls as one — nothing is hidden, and the shadow that promises "there is more under here"
   * goes with it. Re-measured on resize, because a collapsing rail changes the answer.
   */
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [overflows, setOverflows] = React.useState(false);
  const [pinned, setPinned] = React.useState(false);
  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const measure = () => {
      const over = el.scrollWidth - el.clientWidth;
      setOverflows(over > 1);
      const cell = el.querySelector<HTMLElement>(".is-sticky-right");
      // A zero-width cell is a table that is not drawn as a table at all — below the tablet
      // anchor `WorklistScreen` renders cards — and `over >= 0` would have called that pinned.
      const pinWidth = cell?.offsetWidth ?? 0;
      setPinned(pinWidth > 0 && over >= pinWidth);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    return () => ro.disconnect();
  }, [data, columns]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const smallestPage = pageSizes.length > 0 ? Math.min(...pageSizes) : pageSize;
  const showFooter = !(hidePagerWhenFits && total <= smallestPage);
  const itemWord = total === 1 ? "item" : "items";
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
    <div className={cn("ds-table", className)} data-pin={pinned ? "on" : undefined}>
      <div className="ds-table__live" role="status" aria-live="polite">
        {announcement}
      </div>
      <div
        ref={scrollRef}
        className="ds-table__scroll"
        {...(overflows
          ? { tabIndex: 0, role: "region", "aria-label": scrollLabel ?? caption ?? "Table" }
          : {})}
      >
        <table className="ds-table__table">
          {caption && <caption className="ds-table__caption">{caption}</caption>}
          <thead className="ds-table__head">
            <tr>
              {columns.map((col) => {
                if (!col.sortable) {
                  return (
                    <th
                      key={col.key}
                      scope="col"
                      className={cn("ds-table__th", alignClass(col.align), col.className)}
                    >
                      {col.headerNode ?? col.header}
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
                    className={cn("ds-table__th", "ds-table__th--sortable", alignClass(col.align), col.className)}
                  >
                    {/*
                      A BUTTON, not a click handler on the `<th>`. A cell with an
                      onClick is unreachable by keyboard and has no role, which is
                      how a sortable table ends up sortable only by mouse.
                    */}
                    {/* raw-button-ok(primitive): the sortable column header — the button IS the <th>'s content, and the cell above it carries aria-sort */}
                    <button
                      type="button"
                      className="ds-table__sort"
                      onClick={() => setSort(col.key)}
                    >
                      {col.headerNode ?? col.header}
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
                      <td key={col.key} className={cn("ds-table__td", alignClass(col.align), col.className)}>
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

      {showFooter ? (
      <div className="ds-table__footer">
        <div className="ds-table__pagesize">
          {showPageSizes ? (
            <>
          <span>Showing</span>
          {pageSizes.map((size) => (
            /* raw-button-ok(primitive): a page-size choice in the footer's aria-pressed set — a toggle group, not a standalone action */
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
          <span>of {total.toLocaleString("en-IN")} {itemWord}</span>
            </>
          ) : (
            <span>
              Showing {total === 0 ? 0 : (safePage - 1) * pageSize + 1}–
              {Math.min(safePage * pageSize, total)} of {total.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {/* THE COMPONENT, NOT A SECOND COPY OF IT.
            This was the "system disagrees with itself" half of the audit's F-4:
            a second numbered pager inside the design system, with its own window
            algorithm and its own idea of what a disabled end looks like. It is
            `Pagination` now.

            `sm` is the right size and not merely the closest one — its own
            docstring is "a pager INSIDE a card or a rail, a panel that paginates
            its own contents rather than the page", which is exactly a table
            footer, and it draws the chevron-only steps this pager already had.
            `siblings={1}` reproduces the window it used to compute by hand. */}
        <Pagination
          page={safePage}
          totalPages={totalPages}
          onPageChange={setPage}
          siblings={1}
          size="sm"
          label="Table pagination"
        />
      </div>
      ) : null}
    </div>
  );
}
