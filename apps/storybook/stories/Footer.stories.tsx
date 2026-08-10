import type { Meta, StoryObj } from "@storybook/react";
import { Footer } from "@mosje/design-system";

/**
 * **Footer** — the slim navy app-shell footer.
 *
 * It carries the NeGD / MeitY credit line and the policy links, and it is not
 * decoration: GIGW requires a government property to reach its accessibility
 * statement, privacy policy and terms from every page. The footer is where
 * those live, which is why it belongs on every portal page rather than only the
 * marketing ones.
 *
 * The default `copyright` renders the standard NeGD line with the current year
 * computed at render. Override it only when the property is genuinely credited
 * differently — not to restyle it.
 *
 * `maxWidth` must match the header's. They are separate props on separate
 * components and both default to 1320; change one and the page visibly steps in
 * at the bottom.
 *
 * A `FooterLink` takes `href` **or** `onClick`. Use `href` — a policy page the
 * user cannot open in a new tab, bookmark or share is a policy page that fails
 * the requirement it exists for. Reserve `onClick` for something that genuinely
 * has no URL, such as opening a cookie-preferences dialog.
 *
 * Lifecycle: **Stable**.
 */
const meta = {
  title: "Components/Navigation/Footer",
  component: Footer,
  args: {
    maxWidth: 1320,
    links: [
      { label: "Accessibility statement", href: "/accessibility-statement" },
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms of use", href: "/terms" },
      { label: "Contact us", href: "/contact" },
    ],
  },
  argTypes: {
    maxWidth: { control: { type: "number", min: 960, max: 1920, step: 40 } },
    copyright: { control: false },
    links: { control: false },
  },
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The default credit line, with the GIGW-required policy links. */
export const Playground: Story = {};

/** Credit line only — no policy links. */
export const WithoutLinks: Story = {
  args: { links: undefined },
};

/** A custom credit line, for a property credited differently. */
export const CustomCopyright: Story = {
  args: {
    copyright: (
      <>
        © 2026 Nasha Mukt Bharat Abhiyaan, Department of Social Justice &amp; Empowerment.
        Content owned and maintained by the Ministry of Social Justice &amp; Empowerment,
        Government of India.
      </>
    ),
  },
};

/**
 * An `onClick` link — reserve it for something with no URL, such as cookie
 * preferences. Policy pages should be real links.
 */
export const WithADialogLink: Story = {
  args: {
    links: [
      { label: "Accessibility statement", href: "/accessibility-statement" },
      { label: "Privacy policy", href: "/privacy" },
      { label: "Cookie preferences", onClick: () => {} },
    ],
  },
};

/** A narrower content width, which must match the header's `maxWidth`. */
export const NarrowerContentWidth: Story = {
  args: { maxWidth: 1080 },
};
