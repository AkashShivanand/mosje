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
        "label": "For Designers",
        "href": "/design-system#for-designers"
      },
      {
        "label": "For Developers",
        "href": "/design-system#for-developers"
      },
      {
        "label": "What is SAMAVESH?",
        "href": "/design-system"
      }
    ]
  },
  {
    "title": "Foundations",
    // Dependency order, not alphabetical (INFORMATION-ARCHITECTURE.md §1): what a reader must
    // know first comes first — accessibility and brand before colour, colour before type, the
    // grid before what sits on it, the surface (shape · stroke · elevation · layering · opacity)
    // before how it moves, and states last because they bind every foundation above.
    "items": [
      { "label": "Accessibility", "href": "/design-system/foundations/accessibility", "badge": "Stable" },
      { "label": "Brand & White-Labelling", "href": "/design-system/foundations/brand", "badge": "New" },
      { "label": "Color", "href": "/design-system/foundations/color", "badge": "Stable" },
      { "label": "Typography", "href": "/design-system/foundations/typography", "badge": "Stable" },
      { "label": "Iconography", "href": "/design-system/foundations/iconography", "badge": "Beta" },
      { "label": "Illustration", "href": "/design-system/foundations/illustration", "badge": "New" },
      { "label": "Layout Grid", "href": "/design-system/foundations/layout-grid", "badge": "New" },
      { "label": "Breakpoints", "href": "/design-system/foundations/breakpoints", "badge": "New" },
      { "label": "Spacing", "href": "/design-system/foundations/spacing", "badge": "Stable" },
      { "label": "Sizing", "href": "/design-system/foundations/sizing", "badge": "New" },
      { "label": "Shape", "href": "/design-system/foundations/shape", "badge": "Stable" },
      { "label": "Stroke", "href": "/design-system/foundations/stroke", "badge": "New" },
      { "label": "Elevation", "href": "/design-system/foundations/elevation", "badge": "Stable" },
      { "label": "Layering", "href": "/design-system/foundations/layering", "badge": "New" },
      { "label": "Opacity", "href": "/design-system/foundations/opacity", "badge": "New" },
      { "label": "Motion", "href": "/design-system/foundations/motion", "badge": "Stable" },
      { "label": "Interaction States", "href": "/design-system/foundations/states", "badge": "New" },
      { "label": "Density", "href": "/design-system/foundations/density", "badge": "Stable" },
      { "label": "Content & Localisation", "href": "/design-system/foundations/content-localisation", "badge": "Alpha" }
    ]
  },
  {
    "title": "Brand",
    "items": [
      {
        "label": "Org Logo",
        "href": "/design-system/components/brand/org-logo",
        "badge": "New"
      }
    ]
  },
  {
    "title": "Actions",
    "items": [
      {
        "label": "Button",
        "href": "/design-system/components/actions/button",
        "badge": "Stable"
      },
      {
        "label": "Button Group",
        "href": "/design-system/components/actions/button-group",
        "badge": "Stable"
      },
      {
        "label": "Icon Button",
        "href": "/design-system/components/actions/icon-button",
        "badge": "Stable"
      }
    ]
  },
  {
    "title": "Forms & Inputs",
    "items": [
      {
        "label": "Aadhaar Input",
        "href": "/design-system/components/forms/aadhaar-input",
        "badge": "Stable"
      },
      {
        "label": "Captcha Field",
        "href": "/design-system/components/forms/captcha-field",
        "badge": "Stable"
      },
      {
        "label": "Checkbox",
        "href": "/design-system/components/forms/checkbox",
        "badge": "Stable"
      },
      {
        "label": "Chip",
        "href": "/design-system/components/forms/chip",
        "badge": "Stable"
      },
      {
        "label": "Declaration Checkbox",
        "href": "/design-system/components/forms/declaration-checkbox",
        "badge": "New"
      },
      {
        "label": "Filter Select",
        "href": "/design-system/components/forms/filter-select",
        "badge": "New"
      },
      {
        "label": "Form Card",
        "href": "/design-system/components/forms/form-card",
        "badge": "New"
      },
      {
        "label": "Form Field",
        "href": "/design-system/components/forms/form-field",
        "badge": "Stable"
      },
      {
        "label": "Form Section",
        "href": "/design-system/components/forms/form-section",
        "badge": "Stable"
      },
      {
        "label": "Geo Photo Input",
        "href": "/design-system/components/forms/geo-photo-input",
        "badge": "New"
      },
      {
        "label": "Input",
        "href": "/design-system/components/forms/input",
        "badge": "Stable"
      },
      {
        "label": "Label",
        "href": "/design-system/components/forms/label",
        "badge": "Stable"
      },
      {
        "label": "Media Gallery Input",
        "href": "/design-system/components/forms/media-gallery-input",
        "badge": "New"
      },
      {
        "label": "Media Upload",
        "href": "/design-system/components/forms/media-upload",
        "badge": "Stable"
      },
      {
        "label": "Otp Input",
        "href": "/design-system/components/forms/otp-input",
        "badge": "Stable"
      },
      {
        "label": "Pan Input",
        "href": "/design-system/components/forms/pan-input",
        "badge": "Stable"
      },
      {
        "label": "Password Input",
        "href": "/design-system/components/forms/password-input",
        "badge": "Stable"
      },
      {
        "label": "Password Strength Meter",
        "href": "/design-system/components/forms/password-strength-meter",
        "badge": "Stable"
      },
      {
        "label": "Radio",
        "href": "/design-system/components/forms/radio",
        "badge": "Stable"
      },
      {
        "label": "Search",
        "href": "/design-system/components/forms/search",
        "badge": "Stable"
      },
      {
        "label": "Select",
        "href": "/design-system/components/forms/select",
        "badge": "Stable"
      },
      {
        "label": "Textarea",
        "href": "/design-system/components/forms/textarea",
        "badge": "Stable"
      },
      {
        "label": "Toggle",
        "href": "/design-system/components/forms/toggle",
        "badge": "Stable"
      },
      {
        "label": "Wizard",
        "href": "/design-system/components/forms/wizard",
        "badge": "Beta"
      }
    ]
  },
  {
    "title": "Navigation",
    "items": [
      {
        "label": "Account Menu",
        "href": "/design-system/components/navigation/account-menu",
        "badge": "Stable"
      },
      {
        "label": "App Switcher Panel",
        "href": "/design-system/components/navigation/app-switcher-panel",
        "badge": "Stable"
      },
      {
        "label": "Brand Lockup",
        "href": "/design-system/components/navigation/brand-lockup",
        "badge": "Stable"
      },
      {
        "label": "Content Nav",
        "href": "/design-system/components/navigation/content-nav",
        "badge": "Stable"
      },
      {
        "label": "Footer",
        "href": "/design-system/components/navigation/footer",
        "badge": "Stable"
      },
      {
        "label": "Nav Sheet",
        "href": "/design-system/components/navigation/nav-sheet",
        "badge": "Stable"
      },
      {
        "label": "Portal Card",
        "href": "/design-system/components/navigation/portal-card",
        "badge": "New"
      },
      {
        "label": "SAMAVESH Banner",
        "href": "/design-system/components/navigation/samavesh-banner",
        "badge": "New"
      },
      {
        "label": "Sidebar",
        "href": "/design-system/components/section-templates/sidebar",
        "badge": "Stable"
      },
      {
        "label": "Sidebar Nav",
        "href": "/design-system/components/navigation/sidebar-nav",
        "badge": "Stable"
      },
      {
        "label": "Site Footer",
        "href": "/design-system/components/navigation/site-footer",
        "badge": "Stable"
      },
      {
        "label": "Site Header",
        "href": "/design-system/components/section-templates/site-header",
        "badge": "Stable"
      },
      {
        "label": "Tabs",
        "href": "/design-system/components/navigation/tabs",
        "badge": "Stable"
      },
      {
        "label": "Tabs Overflow",
        "href": "/design-system/components/navigation/tabs-overflow",
        "badge": "Beta"
      },
      {
        "label": "Zone Switcher",
        "href": "/design-system/components/navigation/zone-switcher",
        "badge": "Stable"
      }
    ]
  },
  {
    "title": "Feedback & Status",
    "items": [
      {
        "label": "Action Banner",
        "href": "/design-system/components/feedback/action-banner",
        "badge": "New"
      },
      {
        "label": "Alert",
        "href": "/design-system/components/feedback/alert",
        "badge": "Stable"
      },
      {
        "label": "Badge",
        "href": "/design-system/components/feedback/badge",
        "badge": "Stable"
      },
      {
        "label": "Chatbot",
        "href": "/design-system/components/feedback/chatbot",
        "badge": "Beta"
      },
      {
        "label": "Chatbot Mascot",
        "href": "/design-system/components/feedback/chatbot-mascot",
        "badge": "Beta"
      },
      {
        "label": "Empty State",
        "href": "/design-system/components/feedback/empty-state",
        "badge": "Stable"
      },
      {
        "label": "Error View",
        "href": "/design-system/components/feedback/error-view"
      },
      {
        "label": "Lightbox",
        "href": "/design-system/components/feedback/lightbox",
        "badge": "Beta"
      },
      {
        "label": "Loader",
        "href": "/design-system/components/feedback/loader",
        "badge": "Stable"
      },
      {
        "label": "Modal",
        "href": "/design-system/components/feedback/modal",
        "badge": "Stable"
      },
      {
        "label": "Side Sheet",
        "href": "/design-system/components/feedback/side-sheet",
        "badge": "Stable"
      },
      {
        "label": "Skeleton",
        "href": "/design-system/components/feedback/skeleton",
        "badge": "Stable"
      },
      {
        "label": "Sla Progress Indicator",
        "href": "/design-system/components/feedback/sla-progress-indicator",
        "badge": "Beta"
      },
      {
        "label": "Stepper",
        "href": "/design-system/components/feedback/stepper",
        "badge": "Stable"
      },
      {
        "label": "Ticker",
        "href": "/design-system/components/feedback/ticker",
        "badge": "Beta"
      },
      {
        "label": "Toast",
        "href": "/design-system/components/feedback/toast",
        "badge": "Stable"
      },
      {
        "label": "Tooltip",
        "href": "/design-system/components/feedback/tooltip",
        "badge": "Stable"
      }
    ]
  },
  {
    "title": "Data Visualisation",
    "items": [
      {
        "label": "Dashboard Archetypes",
        "href": "/design-system/data-visualisation/archetypes",
        "badge": "Beta"
      },
      {
        "label": "India Bubble Map",
        "href": "/design-system/components/data-display/india-bubble-map",
        "badge": "Beta"
      },
      {
        "label": "India Point Map",
        "href": "/design-system/components/data-display/india-point-map",
        "badge": "Beta"
      },
      {
        "label": "Library",
        "href": "/design-system/data-visualisation",
        "badge": "Beta"
      }
    ]
  },
  {
    "title": "Data Display",
    "items": [
      {
        "label": "Accordion",
        "href": "/design-system/components/data-display/accordion",
        "badge": "Stable"
      },
      {
        "label": "Approval Timeline",
        "href": "/design-system/components/data-display/approval-timeline",
        "badge": "Beta"
      },
      {
        "label": "Area Chart",
        "href": "/design-system/components/data-display/area-chart",
        "badge": "Beta"
      },
      {
        "label": "Avatar",
        "href": "/design-system/components/data-display/avatar",
        "badge": "Stable"
      },
      {
        "label": "Axis",
        "href": "/design-system/components/data-display/axis",
        "badge": "Beta"
      },
      {
        "label": "Bar Chart",
        "href": "/design-system/components/data-display/bar-chart",
        "badge": "Beta"
      },
      {
        "label": "Card",
        "href": "/design-system/components/data-display/card",
        "badge": "Stable"
      },
      {
        "label": "Chart Frame",
        "href": "/design-system/components/data-display/chart-frame",
        "badge": "Beta"
      },
      {
        "label": "Combo Chart",
        "href": "/design-system/components/data-display/combo-chart",
        "badge": "Beta"
      },
      {
        "label": "Data Table",
        "href": "/design-system/components/data-display/data-table",
        "badge": "Stable"
      },
      {
        "label": "Document Library",
        "href": "/design-system/components/data-display/document-library",
        "badge": "Stable"
      },
      {
        "label": "Donut Chart",
        "href": "/design-system/components/data-display/donut-chart",
        "badge": "Beta"
      },
      {
        "label": "Fact Strip",
        "href": "/design-system/components/data-display/fact-strip",
        "badge": "Stable"
      },
      {
        "label": "Funnel Chart",
        "href": "/design-system/components/data-display/funnel-chart",
        "badge": "Beta"
      },
      {
        "label": "Gauge",
        "href": "/design-system/components/data-display/gauge",
        "badge": "Beta"
      },
      {
        "label": "Heatmap",
        "href": "/design-system/components/data-display/heatmap",
        "badge": "Beta"
      },
      {
        "label": "India Map",
        "href": "/design-system/components/data-display/india-map",
        "badge": "Beta"
      },
      {
        "label": "Legend",
        "href": "/design-system/components/data-display/legend",
        "badge": "Beta"
      },
      {
        "label": "Line Chart",
        "href": "/design-system/components/data-display/line-chart",
        "badge": "Beta"
      },
      {
        "label": "Metric Card",
        "href": "/design-system/components/data-display/metric-card",
        "badge": "Stable"
      },
      {
        "label": "Pie Chart",
        "href": "/design-system/components/data-display/pie-chart",
        "badge": "Beta"
      },
      {
        "label": "Profile Card",
        "href": "/design-system/components/data-display/profile-card",
        "badge": "New"
      },
      {
        "label": "Progress",
        "href": "/design-system/components/data-display/progress",
        "badge": "Stable"
      },
      {
        "label": "Ranked Bar List",
        "href": "/design-system/components/data-display/ranked-bar-list",
        "badge": "New"
      },
      {
        "label": "Scatter Chart",
        "href": "/design-system/components/data-display/scatter-chart",
        "badge": "Beta"
      },
      {
        "label": "Sparkline",
        "href": "/design-system/components/data-display/sparkline",
        "badge": "Beta"
      },
      {
        "label": "Vertical Timeline",
        "href": "/design-system/components/data-display/vertical-timeline",
        "badge": "New"
      },
      {
        "label": "Visitor Counter",
        "href": "/design-system/components/data-display/visitor-counter",
        "badge": "Beta"
      }
    ]
  },
  {
    "title": "Layout",
    "items": [
      {
        "label": "App Shell",
        "href": "/design-system/components/layout/app-shell",
        "badge": "Stable"
      },
      {
        "label": "Band",
        "href": "/design-system/components/layout/band",
        "badge": "Stable"
      },
      {
        "label": "Container",
        "href": "/design-system/components/layout/container",
        "badge": "Stable"
      },
      {
        "label": "Divider",
        "href": "/design-system/components/layout/divider",
        "badge": "Stable"
      },
      {
        "label": "Grid",
        "href": "/design-system/components/layout/grid",
        "badge": "Stable"
      },
      {
        "label": "Grid Item",
        "href": "/design-system/components/layout/grid-item",
        "badge": "Stable"
      },
      {
        "label": "Page Header",
        "href": "/design-system/components/layout/page-header",
        "badge": "Stable"
      },
      {
        "label": "Section",
        "href": "/design-system/components/layout/section",
        "badge": "Stable"
      },
      {
        "label": "Site Layout",
        "href": "/design-system/components/layout/site-layout",
        "badge": "Stable"
      },
      {
        "label": "Site Page Header",
        "href": "/design-system/components/layout/site-page-header",
        "badge": "Stable"
      }
    ]
  },
  {
    "title": "Utilities",
    "items": [
      {
        "label": "Accessibility Bar",
        "href": "/design-system/components/utilities/accessibility-bar",
        "badge": "Stable"
      },
      {
        "label": "Brand Glyph",
        "href": "/design-system/components/utilities/brand-glyph",
        "badge": "Stable"
      },
      {
        "label": "Color Mode Provider",
        "href": "/design-system/components/utilities/color-mode-provider",
        "badge": "Stable"
      },
      {
        "label": "Demo Accounts Panel",
        "href": "/design-system/components/utilities/demo-accounts-panel",
        "badge": "Stable"
      },
      {
        "label": "Demo Dock",
        "href": "/design-system/components/utilities/demo-dock",
        "badge": "Stable"
      },
      {
        "label": "Demo Fab",
        "href": "/design-system/components/utilities/demo-fab",
        "badge": "Stable"
      },
      {
        "label": "Flask Icon",
        "href": "/design-system/components/utilities/flask-icon",
        "badge": "Stable"
      },
      {
        "label": "Icon",
        "href": "/design-system/components/utilities/icon",
        "badge": "Stable"
      },
      {
        "label": "Live Region",
        "href": "/design-system/components/utilities/live-region",
        "badge": "Stable"
      },
      {
        "label": "Ux4g Accessibility Widget",
        "href": "/design-system/components/utilities/ux4g-accessibility-widget",
        "badge": "Stable"
      }
    ]
  },
  {
    "title": "Auth & Dashboard",
    "items": [
      {
        "label": "Account Prompt",
        "href": "/design-system/components/auth/account-prompt",
        "badge": "Stable"
      },
      {
        "label": "Auth Divider",
        "href": "/design-system/components/auth/auth-divider",
        "badge": "Stable"
      },
      {
        "label": "Card Skeleton",
        "href": "/design-system/components/dashboard/card-skeleton",
        "badge": "Stable"
      },
      {
        "label": "Card State",
        "href": "/design-system/components/dashboard/card-state",
        "badge": "Stable"
      },
      {
        "label": "Chart Card",
        "href": "/design-system/components/dashboard/chart-card",
        "badge": "Beta"
      },
      {
        "label": "Consent Line",
        "href": "/design-system/components/auth/consent-line",
        "badge": "Stable"
      },
      {
        "label": "Dashboard Grid",
        "href": "/design-system/components/dashboard/dashboard-grid",
        "badge": "Beta"
      },
      {
        "label": "Filter Bar",
        "href": "/design-system/components/dashboard/filter-bar",
        "badge": "Beta"
      },
      {
        "label": "Kpi Row",
        "href": "/design-system/components/dashboard/kpi-row",
        "badge": "Beta"
      },
      {
        "label": "Masked Contact Row",
        "href": "/design-system/components/auth/masked-contact-row",
        "badge": "Stable"
      },
      {
        "label": "Portal Login Shell",
        "href": "/design-system/components/auth/portal-login-shell",
        "badge": "Stable"
      },
      {
        "label": "Portal Login Template",
        "href": "/design-system/components/auth/portal-login-template",
        "badge": "Stable"
      },
      {
        "label": "Resend Timer",
        "href": "/design-system/components/auth/resend-timer",
        "badge": "Stable"
      },
      {
        "label": "Segmented Control",
        "href": "/design-system/components/dashboard/segmented-control",
        "badge": "Stable"
      },
      {
        "label": "Signing Into Bar",
        "href": "/design-system/components/auth/signing-into-bar",
        "badge": "Stable"
      },
      {
        "label": "SSO Button",
        "href": "/design-system/components/auth/sso-button",
        "badge": "Stable"
      }
    ]
  },
  {
    // The layer ABOVE components: Tier A chrome, then one template per page
    // archetype. Ordered by how a screen gets built, not alphabetically — the
    // chrome first, the state contract that every template routes through
    // second, then the four templates themselves.
    // Catalogue and decision table: docs/design-system/screen-templates.md
    "title": "Screen Templates",
    "items": [
      { "label": "Portal Page", "href": "/design-system/components/templates/portal-page", "badge": "Beta" },
      { "label": "Screen Body", "href": "/design-system/components/templates/screen-body", "badge": "Beta" },
      { "label": "Overview Screen", "href": "/design-system/components/templates/overview-screen", "badge": "Beta" },
      { "label": "Worklist Screen", "href": "/design-system/components/templates/worklist-screen", "badge": "Beta" },
      { "label": "Record Screen", "href": "/design-system/components/templates/record-screen", "badge": "Beta" },
      { "label": "Wizard Screen", "href": "/design-system/components/templates/wizard-screen", "badge": "Beta" },
      { "label": "Form Screen", "href": "/design-system/components/templates/form-screen", "badge": "Beta" },
      { "label": "Chooser Screen", "href": "/design-system/components/templates/chooser-screen", "badge": "Beta" },
      { "label": "Checklist Screen", "href": "/design-system/components/templates/checklist-screen", "badge": "Beta" },
      { "label": "Review Screen", "href": "/design-system/components/templates/review-screen", "badge": "Beta" },
      { "label": "Confirmation Screen", "href": "/design-system/components/templates/confirmation-screen", "badge": "Beta" },
      { "label": "Decision Screen", "href": "/design-system/components/templates/decision-screen", "badge": "Beta" },
      { "label": "Catalogue Screen", "href": "/design-system/components/templates/catalogue-screen", "badge": "Beta" },
      { "label": "Search Screen", "href": "/design-system/components/templates/search-screen", "badge": "Beta" },
      { "label": "Inbox Screen", "href": "/design-system/components/templates/inbox-screen", "badge": "Beta" },
      { "label": "Settings Screen", "href": "/design-system/components/templates/settings-screen", "badge": "Beta" },
      { "label": "Report Screen", "href": "/design-system/components/templates/report-screen", "badge": "Beta" },
      { "label": "Gallery Screen", "href": "/design-system/components/templates/gallery-screen", "badge": "Beta" },
      { "label": "Status Screen", "href": "/design-system/components/templates/status-screen", "badge": "Beta" },
      { "label": "Auth Screen", "href": "/design-system/components/templates/auth-screen", "badge": "Beta" }
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
        "label": "Data Tables",
        "href": "/design-system/resources/patterns#data-table",
        "badge": "Alpha"
      },
      {
        "label": "Empty States",
        "href": "/design-system/resources/patterns#empty-state",
        "badge": "Alpha"
      },
      {
        "label": "Form Wizard",
        "href": "/design-system/resources/patterns#wizard",
        "badge": "New"
      },
      {
        "label": "Portal Login",
        "href": "/design-system/resources/patterns#login",
        "badge": "New"
      }
    ]
  },
  {
    "title": "Resources",
    "items": [
      {
        "label": "AI design context",
        "href": "/design-system/resources/design-context",
        "badge": "New"
      },
      {
        "label": "Changelog",
        "href": "/design-system/resources/changelog"
      },
      {
        "label": "Contributing",
        "href": "/design-system/resources/contributing"
      },
      {
        "label": "Design tokens",
        "href": "/design-system/resources/tokens",
        "badge": "New"
      },
      {
        "label": "Governance",
        "href": "/design-system/resources/governance"
      },
      {
        "label": "Overview",
        "href": "/design-system/resources"
      },
      {
        "label": "Roadmap",
        "href": "/design-system/resources/roadmap"
      }
    ]
  }
];
