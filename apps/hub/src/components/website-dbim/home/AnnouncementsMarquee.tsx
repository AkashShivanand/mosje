"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { Icon, IconButton } from "@mosje/design-system";

export interface AnnouncementItem {
  key: string;
  title: string;
  href: string;
  /** A file or another website: opens in a new tab and says so. */
  external?: boolean;
}

/**
 * The announcements strip. The reference scrolls it with a 40s CSS marquee; the duration
 * here grows with the text so a long feed reads no faster than the reference's does.
 * Pause stops it where it is (the reference's behaviour); hovering or focusing it stops it
 * too, and a focused link takes the strip out of animation altogether so the link can be
 * scrolled into view rather than sliding away from the keyboard.
 */
export function AnnouncementsMarquee({ items }: { items: AnnouncementItem[] }) {
  const [paused, setPaused] = useState(false);
  const chars = items.reduce((n, i) => n + i.title.length, 0);
  const style = { "--db-marquee-duration": `${Math.max(40, Math.round(chars * 0.12))}s` } as CSSProperties;

  return (
    <>
      <div className="db-announce__viewport" data-paused={paused || undefined} style={style}>
        {items.length === 0 ? (
          <p className="db-announce__empty">No Data Available.</p>
        ) : (
          <div className="db-announce__track">
            <AnnouncementList items={items} />
            {/* A second copy makes the loop seamless; it is not read or tabbed to. */}
            <AnnouncementList items={items} copy />
          </div>
        )}
      </div>
      <IconButton
        variant="primary"
        appearance="text"
        size="sm"
        className="db-announce__toggle"
        aria-label={paused ? "Play announcements" : "Pause announcements"}
        icon={<Icon name={paused ? "play_arrow" : "pause"} size={24} />}
        onClick={() => setPaused((p) => !p)}
        disabled={items.length === 0}
      />
    </>
  );
}

function AnnouncementList({ items, copy }: { items: AnnouncementItem[]; copy?: boolean }) {
  return (
    <ul className="db-announce__list" aria-hidden={copy || undefined} inert={copy || undefined} data-copy={copy || undefined}>
      {items.map((item) => (
        <li key={item.key} className="db-announce__item">
          {item.external ? (
            <a href={item.href} className="db-announce__link" target="_blank" rel="noopener noreferrer">
              {item.title}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : (
            <Link href={item.href} className="db-announce__link">
              {item.title}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}
