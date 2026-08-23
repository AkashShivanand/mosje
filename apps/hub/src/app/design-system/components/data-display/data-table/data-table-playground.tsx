"use client";
import * as React from "react";
import { DataTable } from "@mosje/design-system";
import type { DataTableColumn } from "@mosje/design-system";

interface Scheme extends Record<string, unknown> {
  id: string;
  name: string;
  applicants: number;
  status: "Active" | "Closed";
}

const mockData: Scheme[] = Array.from({ length: 45 }).map((_, i) => ({
  id: `MOSJE-${202400 + i}`,
  name: i % 3 === 0 ? "PM-AJAY Scholarship" : i % 3 === 1 ? "SMILE Support" : "SHREYAS Fellowship",
  applicants: Math.floor(Math.random() * 5000) + 100,
  status: i % 7 === 0 ? "Closed" : "Active",
}));

const columns: DataTableColumn<Scheme>[] = [
  { key: "id", header: "Scheme ID" },
  { key: "name", header: "Scheme Name" },
  { key: "applicants", header: "Applicants", className: "ds-text-right", render: (row) => row.applicants.toLocaleString("en-IN") },
  { 
    key: "status", 
    header: "Status",
    render: (row) => (
      <span style={{
        display: "inline-flex",
        padding: "var(--sa-padding-4) var(--sa-padding-8)",
        borderRadius: "var(--sa-shape-full)",
        fontSize: "var(--sa-type-body-3-size)",
        fontWeight: 600,
        backgroundColor: row.status === "Active" ? "var(--sa-bg-status-success-subtler)" : "var(--sa-bg-neutral-subtler)",
        color: row.status === "Active" ? "var(--sa-text-status-success-base)" : "var(--sa-text-neutral-subtle)",
      }}>
        {row.status}
      </span>
    )
  },
];

export function DataTablePlayground() {
  return (
    <div style={{ padding: "var(--sa-padding-40)", background: "var(--sa-bg-neutral-subtler)", borderRadius: "var(--sa-shape-8)" }}>
      <DataTable
        columns={columns}
        data={mockData}
        total={mockData.length}
        caption="List of recent scheme applications"
      />
    </div>
  );
}
