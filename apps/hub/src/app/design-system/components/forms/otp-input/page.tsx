import type { Metadata } from "next";
import * as React from "react";

import {
  Callout,
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
} from "@/components/design-system/docs-kit";

import { OtpInputPlayground } from "./otp-input-playground";

export const metadata: Metadata = {
  title: "OTP Input — Design System",
  description:
    "Six separate boxes for a one-time password, with paste, SMS autofill, arrow-key movement and a numbered box for every digit.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "The boxes sit in a `role=\"group\"` named by `label`, and each box is numbered — \"Digit 3 of 6\" — so a non-sighted reader always knows where they are in the code.",
  },
  {
    criterion: "1.3.5 Identify Input Purpose",
    level: "AA",
    description:
      "The first box carries `autocomplete=\"one-time-code\"` so iOS and Android offer the code from the message. Only the first, because advertising it on all six makes the platform prompt repeatedly.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    description:
      "Arrow keys move between boxes, Backspace on an empty box steps back and clears the previous one, and Delete clears the current one. Nothing strands the caret.",
  },
  {
    criterion: "2.5.8 Target Size (Minimum)",
    level: "AA",
    description:
      "Every box is at least 44px tall. Below 380px the boxes narrow rather than pushing the page sideways, which keeps the target on the axis that matters.",
  },
  {
    criterion: "3.3.1 Error Identification",
    level: "A",
    description:
      "`invalid` sets `aria-invalid` on every box, and `aria-describedby` links the message Form Field renders with `role=\"alert\"`.",
  },
  {
    criterion: "3.3.7 Redundant Entry",
    level: "A",
    description:
      "Pasting the code into any box fills all six, and an SMS autofill arriving as one multi-character value is spread across them rather than truncated — so the reader never types a code the device already has.",
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    description: "The group has a name, and each box has its own position-bearing name and value.",
  },
];

export default function OtpInputPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="OTP Input"
      status="Stable"
      summary="Six separate boxes for a one-time password, as UX4G 3.0 specifies. Pasting the code into any box fills all six, SMS autofill is spread across the boxes rather than truncated, and Backspace on an empty box steps back instead of stranding the caret."
      figma={{ absent: "Not yet published in the Figma library." }}
      specimen={<OtpInputPlayground />}
      propsFrom="OtpInputProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "The reader is entering a verification code sent by SMS or email.",
          "The code is short, numeric and fixed in length, so the boxes tell the reader how much is expected.",
          "Verification should begin the moment the last digit lands, without a separate button.",
        ],
        avoid: [
          "The field holds a PIN code, an amount, or any other number the reader knows by heart — use Input with a numeric input mode.",
          "The code is alphanumeric or variable in length. The boxes accept digits only.",
          "The field holds an Aadhaar number or a PAN — those have their own controls.",
        ],
      }}
      related={[
        {
          label: "Aadhaar Input",
          href: "/design-system/components/forms/aadhaar-input",
          reason: "the identity field this step usually verifies",
        },
        {
          label: "Identity Inputs",
          href: "/design-system/components/forms/identity-inputs",
          reason: "the three identity controls documented together",
        },
        {
          label: "Form Field",
          href: "/design-system/components/forms/form-field",
          reason: "the label, hint and error wiring this group expects",
        },
        {
          label: "Portal Login Shell",
          href: "/design-system/components/auth/portal-login-shell",
          reason: "the surface this control most often appears on",
        },
      ]}
      design={
        <section className="cdp__section" aria-labelledby="cdp-fiddly">
          <h2 id="cdp-fiddly" className="cdp__h2">
            The Parts That Are Usually Wrong
          </h2>
          <ul>
            <li>
              <strong>Paste works.</strong> Pasting <code>123456</code> into any box fills all six.
              This is the single commonest way people enter a one-time password, and the thing
              hand-rolled versions almost always break.
            </li>
            <li>
              <strong>SMS autofill works.</strong>{" "}
              <code>autocomplete=&quot;one-time-code&quot;</code> on the first box lets iOS and Android
              offer the code from the message, and the multi-character value that arrives is spread
              across the boxes rather than truncated.
            </li>
            <li>
              <strong>Backspace on an empty box</strong> steps back and clears the previous one,
              instead of leaving the caret with nothing to delete.
            </li>
          </ul>
          <Callout type="warning" title="Accessible Authentication">
            A one-time password is not a cognitive function test, so it does not engage WCAG 2.2 SC
            3.3.8. Keep it that way: do not add a puzzle, an image challenge or a timed retype
            alongside it. Where a second factor is needed, choose one the reader&apos;s device can
            supply.
          </Callout>
        </section>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { OtpInput } from "@mosje/design-system";

const [otp, setOtp] = React.useState("");

<OtpInput
  label="One-time password"
  value={otp}
  onValueChange={setOtp}
  onComplete={(code) => verify(code)}
  autoFocus
/>`}</CodeBlock>
          <p>
            Inside a Form Field, spread the render prop so the hint and the error reach the group.{" "}
            <code>label</code> is still required — the Form Field label is visible text, and the group
            needs its own accessible name.
          </p>
          <CodeBlock>{`<FormField
  label="Enter the Code We Sent You"
  hint="Six digits, sent to the number ending 2346"
  error={failed ? "That code was not recognised. Request a new one." : undefined}
>
  {(control) => (
    <OtpInput
      {...control}
      label="One-time password"
      value={otp}
      onValueChange={setOtp}
      invalid={failed}
    />
  )}
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
              <strong>Left and Right</strong> — move between boxes.
            </li>
            <li>
              <strong>Backspace</strong> — clear this box, or step back and clear the previous one
              where this box is already empty.
            </li>
            <li>
              <strong>Delete</strong> — clear this box without moving.
            </li>
          </ul>
          <p>
            Focusing a box selects its contents, so typing over a digit replaces it rather than being
            rejected by the one-character limit.
          </p>
        </section>
      }
    />
  );
}
