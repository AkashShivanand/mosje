import type { Metadata } from "next";
import * as React from "react";
import { Callout, CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";
import { FormSpecimen } from "../specimens";

export const metadata: Metadata = {
  title: "Form Screen — Design System",
  description: "One record, editable in a single pass: sectioned fields, an error summary and one submit.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "3.3.1 Error Identification",
    level: "A",
    description:
      "A failed submit renders ErrorSummary above the fields, which takes focus and links each message to the control it belongs to.",
    status: "verified",
    evidence: "ErrorSummary is rendered whenever `errors` is non-empty; its own autoFocus defaults to true and each item's fieldId is the control id.",
  },
  {
    criterion: "3.3.2 Labels or Instructions",
    level: "A",
    description:
      "The mandatory-fields sentence sits above the first section, not buried beside one field.",
    status: "verified",
    evidence: "`requiredNote` renders before `children` and defaults to the estate's sentence; it is a prop so it can be translated.",
  },
  {
    criterion: "4.1.3 Status Messages",
    level: "AA",
    description:
      "Saving, unsaved-changes and last-saved are announced from one polite live region rather than appearing silently.",
    status: "verified",
    evidence: "The action bar's state line carries aria-live=\"polite\" and reserves its height so the buttons do not shift when it fills.",
  },
  {
    criterion: "2.4.11 Focus Not Obscured",
    level: "AA",
    description:
      "Below 768px the action bar is sticky at the foot. A focused field near the bottom of a long form must not end up underneath it.",
    status: "untested",
    evidence: "Not yet exercised by tabbing through a long form at 375px. The bar is sticky rather than fixed, which limits but does not eliminate the risk.",
  },
];

export default function FormScreenPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Form Screen"
      status="Beta"
      summary={"One record, editable, and it fits on one screen. Sections, an error summary that takes focus, and one action bar that stays reachable at 375px."}
      figma={{
        absent:
          "The handoff draws only staged wizard steps — no single-screen form. This is the estate's own composition, and it is what the >8-field rule sends everything below the wizard threshold to.",
      }}
      specimen={<FormSpecimen />}
      propsFrom="FormScreenProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "Editing an organisation profile, a contact record, a set of preferences.",
          "Any form of eight fields or fewer with no statutory stage boundary.",
        ],
        avoid: [
          "More than eight fields, or a legally staged process — that is Wizard Screen.",
          "A read-only record — that is Record Screen.",
          "A single value corrected in place — that is InlineEdit inside Settings Screen.",
        ],
      }}
      related={[
        { label: "Form Section", href: "/design-system/components/forms/form-section", reason: "the field grid" },
        { label: "Error Summary", href: "/design-system/components/forms/error-summary", reason: "the failed-submit summary" },
        { label: "Wizard Screen", href: "/design-system/components/templates/wizard-screen", reason: "when it will not fit" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-count">
            <h2 id="cdp-count" className="cdp__h2">Count the Fields — the Boundary Is Not a Feeling</h2>
            <p>
              More than eight fields, or a statutory stage boundary, and it is a wizard. A
              twelve-field form a citizen must complete in one sitting is the shape that loses
              work, and the decision table says so in a sentence rather than leaving it to taste.
            </p>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-save">
            <h2 id="cdp-save" className="cdp__h2">The Save Is Confirmed, Never Optimistic</h2>
            <p>
              <code>submitting</code> keeps the control busy until the write settles. An
              optimistic save shows the new value the instant it is typed and quietly reverts if
              the write fails — on a departmental register that is a data-integrity problem
              wearing a performance improvement.
            </p>
            <Callout type="warning" title="The template shows dirty state; it cannot guard it">
              <code>dirty</code> renders &ldquo;You have unsaved changes&rdquo;. The route guard
              and the beforeunload handler are yours — the template does not own the router.
            </Callout>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">Example</h2>
          <CodeBlock>{`<FormScreen
  eyebrow="E-ANUDAAN"
  title="Organisation Contact Details"
  errors={submitted ? validate(values) : undefined}
  dirty={isDirty}
  savedAt={lastSaved}
  submitting={isSaving}
  onSubmit={save}
  onCancel={() => router.back()}
  loading={isLoading}
  error={loadError}
  onRetry={refetch}
>
  <FormSection title="Correspondence Address" columns={2}>
    …FormFields…
  </FormSection>
</FormScreen>`}</CodeBlock>
          <p>
            Pass <code>errors</code> only after a submit attempt. Rendering a summary while the
            reader is still typing moves focus away from the field they are in.
          </p>
        </section>
      }
    />
  );
}
