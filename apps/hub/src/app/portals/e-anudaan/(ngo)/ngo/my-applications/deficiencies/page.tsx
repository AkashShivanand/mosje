"use client";

import { Badge, Button, EmptyState } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { formatDate, ngoApplications } from "@/lib/e-anudaan/selectors";

export default function DeficienciesPage() {
  const { state, act } = useEAnudaan();
  const ngo = state.ngos[0];
  const apps = ngo ? ngoApplications(state, ngo.id) : [];
  const open = apps.flatMap((a) => a.deficiencies.filter((d) => !d.respondedAt).map((d) => ({ a, d })));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-ink">Deficiencies</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Everything the Ministry has asked you to clarify, across all your applications.
        </p>
      </div>

      {open.length === 0 ? (
        <EmptyState
          title="Nothing outstanding"
          description="No deficiencies have been raised on your applications."
        />
      ) : (
        <ul className="space-y-3">
          {open.map(({ a, d }) => (
            <li key={d.id} className="rounded-xl border border-line bg-surface p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="font-semibold text-ink">{a.id}</span>
                <Badge status="warning">Awaiting your response</Badge>
              </div>
              <p className="mt-2 text-sm text-ink">{d.detail}</p>
              <p className="mt-1 text-xs text-ink-muted">Raised {formatDate(d.raisedAt)}</p>
              <Button
                size="sm"
                className="mt-3"
                onClick={() => act(a.id, "respondDeficiency", { remarks: "Corrected documents attached." })}
              >
                Submit response
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
