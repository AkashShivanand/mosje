"use client";
import * as React from "react";
import { FormField, Input, Checkbox } from "@mosje/design-system";

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
        <Checkbox label="Required" size="sm" checked={required} onCheckedChange={setRequired} />
        
        <Checkbox label="Show Hint" size="sm" checked={hasHint} onCheckedChange={setHasHint} />

        <Checkbox label="Show Error" size="sm" checked={hasError} onCheckedChange={setHasError} />
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
