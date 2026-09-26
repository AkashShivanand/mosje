import type * as React from "react";
import Link from "next/link";
import { Icon } from "@mosje/design-system";
import { dbimHref } from "@/lib/website-dbim/nav";
import type { DbimDocRow } from "@/lib/website-dbim/ministry";

/**
 * The reference's document row (`.box.row` in About Us): file glyph and title,
 * date, file type and size, and a "View" button. Columns 6 / 2 / 2 / 2.
 */
export function DbimDocRowView({ doc }: { doc: DbimDocRow }) {
  return (
    <div className="db-min-docrow">
      <p className="db-min-docrow__title">
        <Icon name="draft" size={24} weight={400} aria-hidden="true" />
        <span>{doc.title}</span>
      </p>
      <span className="db-min-docrow__date">{doc.date ? <small className="db-min-ptype">{doc.date}</small> : null}</span>
      <span className="db-min-docrow__size">
        {doc.type || doc.size ? (
          <>
            <Icon name="picture_as_pdf" size={20} weight={400} aria-hidden="true" />
            {doc.size ? <small className="db-min-size">{doc.size}</small> : <small className="db-min-size">{doc.type}</small>}
          </>
        ) : null}
      </span>
      <span className="db-min-docrow__action">
        <a className="db-min-view" href={doc.href} target="_blank" rel="noopener noreferrer">
          <Icon name="visibility" size={24} weight={400} aria-hidden="true" />
          View
          <span className="sr-only">
            {" "}
            {doc.title}
            {doc.type ? ` (${doc.type})` : ""}, opens in a new tab
          </span>
        </a>
      </span>
    </div>
  );
}

/** A link row: the same box, with the arrow button (`a.link-btn`) on the right. */
export function DbimLinkRow({ label, href, external }: { label: string; href: string; external?: boolean }) {
  const inner = (
    <>
      <span className="db-min-docrow__title">
        <Icon name="draft" size={24} weight={400} aria-hidden="true" />
        <span>{label}</span>
      </span>
      <span className="db-min-arrow" aria-hidden="true">
        <Icon name={external ? "open_in_new" : "arrow_right_alt"} size={24} weight={400} />
      </span>
      {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
    </>
  );
  return external ? (
    <a className="db-min-docrow db-min-docrow--link" href={href} target="_blank" rel="noopener noreferrer">
      {inner}
    </a>
  ) : (
    <Link className="db-min-docrow db-min-docrow--link" href={href.startsWith("/website") ? href : dbimHref(href)}>
      {inner}
    </Link>
  );
}

/**
 * The reference's link row for a long record it keeps on another page (Former
 * Secretaries, Sector-Wise Detailed Information). Here the record opens in place,
 * under its row, so the reader does not leave About Us to read a table.
 */
export function DbimExpandRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <details className="db-min-expand">
      <summary className="db-min-docrow db-min-docrow--link">
        <span className="db-min-docrow__title">
          <Icon name="draft" size={24} weight={400} aria-hidden="true" />
          <span>{label}</span>
        </span>
        <span className="db-min-arrow" aria-hidden="true">
          <Icon name="arrow_right_alt" size={24} weight={400} />
        </span>
      </summary>
      <div className="db-min-expand__body">{children}</div>
    </details>
  );
}
