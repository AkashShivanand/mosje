"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { PageHeader } from "../layout/page-header";
import { FilterBar } from "../dashboard/filter-bar";
import { DataTable, type DataTableColumn } from "../data-display/data-table";
import { BulkActionsBar, type BulkAction } from "../data-display/bulk-actions-bar";
import { Checkbox } from "../forms/checkbox";
import { Pagination } from "../navigation/pagination";
import { ScreenBody } from "./screen-body";
import {
  DEFAULT_SCREEN_COPY,
  resolveScreenState,
  type ScreenStateCopy,
  type ScreenStateInput,
} from "./screen-state";
import "./screen-templates.css";

/**
 * A stable empty array, so an unselected screen does not hand `useMemo` a new
 * `[]` on every render and quietly defeat it.
 */
const NO_SELECTION: string[] = [];

/**
 * How many cards a phone shows at once.
 *
 * The same as `DataTable`'s first page size, on purpose: the card list is the
 * SAME rows at a narrower width, and two page sizes for one set would mean the
 * pager said different things depending on the device.
 */
const CARD_PAGE_SIZE = 10;

/** Read a field off a domain object that has no index signature. */
function field(row: object, key: string): unknown {
  return (row as Record<string, unknown>)[key] ?? "";
}

/**
 * A column, plus how important it is when there is no room for a table.
 *
 * `priority` is what makes a twelve-column table survive a phone. The handoff
 * draws **no mobile version of any application screen** — 9 of its 9 mobile
 * frames are auth — so this is the estate's answer rather than a transcription
 * of one.
 */
export interface WorklistColumn<T> extends DataTableColumn<T> {
  /**
   * 1 — the row's name. Becomes the card's title on a narrow viewport.
   * 2 — worth reading on a phone. Becomes a label/value pair on the card.
   * 3 — reference detail. Dropped from the card entirely.
   *
   * @default 2
   */
  priority?: 1 | 2 | 3;
}

/**
 * `T extends object`, not `Record<string, unknown>`.
 *
 * A portal's domain model is a precise interface — `GrantApplication`,
 * `ActivityRow` — and none of them carries an index signature. Constraining to
 * `Record<string, unknown>` pushes a cast to every call site, which is exactly
 * what `worklist-table.tsx` was already apologising for in a comment. The cast
 * belongs once, here, at the boundary with `DataTable`.
 */
export interface WorklistScreenProps<T extends object> extends ScreenStateInput {
  /** Kicker over the title — the scheme, the module this list sits in. */
  eyebrow?: React.ReactNode;
  /** The page's `<h1>`. Title Case. */
  title: string;
  /** The line under it — a count, a last-updated stamp. */
  meta?: React.ReactNode;
  /** Primary and secondary actions for the page, not for a row. */
  actions?: React.ReactNode;

  /**
   * Heading level for the page title. Leave at 1: a portal screen has exactly
   * one `<h1>` and this is it.
   *
   * Drop to 2 when the template is rendered INSIDE a page that already has one
   * — a documentation specimen, or a screen body embedded in another screen.
   * Same contract as `PortalLoginTemplate.headingLevel`, and the reason it
   * exists: measuring a documentation page found two `<h1>`s, because the
   * specimen is a live template rather than a picture of one.
   * @default 1
   */
  headingLevel?: 1 | 2;

  /** Filter controls. Drop DS form controls straight in. */
  filters?: React.ReactNode;
  /** How many filters the reader has set. Drives the `filtered` empty state. */
  activeFilterCount?: number;
  /** Clears them. Offered from the filtered-to-nothing state. */
  onClearFilters?: () => void;

  columns: WorklistColumn<T>[];
  /**
   * **Every row that matches the current filters**, not one page of them.
   *
   * `DataTable` pages client-side, so it must hold the whole matching set. A
   * server-paged list therefore does not belong here — give it every match, or
   * page on the server and drive `DataTable` yourself.
   */
  rows: T[];
  /**
   * How large the register is **before** the reader's filters — used for the
   * count line only, never for the pager.
   *
   * The pager always counts `rows`. Handing `DataTable` a bigger number than the
   * array it holds is the "one request, one answer" defect in miniature: a total
   * of 68 against 5 rows drew a pager offering seven pages, six of them empty,
   * while the table showed five records. Found by rendering it.
   */
  registerTotal?: number;
  /** Stable id per row, for selection. */
  getRowId: (row: T) => string;

  /** Row-level actions. Rendered in the last column and on the card. */
  rowActions?: (row: T) => React.ReactNode;

  /** Currently selected row ids. Omit to switch selection off entirely. */
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  /** What can be done to a selection. Empty or omitted hides the bar. */
  bulkActions?: BulkAction[];
  onBulkAction?: (id: string) => void;
  /** What one row is called, for the selection bar. @default "record" */
  noun?: string;
  pluralNoun?: string;

  /** Retry, offered from the error state. */
  onRetry?: () => void;
  /** Offered from the empty state — "Add the first record". */
  emptyAction?: React.ReactNode;
  /** Words for every state. Override the two your register words differently. */
  copy?: ScreenStateCopy;
  className?: string;
}

/**
 * WorklistScreen — many records the reader acts on.
 *
 * The single highest-value template in the set, because it is the largest gap
 * between what is drawn and what is built: **43 portal pages use `DataTable` and
 * the handoff draws no list screen at all.** `Pagination`, `Breadcrumb` and
 * `Search` return zero hits across all 5,138 nodes of the E-Anudaan page, and
 * `Pagination` appears in exactly **1 of the estate's 265 portal pages**.
 *
 * Reach for it when the reader **does something to** the rows. If they only read
 * them, that is `CatalogueScreen`; if the set was composed by a query rather
 * than by filters, that is `SearchScreen`.
 *
 * It owns, so a caller never writes them: all seven states, the count line, the
 * card form for narrow viewports, the selection bar's appearance and
 * disappearance, and paging — which `DataTable` does internally, so "too much"
 * cannot be forgotten.
 */
export function WorklistScreen<T extends object>({
  eyebrow,
  title,
  meta,
  actions,
  filters,
  activeFilterCount = 0,
  onClearFilters,
  columns,
  rows,
  registerTotal,
  getRowId,
  rowActions,
  selectedIds,
  onSelectionChange,
  bulkActions,
  onBulkAction,
  noun = "record",
  pluralNoun,
  onRetry,
  emptyAction,
  headingLevel = 1,
  copy = DEFAULT_SCREEN_COPY,
  className,
  ...state
}: WorklistScreenProps<T>): React.JSX.Element {
  /* ONE resolution, read by the count line and the body alike. Two separate
     tests here is the defect `data-state-completeness.md` §2 records: a key
     printed `villages 0` above a map drawing 19,768 of them, because the two
     halves answered the same request differently. */
  const status = resolveScreenState({
    ...state,
    count: rows.length,
    filtered: activeFilterCount > 0,
  });

  /* Two different numbers, and keeping them apart is the point. `shown` is what
     the pager counts and always equals the array. `registerTotal` is how big the
     register is before filtering, and it appears only in the sentence that says
     so. */
  const shown = rows.length;
  const matched = registerTotal ?? shown;
  const selection = selectedIds ?? NO_SELECTION;

  /* Unconditional, against the real arrays. The render branches below; the
     hooks never do. */
  const cardColumns = React.useMemo(
    () => columns.filter((c) => (c.priority ?? 2) <= 2),
    [columns],
  );
  const titleColumn = React.useMemo(
    () => columns.find((c) => c.priority === 1) ?? columns[0],
    [columns],
  );

  /* The card list pages itself. `DataTable` pages internally and does not
     publish which rows are on its page, so the two cannot share a pager — and
     without one the phone rendered all 126 rows as cards while the table beside
     it showed 10. `data-state-completeness.md` §4 calls that the "too much"
     state, and it is the half that gets skipped because nobody scrolls a phone
     in review. */
  const [cardPage, setCardPage] = React.useState(1);
  const cardPages = Math.max(1, Math.ceil(rows.length / CARD_PAGE_SIZE));
  const safeCardPage = Math.min(cardPage, cardPages);
  const cardRows = React.useMemo(
    () => rows.slice((safeCardPage - 1) * CARD_PAGE_SIZE, safeCardPage * CARD_PAGE_SIZE),
    [rows, safeCardPage],
  );

  /* A filter that shortens the set must not strand the reader on page 7 of 2.
     Done in render rather than an effect, so the empty page is never painted. */
  const [prevCount, setPrevCount] = React.useState(rows.length);
  if (prevCount !== rows.length) {
    setPrevCount(rows.length);
    setCardPage(1);
  }

  const selectable = onSelectionChange != null;
  const showBulkBar = selectable && selection.length > 0 && (bulkActions?.length ?? 0) > 0;

  /* Selection lives HERE rather than in DataTable, which is a table and should
     stay one. It was also missing entirely until a portal tried to use it: the
     template exposed `selectedIds`, `onSelectionChange` and `bulkActions` and
     offered no way to select a row, so the bar could never appear and
     `BulkActionsBar` had zero consumers estate-wide. An API you cannot reach is
     not an API. */
  const selected = React.useMemo(() => new Set(selection), [selection]);

  /* Selection spans the WHOLE matching set, not the visible page — `rows` is
     every match and `DataTable` pages it internally, so the page's membership is
     not knowable from here. That is a deliberate position rather than a
     limitation to hide: the header box says "Select all 126 applications" and
     means it. It was briefly labelled "on this page" while doing exactly this,
     which is the kind of wrong that only shows up when someone counts. */
  const allSelected = rows.length > 0 && rows.every((r) => selected.has(getRowId(r)));
  const someSelected = !allSelected && rows.some((r) => selected.has(getRowId(r)));
  const plural = pluralNoun ?? `${noun}s`;

  const toggleRow = (id: string): void => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onSelectionChange?.([...next]);
  };

  const toggleAll = (): void => {
    onSelectionChange?.(allSelected ? [] : rows.map(getRowId));
  };

  /* Prepended, not appended: a checkbox after the data is a checkbox nobody
     finds, and the reading order should start with the thing being chosen. */
  const selectColumn: WorklistColumn<T> = {
    key: "sa-select",
    header: "Select",
    noExport: true,
    priority: 1,
    headerNode: (
      <Checkbox
        checked={allSelected}
        indeterminate={someSelected}
        onChange={toggleAll}
        label={
          allSelected
            ? "Clear selection"
            : `Select all ${shown.toLocaleString("en-IN")} ${plural}`
        }
        hideLabel
      />
    ),
    render: (row: T) => {
      const id = getRowId(row);
      return (
        <Checkbox
          checked={selected.has(id)}
          onChange={() => toggleRow(id)}
          label={`Select ${id}`}
          hideLabel
        />
      );
    },
  };

  return (
    <div className={cn("sa-screen", className)}>
      <PageHeader as={headingLevel} eyebrow={eyebrow} title={title} meta={meta} actions={actions} />

      {filters ? (
        <FilterBar>
          <div className="sa-worklist__toolbar">{filters}</div>
        </FilterBar>
      ) : null}

      {/* The count answers the question a filter creates. It is shown only when
          there is something to count — at empty or error it would restate a
          message the body is already giving in full. */}
      {status === "ready" ? (
        <p className="sa-screen__count">
          {/* Three sentences, and which one is true is decided by the numbers
              rather than by the filter flag alone. A set that is smaller than
              the register is worth saying so even when the reader did not
              narrow it — that is the case a server-paged or sampled list is in,
              and saying only "20 in the register" there would be false. */}
          {shown === matched
            ? `${shown.toLocaleString("en-IN")} in the register.`
            : activeFilterCount > 0
              ? `Showing ${shown.toLocaleString("en-IN")} of ${matched.toLocaleString("en-IN")}, filtered.`
              : `Showing ${shown.toLocaleString("en-IN")} of ${matched.toLocaleString("en-IN")}.`}
        </p>
      ) : null}

      {showBulkBar ? (
        <BulkActionsBar
          count={selection.length}
          noun={noun}
          pluralNoun={pluralNoun}
          /* No `total`/`onSelectAll`: the header checkbox already selects the
             whole matching set, and a bar offering the same act beside it read
             as two different scopes when there is only one. */
          actions={bulkActions ?? []}
          onAction={(id) => onBulkAction?.(id)}
          onClear={() => onSelectionChange?.([])}
        />
      ) : null}

      <ScreenBody
        status={status}
        copy={copy}
        skeleton="table"
        onRetry={onRetry}
        onClearFilters={onClearFilters}
        emptyAction={emptyAction}
      >
        <div className="sa-worklist">
          <div className="sa-worklist__table">
            {/* The one cast, at the boundary. DataTable is generic over
                `Record<string, unknown>`; the domain models that reach this
                template are precise interfaces without an index signature, and
                widening them here is better than widening every one of them. */}
            <DataTable
              columns={([
                ...(selectable ? [selectColumn] : []),
                ...columns,
                ...(rowActions
                  ? [
                      {
                        key: "sa-row-actions",
                        header: "Actions",
                        noExport: true,
                        render: (row: T) => rowActions(row),
                      } as WorklistColumn<T>,
                    ]
                  : []),
              ] as unknown) as DataTableColumn<Record<string, unknown>>[]}
              data={rows as unknown as Record<string, unknown>[]}
              total={shown}
              caption={title}
            />
          </div>

          {/* The same rows, as cards. Not a second data source — the same array,
              read through `priority`, so the two cannot disagree. */}
          <ul className="sa-worklist__cards">
            {cardRows.map((row) => {
              const id = getRowId(row);
              return (
                <li key={id} className="sa-worklist__card">
                  <div className="sa-worklist__card-head">
                    {selectable ? (
                      <Checkbox
                        checked={selected.has(id)}
                        onChange={() => toggleRow(id)}
                        label={`Select ${id}`}
                        hideLabel
                      />
                    ) : null}
                    <span className="sa-worklist__card-title">
                      {titleColumn?.render
                        ? titleColumn.render(row)
                        : String(field(row, titleColumn?.key ?? ""))}
                    </span>
                  </div>
                  <div className="sa-worklist__card-pairs">
                    {cardColumns
                      .filter((c) => c.key !== titleColumn?.key)
                      .map((c) => (
                        <React.Fragment key={c.key}>
                          <span className="sa-worklist__card-label">{c.header}</span>
                          <span className="sa-worklist__card-value">
                            {c.render ? c.render(row) : String(field(row, c.key))}
                          </span>
                        </React.Fragment>
                      ))}
                  </div>
                  {rowActions ? (
                    <div className="sa-worklist__card-actions">{rowActions(row)}</div>
                  ) : null}
                </li>
              );
            })}
          </ul>

          {cardPages > 1 ? (
            <div className="sa-worklist__cards-pager">
              <Pagination
                page={safeCardPage}
                totalPages={cardPages}
                onPageChange={setCardPage}
                size="sm"
                label={`${plural} pages`}
              />
            </div>
          ) : null}
        </div>
      </ScreenBody>
    </div>
  );
}
