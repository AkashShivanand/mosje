"use client";

import { useMemo, useState } from "react";
import { SmilePageHeader } from "@/components/smile-admin/shell/page-header";
import { DataToolbar } from "@/components/smile-admin/data/data-toolbar";
import { StatPill } from "@/components/smile-admin/data/stat-pill";
import { HOTSPOT_FORMS, type HotspotForm, type HotspotStatus } from "@/lib/smile-admin/mock-data";
import { Badge, Button, DataTable, EmptyState, Icon, type DataTableColumn } from "@mosje/design-system";

const TABS = [
  { id: "Hotspot", label: "Hotspot forms" },
  { id: "Re-inspection", label: "Re-inspection forms" },
] as const;

const STATUSES: Array<HotspotStatus | "All"> = ["Pending", "Approved", "Rejected", "All"];

const TONE: Record<HotspotStatus, "warning" | "success" | "danger"> = {
  Pending: "warning",
  Approved: "success",
  Rejected: "danger",
};

export default function HotspotApprovalsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("Hotspot");
  const [status, setStatus] = useState<HotspotStatus | "All">("Pending");

  const inTab = useMemo(() => HOTSPOT_FORMS.filter((f) => f.kind === tab), [tab]);
  const rows = useMemo(
    () => inTab.filter((f) => status === "All" || f.status === status),
    [inTab, status],
  );

  const counts = {
    pending: inTab.filter((f) => f.status === "Pending").length,
    approved: inTab.filter((f) => f.status === "Approved").length,
    rejected: inTab.filter((f) => f.status === "Rejected").length,
  };

  const columns: DataTableColumn<HotspotForm & Record<string, unknown>>[] = [
    { key: "hotspot", header: "Hotspot", sortable: true },
    { key: "locationType", header: "Survey-location type", sortable: true },
    {
      key: "subLocations",
      header: "Sub-locations",
      sortable: true,
      className: "tabular-nums",
      sortValue: (r) => r.subLocations,
    },
    { key: "state", header: "State", sortable: true },
    { key: "district", header: "District", sortable: true },
    { key: "declaredBy", header: "Declared by" },
    { key: "declaredOn", header: "Declared on", sortable: true },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (r) => (
        <Badge status={TONE[r.status]} dot>
          {r.status}
        </Badge>
      ),
      exportValue: (r) => r.status,
    },
    {
      key: "actions",
      header: "Action",
      noExport: true,
      render: (r) =>
        r.status === "Pending" ? (
          <div className="flex gap-xs">
            <Button size="sm" variant="success" appearance="outlined">
              Approve
            </Button>
            <Button size="sm" variant="danger" appearance="text">
              Reject
            </Button>
          </div>
        ) : (
          <span className="text-label-2 text-ink-hint">Reviewed</span>
        ),
    },
  ];

  return (
    <div className="space-y-lg">
      <SmilePageHeader
        breadcrumbs={[{ label: "Field Operations" }, { label: "Hotspot Approvals" }]}
        eyebrow="Field Operations"
        title="Hotspot Approvals"
        subtitle="Review the Implementing Agency hotspot declarations — the sub-locations recorded against each survey-location type — and the re-inspections filed against them."
      />

      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Form type"
        className="inline-flex gap-xs rounded-lg border border-stroke-200 bg-white p-xs shadow-xs"
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={
              tab === t.id
                ? "rounded-md bg-primary px-md py-xs text-label-1 font-semibold text-white"
                : "rounded-md px-md py-xs text-label-1 text-ink-muted hover:bg-neutral-100 hover:text-ink"
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-md md:max-w-2xl">
        <StatPill label="Pending" value={counts.pending} icon="hourglass_empty" tone="warning" />
        <StatPill label="Approved" value={counts.approved} icon="check_circle" tone="success" />
        <StatPill label="Rejected" value={counts.rejected} icon="cancel" tone="danger" />
      </div>

      <DataToolbar>
        <label htmlFor="hotspot-status" className="text-label-2 text-ink-muted">
          Status
        </label>
        <select
          id="hotspot-status"
          value={status}
          onChange={(e) => setStatus(e.target.value as HotspotStatus | "All")}
          className="h-10 rounded-md border border-stroke-300 bg-white px-md text-body-2 text-ink shadow-xs"
        >
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <span className="ml-auto text-label-2 text-ink-muted">
          Showing <strong className="text-ink">{rows.length}</strong>{" "}
          {tab === "Hotspot" ? "hotspot" : "re-inspection"} forms
        </span>
      </DataToolbar>

      {rows.length === 0 ? (
        <EmptyState
          icon={<Icon name="check_circle" size={32} />}
          title={`No ${status === "All" ? "" : status.toLowerCase() + " "}${tab === "Hotspot" ? "hotspot" : "re-inspection"} forms`}
          description="Nothing is waiting for review."
        />
      ) : (
        <>
          {/* Mobile card list */}
          <ul className="space-y-sm md:hidden">
            {rows.map((f) => (
              <li key={f.id} className="space-y-xs rounded-lg border border-stroke-200 bg-white p-md shadow-xs">
                <div className="flex items-start justify-between gap-sm">
                  <div className="min-w-0">
                    <div className="truncate text-body-1 font-semibold text-ink">{f.hotspot}</div>
                    <div className="truncate text-label-2 text-ink-muted">
                      {f.locationType} · {f.subLocations} sub-locations
                    </div>
                  </div>
                  <Badge status={TONE[f.status]} dot>
                    {f.status}
                  </Badge>
                </div>
                <div className="text-label-2 text-ink-hint">
                  {f.district}, {f.state} · declared {f.declaredOn}
                </div>
              </li>
            ))}
          </ul>

          <div className="hidden rounded-lg border border-stroke-200 bg-white p-md shadow-xs md:block">
            <DataTable
              columns={columns}
              data={rows as Array<HotspotForm & Record<string, unknown>>}
              total={rows.length}
              showPageSizes={false}
              caption="Hotspot declarations awaiting review, by location and status"
              emptyLabel="Nothing is waiting for review."
            />
          </div>
        </>
      )}
    </div>
  );
}
