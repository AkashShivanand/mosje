"use client";

import * as React from "react";
import { useTCStore } from "@/lib/treatment-centre/store";
import { TCListPage } from "@/components/treatment-centre/tc-list";
import type { ColumnDef } from "@/components/data-table";
import type { AwarenessProgramme } from "@/lib/treatment-centre/types";

type Row = AwarenessProgramme & { sno: number };

const columns: ColumnDef<Row>[] = [
  { key: "sno", header: "S.No" },
  { key: "activity", header: "Activity" },
  { key: "date", header: "Date" },
  { key: "location", header: "Location" },
  { key: "participants", header: "Participants" },
];

export default function OdicAwarenessPage() {
  const store = useTCStore();
  const rows: Row[] = store.awareness.map((p, i) => ({ ...p, sno: i + 1 }));
  return <TCListPage title="Details of Awareness Generation Program" columns={columns} data={rows} fileName="odic-awareness" />;
}
