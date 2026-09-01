"use client";
import * as React from "react";
import { Badge, DataTable } from "@mosje/design-system";
import type { DataTableColumn } from "@mosje/design-system";

interface Scheme extends Record<string, unknown> {
  id: string;
  name: string;
  applicants: number;
  status: "Active" | "Closed";
}

/* Derived from the index, never random: this is a client component, so a
   server render and a client render of Math.random() disagree and React reports
   a hydration mismatch on a documentation page. */
const mockData: Scheme[] = Array.from({ length: 45 }).map((_, i) => ({
  id: `MOSJE-${202400 + i}`,
  name: i % 3 === 0 ? "PM-AJAY Scholarship" : i % 3 === 1 ? "SMILE Support" : "SHREYAS Fellowship",
  applicants: 480 + ((i * 337) % 4520),
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
      <Badge status={row.status === "Active" ? "success" : "neutral"}>{row.status}</Badge>
    ),
    exportValue: (row) => row.status,
  },
];

export function DataTablePlayground() {
  return (
    <div className="cdp-ground">
      <DataTable
        columns={columns}
        data={mockData}
        total={mockData.length}
        caption="List of recent scheme applications"
      />
    </div>
  );
}
