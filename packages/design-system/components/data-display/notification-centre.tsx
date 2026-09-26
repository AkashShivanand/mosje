"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { Button } from "../actions/button";
import { Skeleton } from "../feedback/skeleton";
import { EventList, type EventItem } from "./event-list";
import "./notification-centre.css";

/** Where the feed stands. `ready` covers both empty and populated. */
export type NotificationStatus = "loading" | "error" | "ready";

/**
 * THE count — entries that need action plus unread updates.
 *
 * Exported so every surface that prints a notification count calls the same
 * expression: the bell's badge, a page's "3 unread", a dashboard tile. Two
 * surfaces computing their own figure from one feed is how a page ends up
 * showing two contradictory numbers (`data-state-completeness.md` §2).
 */
export function notificationCount(items: readonly EventItem[]): number {
  return items.filter((item) => item.actionRequired || item.unread).length;
}

export interface NotificationCentreProps {
  /**
   * Notifications, newest first — the EventItem shape. Entries with
   * `actionRequired` are lifted into their own section at the top, whatever
   * their position here.
   */
  notifications: EventItem[];
  /**
   * The panel's heading, and its accessible name.
   * @default "Notifications"
   */
  label?: string;
  /**
   * The heading element. `h1` when the panel IS the page (a portal's
   * notifications page), `h2` as a section of one; a popover cannot know what
   * level it nests under, so the masthead bell passes `"p"`.
   * @default "h2"
   */
  titleAs?: "h1" | "h2" | "h3" | "p";
  /**
   * Marks the UPDATES as read. Offered only when an update is unread. It never
   * touches an action-required entry — that clears when its record changes.
   */
  onMarkAllRead?: () => void;
  /** @default "Mark updates as read" */
  markAllLabel?: string;
  /** @default "Nothing new. You are up to date." */
  emptyText?: string;
  /** @default "ready" */
  status?: NotificationStatus;
  /** Offered in the error state. Without it the error still renders, without a button. */
  onRetry?: () => void;
  /** @default "Notifications could not be loaded." */
  errorText?: string;
  /** @default "Try again" */
  retryLabel?: string;
  /**
   * Show at most this many UPDATES; the rest are one link away at `viewAllHref`.
   * Action-required entries are never cut — hiding one is the failure this
   * component exists to prevent. Omit on the notifications page itself.
   */
  limit?: number;
  /** The full notifications page. Rendered as a link under the list. */
  viewAllHref?: string;
  /** @default "View All Notifications" */
  viewAllLabel?: string;
  /** @default "Action Needed" */
  actionHeading?: string;
  /** Shown above the updates only when an Action Needed section precedes them. @default "Updates" */
  updatesHeading?: string;
  /**
   * What "now" is, for marking an entry whose `dueAt` has passed as Overdue. Passed straight to
   * `EventList`; resolve it once per page and hand the same value to every list on the screen.
   * Omitted, only an item's own `overdue` marks one.
   */
  now?: string | number | Date;
  /** The app's router link (`next/link`). Defaults to a plain anchor. */
  linkAs?: React.ElementType;
  className?: string;
}

/**
 * The panel behind the bell — what has happened that this reader has not seen.
 *
 * It renders `EventList`, so a notification and the same event in the audit log
 * look identical. What a notification IS on this estate — and what it is not (an
 * officer's work queue, an administrator's broadcast) — is written down in
 * `docs/specs/notification-object.md`.
 *
 * Five rules:
 *
 * 1. **Action before news.** An entry the reader must act on sits under "Action
 *    Needed" at the top, is never cut by `limit`, and is never cleared by
 *    "Mark updates as read". It leaves when its record no longer needs the action.
 * 2. **The count is announced, politely**, and it is `notificationCount` — the
 *    same expression the bell's badge uses.
 * 3. **"Mark updates as read" appears only when an update is unread.** A control
 *    that does nothing most of the time teaches people to ignore it.
 * 4. **Every state is written.** Loading is a skeleton in the shape of the list;
 *    an error says so and offers the retry; empty reads as the good news it is.
 * 5. **It does not place itself.** A `Popover` from the masthead bell, or a page
 *    of its own — the corner and wall rails are spoken for
 *    (`floating-element-placement.md`).
 */
export function NotificationCentre({
  notifications,
  label = "Notifications",
  titleAs: Title = "h2",
  onMarkAllRead,
  markAllLabel = "Mark updates as read",
  emptyText = "Nothing new. You are up to date.",
  status = "ready",
  onRetry,
  errorText = "Notifications could not be loaded.",
  retryLabel = "Try again",
  limit,
  viewAllHref,
  viewAllLabel = "View All Notifications",
  actionHeading = "Action Needed",
  updatesHeading = "Updates",
  now,
  linkAs,
  className,
}: NotificationCentreProps): React.JSX.Element {
  const headingId = React.useId();
  const actions = notifications.filter((item) => item.actionRequired);
  const updates = notifications.filter((item) => !item.actionRequired);
  const shownUpdates = limit === undefined ? updates : updates.slice(0, Math.max(0, limit));
  const unreadUpdates = updates.filter((item) => item.unread).length;
  const count = notificationCount(notifications);
  /* Section headings sit one level under the panel's, and days one under the
     "Updates" heading when there is one; a `p` panel keeps `p` all the way down. */
  const SectionTitle = ({ h1: "h2", h2: "h3", h3: "h4", p: "p" } as const)[Title];
  const DayTitle = ({ h2: "h3", h3: "h4", h4: "p", p: "p" } as const)[SectionTitle];
  const LinkTag = linkAs ?? "a";

  let countText: string;
  if (status === "loading") countText = "Loading notifications";
  /* The error block below says it, once — printing it here too reads it twice. */
  else if (status === "error") countText = "";
  else if (count === 0) countText = "No unread notifications";
  else {
    const parts: string[] = [];
    if (actions.length > 0) parts.push(`${actions.length} need${actions.length === 1 ? "s" : ""} action`);
    if (unreadUpdates > 0) parts.push(`${unreadUpdates} unread`);
    countText = parts.join(" · ");
  }

  return (
    <section
      className={cn("ds-notices", className)}
      aria-labelledby={headingId}
      aria-busy={status === "loading" || undefined}
    >
      {/* A div, not a <header> — a header here would be a second `banner` landmark. */}
      <div className="ds-notices__head">
        <Title id={headingId} className="ds-notices__title">
          {label}
        </Title>
        <p className="ds-notices__count" role="status" aria-live="polite">
          {countText}
        </p>
        {status === "ready" && unreadUpdates > 0 && onMarkAllRead ? (
          <Button appearance="text" size="sm" onClick={onMarkAllRead}>
            {markAllLabel}
          </Button>
        ) : null}
      </div>

      {status === "loading" ? (
        <div className="ds-notices__loading" aria-hidden="true">
          <Skeleton className="ds-notices__skeleton" />
          <Skeleton className="ds-notices__skeleton" />
          <Skeleton className="ds-notices__skeleton" />
        </div>
      ) : status === "error" ? (
        <div className="ds-notices__error">
          <p className="ds-notices__error-text" role="status">
            {errorText}
          </p>
          {onRetry ? (
            <Button appearance="outlined" size="sm" onClick={onRetry}>
              {retryLabel}
            </Button>
          ) : null}
        </div>
      ) : (
        <>
          {actions.length > 0 ? (
            <div className="ds-notices__section">
              <SectionTitle className="ds-notices__section-title">{actionHeading}</SectionTitle>
              <EventList
                events={actions}
                label={`${label} — ${actionHeading}`}
                showActionTag={false}
                now={now}
                linkAs={linkAs}
                grouping="none"
              />
            </div>
          ) : null}
          {updates.length > 0 || actions.length === 0 ? (
            <div className="ds-notices__section">
              {actions.length > 0 ? (
                <SectionTitle className="ds-notices__section-title">{updatesHeading}</SectionTitle>
              ) : null}
              <EventList
                events={shownUpdates}
                label={actions.length > 0 ? `${label} — ${updatesHeading}` : label}
                now={now}
                grouping="day"
                dayHeadingAs={actions.length > 0 ? DayTitle : SectionTitle}
                emptyText={emptyText}
                linkAs={linkAs}
              />
            </div>
          ) : null}
        </>
      )}

      {viewAllHref && status !== "loading" ? (
        <LinkTag className="ds-notices__all" href={viewAllHref}>
          {viewAllLabel}
        </LinkTag>
      ) : null}
    </section>
  );
}
