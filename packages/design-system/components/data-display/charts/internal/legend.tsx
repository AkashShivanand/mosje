import * as React from "react";
import { cn } from "../../../../utils/cn";

/** How a legend entry draws its key. @default "solid" */
export type LegendSwatch = "solid" | "ramp" | "dots";

export interface LegendItem {
  /**
   * Stable identity, passed back by `onToggle`. Defaults to `label`, which is
   * fine until two series share a label — then set it explicitly.
   */
  id?: string;
  label: string;
  /** The key's colour. Ignored when `swatch` is `ramp` or `dots`. */
  color: string;
  /** Optional trailing value (e.g. a percentage or count). */
  value?: string;
  /**
   * What the key looks like.
   *
   * `solid` — one square. The default, and right for a categorical series.
   * `ramp`  — a gradient strip built from `colors`, for a sequential scale.
   *           Give it `scale` so the reader can tell what a shade is worth.
   * `dots`  — a row of circles from `colors`, for a series that is itself a
   *           group of sub-categories drawn as separate marks.
   */
  swatch?: LegendSwatch;
  /** The stops for `ramp`, or the marks for `dots`. */
  colors?: string[];
  /** The two ends of a `ramp`, e.g. `["1", "387"]`. */
  scale?: [string, string];
  /**
   * Whether this series is currently drawn. Only meaningful with `onToggle`.
   *
   * An entry that is off says so three ways, so the state is never carried by
   * colour alone (WCAG 1.4.1): its pill empties and its border goes dashed, a
   * `solid` key goes HOLLOW (a `ramp` and `dots` fade, having no single shape
   * to empty), and it reports `aria-pressed="false"`.
   * @default true
   */
  on?: boolean;
}

export interface LegendProps {
  items: LegendItem[];
  className?: string;
  orientation?: "horizontal" | "vertical";
  /**
   * Makes every entry a switch for its own series.
   *
   * ── PASSING THIS CHANGES WHAT THE LEGEND *IS* ───────────────────────────
   *
   * Without it a legend is decoration: the real values live in `ChartFrame`'s
   * screen-reader table, so the list is `aria-hidden` and a screen reader is
   * spared a second, numberless recital of the same labels.
   *
   * With it each entry is a control that changes what is on the chart, and a
   * control may never be hidden from assistive technology. So the `aria-hidden`
   * comes off, each entry becomes a `role="button"` with `aria-pressed`, and
   * Enter and Space work — an element given a button's role owes the reader
   * both keys, and gets neither for free.
   *
   * IT ALSO STOPS LOOKING LIKE TEXT. Each entry becomes a bordered pill in
   * `Chip`'s language, because an affordance a reader cannot see is the same
   * as one that is not there — and "hover to discover it" is not an answer on
   * a touchscreen.
   *
   * Same shape as `Chip` (`interactive = onSelectedChange != null`) and
   * `Pagination` (`hrefFor` vs `onPageChange`): the capability arrives with the
   * handler rather than through a flag someone can forget to pair with it.
   */
  onToggle?: (id: string) => void;
  /** Accessible name for the list when it is interactive. @default "Series" */
  label?: string;
}

/**
 * Shared chart legend — a key, and optionally the switch for what it keys.
 *
 * Decorative by default (see `onToggle`), so the screen-reader data table in
 * `ChartFrame` stays the single accessible source of truth for the values.
 */
export function Legend({
  items,
  className,
  orientation = "horizontal",
  onToggle,
  label = "Series",
}: LegendProps) {
  if (items.length === 0) return null;
  const interactive = onToggle != null;

  return (
    <ul
      className={cn(
        "ds-chart__legend",
        `ds-chart__legend--${orientation}`,
        interactive && "ds-chart__legend--interactive",
        className,
      )}
      aria-hidden={interactive ? undefined : "true"}
      aria-label={interactive ? label : undefined}
    >
      {items.map((it) => {
        const id = it.id ?? it.label;
        const on = it.on ?? true;
        const swatch = it.swatch ?? "solid";

        const key =
          swatch === "ramp" ? (
            <span className="ds-chart__scale">
              {it.scale && <span className="ds-chart__scale-end">{it.scale[0]}</span>}
              <span className="ds-chart__ramp">
                {(it.colors ?? [it.color]).map((c, i) => (
                  <span key={i} className="ds-chart__ramp-step" style={{ backgroundColor: c }} />
                ))}
              </span>
              {it.scale && <span className="ds-chart__scale-end">{it.scale[1]}</span>}
            </span>
          ) : swatch === "dots" ? (
            <span className="ds-chart__dots">
              {(it.colors ?? [it.color]).map((c, i) => (
                <span key={i} className="ds-chart__dot" style={{ backgroundColor: c }} />
              ))}
            </span>
          ) : (
            /*
              A SOLID KEY GOES HOLLOW WHEN ITS SERIES IS OFF, rather than
              merely faint. That is the switched-off checkbox convention, it
              survives greyscale, and it keeps the key's identity — a reader
              can still see WHICH series is the one that is off, which a
              uniformly greyed key cannot say.

              Drawn here rather than in the stylesheet because the colour
              arrives as an inline style: turning an inline `background-color`
              into a `box-shadow` of the same value from CSS needs an
              `!important` fight over a value the stylesheet cannot see.
            */
            <span
              className="ds-chart__swatch"
              style={
                on
                  ? { backgroundColor: it.color }
                  : { boxShadow: `inset 0 0 0 2px ${it.color}` }
              }
            />
          );

        const body = (
          <>
            {key}
            <span className="ds-chart__legend-label">{it.label}</span>
            {it.value !== undefined && <span className="ds-chart__legend-pct">{it.value}</span>}
          </>
        );

        if (!interactive) {
          return (
            <li key={id} className="ds-chart__legend-item">
              {body}
            </li>
          );
        }

        return (
          <li key={id} className="ds-chart__legend-item">
            <span
              className={cn("ds-chart__legend-toggle", !on && "is-off")}
              role="button"
              tabIndex={0}
              aria-pressed={on}
              onClick={() => onToggle(id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
                  e.preventDefault();
                  onToggle(id);
                }
              }}
            >
              {body}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
