import type { Meta, StoryObj } from "@storybook/react";
import { Icon, Link } from "@mosje/design-system";

/**
 * **Link** — text that takes the reader somewhere. Lifecycle: **Stable**.
 *
 * A link changes location; a button performs an action. That distinction is the single
 * most consequential accessibility decision for an interactive element, and it is why
 * this is its own component rather than a Button appearance: before it, 194 hand-rolled
 * brand-coloured anchors were counted across the hub, each deciding its own colour,
 * underline, focus ring and new-tab handling.
 *
 * It binds the `--sa-text-link-*` token family, which had existed since the token build
 * and which no component consumed — the tokens were designed for a Link that was never
 * built.
 */
const meta: Meta<typeof Link> = {
  title: "Navigation/Link",
  component: Link,
  parameters: { layout: "padded" },
};
export default meta;
type Story = StoryObj<typeof Link>;

/**
 * **`inline` is always underlined, and cannot be talked out of it.**
 *
 * WCAG 2.2 §1.4.1 (Use of Color): a link inside a block of text must not be distinguished
 * from the surrounding text by colour alone — and colour is the only other signal a text
 * link has. There is deliberately no modifier to remove it.
 */
export const Inline: Story = {
  render: () => (
    <p style={{ maxWidth: "60ch" }}>
      Applications are assessed under the <Link href="#guidelines">scheme guidelines</Link>{" "}
      published by the Department, and the decision is communicated in writing to the
      address recorded in the <Link href="#application">original application</Link>.
    </p>
  ),
};

/**
 * **`standalone` sits on its own** — a card's "Read more", a list of downloads, a call to
 * action under a heading. It is not inside a block of text, so §1.4.1 does not bind it and
 * the underline waits for hover or focus.
 *
 * The moment one lands inside a paragraph, it is the wrong variant.
 */
export const Standalone: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 12 }}>
      <Link href="#a" variant="standalone" size="sm">Read the guidelines</Link>
      <Link href="#b" variant="standalone" size="md">Read the guidelines</Link>
      <Link href="#c" variant="standalone" size="lg">Read the guidelines</Link>
    </div>
  ),
};

/**
 * **`external` does four things at once, and all four are needed.**
 *
 * `target="_blank"`, `rel="noopener noreferrer"`, a trailing glyph, and a visually hidden
 * "(opens in a new tab)" appended to the accessible name.
 *
 * GIGW 3.0 requires telling the reader when a link opens a new window. The glyph tells the
 * people who can see it; the hidden text tells the people who cannot. One without the
 * other serves half the audience. Twenty-nine of the fifty-eight `target="_blank"` call
 * sites counted across the hub before this component carried no `rel` at all.
 */
export const External: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 12 }}>
      <Link href="https://www.india.gov.in" external variant="standalone">
        National Portal of India
      </Link>
      <p style={{ margin: 0, maxWidth: "60ch" }}>
        Grievances may also be filed on the{" "}
        <Link href="https://pgportal.gov.in" external>
          Centralised Public Grievance Redress system
        </Link>
        .
      </p>
    </div>
  ),
};

/**
 * **`download` marks a file rather than a destination**, and takes a leading glyph naming
 * the format. Say the format and, where you know it, the size — a citizen on a metered
 * connection is entitled to decide before the download starts.
 */
export const Download: Story = {
  render: () => (
    <Link
      href="#report"
      download
      variant="standalone"
      iconLeft={<Icon name="description" size={16} />}
    >
      Annual Report 2025–26 (PDF)
    </Link>
  ),
};

/**
 * **A disabled link is genuinely inert.** `href` is dropped, so the browser's own rules
 * make it unfocusable and unactivatable — there is no click handler to get wrong and no
 * `tabIndex` to keep in sync. `aria-disabled` carries the state, because an anchor has no
 * native `disabled` to read. It is the same mechanism Button's link form uses.
 */
export const Disabled: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 12 }}>
      <Link href="#live" variant="standalone">Download the sanction order</Link>
      <Link href="#pending" variant="standalone" disabled>
        Download the sanction order (not yet issued)
      </Link>
    </div>
  ),
};

/**
 * **`tone="inverse"` is for a solid brand surface** — a navy header, a hero band.
 *
 * The visited colour is deliberately NOT applied there: the visited rung is unreadable on
 * a brand ground, and a history signal is worth less than legibility.
 */
export const InverseTone: Story = {
  render: () => (
    <div style={{ background: "var(--sa-bg-brand-primary-bolder)", padding: 24, borderRadius: 8 }}>
      <p style={{ margin: 0, color: "var(--sa-on-bg-brand-primary-bolder)", maxWidth: "60ch" }}>
        Read the{" "}
        <Link href="#policy" tone="inverse">
          accessibility statement
        </Link>{" "}
        for this site.
      </p>
    </div>
  ),
};

/**
 * **`iconLeft` and `iconRight` are decorative** — the label names the destination, so both
 * are hidden from assistive technology. A glyph that carries meaning the label does not is
 * a label problem, not an icon opportunity.
 *
 * `iconRight` is **suppressed** when `external` or `download` is set: those draw their own
 * trailing glyph, and two trailing marks on one link is a control that looks broken. Reach
 * for `iconRight` on an ordinary in-site link — a chevron on a "next step", say.
 */
export const WithIcons: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 12 }}>
      <Link href="#next" variant="standalone" iconRight={<Icon name="arrow_forward" size={16} />}>
        Continue to eligibility
      </Link>
      <Link href="#back" variant="standalone" iconLeft={<Icon name="arrow_back" size={16} />}>
        Back to the scheme list
      </Link>
    </div>
  ),
};
