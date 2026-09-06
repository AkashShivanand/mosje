"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import "./slider.css";

export interface SliderMark {
  value: number;
  label: string;
}

interface SliderBaseProps {
  min?: number;
  max?: number;
  /** @default 1 */
  step?: number;
  disabled?: boolean;
  /** @default "md" */
  size?: "md" | "sm";
  /**
   * Ticks under the track. Keep them few — a mark every step turns the track
   * into a ruler nobody reads. Three or four is usually the whole story.
   */
  marks?: SliderMark[];
  /**
   * How a value is written out, for the readout and for the thumb's spoken
   * value. Pass one whenever the number has a unit — "₹ 4,50,000" and
   * "450000" are not the same information.
   */
  formatValue?: (value: number) => string;
  className?: string;
}

export interface SliderProps extends SliderBaseProps {
  /** Controlled value. */
  value: number;
  onValueChange: (value: number) => void;
  /**
   * The control's accessible name. Required unless `aria-labelledby` points at
   * a visible label — a slider announced as "slider, 40" says nothing about
   * what is at 40.
   */
  "aria-label"?: string;
  "aria-labelledby"?: string;
  /** Show the current value beside the track. @default true */
  showValue?: boolean;
}

export interface RangeSliderProps extends SliderBaseProps {
  /** Controlled `[from, to]`. The component keeps them ordered. */
  value: [number, number];
  onValueChange: (value: [number, number]) => void;
  /**
   * Names the pair — "Grant amount". Each thumb takes its own name from this
   * plus `fromLabel` / `toLabel`, so a screen reader says "Grant amount,
   * minimum" rather than "slider" twice.
   */
  label: string;
  /** @default "minimum" */
  fromLabel?: string;
  /** @default "maximum" */
  toLabel?: string;
  /** Show the current range beside the track. @default true */
  showValue?: boolean;
}

/** Where `value` sits between min and max, as a percentage. */
function percent(value: number, min: number, max: number): number {
  if (max === min) return 0;
  return ((value - min) / (max - min)) * 100;
}

function Marks({
  marks,
  min,
  max,
  format,
}: {
  marks: SliderMark[];
  min: number;
  max: number;
  format: (v: number) => string;
}): React.JSX.Element {
  return (
    <div className="ds-slider__marks" aria-hidden>
      {marks.map((mark) => (
        <span
          key={mark.value}
          className="ds-slider__mark"
          style={{ left: `${percent(mark.value, min, max)}%` }}
        >
          {mark.label || format(mark.value)}
        </span>
      ))}
    </div>
  );
}

/**
 * MoSJE / SAMAVESH Slider.
 *
 * A bounded numeric choice where the reader cares about *roughly where* rather
 * than *exactly what* — a fund range in a filter, a radius, a year.
 *
 * It is a real `<input type="range">`. That is not a shortcut: the native
 * control already carries the spinbutton keyboard model (arrows, Page Up and
 * Page Down, Home and End), announces its value and its bounds, and is the one
 * form control that assistive technology and mobile browsers both handle
 * correctly. A div with a draggable dot has to reimplement all of that and
 * usually reimplements the visible half only.
 *
 * **Never the only way to enter a value that matters.** WCAG 2.5.7 requires a
 * single-pointer alternative to dragging, which the arrow keys provide — but a
 * reader who knows they want ₹4,50,000 should be able to type it. Pair a slider
 * with a `NumberInput` wherever the exact figure is the point; use the slider
 * alone only for a coarse filter.
 */
export function Slider({
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  size = "md",
  marks,
  formatValue,
  showValue = true,
  className,
  ...aria
}: SliderProps): React.JSX.Element {
  const format = formatValue ?? ((v: number) => String(v));
  const pct = percent(value, min, max);

  return (
    <div
      className={cn("ds-slider", `ds-slider--${size}`, disabled && "ds-slider--disabled", className)}
    >
      <div className="ds-slider__track-row">
        <input
          type="range"
          className="ds-slider__input"
          // The filled portion of the track is painted from this, so the fill
          // and the thumb cannot disagree about where the value is.
          style={{ "--ds-slider-pct": `${pct}%` } as React.CSSProperties}
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          // The number alone is rarely the information. "40" and "₹ 40,000" are
          // read out very differently, and the second one is what was meant.
          aria-valuetext={formatValue ? format(value) : undefined}
          onChange={(e) => onValueChange(Number(e.target.value))}
          {...aria}
        />
        {showValue ? (
          <output className="ds-slider__readout">{format(value)}</output>
        ) : null}
      </div>
      {marks?.length ? <Marks marks={marks} min={min} max={max} format={format} /> : null}
    </div>
  );
}

/**
 * MoSJE / SAMAVESH Range Slider.
 *
 * Two bounds on one track — a grant band, a date span, an age group.
 *
 * It is **two real `<input type="range">` elements**, overlaid, not one track
 * with two dots. Each thumb is therefore a genuine slider with its own
 * accessible name, its own keyboard model and its own announced value, which is
 * the only arrangement a screen-reader user can actually operate. The names are
 * derived from `label` — "Grant amount, minimum" and "Grant amount, maximum" —
 * because two controls both announced as "slider" are indistinguishable.
 *
 * The two values are kept in order: dragging the lower thumb past the upper one
 * stops at it rather than swapping them, so the reader never loses track of
 * which thumb they are holding.
 */
export function RangeSlider({
  value,
  onValueChange,
  label,
  fromLabel = "minimum",
  toLabel = "maximum",
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  size = "md",
  marks,
  formatValue,
  showValue = true,
  className,
}: RangeSliderProps): React.JSX.Element {
  const format = formatValue ?? ((v: number) => String(v));
  const [from, to] = value;
  const fromPct = percent(from, min, max);
  const toPct = percent(to, min, max);

  return (
    <div
      className={cn(
        "ds-slider",
        "ds-slider--range",
        `ds-slider--${size}`,
        disabled && "ds-slider--disabled",
        className,
      )}
    >
      <div className="ds-slider__track-row">
        <div
          className="ds-slider__pair"
          style={
            {
              "--ds-slider-from": `${fromPct}%`,
              "--ds-slider-to": `${toPct}%`,
            } as React.CSSProperties
          }
        >
          <input
            type="range"
            className="ds-slider__input ds-slider__input--from"
            min={min}
            max={max}
            step={step}
            value={from}
            disabled={disabled}
            aria-label={`${label}, ${fromLabel}`}
            aria-valuetext={formatValue ? format(from) : undefined}
            // Clamped rather than swapped: a thumb that jumps past its partner
            // and changes identity mid-drag is impossible to follow, and
            // impossible to describe to a screen-reader user at all.
            onChange={(e) => onValueChange([Math.min(Number(e.target.value), to), to])}
          />
          <input
            type="range"
            className="ds-slider__input ds-slider__input--to"
            min={min}
            max={max}
            step={step}
            value={to}
            disabled={disabled}
            aria-label={`${label}, ${toLabel}`}
            aria-valuetext={formatValue ? format(to) : undefined}
            onChange={(e) => onValueChange([from, Math.max(Number(e.target.value), from)])}
          />
        </div>
        {showValue ? (
          <output className="ds-slider__readout">
            {format(from)} – {format(to)}
          </output>
        ) : null}
      </div>
      {marks?.length ? <Marks marks={marks} min={min} max={max} format={format} /> : null}
    </div>
  );
}
