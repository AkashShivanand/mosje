"use client";

import * as React from "react";
import { Lightbox, MediaThumbnail } from "@mosje/design-system";

import { infographicText, type Infographic } from "@/lib/website/infographics";

/**
 * The Infographics slot of the home page's posts row (DBIM 3.0 §7.3 xiii), beside
 * the two central posts.
 *
 * DS Audit: MediaThumbnail ✅ · Lightbox ✅
 *
 * The slot is a quarter of the row and 245px-ish tall, where a 1080 square
 * infographic cannot be read — so the tile shows the whole picture, uncropped,
 * and opens it full size. The figures it carries are the viewer image's alt
 * text, generated from the same list the image was drawn from, so a screen
 * reader hears every number the picture shows.
 */
export function DbimInfographicTile({ infographic }: { infographic: Infographic }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="db-hb-campaigns__infographic">
      <MediaThumbnail
        size="fill"
        src={infographic.src}
        label={`View infographic: ${infographic.title}`}
        onClick={() => setOpen(true)}
      />
      <Lightbox
        open={open}
        items={[
          {
            type: "image",
            src: infographic.src,
            alt: infographicText(infographic),
            caption: `${infographic.title} · Source: ${infographic.source.label}, dosje.gov.in`,
          },
        ]}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
