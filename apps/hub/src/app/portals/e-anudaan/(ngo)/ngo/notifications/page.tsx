"use client";

/**
 * Notifications — the applicant's feed, and the page the masthead bell leads to.
 *
 * DS Audit: NotificationCentre ✅ existing (gained Action Needed, due dates and an Overdue mark) — nothing new.
 *
 * The live screen shows "<n> unread", a "Mark all read" action, and an "Open →" link on any item
 * that names an application. Both survive: the count is the panel's status line and the link is
 * the entry's own. Two things deliberately differ from the live screen, per
 * docs/specs/notification-object.md: an application waiting on the NGO sits at the top under
 * "Action Needed" and is not cleared by marking updates read; and the page reads the SAME
 * selector as the bell, so the two cannot show different counts.
 */

import Link from "next/link";
import { NotificationCentre } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { ngoNotifications, useNow } from "@/components/e-anudaan/ngo-shell";

export default function NgoNotificationsPage() {
  const { state, markAllNotificationsRead } = useEAnudaan();

  return (
    <NotificationCentre
      notifications={ngoNotifications(state)}
      titleAs="h1"
      now={useNow()}
      onMarkAllRead={markAllNotificationsRead}
      linkAs={Link}
    />
  );
}
