"use client";

import * as React from "react";
import { Button, Icon, Search } from "@mosje/design-system";

export interface StateRegisterRow {
  /** The State or Union Territory, as displayed. */
  state: string;
  href: string;
}

interface StateRegisterProps {
  rows: StateRegisterRow[];
  caption: string;
  /** What each linked file is, for the link's accessible name: "the List of Scheduled Castes". */
  documentName: string;
}

const fileType = (href: string) => {
  const ext = href.split("?")[0]!.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return "PDF";
  if (ext === "jpg" || ext === "jpeg" || ext === "png") return "Image";
  return undefined;
};

/**
 * A State-wise register as an accessible, searchable table (issue CON-11).
 *
 * A real `<table>` with a caption and column headers, the State as the row
 * header, inside a labelled scroll region; on a phone the three columns stack
 * (MOB-03). The search filters by State as the reader types, the count is
 * announced in a `role="status"` element (ACC-21), and a search that matches no
 * State says so and offers to clear it — worded differently from an empty
 * register (LAY-03). Thirty-three rows fit one page, so it is not paged.
 */
export function StateRegister({ rows, caption, documentName }: StateRegisterProps) {
  const [query, setQuery] = React.useState("");
  const id = React.useId();
  const q = query.trim().toLowerCase();
  const shown = q ? rows.filter((r) => r.state.toLowerCase().includes(q)) : rows;

  return (
    <div className="wn-register">
      <div className="wn-register__search wn-filters__field">
        <label htmlFor={`${id}-q`} className="wn-filters__label">
          Search by State or Union Territory
        </label>
        <Search id={`${id}-q`} size="md" value={query} onChange={(e) => setQuery(e.target.value)} onClear={() => setQuery("")} placeholder="For example, Bihar" />
      </div>

      <p className="wn-count" role="status">
        {q
          ? shown.length === 0
            ? `No State or Union Territory matches “${query.trim()}”.`
            : `${shown.length} of ${rows.length} States and Union Territories match “${query.trim()}”.`
          : `${rows.length} States and Union Territories`}
      </p>

      {shown.length === 0 ? (
        <div className="wn-register__none">
          <p>No State or Union Territory named “{query.trim()}” is in this list. Check the spelling, or clear the search to see all {rows.length}.</p>
          <Button variant="primary" appearance="outlined" size="md" onClick={() => setQuery("")}>
            Clear Search
          </Button>
        </div>
      ) : (
        <div className="wn-table-region" role="region" aria-label={caption} tabIndex={0}>
          <table className="wn-table wn-table--stack">
            <caption>{caption}</caption>
            <thead>
              <tr>
                <th scope="col" className="num">
                  S. No.
                </th>
                <th scope="col">State / Union Territory</th>
                <th scope="col">Document</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((r) => {
                const type = fileType(r.href);
                return (
                  <tr key={r.state}>
                    <td className="num">{rows.indexOf(r) + 1}</td>
                    <th scope="row">{r.state}</th>
                    <td>
                      <a
                        href={r.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View Document${type ? ` (${type})` : ""}: ${documentName} for ${r.state}, opens in a new window`}
                      >
                        <span className="wn-table__linktext">View Document</span>
                        {type && <span className="wn-table__type">({type})</span>}
                        <Icon name="open_in_new" size={16} aria-hidden />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
