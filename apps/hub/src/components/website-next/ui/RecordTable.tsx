"use client";

import { useCallback, useId, useMemo, useRef, useSyncExternalStore } from "react";
import NextLink from "next/link";
import { Button, EmptyState, Icon, Pagination, Search, Select } from "@mosje/design-system";
import { formatDate, isoDate } from "@/components/website-next/ui/format";
import { dateValue, fileMeta, isBlank, isExternal, tidyTitle } from "@/components/website-next/ui/records";

/**
 * THE ONE RECORD TABLE OF THE REDESIGN.
 *
 * Every register on the site — documents, tenders, vacancies, notices, CPIOs,
 * grant orders — is drawn by this component, so a reader learns one table
 * (issues NAV-14, LAY-08). It closes, by construction:
 *
 * - ACC-16: a real <table> with a <caption>, scope="col" headers.
 * - Sortable columns are real <button>s in the header, with aria-sort on the
 *   sorted column only.
 * - ACC-21 / LAY-03: the result count is a role="status" element; "filtered to
 *   nothing" names the search and the filters and offers Clear Filters, and is
 *   worded differently from "nothing published".
 * - NAV-15: a filter is derived from the rows and hidden when it has one option.
 * - CON-07: a column empty for every row is dropped; one empty cell reads "–".
 * - CON-16 / X-FR-02: dates print one way, newest first by default.
 * - ACC-27 / CON-21: one action, "View Document", with the file type and size
 *   and the record's title in its accessible name.
 * - MOB-03: the table sits in a labelled, focusable scroll region; short tables
 *   stack into rows on a phone instead.
 * - NAV-13: long lists are paged, with the page in the URL (`?page=2`).
 *
 * States: populated, empty, filtered-to-nothing and too-much (paged) are drawn
 * here. Loading and error cannot occur — every row is resolved on the server at
 * render time, so there is no request to wait on or to fail.
 *
 * Columns and rows are plain data so a SERVER page can describe them; there is
 * no render function.
 */

export type RecordColumnType = "text" | "link" | "record" | "date" | "number";

export interface RecordColumn {
  key: string;
  label: string;
  sortable?: boolean;
  /** Numbers right, everything else left. "center" is accepted and read as left. */
  align?: "left" | "right" | "center";
  /**
   * `record` — the row's title, linking to its page on this site (the whole row
   * becomes one link). `link` — the row's file: "View Document". `date`,
   * `number` and `text` as named. Inferred for keys named date/sno.
   */
  type?: RecordColumnType;
  /** For record/link: the row key holding the href. @default "href" */
  hrefKey?: string;
  /** For link: the visible label. Generic labels ("View", "Download") read "View Document". */
  linkLabel?: string;
  /** For record: a row key whose value is drawn as a type chip above the title. */
  chipKey?: string;
  /** For link: row keys holding the file type and size. @default "fileType" / "fileSize" */
  fileTypeKey?: string;
  fileSizeKey?: string;
  /** Accepted for compatibility with the classic column lists; unused. */
  className?: string;
}

export interface RecordFilter {
  /** Row key the filter reads. */
  key: string;
  /** Visible label, e.g. "Organisation". */
  label: string;
  /** The "everything" option, e.g. "All Organisations". */
  allLabel: string;
  /** Option order. Years read newest first. @default "asc" */
  order?: "asc" | "desc";
}

export interface RecordTableProps {
  /** Names the table (its <caption>) and the scroll region. */
  caption: string;
  columns: RecordColumn[];
  rows: Record<string, unknown>[];
  /** Row keys the search reads. @default every text and title column */
  searchKeys?: string[];
  searchPlaceholder?: string;
  filters?: RecordFilter[];
  pageSize?: number;
  /** What one row is called, in running text. @default "records" */
  noun?: string;
  nounSingular?: string;
  defaultSort?: { key: string; dir: "asc" | "desc" } | null;
  /** Sentence shown when the Department has published nothing under this heading. */
  emptyMessage?: string;
  /** Prefix for the URL parameters, so two tables can share a page. */
  paramPrefix?: string;
  /** "stack": rows stack on a phone. "auto": stack when the table is narrow, else scroll. */
  layout?: "stack" | "auto";
  /** Show the caption as a visible heading-sized line. @default false (visually hidden) */
  showCaption?: boolean;
}

/* ── URL state ──────────────────────────────────────────────────────────── */

const URL_EVENT = "wn-records-url";

function subscribe(cb: () => void) {
  window.addEventListener("popstate", cb);
  window.addEventListener(URL_EVENT, cb);
  return () => {
    window.removeEventListener("popstate", cb);
    window.removeEventListener(URL_EVENT, cb);
  };
}
const getSearch = () => window.location.search;
/* The server renders page 1 with no filters, so the whole first page is in the HTML. */
const getServerSearch = () => "";

function writeUrl(updates: Record<string, string | undefined>, push: boolean) {
  const url = new URL(window.location.href);
  for (const [k, v] of Object.entries(updates)) {
    if (v === undefined || v === "") url.searchParams.delete(k);
    else url.searchParams.set(k, v);
  }
  const next = `${url.pathname}${url.search}${url.hash}`;
  if (push) window.history.pushState(null, "", next);
  else window.history.replaceState(null, "", next);
  window.dispatchEvent(new Event(URL_EVENT));
}

/* ── Column helpers ─────────────────────────────────────────────────────── */

function typeOf(c: RecordColumn): RecordColumnType {
  if (c.type) return c.type;
  if (c.key === "sno" || c.align === "right") return "number";
  if (c.key === "date" || /\bdate\b|published/i.test(c.label)) return "date";
  return "text";
}

const GENERIC_ACTION = /^(view|open|download|view\s*\/\s*download|view online|details)$/i;

const titleCase = (s: string) => s.replace(/\b\p{L}/gu, (c) => c.toUpperCase());

const str = (v: unknown) => (isBlank(v) ? "" : String(v));

function cellText(c: RecordColumn, row: Record<string, unknown>): string {
  const v = row[c.key];
  const t = typeOf(c);
  if (t === "record") return tidyTitle(str(v));
  return str(v);
}

function compare(t: RecordColumnType, a: unknown, b: unknown): number {
  if (t === "date") return dateValue(a) - dateValue(b);
  if (t === "number") return (Number.parseFloat(str(a)) || 0) - (Number.parseFloat(str(b)) || 0);
  return str(a).localeCompare(str(b), "en-IN", { numeric: true, sensitivity: "base" });
}

const fmt = (n: number) => n.toLocaleString("en-IN");

/* ── Component ──────────────────────────────────────────────────────────── */

export function RecordTable({
  caption,
  columns,
  rows,
  searchKeys,
  searchPlaceholder,
  filters = [],
  pageSize = 10,
  noun = "records",
  nounSingular,
  defaultSort,
  emptyMessage,
  paramPrefix = "",
  layout = "auto",
  showCaption = false,
}: RecordTableProps) {
  const uid = useId();
  const resultsRef = useRef<HTMLDivElement>(null);
  const search = useSyncExternalStore(subscribe, getSearch, getServerSearch);
  const P = (k: string) => `${paramPrefix}${k}`;
  const params = useMemo(() => new URLSearchParams(search), [search]);

  const singular = nounSingular ?? noun.replace(/s$/, "");
  const Noun = titleCase(noun);

  /* A column exists only where some row fills it — measured on ALL rows, so
     columns never move while a reader types (CON-07). */
  const visible = useMemo(() => {
    /* A size column beside a "View Document" that already states the size says
       it twice; the action carries it (DOC-02). */
    const carried = new Set(
      columns.filter((c) => typeOf(c) === "link").flatMap((c) => [c.fileSizeKey ?? "fileSize", c.fileTypeKey ?? "fileType"]),
    );
    return columns.filter((c) => {
        if (typeOf(c) !== "link" && carried.has(c.key)) return false;
        /* A serial number stops meaning anything the moment a reader sorts or
           searches; the row order already carries it. */
        if (c.key === "sno") return false;
        const t = typeOf(c);
        const key = t === "link" ? (c.hrefKey ?? "href") : c.key;
        return rows.some((r) => !isBlank(r[key]) && !(t === "link" && r[key] === "#"));
      });
  }, [columns, rows]);

  const titleCol = visible.find((c) => typeOf(c) === "record") ?? visible.find((c) => c.key === "title" || c.key === "name" || c.key === "label");

  /* Filters: options derived from the rows; one option is no choice (NAV-15). */
  const activeFilters = useMemo(
    () =>
      filters
        .map((f) => {
          const set = new Set<string>();
          for (const r of rows) if (!isBlank(r[f.key])) set.add(String(r[f.key]));
          const options = [...set].sort((a, b) => a.localeCompare(b, "en-IN", { numeric: true }));
          if (f.order === "desc") options.reverse();
          return { ...f, options };
        })
        .filter((f) => f.options.length > 1),
    [filters, rows],
  );

  const q = params.get(P("q")) ?? "";
  const chosen: Record<string, string> = {};
  for (const f of activeFilters) {
    const v = params.get(P(f.key)) ?? "";
    if (v && f.options.includes(v)) chosen[f.key] = v;
  }

  const sortable = visible.filter((c) => c.sortable);
  const firstDate = visible.find((c) => typeOf(c) === "date");
  const fallbackSort =
    defaultSort === null ? null : (defaultSort ?? (firstDate ? { key: firstDate.key, dir: "desc" as const } : null));
  const urlSortKey = params.get(P("sort"));
  const sortCol = sortable.find((c) => c.key === urlSortKey) ?? visible.find((c) => c.key === fallbackSort?.key);
  const sortDir: "asc" | "desc" =
    urlSortKey && sortCol?.key === urlSortKey
      ? params.get(P("dir")) === "desc"
        ? "desc"
        : "asc"
      : (fallbackSort?.dir ?? "asc");

  const keys = useMemo(
    () =>
      searchKeys ??
      visible.filter((c) => ["text", "record"].includes(typeOf(c))).map((c) => c.key),
    [searchKeys, visible],
  );

  const filterKey = JSON.stringify(chosen);
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase().replace(/\s+/g, " ");
    const picks = JSON.parse(filterKey) as Record<string, string>;
    return rows.filter((r) => {
      for (const [k, v] of Object.entries(picks)) if (String(r[k] ?? "") !== v) return false;
      if (needle && !keys.some((k) => String(r[k] ?? "").toLowerCase().replace(/\s+/g, " ").includes(needle))) return false;
      return true;
    });
  }, [rows, q, filterKey, keys]);

  const sorted = useMemo(() => {
    if (!sortCol) return filtered;
    const t = typeOf(sortCol);
    const blanks = filtered.filter((r) => isBlank(r[sortCol.key]));
    const full = filtered.filter((r) => !isBlank(r[sortCol.key]));
    full.sort((a, b) => compare(t, a[sortCol.key], b[sortCol.key]) * (sortDir === "desc" ? -1 : 1));
    return [...full, ...blanks]; /* an unknown value never leads either order */
  }, [filtered, sortCol, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const requested = Number.parseInt(params.get(P("page")) ?? "1", 10);
  const page = Number.isFinite(requested) ? Math.min(Math.max(1, requested), totalPages) : 1;
  const pageRows = sorted.slice((page - 1) * pageSize, page * pageSize);
  const start = sorted.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, sorted.length);

  const filterActive = q.trim() !== "" || Object.keys(chosen).length > 0;

  const setParam = useCallback(
    (updates: Record<string, string | undefined>) => writeUrl({ ...updates, [P("page")]: undefined }, false),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [paramPrefix],
  );

  const clearAll = () => {
    const u: Record<string, string | undefined> = { [P("q")]: undefined, [P("page")]: undefined };
    for (const f of activeFilters) u[P(f.key)] = undefined;
    writeUrl(u, false);
  };

  const toggleSort = (c: RecordColumn) => {
    const isCurrent = sortCol?.key === c.key;
    const dir = isCurrent ? (sortDir === "asc" ? "desc" : "asc") : typeOf(c) === "date" ? "desc" : "asc";
    setParam({ [P("sort")]: c.key, [P("dir")]: dir });
  };

  const changePage = (n: number) => {
    writeUrl({ [P("page")]: n > 1 ? String(n) : undefined }, true);
    const el = resultsRef.current;
    if (el) {
      el.focus({ preventScroll: true });
      el.scrollIntoView({ block: "start" });
    }
  };

  const stack =
    /* On a phone a labelled stack reads better than a sideways scroll until a
       row has more fields than a stack can carry. */
    layout === "stack" || visible.filter((c) => typeOf(c) !== "number").length <= 6;

  /* ── The sentence the status element speaks ── */
  const range = totalPages > 1 ? `Showing ${fmt(start)}–${fmt(end)} of ` : "";
  const status = !filterActive
    ? `${range}${fmt(rows.length)} ${rows.length === 1 ? singular : noun}`
    : sorted.length === 0
      ? `No ${noun} match`
      : `${range}${fmt(sorted.length)} matching ${sorted.length === 1 ? singular : noun}, out of ${fmt(rows.length)}`;

  const describeFilters = () => {
    const parts: string[] = [];
    if (q.trim()) parts.push(`“${q.trim()}”`);
    for (const f of activeFilters) if (chosen[f.key]) parts.push(`${f.label}: ${chosen[f.key]}`);
    return parts.join(", ");
  };

  if (rows.length === 0) {
    return (
      <EmptyState
        className="wn-rt__empty"
        icon={<Icon name="folder_off" size={40} />}
        title={`No ${Noun} Published Yet`}
        description={emptyMessage ?? `The Department has not published any ${noun} under this heading.`}
      />
    );
  }

  return (
    <div className="wn-rt">
      <div className="wn-rt__controls" role="search" aria-label={`Search ${noun}`}>
        <div className="wn-rt__field wn-rt__field--search">
          <label className="wn-rt__label" htmlFor={`${uid}-q`}>
            Search {Noun}
          </label>
          <Search
            id={`${uid}-q`}
            aria-label={`Search ${Noun}`}
            value={q}
            size="md"
            onChange={(e) => setParam({ [P("q")]: e.target.value })}
            onClear={() => setParam({ [P("q")]: undefined })}
            placeholder={searchPlaceholder ?? "Search by title"}
          />
        </div>
        {activeFilters.map((f) => (
          <div className="wn-rt__field" key={f.key}>
            <label className="wn-rt__label" htmlFor={`${uid}-${f.key}`}>
              {f.label}
            </label>
            <Select
              id={`${uid}-${f.key}`}
              value={chosen[f.key] ?? ""}
              onChange={(e) => setParam({ [P(f.key)]: e.target.value || undefined })}
              options={[{ label: f.allLabel, value: "" }, ...f.options.map((o) => ({ label: o, value: o }))]}
            />
          </div>
        ))}
      </div>

      <div className="wn-rt__bar">
        <p className="wn-rt__count" role="status">
          {status}
        </p>
        {filterActive && (
          <Button variant="neutral" appearance="text" size="sm" onClick={clearAll}>
            Clear Filters
          </Button>
        )}
      </div>

      <div ref={resultsRef} tabIndex={-1} className="wn-rt__results" aria-label={`${caption}, results`}>
        {sorted.length === 0 ? (
          <EmptyState
            className="wn-rt__empty"
            icon={<Icon name="search_off" size={40} />}
            title={`No ${Noun} Match These Filters`}
            description={`No ${noun} match ${describeFilters()}. There are ${fmt(rows.length)} ${noun} on this page in all.`}
            action={
              <Button variant="primary" appearance="outlined" size="md" onClick={clearAll}>
                Clear Filters
              </Button>
            }
          />
        ) : (
          <div
            className={`wn-rt__scroll${stack ? " wn-rt__scroll--stack" : ""}`}
            role="region"
            aria-label={`${caption} table`}
            tabIndex={0}
          >
            <table className="wn-rt__table">
              <caption className={showCaption ? "wn-rt__caption" : "sr-only"}>
                {caption}
                {totalPages > 1 && <span className="sr-only">, page {page} of {totalPages}</span>}
              </caption>
              <thead>
                <tr>
                  {visible.map((c) => {
                    const t = typeOf(c);
                    const isSorted = sortCol?.key === c.key;
                    const ariaSort = isSorted ? (sortDir === "asc" ? "ascending" : "descending") : undefined;
                    return (
                      <th
                        key={c.key}
                        scope="col"
                        aria-sort={ariaSort}
                        className={`wn-rt__th${t === "number" ? " wn-rt__num" : ""}${t === "link" ? " wn-rt__th--action" : ""}`}
                      >
                        {c.sortable ? (
                          <button type="button" className="wn-rt__sort" onClick={() => toggleSort(c)}>
                            {c.label}
                            <Icon
                              name={isSorted ? (sortDir === "asc" ? "arrow_upward" : "arrow_downward") : "unfold_more"}
                              size={16}
                              aria-hidden
                            />
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
                {pageRows.map((r, i) => (
                  <tr key={`${str(r[titleCol?.hrefKey ?? "href"])}-${(page - 1) * pageSize + i}`} className="wn-rt__row">
                    {visible.map((c) => (
                      <Cell key={c.key} column={c} row={r} titleCol={titleCol} />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="wn-rt__pager">
        <Pagination page={page} totalPages={totalPages} onPageChange={changePage} label={`${caption} pages`} />
      </div>
    </div>
  );
}

function Cell({
  column: c,
  row,
  titleCol,
}: {
  column: RecordColumn;
  row: Record<string, unknown>;
  titleCol?: RecordColumn;
}) {
  const t = typeOf(c);
  const label = t === "record" || t === "link" ? undefined : c.label;

  if (t === "record") {
    const href = str(row[c.hrefKey ?? "href"]);
    const text = cellText(c, row);
    const chip = c.chipKey ? str(row[c.chipKey]) : "";
    return (
      <td className="wn-rt__td wn-rt__td--title">
        {chip && <span className="wn-rt__chip">{chip}</span>}
        {href && href !== "#" ? (
          <NextLink href={href} className="wn-rt__title wn-rt__title--link">
            <span className="wn-rt__clamp">{text}</span>
          </NextLink>
        ) : (
          <span className="wn-rt__title">
            <span className="wn-rt__clamp">{text}</span>
          </span>
        )}
      </td>
    );
  }

  if (t === "link") {
    const href = str(row[c.hrefKey ?? "href"]);
    if (!href || href === "#") {
      return (
        <td className="wn-rt__td wn-rt__td--action">
          <span className="wn-rt__none" aria-hidden>
            –
          </span>
          <span className="sr-only">No file</span>
        </td>
      );
    }
    const name = titleCol ? cellText(titleCol, row) : "";
    const meta = fileMeta(href, str(row[c.fileTypeKey ?? "fileType"]), str(row[c.fileSizeKey ?? "fileSize"]));
    const text = c.linkLabel && !GENERIC_ACTION.test(c.linkLabel.trim()) ? c.linkLabel : "View Document";
    const ext = isExternal(href);
    return (
      <td className="wn-rt__td wn-rt__td--action">
        <a
          href={href}
          className="wn-rt__action"
          {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          <span className="wn-rt__action-label">
            {text}
            {name && <span className="sr-only">: {name}</span>}
          </span>
          {meta && <span className="wn-rt__action-meta"> ({meta})</span>}
          {ext && (
            <>
              <Icon name="open_in_new" size={16} aria-hidden />
              <span className="sr-only"> (opens in a new window)</span>
            </>
          )}
        </a>
      </td>
    );
  }

  const raw = row[c.key];
  if (isBlank(raw)) {
    return (
      <td className={`wn-rt__td${t === "number" ? " wn-rt__num" : ""}`} data-label={label}>
        <span className="wn-rt__none" aria-hidden>
          –
        </span>
        <span className="sr-only">Not published</span>
      </td>
    );
  }

  if (t === "date") {
    const iso = isoDate(String(raw));
    return (
      <td className="wn-rt__td wn-rt__td--date" data-label={label}>
        {iso ? <time dateTime={iso}>{formatDate(String(raw))}</time> : String(raw)}
      </td>
    );
  }

  return (
    <td className={`wn-rt__td${t === "number" ? " wn-rt__num" : ""}`} data-label={label}>
      {String(raw)}
    </td>
  );
}
