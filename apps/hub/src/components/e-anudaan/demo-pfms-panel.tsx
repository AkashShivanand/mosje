"use client";

/**
 * The demo dock's "PFMS" tab: stand in for PFMS, so every state the payment leg can be in is
 * reachable in a browser (`data-state-completeness.md` §7) — what the next signing does, and, on a
 * file's own page, moving that file's payment on, resending it, or having PFMS return and cancel it.
 *
 * DS Audit: SegmentedControl ✅ · Button ✅ · Badge ✅ · Alert ✅ · SectionTitle ✅ — nothing new.
 *
 * The dock is mounted by the root layout, outside the portal's `PfmsProvider`, so it sends commands
 * as window events and re-reads the stored copy when the provider says it changed. Nothing here
 * decides a rule; the provider applies the same functions the screens do.
 */

import * as React from "react";
import { Alert, Badge, Button, SectionTitle, SegmentedControl } from "@mosje/design-system";
import { PFMS_CHANGED_EVENT, PFMS_DEMO_EVENT, PFMS_DEMO_KEY, PFMS_STORAGE_KEY, type PfmsDemo, type PfmsDemoCommand } from "@/lib/e-anudaan/pfms/store";
import { RESTARTABLE, STAGE_INFO, stageOf } from "@/lib/e-anudaan/pfms/stages";
import type { PaymentAdvice } from "@/lib/e-anudaan/pfms/types";

/** The file a payment-leg address names, if it names one. */
export function pfmsAppFromPath(pathname: string): string | null {
  const m = /\/portals\/e-anudaan\/(?:finance\/payment-status|dashboard\/payments\/(?:prepare|authorise))\/([^/]+)$/.exec(pathname);
  return m ? decodeURIComponent(m[1]!) : null;
}

/** Where the PFMS tab is offered: every payment-leg screen. */
export function isPfmsDemoRoute(pathname: string): boolean {
  return (
    pathname.startsWith("/portals/e-anudaan/dashboard/payments") ||
    pathname.startsWith("/portals/e-anudaan/finance/payment-status") ||
    pathname.startsWith("/portals/e-anudaan/dashboard/pfms") ||
    pathname.startsWith("/portals/e-anudaan/dashboard/payment-reports")
  );
}

const send = (cmd: PfmsDemoCommand) => window.dispatchEvent(new CustomEvent(PFMS_DEMO_EVENT, { detail: cmd }));

function read<T>(storage: Storage, key: string): T | null {
  try {
    return JSON.parse(storage.getItem(key) ?? "null") as T | null;
  } catch {
    return null;
  }
}

export function DemoPfmsPanel({ pathname }: { pathname: string }) {
  const appId = pfmsAppFromPath(pathname);
  const [demo, setDemo] = React.useState<PfmsDemo>({ next: "accept", certificate: "ok" });
  const [advice, setAdvice] = React.useState<PaymentAdvice | null>(null);

  React.useEffect(() => {
    const sync = () => {
      const d = read<PfmsDemo>(window.sessionStorage, PFMS_DEMO_KEY);
      if (d) setDemo(d);
      const state = read<{ advices: PaymentAdvice[] }>(window.localStorage, PFMS_STORAGE_KEY);
      setAdvice(appId ? (state?.advices.find((a) => a.appId === appId) ?? null) : null);
    };
    sync();
    window.addEventListener(PFMS_CHANGED_EVENT, sync);
    return () => window.removeEventListener(PFMS_CHANGED_EVENT, sync);
  }, [appId]);

  const stage = advice ? stageOf(advice) : null;
  const moving = advice?.state === "transmitted" && stage !== "closed" && stage !== "fy-expired" && stage !== "credit-failed";
  const unpaid = moving && stage !== "paid";

  return (
    <div className="space-y-5">
      <p className="text-body-2 text-ink-muted">Stands in for PFMS. Nothing here moves money; it makes each response the BRD describes appear on the screens.</p>

      <section className="space-y-2" aria-labelledby="pfms-next">
        <SectionTitle as={3} headingId="pfms-next" title="Next Transmission" description="What PFMS answers the next time a Checker signs and sends. Applies once." />
        <SegmentedControl
          ariaLabel="Next PFMS response"
          value={demo.next}
          onChange={(v) => send({ kind: "set", demo: { next: v } })}
          options={[
            { value: "accept", label: "Accepted" },
            { value: "not-accepted", label: "Refused" },
            { value: "duplicate-bill", label: "Duplicate Bill" },
            { value: "timeout", label: "Unreachable" },
          ]}
        />
      </section>

      <section className="space-y-2" aria-labelledby="pfms-dsc">
        <SectionTitle as={3} headingId="pfms-dsc" title="Signing Utility" description="What the DSC utility reports when the Checker signs." />
        <SegmentedControl
          ariaLabel="DSC utility state"
          value={demo.certificate}
          onChange={(v) => send({ kind: "set", demo: { certificate: v } })}
          options={[
            { value: "ok", label: "Ready" },
            { value: "no-utility", label: "Not Running" },
            { value: "no-token", label: "No Token" },
          ]}
        />
      </section>

      <section className="space-y-2" aria-labelledby="pfms-file">
        <SectionTitle as={3} headingId="pfms-file" title="This File at PFMS" />
        {!appId ? (
          <p className="text-body-3 text-ink-muted">Open a file&apos;s Payment Status, advice or review to move its payment on.</p>
        ) : !advice ? (
          <p className="text-body-3 text-ink-muted">No payment advice has been prepared for this file yet.</p>
        ) : (
          <div className="space-y-3">
            <p className="text-body-2">
              <Badge status="info">{STAGE_INFO[stage!].label}</Badge>
            </p>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" disabled={!moving} onClick={() => send({ kind: "advance", appId: appId })}>
                Advance One Stage
              </Button>
              <Button size="sm" appearance="outlined" disabled={advice.state !== "queued"} onClick={() => send({ kind: "resend", appId: appId })}>
                PFMS Answers — Resend
              </Button>
              <Button
                size="sm"
                appearance="outlined"
                variant="danger"
                disabled={!unpaid}
                onClick={() => send({ kind: "cancel", appId: appId, reason: "The object head does not match the scheme's budget provision for the year." })}
              >
                Return and Cancel
              </Button>
              <Button
                size="sm"
                appearance="outlined"
                disabled={!unpaid}
                onClick={() => send({ kind: "return-pfms", appId: appId, level: stage === "received" || stage === "bill-with-ddo" ? "DDO" : "PAO", reason: "The payee remarks do not quote the sanction order number." })}
              >
                Return Without Cancelling
              </Button>
              <Button size="sm" appearance="outlined" variant="danger" disabled={!unpaid} onClick={() => send({ kind: "expire", appId: appId })}>
                Financial Year Expires
              </Button>
              <Button size="sm" appearance="outlined" variant="danger" disabled={stage !== "payment-in-process"} onClick={() => send({ kind: "fail-credit", appId: appId })}>
                Bank Fails the Credit
              </Button>
            </div>
            {RESTARTABLE.includes(stage!) ? (
              <p className="text-body-3 text-ink-muted">PFMS has finished with this advice. The Maker starts a fresh one from Payment Status.</p>
            ) : !moving && stage !== "closed" && advice.state !== "queued" ? (
              <p className="text-body-3 text-ink-muted">PFMS acts on an advice only after the Checker has signed and sent it.</p>
            ) : null}
          </div>
        )}
      </section>

      <Alert status="info" title="Start Again">
        <span className="block">Puts every file back where the demo begins.</span>
        <Button size="sm" appearance="outlined" className="mt-2" onClick={() => send({ kind: "reset" })}>
          Reset Payment Data
        </Button>
      </Alert>
    </div>
  );
}
