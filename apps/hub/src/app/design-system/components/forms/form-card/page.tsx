import type { Metadata } from "next";
import * as React from "react";

import { Callout, CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";

import { FormCardPlayground } from "./form-card-playground";

export const metadata: Metadata = {
  title: "Form Card — Design System",
  description:
    "The sibling of Form Section: the same uppercase label and rule, over an arbitrary body — repeatable entries, a table, document tiles — instead of a field grid.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "A real `<section>` labelled by its own heading (an `<h3>` by default) through `aria-labelledby`, so the group is a named region nested under the panel's heading.",
  },
  {
    criterion: "1.4.1 Use of Colour",
    level: "A",
    description:
      "The required marker is a glyph rather than a colour change, so it survives a monochrome rendering.",
  },
  {
    criterion: "2.4.6 Headings and Labels",
    level: "AA",
    description:
      "The title is a real heading at the same level and appearance as every Form Section on the estate, so a form's structure is consistent whatever a given sub-section contains.",
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    description:
      "`headingId` lets a child inside the body take the heading as its own accessible name, which is how a data table in a sub-section is named without repeating the title.",
  },
  {
    criterion: "GIGW 3.0 — Forms",
    level: "GIGW",
    description:
      "Related content is grouped under a heading, and the required marker is paired with a programmatic requirement rather than standing alone.",
  },
];

export default function FormCardPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Form Card"
      status="Stable"
      summary="The sibling of Form Section: the same uppercase label and hairline rule, over an arbitrary body instead of a field grid — repeatable entries, a table, document tiles. Despite its name it draws no card of its own; since the form-wizard visual language, the step's Form Panel is the card."
      figma={{ absent: "Not yet published in the Figma library." }}
      specimen={<FormCardPlayground />}
      propsFrom="FormCardProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A sub-section holds repeatable entries (Form Inset), a data table or document tiles rather than a grid of fields.",
          "The head needs an action at the end of its row — Edit on a review step.",
          "A child inside the body must be labelled by the section heading, which `headingId` makes possible.",
        ],
        avoid: [
          "The body is a plain grid of fields — use Form Section, which lays the grid out for you.",
          "A bordered box is wanted around the group — the step's Form Panel is the box. A card per sub-section is the drift this component no longer draws.",
          "The content is not part of a form at all — use Card, which carries no form heading conventions.",
        ],
      }}
      related={[
        {
          label: "Form Section",
          href: "/design-system/components/forms/form-section",
          reason: "when the body is a plain field grid",
        },
        {
          label: "Form Panel",
          href: "/design-system/components/forms/form-panel",
          reason: "the one card the sub-sections sit inside",
        },
        {
          label: "Form Inset",
          href: "/design-system/components/forms/form-inset",
          reason: "the entries of a repeatable group",
        },
        {
          label: "Document Tile",
          href: "/design-system/components/forms/document-tile",
          reason: "the documents on an upload step",
        },
        {
          label: "Data Table",
          href: "/design-system/components/data-display/data-table",
          reason: "a tabular body, such as a repeater of family members",
        },
        {
          label: "Wizard",
          href: "/design-system/components/forms/wizard",
          reason: "the multi-step shell that draws the panel for each step",
        },
      ]}
      design={
        <section className="cdp__section" aria-labelledby="cdp-hand-rolled">
          <h2 id="cdp-hand-rolled" className="cdp__h2">
            Why It Exists
          </h2>
          <Callout type="warning" title="Do Not Hand-Roll a Sub-Section Head">
            Never build a bare <code>&lt;section&gt;</code> with its own heading classes for a custom-layout
            group. The heading drifts from Form Section — a different size, a different colour, a different
            weight — and the two sit next to each other on the same step. Form Card keeps them in lockstep by
            sharing the head.
          </Callout>
          <p>
            Form Card, Form Section and Review Section render one shared head: the label in Label 1, medium,
            uppercase, in <code>text/neutral/subtle</code>, a hairline rule filling the rest of the row, an
            optional <code>badge</code> between the two and <code>actions</code> at the end. The body sits 16
            below it. Changing the head changes all three.
          </p>
          <p>
            The name is historical. Until the form-wizard visual language this component drew a bordered card
            per sub-section; it now draws none, and the step&rsquo;s Form Panel is the only card on the step.
            A step whose sub-sections each sat in a card should drop those cards, not restyle them.
          </p>
        </section>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { Button, DocumentTile, DocumentTiles, FormCard } from "@mosje/design-system";

<FormCard
  title="Identity Documents"
  required
  actions={<Button appearance="text" size="sm">Edit</Button>}
>
  <DocumentTiles>
    <DocumentTile title="Aadhaar Card" required state="upcoming" meta="PDF · up to 2 MB" />
  </DocumentTiles>
</FormCard>`}</CodeBlock>
          <p>
            Where the body is a table, pass <code>headingId</code> and let the table take it as its accessible
            name, so the heading is not written out twice.
          </p>
          <CodeBlock>{`<FormCard title="Sanctioned Hostels" headingId="hostels-heading">
  <table aria-labelledby="hostels-heading">…</table>
</FormCard>`}</CodeBlock>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-a11y-notes">
          <h2 id="cdp-a11y-notes" className="cdp__h2">
            Notes
          </h2>
          <p>
            The heading is an <code>&lt;h3&gt;</code> by default, matching Form Section, under the
            panel&rsquo;s <code>&lt;h2&gt;</code>. Pass <code>as</code> to move it where the panel sits at a
            different level. Anything inside the body that needs its own heading starts one level below, so
            the level is never skipped.
          </p>
          <p>
            <code>actions</code> sits in the head row and is reached by keyboard before the body. An action
            that operates on a specific row belongs in that row, not here — a header action that acts on
            something further down the card cannot be understood from its own label.
          </p>
        </section>
      }
    />
  );
}
