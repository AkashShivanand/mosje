import type { Metadata } from "next";
import * as React from "react";

import {
  Callout,
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
} from "@/components/design-system/docs-kit";

import { FormFieldPlayground } from "./form-field-playground";

export const metadata: Metadata = {
  title: "Form Field — Design System",
  description:
    "The molecule that ties a control to its label, hint and error message, and wires every accessibility attribute through a render prop.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    status: "verified",
    evidence:
      "The label is bound with `htmlFor`/`id`, and hint, contextual help, status message and character count are composed into ONE `aria-describedby` string \u2014 in a single expression, so no feature can displace another. Ids the caller supplies in `describedBy` join the same list rather than replacing it.",
    description:
      "Systems that set `aria-describedby` per feature let the last writer win, and a reader loses the hint the moment an error appears.",
  },
  {
    criterion: "1.4.1 Use of Colour",
    level: "A",
    status: "verified",
    evidence:
      "Every status message carries a glyph, a visually-hidden word (\u201cError: \u201d, \u201cWarning: \u201d, \u201cSuccess: \u201d) and the text itself. The colours are `--sa-text-status-*-base`, measured 2026-09-03 on white: error 9.1:1, warning 7.79:1, success 11.67:1.",
    description: "Three channels before colour, and colour that would pass on its own anyway.",
  },
  {
    criterion: "3.3.1 Error Identification",
    level: "A",
    status: "verified",
    evidence:
      "`error` sets `aria-invalid` on the control and links the message. `warning` and `success` deliberately do not \u2014 a warning that blocks is an error wearing the wrong colour.",
    description: "Precedence is fixed: error, then warning, then success. Only one message shows.",
  },
  {
    criterion: "4.1.3 Status Messages",
    level: "AA",
    status: "verified",
    evidence:
      "Two live regions are present from the first paint holding empty strings, and are filled only when the message changes AFTER mount. Verified by rendering a field with an error already present: nothing is announced on load, and the same error arriving from a client-side validator is. An error is assertive; a warning or success is polite.",
    description:
      "A plain `role=\"alert\"` on the message \u2014 which is what this component used to ship, and what most React systems still ship \u2014 announces every server-rendered validation error on page load, out of reading order and detached from its field. An initially-present error belongs to Error Summary, which takes focus.",
  },
  {
    criterion: "3.3.2 Labels or Instructions",
    level: "A",
    status: "verified",
    evidence:
      "The label is always rendered. `labelHidden` hides it visually only. `labelHelp` is a disclosure button with `aria-expanded` and `aria-controls`, and its target is rendered even while shut \u2014 hidden with the `hidden` attribute \u2014 so the reference always resolves.",
    description:
      "A disclosure rather than a tooltip: a tooltip cannot be opened by touch and cannot be read at leisure.",
  },
  {
    criterion: "3.3.3 Error Suggestion",
    level: "AA",
    status: "partial",
    evidence:
      "The component renders whatever message it is given; it cannot enforce the wording. UX4G\u2019s formula \u2014 [Problem] + [Solution], \u201cEnter a valid 10-digit mobile number\u201d, not \u201cInvalid input\u201d \u2014 is stated here and in the props table, and is the caller\u2019s responsibility.",
    description: "The one criterion on this page that code cannot close.",
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    status: "verified",
    evidence:
      "`required` is passed to the control, so a screen reader announces \u201crequired\u201d and the asterisk stays `aria-hidden`. \u201c(optional)\u201d is left readable, because there is no attribute for it to announce instead. `readOnly` is passed as a real `readonly`.",
    description:
      "Read-only is not disabled: the field keeps its place in the tab order and its value stays selectable, so a citizen can copy an application number out of it.",
  },
  {
    criterion: "GIGW 3.0 \u2014 Forms",
    level: "GIGW",
    status: "verified",
    evidence:
      "Associated label, visible required indicator with an explaining legend, helper text wired through `aria-describedby`, error linked with `aria-invalid` \u2014 the four GIGW names for forms, and Error Summary supplies the fifth.",
    description: "The marking convention itself comes from Field Policy Provider, one per form.",
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
      propsFrom="FormFieldProps"
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
        <>
        <section className="cdp__section" aria-labelledby="cdp-customise">
          <h2 id="cdp-customise" className="cdp__h2">
            Making It Yours
          </h2>
          <p>
            Four levers, in the order you should reach for them. Nothing here requires forking the
            component, and none of them is a selector written against one of its internal class
            names — those are an implementation detail and they will move.
          </p>
          <ol>
            <li>
              <strong>Props.</strong> <code>size</code>, <code>orientation</code>,{" "}
              <code>messageIcon</code>, <code>footer</code>, <code>labelHidden</code>. Between them
              they cover most of what a screen asks for.
            </li>
            <li>
              <strong><code>classNames</code>.</strong> A class name per part — root, label row,
              label, help toggle, help, hint, message, count. This is the supported way to restyle
              one field without touching the rest.
            </li>
            <li>
              <strong>Data attributes.</strong> Every part carries <code>data-part</code>, and the
              root carries <code>data-status</code>, <code>data-size</code>,{" "}
              <code>data-required</code>, <code>data-readonly</code> and <code>data-disabled</code>.
              A stylesheet can target{" "}
              <code>[data-status=&quot;error&quot;] [data-part=&quot;message&quot;]</code> without
              knowing a single class name.
            </li>
            <li>
              <strong>The parts themselves.</strong> <code>FieldLabel</code>,{" "}
              <code>FieldHint</code>, <code>FieldMessage</code>, <code>FieldHelp</code>,{" "}
              <code>FieldHelpToggle</code> and <code>useFieldIds</code> are exported. Assemble your
              own arrangement and the accessibility comes with the parts rather than being
              re-implemented.
            </li>
          </ol>
          <Callout type="info" title="Ids Are Derived, Not Registered">
            <code>useFieldIds</code> computes every id up front from one <code>useId</code>, and the
            caller says which parts exist. A compound component that discovers its children through
            context and an effect cannot compose <code>aria-describedby</code> until after
            hydration — so the server sends a control with no description, and a screen reader
            reaching it first hears nothing. Less magical, and correct on the first paint.
          </Callout>
        </section>
        <section className="cdp__section" aria-labelledby="cdp-language">
          <h2 id="cdp-language" className="cdp__h2">
            Language
          </h2>
          <p>
            Every string this component speaks — the required marker, the word
            &ldquo;optional&rdquo;, the spoken status prefixes, the help button&rsquo;s name, the
            character count and the necessity legend — comes from{" "}
            <code>FieldPolicyProvider</code>. Put one at the root of a portal and the whole field
            stack changes language at once. Overrides merge over the English defaults and are
            inherited by nested providers, so a form that sets only <code>necessity</code> inside a
            Hindi portal stays in Hindi.
          </p>
          <p>
            The three count strings are functions rather than templates with placeholders, because
            pluralisation is not the same shape in every language and{" "}
            <code>{"{n} characters remaining"}</code> cannot express Hindi&rsquo;s agreement rules.
            A translator is handed the number and writes the sentence.
          </p>
        </section>
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
        </>
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
