import type { Metadata } from "next";
import * as React from "react";

import {
  Callout,
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
  type PropDef,
} from "@/components/design-system/docs-kit";
import { IdentityInputsDemo } from "@/components/design-system/demos/identity-inputs-demo";

export const metadata: Metadata = {
  title: "Identity Inputs — Design System",
  description:
    "The three Indian identity controls every MoSJE service journey needs: a Verhoeff-checked, masked-by-default Aadhaar field, a six-box OTP input with paste and SMS autofill, and a PAN field that validates the holder-type character.",
};

/*
 * An OVERVIEW page covering three components, each of which also has a page of
 * its own. The props below are the three interfaces merged and prefixed by the
 * component that owns them, read off aadhaar-input.tsx, otp-input.tsx and
 * pan-input.tsx. Two corrections against the previous version of this page:
 * OtpInput's handler is `onValueChange`, not `onChange`, and its `label` is
 * required with no default.
 */
const PROPS: PropDef[] = [
  {
    name: "AadhaarInput · value",
    type: "string",
    required: true,
    description: "The raw twelve digits, no separators. Controlled.",
  },
  {
    name: "AadhaarInput · onValueChange",
    type: "(digits: string) => void",
    required: true,
    description: "Called with raw digits only — never the formatted or masked string.",
  },
  {
    name: "AadhaarInput · mask",
    type: "boolean",
    default: "true",
    description:
      "Masks to the last four digits once complete and not focused. Turn it off only with a recorded reason.",
  },
  {
    name: "AadhaarInput · invalid",
    type: "boolean",
    default: "false",
    description:
      "Forces the error state. The field also sets `aria-invalid` on its own once twelve digits fail the Verhoeff check.",
  },
  {
    name: "OtpInput · value",
    type: "string",
    required: true,
    description: "The digits entered so far, as one string. Controlled.",
  },
  {
    name: "OtpInput · onValueChange",
    type: "(digits: string) => void",
    required: true,
    description:
      "Called with the digits entered so far. This is NOT `onChange` — the component exposes no native change handler.",
  },
  {
    name: "OtpInput · label",
    type: "string",
    required: true,
    description:
      'Accessible name for the group, for example "One-time password". There is no default; six unnamed boxes are unusable with a screen reader.',
  },
  {
    name: "OtpInput · length",
    type: "number",
    default: "6",
    description: "Number of boxes. UX4G 3.0 specifies six.",
  },
  {
    name: "OtpInput · onComplete",
    type: "(digits: string) => void",
    default: "undefined",
    description: "Fires once the last box is filled. Wire the verification call here.",
  },
  {
    name: "OtpInput · invalid",
    type: "boolean",
    default: "false",
    description: "Renders the error state across every box.",
  },
  {
    name: "PanInput · value",
    type: "string",
    required: true,
    description: "The normalised PAN — uppercase, alphanumeric, ten characters or fewer. Controlled.",
  },
  {
    name: "PanInput · onValueChange",
    type: "(pan: string) => void",
    required: true,
    description: "Called with the normalised value, already uppercased and stripped.",
  },
  {
    name: "PanInput · invalid",
    type: "boolean",
    default: "false",
    description:
      "Forces the error state. The field also sets `aria-invalid` on its own once ten characters fail the shape check.",
  },
];

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.5 Identify Input Purpose",
    level: "AA",
    description:
      "The OTP's first box carries `autocomplete=\"one-time-code\"` so the platform can offer the code. Aadhaar and PAN set `autocomplete=\"off\"` deliberately — neither has a standard token, and a wrong guess would autofill the wrong identity number.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    description:
      "All three are real inputs. The OTP adds arrow-key movement between boxes and a Backspace that steps back rather than stranding the caret.",
  },
  {
    criterion: "2.5.8 Target Size (Minimum)",
    level: "AA",
    description:
      "Every OTP box is at least 44px tall; below 380px the boxes narrow rather than pushing the page sideways, keeping the target on the axis that matters. Aadhaar and PAN inherit Input's 44px minimum.",
  },
  {
    criterion: "3.3.1 Error Identification",
    level: "A",
    description:
      "Errors are announced through Form Field's `role=\"alert\"` and linked with `aria-describedby`. Both checksums run on the client, so the message arrives before submission.",
  },
  {
    criterion: "3.3.7 Redundant Entry",
    level: "A",
    description:
      "Pasting a code into any OTP box fills all six, so a reader never retypes a code their device already holds.",
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    description:
      'The OTP is a labelled group and each box is numbered ("Digit 3 of 6"), so a screen-reader user always knows where they are in the code.',
  },
  {
    criterion: "Data protection (DPDP Act 2023)",
    level: "GIGW",
    description:
      "Aadhaar is masked to its last four digits by default wherever it is displayed, following UIDAI guidance.",
  },
];

export default function IdentityInputsPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Identity Inputs"
      status="Stable"
      summary="Aadhaar, OTP and PAN are the three identity controls almost every MoSJE service journey asks for, and the three UX4G 3.0 names explicitly. They are not plain text fields: each has a checksum or a shape, and Aadhaar carries a statutory handling obligation. Building them once is the difference between one correct implementation and twenty near-misses."
      figma={{ absent: "Not yet published in the Figma library." }}
      specimen={<IdentityInputsDemo />}
      props={PROPS}
      a11y={A11Y}
      whenToUse={{
        use: [
          "A service journey verifies who the applicant is — an application, a registration, a benefit claim.",
          "An identity number must be checked before submission rather than rejected by the department's systems later.",
          "A one-time password confirms a number the applicant has just given.",
        ],
        avoid: [
          "The field holds any other long number. A plain Input is correct; do not borrow the Aadhaar grouping or the OTP boxes for something that is not an identity credential.",
          "A security check is wanted rather than an identity check — see Captcha Field, and read its warning before adding one.",
          "Only one of the three is needed. Each has a page of its own with the whole of its own contract.",
        ],
      }}
      related={[
        {
          label: "Aadhaar Input",
          href: "/design-system/components/forms/aadhaar-input",
          reason: "the Verhoeff-checked, masked-by-default Aadhaar field",
        },
        {
          label: "OTP Input",
          href: "/design-system/components/forms/otp-input",
          reason: "the six-box one-time-password group",
        },
        {
          label: "PAN Input",
          href: "/design-system/components/forms/pan-input",
          reason: "the ten-character PAN field",
        },
        {
          label: "Form Field",
          href: "/design-system/components/forms/form-field",
          reason: "the label, hint and error wiring all three expect",
        },
      ]}
      design={
        <section className="cdp__section" aria-labelledby="cdp-three">
          <h2 id="cdp-three" className="cdp__h2">
            The Three Controls
          </h2>

          <h3>Aadhaar</h3>
          <p>
            Twelve digits, grouped <code>XXXX XXXX XXXX</code> as you type and validated with the{" "}
            <strong>Verhoeff checksum</strong> UIDAI uses. Verhoeff catches every single-digit error
            and every adjacent transposition — the two commonest ways a person mistypes a long number
            — so a typo becomes an inline message instead of a failed submission.
          </p>
          <Callout type="warning" title="It Masks by Default, and It Should Stay That Way">
            An Aadhaar number is sensitive personal data under the DPDP Act 2023, and UIDAI&apos;s
            guidance is to display only the last four digits. Once the field is complete and blurred it
            renders <code>XXXX XXXX 2346</code>. The full value stays in your state, so the form still
            works — only the display is masked. Use <code>maskAadhaar()</code> anywhere else the number
            is shown back: review steps, tables, print views, exports. Never log it, and never put it
            in a URL.
          </Callout>

          <h3>OTP</h3>
          <p>
            Six boxes, as UX4G specifies. The fiddly parts are the point, because they are what
            hand-rolled one-time-password fields almost always get wrong: pasting the code into any
            box fills all six, an SMS autofill arriving as one long value is spread across the boxes
            rather than truncated, and Backspace on an empty box steps back and clears the previous
            one instead of stranding the caret.
          </p>

          <h3>PAN</h3>
          <p>
            Ten characters in the <code>AAAAA9999A</code> shape. It uppercases as you type, so nobody
            is told off for typing their own PAN in lower case, and it validates the{" "}
            <strong>fourth character</strong> against the holder-type codes — a PAN whose fourth
            character is not one of <code>PCHFATBLJGE</code> is malformed no matter how well the rest
            matches. <code>panHolderType()</code> returns the decoded type, which is worth showing
            back as a quiet confirmation that the right card was typed.
          </p>
        </section>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Examples
          </h2>
          <CodeBlock>{`import { AadhaarInput, FormField, isValidAadhaar } from "@mosje/design-system";

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
          <CodeBlock>{`import { OtpInput } from "@mosje/design-system";

<OtpInput
  label="One-time password"
  value={otp}
  onValueChange={setOtp}
  onComplete={(code) => verify(code)}
/>`}</CodeBlock>
          <CodeBlock>{`import { PanInput, isValidPan } from "@mosje/design-system";

<FormField
  label="PAN"
  hint="10 characters, as printed on your PAN card"
  error={touched && !isValidPan(pan) ? "Enter a valid PAN, for example ABCPE1234F." : undefined}
>
  {(control) => <PanInput {...control} value={pan} onValueChange={setPan} />}
</FormField>`}</CodeBlock>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-ux4g">
          <h2 id="cdp-ux4g" className="cdp__h2">
            UX4G Parity
          </h2>
          <p>
            These implement UX4G 3.0&apos;s <em>Input - Aadhaar</em>, <em>Input - OTP</em> and{" "}
            <em>Input - Pan Card</em> as React components on the SAMAVESH token contract. They are
            also the clearest candidates to contribute back under clause 4 of the adoption directive:
            UX4G specifies these components but ships no React implementation of them.
          </p>
          <p>
            Each control has a page of its own carrying the full props table, the keyboard map and the
            criteria it meets. This page is the overview; those are the contracts.
          </p>
        </section>
      }
    />
  );
}
