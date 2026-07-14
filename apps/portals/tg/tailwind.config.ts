import type { Config } from "tailwindcss";

/**
 * TG — National Portal for Transgender Persons — corrected-to-design clone of
 * the tg-admin-dev / tg-user-dev portals, built on the shared @mosje token
 * contract. Brand axis: SAMAVESH government navy, approved green, amber
 * "pending / under review", red "rejected / SLA overdue", and a saffron CTA.
 */
export default {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: { "2xl": "1280px" },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-noto)", "system-ui", "sans-serif"],
        heading: ["var(--font-noto)", "system-ui", "sans-serif"],
      },
      colors: {
        // SAMAVESH government navy — primary brand
        navy: {
          50: "#eef3fb",
          100: "#d7e3f5",
          200: "#aec6ea",
          300: "#7ea3d9",
          400: "#4f7ec3",
          500: "#2b5ca6",
          600: "#1c4486",
          700: "#13366b",
          800: "#0f2c59",
          900: "#0a2452",
          950: "#071a3d",
          DEFAULT: "#13366b",
        },
        // sidebar active pill / soft brand wash
        brandwash: "#e8f0fb",
        // emerald — hero band + approved status
        approve: {
          bg: "#dcfce7",
          fg: "#15803d",
          DEFAULT: "#16a34a",
        },
        herofrom: "#4f9d6b",
        heroto: "#2f6b46",
        // amber — pending / under review (fg darkened for AA on amber-bg)
        await: {
          bg: "#fef3c7",
          fg: "#92400e",
          DEFAULT: "#d97706",
        },
        // red — rejected / correction / SLA overdue
        reject: {
          bg: "#fee2e2",
          fg: "#b91c1c",
          DEFAULT: "#dc2626",
        },
        // saffron — CTA. 600 darkened so white text meets AA (4.5:1).
        saffron: {
          50: "#fff7eb",
          500: "#ec6a1f",
          600: "#b8500f",
          DEFAULT: "#ec6a1f",
        },
        // neutral surfaces
        ink: "#0f172a",
        "ink-muted": "#475569",
        // slate-500 — darkened from #94a3b8 (2.56:1) to meet AA 4.5:1 on white,
        // since this token is used as real text (labels, hints), not just placeholders.
        "ink-hint": "#64748b",
        line: "#e2e8f0",
        "surface-muted": "#f5f7fb",
      },
      borderRadius: {
        xl: "0.85rem",
        "2xl": "1.1rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(15,23,42,0.04), 0 1px 3px rgba(15,23,42,0.06)",
        drawer: "-8px 0 24px rgba(15,23,42,0.12)",
        pop: "0 8px 28px rgba(15,23,42,0.14)",
      },
    },
  },
  plugins: [],
} satisfies Config;
