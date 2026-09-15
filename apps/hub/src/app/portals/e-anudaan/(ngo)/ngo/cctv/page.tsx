"use client";

/**
 * CCTV Setup — the NGO end of the e-inspection feature.
 *
 * DS Audit: Button ✅ existing · FormField ✅ · Input ✅ · Select ✅ · Alert ✅ · Card ✅ ·
 * Icon ✅ · useToast ✅ — nothing new.
 *
 * The 1–8 camera range, both optional contact fields and the failure message are from the live
 * screen (walkthrough 2026-08-22, where the dev backend returned the error state).
 *
 * CCTV is set up per PROJECT: an inspecting officer views one centre's feed. The screen said "your
 * centre's CCTV" to an NGO with dozens of projects and never asked which (screen QA, 13 Sep 2026),
 * so the project is chosen first and everything below it — and the activation code — is that
 * project's.
 */

import * as React from "react";
import {
  Alert,
  Button,
  Card,
  CardBody,
  FormField,
  Icon,
  Input,
  PageHeader,
  Select,
  useToast,
} from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { projectName, projectsOf } from "@/lib/e-anudaan/applicant";

type Outcome = { kind: "idle" } | { kind: "saved"; code: string } | { kind: "error" };

/** Deterministic activation code, distinct per project, so the demo reads the same on every run. */
function activationCode(projectId: string, cameras: string): string {
  const n = Number(cameras) || 1;
  const p = Number(projectId.replace(/\D/g, "").slice(-4)) || 0;
  return `EANU-${((4200 + p + n * 37) % 10000).toString().padStart(4, "0")}-${((9100 + p * 3 + n * 13) % 10000).toString().padStart(4, "0")}`;
}

interface Setup {
  cameras: string;
  contact: string;
  mobile: string;
  outcome: Outcome;
}
const BLANK: Setup = { cameras: "", contact: "", mobile: "", outcome: { kind: "idle" } };

export default function CctvSetupPage() {
  const { toast } = useToast();
  const { state } = useEAnudaan();
  const ngo = state.ngos[0];
  const projects = ngo ? projectsOf(state, ngo.id) : [];
  const [projectId, setProjectId] = React.useState("");
  const [setups, setSetups] = React.useState<Record<string, Setup>>({});
  const project = projects.find((p) => p.id === projectId);
  const { cameras, contact, mobile, outcome } = setups[projectId] ?? BLANK;
  const update = (patch: Partial<Setup>) =>
    setSetups((all) => ({ ...all, [projectId]: { ...(all[projectId] ?? BLANK), ...patch } }));
  const setCameras = (v: string) => update({ cameras: v });
  const setContact = (v: string) => update({ contact: v });
  const setMobile = (v: string) => update({ mobile: v });
  const setOutcome = (v: Outcome) => update({ outcome: v });

  const save = () => {
    if (!cameras || !project) return;
    // The live dev backend fails this call; the demo exposes both branches so the error state
    // is reachable — hold Alt while clicking to see it.
    setOutcome({ kind: "saved", code: activationCode(project.id, cameras) });
    toast(`CCTV configuration saved for ${project.id}.`, "success");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <PageHeader
        title="CCTV Setup"
        meta="Configure the CCTV at a project so inspecting officers can view a live feed during an e-inspection. This is done once for each project."
      />

      <Card variant="outlined">
        <CardBody className="space-y-4">
          <FormField label="Project" id="cctv-project" required>
            {(control) => (
              <Select {...control} value={projectId} onChange={(e) => setProjectId(e.target.value)}>
                <option value="">Select the project…</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.id} — {projectName(p)}
                  </option>
                ))}
              </Select>
            )}
          </FormField>

          {project && (
            <>
              <FormField label="Number of cameras" id="cameras" required>
                {(control) => (
                  <Select {...control} value={cameras} onChange={(e) => setCameras(e.target.value)}>
                    <option value="">Select…</option>
                    {Array.from({ length: 8 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={String(n)}>
                        {n} camera{n === 1 ? "" : "s"}
                      </option>
                    ))}
                  </Select>
                )}
              </FormField>

              <FormField label="Contact person (optional)" id="cctv-contact">
                {(control) => (
                  <Input
                    {...control}
                    value={contact}
                    placeholder="Name of the person managing the CCTV computer"
                    onChange={(e) => setContact(e.target.value)}
                  />
                )}
              </FormField>

              <FormField label="Contact mobile (optional)" id="cctv-mobile">
                {(control) => (
                  <Input
                    {...control}
                    type="tel"
                    value={mobile}
                    placeholder="+91-XXXXXXXXXX"
                    onChange={(e) => setMobile(e.target.value)}
                  />
                )}
              </FormField>

              {outcome.kind === "error" && (
                <Alert status="error">
                  Could not start CCTV setup. Please check your connection and try again.
                </Alert>
              )}

              {outcome.kind === "saved" && (
                <Alert status="success" title="CCTV Registered">
                  <p className="text-body-2">
                    Enter this activation code in the recorder software on the CCTV computer at {projectName(project)}.
                  </p>
                  <p className="mt-2 font-mono text-title-1 font-bold text-ink tracking-digits">{outcome.code}</p>
                  <p className="mt-1 text-body-3 text-ink-muted">
                    {cameras} camera{cameras === "1" ? "" : "s"} registered
                    {contact ? ` · contact ${contact}` : ""}
                    {mobile ? ` · ${mobile}` : ""}
                  </p>
                </Alert>
              )}

              <div className="flex flex-wrap gap-2">
                <Button
                  disabled={!cameras}
                  onClick={(e) => (e.altKey ? setOutcome({ kind: "error" }) : save())}
                >
                  <Icon name="videocam" size={16} aria-hidden /> Save and Get Activation Code
                </Button>
                {outcome.kind !== "idle" && (
                  <Button appearance="text" onClick={() => setOutcome({ kind: "idle" })}>
                    Reset
                  </Button>
                )}
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
