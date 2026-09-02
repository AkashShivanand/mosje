import * as React from "react";

import { GROUND, STROKE, type InkLayer } from "./language";

/**
 * THE PARTS EVERY SCENE IS ASSEMBLED FROM.
 *
 * A scene never reaches for a bespoke `<path>`. If it needs a shape that is not
 * here, the shape is added here first — the same design-system-first rule the
 * components follow, for the same reason: a one-off drawn inside one scene is a
 * shape the next scene will redraw slightly differently.
 *
 * Every primitive takes an ink `layer` and nothing else about colour. Nothing in
 * this file names a colour, and nothing may: the fills come from
 * `illustration.css`, bound to `--sa-*`, so a drawing follows `data-brand`.
 */

const capsule = {
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  fill: "none",
};

/**
 * For a mark that MEETS THE GROUND.
 *
 * A round cap extends half the stroke width past the path's endpoint, so a bar
 * drawn to y=40 at `STROKE.mass` actually terminated at y=42 — every bar and
 * every seat in the family hung two units below the floor they are supposed to
 * stand on, which at `scene` is a visible 6px of overshoot on the five drawings
 * that carry the family's only shared idea.
 */
const grounded = { ...capsule, strokeLinecap: "butt" as const };

function cls(layer: InkLayer): string {
  return `sa-ill__${layer}`;
}

/** The floor. Every scene stands on it — see language.ts §2. */
export function Ground({ layer = "ground" as InkLayer }): React.JSX.Element {
  return (
    <path
      d={`M${GROUND.x1} ${GROUND.y}H${GROUND.x2}`}
      className={cls(layer)}
      strokeWidth={STROKE.hairline}
      {...capsule}
    />
  );
}

export interface BarsProps {
  /** Heights above the floor, in authored units. One entry per bar. */
  heights: number[];
  layer?: InkLayer;
  /** Draw as a dashed outline — "the shape is known, the figures are not". */
  ghosted?: boolean;
  /** Which bar, if any, carries the accent. */
  accentIndex?: number;
  /** Leftmost bar's x. Bars are spaced 12 apart, which fits four across the floor. */
  x?: number;
}

/** A series of bars standing on the floor. The commonest mark in the estate. */
export function Bars({
  heights,
  layer = "ink",
  ghosted = false,
  accentIndex,
  x = 14,
}: BarsProps): React.JSX.Element {
  return (
    <>
      {heights.map((h, i) => (
        <path
          key={i}
          d={`M${x + i * 12} ${GROUND.y}v${-h}`}
          className={cls(i === accentIndex ? "accent" : layer)}
          strokeWidth={STROKE.mass}
          strokeDasharray={ghosted ? "3 4" : undefined}
          {...grounded}
        />
      ))}
    </>
  );
}

export interface SeriesProps {
  /** Points as [x, y] in authored units. */
  points: [number, number][];
  layer?: InkLayer;
  /** Leave a gap between these two point indices — a feed that stopped. */
  breakAfter?: number;
}

/** A line through points, optionally broken. The break is the message. */
export function Series({ points, layer = "ink", breakAfter }: SeriesProps): React.JSX.Element {
  const segments: string[] = [];
  let current: string[] = [];
  points.forEach(([px, py], i) => {
    current.push(`${current.length === 0 ? "M" : "L"}${px} ${py}`);
    if (breakAfter !== undefined && i === breakAfter) {
      segments.push(current.join(""));
      current = [];
    }
  });
  if (current.length) segments.push(current.join(""));
  return (
    <>
      {segments.map((d, i) => (
        <path key={i} d={d} className={cls(layer)} strokeWidth={STROKE.ink} {...capsule} />
      ))}
    </>
  );
}

/** A ring — a proportion, a total, a whole. */
export function Ring({
  cx = 32,
  cy = 24,
  r = 12,
  layer = "ink" as InkLayer,
  /** Fraction of the ring drawn as accent, 0–1. */
  filled,
}: {
  cx?: number;
  cy?: number;
  r?: number;
  layer?: InkLayer;
  filled?: number;
}): React.JSX.Element {
  const circumference = 2 * Math.PI * r;
  return (
    <>
      <circle cx={cx} cy={cy} r={r} className={cls(layer)} strokeWidth={STROKE.ink} {...capsule} />
      {filled !== undefined && filled > 0 ? (
        <circle
          cx={cx}
          cy={cy}
          r={r}
          className={cls("accent")}
          strokeWidth={STROKE.ink}
          strokeDasharray={`${circumference * Math.min(1, filled)} ${circumference}`}
          transform={`rotate(-90 ${cx} ${cy})`}
          {...capsule}
        />
      ) : null}
    </>
  );
}

/**
 * A sheet — a form, an application, a certificate, a circular.
 *
 * The commonest object in this estate's workflows, and the reason the language
 * can refuse to draw people: a citizen's presence in a government process is a
 * document, and the document is what the page is actually about.
 */
export function Sheet({
  x = 22,
  y = 8,
  w = 20,
  // Bottoms at y=40 — the floor. A sheet is an object that stands; drawn at
  // h=26 from y=10 it hovered four units above the line the language says
  // binds the family.
  h = 32,
  layer = "ink" as InkLayer,
  /** Rules of text on the sheet. */
  lines = 3,
  /** Turn the top-right corner — an unfinished or draft sheet. */
  dogEar = false,
}: {
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  layer?: InkLayer;
  lines?: number;
  dogEar?: boolean;
}): React.JSX.Element {
  const ear = 5;
  const d = dogEar
    ? `M${x} ${y}h${w - ear}l${ear} ${ear}v${h - ear}H${x}Z`
    : `M${x} ${y}h${w}v${h}H${x}Z`;
  return (
    <>
      <path d={d} className={cls(layer)} strokeWidth={STROKE.hairline} {...capsule} />
      {dogEar ? (
        <path
          d={`M${x + w - ear} ${y}v${ear}h${ear}`}
          className={cls(layer)}
          strokeWidth={STROKE.hairline}
          {...capsule}
        />
      ) : null}
      {/*
        FINE DETAIL — dropped at `spot`. At 32x24 the whole drawing is half
        scale, so these three rules land 3 units apart at 1px each and the sheet
        reads as a grey smudge. `sa-ill__detail` is how a primitive says "I am
        texture, not structure"; illustration.css hides it at the smallest tier.
      */}
      {Array.from({ length: lines }, (_, i) => (
        <path
          key={i}
          d={`M${x + 4} ${y + 8 + i * 6}h${w - 8}`}
          className={`${cls("ghost")} sa-ill__detail`}
          strokeWidth={STROKE.hairline}
          {...capsule}
        />
      ))}
    </>
  );
}

/** A lens — searching, finding, or finding nothing. */
export function Lens({
  cx = 44,
  cy = 22,
  r = 9,
  layer = "ink" as InkLayer,
}: {
  cx?: number;
  cy?: number;
  r?: number;
  layer?: InkLayer;
}): React.JSX.Element {
  return (
    <>
      <circle cx={cx} cy={cy} r={r} className={cls(layer)} strokeWidth={STROKE.ink} {...capsule} />
      <path
        d={`M${cx + r * 0.72} ${cy + r * 0.72}L${cx + r * 1.35} ${cy + r * 1.35}`}
        className={cls(layer)}
        strokeWidth={STROKE.ink}
        {...capsule}
      />
    </>
  );
}

/** A shut thing — restricted, awaiting approval, not yours to see. */
export function Shut({
  x = 38,
  y = 20,
  layer = "ink" as InkLayer,
}: {
  x?: number;
  y?: number;
  layer?: InkLayer;
}): React.JSX.Element {
  return (
    <>
      <rect
        x={x}
        y={y + 6}
        width={16}
        height={12}
        rx={2}
        className={cls(layer)}
        strokeWidth={STROKE.hairline}
        {...capsule}
      />
      <path
        d={`M${x + 4} ${y + 6}v-3a4 4 0 0 1 8 0v3`}
        className={cls(layer)}
        strokeWidth={STROKE.hairline}
        {...capsule}
      />
    </>
  );
}

/**
 * A seat — the evidence of a person, without a person.
 *
 * A hostel place, a pension, a seat in a training batch, a place in a queue.
 * See language.ts §5: this is how the system depicts a citizen's entitlement
 * without depicting a citizen.
 */
export function Seat({
  x = 26,
  layer = "ink" as InkLayer,
  /** An unfilled seat — a place sanctioned and not yet taken. */
  vacant = false,
}: {
  x?: number;
  layer?: InkLayer;
  vacant?: boolean;
}): React.JSX.Element {
  const c = cls(vacant ? "ghost" : layer);
  return (
    <>
      <path
        d={`M${x} ${GROUND.y}v-8h12v8`}
        className={c}
        strokeWidth={STROKE.hairline}
        strokeDasharray={vacant ? "3 3" : undefined}
        {...grounded}
      />
      <path
        d={`M${x + 1} ${GROUND.y - 8}v-14h10v14`}
        className={c}
        strokeWidth={STROKE.hairline}
        strokeDasharray={vacant ? "3 3" : undefined}
        {...capsule}
      />
    </>
  );
}

/** A signal — a mark that something has happened. Tick, cross, or pause. */
export function Signal({
  kind,
  cx = 46,
  cy = 16,
  layer = "accent" as InkLayer,
}: {
  kind: "done" | "stopped" | "waiting";
  cx?: number;
  cy?: number;
  layer?: InkLayer;
}): React.JSX.Element {
  const d =
    kind === "done"
      ? `M${cx - 5} ${cy}l3.5 3.5L${cx + 6} ${cy - 5}`
      : kind === "stopped"
        ? `M${cx - 4} ${cy - 4}l8 8M${cx + 4} ${cy - 4}l-8 8`
        : `M${cx - 2} ${cy - 5}v10M${cx + 3} ${cy - 5}v10`;
  return <path d={d} className={cls(layer)} strokeWidth={STROKE.ink} {...capsule} />;
}
