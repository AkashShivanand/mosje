"use client";

import * as React from "react";
import Image from "next/image";
import { Button, Icon, Lightbox, type LightboxItem } from "@mosje/design-system";
import type { AlbumPhoto } from "@/components/website-next/media/albums";

/**
 * One album's photographs in the reference's card grid; each opens the DS Lightbox
 * (Escape closes, ← → page, focus is trapped and returns to the photo that opened it).
 */
export function DbimAlbumPhotos({ photos }: { photos: AlbumPhoto[] }) {
  const [open, setOpen] = React.useState<number | null>(null);
  const tiles = React.useRef<(HTMLButtonElement | null)[]>([]);
  // Focus goes back to the photograph the reader is on when they close it — the
  // lightbox may have paged away from the one that opened it.
  const close = () => {
    const at = open ?? 0;
    setOpen(null);
    requestAnimationFrame(() => tiles.current[at]?.focus());
  };
  const items = React.useMemo<LightboxItem[]>(
    () => photos.map((p) => ({ type: "image", src: p.src, alt: p.alt, caption: p.alt })),
    [photos],
  );

  return (
    <>
      <ul className="db-media-grid db-photo-grid">
        {photos.map((p, i) => (
          <li key={p.src} className="db-media-card">
            <Button ref={(el) => { tiles.current[i] = el; }} appearance="text" className="db-photo" onClick={() => setOpen(i)} aria-label={`View photograph ${i + 1} of ${photos.length}: ${p.alt}`}>
              <span className="db-media-frame">
                <Image src={p.thumb} alt="" fill sizes="(min-width: 992px) 30vw, (min-width: 768px) 45vw, 100vw" className="db-media-img" />
                <span className="db-album-arrow" aria-hidden="true">
                  <Icon name="zoom_in" size={24} aria-hidden />
                </span>
              </span>
            </Button>
          </li>
        ))}
      </ul>
      <Lightbox open={open != null} items={items} index={open ?? 0} onClose={close} onIndexChange={setOpen} />
    </>
  );
}
