import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
  type PropDef,
} from "@/components/design-system/docs-kit";
import { Stepper } from "@mosje/design-system";

import { StepperPlayground } from "./stepper-playground";

export const metadata: Metadata = {
  title: "Stepper — Design System",
  description:
    "Progress through a multi-stage form: which stages are complete, which one the applicant is on, which one failed validation, and how many remain.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    status: "verified",
    evidence: "Accessibility tree read at 1440px and 390px, 6 September 2026.",
    description:
      "It renders a real ordered list, so the stages are announced as an ordered set with a count — “list, seven items” — rather than as seven unrelated pieces of text. The list stays in the tree at every width, including where the compact bar is what is drawn.",
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    status: "verified",
    evidence: "Accessibility tree read at 1440px, 6 September 2026.",
    description:
      'The active stage carries aria-current="step". Where onStepSelect is passed, a returnable stage is a real button whose accessible name is the stage followed by its state, so “Bank Account, completed” is distinguishable by ear from the stage the applicant is on.',
  },
  {
    criterion: "1.4.1 Use of Colour",
    level: "A",
    status: "verified",
    evidence:
      "Rendered with colour suppressed; each state remains distinguishable by glyph and by hidden text.",
    description:
      "Every state carries visually hidden text — “(completed)”, “(current step)”, “(has errors)”, “(not yet available)”, “(upcoming)”. A stage in error also carries an alert glyph and a completed one a tick, so neither rests on red or green. In the compact bar the current dot is longer as well as darker.",
  },
  {
    criterion: "1.1.1 Non-text Content",
    level: "A",
    status: "verified",
    evidence: "Markup review, 6 September 2026.",
    description:
      'The nodes, the connector track and the whole compact bar are aria-hidden="true". Each is a second rendering of a state the hidden text already states, and announcing them again would read the list twice.',
  },
  {
    criterion: "2.4.7 Focus Visible",
    level: "AA",
    status: "verified",
    evidence: "Keyboard walkthrough of the Interactive story at 1440px.",
    description:
      "Where the stages are interactive they take the estate's focus ring from the focus tokens, at the same width and offset as every other control. Where they are not interactive there is no tab stop to focus.",
  },
  {
    criterion: "2.3.3 Animation from Interactions",
    level: "AAA",
    status: "verified",
    evidence: "Rendered under prefers-reduced-motion: reduce.",
    description:
      "Under a reduced-motion preference the colour and the filled track still arrive, they simply do not travel: the node's cross-fade and the connector's growth are both removed, and the completed track is drawn at full length rather than scaled into place. Colour and spread carry the meaning; the travel is decoration.",
  },
  {
    criterion: "1.4.10 Reflow",
    level: "AA",
    status: "partial",
    evidence:
      "Verified at 320, 390, 768, 900 and 1440px for 2–9 stages. Not yet verified at 400% browser zoom.",
    description:
      "The row collapses to the compact bar rather than clipping or overlapping labels. Ten or more stages have not been tested, and are outside what the component is documented to support.",
  },
];

/** What the extractor cannot see: the shape of one entry in `steps`. */
const STEP_PROPS: PropDef[] = [
  {
    name: "steps[].label",
    type: "string",
    required: true,
    description:
      "UX4G calls this the Label Header. Title Case, one to three words, naming what the applicant provides at that stage — “Bank Account”, not “Step 3”.",
  },
  {
    name: "steps[].description",
    type: "string",
    description:
      "UX4G's Supporting Helper Text. It is dropped below 901px, so it must elaborate on the label and never be the only place a stage is named.",
  },
  {
    name: "steps[].status",
    type: '"complete" | "error" | "disabled" | "upcoming"',
    description:
      "Overrides the state the stage would take from its position. For the three things an index cannot express: a stage completed out of order, a stage whose validation failed, and a stage not yet open to the applicant. “current” is not accepted — that is what the current index is for.",
  },
];

const STEPS_SEVEN = [
  { label: "Organisation Details" },
  { label: "Project Details" },
  { label: "Infrastructure" },
  { label: "Beneficiaries" },
  { label: "Grant Sought" },
  { label: "Document Uploads" },
  { label: "Review & Submit" },
];

function Arrangement({
  title,
  note,
  children,
}: {
  title: string;
  note: string;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div className="cdp-stack">
      <h3 className="cdp__h3">{title}</h3>
      <p>{note}</p>
      <div className="cdp-ground">{children}</div>
    </div>
  );
}

export default function StepperPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Stepper"
      status="Stable"
      summary="Progress through a multi-stage form. It shows which stages are complete, which one the applicant is on, which one failed validation, and how many remain — so a long application does not feel unbounded."
      figma={{ node: "stepper" }}
      specimen={<StepperPlayground />}
      propsFrom="StepperProps"
      props={STEP_PROPS}
      a11y={A11Y}
      whenToUse={{
        use: [
          "A form is split across three or more stages and the applicant needs to know how much is left.",
          "The stages run in a fixed order, so “completed”, “current” and “upcoming” are meaningful.",
          "The process is one the applicant is inside now, and the page moves between stages.",
          "A stage can fail validation and the applicant needs to see which one, from anywhere in the form.",
        ],
        avoid: [
          "There are fewer than three stages. The US Web Design System sets that floor, and a two-stage indicator tells the applicant nothing the page heading does not.",
          "The stages are a record of what has already happened to a submitted case — use Approval Timeline, which is vertical and dated.",
          "There is one long form with no stages — use Form Section headings instead of inventing stages to have a stepper.",
          "The number of stages changes with what the applicant enters. A count that moves is worse than no count.",
          "There are more than about nine stages. Beyond that the count stops being reassuring, whatever the component does with the labels.",
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
          <section className="cdp__section" aria-labelledby="cdp-anatomy">
            <h2 id="cdp-anatomy" className="cdp__h2">
              Anatomy
            </h2>
            <p>
              The parts take UX4G&apos;s names, so a specification written against UX4G 3.0
              can be read against this component without translation.
            </p>
            <ul>
              <li>
                <strong>Step Node</strong> — the numbered circle at each stage.
              </li>
              <li>
                <strong>Current Step Node</strong> — the filled, ringed node the applicant is
                on.
              </li>
              <li>
                <strong>Connector Track</strong> — the hairline between two nodes. It is drawn
                leaving each node, and fills once that stage is done, so it reads as the path
                already walked.
              </li>
              <li>
                <strong>Label Header</strong> — <code>label</code>.
              </li>
              <li>
                <strong>Supporting Helper Text</strong> — <code>description</code>.
              </li>
            </ul>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-states">
            <h2 id="cdp-states" className="cdp__h2">
              Five States, One Derivation
            </h2>
            <p>
              Everything before <code>current</code> renders as complete with a tick,{" "}
              <code>current</code> renders as a filled node, everything after renders as muted
              and numbered. A step may override that with <code>error</code>,{" "}
              <code>disabled</code> or an out-of-order <code>complete</code>; nothing may
              override <code>current</code>.
            </p>
            <p>
              One expression resolves the state, and the node, the label, the track, the hidden
              text and the compact counter all read it. That is what stops a stepper disagreeing
              with itself — this estate has shipped a key reading zero above a map drawing
              nineteen thousand records, and the fix was the same one.
            </p>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-motion">
            <h2 id="cdp-motion" className="cdp__h2">
              Advancing a Stage Is Three Movements, Not a Redraw
            </h2>
            <p>
              A still specimen cannot show the part of this component a reader most often has
              to take on trust, so the specimen at the top of this page advances by hand. Press{" "}
              <strong>Next Stage</strong>, and turn <strong>Slow motion</strong> on to watch the
              curve rather than the result.
            </p>
            <ul>
              <li>
                <strong>The connector fills along its length</strong> — an overlay scaled from
                nothing to full width, left to right, or top to bottom when the stepper is
                vertical. The green travels the path rather than appearing on it. 250ms.
              </li>
              <li>
                <strong>The ring grows out of the node.</strong> It is declared on every node at
                zero spread and fully transparent, so becoming current animates a spread the
                browser can interpolate; declared only on the current node it would have nothing
                to start from and would snap into place. 250ms.
              </li>
              <li>
                <strong>Fill, border and numeral cross-fade together</strong> on the shorter
                hover timing, so the circle reads as one object changing rather than three
                properties changing at once. 150ms.
              </li>
            </ul>
            <p>
              Both durations are the motion tokens — <code>--sa-motion-enter-duration</code> and{" "}
              <code>--sa-motion-hover-duration</code> — on the estate&apos;s decelerating easing,
              so the movement starts at once and settles rather than easing in. Nothing here is a
              keyframe: they are transitions, which means a reader who advances two stages
              quickly gets the second movement retargeted from wherever the first had reached,
              instead of a restart.
            </p>
            <p>
              Under <code>prefers-reduced-motion</code> the colour and the filled track still{" "}
              <em>arrive</em> — they simply do not travel, and the slow-motion switch has nothing
              to slow.
            </p>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-narrow">
            <h2 id="cdp-narrow" className="cdp__h2">
              What Happens When the Row Is Too Narrow
            </h2>
            <p>
              Below 641px, and between 641 and 900px once there are seven or more stages, the
              row collapses to the compact bar UX4G specifies: the counter, the current
              stage&apos;s name, and a row of dots. The full list stays in the accessibility
              tree, so the compact bar removes drawing, not information.
            </p>
            <p>
              This is a deliberate divergence, recorded rather than assumed. The GOV.UK Design
              System advises testing a form without a progress indicator at all, and prefers a
              plain “Question 3 of 9” caption — it warns that indicators which show every
              question at once are often unnoticed, consume space and scale poorly on mobile.
              UX4G and the MoSJE handoff both specify a stepper, and{" "}
              the estate&apos;s standards-precedence rule puts design quality first and forbids
              deleting what quality needs. So the estate ships the
              stepper, and the compact bar is how it answers the mobile half of GOV.UK&apos;s
              objection: at the width where the evidence says a full stepper stops working, the
              component becomes the caption GOV.UK asks for.
            </p>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-labels">
            <h2 id="cdp-labels" className="cdp__h2">
              Writing the Labels
            </h2>
            <p>
              Two or three words in Title Case, naming what the applicant provides at that
              stage: “Personal Details”, “Bank Account”, “Review &amp; Submit”. Not “Step 2” —
              the number is already drawn.
            </p>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-arrangements">
            <h2 id="cdp-arrangements" className="cdp__h2">
              Arrangements
            </h2>
            <p>
              Every property that is not a variant, drawn live. The Figma page carries the same
              set in the same order.
            </p>

            <Arrangement
              title="Five States"
              note="Error and disabled are set on the step; the rest come from the index."
            >
              <Stepper
                ariaLabel="Every state"
                current={2}
                steps={[
                  { label: "Applicant" },
                  { label: "Income & Caste", status: "error" },
                  { label: "Bank Account" },
                  { label: "Documents" },
                  { label: "Review", status: "disabled" },
                ]}
              />
            </Arrangement>

            <Arrangement
              title="Helper Text"
              note="Supporting Helper Text under each Label Header, drawn above 900px only."
            >
              <Stepper
                ariaLabel="With helper text"
                current={1}
                steps={[
                  { label: "Activity Details", description: "What was held, and when" },
                  { label: "Location", description: "State, district, block" },
                  { label: "Upload Photos", description: "At least three photographs" },
                  { label: "Review", description: "Check and submit" },
                ]}
              />
            </Arrangement>

            <Arrangement
              title="Label Beside the Node"
              note="UX4G's “Label after”, for a wide row with short stage names."
            >
              <Stepper
                ariaLabel="Label beside the node"
                current={1}
                labelPlacement="right"
                steps={STEPS_SEVEN.slice(0, 4)}
              />
            </Arrangement>

            <Arrangement
              title="Compact Size"
              note="UX4G's Compact — smaller nodes and condensed type, for a side panel."
            >
              <Stepper
                ariaLabel="Compact size"
                current={3}
                size="sm"
                steps={STEPS_SEVEN}
              />
            </Arrangement>

            <Arrangement
              title="Vertical"
              note="For a narrow column, and for stages whose helper text runs long."
            >
              <div style={{ maxWidth: "20rem" }}>
                <Stepper
                  ariaLabel="Vertical"
                  current={1}
                  orientation="vertical"
                  steps={[
                    { label: "Organisation Details", description: "Registration and address" },
                    { label: "Project Details", description: "Scope, duration and location" },
                    { label: "Grant Sought", description: "Heads of expenditure" },
                    { label: "Review & Submit" },
                  ]}
                />
              </div>
            </Arrangement>

            <Arrangement
              title="Seven Stages"
              note="The E-Anudaan grant application, as drawn in the handoff. The widest case the estate ships."
            >
              <Stepper
                ariaLabel="Grant application progress"
                current={3}
                steps={STEPS_SEVEN}
              />
            </Arrangement>
          </section>
        </>
      }
      code={
        <>
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
    { label: "Bank Account", status: failed ? "error" : undefined },
    { label: "Review & Submit" },
  ]}
/>`}</CodeBlock>
            <p>
              <code>current</code> is an index, so the last stage of a four-stage form is{" "}
              <code>3</code>. A value equal to <code>steps.length</code> renders every stage as
              complete, which is the correct display for a submitted application.
            </p>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-interactive">
            <h2 id="cdp-interactive" className="cdp__h2">
              Letting the Applicant Go Back
            </h2>
            <p>
              Pass <code>onStepSelect</code> and every stage that is complete or in error
              becomes a button. Stages ahead of the applicant stay static text — they are not
              rendered as disabled buttons, because a control that looks the same whether or
              not it can be used is worse than no control.
            </p>
            <CodeBlock>{`<Stepper current={step} steps={steps} onStepSelect={setStep} />`}</CodeBlock>
            <p>
              Only wire this up where the wizard can genuinely re-enter a stage without losing
              validation. <code>Wizard</code> does not pass it by default.
            </p>
          </section>
        </>
      }
      accessibility={
        <>
          <section className="cdp__section" aria-labelledby="cdp-keys">
            <h2 id="cdp-keys" className="cdp__h2">
              Keyboard
            </h2>
            <p>
              <strong>Without <code>onStepSelect</code> the stepper takes no tab stop and
              responds to no key</strong>, and that is deliberate: it is an ordered list of
              static items. A keyboard user moves through the form itself and the stepper
              reports where they are.
            </p>
            <p>
              With <code>onStepSelect</code> the returnable stages are ordinary buttons in
              document order, reached with <kbd>Tab</kbd> and activated with{" "}
              <kbd>Enter</kbd> or <kbd>Space</kbd>. There is no roving tabindex and no arrow-key
              map: a handful of buttons in reading order is more predictable than a custom key
              scheme, and it is what Carbon and MUI do for the same component.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-announce">
            <h2 id="cdp-announce" className="cdp__h2">
              What a Screen Reader Hears
            </h2>
            <p>
              The list is named by <code>ariaLabel</code> and announced with its item count, so
              the length of the process is known before the first item is read. Each item is
              then read as its label followed by its state — “Income &amp; Caste (has errors)”.
            </p>
            <p>
              At narrow widths the compact bar is what is drawn, but the list is what is
              announced: the bar is <code>aria-hidden</code> and the list is only visually
              hidden. The previous version clipped the labels themselves, which took the names
              of the remaining stages away from everyone on a phone.
            </p>
            <p>
              The stepper is not a live region. Where advancing a stage does not also move focus
              into the new stage&apos;s first field, announce the change through a live region —{" "}
              <code>Wizard</code> already does.
            </p>
          </section>
        </>
      }
    />
  );
}
