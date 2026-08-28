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
export {
  readExifGps,
  downscaleImage,
  readDeviceLocation,
  formatCoordinates,
} from "./utils/geo-image";
export type { ExifGps, DownscaleResult } from "./utils/geo-image";

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
export { useScrollReveal } from "./foundations/reveal";
export { useOnlineStatus } from "./foundations/online-status";
export { useStickyRange } from "./foundations/sticky-range";
export type { StickyRangeOptions, StickyState } from "./foundations/sticky-range";

// ---- Components: Icon -------------------------------------------------------
// Material Symbols Outlined — the official icon system for all MoSJE apps.
// Load the font once in your app root: import "@mosje/design-system/icons.css"
export { Icon } from "./components/utilities/icon";
export type { IconProps } from "./components/utilities/icon";

// BrandGlyph — third-party brand marks (Facebook, X, Instagram, YouTube,
// WhatsApp), optically normalised so a row of them reads as one set. Material
// Symbols cannot supply these; the vendors each supply theirs to a different
// containment rule, which is the problem this component exists to solve.
export { BrandGlyph, BRAND_GLYPHS, brandGlyphTitle } from "./components/utilities/brand-glyph";
export type { BrandGlyphProps, BrandGlyphName } from "./components/utilities/brand-glyph";

// ---- Components: Actions -----------------------------------------------------
export { Button, buttonClasses } from "./components/actions/button";
export type {
  ButtonVariant,
  ButtonAppearance,
  ButtonTone,
  ButtonSize,
  ButtonProps,
} from "./components/actions/button";
export { IconButton } from "./components/actions/icon-button";
export type { IconButtonProps } from "./components/actions/icon-button";
export { ButtonGroup } from "./components/actions/button-group";
export type { ButtonGroupProps, ButtonGroupAlign } from "./components/actions/button-group";

// ---- Components: Forms -------------------------------------------------------
export { Input } from "./components/forms/input";
export type { InputProps } from "./components/forms/input";
export { PasswordInput } from "./components/forms/password-input";
export type { PasswordInputProps } from "./components/forms/password-input";
// India-specific identity inputs (UX4G 3.0 parity: Input - Aadhaar / OTP / Pan Card).
export { AadhaarInput } from "./components/forms/aadhaar-input";
export type { AadhaarInputProps } from "./components/forms/aadhaar-input";
export { OtpInput } from "./components/forms/otp-input";
export type { OtpInputProps } from "./components/forms/otp-input";
export { PanInput } from "./components/forms/pan-input";
export type { PanInputProps } from "./components/forms/pan-input";
export {
  digitsOnly,
  formatAadhaar,
  isValidAadhaar,
  isValidVerhoeff,
  maskAadhaar,
  formatPan,
  isValidPan,
  maskPan,
  panHolderType,
  PAN_HOLDER_TYPES,
} from "./utils/india-id";
export { Textarea } from "./components/forms/textarea";
export type { TextareaProps } from "./components/forms/textarea";
export { Select } from "./components/forms/select";
export type { SelectProps, SelectAppearance, SelectOption } from "./components/forms/select";
export { PasswordStrengthMeter, strengthFromScore } from "./components/forms/password-strength-meter";
export type { PasswordStrengthMeterProps, PasswordStrength } from "./components/forms/password-strength-meter";
export { CaptchaField } from "./components/forms/captcha-field";
export type { CaptchaFieldProps } from "./components/forms/captcha-field";
export { FormField } from "./components/forms/form-field";
export type { FormFieldProps, FormFieldControlProps } from "./components/forms/form-field";
export { Label } from "./components/forms/label";
export type { LabelProps } from "./components/forms/label";
export { Checkbox } from "./components/forms/checkbox";
export { Radio } from "./components/forms/radio";
export { Toggle } from "./components/forms/toggle";
export { Search } from "./components/forms/search";
export type { SearchProps, SearchSize, SearchSuggestion } from "./components/forms/search";
export { Chip } from "./components/forms/chip";
export { FormSection } from "./components/forms/form-section";
export type { FormSectionProps } from "./components/forms/form-section";
export { FormCard } from "./components/forms/form-card";
export type { FormCardProps } from "./components/forms/form-card";
export { Wizard, ReviewSection, ReviewItem } from "./components/forms/wizard";
export type { WizardProps } from "./components/forms/wizard";
export { MediaUpload } from "./components/forms/media-upload";
export type { MediaUploadProps } from "./components/forms/media-upload";
export { MediaGalleryInput } from "./components/forms/media-gallery-input";
export type { MediaGalleryInputProps, GalleryMediaItem, GalleryMediaType } from "./components/forms/media-gallery-input";
export { GeoPhotoInput } from "./components/forms/geo-photo-input";
export type { GeoPhotoInputProps, GeoPhoto, GeoPhotoSource } from "./components/forms/geo-photo-input";
export { DeclarationCheckbox } from "./components/forms/declaration-checkbox";
export type { DeclarationCheckboxProps } from "./components/forms/declaration-checkbox";

// ---- Components: Feedback ----------------------------------------------------
export { Alert } from "./components/feedback/alert";
export { Badge } from "./components/feedback/badge";
export type {
  BadgeProps,
  BadgeStatus,
  BadgeSize,
  BadgeEmphasis,
} from "./components/feedback/badge";
export { Loader } from "./components/feedback/loader";
export { Skeleton, SkeletonText, SkeletonRow } from "./components/feedback/skeleton";
export type { SkeletonProps } from "./components/feedback/skeleton";
export { Tooltip } from "./components/feedback/tooltip";
export type { TooltipProps, TooltipSide } from "./components/feedback/tooltip";
export { EmptyState } from "./components/feedback/empty-state";
export { SlaProgressIndicator } from "./components/feedback/sla-progress-indicator";
export type {
  SlaProgressIndicatorProps,
  SlaVariant,
} from "./components/feedback/sla-progress-indicator";
export {
  slaStatus,
  slaTone,
  slaSummary,
  slaValueText,
  slaConsumed,
  slaRemaining,
  slaFractionForRemaining,
  SLA_DEFAULT_THRESHOLDS,
} from "./utils/sla";
export type { SlaStatus, SlaThresholds, SlaInput } from "./utils/sla";
export { Stepper } from "./components/feedback/stepper";
export type { StepperProps, StepperStep } from "./components/feedback/stepper";
export { Tabs, TabPanel } from "./components/navigation/tabs";
export type {
  TabsProps,
  TabDef,
  TabIndicator,
  TabOrientation,
  TabSize,
  TabTrack,
} from "./components/navigation/tabs";
export { Modal } from "./components/feedback/modal";
export type { ModalProps, ModalSize } from "./components/feedback/modal";
export { SideSheet } from "./components/feedback/side-sheet";
export type { SideSheetProps, SideSheetSize } from "./components/feedback/side-sheet";
export { Lightbox } from "./components/feedback/lightbox";
export type { LightboxProps, LightboxItem, LightboxMediaType } from "./components/feedback/lightbox";
export { Chatbot } from "./components/feedback/chatbot";
export type {
  ChatbotProps,
  ChatbotMessage,
  ChatbotQuickReply,
  ChatbotReply,
} from "./components/feedback/chatbot";
export { ChatbotMascot } from "./components/feedback/chatbot-mascot";
export type { ChatbotMascotProps } from "./components/feedback/chatbot-mascot";
export { ToastProvider, useToast } from "./components/feedback/toast";
export type { ToastVariant } from "./components/feedback/toast";

// ---- Components: Data display ------------------------------------------------
export { Card, CardHeader, CardBody, CardFooter, CardTitle, CardSubtitle } from "./components/data-display/card";
export { Avatar } from "./components/data-display/avatar";
export { FactStrip } from "./components/data-display/fact-strip";
export type { FactStripProps, FactStripItem } from "./components/data-display/fact-strip";

export { MetricCard } from "./components/data-display/metric-card";
export type { MetricCardProps, MetricCardSize, MetricCardChange } from "./components/data-display/metric-card";
export { DataTable } from "./components/data-display/data-table";
export type { DataTableProps, DataTableColumn } from "./components/data-display/data-table";
// VisitorCounter — the footer's "Total Visits" figure. MOCK DATA by design:
// derived from a seeded baseline, not measured. See the component's own note.
export { VisitorCounter } from "./components/data-display/visitor-counter";
export type { VisitorCounterProps } from "./components/data-display/visitor-counter";
export { ApprovalTimeline } from "./components/data-display/approval-timeline";
export type {
  ApprovalTimelineProps,
  ApprovalTimelineEvent,
  ApprovalAction,
} from "./components/data-display/approval-timeline";
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
// What a card shows when it has nothing to draw — six reasons, one family,
// drawn in the chart vocabulary rather than borrowed from an icon set. And the
// loading placeholder that wears the shape of what is coming.
export { CardState } from "./components/dashboard/card-state";
export type { CardStateProps, CardStateKind } from "./components/dashboard/card-state";
export { CardSkeleton } from "./components/dashboard/card-skeleton";
export type { CardSkeletonProps, CardSkeletonShape } from "./components/dashboard/card-skeleton";
export { ChartExport } from "./components/dashboard/chart-export";
export type { ChartExportProps, ChartExportFormat } from "./components/dashboard/chart-export";
export {
  downloadPng,
  downloadSvg,
  downloadCsv,
  svgToPngBlob,
  serialiseSvg,
  tableToCsv,
} from "./components/data-display/charts/internal/export";
export { DashboardGrid } from "./components/dashboard/dashboard-grid";
export type { DashboardGridProps } from "./components/dashboard/dashboard-grid";
export { KpiRow } from "./components/dashboard/kpi-row";
export type { KpiRowProps } from "./components/dashboard/kpi-row";
export { FilterBar, SegmentedControl } from "./components/dashboard/filter-bar";
export type { FilterBarProps, SegmentedControlProps, SegmentedOption } from "./components/dashboard/filter-bar";

// ---- Components: Navigation --------------------------------------------------
// AccessibilityBar — the government top utility bar (UX4G / GIGW).
export { AccessibilityBar } from "./components/utilities/accessibility-bar";
export type {
  AccessibilityBarProps,
  AccessibilityBarLayout,
  AccessibilityBarDevice,
} from "./components/utilities/accessibility-bar";

// Navbar — SiteHeader (the SAMAVESH Navbar: Website + Portal variants, 3-tier).
export {
  SiteHeader,
  BrandLockup,
  AccountMenu,
} from "./components/navigation/header";
export {
  MenuToggle,
  SheetToggle,
  NavItemLink,
  NavDropdown,
  DropdownItem,
  MegaMenu,
  MegaMenuItem,
  NavSheet,
} from "./components/navigation/header";
export type {
  MenuToggleProps,
  SheetToggleProps,
  NavItemLinkProps,
  NavDropdownProps,
  DropdownItemProps,
  MegaMenuProps,
  MegaMenuItemProps,
  NavSheetProps,
} from "./components/navigation/header";

// Sidebar — portal app-shell left navigation (Figma: sidebar/type-1).
export { ContentNav } from "./components/navigation/content-nav";
export type {
  ContentNavProps,
  ContentNavGroup,
  ContentNavItem,
  ContentNavChild,
} from "./components/navigation/content-nav";

export { SidebarNav } from "./components/navigation/sidebar";
export { Pagination } from "./components/navigation/pagination";
export type { PaginationProps } from "./components/navigation/pagination";
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

// SiteFooter — the PUBLIC-WEBSITE footer: two bands, statutory content, DBIM
// 5.6 elements. Structural and slot-driven; content arrives as props. Distinct
// from `Footer` above, which is portal app-shell chrome.
export { SiteFooter } from "./components/navigation/site-footer";
export type {
  SiteFooterProps,
  SiteFooterLink,
  SiteFooterColumn,
  SiteFooterSocial,
  SiteFooterCredit,
} from "./components/navigation/site-footer";

// AppSwitcherPanel — the searchable cross-zone content, reused by DemoDock's
// Apps tab. The interactive component lives in a "use client" module. (The
// old standalone `AppSwitcher` FAB shell is superseded by `DemoDock` below
// and is no longer exported — see demo/demo-dock.tsx.)
export { AppSwitcherPanel } from "./components/navigation/app-switcher-panel";
export type { AppSwitcherPanelProps } from "./components/navigation/app-switcher-panel";
// Data, types and helpers come from the plain (server-safe) module so server
// components can read them directly.
export {
  DEFAULT_APPS,
  PORTAL_CATEGORIES,
  deriveAbbr,
  filterApps,
  matchActivePath,
} from "./components/navigation/app-switcher-utils";
export type { AppEntry } from "./components/navigation/app-switcher-utils";
// The runtime override layer over DEFAULT_APPS. Pure data + pure functions, so
// server components can import it from here — but the hub's middleware must
// import "@mosje/design-system/registry" instead, because this barrel pulls in
// React components and CSS that an edge bundle cannot carry.
export {
  REGISTRY_CONFIG_MAX_BYTES,
  REGISTRY_CONFIG_VERSION,
  applyRegistryOverrides,
  bucketKey,
  buildRegistryConfig,
  effectiveStatus,
  emptyRegistryConfig,
  hiddenEntries,
  matchHiddenEntry,
  parseRegistryConfig,
  serializeRegistryConfig,
  withDenseOrder,
} from "./components/navigation/registry-overrides";
export type {
  RegistryConfig,
  RegistryOverride,
  RegistryRowInput,
  RegistryStatus,
} from "./components/navigation/registry-overrides";

// ---- Components: Auth (login shells & page templates) -----------------------
// Full-page login layout shared across all MoSJE portals. Only the slot
// content changes per portal (logo paths, signing-into name, tabs, form).
export { SectionTitle } from "./components/layout/section";
export type { SectionTitleProps } from "./components/layout/section";

// ---- Components: Layout (the page skeleton) ---------------------------------
// Primitives compose the content column; templates compose the page. All are
// presentational — no store, no router, no redirect. See the Layout page in the
// Figma library for the fixed / hug / fill contract these implement.
export { Divider } from "./components/layout/divider";
export type { DividerProps, DividerOrientation, DividerTone } from "./components/layout/divider";
export { Container } from "./components/layout/container";
export type { ContainerProps, ContainerSize } from "./components/layout/container";
export { Grid, GridItem } from "./components/layout/grid";
export type { GridProps, GridItemProps, GridSpan } from "./components/layout/grid";
export { Band } from "./components/layout/band";
export type { BandProps, BandTone, BandSpacing } from "./components/layout/band";
export { PageHeader } from "./components/layout/page-header";
export type { PageHeaderProps } from "./components/layout/page-header";
export { AppShell } from "./components/layout/app-shell";
export type { AppShellProps } from "./components/layout/app-shell";
export { SiteLayout } from "./components/layout/site-layout";
export type { SiteLayoutProps } from "./components/layout/site-layout";
export { PortalLoginShell } from "./components/auth/portal-login-shell";
export type {
  PortalLoginShellProps,
  PortalLoginTab,
} from "./components/auth/portal-login-shell";
export { PortalLoginTemplate } from "./components/auth/portal-login-template";
export type { PortalLoginTemplateProps } from "./components/auth/portal-login-template";
export type {
  PortalLoginConfig,
  PortalRoleTab as PortalConfigRoleTab,
  PortalAuthMode,
  PortalAudience,
  PortalBrandAssets,
  LoginSubmitPayload,
} from "./components/auth/types";
// Auth parts — the pieces every portal login is assembled from. Mirrors the
// `Auth / *` component sets in the SAMAVESH Figma library.
export {
  AuthDivider,
  ConsentLine,
  ResendTimer,
  MaskedContactRow,
  SSOButton,
  AccountPrompt,
  SigningIntoBar,
} from "./components/auth/auth-parts";
export type {
  AuthDividerProps,
  ConsentLineProps,
  ResendTimerProps,
  MaskedContactRowProps,
  SSOButtonProps,
  AccountPromptProps,
  AccountPromptOption,
  SigningIntoBarProps,
} from "./components/auth/auth-parts";

// ---- Components: Accessibility -----------------------------------------------
// CANONICAL: the official Government of India (MeitY / UX4G) accessibility widget.
// Use this across the estate — WCAG + GIGW + IS 17802 compliant.
export {
  UX4GAccessibilityWidget,
  UX4G_A11Y_WIDGET_SRC,
} from "./components/utilities/ux4g-accessibility-widget";
export type { UX4GAccessibilityWidgetProps } from "./components/utilities/ux4g-accessibility-widget";
export { LiveRegion, useLiveRegion } from "./components/utilities/live-region";
export type { LiveRegionProps, UseLiveRegionResult } from "./components/utilities/live-region";


// =============================================================================
// DEMO-ONLY — Review & development tooling (NOT for production builds)
// `DemoFab` is guarded per usage (devMode={process.env.NODE_ENV === "development"}).
// `DemoDock` — the single floating dock that replaces every per-page DemoFab —
// is guarded estate-wide by NEXT_PUBLIC_DEMO_TOOLS (see apps/hub's
// ConditionalDemoDock): defaults ON, set to "false" to hide it on a
// genuinely public deployment.
// These live in packages/design-system/demo/ and are separate from the core DS.
// =============================================================================
export { DemoFab } from "./demo";
export type { DemoAccount, DemoFabProps, DemoFillDetail } from "./demo";
export {
  DemoAccountsPanel,
  DemoDock,
  FlaskIcon,
  DEMO_ACCOUNTS,
  findDemoAccounts,
  isLoginRoute,
} from "./demo";
export type {
  DemoAccountsPanelProps,
  DemoDockProps,
  DemoDockTab,
  FlaskIconProps,
  DemoAccountSet,
} from "./demo";

// New components added from public website patterns
export { Accordion, AccordionItem } from "./components/data-display/accordion";
export type { AccordionItemProps } from "./components/data-display/accordion";

export { VerticalTimeline, VerticalTimelineItem } from "./components/data-display/vertical-timeline";
export type { VerticalTimelineItemProps } from "./components/data-display/vertical-timeline";

export { ProfileCard } from "./components/data-display/profile-card";
export type { ProfileCardProps } from "./components/data-display/profile-card";

export { ActionBanner } from "./components/feedback/action-banner";
export type { ActionBannerProps, ActionBannerVariant } from "./components/feedback/action-banner";
export { Ticker } from "./components/feedback/ticker";
export type { TickerProps, TickerItem, TickerOrientation, TickerHeight } from "./components/feedback/ticker";
