"use client";
/*
 * The NGO enforcement register — every organisation the Department has blacklisted,
 * stopped grants to or sought recovery from, with the Department's own wording of the
 * action. Searchable by name or action and paged at ten, as every DBIM list is; drawn
 * as the reference's bordered, striped rich-text table (`.db-min-rich table`).
 */
import * as React from "react";
import { DbimFilterBar } from "@/components/website-dbim/ui/FilterBar";
import { DbimEmptyState } from "@/components/website-dbim/ui/EmptyState";
import { useListing } from "@/components/website-dbim/ui/useListing";
import { NoMatch, Pager } from "@/components/website-dbim/documents/ListStates";
import type { DbimEnforcementRow } from "@/lib/website-dbim/division-registers";
import "@/components/website-dbim/documents/documents.css";
import "@/components/website-dbim/ministry/ministry.css";

const searchText = (r: DbimEnforcementRow) => `${r.name} ${r.action}`;

export function EnforcementTable({ rows, label }: { rows: DbimEnforcementRow[]; label: string }) {
  const listing = useListing(rows, { searchText });
  const top = React.useRef<HTMLDivElement>(null);
  const first = (listing.page - 1) * listing.perPage;

  return (
    <div ref={top} className="db-doc db-doc--files">
      <DbimFilterBar
        search={{ value: listing.query, onChange: listing.setQuery, placeholder: "Search...", label: `Search ${label}` }}
      />
      {listing.unfilteredTotal === 0 ? (
        <DbimEmptyState />
      ) : listing.total === 0 ? (
        <NoMatch listing={listing} noun="organisations" />
      ) : (
        <div className="db-min-rich">
          <div className="db-min-tablewrap" role="region" tabIndex={0} aria-label={label}>
            <table>
              <caption className="sr-only">{label}</caption>
              <thead>
                <tr>
                  <th scope="col">S.No.</th>
                  <th scope="col">Name of the Organisation</th>
                  <th scope="col">Action Taken</th>
                </tr>
              </thead>
              <tbody>
                {listing.visible.map((r, i) => (
                  <tr key={r.key}>
                    <td>{first + i + 1}</td>
                    <td>{r.name}</td>
                    <td>{r.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <Pager listing={listing} target={top} />
    </div>
  );
}
