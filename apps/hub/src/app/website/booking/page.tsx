import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Card, CardBody, CardSubtitle, CardTitle, EmptyState, Icon } from "@mosje/design-system";
import { PageLayout } from "@/components/website-next/layout/PageLayout";
import { getBookableVenues, getContentSyncedDate } from "@/lib/website/content";
import { socialCard } from "@/lib/seo/social";
import "@/components/website/templates/record-detail.css";

const TITLE = "Venue Booking";
const DESCRIPTION =
  "Halls, conference rooms and open spaces at the Dr. Ambedkar International Centre that may be booked by Government departments, public sector undertakings, voluntary organisations and private bodies.";

export const metadata: Metadata = {
  title: `${TITLE} | Dr. Ambedkar International Centre`,
  description: DESCRIPTION,
  ...socialCard({ title: TITLE, description: DESCRIPTION, url: "/website/booking" }),
};

/**
 * Twelve venues, shown as cards rather than a table.
 *
 * A reader choosing a hall is choosing on the room, and every record carries a
 * photograph of it — which is the one fact a table cannot print. The rates stay
 * on the venue's own page, because a card that prints three rates for twelve
 * venues is a rate card pretending to be a list of rooms.
 *
 * Twelve is below any page size, so there is no pager. If the Centre publishes
 * more, this becomes a `RecordLibrary` rather than growing a longer scroll.
 */
export default function Page() {
  const venues = getBookableVenues();

  return (
    <PageLayout
      title={TITLE}
      description={DESCRIPTION}
      breadcrumb={[{ label: "Associated Organisations" }, { label: "Venue Booking" }]}
      lastUpdated={getContentSyncedDate()}
    >
      <section className="sa-record-detail">
        <div className="sa-container">
          {venues.length === 0 ? (
            <EmptyState
              icon={<Icon name="meeting_room" size={40} />}
              title="No Venues Published"
              description="The Dr. Ambedkar International Centre has not published any bookable venues."
            />
          ) : (
            <ul className="sa-record-media">
              {venues.map((v) => (
                <li key={v.slug}>
                  <Card variant="outlined">
                    {v.imageUrl && (
                      <Image
                        src={v.imageUrl}
                        alt=""
                        width={480}
                        height={320}
                        sizes="(min-width: 1024px) 22rem, 100vw"
                        style={{ width: "100%", height: "auto", aspectRatio: "3 / 2", objectFit: "cover" }}
                      />
                    )}
                    <CardBody>
                      <CardTitle>
                        <Link href={`/website/booking/${v.slug}`} className="sa-record-link">
                          {v.title}
                        </Link>
                      </CardTitle>
                      {v.category && <CardSubtitle>{v.category}</CardSubtitle>}
                    </CardBody>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
