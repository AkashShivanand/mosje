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
      { label: "Shape", href: "/design-system/foundations/shape", badge: "Stable" },
      { label: "Elevation", href: "/design-system/foundations/elevation", badge: "Stable" },
      { label: "Layout Grid", href: "/design-system/foundations/layout-grid", badge: "New" },
      { label: "Motion", href: "/design-system/foundations/motion", badge: "Beta" },
      { label: "Density", href: "/design-system/foundations/density", badge: "Stable" },
      { label: "Iconography", href: "/design-system/foundations/iconography", badge: "Beta" },
      { label: "Accessibility", href: "/design-system/foundations/accessibility", badge: "Stable" },
    ],
  },
  {
    title: "Actions",
    items: [
      { label: "Button", href: "/design-system/components/actions/button", badge: "Stable" },
    ],
  },
  {
    title: "Forms & Inputs",
    items: [
      { label: "Input", href: "/design-system/components/forms/input", badge: "Stable" },
      { label: "Form Field", href: "/design-system/components/forms/input#form-field", badge: "Stable" },
      { label: "Aadhaar Input", href: "/design-system/components/forms/identity-inputs#aadhaar", badge: "New" },
      { label: "OTP Input", href: "/design-system/components/forms/identity-inputs#otp", badge: "New" },
      { label: "PAN Input", href: "/design-system/components/forms/identity-inputs#pan", badge: "New" },
      { label: "Select", href: "/design-system/components/forms/input#select", badge: "Stable" },
      { label: "Textarea", href: "/design-system/components/forms/input#textarea", badge: "Stable" },
      { label: "Checkbox & Radio", href: "/design-system/components/forms/input#checkbox", badge: "Stable" },
      { label: "Toggle", href: "/design-system/components/forms/input#toggle", badge: "Beta" },
      { label: "Search", href: "/design-system/components/forms/input#search", badge: "Stable" },
      { label: "Chip", href: "/design-system/components/forms/input#chip", badge: "Beta" },
      { label: "Form Section", href: "/design-system/components/forms/input#form-section", badge: "Stable" },
      { label: "Form Card", href: "/design-system/components/forms/input#form-card", badge: "New" },
      { label: "Wizard", href: "/design-system/components/forms/input#wizard", badge: "Beta" },
    ],
  },
  {
    title: "Navigation",
    items: [
      { label: "Tabs", href: "/design-system/components/navigation/tabs", badge: "Beta" },
    ],
  },
  {
    title: "Feedback & Status",
    items: [
      { label: "Badge", href: "/design-system/components/feedback/badge", badge: "Stable" },
      { label: "Alert", href: "/design-system/components/feedback/badge#alert", badge: "Stable" },
      { label: "SLA Progress", href: "/design-system/components/feedback/sla-progress", badge: "New" },
      { label: "Loader", href: "/design-system/components/feedback/badge#loader", badge: "Stable" },
      { label: "Stepper", href: "/design-system/components/feedback/badge#stepper", badge: "Stable" },
      { label: "Empty State", href: "/design-system/components/feedback/badge#empty-state", badge: "Stable" },
    ],
  },
  {
    title: "Overlays",
    items: [
      { label: "Modal", href: "/design-system/components/feedback/badge#modal", badge: "Stable" },
      { label: "Toast", href: "/design-system/components/feedback/badge#toast", badge: "Stable" },
    ],
  },
  {
    title: "Data Display",
    items: [
      { label: "Card", href: "/design-system/components/data-display/card", badge: "Stable" },
      { label: "Data Table", href: "/design-system/components/data-display/card#data-table", badge: "Beta" },
      { label: "Metric Card", href: "/design-system/components/data-display/card#metric-card", badge: "Stable" },
      { label: "Avatar", href: "/design-system/components/feedback/badge#avatar", badge: "Stable" },
      { label: "Charts", href: "/design-system/components/data-display/card#charts", badge: "Beta" },
    ],
  },
  {
    title: "Layout",
    items: [
      { label: "Divider", href: "/design-system/components/layout/divider", badge: "New" },
    ],
  },
  {
    title: "Utilities",
    items: [
      { label: "Accessibility Bar", href: "/design-system/components/utilities/accessibility-bar", badge: "Stable" },
    ],
  },
  {
    title: "Section Templates",
    items: [
      { label: "Navbar (Header)", href: "/design-system/components/section-templates/site-header", badge: "Stable" },
      { label: "Sidebar Nav", href: "/design-system/components/section-templates/sidebar", badge: "Stable" },
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
