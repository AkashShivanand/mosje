import Link from "next/link";
import { SectionTitle } from "@mosje/design-system";
import { getTenders, getUpdates, getVacancies } from "@/lib/website/content";
import { formatDate, isoDate } from "@/components/website-next/ui/format";
import { displayNoticeTitle } from "@/components/website-next/ui/records";

interface Row { title: string; href: string; date?: string }

const newestFirst = <T extends { date?: string }>(rows: T[]) =>
  [...rows].sort((a, b) => (Date.parse(b.date ?? "") || 0) - (Date.parse(a.date ?? "") || 0));

/** Record titles arrive in capitals, with stray punctuation (issue CON-20). */
const tidy = (t: string) => t.replace(/\s+/g, " ").replace(/[.:\s]+$/, "").trim();

function Column({ id, title, rows, viewAll }: { id: string; title: string; rows: Row[]; viewAll: string }) {
  return (
    <div className="wn-latest__col" aria-labelledby={id}>
      <h3 id={id} className="wn-latest__title">
        {title}
      </h3>
      {rows.length === 0 ? (
        <p className="wn-latest__empty">Nothing has been published here yet.</p>
      ) : (
        <ol className="wn-latest__list">
          {rows.map((r) => (
            <li key={r.href}>
              {r.date && (
                <time className="wn-latest__date" dateTime={isoDate(r.date)}>
                  {formatDate(r.date)}
                </time>
              )}
              <Link href={r.href} className="wn-latest__link">
                {r.title}
              </Link>
            </li>
          ))}
        </ol>
      )}
      <Link href={viewAll} className="wn-latest__all">
        View All {title}
      </Link>
    </div>
  );
}

/**
 * Latest Updates, Tenders and Vacancies — newest first (issue X-FR-02), dated
 * one way (CON-16), and never scrolling inside a box (NAV-13). Four of each;
 * the rest is one link away, on pages that page rather than grow.
 */
export function Latest() {
  const updates = newestFirst(getUpdates()).slice(0, 4).map((u) => ({ title: tidy(u.title), href: `/website/updates/${u.slug}`, date: u.date }));
  const tenders = newestFirst(getTenders()).slice(0, 4).map((t) => ({ title: displayNoticeTitle(tidy(t.title)), href: `/website/tenders/${t.slug}`, date: t.date }));
  const vacancies = newestFirst(getVacancies()).slice(0, 4).map((v) => ({ title: tidy(v.title), href: `/website/vacancies/${v.slug}`, date: v.date }));

  return (
    <section className="wn-section" aria-labelledby="latest-title">
      <div className="sa-container">
        <SectionTitle headingId="latest-title" title="Latest from the Department" />
        <div className="wn-latest">
          <Column id="latest-updates" title="Updates" rows={updates} viewAll="/website/updates" />
          <Column id="latest-tenders" title="Tenders" rows={tenders} viewAll="/website/tenders" />
          <Column id="latest-vacancies" title="Vacancies" rows={vacancies} viewAll="/website/vacancies" />
        </div>
      </div>
    </section>
  );
}
