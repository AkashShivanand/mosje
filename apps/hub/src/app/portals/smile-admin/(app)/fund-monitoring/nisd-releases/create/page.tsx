"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SmilePageHeader } from "@/components/smile-admin/shell/page-header";
import { DataToolbar, SearchField } from "@/components/smile-admin/data/data-toolbar";
import { statusTone } from "@/lib/smile-admin/status-tone";
import { SANCTION_ORDERS, type SanctionOrder } from "@/lib/smile-admin/mock-data";
import { formatINR } from "@/lib/smile-admin/utils";
import { Badge, Button, DataTable, type DataTableColumn } from "@mosje/design-system";

type Row = SanctionOrder & { coverage: string } & Record<string, unknown>;

const STATES = ["All States/UTs", ...Array.from(new Set(SANCTION_ORDERS.map((o) => o.state)))];

export default function NewNisdReleasePage() {
  const [search, setSearch] = useState("");
  const [state, setState] = useState(STATES[0]!);
  const [picked, setPicked] = useState<string | null>(null);

  const rows = useMemo<Row[]>(
    () =>
      SANCTION_ORDERS.filter(
        (o) =>
          (!search || `${o.id} ${o.state} ${o.scheme}`.toLowerCase().includes(search.toLowerCase())) &&
          (state === STATES[0] || o.state === state),
      ).map((o) => ({ ...o, coverage: `${o.state} · all districts` })),
    [search, state],
  );

  const columns: DataTableColumn<Row>[] = [
    {
      key: "pick",
      header: "",
      noExport: true,
      className: "w-10",
      // A radio, not a checkbox: one release is filed against one sanction, and
      // a checkbox would invite a reader to tick two.
      render: (o) => (
        <input
          type="radio"
          name="sanction"
          aria-label={`Select sanction ${o.id}`}
          checked={picked === o.id}
          onChange={() => setPicked(o.id)}
        />
      ),
    },
    { key: "id", header: "Sanction", sortable: true, className: "font-mono text-body-2" },
    {
      key: "amount",
      header: "Amount (₹)",
      sortable: true,
      className: "text-right tabular-nums",
      sortValue: (o) => o.amount,
      render: (o) => formatINR(o.amount, true),
      exportValue: (o) => formatINR(o.amount, true),
    },
    { key: "fy", header: "Inst. / Phase", sortable: true },
    { key: "coverage", header: "Coverage" },
    { key: "date", header: "Sanction Date", sortable: true, className: "text-ink-muted" },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (o) => <Badge status={statusTone(o.status)}>{o.status}</Badge>,
      exportValue: (o) => o.status,
    },
  ];

  const chosen = rows.find((o) => o.id === picked);

  return (
    <div className="space-y-lg">
      <SmilePageHeader
        breadcrumbs={[{ label: "Reports & Analytics" }, { label: "Fund Monitoring", href: "/portals/smile-admin/fund-monitoring" }, { label: "New NISD Release" }]}
        eyebrow="Fund Monitoring"
        title="New NISD Release"
        subtitle="NISD installment release entry. Choose the sanction the release is filed against."
      />

      <DataToolbar>
        <SearchField
          placeholder="Search # / state / district…"
          label="Search sanction orders"
          value={search}
          onChange={setSearch}
        />
        <select
          aria-label="State or Union Territory"
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="h-10 rounded-md border border-stroke-300 bg-white px-md text-body-2 text-ink shadow-xs"
        >
          {STATES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </DataToolbar>

      <div className="rounded-lg border border-stroke-200 bg-white p-md shadow-xs">
        <DataTable
          columns={columns}
          data={rows}
          total={rows.length}
          showPageSizes={false}
          caption="Sanction orders a release can be filed against"
          emptyLabel="No sanction order matches this search."
        />
      </div>

      <div className="flex flex-wrap items-center gap-sm rounded-lg border border-stroke-200 bg-white px-lg py-md shadow-xs">
        <span className="text-body-2 text-ink-muted">
          {chosen ? (
            <>
              Releasing against <strong className="text-ink">{chosen.id}</strong> — {formatINR(chosen.amount, true)}
            </>
          ) : (
            "Select a sanction order above to file a release against it."
          )}
        </span>
        <div className="ml-auto flex items-center gap-sm">
          <Link href="/portals/smile-admin/fund-monitoring" className="text-label-1 text-ink-muted hover:text-ink">
            Cancel
          </Link>
          <Button disabled={!chosen}>Submit NISD Release</Button>
        </div>
      </div>
    </div>
  );
}
