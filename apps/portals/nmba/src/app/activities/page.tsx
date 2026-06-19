"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { PublicShell } from "@/components/public-shell";
import { DataTable } from "@/components/data-table";
import { AddEventModal } from "@/components/add-event-modal";
import { ACTIVITIES, ACTIVITIES_TOTAL, ACTIVITY_TYPES } from "@/lib/mock-data";
import { STATES, STATE_DISTRICTS } from "@/lib/states";
import type { ActivityRow } from "@/lib/types";
import { Plus } from "lucide-react";
import { Button, Select } from "@mosje/design-system";

const FacilityMap = dynamic(
  () => import("@/components/facility-map").then((m) => m.FacilityMap),
  { ssr: false, loading: () => <div className="h-48 animate-pulse rounded-xl bg-surface-muted" /> }
);

import { FACILITIES } from "@/lib/mock-data";

const columns = [
  { key: "state" as const, header: "State" },
  { key: "district" as const, header: "District" },
  { key: "activity" as const, header: "Activity" },
  { key: "activityDate" as const, header: "Date" },
  { key: "maleParticipants" as const, header: "Male" },
  { key: "femaleParticipants" as const, header: "Female" },
  { key: "totalParticipants" as const, header: "Total" },
  { key: "coordinatingDepartment" as const, header: "Department" },
  { key: "educationalInstitutions" as const, header: "Edu. Inst." },
  { key: "location" as const, header: "Location" },
  { key: "createdBy" as const, header: "Created By" },
  { key: "createdAt" as const, header: "Created At" },
];

export default function ActivitiesPage() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [filterState, setFilterState] = React.useState("");
  const [filterDistrict, setFilterDistrict] = React.useState("");
  const [filterActivity, setFilterActivity] = React.useState("");

  const districts = filterState ? (STATE_DISTRICTS[filterState] ?? []) : [];

  const filtered = ACTIVITIES.filter((row) => {
    if (filterState && row.state !== filterState) return false;
    if (filterDistrict && row.district !== filterDistrict) return false;
    if (filterActivity && row.activity !== filterActivity) return false;
    return true;
  });

  return (
    <PublicShell>
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-ink">Activity Snapshot</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Showing {filtered.length} of {ACTIVITIES_TOTAL.toLocaleString("en-IN")} activities
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)} iconLeft={<Plus className="h-4 w-4" />} aria-label="Add new activity event">
          Add Event
        </Button>
      </div>

      {/* Filter row */}
      <div className="mb-4 flex flex-wrap gap-3">
        <Select
          aria-label="Filter by state"
          value={filterState}
          onChange={(e) => { setFilterState(e.target.value); setFilterDistrict(""); }}
        >
          <option value="">All States</option>
          {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
        </Select>
        <Select
          aria-label="Filter by district"
          value={filterDistrict}
          onChange={(e) => setFilterDistrict(e.target.value)}
          disabled={!filterState}
        >
          <option value="">All Districts</option>
          {districts.map((d) => <option key={d} value={d}>{d}</option>)}
        </Select>
        <Select
          aria-label="Filter by activity type"
          value={filterActivity}
          onChange={(e) => setFilterActivity(e.target.value)}
        >
          <option value="">All Activity Types</option>
          {ACTIVITY_TYPES.map((a) => <option key={a} value={a}>{a}</option>)}
        </Select>
      </div>

      <DataTable<ActivityRow>
        data={filtered}
        columns={columns}
        caption="NMBA Activity Snapshot"
        total={ACTIVITIES_TOTAL}
        pageSizes={[9, 18, 27]}
      />

      {/* Facility mini-map */}
      <div className="mt-8">
        <FacilityMap facilities={FACILITIES} mini legendCollapsible />
      </div>

      <AddEventModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </PublicShell>
  );
}
