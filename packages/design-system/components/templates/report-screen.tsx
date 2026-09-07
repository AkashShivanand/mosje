"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { PageHeader } from "../layout/page-header";
import { Breadcrumb } from "../navigation/breadcrumb";
import { ScreenBody } from "./screen-body";
import {
  DEFAULT_SCREEN_COPY,
  resolveScreenState,
  type ScreenStateCopy,
  type ScreenStateInput,
} from "./screen-state";
import "./screen-templates.css";

/** One column of the statement. */
export interface ReportColumn<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  /**
   * Right-aligns the column and sets `font-variant-numeric: tabular-nums`, so
   * figures line up digit under digit down a printed column. A currency column
   * that is not marked numeric is unreadable on paper.
   */
  numeric?: boolean;
}

/** A filter that was in force when the statement was produced. */
export interface ReportCriterion {
  label: string;
  value: string;
}

export interface ReportScreenProps<T extends object> extends ScreenStateInput {
  breadcrumb?: { label: string; href?: string }[];
  eyebrow?: React.ReactNode;
  title: string;
  meta?: React.ReactNode;
  /** @default 1 */
  headingLevel?: 1 | 2;

  /** The department or organisation the statement is issued by. Printed. */
  issuer?: string;
  /**
   * When the figures were drawn, as a citizen would read it.
   *
   * Printed at the head of every copy. A statement filed without one cannot
   * later be told apart from a statement drawn a quarter later, which is the
   * whole difficulty with printed departmental figures.
   */
  generatedAt?: string;
  /**
   * The filters in force.
   *
   * **Printed, always.** A report of "1,284 applications" filed without the
   * criteria that produced it is a number nobody can reproduce or defend, and
   * the on-screen filter controls do not survive the printer.
   */
  criteria?: ReportCriterion[];

  /** Export controls — CSV, XLSX, print. Not printed. */
  exportActions?: React.ReactNode;
  /** The filter controls. Not printed. */
  filters?: React.ReactNode;
  activeFilterCount?: number;
  onClearFilters?: () => void;

  columns: ReportColumn<T>[];
  /**
   * **Every row of the statement**, not one page of it.
   *
   * A report is printed and filed; a printed page 1 of 9 is not a report. This
   * template therefore does not paginate — that is the deliberate difference
   * from `WorklistScreen`, which always pages. Where the set is too large to
   * hold, narrow it with criteria rather than paging it.
   */
  rows: T[];
  getRowId: (row: T) => string;
  /** A totals row. Printed with the table, and marked as a footer row. */
  totals?: (columnKey: string) => React.ReactNode;

  /** Notes under the table — a source, a statutory caveat. Printed. */
  footnotes?: React.ReactNode;

  onRetry?: () => void;
  copy?: ScreenStateCopy;
  className?: string;
}

/**
 * ReportScreen — a tabular statement meant to be printed or exported.
 *
 * The distinguishing question against `OverviewScreen` is whether the thing is
 * read **on screen** or **printed and filed**
 * (`docs/design-system/screen-templates.md` §2a). A dashboard is glanced at
 * daily; a utilisation statement is taken to a meeting.
 *
 * **Four things the printer needs, that no screen does:**
 *
 * 1. **A masthead on the page**, not in the browser chrome — issuer, title,
 *    when it was drawn. The chrome prints as a URL and a date in 8pt.
 * 2. **The criteria in force**, because the select boxes that produced this set
 *    do not survive the printer and a figure without its filters cannot be
 *    reproduced.
 * 3. **A repeated header row.** `thead` repeats on every printed page by
 *    default — which is precisely why this template renders a real table
 *    instead of a virtualised or internally-paged one.
 * 4. **No pagination.** Page 1 of 9 is not a statement.
 *
 * It is the one template that deliberately does not page, and the one whose
 * layout is decided by a medium the browser only previews.
 */
export function ReportScreen<T extends object>({
  breadcrumb,
  eyebrow,
  title,
  meta,
  headingLevel = 1,
  issuer,
  generatedAt,
  criteria,
  exportActions,
  filters,
  activeFilterCount = 0,
  onClearFilters,
  columns,
  rows,
  getRowId,
  totals,
  footnotes,
  onRetry,
  copy = DEFAULT_SCREEN_COPY,
  className,
  ...state
}: ReportScreenProps<T>): React.JSX.Element {
  const status = resolveScreenState({
    ...state,
    count: rows.length,
    filtered: activeFilterCount > 0,
  });

  return (
    <div className={cn("sa-screen", "sa-report", className)}>
      {breadcrumb && breadcrumb.length > 0 ? <Breadcrumb items={breadcrumb} /> : null}

      <PageHeader
        as={headingLevel}
        eyebrow={eyebrow}
        title={title}
        meta={meta}
        actions={exportActions}
      />

      {filters ? <div className="sa-report__filters">{filters}</div> : null}

      {/* The printed masthead. Hidden on screen — where the page header above
          already says all of it — and the only identification the paper copy
          carries. */}
      <div className="sa-report__print-head" aria-hidden="true">
        {issuer ? <p className="sa-report__issuer">{issuer}</p> : null}
        <p className="sa-report__print-title">{title}</p>
        {generatedAt ? <p className="sa-report__generated">Generated {generatedAt}</p> : null}
      </div>

      {criteria && criteria.length > 0 ? (
        <dl className="sa-report__criteria">
          {criteria.map((criterion) => (
            <div key={criterion.label} className="sa-report__criterion">
              <dt>{criterion.label}</dt>
              <dd>{criterion.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      <ScreenBody
        status={status}
        copy={copy}
        skeleton="table"
        onRetry={onRetry}
        onClearFilters={onClearFilters}
      >
        <div className="sa-report__table-wrap">
          <table className="sa-report__table">
            <caption className="sa-report__caption">
              {title}
              {generatedAt ? ` — generated ${generatedAt}` : null}
            </caption>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    data-numeric={column.numeric ? "" : undefined}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={getRowId(row)}>
                  {columns.map((column) => (
                    <td key={column.key} data-numeric={column.numeric ? "" : undefined}>
                      {column.render
                        ? column.render(row)
                        : String((row as Record<string, unknown>)[column.key] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            {totals ? (
              <tfoot>
                <tr>
                  {columns.map((column) => (
                    <td key={column.key} data-numeric={column.numeric ? "" : undefined}>
                      {totals(column.key)}
                    </td>
                  ))}
                </tr>
              </tfoot>
            ) : null}
          </table>
        </div>
      </ScreenBody>

      {footnotes ? <div className="sa-report__footnotes">{footnotes}</div> : null}
    </div>
  );
}
