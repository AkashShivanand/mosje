"use client";

import * as React from "react";
import { AdminShell } from "@/components/nmba/admin-shell";
import { DataTable } from "@/components/nmba/data-table";
import { ADMIN_USERS, USERS_TOTAL } from "@/lib/nmba/mock-data";
import type { AdminUser } from "@/lib/nmba/types";
import { useToast } from "@/components/nmba/toast";
import { Button, FormField, Icon, Input, Select } from "@mosje/design-system";

const ROLES: AdminUser["role"][] = ["Admin", "State Nodal Officer", "District Nodal Officer"];

function AddUserModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { toast } = useToast();
  const [form, setForm] = React.useState({ name: "", mobile: "", email: "", role: ROLES[1] as AdminUser["role"] });

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast("User added successfully.", "success");
    setForm({ name: "", mobile: "", email: "", role: ROLES[1] as AdminUser["role"] });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-labelledby="add-user-title">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 id="add-user-title" className="text-base font-bold text-ink">Add User</h2>
          <button onClick={onClose} aria-label="Close" className="rounded p-1 text-ink-hint hover:bg-black/5">
            <Icon name="close" size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
          <FormField label="Name" id="user-name" required>
            {(control) => (
              <Input {...control} required placeholder="Full name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            )}
          </FormField>
          <FormField label="Mobile" id="user-mobile" required>
            {(control) => (
              <Input {...control} type="tel" inputMode="numeric" maxLength={10} required placeholder="10-digit mobile" value={form.mobile} onChange={e => setForm(f => ({ ...f, mobile: e.target.value.replace(/\D/g, "") }))} />
            )}
          </FormField>
          <FormField label="Email" id="user-email" required>
            {(control) => (
              <Input {...control} type="email" required placeholder="Email address" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            )}
          </FormField>
          <FormField label="Role" id="user-role" required>
            {(control) => (
              <Select {...control} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as AdminUser["role"] }))}>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </Select>
            )}
          </FormField>
          <div className="flex gap-3 pt-2">
            <Button type="button" appearance="outlined" onClick={onClose} style={{ flex: 1 }}>Cancel</Button>
            <Button type="submit" style={{ flex: 1 }}>Add User</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

const columns = [
  { key: "name" as const, header: "Name" },
  { key: "mobile" as const, header: "Mobile" },
  { key: "email" as const, header: "Email" },
  {
    key: "role" as const,
    header: "Role",
    render: (row: AdminUser) => (
      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
        row.role === "Admin" ? "bg-navy/10 text-navy"
          : row.role === "State Nodal Officer" ? "bg-approve/10 text-approve"
          : "bg-await/10 text-await"
      }`}>
        {row.role}
      </span>
    ),
  },
];

export default function UserManagementPage() {
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = React.useState(false);

  const columnsWithActions = [
    ...columns,
    {
      key: "actions" as const,
      header: "Actions",
      render: () => (
        <div className="flex items-center gap-2">
          <button onClick={() => toast("Action coming soon.", "info")} aria-label="Edit user" className="rounded p-1 text-ink-hint hover:bg-black/5">
            <Icon name="edit" size={14} />
          </button>
          <button onClick={() => toast("Action coming soon.", "info")} aria-label="Delete user" className="rounded p-1 text-red-400 hover:bg-red-50">
            <Icon name="delete" size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminShell>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-ink">User Management</h1>
          <p className="mt-1 text-sm text-ink-muted">{USERS_TOTAL.toLocaleString("en-IN")} registered users</p>
        </div>
        <Button onClick={() => setModalOpen(true)} iconLeft={<Icon name="add" size={16} />}>
          Add User
        </Button>
      </div>

      <DataTable<AdminUser>
        data={ADMIN_USERS}
        columns={columnsWithActions}
        caption="NMBA User Management"
        total={USERS_TOTAL}
      />

      <AddUserModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </AdminShell>
  );
}
