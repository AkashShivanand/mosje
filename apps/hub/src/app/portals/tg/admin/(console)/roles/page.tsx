"use client";

import * as React from "react";
import { ShieldPlus } from "lucide-react";
import { Modal } from "@mosje/design-system";
import { PageHeader, SearchInput, Button, Field, TextInput, Table, EmptyState } from "@/components/tg/ui";
import { useTg } from "@/lib/tg/store/store";
import type { RoleRecord } from "@/lib/tg/store/types";

export default function RolesPage() {
  const { state, hydrated, addRole } = useTg();
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({ role: "", description: "" });

  if (!hydrated) return null;
  if (state.session !== "central-admin")
    return <EmptyState title="Access restricted" hint="Only the Central Admin can manage roles." />;

  const rows = state.roles.filter((r) =>
    [r.role, r.description].some((v) => v.toLowerCase().includes(query.toLowerCase())),
  );

  const columns = [
    { key: "role", header: "Role", render: (r: RoleRecord) => <span className="font-semibold text-ink">{r.role}</span> },
    { key: "description", header: "Role Description", render: (r: RoleRecord) => r.description },
    { key: "actions", header: "Actions", render: () => <span className="text-navy">Edit</span> },
  ];

  function submit(e: React.FormEvent) {
    e.preventDefault();
    addRole(form.role, form.description);
    setForm({ role: "", description: "" });
    setOpen(false);
  }

  return (
    <div>
      <PageHeader
        title="Role Management"
        action={<Button onClick={() => setOpen(true)}><ShieldPlus className="h-4 w-4" /> Add Role</Button>}
      />
      <div className="mb-4 max-w-md">
        <SearchInput placeholder="Search for Roles" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <Table columns={columns} data={rows} caption="Roles" emptyLabel="No roles found." />

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add Role"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" form="add-role-form">Add Role</Button>
          </>
        }
      >
        <form id="add-role-form" className="space-y-4" onSubmit={submit}>
          <Field label="Role" required><TextInput value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required /></Field>
          <Field label="Role Description" required><TextInput value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required /></Field>
        </form>
      </Modal>
    </div>
  );
}
