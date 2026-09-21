/**
 * Five places most readers who reach a dead end are looking for (issue NAV-09).
 *
 * Every destination is an entry of the masthead's own navigation
 * (`chrome/nav.ts`), labelled as the navigation labels it, so a reader who
 * follows one lands where the menu would have taken them. The sitemap is the
 * other route GIGW accepts for Multiple Ways, so it is always one of the five
 * [GIGW 5.2 / WCAG 2.4.5].
 */
export const POPULAR_LINKS: { label: string; href: string; icon: string }[] = [
  { label: "Find a Scheme", href: "/website/schemes-services", icon: "volunteer_activism" },
  { label: "Apply and Track on Citizen Portals", href: "/portals", icon: "assignment" },
  { label: "Annual Reports", href: "/website/annual-reports", icon: "menu_book" },
  { label: "Contact Us", href: "/website/contact-us", icon: "call" },
  { label: "Sitemap", href: "/website/sitemap", icon: "account_tree" },
];
