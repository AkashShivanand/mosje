"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import "./dashboard.css";

export interface FilterBarProps {
  /** Optional leading label/heading for the bar. */
  title?: string;
  /** Filter controls (Select, Search, SegmentedControl, buttons…). */
  children: React.ReactNode;
  className?: string;
}

/**
 * MoSJE / SAMAVESH FilterBar — a styled row that hosts dashboard filter
 * controls (date range, segmented period, search). Layout-only; drop DS form
 * controls or a `SegmentedControl` inside.
 */
export function FilterBar({ title, children, className }: FilterBarProps) {
  return (
    <div className={cn("ds-filter-bar", className)}>
      {title && <span className="ds-filter-bar__title">{title}</span>}
      <div className="ds-filter-bar__controls">{children}</div>
    </div>
  );
}

export interface SegmentedOption<T extends string> {
  label: string;
  value: T;
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Accessible group label (e.g. "Period"). */
  ariaLabel: string;
  className?: string;
}

/**
 * Accessible segmented control (single-select). Common for dashboard period
 * toggles (FY / Quarter / Month), and for a verdict — Verified / Needs Correction.
 * Renders an ARIA radiogroup.
 *
 * KEYBOARD: the WAI-ARIA radio-group pattern, which a group of plain buttons
 * does not get for free. The group is ONE tab stop — only the selected option is
 * in the tab order — and the arrow keys move between options, selecting as they
 * go, with Home and End for the ends. Left/Up go back and Right/Down forward,
 * whichever way the control is laid out, and the ends wrap.
 *
 * It matters most where the control is a decision rather than a filter: an
 * officer giving twenty document verdicts should never have to reach for the
 * mouse, and before this each option was its own tab stop, so a row of three
 * cost three Tabs and Enter.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  className,
}: SegmentedControlProps<T>) {
  const group = React.useRef<HTMLDivElement>(null);

  /* Selection FOLLOWS focus, which is the pattern's default for a radio group: the reader is
     choosing, not browsing, and a control that needs Space after the arrow key is a control most
     people never finish operating. */
  const move = (from: number, delta: number) => {
    const next = (from + delta + options.length) % options.length;
    const opt = options[next];
    if (!opt) return;
    onChange(opt.value);
    const buttons = group.current?.querySelectorAll<HTMLButtonElement>(".ds-segmented__option");
    buttons?.[next]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault();
        move(index, 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault();
        move(index, -1);
        break;
      case "Home":
        e.preventDefault();
        move(-1, 1);
        break;
      case "End":
        e.preventDefault();
        move(0, -1);
        break;
      default:
        break;
    }
  };

  /* Where nothing is selected yet — a verdict not given — the FIRST option holds the tab stop,
     so the group is still reachable. A group with no tab stop at all is a control the keyboard
     cannot get into. */
  const selectedIndex = options.findIndex((o) => o.value === value);
  const tabIndexOf = (index: number) => (index === (selectedIndex === -1 ? 0 : selectedIndex) ? 0 : -1);

  return (
    <div ref={group} className={cn("ds-segmented", className)} role="radiogroup" aria-label={ariaLabel}>
      {options.map((opt, index) => {
        const selected = opt.value === value;
        return (
          /* raw-button-ok(primitive): a role="radio" option in a radiogroup — SegmentedControl owns the roving tabindex and aria-checked */
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={tabIndexOf(index)}
            className={cn("ds-segmented__option", selected && "ds-segmented__option--active")}
            onClick={() => onChange(opt.value)}
            onKeyDown={(e) => onKeyDown(e, index)}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
