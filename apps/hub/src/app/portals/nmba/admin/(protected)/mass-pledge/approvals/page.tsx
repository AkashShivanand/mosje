"use client";

// DS Audit: EmptyState ✅ · Badge ✅ — existing DS. Cards are SubmissionCard.

import { Badge, EmptyState, Icon } from "@mosje/design-system";
import { AdminShell } from "@/components/nmba/admin-shell";
import { SubmissionCard } from "@/components/nmba/mass-pledge/submission-card";
import { usePortalSession } from "@/lib/nmba/committee/session-context";
import { useMassPledgeStore } from "@/lib/nmba/mass-pledge/store";
import { approvalQueue, byNewest } from "@/lib/nmba/mass-pledge/workflow";
import { EVENT_DATE_LABEL } from "@/lib/nmba/mass-pledge/masters";

export default function MassPledgeApprovalsPage() {
  const session = usePortalSession();
  const { submissions } = useMassPledgeStore();

  const queue = byNewest(approvalQueue(submissions, session));

  return (
    <AdminShell>
      <header className="mb-8 flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
        <div>
          <p className="text-label-3 uppercase text-ink-hint">
            Nasha Mukt Bharat Abhiyaan
          </p>
          <h1 className="mt-1 text-headline-1 text-ink">Approvals</h1>
          <p className="mt-1 text-body-2 text-ink-muted">
            Mass Pledge reports awaiting your decision · {EVENT_DATE_LABEL}
          </p>
        </div>
        {queue.length > 0 && (
          <Badge status="info" dot>
            {queue.length} pending
          </Badge>
        )}
      </header>

      {queue.length === 0 ? (
        <EmptyState
          icon={<Icon name="assignment_turned_in" size={32} />}
          title="Nothing awaiting your approval"
          description="Reports submitted from within your jurisdiction will appear here for you to approve or return."
        />
      ) : (
        <>
          <p className="mb-4 text-body-2 text-ink-muted">
            Figures stay out of the published national total until approved.
          </p>
          <div className="grid gap-3">
            {queue.map((submission) => (
              <SubmissionCard key={submission.id} submission={submission} />
            ))}
          </div>
        </>
      )}
    </AdminShell>
  );
}
