"use client";

import * as React from "react";
import { AdminShell } from "@/components/admin-shell";
import { DataTable } from "@/components/data-table";
import { ADMIN_USERS, USERS_TOTAL } from "@/lib/mock-data";
import type { AdminUser } from "@/lib/types";
import { useToast } from "@/components/toast";
import { Plus, Pencil, Trash2, X } from "lucide-react";

const ROLES: AdminUser["role"][] = ["Admin", "State Nodal Officer", "District Nodal Officer"];

const inputCls =
  "w-full rounded-lg border border-line px-3 py-2 text-sm text-ink placeholder:text-ink-hint focus:border-navy/40 focus:outline-none focus:ring-2 focus:ring-navy/15";

function AddUserModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { toast } = useToast();
  const [form, setForm] = React.useState({ name: "", mobile: "", email: "", role: ROLES[1] as AdminUser["role"] });

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast("User added successfully.", "success");
    setForm({ name: "", mobile: "", email: "", role: ROLES[1] });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-labelledby="add-user-title">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 id="add-user-title" className="text-base font-bold text-ink">Add User</h2>
          <button onClick={onClose} aria-label="Close" className="rounded p-1 text-ink-hint hover:bg-black/5"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
          <div>
            <label htmlFor="user-name" className="mb-1 block text-sm font-medium text-ink">Name</label>
            <input id="user-name" required placeholder="Full name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputCls} />
          </div>
          <div>
            <label htmlFor="user-mobile" className="mb-1 block text-sm font-medium text-ink">Mobile</label>
            <input id="user-mobile" type="tel" inputMode="numeric" maxLength={10} required placeholder="10-digit mobile" value={form.mobile} onChange={e => setForm(f => ({ ...f, mobile: e.target.value.replace(/\D/g, "") }))} className={inputCls} />
          </div>
          <div>
            <label htmlFor="user-email" className="mb-1 block text-sm font-medium text-ink">Email</label>
            <input id="user-email" type="email" required placeholder="Email address" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={inputCls} />
          </div>
          <div>
            <label htmlFor="user-role" className="mb-1 block text-sm font-medium text-ink">Role</label>
            <select id="user-role" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as AdminUser["role"] }))} className={inputCls}>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink hover:bg-surface-muted">Cancel</button>
            <button type="submit" className="flex-1 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-800">Add User</button>
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
      key: "name" as const,
      header: "Actions",
      render: () => (
        <div className="flex items-center gap-2">
          <button onClick={() => toast("Action coming soon.", "info")} aria-label="Edit user" className="rounded p-1 text-ink-hint hover:bg-black/5">
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => toast("Action coming soon.", "info")} aria-label="Delete user" className="rounded p-1 text-red-400 hover:bg-red-50">
            <Trash2 className="h-3.5 w-3.5" />
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
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-800"
        >
          <Plus className="h-4 w-4" />
          Add User
        </button>
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
