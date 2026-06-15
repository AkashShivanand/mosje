"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import "./a11y.css";

/* ----------------------------------------------------------------------------
   Settings model + persistence
   ---------------------------------------------------------------------------- */

type Leading = "normal" | "relaxed" | "loose";
type Spacing = "normal" | "wide";
type Theme = "light" | "dark";

interface A11ySettings {
  /** Root font-size scale in percent (100 = browser default). */
  fontScale: number;
  leading: Leading;
  spacing: Spacing;
  contrast: boolean;
  links: boolean;
  theme: Theme;
}

const STORAGE_KEY = "mosje-a11y";

const FONT_MIN = 85;
const FONT_MAX = 150;
const FONT_STEP = 10;

const DEFAULT_SETTINGS: A11ySettings = {
  fontScale: 100,
  leading: "normal",
  spacing: "normal",
  contrast: false,
  links: false,
  theme: "light",
};

function clampFont(value: number): number {
  return Math.min(FONT_MAX, Math.max(FONT_MIN, Math.round(value)));
}

function readSettings(): A11ySettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<A11ySettings>;
    return {
      fontScale: clampFont(
        typeof parsed.fontScale === "number" ? parsed.fontScale : 100,
      ),
      leading:
        parsed.leading === "relaxed" || parsed.leading === "loose"
          ? parsed.leading
          : "normal",
      spacing: parsed.spacing === "wide" ? "wide" : "normal",
      contrast: parsed.contrast === true,
      links: parsed.links === true,
      theme: parsed.theme === "dark" ? "dark" : "light",
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

/** Apply settings to <html>: font-size + global effect classes. */
function applySettings(s: A11ySettings): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  root.style.fontSize = s.fontScale === 100 ? "" : `${s.fontScale}%`;

  root.classList.toggle("ds-a11y-leading-relaxed", s.leading === "relaxed");
  root.classList.toggle("ds-a11y-leading-loose", s.leading === "loose");
  root.classList.toggle("ds-a11y-spacing-wide", s.spacing === "wide");
  root.classList.toggle("ds-a11y-contrast", s.contrast);
  root.classList.toggle("ds-a11y-links", s.links);

  const isDark = s.theme === "dark";
  root.classList.toggle("ds-a11y-dark", isDark);
  // Also drive apps that key dark mode off the `.dark` class (shadcn/Tailwind).
  root.classList.toggle("dark", isDark);
}

/* ----------------------------------------------------------------------------
   Icons (inline SVG, 24x24 stroke)
   ---------------------------------------------------------------------------- */

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.9,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

const AccessibilityIcon = () => (
  <svg {...iconProps} fill="currentColor" stroke="none">
    <circle cx="12" cy="4" r="2" />
    <path d="M12 7v4m0 0 5 1m-5-1-5 1m5 3 3 6m-3-6-3 6" stroke="currentColor" strokeWidth={2} fill="none" />
    <path d="M5 8c2.3.8 4.6 1 7 1s4.7-.2 7-1" stroke="currentColor" strokeWidth={2} fill="none" />
  </svg>
);

const CloseIcon = () => (
  <svg {...iconProps}>
    <path d="M6 6 18 18M18 6 6 18" />
  </svg>
);

const TextSizeIcon = () => (
  <svg {...iconProps}>
    <path d="M4 17 9 6l5 11M5.5 13.5h7M15 17l3-7 3 7M16.2 14.3h3.6" />
  </svg>
);

const LineHeightIcon = () => (
  <svg {...iconProps}>
    <path d="M4 6h16M4 12h16M4 18h16M2 4v16M0.6 5.4 2 4l1.4 1.4M0.6 18.6 2 20l1.4-1.4" />
  </svg>
);

const SpacingIcon = () => (
  <svg {...iconProps}>
    <path d="M4 4v16M20 4v16M8 12h8M8 12l2-2M8 12l2 2M16 12l-2-2M16 12l-2 2" />
  </svg>
);

const ContrastIcon = () => (
  <svg {...iconProps}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 3a9 9 0 0 1 0 18Z" fill="currentColor" />
  </svg>
);

const LinkIcon = () => (
  <svg {...iconProps}>
    <path d="M10 13a4 4 0 0 0 5.66 0l3-3A4 4 0 0 0 13 4.34l-1.7 1.7M14 11a4 4 0 0 0-5.66 0l-3 3A4 4 0 0 0 11 19.66l1.7-1.7" />
  </svg>
);

const ThemeIcon = () => (
  <svg {...iconProps}>
    <path d="M21 12.8A8 8 0 1 1 11.2 3 6 6 0 0 0 21 12.8Z" />
  </svg>
);

const ResetIcon = () => (
  <svg {...iconProps}>
    <path d="M3 12a9 9 0 1 0 2.6-6.3M5 4v3.5h3.5" />
  </svg>
);

const SunIcon = () => (
  <svg {...iconProps}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.4 1.4M17.6 17.6 19 19M19 5l-1.4 1.4M6.4 17.6 5 19" />
  </svg>
);

/* ----------------------------------------------------------------------------
   Widget
   ---------------------------------------------------------------------------- */

export interface AccessibilityWidgetProps {
  /** Optional extra className applied to the widget root wrapper. */
  className?: string;
}

/**
 * MoSJE / UX4G Accessibility Widget.
 *
 * A floating FAB (bottom-right) that opens an "Accessibility Options" dialog
 * exposing text size, line height, text spacing, high-contrast, link
 * highlighting and light/dark theme controls. Every setting persists to
 * localStorage (`mosje-a11y`) and is re-applied on mount. Fully keyboard
 * accessible with focus management and Esc-to-close.
 */
export const AccessibilityWidget = ({ className }: AccessibilityWidgetProps) => {
  const [open, setOpen] = React.useState(false);
  const [settings, setSettings] = React.useState<A11ySettings>(DEFAULT_SETTINGS);
  const [hydrated, setHydrated] = React.useState(false);

  const fabRef = React.useRef<HTMLButtonElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);

  // Hydrate from storage + apply on mount.
  React.useEffect(() => {
    const stored = readSettings();
    setSettings(stored);
    applySettings(stored);
    setHydrated(true);
  }, []);

  // Persist + apply whenever settings change (after hydration).
  React.useEffect(() => {
    if (!hydrated) return;
    applySettings(settings);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      /* storage may be unavailable (private mode) — effects still applied */
    }
  }, [settings, hydrated]);

  // Move focus into the panel when it opens.
  React.useEffect(() => {
    if (open) {
      // Defer so the panel is mounted before focusing.
      const id = window.requestAnimationFrame(() => {
        const first = panelRef.current?.querySelector<HTMLElement>(
          "button, [href], input, [tabindex]:not([tabindex='-1'])",
        );
        first?.focus();
      });
      return () => window.cancelAnimationFrame(id);
    }
    return undefined;
  }, [open]);

  const closePanel = React.useCallback(() => {
    setOpen(false);
    fabRef.current?.focus();
  }, []);

  // Esc to close + simple focus trap within the dialog.
  const onPanelKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      closePanel();
      return;
    }
    if (event.key !== "Tab") return;
    const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
      "button, [href], input, [tabindex]:not([tabindex='-1'])",
    );
    if (!focusables || focusables.length === 0) return;
    const list = Array.from(focusables).filter((el) => !el.hasAttribute("disabled"));
    const first = list[0];
    const last = list[list.length - 1];
    if (!first || !last) return;
    const active = document.activeElement;
    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const update = <K extends keyof A11ySettings>(key: K, value: A11ySettings[K]) =>
    setSettings((prev) => ({ ...prev, [key]: value }));

  const decFont = () =>
    update("fontScale", clampFont(settings.fontScale - FONT_STEP));
  const incFont = () =>
    update("fontScale", clampFont(settings.fontScale + FONT_STEP));
  const resetFont = () => update("fontScale", 100);

  const resetAll = () => setSettings(DEFAULT_SETTINGS);

  return (
    <div className={cn("ds-a11y", className)}>
      <button
        ref={fabRef}
        type="button"
        className="ds-a11y__fab"
        aria-label="Accessibility options"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <AccessibilityIcon />
      </button>

      {open && (
        <div
          ref={panelRef}
          className="ds-a11y__panel"
          role="dialog"
          aria-modal="true"
          aria-label="Accessibility Options"
          onKeyDown={onPanelKeyDown}
        >
          <div className="ds-a11y__header">
            <h2 className="ds-a11y__title">Accessibility Options</h2>
            <button
              type="button"
              className="ds-a11y__close"
              aria-label="Close accessibility options"
              onClick={closePanel}
            >
              <CloseIcon />
            </button>
          </div>

          <div className="ds-a11y__body">
            {/* Text Size */}
            <div className="ds-a11y__group">
              <span className="ds-a11y__group-label">
                <TextSizeIcon />
                Text Size
                <span className="ds-a11y__value">{settings.fontScale}%</span>
              </span>
              <div className="ds-a11y__row">
                <button
                  type="button"
                  className="ds-a11y__opt"
                  onClick={decFont}
                  disabled={settings.fontScale <= FONT_MIN}
                  aria-label="Decrease text size"
                >
                  A&minus;
                </button>
                <button
                  type="button"
                  className="ds-a11y__opt"
                  onClick={resetFont}
                  aria-label="Reset text size"
                >
                  A
                </button>
                <button
                  type="button"
                  className="ds-a11y__opt"
                  onClick={incFont}
                  disabled={settings.fontScale >= FONT_MAX}
                  aria-label="Increase text size"
                >
                  A+
                </button>
              </div>
            </div>

            {/* Line Height */}
            <div className="ds-a11y__group">
              <span className="ds-a11y__group-label">
                <LineHeightIcon />
                Line Height
              </span>
              <div className="ds-a11y__row" role="group" aria-label="Line height">
                {(["normal", "relaxed", "loose"] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className="ds-a11y__opt"
                    aria-pressed={settings.leading === opt}
                    onClick={() => update("leading", opt)}
                  >
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Spacing */}
            <div className="ds-a11y__group">
              <span className="ds-a11y__group-label">
                <SpacingIcon />
                Text Spacing
              </span>
              <div className="ds-a11y__row" role="group" aria-label="Text spacing">
                {(["normal", "wide"] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className="ds-a11y__opt"
                    aria-pressed={settings.spacing === opt}
                    onClick={() => update("spacing", opt)}
                  >
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Contrast */}
            <div className="ds-a11y__group">
              <span className="ds-a11y__group-label">
                <ContrastIcon />
                Contrast
              </span>
              <div className="ds-a11y__row">
                <button
                  type="button"
                  className="ds-a11y__opt"
                  aria-pressed={settings.contrast}
                  onClick={() => update("contrast", !settings.contrast)}
                >
                  {settings.contrast ? "High contrast: On" : "High contrast: Off"}
                </button>
              </div>
            </div>

            {/* Highlight Links */}
            <div className="ds-a11y__group">
              <span className="ds-a11y__group-label">
                <LinkIcon />
                Highlight Links
              </span>
              <div className="ds-a11y__row">
                <button
                  type="button"
                  className="ds-a11y__opt"
                  aria-pressed={settings.links}
                  onClick={() => update("links", !settings.links)}
                >
                  {settings.links ? "Highlight: On" : "Highlight: Off"}
                </button>
              </div>
            </div>

            {/* Theme */}
            <div className="ds-a11y__group">
              <span className="ds-a11y__group-label">
                <ThemeIcon />
                Theme
              </span>
              <div className="ds-a11y__row" role="group" aria-label="Theme">
                <button
                  type="button"
                  className="ds-a11y__opt"
                  aria-pressed={settings.theme === "light"}
                  onClick={() => update("theme", "light")}
                >
                  <SunIcon />
                  Light
                </button>
                <button
                  type="button"
                  className="ds-a11y__opt"
                  aria-pressed={settings.theme === "dark"}
                  onClick={() => update("theme", "dark")}
                >
                  <ThemeIcon />
                  Dark
                </button>
              </div>
            </div>
          </div>

          <button type="button" className="ds-a11y__reset" onClick={resetAll}>
            <ResetIcon />
            Reset all
          </button>
        </div>
      )}
    </div>
  );
};
