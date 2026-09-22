import { T } from "@/components/i18n/translation-provider";
import Link from "next/link";
import { Badge, Band, Icon, SectionTitle } from "@mosje/design-system";
import { getTenders, getVacancies } from "@/lib/website/content";
import {
  newestFirst,
  whatsNew,
  type NewsItem,
} from "@/lib/website-next/whats-new";
import { formatDate, isoDate } from "@/components/website-next/ui/format";
import {
  displayNoticeTitle,
  tidyTitle,
} from "@/components/website-next/ui/records";

type Item = NewsItem;

const DEVANAGARI = /[ऀ-ॿ]/;

/*
 * The tender register files "Hindi Pakhwada 14 September to 28 September 2024"
 * as a tender. It is an observance, and a tender list is where a supplier looks
 * for work; recorded for the Department in home-audit-2026-09-22.md.
 */
const NOT_A_TENDER = /pakhwada/i;

/* Each kind carries its own mark, so the kinds differ by shape and word, not
   by colour (status colours are reserved for status; WCAG 1.4.1). */
const KIND_ICON: Record<string, string> = {
  Update: "campaign",
  Circular: "description",
  Notice: "feed",
  Result: "fact_check",
  Announcement: "notifications",
};

function Row({ item, withKind }: { item: Item; withKind?: boolean }) {
  return (
    <li className="wn-home-news__item">
      <span className="wn-home-news__meta">
        {withKind && (
          <Badge status="primary" size="sm" className="wn-home-news__kind">
            <Icon name={KIND_ICON[item.kind] ?? "feed"} size={16} aria-hidden />
            {item.kind}
          </Badge>
        )}
        {item.date && (
          <time dateTime={isoDate(item.date)} className="wn-home-news__date">
            {formatDate(item.date)}
          </time>
        )}
        {item.org && <span className="wn-home-news__date">{item.org}</span>}
      </span>
      <Link
        href={item.href}
        className="wn-home-news__link"
        lang={DEVANAGARI.test(item.title) ? "hi" : "en"}
      >
        {item.title}
      </Link>
    </li>
  );
}

function Side({
  id,
  title,
  items,
  href,
}: {
  id: string;
  title: string;
  items: Item[];
  href: string;
}) {
  return (
    <section className="wn-home-news__side" aria-labelledby={id}>
      <h3 id={id} className="wn-home-news__side-title">
        <T>{title}</T>
      </h3>
      {items.length === 0 ? (
        <p className="wn-home-news__empty">
          <T>{`No open ${title.toLowerCase()} at present.`}</T>
        </p>
      ) : (
        <ol className="wn-home-news__list">
          {items.map((i) => (
            <Row key={i.key} item={i} />
          ))}
        </ol>
      )}
      <Link href={href} className="wn-home-more">
        <T>{`View All ${title}`}</T>
        <Icon name="arrow_forward" size={20} aria-hidden />
      </Link>
    </section>
  );
}

export function WhatsNew() {
  const news = whatsNew().slice(0, 8);
  const tenders = newestFirst(
    getTenders().filter((t) => !NOT_A_TENDER.test(t.title)),
  )
    .slice(0, 5)
    .map((t) => ({
      key: t.slug,
      kind: "Tender",
      title: displayNoticeTitle(tidyTitle(t.title)),
      href: `/website/tenders/${t.slug}`,
      date: t.date,
    }));
  // Five of each: DBIM §A.4.1 vi, "the five most recent entries in each category".
  const vacancies = newestFirst(getVacancies())
    .slice(0, 5)
    .map((v) => ({
      key: v.slug,
      kind: "Vacancy",
      title: tidyTitle(v.title),
      href: `/website/vacancies/${v.slug}`,
      date: v.date,
    }));

  return (
    <Band as="section" tone="muted" spacing="xl" aria-labelledby="news-title">
      <SectionTitle
        size="display"
        headingId="news-title"
        title={<T>What’s New</T>}
        description={
          <T>Updates, circulars, notices and results from the Department.</T>
        }
      />
      <div className="wn-home-news">
        <div className="wn-home-news__main">
          {news.length === 0 ? (
            <p className="wn-home-news__empty">
              <T>Nothing new has been published in the last twelve months.</T>
            </p>
          ) : (
            <ol className="wn-home-news__list wn-home-news__list--lead">
              {news.map((i) => (
                <Row key={i.key} item={i} withKind />
              ))}
            </ol>
          )}
          <Link href="/website/updates" className="wn-home-more">
            <T>View All Updates</T>
            <Icon name="arrow_forward" size={20} aria-hidden />
          </Link>
        </div>
        <div className="wn-home-news__aside">
          <Side
            id="news-tenders"
            title="Tenders"
            items={tenders}
            href="/website/tenders"
          />
          <Side
            id="news-vacancies"
            title="Vacancies"
            items={vacancies}
            href="/website/vacancies"
          />
        </div>
      </div>
    </Band>
  );
}
