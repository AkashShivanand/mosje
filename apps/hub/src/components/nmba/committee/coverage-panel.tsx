"use client";

// Coverage view — registered vs expected committees for the viewer's
// jurisdiction. Progress bars where a denominator is known; a plain count for
// blocks (no master list).

import { Progress } from "@mosje/design-system";
import { computeCoverage } from "@/lib/nmba/committee/coverage";
import type { CommitteeRecord, PortalSession } from "@/lib/nmba/committee/types";

export function CoveragePanel({
  records,
  session,
}: {
  records: CommitteeRecord[];
  session: PortalSession;
}) {
  const metrics = computeCoverage(records, session);
  const withDenominator = metrics.filter((m) => m.expected !== null);
  const countOnly = metrics.filter((m) => m.expected === null);

  // No meaningful "registered vs expected" metric (e.g. District users) → don't
  // show a Coverage card at all; the stat tiles already carry the counts.
  if (withDenominator.length === 0) return null;

  return (
    <section className="rounded-xl border border-line bg-white p-5">
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h2 className="text-base font-semibold text-ink">Coverage</h2>
        <p className="text-xs text-ink-hint">Registered vs expected in your jurisdiction</p>
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
        {withDenominator.map((m) => (
          <Progress
            key={m.key}
            value={m.registered}
            max={m.expected ?? 1}
            label={`${m.label} — ${m.registered} of ${m.expected}`}
            showValue
          />
        ))}
      </div>

      {countOnly.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-4">
          {countOnly.map((m) => (
            <div key={m.key} className="flex items-baseline gap-2">
              <span className="text-lg font-semibold text-navy">{m.registered}</span>
              <span className="text-sm text-ink-muted">{m.label.toLowerCase()}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
