"use client";
import * as React from "react";
import { PasswordInput, FormField, Checkbox } from "@mosje/design-system";

export function PasswordInputPlayground() {
  const [hideToggle, setHideToggle] = React.useState(false);
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
        <Checkbox label="Hide Reveal Toggle" size="sm" checked={hideToggle} onCheckedChange={setHideToggle} />
        
        <Checkbox label="Disabled" size="sm" checked={disabled} onCheckedChange={setDisabled} />
      </div>

      <div style={{ width: "100%", maxWidth: "400px" }}>
        <FormField label="Password" hint="Must be at least 8 characters.">
          {(props) => (
            <PasswordInput 
              {...props}
              hideToggle={hideToggle}
              disabled={disabled}
              placeholder="Enter your password"
            />
          )}
        </FormField>
      </div>
    </div>
  );
}
