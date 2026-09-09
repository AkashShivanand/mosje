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
  /**
   * Total number of pages. Values below 1 render nothing.
   *
   * OMIT IT when the total is genuinely unknown — a cursor-paged feed, or a
   * count too expensive to run on every request. The control then drops the
   * numbers, because a window cannot be computed without a total, and reads
   * `hasNext` to decide whether Next is live. Do NOT pass a guess: a page count
   * that moves under the reader is worse than one that was never claimed.
   */
  totalPages?: number;
  /**
   * Whether a next page exists. Only consulted when `totalPages` is omitted;
   * with a total the component works it out. @default true
   */
  hasNext?: boolean;
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
  /**
   * Draw the numbered pages. @default true
   *
   * `false` gives the STEPS-ONLY form — Previous, the position in words, Next —
   * which is GOV.UK's "block" pagination and what three surfaces on this estate
   * had already hand-rolled beside the component rather than asking it for:
   * `ListingTable`, and SMILE Admin's desktop and mobile pairs.
   *
   * Reach for it when the reader moves through a set one at a time rather than
   * jumping about in it, or when the pager sits somewhere too narrow for a row
   * of numbers. It is implied when `totalPages` is omitted, because there is
   * then nothing to number.
   */
  showNumbers?: boolean;
  /**
   * Offer a "go to page" field. @default false
   *
   * For a long set, where the window leaves most pages more than a click away:
   * at 99 pages with the default `siblings`, reaching page 60 is eleven presses.
   *
   * BUTTON FORM ONLY, and that is a constraint rather than a preference. The
   * field needs a submit handler, and this file deliberately carries no
   * "use client" so that `hrefFor` — a function — can cross the server
   * boundary. In the link form it renders nothing; a link-form consumer that
   * wants one owns a form of its own, pointed at its own URL.
   */
  showJump?: boolean;
  /**
   * The next page is being fetched. @default false
   *
   * Marks the control `aria-busy` and makes every one of its controls inert, so
   * a reader cannot queue three presses against one in-flight request and land
   * somewhere they did not choose. It does NOT draw a spinner: the thing that
   * is loading is the result set, and its own surface should say so.
   */
  loading?: boolean;
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
  hasNext = true,
  hrefFor,
  onPageChange,
  label = "Pagination",
  siblings = 2,
  size = "md",
  showNumbers = true,
  showJump = false,
  loading = false,
  className,
}: PaginationProps): React.JSX.Element | null {
  /*
   * AN UNKNOWN TOTAL IS A MODE, NOT A MISSING VALUE.
   *
   * With a total the control can window the numbers and know where the ends
   * are. Without one it can do neither, so it drops to steps and asks `hasNext`
   * — USWDS calls the same thing "unbounded". Everything below reads `bounded`
   * rather than testing `totalPages` repeatedly, so the two modes cannot drift
   * apart the way the key and the map did on the PM-AJAY reach section.
   */
  const bounded = typeof totalPages === "number";

  // Below two pages there is nothing to page. An unbounded set never knows that,
  // so it renders as long as the caller says a next page exists.
  if (bounded && (totalPages as number) < 2) return null;
  if (!bounded && !hasNext && page <= 1) return null;

  const last = bounded ? (totalPages as number) : undefined;
  const current = bounded ? Math.min(Math.max(1, page), last as number) : Math.max(1, page);
  const numbered = showNumbers && bounded;
  const pages = numbered ? pageList(current, last as number, siblings) : [];
  const atStart = current <= 1;
  const atEnd = bounded ? current >= (last as number) : !hasNext;
  const isLinkForm = Boolean(hrefFor);

  /*
   * ONE SENTENCE, ONE PLACE — and, below, ONE NODE.
   *
   * This string had two authors: the visible paragraph the steps-only form
   * draws, and the clipped live region the button form announces through. Both
   * said "Page N of M", and in the steps-only BUTTON form both rendered — so
   * the accessibility tree carried the position twice, once as static text and
   * once as a status message. Only one was on screen, so nothing looked wrong.
   *
   * The fix is not to hide one of them: it is to notice they are the same
   * sentence. Where the position is already on screen the live region goes ON
   * it, which is the pattern ARIA asks for anyway — a status message a sighted
   * reader can also read. The clipped copy is kept only for the form that has
   * no visible position to attach to.
   */
  const positionText = bounded ? `Page ${current} of ${last}` : `Page ${current}`;

  /*
   * The live region is the visible paragraph when there is one, and a clipped
   * node when there is not. The link form gets neither — a navigation announces
   * itself, and a second announcement talks over the framework's route
   * announcer.
   */
  const announceOnPosition = !isLinkForm && !numbered;
  const announceSeparately = !isLinkForm && numbered;
  const liveAttrs = { role: "status", "aria-live": "polite" } as const;

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
  /*
   * THE FIELD'S ID IS DERIVED FROM THE NAV'S NAME, NOT FROM `useId`.
   *
   * `useId` is a hook, and a hook here would have to run in the LINK form too —
   * which renders on the server, where hooks are not available. That is the same
   * constraint that keeps "use client" out of this file. The nav's accessible
   * name is already required to be specific when a page carries more than one
   * pager, so it is the natural unique key, and it only has to be unique among
   * the pagers on one page rather than globally.
   */
  const baseId = `ds-pagination-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;

  const block = (e: React.SyntheticEvent): void => {
    e.preventDefault();
    e.stopPropagation();
  };
  const inertAttrs = {
    "aria-disabled": true,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") block(e);
    },
  } as const;
  const inert = { ...inertAttrs, onClick: block } as const;

  const step = (target: number, direction: "prev" | "next", text: string, disabled = false) => {
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
        /*
         * A step that is disabled must NOT reach `onPageChange` — at the end of
         * the range, where "Previous" on page 1 would ask for page 0, and while
         * `loading`, where three presses would queue against one request. The
         * control keeps its tab stop and its focus, so nothing else refuses the
         * activation for us. The handler is chosen here rather than left to a
         * spread overwriting an explicit prop — that ordering was silent, and
         * moving the spread one line up would have re-enabled the step.
         *
         * It reads the PARAMETER, not the outer `atEnd`. Reading the outer one
         * made Previous inert at the end of the set instead of the start, and
         * left both steps live while loading — the control looked disabled and
         * still worked. Caught by measuring the rendered DOM, not by review.
         */
        onClick={disabled ? block : () => onPageChange?.(target)}
        {...(disabled ? inertAttrs : {})}
      >
        {content}
      </button>
    );
  };

  return (
    <nav
      className={cn("ds-pagination", `ds-pagination--${size}`, className)}
      aria-label={label}
      aria-busy={loading || undefined}
    >
      {isLinkForm
        ? !atStart && step(current - 1, "prev", "Previous")
        : step(current - 1, "prev", "Previous", atStart || loading)}

      {numbered ? (
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
                  onClick={loading ? block : () => onPageChange?.(n)}
                  {...(loading ? inertAttrs : {})}
                >
                  {n}
                </button>
              )}
            </li>
          ),
        )}
      </ul>
      ) : (
        /*
         * STEPS-ONLY. Without numbers the reader has nothing telling them where
         * they are, so the position is SHOWN rather than only announced — the
         * same reasoning the carousel's counter follows. With no total it says
         * the page alone, because claiming an "of N" the caller never supplied
         * would be inventing one.
         */
        <p className="ds-pagination__position" {...(announceOnPosition ? liveAttrs : {})}>
          {positionText}
        </p>
      )}

      {isLinkForm
        ? !atEnd && step(current + 1, "next", "Next")
        : step(current + 1, "next", "Next", atEnd || loading)}

      {showJump && !isLinkForm && bounded ? (
        /*
         * GO TO PAGE — button form only; the prop's docstring says why.
         *
         * A native form, so Enter submits with no key handling of our own, and
         * an uncontrolled input, so the control needs no state and this file
         * needs no "use client". The value is read off the form on submit and
         * clamped, because a reader who types 500 into a 99-page set meant the
         * end, not an error.
         */
        <form
          className="ds-pagination__jump"
          onSubmit={(e) => {
            e.preventDefault();
            const raw = new FormData(e.currentTarget).get("page");
            const n = Number.parseInt(String(raw ?? ""), 10);
            if (Number.isNaN(n)) return;
            onPageChange?.(Math.min(Math.max(1, n), last as number));
            e.currentTarget.reset();
          }}
        >
          <label className="ds-pagination__jump-label" htmlFor={`${baseId}-jump`}>
            Go to page
          </label>
          <input
            id={`${baseId}-jump`}
            className="ds-pagination__jump-field"
            name="page"
            type="number"
            inputMode="numeric"
            min={1}
            max={last}
            disabled={loading}
            aria-describedby={`${baseId}-jump-range`}
          />
          <span id={`${baseId}-jump-range`} className="ds-pagination__sr">
            {`between 1 and ${last}`}
          </span>
          <button type="submit" className="ds-pagination__jump-go" disabled={loading}>
            Go
          </button>
        </form>
      ) : null}

      {/*
        Nothing about a page turn is audible on its own. In the button form the
        rows swap silently, so the new position is announced politely. SMILE
        Admin hand-rolled exactly this beside its own pager, which is the usual
        sign that the component owed it.

        This node is the NUMBERED button form only. Steps-only already draws the
        position on screen and carries the live region there, and the link form
        needs no announcement at all — see `announceSeparately` above.
      */}
      {announceSeparately ? (
        <p className="ds-pagination__status" {...liveAttrs}>
          {positionText}
        </p>
      ) : null}
    </nav>
  );
}
