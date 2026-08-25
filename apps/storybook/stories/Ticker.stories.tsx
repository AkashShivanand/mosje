import type { Meta, StoryObj } from "@storybook/react";
import { Ticker, buttonClasses } from "@mosje/design-system";

/**
 * **Ticker** — the full-bleed announcement strip that runs under the masthead
 * on public pages. A named plinth, one message at a time, and the controls to
 * move through them.
 *
 * **Structural, not content-bound.** Every string, href and route arrives as a
 * prop, so the website's notices and a portal's scheme alerts are the same
 * component with different data.
 *
 * **A strip that moves on its own must be stoppable.** The pause control is not
 * decoration and not optional — WCAG 2.2.2 requires a mechanism to stop motion
 * that starts automatically and runs past five seconds, and prev/next do not
 * satisfy it. It is the one control that survives every breakpoint; never hide
 * it to win space. The Figma frame draws prev and next only, and this is the
 * documented divergence: a published set of values is a floor, not a ceiling.
 *
 * **Reduced motion means it does not advance** — not that it advances without a
 * transition. Suppressing only the animation leaves the message replacing itself
 * every few seconds, which is the part that hurts. The timer never starts, and
 * the citizen steps through with the arrows.
 *
 * **The live region is `off` while it is playing.** An auto-rotating region set
 * to `polite` interrupts a screen-reader user every interval with text they did
 * not ask for. Pausing is what signals intent, so pausing is what turns
 * announcements on.
 *
 * **One item is in the DOM at a time.** The frame stacks the slides and fades
 * the inactive ones to `opacity: 0`, which is right on a canvas and wrong in a
 * browser — an invisible link is still in the tab order. Rendering only the
 * active item costs the exit animation and buys a tab order that matches what
 * is on screen.
 *
 * **The action slot needs `inverseOutlined`.** The strip is a solid brand
 * surface, so a normal outlined button draws its border in a blue nobody can
 * see against it.
 *
 * Lifecycle: **Stable**.
 */
const ITEMS = [
  {
    id: "funding",
    title: "New Funding Alert!",
    description: "Government announces fresh grants for the food processing sector.",
    href: "#funding",
    linkLabel: "Learn More",
  },
  {
    id: "skill-india",
    title: "New Opportunity!",
    description:
      "Ministry launches ‘Skill India Connect’ to train marginalised youth for digital and green jobs.",
    href: "#skill-india",
    linkLabel: "Learn More",
  },
  {
    id: "nos-result",
    title: "National Overseas Scholarship",
    description: "Second-round results for the 2025-26 selection year are now published.",
    href: "#nos",
    linkLabel: "Learn More",
  },
];

const meta = {
  title: "Components/Ticker",
  component: Ticker,
  args: {
    items: ITEMS,
    label: "Latest Updates",
    interval: 5000,
    autoplay: true,
    action: (
      <a href="#all" className={buttonClasses("primary", "inverseOutlined", "sm")}>
        View All Updates
      </a>
    ),
  },
  argTypes: {
    action: { control: false },
    icon: { control: false },
    linkAs: { control: false },
    interval: { control: { type: "number", min: 2000, step: 500 } },
  },
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Ticker>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The default: the frame as drawn, plus the pause control it needs. */
export const Default: Story = {};

/** Stopped on mount. Note that the live region flips to `polite` — this is the
 *  state in which a screen reader is told about the message. */
export const Paused: Story = {
  args: { autoplay: false },
};

/**
 * Headline only. `description` is optional, and without it the strip runs
 * single-line at 56px rather than 72px — the shape the DoSJE website shipped
 * before this component existed.
 */
export const SingleLine: Story = {
  args: {
    items: ITEMS.map(({ id, title, href }) => ({ id, title, href })),
  },
};

/**
 * One item. The arrows still render and still work — they wrap to the same
 * item — but the timer does not start, because there is nothing to advance to.
 */
export const SingleItem: Story = {
  args: { items: [ITEMS[0]!] },
};

/**
 * No action slot. The strip is complete without it; the "View All" route is a
 * convenience the consuming site owns, and it is the first thing to go below
 * 1024px.
 */
export const WithoutAction: Story = {
  args: { action: undefined },
};

/**
 * A renamed strip. `label` is the plinth text AND the section's accessible
 * name, so it is also what the pause and step buttons announce themselves
 * against — "Pause Scheme Alerts", "Next scheme alerts".
 */
export const RenamedStrip: Story = {
  args: {
    label: "Scheme Alerts",
    items: ITEMS,
  },
};

/**
 * An empty list renders nothing at all — no plinth, no empty blue band. A strip
 * with no message is chrome with nothing to say, and leaving the band in place
 * pushes the page down for no reason.
 */
export const Empty: Story = {
  args: { items: [] },
};
