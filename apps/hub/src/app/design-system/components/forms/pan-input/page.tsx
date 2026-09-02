import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
} from "@/components/design-system/docs-kit";

import { PanInputPlayground } from "./pan-input-playground";

export const metadata: Metadata = {
  title: "PAN Input — Design System",
  description:
    "A ten-character Permanent Account Number field that uppercases as you type and validates the holder-type character.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.5 Identify Input Purpose",
    level: "AA",
    description:
      "`autocomplete` is set to \"off\" deliberately. There is no standard token for a PAN, and a wrong guess would autofill a different identity number into it.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    description:
      "A real `<input type=\"text\">`. Autocorrect, autocapitalisation and spellcheck are all turned off, because a PAN is not a word and each of them fights the reader.",
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
      "The shape check runs on the client, so `aria-invalid` is set the moment ten characters fail rather than at submission.",
  },
  {
    criterion: "3.3.3 Error Suggestion",
    level: "AA",
    description:
      "The example format is carried in the placeholder and should be repeated in the hint, so the correction is available to a reader who never sees the placeholder.",
  },
  {
    criterion: "GIGW 3.0 — Forms",
    level: "GIGW",
    description:
      "The reader is not told off for typing their own PAN in lower case; the field normalises rather than rejecting.",
  },
];

export default function PanInputPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="PAN Input"
      status="Stable"
      summary="A ten-character Permanent Account Number field in the AAAAA9999A shape. It uppercases as you type, so nobody is told off for typing their own PAN in lower case, and it validates the fourth character against the holder-type codes."
      figma={{ absent: "Not yet published in the Figma library." }}
      specimen={<PanInputPlayground />}
      propsFrom="PanInputProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A service journey requires the applicant's Permanent Account Number — commonly for verification or a direct benefit transfer.",
          "A malformed PAN should be caught inline rather than by the department's own systems later.",
        ],
        avoid: [
          "The field holds an Aadhaar number — use Aadhaar Input, which carries the checksum and the masking.",
          "The field holds a one-time password — use OTP Input.",
          "You were about to write your own regular expression for a PAN. This component already checks the holder-type character, which a shape-only pattern does not.",
        ],
      }}
      related={[
        {
          label: "Aadhaar Input",
          href: "/design-system/components/forms/aadhaar-input",
          reason: "the other identity number a service journey asks for",
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
        <section className="cdp__section" aria-labelledby="cdp-shape">
          <h2 id="cdp-shape" className="cdp__h2">
            The Fourth Character
          </h2>
          <p>
            A PAN is ten characters in the <code>AAAAA9999A</code> shape, and its fourth character
            names the holder type. A PAN whose fourth character is not one of{" "}
            <code>PCHFATBLJGE</code> is malformed however well the rest of it matches, which is why a
            shape-only pattern is not enough.
          </p>
          <p>
            <code>panHolderType()</code> returns the decoded type. Showing it back — &quot;Individual&quot;,
            &quot;Company&quot; — is a quiet confirmation to the reader that they typed the card they
            meant to.
          </p>
        </section>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { FormField, PanInput, isValidPan } from "@mosje/design-system";

const [pan, setPan] = React.useState("");

<FormField
  label="PAN"
  required
  hint="10 characters, as printed on your PAN card"
  error={touched && !isValidPan(pan) ? "Enter a valid PAN, for example ABCPE1234F." : undefined}
>
  {(control) => <PanInput {...control} value={pan} onValueChange={setPan} />}
</FormField>`}</CodeBlock>
          <p>
            Rely on <code>onValueChange</code> for the stored value: it is already uppercased and
            stripped of anything that is not alphanumeric, so no normalisation is needed on the way to
            the database.
          </p>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-a11y-notes">
          <h2 id="cdp-a11y-notes" className="cdp__h2">
            Notes
          </h2>
          <p>
            <code>autoCapitalize=&quot;characters&quot;</code> is set so a mobile keyboard offers
            capitals from the first keystroke, and <code>autoCorrect</code> and{" "}
            <code>spellCheck</code> are off so the platform does not try to turn a PAN into a word.
          </p>
          <p>
            The placeholder <code>ABCPE1234F</code> is an example, not a label. Repeat the format in
            the Form Field hint, which is linked with <code>aria-describedby</code> and survives the
            reader starting to type.
          </p>
        </section>
      }
    />
  );
}
