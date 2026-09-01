"use client";

import * as React from "react";
import { Legend } from "@mosje/design-system";

const STATIC_ITEMS = [
  { label: "Approved", color: "var(--sa-color-status-success)" },
  { label: "Pending", color: "var(--sa-color-status-warning)" },
  { label: "Rejected", color: "var(--sa-color-status-danger)" },
];

const RAMP = [
  {
    label: "Beneficiaries per district",
    color: "var(--sa-chart-cat-1)",
    swatch: "ramp" as const,
    colors: ["var(--sa-chart-seq-200)", "var(--sa-chart-seq-500)", "var(--sa-chart-seq-800)"],
    scale: ["1", "387"] as [string, string],
  },
];

export function LegendSpecimen(): React.JSX.Element {
  const [off, setOff] = React.useState<string[]>([]);
  const toggle = (id: string) =>
    setOff((current) => (current.includes(id) ? current.filter((x) => x !== id) : [...current, id]));

  return (
    <div className="cdp-stack">
      <Legend items={STATIC_ITEMS} />
      <Legend
        label="Application status"
        items={STATIC_ITEMS.map((item) => ({ ...item, on: !off.includes(item.label) }))}
        onToggle={toggle}
      />
      <Legend items={RAMP} />
      <Legend items={STATIC_ITEMS} orientation="vertical" />
    </div>
  );
}
