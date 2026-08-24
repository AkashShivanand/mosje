import type { Meta, StoryObj } from "@storybook/react";
import { BrandLockup } from "@mosje/design-system";

/**
 * **BrandLockup** — the National Emblem plus the three-line government text
 * stack.
 *
 * `SiteHeader` renders this for you. Use it directly only where there is no
 * header: a login shell, an error page, a print header, an email template.
 *
 * The rules it enforces are not stylistic preferences, they are estate policy:
 * the mark is the **National Emblem**, never an invented or abstract logo, and
 * the three lines run *Government of India* → *Ministry* → *Department* in that
 * order, with the department the bold line. Get the order wrong and the lockup
 * misstates the hierarchy of the institution.
 *
 * `emblemSrc` is a **URL**, not an import, because each zone is mounted under
 * its own basePath and the design system cannot resolve it. Pass a
 * basePath-aware path.
 *
 * The variants map to context: `compact` for app-shell chrome,
 * `textHiddenOnMobile` where the row would otherwise wrap on a phone. Only
 * `department` is required — a portal often carries the scheme name there and
 * drops the ministry line.
 *
 * The rule between the emblem and the wordmark is NOT a prop here. It belongs to
 * the header that composes the lockup, as `SiteHeader`'s `brandDivider` — a
 * separator between two things is a property of the row that holds them, not of
 * either one.
 *
 * Lifecycle: **Stable**.
 *
 * `inverse` flips the wordmark to its white-on-dark cut. Use it only on a dark
 * ground — the accessibility bar, a footer band, a print header on colour.
 * On a light surface it fails contrast, so there is deliberately no story
 * showing it there.
 */
const EMBLEM = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="64" viewBox="0 0 48 64">` +
    `<rect width="48" height="64" fill="none" stroke="#9ca3af" stroke-dasharray="3 3"/>` +
    `<text x="24" y="36" font-family="Noto Sans, sans-serif" font-size="9" fill="#6b7280" text-anchor="middle">Emblem</text>` +
    `</svg>`,
)}`;

const meta = {
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/file/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=4235-3652"
    }
  },
  title: "Components/Navigation/BrandLockup",
  component: BrandLockup,
  args: {
    emblemSrc: EMBLEM,
    emblemAlt: "National Emblem of India",
    lines: {
      org: "Government of India",
      ministry: "Ministry of Social Justice & Empowerment",
      department: "Department of Social Justice & Empowerment",
    },
    href: "/",
    beta: false,
    compact: false,
    textHiddenOnMobile: false,
  },
  argTypes: {
    beta: { control: "boolean" },
    compact: { control: "boolean" },
    textHiddenOnMobile: { control: "boolean" },
    href: { control: "text" },
    emblemAlt: { control: "text" },
    emblemSrc: { control: false },
    lines: { control: false },
  },
} satisfies Meta<typeof BrandLockup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** `compact` for app-shell chrome; `beta` for a pre-release property. */
export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 32 }}>
      <BrandLockup {...args} />
      <BrandLockup {...args} compact />
      <BrandLockup {...args} beta />
      <BrandLockup {...args} compact beta />
    </div>
  ),
};

/**
 * A portal carries the scheme name as the department line and usually drops the
 * ministry line. Only `department` is required.
 */
export const PortalLines: Story = {
  args: {
    compact: true,
    lines: {
      org: "Government of India",
      department: "Nasha Mukt Bharat Abhiyaan",
    },
  },
};

/** The bare minimum — the department line alone. */
export const DepartmentOnly: Story = {
  args: {
    lines: { department: "Department of Social Justice & Empowerment" },
  },
};

/** The BETA badge sits on its own row above the text stack. */
export const Beta: Story = {
  args: { beta: true },
};
