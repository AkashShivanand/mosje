import * as React from "react";
import { cn } from "../../utils/cn";
import "./approval-timeline.css";

/** What happened at one step of an approval chain. */
export type ApprovalAction = "SUBMITTED" | "RESUBMITTED" | "APPROVED" | "RETURNED";

export interface ApprovalTimelineEvent {
  /** ISO timestamp. */
  at: string;
  actorDisplayName: string;
  /** Human-readable role, e.g. "District Nodal Officer". */
  actorRoleLabel: string;
  action: ApprovalAction;
  /** Required in practice for RETURNED; shown as a quoted note. */
  remarks?: string;
}

export interface ApprovalTimelineProps {
  /** Events oldest-first. */
  events: ApprovalTimelineEvent[];
  /** Trailing not-yet-happened step, e.g. "Awaiting State/UT approval". */
  pendingLabel?: string;
  className?: string;
}

const ACTION_LABEL: Record<ApprovalAction, string> = {
  SUBMITTED: "Submitted",
  RESUBMITTED: "Resubmitted after correction",
  APPROVED: "Approved",
  RETURNED: "Returned for correction",
};

const ACTION_MODIFIER: Record<ApprovalAction, string> = {
  SUBMITTED: "is-submitted",
  RESUBMITTED: "is-submitted",
  APPROVED: "is-approved",
  RETURNED: "is-returned",
};

function formatStamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * MoSJE / SAMAVESH ApprovalTimeline.
 *
 * Renders the full history of a multi-tier approval chain: who acted, in what
 * role, when, and what they said when returning something for correction.
 *
 * Built for government workflows where the audit trail matters as much as the
 * outcome — a returned-then-resubmitted record must show both, not just its
 * current status. Pass `pendingLabel` to show the step still being waited on.
 */
export function ApprovalTimeline({
  events,
  pendingLabel,
  className,
}: ApprovalTimelineProps): React.JSX.Element {
  return (
    <ol className={cn("ds-timeline", className)}>
      {events.map((event, index) => (
        <li
          key={`${event.at}-${index}`}
          className={cn("ds-timeline__item", ACTION_MODIFIER[event.action])}
        >
          <span className="ds-timeline__marker" aria-hidden="true" />
          <div className="ds-timeline__body">
            <p className="ds-timeline__action">{ACTION_LABEL[event.action]}</p>
            <p className="ds-timeline__meta">
              {event.actorDisplayName}
              <span className="ds-timeline__sep"> · </span>
              {event.actorRoleLabel}
            </p>
            <p className="ds-timeline__stamp">
              <time dateTime={event.at}>{formatStamp(event.at)}</time>
            </p>
            {event.remarks && <p className="ds-timeline__remarks">“{event.remarks}”</p>}
          </div>
        </li>
      ))}

      {pendingLabel && (
        <li className="ds-timeline__item is-pending">
          <span className="ds-timeline__marker" aria-hidden="true" />
          <div className="ds-timeline__body">
            <p className="ds-timeline__action ds-timeline__action--pending">{pendingLabel}</p>
          </div>
        </li>
      )}
    </ol>
  );
}
