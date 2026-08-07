"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { statusTone } from "@/lib/smile-admin/status-tone";
import { PageHeader } from "@/components/smile-admin/shell/page-header";
import { DataToolbar, SearchField } from "@/components/smile-admin/data/data-toolbar";
import { StatPill } from "@/components/smile-admin/data/stat-pill";
import { Table, TD, TH, THead, TR } from "@/components/smile-admin/table";
import { ROLES } from "@/lib/smile-admin/mock-data";
import { Badge, Button, Icon, buttonClasses } from "@mosje/design-system";

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
      <PageHeader
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

      <div className="overflow-hidden rounded-lg border border-stroke-200 bg-white shadow-xs">
        <Table>
          <THead>
            <tr>
              <TH>Role</TH>
              <TH>Scope</TH>
              <TH className="text-right">Members</TH>
              <TH className="text-right">Permissions</TH>
              <TH>Status</TH>
              <TH>Last updated</TH>
              <TH className="text-right">Actions</TH>
            </tr>
          </THead>
          <tbody>
            {roles.map((r) => (
              <TR key={r.id}>
                <TD>
                  <div className="font-semibold text-ink">{r.name}</div>
                  <div className="text-label-2 text-ink-muted">{r.id}</div>
                </TD>
                <TD><Badge status={r.scope === "Central" ? "primary" : r.scope === "State" ? "info" : r.scope === "District" ? "warning" : "neutral"}>{r.scope}</Badge></TD>
                <TD className="text-right tabular-nums">{r.members.toLocaleString("en-IN")}</TD>
                <TD className="text-right tabular-nums">{r.permissions}</TD>
                <TD><Badge status={statusTone(r.status)}>{r.status}</Badge></TD>
                <TD className="text-ink-muted">{r.updatedAt}</TD>
                <TD className="text-right">
                  <Link href={`/portals/smile-admin/roles/${r.id}/edit`} className={buttonClasses("primary", "outlined", "sm")}><Icon name="edit" size={14} /> Edit</Link>
                </TD>
              </TR>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
