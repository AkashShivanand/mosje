import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  FormField,
  FormSection,
  Input,
  ReviewItem,
  ReviewSection,
  Select,
  Wizard,
} from "@mosje/design-system";

/**
 * **Wizard** — the shared multi-step form shell: stepper, step body, optional
 * error summary, and Back / Continue / Submit.
 *
 * It owns **none** of your state. The parent holds the field values, the step
 * index and the validation; the Wizard renders the chrome and tells you when
 * the user asked to move. That is deliberate — a wizard that owned validation
 * would have to know every scheme's rules.
 *
 * What it does own is the accessibility of moving between steps: focus goes to
 * the step body on change, and a live region announces "Step 2 of 4: …". Wire
 * `errorRef` and focus it yourself when validation fails, so a keyboard user
 * lands on the reason rather than being silently kept on the same step.
 *
 * Use it for a long submission split into stages. Do **not** use it for a
 * three-field form — a wizard turns one screen into four.
 *
 * `ReviewSection` and `ReviewItem`, the read-only summary pieces for the final
 * step, are documented here rather than in stories of their own.
 *
 * Lifecycle: **Stable**.
 */
const STEPS = [
  { label: "Applicant", description: "Who is applying" },
  { label: "Scheme", description: "What they are applying for" },
  { label: "Documents", description: "Proof of eligibility" },
  { label: "Review", description: "Check and submit" },
];

const meta = {
  title: "Components/Forms/Wizard",
  component: Wizard,
  args: {
    steps: STEPS,
    current: 0,
    onBack: () => {},
    onNext: () => {},
    onSubmit: () => {},
    submitLabel: "Submit application",
    nextLabel: "Continue",
    children: null,
  },
  argTypes: {
    current: { control: { type: "range", min: 0, max: 3, step: 1 } },
    submitLabel: { control: "text" },
    nextLabel: { control: "text" },
    error: { control: "text" },
    steps: { control: false },
    children: { control: false },
    errorRef: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 900 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Wizard>;

export default meta;
type Story = StoryObj<typeof meta>;

function StepBody({ index }: { index: number }) {
  if (index === 0) {
    return (
      <FormSection title="Applicant details" columns={2}>
        <FormField label="Full name" required>
          {(c) => <Input {...c} defaultValue="Sunita Deshmukh" />}
        </FormField>
        <FormField label="Mobile number" required hint="10 digits, no prefix">
          {(c) => <Input {...c} inputMode="numeric" defaultValue="9890001234" />}
        </FormField>
      </FormSection>
    );
  }
  if (index === 1) {
    return (
      <FormSection title="Scheme" columns={2}>
        <FormField label="Scheme" required>
          {(c) => (
            <Select
              {...c}
              defaultValue="prematric"
              options={[
                { label: "Pre-Matric Scholarship (SC)", value: "prematric" },
                { label: "Post-Matric Scholarship (SC)", value: "postmatric" },
              ]}
            />
          )}
        </FormField>
        <FormField label="Academic year" required>
          {(c) => <Input {...c} defaultValue="2026–27" />}
        </FormField>
      </FormSection>
    );
  }
  if (index === 2) {
    return (
      <FormSection title="Documents" columns={1}>
        <FormField label="Caste certificate number" required>
          {(c) => <Input {...c} defaultValue="MH/CC/2019/88214" />}
        </FormField>
      </FormSection>
    );
  }
  return (
    <ReviewSection title="Check your answers">
      <ReviewItem label="Full name" value="Sunita Deshmukh" />
      <ReviewItem label="Mobile number" value="9890001234" />
      <ReviewItem label="Scheme" value="Pre-Matric Scholarship (SC)" />
      <ReviewItem label="Academic year" value="2026–27" />
      <ReviewItem label="Caste certificate" value="MH/CC/2019/88214" />
      <ReviewItem label="Email address" />
      <ReviewItem
        wide
        label="Address"
        value="Flat 3, Shivneri Apartments, Kothrud, Pune, Maharashtra 411038"
      />
    </ReviewSection>
  );
}

/** Fully driven — Back / Continue actually move between steps. */
export const Playground: Story = {
  render: function Render(args) {
    const [current, setCurrent] = React.useState(0);
    return (
      <Wizard
        {...args}
        current={current}
        onBack={() => setCurrent((c) => Math.max(0, c - 1))}
        onNext={() => setCurrent((c) => Math.min(STEPS.length - 1, c + 1))}
        onSubmit={() => setCurrent(0)}
      >
        <StepBody index={current} />
      </Wizard>
    );
  },
};

/** The first step — Back is disabled because there is nowhere to go back to. */
export const FirstStep: Story = {
  args: { current: 0 },
  render: (args) => (
    <Wizard {...args}>
      <StepBody index={0} />
    </Wizard>
  ),
};

/** The last step swaps Continue for Submit and shows the review summary. */
export const ReviewStep: Story = {
  args: { current: 3 },
  render: (args) => (
    <Wizard {...args}>
      <StepBody index={3} />
    </Wizard>
  ),
};

/**
 * Validation failed. Focus the `errorRef` container yourself so a keyboard user
 * is taken to the reason instead of appearing to be stuck.
 */
export const WithErrorSummary: Story = {
  args: {
    current: 1,
    error: "Select a scheme and an academic year before continuing.",
  },
  render: function Render(args) {
    const errorRef = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
      errorRef.current?.focus();
    }, []);
    return (
      <Wizard {...args} errorRef={errorRef}>
        <StepBody index={1} />
      </Wizard>
    );
  },
};
