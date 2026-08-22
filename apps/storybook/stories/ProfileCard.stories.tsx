import type { Meta, StoryObj } from "@storybook/react";
import { ProfileCard } from "@mosje/design-system";

/**
 * **ProfileCard** — a person, as a portrait card: photograph, name, role, and
 * an optional tag over the image.
 *
 * The estate's case is the About Us page's political leadership row — the
 * Minister and Ministers of State, shown together as a set. That is the shape
 * it is for: **a small grid of people of equal standing**, where the portrait
 * is doing real work because the reader may be trying to recognise a face.
 *
 * **When NOT to reach for it.** Not for a directory. Who's Who lists dozens of
 * officials with designation, division and contact details, and a grid of
 * 320px-tall portraits is the wrong tool for a list you scan or search — that
 * is a table. Not for one person alone, where a portrait card floating in a
 * section reads as an advertisement. Not for organisations or schemes; the
 * subtitle is a *role*, and `Card` is the general container. And not without a
 * real photograph: a placeholder avatar in a portrait frame draws attention to
 * the gap it is filling.
 *
 * **`image` is a slot, and it has a contract.** Pass a rendered `<img>` or a
 * `next/image` with `fill`; the wrapper is `position: relative` at a fixed
 * height. The stylesheet styles a direct `> img` child — object-fit, top
 * cropping and the hover zoom — so **the image needs no classes of its own**.
 * `object-position: top`, because a portrait cropped from the centre takes the
 * top off people's heads.
 *
 * **`tag` sits over the bottom of the photograph.** It is for one short
 * qualifier — the estate uses "MoSJE GOI". It is white text on a translucent
 * dark pill, so it is legible over most portraits, but it is still text on an
 * uncontrolled image: check it against the actual photographs, not a grey box.
 * Omit it rather than filling it with something the title already says.
 *
 * **`title` renders as an `h3` and `subtitle` as a paragraph.** The level is
 * fixed, which suits a grid inside a section already introduced by an `h2`.
 *
 * Lifecycle: **Stable**.
 */
const meta = {
  title: "Data Display/ProfileCard",
  component: ProfileCard,
  args: {
    title: "Dr. Virendra Kumar",
    subtitle: "Hon'ble Union Minister",
    tag: "MoSJE GOI",
    image: <img src="https://placehold.co/400x480/003975/ffffff?text=Portrait" alt="" />,
  },
  argTypes: {
    title: { control: "text" },
    subtitle: { control: "text" },
    tag: { control: "text" },
    image: { control: false },
  },
  parameters: { layout: "padded" },
} satisfies Meta<typeof ProfileCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** One card, at the width it takes in a three-column grid. */
export const Default: Story = {
  render: (args) => (
    <div style={{ maxWidth: 360 }}>
      <ProfileCard {...args} />
    </div>
  ),
};

const LEADERSHIP = [
  { name: "Dr. Virendra Kumar", role: "Hon'ble Union Minister" },
  { name: "Shri Ramdas Athawale", role: "Hon'ble Minister of State" },
  { name: "Shri B. L. Verma", role: "Hon'ble Minister of State" },
];

/**
 * The shape the estate uses: a row of people of equal standing, read as a set.
 * The photographs align because the image wrapper is a fixed height, and the
 * cards themselves match because grid rows stretch — so a name that wraps to
 * two lines lengthens every card in the row together rather than one.
 */
export const LeadershipRow: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "var(--sa-inline-24)",
      }}
    >
      {LEADERSHIP.map((p) => (
        <ProfileCard
          key={p.name}
          title={p.name}
          subtitle={p.role}
          tag="MoSJE GOI"
          image={
            <img
              src={`https://placehold.co/400x480/003975/ffffff?text=${encodeURIComponent(p.name.split(" ").slice(-1)[0])}`}
              alt=""
            />
          }
        />
      ))}
    </div>
  ),
};

/**
 * `tag` omitted. Use this when the qualifier would repeat the subtitle or the
 * surrounding section heading — an unnecessary pill is one more thing sitting
 * on someone's face.
 */
export const WithoutTag: Story = {
  args: { tag: undefined },
  render: (args) => (
    <div style={{ maxWidth: 360 }}>
      <ProfileCard {...args} />
    </div>
  ),
};

/**
 * A long name and a long role, to check wrapping. Both are slots, so they take
 * nodes as well as strings — but the card is sized for a name and a line, not
 * a biography.
 */
export const LongText: Story = {
  args: {
    title: "Shri Ramdas Bandu Athawale",
    subtitle: "Hon'ble Minister of State for Social Justice & Empowerment",
  },
  render: (args) => (
    <div style={{ maxWidth: 300 }}>
      <ProfileCard {...args} />
    </div>
  ),
};
