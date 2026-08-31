"use client";

/* =============================================================================
   ONE SHELF FOR EVERYTHING THE ORGANISATION PUBLISHES.

   This band replaces four consecutive grids — Downloads (PM-AJAY), Downloads
   (PMAGY), Circulars & Notifications and Resources — that between them rendered
   nineteen files through the identical card. The headings were the department's
   filing categories, not answers to anything a reader arrives with, and one of
   them ("PM-AJAY" vs "PMAGY") split the shelf by SCHEME ERA without ever saying
   so on the page.

   The groups did not disappear; they became filters. A reader who wants only the
   circulars still gets only the circulars, in one click, without scrolling past
   three grids to find out the fourth exists.

   WHY A CLIENT COMPONENT. The filter is the whole point, and a filter that costs
   a page load is a filter nobody uses twice. Everything above the chip row is
   server-rendered and the full list is in the markup at first paint, so the band
   reads and links correctly with JavaScript off — the chips are the enhancement,
   not the content.
   ========================================================================== */

import { useMemo, useState } from "react";
import Link from "next/link";
import { Chip, Icon, buttonClasses } from "@mosje/design-system";

export interface LibraryItem {
  key: string;
  /** Filter chip this belongs under. */
  group: string;
  /** Small line above the title — a date, or who the file is for. */
  meta: string;
  title: string;
  /** The department's own name, where `title` is a plainer one. */
  officialName?: string;
  href: string;
  actionLabel: string;
  external: boolean;
}

const ALL = "All";

export function OrgLibrary({
  items,
  viewAllHref,
}: {
  items: LibraryItem[];
  viewAllHref: string;
}) {
  /*
   * Chip order follows the shelf, not the data. Declaring it here rather than
   * sorting the groups alphabetically keeps "Circulars" — the thing most
   * readers come for — first, and "Manuals & guides" last.
   */
  const groups = useMemo(() => {
    const order = ["Circulars", "Formats", "Presentations", "Manuals & guides", "Reports"];
    const present = new Set(items.map((i) => i.group));
    return [ALL, ...order.filter((g) => present.has(g))];
  }, [items]);

  const [active, setActive] = useState(ALL);

  const shown = active === ALL ? items : items.filter((i) => i.group === active);

  return (
    <>
      {groups.length > 2 && (
        <div className="orgl__filters" role="group" aria-label="Filter documents by type">
          {groups.map((g) => {
            const count = g === ALL ? items.length : items.filter((i) => i.group === g).length;
            return (
              <Chip
                key={g}
                selected={active === g}
                onSelectedChange={() => setActive(g)}
                aria-pressed={active === g}
              >
                {g} ({count})
              </Chip>
            );
          })}
        </div>
      )}

      {/* The count is announced, not just shown: a filter that changes the list
          silently leaves a screen-reader user with no idea it did anything. */}
      <p className="orgl__count" aria-live="polite">
        Showing {shown.length} of {items.length} documents
      </p>

      <ul className="orgl__grid">
        {shown.map((item) => (
          <li key={item.key} className="orgl__card">
            <p className="orgl__meta">{item.meta}</p>
            <h3 className="orgl__title">{item.title}</h3>
            {item.officialName && item.officialName !== item.title && (
              <p className="orgl__official">Published as “{item.officialName}”</p>
            )}
            <Link
              href={item.href}
              className="orgl__action"
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noreferrer" : undefined}
            >
              <span>{item.actionLabel}</span>
              <Icon name={item.external ? "open_in_new" : "download"} size={16} />
              {item.external && <span className="sr-only"> (opens in a new tab)</span>}
            </Link>
          </li>
        ))}
      </ul>

      {shown.length === 0 && (
        <p className="orgl__empty">No documents of this type are published yet.</p>
      )}

      <div className="orgl__footer">
        <Link href={viewAllHref} className={buttonClasses("primary", "outlined", "sm")}>
          View all documents
        </Link>
      </div>
    </>
  );
}
