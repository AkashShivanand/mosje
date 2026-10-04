"use client";

/**
 * Signing and sending — what happens after the Checker presses Approve and Sign (FR-PDC-004/005).
 *
 * DS Audit: Modal ✅ (calls `useDialogLayer` itself) · Alert ✅ · Button ✅ · Loader ✅ — composed.
 *
 * The confirmation is no longer a dialog. Since the handoff file's redraw (PD Checker / Authorise
 * Payment Advice, 3 Oct 2026) the decision panel carries everything the old confirmation did — the
 * certificate it will sign with, the consequence, the one button — and a certificate problem is
 * shown there, beside the choice, before anything is signed. This dialog opens only once the
 * signing has started, and stays until PFMS has answered:
 *
 *   signing → received | not accepted | waiting to resend | not sent
 *
 * The file does not draw these four; they are PFMS's answers and each needs its own words, so none
 * is a blank failure (plan §2.4 item 10). `useSigning` holds the call, so the Sign button and the
 * store both refuse a second one for the same identifier and a double click sends one bill.
 */

import * as React from "react";
import { Alert, Button, Loader, Modal } from "@mosje/design-system";
import { pfmsError } from "@/lib/e-anudaan/pfms/errors";
import type { PaymentAdvice } from "@/lib/e-anudaan/pfms/types";
import { usePfms } from "@/lib/e-anudaan/pfms/store";

export type SigningPhase = { kind: "idle" } | { kind: "signing" } | { kind: "done"; advice: PaymentAdvice } | { kind: "failed"; error: string };

/** The one call, and where it has got to. */
export function useSigning(appId: string) {
  const { signAndSend } = usePfms();
  const [phase, setPhase] = React.useState<SigningPhase>({ kind: "idle" });
  const sign = () => {
    if (phase.kind === "signing") return;
    setPhase({ kind: "signing" });
    // The utility and PFMS take a moment; the pause is what lets a reader see the step happen.
    window.setTimeout(() => {
      const res = signAndSend(appId);
      if (!res.ok || !res.advice) setPhase({ kind: "failed", error: res.ok ? "The advice could not be sent." : res.error });
      else setPhase({ kind: "done", advice: res.advice });
    }, 900);
  };
  const reset = () => setPhase({ kind: "idle" });
  return { phase, sign, reset };
}

export function SignDialog({ phase, onClose, onFinished }: { phase: SigningPhase; onClose: () => void; onFinished: (a: PaymentAdvice) => void }) {
  const { pfms } = usePfms();
  const close = () => {
    if (phase.kind === "signing") return;
    if (phase.kind === "done") onFinished(phase.advice);
    onClose();
  };

  return (
    <Modal
      open={phase.kind !== "idle"}
      onClose={close}
      title={phase.kind === "signing" ? "Signing and Sending" : "Approve and Sign"}
      size="md"
      footer={phase.kind === "signing" ? null : <Button onClick={close}>{phase.kind === "done" ? "Done" : "Close"}</Button>}
      hideClose={phase.kind === "signing"}
    >
      {phase.kind === "signing" && (
        <div className="flex items-center gap-3 py-6" role="status">
          <Loader size="md" label="Signing and sending" />
          <span className="text-body-1 text-ink">Signing with your certificate and sending to PFMS…</span>
        </div>
      )}
      {phase.kind === "failed" && (
        <Alert status="error" title="Not Sent">
          {phase.error}
        </Alert>
      )}
      {phase.kind === "done" && phase.advice.state === "transmitted" && (
        <Alert status="success" title="Received by PFMS">
          The advice was signed and PFMS has received it. Its progress through the DDO, the PAO and the bank will appear on the Payment Status page. The NGO is told only when the bank confirms the credit.
        </Alert>
      )}
      {phase.kind === "done" && phase.advice.state === "not-accepted" && (
        <Alert status="error" title="PFMS Did Not Accept the Advice">
          <span className="block">Nothing was created at PFMS. The advice has gone back to the Maker to correct:</span>
          <ul className="mt-2 list-disc pl-5">
            {phase.advice.issues.map((i) => (
              <li key={i.pfmsCode}>{pfmsError(i.pfmsCode ?? "", pfms.errorOverrides).message}</li>
            ))}
          </ul>
        </Alert>
      )}
      {phase.kind === "done" && phase.advice.state === "queued" && (
        <Alert status="warning" title="Signed — Waiting to Resend">
          PFMS could not be reached. Your signature is recorded and the advice will be sent automatically when PFMS answers. You do not need to sign it again.
        </Alert>
      )}
    </Modal>
  );
}
