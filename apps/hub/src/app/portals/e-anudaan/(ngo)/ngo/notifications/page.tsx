"use client";

/**
 * Notifications — the applicant's feed.
 *
 * DS Audit: PageHeader ✅ existing · EventList ✅ · Button ✅ · EmptyState ✅ · Icon ✅ — nothing new.
 * The hand-built card per notification is EventList's row now: the title is the link to the
 * application, the unread dot replaces the "New" badge, and the stamp is EventList's own.
 *
 * The live screen shows "<n> unread", a mark-all-read action, and an "Open →" link on any item
 * that names an application. Timestamps use the portal's one shape: "17 Aug 2026, 04:59 PM".
 */

import { useRouter } from "next/navigation";
import { Button, EmptyState, EventList, Icon, PageHeader } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { isReadBy } from "@/lib/e-anudaan/store/persistence";
import { routeLinksWithin } from "@/components/e-anudaan/ngo-shell";

export default function NgoNotificationsPage() {
  const router = useRouter();
  const { state, markAllNotificationsRead } = useEAnudaan();
  const mine = state.notifications.filter((n) => n.audience.includes("ngo"));
  const unread = mine.filter((n) => !isReadBy(n, "ngo")).length;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Notifications"
        meta={`${unread} unread`}
        actions={
          unread > 0 ? (
            <Button appearance="outlined" onClick={markAllNotificationsRead}>
              <Icon name="mark_email_read" size={16} aria-hidden /> Mark All as Read
            </Button>
          ) : undefined
        }
      />

      {mine.length === 0 ? (
        <EmptyState title="No notifications." description="Updates on your applications will appear here." />
      ) : (
        /* EventList draws a plain anchor for an item that names an application; the click is
           handed to the router so opening one does not reload the portal. */
        <div onClick={routeLinksWithin(router)}>
          <EventList
            label="Notifications"
            events={mine.map((n) => ({
              id: n.id,
              at: n.at,
              action: n.title,
              note: n.body,
              icon: "notifications",
              tone: isReadBy(n, "ngo") ? "neutral" : "info",
              unread: !isReadBy(n, "ngo"),
              href: n.applicationId ? `/portals/e-anudaan/ngo/my-applications/${encodeURIComponent(n.applicationId)}` : undefined,
            }))}
          />
        </div>
      )}
    </div>
  );
}
