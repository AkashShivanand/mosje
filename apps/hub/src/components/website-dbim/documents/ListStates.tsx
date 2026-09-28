"use client";
/*
 * The two list states the reference does not draw but a list must have
 * (data-state-completeness.md): the reader's own search matched nothing, and the
 * pager under a long list.
 */
import * as React from "react";
import { Button } from "@mosje/design-system";
import { DbimPagination } from "@/components/website-dbim/ui/Pagination";

/** "Filtered to nothing": names the search and offers to clear it. */
export function NoMatch({ listing, noun }: { listing: { query: string; clear: () => void }; noun: string }) {
  const q = listing.query.trim();
  return (
    <div className="db-doc__nomatch" role="status">
      <span>{q ? `No ${noun} match “${q}”.` : `No ${noun} match the chosen category.`}</span>
      <Button appearance="text" size="sm" onClick={listing.clear}>
        {q ? "Clear Search" : "Clear Filter"}
      </Button>
    </div>
  );
}

/**
 * The pager, and focus back to the top of the list when the page turns. With `end`
 * (the tab's View Archive), the two share one row — pager centred, `end` at the
 * right — as DBIM 3.0 Figure 75 draws it.
 */
export function Pager({ listing, target, end }: {
  listing: { page: number; pageCount: number; setPage: (n: number) => void };
  target: React.RefObject<HTMLElement | null>;
  end?: React.ReactNode;
}) {
  const pager = listing.pageCount > 1 ? (
    <DbimPagination
      page={listing.page}
      pageCount={listing.pageCount}
      onChange={(p) => {
        listing.setPage(p);
        target.current?.scrollIntoView({ block: "start", behavior: "smooth" });
      }}
    />
  ) : null;
  if (!end) return pager ? <div className="db-doc__pager">{pager}</div> : null;
  return (
    <div className="db-doc__foot">
      <div className="db-doc__foot-pager">{pager}</div>
      <div className="db-doc__foot-end">{end}</div>
    </div>
  );
}
