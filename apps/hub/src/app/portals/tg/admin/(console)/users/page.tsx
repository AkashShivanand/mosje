"use client";

import * as React from "react";
import { Badge, Icon, Modal , EmptyState} from "@mosje/design-system";
import { PortalPageHeader, SearchInput, Button, Field, TextInput, Select, Table } from "@/components/tg/ui";
import { useTg } from "@/lib/tg/store/store";
import { STATES } from "@/lib/tg/states";
import type { UserRecord } from "@/lib/tg/store/types";

const ROLE_OPTIONS = [
  "District magistrate/district collector",
  "Examining Authority/state",
  "Checker/verifying officer",
  "Admin",
];

export default function UsersPage() {
  const { state, hydrated, addUser, toggleUser } = useTg();
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({ name: "", mobile: "", email: "", role: ROLE_OPTIONS[0] ?? "", jurisdiction: STATES[0] ?? "" });

  if (!hydrated) return null;
  if (state.session !== "central-admin")
    return <EmptyState title="Access restricted" description="Only the Central Admin can manage users." />;

  const rows = state.users.filter((u) =>
    [u.name, u.email, u.mobile, u.role, u.jurisdiction].some((v) => v.toLowerCase().includes(query.toLowerCase())),
  );

  const columns = [
    { key: "name", header: "Name", render: (u: UserRecord) => u.name },
    { key: "mobile", header: "Mobile Number", render: (u: UserRecord) => <span className="font-mono">{u.mobile}</span> },
    { key: "email", header: "Email Address", render: (u: UserRecord) => u.email },
    { key: "role", header: "Role", render: (u: UserRecord) => u.role },
    { key: "jurisdiction", header: "Jurisdiction", render: (u: UserRecord) => u.jurisdiction },
    { key: "status", header: "Status", render: (u: UserRecord) => <Badge status={u.active ? "success" : "neutral"}>{u.active ? "Active" : "Disabled"}</Badge> },
    {
      key: "actions",
      header: "Actions",
      render: (u: UserRecord) => (
        <button type="button" onClick={() => toggleUser(u.id)} className="font-semibold text-navy hover:underline">
          {u.active ? "Disable" : "Enable"}
        </button>
      ),
    },
  ];

  function submit(e: React.FormEvent) {
    e.preventDefault();
    addUser({ name: form.name, mobile: form.mobile, email: form.email, role: form.role, jurisdiction: `State - ${form.jurisdiction}` });
    setForm({ name: "", mobile: "", email: "", role: ROLE_OPTIONS[0] ?? "", jurisdiction: STATES[0] ?? "" });
    setOpen(false);
  }

  return (
    <div>
      <PortalPageHeader
        title="User Management"
        actions={<Button onClick={() => setOpen(true)}><Icon name="person_add" size={16} /> Add User</Button>}
      />
      <div className="mb-4 max-w-md">
        <SearchInput placeholder="Search for Users" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <Table columns={columns} data={rows} caption="Users" emptyLabel="No users found." />

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add User"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" form="add-user-form">Add User</Button>
          </>
        }
      >
        <form id="add-user-form" className="space-y-4" onSubmit={submit}>
          <Field label="Name" required><TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></Field>
          <Field label="Mobile Number" required><TextInput inputMode="numeric" maxLength={10} value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} required /></Field>
          <Field label="Email Address" required><TextInput type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></Field>
          <Field label="Role">
            <Select options={ROLE_OPTIONS} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
          </Field>
          <Field label="Jurisdiction (State)">
            <Select options={STATES} value={form.jurisdiction} onChange={(e) => setForm({ ...form, jurisdiction: e.target.value })} />
          </Field>
        </form>
      </Modal>
    </div>
  );
}
