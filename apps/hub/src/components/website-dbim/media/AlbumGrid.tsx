"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@mosje/design-system";
import { dbimHref } from "@/lib/website-dbim/nav";
import type { DbimAlbum } from "@/lib/website-dbim/media";
import { DbimFilterBar } from "@/components/website-dbim/ui/FilterBar";
import { DbimEmptyState } from "@/components/website-dbim/ui/EmptyState";
import { useListing } from "@/components/website-dbim/ui/useListing";
import { DbimNoMatch, DbimPager, describeFilters } from "@/components/website-dbim/connect/ListStates";

/** Album cards arrive with the card date already formatted, so the client does no date work. */
export type DbimAlbumCard = Omit<DbimAlbum, "photos"> & { count: number; when?: string };

const SORTS = {
  latest: { label: "Latest", compare: (a: DbimAlbumCard, b: DbimAlbumCard) => (b.date ?? "").localeCompare(a.date ?? "") },
  oldest: { label: "Oldest", compare: (a: DbimAlbumCard, b: DbimAlbumCard) => (a.date ?? "").localeCompare(b.date ?? "") },
};
const searchText = (a: DbimAlbumCard) => `${a.title} ${a.category ?? ""}`;
const categoryOf = (a: DbimAlbumCard) => a.category;

/** Media › Photos: search · Sort by · Category over the albums, three to a row, twelve to a page (the reference: four rows of three). */
export function DbimAlbumGrid({ albums }: { albums: DbimAlbumCard[] }) {
  const listing = useListing(albums, { searchText, category: categoryOf, sorts: SORTS, perPage: 12 });
  const top = React.useRef<HTMLDivElement>(null);

  return (
    <div className="db-media" ref={top}>
      <DbimFilterBar
        search={{ value: listing.query, onChange: listing.setQuery, placeholder: "Search...", label: "Search photo albums" }}
        sort={{ value: listing.sort, onChange: listing.setSort, options: listing.sortOptions, placeholder: "Sort by", label: "Sort by" }}
        category={{ value: listing.category, onChange: listing.setCategory, options: listing.categories, placeholder: "Category", label: "Category" }}
      />
      <p className="sr-only" role="status">
        {listing.total} {listing.total === 1 ? "album" : "albums"}
      </p>
      {albums.length === 0 ? (
        <DbimEmptyState />
      ) : listing.total === 0 ? (
        <DbimNoMatch
          noun="albums"
          what={describeFilters([
            listing.query.trim() && `the search “${listing.query.trim()}”`,
            listing.category && `the category “${listing.category}”`,
          ])}
          onClear={listing.clear}
        />
      ) : (
        <ul className="db-media-grid">
          {listing.visible.map((a) => (
            <li key={a.slug} className="db-media-card">
              <Link href={dbimHref(`/media/photos/${a.slug}`)} className="db-album">
                <span className="db-media-frame">
                  <Image src={a.cover} alt="" fill sizes="(min-width: 992px) 30vw, (min-width: 768px) 45vw, 100vw" className="db-media-img" />
                  <span className="db-album-arrow" aria-hidden="true">
                    <Icon name="arrow_right_alt" size={24} aria-hidden />
                  </span>
                </span>
                <span className="db-media-title">{a.title}</span>
                <span className="db-media-foot">
                  <span>{a.when}</span>
                  <span>
                    {a.count} {a.count === 1 ? "Item" : "Items"}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <DbimPager page={listing.page} pageCount={listing.pageCount} onChange={listing.setPage} target={top} />
    </div>
  );
}
