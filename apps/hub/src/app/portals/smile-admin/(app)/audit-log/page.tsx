"use client";

import { useState } from "react";
import { statusTone } from "@/lib/smile-admin/status-tone";
import { SmilePageHeader } from "@/components/smile-admin/shell/page-header";
import { DataToolbar, SearchField } from "@/components/smile-admin/data/data-toolbar";
import { ExportMenu } from "@/components/smile-admin/data/export-menu";
import { AUDIT_LOG, type AuditEntry } from "@/lib/smile-admin/mock-data";
import { Badge, DataTable, type DataTableColumn } from "@mosje/design-system";

const COLUMNS: DataTableColumn<AuditEntry & Record<string, unknown>>[] = [
  { key: "timestamp", header: "Timestamp", sortable: true, className: "font-mono text-body-2 text-ink-muted" },
  { key: "actor", header: "Actor", sortable: true, className: "font-semibold" },
  { key: "action", header: "Action", sortable: true },
  { key: "target", header: "Target", className: "font-mono text-body-2 text-ink-muted" },
  { key: "ip", header: "IP", className: "font-mono text-body-2 text-ink-hint" },
  {
    key: "result",
    header: "Result",
    sortable: true,
    render: (e) => (
      <Badge status={statusTone(e.result)} dot>
        {e.result}
      </Badge>
    ),
    exportValue: (e) => e.result,
  },
];

export default function AuditPage() {
  const [search, setSearch] = useState("");
  const entries = AUDIT_LOG.filter((e) => `${e.actor} ${e.action} ${e.target}`.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="space-y-lg">
      <SmilePageHeader
        breadcrumbs={[{ label: "System" }, { label: "Audit Log" }]}
        eyebrow="System"
        title="Audit Log"
        subtitle="Immutable trail of administrative actions across the SMILE portal."
        actions={
          <ExportMenu
            filename="smile-audit-log"
            title="Audit Log"
            subtitle="Immutable trail of administrative actions across the SMILE portal."
            columns={[
              { header: "#", accessor: (e: AuditEntry & { sno: number }) => e.sno },
              { header: "Timestamp", accessor: "timestamp" },
              { header: "Actor", accessor: "actor" },
              { header: "Action", accessor: "action" },
              { header: "Entity / Target", accessor: "target" },
              { header: "IP Address", accessor: "ip" },
              { header: "Result", accessor: "result" },
            ]}
            rows={entries.map((e, i) => ({ ...e, sno: i + 1 }))}
          />
        }
      />
      <DataToolbar>
        <SearchField
          placeholder="Search actor / action / target…"
          value={search}
          onChange={setSearch}
          className="flex-1"
        />
      </DataToolbar>

      {/* Mobile timeline */}
      <ul className="space-y-sm md:hidden">
        {entries.map((e) => (
          <li
            key={e.id}
            className="rounded-lg border border-stroke-200 bg-white p-md shadow-xs"
          >
            <div className="flex items-start justify-between gap-sm">
              <div className="min-w-0 space-y-0.5">
                <div className="font-mono text-body-2 text-ink-hint">
                  {e.timestamp}
                </div>
                <div className="text-body-2 text-ink">
                  <span className="font-semibold">{e.actor}</span>
                  <span className="text-ink-muted"> {e.action}</span>
                </div>
                <div className="break-all font-mono text-body-2 text-ink-muted">
                  {e.target}
                </div>
              </div>
              <Badge status={statusTone(e.result)} dot>
                {e.result}
              </Badge>
            </div>
            <div className="mt-sm border-t border-stroke-100 pt-sm font-mono text-body-2 text-ink-hint">
              IP {e.ip}
            </div>
          </li>
        ))}
      </ul>

      {/* Desktop table */}
      <div className="hidden rounded-lg border border-stroke-200 bg-white p-md shadow-xs md:block">
        <DataTable
          columns={COLUMNS}
          data={entries as Array<AuditEntry & Record<string, unknown>>}
          total={entries.length}
          caption="Audit entries by time, actor and action"
          emptyLabel="No audit entry matches this search."
          defaultSort={{ key: "timestamp", direction: "desc" }}
        />
      </div>
    </div>
  );
}
