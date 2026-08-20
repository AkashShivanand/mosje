import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SiteFooter, VisitorCounter } from "@mosje/design-system";

/**
 * **SiteFooter** — the statutory footer of a PUBLIC INFORMATION SITE. Two bands:
 * the working footer (identity, contact, navigation) and the statutory bar
 * (lineage, policies, credits, copyright, last-updated).
 *
 * **Not the same thing as `Footer`.** `Footer` is the slim single-band app-shell
 * strip that sits under an authenticated portal workflow. Reach for that one
 * inside `/portals/*`; reach for this one on `/website/*`. They answer to
 * different clauses and merging them would break both.
 *
 * **It is structural, not content-bound.** Every label, href, logo and sentence
 * arrives as a prop, so a second site in the estate gets the same footer by
 * passing its own content. Do not fork it to change wording.
 *
 * **Colour is not yours to set.** The component binds to the mode-aware
 * `--sa-color-primaryScale-*` family, so it repaints itself for `blue`, `navy`,
 * `dbim` and the five DBIM hues with no work at the call site. Use the toolbar's
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
    cta: { label: "Get in Touch", href: "/website/contact-us" },
    columns: [
      {
        heading: "Department",
        id: "sb-dept",
        links: [
          { label: "About Ministry", href: "/website/about-us" },
          { label: "Organisational Chart", href: "/website/whos-who" },
          { label: "Ministers & Officials", href: "/website/mosje-directory" },
        ],
      },
      {
        heading: "Services",
        id: "sb-svc",
        links: [
          { label: "Schemes & Benefits", href: "/website/schemes-services" },
          { label: "Tenders", href: "/website/tenders" },
          { label: "Vacancies", href: "/website/vacancies" },
        ],
      },
      {
        heading: "Support",
        id: "sb-sup",
        links: [
          { label: "Help & Support", href: "/website/contact-us" },
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
          { label: "Annual Reports", href: "/website/annual-reports" },
        ],
      },
    ],
    lineage:
      "This website belongs to the Department of Social Justice & Empowerment, " +
      "Ministry of Social Justice & Empowerment, Government of India. Developed and " +
      "maintained by Digital India Corporation, MeitY.",
    policyLinks: [
      { label: "Terms & Conditions", href: "/website/terms-conditions" },
      { label: "Privacy Policy", href: "/website/privacy-policy" },
      { label: "Copyright", href: "/website/copyright" },
      { label: "Hyperlinking", href: "/website/hyperlinking-policy" },
      { label: "Accessibility", href: "/website/accessibility" },
      { label: "Feedback", href: "/website/contact-us#feedback" },
    ],
    relatedLinks: [
      { label: "National Portal of India", href: "https://www.india.gov.in/", external: true },
      { label: "MyGov", href: "https://www.mygov.in/", external: true },
      { label: "CPGRAMS", href: "https://pgportal.gov.in/", external: true },
    ],
    copyright: "© 2026 Department of Social Justice & Empowerment. All Rights Reserved.",
    lastUpdated: "06 Jun 2026",
    maxWidth: 1280,
  },
  argTypes: {
    emblem: { control: false },
    colophonSlot: { control: false },
    social: { control: false },
    credits: { control: false },
    columns: { control: false },
    policyLinks: { control: false },
    relatedLinks: { control: false },
    linkAs: { control: false },
    cta: { control: false },
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
      {
        label: "Facebook",
        href: "https://www.facebook.com/goimsje",
        path: "M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.026 4.388 11.02 10.125 11.927v-8.437H7.078v-3.49h3.047V9.43c0-3.022 1.792-4.69 4.533-4.69 1.312 0 2.686.235 2.686.235v2.969h-1.514c-1.491 0-1.956.93-1.956 1.886v2.243h3.328l-.532 3.49h-2.796V24C19.612 23.093 24 18.099 24 12.073z",
      },
      {
        label: "X (formerly Twitter)",
        href: "https://x.com/msjegoi",
        path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231z",
      },
      {
        label: "YouTube",
        href: "https://www.youtube.com/@ministryofsocialjustice511",
        path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
      },
    ],
    colophonSlot: <VisitorCounter />,
    credits: [
      {
        src: "https://placehold.co/78x30/ffffff/003975?text=NeGD",
        alt: "National e-Governance Division (NeGD)",
        href: "https://negd.gov.in/",
        width: 78,
        height: 30,
      },
      {
        prefix: "Powered by",
        src: "https://placehold.co/78x30/ffffff/003975?text=Digital+India",
        alt: "Digital India",
        href: "https://www.digitalindia.gov.in/",
        width: 78,
        height: 30,
      },
    ],
  },
};

/**
 * The minimum that is still compliant: no social rail, no credits, no related
 * links. `lineage`, `policyLinks`, `copyright` and `columns` are required, and
 * that is deliberate — a footer without them is not a government footer.
 */
export const Minimal: Story = {
  args: {
    social: undefined,
    credits: undefined,
    relatedLinks: undefined,
    colophonSlot: undefined,
    cta: undefined,
    address: undefined,
  },
};
