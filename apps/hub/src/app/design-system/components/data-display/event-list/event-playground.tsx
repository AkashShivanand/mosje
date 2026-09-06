"use client";
import * as React from "react";
import { EventList, type EventItem } from "@mosje/design-system";

const LOG: EventItem[] = [
  { id: "4", at: "2026-09-04T15:42:00+05:30", actor: "Sunita Devi", actorRole: "State Nodal Officer",
    action: "Approved", subject: "Application 2026/PMS/01284", tone: "success", icon: "check_circle" },
  { id: "3", at: "2026-09-02T11:05:00+05:30", actor: "R. Krishnan", actorRole: "District Nodal Officer",
    action: "Returned for correction", subject: "Application 2026/PMS/01284", tone: "warning",
    note: "The income certificate is issued by the block office. A certificate issued by the tehsildar is required." },
  { id: "2", at: "2026-09-01T09:18:00+05:30", action: "Documents scanned and found clean" },
  { id: "1", at: "2026-08-31T18:30:00+05:30", actor: "Meena Kumari", actorRole: "Applicant",
    action: "Submitted", subject: "Application 2026/PMS/01284", tone: "info" },
];

const CELL: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "var(--sa-stack-8)" };
const CAPTION: React.CSSProperties = {
  fontSize: "var(--sa-type-label-2-size)", lineHeight: "var(--sa-type-label-2-lh)",
  color: "var(--sa-text-neutral-subtle)", margin: 0,
};

/** Every arrangement: full stamps, grouped by day, unread, and empty. */
export function EventPlayground(): React.JSX.Element {
  return (
    <div style={{ padding: "var(--sa-padding-40)", background: "var(--sa-bg-neutral-subtle)",
      borderRadius: "var(--sa-shape-8)", display: "grid", gap: "var(--sa-stack-24)" }}>
      <div style={CELL}>
        <EventList events={LOG} label="Case history" />
        <p style={CAPTION}>Newest first, with the full stamp on every row. The system entry reads &ldquo;System&rdquo;, never a blank.</p>
      </div>
      <div style={CELL}>
        <EventList events={LOG} label="Audit log" grouping="day" />
        <p style={CAPTION}>Grouped by day. The date moves to the heading and each row keeps only its time.</p>
      </div>
      <div style={CELL}>
        <EventList label="Recent activity" events={LOG.slice(0, 2).map((e, i) => ({ ...e, unread: i === 0, href: "#case" }))} />
        <p style={CAPTION}>An unread entry carries a hidden &ldquo;Unread&rdquo; as well as the dot; the dot alone is invisible to a screen reader.</p>
      </div>
      <div style={CELL}>
        <EventList events={[]} label="Audit log" emptyText="No activity has been recorded against this application yet." />
        <p style={CAPTION}>Empty is the citizen&rsquo;s answer, written out — not a blank panel that reads as broken.</p>
      </div>
    </div>
  );
}
