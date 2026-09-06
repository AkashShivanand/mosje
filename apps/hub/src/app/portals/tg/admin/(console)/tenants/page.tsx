"use client";

import * as React from "react";
import { Icon, Modal , EmptyState} from "@mosje/design-system";
import { PortalPageHeader, SearchInput, Button, Field, TextInput, Table } from "@/components/tg/ui";
import { useTg } from "@/lib/tg/store/store";
import type { TenantRecord } from "@/lib/tg/store/types";

export default function TenantsPage() {
  const { state, hydrated, addTenant } = useTg();
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({ name: "", description: "" });

  if (!hydrated) return null;
  if (state.session !== "central-admin")
    return <EmptyState title="Access restricted" description="Only the Central Admin can manage tenants." />;

  const rows = state.tenants.filter((t) =>
    [t.name, t.description].some((v) => v.toLowerCase().includes(query.toLowerCase())),
  );

  const columns = [
    { key: "name", header: "Tenant Name", render: (t: TenantRecord) => <span className="font-semibold text-ink">{t.name}</span> },
    { key: "description", header: "Description", render: (t: TenantRecord) => t.description },
    { key: "date", header: "Date", render: (t: TenantRecord) => t.date },
  ];

  function submit(e: React.FormEvent) {
    e.preventDefault();
    addTenant(form.name, form.description);
    setForm({ name: "", description: "" });
    setOpen(false);
  }

  return (
    <div>
      <PortalPageHeader
        title="Tenant Management"
        actions={<Button onClick={() => setOpen(true)}><Icon name="apartment" size={16} /> Add New Tenant</Button>}
      />
      <div className="mb-4 max-w-md">
        <SearchInput placeholder="Search for Tenants" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <Table columns={columns} data={rows} caption="Tenants" emptyLabel="No tenants found." />

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add New Tenant"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" form="add-tenant-form">Add Tenant</Button>
          </>
        }
      >
        <form id="add-tenant-form" className="space-y-4" onSubmit={submit}>
          <Field label="Tenant Name" required><TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></Field>
          <Field label="Description" required><TextInput value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required /></Field>
        </form>
      </Modal>
    </div>
  );
}
