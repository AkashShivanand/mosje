import type { GalleryRecord, MediaItem } from "@/types/website/content";

/**
 * Gallery ALBUMS, derived from the ingested gallery register (issue NAV-16).
 *
 * ── WHAT AN ALBUM IS, AND HOW IT IS DERIVED ─────────────────────────────────
 * `content/website/gallery.json` holds 590 records. Each record is already one
 * album: a title, a date, an organisation, and a list of `images` (or `videos`,
 * or press clippings). So the album is the RECORD, never the photograph.
 *
 * The one grouping applied on top: the register publishes 35 albums twice (an
 * NCSK visit posted once from the Vice-Chairperson's page and once from a
 * Member's, a BJRNF event posted in two batches). Records with the SAME type,
 * organisation, date and title — title compared case- and space-insensitively,
 * trailing punctuation ignored — are one event, so they become one album: the
 * photographs are merged (duplicate files dropped), and the album opens the
 * first record's page. Nothing looser than that is merged; two records that
 * differ in any of the four fields stay two albums.
 *
 * ── WHAT COUNTS AS A PHOTOGRAPH ─────────────────────────────────────────────
 * Five News records carry a PDF in the image slot and eight use the generic
 * national emblem as a cover. Neither is a photograph: a PDF is counted as a
 * press clipping, and the emblem is never used as a thumbnail (issue BRD-14 —
 * photographs, not posters). An album with no photograph gets a designed tile
 * (issue BRD-19), never a "No Image" box.
 */

export type AlbumKind = "Photos" | "Videos" | "News";

export interface AlbumPhoto {
  src: string;
  thumb: string;
  /** The register's own alt text where it has one; otherwise built from the album. */
  alt: string;
}

export interface Album {
  key: string;
  /** The slug of the record the album opens. */
  slug: string;
  title: string;
  date?: string;
  organisation?: string;
  kind: AlbumKind;
  cover?: string;
  photos: AlbumPhoto[];
  videoCount: number;
  clippingCount: number;
}

const PICTURE = /\.(jpe?g|png|webp|gif|avif)(\?|$)/i;
const EMBLEM = /\/Ashoka\.png$/i;

export const isPicture = (url?: string): url is string => !!url && PICTURE.test(url) && !EMBLEM.test(url);

/** Record titles arrive with stray spaces and trailing punctuation (CON-20). The words are never changed. */
export const tidyTitle = (t: string) => t.replace(/\s+/g, " ").replace(/[\s.:,;|–-]+$/, "").trim();

const normalise = (t: string) => tidyTitle(t).toLowerCase();

function kindOf(r: GalleryRecord): AlbumKind {
  if (r.type === "Videos") return "Videos";
  if (r.type === "News") return "News";
  return "Photos";
}

/** Alt text for a photograph: the register's own where it wrote one, else the album and position. */
export function photoAlt(item: MediaItem, albumTitle: string, index: number, total: number): string {
  const own = item.alt?.trim() || item.caption?.trim();
  if (own && own.toLowerCase() !== "glimpses of the event") return own;
  return total > 1 ? `${albumTitle}, photograph ${index + 1} of ${total}` : albumTitle;
}

export function toPhotos(items: MediaItem[], albumTitle: string): AlbumPhoto[] {
  const seen = new Set<string>();
  const pictures = items.filter((i) => {
    if (!isPicture(i.url) || seen.has(i.url)) return false;
    seen.add(i.url);
    return true;
  });
  return pictures.map((i, n) => ({
    src: i.url,
    thumb: isPicture(i.thumbnailUrl) ? i.thumbnailUrl : i.url,
    alt: photoAlt(i, albumTitle, n, pictures.length),
  }));
}

export function deriveAlbums(records: GalleryRecord[]): Album[] {
  const groups = new Map<string, GalleryRecord[]>();
  for (const r of records) {
    const key = [kindOf(r), r.organisation ?? "", r.date ?? "", normalise(r.title)].join("|");
    const list = groups.get(key);
    if (list) list.push(r);
    else groups.set(key, [r]);
  }

  const albums: Album[] = [];
  for (const [key, list] of groups) {
    const first = list[0]!;
    const title = tidyTitle(first.title);
    const media = list.flatMap((r) => r.images ?? []);
    const photos = toPhotos(media, title);
    const cover =
      photos[0]?.thumb ??
      [first.thumbnailUrl, first.imageUrl].find((u) => isPicture(u));
    albums.push({
      key,
      slug: first.slug,
      title,
      date: first.date,
      organisation: first.organisation,
      kind: kindOf(first),
      cover,
      photos,
      videoCount: list.reduce((t, r) => t + (r.videos?.length ?? 0), 0),
      clippingCount: media.filter((i) => !PICTURE.test(i.url)).length,
    });
  }

  return albums.sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
}

/** "12 Photographs", "1 Video", "Press Clipping" — what the album holds, in words. */
export function albumContents(a: Album): string | undefined {
  const plural = (n: number, one: string, many: string) => `${n.toLocaleString("en-IN")} ${n === 1 ? one : many}`;
  if (a.kind === "Videos" && a.videoCount > 0) return plural(a.videoCount, "Video", "Videos");
  // A News album's pictures are press clippings — screenshots of a newspaper
  // page — not photographs of the event.
  if (a.kind === "News" && a.photos.length + a.clippingCount > 0)
    return plural(a.photos.length + a.clippingCount, "Press Clipping", "Press Clippings");
  if (a.photos.length > 0) return plural(a.photos.length, "Photograph", "Photographs");
  if (a.clippingCount > 0) return plural(a.clippingCount, "Press Clipping", "Press Clippings");
  return undefined;
}
