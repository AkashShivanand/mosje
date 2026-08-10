import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button, FormField, Input, Modal, Select } from "@mosje/design-system";

/**
 * **Modal** — the shared accessible dialog.
 *
 * It bakes in what every portal was otherwise re-implementing: a backdrop,
 * `role="dialog"` + `aria-modal` + `aria-labelledby`, a focus trap,
 * Escape-to-close, and focus restored to whatever opened it. Never hand-roll a
 * dialog — the accessibility is the component's whole reason to exist.
 *
 * Use it for a confirmation or a form of about five fields or fewer. Past that,
 * use `SideSheet`: a tall dialog scrolls its own body while the page behind it
 * sits frozen, which is worse than a panel beside the list you are working
 * from. And never use a modal for a message the user cannot act on — that is
 * an `Alert` or a toast.
 *
 * `hideClose` removes the × for a decision the user genuinely must make, but
 * Escape and the backdrop still close it, so it is a nudge, not a trap. If the
 * choice is truly mandatory, leave both actions in the footer and say so.
 *
 * Lifecycle: **Stable**.
 */
const meta = {
  title: "Components/Feedback/Modal",
  component: Modal,
  args: {
    open: true,
    onClose: () => {},
    title: "Approve this application?",
    size: "md",
    hideClose: false,
    children:
      "Approving releases the first instalment of ₹9.20 lakh to Wagholi gram panchayat and notifies the state nodal officer. This cannot be undone from the portal.",
  },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    hideClose: { control: "boolean" },
    open: { control: "boolean" },
    title: { control: "text" },
    children: { control: false },
    footer: { control: false },
    onClose: { control: false },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Opened from a button, so focus trapping and restoration are observable. */
export const Playground: Story = {
  render: function Render(args) {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Approve application</Button>
        <Modal
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          footer={
            <>
              <Button appearance="outlined" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setOpen(false)}>Approve and release</Button>
            </>
          }
        />
      </>
    );
  },
};

/** A destructive confirmation — the commonest legitimate use. */
export const Confirmation: Story = {
  args: {
    size: "sm",
    title: "Return this application for correction?",
    children:
      "The applicant will be told which fields to correct and the SLA clock will pause until they resubmit.",
  },
  render: (args) => (
    <Modal
      {...args}
      footer={
        <>
          <Button appearance="outlined">Cancel</Button>
          <Button variant="danger">Return for correction</Button>
        </>
      }
    />
  ),
};

/** About five fields is the ceiling. More than this belongs in a `SideSheet`. */
export const WithAForm: Story = {
  args: { title: "Add a district nodal officer", size: "md" },
  render: (args) => (
    <Modal
      {...args}
      footer={
        <>
          <Button appearance="outlined">Cancel</Button>
          <Button>Add officer</Button>
        </>
      }
    >
      <div style={{ display: "grid", gap: 16 }}>
        <FormField label="Officer name" required>
          {(c) => <Input {...c} defaultValue="R. Kulkarni" />}
        </FormField>
        <FormField label="District" required>
          {(c) => (
            <Select
              {...c}
              defaultValue="pune"
              options={[
                { label: "Pune", value: "pune" },
                { label: "Nashik", value: "nashik" },
                { label: "Nagpur", value: "nagpur" },
              ]}
            />
          )}
        </FormField>
        <FormField label="Mobile number" required hint="10 digits, no prefix">
          {(c) => <Input {...c} inputMode="numeric" defaultValue="9890001234" />}
        </FormField>
      </div>
    </Modal>
  ),
};

export const Sizes: Story = {
  render: function Render(args) {
    const [size, setSize] = React.useState<"sm" | "md" | "lg" | null>(null);
    return (
      <div style={{ display: "flex", gap: 8 }}>
        {(["sm", "md", "lg"] as const).map((s) => (
          <Button key={s} appearance="outlined" onClick={() => setSize(s)}>
            Open {s}
          </Button>
        ))}
        <Modal
          {...args}
          open={size !== null}
          size={size ?? "md"}
          onClose={() => setSize(null)}
          title={`Size “${size ?? "md"}”`}
          footer={<Button onClick={() => setSize(null)}>Close</Button>}
        >
          sm suits a confirmation, md a short form, lg a summary the user needs
          to read across rather than down.
        </Modal>
      </div>
    );
  },
};

/**
 * No × button — for a decision that should be made rather than dismissed.
 * Escape and the backdrop still work, so it nudges; it does not trap.
 */
export const WithoutCloseButton: Story = {
  args: {
    hideClose: true,
    size: "sm",
    title: "Your session is about to expire",
    children: "You will be signed out in two minutes. Any unsaved changes will be lost.",
  },
  render: (args) => (
    <Modal
      {...args}
      footer={
        <>
          <Button appearance="outlined">Sign out now</Button>
          <Button>Stay signed in</Button>
        </>
      }
    />
  ),
};
