"use client";

import * as React from "react";
import { useTCStore } from "@/lib/treatment-centre/store";
import { TCListPage } from "@/components/treatment-centre/tc-list";
import type { ColumnDef } from "@/components/data-table";
import type { FollowUp } from "@/lib/treatment-centre/types";

import { Button } from "@mosje/design-system";
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
        <Link href="/treatment-centre/irca/follow-ups/new" passHref legacyBehavior>
          <Button appearance="outlined" className="bg-white text-navy hover:bg-slate-100 font-semibold text-sm">
            Add Follow-Up
          </Button>
        </Link>
      }
    />
  );
}
