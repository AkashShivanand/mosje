"use client";

import { AccountPrompt } from "@mosje/design-system";
import * as React from "react";

/** Two genuinely different applicant types — the case the component exists for. */
export function Specimen(): React.JSX.Element {
  return (
    <div style={{ maxWidth: "24rem" }}>
      <AccountPrompt
        options={[
          { label: "Register as a Volunteer", href: "#volunteer" },
          { label: "Register as a SAGE Organisation", href: "#sage" },
        ]}
      />
    </div>
  );
}
