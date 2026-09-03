"use client";

import { ResendTimer } from "@mosje/design-system";
import * as React from "react";

/** Both states: counting down as text, and ready as a control. */
export function Specimen(): React.JSX.Element {
  return (
    <div style={{ display: "grid", gap: "var(--sa-stack-16)", maxWidth: "24rem" }}>
      <ResendTimer secondsRemaining={27} onResend={() => {}} />
      <ResendTimer secondsRemaining={0} onResend={() => {}} />
    </div>
  );
}
