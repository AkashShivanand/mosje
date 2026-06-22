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

// ---- Components: Feedback ----------------------------------------------------
export { Alert } from "./components/feedback/alert";
export { Badge } from "./components/feedback/badge";
export { Loader } from "./components/feedback/loader";
export { EmptyState } from "./components/feedback/empty-state";

// ---- Components: Data display ------------------------------------------------
export { Card, CardHeader, CardBody, CardFooter, CardTitle, CardSubtitle } from "./components/data-display/card";
export { Avatar } from "./components/data-display/avatar";
export { MetricCard } from "./components/data-display/metric-card";
export type { MetricCardProps, MetricCardSize, MetricCardChange } from "./components/data-display/metric-card";

// ---- Components: Navigation --------------------------------------------------
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

// ---- Components: Accessibility -----------------------------------------------
export { AccessibilityWidget } from "./components/a11y/accessibility-widget";


// =============================================================================
// DEMO-ONLY — Review & development tooling (NOT for production builds)
// Guard every usage: devMode={process.env.NODE_ENV === "development"}
// These live in packages/design-system/demo/ and are separate from the core DS.
// =============================================================================
export { DemoFab } from "./demo";
export type { DemoAccount, DemoFabProps, DemoFillDetail } from "./demo";
