"use client";
import * as React from "react";
import { NotificationCentre, type EventItem } from "@mosje/design-system";

const SEED: EventItem[] = [
  { id: "a1", at: "2026-09-06T10:15:00+05:30", actor: "R. Krishnan", actorRole: "District Nodal Officer",
    action: "Deficiency response requested", subject: "Application 2026/PMS/01301",
    note: "Upload the attested income certificate for the current year.", tone: "warning",
    actionRequired: true, dueAt: "2026-09-30", href: "#case-1301" },
  { id: "n4", at: "2026-09-06T09:20:00+05:30", actor: "R. Krishnan", actorRole: "District Nodal Officer",
    action: "Returned for correction", subject: "Application 2026/PMS/01284", tone: "warning", unread: true, href: "#case-1284" },
  { id: "n3", at: "2026-09-06T08:05:00+05:30", action: "Nightly scrutiny queue rebuilt", unread: true },
  { id: "n2", at: "2026-09-05T17:44:00+05:30", actor: "Sunita Devi", actorRole: "State Nodal Officer",
    action: "Approved", subject: "Application 2026/PMS/01192", tone: "success", href: "#case-1192" },
  { id: "n1", at: "2026-09-05T11:02:00+05:30", actor: "Meena Kumari", actorRole: "Applicant",
    action: "Uploaded a replacement document", subject: "Application 2026/PMS/01284", tone: "info", href: "#case-1284" },
];

const CELL: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "var(--sa-stack-8)" };
const CAPTION: React.CSSProperties = {
  fontSize: "var(--sa-type-label-2-size)", lineHeight: "var(--sa-type-label-2-lh)",
  color: "var(--sa-text-neutral-subtle)", margin: 0,
};

/** Every arrangement: action needed with updates, all read, up to date, loading, and failed. */
export function NoticePlayground(): React.JSX.Element {
  const [notices, setNotices] = React.useState(SEED);
  return (
    <div style={{ padding: "var(--sa-padding-40)", background: "var(--sa-bg-neutral-subtle)",
      borderRadius: "var(--sa-shape-8)", display: "grid", gap: "var(--sa-stack-24)" }}>
      <div style={CELL}>
        <NotificationCentre
          notifications={notices}
          onMarkAllRead={() => setNotices((all) => all.map((n) => ({ ...n, unread: false })))}
          viewAllHref="#notifications"
          limit={3}
        />
        <p style={CAPTION}>
          The entry that needs action sits first and survives Mark updates as read; the updates are
          grouped by day and cut at three, with the rest one link away.
        </p>
      </div>
      <div style={CELL}>
        <NotificationCentre notifications={[]} />
        <p style={CAPTION}>Up to date, which is a good state and reads like one.</p>
      </div>
      <div style={CELL}>
        <NotificationCentre notifications={[]} status="loading" />
        <p style={CAPTION}>Loading: a skeleton in the shape of the list, and the panel is marked busy.</p>
      </div>
      <div style={CELL}>
        <NotificationCentre notifications={[]} status="error" onRetry={() => {}} />
        <p style={CAPTION}>Failed: it says so once, and offers the retry. No code, no endpoint.</p>
      </div>
    </div>
  );
}
