import type { Meta, StoryObj } from "@storybook/react";
import { ContentNav } from "@mosje/design-system";

/**
 * **ContentNav** — the grouped section index beside a long website content page.
 *
 * **Not `SidebarNav`.** That is a portal application rail: an icon on every
 * item, collapsible to a strip, and a client component because it owns
 * open/closed state. This is a table of contents for a *document* — labelled
 * groups of links, no icons, no state, no client bundle. Choosing wrong is
 * obvious in hindsight and easy in the moment: if the destinations are sections
 * of the page you are on, it is this; if they are screens of an application, it
 * is SidebarNav.
 *
 * **Only one item may carry `current`.** It renders as the filled pill and sets
 * `aria-current="page"`, so the state reaches assistive technology and is not
 * carried by the blue fill alone.
 *
 * **`ariaLabel` is required.** A page already has a masthead nav and a
 * breadcrumb nav; a third one announced as just "navigation" tells a
 * screen-reader user nothing about which of the three they have landed in.
 *
 * `linkAs` swaps `<a>` for the router's link component — pass Next's `Link` in
 * the hub so in-page navigation is not a full reload. Anchor hrefs (`#contact`)
 * work either way.
 *
 * Group labels render as a banded caps label, **not** a heading, deliberately:
 * a page's heading outline should describe its content, not its navigation. The
 * list structure carries the grouping.
 *
 * **Mark off-site entries `external`.** An index reads as a list of places on
 * this page, so an entry that is really a PDF on another host has to say so —
 * otherwise the reader finds out when a download starts. `external` renders a
 * real `<a target="_blank">` with the launch glyph *and* a screen-reader phrase;
 * the glyph alone conveys it by icon only.
 *
 * **`current` is a prop, not a behaviour.** The component does no scroll-spying:
 * that would make every page with an index ship client JavaScript for it. A
 * consumer that wants the section-in-view highlighted computes `current` itself
 * — see `OrganisationIndex` in the hub, which is the only client component on an
 * otherwise server-rendered page.
 *
 * `sticky` (on by default) keeps the index on screen as the reader scrolls, and
 * caps its height so a long index scrolls inside itself rather than hiding its
 * own tail. It turns itself off below 1024px, where the index sits above the
 * article in normal flow.
 *
 * Lifecycle: **Stable**.
 */
const meta = {
  title: "Components/Navigation/ContentNav",
  component: ContentNav,
  args: {
    ariaLabel: "Sections of the PM-AJAY page",
    sticky: false,
    groups: [
      {
        label: "About us",
        items: [{ label: "About the Scheme", href: "#about-the-scheme", current: true }],
      },
      {
        label: "Our work & impact",
        items: [
          { label: "Components", href: "#components" },
          { label: "Circulars & Notifications", href: "#circulars-notifications" },
          {
            label: "Downloads (PM-AJAY)",
            href: "#resources",
            children: [
              { label: "Utilization Certificate", href: "https://example.gov.in/uc.pdf", external: true },
              { label: "Implementation Status", href: "https://example.gov.in/status", external: true },
              { label: "Institute Registration Form", href: "https://example.gov.in/form.pdf", external: true },
            ],
          },
        ],
      },
      {
        label: "Connect & engage",
        items: [
          { label: "Gallery", href: "#gallery" },
          { label: "Contact", href: "#contact" },
        ],
      },
    ],
  },
  argTypes: {
    ariaLabel: { control: "text" },
    sticky: { control: "boolean" },
    groups: { control: false },
    linkAs: { control: false },
    className: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 300, padding: 24 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ContentNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** A single unlabelled group — the shape a page with no section families needs. */
export const Flat: Story = {
  args: {
    ariaLabel: "Sections of the National Overseas Scholarship page",
    groups: [
      {
        items: [
          { label: "Eligibility", href: "#eligibility", current: true },
          { label: "How to apply", href: "#apply" },
          { label: "Selection", href: "#selection" },
          { label: "Contact", href: "#contact" },
        ],
      },
    ],
  },
};
