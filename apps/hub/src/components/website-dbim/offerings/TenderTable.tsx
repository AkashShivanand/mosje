"use client";

import * as React from "react";
import { Icon } from "@mosje/design-system";
import { DbimFilterBar } from "@/components/website-dbim/ui/FilterBar";
import { useListing } from "@/components/website-dbim/ui/useListing";
import type { DbimNotice } from "@/lib/website-dbim/offerings";
import { DbimListEmpty, DbimListFooter } from "./ListParts";
import { DbimPdfIcon } from "./PdfIcon";

const searchText = (t: DbimNotice) => t.title;
const categoryOf = (t: DbimNotice) => t.category;
const SORTS = {
  newest: { label: "Newest First", compare: (a: DbimNotice, b: DbimNotice) => b.time - a.time },
  oldest: { label: "Oldest First", compare: (a: DbimNotice, b: DbimNotice) => a.time - b.time },
  title: { label: "Title (A–Z)", compare: (a: DbimNotice, b: DbimNotice) => a.title.localeCompare(b.title) },
};

/**
 * The reference's columns, in its order and 12-column spans. A column is drawn
 * only when at least one row has a value for it: the register publishes no
 * tender ID and no due date, and a column of blanks tells the reader nothing.
 */
interface Column {
  key: string;
  label: string;
  span: number;
  value: (t: DbimNotice) => React.ReactNode;
  kind: "meta" | "title" | "file";
}
const COLUMNS: Column[] = [
  { key: "title", label: "Title", span: 3, kind: "title", value: (t) => t.title },
  { key: "published", label: "Published Date", span: 2, kind: "meta", value: (t) => t.published },
  { key: "file", label: "Type/Size", span: 3, kind: "file", value: (t) => t.fileUrl },
];

function FileCell({ t }: { t: DbimNotice }) {
  if (!t.fileUrl) return null;
  return (
    <div className="db-tender__file">
      <span className="db-tender__type">
        <DbimPdfIcon />
        <small>{t.fileType ?? "File"}</small>
      </span>
      <a className="db-off-view" href={t.fileUrl} target="_blank" rel="noopener noreferrer">
        <Icon name="visibility" size={24} weight={400} />
        View
        <span className="sr-only">
          {" "}
          {t.title} ({t.fileType ?? "document"}, opens in a new tab)
        </span>
      </a>
    </div>
  );
}

/** Tenders: search · Sort by · Category · per page, then the reference's card-row table, paged. */
export function DbimTenderTable({ tenders }: { tenders: DbimNotice[] }) {
  const listing = useListing(tenders, { searchText, category: categoryOf, sorts: SORTS, perPage: 10 });
  const columns = COLUMNS.filter((c) => tenders.some((t) => c.value(t)));
  const grid = { "--db-cols": columns.map((c) => `${c.span}fr`).join(" ") } as React.CSSProperties;

  return (
    <div className="db-off">
      <DbimFilterBar
        search={{ value: listing.query, onChange: listing.setQuery, placeholder: "Search...", label: "Search tenders" }}
        sort={{ value: listing.sort, onChange: listing.setSort, options: listing.sortOptions, placeholder: "Sort by", label: "Sort by" }}
        category={
          listing.categories.length > 1
            ? { value: listing.category, onChange: listing.setCategory, options: listing.categories, placeholder: "Category", label: "Category" }
            : undefined
        }
        perPage={{ value: listing.perPage, onChange: listing.setPerPage, options: [10, 15, 20] }}
      />
      <div role="table" aria-label="Tenders" className="db-tender">
        <div role="rowgroup">
          <div role="row" className="db-tender__head" style={grid}>
            {columns.map((c) => (
              <div role="columnheader" key={c.key}>
                <small>{c.label}</small>
              </div>
            ))}
          </div>
        </div>
        <div role="rowgroup">
          {listing.visible.map((t) => (
            <div role="row" key={t.slug} className="db-tender__row" style={grid}>
              {columns.map((c) => (
                <div role="cell" key={c.key} className={`db-tender__cell db-tender__cell--${c.kind}`}>
                  <small className="db-tender__label" aria-hidden="true">
                    {c.label}:
                  </small>
                  {c.kind === "file" ? (
                    <FileCell t={t} />
                  ) : c.kind === "title" ? (
                    <p>{c.value(t)}</p>
                  ) : (
                    <small className="db-tender__meta">{c.value(t)}</small>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <DbimListEmpty listing={listing} />
      <DbimListFooter listing={listing} archive="/archives" label="Tenders pages" />
    </div>
  );
}
