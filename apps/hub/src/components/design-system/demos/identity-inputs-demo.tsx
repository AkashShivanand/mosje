"use client";

import * as React from "react";
import {
  AadhaarInput,
  FormField,
  OtpInput,
  PanInput,
  isValidAadhaar,
  isValidPan,
  maskAadhaar,
  panHolderType,
} from "@mosje/design-system";

/**
 * Live demo for the identity inputs. These are controlled components, so they need real
 * state — the react-live Playground evaluates a single JSX expression and cannot hold any.
 */
export function IdentityInputsDemo(): React.JSX.Element {
  const [aadhaar, setAadhaar] = React.useState("");
  const [aadhaarTouched, setAadhaarTouched] = React.useState(false);
  const [pan, setPan] = React.useState("");
  const [panTouched, setPanTouched] = React.useState(false);
  const [otp, setOtp] = React.useState("");
  const [otpResult, setOtpResult] = React.useState<string | null>(null);

  const aadhaarBad = aadhaarTouched && aadhaar.length > 0 && !isValidAadhaar(aadhaar);
  const panBad = panTouched && pan.length > 0 && !isValidPan(pan);
  const holder = panHolderType(pan);

  return (
    <div
      style={{
        display: "grid",
        gap: "var(--ds-stack-l)",
        padding: "var(--ds-padding-xl)",
        border: "1px solid var(--ds-border)",
        borderRadius: "var(--ds-radius-lg)",
        background: "var(--ds-surface)",
        maxWidth: "34rem",
      }}
    >
      <FormField
        label="Aadhaar number"
        required
        hint="12 digits, as printed on your Aadhaar. Hidden once complete."
        error={aadhaarBad ? "That is not a valid Aadhaar number. Check the digits and try again." : undefined}
      >
        {(ctrl) => (
          <AadhaarInput
            {...ctrl}
            value={aadhaar}
            onValueChange={setAadhaar}
            onBlur={() => setAadhaarTouched(true)}
          />
        )}
      </FormField>

      {isValidAadhaar(aadhaar) && (
        <p style={{ margin: 0, fontSize: "var(--ds-text-body-2)", color: "var(--ds-ink-muted)" }}>
          Stored as <code>{aadhaar}</code> · displayed to the citizen as{" "}
          <strong>{maskAadhaar(aadhaar)}</strong>
        </p>
      )}

      <FormField
        label="PAN"
        hint="10 characters, e.g. ABCPE1234F. Lower case is fine."
        error={panBad ? "Enter a valid PAN in the format ABCPE1234F." : undefined}
      >
        {(ctrl) => (
          <PanInput {...ctrl} value={pan} onValueChange={setPan} onBlur={() => setPanTouched(true)} />
        )}
      </FormField>

      {holder && !panBad && (
        <p style={{ margin: 0, fontSize: "var(--ds-text-body-2)", color: "var(--ds-ink-muted)" }}>
          Holder type: <strong>{holder}</strong>
        </p>
      )}

      <div>
        <p
          id="otp-demo-label"
          style={{
            margin: "0 0 var(--ds-stack-xs)",
            fontSize: "var(--ds-text-label-1)",
            fontWeight: 600,
            color: "var(--ds-ink)",
          }}
        >
          One-time password
        </p>
        <OtpInput
          label="One-time password"
          value={otp}
          onValueChange={(v) => {
            setOtp(v);
            setOtpResult(null);
          }}
          onComplete={(code) => setOtpResult(code)}
          aria-describedby="otp-demo-hint"
        />
        <p
          id="otp-demo-hint"
          style={{
            margin: "var(--ds-stack-xs) 0 0",
            fontSize: "var(--ds-text-body-2)",
            color: "var(--ds-ink-muted)",
          }}
        >
          {otpResult
            ? `Complete — onComplete fired with ${otpResult}`
            : "Try pasting a 6-digit code into any box, then Backspace through it."}
        </p>
      </div>
    </div>
  );
}
