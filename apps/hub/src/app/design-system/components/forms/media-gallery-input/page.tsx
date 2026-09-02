import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
} from "@/components/design-system/docs-kit";

import { MediaGalleryInputPlayground } from "./media-gallery-input-playground";

export const metadata: Metadata = {
  title: "Media Gallery Input — Design System",
  description:
    "A multi-file dropzone for images and video, with a thumbnail grid, captured video poster frames, and client-side type, size and capacity checks.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    description:
      "Both the empty dropzone and the add tile are real buttons, and every item's remove control is a real button. Dragging is an addition, never the only route.",
  },
  {
    criterion: "2.5.7 Dragging Movements",
    level: "AA",
    description: "Everything drag and drop achieves is also achieved by clicking and using the platform's own picker.",
  },
  {
    criterion: "1.1.1 Non-text Content",
    level: "A",
    description:
      "Each image thumbnail carries the file name as its alt text, and each remove button names the item it removes — \"Remove site-photo-3.jpg\" — so a screen-reader user knows which one they are about to delete.",
  },
  {
    criterion: "3.3.1 Error Identification",
    level: "A",
    description:
      "A rejected file renders a message with `role=\"alert\"` naming the reason — wrong type, over the size limit, or the gallery already full.",
  },
  {
    criterion: "2.5.8 Target Size (Minimum)",
    level: "AA",
    description: "The add tile is a large block target, and each item's remove control clears 24×24.",
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    description:
      "The operable control carries the `id` Form Field generated, so the visible label names the add tile rather than the hidden file input.",
  },
];

export default function MediaGalleryInputPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Media Gallery Input"
      status="Stable"
      summary="A multi-file dropzone for images and video. It reads each file locally, draws a thumbnail grid with a poster frame captured from each video, and enforces the type, size and capacity limits before anything reaches the network."
      figma={{ absent: "Not yet published in the Figma library." }}
      specimen={<MediaGalleryInputPlayground />}
      propsFrom="MediaGalleryInputProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "The reader supplies several visual files — event photographs, inspection evidence, supporting images for a claim.",
          "Video is a legitimate answer alongside photographs.",
          "The reader should see what they have attached, and be able to remove one item without starting again.",
        ],
        avoid: [
          "Exactly one file is expected — use Media Upload, which spends far less of the page on it.",
          "Each photograph must carry a location — use Geo Photo Input, which reads the coordinates and compresses the image.",
          "The files are documents rather than media. A grid of identical file glyphs is worse than a list; use Media Upload inside a Form Card.",
        ],
      }}
      related={[
        {
          label: "Media Upload",
          href: "/design-system/components/forms/media-upload",
          reason: "when exactly one file is expected",
        },
        {
          label: "Geo Photo Input",
          href: "/design-system/components/forms/geo-photo-input",
          reason: "when each photograph must carry a location",
        },
        {
          label: "Lightbox",
          href: "/design-system/components/feedback/lightbox",
          reason: "for viewing an attached image at full size",
        },
        {
          label: "Form Field",
          href: "/design-system/components/forms/form-field",
          reason: "the label, hint and error wiring this control expects",
        },
      ]}
      design={
        <section className="cdp__section" aria-labelledby="cdp-states">
          <h2 id="cdp-states" className="cdp__h2">
            Empty, Filling, Full
          </h2>
          <p>
            With no items the control is a single dropzone. Once anything is attached it becomes a
            thumbnail grid with a trailing add tile, and each item carries its own remove control.
            Once <code>maxItems</code> is reached the add tile is gone, so the capacity limit is shown
            by the interface rather than only enforced by a message.
          </p>
          <p>
            A video is drawn from a poster frame captured when it was added, with a play marker over
            it. That is what stops a gallery of videos rendering as a row of identical grey tiles.
          </p>
        </section>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { FormField, MediaGalleryInput } from "@mosje/design-system";
import type { GalleryMediaItem } from "@mosje/design-system";

const [items, setItems] = React.useState<GalleryMediaItem[]>([]);

<FormField
  label="Inspection Evidence"
  hint="Up to 10 photographs or short videos, 50 MB each."
>
  {(control) => (
    <MediaGalleryInput
      {...control}
      value={items}
      onChange={setItems}
      maxItems={10}
      maxSizeMb={50}
    />
  )}
</FormField>`}</CodeBlock>
          <p>
            State the same limits in the hint that you pass as props. The control enforces them either
            way, but a reader who only discovers a limit by hitting it has been told nothing.
          </p>
          <CodeBlock>{`<MediaGalleryInput
  accept="image/*"
  maxItems={6}
  value={photographs}
  onChange={setPhotographs}
/>`}</CodeBlock>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-a11y-notes">
          <h2 id="cdp-a11y-notes" className="cdp__h2">
            Notes
          </h2>
          <p>
            Every remove button names its own item, so a screen-reader user moving through the grid
            hears &quot;Remove site-photo-3.jpg&quot; rather than six buttons all called
            &quot;Remove&quot;. Keep the original file names for that reason; renaming them to
            sequence numbers takes the distinction away.
          </p>
          <p>
            <code>required</code> is accepted and dropped on purpose, exactly as in Media Upload.
            Enforce the requirement in your own validation and report it through Form Field&apos;s{" "}
            <code>error</code>.
          </p>
        </section>
      }
    />
  );
}
