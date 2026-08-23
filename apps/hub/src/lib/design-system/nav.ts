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
    "title": "Getting Started",
    "items": [
      {
        "label": "What is SAMAVESH?",
        "href": "/design-system"
      },
      {
        "label": "For Designers",
        "href": "/design-system#for-designers"
      },
      {
        "label": "For Developers",
        "href": "/design-system#for-developers"
      }
    ]
  },
  {
    "title": "Foundations",
    "items": [
      {
        "label": "Color",
        "href": "/design-system/foundations/color",
        "badge": "Stable"
      },
      {
        "label": "Typography",
        "href": "/design-system/foundations/typography",
        "badge": "Stable"
      },
      {
        "label": "Spacing",
        "href": "/design-system/foundations/spacing",
        "badge": "Stable"
      },
      {
        "label": "Shape",
        "href": "/design-system/foundations/shape",
        "badge": "Stable"
      },
      {
        "label": "Elevation",
        "href": "/design-system/foundations/elevation",
        "badge": "Stable"
      },
      {
        "label": "Layout Grid",
        "href": "/design-system/foundations/layout-grid",
        "badge": "New"
      },
      {
        "label": "Motion",
        "href": "/design-system/foundations/motion",
        "badge": "Beta"
      },
      {
        "label": "Density",
        "href": "/design-system/foundations/density",
        "badge": "Stable"
      },
      {
        "label": "Iconography",
        "href": "/design-system/foundations/iconography",
        "badge": "Beta"
      },
      {
        "label": "Accessibility",
        "href": "/design-system/foundations/accessibility",
        "badge": "Stable"
      }
    ]
  },
  {
    "title": "Actions",
    "items": [
      {
        "label": "Button",
        "href": "/design-system/components/actions/button"
      }
    ]
  },
  {
    "title": "Forms & Inputs",
    "items": [
      {
        "label": "Aadhaar Input",
        "href": "/design-system/components/forms/aadhaar-input"
      },
      {
        "label": "Captcha Field",
        "href": "/design-system/components/forms/captcha-field"
      },
      {
        "label": "Checkbox",
        "href": "/design-system/components/forms/checkbox"
      },
      {
        "label": "Chip",
        "href": "/design-system/components/forms/chip"
      },
      {
        "label": "Declaration Checkbox",
        "href": "/design-system/components/forms/declaration-checkbox"
      },
      {
        "label": "Form Card",
        "href": "/design-system/components/forms/form-card"
      },
      {
        "label": "Form Field",
        "href": "/design-system/components/forms/form-field"
      },
      {
        "label": "Form Section",
        "href": "/design-system/components/forms/form-section"
      },
      {
        "label": "Geo Photo Input",
        "href": "/design-system/components/forms/geo-photo-input"
      },
      {
        "label": "Input",
        "href": "/design-system/components/forms/input"
      },
      {
        "label": "Label",
        "href": "/design-system/components/forms/label"
      },
      {
        "label": "Media Gallery Input",
        "href": "/design-system/components/forms/media-gallery-input"
      },
      {
        "label": "Media Upload",
        "href": "/design-system/components/forms/media-upload"
      },
      {
        "label": "Otp Input",
        "href": "/design-system/components/forms/otp-input"
      },
      {
        "label": "Pan Input",
        "href": "/design-system/components/forms/pan-input"
      },
      {
        "label": "Password Input",
        "href": "/design-system/components/forms/password-input"
      },
      {
        "label": "Password Strength Meter",
        "href": "/design-system/components/forms/password-strength-meter"
      },
      {
        "label": "Radio",
        "href": "/design-system/components/forms/radio"
      },
      {
        "label": "Search",
        "href": "/design-system/components/forms/search"
      },
      {
        "label": "Select",
        "href": "/design-system/components/forms/select"
      },
      {
        "label": "Textarea",
        "href": "/design-system/components/forms/textarea"
      },
      {
        "label": "Toggle",
        "href": "/design-system/components/forms/toggle"
      },
      {
        "label": "Wizard",
        "href": "/design-system/components/forms/wizard"
      }
    ]
  },
  {
    "title": "Navigation",
    "items": [
      {
        "label": "Account Menu",
        "href": "/design-system/components/navigation/account-menu"
      },
      {
        "label": "App Switcher Panel",
        "href": "/design-system/components/navigation/app-switcher-panel"
      },
      {
        "label": "Brand Lockup",
        "href": "/design-system/components/navigation/brand-lockup"
      },
      {
        "label": "Footer",
        "href": "/design-system/components/navigation/footer"
      },
      {
        "label": "Nav Sheet",
        "href": "/design-system/components/navigation/nav-sheet"
      },
      {
        "label": "Sidebar",
        "href": "/design-system/components/section-templates/sidebar"
      },
      {
        "label": "Site Footer",
        "href": "/design-system/components/navigation/site-footer"
      },
      {
        "label": "Site Header",
        "href": "/design-system/components/section-templates/site-header"
      },
      {
        "label": "Tabs",
        "href": "/design-system/components/navigation/tabs"
      },
      {
        "label": "Tabs Overflow",
        "href": "/design-system/components/navigation/tabs-overflow"
      },
      {
        "label": "Zone Switcher",
        "href": "/design-system/components/navigation/zone-switcher"
      }
    ]
  },
  {
    "title": "Feedback & Status",
    "items": [
      {
        "label": "Action Banner",
        "href": "/design-system/components/feedback/action-banner"
      },
      {
        "label": "Alert",
        "href": "/design-system/components/feedback/alert"
      },
      {
        "label": "Badge",
        "href": "/design-system/components/feedback/badge"
      },
      {
        "label": "Chatbot",
        "href": "/design-system/components/feedback/chatbot"
      },
      {
        "label": "Chatbot Mascot",
        "href": "/design-system/components/feedback/chatbot-mascot"
      },
      {
        "label": "Empty State",
        "href": "/design-system/components/feedback/empty-state"
      },
      {
        "label": "Lightbox",
        "href": "/design-system/components/feedback/lightbox"
      },
      {
        "label": "Loader",
        "href": "/design-system/components/feedback/loader"
      },
      {
        "label": "Modal",
        "href": "/design-system/components/feedback/modal"
      },
      {
        "label": "Side Sheet",
        "href": "/design-system/components/feedback/side-sheet"
      },
      {
        "label": "Skeleton",
        "href": "/design-system/components/feedback/skeleton"
      },
      {
        "label": "Sla Progress Indicator",
        "href": "/design-system/components/feedback/sla-progress-indicator"
      },
      {
        "label": "Stepper",
        "href": "/design-system/components/feedback/stepper"
      },
      {
        "label": "Toast",
        "href": "/design-system/components/feedback/toast"
      },
      {
        "label": "Tooltip",
        "href": "/design-system/components/feedback/tooltip"
      }
    ]
  },
  {
    "title": "Data Display",
    "items": [
      {
        "label": "Accordion",
        "href": "/design-system/components/data-display/accordion"
      },
      {
        "label": "Approval Timeline",
        "href": "/design-system/components/data-display/approval-timeline"
      },
      {
        "label": "Area Chart",
        "href": "/design-system/components/data-display/area-chart"
      },
      {
        "label": "Avatar",
        "href": "/design-system/components/data-display/avatar"
      },
      {
        "label": "Axis",
        "href": "/design-system/components/data-display/axis"
      },
      {
        "label": "Bar Chart",
        "href": "/design-system/components/data-display/bar-chart"
      },
      {
        "label": "Card",
        "href": "/design-system/components/data-display/card"
      },
      {
        "label": "Chart Frame",
        "href": "/design-system/components/data-display/chart-frame"
      },
      {
        "label": "Combo Chart",
        "href": "/design-system/components/data-display/combo-chart"
      },
      {
        "label": "Data Table",
        "href": "/design-system/components/data-display/data-table"
      },
      {
        "label": "Donut Chart",
        "href": "/design-system/components/data-display/donut-chart"
      },
      {
        "label": "Funnel Chart",
        "href": "/design-system/components/data-display/funnel-chart"
      },
      {
        "label": "Gauge",
        "href": "/design-system/components/data-display/gauge"
      },
      {
        "label": "Heatmap",
        "href": "/design-system/components/data-display/heatmap"
      },
      {
        "label": "India Map",
        "href": "/design-system/components/data-display/india-map"
      },
      {
        "label": "Legend",
        "href": "/design-system/components/data-display/legend"
      },
      {
        "label": "Line Chart",
        "href": "/design-system/components/data-display/line-chart"
      },
      {
        "label": "Metric Card",
        "href": "/design-system/components/data-display/metric-card"
      },
      {
        "label": "Pie Chart",
        "href": "/design-system/components/data-display/pie-chart"
      },
      {
        "label": "Profile Card",
        "href": "/design-system/components/data-display/profile-card"
      },
      {
        "label": "Progress",
        "href": "/design-system/components/data-display/progress"
      },
      {
        "label": "Scatter Chart",
        "href": "/design-system/components/data-display/scatter-chart"
      },
      {
        "label": "Sparkline",
        "href": "/design-system/components/data-display/sparkline"
      },
      {
        "label": "Vertical Timeline",
        "href": "/design-system/components/data-display/vertical-timeline"
      },
      {
        "label": "Visitor Counter",
        "href": "/design-system/components/data-display/visitor-counter"
      }
    ]
  },
  {
    "title": "Layout",
    "items": [
      {
        "label": "App Shell",
        "href": "/design-system/components/layout/app-shell"
      },
      {
        "label": "Band",
        "href": "/design-system/components/layout/band"
      },
      {
        "label": "Container",
        "href": "/design-system/components/layout/container"
      },
      {
        "label": "Divider",
        "href": "/design-system/components/layout/divider"
      },
      {
        "label": "Grid",
        "href": "/design-system/components/layout/grid"
      },
      {
        "label": "Page Header",
        "href": "/design-system/components/layout/page-header"
      },
      {
        "label": "Section",
        "href": "/design-system/components/layout/section"
      },
      {
        "label": "Site Layout",
        "href": "/design-system/components/layout/site-layout"
      }
    ]
  },
  {
    "title": "Utilities",
    "items": [
      {
        "label": "Accessibility Bar",
        "href": "/design-system/components/utilities/accessibility-bar"
      },
      {
        "label": "Icon",
        "href": "/design-system/components/utilities/icon"
      },
      {
        "label": "Live Region",
        "href": "/design-system/components/utilities/live-region"
      },
      {
        "label": "Ux4g Accessibility Widget",
        "href": "/design-system/components/utilities/ux4g-accessibility-widget"
      }
    ]
  },
  {
    "title": "Auth & Dashboard",
    "items": [
      {
        "label": "Portal Login Shell",
        "href": "/design-system/components/auth/portal-login-shell"
      },
      {
        "label": "Portal Login Template",
        "href": "/design-system/components/auth/portal-login-template"
      },
      {
        "label": "Chart Card",
        "href": "/design-system/components/dashboard/chart-card"
      },
      {
        "label": "Dashboard Grid",
        "href": "/design-system/components/dashboard/dashboard-grid"
      },
      {
        "label": "Filter Bar",
        "href": "/design-system/components/dashboard/filter-bar"
      },
      {
        "label": "Kpi Row",
        "href": "/design-system/components/dashboard/kpi-row"
      }
    ]
  },
  {
    "title": "Patterns",
    "items": [
      {
        "label": "Dashboard Scaffold",
        "href": "/design-system/resources/patterns#dashboard",
        "badge": "New"
      },
      {
        "label": "Portal Login",
        "href": "/design-system/resources/patterns#login",
        "badge": "New"
      },
      {
        "label": "Form Wizard",
        "href": "/design-system/resources/patterns#wizard",
        "badge": "New"
      },
      {
        "label": "Data Tables",
        "href": "/design-system/resources/patterns#data-table",
        "badge": "Alpha"
      },
      {
        "label": "Empty States",
        "href": "/design-system/resources/patterns#empty-state",
        "badge": "Alpha"
      }
    ]
  },
  {
    "title": "Resources",
    "items": [
      {
        "label": "Overview",
        "href": "/design-system/resources"
      },
      {
        "label": "AI design context",
        "href": "/design-system/resources/design-context",
        "badge": "New"
      },
      {
        "label": "Design tokens",
        "href": "/design-system/resources/tokens",
        "badge": "New"
      },
      {
        "label": "Changelog",
        "href": "/design-system/resources/changelog"
      },
      {
        "label": "Governance",
        "href": "/design-system/resources/governance"
      },
      {
        "label": "Contributing",
        "href": "/design-system/resources/contributing"
      },
      {
        "label": "Roadmap",
        "href": "/design-system/resources/roadmap"
      }
    ]
  }
];
