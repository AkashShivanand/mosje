"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { Icon } from "../utilities/icon";
import { TickerMark } from "./ticker-mark";
import "./ticker.css";

export type TickerOrientation = "horizontal" | "vertical";
export type TickerHeight = "auto" | "fill";

export interface TickerItem {
  /** Stable key. Falls back to the index when absent. */
  id?: string;
  /**
   * The lead-in. In `horizontal` it is the headline line; in `vertical` it is
   * the bold phrase before the colon that tells a citizen what KIND of notice
   * this is — "Vacancies", "Result", "Tender".
   */
  title: string;
  /**
   * The subtitle's words — the KIND of notice ("Vacancy", "Result", "Tender")
   * in the panel, the sentence under the headline in the bar. Optional.
   */
  description?: string;
  /**
   * The date, already formatted for display — "12 Aug 2026".
   *
   * OPTIONAL, and independent of `description`: a notice may carry a kind, a
   * date, both, or neither, and the separator between them appears only when
   * there are two things to separate. Formatting stays with the consumer on
   * purpose — locale and time zone are the site's policy, not the design
   * system's, and `en-IN` in IST is not a default this component should be
   * imposing on a portal that needs otherwise.
   */
  date?: string;
  /**
   * The machine-readable form of `date`, ISO 8601 — "2026-08-12". Rendered as
   * `<time dateTime>`, so the date is a date to a screen reader and to anything
   * else parsing the page rather than a run of characters that looks like one.
   */
  dateTime?: string;
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
   * HOW TALL THE PANEL IS. `vertical` only.
   *
   * `auto` (default) — the panel stands at its own height: the header plus the
   * `rows` window. Use it when the widget has a row to itself.
   *
   * `fill` — the panel takes the height of the row it is in, and `rows` becomes
   * a floor rather than the answer. Use it when the widget sits beside other
   * content and should match it, as the website's does next to the Offerings
   * cards.
   *
   * **`fill` needs a parent whose height does not come from this panel.** A grid
   * or flex item is sized by its own content, so a long list will grow the row
   * and the panel will then dutifully fill what it just inflated — the website
   * reached 2,616px that way. Give the rail `position: relative` and the panel's
   * wrapper `position: absolute; inset: 0`, so the row is sized by whatever
   * shares it and the panel scrolls the remainder.
   *
   * IT IS A PROP RATHER THAN SOMETHING INFERRED, and the first attempt proves
   * why: `block-size: 100%` looks like it would do this for free, resolving to
   * `auto` against an auto-height parent and to the row otherwise. In practice
   * it filled almost everywhere — a flex parent has a resolved height by the
   * time the child asks, so a panel standing on its own in a plain column
   * stretched too. Only the consumer knows which situation it is in.
   */
  height?: TickerHeight;
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
  height = "auto",
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
  const trackRef = React.useRef<HTMLUListElement | null>(null);
  const viewportRef = React.useRef<HTMLDivElement | null>(null);
  const [windowPx, setWindowPx] = React.useState<number | null>(null);
  const [overflows, setOverflows] = React.useState<boolean | null>(null);
  const count = items.length;
  const isVertical = orientation === "vertical";

  /**
   * ONE ITEM IS NOT A CAROUSEL, and a list that already fits has nothing to
   * scroll past. Either way the motion never starts, so the controls that govern
   * motion would visibly do nothing — and a pause button on something that is
   * not moving is worse than absent: it advertises motion a citizen may be
   * trying to escape.
   *
   * FOR THE PANEL THIS IS MEASURED, NOT COUNTED. `count > rows` was only ever a
   * proxy for "does the list overflow its window", and it stopped being true the
   * moment the panel could take the height of the row it sits in: given a tall
   * enough column the whole list fits, and a marquee scrolling content that is
   * already entirely visible is motion for its own sake. `overflows` compares
   * one copy of the list against the viewport and answers the real question.
   *
   * The count is still the first guess, because the measurement cannot happen
   * until after the first paint and a strip that flickers its controls on mount
   * is worse than one that corrects itself silently.
   *
   * Computed HERE, above the effects, because they depend on it and a hook may
   * not sit below an early return.
   */
  const canMove = isVertical
    ? (overflows ?? count > rows) && !isNarrow
    : count > 1;

  /**
   * `canScroll` is a fact about the CONTENT; `isPlaying` is the citizen's
   * choice. Keeping them apart is what stopped pause from resetting the scroll.
   *
   * It used to be one flag. Pressing pause dropped it, which removed the
   * `animation` property outright, unmounted the duplicated copy and re-sliced
   * the first one — so the track snapped back to zero and resumed from the top.
   * A pause that loses your place is not a pause. Now the DOM and the animation
   * are identical either way and only `animation-play-state` moves, so the
   * marquee freezes on the frame the citizen stopped it at and carries on from
   * there.
   */
  const canScroll = canMove && !reducedMotion;
  const moving = canScroll && isPlaying;

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

  /**
   * THE WINDOW IS MEASURED, NOT CALCULATED — and so is whether it overflows.
   *
   * `rows` used to multiply a nominal row height. That only worked while rows
   * were clipped to one line, and clipping a notice list is a loss of meaning,
   * so rows now WRAP and their heights differ. `rows` therefore sets a MINIMUM
   * height — the sum of the first `rows` items — and the panel takes more when
   * the row it sits in is taller than that.
   *
   * The second measurement is the one that keeps the motion honest: one copy of
   * the list against the visible window. Taller, and there is something to
   * scroll past; shorter, and the marquee would be moving content that is
   * already entirely on screen.
   */
  React.useLayoutEffect(() => {
    if (!isVertical) return;
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport || typeof ResizeObserver === "undefined") return;

    const measure = () => {
      const children = Array.from(track.children) as HTMLElement[];
      if (!children.length) return;
      const height = (el: HTMLElement) => el.getBoundingClientRect().height;
      setWindowPx(children.slice(0, rows).reduce((total, el) => total + height(el), 0));
      // One copy against the window. The half-pixel guard keeps a sub-pixel
      // rounding difference from being read as an overflow and starting a
      // marquee that has nowhere to go.
      const listHeight = children.reduce((total, el) => total + height(el), 0);
      setOverflows(listHeight > viewport.getBoundingClientRect().height + 1);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    ro.observe(viewport);
    Array.from(track.children).forEach((c) => ro.observe(c));
    return () => ro.disconnect();
  }, [isVertical, rows, items]);

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

  const ItemLink = (linkAs ?? "a") as React.ElementType;

  const pauseButton = canMove ? (
    <button
      type="button"
      className="sa-ticker__control"
      onClick={() => setIsPlaying((p) => !p)}
      aria-label={isPlaying ? `Pause ${label}` : `Play ${label}`}
      aria-pressed={!isPlaying}
    >
      {/* FILLED, not the estate's default stroke. At 24px on a solid brand
          surface the outlined `pause` is two hairline rectangles — it reads as
          a pair of thin outlines rather than a control, and it is the one
          control WCAG 2.2.2 requires to be findable. The filled axis makes it
          a solid mark at the same size and lifts it well clear of the 3:1
          non-text contrast floor. Every other icon in the estate stays stroke;
          this is a deliberate, local exception for a statutory control. */}
      <Icon name={isPlaying ? "pause" : "play_arrow"} size={24} fill aria-hidden />
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
          {/* TITLE OVER SUBTITLE — the same two-line structure the bar has, and
              the same one the live site uses. It replaced a bold lead-in and a
              colon on one line, which read as a label when the data's kinds
              repeat: the department's list is "Documents" seven times in eight,
              so the rail carried the same bold word four times over. A subtitle
              can repeat without harm, because it is plainly the quieter line. */}
          <span className="sa-ticker__rowtitle">{item.title}</span>
          {item.description || item.date ? (
            <span className="sa-ticker__rowmeta">
              {item.description}
              {/* The separator belongs to the PAIR, not to either half — it
                  appears only when there are two things to separate, so a
                  notice with no date does not trail a dangling middot. */}
              {item.description && item.date ? <span aria-hidden="true"> · </span> : null}
              {item.date ? <time dateTime={item.dateTime}>{item.date}</time> : null}
            </span>
          ) : null}
        </ItemLink>
      </li>
    );

    return (
      <section
        {...rest}
        className={cn("sa-ticker", "sa-ticker--vertical", className)}
        data-orientation="vertical"
        data-height={height}
        data-animate={canScroll ? "" : undefined}
        data-paused={canScroll && !isPlaying ? "" : undefined}
        style={
          {
            "--sa-ticker-rows": rows,
            ...(windowPx ? { "--sa-ticker-window": `${windowPx}px` } : {}),
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

          <div
            ref={viewportRef}
            className="sa-ticker__viewport"
            data-scroll={canScroll ? "" : undefined}
            data-paused={canScroll && !isPlaying ? "" : undefined}
          >
            {/* ONE ANIMATED WRAPPER HOLDING BOTH COPIES — and that is the whole
                trick. Each copy used to be its own animated element translating
                -50% of ITS OWN height, so every cycle moved the list half a
                length and then snapped back: a visible jump, once per loop, and
                the jerk this was reported as. Translating the WRAPPER by -50%
                moves it exactly one list, which is where the second copy
                already sits — so the reset lands on an identical frame and
                cannot be seen. It also keeps the distance correct as notices are
                added: -50% of two identical lists is one list, whatever they
                hold. */}
            <div className="sa-ticker__track">
              {/* The whole list, always. Slicing it to `rows` when still both
                  stranded the notices past the cut and latched the overflow
                  check off — a sliced list can never be found to overflow, so a
                  panel that stopped scrolling could never start again. */}
              <ul className="sa-ticker__list" ref={trackRef}>
                {items.map((it, i) => renderRow(it, i, false))}
              </ul>
              {/* The second copy is scenery: hidden from assistive technology
                  and out of the tab order, so the list is announced once. It
                  exists only while the panel is moving — a still list must not
                  be twice as long. */}
              {canScroll ? (
                <ul className="sa-ticker__list" aria-hidden="true">
                  {items.map((it, i) => renderRow(it, i, true))}
                </ul>
              ) : null}
            </div>
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
      data-animate={canMove && !reducedMotion ? "" : undefined}
      data-paused={canMove && !reducedMotion && !isPlaying ? "" : undefined}
      aria-label={label}
      aria-roledescription="carousel"
    >
      <div className="sa-ticker__container">
        {heading}

        {/* THE MESSAGE ONLY. Nav and the action are siblings of the plinth
            rather than children of the body, and that is what lets the bar
            adopt the PANEL'S HEADER below 1024px: the plinth, the pause and
            the route out share one full-width navy line, with the message on
            the ground beneath it. Nested inside the body they could only ever
            wrap underneath the message, which left the plinth a narrow square
            holding a mark and no name — the component losing its identity at
            exactly the width where identity matters most. */}
        <div className="sa-ticker__body">
          {/* `off` while running, `polite` once the citizen has stopped it —
              pausing is the act that says "read this to me". */}
          <div className="sa-ticker__viewport" aria-live={isPlaying ? "off" : "polite"} aria-atomic="true">
            <ItemLink key={item.id ?? safeIndex} href={item.href} className="sa-ticker__item">
              {/* ONE ROW LAYOUT, BOTH SHAPES — see the panel. */}
              <span className="sa-ticker__title">{item.title}</span>
              {item.description || item.date || item.linkLabel ? (
                <span className="sa-ticker__description">
                  {item.description}
                  {item.description && item.date ? <span aria-hidden="true"> · </span> : null}
                  {item.date ? <time dateTime={item.dateTime}>{item.date}</time> : null}
                  {item.linkLabel ? (
                    <> <span className="sa-ticker__more">{item.linkLabel}</span></>
                  ) : null}
                </span>
              ) : null}
            </ItemLink>
          </div>
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
    </section>
  );
}
