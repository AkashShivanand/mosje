import Link from "next/link";
import { Icon } from "@mosje/design-system";
import { dbimHref } from "@/lib/website-dbim/nav";

export interface DbimLinkRowProps {
  label: string;
  /** A page of this website (a DBIM path)… */
  path?: string;
  /** …or a file or another website. */
  href?: string;
  /** A line under the title — search results only. */
  detail?: string;
}

const isFile = (href: string) => /\.(pdf|docx?|xlsx?|pptx?|zip)(\?|#|$)/i.test(href);

/**
 * The reference's `.announcementbox` row: the item's name, and on the right a
 * primary-100 pill — KNOW MORE for a page of this website, VISIT WEBSITE for another
 * website, DOWNLOAD for a file. The pill carries the item's name in its accessible
 * name, so a list of ten of them does not read as ten identical links.
 */
export function DbimLinkRow({ label, path, href, detail }: DbimLinkRowProps) {
  const external = !path && !!href;
  const file = external && isFile(href);
  const verb = file ? "Download" : external ? "Visit Website" : "Know More";
  const icon = file ? "download" : external ? "open_in_new" : "arrow_forward";

  const pill = (
    <>
      <Icon name={icon} size={24} weight={400} aria-hidden />
      <span aria-hidden="true">{verb}</span>
      <span className="sr-only">
        {`${verb}: ${label}`}
        {external ? " (opens in a new tab)" : ""}
      </span>
    </>
  );

  return (
    <li className="db-u-row">
      <div className="db-u-row__text">
        <p className="db-u-row__title">{label}</p>
        {detail && <p className="db-u-row__detail">{detail}</p>}
      </div>
      <div className="db-u-row__action">
        {external ? (
          <a className="db-u-pill" href={href} target="_blank" rel="noopener noreferrer">
            {pill}
          </a>
        ) : (
          <Link className="db-u-pill" href={dbimHref(path ?? "/")}>
            {pill}
          </Link>
        )}
      </div>
    </li>
  );
}
