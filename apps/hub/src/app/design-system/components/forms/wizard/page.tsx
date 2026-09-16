import type { Metadata } from "next";
import * as React from "react";

import { Callout, CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";

import { WizardPlayground } from "./wizard-playground";

export const metadata: Metadata = {
  title: "Wizard — Design System",
  description:
    "The shared multi-step form shell: the stepper on the page ground, then one panel for the current step — a head band, the step's sub-sections, and the Back or Cancel and Continue or Submit controls.",
};

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
      "The step never advances on its own. Back, Cancel, Continue and Submit are explicit controls, and the parent decides whether the move is allowed.",
  },
  {
    criterion: "3.3.1 Error Identification",
    level: "A",
    description:
      "The error summary is an Alert at the foot of the step panel's body, above the action band, and `errorRef` lets the parent send focus to it, so the failure is both announced and reachable.",
  },
  {
    criterion: "4.1.3 Status Messages",
    level: "AA",
    description:
      'A polite live region announces "Step N of M" with the step\'s label whenever `current` changes, so a screen-reader user hears the move.',
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
      summary="The shared multi-step form shell. It renders the Stepper on the page ground and one Form Panel for the current step: a head band with the step's title, the step's sub-sections, an optional focusable error summary, and an action band with Back or Cancel and Continue or Submit. The parent owns every field value, the step index and all validation."
      figma={{ absent: "Not yet published in the Figma library." }}
      specimen={<WizardPlayground />}
      propsFrom="WizardProps"
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
          "A step's sub-sections seem to need cards of their own — they do not. Wizard draws the one panel; pass Form Sections and Form Cards, which are not cards.",
        ],
      }}
      related={[
        {
          label: "Stepper",
          href: "/design-system/components/feedback/stepper",
          reason: "the progress indicator this shell renders",
        },
        {
          label: "Form Panel",
          href: "/design-system/components/forms/form-panel",
          reason: "the step card this shell draws",
        },
        {
          label: "Form Section",
          href: "/design-system/components/forms/form-section",
          reason: "what a step's body is usually made of",
        },
        {
          label: "Document Tile",
          href: "/design-system/components/forms/document-tile",
          reason: "the documents on an upload or review step",
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
        <>
          <section className="cdp__section" aria-labelledby="cdp-grammar">
            <h2 id="cdp-grammar" className="cdp__h2">
              One Panel per Step
            </h2>
            <p>
              Every multi-step form in the portal handoff — Transgender Portal, NOS, NMBA, Garima Greh, SCW
              and SAMBAL — draws the same page, and Wizard renders it. The stepper sits on the page ground
              with no box, border or fill around it. Below it, 32 apart, is one Form Panel for the current
              step.
            </p>
            <ul>
              <li>
                <strong>Head band.</strong> The step&rsquo;s title and one line of description. They default
                to the current stage&rsquo;s <code>label</code> and <code>description</code>; pass{" "}
                <code>title</code> and <code>description</code> where the step&rsquo;s own name is longer than
                its stage label — &ldquo;Basic Identity Details&rdquo; under the &ldquo;Basic Details&rdquo;
                stage. <code>headerActions</code> sits at the right of the band.
              </li>
              <li>
                <strong>Body.</strong> The step&rsquo;s sub-sections, 32 apart: Form Section for a field grid,
                Form Card for entries, tables or document tiles. None of them is a card.
              </li>
              <li>
                <strong>Action band.</strong> Back at the start and Continue at the end. With{" "}
                <code>onCancel</code>, the first step shows an outlined Cancel where later steps show Back, so
                the leading control is never a disabled button; <code>cancelLabel</code> renames it. The last
                step shows Submit, with a send glyph.
              </li>
            </ul>
            <Callout type="warning" title="Do Not Wrap the Step Body in a Card">
              Wizard already draws the card. A Card or a padded box around the children puts a box inside the
              panel, and a card per sub-section turns one step into a stack of forms.
            </Callout>
            <p>
              The handoff&rsquo;s labels are &ldquo;Save and Continue&rdquo; and &ldquo;Submit
              Application&rdquo;; pass them as <code>nextLabel</code> and <code>submitLabel</code>.
            </p>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-review">
            <h2 id="cdp-review" className="cdp__h2">
              The Review Step
            </h2>
            <p>
              The last step is a read-only summary, headed &ldquo;Review Application Details&rdquo;. It holds
              one <code>ReviewSection</code> per earlier step: the same uppercase head and rule as Form
              Section, with an Edit text button in <code>actions</code>, over a grid of{" "}
              <code>ReviewItem</code> label-and-value pairs — <code>columns={"{4}"}</code> for short values,
              the default two for long ones. An empty value renders as an em dash, so a missing answer is
              visible before submission rather than after it. Documents follow as Document Tiles, then the
              Declaration Checkbox.
            </p>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-sticky">
            <h2 id="cdp-sticky" className="cdp__h2">
              The Action Bar Sticks on a Phone
            </h2>
            <p>
              Below 768px the action band is <strong>sticky</strong>: it rides the bottom of the
              viewport while the step scrolls under it, and lands in its own place at the end of the
              step. A step of a grant application runs 2,000–3,900px on a 375px screen, so
              &ldquo;Save and Continue&rdquo; was always off-screen — the applicant filled the step,
              then scrolled the whole of it again to find the only way forward.
            </p>
            <ul>
              <li>
                <strong>Sticky, not fixed.</strong> It belongs to the panel, so it cannot outlive the
                form, needs no rung on the z-index ladder, and leaves no hole in the document. The
                panel stops clipping its corners at this width, because an overflow ancestor is what
                stops a sticky child from sticking.
              </li>
              <li>
                <strong>Back gives up its word, not its icon.</strong> The bar has room for one set of
                words and they belong to the action that moves the applicant on. &ldquo;Back&rdquo; is
                clipped rather than removed, so the button keeps its accessible name.
              </li>
              <li>
                <strong>It never covers the last field.</strong> The step body reserves the bar&rsquo;s
                height, so the end of the step can always be scrolled clear of it. It also respects{" "}
                <code>env(safe-area-inset-bottom)</code>, for a phone with a home indicator.
              </li>
              <li>
                <strong>It keeps out of the corner stack.</strong> The bar carries{" "}
                <code>data-sa-rail-clear</code>, so a transient launcher steps aside while it would sit
                on it; and where the statutory accessibility control — which never yields — is actually
                on the page, the bar keeps a gutter at its trailing edge so the primary action stops
                short of it. That is measured on the page, not always reserved: on a portal whose
                accessibility control lives in its top bar, the row keeps its full width.
              </li>
            </ul>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-ownership">
            <h2 id="cdp-ownership" className="cdp__h2">
              The Parent Owns the State
            </h2>
            <Callout type="info" title="What This Component Does and Does Not Do">
              Keep <code>current</code> and every field value in your page&apos;s state. Validate inside{" "}
              <code>onNext</code> and <code>onSubmit</code>, and advance only when the step is valid. The
              Wizard is presentational: it tells you when the reader wants to move, moves focus to the step
              body, and announces the step. It never decides whether the move is allowed.
            </Callout>
          </section>
        </>
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
    { label: "Basic Details", description: "Enter the details as they appear on the Aadhaar card." },
    { label: "Documents", description: "Attach each document as a PDF, JPG or PNG." },
    { label: "Review", description: "Please verify all details before final submission." },
  ]}
  current={step}
  title={step === 0 ? "Basic Identity Details" : undefined}
  nextLabel="Save and Continue"
  submitLabel="Submit Application"
  onCancel={() => router.back()}
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
  {step === 0 && (
    <>
      <FormSection title="Personal Details">…</FormSection>
      <FormSection title="Contact Details">…</FormSection>
    </>
  )}
</Wizard>`}</CodeBlock>
          <p>The review step, built from the two helpers exported alongside the shell.</p>
          <CodeBlock>{`import { Button, ReviewItem, ReviewSection } from "@mosje/design-system";

<ReviewSection
  title="Basic Details"
  columns={4}
  actions={<Button appearance="text" size="sm" onClick={() => setStep(0)}>Edit</Button>}
>
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
            Always pass <code>errorRef</code> alongside <code>error</code> and move focus to it when a step
            fails. Rendering the summary without sending anybody to it leaves a keyboard user pressing
            Continue with no idea why nothing happened.
          </p>
          <p>
            The step panel&rsquo;s title is an <code>&lt;h2&gt;</code> and the sub-sections inside it default
            to <code>&lt;h3&gt;</code>, so a Wizard expects the page&rsquo;s own <code>&lt;h1&gt;</code> above
            it and no other heading between.
          </p>
          <p>
            Focus moves to the step body on every change of <code>current</code>, and the body is given a{" "}
            <code>tabIndex</code> of −1 so it can receive that focus without becoming a tab stop of its own.
          </p>
          <p>
            Every control in the action band is <code>type=&quot;button&quot;</code>. A Wizard placed inside a{" "}
            <code>&lt;form&gt;</code> therefore does not submit on Continue, which is what stops an incomplete
            application reaching the department because somebody pressed Enter in a field.
          </p>
        </section>
      }
    />
  );
}
