import * as React from "react";
import { cn } from "../../utils/cn";
import "./button.css";

/**
 * `neutral` is the variant for an action that carries no semantic charge — a
 * dismiss, a reset, a "start over". It exists because there was no way to
 * express "quiet" without borrowing a signal colour: the chatbot's end-chat
 * control reached for `danger`, which spent the estate's rejection red on
 * housekeeping and made the least-used control the loudest thing in its panel.
 * A portal that fills its screen with red for non-errors has no red left when
 * an application actually fails.
 */
export type ButtonVariant = "primary" | "success" | "danger" | "neutral";
/**
 * `inverse` and `inverseOutlined` are DEPRECATED as appearances — they are a tone,
 * not a style, and modelling them here is what made them ignore `variant`. Use
 * `tone="inverse"` with `appearance="filled" | "outlined"` instead. They keep working:
 * the Ticker's documented route-out, the login shell and two Code Connect templates all
 * name them, and breaking those to rename a prop would be a poor trade.
 *
 * `tonal` is GONE. Its fill and its border were the same pale wash, so the control had
 * no edge against the page — 1.21:1 to 1.52:1 against a 3:1 requirement — and it could
 * not be darkened without becoming `outlined`. It had two consumers in 494 buttons.
 */
export type ButtonAppearance =
  | "filled"
  | "outlined"
  | "text"
  /** @deprecated Use `tone="inverse"` with `appearance="filled"`. */
  | "inverse"
  /** @deprecated Use `tone="inverse"` with `appearance="outlined"`. */
  | "inverseOutlined";

/**
 * Which ground the button sits on. `inverse` is for a solid brand-colour surface — a
 * navy header, the ticker bar, a hero band.
 *
 * It is an AXIS THAT CROSSES `appearance`, which is the whole point: as two appearance
 * words, `inverseOutlined` could only have one look, so all four variants painted the
 * same white-alpha border and `danger` silently lost its signal. Crossed, each variant
 * keeps its own intent on either ground.
 */
export type ButtonTone = "default" | "inverse";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Semantic colour role. @default "primary" */
  variant?: ButtonVariant;
  /** Visual style. @default "filled" */
  appearance?: ButtonAppearance;
  /** The ground the button sits on. @default "default" */
  tone?: ButtonTone;
  /** Control size. @default "md" */
  size?: ButtonSize;
  /** Icon rendered before the label. */
  iconLeft?: React.ReactNode;
  /** Icon rendered after the label. */
  iconRight?: React.ReactNode;
  /** When set, the button renders as an anchor (`<a href>`) for link CTAs. */
  href?: string;
  /**
   * Link form only — where the anchor opens. Ignored without `href`.
   *
   * THE LINK FORM OFFERED `href` AND NONE OF THE ATTRIBUTES THAT GO WITH IT. Because
   * this interface extends `ButtonHTMLAttributes`, the three anchor attributes a CTA
   * actually needs were not assignable, so `<Button href target="_blank">` did not
   * compile and every consumer that wanted one fell back to a raw `<a>` with
   * `buttonClasses()` — losing the disabled-link handling the component exists to
   * provide. Found by the typechecker while adding the `rel` default below, which had
   * been reading a `target` the public API could not set.
   */
  target?: React.HTMLAttributeAnchorTarget;
  /**
   * Link form only. Left unset, `target="_blank"` is given `rel="noopener noreferrer"`
   * automatically; an explicit value here wins.
   */
  rel?: string;
  /** Link form only — download the target rather than navigating to it. */
  download?: string | boolean;
  /**
   * Busy state. Sets `aria-busy` and disables the control, so a form cannot be
   * submitted twice while the first submission is in flight.
   *
   * KEEP THE LABEL MEANINGFUL — pass "Submitting…", not a bare spinner. A control that
   * loses its name mid-action is unusable with a screen reader, and this component
   * deliberately does not swap the label for you.
   */
  loading?: boolean;
  /**
   * Stretch to the full width of the container. @default false
   *
   * The older guidance was to wrap the button in a full-width container instead, which
   * is correct in principle and was ignored everywhere it mattered — consumers reached
   * for `className` and got the behaviour without the token discipline. This is the
   * supported spelling of what they were already doing.
   */
  fullWidth?: boolean;
  /**
   * Keep the label on one line. @default false
   *
   * Labels WRAP by default as of 2026-09-03. A button that refuses to wrap does not
   * shrink — it overflows and takes the page's horizontal scrollbar with it, which on a
   * 320px bilingual government page is the common case rather than the edge. Opt in to
   * `nowrap` only where one line is structural: a segmented control, a toolbar.
   */
  nowrap?: boolean;
  /**
   * Render the disabled state as `aria-disabled` rather than the native attribute, so the
   * control stays focusable and a screen-reader user can still find it. @default false
   *
   * A natively `disabled` button is removed from the tab order, which means a reader
   * navigating by keyboard never learns it exists — they cannot discover that the form
   * has a submit at all, only that nothing responds. Primer, Spectrum and Carbon all
   * offer this for that reason. It is OPT-IN and not the default, because switching every
   * disabled button in the estate into the tab order would change tab order on pages
   * nobody has re-tested.
   *
   * The control is still genuinely inoperable: click and key activation are both
   * suppressed, and `aria-disabled` tells assistive technology so.
   *
   * Ignored on the `href` form, which is already `aria-disabled` — an anchor cannot take
   * the native attribute at all.
   */
  preserveFocus?: boolean;
}

/**
 * MoSJE / UX4G Button atom.
 *
 * Renders a real `<button>`, styled entirely via semantic CSS classes
 * (`.ds-btn`, `.ds-btn--<variant>`, `.ds-btn--<appearance>`, `.ds-btn--<size>`)
 * that reference design tokens as CSS variables. No Tailwind, no deps.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      appearance = "filled",
      tone = "default",
      size = "md",
      iconLeft,
      iconRight,
      className,
      type = "button",
      href,
      // Pulled out of `rest` so the button form never emits anchor attributes onto a
      // <button>, which React would pass straight through to invalid DOM.
      target,
      rel: relProp,
      download,
      disabled,
      loading = false,
      fullWidth = false,
      nowrap = false,
      preserveFocus = false,
      children,
      ...rest
    },
    ref,
  ) {
    /**
     * `tone` and the two deprecated appearance words collapse onto the SAME two classes,
     * so there is one styling path rather than two that can drift. The alias is resolved
     * here, at the edge, and nothing downstream needs to know which spelling arrived.
     */
    const inverse = tone === "inverse" || appearance === "inverse" || appearance === "inverseOutlined";
    const resolvedAppearance = inverse
      ? appearance === "outlined" || appearance === "inverseOutlined"
        ? "inverseOutlined"
        : appearance === "text"
          ? // THE THIRD CASE, AND IT WAS MISSING. `tone="inverse"` first shipped mapping
            // anything-not-outlined to the white FILLED pill, so a text button on a brand
            // surface silently became a solid white block — the loudest control on the page
            // where the quietest was asked for. Found by rendering all twelve combinations
            // in Figma rather than by reading the branch: the code path looked reasonable.
            "inverseText"
          : "inverse"
      : appearance;

    // Busy implies disabled. A button that says "Submitting…" and still submits is the
    // double-submission this prop exists to prevent.
    const isDisabled = disabled === true || loading;

    const classes = cn(
      "ds-btn",
      `ds-btn--${variant}`,
      `ds-btn--${resolvedAppearance}`,
      `ds-btn--${size}`,
      fullWidth && "ds-btn--full",
      nowrap && "ds-btn--nowrap",
      className,
    );
    const content = (
      <>
        {/*
          THE BUSY STATE HAD NO VISIBLE INDICATOR, WHICH MADE IT INVISIBLE TO THE PEOPLE
          WHO CAN SEE. `loading` shipped on 2026-08-27 setting `aria-busy` and disabling
          the control, and nothing else — so a screen-reader user was told the button was
          busy and a sighted user saw a greyed-out button indistinguishable from one they
          were never allowed to press. Half an accessible state is not an accessible state.

          The spinner takes the LEADING ICON'S PLACE rather than being added beside it, so
          a button with an icon does not change width the moment it is pressed — the
          commonest cause of a mis-click on the control next to it.

          It is `aria-hidden` deliberately: the button already carries `aria-busy` and its
          own label. Reusing the `Loader` component here would nest a `role="status"` live
          region inside an already-busy control and announce twice.
        */}
        {loading && <span className="ds-btn__spinner" aria-hidden="true" />}
        {/*
          THE SIDE IS IN THE CLASS, NOT IN THE POSITION.
          `.ds-btn__icon:last-child` looked like a fair way to find a trailing icon and
          is not: the label is a bare TEXT NODE, not an element, so a LEADING icon is
          also the last element child and picked up the trailing rule too — both sides
          compensated, on a button with one icon. Naming the side removes the guess.
        */}
        {iconLeft != null && !loading && (
          <span className="ds-btn__icon ds-btn__icon--start" aria-hidden="true">
            {iconLeft}
          </span>
        )}
        {children}
        {iconRight != null && (
          <span className="ds-btn__icon ds-btn__icon--end" aria-hidden="true">
            {iconRight}
          </span>
        )}
      </>
    );

    if (href != null) {
      /**
       * A DISABLED LINK-BUTTON DROPS `href`. IT DOES NOT SWALLOW EVENTS.
       *
       * `disabled` is not a valid attribute on an anchor, so `<a disabled href>` is
       * simply an ordinary link: measured on 2026-08-25 as pointer-events:auto,
       * opacity:1, cursor:pointer, aria-disabled:null and keyboard-focusable — while
       * looking, to the person who wrote it, exactly like a disabled button.
       *
       * Removing `href` is what makes it genuinely inert, and it is better than the
       * alternatives for a reason worth keeping: an anchor without `href` is not
       * focusable and not activatable by the browser's own rules. So there is no
       * click handler to get wrong, no keydown handler to forget, and no `tabIndex`
       * to keep in sync with the disabled state. The element stays an `<a>`, because
       * what it IS has not changed — only whether it currently leads anywhere.
       *
       * `aria-disabled` carries the state to assistive tech (there is no native
       * `disabled` to read), and `.ds-btn[aria-disabled="true"]` in button.css
       * already paints every appearance's disabled treatment.
       *
       * Pinned in `e2e/design-system/button.spec.ts`.
       */
      const anchorRest = rest as unknown as React.AnchorHTMLAttributes<HTMLAnchorElement>;
      /*
       * A NEW-TAB LINK CARRIES `rel` WHETHER OR NOT THE CALLER REMEMBERED.
       *
       * `target="_blank"` hands the opened page a `window.opener` reference back to
       * this one, which lets it navigate the original tab somewhere else — the
       * reverse-tabnabbing problem. Modern browsers imply `noopener` for
       * `target="_blank"`, but "modern" is doing real work in that sentence on a
       * government estate that must serve older Android WebViews, and `noreferrer`
       * is not implied anywhere.
       *
       * An explicit `rel` from the caller WINS: someone who wrote `rel="opener"`
       * meant it, and silently overriding a security-relevant attribute they set on
       * purpose is worse than the default this replaces.
       */
      const rel = relProp ?? (target === "_blank" ? "noopener noreferrer" : undefined);
      return (
        <a
          className={classes}
          {...anchorRest}
          {...(target != null ? { target } : {})}
          {...(rel != null ? { rel } : {})}
          {...(download != null ? { download } : {})}
          {...(loading ? { "aria-busy": "true" as const } : {})}
          {...(isDisabled
            ? { role: "link" as const, "aria-disabled": "true" as const }
            : { href })}
        >
          {content}
        </a>
      );
    }

    /*
     * `preserveFocus` KEEPS A DISABLED CONTROL DISCOVERABLE WITHOUT MAKING IT OPERABLE.
     *
     * A natively `disabled` button leaves the tab order entirely, so a reader navigating
     * by keyboard never learns the control is there — the form appears to have no submit
     * rather than a submit they may not press yet. `aria-disabled` keeps it reachable and
     * announced as dimmed.
     *
     * Reachable is not pressable. The native attribute was doing three jobs — suppressing
     * click, suppressing Enter/Space, and leaving the tab order — and dropping it means
     * taking the first two back by hand. Both handlers run BEFORE the caller's, and both
     * `preventDefault` and `stopPropagation`, so a click never reaches an `onClick` and a
     * keypress never reaches a form. `type` is forced to "button" so the browser's own
     * implicit submission cannot fire either — that last one is the leak this pattern is
     * usually shipped with.
     */
    const softDisabled = preserveFocus && isDisabled;
    const block = (e: React.SyntheticEvent): void => {
      e.preventDefault();
      e.stopPropagation();
    };

    return (
      <button
        ref={ref}
        type={softDisabled ? "button" : type}
        className={classes}
        disabled={softDisabled ? undefined : isDisabled}
        aria-disabled={softDisabled || undefined}
        aria-busy={loading || undefined}
        {...rest}
        {...(softDisabled
          ? {
              onClick: block,
              onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => {
                if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") block(e);
              },
            }
          : {})}
      >
        {content}
      </button>
    );
  },
);

/**
 * Returns the CSS class string for a button variant without rendering the button.
 * Use when you need a `next/link` or other element styled as a DS button:
 *   <Link href="/path" className={buttonClasses("primary", "filled", "md")}>Label</Link>
 */
export function buttonClasses(
  variant: ButtonVariant = "primary",
  appearance: ButtonAppearance = "filled",
  size: ButtonSize = "md",
  className?: string,
  /**
   * The ground the element sits on. Added 2026-09-03 — the helper could express three of
   * the component's four axes, so a `next/link` styled as a button on a navy header had
   * no way to ask for the inverse treatment and consumers hand-wrote the class. It is the
   * FIFTH parameter rather than sitting beside `size` so that every existing call keeps
   * working unchanged.
   */
  tone: ButtonTone = "default",
  /**
   * Layout options, added 2026-09-03. The component gained `fullWidth` and `nowrap` and
   * this helper did not — so the 83 call sites that style a `next/link` as a button could
   * not make one full width, which is the mobile-submit case `fullWidth` exists for. They
   * are trailing parameters so every existing call keeps working untouched.
   */
  options: { fullWidth?: boolean; nowrap?: boolean } = {},
): string {
  // Resolved exactly as the component resolves it, rather than in parallel — a second
  // copy of this branch is how `tone="inverse" appearance="text"` came to render as a
  // solid white pill the first time it shipped.
  const inverse = tone === "inverse" || appearance === "inverse" || appearance === "inverseOutlined";
  const resolved = inverse
    ? appearance === "outlined" || appearance === "inverseOutlined"
      ? "inverseOutlined"
      : appearance === "text"
        ? "inverseText"
        : "inverse"
    : appearance;
  return cn(
    "ds-btn",
    `ds-btn--${variant}`,
    `ds-btn--${resolved}`,
    `ds-btn--${size}`,
    options.fullWidth === true && "ds-btn--full",
    options.nowrap === true && "ds-btn--nowrap",
    className,
  );
}
