"use client";

import * as React from "react";
import { DbimPagination } from "@/components/website-dbim/ui/Pagination";
import type { DbimRegister } from "@/lib/website-dbim/offerings";

const PER_PAGE = 10;

/**
 * A register lifted out of an ingested scheme page (a directory of homes, of
 * distribution centres, of fund releases), paged ten rows at a time so the page
 * keeps its height instead of growing by thousands of pixels.
 */
export function DbimRegisterTable({ register, label }: { register: DbimRegister; label: string }) {
  const [page, setPage] = React.useState(1);
  const pageCount = Math.max(1, Math.ceil(register.rows.length / PER_PAGE));
  const rows = register.rows.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const first = (page - 1) * PER_PAGE + 1;
  return (
    <div className="db-sd__register">
      <div className="wn-table-wrap" role="region" aria-label={label} tabIndex={0}>
        <table>
          <caption className="sr-only">
            {label}, rows {first}–{first + rows.length - 1} of {register.rows.length}
          </caption>
          <thead>
            <tr>
              {register.columns.map((c) => (
                <th key={c} scope="col">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={first + i}>
                {r.map((cell, j) => (
                  <td key={j}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <DbimPagination page={page} pageCount={pageCount} onChange={setPage} label={`${label} pages`} />
    </div>
  );
}
