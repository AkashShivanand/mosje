/* Canonical token source is now @mosje/tokens (DTCG → Style Dictionary), which generates
   tokens.css. This typed mirror is retained for the stable named-export API
   (colors/radius/typography/…) used by existing consumers, and is reconciled with the
   generated @mosje/tokens/ts shape in Plan 2 (atom migration). Keep values in sync. */
export const colors = {
  primary: "#0373df",
  primaryTonal: "#c6dcf9",
  primaryDark: "#014b92",
  primaryRing: "rgba(3, 115, 223, 0.48)",
  success: "#2e7d32",
  successTonal: "#c8e6c9",
  danger: "#ec5042",
  warning: "#ffd323",
  info: "#0373df",
  ink: "#212121",
  inkStrong: "#1f2428",
  inkMuted: "#343a40",
  onPrimary: "#ffffff",
  surface: "#ffffff",
  surfaceMuted: "#f8f9fa",
  surfaceAlt: "#f4f3f9",
  border: "#f1f3f5",
  borderStrong: "#e2e6ea",
  saffron: "#f97316",
  saffronLight: "#ffedd5",
  saffronDark: "#7c3503",
  govNavy: "#003366",
  govYellow: "#ffd323",
} as const;

export const radius = {
  xxs: "2px",
  xs: "4px",
  sm: "6px",
  md: "8px",
  pill: "100px",
} as const;

export const fontFamily = {
  sans: "\"Noto Sans\", ui-sans-serif, system-ui, sans-serif",
} as const;

/** Named type styles. */
export const typography = {
  display: { size: "48px", leading: "56px", weight: 500, tracking: "0" },
  title1: { size: "22px", leading: "28px", weight: 500, tracking: "0" },
  headline: { size: "20px", leading: "24px", weight: 600, tracking: "0" },
  title2: { size: "16px", leading: "24px", weight: 500, tracking: "0.15px" },
  body1: { size: "16px", leading: "24px", weight: 400, tracking: "0.5px" },
  body2: { size: "14px", leading: "20px", weight: 400, tracking: "0.25px" },
  body3: { size: "12px", leading: "16px", weight: 400, tracking: "0.4px" },
  label1: { size: "14px", leading: "20px", weight: 500, tracking: "0.1px" },
  label3: { size: "11px", leading: "16px", weight: 500, tracking: "0.5px" },
} as const;

export const shadow = {
  xs: "0 2px 3px 1px rgba(33, 33, 33, 0.12)",
  lg: "0 12px 16px -4px rgba(33, 33, 33, 0.08), 0 4px 6px -2px rgba(33, 33, 33, 0.03)",
  xl: "0 24px 48px -12px rgba(33, 33, 33, 0.18)",
} as const;

export const tokens = { colors, radius, fontFamily, typography, shadow } as const;
export default tokens;
