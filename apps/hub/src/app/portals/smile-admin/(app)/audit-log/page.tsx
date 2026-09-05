"use client";

import { useState } from "react";
import { statusTone } from "@/lib/smile-admin/status-tone";
import { PageHeader } from "@/components/smile-admin/shell/page-header";
import { DataToolbar, SearchField } from "@/components/smile-admin/data/data-toolbar";
import { ExportMenu } from "@/components/smile-admin/data/export-menu";
import { Table, TD, TH, THead, TR } from "@/components/smile-admin/table";
import { AUDIT_LOG, type AuditEntry } from "@/lib/smile-admin/mock-data";
import { Badge } from "@mosje/design-system";

export default function AuditPage() {
  const [search, setSearch] = useState("");
  const entries = AUDIT_LOG.filter((e) => `${e.actor} ${e.action} ${e.target}`.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="space-y-lg">
      <PageHeader
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
      <div className="hidden overflow-hidden rounded-lg border border-stroke-200 bg-white shadow-xs md:block">
        <Table>
          <THead>
            <tr>
              <TH>Timestamp</TH>
              <TH>Actor</TH>
              <TH>Action</TH>
              <TH>Target</TH>
              <TH>IP</TH>
              <TH>Result</TH>
            </tr>
          </THead>
          <tbody>
            {entries.map((e) => (
              <TR key={e.id}>
                <TD className="font-mono text-body-2 text-ink-muted">{e.timestamp}</TD>
                <TD className="font-semibold">{e.actor}</TD>
                <TD>{e.action}</TD>
                <TD className="font-mono text-body-2 text-ink-muted">{e.target}</TD>
                <TD className="font-mono text-body-2 text-ink-hint">{e.ip}</TD>
                <TD>
                  <Badge status={statusTone(e.result)} dot>
                    {e.result}
                  </Badge>
                </TD>
              </TR>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
