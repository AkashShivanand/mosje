"use client";
import * as React from "react";
import { BiometricCapture, type BiometricState } from "@mosje/design-system";

const CONSENT =
  "Your fingerprint is taken to verify your identity against the Aadhaar record and is not stored by the department.";

const STATES: BiometricState[] = ["idle", "capturing", "captured", "failed", "unavailable"];

/** Every state side by side, plus a live one the reader can drive. */
export function BiometricPlayground(): React.JSX.Element {
  const [state, setState] = React.useState<BiometricState>("idle");

  const run = () => {
    setState("capturing");
    window.setTimeout(() => setState("captured"), 1800);
  };

  return (
    <div
      style={{
        padding: "var(--sa-padding-32)",
        background: "var(--sa-bg-neutral-subtle)",
        borderRadius: "var(--sa-shape-8)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--sa-stack-24)",
      }}
    >
      <BiometricCapture
        modality="fingerprint"
        state={state}
        onCapture={run}
        subject="Sunita Devi"
        consent={CONSENT}
        fallbackHref="#verify-with-documents"
        fallbackLabel="Verify with documents instead"
      />

      {STATES.filter((s) => s !== state).map((s) => (
        <BiometricCapture
          key={s}
          modality={s === "unavailable" ? "iris" : "fingerprint"}
          state={s}
          onCapture={() => {}}
          subject="Sunita Devi"
          failureReason={
            s === "failed"
              ? "The finger was lifted too early. Hold it flat until the reader beeps."
              : undefined
          }
          consent={CONSENT}
          fallbackHref="#verify-with-documents"
          fallbackLabel="Verify with documents instead"
        />
      ))}
    </div>
  );
}
