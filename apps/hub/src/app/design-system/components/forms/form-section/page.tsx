import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
} from "@/components/design-system/docs-kit";

import { FormSectionPlayground } from "./form-section-playground";

export const metadata: Metadata = {
  title: "Form Section — Design System",
  description:
    "A titled surface card wrapping a responsive one-, two- or three-column field grid. The shared form-layout primitive across the estate.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "A real `<section>` labelled by its own `<h2>` through `aria-labelledby`, so the group is a landmark a screen reader can jump between.",
  },
  {
    criterion: "1.4.10 Reflow",
    level: "AA",
    description:
      "The grid collapses to one column on narrow viewports, so a form reflows to 320px without horizontal scrolling.",
  },
  {
    criterion: "2.4.6 Headings and Labels",
    level: "AA",
    description:
      "The title is a real heading, so the form's structure is navigable by heading rather than by tabbing through every field.",
  },
  {
    criterion: "3.2.3 Consistent Navigation",
    level: "AA",
    description:
      "Every section header on the estate is this component, so the same grouping cue appears in the same place on every form.",
  },
  {
    criterion: "GIGW 3.0 — Forms",
    level: "GIGW",
    description:
      "Related fields are grouped under a heading rather than presented as one undifferentiated list of controls.",
  },
];

export default function FormSectionPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Form Section"
      status="Stable"
      summary="A titled surface card wrapping a responsive field grid. It is the shared form-layout primitive: one section per logical group of fields, so related inputs read as a unit and a long form never becomes one undifferentiated wall of controls."
      figma={{ absent: "Not yet published in the Figma library." }}
      specimen={<FormSectionPlayground />}
      propsFrom="FormSectionProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A group of related fields needs a heading — Personal Details, Address, Bank Account.",
          "The group's layout is a simple grid of one, two or three equal columns.",
          "A wizard step's body, which is normally one or more of these sections.",
        ],
        avoid: [
          "The body is not a field grid — a repeatable card list, a data table, mixed content. Use Form Card, which has the same header and an arbitrary body.",
          "There is only one field and no group to name — a lone Form Field needs no card around it.",
          "The heading belongs to a page rather than a group — use Page Header.",
        ],
      }}
      related={[
        {
          label: "Form Card",
          href: "/design-system/components/forms/form-card",
          reason: "the same header with an arbitrary body",
        },
        {
          label: "Form Field",
          href: "/design-system/components/forms/form-field",
          reason: "what the grid is filled with",
        },
        {
          label: "Wizard",
          href: "/design-system/components/forms/wizard",
          reason: "the multi-step shell these sections sit inside",
        },
        {
          label: "Page Header",
          href: "/design-system/components/layout/page-header",
          reason: "when the heading belongs to the page, not a group",
        },
      ]}
      design={
        <section className="cdp__section" aria-labelledby="cdp-columns">
          <h2 id="cdp-columns" className="cdp__h2">
            Choosing the Column Count
          </h2>
          <p>
            Three columns suit short, uniform answers — a date, a code, a district. Two columns suit
            names and addresses, where a longer measure stops the text wrapping mid-answer. One column
            suits a section whose fields are mostly prose.
          </p>
          <p>
            The count is a desktop maximum, not a fixed layout: the grid collapses to a single column
            on narrow screens, so a three-column section is not a decision about phones.
          </p>
        </section>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { FormField, FormSection, Input, Select } from "@mosje/design-system";

<FormSection
  title="Address Details"
  description="The address at which the applicant currently resides."
  columns={2}
>
  <FormField label="Street Address">
    {(control) => <Input {...control} />}
  </FormField>
  <FormField label="City">
    {(control) => <Input {...control} />}
  </FormField>
  <FormField label="State">
    {(control) => (
      <Select {...control} options={[{ label: "Delhi", value: "DL" }]} />
    )}
  </FormField>
  <FormField label="PIN Code">
    {(control) => <Input {...control} inputMode="numeric" maxLength={6} />}
  </FormField>
</FormSection>`}</CodeBlock>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-a11y-notes">
          <h2 id="cdp-a11y-notes" className="cdp__h2">
            Notes
          </h2>
          <p>
            The heading is an <code>&lt;h2&gt;</code>. A form built from these sections therefore
            expects a single <code>&lt;h1&gt;</code> on the page above it, and no hand-rolled heading
            between the two — a skipped level is what makes a form unnavigable by heading.
          </p>
          <p>
            The section is labelled by its own title, so it is announced as a named region. Where a
            child needs to reference that heading directly — a data table, for instance — use Form
            Card, which exposes <code>headingId</code>. This component generates its id internally.
          </p>
        </section>
      }
    />
  );
}
