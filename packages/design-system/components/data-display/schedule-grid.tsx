import * as React from "react";
import { cn } from "../../utils/cn";
import "./schedule-grid.css";

export interface ScheduleEntry {
  id: string;
  /** Which column — must match a `columns` id. */
  columnId: string;
  /** Which row — must match a `rows` id. */
  rowId: string;
  /** What is happening. */
  title: string;
  /** One line under the title — a room, a warden, an attendance count. */
  detail?: string;
  /** @default "neutral" */
  tone?: "neutral" | "info" | "success" | "warning" | "danger";
  /** Where the entry leads. Omit and the entry is a record, not a control. */
  href?: string;
}

export interface ScheduleAxis {
  id: string;
  label: string;
  /** A second line in the header — a date under a day name. */
  sublabel?: string;
}

export interface ScheduleGridProps {
  /** The columns, left to right — usually days. */
  columns: ScheduleAxis[];
  /** The rows, top to bottom — usually time slots. */
  rows: ScheduleAxis[];
  entries: ScheduleEntry[];
  /** The table's caption. Required, and visible — a schedule with no title is a grid of words. */
  caption: string;
  /** @default "Nothing is scheduled for this period." */
  emptyText?: string;
  className?: string;
}

/**
 * A timetable — Garima Greh's daily programme, an attendance week, a district's
 * camp calendar.
 *
 * **It is a real `<table>`, and that is the whole design.** A schedule is
 * two-dimensional data: every entry means something only in relation to its day
 * and its time. Built from divs, a screen reader reads a stream of session
 * titles with no way to say which day or which hour any of them is in. As a
 * table with row and column headers, the same entry is announced as "Monday,
 * 10:00 to 11:00, Literacy class".
 *
 * Three more rules:
 *
 * 1. **The caption is visible and required.** "Daily programme" and "Attendance,
 *    week of 1 September" are different tables that look identical.
 * 2. **An empty cell is empty.** No dash, no "—", nothing to read: there is
 *    genuinely nothing scheduled, and a screen reader announcing a dash forty
 *    times is noise. An empty SCHEDULE, on the other hand, says so.
 * 3. **It scrolls horizontally in its own container, never inside a card.** Seven
 *    columns do not fit a phone. The scroll is on a labelled region with
 *    `tabindex=0` so a keyboard user can reach it, which is what makes a
 *    horizontally scrolling table operable at all.
 */
export function ScheduleGrid({
  columns,
  rows,
  entries,
  caption,
  emptyText = "Nothing is scheduled for this period.",
  className,
}: ScheduleGridProps): React.JSX.Element {
  const byCell = React.useMemo(() => {
    const map = new Map<string, ScheduleEntry[]>();
    for (const entry of entries) {
      const key = `${entry.rowId}::${entry.columnId}`;
      const list = map.get(key);
      if (list) list.push(entry);
      else map.set(key, [entry]);
    }
    return map;
  }, [entries]);

  if (entries.length === 0) {
    return (
      <div className={cn("ds-schedule", className)}>
        <p className="ds-schedule__caption">{caption}</p>
        <p className="ds-schedule__empty">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className={cn("ds-schedule", className)}>
      {/* A scrollable region needs a tab stop, or a keyboard user cannot reach
          the columns that are off-screen. That is the documented technique for a
          wide table, which is why this is not the violation the rule below is
          usually catching. */}
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
      <div className="ds-schedule__scroll" role="region" aria-label={caption} tabIndex={0}>
        <table className="ds-schedule__table">
          <caption className="ds-schedule__caption">{caption}</caption>
          <thead>
            <tr>
              <th scope="col" className="ds-schedule__corner">
                <span className="ds-schedule__sr">Time</span>
              </th>
              {columns.map((column) => (
                <th key={column.id} scope="col" className="ds-schedule__colhead">
                  <span className="ds-schedule__day">{column.label}</span>
                  {column.sublabel ? <span className="ds-schedule__date">{column.sublabel}</span> : null}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <th scope="row" className="ds-schedule__rowhead">
                  <span className="ds-schedule__slot">{row.label}</span>
                  {row.sublabel ? <span className="ds-schedule__date">{row.sublabel}</span> : null}
                </th>
                {columns.map((column) => {
                  const cell = byCell.get(`${row.id}::${column.id}`) ?? [];
                  return (
                    <td key={column.id} className="ds-schedule__cell">
                      {cell.map((entry) => {
                        const body = (
                          <>
                            <span className="ds-schedule__title">{entry.title}</span>
                            {entry.detail ? <span className="ds-schedule__detail">{entry.detail}</span> : null}
                          </>
                        );
                        return entry.href ? (
                          <a
                            key={entry.id}
                            href={entry.href}
                            className={cn("ds-schedule__entry", `is-${entry.tone ?? "neutral"}`, "is-link")}
                          >
                            {body}
                          </a>
                        ) : (
                          <div
                            key={entry.id}
                            className={cn("ds-schedule__entry", `is-${entry.tone ?? "neutral"}`)}
                          >
                            {body}
                          </div>
                        );
                      })}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
