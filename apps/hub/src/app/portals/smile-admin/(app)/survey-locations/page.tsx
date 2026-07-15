"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MapPin, Plus, Users2 } from "lucide-react";
import { Badge } from "@/components/smile-admin/ui/badge";
import { Button } from "@/components/smile-admin/ui/button";
import { PageHeader } from "@/components/smile-admin/shell/page-header";
import { DataToolbar, SearchField } from "@/components/smile-admin/data/data-toolbar";
import { StatPill } from "@/components/smile-admin/data/stat-pill";
import { Table, TD, TH, THead, TR } from "@/components/smile-admin/ui/table";
import { SURVEY_LOCATIONS } from "@/lib/smile-admin/mock-data";
import { formatNumber } from "@/lib/smile-admin/utils";

export default function SurveyLocationsPage() {
  const [search, setSearch] = useState("");
  const rows = useMemo(
    () => SURVEY_LOCATIONS.filter((r) => `${r.name} ${r.state} ${r.district} ${r.pincode}`.toLowerCase().includes(search.toLowerCase())),
    [search]
  );
  const totalIdentified = rows.reduce((s, r) => s + r.identified, 0);
  const totalSurveyors = rows.reduce((s, r) => s + r.surveyors, 0);
  return (
    <div className="space-y-lg">
      <PageHeader
        breadcrumbs={[{ label: "Field Operations" }, { label: "Survey Locations" }]}
        title="Survey Locations"
        subtitle="Hotspots and outreach points where surveyors actively log beneficiary identifications."
        actions={<Button size="sm" asChild><Link href="/portals/smile-admin/survey-locations/create"><Plus className="h-3.5 w-3.5" /> Add location</Link></Button>}
      />
      <div className="grid grid-cols-2 gap-md md:grid-cols-3">
        <StatPill label="Locations"            value={rows.length}       icon={MapPin}  tone="primary" />
        <StatPill label="Surveyors deployed"   value={totalSurveyors}    icon={Users2}  tone="info" />
        <StatPill label="Identified at locations" value={totalIdentified} icon={MapPin}  tone="success" />
      </div>
      <DataToolbar><SearchField placeholder="Search location / state / pincode…" value={search} onChange={setSearch} /></DataToolbar>
      <div className="overflow-hidden rounded-lg border border-stroke-200 bg-white shadow-xs">
        <Table>
          <THead>
            <tr>
              <TH>Location</TH>
              <TH>State / District</TH>
              <TH>Pincode</TH>
              <TH>Type</TH>
              <TH className="text-right">Surveyors</TH>
              <TH className="text-right">Identified</TH>
              <TH>Last survey</TH>
            </tr>
          </THead>
          <tbody>
            {rows.map((r) => (
              <TR key={r.id}>
                <TD className="font-semibold text-foreground">{r.name}</TD>
                <TD>{r.state} <span className="text-foreground-muted">/ {r.district}</span></TD>
                <TD className="font-mono text-body-3 text-foreground-muted">{r.pincode}</TD>
                <TD><Badge tone="info">{r.type}</Badge></TD>
                <TD className="text-right tabular-nums">{r.surveyors}</TD>
                <TD className="text-right tabular-nums">{formatNumber(r.identified)}</TD>
                <TD className="text-foreground-muted">{r.lastSurveyed}</TD>
              </TR>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
