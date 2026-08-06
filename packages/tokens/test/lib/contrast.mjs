// WCAG 2.1 contrast maths + the load-bearing token pairings, shared by the brand gate
// (brand-contrast.test.mjs) and the mode/theme sweep (mode-contrast.test.mjs).

export function hexToRgb(h) {
  h = h.trim().replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function relLum([r, g, b]) {
  const f = (c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  const [R, G, B] = [f(r), f(g), f(b)];
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

export function contrast(a, b) {
  const l1 = relLum(hexToRgb(a));
  const l2 = relLum(hexToRgb(b));
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Load-bearing pairings a brand swap — or a colour mode — can break.
 * min = WCAG 2.1 AA threshold (4.5 for text, 3.0 for UI element / large text).
 */
export const PAIRINGS = [
  { fg: "--ds-on-primary", bg: "--ds-primary", min: 4.5, label: "button label on primary" },
  // Hover is not exempt: WCAG 1.4.3 applies to text in every state, and a primary button
  // whose label washes out on hover fails for exactly the readers it matters most for.
  { fg: "--ds-on-primary", bg: "--ds-primary-hover", min: 4.5, label: "button label on primary (hover)" },
  { fg: "--ds-ink", bg: "--ds-surface", min: 4.5, label: "body text on surface" },
  { fg: "--ds-ink-muted", bg: "--ds-surface", min: 4.5, label: "muted text on surface" },
  { fg: "--ds-primary", bg: "--ds-surface", min: 3.0, label: "primary as link/UI on surface" },
  // Status text on its own tonal chip — the badge/pill pairings used across every portal's
  // status indicators. All four shipped below AA until 2026-08: the ramp step for the
  // foreground had been chosen for the solid fill, not for the tonal pairing.
  { fg: "--ds-success", bg: "--ds-success-tonal", min: 4.5, label: "success badge text on success tonal" },
  { fg: "--ds-warning", bg: "--ds-warning-tonal", min: 4.5, label: "warning badge text on warning tonal" },
  { fg: "--ds-danger", bg: "--ds-danger-tonal", min: 4.5, label: "danger badge text on danger tonal" },
  { fg: "--ds-info", bg: "--ds-info-tonal", min: 4.5, label: "info badge text on info tonal" },
];
