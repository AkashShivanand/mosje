import type { Metadata } from "next";
import * as React from "react";

import { CodeBlock, ComponentDocPage, DoDont, type A11yItem } from "@/components/design-system/docs-kit";

import { FormSectionDoPreview, FormSectionDontPreview } from "./form-section-grammar";
import { FormSectionPlayground } from "./form-section-playground";

export const metadata: Metadata = {
  title: "Form Section — Design System",
  description:
    "One sub-section of a form: an uppercase label and a hairline rule over a responsive field grid. It sits inside a Form Panel and is not a card of its own.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "A real `<section>` labelled by its own heading (an `<h3>` by default) through `aria-labelledby`, so the group is a named region nested under the panel's heading.",
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
      'The label is a real heading, styled uppercase by CSS rather than typed in capitals, so a screen reader reads "Personal Details" and not a string of letters.',
  },
  {
    criterion: "3.2.3 Consistent Navigation",
    level: "AA",
    description:
      "Form Section, Form Card and Review Section share one head, so the same grouping cue appears in the same place on every form.",
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
      summary="One sub-section of a form: an uppercase label with a hairline rule filling the rest of the row, over a field grid of up to four columns. It sits inside the step's Form Panel and is not a card — the panel is the card, and the sections inside it are separated by their heads."
      figma={{ absent: "Not yet published in the Figma library." }}
      specimen={<FormSectionPlayground />}
      propsFrom="FormSectionProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A group of related fields inside a step needs a label — Personal Details, Address, Bank Account.",
          "The group's layout is a grid of equal columns, with long answers spanning the row.",
          "A wizard step's body, which is one or more of these sections, 32 apart, inside the step panel.",
        ],
        avoid: [
          "The body is not a field grid — repeatable entries, a table, document tiles. Use Form Card, which has the same head and an arbitrary body.",
          "The group needs a box around it — it does not. The step's Form Panel is the box; a card per section is a stack of boxes inside a box.",
          "The heading belongs to the whole step or page — use the Form Panel title or Page Header.",
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
          label: "Form Panel",
          href: "/design-system/components/forms/form-panel",
          reason: "the one card the sections sit inside",
        },
        {
          label: "Wizard",
          href: "/design-system/components/forms/wizard",
          reason: "the multi-step shell that draws the panel for each step",
        },
        {
          label: "Page Header",
          href: "/design-system/components/layout/page-header",
          reason: "when the heading belongs to the page, not a group",
        },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-head">
            <h2 id="cdp-head" className="cdp__h2">
              A Label and a Rule, Not a Card
            </h2>
            <p>
              The head is the section&rsquo;s label in Label 1, medium, uppercase with caps tracking, in{" "}
              <code>text/neutral/subtle</code>, followed by a hairline in <code>border/neutral/subtle</code>{" "}
              that fills the rest of the row, 12 apart. The fields sit 16 below it. An optional{" "}
              <code>badge</code> sits between the label and the rule — a DigiLocker mark on a verified
              identity section — and <code>actions</code> sit at the end of the row, after the rule.
            </p>
            <DoDont
              cards={[
                {
                  type: "do",
                  label: "Put the step's sections, 32 apart, inside the one Form Panel for the step.",
                  preview: <FormSectionDoPreview />,
                },
                {
                  type: "dont",
                  label:
                    "Don't wrap each section in a Card. Boxes inside the step's box read as separate forms, and the actions end up below the last box instead of in the panel.",
                  preview: <FormSectionDontPreview />,
                },
              ]}
            />
          </section>

          <section className="cdp__section" aria-labelledby="cdp-columns">
            <h2 id="cdp-columns" className="cdp__h2">
              Choosing the Column Count
            </h2>
            <p>
              Three columns, the default, suit short answers — a date, a code, a district — and are what the
              handoff draws for most steps. Two suit names and addresses, where a longer measure stops the
              text wrapping mid-answer. Four suit a review grid of short values. One suits a section whose
              fields are mostly prose. Columns and rows are 24 apart.
            </p>
            <p>
              The count is a desktop maximum, not a fixed layout: three and four columns become two below
              1280px, and every grid becomes one column below 768px. A textarea, an address or a radio group
              takes <code>className=&quot;ds-form-span-full&quot;</code> and spans the row.
            </p>
            <p>
              A <code>description</code> is optional, and belongs only where it changes what the applicant
              enters — &ldquo;Provide income certificates only for the members declared in Step 4&rdquo;. A
              sentence restating the label is not a description.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { FormField, FormSection, Input, Select } from "@mosje/design-system";

<FormSection title="Address Details" columns={2}>
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
          <p>
            A section goes inside the step&rsquo;s panel — <code>FormPanel</code> for a single-screen form, or
            the Wizard, which draws the panel itself.
          </p>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-a11y-notes">
          <h2 id="cdp-a11y-notes" className="cdp__h2">
            Notes
          </h2>
          <p>
            The heading is an <code>&lt;h3&gt;</code> by default, under the panel&rsquo;s{" "}
            <code>&lt;h2&gt;</code> and the page&rsquo;s <code>&lt;h1&gt;</code>. Where the panel is itself an{" "}
            <code>&lt;h3&gt;</code>, pass <code>as={"{4}"}</code> — a skipped level is what makes a form
            unnavigable by heading.
          </p>
          <p>
            The label is set in capitals by CSS, so the text in the markup stays in Title Case and is read as
            words. The section is labelled by its own title and announced as a named region. Omit{" "}
            <code>title</code> only when the panel holds this one section and the panel&rsquo;s title already
            names it; the section is then not labelled separately. Where a child needs to reference the
            heading directly — a data table, for instance — use Form Card, which exposes{" "}
            <code>headingId</code>.
          </p>
        </section>
      }
    />
  );
}
