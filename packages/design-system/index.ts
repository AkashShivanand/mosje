// Tokens
export * from "./tokens";
export { default as tokens } from "./tokens";
export { cn } from "./cn";

// Color-mode (brand axis) — core helpers + React provider/switcher.
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
} from "./color-mode";
export {
  ColorModeProvider,
  useColorMode,
  type ColorModeProviderProps,
} from "./components/color-mode-provider";
export {
  ColorModeSwitcher,
  type ColorModeSwitcherProps,
} from "./components/color-mode-switcher";

// Components (atoms aligned to the UX4G Figma DS)
export { Button, buttonClasses } from "./components/button";
export type { ButtonVariant, ButtonAppearance, ButtonSize } from "./components/button";
export { Card, CardHeader, CardBody, CardFooter, CardTitle, CardSubtitle } from "./components/card";
export { Badge } from "./components/badge";
export { Chip } from "./components/chip";
export { Checkbox } from "./components/checkbox";
export { Radio } from "./components/radio";
export { Toggle } from "./components/toggle";
export { Search } from "./components/search";
export { Input } from "./components/input";
export type { InputProps } from "./components/input";
export { Textarea } from "./components/textarea";
export type { TextareaProps } from "./components/textarea";
export { Select } from "./components/select";
export type { SelectProps, SelectOption } from "./components/select";
export { FormField } from "./components/form-field";
export type { FormFieldProps, FormFieldControlProps } from "./components/form-field";
export { Alert } from "./components/alert";
export { Loader } from "./components/loader";
export { EmptyState } from "./components/empty-state";
export { Avatar } from "./components/avatar";
export { AccessibilityWidget } from "./components/accessibility-widget";
// The interactive component lives in a "use client" module.
export { AppSwitcher, ZoneSwitcher } from "./components/zone-switcher";
export type { AppSwitcherProps, ZoneSwitcherProps } from "./components/zone-switcher";
// Data, types and helpers come from the plain (server-safe) module so server
// components can read them directly — re-exporting these through the client
// module above would turn them into client references on the server.
export {
  DEFAULT_APPS,
  DEFAULT_APPS as DEFAULT_ZONES,
  PORTAL_CATEGORIES,
  deriveAbbr,
  filterApps,
  matchActivePath,
} from "./components/app-switcher-utils";
export type {
  AppEntry,
  AppEntry as Zone,
} from "./components/app-switcher-utils";
