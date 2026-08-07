"use client";

import { PageHeader, Card } from "@/components/nhapoa/ui";
import { cn } from "@/lib/nhapoa/utils";
import { useNhapoa } from "@/lib/nhapoa/store/store";
import type { RoleId } from "@/lib/nhapoa/store/types";
import { Icon } from "@mosje/design-system";

/** Shared notifications list for any admin role. Reads role-scoped items from the store. */
export function NotificationsView({ role }: { role: RoleId }) {
  const { state, markNotificationRead } = useNhapoa();
  const items = state.notifications.filter((n) => n.role === role);
  const unread = items.filter((n) => !n.read).length;

  return (
    <div>
      <PageHeader title="Notifications" subtitle={`${unread} unread · ${items.length} total`} />
      {items.length === 0 ? (
        <Card className="flex flex-col items-center justify-center px-6 py-20 text-center">
          <Icon name="notifications_off" size={40} className="text-ink-hint" />
          <p className="mt-4 text-sm font-semibold text-ink">You&apos;re all caught up.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => markNotificationRead(n.id)}
              className={cn(
                "flex w-full items-start gap-3 rounded-2xl border bg-white p-4 text-left shadow-card transition-colors hover:bg-surface-muted/60",
                n.read ? "border-line" : "border-navy/30",
              )}
            >
              <span className={cn("mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full", n.read ? "bg-slate-100 text-ink-hint" : "bg-navy/10 text-navy")}>
                <Icon name="notifications" size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-ink">{n.title}</p>
                  {!n.read && <span className="h-2 w-2 rounded-full bg-saffron" />}
                </div>
                <p className="mt-0.5 text-sm text-ink-muted">{n.body}</p>
                <p className="mt-1 text-xs text-ink-hint">{new Date(n.at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
