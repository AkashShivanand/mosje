/*
 * NO "use client" — deliberately, and it is load-bearing.
 *
 * The preferred form takes `hrefFor`, a FUNCTION prop. React cannot serialise a
 * function across the server/client boundary, so marking this file "use client"
 * makes every server-rendered pager throw "Functions cannot be passed directly to
 * Client Components" at render time. (It did, on the search results page, until
 * this line was removed.)
 *
 * Nothing here needs the client: no hooks, no browser API, no effect. Rendered
 * from a server component it stays server markup; imported by a client component
 * it is compiled into that bundle along with its `onPageChange` handler. Both
 * forms work — as long as this file does not claim the boundary for itself.
 */
import * as React from "react";
import { Icon } from "../utilities/icon";
import { cn } from "../../utils/cn";
import "./pagination.css";

export interface PaginationProps {
  /** 1-based current page. */
  page: number;
  /** Total number of pages. Values below 1 render nothing. */
  totalPages: number;
  /**
   * The href for a given page. Provide this and the control renders real links —
   * which is the DEFAULT and the preferred shape for anything whose page number
   * belongs in the URL (a search result set, a document listing). Links are
   * shareable, survive the back button, work before hydration, and are followed
   * by a crawler.
   */
  hrefFor?: (page: number) => string;
  /**
   * Page-change handler, for a control paginating client-side state that has no
   * URL of its own. Ignored when `hrefFor` is given.
   */
  onPageChange?: (page: number) => void;
  /** Accessible name for the surrounding nav. @default "Pagination" */
  label?: string;
  /** How many numbered pages to show around the current one. @default 2 */
  siblings?: number;
  className?: string;
}

/**
 * The list of page numbers to render, with `null` standing for an ellipsis.
 *
 * First and last are always present so the ends of the set stay one click away.
 */
function pageList(page: number, totalPages: number, siblings: number): (number | null)[] {
  const window = siblings * 2 + 5;
  if (totalPages <= window) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const first = 1;
  const last = totalPages;
  const start = Math.max(first + 1, page - siblings);
  const end = Math.min(last - 1, page + siblings);

  const pages: (number | null)[] = [first];
  if (start > first + 1) pages.push(null);
  for (let n = start; n <= end; n++) pages.push(n);
  if (end < last - 1) pages.push(null);
  pages.push(last);
  return pages;
}

/**
 * Pagination — page navigation for a result set.
 *
 * PREFER THE LINK FORM. `DataTable` paginates its own client-side state and is
 * right to; but anything whose result set comes from the URL — search results, a
 * filtered document listing — must paginate with real links, or page 3 cannot be
 * shared, bookmarked, or reached with the back button.
 *
 * ACCESSIBILITY. The whole control is a `<nav>` with an accessible name, so a
 * screen-reader user can jump to it and knows what it is. The current page
 * carries `aria-current="page"` and is NOT a link — there is nowhere to go — and
 * every number is labelled "Page N" rather than announced as a bare digit.
 * Previous/Next are labelled in words and are removed rather than disabled at the
 * ends, because a disabled link is not focusable and a disabled-looking control
 * that is still in the tab order is worse than one that is not there.
 */
export function Pagination({
  page,
  totalPages,
  hrefFor,
  onPageChange,
  label = "Pagination",
  siblings = 2,
  className,
}: PaginationProps): React.JSX.Element | null {
  if (totalPages < 2) return null;

  const current = Math.min(Math.max(1, page), totalPages);
  const pages = pageList(current, totalPages, siblings);

  const step = (target: number, direction: "prev" | "next", text: string) => {
    const icon = direction === "prev" ? "chevron_left" : "chevron_right";
    const content = (
      <>
        {direction === "prev" && <Icon name={icon} size={20} />}
        <span className="ds-pagination__step-text">{text}</span>
        {direction === "next" && <Icon name={icon} size={20} />}
      </>
    );

    return hrefFor ? (
      <a className="ds-pagination__step" href={hrefFor(target)} rel={direction}>
        {content}
      </a>
    ) : (
      <button type="button" className="ds-pagination__step" onClick={() => onPageChange?.(target)}>
        {content}
      </button>
    );
  };

  return (
    <nav className={cn("ds-pagination", className)} aria-label={label}>
      {current > 1 && step(current - 1, "prev", "Previous")}

      <ul className="ds-pagination__list">
        {pages.map((n, index) =>
          n === null ? (
            <li key={`gap-${index}`} className="ds-pagination__ellipsis" aria-hidden="true">
              …
            </li>
          ) : (
            <li key={n}>
              {n === current ? (
                <span className="ds-pagination__page is-current" aria-current="page">
                  <span className="ds-pagination__sr">Page </span>
                  {n}
                </span>
              ) : hrefFor ? (
                <a className="ds-pagination__page" href={hrefFor(n)} aria-label={`Page ${n}`}>
                  {n}
                </a>
              ) : (
                <button
                  type="button"
                  className="ds-pagination__page"
                  aria-label={`Page ${n}`}
                  onClick={() => onPageChange?.(n)}
                >
                  {n}
                </button>
              )}
            </li>
          ),
        )}
      </ul>

      {current < totalPages && step(current + 1, "next", "Next")}
    </nav>
  );
}
