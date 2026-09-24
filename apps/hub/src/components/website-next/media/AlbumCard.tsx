import Image from "next/image";
import Link from "next/link";
import { Icon } from "@mosje/design-system";
import { routeSlug } from "@/lib/website/content";
import { formatDate, isoDate } from "@/components/website-next/ui/format";
import { albumContents, type Album, type AlbumKind } from "./albums";
import { organisationName } from "./org-name";

const KIND_ICON: Record<AlbumKind, string> = {
  Photos: "photo_library",
  Videos: "smart_display",
  News: "newspaper",
};

const DEVANAGARI = /[ऀ-ॿ]/;

/**
 * One album: a single thumbnail at one crop ratio (BRD-14), its name, date,
 * organisation and what it holds (NAV-16). The title is the card's one link and
 * opens the album's own page (DES-D-06, LAY-07). An album with no photograph
 * gets a neutral tile with its kind's icon (BRD-19).
 */
export function AlbumCard({
  album,
  eager = false,
  headingLevel = 2,
}: {
  album: Album;
  /** First row: above the fold, so the LCP image. */
  eager?: boolean;
  /** h3 where the album list sits under a section h2 (the home page). */
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const contents = albumContents(album);
  const organisation = organisationName(album.organisation);
  return (
    <li className="wn-album">
      <div className="wn-album__frame">
        {album.cover ? (
          <Image
            src={album.cover}
            alt=""
            fill
            loading={eager ? "eager" : "lazy"}
            sizes="(min-width: 1280px) 300px, (min-width: 768px) 33vw, (min-width: 480px) 50vw, 100vw"
            className="wn-album__img"
          />
        ) : (
          <span className="wn-album__fallback" aria-hidden>
            <Icon name={KIND_ICON[album.kind]} size={40} />
          </span>
        )}
        {contents && (
          <span className="wn-album__count">
            <span aria-hidden className="wn-album__count-icon">
              <Icon name={KIND_ICON[album.kind]} size={16} />
            </span>
            {contents}
          </span>
        )}
      </div>
      <div className="wn-album__body">
        <Heading className="wn-album__title" lang={DEVANAGARI.test(album.title) ? "hi" : undefined}>
          <Link href={`/website/gallery/${routeSlug(album.slug)}`} className="wn-album__link">
            {album.title}
          </Link>
        </Heading>
        <p className="wn-album__meta">
          {album.date && <time dateTime={isoDate(album.date)}>{formatDate(album.date)}</time>}
          {album.date && organisation && <span aria-hidden> · </span>}
          {organisation && <span>{organisation}</span>}
        </p>
      </div>
    </li>
  );
}
