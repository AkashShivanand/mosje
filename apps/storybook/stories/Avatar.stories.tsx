import type { Meta, StoryObj } from "@storybook/react";
import { Avatar, Icon } from "@mosje/design-system";

/**
 * **Avatar** — a person or an organisation, in one small square.
 *
 * It falls back in a fixed order: `src` → `initials` → `icon` → a default user
 * glyph. That order is the useful part — pass initials alongside an image and a
 * broken or slow photograph degrades to something recognisable instead of an
 * anonymous silhouette.
 *
 * On accessibility: an avatar beside a name that is already on screen is
 * **decoration**, and repeating the name in `alt` makes a screen reader say it
 * twice. Give it `alt=""` there. Use a real `alt` only when the avatar is the
 * sole identification.
 *
 * Do not use it as a status dot or a colour-coded category marker — those are
 * `Badge`. And do not use a photograph of a citizen anywhere their identity is
 * not already established on the page.
 *
 * Lifecycle: **Stable**.
 */
const meta = {
  title: "Components/Data display/Avatar",
  component: Avatar,
  args: {
    size: 40,
    shape: "circular",
    initials: "RK",
    alt: "",
  },
  argTypes: {
    size: { control: "inline-radio", options: [24, 32, 40, 48] },
    shape: { control: "inline-radio", options: ["circular", "rounded"] },
    initials: { control: "text" },
    src: { control: "text" },
    alt: { control: "text" },
    icon: { control: false },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** The fallback chain, in order. Each step down is one the user still reads. */
export const FallbackOrder: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      <Avatar
        {...args}
        src="data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2296%22%20height%3D%2296%22%3E%3Crect%20width%3D%2296%22%20height%3D%2296%22%20fill%3D%22%234b5563%22%2F%3E%3C%2Fsvg%3E"
        alt="R. Kulkarni"
      />
      <Avatar {...args} initials="RK" />
      <Avatar {...args} initials={undefined} icon={<Icon name="apartment" size={20} aria-hidden />} />
      <Avatar {...args} initials={undefined} />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      {([24, 32, 40, 48] as const).map((size) => (
        <Avatar {...args} key={size} size={size} />
      ))}
    </div>
  ),
};

/** `rounded` reads as an organisation; `circular` as a person. */
export const Shapes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center", color: "var(--sa-color-text-default)" }}>
        <Avatar {...args} shape="circular" initials="RK" />
        <span>R. Kulkarni · District Nodal Officer</span>
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center", color: "var(--sa-color-text-default)" }}>
        <Avatar {...args} shape="rounded" initials="BK" />
        <span>Brahma Kumaris · Spiritual organisation</span>
      </div>
    </div>
  ),
};

/**
 * In a list beside the name — the decorative case. `alt=""` keeps a screen
 * reader from reading each officer's name twice.
 */
export const InAList: Story = {
  render: (args) => (
    <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 12 }}>
      {[
        ["SD", "Sunita Deshmukh", "State Nodal Officer, Maharashtra"],
        ["RK", "R. Kulkarni", "District Nodal Officer, Pune"],
        ["IQ", "Imran Qureshi", "Block Nodal Officer, Haveli"],
      ].map(([initials, name, role]) => (
        <li key={name} style={{ display: "flex", gap: 12, alignItems: "center", color: "var(--sa-color-text-default)" }}>
          <Avatar {...args} initials={initials} alt="" />
          <span>
            <strong>{name}</strong>
            <br />
            <span style={{ color: "var(--sa-text-neutral-subtle)" }}>{role}</span>
          </span>
        </li>
      ))}
    </ul>
  ),
};
