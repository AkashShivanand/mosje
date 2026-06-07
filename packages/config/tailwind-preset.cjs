/**
 * MoSJE Tailwind v3 preset (for portals).
 * Pairs with `@mosje/design-system/tokens.css` — import that in the portal's globals so the
 * CSS variables resolve. This preset just maps Tailwind utility names to those variables,
 * keeping a single source of truth for values.
 *
 * Usage in a portal's tailwind.config.ts:
 *   import preset from "@mosje/config/tailwind-preset";
 *   export default { presets: [preset], content: [...] };
 */
module.exports = {
  theme: {
    extend: {
      colors: {
        "gov-blue": "var(--ds-primary)",
        "gov-blue-dark": "var(--ds-primary-dark)",
        "gov-navy": "var(--ds-gov-navy)",
        primary: "var(--ds-primary)",
        "primary-tonal": "var(--ds-primary-tonal)",
        success: "var(--ds-success)",
        "success-tonal": "var(--ds-success-tonal)",
        danger: "var(--ds-danger)",
        warning: "var(--ds-warning)",
        saffron: "var(--ds-saffron)",
        "saffron-light": "var(--ds-saffron-light)",
        "saffron-dark": "var(--ds-saffron-dark)",
        "gov-yellow": "var(--ds-gov-yellow)",
        ink: "var(--ds-ink)",
        "ink-muted": "var(--ds-ink-muted)",
        surface: "var(--ds-surface)",
        "surface-muted": "var(--ds-surface-muted)",
        "surface-alt": "var(--ds-surface-alt)",
        "border-ds": "var(--ds-border)",
        "border-strong": "var(--ds-border-strong)",
      },
      borderRadius: {
        xs: "var(--ds-radius-xs)",
        sm: "var(--ds-radius-sm)",
        md: "var(--ds-radius-md)",
        pill: "var(--ds-radius-pill)",
      },
      fontFamily: {
        sans: ["Noto Sans", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "ds-xs": "var(--ds-shadow-xs)",
        "ds-lg": "var(--ds-shadow-lg)",
        "ds-xl": "var(--ds-shadow-xl)",
      },
    },
  },
};
