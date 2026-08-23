import type { Meta, StoryObj } from "@storybook/react";
import { ProfileCard } from "@mosje/design-system";

/**
 * **ProfileCard** — a portrait, a name and a role. Used for the ministers,
 * secretaries and officers pages, where the photograph is the point.
 *
 * Reach for it when a person's face is what the reader is scanning for. When
 * they are scanning names instead — a directory, a contact list, a committee
 * roster — a table or a plain list finds the answer faster and reads better
 * on a phone. Lifecycle: **Stable**.
 *
 * `image` is a slot, not a src, so the caller decides between `next/image` and
 * a plain `<img>`. `tag` overlays the portrait: keep it to one short phrase.
 */
const meta = {
  title: "Components/Data display/ProfileCard",
  component: ProfileCard,
  args: {
    title: "Dr. Virendra Kumar",
    subtitle: "Minister of Social Justice & Empowerment",
  },
} satisfies Meta<typeof ProfileCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A neutral block stands in for the portrait so the story needs no asset. */
const Portrait = (
  <div
    style={{
      width: "100%",
      height: "100%",
      background: "var(--sa-bg-brand-primary-subtler)",
    }}
    aria-hidden="true"
  />
);

export const Playground: Story = {
  args: { image: Portrait },
  render: (args) => (
    <div style={{ maxWidth: "320px" }}>
      <ProfileCard {...args} />
    </div>
  ),
};

/** With the overlay tag — a portfolio, a division, a term of office. */
export const WithTag: Story = {
  args: { image: Portrait, tag: "Cabinet Minister" },
  render: (args) => (
    <div style={{ maxWidth: "320px" }}>
      <ProfileCard {...args} />
    </div>
  ),
};
