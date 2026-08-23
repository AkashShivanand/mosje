"use client";
import * as React from "react";
import { FormCard, Button } from "@mosje/design-system";

export function FormCardPlayground() {
  const [hasDescription, setHasDescription] = React.useState(true);
  const [isRequired, setIsRequired] = React.useState(false);
  const [hasActions, setHasActions] = React.useState(true);

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
        <label style={{ display: "flex", gap: "var(--sa-stack-8)", alignItems: "center", fontSize: "14px" }}>
          <input 
            type="checkbox" 
            checked={hasDescription} 
            onChange={(e) => setHasDescription(e.target.checked)} 
          />
          <strong>Include description</strong>
        </label>
        
        <label style={{ display: "flex", gap: "var(--sa-stack-8)", alignItems: "center", fontSize: "14px" }}>
          <input 
            type="checkbox" 
            checked={isRequired} 
            onChange={(e) => setIsRequired(e.target.checked)} 
          />
          <strong>Required Marker</strong>
        </label>

        <label style={{ display: "flex", gap: "var(--sa-stack-8)", alignItems: "center", fontSize: "14px" }}>
          <input 
            type="checkbox" 
            checked={hasActions} 
            onChange={(e) => setHasActions(e.target.checked)} 
          />
          <strong>Include Actions</strong>
        </label>
      </div>

      <div style={{ width: "100%" }}>
        <FormCard 
          title="Applicant Details"
          description={hasDescription ? "Please provide your primary contact and personal information." : undefined}
          required={isRequired}
          actions={hasActions ? <Button appearance="outlined" size="sm">Edit Details</Button> : undefined}
        >
          <div style={{ padding: "var(--sa-padding-24)", background: "var(--sa-bg-neutral-subtler)", borderRadius: "var(--sa-shape-4)", border: "1px dashed var(--sa-border-neutral-base)", textAlign: "center", color: "var(--sa-text-neutral-subtle)" }}>
            Arbitrary content goes here (e.g., custom grid, table, or repeating rows).
          </div>
        </FormCard>
      </div>
    </div>
  );
}
