import type { Metadata } from "next";
import * as React from "react";

import {
  Callout,
  CodeBlock,
  ComponentDocPage,
  MatrixTable,
  PropsTable,
  type A11yItem,
  type PropDef,
} from "@/components/design-system/docs-kit";

import { NotificationBellSpecimen } from "./notification-bell-specimen";

export const metadata: Metadata = {
  title: "Notification Bell — Design System",
  description:
    "The signed-in reader's notifications control in the portal masthead, immediately before the account block. Off unless a portal has a real feed and a notifications page.",
};

/*
 * `HeaderNotifications` is a data shape rather than component props, so it is
 * documented here by hand — it is the half of the API a portal actually writes.
 */
const SHAPE: PropDef[] = [
  { name: "items", type: "EventItem[]", required: true,
    description: "Newest first. The badge is notificationCount(items): entries with actionRequired plus unread updates. There is no count prop, so the number cannot drift from the feed." },
  { name: "href", type: "string", required: true,
    description: "The portal's notifications page. Required: below 768px the bell is a link to it, and the panel's View All Notifications leads there. No page, no bell." },
  { name: "status", type: '"loading" | "error" | "ready"', default: '"ready"',
    description: "Loading shows no badge and a busy name. Error shows a warning mark instead of a number, because hiding the badge would claim nothing is new." },
  { name: "onRetry", type: "() => void", description: "Offered in the panel's error state." },
  { name: "onMarkAllRead", type: "() => void", description: "Marks unread updates as read. Action-required entries are untouched; they clear when their record changes." },
  { name: "onOpen", type: "() => void", description: "Fired when the desktop panel opens." },
  { name: "onNavigate", type: "(event) => void", description: "Fired when the phone link is followed. The design system does not own the router, so a portal guarding unsaved form edits cancels here with event.preventDefault()." },
  { name: "limit", type: "number", default: "6", description: "Updates shown in the panel. Action-required entries are never cut." },
  { name: "label", type: "string", default: '"Notifications"', description: "The panel's name and the start of the control's accessible name." },
];

const A11Y: A11yItem[] = [
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    status: "verified",
    evidence: 'Read from the rendered DOM on this page: the desktop control is a <button> with aria-label "Notifications, 3 new", aria-haspopup="dialog" and aria-expanded; the panel is role="dialog" named "Notifications". Below 768px the same name is on an <a href>.',
    description: "The count is in the control's name; the badge itself is aria-hidden.",
  },
  {
    criterion: "4.1.3 Status Messages",
    level: "AA",
    status: "verified",
    evidence: 'Inherited from Notification Centre and read from the DOM: "1 needs action · 2 unread" is role="status" aria-live="polite"; the error text is role="status".',
    description: "What changed is announced without moving focus.",
  },
  {
    criterion: "1.4.1 Use of Colour",
    level: "A",
    status: "verified",
    evidence: "Read from the DOM: action-required entries sit under a heading, not only a coloured rule; unread entries carry a visually hidden \"Unread:\".",
    description: "Nothing is told by colour alone — the badge is blue, never red, and the words carry the meaning.",
  },
  {
    criterion: "1.4.10 Reflow",
    level: "AA",
    status: "verified",
    evidence: "Read from computed styles on this branch: at viewports under 768 CSS px the panel button is display:none and the link to the notifications page is shown (checked at 375 and at a 750px pane), so a 1280 or 1440 laptop at 200% zoom gets the page, not a 24rem panel. Where the panel does open, it is max-block-size min(40rem, 70vh) and scrolls itself.",
    description: "No panel wider than a phone; the panel scrolls rather than overflowing the viewport.",
  },
  {
    criterion: "1.4.11 Non-text Contrast",
    level: "AA",
    status: "verified",
    evidence: "Computed from the resolved tokens: the count badge (cmp/button/primary/bg) is #0373df at 4.64:1 against the white masthead in the blue mode and #224c7d at 8.76:1 in navy; the error badge (neutral solid) is #1e2124 at 16:1. The amber Warning badge was rejected at 2.35:1.",
    description: "The badge holds 3:1 against the masthead in both brand modes, in every state.",
  },
];

export default function NotificationBellPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Notification Bell"
      status="Beta"
      summary="The signed-in reader's notifications control, immediately before the account block. It opens Notification Centre on a desktop and leads to the notifications page on a phone. A portal switches it on only when it has a real feed and a notifications page."
      figma={{ node: "notificationBell" }}
      specimen={<NotificationBellSpecimen />}
      propsFrom="NotificationBellProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A signed-in portal whose readers receive updates about their own applications or cases.",
          "Replacing a sidebar or account-menu Notifications item — the bell is the one door, not a second.",
        ],
        avoid: [
          "An officer's work queue. Files awaiting action already have a count on the dashboard; repeating it gives two answers to one question.",
          "An administrator's broadcast tool. Sending is not receiving — name that page Broadcasts.",
          "A portal with no feed yet. A badge that never changes teaches people not to look at it.",
          "Public pages. With nobody signed in there is nothing to count, and SiteHeader renders no bell without an account.",
        ],
      }}
      related={[
        { label: "Notification Centre", href: "/design-system/components/data-display/notification-centre", reason: "the panel it opens, and the notifications page itself" },
        { label: "Account Menu", href: "/design-system/components/navigation/account-menu", reason: "its neighbour; the account keeps the row's outer edge" },
        { label: "Navbar (Header)", href: "/design-system/components/section-templates/site-header", reason: "renders it from the notifications prop" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-place">
            <h2 id="cdp-place" className="cdp__h2">Immediately Before the Account</h2>
            <p>
              The bell and the account are both about the signed-in reader, so they sit together at
              the end of the row, and the account keeps the outer edge. The bell stays in the
              condensed bar on scroll, and on a phone it sits beside the avatar. It is never in the
              accessibility bar, which holds statutory controls and disappears on scroll, and never
              inside the account menu, where a reader who signs in twice a year would not look.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-badge">
            <h2 id="cdp-badge" className="cdp__h2">The Badge</h2>
            <MatrixTable
              caption="What each Badge value means"
              columns={["Badge", "When", "Shows"]}
              rows={[
                ["None", "Nothing new, or still loading", "No badge"],
                ["Count", "Action-required entries or unread updates", "The number, 9+ above nine"],
                ["Error", "The feed failed", "An exclamation mark on the neutral Badge — the count is not known"],
              ]}
            />
            <Callout type="info" title="Blue, never red">
              Red means a rejected application on this estate. The count uses the library&rsquo;s
              Badge in its primary solid form; a failed feed uses the neutral solid Badge, because the amber one
              is 2.35:1 against the white masthead.
            </Callout>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-one-door">
            <h2 id="cdp-one-door" className="cdp__h2">One Door, One Count</h2>
            <p>
              Where the bell is on, remove the sidebar&rsquo;s Notifications item and any
              account-menu item that leads to the same page. Compute every count on the page with{" "}
              <code>notificationCount</code>, so the bell and the notifications page cannot disagree.
            </p>
          </section>
        </>
      }
      code={
        <>
          <section className="cdp__section" aria-labelledby="cdp-shape">
            <h2 id="cdp-shape" className="cdp__h2">HeaderNotifications</h2>
            <PropsTable props={SHAPE} />
          </section>
          <section className="cdp__section" aria-labelledby="cdp-example">
            <h2 id="cdp-example" className="cdp__h2">Example</h2>
            <CodeBlock>{`import Link from "next/link";
import { SiteHeader } from "@mosje/design-system";

<SiteHeader
  variant="portal"
  linkAs={Link}
  account={{ name: "Sankalp Seva Sansthan", role: "NGO Applicant" }}
  notifications={{
    items,                                    // one selector, shared with the page
    href: "/portals/e-anudaan/ngo/notifications",
    onMarkAllRead: markAllRead,
  }}
  /* …the rest of the masthead… */
/>`}</CodeBlock>
          </section>
        </>
      }
    />
  );
}
