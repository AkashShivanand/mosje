"use client";
/*
 * A Documents tab: the reference's filter bar (search · Sort by · Category · per
 * page) over the tab's folders. Category is the series itself, as the reference's
 * Category options are its series names.
 */
import * as React from "react";
import { DbimFilterBar } from "@/components/website-dbim/ui/FilterBar";
import { DbimEmptyState } from "@/components/website-dbim/ui/EmptyState";
import { useListing } from "@/components/website-dbim/ui/useListing";
import { dateValue } from "@/components/website-next/ui/records";
import type { DbimSeries } from "@/lib/website-dbim/documents";
import { DocTableHead, FolderRow } from "./DocRows";
import { NoMatch, Pager } from "./ListStates";

export const LATEST_OLDEST = {
  latest: { label: "Latest", compare: (a: { date?: string }, b: { date?: string }) => dateValue(b.date) - dateValue(a.date) },
  oldest: { label: "Oldest", compare: (a: { date?: string }, b: { date?: string }) => dateValue(a.date) - dateValue(b.date) },
};

const searchText = (s: DbimSeries) => s.title;
const categoryOf = (s: DbimSeries) => s.title;

export function SeriesList({ series, label }: { series: DbimSeries[]; label: string }) {
  const listing = useListing(series, { searchText, category: categoryOf, sorts: LATEST_OLDEST });
  const top = React.useRef<HTMLDivElement>(null);

  return (
    <div ref={top} className="db-doc db-doc--files">
      <DbimFilterBar
        search={{ value: listing.query, onChange: listing.setQuery, placeholder: "Search...", label: `Search ${label}` }}
        sort={{ value: listing.sort, onChange: listing.setSort, options: listing.sortOptions, placeholder: "Sort by", label: "Sort by" }}
        category={{ value: listing.category, onChange: listing.setCategory, options: listing.categories, placeholder: "Category", label: "Filter by category" }}
        perPage={{ value: listing.perPage, onChange: listing.setPerPage, options: [10, 15, 20] }}
      />
      <div role="table" aria-label={`${label} data`}>
        <div role="rowgroup">
          <DocTableHead columns={["Title", "Published Year", "Type/Size"]} />
        </div>
        {listing.unfilteredTotal === 0 ? (
          <DbimEmptyState />
        ) : listing.total === 0 ? (
          <NoMatch listing={listing} noun="documents" />
        ) : (
          <div role="rowgroup">
            {listing.visible.map((s) => (
              <FolderRow key={s.slug} series={s} layout="files" dateLabel="Published Year" />
            ))}
          </div>
        )}
      </div>
      <Pager listing={listing} target={top} />
    </div>
  );
}
