"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Edit, Plus, ShieldCheck, Users2 } from "lucide-react";
import { Badge, statusTone } from "@/components/smile-admin/ui/badge";
import { Button } from "@/components/smile-admin/ui/button";
import { PageHeader } from "@/components/smile-admin/shell/page-header";
import { DataToolbar, SearchField } from "@/components/smile-admin/data/data-toolbar";
import { StatPill } from "@/components/smile-admin/data/stat-pill";
import { Table, TD, TH, THead, TR } from "@/components/smile-admin/ui/table";
import { ROLES } from "@/lib/smile-admin/mock-data";

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
            <Button variant="outline" size="sm" asChild><Link href="/portals/smile-admin/permissions"><ShieldCheck className="h-3.5 w-3.5" /> View permissions</Link></Button>
            <Button size="sm"><Plus className="h-3.5 w-3.5" /> New role</Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-md md:grid-cols-3">
        <StatPill label="Active roles"      value={totals.roles}       icon={ShieldCheck} tone="primary" />
        <StatPill label="Members assigned"  value={totals.members}     icon={Users2}      tone="info" />
        <StatPill label="Permissions / role" value={totals.permissions} icon={ShieldCheck} tone="success" />
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
                  <div className="font-semibold text-foreground">{r.name}</div>
                  <div className="text-label-2 text-foreground-muted">{r.id}</div>
                </TD>
                <TD><Badge tone={r.scope === "Central" ? "primary" : r.scope === "State" ? "info" : r.scope === "District" ? "warning" : "neutral"}>{r.scope}</Badge></TD>
                <TD className="text-right tabular-nums">{r.members.toLocaleString("en-IN")}</TD>
                <TD className="text-right tabular-nums">{r.permissions}</TD>
                <TD><Badge tone={statusTone(r.status)}>{r.status}</Badge></TD>
                <TD className="text-foreground-muted">{r.updatedAt}</TD>
                <TD className="text-right">
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/portals/smile-admin/roles/${r.id}/edit`}><Edit className="h-3.5 w-3.5" /> Edit</Link>
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
