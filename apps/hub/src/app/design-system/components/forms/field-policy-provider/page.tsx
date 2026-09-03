import type { Metadata } from "next";
import * as React from "react";

import { Callout, CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";

import { FieldPolicySpecimen } from "./specimen";

export const metadata: Metadata = {
  title: "Field Policy Provider — Design System",
  description:
    "Sets whether a form marks its mandatory fields or its optional ones, for every field beneath it, and prints the sentence that explains the mark.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "3.3.2 Labels or Instructions",
    level: "A",
    status: "verified",
    evidence:
      "`RequiredFieldsLegend` prints the convention in words above the fields, and reads the same policy the marks read, so the sentence and the marks cannot disagree.",
    description:
      "This is the criterion the component exists for. A mark with no key is not an instruction — an asterisk means \"footnote\" to a great many readers.",
  },
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    status: "verified",
    evidence:
      "Under the `required` policy the asterisk is `aria-hidden` and the control carries the `required` attribute, so a screen reader says \"required\" rather than \"star\". Under the `optional` policy the word \"optional\" is left readable, because there is no attribute for it to announce instead.",
    description: "The visible mark and the programmatic one are the same fact, expressed for two audiences.",
  },
  {
    criterion: "3.2.4 Consistent Identification",
    level: "AA",
    status: "verified",
    evidence:
      "One provider per form, read by every field beneath it. A form cannot mark half its fields one way and half the other, because no field decides for itself.",
    description:
      "Systems that put the choice on the field allow exactly that inconsistency, and an unmarked field then reads as a third category.",
  },
];

const EXAMPLE = `<FieldPolicyProvider necessity="optional">
  <RequiredFieldsLegend />

  <FormField label="Full Name" required>
    {(control) => <Input {...control} autoComplete="name" />}
  </FormField>

  {/* Nothing to pass — it is not required, so the policy marks it. */}
  <FormField label="Alternate Mobile Number">
    {(control) => <Input {...control} type="tel" autoComplete="tel" />}
  </FormField>
</FieldPolicyProvider>`;

export default function FieldPolicyProviderPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Field Policy Provider"
      status="Stable"
      since="0.7.0"
      summary="Sets whether a form marks its mandatory fields or its optional ones, for every field beneath it. Required Fields Legend, documented on this page, prints the sentence that explains the mark and reads the same setting, so the key and the marks can never disagree."
      figma={{ node: "requiredFieldsLegend" }}
      specimen={<FieldPolicySpecimen />}
      propsFrom="FieldPolicyProviderProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "Every form on the estate. A form with no provider falls back to marking its mandatory fields, which is the safe default rather than a decision.",
          "Set `optional` on a form where nearly everything is mandatory — most scheme applications. Asterisking forty of forty-two fields marks nothing.",
          "Set `required` on a form where most fields can be skipped — a search filter, a feedback form.",
        ],
        avoid: [
          "Two providers inside one form. The point is that a form has one convention.",
          "`none`, unless every field is mandatory AND the form says so once in prose above the fields.",
        ],
      }}
      related={[
        { label: "Form Field", href: "/design-system/components/forms/form-field", reason: "reads this policy to decide what to mark" },
        { label: "Form Section", href: "/design-system/components/forms/form-section", reason: "the container the legend usually sits above" },
        { label: "Error Summary", href: "/design-system/components/forms/error-summary", reason: "what a reader meets when the marking did not work" },
      ]}
      code={<CodeBlock>{EXAMPLE}</CodeBlock>}
      design={
        <section className="cdp__section" aria-labelledby="cdp-fp-notes">
          <h2 id="cdp-fp-notes" className="cdp__h2">
            Choosing a Convention
          </h2>
          <p>
            Mark the minority. A form where two fields of forty are optional should mark those two;
            a form where two of forty are mandatory should mark those two. The convention that
            produces fewer marks is the one that produces more meaning.
          </p>
          <Callout type="info" title="The Default Is Deliberate">
            A field outside any provider marks its mandatory fields with an asterisk — the
            behaviour the estate had before this component existed, so nothing changed underneath
            anyone. It is a fallback, not a recommendation: put a provider on the form and choose.
          </Callout>
        </section>
      }
    />
  );
}
