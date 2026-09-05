"use client";

import * as React from "react";
import { ChartFrame, type ChartStateProps } from "./internal/chart-frame";
import { ChartTooltip, useChartTooltip } from "./internal/tooltip";
import { formatIndian } from "./internal/format";
import type { ValueFormat } from "./internal/format";
import { CHART_INK } from "./internal/palette";
import { INDIA_STATES_PATHS, INDIA_STATES_VIEWBOX } from "./geo/india-states.paths";

export interface IndiaBubbleDatum {
  /** State name. Matched case-insensitively; "and"/"&" are interchangeable. */
  state: string;
  value: number;
}

export interface IndiaBubbleMapProps extends ChartStateProps {
  data: IndiaBubbleDatum[];
  title: string;
  valueFormat?: ValueFormat;
  /**
   * Radius of the largest circle, in viewBox units (the map is 800×560).
   * @default 34
   */
  maxRadius?: number;
  /** Outline one state — the reader's own, or the row they are hovering. */
  highlightState?: string;
  /** Called with the state name when a circle is activated. */
  onSelectState?: (state: string) => void;
  className?: string;
}

/** Canonicalise state names so "Andaman & Nicobar" == "Andaman and Nicobar Islands". */
function normalize(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/islands?/g, "")
    .replace(/[^a-z]/g, "")
    .trim();
}

/**
 * Where to put a state's circle.
 *
 * DERIVED FROM THE PATHS, NOT STORED BESIDE THEM. A committed table of 36
 * centroids is a second copy of the geometry that no build checks, and the
 * geometry is itself generated — so the day someone regenerates the paths, a
 * stored table starts placing circles in the sea. Computing it here costs one
 * pass over ~7,000 points, once per module load, and cannot drift.
 *
 * THE LARGEST SUB-PATH WINS, rather than an average over all of them. Several
 * states are archipelagos or have exclaves, and averaging their vertices puts
 * Andaman and Nicobar's circle in open water between its island groups. Taking
 * the centroid of the biggest closed ring puts it on land, which is the only
 * property a reader cares about.
 */
interface Centroid {
  x: number;
  y: number;
}

const CENTROIDS: Map<string, Centroid> = (() => {
  const out = new Map<string, Centroid>();
  for (const region of INDIA_STATES_PATHS) {
    let best: { area: number; c: Centroid } | null = null;
    for (const ring of region.d.split("Z")) {
      const nums = ring.match(/-?\d+(?:\.\d+)?/g);
      if (!nums || nums.length < 6) continue;
      const pts: Centroid[] = [];
      for (let i = 0; i + 1 < nums.length; i += 2) {
        pts.push({ x: Number(nums[i]), y: Number(nums[i + 1]) });
      }
      // Shoelace. `area` is signed; only its magnitude matters for "biggest".
      let a2 = 0;
      let cx = 0;
      let cy = 0;
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i]!;
        const q = pts[(i + 1) % pts.length]!;
        const cross = p.x * q.y - q.x * p.y;
        a2 += cross;
        cx += (p.x + q.x) * cross;
        cy += (p.y + q.y) * cross;
      }
      const area = Math.abs(a2) / 2;
      // A degenerate ring has zero area and would divide by zero below; fall
      // back to the plain vertex mean, which is right for a sliver anyway.
      const c =
        Math.abs(a2) < 1e-6
          ? {
              x: pts.reduce((t, p) => t + p.x, 0) / pts.length,
              y: pts.reduce((t, p) => t + p.y, 0) / pts.length,
            }
          : { x: cx / (3 * a2), y: cy / (3 * a2) };
      if (!best || area > best.area) best = { area, c };
    }
    if (best) out.set(normalize(region.name), best.c);
  }
  return out;
})();

/**
 * MoSJE / SAMAVESH IndiaBubbleMap — one circle per state, **area** proportional
 * to the value.
 *
 * ── WHEN TO USE THIS INSTEAD OF `IndiaMap` ───────────────────────────────────
 *
 * `IndiaMap` shades the state itself, so the ink a state gets is its land area:
 * Rajasthan shouts and Delhi disappears, whatever the figures say. That is fine
 * for a rate — literacy, coverage, a percentage — where the quantity genuinely
 * belongs to the whole territory.
 *
 * It is wrong for a COUNT. Villages, hostels, offices, centres: these are things
 * standing at points, and a choropleth of counts systematically reports "big
 * state" as "big number". A circle carries its own area, so Delhi's 1 and
 * Rajasthan's 1,493 are drawn at their true ratio and the map stops lying about
 * geography.
 *
 * ── AREA, NOT RADIUS ─────────────────────────────────────────────────────────
 *
 * `r ∝ √v`. Scaling the RADIUS by the value squares the difference the reader
 * sees — a 4× count would draw 16× the ink — which is the single most common
 * error in bubble maps and the reason so many of them are unreadable.
 *
 * Circles are sorted big-to-small so the small ones draw on top and stay
 * clickable inside their larger neighbours; each is keyboard-reachable, and
 * `ChartFrame` emits the full screen-reader table, so nothing here is
 * mouse-only or sight-only.
 */
export function IndiaBubbleMap({
  data,
  title,
  valueFormat = formatIndian,
  maxRadius = 34,
  highlightState,
  onSelectState,
  className,
  state,
  onRetry,
  filterLabel,
  tableView,
}: IndiaBubbleMapProps) {
  const { canvasRef, tip, show, hide } = useChartTooltip();
  const hl = highlightState ? normalize(highlightState) : null;

  const max = Math.max(1, ...data.map((d) => d.value));

  const bubbles = React.useMemo(() => {
    return data
      .map((d) => {
        const c = CENTROIDS.get(normalize(d.state));
        if (!c || d.value <= 0) return null;
        return { ...d, ...c, r: maxRadius * Math.sqrt(d.value / max) };
      })
      .filter((b): b is IndiaBubbleDatum & Centroid & { r: number } => b !== null)
      // Largest first: later siblings paint on top, so the small circles stay
      // visible and hittable where they sit inside a larger one.
      .sort((a, b) => b.r - a.r);
  }, [data, max, maxRadius]);

  /*
   * WITH NO CIRCLES THIS DREW A COMPLETE GREY INDIA and summarised it as
   * "0 states, from Infinity to 1" — `Math.min()` over an empty array is
   * `Infinity`. The map read as finished and the summary read as broken.
   *
   * `bubbles`, not `data`: a caller can pass rows whose states do not resolve to
   * a centroid, or whose values are all zero, and get nothing drawn from data
   * that is not empty. The guard follows what would actually be painted.
   */
  const resolved = state ?? (bubbles.length === 0 ? "empty" : undefined);
  if (resolved)
    return (
      <ChartFrame
        marksAreFocusable
        title={title}
        viewBox={INDIA_STATES_VIEWBOX}
        className={className}
        state={resolved}
        onRetry={onRetry}
        filterLabel={filterLabel}
      >
        {null}
      </ChartFrame>
    );

  const tooltip = (name: string, value: number) => (
    <>
      <div className="ds-chart__tooltip-title">{name}</div>
      <div>{valueFormat(value)}</div>
    </>
  );

  return (
    <ChartFrame
      marksAreFocusable
      title={title}
      summary={`${title} — ${bubbles.length} states, from ${valueFormat(
        Math.min(...bubbles.map((b) => b.value)),
      )} to ${valueFormat(max)}`}
      viewBox={INDIA_STATES_VIEWBOX}
      className={className}
      canvasRef={canvasRef}
      overlay={<ChartTooltip tip={tip} />}
      onDismiss={hide}
      table={{
        columns: ["State", title],
        rows: [...data].sort((a, b) => b.value - a.value).map((d) => [d.state, d.value]),
      }}
      tableView={tableView}
    >
      {/* The land, drawn once and flat. It is the frame of reference, not the
          data — giving it any tone of its own competes with the circles. */}
      {INDIA_STATES_PATHS.map((region) => (
        <path
          key={region.id}
          d={region.d}
          fill={CHART_INK.regionEmpty}
          stroke="var(--sa-bg-neutral-base)"
          strokeWidth={0.6}
          aria-hidden="true"
        />
      ))}

      {bubbles.map((b) => {
        const isHL = hl !== null && normalize(b.state) === hl;
        return (
          <circle
            key={b.state}
            cx={b.x}
            cy={b.y}
            r={b.r}
            /* India green, as the handoff draws it. It is a BRAND tone here and
               not a status signal — nothing on this map is "good" — so the
               reader is never asked to read meaning into the hue; the circle's
               area carries the whole message. */
            fill="var(--sa-color-successScale-600)"
            fillOpacity={isHL ? 0.45 : 0.28}
            stroke="var(--sa-color-successScale-600)"
            strokeWidth={isHL ? 2 : 1}
            className={onSelectState ? "ds-bubble--interactive" : undefined}
            tabIndex={0}
            role={onSelectState ? "button" : "img"}
            aria-label={`${b.state}: ${valueFormat(b.value)}`}
            onPointerMove={(e) => show(tooltip(b.state, b.value), e.clientX, e.clientY)}
            onPointerLeave={hide}
            onFocus={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              show(tooltip(b.state, b.value), r.left + r.width / 2, r.top);
            }}
            onBlur={hide}
            onClick={onSelectState ? () => onSelectState(b.state) : undefined}
            onKeyDown={
              onSelectState
                ? (e) => {
                    // A circle given `role="button"` owes the reader both keys;
                    // an SVG element gets neither for free.
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelectState(b.state);
                    }
                  }
                : undefined
            }
          />
        );
      })}
    </ChartFrame>
  );
}
