import type { Config } from "tailwindcss";

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
        brandwash: "#e8f0fb",
        approve: {
          bg: "#dcfce7",
          fg: "#15803d",
          DEFAULT: "#16a34a",
        },
        await: {
          bg: "#fef3c7",
          fg: "#b45309",
          DEFAULT: "#d97706",
        },
        saffron: {
          50: "#fff7eb",
          500: "#ec6a1f",
          600: "#d35912",
          DEFAULT: "#ec6a1f",
        },
        ink: "#0f172a",
        "ink-muted": "#475569",
        "ink-hint": "#94a3b8",
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
