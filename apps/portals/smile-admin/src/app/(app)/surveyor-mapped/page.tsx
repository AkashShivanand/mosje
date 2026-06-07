"use client";

import { useMemo, useState } from "react";
import { Edit3, Plus } from "lucide-react";
import { Badge, statusTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shell/page-header";
import { DataToolbar, SearchField } from "@/components/data/data-toolbar";
import { ExportMenu } from "@/components/data/export-menu";
import { Table, TD, TH, THead, TR } from "@/components/ui/table";
import { SURVEYOR_MAPPINGS, type SurveyorMapping } from "@/lib/mock-data";

type Row = SurveyorMapping & { sno: number };

export default function SurveyorMappedPage() {
  const [search, setSearch] = useState("");

  const rows = useMemo<Row[]>(() => {
    const q = search.trim().toLowerCase();
    return SURVEYOR_MAPPINGS.filter((m) =>
      q
        ? `${m.name} ${m.state} ${m.city} ${m.surveyLocation}`
            .toLowerCase()
            .includes(q)
        : true,
    ).map((m, i) => ({ ...m, sno: i + 1 }));
  }, [search]);

  return (
    <div className="space-y-lg">
      <PageHeader
        breadcrumbs={[{ label: "Field Operations" }, { label: "Surveyor Mappings" }]}
        eyebrow="Field operations"
        title="Surveyor Mappings"
        subtitle="Surveyor-to-survey-location assignment records."
        actions={
          <div className="flex items-center gap-sm">
            <ExportMenu
              filename="smile-surveyor-mappings"
              title="Surveyor Mappings"
              subtitle="Surveyor-to-survey-location assignment records."
              columns={[
                { header: "S.No.", accessor: "sno" },
                { header: "Name", accessor: "name" },
                { header: "State", accessor: "state" },
                { header: "City", accessor: "city" },
                { header: "Survey Location", accessor: "surveyLocation" },
                { header: "Created On", accessor: "createdOn" },
                { header: "Status", accessor: "status" },
              ]}
              rows={rows}
            />
            <Button size="sm">
              <Plus className="h-3.5 w-3.5" /> New mapping
            </Button>
          </div>
        }
      />

      <DataToolbar>
        <SearchField
          placeholder="Search surveyor, state, city, or location…"
          value={search}
          onChange={setSearch}
          className="flex-1"
        />
        <div className="ml-auto whitespace-nowrap text-label-2 text-foreground-muted">
          Showing <span className="font-semibold text-foreground">{rows.length}</span> of{" "}
          <span className="font-semibold text-foreground">{SURVEYOR_MAPPINGS.length}</span>
        </div>
      </DataToolbar>

      {/* Mobile card list */}
      <ul className="space-y-sm md:hidden">
        {rows.map((m) => (
          <li
            key={m.id}
            className="rounded-lg border border-stroke-200 bg-white p-md shadow-xs"
          >
            <div className="flex items-start justify-between gap-sm">
              <div className="min-w-0">
                <div className="text-label-3 font-semibold uppercase tracking-[0.08em] text-foreground-hint">
                  #{m.sno.toString().padStart(2, "0")}
                </div>
                <div className="truncate text-body-1 font-semibold text-foreground">
                  {m.name}
                </div>
                <div className="truncate text-label-2 text-foreground-muted">
                  {m.state} · {m.city}
                </div>
              </div>
              <Badge tone={statusTone(m.status)} withDot>
                {m.status}
              </Badge>
            </div>
            <div className="mt-sm border-t border-stroke-100 pt-sm text-label-3">
              <div className="text-foreground-hint">Survey location</div>
              <div className="font-medium text-foreground">{m.surveyLocation}</div>
            </div>
            <div className="mt-sm flex items-center justify-between text-label-3">
              <span className="text-foreground-hint">
                Created <span className="font-mono">{m.createdOn}</span>
              </span>
              <Button variant="outline" size="xs">
                <Edit3 className="h-3.5 w-3.5" /> Edit
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-lg border border-stroke-200 bg-white shadow-xs md:block">
        <Table>
          <THead>
            <tr>
              <TH className="w-12">S.No.</TH>
              <TH>Name</TH>
              <TH>State</TH>
              <TH>City</TH>
              <TH>Survey Location</TH>
              <TH>Created On</TH>
              <TH>Status</TH>
              <TH className="text-right">Action</TH>
            </tr>
          </THead>
          <tbody>
            {rows.map((m) => (
              <TR key={m.id}>
                <TD className="tabular-nums text-foreground-hint">{m.sno}</TD>
                <TD className="font-medium text-foreground">{m.name}</TD>
                <TD>{m.state}</TD>
                <TD>{m.city}</TD>
                <TD className="text-foreground-muted">{m.surveyLocation}</TD>
                <TD className="font-mono text-body-3 text-foreground-muted">{m.createdOn}</TD>
                <TD>
                  <Badge tone={statusTone(m.status)} withDot>
                    {m.status}
                  </Badge>
                </TD>
                <TD className="text-right">
                  <Button variant="outline" size="xs">
                    <Edit3 className="h-3.5 w-3.5" /> Edit
                  </Button>
                </TD>
              </TR>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
