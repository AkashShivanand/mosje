import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Breadcrumb } from "@mosje/design-system";

/**
 * **Breadcrumb** — where this page, or this view, sits in the hierarchy.
 *
 * `items` is the trail, ancestor first, and each entry is one of four things:
 *
 * - **`href`** — a link to an ancestor page. The default and preferred shape:
 *   shareable, middle-clickable, crawled, and working before hydration.
 * - **`onSelect`** — a button that pops *client state* back to that level. This
 *   is the drill trail over a map that zooms in place, where the levels have no
 *   URL of their own. Ignored when `href` is also given.
 * - **neither** — a section with no landing page. Not an oversight: the website's
 *   "Department", "Documents" and "Associated Organisations" are mega-menu
 *   categories with no route behind them, and 64 pages pass one as a middle
 *   crumb. Labelling it is honest; linking it somewhere it does not go is not.
 * - **the last entry** — the page or view you are on. Never interactive, whatever
 *   it carries, and the only crumb marked `aria-current="page"`.
 *
 * Each entry may also carry an `icon` (a Material Symbols name) drawn before its
 * label — `"home"` on the first crumb of a site trail. It is decorative and
 * `aria-hidden`; the label still carries the meaning.
 *
 * `label` names the surrounding `<nav>` (default `"Breadcrumb"`) — make it
 * specific when a page has more than one trail. `wrap` (default `true`) decides
 * whether a long trail may run onto a second line; pass `false` inside a
 * fixed-width rail, where a second line would change the panel's height every
 * time the reader drills. Either way the current crumb ellipsises rather than
 * overflowing. `linkAs` swaps the element used for `href` crumbs — pass
 * `next/link` inside a Next app to keep soft navigation and prefetch; it
 * defaults to a plain `<a>`, which is what lets this work outside Next.
 * `className` lands on the `<nav>`.
 *
 * **Accessibility.** A named `<nav>` around an ordered list — the order *is* the
 * meaning. `aria-current="page"` marks exactly one crumb, the last; the markup
 * this replaced stamped it on every non-linked crumb, so on 64 pages a
 * screen-reader user was told twice they were on the current page. Separators
 * are `aria-hidden` chevrons, so the trail is announced as a list of names
 * rather than punctuated with "chevron right". Crumbs clear 24px vertically
 * (WCAG 2.2 AA §2.5.8), and link ink measures 4.6:1 at rest and 5.6:1 on the
 * hover wash.
 *
 * Lifecycle: **Stable**.
 */
const meta = {
  title: "Components/Navigation/Breadcrumb",
  component: Breadcrumb,
  args: {
    label: "Breadcrumb",
    wrap: true,
    items: [
      { label: "Home", href: "/website", icon: "home" },
      { label: "Associated Organisations" },
      { label: "Pradhan Mantri Anusuchit Jaati Abhyuday Yojana" },
    ],
  },
  argTypes: {
    label: { control: "text" },
    wrap: { control: "boolean" },
    items: { control: false },
    linkAs: { control: false },
    className: { control: false },
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A website page trail: a linked Home with its icon, a section that has no
 * landing page of its own, and the page you are on.
 */
export const Playground: Story = {};

/** Every crumb above the last is a real link. */
export const AllLinked: Story = {
  args: {
    items: [
      { label: "Home", href: "/website", icon: "home" },
      { label: "Documents", href: "/website/resources" },
      { label: "Annual Reports", href: "/website/annual-reports" },
      { label: "Annual Report 2024–25" },
    ],
  },
};

/**
 * The drill form. Nothing here has a URL — the crumbs pop the map's own state,
 * so they are buttons. Note what that costs: this view cannot be shared or
 * restored, which is why `href` is the default and this is the exception.
 */
export const DrillState: Story = {
  render: function Render(args) {
    const [trail, setTrail] = React.useState(["India", "Tamil Nadu", "Coimbatore"]);
    return (
      <div style={{ display: "grid", gap: 12 }}>
        <Breadcrumb
          {...args}
          label="Map area"
          items={trail.map((name, i) => ({
            label: name,
            onSelect: () => setTrail(trail.slice(0, i + 1)),
          }))}
        />
        <button type="button" onClick={() => setTrail(["India", "Tamil Nadu", "Coimbatore"])}>
          Drill back in
        </button>
      </div>
    );
  },
};

/**
 * A 304px rail — PM-AJAY's. With `wrap={false}` the trail stays on one line and
 * the current crumb ellipsises; the default would give the panel a second line
 * and change its height every time the reader drills.
 */
export const InANarrowRail: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 24 }}>
      {[false, true].map((wrap) => (
        <div key={String(wrap)}>
          <p style={{ margin: "0 0 8px", color: "var(--sa-text-neutral-subtle)" }}>
            wrap={String(wrap)}
          </p>
          <div style={{ width: 304, border: "1px dashed var(--sa-border-neutral-base)", padding: 8 }}>
            <Breadcrumb
              {...args}
              wrap={wrap}
              label="Map area"
              items={[
                { label: "India", onSelect: () => {} },
                { label: "Andaman and Nicobar Islands" },
              ]}
            />
          </div>
        </div>
      ))}
    </div>
  ),
};

/**
 * A single crumb is a legitimate trail — the top of the hierarchy, marked as
 * current with nothing above it. An EMPTY `items` renders nothing at all, so a
 * page with no trail needs no guard at the call site.
 */
export const SingleCrumb: Story = {
  args: { items: [{ label: "India", icon: "home" }] },
};
