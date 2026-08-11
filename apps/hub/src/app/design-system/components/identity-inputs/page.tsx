import type { Metadata } from "next";
import * as React from "react";
import { PropsTable, Callout, A11yChecklist } from "@/components/design-system/docs-kit/index";
import { IdentityInputsDemo } from "@/components/design-system/demos/identity-inputs-demo";

export const metadata: Metadata = {
  title: "Identity Inputs — Aadhaar, OTP, PAN",
  description:
    "The three Indian identity controls every MoSJE service journey needs: a Verhoeff-checked, masked-by-default Aadhaar field, a six-box OTP input with paste and SMS autofill, and a PAN field that validates the holder-type character.",
};

const SECTION: React.CSSProperties = { marginTop: "var(--sa-section-s)" };

export default function IdentityInputsPage(): React.JSX.Element {
  return (
    <article className="ds-prose">
      <header style={{ marginBottom: "var(--sa-section-xs)" }}>
        <h1>Identity Inputs</h1>
        <p style={{ color: "var(--sa-color-text-muted)", marginTop: "var(--sa-stack-s)", maxWidth: "62ch" }}>
          Aadhaar, OTP and PAN are the three identity controls almost every MoSJE service journey
          asks for, and the three UX4G 3.0 names them explicitly. They are not plain text fields:
          each has a checksum or a shape, and Aadhaar carries a statutory handling obligation.
          Building them once, here, is the difference between one correct implementation and
          twenty near-misses.
        </p>
      </header>

      <section style={SECTION}>
        <h2>Live</h2>
        <p>
          Real components with real validation. Try a wrong digit, paste a code into the OTP boxes,
          and type a PAN in lower case.
        </p>
        <IdentityInputsDemo />
      </section>

      <section style={SECTION}>
        <h2 id="aadhaar">Aadhaar</h2>
        <p>
          Twelve digits, grouped <code>XXXX XXXX XXXX</code> as you type and validated with the{" "}
          <strong>Verhoeff checksum</strong> UIDAI uses. Verhoeff catches every single-digit error
          and every adjacent transposition — the two commonest ways a person mistypes a long number
          — so a typo becomes an inline message instead of a failed submission.
        </p>

        <Callout type="warning">
          <strong>It masks by default, and it should stay that way.</strong> An Aadhaar number is
          sensitive personal data under the DPDP Act 2023, and UIDAI&rsquo;s guidance is to display
          only the last four digits. Once the field is complete and blurred it renders{" "}
          <code>XXXX XXXX 2346</code>. The full value stays in your state, so the form still works —
          only the display is masked. Use <code>maskAadhaar()</code> anywhere else you show one back:
          review steps, tables, print views, PDFs. Never log it, never put it in a URL.
        </Callout>

        <p>
          <code>onValueChange</code> always receives <strong>raw digits</strong>, never the formatted
          or masked string, so separators can never reach your state or your API.
        </p>

        <pre>
          <code>{`<FormField
  label="Aadhaar number"
  required
  hint="12 digits, as printed on your Aadhaar"
  error={touched && !isValidAadhaar(aadhaar)
    ? "That is not a valid Aadhaar number."
    : undefined}
>
  {(ctrl) => (
    <AadhaarInput {...ctrl} value={aadhaar} onValueChange={setAadhaar} />
  )}
</FormField>`}</code>
        </pre>

        <PropsTable
          props={[
            { name: "value", type: "string", required: true, description: "The raw 12 digits, no separators. Controlled." },
            { name: "onValueChange", type: "(digits: string) => void", required: true, description: "Called with raw digits only — never the formatted or masked string." },
            { name: "mask", type: "boolean", default: "true", description: "Mask to the last four digits when complete and not focused. Turn off only with a recorded reason." },
            { name: "invalid", type: "boolean", default: "false", description: "Force the error state. The field also sets aria-invalid on its own once 12 digits fail the checksum." },
          ]}
        />
      </section>

      <section style={SECTION}>
        <h2 id="otp">OTP</h2>
        <p>
          Six boxes, as UX4G specifies. The fiddly parts are the point — they are what hand-rolled
          OTP fields almost always get wrong:
        </p>
        <ul>
          <li>
            <strong>Paste works.</strong> Pasting <code>123456</code> into any box fills all six.
            This is the single commonest way people enter an OTP.
          </li>
          <li>
            <strong>SMS autofill works.</strong> <code>autocomplete=&quot;one-time-code&quot;</code>{" "}
            on the first box lets iOS and Android offer the code from the message, and the
            multi-character value that arrives is spread across the boxes rather than truncated.
          </li>
          <li>
            <strong>Backspace on an empty box</strong> steps back and clears the previous one instead
            of stranding the caret. Arrow keys move between boxes.
          </li>
        </ul>

        <pre>
          <code>{`<OtpInput
  label="One-time password"
  value={otp}
  onValueChange={setOtp}
  onComplete={(code) => verify(code)}
/>`}</code>
        </pre>

        <PropsTable
          props={[
            { name: "value", type: "string", required: true, description: "Digits entered so far, as one string. Controlled." },
            { name: "onValueChange", type: "(digits: string) => void", required: true, description: "Called with the digits entered so far." },
            { name: "label", type: "string", required: true, description: "Accessible name for the group, e.g. \"One-time password\"." },
            { name: "length", type: "number", default: "6", description: "Number of boxes. UX4G 3.0 specifies six." },
            { name: "onComplete", type: "(digits: string) => void", description: "Fires once the last box is filled — wire the verify call here." },
            { name: "invalid", type: "boolean", default: "false", description: "Render the error state across all boxes." },
          ]}
        />
      </section>

      <section style={SECTION}>
        <h2 id="pan">PAN</h2>
        <p>
          Ten characters in the <code>AAAAA9999A</code> shape. It uppercases as you type, so nobody
          is told off for typing their own PAN in lower case, and it validates the{" "}
          <strong>fourth character</strong> against the holder-type codes — a PAN whose fourth
          character is not one of <code>PCHFATBLJGE</code> is malformed no matter how well the rest
          matches. <code>panHolderType()</code> returns the decoded type, which is worth showing back
          to the user as a quiet confirmation they typed the right card.
        </p>

        <PropsTable
          props={[
            { name: "value", type: "string", required: true, description: "The normalised PAN (uppercase, alphanumeric, ≤10). Controlled." },
            { name: "onValueChange", type: "(pan: string) => void", required: true, description: "Called with the normalised value — already uppercased and stripped." },
            { name: "invalid", type: "boolean", default: "false", description: "Force the error state." },
          ]}
        />
      </section>

      <section style={SECTION}>
        <h2>Accessibility</h2>
        <A11yChecklist
          items={[
            { criterion: "1.3.5 Identify Input Purpose", level: "AA", description: "The OTP's first box carries autocomplete=\"one-time-code\" so the platform can offer the code. Aadhaar and PAN set autocomplete=\"off\" deliberately — neither has a standard token, and a wrong guess would autofill the wrong identity number." },
            { criterion: "2.5.8 Target Size (Minimum)", level: "AA", description: "Every OTP box is at least 44px tall; below 380px the boxes narrow rather than push the page sideways, keeping the tap target on the axis that matters." },
            { criterion: "3.3.1 Error Identification", level: "A", description: "Errors are announced through FormField's role=\"alert\" and linked with aria-describedby; the checksum runs on the client so the message arrives before submission." },
            { criterion: "4.1.2 Name, Role, Value", level: "A", description: "The OTP is a labelled group and each box is numbered (\"Digit 3 of 6\"), so a screen-reader user always knows where they are in the code." },
            { criterion: "Data protection (DPDP Act 2023)", level: "GIGW", description: "Aadhaar is masked to its last four digits by default wherever it is displayed, per UIDAI guidance." },
          ]}
        />
      </section>

      <section style={SECTION}>
        <h2>UX4G parity</h2>
        <p>
          These implement UX4G 3.0&rsquo;s <em>Input - Aadhaar</em>, <em>Input - OTP</em> and{" "}
          <em>Input - Pan Card</em> as React components on the SAMAVESH token contract. They are
          also the clearest candidates to contribute back under clause 4 of the adoption directive:
          UX4G specifies these components but ships no React implementation of them.
        </p>
      </section>
    </article>
  );
}
