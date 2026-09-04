"use client";

import * as React from "react";
import { Badge, Icon, Modal } from "@mosje/design-system";
import { Card, Button, Field, TextInput, Textarea, Select, EmptyState } from "@/components/tg/ui";
import { useTg } from "@/lib/tg/store/store";
import { GRIEVANCE_CATEGORIES } from "@/lib/tg/states";
import type { Grievance } from "@/lib/tg/store/types";

const STATUS_TONE: Record<Grievance["status"], "warning" | "info" | "success"> = {
  OPEN: "warning",
  IN_PROGRESS: "info",
  RESOLVED: "success",
};
const STATUS_LABEL: Record<Grievance["status"], string> = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
};

export default function GrievancesPage() {
  const { state, hydrated, createGrievance } = useTg();
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({ subject: "", category: GRIEVANCE_CATEGORIES[0] as string, detail: "" });

  if (!hydrated) return null;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    createGrievance(form.subject, form.category, form.detail);
    setForm({ subject: "", category: GRIEVANCE_CATEGORIES[0], detail: "" });
    setOpen(false);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-headline-1 text-ink">Grievances</h1>
          <p className="mt-1 text-body-2 text-ink-muted">Raise and track issues with your application or welfare access.</p>
        </div>
        <Button onClick={() => setOpen(true)}><Icon name="add_comment" size={16} /> Raise Grievance</Button>
      </div>

      {state.grievances.length === 0 ? (
        <EmptyState title="No grievances yet" hint="Raise a grievance if you need help with your application." />
      ) : (
        <div className="space-y-3">
          {state.grievances.map((g) => (
            <Card key={g.id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-title-2 text-ink">{g.subject}</h3>
                  <p className="mt-1 text-body-2 text-ink-muted">{g.detail}</p>
                  <p className="mt-2 text-body-3 text-ink-hint">
                    {g.category} • {new Date(g.raisedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <Badge status={STATUS_TONE[g.status]}>{STATUS_LABEL[g.status]}</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Raise a Grievance"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" form="grievance-form">Submit</Button>
          </>
        }
      >
        <form id="grievance-form" className="space-y-4" onSubmit={submit}>
          <Field label="Subject" required>
            <TextInput value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
          </Field>
          <Field label="Category">
            <Select options={GRIEVANCE_CATEGORIES} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          </Field>
          <Field label="Details" required>
            <Textarea rows={4} value={form.detail} onChange={(e) => setForm({ ...form, detail: e.target.value })} required />
          </Field>
        </form>
      </Modal>
    </div>
  );
}
