import type { Meta, StoryObj } from "@storybook/react";
import { Alert } from "@mosje/design-system";

/**
 * **Alert** — an inline message tied to the content around it, not a toast.
 * `status` carries the meaning; never rely on colour alone, which is why every
 * status pairs its tint with an icon and a title. Lifecycle: **Stable**.
 */
const meta = {
  title: "Components/Alert",
  component: Alert,
  args: {
    status: "info",
    title: "Application received",
    children: "We will write to you once a district officer has reviewed it.",
  },
  argTypes: {
    status: { control: "inline-radio", options: ["info", "success", "warning", "error"] },
    dismissible: { control: "boolean" },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Statuses: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Alert {...args} status="info" title="For your information">
        Applications close on 31 March.
      </Alert>
      <Alert {...args} status="success" title="Saved">
        Your changes are live.
      </Alert>
      <Alert {...args} status="warning" title="Review before publishing">
        Two beneficiary records are missing a district.
      </Alert>
      <Alert {...args} status="error" title="Could not submit">
        The Aadhaar number failed its checksum. Correct it and try again.
      </Alert>
    </div>
  ),
};

export const Dismissible: Story = {
  args: { dismissible: true, title: "Draft restored" },
};
