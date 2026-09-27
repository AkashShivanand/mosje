"use client";

import { DbimFilterBar } from "@/components/website-dbim/ui/FilterBar";
import { useListing } from "@/components/website-dbim/ui/useListing";
import type { DbimSchemeCard as Card } from "@/lib/website-dbim/offerings";
import { DbimSchemeCard } from "./SchemeCard";
import { DbimListEmpty, DbimListFooter } from "./ListParts";

const searchText = (c: Card) => `${c.name} ${c.line} ${c.category}`;
const categoryOf = (c: Card) => c.category;

/** Schemes and Services: search · Category · per page over a two-column grid, paged. */
export function DbimSchemeGrid({ cards }: { cards: Card[] }) {
  const listing = useListing(cards, { searchText, category: categoryOf, perPage: 10 });
  return (
    <div className="db-off">
      <DbimFilterBar
        search={{ value: listing.query, onChange: listing.setQuery, placeholder: "Search...", label: "Search schemes and services" }}
        category={{
          value: listing.category,
          onChange: listing.setCategory,
          options: listing.categories,
          placeholder: "Category",
          label: "Category",
        }}
        perPage={{ value: listing.perPage, onChange: listing.setPerPage, options: [10, 15, 20] }}
      />
      <DbimListEmpty listing={listing} />
      {listing.visible.length > 0 ? (
        <ul className="db-scheme-grid" aria-label="Schemes and services">
          {listing.visible.map((c, i) => (
            <li key={c.id}>
              <DbimSchemeCard card={c} priority={listing.page === 1 && i < 2} />
            </li>
          ))}
        </ul>
      ) : null}
      <DbimListFooter listing={listing} label="Schemes and services pages" />
    </div>
  );
}
