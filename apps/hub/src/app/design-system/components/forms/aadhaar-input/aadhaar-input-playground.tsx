"use client";
import * as React from "react";
import { AadhaarInput, FormField } from "@mosje/design-system";

export function AadhaarInputPlayground() {
  const [aadhaar, setAadhaar] = React.useState("");
  const [invalid, setInvalid] = React.useState(false);
  const [mask, setMask] = React.useState(true);
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
        <label style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "14px" }}>
          <input 
            type="checkbox" 
            checked={mask} 
            onChange={(e) => setMask(e.target.checked)} 
          />
          <strong>Mask when blurred</strong>
        </label>
        
        <label style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "14px" }}>
          <input 
            type="checkbox" 
            checked={invalid} 
            onChange={(e) => setInvalid(e.target.checked)} 
          />
          <strong>Simulate external error</strong>
        </label>
        
        <label style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "14px" }}>
          <input 
            type="checkbox" 
            checked={disabled} 
            onChange={(e) => setDisabled(e.target.checked)} 
          />
          <strong>Disabled</strong>
        </label>
      </div>

      <div style={{ width: "100%", maxWidth: "320px" }}>
        <FormField 
          label="Aadhaar Number"
          hint="12-digit number as printed on your card."
          error={invalid ? "Your Aadhaar number could not be verified." : undefined}
          required
        >
          {(props) => (
            <AadhaarInput 
              {...props}
              value={aadhaar}
              onValueChange={setAadhaar}
              mask={mask}
              disabled={disabled}
            />
          )}
        </FormField>
      </div>
      
      <div style={{ marginTop: "16px", padding: "16px", background: "var(--sa-bg-neutral-subtler)", borderRadius: "8px", fontSize: "14px", fontFamily: "monospace" }}>
        <strong>Internal State (Raw Digits):</strong> "{aadhaar}"
      </div>
    </div>
  );
}
