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

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-ink">Project Location Change</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Request a change to the location of one of your projects. The concerned officer is
          notified and will examine your request.
        </p>
      </div>

      <section className="space-y-4 rounded-xl border border-line bg-surface p-5">
        <FormField label="Project" id="project">
          {(control) => (
            <Select {...control} value={project} onChange={(e) => setProject(e.target.value)}>
              <option value="">Select a project…</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.id} · {p.projectLabel}</option>
              ))}
            </Select>
          )}
        </FormField>
        <FormField label="New project location" id="new-location">
          {(control) => (
            <Textarea {...control} rows={4} value={detail} onChange={(e) => setDetail(e.target.value)} />
          )}
        </FormField>
        <Button
          disabled={!project || !detail.trim()}
          onClick={() => toast("Change request submitted (demo).", "success")}
        >
          Submit request
        </Button>
      </section>
    </div>
  );
}
