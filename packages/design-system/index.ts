// =============================================================================
// @mosje/design-system — public API barrel.
// Organised by the functional-category benchmark (Polaris / Material / Carbon):
//   foundations · utils · components/{actions,forms,feedback,data-display,
//   navigation,a11y}. Apps import from this barrel; internal paths can move
//   freely without breaking consumers.
// =============================================================================

// ---- Tokens (generated) -----------------------------------------------------
export * from "./tokens";
export { default as tokens } from "./tokens";

// ---- Utils ------------------------------------------------------------------
export { cn } from "./utils/cn";

// ---- Foundations: color-mode (brand axis) -----------------------------------
export {
  COLOR_MODES,
  DEFAULT_COLOR_MODE,
  COLOR_MODE_COOKIE,
  COLOR_MODE_ATTR,
  isColorMode,
  normalizeColorMode,
  colorModeFromCookieHeader,
  readColorModeCookie,
  applyColorMode,
  colorModeInitScript,
  type ColorMode,
  type ColorModeId,
} from "./foundations/color-mode";
export {
  ColorModeProvider,
  useColorMode,
  type ColorModeProviderProps,
} from "./foundations/color-mode-provider";
export {
  ColorModeSwitcher,
  type ColorModeSwitcherProps,
} from "./foundations/color-mode-switcher";

// ---- Components: Icon -------------------------------------------------------
// Material Symbols Outlined — the official icon system for all MoSJE apps.
// Load the font once in your app root: import "@mosje/design-system/icons.css"
export { Icon } from "./components/icon";
export type { IconProps } from "./components/icon";

// ---- Components: Actions -----------------------------------------------------
export { Button, buttonClasses } from "./components/actions/button";
export type { ButtonVariant, ButtonAppearance, ButtonSize } from "./components/actions/button";

// ---- Components: Forms -------------------------------------------------------
export { Input } from "./components/forms/input";
export type { InputProps } from "./components/forms/input";
export { Textarea } from "./components/forms/textarea";
export type { TextareaProps } from "./components/forms/textarea";
export { Select } from "./components/forms/select";
export type { SelectProps, SelectOption } from "./components/forms/select";
export { FormField } from "./components/forms/form-field";
export type { FormFieldProps, FormFieldControlProps } from "./components/forms/form-field";
export { Checkbox } from "./components/forms/checkbox";
export { Radio } from "./components/forms/radio";
export { Toggle } from "./components/forms/toggle";
export { Search } from "./components/forms/search";
export { Chip } from "./components/forms/chip";
export { FormSection } from "./components/forms/form-section";
export type { FormSectionProps } from "./components/forms/form-section";
export { FormCard } from "./components/forms/form-card";
export type { FormCardProps } from "./components/forms/form-card";
export { Wizard, ReviewSection, ReviewItem } from "./components/forms/wizard";
export type { WizardProps } from "./components/forms/wizard";
export { MediaUpload } from "./components/forms/media-upload";
export type { MediaUploadProps } from "./components/forms/media-upload";

// ---- Components: Feedback ----------------------------------------------------
export { Alert } from "./components/feedback/alert";
export { Badge } from "./components/feedback/badge";
export { Loader } from "./components/feedback/loader";
export { EmptyState } from "./components/feedback/empty-state";
export { Stepper } from "./components/feedback/stepper";
export type { StepperProps, StepperStep } from "./components/feedback/stepper";
export { Tabs, TabPanel } from "./components/navigation/tabs";
export type { TabsProps, TabDef } from "./components/navigation/tabs";
export { Modal } from "./components/feedback/modal";
export type { ModalProps, ModalSize } from "./components/feedback/modal";
export { ToastProvider, useToast } from "./components/feedback/toast";
export type { ToastVariant } from "./components/feedback/toast";

// ---- Components: Data display ------------------------------------------------
export { Card, CardHeader, CardBody, CardFooter, CardTitle, CardSubtitle } from "./components/data-display/card";
export { Avatar } from "./components/data-display/avatar";
export { MetricCard } from "./components/data-display/metric-card";
export type { MetricCardProps, MetricCardSize, MetricCardChange } from "./components/data-display/metric-card";
export { DataTable } from "./components/data-display/data-table";
export type { DataTableProps, DataTableColumn } from "./components/data-display/data-table";
// Data visualisation — dependency-free, token-driven, theme-aware SVG charts
export {
  PieChart,
  BarChart,
  LineChart,
  AreaChart,
  DonutChart,
  Gauge,
  Sparkline,
  Progress,
  FunnelChart,
  ScatterChart,
  Heatmap,
  ComboChart,
  IndiaMap,
  Legend,
  useChartTooltip,
  ChartTooltip,
  categoricalColor,
  sequentialColor,
  divergingColor,
  formatIndian,
  formatCompact,
  formatPercent,
} from "./components/data-display/charts";
export type {
  ChartDatum,
  ChartSeries,
  ChartMultiSeries,
  ChartTable,
  BarChartProps,
  LineChartProps,
  AreaChartProps,
  DonutChartProps,
  GaugeProps,
  SparklineProps,
  ProgressProps,
  FunnelChartProps,
  FunnelStage,
  ScatterChartProps,
  ScatterSeries,
  ScatterPoint,
  HeatmapProps,
  ComboChartProps,
  IndiaMapProps,
  IndiaMapDatum,
  LegendItem,
  ValueFormat,
} from "./components/data-display/charts";

// ---- Components: Dashboard composition ---------------------------------------
export { ChartCard } from "./components/dashboard/chart-card";
export type { ChartCardProps } from "./components/dashboard/chart-card";
export { DashboardGrid } from "./components/dashboard/dashboard-grid";
export type { DashboardGridProps } from "./components/dashboard/dashboard-grid";
export { KpiRow } from "./components/dashboard/kpi-row";
export type { KpiRowProps } from "./components/dashboard/kpi-row";
export { FilterBar, SegmentedControl } from "./components/dashboard/filter-bar";
export type { FilterBarProps, SegmentedControlProps, SegmentedOption } from "./components/dashboard/filter-bar";

// ---- Components: Navigation --------------------------------------------------
// Navbar — SiteHeader (the SAMAVESH Navbar: Website + Portal variants, 3-tier).
export {
  SiteHeader,
  BrandLockup,
  AccountMenu,
  useA11yToolbar,
  FONT_LEVELS,
} from "./components/navigation/header";

// Sidebar — portal app-shell left navigation (Figma: sidebar/type-1).
export { SidebarNav } from "./components/navigation/sidebar";
export type {
  SidebarNavProps,
  SidebarNavGroup,
  SidebarNavItem,
  SidebarNavChild,
} from "./components/navigation/sidebar";
export type {
  SiteHeaderProps,
  BrandLockupProps,
  AccountMenuProps,
  A11yToolbar,
  FontLevel,
  NavLink,
  NavItem,
  NavColumn,
  NavMegaItem,
  HeaderVariant,
  BrandLines,
  BrandMark,
  HeaderSearch,
  UtilityTone,
  HeaderAccount,
  AccountMenuItem,
} from "./components/navigation/header";

// Footer — slim dark-navy app-shell footer (UX4G / NeGD credit + policy links).
export { Footer } from "./components/navigation/footer";
export type { FooterProps, FooterLink } from "./components/navigation/footer";

// The interactive component lives in a "use client" module.
export { AppSwitcher, ZoneSwitcher } from "./components/navigation/zone-switcher";
export type { AppSwitcherProps, ZoneSwitcherProps } from "./components/navigation/zone-switcher";
// Data, types and helpers come from the plain (server-safe) module so server
// components can read them directly.
export {
  DEFAULT_APPS,
  DEFAULT_APPS as DEFAULT_ZONES,
  PORTAL_CATEGORIES,
  deriveAbbr,
  filterApps,
  matchActivePath,
} from "./components/navigation/app-switcher-utils";
export type {
  AppEntry,
  AppEntry as Zone,
} from "./components/navigation/app-switcher-utils";

// ---- Components: Auth (login shells & page templates) -----------------------
// Full-page login layout shared across all MoSJE portals. Only the slot
// content changes per portal (logo paths, signing-into name, tabs, form).
export { PortalLoginShell } from "./components/auth/portal-login-shell";
export type {
  PortalLoginShellProps,
  PortalLoginTab,
} from "./components/auth/portal-login-shell";

// ---- Components: Accessibility -----------------------------------------------
export { AccessibilityWidget } from "./components/a11y/accessibility-widget";


// =============================================================================
// DEMO-ONLY — Review & development tooling (NOT for production builds)
// Guard every usage: devMode={process.env.NODE_ENV === "development"}
// These live in packages/design-system/demo/ and are separate from the core DS.
// =============================================================================
export { DemoFab } from "./demo";
export type { DemoAccount, DemoFabProps, DemoFillDetail } from "./demo";
