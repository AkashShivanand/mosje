import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-noto)", "system-ui", "sans-serif"],
        heading: ["var(--font-noto)", "system-ui", "sans-serif"],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "monospace",
        ],
      },
      colors: {
        // Brand — official GoI navy preserved
        primary: {
          50: "#eef4fb",
          100: "#d6e3f1",
          200: "#a9c4e0",
          300: "#7ba4cf",
          400: "#3d6c9c",
          500: "#003366",
          600: "#002b55",
          700: "#002244",
          800: "#001933",
          900: "#001022",
          DEFAULT: "#003366",
        },
        // Brand accent — saffron, used sparingly
        accent: {
          50: "#fff7eb",
          100: "#fdebcd",
          200: "#fad59b",
          500: "#ff9933",
          600: "#e07a16",
          DEFAULT: "#ff9933",
        },
        // Secondary green (govt secondary)
        secondary: {
          50: "#ecfdf5",
          100: "#d1fae5",
          400: "#34d399",
          500: "#16a34a",
          600: "#15803d",
          DEFAULT: "#16a34a",
        },
        // Status
        info: {
          50: "#eff6ff",
          100: "#dbeafe",
          300: "#93c5fd",
          500: "#3b82f6",
          600: "#1d4ed8",
          DEFAULT: "#1d4ed8",
        },
        success: {
          50: "#ecfdf5",
          100: "#d1fae5",
          300: "#6ee7b7",
          500: "#10b981",
          600: "#059669",
          DEFAULT: "#059669",
        },
        warning: {
          50: "#fffbeb",
          100: "#fef3c7",
          300: "#fcd34d",
          500: "#f59e0b",
          600: "#d97706",
          DEFAULT: "#d97706",
        },
        danger: {
          50: "#fef2f2",
          100: "#fee2e2",
          300: "#fca5a5",
          500: "#ef4444",
          600: "#dc2626",
          800: "#991b1b",
          DEFAULT: "#dc2626",
        },
        // Neutrals — slate-tinted for modern admin feel
        neutral: {
          0: "#ffffff",
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          DEFAULT: "#334155",
        },
        // Stroke aliases (kept for legacy components)
        stroke: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
        },
        // Semantic surface aliases (CSS vars defined in globals.css)
        surface: "var(--surface)",
        "surface-muted": "var(--surface-muted)",
        "surface-elevated": "var(--surface-elevated)",
        "surface-sunken": "var(--surface-sunken)",
        border: "var(--border)",
        ring: "var(--ring)",
        foreground: "var(--foreground)",
        "foreground-muted": "var(--foreground-muted)",
        "foreground-hint": "var(--foreground-hint)",
        "foreground-on-primary": "#ffffff",
      },
      fontSize: {
        // Display
        "display-1": ["44px", { lineHeight: "52px", letterSpacing: "-0.02em" }],
        "display-2": ["36px", { lineHeight: "44px", letterSpacing: "-0.02em" }],
        "display-5": ["28px", { lineHeight: "36px", letterSpacing: "-0.01em" }],
        // Headlines
        "headline-1": ["32px", { lineHeight: "40px", letterSpacing: "-0.01em" }],
        "headline-2": ["28px", { lineHeight: "36px", letterSpacing: "-0.01em" }],
        "headline-3": ["24px", { lineHeight: "32px", letterSpacing: "-0.005em" }],
        "headline-4": ["20px", { lineHeight: "28px" }],
        "headline-5": ["18px", { lineHeight: "26px" }],
        "headline-6": ["16px", { lineHeight: "24px" }],
        // Titles
        "title-1": ["20px", { lineHeight: "28px" }],
        "title-2": ["18px", { lineHeight: "24px" }],
        // Body
        "body-1": ["16px", { lineHeight: "24px" }],
        "body-2": ["14px", { lineHeight: "20px" }],
        "body-3": ["13px", { lineHeight: "20px" }],
        // Labels
        "label-1": ["14px", { lineHeight: "20px" }],
        "label-2": ["12px", { lineHeight: "16px" }],
        "label-3": ["11px", { lineHeight: "16px" }],
        // Numbers
        "num-xl": ["32px", { lineHeight: "36px", letterSpacing: "-0.02em" }],
        "num-lg": ["24px", { lineHeight: "28px", letterSpacing: "-0.01em" }],
      },
      spacing: {
        xxs: "2px",
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
        "3xl": "32px",
        "4xl": "40px",
        "5xl": "56px",
      },
      borderRadius: {
        none: "0",
        xxs: "2px",
        xs: "4px",
        sm: "6px",
        DEFAULT: "8px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "20px",
        "3xl": "24px",
        full: "9999px",
      },
      boxShadow: {
        // Subtle, elevation-aware shadows tuned for slate surfaces
        xs: "0 1px 1px rgba(15,23,42,0.04)",
        s: "0 1px 2px rgba(15,23,42,0.04), 0 1px 3px rgba(15,23,42,0.06)",
        md: "0 4px 6px -1px rgba(15,23,42,0.06), 0 2px 4px -2px rgba(15,23,42,0.06)",
        lg: "0 10px 15px -3px rgba(15,23,42,0.08), 0 4px 6px -4px rgba(15,23,42,0.05)",
        xl: "0 20px 25px -5px rgba(15,23,42,0.10), 0 8px 10px -6px rgba(15,23,42,0.06)",
        // Inner highlight + outline used for inset cards
        inset: "inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -1px 0 rgba(15,23,42,0.04)",
        // Brand focus ring
        focus: "0 0 0 4px rgba(0,51,102,0.18)",
        // Soft glow used for hero KPI cards
        glow: "0 1px 0 rgba(255,255,255,0.6) inset, 0 12px 32px -16px rgba(0,51,102,0.25)",
      },
      transitionTimingFunction: {
        "swift-out": "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        in: {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          from: { height: "0" },
          to: { height: "var(--radix-collapsible-content-height)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        in: "in 180ms cubic-bezier(0.22, 1, 0.36, 1)",
        slideDown: "slideDown 200ms ease-out",
        shimmer: "shimmer 1.6s infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
