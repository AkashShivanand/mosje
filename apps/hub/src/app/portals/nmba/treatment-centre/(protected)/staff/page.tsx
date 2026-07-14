"use client";

import * as React from "react";
import { useTCStore } from "@/lib/nmba/treatment-centre/store";
import { TCListPage } from "@/components/nmba/treatment-centre/tc-list";
import type { ColumnDef } from "@/components/nmba/data-table";
import type { StaffMember } from "@/lib/nmba/treatment-centre/types";
import Link from "next/link";

type Row = StaffMember & { sno: number; type: string };

const columns: ColumnDef<Row>[] = [
  { key: "sno", header: "#" },
  { key: "type", header: "Type" },
  { key: "designation", header: "Role" },
  { key: "name", header: "Name" },
  { key: "mobile", header: "Mobile" },
  { key: "education", header: "Education" },
];

export default function StaffListPage() {
  const store = useTCStore();
  const rows: Row[] = store.staff.map((s, i) => ({
    ...s,
    sno: i + 1,
    type: "IRCA",
  }));
  return (
    <TCListPage
      title="Staff List"
      columns={columns}
      data={rows}
      searchKeys={["name", "designation", "education"]}
      fileName="staff-list"
      action={
        <Link
          href="/portals/nmba/treatment-centre/staff/new"
          className="inline-flex items-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-navy hover:bg-slate-100"
        >
          + Add Staff
        </Link>
      }
    />
  );
}
