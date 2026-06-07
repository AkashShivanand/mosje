"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Building2, Home, Plus, Users } from "lucide-react";
import { Badge, statusTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shell/page-header";
import { DataToolbar, SearchField } from "@/components/data/data-toolbar";
import { StatPill } from "@/components/data/stat-pill";
import { Table, TD, TH, THead, TR } from "@/components/ui/table";
import { SHELTER_HOMES } from "@/lib/mock-data";
import { formatNumber } from "@/lib/utils";

export default function ShelterHomesPage() {
  const [search, setSearch] = useState("");
  const data = useMemo(
    () => SHELTER_HOMES.filter((s) => `${s.name} ${s.state} ${s.district}`.toLowerCase().includes(search.toLowerCase())),
    [search]
  );
  const totalCapacity = data.reduce((s, h) => s + h.capacity, 0);
  const totalOccupancy = data.reduce((s, h) => s + h.occupancy, 0);

  return (
    <div className="space-y-lg">
      <PageHeader
        breadcrumbs={[{ label: "Beneficiaries" }, { label: "Shelter Homes" }]}
        eyebrow="Beneficiaries"
        title="Shelter homes"
        subtitle="Certified rehabilitation shelters across India — track capacity, occupancy, and audit status."
        actions={
          <Button size="sm">
            <Plus className="h-3.5 w-3.5" /> Add shelter
          </Button>
        }
      />
      <div className="grid grid-cols-2 gap-md md:grid-cols-4">
        <StatPill label="Shelters"   value={data.length}     icon={Building2} tone="primary" />
        <StatPill label="Capacity"   value={totalCapacity}   icon={Home}      tone="info" />
        <StatPill label="Occupants"  value={totalOccupancy}  icon={Users}     tone="success" />
        <StatPill label="Audits due" value={data.filter((s) => s.status === "Audit").length} icon={Building2} tone="warning" />
      </div>
      <DataToolbar>
        <SearchField placeholder="Search shelter / state / district…" value={search} onChange={setSearch} />
      </DataToolbar>
      {/* Mobile card list */}
      <div className="space-y-sm md:hidden">
        {data.map((s) => {
          const occPct = Math.round((s.occupancy / s.capacity) * 100);
          const occColor =
            occPct >= 90 ? "bg-danger" : occPct >= 75 ? "bg-warning" : "bg-primary";
          return (
            <div
              key={s.id}
              className="space-y-sm rounded-lg border border-stroke-200 bg-white p-md shadow-xs"
            >
              <div className="flex items-start justify-between gap-sm">
                <div className="min-w-0 space-y-0.5">
                  <div className="truncate text-body-1 font-semibold text-foreground">
                    {s.name}
                  </div>
                  <div className="font-mono text-label-3 text-foreground-hint">
                    {s.id} · {s.state} / {s.district}
                  </div>
                </div>
                <Badge tone={statusTone(s.status)} withDot>
                  {s.status}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-sm border-t border-stroke-100 pt-sm text-label-3">
                <div className="space-y-0.5">
                  <div className="text-foreground-hint">Manager</div>
                  <div className="truncate font-semibold text-foreground">{s.manager}</div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-foreground-hint">Capacity</div>
                  <div className="font-mono font-semibold text-foreground">
                    {formatNumber(s.capacity)}
                  </div>
                </div>
              </div>
              <div>
                <div className="mb-xs flex items-center justify-between text-label-3">
                  <span className="text-foreground-hint">Occupancy</span>
                  <span className="font-mono font-semibold text-foreground">{occPct}%</span>
                </div>
                <div className="relative h-1.5 overflow-hidden rounded-full bg-neutral-100">
                  <div
                    className={`h-full rounded-full ${occColor}`}
                    style={{ width: `${occPct}%` }}
                  />
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/shelter-homes/beneficiaries">View occupants</Link>
              </Button>
            </div>
          );
        })}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-lg border border-stroke-200 bg-white shadow-xs md:block">
        <Table>
          <THead>
            <tr>
              <TH>Shelter</TH>
              <TH>State / District</TH>
              <TH>Manager</TH>
              <TH>Implementing Agency</TH>
              <TH className="text-right">Capacity</TH>
              <TH>Occupancy</TH>
              <TH>Status</TH>
              <TH className="text-right">Actions</TH>
            </tr>
          </THead>
          <tbody>
            {data.map((s) => {
              const occPct = Math.round((s.occupancy / s.capacity) * 100);
              const occColor =
                occPct >= 90
                  ? "bg-danger"
                  : occPct >= 75
                  ? "bg-warning"
                  : "bg-primary";
              return (
                <TR key={s.id}>
                  <TD>
                    <div className="font-semibold text-foreground">{s.name}</div>
                    <div className="font-mono text-label-3 text-foreground-hint">{s.id}</div>
                  </TD>
                  <TD>
                    {s.state}{" "}
                    <span className="text-foreground-muted">/ {s.district}</span>
                  </TD>
                  <TD>{s.manager}</TD>
                  <TD className="text-foreground-muted">{s.ia}</TD>
                  <TD className="text-right font-mono tabular-nums">
                    {formatNumber(s.capacity)}
                  </TD>
                  <TD>
                    <div className="flex items-center gap-sm">
                      <div className="relative h-1.5 w-24 overflow-hidden rounded-full bg-neutral-100">
                        <div
                          className={`h-full rounded-full ${occColor}`}
                          style={{ width: `${occPct}%` }}
                        />
                      </div>
                      <span className="font-mono text-label-2 tabular-nums text-foreground">
                        {occPct}%
                      </span>
                    </div>
                  </TD>
                  <TD>
                    <Badge tone={statusTone(s.status)} withDot>
                      {s.status}
                    </Badge>
                  </TD>
                  <TD className="text-right">
                    <Button variant="outline" size="xs" asChild>
                      <Link href="/shelter-homes/beneficiaries">View occupants</Link>
                    </Button>
                  </TD>
                </TR>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
