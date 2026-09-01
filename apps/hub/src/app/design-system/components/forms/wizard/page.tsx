import type { Metadata } from "next";
import * as React from "react";

import {
  Callout,
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
  type PropDef,
} from "@/components/design-system/docs-kit";

import { WizardPlayground } from "./wizard-playground";

export const metadata: Metadata = {
  title: "Wizard — Design System",
  description:
    "The shared multi-step form shell: a stepper, the current step's body, a focusable error summary, and the Back, Continue and Submit controls.",
};

/*
 * Read off `WizardProps` in packages/design-system/components/forms/wizard.tsx.
 * The interface is a CLOSED list — it extends nothing. `ReviewSection` and
 * `ReviewItem` are exported from the same file for the final step.
 */
const PROPS: PropDef[] = [
  {
    name: "steps",
    type: "StepperStep[]",
    required: true,
    description: "Step definitions — `{ label, description? }` — passed straight to the Stepper.",
  },
  {
    name: "current",
    type: "number",
    required: true,
    description: "Zero-based index of the active step. The parent owns it; the Wizard never changes it.",
  },
  {
    name: "onBack",
    type: "() => void",
    required: true,
    description: "Fired when the reader asks for the previous step. The Back button is disabled on the first step.",
  },
  {
    name: "onNext",
    type: "() => void",
    required: true,
    description: "Fired when the reader asks for the next step. Validate here and only advance when the step is valid.",
  },
  {
    name: "onSubmit",
    type: "() => void",
    required: true,
    description: "Fired from the final step's submit button, which replaces Continue there.",
  },
  {
    name: "children",
    type: "React.ReactNode",
    required: true,
    description: "The current step's body — typically one or more Form Sections or Form Cards.",
  },
  {
    name: "submitLabel",
    type: "string",
    default: '"Submit"',
    description: "Label for the final-step submit button.",
  },
  {
    name: "nextLabel",
    type: "string",
    default: '"Continue"',
    description: "Label for the advance button on every step but the last.",
  },
  {
    name: "error",
    type: "string",
    default: "undefined",
    description: "Error-summary message, rendered in a focusable Alert above the actions.",
  },
  {
    name: "errorRef",
    type: "React.Ref<HTMLDivElement>",
    default: "undefined",
    description:
      "Ref to the error-summary container, so the parent can move focus to it when a step fails validation. Without this the summary appears and nobody is sent to it.",
  },
];

const A11Y: A11yItem[] = [
  {
    criterion: "2.4.3 Focus Order",
    level: "A",
    description:
      "On a step change focus moves to the step body, so a keyboard user lands on the new content rather than being stranded at the bottom of the page they just left.",
  },
  {
    criterion: "3.2.2 On Input",
    level: "A",
    description:
      "The step never advances on its own. Back, Continue and Submit are explicit controls, and the parent decides whether the move is allowed.",
  },
  {
    criterion: "3.3.1 Error Identification",
    level: "A",
    description:
      "The error summary is an Alert above the actions, and `errorRef` lets the parent send focus to it, so the failure is both announced and reachable.",
  },
  {
    criterion: "4.1.3 Status Messages",
    level: "AA",
    description:
      "A polite live region announces \"Step N of M\" with the step's label whenever `current` changes, so a screen-reader user hears the move.",
  },
  {
    criterion: "2.4.8 Location",
    level: "AAA",
    description:
      "The Stepper shows which step of how many the reader is on throughout, which is what makes a long application feel finite.",
  },
  {
    criterion: "GIGW 3.0 — Forms",
    level: "GIGW",
    description:
      "A long form is broken into named steps and closes with a read-only review, so nothing is submitted that the citizen has not seen in full.",
  },
];

export default function WizardPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Wizard"
      status="Stable"
      summary="The shared multi-step form shell. It renders the Stepper, the current step's body, an optional focusable error summary, and the Back, Continue and Submit controls. The parent owns every field value, the step index and all validation."
      figma={{ absent: "Not yet published in the Figma library." }}
      specimen={<WizardPlayground />}
      props={PROPS}
      a11y={A11Y}
      whenToUse={{
        use: [
          "An application is long enough that presenting it as one page would be daunting — a scheme application, a registration, a grievance with supporting documents.",
          "The steps are genuinely sequential, and a later step depends on an earlier one being complete.",
          "The final step should be a read-only review before anything is submitted.",
        ],
        avoid: [
          "The form is short enough to show at once — a wizard around three fields adds two clicks and removes the overview.",
          "The steps are independent and the reader may complete them in any order — use Tabs, which does not imply a sequence.",
          "Only the progress needs showing, not the navigation — use Stepper on its own.",
        ],
      }}
      related={[
        {
          label: "Stepper",
          href: "/design-system/components/feedback/stepper",
          reason: "the progress indicator this shell renders",
        },
        {
          label: "Form Section",
          href: "/design-system/components/forms/form-section",
          reason: "what a step's body is usually made of",
        },
        {
          label: "Declaration Checkbox",
          href: "/design-system/components/forms/declaration-checkbox",
          reason: "the certification that closes the final step",
        },
        {
          label: "Alert",
          href: "/design-system/components/feedback/alert",
          reason: "the component the error summary is rendered as",
        },
      ]}
      design={
        <section className="cdp__section" aria-labelledby="cdp-ownership">
          <h2 id="cdp-ownership" className="cdp__h2">
            The Parent Owns the State
          </h2>
          <Callout type="info" title="What This Component Does and Does Not Do">
            Keep <code>current</code> and every field value in your page&apos;s state. Validate inside{" "}
            <code>onNext</code> and <code>onSubmit</code>, and advance only when the step is valid. The
            Wizard is presentational: it tells you when the reader wants to move, moves focus to the
            step body, and announces the step. It never decides whether the move is allowed.
          </Callout>
          <p>
            The last step should always be a read-only summary. <code>ReviewSection</code> is a titled
            card laying out <code>ReviewItem</code> label-and-value pairs in a responsive grid, and an
            empty value renders as an em dash — so a missing answer is visible before submission
            rather than after it.
          </p>
        </section>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { FormSection, Wizard } from "@mosje/design-system";

const [step, setStep] = React.useState(0);
const [error, setError] = React.useState<string>();
const errorRef = React.useRef<HTMLDivElement>(null);

<Wizard
  steps={[
    { label: "Personal", description: "Your details" },
    { label: "Documents", description: "Supporting papers" },
    { label: "Review", description: "Confirm and submit" },
  ]}
  current={step}
  error={error}
  errorRef={errorRef}
  onBack={() => setStep((s) => s - 1)}
  onNext={() => {
    const problem = validate(step);
    setError(problem);
    if (problem) errorRef.current?.focus();
    else setStep((s) => s + 1);
  }}
  onSubmit={submitApplication}
>
  {step === 0 && <FormSection title="Personal Details">…</FormSection>}
</Wizard>`}</CodeBlock>
          <p>The review step, built from the two helpers exported alongside the shell.</p>
          <CodeBlock>{`import { ReviewItem, ReviewSection } from "@mosje/design-system";

<ReviewSection title="Personal Details">
  <ReviewItem label="Full Name" value={form.name} />
  <ReviewItem label="Date of Birth" value={form.dob} />
  <ReviewItem label="Address" value={form.address} wide />
</ReviewSection>`}</CodeBlock>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-a11y-notes">
          <h2 id="cdp-a11y-notes" className="cdp__h2">
            Notes
          </h2>
          <p>
            Always pass <code>errorRef</code> alongside <code>error</code> and move focus to it when a
            step fails. Rendering the summary without sending anybody to it leaves a keyboard user
            pressing Continue with no idea why nothing happened.
          </p>
          <p>
            Focus moves to the step body on every change of <code>current</code>, and the body is
            given a <code>tabIndex</code> of −1 so it can receive that focus without becoming a tab stop
            of its own.
          </p>
          <p>
            All three controls are <code>type=&quot;button&quot;</code>. A Wizard placed inside a{" "}
            <code>&lt;form&gt;</code> therefore does not submit on Continue, which is what stops an
            incomplete application reaching the department because somebody pressed Enter in a field.
          </p>
        </section>
      }
    />
  );
}
