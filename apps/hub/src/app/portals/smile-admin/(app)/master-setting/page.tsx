"use client";

import { useMemo, useState } from "react";
import { SmilePageHeader } from "@/components/smile-admin/shell/page-header";
import { StatPill } from "@/components/smile-admin/data/stat-pill";
import { MASTER_TABS } from "@/lib/smile-admin/masters";
import { DataTable, Icon, type DataTableColumn } from "@mosje/design-system";

type Row = Record<string, string>;

export default function MasterSettingsPage() {
  const [tabId, setTabId] = useState(MASTER_TABS[0]!.id);
  const tab = MASTER_TABS.find((t) => t.id === tabId)!;

  const { columns, rows } = useMemo(() => {
    const cols: DataTableColumn<Row>[] = [
      {
        key: "sno",
        header: "#",
        className: "w-10 tabular-nums text-ink-hint",
        render: (r) => Number(r.sno) + 1,
        exportValue: (r) => String(Number(r.sno) + 1),
      },
      ...tab.columns.map<DataTableColumn<Row>>((header, i) => ({
        key: `c${i}`,
        header,
        sortable: true,
      })),
      {
        // Present deliberately. Every row on this screen is read-only, and a
        // register with no action column leaves a reader looking for the edit
        // control the page's own sentence says does not exist here.
        key: "actions",
        header: "Actions",
        noExport: true,
        render: () => (
          <span className="inline-flex items-center gap-xs text-label-2 text-ink-hint">
            <Icon name="lock" size={16} aria-hidden /> Read-only
          </span>
        ),
      },
    ];
    const data: Row[] = tab.rows.map((cells, n) => {
      const row: Row = { sno: String(n) };
      cells.forEach((v, i) => {
        row[`c${i}`] = v;
      });
      return row;
    });
    return { columns: cols, rows: data };
  }, [tab]);

  return (
    <div className="space-y-lg">
      <SmilePageHeader
        breadcrumbs={[{ label: "System" }, { label: "Master Settings" }]}
        eyebrow="System"
        title="Master Settings"
        subtitle="Manage geography, role/permission, agency, operational, fund and rehabilitation master data. Edits are reserved for Super Admin."
      />

      <div className="grid grid-cols-2 gap-md md:grid-cols-4">
        <StatPill label="Active tab" value={MASTER_TABS.indexOf(tab) + 1} icon="tab" tone="primary" />
        <StatPill label="Records" value={tab.rows.length} icon="list" tone="info" />
        <StatPill label="Locked masters" value={MASTER_TABS.filter((t) => t.locked).length} icon="lock" tone="warning" />
        <StatPill label="Master tables" value={MASTER_TABS.length} icon="settings" tone="success" />
      </div>

      {/* The tab rail wraps rather than scrolls: ten tabs do not fit one row at
          1440, and a rail that scrolls sideways hides the tabs at its end. */}
      <div role="tablist" aria-label="Master tables" className="flex flex-wrap gap-xs">
        {MASTER_TABS.map((t) => {
          const active = t.id === tabId;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTabId(t.id)}
              className={
                active
                  ? "inline-flex items-center gap-xs rounded-md bg-primary px-md py-xs text-label-1 font-semibold text-white"
                  : "inline-flex items-center gap-xs rounded-md border border-stroke-200 bg-white px-md py-xs text-label-1 text-ink-muted shadow-xs hover:border-stroke-300 hover:text-ink"
              }
            >
              {t.label}
              {t.locked ? <Icon name="lock" size={16} aria-hidden /> : null}
            </button>
          );
        })}
      </div>

      <div className="rounded-lg border border-stroke-200 bg-white p-md shadow-xs">
        <DataTable
          key={tab.id}
          columns={columns}
          data={rows}
          total={rows.length}
          showPageSizes={false}
          pageSizes={[40]}
          caption={`${tab.label} — read-only master data`}
          emptyLabel="This master table has no entries."
        />
      </div>
    </div>
  );
}
