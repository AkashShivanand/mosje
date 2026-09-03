import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
} from "@/components/design-system/docs-kit";

import { TextareaPlayground } from "./textarea-playground";

export const metadata: Metadata = {
  title: "Textarea — Design System",
  description:
    "A native, vertically resizable multi-line text field for long-form answers such as grievance descriptions, remarks and addresses.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    status: "verified",
    evidence:
      "Label bound by Form Field through `htmlFor`/`id`; hint, message and character count composed into one `aria-describedby`.",
    description:
      "Pair with Form Field so the label is associated with the textarea through `htmlFor`/`id`. A placeholder is not a label.",
  },
  {
    criterion: "1.4.4 Resize Text",
    level: "AA",
    status: "verified",
    evidence:
      "Sizes and leading are token-bound in rem, so browser zoom to 200% reflows rather than clipping. `autoResize` measures computed line-height rather than assuming one.",
    description:
      "The field is sized in `rows` and in tokenised type, so it grows with the reader's text size rather than clipping it.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    status: "verified",
    evidence:
      "A real `<textarea>`; nothing re-implemented. A read-only field keeps its tab stop and its value stays selectable.",
    description:
      "A real `<textarea>` carries the native key handling, including Enter for a new line — which is why a textarea inside a form does not submit it.",
  },
  {
    criterion: "3.3.1 Error Identification",
    level: "A",
    status: "verified",
    evidence:
      "`status=\"error\"` (and the legacy `invalid`) set `aria-invalid`; `warning` and `success` deliberately do not.",
    description:
      "`invalid` sets `aria-invalid`; Form Field links the message with `aria-describedby` and `role=\"alert\"` so it is announced when it appears.",
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    status: "verified",
    evidence:
      "Role and value are native. `data-status` drives the border only; the message below carries the words.",
    description: "Role and value are native. Nothing is re-implemented in ARIA.",
  },
  {
    criterion: "GIGW 3.0 — Forms",
    level: "GIGW",
    status: "verified",
    evidence:
      "Persistent visible label supplied by Form Field; placeholder is never the label.",
    description:
      "A character limit is stated in the hint, where `aria-describedby` reads it with the field, rather than only enforced by `maxLength`.",
  },
];

export default function TextareaPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Textarea"
      status="Stable"
      summary="A native, vertically resizable multi-line text field for long-form answers — a grievance description, a set of remarks, an address. It shares the error state and the token styling of Input, and is sized in rows rather than pixels."
      figma={{ node: "inputArea" }}
      specimen={<TextareaPlayground />}
      propsFrom="TextareaProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "The answer is free-form prose the reader may write at any length — a description, a justification, a set of remarks.",
          "The answer is a postal address entered as one block rather than as separate fields.",
          "A reader may reasonably want to see several lines of what they have written before submitting.",
        ],
        avoid: [
          "The answer is a single line — use Input, which does not invite a length the form cannot use.",
          "The answer is one of a known list — use Select, or a Radio group below about six options.",
          "The field is rich text with formatting controls. This estate has no rich-text control, and adding one is a decision, not a substitution.",
        ],
      }}
      related={[
        {
          label: "Input",
          href: "/design-system/components/forms/input",
          reason: "when the answer is a single line",
        },
        {
          label: "Form Field",
          href: "/design-system/components/forms/form-field",
          reason: "the label, hint and error wiring this control expects",
        },
        {
          label: "Form Section",
          href: "/design-system/components/forms/form-section",
          reason: "the titled grid a long field usually spans in full",
        },
      ]}
      design={
        <section className="cdp__section" aria-labelledby="cdp-height">
          <h2 id="cdp-height" className="cdp__h2">
            Height
          </h2>
          <p>
            Four rows is the default because it shows enough for the reader to check what they wrote
            without pushing the rest of the form off the screen. Raise <code>rows</code> where the
            department genuinely expects a long answer, and leave the resize handle alone — it is the
            reader&apos;s control, not the page&apos;s.
          </p>
          <p>
            In a Form Section grid a textarea normally spans the full row. A field asking for prose
            beside two short fields reads as an afterthought, and the measure is too narrow to write
            in.
          </p>
        </section>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { FormField, Textarea } from "@mosje/design-system";

<FormField
  label="Additional Comments"
  hint="Any other information that may help the officer assessing this application."
>
  {(control) => (
    <Textarea {...control} rows={5} placeholder="Write your comments here" />
  )}
</FormField>`}</CodeBlock>
          <p>
            Where a limit applies, state it in the hint as well as enforcing it, so a screen-reader
            user hears the limit with the field rather than discovering it by being cut off.
          </p>
          <CodeBlock>{`<FormField label="Grievance Description" hint="Up to 2,000 characters." required>
  {(control) => <Textarea {...control} rows={6} maxLength={2000} />}
</FormField>`}</CodeBlock>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-keys">
          <h2 id="cdp-keys" className="cdp__h2">
            Keyboard
          </h2>
          <ul>
            <li>
              <strong>Tab</strong> — move to the field. It is one tab stop.
            </li>
            <li>
              <strong>Enter</strong> — a new line, not a submit. A textarea is the one form control
              where Enter does not submit the form, and that behaviour must not be overridden.
            </li>
          </ul>
          <p>
            The native resize handle is a pointer affordance only. Because the field is sized in rows
            and the reader can also enlarge text through the browser, nothing depends on dragging it —
            which is what keeps the component clear of 2.5.7 Dragging Movements.
          </p>
        </section>
      }
    />
  );
}
