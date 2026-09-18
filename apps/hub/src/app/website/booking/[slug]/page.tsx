import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { DataTable, SectionTitle, type DataTableColumn } from "@mosje/design-system";
import { RecordDetail } from "@/components/website/templates/RecordDetail";
import { getBookableVenue, getBookableVenues, getContentSyncedDate } from "@/lib/website/content";
import { facts } from "@/lib/website/record-facts";
import { socialCard } from "@/lib/seo/social";

/** 12 venues — every one is prerendered. */
export function generateStaticParams() {
  return getBookableVenues().map((v) => ({ slug: v.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const venue = getBookableVenue(slug);
  if (!venue) return { title: "Venue Not Found | Dr. Ambedkar International Centre" };
  const description = venue.description ?? "A bookable venue at the Dr. Ambedkar International Centre.";
  return {
    title: `${venue.title} | Dr. Ambedkar International Centre`,
    description,
    ...socialCard({ title: venue.title, description, url: `/website/booking/${venue.slug}` }),
  };
}

type Rate = { label?: string; rate?: string } & Record<string, unknown>;

/*
 * THE RATE CARD IS A TABLE BECAUSE IT IS ONE.
 *
 * Three rates against three classes of hirer is exactly what the Centre
 * publishes, and a reader's question is "which line applies to me". `DataTable`
 * gives it the estate's own table treatment; the pager never appears, because
 * three rows fit the smallest page size and `hidePagerWhenFits` defaults true.
 */
const rateColumns: DataTableColumn<Rate>[] = [
  { key: "label", header: "Hirer", render: (r) => r.label ?? "—" },
  { key: "rate", header: "Rate per Day (₹)", render: (r) => r.rate ?? "—" },
];

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const venue = getBookableVenue(slug);
  if (!venue) notFound();

  const rates = (venue.rates ?? []) as Rate[];
  const images = venue.images ?? [];
  const contact = venue.contacts?.[0];

  return (
    <RecordDetail
      title={venue.title}
      badge="Venue Booking"
      description={venue.description}
      breadcrumb={[
        { label: "Associated Organisations" },
        { label: "Venue Booking", href: "/website/booking" },
        { label: venue.title },
      ]}
      backHref="/website/booking"
      backLabel="Back to Venues"
      lastUpdated={getContentSyncedDate()}
      facts={facts([
        { term: "Category", value: venue.category },
        { term: "Booking Enquiries", value: contact?.phone },
        { term: "Booking Email", value: contact?.email },
        { term: "Note", value: venue.note, wide: true },
      ])}
      files={venue.documents ?? []}
      sourceUrl={venue.sourceUrl}
    >
      {images.length > 0 && (
        <div>
          <SectionTitle title="Photographs" as={2} />
          <ul className="sa-record-media">
            {images.map((src) => (
              <li key={src} className="sa-record-media__item">
                <Image
                  src={src}
                  alt=""
                  width={480}
                  height={360}
                  sizes="(min-width: 1024px) 22rem, 100vw"
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      {rates.length > 0 && (
        <div>
          <SectionTitle title="Rate Card" as={2} />
          <DataTable
            columns={rateColumns}
            data={rates}
            total={rates.length}
            caption={`${venue.title} rate card`}
            showPageSizes={false}
          />
        </div>
      )}
    </RecordDetail>
  );
}
