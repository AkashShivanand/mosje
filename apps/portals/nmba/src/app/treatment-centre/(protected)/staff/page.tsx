"use client";

import * as React from "react";
import { useTCStore } from "@/lib/treatment-centre/store";
import { TCListPage } from "@/components/treatment-centre/tc-list";
import type { ColumnDef } from "@/components/data-table";
import type { StaffMember } from "@/lib/treatment-centre/types";

import { Button } from "@mosje/design-system";
import Link from "next/link";

type Row = StaffMember & { sno: number };

const columns: ColumnDef<Row>[] = [
  { key: "sno", header: "S.No" },
  { key: "name", header: "Name" },
  { key: "designation", header: "Designation" },
  { key: "qualification", header: "Qualification" },
  { key: "contactNumber", header: "Contact Number" },
];

export default function StaffListPage() {
  const store = useTCStore();
  const rows: Row[] = store.staff.map((s, i) => ({ ...s, sno: i + 1 }));
  return (
    <TCListPage
      title="Staff List"
      columns={columns}
      data={rows}
      searchKeys={["name", "designation", "qualification"]}
      fileName="staff-list"
      action={
        <Link href="/treatment-centre/staff/new" passHref legacyBehavior>
          <Button appearance="outlined" className="bg-white text-navy hover:bg-slate-100 font-semibold text-sm">
            Add Staff Member
          </Button>
        </Link>
      }
    />
  );
}
