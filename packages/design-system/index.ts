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
  defaultColorModeForPath,
  hasChosenColorMode,
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
// Material Symbols Rounded, weight 300 — the official icon system for all MoSJE apps.
// Load the font once in your app root: import "@mosje/design-system/icons.css"
export { BackToTop } from "./components/utilities/back-to-top";
export type { BackToTopProps } from "./components/utilities/back-to-top";
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
export { Menu } from "./components/actions/menu";
export { SplitButton } from "./components/actions/split-button";
export type { SplitButtonProps } from "./components/actions/split-button";
export type {
  MenuEntry,
  MenuItem,
  MenuItemKind,
  MenuItemTone,
  MenuProps,
  MenuSeparator,
} from "./components/actions/menu";
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
export { BotCheck } from "./components/forms/bot-check";
export type { BotCheckProps, BotCheckMode, BotCheckStatus } from "./components/forms/bot-check";
export { useBotCheck } from "./components/forms/use-bot-check";
export type { BotCheckToken, UseBotCheckOptions, UseBotCheckResult } from "./components/forms/use-bot-check";
export type { CaptchaFieldProps } from "./components/forms/captcha-field";
export { RadioGroup, CheckboxGroup } from "./components/forms/control-group";
export type { RadioGroupProps, CheckboxGroupProps, ControlGroupOption } from "./components/forms/control-group";
export { ErrorSummary } from "./components/forms/error-summary";
export type { ErrorSummaryProps, ErrorSummaryItem } from "./components/forms/error-summary";
export { FormField } from "./components/forms/form-field";
export type { FormFieldProps, FormFieldControlProps } from "./components/forms/form-field";
export type { FormFieldCharacterCount } from "./components/forms/form-field";
export type { FormFieldClassNames } from "./components/forms/form-field";
export {
  FieldPolicyProvider,
  RequiredFieldsLegend,
  useFieldCopy,
  useFieldPolicy,
} from "./components/forms/field-policy";
export type {
  FieldPolicy,
  FieldPolicyProviderProps,
  NecessityIndicator,
  RequiredFieldsLegendProps,
} from "./components/forms/field-policy";
export { DEFAULT_FIELD_COPY, resolveFieldCopy } from "./components/forms/field-copy";
export type { FieldCopy, FieldCopyOverride } from "./components/forms/field-copy";
export {
  FieldHelp,
  FieldHelpToggle,
  FieldHint,
  FieldLabel,
  FieldMessage,
  useFieldIds,
} from "./components/forms/field-parts";
export type {
  FieldHelpProps,
  FieldHelpToggleProps,
  FieldHintProps,
  FieldIds,
  FieldLabelProps,
  FieldMessageProps,
  FieldPart,
} from "./components/forms/field-parts";
export { CharacterCount, countCharacters } from "./components/forms/character-count";
export type { CharacterCountProps } from "./components/forms/character-count";
export { resolveFieldStatus } from "./components/forms/field-types";
export type {
  AutocompleteFieldName,
  AutocompleteToken,
  FieldSize,
  FieldStatus,
} from "./components/forms/field-types";
export { Label } from "./components/forms/label";
export type { LabelProps } from "./components/forms/label";
export { Checkbox } from "./components/forms/checkbox";
export type { CheckboxProps } from "./components/forms/checkbox";
export { Radio } from "./components/forms/radio";
export type { RadioProps } from "./components/forms/radio";
export type { SelectionSize, SelectionLabelPlacement, SelectionVariant, SelectionCardLayout, CheckboxState } from "./components/forms/selection-types";
export { Toggle } from "./components/forms/toggle";
export { RangeSlider, Slider } from "./components/forms/slider";
export { BiometricCapture } from "./components/forms/biometric-capture";
export type {
  BiometricCaptureProps,
  BiometricModality,
  BiometricState,
} from "./components/forms/biometric-capture";
export { NumberInput } from "./components/forms/number-input";
export type { NumberInputProps } from "./components/forms/number-input";
export { TimePicker } from "./components/forms/time-picker";
export type { TimePickerProps } from "./components/forms/time-picker";
export { TimeSlot } from "./components/forms/time-slot";
export type {
  TimeSlotGroup,
  TimeSlotOption,
  TimeSlotProps,
} from "./components/forms/time-slot";
export type {
  RangeSliderProps,
  SliderMark,
  SliderProps,
} from "./components/forms/slider";
export type { ToggleProps, ToggleSize } from "./components/forms/toggle";
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
export { FeedbackWidget } from "./components/feedback/feedback-widget";
export type {
  FeedbackSubmission,
  FeedbackVerdict,
  FeedbackWidgetProps,
} from "./components/feedback/feedback-widget";
export { Popover } from "./components/feedback/popover";
export type { PopoverApi, PopoverProps } from "./components/feedback/popover";
export { EmptyState } from "./components/feedback/empty-state";
export { ErrorView } from "./components/feedback/error-view";
export type {
  ErrorViewProps,
  ErrorViewKind,
  WayfindingLink,
} from "./components/feedback/error-view";
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
export { DescriptionList } from "./components/data-display/description-list";
export type {
  DescriptionItem,
  DescriptionListProps,
} from "./components/data-display/description-list";
export { BulkActionsBar } from "./components/data-display/bulk-actions-bar";
export type { BulkAction, BulkActionsBarProps } from "./components/data-display/bulk-actions-bar";
export { Carousel } from "./components/data-display/carousel";
export { FileList } from "./components/data-display/file-list";
export type { FileItem, FileListProps, FileState } from "./components/data-display/file-list";
export type { CarouselProps } from "./components/data-display/carousel";
export { Figure } from "./components/data-display/figure";
export type { FigureProps, FigureRatio } from "./components/data-display/figure";
export { ScheduleGrid } from "./components/data-display/schedule-grid";
export type { ScheduleGridProps, ScheduleEntry, ScheduleAxis } from "./components/data-display/schedule-grid";
export { VideoTile } from "./components/data-display/video-tile";
export type { VideoTileProps, VideoTileState } from "./components/data-display/video-tile";
export { SignaturePad } from "./components/forms/signature-pad";
export type { SignaturePadProps, SignatureValue } from "./components/forms/signature-pad";
export { CookieConsent } from "./components/feedback/cookie-consent";
export type { CookieConsentProps, CookieCategory } from "./components/feedback/cookie-consent";
export { Tree } from "./components/data-display/tree";
export type { TreeProps, TreeNode } from "./components/data-display/tree";
export { TransferList } from "./components/data-display/transfer-list";
export type { TransferListProps, TransferItem } from "./components/data-display/transfer-list";
export { EventList } from "./components/data-display/event-list";
export type { EventListProps, EventItem, EventTone } from "./components/data-display/event-list";
export { CommentThread } from "./components/data-display/comment-thread";
export type { CommentThreadProps, ThreadComment } from "./components/data-display/comment-thread";
export { NotificationCentre } from "./components/data-display/notification-centre";
export type { NotificationCentreProps } from "./components/data-display/notification-centre";
export { ListGroup, ListRow } from "./components/data-display/list-group";
export type {
  ListGroupProps,
  ListRowProps,
} from "./components/data-display/list-group";
export { Avatar } from "./components/data-display/avatar";
export { FactStrip } from "./components/data-display/fact-strip";
export { DocumentLibrary } from "./components/data-display/document-library";
export type {
  DocumentLibraryProps,
  DocumentLibraryItem,
} from "./components/data-display/document-library";
export type { FactStripProps, FactStripItem } from "./components/data-display/fact-strip";

export { MetricCard } from "./components/data-display/metric-card";
export type {
  MetricCardProps,
  MetricCardSize,
  MetricCardChange,
  MetricCardProgress,
} from "./components/data-display/metric-card";
// ---- Forms: FilterSelect ----------------------------------------------------
// The compact dashboard filter, as a real listbox. `Select` remains the answer
// for a FORM field — it is a native `<select>`, which every assistive technology
// and every mobile keyboard already knows. This is for a dashboard filter row,
// where four portals hand-rolled a button-plus-listbox because a native select
// cannot carry a hint beside an option or be styled at all on iOS.
export { DateRangePicker } from "./components/forms/date-range-picker";
export type { DateRangePickerProps, DateRange, DateRangePreset } from "./components/forms/date-range-picker";
export { InlineEdit } from "./components/forms/inline-edit";
export type { InlineEditProps } from "./components/forms/inline-edit";
export { DatePicker } from "./components/forms/date-picker";
export type { DatePickerProps } from "./components/forms/date-picker";
export { Combobox } from "./components/forms/combobox";
export type { ComboboxProps, ComboboxOption } from "./components/forms/combobox";
export { FilterSelect } from "./components/forms/filter-select";
export type { FilterSelectProps, FilterSelectOption } from "./components/forms/filter-select";

export { DataTable } from "./components/data-display/data-table";
export type {
  DataTableProps,
  DataTableColumn,
  DataTableSort,
} from "./components/data-display/data-table";
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
  IndiaBubbleMap,
  IndiaPointMap,
  INDIA_STATE_BOXES,
  projectIndia,
  repairIndiaCoordinate,
  binIndiaPoints,
  normalizeRegionName,
  hexCenter,
  hexPath,
  hexAt,
  median,
  INDIA_HEX_RADIUS,
  INDIA_LAT_RANGE,
  INDIA_LON_RANGE,
  Legend,
  useChartTooltip,
  ChartTooltip,
  categoricalColor,
  sequentialColor,
  divergingColor,
  formatIndian,
  formatCompact,
  formatPercent,
  CHART_CATEGORICAL_SAFE_CAP,
  BulletChart,
  SmallMultiples,
  texturedColor,
  CHART_TEXTURE_COUNT,
  RankedBarList,
  InlineBar,
  withheldLabel,
} from "./components/data-display/charts";
// RankedBarList (above) is the most-drawn chart in the portal handoffs — a label,
// a figure and a thin bar per row — and InlineBar is its bar alone, for a table
// cell. withheldLabel is a resolver: the spoken form of a withheld figure. The
// comment sits OUTSIDE the export block because the Storybook gates split that
// block on commas and would read a comment as a name.
export type {
  ChartDatum,
  ChartSeries,
  ChartMultiSeries,
  ChartTable,
  ChartWithheld,
  ChartWithheldKind,
  DataProvenance,
  StatusTone,
  RankedBarListProps,
  RankedBarItem,
  InlineBarProps,
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
  IndiaBubbleMapProps,
  IndiaPointMapProps,
  MapPin,
  MapBubble,
  PinKindStyle,
  RegionBox,
  HexBin,
  RepairedCoordinate,
  CoordinateVerdict,
  IndiaBubbleDatum,
  LegendItem,
  ValueFormat,
  BulletChartProps,
  BulletRow,
  SmallMultiplesProps,
} from "./components/data-display/charts";

// ---- Components: Dashboard composition ---------------------------------------
export { ChartCard } from "./components/dashboard/chart-card";
export type { ChartCardProps } from "./components/dashboard/chart-card";
// Source · as of · status — the one line of self-description a card may carry.
export { ProvenanceLine, formatAsOf } from "./components/dashboard/provenance";
export type { ProvenanceLineProps } from "./components/dashboard/provenance";
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
export { SAMAVESH_COBRAND } from "./components/navigation/header/samavesh-cobrand";
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

// Link — text that takes the reader somewhere. A link changes location; a button
// performs an action. Added 2026-09-03; before it, 194 hand-rolled brand-coloured
// anchors each decided their own colour, underline, focus ring and new-tab handling.
export { LanguageSwitcher } from "./components/navigation/language-switcher";
export type { LanguageSwitcherProps, LanguageOption } from "./components/navigation/language-switcher";
export { Link } from "./components/navigation/link";
export type { LinkProps, LinkVariant, LinkSize, LinkTone } from "./components/navigation/link";

// Sidebar — portal app-shell left navigation (Figma: SAMAVESH › Sidebar, 4286:428).
export { ContentNav } from "./components/navigation/content-nav";
export type {
  ContentNavProps,
  ContentNavGroup,
  ContentNavItem,
  ContentNavChild,
} from "./components/navigation/content-nav";

export { SidebarNav } from "./components/navigation/sidebar";
// Breadcrumb — where a page, or a drilled-in view, sits in the hierarchy.
export { Breadcrumb } from "./components/navigation/breadcrumb";
export type { BreadcrumbProps, BreadcrumbItem } from "./components/navigation/breadcrumb";
export { Pagination } from "./components/navigation/pagination";
export type { PaginationProps, PaginationSize } from "./components/navigation/pagination";
export type {
  SidebarNavProps,
  SidebarNavGroup,
  SidebarNavItem,
  SidebarNavChild,
  SidebarNavLeaf,
  SidebarNavIdentity,
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
  isLiveEntry,
  liveEntries,
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

// ---- Components: Text primitives ------------------------------------------
// Heading binds an h1–h6 to one of the 21 type roles (the role defaults from the
// level); Text binds a run of copy to a body, label or title role. Neither sets a
// size, leading, tracking or weight of its own — the tokens do — so they are the
// same on every surface and are the only way a page should ask for type.
export { Heading, Text } from "./components/layout/text";
export type {
  HeadingProps,
  HeadingLevel,
  TextProps,
  TextElement,
  TextTone,
  TypeRole,
  DisplayRole,
  HeadlineRole,
  TitleRole,
  BodyRole,
  LabelRole,
} from "./components/layout/text";

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
export { SitePageHeader } from "./components/layout/site-page-header";
export type { SitePageHeaderProps } from "./components/layout/site-page-header";
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
// The login form column, and the interchangeable stacks that fill its one slot.
// Seven of the card's eight regions are the same whatever a portal signs in
// with, so the credential mode is a SLOT rather than a variant axis — see
// `auth-form-card.tsx` for what that replaced and why.
// The list of portals inside the change-portal picker. There is deliberately no
// `PortalPicker` component: the picker is `SideSheet` + this, and a third name
// for that composition would add a word without adding a decision.
export { PortalList } from "./components/auth/portal-list";
export type { PortalListProps } from "./components/auth/portal-list";
export { AuthFormCard } from "./components/auth/auth-form-card";
export type { AuthFormCardProps } from "./components/auth/auth-form-card";
export {
  PasswordFields,
  PinFields,
  DarpanFields,
  IdentifierFields,
  OtpRequestFields,
  OtpVerifyFields,
} from "./components/auth/credential-fields";
export type {
  PasswordFieldsProps,
  PinFieldsProps,
  DarpanFieldsProps,
  IdentifierFieldsProps,
  OtpRequestFieldsProps,
  OtpVerifyFieldsProps,
} from "./components/auth/credential-fields";

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

/* ── Restored 2026-08-31 ──────────────────────────────────────────────────────
 * These exports belong to the SamaveshBanner / OrgLogo / PortalCard work in
 * progress on `feat/samavesh-banner`. They were overwritten in this working
 * tree by a parallel session copying its own barrel over this file, and are
 * reinstated here from the modules' own public surface and from every name the
 * estate actually imports — not from memory.
 *
 * If the shape below is not what that work intended, it is this block that is
 * wrong, not the modules.
 * ------------------------------------------------------------------------- */
export { SamaveshBanner, DEFAULT_SAMAVESH_PORTALS } from "./components/navigation/samavesh-banner";
export type { SamaveshBannerProps } from "./components/navigation/samavesh-banner";
export { OrgLogo } from "./components/brand/org-logo";
export type { OrgLogoProps, OrgLogoSize } from "./components/brand/org-logo";
export {
  ORG_LOGOS,
  ORG_LOGO_FALLBACK,
  PORTAL_ORG_LOGOS,
  SAMAVESH_MARK,
  SAMAVESH_MARK_VECTOR,
  NATIONAL_EMBLEM,
  NATIONAL_EMBLEM_INVERSE,
  orgLogoSrc,
  portalLogoSrc,
} from "./components/brand/org-logo-registry";
export type { OrgSlug } from "./components/brand/org-logo-registry";

// ---- Brand: Illustration ----------------------------------------------------
// The estate's own drawn language — one 64x48 geometry at three tiers, four
// tokenised ink layers, and no depicted people. The reasoning is in
// components/brand/illustration/language.ts and it is worth reading before
// adding a scene.
//
// THE PRIMITIVES ARE DELIBERATELY NOT EXPORTED HERE. `Bars`, `Ground`, `Lens`,
// `Ring`, `Seat`, `Series`, `Sheet`, `Shut` and `Signal` are how a SCENE is
// assembled inside this module, not how a portal draws. Putting them in the
// public barrel would drop nine of the most generic nouns in the language into
// the estate's global namespace — `Series` beside the charts' own series
// vocabulary, `Sheet` beside `SideSheet` — and this repository has already been
// bitten by exactly that: `SiteHeader`, `SiteFooter` and `SidebarNav` each name
// two different components today, so an import auto-complete resolves to the
// wrong one silently. A new scene is added to `scenes.tsx`, which is where the
// primitives are in scope.
export { Illustration, illustrationAlt, SCENE_NAMES } from "./components/brand/illustration";
export type {
  IllustrationProps,
  IllustrationTier,
  SceneName,
} from "./components/brand/illustration";
export { PortalCard } from "./components/navigation/portal-card";
export type { PortalCardProps, PortalCardVariant } from "./components/navigation/portal-card";
export {
  PORTAL_LABELS,
  portalLabel,
  portalSummary,
  portalCategoriesIn,
} from "./components/navigation/app-switcher-utils";
export type { PortalCategory } from "./components/navigation/app-switcher-utils";
export { portalLoginUrl } from "./components/auth/portal-login-url";

// ---- Components: Screen templates (Tier A + Tier B) -------------------------
// The layer above components. `PortalPage` is the chrome; each `*Screen` is one
// page archetype that takes a descriptor and OWNS the seven states of
// `.claude/rules/data-state-completeness.md` by construction.
//
// It exists because the estate had 132 components and no template layer: 265
// portal pages, `PageHeader` used in ZERO of them, `AppShell` in zero, sixteen
// hand-rolled shells, and 236 of 265 pages handling none of loading, empty or
// error. A rule people must remember is a rule 89% of pages break; a shape they
// cannot avoid is not.
//
// Catalogue and the decision table that picks between them:
// docs/design-system/screen-templates.md
export { PortalPage, navForRole } from "./components/templates/portal-page";
export type {
  PortalPageProps,
  PortalRole,
  PortalNavItem,
  PortalNavGroup,
} from "./components/templates/portal-page";
export { ScreenBody } from "./components/templates/screen-body";
export type { ScreenBodyProps, SkeletonShape } from "./components/templates/screen-body";
export { resolveScreenState, screenCopy, DEFAULT_SCREEN_COPY } from "./components/templates/screen-state";
export type {
  ScreenStatus,
  ScreenStateInput,
  ScreenStateCopy,
} from "./components/templates/screen-state";
export { WorklistScreen } from "./components/templates/worklist-screen";
export type { WorklistScreenProps, WorklistColumn } from "./components/templates/worklist-screen";
export { RecordScreen } from "./components/templates/record-screen";
export type { RecordScreenProps, RecordTab, RecordFact } from "./components/templates/record-screen";
export { WizardScreen } from "./components/templates/wizard-screen";
export type { WizardScreenProps, WizardDraft } from "./components/templates/wizard-screen";
export { OverviewScreen } from "./components/templates/overview-screen";
export type { OverviewScreenProps } from "./components/templates/overview-screen";
