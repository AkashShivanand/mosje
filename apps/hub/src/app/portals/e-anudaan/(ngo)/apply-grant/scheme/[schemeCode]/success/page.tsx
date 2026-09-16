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
import { applicationRefOf, instalmentLabel } from "@/lib/e-anudaan/instalments";

const NEXT_STEPS = [
  {
    title: "Review Process",
    // Live says "7–14 business days" here and "30 days (standard process)" in the panel above it.
    // Neither is traceable to a scheme guideline or a Ministry document, so neither is promised
    // (audit W-11, 16 Sep 2026).
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
    // The Department, not "we" (audit W-11; ui-restraint-and-copy.md §2).
    description: "If the Department needs clarification or further documents, it will raise a deficiency on this portal. Respond to it promptly to avoid delay.",
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

  /**
   * The application ID — the same across a year's 1st, 2nd and 3rd instalments (C7, T372–375) — and
   * which instalment this submission claims.
   */
  const filed = reference ? state.applications.find((a) => a.id === reference) : undefined;
  const applicationId = filed ? applicationRefOf(filed) : reference;
  const claim = filed?.caseType === "Ongoing" && filed.instalment ? `${instalmentLabel(filed.instalment)} · FY ${filed.financialYear}` : null;

  const copy = () => {
    if (!applicationId) return;
    void navigator.clipboard?.writeText(applicationId);
    toast("Application ID copied.", "success");
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
              Apply for Grant
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
        referenceLabel="Application ID"
        reference={applicationId ?? reference}
        intro={
          <>
            Your application has been submitted to the Ministry for review. You will be notified on
            this portal when it needs action from you, when an inspection is scheduled, and when a
            decision is made.
            <br />
            {filed?.caseType === "Ongoing" && (filed.instalment ?? 1) > 1
              ? "This instalment is recorded on the Application ID of the year's 1st instalment."
              : filed?.caseType === "Ongoing"
                ? "Your 2nd and 3rd instalments of this year will be claimed on this Application ID."
                : "Please save this Application ID for future reference."}{" "}
            {/* 24px glyph in a medium button: a 16px copy icon was below the 24px target minimum (W-11). */}
            <Button appearance="text" size="md" onClick={copy} aria-label="Copy Application ID">
              <Icon name="content_copy" size={24} aria-hidden />
            </Button>
          </>
        }
        facts={[
          ...(claim ? [{ label: "Instalment claimed", value: claim }] : []),
          { label: "Routed to", value: "Ministry — Programme Division" },
        ]}
        nextStepsTitle="What Happens Next?"
        nextSteps={NEXT_STEPS}
        actions={actions}
      />
    </div>
  );
}
