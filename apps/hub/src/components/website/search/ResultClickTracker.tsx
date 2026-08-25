"use client";

import * as React from "react";

interface ResultClickTrackerProps {
  /** The query these results answered. */
  query: string;
  /** id of the results list to watch. */
  listId: string;
}

/**
 * Records that a result was opened.
 *
 * WHY A DELEGATED LISTENER and not a client component per row: the results
 * themselves stay SERVER-rendered, so they are crawlable and readable before
 * hydration. Wrapping every row in a client component to attach an onClick would
 * trade that away for a beacon. One listener on the container costs nothing and
 * changes no markup.
 *
 * A search with clicks is a search that worked; a search without them is a query
 * that returned the wrong things, which is a different finding from a query that
 * returned nothing. Both matter. `[DBIM 9.x]`
 */
export function ResultClickTracker({ query, listId }: ResultClickTrackerProps) {
  React.useEffect(() => {
    const list = document.getElementById(listId);
    if (!list) return;

    const onClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>("a[href]");
      if (!link || !list.contains(link)) return;

      const rows = Array.from(list.querySelectorAll<HTMLAnchorElement>("a[data-result-index]"));
      const position = Number(link.dataset.resultIndex ?? rows.indexOf(link));

      // keepalive, because the page is navigating away as this fires.
      void fetch("/api/website/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, href: link.getAttribute("href"), position }),
        keepalive: true,
      }).catch(() => {
        /* Never let a beacon interfere with the navigation the reader asked for. */
      });
    };

    list.addEventListener("click", onClick);
    return () => list.removeEventListener("click", onClick);
  }, [query, listId]);

  return null;
}
