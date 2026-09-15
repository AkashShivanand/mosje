"use client";

/**
 * Post-submission confirmation.
 *
 * DS Audit: ConfirmationScreen ✅ existing · EmptyState ✅ · Button ✅ · Icon ✅ · useToast ✅ — nothing new.
 * The hand-built success panel, facts and left-bordered "What Happens Next?" box are the
 * template's now; the steps lose their per-step glyphs, which the template does not draw.
 *
 * Captured from the live portal on 2026-08-22 by actually submitting an application: heading,
 * lead, the reference panel with its copy control, the ROUTED TO / ESTIMATED TIMELINE pair, the
 * three "What Happens Next?" items and both foot actions are verbatim.
 */

import * as React from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button, ConfirmationScreen, EmptyState, Icon, useToast } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { ngoApplications } from "@/lib/e-anudaan/selectors";

const NEXT_STEPS = [
  {
    title: "Review Process",
    // Live says "7–14 business days" here and "30 days" in the panel above it — two answers to
    // one question on one screen. The panel's figure stands; this line no longer contradicts it
    // (full-wizard walk, 13 Sep 2026).
    description: "Ministry officers will examine your application and documents, in the order they were received.",
  },
  {
    title: "Stay Updated",
    // The applicant is told of what concerns them — receipt, a deficiency, an inspection, the
    // outcome (`notifiesApplicant`) — not of every internal move (serious audit UX-26).
    // The notices themselves are named once, in the lead above; this line says where to look.
    description: "You can track the application from My Applications at any time.",
  },
  {
    title: "Action Required",
    description: "If we need clarifications or additional documents, we will notify you. Please respond promptly to avoid delays.",
  },
];

export default function ApplySuccessPage() {
  const params = useParams<{ schemeCode: string }>();
  const refParam = useSearchParams().get("ref");
  const router = useRouter();
  const { state } = useEAnudaan();
  const { toast } = useToast();

  const ngo = state.ngos[0];
  /**
   * The application just submitted. The wizard names it (`?ref=`), and it is shown only if this
   * device holds it — the page once announced a reference for a file whose save had failed
   * (serious audit S03). Without a reference, the most recently submitted one for this scheme.
   */
  const reference = React.useMemo(() => {
    if (!ngo) return null;
    if (refParam) return state.applications.some((a) => a.id === refParam && a.ngoId === ngo.id) ? refParam : null;
    const mine = ngoApplications(state, ngo.id)
      .filter((a) => a.schemeCode.toUpperCase() === params.schemeCode?.toUpperCase() && a.submittedAt)
      .sort((a, b) => (b.submittedAt ?? "").localeCompare(a.submittedAt ?? ""));
    return mine[0]?.id ?? null;
  }, [state, ngo, params.schemeCode, refParam]);

  const copy = () => {
    if (!reference) return;
    void navigator.clipboard?.writeText(reference);
    toast("Reference number copied.", "success");
  };

  const actions = (
    <>
      <Button
        appearance="outlined"
        onClick={() => toast("Acknowledgement receipt downloaded (demo).", "success")}
      >
        <Icon name="download" size={16} aria-hidden /> Download Acknowledgement Receipt
      </Button>
      <Button appearance="filled" onClick={() => router.push("/portals/e-anudaan/ngo/my-applications")}>
        View My Applications
      </Button>
    </>
  );

  if (!reference) {
    return (
      <div className="mx-auto max-w-2xl">
        <EmptyState
          title="No submitted application found for this scheme."
          action={
            <Button appearance="text" onClick={() => router.push("/portals/e-anudaan/apply-grant")}>
              Start a new application
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <ConfirmationScreen
        title="Application Submitted"
        referenceLabel="Your reference number"
        reference={reference}
        intro={
          <>
            Your application has been submitted to the Ministry for review. You will be notified on
            this portal when it needs action from you, when an inspection is scheduled, and when a
            decision is made.
            <br />
            Please save this Reference Number for future reference.{" "}
            <Button appearance="text" size="sm" onClick={copy} aria-label="Copy reference number">
              <Icon name="content_copy" size={16} aria-hidden />
            </Button>
          </>
        }
        facts={[
          { label: "Routed to", value: "Ministry — Programme Division" },
          { label: "Estimated timeline", value: "30 days (standard process)" },
        ]}
        nextStepsTitle="What Happens Next?"
        nextSteps={NEXT_STEPS}
        actions={actions}
      />
    </div>
  );
}
