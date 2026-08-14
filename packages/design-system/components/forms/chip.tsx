"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import "./chip.css";

export interface ChipProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** Controlled selected state. When provided the chip behaves as a toggle. */
  selected?: boolean;
  /** Called with the next selected value when the chip is toggled. */
  onSelectedChange?: (selected: boolean) => void;
  /** Optional icon rendered before the label. */
  leadingIcon?: React.ReactNode;
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
    onSelectedChange,
    leadingIcon,
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
        selected && "ds-chip--selected",
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
