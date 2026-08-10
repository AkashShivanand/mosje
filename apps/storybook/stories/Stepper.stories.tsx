import type { Meta, StoryObj } from "@storybook/react";
import { Stepper } from "@mosje/design-system";

/**
 * **Stepper** — horizontal progress across a multi-step form.
 *
 * It is a **display of position**, not a control: the markers are not links,
 * because letting someone jump to step 4 from step 1 skips the validation the
 * wizard depends on. If you want the whole wizard — body, error summary, Back /
 * Continue / Submit — use `Wizard`, which renders this inside itself. Use
 * `Stepper` alone only when you already have your own step chrome.
 *
 * Every marker carries a visually-hidden "(completed)" / "(current step)" /
 * "(upcoming)", and the current one gets `aria-current="step"`, so state is
 * never conveyed by the green tick alone.
 *
 * Keep labels to one or two words: they sit under the markers, and on a narrow
 * screen a long label is what breaks the row, not the number of steps.
 *
 * Lifecycle: **Stable**.
 */
const STEPS = [
  { label: "Activity details", description: "What was held, and when" },
  { label: "Location", description: "State, district, block" },
  { label: "Upload photos", description: "At least three photographs" },
  { label: "Review", description: "Check and submit" },
];

const meta = {
  title: "Components/Feedback/Stepper",
  component: Stepper,
  args: {
    steps: STEPS,
    current: 1,
    ariaLabel: "Mass Pledge report progress",
  },
  argTypes: {
    current: { control: { type: "range", min: 0, max: 3, step: 1 } },
    ariaLabel: { control: "text" },
    steps: { control: "object" },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 860 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Every position, so the three marker states are visible at once. */
export const Progression: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 32 }}>
      {STEPS.map((_, i) => (
        <Stepper {...args} key={i} current={i} />
      ))}
    </div>
  ),
};

/** Labels only — drop the descriptions when the steps speak for themselves. */
export const LabelsOnly: Story = {
  args: {
    steps: [
      { label: "Applicant" },
      { label: "Scheme" },
      { label: "Documents" },
      { label: "Review" },
    ],
    current: 2,
  },
};

/** Two steps is the sensible floor — one step is not a process. */
export const TwoSteps: Story = {
  args: {
    steps: [
      { label: "Verify mobile", description: "One-time password" },
      { label: "Set password", description: "Minimum eight characters" },
    ],
    current: 0,
  },
};
