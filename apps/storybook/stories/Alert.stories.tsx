import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Alert, Button } from "@mosje/design-system";

/**
 * **Alert** — an inline message tied to the content around it, not a toast.
 * `status` carries the meaning; never rely on colour alone, which is why every
 * status pairs its tint with an icon and a title. Lifecycle: **Stable**.
 *
 * `dismissible` draws the close button; `onDismiss` is what tells you it was
 * pressed. Wire both — a close button the parent ignores removes nothing, and
 * the alert reappears on the next render.
 *
 * `action` puts controls under the body, for an alert the user can *do*
 * something about. `timestamp` sits top-right, and earns its place only where
 * the age of the message changes what it means — a system notice, a queued job.
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
    timestamp: { control: "text" },
    action: { control: false },
    onDismiss: { control: false },
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

/**
 * `dismissible` draws the button; `onDismiss` is what actually removes it.
 * Press it — the alert goes because the parent is listening.
 */
export const Dismissible: Story = {
  render: function Render(args) {
    const [shown, setShown] = React.useState(true);
    if (!shown) {
      return (
        <Button appearance="outlined" onClick={() => setShown(true)}>
          Bring the alert back
        </Button>
      );
    }
    return <Alert {...args} dismissible onDismiss={() => setShown(false)} title="Draft restored" />;
  },
};

/** An alert the user can act on. Keep it to one or two controls. */
export const WithAnAction: Story = {
  args: {
    status: "warning",
    title: "Two beneficiary records are missing a district",
    children: "They will not appear in the state roll-up until a district is recorded.",
    action: (
      <>
        <Button size="sm" appearance="text">
          Review the records
        </Button>
        <Button size="sm" appearance="text">
          Dismiss for now
        </Button>
      </>
    ),
  },
};

/**
 * `timestamp` earns its place only where the age of the message changes what it
 * means — here, whether the figures on screen are the current ones.
 */
export const WithATimestamp: Story = {
  args: {
    status: "info",
    title: "Figures are being recalculated",
    children: "The district roll-up will refresh once all blocks have submitted.",
    timestamp: "04 Aug 2026, 09:40",
  },
};
