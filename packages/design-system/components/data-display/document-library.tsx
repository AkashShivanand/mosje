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

      <p className="ds-doclib__count" aria-live="polite">
        Showing {shown.length} of {items.length} {noun}
      </p>

      {shown.length > 0 ? (
        <ul className="ds-doclib__grid">
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
