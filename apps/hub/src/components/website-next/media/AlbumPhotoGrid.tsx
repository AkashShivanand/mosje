"use client";

import * as React from "react";
import { Lightbox, MediaThumbnail, type LightboxItem } from "@mosje/design-system";
import type { AlbumPhoto } from "./albums";

interface AlbumPhotoGridProps {
  photos: AlbumPhoto[];
  /** Names the grid for assistive technology, e.g. the album title. */
  label: string;
}

/**
 * An album's photographs, each opening the DS Lightbox (issue DES-D-06).
 *
 * Every thumbnail is the DS MediaThumbnail — a BUTTON, not a link to the raw CDN file — the classic
 * gallery opened a bare image in the tab, with no way back and no caption. The
 * Lightbox pages with ← / →, closes on Esc, traps focus while open and returns
 * it to the thumbnail that opened it. Every photograph carries alt text, and
 * the same text is its caption, so a sighted reader and a screen-reader user
 * are told the same thing.
 *
 * One crop ratio for every thumbnail (issue BRD-14); the Lightbox shows the
 * whole photograph uncropped.
 */
export function AlbumPhotoGrid({ photos, label }: AlbumPhotoGridProps) {
  const [open, setOpen] = React.useState<number | null>(null);
  const items = React.useMemo<LightboxItem[]>(
    () => photos.map((p) => ({ type: "image", src: p.src, alt: p.alt, caption: p.alt })),
    [photos],
  );

  if (photos.length === 0) return null;

  return (
    <>
      <ul className="wn-photos" aria-label={label}>
        {photos.map((p, i) => (
          <li key={p.src}>
            <MediaThumbnail
              size="fill"
              className="wn-photos__button"
              src={p.thumb}
              label={`Open photograph ${i + 1} of ${photos.length}: ${p.alt}`}
              onClick={() => setOpen(i)}
            />
          </li>
        ))}
      </ul>
      <Lightbox open={open !== null} items={items} index={open ?? 0} onClose={() => setOpen(null)} />
    </>
  );
}
