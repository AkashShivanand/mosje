"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SmilePageHeader } from "@/components/smile-admin/shell/page-header";
import { DataToolbar, SearchField } from "@/components/smile-admin/data/data-toolbar";
import { StatPill } from "@/components/smile-admin/data/stat-pill";
import { ExportMenu } from "@/components/smile-admin/data/export-menu";
import { statusTone } from "@/lib/smile-admin/status-tone";
import { BENEFICIARIES, SHELTER_HOMES, type Beneficiary, type BeneficiaryStatus } from "@/lib/smile-admin/mock-data";
import { Badge, DataTable, Icon, buttonClasses, type DataTableColumn } from "@mosje/design-system";

type Row = Beneficiary & { shelter?: string } & Record<string, unknown>;

/**
 * One stage of the beneficiary journey, as its own register.
 *
 * The Beneficiary List can already be filtered to any of these, and these pages
 * are not a second copy of it: they are the entry points the sidebar and the
 * dashboard counters link to, so a reader who clicks "Mobilised — 412" lands on
 * the 412 rather than on the whole register with a filter they must then find.
 */
export function BeneficiarySubset({
  title,
  subtitle,
  statuses,
  withShelter = false,
}: {
  title: string;
  subtitle: string;
  statuses: BeneficiaryStatus[];
  /** Shelter-stage registers name the shelter each person is in. */
  withShelter?: boolean;
}) {
  const [search, setSearch] = useState("");
  const [state, setState] = useState("All States");

  const all = useMemo<Row[]>(
    () =>
      BENEFICIARIES.filter((b) => statuses.includes(b.status)).map((b, i) => ({
        ...b,
        shelter: withShelter ? SHELTER_HOMES[i % SHELTER_HOMES.length]!.name : undefined,
      })),
    [statuses, withShelter],
  );

  const states = ["All States", ...Array.from(new Set(all.map((b) => b.state)))];

  const rows = useMemo(
    () =>
      all.filter(
        (b) =>
          (!search || `${b.name} ${b.id} ${b.district}`.toLowerCase().includes(search.toLowerCase())) &&
          (state === "All States" || b.state === state),
      ),
    [all, search, state],
  );

  const columns: DataTableColumn<Row>[] = [
    {
      key: "sno",
      header: "#",
      className: "w-10 tabular-nums text-ink-hint",
      render: (b) => rows.indexOf(b) + 1,
      exportValue: (b) => String(rows.indexOf(b) + 1),
    },
    { key: "id", header: "Beneficiary ID", sortable: true, className: "font-mono text-body-2 text-ink-muted" },
    {
      key: "name",
      header: "Name",
      sortable: true,
      render: (b) => (
        <Link href={`/portals/smile-admin/persons/${b.id}`} className="font-semibold text-ink hover:text-primary hover:underline">
          {b.name}
        </Link>
      ),
      exportValue: (b) => b.name,
    },
    { key: "age", header: "Age", sortable: true, className: "w-16 tabular-nums" },
    { key: "gender", header: "Gender", sortable: true },
    { key: "state", header: "State", sortable: true },
    { key: "district", header: "District / City", sortable: true },
    {
      key: "ia",
      header: "IA",
      sortable: true,
      className: "text-ink-muted",
      render: (b) => b.ia ?? "—",
      sortValue: (b) => b.ia ?? "",
    },
    ...(withShelter
      ? [
          {
            key: "shelter",
            header: "Swashraya (Shelter Home)",
            sortable: true,
            className: "text-ink-muted",
            render: (b: Row) => b.shelter ?? "—",
          } as DataTableColumn<Row>,
        ]
      : []),
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (b) => (
        <Badge status={statusTone(b.status)} dot>
          {b.status.replace(/_/g, " ")}
        </Badge>
      ),
      exportValue: (b) => b.status.replace(/_/g, " "),
    },
    {
      key: "actions",
      header: "Action",
      className: "text-right",
      noExport: true,
      render: (b) => (
        <Link href={`/portals/smile-admin/persons/${b.id}`} className={buttonClasses("primary", "outlined", "sm")}>
          <Icon name="visibility" size={16} /> View
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-lg">
      <SmilePageHeader
        breadcrumbs={[{ label: "Beneficiaries" }, { label: "Beneficiary List", href: "/portals/smile-admin/persons" }, { label: title }]}
        eyebrow="Beneficiaries"
        title={title}
        subtitle={subtitle}
        actions={
          <ExportMenu
            filename={`smile-${title.toLowerCase().replace(/[^a-z]+/g, "-")}`}
            title={title}
            subtitle={subtitle}
            columns={[
              { header: "Beneficiary ID", accessor: "id" },
              { header: "Name", accessor: "name" },
              { header: "Age", accessor: "age" },
              { header: "Gender", accessor: "gender" },
              { header: "State", accessor: "state" },
              { header: "District / City", accessor: "district" },
              { header: "IA", accessor: (b: Row) => b.ia ?? "—" },
              { header: "Status", accessor: (b: Row) => b.status.replace(/_/g, " ") },
            ]}
            rows={rows}
          />
        }
      />

      <div className="grid grid-cols-2 gap-md md:grid-cols-4">
        <StatPill label="In this stage" value={rows.length} icon="account_box" tone="primary" />
        <StatPill label="Male" value={rows.filter((b) => b.gender === "Male").length} icon="group" tone="info" />
        <StatPill label="Female" value={rows.filter((b) => b.gender === "Female").length} icon="group" tone="success" />
        <StatPill label="Transgender" value={rows.filter((b) => b.gender === "Transgender").length} icon="group" tone="warning" />
      </div>

      <DataToolbar>
        <SearchField
          placeholder="Search name, id or district…"
          label={`Search ${title.toLowerCase()}`}
          value={search}
          onChange={setSearch}
        />
        <select
          aria-label="State"
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="h-10 rounded-md border border-stroke-300 bg-white px-md text-body-2 text-ink shadow-xs"
        >
          {states.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <Link href="/portals/smile-admin/persons" className="ml-auto text-label-1 text-primary hover:underline">
          Open the full Beneficiary List
        </Link>
      </DataToolbar>

      <div className="rounded-lg border border-stroke-200 bg-white p-md shadow-xs">
        <DataTable
          columns={columns}
          data={rows}
          total={rows.length}
          pageSizes={[25, 50, 100]}
          caption={`${title} — ${subtitle}`}
          emptyLabel="No beneficiary is at this stage for the chosen state."
        />
      </div>
    </div>
  );
}
