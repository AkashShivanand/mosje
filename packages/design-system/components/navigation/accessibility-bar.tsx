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
import { Icon } from "../icon";
import { Divider } from "../layout/divider";
import "./accessibility-bar.css";

export type AccessibilityBarLayout = "narrow" | "wide" | "fluid";
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
  /** Content-container width: narrow (720) · wide (1200) · fluid (full-bleed). @default "wide" */
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
   * accessibility, language) — consumers move those into a menu. **The skip link is
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

/** A−, default, A+, A++ — the reader's text-size steps. */
const FONT_SCALES = [0.9, 1, 1.1, 1.2] as const;
const DEFAULT_SCALE_INDEX = 1;
/** Where the reader's chosen text size persists across pages. */
const FONT_SCALE_KEY = "sa-font-scale";

/** The id the official UX4G widget script gives its own floating trigger. */
const UX4G_TRIGGER_ID = "uw-widget-custom-trigger";

/**
 * How many mounted bars are currently offering the accessibility entry.
 *
 * It is a COUNT, not a boolean, and that matters: the documentation page renders
 * several AccessibilityBar previews at once, and a plain set-on-mount /
 * delete-on-unmount flag let the first preview to unmount clear the attribute
 * while other bars were still on the page — which un-hid the vendor's floating
 * button underneath a live bar. Only the last bar out clears the flag.
 */
let a11yEntryCount = 0;

/**
 * Open the official UX4G accessibility widget, returning whether it was there.
 *
 * This is a BRIDGE, not a reimplementation: it replays the click on the widget's
 * OWN trigger element, so open/close/focus behaviour stays exactly the vendor's.
 *
 * WHY IT IS DONE THIS WAY — read before "simplifying" it. The v3.28 script binds
 * two competing listeners on `document`:
 *
 *   opener: `event.target.closest('#uw-widget-custom-trigger, [data-uw-trigger="true"]')`
 *           → openPanel()
 *   closer: closes unless the target is inside `#uw-main`, `#uw-widget-custom-trigger`,
 *           or `#open-the-accessibility-menu` — it does NOT honour `[data-uw-trigger]`
 *
 * So marking our own button `data-uw-trigger="true"` (the documented hook) opens
 * the panel and then has the SAME click close it again — a vendor bug that looks
 * exactly like "the button does nothing". Verified live: the panel's offset went
 * straight back to `right: -530px`.
 *
 * Replaying the click on the vendor's trigger satisfies both listeners at once.
 * The caller must also stop its own event from reaching `document`, or the closer
 * fires on the original click and undoes the open.
 *
 * Presence is probed via the same element, so a page without the widget mounted
 * falls back to the accessibility statement rather than swallowing the click.
 */
function openUx4gWidget(): boolean {
  if (typeof document === "undefined") return false;
  const trigger = document.getElementById(UX4G_TRIGGER_ID);
  if (!trigger) return false;
  trigger.dispatchEvent(
    new MouseEvent("click", { bubbles: true, cancelable: true, view: window }),
  );
  return true;
}

/**
 * The bar's glyphs are the SAME Material Symbols the Figma master instances —
 * `launch`, `text_decrease`, `font_download`, `text_increase`, `accessibility_new`,
 * `translate_indic`, `arrow_drop_down` — rather than hand-drawn vectors, per the
 * estate icon rule.
 *
 * `font_download` and `translate_indic` replaced a literal "A" and the generic
 * `language` globe on 2026-08-18, matching glyph swaps the designer made in the
 * Figma master. `translate_indic` is the better call on its own merits — it is the
 * Devanagari-aware translate glyph, and this estate's language switch is
 * English↔Hindi, not a generic locale picker.
 *
 * Sizes mirror the tokens: `icon/size/20` for the controls, and the GoI link's
 * launch glyph at 12 (`cmp/accessibilityBar/launchIconSize`). `<Icon>` sets
 * font-size inline so the `opsz` axis tracks the size, which is why these are
 * numbers here rather than CSS.
 *
 * Requires the Material Symbols font: `import "@mosje/design-system/icons.css"`
 * once in the app root (the hub already does).
 */
const ICON_SIZE = 20;
/**
 * The separators' length. Figma draws them at 20 — the height of the glyph beside
 * them, not a stretch — so the bar passes an explicit length rather than letting the
 * rule fill the 46px row.
 */
const DIVIDER_LENGTH = 20;
const LAUNCH_ICON_SIZE = 12;

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
  const [scaleIx, setScaleIx] = React.useState(DEFAULT_SCALE_INDEX);

  /**
   * Restore-then-apply, in ONE effect, deliberately.
   *
   * Two effects (restore, then apply) looked equivalent and was not: on mount the
   * apply effect ran FIRST with the default index, so it wrote scale 1 to the root
   * and — worse — wrote "1" over the reader's stored preference before the restore
   * effect's setState had re-rendered. A reader who had chosen A++ saw the page
   * snap to 100% and then to 120%, and any unmount caught in between persisted the
   * wrong value. Restoring inside the same effect and bailing out before the apply
   * removes both: the stored scale is applied once, and nothing is written until
   * the restore has had its say.
   */
  const restored = React.useRef(false);
  React.useEffect(() => {
    if (!restored.current) {
      restored.current = true;
      try {
        const raw = window.localStorage.getItem(FONT_SCALE_KEY);
        if (raw !== null) {
          const ix = FONT_SCALES.indexOf(Number(raw) as (typeof FONT_SCALES)[number]);
          // Bail before applying: the setState re-runs this effect with the restored
          // index, which then applies exactly once.
          if (ix >= 0 && ix !== scaleIx) {
            setScaleIx(ix);
            return;
          }
        }
      } catch {
        /* storage blocked (private mode, cookie policy) — keep the default */
      }
    }

    const scale = FONT_SCALES[scaleIx] ?? 1;
    const root = document.documentElement;
    root.style.setProperty("--sa-font-scale", String(scale));
    // `data-sa-font-scale` is what ARMS the :root font-size rule in the stylesheet
    // (see accessibility-bar.css). Without the attribute the rule does not apply,
    // so a page with no bar keeps the browser's own root size untouched.
    root.dataset.saFontScale = String(scale);
    try {
      window.localStorage.setItem(FONT_SCALE_KEY, String(scale));
    } catch {
      /* storage blocked — the scale still applies for this page view */
    }
    onFontScaleChange?.(scale);
  }, [scaleIx, onFontScaleChange]);

  // Tell the stylesheet a bar is on the page AND offering the widget entry, so the
  // vendor's floating button can be hidden. Refcounted, so on a page with several
  // bars (the documentation previews) the last one out clears the flag rather than
  // the first — otherwise the floating button reappears under a live bar.
  React.useEffect(() => {
    if (!accessibility) return;
    const root = document.documentElement;
    a11yEntryCount += 1;
    root.dataset.saAbarA11y = "1";
    return () => {
      a11yEntryCount -= 1;
      if (a11yEntryCount <= 0) {
        a11yEntryCount = 0;
        delete root.dataset.saAbarA11y;
      }
    };
  }, [accessibility]);

  const dec = () => setScaleIx((i) => Math.max(0, i - 1));
  const inc = () => setScaleIx((i) => Math.min(FONT_SCALES.length - 1, i + 1));

  /**
   * Open the UX4G widget; only navigate to the statement page if it isn't there.
   * An explicit `onAccessibility` always wins.
   */
  const handleAccessibility = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (onAccessibility) {
        onAccessibility();
        return;
      }
      // Open on the NEXT TASK, not inline. This click is still propagating to the
      // widget's document-level outside-click closer, which would shut the panel
      // we just opened (see openUx4gWidget). Stopping propagation is not a reliable
      // fix here — under the Next.js App Router React renders the whole document,
      // so React's delegated listener and the widget's sit on the same node and the
      // ordering is not ours to guarantee. Deferring sidesteps the race entirely:
      // the closer runs first against an already-closed panel (a no-op), then we
      // open. Measured: inline opening lost the race every time.
      e.stopPropagation();
      window.setTimeout(() => {
        if (!openUx4gWidget() && accessibilityHref) {
          window.location.href = accessibilityHref;
        }
      }, 0);
    },
    [onAccessibility, accessibilityHref],
  );
  const reset = () => setScaleIx(DEFAULT_SCALE_INDEX);
  /** The current step as a whole percentage — announced, never rendered. */
  const scalePercent = Math.round((FONT_SCALES[scaleIx] ?? 1) * 100);

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

          {fontSize && (
            <>
              <div className="sa-abar__fs" role="group" aria-label="Text size">
                <button type="button" className={cn("sa-abar__fsbtn", scaleIx < DEFAULT_SCALE_INDEX && "is-active")} onClick={dec} disabled={scaleIx === 0} aria-label="Decrease text size">
                  <Icon name="text_decrease" size={ICON_SIZE} aria-hidden />
                </button>
                {/*
                  THE CENTRE NO LONGER LIGHTS AT ALL. It is purely the reset.

                  It briefly carried the "you are away from default" highlight (2026-08-18),
                  and that was wrong in a way only using it revealed: the highlight landed on
                  a button the reader had not pressed, so it read as "the centre is selected",
                  and it could not express DIRECTION — 90 % and 120 % looked identical. The
                  lit state moved to A− / A+ on 2026-08-19: press A+ and A+ lights, which is
                  what a person expects, and a lit A− vs a lit A+ says which way you went.

                  It read the other way until then, which left the returning reader with
                  no signal at all: the scale now PERSISTS, so someone who chose 120 % last
                  visit came back to a bar that looked identical to an untouched one. Three
                  of the four steps were visually indistinguishable. Lighting on deviation
                  turns the highlight into the thing that is actually worth saying — "this
                  page is not at the default size, and this is the control that undoes it".

                  `aria-pressed` was REMOVED with the same change. This is a reset ACTION,
                  not a toggle, and announcing it as a pressed/unpressed toggle described a
                  control that does not exist. The state a screen-reader user needs is the
                  current size, so the accessible name carries it instead.

                  It deliberately stays ENABLED at the default even though resetting is then
                  a no-op: disabling it on reset would destroy focus at the exact moment the
                  reader activated it.
                */}
                <button
                  type="button"
                  className={cn("sa-abar__fsbtn", "is-current")}
                  onClick={reset}
                  aria-label={
                    scaleIx === DEFAULT_SCALE_INDEX
                      ? `Text size: ${scalePercent}% (default)`
                      : `Reset text size to default — currently ${scalePercent}%`
                  }
                >
                  <Icon name="font_download" size={ICON_SIZE} aria-hidden />
                </button>
                <button type="button" className={cn("sa-abar__fsbtn", scaleIx > DEFAULT_SCALE_INDEX && "is-active")} onClick={inc} disabled={scaleIx === FONT_SCALES.length - 1} aria-label="Increase text size">
                  <Icon name="text_increase" size={ICON_SIZE} aria-hidden />
                </button>
              </div>
              <Divider orientation="vertical" tone="inverse-subtle" length={DIVIDER_LENGTH} className="sa-abar__sep" />
            </>
          )}

          {accessibility && (
            <>
              <button
                type="button"
                className="sa-abar__icbtn"
                aria-label="Accessibility options"
                title="Accessibility options"
                aria-haspopup="dialog"
                onClick={handleAccessibility}
              >
                <Icon name="accessibility_new" size={ICON_SIZE} aria-hidden />
              </button>
              {language && <Divider orientation="vertical" tone="inverse-subtle" length={DIVIDER_LENGTH} className="sa-abar__sep" />}
            </>
          )}

          {language && (
            <button type="button" className="sa-abar__icbtn has-text" aria-label="Select language" title="Select language" onClick={language.onClick}>
              {/* Glyph + label are the master's `Label` frame — 4px apart, not the 8px
                  the row uses between that unit and the caret. */}
              <span className="sa-abar__langlabel">
                <Icon name="translate_indic" size={ICON_SIZE} aria-hidden />
                {language.label && <span>{language.label}</span>}
              </span>
              <Icon name="arrow_drop_down" size={ICON_SIZE} aria-hidden />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
