"use client";

import { useRouter } from "next/navigation";
import { Icon, Input, Select } from "@mosje/design-system";
import { dbimHref } from "@/lib/website-dbim/nav";
import { DBIM_SEARCH_SORTS, searchHref, type DbimSearchCategory, type DbimSearchSort } from "@/lib/website-dbim/search-params";
import "@/components/website-dbim/ui/ui.css";

/**
 * The search above the results, in the Filter Bar's dress (Figma: Filter Bar,
 * Filters=One Select): the query on the left, Sort on the right.
 *
 * The query is a plain GET form, so it works before any script loads. A new search
 * starts at All Results — the category belonged to the last question, not this one.
 * Sort re-orders the results in place (router.replace, no scroll), as the listing
 * pages' Sort does, so choosing it does not move the reader to a new page.
 */
export function DbimSearchForm({
  query,
  category,
  sort,
  showSort,
}: {
  query: string;
  category?: DbimSearchCategory;
  sort: DbimSearchSort;
  showSort: boolean;
}) {
  const router = useRouter();
  return (
    <div className="db-filter db-search__form">
      <form className="db-filter__lead" role="search" action={dbimHref("/search")} method="get">
        <label className="db-field db-field--search">
          <span className="db-field__icon" aria-hidden="true">
            <Icon name="search" size={24} />
          </span>
          <Input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search..."
            aria-label="Search this website"
            className="db-field__control"
            autoComplete="off"
          />
        </label>
        <button type="submit" className="sr-only">
          Search
        </button>
      </form>
      {showSort && (
        <div className="db-filter__rest db-search__sort">
          <label className="db-field db-field--sort">
            <span className="db-field__icon" aria-hidden="true">
              <Icon name="sort" size={24} />
            </span>
            <Select
              value={sort}
              aria-label="Sort results"
              className="db-field__control"
              onChange={(e) =>
                router.replace(searchHref(dbimHref("/search"), query, { category, sort: e.target.value as DbimSearchSort }), {
                  scroll: false,
                })
              }
            >
              {DBIM_SEARCH_SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </Select>
          </label>
        </div>
      )}
    </div>
  );
}
