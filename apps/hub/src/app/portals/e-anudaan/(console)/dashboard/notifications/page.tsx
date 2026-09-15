"use client";

import { Button, EmptyState, EventList, PageHeader } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { isReadBy } from "@/lib/e-anudaan/store/persistence";
import { ROLES, reviewKeyOf } from "@/lib/e-anudaan/roles";

export default function OfficerNotificationsPage() {
  const { state, markAllNotificationsRead } = useEAnudaan();
  const role = state.session && state.session !== "ngo" ? ROLES[state.session] : null;
  const mine = state.session
    ? state.notifications.filter((n) => n.audience.includes(state.session!))
    : [];
  const unread = mine.filter((n) => !isReadBy(n, state.session)).length;
  // A notification about an application opens that application's review screen for this officer.
  // A role that reviews nothing (the PMU) has no review screen to link to.
  const key = role?.caps.includes("review") ? reviewKeyOf(role) : null;
  const reviewBase = key ? `/portals/e-anudaan/dashboard/sm2/${key}/review` : null;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Notifications"
        meta={`${unread} Unread`}
        actions={
          unread > 0 ? (
            <Button appearance="outlined" onClick={markAllNotificationsRead}>
              Mark All as Read
            </Button>
          ) : undefined
        }
      />

      {mine.length === 0 ? (
        <EmptyState title="No Notifications" description="You have no notifications." />
      ) : (
        <EventList
          label="Notifications"
          unreadLabel="New"
          events={mine.map((n) => ({
            id: n.id,
            at: n.at,
            action: n.title,
            note: n.body,
            unread: !isReadBy(n, state.session),
            icon: "notifications",
            href: n.applicationId && reviewBase ? `${reviewBase}/${encodeURIComponent(n.applicationId)}` : undefined,
          }))}
        />
      )}
    </div>
  );
}
