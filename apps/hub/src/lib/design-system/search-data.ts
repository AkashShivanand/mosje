export interface SearchEntry {
  title: string;
  section: string;
  href: string;
  keywords: string;
  type: "foundation" | "component" | "resource" | "page";
}

export const SEARCH_DATA: SearchEntry[] = [
  { title: "What is SAMAVESH?", section: "Getting Started", href: "/design-system", keywords: "overview introduction welcome", type: "page" },
  { title: "Color", section: "Foundations", href: "/design-system/foundations/color", keywords: "color colour palette primary brand token swatch primary saffron", type: "foundation" },
  { title: "Typography", section: "Foundations", href: "/design-system/foundations/typography", keywords: "font noto sans devanagari hindi type specimen size weight", type: "foundation" },
  { title: "Spacing", section: "Foundations", href: "/design-system/foundations/spacing", keywords: "space gap margin padding scale 4px 8px 16px", type: "foundation" },
  { title: "Elevation", section: "Foundations", href: "/design-system/foundations/elevation", keywords: "shadow drop elevation layer depth", type: "foundation" },
  { title: "Motion", section: "Foundations", href: "/design-system/foundations/motion", keywords: "animation transition duration easing", type: "foundation" },
  { title: "Density", section: "Foundations", href: "/design-system/foundations/density", keywords: "compact comfortable dense height control", type: "foundation" },
  { title: "Iconography", section: "Foundations", href: "/design-system/foundations/iconography", keywords: "icon material symbols svg emblems", type: "foundation" },
  { title: "Accessibility", section: "Foundations", href: "/design-system/foundations/accessibility", keywords: "wcag gigw a11y aria keyboard contrast screen reader", type: "foundation" },
  { title: "Button", section: "Components", href: "/design-system/components/actions/button", keywords: "button cta action primary secondary ghost icon loading", type: "component" },
  { title: "Input", section: "Components", href: "/design-system/components/forms/input", keywords: "input text field form control validation error", type: "component" },
  { title: "Card", section: "Components", href: "/design-system/components/data-display/card", keywords: "card container surface elevation clickable", type: "component" },
  { title: "Badge", section: "Components", href: "/design-system/components/feedback/badge", keywords: "badge tag status pill label count", type: "component" },
  { title: "Form Field", section: "Components", href: "/design-system/components/forms/form-field", keywords: "form field label hint error required validation", type: "component" },
  { title: "SLA Progress Indicator", section: "Components", href: "/design-system/components/feedback/sla-progress", keywords: "sla service level agreement right to service act deadline breach overdue days left timer progress guarantee", type: "component" },
  { title: "Aadhaar Input", section: "Components", href: "/design-system/components/forms/aadhaar-input", keywords: "aadhaar uidai identity 12 digit verhoeff checksum mask dpdp masked number", type: "component" },
  { title: "OTP Input", section: "Components", href: "/design-system/components/forms/otp-input", keywords: "otp one time password six box code sms autofill paste verification", type: "component" },
  { title: "PAN Input", section: "Components", href: "/design-system/components/forms/pan-input", keywords: "pan card income tax identity permanent account number holder type", type: "component" },
  { title: "Changelog", section: "Resources", href: "/design-system/resources/changelog", keywords: "version history release notes update", type: "resource" },
  { title: "Governance", section: "Resources", href: "/design-system/resources/governance", keywords: "lifecycle proposed alpha beta stable deprecated contribution rfc", type: "resource" },
  { title: "Contributing", section: "Resources", href: "/design-system/resources/contributing", keywords: "contribute pr pull request token component proposal", type: "resource" },
  { title: "Roadmap", section: "Resources", href: "/design-system/resources/roadmap", keywords: "planned upcoming future milestones", type: "resource" },
];
