import type { Config } from "tailwindcss";

/**
 * NHAPOA (National Helpline Against Atrocities) portal — clone of the
 * nhapoa-admin-dev / nhapoa-user-dev deployments, built on the shared @mosje
 * token contract. Same SAMAVESH government-navy brand axis as the other portals;
 * NHAPOA adds a "sent-back"/rejection red and reuses the approve/await/saffron scale.
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
        // emerald — approved / disbursed status
        approve: {
          bg: "#dcfce7",
          fg: "#15803d",
          DEFAULT: "#16a34a",
        },
        herofrom: "#1c4486",
        heroto: "#0a2452",
        // amber — pending / awaiting evaluation (fg darkened for AA margin on amber-bg)
        await: {
          bg: "#fef3c7",
          fg: "#92400e",
          DEFAULT: "#d97706",
        },
        // red — sent-back / rejected
        reject: {
          bg: "#fee2e2",
          fg: "#b91c1c",
          DEFAULT: "#dc2626",
        },
        // saffron — helpline / call CTA. `600` is darkened to #b8500f so white
        // text on it meets AA (4.5:1); use saffron-600 for any text-on-saffron.
        saffron: {
          50: "#fff7eb",
          500: "#ec6a1f",
          600: "#b8500f",
          DEFAULT: "#ec6a1f",
        },
        // neutral surfaces
        ink: "#0f172a",
        "ink-muted": "#475569",
        // ink-hint darkened from #94a3b8 (2.6:1, failed AA) to #64748b (~4.8:1 on
        // white) so it is legible when used for real text — labels, table headers,
        // timestamps, hints. Decorative glyphs are aria-hidden regardless.
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
