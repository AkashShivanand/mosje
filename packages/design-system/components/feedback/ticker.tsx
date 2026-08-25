"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { Icon } from "../utilities/icon";
import { TickerMark } from "./ticker-mark";
import "./ticker.css";

export type TickerOrientation = "horizontal" | "vertical";

export interface TickerItem {
  /** Stable key. Falls back to the index when absent. */
  id?: string;
  /**
   * The lead-in. In `horizontal` it is the headline line; in `vertical` it is
   * the bold phrase before the colon that tells a citizen what KIND of notice
   * this is — "Vacancies", "Result", "Tender".
   */
  title: string;
  /** The sentence. Optional: without it the row is the lead-in alone. */
  description?: string;
  /** Where the item goes. */
  href: string;
  /**
   * Trailing call to action inside the sentence — the frame's "Learn More".
   * `horizontal` only: in a scrolling list it would repeat on every row, which
   * is noise, and the whole row is already the link.
   */
  linkLabel?: string;
}

export interface TickerProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** The messages to show. An empty list renders nothing at all. */
  items: TickerItem[];
  /**
   * The strip's name, on the plinth and as the section's accessible name.
   * @default "Latest Updates"
   */
  label?: string;
  /**
   * Override the mark. Defaults to `<TickerMark>`, the broadcasting megaphone
   * that pulses while the strip is moving and stops when it is paused. Pass
   * something else only when a site genuinely has its own emblem for this — the
   * default is deliberately tied to the strip's state.
   */
  icon?: React.ReactNode;
  /**
   * The way out — "View All Updates". A slot, because it is a route the
   * consuming site owns. Use `buttonClasses("primary", "inverseOutlined",
   * "sm")`; the strip is a solid brand surface, so a normal outlined button
   * would draw its border in a blue nobody can see.
   */
  action?: React.ReactNode;
  /**
   * TWO DIFFERENT COMPONENTS SHARING ONE DATA SHAPE.
   *
   * `horizontal` (default) — the **bar**. One message at a time on a 72px
   * full-bleed strip under the masthead, stepped with prev/next.
   *
   * `vertical` — the **panel**. The same items stacked as rows, scrolling
   * upward continuously behind a header that carries the name, the pause
   * control and the way out. This is the shape a notice board wants: several
   * headlines legible at once, and no stepping, because the list moves on its
   * own.
   *
   * @default "horizontal"
   */
  orientation?: TickerOrientation;
  /**
   * How many rows are visible at once. `vertical` only — it is what sets the
   * panel's height. Ignored by `horizontal`, which is always one line.
   * @default 4
   */
  rows?: number;
  /**
   * `horizontal` — milliseconds each item holds before the next replaces it.
   * `vertical` — milliseconds of travel PER ROW, so a longer list takes
   * proportionally longer to loop and the scroll speed stays constant however
   * many notices there are.
   * @default 5000
   */
  interval?: number;
  /** Start moving on mount. @default true */
  autoplay?: boolean;
  /** Router-aware link for internal hrefs — pass `next/link`. @default "a" */
  linkAs?: React.ElementType;
}

/**
 * Ticker — recent announcements, in two shapes.
 *
 * ── THE TWO SHAPES ────────────────────────────────────────────────────────
 * `horizontal` is the **bar**: the 72px full-bleed strip under the masthead,
 * one message at a time. `vertical` is the **panel**: the same items stacked
 * as rows, scrolling upward under a header. They are one component because the
 * data is identical — a lead-in, a sentence, a link — and a site usually wants
 * both, the bar on the home page and the panel in a column beside it.
 *
 * STRUCTURAL, NOT CONTENT-BOUND: every string, href and route arrives as a
 * prop, so the DoSJE website's notices and a portal's scheme alerts are the
 * same component with different data.
 *
 * ── THE RULES THAT ARE EASY TO BREAK ──────────────────────────────────────
 *
 * 1. **Anything that moves on its own must be stoppable.** The pause control
 *    is not decoration and not optional — WCAG 2.2.2 requires a mechanism to
 *    stop motion that starts automatically and runs more than five seconds. It
 *    is the only control that survives every breakpoint in the bar, and the
 *    only control the panel has at all. Do not hide it to win space.
 *
 * 2. **The panel also stops when a citizen reaches for it.** Hover or focus
 *    anywhere inside the list halts the scroll, because a moving row is a
 *    moving tap target: without it, the line somebody is reading walks out
 *    from under the pointer. The button is the deliberate control; this is the
 *    one that stops the accidents.
 *
 * 3. **Reduced motion means it does not move, not that it moves without a
 *    transition.** Both shapes fall back to a still list — the bar stops
 *    advancing, the panel stops scrolling and simply shows its first `rows`
 *    items. Nothing is lost: the same items are on the linked page.
 *
 * 4. **The live region is `off` while it is playing.** An auto-rotating region
 *    set to `polite` interrupts a screen-reader user every interval with text
 *    they did not ask for. Pausing is what signals intent, so pausing is what
 *    turns announcements on — the APG carousel behaviour. The panel has no
 *    live region at all: it is a **list**, and a screen reader reads it as one
 *    at whatever pace the reader chooses.
 *
 * 5. **The scrolling copy is duplicated, and the duplicate is hidden.** A
 *    seamless loop needs the list twice; announcing it twice would be a defect.
 *    The second copy carries `aria-hidden` and is removed from the tab order.
 *
 * ── ANATOMY ───────────────────────────────────────────────────────────────
 * ```tsx
 * <Ticker items={updates} linkAs={Link} action={<Link … />} />
 * <Ticker items={updates} orientation="vertical" rows={5} linkAs={Link} action={<Link … />} />
 * ```
 *
 * Source of truth: Figma SAMAVESH › Ticker. The bar is recreated from MoSJE
 * Handoff › Latest Updates (8137:48790); the panel's BEHAVIOUR follows the
 * UPSC + DBIM Latest Updates component (auto-scrolling, pausable, static on
 * mobile) while its surface stays SAMAVESH's. Divergences are argued in
 * `ticker.css`.
 */
export function Ticker({
  items,
  label = "Latest Updates",
  icon,
  action,
  orientation = "horizontal",
  rows = 4,
  interval = 5000,
  autoplay = true,
  linkAs,
  className,
  ...rest
}: TickerProps): React.JSX.Element | null {
  const [index, setIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(autoplay);
  const [reducedMotion, setReducedMotion] = React.useState(false);
  const [isNarrow, setIsNarrow] = React.useState(false);
  const count = items.length;
  const isVertical = orientation === "vertical";

  React.useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // THE PANEL DOES NOT SCROLL ON A PHONE. A moving row is a moving tap target,
  // and on touch there is no hover to stop it with — the citizen would be
  // chasing the link. Below 640px it becomes a still list of its first `rows`
  // items, with the rest behind the action. The bar is unaffected: it holds one
  // message, so nothing moves out from under a thumb.
  React.useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(max-width: 639px)");
    const sync = () => setIsNarrow(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // A shrinking list must not strand the index past the end.
  const safeIndex = count > 0 ? index % count : 0;

  const go = React.useCallback(
    (next: number) => {
      if (count === 0) return;
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  // The bar steps on a timer. The panel does not — its motion is a CSS
  // animation, so there is nothing to schedule and nothing to leak.
  React.useEffect(() => {
    if (isVertical || !isPlaying || count < 2 || reducedMotion) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % count), interval);
    return () => window.clearInterval(id);
  }, [count, interval, isPlaying, isVertical, reducedMotion]);

  if (count === 0) return null;

  // ONE ITEM IS NOT A CAROUSEL, and a list shorter than its own window has
  // nothing to scroll past. Either way the motion never starts, so the controls
  // that govern motion would visibly do nothing — and a pause button on
  // something that is not moving is worse than absent: it advertises motion a
  // citizen may be trying to escape.
  const canMove = isVertical ? count > rows && !isNarrow : count > 1;
  const moving = canMove && isPlaying && !reducedMotion;

  const ItemLink = (linkAs ?? "a") as React.ElementType;

  const pauseButton = canMove ? (
    <button
      type="button"
      className="sa-ticker__control"
      onClick={() => setIsPlaying((p) => !p)}
      aria-label={isPlaying ? `Pause ${label}` : `Play ${label}`}
      aria-pressed={!isPlaying}
    >
      <Icon name={isPlaying ? "pause" : "play_arrow"} size={24} aria-hidden />
    </button>
  ) : null;

  const heading = (
    <div className="sa-ticker__heading">
      <span className="sa-ticker__mark" aria-hidden="true">
        {icon ?? <TickerMark />}
      </span>
      <span className="sa-ticker__label">{label}</span>
    </div>
  );

  // ── the panel ────────────────────────────────────────────────────────────
  if (isVertical) {
    const renderRow = (item: TickerItem, i: number, cloned: boolean) => (
      <li className="sa-ticker__row" key={`${cloned ? "c" : "o"}-${item.id ?? i}`}>
        <ItemLink
          href={item.href}
          className="sa-ticker__rowlink"
          {...(cloned ? { tabIndex: -1 } : {})}
        >
          {/* THE LEAD-IN ONLY EXISTS WHEN THERE IS A SENTENCE FOR IT TO LEAD
              INTO. Rendered alone it is a whole notice set in bold with a colon
              dangling off the end — and if the data's categories repeat, which
              real notice lists do ("Documents", "Documents", "Documents"), it is
              also four identical bold words down the rail carrying no
              information. Without a description the title IS the row. */}
          {item.description ? (
            <>
              <span className="sa-ticker__lead">{item.title}</span>
              <span className="sa-ticker__rowtext">{item.description}</span>
            </>
          ) : (
            <span className="sa-ticker__rowtext">{item.title}</span>
          )}
        </ItemLink>
      </li>
    );

    return (
      <section
        {...rest}
        className={cn("sa-ticker", "sa-ticker--vertical", className)}
        data-orientation="vertical"
        data-moving={moving ? "" : undefined}
        style={
          {
            "--sa-ticker-rows": rows,
            // Travel is per ROW, so the speed a citizen reads at does not change
            // when the ministry publishes a ninth notice.
            "--sa-ticker-duration": `${(count * interval) / 1000}s`,
            ...(rest.style ?? {}),
          } as React.CSSProperties
        }
        aria-label={label}
      >
        <div className="sa-ticker__container">
          <div className="sa-ticker__header">
            {heading}
            <div className="sa-ticker__nav">{pauseButton}</div>
            {action ? <div className="sa-ticker__action">{action}</div> : null}
          </div>

          <div className="sa-ticker__viewport" data-moving={moving ? "" : undefined}>
            <ul className="sa-ticker__track">
              {(moving ? items : items.slice(0, rows)).map((it, i) => renderRow(it, i, false))}
            </ul>
            {/* The second copy is what makes the loop seamless. It is scenery:
                hidden from assistive technology and out of the tab order, so
                the list is announced once. It only exists while the panel is
                actually moving — a still list must not be twice as long. */}
            {moving ? (
              <ul className="sa-ticker__track" aria-hidden="true">
                {items.map((it, i) => renderRow(it, i, true))}
              </ul>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  // ── the bar ──────────────────────────────────────────────────────────────
  const item = items[safeIndex];
  if (!item) return null;

  return (
    <section
      {...rest}
      className={cn("sa-ticker", className)}
      data-orientation="horizontal"
      data-moving={moving ? "" : undefined}
      aria-label={label}
      aria-roledescription="carousel"
    >
      <div className="sa-ticker__container">
        {heading}

        <div className="sa-ticker__body">
          {/* `off` while running, `polite` once the citizen has stopped it —
              pausing is the act that says "read this to me". */}
          <div className="sa-ticker__viewport" aria-live={isPlaying ? "off" : "polite"} aria-atomic="true">
            <ItemLink key={item.id ?? safeIndex} href={item.href} className="sa-ticker__item">
              <span className="sa-ticker__title">{item.title}</span>
              {item.description ? (
                <span className="sa-ticker__description">
                  {item.description}
                  {item.linkLabel ? (
                    <> <span className="sa-ticker__more">{item.linkLabel}</span></>
                  ) : null}
                </span>
              ) : null}
            </ItemLink>
          </div>

          {canMove ? (
            <div className="sa-ticker__nav">
              {pauseButton}
              <button
                type="button"
                className="sa-ticker__control sa-ticker__step"
                onClick={() => go(safeIndex - 1)}
                aria-label={`Previous item in ${label}`}
              >
                <Icon name="arrow_back" size={24} aria-hidden />
              </button>
              <button
                type="button"
                className="sa-ticker__control sa-ticker__step"
                onClick={() => go(safeIndex + 1)}
                aria-label={`Next item in ${label}`}
              >
                <Icon name="arrow_forward" size={24} aria-hidden />
              </button>
            </div>
          ) : null}

          {action ? <div className="sa-ticker__action">{action}</div> : null}
        </div>
      </div>
    </section>
  );
}
