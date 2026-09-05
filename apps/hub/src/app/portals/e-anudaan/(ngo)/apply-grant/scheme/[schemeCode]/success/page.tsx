"use client";

/**
 * Post-submission confirmation.
 *
 * DS Audit: Button ✅ existing · Icon ✅ · Badge ✅ · useToast ✅ — nothing new.
 *
 * Captured from the live portal on 2026-08-22 by actually submitting an application: heading,
 * lead, the reference panel with its copy control, the ROUTED TO / ESTIMATED TIMELINE pair, the
 * three "What Happens Next?" items and both foot actions are verbatim.
 */

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button, Icon, useToast } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { ngoApplications } from "@/lib/e-anudaan/selectors";

const NEXT_STEPS = [
  {
    icon: "schedule",
    title: "Review Process",
    body: "Ministry officers will review your application and documents. This typically takes 7–14 business days.",
  },
  {
    icon: "notifications",
    title: "Stay Updated",
    body: "You will receive notifications for every update. You can also track the application status from your dashboard.",
  },
  {
    icon: "error",
    title: "Action Required",
    body: "If we need clarifications or additional documents, we will notify you. Please respond promptly to avoid delays.",
  },
];

export default function ApplySuccessPage() {
  const params = useParams<{ schemeCode: string }>();
  const router = useRouter();
  const { state } = useEAnudaan();
  const { toast } = useToast();

  const ngo = state.ngos[0];
  /** The application just submitted — the most recently submitted one for this scheme. */
  const reference = React.useMemo(() => {
    if (!ngo) return null;
    const mine = ngoApplications(state, ngo.id)
      .filter((a) => a.schemeCode.toUpperCase() === params.schemeCode?.toUpperCase() && a.submittedAt)
      .sort((a, b) => (b.submittedAt ?? "").localeCompare(a.submittedAt ?? ""));
    return mine[0]?.id ?? null;
  }, [state, ngo, params.schemeCode]);

  const copy = () => {
    if (!reference) return;
    void navigator.clipboard?.writeText(reference);
    toast("Reference number copied.", "success");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <section className="space-y-5 rounded-xl border border-line bg-surface p-8 text-center shadow-xs">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-status-success/10">
          <Icon name="check" size={48} className="text-status-success" aria-hidden />
        </div>

        <div className="space-y-2">
          <h1 className="text-headline-1 text-status-success">Application Submitted Successfully!</h1>
          <p className="mx-auto max-w-md text-body-2 text-ink-muted">
            Your application has been submitted to the Ministry for review. You will receive portal,
            email and SMS updates at every stage of the process.
          </p>
        </div>

        {reference && (
          <div className="space-y-3 rounded-lg border border-status-success/30 bg-status-success/5 p-5">
            <p className="text-label-3 uppercase text-ink-muted">
              Your reference number
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <code className="rounded-md border border-line bg-surface px-3 py-1.5 text-body-2 font-bold text-ink">
                {reference}
              </code>
              <Button appearance="text" size="sm" onClick={copy} aria-label="Copy reference number">
                <Icon name="content_copy" size={16} aria-hidden />
              </Button>
            </div>
            <p className="text-body-3 text-ink-muted">
              Please save this Reference Number for future reference.
            </p>

            <dl className="grid gap-4 border-t border-line pt-4 sm:grid-cols-2">
              <div>
                <dt className="text-label-3 uppercase text-ink-muted">Routed to</dt>
                <dd className="mt-0.5 text-body-2 font-medium text-ink">Ministry — Programme Division</dd>
              </div>
              <div>
                <dt className="text-label-3 uppercase text-ink-muted">
                  Estimated timeline
                </dt>
                <dd className="mt-0.5 text-body-2 font-medium text-ink">30 days (standard process)</dd>
              </div>
            </dl>
          </div>
        )}
      </section>

      <section className="space-y-4 rounded-xl border-l-4 border-l-primary border border-line bg-surface p-6 shadow-xs">
        <h2 className="text-title-2 text-ink">What Happens Next?</h2>
        <ul className="space-y-4">
          {NEXT_STEPS.map((s) => (
            <li key={s.title} className="flex gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface-muted">
                <Icon name={s.icon} size={20} className="text-primary" aria-hidden />
              </span>
              <div>
                <p className="text-body-2 font-semibold text-ink">{s.title}</p>
                <p className="mt-0.5 text-body-2 text-ink-muted">{s.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap justify-center gap-3">
        <Button
          appearance="outlined"
          onClick={() => toast("Acknowledgement receipt downloaded (demo).", "success")}
        >
          <Icon name="download" size={16} aria-hidden /> Download Acknowledgement Receipt
        </Button>
        <Link href="/portals/e-anudaan/ngo/my-applications">
          <Button appearance="filled">View My Applications</Button>
        </Link>
      </div>

      {!reference && (
        <p className="text-center text-body-2 text-ink-muted">
          No submitted application found for this scheme.{" "}
          <button type="button" className="underline" onClick={() => router.push("/portals/e-anudaan/apply-grant")}>
            Start a new application
          </button>
        </p>
      )}
    </div>
  );
}
