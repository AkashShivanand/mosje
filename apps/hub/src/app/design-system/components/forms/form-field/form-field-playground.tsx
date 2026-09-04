"use client";
import * as React from "react";
import { FormField, Input } from "@mosje/design-system";

export function FormFieldPlayground() {
  const [required, setRequired] = React.useState(true);
  const [hasHint, setHasHint] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

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
        <label style={{ display: "flex", gap: "var(--sa-stack-8)", alignItems: "center", fontSize: "var(--sa-type-label-1-size)", lineHeight: "var(--sa-type-label-1-lh)" }}>
          <input 
            type="checkbox" 
            checked={required} 
            onChange={(e) => setRequired(e.target.checked)} 
          />
          <strong>Required</strong>
        </label>
        
        <label style={{ display: "flex", gap: "var(--sa-stack-8)", alignItems: "center", fontSize: "var(--sa-type-label-1-size)", lineHeight: "var(--sa-type-label-1-lh)" }}>
          <input 
            type="checkbox" 
            checked={hasHint} 
            onChange={(e) => setHasHint(e.target.checked)} 
          />
          <strong>Show Hint</strong>
        </label>

        <label style={{ display: "flex", gap: "var(--sa-stack-8)", alignItems: "center", fontSize: "var(--sa-type-label-1-size)", lineHeight: "var(--sa-type-label-1-lh)" }}>
          <input 
            type="checkbox" 
            checked={hasError} 
            onChange={(e) => setHasError(e.target.checked)} 
          />
          <strong>Show Error</strong>
        </label>
      </div>

      <div style={{ maxWidth: "400px", width: "100%" }}>
        <FormField
          label="Email address"
          required={required}
          hint={hasHint ? "We will never share your email." : undefined}
          error={hasError ? "Please enter a valid email address." : undefined}
        >
          {(controlProps) => (
            <Input 
              {...controlProps} 
              type="email" 
              placeholder="example@domain.com"
            />
          )}
        </FormField>
      </div>
    </div>
  );
}
