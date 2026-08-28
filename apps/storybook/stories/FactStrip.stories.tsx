import type { Meta, StoryObj } from "@storybook/react";
import { FactStrip } from "@mosje/design-system";

/**
 * **FactStrip** — the row of standing facts that sits under a page hero.
 *
 * **Not `MetricCard`.** A metric is a measurement that moves, and MetricCard has
 * a change pill to prove it. These are *facts*: where the office is, how many
 * components a scheme has, who it serves. They never trend. Reach for MetricCard
 * when the number would look wrong without "+12% vs last month" beside it, and
 * for this when a trend on the value would be nonsense.
 *
 * **One card, not a row of cards.** The items share a single surface divided by
 * hairlines, because they are one summary of one organisation rather than four
 * things to compare. `items` is a plain array; four is the count the
 * organisation-detail template uses and the most that stays legible on a laptop.
 *
 * `overlap` pulls the card up so it straddles the band above — the treatment
 * under a coloured page hero, and the reason the banner and the facts read as
 * one unit. Leave it off anywhere the card is not directly under a band, or it
 * will bite into whatever happens to precede it.
 *
 * `ariaLabel` is required and has no sensible default: read aloud without one,
 * the strip is the bare run "New Delhi, Headquarters, 3, Scheme components".
 * Name what the facts are about.
 *
 * `icon` takes a Material Symbols Rounded name, like everywhere else in the
 * estate. The strip renders it at 24 in a tinted chip; there is no size prop,
 * because four differently-sized chips in one row is never the answer.
 *
 * Lifecycle: **Stable**.
 */
const meta = {
  title: "Components/Data display/FactStrip",
  component: FactStrip,
  args: {
    ariaLabel: "Key facts about PM-AJAY",
    overlap: false,
    items: [
      { icon: "location_on", value: "New Delhi", label: "Headquarters" },
      { icon: "widgets", value: "3", label: "Scheme components" },
      { icon: "account_balance", value: "Social Justice & Empowerment", label: "Implementing ministry" },
      { icon: "groups", value: "Scheduled Castes", label: "Who it serves" },
    ],
  },
  argTypes: {
    ariaLabel: { control: "text" },
    overlap: { control: "boolean" },
    items: { control: false },
    className: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 960, margin: "0 auto", padding: 24 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FactStrip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Two facts. The grid centres them rather than stretching each to half the row. */
export const TwoFacts: Story = {
  args: {
    ariaLabel: "Key facts about the National Commission for Scheduled Castes",
    items: [
      { icon: "location_on", value: "New Delhi", label: "Headquarters" },
      { icon: "hub", value: "12 across India", label: "Regional offices" },
    ],
  },
};

/**
 * Under a hero. `overlap` is what makes the banner and the facts read as one
 * unit instead of two stacked blocks — compare with the Playground above, which
 * sits in normal flow.
 */
export const OverlappingAHero: Story = {
  args: { overlap: true },
  decorators: [
    (Story) => (
      <div>
        <div
          style={{
            background: "var(--sa-bg-brand-primary-bolder)",
            color: "var(--sa-text-neutral-inverse)",
            padding: "48px 32px 72px",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "var(--sa-type-headline-4-size)" }}>
            Pradhan Mantri Anusuchit Jaati Abhyuday Yojna (PM-AJAY)
          </h2>
        </div>
        <div style={{ padding: "0 32px 32px" }}>
          <Story />
        </div>
      </div>
    ),
  ],
};
