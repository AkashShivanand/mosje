"use client";
import * as React from "react";
import { Lightbox, MediaThumbnail, type LightboxItem } from "@mosje/design-system";

const CAPTION: React.CSSProperties = {
  fontSize: "var(--sa-type-label-2-size)", lineHeight: "var(--sa-type-label-2-lh)",
  color: "var(--sa-text-neutral-subtle)", margin: 0,
};

const ITEMS: LightboxItem[] = [
  { type: "image", src: "/images/specimen-photo-1.jpg", alt: "Awareness session at a community hall", caption: "Awareness session, Purulia" },
  { type: "image", src: "/images/specimen-photo-2.jpg", alt: "Volunteers at a pledge drive", caption: "Pledge drive, Bankura" },
  { type: "image", src: "/images/specimen-photo-1.jpg", alt: "Awareness session, second angle", caption: "Awareness session, Purulia" },
];

/** Every size, the count badge, a video, and the empty tile — each opening a real Lightbox. */
export function ThumbnailPlayground(): React.JSX.Element {
  const [open, setOpen] = React.useState<number | null>(null);
  return (
    <div style={{ padding: "var(--sa-padding-40)", background: "var(--sa-bg-neutral-subtle)",
      borderRadius: "var(--sa-shape-8)", display: "grid", gap: "var(--sa-stack-24)" }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "var(--sa-inline-24)" }}>
        <MediaThumbnail size="sm" src={ITEMS[0]?.src} count={3} label="View 3 training photos" onClick={() => setOpen(0)} />
        <MediaThumbnail size="md" src={ITEMS[1]?.src} label="View Pledge drive, Bankura" onClick={() => setOpen(1)} />
        <MediaThumbnail size="md" src={ITEMS[0]?.src} kind="video" label="Play Awareness session, Purulia" onClick={() => setOpen(0)} />
        <MediaThumbnail size="sm" emptyLabel="No photos uploaded" label="View photos" />
        <div style={{ inlineSize: "var(--sa-padding-360)", aspectRatio: "4 / 3", borderRadius: "var(--sa-shape-8)", overflow: "hidden" }}>
          <MediaThumbnail size="fill" src={ITEMS[1]?.src} label="View Pledge drive, Bankura" onClick={() => setOpen(1)} />
        </div>
      </div>
      <p style={CAPTION}>
        sm in a table cell, md in a list row, a video with its play glyph, the empty tile, and fill in
        a card. &ldquo;+2&rdquo; counts the photos not shown.
      </p>
      <Lightbox items={ITEMS} open={open !== null} index={open ?? 0} onIndexChange={setOpen} onClose={() => setOpen(null)} />
    </div>
  );
}
