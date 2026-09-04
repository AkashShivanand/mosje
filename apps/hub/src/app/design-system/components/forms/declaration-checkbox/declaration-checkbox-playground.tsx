"use client";
import * as React from "react";
import { DeclarationCheckbox, Checkbox } from "@mosje/design-system";

export function DeclarationCheckboxPlayground() {
  const [checked, setChecked] = React.useState(false);
  const [invalid, setInvalid] = React.useState(false);

  return (
    <div
      style={{
        padding: "var(--sa-padding-40)",
        background: "var(--sa-bg-neutral-subtle)",
        borderRadius: "var(--sa-shape-8)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--sa-stack-24)",
      }}
    >
      <div style={{ display: "flex", gap: "var(--sa-inline-16)", flexWrap: "wrap", marginBottom: "var(--sa-stack-16)" }}>
        <Checkbox label="Simulate Error (Form Submitted)" size="sm" checked={invalid} onCheckedChange={setInvalid} />
      </div>

      <div style={{ width: "100%" }}>
        <DeclarationCheckbox
          checked={checked}
          onChange={(val) => {
            setChecked(val);
            if (val) setInvalid(false);
          }}
          error={invalid && !checked ? "You must agree to the declaration to submit the form." : undefined}
        >
          <ul style={{ margin: 0, paddingLeft: "var(--sa-padding-24)" }}>
            <li>All information provided in this application is true and correct to the best of my knowledge.</li>
            <li>I understand that submitting false information may result in the rejection of my application.</li>
          </ul>
        </DeclarationCheckbox>
      </div>
    </div>
  );
}
