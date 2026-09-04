"use client";
import * as React from "react";
import { Search, Checkbox } from "@mosje/design-system";

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
        <label style={{ display: "flex", gap: "var(--sa-stack-8)", alignItems: "center", fontSize: "var(--sa-type-label-1-size)", lineHeight: "var(--sa-type-label-1-lh)" }}>
          <strong>Size:</strong>
          <select 
            value={size} 
            onChange={(e) => setSize(e.target.value as typeof size)}
            style={{ padding: "var(--sa-padding-4) var(--sa-padding-8)", borderRadius: "var(--sa-shape-4)", border: "1px solid var(--sa-border-neutral-subtle)" }}
          >
            <option value="sm">Small (sm)</option>
            <option value="md">Medium (md)</option>
            <option value="lg">Large (lg)</option>
          </select>
        </label>
        
        <Checkbox label="Disabled" size="sm" checked={disabled} onCheckedChange={setDisabled} />

        <Checkbox label="Has Clear Button" size="sm" checked={withClear} onCheckedChange={setWithClear} />

        <Checkbox label="Has Submit Handler" size="sm" checked={withSubmit} onCheckedChange={setWithSubmit} />
      </div>

      <div style={{ width: "100%", maxWidth: "480px" }}>
        <Search 
          value={value}
          onChange={(e) => setValue(e.target.value)}
          size={size}
          disabled={disabled}
          placeholder="Search for schemes, guidelines..."
          onClear={withClear ? () => setValue("") : undefined}
          onSubmit={withSubmit ? (val) => alert(`Submitted search for: ${val}`) : undefined}
        />
      </div>
    </div>
  );
}
