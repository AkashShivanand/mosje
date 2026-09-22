import Link from "next/link";
import { Icon, SectionTitle } from "@mosje/design-system";
import { getAllDocuments, getTenders, getUpdates, getVacancies, routeSlug } from "@/lib/website/content";
import { formatDate, isoDate } from "@/components/website-next/ui/format";
import { organisationName } from "@/components/website-next/media/org-name";
import { dateValue, displayNoticeTitle, isArchived, tidyTitle } from "@/components/website-next/ui/records";

interface Item { key: string; kind: string; title: string; href: string; date?: string; org?: string }

const DEVANAGARI = /[ऀ-ॿ]/;
const newestFirst = <T extends { date?: string }>(rows: T[]) => [...rows].sort((a, b) => dateValue(b.date) - dateValue(a.date));

/**
 * What's New, as the live home page composes it: updates, circulars, notices,
 * results and announcements in one feed, newest first (issue X-FR-02). Only the
 * last twelve months: the update register also holds 2020–2024 news clippings,
 * which are archive, not news (GIGW archival policy; `isArchived`).
 */
const NEWS_TYPES: Record<string, string> = {
  "Circulars & Notifications": "Circular",
  Notice: "Notice",
  Results: "Result",
  Announcement: "Announcement",
};

function whatsNew(): Item[] {
  const updates: Item[] = getUpdates()
    .filter((u) => !isArchived(u.date))
    .map((u) => ({ key: `u-${u.slug}`, kind: "Update", title: tidyTitle(u.title), href: `/website/updates/${u.slug}`, date: u.date }));
  const docs: Item[] = getAllDocuments()
    .filter((d) => d.category && d.category in NEWS_TYPES && !isArchived(d.date))
    .map((d) => ({
      key: `d-${d.slug}`,
      kind: NEWS_TYPES[d.category as string] ?? "Notice",
      title: tidyTitle(d.title),
      href: `/website/documents/${routeSlug(d.slug)}`,
      date: d.date,
      // Who issued it: "FAQs" from NHAA says nothing without its issuer.
      org: d.organisation && d.organisation !== "MoSJE" ? organisationName(d.organisation) : undefined,
    }));
  // One notice posted twice under two headings (an Announcement and a
  // Circular, one with typos) is one item: kept once, the newer post.
  const kept: { words: Set<string> }[] = [];
  return newestFirst([...updates, ...docs]).filter((i) => {
    const words = new Set(i.title.toLowerCase().match(/[a-z0-9]{3,}/g) ?? []);
    const dup = kept.some((k) => {
      let shared = 0;
      words.forEach((w) => k.words.has(w) && shared++);
      return shared / Math.max(1, new Set([...words, ...k.words]).size) >= 0.7;
    });
    if (dup) return false;
    kept.push({ words });
    return true;
  });
}

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
          <span className="wn-home-news__kind">
            <Icon name={KIND_ICON[item.kind] ?? "feed"} size={16} aria-hidden />
            {item.kind}
          </span>
        )}
        {item.date && (
          <time dateTime={isoDate(item.date)} className="wn-home-news__date">
            {formatDate(item.date)}
          </time>
        )}
        {item.org && <span className="wn-home-news__date">{item.org}</span>}
      </span>
      <Link href={item.href} className="wn-home-news__link" lang={DEVANAGARI.test(item.title) ? "hi" : undefined}>
        {item.title}
      </Link>
    </li>
  );
}

function Side({ id, title, items, href }: { id: string; title: string; items: Item[]; href: string }) {
  return (
    <section className="wn-home-news__side" aria-labelledby={id}>
      <h3 id={id} className="wn-home-news__side-title">
        {title}
      </h3>
      {items.length === 0 ? (
        <p className="wn-home-news__empty">No open {title.toLowerCase()} at present.</p>
      ) : (
        <ol className="wn-home-news__list">
          {items.map((i) => (
            <Row key={i.key} item={i} />
          ))}
        </ol>
      )}
      <Link href={href} className="wn-home-more">
        View All {title}
        <Icon name="arrow_forward" size={20} aria-hidden />
      </Link>
    </section>
  );
}

export function WhatsNew() {
  const news = whatsNew().slice(0, 6);
  const tenders = newestFirst(getTenders().filter((t) => !NOT_A_TENDER.test(t.title)))
    .slice(0, 3)
    .map((t) => ({ key: t.slug, kind: "Tender", title: displayNoticeTitle(tidyTitle(t.title)), href: `/website/tenders/${t.slug}`, date: t.date }));
  const vacancies = newestFirst(getVacancies())
    .slice(0, 3)
    .map((v) => ({ key: v.slug, kind: "Vacancy", title: tidyTitle(v.title), href: `/website/vacancies/${v.slug}`, date: v.date }));

  return (
    <section className="wn-home-band" aria-labelledby="news-title">
      <div className="sa-container">
        <SectionTitle size="display" headingId="news-title" title="What’s New" description="Updates, circulars, notices and results from the Department." />
        <div className="wn-home-news">
          <div className="wn-home-news__main">
            {news.length === 0 ? (
              <p className="wn-home-news__empty">Nothing new has been published in the last twelve months.</p>
            ) : (
              <ol className="wn-home-news__list wn-home-news__list--lead">
                {news.map((i) => (
                  <Row key={i.key} item={i} withKind />
                ))}
              </ol>
            )}
            <Link href="/website/updates" className="wn-home-more">
              View All Updates
              <Icon name="arrow_forward" size={20} aria-hidden />
            </Link>
          </div>
          <div className="wn-home-news__aside">
            <Side id="news-tenders" title="Tenders" items={tenders} href="/website/tenders" />
            <Side id="news-vacancies" title="Vacancies" items={vacancies} href="/website/vacancies" />
          </div>
        </div>
      </div>
    </section>
  );
}
