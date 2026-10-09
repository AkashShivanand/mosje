"use client";

import { DbimFilterBar } from "@/components/website-dbim/ui/FilterBar";
import { DbimPagination } from "@/components/website-dbim/ui/Pagination";
import { DbimEmptyState } from "@/components/website-dbim/ui/EmptyState";
import { useListing } from "@/components/website-dbim/ui/useListing";
import type { DbimLinkRow as Row } from "@/lib/website-dbim/utility";
import { DbimLinkGroup } from "./LinkGroup";
import { DbimLinkRow } from "./LinkRow";
import { DbimFilteredEmpty } from "./FilteredEmpty";

export interface DbimLinkListProps {
  rows: Row[];
  /** The search field's placeholder, e.g. "Search Related Links". */
  searchLabel: string;
  /** Offer the "10 per page" select (Important Links does, Related Links does not). */
  perPage?: boolean;
  /** Accessible name of the list. */
  label: string;
  /** 24px between the search and the list (Related Links) instead of 10px. */
  spaced?: boolean;
}

/** A row's own words and, for a group, its links' — so a search finds a division by its pages. */
const searchText = (r: Row) => [r.label, ...(r.links ?? []).map((l) => l.label)].join(" ");

/**
 * Related Links and Important Links: the reference's filter bar over a list of link
 * rows, paged at 10. A row with `links` is a group (a division) that opens to show
 * them. Every state is drawn — nothing published, the reader's search matched nothing
 * (named, with a way to clear it), and more than a page. While a search is narrowing
 * the list, a group that matched on its links opens and shows only those.
 */
export function DbimLinkList({ rows, searchLabel, perPage = false, label, spaced = false }: DbimLinkListProps) {
  const list = useListing(rows, { searchText });
  const q = list.query.trim().toLowerCase();

  if (list.unfilteredTotal === 0) return <DbimEmptyState />;

  return (
    <div className={spaced ? "db-u-list db-u-list--spaced" : "db-u-list"}>
      <DbimFilterBar
        search={{ value: list.query, onChange: list.setQuery, placeholder: searchLabel, label: searchLabel }}
        perPage={perPage ? { value: list.perPage, onChange: list.setPerPage, options: [10, 15, 20] } : undefined}
      />
      <p className="sr-only" role="status" aria-live="polite">
        {list.filtered ? `${list.total} of ${list.unfilteredTotal} links shown` : ""}
      </p>
      {list.total === 0 ? (
        <DbimFilteredEmpty query={list.query} noun="links" onClear={list.clear} />
      ) : (
        <ul className="db-u-rows" aria-label={label}>
          {list.visible.map((r) =>
            r.links ? (
              <DbimLinkGroup
                // Remounted when a search starts or ends, so the disclosure follows it.
                key={`${r.label}-${q ? "q" : ""}`}
                label={r.label}
                links={!q || r.label.toLowerCase().includes(q) ? r.links : r.links.filter((l) => l.label.toLowerCase().includes(q))}
                open={!!q}
              />
            ) : (
              <DbimLinkRow key={r.label} label={r.label} path={r.path} href={r.href} />
            ),
          )}
        </ul>
      )}
      <DbimPagination page={list.page} pageCount={list.pageCount} onChange={list.setPage} label={`${label} pages`} />
    </div>
  );
}
