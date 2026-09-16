"use client";

import { useMemo, useState } from "react";
import { SmilePageHeader } from "@/components/smile-admin/shell/page-header";
import { DataToolbar, SearchField } from "@/components/smile-admin/data/data-toolbar";
import { StatPill } from "@/components/smile-admin/data/stat-pill";
import { ExportMenu } from "@/components/smile-admin/data/export-menu";
import { SKILL_TRAINING, type SkillTrainingRow } from "@/lib/smile-admin/rehab";
import { Badge, DataTable, type DataTableColumn } from "@mosje/design-system";

const STATES = ["All States", ...Array.from(new Set(SKILL_TRAINING.map((r) => r.state)))];

const TONE = {
  Completed: "success",
  Ongoing: "info",
  Dropped: "danger",
} as const;

export default function SkillTrainingPage() {
  const [search, setSearch] = useState("");
  const [state, setState] = useState(STATES[0]!);
  const [district, setDistrict] = useState("All Districts");

  const districts = useMemo(() => {
    const inState = SKILL_TRAINING.filter((r) => state === STATES[0] || r.state === state);
    return ["All Districts", ...Array.from(new Set(inState.map((r) => r.district)))];
  }, [state]);

  const rows = useMemo(
    () =>
      SKILL_TRAINING.filter(
        (r) =>
          (!search || `${r.name} ${r.id} ${r.course}`.toLowerCase().includes(search.toLowerCase())) &&
          (state === STATES[0] || r.state === state) &&
          (district === "All Districts" || r.district === district),
      ),
    [search, state, district],
  );

  const columns: DataTableColumn<SkillTrainingRow & Record<string, unknown>>[] = [
    {
      key: "sno",
      header: "S.No.",
      className: "w-12 tabular-nums text-ink-hint",
      render: (r) => rows.indexOf(r) + 1,
      exportValue: (r) => String(rows.indexOf(r) + 1),
    },
    { key: "id", header: "Beneficiary ID", className: "font-mono text-body-2 text-ink-muted" },
    { key: "name", header: "Beneficiary Name", sortable: true, className: "font-medium text-ink" },
    { key: "gender", header: "Gender", sortable: true },
    { key: "age", header: "Age", sortable: true, className: "tabular-nums" },
    { key: "duration", header: "Duration of Skill and Training" },
    { key: "course", header: "Skill and Training Type", sortable: true },
    { key: "surveyLocation", header: "Survey Location", className: "text-ink-muted" },
    { key: "shelter", header: "Shelter Name", className: "text-ink-muted" },
    { key: "state", header: "State", sortable: true },
    { key: "district", header: "District", sortable: true },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (r) => <Badge status={TONE[r.status]} dot>{r.status}</Badge>,
      exportValue: (r) => r.status,
    },
  ];

  return (
    <div className="space-y-lg">
      <SmilePageHeader
        breadcrumbs={[{ label: "Beneficiaries" }, { label: "Skill & Training" }]}
        eyebrow="Beneficiaries"
        title="Skill & Training"
        subtitle="Beneficiary skill training enrolments."
        actions={
          <ExportMenu
            filename="smile-skill-training"
            title="Skill & Training"
            subtitle="Beneficiary skill training enrolments"
            columns={[
              { header: "Beneficiary ID", accessor: "id" },
              { header: "Beneficiary Name", accessor: "name" },
              { header: "Gender", accessor: "gender" },
              { header: "Age", accessor: "age" },
              { header: "Duration", accessor: "duration" },
              { header: "Skill and Training Type", accessor: "course" },
              { header: "Survey Location", accessor: "surveyLocation" },
              { header: "Shelter Name", accessor: "shelter" },
              { header: "State", accessor: "state" },
              { header: "District", accessor: "district" },
              { header: "Status", accessor: "status" },
            ]}
            rows={rows}
          />
        }
      />

      <div className="grid grid-cols-2 gap-md md:grid-cols-4">
        <StatPill label="Enrolments" value={rows.length} icon="school" tone="primary" />
        <StatPill label="Completed" value={rows.filter((r) => r.status === "Completed").length} icon="check_circle" tone="success" />
        <StatPill label="Ongoing" value={rows.filter((r) => r.status === "Ongoing").length} icon="hourglass_empty" tone="info" />
        <StatPill label="Dropped" value={rows.filter((r) => r.status === "Dropped").length} icon="cancel" tone="danger" />
      </div>

      <DataToolbar>
        <SearchField
          placeholder="Search beneficiary, id or course…"
          label="Search skill training enrolments"
          value={search}
          onChange={setSearch}
        />
        <select
          aria-label="State"
          value={state}
          onChange={(e) => {
            setState(e.target.value);
            setDistrict("All Districts");
          }}
          className="h-10 rounded-md border border-stroke-300 bg-white px-md text-body-2 text-ink shadow-xs"
        >
          {STATES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select
          aria-label="District"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="h-10 rounded-md border border-stroke-300 bg-white px-md text-body-2 text-ink shadow-xs"
        >
          {districts.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </DataToolbar>

      <div className="rounded-lg border border-stroke-200 bg-white p-md shadow-xs">
        <DataTable
          columns={columns}
          data={rows as Array<SkillTrainingRow & Record<string, unknown>>}
          total={rows.length}
          pageSizes={[20, 50, 100]}
          caption="Skill training enrolments by beneficiary, course and status"
          emptyLabel="No enrolment matches these filters."
        />
      </div>
    </div>
  );
}
