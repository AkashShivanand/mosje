import type { Meta, StoryObj } from "@storybook/react-vite";
import { NotificationBell, type EventItem } from "@mosje/design-system";

/**
 * **NotificationBell** — the signed-in reader's notifications control, placed by
 * `SiteHeader` immediately before the account block when a portal passes
 * `notifications`.
 *
 * From 768px up it opens `NotificationCentre` in a `Popover`; below 768 it is a
 * link to the notifications page. The badge is `notificationCount(items)` —
 * action-required entries plus unread updates — in the library's primary Badge,
 * never red, because red means a rejected application on this estate.
 *
 * **Use it** only in a portal with a real feed and a notifications page, and remove
 * the sidebar or account-menu item it replaces. **Do not** put an officer's work
 * queue in it (the dashboard already counts it) or an administrator's broadcasts.
 * `docs/specs/notification-object.md` defines what belongs.
 *
 * Pass `linkAs={Link}` from `next/link`: the phone bell, every entry and View All
 * route through it. A story has no router, so these fall back to plain anchors.
 *
 * Lifecycle: **Beta**.
 */
const ITEMS: EventItem[] = [
  { id: "a1", at: "2026-09-12T10:30:00+05:30", action: "Deficiency response requested",
    subject: "Application 2026/PMS/01284", actionRequired: true, dueAt: "2026-09-30", tone: "warning" },
  { id: "u2", at: "2026-09-12T09:10:00+05:30", action: "Application sanctioned",
    subject: "Application 2026/PMS/01192", tone: "success", unread: true },
  { id: "u1", at: "2026-09-11T16:45:00+05:30", action: "Application moved forward",
    subject: "Application 2026/PMS/01170", tone: "info", unread: true },
];

const meta = {
  title: "Components/Navigation/NotificationBell",
  component: NotificationBell,
  parameters: { layout: "centered" },
  args: { notifications: { items: ITEMS, href: "#notifications" } },
} satisfies Meta<typeof NotificationBell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Count: Story = {};

export const NothingNew: Story = {
  args: { notifications: { items: ITEMS.map((i) => ({ ...i, unread: false, actionRequired: false })), href: "#notifications" } },
};

export const Failed: Story = {
  args: { notifications: { items: [], status: "error", onRetry: () => {}, href: "#notifications" } },
};

export const Loading: Story = {
  args: { notifications: { items: [], status: "loading", href: "#notifications" } },
};
