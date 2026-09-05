"use client";

import * as React from "react";
import { Avatar, Badge, Button, Checkbox, DataTable } from "@mosje/design-system";
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
 * A register whose cells are not all text. The Figma sets draw the same
 * arrangement as Cell Types — Avatar, Tag, Icon, Action beside Text — and in
 * code each of them is a column's `render`: an Avatar with the applicant, a
 * Badge for the status word, a Checkbox for a yes/no column, a Small button
 * for the row's one verb. `exportValue` keeps the copied register plain.
 */
interface Application extends Record<string, unknown> {
  id: string;
  applicant: string;
  initials: string;
  scheme: string;
  status: "Approved" | "Under scrutiny" | "Returned";
  inspected: boolean;
}

const APPLICATIONS: Application[] = [
  { id: "PMAJAY-2025-04117", applicant: "Meera Devi", initials: "MD", scheme: "PM-AJAY Hostel Grant", status: "Approved", inspected: true },
  { id: "SMILE-2025-00982", applicant: "Ravi Kumar", initials: "RK", scheme: "SMILE Rehabilitation", status: "Under scrutiny", inspected: false },
  { id: "NOS-2025-01330", applicant: "Fatima Begum", initials: "FB", scheme: "National Overseas Scholarship", status: "Returned", inspected: true },
];

const STATUS_TONE: Record<Application["status"], "success" | "warning" | "danger"> = {
  Approved: "success",
  "Under scrutiny": "warning",
  Returned: "danger",
};

const MIXED_COLUMNS: DataTableColumn<Application>[] = [
  {
    key: "applicant",
    header: "Applicant",
    render: (row) => (
      <span style={{ display: "inline-flex", alignItems: "center", gap: "var(--sa-inline-8)", whiteSpace: "nowrap" }}>
        <Avatar size={32} initials={row.initials} alt="" />
        {row.applicant}
      </span>
    ),
  },
  { key: "scheme", header: "Scheme" },
  {
    key: "status",
    header: "Status",
    render: (row) => <Badge status={STATUS_TONE[row.status]}>{row.status}</Badge>,
    exportValue: (row) => row.status,
  },
  {
    key: "inspected",
    header: "Inspected",
    render: (row) => <Checkbox size="sm" hideLabel label={`Inspected — ${row.applicant}`} defaultChecked={row.inspected} />,
    exportValue: (row) => (row.inspected ? "Yes" : "No"),
  },
  {
    key: "action",
    header: "Action",
    render: () => (
      <span style={{ whiteSpace: "nowrap" }}>
        <Button size="sm" variant="primary">
          View
        </Button>
      </span>
    ),
    noExport: true,
  },
];

/**
 * The populated table, then the two states a list is most often in and least
 * often designed for. `.claude/rules/data-state-completeness.md` treats these as
 * different sentences with different remedies, and `emptyLabel` is where the
 * difference is written. Then the arrangements the Figma page draws: a register
 * with mixed cell renders, and the government-register footer with a fixed
 * page size.
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
      <DataTable
        columns={MIXED_COLUMNS}
        data={APPLICATIONS}
        total={APPLICATIONS.length}
        caption="Applications, with an applicant portrait, a status badge, an inspection checkbox and a row action"
      />
      <DataTable
        columns={COLUMNS}
        data={[
          { id: "MOSJE-202401", name: "PM-AJAY Scholarship", applicants: 4991 },
          { id: "MOSJE-202402", name: "SMILE Support", applicants: 3208 },
        ]}
        total={71}
        showPageSizes={false}
        caption="Schemes, the government-register footer: the visible range stated, the page size fixed"
      />
    </div>
  );
}
