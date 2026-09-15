"use client";

/**
 * Notifications — an officer's updates, and the page the masthead bell leads to.
 *
 * DS Audit: NotificationCentre ✅ existing — nothing new.
 *
 * An officer's work queue is NOT here: files awaiting action are counted on the dashboard, and
 * repeating that count would give two answers to one question (docs/specs/notification-object.md).
 * The page reads the same selector as the bell.
 */

import Link from "next/link";
import { NotificationCentre } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { notificationItems } from "@/lib/e-anudaan/notifications";

export default function OfficerNotificationsPage() {
  const { state, markAllNotificationsRead } = useEAnudaan();

  return (
    <NotificationCentre
      notifications={notificationItems(state, state.session)}
      titleAs="h1"
      onMarkAllRead={markAllNotificationsRead}
      linkAs={Link}
    />
  );
}
