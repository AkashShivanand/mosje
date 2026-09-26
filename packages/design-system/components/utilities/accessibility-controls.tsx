"use client";

/**
 * AccessibilityControls — text size · accessibility options · language.
 *
 * The three controls that used to live only inside `AccessibilityBar`'s markup.
 * They are their own component now because they have to render in TWO places:
 *
 *   variant="bar"    the utility bar's right-hand cluster (every width)
 *   variant="sheet"  a labelled section inside `NavSheet` (below breakpoint/tablet)
 *
 * Below 768px the bar SHEDS PART of this cluster — the A−/A/A+ stepper, the
 * separators and the language label's text — because they do not fit beside the
 * Government of India link on a 375px screen. Its icon buttons stay, at a 44px
 * target: measured 2026-09-13, the accessibility icon is on screen at 320–430px,
 * which is what `data-sa-abar-a11y-onscreen` relies on. Originally the bar shed the
 * whole cluster. What was NOT sensible is what
 * happened next: nothing picked them up. `accessibility-bar.css` said the controls
 * "move into the consumer's menu"; the consumer's menu is `NavSheet`, and `NavSheet`
 * was never passed them and never rendered them. Measured on 2026-08-26: on a 375px
 * viewport all three had `offsetParent: null` and width 0, and the sheet contained
 * no replacement — so the estate had no text resize, no accessibility panel and no
 * language switch at all on the device most citizens use. GIGW 3.0 requires the
 * first two on every page, and the language control is the only entry to the
 * Bhashini path.
 *
 * State lives in `font-scale.ts`, not here, so the bar and the sheet can never
 * disagree about the current step.
 */

import * as React from "react";
import { cn } from "../../utils/cn";
import { Icon } from "./icon";
import { Divider } from "../layout/divider";
import { DEFAULT_SCALE_INDEX, FONT_SCALES, useFontScale } from "./font-scale";
import "./accessibility-bar.css";

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
/** How many bars' accessibility icons are on screen right now — refcounted for
 *  the same reason as the entry count: a page can render several bars. */
let a11yOnscreenCount = 0;

/**
 * Open the official UX4G accessibility widget, returning whether it was there.
 *
 * This is a BRIDGE, not a reimplementation: it replays the click on the widget's
 * OWN trigger element, so open/close/focus behaviour stays exactly the vendor's.
 *
 * WHY IT IS DONE THIS WAY — read before "simplifying" it. The v3.28 script binds
 * two competing listeners on `document`, and v3.36 still does (re-read in its source
 * on 25 Sep 2026 — the closer's exemption list is unchanged):
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
 */
export function openUx4gWidget(): boolean {
  if (typeof document === "undefined") return false;
  const trigger = document.getElementById(UX4G_TRIGGER_ID);
  if (!trigger) return false;
  trigger.dispatchEvent(
    new MouseEvent("click", { bubbles: true, cancelable: true, view: window }),
  );
  return true;
}

/**
 * Claim the page's ONE accessibility door for a control other than the UX4G
 * widget's own floating button (`.claude/rules/accessibility-entry-point.md`).
 *
 * While `active`, it sets `data-sa-abar-a11y="1"` on the root — which
 * `accessibility-bar.css` reads to hide `#uw-widget-custom-trigger` from
 * `breakpoint/tablet` up — and, if a `ref` to the door is given, keeps
 * `data-sa-abar-a11y-onscreen` while that element is on screen, which is what
 * hides the floating button on a phone (rule 4a). Both flags are REFCOUNTED, so a
 * page with several doors (the documentation previews render three bars) only
 * clears them when the last one leaves.
 *
 * Extracted verbatim from `AccessibilityControls` on 2026-09-25 so a design whose
 * masthead is not the `AccessibilityBar` — the DBIM website header — can be the
 * door without hand-setting the attribute, which rule 3 forbids. The door must
 * still OPEN the panel, with `openUx4gWidget()` deferred to the next task.
 */
export function useAccessibilityEntryClaim(
  active: boolean,
  ref?: React.RefObject<HTMLElement | null>,
): void {
  React.useEffect(() => {
    if (!active) return;
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
  }, [active]);

  /* …and whether that door is ON SCREEN. Below `breakpoint/tablet` the vendor's
     floating button is hidden only while it is, so a phone shows exactly one door
     whether the masthead is expanded or has condensed the bar away — see
     `accessibility-bar.css` and `accessibility-entry-point.md`. An icon that is
     `display: none` never intersects, so a bar that hides it never hides the
     floating button on its behalf. */
  React.useEffect(() => {
    if (!active) return;
    const button = ref?.current;
    if (!button || typeof IntersectionObserver === "undefined") return;
    const root = document.documentElement;
    let counted = false;
    const setOnscreen = (onscreen: boolean) => {
      if (onscreen === counted) return;
      counted = onscreen;
      a11yOnscreenCount += onscreen ? 1 : -1;
      if (a11yOnscreenCount > 0) {
        root.dataset.saAbarA11yOnscreen = "1";
      } else {
        a11yOnscreenCount = 0;
        delete root.dataset.saAbarA11yOnscreen;
      }
    };
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[entries.length - 1];
      if (entry) setOnscreen(entry.isIntersecting);
    });
    observer.observe(button);
    return () => {
      observer.disconnect();
      setOnscreen(false);
    };
  }, [active, ref]);
}

const ICON_SIZE = 20;
/**
 * The separators' length. Figma draws them at 20 — the height of the glyph beside
 * them, not a stretch — so the bar passes an explicit length rather than letting the
 * rule fill the 46px row.
 */
const DIVIDER_LENGTH = 20;

export interface AccessibilityControlsProps {
  /**
   * Where these are rendering. `"bar"` is the utility bar's inline icon cluster on
   * an inverse ground; `"sheet"` is a labelled section of full-width rows, which is
   * what a control belongs in on a phone.
   * @default "bar"
   */
  variant?: "bar" | "sheet";
  /** Show the A−/A/A+ font-size control. @default true */
  fontSize?: boolean;
  /** Show the accessibility entry (opens the UX4G accessibility widget). @default true */
  accessibility?: boolean;
  /**
   * Fallback accessibility-statement page (GIGW-required), used **only** when the
   * UX4G widget is not present on the page.
   * @default "/accessibility-statement"
   */
  accessibilityHref?: string;
  /** Override the accessibility control's action. */
  onAccessibility?: () => void;
  /** Language selector. Pass `false` to hide. @default { label: "English" } */
  language?: { label?: string; lang?: string; onClick?: () => void } | false;
  className?: string;
}

export function AccessibilityControls({
  variant = "bar",
  fontSize = true,
  accessibility = true,
  accessibilityHref = "/accessibility-statement",
  onAccessibility,
  language = { label: "English" },
  className,
}: AccessibilityControlsProps): React.JSX.Element | null {
  const { index, percent, decrease, increase, reset } = useFontScale();

  /* Tell the stylesheet a BAR is on the page offering the widget entry, so the
     vendor's floating button can be hidden — and whether its icon is on screen.
     The sheet deliberately does not claim this: it is transient, and hiding the
     page's floating entry on behalf of a panel that is closed most of the time
     would put us back where we started. The mechanism is `useAccessibilityEntryClaim`
     below, shared with any other chrome that is a page's one door. */
  const a11yButtonRef = React.useRef<HTMLButtonElement>(null);
  useAccessibilityEntryClaim(variant === "bar" && accessibility, a11yButtonRef);

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

  if (!fontSize && !accessibility && !language) return null;

  const resetLabel =
    index === DEFAULT_SCALE_INDEX
      ? `Text size: ${percent}% (default)`
      : `Reset text size to default — currently ${percent}%`;

  /* ── Sheet: labelled rows, because a phone panel is a list ───────────────── */
  if (variant === "sheet") {
    return (
      <section className={cn("sa-a11yc", className)} aria-label="Accessibility and language">
        <h2 className="sa-a11yc__head">Accessibility</h2>

        {fontSize && (
          <div className="sa-a11yc__row">
            <span className="sa-a11yc__label" id="sa-a11yc-fs">Text size</span>
            <div className="sa-a11yc__steps" role="group" aria-labelledby="sa-a11yc-fs">
              {/* raw-button-ok(primitive): a step in the sheet's role="group" text-size stepper — a statutory control whose 44px target and lit-direction state accessibility-bar.css owns */}
              <button
                type="button"
                className={cn("sa-a11yc__step", index < DEFAULT_SCALE_INDEX && "is-active")}
                onClick={decrease}
                disabled={index === 0}
                aria-label="Decrease text size"
              >
                <Icon name="text_decrease" size={ICON_SIZE} aria-hidden />
              </button>
              {/* raw-button-ok(primitive): the sheet's text-size reset — the middle of the same three-part stepper, and the same fixed target */}
              <button type="button" className="sa-a11yc__step" onClick={reset} aria-label={resetLabel}>
                <Icon name="font_download" size={ICON_SIZE} aria-hidden />
              </button>
              {/* raw-button-ok(primitive): a step in the sheet's role="group" text-size stepper — a statutory control whose 44px target and lit-direction state accessibility-bar.css owns */}
              <button
                type="button"
                className={cn("sa-a11yc__step", index > DEFAULT_SCALE_INDEX && "is-active")}
                onClick={increase}
                disabled={index === FONT_SCALES.length - 1}
                aria-label="Increase text size"
              >
                <Icon name="text_increase" size={ICON_SIZE} aria-hidden />
              </button>
            </div>
          </div>
        )}

        {accessibility && (
          /* raw-button-ok(primitive): a full-width row in the accessibility sheet, and an aria-haspopup="dialog" trigger for the UX4G widget */
          <button type="button" className="sa-a11yc__action" aria-haspopup="dialog" onClick={handleAccessibility}>
            <Icon name="accessibility_new" size={24} aria-hidden />
            <span>Accessibility options</span>
          </button>
        )}

        {language && (
          /* raw-button-ok(primitive): a full-width row in the accessibility sheet — a list row carrying a label and its current value, not an action button */
          <button type="button" className="sa-a11yc__action" onClick={language.onClick}>
            <Icon name="translate_indic" size={24} aria-hidden />
            <span>Language</span>
            {language.label && <span className="sa-a11yc__value" lang={language.lang}>{language.label}</span>}
          </button>
        )}
      </section>
    );
  }

  /* ── Bar: the inline icon cluster, unchanged ─────────────────────────────── */
  return (
    <>
      {fontSize && (
        <>
          <div className="sa-abar__fs" role="group" aria-label="Text size">
            {/* raw-button-ok(primitive): a step in the bar's role="group" text-size stepper — a statutory control sized by --sa-cmp-accessibilityBar-stepSize and inheriting the bar's inverse ink */}
            <button
              type="button"
              className={cn("sa-abar__fsbtn", index < DEFAULT_SCALE_INDEX && "is-active")}
              onClick={decrease}
              disabled={index === 0}
              aria-label="Decrease text size"
            >
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

              `aria-pressed` was REMOVED with the same change. This is a reset ACTION,
              not a toggle, and announcing it as a pressed/unpressed toggle described a
              control that does not exist. The state a screen-reader user needs is the
              current size, so the accessible name carries it instead.

              It deliberately stays ENABLED at the default even though resetting is then
              a no-op: disabling it on reset would destroy focus at the exact moment the
              reader activated it.
            */}
            {/* raw-button-ok(primitive): the bar's text-size reset — the pill in the middle of the same stepper, sized by --sa-cmp-accessibilityBar-pillSize */}
            <button type="button" className={cn("sa-abar__fsbtn", "is-current")} onClick={reset} aria-label={resetLabel}>
              <Icon name="font_download" size={ICON_SIZE} aria-hidden />
            </button>
            {/* raw-button-ok(primitive): a step in the bar's role="group" text-size stepper — a statutory control sized by --sa-cmp-accessibilityBar-stepSize and inheriting the bar's inverse ink */}
            <button
              type="button"
              className={cn("sa-abar__fsbtn", index > DEFAULT_SCALE_INDEX && "is-active")}
              onClick={increase}
              disabled={index === FONT_SCALES.length - 1}
              aria-label="Increase text size"
            >
              <Icon name="text_increase" size={ICON_SIZE} aria-hidden />
            </button>
          </div>
          <Divider orientation="vertical" tone="inverse-subtle" length={DIVIDER_LENGTH} className="sa-abar__sep" />
        </>
      )}

      {accessibility && (
        <>
          {/* raw-button-ok(primitive): the statutory accessibility entry point — an aria-haspopup="dialog" trigger whose measured size and id the UX4G widget and the corner rail both depend on */}
          <button
            ref={a11yButtonRef}
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
        /* raw-button-ok(primitive): the bar's language control — a composite of a glyph, a label and a caret, sized by --sa-cmp-accessibilityBar-iconButtonSize */
        <button type="button" className="sa-abar__icbtn has-text" aria-label="Select language" title="Select language" onClick={language.onClick}>
          {/* Glyph + label are the master's `Label` frame — 4px apart, not the 8px
              the row uses between that unit and the caret. */}
          <span className="sa-abar__langlabel">
            <Icon name="translate_indic" size={ICON_SIZE} aria-hidden />
            {language.label && <span lang={language.lang}>{language.label}</span>}
          </span>
          <Icon name="arrow_drop_down" size={ICON_SIZE} aria-hidden />
        </button>
      )}
    </>
  );
}
