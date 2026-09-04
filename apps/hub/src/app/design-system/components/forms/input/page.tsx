import type { Metadata } from "next";
import * as React from "react";

import {
  Callout,
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
} from "@/components/design-system/docs-kit";
import { Playground } from "@/components/design-system/playground";

export const metadata: Metadata = {
  title: "Input — Design System",
  description:
    "A single-line text field built on the native input element and styled on the token contract. Pair it with FormField so the label, hint and error wiring come for free.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    status: "verified",
    evidence:
      "The label is associated through `htmlFor`/`id` by Form Field. A prefix or suffix is `aria-hidden` and its meaning is carried by a visually-hidden description joined into `aria-describedby`, so \u20b9 is announced as \u201cAmount in rupees\u201d rather than as a symbol inside the value.",
    description:
      "Wrap the input in Form Field, or supply your own `<label htmlFor>`; placeholder text is not a label.",
  },
  {
    criterion: "1.3.5 Identify Input Purpose",
    level: "AA",
    status: "verified",
    evidence:
      "`autoComplete` is typed to `AutocompleteToken`, the union of the HTML autofill field names. Verified by compiling `autoComplete=\"firstname\"`, which fails the build; `autoComplete=\"given-name\"` compiles.",
    description:
      "The criterion most often claimed and least often checked, because `autocomplete` is a plain string on every other framework\u2019s input type. Here a token that does nothing cannot ship.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    status: "verified",
    evidence:
      "A real `<input>` carries the native key handling; nothing is re-implemented. A read-only field keeps its place in the tab order and its value stays selectable.",
    description: "The adorned form wraps the same input rather than replacing it.",
  },
  {
    criterion: "1.4.11 Non-text Contrast",
    level: "AA",
    status: "verified",
    evidence:
      "The focus ring is a solid 3px outline in `--sa-color-action-primary-default` (#0373df, 4.64:1 on white; darker in the navy and dbim modes) at a 2px offset. It replaced `rgba(3, 115, 223, 0.48)`, which flattens on white to #86bcf0 \u2014 2.01:1, a failing indicator. Ratios computed 2026-09-03.",
    description:
      "An outline rather than a box-shadow, so the indicator survives Windows High Contrast Mode, where a shadow is not painted at all.",
  },
  {
    criterion: "2.5.8 Target Size (Minimum)",
    level: "AA",
    status: "verified",
    evidence:
      "The default `md` size is 44px, and the smallest offered is 40px. Any interactive child of the trailing slot is forced to a 24\u00d724 minimum by the stylesheet, so a consumer\u2019s bare `<button>` cannot inherit its icon\u2019s size.",
    description:
      "44px is WCAG 2.2\u2019s Level AAA target size (2.5.5), well past the 24px Level AA minimum. UX4G\u2019s 32px S size is deliberately not offered.",
  },
  {
    criterion: "1.4.1 Use of Colour",
    level: "A",
    status: "verified",
    evidence:
      "A status changes the border colour, and Form Field additionally prints the message in words with a glyph and a visually-hidden \u201cError: \u201d / \u201cWarning: \u201d / \u201cSuccess: \u201d prefix. Colour is the third channel, never the first.",
    description: "Warning and success are as much at risk here as error, and are treated the same way.",
  },
  {
    criterion: "3.3.1 Error Identification",
    level: "A",
    status: "verified",
    evidence:
      "`status=\"error\"` (and the legacy `invalid`) set `aria-invalid`; Form Field links the message through `aria-describedby` and announces changes in a live region.",
    description: "`warning` and `success` deliberately do NOT set `aria-invalid` \u2014 neither is a failure.",
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    status: "verified",
    evidence:
      "Role and value are native. A decorative `leftIcon` is `aria-hidden`, so it cannot displace the accessible name. `pending` sets `aria-busy` without disabling the field.",
    description: "A field being checked stays editable \u2014 a reader should not have to wait for a request they cannot see.",
  },
  {
    criterion: "GIGW 3.0 \u2014 Forms",
    level: "GIGW",
    status: "verified",
    evidence: "Every control carries a persistent visible label; placeholder text is never the label.",
    description: "Form Field renders the label; the input has no mode in which it supplies its own.",
  },
];

const EXAMPLE = `<Input placeholder="Enter your full name" />`;

const AFFIX_EXAMPLE = `// A prefix is drawn inside the border and hidden from
// assistive tech; \`prefixLabel\` is what a screen reader hears.
<FormField label="Annual income" hint="As declared in your latest ITR">
  {(control) => (
    <Input
      {...control}
      prefix="\u20b9"
      prefixLabel="Amount in rupees"
      inputMode="numeric"
      autoComplete="off"
    />
  )}
</FormField>`;

export default function InputPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Input"
      status="Stable"
      summary="A single-line text field built on the native input element and styled on the token contract. It accepts every native input attribute and adds three props of its own — the error state and the two icon slots. In practice it is rarely used alone — wrap it in a Form Field so the label, hint and error wiring come with it."
      figma={{ node: "inputField" }}
      specimen={<Playground code={EXAMPLE} />}
      propsFrom="InputProps"
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
          <Callout type="warning" title="Always Give a Symbol Prefix a prefixLabel">
            A screen reader reading \u201c\u20b9\u201d aloud says either \u201crupee sign\u201d in the middle of the
            value or nothing at all. The affix is therefore hidden, and{" "}
            <code>prefixLabel</code> carries its meaning into the field\u2019s description. The
            fallback \u2014 announcing the affix text itself \u2014 only applies when the affix is already
            a word, such as <code>kg</code>.
          </Callout>
          <CodeBlock>{AFFIX_EXAMPLE}</CodeBlock>
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
