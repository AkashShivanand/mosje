import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { SectionTitle } from "@mosje/design-system";
import { RecordDetail } from "@/components/website-next/templates/RecordDetail";
import { getContentSyncedDate, getGalleryItem, getGalleryItems, routeSlug } from "@/lib/website/content";
import { facts } from "@/lib/website/record-facts";
import { formatDate } from "@/components/website-next/ui/format";
import { socialCard } from "@/lib/seo/social";

/** 590 gallery records — every one is prerendered. */
export function generateStaticParams() {
  return getGalleryItems().map((g) => ({ slug: routeSlug(g.slug) }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const item = getGalleryItem(slug);
  if (!item) return { title: "Gallery Item Not Found | Department of Social Justice & Empowerment" };
  const description =
    item.description ??
    `${item.type ?? "Gallery"} published by ${item.organisation ?? "the Department of Social Justice & Empowerment"}.`;
  return {
    title: `${item.title} | Department of Social Justice & Empowerment`,
    description,
    ...socialCard({
      title: item.title,
      description,
      url: `/website/gallery/${item.slug}`,
      ...(item.imageUrl ? { images: [item.imageUrl] } : {}),
    }),
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getGalleryItem(slug);
  if (!item) notFound();

  /*
   * NOT EVERY "IMAGE" IS ONE.
   *
   * Five News items attach a PDF press clipping in the image slot. Drawn as an
   * <img> it rendered a broken picture; it is offered as a document instead.
   */
  const isPicture = (u: string) => /\.(jpe?g|png|webp|gif|avif|svg)(\?|$)/i.test(u);
  const allMedia = item.images ?? [];
  const images = allMedia.filter((i) => isPicture(i.url));
  const clippings = allMedia
    .filter((i) => !isPicture(i.url))
    .map((i, n, all) => ({ label: all.length > 1 ? `Press Clipping ${n + 1}` : "Press Clipping", url: i.url }));
  const videos = item.videos ?? [];
  /*
   * THE COVER IS SHOWN ONLY WHERE IT IS NOT ALREADY IN THE SET.
   *
   * `imageUrl` is the record's featured image and is frequently the first
   * picture of the set as well. Printing both drew the same photograph twice at
   * the top of 434 pages.
   */
  const coverIsInSet = images.some((i) => i.url === item.imageUrl || i.thumbnailUrl === item.imageUrl);
  /* Eight records use the department's generic Ashoka emblem as a stand-in cover. It is not a photograph of the event. */
  const isGenericCover = (u: string) => /\/Ashoka\.png$/i.test(u);
  const showCover =
    Boolean(item.imageUrl && isPicture(item.imageUrl) && !isGenericCover(item.imageUrl)) &&
    !coverIsInSet &&
    images.length === 0;

  return (
    <RecordDetail
      title={item.title}
      badge={item.type ?? "Gallery"}
      description={item.description}
      breadcrumb={[
        { label: "Media" },
        { label: "Gallery", href: "/website/gallery" },
        { label: item.title },
      ]}
      backHref="/website/gallery"
      backLabel="Back to Gallery"
      lastUpdated={getContentSyncedDate()}
      facts={facts([
        { term: "Media", value: item.type },
        { term: "Organisation", value: item.organisation },
        { term: "Category", value: item.categories?.join(", ") },
        { term: "Published", value: formatDate(item.date) },
        { term: "Source", value: item.source },
      ])}
      files={[...clippings, ...(item.sourceLink ? [{ label: "Visit Source", url: item.sourceLink }] : [])]}
    >
      {showCover && item.imageUrl && (
        <Image
          src={item.imageUrl}
          alt=""
          width={960}
          height={640}
          sizes="(min-width: 1024px) 48rem, 100vw"
          className="wn-rec-cover"
          priority
        />
      )}

      {images.length > 0 && (
        <div className="wn-rec-section">
          <SectionTitle title="Photographs" as={2} count={images.length} />
          <ul className="wn-rec-media">
            {images.map((img) => (
              <li key={img.url} className="wn-rec-media__item">
                <Image
                  src={img.thumbnailUrl ?? img.url}
                  /*
                   * The register publishes no alternative text for these
                   * photographs. The caption is used where there is one; where
                   * there is not, the image is marked decorative rather than
                   * given the record's title, which would have a screen reader
                   * read the same sentence once per picture.
                   */
                  alt={img.alt ?? img.caption ?? ""}
                  width={480}
                  height={360}
                  sizes="(min-width: 1024px) 22rem, 50vw"
                />
                {img.caption && <p className="wn-rec-media__caption">{img.caption}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {videos.length > 0 && (
        <div className="wn-rec-section">
          <SectionTitle title="Videos" as={2} count={videos.length} />
          <ul className="wn-rec-media">
            {videos.map((v) =>
              v.kind === "youtube" ? (
                <li key={v.url} className="wn-rec-media__item">
                  <iframe
                    src={v.url}
                    title={v.caption ?? item.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ width: "100%", aspectRatio: "16 / 9", border: 0 }}
                  />
                </li>
              ) : (
                <li key={v.url} className="wn-rec-media__item">
                  {/* The department publishes no caption track for these files.
                      A `<track>` pointing at nothing is worse than none: it tells
                      assistive technology captions exist and then serves silence. */}
                  <video controls preload="none" poster={v.poster ?? item.imageUrl} src={v.url} />
                </li>
              ),
            )}
          </ul>
        </div>
      )}
    </RecordDetail>
  );
}
