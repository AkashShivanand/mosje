/**
 * The hub's primary navigation, as plain data.
 *
 * Lives apart from SiteHeader so the server-rendered desktop nav and the
 * client-side mobile disclosure share one list — two copies would drift the
 * first time someone adds a destination.
 */

export interface SiteNavItem {
  label: string;
  href: string;
  /**
   * Open in a new tab. Set for destinations outside the hub shell that offer
   * no way back — Storybook renders its own full-screen UI with no estate
   * chrome, so same-tab navigation strands the user on the back button.
   */
  newTab?: boolean;
}

export const SITE_NAV: readonly SiteNavItem[] = [
  { label: "Website", href: "/website" },
  { label: "Portals", href: "/portals" },
  { label: "Design System", href: "/design-system" },
  { label: "Reports", href: "/reports" },
  { label: "Storybook", href: "/storybook/", newTab: true },
] as const;
