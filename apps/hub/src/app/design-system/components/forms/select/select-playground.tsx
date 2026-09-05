"use client";
import * as React from "react";
import { Select, Checkbox } from "@mosje/design-system";

const stack: React.CSSProperties = { display: "grid", gap: "var(--sa-stack-12)" };
const eyebrow: React.CSSProperties = {
  margin: 0,
  fontSize: "var(--sa-type-label-3-size)",
  lineHeight: "var(--sa-type-label-3-lh)",
  letterSpacing: "var(--sa-type-label-tracking)",
  textTransform: "uppercase",
  color: "var(--sa-text-neutral-subtle)",
};
const STATES = [
  { label: "Delhi", value: "DL" },
  { label: "Maharashtra", value: "MH" },
  { label: "Karnataka", value: "KA" },
  { label: "Tamil Nadu", value: "TN" },
  { label: "Uttar Pradesh", value: "UP" },
];

export function SelectPlayground() {
  const [invalid, setInvalid] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);
  const [value, setValue] = React.useState("");

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
      </div>

      <div style={{ maxWidth: "320px", width: "100%" }}>
        <Select 
          invalid={invalid}
          disabled={disabled}
          placeholder="Select a state..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          options={[
            { label: "Delhi", value: "DL" },
            { label: "Maharashtra", value: "MH" },
            { label: "Karnataka", value: "KA" },
            { label: "Tamil Nadu", value: "TN" },
            { label: "Uttar Pradesh", value: "UP" }
          ]}
        />
      </div>

      <div style={stack}>
        <p style={eyebrow}>Arrangements the master grid does not show</p>
        <Select size="sm" aria-label="State, small" placeholder="State" options={STATES} />
        <Select size="xl" aria-label="State, extra large" placeholder="Select a state" options={STATES} />
        <Select status="success" aria-label="State, accepted" defaultValue="MH" options={STATES} />
        <Select status="warning" aria-label="State, check" defaultValue="DL" options={STATES} />
        <Select disabled aria-label="State, fixed by the scheme" defaultValue="KA" options={STATES} />
        <Select aria-label="State, one option unavailable" placeholder="Select a state" options={STATES.map((o) => (o.value === "UP" ? { ...o, disabled: true } : o))} />
        <Select appearance="filter" aria-label="Filter by district" defaultValue="all" options={[{ label: "All districts", value: "all" }, ...STATES]} />
      </div>
    </div>
  );
}
