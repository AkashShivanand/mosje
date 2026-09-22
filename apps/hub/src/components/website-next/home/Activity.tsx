import { T } from "@/components/i18n/translation-provider";
import Link from "next/link";
import { Band, Icon, SectionTitle } from "@mosje/design-system";
import { getEvents, getGalleryItems } from "@/lib/website/content";
import {
  EventCard,
  EventGroupCard,
} from "@/components/website-next/media/EventCard";
import { groupEvents } from "@/components/website-next/media/event-groups";
import { AlbumCard } from "@/components/website-next/media/AlbumCard";
import { deriveAlbums } from "@/components/website-next/media/albums";
import "@/components/website-next/templates/media.css";

/**
 * Activity Corner, as the live home page carries it: events, and press and
 * photographs. Both halves are shown at once rather than behind tabs, so a
 * reader sees what happened without having to ask for it.
 *
 * Events are those already held (an upcoming one is on the Events page), with
 * repeat posts of one programme drawn as one card (CON-15). Albums are the
 * newest with a photograph, press clippings and photographs together.
 */
export function Activity() {
  const today = new Date().toISOString().slice(0, 10);
  const events = groupEvents(getEvents())
    .filter((e) => e.latest && e.latest.slice(0, 10) <= today)
    .sort((a, b) => (b.latest ?? "").localeCompare(a.latest ?? ""))
    .slice(0, 4);
  const albums = deriveAlbums(getGalleryItems())
    .filter((a) => a.cover && (a.kind === "Photos" || a.kind === "News"))
    .slice(0, 4);

  return (
    <Band
      as="section"
      tone="muted"
      spacing="xl"
      aria-labelledby="activity-title"
    >
      <SectionTitle
        size="display"
        headingId="activity-title"
        title={<T>Events and Media</T>}
        description={
          <T>
            Recent events, press coverage and photographs of the Department and
            its organisations.
          </T>
        }
      />
      <div className="wn-home-activity">
        <section
          className="wn-home-activity__col"
          aria-labelledby="activity-events"
        >
          <h3 id="activity-events" className="wn-home-activity__title">
            <T>Events</T>
          </h3>
          {events.length === 0 ? (
            <p className="wn-home-news__empty">
              <T>No events have been published yet.</T>
            </p>
          ) : (
            <ul className="wn-events wn-home-activity__events">
              {events.map((entry) =>
                entry.events.length > 1 ? (
                  <EventGroupCard
                    key={entry.key}
                    events={entry.events}
                    headingLevel={3}
                    today={today}
                  />
                ) : (
                  <EventCard
                    key={entry.key}
                    event={entry.events[0]!}
                    headingLevel={3}
                    today={today}
                  />
                ),
              )}
            </ul>
          )}
          <Link href="/website/events" className="wn-home-more">
            <T>View All Events</T>
            <Icon name="arrow_forward" size={20} aria-hidden />
          </Link>
        </section>
        <section
          className="wn-home-activity__col"
          aria-labelledby="activity-media"
        >
          <h3 id="activity-media" className="wn-home-activity__title">
            <T>Press and Photographs</T>
          </h3>
          {albums.length === 0 ? (
            <p className="wn-home-news__empty">
              <T>No photographs have been published yet.</T>
            </p>
          ) : (
            <ul className="wn-albums wn-home-activity__albums">
              {albums.map((a) => (
                <AlbumCard key={a.key} album={a} headingLevel={3} />
              ))}
            </ul>
          )}
          <Link href="/website/gallery" className="wn-home-more">
            <T>View Gallery</T>
            <Icon name="arrow_forward" size={20} aria-hidden />
          </Link>
        </section>
      </div>
    </Band>
  );
}
