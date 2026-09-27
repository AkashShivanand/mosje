import Image from "next/image";
import Link from "next/link";
import { Icon } from "@mosje/design-system";
import { dbimHref } from "@/lib/website-dbim/nav";
import type { DbimDashboardTile } from "@/lib/website-dbim/ministry";
import { DbimEmptyState } from "@/components/website-dbim/ui/EmptyState";

/** The reference's Our Performance grid (`.photos-card`): image, badge, title, date. Spec §5. */
export function DbimDashboardTiles({ tiles }: { tiles: DbimDashboardTile[] }) {
  return (
    <section className="db-min-perf" aria-labelledby="perf-title">
      <h2 id="perf-title" className="db-min-perf__title">
        View Performance Dashboards
      </h2>
      {tiles.length === 0 ? (
        <DbimEmptyState />
      ) : (
        <ul className="db-min-perf__grid">
          {tiles.map((t) => (
            <li key={t.title} className="db-min-tile">
              <div className="db-min-tile__media">
                <Image
                  src={t.image.src}
                  alt={t.image.alt}
                  width={630}
                  height={514}
                  sizes="(min-width: 992px) 315px, (min-width: 768px) 50vw, 100vw"
                  className={`db-min-tile__img${t.image.contain ? " db-min-tile__img--contain" : ""}`}
                />
                {t.external ? (
                  <a className="db-min-arrow db-min-tile__btn" href={t.href} target="_blank" rel="noopener noreferrer">
                    <Icon name="open_in_new" size={24} weight={400} aria-hidden="true" />
                    <span className="sr-only">Visit {t.title} (opens in a new tab)</span>
                  </a>
                ) : (
                  <Link className="db-min-arrow db-min-tile__btn" href={dbimHref(t.href)}>
                    <Icon name="arrow_right_alt" size={24} weight={400} aria-hidden="true" />
                    <span className="sr-only">Open {t.title}</span>
                  </Link>
                )}
              </div>
              <h3 className="db-min-tile__title">{t.title}</h3>
              {t.date ? <small className="db-min-ptype">{t.date}</small> : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
