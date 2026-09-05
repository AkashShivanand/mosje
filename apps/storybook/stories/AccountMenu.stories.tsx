import type { Meta, StoryObj } from "@storybook/react";
import { AccountMenu, Icon } from "@mosje/design-system";

/**
 * **AccountMenu** — the signed-in user block in the portal header.
 *
 * One prop decides what it *is*: with `items` it is an accessible dropdown;
 * without them it is a **static block**. That is the useful distinction — a
 * portal with nothing behind the avatar should not render a control that opens
 * an empty menu.
 *
 * When there is a menu, put **Sign out last and mark it `danger`**. It is the
 * one irreversible item, and a user reaching for "Profile" should not be able
 * to land on it by muscle memory.
 *
 * `avatarSrc` is optional: without it, initials are derived from `name`. That
 * fallback is the normal case here — government portals rarely hold a
 * photograph of the officer, and an anonymous silhouette identifies nobody.
 * The avatar is a rounded square, the estate's shape for a person in the masthead.
 *
 * The trigger shows the **role** under the name; the **email** appears inside the
 * menu head with both. When a portal passes no role, the address stands in.
 *
 * `role` is worth filling in wherever the same person can hold different
 * jurisdictions. "Sunita Deshmukh" alone does not tell an officer whether they
 * are signed in as state or district — and in these portals that changes what
 * they are allowed to approve.
 *
 * Built with the same outside-click and Escape handling as `AppSwitcher`, so
 * the design system keeps zero runtime dependencies.
 *
 * `avatarSize` is 48 in the resting brand row and **40 inside the condensed
 * bar**, where every control is 40 — `SiteHeader` passes it; a consumer rarely
 * needs to. At 48 the avatar, not the bar's own min-height, decided the height,
 * and a phone measured 64 against a designed 56.
 *
 * Lifecycle: **Stable**.
 */
const meta = {
  title: "Components/Navigation/AccountMenu",
  component: AccountMenu,
  args: {
    account: {
      name: "Sunita Deshmukh",
      email: "sno-mh@nmba.gov.in",
      role: "State Nodal Officer, Maharashtra",
    },
    items: [
      { label: "Profile", onSelect: () => {}, icon: <Icon name="person" size={18} aria-hidden /> },
      {
        label: "Change password",
        onSelect: () => {},
        icon: <Icon name="lock" size={18} aria-hidden />,
      },
      {
        label: "Sign out",
        onSelect: () => {},
        icon: <Icon name="logout" size={18} aria-hidden />,
        danger: true,
      },
    ],
  },
  argTypes: {
    account: { control: "object" },
    items: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ display: "flex", justifyContent: "flex-end", minHeight: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AccountMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Click the block to open. Sign out is last and marked `danger`. */
export const Playground: Story = {};

/** No `items` — a static block, not a control that opens nothing. */
export const StaticBlock: Story = {
  args: { items: [] },
};

/** Initials derived from the name. The usual case for a government portal. */
export const InitialsFallback: Story = {
  args: {
    account: {
      name: "Imran Qureshi",
      email: "bno-haveli@nmba.gov.in",
      role: "Block Nodal Officer, Haveli",
    },
  },
};

/**
 * The role matters where one person holds different jurisdictions — it is what
 * tells them which hat they are wearing, and that governs what they may approve.
 */
export const RoleDisambiguation: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 24, justifyItems: "end" }}>
      <AccountMenu
        {...args}
        account={{
          name: "R. Kulkarni",
          email: "dno-pune@nmba.gov.in",
          role: "District Nodal Officer, Pune",
        }}
      />
      <AccountMenu
        {...args}
        account={{
          name: "R. Kulkarni",
          email: "sno-mh@nmba.gov.in",
          role: "State Nodal Officer, Maharashtra",
        }}
      />
    </div>
  ),
};

/** Name only — legitimate, but it says the least of any variant. */
export const NameOnly: Story = {
  args: { account: { name: "Sunita Deshmukh" } },
};

/**
 * The condensed bar's size. `SiteHeader` passes `avatarSize={40}` once the
 * masthead has condensed, so the block sits at the same 40px as the search
 * button and the sheet trigger beside it. Shown here against the 48 default.
 */
export const InCondensedBar: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 24, justifyItems: "end" }}>
      <AccountMenu {...args} avatarSize={48} />
      <AccountMenu {...args} avatarSize={40} />
    </div>
  ),
};
