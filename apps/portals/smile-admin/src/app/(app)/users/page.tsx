"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { UserPlus, Users2 } from "lucide-react";
import { Badge, statusTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shell/page-header";
import { DataToolbar, SearchField } from "@/components/data/data-toolbar";
import { StatPill } from "@/components/data/stat-pill";
import { Table, TD, TH, THead, TR } from "@/components/ui/table";
import { APP_USERS, type AppUser } from "@/lib/mock-data";
import { ExportMenu } from "@/components/data/export-menu";
import { initials } from "@/lib/utils";

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<string>("All roles");
  const [status, setStatus] = useState<string>("All statuses");

  const users = useMemo(
    () => APP_USERS.filter(
      (u) =>
        (!search || `${u.name} ${u.email} ${u.mobile}`.toLowerCase().includes(search.toLowerCase())) &&
        (role === "All roles" || u.role === role) &&
        (status === "All statuses" || u.status === status)
    ),
    [search, role, status]
  );

  const counts = useMemo(() => ({
    total: users.length,
    active: users.filter((u) => u.status === "Active").length,
    invited: users.filter((u) => u.status === "Invited").length,
  }), [users]);

  const ROLES = ["All roles", ...Array.from(new Set(APP_USERS.map((u) => u.role)))];

  return (
    <div className="space-y-lg">
      <PageHeader
        breadcrumbs={[{ label: "Access Control" }, { label: "Users" }]}
        eyebrow="Access control"
        title="Users"
        subtitle="Manage portal access for state, district, and field operations staff."
        actions={
          <div className="flex items-center gap-sm">
            <ExportMenu
              filename="smile-users"
              title="Users"
              subtitle="Portal users with roles and scope."
              columns={[
                { header: "S.No", accessor: (r: AppUser & { sno: number }) => r.sno },
                { header: "Name", accessor: "name" },
                { header: "Email ID", accessor: "email" },
                { header: "Mobile", accessor: "mobile" },
                { header: "Role", accessor: "role" },
                { header: "State", accessor: (r) => r.state ?? "—" },
                { header: "District", accessor: (r) => r.district ?? "—" },
                { header: "Last Login", accessor: "lastLogin" },
                { header: "Status", accessor: "status" },
              ]}
              rows={users.map((u, i) => ({ ...u, sno: i + 1 }))}
            />
            <Button size="sm" asChild>
              <Link href="/users/onboard">
                <UserPlus className="h-3.5 w-3.5" /> Onboard user
              </Link>
            </Button>
          </div>
        }
      />
      <div className="grid grid-cols-2 gap-md md:grid-cols-3">
        <StatPill label="Loaded users" value={counts.total}   icon={Users2} tone="primary" />
        <StatPill label="Active"        value={counts.active}  icon={Users2} tone="success" />
        <StatPill label="Invited"       value={counts.invited} icon={Users2} tone="info" />
      </div>

      <DataToolbar>
        <SearchField placeholder="Search name / email / mobile…" value={search} onChange={setSearch} />
        <select className="h-10 rounded-md border border-stroke-300 bg-white px-md text-body-2 shadow-xs hover:border-stroke-400 focus:border-primary" value={role} onChange={(e) => setRole(e.target.value)}>
          {ROLES.map((r) => <option key={r}>{r}</option>)}
        </select>
        <select className="h-10 rounded-md border border-stroke-300 bg-white px-md text-body-2 shadow-xs hover:border-stroke-400 focus:border-primary" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>All statuses</option>
          <option>Active</option>
          <option>Invited</option>
          <option>Suspended</option>
        </select>
      </DataToolbar>

      {/* Mobile cards */}
      <ul className="space-y-sm md:hidden">
        {users.map((u) => (
          <li
            key={u.id}
            className="rounded-lg border border-stroke-200 bg-white p-md shadow-xs"
          >
            <div className="flex items-start gap-md">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-primary text-label-1 font-bold text-white shadow-xs ring-1 ring-inset ring-primary-700/30">
                {initials(u.name)}
              </div>
              <div className="min-w-0 flex-1 space-y-0.5">
                <div className="flex items-start justify-between gap-sm">
                  <div className="min-w-0">
                    <div className="truncate font-semibold text-foreground">{u.name}</div>
                    <div className="truncate text-label-3 text-foreground-muted">
                      {u.email}
                    </div>
                  </div>
                  <Badge tone={statusTone(u.status)} withDot>
                    {u.status}
                  </Badge>
                </div>
                <div className="text-label-3 text-foreground-hint">
                  <span className="font-mono">{u.mobile}</span>
                  <span aria-hidden> · </span>
                  <span>{u.role}</span>
                </div>
                <div className="text-label-3 text-foreground-hint">
                  {u.state}
                  {u.district ? ` / ${u.district}` : ""} · Last seen{" "}
                  <span className="font-mono">{u.lastLogin}</span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-lg border border-stroke-200 bg-white shadow-xs md:block">
        <Table>
          <THead>
            <tr>
              <TH>User</TH>
              <TH>Mobile</TH>
              <TH>Role</TH>
              <TH>Scope</TH>
              <TH>Status</TH>
              <TH>Last login</TH>
            </tr>
          </THead>
          <tbody>
            {users.map((u) => (
              <TR key={u.id}>
                <TD>
                  <div className="flex items-center gap-md">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary text-label-1 font-bold text-white shadow-xs ring-1 ring-inset ring-primary-700/30">
                      {initials(u.name)}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate font-semibold text-foreground">{u.name}</div>
                      <div className="truncate text-label-2 text-foreground-muted">
                        {u.email}
                      </div>
                    </div>
                  </div>
                </TD>
                <TD className="font-mono text-body-3 text-foreground-muted">{u.mobile}</TD>
                <TD>{u.role}</TD>
                <TD>{u.state}{u.district ? ` / ${u.district}` : ""}</TD>
                <TD>
                  <Badge tone={statusTone(u.status)} withDot>
                    {u.status}
                  </Badge>
                </TD>
                <TD className="text-foreground-muted">{u.lastLogin}</TD>
              </TR>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
