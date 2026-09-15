"use client";

import * as React from "react";
import { cn } from "../../../utils/cn";
import { Icon } from "../../utilities/icon";
import { Popover } from "../../feedback/popover";
import { NotificationCentre, notificationCount } from "../../data-display/notification-centre";
import type { HeaderNotifications } from "./types";
import "./notification-bell.css";

export interface NotificationBellProps {
  notifications: HeaderNotifications;
  /** The app's router link (`next/link`). Defaults to a plain anchor. */
  linkAs?: React.ElementType;
  className?: string;
}

/** Above nine the number stops being read and starts being counted. */
function badgeText(count: number): string {
  return count > 9 ? "9+" : String(count);
}

/**
 * NotificationBell — the masthead's notifications control (Figma: Navbar/NotificationBell).
 *
 * `SiteHeader` places it immediately before the account block when a portal
 * passes `notifications`. It is exported for a surface that needs the control
 * without the whole masthead.
 *
 * ── TWO ELEMENTS, ONE CONTROL ──────────────────────────────────────────────
 * From 768 up it is a button that opens a `Popover` holding
 * `NotificationCentre`. Below 768 it is a LINK to the notifications page, because
 * a 380px panel over a phone form is a sheet nobody asked for. Both are rendered
 * and CSS shows one, so the choice follows the layout viewport — a desktop reader
 * at 400% zoom gets the link, which is the behaviour that works at that width.
 *
 * ── THE BADGE IS BLUE, AND IT IS NOT THE ANNOUNCEMENT ─────────────────────
 * Red means a rejected application on this estate, so the count is brand
 * primary. The badge is `aria-hidden`; the number is in the control's name,
 * "Notifications, 3 new", so a screen-reader user hears it on focus.
 *
 * ── STATES ─────────────────────────────────────────────────────────────────
 * loading: no badge, the name says "loading". error: a warning mark instead of a
 * number (the neutral Badge, never amber — 2.35:1 on white) — hiding the badge would claim
 * "nothing new", which is not known. Zero:
 * no badge at all.
 */
export function NotificationBell({
  notifications,
  linkAs,
  className,
}: NotificationBellProps): React.JSX.Element {
  const {
    items,
    href,
    status = "ready",
    onRetry,
    onMarkAllRead,
    onOpen,
    onNavigate,
    limit = 6,
    label = "Notifications",
  } = notifications;
  const count = notificationCount(items);
  const LinkTag = linkAs ?? "a";

  let name = label;
  if (status === "loading") name = `${label}, loading`;
  else if (status === "error") name = `${label}, could not be loaded`;
  else if (count > 0) name = `${label}, ${count} new`;

  const glyph = (
    <>
      <Icon name="notifications" size={24} aria-hidden="true" />
      {status === "error" ? (
        <span className="ds-hdr-bell__badge ds-hdr-bell__badge--error" aria-hidden="true">
          !
        </span>
      ) : status === "ready" && count > 0 ? (
        <span className="ds-hdr-bell__badge" aria-hidden="true">
          {badgeText(count)}
        </span>
      ) : null}
    </>
  );

  return (
    <span className={cn("ds-hdr-bell", className)}>
      <Popover
        label={label}
        align="end"
        className="ds-hdr-bell__panel"
        onOpenChange={(open) => {
          if (open) onOpen?.();
        }}
        content={({ close }) => (
          /* A link inside the panel routes client-side, so the masthead — and this
             popover — stays mounted. Close on the way out, or the panel sits open
             over the page it just opened. */
          <div
            onClickCapture={(event) => {
              if ((event.target as HTMLElement).closest("a")) close();
            }}
          >
            <NotificationCentre
              notifications={items}
              label={label}
              titleAs="p"
              status={status}
              onRetry={onRetry}
              onMarkAllRead={onMarkAllRead}
              limit={limit}
              viewAllHref={href}
              linkAs={linkAs}
            />
          </div>
        )}
      >
        <button
          type="button"
          className="ds-hdr-bell__btn ds-hdr-bell__btn--panel"
          aria-label={name}
          aria-busy={status === "loading" || undefined}
        >
          {glyph}
        </button>
      </Popover>
      <LinkTag
        className="ds-hdr-bell__btn ds-hdr-bell__btn--link"
        href={href}
        aria-label={name}
        onClick={onNavigate}
      >
        {glyph}
      </LinkTag>
    </span>
  );
}
