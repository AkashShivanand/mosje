"use client";

import * as React from "react";
import { Button, Icon } from "@mosje/design-system";
import type { DbimDirectoryRow } from "@/lib/website-dbim/connect";
import { DbimFilterBar } from "@/components/website-dbim/ui/FilterBar";
import { DbimEmptyState } from "@/components/website-dbim/ui/EmptyState";
import { useListing } from "@/components/website-dbim/ui/useListing";
import { DbimNoMatch, DbimPager, describeFilters } from "./ListStates";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const searchText = (r: DbimDirectoryRow) => [r.name, r.section, r.post, r.phone, r.email, r.intercom, r.address].join(" ");
const categoryOf = (r: DbimDirectoryRow) => r.section;

/**
 * Search · Category · per page, the A–Z strip, the rows and the pager.
 *
 * The letter narrows the list BEFORE the search and category do, so the three
 * combine; each is named when together they match nothing. A letter no officer's
 * name begins with (honorific removed — see `directoryLetter`) is disabled.
 */
export function DirectoryList({ rows }: { rows: DbimDirectoryRow[] }) {
  const [letter, setLetter] = React.useState("");
  const byLetter = React.useMemo(() => (letter ? rows.filter((r) => r.letter === letter) : rows), [rows, letter]);
  const listing = useListing(byLetter, { searchText, category: categoryOf, perPage: 10 });
  const top = React.useRef<HTMLDivElement>(null);

  const present = React.useMemo(() => new Set(rows.map((r) => r.letter)), [rows]);
  // Sections in the order the rows are (seniority), not A–Z.
  const sections = React.useMemo(
    () => [...new Set(rows.map((r) => r.section).filter((s): s is string => Boolean(s)))].map((s) => ({ value: s, label: s })),
    [rows],
  );

  const pick = (l: string) => {
    setLetter((cur) => (cur === l ? "" : l));
    listing.setPage(1);
  };
  const clearAll = () => {
    setLetter("");
    listing.clear();
  };

  return (
    <div className="db-dir" ref={top}>
      <DbimFilterBar
        search={{ value: listing.query, onChange: listing.setQuery, placeholder: "Search...", label: "Search the directory" }}
        category={{ value: listing.category, onChange: listing.setCategory, options: sections, placeholder: "Category", label: "Category" }}
        perPage={{ value: listing.perPage, onChange: listing.setPerPage, options: [10, 15, 20] }}
      />

      <nav className="db-dir-letters" aria-label="Filter by first letter of name">
        <ul>
          {LETTERS.map((l) => (
            <li key={l}>
              <Button
                appearance="text"
                className="db-dir-letter"
                aria-pressed={letter === l}
                disabled={!present.has(l)}
                onClick={() => pick(l)}
              >
                {l}
              </Button>
            </li>
          ))}
        </ul>
      </nav>

      <p className="sr-only" role="status">
        {listing.total} {listing.total === 1 ? "officer" : "officers"}
      </p>

      {rows.length === 0 ? (
        <DbimEmptyState />
      ) : listing.total === 0 ? (
        <DbimNoMatch
          noun="officers"
          what={describeFilters([
            listing.query.trim() && `the search “${listing.query.trim()}”`,
            letter && `the letter ${letter}`,
            listing.category && `the category “${listing.category}”`,
          ])}
          onClear={clearAll}
        />
      ) : (
        <ul className="db-dir-rows">
          {listing.visible.map((r) => (
            <DirectoryRow key={r.key} row={r} />
          ))}
        </ul>
      )}

      <DbimPager page={listing.page} pageCount={listing.pageCount} onChange={listing.setPage} target={top} />
    </div>
  );
}

function Line({ icon, label, children, className = "db-dir-line" }: { icon: string; label: string; children: React.ReactNode; className?: string }) {
  return (
    <p className={className}>
      <Icon name={icon} size={24} aria-hidden />
      <span className="sr-only">{label}: </span>
      <span>{children}</span>
    </p>
  );
}

function DirectoryRow({ row }: { row: DbimDirectoryRow }) {
  return (
    <li className="db-dir-row">
      <div className="db-dir-col">
        {row.section && <p className="db-dir-designation">{row.section}</p>}
        <p className="db-dir-name">{row.name}</p>
        {row.post && (
          <div className="db-dir-chips">
            <span className="db-dir-chip">{row.post}</span>
          </div>
        )}
      </div>
      <div className="db-dir-col">
        {row.phone && <Line icon="call" label="Telephone">{row.phone}</Line>}
        {row.email && (
          <Line icon="mail" label="Email" className="db-dir-line db-dir-line--mail">
            {row.email}
          </Line>
        )}
        {row.intercom && (
          <Line icon="deskphone" label="Intercom" className="db-dir-line db-dir-line--intercom">
            {row.intercom}
          </Line>
        )}
      </div>
      <div className="db-dir-col">
        {row.address && (
          <Line icon="location_on" label="Address" className="db-dir-line db-dir-line--address">
            {row.address}
          </Line>
        )}
      </div>
    </li>
  );
}
