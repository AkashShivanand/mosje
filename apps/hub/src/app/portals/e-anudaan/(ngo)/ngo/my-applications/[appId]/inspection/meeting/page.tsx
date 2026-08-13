"use client";

import { useParams } from "next/navigation";
import { Alert, Badge, Button, Icon } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { formatDate } from "@/lib/e-anudaan/selectors";

/**
 * Online Inspection Meeting — the NGO end of the officer-side "Online Inspection — BharatVC".
 *
 * On the live portal this route renders ONLY an <h1> and nothing else (user INVENTORY §13), so
 * the two halves of the feature do not currently meet. Built out here from the officer side's
 * behaviour: the IFD schedules a BharatVC session, and the applicant joins it from this page.
 */
export default function InspectionMeetingPage() {
  const params = useParams<{ appId: string }>();
  const { state, findApp } = useEAnudaan();
  const app = findApp(decodeURIComponent(params.appId));
  const inspection = state.inspections.find((i) => i.applicationId === app?.id);

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <h1 className="text-2xl font-bold text-ink">Online Inspection Meeting</h1>

      <Alert status="info" title="Inferred screen">
        The live portal renders only a heading here — the applicant half of the BharatVC
        inspection is not built upstream. This page follows the officer side&apos;s behaviour.
      </Alert>

      {!inspection ? (
        <Alert status="warning" title="No inspection scheduled">
          No online inspection has been scheduled for this application yet. The inspecting officer
          will schedule one and you will be notified.
        </Alert>
      ) : (
        <section className="space-y-4 rounded-xl border border-line bg-surface p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm text-ink">{app?.projectLabel}</span>
            <Badge status={inspection.status === "Reviewed" ? "success" : "info"}>{inspection.status}</Badge>
          </div>
          <dl className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
            <div className="flex items-baseline justify-between gap-4 border-b border-line pb-2">
              <dt className="text-sm text-ink-muted">Visit type</dt>
              <dd className="text-sm font-semibold text-ink">{inspection.visitType}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-b border-line pb-2">
              <dt className="text-sm text-ink-muted">Scheduled for</dt>
              <dd className="text-sm font-semibold text-ink">
                {inspection.scheduledFor ? formatDate(inspection.scheduledFor) : "Not scheduled"}
              </dd>
            </div>
          </dl>
          <p className="text-sm text-ink-muted">
            Ensure your CCTV is configured before the session so the inspecting officer can view
            the premises.
          </p>
          <Button disabled={inspection.visitType !== "Online" || !inspection.scheduledFor}>
            <Icon name="videocam" size={16} aria-hidden /> Join BharatVC session
          </Button>
        </section>
      )}
    </div>
  );
}
