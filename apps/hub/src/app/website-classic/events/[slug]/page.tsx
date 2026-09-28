import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { SectionTitle } from "@mosje/design-system";
import { RecordDetail } from "@/components/website/templates/RecordDetail";
import { eventDate } from "@/components/website-next/media/EventCard";
import { tidyTitle } from "@/components/website-next/media/albums";
import { organisationName } from "@/components/website-next/media/org-name";
import { formatDate } from "@/components/website-next/ui/format";
import { getContentSyncedDate, getEvent, getEvents, routeSlug, withAssetBasePath } from "@/lib/website/content";
import { facts } from "@/lib/website/record-facts";
import { socialCard } from "@/lib/seo/social";

/**
 * One event, from the ingested register (`events.json`).
 *
 * WHAT THIS REPLACED: six events whose venues, organisers and "highlights" were
 * written into this file and are not in the register. Every fact below is the
 * record's own; a field the record does not carry is not drawn. The organiser's
 * personal email and mobile number, which some records carry, are left off the
 * page, as on the redesign: the Department's contact route is the Contact page.
 */
export function generateStaticParams() {
  return getEvents().map((e) => ({ slug: routeSlug(e.slug) }));
}

const DEVANAGARI = /[ऀ-ॿ]/;
const isPicture = (u?: string) => Boolean(u && /\.(jpe?g|png|webp|gif|avif)(\?|$)/i.test(u));

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

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) notFound();

  const title = tidyTitle(event.title);
  const start = formatDate(eventDate(event));
  const end = event.endDate && event.endDate !== event.startDate ? formatDate(event.endDate) : undefined;
  const photos = (event.photos ?? []).filter((p, i, all) => isPicture(p.url) && all.findIndex((q) => q.url === p.url) === i);
  const videos = (event.videos ?? []).filter((v) => v.url);

  return (
    <RecordDetail
      title={title}
      badge="Event"
      breadcrumb={[{ label: "Events & Gallery" }, { label: "Events", href: "/website/events" }, { label: title }]}
      backHref="/website/events"
      backLabel="Back to Events"
      lastUpdated={getContentSyncedDate()}
      facts={facts([
        { term: "Date", value: start && end ? `${start} to ${end}` : start },
        { term: "Place", value: event.location?.replace(/\s+/g, " ").trim() },
        { term: "Mode", value: event.mode },
        { term: "Organisation", value: organisationName(event.organisation) },
        { term: "Organised By", value: event.organizer },
      ])}
      files={[
        ...(event.pdfUrl ? [{ label: "Event Document", url: event.pdfUrl }] : []),
        ...(event.pdfUrlHi ? [{ label: "Event Document (Hindi)", url: event.pdfUrlHi }] : []),
      ]}
      sourceUrl={event.sourceUrl}
    >
      {event.descriptionHtml && (
        <div
          lang={DEVANAGARI.test(event.descriptionHtml) ? "hi" : undefined}
          dangerouslySetInnerHTML={{ __html: withAssetBasePath(event.descriptionHtml) }}
        />
      )}

      {photos.length > 0 && (
        <div>
          <SectionTitle title="Photographs" as={2} count={photos.length} />
          <ul className="sa-record-media">
            {photos.map((p) => (
              <li key={p.url} className="sa-record-media__item">
                <Image
                  src={isPicture(p.thumbnailUrl) ? p.thumbnailUrl! : p.url}
                  /* The register publishes no alternative text; the caption is used where there is one. */
                  alt={p.alt ?? p.caption ?? ""}
                  width={480}
                  height={360}
                  sizes="(min-width: 1024px) 22rem, 50vw"
                />
                {p.caption && <p className="sa-record-media__caption">{p.caption}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {videos.length > 0 && (
        <div>
          <SectionTitle title="Videos" as={2} count={videos.length} />
          <ul className="sa-record-media">
            {videos.map((v) =>
              v.kind === "youtube" ? (
                <li key={v.url} className="sa-record-media__item">
                  <iframe
                    src={v.url}
                    title={v.caption ?? title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ width: "100%", aspectRatio: "16 / 9", border: 0 }}
                  />
                </li>
              ) : (
                <li key={v.url} className="sa-record-media__item">
                  {/* The Department publishes no caption track for these files. */}
                  <video controls preload="none" poster={v.poster ?? event.imageUrl} src={v.url} />
                </li>
              ),
            )}
          </ul>
        </div>
      )}

      {!event.descriptionHtml && photos.length === 0 && videos.length === 0 && !event.pdfUrl && (
        <p>The Department has published no further details of this event.</p>
      )}
    </RecordDetail>
  );
}
