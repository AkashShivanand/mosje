import type { Metadata } from "next";
import * as React from "react";

import {
  Callout,
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
  type PropDef,
} from "@/components/design-system/docs-kit";
import { Playground } from "@/components/design-system/playground";

export const metadata: Metadata = {
  title: "Input — Design System",
  description:
    "A single-line text field built on the native input element and styled on the token contract. Pair it with FormField so the label, hint and error wiring come for free.",
};

/*
 * Read off `InputProps` in packages/design-system/components/forms/input.tsx.
 * The interface extends `InputHTMLAttributes<HTMLInputElement>` minus `size`,
 * so every native attribute — `value`, `onChange`, `name`, `required`,
 * `maxLength`, `autoComplete` — passes through and is not listed individually.
 */
const PROPS: PropDef[] = [
  {
    name: "invalid",
    type: "boolean",
    default: "false",
    description:
      "Renders the error state and sets `aria-invalid` on the input. FormField sets this for you from its own `error` prop.",
  },
  {
    name: "leftIcon",
    type: "React.ReactNode",
    default: "undefined",
    description:
      "Decorative icon inside the field, before the text. It is `aria-hidden`, so it is never the field's accessible name — the field still needs a real label.",
  },
  {
    name: "rightIcon",
    type: "React.ReactNode",
    default: "undefined",
    description:
      "Trailing slot inside the field. Unlike `leftIcon` this is NOT hidden from assistive technology, because it is commonly an interactive control. Give that control its own accessible name. For a password reveal, use Password Input instead.",
  },
  {
    name: "type",
    type: "string",
    default: '"text"',
    description: "Native input type — text, email, tel, number, date, search, and the rest.",
  },
  {
    name: "className",
    type: "string",
    default: "undefined",
    description:
      "Merged onto the input itself. With an icon present the input is wrapped in a positioned shell; the class still lands on the input, not the shell.",
  },
  {
    name: "...native",
    type: "Omit<React.InputHTMLAttributes<HTMLInputElement>, \"size\">",
    default: "—",
    description:
      "Every native input attribute is forwarded to the underlying element, including `ref`. `size` is removed because it collides with the estate's own size vocabulary.",
  },
];

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "The label is associated through `htmlFor`/`id`. Wrap the input in FormField, or supply your own `<label htmlFor>`; placeholder text is not a label.",
  },
  {
    criterion: "1.3.5 Identify Input Purpose",
    level: "AA",
    description:
      "The native `autocomplete` attribute passes through unchanged, so a field collecting a name, an email address or a telephone number can declare its purpose.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    description: "A real `<input>` carries the native key handling. Nothing is re-implemented.",
  },
  {
    criterion: "2.5.8 Target Size (Minimum)",
    level: "AA",
    description:
      "The field has a 44px minimum height — past the 24×24 Level AA minimum, and meeting the 44×44 Level AAA size of 2.5.5.",
  },
  {
    criterion: "3.3.1 Error Identification",
    level: "A",
    description:
      "`invalid` sets `aria-invalid`, and FormField links the message with `aria-describedby` and `role=\"alert\"`.",
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    description:
      "Role and value are native. A decorative `leftIcon` is `aria-hidden`, so it cannot displace the accessible name.",
  },
  {
    criterion: "GIGW 3.0 — Forms",
    level: "GIGW",
    description: "Every control carries a persistent visible label; placeholder text is never the label.",
  },
];

const EXAMPLE = `<Input placeholder="Enter your full name" />`;

export default function InputPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Input"
      status="Stable"
      summary="A single-line text field built on the native input element and styled on the token contract. It accepts every native input attribute and adds one prop for the error state. In practice it is rarely used alone — wrap it in a Form Field so the label, hint and error wiring come with it."
      figma={{ node: "inputs" }}
      specimen={<Playground code={EXAMPLE} />}
      props={PROPS}
      a11y={A11Y}
      whenToUse={{
        use: [
          "A reader enters a single line of text, a number, a date or a telephone number.",
          "The value is free-form and the department cannot publish a list of allowed answers.",
          "A leading icon clarifies what the field holds, or a trailing control acts on it.",
        ],
        avoid: [
          "The answer runs to several lines — use Textarea, which is resizable and sized in rows.",
          "The answer is one of a known list — use Select, or a Radio group below about six options.",
          "The field holds a password — use Password Input, which carries the reveal toggle and suppresses the browser's competing one.",
          "The field filters a list or submits a query — use Search, which carries the icon, the clear control and the suggestion list.",
          "The field holds an Aadhaar number, a PAN or a one-time password — those have their own controls, with the checksum and the masking already in them.",
        ],
      }}
      related={[
        {
          label: "Form Field",
          href: "/design-system/components/forms/form-field",
          reason: "the label, hint and error wiring this control expects",
        },
        {
          label: "Textarea",
          href: "/design-system/components/forms/textarea",
          reason: "when the answer runs to several lines",
        },
        {
          label: "Select",
          href: "/design-system/components/forms/select",
          reason: "when the answer is one of a published list",
        },
        {
          label: "Password Input",
          href: "/design-system/components/forms/password-input",
          reason: "when the field holds a password",
        },
      ]}
      design={
        <section className="cdp__section" aria-labelledby="cdp-icons">
          <h2 id="cdp-icons" className="cdp__h2">
            Adornments
          </h2>
          <p>
            With no icon the component renders a bare <code>&lt;input&gt;</code> and no wrapper, so an
            existing layout is untouched. Passing <code>leftIcon</code> or <code>rightIcon</code> wraps
            the field in a positioned shell and pads the text to clear the adornment.
          </p>
          <p>
            The two slots are not symmetrical, and the difference is deliberate. The left slot is
            decorative and hidden from assistive technology. The right slot is not hidden, because it
            is usually a control — a clear button, a unit switch — and a control with no accessible
            name is unusable.
          </p>
        </section>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { FormField, Input } from "@mosje/design-system";

<FormField label="Full Name" hint="As shown on your Aadhaar card" required>
  {(control) => <Input {...control} placeholder="Enter your full name" />}
</FormField>`}</CodeBlock>
          <p>
            The error state is set by Form Field, not by hand. Passing an <code>error</code> message
            sets <code>invalid</code> on the control, links the message through{" "}
            <code>aria-describedby</code>, and gives it <code>role=&quot;alert&quot;</code>.
          </p>
          <CodeBlock>{`<FormField label="Email Address" error="Enter a valid email address.">
  {(control) => <Input {...control} type="email" placeholder="you@example.com" />}
</FormField>`}</CodeBlock>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-a11y-notes">
          <h2 id="cdp-a11y-notes" className="cdp__h2">
            Notes
          </h2>
          <Callout type="warning" title="A Placeholder Is Not a Label">
            Placeholder text disappears the moment the reader types, so it cannot carry the question
            the field is asking. It also renders at a lower contrast than body text. Every field
            keeps a visible label, which is what Form Field provides.
          </Callout>
          <p>
            The 44px minimum height is a property of the component, not of the page that uses it. Do
            not override it with a shorter class to fit a dense row; the compact form control on this
            estate is the <code>filter</code> appearance of Select, which was sized deliberately.
          </p>
        </section>
      }
    />
  );
}
