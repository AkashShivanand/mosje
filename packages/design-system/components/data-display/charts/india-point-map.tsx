"use client";

import * as React from "react";
import { ChartFrame, type ChartStateProps } from "./internal/chart-frame";
import { ChartTooltip, useChartTooltip } from "./internal/tooltip";
import { sequentialColor, CHART_INK } from "./internal/palette";
import { formatIndian } from "./internal/format";
import type { ValueFormat } from "./internal/format";
import { INDIA_STATES_PATHS, INDIA_STATES_VIEWBOX } from "./geo/india-states.paths";

/**
 * The national window's own width and height, parsed once.
 *
 * Everything that used to restate `800` and `560` reads these instead. Two
 * constants were hardcoded against a viewBox that later changed shape, and a
 * hardcoded copy of a value that lives somewhere else is a defect waiting for
 * that value to move.
 */
const [, , BASE_W, BASE_H] = INDIA_STATES_VIEWBOX.split(/\s+/).map(Number) as [
  number,
  number,
  number,
  number,
];
import {
  projectIndia,
  normalizeRegionName,
  hexCenter,
  hexPath,
  hexAt,
  INDIA_HEX_RADIUS,
  type HexBin,
} from "./geo/india-projection";
import "./charts.css";

export type { HexBin };

export interface RegionBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Bounding box per state, in viewBox units, derived from the outlines at module
 * load rather than stored beside them.
 *
 * Same reasoning as `IndiaBubbleMap`'s centroids: the geometry is generated, so
 * a committed table of boxes is a second copy that no build checks and that
 * starts framing the wrong ground the day the boundaries are regenerated.
 */
export const INDIA_STATE_BOXES: ReadonlyMap<string, RegionBox> = (() => {
  const out = new Map<string, RegionBox>();
  for (const region of INDIA_STATES_PATHS) {
    const nums = region.d.match(/-?\d+(?:\.\d+)?/g);
    if (!nums || nums.length < 4) continue;
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (let i = 0; i + 1 < nums.length; i += 2) {
      const x = Number(nums[i]);
      const y = Number(nums[i + 1]);
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
    out.set(normalizeRegionName(region.name), {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    });
  }
  return out;
})();

export interface MapPin {
  id: string;
  lon: number;
  lat: number;
  label: string;
  /** Categorical group — drives the mark's fill and the legend. */
  kind: string;
  /** Secondary line in the tooltip. */
  detail?: string;
}

export interface MapBubble {
  id: string;
  lon: number;
  lat: number;
  label: string;
  value: number;
  detail?: string;
}

export interface PinKindStyle {
  kind: string;
  label: string;
  /** Any CSS colour — pass a `var(--sa-*)` token. */
  color: string;
}

export interface IndiaPointMapProps extends ChartStateProps {
  title: string;
  /** Density field, pre-binned by the caller at the same `hexRadius`. */
  bins?: readonly HexBin[];
  /** Radius of one hex, in viewBox units. Must match how `bins` were made. */
  hexRadius?: number;
  /** What one binned point is ("villages"), for the tooltip. */
  binNoun?: string;
  /** Proportional circles at real coordinates — for a named-unit grain. */
  bubbles?: readonly MapBubble[];
  /** Radius of the largest bubble, in viewBox units. */
  maxBubbleRadius?: number;
  /**
   * `filled` when the bubbles ARE the data; `outlined` when they annotate a
   * density field already drawn underneath.
   *
   * The distinction is not cosmetic. Two filled layers encoding the same
   * quantity double the ink and the reader adds them up by eye; an outline
   * reads as a boundary marker and does not compete. PM-AJAY draws villages as
   * density at every grain and rings its districts, so the rail has something
   * to point at without the map saying "villages" twice.
   */
  bubbleVariant?: "filled" | "outlined";
  /** Emphasise one bubble by id — the rail row under the cursor. */
  highlightBubbleId?: string | null;
  /** Individual marks, coloured by `kind`. */
  pins?: readonly MapPin[];
  pinKinds?: readonly PinKindStyle[];
  /**
   * Whether each pin is a keyboard stop and announced individually.
   * @default true
   *
   * TURN IT OFF WHEN THE PINS HAVE STOPPED BEING INDIVIDUALS. It is the same
   * judgement the hex field is built on, applied one scale up: a mark is worth
   * landing on when a reader could plausibly be looking for that particular
   * one. PM-AJAY's 200 hostels are individuals once the map is framed on a
   * state — a couple of dozen, each a building someone might seek. Across the
   * whole country they are two hundred indistinguishable dots, and making them
   * stops put 195 of them between the reader and the ranked list that is the
   * actual route to any of them.
   *
   * Nothing is lost by switching it off: the pins still answer the pointer, and
   * the `table` still carries the named rows. The caller decides because only
   * the caller knows how many pins there are.
   */
  interactivePins?: boolean;
  /** Zoom to this state and mute the rest. */
  focusRegion?: string | null;
  /** Outline a state without zooming (e.g. the rail row under the cursor). */
  highlightRegion?: string | null;
  /** Called when a state outline is activated. */
  onSelectRegion?: (region: string) => void;
  valueFormat?: ValueFormat;
  legend?: React.ReactNode;
  table?: { columns: string[]; rows: (string | number)[][] };
  summary?: string;
  className?: string;
}

/** Ten steps — the sequential ramp's own resolution. More is indistinguishable. */
const BUCKETS = 10;

/**
 * MoSJE / SAMAVESH IndiaPointMap — real coordinates on the national outline, at
 * whichever grain the data can honestly support.
 *
 * ── WHY THIS EXISTS ALONGSIDE `IndiaMap` AND `IndiaBubbleMap` ───────────────
 *
 * Those two answer "how much per state". They take a value already aggregated
 * to a region and put it at the region's centre. That is the right chart when
 * the region IS the unit — a state's literacy rate, a state's allocation.
 *
 * It is the wrong chart when the data is a list of PLACES. PM-AJAY's 19,768
 * Adarsh Gram villages are not a per-state quantity that happens to be counted;
 * they are 19,768 points standing in a belt across West Bengal, Bihar and north
 * Tamil Nadu. Aggregating them to 24 circles at 24 state centroids throws away
 * the only thing the coordinates were published to show.
 *
 * ── THREE MARKS, BECAUSE DENSITY AND IDENTITY ARE DIFFERENT QUESTIONS ───────
 *
 * `bins`    — a hex density field. For points too many to tell apart. The
 *             question is "where is this concentrated", and overplotting, not
 *             resolution, is what would ruin the answer.
 * `bubbles` — proportional circles at named units, for a zoomed grain where the
 *             reader wants to know WHICH district, not merely how dense.
 * `pins`    — one mark per record, categorical by kind, when the records are few
 *             enough to be individuals and each is a place someone might seek.
 *
 * A caller may combine all three: PM-AJAY draws villages as density and hostels
 * as pins on one canvas, because 19,768 and 203 are genuinely different kinds
 * of thing and a single mark flatters neither.
 *
 * ── ~1,000 HEXES, TEN DOM NODES ────────────────────────────────────────────
 *
 * Bins are grouped by colour bucket and each bucket is emitted as ONE `<path>`,
 * so the density field costs ten elements rather than a thousand. The cursor is
 * resolved against the lattice arithmetically — `hexAt()` inverts the axial
 * transform — so hovering still names the cell under the pointer with nothing
 * individually hit-tested.
 *
 * A hex is not keyboard-reachable, and that is a decision rather than an
 * omission: a density cell is not an entity, it has no identity to land on, and
 * tabbing through a thousand of them would be hostile. The screen-reader table
 * carries the named rows, which is what a keyboard reader actually wants.
 *
 * ── LOG SCALE, LABELLED ─────────────────────────────────────────────────────
 *
 * Counts per cell run 1 → ~390 with a long tail: on a linear ramp 95% of the
 * map is the palest step and the chart says nothing. The ramp is `log1p`, and
 * the caller's legend prints the real count at each break so a reader is never
 * asked to guess what a shade is worth.
 */
export function IndiaPointMap({
  title,
  bins,
  hexRadius = INDIA_HEX_RADIUS,
  binNoun = "points",
  bubbles,
  maxBubbleRadius = 18,
  bubbleVariant = "filled",
  highlightBubbleId,
  pins,
  pinKinds = [],
  interactivePins = true,
  focusRegion,
  highlightRegion,
  onSelectRegion,
  valueFormat = formatIndian,
  legend,
  table,
  summary,
  className,
  state,
  onRetry,
  filterLabel,
}: IndiaPointMapProps) {
  const { canvasRef, tip, show, hide } = useChartTooltip();
  const svgRef = React.useRef<SVGSVGElement | null>(null);

  const focusKey = focusRegion ? normalizeRegionName(focusRegion) : null;
  const highlightKey = highlightRegion ? normalizeRegionName(highlightRegion) : null;

  /*
   * Zooming is a viewBox change rather than a `transform`, so strokes and marks
   * keep their drawn size relative to the land instead of being scaled with it
   * — a 1px border must not become a 6px border because the reader looked
   * closer at Kerala.
   */
  const viewBox = React.useMemo(() => {
    if (!focusKey) return INDIA_STATES_VIEWBOX;
    const box = INDIA_STATE_BOXES.get(focusKey);
    if (!box) return INDIA_STATES_VIEWBOX;
    // Margin proportional to the state, so a small UT is not framed as tightly
    // as Rajasthan, with a floor so a sliver still gets breathing room.
    const pad = Math.max(14, Math.max(box.width, box.height) * 0.12);
    const x = box.x - pad;
    const y = box.y - pad;
    const w = box.width + pad * 2;
    const h = box.height + pad * 2;
    // Hold the NATIONAL aspect so a zoomed state is not stretched. Read from
    // the viewBox rather than restated: it was hardcoded `800 / 560`, and when
    // the national window was tightened to the land that constant silently
    // became a different shape from the map it was framing.
    const target = BASE_W / BASE_H;
    const have = w / h;
    const fw = have > target ? w : h * target;
    const fh = have > target ? w / target : h;
    return `${(x - (fw - w) / 2).toFixed(1)} ${(y - (fh - h) / 2).toFixed(1)} ${fw.toFixed(
      1,
    )} ${fh.toFixed(1)}`;
  }, [focusKey]);

  /**
   * Marks shrink with the viewBox so they stay optically constant when zoomed.
   *
   * Divided by the NATIONAL width, so the unzoomed map is exactly 1. Hardcoding
   * 800 here made every mark 1.6x too large the moment the national window
   * stopped being 800 wide.
   */
  const zoom = React.useMemo(
    () => (Number(viewBox.split(/\s+/)[2]) || BASE_W) / BASE_W,
    [viewBox],
  );

  const maxBin = React.useMemo(
    () => (bins && bins.length ? Math.max(...bins.map((b) => b.count)) : 0),
    [bins],
  );

  const bucketOf = React.useCallback(
    (count: number) => {
      if (maxBin <= 1) return BUCKETS - 1;
      const t = Math.log1p(count) / Math.log1p(maxBin);
      return Math.min(BUCKETS - 1, Math.max(0, Math.round(t * (BUCKETS - 1))));
    },
    [maxBin],
  );

  /** One path per colour bucket — the whole density field in ten elements. */
  const binPaths = React.useMemo(() => {
    if (!bins || !bins.length) return [];
    const byBucket = new Map<number, string[]>();
    for (const b of bins) {
      const k = bucketOf(b.count);
      const [cx, cy] = hexCenter(b.q, b.r, hexRadius);
      const list = byBucket.get(k);
      if (list) list.push(hexPath(cx, cy, hexRadius));
      else byBucket.set(k, [hexPath(cx, cy, hexRadius)]);
    }
    return [...byBucket]
      .sort((a, b) => a[0] - b[0])
      .map(([bucket, paths]) => ({ bucket, d: paths.join(" ") }));
  }, [bins, bucketOf, hexRadius]);

  /** Cell lookup for the pointer, keyed by the axial pair. */
  const binIndex = React.useMemo(() => {
    const m = new Map<string, number>();
    for (const b of bins ?? []) m.set(`${b.q},${b.r}`, b.count);
    return m;
  }, [bins]);

  const projectedBubbles = React.useMemo(() => {
    if (!bubbles || !bubbles.length) return [];
    const max = Math.max(1, ...bubbles.map((b) => b.value));
    return bubbles
      .map((b) => {
        const [x, y] = projectIndia(b.lon, b.lat);
        // r ∝ √v — scaling the RADIUS by the value would square the difference
        // the reader sees, which is the classic bubble-map error.
        return { ...b, x, y, r: Math.max(1.5, maxBubbleRadius * zoom * Math.sqrt(b.value / max)) };
      })
      // Largest first so small circles paint on top and stay hittable.
      .sort((a, b) => b.r - a.r);
  }, [bubbles, maxBubbleRadius, zoom]);

  const projectedPins = React.useMemo(() => {
    if (!pins || !pins.length) return [];
    return pins.map((p) => {
      const [x, y] = projectIndia(p.lon, p.lat);
      return { ...p, x, y };
    });
  }, [pins]);

  const pinColor = React.useMemo(() => {
    const m = new Map(pinKinds.map((k) => [k.kind, k.color]));
    return (kind: string) => m.get(kind) ?? CHART_INK.axis;
  }, [pinKinds]);

  /* Pointer → viewBox units → which hex. One listener for the whole field. */
  const onFieldMove = (e: React.PointerEvent<SVGRectElement>) => {
    const svg = svgRef.current;
    if (!svg || !bins || !bins.length) return;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
    const [q, r] = hexAt(pt.x, pt.y, hexRadius);
    const count = binIndex.get(`${q},${r}`);
    if (count === undefined) {
      hide();
      return;
    }
    show(
      <>
        <div className="ds-chart__tooltip-title">
          {valueFormat(count)} {binNoun}
        </div>
        <div>within a few kilometres</div>
      </>,
      e.clientX,
      e.clientY,
    );
  };

  const pinTip = (p: MapPin) => (
    <>
      <div className="ds-chart__tooltip-title">{p.label}</div>
      {p.detail && <div>{p.detail}</div>}
    </>
  );

  const bubbleTip = (b: MapBubble) => (
    <>
      <div className="ds-chart__tooltip-title">{b.label}</div>
      <div>
        {valueFormat(b.value)}
        {b.detail ? ` · ${b.detail}` : ""}
      </div>
    </>
  );

  /*
   * WITH NOTHING TO PLOT THIS DREW A COMPLETE GREY INDIA — the land is painted
   * unconditionally as a frame of reference, so an absent feed and a country
   * with no marks were the same picture. All three layers are checked, because
   * this map can legitimately carry any one of them alone.
   *
   * Placed after every hook: the derivation runs against the empty inputs and
   * resolves to nothing; only the RENDER branches.
   */
  const resolved =
    state ??
    (binPaths.length === 0 && projectedBubbles.length === 0 && projectedPins.length === 0
      ? "empty"
      : undefined);
  if (resolved)
    return (
      <ChartFrame
        marksAreFocusable
        title={title}
        viewBox={viewBox}
        className={className}
        state={resolved}
        onRetry={onRetry}
        filterLabel={filterLabel}
      >
        {null}
      </ChartFrame>
    );

  return (
    <ChartFrame
      marksAreFocusable
      title={title}
      summary={summary}
      viewBox={viewBox}
      className={className}
      /* The viewBox narrows when `focusRegion` is set; the rest of the country
         keeps drawing at full size outside it. See the rule's own comment. */
      svgClassName="ds-chart__svg--clip"
      canvasRef={canvasRef}
      svgRef={svgRef}
      overlay={<ChartTooltip tip={tip} />}
      legend={legend}
      table={table}
    >
      {/* The land. Flat and quiet — a frame of reference, not the data. */}
      {INDIA_STATES_PATHS.map((region) => {
        const key = normalizeRegionName(region.name);
        const muted = focusKey !== null && key !== focusKey;
        const isHL = highlightKey !== null && key === highlightKey;
        /*
         * A MUTED STATE IS INERT, not merely faded.
         *
         * While the map is framed on one state the other 35 are dimmed and
         * mostly outside the viewBox — but they kept their `tabIndex` and their
         * click handler, so a keyboard user zoomed into Tamil Nadu had 35 tab
         * stops on invisible off-screen buttons before reaching anything real,
         * and a stray click on the sliver of Kerala still in frame silently
         * threw away the view they had chosen.
         */
        const active = Boolean(onSelectRegion) && !muted;
        return (
          <path
            key={region.id}
            d={region.d}
            fill={CHART_INK.regionEmpty}
            fillOpacity={muted ? 0.4 : 1}
            stroke={isHL ? "var(--sa-color-text-default)" : "var(--sa-bg-neutral-base)"}
            strokeWidth={(isHL ? 1.8 : 0.6) * zoom}
            className={active ? "ds-bubble--interactive" : undefined}
            role={active ? "button" : "presentation"}
            tabIndex={active ? 0 : undefined}
            aria-label={active ? `Zoom to ${region.name}` : undefined}
            aria-hidden={active ? undefined : true}
            style={active ? undefined : { pointerEvents: "none" }}
            onClick={active ? () => onSelectRegion?.(region.name) : undefined}
            onKeyDown={
              active
                ? (e) => {
                    // A path given role="button" owes the reader both keys; an
                    // SVG element gets neither for free.
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelectRegion?.(region.name);
                    }
                  }
                : undefined
            }
          />
        );
      })}

      {/*
        The hit surface for the density field. It sits BELOW the marks and above
        the land: pins and bubbles carry their own listeners and are painted
        after it, so a hover over a hostel reaches the hostel rather than the
        cell it stands in.
      */}
      {bins && bins.length > 0 && (
        <rect
          x={-2000}
          y={-2000}
          width={5000}
          height={5000}
          fill="transparent"
          style={{ pointerEvents: "fill" }}
          onPointerMove={onFieldMove}
          onPointerLeave={hide}
          aria-hidden="true"
        />
      )}

      {/* Density field — ten paths, ~1,000 hexes. */}
      <g aria-hidden="true" style={{ pointerEvents: "none" }}>
        {binPaths.map((p) => (
          <path
            key={p.bucket}
            d={p.d}
            fill={sequentialColor(p.bucket / (BUCKETS - 1))}
            fillOpacity={0.9}
          />
        ))}
      </g>

      {/*
        THE COASTLINE, REDRAWN OVER THE FIELD AS STROKE ONLY.

        A hex is 5 viewBox units and the baked outline is quantised well below
        that, so ~9% of PM-AJAY's cells have their centre a little offshore —
        Konkan, Kerala, the Sundarbans. They are NOT bad coordinates: they are
        real coastal villages whose aggregation cell overhangs a coarse
        coastline, and clipping the field to the outline would delete them from
        a map whose own coverage line has just promised the reader they are
        drawn.

        Restating the border on top costs 36 stroke-only paths and fixes the
        read completely: the overhang becomes "cells crowding the coast" rather
        than "dots adrift in the Arabian Sea". `pointer-events: none` so it
        cannot intercept a hover meant for the field beneath it.
      */}
      <g aria-hidden="true" style={{ pointerEvents: "none" }}>
        {INDIA_STATES_PATHS.map((region) => (
          <path
            key={`edge-${region.id}`}
            d={region.d}
            fill="none"
            stroke="var(--sa-bg-neutral-base)"
            strokeWidth={0.6 * zoom}
          />
        ))}
      </g>

      {/* Proportional circles at named units — districts, when zoomed in. */}
      {projectedBubbles.map((b) => {
        const lit = highlightBubbleId != null && b.id === highlightBubbleId;
        const outlined = bubbleVariant === "outlined";
        return (
        <g key={b.id}>
        {/*
          AN OUTLINED RING NEEDS TWO STROKES, NOT ONE. It is drawn over a
          density field that runs the full ramp — near-white at one end and
          `seq-900` at the other — so any single colour disappears against half
          of its own background. A dark stroke under a white one reads on both,
          which is the same halo technique the pins use, and the reason the
          first attempt (one `seq-800` stroke at 55% opacity) was invisible
          exactly where the data was densest and the reader was looking.
        */}
        {outlined && (
          <circle
            cx={b.x}
            cy={b.y}
            r={b.r}
            fill="none"
            stroke="var(--sa-chart-seq-900)"
            strokeOpacity={lit ? 0.9 : 0.5}
            strokeWidth={(lit ? 3.6 : 2.2) * zoom}
            style={{ pointerEvents: "none" }}
          />
        )}
        <circle
          cx={b.x}
          cy={b.y}
          r={b.r}
          fill={outlined ? "none" : "var(--sa-chart-seq-600)"}
          fillOpacity={outlined ? undefined : 0.5}
          stroke={outlined ? "var(--sa-bg-neutral-base)" : "var(--sa-chart-seq-800)"}
          strokeOpacity={outlined && !lit ? 0.85 : 1}
          strokeWidth={(lit ? 1.8 : outlined ? 1.1 : 0.9) * zoom}
          tabIndex={0}
          role="img"
          aria-label={`${b.label}: ${valueFormat(b.value)}`}
          onPointerMove={(e) => show(bubbleTip(b), e.clientX, e.clientY)}
          onPointerLeave={hide}
          onFocus={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            show(bubbleTip(b), rect.left + rect.width / 2, rect.top);
          }}
          onBlur={hide}
        />
        </g>
        );
      })}

      {/*
        Individual records, drawn as a ringed dot rather than a teardrop pin: a
        teardrop's anchor is its tip, so at a glance a reader takes the centre of
        the blob for the location and every mark is silently off by its own
        height. A circle is centred on its coordinate and cannot mislead.

        The pale disc underneath is a halo, not decoration — it separates a dark
        pin from a dark density cell so a hostel in a saturated district is still
        findable.
      */}
      {projectedPins.map((p) => (
        <g key={p.id}>
          <circle
            cx={p.x}
            cy={p.y}
            r={4.2 * zoom}
            fill="var(--sa-bg-neutral-base)"
            fillOpacity={0.85}
            style={{ pointerEvents: "none" }}
          />
          <circle
            cx={p.x}
            cy={p.y}
            r={2.9 * zoom}
            fill={pinColor(p.kind)}
            stroke="var(--sa-bg-neutral-base)"
            strokeWidth={0.9 * zoom}
            tabIndex={interactivePins ? 0 : undefined}
            role={interactivePins ? "img" : "presentation"}
            aria-label={interactivePins ? `${p.label}${p.detail ? `, ${p.detail}` : ""}` : undefined}
            aria-hidden={interactivePins ? undefined : true}
            className="ds-bubble--interactive"
            onPointerMove={(e) => show(pinTip(p), e.clientX, e.clientY)}
            onPointerLeave={hide}
            onFocus={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              show(pinTip(p), rect.left + rect.width / 2, rect.top);
            }}
            onBlur={hide}
          />
        </g>
      ))}
    </ChartFrame>
  );
}
