"use client";

import * as React from "react";
import { useTCStore } from "@/lib/treatment-centre/store";
import { TCListPage } from "@/components/treatment-centre/tc-list";
import type { ColumnDef } from "@/components/data-table";
import type { CentreActivity } from "@/lib/treatment-centre/types";

type Row = CentreActivity & { sno: number };

const columns: ColumnDef<Row>[] = [
  { key: "sno", header: "S.No" },
  { key: "activity", header: "Activity" },
  { key: "date", header: "Date" },
  { key: "location", header: "Location" },
  { key: "beneficiaries", header: "Beneficiaries" },
];

export default function ActivitiesPage() {
  const store = useTCStore();
  const rows: Row[] = store.activities.map((a, i) => ({ ...a, sno: i + 1 }));
  return <TCListPage title="Activity List" columns={columns} data={rows} searchKeys={["activity", "location"]} fileName="activity-list" />;
}
