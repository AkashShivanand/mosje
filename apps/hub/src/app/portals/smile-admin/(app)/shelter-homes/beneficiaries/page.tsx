"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { statusTone } from "@/lib/smile-admin/status-tone";
import { SmilePageHeader } from "@/components/smile-admin/shell/page-header";
import { DataToolbar, SearchField } from "@/components/smile-admin/data/data-toolbar";
import { ExportMenu } from "@/components/smile-admin/data/export-menu";
import { BENEFICIARIES, SHELTER_HOMES } from "@/lib/smile-admin/mock-data";
import { Badge, DataTable, Icon, buttonClasses, type DataTableColumn } from "@mosje/design-system";

interface Occupant {
  sno: number;
  id: string;
  name: string;
  gender: string;
  age: number;
  surveyLocation: string;
  state: string;
  shelterType: string;
  beneficiaryType: string;
  shelterName: string;
  facilityStatus: string;
}

const COLUMNS: DataTableColumn<Occupant & Record<string, unknown>>[] = [
  { key: "sno", header: "S.No.", className: "w-12 tabular-nums text-ink-hint" },
  {
    key: "name",
    header: "Beneficiary Name",
    sortable: true,
    render: (r) => (
      <Link href={`/portals/smile-admin/persons/${r.id}`} className="font-semibold text-ink hover:text-primary hover:underline">
        {r.name}
      </Link>
    ),
    exportValue: (r) => r.name,
  },
  { key: "gender", header: "Gender", sortable: true },
  { key: "age", header: "Age", sortable: true, className: "tabular-nums" },
  { key: "surveyLocation", header: "Survey Location", className: "text-ink-muted" },
  { key: "state", header: "State", sortable: true },
  { key: "shelterType", header: "Shelter Home Type" },
  { key: "beneficiaryType", header: "Beneficiary Type", sortable: true },
  { key: "shelterName", header: "Shelter Home Name", sortable: true, className: "text-ink-muted" },
  {
    key: "facilityStatus",
    header: "Facility Status",
    sortable: true,
    render: (r) => (
      <Badge status={statusTone(r.facilityStatus)} dot>
        {r.facilityStatus}
      </Badge>
    ),
    exportValue: (r) => r.facilityStatus,
  },
  {
    key: "actions",
    header: "Action",
    className: "text-right",
    noExport: true,
    render: (r) => (
      <Link href={`/portals/smile-admin/persons/${r.id}`} className={buttonClasses("primary", "outlined", "sm")}>
        <Icon name="visibility" size={14} /> View
      </Link>
    ),
  },
];

export default function ShelterOccupantsPage() {
  const [search, setSearch] = useState("");

  // Surface beneficiaries currently in shelter or rehab as "occupants" of a shelter home.
  const occupants = useMemo(() => {
    const rows = BENEFICIARIES.filter(
      (b) => b.status === "SHELTER_ASSIGNED" || b.status === "REHABILITATED",
    ).map((b, i) => {
      const home = SHELTER_HOMES[i % SHELTER_HOMES.length]!;
      const surveyLocation = b.district ? `${b.district} Field` : "—";
      return {
        sno: i + 1,
        id: b.id,
        name: b.name,
        gender: b.gender,
        age: b.age,
        surveyLocation,
        state: b.state,
        shelterType: "Government",
        beneficiaryType: b.type,
        shelterName: home.name,
        facilityStatus: home.status,
      };
    });
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter((r) =>
      `${r.name} ${r.state} ${r.shelterName}`.toLowerCase().includes(q),
    );
  }, [search]);

  return (
    <div className="space-y-lg">
      <SmilePageHeader
        breadcrumbs={[{ label: "Beneficiaries" }, { label: "Shelter Occupants" }]}
        eyebrow="Beneficiaries"
        title="Shelter Home Persons"
        subtitle="Beneficiaries currently residing in shelter homes."
        actions={
          <ExportMenu
            filename="smile-shelter-home-persons"
            title="Shelter Home Persons"
            subtitle="Beneficiaries currently residing in shelter homes."
            columns={[
              { header: "S.No.", accessor: "sno" },
              { header: "Beneficiary Name", accessor: "name" },
              { header: "Gender", accessor: "gender" },
              { header: "Age", accessor: "age" },
              { header: "Survey Location", accessor: "surveyLocation" },
              { header: "State", accessor: "state" },
              { header: "Shelter Home Type", accessor: "shelterType" },
              { header: "Beneficiary Type", accessor: "beneficiaryType" },
              { header: "Shelter Home Name", accessor: "shelterName" },
              { header: "Facility Status", accessor: "facilityStatus" },
            ]}
            rows={occupants}
          />
        }
      />

      <DataToolbar>
        <SearchField
          placeholder="Search beneficiary, state, or shelter home…"
          value={search}
          onChange={setSearch}
          className="flex-1"
        />
        <div className="ml-auto whitespace-nowrap text-label-2 text-ink-muted">
          Showing <span className="font-semibold text-ink">{occupants.length}</span> records
        </div>
      </DataToolbar>

      <div className="rounded-lg border border-stroke-200 bg-white p-md shadow-xs">
        <DataTable
          columns={COLUMNS}
          data={occupants as Array<Occupant & Record<string, unknown>>}
          total={occupants.length}
          caption="Shelter occupants, their shelter home and facility status"
          emptyLabel="No occupant matches this search."
        />
      </div>
    </div>
  );
}
