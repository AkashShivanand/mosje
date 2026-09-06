import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { DateRangePicker, type DateRange, type DateRangePreset } from "@mosje/design-system";

/**
 * A period — the two dates a report, a filter or a sanction window runs between.
 *
 * **Use it** for every dashboard's period filter, and anywhere a record has a
 * start and an end.
 *
 * **Do not use it** for one date. That is `DatePicker`, which this is built from —
 * everything about typing a date, the bounds and the calendar comes from there,
 * so a reader meets one date field on this estate rather than two that behave
 * differently.
 *
 * `label` names the group and is always visible; `fromLabel` and `toLabel` name
 * the two ends and default to "From" and "To". Each field's accessible name
 * carries the group's name with it, because "From" alone is meaningless to
 * anyone moving between two period filters on one page.
 *
 * `value` is `{ from, to }` in ISO `yyyy-mm-dd`, empty string when unset, and
 * `onChange` receives the whole range. `min` and `max` bound both ends. `hint`
 * sits under the group; `error` replaces the component's own ordering message.
 * `required` and `disabled` pass through to both fields.
 *
 * `presets` are named spans offered as real buttons above the fields — a
 * dashboard's period is chosen from a preset far more often than it is typed,
 * and behind a dropdown "Last 30 days" costs three presses instead of one. The
 * matching preset shows as pressed.
 *
 * **An out-of-order range is reported, never silently swapped.** Swapping quietly
 * means the report runs over a period nobody asked for. The end is also bounded
 * by the start and the start by the end, so the message is reachable only by
 * typing.
 */
const meta = {
  title: "Forms/DateRangePicker",
  component: DateRangePicker,
  parameters: { layout: "padded" },
} satisfies Meta<typeof DateRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

const PRESETS: DateRangePreset[] = [
  { id: "30d", label: "Last 30 days", from: "2026-08-07", to: "2026-09-06" },
  { id: "quarter", label: "This quarter", from: "2026-07-01", to: "2026-09-30" },
  { id: "fy", label: "This financial year", from: "2026-04-01", to: "2027-03-31" },
];

function Controlled(props: { initial: DateRange } & Partial<React.ComponentProps<typeof DateRangePicker>>) {
  const { initial, ...rest } = props;
  const [range, setRange] = React.useState<DateRange>(initial);
  return <DateRangePicker label="Period" value={range} onChange={setRange} {...rest} />;
}

export const Playground: Story = {
  args: { label: "Period", value: { from: "", to: "" }, onChange: () => {} },
  render: () => <Controlled initial={{ from: "", to: "" }} presets={PRESETS} hint="Both dates are included in the report." />,
};

/** A preset chosen. The matching button shows as pressed, not merely tinted. */
export const WithPreset: Story = {
  args: { label: "Period", value: { from: "", to: "" }, onChange: () => {} },
  render: () => <Controlled initial={{ from: "2026-07-01", to: "2026-09-30" }} presets={PRESETS} />,
};

/**
 * The end before the start. The component says so and leaves both dates alone —
 * swapping them silently would run the report over a period nobody asked for.
 */
export const OutOfOrder: Story = {
  args: { label: "Period", value: { from: "", to: "" }, onChange: () => {} },
  render: () => <Controlled initial={{ from: "2026-09-30", to: "2026-09-01" }} />,
};

/** Bounded, required, and with the two ends renamed for a sanction window. */
export const SanctionWindow: Story = {
  args: { label: "Period", value: { from: "", to: "" }, onChange: () => {} },
  render: () => (
    <Controlled
      initial={{ from: "2026-04-01", to: "" }}
      label="Sanction window"
      fromLabel="Sanctioned on"
      toLabel="Valid until"
      min="2026-04-01"
      max="2027-03-31"
      required
    />
  ),
};

/** Disabled — a period fixed by the scheme rather than chosen by the officer. */
export const Disabled: Story = {
  args: { label: "Period", value: { from: "", to: "" }, onChange: () => {} },
  render: () => <Controlled initial={{ from: "2026-04-01", to: "2027-03-31" }} presets={PRESETS} disabled />,
};
