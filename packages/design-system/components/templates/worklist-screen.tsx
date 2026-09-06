"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { PageHeader } from "../layout/page-header";
import { FilterBar } from "../dashboard/filter-bar";
import { DataTable, type DataTableColumn } from "../data-display/data-table";
import { BulkActionsBar, type BulkAction } from "../data-display/bulk-actions-bar";
import { ScreenBody } from "./screen-body";
import {
  DEFAULT_SCREEN_COPY,
  resolveScreenState,
  type ScreenStateCopy,
  type ScreenStateInput,
} from "./screen-state";
import "./screen-templates.css";

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

export interface WorklistScreenProps<T extends Record<string, unknown>>
  extends ScreenStateInput {
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
export function WorklistScreen<T extends Record<string, unknown>>({
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
  const selection = selectedIds ?? [];

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

  const selectable = onSelectionChange != null;
  const showBulkBar = selectable && selection.length > 0 && (bulkActions?.length ?? 0) > 0;

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
          {activeFilterCount > 0
            ? `Showing ${shown.toLocaleString("en-IN")} of ${matched.toLocaleString("en-IN")} in the register.`
            : `${shown.toLocaleString("en-IN")} in the register.`}
        </p>
      ) : null}

      {showBulkBar ? (
        <BulkActionsBar
          count={selection.length}
          noun={noun}
          pluralNoun={pluralNoun}
          total={shown}
          onSelectAll={() => onSelectionChange?.(rows.map(getRowId))}
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
            <DataTable
              columns={
                rowActions
                  ? [
                      ...columns,
                      {
                        key: "sa-row-actions",
                        header: "Actions",
                        noExport: true,
                        render: (row: T) => rowActions(row),
                      } as WorklistColumn<T>,
                    ]
                  : columns
              }
              data={rows}
              total={shown}
              caption={title}
            />
          </div>

          {/* The same rows, as cards. Not a second data source — the same array,
              read through `priority`, so the two cannot disagree. */}
          <ul className="sa-worklist__cards">
            {rows.map((row) => {
              const id = getRowId(row);
              return (
                <li key={id} className="sa-worklist__card">
                  <div className="sa-worklist__card-head">
                    <span className="sa-worklist__card-title">
                      {titleColumn?.render
                        ? titleColumn.render(row)
                        : String(row[titleColumn?.key ?? ""] ?? "")}
                    </span>
                  </div>
                  <div className="sa-worklist__card-pairs">
                    {cardColumns
                      .filter((c) => c.key !== titleColumn?.key)
                      .map((c) => (
                        <React.Fragment key={c.key}>
                          <span className="sa-worklist__card-label">{c.header}</span>
                          <span className="sa-worklist__card-value">
                            {c.render ? c.render(row) : String(row[c.key] ?? "")}
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
        </div>
      </ScreenBody>
    </div>
  );
}
