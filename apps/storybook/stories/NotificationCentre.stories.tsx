import type { Meta, StoryObj } from "@storybook/react";
import { NotificationCentre, type EventItem } from "@mosje/design-system";

/**
 * The panel behind the bell — what has happened that this officer has not seen.
 *
 * **Use it** as the contents of a notifications panel or a notifications page.
 *
 * **Do not use it** as a floating widget of its own. The corner and the right
 * wall are both spoken for, so the panel is placed by whatever opens it — a
 * `Popover` from the masthead bell, or a page.
 *
 * It renders `EventList` grouped by day, so a notification and the same event in
 * the audit log look identical — an officer who reads "Returned for correction"
 * in the panel recognises the same sentence on the case itself.
 *
 * `notifications` is the same `EventItem` shape every other event surface uses,
 * newest first. `label` is the heading and the accessible name. `onMarkAllRead`
 * is offered only when something is unread, named by `markAllLabel`; a control
 * that does nothing most of the time teaches people to ignore it. `emptyText` is
 * the up-to-date state, which is a good state and reads like one.
 *
 * The unread count sits in a polite live region, so a screen-reader user learns
 * that three things arrived without opening the panel and counting.
 */
const meta = {
  title: "Data Display/NotificationCentre",
  component: NotificationCentre,
  parameters: { layout: "padded" },
} satisfies Meta<typeof NotificationCentre>;

export default meta;
type Story = StoryObj<typeof meta>;

const NOTICES: EventItem[] = [
  {
    id: "n4",
    at: "2026-09-06T09:20:00+05:30",
    actor: "R. Krishnan",
    actorRole: "District Nodal Officer",
    action: "Returned for correction",
    subject: "Application 2026/PMS/01284",
    tone: "warning",
    unread: true,
    href: "#case-1284",
  },
  {
    id: "n3",
    at: "2026-09-06T08:05:00+05:30",
    action: "Nightly scrutiny queue rebuilt",
    tone: "neutral",
    unread: true,
  },
  {
    id: "n2",
    at: "2026-09-05T17:44:00+05:30",
    actor: "Sunita Devi",
    actorRole: "State Nodal Officer",
    action: "Approved",
    subject: "Application 2026/PMS/01192",
    tone: "success",
    href: "#case-1192",
  },
  {
    id: "n1",
    at: "2026-09-05T11:02:00+05:30",
    actor: "Meena Kumari",
    actorRole: "Applicant",
    action: "Uploaded a replacement document",
    subject: "Application 2026/PMS/01284",
    tone: "info",
    href: "#case-1284",
  },
];

export const Playground: Story = {
  args: { notifications: NOTICES, onMarkAllRead: () => {} },
};

/** Everything read — the control to mark them disappears, because there is nothing to mark. */
export const AllRead: Story = {
  args: {
    notifications: NOTICES.map((notice) => ({ ...notice, unread: false })),
    onMarkAllRead: () => {},
  },
};

/** Up to date, which is a good state and reads like one. */
export const Empty: Story = {
  args: { notifications: [], label: "Notifications", markAllLabel: "Mark all as read" },
};
