"use client";

import * as React from "react";
import { Icon, Modal, Select, Button } from "@mosje/design-system";
import { PortalPageHeader, SearchInput, Field, TextInput } from "@/components/nhapoa/ui";
import { useNhapoa } from "@/lib/nhapoa/store/store";
import { ROLES } from "@/lib/nhapoa/roles";
import type { RoleId } from "@/lib/nhapoa/store/types";

const ROLE_OPTIONS = Object.values(ROLES).map((r) => r.label);
const LABEL_TO_ID = Object.fromEntries(Object.values(ROLES).map((r) => [r.label, r.id])) as Record<string, RoleId>;

export default function UsersPage() {
  const { state, addUser, toggleUser } = useNhapoa();
  const [q, setQ] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [roleLabel, setRoleLabel] = React.useState("");
  const [district, setDistrict] = React.useState("");

  const rows = state.users.filter((u) => !q.trim() || u.name.toLowerCase().includes(q.toLowerCase()) || u.username.toLowerCase().includes(q.toLowerCase()) || u.role.toLowerCase().includes(q.toLowerCase()));

  function submit() {
    const role = LABEL_TO_ID[roleLabel];
    if (!name || !username || !role) return;
    addUser({ name, username, role, district: district || undefined, active: true });
    setOpen(false); setName(""); setUsername(""); setRoleLabel(""); setDistrict("");
  }

  return (
    <div>
      <PortalPageHeader title="User Management" meta="Create and manage system users" actions={<Button onClick={() => setOpen(true)}><Icon name="person_add" size={16} /> Create New User</Button>} />
      <SearchInput placeholder="Search by name, username, role…" value={q} onChange={(e) => setQ(e.target.value)} className="mb-4 max-w-2xl" />

      <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-card">
        <table className="w-full min-w-[760px] text-left text-body-2">
          <thead>
            <tr className="border-b border-line text-label-3 uppercase text-ink-hint">
              <th className="px-5 py-3.5 font-semibold">Name / ID</th>
              <th className="px-5 py-3.5 font-semibold">Role</th>
              <th className="px-5 py-3.5 font-semibold">District / State</th>
              <th className="px-5 py-3.5 font-semibold">Status</th>
              <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((u) => (
              <tr key={u.id} className="hover:bg-surface-muted/60">
                <td className="px-5 py-4"><div className="font-medium text-ink">{u.name}</div><div className="font-mono text-body-3 text-ink-hint">{u.username}</div></td>
                <td className="px-5 py-4 text-ink">{ROLES[u.role as Exclude<RoleId, "citizen">]?.label ?? u.role}</td>
                <td className="px-5 py-4 text-ink-muted">{[u.district, u.state].filter(Boolean).join(", ") || "—"}</td>
                <td className="px-5 py-4"><span className={`inline-flex rounded-full px-2.5 py-0.5 text-label-2 font-semibold ${u.active ? "bg-approve-bg text-approve-fg" : "bg-slate-100 text-slate-500"}`}>{u.active ? "Active" : "Disabled"}</span></td>
                <td className="px-5 py-4 text-right"><button type="button" onClick={() => toggleUser(u.id)} className="rounded-lg border border-line px-3 py-1.5 text-label-2 font-semibold text-navy hover:bg-navy/5">{u.active ? "Disable" : "Enable"}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        size="sm"
        title="Create New User"
        footer={<div className="flex justify-end gap-2"><Button appearance="outlined" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={submit} disabled={!name || !username || !roleLabel}>Create User</Button></div>}
      >
        <div className="space-y-4">
          <Field label="Full Name" required><TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="Officer name" /></Field>
          <Field label="Username" required><TextInput value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g. ba.newofficer" /></Field>
          <Field label="Role" required><Select options={[...ROLE_OPTIONS].map((value) => ({ value, label: value }))} placeholder="Select role" value={roleLabel} onChange={(e) => setRoleLabel(e.target.value)} /></Field>
          <Field label="District / State"><TextInput value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="e.g. Lucknow" /></Field>
        </div>
      </Modal>
    </div>
  );
}
