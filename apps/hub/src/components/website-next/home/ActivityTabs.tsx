"use client";

import * as React from "react";
import Link from "next/link";
import { Icon, SegmentedControl } from "@mosje/design-system";

import { T } from "@/components/i18n/translation-provider";

export interface ActivityRow {
  key: string;
  title: string;
  href: string;
  /** The day of the month, on its own — "31". */
  day: string;
  /** The rest of the date under it — "Jul 2026". */
  month: string;
  dateTime?: string;
  /** Who published it, where the register says. */
  org?: string;
  /** "hi" where the register publishes the title in Devanagari (ACC). */
  lang?: string;
}

export type ActivityTab = "events" | "press" | "circulars";

const TABS = [
  { value: "events" as const, label: "Events" },
  { value: "press" as const, label: "Press Releases" },
  { value: "circulars" as const, label: "Circulars" },
];

const VIEW_ALL: Record<ActivityTab, { label: string; href: string }> = {
  events: { label: "View All Events", href: "/website/events" },
  press: { label: "View All Press Releases", href: "/website/gallery" },
  circulars: {
    label: "View All Circulars",
    href: "/website/circulars-notifications",
  },
};

const EMPTY: Record<ActivityTab, string> = {
  events: "No events have been published yet.",
  press: "No press releases have been published yet.",
  circulars: "No circulars have been published yet.",
};

/**
 * The switching half of Activity Corner: three registers, one at a time.
 *
 * Every row is built on the server (see `Activity.tsx`) — the event register
 * alone is 635 records, and none of it belongs in the bundle of a reader who
 * never opens the second tab.
 *
 * NO DESCRIPTION ON A CARD, though the design draws two lines of one under
 * every title. Not one of the three registers publishes a description: an
 * event carries a title, a date, a venue and a mode; a press item a title, a
 * date and a picture; a circular a title, a date and a file. A sentence we
 * wrote about a document we have not read is not something a government page
 * may carry, so the card shows the date, the title and who published it.
 */
export function ActivityTabs({
  events,
  press,
  circulars,
}: {
  events: ActivityRow[];
  press: ActivityRow[];
  circulars: ActivityRow[];
}) {
  const [tab, setTab] = React.useState<ActivityTab>("events");
  const rows = tab === "events" ? events : tab === "press" ? press : circulars;
  const all = VIEW_ALL[tab];

  return (
    <div className="wn-act">
      <div className="wn-act__bar">
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

      {rows.length === 0 ? (
        <p className="wn-home-news__empty">
          <T>{EMPTY[tab]}</T>
        </p>
      ) : (
        <ul className="wn-act__list">
          {rows.map((r) => (
            <li key={r.key} className="wn-act__item">
              {/* The date reads as a date: the day on its own line, the month
                  and year under it, as the design draws it. One <time> so it
                  is announced and parsed as one date rather than as two. */}
              <time className="wn-act__date" dateTime={r.dateTime}>
                <span className="wn-act__day">{r.day}</span>
                <span className="wn-act__month">{r.month}</span>
              </time>
              <div className="wn-act__body">
                <h3 className="wn-act__title" lang={r.lang}>
                  <Link href={r.href}>{r.title}</Link>
                </h3>
                {r.org && <p className="wn-act__org">{r.org}</p>}
              </div>
              <Link href={r.href} className="wn-home-more wn-act__more">
                <T>Read More</T>
                <Icon name="arrow_forward" size={20} aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
