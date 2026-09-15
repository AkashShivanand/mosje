import type { Meta, StoryObj } from "@storybook/react";
import { EventList, type EventItem } from "@mosje/design-system";

/**
 * A dated, attributed record of things that happened — the activity log and the
 * audit trail, and the base `CommentThread` and `NotificationCentre` compose.
 *
 * **Use it** wherever the screen answers "what has happened to this?": an audit
 * log, a case history, a recent-activity panel.
 *
 * **Do not use it** for an approval chain with a fixed vocabulary of steps — that
 * is `ApprovalTimeline`, which knows what SUBMITTED and RETURNED mean and draws
 * the chain between them.
 *
 * `events` is rendered in the order it is handed over: the component does not
 * sort, because the caller knows whether newest or oldest belongs at the top and
 * it does not. A log is newest-first; a thread is oldest-first.
 *
 * Each entry carries `id`, `at` (ISO, rendered inside a `<time>`), `action` and
 * optionally `actor`, `actorRole`, `subject`, `note`, `icon`, `tone`, `unread`
 * and `href`. A missing `actor` renders as "System" rather than as a blank,
 * because on an audit trail a blank reads as missing data. `note` is quoted and
 * never truncated. `unread` adds a visually hidden word — named by
 * `unreadLabel` — as well as the dot, because a dot alone is invisible to a
 * screen reader.
 *
 * `label` is required and names the list. `grouping="day"` puts a dated heading
 * above each day and drops the date from each row; `"none"` prints the full
 * stamp on every row. `emptyText` is the sentence shown when there is nothing,
 * and it is a real answer rather than a blank panel.
 */
const meta = {
  title: "Data Display/EventList",
  component: EventList,
  parameters: { layout: "padded" },
} satisfies Meta<typeof EventList>;

export default meta;
type Story = StoryObj<typeof meta>;

const LOG: EventItem[] = [
  {
    id: "4",
    at: "2026-09-04T15:42:00+05:30",
    actor: "Sunita Devi",
    actorRole: "State Nodal Officer",
    action: "Approved",
    subject: "Application 2026/PMS/01284",
    tone: "success",
    icon: "check_circle",
  },
  {
    id: "3",
    at: "2026-09-02T11:05:00+05:30",
    actor: "R. Krishnan",
    actorRole: "District Nodal Officer",
    action: "Returned for correction",
    subject: "Application 2026/PMS/01284",
    tone: "warning",
    note: "The income certificate is issued by the block office. A certificate issued by the tehsildar is required.",
  },
  {
    id: "2",
    at: "2026-09-01T09:18:00+05:30",
    action: "Documents scanned and found clean",
    tone: "neutral",
  },
  {
    id: "1",
    at: "2026-08-31T18:30:00+05:30",
    actor: "Meena Kumari",
    actorRole: "Applicant",
    action: "Submitted",
    subject: "Application 2026/PMS/01284",
    tone: "info",
  },
];

export const Playground: Story = {
  args: { events: LOG, label: "Case history" },
};

/** Grouped by day — the right shape for a log that runs to several screens. */
export const GroupedByDay: Story = {
  args: { events: LOG, label: "Audit log", grouping: "day" },
};

/**
 * A log with nothing in it is a real answer, not a broken panel, so the empty
 * state is written rather than left blank.
 */
export const Empty: Story = {
  args: { events: [], label: "Audit log", emptyText: "No activity has been recorded against this application yet." },
};

/**
 * Unread entries carry a hidden word as well as the dot. `unreadLabel` names it,
 * so a Hindi surface can say so in Hindi.
 */
export const Unread: Story = {
  args: {
    label: "Recent activity",
    unreadLabel: "Unread",
    events: LOG.map((event, index) => ({ ...event, unread: index < 2, href: "#case" })),
  },
};

/**
 * An entry the reader must act on. `actionRequired` prints the `actionLabel` tag and,
 * with `dueAt`, the deadline after `dueLabel`. A caller that already heads the group
 * with the same words — `NotificationCentre` does — passes `showActionTag={false}` so
 * it is not said twice. `dayHeadingAs` sets the day heading's element for a panel that
 * cannot know its nesting level, and `linkAs` hands entries with an `href` the app's
 * router link (`next/link`).
 */
export const ActionRequired: Story = {
  args: {
    label: "Recent activity",
    actionLabel: "Action Needed",
    dueLabel: "Respond by",
    events: [
      { ...LOG[0]!, id: "action", actionRequired: true, dueAt: "2026-09-30", tone: "warning" },
      ...LOG.slice(1),
    ],
  },
};
