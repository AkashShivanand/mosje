"use client";

// Public participation counter for the National Pledge Against Drug Abuse.
//
// DS Audit: Alert ✅ · Card ✅ · Badge ✅ · MetricCard ✅ — all existing DS.
//
// Publishing rules, deliberately conservative because this is the most exposed
// surface in the module:
//   · Approved figures only. Anything still in the approval chain is excluded.
//   · Verified and self-declared totals are shown separately and never summed
//     into a single headline (assumption A8).
//   · No participant personal data, no officer contact details, no photo
//     coordinates. Thumbnails only.

import { ShieldCheck } from "lucide-react";
import { Alert } from "@mosje/design-system";
import { PublicShell } from "@/components/nmba/public-shell";
import { useMassPledgeStore } from "@/lib/nmba/mass-pledge/store";
import { EVENT_DATE_LABEL } from "@/lib/nmba/mass-pledge/masters";
import { sumTotals, type MassPledgeSubmission } from "@/lib/nmba/mass-pledge/types";

/** Most recent approval timestamp across the approved set, or null. */
function latestApprovalAt(submissions: MassPledgeSubmission[]): Date | null {
  const latest = submissions
    .map((s) => s.history[s.history.length - 1]?.at ?? s.submittedAt)
    .sort()
    .at(-1);
  return latest ? new Date(latest) : null;
}

const IS_PRODUCTION = process.env.NODE_ENV === "production";

export default function PublicMassPledgeCounterPage() {
  const { submissions } = useMassPledgeStore();

  const approved = submissions.filter((s) => s.status === "APPROVED");
  const verified = approved.filter((s) => s.verification === "VERIFIED");
  const selfDeclared = approved.filter((s) => s.verification === "SELF_DECLARED");

  const verifiedTotal = sumTotals(verified);
  const selfDeclaredTotal = sumTotals(selfDeclared);

  const statesCovered = new Set(verified.map((s) => s.state).filter(Boolean)).size;

  const lastUpdated = latestApprovalAt(approved);

  // A sample from approved reports. Coordinates are deliberately not published.
  const gallery = verified.flatMap((s) => s.photos).slice(0, 8);

  const fmt = (n: number) => n.toLocaleString("en-IN");

  return (
    <PublicShell>
      <div className="max-w-4xl">
        {!IS_PRODUCTION && (
          <Alert status="warning" title="Provisional prototype data" className="mb-6">
            This page is running against seeded demonstration data, not real reported figures. It is
            not a published national statistic.
          </Alert>
        )}

        <header className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-hint">
            Nasha Mukt Bharat Abhiyaan
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            National Pledge Against Drug Abuse
          </h1>
          <p className="mt-2 text-base text-ink-muted">{EVENT_DATE_LABEL}</p>
        </header>

        {/* The verified figure is the page. Everything else is deliberately
            quieter so this is the one thing a visitor reads first. */}
        <section className="mb-8 border-t-2 border-navy pt-8">
          <p
            className="text-6xl font-bold leading-none tabular-nums tracking-tight text-navy sm:text-7xl"
            aria-live="polite"
          >
            {fmt(verifiedTotal)}
          </p>
          <p className="mt-3 max-w-prose text-base text-ink">
            participants reported by State, District and Block administrations across{" "}
            {statesCovered} State{statesCovered === 1 ? "" : "s"} and Union Territor
            {statesCovered === 1 ? "y" : "ies"}
          </p>
          <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-ink-muted">
            <ShieldCheck className="h-4 w-4 text-approve" aria-hidden="true" />
            Verified through the State/UT approval chain
          </p>
        </section>

        <section className="mb-10 border-t border-line pt-6">
          <h2 className="text-sm font-semibold text-ink">
            Additionally reported by participating organisations
          </h2>
          <p className="mt-2 text-3xl font-bold tabular-nums text-ink">
            {fmt(selfDeclaredTotal)}
          </p>
          <p className="mt-2 max-w-prose text-sm text-ink-muted">
            Reported directly by Line Ministries, Spiritual Organisations, Higher Education
            Institutions and Grant-in-Aid organisations. These figures have not passed through the
            State approval chain and are shown separately for that reason.
          </p>
        </section>

        {gallery.length > 0 && (
          <section className="mb-6">
            <h2 className="mb-3 text-base font-semibold text-ink">From the day</h2>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {gallery.map((photo) => (
                <li key={photo.id} className="overflow-hidden rounded-lg border border-line">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.thumbDataUrl}
                    alt="Pledge event photograph"
                    className="aspect-[4/3] w-full object-cover"
                  />
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className="text-xs text-ink-hint">
          Figures reflect reports approved through the State/UT approval chain. Reports still under
          review are not included.
          {lastUpdated && (
            <>
              {" "}
              Last updated{" "}
              <time dateTime={lastUpdated.toISOString()}>
                {lastUpdated.toLocaleString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </time>
              .
            </>
          )}
        </p>
      </div>
    </PublicShell>
  );
}
