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
 * The right-hand cluster is `AccessibilityControls`, a component in its own right,
 * because below `breakpoint/tablet` this bar drops it and `NavSheet` picks it up.
 * The text-size step lives in `font-scale.ts` so the two can never disagree.
 *
 * Reused by `SiteHeader` (its Tier-1 bar) and available standalone for portals.
 */

import * as React from "react";
import { cn } from "../../utils/cn";
import { Icon } from "./icon";
import { Divider } from "../layout/divider";
import { AccessibilityControls } from "./accessibility-controls";
import { useFontScale } from "./font-scale";
import "./accessibility-bar.css";

/**
 * `page` tracks `--sa-container-page` — the estate's three-step content ladder
 * (1200 · 1320 from 1440 · 1440 from 1920). `wide` is a FLAT 1200 that never
 * steps, which is the difference that matters: a bar on `wide` above rows on
 * `page` is 60px narrower than them at 1440 and 120px at 1920. Measured
 * 2026-08-27. Use `page` whenever the bar sits above page content.
 */
export type AccessibilityBarLayout = "narrow" | "wide" | "page" | "fluid";
/**
 * Mirrors the Figma master's `Device` variant axis. `"auto"` (the default) is the
 * web-native form: the same breakpoints, resolved by CSS instead of by a prop, so
 * one instance adapts. Pin an explicit device only to reproduce a single Figma
 * variant — a specimen, a visual test, or a fixed-width render.
 */
export type AccessibilityBarDevice = "auto" | "mobile" | "tablet" | "desktop" | "desktop-xl";

export interface AccessibilityBarProps {
  /** Top-left "Government of India" link. */
  govLink?: { href?: string; label?: string; flagSrc?: string };
  /** Skip-link target (the page's main landmark). @default "#main-content" */
  skipTo?: string;
  /** Show the "Skip to Main Content" link. @default true */
  showSkip?: boolean;
  /**
   * The skip link's visible text, mirroring Figma's `Skip label` text property.
   * @default "Skip to Main Content"
   *
   * It is a prop rather than a fixed string because this estate is bilingual: a
   * Hindi surface needs "मुख्य सामग्री पर जाएँ", and a hardcoded English literal
   * makes that impossible without forking the component. GIGW's wording is the
   * default, not a lock.
   */
  skipLabel?: string;
  /** Show the A−/A/A+ font-size control. @default true */
  fontSize?: boolean;
  /** Show the accessibility entry (opens the UX4G accessibility widget). @default true */
  accessibility?: boolean;
  /**
   * Fallback accessibility-statement page (GIGW-required), used **only** when the
   * UX4G widget is not present on the page. With the widget mounted — the estate
   * default — the control opens the widget instead of navigating.
   * @default "/accessibility-statement"
   */
  accessibilityHref?: string;
  /**
   * Override the accessibility control's action. Leave unset for the standard
   * behaviour: open the UX4G accessibility widget.
   */
  onAccessibility?: () => void;
  /** Language selector. Pass `false` to hide. @default { label: "English" } */
  language?: { label?: string; onClick?: () => void } | false;
  /** Content-container width: narrow (720) · wide (flat 1200) · page (1200/1320/1440 ladder) · fluid (full-bleed). @default "wide" */
  layout?: AccessibilityBarLayout;
  /**
   * Explicit content-container max-width (px), overriding the `layout` preset.
   * `SiteHeader` passes its own `maxWidth` so the bar's container aligns with the
   * brand and nav rows below it. Prefer `layout` for standalone use.
   */
  maxWidth?: number;
  /**
   * Figma's `Device` axis. `"auto"` (default) resolves the same breakpoints in CSS.
   *
   * On **mobile** the Figma master collapses the right-hand cluster (font size,
   * accessibility, language), and `SiteHeader` renders the same controls inside
   * `NavSheet` instead — see `AccessibilityControls`. **The skip link is
   * deliberately kept**, because it is the WCAG 2.4.1 bypass mechanism and dropping
   * the page's only one would fail a mandatory criterion; see the divergence note in
   * docs/design-system/components/accessibility-bar.md.
   * @default "auto"
   */
  device?: AccessibilityBarDevice;
  /** Notified whenever the reader changes the font scale (0.9 – 1.2). */
  onFontScaleChange?: (scale: number) => void;
  className?: string;
}

/**
 * The GoI link's launch glyph, at `cmp/accessibilityBar/launchIconSize`. `<Icon>`
 * sets font-size inline so the `opsz` axis tracks the size, which is why this is a
 * number here rather than CSS.
 */
const LAUNCH_ICON_SIZE = 12;
const DIVIDER_LENGTH = 20;

export function AccessibilityBar({
  govLink = { href: "https://india.gov.in/", label: "Government of India" },
  skipTo = "#main-content",
  showSkip = true,
  skipLabel = "Skip to Main Content",
  fontSize = true,
  accessibility = true,
  accessibilityHref = "/accessibility-statement",
  onAccessibility,
  language = { label: "English" },
  layout = "wide",
  maxWidth,
  device = "auto",
  onFontScaleChange,
  className,
}: AccessibilityBarProps): React.JSX.Element {
  /* The bar no longer OWNS the scale — `font-scale.ts` does, and it applies the
     document side-effects itself. All this subscription is for is the public
     `onFontScaleChange` callback, which consumers use to persist the choice
     server-side. */
  const { scale } = useFontScale();
  React.useEffect(() => {
    onFontScaleChange?.(scale);
  }, [scale, onFontScaleChange]);

  return (
    <div className={cn("sa-abar", `layout-${layout}`, `device-${device}`, className)} role="region" aria-label="Accessibility toolbar">
      <div className="sa-abar__in" style={maxWidth ? { maxWidth } : undefined}>
        <a className="sa-abar__gov" href={govLink.href} target="_blank" rel="noreferrer">
          {govLink.flagSrc && (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="sa-abar__flag" src={govLink.flagSrc} alt="" />
          )}
          {/* The label and its launch glyph are ONE unit, mirroring the master's `Link`
              frame. Without the wrapper the row's 12px gap applied between them too,
              pushing the glyph 10px away from the word it belongs to. */}
          <span className="sa-abar__govlink">
            <span className="sa-abar__govlabel">{govLink.label}</span>
            <Icon name="launch" size={LAUNCH_ICON_SIZE} className="sa-abar__ext" aria-hidden />
          </span>
        </a>

        <div className="sa-abar__end">
          {showSkip && (
            <>
              <a href={skipTo} className="sa-abar__skip">{skipLabel}</a>
              <Divider orientation="vertical" tone="inverse-subtle" length={DIVIDER_LENGTH} className="sa-abar__sep" />
            </>
          )}

          <AccessibilityControls
            variant="bar"
            fontSize={fontSize}
            accessibility={accessibility}
            accessibilityHref={accessibilityHref}
            onAccessibility={onAccessibility}
            language={language}
          />
        </div>
      </div>
    </div>
  );
}
