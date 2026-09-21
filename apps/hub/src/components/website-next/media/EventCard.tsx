import Link from "next/link";
import { Icon } from "@mosje/design-system";
import type { EventRecord } from "@/types/website/content";
import { formatDate, isoDate } from "@/components/website-next/ui/format";
import { routeSlug } from "@/lib/website/content";
import { tidyTitle } from "./albums";
import { organisationName } from "./org-name";

const DEVANAGARI = /[ऀ-ॿ]/;

/** The date an event HAPPENED. `date` is when it was posted, which can be months later. */
export const eventDate = (e: EventRecord) => e.startDate ?? e.date;

/**
 * One event in a list: a date block, the title as the card's one link, and the
 * organisation and place where the register has them (issues LAY-07, CON-16).
 */
export function EventCard({
  event,
  headingLevel = 3,
  today,
}: {
  event: EventRecord;
  headingLevel?: 2 | 3;
  /** ISO date of the render, so "Upcoming" is decided once per page, not per card. */
  today?: string;
}) {
  const when = eventDate(event);
  const iso = isoDate(when);
  const [day, month, year] = (formatDate(when) ?? "").split(" ");
  const ends = event.endDate && event.endDate !== event.startDate ? formatDate(event.endDate) : undefined;
  const organisation = organisationName(event.organisation);
  const title = tidyTitle(event.title);
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const upcoming = !!(today && iso && iso > today);

  return (
    <li className="wn-event">
      {iso && (
        <time className="wn-event__date" dateTime={iso} aria-hidden>
          <span className="wn-event__day">{day}</span>
          <span className="wn-event__month">{month}</span>
          <span className="wn-event__year">{year}</span>
        </time>
      )}
      <div className="wn-event__body">
        {upcoming && <p className="wn-event__status">Upcoming</p>}
        <Heading className="wn-event__title" lang={DEVANAGARI.test(title) ? "hi" : undefined}>
          <Link href={`/website/events/${routeSlug(event.slug)}`} className="wn-event__link">
            {title}
          </Link>
        </Heading>
        <dl className="wn-event__meta">
          {iso && (
            // The date block above carries the start date visually; this line is
            // read by screen readers, and shown only when the event spans days.
            <div className={ends ? "wn-event__fact" : "sr-only"}>
              <dt>
                <span className="wn-event__icon" aria-hidden>
                  <Icon name="calendar_month" size={16} />
                </span>
                <span className="sr-only">Date</span>
              </dt>
              <dd>
                <time dateTime={iso}>{formatDate(when)}</time>
                {ends && <> to {ends}</>}
              </dd>
            </div>
          )}
          {organisation && (
            <div className="wn-event__fact">
              <dt>
                <span className="wn-event__icon" aria-hidden>
                  <Icon name="apartment" size={16} />
                </span>
                <span className="sr-only">Organisation</span>
              </dt>
              <dd>{organisation}</dd>
            </div>
          )}
          {event.location && (
            <div className="wn-event__fact">
              <dt>
                <span className="wn-event__icon" aria-hidden>
                  <Icon name="location_on" size={16} />
                </span>
                <span className="sr-only">Place</span>
              </dt>
              <dd>{event.location.replace(/\s+/g, " ").trim()}</dd>
            </div>
          )}
        </dl>
      </div>
    </li>
  );
}
