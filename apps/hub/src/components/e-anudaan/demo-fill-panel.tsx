"use client";

/**
 * The demo dock's "Fill" tab for the e-Anudaan grant wizard.
 *
 * DS Audit: Button ✅ existing · Badge ✅ existing — nothing new needed.
 *
 * The dock's Sign in tab is the precedent: a reviewer should not have to type forty answers
 * and upload twelve documents to reach the screen they came to look at. Each button below
 * puts the wizard into one state a real applicant can be in and moves to the step where that
 * state is visible.
 *
 * It talks to the wizard by a window event rather than by writing sessionStorage alone,
 * because the wizard reads its draft in a lazy state initialiser — storage written after
 * mount would not be seen until a reload, and a demo control that needs a refresh to take
 * effect will be read as broken.
 */

import * as React from "react";
import { useRouter } from "next/navigation";
import { Badge, Button } from "@mosje/design-system";
import { wizardFor } from "@/lib/e-anudaan/form-schema";
import {
  buildScenario,
  DEMO_FILL_EVENT,
  DEMO_SCENARIOS,
  routeForScenario,
} from "@/lib/e-anudaan/demo-scenarios";

/** `/portals/e-anudaan/apply-grant/scheme/AVYAY/step-1` → `AVYAY`. */
export function schemeFromPath(pathname: string | null): string | null {
  return /\/apply-grant\/scheme\/([A-Za-z0-9_]+)/.exec(pathname ?? "")?.[1]?.toUpperCase() ?? null;
}

export function DemoFillPanel({ pathname }: { pathname: string | null }) {
  const [applied, setApplied] = React.useState<string | null>(null);
  const router = useRouter();
  const scheme = schemeFromPath(pathname);
  const def = wizardFor(scheme ?? undefined);

  if (!def) {
    return (
      <p className="text-body-2 text-ink-muted">
        Open a grant application to use these. They fill the wizard for one scheme, and the
        scheme is taken from the address.
      </p>
    );
  }

  const run = (id: string) => {
    // Fill first, then move. The wizard applies the payload wherever it is mounted, so the
    // push lands on a step that already holds the scenario's answers rather than on one that
    // fills in a frame's time.
    window.dispatchEvent(new CustomEvent(DEMO_FILL_EVENT, { detail: buildScenario(id, def) }));
    router.push(routeForScenario(id, def.code));
    setApplied(id);
  };

  return (
    <div className="space-y-3">
      <p className="text-body-2 text-ink-muted">
        Puts the <strong>{def.code}</strong> application into one state and moves to the step
        where it shows. Answers and documents are illustrative demo data.
      </p>

      <ul className="space-y-2">
        {DEMO_SCENARIOS.map((s) => (
          <li key={s.id} className="rounded-lg border border-line p-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-label-2 text-ink">{s.label}</span>
              <div className="flex items-center gap-2">
                {applied === s.id && <Badge status="success">Applied</Badge>}
                <Button appearance="outlined" size="sm" onClick={() => run(s.id)}>
                  Apply
                </Button>
              </div>
            </div>
            <p className="mt-1 text-body-3 text-ink-muted">{s.effect}</p>
          </li>
        ))}
      </ul>

      <p className="text-body-3 text-ink-muted">
        Sample documents used by these states are in{" "}
        <code>/e-anudaan/sample-documents/</code>. Every one is watermarked as prototype demo
        data — they exercise this build&rsquo;s own checker and are not evidence for any
        application.
      </p>
    </div>
  );
}
