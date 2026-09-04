"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { statusTone } from "@/lib/smile-admin/status-tone";
import { PageHeader } from "@/components/smile-admin/shell/page-header";
import { DataToolbar, SearchField } from "@/components/smile-admin/data/data-toolbar";
import { ExportMenu } from "@/components/smile-admin/data/export-menu";
import { SCHEMES, type Scheme } from "@/lib/smile-admin/mock-data";
import { formatINR, formatNumber } from "@/lib/smile-admin/utils";
import { Badge, Button, Card, CardBody, Icon } from "@mosje/design-system";

export default function SchemesPage() {
  const [search, setSearch] = useState("");
  const schemes = useMemo(
    () => SCHEMES.filter((s) => s.name.toLowerCase().includes(search.toLowerCase())),
    [search],
  );
  return (
    <div className="space-y-lg">
      <PageHeader
        breadcrumbs={[{ label: "Field Operations" }, { label: "Beggary Schemes" }]}
        eyebrow="Field operations"
        title="Beggary schemes"
        subtitle="Programme verticals running under the SMILE umbrella — identification, mobilisation, shelter, and comprehensive rehabilitation."
        actions={
          <div className="flex items-center gap-sm">
            <ExportMenu
              filename="smile-beggary-schemes"
              title="Beggary Schemes"
              subtitle="Programme verticals running under the SMILE umbrella."
              columns={[
                { header: "S.No.", accessor: (r: Scheme & { sno: number }) => r.sno },
                { header: "Scheme ID", accessor: "id" },
                { header: "Name", accessor: "name" },
                { header: "Type", accessor: "type" },
                { header: "Status", accessor: "status" },
                { header: "Budget", accessor: (r) => formatINR(r.budget, true) },
                { header: "Utilised", accessor: (r) => formatINR(r.utilised, true) },
                { header: "Beneficiaries", accessor: (r) => formatNumber(r.beneficiaries) },
                { header: "States", accessor: "states" },
              ]}
              rows={schemes.map((s, i) => ({ ...s, sno: i + 1 }))}
            />
            <Button size="sm">
              <Icon name="add" size={14} /> New scheme
            </Button>
          </div>
        }
      />
      <DataToolbar>
        <SearchField
          placeholder="Search schemes by name…"
          value={search}
          onChange={setSearch}
        />
      </DataToolbar>
      <div className="grid gap-lg md:grid-cols-2 xl:grid-cols-3">
        {schemes.map((s) => {
          const pct = Math.round((s.utilised / s.budget) * 100);
          const barColor =
            pct >= 90 ? "bg-danger" : pct >= 70 ? "bg-warning" : "bg-primary";
          return (
            <Card key={s.id} className="transition-shadow hover:shadow-s">
              <CardBody className="space-y-md p-lg">
                <div className="flex items-start justify-between gap-md">
                  <div className="min-w-0 space-y-1">
                    <div className="text-label-3 uppercase text-ink-hint">
                      {s.type}
                    </div>
                    <Link
                      href={`/portals/smile-admin/beggary-schemes/${s.id}`}
                      className="block truncate text-title-2 text-ink hover:text-primary"
                    >
                      {s.name}
                    </Link>
                  </div>
                  <Badge status={statusTone(s.status)} dot>
                    {s.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-md rounded-md border border-stroke-100 bg-neutral-50/60 p-md text-body-2">
                  <div className="space-y-1">
                    <div className="text-label-3 uppercase text-ink-muted">
                      Budget
                    </div>
                    <div className="font-mono font-semibold text-ink">
                      {formatINR(s.budget, true)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-label-3 uppercase text-ink-muted">
                      Utilised
                    </div>
                    <div className="font-mono font-semibold text-ink">
                      {formatINR(s.utilised, true)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-label-3 uppercase text-ink-muted">
                      Beneficiaries
                    </div>
                    <div className="font-mono font-semibold text-ink">
                      {formatNumber(s.beneficiaries)}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mb-xs flex items-center justify-between text-label-2 text-ink-muted">
                    <span className="inline-flex items-center gap-xs">
                      <Icon name="account_balance_wallet" size={12} className="text-primary" />
                      Utilisation
                    </span>
                    <span className="font-mono font-semibold text-ink">{pct}%</span>
                  </div>
                  <div className="relative h-2 overflow-hidden rounded-full bg-neutral-100">
                    <div
                      className={`h-full rounded-full transition-all ${barColor}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-stroke-100 pt-sm text-label-2 text-ink-muted">
                  <span className="inline-flex items-center gap-xs">
                    <Icon name="group" size={12} />
                    {s.states} states · ID {s.id}
                  </span>
                  <Link
                    href={`/portals/smile-admin/beggary-schemes/${s.id}`}
                    className="inline-flex items-center gap-xxs font-semibold text-info-600 hover:underline"
                  >
                    View
                    <Icon name="arrow_outward" size={12} />
                  </Link>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
