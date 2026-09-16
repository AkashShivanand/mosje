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
 * **One card, not a row of cards.** The items share a single surface, because
 * they are one summary of one organisation rather than four things to compare.
 * There is no rule between the cells: the marks already give the row its
 * rhythm, and vertical hairlines under a hero add furniture to the calmest band
 * on the page.
 *
 * **`variant` has two shapes, and the item count picks one.** Up to five facts
 * it is `compact` — one row of centred stacks, the treatment the handoff draws.
 * Above five it cannot BE one row, so it becomes `extended`: the cells wrap to a
 * balanced column count, each turns on its side with the mark in a column of its
 * own, and the value steps up from `headline-5` to `headline-2` so it reads as a
 * figure rather than as a line of text that happens to be numeric. Five is
 * arithmetic rather than taste — `minmax(200px, 1fr)` fits at most five tracks
 * in the widest content column on the estate. Pass `variant` only to override
 * the count: a six-item strip that must stay compact, or a four-item one that
 * must read as figures.
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
 * estate. The strip renders it at 32 in a tinted chip; there is no size prop,
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
    variant: {
      control: "inline-radio",
      options: ["compact", "extended"],
      description:
        "Leave it unset and the item count decides — compact up to five facts, extended above.",
    },
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

/**
 * **Eight facts, so `variant` resolves to `extended` on its own** — nothing is
 * passed here. The cells wrap four across, each turns on its side, and the
 * figure steps up to `headline-2` against a `body-2` caption: 2.3:1 where
 * compact is 1.25:1, which is the weakest hierarchy two sizes can have.
 *
 * The card is SHORTER than the same eight would be stacked — 220px against 312 —
 * because a side-on cell puts the mark beside two lines instead of above them.
 * These are the Abhiyaan's published counters, read on 7 September 2026.
 */
export const Extended: Story = {
  args: {
    ariaLabel: "Nasha Mukt Bharat Abhiyaan in numbers",
    items: [
      { icon: "groups", value: "345,703,321", label: "People reached" },
      { icon: "school", value: "137,209,589", label: "Youth reached" },
      { icon: "woman", value: "106,563,417", label: "Women reached" },
      { icon: "menu_book", value: "3,726,319", label: "Activities in educational institutes" },
      { icon: "healing", value: "28,29,661+", label: "Persons treated and rehabilitated" },
      { icon: "local_hospital", value: "755+", label: "DoSJE-supported de-addiction centres" },
      { icon: "front_hand", value: "3,361,211", label: "Total pledges" },
      { icon: "volunteer_activism", value: "164,943", label: "Nasha Mukti Mitr registered" },
    ],
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 1272, margin: "0 auto", padding: 24 }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * **`variant` overriding the count.** The same four facts as the Playground,
 * forced into the extended shape — a set small enough to be a strip, set as
 * figures because the page wants them read that way. The override exists for
 * this; it is not the default for a reason.
 */
export const ExtendedByOverride: Story = {
  args: { variant: "extended" },
};
