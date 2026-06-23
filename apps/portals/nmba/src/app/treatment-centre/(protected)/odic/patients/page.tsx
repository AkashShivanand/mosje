"use client";

import * as React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useTCStore } from "@/lib/treatment-centre/store";
import { TCListPage } from "@/components/treatment-centre/tc-list";
import { ProgressBadge } from "@/components/treatment-centre/tc-form";
import type { ColumnDef } from "@/components/data-table";
import type { Beneficiary, RegistrationProgress } from "@/lib/treatment-centre/types";

type Row = Beneficiary & { sno: number };

const columns: ColumnDef<Row>[] = [
  { key: "sno", header: "S.No" },
  { key: "registrationNumber", header: "Registration Number", render: (r) => <span className="font-mono text-navy">{r.registrationNumber}</span> },
  { key: "registrationProgress", header: "Registration Progress", render: (r) => <ProgressBadge value={r.registrationProgress as RegistrationProgress} /> },
  { key: "name", header: "Beneficiary Name" },
  { key: "gender", header: "Gender" },
  { key: "age", header: "Age" },
  { key: "dateOfRegistration", header: "Registration Date" },
  { key: "referredBy", header: "Referred By" },
  { key: "district", header: "District" },
];

export default function OdicPatientsPage() {
  const store = useTCStore();
  // Drop-in-centre beneficiaries only — Outreach beneficiaries have their own list.
  const rows: Row[] = store.beneficiaries
    .filter((b) => b.kind === "Drop-in Centre")
    .map((b, i) => ({ ...b, sno: i + 1 }));
  return (
    <TCListPage
      title="Drop-in Centre Beneficiary List"
      columns={columns}
      data={rows}
      searchKeys={["registrationNumber", "name", "gender", "referredBy", "district"]}
      fileName="odic-beneficiaries"
      action={
        <Link href="/treatment-centre/odic/register" className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-navy hover:bg-white/90">
          <Plus className="h-4 w-4" /> New Registration
        </Link>
      }
    />
  );
}
