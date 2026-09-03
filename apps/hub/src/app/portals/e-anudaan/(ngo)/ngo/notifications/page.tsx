"use client";

/**
 * Notifications — the applicant's feed.
 *
 * DS Audit: Badge ✅ existing · Button ✅ · EmptyState ✅ · Icon ✅ — nothing new.
 *
 * The live screen shows "<n> unread", a "Mark all read" action, and an "Open →" link on any item
 * that names an application. Timestamps read "17 Aug 2026, 04:59 pm".
 */

import Link from "next/link";
import { Badge, Button, EmptyState, Icon } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { formatDate } from "@/lib/e-anudaan/format";

function formatStamp(iso: string): string {
  const d = new Date(iso);
  const date = formatDate(d);
  const time = d
    .toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: true })
    .toLowerCase();
  return `${date}, ${time}`;
}

export default function NgoNotificationsPage() {
  const { state, markAllNotificationsRead } = useEAnudaan();
  const mine = state.notifications.filter((n) => n.audience.includes("ngo"));
  const unread = mine.filter((n) => !n.read).length;

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Notifications</h1>
          <p className="mt-1 text-sm text-ink-muted">{unread} unread</p>
        </div>
        {unread > 0 && (
          <Button appearance="outlined" onClick={markAllNotificationsRead}>
            <Icon name="mark_email_read" size={16} aria-hidden /> Mark all read
          </Button>
        )}
      </header>

      {mine.length === 0 ? (
        <EmptyState title="Nothing to read" description="You have no notifications." />
      ) : (
        <ul className="space-y-3">
          {mine.map((n) => (
            <li
              key={n.id}
              className={`rounded-xl border bg-surface p-4 ${
                n.read ? "border-line" : "border-primary/40"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-ink">{n.title}</p>
                  <p className="mt-1 text-sm text-ink-muted">{n.body}</p>
                  <p className="mt-2 text-xs text-ink-hint">{formatStamp(n.at)}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {!n.read && <Badge status="info">New</Badge>}
                  {n.applicationId && (
                    <Link
                      href={`/portals/e-anudaan/ngo/my-applications/${encodeURIComponent(n.applicationId)}`}
                      className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                      Open <span aria-hidden="true">→</span>
                    </Link>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
