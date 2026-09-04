"use client";

import { Badge, Button, EmptyState } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { formatDate } from "@/lib/e-anudaan/selectors";

export default function OfficerNotificationsPage() {
  const { state, markAllNotificationsRead } = useEAnudaan();
  const mine = state.session
    ? state.notifications.filter((n) => n.audience.includes(state.session!))
    : [];
  const unread = mine.filter((n) => !n.read).length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-headline-1 text-ink">Notifications</h1>
          <p className="mt-1 text-body-2 text-ink-muted">{unread} unread</p>
        </div>
        {unread > 0 && (
          <Button appearance="outlined" onClick={markAllNotificationsRead}>
            Mark all read
          </Button>
        )}
      </div>

      {mine.length === 0 ? (
        <EmptyState title="Nothing to read" description="You have no notifications." />
      ) : (
        <ul className="space-y-3">
          {mine.map((n) => (
            <li key={n.id} className="rounded-xl border border-line bg-surface p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-ink">{n.title}</p>
                  <p className="mt-1 text-body-2 text-ink-muted">{n.body}</p>
                </div>
                {!n.read && <Badge status="info">New</Badge>}
              </div>
              <p className="mt-2 text-body-3 text-ink-hint">{formatDate(n.at)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
