// The load-bearing token pairings, shared by the brand gate (brand-contrast.test.mjs) and
// the mode sweep (mode-contrast.test.mjs).
//
// The WCAG maths itself moved to build/wcag.mjs, because the Figma exporter now measures a
// token before publishing a contrast class for it and a build step must not import from the
// test tree. Re-exported here so every existing caller is unchanged and there is still
// exactly ONE implementation — two copies drifting apart is how a gate starts disagreeing
// with the artifact it is meant to be checking.
export { hexToRgb, relLum, contrast } from "../../build/wcag.mjs";

/**
 * Load-bearing pairings a brand swap — or a colour mode — can break.
 * min = WCAG 2.1 AA threshold (4.5 for text, 3.0 for UI element / large text).
 */
export const PAIRINGS = [
  { fg: "--sa-color-text-onPrimary", bg: "--sa-color-action-primary-default", min: 4.5, label: "button label on primary" },
  // Hover is not exempt: WCAG 1.4.3 applies to text in every state, and a primary button
  // whose label washes out on hover fails for exactly the readers it matters most for.
  { fg: "--sa-color-text-onPrimary", bg: "--sa-color-action-primary-hover", min: 4.5, label: "button label on primary (hover)" },
  { fg: "--sa-color-text-default", bg: "--sa-bg-neutral-base", min: 4.5, label: "body text on surface" },
  { fg: "--sa-color-text-muted", bg: "--sa-bg-neutral-base", min: 4.5, label: "muted text on surface" },
  { fg: "--sa-color-action-primary-default", bg: "--sa-bg-neutral-base", min: 3.0, label: "primary as link/UI on surface" },
  // Status text on its own tonal chip — the badge/pill pairings used across every portal's
  // status indicators. All four shipped below AA until 2026-08: the ramp step for the
  // foreground had been chosen for the solid fill, not for the tonal pairing.
  { fg: "--sa-color-status-success", bg: "--sa-color-status-successTonal", min: 4.5, label: "success badge text on success tonal" },
  { fg: "--sa-color-status-warning", bg: "--sa-color-status-warningTonal", min: 4.5, label: "warning badge text on warning tonal" },
  { fg: "--sa-color-status-danger", bg: "--sa-color-status-dangerTonal", min: 4.5, label: "danger badge text on danger tonal" },
  { fg: "--sa-color-status-info", bg: "--sa-color-status-infoTonal", min: 4.5, label: "info badge text on info tonal" },
];
