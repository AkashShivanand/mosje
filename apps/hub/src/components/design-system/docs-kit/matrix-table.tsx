import * as React from "react";
// docs-kit.css is imported app-wide via globals.css.

export interface MatrixTableProps {
  /** Shown above the grid — say WHICH thing this matrix describes. */
  caption: string;
  /** Column headings. The first names the row axis. */
  columns: string[];
  /** Each row: the first cell is the row heading, the rest are values. */
  rows: string[][];
}

/**
 * MatrixTable — a behaviour-by-condition grid.
 *
 * Prose is the wrong shape for "what does this do at each width". A reader
 * comparing three breakpoints across six behaviours has to hold eighteen facts
 * in their head to answer one question, and a paragraph makes them re-read it
 * every time. A grid answers by intersection.
 *
 * The first cell of every row is a `<th scope="row">`, so a screen-reader user
 * moving across a row hears which condition they are in rather than a bare
 * "Yes" — the difference between a table that is navigable and one that is
 * merely rectangular.
 */
export function MatrixTable({ caption, columns, rows }: MatrixTableProps): React.JSX.Element {
  return (
    <div className="matrix-table__scroll">
      <table className="matrix-table">
        <caption className="matrix-table__caption">{caption}</caption>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c} scope="col">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]}>
              <th scope="row">{row[0]}</th>
              {row.slice(1).map((cell, i) => (
                <td key={`${row[0]}-${columns[i + 1] ?? i}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
