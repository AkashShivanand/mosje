"use client";
import * as React from "react";
import { Toggle } from "@mosje/design-system";

export function TogglePlayground() {
  const [checked, setChecked] = React.useState(false);
  const [size, setSize] = React.useState<"default" | "small">("default");
  const [disabled, setDisabled] = React.useState(false);

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
          <strong>Size:</strong>
          <select 
            value={size} 
            onChange={(e) => setSize(e.target.value as "default" | "small")}
            style={{ padding: "var(--sa-padding-4) var(--sa-padding-8)", borderRadius: "var(--sa-shape-4)", border: "1px solid var(--sa-border-neutral-subtle)" }}
          >
            <option value="default">Default</option>
            <option value="small">Small</option>
          </select>
        </label>
        
        <label style={{ display: "flex", gap: "var(--sa-stack-8)", alignItems: "center", fontSize: "var(--sa-type-label-1-size)", lineHeight: "var(--sa-type-label-1-lh)" }}>
          <input 
            type="checkbox" 
            checked={disabled} 
            onChange={(e) => setDisabled(e.target.checked)} 
          />
          <strong>Disabled</strong>
        </label>
      </div>

      <div style={{ width: "100%", maxWidth: "320px" }}>
        <Toggle 
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          label="Enable email notifications"
          size={size}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
