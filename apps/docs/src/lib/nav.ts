export interface NavItem {
  label: string;
  href: string;
  /** Badge shown next to label: Stable | Beta | Alpha | New */
  badge?: "Stable" | "Beta" | "Alpha" | "New";
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

/** Full navigation tree for the SAMAVESH docs sidebar. */
export const NAV: NavGroup[] = [
  {
    title: "Getting Started",
    items: [
      { label: "What is SAMAVESH?", href: "/design-system" },
      { label: "For Designers", href: "/design-system#for-designers" },
      { label: "For Developers", href: "/design-system#for-developers" },
    ],
  },
  {
    title: "Foundations",
    items: [
      { label: "Color", href: "/design-system/foundations/color", badge: "Stable" },
      { label: "Typography", href: "/design-system/foundations/typography", badge: "Stable" },
      { label: "Spacing", href: "/design-system/foundations/spacing", badge: "Stable" },
      { label: "Elevation", href: "/design-system/foundations/elevation", badge: "Stable" },
      { label: "Motion", href: "/design-system/foundations/motion", badge: "Beta" },
      { label: "Density", href: "/design-system/foundations/density", badge: "Stable" },
      { label: "Iconography", href: "/design-system/foundations/iconography", badge: "Beta" },
      { label: "Accessibility", href: "/design-system/foundations/accessibility", badge: "Stable" },
    ],
  },
  {
    title: "Components",
    items: [
      { label: "Button", href: "/design-system/components/button", badge: "Stable" },
      { label: "Input", href: "/design-system/components/input", badge: "Stable" },
      { label: "Card", href: "/design-system/components/card", badge: "Stable" },
      { label: "Badge", href: "/design-system/components/badge", badge: "Stable" },
      { label: "Form Field", href: "/design-system/components/input#form-field", badge: "Stable" },
      { label: "Select", href: "/design-system/components/input#select", badge: "Beta" },
      { label: "Textarea", href: "/design-system/components/input#textarea", badge: "Stable" },
      { label: "Checkbox", href: "/design-system/components/input#checkbox", badge: "Alpha" },
      { label: "Alert", href: "/design-system/components/badge#alert", badge: "Beta" },
    ],
  },
  {
    title: "Navigation",
    items: [
      { label: "Navbar (Header)", href: "/design-system/components/header", badge: "Beta" },
      { label: "Navbar · Website", href: "/design-system/components/header#site-header", badge: "Beta" },
      { label: "Navbar · Portal", href: "/design-system/components/header#portal", badge: "Beta" },
      { label: "Navbar · Mega-menu", href: "/design-system/components/header#menus", badge: "Beta" },
      { label: "Sidebar Nav", href: "/design-system/components/sidebar", badge: "Beta" },
      { label: "App Switcher", href: "/design-system/components/badge#appswitcher", badge: "Beta" },
    ],
  },
  {
    title: "Patterns",
    items: [
      { label: "Task List", href: "/design-system/resources#patterns", badge: "Alpha" },
      { label: "Form Layout", href: "/design-system/resources#patterns", badge: "Alpha" },
      { label: "Data Tables", href: "/design-system/resources#patterns", badge: "Alpha" },
    ],
  },
  {
    title: "Resources",
    items: [
      { label: "Overview", href: "/design-system/resources" },
      { label: "AI design context", href: "/design-system/resources/design-context", badge: "New" },
      { label: "Design tokens", href: "/design-system/resources/tokens", badge: "New" },
      { label: "Changelog", href: "/design-system/resources/changelog" },
      { label: "Governance", href: "/design-system/resources/governance" },
      { label: "Contributing", href: "/design-system/resources/contributing" },
      { label: "Roadmap", href: "/design-system/resources/roadmap" },
    ],
  },
];
