"use client";

/**
 * Project Location Change — the applicant asks the Ministry to move a sanctioned project.
 *
 * DS Audit: Button ✅ existing · FormField ✅ · Select ✅ · Textarea ✅ · Icon ✅ · Alert ✅ ·
 * useToast ✅ — nothing new.
 *
 * The live screen carries two 500-character counters and a browser-geolocation capture button
 * between them; all three are reproduced here, with copy verbatim from the walkthrough.
 */

import * as React from "react";
import { Alert, Button, FormField, Icon, Select, Textarea, useToast } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { ngoApplications } from "@/lib/e-anudaan/selectors";

const MAX = 500;

export default function ProjectLocationChangePage() {
  const { state } = useEAnudaan();
  const { toast } = useToast();
  const ngo = state.ngos[0];

  /** One option per institution, labelled as the live select does. */
  const projectOptions = React.useMemo(() => {
    if (!ngo) return [];
    const seen = new Map<string, string>();
    for (const a of ngoApplications(state, ngo.id)) {
      if (!seen.has(a.institutionId)) {
        const label = a.projectLabel.split(" · ")[0] ?? a.projectLabel;
        seen.set(a.institutionId, `${a.institutionId} — ${label} · last applied FY ${a.financialYear}`);
      }
    }
    return [...seen.entries()].map(([id, label]) => ({ id, label }));
  }, [state, ngo]);

  const [project, setProject] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [reason, setReason] = React.useState("");
  const [coords, setCoords] = React.useState<string | null>(null);
  const [capturing, setCapturing] = React.useState(false);

  const capture = () => {
    if (!navigator.geolocation) {
      toast("This browser cannot capture coordinates.", "error");
      return;
    }
    setCapturing(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords(`${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}`);
        setCapturing(false);
        toast("Coordinates captured.", "success");
      },
      () => {
        setCapturing(false);
        toast("Could not read your location. Enter the address instead.", "error");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !location.trim() || !reason.trim()) return;
    toast(`Location change request for ${project} submitted.`, "success");
    setLocation("");
    setReason("");
    setCoords(null);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <header>
        <h1 className="text-headline-1 text-ink">Project Location Change</h1>
        <p className="mt-1 text-body-2 text-ink-muted">
          Request a change to the location of one of your projects. The concerned officer is
          notified and will examine your request.
        </p>
      </header>

      <form onSubmit={submit} className="space-y-5 rounded-xl border border-line bg-surface p-6 shadow-xs">
        <FormField label="Project" id="project" required>
          {(control) => (
            <Select {...control} value={project} onChange={(e) => setProject(e.target.value)}>
              <option value="">Select a project…</option>
              {projectOptions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </Select>
          )}
        </FormField>

        <div>
          <FormField label="New project location (full address)" id="new-location" required>
            {(control) => (
              <Textarea
                {...control}
                rows={4}
                maxLength={MAX}
                value={location}
                placeholder="House / building, street, locality, city, district, State, PIN"
                onChange={(e) => setLocation(e.target.value)}
              />
            )}
          </FormField>
          <p className="mt-1 text-body-3 text-ink-hint">
            {location.length} / {MAX} characters
          </p>
        </div>

        <div className="space-y-2">
          <Button type="button" appearance="outlined" onClick={capture} disabled={capturing}>
            <Icon name="my_location" size={16} aria-hidden />
            {capturing ? "Capturing…" : "Capture new-location coordinates (optional)"}
          </Button>
          {coords && (
            <Alert status="success">
              Coordinates captured: <span className="font-mono">{coords}</span>
            </Alert>
          )}
        </div>

        <div>
          <FormField label="Reason for the change" id="reason" required>
            {(control) => (
              <Textarea
                {...control}
                rows={3}
                maxLength={MAX}
                value={reason}
                placeholder="e.g. the rented building's lease has ended and the home has moved"
                onChange={(e) => setReason(e.target.value)}
              />
            )}
          </FormField>
          <p className="mt-1 text-body-3 text-ink-hint">
            {reason.length} / {MAX} characters
          </p>
        </div>

        <Button type="submit" disabled={!project || !location.trim() || !reason.trim()}>
          Submit request
        </Button>
      </form>
    </div>
  );
}
