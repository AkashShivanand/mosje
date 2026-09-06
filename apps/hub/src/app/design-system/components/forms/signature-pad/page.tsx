import type { Metadata } from "next";
import * as React from "react";
import { CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";
import { SignPlayground } from "./sign-playground";

export const metadata: Metadata = {
  title: "Signature Pad — Design System",
  description:
    "A signature given by drawing or by typing. The typed alternative cannot be switched off — drawing is a drag, and WCAG 2.2 requires a single-pointer path that is not one.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "2.5.7 Dragging Movements",
    level: "AA",
    status: "verified",
    evidence:
      "Read from the rendered DOM on this page: all three specimens render a text input alongside the canvas, and there is no prop that removes it. A signature can therefore be given without any dragging at all.",
    description: "Drawing is never the only way to sign.",
  },
  {
    criterion: "3.3.2 Labels or Instructions",
    level: "A",
    status: "verified",
    evidence:
      "The group is a <fieldset> with a <legend>; the canvas carries an aria-label naming the signer and pointing at the field below; both the canvas and the input are described by the declaration paragraph through aria-describedby.",
    description: "Both paths are labelled, and both are tied to the declaration.",
  },
  {
    criterion: "4.1.3 Status Messages",
    level: "AA",
    status: "verified",
    evidence:
      'Driven in a browser: the polite role="status" line read "Not signed" on load, and typing a name into the alternative field changed it to "Signed by typing the name Meena Kumari".',
    description: "Whether it is signed is announced, not only drawn.",
  },
];

export default function SignaturePadPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Signature Pad"
      status="Stable"
      summary="A signature on a consent form, given by drawing or by typing. The typed alternative is not optional and cannot be switched off."
      figma={{ absent: "Master pending in the SAMAVESH library — tracked on the component record." }}
      specimen={<SignPlayground />}
      propsFrom="SignaturePadProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A form needs an attestation and the department has decided what that attestation says.",
          "A witness or a guardian has to sign alongside the applicant.",
        ],
        avoid: [
          "The form does not need a signature. A pad on a form that needs none asks a citizen for something the department cannot use.",
          "The declaration has not been written. The prop is required for exactly this reason.",
        ],
      }}
      related={[
        { label: "Biometric Capture", href: "/design-system/components/forms/biometric-capture", reason: "when identity is confirmed rather than attested" },
        { label: "Checkbox", href: "/design-system/components/forms/checkbox", reason: "when a tick is the attestation the department accepts" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-alt">
            <h2 id="cdp-alt" className="cdp__h2">The Typed Path Cannot Be Switched Off</h2>
            <p>
              WCAG 2.2 §2.5.7 requires a single-pointer path that is not a drag, and drawing a
              signature is a drag by definition. A pad that only draws excludes every reader using
              a keyboard, a switch or a head pointer. Both paths are always offered and both produce
              a value.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-legal">
            <h2 id="cdp-legal" className="cdp__h2">The Component Does Not Decide What Counts as Consent</h2>
            <p>
              Which of the two the Department accepts as a signature is a legal question, and the
              design system must not answer it. <code>declaration</code> is required, so a form
              cannot ship without the Department having written down what is being attested to —
              the component makes the question unavoidable rather than answering it.
            </p>
            <CodeBlock>{`import { SignaturePad } from "@mosje/design-system";

<SignaturePad
  label="Signature of the applicant"
  declaration="I declare that the information given in this application is true…"
  value={signature}
  onChange={setSignature}
/>`}</CodeBlock>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-order">
            <h2 id="cdp-order" className="cdp__h2">The Declaration Sits Above the Pad</h2>
            <p>
              A citizen who signs and then reads is a citizen who did not read. The order on the
              screen is the order of the act.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-clear">
            <h2 id="cdp-clear" className="cdp__h2">Clearing Is Always Available</h2>
            <p>
              It clears the value, not just the picture. A signature nobody can withdraw is not
              consent, and a pad that visually empties while keeping the stored value is worse than
              one that does neither.
            </p>
          </section>
        </>
      }
    />
  );
}
