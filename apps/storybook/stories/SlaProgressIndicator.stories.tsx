import type { Meta, StoryObj } from "@storybook/react";
import { Button, SlaProgressIndicator } from "@mosje/design-system";

/**
 * **SlaProgressIndicator** — time remaining against a service guarantee.
 *
 * Not a decorative progress bar. A Right to Service Act gives a citizen a
 * maximum time for a service and attaches the consequences of missing it to a
 * named officer; this renders that promise. Three things follow from that, and
 * they are the reason to use this rather than `Progress`:
 *
 * - **It always states a concrete time.** UX4G names a vague "Processing…" as a
 *   Don't, and rightly — an unspecific status is exactly what erodes confidence
 *   in a guarantee. Every state here gives a number and a unit, breach
 *   ("3 days overdue") included.
 * - **Colour is never the only signal.** Every state carries text as well as a
 *   hue, and the whole thing is a `role="progressbar"` whose `aria-valuetext`
 *   is a sentence, not a bare percentage.
 * - **A paused clock renders neutral.** When the department is waiting on the
 *   applicant, nothing is being consumed. Showing an officer a reddening bar
 *   for time they are not accountable for is both wrong and corrosive.
 *
 * `total` and `elapsed` share whatever unit you pass. RTS Acts are usually
 * written in **working** days — count them however your Act requires and pass
 * the number in; the component does not know your holiday calendar.
 *
 * Pick the variant by where it sits: `linear` in a case row or queue,
 * `circular` in a dashboard tile, `badge` in a table cell where a bar will not
 * fit. `status` is an escape hatch — prefer the derived value.
 *
 * Lifecycle: **Stable**.
 */
const meta = {
  title: "Components/Feedback/SlaProgressIndicator",
  component: SlaProgressIndicator,
  args: {
    label: "Income certificate",
    total: 21,
    elapsed: 9,
    unit: "day",
    variant: "linear",
    paused: false,
    completed: false,
  },
  argTypes: {
    variant: { control: "inline-radio", options: ["linear", "circular", "badge"] },
    total: { control: { type: "number", min: 1, max: 90 } },
    elapsed: { control: { type: "number", min: 0, max: 120 } },
    unit: { control: "text" },
    paused: { control: "boolean" },
    completed: { control: "boolean" },
    status: {
      control: "select",
      options: [undefined, "on-track", "due-soon", "at-risk", "breached", "met", "missed"],
    },
    label: { control: "text" },
    description: { control: "text" },
    action: { control: false },
    thresholds: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 640 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SlaProgressIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** The escalation, derived from `elapsed` against `total` — not set by hand. */
export const Escalation: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 16 }}>
      <SlaProgressIndicator {...args} label="Comfortably within time" elapsed={4} />
      <SlaProgressIndicator {...args} label="Approaching the deadline" elapsed={16} />
      <SlaProgressIndicator {...args} label="Due today" elapsed={20} />
      <SlaProgressIndicator {...args} label="Breached" elapsed={24} />
    </div>
  ),
};

/** A dashboard tile — the ring carries the number of units left in the middle. */
export const Circular: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
      <SlaProgressIndicator {...args} variant="circular" label="Income certificate" elapsed={9} />
      <SlaProgressIndicator {...args} variant="circular" label="Caste certificate" elapsed={17} />
      <SlaProgressIndicator {...args} variant="circular" label="Grievance #4471" total={30} elapsed={34} />
    </div>
  ),
};

/** A table cell, where a bar will not fit. */
export const Badge: Story = {
  render: (args) => (
    <table style={{ width: "100%", borderCollapse: "collapse", color: "var(--sa-color-text-default)" }}>
      <thead>
        <tr style={{ textAlign: "left", color: "var(--sa-color-text-muted)" }}>
          <th style={{ padding: "8px 12px 8px 0" }}>Application</th>
          <th style={{ padding: "8px 12px 8px 0" }}>Service</th>
          <th style={{ padding: "8px 12px 8px 0" }}>Time remaining</th>
        </tr>
      </thead>
      <tbody>
        {[
          ["MH/PUN/2026/004182", "Income certificate", 21, 4],
          ["MH/NAS/2026/004183", "Caste certificate", 21, 17],
          ["MH/NAG/2026/004184", "Grievance redressal", 30, 34],
        ].map(([id, service, total, elapsed]) => (
          <tr key={String(id)} style={{ borderTop: "1px solid var(--sa-border-neutral-subtle)" }}>
            <td style={{ padding: "10px 12px 10px 0" }}>{id}</td>
            <td style={{ padding: "10px 12px 10px 0" }}>{service}</td>
            <td style={{ padding: "10px 12px 10px 0" }}>
              <SlaProgressIndicator
                {...args}
                variant="badge"
                label={String(service)}
                total={Number(total)}
                elapsed={Number(elapsed)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

/**
 * Paused — the department is waiting on the applicant, so the clock is neutral
 * rather than escalating. This is the state most often got wrong.
 */
export const Paused: Story = {
  args: {
    paused: true,
    elapsed: 18,
    label: "Income certificate",
    description: "Awaiting a corrected income certificate from the applicant.",
  },
};

/** Delivered — `elapsed` becomes how long it took, and the indicator freezes. */
export const Completed: Story = {
  args: {
    completed: true,
    elapsed: 12,
    label: "Income certificate",
    description: "Issued by R. Kulkarni, District Nodal Officer, on 04 August 2026.",
  },
};

/** The secondary line and a trailing control, as a queue row would carry them. */
export const InAQueueRow: Story = {
  args: {
    elapsed: 19,
    label: "Grievance #4471 — delayed scholarship disbursal",
    description: "Held by R. Kulkarni, District Nodal Officer, Pune",
    action: (
      <Button size="sm" appearance="text">
        View
      </Button>
    ),
  },
};

/** A different unit. Working hours, for a same-day service. */
export const DifferentUnit: Story = {
  args: {
    label: "Verification of enrolment",
    unit: "working hour",
    total: 8,
    elapsed: 6,
  },
};
