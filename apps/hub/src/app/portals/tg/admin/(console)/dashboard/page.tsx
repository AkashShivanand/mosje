"use client";

import * as React from "react";
import Link from "next/link";
import { BarChart, FilterBar, Icon, KpiRow } from "@mosje/design-system";
import { PortalPageHeader, Select, SearchInput, StatusPill, SlaBadge, Button, Table } from "@/components/tg/ui";
import { useTg } from "@/lib/tg/store/store";
import { ROLES } from "@/lib/tg/roles";
import { kpisForRole, queueForRole, byState, approvalRateByState } from "@/lib/tg/selectors";
import { STATES } from "@/lib/tg/states";
import type { Application } from "@/lib/tg/store/types";

export default function AdminDashboardPage() {
  const { state, hydrated } = useTg();
  const [stateFilter, setStateFilter] = React.useState("");
  const [query, setQuery] = React.useState("");

  if (!hydrated || state.session === null || state.session === "citizen") return null;
  const role = ROLES[state.session];

  const all = state.applications;
  const kpis = kpisForRole(all, role.id);
  const isAdmin = role.id === "central-admin";

  const queue = queueForRole(all, role.id).filter((a) => {
    if (stateFilter && a.applicant.state !== stateFilter) return false;
    if (query) {
      const q = query.toLowerCase();
      if (!a.id.toLowerCase().includes(q) && !a.applicant.fullLegalName.toLowerCase().includes(q) && !a.applicant.district.toLowerCase().includes(q))
        return false;
    }
    return true;
  });

  const columns = [
    { key: "id", header: "Application No.", render: (a: Application) => <span className="font-mono text-navy">{a.id}</span> },
    { key: "name", header: "Applicant", render: (a: Application) => a.applicant.fullLegalName },
    { key: "district", header: "District", render: (a: Application) => a.applicant.district },
    { key: "type", header: "Type", render: (a: Application) => a.type },
    { key: "stage", header: "Stage", render: (a: Application) => <StatusPill status={a.stage} /> },
    { key: "sla", header: "SLA", render: (a: Application) => `${a.slaDaysLeft} Days` },
    { key: "risk", header: "Risk", render: (a: Application) => <SlaBadge daysLeft={a.slaDaysLeft} /> },
    {
      key: "action",
      header: "",
      render: (a: Application) => (
        <Link href={`/portals/tg/admin/applications/${a.id}`} className="font-semibold text-navy hover:underline">
          View
        </Link>
      ),
    },
  ];

  return (
    <div>
      <PortalPageHeader title="Welcome to the Dashboard" meta="Overview of TG Certificate Application processing" />

      <div className="mb-6">
        <KpiRow items={kpis} />
      </div>

      {isAdmin && (
        <div className="mb-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
            <BarChart
              title="Applications by State"
              caption="Received — top 8 states"
              orientation="horizontal"
              data={byState(all)}
            />
          </div>
          <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
            <BarChart
              title="Approval rate by State"
              caption="Approved vs pending — top 6 states"
              orientation="horizontal"
              valueFormat={(n) => `${n}%`}
              data={approvalRateByState(all)}
            />
          </div>
        </div>
      )}

      <div className="mb-4">
        <FilterBar title="Applications Queue">
          {isAdmin && (
            <Select
              aria-label="Filter by state"
              options={STATES}
              placeholder="State"
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="w-40"
            />
          )}
          <SearchInput
            placeholder="Search by application number, name, district…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-72"
          />
          <Button variant="outline">
            <Icon name="download" size={16} />
            Export
          </Button>
        </FilterBar>
      </div>

      {/* SLA legend */}
      <div className="mb-3 flex flex-wrap items-center gap-4 text-body-3 text-ink-muted">
        <span className="flex items-center gap-1.5"><SlaBadge daysLeft={-1} /> — SLA breached (past due date)</span>
        <span className="flex items-center gap-1.5"><SlaBadge daysLeft={5} /> — Due soon (≤ 7 days left)</span>
        <span className="flex items-center gap-1.5"><SlaBadge daysLeft={20} /> — Within SLA</span>
      </div>

      <Table
        columns={columns}
        data={queue}
        caption="Applications queue"
        emptyLabel="No applications in your queue."
      />
    </div>
  );
}
