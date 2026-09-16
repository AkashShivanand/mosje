"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { statusTone } from "@/lib/smile-admin/status-tone";
import { SmilePageHeader } from "@/components/smile-admin/shell/page-header";
import { DataToolbar, SearchField } from "@/components/smile-admin/data/data-toolbar";
import { StatPill } from "@/components/smile-admin/data/stat-pill";
import { APP_USERS, type AppUser } from "@/lib/smile-admin/mock-data";
import { ExportMenu } from "@/components/smile-admin/data/export-menu";
import { initials } from "@/lib/smile-admin/utils";
import { Badge, DataTable, Icon, buttonClasses, type DataTableColumn } from "@mosje/design-system";

const COLUMNS: DataTableColumn<AppUser & Record<string, unknown>>[] = [
  {
    key: "name",
    header: "User",
    sortable: true,
    render: (u) => (
      <div className="flex items-center gap-md">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary text-label-1 font-bold text-white shadow-xs ring-1 ring-inset ring-primary-700/30">
          {initials(u.name)}
        </div>
        <div className="min-w-0">
          {/* Semibold, which is what lets a reader scan the column
              (SMB-SUPER-ADMIN-USERS-002). */}
          <div className="truncate font-semibold text-ink">{u.name}</div>
          <div className="truncate text-label-2 text-ink-muted">{u.email}</div>
        </div>
      </div>
    ),
    exportValue: (u) => `${u.name} <${u.email}>`,
  },
  { key: "mobile", header: "Mobile", className: "font-mono text-body-2 text-ink-muted" },
  { key: "role", header: "Role", sortable: true },
  {
    key: "state",
    header: "Scope",
    sortable: true,
    render: (u) => `${u.state}${u.district ? ` / ${u.district}` : ""}`,
    exportValue: (u) => `${u.state}${u.district ? ` / ${u.district}` : ""}`,
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (u) => (
      <Badge status={statusTone(u.status)} dot>
        {u.status}
      </Badge>
    ),
    exportValue: (u) => u.status,
  },
  { key: "lastLogin", header: "Last login", sortable: true, className: "text-ink-muted" },
];

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
      <SmilePageHeader
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
            <Link href="/portals/smile-admin/users/onboard" className={buttonClasses("primary", "filled", "sm")}>
                <Icon name="person_add" size={14} /> Onboard user
              </Link>
          </div>
        }
      />
      <div className="grid grid-cols-2 gap-md md:grid-cols-3">
        <StatPill label="Loaded users" value={counts.total}   icon="groups" tone="primary" />
        <StatPill label="Active"        value={counts.active}  icon="groups" tone="success" />
        <StatPill label="Invited"       value={counts.invited} icon="groups" tone="info" />
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
                    <div className="truncate font-semibold text-ink">{u.name}</div>
                    <div className="truncate text-body-3 text-ink-muted">
                      {u.email}
                    </div>
                  </div>
                  <Badge status={statusTone(u.status)} dot>
                    {u.status}
                  </Badge>
                </div>
                <div className="text-body-3 text-ink-hint">
                  <span className="font-mono">{u.mobile}</span>
                  <span aria-hidden> · </span>
                  <span>{u.role}</span>
                </div>
                <div className="text-body-3 text-ink-hint">
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
      <div className="hidden rounded-lg border border-stroke-200 bg-white p-md shadow-xs md:block">
        <DataTable
          columns={COLUMNS}
          data={users as Array<AppUser & Record<string, unknown>>}
          total={users.length}
          caption="Portal users, their role, scope and sign-in status"
          emptyLabel="No user matches these filters."
        />
      </div>
    </div>
  );
}
