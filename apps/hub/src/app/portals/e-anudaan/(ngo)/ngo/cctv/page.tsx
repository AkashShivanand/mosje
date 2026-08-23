"use client";

/**
 * CCTV Setup — the NGO end of the e-inspection feature.
 *
 * DS Audit: Button ✅ existing · FormField ✅ · Input ✅ · Select ✅ · Alert ✅ · Badge ✅ ·
 * Icon ✅ · useToast ✅ — nothing new.
 *
 * Copy, the 1–8 camera range, both optional contact fields and the failure message are verbatim
 * from the live screen (walkthrough 2026-08-22, where the dev backend returned the error state).
 */

import * as React from "react";
import { Alert, Button, FormField, Icon, Input, Select, useToast } from "@mosje/design-system";

type Outcome = { kind: "idle" } | { kind: "saved"; code: string } | { kind: "error" };

/** Deterministic activation code so the demo reads the same on every run. */
function activationCode(cameras: string): string {
  const n = Number(cameras) || 1;
  return `EANU-${(4200 + n * 37).toString().padStart(4, "0")}-${(9100 + n * 13).toString().padStart(4, "0")}`;
}

export default function CctvSetupPage() {
  const { toast } = useToast();
  const [cameras, setCameras] = React.useState("");
  const [contact, setContact] = React.useState("");
  const [mobile, setMobile] = React.useState("");
  const [outcome, setOutcome] = React.useState<Outcome>({ kind: "idle" });

  const save = () => {
    if (!cameras) return;
    // The live dev backend fails this call; the demo exposes both branches so the error state
    // is reachable — hold Alt while clicking to see it.
    setOutcome({ kind: "saved", code: activationCode(cameras) });
    toast("CCTV configuration saved.", "success");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <header>
        <h1 className="text-2xl font-bold text-ink">CCTV Setup</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Configure your centre&apos;s CCTV so inspecting officers can view a live feed during an
          e-inspection. <strong>You do this once.</strong>
        </p>
      </header>

      <section className="space-y-4 rounded-xl border border-line bg-surface p-5">
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
              placeholder="Name of the person managing the CCTV PC"
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
          <Alert status="success" title="CCTV registered">
            <p className="text-sm">
              Enter this activation code in the recorder software on your centre&apos;s CCTV PC.
            </p>
            <p className="mt-2 font-mono text-lg font-bold tracking-widest text-ink">{outcome.code}</p>
            <p className="mt-1 text-xs text-ink-muted">
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
            <Icon name="videocam" size={16} aria-hidden /> Save &amp; get activation code
          </Button>
          {outcome.kind !== "idle" && (
            <Button appearance="text" onClick={() => setOutcome({ kind: "idle" })}>
              Reset
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
