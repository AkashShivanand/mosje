import * as React from "react";

import { ChartFrame, type ChartStateProps } from "./internal/chart-frame";
import { formatIndian } from "./internal/format";
import type { ValueFormat } from "./internal/format";

export interface BulletRow {
  /** The measure's name — "Grants Released", "Hostels Completed". */
  label: string;
  /** What actually happened. Drawn as the bar. */
  value: number;
  /** What was meant to happen. Drawn as a tick across the bar. */
  target?: number;
  /**
   * Qualitative bands behind the bar, as ASCENDING boundaries.
   *
   * `[40, 75]` on a scale of 100 means three bands: 0–40, 40–75, 75–100. They
   * are the department's own thresholds, not a judgement this component makes —
   * pass none and the track is plain.
   */
  ranges?: number[];
  /** Scale ceiling. Defaults to the largest of value, target and ranges. */
  max?: number;
}

export interface BulletChartProps extends ChartStateProps {
  title: string;
  rows: BulletRow[];
  /** Shown after each value, e.g. "₹ crore". */
  unit?: string;
  valueFormat?: ValueFormat;
  /** Short screen-reader summary. Defaults to a value-vs-target sentence. */
  summary?: string;
  className?: string;
}

const W = 480;
const ROW_H = 44;
const LABEL_W = 150;
const TRACK_X = LABEL_W + 8;
const TRACK_W = W - TRACK_X - 8;
const BAR_H = 10;

/**
 * SAMAVESH BulletChart — target against actual, on one line.
 *
 * **This is the shape of almost every figure this department reports.**
 * Sanctioned against released. Released against utilised. Places created
 * against places filled. It was being drawn as two bars side by side, which
 * invites the wrong reading: two bars of similar height look like two
 * comparable quantities rather than a measure and the bar it has to clear.
 *
 * Stephen Few's bullet graph puts them on one line — the measure as a bar, the
 * target as a tick across it — so "did it reach the target" is a single visual
 * question rather than an arithmetic one. It also costs a fraction of the
 * vertical space of a gauge, which matters on a dashboard listing twenty
 * schemes.
 *
 * ── WHAT THE COMPONENT DOES NOT DECIDE ──────────────────────────────────────
 *
 * `ranges` are the DEPARTMENT'S thresholds and are drawn as neutral bands. It
 * is tempting to colour them red/amber/green, and this deliberately does not:
 * the estate reserves status colour for status (`prototype-data-modes.md`), and
 * a component that decides 60% is "amber" has made a policy judgement that
 * belongs to the scheme, not to the design system. Pass no ranges and the track
 * is plain — which is the honest default when no threshold has been published.
 */
export function BulletChart({
  title,
  rows,
  unit,
  valueFormat = formatIndian,
  summary,
  className,
  state,
  onRetry,
  filterLabel,
  tableView,
}: BulletChartProps) {
  /*
   * Same guard as Gauge, for the same reason: a non-finite value produces an
   * invalid `width`, browsers drop the attribute silently, and the row renders
   * as an empty track that reads as a true zero.
   */
  const usable = rows.filter(
    (r) =>
      Number.isFinite(r.value) &&
      (r.target === undefined || Number.isFinite(r.target)),
  );
  const resolved = state ?? (usable.length === 0 ? "empty" : undefined);

  const H = Math.max(ROW_H, usable.length * ROW_H) + 8;

  const scaleFor = (r: BulletRow): number => {
    const candidates = [r.value, r.target ?? 0, ...(r.ranges ?? [])];
    const max = r.max ?? Math.max(...candidates);
    return max > 0 ? max : 1;
  };

  return (
    <ChartFrame
      marksAreFocusable
      title={title}
      summary={
        summary ??
        usable
          .map((r) =>
            r.target === undefined
              ? `${r.label}: ${valueFormat(r.value)}`
              : `${r.label}: ${valueFormat(r.value)} against a target of ${valueFormat(r.target)}`,
          )
          .join(". ")
      }
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      state={resolved}
      onRetry={onRetry}
      filterLabel={filterLabel}
      tableView={tableView}
      table={{
        columns: ["Measure", "Value", "Target"],
        rows: usable.map((r) => [
          r.label,
          `${valueFormat(r.value)}${unit ? ` ${unit}` : ""}`,
          r.target === undefined ? "—" : `${valueFormat(r.target)}${unit ? ` ${unit}` : ""}`,
        ]),
      }}
    >
      {usable.map((r, i) => {
        const max = scaleFor(r);
        const y = i * ROW_H + 8;
        const mid = y + ROW_H / 2 - 6;
        const x = (v: number) => TRACK_X + (Math.max(0, Math.min(v, max)) / max) * TRACK_W;
        const bounds = [...(r.ranges ?? []), max];
        const met = r.target !== undefined && r.value >= r.target;

        return (
          <g
            key={r.label}
            tabIndex={0}
            role="img"
            aria-label={
              r.target === undefined
                ? `${r.label}: ${valueFormat(r.value)}${unit ? ` ${unit}` : ""}`
                : `${r.label}: ${valueFormat(r.value)}${unit ? ` ${unit}` : ""}, target ` +
                  `${valueFormat(r.target)}${unit ? ` ${unit}` : ""}, ` +
                  `${met ? "target met" : "below target"}`
            }
          >
            <text
              x={LABEL_W}
              y={mid + 4}
              textAnchor="end"
              className="ds-chart__label"
              fontSize="12"
            >
              {r.label}
            </text>

            {/*
              ONE TRACK, WITH THE THRESHOLDS AS RULES ACROSS IT.
              Bands were first drawn as graduated greys and it failed twice over:
              every band below the top one got the same fill, so two thresholds
              looked like one, and the top band was light enough to disappear into
              the card — which made the track look as though it ended before the
              target tick. A single visible track plus thin dividers says the same
              thing, reads at any number of bands, and cannot vanish.
            */}
            <rect
              x={TRACK_X}
              y={mid - 8}
              width={TRACK_W}
              height={BAR_H + 16}
              fill="var(--sa-bg-neutral-subtle)"
              rx="2"
            />
            {bounds.slice(0, -1).map((b, bi) => (
              <rect
                key={bi}
                x={x(b)}
                y={mid - 8}
                width="1"
                height={BAR_H + 16}
                fill="var(--sa-border-neutral-bolder-default)"
              />
            ))}

            <rect
              x={TRACK_X}
              y={mid}
              width={Math.max(0, x(r.value) - TRACK_X)}
              height={BAR_H}
              rx="2"
              fill="var(--sa-chart-cat-1)"
            />

            {/*
              THE TARGET IS A TICK, NOT A SECOND BAR. A bar invites the reader to
              compare two lengths; a line across the measure asks the only
              question the pairing has — did it get there.
            */}
            {r.target !== undefined ? (
              <rect
                x={x(r.target) - 1.5}
                y={mid - 6}
                width="3"
                height={BAR_H + 12}
                fill="var(--sa-text-neutral-bolder)"
              />
            ) : null}
          </g>
        );
      })}
    </ChartFrame>
  );
}
