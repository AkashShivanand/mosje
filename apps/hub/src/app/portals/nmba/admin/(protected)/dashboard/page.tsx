"use client";

import * as React from "react";
import { AdminShell } from "@/components/nmba/admin-shell";
import { DataTable } from "@/components/nmba/data-table";
import { AddEventModal } from "@/components/nmba/add-event-modal";
import {
  DASHBOARD_STATS,
  ACTIVITIES,
  ACTIVITIES_TOTAL,
} from "@/lib/nmba/mock-data";
import type { ActivityRow } from "@/lib/nmba/types";
import { useToast } from "@/components/nmba/toast";
import { Button, Icon, MetricCard, Search } from "@mosje/design-system";

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
];

export default function AdminDashboard() {
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const filtered = search.trim()
    ? ACTIVITIES.filter(
        (r) =>
          r.state.toLowerCase().includes(search.toLowerCase()) ||
          r.district.toLowerCase().includes(search.toLowerCase()) ||
          r.activity.toLowerCase().includes(search.toLowerCase())
      )
    : ACTIVITIES;

  const columnsWithAction = [
    ...columns,
    {
      key: "actions" as const,
      header: "Action",
      render: () => (
        <button
          onClick={() => toast("Action coming soon.", "info")}
          aria-label="Row actions"
          className="rounded-lg p-1 text-ink-hint hover:bg-black/5"
        >
          <Icon name="more_horiz" size={16} />
        </button>
      ),
    },
  ];

  return (
    <AdminShell>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-xl font-bold text-ink">State/UT/District Dashboard</h1>
        <Button onClick={() => setModalOpen(true)} iconLeft={<Icon name="add" size={16} />}>
          Add Event
        </Button>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard label="Total Pledges" value={DASHBOARD_STATS.totalPledges} icon={<Icon name="volunteer_activism" size={20} />} />
        <MetricCard label="People Reached" value={DASHBOARD_STATS.peopleReached} icon={<Icon name="group" size={20} />} />
        <MetricCard label="Youth Reached" value={DASHBOARD_STATS.youthReached} icon={<Icon name="trending_up" size={20} />} />
        <MetricCard label="Women Reached" value={DASHBOARD_STATS.womenReached} icon={<Icon name="group" size={20} />} />
        <MetricCard label="Total Activities" value={DASHBOARD_STATS.totalActivities} icon={<Icon name="monitoring" size={20} />} />
        <MetricCard label="Educational Institutions" value={DASHBOARD_STATS.educationalInstitutions} icon={<Icon name="school" size={20} />} />
      </div>

      <section aria-labelledby="activity-table-heading">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <h2 id="activity-table-heading" className="text-base font-semibold text-ink">
            Activity Log
            <span className="ml-2 text-sm font-normal text-ink-muted">
              ({ACTIVITIES_TOTAL.toLocaleString("en-IN")} total)
            </span>
          </h2>
          <Search
            aria-label="Search activities by state, district, or type"
            placeholder="Search by State, District, Activity…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ml-auto"
          />
        </div>
        <DataTable<ActivityRow>
          data={filtered}
          columns={columnsWithAction}
          caption="NMBA Activity Log"
          total={ACTIVITIES_TOTAL}
          pageSizes={[10, 50, 100]}
        />
      </section>

      <AddEventModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </AdminShell>
  );
}
