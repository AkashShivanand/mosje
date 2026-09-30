"use client";

/**
 * Approve & Sign — the Checker's DSC step and the one ReceiveSanctionData call (FR-PDC-004/005).
 *
 * DS Audit: Modal ✅ (calls `useDialogLayer` itself) · Alert ✅ · Button ✅ · DescriptionList ✅ ·
 * Loader ✅ · Icon ✅ — composed. The plan's candidate `SignatureDialog` stays here until a second
 * portal signs with a DSC.
 *
 * The dialog walks the states a real DSC utility and a real PFMS put an officer through, each with
 * its own words, so none of them is a blank failure (plan §2.4 item 10):
 *
 *   confirm → signing → accepted | not accepted | waiting to resend
 *   confirm → a certificate problem (no utility, no token, expired, not the designated officer,
 *             the Checker's own advice) — nothing is signed and nothing is sent
 *
 * The Sign button disables while signing, and the store refuses a second call for the same
 * identifier, so a double click sends one bill (FR-PDC-005).
 */

import * as React from "react";
import { Alert, Button, DescriptionList, Icon, Loader, Modal } from "@mosje/design-system";
import { formatDate } from "@/lib/e-anudaan/format";
import { CERTIFICATE_MESSAGE, type CertificateCheck } from "@/lib/e-anudaan/pfms/advice";
import { pfmsError } from "@/lib/e-anudaan/pfms/errors";
import type { Designation, PaymentAdvice } from "@/lib/e-anudaan/pfms/types";
import { usePfms } from "@/lib/e-anudaan/pfms/store";
import { exact } from "./payment-ui";

type Phase = { kind: "confirm" } | { kind: "signing" } | { kind: "blocked"; check: Exclude<CertificateCheck, "ok"> } | { kind: "done"; advice: PaymentAdvice } | { kind: "failed"; error: string };

export function SignDialog({
  open,
  onClose,
  advice,
  designation,
  officerName,
  onFinished,
}: {
  open: boolean;
  onClose: () => void;
  advice: PaymentAdvice;
  designation: Designation | undefined;
  officerName: string;
  onFinished: (a: PaymentAdvice) => void;
}) {
  const { checkCertificate, signAndSend, pfms } = usePfms();
  const [phase, setPhase] = React.useState<Phase>({ kind: "confirm" });

  const sign = () => {
    const check = checkCertificate(advice.appId);
    if (check !== "ok") {
      setPhase({ kind: "blocked", check });
      return;
    }
    setPhase({ kind: "signing" });
    // The utility and PFMS take a moment; the pause is what lets a reader see the step happen.
    window.setTimeout(() => {
      const res = signAndSend(advice.appId);
      if (!res.ok || !res.advice) setPhase({ kind: "failed", error: res.ok ? "The advice could not be sent." : res.error });
      else setPhase({ kind: "done", advice: res.advice });
    }, 900);
  };

  const close = () => {
    if (phase.kind === "signing") return;
    if (phase.kind === "done") onFinished(phase.advice);
    // Reopening starts from the confirmation again, not from the last outcome.
    setPhase({ kind: "confirm" });
    onClose();
  };

  const footer =
    phase.kind === "confirm" ? (
      <>
        <Button appearance="outlined" onClick={close}>
          Cancel
        </Button>
        <Button iconLeft={<Icon name="verified_user" size={20} aria-hidden />} onClick={sign}>
          Sign and Send to PFMS
        </Button>
      </>
    ) : phase.kind === "blocked" && (phase.check === "no-utility" || phase.check === "no-token") ? (
      <>
        <Button appearance="outlined" onClick={close}>
          Close
        </Button>
        <Button onClick={sign}>Try Again</Button>
      </>
    ) : phase.kind === "signing" ? null : (
      <Button onClick={close}>{phase.kind === "done" ? "Done" : "Close"}</Button>
    );

  return (
    <Modal open={open} onClose={close} title="Approve and Sign" size="md" footer={footer} hideClose={phase.kind === "signing"}>
      {phase.kind === "confirm" && (
        <div className="space-y-4">
          <p className="text-body-1 text-ink">
            You are authorising payment advice <strong>{advice.id}</strong> for <strong>{exact(advice.sanctionAmount)}</strong>. Signing sends it to PFMS in a single request. It cannot be recalled from e-Anudaan once PFMS accepts it.
          </p>
          <DescriptionList
            columns={2}
            size="sm"
            items={[
              { term: "Signing Officer", value: officerName },
              { term: "DDO", value: advice.header.ddoCode },
              { term: "Certificate", value: designation ? <span className="font-mono">{designation.certificateSerial}</span> : "No certificate designated" },
              { term: "Valid Until", value: designation ? formatDate(designation.certificateExpires) : "" },
            ]}
          />
          <p className="text-body-3 text-ink-muted">Keep your DSC token inserted. The signing utility asks for its PIN; the portal never sees or stores it.</p>
        </div>
      )}
      {phase.kind === "signing" && (
        <div className="flex items-center gap-3 py-6" role="status">
          <Loader size="md" label="Signing and sending" />
          <span className="text-body-1 text-ink">Signing with your certificate and sending to PFMS…</span>
        </div>
      )}
      {phase.kind === "blocked" && (
        <Alert status="error" title={CERTIFICATE_MESSAGE[phase.check].title}>
          {CERTIFICATE_MESSAGE[phase.check].body} Nothing has been signed or sent.
        </Alert>
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
