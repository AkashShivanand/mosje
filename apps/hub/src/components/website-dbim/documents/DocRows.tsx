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

/** YYYY-MM-DD → dd/mm/yyyy (dd.mm.yyyy for the tender and vacancy archive, as the reference prints it). */
export function formatDocDate(date: string | undefined, sep = "/"): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(date ?? "");
  return m ? [m[3], m[2], m[1]].join(sep) : "";
}

/** The reference's PDF glyph (its own path, filled with the text colour). */
export function PdfGlyph() {
  return (
    <svg viewBox="0 0 68 68" aria-hidden="true" focusable="false">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.13 47.8714C12.7254 46.6379 9.88617 46.145 7.0975 46.4771H0V67.9281H5.6525V59.741H8.075C10.5846 59.9579 13.1063 59.4402 15.215 58.2752C17.0049 56.9837 17.9917 55.0731 17.8925 53.0912C18.025 51.0785 16.9966 49.1354 15.13 47.8714ZM10.5825 55.701C9.51486 56.0964 8.34103 56.2445 7.1825 56.1301H5.525V50.0523H7.1825C8.38607 49.9447 9.6003 50.144 10.6675 50.6243C11.6614 51.2066 12.2246 52.1813 12.155 53.1984C12.2838 54.2239 11.6623 55.213 10.5825 55.701ZM30.0475 46.4771H22.9925V67.9281H29.75C33.1938 68.2116 36.6618 67.653 39.7375 66.3193C43.1218 64.1975 44.9299 60.7346 44.4975 57.2026C44.7508 54.1767 43.4692 51.2021 40.97 49.0155C37.8829 46.9686 33.9459 46.0537 30.0475 46.4771ZM35.6575 63.0659C33.8869 63.9031 31.8595 64.2766 29.835 64.1384H28.73V50.2668H29.75C33.32 50.2668 34.7225 50.5528 36.125 51.6254C37.8271 53.1161 38.7062 55.1399 38.5475 57.2026C38.7661 59.4349 37.6898 61.6187 35.6575 63.0659ZM50.7025 67.9281H56.44V58.9544H68V55.1648H56.44V50.2668H68V46.4771H50.7025V67.9281ZM46.75 0H0V39.3268H8.5V32.1765V28.4226V7.15033H43.2225L59.5 20.8432V28.4226V32.1765V39.3268H68V17.8758L46.75 0Z"
      />
    </svg>
  );
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
