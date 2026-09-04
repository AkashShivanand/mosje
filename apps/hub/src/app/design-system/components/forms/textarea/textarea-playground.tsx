"use client";
import * as React from "react";
import { Textarea, Checkbox } from "@mosje/design-system";

export function TextareaPlayground() {
  const [invalid, setInvalid] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);
  const [rows, setRows] = React.useState(4);

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
        <Checkbox label="Invalid (Error State)" size="sm" checked={invalid} onCheckedChange={setInvalid} />
        
        <Checkbox label="Disabled" size="sm" checked={disabled} onCheckedChange={setDisabled} />

        <label style={{ display: "flex", gap: "var(--sa-stack-8)", alignItems: "center", fontSize: "var(--sa-type-label-1-size)", lineHeight: "var(--sa-type-label-1-lh)" }}>
          <strong>Rows:</strong>
          <input 
            type="number" 
            value={rows} 
            onChange={(e) => setRows(Number(e.target.value))}
            style={{ padding: "var(--sa-padding-4) var(--sa-padding-8)", borderRadius: "var(--sa-shape-4)", border: "1px solid var(--sa-border-neutral-subtle)", width: "60px" }}
          />
        </label>
      </div>

      <div style={{ width: "100%", maxWidth: "480px" }}>
        <Textarea 
          invalid={invalid}
          disabled={disabled}
          rows={rows}
          placeholder="Enter your message here..."
        />
      </div>
    </div>
  );
}
