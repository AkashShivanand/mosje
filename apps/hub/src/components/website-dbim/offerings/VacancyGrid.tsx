"use client";

import { Icon } from "@mosje/design-system";
import { DbimFilterBar } from "@/components/website-dbim/ui/FilterBar";
import { useListing } from "@/components/website-dbim/ui/useListing";
import type { DbimNotice } from "@/lib/website-dbim/offerings";
import { DbimListEmpty, DbimListFooter } from "./ListParts";

const searchText = (v: DbimNotice) => v.title;
const categoryOf = (v: DbimNotice) => v.category;

/**
 * The reference's four date rows. Only the ones the register gives a value are
 * printed: a missing date prints nothing (the register publishes the Published
 * Date alone, so today that is the one row).
 */
const DATE_ROWS: { key: "published"; label: string; icon: string }[] = [
  { key: "published", label: "Published Date", icon: "list_alt" },
];

function VacancyCard({ v }: { v: DbimNotice }) {
  const dates = DATE_ROWS.filter((r) => v[r.key]);
  return (
    <article className="db-vac-card">
      <h2 className="db-vac-card__title">
        <span>{v.title}</span>
      </h2>
      {dates.length ? (
        <dl className="db-vac-card__dates">
          {dates.map((r) => (
            <div key={r.key} className="db-vac-card__date">
              <dt>
                <Icon name={r.icon} size={24} weight={400} />
                <span>{r.label}</span>
              </dt>
              <dd>{v[r.key]}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      <div className="db-vac-card__docs">
        {v.fileUrl ? (
          <a className="db-vac-card__file" href={v.fileUrl} target="_blank" rel="noopener noreferrer">
            {v.title}
            <span className="sr-only"> ({v.fileType ?? "document"}, opens in a new tab)</span>
          </a>
        ) : null}
        <a className="db-vac-card__all" href={v.sourceUrl} target="_blank" rel="noopener noreferrer">
          View All Documents
          <span className="sr-only"> for {v.title} (opens in a new tab)</span>
        </a>
      </div>
    </article>
  );
}

/** Vacancies: search (and Category where the register gives two or more) over a three-column grid, paged. */
export function DbimVacancyGrid({ vacancies }: { vacancies: DbimNotice[] }) {
  const listing = useListing(vacancies, { searchText, category: categoryOf, perPage: 9 });
  return (
    <div className="db-off">
      <DbimFilterBar
        search={{ value: listing.query, onChange: listing.setQuery, placeholder: "Search...", label: "Search vacancies" }}
        category={
          listing.categories.length > 1
            ? { value: listing.category, onChange: listing.setCategory, options: listing.categories, placeholder: "Category", label: "Category" }
            : undefined
        }
      />
      <DbimListEmpty listing={listing} />
      {listing.visible.length > 0 ? (
        <ul className="db-vac-grid" aria-label="Vacancies">
          {listing.visible.map((v) => (
            <li key={v.slug}>
              <VacancyCard v={v} />
            </li>
          ))}
        </ul>
      ) : null}
      <DbimListFooter listing={listing} archive="/archives/vacancies" label="Vacancies pages" />
    </div>
  );
}
