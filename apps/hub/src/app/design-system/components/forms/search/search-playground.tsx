"use client";
import * as React from "react";
import { Search } from "@mosje/design-system";

export function SearchPlayground() {
  const [value, setValue] = React.useState("");
  const [size, setSize] = React.useState<"sm" | "md" | "lg">("md");
  const [disabled, setDisabled] = React.useState(false);
  const [withSubmit, setWithSubmit] = React.useState(true);
  const [withClear, setWithClear] = React.useState(true);

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
          <strong>Size:</strong>
          <select 
            value={size} 
            onChange={(e) => setSize(e.target.value as any)}
            style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid var(--sa-border-neutral-subtle)" }}
          >
            <option value="sm">Small (sm)</option>
            <option value="md">Medium (md)</option>
            <option value="lg">Large (lg)</option>
          </select>
        </label>
        
        <label style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "14px" }}>
          <input 
            type="checkbox" 
            checked={disabled} 
            onChange={(e) => setDisabled(e.target.checked)} 
          />
          <strong>Disabled</strong>
        </label>

        <label style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "14px" }}>
          <input 
            type="checkbox" 
            checked={withClear} 
            onChange={(e) => setWithClear(e.target.checked)} 
          />
          <strong>Has Clear Button</strong>
        </label>

        <label style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "14px" }}>
          <input 
            type="checkbox" 
            checked={withSubmit} 
            onChange={(e) => setWithSubmit(e.target.checked)} 
          />
          <strong>Has Submit Handler</strong>
        </label>
      </div>

      <div style={{ width: "100%", maxWidth: "480px" }}>
        <Search 
          value={value}
          onChange={(e) => setValue(e.target.value)}
          size={size}
          disabled={disabled}
          placeholder="Search for schemes, guidelines..."
          onClear={withClear ? () => setValue("") : undefined}
          onSubmit={withSubmit ? (val) => alert(\`Submitted search for: \${val}\`) : undefined}
        />
      </div>
    </div>
  );
}
