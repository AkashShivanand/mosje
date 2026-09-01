import type { Metadata } from "next";
import * as React from "react";

import {
  Callout,
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
} from "@/components/design-system/docs-kit";

import { FormCardPlayground } from "./form-card-playground";

export const metadata: Metadata = {
  title: "Form Card — Design System",
  description:
    "The sibling of Form Section: the same card chrome and section title, with an arbitrary body instead of a field grid.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "A real `<section>` labelled by its own `<h2>` through `aria-labelledby`, so the group is a named region.",
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
      "The title is a real heading at the same level and appearance as every Form Section on the estate, so a form's structure is consistent whatever a given card contains.",
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    description:
      "`headingId` lets a child inside the body take the heading as its own accessible name, which is how a data table in a card is named without repeating the title.",
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
      summary="The sibling of Form Section: the same card chrome and the same section title, with an arbitrary body instead of a field grid. It exists so a section whose content is not a grid still carries an identical header."
      figma={{ absent: "Not yet published in the Figma library." }}
      specimen={<FormCardPlayground />}
      propsFrom="FormCardProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A form section holds a data table, a repeatable card list, or mixed content rather than a grid of fields.",
          "The header needs a right-aligned action — an Add button for a list the reader extends.",
          "A child inside the body must be labelled by the section heading, which `headingId` makes possible.",
        ],
        avoid: [
          "The body is a plain grid of fields — use Form Section, which lays the grid out for you.",
          "The card is not part of a form at all — use Card, which carries no form heading conventions.",
          "The heading belongs to the page rather than a section — use Page Header.",
        ],
      }}
      related={[
        {
          label: "Form Section",
          href: "/design-system/components/forms/form-section",
          reason: "when the body is a plain field grid",
        },
        {
          label: "Card",
          href: "/design-system/components/data-display/card",
          reason: "for a surface outside a form",
        },
        {
          label: "Data Table",
          href: "/design-system/components/data-display/data-table",
          reason: "the commonest body this card holds",
        },
        {
          label: "Wizard",
          href: "/design-system/components/forms/wizard",
          reason: "the multi-step shell these cards sit inside",
        },
      ]}
      design={
        <section className="cdp__section" aria-labelledby="cdp-hand-rolled">
          <h2 id="cdp-hand-rolled" className="cdp__h2">
            Why It Exists
          </h2>
          <Callout type="warning" title="Do Not Hand-Roll a Section Card">
            Never build a bare <code>&lt;section&gt;</code> with its own heading classes for a
            custom-layout group. The heading drifts from Form Section — a different size, a different
            colour, a different weight — and the two sit next to each other on the same form. Form
            Card keeps them in lockstep by sharing the stylesheet.
          </Callout>
          <p>
            Form Card and Form Section share <code>form-section.css</code> and render the same header
            markup. Changing one header changes both, which is the property that makes the pair worth
            having rather than one component with a layout switch.
          </p>
        </section>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { Button, FormCard } from "@mosje/design-system";

<FormCard
  title="Uploaded Documents"
  description="Every document must be legible and under 5 MB."
  actions={<Button appearance="text" size="sm">Add Document</Button>}
>
  <table className="ds-table">
    <tbody>
      <tr><td>Aadhaar card.pdf</td></tr>
    </tbody>
  </table>
</FormCard>`}</CodeBlock>
          <p>
            Where the body is a table, pass <code>headingId</code> and let the table take it as its
            accessible name, so the heading is not written out twice.
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
            The heading is an <code>&lt;h2&gt;</code>, matching Form Section. Anything inside the body
            that needs its own heading starts at <code>&lt;h3&gt;</code>, so the level is never
            skipped.
          </p>
          <p>
            <code>actions</code> sits in the header row and is reached by keyboard before the body. An
            action that operates on a specific row belongs in that row, not here — a header action
            that acts on something further down the card cannot be understood from its own label.
          </p>
        </section>
      }
    />
  );
}
