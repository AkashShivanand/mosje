import type { Metadata } from "next";
import * as React from "react";

import {
  Callout,
  CodeBlock,
  ComponentDocPage,
  MatrixTable,
  type A11yItem,
} from "@/components/design-system/docs-kit";

import { RequiredFieldsLegendSpecimen } from "./specimen";

export const metadata: Metadata = {
  title: "Required Fields Legend — Design System",
  description:
    "The sentence that explains a form's marking convention, printed once above the fields and read from the same policy that draws the marks.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "3.3.2 Labels or Instructions",
    level: "A",
    status: "verified",
    description:
      "The criterion asks for instructions where they are needed to avoid a mistake. A mark with no key is exactly that case: an asterisk means “footnote” to a great many people, and a form that marks without explaining leaves the reader to guess.",
    evidence:
      "The component renders a plain paragraph carrying the policy's sentence — “Fields marked with an asterisk (*) are mandatory.” — before the first field.",
  },
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    status: "verified",
    description:
      "The legend is a paragraph, not a programmatic label, and it is deliberately NOT wired to each field with `aria-describedby` — that would announce the same sentence on every tab stop. It does not need to be, because each field carries its own necessity in its accessible name.",
    evidence:
      "Read from the rendered DOM 2026-09-03: under `necessity=\"optional\"` the legend reads “All fields are mandatory unless marked optional.” and the second field's label reads “Alternate Mobile Number (optional)”. The fact reaches the reader per field, independently of the sentence.",
  },
  {
    criterion: "1.4.3 Contrast (Minimum)",
    level: "AA",
    status: "verified",
    description:
      "The legend renders in the muted text role at Body 2 — the lightest text this component uses, so it is the worst case on the page.",
    evidence:
      "Measured in the browser 2026-09-03: #3a3d41 at 14px measures 9.56:1 on the muted page ground and 10.92:1 on white, against a 4.5:1 requirement.",
  },
];

export default function RequiredFieldsLegendPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Required Fields Legend"
      status="Stable"
      summary="The sentence that explains a form's marking convention, printed once above the fields. It reads the same Field Policy that draws the marks, so the sentence and the marks can never disagree — which is what goes wrong when the legend is typed by hand into each form."
      figma={{ node: "requiredFieldsLegend" }}
      specimen={<RequiredFieldsLegendSpecimen />}
      propsFrom="RequiredFieldsLegendProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A form marks its mandatory fields, or marks its optional ones. Print the legend once, above the first field.",
          "A form runs to more than one section — the legend belongs above the first, not repeated per section.",
        ],
        avoid: [
          "The form has one field. The mark is self-explanatory when there is nothing to compare it against.",
          "The policy is `none`, which marks nothing. The component renders nothing at all, so no guard is needed around it.",
          "You want to restate it beside a field — necessity already reaches the reader through that field's own label.",
        ],
      }}
      related={[
        {
          label: "Field Policy Provider",
          href: "/design-system/components/forms/field-policy-provider",
          reason: "sets the convention this sentence reports, and the wording it uses",
        },
        {
          label: "Form Field",
          href: "/design-system/components/forms/form-field",
          reason: "draws the marks on each field that this legend explains",
        },
      ]}
      design={
        <section className="cdp__section" aria-labelledby="cdp-modes">
          <h2 id="cdp-modes" className="cdp__h2">
            One Sentence per Convention, and One That Is Silence
          </h2>
          <p>
            The legend has no variants of its own. It renders whichever sentence the form&rsquo;s
            Field Policy calls for, which is why the two can never drift apart.
          </p>
          <MatrixTable
            caption="What each necessity setting prints"
            columns={["Policy", "What the legend says", "What the fields show"]}
            rows={[
              [
                "required (default)",
                "Fields marked with an asterisk (*) are mandatory.",
                "An asterisk on every mandatory field",
              ],
              [
                "optional",
                "All fields are mandatory unless marked optional.",
                "“(optional)” after the label of every optional field",
              ],
              ["none", "— nothing is rendered —", "No marks at all"],
            ]}
          />
          <Callout title="Necessity Is a Form-Level Decision" type="info">
            Set it once on the Field Policy Provider that wraps the form. Putting it on individual
            fields lets one form mark half its fields mandatory and the other half optional, which
            reads as though the unmarked ones are a third category. The <code>necessity</code> prop
            on this component overrides the policy for the legend alone, and is rarely correct.
          </Callout>
        </section>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import {
  FieldPolicyProvider,
  FormField,
  Input,
  RequiredFieldsLegend,
} from "@mosje/design-system";

<FieldPolicyProvider necessity="optional">
  <RequiredFieldsLegend />

  <FormField label="Full Name" required>
    {(control) => <Input {...control} />}
  </FormField>

  <FormField label="Alternate Mobile Number" optional>
    {(control) => <Input {...control} type="tel" />}
  </FormField>
</FieldPolicyProvider>`}</CodeBlock>
          <p>
            To translate the sentence, override it on the provider rather than passing children
            here — then every form beneath that provider gets the same wording, and the marks are
            translated with it.
          </p>
          <CodeBlock>{`<FieldPolicyProvider
  copy={{
    necessityLegend: {
      required: "तारांकित (*) फ़ील्ड अनिवार्य हैं।",
    },
  }}
>`}</CodeBlock>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-a11y-notes">
          <h2 id="cdp-a11y-notes" className="cdp__h2">
            Notes
          </h2>
          <Callout title="The Legend Is Not the Only Route to the Fact" type="info">
            A screen-reader user does not have to hold this sentence in mind while they work
            through the form. Form Field puts the necessity into each field&rsquo;s own accessible
            name, so the fact arrives again at every field that needs it. The legend is what makes
            the <em>visual</em> convention legible.
          </Callout>
          <p>
            It is a paragraph, not a heading and not a note role. Nothing about it is announced out
            of turn, and it is read in document order when the reader reaches the top of the form.
          </p>
        </section>
      }
    />
  );
}
