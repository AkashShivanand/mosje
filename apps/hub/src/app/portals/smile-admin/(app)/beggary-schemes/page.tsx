"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, Plus, Users, Wallet } from "lucide-react";
import { Badge, statusTone } from "@/components/smile-admin/ui/badge";
import { Button } from "@/components/smile-admin/ui/button";
import { Card, CardContent } from "@/components/smile-admin/ui/card";
import { PageHeader } from "@/components/smile-admin/shell/page-header";
import { DataToolbar, SearchField } from "@/components/smile-admin/data/data-toolbar";
import { ExportMenu } from "@/components/smile-admin/data/export-menu";
import { SCHEMES, type Scheme } from "@/lib/smile-admin/mock-data";
import { formatINR, formatNumber } from "@/lib/smile-admin/utils";

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
              <Plus className="h-3.5 w-3.5" /> New scheme
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
              <CardContent className="space-y-md p-lg">
                <div className="flex items-start justify-between gap-md">
                  <div className="min-w-0 space-y-1">
                    <div className="text-label-3 font-semibold uppercase tracking-[0.1em] text-foreground-hint">
                      {s.type}
                    </div>
                    <Link
                      href={`/portals/smile-admin/beggary-schemes/${s.id}`}
                      className="block truncate text-title-2 font-semibold text-foreground hover:text-primary"
                    >
                      {s.name}
                    </Link>
                  </div>
                  <Badge tone={statusTone(s.status)} withDot>
                    {s.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-md rounded-md border border-stroke-100 bg-neutral-50/60 p-md text-body-3">
                  <div className="space-y-1">
                    <div className="text-label-3 uppercase tracking-[0.08em] text-foreground-muted">
                      Budget
                    </div>
                    <div className="font-mono font-semibold text-foreground">
                      {formatINR(s.budget, true)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-label-3 uppercase tracking-[0.08em] text-foreground-muted">
                      Utilised
                    </div>
                    <div className="font-mono font-semibold text-foreground">
                      {formatINR(s.utilised, true)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-label-3 uppercase tracking-[0.08em] text-foreground-muted">
                      Beneficiaries
                    </div>
                    <div className="font-mono font-semibold text-foreground">
                      {formatNumber(s.beneficiaries)}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mb-xs flex items-center justify-between text-label-2 text-foreground-muted">
                    <span className="inline-flex items-center gap-xs">
                      <Wallet className="h-3 w-3 text-primary" />
                      Utilisation
                    </span>
                    <span className="font-mono font-semibold text-foreground">{pct}%</span>
                  </div>
                  <div className="relative h-2 overflow-hidden rounded-full bg-neutral-100">
                    <div
                      className={`h-full rounded-full transition-all ${barColor}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-stroke-100 pt-sm text-label-2 text-foreground-muted">
                  <span className="inline-flex items-center gap-xs">
                    <Users className="h-3 w-3" />
                    {s.states} states · ID {s.id}
                  </span>
                  <Link
                    href={`/portals/smile-admin/beggary-schemes/${s.id}`}
                    className="inline-flex items-center gap-xxs font-semibold text-info-600 hover:underline"
                  >
                    View
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
