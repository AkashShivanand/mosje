"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// Leaf-vine motif echoing the Nasha Mukt Bharat Abhiyaan logo (a cascading branch
// of leaves). Decorative only (aria-hidden). Pass `animate` for a gentle one-time
// settle on mount; it is disabled under prefers-reduced-motion.
const LEAVES = [
  { cx: 24, cy: 26, rx: 13, ry: 6, rot: -32 },
  { cx: 52, cy: 40, rx: 13, ry: 6, rot: 28 },
  { cx: 22, cy: 58, rx: 14, ry: 6.5, rot: -34 },
  { cx: 52, cy: 76, rx: 14, ry: 6.5, rot: 30 },
  { cx: 24, cy: 96, rx: 13, ry: 6, rot: -30 },
  { cx: 50, cy: 114, rx: 12, ry: 5.5, rot: 26 },
  { cx: 30, cy: 132, rx: 11, ry: 5, rot: -24 },
];

export function LeafVine({
  className,
  style,
  animate = false,
}: {
  className?: string;
  style?: React.CSSProperties;
  animate?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 80 150"
      fill="none"
      className={cn("leafvine", animate && "leafvine--animate", className)}
      style={style}
      aria-hidden="true"
    >
      <path
        d="M40 4 C 30 40, 30 90, 34 140"
        stroke="currentColor"
        strokeWidth={2.4}
        strokeLinecap="round"
        className="leafvine__stem"
      />
      {LEAVES.map((l, i) => (
        <g key={i} className="lf" style={{ "--i": i } as React.CSSProperties}>
          <ellipse
            cx={l.cx}
            cy={l.cy}
            rx={l.rx}
            ry={l.ry}
            transform={`rotate(${l.rot} ${l.cx} ${l.cy})`}
            fill="currentColor"
          />
        </g>
      ))}
      <style>{`
        @keyframes leafvineSettle { from { opacity: 0; transform: translateY(7px); } to { opacity: 1; transform: none; } }
        @keyframes leafvineStem { from { stroke-dashoffset: 210; } to { stroke-dashoffset: 0; } }
        .leafvine--animate .lf { opacity: 0; transform-box: fill-box; animation: leafvineSettle .55s cubic-bezier(.2,.7,.2,1) both; animation-delay: calc(var(--i) * .07s + .12s); }
        .leafvine--animate .leafvine__stem { stroke-dasharray: 210; animation: leafvineStem .7s ease-out both; }
        @media (prefers-reduced-motion: reduce) {
          .leafvine--animate .lf, .leafvine--animate .leafvine__stem { animation: none; opacity: 1; stroke-dashoffset: 0; transform: none; }
        }
      `}</style>
    </svg>
  );
}
