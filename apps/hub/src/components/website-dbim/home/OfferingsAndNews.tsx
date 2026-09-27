import Link from "next/link";
import { Icon } from "@mosje/design-system";

import { DbimSectionHeading } from "@/components/website-dbim/ui/SectionHeading";
import { DbimViewMore } from "@/components/website-dbim/ui/ViewMore";
import { DbimEmptyState } from "@/components/website-dbim/ui/EmptyState";
import {
  dbimHomeNews, dbimKeySchemes, dbimKeyVacancies, type DbimHomeLink,
} from "@/lib/website-dbim/home-mid";
import { OfferingsTabs } from "./OfferingsTabs";
import "./home-mid.css";

/** The chevron follows the section's breakpoint size (24px, 16px on a phone). */
const CHEV = { fontSize: "var(--db-hm-chev)" } as const;

/**
 * Home — Key Offerings (tabs: Schemes and Services | Vacancies) beside What's New,
 * on the reference's grey band (`.whats-new-container`). Spec:
 * docs/research/dbim-reference/components/home-mid.spec.md §1.
 */
export function DbimOfferingsAndNews() {
  const schemes = dbimKeySchemes();
  const vacancies = dbimKeyVacancies();
  const news = dbimHomeNews();

  return (
    <section className="db-hm db-hm-offer" aria-labelledby="db-hm-offerings db-hm-news">
      <div className="db-hm-offer__row">
        <div className="db-hm-offer__main">
          <div className="db-hm-head">
            <DbimSectionHeading icon="offerings" title="Key Offerings" id="db-hm-offerings" />
          </div>
          <OfferingsTabs
            tabs={[
              {
                id: "schemes",
                label: "Schemes and Services",
                panel: <OfferingPanel rows={schemes} path="/offerings" more="View more schemes and services" />,
              },
              {
                id: "vacancies",
                label: "Vacancies",
                panel: <OfferingPanel rows={vacancies} path="/offerings/vacancies" more="View more vacancies" />,
              },
            ]}
          />
        </div>

        <div className="db-hm-offer__side">
          <div className="db-hm-head">
            <DbimSectionHeading icon="whats-new" title="What’s New" id="db-hm-news" />
          </div>
          <div className="db-hm-news">
            {news.length ? (
              <ul className="db-hm-news__list">
                {news.map((n) => (
                  <NewsItem key={n.key} item={n} />
                ))}
              </ul>
            ) : (
              <DbimEmptyState />
            )}
          </div>
          <div className="db-hm-more">
            <DbimViewMore path="/whats-new" ariaLabel="View more of what’s new" />
          </div>
        </div>
      </div>
    </section>
  );
}

function OfferingPanel({ rows, path, more }: { rows: DbimHomeLink[]; path: string; more: string }) {
  return (
    <>
      <div className="db-hm-list">
        {rows.length ? (
          <ul className="db-hm-list__rows">
            {rows.map((r) => (
              <li key={r.key} className="db-hm-list__row">
                <Link href={r.href} className="db-hm-list__link">
                  <span className="db-hm-list__title">{r.title}</span>
                  <span className="db-hm-list__chev">
                    <Icon name="arrow_forward_ios" size={24} weight={400} style={CHEV} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <DbimEmptyState />
        )}
      </div>
      <div className="db-hm-more">
        <DbimViewMore path={path} ariaLabel={more} />
      </div>
    </>
  );
}

function NewsItem({ item }: { item: DbimHomeLink }) {
  const body = (
    <>
      <span className="db-hm-news__title">{item.title}</span>
      <Icon name={item.external ? "open_in_new" : "arrow_forward_ios"} size={16} weight={400} />
      {item.external && <span className="ds-sr-only"> (opens in a new tab)</span>}
    </>
  );
  // Every item opens a file or another site, never a route, so it is a plain anchor.
  return (
    <li className="db-hm-news__item">
      <a
        href={item.href}
        className="db-hm-news__link"
        {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {body}
      </a>
    </li>
  );
}
