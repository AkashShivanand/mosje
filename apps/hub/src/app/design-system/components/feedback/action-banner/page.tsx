import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
  type PropDef,
} from "@/components/design-system/docs-kit";

import { ActionBannerPlayground } from "./action-banner-playground";

export const metadata: Metadata = {
  title: "Action Banner — Design System",
  description:
    "A call to action at the end of a section: a title, an optional sentence, and one control. Two variants share one content model.",
};

/*
 * Read off `ActionBannerProps` in
 * packages/design-system/components/feedback/action-banner.tsx. The interface
 * extends `Omit<React.HTMLAttributes<HTMLDivElement>, "title">`, so every
 * standard div attribute passes through and is not listed individually.
 */
const PROPS: PropDef[] = [
  {
    name: "title",
    type: "React.ReactNode",
    required: true,
    description:
      "The headline, rendered as a real heading so the call to action appears in the document outline.",
  },
  {
    name: "action",
    type: "React.ReactNode",
    required: true,
    description:
      "The control. A slot, so it holds whatever it is given — but one control only. A banner with two equal buttons has no call to action; it has a decision.",
  },
  {
    name: "description",
    type: "React.ReactNode",
    default: "undefined",
    description: "One supporting sentence under the title. Omit it where the title already says everything.",
  },
  {
    name: "variant",
    type: '"banner" | "card"',
    default: '"banner"',
    description:
      "`banner` is the full-width strip that ends a section, text left and action right. `card` is the same content in a column for a grid of two or three, stretched to equal height with the action pinned to the bottom so a row of cards lines its buttons up.",
  },
  {
    name: "as",
    type: '"h2" | "h3" | "h4"',
    default: '"h3"',
    description:
      "Heading level for the title. The default suits a banner inside a section that already carries an `h2`; raise or lower it so the page's outline does not skip a level.",
  },
  {
    name: "className",
    type: "string",
    default: "undefined",
    description: "Merged onto the root element.",
  },
];

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "The title renders as a real heading element, so the call to action is part of the document outline rather than styled text that only looks like a heading.",
  },
  {
    criterion: "2.4.6 Headings and Labels",
    level: "AA",
    description:
      "`as` exists so the heading takes the level the surrounding page needs. A banner dropped into a section that already owns an `h2` keeps the default `h3` and does not skip a level.",
  },
  {
    criterion: "2.4.1 Bypass Blocks",
    level: "A",
    description:
      "The panel is deliberately not a landmark and not a labelled region. Naming it as one would add a stop to the landmark list that leads to a paragraph and a button.",
  },
  {
    criterion: "1.4.3 Contrast (Minimum)",
    level: "AA",
    description:
      "The panel resolves its colour through `--sa-color-primaryScale-*`, so it follows `data-brand` in every mode rather than carrying a fixed hex that is only checked in one.",
  },
];

export default function ActionBannerPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Action Banner"
      status="Stable"
      summary="A call to action: a title, an optional sentence, and one control. The banner variant is the full-width strip that ends a page section; the card variant is the same content in a column, for a grid of two or three parallel offers."
      figma={{ absent: "Not yet published in the Figma library." }}
      specimen={<ActionBannerPlayground />}
      props={PROPS}
      a11y={A11Y}
      whenToUse={{
        use: [
          "A page section ends and the reader has one obvious next step — apply, sign in, get in touch.",
          "Two or three parallel offers sit side by side and each needs its own control; use the card variant so the buttons line up.",
          "The action is a route the reader chooses, not a response to something that just happened.",
        ],
        avoid: [
          "The message reports the outcome of something the reader just did — use a Toast, which appears and leaves on its own.",
          "The message is a standing condition the reader must read before continuing — use an Alert, which stays and carries a status colour.",
          "There is nothing to display yet and the reader needs a way to start — use an Empty State, which explains the absence as well as offering the action.",
          "A second banner would appear on the same page. One call to action per page; a second one halves the first.",
        ],
      }}
      related={[
        {
          label: "Alert",
          href: "/design-system/components/feedback/alert",
          reason: "for a standing condition the reader must act on",
        },
        {
          label: "Empty State",
          href: "/design-system/components/feedback/empty-state",
          reason: "when the action is offered because there is nothing to show",
        },
        {
          label: "Button",
          href: "/design-system/components/actions/button",
          reason: "the control the action slot usually holds",
        },
      ]}
      design={
        <section className="cdp__section" aria-labelledby="cdp-variants">
          <h2 id="cdp-variants" className="cdp__h2">
            Two Variants, One Content Model
          </h2>
          <p>
            <strong>Banner</strong> is full width, text left and action right, and belongs at the
            foot of a section. <strong>Card</strong> is the same content turned into a column, for a
            grid of parallel offers.
          </p>
          <p>
            They are variants rather than two components because the content is identical and only
            the axis changes. A second component would be a second thing to keep in step, and the
            first symptom of that is two calls to action on one estate with different padding.
          </p>
          <p>
            The card variant stretches and pins its action to the bottom, so every card in a grid is
            the same height and every button sits on one line whatever length the descriptions run
            to. That single rule is what makes a card grid look composed rather than assembled.
          </p>
        </section>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { ActionBanner, buttonClasses } from "@mosje/design-system";

<ActionBanner
  title="Need Help With a Scheme or an Application?"
  description="Write to the department and an officer will respond."
  action={
    <Link href="/website/contact-us" className={buttonClasses("primary", "filled", "md")}>
      Get in Touch
    </Link>
  }
/>`}</CodeBlock>
          <p>
            A grid of three, equal height with the buttons aligned, is the card variant repeated —
            the component does the pinning, the consumer does the grid.
          </p>
          <CodeBlock>{`{offers.map((offer) => (
  <ActionBanner key={offer.id} variant="card" {...offer} />
))}`}</CodeBlock>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-outline">
          <h2 id="cdp-outline" className="cdp__h2">
            Fitting the Page Outline
          </h2>
          <p>
            The title is a heading, so it inherits the page&apos;s hierarchy rather than sitting
            outside it. Before placing a banner, read the level of the heading above it: inside a
            section owning an <code>h2</code>, the default <code>h3</code> is correct; directly
            under an <code>h1</code>, pass <code>as=&quot;h2&quot;</code>.
          </p>
          <p>
            The component has no tab stop of its own. Everything a keyboard user reaches inside it
            is whatever was passed to <code>action</code>, so that control carries its own
            accessible name and focus ring.
          </p>
        </section>
      }
    />
  );
}
