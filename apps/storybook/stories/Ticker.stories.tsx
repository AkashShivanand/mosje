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
 * **`orientation` picks one of TWO SHAPES.** `horizontal` is the **bar**: the
 * 72px full-bleed strip, one message at a time, stepped with prev/next.
 * `vertical` is the **panel**: the same items stacked as rows scrolling upward
 * under a header. Several headlines are legible at once, and there is no
 * stepping because the list moves on its own. In the panel `title` becomes the
 * bold lead-in before the colon and `description` the sentence after it.
 *
 * **The panel stops on hover and on focus, not only on the button.** A moving
 * row is a moving tap target — without it the line somebody is reading walks
 * out from under the pointer. It also does not scroll at all below 640px,
 * where there is no hover to stop it with.
 *
 * **Nothing that cannot move shows controls that govern motion.** Below two
 * items (bar), or when the list is no longer than its own window (panel), the
 * whole cluster goes — a pause button on something that is not moving is worse
 * than absent, because it advertises motion to escape from.
 *
 * **Nothing is truncated.** Both shapes wrapped to an ellipsis until it met the
 * real list: two DoSJE notices both open "Extension of Application Submission
 * Date for Financial Adviser (FA) Post at…" and clipped to the *same visible
 * string* — two links reading identically and going to different pages. Text
 * wraps; the bar has a minimum height and grows, and the panel measures its
 * window with a `ResizeObserver` rather than calculating it from a nominal row
 * height that wrapping makes meaningless.
 *
 * **The panel is built from the bar's parts.** Its header is the bar's navy
 * plinth, over the bar's blue ground, in the bar's single ink, with rows set in
 * the bar's own title role. Side by side they read as one component in two
 * shapes — which is what they are.
 *
 * **Each row is a title over a subtitle** — the structure the live site uses and
 * the one the bar already had. The notice is the title; its kind and date are
 * the subtitle. A subtitle is allowed to repeat, which is why the kind can be
 * shown here when it could not be as a bold lead-in on the same line.
 *
 * **Rows do not underline on hover.** WCAG 1.4.1 asks that a link be
 * distinguishable from the text *around* it; in a list where every row is a
 * link there is no surrounding text. The wash and the cursor carry it.
 *
 * **Pause holds its place.** The animation is applied whenever the list *can*
 * scroll and only `animation-play-state` moves — gating the property itself on
 * "is it playing" reset the track to zero.
 *
 * **The ground is `primaryScale/600`, and that is a contrast fix.** White on
 * `/500` is 4.64:1 and any dimming fails (80% is 3.52:1). On `/600` the title
 * is 6.36:1 and the subtitle 4.66:1.
 *
 * **The mark is `<TickerMark>`, a bespoke animated SVG** — a megaphone whose
 * arcs pulse while the strip moves and stop when it is paused. It replaced a
 * white rounded tile, which on the navy plinth read as a sticker pasted onto
 * the bar. It is a bespoke mark rather than an `<Icon>` because it animates in
 * parts and answers to the strip's state; a font glyph can do neither.
 *
 * **A panel row with no `description` renders the title as the row**, in normal
 * weight with no colon. The bold lead-in only exists when there is a sentence
 * for it to lead into — and real notice lists repeat their categories, so a
 * lead-in mapped from one draws the same bold word down the whole rail.
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

/** Enough notices to overflow a four-row window, so the panel has something to
 *  scroll past. In the panel the title is the bold lead-in before the colon. */
const LONG_LIST = [
  ...ITEMS,
  { id: "vacancy", title: "Vacancies", description: "Financial Adviser at DAF and BJRNF — application window extended.", href: "#vacancy" },
  { id: "tender", title: "Tender", description: "Supply and installation of assistive devices, Phase III.", href: "#tender" },
  { id: "report", title: "Documents", description: "Annual Report 2025-26 is now available in English and Hindi.", href: "#report" },
];

const meta = {
  title: "Components/Ticker",
  component: Ticker,
  args: {
    items: ITEMS,
    label: "Latest Updates",
    orientation: "horizontal",
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
    orientation: { control: "inline-radio", options: ["horizontal", "vertical"] },
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
 * The **panel** — items stacked and scrolling upward under a header. Hover it
 * and the scroll stops; tab into it and it stops too. With six items over a
 * four-row window there is something to scroll past, so it moves.
 */
export const Vertical: Story = {
  args: { orientation: "vertical", items: LONG_LIST },
};

/**
 * A taller panel. `rows` is what sets the height, and the travel is per row, so
 * a longer list takes proportionally longer to loop — the reading speed stays
 * the same however many notices the ministry publishes.
 */
export const VerticalSixRows: Story = {
  args: { orientation: "vertical", items: LONG_LIST, rows: 6, interval: 3000 },
};

/**
 * A panel with nothing to scroll past — four items in a four-row window. It is
 * a still list, and the pause control is gone with the motion it governed.
 */
export const VerticalStatic: Story = {
  args: { orientation: "vertical", items: LONG_LIST.slice(0, 4) },
};

/**
 * Rows with **no `description`** — the shape the DoSJE website actually uses,
 * because its notice categories repeat ("Documents" seven times out of eight)
 * and a lead-in mapped from one would draw the same bold word down the rail.
 * Each row is the notice, in normal weight, with no dangling colon.
 */
export const VerticalTitlesOnly: Story = {
  args: {
    orientation: "vertical",
    rows: 4,
    items: LONG_LIST.map(({ id, title, description, href }) => ({
      id,
      title: description ?? title,
      href,
    })),
  },
};

/**
 * One item, and therefore **no controls at all**. The timer never starts below
 * two, so pause, prev and next would be three buttons that visibly do nothing —
 * and a pause control on a strip that is not moving is worse than absent,
 * because it advertises motion a citizen might be trying to escape. The message
 * and the action remain.
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
