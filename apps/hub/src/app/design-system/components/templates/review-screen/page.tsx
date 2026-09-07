import type { Metadata } from "next";
import * as React from "react";
import { Callout, CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";
import { ReviewSpecimen } from "../specimens";

export const metadata: Metadata = {
  title: "Review Screen — Design System",
  description: "A pre-submit summary: numbered sections, edit links, and the statutory declaration.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "Each section is labelled by its own heading and its pairs are a real definition list.",
    status: "verified",
    evidence: "ReviewBlock renders section[aria-labelledby] over a dl of ReviewItem, which emits dt/dd.",
  },
  {
    criterion: "2.4.4 Link Purpose (In Context)",
    level: "A",
    description:
      "Every edit link names its section — \"Edit Organisation Details\", never a bare \"Edit\".",
    status: "verified",
    evidence: "editLabel defaults to `Edit ${section.title}`; a bare label has to be passed deliberately.",
  },
  {
    criterion: "3.3.4 Error Prevention (Legal)",
    level: "AA",
    description:
      "The declaration is a distinct panel bound to its statement, and the submit is not disabled without it — pressing it names what is missing.",
    status: "verified",
    evidence: "DeclarationCheckbox binds the statement to the control; the submit button's disabled binding is `submitting` only.",
  },
];

export default function ReviewScreenPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Review Screen"
      status="Beta"
      summary={"Everything entered, nothing yet committed. Numbered sections that tie back to the wizard steps that filled them, each with an edit link that names its section."}
      figma={{
        absent:
          "Drawn once, as e-anudaan-step7-review-submit — 51 label/value pairs in one undifferentiated grid, with no section numbering and no edit affordance.",
      }}
      specimen={<ReviewSpecimen />}
      propsFrom="ReviewScreenProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "The last step of a wizard, before submit.",
          "Any confirm-before-commit surface where the reader must be able to go back and change an answer.",
        ],
        avoid: [
          "A record that is already committed — that is Record Screen.",
          "A record this reader decides on — that is Decision Screen.",
        ],
      }}
      related={[
        { label: "Declaration Checkbox", href: "/design-system/components/forms/declaration-checkbox", reason: "the statutory panel" },
        { label: "Wizard Screen", href: "/design-system/components/templates/wizard-screen", reason: "what it closes" },
        { label: "Confirmation Screen", href: "/design-system/components/templates/confirmation-screen", reason: "what follows submit" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-numbers">
            <h2 id="cdp-numbers" className="cdp__h2">The Numbers Are the Wizard&rsquo;s Steps</h2>
            <p>
              This is the one place on the estate where numbered markers carry information rather
              than decorating a list: section 2 is step 2, so &ldquo;Edit&rdquo; has an obvious
              destination and the reader knows where they are being sent.
            </p>
            <p>
              The handoff&rsquo;s review frame carries <strong>51 pairs in one grid</strong>. A
              citizen checking their bank details should not have to read the whole application to
              find them.
            </p>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-return">
            <h2 id="cdp-return" className="cdp__h2">An Edit Link Must Come Back</h2>
            <Callout type="warning" title="Carry a return parameter">
              A link that drops the reader into step 2 with a Continue button walks them through
              every remaining step again to reach a summary they were already reading. The
              template cannot do this for you — it does not own the router.
            </Callout>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">Example</h2>
          <CodeBlock>{`<ReviewScreen
  eyebrow="AVYAY · STEP 7 OF 7"
  title="Review & Submit"
  sections={STEPS.map((step, i) => ({
    id: step.id,
    title: step.title,
    pairs: summarise(values, step),
    editHref: \`/apply/\${id}/step-\${i + 1}?return=review\`,
  }))}
  declaration={<ul><li>…</li></ul>}
  declarationChecked={agreed}
  onDeclarationChange={setAgreed}
  onSubmit={submit}
/>`}</CodeBlock>
          <p>
            Omit <code>declaration</code> when this is a body embedded inside a wizard whose final
            step already carries one — bodies compose, chrome does not.
          </p>
        </section>
      }
    />
  );
}
