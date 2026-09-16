import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, FormField, FormPanel, FormSection, Icon, Input, Textarea } from "@mosje/design-system";

/**
 * **FormPanel** — the one card a form or a wizard step lives in. A tinted head band
 * (`title`, `description`, `actions`), a body holding the sub-sections 32 apart, and a
 * tinted action band (`footer`). `as` sets the title's heading level, 2 by default.
 *
 * The step is the card; the sub-sections inside it are **not**. Pass `FormSection` and
 * `FormCard` as children — never a `Card` per section.
 *
 * `title` is optional. Without it the head band is not drawn, which is right only where
 * the page header directly above already names the form — `FormScreen` renders its panel
 * this way.
 *
 * Inside a multi-step form, use `Wizard`, which draws this panel for the current step.
 *
 * `footerProps` carries attributes for the action band itself — a class, or the data
 * attributes a floating-element rail reads. `Wizard` uses it to mark its sticky phone
 * bar as a surface a transient widget must keep clear of. It is never a substitute for
 * `footer`: the band's CONTENT always goes there.
 *
 * Spec: `docs/design-system/form-wizard-visual-language.md`.
 *
 * Lifecycle: **New**.
 */
const meta = {
  title: "Components/Forms/Form panel",
  component: FormPanel,
  args: {
    title: "Basic Identity Details",
    description: "Enter the applicant's details as they appear on the Aadhaar card.",
    as: 2,
    children: null,
  },
  argTypes: {
    as: { control: "inline-radio", options: [2, 3] },
    title: { control: "text" },
    description: { control: "text" },
    actions: { control: false },
    footer: { control: false },
    children: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 1040 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FormPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

const sections = (
  <>
    <FormSection title="Personal Details">
      <FormField label="Full Name" required>
        {(c) => <Input {...c} defaultValue="Sunita Deshmukh" />}
      </FormField>
      <FormField label="Date of Birth" required>
        {(c) => <Input {...c} defaultValue="14/03/1991" />}
      </FormField>
      <FormField label="Mobile Number" required>
        {(c) => <Input {...c} inputMode="numeric" defaultValue="9890001234" />}
      </FormField>
    </FormSection>
    <FormSection title="Address">
      <FormField label="District" required>
        {(c) => <Input {...c} defaultValue="Pune" />}
      </FormField>
      <FormField label="PIN Code" required>
        {(c) => <Input {...c} inputMode="numeric" defaultValue="411038" />}
      </FormField>
      <FormField label="Address" required className="ds-form-span-full">
        {(c) => <Textarea {...c} rows={2} defaultValue="Flat 3, Shivneri Apartments, Kothrud" />}
      </FormField>
    </FormSection>
  </>
);

/** A first step: Cancel leads, because there is nothing to go back to. */
export const FirstStep: Story = {
  render: (args) => (
    <FormPanel
      {...args}
      footer={
        <>
          <Button appearance="outlined">Cancel</Button>
          <Button iconRight={<Icon name="arrow_forward" size={20} />}>Save and Continue</Button>
        </>
      }
    >
      {sections}
    </FormPanel>
  ),
};

/** A later step with an action in the head band. */
export const WithHeadAction: Story = {
  render: (args) => (
    <FormPanel
      {...args}
      actions={
        <Button appearance="text" size="sm">
          Fetch from DigiLocker
        </Button>
      }
      footer={
        <>
          <Button appearance="outlined" iconLeft={<Icon name="arrow_back" size={20} />}>
            Back
          </Button>
          <Button iconRight={<Icon name="arrow_forward" size={20} />}>Save and Continue</Button>
        </>
      }
    >
      {sections}
    </FormPanel>
  ),
};

/**
 * No title, so no head band — for a single-screen form whose page header already names
 * it, as `FormScreen` renders.
 */
export const WithoutHeadBand: Story = {
  args: { title: undefined, description: undefined },
  render: (args) => (
    <FormPanel
      {...args}
      footer={
        <>
          <Button appearance="outlined">Cancel</Button>
          <Button>Save Changes</Button>
        </>
      }
    >
      {sections}
    </FormPanel>
  ),
};
