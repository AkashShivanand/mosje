"use client";
import * as React from "react";
import { PasswordInput, FormField } from "@mosje/design-system";

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
        <label style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "14px" }}>
          <input 
            type="checkbox" 
            checked={hideToggle} 
            onChange={(e) => setHideToggle(e.target.checked)} 
          />
          <strong>Hide Reveal Toggle</strong>
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
