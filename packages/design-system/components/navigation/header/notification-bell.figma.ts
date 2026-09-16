// url=<SAMAVESH>?node-id=58143-59613
// source=packages/design-system/components/navigation/header/notification-bell.tsx
// component=NotificationBell
//
// The signed-in reader's notifications control. `SiteHeader` renders it immediately
// before the account block when a portal passes `notifications` (Figma: Navbar/Portal,
// Notifications on); import it directly only for chrome that needs the control
// without a masthead.
//
// PROPERTY COVERAGE
//   Badge=None  -> notificationCount(items) is 0, or status "loading"
//   Badge=Count -> items holding unread updates or action-required entries. The
//                  number is DERIVED — there is no prop for it, so a designer's "3"
//                  cannot drift from the feed.
//   Badge=Error -> status: "error"
//   State       -> deliberatelyOmitted. Default · Hover · Focused are CSS states of
//                  one control; the open panel uses Hover's ground.
//
// What counts as a notification — and what does not (an officer's work queue, an
// administrator's broadcast) — is docs/specs/notification-object.md.
import figma from "figma";

const instance = figma.selectedInstance;
const badge = instance.getEnum("Badge", { None: "none", Count: "count", Error: "error" });

export default {
  example: figma.code`<NotificationBell
  linkAs={Link}
  notifications={{
    items,                                   // EventItem[], newest first
    href: "/portals/<slug>/notifications",   // required — the phone bell links here${badge === "error" ? figma.code`
    status: "error",
    onRetry: refetch,` : ""}
    onMarkAllRead,
  }}
/>`,
  imports: ['import { NotificationBell } from "@mosje/design-system"', 'import Link from "next/link"'],
  id: "navbar-notification-bell",
  metadata: { nestable: true },
};
