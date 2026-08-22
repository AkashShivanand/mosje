"use client";
import * as React from "react";
import { Checkbox } from "@mosje/design-system";

export function CheckboxPlayground() {
  const [c1, setC1] = React.useState(true);
  const [c2, setC2] = React.useState(false);
  const [c3, setC3] = React.useState(false);

  const allChecked = c1 && c2 && c3;
  const isIndeterminate = (c1 || c2 || c3) && !allChecked;

  const handleParentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setC1(checked);
    setC2(checked);
    setC3(checked);
  };

  return (
    <div style={{ padding: "var(--sa-padding-40)", background: "var(--sa-bg-neutral-subtler)", borderRadius: "var(--sa-shape-8)", display: "flex", flexDirection: "column", gap: "var(--sa-stack-16)", maxWidth: "400px", margin: "0 auto" }}>
      <Checkbox 
        label="Select all notifications" 
        checked={allChecked} 
        indeterminate={isIndeterminate}
        onChange={handleParentChange} 
      />
      <div style={{ paddingLeft: "var(--sa-padding-24)", display: "flex", flexDirection: "column", gap: "var(--sa-stack-12)" }}>
        <Checkbox label="Email alerts" checked={c1} onChange={(e) => setC1(e.target.checked)} />
        <Checkbox label="SMS alerts" checked={c2} onChange={(e) => setC2(e.target.checked)} />
        <Checkbox label="In-app alerts" checked={c3} onChange={(e) => setC3(e.target.checked)} />
      </div>
    </div>
  );
}
