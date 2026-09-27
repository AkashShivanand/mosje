"use client";

import Link from "next/link";
import { Button, Icon } from "@mosje/design-system";
import { DbimPagination } from "@/components/website-dbim/ui/Pagination";
import { DbimEmptyState } from "@/components/website-dbim/ui/EmptyState";
import { dbimHref } from "@/lib/website-dbim/nav";
import type { Listing } from "@/components/website-dbim/ui/useListing";

/**
 * What every Offerings list shows when it has no rows to show, and the row under
 * it. Two different empties (data-state-completeness.md §1): nothing published
 * is the reference's "No Data Available."; a search or category that matched
 * nothing names what the reader asked for and offers to clear it.
 */
export function DbimListEmpty<T>({ listing }: { listing: Listing<T> }) {
  if (listing.total > 0) return null;
  if (listing.unfilteredTotal === 0 || !listing.filtered) return <DbimEmptyState />;
  const asked = [listing.query.trim() && `“${listing.query.trim()}”`, listing.category].filter(Boolean).join(" in ");
  return (
    <div className="db-off-noresults" role="status">
      <p>No results for {asked}.</p>
      <Button appearance="outlined" size="sm" className="db-off-clear" onClick={listing.clear}>
        Clear Search
      </Button>
    </div>
  );
}

/** The reference's `.row.mt-5`: empty · pager centred · View Archive on the right. */
export function DbimListFooter<T>({ listing, archive, label }: { listing: Listing<T>; archive?: string; label: string }) {
  return (
    <div className="db-off-foot">
      <div className="db-off-foot__pager">
        <DbimPagination page={listing.page} pageCount={listing.pageCount} onChange={listing.setPage} label={label} />
      </div>
      {archive ? (
        <div className="db-off-foot__end">
          <Link href={dbimHref(archive)} className="db-off-archive">
            <Icon name="archive" size={24} weight={400} />
            View Archive
          </Link>
        </div>
      ) : null}
    </div>
  );
}
