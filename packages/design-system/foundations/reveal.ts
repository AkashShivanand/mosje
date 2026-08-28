"use client";

import * as React from "react";
import "./reveal.css";

/**
 * Reveal blocks as they reach the viewport.
 *
 * Point the ref at a container, mark the blocks inside it with
 * `data-sa-reveal`, and each one moves and fades in the first time it enters
 * the viewport. It is the page-template motion for anything long and
 * data-heavy — a dashboard, a report, a list of cards — where the reader's
 * problem is knowing where one section ends and the next begins.
 *
 * ```tsx
 * const root = React.useRef<HTMLElement>(null);
 * useScrollReveal(root);
 * return (
 *   <section ref={root}>
 *     <Card data-sa-reveal>…</Card>
 *   </section>
 * );
 * ```
 *
 * THREE THINGS THIS DELIBERATELY DOES, AND WHY
 *
 * 1. **It sets `data-sa-reveal-root` itself, on mount.** The stylesheet hides
 *    nothing until that attribute exists, so a page whose JavaScript never runs
 *    is a page with no motion and no hidden content — rather than a page of
 *    invisible figures. Never add the attribute in markup.
 *
 * 2. **It reveals once and stops observing.** A block that fades back out when
 *    the reader scrolls up is a block that has to be re-read, and re-reading a
 *    number is exactly what a government page must not ask for.
 *
 * 3. **It is an observer, not a scroll-linked timeline.** `animation-timeline:
 *    view()` ties progress to scroll POSITION, so a range can rest at a third
 *    complete for as long as the reader leaves it — a permanently half-faded
 *    card. An observer only decides when to start; the transition then runs to
 *    completion on its own clock. That difference is what makes fading safe.
 *
 * Respects `prefers-reduced-motion`, and degrades to "everything visible" where
 * `IntersectionObserver` is missing.
 *
 * @param root Container whose `[data-sa-reveal]` descendants should reveal.
 * @param options.rootMargin Bottom inset before a block counts as arrived.
 *   Negative values make it wait until the block is properly on screen.
 * @param options.stagger Milliseconds between siblings revealed in the same
 *   batch, written to `--sa-reveal-delay`. 0 reveals them together.
 */
export function useScrollReveal(
  root: React.RefObject<HTMLElement | null>,
  options: { rootMargin?: string; stagger?: number } = {},
): void {
  const { rootMargin = "0px 0px -12% 0px", stagger = 70 } = options;

  React.useEffect(() => {
    const el = root.current;
    if (!el) return;

    const targets = Array.from(el.querySelectorAll<HTMLElement>("[data-sa-reveal]"));
    if (targets.length === 0) return;

    const reveal = (node: HTMLElement, delay: number) => {
      if (delay > 0) node.style.setProperty("--sa-reveal-delay", `${delay}ms`);
      node.setAttribute("data-sa-revealed", "");
    };

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // No observer, or motion turned off: show everything at once and never
    // arm the hidden state. Both paths must end with the content on screen.
    if (reduced || typeof IntersectionObserver === "undefined") {
      targets.forEach((t) => reveal(t, 0));
      el.setAttribute("data-sa-reveal-root", "");
      return;
    }

    el.setAttribute("data-sa-reveal-root", "");

    const observer = new IntersectionObserver(
      (entries) => {
        // Entries arriving together are one batch and get the stagger; the
        // index is per-callback, so a card scrolled to on its own never waits.
        let n = 0;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal(entry.target as HTMLElement, n * stagger);
          observer.unobserve(entry.target);
          n += 1;
        }
      },
      { rootMargin, threshold: 0.01 },
    );

    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [root, rootMargin, stagger]);
}
