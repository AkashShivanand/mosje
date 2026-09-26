"use client";
/*
 * What's New, grouped as the reference groups it: a search field, then
 * "Documents" → one group per Documents tab (icon · name · number of folders) →
 * folder rows; then the Department's updates. One search narrows every group;
 * each group pages on its own at ten.
 */
import * as React from "react";
import { Icon } from "@mosje/design-system";
import { DbimFilterBar } from "@/components/website-dbim/ui/FilterBar";
import { DbimEmptyState } from "@/components/website-dbim/ui/EmptyState";
import { useListing } from "@/components/website-dbim/ui/useListing";
import type { DbimDocRow, DbimSeries, WhatsNewGroup } from "@/lib/website-dbim/documents";
import { DocTableHead, FileRow, FolderRow } from "./DocRows";
import { NoMatch, Pager } from "./ListStates";

const titleOf = (s: DbimSeries) => s.title;
const matches = (q: string, text: string) => !q || text.toLowerCase().includes(q);

function Group({ id, label, series }: { id: string; label: string; series: DbimSeries[] }) {
  const listing = useListing(series, { searchText: titleOf });
  const top = React.useRef<HTMLElement>(null);
  return (
    <section ref={top} aria-labelledby={id} className="db-doc--news">
      <div className="db-news__group-head">
        <Icon name="file_copy" size={24} weight={400} />
        <h3 id={id} className="db-news__h3">
          {label}
        </h3>
        <span className="db-doc__count" aria-label={`${series.length} folders`}>
          {series.length}
        </span>
      </div>
      <div role="table" aria-labelledby={id}>
        <div role="rowgroup">
          <DocTableHead columns={["Title", "Published Date", "Type/Size", ""]} />
        </div>
        <div role="rowgroup">
          {listing.visible.map((s) => (
            <FolderRow key={s.slug} series={s} layout="news" dateLabel="Published Date" />
          ))}
        </div>
      </div>
      <Pager listing={listing} target={top} />
    </section>
  );
}

export function WhatsNewList({ groups, updates }: { groups: WhatsNewGroup[]; updates: DbimDocRow[] }) {
  const [query, setQuery] = React.useState("");
  const q = query.trim().toLowerCase();
  const shown = groups
    .map((g) => ({ ...g, series: g.series.filter((s) => matches(q, s.title)) }))
    .filter((g) => g.series.length > 0);
  const shownUpdates = updates.filter((u) => matches(q, u.title));
  const nothingPublished = groups.length === 0 && updates.length === 0;
  const nothingMatched = !nothingPublished && shown.length === 0 && shownUpdates.length === 0;

  return (
    <div className="db-doc db-news">
      <DbimFilterBar search={{ value: query, onChange: setQuery, placeholder: "Search...", label: "Search What's New" }} />
      <div className="db-news__slot" />
      <hr className="db-news__rule" />
      {nothingPublished ? <DbimEmptyState /> : null}
      {nothingMatched ? <NoMatch listing={{ query, clear: () => setQuery("") }} noun="items" /> : null}
      {shown.length > 0 ? (
        <>
          <h2 className="db-news__h2">Documents</h2>
          {shown.map((g) => (
            // Keyed on the query so a narrowed group starts again at page one.
            <Group key={`${g.tab}|${q}`} id={`wn-${g.tab}`} label={g.label} series={g.series} />
          ))}
        </>
      ) : null}
      {shownUpdates.length > 0 ? (
        <section aria-labelledby="wn-updates" className="db-doc--files">
          <h2 id="wn-updates" className="db-news__h2">
            Updates
          </h2>
          <div role="table" aria-labelledby="wn-updates">
            <div role="rowgroup">
              <DocTableHead columns={["Title", "Published Date", "Type/Size"]} />
            </div>
            <div role="rowgroup">
              {shownUpdates.map((u) => (
                <FileRow key={u.key} row={u} dateLabel="Published Date" />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
