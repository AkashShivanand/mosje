"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import { Badge, statusTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shell/page-header";
import { DataToolbar, SearchField } from "@/components/data/data-toolbar";
import { ExportMenu } from "@/components/data/export-menu";
import { Table, TD, TH, THead, TR } from "@/components/ui/table";
import { BENEFICIARIES, SHELTER_HOMES } from "@/lib/mock-data";

export default function ShelterOccupantsPage() {
  const [search, setSearch] = useState("");

  // Surface beneficiaries currently in shelter or rehab as "occupants" of a shelter home.
  const occupants = useMemo(() => {
    const rows = BENEFICIARIES.filter(
      (b) => b.status === "SHELTER_ASSIGNED" || b.status === "REHABILITATED",
    ).map((b, i) => {
      const home = SHELTER_HOMES[i % SHELTER_HOMES.length];
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
      <PageHeader
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
        <div className="ml-auto whitespace-nowrap text-label-2 text-foreground-muted">
          Showing <span className="font-semibold text-foreground">{occupants.length}</span> records
        </div>
      </DataToolbar>

      <div className="overflow-hidden rounded-lg border border-stroke-200 bg-white shadow-xs">
        <Table>
          <THead>
            <tr>
              <TH className="w-12">S.No.</TH>
              <TH>Beneficiary Name</TH>
              <TH>Gender</TH>
              <TH>Age</TH>
              <TH>Survey Location</TH>
              <TH>State</TH>
              <TH>Shelter Home Type</TH>
              <TH>Beneficiary Type</TH>
              <TH>Shelter Home Name</TH>
              <TH>Facility Status</TH>
              <TH className="text-right">Action</TH>
            </tr>
          </THead>
          <tbody>
            {occupants.map((r) => (
              <TR key={r.id}>
                <TD className="tabular-nums text-foreground-hint">{r.sno}</TD>
                <TD>
                  <Link
                    href={`/persons/${r.id}`}
                    className="font-semibold text-foreground hover:text-primary hover:underline"
                  >
                    {r.name}
                  </Link>
                </TD>
                <TD>{r.gender}</TD>
                <TD className="tabular-nums">{r.age}</TD>
                <TD className="text-foreground-muted">{r.surveyLocation}</TD>
                <TD>{r.state}</TD>
                <TD>{r.shelterType}</TD>
                <TD>{r.beneficiaryType}</TD>
                <TD className="text-foreground-muted">{r.shelterName}</TD>
                <TD>
                  <Badge tone={statusTone(r.facilityStatus)} withDot>
                    {r.facilityStatus}
                  </Badge>
                </TD>
                <TD className="text-right">
                  <Button variant="outline" size="xs" asChild>
                    <Link href={`/persons/${r.id}`}>
                      <Eye className="h-3.5 w-3.5" /> View
                    </Link>
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
