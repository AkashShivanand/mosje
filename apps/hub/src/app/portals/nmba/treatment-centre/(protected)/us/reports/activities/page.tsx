"use client";

import * as React from "react";
import { useTCStore } from "@/lib/nmba/treatment-centre/store";
import { TCListPage } from "@/components/nmba/treatment-centre/tc-list";
import { FormField, Input } from "@mosje/design-system";
import type { ColumnDef } from "@/components/nmba/data-table";

type ActivityRow = {
  sno: number;
  type: string;
  name: string;
  date: string;
  location: string;
  participants: number;
};

const columns: ColumnDef<ActivityRow>[] = [
  { key: "sno", header: "S.No" },
  { key: "type", header: "Activity Type" },
  { key: "name", header: "Activity Name" },
  { key: "date", header: "Event Date" },
  { key: "location", header: "Venue / Location" },
  { key: "participants", header: "Total Participants" },
];

export default function USActivityReportPage() {
  const store = useTCStore();
  const [startDate, setStartDate] = React.useState("2026-06-01");
  const [endDate, setEndDate] = React.useState("2026-07-15");

  const saptahRows: ActivityRow[] = store.saptahEvents.map((s) => ({
    sno: 0,
    type: "Saptah / Campaign Activity",
    name: s.activity,
    date: s.date,
    location: s.coordinatingDept,
    participants: s.totalParticipants,
  }));

  const awarenessRows: ActivityRow[] = store.awareness.map((a) => ({
    sno: 0,
    type: "Awareness Programme",
    name: a.hotspot,
    date: a.awarenessDate,
    location: a.venueName,
    participants: a.peopleAttended,
  }));

  const combined = [...saptahRows, ...awarenessRows]
    .filter((r) => r.date >= startDate && r.date <= endDate)
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((r, idx) => ({ ...r, sno: idx + 1 }));

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-line bg-white p-5 flex flex-wrap gap-4 items-end">
        <div className="w-48">
          <FormField label="Start Date">
            {(c) => <Input {...c} type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />}
          </FormField>
        </div>
        <div className="w-48">
          <FormField label="End Date">
            {(c) => <Input {...c} type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />}
          </FormField>
        </div>
      </div>

      <TCListPage
        title="Activity Report Date Wise"
        columns={columns}
        data={combined}
        searchKeys={["name", "location"]}
        fileName={`activity-report-${startDate}-to-${endDate}`}
      />
    </div>
  );
}
