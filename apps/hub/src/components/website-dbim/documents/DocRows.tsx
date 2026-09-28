/*
 * The rows of the DBIM document tables — the reference's `.tableheader` and
 * `.announcementbox`. Presentational only; the lists that page and filter them are
 * the client components beside this file. Semantics follow the reference: an ARIA
 * table, with each cell repeating its column name for the phone layout, where the
 * header row is hidden.
 */
import type * as React from "react";
import Link from "next/link";
import { Icon } from "@mosje/design-system";
import { dbimHref } from "@/lib/website-dbim/nav";
import type { DbimDocRow, DbimSeries } from "@/lib/website-dbim/documents";
import "./documents.css";
import { DbimIcon } from "../ui/icons";

/** YYYY-MM-DD → dd/mm/yyyy (dd.mm.yyyy for the tender and vacancy archive, as the reference prints it). */
export function formatDocDate(date: string | undefined, sep = "/"): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(date ?? "");
  return m ? [m[3], m[2], m[1]].join(sep) : "";
}

/** The DBIM Visual Library's "PDF" icon, in the text colour (the key colour here). */
export function PdfGlyph() {
  return <DbimIcon name="pdf" size={24} />;
}

type Layout = "files" | "news";

export function DocTableHead({ columns }: { columns: string[] }) {
  return (
    <div className="db-doc__head" role="row">
      {columns.map((c, i) => (
        <span key={i} role="columnheader">
          {c}
        </span>
      ))}
    </div>
  );
}

function FileLink({ row, children }: { row: DbimDocRow; children: React.ReactNode }) {
  const name = `View ${row.title}${row.size ? `, PDF ${row.size}` : ""} (opens in a new tab)`;
  return (
    <a className="db-doc__btn" href={row.href} target="_blank" rel="noopener noreferrer" aria-label={name}>
      {children}
    </a>
  );
}

const ViewLabel = ({ all }: { all?: boolean }) => (
  <>
    <Icon name="visibility" size={24} weight={400} />
    {all ? "View All" : "View"}
  </>
);

/** A single file: title · date · PDF glyph + size · View. */
export function FileRow({ row, dateSep = "/", dateLabel }: { row: DbimDocRow; dateSep?: string; dateLabel: string }) {
  return (
    <div className="db-doc__row" role="row">
      <div className="db-doc__cell" role="cell">
        <span className="db-doc__label">Title:</span>
        <p className="db-doc__title">{row.title}</p>
      </div>
      <div className="db-doc__cell" role="cell">
        <span className="db-doc__label">{dateLabel}:</span>
        <span className="db-doc__date">{formatDocDate(row.date, dateSep)}</span>
      </div>
      <div className="db-doc__cell" role="cell">
        <span className="db-doc__label">Type/Size:</span>
        <div className="db-doc__file">
          <span className="db-doc__type">
            {/* The glyph says "a PDF": shown for files, not for a page on another site. */}
            {!row.external || row.size ? <PdfGlyph /> : null}
            {row.size ? <span className="db-doc__size">{row.size}</span> : null}
          </span>
          <FileLink row={row}>
            <ViewLabel />
          </FileLink>
        </div>
      </div>
    </div>
  );
}

function FolderTitle({ series }: { series: DbimSeries }) {
  return (
    <div className="db-doc__cell db-doc__cell--title" role="cell">
      <span className="db-doc__label">Title</span>
      <Icon name="file_copy" size={24} weight={400} className="db-doc__folder-icon" />
      <p className="db-doc__title">{series.title}</p>
      <span className="db-doc__count" aria-label={`${series.count} ${series.count === 1 ? "document" : "documents"}`}>
        {series.count}
      </span>
    </div>
  );
}

function FolderAction({ series }: { series: DbimSeries }) {
  if (series.only) {
    return (
      <FileLink row={{ ...series.only, title: series.title }}>
        <ViewLabel />
      </FileLink>
    );
  }
  return (
    <Link
      className="db-doc__btn"
      href={dbimHref(`/documents/${series.tab}/${series.slug}`)}
      aria-label={`View all ${series.title}, ${series.count} documents`}
    >
      <ViewLabel all />
    </Link>
  );
}

/**
 * A series (folder): folder icon · title · count · newest date · View All. A folder
 * holding one file opens that file ("View"), as the reference's do. `layout="news"`
 * is What's New's four-column row; `"files"` the Documents tabs' three.
 */
export function FolderRow({ series, layout, dateLabel }: { series: DbimSeries; layout: Layout; dateLabel: string }) {
  const size = series.only?.size;
  if (layout === "news") {
    return (
      <div className="db-doc__row" role="row">
        <FolderTitle series={series} />
        <div className="db-doc__cell" role="cell">
          <span className="db-doc__label">{dateLabel}:</span>
          <span className="db-doc__date">{formatDocDate(series.date)}</span>
        </div>
        <div className="db-doc__cell" role="cell">
          <span className="db-doc__label">Type/Size:</span>
          {size ? <span className="db-doc__date">{size}</span> : null}
        </div>
        <div className="db-doc__cell db-doc__cell--action" role="cell">
          <FolderAction series={series} />
        </div>
      </div>
    );
  }
  return (
    <div className="db-doc__row" role="row">
      <FolderTitle series={series} />
      <div className="db-doc__cell" role="cell">
        <span className="db-doc__label">{dateLabel}:</span>
        <span className="db-doc__date">{formatDocDate(series.date)}</span>
      </div>
      <div className="db-doc__cell" role="cell">
        <span className="db-doc__label">Type/Size:</span>
        <div className="db-doc__file">
          <span className="db-doc__type">
            {size ? (
              <>
                <PdfGlyph />
                <span className="db-doc__size">{size}</span>
              </>
            ) : null}
          </span>
          <FolderAction series={series} />
        </div>
      </div>
    </div>
  );
}
