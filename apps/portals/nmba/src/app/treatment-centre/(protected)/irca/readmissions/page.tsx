"use client";

import * as React from "react";
import { useTCStore } from "@/lib/treatment-centre/store";
import { TCListPage } from "@/components/treatment-centre/tc-list";
import type { ColumnDef } from "@/components/data-table";
import type { Readmission } from "@/lib/treatment-centre/types";

import Link from "next/link";

type Row = Readmission & { sno: number };

const columns: ColumnDef<Row>[] = [
  { key: "sno", header: "S.No" },
  { key: "registrationNumber", header: "Registration Number", render: (r) => <span className="font-mono text-navy">{r.registrationNumber}</span> },
  { key: "name", header: "Patient Name" },
  { key: "readmissionDate", header: "Readmission Date" },
  { key: "reason", header: "Reason" },
];

export default function IrcaReadmissionsPage() {
  const store = useTCStore();
  const rows: Row[] = store.readmissions.map((p, i) => ({ ...p, sno: i + 1 }));
  return (
    <TCListPage
      title="Readmission List"
      columns={columns}
      data={rows}
      fileName="irca-readmissions"
      action={
        <Link
          href="/treatment-centre/irca/readmissions/new"
          className="inline-flex items-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-navy hover:bg-slate-100"
        >
          Add Readmission
        </Link>
      }
    />
  );
}
