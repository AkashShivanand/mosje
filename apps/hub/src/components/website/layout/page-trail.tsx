import Link from "next/link";
import { Breadcrumb as DSBreadcrumb, type BreadcrumbItem } from "@mosje/design-system";

/**
 * A crumb on a website page trail.
 *
 * Kept as a named type of its own because 60-odd pages and two templates
 * (`DocumentCatalog`, `SchemesCatalog`) type their `breadcrumb` prop with it.
 * It is the design system's item type minus `onSelect` — a page trail navigates,
 * it does not change client state.
 */
export type Crumb = Pick<BreadcrumbItem, "label" | "href">;

/**
 * The website's page trail — the design system's `Breadcrumb` with the two
 * things that are this site's, not the system's: the Home crumb every page
 * starts from, and `next/link` so the trail keeps soft navigation.
 *
 * Callers pass the trail BELOW Home. They did before this became a wrapper, and
 * changing that would have meant touching every page for no gain.
 *
 * The three cases the system's component handles, and which this site uses all
 * of: a crumb with an `href` is a link; the last crumb is the page you are on
 * and is never interactive; and a crumb with NEITHER is a section that has no
 * landing page — "Department", "Documents", "Connect", "Associated
 * Organisations" are mega-menu categories with no route behind them, and 64
 * pages pass one as a middle crumb.
 */
export function PageTrail({ items }: { items: Crumb[] }) {
  return (
    <DSBreadcrumb
      linkAs={Link}
      items={[{ label: "Home", href: "/website", icon: "home" }, ...items]}
    />
  );
}
