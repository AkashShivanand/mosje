"use client";

import * as React from "react";
import { cn } from "../utils/cn";
import { useColorMode } from "./color-mode-provider";
import "./color-mode-switcher.css";

export interface ColorModeSwitcherProps {
  className?: string;
  /** Accessible label for the control group. */
  label?: string;
  /** Hide the visible text label, keeping swatches only. */
  hideLabel?: boolean;
  /** Render swatches without their text names (icon-only, compact). */
  compact?: boolean;
}

/**
 * Accessible color-mode picker. Implemented as a WAI-ARIA radiogroup with a
 * roving tabindex (arrow keys move + select, Home/End jump). Token-driven —
 * adapts automatically as modes are added in `@mosje/design-system` color-mode.
 */
export function ColorModeSwitcher({
  className,
  label = "Colour mode",
  hideLabel = false,
  compact = false,
}: ColorModeSwitcherProps): React.JSX.Element {
  const { mode, setMode, modes } = useColorMode();
  const btnRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

  const focusAndSelect = (index: number) => {
    const next = (index + modes.length) % modes.length;
    const target = modes[next];
    if (!target) return;
    setMode(target.id);
    btnRefs.current[next]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        focusAndSelect(index + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        focusAndSelect(index - 1);
        break;
      case "Home":
        event.preventDefault();
        focusAndSelect(0);
        break;
      case "End":
        event.preventDefault();
        focusAndSelect(modes.length - 1);
        break;
      default:
        break;
    }
  };

  return (
    <div className={cn("ds-color-switch", compact && "ds-color-switch--compact", className)}>
      {!hideLabel && (
        <span className="ds-color-switch__label">{label}</span>
      )}
      <div role="radiogroup" aria-label={label} className="ds-color-switch__group">
        {modes.map((m, i) => {
          const checked = m.id === mode;
          return (
            <button
              key={m.id}
              ref={(el) => {
                btnRefs.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={checked}
              aria-label={m.label}
              tabIndex={checked ? 0 : -1}
              title={m.label}
              className={cn("ds-color-switch__btn", checked && "is-active")}
              onClick={() => setMode(m.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
            >
              <span
                className="ds-color-switch__swatch"
                style={{ background: m.swatch }}
                aria-hidden="true"
              />
              {!compact && <span className="ds-color-switch__name">{m.label}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
