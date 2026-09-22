import type { Metadata } from "next";
import * as React from "react";
import { CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";
import { ThumbnailPlayground } from "./thumbnail-playground";

export const metadata: Metadata = {
  title: "Media Thumbnail — Design System",
  description:
    "A photo or video that opens when pressed — the trigger for a Lightbox, in a table cell, a list row or a card.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    status: "verified",
    evidence:
      "Read from the rendered DOM: a native <button type=\"button\"> carrying aria-label from the required `label` prop, with the <img> inside at alt=\"\". The name is the action, heard once.",
    description: "A button named for what it opens; the image inside it is decorative.",
  },
  {
    criterion: "2.4.7 Focus Visible",
    level: "AA",
    status: "verified",
    evidence:
      "media-thumbnail.css: an outline on --sa-focus-width and --sa-focus-ring, offset by --sa-focus-offset — drawn inside the edge at size=\"fill\", where the card clips anything outside it.",
    description: "The focus ring is the estate's, and a filled thumbnail does not lose it to its card's clip.",
  },
  {
    criterion: "1.4.13 Content on Hover or Focus",
    level: "AA",
    status: "verified",
    evidence:
      "media-thumbnail.css: one rule reveals the cue for :hover, :focus-visible and .ds-media-thumb--video alike, so a keyboard reader gets the pointer's signal and a video's glyph never depends on either.",
    description:
      "The zoom cue appears on focus as well as on hover, and a video's play glyph is always drawn — neither affordance is a hover-only secret.",
  },
  {
    criterion: "1.4.3 Contrast (Minimum)",
    level: "AA",
    status: "verified",
    evidence:
      "Computed from resolved tokens in packages/design-system/tokens.css: bg/neutral/bold #c6c9cd against its paired on-bg/neutral/bold #1e2124 is 9.73:1 — a solid fill, so the photograph underneath cannot lower it.",
    description:
      "The \"+N\" badge is a solid paired fill (bg/neutral/bold with its on-colour), never a scrim, so its contrast does not depend on the photograph underneath.",
  },
];

export default function MediaThumbnailPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Media Thumbnail"
      status="Stable"
      since="0.153.0"
      summary="A photo or video that opens when pressed — the trigger for a Lightbox. Sized for a table cell, a list row, or the whole media area of a card."
      figma={{ node: "mediaThumbnail" }}
      specimen={<ThumbnailPlayground />}
      propsFrom="MediaThumbnailProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A table cell or list row that holds photographs a reader may want to see full size — training records, activity attachments.",
          "The media area of a gallery card, where pressing the picture opens it.",
        ],
        avoid: [
          "A picture that leads to another page. That is a link around a Figure, not a button.",
          "A picture that is only there to be looked at. Use Figure; a control with nothing to open is a control that lies.",
        ],
      }}
      related={[
        { label: "Lightbox", href: "/design-system/components/feedback/lightbox", reason: "what a thumbnail opens" },
        { label: "Figure", href: "/design-system/components/data-display/figure", reason: "for a picture with a caption and no action" },
        { label: "Media Gallery Input", href: "/design-system/components/forms/media-gallery-input", reason: "for choosing the photos in the first place" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-why">
            <h2 id="cdp-why" className="cdp__h2">One Control, Drawn Five Times Before</h2>
            <p>
              Until 22 September 2026 NMBA drew this by hand in five places — a training photo in a
              table, a Saptah attachment, a mass-pledge photo card, and the gallery&rsquo;s grid and
              list. Each had its own focus ring, its own hover zoom and its own count badge, and one
              showed its only affordance on hover. This is that control once.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-name">
            <h2 id="cdp-name" className="cdp__h2">Named for What It Opens</h2>
            <p>
              <code>label</code> is required and is the button&rsquo;s whole name — &ldquo;View 3
              training photos&rdquo;. The image inside is decorative, because a thumbnail&rsquo;s alt
              text and its action are the same sentence and a screen reader should hear it once.
            </p>
            <CodeBlock>{`import { MediaThumbnail } from "@mosje/design-system";

<MediaThumbnail
  src={record.photos[0]}
  count={record.photos.length}
  label={\`View \${record.photos.length} training photos\`}
  emptyLabel="No photos uploaded"
  onClick={() => openLightbox(0)}
/>`}</CodeBlock>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-empty">
            <h2 id="cdp-empty" className="cdp__h2">Empty Is Drawn, Not Omitted</h2>
            <p>
              With no <code>src</code> the component draws a dashed tile carrying{" "}
              <code>emptyLabel</code>. A row with no photo says so rather than leaving a hole the
              reader has to interpret, and the tile is not focusable, because there is nothing to
              open.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-count">
            <h2 id="cdp-count" className="cdp__h2">The Badge Counts What Is Not Shown</h2>
            <p>
              Three photos draw &ldquo;+2&rdquo; on the first, because the first is already on screen.
              The badge is a solid paired fill, so it reads the same on a bright photograph and a dark
              one.
            </p>
          </section>
        </>
      }
    />
  );
}
