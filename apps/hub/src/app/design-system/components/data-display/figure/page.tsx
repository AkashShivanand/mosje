import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
} from "@/components/design-system/docs-kit";
import { Figure } from "@mosje/design-system";

export const metadata: Metadata = {
  title: "Figure — Design System",
  description:
    "An image and its caption as one thing, using real figure and figcaption markup so the caption is associated with the picture rather than read as the next paragraph.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    status: "verified",
    evidence:
      "The component renders <figure> with a <figcaption> child, so the caption is programmatically associated with the image. Read from the rendered DOM on this page.",
    description:
      "The caption belongs to the picture in the markup, not merely in the layout.",
  },
  {
    criterion: "1.4.10 Reflow",
    level: "AA",
    status: "verified",
    evidence:
      "The frame is width: 100% of its container and the image fills it; locked ratios use aspect-ratio rather than a fixed height. Measured at 320px in the browser: the figure and its caption fit with no horizontal scroll.",
    description: "The figure scales to its container at every width.",
  },
];

const IMG = (src: string, alt: string) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src={src} alt={alt} />
);

export default function FigurePage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Figure"
      status="Stable"
      summary="An image and its caption as one thing. The figure and figcaption pairing is what associates the two — a caption in a sibling paragraph is read as the next paragraph, with nothing to say it describes the picture."
      figma={{ absent: "Master pending in the SAMAVESH library — tracked on the component record." }}
      specimen={
        <div
          style={{
            padding: "var(--sa-padding-32)",
            background: "var(--sa-bg-neutral-subtle)",
            borderRadius: "var(--sa-shape-8)",
            display: "grid",
            gap: "var(--sa-inline-24)",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(15rem, 100%), 1fr))",
          }}
        >
          <Figure
            ratio="video"
            caption="Adarsh Gram village, Bankura district, West Bengal."
            credit="Photograph: PM-AJAY Management Information System"
          >
            {IMG(
              "https://placehold.co/1200x675/0373DF/FFFFFF?text=Scheme+photograph",
              "A village road with newly laid paving and street lighting.",
            )}
          </Figure>
          <Figure
            ratio="portrait"
            fit="contain"
            caption="Sanction order, AVYAY 2026-27."
          >
            {IMG(
              "https://placehold.co/900x1200/EEF0F3/1E2124?text=Sanction+order",
              "Scanned sanction order dated 3 September 2026.",
            )}
          </Figure>
        </div>
      }
      propsFrom="FigureProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A photograph, diagram or scan needs a caption the reader will see.",
          "The source of a picture has to be named — a directorate, a photographer, a scheme report.",
          "A set of images must share one shape, so a grid of them does not stagger.",
        ],
        avoid: [
          "The image is purely decorative and says nothing — then it needs an empty alt and no caption, and a plain image element is enough.",
          "The picture is a chart the system already draws — use the chart component, which is readable rather than a picture of numbers.",
          "The image is a logo inside a control — use Org Logo or Brand Glyph, which know their own sizes.",
        ],
      }}
      related={[
        {
          label: "Lightbox",
          href: "/design-system/components/feedback/lightbox",
          reason: "when a picture has to be opened at full size",
        },
        {
          label: "Org Logo",
          href: "/design-system/components/brand/org-logo",
          reason: "for an organisation's mark, which has its own resolution rules",
        },
        {
          label: "Illustration",
          href: "/design-system/foundations/illustration",
          reason: "for the estate's own drawn scenes",
        },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-alt">
            <h2 id="cdp-alt" className="cdp__h2">
              A Caption Is Not Alt Text
            </h2>
            <p>
              The caption is read by everyone. The alt text stands in for the picture when it
              cannot be seen. They answer different questions, and where they would say the same
              thing the image is decorative and its <code>alt</code> should be empty rather than
              repeating the caption to a screen-reader user twice.
            </p>
            <p>
              This component deliberately does not accept an <code>alt</code> prop. Only the caller
              knows what the picture is doing on the page — the same photograph is decorative beside
              a heading and load-bearing on an evidence screen — so the alt goes on the image element
              the caller passes.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-1111">
            <h2 id="cdp-1111" className="cdp__h2">
              Why 1.1.1 Is Not on the Checklist
            </h2>
            <p>
              WCAG 1.1.1 Non-text Content is the criterion this component most obviously touches,
              and it is deliberately absent from the list above. It is not this component&apos;s to
              meet or fail: the alternative text lives on the image element the caller passes, and
              claiming it here would put a tick against work done somewhere else.
            </p>
            <p>
              Every specimen on this page carries a real <code>alt</code>, and the estate&apos;s axe
              run covers rendered pages rather than components — which is the right place for that
              criterion to be checked.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-fit">
            <h2 id="cdp-fit" className="cdp__h2">
              Cover Crops; Contain Does Not
            </h2>
            <p>
              <code>fit=&quot;cover&quot;</code> fills the frame and crops what does not fit, which
              is right for a photograph. <code>fit=&quot;contain&quot;</code> fits the whole image
              and leaves ground around it, which is right for a logo, a certificate or a scanned
              document — cropping a sanction order removes the seal, the signature or the reference
              number, which is the reason the scan is on the page.
            </p>
            <p>
              <code>ratio=&quot;auto&quot;</code> locks nothing and lets the image set its own
              height. Use it for a diagram or a screenshot, where any crop removes information.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-credit">
            <h2 id="cdp-credit" className="cdp__h2">
              Credit
            </h2>
            <p>
              A departmental photograph with no attribution is a photograph nobody can check, and on
              a government page the source is part of the content rather than a nicety. Name the
              directorate, the system or the photographer.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { Figure } from "@mosje/design-system";
import Image from "next/image";

<Figure
  ratio="video"
  caption="Adarsh Gram village, Bankura district, West Bengal."
  credit="Photograph: PM-AJAY Management Information System"
>
  <Image
    src={photo}
    alt="A village road with newly laid paving and street lighting."
    width={1200}
    height={675}
  />
</Figure>`}</CodeBlock>
          <p>
            The image element is the caller&apos;s, so <code>next/image</code> works here exactly as
            it does anywhere else. This component imports no image library, which is what keeps it
            usable in Storybook and in a portal alike.
          </p>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-assoc">
          <h2 id="cdp-assoc" className="cdp__h2">
            Why the Markup Matters
          </h2>
          <p>
            A caption in a sibling <code>&lt;p&gt;</code> is read as the next paragraph. A
            screen-reader user meets a sentence — &ldquo;Adarsh Gram village, Bankura district&rdquo;
            — with nothing to say it describes the picture they have just passed, and on a page of
            six images they have six unattached sentences.
          </p>
          <p>
            <code>&lt;figure&gt;</code> and <code>&lt;figcaption&gt;</code> make the association in
            the markup. It costs nothing visually and it is the only reason to reach for this
            component rather than an image and a paragraph.
          </p>
        </section>
      }
    />
  );
}
