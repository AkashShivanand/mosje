import type { Meta, StoryObj } from "@storybook/react";
import { SamaveshBanner, DEFAULT_SAMAVESH_PORTALS } from "@mosje/design-system";

/**
 * **SamaveshBanner** — the canonical top banner and portal exploration drawer for SAMAVESH.
 *
 * Implements Figma node `7116:33784` & `7298:29968`.
 *
 * Features:
 * - **Identity Header Bar**: India Saffron (#ff671f) background with official circular SAMAVESH emblem badge, headline, and subline.
 * - **Interactive Accordion Drawer**: Clicking "Explore" expands a curated portal discovery panel with accessible ARIA states and keyboard control (Escape to close).
 * - **Responsive Portal Cards**: Clean responsive grid showing prominent citizen portals (SCW, SMILE - Transgender, NOS, NMBA) with direct links.
 * - **Token-driven**: Full WCAG 2.2 AA contrast compliance using semantic design tokens.
 */
const meta = {
  title: "Navigation/SamaveshBanner",
  component: SamaveshBanner,
  parameters: { layout: "fullscreen" },
  args: {
    title: "SAMAVESH",
    subline: "Single Access Mechanism for All Verticals of Empowerment & Social Harmony",
    exploreLabel: "Explore",
    drawerTitle: "Choose a portal to visit",
    viewAllHref: "/website/samavesh-citizen-portals",
    viewAllLabel: "View all citizen portals",
    logoSrc: "/design-system/samavesh-logo.svg",
    portals: DEFAULT_SAMAVESH_PORTALS,
  },
} satisfies Meta<typeof SamaveshBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default collapsed state with Explore CTA. */
export const Default: Story = {
  args: {
    defaultOpen: false,
  },
};

/** Pre-expanded state showing the portal discovery drawer. */
export const Expanded: Story = {
  args: {
    defaultOpen: true,
  },
};

/** Interactive mode with custom portal items. */
export const CustomPortals: Story = {
  args: {
    defaultOpen: true,
    drawerTitle: "Featured Citizen Services",
    portals: [
      {
        id: "scw",
        shortName: "SCW",
        name: "Senior Citizens Welfare",
        href: "/portals/scw",
        logoSrc: "/design-system/org-logos/scw.png",
      },
      {
        id: "pm-ajay",
        shortName: "PM-AJAY",
        name: "Pradhan Mantri Anusuchit Jaati Abhyuday Yojana",
        href: "/portals/pm-ajay",
        logoSrc: "/design-system/org-logos/pm-ajay.png",
      },
      {
        id: "smile",
        shortName: "SMILE",
        name: "Comprehensive Rehabilitation of Beggary",
        href: "/portals/smile-admin",
        logoSrc: "/design-system/org-logos/smile.png",
      },
      {
        id: "nos",
        shortName: "NOS",
        name: "National Overseas Scholarship Scheme",
        href: "/portals/nos",
        logoSrc: "/design-system/org-logos/nos.png",
      },
    ],
  },
};
