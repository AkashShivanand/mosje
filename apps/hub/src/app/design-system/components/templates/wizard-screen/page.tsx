import type { Metadata } from "next";
import * as React from "react";
import { Callout, CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";
import { WizardSpecimen } from "../specimens";

export const metadata: Metadata = {
  title: "Wizard Screen — Design System",
  description:
    "One record entered in stages: the page title, the step meta line, the draft banner and the stepper — around the shared Wizard.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "3.3.2 Labels or Instructions",
    level: "A",
    description:
      "The step meta line states where the reader is and that starred fields are mandatory, in one sentence composed the same way for every scheme.",
    status: "verified",
    evidence: "Composed by the template from steps.length and the current step's label.",
  },
  {
    criterion: "3.3.1 Error Identification",
    level: "A",
    description:
      "A failed step renders a focusable error summary above the actions; the parent moves focus to it through `errorRef`.",
    status: "verified",
    evidence: "Inherited from Wizard, which renders the summary and exposes the ref.",
  },
  {
    criterion: "4.1.3 Status Messages",
    level: "AA",
    description: "Wizard announces the active step through a live region and moves focus to the step body on change.",
    status: "verified",
    evidence: "Inherited from Wizard.",
  },
];

export default function WizardScreenPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Wizard Screen"
      status="Beta"
      summary="One record, entered in stages. It adds the page around the shared Wizard: the scheme title, the step meta line, the draft banner and any notices the step must carry."
      figma={{
        absent:
          "Drawn across 22 of the handoff's 44 screens, but with two different stepper treatments. One ships; the divergence is recorded in docs/audit/figma-handoff-defects-2026-09-06.md §2.9.",
      }}
      specimen={<WizardSpecimen />}
      propsFrom="WizardScreenProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A form with more than eight fields, or one with a statutory stage boundary.",
          "An application that can be saved and resumed — the draft banner is built in.",
          "Any intake journey: this covers 22 of the handoff's 44 screens.",
        ],
        avoid: [
          "A form that fits one screen — use Form Screen and one submit.",
          "A read-only summary of what was entered — that is the last step, Review Screen.",
          "A document checklist step — use Checklist Screen inside this one.",
        ],
      }}
      related={[
        { label: "Wizard", href: "/design-system/components/forms/wizard", reason: "the stepper, focus handling and action row" },
        { label: "Stepper", href: "/design-system/components/feedback/stepper", reason: "the progress indicator" },
        { label: "Form Section", href: "/design-system/components/forms/form-section", reason: "what a step body is made of" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-steps">
            <h2 id="cdp-steps" className="cdp__h2">Three to Seven Steps, One Treatment</h2>
            <p>
              The handoff draws NAPDDR at three steps, SHRESHTA at six and AVYAY at seven, so the
              stepper must survive that range without being redrawn. It does —{" "}
              <code>Stepper</code> collapses rather than overflowing.
            </p>
            <Callout type="warning" title="One progress bar, not two">
              AVYAY and NAPDDR draw one stepper treatment; SHRESHTA and Grant-in-Aid draw another.
              A citizen applying to two schemes should not meet two different progress bars for
              the same act.
            </Callout>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-draft">
            <h2 id="cdp-draft" className="cdp__h2">The Draft Banner Has Two Flavours and One Shape</h2>
            <p>
              Before resuming: <em>You Have a Saved Draft for This Scheme</em>, with{" "}
              <strong>Resume draft</strong> and <strong>Start fresh</strong>. After resuming:{" "}
              <em>You Are Continuing a Saved Draft for FY 2026-27</em>, with only{" "}
              <strong>Start a fresh application</strong>. The difference is{" "}
              <code>resumed</code>, not two components.
            </p>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-tall">
            <h2 id="cdp-tall" className="cdp__h2">A Step Taller Than the Viewport</h2>
            <p>
              The handoff&rsquo;s <code>step-3-bank-beneficiaries-filled</code> is 1730px of form
              in a 1024px artboard — about 60% of the screen is not visible in the drawing. If a
              step runs that long, split it or group it into collapsible{" "}
              <code>FormSection</code>s; do not let the action row sit 800px below the fold.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">Example</h2>
          <CodeBlock>{`<WizardScreen
  eyebrow="E-ANUDAAN"
  title="AVYAY — Atal Vayo Abhyuday Yojana"
  description="Provide all necessary information below and complete each section."
  steps={STEPS}                 // 3–7 StepperStep
  current={step}                // the parent owns the index
  draft={draft && {
    savedAt: format(draft.updatedAt),
    resumed: hasResumed,
    scope: "FY 2026-27",
    onResume: resume,
    onStartFresh: startFresh,
  }}
  notices={autoFilled && <Alert status="info">Organisation details auto-populated from DARPAN.</Alert>}
  error={stepError}
  errorRef={errorRef}
  onBack={back}
  onNext={validateThenNext}
  onSubmit={submit}
>
  <FormSection title="Project Details">…</FormSection>
</WizardScreen>`}</CodeBlock>
          <p>
            The parent owns every field value, the step index and validation — the same division{" "}
            <code>Wizard</code> already sets. Conditional fields inside a step (the
            handoff&rsquo;s &ldquo;New project / Ongoing renewal&rdquo; reveals three selects) are
            the step body&rsquo;s business, not the template&rsquo;s.
          </p>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-guards">
          <h2 id="cdp-guards" className="cdp__h2">Two Guards the Template Cannot Install</h2>
          <p>
            <strong>Unsaved changes.</strong> A reader who navigates away mid-step must be warned.
            The template does not own the router, so the guard belongs in the page.
          </p>
          <p>
            <strong>Session expiry.</strong> A wizard is the longest a reader stays on one screen,
            and it is where a silent expiry costs the most. Resolve it before the submit fails,
            and keep the entered values.
          </p>
          <p>
            <strong>Redundant entry (WCAG 2.2 §3.3.7).</strong> Going back a step must not clear
            what was entered, and a value already given must not be asked for again later in the
            same application. The parent owns field state, so this is not a criterion this
            component can claim — it is one the calling form has to meet, and it is not listed
            above for that reason.
          </p>
        </section>
      }
    />
  );
}
