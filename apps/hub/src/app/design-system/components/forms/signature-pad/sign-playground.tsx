"use client";
import * as React from "react";
import { SignaturePad, type SignatureValue } from "@mosje/design-system";

const DECLARATION =
  "I declare that the information given in this application is true to the best of my knowledge, and I consent to its verification by the Department.";

const CAPTION: React.CSSProperties = {
  fontSize: "var(--sa-type-label-2-size)", lineHeight: "var(--sa-type-label-2-lh)",
  color: "var(--sa-text-neutral-subtle)", margin: 0,
};

function One(props: Partial<React.ComponentProps<typeof SignaturePad>>) {
  const [value, setValue] = React.useState<SignatureValue | null>(null);
  return (
    <SignaturePad label="Signature of the applicant" declaration={DECLARATION}
      value={value} onChange={setValue} {...props} />
  );
}

/** Every arrangement: the applicant, a witness with renamed controls, and withdrawn. */
export function SignPlayground(): React.JSX.Element {
  return (
    <div style={{ padding: "var(--sa-padding-40)", background: "var(--sa-bg-neutral-subtle)",
      borderRadius: "var(--sa-shape-8)", display: "grid", gap: "var(--sa-stack-24)" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--sa-stack-8)" }}>
        <One />
        <p style={CAPTION}>
          Draw in the box, or type the name in the field — both produce a signature, and the typed
          path cannot be switched off.
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--sa-stack-8)" }}>
        <One label="Signature of the witness"
          declaration="I confirm that the applicant signed this form in my presence."
          typedLabel="Type the witness's full name instead" clearLabel="Start again" />
        <p style={CAPTION}>The declaration is the department&rsquo;s words, and it sits above the pad.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--sa-stack-8)" }}>
        <One disabled />
        <p style={CAPTION}>Withdrawn — the form has already been submitted.</p>
      </div>
    </div>
  );
}
