"use client";

import Link from "next/link";
import { Button, Icon } from "@mosje/design-system";
import { DbimFilterBar } from "@/components/website-dbim/ui/FilterBar";
import { DbimPagination } from "@/components/website-dbim/ui/Pagination";
import { DbimEmptyState } from "@/components/website-dbim/ui/EmptyState";
import { useListing } from "@/components/website-dbim/ui/useListing";
import { dbimHref } from "@/lib/website-dbim/nav";
import type { DbimCardItem } from "@/lib/website-dbim/ministry";

const searchText = (c: DbimCardItem) => `${c.title} ${c.description ?? ""}`;

/**
 * The reference's Our Division / Our Organisation grid: filter row, two columns of
 * cards each ending in the square arrow button, pager under. `variant` switches the
 * card between the division card (ink title, 12px radius) and the organisation card
 * (blue title in a tall title box, 8px radius). Spec §3–4.
 */
export function DbimCardGrid({
  items,
  variant,
  label,
}: {
  items: DbimCardItem[];
  variant: "division" | "organisation";
  /** What the cards are, for the search label and the pager, e.g. "Divisions". */
  label: string;
}) {
  const listing = useListing(items, { searchText, perPage: 10 });

  return (
    <div className="db-min-list">
      <DbimFilterBar
        search={{ value: listing.query, onChange: listing.setQuery, placeholder: "Search...", label: `Search ${label}` }}
        perPage={{ value: listing.perPage, onChange: listing.setPerPage, options: [10, 15, 20] }}
      />

      {listing.total === 0 ? (
        listing.unfilteredTotal > 0 && listing.filtered ? (
          <div className="db-min-noresults" role="status">
            <p>No results for “{listing.query.trim()}”.</p>
            <Button appearance="outlined" size="sm" onClick={listing.clear}>
              Clear Search
            </Button>
          </div>
        ) : (
          <DbimEmptyState />
        )
      ) : (
        <ul className={`db-min-grid db-min-grid--${variant}`}>
          {listing.visible.map((c) => (
            <li key={c.slug} className={`db-min-card db-min-card--${variant}`}>
              <div className="db-min-card__head">
                <h2 className="db-min-card__title">{c.title}</h2>
              </div>
              <div className="db-min-card__desc">{c.description ? <p>{c.description}</p> : null}</div>
              <div className="db-min-card__foot">
                {c.external ? (
                  <a className="db-min-arrow" href={c.href} target="_blank" rel="noopener noreferrer">
                    <Icon name="open_in_new" size={24} weight={400} aria-hidden="true" />
                    <span className="sr-only">Visit {c.title} (opens in a new tab)</span>
                  </a>
                ) : (
                  <Link className="db-min-arrow" href={dbimHref(c.href)}>
                    <Icon name="arrow_right_alt" size={24} weight={400} aria-hidden="true" />
                    <span className="sr-only">Know more about {c.title}</span>
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="db-min-pager">
        <DbimPagination page={listing.page} pageCount={listing.pageCount} onChange={listing.setPage} label={`${label} pages`} />
      </div>
    </div>
  );
}
