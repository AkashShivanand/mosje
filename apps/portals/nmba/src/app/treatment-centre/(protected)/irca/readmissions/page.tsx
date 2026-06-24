"use client";

import * as React from "react";
import { useTCStore } from "@/lib/treatment-centre/store";
import { TCListPage } from "@/components/treatment-centre/tc-list";
import type { ColumnDef } from "@/components/data-table";
import type { Readmission } from "@/lib/treatment-centre/types";

import { Button } from "@mosje/design-system";
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
        <Link href="/treatment-centre/irca/readmissions/new" passHref legacyBehavior>
          <Button appearance="outlined" className="bg-white text-navy hover:bg-slate-100 font-semibold text-sm">
            Add Readmission
          </Button>
        </Link>
      }
    />
  );
}
