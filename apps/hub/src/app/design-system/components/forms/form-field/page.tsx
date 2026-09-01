import type { Metadata } from "next";
import * as React from "react";

import {
  Callout,
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
  type PropDef,
} from "@/components/design-system/docs-kit";

import { FormFieldPlayground } from "./form-field-playground";

export const metadata: Metadata = {
  title: "Form Field — Design System",
  description:
    "The molecule that ties a control to its label, hint and error message, and wires every accessibility attribute through a render prop.",
};

/*
 * Read off `FormFieldProps` in packages/design-system/components/forms/form-field.tsx.
 * `children` is a render prop, not a node — it receives FormFieldControlProps
 * `{ id, invalid, required?, "aria-describedby"? }` and returns the control.
 */
const PROPS: PropDef[] = [
  {
    name: "label",
    type: "React.ReactNode",
    required: true,
    description:
      "The visible field label, associated with the control through `htmlFor`/`id`. There is no way to render this field without one, which is the point.",
  },
  {
    name: "children",
    type: "(control: FormFieldControlProps) => React.ReactNode",
    required: true,
    description:
      "Render prop receiving `{ id, invalid, required, \"aria-describedby\" }`. Spread it onto Input, Textarea, Select or any control that accepts native attributes.",
  },
  {
    name: "id",
    type: "string",
    default: "auto",
    description:
      "Control id. Falls back to a generated `useId()`. Pass one only when another element must reference it.",
  },
  {
    name: "hint",
    type: "React.ReactNode",
    default: "undefined",
    description:
      "Helper text. It renders BELOW the control, so inputs stay aligned across a grid row, and is linked through `aria-describedby`.",
  },
  {
    name: "error",
    type: "React.ReactNode",
    default: "undefined",
    description:
      "Error message. Its presence sets `invalid` on the control, links the message through `aria-describedby`, and gives the message `role=\"alert\"`.",
  },
  {
    name: "required",
    type: "boolean",
    default: "false",
    description:
      "Adds the visible marker to the label and passes `required` through to the control, so the requirement is programmatic and not only visual.",
  },
  {
    name: "className",
    type: "string",
    default: "undefined",
    description: "Merged onto the wrapping `<div>`.",
  },
];

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "The label's `htmlFor` matches the control's `id`, so clicking the label focuses the field and assistive technology reads the right name.",
  },
  {
    criterion: "1.4.1 Use of Colour",
    level: "A",
    description:
      "The required state is carried by the marker and the `required` attribute, and the error state by `role=\"alert\"` text — neither depends on the red border.",
  },
  {
    criterion: "3.3.1 Error Identification",
    level: "A",
    description:
      "An `error` sets `aria-invalid` on the control and renders the message in a `role=\"alert\"` region, so it is announced the moment it appears.",
  },
  {
    criterion: "3.3.2 Labels or Instructions",
    level: "A",
    description:
      "The hint is linked through `aria-describedby` and read with the field, so the instruction reaches a screen-reader user in the same breath as the question.",
  },
  {
    criterion: "3.3.3 Error Suggestion",
    level: "AA",
    description:
      "The message is the caller's text, and this component gives it a place where a suggested correction is read out rather than only shown.",
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    description:
      "The wiring is passed to the control rather than reimplemented around it, so the control keeps its own native role and value.",
  },
  {
    criterion: "GIGW 3.0 — Forms",
    level: "GIGW",
    description:
      "Every field carries a persistent visible label, a linked instruction where one is needed, and an announced error.",
  },
];

export default function FormFieldPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Form Field"
      status="Stable"
      summary="The molecule that ties a control to its label, its optional hint and its optional error message, and wires every accessibility attribute for you. Almost every input, select and textarea in the estate is wrapped in one."
      figma={{ absent: "Not yet published in the Figma library." }}
      specimen={<FormFieldPlayground />}
      props={PROPS}
      a11y={A11Y}
      whenToUse={{
        use: [
          "Any control a reader fills in as part of a form the department will act on.",
          "A control that needs an instruction, a validation message, or both.",
          "A control inside a Form Section grid, where the label and hint positions must match every sibling.",
        ],
        avoid: [
          "The layout genuinely cannot take a label above the control — use Label and wire `htmlFor` by hand, and record why.",
          "The control is a Declaration Checkbox, which carries its own panel, statement and error.",
          "The text is a section heading rather than a field name — use Form Section or Form Card.",
        ],
      }}
      related={[
        {
          label: "Input",
          href: "/design-system/components/forms/input",
          reason: "the control this wrapper is used with most often",
        },
        {
          label: "Label",
          href: "/design-system/components/forms/label",
          reason: "when the layout cannot take this wrapper's structure",
        },
        {
          label: "Form Section",
          href: "/design-system/components/forms/form-section",
          reason: "the titled grid these fields are laid out in",
        },
        {
          label: "Alert",
          href: "/design-system/components/feedback/alert",
          reason: "for an error summary covering the whole form",
        },
      ]}
      design={
        <section className="cdp__section" aria-labelledby="cdp-renderprop">
          <h2 id="cdp-renderprop" className="cdp__h2">
            The Render Prop, in Plain English
          </h2>
          <Callout type="info" title="Why a Function and Not a Child">
            Form Field takes a function as its child. That function receives the <code>id</code>, the{" "}
            <code>invalid</code> state, the <code>required</code> flag and the{" "}
            <code>aria-describedby</code> wiring, and you spread them onto your control. The label is
            therefore always connected to the input, error messages are always announced, and there is
            no version of the component where somebody forgot an attribute.
          </Callout>
          <p>
            The hint sits below the control rather than under the label. That is a layout decision
            with a reason: in a two- or three-column Form Section grid, hints of different lengths
            above the controls push the inputs out of alignment across the row.
          </p>
        </section>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { FormField, Input } from "@mosje/design-system";

<FormField label="First Name" required hint="As shown on your Aadhaar card">
  {(control) => <Input {...control} placeholder="e.g. Ramesh" />}
</FormField>`}</CodeBlock>
          <p>
            Passing an <code>error</code> is the whole of the error state — there is no second
            attribute to remember.
          </p>
          <CodeBlock>{`<FormField
  label="Email Address"
  error={touched && !valid ? "Enter a valid email address." : undefined}
>
  {(control) => <Input {...control} type="email" />}
</FormField>`}</CodeBlock>
          <p>
            The wiring object is typed as <code>FormFieldControlProps</code>, so a control that does
            not accept native attributes will fail to compile rather than silently drop the id.
          </p>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-a11y-notes">
          <h2 id="cdp-a11y-notes" className="cdp__h2">
            Notes
          </h2>
          <p>
            When both a hint and an error are present, <code>aria-describedby</code> lists the hint
            first and the error second, so the reader hears the instruction before the correction.
          </p>
          <p>
            The error message carries <code>role=&quot;alert&quot;</code>, which announces on
            appearance. Render it only once the reader has attempted the field or the form — an alert
            that fires on every keystroke is worse than no alert.
          </p>
        </section>
      }
    />
  );
}
