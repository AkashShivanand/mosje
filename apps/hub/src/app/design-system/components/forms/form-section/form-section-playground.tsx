"use client";
import * as React from "react";
import { FormSection, FormField, Input, Checkbox } from "@mosje/design-system";

export function FormSectionPlayground() {
  const [columns, setColumns] = React.useState<1 | 2 | 3>(2);
  const [hasDescription, setHasDescription] = React.useState(true);

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
          <strong>Columns:</strong>
          <select 
            value={columns} 
            onChange={(e) => setColumns(Number(e.target.value) as 1 | 2 | 3)}
            style={{ padding: "var(--sa-padding-4) var(--sa-padding-8)", borderRadius: "var(--sa-shape-4)", border: "1px solid var(--sa-border-neutral-subtle)" }}
          >
            <option value={1}>1 Column</option>
            <option value={2}>2 Columns</option>
            <option value={3}>3 Columns</option>
          </select>
        </label>
        
        <Checkbox label="Include description" size="sm" checked={hasDescription} onCheckedChange={setHasDescription} />
      </div>

      <div style={{ width: "100%" }}>
        <FormSection 
          title="Personal Details"
          description={hasDescription ? "Enter your name exactly as it appears on your official ID." : undefined}
          columns={columns}
        >
          <FormField label="First Name" required>
            {(props) => <Input {...props} placeholder="Ravi" />}
          </FormField>
          
          <FormField label="Middle Name">
            {(props) => <Input {...props} placeholder="Kumar" />}
          </FormField>
          
          <FormField label="Last Name" required>
            {(props) => <Input {...props} placeholder="Sharma" />}
          </FormField>
        </FormSection>
      </div>
    </div>
  );
}
