"use client";

import * as React from "react";
import { useTCStore } from "@/lib/treatment-centre/store";
import { TCListPage } from "@/components/treatment-centre/tc-list";
import type { ColumnDef } from "@/components/data-table";
import type { FollowUp } from "@/lib/treatment-centre/types";

type Row = FollowUp & { sno: number };

const columns: ColumnDef<Row>[] = [
  { key: "sno", header: "S.No" },
  { key: "registrationNumber", header: "Registration Number", render: (r) => <span className="font-mono text-navy">{r.registrationNumber}</span> },
  { key: "name", header: "Beneficiary Name" },
  { key: "followUpDate", header: "Follow-Up Date" },
  { key: "followUpNumber", header: "Follow-Up No." },
  { key: "status", header: "Status" },
];

export default function OdicFollowUpsPage() {
  const store = useTCStore();
  const rows: Row[] = store.followUps.map((p, i) => ({ ...p, sno: i + 1 }));
  return <TCListPage title="Follow-up ODIC" columns={columns} data={rows} fileName="odic-follow-ups" />;
}
