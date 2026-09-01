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
  { key: "id", header: "Scheme ID", sortable: true },
  { key: "name", header: "Scheme Name", sortable: true },
  {
    key: "applicants",
    header: "Applicants",
    className: "ds-text-right",
    sortable: true,
    /*
     * `sortValue` because the cell's DISPLAY is a formatted string. Without it
     * the column sorts by "1,20,000" and "9,000" as text, which puts the larger
     * figure first — the classic government-register defect.
     */
    sortValue: (row) => row.applicants,
    render: (row) => row.applicants.toLocaleString("en-IN"),
  },
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
