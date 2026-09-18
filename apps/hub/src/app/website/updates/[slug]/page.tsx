import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RecordDetail } from "@/components/website/templates/RecordDetail";
import { getContentSyncedDate, getUpdate, getUpdates } from "@/lib/website/content";
import { facts, humanDate } from "@/lib/website/record-facts";
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
        { label: "Connect" },
        { label: "Updates", href: "/website/updates" },
        { label: update.title },
      ]}
      backHref="/website/updates"
      backLabel="Back to Updates"
      lastUpdated={getContentSyncedDate()}
      facts={facts([
        { term: "Organisation", value: update.organisation },
        { term: "Published", value: humanDate(update.date) },
        { term: "Status", value: update.status },
      ])}
      files={update.attachments ?? []}
      sourceUrl={update.sourceUrl}
    >
      {videos.length > 0 && (
        <div>
          <h2 className="sa-record-detail__aside-title">
            {videos.length === 1 ? "Video" : "Videos"}
          </h2>
          <ul className="sa-record-media">
            {videos.map((v) => (
              <li key={v.url} className="sa-record-media__item">
                {/* The department publishes no caption track for these files.
                    A `<track>` pointing at nothing is worse than none: it tells
                    assistive technology captions exist and then serves silence. */}
                <video controls preload="none" poster={v.poster} src={v.url} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </RecordDetail>
  );
}
