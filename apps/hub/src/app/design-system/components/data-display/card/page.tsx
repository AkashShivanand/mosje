import type { Metadata } from "next";
import * as React from "react";

import {
  Callout,
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
  type PropDef,
} from "@/components/design-system/docs-kit";

import { CardPlayground } from "./card-playground";

export const metadata: Metadata = {
  title: "Card — Design System",
  description:
    "A surface that groups related content — a header, a body and a footer — so a scheme summary, a metric or a news item reads as one block.",
};

/*
 * `CardProps` comes from `propsFrom` — it is a real interface over
 * React.HTMLAttributes<HTMLDivElement>. The five section components below are
 * separate exports with their own interfaces, and are documented here so the
 * page describes the whole composition rather than only its outer shell.
 */
const SECTIONS: PropDef[] = [
  {
    name: "CardHeader children",
    type: "React.ReactNode",
    required: true,
    description: "The header section, normally holding a CardTitle and a CardSubtitle.",
  },
  {
    name: "CardBody children",
    type: "React.ReactNode",
    required: true,
    description: "The main content. Cards have no fixed height, so this grows with what is in it.",
  },
  {
    name: "CardFooter children",
    type: "React.ReactNode",
    required: true,
    description: "The action row. Omit it for a card the reader only reads.",
  },
  {
    name: "CardTitle children",
    type: "React.ReactNode",
    required: true,
    description:
      "Renders an <h3>. The level is fixed, so place the card under an <h2> section heading or the document outline skips a level.",
  },
  {
    name: "CardSubtitle children",
    type: "React.ReactNode",
    required: true,
    description: "Renders a muted <p> beneath the title — the scheme's full name, a date, a department.",
  },
];

const A11Y: A11yItem[] = [
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    status: "partial",
    description:
      "A plain card is not interactive and takes no tab stop, which is correct. A card that navigates must be wrapped in a real anchor by its consumer — the component cannot make that happen, and an onClick on the div would produce a control no keyboard can reach.",
    evidence: "card.tsx renders a div with no handlers and no tabIndex.",
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    status: "partial",
    description:
      "There is no nested-interactive guard. A clickable card containing its own buttons is invalid markup that this component will render without complaint, so the rule below is enforced by review rather than by the type system.",
  },
  {
    criterion: "2.4.6 Headings and Labels",
    level: "AA",
    status: "partial",
    description:
      "CardTitle renders an <h3> and the level cannot be passed in. Check that it fits the surrounding outline before using it as a section heading.",
    evidence: "card.tsx defines CardTitle over an HTMLHeadingElement rendering h3.",
  },
  {
    criterion: "1.4.11 Non-text Contrast",
    level: "AA",
    status: "untested",
    description:
      "The outlined variant's 1px border separates the card from the page. No measurement of that border against the page background has been recorded across the three brand packs.",
  },
  {
    criterion: "2.4.7 Focus Visible",
    level: "AA",
    status: "partial",
    description:
      "A focusable card or its action must show a focus ring that meets AA contrast against the card surface, which is darker than the page. Verify this on the wrapping control, because the card itself never receives focus.",
  },
];

export default function CardPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Card"
      status="Stable"
      summary="A surface that groups related content — a heading, supporting text, media and actions — so it reads as one coherent block. Compose it from CardHeader, CardBody and CardFooter."
      figma={{ node: "card" }}
      specimen={<CardPlayground />}
      propsFrom="CardProps"
      props={SECTIONS}
      a11y={A11Y}
      whenToUse={{
        use: [
          "A page breaks into digestible regions — a scheme summary, a dashboard panel, a news item, a settings group.",
          "Each region is about one subject and can be read on its own.",
          "The region needs a footer with one action the reader can take next.",
        ],
        avoid: [
          "Everything on the page is in a card. A surface only means something against a page that is not one.",
          "The content is a set of rows to be compared — use a Data Table.",
          "The card is a headline figure and nothing else — use a Metric Card, which is built for it and handles the missing-figure states.",
          "A chart needs a titled surface with an action rail — use a Chart Card.",
          "The content demands the reader's answer before they continue — use a Modal.",
        ],
      }}
      related={[
        { label: "Metric Card", href: "/design-system/components/data-display/metric-card", reason: "for a headline figure on its own surface" },
        { label: "Chart Card", href: "/design-system/components/dashboard/chart-card", reason: "for a titled surface around a chart" },
        { label: "Profile Card", href: "/design-system/components/data-display/profile-card", reason: "for a portrait, a name and a post" },
        { label: "Portal Card", href: "/design-system/components/navigation/portal-card", reason: "for the estate's portal tiles" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-overview">
            <h2 id="cdp-overview" className="cdp__h2">
              Composition
            </h2>
            <p>
              A card is a styled surface that visually groups related content so it reads as one block.
              Compose it from <code>CardHeader</code>, <code>CardBody</code> and{" "}
              <code>CardFooter</code>, with <code>CardTitle</code> and <code>CardSubtitle</code> for
              typographic hierarchy inside the header.
            </p>
            <p>
              Keep each card focused on a single subject. The moment a card holds two subjects it needs
              two headings, and at that point it is a section of the page rather than a card.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-variants">
            <h2 id="cdp-variants" className="cdp__h2">
              Variants and Orientation
            </h2>
            <ul>
              <li>
                <strong>Outlined</strong> — a 1px border, sitting flat on the page. The default, and the
                right choice in most layouts because the card edge stays visible on a tinted background.
              </li>
              <li>
                <strong>Elevated</strong> — a shadow and no border, for a card that should lift off the
                page. Use it sparingly; a grid of elevated cards is a grid of things all claiming to be
                in front.
              </li>
              <li>
                <strong>Horizontal</strong> — <code>orientation</code> places media beside the content
                rather than above it, for a list of items with thumbnails.
              </li>
            </ul>
            <Callout type="info" title="There is no “default” variant">
              The design system ships <code>outlined</code> and <code>elevated</code>. A borderless flat
              card is an outlined card with its border removed through <code>className</code>, and it is
              rarely what a layout needs — reach for <code>outlined</code> so card edges stay visible.
            </Callout>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-actions">
            <h2 id="cdp-actions" className="cdp__h2">
              One Primary Action
            </h2>
            <p>
              <strong>Keep one primary action per card</strong> so the next step is unambiguous. A card
              with three equally weighted buttons asks the reader to make a decision the page should
              have made for them.
            </p>
            <p>
              <strong>Do not nest controls inside a card that is itself clickable.</strong> Nested
              interactive elements are invalid markup, and they leave a reader with two overlapping hit
              targets and no way to tell which one they pressed. Either the whole card navigates, or the
              controls inside it act — never both.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { Card, CardHeader, CardTitle, CardSubtitle, CardBody, CardFooter, Button } from "@mosje/design-system";

<Card variant="outlined">
  <CardHeader>
    <CardTitle>PM-AJAY</CardTitle>
    <CardSubtitle>Pradhan Mantri Anusuchit Jaati Abhyuday Yojana</CardSubtitle>
  </CardHeader>
  <CardBody>
    A consolidated scheme for the socio-economic development of Scheduled Caste
    communities across India.
  </CardBody>
  <CardFooter>
    <Button variant="primary">View Details</Button>
  </CardFooter>
</Card>`}</CodeBlock>
          <p>
            A card that navigates as a whole is wrapped in a real anchor, so the entire surface becomes
            one focusable link.
          </p>
          <CodeBlock>{`<a href="/schemes/pm-ajay" className="…">
  <Card variant="outlined">
    <CardHeader>
      <CardTitle>PM-AJAY</CardTitle>
      <CardSubtitle>Pradhan Mantri Anusuchit Jaati Abhyuday Yojana</CardSubtitle>
    </CardHeader>
    <CardBody>A consolidated scheme for Scheduled Caste communities.</CardBody>
  </Card>
</a>`}</CodeBlock>
          <p>
            Every part forwards its ref and passes native attributes through, so a card can carry an{" "}
            <code>id</code>, a <code>data-</code> attribute or a <code>style</code> without a wrapper
            element.
          </p>
        </section>
      }
      accessibility={
        <>
          <section className="cdp__section" aria-labelledby="cdp-click">
            <h2 id="cdp-click" className="cdp__h2">
              Clickable Cards Wrap, They Do Not Listen
            </h2>
            <Callout type="warning" title="Never put onClick on the card">
              If a whole card navigates, wrap the entire card in an <code>&lt;a href&gt;</code> so the
              full surface is a single, keyboard-focusable link. Do <strong>not</strong> attach{" "}
              <code>onClick</code> to a <code>&lt;div&gt;</code> — a div is not focusable, is not
              announced as a link, and cannot be operated from a keyboard.
            </Callout>
            <p>
              Wrapping only the title in a link is the other half of the same mistake: the card then
              looks clickable across its whole surface and is only clickable across four words of it.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-heading">
            <h2 id="cdp-heading" className="cdp__h2">
              Headings and Focus
            </h2>
            <p>
              <code>CardTitle</code> renders an <code>h3</code>, so a card belongs under an{" "}
              <code>h2</code> section heading. A grid of cards under an <code>h1</code> skips a level and
              a screen-reader user navigating by heading loses the structure.
            </p>
            <p>
              A focusable card, or the action inside it, must show a visible focus ring meeting AA
              contrast <em>against the card surface</em> — which is not the page background, and is the
              reason a ring that passes elsewhere can fail here.
            </p>
          </section>
        </>
      }
    />
  );
}
