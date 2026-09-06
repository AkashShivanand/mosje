import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { RangeSlider, Slider } from "@mosje/design-system";

/**
 * **Slider** — a bounded numeric choice where the reader cares about *roughly
 * where* rather than *exactly what*: a fund range in a filter, a radius, a year.
 *
 * It is a real `<input type="range">`, and that is not a shortcut. The native
 * control already carries the keyboard model (arrows, Page Up and Page Down,
 * Home and End), announces its value and its bounds, and is the one form control
 * that assistive technology and mobile browsers both handle correctly. A `div`
 * with a draggable dot has to reimplement all of that, and usually reimplements
 * the visible half only.
 *
 * **It is never the only way to enter a value that matters.** WCAG 2.5.7 asks
 * for a single-pointer alternative to dragging, which the arrow keys provide —
 * but a reader who knows they want ₹4,50,000 should be able to type it. Pair a
 * slider with a number field wherever the exact figure is the point; use it
 * alone only for a coarse filter.
 *
 * Pass `formatValue` whenever the number has a unit. It drives the readout and
 * `aria-valuetext`, because "40" and "₹ 40,000" are not the same information and
 * the second one is what was meant.
 *
 * `RangeSlider` is **two real range inputs overlaid**, not one track with two
 * dots — so each thumb is a genuine slider with its own name, keyboard model and
 * announced value. The names come from `label`: "Grant amount, minimum" and
 * "Grant amount, maximum", because two controls both announced as "slider" are
 * indistinguishable.
 *
 * `fromLabel` and `toLabel` are the words joined to `label` to make those two
 * names, and they default to "minimum" and "maximum". Override them only where
 * the pair is not a magnitude and those words would be wrong — a date span reads
 * better as "from" and "to", and an age band as "youngest" and "oldest".
 *
 * Lifecycle: **Stable**.
 *
 * @covers RangeSlider
 */
const meta = {
  title: "Components/Forms/Slider",
  component: Slider,
  args: {
    value: 40,
    onValueChange: () => {},
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
    size: "md",
    showValue: true,
    "aria-label": "Distance from the district headquarters, in kilometres",
  },
  argTypes: {
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
    disabled: { control: "boolean" },
    size: { control: "inline-radio", options: ["md", "sm"] },
    showValue: { control: "boolean" },
    value: { control: false },
    onValueChange: { control: false },
    marks: { control: false },
    formatValue: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 32, maxWidth: 520 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The default. Drag it, or focus it and use the arrow keys. */
export const Playground: Story = {
  render: function PlaygroundStory(args) {
    const [value, setValue] = React.useState(args.value);
    return <Slider {...args} value={value} onValueChange={setValue} />;
  },
};

/**
 * With a unit. `formatValue` drives both the readout and `aria-valuetext`, so a
 * screen reader says "₹ 4,50,000" rather than "450000".
 */
export const WithAUnit: Story = {
  args: { min: 0, max: 1000000, step: 50000, value: 450000 },
  render: function UnitStory(args) {
    const [value, setValue] = React.useState(args.value);
    return (
      <Slider
        {...args}
        value={value}
        onValueChange={setValue}
        aria-label="Grant amount sought"
        formatValue={(v) => `₹ ${v.toLocaleString("en-IN")}`}
        marks={[
          { value: 0, label: "₹ 0" },
          { value: 500000, label: "₹ 5L" },
          { value: 1000000, label: "₹ 10L" },
        ]}
      />
    );
  },
};

/** Two bounds on one track. Each thumb is its own slider with its own name. */
export const Range: Story = {
  render: function RangeStory() {
    const [value, setValue] = React.useState<[number, number]>([200000, 700000]);
    return (
      <RangeSlider
        label="Grant amount"
        value={value}
        onValueChange={setValue}
        min={0}
        max={1000000}
        step={50000}
        formatValue={(v) => `₹ ${(v / 100000).toFixed(1)}L`}
        marks={[
          { value: 0, label: "₹ 0" },
          { value: 500000, label: "₹ 5L" },
          { value: 1000000, label: "₹ 10L" },
        ]}
      />
    );
  },
};

/** The compact size, for a filter rail. The rail stays the same; the thumb shrinks. */
export const Small: Story = {
  args: { size: "sm" },
  render: function SmallStory(args) {
    const [value, setValue] = React.useState(args.value);
    return <Slider {...args} value={value} onValueChange={setValue} />;
  },
};

/** Disabled. It stays in the tab order's shape but takes no input. */
export const Disabled: Story = {
  args: { disabled: true },
};
