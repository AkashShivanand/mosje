import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SiteFooter, VisitorCounter } from "@mosje/design-system";
// The two marks the website ships, bundled by URL — see ./assets.d.ts for why
// this is an import and not a staticDirs entry.
import negdMark from "../../hub/public/website/images/NeGD-Logo-White.svg?url";
import digitalIndiaMark from "../../hub/public/website/images/Digital-India-Reverse.svg?url";

/**
 * **SiteFooter** — the statutory footer for the estate, in two variants.
 *
 * `variant="website"` (default) renders two bands: the working footer
 * (identity, address, social, four link columns) and the statutory bar. `variant="portal"` renders the statutory bar alone — a portal
 * has its own navigation, and a citizen mid-application does not need a sitemap.
 *
 * **Why a variant and not a second component.** The statutory bar is the half
 * that must stay DBIM-compliant, and it is now impossible for a portal footer
 * to drift from the website's on that half. The DS also still ships `Footer`, a
 * slim strip written for portals that no portal ever adopted — prefer
 * `variant="portal"` for new work.
 *
 * **There is no support strip.** A "need help?" call to action is page content,
 * not statutory chrome: place an `ActionBanner` on a light band ABOVE the footer.
 *
 * **It is structural, not content-bound.** Every label, href, logo and sentence
 * arrives as a prop, so a second site in the estate gets the same footer by
 * passing its own content. Do not fork it to change wording.
 *
 * **Colour is not yours to set.** Every colour binds a mode-aware semantic or
 * `cmp/sitefooter/*` token, so it repaints itself for all eight brand modes —
 * Blue, Navy and the six DBIM palettes — with no work at the call site. Use the toolbar's
 * brand switcher to see it. Never pass a background through `className` — that is
 * exactly the defect this component was built to remove.
 *
 * `lineage` and `lastUpdated` are DBIM 5.6 elements, not decoration.
 * `lastUpdated` must be the CURRENT PAGE's date, not the site's — pass it down
 * from the page layout.
 *
 * `linkAs` takes your router's link component (`next/link`) for internal hrefs.
 * External links always render as a plain anchor with `rel="noreferrer"` and an
 * "(opens in a new window)" note, so `external: true` is the only thing you set.
 *
 * `colophonSlot` is a free slot in the colophon, beside the copyright and
 * last-updated. The estate puts `VisitorCounter` there — a visit count is page
 * metadata, not identity, and grouping it with the other two provenance lines
 * stops it competing with the emblem. Lifecycle: **Stable**.
 */
const HELP = { label: "Help", href: "/website/help" };

/** The portal strip's policies. Sitemap and Help come from their own props there. */
const PORTAL_POLICY = [
  { label: "Terms & Conditions", href: "/website/terms-conditions" },
  { label: "Privacy Policy", href: "/website/privacy-policy" },
  { label: "Feedback", href: "/website/contact-us#feedback" },
];

const meta = {
  title: "Navigation/SiteFooter",
  component: SiteFooter,
  parameters: { layout: "fullscreen" },
  args: {
    organisation: [
      "Government of India",
      "Ministry of Social Justice & Empowerment",
      "Department of Social Justice & Empowerment",
    ],
    address: "8th Floor, GPOA-3, Netaji Nagar, New Delhi - 110023",
    columns: [
      {
        heading: "Department",
        id: "sb-dept",
        links: [
          { label: "About Ministry", href: "/website/about-us" },
          { label: "Vision & Mission", href: "/website/about-us" },
          { label: "Organisational Chart", href: "/website/whos-who" },
          { label: "Ministers & Officials", href: "/website/mosje-directory" },
          { label: "Citizen Charter", href: "/website/citizen-charter" },
        ],
      },
      {
        heading: "Services",
        id: "sb-svc",
        links: [
          { label: "Schemes", href: "/website/schemes-services" },
          { label: "Tenders", href: "/website/tenders" },
          { label: "Vacancies", href: "/website/vacancies" },
        ],
      },
      {
        heading: "Support",
        id: "sb-sup",
        links: [
          { label: "Contact Us", href: "/website/contact-us" },
          { label: "RTI", href: "/website/rti" },
          { label: "Sitemap", href: "/website/sitemap" },
        ],
      },
      {
        heading: "Resources",
        id: "sb-res",
        links: [
          { label: "Notices", href: "/website/notices" },
          { label: "Acts & Rules", href: "/website/acts-rules" },
          { label: "Reports", href: "/website/annual-reports" },
          { label: "Publications", href: "/website/publications" },
          { label: "Statistics", href: "/website/dashboard" },
        ],
      },
    ],
    lineage:
      "This website belongs to the Department of Social Justice & Empowerment, " +
      "Ministry of Social Justice & Empowerment, Government of India.",
    sitemap: { label: "Sitemap", href: "/website/sitemap" },
    help: HELP,
    // The website's policy row, in the dosje.gov.in footer's order. Help sits in
    // it because the website variant does not draw the `help` prop; the portal
    // story below passes its own shorter list, because the portal strip does.
    policyLinks: [
      { label: "Copyright Policy", href: "/website/copyright" },
      { label: "Hyperlinking Policy", href: "/website/hyperlinking-policy" },
      HELP,
      { label: "Terms & Conditions", href: "/website/terms-conditions" },
      { label: "Privacy Policy", href: "/website/privacy-policy" },
      { label: "Cookies", href: "/website/cookies" },
      { label: "Visitor Analytics", href: "/website/visitor-analytics" },
      { label: "Feedback", href: "/website/contact-us#feedback" },
    ],
    relatedLinks: [
      { label: "National Portal of India", href: "https://www.india.gov.in/", external: true },
      { label: "CPGRAMS", href: "https://pgportal.gov.in/", external: true },
      { label: "MyGov", href: "https://www.mygov.in/", external: true },
      { label: "Open Government Data", href: "https://data.gov.in/", external: true },
    ],
    copyright: "© 2026 Department of Social Justice & Empowerment. All Rights Reserved.",
    lastUpdated: "06 Jun 2026",
  },
  argTypes: {
    variant: { control: "inline-radio", options: ["website", "portal"] },
    emblem: { control: false },
    colophonSlot: { control: false },
    social: { control: false },
    credits: { control: false },
    columns: { control: false },
    policyLinks: { control: false },
    relatedLinks: { control: false },
    linkAs: { control: false },
    lineage: { control: "text" },
    copyright: { control: "text" },
    lastUpdated: { control: "text" },
    address: { control: "text" },
    maxWidth: { control: { type: "number" } },
  },
} satisfies Meta<typeof SiteFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/**
 * The shape the website actually ships: social rail, visitor counter in the
 * colophon, and both credit logos hyperlinked — DBIM 5.6 calls those "hyperlinked logos"
 * and a flat `<img>` does not satisfy it.
 */
export const Full: Story = {
  args: {
    social: [
      { label: "Facebook", href: "https://www.facebook.com/goimsje", icon: "facebook" },
      { label: "X (formerly Twitter)", href: "https://x.com/msjegoi", icon: "x" },
      { label: "Instagram", href: "https://www.instagram.com/msjegoi", icon: "instagram" },
      {
        label: "YouTube",
        href: "https://www.youtube.com/@ministryofsocialjustice511",
        icon: "youtube",
      },
      {
        label: "WhatsApp Channel",
        href: "https://whatsapp.com/channel/0029Vb7GfwH6mYPMHOvTd51W",
        icon: "whatsapp",
      },
    ],
    colophonSlot: <VisitorCounter />,
    credits: [
      {
        prefix: "Developed & maintained by",
        src: negdMark,
        alt: "National e-Governance Division (NeGD)",
        href: "https://negd.gov.in/",
        width: 143,
        height: 52,
      },
      {
        prefix: "Powered by",
        src: digitalIndiaMark,
        alt: "Digital India",
        href: "https://www.digitalindia.gov.in/",
        width: 105,
        height: 41,
      },
    ],
  },
};

/**
 * The minimum the type allows: no social rail, no credits, no related links.
 * `organisation`, `lineage`, `policyLinks`, `sitemap`, `help` and `copyright` are
 * the required props. DBIM 5.6 still asks for Related Links and hyperlinked logos,
 * so a live footer should not ship this bare.
 */
export const Minimal: Story = {
  args: {
    social: undefined,
    credits: undefined,
    relatedLinks: undefined,
    colophonSlot: undefined,
    address: undefined,
  },
};

/**
 * `variant="portal"` — one thin strip: the lineage beside the policy, Sitemap and Help links. Columns, social rail, credit logos,
 * Related Links, the copyright line and Last Updated are the website's and are not drawn, so
 * one content object can still drive both variants.
 */
export const PortalVariant: Story = {
  args: {
    variant: "portal",
    policyLinks: PORTAL_POLICY,
  },
};
