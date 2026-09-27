import Link from "next/link";
import { Icon } from "@mosje/design-system";

import { DbimSectionHeading } from "@/components/website-dbim/ui/SectionHeading";
import { DbimViewMore } from "@/components/website-dbim/ui/ViewMore";
import { DbimEmptyState } from "@/components/website-dbim/ui/EmptyState";
import {
  DBIM_HOME_PERSONAS, dbimHomeImportantLinks, dbimRecentDocuments,
} from "@/lib/website-dbim/home-mid";
import { PersonaCarousel } from "./PersonaCarousel";
import "./home-mid.css";

/** The chevron follows the section's breakpoint size (24px, 16px on a phone). */
const CHEV = { fontSize: "var(--db-hm-chev)" } as const;

/**
 * Home — Recent Documents (2×2 cards), Explore User Personas (carousel) and Important
 * Links, on the reference's white `.layoutshift` band. Spec:
 * docs/research/dbim-reference/components/home-mid.spec.md §2.
 */
export function DbimDocumentsRow() {
  const docs = dbimRecentDocuments();
  const links = dbimHomeImportantLinks();

  return (
    <section className="db-hm db-hm-docs" aria-label="Recent Documents, User Personas and Important Links">
      <div className="db-hm-docs__row">
        <div className="db-hm-docs__col db-hm-docs__col--docs">
          <div className="db-hm-head">
            <DbimSectionHeading icon="documents" title="Recent Documents" />
          </div>
          {docs.length ? (
            <ul className="db-hm-cards">
              {docs.map((d) => (
                <li key={d.key} className="db-hm-cards__item">
                  <Link href={d.href} className="db-hm-card">
                    <span className="db-hm-card__cat">{d.category}</span>
                    <span className="db-hm-card__title">{d.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <DbimEmptyState />
          )}
          <div className="db-hm-more db-hm-more--docs">
            <DbimViewMore path="/documents" size="sm" ariaLabel="View more documents" />
          </div>
        </div>

        <div className="db-hm-docs__col db-hm-docs__col--personas">
          <div className="db-hm-head db-hm-head--center">
            <DbimSectionHeading icon="personas" title="Explore User Personas" />
          </div>
          {DBIM_HOME_PERSONAS.length ? <PersonaCarousel slides={DBIM_HOME_PERSONAS} /> : <DbimEmptyState />}
        </div>

        <div className="db-hm-docs__col db-hm-docs__col--links">
          <div className="db-hm-head">
            <DbimSectionHeading icon="important-links" title="Important Links" />
          </div>
          {links.length ? (
            <ul className="db-hm-links">
              {links.map((l) => (
                <li key={l.key} className="db-hm-links__item">
                  <Link href={l.href} className="db-hm-links__link">
                    <span>{l.title}</span>
                    <Icon name="arrow_forward_ios" size={24} weight={400} style={CHEV} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <DbimEmptyState />
          )}
          <div className="db-hm-more">
            <DbimViewMore path="/important-links" ariaLabel="View more important links" />
          </div>
        </div>
      </div>
    </section>
  );
}
