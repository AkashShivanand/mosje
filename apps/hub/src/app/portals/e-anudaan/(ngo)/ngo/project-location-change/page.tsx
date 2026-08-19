"use client";

import * as React from "react";
import { Button, FormField, Select, Textarea, useToast } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { ngoApplications } from "@/lib/e-anudaan/selectors";

export default function ProjectLocationChangePage() {
  const { state } = useEAnudaan();
  const { toast } = useToast();
  const [project, setProject] = React.useState("");
  const [detail, setDetail] = React.useState("");
  const ngo = state.ngos[0];
  const projects = ngo ? ngoApplications(state, ngo.id) : [];

  const projectOptions = projects.length > 0
    ? projects.map((p) => ({ id: p.id, label: `${p.id} · ${p.projectLabel}` }))
    : [
        { id: "IP/AR/DIB/40040", label: "IP/AR/DIB/40040 · SRCH_50 Residential School" },
        { id: "GIA/2026-27/AVYAY/0182", label: "GIA/2026-27/AVYAY/0182 · Senior Citizen Home Pune" },
      ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !detail.trim()) return;
    toast(`Location change request for project ${project} submitted.`, "success");
    setDetail("");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-ink">Project Location Change</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Request a change to the location of one of your projects. The concerned officer is
          notified and will examine your request.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-line bg-surface p-6 shadow-xs">
        <FormField label="Project" id="project">
          {(control) => (
            <Select {...control} value={project} onChange={(e) => setProject(e.target.value)}>
              <option value="">Select a project…</option>
              {projectOptions.map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </Select>
          )}
        </FormField>
        <FormField label="New project location" id="new-location">
          {(control) => (
            <Textarea
              {...control}
              rows={4}
              placeholder="Enter complete building, street, district, and pin code details..."
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
            />
          )}
        </FormField>
        <Button
          type="submit"
          appearance="filled"
          disabled={!project || !detail.trim()}
        >
          Submit request
        </Button>
      </form>
    </div>
  );
}

