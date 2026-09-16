"use client";

import * as React from "react";
import Link from "next/link";
import { NotificationBell, type EventItem, type NotificationStatus } from "@mosje/design-system";

/** One waiting on the reader, two unread updates, one read — the badge reads 3. */
const ITEMS: EventItem[] = [
  { id: "a1", at: "2026-09-12T10:30:00+05:30", actor: "R. Krishnan", actorRole: "District Nodal Officer",
    action: "Deficiency response requested", subject: "Application 2026/PMS/01284",
    note: "Upload the attested income certificate for the current year.",
    actionRequired: true, dueAt: "2026-09-30", tone: "warning" },
  { id: "u3", at: "2026-09-12T09:10:00+05:30", action: "Application sanctioned",
    subject: "Application 2026/PMS/01192", tone: "success", unread: true },
  { id: "u2", at: "2026-09-11T16:45:00+05:30", action: "Application moved forward",
    subject: "Application 2026/PMS/01170", tone: "info", unread: true },
  { id: "u1", at: "2026-09-10T11:02:00+05:30", action: "Document received",
    subject: "Application 2026/PMS/01170", tone: "info" },
];

const CELL: React.CSSProperties = { display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--sa-stack-8)" };
const CAPTION: React.CSSProperties = {
  margin: 0, fontSize: "var(--sa-type-label-2-size)", lineHeight: "var(--sa-type-label-2-lh)",
  color: "var(--sa-text-neutral-subtle)", textAlign: "center",
};

/** The Badge axis — none, count, error — live. The first bell opens its panel. */
export function NotificationBellSpecimen(): React.JSX.Element {
  const [items, setItems] = React.useState(ITEMS);
  const cells: { caption: string; status?: NotificationStatus; items: EventItem[] }[] = [
    { caption: "Count — opens the panel", items },
    { caption: "None — nothing new", items: ITEMS.map((i) => ({ ...i, unread: false, actionRequired: false })) },
    { caption: "Error — count not known", status: "error", items: [] },
    { caption: "Loading — no badge yet", status: "loading", items: [] },
  ];
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "var(--sa-stack-40)",
      padding: "var(--sa-padding-40)", background: "var(--sa-bg-neutral-base)", borderRadius: "var(--sa-shape-8)" }}>
      {cells.map((cell) => (
        <div key={cell.caption} style={CELL}>
          <NotificationBell
            linkAs={Link}
            notifications={{
              items: cell.items,
              status: cell.status,
              href: "/design-system/components/data-display/notification-centre",
              onMarkAllRead: () => setItems((all) => all.map((i) => ({ ...i, unread: false }))),
              onRetry: () => {},
            }}
          />
          <p style={CAPTION}>{cell.caption}</p>
        </div>
      ))}
    </div>
  );
}
