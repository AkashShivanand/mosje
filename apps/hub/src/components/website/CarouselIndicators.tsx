"use client";

import * as React from "react";
import { cn } from "@/lib/website/utils";

import "./carousel-indicators.css";

export interface CarouselIndicatorsProps {
  /** How many slides the carousel has. */
  count: number;
  /** Zero-based index of the slide currently shown. */
  activeIndex: number;
  /**
   * Jump to a slide. Omit it and the indicators render as presentation only —
   * which is the honest thing to do when the carousel offers no other way to
   * reach a specific slide, rather than shipping buttons that look clickable.
   */
  onSelect?: (index: number) => void;
  /**
   * `md` is the persona-card scale (8px dot, 40px active bar); `sm` is the
   * narrower hero scale (10px dot, 24px active bar).
   * @default "md"
   */
  size?: "sm" | "md";
  /** Accessible name for the group, e.g. "Persona slides". */
  label: string;
  /** Word for one slide, used in each control's accessible name. @default "slide" */
  itemNoun?: string;
  className?: string;
}

/**
 * SAMAVESH CarouselIndicators — the row of dots under a carousel, with the
 * current slide drawn as a bar.
 *
 * **Why it is here and not in @mosje/design-system.** It belongs there — it was
 * hand-written twice already, in `HeroCarousel` and in the persona card, at two
 * different sizes. But a design-system component owes a Figma master, a Code
 * Connect template and a `— Documentation` page (`.claude/rules/figma-code-sync.md`),
 * and none of those can be authored from a session without write access to the
 * SAMAVESH library. A code-only DS export would be a component the Figma half of
 * the system has never heard of, which is the drift those rules exist to stop.
 * So it is shared at the website level for now, and promoting it is a flagged
 * follow-up rather than a silent half-measure.
 *
 * **Deliberate deviation from the Figma spec, and it is an accessibility one.**
 * The design draws 8px dots separated by 8px, which puts the centres 16px
 * apart. WCAG 2.2 AA **2.5.8 Target Size (Minimum)** wants each target to be at
 * least 24×24 CSS px, and its spacing exception does not rescue undersized
 * targets whose 24px circles intersect — at a 16px pitch they do. So each
 * control here carries a transparent 24×24 hit area and the dots sit 24px
 * apart, while the painted dot keeps the size the design asked for. The
 * indicators read as designed and can still be hit by an unsteady hand.
 * (`.claude/rules/standards-precedence.md`: accessibility is never traded.)
 */
export function CarouselIndicators({
  count,
  activeIndex,
  onSelect,
  size = "md",
  label,
  itemNoun = "slide",
  className,
}: CarouselIndicatorsProps) {
  const items = Array.from({ length: count }, (_, i) => i);

  if (!onSelect) {
    return (
      <div
        className={cn("sa-carousel-indicators", `sa-carousel-indicators--${size}`, className)}
        aria-hidden="true"
      >
        {items.map((i) => (
          <span
            key={i}
            className="sa-carousel-indicators__dot"
            data-active={i === activeIndex || undefined}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn("sa-carousel-indicators", `sa-carousel-indicators--${size}`, className)}
      role="group"
      aria-label={label}
    >
      {items.map((i) => (
        <button
          key={i}
          type="button"
          className="sa-carousel-indicators__button"
          aria-label={`Go to ${itemNoun} ${i + 1} of ${count}`}
          aria-current={i === activeIndex ? "true" : undefined}
          onClick={() => onSelect(i)}
        >
          <span className="sa-carousel-indicators__dot" data-active={i === activeIndex || undefined} />
        </button>
      ))}
    </div>
  );
}
