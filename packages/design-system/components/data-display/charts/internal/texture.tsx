import * as React from "react";

import { categoricalColor } from "./palette";

/**
 * TEXTURE — the encoding that survives when colour does not.
 *
 * The categorical ramp has six mutually distinguishable slots and that is the
 * proven ceiling (`CHART_CATEGORICAL_SAFE_CAP`; `tools/chart-palette/search.mjs`
 * shows no palette does better at this estate's saturation). Three situations
 * take even those six away:
 *
 *   - **Colour-vision deficiency**, where two slots that clear the CVD floor
 *     still sit closer together than they do for full colour vision.
 *   - **Print and photocopy**, which is how a scheme review pack actually
 *     reaches a district office.
 *   - **Forced-colors mode**, where the system palette replaces the author's.
 *
 * A hatch pattern answers all three, because the difference is geometric.
 *
 * ── THE PATTERNS KEEP THEIR COLOUR ──────────────────────────────────────────
 *
 * Each pattern paints the slot's own colour and then rules over it, rather than
 * replacing colour with a monochrome fill. Belt and braces: a reader who can
 * see the hue keeps the hue, and one who cannot gets the geometry. Texture that
 * throws colour away would be a downgrade for most readers in order to serve
 * some, which is the wrong trade when both fit in the same mark.
 *
 * ── SIX, DELIBERATELY ───────────────────────────────────────────────────────
 *
 * There are exactly as many textures as there are safe colour slots. A seventh
 * texture would imply a seventh series is fine, and it is not — past six the
 * answer is `SmallMultiples`, direct labels, or folding the tail into "Other".
 */

/** Stable, document-global ids. Duplicated defs are byte-identical, so harmless. */
const ID = "sa-chart-tex";

export const CHART_TEXTURE_COUNT = 6;

/**
 * The fill to hand a chart for series `index`, as a per-series `color`.
 *
 * Every chart in this package already takes a colour override per series, so
 * texture needs no new prop on any of them:
 *
 * ```tsx
 * <BarChart
 *   textured
 *   data={rows.map((r, i) => ({ ...r, color: texturedColor(i) }))}
 * />
 * ```
 *
 * `textured` on the chart is what emits the `<defs>`; this is what points at
 * them. Both are needed, and the pattern falls back to the flat colour if the
 * defs are absent, so a caller who forgets one gets a plain chart rather than
 * an invisible one.
 */
export function texturedColor(index: number): string {
  const i = ((index % CHART_TEXTURE_COUNT) + CHART_TEXTURE_COUNT) % CHART_TEXTURE_COUNT;
  return `url(#${ID}-${i})`;
}

/** Rendered by `ChartFrame` when a chart sets `textured`. */
export function ChartTextureDefs(): React.JSX.Element {
  return (
    <defs>
      {Array.from({ length: CHART_TEXTURE_COUNT }, (_, i) => {
        const fill = categoricalColor(i);
        // The rule colour is the surface, not white: on a dark card a white
        // hatch is a second, brighter mark rather than a gap in the first.
        const rule = "var(--sa-bg-neutral-base)";
        return (
          <pattern
            key={i}
            id={`${ID}-${i}`}
            width="8"
            height="8"
            patternUnits="userSpaceOnUse"
            // `patternTransform` rotates the whole tile, so the rules stay
            // crisp at any angle instead of being redrawn as diagonal paths.
            patternTransform={`rotate(${[45, 135, 0, 90, 45, 135][i]})`}
          >
            <rect width="8" height="8" fill={fill} />
            {i === 4 ? (
              <circle cx="4" cy="4" r="1.6" fill={rule} />
            ) : i === 5 ? (
              <>
                <rect width="8" height="2" fill={rule} />
                <rect width="2" height="8" fill={rule} />
              </>
            ) : (
              <rect width="8" height={i === 2 || i === 3 ? 2 : 2.5} fill={rule} />
            )}
          </pattern>
        );
      })}
    </defs>
  );
}
