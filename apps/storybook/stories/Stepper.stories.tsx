import type { Meta, StoryObj } from "@storybook/react";
import { Stepper } from "@mosje/design-system";

/**
 * **Stepper** — progress across a multi-stage form.
 *
 * A real ordered list of stages drawn on a connector track: a tick for a stage
 * that is done, a filled node for the one the applicant is on, an alert glyph
 * for one whose validation failed, and muted nodes for what remains. Five
 * states, two orientations, two sizes, and the label under the node or beside
 * it — the same axes the SAMAVESH and UX4G Figma libraries publish.
 *
 * It is a **display of position** by default: the markers are not controls,
 * because letting someone jump to stage 4 from stage 1 skips the validation the
 * wizard depends on. Pass `onStepSelect` and the stages that are already
 * complete become buttons; the ones ahead stay text, so a control is never
 * drawn that cannot be used.
 *
 * Where the row is too narrow to draw a label per stage — a phone, or seven or
 * more stages on a tablet — it collapses to the compact bar: a counter, the
 * current stage's name and a row of dots. The full list stays in the
 * accessibility tree at every width.
 *
 * If you want the whole wizard — body, error summary, Back / Continue / Submit
 * — use `Wizard`, which renders this inside itself.
 *
 * Lifecycle: **Stable**.
 */
const STEPS = [
  { label: "Activity Details", description: "What was held, and when" },
  { label: "Location", description: "State, district, block" },
  { label: "Upload Photos", description: "At least three photographs" },
  { label: "Review", description: "Check and submit" },
];

/** The seven-stage E-Anudaan grant application, as drawn in the handoff. */
const SEVEN = [
  { label: "Organisation Details" },
  { label: "Project Details" },
  { label: "Infrastructure" },
  { label: "Beneficiaries" },
  { label: "Grant Sought" },
  { label: "Document Uploads" },
  { label: "Review & Submit" },
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
    orientation: { control: "inline-radio", options: ["horizontal", "vertical"] },
    size: { control: "inline-radio", options: ["md", "sm"] },
    labelPlacement: { control: "inline-radio", options: ["bottom", "right"] },
    collapse: { control: "inline-radio", options: ["auto", "never"] },
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

/** Every position, so the marker states are visible at once. */
export const Progression: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 32 }}>
      {STEPS.map((_, i) => (
        <Stepper {...args} key={i} current={i} />
      ))}
    </div>
  ),
};

/**
 * The five states together. `error` and `disabled` are set on the step;
 * everything else is derived from `current`, so there is no second source of
 * truth to drift from the form.
 */
export const States: Story = {
  args: {
    current: 2,
    steps: [
      { label: "Applicant" },
      { label: "Income & Caste", status: "error" },
      { label: "Bank Account" },
      { label: "Documents" },
      { label: "Review", status: "disabled" },
    ],
  },
};

/** Labels only — drop the helper text when the stages speak for themselves. */
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

/** Down the page, for a side panel or a narrow column. */
export const Vertical: Story = {
  args: { orientation: "vertical", current: 1 },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
};

/** UX4G's "Label after": the stage's name beside its node, track between. */
export const LabelBeside: Story = {
  args: { labelPlacement: "right", current: 1, steps: SEVEN.slice(0, 4) },
};

/** UX4G's Compact size — smaller nodes and condensed type. */
export const SmallSize: Story = {
  args: { size: "sm", current: 1, steps: SEVEN },
};

/**
 * Seven stages. Above 900px every label is drawn; between 641 and 900 the row
 * collapses to the compact bar rather than clipping the labels, which is what
 * the previous version did.
 */
export const SevenStages: Story = {
  args: { steps: SEVEN, current: 3, ariaLabel: "Grant application progress" },
};

/**
 * Opt-in interactivity. Only the completed stages are buttons — the stages
 * ahead of the applicant stay text, so nothing looks clickable that is not.
 */
export const Interactive: Story = {
  args: {
    current: 2,
    steps: SEVEN.slice(0, 5),
    // eslint-disable-next-line no-alert
    onStepSelect: (i: number) => console.log(`return to stage ${i + 1}`),
  },
};

/** Two stages is the sensible floor — one stage is not a process. */
export const TwoSteps: Story = {
  args: {
    steps: [
      { label: "Verify Mobile", description: "One-time password" },
      { label: "Set Password", description: "Minimum eight characters" },
    ],
    current: 0,
  },
};
