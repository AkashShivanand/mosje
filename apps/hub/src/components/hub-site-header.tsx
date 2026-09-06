import { SiteHeader as DsSiteHeader, type NavItem } from "@mosje/design-system";
import { SITE_NAV } from "./site-nav-items";

/**
 * Shared gate chrome — now the shared DS Navbar, not a bespoke one.
 *
 * This bar sits on the hub's own index surfaces (`/`, `/portals`, `/reports`),
 * which are internal wayfinding, NOT public government pages: there is no
 * ministry masthead to qualify and no accessibility bar to carry, so it renders
 * the DS header's `compact` variant — one 64px tier, compact lockup, nav inline.
 *
 * It used to be ~85 lines of hand-rolled markup with its own nav, its own
 * focus treatment and a separate MobileNav disclosure. All three now come from
 * the design system, so the estate's three placements — public site, portal
 * app-shell, hub index — are one component in three configurations.
 *
 * `current` highlights the active nav item; pass the matching href (or "/" for
 * the landing gate).
 */
export function HubSiteHeader({ current }: { current?: string }) {
  const nav: NavItem[] = SITE_NAV.map((item) => ({
    label: item.label,
    href: item.href,
    external: item.newTab,
    active: current === item.href,
  }));

  return (
    <DsSiteHeader
      variant="compact"
      homeHref="/"
      emblemSrc="/images/National-Emblem-logo.svg"
      emblemAlt="National Emblem of India"
      brandLines={{ ministry: "Ministry of Social Justice & Empowerment", department: "Digital Estate" }}
      nav={nav}
    />
  );
}
