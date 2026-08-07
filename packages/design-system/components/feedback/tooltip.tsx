"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "../../utils/cn";
import "./tooltip.css";

export type TooltipSide = "top" | "bottom" | "left" | "right";

export interface TooltipProps {
  /** The tooltip text. Keep it short — this is a hint, not documentation. */
  content: React.ReactNode;
  /** Preferred side. Flips automatically when there is no room. @default "top" */
  side?: TooltipSide;
  /** Gap between the trigger and the bubble, in px. @default 6 */
  sideOffset?: number;
  /** Delay before opening on hover, in ms. Focus always opens instantly. @default 200 */
  delay?: number;
  /** Disable the tooltip without unmounting the trigger. */
  disabled?: boolean;
  className?: string;
  /**
   * The trigger. Must be a single element that can hold a ref and receive
   * mouse/focus handlers — a `<button>`, `<a>`, or DS component that forwards
   * its ref. Wrap plain text in a focusable element; a tooltip that only opens
   * on hover is unreachable by keyboard.
   */
  children: React.ReactElement;
}

interface Coords {
  top: number;
  left: number;
  side: TooltipSide;
}

/**
 * Flip to the opposite side when the preferred one would overflow the viewport.
 *
 * Exported for unit tests only — not re-exported from the package barrel.
 */
export function resolveSide(
  preferred: TooltipSide,
  trigger: DOMRect,
  bubble: DOMRect,
  offset: number,
): TooltipSide {
  const fits = {
    top: trigger.top - bubble.height - offset >= 0,
    bottom: trigger.bottom + bubble.height + offset <= window.innerHeight,
    left: trigger.left - bubble.width - offset >= 0,
    right: trigger.right + bubble.width + offset <= window.innerWidth,
  };
  if (fits[preferred]) return preferred;
  const opposite: Record<TooltipSide, TooltipSide> = {
    top: "bottom",
    bottom: "top",
    left: "right",
    right: "left",
  };
  return fits[opposite[preferred]] ? opposite[preferred] : preferred;
}

/** Exported for unit tests only — not re-exported from the package barrel. */
export function computeCoords(
  trigger: DOMRect,
  bubble: DOMRect,
  side: TooltipSide,
  offset: number,
): Coords {
  let top = 0;
  let left = 0;
  switch (side) {
    case "top":
      top = trigger.top - bubble.height - offset;
      left = trigger.left + trigger.width / 2 - bubble.width / 2;
      break;
    case "bottom":
      top = trigger.bottom + offset;
      left = trigger.left + trigger.width / 2 - bubble.width / 2;
      break;
    case "left":
      top = trigger.top + trigger.height / 2 - bubble.height / 2;
      left = trigger.left - bubble.width - offset;
      break;
    case "right":
      top = trigger.top + trigger.height / 2 - bubble.height / 2;
      left = trigger.right + offset;
      break;
  }
  // Keep the bubble inside the viewport on the cross axis.
  const margin = 8;
  left = Math.min(
    Math.max(margin, left),
    window.innerWidth - bubble.width - margin,
  );
  top = Math.min(
    Math.max(margin, top),
    window.innerHeight - bubble.height - margin,
  );
  return { top, left, side };
}

/**
 * MoSJE / SAMAVESH Tooltip.
 *
 * A hint bubble on hover and focus. Replaces the Radix tooltip the smile-admin
 * portal used to import — same behaviour contract, no dependency.
 *
 * Meets WCAG 1.4.13 (Content on Hover or Focus):
 * - **Dismissible** — Escape closes it without moving focus.
 * - **Hoverable** — the bubble stays open while the pointer is over it, so a
 *   user zoomed in can move onto it to read it.
 * - **Persistent** — it stays until blur, pointer-leave, or Escape; it never
 *   times out on its own.
 *
 * Renders through a portal with `position: fixed`, so an ancestor's
 * `overflow: hidden` (every DataTable and Card in the estate) cannot clip it.
 *
 * A tooltip is never the only place information may live — it is unavailable to
 * touch users. Put anything essential in visible text.
 */
export function Tooltip({
  content,
  side = "top",
  sideOffset = 6,
  delay = 200,
  disabled = false,
  className,
  children,
}: TooltipProps): React.JSX.Element {
  const [open, setOpen] = React.useState(false);
  const [coords, setCoords] = React.useState<Coords | null>(null);
  const triggerRef = React.useRef<HTMLElement>(null);
  const bubbleRef = React.useRef<HTMLDivElement>(null);
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const tooltipId = React.useId();

  /**
   * Portals need a DOM node, which does not exist during SSR. Gate the portal
   * on a mounted flag so the server and first client render agree.
   */
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const show = React.useCallback(
    (immediate: boolean) => {
      if (disabled) return;
      clearTimeout(timer.current);
      if (immediate) setOpen(true);
      else timer.current = setTimeout(() => setOpen(true), delay);
    },
    [disabled, delay],
  );

  const hide = React.useCallback(() => {
    clearTimeout(timer.current);
    setOpen(false);
  }, []);

  React.useEffect(() => () => clearTimeout(timer.current), []);

  // Measure after the bubble is in the DOM, then again on scroll/resize so the
  // bubble tracks a trigger inside a scrolling table.
  React.useLayoutEffect(() => {
    if (!open) {
      setCoords(null);
      return;
    }
    const place = () => {
      const t = triggerRef.current?.getBoundingClientRect();
      const b = bubbleRef.current?.getBoundingClientRect();
      if (!t || !b) return;
      const resolved = resolveSide(side, t, b, sideOffset);
      setCoords(computeCoords(t, b, resolved, sideOffset));
    };
    place();
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [open, side, sideOffset]);

  // WCAG 1.4.13 "dismissible" — Escape closes without moving focus.
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") hide();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, hide]);

  const child = children as React.ReactElement<
    React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> }
  >;

  const trigger = React.cloneElement(child, {
    ref: triggerRef,
    // Describedby (not labelledby): the tooltip supplements the trigger's own
    // accessible name rather than replacing it.
    "aria-describedby": open ? tooltipId : undefined,
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      child.props.onMouseEnter?.(e);
      show(false);
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      child.props.onMouseLeave?.(e);
      hide();
    },
    onFocus: (e: React.FocusEvent<HTMLElement>) => {
      child.props.onFocus?.(e);
      show(true);
    },
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      child.props.onBlur?.(e);
      hide();
    },
  });

  return (
    <>
      {trigger}
      {mounted &&
        open &&
        createPortal(
          <div
            ref={bubbleRef}
            id={tooltipId}
            role="tooltip"
            className={cn(
              "ds-tooltip",
              `ds-tooltip--${coords?.side ?? side}`,
              className,
            )}
            style={{
              top: coords?.top ?? 0,
              left: coords?.left ?? 0,
              // Hide the pre-measurement frame: the bubble must be in the DOM
              // to be measured, but painting it at 0,0 first causes a visible
              // jump from the corner to its real position.
              visibility: coords ? "visible" : "hidden",
            }}
            // "Hoverable" — moving the pointer onto the bubble keeps it open.
            onMouseEnter={() => show(true)}
            onMouseLeave={hide}
          >
            {content}
          </div>,
          document.body,
        )}
    </>
  );
}
