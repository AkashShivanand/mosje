"use client";

import { DatePicker } from "@mosje/design-system";
import * as React from "react";

export function DatePickerSpecimen(): React.JSX.Element {
  const [dob, setDob] = React.useState("1962-08-14");
  const [applied, setApplied] = React.useState("2026-09-10");
  return (
    <div style={{ display: "grid", gap: "var(--sa-stack-24)", maxWidth: "22rem" }}>
      <DatePicker
        label="Date of Birth"
        value={dob}
        onChange={setDob}
        hint="As printed on your Aadhaar."
        required
      />
      <DatePicker
        label="Date of Application"
        value={applied}
        onChange={setApplied}
        min="2026-09-01"
        max="2026-09-30"
        hint="Applications are accepted through September 2026 only."
      />
    </div>
  );
}
