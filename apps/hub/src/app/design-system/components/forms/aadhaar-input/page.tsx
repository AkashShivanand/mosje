import type { Metadata } from "next";
import * as React from "react";

import {
  Callout,
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
  type PropDef,
} from "@/components/design-system/docs-kit";

import { AadhaarInputPlayground } from "./aadhaar-input-playground";

export const metadata: Metadata = {
  title: "Aadhaar Input — Design System",
  description:
    "A twelve-digit Aadhaar field, grouped as you type, Verhoeff-checked, and masked to its last four digits by default.",
};

/*
 * Read off `AadhaarInputProps` in
 * packages/design-system/components/forms/aadhaar-input.tsx. The interface
 * extends `InputHTMLAttributes<HTMLInputElement>` minus `value`, `onChange`,
 * `type`, `maxLength` and `inputMode` — all five are owned by the component.
 */
const PROPS: PropDef[] = [
  {
    name: "value",
    type: "string",
    required: true,
    description: "The raw twelve digits, no separators. Controlled.",
  },
  {
    name: "onValueChange",
    type: "(digits: string) => void",
    required: true,
    description:
      "Called with RAW DIGITS only — never the formatted or masked string — so the separators can never reach your state or your API. This is not `onChange`, which the interface removes.",
  },
  {
    name: "invalid",
    type: "boolean",
    default: "false",
    description:
      "Forces the error state. The field also sets `aria-invalid` on its own once twelve digits fail the Verhoeff check, so this is for a rejection that came from elsewhere.",
  },
  {
    name: "mask",
    type: "boolean",
    default: "true",
    description:
      "Masks to the last four digits once the field is complete and not focused. Leave it on unless there is a specific, recorded reason: an Aadhaar number is sensitive personal data under the DPDP Act 2023.",
  },
  {
    name: "className",
    type: "string",
    default: "undefined",
    description: "Merged onto the input element.",
  },
  {
    name: "...native",
    type: "Omit<React.InputHTMLAttributes<HTMLInputElement>, \"value\" | \"onChange\" | \"type\" | \"maxLength\" | \"inputMode\">",
    default: "—",
    description:
      "Every other native input attribute is forwarded, including `id`, `required`, `disabled`, `aria-describedby` and `ref`. `onFocus` and `onBlur` are chained after the component's own.",
  },
];

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.5 Identify Input Purpose",
    level: "AA",
    description:
      "`autocomplete` is set to \"off\" deliberately. There is no standard token for an Aadhaar number, and a wrong guess would autofill a different identity number into it.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    description:
      "A real `<input type=\"text\">` with `inputMode=\"numeric\"`, so a phone offers a numeric keypad without the leading-zero stripping and wheel-scrolling of a number input.",
  },
  {
    criterion: "2.5.8 Target Size (Minimum)",
    level: "AA",
    description: "The field inherits the 44px minimum height of Input.",
  },
  {
    criterion: "3.3.1 Error Identification",
    level: "A",
    description:
      "The Verhoeff check runs on the client, so `aria-invalid` is set the moment twelve digits fail rather than at submission. Form Field carries the message with `role=\"alert\"`.",
  },
  {
    criterion: "3.3.3 Error Suggestion",
    level: "AA",
    description:
      "Verhoeff catches every single-digit error and every adjacent transposition — the two commonest ways a person mistypes a long number — so the message can say the number is wrong rather than that submission failed.",
  },
  {
    criterion: "Data protection (DPDP Act 2023)",
    level: "GIGW",
    description:
      "The number is masked to its last four digits by default wherever it is displayed, following UIDAI guidance.",
  },
];

export default function AadhaarInputPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Aadhaar Input"
      status="Stable"
      summary="A twelve-digit Aadhaar field, grouped as you type, validated with the Verhoeff checksum UIDAI uses, and masked to its last four digits once complete and blurred. It hands your state raw digits, never the formatted or masked string."
      figma={{ absent: "Not yet published in the Figma library." }}
      specimen={<AadhaarInputPlayground />}
      props={PROPS}
      a11y={A11Y}
      whenToUse={{
        use: [
          "A service journey requires the applicant's Aadhaar number.",
          "A mistyped digit should be caught inline rather than at submission.",
          "The number will be shown back on screen, where masking is a statutory expectation rather than a preference.",
        ],
        avoid: [
          "The field holds a PAN — use PAN Input, which validates the holder-type character.",
          "The field holds a one-time password — use OTP Input, which handles paste and SMS autofill.",
          "The field holds any other long number. A plain Input is correct; do not borrow the Aadhaar grouping for something that is not an Aadhaar number.",
        ],
      }}
      related={[
        {
          label: "PAN Input",
          href: "/design-system/components/forms/pan-input",
          reason: "the other identity number a service journey asks for",
        },
        {
          label: "OTP Input",
          href: "/design-system/components/forms/otp-input",
          reason: "the verification step that usually follows",
        },
        {
          label: "Identity Inputs",
          href: "/design-system/components/forms/identity-inputs",
          reason: "the three identity controls documented together",
        },
        {
          label: "Form Field",
          href: "/design-system/components/forms/form-field",
          reason: "the label, hint and error wiring this control expects",
        },
      ]}
      design={
        <section className="cdp__section" aria-labelledby="cdp-mask">
          <h2 id="cdp-mask" className="cdp__h2">
            Masking and Privacy
          </h2>
          <Callout title="Privacy and the DPDP Act 2023" type="warning">
            An Aadhaar number is sensitive personal data, and UIDAI&apos;s guidance is to display only
            the last four digits. Once the field is complete and blurred it renders{" "}
            <code>XXXX XXXX 2346</code>. The full value stays in your state, so the form still works —
            only the display is masked. Do not turn <code>mask</code> off without a recorded reason,
            and use the same masking wherever the number is shown back: review steps, tables, print
            views, exports. Never log it and never put it in a URL.
          </Callout>
          <p>
            The caret is re-anchored to the same digit after each keystroke, so editing the middle of
            the number does not throw the cursor to the end. That is the defect most hand-rolled
            formatted inputs carry, and it is invisible until somebody corrects a typo.
          </p>
        </section>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { AadhaarInput, FormField } from "@mosje/design-system";
import { isValidAadhaar } from "@mosje/design-system";

const [aadhaar, setAadhaar] = React.useState("");

<FormField
  label="Aadhaar Number"
  required
  hint="12 digits, as printed on your Aadhaar"
  error={touched && !isValidAadhaar(aadhaar)
    ? "That is not a valid Aadhaar number."
    : undefined}
>
  {(control) => (
    <AadhaarInput {...control} value={aadhaar} onValueChange={setAadhaar} />
  )}
</FormField>`}</CodeBlock>
          <p>
            Store the raw twelve digits. The component owns the formatting and the masking; a second
            copy of either in your own state will drift from it.
          </p>
          <CodeBlock>{`import { maskAadhaar } from "@mosje/design-system";

// Anywhere the number is displayed back — review steps, tables, print views.
<dd>{maskAadhaar(application.aadhaar)}</dd>`}</CodeBlock>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-a11y-notes">
          <h2 id="cdp-a11y-notes" className="cdp__h2">
            Notes
          </h2>
          <p>
            The field is <code>type=&quot;text&quot;</code> with{" "}
            <code>inputMode=&quot;numeric&quot;</code>, not <code>type=&quot;number&quot;</code>. A
            number input strips leading zeros, shows a spinner, and lets the mouse wheel silently
            change the value — all three of which are wrong for an identity number.
          </p>
          <p>
            Masking is a display state, not a value change. A screen-reader user who focuses the field
            hears the unmasked number, because they are the one who entered it; the mask exists to
            stop it being read over their shoulder.
          </p>
        </section>
      }
    />
  );
}
