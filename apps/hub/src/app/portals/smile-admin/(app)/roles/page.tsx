"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { statusTone } from "@/lib/smile-admin/status-tone";
import { SmilePageHeader } from "@/components/smile-admin/shell/page-header";
import { DataToolbar, SearchField } from "@/components/smile-admin/data/data-toolbar";
import { StatPill } from "@/components/smile-admin/data/stat-pill";
import { ROLES, type Role } from "@/lib/smile-admin/mock-data";
import { Badge, Button, DataTable, Icon, buttonClasses, type DataTableColumn } from "@mosje/design-system";

const COLUMNS: DataTableColumn<Role & Record<string, unknown>>[] = [
  {
    key: "name",
    header: "Role",
    sortable: true,
    render: (r) => (
      <>
        <div className="font-semibold text-ink">{r.name}</div>
        <div className="text-label-2 text-ink-muted">{r.id}</div>
      </>
    ),
    exportValue: (r) => r.name,
  },
  {
    key: "scope",
    header: "Scope",
    sortable: true,
    render: (r) => (
      <Badge status={r.scope === "Central" ? "primary" : r.scope === "State" ? "info" : r.scope === "District" ? "warning" : "neutral"}>
        {r.scope}
      </Badge>
    ),
    exportValue: (r) => r.scope,
  },
  {
    key: "members",
    header: "Members",
    sortable: true,
    className: "text-right tabular-nums",
    render: (r) => r.members.toLocaleString("en-IN"),
    sortValue: (r) => r.members,
  },
  { key: "permissions", header: "Permissions", sortable: true, className: "text-right tabular-nums" },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (r) => <Badge status={statusTone(r.status)}>{r.status}</Badge>,
    exportValue: (r) => r.status,
  },
  { key: "updatedAt", header: "Last updated", sortable: true, className: "text-ink-muted" },
  {
    key: "actions",
    header: "Actions",
    className: "text-right",
    noExport: true,
    render: (r) => (
      <Link href={`/portals/smile-admin/roles/${r.id}/edit`} className={buttonClasses("primary", "outlined", "sm")}>
        <Icon name="edit" size={14} /> Edit
      </Link>
    ),
  },
];

export default function RolesPage() {
  const [search, setSearch] = useState("");
  const [scope, setScope] = useState<string>("All scopes");

  const roles = useMemo(
    () => ROLES.filter((r) => (!search || r.name.toLowerCase().includes(search.toLowerCase())) && (scope === "All scopes" || r.scope === scope)),
    [search, scope]
  );

  const totals = useMemo(() => ({
    roles: roles.length,
    members: roles.reduce((s, r) => s + r.members, 0),
    permissions: roles.reduce((s, r) => Math.max(s, r.permissions), 0),
  }), [roles]);

  return (
    <div className="space-y-lg">
      <SmilePageHeader
        breadcrumbs={[{ label: "Access Control" }, { label: "Roles" }]}
        title="Roles & Permissions"
        subtitle="Manage who can do what — group permissions into roles and assign roles to users across the SMILE programme."
        actions={
          <div className="flex items-center gap-sm">
            <Link href="/portals/smile-admin/permissions" className={buttonClasses("primary", "outlined", "sm")}><Icon name="verified_user" size={14} /> View permissions</Link>
            <Button size="sm"><Icon name="add" size={14} /> New role</Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-md md:grid-cols-3">
        <StatPill label="Active roles"      value={totals.roles}       icon="verified_user" tone="primary" />
        <StatPill label="Members assigned"  value={totals.members}     icon="groups"      tone="info" />
        <StatPill label="Permissions / role" value={totals.permissions} icon="verified_user" tone="success" />
      </div>

      <DataToolbar>
        <SearchField placeholder="Search roles…" value={search} onChange={setSearch} />
        <select className="h-10 rounded-md border border-stroke-300 bg-white px-md text-body-2 shadow-xs hover:border-stroke-400 focus:border-primary" value={scope} onChange={(e) => setScope(e.target.value)}>
          <option>All scopes</option>
          <option>Central</option>
          <option>State</option>
          <option>District</option>
          <option>Field</option>
        </select>
      </DataToolbar>

      <div className="rounded-lg border border-stroke-200 bg-white p-md shadow-xs">
        <DataTable
          columns={COLUMNS}
          data={roles as Array<Role & Record<string, unknown>>}
          total={roles.length}
          showPageSizes={false}
          caption="Roles, their scope, membership and permission count"
          emptyLabel="No role matches these filters."
        />
      </div>
    </div>
  );
}
