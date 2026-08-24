import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button, SiteHeader } from "@mosje/design-system";

/**
 * **SiteHeader** — the SAMAVESH Navbar, in its two estate variants.
 *
 * `variant` is not cosmetic; it sets behaviour:
 *
 * - **`website`** (default) — a static masthead for the public site. Full
 *   accessibility bar, primary nav with mega-menus, a Login or Apply CTA.
 * - **`portal`** — app-shell chrome. Defaults `sticky` on, and carries the nav
 *   toggle and the account block instead of a marketing CTA.
 *
 * `collapseOnScroll` stays **opt-in even for portals**, and the reason matters:
 * it changes the chrome height that an app-shell sidebar's offset is measured
 * against. Turn it on and you must make the sidebar sticky under the brand row,
 * or the rail will drift as the user scrolls.
 *
 * The header takes **asset URLs, not imports** — `emblemSrc`, `cobranding[].src`
 * — because every zone is mounted under its own basePath and the design system
 * cannot know it. Pass a basePath-aware path from the app.
 *
 * Two standing estate rules apply here: the logo is the **National Emblem**,
 * never an invented mark, and there is **no tricolour stripe** in the chrome.
 *
 * The accessibility bar carries three things worth setting deliberately:
 *
 * - **`skipTo`** is the skip-link target, defaulting to `#main-content`. It is
 *   only a WCAG 2.4.1 pass if that id **exists on the page** — a skip link that
 *   lands nowhere is worse than none, because a keyboard user believes they
 *   have moved.
 * - **`accessibilityHref`** points at the accessibility statement, which GIGW
 *   requires to be reachable from every page. **`onAccessibility`** overrides it
 *   with a handler when the property opens a dialog instead; set one or the
 *   other, not both.
 * - **`language`** is the language selector. Give it an `onClick` only when the
 *   property genuinely has another language to switch to.
 *
 * Font-size and contrast controls deliberately do **not** live in the
 * accessibility bar — they duplicated the official UX4G widget, which is the
 * single canonical accessibility mechanism estate-wide.
 *
 * `BrandLockup` and `AccountMenu` have their own stories; this documents the
 * assembled header.
 *
 * Lifecycle: **Stable**.
 *
 * `homeHref` is the ZONE root, not the hub root: `/website` for the public site,
 * `/portals/<slug>` inside a portal. Pointing it at `/` sends a portal user out
 * of the app they are working in, which is why it has no story — there is only
 * one correct value per surface and it is not a choice to browse.
 */

/**
 * Placeholder brand *assets*. In a real app these are basePath-aware paths to
 * the National Emblem and cobranding marks in the zone's `public/` folder.
 */
const asset = (label: string, w: number, h: number) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
      `<rect width="${w}" height="${h}" fill="none" stroke="#9ca3af" stroke-dasharray="3 3"/>` +
      `<text x="${w / 2}" y="${h / 2 + 4}" font-family="Noto Sans, sans-serif" font-size="10" fill="#6b7280" text-anchor="middle">${label}</text>` +
      `</svg>`,
  )}`;

const EMBLEM = asset("Emblem", 48, 64);

const BRAND_LINES = {
  org: "Government of India",
  ministry: "Ministry of Social Justice & Empowerment",
  department: "Department of Social Justice & Empowerment",
};

const NAV = [
  { label: "Home", href: "/", active: true },
  {
    label: "About us",
    href: "/about",
    children: [
      { label: "Vision and mission", href: "/about/vision" },
      { label: "Organisation chart", href: "/about/organisation" },
      { label: "Who's who", href: "/about/whos-who" },
    ],
  },
  {
    label: "Associated organisations",
    href: "/organisations",
    columns: [
      {
        heading: "Commissions",
        items: [
          { abbr: "NCSC", name: "National Commission for Scheduled Castes", href: "/org/ncsc" },
          { abbr: "NCBC", name: "National Commission for Backward Classes", href: "/org/ncbc" },
          { abbr: "NCSK", name: "National Commission for Safai Karamcharis", href: "/org/ncsk" },
        ],
      },
      {
        heading: "Corporations",
        items: [
          { abbr: "NSFDC", name: "National Scheduled Castes Finance & Development Corporation", href: "/org/nsfdc" },
          { abbr: "NSKFDC", name: "National Safai Karamcharis Finance & Development Corporation", href: "/org/nskfdc" },
          { abbr: "NBCFDC", name: "National Backward Classes Finance & Development Corporation", href: "/org/nbcfdc" },
        ],
      },
      {
        heading: "Councils",
        links: [
          { label: "National Institute of Social Defence", href: "/org/nisd" },
          { label: "Dr Ambedkar Foundation", href: "/org/daf" },
        ],
      },
    ],
  },
  {
    label: "Schemes",
    href: "/schemes",
    children: [
      { label: "SMILE", href: "/schemes/smile" },
      { label: "PM-AJAY", href: "/schemes/pm-ajay" },
      { label: "Nasha Mukt Bharat Abhiyaan", href: "/schemes/nmba" },
      { label: "Scholarships", href: "/schemes/scholarships" },
    ],
  },
  { label: "Contact us", href: "/contact" },
];

const meta = {
  title: "Components/Navigation/SiteHeader",
  component: SiteHeader,
  args: {
    variant: "website",
    emblemSrc: EMBLEM,
    emblemAlt: "National Emblem of India",
    brandLines: BRAND_LINES,
    nav: NAV,
    govLink: { href: "https://www.india.gov.in", label: "Government of India" },
    beta: false,
    sticky: false,
    collapseOnScroll: false,
    accessibilityToolbar: true,
    tone: "blue",
    cobranding: [
      { src: asset("Digital India", 120, 44), alt: "Digital India", height: 44 },
      { src: asset("SAMAVESH", 60, 44), alt: "SAMAVESH", height: 44 },
    ],
  },
  argTypes: {
    variant: { control: "inline-radio", options: ["website", "portal"] },
    tone: { control: "inline-radio", options: ["blue", "navy"] },
    beta: { control: "boolean" },
    sticky: { control: "boolean" },
    collapseOnScroll: { control: "boolean" },
    accessibilityToolbar: { control: "boolean" },
    brandDivider: { control: "boolean" },
    maxWidth: { control: { type: "number", min: 960, max: 1920, step: 40 } },
    emblemSrc: { control: false },
    brandLines: { control: false },
    nav: { control: false },
    cobranding: { control: false },
    actions: { control: false },
    account: { control: false },
    accountMenu: { control: false },
  },
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=4235-3169"
    }, layout: "fullscreen" },
} satisfies Meta<typeof SiteHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The public masthead. Open "Associated organisations" for the mega-menu. */
export const Website: Story = {
  render: (args) => (
    <SiteHeader
      {...args}
      actions={<Button size="sm">Login</Button>}
      search={{ placeholder: "Search schemes, circulars and forms" }}
    />
  ),
};

/**
 * App-shell chrome. Sticky by default, with the nav toggle and the account
 * block in place of a marketing CTA.
 */
export const Portal: Story = {
  render: function Render(args) {
    const [navOpen, setNavOpen] = React.useState(true);
    return (
      <SiteHeader
        {...args}
        variant="portal"
        tone="navy"
        nav={undefined}
        brandDivider
        brandLines={{
          org: "Government of India",
          ministry: "Ministry of Social Justice & Empowerment",
          department: "Nasha Mukt Bharat Abhiyaan",
        }}
        onToggleNav={() => setNavOpen((o) => !o)}
        navExpanded={navOpen}
        navControlsId="sb-portal-sidebar"
        account={{
          name: "Sunita Deshmukh",
          email: "sno-mh@nmba.gov.in",
          role: "State Nodal Officer, Maharashtra",
        }}
        accountMenu={[
          { label: "Profile", onSelect: () => {} },
          { label: "Change password", onSelect: () => {} },
          { label: "Sign out", onSelect: () => {}, danger: true },
        ]}
      />
    );
  },
};

/** The BETA badge, for a portal not yet in general service. */
export const Beta: Story = {
  render: (args) => <SiteHeader {...args} beta actions={<Button size="sm">Login</Button>} />,
};

/** A controlled search field in the header. */
export const WithSearch: Story = {
  render: function Render(args) {
    const [query, setQuery] = React.useState("");
    return (
      <SiteHeader
        {...args}
        search={{
          placeholder: "Search schemes, circulars and forms",
          onSearch: () => setQuery(query),
        }}
        actions={<Button size="sm">Apply online</Button>}
      />
    );
  },
};

/**
 * The accessibility bar configured properly: a skip target that exists on the
 * page, the GIGW-required statement link, and a language selector.
 */
export const AccessibilityBar: Story = {
  render: (args) => (
    <div>
      <SiteHeader
        {...args}
        skipTo="#sb-main"
        accessibilityHref="/accessibility-statement"
        language={{ label: "English", onClick: () => {} }}
      />
      {/* The skip link is only a WCAG 2.4.1 pass because this id exists. */}
      <main id="sb-main" tabIndex={-1} style={{ padding: 24, color: "var(--sa-color-text-default)" }}>
        Tab from the very top of the page: the first stop is “Skip to main content”, and
        it lands here.
      </main>
    </div>
  ),
};

/**
 * `onAccessibility` instead of `accessibilityHref` — for a property that opens
 * a dialog rather than navigating. Set one or the other, never both.
 */
export const AccessibilityAsADialog: Story = {
  render: (args) => <SiteHeader {...args} onAccessibility={() => {}} />,
};

/**
 * Without the accessibility bar. Only legitimate when the page renders the
 * UX4G widget itself — the bar carries the GIGW-required statement link.
 */
export const WithoutAccessibilityBar: Story = {
  render: (args) => <SiteHeader {...args} accessibilityToolbar={false} />,
};

/** Nav only, no cobranding or CTA — the minimum a header can be. */
export const Minimal: Story = {
  render: (args) => (
    <SiteHeader
      {...args}
      cobranding={undefined}
      nav={[
        { label: "Home", href: "/", active: true },
        { label: "About us", href: "/about" },
        { label: "Contact us", href: "/contact" },
      ]}
    />
  ),
};
