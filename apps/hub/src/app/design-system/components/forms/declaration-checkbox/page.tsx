import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
} from "@/components/design-system/docs-kit";

import { DeclarationCheckboxPlayground } from "./declaration-checkbox-playground";

export const metadata: Metadata = {
  title: "Declaration Checkbox — Design System",
  description:
    "The statutory certification block that closes a government form: a bordered panel carrying the declaration text with a single required checkbox bound to it.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "The whole statement is bound to the checkbox through `aria-describedby`, so a screen-reader user hears the text they are attesting to when they reach the control — not only if they happen to read upward.",
  },
  {
    criterion: "2.4.1 Bypass Blocks",
    level: "A",
    description:
      "The panel is a `<section>` labelled by its own heading, so it is a named region a screen reader can jump to at the end of a long form.",
  },
  {
    criterion: "3.3.1 Error Identification",
    level: "A",
    description:
      "An `error` sets `aria-invalid` on the control and renders the message with `role=\"alert\"`, so an unchecked declaration is announced rather than only outlined.",
  },
  {
    criterion: "3.3.2 Labels or Instructions",
    level: "A",
    description:
      "The lead line states what the checkbox commits the reader to before the statement itself, in the department's own register.",
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    description:
      "The control is a real checkbox with a visible confirming label of its own, so its name is not the entire legal statement.",
  },
  {
    criterion: "GIGW 3.0 — Forms",
    level: "GIGW",
    description:
      "The declaration a citizen certifies is presented as a distinct, deliberate act with its own heading, not as one more field in a grid.",
  },
];

export default function DeclarationCheckboxPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Declaration Checkbox"
      status="Stable"
      summary="The statutory certification block that closes a government form: a bordered panel carrying the declaration text with a single required checkbox. It is its own component because the wording is legal text the citizen is attesting to, and it must read as a deliberate act rather than one more field."
      figma={{ absent: "Not yet published in the Figma library." }}
      specimen={<DeclarationCheckboxPlayground />}
      propsFrom="DeclarationCheckboxProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A form closes with a certification the citizen is legally attesting to.",
          "The statement runs to several points, each of which must be separately readable.",
          "An unchecked declaration must block submission and say so in a message a screen reader announces.",
        ],
        avoid: [
          "The agreement is one short line inside a form — use Checkbox with the line as its label.",
          "The setting takes effect immediately and is reversible — use Toggle, which is never right for a declaration.",
          "The text is guidance rather than something being certified — put it in the field's hint, or in a Callout.",
        ],
      }}
      related={[
        {
          label: "Checkbox",
          href: "/design-system/components/forms/checkbox",
          reason: "the control this panel wraps, for a one-line agreement",
        },
        {
          label: "Wizard",
          href: "/design-system/components/forms/wizard",
          reason: "the multi-step shell whose final step this closes",
        },
        {
          label: "Alert",
          href: "/design-system/components/feedback/alert",
          reason: "for the form-level error summary above the actions",
        },
      ]}
      design={
        <section className="cdp__section" aria-labelledby="cdp-why">
          <h2 id="cdp-why" className="cdp__h2">
            Why It Is Not a Checkbox
          </h2>
          <p>
            A plain Checkbox takes its label as its accessible name. Making a paragraph of legal text
            the name of a control produces something a screen reader reads as one long unbroken
            string, and something a sighted reader skims past because it looks like a field.
          </p>
          <p>
            This component separates the two: the statement is described by{" "}
            <code>aria-describedby</code>, and the control keeps a short confirming label of its own.
            The panel, the heading and the border are what make the act look deliberate.
          </p>
        </section>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { DeclarationCheckbox } from "@mosje/design-system";

<DeclarationCheckbox
  checked={agreed}
  onChange={setAgreed}
  title="Final Declaration"
  lead="By checking this box, I certify that:"
  error={submitted && !agreed ? "You must agree to the declaration before submitting." : undefined}
>
  <ul>
    <li>I am a citizen of India.</li>
    <li>I have not availed the benefits of this scheme previously.</li>
    <li>The particulars given above are true to the best of my knowledge.</li>
  </ul>
</DeclarationCheckbox>`}</CodeBlock>
          <p>
            <code>onChange</code> receives a boolean, not an event. Passing{" "}
            <code>(event) =&gt; setAgreed(event.target.checked)</code> here is a type error, and it is
            the commonest mistake when moving from Checkbox to this component.
          </p>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-a11y-notes">
          <h2 id="cdp-a11y-notes" className="cdp__h2">
            Notes
          </h2>
          <p>
            Use a <code>&lt;ul&gt;</code> where the declaration covers several points. A screen reader
            then announces the count and reads each point as an item, so a citizen can work through
            them one at a time instead of hearing a single paragraph.
          </p>
          <p>
            The heading is an <code>&lt;h3&gt;</code>, which sits correctly under a Form Section&apos;s{" "}
            <code>&lt;h2&gt;</code>. Do not place this panel above the page&apos;s first heading.
          </p>
        </section>
      }
    />
  );
}
