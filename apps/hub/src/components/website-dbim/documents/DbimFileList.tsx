"use client";
/*
 * A list of files — a series page, or one Archives tab. The series page has search
 * and Sort by only and no header row (as the reference's); an archive adds Category
 * (its series) and per page, and the TITLE · PUBLISHED DATE · TYPE/SIZE header.
 */
import * as React from "react";
import { DbimFilterBar } from "@/components/website-dbim/ui/FilterBar";
import { DbimEmptyState } from "@/components/website-dbim/ui/EmptyState";
import { useListing } from "@/components/website-dbim/ui/useListing";
import type { DbimDocRow } from "@/lib/website-dbim/documents";
import { DocTableHead, FileRow } from "./DocRows";
import { NoMatch, Pager } from "./ListStates";
import { LATEST_OLDEST } from "./SeriesList";

export interface FileListProps {
  rows: DbimDocRow[];
  /** Names the table and the search field, e.g. "Annual Reports". */
  label: string;
  /** Archives: show the header row, Category and per page. */
  archive?: boolean;
  /** "." for the tender and vacancy archive, which the reference prints dd.mm.yyyy. */
  dateSep?: string;
}

const searchText = (r: DbimDocRow) => r.title;
const categoryOf = (r: DbimDocRow) => r.category;

export function DbimFileList({ rows, label, archive = false, dateSep }: FileListProps) {
  const hasCategories = archive && rows.some((r) => r.category);
  const listing = useListing(rows, {
    searchText,
    category: hasCategories ? categoryOf : undefined,
    sorts: LATEST_OLDEST,
  });
  const top = React.useRef<HTMLDivElement>(null);
  const dateLabel = archive ? "Published Date" : "Published Year";

  return (
    <div ref={top} className={`db-doc db-doc--files${archive ? " db-doc--archive" : ""}`}>
      <DbimFilterBar
        search={{ value: listing.query, onChange: listing.setQuery, placeholder: "Search...", label: `Search ${label}` }}
        sort={{ value: listing.sort, onChange: listing.setSort, options: listing.sortOptions, placeholder: "Sort by", label: "Sort by" }}
        category={
          hasCategories
            ? { value: listing.category, onChange: listing.setCategory, options: listing.categories, placeholder: "Category", label: "Filter by category" }
            : undefined
        }
        perPage={archive ? { value: listing.perPage, onChange: listing.setPerPage, options: [10, 15, 20] } : undefined}
      />
      <div role="table" aria-label={`${label} data`}>
        {archive ? (
          <div role="rowgroup">
            <DocTableHead columns={["Title", "Published Date", "Type/Size"]} />
          </div>
        ) : null}
        {listing.unfilteredTotal === 0 ? (
          <DbimEmptyState />
        ) : listing.total === 0 ? (
          <NoMatch listing={listing} noun="documents" />
        ) : (
          <div role="rowgroup">
            {listing.visible.map((r) => (
              <FileRow key={r.key} row={r} dateSep={dateSep} dateLabel={dateLabel} />
            ))}
          </div>
        )}
      </div>
      <Pager listing={listing} target={top} />
    </div>
  );
}
