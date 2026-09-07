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

export type PaginationSize = "sm" | "md";

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
  /**
   * Control size. @default "md"
   *
   * `sm` is for a pager INSIDE a card or a rail — a panel that paginates its
   * own contents rather than the page. `md`'s 40px targets and word-labelled
   * steps are sized for a page-level pager with the full width to sit in; in
   * PM-AJAY's 19rem coverage rail the same control asked for 267px it did not
   * have and wrapped onto two lines.
   *
   * `sm` is 32px, past the 24px minimum target (WCAG 2.2 SC 2.5.8), and drops
   * the step labels to icons at every width — a card pager sits beside the
   * list it pages, so "Previous" has a visible referent that a page-level
   * pager stranded at the foot of a document does not. The words stay in the
   * accessibility tree either way.
   */
  size?: PaginationSize;
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
 * carries `aria-current="page"` and never navigates — there is nowhere to go —
 * and every number is labelled "Page N" rather than announced as a bare digit.
 * Previous and Next are labelled in words.
 *
 * THE TWO FORMS END DIFFERENTLY, ON PURPOSE. In the LINK form the ends are
 * removed: a press there is a navigation, so nothing was going to keep focus
 * anyway, and an anchor cannot take a native `disabled` at all. In the BUTTON
 * form they stay mounted and go `aria-disabled`, and the current page stays a
 * `<button>` rather than becoming a `<span>` — because nothing else moves focus
 * in that form, and unmounting the control that was just pressed drops focus to
 * `<body>`. A page turn used to send a keyboard reader back to the top of the
 * document; it no longer does. The button form also announces the new position
 * through a polite live region, since the rows otherwise swap in silence.
 */
export function Pagination({
  page,
  totalPages,
  hrefFor,
  onPageChange,
  label = "Pagination",
  siblings = 2,
  size = "md",
  className,
}: PaginationProps): React.JSX.Element | null {
  if (totalPages < 2) return null;

  const current = Math.min(Math.max(1, page), totalPages);
  const pages = pageList(current, totalPages, siblings);

  /**
   * THE BUTTON FORM DISABLES IN PLACE; THE LINK FORM STILL REMOVES.
   *
   * The asymmetry is the fix, not an inconsistency. In the link form a press is
   * a navigation: the document changes, the framework's route announcer speaks,
   * and there is nothing left on screen for focus to have stayed on — so
   * removing Previous at page 1 costs nothing, and GOV.UK removes it too.
   *
   * In the button form nothing moves focus. Unmounting the control that was
   * just pressed drops focus to `<body>`, which returns a keyboard reader to
   * the top of the document on every page turn — on a 99-page register, every
   * time. So in that form the ends stay mounted and the current page stays a
   * `<button>`: same element, same key, so React patches it in place and the
   * focused node survives.
   *
   * This also settles the disagreement with `DataTable`'s own pager, which has
   * always disabled rather than removed.
   */
  const isLinkForm = Boolean(hrefFor);

  /*
   * `aria-disabled`, NOT `disabled`, AND THE THREE JOBS THAT COMES WITH.
   *
   * The native attribute leaves the tab order, and a focused element that
   * becomes `disabled` loses focus — which is the defect, restated. So the
   * control keeps its tab stop and announces itself dimmed, and the three
   * things the attribute was doing are taken back by hand: the click, the
   * Enter/Space keypress, and — via `type="button"`, which these already carry —
   * implicit form submission. `Button`'s `preserveFocus` does exactly this, and
   * the pointer half lives in the stylesheet so it holds before hydration too.
   */
  const block = (e: React.SyntheticEvent): void => {
    e.preventDefault();
    e.stopPropagation();
  };
  const inert = {
    "aria-disabled": true,
    onClick: block,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") block(e);
    },
  } as const;

  const step = (target: number, direction: "prev" | "next", text: string, atEnd = false) => {
    const icon = direction === "prev" ? "chevron_left" : "chevron_right";
    const iconSize = size === "sm" ? 16 : 20;
    const content = (
      <>
        {direction === "prev" && <Icon name={icon} size={iconSize} />}
        <span className="ds-pagination__step-text">{text}</span>
        {direction === "next" && <Icon name={icon} size={iconSize} />}
      </>
    );

    return hrefFor ? (
      <a className="ds-pagination__step" href={hrefFor(target)} rel={direction}>
        {content}
      </a>
    ) : (
      <button
        type="button"
        className="ds-pagination__step"
        onClick={() => onPageChange?.(target)}
        {...(atEnd ? inert : {})}
      >
        {content}
      </button>
    );
  };

  return (
    <nav className={cn("ds-pagination", `ds-pagination--${size}`, className)} aria-label={label}>
      {isLinkForm
        ? current > 1 && step(current - 1, "prev", "Previous")
        : step(current - 1, "prev", "Previous", current === 1)}

      <ul className="ds-pagination__list">
        {pages.map((n, index) =>
          n === null ? (
            <li key={`gap-${index}`} className="ds-pagination__ellipsis" aria-hidden="true">
              …
            </li>
          ) : (
            <li key={n}>
              {n === current ? (
                isLinkForm ? (
                  <span className="ds-pagination__page is-current" aria-current="page">
                    <span className="ds-pagination__sr">Page </span>
                    {n}
                  </span>
                ) : (
                  <button
                    type="button"
                    className="ds-pagination__page is-current"
                    aria-current="page"
                    aria-label={`Page ${n}`}
                    {...inert}
                  >
                    {n}
                  </button>
                )
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

      {isLinkForm
        ? current < totalPages && step(current + 1, "next", "Next")
        : step(current + 1, "next", "Next", current === totalPages)}

      {/*
        Nothing about a page turn is audible on its own. The link form does not
        need this — a navigation announces itself — but in the button form the
        rows swap silently, so the new position is announced politely. SMILE
        Admin hand-rolled exactly this beside its own pager, which is the usual
        sign that the component owed it.
      */}
      {isLinkForm ? null : (
        <p className="ds-pagination__status" role="status" aria-live="polite">
          {`Page ${current} of ${totalPages}`}
        </p>
      )}
    </nav>
  );
}
