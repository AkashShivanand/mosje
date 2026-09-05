"use client";
import * as React from "react";
import { Textarea, Checkbox } from "@mosje/design-system";

const stack: React.CSSProperties = { display: "grid", gap: "var(--sa-stack-12)" };
const eyebrow: React.CSSProperties = {
  margin: 0,
  fontSize: "var(--sa-type-label-3-size)",
  lineHeight: "var(--sa-type-label-3-lh)",
  letterSpacing: "var(--sa-type-label-tracking)",
  textTransform: "uppercase",
  color: "var(--sa-text-neutral-subtle)",
};

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

      <div style={stack}>
        <p style={eyebrow}>Arrangements the master grid does not show</p>
        <Textarea size="sm" rows={2} defaultValue="Documents received by post on 12 March." aria-label="Note" />
        <Textarea size="xl" rows={3} placeholder="Statement of the applicant" aria-label="Statement of the applicant" />
        <Textarea status="warning" rows={3} defaultValue="The applicant resides with her grandmother in a rented room in Ward 14 and has no earning member in the household since March 2025. The school has waived the tuition; the hostel fee remains outstanding." aria-label="Reason for appeal, near the limit" />
        <Textarea status="success" rows={2} defaultValue="Order No. 1142 of 2026, dated 3 March 2026." aria-label="Reason for appeal, accepted" />
        <Textarea readOnly rows={2} defaultValue="Income certificate not issued by the competent authority." aria-label="Grounds of rejection, read-only" />
        <Textarea autoResize maxRows={6} rows={2} defaultValue="The applicant resides with her grandmother in a rented room in Ward 14 and has no earning member in the household since March 2025. The school has waived the tuition; the hostel fee remains outstanding." aria-label="Statement of the applicant, growing with the text" />
      </div>
    </div>
  );
}
