"use client";

/**
 * AccessibilityBar — the government top utility bar (UX4G / GIGW).
 * Figma: SAMAVESH · "Accessibility Bar" (Device × Layout + 4 control toggles).
 *
 * Left: the Government of India link. Right, in order: Skip to content ·
 * Font size (A−/A/A+) · Accessibility · Language — each independently toggleable.
 * This IS the accessibility surface itself, so every control is keyboard-operable
 * and announced. Font size drives a `--sa-font-scale` CSS variable (and the root
 * font-size) so rem-based content reflows; pass `onFontScaleChange` to persist it.
 *
 * Reused by `SiteHeader` (its Tier-1 bar) and available standalone for portals.
 */

import * as React from "react";
import { cn } from "../../utils/cn";
import "./accessibility-bar.css";

export type AccessibilityBarLayout = "narrow" | "wide" | "fluid";
export type AccessibilityBarTone = "blue" | "navy";

export interface AccessibilityBarProps {
  /** Top-left "Government of India" link. */
  govLink?: { href?: string; label?: string; flagSrc?: string };
  /** Skip-link target (the page's main landmark). @default "#main-content" */
  skipTo?: string;
  /** Show the "Skip to Main Content" link. @default true */
  showSkip?: boolean;
  /** Show the A−/A/A+ font-size control. @default true */
  fontSize?: boolean;
  /** Show the accessibility entry (opens the widget, or links to the statement). @default true */
  accessibility?: boolean;
  /** Accessibility-statement page (GIGW-required). @default "/accessibility-statement" */
  accessibilityHref?: string;
  /** If provided, the accessibility control is a button calling this (opens the widget). */
  onAccessibility?: () => void;
  /** Language selector. Pass `false` to hide. @default { label: "English" } */
  language?: { label?: string; onClick?: () => void } | false;
  /** Content-container width: narrow (720) · wide (1200) · fluid (full-bleed). @default "wide" */
  layout?: AccessibilityBarLayout;
  /**
   * Explicit content-container max-width (px), overriding the `layout` preset.
   * `SiteHeader` passes its own `maxWidth` so the bar's container aligns with the
   * brand and nav rows below it. Prefer `layout` for standalone use.
   */
  maxWidth?: number;
  /** Brand tone. @default "blue" */
  tone?: AccessibilityBarTone;
  /** Notified whenever the reader changes the font scale (0.9 – 1.2). */
  onFontScaleChange?: (scale: number) => void;
  className?: string;
}

/** A−, default, A+, A++ — the reader's text-size steps. */
const FONT_SCALES = [0.9, 1, 1.1, 1.2] as const;
const DEFAULT_SCALE_INDEX = 1;

const IcExternal = () => (
  <svg className="sa-abar__ext" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M14 5h5v5M19 5l-8 8M12 5H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IcAccessibility = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="12" cy="3.5" r="1.8" />
    <path d="M20 6.5a1 1 0 0 1-.7 1.2l-4.3 1.2v3.3l2.6 6.1a1 1 0 0 1-1.84.78L12 15.5l-2.76 3.58a1 1 0 0 1-1.84-.78l2.6-6.1V8.9L4.7 7.7A1 1 0 0 1 5.24 5.8L11 7.4a3.4 3.4 0 0 0 2 0l5.76-1.6a1 1 0 0 1 1.24.7Z" />
  </svg>
);
const IcGlobe = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
    <path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const IcCaret = () => (
  <svg className="sa-abar__caret" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function AccessibilityBar({
  govLink = { href: "https://india.gov.in/", label: "Government of India" },
  skipTo = "#main-content",
  showSkip = true,
  fontSize = true,
  accessibility = true,
  accessibilityHref = "/accessibility-statement",
  onAccessibility,
  language = { label: "English" },
  layout = "wide",
  maxWidth,
  tone = "blue",
  onFontScaleChange,
  className,
}: AccessibilityBarProps): React.JSX.Element {
  const [scaleIx, setScaleIx] = React.useState(DEFAULT_SCALE_INDEX);

  React.useEffect(() => {
    const scale = FONT_SCALES[scaleIx] ?? 1;
    const root = document.documentElement;
    root.style.setProperty("--sa-font-scale", String(scale));
    root.dataset.saFontScale = String(scale);
    onFontScaleChange?.(scale);
  }, [scaleIx, onFontScaleChange]);

  const dec = () => setScaleIx((i) => Math.max(0, i - 1));
  const inc = () => setScaleIx((i) => Math.min(FONT_SCALES.length - 1, i + 1));
  const reset = () => setScaleIx(DEFAULT_SCALE_INDEX);

  return (
    <div className={cn("sa-abar", `tone-${tone}`, `layout-${layout}`, className)} role="region" aria-label="Accessibility toolbar">
      <div className="sa-abar__in" style={maxWidth ? { maxWidth } : undefined}>
        <a className="sa-abar__gov" href={govLink.href} target="_blank" rel="noreferrer">
          {govLink.flagSrc && (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="sa-abar__flag" src={govLink.flagSrc} alt="" />
          )}
          <span>{govLink.label}</span>
          <IcExternal />
        </a>

        <div className="sa-abar__end">
          {showSkip && (
            <>
              <a href={skipTo} className="sa-abar__skip">Skip to Main Content</a>
              <span className="sa-abar__sep" aria-hidden="true" />
            </>
          )}

          {fontSize && (
            <>
              <div className="sa-abar__fs" role="group" aria-label="Text size">
                <button type="button" className="sa-abar__fsbtn" onClick={dec} disabled={scaleIx === 0} aria-label="Decrease text size">A<span aria-hidden="true">−</span></button>
                <button type="button" className={cn("sa-abar__fsbtn", "is-current", scaleIx === DEFAULT_SCALE_INDEX && "is-active")} onClick={reset} aria-label="Reset text size" aria-pressed={scaleIx === DEFAULT_SCALE_INDEX}>A</button>
                <button type="button" className="sa-abar__fsbtn" onClick={inc} disabled={scaleIx === FONT_SCALES.length - 1} aria-label="Increase text size">A<span aria-hidden="true">+</span></button>
              </div>
              <span className="sa-abar__sep" aria-hidden="true" />
            </>
          )}

          {accessibility && (
            <>
              {onAccessibility ? (
                <button type="button" className="sa-abar__icbtn" aria-label="Accessibility options" title="Accessibility options" onClick={onAccessibility}>
                  <IcAccessibility />
                </button>
              ) : (
                <a className="sa-abar__icbtn" href={accessibilityHref} aria-label="Accessibility statement" title="Accessibility statement">
                  <IcAccessibility />
                </a>
              )}
              {language && <span className="sa-abar__sep" aria-hidden="true" />}
            </>
          )}

          {language && (
            <button type="button" className="sa-abar__icbtn has-text" aria-label="Select language" title="Select language" onClick={language.onClick}>
              <IcGlobe />
              {language.label && <span>{language.label}</span>}
              <IcCaret />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
