import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Icon } from "@mosje/design-system";
import { ContentPage } from "@/components/website-next/templates/ContentPage";
import { AlbumPhotoGrid } from "@/components/website-next/media/AlbumPhotoGrid";
import { eventDate } from "@/components/website-next/media/EventCard";
import { tidyTitle, toPhotos } from "@/components/website-next/media/albums";
import { organisationName } from "@/components/website-next/media/org-name";
import { formatDate, isoDate } from "@/components/website-next/ui/format";
import { getEvent, getEvents, routeSlug, withAssetBasePath } from "@/lib/website/content";
import { socialCard } from "@/lib/seo/social";
import "@/components/website-next/templates/media.css";

/**
 * One event, from the ingested register (`events.json`, 635 records).
 *
 * WHAT THIS REPLACED: six events whose venues, organisers and "highlights" were
 * written into this file and are not in the register. Every fact below is the
 * record's own; a field the record does not carry is not drawn. The organiser's
 * personal email and mobile number, which some records carry, are left off the
 * page: the event is over, and the Department's contact route is the Contact
 * page.
 */
export function generateStaticParams() {
  return getEvents().map((e) => ({ slug: routeSlug(e.slug) }));
}

const DEVANAGARI = /[ऀ-ॿ]/;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) return { title: "Event Not Found | Department of Social Justice & Empowerment" };
  const title = tidyTitle(event.title);
  const description = [formatDate(eventDate(event)), event.location].filter(Boolean).join(", ") || title;
  return {
    title: `${title} | Department of Social Justice & Empowerment`,
    description,
    ...socialCard({ title, description, url: `/website/events/${routeSlug(event.slug)}` }),
  };
}

function Fact({ icon, label, children }: { icon: string; label: string; children: React.ReactNode }) {
  return (
    <div className="wn-facts__row">
      <dt>
        <span className="wn-facts__icon" aria-hidden>
          <Icon name={icon} size={20} />
        </span>
        {label}
      </dt>
      <dd>{children}</dd>
    </div>
  );
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) notFound();

  const title = tidyTitle(event.title);
  const when = eventDate(event);
  const ends = event.endDate && event.endDate !== event.startDate ? event.endDate : undefined;
  const organisation = organisationName(event.organisation);
  const photos = toPhotos(event.photos ?? [], title);
  const videos = (event.videos ?? []).filter((v) => v.url);
  const docs = [
    event.pdfUrl && { href: event.pdfUrl, label: "View Document", name: title },
    event.pdfUrlHi && { href: event.pdfUrlHi, label: "View Document in Hindi", name: title },
  ].filter((d): d is { href: string; label: string; name: string } => !!d);

  return (
    <ContentPage
      title={title}
      breadcrumb={[{ label: "Media" }, { label: "Events", href: "/website/events" }, { label: title }]}
      lastUpdated={event.date}
      sidebar={
        <section className="wn-panel" aria-labelledby="event-facts">
          <h2 id="event-facts" className="wn-panel__title">
            Event Details
          </h2>
          <dl className="wn-facts">
            {when && (
              <Fact icon="calendar_month" label="Date">
                <time dateTime={isoDate(when)}>{formatDate(when)}</time>
                {ends && (
                  <>
                    {" "}to <time dateTime={isoDate(ends)}>{formatDate(ends)}</time>
                  </>
                )}
              </Fact>
            )}
            {event.location && (
              <Fact icon="location_on" label="Place">
                {event.location.replace(/\s+/g, " ").trim()}
              </Fact>
            )}
            {event.mode && (
              <Fact icon="devices" label="Mode">
                {event.mode}
              </Fact>
            )}
            {organisation && (
              <Fact icon="apartment" label="Organisation">
                {organisation}
              </Fact>
            )}
            {event.organizer && (
              <Fact icon="groups" label="Organised By">
                {event.organizer}
              </Fact>
            )}
          </dl>
        </section>
      }
    >
      {event.descriptionHtml ? (
        <div
          lang={DEVANAGARI.test(event.descriptionHtml) ? "hi" : undefined}
          dangerouslySetInnerHTML={{ __html: withAssetBasePath(event.descriptionHtml) }}
        />
      ) : null}

      {docs.length > 0 && (
        <>
          <h2>Documents</h2>
          <ul>
            {docs.map((d) => (
              <li key={d.href}>
                <a href={d.href} target="_blank" rel="noopener noreferrer" aria-label={`${d.label} (PDF): ${d.name}, opens in a new window`}>
                  {d.label} (PDF) <Icon name="open_in_new" size={16} aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </>
      )}

      {photos.length > 0 && (
        <>
          <h2>Photographs</h2>
          <AlbumPhotoGrid photos={photos} label={`Photographs of ${title}`} />
        </>
      )}

      {videos.length > 0 && (
        <>
          <h2>Videos</h2>
          <ul>
            {videos.map((v, i) => (
              <li key={v.url}>
                <a href={v.url.replace("/embed/", "/watch?v=")} target="_blank" rel="noopener noreferrer">
                  Watch Video{videos.length > 1 ? ` ${i + 1}` : ""} <Icon name="open_in_new" size={16} aria-hidden />
                  <span className="sr-only"> of {title} (opens in a new window)</span>
                </a>
              </li>
            ))}
          </ul>
        </>
      )}

      {!event.descriptionHtml && docs.length === 0 && photos.length === 0 && videos.length === 0 && (
        <p>The Department has published no further details of this event.</p>
      )}
    </ContentPage>
  );
}
