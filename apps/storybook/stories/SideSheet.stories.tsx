import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Button,
  FormField,
  Input,
  SideSheet,
  SidebarNav,
  Select,
  Textarea,
} from "@mosje/design-system";

/**
 * **SideSheet** — an edge-anchored panel for work that needs the page behind it
 * to stay visible.
 *
 * The split with `Modal` is about **context, not size**. A modal takes the
 * screen and says "deal with this first". A side sheet says "keep looking at
 * the list while you do this" — which is what a reviewer working through a
 * queue of applications actually needs.
 *
 * Reach for it when the form runs past about five fields, when there is a
 * textarea, when the user is uploading and previewing, or whenever they will
 * want to check something in the row behind the panel.
 *
 * `side="left"` is for **navigation drawers only**. A left drawer is the
 * convention users already have; breaking it for a form costs more than the
 * novelty gains.
 *
 * Same accessibility contract as `Modal`: focus trap, Escape, focus restored to
 * the opener, `aria-modal` and a heading wired to `aria-labelledby`.
 *
 * Lifecycle: **Stable**.
 */
const meta = {
  title: "Components/Feedback/SideSheet",
  component: SideSheet,
  args: {
    open: true,
    onClose: () => {},
    title: "Review application MH/PUN/2026/004182",
    size: "md",
    side: "right",
    children: null,
  },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    side: { control: "inline-radio", options: ["left", "right"] },
    open: { control: "boolean" },
    title: { control: "text" },
    children: { control: false },
    footer: { control: false },
    onClose: { control: false },
  },
} satisfies Meta<typeof SideSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

const reviewForm = (
  <div style={{ display: "grid", gap: 16 }}>
    <FormField label="Applicant name" required>
      {(c) => <Input {...c} defaultValue="Sunita Deshmukh" readOnly />}
    </FormField>
    <FormField label="Scheme" required>
      {(c) => <Input {...c} defaultValue="Pre-Matric Scholarship (SC)" readOnly />}
    </FormField>
    <FormField label="Caste certificate number" required>
      {(c) => <Input {...c} defaultValue="MH/CC/2019/88214" />}
    </FormField>
    <FormField label="Income certificate number" required>
      {(c) => <Input {...c} defaultValue="MH/IC/2026/11907" />}
    </FormField>
    <FormField label="Decision" required>
      {(c) => (
        <Select
          {...c}
          placeholder="Select a decision"
          options={[
            { label: "Approve", value: "approve" },
            { label: "Return for correction", value: "return" },
            { label: "Reject", value: "reject" },
          ]}
        />
      )}
    </FormField>
    <FormField label="Remarks for the applicant" hint="Shown to the applicant on their dashboard">
      {(c) => <Textarea {...c} rows={4} placeholder="Explain what needs correcting…" />}
    </FormField>
  </div>
);

/** Opened over a list, which is the whole point — the queue stays readable. */
export const Playground: Story = {
  render: function Render(args) {
    const [open, setOpen] = React.useState(false);
    const queue = [
      ["MH/PUN/2026/004182", "Sunita Deshmukh", "Pre-Matric (SC)"],
      ["MH/NAS/2026/004183", "Aarav Pawar", "Post-Matric (SC)"],
      ["MH/NAG/2026/004184", "Rehana Shaikh", "Pre-Matric (SC)"],
    ];
    return (
      <div style={{ display: "grid", gap: 12 }}>
        <Button onClick={() => setOpen(true)}>Review first application</Button>
        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 8 }}>
          {queue.map(([id, name, scheme]) => (
            <li key={id} style={{ color: "var(--ds-ink)" }}>
              <strong>{id}</strong> · {name} · {scheme}
            </li>
          ))}
        </ul>
        <SideSheet
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          footer={
            <>
              <Button appearance="outlined" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setOpen(false)}>Save decision</Button>
            </>
          }
        >
          {reviewForm}
        </SideSheet>
      </div>
    );
  },
};

/** A long form — six fields and a textarea, exactly the case Modal is wrong for. */
export const LongForm: Story = {
  render: (args) => (
    <SideSheet
      {...args}
      footer={
        <>
          <Button appearance="outlined">Cancel</Button>
          <Button>Save decision</Button>
        </>
      }
    >
      {reviewForm}
    </SideSheet>
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
        <SideSheet
          {...args}
          open={size !== null}
          size={size ?? "md"}
          onClose={() => setSize(null)}
          title={`Size “${size ?? "md"}”`}
          footer={<Button onClick={() => setSize(null)}>Close</Button>}
        >
          {reviewForm}
        </SideSheet>
      </div>
    );
  },
};

/**
 * `side="left"` — a navigation drawer, the one case for the left edge. Note it
 * holds navigation, not a form.
 */
export const LeftNavigationDrawer: Story = {
  args: { side: "left", size: "sm", title: "Menu" },
  render: (args) => (
    <SideSheet {...args}>
      <SidebarNav
        groups={[
          {
            items: [
              { label: "Dashboard", href: "#dashboard", icon: "dashboard" },
              { label: "Applications", href: "#applications", icon: "description", badge: 24 },
              { label: "Beneficiaries", href: "#beneficiaries", icon: "groups" },
            ],
          },
          {
            label: "Administration",
            items: [
              { label: "Officers", href: "#officers", icon: "badge" },
              { label: "Reports", href: "#reports", icon: "bar_chart" },
            ],
          },
        ]}
        pathname="#applications"
      />
    </SideSheet>
  ),
};
