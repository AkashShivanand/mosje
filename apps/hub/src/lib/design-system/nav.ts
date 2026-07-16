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
      { label: "Card", href: "/design-system/components/card", badge: "Stable" },
      { label: "Badge", href: "/design-system/components/badge", badge: "Stable" },
      { label: "Alert", href: "/design-system/components/badge#alert", badge: "Stable" },
    ],
  },
  {
    title: "Forms",
    items: [
      { label: "Input", href: "/design-system/components/input", badge: "Stable" },
      { label: "Form Field", href: "/design-system/components/input#form-field", badge: "Stable" },
      { label: "Select", href: "/design-system/components/input#select", badge: "Stable" },
      { label: "Textarea", href: "/design-system/components/input#textarea", badge: "Stable" },
      { label: "Checkbox & Radio", href: "/design-system/components/input#checkbox", badge: "Stable" },
      { label: "Toggle", href: "/design-system/components/input#toggle", badge: "Beta" },
      { label: "Search", href: "/design-system/components/input#search", badge: "Stable" },
      { label: "Chip", href: "/design-system/components/input#chip", badge: "Beta" },
      { label: "Form Section", href: "/design-system/components/input#form-section", badge: "Stable" },
      { label: "Form Card", href: "/design-system/components/input#form-card", badge: "New" },
      { label: "Wizard", href: "/design-system/components/input#wizard", badge: "Beta" },
    ],
  },
  {
    title: "Feedback",
    items: [
      { label: "Modal", href: "/design-system/components/badge#modal", badge: "Stable" },
      { label: "Toast", href: "/design-system/components/badge#toast", badge: "Stable" },
      { label: "Loader", href: "/design-system/components/badge#loader", badge: "Stable" },
      { label: "Stepper", href: "/design-system/components/badge#stepper", badge: "Stable" },
      { label: "Empty State", href: "/design-system/components/badge#empty-state", badge: "Stable" },
    ],
  },
  {
    title: "Data Display",
    items: [
      { label: "Data Table", href: "/design-system/components/card#data-table", badge: "Beta" },
      { label: "Metric Card", href: "/design-system/components/card#metric-card", badge: "Stable" },
      { label: "Avatar", href: "/design-system/components/badge#avatar", badge: "Stable" },
      { label: "Charts", href: "/design-system/components/card#charts", badge: "Beta" },
    ],
  },
  {
    title: "Navigation",
    items: [
      { label: "Navbar (Header)", href: "/design-system/components/header", badge: "Stable" },
      { label: "Navbar · Website", href: "/design-system/components/header#site-header", badge: "Stable" },
      { label: "Navbar · Portal", href: "/design-system/components/header#portal", badge: "Stable" },
      { label: "Navbar · Mega-menu", href: "/design-system/components/header#menus", badge: "Stable" },
      { label: "Sidebar Nav", href: "/design-system/components/sidebar", badge: "Stable" },
      { label: "Tabs", href: "/design-system/components/tabs", badge: "Beta" },
      { label: "App Switcher", href: "/design-system/components/badge#appswitcher", badge: "Beta" },
      { label: "Footer", href: "/design-system/components/header#footer", badge: "Stable" },
    ],
  },
  {
    title: "Patterns",
    items: [
      { label: "Dashboard Scaffold", href: "/design-system/resources/patterns#dashboard", badge: "New" },
      { label: "Portal Login", href: "/design-system/resources/patterns#login", badge: "New" },
      { label: "Form Wizard", href: "/design-system/resources/patterns#wizard", badge: "New" },
      { label: "Data Tables", href: "/design-system/resources/patterns#data-table", badge: "Alpha" },
      { label: "Empty States", href: "/design-system/resources/patterns#empty-state", badge: "Alpha" },
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
