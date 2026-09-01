import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
  type PropDef,
} from "@/components/design-system/docs-kit";

import { LightboxSpecimen } from "./lightbox-specimen";

export const metadata: Metadata = {
  title: "Lightbox — Design System",
  description:
    "A full-screen viewer for a gallery of images and video: prev and next, an item counter, a caption bar and a thumbnail strip.",
};

/*
 * Read off `LightboxProps` and `LightboxItem` in
 * packages/design-system/components/feedback/lightbox.tsx. `LightboxProps` is a
 * standalone interface — it does NOT extend HTMLAttributes.
 *
 * Corrected 2026-09-02: the previous table carried three props and omitted
 * `index`, `onIndexChange`, `className` and the shape of `LightboxItem`.
 */
const PROPS: PropDef[] = [
  {
    name: "open",
    type: "boolean",
    required: true,
    description:
      "Whether the viewer is mounted. It renders nothing when false, when `items` is empty, or when the active index resolves to no item.",
  },
  {
    name: "items",
    type: "LightboxItem[]",
    required: true,
    description:
      "The ordered media. Each is `{ type: \"image\" | \"video\"; src: string; caption?: string; poster?: string; alt?: string }`. An empty list renders nothing rather than an empty black screen.",
  },
  {
    name: "onClose",
    type: "() => void",
    required: true,
    description: "Called on Escape, on the backdrop, and on the close control.",
  },
  {
    name: "index",
    type: "number",
    default: "0",
    description:
      "The item to open on, zero-based. It is clamped into range and re-read every time the viewer is reopened, so a gallery always opens on the thumbnail that was pressed.",
  },
  {
    name: "onIndexChange",
    type: "(index: number) => void",
    default: "undefined",
    description:
      "Notified whenever the active item changes. The viewer owns the index internally, so this reports rather than controls.",
  },
  {
    name: "className",
    type: "string",
    default: "undefined",
    description: "Merged onto the root element, which renders in a portal on document.body.",
  },
];

const A11Y: A11yItem[] = [
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    description:
      "Escape closes the viewer and the left and right arrows page through the gallery, so the whole component is operable without a pointer. The stage is focused on open, which is what makes those keys land.",
  },
  {
    criterion: "1.1.1 Non-text Content",
    level: "A",
    description:
      "Each image takes its alt text from `alt`, falling back to `caption`. Every control — close, previous, next, and each thumbnail — carries an explicit aria-label, and the decorative thumbnail images carry an empty alt.",
  },
  {
    criterion: "4.1.3 Status Messages",
    level: "AA",
    description:
      'The item counter is a polite live region, so paging through a gallery announces "3 / 8" without focus moving.',
  },
  {
    criterion: "1.3.2 Meaningful Sequence",
    level: "A",
    description:
      "Background scrolling is locked while the viewer is open and the previous value is restored on close, so the page behind stays where the reader left it.",
  },
  {
    criterion: "1.4.2 Audio Control",
    level: "A",
    description:
      "Videos render with native controls, so a clip that autoplays on opening can be paused, muted and scrubbed with the browser's own interface.",
  },
];

export default function LightboxPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Lightbox"
      status="Beta"
      summary="A full-screen viewer for a gallery of mixed images and video: previous and next, an item counter, a caption bar and a thumbnail strip. It renders through a portal, so no table's overflow can clip it."
      figma={{ absent: "Not yet published in the Figma library." }}
      specimen={<LightboxSpecimen />}
      props={PROPS}
      a11y={A11Y}
      whenToUse={{
        use: [
          "A thumbnail opens the full image — an inspection photograph, a scanned certificate, an event gallery.",
          "Several media items belong together and the reader should be able to page between them without returning to the list.",
          "The item is a video that needs the screen, with the page behind it held still.",
        ],
        avoid: [
          "The content is a form, a record or anything the reader edits — use a Side Sheet, or a Modal for a short decision.",
          "There is exactly one small image that is already legible in place. A full-screen viewer for it is a step the reader did not need.",
          "The document is a PDF the reader will want to keep — link to the file, so the browser's own viewer and the download are available.",
        ],
      }}
      related={[
        {
          label: "Modal",
          href: "/design-system/components/feedback/modal",
          reason: "for a decision rather than a viewing",
        },
        {
          label: "Media Gallery Input",
          href: "/design-system/components/forms/media-gallery-input",
          reason: "the control that collects the media a lightbox later shows",
        },
        {
          label: "Side Sheet",
          href: "/design-system/components/feedback/side-sheet",
          reason: "when the media sits beside a record being worked on",
        },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-anatomy">
            <h2 id="cdp-anatomy" className="cdp__h2">
              Anatomy
            </h2>
            <ol>
              <li>
                <strong>Backdrop</strong> — the full-screen scrim. Pressing it closes the viewer.
              </li>
              <li>
                <strong>Bar</strong> — the item counter and the close control, top right.
              </li>
              <li>
                <strong>Stage</strong> — the image, contained rather than cropped, or the video with
                native controls.
              </li>
              <li>
                <strong>Slidenav</strong> — previous and next, shown only when there is more than
                one item.
              </li>
              <li>
                <strong>Footer</strong> — the caption, then the thumbnail strip.
              </li>
            </ol>
            <p>
              Everything that depends on there being several items — the counter, the slidenav, the
              thumbnails — is absent for a single item. A viewer showing one photograph does not
              draw controls that lead nowhere.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-captions">
            <h2 id="cdp-captions" className="cdp__h2">
              Give Every Item a Caption
            </h2>
            <p>
              The caption is what names the item on screen, and it is also the fallback for the
              image&apos;s alt text and the dialog&apos;s own accessible name. An item with no
              caption and no <code>alt</code> is announced as “Item 3”, and the dialog is left
              without a name at all.
            </p>
            <p>
              Caption a departmental photograph as the department would — what it shows and where —
              rather than describing the file.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <p>
            The viewer is an overlay, so a consumer holds the open state and the starting index and
            passes both in.
          </p>
          <CodeBlock>{`import { Lightbox } from "@mosje/design-system";

const [open, setOpen] = React.useState(false);
const [index, setIndex] = React.useState(0);

<Lightbox
  open={open}
  index={index}
  onIndexChange={setIndex}
  onClose={() => setOpen(false)}
  items={[
    { type: "image", src: "/inspection/1.jpg", caption: "Hostel kitchen, Nagpur — inspected 12 Aug 2026" },
    { type: "video", src: "/inspection/walkthrough.mp4", poster: "/inspection/1.jpg", caption: "Site walkthrough" },
  ]}
/>`}</CodeBlock>
          <p>
            <code>index</code> is re-read every time <code>open</code> becomes true, so opening from
            the sixth thumbnail lands on the sixth item without the consumer resetting anything
            between openings.
          </p>
        </section>
      }
      accessibility={
        <>
          <section className="cdp__section" aria-labelledby="cdp-keys">
            <h2 id="cdp-keys" className="cdp__h2">
              Keyboard
            </h2>
            <ul>
              <li>
                <strong>Escape</strong> — closes the viewer.
              </li>
              <li>
                <strong>Right arrow</strong> — the next item, wrapping from the last to the first.
              </li>
              <li>
                <strong>Left arrow</strong> — the previous item, wrapping from the first to the
                last.
              </li>
              <li>
                <strong>Tab</strong> — moves through the close control, the slidenav and the
                thumbnails.
              </li>
            </ul>
            <p>
              The stage receives focus when the viewer opens, which is what puts the arrow keys and
              Escape in reach immediately. It is a programmatic target only — it takes no tab stop
              of its own.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-open">
            <h2 id="cdp-open" className="cdp__h2">
              Two Things a Consumer Must Handle
            </h2>
            <p>
              The viewer declares <code>aria-modal=&quot;true&quot;</code>, but{" "}
              <strong>it does not trap Tab and it does not restore focus on close</strong>. A
              keyboard user can tab out of the viewer into the page behind it, and on closing, focus
              returns to the document rather than to the thumbnail that opened it.
            </p>
            <p>
              Until that is fixed in the component, restore focus from the consumer — keep a ref to
              the trigger and focus it in the <code>onClose</code> handler. This is recorded here
              rather than left to be rediscovered, and is the reason the component is marked Beta.
            </p>
            <p>
              The second is the dialog&apos;s name.{" "}
              <code>aria-labelledby</code> points at the caption, which is only rendered when the
              active item has one — so an uncaptioned gallery opens a dialog with no accessible
              name. Caption every item.
            </p>
          </section>
        </>
      }
    />
  );
}
