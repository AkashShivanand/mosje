"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Chip,
  Icon,
  SegmentedControl,
  buttonClasses,
} from "@mosje/design-system";

import { T } from "@/components/i18n/translation-provider";

export interface NoticeRow {
  key: string;
  title: string;
  href: string;
  /** The kind, or the organisation and kind — whatever names the row. A
      register that publishes no date for a row carries none. */
  meta?: string;
  /** Shown beside `meta` where the row carries a date of its own. */
  date?: string;
  dateTime?: string;
}

export interface PersonaBlock {
  id: string;
  label: string;
  sub: string;
  art?: string;
  portal?: { label: string; href: string; blurb: string; tel?: boolean };
  schemes: {
    id: string;
    name: string;
    provides: string;
    kind: string;
    href: string;
  }[];
}

type Tab = "schemes" | "vacancies" | "tenders";

/* NO ICONS ON THE TABS, though the design draws one on each. `SegmentedOption`
   is `{ label, value }` and nothing else; passing an `icon` it does not declare
   renders nothing and reads, in the source, as a feature that exists. The
   control wants an optional icon before this can carry them. */
const TABS = [
  { value: "schemes" as const, label: "Schemes" },
  { value: "vacancies" as const, label: "Vacancies" },
  { value: "tenders" as const, label: "Tenders" },
];

const VIEW_ALL: Record<Tab, { label: string; href: string }> = {
  schemes: { label: "View All Schemes", href: "/website/schemes-services" },
  vacancies: { label: "View All Vacancies", href: "/website/vacancies" },
  tenders: { label: "View All Tenders", href: "/website/tenders" },
};

/**
 * The switching half of Our Offerings.
 *
 * It holds two pieces of state and nothing else: which tab is open, and which
 * group the schemes tab is showing. Every list it renders was built on the
 * server — see `Offerings.tsx` for why.
 *
 * THE CHIPS ARE A SINGLE CHOICE, and the `Chip` toggle is what the estate uses
 * for a filter row. Clicking the chosen group again does not clear it: there is
 * no "all groups" state to return to, and a list of every scheme is the finder,
 * one click away in the header.
 *
 * WHAT'S NEW DOES NOT MOVE. The design draws it as a scrolling list with a
 * pause control; this renders the six most recent and a link to the rest. An
 * auto-scrolling list takes the sentence away from whoever reads slowest, and a
 * scroll region inside a card catches a phone flick and moves the list instead
 * of the page (`data-state-completeness.md` §4). Nothing moves, so there is
 * nothing to pause.
 */
export function OfferingsExplorer({
  personas,
  tenders,
  vacancies,
  news,
}: {
  personas: PersonaBlock[];
  tenders: NoticeRow[];
  vacancies: NoticeRow[];
  news: NoticeRow[];
}) {
  const [tab, setTab] = React.useState<Tab>("schemes");
  const [who, setWho] = React.useState(personas[0]?.id ?? "");
  const persona = personas.find((p) => p.id === who) ?? personas[0];
  const all = VIEW_ALL[tab];

  return (
    <div className="wn-off">
      <div className="wn-off__main">
        <div className="wn-off__bar">
          <SegmentedControl
            ariaLabel="What to show"
            value={tab}
            onChange={setTab}
            options={TABS}
          />
          <Link href={all.href} className="wn-home-more">
            <T>{all.label}</T>
            <Icon name="arrow_forward" size={20} aria-hidden />
          </Link>
        </div>

        {tab === "schemes" && persona && (
          <>
            <ul className="wn-off__chips">
              {personas.map((p) => (
                <li key={p.id}>
                  <Chip
                    size="md"
                    selected={p.id === who}
                    onSelectedChange={() => setWho(p.id)}
                  >
                    <T>{p.label}</T>
                  </Chip>
                </li>
              ))}
            </ul>

            <div className="wn-off__panel">
              <div className="wn-off__who">
                {persona.art && (
                  <Image src={persona.art} alt="" width={64} height={64} />
                )}
                <div>
                  <h3 className="wn-off__who-name">
                    <T>{persona.label}</T>
                  </h3>
                  <p className="wn-off__who-sub">
                    <T>{persona.sub}</T>
                  </p>
                </div>
              </div>

              {persona.portal && (
                <div className="wn-off__portal">
                  <div>
                    <p className="wn-off__portal-name">{persona.portal.label}</p>
                    <p className="wn-off__portal-blurb">
                      <T>{persona.portal.blurb}</T>
                    </p>
                  </div>
                  {persona.portal.tel ? (
                    <a
                      href={persona.portal.href}
                      className={buttonClasses("primary", "filled", "md")}
                    >
                      <Icon name="call" size={16} aria-hidden />
                      <T>{`Call ${persona.portal.label}`}</T>
                    </a>
                  ) : (
                    <a
                      href={persona.portal.href}
                      className={buttonClasses("primary", "filled", "md")}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <T>Apply Now</T>
                      <Icon name="open_in_new" size={16} aria-hidden />
                    </a>
                  )}
                </div>
              )}

              <ul className="wn-off__schemes">
                {persona.schemes.map((s) => (
                  <li key={s.id} className="wn-off__scheme">
                    <div>
                      <p className="wn-off__scheme-kind">
                        <T>{s.kind}</T>
                      </p>
                      <h4 className="wn-off__scheme-name">
                        <Link href={s.href}>{s.name}</Link>
                      </h4>
                      <p className="wn-off__scheme-provides">{s.provides}</p>
                    </div>
                    <Link href={s.href} className="wn-home-more">
                      <T>View Details</T>
                    </Link>
                  </li>
                ))}
              </ul>

              <Link
                href={`/website/schemes-services?who=${persona.id}`}
                className="wn-home-more wn-off__all"
              >
                <T>{`View All Schemes for ${persona.label}`}</T>
                <Icon name="arrow_forward" size={20} aria-hidden />
              </Link>
            </div>
          </>
        )}

        {tab !== "schemes" && (
          <ol className="wn-off__notices">
            {(tab === "tenders" ? tenders : vacancies).map((n) => (
              <li key={n.key}>
                <Link href={n.href} className="wn-off__notice">
                  <span className="wn-off__notice-title">{n.title}</span>
                  <time dateTime={n.dateTime} className="wn-off__notice-meta">
                    {n.meta}
                  </time>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </div>

      <section className="wn-off__news" aria-labelledby="news-title">
        <div className="wn-off__news-head">
          <h3 id="news-title" className="wn-off__news-title">
            <Icon name="campaign" size={24} aria-hidden />
            <T>What&rsquo;s New</T>
          </h3>
          <Link href="/website/updates" className="wn-off__news-all">
            <T>View All</T>
          </Link>
        </div>
        <ol className="wn-off__news-list">
          {news.map((n) => (
            <li key={n.key}>
              <Link href={n.href} className="wn-off__news-link">
                {n.title}
              </Link>
              <p className="wn-off__news-meta">
                {n.meta}
                {n.date && (
                  <>
                    {" · "}
                    <time dateTime={n.dateTime}>{n.date}</time>
                  </>
                )}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
