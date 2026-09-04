"use client";
import * as React from "react";
import { Select, Checkbox } from "@mosje/design-system";

export function SelectPlayground() {
  const [invalid, setInvalid] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);
  const [value, setValue] = React.useState("");

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
        <Checkbox label="Invalid (Error State)" size="sm" checked={invalid} onCheckedChange={setInvalid} />
        
        <Checkbox label="Disabled" size="sm" checked={disabled} onCheckedChange={setDisabled} />
      </div>

      <div style={{ maxWidth: "320px", width: "100%" }}>
        <Select 
          invalid={invalid}
          disabled={disabled}
          placeholder="Select a state..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          options={[
            { label: "Delhi", value: "DL" },
            { label: "Maharashtra", value: "MH" },
            { label: "Karnataka", value: "KA" },
            { label: "Tamil Nadu", value: "TN" },
            { label: "Uttar Pradesh", value: "UP" }
          ]}
        />
      </div>
    </div>
  );
}
