"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import "./chip.css";

export type ChipTone = "brand" | "success";

export type ChipSize = "sm" | "md";

export interface ChipProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** Controlled selected state. When provided the chip behaves as a toggle. */
  selected?: boolean;
  /**
   * Pill size. @default "md"
   *
   * `sm` is for a DENSE FILTER ROW — several chips sharing a line with other
   * controls, where `md`'s 32px and its 8/12 padding push the row onto a
   * second line. PM-AJAY's map is the case that asked for it: two legend keys
   * plus three type filters needed 816px of an 798px bar and wrapped, and the
   * eighteen pixels are not worth a second row above a map.
   *
   * It stays past the 24px minimum target (WCAG 2.2 SC 2.5.8). Do not reach
   * for it to fit more chips into a space that is simply too small — that is
   * the same trade paid twice, and the second payment is legibility.
   */
  size?: ChipSize;
  /**
   * Which family the SELECTED state paints in. `brand` (the default) is the
   * estate's blue selection colour and is right almost everywhere.
   *
   * `success` exists for chips sitting on a surface that has no blue in it —
   * the SAMAVESH banner's saffron/green drawer being the case that asked for
   * it, where a blue pill was a third colour family on a two-family panel.
   * It changes the SELECTED state only; an unselected chip is identical.
   * @default "brand"
   */
  tone?: ChipTone;
  /** Called with the next selected value when the chip is toggled. */
  onSelectedChange?: (selected: boolean) => void;
  /** Optional icon rendered before the label. */
  leadingIcon?: React.ReactNode;
  /**
   * A trailing count — how many things this chip selects.
   *
   * WHY THIS IS A PROP AND NOT SOMETHING YOU WRITE INTO THE LABEL. Two callers
   * were already doing it and they disagreed: `DocumentLibrary` rendered
   * `{group} ({count})` inside the children, PM-AJAY's map appended a muted
   * `<span>`. Same idea, two typographic answers, one of them inside the design
   * system. A count is the commonest thing a filter chip carries, so it gets
   * one rendering here — muted, tabular-figured, and outside the label so a
   * screen reader hears "Guidelines, 2 items" rather than "Guidelines open
   * bracket two close bracket".
   *
   * Pass a string when the figure needs the estate's own grouping —
   * `formatIndian(n)` — rather than a bare `number`.
   */
  count?: number | string;
  /**
   * What one unit of `count` is, for assistive technology. @default "items"
   */
  countLabel?: string;
  /** When provided, renders a trailing dismiss (×) button. */
  onDismiss?: () => void;
  /** Accessible label for the dismiss button. @default "Remove" */
  dismissLabel?: string;
  /** Renders a trailing chevron marking the chip as a dropdown trigger (Portal DS). */
  trailingDropdown?: boolean;
  /** Disables interaction and dims the chip. */
  disabled?: boolean;
}

/**
 * MoSJE / UX4G Chip atom.
 *
 * A compact, pill-shaped element for filters, selections and removable tags.
 * Controlled selection via `selected` + `onSelectedChange`; optional trailing
 * dismiss. When interactive (toggle or dismiss) it is keyboard-operable
 * (Enter/Space toggles). Styled entirely via semantic CSS classes that
 * reference design tokens (--sa-*). No Tailwind, no deps.
 */
export const Chip = React.forwardRef<HTMLDivElement, ChipProps>(function Chip(
  {
    selected = false,
    size = "md",
    tone = "brand",
    onSelectedChange,
    leadingIcon,
    count,
    countLabel = "items",
    onDismiss,
    dismissLabel = "Remove",
    trailingDropdown = false,
    disabled = false,
    className,
    children,
    onClick,
    onKeyDown,
    ...rest
  },
  ref,
) {
  const interactive = onSelectedChange != null;

  const toggle = React.useCallback(() => {
    if (disabled || !interactive) return;
    onSelectedChange?.(!selected);
  }, [disabled, interactive, onSelectedChange, selected]);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    toggle();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (!interactive || disabled) return;
    if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
      event.preventDefault();
      toggle();
    }
  };

  const handleDismiss = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (disabled) return;
    onDismiss?.();
  };

  return (
    <div
      ref={ref}
      className={cn(
        "ds-chip",
        `ds-chip--${size}`,
        selected && "ds-chip--selected",
        selected && tone !== "brand" && `ds-chip--selected-${tone}`,
        disabled && "ds-chip--disabled",
        interactive && "ds-chip--interactive",
        className,
      )}
      role={interactive ? "button" : undefined}
      tabIndex={interactive && !disabled ? 0 : undefined}
      aria-pressed={interactive ? selected : undefined}
      aria-disabled={disabled || undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {leadingIcon != null && (
        <span className="ds-chip__icon" aria-hidden="true">
          {leadingIcon}
        </span>
      )}
      <span className="ds-chip__label">{children}</span>
      {count != null && (
        <span className="ds-chip__count">
          {count}
          <span className="ds-sr-only">{` ${countLabel}`}</span>
        </span>
      )}
      {trailingDropdown && (
        <span className="ds-chip__icon ds-chip__chevron" aria-hidden="true">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            focusable="false"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      )}
      {onDismiss != null && (
        <button
          type="button"
          className="ds-chip__dismiss"
          aria-label={dismissLabel}
          tabIndex={disabled ? -1 : 0}
          disabled={disabled}
          onClick={handleDismiss}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      )}
    </div>
  );
});
