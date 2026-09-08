"use client";

import * as React from "react";
import { Chip } from "../forms/chip";
import { Icon } from "../utilities/icon";
import "./document-library.css";

export interface DocumentLibraryItem {
  /** Stable identity for the row. */
  id: string;
  /** Which filter chip this sits under. Declared by the caller, never inferred. */
  group: string;
  /**
   * The small line above the title: a publication date, or who the file is for.
   *
   * NOT the file type. A card whose meta reads "PDF" directly above a button
   * reading "Download PDF" has spent its most useful line restating its own
   * button — which is what the estate's organisation pages did for nineteen
   * cards before this component existed.
   */
  meta: string;
  /**
   * A TITLE, not a file name. "Presentation" is a file name: it tells a reader
   * nothing about what is inside, who it is for, or whether it is current.
   */
  title: string;
  /** The publisher's own name, where `title` is a plainer one. Shown beneath. */
  officialName?: string;
  href: string;
  /** What the button offers to do — "Download PDF", "View document", "View page". */
  actionLabel: string;
  /** Leaves this site, so it opens in a new tab and is announced as doing so. */
  external?: boolean;
}

export interface DocumentLibraryProps {
  items: DocumentLibraryItem[];
  /**
   * Chip order, most-wanted first. Groups absent from `items` are dropped, so
   * one order can serve several pages. Omit it and the chips follow first
   * appearance in `items`.
   */
  groupOrder?: string[];
  /**
   * The footer's "view all" control, supplied as an ELEMENT — typically a
   * `next/link` already styled with `buttonClasses`. Omit it and no footer
   * renders.
   *
   * A slot rather than a `linkAs` component prop, because this is a client
   * component: React Server Components refuse to pass a FUNCTION across the
   * boundary ("Functions cannot be passed directly to Client Components"), so a
   * server page handing over `next/link` itself crashes the route. An element
   * crosses that boundary fine, and the server page keeps its router-aware
   * navigation.
   */
  viewAllSlot?: React.ReactNode;
  /** Noun used in the count line and the empty state. @default "documents" */
  noun?: string;
  /**
   * How the cards are laid out.
   *
   * `"grid"` (default) wraps them down the page in as many columns as fit — the
   * right answer for a shelf that IS the page, like a document catalogue.
   *
   * `"rail"` puts them on one row that scrolls sideways, with the next card
   * peeking in from the right edge. Use it where the shelf is one section among
   * many and its height is competing with everything below it: on the
   * organisation pages a four-item shelf in a three-column grid was two rows
   * with two thirds of the second one empty.
   *
   * A rail costs the reader a gesture to see the later cards, so it is for
   * shelves that already publish a route to the whole list. It does not suit a
   * shelf of twenty.
   *
   * @default "grid"
   */
  layout?: "grid" | "rail";
  /**
   * Names the rail for assistive technology — "IEC Materials". Required in
   * spirit when `layout="rail"`: the rail is a focusable scroll region (WCAG
   * 2.1.1), so it adds a tab stop, and an unnamed one lands the reader on an
   * unlabelled box. Ignored by the grid, which is not focusable and needs no
   * name.
   */
  railLabel?: string;
  className?: string;
}

const ALL = "All";

/**
 * ONE SHELF FOR EVERYTHING A BODY PUBLISHES.
 *
 * Replaces the pattern of stacking a separate grid per document category —
 * circulars here, formats there, presentations below, manuals below that. Those
 * headings are the publisher's filing system, not a question a reader arrives
 * with, and four consecutive grids of the identical card read as one
 * undifferentiated wall. The categories become chips: the grouping survives, the
 * scrolling does not.
 *
 * WHY IT IS A CLIENT COMPONENT. The filter is the whole point, and a filter that
 * costs a page load is a filter nobody uses twice. The full list is in the markup
 * at first paint and every card is a real link, so the band reads and navigates
 * correctly with JavaScript off — the chips are the enhancement, not the content.
 *
 * The count line is `aria-live`: a filter that silently changes a list leaves a
 * screen-reader user with no idea it did anything.
 */
export function DocumentLibrary({
  items,
  groupOrder,
  viewAllSlot,
  noun = "documents",
  layout = "grid",
  railLabel,
  className,
}: DocumentLibraryProps) {
  const groups = React.useMemo(() => {
    const present: string[] = [];
    for (const item of items) if (!present.includes(item.group)) present.push(item.group);
    const ordered = groupOrder
      ? groupOrder.filter((g) => present.includes(g)).concat(present.filter((g) => !groupOrder.includes(g)))
      : present;
    return [ALL, ...ordered];
  }, [items, groupOrder]);

  const [active, setActive] = React.useState(ALL);

  /*
   * A chip can vanish when `items` changes under a filtered view — a page that
   * swaps its data, a story that switches args. Falling back to All keeps the
   * band from rendering an empty list under a chip that is no longer there.
   */
  const current = groups.includes(active) ? active : ALL;
  const shown = current === ALL ? items : items.filter((i) => i.group === current);

  return (
    <div className={["ds-doclib", className].filter(Boolean).join(" ")}>
      {/* One real group plus "All" is not a choice; showing two chips that always
          agree is chrome pretending to be a control. */}
      {groups.length > 2 && (
        <div className="ds-doclib__filters" role="group" aria-label={`Filter ${noun} by type`}>
          {groups.map((g) => {
            const count = g === ALL ? items.length : items.filter((i) => i.group === g).length;
            return (
              <Chip
                key={g}
                selected={current === g}
                onSelectedChange={() => setActive(g)}
                count={count}
                countLabel="documents"
              >
                {g}
              </Chip>
            );
          })}
        </div>
      )}

      {/*
       * THE COUNT LINE EXISTS TO ANNOUNCE A FILTER, so it appears only when
       * there is a filter to announce — the same condition the chip row uses.
       *
       * It is `aria-live`: its job is to tell a screen-reader user that pressing
       * a chip changed the list under it. With one group there are no chips, the
       * list never changes, and the line is a sentence restating the number of
       * cards directly below it. NMBA's page carried six of these — "Showing 4
       * of 4 documents", "Showing 1 of 1 documents" — one per shelf, which is
       * the restatement `ui-restraint-and-copy.md` §1 forbids, printed six times
       * on one page.
       */}
      {groups.length > 2 && (
        <p className="ds-doclib__count" aria-live="polite">
          Showing {shown.length} of {items.length} {noun}
        </p>
      )}

      {shown.length > 0 ? (
        <ul
          className={["ds-doclib__grid", layout === "rail" && "ds-doclib__grid--rail"]
            .filter(Boolean)
            .join(" ")}
          /*
           * A SCROLLABLE REGION MUST BE FOCUSABLE, and only when it is one.
           *
           * WCAG 2.1.1: a region that scrolls and cannot be focused cannot be
           * scrolled by anyone using a keyboard, and axe reports the same
           * element as `scrollable-region-focusable`. The grid does not scroll,
           * so it takes no tab stop — a tab stop that leads nowhere is a cost
           * with no benefit, and the estate already has enough of them.
           *
           * `jsx-a11y/no-noninteractive-tabindex` objects to a tab stop on a
           * non-interactive element and is right in general; it has no option
           * that recognises a scroll container. `Carousel`'s track carries a
           * disable directive for exactly this. **This one deliberately does
           * not**, and `check:ds-lint` is why: the rule reads a LITERAL
           * `tabIndex`, and this value is computed, so the rule never fires and
           * a directive here is reported as unused. If the value is ever made a
           * literal, add the directive back with the same reason.
           */
          tabIndex={layout === "rail" ? 0 : undefined}
          /*
           * NO `role` HERE. The rail carried `role="group"`, which OVERRODE the
           * `<ul>`'s implicit `list` role — and a list role is what makes its
           * `<li>` children list items. axe caught it on the first run of the
           * organisation page against the suite: "[serious] listitem — <li>
           * elements must be contained in a <ul> or <ol>", on all four cards.
           *
           * A named list is the better announcement anyway. The element keeps
           * its list semantics, takes `aria-label` for the shelf's name, and
           * takes the tab stop the scroll region needs, so a screen-reader user
           * hears "IEC Materials, list, 4 items" and can scroll it.
           */
          aria-label={layout === "rail" ? railLabel : undefined}
        >
          {shown.map((item) => (
            <li key={item.id} className="ds-doclib__card">
              <p className="ds-doclib__meta">{item.meta}</p>
              <h3 className="ds-doclib__title">{item.title}</h3>
              {item.officialName && item.officialName !== item.title && (
                <p className="ds-doclib__official">Published as “{item.officialName}”</p>
              )}
              {/* A plain anchor, deliberately. Every card here resolves to a
                  file or to another site; client-side routing buys a PDF
                  download nothing, and an <a> is what a download wants. */}
              <a
                href={item.href}
                className="ds-doclib__action"
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noreferrer" : undefined}
              >
                <span>{item.actionLabel}</span>
                <Icon name={item.external ? "open_in_new" : "download"} size={16} />
                {item.external && <span className="sr-only"> (opens in a new tab)</span>}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="ds-doclib__empty">No {noun} of this type are published yet.</p>
      )}

      {viewAllSlot && <div className="ds-doclib__footer">{viewAllSlot}</div>}
    </div>
  );
}
