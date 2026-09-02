"use client";

import * as React from "react";
import { DataTable } from "@mosje/design-system";
import type { DataTableColumn } from "@mosje/design-system";

import { DataTablePlayground } from "./data-table-playground";

interface Scheme extends Record<string, unknown> {
  id: string;
  name: string;
  applicants: number;
}

const COLUMNS: DataTableColumn<Scheme>[] = [
  { key: "id", header: "Scheme ID" },
  { key: "name", header: "Scheme Name" },
  {
    key: "applicants",
    header: "Applicants",
    className: "ds-text-right",
    render: (row) => row.applicants.toLocaleString("en-IN"),
  },
];

/**
 * The populated table, then the two states a list is most often in and least
 * often designed for. `.claude/rules/data-state-completeness.md` treats these as
 * different sentences with different remedies, and `emptyLabel` is where the
 * difference is written.
 */
export function DataTableSpecimen(): React.JSX.Element {
  return (
    <div className="cdp-stack">
      <DataTablePlayground />
      <DataTable
        columns={COLUMNS}
        data={[]}
        total={0}
        caption="Schemes, none published"
        emptyLabel="No schemes have been published for this organisation yet."
      />
      <DataTable
        columns={COLUMNS}
        data={[]}
        total={0}
        showPageSizes={false}
        caption="Schemes, filtered to nothing"
        emptyLabel="No scheme matches the current filters. Clear the status filter to see all schemes."
      />
    </div>
  );
}
