"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import type { DbimEvent } from "@/lib/website-dbim/connect";
import { DbimEmptyState } from "@/components/website-dbim/ui/EmptyState";
import { DbimPager } from "./ListStates";

/**
 * One page of past events. The page is cut on the SERVER (`?page=`): the register's
 * event descriptions weigh 580 KB (107 KB gzipped), and paging them on the client
 * would send all of them to every reader to show ten.
 */
export function DbimEventList({ events, total, page, pageCount }: { events: DbimEvent[]; total: number; page: number; pageCount: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const top = React.useRef<HTMLDivElement>(null);

  return (
    <div className="db-events" ref={top}>
      <h2 className="db-heading">Past Events</h2>
      {total === 0 ? (
        <DbimEmptyState />
      ) : (
        <ul className="db-event-list">
          {events.map((e) => (
            <li key={e.key} className="db-event">
              <h3>{e.title}</h3>
              <p>
                {e.place && `${e.place} | `}Event Start: {e.start}
                {e.end && ` , Event End: ${e.end}`}
              </p>
              {e.venue && (
                <p>
                  <span aria-hidden="true">📍</span>
                  <a href={e.venueHref} target="_blank" rel="noopener noreferrer">
                    {e.venue}
                    <span className="sr-only"> (map, opens in a new tab)</span>
                  </a>
                </p>
              )}
              {e.descriptionHtml && <div className="db-event__body" dangerouslySetInnerHTML={{ __html: e.descriptionHtml }} />}
            </li>
          ))}
        </ul>
      )}
      <DbimPager
        page={page}
        pageCount={pageCount}
        onChange={(p) => router.push(p === 1 ? pathname : `${pathname}?page=${p}`, { scroll: false })}
        target={top}
      />
    </div>
  );
}
