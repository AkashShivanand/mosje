"use client";

import * as React from "react";

export interface TooltipState {
  x: number;
  y: number;
  node: React.ReactNode;
}

export interface ChartTooltipController {
  canvasRef: React.RefObject<HTMLDivElement | null>;
  tip: TooltipState | null;
  /** Show the tooltip at a client (viewport) coordinate; positioned over the canvas. */
  show(node: React.ReactNode, clientX: number, clientY: number): void;
  hide(): void;
}

/**
 * Shared tooltip controller. Charts attach `canvasRef` to the `ChartFrame`
 * canvas and call `show`/`hide` from pointer + focus handlers so tooltips work
 * with both mouse and keyboard.
 */
export function useChartTooltip(): ChartTooltipController {
  const canvasRef = React.useRef<HTMLDivElement>(null);
  const [tip, setTip] = React.useState<TooltipState | null>(null);

  const show = React.useCallback((node: React.ReactNode, clientX: number, clientY: number) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTip({ x: clientX - rect.left, y: clientY - rect.top, node });
  }, []);

  const hide = React.useCallback(() => setTip(null), []);

  return { canvasRef, tip, show, hide };
}

/** Floating HTML tooltip rendered inside the (position:relative) chart canvas. */
export function ChartTooltip({ tip }: { tip: TooltipState | null }) {
  if (!tip) return null;
  return (
    <div
      className="ds-chart__tooltip"
      style={{ left: tip.x, top: tip.y }}
      role="status"
      aria-live="polite"
    >
      {tip.node}
    </div>
  );
}
