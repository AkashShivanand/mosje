"use client";

import * as React from "react";
import { useTCStore } from "@/lib/nmba/treatment-centre/store";
import { TCListPage } from "@/components/nmba/treatment-centre/tc-list";
import type { ColumnDef } from "@/components/nmba/data-table";
import type { FollowUp } from "@/lib/nmba/treatment-centre/types";

import Link from "next/link";

type Row = FollowUp & { sno: number };

const columns: ColumnDef<Row>[] = [
  { key: "sno", header: "S.No" },
  { key: "registrationNumber", header: "Registration Number", render: (r) => <span className="font-mono text-navy">{r.registrationNumber}</span> },
  { key: "name", header: "Patient Name" },
  { key: "followUpDate", header: "Follow-Up Date" },
  { key: "followUpNumber", header: "Follow-Up No." },
  { key: "status", header: "Status" },
];

export default function IrcaFollowUpsPage() {
  const store = useTCStore();
  const rows: Row[] = store.followUps.map((p, i) => ({ ...p, sno: i + 1 }));
  return (
    <TCListPage
      title="Follow-Up List"
      columns={columns}
      data={rows}
      fileName="irca-follow-ups"
      action={
        <Link
          href="/portals/nmba/treatment-centre/irca/follow-ups/new"
          className="inline-flex items-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-navy hover:bg-slate-100"
        >
          Add Follow-Up
        </Link>
      }
    />
  );
}
