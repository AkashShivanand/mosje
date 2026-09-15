import type { Metadata } from "next";
import * as React from "react";

import { CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";

import { FormInsetPlayground } from "./form-inset-playground";

export const metadata: Metadata = {
  title: "Form Inset — Design System",
  description:
    "One entry of a repeatable group inside a form sub-section, drawn as a tinted inset panel holding a two-column field grid.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.4.11 Non-text Contrast",
    level: "AA",
    description:
      "The inset has no border of its own, so each control inside must remain identifiable against the tint: the input border is measured against `bg/neutral/subtler`, not against white.",
    status: "verified",
    evidence:
      "Measured with Playwright against this page's specimen on the running hub, 14 Sep 2026: the input border against the inset's background computes to 4.07:1 against the 3:1 minimum.",
  },
  {
    criterion: "1.4.10 Reflow",
    level: "AA",
    description:
      "The entry's two-column grid collapses to one column below 768px, so an entry reflows to 320px.",
    status: "verified",
    evidence:
      "Measured with Playwright against this page's specimen on the running hub, 14 Sep 2026: two grid columns at 1440px; one at a 320px viewport, where the inset's scrollWidth equals its clientWidth.",
  },
  {
    criterion: "1.3.2 Meaningful Sequence",
    level: "A",
    description:
      "The entry's title and its Remove control come before its fields in the document, so the reading order matches what is seen: which entry, then its answers.",
    status: "verified",
    evidence:
      "Measured with Playwright against this page's specimen on the running hub, 14 Sep 2026: the head row precedes the field grid in document order.",
  },
];

export default function FormInsetPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Form Inset"
      status="New"
      summary="One entry of a repeatable group — an employment, a key functionary, a bank account — drawn as a tinted inset panel inside a sub-section. Entries sit 16 apart, and a small outlined Add More button follows the last one."
      figma={{
        absent:
          "Drawn in the portal handoff file (NOS, Employment Background Details); not yet published in the SAMAVESH library.",
      }}
      specimen={<FormInsetPlayground />}
      propsFrom="FormInsetProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "The applicant may enter the same set of fields more than once — previous employments, key functionaries, project locations.",
          "Each entry has a handful of fields that read best in two columns.",
          "Entries can be added and removed while the step is open.",
        ],
        avoid: [
          "The repeated rows are short and uniform — family members, awards. Use a bordered Data Table, with its add control in the last row.",
          "The group appears once — use the sub-section's own field grid; a single inset is a box for no reason.",
          "The content is a document — use Document Tile.",
        ],
      }}
      related={[
        {
          label: "Form Card",
          href: "/design-system/components/forms/form-card",
          reason: "the sub-section the entries sit in",
        },
        {
          label: "Form Panel",
          href: "/design-system/components/forms/form-panel",
          reason: "the step card around the sub-section",
        },
        {
          label: "Data Table",
          href: "/design-system/components/data-display/data-table",
          reason: "for tabular repeaters",
        },
        {
          label: "Toggle",
          href: "/design-system/components/forms/toggle",
          reason: "the Yes/No question that often opens the group",
        },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-shape">
            <h2 id="cdp-shape" className="cdp__h2">
              An Inset, Not a Card
            </h2>
            <p>
              The entry takes <code>bg/neutral/subtler</code>, <code>shape/12</code> and{" "}
              <code>padding/16</code>, with no border and no shadow. It is a tint inside the step panel, so
              the step still reads as one card; a bordered card per entry would put boxes inside the box the
              step already is.
            </p>
            <p>
              The field grid inside defaults to two columns, which collapse to one below 768px. Pass{" "}
              <code>columns={"{1}"}</code> for an entry of long answers or <code>columns={"{3}"}</code> for an
              entry of short codes.
            </p>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-add">
            <h2 id="cdp-add" className="cdp__h2">
              Adding and Removing Entries
            </h2>
            <p>
              Add More is a small outlined Button with a leading plus, right-aligned under the last entry, so
              it is found where the next entry will appear. The component does not render it: the parent owns
              the list, and a group with a statutory maximum hides the control once that maximum is reached.
            </p>
            <p>
              Offer Remove only while more than one entry remains, where at least one is required. A reader
              who removes the only entry is left with a question and nowhere to answer it.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { Button, FormCard, FormField, FormInset, Icon, Input } from "@mosje/design-system";

<FormCard title="Key Functionaries">
  {people.map((person, i) => (
    <FormInset
      key={person.id}
      title={\`Key Functionary \${i + 1}\`}
      actions={
        people.length > 1 && (
          <Button appearance="text" size="sm" onClick={() => remove(person.id)}
            aria-label={\`Remove Key Functionary \${i + 1}\`}>
            Remove
          </Button>
        )
      }
    >
      <FormField label="Name" required>{(c) => <Input {...c} />}</FormField>
      <FormField label="Designation" required>{(c) => <Input {...c} />}</FormField>
    </FormInset>
  ))}
  <Button appearance="outlined" size="sm" iconLeft={<Icon name="add" size={20} />} onClick={add}>
    Add More
  </Button>
</FormCard>`}</CodeBlock>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-a11y-notes">
          <h2 id="cdp-a11y-notes" className="cdp__h2">
            Notes
          </h2>
          <p>
            The entry title is a paragraph, not a heading: a list of eight functionaries would otherwise put
            eight headings in the page outline for one question. Where the entries are long enough to need
            navigating, give each a real heading in the title slot.
          </p>
          <p>
            Name each Remove control for its entry — &ldquo;Remove Employment 2&rdquo; — rather than repeating
            &ldquo;Remove&rdquo; once per entry. The component does not render the control, so this is the
            caller&rsquo;s to meet.
          </p>
          <p>
            After Add More, move focus to the first field of the new entry. After Remove, move it to the entry
            that took its place, or to Add More if none did, so a keyboard user is not left on a control that
            no longer exists.
          </p>
        </section>
      }
    />
  );
}
