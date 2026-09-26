import type { Meta, StoryObj } from "@storybook/react-vite";
import { ActionTile, Icon } from "@mosje/design-system";

/**
 * **ActionTile** — one destination as a tile: a task, a group of people, a
 * role, an account, a helpline, a report.
 *
 * **`linkAs` — PASS `next/link`.** These stories leave it unset because
 * Storybook has no router; in the app, an internal tile without it is a full
 * document load.
 *
 * **`layout` is the decision.** `row` for a task or an account (media, words,
 * arrow), `stack` for a group of people (centred figure over a name), `block`
 * for a helpline or a document (media and `value`, then title, description and
 * `action`). **`tone` follows the ground**: `default` or `tint` on a light band,
 * `solid` for the one tile that leads a light grid, `inverse` on a navy band.
 * `shape="pill"` rounds a `row`. `mediaSize` is 40, 48, 64 or 88 (an
 * illustrated figure). `trailing` hides or shows the arrow; `external` swaps it
 * for `open_in_new` and adds "(opens in a new window)" to the name.
 *
 * **When NOT to use it:** for a portal (`PortalCard`), for content a reader
 * reads rather than a place they go (`Card`), or for a tile that needs a second
 * control inside it — `action` is text, not a button.
 */
const meta = {
  title: "Navigation/ActionTile",
  component: ActionTile,
  args: {
    href: "/website/schemes-services",
    title: "Find a Scheme",
    media: <Icon name="manage_search" size={24} />,
  },
  argTypes: {
    layout: { control: "inline-radio", options: ["row", "stack", "block"] },
    tone: { control: "inline-radio", options: ["default", "tint", "solid", "inverse"] },
    shape: { control: "inline-radio", options: ["card", "pill"] },
    mediaSize: { control: "inline-radio", options: [40, 48, 64, 88] },
    external: { control: "boolean" },
    trailing: { control: "boolean" },
  },
} satisfies Meta<typeof ActionTile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** A home page's tasks, on the navy hero band. */
export const TasksOnNavy: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(3, minmax(0, 1fr))", padding: 24, background: "var(--sa-bg-brand-primary-boldest)" }}>
      <ActionTile href="/website/schemes-services" title="Find a Scheme" tone="inverse" media={<Icon name="manage_search" size={24} />} />
      <ActionTile href="/portals" title="Apply and Track Online" tone="inverse" media={<Icon name="assignment" size={24} />} />
      <ActionTile href="https://pgportal.gov.in/" external title="File a Grievance" tone="inverse" media={<Icon name="report" size={24} />} />
    </div>
  ),
};

/** Groups of people a scheme serves — `stack`, with the one leading tile `solid`. */
export const GroupsStacked: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(3, minmax(0, 1fr))", padding: 24, background: "var(--sa-bg-brand-primary-base)" }}>
      <ActionTile href="/website/schemes-services?who=senior" layout="stack" mediaSize={88} title="Senior Citizens" media={<Icon name="elderly" size={40} />} />
      <ActionTile href="/website/schemes-services?who=drug" layout="stack" mediaSize={88} title="Persons Affected by Substance Use" media={<Icon name="health_and_safety" size={40} />} />
      <ActionTile href="/website/schemes-services" layout="stack" mediaSize={88} tone="solid" title="View All Schemes" media={<Icon name="apps" size={40} />} />
    </div>
  ),
};

/** A national helpline — `block`, with `value` and an `action`. */
export const HelplineBlock: Story = {
  render: () => (
    <div style={{ maxWidth: 360, padding: 24, background: "var(--sa-bg-brand-primary-boldest)" }}>
      <ActionTile
        href="tel:14567"
        layout="block"
        tone="inverse"
        value="14567"
        title="Elderline"
        description="National helpline for senior citizens"
        media={<Icon name="elderly" size={24} />}
        action={
          <>
            <Icon name="call" size={20} /> Call
          </>
        }
      />
    </div>
  ),
};

/** Roles as pills, and a report as a block with no value. */
export const PillsAndDocuments: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(2, minmax(0, 1fr))", padding: 24 }}>
      <ActionTile href="/website/for-researcher" shape="pill" tone="solid" mediaSize={48} title="For Researchers" media={<Icon name="biotech" size={24} />} />
      <ActionTile href="/website/annual-reports" layout="block" mediaSize={48} title="Annual Report 2024-25" description="23 Dec 2025 · PDF, 195 MB" media={<Icon name="description" size={24} />} />
    </div>
  ),
};
