"use client";
import * as React from "react";
import { BulkActionsBar, type BulkAction } from "@mosje/design-system";

const ACTIONS: BulkAction[] = [
  { id: "assign", label: "Assign to an officer" },
  { id: "export", label: "Export as CSV" },
  { id: "return", label: "Return for correction", tone: "warning" },
  { id: "reject", label: "Reject", tone: "danger" },
];

const ROWS = [
  "MOSJE/AVYAY/2026/004821 — Sunita Devi",
  "MOSJE/NAPDDR/2026/001194 — Rehabilitation Centre, Guwahati",
  "MOSJE/SHRESHTA/2026/000733 — Residential Education Support",
  "MOSJE/AVYAY/2026/004822 — Anil Kumar",
];

/** Live: tick rows and the bar appears, announces the count, and offers the way out. */
export function BulkPlayground(): React.JSX.Element {
  const [selected, setSelected] = React.useState<string[]>([ROWS[0]!, ROWS[2]!]);
  const [last, setLast] = React.useState<string | null>(null);

  const toggle = (row: string) =>
    setSelected((s) => (s.includes(row) ? s.filter((r) => r !== row) : [...s, row]));

  return (
    <div
      style={{
        padding: "var(--sa-padding-32)",
        background: "var(--sa-bg-neutral-subtle)",
        borderRadius: "var(--sa-shape-8)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--sa-stack-16)",
      }}
    >
      <BulkActionsBar
        count={selected.length}
        noun="application"
        actions={ACTIONS}
        onAction={setLast}
        onClear={() => setSelected([])}
        total={240}
        onSelectAll={() => setSelected(ROWS)}
      />
      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--sa-stack-8)" }}>
        {ROWS.map((row) => (
          <li key={row}>
            <label
              style={{
                display: "flex",
                gap: "var(--sa-inline-8)",
                alignItems: "center",
                fontSize: "var(--sa-type-body-2-size)",
                lineHeight: "var(--sa-type-body-2-lh)",
                color: "var(--sa-text-neutral-base)",
              }}
            >
              <input type="checkbox" checked={selected.includes(row)} onChange={() => toggle(row)} />
              {row}
            </label>
          </li>
        ))}
      </ul>
      <p
        style={{
          margin: 0,
          color: "var(--sa-text-neutral-subtle)",
          fontSize: "var(--sa-type-label-2-size)",
          lineHeight: "var(--sa-type-label-2-lh)",
        }}
      >
        {last ? `Last action: ${last}` : "No action taken yet."}
      </p>
    </div>
  );
}
