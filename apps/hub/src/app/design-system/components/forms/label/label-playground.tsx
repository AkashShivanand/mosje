"use client";
import * as React from "react";
import { Label, Input } from "@mosje/design-system";

export function LabelPlayground() {
  const [required, setRequired] = React.useState(true);
  const [hasHint, setHasHint] = React.useState(true);

  return (
    <div
      style={{
        padding: "var(--sa-padding-40)",
        background: "var(--sa-bg-neutral-subtle)",
        borderRadius: "var(--sa-shape-8)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--sa-stack-48)",
      }}
    >
      <div style={{ display: "flex", gap: "var(--sa-inline-16)", flexWrap: "wrap", alignSelf: "flex-start" }}>
        <label style={{ display: "flex", gap: "var(--sa-stack-8)", alignItems: "center", fontSize: "14px" }}>
          <input 
            type="checkbox" 
            checked={required} 
            onChange={(e) => setRequired(e.target.checked)} 
          />
          <strong>Required Marker</strong>
        </label>
        
        <label style={{ display: "flex", gap: "var(--sa-stack-8)", alignItems: "center", fontSize: "14px" }}>
          <input 
            type="checkbox" 
            checked={hasHint} 
            onChange={(e) => setHasHint(e.target.checked)} 
          />
          <strong>Show Hint</strong>
        </label>
      </div>

      <div style={{ maxWidth: "400px", width: "100%", display: "flex", flexDirection: "column", gap: "var(--sa-stack-8)" }}>
        <Label 
          htmlFor="example-input-id" 
          required={required} 
          hint={hasHint ? "(Format: DD/MM/YYYY)" : undefined}
        >
          Date of Birth
        </Label>
        <Input id="example-input-id" type="date" />
      </div>
    </div>
  );
}
