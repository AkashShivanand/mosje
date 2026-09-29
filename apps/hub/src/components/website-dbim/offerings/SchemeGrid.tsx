"use client";

import { DbimFilterBar } from "@/components/website-dbim/ui/FilterBar";
import { useListing } from "@/components/website-dbim/ui/useListing";
import type { DbimSchemeCard as Card } from "@/lib/website-dbim/offerings";
import { DbimSchemeCard } from "./SchemeCard";
import { DbimListEmpty, DbimListFooter } from "./ListParts";

const searchText = (c: Card) => `${c.name} ${c.line} ${c.categories.join(" ")}`;
const categoriesOf = (c: Card) => c.categories;

/** Schemes and Services: search · Category (the live groups, in the live order) · per page over a two-column grid, paged. */
export function DbimSchemeGrid({ cards, groups }: { cards: Card[]; groups: readonly string[] }) {
  const listing = useListing(cards, { searchText, category: categoriesOf, categoryOrder: groups, perPage: 10 });
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
