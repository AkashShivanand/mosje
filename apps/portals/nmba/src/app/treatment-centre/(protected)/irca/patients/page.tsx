"use client";

import * as React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useTCStore } from "@/lib/treatment-centre/store";
import { TCListPage } from "@/components/treatment-centre/tc-list";
import { ProgressBadge } from "@/components/treatment-centre/tc-form";
import type { ColumnDef } from "@/components/data-table";
import type { Patient, RegistrationProgress } from "@/lib/treatment-centre/types";

type Row = Patient & { sno: number };

const columns: ColumnDef<Row>[] = [
  { key: "sno", header: "S.No" },
  {
    key: "registrationNumber",
    header: "Registration Number",
    render: (r) => <span className="font-mono text-navy">{r.registrationNumber}</span>,
  },
  {
    key: "registrationProgress",
    header: "Registration Progress",
    render: (r) => <ProgressBadge value={r.registrationProgress as RegistrationProgress} />,
  },
  { key: "treatmentCenter", header: "Treatment Center" },
  { key: "age", header: "Age" },
  { key: "gender", header: "Gender" },
  { key: "occupation", header: "Occupation" },
  { key: "education", header: "Education" },
  { key: "maritalStatus", header: "Marital Status" },
];

export default function IrcaPatientsPage() {
  const store = useTCStore();
  const rows: Row[] = store.patients.map((p, i) => ({ ...p, sno: i + 1 }));

  return (
    <TCListPage
      title="Patient Registration List"
      columns={columns}
      data={rows}
      searchKeys={["registrationNumber", "name", "treatmentCenter", "gender", "occupation", "education", "maritalStatus"]}
      fileName="irca-patients"
      action={
        <Link
          href="/treatment-centre/irca/register"
          className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-navy hover:bg-white/90"
        >
          <Plus className="h-4 w-4" /> New Registration
        </Link>
      }
    />
  );
}
