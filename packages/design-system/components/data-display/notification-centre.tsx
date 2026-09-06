"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { Button } from "../actions/button";
import { EventList, type EventItem } from "./event-list";
import "./notification-centre.css";

export interface NotificationCentreProps {
  /** Notifications, newest first. The same shape every other event surface uses. */
  notifications: EventItem[];
  /**
   * The panel's heading, and its accessible name.
   * @default "Notifications"
   */
  label?: string;
  /** Offered only when something is unread. */
  onMarkAllRead?: () => void;
  /** @default "Mark all as read" */
  markAllLabel?: string;
  /** @default "Nothing new. You are up to date." */
  emptyText?: string;
  className?: string;
}

/**
 * The panel behind the bell — what has happened that this officer has not seen.
 *
 * It renders `EventList` grouped by day, so a notification and the same event in
 * the audit log look identical. That is the point: an officer who reads
 * "Returned for correction — Application 2026/PMS/01284" in the panel should
 * recognise the same sentence on the case itself.
 *
 * Three rules:
 *
 * 1. **The unread count is announced, politely.** It sits in a live region, so a
 *    screen-reader user learns that three things arrived without having to open
 *    the panel and count. Polite, because notifications arrive while the reader
 *    is doing something else.
 * 2. **"Mark all as read" appears only when there is something to mark.** A
 *    permanently visible control that does nothing most of the time teaches
 *    people to ignore it.
 * 3. **Empty is a good state and reads like one.** "Nothing new. You are up to
 *    date" is the answer; an empty panel is a fault report.
 *
 * It is NOT a floating widget. The panel is placed by whatever opens it — a
 * `Popover` from the masthead bell, or a page of its own — because the corner
 * and wall rails are already spoken for (`floating-element-placement.md`).
 */
export function NotificationCentre({
  notifications,
  label = "Notifications",
  onMarkAllRead,
  markAllLabel = "Mark all as read",
  emptyText = "Nothing new. You are up to date.",
  className,
}: NotificationCentreProps): React.JSX.Element {
  const unread = notifications.filter((notification) => notification.unread).length;
  const headingId = React.useId();

  return (
    <section className={cn("ds-notices", className)} aria-labelledby={headingId}>
      <header className="ds-notices__head">
        <h2 id={headingId} className="ds-notices__title">
          {label}
        </h2>
        <p className="ds-notices__count" role="status" aria-live="polite">
          {unread === 0 ? "No unread notifications" : `${unread} unread notification${unread === 1 ? "" : "s"}`}
        </p>
        {unread > 0 && onMarkAllRead ? (
          <Button appearance="text" size="sm" onClick={onMarkAllRead}>
            {markAllLabel}
          </Button>
        ) : null}
      </header>
      <EventList events={notifications} label={label} grouping="day" emptyText={emptyText} />
    </section>
  );
}
