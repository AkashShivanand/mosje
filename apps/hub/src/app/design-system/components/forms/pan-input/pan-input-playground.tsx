"use client";
import * as React from "react";
import { PanInput, FormField, Checkbox } from "@mosje/design-system";

export function PanInputPlayground() {
  const [pan, setPan] = React.useState("");
  const [invalid, setInvalid] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);

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
        <Checkbox label="Simulate external error" size="sm" checked={invalid} onCheckedChange={setInvalid} />
        
        <Checkbox label="Disabled" size="sm" checked={disabled} onCheckedChange={setDisabled} />
      </div>

      <div style={{ width: "100%", maxWidth: "320px" }}>
        <FormField 
          label="PAN Number"
          hint="10-character alphanumeric ID."
          error={invalid ? "This PAN is not linked to your Aadhaar." : undefined}
          required
        >
          {(props) => (
            <PanInput 
              {...props}
              value={pan}
              onValueChange={setPan}
              disabled={disabled}
            />
          )}
        </FormField>
      </div>
      
      <div style={{ marginTop: "var(--sa-stack-16)", padding: "var(--sa-padding-16)", background: "var(--sa-bg-neutral-subtler)", borderRadius: "var(--sa-shape-8)", fontSize: "14px", fontFamily: "monospace" }}>
        <strong>Internal State:</strong> &quot;{pan}&quot;
      </div>
    </div>
  );
}
