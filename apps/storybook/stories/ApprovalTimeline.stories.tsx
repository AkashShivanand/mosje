import type { Meta, StoryObj } from "@storybook/react";
import { ApprovalTimeline, type ApprovalTimelineEvent } from "@mosje/design-system";

/**
 * **ApprovalTimeline** — who did what, when, on the way through an approval
 * chain.
 *
 * This is a **record**, not a progress bar. Every MoSJE workflow runs Block →
 * District → State, and when something is returned the applicant is entitled to
 * see which officer returned it and why. `Stepper` shows where you are;
 * this shows what happened, including the parts nobody wants to display.
 *
 * Two things follow:
 *
 * - **Events go oldest-first**, and a return is not deleted when the applicant
 *   resubmits. A timeline that quietly drops the rejection is worse than none.
 * - **`remarks` is required in practice for `RETURNED`.** "Returned for
 *   correction" with no reason gives the applicant nothing to act on, and is
 *   the single commonest complaint about these workflows.
 *
 * `pendingLabel` names the step that has not happened yet, so the applicant can
 * see who they are waiting on rather than assuming the process has stalled.
 *
 * Timestamps are ISO in, formatted `en-IN` out.
 *
 * Lifecycle: **Stable**.
 */
const SUBMITTED: ApprovalTimelineEvent = {
  at: "2026-08-18T10:12:00+05:30",
  actorDisplayName: "Imran Qureshi",
  actorRoleLabel: "Block Nodal Officer, Haveli",
  action: "SUBMITTED",
};

const RETURNED: ApprovalTimelineEvent = {
  at: "2026-08-19T15:40:00+05:30",
  actorDisplayName: "R. Kulkarni",
  actorRoleLabel: "District Nodal Officer, Pune",
  action: "RETURNED",
  remarks:
    "The participant count (4,200) does not match the photographs submitted, and the venue address is missing the block name. Please correct both and resubmit.",
};

const RESUBMITTED: ApprovalTimelineEvent = {
  at: "2026-08-20T09:05:00+05:30",
  actorDisplayName: "Imran Qureshi",
  actorRoleLabel: "Block Nodal Officer, Haveli",
  action: "RESUBMITTED",
  remarks: "Participant count corrected to 3,860 and the venue address completed.",
};

const APPROVED_DISTRICT: ApprovalTimelineEvent = {
  at: "2026-08-20T14:22:00+05:30",
  actorDisplayName: "R. Kulkarni",
  actorRoleLabel: "District Nodal Officer, Pune",
  action: "APPROVED",
};

const APPROVED_STATE: ApprovalTimelineEvent = {
  at: "2026-08-21T11:48:00+05:30",
  actorDisplayName: "Sunita Deshmukh",
  actorRoleLabel: "State Nodal Officer, Maharashtra",
  action: "APPROVED",
};

const meta = {
  title: "Components/Data display/ApprovalTimeline",
  component: ApprovalTimeline,
  args: {
    events: [SUBMITTED, RETURNED, RESUBMITTED, APPROVED_DISTRICT],
    pendingLabel: "Awaiting State/UT approval",
  },
  argTypes: {
    pendingLabel: { control: "text" },
    events: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 640 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ApprovalTimeline>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The full three-tier chain, return included — the honest default. */
export const Playground: Story = {};

/** Just submitted. One event and a pending step is a complete timeline. */
export const JustSubmitted: Story = {
  args: {
    events: [SUBMITTED],
    pendingLabel: "Awaiting District approval",
  },
};

/**
 * Returned, and sitting with the applicant. The remarks are the whole value of
 * this state — never render a `RETURNED` event without them.
 */
export const ReturnedForCorrection: Story = {
  args: {
    events: [SUBMITTED, RETURNED],
    pendingLabel: "Awaiting correction by the block officer",
  },
};

/** Fully approved — no pending step, because there is nothing left to wait for. */
export const FullyApproved: Story = {
  args: {
    events: [SUBMITTED, RETURNED, RESUBMITTED, APPROVED_DISTRICT, APPROVED_STATE],
    pendingLabel: undefined,
  },
};

/** A clean run, approved at both tiers with no correction. */
export const ApprovedFirstTime: Story = {
  args: {
    events: [SUBMITTED, APPROVED_DISTRICT, APPROVED_STATE],
    pendingLabel: undefined,
  },
};
