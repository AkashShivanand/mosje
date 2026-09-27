/**
 * Content for the DBIM design's Media pages — photo albums and videos — from the
 * estate's gallery register (`content/website/gallery.json`, 590 records).
 *
 * Albums are derived by the redesign's own rule (`deriveAlbums`, which merges the 35
 * records the register publishes twice); only its logic is reused here, not its
 * components.
 */
import { getGalleryItems, getGalleryItemsByType, routeSlug } from "@/lib/website/content";
import { deriveAlbums, type AlbumPhoto } from "@/components/website-next/media/albums";
import { organisationName } from "@/components/website-next/media/org-name";

export interface DbimAlbum {
  slug: string;
  title: string;
  /** YYYY-MM-DD */
  date?: string;
  /** The organisation's name — the Category the reference filters by. */
  category?: string;
  cover: string;
  photos: AlbumPhoto[];
}

let albums: DbimAlbum[] | undefined;

/**
 * Photo albums, newest first. An album with no photograph is left out: the register
 * has records typed "Photos" whose only image is a PDF or the generic emblem, and a
 * card with nothing to open is not an album of photographs.
 */
export function getDbimAlbums(): DbimAlbum[] {
  albums ??= deriveAlbums(getGalleryItemsByType("Photos"))
    .filter((a) => a.photos.length > 0)
    .map((a) => ({
      slug: a.slug,
      title: a.title,
      date: a.date,
      category: organisationName(a.organisation),
      cover: a.photos[0]!.thumb,
      photos: a.photos,
    }));
  return albums;
}

export function getDbimAlbum(slug: string): DbimAlbum | undefined {
  const key = routeSlug(slug);
  return getDbimAlbums().find((a) => routeSlug(a.slug) === key);
}

export interface DbimVideo {
  key: string;
  title: string;
  date?: string;
  category?: string;
  /** A file the browser plays itself… */
  file?: { src: string; poster?: string };
  /** …or a YouTube video, drawn as a still until the reader asks for it. */
  youtube?: { id: string; still: string };
}

const YT_ID = /(?:youtube(?:-nocookie)?\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([\w-]{11})/;
const PICTURE = /\.(jpe?g|png|webp|gif|avif)(\?|$)/i;

/**
 * Every video the gallery register carries (106: 28 files, 78 YouTube), newest
 * first. A video appears once, however many records repeat its address.
 */
export function getDbimVideos(): DbimVideo[] {
  const seen = new Set<string>();
  const out: DbimVideo[] = [];
  const records = [...getGalleryItems()].sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
  for (const r of records) {
    const videos = r.videos ?? [];
    videos.forEach((v, i) => {
      if (seen.has(v.url)) return;
      seen.add(v.url);
      const title = (v.caption?.trim() || r.title).replace(/\s+/g, " ").trim();
      const base = {
        key: `${r.slug}-${i}`,
        title: videos.length > 1 && !v.caption ? `${title} (${i + 1})` : title,
        date: r.date,
        category: organisationName(r.organisation),
      };
      const id = YT_ID.exec(v.url)?.[1];
      if (v.kind === "youtube" || id) {
        if (id) out.push({ ...base, youtube: { id, still: `https://i.ytimg.com/vi/${id}/hqdefault.jpg` } });
        return;
      }
      const poster = [v.poster, r.imageUrl].find((u) => u && PICTURE.test(u) && !/\/Ashoka\.png$/i.test(u));
      out.push({ ...base, file: { src: v.url, poster } });
    });
  }
  return out;
}

/** 2023-08-22 → "22.08.2023", the reference's card date. */
export function dottedDate(iso?: string): string | undefined {
  const m = iso && /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  return m ? `${m[3]}.${m[2]}.${m[1]}` : undefined;
}
