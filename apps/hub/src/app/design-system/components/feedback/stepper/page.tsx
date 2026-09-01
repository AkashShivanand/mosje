import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
} from "@/components/design-system/docs-kit";
import { Stepper } from "@mosje/design-system";

export const metadata: Metadata = {
  title: "Stepper — Design System",
  description:
    "Horizontal progress through a multi-step form: which stages are complete, which one the applicant is on, and how many remain.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "It renders a real ordered list, so the stages are announced as an ordered set with a count — “list, four items” — rather than as four unrelated pieces of text.",
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    description:
      'The active stage carries aria-current="step", which is what tells a screen reader where in the process the applicant is.',
  },
  {
    criterion: "1.4.1 Use of Colour",
    level: "A",
    description:
      'Each item carries visually hidden text — “(completed)”, “(current step)”, “(upcoming)” — so the three states are distinguishable without the green tick and the filled marker.',
  },
  {
    criterion: "1.1.1 Non-text Content",
    level: "A",
    description:
      'The markers and the connector lines are aria-hidden="true". The tick and the number are a second rendering of a state the hidden text already states.',
  },
];

export default function StepperPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Stepper"
      status="Stable"
      summary="Horizontal progress through a multi-step form. It shows which stages are complete, which one the applicant is on, and how many remain — so a long application does not feel unbounded."
      figma={{ absent: "Not yet published in the Figma library." }}
      specimen={
        <Stepper
          ariaLabel="Application progress"
          current={1}
          steps={[
            { label: "Personal Details" },
            { label: "Income & Caste" },
            { label: "Bank Account" },
            { label: "Review & Submit" },
          ]}
        />
      }
      propsFrom="StepperProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A form is split across three to six stages and the applicant needs to know how much is left.",
          "The stages run in a fixed order, so “completed”, “current” and “upcoming” are meaningful.",
          "The process is one the applicant is inside now, and the page moves between stages.",
        ],
        avoid: [
          "The stages are a record of what has already happened to a submitted case — use Approval Timeline, which is vertical and dated.",
          "There is one long form with no stages — use Form Section headings instead of inventing steps to have a stepper.",
          "There are more than about six stages. Beyond that the labels stop being readable and the count stops being reassuring.",
          "The reader needs to jump between stages from the stepper. It is a status display, not navigation — put the controls in the wizard.",
        ],
      }}
      related={[
        {
          label: "Wizard",
          href: "/design-system/components/forms/wizard",
          reason: "the shell that moves between the stages a stepper reports",
        },
        {
          label: "Approval Timeline",
          href: "/design-system/components/data-display/approval-timeline",
          reason: "for the history of a case rather than the stage of a form",
        },
        {
          label: "Progress",
          href: "/design-system/components/data-display/progress",
          reason: "when the measure is a proportion rather than a set of named stages",
        },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-states">
            <h2 id="cdp-states" className="cdp__h2">
              Three States, Derived
            </h2>
            <p>
              Nothing sets the state of an individual step. Everything before{" "}
              <code>current</code> renders as completed with a tick, <code>current</code> renders as
              a filled marker, everything after renders as muted and numbered. The connectors fill
              behind the applicant as they advance.
            </p>
            <p>
              Deriving them from one index is what stops a stepper disagreeing with the form it
              describes — there is no second source of truth to drift.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-labels">
            <h2 id="cdp-labels" className="cdp__h2">
              Writing the Labels
            </h2>
            <p>
              Two or three words in Title Case, naming what the applicant provides at that stage:
              “Personal Details”, “Bank Account”, “Review &amp; Submit”. Not “Step 2” — the number
              is already drawn.
            </p>
            <p>
              <code>description</code> is shown only on wider viewports, so it must be an
              elaboration and never the only place a stage is named.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { Stepper } from "@mosje/design-system";

<Stepper
  ariaLabel="Application progress"
  current={step}
  steps={[
    { label: "Personal Details" },
    { label: "Income & Caste", description: "Certificates and declared income" },
    { label: "Bank Account" },
    { label: "Review & Submit" },
  ]}
/>`}</CodeBlock>
          <p>
            <code>current</code> is an index, so the last stage of a four-step form is{" "}
            <code>3</code>. A value equal to <code>steps.length</code> renders every stage as
            complete, which is the correct display for a submitted application.
          </p>
        </section>
      }
      accessibility={
        <>
          <section className="cdp__section" aria-labelledby="cdp-keys">
            <h2 id="cdp-keys" className="cdp__h2">
              Keyboard
            </h2>
            <p>
              <strong>The stepper has no keyboard interaction, and that is deliberate.</strong> It
              renders an ordered list of static items with no controls, so it takes no tab stop and
              responds to no key. A keyboard user moves through the form itself and the stepper
              reports where they are.
            </p>
            <p>
              Where a wizard genuinely allows returning to an earlier stage, the control belongs in
              the wizard&apos;s own navigation, where it can be disabled per stage and labelled with
              what it does. Turning the markers into buttons would create controls that look
              identical whether or not they can be used.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-announce">
            <h2 id="cdp-announce" className="cdp__h2">
              What a Screen Reader Hears
            </h2>
            <p>
              The list is named by <code>ariaLabel</code> and announced with its item count, so the
              length of the process is known before the first item is read. Each item is then read
              as its label followed by its state — “Income &amp; Caste (current step)”.
            </p>
            <p>
              The visually hidden state text is what carries the three states; the tick, the filled
              marker and the muted numbers are all <code>aria-hidden</code>. This is the component
              honouring 1.4.1 rather than relying on a green tick that is invisible to a screen
              reader and ambiguous to a colour-blind reader.
            </p>
            <p>
              The stepper is not a live region. Where advancing a stage does not also move focus
              into the new stage&apos;s first field, announce the change through a live region — the
              stepper changing on its own is silent.
            </p>
          </section>
        </>
      }
    />
  );
}
