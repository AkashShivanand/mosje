"use client";

import * as React from "react";
import { useTCStore } from "@/lib/treatment-centre/store";
import { useTCSession } from "@/lib/treatment-centre/session-context";
import { TCListPage } from "@/components/treatment-centre/tc-list";
import type { ColumnDef } from "@/components/data-table";
import type { SaptahEvent } from "@/lib/treatment-centre/types";
import Link from "next/link";

type Row = SaptahEvent & { sno: number; treatmentCenter: string };

const columns: ColumnDef<Row>[] = [
  { key: "sno",                       header: "S.No" },
  { key: "treatmentCenter",           header: "Treatment Center" },
  { key: "activity",                  header: "Type of Activity" },
  { key: "date",                      header: "Date of Activity" },
  { key: "coordinatingDept",          header: "Coordinating Department's Name" },
  { key: "totalParticipants",         header: "Total No. of People Participating" },
  { key: "maleParticipants",          header: "No. of Males/Boys" },
  { key: "femaleParticipants",        header: "No. of Women/Girls" },
  { key: "numEducationalInstitutions",header: "No. of Educational Institutions" },
];

export default function SaptahPage() {
  const store = useTCStore();
  const session = useTCSession();
  const rows: Row[] = store.saptahEvents.map((s, i) => ({
    ...s,
    sno: i + 1,
    treatmentCenter: session.centerName,
  }));
  return (
    <TCListPage
      title="Nasha Mukt Bharat Saptah 2026"
      columns={columns}
      data={rows}
      searchKeys={["activity", "coordinatingDept"]}
      fileName="nmb-saptah-2026"
      action={
        <Link
          href="/treatment-centre/saptah/new"
          className="inline-flex items-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-navy hover:bg-slate-100"
        >
          Add New Activity
        </Link>
      }
    />
  );
}
