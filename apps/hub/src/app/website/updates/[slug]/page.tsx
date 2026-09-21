import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionTitle } from "@mosje/design-system";
import { RecordDetail } from "@/components/website-next/templates/RecordDetail";
import { getContentSyncedDate, getUpdate, getUpdates } from "@/lib/website/content";
import { facts } from "@/lib/website/record-facts";
import { formatDate } from "@/components/website-next/ui/format";
import { socialCard } from "@/lib/seo/social";

/** 9 updates — every one is prerendered. */
export function generateStaticParams() {
  return getUpdates().map((u) => ({ slug: u.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const update = getUpdate(slug);
  if (!update) return { title: "Update Not Found | Department of Social Justice & Empowerment" };
  const description = `An update published by ${update.organisation ?? "the Department of Social Justice & Empowerment"}.`;
  return {
    title: `${update.title} | Department of Social Justice & Empowerment`,
    description,
    ...socialCard({ title: update.title, description, url: `/website/updates/${update.slug}` }),
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const update = getUpdate(slug);
  if (!update) notFound();

  /*
   * THE RECORD'S OWN BODY IS NOT RENDERED AS HTML HERE.
   *
   * `bodyHtml` on an update is the WordPress theme's attachment markup — nine
   * nested empty `<div>`s around the same link the record already carries in
   * `attachments`. Rendering it would draw the attachment twice, once as the
   * theme's own broken tile and once as our document button. The attachments
   * and the videos are the content; the wrapper is not.
   */
  const videos = update.videos ?? [];

  return (
    <RecordDetail
      title={update.title}
      badge="Update"
      breadcrumb={[
        { label: "Media" },
        { label: "Updates", href: "/website/updates" },
        { label: update.title },
      ]}
      backHref="/website/updates"
      backLabel="Back to Updates"
      lastUpdated={getContentSyncedDate()}
      facts={facts([
        { term: "Organisation", value: update.organisation },
        { term: "Published", value: formatDate(update.date) },
      ])}
      files={update.attachments ?? []}
    >
      {videos.length > 0 && (
        <section className="wn-rec-section" aria-labelledby="record-videos">
          <SectionTitle headingId="record-videos" title={videos.length === 1 ? "Video" : "Videos"} />
          <ul className="wn-rec-media">
            {videos.map((v) => (
              <li key={v.url} className="wn-rec-media__item">
                {/* The department publishes no caption track for these files.
                    A `<track>` pointing at nothing is worse than none: it tells
                    assistive technology captions exist and then serves silence. */}
                <video controls preload="none" poster={v.poster} src={v.url} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </RecordDetail>
  );
}
