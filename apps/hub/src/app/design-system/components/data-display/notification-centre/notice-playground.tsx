"use client";
import * as React from "react";
import { NotificationCentre, type EventItem } from "@mosje/design-system";

const SEED: EventItem[] = [
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

/** Every arrangement: unread, all read, and up to date. */
export function NoticePlayground(): React.JSX.Element {
  const [notices, setNotices] = React.useState(SEED);
  return (
    <div style={{ padding: "var(--sa-padding-40)", background: "var(--sa-bg-neutral-subtle)",
      borderRadius: "var(--sa-shape-8)", display: "grid", gap: "var(--sa-stack-24)" }}>
      <div style={CELL}>
        <NotificationCentre
          notifications={notices}
          onMarkAllRead={() => setNotices((all) => all.map((n) => ({ ...n, unread: false })))}
        />
        <p style={CAPTION}>
          Grouped by day, with the unread count in a polite live region. Mark all as read disappears
          once there is nothing to mark.
        </p>
      </div>
      <div style={CELL}>
        <NotificationCentre notifications={[]} label="Notifications" markAllLabel="Mark all as read" />
        <p style={CAPTION}>Up to date, which is a good state and reads like one.</p>
      </div>
    </div>
  );
}
