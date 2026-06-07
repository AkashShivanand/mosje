"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Eye, Layers, MapPin, ShieldAlert, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shell/page-header";
import { DataToolbar, SearchField } from "@/components/data/data-toolbar";
import { StatPill } from "@/components/data/stat-pill";
import { ExportMenu } from "@/components/data/export-menu";
import { Table, TD, TH, THead, TR } from "@/components/ui/table";
import { SURVEY_LOCATIONS, type SurveyLocation } from "@/lib/mock-data";

type Row = SurveyLocation & { sno: number };

const COLUMNS = [
  { header: "S.No", accessor: "sno" as const },
  { header: "Survey Location", accessor: "name" as const },
  {
    header: "Implementing Agency",
    accessor: (r: Row) => r.ia ?? "Unassigned",
  },
  { header: "State", accessor: "state" as const },
  { header: "District / City", accessor: "district" as const },
  { header: "Address", accessor: (r: Row) => r.address ?? "—" },
  { header: "Pincode", accessor: (r: Row) => r.pincode ?? "—" },
];

export default function SurveysPage() {
  const [search, setSearch] = useState("");

  const rows = useMemo<Row[]>(() => {
    const q = search.trim().toLowerCase();
    const list = SURVEY_LOCATIONS.filter((s) => {
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.type.toLowerCase().includes(q) ||
        (s.ia ?? "").toLowerCase().includes(q) ||
        s.state.toLowerCase().includes(q) ||
        s.district.toLowerCase().includes(q) ||
        (s.address ?? "").toLowerCase().includes(q)
      );
    });
    return list.map((s, i) => ({ ...s, sno: i + 1 }));
  }, [search]);

  const stats = useMemo(() => {
    const total = SURVEY_LOCATIONS.length;
    const assigned = SURVEY_LOCATIONS.filter((s) => !!s.ia).length;
    const unassigned = total - assigned;
    const types = new Set(SURVEY_LOCATIONS.map((s) => s.type)).size;
    return { total, assigned, unassigned, types };
  }, []);

  return (
    <div className="space-y-lg">
      <PageHeader
        breadcrumbs={[{ label: "Survey Operations" }, { label: "Survey Locations" }]}
        eyebrow="Survey operations"
        title="Survey Locations"
        subtitle="Field locations where Implementing Agencies conduct beneficiary surveys."
        actions={
          <ExportMenu
            filename="smile-survey-locations"
            title="Survey Locations"
            subtitle="Field locations where Implementing Agencies conduct beneficiary surveys."
            columns={COLUMNS}
            rows={rows}
          />
        }
      />

      <div className="grid grid-cols-2 gap-md md:grid-cols-4">
        <StatPill label="Total Locations" value={stats.total} icon={MapPin} tone="info" />
        <StatPill label="Assigned to IA" value={stats.assigned} icon={ShieldCheck} tone="success" />
        <StatPill
          label="Unassigned"
          value={stats.unassigned}
          icon={ShieldAlert}
          tone="warning"
        />
        <StatPill label="Location Types" value={stats.types} icon={Layers} tone="primary" />
      </div>

      <DataToolbar>
        <SearchField
          placeholder="Search by location type, address, IA name, district…"
          value={search}
          onChange={setSearch}
          className="flex-1"
        />
        <div className="ml-auto whitespace-nowrap text-label-2 text-foreground-muted">
          Showing <span className="font-semibold text-foreground">{rows.length}</span> of{" "}
          <span className="font-semibold text-foreground">{SURVEY_LOCATIONS.length}</span>
        </div>
      </DataToolbar>

      {/* Mobile card list */}
      <ul className="space-y-sm md:hidden">
        {rows.map((s) => (
          <li
            key={s.id}
            className="space-y-sm rounded-lg border border-stroke-200 bg-white p-md shadow-xs"
          >
            <div className="flex items-start justify-between gap-sm">
              <div className="min-w-0 space-y-0.5">
                <div className="text-label-3 font-semibold uppercase tracking-[0.08em] text-foreground-hint">
                  #{s.sno.toString().padStart(2, "0")}
                </div>
                <div className="truncate text-body-1 font-semibold text-foreground">
                  {s.name}
                </div>
                <div className="truncate text-label-2 text-foreground-muted">
                  {s.state} · {s.district}
                </div>
              </div>
              {s.ia ? (
                <Badge tone="success" withDot>
                  Assigned
                </Badge>
              ) : (
                <Badge tone="warning" withDot>
                  Unassigned
                </Badge>
              )}
            </div>
            <div className="space-y-0.5 border-t border-stroke-100 pt-sm text-label-3">
              <div>
                <span className="text-foreground-hint">IA: </span>
                <span className="font-medium text-foreground">{s.ia ?? "Unassigned"}</span>
              </div>
              {s.address ? (
                <div>
                  <span className="text-foreground-hint">Address: </span>
                  <span className="text-foreground">{s.address}</span>
                  {s.pincode ? (
                    <span className="ml-1 font-mono text-foreground-hint">· {s.pincode}</span>
                  ) : null}
                </div>
              ) : null}
            </div>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href={`/surveys/${s.id}`}>
                <Eye className="h-3.5 w-3.5" /> View Details
              </Link>
            </Button>
          </li>
        ))}
      </ul>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-lg border border-stroke-200 bg-white shadow-xs md:block">
        <Table>
          <THead>
            <tr>
              <TH className="w-12">S.No</TH>
              <TH>Survey Location</TH>
              <TH>Implementing Agency</TH>
              <TH>State</TH>
              <TH>District / City</TH>
              <TH>Address</TH>
              <TH>Pincode</TH>
              <TH className="text-right">Action</TH>
            </tr>
          </THead>
          <tbody>
            {rows.length === 0 ? (
              <TR>
                <TD colSpan={8} className="py-3xl text-center text-foreground-muted">
                  No survey locations match the current search.
                </TD>
              </TR>
            ) : (
              rows.map((s) => (
                <TR key={s.id}>
                  <TD className="tabular-nums text-foreground-hint">{s.sno}</TD>
                  <TD className="font-medium text-foreground">{s.name}</TD>
                  <TD>
                    {s.ia ? (
                      <span className="font-medium text-foreground">{s.ia}</span>
                    ) : (
                      <Badge tone="warning" withDot>
                        Unassigned
                      </Badge>
                    )}
                  </TD>
                  <TD>{s.state}</TD>
                  <TD>{s.district}</TD>
                  <TD className="max-w-[280px] truncate text-foreground-muted" title={s.address ?? "—"}>
                    {s.address ?? "—"}
                  </TD>
                  <TD className="font-mono text-foreground-muted">{s.pincode ?? "—"}</TD>
                  <TD className="text-right">
                    <Button variant="secondary" size="xs" asChild>
                      <Link href={`/surveys/${s.id}`}>
                        <Eye className="h-3.5 w-3.5" /> View Details
                      </Link>
                    </Button>
                  </TD>
                </TR>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
