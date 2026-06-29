"use client";

import * as React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useTCStore } from "@/lib/treatment-centre/store";
import { TCListPage } from "@/components/treatment-centre/tc-list";
import type { ColumnDef } from "@/components/data-table";
import type { Beneficiary } from "@/lib/treatment-centre/types";

type Row = Beneficiary & { sno: number; hotspot: string };

const columns: ColumnDef<Row>[] = [
  { key: "sno", header: "S.No" },
  { key: "registrationNumber", header: "Registration Number", render: (r) => <span className="font-mono text-navy">{r.registrationNumber}</span> },
  { key: "dateOfRegistration", header: "Date of visit by the Outreach Worker" },
  { key: "hotspot", header: "Name of hotspot visited", render: (r) => <>{r.hotspot || "—"}</> },
  { key: "name", header: "Name of Client" },
];

export default function OdicOutreachListPage() {
  const store = useTCStore();
  const rows: Row[] = store.beneficiaries
    .filter((b) => b.kind === "Outreach")
    .map((b, i) => ({ ...b, sno: i + 1, hotspot: b.details?.["Hotspot Name"] ?? "" }));
  return (
    <TCListPage
      title="Outreach Beneficiary List"
      columns={columns}
      data={rows}
      searchKeys={["registrationNumber", "name", "hotspot"]}
      fileName="odic-outreach"
      action={
        <Link href="/treatment-centre/odic/outreach/register" className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-navy hover:bg-white/90">
          <Plus className="h-4 w-4" /> New Outreach Beneficiary
        </Link>
      }
    />
  );
}
