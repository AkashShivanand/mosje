import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Button,
  FormField,
  FormSection,
  Input,
  ReviewItem,
  ReviewSection,
  Select,
  Wizard,
} from "@mosje/design-system";

/**
 * **Wizard** — the shared multi-step form shell: the stepper on the page ground,
 * then ONE `FormPanel` for the current step — a head band, the step's sub-sections,
 * an optional error summary, and an action band with Back / Continue / Submit.
 *
 * The head band's `title` and `description` default to the current stage's label
 * and description; pass them where the step's name is longer than its stage label.
 * `headerActions` sits at the right of the band. With `onCancel`, the first step
 * shows an outlined Cancel (`cancelLabel`) where later steps show Back, so the
 * leading control is never a dead, disabled button.
 *
 * Children are `FormSection`s and `FormCard`s, which are **not** cards — never wrap
 * the step body in a `Card`. Spec: `docs/design-system/form-wizard-visual-language.md`.
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
 * The final button carries a send glyph by default — pass `submitIcon` to change it.
 * `stepperCollapse="never"` keeps every labelled stage on a long form (an 11-step
 * application) instead of collapsing the row to dots when the column is narrow.
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
    submitLabel: "Submit Application",
    nextLabel: "Save and Continue",
    children: null,
  },
  argTypes: {
    current: { control: { type: "range", min: 0, max: 3, step: 1 } },
    submitLabel: { control: "text" },
    title: { control: "text" },
    description: { control: "text" },
    cancelLabel: { control: "text" },
    headerActions: { control: false },
    onCancel: { control: false },
    nextLabel: { control: "text" },
    error: { control: "text" },
    steps: { control: false },
    children: { control: false },
    errorRef: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 1040 }}>
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
    <ReviewSection
      title="Applicant"
      columns={4}
      actions={
        <Button appearance="text" size="sm">
          Edit
        </Button>
      }
    >
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

/** The first step without `onCancel` — Back is disabled because there is nowhere to go back to. */
export const FirstStep: Story = {
  args: { current: 0 },
  render: (args) => (
    <Wizard {...args}>
      <StepBody index={0} />
    </Wizard>
  ),
};

/**
 * The first step with `onCancel`: an outlined Cancel leads, a `title` longer than the stage
 * label names the step, and `headerActions` puts a control in the head band.
 */
export const FirstStepWithCancel: Story = {
  args: {
    current: 0,
    title: "Basic Identity Details",
    cancelLabel: "Cancel",
    onCancel: () => {},
    headerActions: (
      <Button appearance="text" size="sm">
        Fetch from DigiLocker
      </Button>
    ),
  },
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

/**
 * The step gates on something the reader must resolve here, so the advance control is held
 * and `nextBlockedReason` says why beside it. e-Anudaan's upload step is the case it was
 * added for: the live portal refuses to move on while a document has failed its check.
 *
 * **Use it only for work in flight or a condition resolved on this step** — a set still
 * verifying, a check this step failed. Ordinary field validation belongs in `onNext`, which
 * can reject and populate `error` (see WithErrorSummary): a form the reader can submit and
 * be told what is wrong is more usable than one whose button is dark for reasons they must
 * deduce. Never set `nextDisabled` without `nextBlockedReason`; a disabled control with no
 * stated reason is a dead end.
 */
export const NextBlocked: Story = {
  args: {
    current: 2,
    nextDisabled: true,
    nextBlockedReason:
      "2 documents are not valid. Replace them — or use Re-verify if you believe the check is wrong.",
  },
  render: (args) => (
    <Wizard {...args}>
      <StepBody index={2} />
    </Wizard>
  ),
};

/**
 * The same control held for a reason that clears itself. Nothing is asked of the reader,
 * so the sentence says how the wait ends rather than what to do.
 */
export const NextBlockedWhileChecking: Story = {
  args: {
    current: 2,
    nextDisabled: true,
    nextBlockedReason:
      "Checking 12 documents… this takes a few seconds. Next opens as soon as the check completes.",
  },
  render: (args) => (
    <Wizard {...args}>
      <StepBody index={2} />
    </Wizard>
  ),
};
