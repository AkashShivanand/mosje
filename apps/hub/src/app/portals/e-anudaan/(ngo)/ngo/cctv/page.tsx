"use client";

import * as React from "react";
import { Button, FormField, Select, useToast } from "@mosje/design-system";

/** Copy verbatim from the live CCTV Setup screen (§11) — the NGO end of the e-inspection feature. */
export default function CctvSetupPage() {
  const { toast } = useToast();
  const [cameras, setCameras] = React.useState("");

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-ink">CCTV Setup</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Configure your centre&apos;s CCTV so inspecting officers can view a live feed during an
          e-inspection. <strong>You do this once.</strong>
        </p>
      </div>
      <section className="space-y-4 rounded-xl border border-line bg-surface p-5">
        <FormField label="Number of cameras" id="cameras">
          {(control) => (
            <Select {...control} value={cameras} onChange={(e) => setCameras(e.target.value)}>
              <option value="">Select…</option>
              {Array.from({ length: 8 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={String(n)}>{n} camera{n === 1 ? "" : "s"}</option>
              ))}
            </Select>
          )}
        </FormField>
        <Button disabled={!cameras} onClick={() => toast("CCTV configuration saved (demo).", "success")}>
          Save configuration
        </Button>
      </section>
    </div>
  );
}
