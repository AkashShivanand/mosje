"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { Icon } from "../utilities/icon";
import "./ticker.css";

export interface TickerItem {
  /** Stable key. Falls back to the index when absent. */
  id?: string;
  /** The headline line. One clause — it is clipped, not wrapped. */
  title: string;
  /** The sentence under it. Optional: without it the strip runs single-line. */
  description?: string;
  /** Where the item goes. */
  href: string;
  /**
   * Trailing call to action inside the sentence — the frame's "Learn More".
   * Rendered only when there is a `description` to append it to.
   */
  linkLabel?: string;
}

export interface TickerProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** The messages to cycle. An empty list renders nothing at all. */
  items: TickerItem[];
  /**
   * The strip's name, on the plinth and as the section's accessible name.
   * @default "Latest Updates"
   */
  label?: string;
  /**
   * The mark on the white tile. Defaults to the Material Symbols megaphone.
   * Pass a `next/image` when a site has its own artwork for it.
   */
  icon?: React.ReactNode;
  /**
   * The way out of the strip — "View All Updates". A slot, because it is a
   * route the consuming site owns. Use `buttonClasses("primary",
   * "inverseOutlined", "sm")`; the strip is a solid brand surface, so a normal
   * outlined button would draw its border in a blue nobody can see.
   */
  action?: React.ReactNode;
  /** Milliseconds each item holds. @default 5000 */
  interval?: number;
  /** Start advancing on mount. @default true */
  autoplay?: boolean;
  /** Router-aware link for internal hrefs — pass `next/link`. @default "a" */
  linkAs?: React.ElementType;
}

/**
 * Ticker — the full-bleed announcement strip under the masthead.
 *
 * ── WHAT IT IS ────────────────────────────────────────────────────────────
 * A named plinth, one message at a time, and the controls to move through
 * them. STRUCTURAL, NOT CONTENT-BOUND: every string, href and route arrives as
 * a prop, so the DoSJE website's notices and a portal's scheme alerts are the
 * same component with different data.
 *
 * ── THE THREE RULES THAT ARE EASY TO BREAK ────────────────────────────────
 *
 * 1. **A strip that moves on its own must be stoppable.** The pause control is
 *    not decoration and not optional — WCAG 2.2.2 requires a mechanism to stop
 *    any motion that starts automatically and runs more than five seconds, and
 *    prev/next do not satisfy it. It is the only control that survives every
 *    breakpoint. Do not hide it to win space.
 *
 * 2. **Reduced motion means it does not advance, not that it advances without
 *    a transition.** Suppressing only the animation leaves the message
 *    replacing itself every few seconds, which is the part that hurts. The
 *    timer never starts under `prefers-reduced-motion`, and the citizen steps
 *    through with the arrows instead.
 *
 * 3. **The live region is `off` while it is playing.** An auto-rotating region
 *    set to `polite` interrupts a screen-reader user every interval with text
 *    they did not ask for. Pausing is what signals intent, so pausing is what
 *    turns announcements on — the APG carousel behaviour.
 *
 * ── ANATOMY ───────────────────────────────────────────────────────────────
 * ```tsx
 * <Ticker
 *   items={updates}
 *   linkAs={Link}
 *   action={<Link href="/notices" className={buttonClasses("primary", "inverseOutlined", "sm")}>View All Updates</Link>}
 * />
 * ```
 *
 * Source of truth: Figma SAMAVESH › Ticker (recreated from MoSJE Handoff ›
 * Latest Updates, 8137:48790). The three deliberate divergences from that
 * frame — the hugging plinth, the added pause control, the 1px tile border —
 * are argued in `ticker.css`.
 */
export function Ticker({
  items,
  label = "Latest Updates",
  icon,
  action,
  interval = 5000,
  autoplay = true,
  linkAs,
  className,
  ...rest
}: TickerProps): React.JSX.Element | null {
  const [index, setIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(autoplay);
  const count = items.length;

  // A shrinking list must not strand the index past the end.
  const safeIndex = count > 0 ? index % count : 0;

  const go = React.useCallback(
    (next: number) => {
      if (count === 0) return;
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  React.useEffect(() => {
    if (!isPlaying || count < 2) return;
    // Rule 2: no timer at all under reduced motion — not a timer with the
    // transition suppressed, which still snaps the text every interval.
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const id = window.setInterval(() => setIndex((i) => (i + 1) % count), interval);
    return () => window.clearInterval(id);
  }, [count, interval, isPlaying]);

  if (count === 0) return null;

  const item = items[safeIndex];
  if (!item) return null;

  const ItemLink = (linkAs ?? "a") as React.ElementType;

  return (
    <section {...rest} className={cn("sa-ticker", className)} aria-label={label} aria-roledescription="carousel">
      <div className="sa-ticker__container">
        <div className="sa-ticker__heading">
          <span className="sa-ticker__mark" aria-hidden="true">
            {icon ?? <Icon name="campaign" size={24} aria-hidden />}
          </span>
          <span className="sa-ticker__label">{label}</span>
        </div>

        <div className="sa-ticker__body">
          {/* Rule 3. `off` while running, `polite` once the citizen has stopped
              it — pausing is the act that says "read this to me". */}
          <div
            className="sa-ticker__viewport"
            aria-live={isPlaying ? "off" : "polite"}
            aria-atomic="true"
          >
            <ItemLink
              key={item.id ?? safeIndex}
              href={item.href}
              className="sa-ticker__item"
            >
              <span className="sa-ticker__title">{item.title}</span>
              {item.description ? (
                <span className="sa-ticker__description">
                  {item.description}
                  {item.linkLabel ? <> <span className="sa-ticker__more">{item.linkLabel}</span></> : null}
                </span>
              ) : null}
            </ItemLink>
          </div>

          <div className="sa-ticker__nav">
            <button
              type="button"
              className="sa-ticker__control"
              onClick={() => setIsPlaying((p) => !p)}
              aria-label={isPlaying ? `Pause ${label}` : `Play ${label}`}
            >
              <Icon name={isPlaying ? "pause" : "play_arrow"} size={24} aria-hidden />
            </button>
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

          {action ? <div className="sa-ticker__action">{action}</div> : null}
        </div>
      </div>
    </section>
  );
}
