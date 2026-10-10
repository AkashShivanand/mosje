import type { Metadata } from "next";
import { eventDate } from "@/components/website-next/media/EventCard";
import { tidyTitle } from "@/components/website-next/media/albums";
import { organisationName } from "@/components/website-next/media/org-name";
import { formatDate } from "@/components/website-next/ui/format";
import { getContentSyncedDate, getEvents, routeSlug } from "@/lib/website/content";
import { socialCard } from "@/lib/seo/social";
import { EventsClient, type ClassicEventCard } from "./events-client";

const TITLE = "Events";
const DESCRIPTION =
  "Conclaves, conferences, camps and commemorative events organised by the Department of Social Justice & Empowerment and its associated organisations.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
  ...socialCard({ title: TITLE, description: DESCRIPTION, url: "/website/events" }),
};

const isPicture = (u: string) => /\.(jpe?g|png|webp|gif|avif)(\?|$)/i.test(u) && !/\/Ashoka\.png$/i.test(u);

/**
 * The Department's events register — every record, not a hand-picked six.
 *
 * WHAT THIS REPLACED: six events written into this file (a "Chintan Shivir
 * 2026", a "National De-Addiction Conclave 2026", …) that are not in the
 * register and were never held as described. The cards are now the register's
 * own records, newest first.
 *
 * The client receives only what a card prints. The full records carry
 * description HTML, photo sets and contact details; shipping all 635 of those to
 * the browser to draw a title and a date would be most of the payload for none
 * of the page.
 */
export default function EventsPage() {
  const cards: ClassicEventCard[] = getEvents()
    .map((e) => {
      const when = eventDate(e);
      const cover = [e.imageUrl, ...(e.photos ?? []).map((p) => p.thumbnailUrl ?? p.url)].find(
        (u): u is string => Boolean(u && isPicture(u)),
      );
      return {
        slug: routeSlug(e.slug),
        title: tidyTitle(e.title),
        sortKey: when ?? "",
        when: when ? formatDate(when) : undefined,
        organisation: organisationName(e.organisation),
        cover,
      };
    })
    .sort((a, b) => b.sortKey.localeCompare(a.sortKey));

  return (
    <EventsClient
      title={TITLE}
      description={DESCRIPTION}
      lastUpdated={getContentSyncedDate()}
      events={cards}
    />
  );
}
